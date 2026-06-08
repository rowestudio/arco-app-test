# QA — v8z4b29AO auditoria da escala interna dos frames do Stage

## Objetivo

Validar a versão `v8z4b29AO`, criada a partir de `v8z4b29AN`, com objetivo único de auditar e manter/restaurar a correção da `v8z4b29AL` para escala proporcional dos elementos internos dos frames no Stage.

## Diagnóstico da auditoria AL

- [x] `.frame` ainda define `--stage-frame-ui-scale:1` como fallback CSS.
- [x] `updateStageFrameUIScale(el, frame)` ainda existe e calcula a escala pelo menor lado renderizado/disponível do frame no Stage, com clamp seguro `0.58–1`.
- [x] `renderAll()` ainda aplica `left`, `top`, `width`, `height` e chama `updateStageFrameUIScale(el, f)` sem alterar geometria, rotação, escala real, pausa, duração ou ordem dos frames.
- [x] `.frame-border` ainda usa `border-radius: calc(10px * var(--stage-frame-ui-scale, 1))`, mantendo a espessura da borda definida pela lógica aprovada de foco/seleção.
- [x] `.frame-num` ainda usa `var(--stage-frame-ui-scale)` em `top`, `left`, `font-size`, `padding` e `border-radius`.
- [x] `refreshEditorViewVisualOverlays()` também chama `updateStageFrameUIScale(el, frames[i])` nos frames visíveis para manter a escala ativa em repaints visuais do Stage.

## Áreas preservadas

- [ ] `v8z4b29AF`: menus deslizantes da seleção de frames continuam funcionando.
- [ ] `v8z4b29AH`: pontos laranja e snap-to-center da timeline continuam preservados.
- [ ] `v8z4b29AK`: timeline/menu inferior permanece sem escala indevida.
- [ ] `v8z4b29AL`: escala interna proporcional dos frames do Stage permanece ativa.
- [ ] `v8z4b29AM/AN`: menu de curvas, Tangente e Global continuam como aprovados.
- [ ] Preview/export/MP4, JSON e motor sem regressão.

## Itens proibidos / regressão

- [ ] `.fp` não mudou.
- [ ] `#pillsRow` não mudou.
- [ ] `.mid-pills` não mudou.
- [ ] Timeline/menu inferior não mudou visualmente.
- [ ] Pontos laranja e snap-to-center não mudaram.
- [ ] `pointModeMenu`, Tangente, Global, curvas/handles e funções de curvas não mudaram.
- [ ] Nenhum frame mudou posição, rotação, escala real, pausa, duração ou ordem.

## Checklist manual obrigatório

1. Abrir o app e confirmar versão visível `v8z4b29AO`.
2. Carregar um projeto com frames grandes, médios e pequenos no Stage.
3. Confirmar que frames pequenos mostram número menor, padding menor e radius menor.
4. Confirmar que frames grandes mantêm o padrão visual aprovado, sem exagero.
5. Confirmar que a espessura da borda permanece fixa/aprovada durante foco, adjacência e seleção múltipla.
6. Confirmar que nenhum frame muda posição, rotação, escala real, pausa, duração ou ordem.
7. Acionar zoom/pan do Stage e confirmar que os repaints visuais mantêm a escala interna ativa.
8. Confirmar que `.fp`, `#pillsRow`, `.mid-pills`, timeline/menu inferior, pontos laranja e snap-to-center não mudaram.
9. Abrir o menu de curvas e confirmar que o layout da `v8z4b29AN`, Tangente e Global continuam funcionando.
10. Executar Preview básico e export/MP4 real sem regressão.
11. Salvar e recarregar JSON, confirmando ausência de alteração de dados por causa desta correção visual.
