# QA — v8z4b27h corrigir sliders delta, ícones e alinhamento multi-select

## Base confirmada antes das alterações

- `APP_VERSION = v8z4b27g`.
- `APP_VERSION_NAME = v8z4b27g`.
- Texto visível em Configurações: `v8z4b27g`.
- Comentário/changelog do topo coerente com `v8z4b27g`.

## Implementação estática concluída

- Versionamento atualizado para `v8z4b27h` no comentário do topo, constantes JS e texto visível.
- Sliders de Rotação/Escala multi-select usam delta relativo por snapshot, renderizam Stage ao vivo no `input` e consolidam Undo único ao finalizar/fechar.
- `Selecionar todos` fica em coluna fixa separada da faixa rolável; a faixa de ações reseta scroll ao fechar, sair ou reabrir.
- Distribuir usa símbolos Lucide oficiais `align-horizontal-distribute-center` e `align-vertical-distribute-center`.
- Mover e Alinhar usam botões internos apenas com ícones Lucide via sprite interno.
- Alinhar e Distribuir passam a usar bounds visuais transformados para frames rotacionados.

## Checklist obrigatório

1. Confirmar `APP_VERSION = v8z4b27h`.
2. Confirmar `APP_VERSION_NAME = v8z4b27h`.
3. Confirmar versão visível no app `v8z4b27h`.
4. Confirmar changelog/comentário do topo atualizado.
5. Selecionar 2+ frames com rotações diferentes, abrir Rotação e arrastar lentamente.
6. Confirmar atualização ao vivo no Stage, preservação das diferenças, `−5°`/`+5°` como delta relativo, `Igualar` como única ação de igualar e Undo único.
7. Selecionar 2+ frames com escalas diferentes, abrir Escala e arrastar lentamente.
8. Confirmar atualização ao vivo no Stage, preservação das diferenças, `−5%`/`+5%` como delta relativo, `Igualar` como única ação de igualar e Undo único.
9. Confirmar `Selecionar todos` fixo à esquerda, sem caixa/fundo/borda própria, mascarando corretamente a faixa rolável.
10. Rolar a faixa de ações, fechar/reabrir e confirmar `scrollLeft = 0` sem resetar faixa de frames, Stage ou zoom/pan.
11. Confirmar Distribuir geral e subações com Lucide correto, sem SVG inline improvisado, desabilitado/não acionável com menos de 3 frames e funcional com 3+.
12. Confirmar Mover sem labels visíveis Cima/Baixo/Esq/Dir, com `arrow-big-up/down/left/right-dash`, área de toque confortável e Undo correto.
13. Confirmar Alinhar sem labels visíveis Esq/Centro V/Dir/Topo/Centro H/Base, com ícones Lucide grandes, sem ícones de alinhamento de texto e área de toque confortável.
14. Com 3 frames rotacionados, confirmar esquerda/direita/topo/base/centros usando bordas/centros visuais reais e Undo correto.
15. Confirmar que frames não selecionados não mudam.
16. Confirmar seleção/deseleção, destaque laranja no Stage/faixa, Reset, JSON sem seleção, Preview/MP4 sem overlays, zoom/pan, edição individual, curvas e ghost frame bloqueando menus externos.
17. Testar em iPhone/Safari real: rolagem suave, toque confortável, Home Bar, ausência de seleção/callout nativos e sem conflito de gestos com Stage/faixa de frames.
