# DOCUMENTATION_MAINTENANCE

## Qual documento atualizar

- Estado atual, HEADs e versões: `docs/PROJECT_STATE.md`.
- Onboarding e papéis: `docs/PROJECT_CONTEXT.md`.
- Arquitetura comprovada: `docs/ARCHITECTURE.md`.
- Regras de UX/produto: `docs/PRODUCT_RULES.md`.
- Decisões: `docs/DECISIONS.md`.
- Roadmap e backlog: `docs/ROADMAP.md`.
- Regressões: `docs/REGRESSIONS.md`.
- Estratégia de QA: `docs/QA_STRATEGY.md`.
- Casos de teste: `docs/TEST_CASES.md`.
- Critérios de pronto: `docs/DEFINITION_OF_DONE.md`.
- Promoção: `docs/PROMOTION_TO_PRODUCTION.md`.
- Regras para agentes: `AGENTS.md`; Claude deve apontar para `AGENTS.md` via `CLAUDE.md`.

## Regras de manutenção

- Qualquer pessoa ou agente pode propor atualização documental.
- Decisões de produto exigem aprovação de Roberto.
- Fatos técnicos podem ser atualizados mediante evidência.
- Documentação não pode ser alterada silenciosamente.
- Mudanças documentais entram no diff da PR.
- Evitar duplicação; quando possível, apontar para a fonte oficial.
- `AGENTS.md` e `CLAUDE.md` devem apontar para a mesma fonte operacional.
- Documentos obsoletos devem ser marcados como obsoletos, não apagados sem rastreabilidade.
- Documentos históricos não podem conter instrução operacional ativa depois da consolidação; devem apontar para `AGENTS.md` e para os documentos oficiais da OPS-01.

## Conversation Delta / Handoff

Regra central (fonte oficial em `AGENTS.md`): **nenhuma pendência relevante pode
existir somente no chat.** Toda informação relevante assumida em uma conversa deve
ser persistida no Project OS assim que vira decisão ou pendência, sem depender do
encerramento do chat; a auditoria de handoff é obrigatória. Esta seção apenas mapeia
para onde cada tipo de item vai — não reproduz a política inteira.

Mapa de destino (registrar no documento correspondente, com referência cruzada em
vez de conteúdo duplicado):

- bug ou regressão → `docs/REGRESSIONS.md`;
- estado atual, HEAD/SHA e versões → `docs/PROJECT_STATE.md`;
- regra de produto/UX → `docs/PRODUCT_RULES.md`;
- decisão → `docs/DECISIONS.md`;
- backlog, item futuro ou pesquisa futura → `docs/ROADMAP.md` / `docs/PRODUCT_ROADMAP.md`;
- caso de teste preventivo → `docs/TEST_CASES.md`;
- processo/regras de agentes e fluxo → `AGENTS.md` / `docs/APPROVAL_WORKFLOW.md` / `docs/DEFINITION_OF_DONE.md`.

Um mesmo item pode exigir registro em mais de um documento (por exemplo, um bug em
`docs/REGRESSIONS.md` e a referência de estado em `docs/PROJECT_STATE.md`); nesse caso,
manter o detalhe em um documento e apontar dos demais por referência.

## Anti-divergência

Se dois documentos disserem coisas diferentes:

1. pare e registre a incompatibilidade;
2. identifique a fonte mais específica;
3. peça decisão quando a divergência alterar produto, produção, versão ou escopo;
4. corrija a documentação na mesma PR quando isso estiver no escopo.

## Documentos históricos e obsoletos

Arquivos antigos de tarefa, auditoria, versão ou QA podem permanecer como rastreabilidade, mas não são fonte única da verdade. Quando contiverem regra ainda válida, a regra deve ser migrada para o documento oficial correspondente e o arquivo antigo deve receber aviso de obsolescência ou referência histórica.

Documentos de QA versionados (`docs/QA-*.md`) são evidência histórica daquela versão, não política operacional vigente.
