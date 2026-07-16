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
