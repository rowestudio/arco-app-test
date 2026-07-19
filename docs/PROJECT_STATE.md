# PROJECT_STATE

Última atualização documental: 2026-07-18.

## Estado auditado

- Repo de desenvolvimento/teste: `rowestudio/arco-app-test`.
- Branch base: `main`.
- HEAD auditado do teste: `84d74010679456ddd2ab7fdf4c3b850dd529c172`.
- Versão corrente do teste: `v8z4b32E7X`.
- Repo estável/produção: `rowestudio/arco-app`.
- HEAD auditado de produção: `626327280e3a4126fac259e205bbe0bdf3cc8719`.
- Versão de produção: `v8z4b32E7H`.
- Origem dos dados de produção: auditoria comparativa realizada antes da OPS-01; não revalidado nesta PR.

## Fluxo confirmado

Teste → aprovação de Roberto → promoção para produção.

`v8z4b32E7X` contém evoluções posteriores à produção `v8z4b32E7H`.

Nenhuma promoção está autorizada nesta PR.

Status atual: OPS-02 integrada via PR #439, merge commit `52e4f917e28f148278ba8fc135a0f9a8d4c1eacb`, como infraestrutura de QA com guardrails estáticos, fixtures controladas e self-tests versionados. A execução final da PR do workflow QA Guardrails passou; esse workflow é disparado por `pull_request` ou `workflow_dispatch`, portanto este documento não afirma execução automática no merge commit. Nenhuma promoção está autorizada.

OPS-03 permanece apenas planejada e não está autorizada para implementação.
