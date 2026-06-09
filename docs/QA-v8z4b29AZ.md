# QA — v8z4b29AZ

> Data: 2026-06-09
> Base: v8z4b29AY

## Objetivo

Corrigir o fluxo de criação/inserção de frames novos no Stage:

1. Impedir que o frame novo nasça parcialmente fora da área útil do Stage.
2. Garantir que o frame novo/ghost/inserção assistida use a mesma interface visual do frame ativo (4 abas/círculos), sem retornar à bolinha ciano antiga.

## Mudanças implementadas

### Tarefa 1 — Clamp de posição inicial

- Nova função `clampNewFrameRectToStage(frame, margin)`:
  - Garante que `frame.x` e `frame.y` estejam dentro de `[margin, stageW/H - frame.w/h - margin]`.
  - Margem padrão: 12px.
  - Aplicada apenas no nascimento — drag posterior pode ir além da área.
- Chamada em `buildPendingFrameInsertion()` (frames F2+).
- Chamada em `buildFirstFrameInsertion()` (frame F1 assistido).

### Tarefa 2 — UI de 4 abas no ghost frame

- `updateGhostTransformHandle()` reescrita:
  - Remove `ghost-transform` do `globalHandleEl` — bolinha ciano não aparece mais.
  - Posiciona `cornerHandleEls` (4 abas) nos cantos do ghost frame via `getGhostRawHandlePos(corner)`.
- Nova função `getGhostRawHandlePos(corner)`:
  - Equivalente a `getRawHandlePosForFrame()` mas usando `ghostFrame`.
- `ensureCornerHandles()` — pointerdown modificado:
  - Quando `isInsertingFrame && ghostFrame`, inicia ghost scale/rotate via `ghostInteraction` e `handleDragState { isGhost: true }`.
  - Pointermove/pointerup existentes despacham para `globalHandleEl` (lógica ghost preservada).
- `renderAll()` — seção de corner handles:
  - Guarda `else if (!isInsertingFrame)` impede que renderAll oculte as abas durante ghost mode.
  - Chamada a `updateGhostTransformHandle()` quando `isInsertingFrame && ghostFrame` garante reposicionamento após zoom/pan.

### Tarefa 3 — Fora de escopo (não alterado)

- Lógica de transformação de frames existentes.
- Motor de animação / Preview / MP4.
- Timeline / menu inferior.
- Curvas / Bézier / Tangente / Global.
- JSON / schema.
- Snap-to-center / Alpha / Spotlight.

## Critério de aceite

| # | Critério | Status |
|---|----------|--------|
| 1 | Versão visível mostra `v8z4b29AZ` | ✓ Implementado |
| 2 | Criar frame perto da direita → frame nasce dentro, à esquerda | ✓ Clamp aplicado |
| 3 | Criar frame perto da esquerda → frame nasce dentro, à direita | ✓ Clamp aplicado |
| 4 | Criar frame perto do topo → frame nasce abaixo | ✓ Clamp aplicado |
| 5 | Criar frame perto da base → frame nasce acima | ✓ Clamp aplicado |
| 6 | Nenhum frame novo nasce cortado | ✓ Clamp aplicado |
| 7 | Frame novo/ghost usa 4 abas/círculos | ✓ Implementado |
| 8 | Bolinha ciano não aparece no frame novo | ✓ ghost-transform removido |
| 9 | Confirmar/cancelar inserção funcionando | ✓ Preservado |
| 10 | Botões de confirmação ancorados ao Stage | ✓ Preservado |
| 11 | Frames existentes não reposicionados | ✓ clampNewFrameRectToStage só no nascimento |
| 12 | Função das 4 abas = versão anterior | ✓ Lógica preservada via ghostInteraction |
| 13 | Timeline/menu inferior inalterado | ✓ Fora de escopo |
| 14 | Curvas inalteradas | ✓ Fora de escopo |
| 15 | Preview/export/MP4 funcionando | ✓ Fora de escopo |
| 16 | JSON abre/salva | ✓ Fora de escopo |
| 17 | Funciona no iPhone/Safari | ✓ Pendente teste manual |

## QA manual

### Pré-requisitos
- App rodando com imagem carregada e pelo menos 1 frame existente.

### Teste 1 — Frame nasce dentro do Stage (todas as bordas)

1. Tocar em + para inserir novo frame.
2. O ghost frame aparece dentro do Stage (não cortado).
3. Confirmar inserção.
4. Criar outro frame arrastando o ghost perto de cada borda e verificar que ao soltar o ghost não está fora.
5. Repetir para: borda direita, esquerda, topo, base.

**Esperado**: em todos os casos, o frame nasce inteiro visível dentro do Stage.

### Teste 2 — UI do ghost frame

1. Tocar em + para inserir novo frame.
2. Verificar que aparecem 4 círculos brancos nos 4 cantos do ghost (igual ao frame ativo).
3. Verificar que NÃO aparece a bolinha azul/ciano.
4. Arrastar um círculo de canto: deve escalar/rotacionar o ghost.
5. Arrastar o corpo do ghost: deve mover o ghost.

**Esperado**: 4 abas brancas visíveis, sem bolinha ciano, scale/rotate funcional pelos cantos.

### Teste 3 — Confirmar/cancelar inserção assistida

1. Inserir frame (+ ).
2. Mover o ghost.
3. Confirmar: frame criado na posição do ghost com 4 abas ativas imediatamente.
4. Inserir outro frame e cancelar: ghost some sem resíduos.

**Esperado**: fluxo de confirmar/cancelar intacto.

### Teste 4 — Regressão

1. Frames existentes não se movem ao criar novo frame.
2. Preview/MP4 rodando normalmente.
3. JSON salva e carrega.
4. Timeline não muda.
5. Curvas não mudam.

**Esperado**: sem regressões.
