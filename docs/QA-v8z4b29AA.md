# QA — v8z4b29AA geometria da Linha 4 / Coluna 2

## Escopo
- Base obrigatória `v8z4b29W` confirmada em `index.html` antes das alterações.
- PR pequena limitada à geometria da Linha 4 / Coluna 2 em seleção múltipla.
- Não alterar snap-to-center, `getLowerTimelineNearestFrameIndex()`, `centerLowerTimelineOnFrame()`, `scheduleLowerTimelineSnapToCenter()`, `timelineFocalFrameId`, `activeIdx`, Alpha/spotlight, bolinhas/marcadores centrais, motor, Preview, MP4/export, JSON, curvas, upload, ícone Formato, textos, cores, layout superior ou lógica funcional de seleção múltipla.

## Auditoria/medição orientadora
- Elementos auditados estaticamente: `#midBar.timeline-grid`, `#lowerContextSlot`, `#toolbar`, `#alignBar`, `#alignBarPrimary`, `#alignBarSubmenu`, `#lowerSelectionActions`, `.lower-selection-actions`, `.lower-active-state`, `body.has-multi-selection`, `body.align-submenu-open`, `body.cust-open` e `body.cust-expanded`.
- Diferença encontrada no código antes do ajuste: `#toolbar` ocupava o slot com itens 68px / 42px centralizados, enquanto `#alignBarActions .ab-tab` ficava em 68px / 38px e herdava alinhamento ao fim; além disso, regras `body.cust-open`/`body.cust-expanded` podiam ocultar ou expandir o slot mesmo em seleção múltipla se as classes coexistissem.
- Medição real pendente em iPhone/Safari: comparar `getBoundingClientRect()` de `#lowerContextSlot` + `#toolbar` em seleção simples contra `#lowerContextSlot` + `#alignBar` + `#alignBarPrimary` em seleção múltipla. Top/left/width/height devem permanecer iguais entre estados, sem deslocamento perceptível.

## Verificações estáticas executadas
- `APP_VERSION`, `APP_VERSION_NAME`, texto visível de versão e comentário/changelog do topo atualizados para `v8z4b29AA`.
- `#lowerContextSlot > #toolbar`, `#lowerContextSlot > #alignBar` e `#lowerContextSlot > #custBar` normalizados para `width:100%`, `height:100%`, `margin:0`, `padding:0`, `box-sizing:border-box` e `align-self:stretch`.
- `#alignBar`, `#alignBarPrimary`, `#alignBarActions` e `#alignBarSubmenu` normalizados para compartilhar o mesmo retângulo do slot no estado fechado/normal, sem `transform`, margem, padding externo ou ancoragem lateral.
- `#alignBarActions .ab-tab` passou a usar a mesma base visual da toolbar da Linha 4 (`68px`, `min-height:42px`, `justify-content:center`, `gap:4px`) para evitar deslocamento vertical dos ícones em seleção múltipla.
- Linha 3 pré-alocada de 36px para 41px usando a folga já existente no grid inferior; a altura total de `#midBar.timeline-grid` permaneceu `170px + safe-area`, baixando a Linha 4 inteira sem mexer apenas na Coluna 2.
- Regras `cust-open`/`cust-expanded` foram limitadas a `:not(.has-multi-selection)` para não ocultar `#alignBar`, não expandir `#lowerContextSlot` para duas colunas e não esconder `#lowerSelectionActions` quando a seleção múltipla está ativa.

## QA manual obrigatório pendente
- iPhone/Safari: abrir projeto com vários frames.
- Seleção simples: medir `#lowerContextSlot`, `#toolbar` e a célula/botão Tempo com `getBoundingClientRect()`.
- Seleção múltipla: medir `#lowerContextSlot`, `#alignBar`, `#alignBarPrimary` e a célula/botão Tempo com `getBoundingClientRect()`.
- Confirmar que `top`, `left`, `width` e `height` de Coluna 2 / Linha 4 não mudam perceptivelmente entre seleção simples e múltipla.
- Confirmar que Pausa, Rotação, Escala, Mover e demais ícones contextuais não descem e não deslocam para esquerda.
- Clicar em `Selecionar todos` e confirmar que nada desloca.
- Sair da seleção múltipla e confirmar que nada desloca.
- Confirmar snap-to-center, Alpha/spotlight e ícone Formato.

## Limitações do ambiente
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.
