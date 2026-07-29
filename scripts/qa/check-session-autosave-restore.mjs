import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_SESSION_AUTOSAVE_HTML || 'index.html', 'utf8');
const fail = (message) => { throw new Error(`Session autosave/restore guardrail failed: ${message}`); };
const requireSource = (fragment, label) => { if (!html.includes(fragment)) fail(`${label} not found.`); };

for (const [fragment, label] of [
  ["const SESSION_AUTOSAVE_DB = 'arco-motion-session';", 'independent IndexedDB database'],
  ['const data = buildProjectData(true);', 'canonical complete serializer reuse'],
  ['data.assetsImagesIncluded = true;', 'complete asset checkpoint marker'],
  ['isCompleteSessionProjectData(data)', 'complete checkpoint validation'],
  ['checkpoint.checksum !== sessionPayloadChecksum(checkpoint.payload)', 'checkpoint integrity validation'],
  ["applyProjectData(data, { origin: 'session-autosave' });", 'official hydration pipeline reuse'],
  ["document.addEventListener('visibilitychange'", 'visibility flush'],
  ["window.addEventListener('pagehide', flushSessionAutosave);", 'pagehide flush'],
  ["sessionAutosaveOnProjectApplied(loadOptions.origin || 'manual-load', data);", 'manual load precedence hook'],
  ["const sessionClearPromise = clearSessionAutosave();", 'new project session clear'],
  ["Promise.resolve(sessionClearPromise).finally(() => scheduleSessionAutosave('new-project-created', true));", 'new project checkpoint replacement'],
]) requireSource(fragment, label);

const requiredDiagnostics = [
  'sessionAutosaveEnabled', 'sessionAutosaveCompleted', 'sessionAutosaveFailed',
  'sessionAutosaveRevision', 'sessionAutosavePayloadBytes', 'sessionRestoreAttempted',
  'sessionRestoreCompleted', 'sessionRestoreFailed', 'sessionRestoreAssetCount',
  'sessionRestoreHydratedAssetCount', 'sessionRestoreLayerIdentitiesPreserved',
  'sessionRestoreProjectWorldRestored', 'sessionRestoreNoPartialState',
  'sessionRestoreDidNotOverrideManualLoad',
];
for (const name of requiredDiagnostics) requireSource(`push('${name}'`, `diagnostic ${name}`);

if (/localStorage\.(?:setItem|getItem)\([^\n]*session/i.test(html)) fail('session persistence fell back to localStorage.');
if (!html.includes("revision < _sessionAutosaveQueuedRevision")) fail('stale revision write guard not found.');

console.log('Session autosave/restore guardrail passed.');
