import path from 'node:path';
import { fail, fileExists, getBaseSha, getHeadSha, git, gitMaybe } from './lib.mjs';

try {
  const baseSha = getBaseSha();
  const headSha = getHeadSha();
  if (baseSha) git(['diff', '--check', `${baseSha}...${headSha}`], { stderr: 'inherit' });
  git(['diff', '--check'], { stderr: 'inherit' });
} catch {
  fail('git diff --check found whitespace or conflict-marker issues.');
}

const requiredFiles = [
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

const missing = requiredFiles.filter((file) => !fileExists(file));
if (missing.length) fail('required repository files are missing.', missing);

const tracked = git(['ls-files']).split('\n').filter(Boolean);
const dsStore = tracked.filter((file) => path.basename(file) === '.DS_Store');
if (dsStore.length) fail('tracked .DS_Store files are not allowed.', dsStore);

const rootHtml = tracked.filter((file) => path.dirname(file) === '.' && path.extname(file) === '.html');
const unauthorizedRootHtml = rootHtml.filter((file) => file !== 'index.html');
if (unauthorizedRootHtml.length) {
  fail('parallel HTML files tracked at repository root are not allowed.', unauthorizedRootHtml);
}

const untrackedDsStore = gitMaybe(['ls-files', '--others', '--exclude-standard', '--', '.DS_Store', '*/.DS_Store']);
if (untrackedDsStore) {
  console.warn('Ignoring untracked local .DS_Store files; GitHub runners will not see them.');
}

console.log('Repository state guardrail passed.');
