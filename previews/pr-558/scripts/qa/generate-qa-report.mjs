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
const status = (name) => process.env[name] || 'não executado';
const versionException = process.env.QA_VERSION_EXCEPTION_USED === 'true' ? 'sim' : 'não';

const lines = [
  '## OPS-02 QA Guardrails',
  '',
  `- Commit base: \`${baseSha || 'n/d'}\``,
  `- Commit head: \`${headSha || 'n/d'}\``,
  `- index.html alterado: ${indexChanged}`,
  `- versão base: \`${baseVersion}\``,
  `- versão head: \`${headVersion}\``,
  `- exceção de APP_VERSION usada: ${versionException}`,
  '',
  '### Arquivos alterados',
  '',
  files.length ? files.map((file) => `- \`${file}\``).join('\n') : '- n/d',
  '',
  '### Resultado por camada',
  '',
  `- self-tests: ${status('QA_SELF_TESTS_STATUS')}`,
  `- repository state: ${status('QA_REPOSITORY_STATE_STATUS')}`,
  `- app version: ${status('QA_APP_VERSION_STATUS')}`,
  `- UI leakage: ${status('QA_UI_LEAKAGE_STATUS')}`,
  `- Project OS: ${status('QA_PROJECT_OS_STATUS')}`,
  `- Markdown links: ${status('QA_MARKDOWN_LINKS_STATUS')}`,
  '',
  '### Limitações',
  '',
  '- Heurística de UI ignora comentários, `script` e `style`, junta texto inline e separa blocos renderizáveis comuns; não substitui teste visual.',
  '- Links Markdown validam arquivos relativos, não anchors internos.',
  '',
  '### NÃO EXECUTADO NESTA CAMADA',
  '',
  '- Safari/iPhone',
  '- avaliação visual',
  '- Preview',
  '- Export',
  '- Playwright/WebKit',
  '',
].join('\n');

console.log(lines);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines}\n`);
