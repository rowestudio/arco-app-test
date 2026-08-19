#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateVersionPolicy } from '../qa/check-app-version.mjs';
import {
  STALE_ACTIVE_MS,
  buildFinalCheckRunUpdate,
  isWebKitSuiteApplicable,
  planWatchdog,
} from './mobile-ci-watchdog.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const repository = 'rowestudio/arco-app-test';

// Deterministic clock for all temporal classification. Never use the real clock.
const NOW = Date.parse('2026-08-19T12:00:00Z');
const minutesAgo = (m) => new Date(NOW - m * 60 * 1000).toISOString();
const FRESH = minutesAgo(5); // well within the freshness window
const STALE = minutesAgo(90); // well past the 60m stale threshold

const pr = (overrides = {}) => ({
  number: 472,
  title: 'OPS-04 watchdog fixture',
  body: 'Fixture body',
  draft: false,
  baseRefName: 'main',
  baseSha: 'base-main-sha',
  headRefName: 'codex/mobile-flow',
  headSha: 'sha-a',
  headRepoFullName: repository,
  ...overrides,
});

const plan = (input) => planWatchdog({ repository, now: NOW, ...input });

function suiteNames(result) {
  return result.include.map((item) => item.suite_name).sort();
}

function decisionFor(result, suiteName, prNumber = 472) {
  return result.decisions.find((d) => d.suite === suiteName && d.pr === prNumber);
}

function htmlWithVersion(version) {
  return `<!doctype html><html><body><script>
const APP_VERSION = '${version}';
const APP_VERSION_NAME = '${version}';
</script></body></html>`;
}

// ---------------------------------------------------------------------------
// isWebKitSuiteApplicable unit coverage (allowlist semantics)
// ---------------------------------------------------------------------------
assert.equal(isWebKitSuiteApplicable(['docs/QA_STRATEGY.md']), false);
assert.equal(isWebKitSuiteApplicable(['.agents/skills/x/SKILL.md', 'AGENTS.md']), false);
assert.equal(isWebKitSuiteApplicable(['.claude/skills/y/SKILL.md', 'docs/a.md']), false);
assert.equal(isWebKitSuiteApplicable(['README.md']), false);
assert.equal(isWebKitSuiteApplicable(['index.html']), true);
assert.equal(isWebKitSuiteApplicable(['index.html', 'docs/a.md']), true);
assert.equal(isWebKitSuiteApplicable(['tests/smoke/app.spec.mjs']), true);
assert.equal(isWebKitSuiteApplicable(['package.json']), true);
assert.equal(isWebKitSuiteApplicable(['package-lock.json']), true);
assert.equal(isWebKitSuiteApplicable(['.github/workflows/smoke-tests.yml']), true);
assert.equal(isWebKitSuiteApplicable(['scripts/ci/mobile-ci-watchdog.mjs']), true);
assert.equal(isWebKitSuiteApplicable(['some/unknown.bin']), true);
assert.equal(isWebKitSuiteApplicable(null), true);
assert.equal(isWebKitSuiteApplicable(undefined), true);
assert.equal(isWebKitSuiteApplicable([]), true);

// ---------------------------------------------------------------------------
// Case 1 — functional PR with no checks: both suites run.
// ---------------------------------------------------------------------------
{
  const result = plan({ prs: [pr()] });
  assert.deepEqual(suiteNames(result), ['QA Guardrails', 'WebKit Smoke Tests']);
  assert.equal(result.decisions.filter((d) => d.decision === 'run').length, 2);
  assert.equal(decisionFor(result, 'WebKit Smoke Tests').classification, 'missing');
}

// ---------------------------------------------------------------------------
// Case 2 — docs-only PR: QA runs, WebKit NOT APPLICABLE (never in matrix).
// ---------------------------------------------------------------------------
{
  const result = plan({ prs: [pr({ changedFiles: ['docs/QA_STRATEGY.md', 'docs/DECISIONS.md'] })] });
  assert.deepEqual(suiteNames(result), ['QA Guardrails']);
  const webkit = decisionFor(result, 'WebKit Smoke Tests');
  assert.equal(webkit.decision, 'skip');
  assert.equal(webkit.classification, 'not-applicable');
  assert.match(webkit.reason, /not applicable/i);
  assert.equal(decisionFor(result, 'QA Guardrails').decision, 'run');
}

// ---------------------------------------------------------------------------
// Case 3 — Skill/agent-only PR: QA applicable, WebKit NOT APPLICABLE.
// ---------------------------------------------------------------------------
{
  const result = plan({
    prs: [pr({ changedFiles: ['.agents/skills/arco-pr-review/SKILL.md', '.claude/skills/arco-pr-review', 'AGENTS.md'] })],
  });
  assert.deepEqual(suiteNames(result), ['QA Guardrails']);
  assert.equal(decisionFor(result, 'WebKit Smoke Tests').classification, 'not-applicable');
  assert.equal(decisionFor(result, 'QA Guardrails').decision, 'run');
}

// ---------------------------------------------------------------------------
// Case 4 — index.html present (even alongside docs): WebKit applicable.
// ---------------------------------------------------------------------------
{
  const result = plan({ prs: [pr({ changedFiles: ['index.html', 'docs/notes.md'] })] });
  assert.ok(suiteNames(result).includes('WebKit Smoke Tests'));
  assert.notEqual(decisionFor(result, 'WebKit Smoke Tests').classification, 'not-applicable');
}

// ---------------------------------------------------------------------------
// Case 5 — test file present: WebKit applicable.
// ---------------------------------------------------------------------------
{
  const result = plan({ prs: [pr({ changedFiles: ['tests/smoke/app.spec.mjs'] })] });
  assert.ok(suiteNames(result).includes('WebKit Smoke Tests'));
}

// ---------------------------------------------------------------------------
// Case 6 — package / lockfile present: WebKit applicable.
// ---------------------------------------------------------------------------
{
  for (const file of ['package.json', 'package-lock.json']) {
    const result = plan({ prs: [pr({ changedFiles: [file] })] });
    assert.ok(suiteNames(result).includes('WebKit Smoke Tests'), `expected WebKit applicable for ${file}`);
  }
}

// ---------------------------------------------------------------------------
// Case 7 — Browser Smoke workflow itself changed: WebKit applicable.
// ---------------------------------------------------------------------------
{
  const result = plan({ prs: [pr({ changedFiles: ['.github/workflows/smoke-tests.yml'] })] });
  assert.ok(suiteNames(result).includes('WebKit Smoke Tests'));
}

// ---------------------------------------------------------------------------
// Case 8 — unrecognized file: WebKit applicable for safety.
// ---------------------------------------------------------------------------
{
  const result = plan({ prs: [pr({ changedFiles: ['some/unknown/file.bin'] })] });
  assert.ok(suiteNames(result).includes('WebKit Smoke Tests'));
  assert.notEqual(decisionFor(result, 'WebKit Smoke Tests').classification, 'not-applicable');
}

// ---------------------------------------------------------------------------
// Case 9 — changed files unavailable (null): WebKit applicable for safety.
// ---------------------------------------------------------------------------
{
  const result = plan({ prs: [pr({ changedFiles: null })] });
  assert.deepEqual(suiteNames(result), ['QA Guardrails', 'WebKit Smoke Tests']);
}

// ---------------------------------------------------------------------------
// Case 10 — completed success on current HEAD: never duplicate.
// ---------------------------------------------------------------------------
{
  const result = plan({
    prs: [pr()],
    checkRuns: [
      { name: 'QA Guardrails', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
      { name: 'WebKit Smoke Tests', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
    ],
  });
  assert.deepEqual(result.include, []);
  assert.equal(decisionFor(result, 'QA Guardrails').classification, 'success');
  assert.equal(decisionFor(result, 'WebKit Smoke Tests').classification, 'success');
}
// Also via workflow runs.
{
  const result = plan({
    prs: [pr()],
    workflowRuns: [
      { workflow: 'qa-guardrails.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
      { workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
    ],
  });
  assert.deepEqual(result.include, []);
}

// ---------------------------------------------------------------------------
// Case 11 — completed failure: terminal, not "missing", no automatic rerun loop.
// ---------------------------------------------------------------------------
{
  const result = plan({
    prs: [pr()],
    checkRuns: [
      { name: 'QA Guardrails', headSha: 'sha-a', status: 'completed', conclusion: 'failure', startedAt: FRESH },
      { name: 'WebKit Smoke Tests', headSha: 'sha-a', status: 'completed', conclusion: 'failure', startedAt: FRESH },
    ],
  });
  assert.deepEqual(result.include, []);
  for (const suite of ['QA Guardrails', 'WebKit Smoke Tests']) {
    const decision = decisionFor(result, suite);
    assert.equal(decision.decision, 'skip');
    assert.equal(decision.classification, 'terminal-failure');
    assert.equal(decision.terminal, true);
    assert.notEqual(decision.classification, 'missing');
    assert.match(decision.reason, /deliberate re-run/i);
  }
}
// cancelled / timed_out are also terminal negative results.
{
  const result = plan({
    prs: [pr()],
    checkRuns: [
      { name: 'QA Guardrails', headSha: 'sha-a', status: 'completed', conclusion: 'cancelled', startedAt: FRESH },
      { name: 'WebKit Smoke Tests', headSha: 'sha-a', status: 'completed', conclusion: 'timed_out', startedAt: FRESH },
    ],
  });
  assert.deepEqual(result.include, []);
  assert.equal(decisionFor(result, 'QA Guardrails').classification, 'terminal-failure');
  assert.equal(decisionFor(result, 'WebKit Smoke Tests').classification, 'terminal-failure');
}

// ---------------------------------------------------------------------------
// Case 12 — active run within freshness window: never duplicate.
// ---------------------------------------------------------------------------
{
  const result = plan({
    prs: [pr()],
    workflowRuns: [
      { workflow: 'qa-guardrails.yml', headSha: 'sha-a', status: 'in_progress', startedAt: FRESH },
      { workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'in_progress', startedAt: FRESH },
    ],
  });
  assert.deepEqual(result.include, []);
  assert.equal(decisionFor(result, 'QA Guardrails').classification, 'active-fresh');
  assert.equal(decisionFor(result, 'WebKit Smoke Tests').classification, 'active-fresh');
}

// ---------------------------------------------------------------------------
// Case 13 — stale active run: classify stale and allow recovery.
// ---------------------------------------------------------------------------
{
  const result = plan({
    prs: [pr()],
    workflowRuns: [
      { workflow: 'qa-guardrails.yml', headSha: 'sha-a', status: 'in_progress', startedAt: STALE },
      { workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'queued', startedAt: STALE },
    ],
  });
  assert.deepEqual(suiteNames(result), ['QA Guardrails', 'WebKit Smoke Tests']);
  assert.equal(decisionFor(result, 'QA Guardrails').classification, 'active-stale');
  assert.equal(decisionFor(result, 'WebKit Smoke Tests').classification, 'active-stale');
  assert.equal(decisionFor(result, 'QA Guardrails').decision, 'run');
}

// Deterministic boundary of the stale threshold (fresh just below, stale just above).
{
  const justBelow = new Date(NOW - (STALE_ACTIVE_MS - 60 * 1000)).toISOString();
  const justAbove = new Date(NOW - (STALE_ACTIVE_MS + 60 * 1000)).toISOString();
  const below = plan({
    prs: [pr({ changedFiles: ['index.html'] })],
    workflowRuns: [{ workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'in_progress', startedAt: justBelow }],
  });
  assert.equal(decisionFor(below, 'WebKit Smoke Tests').classification, 'active-fresh');
  const above = plan({
    prs: [pr({ changedFiles: ['index.html'] })],
    workflowRuns: [{ workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'in_progress', startedAt: justAbove }],
  });
  assert.equal(decisionFor(above, 'WebKit Smoke Tests').classification, 'active-stale');
}

// ---------------------------------------------------------------------------
// Case 14 — SHA changed: prior-SHA evidence never validates the new SHA.
// ---------------------------------------------------------------------------
{
  const result = plan({
    prs: [pr({ headSha: 'sha-b' })],
    checkRuns: [
      { name: 'QA Guardrails', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
      { name: 'WebKit Smoke Tests', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
    ],
    workflowRuns: [
      { workflow: 'qa-guardrails.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
      { workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
    ],
  });
  assert.deepEqual(suiteNames(result), ['QA Guardrails', 'WebKit Smoke Tests']);
  for (const item of result.include) assert.equal(item.head_sha, 'sha-b');
}

// ---------------------------------------------------------------------------
// Case 15 — active run without a timestamp: conservative, never invent stale.
// ---------------------------------------------------------------------------
{
  const result = plan({
    prs: [pr()],
    workflowRuns: [
      { workflow: 'qa-guardrails.yml', headSha: 'sha-a', status: 'in_progress' },
      { workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'in_progress' },
    ],
  });
  assert.deepEqual(result.include, []);
  assert.equal(decisionFor(result, 'QA Guardrails').classification, 'active-fresh');
  assert.equal(decisionFor(result, 'WebKit Smoke Tests').classification, 'active-fresh');
}

// ---------------------------------------------------------------------------
// Case 16 — draft / fork: preserve existing safe skip behavior.
// ---------------------------------------------------------------------------
{
  const result = plan({ prs: [pr({ draft: true }), pr({ number: 473, headRepoFullName: 'someone/fork' })] });
  assert.deepEqual(result.include, []);
  assert.match(result.decisions[0].reason, /draft/);
  assert.match(result.decisions[1].reason, /external head repository/);
}

// ---------------------------------------------------------------------------
// Mixed suite state: WebKit success but QA missing → only QA runs.
// ---------------------------------------------------------------------------
{
  const result = plan({
    prs: [pr()],
    workflowRuns: [
      { workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success', startedAt: FRESH },
    ],
  });
  assert.deepEqual(suiteNames(result), ['QA Guardrails']);
}

// ---------------------------------------------------------------------------
// PR title/body integrity through the matrix (multiline + special chars).
// ---------------------------------------------------------------------------
{
  const title = 'v8z4b32E8O — fix(stage): preserva "metadados" & QA';
  const body = [
    'Linha 1 com acento: ação.',
    'Linha 2 com aspas: "valor" e apóstrofo: \'ok\'.',
    'Linha 3 com caractere especial e emoji: <>& 🚀',
  ].join('\n');
  const result = plan({ prs: [pr({ title, body })] });
  for (const item of result.include) {
    assert.equal(item.pr_title, title);
    assert.equal(item.pr_body, body);
    assert.notEqual(item.pr_title, '');
    assert.notEqual(item.pr_body, '');
  }
  const matrix = JSON.stringify({ include: result.include });
  const parsed = JSON.parse(matrix);
  assert.equal(parsed.include[0].pr_title, title);
  assert.equal(parsed.include[0].pr_body, body);
}

// ---------------------------------------------------------------------------
// Version policy remains intact (unchanged behavior).
// ---------------------------------------------------------------------------
{
  const title = 'v8z4b32E8O — fix(stage): restaura geometry';
  const body = 'Body multilinha\ncom detalhes reais da PR.';
  const result = validateVersionPolicy({
    headHtml: htmlWithVersion('v8z4b32E8O'),
    baseHtml: htmlWithVersion('v8z4b32E8N'),
    files: ['index.html'],
    prText: [title, body].join('\n'),
  });
  assert.equal(result.currentVersion, 'v8z4b32E8O');
}
{
  assert.throws(() => validateVersionPolicy({
    headHtml: htmlWithVersion('v8z4b32E8O'),
    baseHtml: htmlWithVersion('v8z4b32E8N'),
    files: ['index.html'],
    prText: ['v8z4b32E8N — wrong title', 'body sem a versão correta'].join('\n'),
  }), /does not declare the head app version/);
}

// ---------------------------------------------------------------------------
// buildFinalCheckRunUpdate SHA policy remains intact (must not be weakened).
// ---------------------------------------------------------------------------
{
  const success = buildFinalCheckRunUpdate({
    suiteName: 'QA Guardrails',
    prNumber: 472,
    plannedHeadSha: 'sha-a',
    currentHeadSha: 'sha-a',
    jobStatus: 'success',
  });
  assert.equal(success.status, 'completed');
  assert.equal(success.conclusion, 'success');

  const failure = buildFinalCheckRunUpdate({
    suiteName: 'QA Guardrails',
    prNumber: 472,
    plannedHeadSha: 'sha-a',
    currentHeadSha: 'sha-a',
    jobStatus: 'failure',
  });
  assert.equal(failure.status, 'completed');
  assert.equal(failure.conclusion, 'failure');

  const stale = buildFinalCheckRunUpdate({
    suiteName: 'WebKit Smoke Tests',
    prNumber: 472,
    plannedHeadSha: 'sha-a',
    currentHeadSha: 'sha-b',
    jobStatus: 'success',
  });
  assert.equal(stale.status, 'completed');
  assert.equal(stale.conclusion, 'neutral');
  assert.match(stale.output.summary, /does not validate the new SHA/);

  const cancelled = buildFinalCheckRunUpdate({
    suiteName: 'WebKit Smoke Tests',
    prNumber: 472,
    plannedHeadSha: 'sha-a',
    currentHeadSha: 'sha-a',
    jobStatus: 'cancelled',
  });
  assert.equal(cancelled.status, 'completed');
  assert.equal(cancelled.conclusion, 'cancelled');
}

// ---------------------------------------------------------------------------
// Workflow wiring: canonical WebKit command, bounded install, PR metadata env.
// ---------------------------------------------------------------------------
{
  const workflow = readFileSync(path.join(repoRoot, '.github/workflows/mobile-ci-watchdog.yml'), 'utf8');
  assert.match(workflow, /QA_PR_TITLE: \$\{\{ matrix\.pr_title \}\}/);
  assert.match(workflow, /QA_PR_BODY: \$\{\{ matrix\.pr_body \}\}/);
  assert.ok(workflow.indexOf('Run WebKit smoke tests') < workflow.indexOf('Finalize PR HEAD check run'));
  assert.ok(workflow.indexOf('Markdown links') < workflow.indexOf('Finalize PR HEAD check run'));
  // Canonical WebKit suite parity with smoke-tests.yml.
  assert.match(workflow, /npx playwright test --project=webkit-mobile-smoke --workers=1 --retries=0/);
  assert.ok(!/run: npx playwright test\s*$/m.test(workflow), 'watchdog must not run a generic playwright test');
  // Bounded install + explicit recovery timeout.
  assert.match(workflow, /timeout 12m npx playwright install --with-deps webkit/);
  assert.match(workflow, /timeout-minutes: 25/);
}
{
  const smoke = readFileSync(path.join(repoRoot, '.github/workflows/smoke-tests.yml'), 'utf8');
  // WebKit/Linux job timeout + bounded install.
  assert.match(smoke, /timeout-minutes: 25/);
  assert.match(smoke, /timeout 12m npx playwright install --with-deps webkit/);
  // Conservative non-runtime paths-ignore that keeps runtime files applicable.
  assert.match(smoke, /paths-ignore:/);
  assert.match(smoke, /- 'docs\/\*\*'/);
  assert.match(smoke, /- '\.agents\/\*\*'/);
  assert.match(smoke, /- '\.claude\/\*\*'/);
  // Must NOT ignore runtime paths: no ignore-list ENTRY for runtime files.
  assert.ok(!/^\s*-\s*'index\.html'/m.test(smoke), 'index.html must never be an ignore-list entry');
  assert.ok(!/^\s*-\s*'tests\/\*\*'/m.test(smoke), 'tests/** must never be an ignore-list entry');
  assert.ok(!/^\s*-\s*'package(-lock)?\.json'/m.test(smoke), 'package files must never be an ignore-list entry');
}

console.log('Mobile CI watchdog self-tests passed.');
