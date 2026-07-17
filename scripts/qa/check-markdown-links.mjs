import path from 'node:path';
import { fail, git, markdownLinkTargets, readText, fileExists } from './lib.mjs';

const markdownFiles = process.env.QA_MARKDOWN_FILES
  ? process.env.QA_MARKDOWN_FILES.split(/[\n,]/).map((file) => file.trim()).filter(Boolean)
  : git(['ls-files', '*.md']).split('\n').filter(Boolean).filter((file) => ![
    'test-fixtures/qa-guardrails/markdown-invalid.md',
  ].includes(file));
const broken = [];

for (const file of markdownFiles) {
  const baseDir = path.dirname(file);
  const text = readText(file);
  for (const target of markdownLinkTargets(text)) {
    const resolved = path.normalize(path.join(baseDir, target));
    if (!fileExists(resolved)) broken.push(`${file} -> ${target}`);
  }
}

if (broken.length) fail('broken relative markdown links found.', broken);

console.log(`Markdown link guardrail passed for ${markdownFiles.length} files.`);
