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

const trackedWriteStart = html.indexOf('async function performSessionAutosaveWrite(');
const writeStart = trackedWriteStart >= 0 ? trackedWriteStart : html.indexOf('async function writeSessionAutosave(');
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
if (!/if \(isPreviewing[\s\S]*?handleDragState = \{[\s\S]*?startRot: frameRotations\[fi\] \|\| 0,[\s\S]*?initialRot: frameRotations\[fi\] \|\| 0,/.test(handleSource)) {
  fail('ensureGlobalHandle real state does not preserve immutable initialRot.');
}

const cornerStart = html.indexOf('function ensureCornerHandles()');
const cornerEnd = html.indexOf('// ═══════════════════════════════════════', cornerStart);
const cornerSource = cornerStart >= 0 ? html.slice(cornerStart, cornerEnd >= 0 ? cornerEnd : undefined) : '';
if (!cornerSource) fail('ensureCornerHandles not found.');
if ((cornerSource.match(/initialRot: frameRotations\[fi\] \|\| 0/g) || []).length !== 1) {
  fail('ensureCornerHandles real state must preserve initialRot exactly once and exclude the ghost state.');
}
if (!/if \(isInsertingFrame \|\| isPreviewing[\s\S]*?handleDragState = \{[\s\S]*?startRot: frameRotations\[fi\] \|\| 0,[\s\S]*?initialRot: frameRotations\[fi\] \|\| 0,/.test(cornerSource)) {
  fail('cornerHandle real state does not preserve immutable initialRot.');
}
if (!/globalHandleEl\.dispatchEvent\(new PointerEvent\(['"]pointermove['"]/.test(cornerSource) ||
    !/globalHandleEl\.dispatchEvent\(new PointerEvent\(['"]pointerup['"]/.test(cornerSource)) {
  fail('cornerHandle does not forward move/completion to globalHandleEl.');
}

if (!/recCanvas com dimensões inválidas[\s\S]*?isRecording = false;[\s\S]*?resumeDeferredSessionAutosaveAfterPlayback\(\);[\s\S]*?return;/.test(html)) {
  fail('invalid recCanvas exit does not resume a deferred checkpoint after recording stops.');
}
if (!/catch \(cleanupErr\)[\s\S]*?isRecording = false;[\s\S]*?resumeDeferredSessionAutosaveAfterPlayback\(\);/.test(html)) {
  fail('finishExport cleanup error does not attempt deferred checkpoint resumption.');
}
if (!/function resetPreviewAndExportStateForImageChange\(\)[\s\S]*?isRecording = false;[\s\S]*?exportPreparing = false;[\s\S]*?resumeDeferredSessionAutosaveAfterPlayback\(\);/.test(html)) {
  fail('image-change playback/export reset does not attempt deferred checkpoint resumption.');
}
if (!/function resetAll\(\)[\s\S]*?isRecording = false;[\s\S]*?exportPreparing = false;[\s\S]*?resumeDeferredSessionAutosaveAfterPlayback\(\);[\s\S]*?if \(!imgNatW\) return;/.test(html)) {
  fail('project reset can return after recording stops without attempting deferred checkpoint resumption.');
}

const resetStart = html.indexOf('function resetAll()');
const resetEnd = html.indexOf('// ═══════════════════════════════════════\n// FORMAT CHANGE', resetStart);
const resetSource = resetStart >= 0 ? html.slice(resetStart, resetEnd >= 0 ? resetEnd : undefined) : '';
if (!/const stateBeforeProjectReset = captureState\(\);[\s\S]*?if \(_projectNewFromImage\)[\s\S]*?(?:restoreState|createInitialFrameForNewImageProject)[\s\S]*?if \(!projectStateEquals\(stateBeforeProjectReset, captureState\(\)\)\)[\s\S]*?markProjectDirty\(['"]project-reset['"]\)/.test(resetSource)) {
  fail('new-image Reset does not mark dirty only after a real baseline application.');
}
if (!/const prevState = captureState\(\);[\s\S]*?if \(projectStateEquals\(prevState, projectResetBaseline\)\)[\s\S]*?return;[\s\S]*?restoreState\(cloneProjectStateSnapshot\(projectResetBaseline\)\);[\s\S]*?normalizeProjectArrays\(\);[\s\S]*?markProjectDirty\(['"]project-reset['"]\)/.test(resetSource)) {
  fail('loaded-project Reset does not mark dirty after normalized baseline restoration.');
}

const formatStart = html.indexOf('function selectFormat(chip)');
const formatEnd = html.indexOf('// ═══════════════════════════════════════\n// DURATION', formatStart);
const formatSource = formatStart >= 0 ? html.slice(formatStart, formatEnd >= 0 ? formatEnd : undefined) : '';
if (!/const nextRatio = chip\.dataset\.ratio;[\s\S]*?const formatChanged = nextRatio !== currentRatio;[\s\S]*?if \(!imgNatW \|\| !formatChanged\) return;[\s\S]*?pushUndo\(\);[\s\S]*?currentRatio = nextRatio;[\s\S]*?normalizeProjectArrays\(\);[\s\S]*?markProjectDirty\(['"]format-change['"]\)/.test(formatSource)) {
  fail('selectFormat does not gate Undo/dirty on a real change after normalized state application.');
}
if ((formatSource.match(/markProjectDirty\(['"]format-change['"]\)/g) || []).length !== 1) {
  fail('selectFormat must contain exactly one format-change dirty trigger.');
}

for (const [trigger, label] of [
  ["markProjectDirty('template')", 'templates'],
  ["markProjectDirty('add-frame')", 'add Frame'],
  ["markProjectDirty('remove-frame')", 'remove last Frame'],
  ["markProjectDirty('delete-frame')", 'delete selected Frame'],
  ["markProjectDirty('invert-frames')", 'invert Frames'],
  ["markProjectDirty('loop-toggle')", 'loop'],
  ["markProjectDirty('frame-lock')", 'Frame lock'],
  ["markProjectDirty('background-color')", 'background color'],
  ["markProjectDirty('movement-easing-mode')", 'movement mode'],
  ["markProjectDirty('reset-all-curves')", 'curve reset'],
  ["markProjectDirty('frame-pause-reset-all')", 'pause reset'],
  ["markProjectDirty('deleteAsset')", 'asset deletion'],
  ["markProjectDirty('replace-image-asset')", 'asset replacement'],
  ["markProjectDirty('add-image-asset')", 'asset insertion'],
  ["markProjectDirty('layerUp')", 'Layer order up'],
  ["markProjectDirty('layerDown')", 'Layer order down'],
]) requireText(trigger, `${label} explicit persistence trigger`);

console.log('Session autosave/Preview isolation guardrail passed.');
