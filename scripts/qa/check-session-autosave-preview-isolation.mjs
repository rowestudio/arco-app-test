import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_SESSION_PREVIEW_HTML || 'index.html', 'utf8');
const fail = message => { throw new Error(`Session autosave/Preview isolation guardrail failed: ${message}`); };
const requireText = (text, label) => { if (!html.includes(text)) fail(`${label} not found.`); };

if (/document\.addEventListener\(['"]pointerup['"][\s\S]{0,160}scheduleSessionAutosave/.test(html)) {
  fail('global pointerup still schedules autosave.');
}

for (const [text, label] of [
  ['function isSessionAutosaveBlockedByPlayback()', 'central playback barrier'],
  ['previewPreparing || isPreviewing || isRecording || exportPreparing', 'canonical playback/export states'],
  ["suspendSessionAutosaveForPlayback('preview-start')", 'Preview pending-timer suspension'],
  ['resumeDeferredSessionAutosaveAfterPlayback();', 'deferred checkpoint resumption'],
  ['writeSessionAutosave(revision, epoch, mandatoryFlush = false', 'mandatory safety flush distinction'],
  ["writeSessionAutosave(revision, _sessionAutosaveEpoch, true, 'safety-flush')", 'visibility/pagehide flush override'],
  ['if (!mandatoryFlush && isSessionAutosaveBlockedByPlayback())', 'pre-build playback barrier'],
  ["deferSessionAutosaveBecausePlayback(checkpoint.revision, epoch, 'blocked-before-indexeddb')", 'IndexedDB revalidation'],
  ["document.addEventListener('visibilitychange'", 'visibilitychange safety hook'],
  ["window.addEventListener('pagehide', flushSessionAutosave);", 'pagehide safety hook'],
  ['const data = buildCompleteSessionProjectData();', 'autosave remains enabled and complete'],
  ['const checksum = sessionPayloadChecksum(payload);', 'checksum remains enabled'],
]) requireText(text, label);

const writeStart = html.indexOf('async function writeSessionAutosave(');
const build = html.indexOf('const data = buildCompleteSessionProjectData();', writeStart);
const barrier = html.indexOf('if (!mandatoryFlush && isSessionAutosaveBlockedByPlayback())', writeStart);
const stringify = html.indexOf('const payload = JSON.stringify(data);', writeStart);
const checksum = html.indexOf('const checksum = sessionPayloadChecksum(payload);', writeStart);
if (!(writeStart >= 0 && barrier > writeStart && barrier < build && build < stringify && stringify < checksum)) {
  fail('heavy work is not ordered after the initial barrier.');
}
if ((html.match(/if \(!mandatoryFlush && isSessionAutosaveBlockedByPlayback\(\)\)/g) || []).length < 4) {
  fail('barrier is not revalidated through build/stringify/checksum/write boundaries.');
}
if (!/function startPreview\(\)[\s\S]*?suspendSessionAutosaveForPlayback\('preview-start'\)[\s\S]*?previewPreparing = true;/.test(html)) {
  fail('Preview does not preserve/cancel pending autosave before preparation.');
}
if (/function startPreview\(\)[\s\S]{0,500}(?:scheduleSessionAutosave|markProjectDirty)\(/.test(html)) {
  fail('opening Preview mutates the autosave revision.');
}

const handleStart = html.indexOf('function ensureGlobalHandle()');
const handleEnd = html.indexOf('// ═══════════════════════════════════════', handleStart);
const handleSource = handleStart >= 0 ? html.slice(handleStart, handleEnd >= 0 ? handleEnd : undefined) : '';
if (!handleSource || !handleSource.includes('const endHandle = e =>')) {
  fail('Frame transform completion handler not found.');
}
if (!/frames\[fi\]\.w\s*=|frames\[fi\]\.h\s*=|frameRotations\[fi\]\s*=/.test(handleSource)) {
  fail('Frame transform mutations not found in ensureGlobalHandle.');
}
const dirtyCalls = handleSource.match(/markProjectDirty\(['"]frame-transform['"]\)/g) || [];
if (dirtyCalls.length !== 1) {
  fail('Frame transform must mark the project dirty exactly once in endHandle.');
}
if (!/const completedHandleDrag = handleDragState;[\s\S]*completedHandleDrag\.mode === ['"]scale['"][\s\S]*completedHandleDrag\.mode === ['"]rotate['"][\s\S]*completedHandleDrag\.undoCaptured && frameTransformChanged[\s\S]*markProjectDirty\(['"]frame-transform['"]\)/.test(handleSource)) {
  fail('endHandle does not preserve state and gate dirty marking on a completed, changed scale/rotate gesture.');
}
if (!/if\s*\(completedHandleDrag\.isGhost\)\s*\{[\s\S]*?\}\s*else\s*\{[\s\S]*?markProjectDirty\(['"]frame-transform['"]\)/.test(handleSource)) {
  fail('Frame dirty marking is not isolated from the ghost transformation branch.');
}

console.log('Session autosave/Preview isolation guardrail passed.');
