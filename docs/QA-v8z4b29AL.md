# QA — v8z4b29AL escala proporcional dos elementos internos dos frames do Stage

## Objetivo

Validar a versão `v8z4b29AL`, criada a partir da base aprovada `v8z4b29AK`, com objetivo único de corrigir a escala proporcional dos elementos internos dos frames desenhados no Stage.

## Base preservada

- [ ] `v8z4b29AF`: menus deslizantes da seleção de frames continuam funcionando.
- [ ] `v8z4b29AH`: pontos laranja da timeline continuam centralizados.
- [ ] `v8z4b29AK`: limpeza/reversão das alterações indevidas da timeline/menu inferior continua preservada.

## Diagnóstico registrado antes da implementação

- `.frame`: contêiner absoluto do frame no Stage; recebe `left`, `top`, `width` e `height` em `renderAll()` a partir de `frames[i]`.
- `.frame-visual`: camada interna rotacionada por `renderAll()` via `transform: rotate(...)`; não teve geometria nem transform alterados.
- `.frame-border`: tinha `border-radius:10px` fixo; a espessura de borda continua controlada pela lógica aprovada em `renderAll()` e compensada pelo zoom do editor.
- `.frame-num`: tinha valores fixos `top:6px`, `left:8px`, `font-size:12px`, `padding:2px 7px` e `border-radius:6px`.
- Tamanho do Stage: `frames[i] = {x,y,w,h}` é aplicado em `style.left`, `style.top`, `style.width` e `style.height`; a escala visual interna usa o menor lado renderizado do próprio `.frame` (`offsetWidth/offsetHeight`) com fallback para `frame.w/frame.h`.

## Critérios de aceite no Stage

- [ ] Em frames pequenos, o número parece menor, mas continua legível no iPhone/Safari.
- [ ] Em frames pequenos, o label do número ocupa menos espaço.
- [ ] Em frames pequenos, o raio dos cantos do frame diminui proporcionalmente.
- [ ] A borda mantém a espessura aprovada atual.
- [ ] Frames grandes permanecem no tamanho visual aprovado, sem exagero.
- [ ] Nenhum frame muda posição, tamanho real, escala, rotação, centro ou geometria de caminho.
- [ ] Handles/gestos continuam funcionando.
- [ ] Curvas continuam funcionando.

## Itens proibidos / regressão

- [ ] `.fp` não mudou.
- [ ] `.mid-bar.timeline-grid .fp` não mudou.
- [ ] `#pillsRow` não mudou.
- [ ] `.mid-pills` não mudou.
- [ ] Timeline/menu inferior não mudou visualmente em relação à `v8z4b29AK`.
- [ ] JSON/export não registra alteração de dados por causa desta correção visual.

## Teste obrigatório no iPhone/Safari

1. Abrir o app em `v8z4b29AL`.
2. Confirmar versão visível.
3. Carregar projeto com vários frames.
4. Observar frames grandes, médios e pequenos no Stage.
5. Confirmar que números de frames pequenos diminuíram proporcionalmente.
6. Confirmar que radius/cantos de frames pequenos diminuíram proporcionalmente.
7. Confirmar que a borda manteve a espessura aprovada.
8. Confirmar que nenhum frame mudou posição, escala ou rotação.
9. Confirmar que handles/gestos continuam funcionando.
10. Confirmar que curvas continuam funcionando.
11. Confirmar que menus deslizantes da `v8z4b29AF` continuam OK.
12. Confirmar que pontos laranja da `v8z4b29AH` continuam centralizados.
13. Confirmar que a timeline/menu inferior NÃO mudou.
14. Confirmar Preview básico sem regressão.
15. Confirmar JSON/export sem alteração.

## Teste comparativo recomendado

Comparar visualmente `v8z4b29AK` e `v8z4b29AL`:

- [ ] A diferença é clara apenas nos frames desenhados no Stage.
- [ ] Não há diferença nos frames da timeline/menu inferior.
