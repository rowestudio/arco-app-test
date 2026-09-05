import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_INDEX_HTML || 'index.html', 'utf8');
const fixturePath = process.env.QA_CANONICAL_SELECTION_FIXTURE || 'test-fixtures/qa-guardrails/canonical-asset-selection-valid.json';
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
const fail = (message) => { console.error(`Canonical asset selection guardrail failed: ${message}`); process.exit(1); };
const requireSource = (fragment, label) => { if (!html.includes(fragment)) fail(`${label} not found.`); };

if (process.env.QA_CANONICAL_MODEL_ONLY !== '1') {
requireSource('function selectAssetById(assetId, source)', 'canonical selection router');
requireSource("return candidate && String(candidate.id) === requestedId;", 'asset.id resolver');
requireSource("item.dataset.assetId = String(a.id);", 'real Layers row asset id');
requireSource("String(a.id) === String(selectedAssetId) ? ' selected' : ''", 'Layers highlight by canonical id');
requireSource("selectAssetById(hit.id, 'stage')", 'Stage selection routed by hit-test id');
requireSource("selectAssetById(a.id, 'layers')", 'Layers selection routed by row id');
requireSource('const sel = getSelectedAsset();', 'toolbar reorder canonical resolver');
requireSource('selectedAssetPreservedAfterReorder = selectedIdBeforeReorder === String(selectedAssetId);', 'reorder preservation observation');

for (const forbidden of [
  'selectedAssetId = pendingImageTargetAssetId',
  'selectedAssetId = target.id',
  'selectedAssetId = asset.id',
  'selectedImageAssetId = target.id',
  'selectedImageAssetId = asset.id',
]) if (html.includes(forbidden)) fail(`parallel direct selection remains: ${forbidden}`);
}

const assets = fixture.assets.map((asset) => ({ ...asset }));
let selectedAssetId = fixture.selectedAssetId;
const selectedBefore = assets.find((asset) => asset.id === selectedAssetId);
if (!selectedBefore) fail('fixture canonical selection does not resolve.');
const ordered = assets.slice().sort((a, b) => a.zIndex - b.zIndex);
const position = ordered.findIndex((asset) => asset.id === fixture.reorderWithId);
const next = ordered[position + 1];
[selectedBefore.zIndex, next.zIndex] = [next.zIndex, selectedBefore.zIndex];
const selectedAfter = assets.find((asset) => asset.id === selectedAssetId);
if (!selectedAfter || selectedAfter !== selectedBefore || selectedAssetId !== fixture.reorderWithId) fail('fixture reorder changed canonical identity.');
console.log('Canonical asset selection guardrail passed.');
