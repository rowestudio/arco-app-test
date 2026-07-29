import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const node = process.execPath;
const fixtures = path.join(repoRoot, 'test-fixtures/qa-guardrails');
const scripts = path.join(repoRoot, 'scripts/qa');
const baseSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
const baseVersionFixture = path.join(fixtures, 'version-valid.html');

function runScript(script, options = {}) {
  const result = spawnSync(node, [path.join(scripts, script)], {
    cwd: options.cwd || repoRoot,
    env: {
      ...process.env,
      QA_BASE_SHA: baseSha,
      QA_HEAD_SHA: baseSha,
      QA_BASE_INDEX_HTML: baseVersionFixture,
      QA_CHANGED_FILES: '',
      ...options.env,
    },
    encoding: 'utf8',
  });
  return {
    code: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function expectCase(results, name, script, expectedCode, options = {}) {
  const result = runScript(script, options);
  const passed = result.code === expectedCode;
  results.push({ name, expectedCode, actualCode: result.code, passed });
  if (!passed) {
    console.error(`Self-test failed: ${name}`);
    console.error(`Expected exit ${expectedCode}, got ${result.code}`);
    if (result.stdout) console.error(result.stdout.trim());
    if (result.stderr) console.error(result.stderr.trim());
  }
}

function tempDir(prefix) {
  return mkdtempSync(path.join(tmpdir(), prefix));
}

function write(file, text) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, text);
}

function createProjectOsFixture(valid = true) {
  const dir = tempDir('arco-qa-project-os-');
  const docs = [
    'PROJECT_CONTEXT.md',
    'PROJECT_STATE.md',
    'ARCHITECTURE.md',
    'PRODUCT_RULES.md',
    'DECISIONS.md',
    'ROADMAP.md',
    'REGRESSIONS.md',
    'QA_STRATEGY.md',
    'TEST_CASES.md',
    'DEFINITION_OF_DONE.md',
    'PROMOTION_TO_PRODUCTION.md',
    'DOCUMENTATION_MAINTENANCE.md',
  ];
  const refs = docs.map((doc) => `docs/${doc}`).join('\n');
  write(path.join(dir, 'AGENTS.md'), `# AGENTS\n${refs}\n`);
  if (valid) write(path.join(dir, 'CLAUDE.md'), '# CLAUDE\nSee AGENTS.md.\n');
  for (const doc of docs) write(path.join(dir, 'docs', doc), `# ${doc}\n`);
  return dir;
}

function createRepositoryStateFixture(withTrackedDsStore = false) {
  const dir = tempDir('arco-qa-repo-state-');
  const files = [
    'index.html',
    'AGENTS.md',
    'CLAUDE.md',
    'docs/PROJECT_CONTEXT.md',
    'docs/PROJECT_STATE.md',
    'docs/ARCHITECTURE.md',
    'docs/PRODUCT_RULES.md',
    'docs/DECISIONS.md',
    'docs/ROADMAP.md',
    'docs/REGRESSIONS.md',
    'docs/QA_STRATEGY.md',
    'docs/TEST_CASES.md',
    'docs/DEFINITION_OF_DONE.md',
    'docs/PROMOTION_TO_PRODUCTION.md',
    'docs/DOCUMENTATION_MAINTENANCE.md',
  ];
  for (const file of files) write(path.join(dir, file), `fixture ${file}\n`);
  if (withTrackedDsStore) write(path.join(dir, '.DS_Store'), 'tracked metadata\n');
  execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'qa@example.invalid'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'QA Guardrails'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['add', '.'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: dir, stdio: 'ignore' });
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
  return { dir, sha };
}

function createVersionPolicyFixture(markerText) {
  const dir = tempDir('arco-qa-version-policy-');
  const base = path.join(dir, 'base.html');
  const head = path.join(dir, 'index.html');
  const html = `<!doctype html><html><body><script>
const APP_VERSION = 'v1A';
const APP_VERSION_NAME = 'v1A';
</script></body></html>`;
  write(base, html);
  write(head, html);
  return {
    dir,
    env: {
      QA_INDEX_HTML: head,
      QA_BASE_INDEX_HTML: base,
      QA_CHANGED_FILES: 'index.html',
      QA_PR_BODY: markerText,
    },
  };
}

const results = [];

const uiCases = [
  ['UI clean HTML passes', 'html-clean.html', 0],
  ['UI visible PROMPT fails', 'html-visible-prompt.html', 1],
  ['UI PROMPT in comment passes', 'html-comment-prompt.html', 0],
  ['UI PROMPT in script passes', 'html-script-prompt.html', 0],
  ['UI legitimate DIAGNÓSTICO passes', 'html-legitimate-diagnostic.html', 0],
  ['UI inline split PROMPT fails', 'html-split-tag-prompt.html', 1],
  ['UI larger DIAGNÓSTICO block fails', 'html-diagnostic-blocked.html', 1],
];

for (const [name, file, expected] of uiCases) {
  expectCase(results, name, 'check-ui-leakage.mjs', expected, {
    env: { QA_INDEX_HTML: path.join(fixtures, file) },
  });
}

const versionCases = [
  ['Version valid passes', 'version-valid.html', 0],
  ['APP_VERSION missing fails', 'version-missing.html', 1],
  ['APP_VERSION_NAME missing fails', 'version-name-missing.html', 1],
  ['Version divergent fails', 'version-divergent.html', 1],
  ['Version multiple active assignments fails', 'version-multiple.html', 1],
  ['Version only in comments fails', 'version-comment-only.html', 1],
  ['Version changelog comment trap passes', 'version-changelog-trap.html', 0],
];

for (const [name, file, expected] of versionCases) {
  expectCase(results, name, 'check-app-version.mjs', expected, {
    env: { QA_INDEX_HTML: path.join(fixtures, file) },
  });
}

const incidental = createVersionPolicyFixture('v1A exceção incidental sem marcador explícito');
expectCase(results, 'Version incidental exception word fails', 'check-app-version.mjs', 1, incidental);

const emptyMarker = createVersionPolicyFixture('v1A\nAPP_VERSION_EXCEPTION:');
expectCase(results, 'Version empty exception marker fails', 'check-app-version.mjs', 1, emptyMarker);

const validMarker = createVersionPolicyFixture('v1A\nAPP_VERSION_EXCEPTION: operação sem alteração funcional do app');
expectCase(results, 'Version explicit exception marker passes', 'check-app-version.mjs', 0, validMarker);

expectCase(results, 'Markdown valid link passes', 'check-markdown-links.mjs', 0, {
  env: { QA_MARKDOWN_FILES: path.join(fixtures, 'markdown-valid.md') },
});
expectCase(results, 'Markdown invalid link fails', 'check-markdown-links.mjs', 1, {
  env: { QA_MARKDOWN_FILES: path.join(fixtures, 'markdown-invalid.md') },
});

expectCase(results, 'Project OS minimal fixture passes', 'check-project-os.mjs', 0, {
  cwd: createProjectOsFixture(true),
});
expectCase(results, 'Project OS missing CLAUDE fails', 'check-project-os.mjs', 1, {
  cwd: createProjectOsFixture(false),
});

expectCase(results, 'Canonical asset selection fixture passes', 'check-canonical-asset-selection.mjs', 0, {
  env: {
    QA_CANONICAL_MODEL_ONLY: '1',
    QA_CANONICAL_SELECTION_FIXTURE: path.join(fixtures, 'canonical-asset-selection-valid.json'),
  },
});
expectCase(results, 'Canonical asset selection missing id fails', 'check-canonical-asset-selection.mjs', 1, {
  env: {
    QA_CANONICAL_MODEL_ONLY: '1',
    QA_CANONICAL_SELECTION_FIXTURE: path.join(fixtures, 'canonical-asset-selection-invalid.json'),
  },
});

const repositoryStateValid = createRepositoryStateFixture(false);
expectCase(results, 'Repository state minimal fixture passes', 'check-repository-state.mjs', 0, {
  cwd: repositoryStateValid.dir,
  env: { QA_BASE_SHA: repositoryStateValid.sha, QA_HEAD_SHA: repositoryStateValid.sha },
});
const repositoryStateInvalid = createRepositoryStateFixture(true);
expectCase(results, 'Repository state tracked .DS_Store fails', 'check-repository-state.mjs', 1, {
  cwd: repositoryStateInvalid.dir,
  env: { QA_BASE_SHA: repositoryStateInvalid.sha, QA_HEAD_SHA: repositoryStateInvalid.sha },
});

expectCase(results, 'Session autosave/restore implementation passes', 'check-session-autosave-restore.mjs', 0, {
  env: { QA_SESSION_AUTOSAVE_HTML: path.join(repoRoot, 'index.html') },
});
expectCase(results, 'Session autosave/restore incomplete fixture fails', 'check-session-autosave-restore.mjs', 1, {
  env: { QA_SESSION_AUTOSAVE_HTML: path.join(fixtures, 'session-autosave-invalid.html') },
});
expectCase(results, 'Session autosave New Project race is discarded', 'test-session-autosave-race.mjs', 0);
expectCase(results, 'Session autosave/Preview implementation passes', 'check-session-autosave-preview-isolation.mjs', 0, {
  env: { QA_SESSION_PREVIEW_HTML: path.join(repoRoot, 'index.html') },
});
expectCase(results, 'Session autosave/Preview valid fixture passes', 'check-session-autosave-preview-isolation.mjs', 0, {
  env: { QA_SESSION_PREVIEW_HTML: path.join(fixtures, 'session-autosave-preview-isolation-valid.html') },
});
expectCase(results, 'Session autosave/Preview anti-patterns fail', 'check-session-autosave-preview-isolation.mjs', 1, {
  env: { QA_SESSION_PREVIEW_HTML: path.join(fixtures, 'session-autosave-preview-isolation-invalid.html') },
});
expectCase(results, 'Frame transform dirty completion passes', 'check-session-autosave-preview-isolation.mjs', 0, {
  env: { QA_SESSION_PREVIEW_HTML: path.join(fixtures, 'session-autosave-preview-frame-transform-valid.html') },
});
expectCase(results, 'Frame transform without dirty completion fails', 'check-session-autosave-preview-isolation.mjs', 1, {
  env: { QA_SESSION_PREVIEW_HTML: path.join(fixtures, 'session-autosave-preview-frame-transform-invalid.html') },
});
expectCase(results, 'Persistent Reset/Format commands pass', 'check-session-autosave-preview-isolation.mjs', 0, {
  env: { QA_SESSION_PREVIEW_HTML: path.join(fixtures, 'session-autosave-persistent-commands-valid.html') },
});
expectCase(results, 'Persistent Reset/Format without dirty fail', 'check-session-autosave-preview-isolation.mjs', 1, {
  env: { QA_SESSION_PREVIEW_HTML: path.join(fixtures, 'session-autosave-persistent-commands-invalid.html') },
});
expectCase(results, 'Session autosave/Preview race behavior passes', 'test-session-autosave-preview-isolation.mjs', 0);

expectCase(results, 'Preview first-frame warm-up valid fixture passes', 'check-preview-first-frame-warmup.mjs', 0, {
  env: { QA_PREVIEW_WARMUP_HTML: path.join(fixtures, 'preview-first-frame-warmup-valid.html') },
});
expectCase(results, 'Preview first-frame warm-up anti-patterns fail', 'check-preview-first-frame-warmup.mjs', 1, {
  env: { QA_PREVIEW_WARMUP_HTML: path.join(fixtures, 'preview-first-frame-warmup-invalid.html') },
});

const passed = results.filter((result) => result.passed).length;
console.log(`QA guardrail self-tests: ${passed}/${results.length} expectations confirmed.`);
for (const result of results) {
  const marker = result.passed ? 'PASS' : 'FAIL';
  console.log(`${marker} ${result.name} (expected ${result.expectedCode}, got ${result.actualCode})`);
}

if (passed !== results.length) process.exit(1);
