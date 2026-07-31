import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const must=[
 'function startInsertImageFlow()', 'triggerMultiImageInsertPicker();',
 'async function prepareMultiImageFiles(files)', 'async function beginMultiImagePlacement(files)',
 'function renderPendingMultiImagePlacement()', 'function startPendingMultiImageDrag(event)',
 'function handlePendingMultiImageStageUp(event)', 'function cancelPendingMultiImagePlacement()',
 'function confirmPendingMultiImagePlacement()', 'function commitPendingMultiImagePlacement()',
 "assets.push(...committed)", "pushUndoSnapshot(snapshot.state)", "markProjectDirty('add-image-assets')",
 'Arraste para posicionar', 'Adicionar imagem', 'Imagem ${pendingMultiImagePlacement.currentIndex + 1} de ${pendingMultiImagePlacement.preparedImages.length}'
];
for(const token of must) assert.ok(html.includes(token),`contrato ausente: ${token}`);
const input=html.match(/<input type="file" id="multiImageInsertInput"[^>]*>/)?.[0]||'';
assert.ok(input.includes('multiple'));
assert.ok(input.includes('image/jpeg,image/png,image/webp'));
assert.ok(!html.includes('id="multiImageLayoutSheet"'));
assert.ok(!html.includes('Empilhar no centro'));
assert.ok(!html.includes('Distribuir na horizontal'));
assert.ok(!html.includes('Distribuir na vertical'));
const start=html.slice(html.indexOf('function startInsertImageFlow()'),html.indexOf('// ── Ação 2:',html.indexOf('function startInsertImageFlow()')));
assert.ok(!start.includes('openImageSlotPicker'));
assert.ok(!start.includes("pendingImageAction = 'insertImage'"));
for(const key of ['multiImagePlacementLegacySlotChooserOpened','multiImagePlacementLayoutSheetOpened','multiImagePlacementCanonicalMutationBeforeFinalCommit','multiImagePlacementHistoryEntriesCreated','multiImagePlacementAutosavesScheduled','multiImagePlacementPointerCaptureStuck','multiImagePlacementGestureConflictDetected','multiImagePlacementFrameStateChanged','multiImagePlacementCurveStateChanged','multiImagePlacementProjectWorldChangedBeforeCommit']) assert.ok(html.includes(`push('${key}'`));
console.log('Multi-image sequential placement controller contracts passed.');
