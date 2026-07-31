import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_MULTI_ASSET_INSERT_HTML || 'index.html', 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Multi-asset insert guardrail failed: ${message}`); };

for (const fragment of [
  'id="multiImageInsertInput" accept="image/jpeg,image/png,image/webp" multiple',
  'id="fileInput2" accept="image/*" style="display:none;"',
  'function handleMultiImageInsertSelection(event)',
  'async function prepareMultiAssetInsertFiles(files)',
  'function commitMultiAssetInsert(prepared, layout)',
  "pushUndoSnapshot(before);",
  "markProjectDirty('add-image-asset-batch');",
  "multiAssetInsertAutosaveScheduledCount = 1;",
  "showStatus('Não foi possível preparar todas as imagens. Nenhuma alteração foi feita.');",
]) assert(html.includes(fragment), `missing ${fragment}`);

assert(!/<input[^>]+id="fileInput2"[^>]+multiple/i.test(html), 'replace input became multiple.');
assert(/for \(let index = 0; index < files\.length; index\+\+\)[\s\S]*await readMultiAssetInsertFile/.test(html), 'preparation is not sequential.');
assert(/if \(files\.length === 1\)[\s\S]{0,160}doInsertImageFromFile\(files\[0\]\)/.test(html), 'single selection does not use the existing pipeline.');
assert(/pendingMultiAssetInsertFiles = files\.slice\(\);[\s\S]{0,700}dialog\.style\.display = 'flex'/.test(html), 'multiple selection does not defer mutation until the layout dialog.');
assert(/const firstSequence = nextLayerSequence;[\s\S]*nextLayerSequence = firstSequence \+ created\.length/.test(html), 'batch sequences are not consecutive.');
assert(/const top = created\[created\.length - 1\][\s\S]*selectAssetById\(top\.id/.test(html), 'top batch asset is not selected canonically.');

console.log('Multi-asset insert guardrail passed.');
