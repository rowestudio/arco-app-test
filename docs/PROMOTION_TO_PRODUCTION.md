# PROMOTION_TO_PRODUCTION

## Fluxo de promoção

1. Desenvolvimento acontece em `rowestudio/arco-app-test`.
2. Roberto testa a versão de teste.
3. Roberto aprova ou reprova.
4. Somente após aprovação explícita ocorre promoção para `rowestudio/arco-app`.
5. Promoção deve usar branch e PR próprios.

## Regras

- Produção não pode ser alterada por inferência.
- Agente não promove por conta própria.
- Versão promovida deve ser byte-idêntica à versão aprovada ou ter divergências explicitamente justificadas.
- Registrar commit fonte, commit destino, versão e data.
- Manter `pages-deploy-stamp.txt` ou mecanismo equivalente de rastreabilidade.
- Não promover nesta tarefa.

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
