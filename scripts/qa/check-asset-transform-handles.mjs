import { readFileSync } from 'node:fs';

const htmlPath = process.env.QA_ASSET_HANDLES_HTML || 'index.html';
const html = readFileSync(htmlPath, 'utf8');
function fail(message) {
  console.error(`Asset transform handle guardrail failed: ${message}`);
  process.exit(1);
}
function requireIncludes(fragment, label) {
  if (!html.includes(fragment)) fail(`${label} not found.`);
}
function requireExcludes(fragment, label) {
  if (html.includes(fragment)) fail(`${label} still present.`);
}

const appVersion = html.match(/const APP_VERSION = '([^']+)';/)?.[1];
const appVersionName = html.match(/const APP_VERSION_NAME = '([^']+)';/)?.[1];
if (!appVersion || appVersion !== appVersionName) fail('APP_VERSION and APP_VERSION_NAME must exist and match.');

if (/\.asset-transform-handle\s*\{/.test(html)) fail('legacy .asset-transform-handle CSS rule is still present.');
if (/\.asset-scale-handle\s*\{/.test(html)) fail('legacy .asset-scale-handle CSS rule is still present.');
if (/\.asset-rotate-handle\s*\{/.test(html)) fail('legacy .asset-rotate-handle CSS rule is still present.');

requireIncludes('display:none;cursor:grab;touch-action:none;pointer-events:auto;z-index:1;', 'interactive asset corner handle CSS');
requireIncludes('width:44px;height:44px;transform:translate(-50%,-50%);', '44px touch area');
for (const rule of [
  '.asset-corner-handle[data-asset-corner="tl"]{left:-12px;top:-12px;}',
  '.asset-corner-handle[data-asset-corner="tr"]{left:calc(100% + 12px);top:-12px;}',
  '.asset-corner-handle[data-asset-corner="bl"]{left:-12px;top:calc(100% + 12px);}',
  '.asset-corner-handle[data-asset-corner="br"]{left:calc(100% + 12px);top:calc(100% + 12px);}',
]) requireIncludes(rule, `external offset rule ${rule}`);

requireIncludes("['tl','tr','bl','br'].forEach(function(corner)", 'four asset corner handles creation');
requireIncludes("tab.addEventListener('pointerdown'", 'asset corner pointerdown listener');
requireIncludes("box.querySelectorAll('.asset-scale-handle,.asset-rotate-handle').forEach(function(h) { h.remove(); });", 'legacy handle DOM cleanup');
requireIncludes('const boxRect = box.getBoundingClientRect();', 'box bounding rect diagnostic');
requireIncludes('const r = h.getBoundingClientRect();', 'handle bounding rect diagnostic');

for (const forbidden of [
  'assetTransformUsesFrameInteractionModel = true',
  'assetTransformGeometryTracksRotation = true',
  'assetTransformGeometryTracksZoom = true',
  'frameCornerHandlesUnchanged = true',
]) {
  if (html.includes(forbidden)) fail(`declarative diagnostic remains: ${forbidden}`);
}

requireIncludes('function resolveCornerTransformMode(', 'shared corner transform intent helper');
const helperCalls = html.match(/resolveCornerTransformMode\(/g)?.length || 0;
if (helperCalls < 3) fail('shared corner transform helper is not used by both definition and call sites.');

// ===== v8z4b32E9G1 — side width handles (Text Asset apenas) =====
// A E9G1 é uma EXCEÇÃO deliberada e ESPECÍFICA para Text Asset ao invariante REG-028
// (exatamente quatro corner handles para todo Asset): Text Asset ganha DUAS alças
// laterais adicionais que fazem largura/reflow, nunca escala. Este bloco não afrouxa
// as checagens de corner handle acima — apenas adiciona checagens PRÓPRIAS do novo
// sistema, garantindo que ele nunca reaproveita .asset-corner-handle nem os handlers
// de escala/rotação, e que não-texto continua com zero side width handles.
if (/\.text-width-handle\[data-asset-width-handle="left"\]\{[^}]*\.asset-corner-handle/.test(html)) {
  fail('text width handle CSS must not be aliased to .asset-corner-handle.');
}
requireExcludes('.asset-corner-handle.text-width-handle', 'width handle masquerading as a corner handle (class union)');
requireIncludes('.text-width-handle{', 'text width handle CSS rule');
requireIncludes('.text-width-handle.show{display:block;}', 'text width handle visibility rule');
requireIncludes('.text-width-handle[data-asset-width-handle="left"]{left:-12px;top:50%;}', 'left width handle offset rule');
requireIncludes('.text-width-handle[data-asset-width-handle="right"]{left:calc(100% + 12px);top:50%;}', 'right width handle offset rule');
requireIncludes("width:44px;height:44px;transform:translate(-50%,-50%);\n  background:transparent;border-radius:50%;}\n.text-width-handle[data-asset-width-handle=\"left\"]", '44px touch area on the width handle');

requireIncludes("['left','right'].forEach(function(side)", 'two text width handles creation');
requireIncludes('wh.dataset.assetWidthHandle = side;', 'width handle side dataset assignment');
requireIncludes("wh.addEventListener('pointerdown', function(ev) { beginTextWidthDrag(ev, wh.dataset.assetWidthHandle); });", 'width handle pointerdown listener');
requireIncludes("wh.addEventListener('pointermove', handleTextWidthPointerMove);", 'width handle pointermove listener');
requireIncludes("wh.addEventListener('pointerup', function(ev) { endTextWidthPointer(ev, false); });", 'width handle pointerup listener');
requireIncludes("wh.addEventListener('pointercancel', function(ev) { endTextWidthPointer(ev, true); });", 'width handle pointercancel listener');

requireIncludes('function beginTextWidthDrag(', 'width drag begin handler (real interactive implementation, not decorative)');
requireIncludes('function handleTextWidthPointerMove(', 'width drag pointermove handler');
requireIncludes('function endTextWidthPointer(', 'width drag end handler');

// Não-texto nunca ganha side width handles: a visibilidade real depende de
// asset.type === 'text', não de uma constante estática.
requireIncludes("const showTextWidthHandles = asset.type === 'text';", 'width handles gated to Text Asset only');
requireIncludes("textWidthHandles.forEach(function(h) { h.classList.toggle('show', showTextWidthHandles); });", 'width handle visibility toggle wired to the text-only gate');

// Invariante central (E9G1): width drag nunca escala — fontSize/textBaseFontSize nunca
// são atribuídos dentro do bloco beginTextWidthDrag→endTextWidthPointer. Extrai só esse
// trecho da fonte (delimitado pelas próprias funções) para não reproibir a atribuição
// legítima de asset.fontSize dentro do corner-scale (beginAssetTransformDrag/
// handleAssetTransformPointerMove), que continua inalterado.
const widthDragBlockStart = html.indexOf('function beginTextWidthDrag(');
const widthDragBlockEnd = html.indexOf('function endTextWidthPointer(');
if (widthDragBlockStart === -1 || widthDragBlockEnd === -1 || widthDragBlockEnd < widthDragBlockStart) {
  fail('could not locate the beginTextWidthDrag…endTextWidthPointer source block for the scale-preservation check.');
} else {
  const widthDragEndFnClose = html.indexOf('\n}', html.indexOf('function endTextWidthPointer('));
  const widthDragBlock = html.slice(widthDragBlockStart, widthDragEndFnClose === -1 ? undefined : widthDragEndFnClose);
  if (/asset\.fontSize\s*=[^=]/.test(widthDragBlock)) fail('width drag must never assign asset.fontSize — that would violate the scale-preservation invariant (only corner scale may).');
  if (/asset\.textBaseFontSize\s*=[^=]/.test(widthDragBlock)) fail('width drag must never assign asset.textBaseFontSize — that would violate the scale-preservation invariant.');
}

// O painel Largura não pode manter o slider manual antigo (REG-028: nunca coexistir
// sistema substituído com o novo). Auto continua sendo o único comando do painel.
requireExcludes('id="textWidthSlider"', 'legacy manual width slider markup in the panel');
requireExcludes('id="textWidthValue"', 'legacy manual width value output in the panel');
requireExcludes('function onTextWidthSliderInput(', 'dead handler for the removed manual width slider');
requireExcludes('function setTextDraftFixedWidth(', 'dead handler exclusive to the removed manual width slider');
requireIncludes('id="textWidthAuto"', 'Auto width command preserved in the panel');

// v8z4b32E9G1-R2 — regressão real encontrada no WebKit CI: handleStageAssetSelectPointer
// é um gatekeeper de CAPTURA em imageArea (roda ANTES do listener de target da própria
// handle) que faz hit-test por coordenadas e reseleciona o asset por baixo, com
// stopImmediatePropagation — .asset-corner-handle já era exemptado, mas
// .text-width-handle não era, então um pointerdown na side handle era sequestrado antes
// de beginTextWidthDrag sequer rodar (a alça ficava visível/"funcional" no DOM, mas o
// gesto nunca começava). Trava explicitamente as DUAS exceções juntas nesse gatekeeper.
requireIncludes("e.target.closest('.asset-corner-handle,.text-width-handle')", 'stage-tap select gatekeeper exempts both corner and width handles from hijacking pointerdown');

console.log('Asset transform handle guardrail passed.');
