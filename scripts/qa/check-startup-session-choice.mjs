import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_STARTUP_SESSION_HTML || 'index.html', 'utf8');
const behavioralHarness = readFileSync('scripts/qa/test-startup-session-choice.mjs', 'utf8');
const webkitSmoke = readFileSync('tests/smoke/app.spec.mjs', 'utf8');
const fail = (message) => { throw new Error(`Startup session choice guardrail failed: ${message}`); };
const requireSource = (fragment, label) => { if (!html.includes(fragment)) fail(`${label} not found.`); };

for (const [fragment, label] of [
  ['Continuar sessão anterior?', 'dialog title'],
  ['Encontramos um projeto que estava aberto anteriormente.', 'dialog description'],
  ['Continuar de onde parei', 'continue action'],
  ['Recupera o projeto no estado em que você deixou.', 'continue helper'],
  ['Começar novo projeto', 'discard action'],
  ['Descarta a sessão automática anterior e volta ao início.', 'discard helper'],
  ['Recuperando sessão…', 'continue busy feedback'],
  ['Preparando novo projeto…', 'discard busy feedback'],
  ['async function inspectStartupSessionCheckpoint()', 'checkpoint inspection'],
  ['function openStartupRecoveryDialog(checkpoint)', 'dedicated dialog controller'],
  ['function closeStartupRecoveryDialog(choice)', 'choice-only close controller'],
  ['async function continuePreviousSession()', 'continue controller'],
  ['async function discardPreviousSessionAndOpenLauncher()', 'discard controller'],
  ['async function handleNormalAppStartup()', 'startup authority'],
  ['await handleNormalAppStartup();', 'awaited startup'],
  ['const cleared = await clearSessionAutosave();', 'awaited checkpoint clear'],
  ["if (reloadStartupIntent === 'restore' || reloadStartupIntent === 'clean')", 'explicit E8H priority'],
  ['await applyReloadStartupIntent(reloadStartupIntent);', 'explicit E8H routing'],
  ['openStartupRecoveryDialog(inspection.checkpoint);', 'dialog after valid inspection'],
]) requireSource(fragment, label);
if (!/(?:const\s+)?restored\s*=\s*await restoreLastSessionAutosave\(_startupRecoveryCheckpoint\)/.test(html)) {
  fail('restore after continue choice not found.');
}

for (const name of [
  'startupRecoveryCheckpointInspectionAttempted', 'startupRecoveryCheckpointFound',
  'startupRecoveryCheckpointValid', 'startupRecoveryCheckpointInvalidReason',
  'startupRecoveryDialogShown', 'startupRecoveryDialogDismissedWithoutChoice',
  'startupRecoveryChoice', 'startupRecoveryOperationInProgress',
  'startupRecoveryDuplicateActionBlocked', 'startupRecoveryRestoreAttempted',
  'startupRecoveryRestoreCompleted', 'startupRecoveryRestoreFailed',
  'startupRecoveryClearAttempted', 'startupRecoveryClearCompleted',
  'startupRecoveryClearFailed', 'startupRecoveryOpenedCleanLauncher',
  'startupRecoveryEditorOpened', 'startupRecoveryProjectAppliedBeforeChoice',
  'startupRecoveryHydrationStartedBeforeChoice', 'startupRecoveryBypassed',
  'startupRecoveryBypassReason', 'startupRecoveryExplicitReloadIntent',
  'startupRecoverySameLiveInstanceResume', 'startupRecoveryNoCheckpoint',
  'startupRecoveryInvalidCheckpointHandledSafely',
  'startupRecoveryBusyVisible', 'startupRecoveryBusyAction',
  'startupRecoveryBusyClearedAfterFailure', 'startupRecoveryBusyClearedAfterSuccess',
]) requireSource(`push('${name}'`, `protected diagnostic ${name}`);

const dialogMatch = html.match(/<div id="startupRecoveryDialog"[\s\S]*?<\/div>\s*<\/div>/);
if (!dialogMatch) fail('dedicated dialog markup missing.');
if (/startupRecovery[^"']*(?:Close|Cancel)/i.test(dialogMatch[0]) || /aria-label="Fechar"/.test(dialogMatch[0])) fail('dialog exposes a close action.');
if (/startupRecoveryDialog[^\n]*addEventListener\(['"]click/.test(html)) fail('backdrop click close is wired.');
if (/Escape[^\n]*closeStartupRecoveryDialog|closeStartupRecoveryDialog[^\n]*Escape/.test(html)) fail('Escape close is wired.');
if (/function handleNormalAppStartup\([\s\S]*?\n}\s*function consumeReloadStartupIntent/.test(html)) {
  const startup = html.match(/async function handleNormalAppStartup\([\s\S]*?\n}\s*function consumeReloadStartupIntent/)[0];
  if (startup.includes('restoreLastSessionAutosave(')) fail('normal startup restores without a user decision.');
  if (startup.includes('applyProjectData(') || startup.includes('prehydrateCompleteSession(')) fail('normal startup applies or hydrates before a choice.');
}
const discardController = html.match(/async function discardPreviousSessionAndOpenLauncher\([\s\S]*?async function handleNormalAppStartup/);
if (!discardController || !/await clearSessionAutosave\(\)/.test(discardController[0])) fail('startup discard does not await checkpoint clear.');
if (behavioralHarness.includes('createController(')) fail('behavioral harness reimplements a parallel startup controller.');
for (const name of ['inspectStartupSessionCheckpoint', 'setStartupRecoveryBusy', 'showStartupRecoveryError',
  'openStartupRecoveryDialog', 'closeStartupRecoveryDialog', 'returnStartupRecoveryToLauncher',
  'continuePreviousSession', 'discardPreviousSessionAndOpenLauncher', 'handleNormalAppStartup',
  'consumeReloadStartupIntent', 'applyReloadStartupIntent']) {
  if (!behavioralHarness.includes(`extractFunction('${name}')`)) fail(`behavioral harness does not execute real ${name}.`);
}
if (webkitSmoke.includes('openStartupRecoveryDialog({ complete: true })')) fail('WebKit opens the recovery modal directly instead of exercising startup.');
for (const fragment of ['indexedDB.deleteDatabase', 'SESSION_AUTOSAVE_STORE', 'SESSION_AUTOSAVE_KEY',
  'SESSION_AUTOSAVE_SCHEMA', 'sessionPayloadChecksum(payload)', 'isCompleteSessionProjectData(data)']) {
  if (!webkitSmoke.includes(fragment)) fail(`WebKit real checkpoint coverage missing ${fragment}.`);
}

console.log('Startup session choice guardrail passed.');
