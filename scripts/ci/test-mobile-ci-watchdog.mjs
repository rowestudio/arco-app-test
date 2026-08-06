#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateVersionPolicy } from '../qa/check-app-version.mjs';
import { buildFinalCheckRunUpdate, planWatchdog } from './mobile-ci-watchdog.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const repository = 'rowestudio/arco-app-test';
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

function suiteNames(plan) {
  return plan.include.map((item) => item.suite_name).sort();
}

function htmlWithVersion(version) {
  return `<!doctype html><html><body><script>
const APP_VERSION = '${version}';
const APP_VERSION_NAME = '${version}';
</script></body></html>`;
}

{
  const plan = planWatchdog({ repository, prs: [pr()] });
  assert.deepEqual(suiteNames(plan), ['QA Guardrails', 'WebKit Smoke Tests']);
  assert.equal(plan.decisions.filter((decision) => decision.decision === 'run').length, 2);
}

{
  const plan = planWatchdog({
    repository,
    prs: [pr()],
    checkRuns: [
      { name: 'QA Guardrails', headSha: 'sha-a', status: 'completed', conclusion: 'success' },
      { name: 'WebKit Smoke Tests', headSha: 'sha-a', status: 'completed', conclusion: 'failure' },
    ],
  });
  assert.deepEqual(plan.include, []);
  assert.equal(plan.decisions.filter((decision) => decision.decision === 'skip').length, 2);
}

{
  const plan = planWatchdog({
    repository,
    prs: [pr()],
    workflowRuns: [
      { workflow: 'qa-guardrails.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success' },
      { workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success' },
    ],
  });
  assert.deepEqual(plan.include, []);
}

{
  const plan = planWatchdog({
    repository,
    prs: [pr({ headSha: 'sha-b' })],
    checkRuns: [
      { name: 'QA Guardrails', headSha: 'sha-a', status: 'completed', conclusion: 'success' },
      { name: 'WebKit Smoke Tests', headSha: 'sha-a', status: 'completed', conclusion: 'success' },
    ],
  });
  assert.deepEqual(suiteNames(plan), ['QA Guardrails', 'WebKit Smoke Tests']);
}

{
  const plan = planWatchdog({
    repository,
    prs: [pr({ headSha: 'sha-b' })],
    workflowRuns: [
      { workflow: 'qa-guardrails.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success' },
      { workflow: 'smoke-tests.yml', headSha: 'sha-a', status: 'completed', conclusion: 'success' },
    ],
  });
  assert.deepEqual(suiteNames(plan), ['QA Guardrails', 'WebKit Smoke Tests']);
}

{
  const plan = planWatchdog({
    repository,
    prs: [pr()],
    workflowRuns: [
      { workflow: 'qa-guardrails.yml', headSha: 'sha-a', status: 'in_progress' },
    ],
  });
  assert.deepEqual(suiteNames(plan), ['WebKit Smoke Tests']);
}

{
  const plan = planWatchdog({
    repository,
    prs: [pr({ draft: true }), pr({ number: 473, headRepoFullName: 'someone/fork' })],
  });
  assert.deepEqual(plan.include, []);
  assert.match(plan.decisions[0].reason, /draft/);
  assert.match(plan.decisions[1].reason, /external head repository/);
}

{
  const title = 'v8z4b32E8O — fix(stage): preserva "metadados" & QA';
  const body = [
    'Linha 1 com acento: ação.',
    'Linha 2 com aspas: "valor" e apóstrofo: \'ok\'.',
    'Linha 3 com caractere especial e emoji: <>& 🚀',
  ].join('\n');
  const plan = planWatchdog({ repository, prs: [pr({ title, body })] });
  for (const item of plan.include) {
    assert.equal(item.pr_title, title);
    assert.equal(item.pr_body, body);
    assert.notEqual(item.pr_title, '');
    assert.notEqual(item.pr_body, '');
  }
  const matrix = JSON.stringify({ include: plan.include });
  const parsed = JSON.parse(matrix);
  assert.equal(parsed.include[0].pr_title, title);
  assert.equal(parsed.include[0].pr_body, body);
}

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

{
  const workflow = readFileSync(path.join(repoRoot, '.github/workflows/mobile-ci-watchdog.yml'), 'utf8');
  assert.match(workflow, /QA_PR_TITLE: \$\{\{ matrix\.pr_title \}\}/);
  assert.match(workflow, /QA_PR_BODY: \$\{\{ matrix\.pr_body \}\}/);
  assert.ok(workflow.indexOf('Run WebKit smoke tests') < workflow.indexOf('Finalize PR HEAD check run'));
  assert.ok(workflow.indexOf('Markdown links') < workflow.indexOf('Finalize PR HEAD check run'));
}

console.log('Mobile CI watchdog self-tests passed.');
