import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_INDEX_HTML || 'index.html', 'utf8');
const activeSource = html.replace(/<!--[\s\S]*?-->/g, '');
const componentSource = activeSource.replace("document.querySelectorAll('#frameHud')", "document.querySelectorAll('[diagnostic-stage-pill]')");

function fail(message) {
  console.error(`Frame Stage info pill guardrail failed: ${message}`);
  process.exit(1);
}

// The removed Stage component must not exist in markup, styles, or executable DOM creation.
if (/id=["']frameHud["']/.test(componentSource)) fail('#frameHud remains in active markup.');
if (/#frameHud\b/.test(componentSource)) fail('#frameHud remains in active CSS or executable selectors.');
if (/\.id\s*=\s*["']frameHud["']/.test(componentSource)) fail('#frameHud is still created dynamically.');
if (/createElement\(["'](?:div|span)["']\)[\s\S]{0,240}frameHud/.test(componentSource)) fail('Stage pill DOM creation remains.');

// Test the preserved real DOM components, not only JavaScript variable names.
if (!/<span class="lower-active-label" id="lowerActiveLabel">/.test(activeSource)) fail('timeline context information row was removed.');
if (!/<[^>]+class="frame-num"/.test(activeSource)) fail('Frame number visual was removed.');
if (!/class="frame-border"/.test(activeSource)) fail('Frame outline was removed.');
if (!/const ckeys = \['tl','tr','bl','br'\];[\s\S]*?cornerHandleEls = ckeys\.map/.test(activeSource)) fail('four Frame handles creation was removed.');

for (const field of [
  'frameStageInfoPillExists',
  'frameStageInfoPillVisible',
  'frameStageInfoPillCount',
  'timelineContextInfoRowExists',
  'timelineContextInfoRowVisibleWhenApplicable',
  'frameNumberVisualPreserved',
  'frameHandlesPreserved',
]) {
  if (!activeSource.includes(`push('${field}'`)) fail(`observational diagnostic ${field} is missing.`);
}
if (!activeSource.includes("document.querySelectorAll('#frameHud')")) fail('Stage pill diagnostics are not derived from the real DOM.');
if (!activeSource.includes("document.getElementById('lowerActiveLabel')")) fail('timeline diagnostics are not derived from the real DOM.');

console.log('Frame Stage info pill guardrail passed.');
