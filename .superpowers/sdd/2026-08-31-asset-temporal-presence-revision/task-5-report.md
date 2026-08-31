# Task 5 report — Preview/Export filtrados por presença temporal

Data: 2026-08-31
Branch: `codex/v8z4b32e9ag-asset-temporal-presence`
HEAD inicial confirmado antes das edições: `2dcd0ba932bba6ab109696e5185aade6841bfc4c`

## Escopo executado

Integrei o resolvedor existente de presença temporal ao pipeline real de Preview/Export sem alterar `getStateAtT`, amostragem de câmera, duração, WebCodecs, UI timing, opacity/effects, delete/escala ou a referência editorial do Stage.

## Arquivos alterados

- `index.html`
- `tests/smoke/app.spec.mjs`
- `tests/smoke/export.spec.mjs`

## Funções alteradas

Em `index.html`:

- `drawAtTDirect`
- `prepareRenderSessionSnapshot`
- `buildRenderSessionTemporalPresenceContext`
- `refreshRenderSessionSnapshotPresenceAt`
- `resolveRenderProjectTimeFromT`
- `_accumulateRenderSessionFrameE6`
- `_finalizeRenderSessionDiagnosticsE6`
- `collectWorldRenderAssets`
- `drawWorldToCanvas`

Em testes:

- novo smoke de paridade Stage/Preview/Export em `tests/smoke/app.spec.mjs`
- nova cobertura real de export com presença temporal em `tests/smoke/export.spec.mjs`

## O que mudou

- Preview/Export agora encaminham `projectTime` ao renderer de mundo/canvas.
- O snapshot de render preserva dados de presença necessários para resolver `present` sem ler DOM.
- A coleta/desenho de assets em Preview/Export filtra imagens e textos por `isAssetPresentAt(...)`.
- O Stage continua mantendo apenas classes editoriais (`asset-temporal-reference*`); Preview/Export não recebem essas classes.
- Os diagnósticos por frame passaram a distinguir ausência esperada por presença temporal de “asset missing”.
- A guarda final de export no caminho multi-asset deixa de tratar ausência temporal esperada como frame inválido.

## RED → GREEN

Falhas observadas antes da correção:

- Preview ainda desenhava asset ausente antes da entrada.
- Snapshot de export não expunha `present`.
- Export real caía na guarda `export-empty-asset-frame-blocked` quando um asset temporalmente ausente reduzia a contagem esperada de draw.

Estado final:

- paridade Stage/Preview/Export validada em dois instantes;
- single-image, multi-image e Text Asset cobertos;
- asset ausente com draw zero;
- quadro/export continuam não vazios quando outro asset permanece presente.

## Testes executados

- `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9AG — presença temporal: Stage, Preview e Export concordam"`
- `npx playwright test tests/smoke/export.spec.mjs --project=webkit-macos-export --grep "presença temporal mantém o quadro não vazio"`

## Self-review

- A alteração ficou restrita ao pipeline já existente; não criei renderer paralelo.
- O snapshot continua sem depender dos wrappers visuais do Stage.
- Mantive as referências editoriais exclusivas do Stage e removidas de Preview/Export.
- O teste de app usa os mesmos caminhos reais (`prepareRenderSessionSnapshot`, `drawAtT`, `renderTransform`) para provar paridade.
- O teste de export usa export real em WebKit/macOS e confirmou saída MP4 não vazia no cenário temporal coberto.

## Riscos

- A guarda histórica de export fora do cenário temporal desta task não foi revalidada por completo nesta rodada mínima.
- Os novos contadores presença-aware foram ajustados no caminho de Preview/Export com renderer de mundo; regressões fora desse fluxo exigem smoke mais amplo.

## Itens não verificados

- suíte WebKit de export completa além do teste focal desta task;
- validação física em iPhone/Safari.
