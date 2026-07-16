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
