# PROMOTION_TO_PRODUCTION

## Fluxo de promoção

1. Desenvolvimento acontece em `rowestudio/arco-app-test`.
2. Roberto testa a versão de teste.
3. Roberto aprova ou reprova.
4. Somente após aprovação explícita ocorre promoção para `rowestudio/arco-app`.
5. Promoção deve usar branch e PR próprios.
6. Merge direto em `main` ou produção não é fluxo operacional.

## Regras

- Produção não pode ser alterada por inferência.
- Agente não promove por conta própria.
- Agente não faz merge por conta própria.
- Trabalhar direto na `main` não é permitido para mudanças operacionais.
- Versão promovida deve ser byte-idêntica à versão aprovada ou ter divergências explicitamente justificadas.
- Registrar commit fonte, commit destino, versão e data.
- Manter `pages-deploy-stamp.txt` ou mecanismo equivalente de rastreabilidade.
- Não promover nesta tarefa.

## Preview de PR antes de merge

- O Pages do repositório de teste usa a branch `gh-pages` como origem de publicação. A raiz dessa branch recebe a `main`; cada PR interna recebe somente `previews/pr-<n>/`.
- Após o merge da PR operacional que instala o workflow, configurar uma única vez o Pages para a branch `gh-pages` no caminho `/`. A configuração não altera o repositório de produção.
- O workflow `PR Preview Pages` publica automaticamente PRs novas/atualizadas. Para uma PR que já estava aberta antes do workflow, usar `workflow_dispatch`, informando seu número e o SHA exato do HEAD.
- Antes de enviar o link para teste físico, conferir `previews/pr-<n>/pages-deploy-stamp.txt`: o campo `sha` deve ser igual ao HEAD atual da PR. Um preview de SHA anterior não aprova um commit novo.
- Corrigir uma PR aprovada parcialmente significa enviar novo commit para a mesma PR e repetir o teste no mesmo URL; abrir outra PR só é necessário após o merge ou quando o escopo realmente for separado.

## Versionamento histórico reconciliado

Regras antigas de tags, branches e commits em `docs/versioning.md` foram obsoletadas como fonte operacional. A regra vigente é:

- branch própria para cada tarefa;
- PR obrigatório;
- título com versão ou ID operacional;
- `APP_VERSION` só muda em PR funcional do app;
- PR documental não altera `APP_VERSION`;
- promoção para produção exige aprovação explícita de Roberto, branch e PR próprios.

## Candidata de release vigente — E9Y aprovada fisicamente

Status atual: a promoção da `v8z4b32E9Y` está autorizada por decisão explícita de Roberto, exclusivamente por branch e PR próprias, sem merge automático.

- Repo fonte: `rowestudio/arco-app-test`.
- Commit fonte aprovado: `ffca487a5dc1ef081a29f2f53ba453d2c0599180` (merge da PR #535).
- Versão fonte: `v8z4b32E9Y`.
- Aprovação física: Roberto, iPhone/Safari, 2026-08-29; ProjectWorld pronto, Preview funcional, Export WebCodecs com sucesso e `exportSuccess = true`.
- Repo destino: `rowestudio/arco-app`.
- Commit destino anterior: `626327280e3a4126fac259e205bbe0bdf3cc8719` (produção em `v8z4b32E7H`).
- Decisão de release: a exigência histórica de Engine Sprint antes da promoção foi superada para E9Y. Engine Sprint segue não implementado e passa para a próxima rodada.

Definições para a PR de produção E9Y:

- A fonte é o commit aprovado `ffca487a5dc1ef081a29f2f53ba453d2c0599180`; não introduzir mudança funcional, nova versão ou melhoria durante a promoção.
- Deve sincronizar `index.html` e todos os assets efetivamente referenciados em runtime, mantendo-os byte-idênticos à fonte aprovada.
- **Não** deve copiar automaticamente para produção a infraestrutura exclusiva de teste: Playwright, `scripts/qa`, `test-fixtures`, arquivos de pacote (`package.json`/`package-lock.json`) e workflows de CI.

## Registro mínimo de promoção futura

- Repo fonte:
- Branch/commit fonte:
- APP_VERSION fonte:
- Repo destino:
- Branch/commit destino:
- APP_VERSION destino:
- Data:
- Aprovação explícita de Roberto:
- Divergências justificadas, se houver:
