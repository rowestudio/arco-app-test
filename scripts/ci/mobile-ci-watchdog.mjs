#!/usr/bin/env node

import { appendFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Canonical WebKit functional gate command, identical to the Browser Smoke workflow
// (.github/workflows/smoke-tests.yml). The watchdog recovery must run exactly this
// suite, never a broader generic `npx playwright test` that would also pull in the
// macOS-only export project.
const WEBKIT_FUNCTIONAL_COMMAND = 'npx playwright test --project=webkit-mobile-smoke --workers=1 --retries=0';

// The WebKit/Linux install is bounded with a portable coreutils `timeout` so a hung
// download can never leave a PR check pending for hours. 12 minutes is comfortably
// above the normal install (~2-4 min) while staying well under the job cap.
const WEBKIT_INSTALL_COMMAND = 'timeout 12m npx playwright install --with-deps webkit';

// A queued/in_progress run older than this is treated as stale and no longer blocks
// recovery. The WebKit/Linux job caps at 25 minutes (`timeout-minutes` in
// smoke-tests.yml); 60 minutes is >2x that cap plus generous queue margin, so a
// healthy run always reaches a terminal state (success/failure) before it could be
// misclassified as stale.
export const STALE_ACTIVE_MS = 60 * 60 * 1000;

const ACTIVE_STATUSES = ['queued', 'in_progress', 'waiting', 'requested', 'pending'];

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
    command: `npm ci && ${WEBKIT_INSTALL_COMMAND} && ${WEBKIT_FUNCTIONAL_COMMAND}`,
  },
];

// Non-runtime allowlist. Mirrors the conservative `paths-ignore` filter in
// .github/workflows/smoke-tests.yml. A file is non-runtime only when it is
// unambiguously documentation, project policy, or agent instructions:
//   - anything under docs/
//   - anything under .agents/ or .claude/
//   - any Markdown file (root or nested), e.g. AGENTS.md, CLAUDE.md, README.md
// Any other path (index.html, runtime assets, package/lock, Playwright config,
// tests/**, .github/workflows/**, scripts/**, or an unrecognized file) is runtime
// and keeps the WebKit suite applicable.
function isNonRuntimeFile(file) {
  if (typeof file !== 'string' || file.length === 0) return false;
  if (file.startsWith('docs/')) return true;
  if (file.startsWith('.agents/')) return true;
  if (file.startsWith('.claude/')) return true;
  if (/\.md$/i.test(file)) return true;
  return false;
}

// WebKit is applicable unless the PR is proven to touch only non-runtime files.
// When the changed-file list cannot be obtained (null/undefined) or is empty/ambiguous,
// WebKit stays applicable for safety — a documental skip must be positively proven.
export function isWebKitSuiteApplicable(changedFiles) {
  if (!Array.isArray(changedFiles) || changedFiles.length === 0) return true;
  return !changedFiles.every((file) => isNonRuntimeFile(file));
}

function suiteApplicable(suite, pr) {
  if (suite.id === 'webkit-smoke-tests') return isWebKitSuiteApplicable(pr.changedFiles);
  return true;
}

// Classify a single run for the current HEAD SHA into one of:
//   success | terminal-failure | active-fresh | active-stale
// Only completed and recognized active statuses reach this function.
function classifyRun(run, { now, staleThresholdMs }) {
  if (run.status === 'completed') {
    return run.conclusion === 'success' ? 'success' : 'terminal-failure';
  }
  // Active status. Decide fresh vs stale from the run timestamp.
  const startedAt = run.startedAt ? Date.parse(run.startedAt) : NaN;
  if (Number.isFinite(startedAt)) {
    const age = now - startedAt;
    if (age > staleThresholdMs) return 'active-stale';
    return 'active-fresh';
  }
  // Missing/unparseable timestamp: never invent staleness — treat as an active
  // fresh run so duplicate protection still applies conservatively.
  return 'active-fresh';
}

// Aggregate the runs for one suite/SHA into a single state with explicit precedence:
//   success > active-fresh > terminal-failure > active-stale > missing
// Precedence rationale:
//   - a completed success satisfies the SHA;
//   - a fresh active run means recovery would only duplicate work;
//   - a terminal failure is a definitive negative result that must NOT trigger an
//     automatic rerun loop (it requires deliberate investigation/re-run);
//   - only a purely stale active run (no success, no fresh retry, no terminal result)
//     unblocks recovery, alongside a genuinely missing suite.
function classifySuiteState(runs, opts) {
  const recognized = runs.filter((run) => (
    run.status === 'completed' || ACTIVE_STATUSES.includes(run.status)
  ));
  if (!recognized.length) return 'missing';
  const categories = recognized.map((run) => classifyRun(run, opts));
  if (categories.includes('success')) return 'success';
  if (categories.includes('active-fresh')) return 'active-fresh';
  if (categories.includes('terminal-failure')) return 'terminal-failure';
  if (categories.includes('active-stale')) return 'active-stale';
  return 'missing';
}

function statusLabel(runs = []) {
  if (!runs.length) return 'missing';
  return runs
    .map((run) => `${run.source || 'run'}:${run.status}${run.conclusion ? `/${run.conclusion}` : ''}`)
    .join(', ');
}

export function planWatchdog({
  prs,
  workflowRuns = [],
  checkRuns = [],
  repository,
  now = Date.now(),
  staleThresholdMs = STALE_ACTIVE_MS,
}) {
  const include = [];
  const decisions = [];
  const opts = { now, staleThresholdMs };

  for (const pr of prs) {
    const prTitle = pr.title || '';
    const prBody = pr.body || '';
    const base = pr.baseRefName || pr.base?.ref;
    const headSha = pr.headSha || pr.head?.sha;
    const headRef = pr.headRefName || pr.head?.ref;
    const baseSha = pr.baseSha || pr.base?.sha || '';
    const headRepo = pr.headRepoFullName || pr.head?.repo?.full_name || repository;
    const prNumber = pr.number;

    if (base !== 'main') {
      decisions.push({ pr: prNumber, decision: 'skip', classification: 'ineligible', reason: `base is ${base}`, headSha });
      continue;
    }
    if (pr.draft) {
      decisions.push({ pr: prNumber, decision: 'skip', classification: 'ineligible', reason: 'draft PR', headSha });
      continue;
    }
    if (repository && headRepo !== repository) {
      decisions.push({ pr: prNumber, decision: 'skip', classification: 'ineligible', reason: `external head repository ${headRepo}`, headSha });
      continue;
    }
    if (!headSha) {
      decisions.push({ pr: prNumber, decision: 'skip', classification: 'ineligible', reason: 'missing head SHA', headSha });
      continue;
    }

    for (const suite of suites) {
      const decisionBase = { pr: prNumber, suite: suite.name, headSha, base, headRef };

      if (!suiteApplicable(suite, pr)) {
        decisions.push({
          ...decisionBase,
          decision: 'skip',
          classification: 'not-applicable',
          reason: 'not applicable: non-runtime-only PR',
        });
        continue;
      }

      const existingWorkflowRuns = workflowRuns
        .filter((run) => run.headSha === headSha && run.workflow === suite.workflow)
        .map((run) => ({ ...run, source: suite.workflow }));
      const existingCheckRuns = checkRuns
        .filter((run) => run.headSha === headSha && run.name === suite.name)
        .map((run) => ({ ...run, source: suite.name }));
      const existing = [...existingWorkflowRuns, ...existingCheckRuns];
      const state = classifySuiteState(existing, opts);
      const label = statusLabel(existing);

      if (state === 'success') {
        decisions.push({ ...decisionBase, decision: 'skip', classification: 'success', reason: `completed success for current HEAD SHA (${label})` });
        continue;
      }
      if (state === 'active-fresh') {
        decisions.push({ ...decisionBase, decision: 'skip', classification: 'active-fresh', reason: `active run within freshness window (${label})` });
        continue;
      }
      if (state === 'terminal-failure') {
        decisions.push({
          ...decisionBase,
          decision: 'skip',
          classification: 'terminal-failure',
          terminal: true,
          reason: `terminal negative result exists; deliberate re-run required, no automatic rerun loop (${label})`,
        });
        continue;
      }

      const reason = state === 'active-stale'
        ? `active run exceeded stale threshold (${Math.round(staleThresholdMs / 60000)}m); recovering (${label})`
        : 'missing for current head SHA';
      decisions.push({ ...decisionBase, decision: 'run', classification: state, reason });
      include.push({
        suite_id: suite.id,
        suite_name: suite.name,
        suite_command: suite.command,
        pr_number: prNumber,
        base_ref: base,
        base_sha: baseSha,
        head_ref: headRef,
        head_sha: headSha,
        pr_title: prTitle,
        pr_body: prBody,
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

// Read-only collection of the real changed-file list for a PR, with pagination.
// Uses the workflow GITHUB_TOKEN (no personal token). On any failure the caller keeps
// changedFiles null so the WebKit suite stays applicable for safety.
async function listChangedFiles(repository, prNumber) {
  const files = [];
  let page = 1;
  while (true) {
    const batch = await githubRequest(`/repos/${repository}/pulls/${prNumber}/files?per_page=100&page=${page}`);
    for (const file of batch) files.push(file.filename);
    if (batch.length < 100) return files;
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
          startedAt: run.run_started_at || run.created_at,
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
        startedAt: run.started_at,
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
  const prPlans = [];
  for (const pr of pulls) {
    let changedFiles = null;
    try {
      changedFiles = await listChangedFiles(repository, pr.number);
    } catch (error) {
      console.log(`PR #${pr.number}: could not list changed files (${error.message}); WebKit stays applicable for safety.`);
      changedFiles = null;
    }
    prPlans.push({
      number: pr.number,
      title: pr.title || '',
      body: pr.body || '',
      draft: pr.draft,
      baseRefName: pr.base?.ref,
      baseSha: pr.base?.sha,
      headRefName: pr.head?.ref,
      headSha: pr.head?.sha,
      headRepoFullName: pr.head?.repo?.full_name,
      changedFiles,
    });
  }
  // Reuse the head SHA plans for run/check lookups.
  const lookupPlans = prPlans
    .filter((pr) => pr.headSha)
    .map((pr) => ({ head_sha: pr.headSha }));
  const workflowRuns = await listWorkflowRuns(repository, lookupPlans);
  const checkRuns = await listCheckRuns(repository, lookupPlans);
  const plan = planWatchdog({ prs: prPlans, workflowRuns, checkRuns, repository });

  for (const decision of plan.decisions) {
    console.log(`PR #${decision.pr} ${decision.suite || ''} ${decision.headSha || ''}: ${decision.decision} [${decision.classification || 'n/a'}] - ${decision.reason}`);
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

export function buildFinalCheckRunUpdate({ suiteName, prNumber, plannedHeadSha, currentHeadSha, jobStatus }) {
  const stale = currentHeadSha !== plannedHeadSha;
  const conclusion = stale
    ? 'neutral'
    : (jobStatus === 'success' ? 'success' : (jobStatus === 'cancelled' ? 'cancelled' : 'failure'));
  const title = stale ? `${suiteName} skipped stale SHA` : `${suiteName} ${conclusion}`;
  const summary = [
    `PR #${prNumber}`,
    `planned SHA: ${plannedHeadSha}`,
    `current PR SHA: ${currentHeadSha}`,
    `job status: ${jobStatus}`,
    stale ? 'The PR HEAD changed during execution. This result does not validate the new SHA.' : 'The suite finished for the planned PR HEAD SHA.',
  ].join('\n');

  return {
    status: 'completed',
    completed_at: new Date().toISOString(),
    conclusion,
    output: { title, summary },
  };
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
  const update = buildFinalCheckRunUpdate({
    suiteName,
    prNumber,
    plannedHeadSha: headSha,
    currentHeadSha,
    jobStatus,
  });

  await githubRequest(`/repos/${repository}/check-runs/${checkRunId}`, {
    method: 'PATCH',
    body: JSON.stringify(update),
  });
  console.log(`Finalized check run ${checkRunId} for PR #${prNumber}: ${update.conclusion}`);
  if (update.conclusion === 'neutral') console.log(`Detected SHA change during execution: planned ${headSha}, current ${currentHeadSha}`);
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
