import path from 'node:path';
import { fail, fileExists, markdownLinkTargets, readText } from './lib.mjs';

const canonicalDocs = [
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

const missing = canonicalDocs.filter((file) => !fileExists(file));
if (missing.length) fail('canonical Project OS documents are missing.', missing);

const claude = readText('CLAUDE.md');
if (!/AGENTS\.md/.test(claude)) fail('CLAUDE.md must reference AGENTS.md.');

const agents = readText('AGENTS.md');
const missingAgentsRefs = canonicalDocs
  .filter((file) => file !== 'AGENTS.md' && file !== 'CLAUDE.md')
  .filter((file) => !agents.includes(file));
if (missingAgentsRefs.length) {
  fail('AGENTS.md must reference the mandatory Project OS documents.', missingAgentsRefs);
}

const brokenLinks = [];
for (const file of canonicalDocs) {
  const text = readText(file);
  const baseDir = path.dirname(file);
  for (const target of markdownLinkTargets(text)) {
    const resolved = path.normalize(path.join(baseDir, target));
    if (!fileExists(resolved)) brokenLinks.push(`${file} -> ${target}`);
  }
}
if (brokenLinks.length) fail('broken relative markdown links found in canonical Project OS docs.', brokenLinks);

const historicalWarnings = [];
for (const file of canonicalDocs) {
  const text = readText(file);
  if (/OBSOLETO|REFER[ÊE]NCIA HIST[ÓO]RICA/i.test(text) && !/AGENTS\.md|documentos oficiais|fonte oficial/i.test(text)) {
    historicalWarnings.push(file);
  }
}
if (historicalWarnings.length) {
  fail('documents marked obsolete or historical must not present themselves as primary operational sources.', historicalWarnings);
}

console.log('Project OS guardrail passed.');
