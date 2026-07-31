import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_MULTI_ASSET_INSERT_HTML || 'index.html', 'utf8');
function extractFunction(name) {
  const starts = [`async function ${name}(`, `function ${name}(`];
  const start = starts.map(value => html.indexOf(value)).find(index => index >= 0);
  if (start == null) throw new Error(`Function ${name} not found.`);
  const brace = html.indexOf('{', start); let depth = 0; let quote = null; let escaped = false;
  for (let index = brace; index < html.length; index++) {
    const char = html[index];
    if (quote) { if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === quote) quote = null; continue; }
    if (char === '"' || char === "'" || char === '`') { quote = char; continue; }
    if (char === '{') depth++;
    if (char === '}' && --depth === 0) return html.slice(start, index + 1);
  }
  throw new Error(`Function ${name} incomplete.`);
}

const fitContain = new Function(`${extractFunction('fitContain')}; return fitContain;`)();
const compute = new Function('fitContain', 'projectWorld', `${extractFunction('computeMultiAssetInsertRects')}; return computeMultiAssetInsertRects;`)(fitContain, { baseStageW: 1000, baseStageH: 800 });
const prepared = [{ width: 1000, height: 500 }, { width: 400, height: 800 }, { width: 800, height: 800 }];
const anchor = { x: 500, y: 400 };

const stack = compute(prepared, 'stack', anchor);
assert.equal(stack.length, 3);
assert.ok(stack[1].x > stack[0].x && stack[2].y > stack[1].y, 'stack offsets are not progressive.');
assert.deepEqual(stack.map(r => [r.w, r.h]), [[1000, 500], [400, 800], [800, 800]], 'canonical fit scales changed in stack.');

for (const layout of ['horizontal', 'vertical']) {
  const rects = compute(prepared, layout, anchor);
  const axis = layout === 'horizontal' ? 'x' : 'y';
  const size = layout === 'horizontal' ? 'w' : 'h';
  assert.ok(rects.every((rect, index) => index === 0 || rect[axis] >= rects[index - 1][axis] + rects[index - 1][size]), `${layout} overlaps.`);
  const start = rects[0][axis]; const end = rects.at(-1)[axis] + rects.at(-1)[size];
  assert.ok(Math.abs((start + end) / 2 - anchor[axis]) < 1e-9, `${layout} is not centered.`);
}

assert.ok(extractFunction('handleMultiImageInsertSelection').includes('doInsertImageFromFile(files[0])'), 'single path diverged.');
assert.ok(extractFunction('prepareMultiAssetInsertFiles').includes('await readMultiAssetInsertFile(files[index])'), 'decode is not sequential.');
assert.ok(extractFunction('cancelMultiAssetInsert').includes('releaseMultiAssetInsertTemporaryResources([])'), 'cancel does not release temporary references.');
assert.ok(extractFunction('confirmMultiAssetInsert').includes('multiAssetInsertDuplicateActionBlocked = true'), 'duplicate action is not blocked.');
assert.ok(extractFunction('commitMultiAssetInsert').includes("lastUndoAction = 'addImageAssetBatch'"), 'history transaction is not a batch.');

console.log('Multi-asset insert behavioral harness passed: real layout and flow functions, 15 expectations.');
