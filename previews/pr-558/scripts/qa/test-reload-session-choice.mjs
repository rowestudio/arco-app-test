import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(process.env.QA_RELOAD_CHOICE_HTML || 'index.html', 'utf8');

function extractFunction(name) {
  const asyncStart = html.indexOf(`async function ${name}(`);
  const start = asyncStart >= 0 ? asyncStart : html.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Reload behavioral harness: function ${name} not found.`);
  const brace = html.indexOf('{', start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = brace; index < html.length; index++) {
    const char = html[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') { quote = char; continue; }
    if (char === '{') depth++;
    if (char === '}' && --depth === 0) return html.slice(start, index + 1);
  }
  throw new Error(`Reload behavioral harness: function ${name} is incomplete.`);
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function createHarness() {
  const storage = new Map();
  const observations = { reloads: 0, errors: [], busy: [], restarting: [], restores: 0 };
  const context = vm.createContext({
    console,
    RELOAD_STARTUP_INTENT_KEY: 'arco-motion-reload-intent-test',
    sessionStorage: {
      setItem(key, value) { storage.set(key, String(value)); },
      getItem(key) { return storage.has(key) ? storage.get(key) : null; },
      removeItem(key) { storage.delete(key); },
    },
    window: { location: { reload() { observations.reloads++; } } },
    setReloadChoiceBusy(value) { observations.busy.push(value); },
    setReloadRestartingVisible(value) { observations.restarting.push(value); },
    showReloadChoiceError(message) { observations.errors.push(message); },
    updateReloadStartupUiDiagnostics() {},
    restoreLastSessionAutosave() { observations.restores++; },
  });
  vm.runInContext(`
    var reloadOperationInProgress = false;
    var reloadDuplicateActionBlocked = false;
    var reloadChoiceSelected = 'none';
    var reloadSessionCheckpointClearAttempted = false;
    var reloadSessionCheckpointCleared = false;
    var reloadSessionCheckpointClearFailed = false;
    var reloadSessionFlushAttempted = false;
    var reloadSessionFlushCompleted = false;
    var reloadSessionFlushFailed = false;
    var reloadStartupIntentWritten = false;
    var reloadStartupIntentConsumed = false;
    var reloadExpectedCleanLauncher = false;
    var reloadExpectedRestore = false;
    var _sessionAutosaveSuppressSafetyFlush = false;
    var flushSessionAutosaveForReload = async () => true;
    var clearSessionAutosave = async () => true;
    var invalidateSessionRestore = () => {};
    ${extractFunction('consumeReloadStartupIntent')}
    ${extractFunction('applyReloadStartupIntent')}
    ${extractFunction('writeReloadStartupIntent')}
    ${extractFunction('finishReloadOperationWithError')}
    ${extractFunction('executeReloadAfterCompletedOperation')}
    ${extractFunction('reloadAndRestoreSession')}
    ${extractFunction('reloadFromCleanState')}
  `, context);
  return { context, observations, storage };
}

// Caso 1 — Restore só grava intenção/recarrega depois do flush concluído.
{
  const { context, observations, storage } = createHarness();
  const gate = deferred();
  context.flushSessionAutosaveForReload = () => gate.promise;
  const operation = context.reloadAndRestoreSession();
  await Promise.resolve();
  assert.equal(storage.size, 0);
  assert.equal(observations.reloads, 0);
  gate.resolve(true);
  await operation;
  assert.equal(storage.get(context.RELOAD_STARTUP_INTENT_KEY), 'restore');
  assert.equal(observations.reloads, 1);
}

// Caso 2 — Falha de flush não cria intenção/reload e libera retry com erro controlado.
{
  const { context, observations, storage } = createHarness();
  context.flushSessionAutosaveForReload = async () => false;
  await context.reloadAndRestoreSession();
  assert.equal(storage.size, 0);
  assert.equal(observations.reloads, 0);
  assert.equal(context.reloadOperationInProgress, false);
  assert.equal(observations.busy.at(-1), false);
  assert.match(observations.errors.at(-1), /proteger a sessão/);
}

// Caso 3 — Clean só grava intenção/recarrega depois do clear concluído.
{
  const { context, observations, storage } = createHarness();
  const gate = deferred();
  context.clearSessionAutosave = () => gate.promise;
  const operation = context.reloadFromCleanState();
  await Promise.resolve();
  assert.equal(storage.size, 0);
  assert.equal(observations.reloads, 0);
  gate.resolve(true);
  await operation;
  assert.equal(storage.get(context.RELOAD_STARTUP_INTENT_KEY), 'clean');
  assert.equal(observations.reloads, 1);
}

// Caso 4 — Falha de clear não cria intenção/reload e libera a interface.
{
  const { context, observations, storage } = createHarness();
  context.clearSessionAutosave = async () => false;
  await context.reloadFromCleanState();
  assert.equal(storage.size, 0);
  assert.equal(observations.reloads, 0);
  assert.equal(context.reloadOperationInProgress, false);
  assert.equal(observations.busy.at(-1), false);
  assert.match(observations.errors.at(-1), /limpar a sessão automática/);
}

// Caso 5 — Segundo toque não inicia uma segunda operação.
{
  const { context, observations } = createHarness();
  const gate = deferred();
  let flushCalls = 0;
  context.flushSessionAutosaveForReload = () => { flushCalls++; return gate.promise; };
  const first = context.reloadAndRestoreSession();
  await context.reloadAndRestoreSession();
  assert.equal(flushCalls, 1);
  assert.equal(context.reloadDuplicateActionBlocked, true);
  gate.resolve(true);
  await first;
  assert.equal(observations.reloads, 1);
}

// Caso 6 — A intenção persiste até o primeiro consumo e depois retorna null.
{
  const { context } = createHarness();
  assert.equal(context.writeReloadStartupIntent('clean'), true);
  assert.equal(context.consumeReloadStartupIntent(), 'clean');
  assert.equal(context.consumeReloadStartupIntent(), null);
}

// Casos 7 e 8 — Clean não restaura; restore restaura exatamente uma vez.
{
  const clean = createHarness();
  clean.context.applyReloadStartupIntent('clean');
  assert.equal(clean.observations.restores, 0);
  const restore = createHarness();
  restore.context.applyReloadStartupIntent('restore');
  assert.equal(restore.observations.restores, 1);
}

console.log('Reload session choice behavioral harness passed: 8/8 cases.');
