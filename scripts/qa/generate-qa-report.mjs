import { appendFileSync } from 'node:fs';
import { changedFiles, extractAppVersions, getBaseSha, getHeadSha, readFromGit, readText } from './lib.mjs';

function versionFrom(html) {
  if (!html) return 'n/d';
  const versions = extractAppVersions(html);
  return versions.appVersion[0] || 'n/d';
}

const baseSha = getBaseSha();
const headSha = getHeadSha();
const files = changedFiles(baseSha, headSha);
const indexChanged = files.includes('index.html') ? 'sim' : 'não';
const baseVersion = versionFrom(readFromGit(baseSha, 'index.html'));
const headVersion = versionFrom(readText('index.html'));

const lines = [
  '## OPS-02 QA Guardrails',
  '',
  `- Commit base: \`${baseSha || 'n/d'}\``,
  `- Commit head: \`${headSha || 'n/d'}\``,
  `- index.html alterado: ${indexChanged}`,
  `- versão base: \`${baseVersion}\``,
  `- versão head: \`${headVersion}\``,
  '',
  '### Arquivos alterados',
  '',
  files.length ? files.map((file) => `- \`${file}\``).join('\n') : '- n/d',
  '',
  '### Validações executadas',
  '',
  '- `git diff --check`',
  '- estado básico do repositório',
  '- consistência de `APP_VERSION` / `APP_VERSION_NAME`',
  '- vazamento técnico em texto estático renderizável do `body`',
  '- Project OS canônico',
  '- links Markdown relativos',
  '',
].join('\n');

console.log(lines);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines}\n`);
