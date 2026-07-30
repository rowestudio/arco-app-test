import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_RELOAD_CHOICE_HTML || 'index.html', 'utf8');
const fail = (message) => { throw new Error(`Reload session choice guardrail failed: ${message}`); };
const requireSource = (fragment, label) => { if (!html.includes(fragment)) fail(`${label} not found.`); };

for (const [fragment, label] of [
  ['Como deseja recarregar?', 'dialog title'],
  ['Reiniciar e restaurar sessão', 'restore action'],
  ['Reabre o projeto no estado atual.', 'restore helper'],
  ['Reiniciar do zero', 'clean action'],
  ['Limpa a sessão automática e volta ao início.', 'clean helper'],
  ['async function flushSessionAutosaveForReload()', 'awaitable reload flush'],
  ['const completed = await flushSessionAutosaveForReload();', 'awaited reload flush call'],
  ['const cleared = await clearSessionAutosave();', 'awaited checkpoint clear'],
  ["sessionStorage.setItem(RELOAD_STARTUP_INTENT_KEY, intent);", 'isolated startup intent write'],
  ['const reloadStartupIntent = consumeReloadStartupIntent();', 'startup intent consumption'],
  ["if (reloadStartupIntent === 'clean')", 'clean startup restore bypass'],
  ["executeReloadAfterCompletedOperation('restore');", 'restore reload after completion'],
  ["executeReloadAfterCompletedOperation('clean');", 'clean reload after completion'],
  ['setReloadRestartingVisible(true);', 'stable restarting layer'],
]) requireSource(fragment, label);

for (const name of [
  'reloadChoiceDialogOpened', 'reloadChoiceDialogCancelled', 'reloadChoiceSelected',
  'reloadOperationInProgress', 'reloadDuplicateActionBlocked', 'reloadSessionFlushAttempted',
  'reloadSessionFlushCompleted', 'reloadSessionFlushFailed', 'reloadSessionCheckpointClearAttempted',
  'reloadSessionCheckpointCleared', 'reloadSessionCheckpointClearFailed', 'reloadStartupIntentWritten',
  'reloadStartupIntentConsumed', 'reloadExpectedRestore', 'reloadExpectedCleanLauncher',
  'reloadRestoreCompleted', 'reloadOpenedCleanLauncher', 'reloadRawHtmlDetected',
  'reloadWhiteScreenDetected',
]) requireSource(`push('${name}'`, `protected diagnostic ${name}`);

if (/onclick\s*=\s*["'][^"']*(?:window\.)?location\.reload\s*\(/i.test(html)) {
  fail('direct location.reload remains in HTML onclick.');
}
if (/flushSessionAutosave\(\)\s*;\s*(?:window\.)?location\.reload\s*\(/.test(html)) {
  fail('unawaited flush followed by reload remains.');
}

console.log('Reload session choice guardrail passed.');
