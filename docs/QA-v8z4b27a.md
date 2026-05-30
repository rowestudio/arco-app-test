# QA — v8z4b27a expandir menu de seleção múltipla

Nova função controlada a partir da v8z4b26g. O menu próprio de seleção múltipla permanece separado do menu normal de frames e passa a agrupar ações em Pausa, Escala, Rotação e Posição.

## Verificações estáticas executadas

1. Base `v8z4b26g` confirmada em `origin/main` antes das alterações.
2. `APP_VERSION = v8z4b27a`.
3. `APP_VERSION_NAME = v8z4b27a`.
4. Texto visível de versão em Settings atualizado para `v8z4b27a`.
5. Ausência de `btnMultiSelect`; botão `Sel` não foi recriado.
6. `#alignBar` preservado como menu próprio de seleção múltipla.
7. `selectedFrames` continua sendo estado temporário e não participa do JSON salvo.
8. `alignFrames()` concentra as ações em lote com um único snapshot de Undo por ação.
9. `drawBezier()`, `getStateAtT`, `drawAtT` e WebCodecs/export não foram alterados.

## Checklist manual obrigatório

1. Confirmar versão visível `v8z4b27a`.
2. Selecionar múltiplos frames e confirmar que o menu aparece com Pausa, Escala, Rotação e Posição.
3. Confirmar que overlay externo múltiplo, borda laranja e caminho/curva continuam visíveis como na v8z4b26g.
4. Em Pausa, validar `+0.5s`, `-0.5s`, zerar e igualar ao frame ativo, sem valores negativos.
5. Em Escala, validar `+5%`, `-5%`, igualar ao frame ativo e reset para a escala base.
6. Em Rotação, validar `+5°`, `-5°`, igualar ao frame ativo e zerar.
7. Em Posição, validar mover cima/baixo/esquerda/direita preservando distâncias relativas.
8. Em Posição > Alinhar, validar esquerda, centro vertical, direita, topo, centro horizontal e base usando frame ativo como referência.
9. Em Posição > Distribuir, validar horizontal e vertical com 3+ frames selecionados, preservando a ordem dos frames.
10. Confirmar que frames não selecionados não mudam.
11. Confirmar que a seleção múltipla e o overlay permanecem ativos após cada ação.
12. Confirmar Undo/Redo desfaz/refaz cada lote em uma única ação.
13. Salvar/carregar JSON e confirmar que pausa, escala, rotação e posição persistem, mas seleção múltipla não.
14. Abrir Preview e exportar MP4 após ações em lote; confirmar que dados reais aparecem e overlays/menus não aparecem.
15. Usar Reset Project e confirmar baseline correto e seleção limpa.
16. Criar frame pendente/ghost e confirmar que o menu/ações de seleção múltipla ficam bloqueados até Confirmar/Cancelar.
17. Ativar Loop, selecionar F1 + último frame + intermediários, aplicar ações e confirmar que Loop/curvas/handles não regrediram.
18. Testar em iPhone/Safari real: toque, safe area, scroll da faixa, zoom/pan de dois dedos e estabilidade do menu.
