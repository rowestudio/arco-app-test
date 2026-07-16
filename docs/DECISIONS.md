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
