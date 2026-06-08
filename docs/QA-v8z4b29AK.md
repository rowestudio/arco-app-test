# QA — v8z4b29AK limpeza/reversão seletiva dos frames da timeline

## Objetivo

Validar a versão `v8z4b29AK`, criada a partir do estado atual após o revert manual da `v8z4b29AJ`, com objetivo único de remover resíduos da `v8z4b29AI` relacionados à alteração indevida dos frames da timeline/menu inferior.

## Contexto registrado

- A `v8z4b29AJ` já foi revertida manualmente pelo usuário; a `v8z4b29AK` não tenta reverter novamente a AJ inteira.
- A `v8z4b29AI` interpretou incorretamente o pedido de “escala proporcional dos frames” como alteração dos blocos da timeline/menu inferior (`.fp`, `.mid-bar.timeline-grid .fp`, `#pillsRow`, `.mid-pills`).
- O pedido correto era sobre os frames desenhados no Stage (`.frame`, `.frame-visual`, `.frame-border`, `.frame-num`).
- A escala proporcional correta dos frames do Stage continua pendente e fora do escopo da `v8z4b29AK`.
- A `v8z4b29AK` é uma versão de limpeza/reversão seletiva.

## Checklist estático

- [x] `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29AK`.
- [x] `.mid-bar.timeline-grid .fp` não usa `--timeline-frame-w`, `--timeline-frame-h`, `--timeline-frame-radius`, `--timeline-frame-font`, `--timeline-frame-pad-x`, `--timeline-frame-pad-y`, `--timeline-frame-scale` ou `--fp-scale`.
- [x] `.mid-bar.timeline-grid .fp` voltou ao padrão fixo com `--fp-w:34px`, `--fp-h:44px`, `flex/width/min-width` em `var(--fp-w)`, `height` em `var(--fp-h)`, raio/padding/fonte/borda calculados por `--fp-w`.
- [x] Estados `.mid-bar.timeline-grid .fp.active`, `.mid-bar.timeline-grid .fp.selected` e `.mid-bar.timeline-grid .fp.active.selected` preservados.
- [x] Não existem `let lowerTimelineFrameScaleRaf = 0`, `function syncLowerTimelineFrameScale()`, `function scheduleLowerTimelineFrameScale()` nem chamadas a essas funções.
- [x] `resize` e `orientationchange` continuam chamando `syncLowerTimelineCenterMarkers()` diretamente.
- [x] Não foram feitas alterações em `.frame`, `.frame-visual`, `.frame-border` ou `.frame-num` nesta versão.

## Preservações obrigatórias

- [x] Menus deslizantes da seleção de frames da `v8z4b29AF` preservados.
- [x] Pontos laranja centralizados da timeline da `v8z4b29AH` preservados.
- [x] Snap-to-center, `timelineFocalFrameId` e scroll da timeline preservados.
- [x] Ajustes de curvas existentes da `v8z4b29AI` preservados, incluindo ícones suavizados, ação global e `applyCurrentCurveModeToAllFrames()`.
- [x] Alpha/spotlight, Preview/export/MP4, JSON e motor preservados.

## QA manual obrigatório

1. Abrir o app em `v8z4b29AK`.
2. Confirmar que a versão visível mostra `v8z4b29AK`.
3. Confirmar que os blocos `.fp` da timeline/menu inferior voltaram ao visual anterior à parte errada da `v8z4b29AI`.
4. Confirmar que não há escala proporcional/responsiva aplicada aos `.fp`.
5. Rolar a timeline lentamente e com momentum, confirmando que os pontos laranja seguem centralizados como na `v8z4b29AH`.
6. Confirmar snap-to-center e foco (`timelineFocalFrameId`) sem regressão.
7. Confirmar menus deslizantes da seleção de frames como na `v8z4b29AF`.
8. Abrir o pill de curvas, alternar modos e testar a ação global de curva para confirmar preservação funcional.
9. Confirmar visualmente que os frames do Stage não foram alterados pela `v8z4b29AK`.

## Não executado neste ambiente

- iPhone/Safari real.
- Preview/export real e MP4 real.
- JSON manual.
- QA visual manual da timeline/menu inferior.
