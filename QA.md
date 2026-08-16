## Checklist de validação de release — v8z4b32E9C (iPhone/Safari real)

Base auditada da série pré-promoção (`v8z4b32E9C`), **não** uma promoção liberada — a promoção permanece bloqueada até a série completa e a aprovação de Roberto (ver `docs/PRE_PROMOTION_RELEASE_PLAN.md`). Validação física em iPhone/Safari real **pendente**; itens manuais iniciam desmarcados e só podem ser marcados após verificação no aparelho real por Roberto.

- [ ] Menu/versão mostra `v8z4b32E9C`.
- [ ] Criação e edição de Text Asset.
- [ ] Digitar um único caractere (ex. "R") mantém a caixa ajustada ao conteúdo, sem caixa enorme e vazia.
- [ ] Largura fixa opcional (toggle + slider) controla a quebra automática quando ativada.
- [ ] Profundidade positiva e negativa com texto, fundo, seleção e abas movendo juntos no Stage.
- [ ] Save/Load e Session Restore preservam o estado do projeto.
- [ ] Preview.
- [ ] Exportação MP4 (WebCodecs/H.264) e reprodução do vídeo resultante.
- [ ] Projeto com múltiplas imagens, Layers e Trocar imagem.
- [ ] UI sem texto técnico visível e sem verde no chrome do Arco.
- [ ] Logos e ícone carregando corretamente.

Evidência automática já comprovada (não substitui a validação física): no HEAD da PR #492, a `v8z4b32E9C` teve QA Guardrails verde, WebKit funcional 19/19 e Real Export H.264 2/2 com `avc1.42001f`. A validação física em iPhone/Safari real permanece pendente e não está concluída.

## v8z4b32E7H

Base: `v8z4b32E7G`. Nova versão: `v8z4b32E7H`.

Escopo estrito: limpar falsos negativos de diagnóstico sem alterar layout, menus, fluxo, curva/handles E7G, Preview ou Export.

Checklist técnico:

- [x] `asset0MatchesWorldCoordinateSystem` não compara `worldW/H` com `baseStageW/H`.
- [x] `asset0MatchesWorldCoordinateSystem` valida apenas coordenadas ProjectWorld numéricas e positivas.
- [x] `allAssetsSameCoordinateSystem` valida todos os assets por coordenadas ProjectWorld válidas, sem exigir dimensões iguais ao baseStage.
- [x] `replacePreservedCenterAndRecomputedSize` é exposto no diagnóstico.
- [x] `replacePreservedWorldRect=false` é aceito quando centro, AR novo, recálculo de tamanho, zIndex, slot e visibilidade estão corretos.

Testes manuais obrigatórios em iPhone/Safari:

- [ ] Menu mostra "Arco Motion App v8z4b32E7H".
- [ ] Após trocar `img-1` por imagem com outra proporção, diagnóstico mostra `worldCoordinateStrategy: preserveSavedWorld`, `worldCoordinateSystemConsistent: true`, `asset0MatchesWorldCoordinateSystem: true`, `allAssetsSameCoordinateSystem: true` e `mixedWorldScaleDetected: false`.
- [ ] Diagnóstico de replace mostra `replacePreservedCenterAndRecomputedSize: true` quando `replacePreservedWorldRect: false` por mudança de proporção.
- [ ] Preservar `img1StableDrawableUsedInPreview: true`, `img1StableDrawableUsedInExport: true`, contagens esperadas de Preview/Export e flags E7G de curva.

## v8z4b32E7G

Base confirmada antes do patch: `v8z4b32E7F` em `index.html` (`APP_VERSION` e `APP_VERSION_NAME`).

Escopo único: corrigir geometria dos controles editáveis da curva no Modo Câmera.

Checklist técnico:

- [x] `getFrameHandleGeometryForTarget()` usa `getFrameScreenGeometry(frameIndex).center` como âncora visual canônica.
- [x] Linhas dos handles partem do mesmo centro canônico usado pelo path da curva.
- [x] Losango, ghost handles e hitbox DOM são posicionados na mesma coordenada screen.
- [x] Drag de handle converte stage/screen para ProjectWorld antes de salvar `dx/dy`.
- [x] Diagnóstico E7G expõe paridade de âncora/path/handle e flags de armazenamento ProjectWorld.
- [x] Preview/Export/WebCodecs/renderSessionSnapshot/stableDrawable/assets/layers/replace/save-load/menus/layout/cores/textos/ícones/fluxo preservados.

Testes manuais obrigatórios em iPhone/Safari:

- [ ] Menu mostra "Arco Motion App v8z4b32E7G".
- [ ] No Modo Câmera, a linha pontilhada nasce exatamente no centro visual do frame correspondente.
- [ ] Losango/ponto de edição e área arrastável coincidem visualmente, sem offset.
- [ ] Zoom/pan mantém curva, linha, âncora, losango e hitbox juntos.
- [ ] Arrastar handle atualiza curva e controle imediatamente sem deslocamento residual.
- [ ] Diagnóstico mostra flags E7G obrigatórias como `true`, `curveAnchorDeltaPx: 0`, `curveDashedLineStartDeltaPx: 0` e `curveHandleStoredCoordinateSpace: projectWorld`.
- [ ] Preview e Export permanecem iguais à E7F/E7E.

## v8z4b32E7F

Base confirmada antes do patch: `v8z4b32E7E` em `index.html` (`APP_VERSION` e `APP_VERSION_NAME`).

### Escopo
- [x] Fonte canônica única do frame ativo no editor (`canonicalFrameIndex`).
- [x] Timeline, renderer, HUD/chips, overlay, scrim e geometria ancorada sincronizados com o frame ativo no Modo Câmera.
- [x] Scrim/cutout usa `getFrameScreenGeometry(frameIndex)` em vez de recalcular centro/tamanho por caminho paralelo.
- [x] Curvas e handles continuam usando os centros canônicos do frame; ghost handles são diagnosticados como vizinhos e não alteram o frame ativo.
- [x] Preview/Export/WebCodecs/renderSessionSnapshot/stableDrawable/cache de assets/layers/replace/save-load/menus/layout/cores/textos/ícones/fluxo preservados.

### Validação obrigatória (manual iPhone/Safari)
- [ ] Menu mostra "Arco Motion App v8z4b32E7F".
- [ ] No Modo Câmera, tocar frames diferentes na timeline e confirmar que Stage, HUD, número/chips, scrim e curva mudam para o mesmo frame sem atraso.
- [ ] Rolar a timeline até centralizar um frame e confirmar que o frame ativo no Stage é o mesmo sob a mira/bolinha.
- [ ] Fazer pan/zoom no editor e confirmar que frame ativo, scrim/cutout, curva e handles permanecem alinhados.
- [ ] Diagnóstico mostra `editorFrameSyncFixEnabled: true`, `editorFrameSyncSource: canonicalFrameIndex`, `allEditorFrameTargetsMatchCanonical: true` e `editorFrameTargetMismatchDetected: false`.
- [ ] Diagnóstico mostra `frameAnchoredUIFrameIndex`, `frameActiveInfoTextFrameIndex`, `cameraModeFrameChipsFrameIndex`, `cameraModeFrameOverlayFrameIndex`, `filmAlphaScrimCutoutFrameIndex`, `rendererFrameIndex`, `timelineVisualActiveIndex`, `frameTimelineCenteredIndex` e `timelineFrameUnderMarkerIndex` iguais a `activeFrameIndex`.
- [ ] Rodar Preview e Export do mesmo projeto da E7E e confirmar que o vídeo continua correto e que nenhum asset some, pisca ou bloqueia por imagem não pronta.

## v8z4b32E7E

Base confirmada antes do patch: `v8z4b32E7D` em `index.html` (`APP_VERSION` e `APP_VERSION_NAME`).

### Escopo
- [x] Gate da E7D preservado: Preview/Export continuam bloqueando snapshot incompleto.
- [x] `prepareRenderSessionSnapshot(kind)` aguarda hidratação/decode antes de decidir bloqueio.
- [x] `img-1` cria `stableDrawable` canônico a partir do próprio asset ou fallback legado carregado, sem usar DOM como fonte direta de Preview/Export.
- [x] Diagnóstico da imagem 6 separa presença em `assets[]` de inclusão no snapshot.

### Validação obrigatória (manual iPhone/Safari)
- [ ] Menu mostra "Arco Motion App v8z4b32E7E".
- [ ] Abrir o projeto com 8 imagens e tocar Preview; não deve bloquear por `img-1`.
- [ ] Confirmar visualmente que nenhuma imagem some, especialmente `img-1` e `img-1781638924641-484`.
- [ ] Exportar MP4 e confirmar que nenhuma imagem some no vídeo.
- [ ] Diagnóstico mostra `APP_VERSION = v8z4b32E7E`.
- [ ] Diagnóstico mostra `renderSessionVisibleAssetCount: 8`, `renderSessionDecodedAssetCount: 8`, `renderSessionValidDrawableCount: 8`, `renderSessionSnapshotComplete: true`.
- [ ] Diagnóstico mostra `assetBlankDrawableCount: 0`, `renderSessionAbortedBecauseAssetNotReady: false`, `img1MissingInPreviewDetected: false`, `img1MissingInExportDetected: false`.
- [ ] Diagnóstico mostra `knownProblemAssetPresent: true`, `knownProblemAssetStableDrawableCreated: true`, `exportSuccess: true`, `exportRenderAssetCount: 8` e `exportAssetsDrawnCount: 8`.

## v8z4b32E7B

Base confirmada antes do patch: `v8z4b32E7A` em `index.html` (`APP_VERSION` e `APP_VERSION_NAME`).

### Escopo
- [x] Snapshot de sessão antes de Preview/Export cria fontes raster internas estáveis para assets visíveis.
- [x] Imagem 6 (`img-1781638924641-484`) valida pixels reais no drawSource por checksum alpha/luma antes da sessão.
- [x] Preview e Export usam o mesmo snapshot lógico e não dependem de imagem DOM volátil do Stage.
- [x] Diagnóstico passa a diferenciar draw call de drawSource efetivamente não vazio.
- [x] Paridade do img-1 da E7A preservada.

### Validação obrigatória (manual iPhone/Safari)
- [ ] Menu mostra "Arco Motion App v8z4b32E7B".
- [ ] Rodar Preview e confirmar visualmente que a imagem 6 não some.
- [ ] Exportar MP4 e confirmar que a imagem 6 não some.
- [ ] Diagnóstico mostra `APP_VERSION = v8z4b32E7B`.
- [ ] Diagnóstico mostra `exportSuccess: true` e `exportAssetsDrawnCount: 8`.
- [ ] Diagnóstico mostra `knownProblemAssetStableDrawableCreated: true`, `knownProblemAssetStableDrawableHasPixels: true` e blank draw false em Preview/Export.
- [ ] Confirmar que img-1 continua correto no Preview e Export.

## v8z4b32E7A

Base confirmada antes do patch: `v8z4b32E6` em `index.html` (`APP_VERSION` e `APP_VERSION_NAME`).

### Escopo
- [x] Preview passa a reconstruir a sessão de render após replace e a consumir o snapshot canônico de `assets[]`.
- [x] `collectWorldRenderAssets()` passa a usar, no Preview, `drawSource`, `sourceW/H`, `worldX/Y/W/H`, `visible` e `zIndex` capturados no snapshot de sessão.
- [x] Cache/snapshot de Preview invalidado no fluxo de troca de imagem.
- [x] Diagnóstico do img-1 atualizado para confirmar nat/worldRect do Preview contra o asset canônico.

### Validação obrigatória (manual iPhone/Safari)
- [ ] Menu mostra "Arco Motion App v8z4b32E7A".
- [ ] App abre limpo, sem texto técnico visível.
- [ ] Trocar img-1 por imagem horizontal.
- [ ] Stage mostra img-1 correto.
- [ ] Preview mostra img-1 com o mesmo `worldRect` do asset real.
- [ ] Export continua funcionando via WebCodecs.
- [ ] Diagnóstico mostra os campos `img1Preview*` esperados como `true`.

## v8z4b32E6

Base confirmada antes do patch: `v8z4b32E5` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME` e comentário do topo).

### Escopo (Engine Sprint autorizado pela tarefa — paridade de render do img-1)
- [x] Commit canônico em `replaceImageAssetInPlace()`: para TODO asset (inclusive img-1) grava no asset real `sourceW/H`, `worldX/Y/W/H` (= `replaceNewWorldRect`, `worldAR==sourceAR`), `drawSource`, `fitMode='contain'`, crop reset, `imgReady/decodeReady`, `sourceVersion++`/`renderVersion++`/`replaceEpoch`, `e6CanonicalReplaced` — depois do decode, antes de qualquer redraw.
- [x] `collectWorldRenderAssets()` desenha o img-1 canonicamente substituído pela fonte crua do asset + `worldRect` do asset (mesmo caminho dos extras); img-1 legado não substituído continua no `mainSource` canônico (sem regressão — validado por teste).
- [x] `imgNatW/imgNatH` e o espaço da câmera (`getStateAtT@v8z4b32E3`/frames/curvas/`baseStageW/H`) intactos.
- [x] `buildRenderSessionSnapshotE6()` antes de Preview/Export; acumulação por frame em `drawWorldToCanvas`; época de sessão congela decode assíncrono atrasado.
- [x] `syncFirstImageAsset()` não sobrescreve `sourceW/H`/`worldRect` de img-1 canônico; `serializeProjectAsset()` persiste `src`/`e6CanonicalReplaced`/versões; `restoreProjectAssetsFromData()` restaura geometria/fonte canônicas do img-1. Auto-normalização de legados no load continua desligada.
- [x] Diagnósticos novos (`e6*`/`img1*`/`renderSession*`/`knownProblem*`) lidos de `assets[]` + `renderTransform.preview/export` (não do rect temporário) — corrige o falso positivo da E5.

### Validação automatizada (Chromium headless)
- [x] App carrega sem erro de console/página; `APP_VERSION`=`APP_VERSION_NAME`=`v8z4b32E6`; `buildDiagnosticsText()` inclui os campos E6.
- [x] `collectWorldRenderAssets`: img-1 com `e6CanonicalReplaced` usa a fonte crua do asset (não `mainSource`) e o rect mapeado do `worldRect` (AR = source).
- [x] img-1 legado (sem flag) continua usando `mainSource` na caixa cheia (sem regressão).
- [x] Replace real (async) de img-1 vertical→horizontal em projeto multi-imagem: `sourceW/H`=1200×800, `worldAR`==`sourceAR`==1.5, `imgNatW/H` inalterados, extra não perde bitmap.
- [x] `serializeProjectAsset()` do img-1 substituído persiste `e6CanonicalReplaced`, `src`, `worldRect`, `sourceW/H`, `sourceVersion`.

### Validação obrigatória (manual iPhone/Safari)
- [ ] Menu mostra "Arco Motion App v8z4b32E6".
- [ ] Abrir o arquivo problemático; selecionar img-1; trocar por imagem horizontal → aparece correto no Stage.
- [ ] Rodar Preview → img-1 aparece (não some, não usa caixa antiga).
- [ ] Exportar MP4 → img-1 aparece no vídeo, sem caixa antiga.
- [ ] Trocar img-1 por imagem vertical; repetir Preview/Export; trocar img-1 via painel Layers; repetir.
- [ ] Selecionar imagem 6 / `img-1781638924641-484` (se existir); Preview e Export → não desaparece/reaparece.
- [ ] Trocar imagem 6; Preview/Export na mesma sessão; salvar; fechar app; reabrir; abrir projeto; Preview/Export → imagem 6 estável.
- [ ] Trocar outro asset qualquer → img-1 e imagem 6 não perdem source/bitmap.
- [ ] Diagnóstico mostra os valores esperados E6: `e6CanonicalReplaceFixEnabled:true`, `img1CanonicalAssetUpdatedAfterReplace:true`, `img1AssetWorldARMatchesSourceARAfterReplace:true`, `img1MissingInPreviewDetected:false`, `img1MissingInExportDetected:false`, `renderSessionSnapshotBuiltBeforePreview/Export:true`, `previewVisibleAssetsDrawnEveryFrame:true`, `exportVisibleAssetsDrawnEveryFrame:true`, `assetBlinkDetected:false`, `projectWorldCompositeStableDuringPreview/Export:true`, `knownProblemAssetStableAcrossRenderSession:true` (quando o asset existir).
- [ ] Preservados: E5 (paridade visual do editor), menus, frames, curvas, câmera, layers, ProjectWorld, WebCodecs export.

## v8z4b32E5

Base confirmada antes do patch: `v8z4b32E4` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME` e comentário do topo).

### Escopo
- [x] Nova função pura `getAssetVisualWorldRect(asset)` — fit contain de `sourceW/H` dentro de `worldW/H`, centrado; para extras é idêntico ao `worldRect` (confirmado por teste automatizado, zero mudança de comportamento), para img-1 dá o retângulo real da imagem dentro da célula intacta.
- [x] `renderProjectWorldExtraImages()`, `renderAssetSelectionOverlay()` e `hitTestAssetAtWorld()` passam a usar `getAssetVisualWorldRect()` em vez do `worldRect` cru.
- [x] `target.src` de img-1 passa a ser a imagem nova crua (sem tarja cozida), igual aos extras.
- [x] `asset.worldX/Y/W/H` do modelo (inclusive img-1), `drawAtT`/`drawAtTDirect`/`drawWorldToCanvas`/`collectWorldRenderAssets`/`getStateAtT` NÃO tocados (governança AGENTS.md — fora de Engine Sprint).
- [x] Novo diagnóstico só-leitura `_scanLegacyBoxedAssets()`; nunca normaliza assets ao abrir o arquivo.

### Validação obrigatória
- [ ] Menu mostra "Arco Motion App v8z4b32E5" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b32E5`).
- [ ] Selecionar um asset extra, trocar por imagem de proporção diferente: moldura roxa abraça exatamente a imagem (sem mudança em relação à v32E4 — já estava correto).
- [ ] Selecionar img-1, trocar por imagem de proporção bem diferente (ex.: vertical → horizontal): moldura roxa do editor encolhe para hugar a imagem real, sem sobra transparente/tarja visível na seleção.
- [ ] Tocar na área onde antes sobrava a faixa/tarja (dentro da caixa antiga, fora da imagem real) não seleciona mais img-1.
- [ ] Tocar dentro da imagem real de img-1 continua selecionando-a normalmente.
- [ ] Repetir troca via toolbar e via painel Layers, em img-1 e em asset comum — mesma paridade visual.
- [ ] Reorder de layers, movimento de assets, zIndex, frames, curvas e câmera sem regressão.
- [ ] Rodar Preview e Exportar MP4: nenhuma imagem some/reaparece, nenhum pulo de câmera/render (paridade Preview/Export de img-1 especificamente continua usando a caixa cozida da v32E4 quando a proporção muda — limitação conhecida, documentada no CHANGELOG, requer Engine Sprint para fechar 100%).
- [ ] Diagnóstico mostra `replaceVisualParityFixEnabled:true`, `replacedAssetDomWrapperMatchesWorldRect:true`, `replacedAssetSelectionMatchesWorldRect:true`, `replacedAssetHitTestMatchesWorldRect:true`, `img1NoTransparentInheritedBox:true`, `img1NoLetterboxFromOldBox:true`, `img1NoPillarboxFromOldBox:true`, `legacyBoxedAssetsAutoRepairedOnLoad:false`.
- [ ] Teste em iPhone/Safari real (fechar/reabrir app, trocar imagens de proporções bem diferentes em img-1 e em asset comum, tocar na área antes transparente, Preview, Export MP4, abrir Diagnóstico).

## v8z4b32E4

Base confirmada antes do patch: `v8z4b32E3` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME` e comentário do topo).

### Escopo
- [x] `replaceImageAssetInPlace()` recalcula `worldW/worldH` (assets extras) por fit contain a partir da proporção natural da imagem nova, dentro da caixa de referência (`slotBox` = `ProjectWorld.baseStageW/H`), mantendo o centro do asset anterior.
- [x] Imagem principal (img-1): bake no canvas canônico (`imgNatW`×`imgNatH`) passa a usar fit contain (em vez de cover) — `getStateAtT`/frames/curvas/`ProjectWorld` intactos.
- [x] `asset.crop` é resetado em todo replace (`enabled:false`, retângulo cheio).
- [x] Commit atômico: asset só é alterado após `img.onload`; falha de decode mantém a imagem antiga.

### Validação obrigatória
- [ ] Menu mostra "Arco Motion App v8z4b32E4" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b32E4`).
- [ ] Inserir imagem nova continua entrando inteira, sem crop (fit contain), sem alteração de fluxo.
- [ ] Trocar uma imagem vertical por horizontal entra inteira, sem crop, sem distorção.
- [ ] Trocar uma imagem horizontal por vertical entra inteira, sem crop, sem distorção.
- [ ] Trocar uma imagem quadrada por vertical/horizontal entra inteira.
- [ ] A imagem trocada preserva o centro visual, `zIndex`, slot, `visible` e seleção do asset anterior.
- [ ] A imagem trocada não herda crop/sourceRect/formato visual do asset anterior.
- [ ] Replace continua mirando o asset correto (toolbar → `selectedAssetId`; Layers → `assetId` da linha); nunca cai em img-1/slot central indevidamente.
- [ ] `assets.length` não muda no replace; img-1 continua asset normal.
- [ ] Movimento de assets e reorder do painel Layers continuam funcionando.
- [ ] Preview/Export camera parity preservado (sem pulos); Export usa WebCodecs; `exportSuccess:true`.
- [ ] A imagem substituída aparece inteira no Stage, no Preview e no MP4 exportado; nenhuma outra imagem desaparece/pisca.
- [ ] Diagnóstico mostra `replaceDoesNotInheritPreviousCrop:true`, `replaceDoesNotCropNewImage:true`, `replaceDoesNotDistortNewImage:true`, `replaceNewWorldARMatchesSourceAR:true`, `replaceRecalculatesWorldRectFromNewImageAspectRatio:true`, `replaceCenterPreserved:true`, `replaceCommittedAtomically:true`, `replacedImageVisibleInPreview:true`, `replacedImageVisibleInExport:true`, `unchangedAssetLostBitmapAfterOtherAssetReplace:false`, `assetBlinkDetectedAfterReplace:false`, `smokeTestFallback:false`.
- [ ] Teste em iPhone/Safari real (fechar/reabrir app, trocar imagens de proporções diferentes, Preview, Export MP4).

## v8z4b31S

Base confirmada antes do patch: `v8z4b31R` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME` e comentário do topo).

### Escopo
- [x] Corrige TDZ em `buildDiagnosticsText()` (`_k_isAssetsMode`/`_k_highlightIdx` usados antes da declaração) que derrubava o coletor real.
- [x] Restaura/consolida `window.AppDebug.{collect,open,copy,smokeTest}`; botão Diagnóstico chama somente `window.AppDebug.open()`.
- [x] `collect()` retorna dados reais campo-a-campo + `smokeTest({fallback:false})` + relatório rico isolado; sem `diagnosticFallback:true` com app carregado.
- [x] `open()` não depende de `currentMode`/`activePanel`, não chama `closeAll()` nem usa overlay; fecha apenas o Settings.

### Validação obrigatória
- [ ] Menu mostra "Arco Motion App v8z4b31S" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b31S`).
- [ ] Abrir Settings → tocar em Diagnóstico: painel abre e NÃO fecha imediatamente.
- [ ] Texto do diagnóstico aparece e NÃO contém `diagnosticFallback: true`.
- [ ] Diagnóstico mostra dados reais: `app`, `version`, `timestamp`, `userAgent`, `viewport`, `devicePixelRatio`, `mode`, `framesCount`, `activeFrameIndex`, `assetsCount`, `selectedAssetId`, `preview`, `exportState`, `rendererWorld`, `smokeTest`.
- [ ] Copiar diagnóstico funciona (clipboard ou seleção manual no Safari).
- [ ] Fechar e reabrir Diagnóstico: abre na segunda vez.
- [ ] Abre no Modo Câmera e no Modo Ativos; abre antes e depois de um Preview curto.
- [ ] Preview e Export não foram alterados; Layers, Trocar imagem e Reset permanecem como na v31R.
- [ ] Teste em iPhone/Safari real.

## v8z4b31O

Base confirmada antes do patch: `v8z4b31N` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME` e comentário do topo).

- [ ] Menu mostra "Arco Motion App v8z4b31O" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b31O`).
- [ ] Modo Câmera: Frame 3/4 destacam chip, Stage e cutout do alfa no mesmo índice; pan/zoom mantém scrim viewport-fixed.
- [ ] Modo Ativos: tocar/rolar até Frame 3/4 destaca chip central, frame no Stage, número e cutout do alfa no mesmo índice, com cor roxa e edição bloqueada.
- [ ] Legibilidade: frames não selecionados mais visíveis (opacidade 0.88/0.92 e stroke 3.0), mantendo frame ativo dominante.
- [ ] Diagnóstico preserva `stageDimSvgParentIsStageContent:false`, `filmAlphaScrimParentIsViewportLayer:true`, `filmAlphaScrimMovesWithPanZoom:false`, `filmAlphaScrimViewportFixed:true`, `timelineCenterDotsAlignedToActiveChip:true`, `timelineCenterDotsLateralDeltaPx:0`.
- [ ] Preview/Export/JSON/ProjectWorld sem regressão; Preview e Export não mostram alfa.

## v8z4b31N

Base confirmada antes do patch: `v8z4b31M` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME` e comentário do topo).

### Validação obrigatória
- [ ] Menu mostra "Arco Motion App v8z4b31N" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b31N`).
- [ ] Diagnóstico mostra `stageDimSvgParentIsStageContent:false`, `filmAlphaScrimParentIsViewportLayer:true`, `filmAlphaScrimMovesWithPanZoom:false`, `filmAlphaScrimViewportFixed:true`.
- [ ] Em Modo Câmera, com múltiplos assets visíveis, o scrim cobre 100% do viewport e não desliza ao panar/alterar zoom em 69% e 102%; apenas o cutout acompanha o frame ativo.
- [ ] Em Modo Ativos com referências, o scrim permanece fixo no viewport e abaixo de frames/números/curvas, sem bloquear hit-test de assets/frames.
- [ ] Preview curto e Export MP4 curto não mostram alfa/scrim de editor.
- [ ] Bolinhas centrais laranjas da timeline continuam na posição corrigida da v8z4b31M.

## v8z4b31M

Base confirmada antes do patch: `v8z4b31L` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME` e comentário do topo).

### Escopo
- [x] Scrim alfa global do editor cobre o viewport visível e não depende de asset[0], slot central, selectedAsset ou imagem principal.
- [x] Scrim fica acima de assets e abaixo de frames/curvas, com reempilhamento após render/reorder/decode/redraw.
- [x] Bolinhas centrais da timeline usam o centro real do chip/frame ativo via geometria renderizada.
- [x] Preview, Export, JSON, ProjectWorld, curvas, easing e lógica de seleção preservados.

### Teste obrigatório em iPhone/Safari real
- [ ] Validar múltiplos assets nos cantos/superior/inferior e maior zIndex com scrim acima dos assets.
- [ ] Validar reorder Frente/Trás, pan e zoom com scrim cobrindo o viewport visível.
- [ ] Validar que Preview curto e Export MP4 curto não mostram o scrim.
- [ ] Validar Frames 4, 5 e 6 com bolinhas superior/inferior centralizadas no chip ativo em Modo Câmera e Modo Ativos.
- [ ] Validar rolagem manual da timeline e abrir/fechar menus inferiores sem desalinhamento lateral.


# QA pendente — v8z4b31F: Single Film System Architecture (seleção/timeline/localização únicas)

> Base: `v8z4b31E`. Correção arquitetural controlada. Aprofunda a unificação: **seleção, timeline (bolinha/mira) e localização** passam a ser um único sistema compartilhado entre Modo Frames/Câmera e Modo Ativos/Mundo. O Modo Ativos **consome o mesmo sistema** do Modo Frames, diferindo apenas em `presentationMode`/`stylePreset`/`editability`. NÃO altera Preview/Export/WebCodecs/save/load/schema/upload/múltiplos assets/Frente-Trás/undo-redo/menu+/layout/textos/ícones.

## Escopo v8z4b31F

1. Menu mostra "Arco Motion App v8z4b31F" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b31F`).
2. **Teste 1 — alternância de modo (critério 2).** Modo Ativos → selecionar Frame 12 → alternar para Modo Frames → confirmar **Frame 12 selecionado** → alternar de volta para Modo Ativos → confirmar **Frame 12 referenciado**. Repetir com outros frames. Diagnóstico: `canonicalFrameIndex` = 11, `allFrameTargetsMatchCanonical: true`, `frameTargetMismatchDetected: false`, `modeSwitchPreservesCanonicalFrame: true`, `modeSwitchChangedCanonicalFrame: false`.
3. **Teste 2 — timeline mira fixa (critério 4/5).** No Modo Ativos, arrastar a timeline horizontalmente → a **bolinha central NÃO se move**; os frames rolam por baixo dela. Clicar em outro frame → o frame **rola até a bolinha**. Alternar para Modo Frames → **mesmo comportamento**. `timelineCenterMarkerIsFixedOverlay: true`, `timelineCenterMarkerInsideScrollableContent: false`, `timelineMarkerMovedWithScrollableContent: false`, `timelineMarkerFixedDuringManualScroll: true`, `timelineFrameUnderMarkerMatchesCanonical: true`, `singleTimelineEngineEnabled: true`.
4. **Teste 3 — opacidade uniforme (critério 10/11).** Ligar referências no Modo Ativos pelo ícone → observar frames não selecionados; clicar em frame na timeline; clicar no Stage; selecionar asset; pan/zoom → frames não selecionados mantêm **mesma opacidade e espessura** sempre. `assetsModeInactiveFrameOpacityUniform: true`, `assetsModeInactiveFrameStrokeUniform: true`, `assetsModeInactiveFrameOpacityChangedBySource: false`, `assetsModeInactiveFrameStrokeChangedBySource: false`, `assetsReferenceStyleActivationSourceAgnostic: true`.
5. **Teste 4 — editabilidade (critério 7).** No Modo Ativos, tentar arrastar frame → frame **não edita**; asset continua editável. Alternar para Modo Frames → o **mesmo frame fica editável**. `assetsModeFrameEditable: false`, `assetsModeFrameHitTestSuppressed: true`, `assetsModeFrameHandlesSuppressed: true`, `assetsModeFrameHudSuppressed: true`, `cameraModeFrameEditable: true`, `assetsModeAssetEditingEnabled: true`.
6. **Teste 5 — curva (critério 13).** Observar curva no Modo Frames → alternar para Modo Ativos → confirmar **mesma curva** em branco/cinza, **sem handles editáveis**. `singleCurveGeometrySource: true`, `curvePathSharedAcrossPresentationModes: true`, `curvePathMaxDeltaBetweenModesPx` ≈ 0.
7. **Teste 6 — Preview/Export (critério 16).** Rodar Preview e exportar MP4 → **ausência de overlays de editor**. `previewUsesNoEditorOverlay: true`, `exportUsesNoEditorOverlay: true`, `previewUnaffectedBySingleFilmSystem: true`, `exportUnaffectedBySingleFilmSystem: true`.
8. **Sem regressão** em save/load, preview, export, WebCodecs, assets, Frente/Trás, undo/redo, seleção de assets, menu "+", layout. Geometria/curva únicas do `v8z4b31E` preservadas. Testar em iPhone/Safari real.

---

# QA pendente — v8z4b31E: Unified Film Overlay System (sistema único de frames/curvas)

> Base: `v8z4b31D`. Correção arquitetural + ajuste visual controlado: **um único** sistema base de geometria (`getFilmFrameGeometry`) e de path de curva (`getFilmSegmentPathD`), com variação apenas de estilo/interatividade por modo (`renderFilmOverlay`). Isolamento de visualização entre modos e legibilidade. NÃO altera layout/cores/ícones/textos/menu+/upload/save/load/preview/export/WebCodecs/ProjectWorld/assets/zIndex/motor/cálculo final.

## Escopo v8z4b31E

1. Menu mostra "Arco Motion App v8z4b31E" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b31E`).
2. **Teste 1 — centro do frame.** Modo Câmera → selecionar frame **rotacionado** → o ponto central fica no **centro visual do retângulo**. Alternar para Modo Ativos → o centro continua no mesmo lugar relativo ao frame. Diagnóstico: `frameCenterMatchesRotatedRectCenter: true`, `frameCenterDeltaFromRectCenterPx` ≈ 0, `frameRectAndCenterUseSameGeometry: true`.
3. **Teste 2 — curva igual.** Observar a curva no Modo Câmera → alternar para Modo Ativos → a curva **branca/cinza** segue o **mesmo caminho**; voltar para Câmera → o path não muda. `curvePathVisualMismatchDetected: false`, `curvePathMaxDeltaBetweenModesPx` ≈ 0, `assetsModeCurveUsesRealCameraPath: true`, `assetsModeCurveUsesSimplifiedLine: false`, `assetsModeCurvesUseAccentColor: false`.
4. **Teste 3 — contaminação visual.** No Modo Câmera, com o dim/foco escurecendo a imagem fora do frame ativo → alternar para Modo Ativos → a imagem **não** herda o escurecimento; se referências estiverem ligadas, usa só o scrim próprio. `cameraDimOverlayClearedOnEnterAssets: true`, `cameraFrameOnlyViewClearedOnEnterAssets: true`, `assetsUsesOwnReferenceScrimOnly: true`, `visualModeContaminationDetected: false`.
5. **Teste 4 — legibilidade.** Modo Câmera sobre imagem clara/complexa: frame ativo ciano e legível (borda 4.0), outros frames mais visíveis (0.78/0.88). Modo Ativos com referências ligadas: frames não selecionados mais visíveis (0.40), selecionado roxo dominante. `cameraModeActiveFrameStrokeWidth: 4`, `cameraModeInactiveFramesLegible: true`, `assetsModeInactiveFrameOpacity: 0.4`, `assetsModeSelectedFrameDominant: true`.
6. **Teste 5 — toggle.** No Modo Ativos, tocar o ícone Ativos → referências aparecem (frames+números+curvas+scrim); tocar de novo → tudo some, sem resíduo. Repetir 5×. `assetsReferencesToggleOffClearsFrames/Curves/Scrim: true`, `assetsReferencesResidualAfterOffDetected: false`.
7. **Teste 6 — Preview/Export.** Rodar Preview e exportar → nenhum overlay de editor (frames/números/curvas/scrim/HUD/handles) aparece. `previewExcludesFilmOverlay: true`, `exportExcludesFilmOverlay: true`.
8. **Sem regressão** em save/load, preview, export, WebCodecs, assets, Frente/Trás, seleção, layout. Frente/Trás de assets não altera frames/curvas (`assetReorderChangedFilmOverlay: false`). Testar em iPhone/Safari real.

---

# QA pendente — v8z4b31A: curvas acima dos assets + localização/destaque no Modo Ativos + Redo de delete

> Base: `v8z4b30ZZ`. Correção **focada** dos três bugs restantes: (1) curvas/trechos atrás dos assets no Modo Câmera; (2) localização/destaque inequívoco de frame/trecho no Modo Ativos; (3) Redo após deletar imagem/asset. NÃO altera layout, cores, textos, ícones, fluxo, preview/export ou funcionalidades não relacionadas.

## Escopo v8z4b31A

1. Menu mostra "Arco Motion App v8z4b31A" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b31A`).
2. **Teste A — curvas acima dos assets (item 1).** Abrir projeto com múltiplas imagens → Modo Câmera → selecionar frame com curva/trecho visível: a **curva/trecho aparece acima das imagens**. Diagnóstico: `curveOverlayLayerAboveAssets: true`, `curveOverlayIsOutsideAssetLayerStack: true`, `curveOverlayAffectedByAssetZIndex: false`, `curvesBehindAssetsDetected: false`, `cameraCurveLayerZ: 18`, `cameraAssetBandMax: 15`, `curveOverlayRebuiltOnModeChange: true`, `curveOverlayRedrawnAfterModeChange: true`. Preserva `frameOverlayLayerAboveAssets: true` / `framesBehindAssetsDetected: false`. Frente/Trás nunca afeta a curva (`assetReorderChangedCurveLayer: false`).
3. **Teste B — referência de frame no Modo Ativos (item 2).** Modo Ativos → ligar referências (ícone Ativos) → clicar em Frame 4 no painel: o Stage **localiza e destaca claramente** o Frame 4 (opacidade total, contorno/brilho roxo, número visível). Painel, timeline e Stage mostram o **mesmo** item. `assetsModeSelectedReferenceHighlightVisible: true`, `assetsModeSelectedReferenceHighlightIndex: 3`, `assetsModePanelLabelMatchesReference: true`, `assetsModeTimelineMatchesReference: true`, `assetsModeStageMatchesReference: true`, `assetsModeReferenceSyncConsistent: true`.
4. **Teste C — referência de trecho no Modo Ativos (item 2).** Clicar em Trecho 4–5: o Stage localiza a região, os **dois frames** aparecem, a curva/linha aparece **acima dos assets**, o trecho fica destacado. `assetsModeSelectedSegmentViewportLocalized: true`, `assetsModeSelectedSegmentIndex` correto, `assetsModeReferenceSyncConsistent: true`.
5. **Teste D — persistência das referências (item 3, preservado).** Com referências ligadas, tocar no Stage, tocar em asset, pan/zoom, clicar em frame/trecho no painel: referências **não somem**. Tocar novamente no ícone Ativos: referências **somem**. `assetsModeReferencesPersistent: true`, `assetsModeReferencesToggleOnlyByModeButton: true`, `assetsModeReferencesDismissedByStageTap: false`, `assetsModeReferencesDismissedByAssetTap: false`.
6. **Teste E — Redo de delete de asset (item 4).** Modo Ativos → selecionar asset → Excluir (some) → Undo (volta) → Redo (some novamente). `lastAssetRedoAction: redo`, `lastAssetRedoneId` = id do asset, `assetRedoVisualUpdateRan: true`, `projectWorldCompositeInvalidatedAfterAssetRedo: true`, `stageRedrawnAfterAssetRedo: true`, `redoDeletedAssetExistsAfterRedo: false`, `redoStackConsumedAfterAssetRedo: true`, `undoStackUpdatedAfterAssetRedo: true`, `assetRedoChangedOnlyAssets: true`. O asset restaurado pelo Undo preserva id/source/sourceW-H/worldX-Y/worldW-H/zIndex/slotRow-Col/fitMode/visible.
7. **Teste F — preview/export (preservado).** Ativar referências no Modo Ativos, rodar Preview e exportar: referências **não** aparecem no Preview final nem no MP4.
8. **Sem regressão** em preview/export/save/load, motor de curvas/frames, Modo Câmera/Frames, seleção de assets, Frente/Trás. Testar em iPhone/Safari real. Engasgo observado no fim do Preview de projeto pesado **não** é bug desta versão.

---

# QA pendente — v8z4b30ZZ: camada absoluta de câmera (frames/trechos/curvas) acima dos assets

> Base: `v8z4b30ZY`. Correção arquitetural: **frames, contornos, números, trechos e curvas são camada ABSOLUTA de câmera/editor** e nunca entram na pilha de assets nem são afetados por `asset.zIndex`/Frente-Trás. Banda de z-index dedicada dentro de `#stageContent`; referências persistentes no Modo Ativos; ícone do Modo Ativos mostra referências de verdade; trechos/curvas de referência; scrim de contraste; localização do viewport; timeline suave compartilhada. NÃO altera motor de preview/export/save/load, ProjectWorld, frames, curvas, interpolação, layout, cores, textos, ícones ou fluxo aprovado. Sem painel novo de layers e sem movimentação avançada de ativos.

## Escopo v8z4b30ZZ

1. Menu mostra "Arco Motion App v8z4b30ZZ" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b30ZZ`).
2. **Item 1 — camadas.** Ir de Modo Ativos → Modo Câmera **sem clicar em nada**: frames/curvas/números aparecem **imediatamente acima** da imagem. Diagnóstico: `frameOverlayLayerAboveAssets: true`, `curveOverlayLayerAboveAssets: true`, `framesBehindAssetsDetected: false`, `frameOverlayRebuiltOnModeChange: true`, `frameOverlayRedrawnAfterModeChange: true`. Frente/Trás nunca muda a ordem dos frames (`assetReorderChangedFrameLayer: false`).
3. **Item 2 — referências persistentes.** No Modo Ativos, ligar referências (ícone Ativos), tocar no Stage e tocar/mover/escalar/rotacionar assets: referências **continuam visíveis**. `assetsModeReferencesPersistent: true`, `assetsModeReferencesDismissedByStageTap: false`, `assetsModeReferencesDismissedByAssetTap: false`, `assetsModeReferencesStillVisibleAfterAssetSelection: true`.
4. **Item 3 — ícone mostra de verdade.** Tocar no ícone Ativos (já em Ativos) mostra frames/números/curvas **imediatamente** no Stage, sem clicar no painel inferior. `assetsModeIconToggleReferencesVisibleOnStage: true`, `assetsModeIconToggleToastMatchesVisualState: true`.
5. **Item 4 — trechos/curvas.** Selecionar um trecho (ease-pill) no painel: vê os **dois frames** e a **linha/curva** entre eles, trecho destacado, sem handles. `assetsModeFilmPathReferencesVisible: true`, `assetsModeCurveReferencesVisible: true`, `assetsModeSelectedSegmentIndex/From/To` corretos, `assetsModeCurveReferenceIsEditable: false`.
6. **Item 5 — contraste.** Com referências ativas, frames/números/curvas legíveis sobre imagens claras/escuras (scrim leve). `assetsModeReferenceBackdropVisible: true`, `assetsModeReferenceBackdropAboveAssets: true`, `assetsModeReferenceBackdropBelowFrames: true`.
7. **Item 6 — localizar no Stage.** Clicar no Frame 11 → o Stage **navega** (panorâmica suave) até o Frame 11; clicar no Trecho 11–12 → navega até a região do trecho. `assetsModeSelectedFrameViewportLocalized` / `assetsModeSelectedSegmentViewportLocalized`, `assetsModeViewportLocalizationAnimated: true`, `assetsModeViewportLocalizationCompleted: true`.
8. **Item 7/8 — timeline.** No Modo Ativos a timeline usa a **mesma animação suave** do Modo Câmera (sem jump), bolinha no item correto, **um único** destaque. `assetsModeTimelineUsesCameraModeAnimation: true`, `assetsModeTimelineJumpDetected: false`, `timelineMultipleActiveHighlightsDetected: false`, `assetsModeOnlyOneFrameReferenceHighlighted: true`.
9. **Item 9 — info do frame (Câmera).** No Modo Câmera, ao entrar/selecionar frame, o texto/HUD de informação aparece e acompanha o frame correto. `frameActiveInfoTextVisible: true`.
10. **Item 10 — assets.** Selecionar qualquer asset mostra contorno roxo (`assetSelectionOutlineVisible: true`); excluir remove visualmente na hora; Undo restaura na hora; Redo remove na hora (`assetDeletedVisualUpdateRan`, `assetUndoVisualUpdateRan`, `stageRedrawnAfterAssetDelete/Undo: true`).
11. **Item 12 — preview/export.** Ativar referências no Modo Ativos e rodar Play/Preview e exportar: referências/scrim/números **não** aparecem no preview final nem no MP4. `previewExcludesEditorFrameReferences: true`, `exportExcludesEditorFrameReferences: true`.
12. **Sem regressão** em preview/export/save/load, motor de curvas/frames, e no Modo Câmera/Frames. Testar em iPhone/Safari real.

---

# QA pendente — v8z4b30ZR: troca real e centralizada de modo + barra superior em três duplas

> Base: `v8z4b30ZQ`. Corrige a origem do problema de troca de modo: `setEditorMode(mode, source)` é a ÚNICA fonte de verdade e fica totalmente instrumentada; botões Câmera/Ativos passam obrigatoriamente por `setMode(...)`. Reorganiza a barra superior em três duplas fixas (grid `1fr auto 1fr`), restaura o zoom/world-view dinâmico do editor e expande o diagnóstico de modo. NÃO altera preview, export, save/load, ProjectWorld, frames, curvas, interpolação, render ou motor.

## Escopo v8z4b30ZR

1. Menu mostra "Arco Motion App v8z4b30ZR" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b30ZR`).
2. **Barra superior — três duplas fixas:** esquerda = Câmera + Ativos; centro = Settings/Arquivos + Play (realmente centralizada); direita = Undo + Redo. Trocar de modo **não** move os ícones (só muda estado/cor/contexto).
3. **Tocar em Ativos** → diagnóstico: `lastModeButtonTapped: assets`, `lastModeRequested: assets`, `lastModeApplied: assets`, `lastModeChangeSource: topModeButtonAssets`, `setModeLastBlockedReason: none`, `activeMode: assets`, `bottomContextMode: asset`, `toolbarContext: asset`, `assetModeButtonActive: true`, `cameraModeButtonActive: false`, `assetToolbarVisible: true`, `frameToolbarVisible: false`, `modeStateConsistent: true`.
4. **Tocar em Câmera** → diagnóstico: `lastModeButtonTapped: camera`, `lastModeApplied: camera`, `lastModeChangeSource: topModeButtonCamera`, `activeMode: camera`, `bottomContextMode: frame`, `toolbarContext: frame`, `cameraModeButtonActive: true`, `assetModeButtonActive: false`, `assetToolbarVisible: false`, `frameToolbarVisible: true`, `modeStateConsistent: true`.
5. **Entrar em Ativos limpa seleção:** `frameSelectionClearedOnEnterAssets: true`, `segmentSelectionClearedOnEnterAssets: true`; o Stage não mantém frame/segmento selecionado como foco.
6. **Modo Ativos:** imagens/assets são o foco (contorno roxo); frames/trechos discretos ou ocultáveis via `showFrameReferencesInAssetsMode` (toggle de frames no menu do "+").
7. **Frente/Trás** funcionam sobre o asset selecionado (≥2 assets); motivos corretos: "asset já está no topo" / "asset já está no fundo" / "apenas 1 asset — sem outra camada" / "nenhum asset selecionado". Nova ordem reflete em Stage, Preview, Export e Save/Load.
8. **Consistência visual:** `modeButtonVisualStateConsistent` e `toolbarVisualStateConsistent` validam botões/toolbars; `modeStateConsistent` fica `false` em qualquer combinação contraditória.
9. **Zoom dinâmico:** com ProjectWorld inicializado, `editorMinZoomMode: dynamic`, `worldViewBounds*` preenchidos, `fitAllWorldZoom` calculado e `canViewAllSlotsAtMinZoom: true`. Não altera câmera/frames/preview/export.
10. **Sem regressão** em preview/export/save/load e no Modo Câmera/Frames. Testar em iPhone/Safari real.

---

# QA pendente — v8z4b30ZK: alternância inicial entre Modo Câmera e Modo Ativos

> Base aprovada: `v8z4b30ZI` (Preview sem tranco). Reaproveita apenas a lógica segura de seleção de assets da 30ZJ e **remove** o botão "Selecionar" indevido. Cria a estrutura inicial de dois modos de edição (Câmera/Frames/Filmagem e Ativos/Mundo/Imagens) alternáveis pelo topo. NÃO move/escala/rotaciona assets; sem crop/moldura/texto/GIF/stickers/efeitos temporais; NÃO altera Preview, Export, Save/Load nem ProjectWorld.

## Escopo v8z4b30ZK

1. App abre igual; menu mostra "Arco Motion App v8z4b30ZK" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b30ZK`).
2. Abrir projeto existente da 30ZI: abre igual, sem mudança visual.
3. **Modo Câmera (padrão)** funciona igual ao atual: frames editáveis, curvas/handles, timeline e menu inferior; Preview continua sem tranco; Export continua igual.
4. Botão "Selecionar" da 30ZJ **não** existe mais no menu Arquivos.
5. Topo tem dois ícones de modo: **câmera** (ativa `editorMode='camera'`, cor ciano/verde) e **imagem** (ativa `editorMode='assets'`, cor roxa). O ícone do modo ativo recebe destaque de cor.
6. **Modo Ativos:** frames continuam visíveis como referência, porém mais discretos/transparentes e **não editáveis** (handles/curvas não respondem; tocar no frame não inicia drag).
7. **Seleção no Stage:** tocar numa imagem/asset seleciona (contorno roxo, só no editor); tocar em outro asset troca a seleção; tocar no vazio limpa; assets sem imagem não são selecionáveis; sobreposição seleciona o de maior zIndex.
8. **Layers:** tocar numa miniatura do painel Layers seleciona o asset correspondente.
9. **Barra contextual inferior do Modo Ativos:** sem asset selecionado mostra estado geral ("Toque numa imagem para selecionar" / "Nenhuma imagem no mundo ainda"); com asset selecionado mostra o nome ("Imagem 1"…).
10. Voltar para Modo Câmera: frames voltam a ser editáveis normalmente.
11. **Preview/Export:** o contorno de seleção **nunca** aparece no Preview nem no vídeo exportado.
12. **Save/Load:** salvar/reabrir não muda nada visualmente; `selectedAssetId` é só de memória (volta a `null` ao carregar) e o editor retorna ao Modo Câmera; projetos da 30ZI abrem iguais; `ProjectWorld`/frames inalterados.
13. Testar em iPhone/Safari real (toque, pinch/zoom de dois dedos preservado no Modo Ativos).

# QA pendente — v8z4b30ZA: sistema de coordenadas único do ProjectWorld (mundo híbrido) + auditoria de render/handles

> Base confirmada: `v8z4b30Z` (não revertida). Hotfix cirúrgico de coordenadas: elimina o mundo híbrido (Estratégia A — `preserveSavedWorld`) para que `ProjectWorld`, assets, frames, curvas, câmera, Preview e Export usem um único sistema canônico ancorado em `baseStageW/H`; o Stage atual é apenas viewport. Corrige o asset do slot superior direito sumindo/piscando com 9 imagens. Adiciona auditoria de escala mista, render transform real por asset e consistência de handles. NÃO altera UI/layout/cores/textos/ícones/menus, fluxo Inserir/Trocar, reset, zoom dinâmico, pan/zoom/touch, WebCodecs/muxer/encoder, motor de curvas; sem Layers, sem cenas, sem "Inverter sentido". Não promove para estável.

## Escopo v8z4b30ZA

1. App abre igual visualmente; menu mostra "Arco Motion App v8z4b30ZA" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b30ZA`).
2. **Teste 1 — carregar arquivo com 9 imagens.** Após carregar projeto com os 9 slots preenchidos, no Diagnóstico: `framesRestoredInProjectWorld=true`, `mixedWorldScaleDetected=false`, `worldCoordinateSystemConsistent=true`, `asset0MatchesWorldCoordinateSystem=true`, `allAssetsSameCoordinateSystem=true`, `worldCoordinateStrategy=preserveSavedWorld`. `projectWorldW/H` == `projectWorldBaseStageW/H`.
3. **Teste 2 — trecho superior direito.** Preview no trecho que chega ao asset do slot superior direito: a imagem aparece corretamente, não pisca, não some, não pula a chegada. Exportar MP4: o mesmo. No Diagnóstico, para o asset superior direito: `considered=true`, `drawn=true`, `imageReady=true`, `decodeReady=true`, `intersectsCamera=true`, `screenArea>0`, `alphaUsed>0`, `cullingReason=none`.
4. **Teste 3 — regressão com todos os slots.** Passando por todos os trechos entre imagens, nenhum asset some/pisca ao chegar. `previewAssetsConsideredCount=9`, `exportAssetsConsideredCount=9`, `previewUsedSlotFilter=false`, `exportUsedSlotFilter=false`, `endpointContinuityOkAllSegments=true`, `renderTransformConsistent=true`, `cameraAssetCoordinateMismatch=false`.
5. **Teste 4 — handles.** Primeiro/intermediário/último frame: `ghostHandlesConsistent=true`; último frame sem handle de saída válido (`activeFrameHasValidOutHandle=false`, `ghostInActualFrameIndex=none`); primeiro frame sem handle de entrada válido (`activeFrameHasValidInHandle=false`, `ghostOutActualFrameIndex=none`); frame intermediário com entrada/saída coerentes; após soltar um drag, `lockedDragSegmentIndex`/`lockedDragCurveIndex`=`none` (sem fantasma).
6. Mundo híbrido impossível: não pode haver `baseStage` em 341×512 com `asset[0]`/`projectWorld.w` em 374×561. Arquivo da 30Z salvo já híbrido é auto-curado no load.
7. Preview/Export continuam usando o World Renderer: `exportUsedWorldRenderer=true`, `exportFallbackToSingleImage=false`, `previewUsedMainImageOnlyPath=false`, `exportUsedMainImageOnlyPath=false`.
8. Save/load de frames (30W/30Y/30Z) preservado; WebCodecs funcionando; `exportSuccess=true`; fundo `#3c3c3b`.
9. Projeto de **imagem única** sem regressão (Stage = mundo); Preview/MP4 1:1/9:16/4:3 idênticos.
10. Sem qualquer alteração de UI/layout/menu/texto/ícone; Layers, Reset, Inserir/Trocar, zoom dinâmico e "Inverter sentido" inalterados; sem `prompt()`/`alert()`/`confirm()`.

# QA pendente — v8z4b30U: fluxo de imagem (Inserir/Trocar) + navegação superior + zoom out do ProjectWorld

> Base confirmada: `v8z4b30R` (`v8z4b30S`/`v8z4b30T` canceladas; `index.html` restaurado de `v8z4b30R` antes desta versão). Implementa duas ações diretas de imagem com intenção/alvo congelados antes do seletor, X/Fechar movido para "Início" no menu Arquivo (sem deslocar Preview/Visualizar) e zoom out dinâmico para ver o grid. Não implementa painel de layers/reorder nem edição livre de posição/escala. Não altera motor de curvas/frames, WebCodecs/FPS/muxer, touch/pan/zoom de câmera dos frames, cores/textos/posições aprovadas. Não promove para estável.

## Escopo v8z4b30U

1. App abre igual visualmente; menu mostra **uma** versão: "Arco Motion App v8z4b30U" (`APP_VERSION`=`APP_VERSION_NAME`=`v8z4b30U`); sem 2ª linha de versão e sem resíduo de `v8z4b30R/S/T`.
2. Menu Arquivos tem **duas** ações diretas: "Inserir imagem" e "Trocar imagem"; não existe ação única ambígua de imagem.
3. Fotos/Arquivos só abre **depois** de escolher Inserir/Trocar (e o slot/alvo quando aplicável); o app não pergunta após o arquivo.
4. Inserir imagem no centro: cria novo asset (`assets.length` +1) no centro; `lastImageActionType=insertImage`, `addedAssetId` preenchido, `replacedAssetId=n/d`.
5. Inserir imagem em slot lateral vazio: cria novo asset no slot escolhido (não cai no centro).
6. Inserir imagem em slot ocupado: cria nova camada acima (não substitui, não bloqueia); `slotOccupiedOnInsert: true`.
7. Trocar imagem principal: substitui `img-1` sem aumentar `assets.length`; `lastImageActionType=replaceImage`, `replacedAssetId` preenchido, `addedAssetId=n/d`.
8. Trocar imagem lateral: substitui apenas o asset alvo (não toca em `img-1`); `assets.length` inalterado.
9. Trocar em slot vazio: não abre seletor, não cai no centro (status visual).
10. Com apenas a imagem principal: só a principal é oferecida para troca (sem slots laterais vazios).
11. Undo de Inserir remove o asset inserido; Undo de Trocar restaura a imagem anterior; nenhum afeta imagens de outros slots.
12. Salvar/carregar: projeto com 1 imagem, com múltiplas imagens e com layers no mesmo slot voltam com `zIndex`/posições corretos; projeto salvo após Inserir/Trocar carrega com o resultado; `v8z4b30R` continua abrindo (schemaVersion 1).
13. X/Fechar não aparece mais isolado à esquerda; menu Arquivo tem "Início" (ícone Lucide `home`) que executa a mesma ação do antigo X (volta à tela inicial, preserva aviso de não salvo).
14. Topo: **Preview** e **Visualizar** permanecem na mesma posição da `v8z4b30R` (placeholder invisível preserva a geometria; sem reflow).
15. Zoom out: com grid 3x3, o gesto de pinça permite zoom out menor/dinâmico até ver todo o ProjectWorld; projeto de 1 imagem mantém o mínimo atual. Diagnóstico: `editorMinZoomMode`, `dynamicEditorMinZoom`, `worldViewBounds*`, `fitAllWorldZoom`, `canViewAllSlotsAtMinZoom`.
16. Zoom out não altera frames, Preview, Export nem escala real dos assets.
17. Preview/Export multi-imagem continuam: `exportUsedWorldRenderer=true`, `exportFallbackToSingleImage=false`; MP4 1:1/9:16/4:3 sem regressão; fundo `#3c3c3b`.
18. Reset preserva imagens (reseta apenas caminho/frames).
19. iPhone/Safari: seletor abre dentro do gesto do usuário (toque na ação/slot); sem regressão de gestos/curvas.
20. Sem `prompt()`/`alert()`/`confirm()` em todo o fluxo.

# QA pendente — v8z4b30Q: HOTFIX fase 1 múltiplas imagens (fundo padrão + export sem salto)

> Base confirmada: `v8z4b30P`. HOTFIX de estabilização: corrige o fundo padrão do projeto (cinza `#3c3c3b`) e o salto para a imagem inteira no export MP4 ao transitar entre imagens diferentes. Valida (sem mudança de código) o undo de adicionar/substituir imagem e a regra de "Substituir imagem atual" sempre na imagem principal/central. Não implementa seleção de imagem, layers, cenas, edição livre de posição/escala. Não altera motor de curvas/easing/timing/pausa/loop/escala/rotação, touch/drag/resize/zoom, comportamento mobile/iPhone/Safari além do necessário. Não promove para estável.

## Escopo v8z4b30Q

1. App abre igual visualmente (`v8z4b30Q` no menu/configurações; `APP_VERSION`/`APP_VERSION_NAME` em `v8z4b30Q`).
2. Projeto novo (1 imagem): fundo do Stage/Preview/Export é cinza `#3c3c3b` por padrão (Diagnóstico: `DEFAULT_PROJECT_BG`, `currentProjectBg`, `getProjectBackgroundColor()`, `renderBgUsed`/`previewBgUsed`/`exportBgUsed` todos `#3c3c3b`, `bgColorUserSet: false`).
3. Escolher preto explicitamente em "Cor de fundo": Stage/Preview/Export ficam pretos (`bgColorUserSet: true`), preservado ao salvar/recarregar o projeto.
4. Abrir um projeto/autosave salvo antes desta correção com fundo preto legado (sem `bgColorUserSet`): fundo passa a `#3c3c3b` em vez de preto.
5. `renderBgUsed`/equivalente no Diagnóstico passa a exibir um valor de cor (não mais "n/d") após renderizar Stage/Preview/Export.
6. Projeto com 2+ imagens: exportar MP4 1:1/9:16/4:3 com frames cuja câmera transita entre frames de imagens diferentes — a transição mostra a câmera contínua sobre o `ProjectWorld` (incluindo o gap entre imagens, se a câmera passar por ele), sem saltar para mostrar a imagem inteira.
7. Diagnóstico durante/após export multi-imagem mostra `exportUsedWorldRenderer: true`, `exportFallbackToSingleImage: false` e `exportFallbackReason: nenhum` nos casos normais.
8. Projeto com 1 imagem: export/Preview continuam idênticos (sem regressão), `exportUsedWorldRenderer` permanece `false`/n/a.
9. "Adicionar como nova imagem": gera exatamente 1 passo de undo; `Ctrl/Cmd+Z` desfaz a adição (volta ao estado anterior) e redo reaplica; Preview/Export funcionam normalmente após undo/redo.
10. "Substituir imagem atual" em projeto com 2+ imagens: substitui apenas a imagem principal/central (`img-1`/`assets[0]`); imagens laterais permanecem inalteradas; gera exatamente 1 passo de undo restaurando a imagem anterior (com metadados), redo reaplica; Preview/Export funcionam após undo/redo.
11. iPhone/Safari: sem regressão de memória/performance ao adicionar/substituir imagens e fazer undo/redo repetidamente (sem duplicar base64/blobs, sem leak de proxies/objectURLs/bitmaps).
12. Sem `prompt()`/`alert()`/`confirm()` em todo o fluxo.

# QA pendente — v8z4b30O: múltiplas imagens (fase 1) — Preview/Export + espaçamento

> Base confirmada: `v8z4b30N`. Corrige a fase 1 de múltiplas imagens com foco em Preview/Export e espaçamento entre imagens. Não implementa edição livre de posição/escala, painel de layers nem cenas. Não altera o motor de curvas, o motor de export MP4 1:1/9:16/4:3, `Stage`/`layoutStage()` além do mínimo, zoom/pan/clamps. Não promove para estável.

## Escopo v8z4b30O

1. App abre igual visualmente (`v8z4b30O` no menu/configurações; `APP_VERSION`/`APP_VERSION_NAME` em `v8z4b30O`).
2. Projeto com 1 imagem continua igual (Stage, Preview, MP4 1:1/9:16/4:3, frames/curvas/zoom/pan).
3. Adicionar segunda imagem no slot esquerdo cria espaçamento visível (não encosta na imagem principal).
4. Adicionar segunda imagem no slot direito cria espaçamento visível.
5. Slots acima/abaixo também criam espaçamento (gap em mundo).
6. Stage mostra a(s) imagem(ns) adicionada(s).
7. O frame pode ser movido para a região da segunda imagem (modo livre, sem clamp).
8. Preview **não** abre tela preta com 2+ imagens.
9. Preview mostra a segunda imagem quando o frame aponta para ela.
10. MP4 1:1 continua funcionando.
11. MP4 9:16 continua funcionando.
12. MP4 4:3 continua funcionando.
13. MP4 com 2 imagens mostra o conteúdo correto conforme o frame/câmera.
14. Nenhuma mudança em projetos antigos de uma imagem.
15. iPhone/Safari: sem regressão de pan/zoom; conferir no Diagnóstico `worldGap usado`, `multiImageWorldActive`, `renderWorldLastAssetCount`, `previewRenderAssetCount`, `exportRenderAssetCount`, `lastPreviewError`, `lastWorldRenderError`, e por asset `visible`/`zIndex`/`worldX/Y`/`worldW/H`/`sourceW/H`.
16. Sem `prompt()`/`alert()`/`confirm()` em todo o fluxo.

# QA pendente — v8z4b30E: HOTFIX export MP4 após troca de formato

> Base confirmada: `v8z4b30D`. HOTFIX exclusivo: restaura a geração de MP4 após o usuário trocar o formato/proporção do projeto já configurado. Não implementa múltiplas imagens, não altera Stage, `layoutStage()`, zoom/pan/clamps, curvas, `projectWorld`/assets/views/permissões, visuais/ícones/textos/menus/fluxo aprovados. Não promove para estável.

## Escopo v8z4b30E

1. App abre igual visualmente (`v8z4b30E` no menu/configurações; `APP_VERSION`/`APP_VERSION_NAME` em `v8z4b30E`).
2. Projeto novo com imagem e mais de 4 frames: "Salvar MP4" gera o vídeo normalmente (com aviso/marca d'água Free, sem bloquear).
3. Trocar o formato/proporção do projeto (ex.: 9:16 → 1:1) e em seguida "Salvar MP4": exportação volta a funcionar, sem tela piscando e sem abortar silenciosamente.
4. Testar 1:1 → 9:16 e exportar com sucesso.
5. Testar 9:16 → 1:1 e exportar com sucesso.
6. Testar 9:16 → 16:9 (se disponível) e exportar com sucesso.
7. Após trocar de formato, o Preview continua funcionando normalmente (sem regressão de zoom/pan/frames).
8. A exportação após a troca de formato usa a resolução correta do novo formato (`exportDims[currentRatio]`), refletida em `exportW`/`exportH` no Diagnóstico.
9. Projetos com 4+ frames continuam mostrando o aviso/marca d'água premium sem bloquear a geração.
10. "Adicionar como nova imagem" continua bloqueado como recurso Plus (modal Plus, nenhuma segunda imagem renderizada).
11. Nenhuma segunda imagem é renderizada em nenhum cenário.
12. iPhone/Safari: confirmar ausência de tela piscando e de aborto silencioso ao exportar após troca de formato; em caso de erro, conferir que o painel Diagnóstico mostra `lastExportStep`/`lastExportError` com a etapa/mensagem real, além de `exportW`/`exportH`, `currentFormat`, frames com NaN/Infinity, quantidade de frames e marca d'água aplicada.

# QA pendente — v8z4b30D: fundação Project World / Assets / Visualizações / Premium Gate

> Base confirmada: `v8z4b30C` (v8z4b30A/B revertidas e ignoradas). Esta versão implanta apenas a fundação técnica do novo conceito, **sem** múltiplas imagens reais. Não altera motor, `layoutStage()`, cálculo de Stage, zoom/pan/clamps, frames, curvas, Preview, export nem o formato do JSON. Não promove para estável.

## Escopo v8z4b30D

1. App abre igual visualmente (`v8z4b30D` no menu/configurações; `APP_VERSION`/`APP_VERSION_NAME` em `v8z4b30D`).
2. Arquivo novo com uma imagem funciona igual (primeira imagem carrega direto, sem action sheet; Frame 1 ativo).
3. Trocar imagem por "Substituir imagem atual" funciona igual ao fluxo anterior (frames preservados, Stage recalculado normalmente).
4. Cancelar nova imagem não altera nada (fecha a action sheet e limpa o input).
5. Tentar "Adicionar como nova imagem" no Free mostra o modal Plus e não altera o projeto (nenhuma imagem adicionada/renderizada).
6. Nenhuma segunda imagem é renderizada nesta versão.
7. Frames continuam iguais.
8. Zoom/pan continuam iguais.
9. Preview continua igual.
10. Exportação continua igual.
11. Diagnóstico mostra `projectWorld` (initialized/x/y/w/h/baseStageW/baseStageH), `assets.length`, `imageAssetsCount`, `asset[0]` source/world, `views.length`, `canAddImageAsset` e `featureAccess multipleImageAssets`.
12. iPhone/Safari: confirmar que o fluxo de nova imagem usa a action sheet customizada e o modal Plus, sem `prompt()`, `alert()` ou `confirm()`.

# QA pendente — v8z4b29CD: Preview/Export com accent e refinamento visual da Linha do tempo

> Base confirmada: `v8z4b29CC`. Esta versão é apenas uma correção visual controlada: substitui verdes remanescentes do Preview/Export pelo accent ciano/azul oficial, clareia discretamente o fundo externo do painel “Linha do tempo” e remove a borda inferior perceptível da aba local ativa Todos/Frames/Trechos. Não altera motor, render/export, MP4, JSON, Stage, timeline funcional, frames, trechos, curvas, Tremor, Movimento Inteligente, Trajetória, launcher, upload ou Novo Projeto. Não promove para estável.

## Escopo v8z4b29CD

- Confirmar em iPhone/Safari real que a versão visível mostra `v8z4b29CD` e que `APP_VERSION`/`APP_VERSION_NAME` também estão em `v8z4b29CD`.
- Confirmar que, ao finalizar Preview/Export, o check/círculo de “Vídeo pronto!” e o ícone/estado pronto de “Salvar MP4” usam o accent ciano/azul do app, não verde.
- Confirmar que “Salvar MP4” continua funcionando e que o MP4 continua sendo gerado/salvo normalmente.
- Confirmar em Edição de Tempo > Tempo que o painel “Linha do tempo” ficou discretamente mais evidente pelo fundo externo levemente mais claro, enquanto abas e miolo da lista mantêm a cor geral atual.
- Confirmar que a aba ativa Todos/Frames/Trechos não tem borda inferior perceptível e parece conectada ao conteúdo abaixo, sem competir com Tempo/Preferências.
- Confirmar que sliders, textos, valores, seleção de frame/trecho, painéis de Tempo/Movimento/Trajetória, Preview, Export e JSON não regrediram.

# QA pendente — v8z4b29CC: reforço visual por bordas na Linha do tempo

> Base confirmada: `v8z4b29CB`. Esta versão é ajuste fino visual controlado: reforça a borda do bloco “Linha do tempo” e os traços das abas locais Todos/Frames/Trechos, sem clarear o fundo e sem alterar lógica, lista, sliders, Preview/export/JSON, Tremor, Movimento Inteligente, Trajetória ou Stage. Não promove para estável.

## Escopo v8z4b29CC

- Confirmar em iPhone/Safari real que o bloco “Linha do tempo” ficou mais evidente por borda/traço, sem perda de contraste interno.
- Confirmar em iPhone/Safari real que Todos/Frames/Trechos continuam como abas locais, com aba ativa mais nítida e conectada ao conteúdo abaixo, sem competir com Tempo/Preferências.
- Confirmar que a área útil da lista foi preservada e que não houve alteração funcional.

Checklist detalhado: executar os testes A, B e C do prompt de implementação.

# QA pendente — v8z4b29CB: ajustes visuais/UX de Linha do tempo, Trajetória e seleção de trecho

> Base confirmada: `v8z4b29CA`. Esta versão é uma correção visual/UX controlada: destaca a área Linha do tempo, transforma Todos/Frames/Trechos em abas locais, corrige espaçamento de Tremor, move Trajetória para painel próprio e sincroniza o destaque visual do Stage ao selecionar trechos. Não promove para estável e não altera Preview/export/JSON, Tremor, Duração, Pausa, Movimento Inteligente, easing, velocidade ou matemática da curva.

## Escopo v8z4b29CB

- Confirmar em iPhone/Safari real a área “Linha do tempo”, abas locais e ausência de empurrão excessivo da lista.
- Confirmar Preferências > Tremor com espaçamento normalizado e toggle funcional.
- Confirmar ordem texto + ícone/globo/toggle nos controles em linha, especialmente “Todos os trechos [globo]”.
- Confirmar item Trajetória no menu contextual de trecho com ícone `fold-vertical`, alinhado com Edição/Tempo/Movimento.
- Confirmar painel Trajetória próprio, sem Trajetória dentro de Movimento, com botões textuais de reset deste trecho/todos os trechos.
- Confirmar seleção/troca rápida de trechos sem alpha/dim residual e com frames conectados visualmente associados.

# QA pendente — v8z4b29CA: Trajetória/Linha reta e edição de curvas adjacentes

> Base confirmada: `v8z4b29BZ`. Esta versão é uma **correção de UX/interação**: reposiciona a ação geométrica de retificar curva para `Trajetória > Linha reta` e explicita o trecho adjacente editado pelos handles IN/OUT do frame selecionado. Não promove para estável e não altera Preview/export/JSON, Tremor, Pausa, Duração, Movimento Inteligente, easing ou matemática da curva.

## Escopo v8z4b29CA

- [ ] Confirmar em iPhone/Safari real que `Linha reta` aparece fora do bloco de Velocidade, na seção `Trajetória`.
- [ ] Confirmar que acionar `Linha reta` retifica apenas o trecho atual e não altera os cards de velocidade/easing.
- [ ] Confirmar que F2 selecionado em projeto F1→F2 permite editar F1→F2 mantendo F2 selecionado.
- [ ] Confirmar que frame intermediário permite editar curva anterior e curva seguinte sem conflito de toque.
- [ ] Confirmar que o último frame permite editar apenas a curva anterior.
- [ ] Confirmar ausência de regressão em Preview/export/JSON, Tremor, Pausa, Duração e Movimento Inteligente.

# QA pendente — v8z4b29BZ: ajustes visuais da Edição de Tempo e Movimento

> Base: v8z4b29BY. Esta versão é **ajuste visual/UX controlado**, sem mudança de lógica de cálculo, Tremor, Movimento Inteligente, Velocidade Constante, Pausa Global, Preview, export, JSON, launcher, upload, stage ou timeline.

## Escopo v8z4b29BZ

- Remove o bloco grande duplicado de duração no topo da aba Tempo e mantém o box de resumo.
- Separa "Velocidade constante" do resumo e mantém a legenda sempre visível com o texto: “Mantém o movimento em ritmo uniforme entre os frames.”
- Reposiciona filtros Todos / Frames / Trechos acima de "Cena 1" sem alterar a lógica dos filtros.
- Reduz o ícone de trecho em aproximadamente 30% e mantém a mesma família visual do ícone de frame.
- Padroniza botões grandes/equivalentes com fundo #5b5b5b, bordas finas e respiro melhor.
- Ajusta botões de acabamento, inputs numéricos, toggles/switches e hierarquia dos sub-itens de Tremor Global.
- Remove duplicidade textual de Tremor Global no painel contextual de Movimento.

Checklist detalhado: ver `docs/QA-v8z4b29BZ.md`.

# QA pendente — v8z4b29BY: limpeza visual conservadora da Edição de Tempo (filtros, botões grandes, números de frame/trecho, textos auxiliares e resumo)

> Base: v8z4b29BX. Esta versão é **limpeza visual conservadora**, sem redesign, sem novo design system, sem mudança de fluxo e sem alteração de lógica (Tremor inalterado). Não há mudança de motor, JSON, export, Stage, timeline ou lógica de duração/movimento inteligente/velocidade constante. Não aplica o CSS bruto copiado do Safari Inspector (sem Style Attribute inline, sem `line-height:0`, sem `border:3px`/`3.5px`, sem `font-size:18px` nas abas, sem mexer em `.lower-add-pill`).

## Escopo v8z4b29BY

- **tweak(ui): filtros Todos/Frames/Trechos mais legíveis** — `.cena1-filter` texto 11px → 14px, fundo levemente mais claro que o painel (novo token `--surface-filter`) e borda na mesma cor do fundo (discreta, 1.5px mantido); sem borda grossa, sem virar CTA nem aba solta; altura `--ctrl-lg-h` preservada.
- **tweak(ui): botões grandes de ação com borda discreta** — `.dur-subitem-action` mantém altura `--ctrl-lg-h` (≤ filtros), fundo destacado (`--surface-action`) e borda discreta (variação mínima do fundo, `--surface3` 1.5px) no lugar de `--border-action`; borda grossa do teste manual descartada.
- **tweak(ui): números de frame/trecho 12px e bloco único** — `.seq-icon-num`/`.seq-icon-seg-num` 11px → 12px; número do trecho aproximado do ícone (`gap` 2px → 1px + `margin-bottom:-4px`), sem `line-height:0`, sem sobrepor os círculos, sem trocar o desenho; valores de tempo à direita inalterados.
- **tweak(ui): textos auxiliares maiores** — `.prefs-note` 12px → 13px (LH 1.35), `#segTimingHint` 12px → 13px, labels/sublabels uppercase (`.dur-edit-label`/`.dur-subitem-label`/`.dur-sublabel`/`.dur-sublabel-value`) 11px → 12px mantendo subtítulo (não viram título).
- **tweak(ui): resumo de duração mais legível** — `.dur-summary-row` 12px → 13px, `.dur-summary-row-main` 13px → 14px, borda do box mantida discreta (1px).
- **preserve(ui)**: abas (`.ds-tab`) em 15px (sem 18px); botões pequenos contextuais e campo "Intervalo padrão" mantêm tokens da BX; `.lower-add-pill` intacto.
- **verify(frame/ui)**: Pausa global sem travamento e aplicando a todos os frames destravados (fix BW preservado); alinhamento slider/valor/Reset/Global preservado — sem alteração de lógica.
- Preserva Tremor (Global/Desligado/Personalizado, Global e por trecho), Movimento Inteligente, Velocidade Constante, Stage, timeline, curvas/Bézier, seleção, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher/Novo Projeto, logo, ícone iOS e o motor de renderização.

Checklist detalhado: ver `docs/QA-v8z4b29BY.md`.

---

# QA pendente — v8z4b29BX: auditoria visual + padronização de componentes (lista de frames/trechos, botões, campos, filtros e textos da Edição de Tempo)

> Base: v8z4b29BW. Esta versão é **auditoria visual + padronização de componentes**, sem redesign, sem mudança de fluxo e sem alteração de lógica (Tremor inalterado nesta versão). Não há mudança de motor, JSON, export, Stage, timeline ou lógica de duração/movimento inteligente/velocidade constante.

## Escopo v8z4b29BX

- **fix(ui): lista de frames/trechos padronizada** — números (frame/trecho) compartilham corpo/peso/cor (`--text2`, 11px); ícones (frame/trecho) compartilham cor base (`--text3`) e espessura de traço; coluna de identificação (`.dur-edit-icon-label`) com largura única (56px).
- **fix(ui): número + ícone de trecho como um único componente** — `.dur-edit-icon-label` em coluna central, `gap` 2px, `line-height:1`; ícone de trecho sem distorção (símbolo `#i-seq-segment` viewBox 24×24 → 32×16, círculos redondos; `.seq-icon-segment` 56×28px).
- **tweak(ui): ícone de trecho no filtro "Trechos" maior e reconhecível** — `.cena1-filter .seq-icon-segment` 28×18px → 34×17px (sem distorção), mesma família do ícone de "Frames"; altura do botão preservada.
- **tweak(ui): altura máxima oficial de botões grandes** — `--ctrl-lg-h: 40px` (referência = linha Todos/Frames/Trechos); `.dur-subitem-action` 48px → 40px e `.finish-chip` 46px → 40px.
- **tweak(ui): famílias visuais diferenciadas** — botões grandes de ação com borda 1.5px + `:active`; botões pequenos contextuais (`#custBarContent .chip`: -5%/+5%/Reset) com fundo/borda próprios (`--surface-action`/`--border-action`), menores e uniformes; campo "Intervalo padrão" com tokens de campo (`--surface-field`/`--border-field`); filtros/abas mantêm `--surface2`/`--border2`.
- **tweak(ui): textos explicativos maiores** — `.prefs-note` 10px → 12px (line-height 1.5); `#segTimingHint` 10px → 12px.
- **fix(ui): Reset + Global alinhados** — `#custGlobalLock` à direita (`align-self:flex-end`), no eixo do Reset.
- **verify(frame/ui)**: reconfirma Pausa global sem travamento (BW) e "Novo Projeto" sem quebra de linha no menu (BW) — sem alteração de lógica.
- Preserva Tremor (Global/Desligado/Personalizado, Global e por trecho), Movimento Inteligente, Velocidade Constante, Stage, timeline, curvas/Bézier, seleção, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS e o motor de renderização.

Checklist detalhado: ver `docs/QA-v8z4b29BX.md`.

---

# QA pendente — v8z4b29BW: corrige travamento da Pausa global, "Novo Projeto" no menu, ícones de trecho e padronização visual da Edição de Tempo

> Base: v8z4b29BV. Esta versão é uma **correção visual/UX + bug pontual de travamento do slider de Pausa quando "Aplicar a todos" está ativo**: não há mudança de motor, JSON, export, Stage, timeline ou lógica de duração/tremor/movimento inteligente/velocidade constante.

## Escopo v8z4b29BW

- **fix(frame): slider de Pausa não trava mais com "Aplicar a todos" ativo** — durante o drag (`input`), o valor é escrito direto em `framePauses[]` para todos os frames destravados, sem disparar `refreshPauseControls()`/`setFramePause()` `frameCount` vezes por tick; `refreshPauseControls()` roda UMA vez por evento. Ao soltar (`change`), aplica o valor final, marca o projeto como sujo, sincroniza `finishMode` e re-renderiza uma vez. Fluxos "global antes" e "global depois" continuam aplicando a todos os frames destravados.
- **fix(ui): "Novo Projeto" no menu superior aberto não quebra mais linha** — `fitMenuNewProjectLabel()` troca para "Novo" (`#menuNewProjectLabel`) se não couber em uma linha; fluxo do item (`requestNewProjectFlow()`) inalterado. Launcher (`fitNovoProjetoLabel()`) inalterado.
- **tweak(ui): ícone de trecho maior no filtro "Trechos"** — `.cena1-filter .seq-icon-segment` 20×20px → 28×18px, mais reconhecível, sem aumentar a altura do botão.
- **fix(ui): número + ícone de trecho como um único item visual** — `.dur-edit-icon-label` 64px → 56px, `gap` zerado entre `.seq-icon-seg-num`/`.seq-icon-segment`.
- **tweak(ui): padronização de botões/campos** — botões grandes de ação (`.dur-subitem-action`) com altura fixa de 48px e tons `--surface-action`/`--border-action`; botões pequenos contextuais (ex.: "Reset" da Pausa) em 30px com os mesmos tons; campo "Intervalo padrão" também recebe os tons de campo. Abas/filtros (`.ds-tab`, `.cena1-filter`, `.finish-chip`) continuam em `--surface2`/`--border2`.
- **tweak(ui): espaçamento entre grupos** — `.dur-section-header` `margin-top` 2px → 14px, separando Cena 1 / Trechos — Duração / Frames — Pausas / Acabamento; espaçamento interno de cada grupo inalterado.
- Preserva Tremor (Global e por trecho), Movimento Inteligente, Velocidade Constante, Stage, timeline, curvas/Bézier, seleção, painel Movimento fora dos ajustes citados, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS e o motor de renderização.

Checklist detalhado: ver `docs/QA-v8z4b29BW.md`.

---

# QA pendente — v8z4b29BV: corrige recuo da lista, ícone de trecho, hierarquia, densidade e bug de Pausa global

> Base: v8z4b29BU (aprovada — compacta Edição de Tempo, amplia ícone de trecho e padroniza toggles/ícones globais). Esta versão é uma **correção visual/UX + bug pontual de "Aplicar a todos" na Pausa de frame**: não há mudança de motor, JSON, export, Stage, timeline ou lógica de duração/tremor/movimento inteligente/velocidade constante.

## Escopo v8z4b29BV

- **Recuo lateral esquerdo da lista**: `.dur-edit-icon-label` 84px → 64px e `gap` 2px → 1px, liberando largura útil para os sliders sem mudar a estrutura da lista.
- **Ícone de trecho ~80% do tamanho da BU**: `.seq-icon-segment` 78×42px → 62×34px (ainda maior que o tamanho pré-BU de 39×21px); `.seq-icon-seg-num` 15px → 11px, mais próximo do ícone — número + ícone formam um único bloco visual.
- **Hierarquia dos números de frame/trecho**: `.seq-icon-num` (dentro do ícone de frame) 14px → 10px; `.seq-icon-seg-num` (acima do ícone de trecho) 15px → 11px — discretos, sem competir com `.dur-edit-value` (valor em segundos, inalterado).
- **Lista e blocos do painel Edição de Tempo mais compactos**: `.dur-edit-row` (padding 6px → 4px, gap 10px → 8px), `.dur-section-header`, `.dur-section-body`, `.dur-subitem`, `.dur-sublabel-row`, `.dur-subitem-action`, `.dur-summary-box`, `.dur-velocity-block` — todos reduzidos novamente. Valores, sliders e cálculos inalterados.
- **Painel "Tempo do trecho" (`#panelSegTime`) ainda mais compacto**: margens do handle/cabeçalho e padding do bloco Duração reduzidos — elimina o vazio inferior remanescente. Slider/valor de duração e `#segTimeGlobeLock` inalterados.
- **fix(frame): "Aplicar a todos" na Pausa de frame** — `_bindLocalFramePauseSliderOnce` agora consulta `isCustLocked()`/`custGlobalLock.framepause`; `toggleCustGlobalLock()` aplica o valor de pausa do frame ativo a todos os frames destravados ao ligar o global. Cobre os dois fluxos: global antes do ajuste e global depois do ajuste.
- **"Novo Projeto" → "Novo"**: botão do launcher ganha `white-space:nowrap`; `fitNovoProjetoLabel()` troca o texto para "Novo" se "Novo Projeto" não couber em uma linha. Fluxo do botão inalterado.
- Preserva painel Movimento (`#panelEase`) fora dos ajustes citados, Tremor (Global e por trecho), Movimento Inteligente, Velocidade Constante, Stage, timeline, curvas/Bézier, seleção, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS e o motor de renderização.

Checklist detalhado: ver `docs/QA-v8z4b29BV.md`.

---

# QA pendente — v8z4b29BU: compacta Edição de Tempo, amplia ícone de trecho e padroniza toggles/ícones globais

> Base: v8z4b29BT (aprovada — aumento de ícones de frame/trecho no painel Edição de Tempo). Esta versão é um **ajuste visual/UX e de padronização de componentes**: não há mudança de motor, JSON, export, Stage, timeline ou lógica de duração/tremor/movimento inteligente/velocidade constante.

## Escopo v8z4b29BU

- **Ícone de trecho ~2x maior**: `.seq-icon-segment` 39×21px → 78×42px e `.seq-icon-seg-num` 13px → 15px; coluna `.dur-edit-icon-label` 50px → 84px para acomodar o ícone maior sem encostar no slider. Número do trecho continua acima do ícone (segmento com dois círculos nas extremidades); ícone de frame inalterado (39px, número dentro).
- **Lista e blocos do painel Edição de Tempo mais compactos**: `.dur-edit-row` (padding 14px → 6px, gap 12px → 10px), `.dur-section-header` (padding 14px 0 10px → 10px 0 8px, margin 6px → 4px), `.dur-section-body` (6px → 4px), `.dur-subitem` (10px → 6px), `.dur-subitem-action` (margin/padding reduzidos, mantendo `min-height:44px`), `.dur-sublabel-row` (12px → 6px), `.dur-velocity-block` (14px → 8px) e `.dur-summary-box` (padding/gap/margem reduzidos). Valores, sliders e cálculos inalterados.
- **Painel "Tempo do trecho" (`#panelSegTime`) mais compacto**: handle e `.dur-header-row` com margens reduzidas, `.ease-channel-block` com padding menor — elimina o vazio inferior, segue a densidade dos painéis contextuais compactos. Slider/valor de duração e `#segTimeGlobeLock` inalterados.
- **Ordem universal de toggles/ícones globais**: título primeiro, controle depois — corrigido em Velocidade Constante (`#constSpeedToggle`), Movimento/Rotação/Escala Inteligente (`#movSmartToggle`/`#rotSmartToggle`/`#scaleSmartToggle` + `#easeGlobeLock`/`#easeGlobeRot`/`#easeGlobeScale`) e Tremor Global (`#tremorGlobalToggle`/`#tremorGlobalToggle2`). Handlers/ids/lógica inalterados.
- **Hierarquia tipográfica**: nova classe `.dur-item-title` (15px, peso 600, branco, sem uppercase/letter-spacing) aplicada a "Velocidade constante" (Edição de Tempo), "Movimento inteligente" e "Tremor" (painel Movimento do trecho) — itens principais, não mais com visual de cabeçalho de seção.
- **"Aplicar a todos" nos painéis de frame**: novo botão `#custGlobalLock` (ícone `i-globe-lock`) exposto no submenu de frame (Pausa/Rotação/Escala/Posição), reaproveitando `toggleCustGlobalLock()`/`custGlobalLock`/`isCustLocked()` já implementados em JS (sem função própria, apenas UI ausente até esta versão).
- Preserva painel Movimento (`#panelEase`) fora dos ajustes citados, Tremor (Global e por trecho), Movimento Inteligente, Velocidade Constante, Stage, timeline, curvas/Bézier, seleção, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS e o motor de renderização.

Checklist detalhado: ver `docs/QA-v8z4b29BU.md`.

---

# QA pendente — v8z4b29BT: aumenta ícones de frame/trecho no painel Edição de Tempo

> Base: v8z4b29BS (aprovada — reorganização do painel Edição de Tempo, ícones de frame/trecho na lista e nos filtros, painel contextual de Tempo do trecho compactado, resumo/Velocidade Constante ajustados). Esta versão é um **ajuste visual pontual**: não há mudança de motor, JSON, export, Stage, timeline ou lógica de duração/tremor.

## Escopo v8z4b29BT

- **Ícones de frame e trecho na lista de Edição de Tempo**: `.seq-icon-frame` e `.seq-icon-segment` (e seus números `.seq-icon-num`/`.seq-icon-seg-num`) aumentados em ~50% (26px → 39px / 26×14px → 39×21px), para melhorar a legibilidade em projetos com muitos frames (20, 30 ou mais) e com números de dois dígitos (10, 12, 24, 30, 31, 30–31).
- **Coluna dos ícones**: `.dur-edit-icon-label` ampliada (34px → 50px) para acomodar o ícone maior sem encostar no slider e sem empurrar o valor em segundos para fora da área visível.
- **Ícones dos filtros Frames/Trechos**: ajustados proporcionalmente (16px → 20px), sem alterar a altura dos botões nem confundir com as abas Tempo/Preferências.
- Preserva painel Edição de Tempo (estrutura/lógica), painel contextual de Tempo/Movimento do trecho, Tremor (Global e por trecho), Stage, timeline, curvas/Bézier, seleção, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS e o motor de renderização.

Checklist detalhado: ver `docs/QA-v8z4b29BT.md`.

---

# QA pendente — v8z4b29BS: padroniza painel Tempo do trecho, reorganiza Edição de Tempo e adiciona ícones de frame/trecho

> Base: v8z4b29BR (aprovada — cabeçalho fixo reduzido + separação Tempo/Movimento do trecho + Tremor Global recuperado no painel Movimento). Esta versão é uma **correção visual/UX**: não há mudança de motor, JSON, export, Stage, timeline ou lógica de duração/tremor.

## Escopo v8z4b29BS

- **Painel Tempo do trecho** (`#panelSegTime`): adota o mesmo padrão visual dos painéis compactos — `.dur-header-row` (handle + título "Seg. X-Y" + check na mesma linha) + bloco único "Duração" (slider/valor inalterados), sem área vazia.
- **Ajuste global de duração**: novo controle "Aplicar a todos os trechos" (`#segTimeGlobeLock`, ícone `i-globe-lock`) reaproveita `segGlobalMode`/`setSegEaseAll()`/`paintGlobe()` já existentes — afeta apenas `segDurations[]`/`loopDuration`, sincronizado com os ícones equivalentes do painel Movimento.
- **Painel Edição de Tempo**: abas Tempo/Preferências voltam a ser o primeiro elemento da área rolável (navegação principal). Resumo de duração (`#durationSummaryTop`) vive exclusivamente dentro da aba Tempo, agora em um contêiner destacado (`.dur-summary-box`/`.dur-summary-row-main`), seguido por Velocidade Constante, Cena 1 (filtro + lista) e blocos globais.
- **Velocidade Constante**: convertida de dois botões (Manual/Velocidade constante) para um toggle simples (`#constSpeedToggle`, padrão `.smart-toggle`). `setSegmentTimingMode`/lógica de cálculo inalterados; `syncTimingModeUI()` reescrito apenas para refletir o novo controle.
- **Ícones de frame/trecho**: lista de Cena 1 ganha ícone de frame com número dentro do ícone (`i-seq-frame`) e ícone de trecho com dois círculos + número do trecho (`i-seq-segment`). Mesmos ícones (reduzidos) aparecem nos filtros Frames/Trechos; "Todos" permanece sem ícone. Sliders, ids e sincronização de estado inalterados.
- Design system de abas (`.ds-tab-bar`/`.ds-tab`/`.ds-tab-active`) preservado (linha grossa ciano na ativa, linha fina nas inativas, sem pill/fundo novo).
- Preserva painel Movimento (`#panelEase`), Tremor (Global e por trecho), Stage, timeline, curvas/Bézier, seleção, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS, ícones Iconoir e o motor de renderização.

Checklist detalhado: ver `docs/QA-v8z4b29BS.md`.

---

# QA pendente — v8z4b29BR: reduz cabeçalho fixo, separa Tempo/Movimento do trecho e recupera Tremor Global

> Base: v8z4b29BQ (aprovada — cabeçalho fixo + design system de abas no painel Edição de Tempo). Esta versão é uma **correção visual/UX** dos painéis: não há mudança de motor, JSON, export, Stage, timeline ou lógica de duração/tremor.

## Escopo v8z4b29BR

- **Painel Edição de Tempo**: o cabeçalho fixo (`.dur-fixed-header`) volta a conter apenas handle + título "Edição de Tempo" + botão check (mesma linha). Resumo de duração, Velocidade Constante, abas Tempo/Preferências e todo o conteúdo (Cena 1, frames, trechos, blocos globais) passam a rolar juntos em `.dur-scroll-area`, ganhando mais área útil de scroll.
- **Painel contextual de trecho — Tempo** (`#panelSegTime`, novo): aberto pelo botão "Tempo" do menu contextual de trecho (`openSelectedSegmentMenu('time')`). Mostra apenas identificação do trecho (ex.: SEG. 2–3) + slider de duração + valor em segundos (`easePanelSegSlider`/`easePanelSegVal`, lógica inalterada).
- **Painel contextual de trecho — Movimento** (`#panelEase`): aberto pelo botão "Movimento" (`openSelectedSegmentMenu('movement')`). Mantém identificação do trecho, abas Velocidade/Rotação/Escala, Movimento Inteligente, curvas e Tremor — sem o bloco de Duração, que saiu para `#panelSegTime`.
- **Tremor Global recuperado no painel Movimento do trecho**: novo bloco "Tremor Global do projeto" com toggle + Intensidade + Frequência (ids com sufixo "2"), espelhando e sincronizado com o mesmo estado `projectShake` do bloco já existente em Preferências (`syncTremorPanel` agora sincroniza os dois conjuntos). O bloco "Tremor deste trecho" (Global/Desligado/Personalizado) permanece no painel Movimento.
- **Design system de abas** (`.ds-tab-bar`/`.ds-tab`/`.ds-tab-active`): aba ativa com linha grossa ciano (`box-shadow inset 0 -3px`), abas inativas com linha fina discreta em `var(--border2)` (`box-shadow inset 0 -1px`). Sem novo fundo/pill. Aplica-se automaticamente às abas Tempo/Preferências e Velocidade/Rotação/Escala (já usavam `.ds-tab`).
- Filtro Todos/Frames/Trechos (`.cena1-filter`) inalterado — continua com peso visual distinto das abas principais.
- Preserva Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção (simples/múltipla), Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS, ícones Iconoir, Tremor (Global e por trecho) e o motor de renderização.

Checklist detalhado: ver `docs/QA-v8z4b29BR.md`.

---

# QA pendente — v8z4b29BQ: cabeçalho fixo + design system de abas no painel Edição de Tempo

> Base: v8z4b29BP (aprovada — painel "Edição de Tempo" com abas Tempo e Preferências). Esta versão é uma **correção visual/UX** e de design system. Não há mudança de motor, JSON, export, Stage, timeline ou lógica de tremor.

## Escopo v8z4b29BQ

- **Cabeçalho fixo** (`.dur-fixed-header`): handle, título "Edição de Tempo" + botão de confirmar/fechar (mesma linha), resumo de duração, Velocidade Constante e abas Tempo/Preferências não rolam com a lista. Apenas `.dur-scroll-area` (abaixo das abas) tem rolagem — continua sendo a única superfície de scroll de `#panelDuration`.
- **Velocidade Constante** (`btnTimingManual`/`btnTimingConstant`) sai de Preferências e passa a viver na área fixa da aba Tempo, por ser um controle temporal. `setSegmentTimingMode`/`syncTimingModeUI` inalterados (id-based).
- **Design system de abas** (`.ds-tab-bar`/`.ds-tab`/`.ds-tab-active`): texto grande, aba ativa com maior contraste e sublinhado, abas inativas em cinza, divisória horizontal fina abaixo do conjunto. Substitui o visual de pills das abas Tempo/Preferências (`switchDurTab` agora alterna `ds-tab-active`).
- **Painel contextual de trechos** (Easing/Movimento): abas Velocidade/Rotação/Escala (`#panelEase`) migram do antigo `.ease-tabs-bar`/`.ease-tab` para o mesmo `.ds-tab-bar`/`.ds-tab` (`_syncEaseChannelUI` agora alterna `ds-tab-active`). `.ease-tab-content` vira um cartão independente abaixo das abas.
- **Aba Preferências** fica enxuta: nota informativa (Movimento Inteligente / Velocidade Constante) + Tremor Global do projeto + espaço reservado.
- **Filtro Todos / Frames / Trechos** (`.cena1-filter`) continua como filtro secundário, com peso visual distinto das abas principais.
- Preserva Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção (simples/múltipla), Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS, ícones Iconoir, Tremor (Global e por trecho) e o motor de renderização. Não implementa Cena 2, múltiplas imagens, transição entre cenas, rótulos coloridos, Variação do Tremor, Tremor em pausa nem mudança de export/JSON.

Checklist detalhado: ver `docs/QA-v8z4b29BQ.md`.

---

# QA pendente — v8z4b29BP: painel "Edição de Tempo" com abas Tempo e Preferências

> Base: v8z4b29BO (aprovada — Tremor Global do projeto + Frequência + modo por trecho). Esta versão é uma **reorganização visual/UX** do painel aberto pelo item "Edição" do menu inferior. Não há mudança de motor, JSON, export, multi-cena nem na lógica de cálculo de tempo — apenas a apresentação foi reorganizada.

## Escopo v8z4b29BP

- Renomeia o painel (antigo "Duração", aberto por `openPanel('Duration')`) para **Edição de Tempo**, preservando o botão de fechar/confirmar e o item "Edição" (ícone `director-chair`) no menu inferior.
- **Resumo fixo no topo**: Duração Total, Trechos, Pausas e Acabamento. Reaproveita os elementos `durSummaryTotal/Move/Pauses/Finish`, atualizados por `syncDurationUI()` a partir de `getDurationParts()` — nenhuma fórmula de cálculo foi alterada.
- **Abas Tempo / Preferências** (`switchDurTab`): a aba Tempo abre por padrão; trocar de aba não fecha o painel, não altera a seleção de frame/trecho e não toca no estado — apenas alterna a visibilidade e re-sincroniza os controles exibidos.
- **Aba Tempo**:
  - **Cena 1** (agrupamento visual preparatório — multi-cena NÃO é real): sequência intercalada `F1, 1–2, F2, 2–3, …` montada por `renderCena1Sequence()`, reaproveitando `buildFramePauseRow()` (pausas) e `buildSegDurationRow()` (durações de trecho). Os sliders escrevem nos mesmos estados `framePauses[]` / `segDurations[]` / `loopDuration` e usam o mesmo wiring de undo/preview de antes.
  - **Filtro** Todos / Frames / Trechos (`setCena1Filter`): radio simples via classe no container (`flt-all|frames|segs`), sem estado ambíguo (nunca tudo desligado).
  - **Controles globais** permanecem na aba Tempo: Trechos – Duração (Intervalo padrão, Total, Igualar intervalos), Frames – Pausas (Tudo, Zerar pausas) e Acabamento (Nenhum/Loop/Pausa final + tempos).
- **Aba Preferências**:
  - **Movimento — Distribuição do tempo**: botões Manual / Velocidade constante (`btnTimingManual`/`btnTimingConstant`) movidos para cá (lógica `setSegmentTimingMode`/`syncTimingModeUI` inalterada, id-based).
  - **Tremor Global do projeto**: bloco (toggle + Intensidade + Frequência) reposicionado de `panelEase` para a aba Preferências. O motor do Tremor, o JSON e o Tremor **por trecho** (que continua em `panelEase`) NÃO foram alterados; toda a sincronização (`syncTremorPanel`/`_initTremorListeners`) é id-based e segue funcionando.
  - Espaço reservado para preferências futuras. **Movimento Inteligente** permanece no painel de Movimento de cada trecho (posição contextual mais limpa).
- Preserva Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção (simples/múltipla), Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS, ícones Iconoir e o motor de renderização. Não implementa Cena 2, múltiplas imagens, transição entre cenas, rótulos coloridos, Variação do Tremor nem Tremor em pausa.

Checklist detalhado: ver `docs/QA-v8z4b29BP.md`.

---

# QA pendente — v8z4b29BO: Tremor Global do projeto + Frequência + modo por trecho

> Base: v8z4b29BN (aprovada — efeito experimental de Tremor/handheld por trecho). Esta versão evolui apenas a camada procedural de Tremor criada na BN, sem refatorar o motor: separa Intensidade (amplitude) de Frequência (velocidade/quantidade de tremidas), adiciona um Tremor Global no nível do projeto e permite que cada trecho use Global, fique Desligado ou tenha configuração Personalizada. Preview e MP4 continuam determinísticos.

## Escopo v8z4b29BO

- Adiciona `projectShake = { enabled:false, intensity:0.4, frequency:1.0 }` (Tremor Global do projeto). Por padrão desligado; projetos antigos sem o campo abrem com Global desligado (mesmo visual de antes).
- Evolui `segTremorSettings[i]` para `{ mode:'global'|'off'|'custom', intensity, frequency }`. Migração segura do JSON da v8z4b29BN (`{enabled,intensity}`): `enabled:true` → `custom`; `enabled` false/ausente → `global` (Global desligado por padrão preserva o visual). Novos trechos nascem em `global`.
- Adiciona Frequência (0.5–8.0) ao motor: a frequência multiplica a velocidade angular das senoides do ruído (sem `Math.random`), mantendo movimento suave/orgânico e 100% determinístico — Preview = MP4, repetir Preview não muda o efeito. Intensidade continua controlando a amplitude (≤2% do quadro / ≤0,5° de rotação no máximo).
- `resolveSegTremor(cfg)` é a fonte única de verdade: combina o modo do trecho com o Global e devolve `{active,intensity,frequency}`. O motor (`applySegTremorLayer`) e a UI usam o mesmo resolvedor.
- UI no painel de Edição/Movimento (`panelEase`), seção "Tremor": (1) toggle "Tremor Global" + sliders Intensidade e Frequência (Lenta ←→ Rápida); (2) por trecho, chips de modo Global/Desligado/Personalizado; no modo Global mostra nota de herança e oculta sliders locais; no modo Personalizado mostra Intensidade e Frequência próprias; Desligado não treme.
- Persistência: `projectShake` e `segTremorSettings` (com `mode/intensity/frequency`) salvos/lidos no JSON, incluídos em undo/redo e resets de novo projeto. JSON antigo e JSON da BN abrem sem erro.
- Não redesenha página inicial, Edição, templates nem o fluxo Novo Projeto; mantém nome "Edição", ícone director-chair, demais ícones, Stage, timeline, curvas, Preview e export. Sem zoom automático global novo.

Checklist detalhado: ver `docs/QA-v8z4b29BO.md`.

---

# QA pendente — v8z4b29BN: efeito experimental de Tremor (câmera na mão) por trecho

> Base: v8z4b29BM (aprovada — logo no launcher, apple-touch-icon e "Tempo" → "Edição"). Esta versão adiciona uma função experimental de motor: um efeito opcional de tremida/manual por TRECHO, aplicado como camada procedural sobre o movimento já calculado, sem criar frames e sem alterar frames/curvas/timeline. Escopo pequeno, isolado e reversível (desligar o Tremor reproduz exatamente o comportamento anterior).

## Escopo v8z4b29BN

- Adiciona `segTremorSettings[]` (array paralelo por trecho, espelhando `segBlurSettings`), com `{ enabled:false, intensity:0.4 }` por padrão. Projetos antigos sem o campo abrem com Tremor desligado.
- Motor: `getStateAtT(t)` passa a ser uma fina camada que aplica o Tremor sobre o estado base (renomeado para `getStateAtTBase(t)`, que mantém o motor original intacto). O Tremor perturba só `cx`/`cy` (deslocamento) e `rot` (rotação leve); escala não é tocada.
- O efeito é determinístico: oscilação por soma de senoides incomensuráveis em função do tempo absoluto (sem `Math.random`), com envelope de extremidade (fade-in/out por trecho) que zera o offset nos keyposes — frames reais permanecem exatos e não há salto entre trechos. Preview e MP4 usam a mesma função, casando visualmente.
- Limites internos de segurança: deslocamento ≤ 2% do tamanho do quadro e rotação ≤ 0,5° na intensidade máxima; envelope evita revelar bordas nos pontos de quadro.
- UI: no painel de Edição/Movimento do trecho (`panelEase`), adiciona a seção "Tremor" com toggle e slider "Intensidade" (0–100%), que só aparece quando o Tremor está ligado. Atua sobre o trecho selecionado (`_activeEaseSeg`), nunca sobre o projeto inteiro ou frame individual.
- Persistência: `segTremorSettings` é salvo/lido no JSON, incluído em undo/redo (captureState/restoreState/clone), reset e templates. Carregar JSON antigo continua funcionando (Tremor desligado por ausência do campo).
- Preserva motor, frames, posição/curvas/timeline, launcher, fluxo Novo Projeto/Abrir Projeto, Preview básico, export MP4 (exceto inclusão do efeito quando ativo), templates, ícones e seleção múltipla.

Checklist detalhado: ver `docs/QA-v8z4b29BN.md`.

---

# QA pendente — v8z4b29BM: logo no launcher, apple-touch-icon e renomeação "Tempo" → "Edição"

> Base: v8z4b29BL (aprovada — sincronização do frame ativo entre Stage/timeline/label/controles). Esta versão faz três ajustes pontuais: insere o logotipo do Arco Motion no launcher, configura o ícone do app para iOS via `apple-touch-icon.png` local, e renomeia o item "Tempo" (ícone `director-chair`) para "Edição", sem alterar função.

## Escopo v8z4b29BM

- Adiciona `<img class="launcher-logo" src="assets/brand/arco-logo-white.svg">` na tela `#startLauncher`, centralizado e acima dos botões "Novo Projeto"/"Abrir Projeto"/"Recarregar", com CSS mínimo (`.launcher-logo`).
- Atualiza o `<head>` para usar `assets/icons/apple-touch-icon.png` como `apple-touch-icon` local (substitui o ícone embutido em base64) e ajusta `apple-mobile-web-app-title` para "Arco Motion".
- Renomeia o rótulo visível do botão de Duração geral (4ª linha do menu inferior, ícone `i-director-chair`) de "Tempo" para "Edição", preservando `onclick="openPanel('Duration')"` e o painel de Duração.
- Preserva Stage, timeline, frame ativo, sincronização frame ativo/timeline, launcher (exceto logo), fluxo Novo Projeto/Abrir Projeto, Preview/export, JSON, templates e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BM.md`.

---

# QA pendente — v8z4b29BL: sincronização do frame ativo (Stage/timeline/label/controles)

> Base: v8z4b29BK (aprovada — ícones Iconoir cinema-old e director-chair). Esta versão corrige a divergência visual entre o frame ativo no Stage, o frame destacado na faixa/timeline, o label inferior e os controles de edição.

## Escopo v8z4b29BL

- Unifica a fonte de verdade do frame ativo: `getTimelineStageFocusIndex()` passa a refletir sempre `activeIdx`, eliminando o estado paralelo de "foco" da timeline que podia divergir do frame ativo oficial.
- Ao tocar em um frame na faixa/timeline, ele vira o frame ativo oficial e o Stage, o label inferior e os controles passam a refletir esse mesmo frame imediatamente.
- Ao tocar/selecionar um frame no Stage (incluindo abas de rotação/escala/handles), o mesmo frame passa a ser destacado na timeline e no label inferior.
- Ao centralizar um frame na timeline por scroll/scrub, esse frame também passa a ser o frame ativo oficial (Stage, label e controles seguem).
- Remove o destaque "fantasma" (pill laranja "selecionado" simultâneo ao pill "ativo" ciano) ao trocar de frame ativo.
- Preserva seleção múltipla, edição de trecho (label "Trecho X–Y" e botões contextuais), Preview, ícones Iconoir (cinema-old, director-chair), Stage, timeline, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BL.md`.

---

# QA pendente — v8z4b29BK: ícones Iconoir cinema-old e director-chair

> Base: v8z4b29BJ (aprovada — ajustes finos de UI/UX e ícones de Arquivos/Tempo já trocados, mas com formas próprias). Esta versão substitui apenas esses dois ícones pelos ícones individuais do Iconoir, sem regressões.

## Escopo v8z4b29BK

- Substitui o ícone do botão "Arquivos" no menu superior pelo ícone Iconoir `cinema-old` (símbolo `i-cinema-old`), inline, com `currentColor`, mesmo tamanho/área de toque/estado ativo dos demais ícones do topo.
- Substitui o ícone do item "Tempo/Duração" na 4ª linha do menu inferior pelo ícone Iconoir `director-chair` (símbolo `i-director-chair`, conteúdo atualizado para o SVG do Iconoir), inline, com `currentColor`, mesmo tamanho/alinhamento/área de toque/estado ativo dos demais ícones da linha.
- Não importa a biblioteca Iconoir nem usa CDN; apenas os dois SVGs individuais foram copiados e adaptados inline.
- Preserva launcher → Novo Projeto → editor, Stage, timeline, templates, Preview/export, JSON, motor e todos os demais ícones.

Checklist detalhado: ver `docs/QA-v8z4b29BK.md`.

---

# QA pendente — v8z4b29BJ: ajustes finos de UI/UX e ícones

> Base: v8z4b29BI (aprovada — launcher separado do Stage, fluxo de Novo Projeto mais direto, bloqueio da interface durante confirmação/cancelamento de frame e criação funcional de projeto).

## Escopo v8z4b29BJ

- Reposiciona o aviso "Confirme ou cancele o frame atual." para uma área mais segura do Stage, sem sobrepor o pill de zoom nem colidir com o topo.
- Tocar em qualquer ação do menu superior (Voltar, Arquivos, Visualizar, Preview, Undo/Redo) fecha o painel de Duração/Tempo, se estiver aberto, antes de executar a ação.
- Alinha à esquerda os ícones contextuais de trecho (Tempo, Movimento) na 4ª linha do menu inferior, com o mesmo ritmo/compacidade dos ícones contextuais de frame.
- Aumenta levemente (≈2px) a largura visual de frames e trechos na faixa/timeline, sem alterar snap, posição das bolinhas, altura da timeline ou lógica de seleção.
- Troca o ícone de Arquivos no menu superior (claquete → rolo de filme), preservando função, tamanho, alinhamento e área de toque.
- Troca o ícone de Tempo/Duração na 4ª linha do menu inferior (relógio → cadeira de diretor), preservando função, tamanho, alinhamento e área de toque.
- Preserva launcher → Novo Projeto → editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BJ.md`.

---

# QA pendente — v8z4b29BI: remove etapa "Imagem" do Novo Projeto e bloqueia UI durante criação de frame

> Base: v8z4b29BH (não aprovada — duas pendências de fluxo/UX: etapa "Imagem" extra no Novo Projeto, e menus abrindo durante a criação/inserção de frame).

## Escopo v8z4b29BI

- Remove a etapa/página intermediária "Imagem" do fluxo Novo Projeto. O botão "Escolher imagem" passa a aparecer diretamente no painel Novo Projeto, depois de Formato e Template; tocar nele abre o seletor nativo do iOS/Safari sem trocar de tela.
- Ao escolher uma imagem válida, o painel Novo Projeto fecha, o projeto é criado (formato, template/Sem template → F1, frames, Stage, timeline, contador) e o editor/Stage abre.
- Durante criação/inserção de frame (estado "Confirme ou cancele o frame atual."), bloqueia toda a interface: menu superior, Arquivos/settings, painéis de Formato/Template/Imagem, Novo Projeto, Abrir Projeto, Salvar, Recarregar, Reset, Preview/Play, timeline, menu inferior e painéis de Tempo/Pausa/Rotação/Escala/Mover. Permite apenas Confirmar ou Cancelar o frame.
- Tocar em qualquer controle bloqueado mostra a mensagem "Confirme ou cancele o frame atual." sem abrir painel ou navegar.
- Confirmar ou cancelar o frame libera novamente toda a interface.
- Preserva launcher independente, separação launcher/Novo Projeto/editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BI.md`.

---

# QA pendente — v8z4b29BH: ajustes de UX sobre launcher/Novo Projeto/editor

> Base: v8z4b29BG (aprovada — separou launcher, Novo Projeto e editor/Stage em estados explícitos; fluxo Novo Projeto funcionou).

## Escopo v8z4b29BH

- Etapa Imagem do Novo Projeto mostra apenas o botão "Escolher imagem", removendo a duplicidade com o menu nativo de Fototeca/Tirar Foto/Escolher Arquivo do iOS/Safari.
- Launcher ganha ação discreta "Recarregar" abaixo de "Abrir Projeto", que recarrega o app e mantém o usuário no launcher.
- Botão X/fechar do Stage fecha o projeto atual e volta ao launcher; mostra aviso "Fechar projeto" (Cancelar/Fechar) quando há projeto aberto.
- Preserva separação launcher → Novo Projeto → editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BH.md`.

---

# QA pendente — v8z4b29BG: separa launcher, Novo Projeto e editor/Stage em estados explícitos

> Base: v8z4b29BF (não aprovada — entrada inicial e fluxo de Novo Projeto continuavam presos ao Stage).

## Escopo v8z4b29BG

- Introduz estado explícito de tela (`launcher` / `newProject` / `editor`); Stage/timeline/toolbar só existem em modo `editor`.
- Recarregar o app sempre volta ao launcher; nunca restaura Stage, projeto, imagem ou frames anteriores.
- Etapa final de imagem do Novo Projeto vira tela própria do fluxo (Fototeca/Tirar Foto/Escolher Arquivo), visível mesmo com o seletor nativo aberto — cancelar nunca expõe o Stage.
- Cancelar o Novo Projeto nunca deixa o app em Stage vazio: volta ao launcher (origem launcher) ou restaura o editor intacto (origem editor, projeto ainda válido).
- Preserva editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BG.md`.

---

# QA pendente — v8z4b29BF: launcher simples Novo Projeto / Abrir Projeto

> Base: v8z4b29BE (não aprovada — fluxo Novo Projeto: Formato → Template → Imagem → Criar).

## Escopo v8z4b29BF

- Substitui a tela inicial antiga "Imagem / Projeto" (entrada principal sem projeto carregado) por uma entrada simples com duas opções: "Novo Projeto" e "Abrir Projeto".
- "Novo Projeto" na entrada inicial abre o fluxo já existente Formato → Template → Imagem → Criar.
- "Abrir Projeto" na entrada inicial abre o seletor de JSON/projeto salvo, preservando o fluxo atual de abrir JSON.
- No editor, o menu superior mantém "Novo Projeto" e "Abrir"; ao tocar em qualquer um deles com um projeto aberto, exibe aviso de possível perda (Cancelar/Continuar) antes de prosseguir.
- Não cria Home completa, comunidade, recentes, perfil, conta, galeria, dashboard ou onboarding novo.

Checklist detalhado: ver `docs/QA-v8z4b29BF.md`.

---

# QA pendente — v8z4b29BE bugfix: sincronização final do Novo Projeto com template

> Base: v8z4b29BD (não aprovada — fluxo Novo Projeto: Formato → Template → Imagem → Criar).

## Escopo v8z4b29BE

- Corrige `applyTemplate()` (Pan, Zoom in/out, Pan ↓, Rotação, Círculo): referência a um elemento `#tbTemplate` inexistente lançava `TypeError` e interrompia a função antes de `renderAll()`/`finalizeTemplateApply()`.
- Resultado da correção: Novo Projeto com qualquer template nasce com frames, contador, timeline, Stage, frame ativo e curvas sincronizados imediatamente — sem precisar adicionar outro frame.
- Reset Project após Novo Projeto com template volta corretamente ao estado inicial desse novo projeto.
- Não altera fluxo visual do painel Novo Projeto, ordem Formato → Template → Imagem, layout aprovado, motor, Preview/export, JSON ou curvas.

Checklist detalhado: ver `docs/QA-v8z4b29BE.md`.

---

# QA pendente — v8z4b29BD Novo Projeto: Formato → Template → Imagem → Criar

> Base preservada: v8z4b29BC (ajustes finos do frame ativo + menu superior, "Novo Projeto" simples imagem→criar).

## Escopo v8z4b29BD

- Evolui "Novo Projeto" para um fluxo interno de pré-configuração: Formato → Template → Imagem → Criar, sem reintroduzir Home/página inicial/comunidade/recentes/perfil.
- Painel interno permite escolher Formato (chips existentes) e Template (incluindo "Sem template") em estado temporário, sem afetar o projeto atual.
- "Escolher imagem e criar" abre o seletor de imagem (JPG/PNG/WebP); o projeto atual só é substituído após a imagem carregar com sucesso.
- Novo projeto não herda frames/curvas/pausas/durações/seleção/vínculo com JSON do projeto anterior; aplica formato e template escolhidos imediatamente (F1 ativo se "Sem template", ou frames do template).
- Reset Project após Novo Projeto volta ao estado inicial desse novo projeto (imagem + formato + template), nunca ao JSON/projeto anterior.
- Preserva: frame ativo/HUD/abas/cruz central/clamp (v8z4b29BC), timeline/menu inferior, curvas/Bézier, Preview/export/MP4, JSON, motor.

Checklist detalhado: ver `docs/QA-v8z4b29BD.md`.

---

# QA pendente — v8z4b29BC ajustes finos do frame ativo + menu superior

> Base preservada: v8z4b29BB (remoção do pill do frameHud).

## Escopo v8z4b29BC

- Aproximar e realinhar a faixa superior (frameHud) do frame ativo em relação à moldura e às abas superiores.
- Reduzir o padding interno da faixa superior, preservando o espaçamento entre pausa/rotação/escala.
- Diminuir o tamanho visual das 4 abas/pontos circulares do frame ativo, preservando o centro e a área de toque.
- Tornar a cruz central do frame ativo escalável com o tamanho do frame (clamp suave).
- Reorganizar o menu superior em 4 colunas.
- Renomear "Novo arquivo" para "Novo Projeto" e mover para a linha final de arquivos (Salvar, Novo Projeto, Abrir, Recarregar).
- Preservar: motor, timeline/menu inferior, Preview/export/MP4, JSON, curvas/Bézier, clamp de criação de frames, Novo Projeto guiado/Home, lógica dos handles/abas.

## QA manual pendente v8z4b29BC

1. Versão visível mostra `v8z4b29BC`.
2. A faixa superior (frameHud) do frame ativo está visivelmente mais próxima da borda superior da moldura.
3. A faixa superior está melhor alinhada horizontalmente com os 2 pontos/abas superiores.
4. O padding da faixa superior está mais enxuto, mas pausa/rotação/escala continuam legíveis e com espaçamento claro entre si.
5. As 4 abas/pontos circulares estão visivelmente menores.
6. O centro de cada aba/ponto permanece exatamente na mesma posição de antes (sem deslocamento).
7. A área de toque das abas continua confortável no iPhone (mínimo 44px).
8. A cruz central aumenta/diminui ao escalar o frame (aumentar e diminuir o frame ativo via abas).
9. A cruz permanece centralizada e não interativa.
10. O menu superior (overlay de ajustes/arquivos) exibe os itens em 4 colunas.
11. O item "Novo arquivo" não existe mais; em seu lugar há "Novo Projeto".
12. "Novo Projeto" aparece na última linha de arquivos, na 2ª posição, logo após "Salvar".
13. A ordem da última linha de arquivos é: Salvar, Novo Projeto, Abrir, Recarregar.
14. Tocar em "Novo Projeto" abre o fluxo já existente de criação de novo projeto a partir de imagem, sem duplicidade.
15. Rotação do frame continua funcionando normalmente.
16. Escala do frame continua funcionando normalmente.
17. Arrastar aba inicia scale/rotate corretamente.
18. Arrastar o corpo do frame move normalmente.
19. Timeline/menu inferior não muda.
20. Preview/export/MP4 continuam funcionando.
21. JSON abre/salva normalmente.
22. Funciona no iPhone/Safari.

---

# QA pendente — v8z4b29BB microcorreção visual frame ativo

> Base preservada: v8z4b29BA (espaçamento HUD + redução visual das abas circulares).

## Escopo v8z4b29BB

- Remover aspecto de pill arredondado do fundo do texto superior (frameHud) do frame ativo.
- Remover pill separado de ângulo (.angle-indicator), mantendo o ângulo visível apenas no frameHud.
- Preservar: comportamento e conteúdo do frameHud, abas circulares, timeline/menu inferior, curvas, Preview/export, JSON, motor.

## Diagnóstico e implementação

1. `#frameHud` CSS: `border-radius:10px` → `border-radius:2px` — elimina o aspecto de cápsula/pill, mantém cantos levemente arredondados de forma discreta.
2. `.angle-indicator.show` CSS: `display:block` → `display:none` — pill separado de ângulo permanece oculto mesmo quando JS adiciona a classe `.show`; não há alteração em JS.
3. Nenhuma alteração em lógica de rotação, escala, motor, timeline ou fluxo de arquivos.

## QA manual pendente v8z4b29BB

1. Versão visível mostra `v8z4b29BB`.
2. Texto superior do frame ativo (frameHud) continua aparecendo com pausa, rotação e escala.
3. O fundo do frameHud não tem mais formato de pill/cápsula arredondado.
4. O pill separado de ângulo (.angle-indicator) não aparece durante rotação.
5. O valor de ângulo continua visível no frameHud durante e após rotação.
6. Rotação do frame continua funcionando normalmente.
7. Escala do frame continua funcionando normalmente.
8. Arrastar aba inicia scale/rotate corretamente.
9. Arrastar o corpo do frame move normalmente.
10. As 4 abas circulares permanecem visualmente inalteradas.
11. Timeline/menu inferior não muda.
12. Preview/export/MP4 continuam funcionando.
13. JSON abre/salva normalmente.
14. Funciona no iPhone/Safari.

---
