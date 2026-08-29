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
