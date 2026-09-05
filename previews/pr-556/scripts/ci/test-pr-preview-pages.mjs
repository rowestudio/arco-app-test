import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/pr-preview-pages.yml', 'utf8');
const qaStrategy = readFileSync('docs/QA_STRATEGY.md', 'utf8');
const promotionGuide = readFileSync('docs/PROMOTION_TO_PRODUCTION.md', 'utf8');

assert.match(workflow, /pull_request_target:/, 'o preview precisa atualizar quando a PR recebe novo commit sem dar permissão de publicação a forks');
assert.match(workflow, /workflow_dispatch:/, 'PRs abertas antes do workflow precisam poder ser publicadas manualmente');
assert.match(workflow, /previews\/pr-\$\{PR_NUMBER\}/, 'cada PR precisa usar um diretório isolado');
assert.match(workflow, /pages-deploy-stamp\.txt/, 'o preview precisa registrar o SHA publicado');
assert.match(workflow, /contents:\s*write/, 'o workflow precisa ter permissão explícita para publicar a branch');
assert.match(qaStrategy, /previews\/pr-<n>\//, 'a estratégia de QA precisa registrar a URL estável do preview');
assert.match(promotionGuide, /gh-pages/, 'a promoção precisa registrar a branch de publicação');
assert.match(promotionGuide, /workflow_dispatch/, 'a promoção precisa explicar a republicação de uma PR já aberta');

console.log('PR preview Pages workflow contract: OK');
