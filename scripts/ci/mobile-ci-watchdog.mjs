#!/usr/bin/env node

import { appendFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const suites = [
  {
    id: 'qa-guardrails',
    name: 'QA Guardrails',
    workflow: 'qa-guardrails.yml',
    command: 'node scripts/qa/run-self-tests.mjs && node scripts/qa/check-repository-state.mjs && node scripts/qa/check-app-version.mjs && node scripts/qa/check-ui-leakage.mjs && node scripts/qa/check-project-os.mjs && node scripts/qa/check-markdown-links.mjs',
  },
  {
    id: 'webkit-smoke-tests',
    name: 'WebKit Smoke Tests',
    workflow: 'smoke-tests.yml',
    command: 'npm ci && npx playwright install --with-deps webkit && npx playwright test',
  },
];

function stableRuns(runs = []) {
  return runs.filter((run) => ['queued', 'in_progress', 'completed', 'waiting', 'requested', 'pending'].includes(run.status));
}

function statusLabel(runs = []) {
  if (!runs.length) return 'missing';
  return runs
    .map((run) => `${run.source || 'run'}:${run.status}${run.conclusion ? `/${run.conclusion}` : ''}`)
    .join(', ');
}

export function planWatchdog({ prs, workflowRuns = [], checkRuns = [], repository }) {
  const include = [];
  const decisions = [];

  for (const pr of prs) {
    const base = pr.baseRefName || pr.base?.ref;
    const headSha = pr.headSha || pr.head?.sha;
    const headRef = pr.headRefName || pr.head?.ref;
    const baseSha = pr.baseSha || pr.base?.sha || '';
    const headRepo = pr.headRepoFullName || pr.head?.repo?.full_name || repository;
    const prNumber = pr.number;

    if (base !== 'main') {
      decisions.push({ pr: prNumber, decision: 'skip', reason: `base is ${base}`, headSha });
      continue;
    }
    if (pr.draft) {
      decisions.push({ pr: prNumber, decision: 'skip', reason: 'draft PR', headSha });
      continue;
    }
    if (repository && headRepo !== repository) {
      decisions.push({ pr: prNumber, decision: 'skip', reason: `external head repository ${headRepo}`, headSha });
      continue;
    }
    if (!headSha) {
      decisions.push({ pr: prNumber, decision: 'skip', reason: 'missing head SHA', headSha });
      continue;
    }

    for (const suite of suites) {
      const existingWorkflowRuns = stableRuns(workflowRuns.filter((run) => (
        run.headSha === headSha && run.workflow === suite.workflow
      ))).map((run) => ({ ...run, source: suite.workflow }));
      const existingCheckRuns = stableRuns(checkRuns.filter((run) => (
        run.headSha === headSha && run.name === suite.name
      ))).map((run) => ({ ...run, source: suite.name }));
      const existing = [...existingWorkflowRuns, ...existingCheckRuns];
      const status = statusLabel(existing);

      if (existing.length) {
        decisions.push({
          pr: prNumber,
          suite: suite.name,
          decision: 'skip',
          reason: `already has ${status}`,
          headSha,
          base,
          headRef,
        });
        continue;
      }

      decisions.push({
        pr: prNumber,
        suite: suite.name,
        decision: 'run',
        reason: 'missing for current head SHA',
        headSha,
        base,
        headRef,
      });
      include.push({
        suite_id: suite.id,
        suite_name: suite.name,
        suite_command: suite.command,
        pr_number: prNumber,
        base_ref: base,
        base_sha: baseSha,
        head_ref: headRef,
        head_sha: headSha,
      });
    }
  }

  return { include, decisions };
}

async function githubRequest(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token) throw new Error('GITHUB_TOKEN is required.');
  if (!repository) throw new Error('GITHUB_REPOSITORY is required.');

  const url = path.startsWith('http') ? path : `https://api.github.com${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${options.method || 'GET'} ${url} failed: ${response.status} ${body}`);
  }
  if (response.status === 204) return {};
  return response.json();
}

async function listOpenPullRequests(repository) {
  const pulls = [];
  let page = 1;
  while (true) {
    const batch = await githubRequest(`/repos/${repository}/pulls?state=open&base=main&per_page=100&page=${page}`);
    pulls.push(...batch);
    if (batch.length < 100) return pulls;
    page += 1;
  }
}

async function listWorkflowRuns(repository, prPlans) {
  const runs = [];
  const seen = new Set();
  for (const plan of prPlans) {
    for (const suite of suites) {
      const key = `${suite.workflow}:${plan.head_sha}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const response = await githubRequest(`/repos/${repository}/actions/workflows/${suite.workflow}/runs?head_sha=${plan.head_sha}&per_page=20`);
      for (const run of response.workflow_runs || []) {
        runs.push({
          workflow: suite.workflow,
          headSha: run.head_sha,
          status: run.status,
          conclusion: run.conclusion,
          htmlUrl: run.html_url,
        });
      }
    }
  }
  return runs;
}

async function listCheckRuns(repository, prPlans) {
  const runs = [];
  const seen = new Set();
  for (const plan of prPlans) {
    if (seen.has(plan.head_sha)) continue;
    seen.add(plan.head_sha);
    const response = await githubRequest(`/repos/${repository}/commits/${plan.head_sha}/check-runs?per_page=100`);
    for (const run of response.check_runs || []) {
      runs.push({
        name: run.name,
        headSha: plan.head_sha,
        status: run.status,
        conclusion: run.conclusion,
        htmlUrl: run.html_url,
      });
    }
  }
  return runs;
}

async function createCheckRun(item) {
  const repository = process.env.GITHUB_REPOSITORY;
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${repository}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const check = await githubRequest(`/repos/${repository}/check-runs`, {
    method: 'POST',
    body: JSON.stringify({
      name: item.suite_name,
      head_sha: item.head_sha,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      details_url: runUrl,
      output: {
        title: `${item.suite_name} scheduled by OPS-04`,
        summary: [
          `PR #${item.pr_number}`,
          `base: ${item.base_ref}`,
          `head: ${item.head_ref}`,
          `SHA: ${item.head_sha}`,
          'The OPS-04 mobile CI watchdog created this check because the required suite was missing for the current PR HEAD.',
        ].join('\n'),
      },
    }),
  });
  return check.id;
}

function writeGithubOutput(values) {
  const output = process.env.GITHUB_OUTPUT;
  if (!output) return;
  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`);
  appendFileSync(output, `${lines.join('\n')}\n`);
}

async function planLive() {
  const repository = process.env.GITHUB_REPOSITORY;
  const pulls = await listOpenPullRequests(repository);
  const prPlans = pulls.map((pr) => ({
    number: pr.number,
    draft: pr.draft,
    baseRefName: pr.base?.ref,
    baseSha: pr.base?.sha,
    headRefName: pr.head?.ref,
    headSha: pr.head?.sha,
    headRepoFullName: pr.head?.repo?.full_name,
  }));
  const workflowRuns = await listWorkflowRuns(repository, prPlans);
  const checkRuns = await listCheckRuns(repository, prPlans);
  const plan = planWatchdog({ prs: prPlans, workflowRuns, checkRuns, repository });

  for (const decision of plan.decisions) {
    console.log(`PR #${decision.pr} ${decision.suite || ''} ${decision.headSha || ''}: ${decision.decision} - ${decision.reason}`);
  }

  for (const item of plan.include) {
    item.check_run_id = await createCheckRun(item);
    console.log(`PR #${item.pr_number} ${item.suite_name}: created check run ${item.check_run_id} for ${item.head_sha}`);
  }

  const matrix = JSON.stringify({ include: plan.include });
  writeGithubOutput({
    matrix,
    has_work: plan.include.length ? 'true' : 'false',
  });
  console.log(matrix);
}

async function finalizeLive() {
  const repository = process.env.GITHUB_REPOSITORY;
  const checkRunId = process.env.WATCHDOG_CHECK_RUN_ID;
  const prNumber = process.env.WATCHDOG_PR_NUMBER;
  const headSha = process.env.WATCHDOG_HEAD_SHA;
  const suiteName = process.env.WATCHDOG_SUITE_NAME;
  const jobStatus = process.env.WATCHDOG_JOB_STATUS || 'failure';
  if (!checkRunId) throw new Error('WATCHDOG_CHECK_RUN_ID is required.');

  const pr = await githubRequest(`/repos/${repository}/pulls/${prNumber}`);
  const currentHeadSha = pr.head?.sha;
  const stale = currentHeadSha !== headSha;
  const conclusion = stale ? 'neutral' : (jobStatus === 'success' ? 'success' : 'failure');
  const title = stale ? `${suiteName} skipped stale SHA` : `${suiteName} ${conclusion}`;
  const summary = [
    `PR #${prNumber}`,
    `planned SHA: ${headSha}`,
    `current PR SHA: ${currentHeadSha}`,
    `job status: ${jobStatus}`,
    stale ? 'The PR HEAD changed during execution. This result does not validate the new SHA.' : `The suite finished for the planned PR HEAD SHA.`,
  ].join('\n');

  await githubRequest(`/repos/${repository}/check-runs/${checkRunId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'completed',
      completed_at: new Date().toISOString(),
      conclusion,
      output: { title, summary },
    }),
  });
  console.log(`Finalized check run ${checkRunId} for PR #${prNumber}: ${conclusion}`);
  if (stale) console.log(`Detected SHA change during execution: planned ${headSha}, current ${currentHeadSha}`);
}

function planFixture(file) {
  const fixture = JSON.parse(readFileSync(file, 'utf8'));
  const plan = planWatchdog(fixture);
  console.log(JSON.stringify(plan, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv[2] || 'plan';
  if (command === 'fixture-plan') {
    planFixture(process.argv[3]);
  } else if (command === 'plan') {
    await planLive();
  } else if (command === 'finalize') {
    await finalizeLive();
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}
