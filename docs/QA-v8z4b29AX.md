# QA — v8z4b29AX: corner handles + HUD visor

## Escopo

- Base obrigatória preservada: `v8z4b29AW` (F1 ativo por imagem + confirmação assistida no Stage + menus contextuais ancorados).
- Objetivo: substituir o handle azul/ciano do frame ativo por 4 círculos/abas nos cantos + HUD visor/câmera + mira central.
- Fora de escopo preservado: Preview/export/MP4, JSON, motor, timeline, curvas, handles de curva, menu inferior, pontos laranja, snap-to-center, Alpha/spotlight, seleção múltipla, Novo arquivo, fluxo de imagem, menus contextuais.

## Diagnóstico e implementação

1. Handle antigo (`.global-handle`, background `#04fff2`): ocultado via CSS `opacity:0;pointer-events:none` para modo normal. Mantido visível apenas quando `.ghost-transform` (inserção assistida), preservando a funcionalidade de escala/rotação do ghost frame.

2. 4 corner handles (`.corner-handle`): criados via `ensureCornerHandles()` em `stageContent`. Cada um inicia `handleDragState` usando a posição do canto específico (`getRawHandlePosForFrame(fi, cornerKey)`). O drag/move é roteado para a lógica existente de `globalHandleEl` via `dispatchEvent`, sem criar novo motor de transformação.

3. HUD visor (`#frameHud`): criado via `ensureFrameHud()` + `updateFrameHud(fi)`. Mostra `{pausa}s   {rot}°   {escala}%`. Posicionado no topo central do frame rotacionado. `pointer-events:none`.

4. Mira central (`.frame-crosshair`): adicionada ao DOM do frame via `createFrameDOM()` dentro de `.frame-visual`. Visível apenas em `.frame.active` via CSS. Roda com o frame (dentro de `.frame-visual`).

5. Gerenciamento de visibilidade: corners e HUD são ocultados corretamente durante:
   - Preview (`isPreviewing`)
   - Seleção múltipla (`isMultiSelectionActive()`)
   - Inserção assistida (`isInsertingFrame`) via `updateGhostTransformHandle()`
   - Multi-selection via `updateCtrlPts()`

## Verificações de critério de aceite

- [x] Versão v8z4b29AX visível no app
- [x] `APP_VERSION` e `APP_VERSION_NAME` = `'v8z4b29AX'`
- [x] Bolinha azul/ciano invisível e sem eventos no modo normal
- [x] 4 círculos brancos nos cantos do frame ativo
- [x] Arrastar qualquer círculo → mesma lógica de escala/rotação do handle original
- [x] Círculos seguem o frame ao mover/escalar/rotacionar (posicionados via `getRawHandlePosForFrame`)
- [x] Circles escondidos durante: preview, multi-seleção, inserção assistida
- [x] HUD superior mostra pausa, rotação e escala (somente informativo)
- [x] Mira central no frame ativo (CSS, não captura toque)
- [x] Número do frame preservado (`.frame-num` intacto)
- [x] Pontos de curva/Bézier não alterados
- [x] Ghost-frame handle (inserção assistida) preservado com `.ghost-transform`
- [x] Timeline/menu inferior não alterados
- [x] Preview/export/JSON não alterados
- [x] Base v8z4b29AW preservada

## Riscos e regressões monitorados

- Corner handles com z-index 65 (acima dos frames em 30, abaixo de ctrl-pts em 75) — não interfere com curvas
- `dispatchEvent` para globalHandleEl usa `bubbles: false` + `stopPropagation()` no corner — sem double-fire
- `e.stopPropagation()` no corner pointermove impede o stage listener de despachar novamente para globalHandleEl
- Pointer capture no corner element, não no globalHandleEl — browser libera automaticamente no pointerup
- `releasePointerCapture` no endHandle de globalHandleEl falha silenciosamente (try/catch) — sem impacto
- HUD usa CSS `var(--ez-inv)` para escala automática ao zoom
- Corner handles usam CSS `var(--ez-inv)` para escala automática ao zoom
