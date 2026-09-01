# PR Preview Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar uma URL estável por Pull Request antes do merge, sem substituir a URL canônica da `main`.

**Architecture:** A branch `gh-pages` será a origem do GitHub Pages. O workflow copia a raiz do app para `/` quando a `main` muda e para `/previews/pr-<n>/` quando uma PR muda. Um `workflow_dispatch` publica uma PR já aberta por SHA. O conteúdo é publicado pelo `GITHUB_TOKEN` e recebe um `pages-deploy-stamp.txt` rastreável.

**Tech Stack:** GitHub Actions, GitHub Pages (branch source), bash, Git.

**Spec:** `docs/PROMOTION_TO_PRODUCTION.md` e `docs/QA_STRATEGY.md`.

## Global Constraints

- Não alterar `index.html`, `APP_VERSION`, Preview/Export ou produção.
- A raiz do Pages representa a `main`; uma PR escreve somente em seu próprio diretório.
- URL: `https://rowestudio.github.io/arco-app-test/previews/pr-<n>/`.
- Nenhum token ou segredo é salvo no repositório.

### Task 1: Publicador idempotente por ref

**Files:**
- Create: `.github/workflows/pr-preview-pages.yml`
- Test: `scripts/ci/test-pr-preview-pages.mjs`

- [ ] Escrever teste que exige `pull_request`, `workflow_dispatch`, `previews/pr-${PR_NUMBER}` e `pages-deploy-stamp.txt`; executar `node scripts/ci/test-pr-preview-pages.mjs` e confirmar falha.
- [ ] Implementar workflow com permissões mínimas `contents: write`, checkout do SHA da PR, cópia para `previews/pr-${PR_NUMBER}`, cópia de `main` para raiz, e commit somente quando houver diferença.
- [ ] Executar `node scripts/ci/test-pr-preview-pages.mjs` e confirmar sucesso.

### Task 2: Contrato e recuperação operacional

**Files:**
- Modify: `docs/QA_STRATEGY.md`
- Modify: `docs/PROMOTION_TO_PRODUCTION.md`
- Test: `scripts/ci/test-pr-preview-pages.mjs`

- [ ] Estender o teste para exigir URL de preview, `gh-pages` e `workflow_dispatch`; confirmar falha antes de documentar.
- [ ] Documentar a configuração única do Pages para `gh-pages`, a separação raiz/main versus diretório/PR, e o despacho manual para PRs abertas antes do workflow.
- [ ] Executar o teste e `git diff --check`.

### Task 3: Liberação isolada

- [ ] Abrir uma PR operacional sem app, versão ou produção.
- [ ] Após o merge, configurar o Pages para `gh-pages`, despachar a publicação da PR #551 pelo SHA e validar URL e stamp antes do teste físico.
