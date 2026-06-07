# QA — v8z4b29T

## Escopo

- [x] PR pequena focada apenas no snap-to-center da timeline inferior após scroll manual.
- [x] Correção funcional de Alpha/spotlight já aplicada foi preservada sem refazer lógica.
- [x] Ícone Formato, menus inferiores, `#custBar`, `#alignBar`, `#lowerContextSlot`, Preview, MP4/export, JSON, curvas e motor de animação não foram alterados.

## Verificações estáticas executadas

- [x] Versão final esperada: `v8z4b29T`.
- [x] `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29T`.
- [x] `getLowerTimelineNearestFrameIndex()` lê `#pillsRow`, calcula o centro da faixa, percorre `[data-frame-index]`, compara centros visuais e retorna `-1` sem frame válido.
- [x] `updateLowerTimelineCenterFrameFromScroll()` reutiliza o helper e não altera `activeIdx`.
- [x] `scheduleLowerTimelineSnapToCenter()` usa debounce de 160ms no scroll, revalida `scrollLeft` para respeitar momentum e centraliza o frame mais próximo.
- [x] `centerLowerTimelineOnFrame()` bloqueia snaps concorrentes durante centralização programática e `finishLowerTimelineProgrammaticCenter()` garante `timelineFocalFrameId`/`lowerTimelineCenterFrameIndex` no frame final.

## QA manual obrigatório antes de promover

- [ ] Testar no desktop.
- [ ] Testar no iPhone/Safari.
- [ ] Testar scroll lento da timeline inferior.
- [ ] Testar scroll rápido com momentum no iPhone/Safari.
- [ ] Testar seleção de frame pelo Stage.
- [ ] Testar seleção de frame pela timeline.
- [ ] Testar projeto com 3 frames.
- [ ] Testar projeto com 16 frames.
- [ ] Confirmar que Alpha/spotlight continua seguindo o frame focal/central.
- [ ] Confirmar que `activeIdx`/seleção não muda apenas por scroll/snap.
- [ ] Confirmar que menus inferiores não foram alterados.
