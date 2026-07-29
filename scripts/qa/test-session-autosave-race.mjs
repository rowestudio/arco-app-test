import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const fail = (message) => { throw new Error(`Session autosave race behavior failed: ${message}`); };

function extractFunction(name) {
  const patterns = [`async function ${name}(`, `function ${name}(`];
  const start = patterns.map(pattern => html.indexOf(pattern)).find(index => index >= 0);
  if (start == null) fail(`${name} not found.`);
  const brace = html.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < html.length; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}' && --depth === 0) return html.slice(start, i + 1);
  }
  fail(`${name} could not be extracted.`);
}

let releaseHydration;
let hydrationStartedResolve;
const hydrationStarted = new Promise(resolve => { hydrationStartedResolve = resolve; });
const hydrationGate = new Promise(resolve => { releaseHydration = resolve; });
const checkpointData = { assets: [{ id: 'old', type: 'image' }] };
const checkpoint = {
  schema: 1,
  complete: true,
  revision: 7,
  payload: JSON.stringify(checkpointData),
  checksum: 'valid',
};

const source = [
  'let _sessionRestoreOperationToken = 0;',
  extractFunction('invalidateSessionRestore'),
  extractFunction('isCurrentSessionRestore'),
  extractFunction('restoreLastSessionAutosave'),
  'return { restoreLastSessionAutosave, invalidateSessionRestore };',
].join('\n');

let activeProject = 'launcher';
let currentCheckpointProject = 'old';
const appliedProjects = [];
const runtime = new Function(
  'deps',
  `let sessionAutosaveEnabled = true;
   let sessionRestoreAttempted = false, sessionRestoreFailed = false;
   let sessionRestoreNoPartialState = true, sessionRestoreDidNotOverrideManualLoad = true;
   let sessionRestoreAssetCount = 0, sessionRestoreHydratedAssetCount = 0;
   let sessionAutosaveRevision = 0, _sessionAutosaveQueuedRevision = 0, _sessionAutosaveCommittedRevision = 0;
   const SESSION_AUTOSAVE_SCHEMA = 1, APP_VERSION = 'test';
   const readSessionCheckpoint = deps.readSessionCheckpoint;
   const sessionPayloadChecksum = deps.sessionPayloadChecksum;
   const isCompleteSessionProjectData = deps.isCompleteSessionProjectData;
   const prehydrateCompleteSession = deps.prehydrateCompleteSession;
   const applyProjectData = deps.applyProjectData;
   ${source}`
)({
  readSessionCheckpoint: async () => checkpoint,
  sessionPayloadChecksum: () => 'valid',
  isCompleteSessionProjectData: () => true,
  prehydrateCompleteSession: async () => {
    hydrationStartedResolve();
    await hydrationGate;
    return 1;
  },
  applyProjectData: data => {
    appliedProjects.push(data.assets[0].id);
    activeProject = data.assets[0].id;
  },
});

const restoring = runtime.restoreLastSessionAutosave();
await hydrationStarted;

// Novo Projeto centralmente invalida a restauração antiga e passa a ser a
// única sessão corrente antes que a hidratação atrasada termine.
runtime.invalidateSessionRestore('new-project');
activeProject = 'new-project';
currentCheckpointProject = 'new-project';
releaseHydration();
await restoring;

if (appliedProjects.length !== 0) fail('stale applyProjectData was executed.');
if (activeProject !== 'new-project') fail('new project was overwritten.');
if (currentCheckpointProject !== 'new-project') fail('checkpoint no longer represents the new project.');

console.log('Session autosave race behavior passed: stale restore was discarded after New Project.');
