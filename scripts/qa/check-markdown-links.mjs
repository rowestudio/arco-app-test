import path from 'node:path';
import { fail, git, markdownLinkTargets, readText, fileExists } from './lib.mjs';

const markdownFiles = git(['ls-files', '*.md']).split('\n').filter(Boolean);
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
