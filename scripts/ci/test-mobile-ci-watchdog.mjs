#!/usr/bin/env node

import assert from 'node:assert/strict';
import { planWatchdog } from './mobile-ci-watchdog.mjs';

const repository = 'rowestudio/arco-app-test';
const pr = (overrides = {}) => ({
  number: 472,
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

console.log('Mobile CI watchdog self-tests passed.');
