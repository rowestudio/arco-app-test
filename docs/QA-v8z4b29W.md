# QA — v8z4b29W estabilidade da Linha 4 e marcadores centrais

## Escopo
- Base após `v8z4b29U`/`v8z4b29V` confirmada em `index.html` antes das alterações.
- PR pequena limitada à timeline inferior/Coluna 2.
- Não alterar Alpha/spotlight, `timelineFocalFrameId` além de leitura visual, `activeIdx`, snap-to-center funcional, `#custBar`, menus Pausa/Rotação/Escala/Mover, Formato, Preview, MP4/export, JSON, curvas, motor, upload, textos ou cores gerais.

## Verificações estáticas executadas
- `APP_VERSION`, `APP_VERSION_NAME`, texto visível de versão e comentário/changelog do topo atualizados para `v8z4b29W`.
- Linha 3 / Coluna 2 mantém uma área reservada fixa para `#lowerSelectionActions`; o botão `Selecionar todos` alterna apenas visibilidade, sem entrar/sair do fluxo vertical.
- Linha 4 / Coluna 2 permanece no mesmo `grid-row` e `#alignBar` continua dentro de `#lowerContextSlot`.
- Marcadores laranja/amarelos de centro da timeline passam a usar a posição central real de `#pillsRow` medida dentro de `.lower-timeline-slot`, o mesmo viewport usado por `getLowerTimelineNearestFrameIndex()` e `centerLowerTimelineOnFrame()`.

## QA manual obrigatório pendente
- iPhone/Safari: seleção múltipla e clique em `Selecionar todos`.
- iPhone/Safari: comparar a altura da Linha 4 / Coluna 2 antes e depois de entrar em seleção múltipla.
- iPhone/Safari: confirmar ícones Pausa, Rotação, Escala e Mover na mesma altura.
- iPhone/Safari: scroll lento e scroll rápido com momentum na timeline.
- iPhone/Safari: confirmar snap-to-center e bolinhas alinhadas exatamente ao frame focal.
- Projetos com poucos frames, 8 frames e 16 frames.
- Confirmar Alpha seguindo o frame central.
- Confirmar seleção independente do foco central.
- Confirmar ausência de regressão visual grave em Pausa/Rotação/Escala/Mover.

## Limitações do ambiente
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.
