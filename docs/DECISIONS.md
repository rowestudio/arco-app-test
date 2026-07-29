# DECISIONS

Formato: ID, data, decisão, contexto, consequência e status.

## DEC-001 — Dois modos do app

- Data: data não consolidada.
- Decisão: o app trabalha com os modos Ativos/Mundo e Câmera/Frames.
- Contexto: separar organização de assets/mundo da edição de câmera/frames.
- Consequência: mudanças devem preservar a separação de responsabilidades.
- Status: aprovada.

## DEC-002 — Repositório de teste e repositório estável

- Data: data não consolidada.
- Decisão: `rowestudio/arco-app-test` é desenvolvimento/teste; `rowestudio/arco-app` é estável/produção.
- Contexto: permitir validação antes de promoção.
- Consequência: produção não pode ser alterada por inferência.
- Status: aprovada.

## DEC-003 — Promoção somente após aprovação

- Data: data não consolidada.
- Decisão: promoção para produção só ocorre após aprovação explícita de Roberto.
- Contexto: Roberto valida o comportamento real antes da promoção.
- Consequência: agentes não promovem por conta própria.
- Status: aprovada.

## DEC-004 — Fluxo via branch e PR

- Data: data não consolidada.
- Decisão: mudanças devem ser feitas em branch própria e PR.
- Contexto: preservar revisão, rastreabilidade e rollback.
- Consequência: não encerrar tarefa relevante apenas com alteração local.
- Status: aprovada.

## DEC-005 — Não gerar HTML independente

- Data: data não consolidada.
- Decisão: não criar HTML paralelo fora do repositório para substituir o app.
- Contexto: evitar fontes divergentes e perda de histórico.
- Consequência: mudanças devem ocorrer na base oficial.
- Status: aprovada.

## DEC-006 — Preservar renderer único

- Data: data não consolidada.
- Decisão: preservar renderer único/canônico entre Stage, Preview e Export.
- Contexto: pipelines paralelos tendem a gerar divergência visual.
- Consequência: alterações no renderer exigem escopo explícito.
- Status: aprovada.

## DEC-007 — Teste real em iPhone/Safari

- Data: data não consolidada.
- Decisão: iPhone/Safari é referência real.
- Contexto: o produto é mobile-first e validado visualmente por Roberto.
- Consequência: WebKit automatizado ajuda, mas não substitui Safari real.
- Status: aprovada.

## DEC-008 — Diagnóstico não substitui validação visual

- Data: data não consolidada.
- Decisão: diagnóstico interno não supera relato visual de Roberto.
- Contexto: flags podem estar corretas e ainda assim a UX estar quebrada.
- Consequência: evidência visual e relato humano são decisivos para UX.
- Status: aprovada.

## DEC-009 — Título de PR com versão ou operação

- Data: data não consolidada.
- Decisão: títulos de PR devem conter a versão ou identificação operacional.
- Contexto: facilitar rastreabilidade entre tarefa, versão e release.
- Consequência: PRs documentais usam ID operacional, como `OPS-01`.
- Status: aprovada.

## DEC-010 — WebCodecs como pipeline principal de exportação

- Data: data não consolidada.
- Decisão: o pipeline principal de MP4 é WebCodecs, no caminho Canvas → VideoFrame → VideoEncoder → MP4.
- Contexto: histórico do projeto registrou trancos com `captureStream + MediaRecorder`.
- Consequência: `captureStream + MediaRecorder` não deve voltar como export principal sem decisão explícita e PR própria.
- Status: aprovada.

## DEC-011 — Curva controla caminho, não velocidade

- Data: data não consolidada.
- Decisão: a curva visual controla o caminho do movimento, não a velocidade.
- Contexto: regras históricas em `docs/codex-rules.md` e tarefas de curva/escala foram consolidadas na OPS-01.
- Consequência: não reintroduzir easing na curva sem autorização explícita.
- Status: aprovada.

## DEC-012 — Escala não deve resetar curvas

- Data: data não consolidada.
- Decisão: ajuste de escala, inclusive escala global, não deve resetar, recriar ou alterar curvas existentes.
- Contexto: regressões históricas indicaram curva resetada ao alterar escala, especialmente após carregar projeto ou usar escala global.
- Consequência: não chamar rotinas de reset/recriação de curva como efeito colateral de escala.
- Status: aprovada.

## DEC-013 — v8z3t rejeitada como base

- Data: data não consolidada.
- Decisão: `v8z3t` não deve ser usada como base.
- Contexto: versão histórica descartada por regressão em curva/easing.
- Consequência: tarefas futuras não devem partir dessa base nem reaproveitar sua lógica sem auditoria explícita.
- Status: aprovada.

## DEC-014 — Documentos antigos não são fonte operacional

- Data: 2026-07-16.
- Decisão: documentos antigos de regras, tarefas e versionamento devem ser obsoletados ou marcados como referência histórica após migração do conteúdo válido.
- Contexto: revisão independente apontou risco de fontes paralelas de verdade.
- Consequência: `AGENTS.md` e os documentos oficiais da OPS-01 prevalecem.
- Status: aprovada.

## DEC-015 — Merge direto não é fluxo operacional

- Data: 2026-07-16.
- Decisão: o fluxo obrigatório é branch própria, PR e aprovação; merge direto ou trabalho direto na `main` não é permitido como regra operacional.
- Contexto: regras históricas de versionamento citavam merge de forma genérica.
- Consequência: qualquer promoção ou merge exige PR e autorização aplicável.
- Status: aprovada.

## DEC-2026-07-22-01 — Fonte de verdade e registro obrigatório

- **ID:** DEC-2026-07-22-01
- **Data:** 2026-07-22
- **Assunto:** Fonte de verdade e registro obrigatório
- **Classificação:** Processo / Project OS
- **Decisão:** O chat não é fonte de verdade do projeto. Toda decisão relevante de produto, arquitetura, processo, QA, aprovação, regressão ou roadmap deve ser registrada no Project OS do repositório de teste. A decisão também deve ser refletida no documento temático correspondente: produto em `PRODUCT_RULES.md`; processo em `APPROVAL_WORKFLOW.md` ou `AGENTS.md`; conclusão/liberação em `DEFINITION_OF_DONE.md`; regressão em `REGRESSIONS.md`; planejamento em `ROADMAP.md` ou `PRODUCT_ROADMAP.md`; estado atual em `PROJECT_STATE.md`.
- **Motivo:** Evitar perda de contexto, divergência entre agentes e decisões mantidas apenas em conversas.
- **Impacto:** PRs funcionais ou documentais devem atualizar o Project OS sempre que consolidarem decisões relevantes.
- **O que substitui ou corrige:** Substitui decisões operacionais dependentes apenas do chat.
- **Sistemas/documentos afetados:** `AGENTS.md`, `docs/APPROVAL_WORKFLOW.md`, `docs/DEFINITION_OF_DONE.md`, `docs/PROJECT_STATE.md`, `docs/PRODUCT_RULES.md`, `docs/REGRESSIONS.md`, `docs/ROADMAP.md`, `docs/PRODUCT_ROADMAP.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-02 — Revisão não se limita a checks verdes

- **ID:** DEC-2026-07-22-02
- **Data:** 2026-07-22
- **Assunto:** Revisão técnica e aderência ao objetivo
- **Classificação:** QA / Revisão de PR
- **Decisão:** Checks verdes, diff pequeno, ausência de erro de sintaxe e testes automatizados aprovados não são suficientes para recomendar merge. Antes de liberar uma PR, a revisão deve validar aderência integral ao objetivo, coerência com o sistema já aprovado, ausência de coexistência indevida entre sistema antigo e novo, geometria/UI verificável pelo diff, regressões/preservações e correspondência entre implementação e proposta de produto. Se houver erro previsível no diff, inconsistência, ambiguidade material ou implementação parcial, a PR deve ser bloqueada.
- **Motivo:** A v8z4b32E7Y passou por implementação parcial visualmente reprovada apesar de baixo risco aparente no diff.
- **Impacto:** Revisões precisam avaliar arquitetura, comportamento e evidência visual objetiva, não apenas checks automatizados.
- **O que substitui ou corrige:** Corrige o entendimento de que checks verdes bastam para recomendar merge.
- **Sistemas/documentos afetados:** `docs/DEFINITION_OF_DONE.md`, `docs/APPROVAL_WORKFLOW.md`, `AGENTS.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-03 — Dúvidas materiais devem ser resolvidas antes

- **ID:** DEC-2026-07-22-03
- **Data:** 2026-07-22
- **Assunto:** Tratamento de ambiguidade material
- **Classificação:** Processo / Escopo
- **Decisão:** Quando o objetivo estiver consolidado no Project OS, ele deve ser executado integralmente e não pode ser reduzido pelo agente. Quando houver dúvida material real, deve-se perguntar antes de gerar o prompt ou bloquear a PR e solicitar esclarecimento. Não é permitido escolher silenciosamente uma interpretação menor, parcial ou mais simples.
- **Motivo:** Evitar entregas que pareçam cumprir visualmente uma parte do pedido, mas deixem o problema central sem solução.
- **Impacto:** Agentes devem bloquear ou esclarecer escopo material em vez de simplificar a implementação sem registro.
- **O que substitui ou corrige:** Corrige interpretações silenciosamente reduzidas de objetivos aprovados.
- **Sistemas/documentos afetados:** `AGENTS.md`, `docs/DEFINITION_OF_DONE.md`, `docs/APPROVAL_WORKFLOW.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-04 — Distinção entre regressão grave e implementação incompleta

- **ID:** DEC-2026-07-22-04
- **Data:** 2026-07-22
- **Assunto:** Reversão versus conclusão corretiva
- **Classificação:** Processo / Regressão
- **Decisão:** Regressão grave que quebra ou compromete a base deve recomendar reversão antes de nova tentativa. Implementação incompleta, mas funcionalmente estável e aproveitável, pode ser concluída por nova PR sobre a base atual. A escolha deve ser fundamentada na revisão do código e no impacto observado, e não feita automaticamente. Nesta situação específica, a v8z4b32E7Y é implementação incompleta e visualmente reprovada, mas pode ser corrigida a partir da main atual sem reversão imediata.
- **Motivo:** Diferenciar risco estrutural de entrega incompleta aproveitável.
- **Impacto:** A correção v8z4b32E7Z continua sobre a main atual, sem reverter a PR #449.
- **O que substitui ou corrige:** Corrige a decisão automática de reverter qualquer versão reprovada.
- **Sistemas/documentos afetados:** `docs/REGRESSIONS.md`, `docs/PROJECT_STATE.md`, `docs/APPROVAL_WORKFLOW.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-28-01 — Identidade canônica de seleção de Ativos

- **Data:** 2026-07-28.
- **Decisão:** `selectedAssetId` é a única identidade canônica do Ativo selecionado. Stage, Layers, contexto, toolbar, contorno e reorder devem resolver o objeto exclusivamente por esse ID; aliases legados só podem derivar dele.
- **Contexto:** escritas diretas e observações posicionais permitiam divergência real ou aparente entre componentes após seleção e reorder.
- **Consequência:** nenhuma posição de array, linha, `zIndex`, slot ou rótulo “Imagem N” pode servir como identidade de seleção; reconstruções devem reencontrar o mesmo `asset.id`.
- **Status:** ativa na `v8z4b32E8B`, com aprovação visual pendente em iPhone/Safari real.

## DEC-2026-07-28-02 — Precedência de fontes estáveis na render session

- **Data:** 2026-07-28.
- **Decisão:** Preview e Export usam a mesma rotina de readiness por asset. Um `stableDrawable` com dimensões, pixels e versão de fonte compatíveis é suficiente; a fonte viva não precisa estar simultaneamente pronta. Sem drawable válido, a rotina tenta fonte viva e depois fonte persistente recuperável antes de falhar.
- **Contexto:** fontes DOM são voláteis no Safari/iPhone e não devem invalidar um raster já congelado e comprovadamente desenhável.
- **Consequência:** snapshots de render armazenam apenas fontes estáveis verificadas, nunca pulam assets visíveis e são descartados integralmente se qualquer asset permanecer irrecuperável.
- **Status:** ativa na `v8z4b32E8C`, com validação real em iPhone/Safari pendente.


## DEC-2026-07-28-03 — Identidade nominal persistente de Layers

- **Data:** 2026-07-28.
- **Decisão:** cada image asset recebe uma única sequência positiva e imutável, exibida como `Camada N`; reorder não renomeia, exclusão não libera o número e `nextLayerSequence` nunca recua.
- **Contexto:** nomes posicionais derivados de array ou `zIndex` mudavam a identidade aparente do mesmo asset após reorder.
- **Consequência:** criação e migração passam pela rotina canônica de identidade; Save/Load persiste identidade e contador; `originalFileName` é preservado sem virar título principal.
- **Status:** ativa na `v8z4b32E8D`, com validação real em iPhone/Safari pendente.

## DEC-2026-07-29-01 — Checkpoint integral de sessão em IndexedDB

- **Data:** 2026-07-29.
- **Decisão:** Session Autosave é independente do Save/Load manual, reutiliza `buildProjectData(true)` e `applyProjectData()`, e mantém em IndexedDB somente o último checkpoint completo com checksum e revisão monotônica.
- **Contexto:** reload, descarte de página pelo iOS/Safari e retorno posterior não podem depender do Save manual nem aceitar reconstrução parcial.
- **Consequência:** assets são pré-hidratados antes de qualquer aplicação; falha preserva o checkpoint anterior; Load manual invalida callbacks anteriores e se torna a sessão corrente; Novo Projeto limpa a sessão anterior antes de gravar a nova.
- **Status:** ativa na `v8z4b32E8E`, com validação final em iPhone/Safari real pendente.


## DEC-2026-07-29-02 — Relógio do Preview depende do commit do primeiro frame

- **Data:** 2026-07-29.
- **Decisão:** em uma nova abertura do Preview, o relógio visual e o loop de playback só podem iniciar depois que o renderer canônico concluir o desenho final de `t=0` sem erro e o preflight aguardar os ciclos posteriores de composição definidos, preservando os guards de token/fechamento.
- **Contexto:** concluir o warm-up apenas por término da função, sem confirmação posterior ao desenho final, permitia uma travada perceptível no Safari.
- **Consequência:** falha ou cancelamento não marca warm-up concluído, não agenda playback, mantém Export fora do caminho e libera tentativa posterior.
- **Status:** ativa tecnicamente na `v8z4b32E8F`, com aprovação visual pendente em iPhone/Safari real.
