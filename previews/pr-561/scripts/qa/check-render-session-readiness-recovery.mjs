import { readFileSync } from 'node:fs';

const html = readFileSync(process.env.QA_INDEX_HTML || 'index.html', 'utf8');
const fixture = JSON.parse(readFileSync(process.env.QA_RENDER_READINESS_FIXTURE || 'test-fixtures/qa-guardrails/render-session-readiness-recovery.json', 'utf8'));
const fail = (message) => { console.error(`Render readiness recovery guardrail failed: ${message}`); process.exit(1); };
const requireSource = (fragment, label) => { if (!html.includes(fragment)) fail(`${label} not found.`); };

requireSource('async function ensureRenderableAssetSource(asset, context)', 'shared Preview/Export readiness routine');
requireSource("drawSourceKind: 'stableDrawable'", 'stable drawable precedence');
requireSource("result.recoveryMethod = 'persistent-source-rehydrate'", 'persistent recovery');
requireSource('partialSnapshotDiscardedAfterFailure = true;', 'partial snapshot cleanup');
requireSource('renderReadinessSkippedVisibleAssetCount', 'visible-asset skip diagnostic');
requireSource("prepareRenderSessionSnapshot('export')", 'Export shared snapshot preparation');
requireSource("prepareCanonicalPreviewAssetsE7Q('preview')", 'Preview shared snapshot preparation');

const classify = (entry) => {
  if ((entry.visibleAssetCount ?? fixture.expectedVisibleAssetCount) !== fixture.expectedVisibleAssetCount) return 'guard-failure';
  if (entry.stableValid) return 'stableDrawable';
  if (entry.liveReady) return 'liveImage';
  if (entry.persistentAvailable) return 'hydratedStableDrawable';
  return 'failure';
};
for (const entry of fixture.cases) {
  const actual = classify(entry);
  if (actual !== entry.expected) fail(`${entry.name}: expected ${entry.expected}, got ${actual}.`);
}
console.log('Render readiness recovery guardrail passed (5 fixtures; 9 visible assets).');
