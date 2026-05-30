# QA — v8z4b27d simplificar Pausa, menu com 1 frame, Undo da cor e overlay

## Escopo da versão

- Base obrigatória confirmada antes do patch: `v8z4b27c` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível de Configurações e comentário do topo.
- Versão alvo: `APP_VERSION = v8z4b27d`, `APP_VERSION_NAME = v8z4b27d` e versão visível `v8z4b27d`.
- Mudanças funcionais: Pausa contextual direta com Undo consolidado ao sair, menu contextual com 1 frame, ação `Selecionar todos`, Undo/Redo de cor de fundo, persistência real de `bgColor` e overlay normal em alfa `0.38`.
- Preservado: botão `Sel` ausente, seleção não persistida no JSON, overlay múltiplo em `rgba(0,0,0,0.34)`, ausência de overlay laranja interno, curvas/caminhos, Preview/MP4 sem UI de seleção e sem mudanças estruturais de engine/export.

## Verificações estáticas executadas

- [x] Confirmar base `v8z4b27c` antes das alterações por busca de `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário do topo.
- [x] Confirmar que o painel anterior continha `Definir pausa` e que essa ação foi removida do painel Pausa contextual.
- [x] Confirmar que `Igualar ao ativo`, `Aplicar aos selecionados`, `+0.5s` e `-0.5s` não foram reintroduzidos no painel Pausa.
- [x] Confirmar que o slider `#batchPauseSlider` chama `applyBatchPauseFromControl()` no `oninput`, sem `pushUndoSnapshot()` por movimento.
- [x] Confirmar que a sessão `batchPauseEditSession` captura snapshot ao abrir Pausa e registra Undo único em `commitBatchPauseEditSession()` ao fechar/sair.
- [x] Confirmar que `#alignBar` aparece com `selectedFrames.size >= 1` e que `Selecionar todos` foi adicionado ao menu contextual.
- [x] Confirmar que `bgColor` entra em `captureState()`, `cloneProjectStateSnapshot()`, `restoreState()`, `buildProjectData()` e `applyFrameData()`.
- [x] Confirmar que o overlay normal foi alterado para `rgba(0,0,0,0.38)` e o overlay múltiplo permanece `rgba(0,0,0,0.34)`.
- [x] Confirmar ausência de alterações em `getStateAtT`, `drawAtT` e pipeline WebCodecs/export estrutural.
- [x] Confirmar sintaxe JavaScript extraída dos scripts de `index.html` com `node --check`.

## QA manual obrigatório antes de promover

1. Selecionar F1 por toque em iPhone/Safari e confirmar menu contextual com alvo `F1 selecionado`, Pausa, Escala, Rotação, Posição e `Selecionar todos`.
2. Abrir Pausa com F1, mover o slider e confirmar que só F1 muda; fechar o painel e confirmar Undo/Redo único.
3. Selecionar F3 e F4, abrir Pausa, confirmar ausência de `Definir pausa`, mover para `1.2s`, usar `Zerar`, mover novamente, fechar e confirmar Undo/Redo consolidado.
4. Tocar `Selecionar todos`, confirmar todos os frames selecionados, menu aberto, Stage/faixa atualizados e seleção não persistida no JSON.
5. Alterar cor de fundo por swatch e por seletor/texto, confirmar Undo/Redo, salvar/carregar JSON, Preview/MP4 e Reset Project com a cor correta.
6. Confirmar overlay normal menos pesado com alfa `0.38` e overlay múltiplo preservado em alfa `0.34`, sem overlay laranja interno e com curvas/caminhos visíveis.
7. Confirmar inserção assistida/ghost bloqueia menu contextual e `Selecionar todos`, e libera a interface após confirmar/cancelar.
8. Confirmar que zoom/pan com dois dedos, scroll horizontal da faixa, Home Bar e ausência de callout/seleção nativa continuam adequados no iPhone/Safari.
