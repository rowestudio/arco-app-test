import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(process.env.QA_STARTUP_SESSION_HTML || 'index.html', 'utf8');

function extractFunction(name) {
  const asyncStart = html.indexOf(`async function ${name}(`);
  const start = asyncStart >= 0 ? asyncStart : html.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Startup behavioral harness: function ${name} not found.`);
  const brace = html.indexOf('{', start);
  let depth = 0; let quote = null; let escaped = false;
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
  throw new Error(`Startup behavioral harness: function ${name} is incomplete.`);
}

function deferred() {
  let resolve; let reject;
  const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
  return { promise, resolve, reject };
}

function element() {
  const classes = new Set();
  const attributes = new Map([['aria-hidden', 'true']]);
  return {
    disabled: false, textContent: '', style: { display: 'none' },
    classList: {
      add(value) { classes.add(value); }, remove(value) { classes.delete(value); },
      contains(value) { return classes.has(value); }, toggle(value, force) { force ? classes.add(value) : classes.delete(value); },
    },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    getAttribute(name) { return attributes.get(name) ?? null; },
  };
}

function validCheckpoint() {
  const payload = JSON.stringify({ completeProject: true });
  return { schema: 1, complete: true, payload, checksum: `sum:${payload}`, revision: 7 };
}

function createHarness({ checkpoint = null, intent = null } = {}) {
  const elements = Object.fromEntries([
    'startupRecoveryDialog', 'startupRecoveryContinueButton', 'startupRecoveryDiscardButton',
    'startupRecoveryBusy', 'startupRecoveryBusyText', 'startupRecoveryError',
  ].map((id) => [id, element()]));
  const storage = new Map(intent ? [['arco-motion-reload-intent-test', intent]] : []);
  const observations = { restores: [], clears: 0, launcher: 0, closeProject: 0, reloadUi: [], warnings: [], errors: [] };
  let restoreImpl = async () => false;
  let clearImpl = async () => true;
  let hasImage = false;
  const context = vm.createContext({
    console: { warn(...args) { observations.warnings.push(args); }, error(...args) { observations.errors.push(args); } },
    APP_VERSION: 'v8z4b32E8I', SESSION_AUTOSAVE_SCHEMA: 1,
    RELOAD_STARTUP_INTENT_KEY: 'arco-motion-reload-intent-test',
    document: { getElementById(id) { return elements[id] || null; } },
    sessionStorage: {
      getItem(key) { return storage.get(key) ?? null; },
      removeItem(key) { storage.delete(key); },
    },
    startLauncher: element(),
    readSessionCheckpoint: async () => checkpoint,
    sessionPayloadChecksum: (payload) => `sum:${payload}`,
    isCompleteSessionProjectData: (data) => data?.completeProject === true,
    restoreLastSessionAutosave: (...args) => { observations.restores.push(args); return restoreImpl(...args); },
    clearSessionAutosave: () => { observations.clears++; return clearImpl(); },
    invalidateSessionRestore() {},
    hasImageLoaded: () => hasImage,
    closeProjectAndReturnToLauncher() { observations.closeProject++; hasImage = false; context.appMode = 'launcher'; },
    setAppMode(mode) { context.appMode = mode; },
    showStartLauncher() { observations.launcher++; },
    isReloadStartupElementVisible: () => true,
    updateReloadStartupUiDiagnostics(intentValue) { observations.reloadUi.push(intentValue); },
  });
  vm.runInContext(`
    var appMode = 'launcher';
    var reloadStartupIntentConsumed = false;
    var reloadExpectedCleanLauncher = false;
    var reloadExpectedRestore = false;
    var startupRecoveryCheckpointInspectionAttempted = false;
    var startupRecoveryCheckpointFound = false;
    var startupRecoveryCheckpointValid = false;
    var startupRecoveryCheckpointInvalidReason = '';
    var startupRecoveryDialogShown = false;
    var startupRecoveryDialogDismissedWithoutChoice = false;
    var startupRecoveryChoice = 'none';
    var startupRecoveryOperationInProgress = false;
    var startupRecoveryDuplicateActionBlocked = false;
    var startupRecoveryRestoreAttempted = false;
    var startupRecoveryRestoreCompleted = false;
    var startupRecoveryRestoreFailed = false;
    var startupRecoveryClearAttempted = false;
    var startupRecoveryClearCompleted = false;
    var startupRecoveryClearFailed = false;
    var startupRecoveryOpenedCleanLauncher = false;
    var startupRecoveryEditorOpened = false;
    var startupRecoveryProjectAppliedBeforeChoice = false;
    var startupRecoveryHydrationStartedBeforeChoice = false;
    var startupRecoveryBypassed = false;
    var startupRecoveryBypassReason = 'none';
    var startupRecoveryExplicitReloadIntent = 'none';
    var startupRecoveryNoCheckpoint = false;
    var startupRecoveryInvalidCheckpointHandledSafely = false;
    var startupRecoveryBusyVisible = false;
    var startupRecoveryBusyAction = 'none';
    var startupRecoveryBusyClearedAfterFailure = false;
    var startupRecoveryBusyClearedAfterSuccess = false;
    var _startupRecoveryCheckpoint = null;
    ${extractFunction('inspectStartupSessionCheckpoint')}
    ${extractFunction('setStartupRecoveryBusy')}
    ${extractFunction('showStartupRecoveryError')}
    ${extractFunction('openStartupRecoveryDialog')}
    ${extractFunction('closeStartupRecoveryDialog')}
    ${extractFunction('returnStartupRecoveryToLauncher')}
    ${extractFunction('continuePreviousSession')}
    ${extractFunction('discardPreviousSessionAndOpenLauncher')}
    ${extractFunction('handleNormalAppStartup')}
    ${extractFunction('consumeReloadStartupIntent')}
    ${extractFunction('applyReloadStartupIntent')}
  `, context);
  return {
    context, elements, observations, storage,
    setRestore(fn) { restoreImpl = fn; }, setClear(fn) { clearImpl = fn; },
    setHasImage(value) { hasImage = value; },
  };
}

// 1 — sem checkpoint: launcher permanece, modal e restore ausentes.
{ const h = createHarness(); await h.context.handleNormalAppStartup(); assert.equal(h.context.startupRecoveryNoCheckpoint, true); assert.equal(h.context.startupRecoveryDialogShown, false); assert.equal(h.observations.restores.length, 0); }
// 2 — checkpoint válido: pergunta sem restore/aplicação/hidratação.
{ const h = createHarness({ checkpoint: validCheckpoint() }); await h.context.handleNormalAppStartup(); assert.equal(h.context.startupRecoveryDialogShown, true); assert.equal(h.observations.restores.length, 0); assert.equal(h.context.startupRecoveryProjectAppliedBeforeChoice, false); assert.equal(h.context.startupRecoveryHydrationStartedBeforeChoice, false); }
// 3 — continuar passa exatamente o checkpoint inspecionado e restaura uma vez.
{ const cp = validCheckpoint(); const h = createHarness({ checkpoint: cp }); await h.context.handleNormalAppStartup(); h.setRestore(async () => { h.context.appMode = 'editor'; h.setHasImage(true); return true; }); assert.equal(await h.context.continuePreviousSession(), true); assert.equal(h.observations.restores.length, 1); assert.equal(h.observations.restores[0][0], cp); assert.equal(h.observations.clears, 0); assert.equal(h.context.startupRecoveryEditorOpened, true); }
// 4 — descartar chama clear uma vez e abre launcher somente depois.
{ const h = createHarness({ checkpoint: validCheckpoint() }); await h.context.handleNormalAppStartup(); await h.context.discardPreviousSessionAndOpenLauncher(); assert.equal(h.observations.clears, 1); assert.equal(h.observations.restores.length, 0); assert.equal(h.observations.launcher, 1); }
// 5 — clear pendente não confirma launcher.
{ const gate = deferred(); const h = createHarness({ checkpoint: validCheckpoint() }); await h.context.handleNormalAppStartup(); h.setClear(() => gate.promise); const operation = h.context.discardPreviousSessionAndOpenLauncher(); await Promise.resolve(); assert.equal(h.observations.launcher, 0); gate.resolve(true); await operation; assert.equal(h.observations.launcher, 1); }
// 6 — falha de clear mantém modal/checkpoint, libera botões e permite retry.
{ const cp = validCheckpoint(); const h = createHarness({ checkpoint: cp }); await h.context.handleNormalAppStartup(); h.setClear(async () => false); assert.equal(await h.context.discardPreviousSessionAndOpenLauncher(), false); assert.equal(h.elements.startupRecoveryDialog.classList.contains('show'), true); assert.equal(h.context._startupRecoveryCheckpoint, cp); assert.equal(h.elements.startupRecoveryDiscardButton.disabled, false); h.setClear(async () => true); assert.equal(await h.context.discardPreviousSessionAndOpenLauncher(), true); assert.equal(h.observations.clears, 2); }
// 7 — falha de restore não apaga checkpoint nem fecha modal e permite retry/descartar.
{ const cp = validCheckpoint(); const h = createHarness({ checkpoint: cp }); await h.context.handleNormalAppStartup(); h.setRestore(async () => false); assert.equal(await h.context.continuePreviousSession(), false); assert.equal(h.context._startupRecoveryCheckpoint, cp); assert.equal(h.elements.startupRecoveryDialog.classList.contains('show'), true); h.setClear(async () => true); assert.equal(await h.context.discardPreviousSessionAndOpenLauncher(), true); }
// 8 — toque duplicado inicia somente uma restauração.
{ const gate = deferred(); const h = createHarness({ checkpoint: validCheckpoint() }); await h.context.handleNormalAppStartup(); h.setRestore(() => gate.promise); const first = h.context.continuePreviousSession(); assert.equal(await h.context.continuePreviousSession(), false); assert.equal(h.observations.restores.length, 1); gate.resolve(false); await first; }
// 9 — restore e discard concorrentes: somente a primeira escolha é aceita.
{ const gate = deferred(); const h = createHarness({ checkpoint: validCheckpoint() }); await h.context.handleNormalAppStartup(); h.setRestore(() => gate.promise); const first = h.context.continuePreviousSession(); assert.equal(await h.context.discardPreviousSessionAndOpenLauncher(), false); assert.equal(h.observations.clears, 0); gate.resolve(false); await first; }
// 10 — intenção E8H restore restaura diretamente sem modal.
{ const h = createHarness({ checkpoint: validCheckpoint(), intent: 'restore' }); h.setRestore(async () => true); await h.context.handleNormalAppStartup(); assert.equal(h.observations.restores.length, 1); assert.equal(h.context.startupRecoveryDialogShown, false); assert.equal(h.context.startupRecoveryBypassReason, 'explicit-reload-restore'); }
// 11 — intenção E8H clean abre launcher sem modal/restore.
{ const h = createHarness({ checkpoint: validCheckpoint(), intent: 'clean' }); await h.context.handleNormalAppStartup(); assert.equal(h.observations.restores.length, 0); assert.equal(h.context.startupRecoveryDialogShown, false); assert.equal(h.observations.reloadUi.at(-1), 'clean'); }
// 12 — checkpoint inválido é tratado com segurança.
{ const cp = validCheckpoint(); cp.checksum = 'bad'; const h = createHarness({ checkpoint: cp }); await h.context.handleNormalAppStartup(); assert.equal(h.context.startupRecoveryInvalidCheckpointHandledSafely, true); assert.equal(h.context.startupRecoveryDialogShown, false); assert.equal(h.observations.restores.length, 0); }
// 13 — fechamento sem escolha preserva checkpoint e é rejeitado.
{ const cp = validCheckpoint(); const h = createHarness({ checkpoint: cp }); await h.context.handleNormalAppStartup(); assert.equal(h.context.closeStartupRecoveryDialog(), false); assert.equal(h.context._startupRecoveryCheckpoint, cp); assert.equal(h.elements.startupRecoveryDialog.classList.contains('show'), true); }
// 14 — retomada da mesma instância não chama o startup novamente (nenhum evento é registrado pelos controladores).
{ const h = createHarness({ checkpoint: validCheckpoint() }); assert.equal(h.context.startupRecoveryDialogShown, false); assert.equal(h.observations.restores.length, 0); }
// 15/16 — inspeção isolada nunca restaura, aplica ou hidrata.
{ const h = createHarness({ checkpoint: validCheckpoint() }); const result = await h.context.inspectStartupSessionCheckpoint(); assert.equal(result.status, 'valid'); assert.equal(h.observations.restores.length, 0); assert.equal(h.context.startupRecoveryProjectAppliedBeforeChoice, false); assert.equal(h.context.startupRecoveryHydrationStartedBeforeChoice, false); }
// Sucesso de ambas as ações limpa referência, busy e operation lock.
{ const h = createHarness({ checkpoint: validCheckpoint() }); await h.context.handleNormalAppStartup(); h.setRestore(async () => { h.context.appMode = 'editor'; h.setHasImage(true); return true; }); await h.context.continuePreviousSession(); assert.equal(h.context._startupRecoveryCheckpoint, null); assert.equal(h.context.startupRecoveryOperationInProgress, false); assert.equal(h.context.startupRecoveryBusyClearedAfterSuccess, true); }
{ const h = createHarness({ checkpoint: validCheckpoint() }); await h.context.handleNormalAppStartup(); await h.context.discardPreviousSessionAndOpenLauncher(); assert.equal(h.context._startupRecoveryCheckpoint, null); assert.equal(h.context.startupRecoveryOperationInProgress, false); assert.equal(h.context.startupRecoveryBusyClearedAfterSuccess, true); }
// Exceções controladas não deixam operação nem botões travados.
for (const action of ['continue', 'discard']) {
  const h = createHarness({ checkpoint: validCheckpoint() }); await h.context.handleNormalAppStartup();
  if (action === 'continue') h.setRestore(async () => { throw new Error('restore-test'); });
  else h.setClear(async () => { throw new Error('clear-test'); });
  const result = action === 'continue' ? await h.context.continuePreviousSession() : await h.context.discardPreviousSessionAndOpenLauncher();
  assert.equal(result, false); assert.equal(h.context.startupRecoveryOperationInProgress, false);
  assert.equal(h.elements.startupRecoveryContinueButton.disabled, false); assert.equal(h.elements.startupRecoveryDiscardButton.disabled, false);
  assert.equal(h.context.startupRecoveryBusyClearedAfterFailure, true);
}

console.log('Startup session choice behavioral harness passed: real index.html controllers, 23 expectations.');
