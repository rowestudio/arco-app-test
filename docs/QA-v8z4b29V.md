# QA — v8z4b29V ajuste residual inferior

## Escopo

- Ajuste residual de safe-area dos submenus inferiores de frame.
- Estabilidade da Linha 4 quando `Selecionar todos` aparece na Linha 3.
- Sem alteração de Alpha/spotlight, `timelineFocalFrameId`, `activeIdx`, snap-to-center, Formato, Preview, MP4/export, JSON, curvas ou motor.

## Verificações estáticas executadas

- `APP_VERSION`, `APP_VERSION_NAME`, texto visível de versão e comentário/changelog do topo atualizados para `v8z4b29V`.
- `--lower-safe-bottom` preservado como cálculo único de safe-area da grade inferior.
- Novo `--lower-home-breath` aplicado como respiro visual interno, sem somar novamente `env(safe-area-inset-bottom)`.
- Submenu de seleção múltipla (`#alignBarSubmenu`) passa a manter o topo no mesmo lugar e recuar apenas o rodapé pelo respiro visual.
- Submenus simples (`#custBar` em `body.cust-expanded`) passam a usar o mesmo respiro visual no `#lowerContextSlot`.
- `#lowerSelectionActions`/`.lower-selection-actions` passam a ficar posicionados fora do fluxo da Linha 3 quando há seleção múltipla, mantendo a altura da Linha 3 e a posição da Linha 4 estáveis.

## QA manual obrigatório pendente

- iPhone/Safari.
- Seleção simples.
- Seleção múltipla.
- Abrir Pausa.
- Abrir Rotação.
- Abrir Escala.
- Abrir Mover.
- Ativar/desativar seleção múltipla.
- Clicar em `Selecionar todos`.
- Confirmar que Linha 4 não muda de posição.
- Confirmar que submenus não invadem demais a zona morta/home indicator.
- Confirmar que não voltou o bug de menu duplicado.
- Confirmar que `8 frames` ou `16 frames` não vaza por baixo.
- Confirmar que Alpha e snap-to-center continuam funcionando.

## Limitações deste ambiente

- Não foram executados testes em iPhone/Safari real.
- Não foram executados Preview real, MP4/export real nem JSON manual, pois o escopo não altera essas áreas.
