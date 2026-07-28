import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
function fail(message) {
  console.error(`Asset transform handle guardrail failed: ${message}`);
  process.exit(1);
}
function requireIncludes(fragment, label) {
  if (!html.includes(fragment)) fail(`${label} not found.`);
}

requireIncludes("const APP_VERSION = 'v8z4b32E8A';", 'APP_VERSION v8z4b32E8A');
requireIncludes("const APP_VERSION_NAME = 'v8z4b32E8A';", 'APP_VERSION_NAME v8z4b32E8A');

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

console.log('Asset transform handle guardrail passed.');
