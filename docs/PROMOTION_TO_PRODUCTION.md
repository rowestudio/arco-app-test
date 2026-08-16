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

## Candidata de release pendente — série pré-promoção

Status atual: **não há promoção autorizada**. A `v8z4b32E9C` é a **base auditada** da série pré-promoção, **não** uma promoção liberada. O plano canônico está em `docs/PRE_PROMOTION_RELEASE_PLAN.md`.

- A candidata real de produção **não** é o HEAD atual: será o HEAD posterior à série completa de PRs funcionais aprovadas — (1) Texto, (2) Camadas e Profundidade, (3) Engine Sprint de Movimento inteligente/easing — mais a revisão integrada no iPhone/Safari e a documentação coerente.
- Nenhuma promoção pode ocorrer antes dessa série completa, dos testes obrigatórios e da aprovação explícita de Roberto.

Registro do estado corrente (referência, sem aprovação):

- Repo fonte: `rowestudio/arco-app-test`.
- Commit fonte (base auditada atual, **não** a fonte final de promoção): `8f1b2686ae6cc99bb716b200a79d04281cd968d7`.
- Versão fonte atual: `v8z4b32E9C`.
- Repo destino: `rowestudio/arco-app`.
- Commit destino atual: `626327280e3a4126fac259e205bbe0bdf3cc8719` (produção em `v8z4b32E7H`).
- Status: bloqueada. Aguardando a série pré-promoção completa, validação de release no iPhone/Safari real e aprovação explícita de Roberto.

Definições para a futura PR de produção (quando autorizada):

- A fonte deverá ser o HEAD que contenha a série completa aprovada, não a base auditada `v8z4b32E9C` isoladamente.
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
