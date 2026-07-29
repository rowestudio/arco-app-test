import { readFileSync } from 'node:fs';

const source = readFileSync(process.env.QA_PREVIEW_WARMUP_HTML || 'index.html', 'utf8');
const fail = (message) => {
  console.error(`Preview first-frame warm-up guardrail failed: ${message}`);
  process.exit(1);
};
const sliceBetween = (start, end) => {
  const from = source.indexOf(start);
  if (from < 0) fail(`${start} not found.`);
  const to = source.indexOf(end, from + start.length);
  if (to < 0) fail(`${end} not found after ${start}.`);
  return source.slice(from, to);
};

const prepare = sliceBetween('async function _preparePreviewRendererZI(', 'function freshCameraTraceState30ZC(');
const preflight = sliceBetween('(async function _previewPreflightAndStartZI()', 'function stopPreview()');
const finalRender = 'renderFrameSafely(pCtx, dispCanvas, 0, pW2, pH2, totalPF, 0, { renderSource: previewSrc });';
const finalRenderAt = prepare.indexOf(finalRender);
const compositorAwaitAt = prepare.indexOf('await _nextAnimFrameAsync();', finalRenderAt + finalRender.length);
const preparedAt = prepare.indexOf('previewRendererPreparedForCurrentState = true;', compositorAwaitAt);

for (const field of ['ok', 'initialFrameRenderAttempted', 'initialFrameRendered', 'initialFrameCommittedBeforeClock', 'warmupSamplesAttempted', 'warmupSamplesRendered', 'compositorFramesAwaited', 'failureReason', 'renderError']) {
  if (!prepare.includes(`${field}:`)) fail(`structured result field ${field} is missing.`);
}
if (!prepare.includes('return result;')) fail('preflight renderer does not return its structured result.');
if (finalRenderAt < 0) fail('explicit canonical final render at t=0 is missing.');
if (compositorAwaitAt < 0) fail('no compositor requestAnimationFrame is awaited after final t=0 render.');
if (preparedAt < 0) fail('renderer is marked prepared before render success/compositor wait.');
if (!prepare.slice(finalRenderAt, compositorAwaitAt).includes('result.initialFrameRendered = true;')) fail('final render success is not recorded from the successful render call.');
if (!prepare.slice(finalRenderAt).includes("result.failureReason = 'initial-frame-render-failed';")) fail('final render failure is not explicit.');
if (/catch\s*\([^)]*\)\s*\{[^}]*result\.ok\s*=\s*true/s.test(prepare)) fail('a caught render error is converted to success.');
if (!prepare.slice(compositorAwaitAt, preparedAt).includes('cancelled()')) fail('token/state is not checked after compositor await.');

const resultCheckAt = preflight.indexOf('if (!warmupResult.ok || !warmupResult.initialFrameRendered');
const completedAt = preflight.indexOf('_previewWarmupCompleted = true;');
const scheduleAt = preflight.indexOf('requestAnimationFrame(loop);');
if (resultCheckAt < 0) fail('caller does not verify the structured warm-up result.');
if (completedAt < resultCheckAt) fail('warm-up is marked completed unconditionally/before result verification.');
if (scheduleAt < completedAt) fail('playback loop is scheduled before initial-frame confirmation.');
const failurePath = preflight.slice(resultCheckAt, completedAt);
if (!failurePath.includes('_previewWarmupCompleted = false;') || !failurePath.includes('previewRetryAvailable = true;') || !failurePath.includes('return;')) fail('failure path does not stop playback and release retry.');
if (/advancePreviewClockMs\s*\(/.test(preflight) || preflight.split('\n').some((line) => /animStart\s*=/.test(line) && !/animStart\s*=\s*null/.test(line))) fail('the visual clock is started inside preflight.');
if (!preflight.slice(completedAt, scheduleAt).includes("hidePreviewLoadingE7J('first-frame')")) fail('loading is not hidden after confirmed warm-up and before scheduling.');

const prepareCalls = [...source.matchAll(/_preparePreviewRendererZI\s*\(/g)].length;
if (prepareCalls !== 2) fail('Preview warm-up routine is called outside its single Preview preflight path (possible Export change).');
const exportPath = source.includes('async function startRecord(')
  ? sliceBetween('async function startRecord(', 'function finishExport(')
  : '';
if (exportPath.includes('_preparePreviewRendererZI') || exportPath.includes('previewWarmup')) fail('Export/startRecord calls Preview warm-up.');
if (!source.includes("const APP_VERSION = 'v8z4b32E8F';") || !source.includes("const APP_VERSION_NAME = 'v8z4b32E8F';")) fail('APP_VERSION/APP_VERSION_NAME are not v8z4b32E8F.');

console.log('Preview first-frame warm-up guardrail passed.');
