# v8z4b32E8F — fix(preview): confirma o primeiro frame antes do relógio

- O preflight do Preview agora retorna resultado estruturado e só confirma o warm-up após o renderer canônico desenhar `t=0` sem erro e dois ciclos posteriores de `requestAnimationFrame` ocorrerem.
- Loading, relógio limitado e agendamento do loop permanecem bloqueados até essa confirmação; falha ou cancelamento por token libera nova tentativa sem estado híbrido.
- Diagnósticos registram tentativa, render, composição, ordem do commit/relógio, cancelamento e erro sem expor texto técnico na interface principal.
- Export, WebCodecs, sampler, câmera, matemática do renderer, Session Autosave/Restore e interface permanecem inalterados.
- Aprovação visual permanece pendente de merge/publicação e teste de Roberto em iPhone/Safari real.

# v8z4b32E8D — feat(layers): cria nomes sequenciais persistentes para camadas

- Cada image asset recebe uma identidade nominal canônica com `layerSequence`, `layerName`, `layerNameSource` e `originalFileName` no momento da criação ou migração.
- O projeto persiste `nextLayerSequence`; exclusão não faz o contador recuar e reorder altera somente ordem/`zIndex`.
- O painel Layers e a faixa contextual exibem `Camada N` a partir do asset, sem derivar o número da posição atual.
- Save/Load e Undo/Redo preservam a identidade; projetos antigos são migrados de forma determinística pela ordem canônica salva.
- Guardrail dedicado cobre persistência na origem, estabilidade após reorder e não reutilização após exclusão.
- Validação visual final permanece pendente de publicação e teste em iPhone/Safari real.

# v8z4b32E8C — fix(render): recupera readiness da render session

- Preview e Export passam a preparar cada asset visível pela mesma rotina compartilhada e pela precedência `stableDrawable` válido → fonte viva → fonte persistente reidratada.
- Um `stableDrawable` com dimensões, pixels e versão compatíveis é suficiente mesmo quando a fonte DOM viva perdeu `complete`, dimensões naturais ou decode no Safari.
- Ausência/invalidez do drawable dispara uma tentativa controlada de reidratação (timeout de 6 s) e reconstrução antes de falha definitiva; nenhum asset visível é omitido e snapshots parciais são descartados.
- Falhas liberam locks, loading e controles para permitir retry sem reload; diagnósticos observam fonte final, recovery, inclusão e contagem por frame do asset `img-1781622678250-715`.
- Guardrail dedicado cobre fixture de 9 assets, precedência estável, recovery persistente, falha irrecuperável/retry e reprovação de 8/9.
- Aprovação visual permanece pendente de publicação e validação no projeto real em iPhone/Safari.

# v8z4b32E8B — fix(assets): sincroniza seleção canônica entre Stage, Layers e contexto

- `selectedAssetId` passa a ser a única identidade canônica; `selectAssetById()` valida o ID real e mantém `selectedImageAssetId` somente como alias legado derivado.
- Stage, linhas de Layers, faixa contextual, toolbar, contorno e ações de reorder passam a resolver e expor o mesmo `asset.id` real.
- Layers usa `data-asset-id`, preserva o ID após reconstrução/reorder e rola a linha selecionada para a área visível ao abrir o painel.
- Diagnósticos observacionais comparam IDs reais do modelo e do DOM e registram preservação da seleção após reorder.
- Adicionado guardrail com fixture de múltiplos assets e reorder; nomenclatura “Imagem N” permanece inalterada.
- Validação visual final permanece pendente após merge/publicação na `main` de teste, em iPhone/Safari real por Roberto.

# v8z4b32E8A — fix(ui): remove pills informativos redundantes dos Frames no Stage

- `index.html`: remove na origem o `#frameHud`, sua criação DOM, estilos, atualização e posicionamento junto ao Frame no Stage; não há elemento oculto ou componente substituto.
- `index.html`: preserva a faixa contextual real `#lowerActiveLabel` acima da timeline, além de número, contorno, quatro alças, curvas, scrim e seleção dos Frames.
- `index.html`: substitui diagnósticos antigos do HUD por observações do DOM real para ausência/contagem/visibilidade do pill no Stage e presença da faixa contextual, número e alças preservados.
- `scripts/qa/check-frame-stage-info-pills.mjs`: adiciona guardrail estático/DOM contra recriação do HUD e contra remoção dos elementos funcionais preservados.
- `index.html`: `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E8A`.
- Validação visual final permanece pendente após merge/publicação na `main` de teste, em iPhone/Safari real por Roberto.

# v8z4b32E7Z — fix(assets): conclui paridade das alças com Frames e registra regras de revisão

- `index.html`: remove os controles antigos `.asset-scale-handle` e `.asset-rotate-handle` do Ativo selecionado e mantém exatamente quatro `.asset-corner-handle` roxas, interativas, com área de toque de 44px e offset externo de 12px em relação à moldura.
- `beginAssetTransformDrag()`, `handleAssetTransformPointerMove()` e `endAssetTransformPointer()` passam a usar o gesto de canto com decisão entre escala e rotação por predominância de distância/ângulo, espelhando o modelo aprovado dos handles de Frames no contexto de Ativos.
- Diagnósticos de Ativos passam a observar contagem real de controles, presença de handles legados, interatividade, offset externo, modo de gesto e duplicação de controles, sem flags de sucesso baseadas apenas em independência visual.
- Project OS: cria `docs/DECISIONS.md`, cria/atualiza `docs/APPROVAL_WORKFLOW.md` e registra as regras de revisão/liberação, fonte de verdade e ocorrência da v8z4b32E7Y em `docs/DEFINITION_OF_DONE.md`, `docs/REGRESSIONS.md`, `docs/PROJECT_STATE.md` e `AGENTS.md`.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E7Z`.


## v8z4b32E7Z — ajuste pós-revisão da PR #450

- `index.html`: o algoritmo de intenção dos handles de canto foi extraído para `resolveCornerTransformMode()` e usado tanto pelo sistema aprovado dos Frames quanto pelos Ativos, sem alterar o comportamento visual dos Frames.
- `index.html`: diagnósticos declaratórios de paridade/rotação/zoom/frame intacto foram removidos; a posição externa das abas de Ativos agora é verificada por `getBoundingClientRect()` contra a moldura, com tolerância subpixel de 0,75px.
- `docs/APPROVAL_WORKFLOW.md`: esclarece que o teste publicado em iPhone/Safari real ocorre depois do merge aprovado na `main` do repositório de teste, não antes da decisão de merge da PR.

## v8z4b32E7Y

**Correção visual de abas de seleção dos Ativos.** Base: `7de1302993ffe33ed9b20c4ebd97503a6e5ed0c3`.

- `renderAssetSelectionOverlay()` mantém a moldura roxa atual e adiciona quatro `.asset-corner-handle` próprios dos Ativos, um em cada canto, com geometria baseada em `getAssetVisualWorldRect(asset)` via a própria moldura.
- As novas abas usam identidade roxa, são `pointer-events:none` e não reutilizam `cornerHandleEls`, `handleDragState`, `ensureCornerHandles()` nem o estado funcional dos Frames.
- Diagnóstico passivo registra existência, contagem, visibilidade, asset selecionado, uso da geometria de asset, identidade roxa, pointer-events desabilitado, independência dos handles de Frame e preservação visual dos Frames.
- Preservados Frames, handles de Frame, motores, transformações, gestos, hit-test, renderer, Preview, Export, Save/Load, Layers, Undo/Redo, ProjectWorld, timeline, menus, textos, ícones e a pendência da terceira linha de informações.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E7Y`.

## v8z4b32E7H

**Correção cirúrgica de diagnósticos legados ProjectWorld/replace.** Base: `v8z4b32E7G`.

- `computeWorldCoordinateAudit()` deixa de comparar `asset0.worldW/H` com `projectWorld.baseStageW/H`; agora valida coordenadas ProjectWorld finitas/positivas e mantém a checagem de escala única do `projectWorld`/render.
- Diagnóstico de replace adiciona `replacePreservedCenterAndRecomputedSize`, permitindo `replacePreservedWorldRect=false` quando a imagem muda de proporção, desde que centro, aspect ratio novo, zIndex, slot e visibilidade estejam preservados.
- Preservados layout, menus, fluxo, curva/handles E7G, Preview/Export, WebCodecs, `getStateAtT`, `drawAtT`, assets e render visual.
- `index.html`: `APP_VERSION` e `APP_VERSION_NAME` permanecem em `v8z4b32E7H`.

## v8z4b32E7G

**Engine Sprint — geometria canônica dos controles editáveis de curva.** Base: `v8z4b32E7F`.

- `getFrameHandleGeometryForTarget()` agora posiciona losangos/ghost handles em screen coords a partir de `getFrameScreenGeometry(frameIndex).center` e transforma os handles persistidos em ProjectWorld com a mesma matriz usada pelo path da curva.
- `getFrameHandleGeometry()` passa a usar o centro canônico do frame como origem visual das linhas pontilhadas/sólidas dos handles.
- `applyFrameConnectedHandleEdit()` e o fallback legado de tangent drag convertem pointer stage/screen para ProjectWorld antes de salvar `curvesV2.frameHandles`, evitando armazenamento em screen space ou pan/zoom antigo.
- Diagnóstico E7G adicionado para paridade entre âncora do path, âncora do handle, losango, hitbox, linha pontilhada, segmento selecionado e espaço de armazenamento.
- Preservados Preview, Export, WebCodecs, `renderSessionSnapshot`, `stableDrawable`, assets/layers, replace, salvar/carregar, menus, layout, cores, textos, ícones, fluxo e lógica de câmera do vídeo.
- `index.html`: `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E7G`.

## v8z4b32E7F

**editor frame sync no Modo Câmera.** Base: `v8z4b32E7E`.

- Cria sincronização canônica do frame ativo no editor via `canonicalFrameIndex`, derivando `rendererFrameIndex`, timeline visual/central/mira, HUD/chips, overlay e scrim do mesmo índice.
- `commitFilmSelection()`, seleção de frame/trecho e centralização/scroll da timeline passam a sincronizar os alvos visuais antes do redesenho de overlay, HUD, curvas e scrim.
- `getFrameScreenGeometry(frameIndex)` deixa de contaminar o diagnóstico ancorado ao ser chamado para frames inativos; somente o frame canônico atualiza `frameAnchoredUIFrameIndex`.
- O cutout do scrim usa a mesma geometria canônica de tela do frame (`getFrameScreenGeometry`) para centro, tamanho e rotação, evitando cálculo paralelo de centro/pan/zoom.
- Diagnóstico E7F adiciona os campos obrigatórios de paridade entre frame ativo, timeline, HUD/chips, overlay, scrim, curvas/handles e ghost handles.
- Preservados integralmente Preview, Export, WebCodecs, `renderSessionSnapshot`, `stableDrawable`, cache/hidratação de assets, layers, replace, salvar/carregar, menus, layout, cores, textos, ícones e fluxo aprovados da E7E.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E7F`.

## v8z4b32E7E

**hotfix cirúrgico readiness/stableDrawable do img-1.** Base: `v8z4b32E7D`.

- Mantém o gate obrigatório da E7D: Preview/Export só iniciam com snapshot completo e drawables válidos para todos os assets visíveis.
- `prepareRenderSessionSnapshot(kind)` agora aguarda tentativa real de hidratação/decode antes de bloquear, canoniza `stableDrawable` no próprio asset e usa esse drawable estável no snapshot.
- `img-1` passa a hidratar a fonte canônica do próprio asset e, em projetos legados onde a fonte carregada existe apenas no caminho principal (`canonicalRenderImage`/`imgEl`), cria uma vez um `stableDrawable` canônico no asset antes do render, sem desenhar Preview/Export diretamente do DOM.
- Diagnóstico diferencia presença real da imagem 6 em `assets[]` de inclusão no snapshot, evitando reportar asset ausente quando o snapshot abortou antes de completar.
- Novos campos de diagnóstico cobrem criação/uso/checksum do `stableDrawable` do img-1, preparação assíncrona da sessão, bloqueio de Preview e presença/inclusão da imagem 6.
- Preservados câmera/getStateAtT, interpolação, curvas, frames, timeline, menus, layout, Layers, zIndex, seleção, troca de imagem, schema save/load, ProjectWorld geometry, Formato e Fundo.

## v8z4b32E7B

**hotfix cirúrgico da imagem 6 no Preview/Export.** Base: `v8z4b32E7A`.

- `buildRenderSessionSnapshotE6()` agora cria uma fonte raster interna estável para cada asset visível antes de Preview/Export, valida pixels reais via checksum alpha/luma e congela `drawSource`, dimensões, `sourceVersion` e `worldRect` da sessão.
- `collectWorldRenderAssets()` continua consumindo o mesmo snapshot lógico para Preview e Export, preservando a paridade do img-1 da E7A e evitando DOM image volátil como fonte de render da sessão.
- `_accumulateRenderSessionFrameE6()` passa a validar por frame que o asset problemático usa fonte não vazia, hash estável e não teve troca de fonte/retângulo.
- Diagnóstico ampliado para a imagem 6 (`img-1781638924641-484`) com tipo/tamanho/hash/checksum da fonte estável, flags de uso em Preview/Export e detecção de draw blank.
- Preservados img-1 replace/Preview/Export parity da E7A, Layers, menus, toolbar, layout, cores, textos, ícones, frames, curvas, timeline, câmera/getStateAtT, ProjectWorld geometry, formato/fundo e schema save/load.

## v8z4b32E7A

**img-1 Preview canonical parity.** Base: `v8z4b32E6`.

- Hotfix cirúrgico no caminho de Preview do img-1 após replace: o Preview passa a consumir o snapshot de sessão reconstruído a partir de `assets[]`, usando a fonte e geometria canônicas do asset.
- Invalidação do snapshot/cache de Preview no fluxo de troca de imagem para impedir reuso de retângulo/fonte antigos.
- Diagnóstico protegido para confirmar que o Preview usa o modelo canônico, o snapshot de sessão e o mesmo renderer de assets já usado pelo Export.
- Preservados Export/WebCodecs, câmera, frames, curvas, ProjectWorld, layers, menus, layout, cores, textos, ícones e schema de save/load.

## v8z4b32E6

**canonical asset render parity — Engine Sprint autorizado pela tarefa: corrige a divergência em que o img-1 aparece correto no Stage após o replace mas some/usa caixa antiga no Preview/Export; força um único estado canônico do asset (fonte + worldRect) usado por Stage, Preview, Export e save/load; corrige o falso positivo dos diagnósticos de paridade da E5; adiciona snapshot estável de render.** Base: `v8z4b32E5`.

- **commit canônico do replace.** `replaceImageAssetInPlace()` passa a commitar no asset REAL em `assets[]` (para TODO asset, inclusive img-1), depois do decode e ANTES de redesenhar Stage/Preview/Export: `sourceW/H` = nat da imagem nova, `worldX/Y/W/H` = `replaceNewWorldRect` (fit contain, `worldAR == sourceAR`), `drawSource` = imagem crua nova, `fitMode='contain'`, `crop` reset, `imgReady/decodeReady=true`, `sourceVersion++`/`renderVersion++`/`replaceEpoch`, `e6CanonicalReplaced=true`. Para img-1 isso substitui o comportamento da E5 (que mantinha `worldX/Y/W/H` cravados na célula cheia): agora o img-1 é geometricamente idêntico a um asset extra.
- **renderer unificado do img-1 (Preview/Export).** `collectWorldRenderAssets()` desenha o img-1 **canonicamente substituído** pela MESMA fonte crua do asset (`a.drawSource`/`a._img`) e pelo MESMO `worldRect` canônico dos extras (via `getWorldRenderAssetRectSourcePx`) — não usa mais `mainSource` legado, nem o nat antigo (ex.: 1024×1536), nem a caixa antiga. O img-1 **legado nunca substituído** continua usando `mainSource` canônico exatamente como na E5 — sem regressão em composições antigas (validado por teste: asset não substituído renderiza a caixa cheia inalterada).
- **imgNatW/imgNatH e câmera intactos.** A fonte canônica cozida (`imgNatW`×`imgNatH`) continua sendo gerada nas MESMAS dimensões, só para fundo espelhado/persistência — `getStateAtT@v8z4b32E3`, `getStateAtTBase`, frames, curvas e `projectWorld.baseStageW/H` permanecem byte-a-byte idênticos.
- **snapshot estável de render.** `buildRenderSessionSnapshotE6()` é criado/validado antes de Preview e Export; captura `assetId/visible/zIndex/worldRect/sourceW/H/drawSource/decodeReady/imgReady/sourceVersion/replaceEpoch` dos assets visíveis, dispara decode de fontes pendentes e congela a época da sessão — decode assíncrono atrasado com época anterior não invalida a sessão ativa. Acumulação por frame em `drawWorldToCanvas` detecta blink/desaparecimento/troca de fonte-rect/composite dirty.
- **sync/save/load.** `syncFirstImageAsset()` não sobrescreve `sourceW/H` nem `worldRect` de um img-1 canonicamente substituído. `serializeProjectAsset()` persiste `src`+`e6CanonicalReplaced`+versões do asset substituído (inclusive img-1/idx 0). `restoreProjectAssetsFromData()` restaura o `worldRect`/`src` canônicos salvos do img-1 em vez de forçar a célula cheia. Auto-normalização de assets legados no load **continua desligada** — só o asset SUBSTITUÍDO é normalizado.
- **correção do falso positivo da E5.** Os novos diagnósticos leem o estado REAL: `assets[]` (fonte única) e as amostras reais `renderTransform.preview/export` — nunca o `replaceNewWorldRect` temporário ou o DOM wrapper.
- **imagem 6 / asset problemático (`img-1781638924641-484`).** Tratado como caso conhecido de regressão: o replace de qualquer asset não pode fazê-lo perder bitmap/source; ele deve aparecer em todo frame de Preview/Export e permanecer estável após save/load.
- **diagnóstico (campos observacionais protegidos).** Novos: `e6CanonicalReplaceFixEnabled`, `e6DiagnosticsUseCanonicalAssets`, `e6DiagnosticsUseRealRendererState`, `e6DiagnosticsIgnoreTemporaryReplaceRectForPassFail`, `e6FalsePositiveGuardEnabled`, `e6AssetModelRendererParityChecked`, `e6StagePreviewExportParityChecked`; `img1StagePreviewExportParityFixEnabled`, `img1{Stage,Preview,Export}VisibleAfterReplace`, `img1StagePreviewExportUseSame{Source,WorldRect}`, `img1Canonical{Asset,Source,WorldRect}UpdatedAfterReplace`, `img1AssetWorldARMatchesSourceARAfterReplace`, `img1{,Preview,Export}RendererNatMatchesAssetSource`, `img1{,Preview,Export}RendererWorldMatchesAssetWorld`, `img1NoLegacyMainImageSourceIn{Preview,Export}`, `img1NoOldNatSizeIn{Preview,Export}`, `img1NoOldWorldRectIn{Preview,Export}`, `img1DrawnIn{Preview,Export}FrameCount`, `img1Expected{Preview,Export}FrameCount`, `img1MissingIn{Preview,Export}Detected`, `img1DisappearedAfterReplaceDetected`, `img1PreviewExportUsesUnifiedAssetRenderer`, `img1{Export,Preview}UsesProjectWorldAssetPath`, `img1PreviewExportDoNotUseDomWrapperAsTruth`, `img1CanonicalCommitBefore{StageRedraw,Preview,Export}`, `img1SaveLoadPreservesCanonical{WorldRect,Source}`; `renderSessionSnapshotEnabled`, `renderSessionSnapshotBuiltBefore{Preview,Export}`, `renderSessionVisibleAssetCount`, `renderSessionDecodedAssetCount`, `renderSessionAllVisibleAssetsReadyBefore{Preview,Export}`, `renderSessionStartedWithPendingAssets`, `renderSessionUsesStableDrawSources`, `renderSessionAvoidsVolatileDomImages`, `renderSessionAsset{Ids,SourceVersions,WorldRects}`, `{preview,export}VisibleAssetsExpectedCount`, `{preview,export}VisibleAssetsDrawnEveryFrame`, `{preview,export}{Min,Max}AssetsDrawnPerFrame`, `assetSkippedBecause{NotReady,MissingSource}Count`, `assetDecodePendingAtFirstFrameCount`, `assetSourceChangedDuring{Preview,Export}Detected`, `assetWorldRectChangedDuring{Preview,Export}Detected`, `assetMissingDuring{Preview,Export}Detected`, `assetBlinkDetected`, `assetDisappearedThenReappearedDetected`, `disappearingAsset{Ids,FrameRanges}`, `unchangedAssetInvalidatedByReplaceDetected`, `projectWorldCompositeDirtyAtFirst{Preview,Export}Frame`, `compositeDirtyDuring{Preview,Export}`, `projectWorldCompositeStableDuring{Preview,Export}`, `asyncImageDecodeInvalidatedActiveRenderSession`, `asyncImageDecodeIgnoredBecauseEpochMismatch`; `knownProblemAsset{Id,Index,Present,ExpectedVisible,ReadyBefore{Preview,Export},DrawnIn{Preview,Export}EveryFrame,MissingIn{Preview,Export}Detected,DisappearedThenReappeared,SourceChangedDuring{Preview,Export},WorldRectChangedDuring{Preview,Export},LostBitmapAfter{Img1,OtherAsset}Replace,StableAcrossRenderSession,StableAfterOwnReplace,StableAfterSaveLoad}`. Todos protegidos.
- **NÃO TOCADO:** `getStateAtT@v8z4b32E3`/`getStateAtTBase`/sampler canônico/paridade Preview-Export, interpolação/curvas/rotação/easing, frames, timeline/duração, `projectWorld.baseStageW/H`/geometry, WebCodecs/muxer/encoder, matemática da câmera em `drawWorldToCanvas`, caminho single-image de `drawAtTDirect`, UI/layout/cores/ícones/texto/menus/toolbar/painel Layers/handles, "Não limitar" (segue ausente).
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E6`.

## v8z4b32E5

**replace visual box parity — corrige a moldura/wrapper transparente que sobrava maior que a imagem após o replace (DOM wrapper, seleção e hit-test do editor passam a hugar o retângulo real da imagem), sem alterar render/câmera/ProjectWorld/Preview/Export.** Base: `v8z4b32E4`.

- **diagnóstico: para assets EXTRAS a paridade já estava correta.** `renderProjectWorldExtraImages()` (DOM), `renderAssetSelectionOverlay()` (seleção) e `hitTestAssetAtWorld()` (hit-test) já liam `asset.worldX/Y/W/H` ao vivo a cada chamada — não havia cache/wrapper separado para ficar desatualizado. O bug real estava em **img-1**: o replace mantém `worldX/Y/W/H` cravados na caixa cheia do `ProjectWorld` (invariante de câmera/frames — propositalmente não recalculada, ver v32E4) e a imagem nova é cozida com fit contain + tarja de cor de fundo **dentro** dessa caixa; o editor desenhava o DOM/seleção/hit-test do tamanho da **caixa cheia**, maior que a imagem real — daí a moldura roxa/transparente sobrando e o toque na faixa vazia selecionando o asset errado.
- **nova função pura `getAssetVisualWorldRect(asset)`.** Sub-retângulo, em coordenadas de mundo, que a imagem de um asset realmente ocupa dentro do seu `worldRect` — fit contain de `asset.sourceW/H` dentro de `asset.worldW/H`, centrado. Para assets extras é, por construção, **idêntico** ao `worldRect` (a v32E4 já recalcula `worldW/H` na mesma proporção da imagem — zero mudança de comportamento, confirmado por teste). Para img-1 dá o retângulo real da imagem dentro da célula intacta do grid. Não lê nem escreve nenhum estado; nunca altera `asset.worldX/Y/W/H`.
- **DOM wrapper, seleção e hit-test do editor passam a usar esse sub-retângulo.** `renderProjectWorldExtraImages()`, `renderAssetSelectionOverlay()` e `hitTestAssetAtWorld()` substituem o `worldRect` cru por `getAssetVisualWorldRect(asset)` — elimina a moldura/letterbox visível no Stage e faz o toque na área antes coberta por tarja deixar de selecionar img-1 (cai para o asset abaixo ou para área vazia).
- **img-1 passa a exibir a imagem nova crua.** `target.src` de img-1 deixa de ser o canvas cozido com tarja (`canonUrl`) e passa a ser a imagem nova sem padding (`dataUrl`), igual aos extras — o `<img>` do editor mostra a imagem real, dimensionado pelo sub-retângulo visual.
- **NÃO TOCADO (governança AGENTS.md — `drawAtT`/engine só muda em Engine Sprint explícito):** `asset.worldX/Y/W/H` do modelo (inclusive img-1 — continua intacto), `drawAtT`/`drawAtTDirect`/`drawWorldToCanvas`/`collectWorldRenderAssets`/`getStateAtT@v8z4b32E3` (pipeline de render/export), `imgNatW/imgNatH`/`projectWorld.baseStageW/H` (referência canônica de câmera/frames/curvas/ProjectWorld), o bake no canvas canônico (continua gerado idêntico à v32E4, usado como fallback para fundo espelhado/persistência/projetos onde img-1 nunca foi substituída). **Limitação conhecida e documentada:** Preview/Export de img-1 continuam desenhando pela fonte canônica cozida quando a proporção muda (o pipeline de render não foi tocado); fechar 100% essa paridade exige um Engine Sprint dedicado a `collectWorldRenderAssets`.
- **`computeWorldCoordinateAudit()` inalterado** (a checagem de "mundo híbrido" continua exigindo `asset0.worldW/H ≈ baseStageW/H`, válido porque img-1 nunca deixa de ocupar a caixa cheia do modelo).
- **diagnóstico de assets legados contaminados (`_scanLegacyBoxedAssets()`), somente leitura.** Detecta `sourceAR` ≠ `worldAR` além de 1.5% sem crop explícito; nunca normaliza nada automaticamente ao abrir o arquivo (`legacyBoxedAssetsAutoRepairedOnLoad=false`) — um asset só é corrigido quando o usuário faz replace nele.
- **diagnóstico (campos observacionais protegidos).** Novos: `replaceVisualParityFixEnabled`, `replacedAssetId`, `replacedAsset{WorldRect,DomWrapperRect,ImageElementRect,SelectionRect,HitTestRect,BoundsCacheRect,StageRenderRect,PreviewRenderRect,ExportRenderRect}`, `replacedAsset{WorldAR,SourceAR,WorldARMatchesSourceAR}`, `replacedAsset*MatchesWorldRect` (DomWrapper/ImageElement/Selection/HitTest/BoundsCache/StageRender/PreviewRender/ExportRender), `replacedAssetUsesSingleGeometrySource`, `replacedAssetOld*StillApplied/StillInDom`, `replacedAssetHasTransparentInheritedBox`, `replacedAsset{Letterbox,Pillarbox}FromOldBoxDetected`, `replacedAssetNoEmptyInheritedMargins`, `replacedAssetImageFillsWrapper`, `replacedAssetWrapperHasCorrectAspectRatio`, `replacedAssetSelectionBoxHugsImage`, `replacedAssetHitTestDoesNotSelectAssetBelowInsideOwnBox`, `replacedAssetDomRebuiltOrResizedAfterReplace`, `replacedAssetBoundsCache{Invalidated,Rebuilt}AfterReplace`, `replacedAssetStageRedrawnAfterReplace`, `replacedAssetCompositeInvalidatedAfterCommitOnly`, `replacedAssetNoLegacyWrapperAfterReplace`, `allReplacedAssets*`, `legacyBoxedAsset{Count,Ids,Details,DetectedOnly}`, `legacyBoxedAssetsAutoRepairedOnLoad`, `img1ReplaceUsesUnifiedAssetPath`, `img1ReplaceDoesNotUseLegacyMainPath`, `img1UsesSameVisualWrapperPathAsOtherAssets`, `img1Actual{WorldRectMatchesReplaceNewWorldRect,WorldARMatchesSourceAR,SourceMatchesNewImage}`, `img1RenderSourceMatchesAssetSource`, `img1RenderWorldRectMatchesAssetWorldRect`, `img1{DomWrapper,ImageElement,SelectionBox,HitTestBox}MatchesAssetWorldRect`, `img1NoLegacyRenderCacheAfterReplace`, `img1NoOld{NatSize,WorldRect}AfterReplace`, `img1NoTransparentInheritedBox`, `img1No{Letterbox,Pillarbox}FromOldBox`. Todos protegidos; `legacyBoxedAssetsAutoRepairedOnLoad` sempre `false`.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E5`.

## v8z4b32E4

**replace image aspect/crop fix — corrige a troca de imagem herdando crop/formato/proporção do asset anterior; a imagem nova entra inteira, em fit contain, sem cortar e sem distorcer, preservando centro/zIndex/slot/visible/seleção (sem alterar Preview/Export/câmera/render/ProjectWorld).** Base: `v8z4b32E3`.

- **corrige a geometria da imagem substituída.** Antes, `replaceImageAssetInPlace()` trocava o bitmap **na mesma caixa** (`worldX/Y/W/H`) do asset anterior via cover-fit — uma imagem nova com proporção diferente entrava cortada/espremida na proporção antiga. Agora, para assets **extras**, `worldX/Y/W/H` são **recalculados por fit contain** (`fitContain()`, já usado por Inserir Imagem) a partir da proporção natural da imagem nova, dentro de uma caixa de referência (`slotBox` = `ProjectWorld.baseStageW/H` quando válido, senão a caixa antiga do próprio asset), mantendo o **centro visual** do asset anterior.
- **preserva a imagem principal (img-1) sem tocar em câmera/frames/ProjectWorld.** `worldX/Y/W/H` da img-1 continuam intactos (invariante de célula central do grid) — `getStateAtT`, `getStateAtTBase`, frames, curvas e `ProjectWorld.baseStageW/H` permanecem byte-a-byte idênticos. O novo bitmap é cozido no mesmo canvas canônico (`imgNatW`×`imgNatH`), mas o bake passa a usar fit **contain** (antes era cover): a imagem nova entra inteira, centralizada, com a cor de fundo do projeto preenchendo a tarja restante, em vez de cortar a imagem.
- **limpa crop herdado.** Todo replace reseta `asset.crop` para `{ enabled:false, x:0, y:0, w:1, h:1 }` — a imagem nova nunca herda crop/sourceRect do asset anterior.
- **commit atômico.** `sourceW/sourceH` e a fonte desenhável só são preparados e só substituem o asset **depois** do decode da imagem nova completar (`img.onload`); falha de decode (`img.onerror` ou dimensões inválidas) mantém a imagem antiga, mostra erro controlado e não deixa o asset em estado parcial. Composite/Stage só são invalidados/redesenhados depois do commit completo.
- **preserva identidade/seleção/zIndex/slot/visible.** O asset trocado continua o mesmo objeto/`id`; `zIndex`, slot (linha/coluna do grid, derivado do centro preservado), `visible` e a seleção (`selectedAssetId`) não mudam.
- **preserva Inserir Imagem, resolução de alvo, hit-test, reorder e movimento.** `performInsertImageAtSlot()` inalterado (já usava fit contain). `resolveReplaceTargetAsset()` inalterado: toolbar mira `selectedAssetId`, painel Layers mira o `assetId` da linha, nunca cai em img-1/slot central havendo seleção válida. `assets.length` não muda no replace.
- **Preview/Export/câmera não alterados.** Sampler canônico `getStateAtT@v8z4b32E3`, `getStateAtTBase`, paridade/continuidade Preview↔Export, `drawWorldToCanvas`/`collectWorldRenderAssets`, `renderFrameSafely`, `renderVideoFrame`, WebCodecs, interpolação, curvas, timeline, frames e `ProjectWorld` permanecem idênticos.
- **diagnóstico (campos observacionais protegidos).** Novos: `replacePreservesAnchorCenter/LayerIdentity/ZIndex/Slot/Visibility/Selection`, `replaceOld/NewWorldRect`, `replaceOld/NewCenterX/Y`, `replaceCenterPreserved`, `replaceOld/NewSourceAR`, `replaceOld/NewWorldAR`, `replaceNewWorldARMatchesSourceAR`, `replaceRecalculatesWorldRectFromNewImageAspectRatio`, `replaceDoesNotPreserveOldAspectRatio`, `replaceDoesNotInheritPreviousCrop/CropNewImage/DistortNewImage`, `replaceFitMode`, `replaceCropRectReset`, `replaceSourceRectUsesFullImage`, `replaceUsesContainFit`, `replaceUsesSlotBoxAsReference`, `replaceSlotBoxW/H`, `replaceCommittedAfterDecode/Atomically`, `replaceKeptOldImageOnDecodeFailure`, `replaceAssetHadPartialState`, `replaceAssetReadyAfterCommit`, `replaceCompositeInvalidatedAfterCommitOnly`, `replaceStageRedrawnAfterCommitOnly`, `replacedImageVisibleAfterReplace/InPreview/InExport`, `replacedImageNotCroppedInEditor/InPreview/InExport`, `unchangedAssetLostBitmapAfterOtherAssetReplace`, `assetBlinkDetectedAfterReplace`, `assetMissingAfterReplaceDetected`. Todos protegidos; `smokeTestFallback` mantido `false`.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E4`.

## v8z4b32E2

**unified image asset stack — remove o tratamento visual especial da imagem principal no editor e unifica TODAS as imagens (incl. img-1) numa única pilha de imageAssets (render, zIndex, hit-test, reorder, replace e movimento), sem alterar Preview/Export/câmera/render.** Base: `v8z4b32E1`.

- **remove a "camada visual especial" da imagem principal no editor.** `renderProjectWorldExtraImages()` foi reescrita: TODAS as imagens visíveis (img-1 + extras) são desenhadas como `.world-extra-img` absolutas, ordenadas por `zIndex`. O `#imgEl` legado permanece no DOM apenas como fonte de bitmap (Preview/Export/canônica) e fica **visualmente desativado** (`visibility:hidden`), deixando de competir por z-index. Isso corrige o bug em que img-1 ficava presa ao fundo: `restackFilmEditorLayers()` fixava `#imgEl` em `z-index:1`, sobrepondo qualquer `zIndex` lógico. Agora img-1 obedece ao `zIndex` real e pode ir para frente/trás como qualquer layer.
- **img-1 é um imageAsset normal.** Participa do mesmo render, hit-test (`hitTestAssetAtWorld` já usa `worldX/Y/W/H`), reorder (`layerMoveAssetUp/Down`, Frente/Trás) e movimento (`assetDragState`) dos extras. `editorHasVisualMainImageLayer=false`, `img1RenderedThroughUnifiedAssetStack=true`, `img1LegacyVisualLayerDisabled=true`, `img1DrawnOnlyOnce=true`.
- **centraliza a resolução do alvo de replace (ESCOPO 4).** Nova `resolveReplaceTargetAsset(requestedFrom)`: (1) linha do painel Layers (`pendingImageTargetAssetId`); (2) toolbar do Modo Ativos → `selectedAssetId`; (3) fallback **legado explícito** para img-1 SOMENTE quando não há seleção válida. Nunca usa `activeSlotSelection`/slot central; nunca substitui img-1 havendo `selectedAssetId` válido. `doReplaceImageFromFile()` e `doReplaceLayerAsset()` roteiam para a substituição unificada `replaceImageAssetInPlace(target, file, requestedFrom)`.
- **trocar imagem preserva a geometria global (ESCOPO 5).** A substituição (img-1 ou extra) ocorre **no lugar**, preservando `worldX/Y/W/H`, `zIndex`, `slotRow/Col`, `visible`, `fitMode`. Para a img-1 o novo bitmap é "cozido" num canvas das **mesmas dimensões canônicas** (cover-fit) e definido como fonte canônica — logo `imgNatW/imgNatH`, `stageW/stageH`, `baseStageW/baseStageH`, frames, curvas e `ProjectWorld` permanecem idênticos. Não há mais `loadImage()`/`layoutStage()` na troca da imagem base (que recalculava o Stage pela proporção da nova imagem). `assets.length` não muda; nenhum asset é criado.
- **inserção de novas imagens (ESCOPO 6).** Imagem nova entra como imageAsset normal no topo do `zIndex`, selecionada, no painel Layers, no hit-test e na pilha unificada; nunca substitui img-1 nem vira "imagem principal".
- **preserva o que já estava aprovado.** Movimento básico X/Y v32E1 (só Modo Ativos, só `worldX/Y`, undo ao soltar), seleção/hit-test v32E1, menus global/contextuais, toolbar inferior de Ativos, bolinhas acima do scrim e ausência de "Não limitar".
- **Preview/Export/câmera não alterados.** `getStateAtT`, `getStateAtTBase`, `drawAtT`/`drawWorldToCanvas`/`collectWorldRenderAssets`, `renderFrameSafely`, `renderVideoFrame`, WebCodecs, export/render final, preview clock, interpolação, curvas, timeline, frames, `ProjectWorld`, save/load (apenas persistência já existente: a img-1 trocada persiste via `imageOriginalDataUrl` do canvas canônico, sem mudança de schema).
- **diagnóstico (campos observacionais protegidos).** Novos: `editorHasVisualMainImageLayer`, `editorUsesUnifiedImageAssetStack`, `firstImageIsRegularAsset`, `img1RenderedThroughUnifiedAssetStack`, `img1LegacyVisualLayerDisabled`, `img1DrawnOnlyOnce`, `noSpecialVisualMainImagePath`, `allImagesUseSameLayerRenderer/HitTestPath/ReplacePath/MovePath`, `baseImageAssetZIndex`, `baseImageComputedZIndex`, `baseImageExpectedZIndex`, `baseImageVisualStackMatchesLayerOrder`, `baseImageCanMoveToFront/Back`, `baseImageNotPinnedToBackground`, `computedImgElZIndex`, `computedWorldExtraZIndexes`, `realDomLayerOrderMatchesAssetLayerOrder`, `realVisualOrderMatchesAssetRenderOrder`, `visualOrderMatchesHitTestOrder`, `img1VisualOrderIndex/LayerOrderIndex/HitTestOrderIndex`, `lastReplaceRequestedFrom`, `lastReplaceResolvedTargetAssetId`, `lastReplaceSelectedAssetIdBefore`, `lastReplaceLayerAssetIdBefore`, `lastReplaceReplacedExpectedAsset`, `lastReplaceDidNotFallbackToImg1`, `replacedAssetIdMatchesResolvedTarget`, `replaceUsedActiveSlotSelection`, `replaceUsedCenterSlotFallback`, `replaceUsedLegacyMainImageFallback`, `replaceAssetCountBefore/After`, `replaceAssetCountUnchanged`, `replaceDidNotInsertNewAsset`, `replacePreservedProjectWorldBaseStage`, `replacePreservedCurrentStageGeometry`, `replaceDidNotRecalculateStageFromNewImage`, `replacePreservedFrames/Curves/ZIndex/WorldRect/Slot/Visibility`, `stageGeometry*ByReplace`, `projectWorldChangedByReplace`, `frame/curveCoordinatesChangedByReplace`, `stageDerivedFromNewImageAfterReplace`, `img1Forward/BackwardAction*`, `insertedImage*`, `insertDoesNotReplaceImg1`. Todos protegidos; `smokeTest.fallback` mantido `false`.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E2`.

## v8z4b32E1

**central slot layers and asset move hotfix — correção da integração real entre painel Layers, Stage, hit-test, slot central/img-1 e assets novos, além de liberar movimento básico X/Y de imagens no Modo Ativos (sem alterar Preview/Export/câmera/render).** Base: `v8z4b32E`.

- **corrige Trocar no painel Layers para substituir por assetId, sem inserir novo asset.** A ação "Trocar" de uma linha agora usa um fluxo dedicado (`onLayerReplaceClick(assetId)` → `pendingImageAction = 'replaceLayerAsset'`, `pendingImageTargetAssetId = assetId`, `pendingImageTargetSlot = null`, `activeSlotSelection = null`). Após escolher a imagem, `doReplaceLayerAsset()` localiza o asset pelo `pendingImageTargetAssetId` e substitui o bitmap **no lugar**, preservando `worldX/Y/W/H`, `zIndex`, `slotRow/Col`, `fitMode`, `visible` e a ordem no painel. Não reaproveita mais `startReplaceImageFlow()` (que resolvia o alvo pela seleção/slot e podia cair no fluxo de inserir). Guard em `performInsertImageAtSlot()`: com `replaceLayerAsset` pendente, é proibido inserir/adicionar asset.
- **corrige integração do slot central/img-1 com a pilha unificada de layers.** `syncFirstImageAsset()` não força mais `zIndex = 0` — preserva o `zIndex` já definido (reorder/Frente-Trás/save) através de re-sync (ex.: troca de imagem). Em `renderProjectWorldExtraImages()`, a imagem base (`#imgEl`) passa a ser posicionada pela mesma transformação (`editorWorldToStage`) dos extras quando há múltiplas imagens, seguindo `worldX/worldY` — antes ficava travada em (0,0). Em projetos criados no app (transform inativa) o resultado em repouso é idêntico.
- **corrige reorder entre imagem base e imagens novas.** Com o `zIndex` da base preservado e a base participando da mesma pilha, Subir/Descer entre img-1 e qualquer asset novo funciona de forma coerente. `layerMoveAssetUp/Down(assetId)` agora também tornam a linha acionada o `selectedAssetId` (ESCOPO 4) — a mesma layer permanece selecionada após a reordenação.
- **corrige hit-test para selecionar imagens novas no Stage.** `handleStageAssetSelectPointer()` faz o hit-test sobre a lista atual de assets (`imgEl` + extras), ordenada por `zIndex`, do topo para o fundo; o asset visualmente mais acima vence. Em área vazia, o evento não é bloqueado, preservando o pan/navegação do mundo.
- **garante que ordem visual, painel Layers e hit-test usem a mesma pilha por zIndex.** Render (`renderProjectWorldExtraImages`), painel (`renderLayersPanelList`) e hit-test (`hitTestAssetAtWorld`) compartilham a ordenação por `zIndex`.
- **adiciona movimento básico X/Y de imagens no Modo Ativos.** Novo gesto: arrastar o asset selecionado move **apenas** `worldX/worldY` (`assetDragState` + `handleStageAssetMovePointer`/`endStageAssetMovePointer`, capture em `#imageArea`). Threshold (`STAGE_SINGLE_TOUCH_MOVE_THRESHOLD`) separa toque de arrasto. Undo registrado ao soltar (um passo restaura a posição anterior). Não altera `worldW/H`, `zIndex`, `slotRow/Col`, frames, curvas nem `ProjectWorld`. Funciona só no Modo Ativos; drag em área vazia continua navegando o mundo; Modo Câmera não move imagens.
- **preserva menus da v32E.** Menu global (lista única), menu Câmera (Visualização antes de Enquadramento, sem opção redundante do estado atual) e menu Ativos (Visualização antes de Imagens) inalterados.
- **preserva handles/bolinhas acima do scrim.** `#frameHandlesLayer` e o contraste das bolinhas inalterados.
- **preserva remoção de "Não limitar".** `#containItem` continua ausente.
- **Preview/Export/ProjectWorld não alterados.** `getStateAtT`, `getStateAtTBase`, `drawWorldToCanvas`, `renderFrameSafely`, `renderVideoFrame`, WebCodecs, export/render final, preview clock, `ProjectWorld`, save/load, JSON schema, coordenadas de frames, curvas, motor de câmera/interpolação, timeline, layout, cores, ícones, menu global aprovado, menus contextuais aprovados e bolinhas aprovadas.
- **diagnóstico (campos observacionais protegidos).** Novos campos: `layerReplaceDidNotInsertNewAsset`, `layerReplaceAssetsCountBefore/After`, `layerReplaceAssetCountUnchanged`, `lastLayerReplaceChangedOnlyTargetAsset`, `lastLayerReplacePreservedWorldX/Y/W/H`, `lastLayerReplacePreservedZIndex/Slot/Visibility`, `lastLayerReplaceUpdatedThumbnail/Name`, `lastLayerReplaceSelectionPreserved`, `duplicatedSlotCreatedByLayerReplace`, `baseImageParticipatesInLayerStack`, `baseImageUsesSameLayerOrderAsExtras`, `baseImageDomZIndexMatchesAssetZIndex`, `baseImageRenderOrderMatchesZIndex`, `baseImageHitTestOrderMatchesZIndex`, `centralSlotUsesUnifiedLayerSystem`, `centralSlotReorderWorks`, `centralSlotHitTestTopmostWorks`, `reorderBetweenBaseAndExtraWorks`, `reorderBetweenExtraAssetsWorks`, `centralSlotDoesNotUseLegacyMainImagePathForHitTest`, `centralSlotDoesNotUseActiveSlotForLayerReplace`, `newAssetsSelectableOnStage`, `newlyInsertedAssetInHitTestOrder`, `newlyInsertedAssetHitTestWorks`, `stageHitTestUsesCurrentAssetsArray`, `stageHitTestUsesSortedZIndexOrder`, `stageHitTestTopmostAssetWins`, `stageTapSelectedNewAssetId`, `stageTapSelectedBaseAssetId`, `lastStageTapAssetCandidateIds`, `lastStageTapSelectedAssetId`, `lastStageTapSelectionMatchesTopmostVisualAsset`, `assetBoundsCacheInvalidatedAfterInsert/Replace`, `assetHitTestOrderRebuiltAfterInsert/Reorder/Replace`, `layerReorderSelectedRowBecomesSelectedAsset`, `assetMoveInAssetsModeEnabled`, `assetMoveOnlyInAssetsMode`, `assetMoveDisabledInCameraMode`, `lastAssetMoveId`, `lastAssetMoveStartWorldX/Y`, `lastAssetMoveEndWorldX/Y`, `assetMoveChangedOnlyWorldXY`, `assetMovePreservedWorldW/H/ZIndex/Slot/Frames/Curves/ProjectWorld`, `assetMoveInvalidatedComposite`, `assetMoveRedrewStage`, `assetMoveUndoRegistered`, `assetMovePanConflictDetected`, `assetMoveStartedFromSelectedAsset`, `emptyStageDragStillPansWorld`, `layersActionsDoNotMutateFrames`, `layersActionsDoNotMutateProjectWorld`, `assetMoveDoesNotMutateFrames`, `assetMoveDoesNotMutateProjectWorld`. Todos protegidos; `smokeTest.fallback` mantido `false`.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E1`.

## v8z4b32E

**Layers reorder, handles contrast fix, context menu section swap — reordenação de camadas via painel Layers, correção de contraste das bolinhas de frame acima do scrim e reordenação das seções nos menus contextuais (sem alterar Preview/Export/câmera/render).** Base: `v8z4b32D1`.

- **adiciona botões Subir/Descer por linha no painel Layers.** `layerMoveAssetUp(assetId)` e `layerMoveAssetDown(assetId)` reordenam assets via troca de `zIndex`, seguindo o mesmo padrão de `bringSelectedAssetForward`/`sendSelectedAssetBackward`. Sem drag-and-drop (compatibilidade com iPhone/Safari scroll). Cada linha do painel exibe botões ↑ / ↓ compactos; botão desabilitado nos extremos.
- **adiciona botão Trocar por linha no painel Layers.** `layerReplaceImageForAsset(assetId)` seleciona o asset pelo `assetId` da linha e chama `startReplaceImageFlow()`, que via `doReplaceExtraAsset()` preserva `worldX/Y/W/H`, `zIndex`, `slotRow/Col`, `fitMode`, `visible` e `id` do asset substituído.
- **corrige contraste/hierarquia visual das quatro bolinhas de frame acima do scrim.** Novo elemento `#frameHandlesLayer` (`position:absolute;inset:0;z-index:17`) adicionado como irmão de `#stageDimSvg` (z-index:16) dentro de `#imageArea`. Corner handles movidos para `#frameHandlesLayer` em `ensureCornerHandles()`. Coordenadas convertidas de stageContent para imageArea via `stagePointToFilmAlphaScrimViewportPoint()` em `refreshActiveFrameVisuals()` e `updateGhostTransformHandle()`. Bolinhas ficam acima do scrim com contraste pleno, sem herdar opacidade do grupo de referência.
- **reordena seções do menu contextual do Modo Câmera.** Seção Visualização (Mostrar tudo / Isolar frame / Esconder imagens) agora precede Enquadramento (Formato). Ordem anterior era Enquadramento → Visualização.
- **reordena seções do menu contextual do Modo Ativos.** Seção Visualização (Fundo / Mostrar frames) agora precede Imagens (Inserir imagem / Layers). Ordem anterior era Imagens → Visualização.
- **preserva menu global idêntico ao v32D1.** Sem alterações no menu superior/global aprovado: Início, Templates, Reset, Salvar, Novo Projeto, Abrir, Recarregar, Diagnóstico.
- **preserva toolbar inferior de Ativos.** Trocar / Excluir / Frente / Trás permanecem exclusivamente na barra inferior do Modo Ativos.
- **preserva remoção de "Não limitar".** `#containItem` continua ausente da interface.
- **diagnóstico (campos observacionais protegidos).** Novos campos: `layersReorderInPanelAvailable` (true), `layersReorderNoDragDrop`, `lastLayerReorderAction`, `lastLayerReorderAssetId`, `lastLayerReorderOldIndex`, `lastLayerReorderNewIndex`, `lastLayerReorderOldZIndex`, `lastLayerReorderNewZIndex`, `layerReorderNoDuplicateZIndex`, `layerReorderChangedOnlyAssets`, `layerReorderPreservedSelectedAsset`, `layerReorderPreservedFrames`, `layerReorderPreservedCurves`, `layerReorderPreservedProjectWorld`, `layerReorderInvalidatedComposite`, `layerReorderRedrewStage`, `lastLayerReplaceAction`, `lastLayerReplaceTargetAssetId`, `layerReplaceUsesExistingStartReplaceImageFlow`, `layerReplacePreservesGeometryViaDoReplaceExtraAsset`, `frameHandlesLayerAboveScrim`, `frameHandlesFullContrast`, `frameHandlesLayerExists`, `frameHandlesLayerZIndex`, `scrimZIndex`, `frameHandlesNotDimmedByAlphaScrim`, `frameHandlesDoNotInheritReferenceOpacity`, `frameHandlesSuppressedInAssetsMode`, `frameHandlesVisibleInCameraMode`, `frameHandlesPointerEventsInteractiveInCamera`, `frameHandlesPointerEventsSuppressedInAssets`, `cameraContextMenuVisualizacaoBeforeEnquadramento`, `assetsContextMenuVisualizacaoBeforeImagens`.
- **preserve (não alterado).** `getStateAtT`, `getStateAtTBase`, `drawWorldToCanvas`, `renderFrameSafely`, `renderVideoFrame`, WebCodecs, export/render final, preview clock, `ProjectWorld`, save/load, JSON, coordenadas de frames, curvas, motor de câmera/interpolação, timeline, layout, cores, ícones, toolbar inferior de Ativos, scrim visual (somente hierarquia alterada).
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32E`.

## v8z4b32D

**Menu cleanup and no-limit removal — limpeza de menus e remoção do comando legado "Não limitar" (sem alterar Preview/Export/câmera/render).** Base: `v8z4b32C`.

- **remove comando legado "Não limitar" da interface.** `#containItem` removido do menu global. `toggleContainFrames()` permanece no código mas inacessível pela UI — nenhum botão visível aciona a lógica legada de limitar/deslimitar frames. O comportamento padrão passa a ser livre: frames podem vazar visualmente se o usuário quiser.
- **neutraliza acesso UI ao handler legado de limite.** Nenhum botão, item de menu ou atalho expõe `toggleContainFrames()` ao usuário. Compatibilidade interna de arquivos antigos preservada.
- **remove ações de imagem e modo do menu global.** Removidos: Inserir imagem, Trocar imagem, Layers, Formato, Fundo. Mantidos: Templates, Reset, Início, Salvar, Novo Projeto, Abrir, Recarregar, Diagnóstico.
- **move Formato para menu contextual Câmera/Frames — seção Enquadramento.** `runCameraContextMenuAction('format')` chama `openPanel('Format')`. Não altera opções de formato, export ou render.
- **move Inserir imagem e Layers para menu contextual Ativos — seção Imagens.** Fluxos existentes inalterados.
- **move Fundo para menu contextual Ativos — seção Visualização.** `runAssetsContextMenuAction('background')` chama `openPanel('BgColor')`.
- **separa menu Câmera/Frames em Enquadramento e Visualização.** Seção Enquadramento: Formato. Seção Visualização: Mostrar tudo, Isolar frame, Esconder imagens.
- **separa menu Ativos em Imagens e Visualização.** Seção Imagens: Inserir imagem, Layers. Seção Visualização: Fundo, Mostrar/Esconder frames.
- **corrige estado ativo/desativado de Mostrar tudo, Isolar frame e Esconder imagens.** Botão do estado atual recebe `disabled` + `aria-disabled="true"` ao abrir o menu. `runCameraContextMenuAction()` tem guard que impede re-acionar o estado já ativo.
- **corrige label Mostrar frames / Esconder frames.** `getAssetsFramesToggleLabel()` corrigido: "Ver frames" → "Mostrar frames". Label sempre lido do estado real `worldModeShowFrames` ao abrir o menu contextual de Ativos.
- **mantém Trocar/Excluir/Frente/Trás apenas no toolbar inferior de Ativos.** Nenhuma dessas ações aparece no menu contextual de Ativos.
- **reorder de Layers registrado como backlog para v32E.** Não implementado nesta versão.
- **diagnóstico (campos observacionais protegidos).** Novos campos: `globalMenuHasInsertImage`, `globalMenuHasReplaceImage`, `globalMenuHasLayers`, `globalMenuHasFormat`, `globalMenuHasBackground`, `globalMenuHasNoLimit`, `globalMenuCleanupApplied`, `noLimitControlVisible`, `noLimitLegacyHandlerReachableFromUI`, `noLimitDoesNotMutateFrames`, `framesChangedAfterNoLimitAction`, `noLimitLegacyUiRemoved`, `cameraContextMenuHasFormat`, `cameraContextMenuHasSectionFraming`, `cameraContextMenuHasSectionVisualization`, `cameraShowAllEnabled`, `cameraIsolateFrameEnabled`, `cameraHideImagesEnabled`, `cameraContextMenuCurrentModeDisabled`, `cameraContextMenuDoesNotTriggerCurrentModeAgain`, `assetsContextMenuHasInsert`, `assetsContextMenuHasLayers`, `assetsContextMenuHasBackground`, `assetsContextMenuHasToggleFrames`, `assetsContextMenuHasSectionImages`, `assetsContextMenuHasSectionVisualization`, `assetsFramesToggleLabelMatchesState`, `assetsContextMenuHasReplaceImage`, `assetsContextMenuHasForward`, `assetsContextMenuHasBackward`, `assetsContextMenuHasDelete`, `frameMutationFromMenuDetected`, `menuCleanupDoesNotMutateFrames`.
- **preserve (não alterado).** `getStateAtT`, `getStateAtTBase`, `drawWorldToCanvas`, `renderFrameSafely`, `renderVideoFrame`, WebCodecs, export/render final, preview clock, `ProjectWorld`, save/load, JSON, coordenadas de frames, curvas, scrim/alfa, motor de câmera/interpolação, timeline, layout, cores, ícones, toolbar inferior de Ativos.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32D`.

## v8z4b32C

**Camera view menu and assets mode isolation — correção de arquitetura de menus e isolamento de estado entre modos (sem alterar Preview/Export/câmera/render).** Base: `v8z4b32B`.

- **isola estados de visualização do Modo Câmera para não contaminarem Modo Ativos.** Nova função `clearCameraViewOverridesForAssetsMode()` chamada em `setEditorMode()` ao entrar no Modo Ativos: restaura `imgEl.style.opacity`, `boxShadow` e `.world-extra-img` para normal, seta `window._isoMode = false`. `applyViewMode()` tem guard `isAssetsMode()` — nunca aplica efeitos de câmera no Modo Ativos. `renderProjectWorldExtraImages()` idem. Ao retornar para Câmera, `applyViewMode()` restaura o viewMode correto.
- **menu contextual de Câmera com opções explícitas.** Substituído o item genérico "Alternar visualização" por três botões: **Mostrar tudo** (viewMode=0), **Isolar frame** (viewMode=1), **Esconder imagens** (viewMode=2). Nova função `setCameraViewModeExplicit(n)` aciona diretamente o estado sem ciclo implícito. Estado atual indicado via `.assets-menu-btn-current`. Não existe mais o item genérico "Alternar visualização".
- **Modo Ativos mantém apenas ações de modo/organização no contextual.** Removidos do menu contextual de Ativos: Trocar imagem, Trazer para frente, Enviar para trás. Mantidos: Layers, Inserir imagem, Ver frames / Esconder frames. Ações de asset selecionado (Trocar/Excluir/Frente/Trás) permanecem exclusivamente na barra inferior.
- **reorder direto em Layers preparado para próxima etapa.** Não implementado nesta versão; registrado como backlog imediato para v32D (botões subir/descer ou drag handle, sem afetar Preview/Export).
- **diagnóstico (campos observacionais protegidos).** Novos campos: `cameraContextMenuItems`, `cameraViewMode`, `cameraViewModeLabel`, `cameraViewModeDoesNotLeakToAssetsMode`, `assetsModeForcesImagesVisible`, `assetsModeIgnoresCameraHideImages`, `assetsModeIgnoresCameraIsolateFrame`, `assetsContextMenuItems`, `assetsContextMenuHasOnlyModeActions`, `assetSelectedActionsRemainInBottomToolbar`, `duplicatedAssetActionsRemovedFromAssetsContextMenu`, `globalMenuAssetActionsMovedOrMarkedLegacy`, `layersReorderInPanelAvailable`, `layersReorderPlannedForNextVersion`, `noPreviewExportCodeTouched`.
- **preserve (não alterado).** `getStateAtT`, `getStateAtTBase`, `drawWorldToCanvas`, `renderFrameSafely`, `renderVideoFrame`, WebCodecs, export/render final, preview clock, `ProjectWorld`, save/load, JSON, coordenadas de frames, curvas, scrim/alfa, motor de câmera/interpolação, timeline, layout, cores, ícones.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32C`.

## v8z4b32B

**Complete contextual mode menus from v31T — menus contextuais completos para os botões de modo (sem alterar Preview/Export/câmera/render).** Base oficial: `v8z4b31T` (revalidada após fechar/reabrir o app: Preview e Export OK). A `v8z4b32A` foi **reprovada e descartada** — nenhuma implementação dela foi reaproveitada.

- **roteador explícito dos botões de modo.** Novo `handleModeButtonTap(targetMode, ev)` (e wrappers `handleCameraModeBtn`/`handleAssetsModeBtn`): **1º toque** num botão de modo **inativo** apenas troca de modo (sem abrir menu, via roteador central `setMode`); **2º toque** (modo **já ativo**) abre o **menu contextual** daquele modo. O segundo toque não desativa o modo e não dispara mais diretamente a função antiga (`toggleMapa`/`toggleWorldModeFrames`).
- **menu contextual do Modo Ativos.** Concentra ações existentes e seguras: **Layers** (`openLayersPanel`, painel inalterado), **Ver frames / Esconder frames** (rótulo dinâmico obrigatório; usa `toggleWorldModeFrames` da v31T — frames permanecem **apenas referência visual**, não editáveis no Modo Ativos), **Inserir imagem** (`startInsertImageFlow`), **Trocar imagem** (`startReplaceImageFlow`; habilitado **só** com asset selecionado válido — sem seleção **não** abre Layers automaticamente), **Trazer para frente** / **Enviar para trás** (`bringSelectedAssetForward`/`sendSelectedAssetBackward`; habilitados conforme `zIndex` via `getAssetZOrderInfo`).
- **menu contextual do Modo Câmera.** Preserva e expõe a opção de **visualização de frames** já existente na v31T (`toggleMapa`: Normal → Isolamento → Mapa) — antes acessível pelo segundo toque direto. Nada aprovado na v31T foi removido; menus inferiores de frames/assets continuam intactos.
- **diagnóstico (campos observacionais protegidos).** Adicionados via padrão protegido (`typeof` + valor padrão), **sem derrubar** `AppDebug`: `modeContextMenusEnabled`, `cameraModeContextMenuAvailable`, `assetsModeContextMenuAvailable`, `lastModeButtonTap`, `lastModeContextMenuOpened`, `lastModeContextMenuMode`, `lastModeContextMenuAction`, `firstTapChangesModeOnly`, `secondTapOpensContextMenu`, `assetsContextMenuItems`, `cameraContextMenuItems`, `assetsFramesToggleLabel`, `assetsFramesCurrentlyVisible`, `assetsFramesToggleActionWorks`, `cameraFrameVisualizationOptionsPreserved`, `legacyFrameVisualizationOptionsStillAccessible`, `noPreviewExportCodeTouched`.
- **estética/layout intocados.** Os modais reaproveitam as classes existentes `.assets-menu-*` (sem novas cores/ícones/espaçamentos/textos, exceto o rótulo dinâmico "Ver frames"/"Esconder frames"). Sem reformatação do arquivo.
- **preserve (não alterado).** `getStateAtT`, `getStateAtTBase`, `drawWorldToCanvas`, `renderFrameSafely`, `renderVideoFrame`, WebCodecs, export/render final, preview clock, `ProjectWorld`, save/load, JSON, coordenadas de frames, curvas, scrim/alfa, motor de câmera/interpolação.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b32B`.

## v8z4b31T

**Harden Diagnostics Collector — hardening preventivo do Diagnóstico (sem nova feature, sem mudança visual).** Refatoração defensiva / QA técnico focada exclusivamente no sistema de Diagnóstico. Base: `v8z4b31S` (aprovada). Objetivo: reduzir o risco de recorrência da regressão v31O (uma nova exceção dentro do relatório rico não pode mais derrubar a abertura do painel).

- **rota única preservada.** `window.AppDebug.{collect,open,copy,smokeTest}` permanece como rota única/protegida do Diagnóstico. Sem `closeAll()` após abrir; sem dependência de `currentMode`/`activePanel`/Layers/estado de asset para abrir o painel.
- **dois níveis de coleta.** *Nível 1 — núcleo obrigatório* (`app`, `version`, `timestamp`, `userAgent`, `viewport`, `devicePixelRatio`, `mode`, `framesCount`, `activeFrameIndex`, `assetsCount`, `selectedAssetId`, `preview`, `exportState`, `rendererWorld`, `smokeTest`) é montado campo-a-campo e **não depende** de `buildDiagnosticsText()`; é serializado primeiro e sempre entra. *Nível 2 — relatório rico* (`buildDiagnosticsText()`) é anexado **depois** do núcleo.
- **helper `appendDiagnosticsBlock`.** Novo `window.AppDebug.appendDiagnosticsBlock(parts, title, fn)`: roda `fn()` em `try/catch` **isolado**; em sucesso anexa linha em branco + título + conteúdo (saída idêntica à esperada quando não há erro); em falha anexa `[ERRO NO BLOCO DE DIAGNÓSTICO]` + stack, registrando claramente **qual bloco** falhou. O relatório rico passa a ser anexado por esse helper.
- **falha de bloco não derruba mais nada.** Um erro no relatório rico não impede: abertura do painel (`.show`), coleta do núcleo, cópia do diagnóstico nem `smokeTest`. Não gera `diagnosticFallback:true` — esse marcador permanece apenas como proteção extrema (app não carregado).
- **lint/CI.** Projeto sem `package.json`/ESLint/pipeline: nenhuma infraestrutura pesada criada. Registrada recomendação como **checklist técnico** em comentário acima de `buildDiagnosticsText()`: antes de aprovar alterações nessa função, verificar uso de `const`/`let` antes da declaração (TDZ); habilitar `no-use-before-define` quando houver pipeline.
- **preserve.** `buildDiagnosticsText()` permanece monolítico e com conteúdo textual inalterado; nenhuma alteração em Layers, Trocar imagem, Reset, Modo Câmera, Modo Ativos, Preview, Export, ProjectWorld, JSON, alfa/scrim, timeline, frames, assets, Settings, layout/cores/textos/ícones/espaçamentos/UX. Sem reformatação do arquivo.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b31T`.

## v8z4b31S

**Debug Core Restore — Diagnóstico real como módulo protegido (sem fallback).** Correção de auditoria/restauração focada exclusivamente no sistema de Diagnóstico. Base: `v8z4b31R`.

- **causa encontrada.** A v31R abria o painel mas exibia `diagnosticFallback: true`. Investigando v31N→v31R: o coletor real `buildDiagnosticsText()` lançava `ReferenceError: Cannot access '_k_isAssetsMode' before initialization` (TDZ) — o bloco de diagnóstico inserido na v31O (`═══ v8z4b31O — Shared Camera/Assets Frame Timeline ═══`) usava `_k_isAssetsMode` e `_k_highlightIdx` **antes** de suas declarações `const` originais, mais abaixo na mesma função. A v31R envolveu o coletor monolítico em um único `try/catch` tudo-ou-nada (`getDiagnosticsTextHard()`): qualquer throw descartava o diagnóstico inteiro e devolvia o objeto de emergência `diagnosticFallback:true`.
- **regressão de rota.** Em v31O o `onclick` do item "Diagnóstico" trocou da rota direta `openDiagnosticsPanel()` para `handleDiagnosticsMenuClick()` com lista de nomes prováveis (`openDiagnosticsPanel`/`openDiagnosticPanel`/`showDiagnosticsPanel`/`openPanel('Diagnostics')`); v31R adicionou painel/fallback sem restaurar o coletor real como rota direta.
- **arquivo/trecho afetado.** `index.html` — `buildDiagnosticsText()` (TDZ) e `getDiagnosticsTextHard()`/`handleDiagnosticsMenuClick()`/`openDiagnosticsPanelHard()` (rota frágil).
- **fix — TDZ.** `_k_isAssetsMode` e `_k_highlightIdx` passam a ser declarados uma única vez no topo do bloco v31O; as declarações originais viraram comentário. `buildDiagnosticsText()` volta a rodar inteiro.
- **fix — módulo protegido.** Restaurado/consolidado `window.AppDebug.{collect,open,copy,smokeTest}`. `collect()` monta um núcleo real campo-a-campo (app, version, timestamp, userAgent, viewport, devicePixelRatio, modo, frames, frame ativo, assets, asset selecionado, Preview, Export/WebCodecs, flags renderer/world) com proteção **individual** por campo, sempre inclui `smokeTest({fallback:false})` e anexa o relatório rico `buildDiagnosticsText()` de forma **isolada** (uma falha do relatório não apaga o núcleo). `open()` abre o painel real `#diagnosticsPanel`/`#diagText` sem depender de `currentMode`/`activePanel`, sem `closeAll()` e sem overlay, fechando apenas o Settings. O botão chama somente `window.AppDebug.open()`.
- **por que v31R caiu em fallback / por que v31S não cai.** v31R: `try/catch` tudo-ou-nada sobre o coletor que lançava TDZ. v31S: TDZ corrigido + coleta resiliente campo-a-campo; `diagnosticFallback:true` permanece apenas como proteção extrema marcada (app não carregado), que não ocorre com o app carregado.
- **validação (Chromium headless, viewport iPhone).** Painel abre pelo menu, texto real aparece, **sem** `diagnosticFallback:true`, copia, fecha, reabre; abre no Modo Câmera e no Modo Ativos; abre durante/depois do Preview; `smokeTest()` com todos os campos `true` e `fallback:false`; 0 erros de página.
- **preserve.** Sem alterações em alfa/scrim, timeline, frames, espessura de frames, assets, Layers, Trocar imagem, botões de modo, Settings, Modo Câmera/Ativos, Preview, Export, JSON, layout/cores/textos/ícones.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b31S`.

## v8z4b31O

- Unifica o comportamento de frames e menu de frames entre Modo Câmera e Modo Ativos.
- No Modo Ativos, frames agora espelham o Modo Câmera, mudando apenas cor de destaque e bloqueio de edição.
- Corrige destaque do frame central da timeline no Modo Ativos.
- Corrige sincronização entre chip central, frame destacado no Stage e cutout do alfa.
- Reforça legibilidade dos frames não selecionados nos modos Câmera e Ativos.
- Preserva alfa viewport-fixed, bolinhas centrais, Preview, Export, JSON e ProjectWorld.

# v8z4b31H
## v8z4b31N

- Corrige estruturalmente o alfa/scrim do editor.
- Move o alfa para uma camada fixa de viewport, fora do `stageContent` transformado.
- Impede que o alfa se mova junto com pan/zoom do Stage.
- Mantém apenas o cutout do frame ativo recalculado em screen-space.
- Preserva frames, curvas, números e HUD acima do alfa por z-index de overlay.
- Mantém assets abaixo do alfa.
- Preserva Preview, Export, JSON, ProjectWorld e bolinhas centrais da timeline sem alterações.

## v8z4b31M

- Corrige o alfa/scrim global do editor para cobrir todo o viewport visível, sem ficar preso ao slot central.
- Garante que o alfa fique acima de todos os assets e abaixo dos frames/curvas.
- Reempilha o alfa após redraw, decode assíncrono, reorder de assets, pan, zoom e troca de modo.
- Corrige regressão nas bolinhas laranjas centrais da timeline.
- Bolinhas da timeline agora usam o centro real do chip/frame ativo.
- Preserva Preview, Export, JSON, ProjectWorld e comportamento de edição sem alterações.


**Film Alpha Scrim Restoration.** Bug fix visual/arquitetural controlado sobre `v8z4b31G`: restaura o alfa/scrim externo de filmagem como overlay editor-only do sistema único, acima de assets/imagens e abaixo de frames/curvas/HUD, com recorte no frame canônico/ativo e sem afetar Preview/Export.

- **fix — scrim único com recorte.** `#stageDimSvg` volta a desenhar o scrim de filmagem nos dois modos, usando o frame canônico como janela clara e respeitando rotação, pan e zoom.
- **fix — legibilidade sem glow.** Frames não ativos preservam opacidade/espessura mínimas; o glow roxo do frame ativo no Modo Ativos foi reduzido para não substituir o alfa/scrim.
- **preserve.** Modo Frames segue editável/ciano; Modo Ativos segue referência roxa não editável; curvas ficam acima do scrim; assets/layers e Frente/Trás não afetam scrim/frames/curvas; Preview/Export continuam sem overlays de editor.
- **diagnóstico.** Nova seção `═══ v8z4b31H — Film Alpha Scrim Restoration ═══` com arquitetura, camadas, recorte, modos, glow/sombra, legibilidade, curvas e Preview/Export.
- `index.html`: comentário do topo, `APP_VERSION` e `APP_VERSION_NAME` atualizados para `v8z4b31H`.

# v8z4b31F

**Single Film System Architecture.** Correção arquitetural controlada. Aprofunda a unificação iniciada em `v8z4b31E`: agora **seleção, timeline (bolinha/mira) e localização** também são um **único sistema compartilhado** entre **Modo Frames/Câmera** e **Modo Ativos/Mundo**. Não é nova função, não é ajuste cosmético isolado, não corrige o Modo Ativos "à parte". Regra-mãe: o Modo Ativos passa a **consumir o mesmo sistema** do Modo Frames, mudando apenas `presentationMode`, `stylePreset` e `editability`. Não altera Preview, Export, WebCodecs, save/load, schema, upload, múltiplos assets, Frente/Trás, undo/redo, menu "+", layout, textos ou ícones. **Base `v8z4b31E`.**

- **fix — seleção canônica única (seção 2, critério 2/6).** Existe agora **uma única** resposta para "qual frame está selecionado?". Estado canônico `filmSelection = {frameIndex, segmentIndex, source, updatedAt}` com ponto de escrita único `commitFilmSelection()`. `activeIdx`/`selectedSegmentIndex` são o armazenamento canônico (já compartilhado entre modos e não redefinido na troca). `locateAssetsModeFrameRef()`/`locateAssetsModeSegmentRef()` passaram a **gravar o frame canônico** em vez de criar um índice de referência paralelo — selecionar Frame N no Modo Ativos mantém Frame N ao voltar ao Modo Câmera (e vice-versa). Os índices `timelineVisualActiveIndex`/`timelineReferenceActiveIndex`/`timelineEditingActiveIndex`/`temporaryFrameReferenceTargetIndex`/`assetsModeFrameReferenceHighlightIndex`/`frameTimelineCenteredIndex`/`rendererFrameIndex`/`viewportLocalizationTargetIndex` agora **derivam** do canônico e não disputam mais a seleção. `getTimelineVisualActiveIndex()` retorna o frame canônico.
- **fix — timeline única com mira fixa (seção 3, critério 4/5).** `syncLowerTimelineCenterMarkers()` fixa a bolinha/indicador no **centro do viewport** da timeline (mira fixa); ela **não pertence mais ao conteúdo rolável** e não acompanha o frame focal. Os frames rolam **por baixo** dela; ao selecionar um frame, o conteúdo rola até o frame ficar sob a mira (`centerLowerTimelineOnFrame`). Comportamento idêntico em todos os modos.
- **fix — opacidade/espessura uniformes no Modo Ativos (seção 7, critério 10/11).** `applyStageTimelineFocusVisuals()` deixou de aplicar a hierarquia de opacidade/espessura/zIndex/borda do Modo Câmera quando em Modo Ativos: limpa estilos inline e deixa o **CSS uniforme (.40 + destaque roxo)** governar. Assim a opacidade/espessura dos frames **não selecionados não muda mais** conforme a origem do clique (ícone/timeline/stage/localização) — `assetsReferenceStyleActivationSourceAgnostic: true`.
- **preserve (seções 4/5/8/12).** Geometria única de frame (`getFilmFrameGeometry`) e path único de curva (`getFilmSegmentPathD`) do `v8z4b31E` mantidos. Frames não editáveis no Modo Ativos (handles/HUD/menu suprimidos), assets editáveis. Roxo no Modo Ativos, ciano no Modo Câmera. Preview/Export sem overlays de editor.
- **diagnóstico.** Nova seção `═══ v8z4b31F — Single Film System Architecture ═══` com Arquitetura, Seleção, Timeline, Style, Geometry, Interactivity, References, Localization e Preview/Export — incluindo `allFrameTargetsMatchCanonical`, `frameTargetMismatchDetected`, `modeSwitchPreservesCanonicalFrame`, `timelineCenterMarkerIsFixedOverlay`, `timelineCenterMarkerInsideScrollableContent`, `assetsModeInactiveFrameOpacityUniform`.
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e versão visível atualizados para `v8z4b31F`.

# v8z4b31E

**Unified Film Overlay System.** Correção arquitetural + ajuste visual controlado. Elimina o paralelismo entre o sistema visual de frames/curvas do **Modo Câmera/Frames** e o sistema visual de referências do **Modo Ativos/Mundo**. Não é nova função. Não altera layout, textos, ícones, menu "+", upload, save/load, preview, export, WebCodecs, ProjectWorld, assets/layers, zIndex de assets, motor de vídeo nem o cálculo final de câmera/render. **Base `v8z4b31D`.**

- **fix — sistema único de geometria/render (itens 1–3).** Passa a existir **um único** sistema base. **Fonte única de geometria de frame:** `getFilmFrameGeometry(i)` delega para `getFrameScreenGeometry` (cantos rotacionados + centro real em screen coords via ProjectWorld→screen) — usada por retângulo, ponto central, handles, HUD/chips, número/label e pelos pontos de conexão de curva, em qualquer modo. **Fonte única de path de curva:** `getFilmSegmentPathD(seg, ptStage, aCenter, bCenter)` usa os mesmos centros, os mesmos handles reais (`getSegmentCurvePuller`/`getCurvesV2CubicCP`) e a mesma matemática (cúbica C / quadrática Q) de `drawBezier()`. **Dispatch único:** `renderFilmOverlay({mode, showFrames, showCurves, stylePreset, editable})` — o que muda entre modos é só estilo/interatividade. `renderAssetsModeReferenceCurves()` foi refatorada para usar essas fontes únicas.
- **fix — centro do frame (critério 1/2).** O centro da curva/ponto central passa a ser `getFilmFrameGeometry().center`, exatamente o centro visual do retângulo rotacionado, em qualquer modo/zoom/pan/rotação/slot. Diagnóstico ao vivo `frameCenterDeltaFromRectCenterPx ≈ 0`, `frameCenterMatchesRotatedRectCenter: true`.
- **fix — curva igual entre modos (critério 3/4).** A curva do Modo Ativos passa pelo **mesmo caminho visual** da curva do Modo Câmera (mesmo `getFilmSegmentPathD`); só o estilo difere: **branco/cinza**, trecho selecionado branco mais forte/espesso, **nunca roxo/ciano**. `assetsModeCurveUsesRealCameraPath: true`, `assetsModeCurvesUseAccentColor: false`.
- **fix — contaminação visual entre modos (item 5, critério 5/6).** Isolamento explícito de `cameraModeVisualizationState` × `assetsModeReferenceVisualizationState`. O dim/overlay de edição do Modo Câmera (`#stageDimSvg`) é limpo ao entrar no Modo Ativos e **não escurece mais a imagem**; o Modo Ativos usa **apenas seu próprio scrim**. Ao voltar para Câmera, a visualização própria (dim/handles/HUD/curva editável) é restaurada sem depender de clique. `cameraDimOverlayClearedOnEnterAssets: true`, `visualModeContaminationDetected: false`.
- **fix — legibilidade (item 6, critério 7/8).** **Modo Câmera:** borda do frame ativo **4.0** (era 3.5), frames não ativos **0.78/0.88** (eram 0.62/0.80), `distant` **0.72** (era 0.55) — frame ativo ciano dominante. **Modo Ativos:** frames não selecionados **0.40** (era 0.28), borda do selecionado **2.5px**, mantendo o roxo dominante. Não altera Preview/Export.
- **preserve (itens 7–11).** Lógica de seleção **não** refatorada — `activeFrameIndex`/`selectedSegmentIndex` preservados e lidos pelo renderer base em qualquer modo. Toggle binário do ícone Ativos (ON mostra tudo / OFF limpa frames+números+curvas+scrim sem resíduo). Camadas: overlay de editor sempre acima dos assets, fora da pilha de assets, Frente/Trás não afeta frames/curvas. Preview/Export sem overlays de editor (`previewExcludesFilmOverlay`/`exportExcludesFilmOverlay`).
- **diagnóstico.** Nova seção `═══ v8z4b31E — Unified Film Overlay System ═══` com Arquitetura, Frame geometry, Curve geometry, Mode visual isolation, Legibility, Toggle, Selection, Localization, Layers e Preview/Export.
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e versão visível atualizados para `v8z4b31E`.

# v8z4b31A

Correção **focada** dos três bugs restantes da v8z4b30ZZ. Sem alterar layout, cores, textos, ícones, fluxo, preview/export ou funcionalidades não relacionadas.

- **fix — curvas/trechos atrás dos assets no Modo Câmera (item 1).** No Modo Câmera o `#bezierSvg` (curvas/trechos editáveis) ficava em `z-index:8`, enquanto os assets posicionados recebem `z-index 1..N` (`renderProjectWorldExtraImages`); em projetos com várias imagens isso jogava as **curvas atrás das imagens** (`curveOverlayLayerAboveAssets:false`, `curvesBehindAssetsDetected:true`). Agora há uma banda de câmera no editor: os assets são limitados a `CAMERA_ASSET_BAND_MAX=15` e a curva sobe para `CAMERA_CURVE_LAYER_Z=18` — **SEMPRE acima de qualquer asset** e abaixo da banda de frames (20–30), mesma lógica de camada absoluta superior dos frames. `setEditorMode()` reconstrói/redesenha a camada de curvas imediatamente na troca de modo (`curveOverlayRebuiltOnModeChange` / `curveOverlayRedrawnAfterModeChange`). O diagnóstico de camada passa a ler o **z-index REAL no DOM** dos assets (`imgEl` + `.world-extra-img`), não a propriedade lógica `asset.zIndex`. Resultado esperado: `curveOverlayLayerAboveAssets:true`, `curveOverlayIsOutsideAssetLayerStack:true`, `curveOverlayAffectedByAssetZIndex:false`, `curvesBehindAssetsDetected:false`.
- **fix — localização/destaque do frame/trecho no Modo Ativos (item 2).** Clicar em frame/trecho no painel inferior já localizava o viewport, mas o item ficava **ambíguo** no Stage. O frame/trecho de referência passa a **opacidade total** (era 0.55), com contorno e brilho **roxos fortes** e número branco sobre roxo — destaque inequívoco. Novos diagnósticos de sincronia painel/timeline/Stage: `assetsModeSelectedReferenceHighlightVisible`, `assetsModeSelectedReferenceHighlightIndex`, `assetsModePanelLabelMatchesReference`, `assetsModeTimelineMatchesReference`, `assetsModeStageMatchesReference`, `assetsModeReferenceSyncConsistent`.
- **fix — Redo após deletar asset/imagem (item 4).** `deleteSelectedAsset()` capturava o snapshot de Undo via `cloneProjectStateSnapshot(captureState())`, que **removia `assets[]`** do estado — o ciclo Delete → Undo → Redo não restaurava/re-excluía o asset corretamente. Agora captura o snapshot **completo** (`captureState()`, com `assets[]`/`projectWorld`/`imageSnapshot`); `restoreState()` restaura os assets com todas as propriedades (id, source, sourceW/H, worldX/Y, worldW/H, zIndex, slotRow/Col, fitMode, visible). `redo()` ganha diagnóstico dedicado: `lastAssetRedoAction`, `lastAssetRedoneId`, `assetRedoVisualUpdateRan`, `projectWorldCompositeInvalidatedAfterAssetRedo`, `stageRedrawnAfterAssetRedo`, `redoDeletedAssetExistsAfterRedo`, `redoStackConsumedAfterAssetRedo`, `undoStackUpdatedAfterAssetRedo`, `assetRedoChangedOnlyAssets`. `.world-extra-img` passa a ter `data-asset-id`.
- **Preserve / NÃO altera:** item 3 (referências persistentes no Modo Ativos — só o ícone Ativos liga/desliga; toque no Stage/asset, seleção, pan/zoom e clique no painel não desligam), `frameOverlayLayerAboveAssets:true`/`framesBehindAssetsDetected:false`, backdrop/scrim de contraste, exclusão de referências do preview/export, world renderer em preview/export, motor de Preview/Export/Save/Load, `ProjectWorld`, frames, curvas, easing, interpolação, render final, layout, cores, textos, ícones, fluxo aprovado, menu de frame só no Modo Câmera, Modo Ativos sem handles/ghost handles. Engasgo observado no fim do Preview de projeto pesado **não** tratado como bug nesta versão (apenas diagnóstico observacional). `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e versão visível atualizados para `v8z4b31A`. **Base `v8z4b30ZZ`.**

# v8z4b30ZZ

Correção arquitetural da relação **assets ↔ câmera**. Princípio: **frames, contornos, números, trechos e curvas são camada ABSOLUTA de câmera/editor** e nunca entram na pilha de assets nem são afetados por `asset.zIndex` ou por Frente/Trás. Assets continuam sendo os únicos elementos afetados por layers/Frente-Trás/delete/undo/seleção roxa.

- **fix — banda de z-index dedicada (item 1).** Dentro de `#stageContent`, camadas separadas: assets `1..N` (baixo), scrim de referência `FRAME_REF_SCRIM_Z=990`, contorno roxo de seleção de asset `ASSET_SELECT_OUTLINE_Z=992`, curvas/trechos de referência `FRAME_REF_CURVE_Z=994`, frames de referência `FRAME_REFERENCE_LAYER_Z=1000`. No Modo Ativos, os frames de referência passam a usar `FRAME_REFERENCE_LAYER_Z` (antes `z-index=''`, que os jogava **atrás** dos assets posicionados). Diagnóstico: `frameOverlayLayerAboveAssets`, `curveOverlayLayerAboveAssets`, `frameOverlayIsOutsideAssetLayerStack`, `framesBehindAssetsDetected`, `curvesBehindAssetsDetected`, `maxAssetZIndex`.
- **fix — rebuild imediato na troca de modo (item 1).** `setEditorMode('camera')` chama `renderAll()` + `refreshEditorViewVisualOverlays()` imediatamente: os frames voltam a aparecer **acima** da imagem ao entrar no Modo Câmera, **sem precisar clicar** (corrige "frames atrás dos assets até o clique"). `frameOverlayRebuiltOnModeChange` / `frameOverlayRedrawnAfterModeChange`.
- **fix — referências persistentes (item 2).** `setSelectedAsset()` e o toque no Stage **não desligam mais** as referências de frames/trechos/curvas; a visibilidade só alterna pelo **ícone do Modo Ativos**. `assetsModeReferencesPersistent`, `assetsModeReferencesToggleOnlyByModeButton`, `assetsModeReferencesDismissedByStageTap=false`, `assetsModeReferencesDismissedByAssetTap=false`, `assetsModeReferencesStillVisibleAfterAssetSelection/Transform`.
- **fix — ícone do Modo Ativos mostra referências de verdade (item 3).** `toggleWorldModeFrames()` renderiza a camada **imediatamente** (`renderAll()` + curvas + scrim + frame de referência padrão = frame ativo), sem depender de clique posterior na timeline. `assetsModeIconToggleReferencesVisibleOnStage`, `assetsModeIconToggleToastMatchesVisualState`, `assetsModeIconToggleTriggeredRedraw`, `assetsModeIconToggleReferenceLayerRebuilt`.
- **feat — trechos/curvas como referência (item 4).** Novo SVG dedicado `#assetsModeRefCurveSvg` desenha o **caminho de filmagem** (linhas entre centros de frames via `editorWorldToStage`) e destaca o **trecho selecionado** + os dois frames envolvidos, **sem handles e sem edição**. A ease-pill (trecho), no Modo Ativos, chama `locateAssetsModeSegmentRef()`. Diagnóstico: `assetsModeFilmPathReferencesVisible`, `assetsModeFrameReferencesVisible`, `assetsModeCurveReferencesVisible`, `assetsModeSelectedSegment*`, `assetsModeCurveReferenceIsEditable=false`, `assetsModeCurveReferenceHandlesVisible=false`.
- **fix — scrim de contraste (item 5).** Scrim `rgba(0,0,0,0.28)` na banda de câmera: **acima dos assets, abaixo dos frames/curvas**; editor-only. `assetsModeReferenceBackdropAboveAssets`, `assetsModeReferenceBackdropBelowFrames`, `assetsModeReferenceContrastSufficient`, `assetsModeReferenceScrim(Preview|Export)Excluded`.
- **feat — localizar item no Stage (item 6).** Clique em frame/trecho no painel faz **panorâmica suave** do viewport (`localizeStageToFrame` / `localizeStageToSegment`) até o item, mantendo o Modo Ativos e sem ativar edição. `assetsModePanelClickLocalizesStage`, `assetsModeSelectedFrameViewportLocalized`, `assetsModeSelectedSegmentViewportLocalized`, `assetsModeViewportLocalization*`.
- **fix — timeline compartilhada (item 7/8).** O Modo Ativos reutiliza `centerLowerTimelineOnFrame(smooth=true)` — **mesma animação** suave do Modo Câmera, sem jump; removida a centralização instantânea/duplicada. Destaque único garantido (`timelineActiveHighlightCount`, `timelineMultipleActiveHighlightsDetected`, `assetsModeOnlyOneFrameReferenceHighlighted`).
- **fix — info do frame ativo no Modo Câmera (item 9).** Diagnóstico `frameActiveInfoTextVisible/FrameIndex/UsesAnchoredGeometry/SuppressedReason` (HUD mantido pela leitura ao vivo do `#frameHud.show`).
- **fix — preview/export sem referências (item 12).** `body.previewing`/`body.recording` ocultam `#assetsModeFrameRefBackdrop`, `#assetsModeRefCurveSvg` e os `.frame` de referência no Modo Ativos — a UI de editor não vaza para Play/Preview/MP4 (que são render de canvas separado). `previewExcludesEditorFrameReferences`, `exportExcludesEditorFrameReferences`, etc.
- **diagnóstico consolidado.** Bloco `v8z4b30ZZ` no painel Diagnóstico com todos os campos dos itens 1–12.
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e versão visível atualizados para `v8z4b30ZZ`.
- **Preserve / NÃO altera:** motor de Preview/Export/Save/Load, `ProjectWorld`, frames, curvas, easing, interpolação, render final, layout, cores, textos, ícones, fluxo aprovado, menu contextual de frames no Modo Câmera, seleção de assets, Frente/Trás (só assets). Sem painel novo de layers e sem movimentação avançada de ativos. **Base `v8z4b30ZY`.**

# v8z4b30ZR

- **fix — troca real e instrumentada de modo.** `setEditorMode(mode, source)` continua sendo a única fonte de verdade, agora **totalmente instrumentada**: cada chamada preenche `lastModeButtonTapped`, `lastModeRequested`, `lastModeApplied`, `lastModeChangeSource`, `lastModeChangeTimestamp`, `setModeCallCount`, `setModeLastBlockedReason` e `setModeLastError`. Toda transição é verificável no diagnóstico (origem da troca, sucesso/bloqueio/erro).
- **fix — botões de modo.** O botão **Câmera** (`handleCameraModeBtn`) chama obrigatoriamente `setMode('camera', 'topModeButtonCamera')` (e só então cicla a visualização se já estava em câmera); o botão **Ativos** (`handleAssetsModeBtn`) chama obrigatoriamente `setMode('assets', 'topModeButtonAssets')`. Nenhum botão altera o modo apenas visualmente.
- **feat — limpeza de seleção ao entrar em Ativos.** Ao entrar no Modo Ativos, a seleção de frame e de trecho/segmento no Stage é limpa; diagnóstico `frameSelectionClearedOnEnterAssets` e `segmentSelectionClearedOnEnterAssets`.
- **feat — consistência visual.** `isModeStateConsistent()` agora também valida o estado **visual** dos botões e toolbars; novos `isModeButtonVisualStateConsistent()` / `isToolbarVisualStateConsistent()` e diagnósticos `modeButtonVisualStateConsistent` / `toolbarVisualStateConsistent`.
- **fix — barra superior em três duplas fixas.** Reorganizada em `.top-left-group` (Câmera + Ativos), `.top-center-group` (Settings/Arquivos + Play) e `.top-right-group` (Undo + Redo), com `grid-template-columns: 1fr auto 1fr` para manter a dupla central **realmente centralizada** independentemente da largura das pontas. Trocar de modo não move os ícones.
- **fix — zoom/world-view dinâmico.** `editorMinZoomMode` volta a `dynamic` (com `worldViewBounds*`, `fitAllWorldZoom` e `canViewAllSlotsAtMinZoom: true`) sempre que o `ProjectWorld` está inicializado (`isProjectWorldReady()`), não apenas em multi-imagem. Afeta **apenas** navegação/edição do editor.
- **feat — diagnóstico.** Adicionado `showFrameReferencesInAssetsMode` e todos os campos de transição de modo listados acima.
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e versão visível atualizados para `v8z4b30ZR`.
- **Preserve / NÃO altera:** motor de Preview/Export/Save/Load, `ProjectWorld`, frames, curvas, easing, interpolação, render, timeline, cores (roxo do Modo Ativos / ciano do Modo Câmera), seleção de assets, Frente/Trás, Trocar/Excluir. **Base `v8z4b30ZQ`.**

# v8z4b30ZQ

- **fix — roteador central de modo.** `setEditorMode(mode)` passa a ser a **única fonte de verdade** para alternar entre **Modo Câmera/Frames** e **Modo Ativos/Mundo**, e agora **SEMPRE** re-sincroniza `bottomContextMode`/UI (não só quando o modo muda). Isso elimina o estado preso `activeMode: camera` + `selectedImageAssetId` definido: Modo Ativos força `bottomContext = 'asset'`, Modo Câmera força `bottomContext = 'frame'`.
- **feat — `setMode`.** Adicionado alias `setMode('camera')` / `setMode('assets')` no padrão pedido, delegando para `setEditorMode`. Nenhum botão/pill/toolbar altera o modo fora do roteador central.
- **fix — Frente/Trás.** `getAssetZOrderInfo()` vira a **fonte única** de habilitação de Frente/Trás (botões e diagnóstico), avaliando o **modo ativo** e a **posição do asset na pilha**. Motivos corretos: `'asset já está no topo'`, `'asset já está no fundo'`, `'apenas 1 asset — sem outra camada'`, `'nenhum asset selecionado'`; `'não está em Modo Ativos'` só quando `activeMode` é realmente câmera. Com 2 assets e asset selecionado em Modo Ativos, Frente/Trás não ficam mais desabilitados por "não está em Modo Ativos".
- **feat — consistência.** `isModeStateConsistent()` detecta combinações contraditórias (`assets`+`frame`, `camera`+`asset`) e alimenta `modeStateConsistent` no diagnóstico.
- **fix — diagnóstico.** Campos expandidos: `activeMode`, `bottomContextMode`, `toolbarContext`, `selectedImageAssetId`, `selectedAssetId`, `activeFrameIndex`, `topModeButtonActive`, `cameraModeButtonActive`, `assetModeButtonActive`, `assetToolbarVisible`, `frameToolbarVisible`, `assetForward.enabled` + `assetForward.disableReason`, `assetBackward.enabled` + `assetBackward.disableReason`, `modeStateConsistent`.
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e versão visível atualizados para `v8z4b30ZQ`.
- **Preserve / NÃO altera:** motor de Preview/Export/Save/Load, `ProjectWorld`, frames, curvas, easing, timeline, cores (roxo do Modo Ativos / ciano do Modo Câmera), layout, seleção de assets, Trocar/Excluir. **Base `v8z4b30ZP`.**

# v8z4b30ZK

- **feat:** cria a alternância inicial entre **Modo Câmera** (Câmera/Frames/Filmagem) e **Modo Ativos** (Ativos/Mundo/Imagens).
- **feat:** o Modo Ativos permite selecionar imagens/assets **diretamente no Stage** (toque), sem botão "Selecionar" separado.
- **feat:** os frames ficam visíveis como **referência** no Modo Ativos (mais discretos/transparentes), porém **sem edição**.
- **safe:** Preview da 30ZI, Export, Save/Load, ProjectWorld, frames e curvas preservados.
- **prep:** base criada para o futuro menu contextual de ativos, layers, botão **+** e edição de assets.
- **Base aprovada `v8z4b30ZI`** (Preview sem tranco). Reaproveitada apenas a **lógica segura de seleção de assets** da 30ZJ.
- **cleanup — 30ZJ.** Removido o botão **"Selecionar"** indevido (inserido na 30ZJ fora do layout aprovado). Nenhum botão novo criado sem autorização; a alternância de modos vive no **topo**.
- **feat — estado global.** `editorMode` (`'camera'` | `'assets'`), padrão `'camera'` para preservar o fluxo atual; helpers `setEditorMode(mode)`, `isCameraMode()`, `isAssetsMode()`, `syncEditorModeUI()`. Classe `body.editor-assets` sincroniza o dimming dos frames e o destaque dos ícones do topo.
- **feat — topo.** Ícone de **câmera** ativa `editorMode='camera'` (cor ciano/verde atual); ícone de **imagem** ativa `editorMode='assets'` (cor **roxa**). Sem novos menus.
- **feat — Modo Câmera.** Preserva integralmente o comportamento atual: frames editáveis, curvas, handles, timeline e menu inferior atuais; Preview 30ZI preservado.
- **feat — Modo Ativos.** Frames continuam desenhados como **referência**, mais discretos e **sem captura de toque** (handles/curvas não respondem). Tocar no Stage faz hit-test (screen → stage → world via `editorStageToWorld`), seleciona o asset de **maior zIndex** (fallback: último desenhado), troca a seleção ao tocar em outro asset e limpa ao tocar no vazio; ignora assets vazios/não carregados; pinch/zoom de dois dedos preservado.
- **feat — realce.** Contorno discreto do asset selecionado na **cor do Modo Ativos (roxo)**, overlay DOM `#assetSelectOutline` **apenas no editor**: nunca no Preview, nunca no Export, **não salvo** no JSON.
- **feat — barra contextual inferior (preparada).** No Modo Ativos, `#assetsContextBar` mostra o **estado geral dos ativos** ou o **nome do asset selecionado** ("Imagem 1"…). Sem funções avançadas nesta versão.
- **feat — Layers.** Mantido o painel básico de Layers (miniaturas + seleção por toque) reaproveitado da base de seleção; sem reorder/lock/hide/apagar.
- **state.** `selectedAssetId` mantido **apenas em memória**; ao carregar projeto volta a `null` e o editor retorna ao Modo Câmera.
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e versão visível atualizados para `v8z4b30ZK`.
- **Preserve / NÃO altera:** motor aprovado de Preview da 30ZI; Export; Save/Load; `ProjectWorld`; `framesAbs`/`framesNorm`; curvas; easing; timeline. **Sem** mover/escalar/rotacionar assets; **sem** crop/moldura/texto/GIF/stickers/efeitos temporais.

# v8z4b30ZJ

- **feat:** adiciona modo **Selecionar** para assets/layers no ProjectWorld.
- **feat:** assets podem ser selecionados no Stage (hit-test) e em painel básico de **Layers**.
- **fix:** **Trocar imagem** passa a substituir o **asset selecionado**, sem depender de slot/setor.
- **safe:** slots/setores continuam apenas como presets de inserção.
- **safe:** Preview da 30ZI, Export, Save/Load, ProjectWorld, frames e curvas preservados.
- **prep:** estrutura preparada para crop/moldura futura (`asset.crop`/`asset.frameStyle`, `enabled:false`) sem alterar o render atual.
- **Base `v8z4b30ZI`** (Preview sem tranco e troca de imagens aprovados — tratada como base confiável).
- **Conceito.** Frames animam a câmera; assets/layers compõem o mundo; slots/setores são apenas presets de inserção; trocar imagem age sobre o **asset selecionado**, não sobre o setor; asset é tratado como caixa visual futura (preparada para moldura/crop), **sem** implementar crop/moldura nesta versão.
- **feat — estado global de seleção.** `selectedAssetId` (null | string) + `getSelectedAsset()`, `setSelectedAsset(id)`, `clearSelectedAsset()`. Modo de ferramenta `toolMode` (`'camera'` | `'asset-select'`), com `setToolMode`/`enterAssetSelectMode`/`exitAssetSelectMode`/`toggleAssetSelectMode`.
- **feat — ferramenta Selecionar.** Item de menu "Selecionar" (ícone cursor `#i-mouse-pointer`) que entra/sai de `asset-select`; item "Layers" abre o painel. Layout geral inalterado.
- **feat — seleção no Stage.** Em `asset-select`, um toque no Stage faz hit-test (screen → stage → world via `editorStageToWorld`), seleciona o asset de **maior zIndex** sob o ponto (fallback: ordem do array). Frames, handles e curvas **não** capturam o toque (listener em fase de captura + `stopImmediatePropagation`); pinch/zoom de dois dedos preservado; área vazia limpa a seleção. Assets sem imagem carregada e slots vazios não são selecionáveis.
- **feat — realce visual.** Contorno discreto (overlay DOM `#assetSelectOutline` em `#stageContent`) do asset selecionado, **apenas no editor**; nunca no Preview/Export (que usam canvas). Sem handles de mover/escalar/rotacionar, sem crop/moldura.
- **feat — painel de Layers.** Lista simples com miniatura, nome automático ("Imagem 1/2/3"), seleção por toque e destaque do item selecionado. Sem reorder/lock/hide/show/renomear/apagar/mover/crop.
- **fix — Trocar imagem.** Usa `selectedAssetId`: substitui apenas o asset selecionado, preservando `id`/`worldX`/`worldY`/centro visual/caixa atual/`zIndex` e campos futuros (`crop`/`frameStyle`). `doReplaceExtraAsset` passa a preservar o **centro visual atual** (não recentraliza no setor), permitindo trocar asset fora do slot original. Sem asset selecionado e com várias imagens: aviso discreto "Selecione uma imagem para trocar." + abre o painel de Layers; **sem** troca automática por slot.
- **safe — Inserir imagem.** Mantém o fluxo por slot/preset (apenas posição inicial), cria asset livre e seleciona automaticamente o novo asset.
- **prep — crop/moldura.** Defaults não destrutivos `asset.crop = { enabled:false, x:0, y:0, w:1, h:1 }` e `asset.frameStyle = { enabled:false, strokeColor:'#ffffff', strokeWidth:0, radius:0, padding:0, shadow:false }` aplicados na inserção, no load e ao selecionar; com `enabled:false` **não** alteram aparência/Preview/Export.
- **Save/Load.** `selectedAssetId` mantido **apenas em memória** (não salvo no JSON). Projetos antigos sem `crop`/`frameStyle`/`zIndex` carregam normalmente; projetos da 30ZI abrem iguais.
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível atualizados para `v8z4b30ZJ`.
- **Preserve / NÃO altera:** motor de Preview aprovado na 30ZI; Export; Save/Load estrutural além dos defaults seguros; `ProjectWorld`; `framesAbs`/`framesNorm`; curvas; easing; rotação de frames; timeline; layout geral; cores; textos e ícones já aprovados (exceto o novo ícone/ferramenta Selecionar).

# v8z4b30ZH

- **fix:** Preview usa avanço temporal limitado para evitar salto visual por delta alto de `requestAnimationFrame`.
- **fix:** reduz `rotation-delta-spike` no Preview entre segmentos, especialmente entre Frame 3 e Frame 4.
- **safe:** Export, Save/Load, ProjectWorld, JSON, frames, curvas e múltiplos assets preservados sem alteração.
- **Base `v8z4b30ZG`** (preserva a correção de reabertura visual/round-trip: ProjectWorld salvo preservado durante o load e primeiro render aguardando Stage válido — **não** alterada).
- **Problema.** No Preview em tempo real ocorria um engasgo/pulinho na transição **Frame 3 → Frame 4**, diagnosticado anteriormente como `jumpType: rotation-delta-spike`, `jumpSegmentIndex: 2`, presente **só no Preview** (o Export está correto). Causa: o Preview derivava `t` diretamente do tempo real bruto (`ts - animStart`); em iPhone/Safari uma queda de frame / troca de aba / travada produz um `deltaTime` grande de uma vez, fazendo o tempo visual atravessar um trecho crítico num único passo e gerando um delta de rotação alto entre dois frames exibidos. Warm-up/cache superficial (30ZD) não resolveu.
- **Correção (apenas Preview/playback em tempo real).** Separação explícita entre o **tempo real bruto** do `requestAnimationFrame` (`ts`) e o **tempo visual** exibido (`previewElapsedMs`). A cada frame: `rawDt = ts - previewLastNow`; `clampedDt = min(rawDt, PREVIEW_MAX_DT_MS)` com `PREVIEW_MAX_DT_MS = 1000/30 ≈ 33.333ms`; `previewElapsedMs += clampedDt`; `t = (previewElapsedMs % dur) / dur`. No primeiro frame após início/replay/retomada apenas ancora `previewLastNow` e desenha `t = 0` (sem catch-up instantâneo). Se o aparelho engasgar, o Preview **atrasa levemente** em vez de pular. Helpers `advancePreviewClockMs()`/`resetPreviewClock()`.
- **Abrangência.** Aplicado aos três loops de playback em tempo real do Preview: `startPreview()`, a retomada (resume) em `togglePreviewPlayback()` e o `loopAfter` pós-export. `resetPreviewClock()` chamado em início, stop/reset e restauração pós-export. Comportamento de play/pause/replay, loop, barra de progresso (`previewTimelineFill`), botão de Preview e canvas de Preview preservados.
- **diag (flag, off em produção).** `debugPreviewClock()` atrás de `DEBUG_PREVIEW_CLOCK=false`: mede `rawDt`/`clampedDt`, `globalT`, `segmentIndex`, `localT` e o delta de rotação entre frames exibidos; loga só quando `rawDt > 50ms` ou |Δrotação| acima de limite razoável. `getStateAtT` só é invocado quando a flag está ligada — sem custo em produção.
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` atualizados para `v8z4b30ZH`.
- **Preserve / NÃO altera:** motor de exportação e render determinístico por frame do Export (o Export **não** usa este relógio); função de interpolação/`getStateAtT`/`getStateAtTBase`; Save, Load, `ProjectWorld` (não mutado para o tamanho responsivo do Stage no load — correção da 30ZG intacta); `framesAbs`/`framesNorm`, assets, curvas, easing, JSON; UI/layout/cores/textos/ícones; warm-up/cache **não** reintroduzido como solução principal. Múltiplas imagens continuam desenhadas no Preview/Export.

# v8z4b30ZC

- **Versão de diagnóstico seguro + proteção de regressão.** Base **`v8z4b30ZA`**. A **`v8z4b30ZB`** foi mergeada, testada, **reprovada e revertida** — **não** é base e **nenhuma** mudança dela é reaplicada (em especial: `previewSegmentJumpCheck`, segment jump detection com correção, alterações de camera/preview/export sampling, segment timing, `evaluateCameraAtSegment`, camera state). Objetivo: preservar exatamente o comportamento funcional da 30ZA e **apenas observar** qualquer tranco/piscada/pulo de câmera entre trechos, sem alterar matemática de câmera, Preview, Export ou render final.
- **Confirmação de base.** Auditado o `index.html`: estava na 30ZA (a 30ZB já revertida no histórico). Nenhuma sobra da 30ZB (`previewSegmentJumpCheck`/`previewCameraMatchesExportMath`/segment jump detection/camera sampling alterado) encontrada — nada a remover.
- **diag — trilha observacional de câmera (Preview e Export), `recordCameraTrace30ZC()` chamado ao final de `renderFrameSafely()`.** Lê `diagnostics.renderState` (já calculado pelo motor da 30ZA) e registra, por frame, do último frame renderizado: `*ActiveSegmentIndex`, `*FromFrameIndex`, `*ToFrameIndex`, `*LocalT`, `*CameraX/Y/W/H/Rotation`, amostra anterior (`*Previous*`), deltas (`*DeltaX/Y/W/H/Rotation`, `*DeltaMagnitude`), `*UnexpectedJumpDetected`/`*UnexpectedJumpReason`, `previewFrameRenderMs`, `*AssetsDrawnThisFrame`, `previewVisibleAssetsThisFrame`. Flags `*TraceEnabled=true`, `*TraceIsObservationalOnly=true`, `*TraceChangedPlayback/Export=false`. **Não** altera `ctx`/`t`/câmera/valor de retorno.
- **diag — detector passivo de pulo/piscada, `_runPassiveJumpDetector30ZC()`.** Classifica salto suspeito por: `segment-skip(>1)`, `localT` voltando para trás dentro do mesmo segmento, e spike de delta de câmera/rotação acima de 3× a média local (janela rolante). Reinício de loop/timeline (segmento volta para trás) é tratado como **esperado** e não sinaliza. Registra `jumpDetected/jumpType/jumpSegmentIndex/jumpFrameIndex/jumpPreviousT/jumpCurrentT/jumpDelta*/jumpBeforeCamera/jumpAfterCamera/jumpCurveIndex/jumpFrom-ToFrameIndex/jumpDuringPreview/jumpDuringExport`. **Não corrige nem interfere** no movimento.
- **diag — amostragem do segmento alvo Frame 3 → Frame 4 (`segmentTraceTargetIndex=2`), `runSegmentTrace30ZC()`.** Amostra `localT = 0.00 … 1.00` (passo 0.10) usando `getStateAtT` (a **mesma** câmera de Preview/Export) e `getSegAndLocalTAtTime` para validar o segmento resolvido. Por amostra: `sampleT`, `camera*`, `deltaFromPrevious*`, `deltaMagnitude`, `curveHandle1/2 X/Y` (via `getCurvesV2CubicCP`), `fromFrame/toFrame X/Y`, `expectedContinuous`, `suspiciousDelta`, `suspiciousReason` (delta > 2.5× média ou segmento resolvido divergente). A amostragem **não muda o movimento** — só expõe salto no meio do segmento.
- **diag — guardas de comportamento (Parts 5/6).** `exportBehaviorMatches30ZA=true`, `previewBehaviorMatches30ZA=true`; `exportFrameSamplingChanged`/`exportSegmentTimingChanged`/`exportCameraMathChanged`/`exportRendererChanged` e equivalentes de preview = **false** (constantes, por construção — a 30ZC não toca nesses caminhos).
- **diag — auditoria observacional de caches/estado derivado (Part 7), `buildCacheAudit30ZC()`.** Só lê flags existentes: `derivedStateDirty`/`derivedStateDirtyReason` (a partir de `_worldCompositeDirty`), `segmentCacheExists`, `curveCacheExists`, `assetBoundsCacheExists`, `previewCacheExists/Dirty`. Campos de mutação (`lastProjectMutationType/Timestamp`, `cachesInvalidatedAfterMutation`) reportados como `n/d` por design (sem criar rotina nova que altere comportamento).
- `index.html`: comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível atualizados para `v8z4b30ZC`. Trilha de Preview/Export reiniciada ao abrir Preview e ao iniciar export (amostras limpas).
- **Preserve:** fundo `#3c3c3b`; `ProjectWorld` consistente (`worldCoordinateSystemConsistent=true`, `mixedWorldScaleDetected=false`, `allAssetsSameCoordinateSystem=true`); save/load de assets e frames (`framesRestoredInProjectWorld=true`); render sem filtro de slot; Preview/Export via World Renderer (`exportUsedWorldRenderer=true`, `exportFallbackToSingleImage=false`); WebCodecs; zoom dinâmico. NÃO altera UI/layout/cores/textos/ícones/menus, render math, `evaluateCamera`/`getStateAtT`, `segmentIndex`, `localT`, duração, pausa, easing, curva, Preview/Export playback, WebCodecs/muxer/encoder, geometria do `ProjectWorld`, save/load, assets, `addImageAsset`, pan/zoom/touch, "Inverter sentido"; NÃO traz código da 30ZB sem auditoria.

# v8z4b30ZA

- **Hotfix crítico e cirúrgico do sistema de coordenadas do ProjectWorld (mundo híbrido) + auditoria de render/câmera + estado de handles.** Base `v8z4b30Z` (não reverte a 30Z; preserva todos os avanços dela). Classificação: correção de coordenadas, não mais tratada como filtro por slot, endpoint simples ou mutação de arrays por `addImageAsset`.
- **Diagnóstico do problema.** Em projetos com 9 imagens, o app entrava em **mundo híbrido**: `projectWorld.baseStageW/H` e os assets laterais ficavam no sistema canônico salvo (ex.: 341×512), enquanto `asset[0]` (img-1) e `projectWorld.w/h` eram redimensionados para o Stage atual (ex.: 374×561). Tudo era "considerado/desenhado" na contagem geral, mas o asset principal ficava ~9–10% maior que a `baseStage`, num sistema incompatível com a câmera/frames — fazendo o asset do **slot superior direito** sumir/piscar no Preview/Export.
- **fix(coords) — Estratégia A (preserveSavedWorld), `index.html`.** O `ProjectWorld` passa a ser um único sistema canônico ancorado em `baseStageW/H`; o Stage atual é apenas viewport/janela do editor.
  - `syncFirstImageAsset()`: em projeto **multi-imagem**, NÃO redimensiona mais `asset[0].worldX/Y/W/H`, `projectWorld.w/h` nem `baseStage` com o Stage atual — apenas garante que `asset[0]` tenha coordenadas válidas (usando `baseStage` canônica, nunca o Stage) quando o asset principal é recriado (ex.: fluxo `autosave-restore`). Projeto de **imagem única** continua igual: o Stage É o mundo (tudo consistente).
  - `restoreProjectAssetsFromData()`: no load de projeto multi-imagem, **ancora** `projectWorld.w/h` e `asset[0].worldX/Y/W/H` na `baseStage` canônica salva (célula central). Auto-curativo: corrige inclusive arquivos da 30Z salvos já em estado híbrido.
- **fix(handles) — estado transitório/ghost, `index.html`.** Ao soltar qualquer drag (pointer-up unificado e `cancelStageEditingForNavigation`), `lockedDragSegmentIndex`/`lockedDragCurveIndex`/`lockedDragHandleType` voltam a `-1`/`''` (sem índice fantasma). Ghost handles (`frame_ghost_in`/`frame_ghost_out`) limpam `dataset.arcoFi` ao serem ocultados — diagnóstico/handler só veem índice quando o ghost está realmente visível e correto. Visual dos handles inalterado.
- **diag — auditoria, `buildDiagnosticsText()` + `drawWorldToCanvas`.**
  - Coordenadas: `worldCoordinateStrategy` (`preserveSavedWorld`/`mixed/invalid`), `worldCoordinateSystemConsistent`, `worldCoordinateIssue`, `projectWorldW/H`, `projectWorldBaseStageW/H`, `stageW/H`, `asset0MatchesWorldCoordinateSystem`, `allAssetsSameCoordinateSystem`, `framesMatchWorldCoordinateSystem`, `curvesMatchWorldCoordinateSystem`, `mixedWorldScaleDetected`, `mixedWorldScaleDetails`.
  - Render real por asset (último Preview/Export): `renderSampleCount`, `renderLast(Segment/Frame)Index`, `renderTransformConsistent`, `renderTransformIssue`, `renderCamera(X/Y/W/H/Rotation)`, `renderCanvasW/H`, `renderWorldToCanvasScaleX/Y`, `cameraCoordinateSpace`/`assetCoordinateSpace`/`frameCoordinateSpace`/`curveCoordinateSpace`=`projectWorld`, `cameraAssetCoordinateMismatch`, e por asset `assetRender[id].world/screen/flags` (`considered`, `drawn`, `intersectsCamera`, `culled`, `cullingReason=none`, `alphaUsed`, `imageReady`, `decodeReady`, `screenArea`, `naturalW/H`).
  - Handles: `dragStateActive`, `dragStateType`, `ghostHandlesConsistent`, `ghostHandlesIssue`, `ghostIn/OutExpectedFrameIndex`, `ghostIn/OutActualFrameIndex`, `activeFrameHasValidIn/OutHandle`.
- **Culling.** Mantido o comportamento da 30Z: culling desabilitado no `drawWorldToCanvas` — todos os assets visíveis do `ProjectWorld` são desenhados (o canvas 2D já descarta o que está fora do viewport), sem filtro por slot/setor/main image/selected asset.
- `index.html`: versão atualizada para `v8z4b30ZA` em comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível.
- **Preserve:** fundo `#3c3c3b`; múltiplas imagens; `ProjectWorld`; save/load de assets e de frames em coordenadas absolutas do mundo (`framesRestoredInProjectWorld=true`); Preview/Export via World Renderer (`exportUsedWorldRenderer=true`, `exportFallbackToSingleImage=false`); WebCodecs; zoom mínimo dinâmico; `previewUsedSlotFilter`/`exportUsedSlotFilter`/`*SelectedAssetFilter`/`*MainImageOnlyPath`=`false`; `addImageOnlyAddedNewAsset=true`; `endpointContinuityOkAllSegments=true`. NÃO altera UI/layout/cores/textos/ícones/menus, fluxo Inserir/Trocar imagem, reset, zoom dinâmico, pan/zoom/touch, WebCodecs/muxer/encoder, motor de curvas/easing/timing; sem Layers, sem cenas, sem "Inverter sentido", sem `prompt()`/`alert()`/`confirm()`.

# v8z4b30U

- **Correção funcional do fluxo de imagem + navegação superior + zoom out do ProjectWorld.** Base **`v8z4b30R`** (as versões `v8z4b30S` e `v8z4b30T` foram canceladas/revertidas e NÃO usadas como base; `index.html` foi restaurado de `v8z4b30R` antes de aplicar esta versão).
- **fix(version): versão visível única.** `APP_VERSION` e `APP_VERSION_NAME` = `v8z4b30U` (iguais). A interface mostra apenas uma linha: "Arco Motion App v8z4b30U" — removida a 2ª linha (`appVersionNameText`) do bloco `.settings-version`. Sem resíduo de `v8z4b30R/S/T` como segunda versão visível.
- **ux(image): duas ações diretas e separadas.** O menu Arquivos deixa de ter o item único "Imagem" (que abria o seletor e perguntava depois). Agora há **"Inserir imagem"** (`startInsertImageFlow`) e **"Trocar imagem"** (`startReplaceImageFlow`), acionáveis separadamente. O seletor de Fotos/Arquivos só abre **depois** da escolha da ação (e do slot/alvo) — nunca antes, e nunca pergunta após o arquivo.
- **fix(intent/target): intenção e alvo congelados.** Antes de abrir o seletor, o app congela `pendingImageAction` (`insertImage`/`replaceImage`), `pendingImageTargetSlot` (`key/row/col`) e `pendingImageTargetAssetId` (troca). Ao retornar do seletor (`handleImageFileChosen`), o app usa exclusivamente o alvo congelado — não recalcula pelo estado visual nem cai no centro (exceto projeto realmente vazio).
- **fix(insert): `performInsertImageAtSlot(slotKey, file)`.** Respeita o slot congelado, cria **novo** asset (`assets.length` +1) com fit contain, `slotRow/Col` corretos e `zIndex` coerente (slot ocupado → nova camada **acima** das existentes naquele slot, sem bloquear e sem virar troca). Undo `addImageAsset` remove o asset inserido. Diagnóstico: `lastImageActionType=insertImage`, `addedAssetId`, `replacedAssetId=n/d`, `slotOccupiedOnInsert`.
- **fix(replace): `doReplaceImageFromFile`/`doReplaceExtraAsset`.** Substitui **apenas** o asset alvo, **sem** criar nova camada (`assets.length` inalterado), preservando `slot/zIndex/visible` e mantendo fit contain (recalcula o tamanho dentro da mesma célula). Trocar a principal/central reaproveita o fluxo aprovado (`loadImage` + undo de 1 passo). Trocar lateral **não** substitui `img-1`; trocar em slot vazio **não** abre seletor e **não** cai no centro (status visual). Undo `replaceImageAsset` restaura a imagem anterior. Diagnóstico: `lastImageActionType=replaceImage`, `replacedAssetId`, `addedAssetId=n/d`, `slotOccupiedOnReplace`.
- **base lógica mínima de layers:** `selectedImageAssetId`, seleção do asset de maior `zIndex` por slot (`findTopAssetInSlot`), `zIndex` coerente por inserção e diagnóstico de camadas/slots — sem painel visual, sem reorder, sem edição livre de posição/escala.
- **ux(nav): X/Fechar → "Início".** O botão X/Fechar isolado do canto superior esquerdo foi removido da `top-bar` e sua função (`requestCloseStageToLauncher`, voltar à tela inicial preservando aviso de alterações não salvas) virou o item **"Início"** (ícone Lucide `home`) no menu Arquivo/projeto. Nenhuma mudança na lógica interna da ação.
- **fix(layout): topo sem reflow.** No lugar do X foi mantido um **placeholder invisível** (`visibility:hidden`, mesma classe/geometria do antigo botão), de modo que **Preview** e **Visualizar** permanecem exatamente na mesma posição da `v8z4b30R`. Espaço reservado para futuro menu Layers/Imagens.
- **feat(zoom): zoom out dinâmico do ProjectWorld.** `getEditorMinZoom()`/`computeFitAllWorldZoom()`/`getWorldViewBoundsStagePx()` calculam um zoom mínimo dinâmico (apenas no editor) para caber todo o ProjectWorld/grid 3x3 quando há múltiplas imagens; projetos de 1 imagem mantêm o mínimo atual (`0.5`). O gesto de pinça passa a respeitar `getEditorMinZoom()` e `clampEditorPan()` **alarga** (nunca restringe) os limites de pan para navegar pelo mundo inteiro. NÃO altera frames, Preview, Export, escala real dos assets nem coordenadas.
- **feat(diag):** novos campos de ação de imagem (`pendingImageAction`/`pendingImageTargetSlot`/`pendingImageTargetAssetId`/`lastImageActionType`/`addedAssetId`/`replacedAssetId`/`slotOccupiedOnInsert`/`slotOccupiedOnReplace`/`duplicatedSlotDetected`/`duplicatedSlotKey`/`layerInsertAllowed`/`imageLayerCount`/`imageSlotsOccupiedCount`/`occupiedSlotsList`/`replaceableImageCount`/`selectedReplaceTargetSlot`/`selectedReplaceTargetAssetId`/`selectedImageAssetId`), plano/marca d'água (`premiumFeatureMultipleImagesEnabled`/`watermarkRequiredForCurrentPlan`) e zoom out (`editorMinZoomMode`/`dynamicEditorMinZoom`/`worldViewBounds*`/`fitAllWorldZoom`/`panBoundsSource`/`canViewAllSlotsAtMinZoom`).
- `index.html`: versionamento atualizado para `v8z4b30U` em comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível.
- **Preserve:** salvar/carregar múltiplas imagens (assets/`zIndex`/`fitMode`/`worldX/Y/W/H`/`slotRow/Col`/`visible`), `ProjectWorld` único, Preview/Export multi-imagem (`exportUsedWorldRenderer`/`exportFallbackToSingleImage`), fundo `#3c3c3b`, fit contain, reset preservando imagens, gap 3x3, `featureAccess.multipleImageAssets` liberado para teste interno, iPhone/Safari. NÃO altera motor de curvas/frames, WebCodecs/FPS/muxer, touch/pan/zoom de câmera dos frames, cores/textos/posições aprovadas; sem painel de layers/reorder; sem `prompt()`/`alert()`/`confirm()`.

# v8z4b30Q

- **HOTFIX de estabilização — fase 1 de múltiplas imagens.** Base `v8z4b30P`. Corrige o fundo padrão do projeto (preto herdado em vez de cinza `#3c3c3b`) e o salto para a imagem inteira durante o export MP4 quando a câmera transita entre frames de imagens diferentes. Valida (sem alterações de código) que undo de "Adicionar como nova imagem"/"Substituir imagem atual" e a regra de "Substituir imagem atual" sempre na imagem principal/central já estavam corretos na v8z4b30P.
- **Correção 1 — fundo padrão `#3c3c3b` sincronizado.** `index.html`: nova flag de estado `bgColorUserSet` (persistida em `captureState`/`cloneProjectStateSnapshot`/`restoreState`/`buildProjectData`), `false` por padrão e em `clearCurrentProjectForNewFile()`. `applyFrameData()` passa a migrar `bgColor` salvo: preto legado (`#000000`/`#000`/`black`) sem `bgColorUserSet === true` é tratado como herança de inicialização antiga e cai em `DEFAULT_PROJECT_BG` (`#3c3c3b`); preto (ou qualquer cor) escolhido explicitamente pelo usuário (`bgColorUserSet === true`) é preservado. `applyBgColorValue()` (menu "Cor de fundo") marca `bgColorUserSet = true` ao aplicar uma cor. `getProjectBackgroundColor()` continua sendo a fonte única para Stage/Preview/Export/`drawWorldToCanvas`, agora alimentada por um `bgColor` correto desde a inicialização/migração.
- **Correção 2 — export multi-imagem sem salto para imagem inteira.** `index.html` (`renderFrameSafely`): quando `isMultiImageWorldActive()` (2+ imagens), a verificação `rejectBlank`/`isExportFrameLikelyBlank` (que disparava `renderUniversalFallback`, desenhando a imagem canônica inteira ignorando a câmera) deixa de ser aplicada — frames em que a câmera atravessa o gap entre slots durante a transição entre imagens são posições válidas do `ProjectWorld`, não falhas de render, e seguem exclusivamente pelo caminho `drawAtT`/`drawWorldToCanvas`. Novos campos de diagnóstico somente-leitura: `exportUsedWorldRenderer`, `exportFallbackToSingleImage`, `exportFallbackReason` (resetados em `startRecord`, exibidos em `buildDiagnosticsText`).
- **Correções 3/4/5 — validadas sem alteração de código.** "Adicionar como nova imagem" (`addImageAssetAtSlot`/`beforeAddAsset`/`pushUndoSnapshot`) e "Substituir imagem atual" (`chooseReplaceCurrentImage`/`loadImage`/`_pendingImageReplaceUndoSnapshot`/`pushUndoSnapshot`) já produzem exatamente um passo de undo/redo cada, restaurando metadados sem duplicar base64/blobs; `syncFirstImageAsset` garante que a substituição sempre atua sobre `assets[0]` (imagem principal/central, `img-1`), nunca sobre imagens laterais.
- `index.html`: versionamento atualizado para `v8z4b30Q` em comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- Preserve: inserção/Preview de múltiplas imagens, export MP4 1:1/9:16/4:3, fit-contain, gap 3x3, `ProjectWorld` único, remoção do título "Cena 1", modal "Substituir imagem atual / Adicionar como nova imagem" acima do menu superior, fundo cinza de "Gerando vídeo" e a flag `featureAccess.multipleImageAssets` para build de teste interna. NÃO altera `getStateAtT`/`drawAtT`/curvas/easing/timing/pausa/loop/escala/rotação além do guard mínimo descrito na Correção 2; NÃO altera Mac/desktop, posição/escala livre, layers, seleção explícita de imagem, cenas; sem `prompt()`/`alert()`/`confirm()`.

# v8z4b30O

- **Múltiplas imagens (fase 1) — correção de Preview/Export + espaçamento.** Base `v8z4b30N`. Corrige a tela preta no Preview com 2+ imagens e o espaçamento ausente entre as imagens. Projetos com 1 imagem continuam byte-idênticos no caminho de render (Preview/MP4 1:1/9:16/4:3 inalterados).
- **Correção 1 — espaçamento 3x3 (gap em coordenadas de mundo).** `index.html` (`addImageAssetAtSlot`): a imagem extra passa a ser posicionada com um gap em mundo — `worldGap = clamp(min(baseStageW,baseStageH)*0.16, 48, 96)`, `worldX = col*(baseStageW + worldGap)` e `worldY = row*(baseStageH + worldGap)`; `worldW/H` continuam `baseStageW/H`. A célula central (`col=0,row=0`) continua sendo a imagem principal, e a imagem adicionada à esquerda/direita/acima/abaixo não encosta mais na principal. O Stage/DOM (`renderProjectWorldExtraImages`) já reflete o gap por ler `worldX/Y`. Não remapeia frames existentes nem altera projetos de 1 imagem.
- **Correção 2/3 — Preview/Export com várias imagens (render central de mundo).** `index.html`: nova função `drawWorldToCanvas(ctx, cam, outW, outH, options)` — limpa o canvas com o fundo correto, percorre os assets de imagem **visíveis** ordenados por `zIndex`, converte cada rect (`worldX/Y/W/H`) para px da câmera, desenha **apenas a parte dentro do frame/câmera** (clipping do canvas + cull por interseção) e nunca depende do DOM visual do Stage. `mainSource` segue a regra já existente: proxy de edição/preview quando há `renderSourceOverride`; original (canônica) no export. `drawAtTDirect()` redireciona para `drawWorldToCanvas` **somente** quando `isMultiImageWorldActive()` (2+ imagens) — projetos de 1 imagem mantêm o caminho single-image idêntico. Substitui o antigo mundo composto 3x3 fixo (`getProjectWorldCompositeSource`), que era ignorado no Preview (porque o Preview passa `renderSourceOverride`) e gerava tela preta quando o frame apontava para a segunda imagem.
- **Correção 4 — Diagnóstico.** `buildDiagnosticsText()` passa a exibir, por asset de imagem, `visible` e `zIndex` (além de `sourceW/H`, `worldX/Y`, `worldW/H` já existentes), e ganha `worldGap usado`, `multiImageWorldActive`, `renderWorldLastAssetCount`, `previewRenderAssetCount`, `exportRenderAssetCount`, `lastPreviewError` e `lastWorldRenderError`.
- Mantém: remoção do título "Cena 1", fundo cinza da tela "Gerando vídeo" (`.gen-overlay`) e as correções de 30M/30N.
- `index.html`: versionamento atualizado para `v8z4b30O` em comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- Preserve: NÃO implementa edição livre de posição/escala, painel de layers nem cenas; NÃO altera o motor de curvas, o motor de exportação MP4 1:1/9:16/4:3, `getCanonicalRenderSource()`/proxy de edição, `Stage`/`layoutStage()` além do mínimo, zoom/pan/clamps/curvas, textos/ícones/cores/layout aprovados; sem `prompt()`/`alert()`/`confirm()`.

# v8z4b30N

- **Múltiplas imagens (fase 1).** `ProjectWorld`/`assets[]` passam a aceitar imagens adicionais reais. Projetos com 1 imagem continuam exatamente como antes: `getProjectWorldCompositeSource()` retorna `null` enquanto `imageAssetsCount < 2`, então `drawAtTDirect()` (Stage/Preview/export) segue o caminho atual sem nenhuma mudança.
- `index.html` (`syncFirstImageAsset`): `projectWorld.baseStageW/H` passam a ser definidos apenas na primeira imagem e preservados depois, servindo de unidade para o grid 3x3 (cada célula = `baseStageW x baseStageH`, em px de Stage).
- `index.html` (fluxo "Adicionar imagem"): `chooseAddNewImageAsset()` agora checa `canAddImageAsset()`; se permitido, abre o novo bottom-sheet `#imageSlotPickerSheet` com 9 posições (top/middle/bottom × left/center/right, `WORLD_SLOTS`) relativas à imagem atual (centro = posição atual). Ao escolher uma posição, `addImageAssetAtSlot()` cria o novo `assets[]` (`type:'image'`, `worldX/Y/W/H` na célula escolhida) e fecha os overlays; "Substituir imagem atual" e "Cancelar" continuam funcionando como antes (Cancelar não altera nada). Sem `prompt()`/`alert()`/`confirm()`.
- `index.html` (Stage): `renderProjectWorldExtraImages()` (chamada em `layoutStage()`) cria/atualiza `<img class="world-extra-img">` para cada asset extra, posicionados em `#stageContent` via `worldX/Y/W/H` escalados por `stageW/baseStageW`/`stageH/baseStageH`. Frames continuam livres para mover sobre essas regiões (`containFrames=false`, sem alteração na lógica de clamp/drag).
- `index.html` (Preview/export): quando `imageAssetsCount >= 2`, `getProjectWorldCompositeSource()` monta/cacheia um canvas composto do grid 3x3 (limitado a ~9MP via `WORLD_COMPOSITE_MAX_PIXELS`, usando proxy de edição quando necessário) e `drawAtTDirect()` usa esse composto como `renderSource`/`renderDims`, ajustando `cx/cy/sw/sh` pelo deslocamento do mundo; o motor de curvas, `getCanonicalRenderSource()` e o pipeline de export (1:1/9:16/4:3) não são alterados.
- `index.html` (Diagnóstico): `buildDiagnosticsText()` passa a listar `sourceW/H`/`worldX/Y`/`worldW/H` de cada asset de imagem (não só `asset[0]`), além de `activeSlotSelection`, `worldComposite.active` e `worldComposite.scale`. Campos já existentes (`projectWorld.*`, `assets.length`, `imageAssetsCount`, `canAddImageAsset`, `featureAccess.multipleImageAssets`, `hasEditorProxy`, `exportDrawSource`/`editorDrawSource`) confirmados/preservados.
- `index.html`: `canUseMultipleImages()` ganha bypass de build de teste interna (`DEV_ENABLE_MULTIPLE_IMAGES = true`), preservando a checagem `isProMode`/Plus existente (basta desligar a flag para restaurar o gate Premium).
- **Tarefa (ui): remove o título "Cena 1"** da Linha do tempo (`.cena1-section-header`); o bloco `#cena1Block` permanece, sem novo título no lugar. IDs/funções internas (`cena1Block`, `cena1Seq`, `setCena1Filter`, etc.) não são renomeados.
- **Tarefa (ui): `.gen-overlay`** (overlay "Gerando vídeo") passa de `background: rgba(0,0,0,.78)` para `rgba(60,60,59,.92)`, o cinza geral aprovado do app, sem alterar lógica/textos/botões de export.
- `index.html`: versionamento atualizado para `v8z4b30N` em comentário do topo do bloco de versão, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- Preserve: NÃO altera o motor de exportação MP4 1:1/9:16/4:3, `getCanonicalRenderSource()`/proxy de edição, sistema de coordenadas, lógica de touch/drag/resize/clamp, curvas, menus/textos/ícones/cores aprovados além do especificado; sem `prompt()`/`alert()`/`confirm()`. Projetos com 1 imagem permanecem byte-idênticos no caminho de render.

# v8z4b30M

- **Tarefa 1 (perf): proxy de edição para imagens grandes.** Imagens muito grandes deixavam o pan/zoom do Stage mais lento no iPhone/Safari porque `#imgEl` exibia a imagem original em resolução total via CSS. Nova `createEditorImageProxyIfNeeded(image)`: se a imagem original tem o maior lado > 2048px **ou** > 6 megapixels, gera em canvas um proxy reduzido (maior lado ~2048px, mesma proporção, PNG) e usa esse proxy como `src` de `#imgEl` (Stage/editor); imagens pequenas/médias continuam usando a própria imagem original.
- `index.html` (`loadImage`, `finishNewProjectImageLoad`): novos campos de estado `originalImageElement`/`originalImageSrc` (imagem original, mesma fonte de `canonicalRenderImage`/export) e `editorImageElement`/`editorImageSrc` (proxy ou original, usado em `#imgEl`); `hasEditorProxy`, `editorProxyW`/`editorProxyH`, `editorProxyScale`, `editorProxySource`, `lastProxyError`, `lastImageDecodeError`.
- `imgNatW`/`imgNatH`, `frames`, `Stage`/`layoutStage()`, zoom/pan/clamps, curvas e o motor de export continuam baseados exclusivamente na imagem original (`originalImageElement`/`canonicalRenderImage`) — o proxy não altera proporção, posição de frames nem o fator Stage→px natural. `getCanonicalRenderSource()` (usado por Preview/export) não muda.
- **Tarefa 2 (diag): painel Diagnóstico** ganha `imageMegapixels`, `estimatedOriginalRGBABytes`, `hasEditorProxy`, `editorProxyW`/`editorProxyH`, `editorProxyScale`, `editorDrawSource` (`original`/`proxy`), `exportDrawSource` (`original`/`fallback`/`n/d`), `lastProxyError`, `lastImageDecodeError` e `memoryRiskLevel` (`low`/`medium`/`high`, com base nos megapixels da imagem original).
- **Tarefa 3 (fix preview): `.preview-bottom`** passa de `background:#111` para `background:var(--menu-bg)`, removendo o fundo preto remanescente da barra inferior do Preview — agora usa o cinza geral aprovado do app (mesma cor de `.preview-screen`/`.image-area`/`.settings-sheet`). Botões Voltar/Pause/Salvar MP4 e exportação não foram alterados.
- **Tarefa 4 (fix ui): modal "Usar nova imagem"** (`#imageChoiceSheet`, Substituir/Adicionar/Cancelar) e `#multiImagePlusModal` passam de `z-index: 220`/`230` para `320`/`330`, ficando acima do menu superior/preferências (`#settingsSheet`, `z-index: 300`). `chooseReplaceCurrentImage()`, `chooseAddNewImageAsset()` e `cancelImageChoice()` agora chamam `closeAll()` para fechar o menu/painéis e voltar ao Stage; fluxo de Substituir/Adicionar(Plus)/Cancelar permanece o mesmo (nenhuma segunda imagem real é renderizada).
- `index.html`: versionamento atualizado para `v8z4b30M` em comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- Preserve: NÃO altera motor de exportação MP4, correção 1:1, `Stage`/`layoutStage()`, `projectWorld`/assets/views, múltiplas imagens reais, frames/curvas/zoom/pan/clamps, textos/ícones/cores aprovadas além dos fundos pretos remanescentes do Preview; sem `prompt()`/`alert()`/`confirm()` (base v8z4b30I). 1:1, 9:16 e 4:3 continuam funcionando.

# v8z4b30I

- Corrige o `EncodingError` ("Encoding task failed") do WebCodecs ao gerar MP4 no formato **1:1** (1080×1080) — falha já observada também na v8z4b29CC, portanto não relacionada ao `ProjectWorld`/assets/Stage/mundo da série 30D+.
- Causa raiz: 1080×1080 = 68×68 = **4624 macroblocos** de 16×16, acima do limite de **3600 MBs** dos níveis H.264 3.0/3.1 usados pelos candidatos de codec fixos (`avc1.42001f`/`avc1.42E01E`/`avc1.4D401F`). 9:16 (720×1280 = 3600 MBs) e 4:3 (1080×810 = 3468 MBs) ficam dentro desse limite — por isso funcionavam normalmente. O Safari aceita os candidatos de nível 3.x via `VideoEncoder.isConfigSupported()` mesmo para 1:1, mas o encoder real falha em runtime com `EncodingError`.
- `index.html` (`startRecord`): calcula o número de macroblocos (`Math.ceil(W/16) * Math.ceil(H/16)`) da resolução de export; quando acima de 3600 (hoje, somente o formato 1:1), usa candidatos de codec com nível H.264 4.0 (`avc1.420028`, `avc1.4D0028`, `avc1.640028`, suporta até 8192 MBs). 9:16 e 4:3 continuam usando exatamente os mesmos candidatos/ordem de antes — sem regressão.
- `index.html` (`startRecord`): o pipeline WebCodecs (configuração do encoder, loop de render/encode, flush/finalize do muxer) passa a rodar em `try/catch` isolado. Se o encoder falhar em runtime em qualquer formato (mesmo após `isConfigSupported()` indicar suporte), o export cai automaticamente para `exportWithMediaRecorderFallback()` — que usa o mesmo `recCanvas`/loop de render isolado do export, sem tocar no Stage/DOM do editor — em vez de propagar para `cleanupFailedExport()`. O erro original do WebCodecs (nome/mensagem) é preservado em `lastExportOriginalErrorName`/`lastExportOriginalErrorMessage` mesmo quando o fallback tem sucesso.
- `index.html` (`arcoExportDiag`/`buildDiagnosticsText`): novos campos somente-leitura `encoderPathUsed` (`'webcodecs'` ou `'mediarecorder'`), `fallbackUsed`, `lastExportOriginalErrorName` e `lastExportOriginalErrorMessage`, resetados a cada nova tentativa de export e exibidos no painel Diagnóstico junto com `exportW`/`exportH`/`currentFormat`/`exportSuccess`/`cleanupSuccess`.
- `index.html`: versionamento atualizado para `v8z4b30I` em comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- Preserve: NÃO altera carregamento de imagem, renderização do Stage/editor, `layoutStage()`, zoom/pan/clamps, `projectWorld`/assets/views, motor de curvas, menus/textos/ícones/cores/layout; nenhuma segunda imagem é renderizada/implementada; sem `prompt()`/`alert()`/`confirm()`. NÃO reaplica patches de 30G/30H que alteravam editor/render/upload (essas versões permanecem revertidas). 9:16 e 4:3 continuam funcionando sem regressão.

# v8z4b30F

- Corrige o bug específico de Preview/Export no formato **1:1** (1080×1080), incluindo arquivos novos criados já em 1:1, e projetos 9:16/4:3 trocados para 1:1. Antes, essas exportações terminavam com `lastExportStep: cleanup-failed` e a mensagem genérica "Erro ao gerar vídeo. Tente novamente." mesmo quando o MP4 já havia sido gerado com sucesso.
- Causa raiz: em `finishExport()`, qualquer exceção lançada durante a restauração da UI do Preview **após** o blob/MP4 já estarem prontos (loop de playback pós-export, canvas de preview, botões) propagava para o `catch` de `startRecord()`, que então sobrescrevia o diagnóstico de `success` para `cleanup-failed` e disparava `cleanupFailedExport()` com a mensagem genérica — **descartando** a evidência de que a exportação havia funcionado.
- `index.html` (`finishExport`): a partir do momento em que `generatedUrl`/blob são criados, a exportação é considerada bem-sucedida (`exportSuccess: true`, `lastExportStep: 'success'`). A restauração de UI/playback do Preview agora roda em `try/catch` próprio: se falhar, o erro é registrado apenas em `lastCleanupError`/`cleanupSuccess: false` no diagnóstico, sem reverter `exportSuccess`/`lastExportStep` e sem exibir erro genérico — o usuário continua vendo "Pronto X MB - toque para salvar".
- `index.html` (`cleanupFailedExport`): deixou de sobrescrever `lastExportStep`/`lastExportError` com a string `'cleanup-failed'`/mensagem genérica; agora preserva o `lastExportStep`/`lastExportError` já registrados pelo chamador (passo real que falhou) e registra o resultado da própria limpeza de UI separadamente em `cleanupSuccess`/`lastCleanupError`. Todas as operações de DOM/canvas de restauração permanecem em `try/catch`, tornando a limpeza idempotente mesmo se elementos/recorder/objectURL já tiverem sido removidos/encerrados/revogados.
- `index.html` (`arcoExportDiag`): novos campos somente-leitura `exportSuccess`, `cleanupSuccess` e `lastCleanupError`, resetados a cada nova tentativa de export (`startRecord`) e exibidos no painel Diagnóstico junto com `lastExportStep`/`lastExportError`.
- `index.html` (`startPreview`, `startRecord`): chamam `closeAll()` antes de abrir o Preview/iniciar o export, fechando painéis/menus editoriais transitórios (Formato de saída, Edição de Tempo, Movimento, Trajetória e demais `.float-panel`/popovers) que, por terem `z-index` maior que o Preview, ficavam sobrepostos ao canvas.
- `index.html`: versionamento atualizado para `v8z4b30F` em comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- Preserve: nenhuma segunda imagem é renderizada/implementada; Stage, `layoutStage()`, zoom/pan/clamps, curvas, `projectWorld`/`assets`/`views`/permissões, visuais/ícones/textos/menus/fluxo aprovados permanecem inalterados; sem `prompt()`/`alert()`/`confirm()`. Regra de aviso/marca d'água para `>=4` frames mantida sem bloquear a geração; múltiplas imagens reais continuam bloqueadas como Plus. 9:16 e 4:3 continuam funcionando.

# v8z4b30E

- HOTFIX exclusivo: corrige a falha de geração de MP4 (tela "pisca" e nenhum arquivo é gerado) que ocorria após o usuário **trocar o formato/proporção do projeto** já configurado (com >4 frames ou não), reportada pelo usuário.
- `index.html` (`selectFormat`): ao recalcular `x/y/w/h` de cada frame para o novo `currentRatio`, passa a preservar todas as propriedades extras do frame (ex.: `pointMode`) via spread, em vez de recriar o objeto só com `{x,y,w,h}`; adiciona fallback finito para `f.x/f.y/f.w/f.h` caso algum frame chegue com valor ausente/NaN/Infinity.
- `index.html` (nova função `normalizeFramesToCurrentFormat(reason)`): passe de normalização defensiva que corrige frames com `x/y/w/h` não finitos, `w`/`h` <= 0 ou fora da proporção do `currentRatio` (tolerância 0.01), recalculando a partir do centro do frame e aplicando `clampFrame()`. Chamada no início de `startRecord()`, antes de qualquer guard, garantindo que o export sempre opere sobre frames coerentes com o formato atual — **sem** alterar Stage, `layoutStage()`, zoom/pan/clamps, curvas ou o motor de frames além dessa normalização.
- `index.html` (diagnóstico de export — novo `arcoExportDiag`/`arcoSetExportDiag`/`arcoFramesHaveInvalidValues`): registra, a cada tentativa de export, `exportW`/`exportH` e `currentFormat` usados na geração, `lastExportStep` (etapa atual: start, frames-normalized, canvas-setup, mediarecorder-fallback, cleanup-failed, success, error), `lastExportError` (mensagem real do erro, incluindo erros do `WebCodecs`/`MediaRecorder` capturados nos `catch`), se algum frame está com NaN/Infinity, `frameCount` e se a marca d'água/aviso premium (`>=4` frames, modo não-Pro) foi aplicado.
- `index.html` (painel Diagnóstico — `buildDiagnosticsText()`): exibe os novos campos de `arcoExportDiag` na seção "Formato / exportação", sem alterar o layout do painel.
- `index.html`: versionamento atualizado para `v8z4b30E` em comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- Preserve: nenhuma segunda imagem é renderizada/implementada; Stage, `layoutStage()`, zoom/pan/clamps, curvas, `projectWorld`/`assets`/`views`/permissões, visuais/ícones/textos/menus/fluxo aprovados permanecem inalterados; sem `prompt()`/`alert()`/`confirm()`. Regra de aviso/marca d'água para `>=4` frames mantida sem bloquear a geração. Validado via Playwright (export antes da troca de formato, e após 9:16→1:1 e 9:16→16:9, todos com sucesso).

# v8z4b30D

- Base `v8z4b30C` confirmada e preservada. `v8z4b30A` e `v8z4b30B` foram revertidas e são ignoradas.
- Objetivo: implantar apenas a **fundação técnica** do conceito Project World / Assets / Visualizações / Premium Gate, **sem** implementar múltiplas imagens reais. O app continua renderizando uma imagem só pelo fluxo atual.
- `index.html` (Tarefa 1 — modelo interno preparatório): adiciona `projectWorld { initialized, x, y, w, h, baseStageW, baseStageH }`, `assets[]` e `views[]`. Ao carregar/trocar a imagem, `syncFirstImageAsset()` cria/atualiza o primeiro asset `type:"image"` espelhando a imagem atual (`sourceW/H` = natural; `worldX/Y` = 0; `worldW/H` = Stage) e atualiza `projectWorld`. É apenas preparatório/diagnóstico: **não** altera render, `layoutStage()`, cálculo de Stage, zoom/pan/clamps, motor de frames, curvas, Preview, export nem o formato do JSON.
- `index.html` (Tarefa 2 — camada central de permissões): adiciona `getFeatureAccess(featureName)`, `canUseMultipleImages()`, `canAddImageAsset()` e `getImageAssetCount()`. `framesOverThree` mantém o comportamento atual (Free permite, com aviso/marca d'água — a regra antiga **não** foi migrada). `multipleImageAssets`, `jsonProject` e `aiMotion` são Plus/Premium. A contagem considera apenas `assets` com `type === "image"` (texto não conta).
- `index.html` (Tarefa 3 — fluxo de nova imagem): ao escolher uma nova imagem com uma já carregada, abre a action sheet customizada **"Usar nova imagem"** com "Substituir imagem atual" (fluxo atual aprovado), "Adicionar como nova imagem" (indicação Plus — nesta versão **não** adiciona imagem real, mostra modal Plus) e "Cancelar" (fecha, limpa o input, não altera nada). Sem `prompt()`, `alert()` ou `confirm()`.
- `index.html` (Tarefa 4 — diagnóstico): o painel passa a exibir `projectWorld` (initialized/x/y/w/h/baseStageW/baseStageH), `assets.length`, `imageAssetsCount`, `asset[0]` source/world, `views.length`, `canAddImageAsset` e `featureAccess multipleImageAssets`.
- `index.html` (Tarefa 5 — versão): `APP_VERSION`/`APP_VERSION_NAME`, texto visível no menu e comentário de topo atualizados para `v8z4b30D`.
- Preserve: nenhuma segunda imagem é renderizada; Stage, frames, zoom/pan, curvas, Preview e export inalterados. Não promove para estável; validar em iPhone/Safari real.

# v8z4b29CD

- Base `v8z4b29CC` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app, comentário/changelog de topo e `CHANGELOG.md`.
- `index.html`: versionamento atualizado para `v8z4b29CD` em banner/comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: Preview/Export troca os verdes remanescentes do check de “Vídeo pronto!” e do estado pronto do botão “Salvar MP4” por `var(--accent)`, preservando textos, layout e lógica de exportação.
- `index.html`: painel “Linha do tempo” ganha fundo externo discretamente mais claro, mantendo abas/miolo na cor geral atual; a aba local ativa remove a linha inferior perceptível e se conecta ao conteúdo abaixo.
- Preserve: sem alteração em motor, render/export/MP4, JSON, Stage, launcher, Novo Projeto, upload, timeline funcional, frames, trechos, curvas, Tremor, Movimento Inteligente ou Trajetória. Não promove para estável.

# v8z4b29CC

- Base `v8z4b29CB` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app, comentário/changelog de topo e `CHANGELOG.md`.
- `index.html`: versionamento atualizado para `v8z4b29CC` em banner/comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: reforço visual conservador da área “Linha do tempo” por borda externa mais contrastada e traços das abas locais Todos/Frames/Trechos mais nítidos, preservando fundo, estrutura, lógica, lista, sliders, Preview/export/JSON, Tremor, Movimento Inteligente, Trajetória e Stage.
- Não promove para estável.

# v8z4b29CB

- Base `v8z4b29CA` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app, comentário/changelog de topo e `CHANGELOG.md`.
- `index.html`: versionamento atualizado para `v8z4b29CB` em banner/comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: área local “Linha do tempo” criada na aba Tempo, com fundo sutil e abas locais Todos/Frames/Trechos conectadas ao conteúdo abaixo, sem alterar filtros/lista/cálculos.
- `index.html`: espaçamento da seção Preferências > Tremor normalizado e ordem do controle em linha “Todos os trechos [globo]” corrigida no painel Tempo do trecho.
- `index.html`: Trajetória saiu do painel Movimento e ganhou item próprio no menu contextual de trecho com ícone Lucide `fold-vertical` e painel próprio com ações “Resetar este trecho (linha reta)” e “Resetar todos os trechos (linha reta)”.
- `index.html`: seleção de trecho no Stage passa a associar visualmente os dois frames conectados e reduzir destaque residual de frames fora do trecho.
- Preservados sem alteração intencional: launcher, Novo Projeto, upload, Preview/export, JSON, cálculos de duração, easing/velocidade, matemática de curvas, Tremor, Movimento Inteligente, pausa, escala e rotação.
- Não promover para estável nesta versão; validar em iPhone/Safari real antes de estabilização.

# v8z4b29CA

- Base `v8z4b29BZ` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app, comentário/changelog de topo e `CHANGELOG.md`.
- `index.html`: ação de retificar curva saiu do bloco de Velocidade/easing e passou para a seção própria `Trajetória`, como botão com ícone e rótulo `Linha reta`, reaproveitando `resetSelectedSegmentCurve()` sem alterar cálculo, easing, duração, Tremor, preview/export ou JSON.
- `index.html`: drag dos handles IN/OUT do frame selecionado registra explicitamente o trecho adjacente tocado (`target`) e atualiza `_activeEaseSeg` para esse trecho, permitindo editar curva anterior ou seguinte mantendo o frame atual selecionado.
- Versão atualizada para `v8z4b29CA` em banner/comentário do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- Não promover para estável nesta versão; validar em iPhone/Safari real antes de estabilização.

# v8z4b29BZ

- tweak(ui): remove o bloco superior duplicado de duração na aba Tempo, mantendo o box de resumo (Duração Total / Trechos / Pausas / Acabamento) e os ids/cálculos existentes.
- tweak(ui): separa visualmente "Velocidade constante" do resumo, mantém a legenda sempre visível com o texto exato "Mantém o movimento em ritmo uniforme entre os frames." e preserva a lógica do toggle.
- tweak(ui): move os filtros Todos / Frames / Trechos para cima de "Cena 1", mantendo a lógica/seleção/comportamento da lista; "Cena 1" passa a ler como bloco de conteúdo.
- tweak(ui): reduz o ícone de trecho da lista e do filtro em ~30%, preservando o desenho segmento + dois círculos, cor/traço da família do ícone de frame e números de frame/trecho na mesma cor.
- tweak(ui): aplica fundo #5b5b5b aos botões grandes/equivalentes (Igualar intervalos, Zerar pausas, Aplicar aos 3, Resetar curva e acabamento), mantém bordas finas, reduz altura de ações contextuais e aumenta respiros pontuais.
- tweak(ui): diferencia inputs numéricos dos botões com fundo próprio de campo, padding vertical menor e borda editável mais definida.
- tweak(ui): aumenta toggles/switches em ~22%, melhora contraste do trilho desligado e do thumb, mantendo linguagem iOS-like e sem alterar estado/salvamento.
- tweak(ui): reforça hierarquia de sub-itens configuráveis de Tremor Global na aba Preferências e no painel Movimento; remove duplicidade textual no painel contextual, mantendo apenas "Tremor Global do projeto".
- preserve: sem alteração conceitual/funcional em Tremor, Movimento Inteligente, Velocidade Constante, Pausa Global, Preview, export, JSON, launcher, upload, stage, timeline ou motor.

# v8z4b29BY

- tweak(ui): limpeza visual conservadora dos filtros Todos/Frames/Trechos (`.cena1-filter`) — texto maior (11px → 14px) para leitura, fundo levemente mais claro que o painel (novo token `--surface-filter`, abaixo de `--surface-action` na hierarquia de presença) e borda na mesma cor do fundo (discreta), mantendo a espessura já usada na v8z4b29BX (1.5px); nada de borda 3px/3.5px, sem virar CTA nem aba solta. Altura de referência (`--ctrl-lg-h`) preservada.
- tweak(ui): botões grandes de ação (`.dur-subitem-action`: Zerar pausas, Igualar intervalos) mantêm a altura da referência (`--ctrl-lg-h`, nunca acima dos filtros), ganham presença pelo fundo destacado (`--surface-action`, mais perceptível que o dos filtros) e passam a ter borda discreta — variação mínima do fundo (`--surface3`, 1.5px) no lugar de `--border-action`; borda grossa do teste manual descartada. `:active` preservado.
- tweak(ui): números de frame (`.seq-icon-num`) e de trecho (`.seq-icon-seg-num`) 11px → 12px (legibilidade discreta, sem competir com o valor de tempo); número do trecho aproximado do ícone (gap da coluna `.dur-edit-icon-label` 2px → 1px + `margin-bottom:-4px` em `.seq-icon-seg-num`, entrando na área vazia do topo do SVG) para número + ícone parecerem um único bloco — sem `line-height:0`, sem sobrepor os círculos das extremidades e sem trocar o desenho do ícone. Valores de tempo à direita inalterados.
- tweak(ui): textos auxiliares maiores para leitura no iPhone — `.prefs-note` 12px → 13px (`line-height` 1.5 → 1.35); `#segTimingHint` 12px → 13px (`line-height` 1.35); labels/sublabels uppercase (`.dur-edit-label`, `.dur-subitem-label`, `.dur-sublabel`, `.dur-sublabel-value`) 11px → 12px, mantendo uppercase/tracking/cor secundária (`--text3`) e sem virar título nem deslocar os valores à direita.
- tweak(ui): resumo de duração mais legível (`.dur-summary-row` 12px → 13px nas linhas secundárias, `.dur-summary-row-main` 13px → 14px na linha principal), mantendo a borda discreta do box (1px) — sem virar caixa pesada.
- preserve(ui): abas do painel (`.ds-tab`) mantidas em 15px (sem 18px); botões pequenos contextuais (`#custBarContent .chip`: -5%/+5%/Reset) e campos (`#newSegmentDurationInput`) mantêm os tokens dedicados da v8z4b29BX; `.lower-add-pill` intacto.
- verify(frame): Pausa global (`custGlobalLock.framepause`/`isCustLocked()`) sem travamento e aplicando a todos os frames destravados (escrita direta em `framePauses[]` + `refreshPauseControls()` uma vez por evento; fix da v8z4b29BW preservado); fluxos "global antes" e "global depois" do ajuste mantidos; Preview/export e JSON respeitam os valores. Sem alteração de lógica.
- verify(ui): alinhamento slider/valor/Reset/Global preservado — `#custGlobalLock` alinhado à direita (`align-self:flex-end`), no eixo do Reset.
- preserve: sem alteração conceitual/funcional em Tremor (Global/Desligado/Personalizado, Global e por trecho), Movimento Inteligente, Velocidade Constante, Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher/Novo Projeto, logo, ícone iOS e o motor de renderização.

# v8z4b29BX

- fix(ui): padroniza a coluna de identificação (frames + trechos) na lista de Edição de Tempo — números de frame (`.seq-icon-num`) e de trecho (`.seq-icon-seg-num`) compartilham corpo/peso/cor (`--text2`, 11px, identificação discreta); ícones de frame (`.seq-icon-frame`) e de trecho (`.seq-icon-segment`) compartilham a mesma cor base (`--text3`) e espessura de traço aparente; a coluna (`.dur-edit-icon-label`) tem largura única (56px) para frame e trecho.
- fix(ui): corrige a distorção do ícone de trecho — o símbolo `#i-seq-segment` passa a usar `viewBox` proporcional (24×24 → 32×16), mantendo os círculos das extremidades REDONDOS e o traço com espessura equivalente à do ícone de frame; `.seq-icon-segment` 62×34px → 56×28px (razão 2.0). Número + ícone seguem como um único componente (`.dur-edit-icon-label` em coluna central, `gap` 2px, `line-height:1`).
- tweak(ui): aumenta e padroniza o ícone de trecho no filtro "Trechos" (`.cena1-filter .seq-icon-segment` 28×18px distorcido → 34×17px sem distorção), claramente reconhecível como o mesmo símbolo da lista, na mesma família visual do ícone de "Frames", sem ultrapassar a altura do botão.
- tweak(ui): cria a altura máxima oficial de botões grandes (`--ctrl-lg-h: 40px`), tendo a linha Todos/Frames/Trechos (`.cena1-filter`) como referência — `.dur-subitem-action` (Igualar intervalos, Zerar pausas) 48px → 40px e as `.finish-chip` (Nenhum/Loop/Pausa final) 46px → 40px; nenhum botão grande ultrapassa a referência.
- tweak(ui): diferencia as famílias visuais — botões grandes de AÇÃO (`.dur-subitem-action`) ganham borda mais perceptível (1px → 1.5px) e feedback de toque (`:active`) para parecerem pressionáveis (não abas/filtros); botões pequenos contextuais (`#custBarContent .chip`: -5%/+5%/Reset) recebem fundo (`--surface-action`) e borda (`--border-action`) próprios, menores e uniformes; campo "Intervalo padrão" (`#newSegmentDurationInput`) usa tokens de campo dedicados (`--surface-field`/`--border-field`) para parecer editável, e não um botão.
- tweak(ui): aumenta a legibilidade de textos explicativos/auxiliares (`.prefs-note` 10px → 12px com `line-height` 1.5; dica de Velocidade Constante `#segTimingHint` 10px → 12px), mantendo a hierarquia secundária.
- fix(ui): alinha Reset e Global em bloco de ações à direita nos painéis contextuais de frame — o globo "Aplicar a todos" (`#custGlobalLock`) deixa de ficar centralizado/solto e passa a alinhar à direita (`align-self:flex-end`), no mesmo eixo do Reset.
- verify(frame): reconfirma a correção da v8z4b29BW — slider de Pausa não trava com "Aplicar a todos" ativo (escrita direta em `framePauses[]` + `refreshPauseControls()` uma vez por evento); verify(ui): "Novo Projeto" não quebra linha no menu superior aberto (`fitMenuNewProjectLabel()`). Sem alteração de lógica.
- preserve: sem alteração conceitual/funcional em Tremor (Global/Desligado/Personalizado, Tremor Global e por trecho, intensidade, frequência, herança), Movimento Inteligente, Velocidade Constante, Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção, Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS e o motor de renderização.

# v8z4b29BW

- fix(frame): corrige travamento do slider de Pausa de frame quando "Aplicar a todos" (`custGlobalLock.framepause`/`isCustLocked()`) está ativo — durante o drag (`input`), o valor é escrito direto em `framePauses[]` para todos os frames destravados e `refreshPauseControls()` é chamado UMA única vez por evento (antes, cada tick disparava até `frameCount` × `refreshPauseControls`/`setFramePause`, travando o slider no iPhone/Safari); ao soltar (`change`), aplica o valor final, marca o projeto como sujo, sincroniza `finishMode` e re-renderiza uma única vez. Fluxos "global antes do ajuste" e "global depois do ajuste" continuam aplicando a todos os frames destravados; não afeta `segDurations[]`, rotação, posição, escala ou tremor.
- fix(ui): impede quebra de linha em "Novo Projeto" no menu superior aberto (`#settingsSheet`) — nova `fitMenuNewProjectLabel()` troca o texto para "Novo" (`#menuNewProjectLabel`) se "Novo Projeto" não couber em uma linha, sem alterar `onclick`/fluxo do item (launcher mantém `fitNovoProjetoLabel()` já existente, inalterado).
- tweak(ui): ícone de trecho (segmento com dois círculos) no filtro "Trechos" fica mais largo e reconhecível (`.cena1-filter .seq-icon-segment` 20×20px → 28×18px), sem aumentar a altura do botão; ícone de "Frames" inalterado (20×20px).
- fix(ui): número + ícone de trecho na lista de Edição de Tempo formam definitivamente um único item visual — `.dur-edit-icon-label` estreitada (64px → 56px, liberando largura extra para os sliders) e `gap` zerado entre `.seq-icon-seg-num` e `.seq-icon-segment` (número acima, ícone abaixo, sem sobrepor).
- tweak(ui): botões grandes de ação (`.dur-subitem-action`: Igualar intervalos, Zerar pausas) ganham altura padronizada (48px, via flexbox) e tons dedicados de fundo/borda (`--surface-action`/`--border-action`), distintos das abas/filtros (`--surface2`/`--border2`); botões pequenos contextuais (ex.: "Reset" da Pausa) mantêm o padrão menor (30px) com os mesmos tons; campo "Intervalo padrão" (`#newSegmentDurationInput`) também usa os tons de campo.
- tweak(ui): espaçamento ENTRE grupos do painel Edição de Tempo (`.dur-section-header`, `margin-top` 2px → 14px) para separar visualmente Cena 1 / Trechos — Duração / Frames — Pausas / Acabamento, sem alterar o espaçamento DENTRO de cada grupo.
- preserve: sem alteração funcional em Tremor (Global/Desligado/Personalizado), Movimento Inteligente, Velocidade Constante, Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção, Preview/export MP4, JSON (antigo e novo) e motor de renderização.

# v8z4b29BV

- fix(ui): remove o recuo lateral esquerdo excessivo da lista do painel Edição de Tempo (`.dur-edit-icon-label` 84px → 64px, `gap` 2px → 1px), devolvendo largura útil aos sliders.
- tweak(ui): reduz o ícone de trecho a ~80% do tamanho da v8z4b29BU (`.seq-icon-segment` 78×42px → 62×34px, ainda maior que o tamanho pré-BU de 39×21px), aproximando o número do trecho do ícone para formar um único bloco visual.
- tweak(ui): reduz o destaque dos números de frame (`.seq-icon-num` 14px → 10px) e de trecho (`.seq-icon-seg-num` 15px → 11px) para identificação discreta, preservando o destaque dos valores de tempo (`.dur-edit-value`).
- tweak(ui): compacta novamente o espaçamento vertical da lista (`.dur-edit-row` padding 6px → 4px, gap 10px → 8px) e dos blocos do painel Edição de Tempo (`.dur-section-header`, `.dur-section-body`, `.dur-subitem`, `.dur-sublabel-row`, `.dur-subitem-action`, `.dur-summary-box`, `.dur-velocity-block`), sem alterar cálculos, sliders ou valores.
- fix(ui): compacta novamente o painel contextual "Tempo do trecho" (`#panelSegTime`), reduzindo margens do handle/cabeçalho e padding do bloco Duração para eliminar o vazio inferior remanescente.
- fix(frame): corrige "Aplicar a todos" no painel de Pausa de frame — o slider local de pausa agora respeita `custGlobalLock.framepause`/`isCustLocked()`, aplicando o valor a todos os frames destravados tanto ao ligar o global antes do ajuste (`toggleCustGlobalLock`) quanto ao ligar depois de já ter ajustado o slider.
- tweak(ui): impede quebra de linha em "Novo Projeto" no launcher (`white-space:nowrap`); quando o texto não cabe em uma linha, `fitNovoProjetoLabel()` troca para "Novo", sem alterar o fluxo do botão.
- preserve: sem alteração funcional em Tremor (Global/Desligado/Personalizado), Movimento Inteligente, Velocidade Constante, Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção, Preview/export MP4, JSON (antigo e novo) e motor de renderização.

# v8z4b29BU

- tweak(ui): amplia ~2x o ícone de trecho no painel Edição de Tempo (`.seq-icon-segment` 39×21px → 78×42px, `.seq-icon-seg-num` 13px → 15px), mantendo o número do trecho acima do ícone e a leitura de trechos com dois dígitos (10–11, 12–13, 24–25, 30–31); amplia a coluna de ícones (`.dur-edit-icon-label`, 50px → 84px) para o ícone não encostar no slider.
- tweak(ui): compacta o espaçamento vertical da lista e dos blocos de Edição de Tempo — `.dur-edit-row` (padding 14px → 6px), `.dur-section-header` (padding 14px 0 10px → 10px 0 8px), `.dur-section-body`, `.dur-subitem`, `.dur-subitem-action`, `.dur-sublabel-row`, `.dur-velocity-block` e `.dur-summary-box`, sem alterar lógica de cálculo, sliders ou valores.
- fix(ui): compacta o painel contextual "Tempo do trecho" (`#panelSegTime`) reduzindo a margem do handle/cabeçalho e o padding do bloco Duração, eliminando o vazio inferior e seguindo a mesma densidade dos painéis contextuais compactos já existentes.
- tweak(ui): padroniza a ordem universal de toggles e ícones "Aplicar a todos"/globo para sempre aparecerem depois do título — Velocidade Constante, Movimento/Rotação/Escala Inteligente e Tremor Global (Preferências e painel Movimento).
- tweak(ui): corrige a hierarquia tipográfica de "Velocidade constante", "Movimento inteligente" e "Tremor" (nova classe `.dur-item-title`) para visual de item principal — caixa alta e baixa, fonte branca, sem tracking/uppercase de cabeçalho de seção.
- feat(ui): expõe o ícone "Aplicar a todos" (globo `#custGlobalLock`, lógica `toggleCustGlobalLock`/`custGlobalLock`/`isCustLocked` já existente em JS) nos painéis de frame Pausa, Rotação, Escala e Mover/Posição.
- preserve: sem alteração funcional em Tremor (Global/Desligado/Personalizado), Movimento Inteligente, Velocidade Constante, Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção, Preview/export MP4, JSON (antigo e novo) e motor de renderização.

# v8z4b29BT

- tweak(ui): aumenta em ~50% os ícones de frame e trecho na lista de Edição de Tempo (`.seq-icon-frame` 26px → 39px, `.seq-icon-segment` 26×14px → 39×21px), incluindo os números (`.seq-icon-num`/`.seq-icon-seg-num`), para manter a legibilidade com números de dois dígitos (10, 12, 24, 30, 30–31...) em projetos com muitos frames.
- tweak(ui): amplia a coluna reservada aos ícones (`.dur-edit-icon-label`, 34px → 50px) para acomodar o ícone maior sem encostar no slider e sem empurrar o valor em segundos para fora.
- tweak(ui): ajusta proporcionalmente (16px → 20px) os ícones de Frames/Trechos do filtro secundário (Todos/Frames/Trechos), sem alterar a altura dos botões.
- preserve: mantém painel Edição de Tempo, painel contextual de Tempo/Movimento do trecho, Tremor (Global e por trecho), Stage, timeline, Preview/export, JSON e motor sem alterações funcionais.

# v8z4b29BS

- fix(ui): padroniza o painel contextual de Tempo do trecho (`#panelSegTime`) com a mesma família visual dos painéis compactos de frame — cabeçalho com handle, título e botão check na mesma linha (`.dur-header-row`), mesma densidade de slider/valor e altura compatível com o conteúdo (sem área vazia).
- feat(ui): adiciona ajuste global de duração ("Aplicar a todos os trechos") no painel Tempo do trecho, reaproveitando o mesmo padrão "Aplicar a todos" (`segGlobalMode`/`setSegEaseAll`) já usado no painel Movimento — afeta apenas durações de trechos, sem tocar pausas, tremor, curvas, movimento inteligente, escala ou rotação.
- fix(ui): no painel Edição de Tempo, o resumo de duração passa a viver somente dentro da aba Tempo (sem duplicação em Preferências), sem alterar os cálculos.
- fix(ui): reposiciona as abas Tempo / Preferências para o topo do conteúdo do painel Edição de Tempo, logo abaixo do cabeçalho (handle + título + check).
- fix(ui): destaca visualmente o bloco de resumo (Duração Total / Trechos / Pausas / Acabamento) com borda discreta e divisória sutil separando o total do detalhamento.
- tweak(ui): Velocidade Constante vira um toggle simples (desligado = Manual, ligado = Velocidade Constante), preservando exatamente `setSegmentTimingMode`/`syncTimingModeUI`.
- feat(ui): adiciona ícones de frame (número dentro do ícone) e de trecho (segmento com dois círculos nas extremidades, número acima do ícone) na lista de Edição de Tempo, e nos filtros Frames/Trechos.
- preserve: mantém a separação Tempo/Movimento dos trechos, Tremor (Global e por trecho), Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção, Preview/export MP4, JSON (antigo e novo) e o motor de renderização sem alterações funcionais.

# v8z4b29BR

- fix(ui): reduz a área fixa do painel Edição de Tempo para handle, título e botão check — resumo de duração, Velocidade Constante, abas Tempo/Preferências e o restante do conteúdo passam a rolar junto, ganhando mais espaço útil para a lista de frames/trechos.
- fix(ui): separa os painéis contextuais de trecho — o botão **Tempo** abre um painel focado apenas em identificação do trecho (ex.: SEG. 2–3) e duração; o botão **Movimento** abre o painel com Velocidade / Rotação / Escala, Movimento Inteligente, curvas e Tremor.
- fix(ui): recupera o Tremor Global do projeto no painel Movimento do trecho (controles espelhados que leem/escrevem o mesmo estado `projectShake`), mantendo também o controle local Global / Desligado / Personalizado e o bloco já existente em Preferências.
- fix(ui): refina o design system de abas (`.ds-tab-bar` / `.ds-tab`) — aba ativa com linha grossa ciano, abas inativas com linha fina discreta, sem novo fundo/pill.
- preserve: mantém Stage, timeline, Tremor (Global e por trecho), Preview/export, JSON e motor sem alterações funcionais.

# v8z4b29BQ

- fix(ui): fixa cabeçalho, resumo, Velocidade Constante e abas no painel Edição de Tempo — apenas a lista de frames/trechos abaixo das abas rola.
- fix(ui): reposiciona Velocidade Constante como controle temporal (área fixa da aba Tempo), fora de Preferências.
- feat(ui): consolida padrão visual de abas (`.ds-tab-bar` / `.ds-tab`) — texto grande, aba ativa com sublinhado e divisória fina abaixo do conjunto.
- fix(ui): aplica o padrão de abas ao painel contextual de trechos (Velocidade / Rotação / Escala).
- preserve: mantém Stage, timeline, Tremor (Global e por trecho), Preview/export, JSON e motor sem alterações funcionais.

# v8z4b29BP

- feat(ui): reorganiza o painel "Edição" em **Edição de Tempo**, com abas **Tempo** e **Preferências**.
- feat(ui): adiciona resumo fixo no topo com Duração Total, Trechos, Pausas e Acabamento (reflete o estado real do projeto).
- feat(ui): apresenta a sequência de frames e trechos intercalada e agrupada como **Cena 1** (F1, 1–2, F2, 2–3, …), com filtro Todos / Frames / Trechos.
- feat(ui): mantém os controles globais (Frames – Pausas, Trechos – Duração, Acabamento) na aba Tempo.
- feat(ui): prepara a aba Preferências com a distribuição de tempo (Velocidade Constante) e o Tremor Global do projeto; reserva espaço para preferências futuras.
- preserve: não implementa multi-cena real (apenas o agrupamento visual Cena 1); mantém Stage, timeline, frames/trechos, curvas, seleção, Tremor (motor e por trecho), Preview/export MP4, JSON e o motor de renderização sem alteração estrutural.

# v8z4b29BO

- feat(motion): adiciona Tremor Global do projeto.
- feat(motion): adiciona controle de Frequência ao Tremor/Handheld.
- feat(motion): permite trechos herdarem Global, desligarem ou usarem Tremor personalizado.
- feat(json): salva e reabre configuração global e por trecho de Tremor.
- preserve: mantém frames, curvas, timeline, launcher, ícones, Preview/export, JSON antigo e motor principal sem regressão.

# v8z4b29BN

- feat(motion): adiciona efeito experimental de Tremor por trecho.
- feat(ui): adiciona toggle e intensidade para Tremor no contexto de edição de trecho.
- feat(export): mantém o efeito de Tremor de forma determinística em Preview e MP4.
- preserve: mantém frames, curvas, timeline, launcher, Preview/export, JSON e motor principal sem refatoração ampla.

# v8z4b29BM

- feat(brand): adiciona logo do Arco Motion ao launcher/página inicial.
- feat(ios): configura apple-touch-icon com asset local para Tela de Início do iOS.
- tweak(ui): renomeia item "Tempo" para "Edição" mantendo ícone e função.
- preserve: mantém Stage, timeline, fluxo Novo Projeto/Abrir Projeto, Preview/export, JSON e motor sem alterações.

# v8z4b29BL

- fix(state): sincroniza frame ativo do Stage com frame destacado na timeline.
- fix(ui): impede divergência visual entre frame ativo, destaque da faixa e label inferior.
- fix(selection): remove destaque fantasma ao trocar de frame ativo.
- preserve: mantém seleção múltipla, trechos, ícones Iconoir (cinema-old, director-chair), Stage, timeline, Preview/export, JSON e motor.

# v8z4b29BK

- feat(icon): substitui ícone de Arquivos do topo por Iconoir cinema-old.
- feat(icon): substitui ícone de Tempo/Duração da 4ª linha por Iconoir director-chair.
- preserve: mantém layout, Stage, timeline, Preview/export, JSON e motor sem alterações.

# v8z4b29BJ

- fix(ui): reposiciona aviso de confirmação/cancelamento de frame para longe do topo e do pill de zoom.
- fix(ui): fecha painel de Duração/Tempo ao acionar qualquer item do menu superior.
- fix(ui): alinha à esquerda os ícones contextuais de trecho na 4ª linha do menu inferior.
- tweak(timeline): aumenta levemente a largura visual de frames e trechos na faixa.
- feat(icon): troca ícone de Arquivos do topo para rolo de filme.
- feat(icon): troca ícone de Tempo/Duração na faixa inferior para cadeira de diretor.
- preserve: mantém launcher, Stage, timeline, templates, Preview/export, JSON e motor sem regressões.

# v8z4b29BI

- fix(flow): remove a etapa intermediária "Imagem" do fluxo Novo Projeto.
- fix(flow): move "Escolher imagem" diretamente para o fluxo Novo Projeto após Formato e Template.
- fix(ux): bloqueia toda a interface durante criação/inserção de frame.
- fix(ux): mostra "Confirme ou cancele o frame atual." ao tocar em controles bloqueados.
- preserve: mantém launcher independente, editor/Stage, templates, timeline, Preview/export, JSON e motor.

# v8z4b29BH

- fix(flow): remove duplicidade de Fototeca/Tirar Foto/Escolher Arquivo na etapa Imagem do Novo Projeto.
- feat(launcher): adiciona ação discreta de Recarregar App na página inicial.
- fix(editor): botão X do Stage passa a fechar o projeto e voltar ao launcher com aviso de possível perda.
- preserve: mantém separação launcher → Novo Projeto → editor e preserva Stage, timeline, templates, Preview/export, JSON e motor.

# v8z4b29BG

- fix(flow): separa launcher, fluxo de Novo Projeto e editor/Stage em estados distintos.
- feat(flow): recarregar o app volta sempre para página inicial independente.
- fix(flow): Stage só é exibido após criar ou abrir projeto funcional.
- fix(flow): Novo Projeto roda fora do Stage e não mostra projeto anterior durante escolha de imagem.
- fix(state): impede Stage vazio, timeline com 0 frames e perda do fluxo ao tocar no Stage durante criação.
- preserve: mantém editor, Stage, timeline, templates, Preview/export, JSON e motor sem alterações funcionais.

# v8z4b29BF

- feat(flow): substitui a entrada inicial antiga por launcher simples Novo Projeto / Abrir Projeto.
- feat(flow): Novo Projeto chama o fluxo Formato → Template → Imagem → Criar.
- feat(flow): Abrir Projeto chama seletor de JSON/projeto salvo.
- feat(safety): adiciona aviso de possível perda ao iniciar Novo Projeto a partir de projeto aberto.
- fix(flow): impede reuso da tela antiga Imagem/Projeto dentro do fluxo Novo Projeto.
- preserve: não cria Home completa e preserva Stage, timeline, curvas, Preview/export, JSON e motor.

# v8z4b29BE

- fix(flow): corrige a sincronização final do Novo Projeto criado com qualquer template.
- fix(template): frames de Pan, Círculo e demais templates aparecem imediatamente no Stage e na timeline.
- fix(state): elimina o estado dividido entre frames internos do template e frames oficiais do projeto.
- fix(ui): impede "0 frames" após criação com template válido.
- fix(reset): Reset Project passa a restaurar corretamente o novo projeto criado com template.
- preserve: mantém fluxo Formato → Template → Imagem e preserva Stage, timeline visual, curvas, Preview/export, JSON e motor.

# v8z4b29BD

- feat(flow): evolui Novo Projeto para fluxo interno Formato → Template → Imagem → Criar.
- feat(flow): Novo Projeto só substitui o projeto atual após a nova imagem carregar com sucesso.
- fix(state): novo projeto não herda frames, curvas, pausas, duração ou vínculo com JSON anterior.
- feat(template): aplica template escolhido no nascimento do projeto, ou cria F1 ativo quando "Sem template".
- preserve: mantém app sem Home/página inicial e preserva Stage, timeline, curvas, Preview/export, JSON e motor.

# v8z4b29BC

- fix(ui): aproxima a faixa superior (frameHud) do frame ativo da moldura do frame, reduzindo a distância vertical e o espaçamento da faixa flutuante.
- fix(ui): melhora o alinhamento horizontal da faixa superior com os pontos/abas superiores do frame ativo.
- fix(ui): reduz o padding interno da faixa superior (3px 16px → 2px 10px), preservando o espaçamento entre pausa, rotação e escala da v8z4b29BA.
- fix(ui): diminui o tamanho visual das 4 abas/pontos circulares do frame ativo (22px → 18px), preservando exatamente a posição de seus centros e a área de toque de 44px.
- fix(ui): torna a cruz central do frame ativo escalável com o tamanho do frame, usando o mesmo clamp de escala (0.58–1) já aplicado às abas.
- fix(menu): reorganiza o menu superior/overlay de ajustes em grade de 4 colunas.
- fix(menu): renomeia "Novo arquivo" para "Novo Projeto" no menu superior, preservando a função existente.
- fix(menu): move "Novo Projeto" para a linha final de arquivos (Salvar, Novo Projeto, Abrir, Recarregar).
- preserve: motor, timeline/menu inferior, Preview/export/MP4, JSON, curvas/Bézier, clamp de criação de frames, Novo Projeto guiado/Home, lógica dos handles/abas.

# v8z4b29BB

- fix(ui): remove o aspecto de pill arredondado do fundo do texto superior do frame ativo no Stage.
- fix(ui): remove o pill separado de ângulo, mantendo a leitura do ângulo apenas no topo do frame.
- preserve: abas circulares, Stage, timeline, curvas, preview/export, JSON e motor.

# v8z4b29BA

- fix/ui: aumenta o espaçamento entre pausa, rotação e escala no topo do frame ativo (HUD visor — flex com gap, mais arejado e legível no iPhone).
- fix/ui: reduz aproximadamente 10% o tamanho visual das 4 abas circulares do frame ativo (24px → 22px), preservando exatamente a posição de seus centros e mantendo a área de toque de 44px.
- preserva a correção da v8z4b29AZ que impede novos frames de nascerem fora do Stage.
- preserva: timeline/menu inferior, curvas, Preview/export, JSON, motor de animação.

# v8z4b29AZ

- fix/stage: ajusta automaticamente a posição inicial de frames novos para impedir que nasçam fora da área útil do Stage (clamp com margem de 12px em todas as bordas).
- fix/ui: aplica a nova interface de 4 abas/círculos também ao frame novo, ghost e inserção assistida — mesmo visual do frame ativo.
- fix/ui: remove retorno visual da bolinha/handle azul-ciano no fluxo de criação de frame; globalHandle ciano não aparece mais em modo ghost.
- feat: corner handles em modo ghost iniciam ghost scale/rotate (mesma lógica do globalHandle), mantendo funcionalidade e adicionando consistência visual.
- preserva timeline/menu inferior, curvas, Preview/export, JSON e motor sem alterações.

# v8z4b29AY

- fix/ui: refina visual dos 4 handles/abas do frame ativo para seguir o mockup de visor/câmera.
- fix/ui: reduz tamanho visual das abas (36px → 24px), mantendo área de toque 44px adequada no iPhone.
- fix/ui: reposiciona abas para fora da borda do frame (offset externo de 12px), com respiro visual.
- fix/ui: suaviza a leitura superior de pausa, rotação e escala (faixa cinza translúcida, sem pill preto pesado).
- fix/ui: ajusta mira central (30px, mais visível) e preserva número do frame sem sobreposição.
- preserva a lógica funcional da v8z4b29AX sem alterar motor, timeline, curvas, Preview/export ou JSON.

# v8z4b29AX

- feat/ui: substitui o handle azul/ciano do frame ativo no Stage por 4 círculos/abas ativos nos cantos (TL, TR, BL, BR).
- feat/ui: os 4 círculos reaproveitam a mesma lógica e motor de transformação do handle anterior (escala + rotação), sem criar novo motor.
- feat/ui: adiciona leitura superior de pausa, rotação e escala no frame ativo (HUD visor/câmera) — somente informativa, sem painel ou menu.
- feat/ui: adiciona mira central discreta no frame ativo, reforçando a metáfora de visor/câmera.
- preserva base funcional v8z4b29AW, sem alterar timeline, motor, curvas, Preview/export, JSON ou fluxo principal.

# v8z4b29AW

- ux: consolida a regra de iniciar projetos por imagem já com Frame 1 criado, numerado e ativo.
- fix/ui: reposiciona a UI de confirmação da inserção assistida para a camada de overlay do Stage, impedindo que acompanhe a imagem.
- preserva base funcional v8z4b29AV e menus contextuais ancorados ao Stage da v8z4b29AU.

# v8z4b29AV

- feat/flow: adiciona Novo arquivo simples no menu interno do editor.
- ux: Novo arquivo pede confirmação e só substitui o projeto atual após a nova imagem carregar com sucesso.
- fix/state: Novo arquivo cria estado limpo com F1 assistido, sem herdar frames, curvas, timeline ou vínculo com JSON anterior.
- preserva base v8z4b29AU, sem reintroduzir Home/Novo Projeto guiado.

# v8z4b29AU
- fix/ui: reposiciona menus contextuais de frame e curva para a camada de UI do Stage, impedindo que acompanhem a imagem/conteúdo transformado.
- fix/ux: mantém menus contextuais acima do menu inferior, sem cobrir a timeline e referenciados ao Stage/viewport.
- preserva base v8z4b29AE pós-revert #262, sem reintroduzir Home/Novo Projeto guiado.

# v8z4b29AE
- fix/ux: reduz o offset interno do número dos frames no Stage quando os frames são pequenos.
- fix/ux: preserva a escala proporcional da v8z4b29AD, mas aproxima o label do número do canto do frame.
- preserva timeline/menu inferior, curvas, handles, Preview/export, JSON e motor.

# v8z4b29AO
- fix/ux: audita e restaura, quando necessário, a escala proporcional dos elementos internos dos frames no Stage introduzida na v8z4b29AL.
- fix/ux: garante que `--stage-frame-ui-scale` e `updateStageFrameUIScale()` continuem ativos em `renderAll()` e também no caminho de atualização visual do Stage `refreshEditorViewVisualOverlays()`.
- preserva menu de curvas da v8z4b29AN, Tangente, Global, timeline/menu inferior, pontos laranja, snap-to-center, Preview/export, JSON e motor.

# v8z4b29AN
- ux: reorganiza o menu de curvas com todos os ícones dentro do mesmo pill.
- ux: aumenta os ícones de curva e suaviza a espessura do traço.
- ux: implementa Global como modo armado com feedback “Clique em um modo”.
- feat: renomeia a suavização automática para Modo Tangente, usando ícone Lucide “tangent”.
- feat: Modo Tangente recalcula handles pela tangente local derivada dos frames vizinhos para normalizar curvas após edição rápida.
- ux: Tangente é local por padrão e só aplica a todos quando Global está armado.
- preserva timeline/menu inferior, menus deslizantes da v8z4b29AF, pontos laranja da v8z4b29AH, snap, Alpha, Preview/export, JSON e motor.

## v8z4b29AM
- ux: aumenta e refina os ícones do menu de curvas.
- ux: separa a ação Global dos modos de curva e implementa Global como modo armado.
- feat: adiciona reconstrução suave das curvas baseada na bissetriz do ângulo entre frames.
- preserva timeline/menu inferior, menus deslizantes da v8z4b29AF, pontos laranja da v8z4b29AH, Preview/export, JSON e motor.

## v8z4b29AL — escala proporcional dos elementos internos dos frames do Stage

- `index.html`: versionamento atualizado para `v8z4b29AL` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: `.frame` passa a expor `--stage-frame-ui-scale`, calculada por `updateStageFrameUIScale()` a partir do menor lado renderizado do próprio frame no Stage, com referência `180px` e limite seguro `0.58–1`.
- `index.html`: `.frame-border` usa a escala apenas no `border-radius`; a espessura da borda continua definida pela lógica aprovada de foco/seleção e não foi reduzida.
- `index.html`: `.frame-num` usa a escala proporcional em `font-size`, `padding`, `border-radius` e offsets `top/left`, mantendo o posicionamento conceitual no canto superior esquerdo.
- Preservados sem alteração: `.fp`, `.mid-bar.timeline-grid .fp`, `#pillsRow`, `.mid-pills`, timeline/menu inferior, menus deslizantes da `v8z4b29AF`, pontos laranja centralizados da `v8z4b29AH`, reversão/limpeza da `v8z4b29AK`, snap, Alpha, Preview/export, JSON, curvas e motor.

## v8z4b29AK — limpeza seletiva dos frames da timeline/menu inferior

- `index.html`: versionamento atualizado para `v8z4b29AK` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: removidas da regra `.mid-bar.timeline-grid .fp` as variáveis proporcionais indevidas criadas na `v8z4b29AI` para os frames da timeline/menu inferior (`--timeline-frame-*` e lógica equivalente), restaurando largura, altura, raio, padding, fonte e borda pelo padrão fixo anterior com `--fp-w:34px` e `--fp-h:44px`.
- `index.html`: verificado que não há resíduos da `v8z4b29AJ` para escala JS da timeline (`lowerTimelineFrameScale`, `syncLowerTimelineFrameScale()` ou `scheduleLowerTimelineFrameScale()`), e os listeners de `resize`/`orientationchange` continuam apontando diretamente para `syncLowerTimelineCenterMarkers()`.
- `CHANGELOG.md`, `QA.md` e `docs/QA-v8z4b29AK.md`: registrado que a `v8z4b29AJ` já foi revertida manualmente; a parte indevida da `v8z4b29AI` sobre timeline/menu inferior foi removida; a escala proporcional correta dos frames do Stage (`.frame`, `.frame-visual`, `.frame-border`, `.frame-num`) permanece pendente e fora do escopo desta versão.
- Preservados sem alteração: menus deslizantes da `v8z4b29AF`, pontos laranja centralizados da `v8z4b29AH`, snap-to-center, `timelineFocalFrameId`, scroll da timeline, Alpha/spotlight, Preview/export/MP4, JSON, curvas existentes e motor.

## v8z4b29AI — ajustes do pill de curvas e frames da timeline

- `index.html`: versionamento atualizado para `v8z4b29AI` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `assets/icons/curve-modes/*.svg`: espessura dos ícones do pill/menu de curvas reduzida para alinhar ao padrão visual leve dos demais ícones do app, mantendo desenho, tamanho, cor, posição e comportamento.
- `index.html`: adicionado ícone global sem texto dentro do mesmo `#pointModeMenu`; `applyCurrentCurveModeToAllFrames()` lê o modo de curva do frame/ponto ativo e aplica esse modo aos frames editáveis usando `applyPointModeForFrame()`, sem copiar coordenadas absolutas de handles, sem mover frames e com undo/redo em uma única ação.
- `index.html`: `.mid-bar.timeline-grid .fp` passa a usar variáveis proporcionais para largura/altura, fonte, padding e raio dos frames da timeline, preservando a borda, os estados ativo/selecionado, snap, pontos laranja da `v8z4b29AH` e menus deslizantes da `v8z4b29AF`.
- `QA.md` e `docs/QA-v8z4b29AI.md`: checklist de validação documenta pill de curvas, ação global, undo/redo, proporcionalidade da timeline e regressões obrigatórias.

## v8z4b29AH — alinhamento dos pontos ao pill focal real

- `index.html`: versionamento atualizado para `v8z4b29AH` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: `syncLowerTimelineCenterMarkers()` passa a localizar o frame/pill focal real em `#pillsRow` (`.fp.timeline-focal`, `.fp.active`, `.fp.selected` ou `timelineFocalFrameId`) e calcula `--lower-timeline-center-x` pelo `getBoundingClientRect()` do pill focal em relação a `.lower-timeline-slot`; o centro funcional de `#pillsRow` fica apenas como fallback.
- `index.html`: a sincronização dos pontos também roda após atualização das classes do pill focal e durante scroll manual da faixa, preservando snap, menus, seleção múltipla, Linha 3/Linha 4/Coluna 2, Alpha, Preview/export, JSON, curvas e motor.
- `QA.md` e `docs/QA-v8z4b29AH.md`: checklist de validação documenta Frame 1, frame intermediário, Frame 5, último frame acessível, snap e menus da `v8z4b29AF`.

## v8z4b29AG — alinhamento dos pontos centrais da timeline

- `index.html`: base obrigatória preservada a partir da `v8z4b29AF`, mantendo intacta a correção aprovada dos menus deslizantes da seleção de frames e sem alterar Linha 3 / Linha 4 / Coluna 2.
- `index.html`: versionamento atualizado para `v8z4b29AG` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: `syncLowerTimelineCenterMarkers()` passa a calcular `--lower-timeline-center-x` com o mesmo eixo horizontal funcional de `#pillsRow` usado pelo snap (`pillsEl.clientWidth / 2`), em vez de usar a largura visual do retângulo do container; `.lower-timeline-slot::before` e `.lower-timeline-slot::after` continuam usando a variável e `translateX(-50%)`.
- Preservados sem alteração: snap-to-center, `timelineFocalFrameId`, Alpha/spotlight, Preview/export/MP4, JSON, curvas, motor, seleção múltipla, menus deslizantes, `#alignBarSubmenu`, `#custBar`, `#custBarContent` e arquitetura da Linha 3 / Linha 4 / Coluna 2.
- `QA.md` e `docs/QA-v8z4b29AG.md`: medição obrigatória com `getBoundingClientRect()` e checklist visual/manual documentados.

## v8z4b29AF — estabilidade da Linha 4 / Coluna 2 em seleção múltipla

- `index.html`: base preservada a partir da `v8z4b29AE`; registrado que a `v8z4b29AE` não foi aprovada visualmente para este problema, pois não alterou o deslocamento aparente da Linha 4 / Coluna 2 ao entrar em seleção múltipla. A microcorreção da `v8z4b29AD` em `#alignBarSubmenu` permanece intacta.
- `index.html`: versionamento atualizado para `v8z4b29AF` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: medição com `getBoundingClientRect()` mostrou que `#lowerContextSlot` (Linha 4 / Coluna 2) já mantinha o mesmo retângulo nos dois estados, mas o conteúdo visível (ícones/labels de Pausa, Rotação, Escala, Mover) aparecia ~4px mais baixo dentro de `#alignBar` do que dentro de `#toolbar`, porque `#alignBarPrimary`/`#alignBarActions` usavam `align-items:flex-end` e `.ab-tab` usava `justify-content:flex-end` (alinhamento herdado do antigo `#alignBar` flutuante), enquanto `#toolbar .tb-item` centraliza o conteúdo verticalmente.
- `index.html`: dentro de `.mid-bar.timeline-grid`, `#alignBarPrimary.ab-primary-strip` e `#alignBarActions` passam a usar `align-items:stretch` e `#alignBarActions .ab-tab` passa a usar `justify-content:center`, reproduzindo a centralização vertical de `#toolbar .tb-item` e eliminando o deslocamento visual de ~4px da Linha 4 / Coluna 2 ao entrar em seleção múltipla — sem alterar altura, padding, gap, margin, `grid-row` ou posição de `#lowerContextSlot`/`#alignBar`.
- `index.html`: `Selecionar todos` continua isolado em área pré-alocada (`--lower-select-all-w`) na Linha 3 / Coluna 2, sem participar do fluxo vertical da Linha 4; `#alignBarSubmenu`, `#custBar`, `#custBarContent`, Pausa/Rotação/Escala/Mover, safe-area, snap-to-center, Alpha/spotlight, `timelineFocalFrameId`, Preview/export/MP4/JSON/curvas/motor preservados sem alteração.
- `QA.md` e `docs/QA-v8z4b29AF.md`: medições de `getBoundingClientRect()` (Estado A vs. Estado B), checklist de aceite e ciclo de regressão (3x) documentados.

## v8z4b29AE — camada inferior unificada de submenus

- `index.html`: base preservada a partir da `v8z4b29AD`; a microcorreção de `#alignBarSubmenu` continua no fluxo de seleção múltipla, agora usando a mesma variável estrutural de altura da área inferior contextual.
- `index.html`: versionamento atualizado para `v8z4b29AE` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- `index.html`: adicionadas `--lower-context-gap` e `--lower-context-panel-h` para que o painel contextual inferior seja calculado como um sistema único de Linha 3 + gap + Linha 4, sem depender de correção residual `- 8px`.
- `index.html`: `#alignBarSubmenu` continua ancorado em `bottom:0`, com `overflow-y:visible`, e passa a usar `height/min-height:var(--lower-context-panel-h)`; `#custBarContent`, elemento real do submenu de frame simples, usa a mesma área real de `#lowerContextSlot` expandido, sem padding inferior extra em `#lowerContextSlot`.
- `index.html`: Linha 3 / Coluna 2 mantém `Selecionar todos` em área reservada absoluta (`--lower-select-all-w`) e Linha 4 / Coluna 2 não passa pelo fluxo desse botão; snap, Alpha/spotlight, Preview/export, JSON, curvas e motor preservados.
- `QA.md` e `docs/QA-v8z4b29AE.md`: auditoria, critérios de medição e checklist da v8z4b29AE documentados.

## v8z4b29AD — ancoragem do submenu de seleção múltipla

- `index.html`: base encontrada antes das alterações em `v8z4b29AB`; registrado que a v8z4b29AB não foi aprovada funcionalmente para o bug visual dos submenus de seleção múltipla.
- `index.html`: versionamento atualizado para `v8z4b29AD` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: a regra `.mid-bar.timeline-grid #alignBar.align-submenu-open #alignBarSubmenu` passa a ancorar o submenu em `bottom:0`, reduzindo a altura para `calc(var(--lower-row-3) + var(--lower-row-4) - 8px)` e ajustando o padding interno sem recorrer a `#custBar`/`cust-expanded`.
- `index.html`: preservados snap, Alpha/spotlight, Preview/export, JSON, curvas e motor.
- `QA.md` e `docs/QA-v8z4b29AD.md`: checklist/inventário da v8z4b29AD documentado.

## v8z4b29AB — estabilidade real da Linha 3/4 em seleção múltipla

- `index.html`: base `v8z4b29W` confirmada antes das alterações e versionamento atualizado para `v8z4b29AB` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: Linha 3 / Coluna 2 passa a reservar largura fixa suficiente para `Selecionar todos`, mantendo o controle em uma linha, com texto antes do ícone e sem reduzir fonte como solução principal.
- `index.html`: `#lowerContextSlot`, `#toolbar` e `#alignBar` preservam o mesmo retângulo-base da Linha 4 / Coluna 2; seleção múltipla alterna visibilidade/conteúdo sem mudar origem, largura, padding, margin ou gap da Linha 4.
- `QA.md` e `docs/QA-v8z4b29AB.md`: checklist/inventário da v8z4b29AB documentado.

## v8z4b29W — estabilidade da Linha 4 e marcadores centrais

- `index.html`: base `v8z4b29V` confirmada e versionamento atualizado para `v8z4b29W` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: `#lowerSelectionActions` passa a ocupar uma área fixa reservada na Linha 3 / Coluna 2, alternando visibilidade sem alterar a altura da linha nem empurrar `#lowerContextSlot`/`#alignBar` na Linha 4.
- `index.html`: marcadores centrais de `.lower-timeline-slot` passam a ser alinhados ao centro real de `#pillsRow`, preservando o snap funcional e apenas sincronizando o eixo visual usado pelas bolinhas.
- `QA.md` e `docs/QA-v8z4b29W.md`: checklist/inventário da v8z4b29W documentado.

## v8z4b29V — ajuste residual inferior

- `index.html`: base `v8z4b29U` confirmada e versionamento atualizado para `v8z4b29V` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: submenus inferiores de Pausa, Rotação, Escala e Mover passam a usar um respiro visual comum acima da home indicator sem recontar `env(safe-area-inset-bottom)`.
- `index.html`: `Selecionar todos` na Linha 3 sai do fluxo vertical da célula contextual, preservando a altura da Linha 3 e a posição da Linha 4 em seleção simples e múltipla.
- `QA.md` e `docs/QA-v8z4b29V.md`: checklist/inventário da v8z4b29V documentado.

## v8z4b29U — arquitetura dos submenus inferiores

- `index.html`: base `v8z4b29T` confirmada antes das alterações e versionamento atualizado para `v8z4b29U` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: `#custBar` foi movido estruturalmente para dentro de `#lowerContextSlot`, compartilhando a mesma arquitetura de substituição contextual de `#toolbar` e `#alignBar` em vez de funcionar como barra extra abaixo de `#midBar.timeline-grid`.
- `index.html`: estados `cust-open`, `cust-expanded` e `align-submenu-open` agora ocultam menus concorrentes e a Linha 3 (`#lowerFrameCount`, `.lower-active-state`, `.lower-selection-actions`) para evitar duplicação, vazamento de texto e safe-area duplicada nos submenus inferiores.
- `QA.md` e `docs/QA-v8z4b29U.md`: checklist/inventário da v8z4b29U documentado.

## v8z4b29T — snap-to-center da timeline inferior

- `index.html`: base `v8z4b29S` confirmada antes das alterações e versionamento atualizado para `v8z4b29T` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionado `getLowerTimelineNearestFrameIndex()` para centralizar em um único helper o cálculo do frame mais próximo do centro visual de `#pillsRow`.
- `index.html`: `updateLowerTimelineCenterFrameFromScroll()` passa a reutilizar o helper e continua atualizando apenas `lowerTimelineCenterFrameIndex`, `timelineFocalFrameId` e visuais de foco, sem alterar `activeIdx`.
- `index.html`: adicionado snap pós-scroll com debounce e checagem de `scrollLeft` estável para respeitar momentum do iPhone/Safari antes de chamar `centerLowerTimelineOnFrame(nearest, true)`.
- `index.html`: centralização programática passa a bloquear timers concorrentes e finalizar com `timelineFocalFrameId` no frame encaixado, preservando seleção, menus inferiores, Alpha/spotlight aprovado, Formato, Preview, MP4/export, JSON, curvas e motor.
- `QA.md` e `docs/QA-v8z4b29T.md`: checklist/inventário da v8z4b29T documentado.

## v8z4b29S — separação entre seleção e foco visual da timeline

- `index.html`: base `v8z4b29R` confirmada antes das alterações e versionamento atualizado para `v8z4b29S` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: `selectFrameContext()` mantém `activeIdx` como seleção/edição, mas deixa de sobrescrever `timelineFocalFrameId` e `lowerTimelineCenterFrameIndex` durante seleção simples.
- `index.html`: centralização programática da timeline continua sendo o caminho explícito para atualizar foco visual, e o scroll manual segue atualizando `timelineFocalFrameId`/`lowerTimelineCenterFrameIndex` sem alterar `activeIdx`.
- `index.html`: fallback de `updateDimOverlay()` usa o frame focal calculado por `getTimelineStageFocusIndex()`, evitando que o alfa/spotlight volte para o frame selecionado em navegadores sem `mix-blend-mode`.
- `index.html`: destaque de seleção, menus inferiores, `#custBar`, `#alignBar`, `#lowerContextSlot`, CSS inferior, escala visual da timeline, snap-to-center, ícone Formato, Preview, MP4/export, JSON, motor de animação, curvas e seleção múltipla funcional foram preservados.
- `QA.md` e `docs/QA-v8z4b29S.md`: checklist/inventário da v8z4b29S documentado.

## v8z4b29R — sincronização Stage/timeline, seleção múltipla e menus de frame

- `index.html`: base `v8z4b29Q` confirmada antes das alterações e versionamento atualizado para `v8z4b29R` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: separação prática entre frame selecionado (`activeIdx`/seleção simples), foco central da timeline (`timelineFocalFrameId`/`lowerTimelineCenterFrameIndex`) e conjunto de seleção múltipla (`selectedFrames`), com foco/alfa do Stage comandado pelo frame central durante scroll manual.
- `index.html`: centralização programática da timeline trocada para animação controlada que ignora frames intermediários e finaliza exatamente no frame selecionado.
- `index.html`: seleção múltipla mantém conjunto sem promover frame principal, preserva o modo ao tocar/desmarcar frames e corrige `Selecionar todos` com isolamento de evento e seleção aditiva de todos os frames.
- `index.html`: submenus de Pausa, Rotação, Escala, Mover e afins em seleção múltipla passam a abrir em camada superior sobre Linha 3/Linha 4/Coluna 1 sem participar da altura da Linha 3.
- `index.html`: blocos de frame da timeline escalam número, padding e raio pelo tamanho do bloco, mantendo borda com `clamp()` para legibilidade; frame focal central recebe destaque próprio na timeline.
- `index.html`: Formato permanece usando o ícone Lucide `proportions`; Preview, exportação MP4, JSON, curvas e motor de animação não foram alterados.
- `QA.md` e `docs/QA-v8z4b29R.md`: checklist/inventário da v8z4b29R documentado.

## v8z4b29Q — correção limpa de ícones, timeline e menus inferiores

- `index.html`: base `v8z4b29P` confirmada antes das alterações e versionamento atualizado para `v8z4b29Q` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: Formato usa Lucide `proportions` e o botão superior de Arquivos/Ajustes usa Lucide `clapperboard` explícito, preservando label, função, cor, stroke e alinhamento.
- `index.html`: linha inferior e seleção múltipla preservam slots estáveis; `Selecionar todos` mantém multi-select ativo, preserva seleção existente e completa todos os frames.
- `index.html`: painéis deslizantes de Pausa/Rotação/Escala/Mover substituem o contexto inferior, usam Linhas 3/4 e reduzem clipping/sobra de safe-area.
- `index.html`: timeline ganha respiro para marcadores centrais e frames com escala proporcional de número, borda, padding e raio.
- `index.html`: foco/alfa do Stage usa `timelineFocalFrameId` no scroll manual, sem piscar durante centralização programática.
- `index.html`: menu de curvas fica no lugar do menu contextual do Stage, com ícones maiores/leves e handles locais editáveis nos frames conectados ao frame focal.
- `index.html`: bloco “Projeto em arquivo JSON” recebe borda sutil sem alterar fluxo de salvar/abrir.
- `QA.md` e `docs/QA-v8z4b29Q.md`: checklist/inventário da v8z4b29Q documentado.

## v8z4b29P — consolidação UX, timeline e foco central

- `index.html`: base `v8z4b29O` confirmada antes das alterações e versionamento atualizado para `v8z4b29P` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: fundo geral, Stage vazio, menus, painéis e overlays reforçados em `#3c3c3b`, com ícones brancos e textos `#b2b2b2` nos botões com ícone + label.
- `index.html`: ícone de Ajustes/Arquivos redefinido para Lucide `clapperboard` e Formato preservado em Lucide `proportions`.
- `index.html`: timeline compactada com frames menos ovalados/menos largos, borda mais presente, trechos mais conectados e tempos parciais discretos sem sufixo `s`.
- `index.html`: foco do Stage passa a acompanhar o frame central no scroll manual, enquanto a centralização programática bloqueia destaque intermediário até o fim da rolagem suave.
- `index.html`: área inferior ganha Coluna 1 com mais respiro, `+ frame` mais marcante, safe-area inferior reduzida, `Tempo` alinhado aos ícones contextuais e painéis de ajuste podendo ocupar linhas 3/4 e as duas colunas quando expandidos.
- `index.html`: `Selecionar todos` mantém seleção múltipla ativa, preserva a seleção de todos os frames e mantém ordem texto → ícone sem pill.
- `QA.md` e `docs/QA-v8z4b29P.md`: checklist/inventário da v8z4b29P documentado.

## v8z4b29O — menus, safe area, curvas e seleção múltipla

- `index.html`: base `v8z4b29N` confirmada antes das alterações e versionamento atualizado para `v8z4b29O` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: menus, top bar, painéis, safe area inferior e submenus passam a compartilhar `--menu-bg: #3c3c3b`, com ícones brancos e labels `#b2b2b2` nos menus afetados.
- `index.html`: menu contextual do Stage e menu de curvas usam cápsulas principais; o menu de curvas substitui o menu contextual no Stage e remove pills individuais dos ícones.
- `index.html`: timeline ganha respiro vertical, restaura os dois marcadores centrais e preserva tempos parciais discretos sem alterar lógica de scroll/seleção.
- `index.html`: frame central da timeline atualiza foco visual no Stage e o overlay escuro usa o frame focal em vez de depender apenas do clique direto.
- `index.html`: `Selecionar todos` mantém seleção múltipla ativa, isola o evento de toque e exibe texto antes do ícone.
- `QA.md` e `docs/QA-v8z4b29O.md`: checklist/inventário da v8z4b29O documentado.

## v8z4b29N — UX inferior, timeline e seleção múltipla

- `index.html`: base `v8z4b29m` confirmada antes das alterações e versionamento atualizado para `v8z4b29N` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: área inferior, Coluna 1/2, frames, trechos e textos secundários padronizados em `#3c3c3b`/`#b2b2b2`, com ícones brancos em botões com ícone + texto.
- `index.html`: timeline recebe frames mais estreitos, bordas cinza, trechos conectados com círculos maiores, pontos laranja fora do bloco dos frames e tempos parciais sem `s`.
- `index.html`: Linha 3 ganha respiro, `Selecionar todos` perde pill/fundo, mantém seleção múltipla ativa por evento isolado e lista frames apenas entre parênteses.
- `index.html`: curvas do Stage ficam acima do overlay escuro e o frame visualmente centralizado na timeline passa a destacar no Stage com seus trechos adjacentes sem alterar o motor.
- `QA.md` e `docs/QA-v8z4b29N.md`: checklist/inventário da v8z4b29N documentado.

## v8z4b29m — correção crítica inferior, scroll e menus contextuais

- `index.html`: base `v8z4b29L` confirmada antes das alterações e versionamento atualizado para `v8z4b29m` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: seleção de trecho deixa de aplicar foco visual azul/ciano nos frames do Stage; o trecho selecionado permanece indicado apenas na timeline e no contexto inferior.
- `index.html`: rolagem horizontal da timeline passa a ser comandada pela faixa de frames com inércia nativa, sem feedback de scroll da faixa de tempos, e com sincronização imediata de `scrollLeft` para manter tempos/trechos/frames alinhados.
- `index.html`: frame selecionado mantém centralização suave fora de seleção múltipla, com larguras compactas e compatíveis entre tempos, trechos e frames.
- `index.html`: ação `Selecionar todos` fica explícita, secundária em cinza claro, com texto antes do ícone e sem cor de destaque normal.
- `index.html`: painéis flutuantes de Duração e Movimento recebem tick/check de confirmação/fechamento sem alterar motor, Preview, MP4/export, JSON, curvas/easing ou cálculo de câmera.
- `index.html`: área inferior reduz ainda mais o espaço morto da safe area, ganha respiro entre linhas, bolinhas laranjas se afastam dos frames e a hierarquia de textos passa a diferenciar pausa (cinza), trecho (branco), frame (cinza) e quantidade de frames (mais escura).
- `QA.md` e `docs/QA-v8z4b29m.md`: checklist/inventário da v8z4b29m documentado.

## v8z4b29L — refinamento inferior, timeline e centralização suave

- `index.html`: base `v8z4b29K` confirmada antes das alterações e versionamento atualizado para `v8z4b29L` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: grade inferior mantém 2 colunas x 4 linhas, remove duplicação de safe area, reduz padding inferior real e redistribui a altura recuperada como respiro entre as linhas.
- `index.html`: Linha 3 fica mais discreta em tom secundário, sem subtítulo redundante, mantendo identificação compacta de frame, trecho ou seleção múltipla.
- `index.html`: frames da timeline ficam menos largos e trechos ficam mais estreitos/conectados, com larguras sincronizadas entre Linha 1 de tempos e Linha 2 de frames.
- `index.html`: centralização do frame selecionado passa a usar `scrollTo(..., behavior: 'smooth')` nas faixas de tempos e frames, preservando bloqueio durante seleção múltipla.
- `QA.md` e `docs/QA-v8z4b29L.md`: checklist/inventário da v8z4b29L documentado.

## v8z4b29K — base inferior compacta e submenus na Linha 4

- `index.html`: base `v8z4b29J` confirmada antes das alterações e versionamento atualizado para `v8z4b29K` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: submenus locais de Pausa, Rotação, Escala e Mover passam a ocupar o slot contextual da Linha 4 / Coluna 2, substituindo os ícones sem criar novo bloco vertical nem empurrar timeline, Coluna 1 ou Stage.
- `index.html`: Coluna 1 recebe padding compacto, botão `+ frame` volta a ser circular real em `var(--accent)` e tipografia da área inferior fica mais consistente.
- `index.html`: timeline reduz gaps, conecta visualmente frames e trechos, engrossa bordas dos frames, deixa trechos mais discretos e usa `var(--accent)` para frame ativo/selecionado.
- `index.html`: espaço morto inferior dos menus contextuais é reduzido ao encaixar painéis no mesmo slot da Linha 4, preservando apenas a safe area da grade inferior.
- `index.html`: Linha 3 remove o subtítulo redundante `Frame ativo` e mostra seleção ativa/múltipla de forma compacta.
- `QA.md` e `docs/QA-v8z4b29K.md`: checklist/inventário da v8z4b29K documentado.

## v8z4b29J — área inferior proporcional e pausa distinta

- `index.html`: base `v8z4b29I` confirmada antes das alterações e versionamento atualizado para `v8z4b29J` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: área inferior mantém 2 colunas e 4 linhas, amplia a Coluna 1, remove padding inferior morto e redistribui a altura útil para tempo total, botão `+`, total de frames e controle global `Tempo`.
- `index.html`: Linha 1 e Linha 2 passam a usar larguras equivalentes para pausas/frames e trechos/conexões, com sincronização imediata de `scrollLeft` para evitar atraso visual entre tempos e timeline.
- `index.html`: frames ganham blocos maiores e trechos viram conexões menores com bolinhas, mantendo hit area invisível sem deixar o trecho mais importante que o frame.
- `index.html`: frame ativo clicado/adicionado é recentralizado na faixa, com bloqueio de recentralização durante seleção múltipla.
- `index.html`: ícone de Pausa de frame trocado para `i-frame-pause` (círculo com barras), separado dos ícones de Tempo/Duração, com label `Pausa` preservado.
- `QA.md` e `docs/QA-v8z4b29J.md`: checklist/inventário da v8z4b29J documentado.

## v8z4b29I — estrutura inferior alinhada sem sobreposição

- `index.html`: base `v8z4b29H` confirmada antes das alterações e versionamento atualizado para `v8z4b29I` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: área inferior mantém o mesmo slot/altura e passa a usar grade real de 2 colunas por 4 linhas, com Coluna 1 estreita/global e Coluna 2 flexível, `overflow` vertical bloqueado e Duração geral fixa na Linha 4.
- `index.html`: botão `+ frame` fica sempre no slot global da Linha 2, mais forte, em pill `var(--accent)`, sem troca por seleção múltipla.
- `index.html`: tempos parciais da Linha 1 e faixa de frames/trechos da Linha 2 têm larguras compatíveis e sincronização horizontal de scroll, sem edição direta de pausa/duração.
- `index.html`: frames aparecem como blocos numerados; trechos aparecem como conexões com bolinhas nas extremidades, hit area horizontal preservada e marcadores centrais laranja adicionados à faixa.
- `index.html`: seleção múltipla deixa de ser overlay sobre a base inferior; suas ações ocupam a Linha 3 / Coluna 2 e a Linha 4 / Coluna 2, sem cobrir a Coluna 1 nem a Duração geral.
- `index.html`: labels dos ícones contextuais inferiores voltam a aparecer abaixo dos ícones, com scroll horizontal permitido apenas na Linha 4 / Coluna 2.
- `QA.md` e `docs/QA-v8z4b29I.md`: checklist/inventário da v8z4b29I documentado.

## v8z4b29H — base inferior em 2 colunas e 4 faixas

- `index.html`: base `v8z4b29G` confirmada antes das alterações e versionamento atualizado para `v8z4b29H` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: área inferior reorganizada estruturalmente em 2 colunas e 4 faixas no mesmo slot inferior, com Coluna 1 estreita/global e Coluna 2 flexível para tempos, frames/trechos, estado ativo e ícones contextuais.
- `index.html`: botão `+ frame` passa a usar pill com `var(--accent)` e troca no mesmo slot para selecionar todos durante seleção múltipla, sem criar botão extra na faixa de seleção.
- `index.html`: Linha 1 passa a renderizar tempos parciais informativos de pausas e trechos usando os valores existentes, sem edição direta nem alteração de cálculo.
- `index.html`: confirmação do frame assistido usa o azul/ciano oficial `var(--accent)`; cancelamento permanece laranja.
- `index.html`: flutuação do frame assistido passa a ser oval/discreta sem rotação e sem escala, mantendo pausa ao toque/drag e retorno suave existente.
- `QA.md` e `docs/QA-v8z4b29H.md`: checklist/inventário da v8z4b29H documentado.

## v8z4b29g — ícones pendentes e frame assistido flutuante

- `index.html`: base `v8z4b29f` confirmada antes das alterações e versionamento atualizado para `v8z4b29g` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: Menu/Arquivos mantém layout da v29f e corrige apenas ícones pendentes: Formato com Lucide `proportions`, Templates com silhueta `layout-template` e Não limitar/Conter na imagem com Lucide `fullscreen`.
- `index.html`: frame assistido remove os círculos brancos de canto ainda não funcionais, mantém borda branca tracejada/cantos arredondados/dim externo/interior limpo e ganha flutuação visual sutil que pausa ao toque/drag/handle e retorna após atraso curto.
- `index.html`: botões Confirmar/Cancelar do frame assistido passam a ser HUD fixo do Stage, centralizado no rodapé visível, fora da camada transformada por pan/zoom e sem acompanhar foto/frame/rotação.
- `ROADMAP.md`: registrada a próxima frente pós-v8z4b29g para revisão de motor: velocidade constante, escala, rotação e movimento inteligente, sem implementação nesta versão.
- `QA.md` e `docs/QA-v8z4b29g.md`: checklist/inventário da correção v8z4b29g documentado.

## v8z4b29f — menu, frame assistido e estados visuais da linha v29

- `index.html`: base `v8z4b29e` confirmada antes das alterações e versionamento atualizado para `v8z4b29f` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: painel Menu/Arquivos reorganizado em 3 colunas na ordem obrigatória: Imagem, Formato, Templates; Fundo, Não limitar, Reset; divisor; Salvar, Abrir, Recarregar; bloco JSON inferior separado com documento `{}`.
- `index.html`: ícones do Menu/Arquivos ajustados para foto/imagem, `proportions`, template/layout, paleta, contain livre, `timer-reset`/reset, download/salvar, pasta aberta, recarregar e documento JSON.
- `index.html`: frame assistido fica sem texto/pill/fill interno, com borda branca tracejada animada, quatro cantos circulares brancos, dim externo e botões circulares X laranja/check ciano.
- `index.html`: botões do frame assistido acompanham rotação sem escalar visualmente, mantêm toque confortável e usam fallback com histerese simples no rodapé do Stage quando não cabem no frame.
- `index.html`: Menu/Arquivos, imagem, projeto, Templates, Fundo/Formato/Não limitar/Reset/Recarregar permanecem acessíveis durante F1 assistido, preservando bloqueios de edição dependente de frame confirmado.
- `index.html`: zoom/pan continua forçando atualização visual imediata dos overlays, e seleção de frame/trecho mantém caminhos completos em ciano/laranja legíveis.
- `index.html`: topbar ajustada para deslocar Visualização/Preview levemente à direita, Preview mais retangular e X mais evidente sem aumentar altura.
- `ROADMAP.md`: roadmap inferior re-registrado para v8z4b29f sem implementar nova arquitetura/faixas.
- `QA.md` e `docs/QA-v8z4b29f.md`: checklist/inventário da correção v8z4b29f documentado.

## v8z4b29e — correções assistidas, zoom e caminhos da linha v29

- `index.html`: versionamento atualizado para `v8z4b29e` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo, com base `v8z4b29d` confirmada antes das alterações.
- `index.html`: modo F1 assistido mantém topo/Arquivos navegáveis e libera carregar imagem, carregar projeto, Templates, Reset e Recarregar, bloqueando apenas edição dependente de frame confirmado.
- `index.html`: frame assistido remove fill azulado interno, usa dim externo recortado, borda tracejada mais forte/animada e confirmação ancorada/clampada dentro do Stage.
- `index.html`: zoom/pan atualiza imediatamente bordas, curvas/trechos, handles, dim overlay e ghost no mesmo ciclo visual, sem alterar coordenadas reais, JSON, Preview, MP4 ou exportação.
- `index.html`: números/labels visuais de frame deixam de compensar o zoom para acompanhar melhor o frame/stage, preservando controles tocáveis com compensação quando necessário.
- `index.html`: seleção de trecho e seleção de frame mantêm caminho completo visível; trechos ativos ficam em azul/ciano e trechos não ativos em laranja contínuo/legível.
- `index.html`: topbar recebe ajuste fino no bloco Visualização/Preview e no X, sem aumentar altura nem reorganizar a faixa superior.
- `ROADMAP.md`: registrada direção futura da área inferior em quatro faixas sem implementação nesta versão.
- `QA.md` e `docs/QA-v8z4b29e.md`: checklist/inventário da correção v8z4b29e documentado.

## v8z4b29d — correções visuais/UX da linha v29

- `index.html`: versionamento atualizado para `v8z4b29d` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: painel Arquivos ajustado para grade de 2 colunas no bloco Criação, preservando blocos com 3 colunas quando têm itens reais.
- `index.html`: ícones do painel Arquivos atualizados para Templates (`layout-panel-top`), Formato (`proportions`) e Reset (`timer-reset`), mantendo labels/funções/cores.
- `index.html`: seleção visual Frame/Trecho reforçada para limpar destaque de trecho ao voltar ao frame e destacar o trecho ativo em ciano no Stage/faixa.
- `index.html`: frame assistido inicial ganhou preenchimento translúcido, borda pontilhada mais forte e pulsação leve, removidos automaticamente com o fim do modo ghost.
- `index.html`: menus inferiores de Frame/Trecho padronizados com ícones menores, distribuição estável e label visual `Tempo` para evitar encavalar.
- `QA.md` e `docs/QA-v8z4b29d.md`: checklist/inventário da correção v8z4b29d documentado.

## v8z4b29c — refinar topo, Arquivos e seleção frame/trecho

- `index.html`: versionamento atualizado para `v8z4b29c` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: faixa superior mantém Voltar, Arquivos, Visualizar, Preview, Undo e Redo somente com ícones visíveis; Preview ganhou pill destacada e espaçamentos foram adicionados após Voltar e Arquivos.
- `index.html`: painel Arquivos reorganizado em grade compacta por blocos de criação, projeto, aparência e manutenção, com botão de fechar visível e altura máxima segura.
- `index.html`: Duração usa `clipboard-clock` sem estado/valor no botão, Formato usa `proportions` e Deletar frame usa `trash` no menu contextual do Stage.
- `index.html`: seleção visual de frame/trecho ficou exclusiva, limpando destaque conflitante e escondendo o menu contextual de frame ao selecionar trecho.
- `QA.md` e `docs/QA-v8z4b29c.md`: checklist/inventário da correção v8z4b29c documentado.

## v8z4b29b — corrigir hierarquia dos menus contextuais

- `index.html`: versionamento atualizado para `v8z4b29b` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: Curva removida da faixa superior; topo permanece com Voltar, Arquivos, Visualizar, Preview, Undo e Redo.
- `index.html`: menu contextual de frame movido para dentro do Stage, na parte inferior do Stage, em um único contêiner para Deletar, Fixar/Desfixar e Curva; os três botões chamam as funções existentes e escondem o menu antes da ação.
- `index.html`: Fundo, Inverter e Formato removidos do menu inferior e movidos para Arquivos/faixa superior, mantendo as funções existentes.
- `index.html`: menu inferior fica apenas com os contextos Frame e Trecho; Frame é o padrão quando nada está selecionado; Tempo do trecho e Movimento continuam chamando o mesmo painel atual de trecho/easing.
- `index.html`: faixa de frames/trechos mantém os trechos intermediários visíveis e clicáveis no contexto Frame, com o botão `+` preservado à esquerda.
- Preservados fora do escopo: motor, Preview, Export/MP4, WebCodecs, JSON estrutural, cálculos de duração/pausas/trecho, curvas/easing como motor, zoom/pan, seleção múltipla, inserção assistida e Undo/Redo.
- `QA.md` e `docs/QA-v8z4b29b.md`: checklist/inventário da correção v8z4b29b documentado.

## v8z4b29a — reorganizar menus contextuais da interface

- `index.html`: versionamento atualizado para `v8z4b29a` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: topo reorganizado para Voltar, Arquivos, Visualizar, Preview, Undo e Redo, preservando as chamadas existentes de Visualizar/Preview/Undo/Redo.
- `index.html`: botão Arquivos abre o painel existente de projeto, com acessos preservados para Templates, Imagem, Fundo, Conter, Salvar, Abrir/Carregar projeto, Reset e Recarregar.
- `index.html`: botão `+` fica fixo à esquerda da faixa de frames/trechos e continua chamando a inserção assistida existente.
- `index.html`: toolbar inferior passa a ser contextual para geral/frame/trecho, mantendo Duração sempre disponível, Pausa/Rotação/Escala/Mover no contexto Frame e Tempo do trecho/Movimento no contexto Trecho.
- `index.html`: menu contextual de frame no Stage criado para Deletar, Fixar/Desfixar e Editar Curva/Ponto, chamando as funções existentes.
- `index.html`: clique direto no trecho agora seleciona o trecho e muda o contexto inferior; Tempo do trecho e Movimento abrem o painel atual de trecho/easing.
- Motor de Preview/Export/MP4, JSON, cálculos de tempo, curvas, easing, zoom/pan, seleção múltipla e inserção assistida não foram alterados funcionalmente.
- `QA.md` e `docs/QA-v8z4b29a.md`: checklist/inventário da transição v8z4b29a documentado.

## v8z4b28f — otimizar Preview com proxy e duração computada

- `index.html`: versionamento atualizado para `v8z4b28f` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionada fonte `previewRenderSource` cacheada apenas para Preview, com limite conservador de lado maior e fallback para `canonicalRenderImage` quando necessário.
- `index.html`: `renderFrameSafely`/`drawAtT` aceitam fonte de render opcional para o Preview, mantendo Export/MP4 sem proxy e usando a fonte canônica/original.
- `index.html`: criada `getComputedTimelineDuration()` e aplicada no Preview e no Export para evitar divergência entre `duration` salvo/stale e timeline calculada com segmentos, pausas e loop.
- `index.html`: loops de Preview ficam time-based com token anti-rAF antigo, throttle leve de ~30 fps e logs técnicos sob `DEBUG_PREVIEW_PERF = false`.
- Preservados fora do escopo: UI/UX, JSON salvo, imagem original, qualidade/resolução do MP4, WebCodecs, VideoEncoder, VideoFrame e muxer.
- `QA.md` e `docs/QA-v8z4b28f.md`: checklist de QA criado/atualizado, incluindo arquivo grande `arco_diagramacao_i_ah8_c10_img 28e.json`, duração computada, proxy de Preview, MP4 e iPhone/Safari real.

## v8z4b28e — otimizar Preview sem alterar Export

- `index.html`: versionamento atualizado para `v8z4b28e` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: `renderFrameSafely` passa os diagnósticos já calculados para `drawAtT`, mantendo compatibilidade com chamadas sem diagnósticos e evitando segunda chamada normal a `buildRenderDiagnostics` por frame.
- `index.html`: loops de Preview em `startPreview` e retomada de `togglePreviewPlayback` cacheiam `previewTimelineFill` fora do `requestAnimationFrame` e retornam imediatamente quando `isPreviewing` está desligado.
- `index.html`: `getRenderStateAtTime` só monta o payload de `[RenderState]` quando `DEBUG_RENDER_EXPORT` está ativo.
- Preservados fora do escopo: UI, qualidade visual, JSON, curvas/easing/timing, WebCodecs, VideoEncoder, VideoFrame, muxer, fallback universal e motor de Export/MP4 da v8z4b28d.

## v8z4b28d — estabilizar motor universal de Preview/MP4

- `index.html`: versionamento atualizado para `v8z4b28d` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionada validação universal de estado/câmera por tempo via `getRenderStateAtTime`, com status de pausa, loop, trecho, escala, rotação e validade antes do render.
- `index.html`: `buildRenderDiagnostics`, `drawAtT`, `drawAtTDirect` e o novo `renderFrameSafely` passam a validar canvas, fonte canônica, source rect, transform e frame em cada render, acionando fallback universal sem thumbnail/downscale quando o quadro é inválido ou preto.
- `index.html`: Preview usa render seguro por frame e mantém canvas/controles ativos em caso de erro, evitando tela preta permanente e fechamento espontâneo.
- `index.html`: Export/MP4 e fallback MediaRecorder só entregam frames renderizados e canvas válidos; criação de `VideoFrame`, timestamps, snapshot `ImageBitmap`, encode, fechamento e erros do encoder passam a ser tratados por frame.
- `index.html`: adicionados `cleanupExportSession`, logs técnicos `[RenderState]`, `[RenderValidationError]`, `[ExportFrameError]`, `[EncoderError]` e `[ExportCleanup]` sob `DEBUG_RENDER_EXPORT`, preservando a nitidez/fonte canônica conquistada nas versões v8z4b28a/v8z4b28b/v8z4b28c.
- `QA.md` e `docs/QA-v8z4b28d.md`: checklist de QA da versão criado/atualizado, com zoom extremo, pausa, loop, rotação, HEIC/JPG/PNG, JSON com imagem e erro controlado.

## v8z4b28c — corrigir pipeline HEIC e fonte de render

- `index.html`: versionamento atualizado para `v8z4b28c` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionada fonte canônica de render (`canonicalRenderImage`) recriada ao carregar imagem direta ou `imageBase64`, preservando o elemento decodificado em orientação visual do browser sem reamostrar/downscale global.
- `index.html`: Preview, Export/MP4, fallback direto e fundo espelhado passam a desenhar a partir da fonte canônica, mantendo o canvas final de vídeo fixo e sem usar thumbnail/canvas reduzido como fonte principal.
- `index.html`: diagnóstico interno `debugImagePipeline(label)` registra fonte real, MIME, origem upload/JSON, dimensões naturais/canônicas, canvases de Preview/Export, DPR e fallback quando ativado via `window._arcoDebugImagePipeline`.
- `index.html`: validação de export passa a exigir fonte canônica disponível, e erros por frame registram `[ExportError]` com frame, tempo, trecho, source rect, transform, fonte canônica e output.
- `QA.md` e `docs/QA-v8z4b28c.md`: checklist de QA da versão criado/atualizado, incluindo pendência do caso real quando o arquivo `arco_5537 28b2_img.json` não está presente no repositório de teste.

## v8z4b28b — estabilizar render em zoom extremo

- `index.html`: versionamento atualizado para `v8z4b28b` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionados limites internos de canvas/zoom e validação defensiva de source rect, transform, output e imagem antes do render.
- `index.html`: Preview limita backing store por orçamento de pixels; Export/MP4 mantém canvas final fixo e desenha direto da imagem original.
- `index.html`: fallback seguro para zoom extremo registra `[RenderFallback]` e evita canvas/buffer gigante proporcional ao zoom.
- `index.html`: loop WebCodecs/MediaRecorder captura falha por frame e o cleanup de erro mantém o Preview aberto em estado controlado.
- `QA.md` e `docs/QA-v8z4b28b.md`: checklist de QA da versão criado/atualizado.

## v8z4b28a — auditar resolução e qualidade de render

- `index.html`: versionamento atualizado para `v8z4b28a` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- Preview: escala interna volta a renderizar no tamanho final seguro de `exportDims`, mantendo `imageSmoothingEnabled` e `imageSmoothingQuality = "high"` nos contextos usados e evitando ampliar um canvas de meia resolução.
- MP4/Export: canvas de export permanece no tamanho final real do vídeo, sem `devicePixelRatio`, com qualidade de smoothing reaplicada após resets de canvas e desenho direto da fonte `imgEl` original.
- Imagem original/JSON: a sessão mantém o data URL original carregado; salvar/carregar projeto com imagem não reamostra por canvas intermediário nem reduz para 2560 px antes de render posterior.
- Diagnóstico interno: adicionadas `analyzeFrameResolutionQuality(...)` e `window.analyzeProjectResolutionQuality(...)` para estimar pixels disponíveis por frame, razão de qualidade e status `OK`/`LIMITE`/`BAIXA`/`ACIMA_DO_LIMITE` via `console.table` somente quando chamado manualmente.
- QA manual recomendado: usar imagem grande com textura fina, criar zoom leve/médio/forte, comparar Preview e MP4 e confirmar se a perda restante corresponde ao limite real do arquivo original.
- Preservados fora do escopo: interface, ícones do submenu Alinhar, seleção múltipla, curvas/easing/timing, JSON estrutural, zoom/pan do Stage, ghost frame e fluxo de Preview/MP4.

## v8z4b27i — corrigir referência multi-select, reset de rotação e faixa rolável

- `index.html`: versionamento atualizado para `v8z4b27i` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário do topo.
- Menu multi-select: faixa rolável passa a reservar largura maior para `Selecionar todos`, evitando que a primeira ação (`Pausa`) nasça cortada sob a coluna fixa.
- Painéis multi-select: Pausa, Escala e Rotação passam a usar o primeiro frame da seleção atual como referência; `Selecionar todos` insere o frame ativo como primeira referência; sliders mostram valor absoluto da referência e aplicam delta relativo aos demais frames.
- Rotação individual: abertura/reabertura do painel e `Reset` ressincronizam slider, texto, fill ciano e Stage pela mesma rotina central de UI.
- Badges de frames: renderização completa atualiza o número exibido em cada frame a cada `renderAll()`, evitando rótulos stale após inserção/renumeração.
- Mantidos fora do escopo: motor, `getStateAtT`, `drawAtT`, Preview, MP4/WebCodecs, JSON, curvas, zoom/pan e ghost frame.

## v8z4b27h — corrigir sliders delta, ícones e alinhamento multi-select

- `index.html`: versionamento atualizado para `v8z4b27h` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário do topo.
- Rotação/Escala multi-select: sliders passam a representar delta relativo a um snapshot capturado ao abrir/arrastar o painel; `input` aplica o delta ao vivo no Stage com renderização via `requestAnimationFrame`; `change`/`pointerup`/fechamento consolidam um único Undo.
- `Selecionar todos`: botão separado da faixa rolável em coluna fixa sem caixa/borda/radius, usando o fundo da barra como máscara; a faixa de ações reseta `scrollLeft = 0` ao fechar, sair ou reabrir.
- Ícones: Distribuir troca para `align-horizontal-distribute-center`/`align-vertical-distribute-center`; Mover e Alinhar usam botões apenas com ícones Lucide via sprite interno.
- Alinhar/Distribuir: ações usam bounds visuais transformados dos frames selecionados, considerando posição, tamanho, escala efetiva e rotação; Distribuir continua bloqueado com menos de 3 frames.
- Mantidos fora do escopo: motor, `getStateAtT`, `drawAtT`, Preview, MP4/WebCodecs, JSON, curvas, zoom/pan e inserção assistida/ghost frame.

## v8z4b27g — corrigir padronização real dos menus multi-select

- `index.html`: versionamento atualizado para `v8z4b27g` em constantes, texto visível e comentário do topo.
- Menu de seleção múltipla: ordem espelhada do menu individual aprovado (`Pausa`, `Rotação`, `Escala`, `Mover`) antes de `Alinhar` e `Distribuir`, mantendo `Selecionar todos` fixo à esquerda e a faixa rolável horizontal.
- Design system multi-select: `Selecionar todos` perde caixa/fundo/borda e passa a usar símbolo Lucide `list-check`; `Alinhar` usa `align-end-horizontal`; `Distribuir` usa símbolos de space-between; subações deixam de usar SVG inline improvisado quando há símbolo equivalente.
- Painéis multi-select: Pausa, Rotação e Escala passam a ocupar o slot do submenu com estrutura de slider + valor + chips textuais, seguindo o padrão real do `custBarContent`; `Reset` e `Igualar` permanecem textuais.
- Preservados: seleção temporária de UI fora do JSON/Undo de projeto, lógica de atuação somente nos frames selecionados, Preview, MP4, JSON, curvas, zoom/pan e motor de animação.

## v8z4b27f — ajustar painéis, ícones e menu rolável de frames selecionados

- `index.html`: versionamento atualizado para `v8z4b27f` em constantes, texto visível e comentário do topo.
- Painel Pausa: layout vertical do submenu ajustado para seguir o padrão dos demais painéis, com slider, valor textual e Voltar visíveis, sem reintroduzir `Zerar`, `Definir pausa`, OK ou Cancelar.
- Undo/Redo com painel aberto: sessão de Pausa aberta é cancelada antes da restauração de estado e o submenu ativo é ressincronizado depois do render, evitando valor antigo no slider/texto e evitando reaplicação ao fechar.
- Ícones: `Pausa` no menu principal usa relógio/tempo, `Selecionar todos` usa `list-check`, `Alinhar`/`Distribuir` usam pictogramas de objetos/frames, e `Zerar` nos submenus de Escala/Rotação usa o símbolo oficial `i-reset`.
- Menu principal de frames selecionados: reorganizado como `Selecionar todos` fixo à esquerda + ações em faixa horizontal rolável, com áreas de toque confortáveis e proteção contra seleção/callout nativos em iPhone/Safari.
- `Posição` virou `Mover`; `Alinhar` e `Distribuir` foram expostos no menu principal rolável, com `Distribuir` desabilitado para menos de 3 frames.
- Preservado da v8z4b27e: seleção múltipla como estado temporário de UI, destaque aprovado, ações em lote com Undo, Preview/MP4/JSON, curvas, zoom/pan e motor de animação sem alterações estruturais.
- Fora do escopo: transformação direta de grupo no Stage, UI v8z5, botão OK/Cancelar, adicionar/subtrair pausa, Undo/Redo de troca de imagem, loop ping-pong e velocidade constante perceptiva.
- `docs/QA-v8z4b27f.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27f no repositório de teste.

## v8z4b27e — corrigir menu contextual, primeiro selecionado, Pausa e Undo de Conter

- `index.html`: versionamento atualizado para `v8z4b27e` em constantes, texto visível e comentário do topo.
- Menu contextual principal: removidos o botão `Voltar` e o texto redundante do alvo; `Selecionar todos` foi reposicionado à esquerda e mantém o menu aberto após selecionar todos os frames.
- Seleção contextual: `selectedFrames.size >= 1` passa a acionar o visual de selecionado no Stage e na faixa, fazendo o primeiro frame selecionado aparecer em laranja.
- Painel Pausa: removido o botão `Zerar`, preservando título, texto do alvo, slider decimal e Undo consolidado ao fechar/sair do painel.
- Conter na imagem: `containFrames` agora participa de `captureState()`/`restoreState()`, permitindo Undo/Redo restaurar também o estado interno de contenção; carregamento de JSON e Reset de projeto novo limpam o flag temporário.
- Preservado da v8z4b27d: seleção como estado temporário de UI, overlay externo múltiplo, ausência do botão `Sel`, cor de fundo no Undo/JSON e slider direto de Pausa.
- Fora do escopo preservado: não houve alterações em `getStateAtT`, `drawAtT`, WebCodecs/export estrutural, curvas, zoom/pan, inserção assistida, transformação direta de grupo ou JSON estrutural.
- `docs/QA-v8z4b27e.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27e no repositório de teste.

## v8z4b27d — simplificar Pausa contextual, menu com 1 frame e Undo da cor

- `index.html`: versionamento atualizado para `v8z4b27d` em constantes, texto visível e comentário do topo.
- Painel Pausa: removido o botão grande `Definir pausa`; o slider passa a aplicar diretamente o valor decimal aos frames-alvo da seleção aberta, mantendo apenas `Zerar` como ação secundária.
- Undo da Pausa: edição do slider e do `Zerar` passa a ser consolidada em uma sessão única, registrada somente ao fechar/sair do painel quando houver diferença entre estado inicial e final.
- Menu contextual: `#alignBar` passa a aparecer com 1 frame selecionado, mantém os grupos Pausa, Escala, Rotação e Posição e adiciona `Selecionar todos` sem persistir seleção no JSON.
- Cor de fundo: `bgColor` passa a entrar em `captureState()`/`restoreState()`, no baseline de Reset e no JSON, com Undo/Redo para swatches e consolidação no fechamento/`change` dos campos de cor.
- Overlay normal: alfa do overlay escuro do frame ativo reduzido de `rgba(0,0,0,0.52)` para `rgba(0,0,0,0.38)`; overlay múltiplo preservado em `rgba(0,0,0,0.34)`.
- Fora do escopo preservado: não houve alterações em `getStateAtT`, `drawAtT`, WebCodecs/export estrutural, curvas, zoom/pan, inserção assistida ou JSON estrutural além de preservar a cor real existente.
- `docs/QA-v8z4b27d.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27d e itens futuros registrados sem implementação.

## v8z4b27c — simplificar Pausa em seleção múltipla

- `index.html`: versionamento atualizado para `v8z4b27c`.
- Correção de UX: painel Pausa da seleção múltipla passa a mostrar o contexto dos frames afetados (`F1, F2 selecionados` ou contagem quando a seleção é longa).
- Remoção de redundâncias: removidos do painel o botão `Igualar ao ativo` e o texto/botão grande `Aplicar aos selecionados`.
- Definir pausa: ação principal renomeada para `Definir pausa`, definindo o valor decimal do slider apenas nos frames selecionados editáveis, com seleção múltipla preservada e Undo único.
- Reset/Zerar: `Zerar` permanece como ação secundária pequena, zerando apenas os frames selecionados com Undo único.
- Adicionar pausa: não implementado nesta versão; fica registrado como próximo passo para fluxo separado, sem misturar com `Definir pausa`.
- Fora do escopo: Subtrair, Igualar ao ativo, escala, rotação, posição, alinhamento/distribuição, overlay externo, curvas, Preview, MP4 e JSON estrutural.
- `docs/QA-v8z4b27c.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27c no repositório de teste.

## v8z4b27b — corrigir Pausa em lote sem incrementos fixos

- `index.html`: versionamento atualizado para `v8z4b27b`.
- Correção de UX: submenu Pausa da seleção múltipla deixa de oferecer atalhos rígidos `+0.5s`/`-0.5s`.
- Pausa em lote: painel passa a usar slider decimal com os mesmos limites e passo do controle real de pausa (`FRAME_PAUSE_MIN`, `FRAME_PAUSE_MAX`, `FRAME_PAUSE_STEP`).
- Aplicar aos selecionados: define a pausa escolhida apenas nos frames selecionados editáveis, preservando a seleção múltipla ativa e registrando um único Undo.
- Zerar e Igualar ao ativo permanecem como ações secundárias de lote, também com Undo único.
- Fora do escopo: Adicionar/Subtrair pausa em lote, lógica proporcional, escala, rotação, posição, alinhamento, distribuição, curvas, Preview, MP4 e JSON estrutural.
- `docs/QA-v8z4b27b.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27b no repositório de teste.

## v8z4b27a — expandir menu de seleção múltipla com ações em lote

- `index.html`: versionamento atualizado para `v8z4b27a`.
- Nova função: menu próprio de seleção múltipla passa a ter 4 grupos principais: Pausa, Escala, Rotação e Posição.
- Pausa: `+0.5s`, `-0.5s`, zerar e igualar ao frame ativo para os frames selecionados.
- Escala: `+5%` relativo, `-5%` relativo, igualar ao frame ativo e reset para a escala base existente (`baseFrameW`).
- Rotação: `+5°`, `-5°`, igualar ao frame ativo e zerar rotação.
- Posição: movimento relativo em 4 direções, alinhamento por referência no frame ativo e distribuição horizontal/vertical em ordem de frames.
- Undo/Redo: cada ação em lote registra um único snapshot antes da alteração; seleção múltipla, overlay e frames não selecionados são preservados.
- Preservado: menu próprio de seleção múltipla, ausência do botão `Sel`, overlay externo múltiplo, caminho/curva, JSON sem persistir seleção, Preview/MP4 sem UI de seleção.
- `docs/QA-v8z4b27a.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27a no repositório de teste.

## v8z4b26g — remover laranja interno e corrigir overlay da seleção múltipla

- `index.html`: versionamento atualizado para `v8z4b26g`; seleção múltipla deixa de aplicar qualquer fill/luz laranja interna em `.frame-dim`.
- `index.html`: `renderAll()` mantém borda laranja dos frames selecionados, substitui o inset/tingimento por halo externo discreto e preserva a moldura normal dos não selecionados.
- `index.html`: `updateDimOverlay()` passa a exibir overlay escuro externo durante seleção múltipla usando máscara SVG com recortes para todos os frames selecionados, reaproveitando `getRotatedFrameCorners()` para respeitar posição e rotação.
- `index.html`: `drawBezier()` e geometria das curvas não foram alterados; a camada de caminho permanece acima/compatível com o overlay e abaixo das molduras.
- `docs/QA-v8z4b26g.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: ponteiro de QA/status atualizado para v8z4b26g no repositório de teste.

## v8z4b26f — corrigir luz, moldura e caminhos na seleção múltipla

- `index.html`: versionamento atualizado para `v8z4b26f`; seleção múltipla deixa de acionar foco ativo dominante, auto bring-to-front e overlay escuro do frame ativo.
- `index.html`: `renderAll()` preserva molduras de frames desselecionados, remove resíduos visuais e reaplica luz interna apenas a frames presentes em `selectedFrames`, inclusive no primeiro frame pressionado ao iniciar a seleção.
- `index.html`: `drawBezier()` mantém caminhos/curvas sólidos e legíveis durante seleção múltipla, sem alterar a geometria das curvas.
- `docs/QA-v8z4b26f.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: ponteiro de QA/status atualizado para v8z4b26f no repositório de teste.

## v8z4b26e — limpar marcação residual ao desselecionar frames

- fix: Stage e faixa de frames passam a reaplicar destaque de seleção múltipla somente quando `selectedFrames` contém 2+ frames.
- fix: frames removidos da seleção deixam de manter `multi-selected`, `.fp.selected`, halo, box-shadow ou z-index de selecionado quando a seleção deixa de ser múltipla.
- preservado: forma atual de seleção múltipla da v8z4b26d, aplicação em lote de Canto/Simétrico/Assimétrico/Desconectado, Undo/Redo, Preview, MP4 e JSON.
- `index.html`: versionamento atualizado para `v8z4b26e`; novos helpers `isFrameVisuallyMultiSelected()` e `clearFrameSelectionVisuals()` usados por `renderAll()` e `updateFrameSelector()` para sincronizar Stage/faixa a partir do estado real.
- `docs/QA-v8z4b26e.md`: checklist específico da versão.
- `QA.md`, `ROADMAP.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b26e no repositório de teste.

## v8z4b26d — separar seleção simples e seleção múltipla

- ux: separa o comportamento visual de seleção simples e seleção múltipla.
- ux: mantém o auto-center da faixa de frames na seleção simples.
- ux: desativa hierarquia visual individual durante seleção múltipla.
- fix: impede que o último frame tocado seja promovido sozinho quando há múltiplos selecionados.
- fix: corrige resíduo visual ao desselecionar frames dentro de uma seleção múltipla.
- preservado: Preview, Export, JSON, timeline e dados internos não foram alterados.
- `index.html`: versionamento atualizado para `v8z4b26d`; `renderAll()` e seleção por pills ajustados para bloquear foco visual/auto-center individual durante seleção múltipla.
- `docs/QA-v8z4b26d.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b26d no repositório de teste.

## v8z4b26c — melhorar leitura visual da seleção múltipla no Stage

- ux: durante seleção múltipla, todos os frames selecionados são desenhados como grupo em camada visual superior, preservando a ordem relativa entre eles.
- ux: frames selecionados recebem contorno/halo de seleção mais forte e números mais legíveis, mantendo a cor de seleção já usada no app.
- ux: frames não selecionados permanecem visíveis, mas com opacidade reduzida para funcionar como fundo visual durante seleção múltipla.
- fix: evita que apenas o último frame tocado/ativo roube o destaque visual quando há vários frames selecionados.
- preservado: a mudança é apenas de renderização do Stage; dados, ordem real dos frames, timeline, JSON, Preview, Export, duração, pausa, easing, loop, escala e rotação não foram alterados.
- `index.html`: versionamento mantido em `v8z4b26c`; renderização de `renderAll()` ajustada para separar camada visual de selecionados e não selecionados em seleção múltipla.
- `docs/QA-v8z4b26c.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b26c no repositório de teste.

## v8z4b26b — remover Sel e mostrar seleção múltipla no Stage

- ux: remove o botão visual `Sel` da faixa inferior de frames sem criar botão substituto ou deixar espaço vazio.
- ux: preserva ativação normal por toque na faixa de frames e permite alternar seleção múltipla pela própria interação nos frames: segundo toque no frame ativo ou long press como compatibilidade; com seleção iniciada, toques nos frames alternam entrada/saída do lote.
- ux: mantém diferença visual entre frame ativo, frames selecionados, ativo + selecionado e frames não selecionados nas pills e no Stage.
- preservado: aplicação em lote continua restrita aos modos Canto, Simétrico, Assimétrico e Desconectado, reaproveitando `applyPointModeForFrame()` e um único registro de Undo/Redo.
- preservado: seleção múltipla segue estado temporário; JSON, Preview, MP4, zoom/pan do Stage, inserção assistida, Reset, escala, rotação, duração, pausa, easing e motor de animação não foram alterados.
- `index.html`: versionamento atualizado para `v8z4b26b`; remoção do botão `btnMultiSelect`; seleção múltipla desacoplada do botão; marcação localizada de seleção no Stage/pills ajustada.
- `docs/QA-v8z4b26b.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b26b no repositório de teste.

## v8z4b26a — seleção múltipla de frames e modo de curva em lote

- feat: adiciona modo explícito `Sel` na faixa de frames para seleção múltipla por toque, sem depender de long press.
- feat: aplica Canto, Simétrico, Assimétrico e Desconectado em lote quando há 2 ou mais frames selecionados.
- fix: ação de modo de curva em lote usa um único registro de Undo/Redo e reaproveita `applyPointModeForFrame()`.
- preservado: seleção múltipla não entra no JSON, Preview/MP4 ignoram seleção, inserção assistida continua bloqueando ações externas e zoom/pan do Stage não foi alterado.
- `index.html`: versionamento atualizado para `v8z4b26a`; estado temporário `frameMultiSelectMode`; botão `Sel`; destaque localizado de frames selecionados; helper de aplicação em lote de modo de curva.
- `docs/QA-v8z4b26a.md`: checklist específico da versão.
- `docs/ROADMAP.md`: marca v8z4b26a como implementada.

## Checkpoint interno — v8z4b25h consolidada como base estável

- docs/checkpoint: v8z4b25h aprovada funcionalmente como checkpoint interno estável; não é release comercial e não cria nova versão funcional.
- docs/checkpoint: v8z4b25h substitui v8z4b25g como checkpoint atual porque inclui a correção do bloqueio de ações externas durante frame novo pendente/assistido.
- docs/checkpoint: v8z4b25g permanece registrada como base aprovada anterior da sequência de modos de ponto/curva.
- docs/checkpoint: manter v8z4b25h disponível como ponto de retorno caso próximas versões quebrem curva, loop, Preview, MP4, JSON, inserção assistida de frame ou gestos no iPhone/Safari.
- Escopo desta consolidação: documentação/roadmap/QA; nenhum comportamento do app, número de versão, interface, motor, Preview, MP4, JSON, zoom/pan, Undo/Redo, Loop, seleção de frames ou modos de curva foi alterado.

## v8z4b25h — pending assisted frame global UI guard

- fix: bloqueia ações globais enquanto existe frame assistido pendente de confirmação.
- fix: impede abertura de Duração, Curva, Transformação/Frame, Preview, MP4, JSON, Reset, Settings, seleção/troca/deleção/adição de frame até Confirmar ou Cancelar.
- `index.html`: adiciona guarda central para estado de frame pendente/ghost e atualiza `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão e comentário de topo.

## v8z4b25g — curve mode icons light color and pius wording cleanup

- visual: ajusta ícones do menu de curva para cor clara no tema escuro.
- visual: melhora leitura dos quatro modos de curva no iPhone/Safari.
- fix: remove referência textual indevida a “Pius” no contexto do menu de curva.
- `index.html`: `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão, comentário de topo e renderização dos ícones de modos de ponto/curva atualizados para usar `currentColor` via máscara vetorial.

## v8z4b25f — point mode icon SVG cleanup for iPhone readability

- visual: remove textos internos dos SVGs dos modos de ponto.
- visual: aumenta e normaliza leitura dos ícones Canto, Simétrico, Assimétrico e Desconectado.
- visual: ajusta viewBox/renderização dos ícones para melhor leitura no iPhone/Safari.
- `assets/icons/curve-modes/curve-corner.svg`, `curve-symmetric.svg`, `curve-asymmetric.svg`, `curve-disconnected.svg`: ícones vetoriais limpos, sem `<text>`, usando apenas símbolo gráfico com `stroke="currentColor"`.
- `index.html`: `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão, comentário de topo e tamanho visual de `.point-mode-icon` atualizados.

## v8z4b25e — curve mode menu icon refresh

- visual: substitui ícones dos modos de ponto/curva por novos SVGs fornecidos.
- visual: melhora leitura dos modos Canto, Simétrico, Assimétrico e Desconectado no menu de curva.

# Changelog

## v8z4b25d — loop-closed endpoint point modes fix

- fix: F1 e último frame com Loop ativo passam a respeitar modos de ponto como curva fechada.
- fix: Canto no fechamento do Loop reabre criando par de handles locais.
- fix: Simétrico e Assimétrico passam a considerar o handle do segmento de Loop.
- fix: Desconectado permanece como único modo com autonomia real entre os lados do ponto.

---

## v8z4b25c — corner reopen symmetric handles fix

- fix: reabrir ponto em modo Canto cria par de handles locais em vez de alternar apenas um lado.
- fix: ponto reaberto a partir de Canto passa automaticamente para Simétrico.
- fix: Undo/Redo preserva pointMode e handles locais ao fechar/reabrir ponto.

---

## v8z4b25b — point mode quick access

- fix: menu de modos de ponto/frame fica acessível por controle provisório claro.
- fix: modos Canto/Simétrico/Assimétrico/Desconectado podem ser testados no frame ativo.
- architecture: modos continuam associados ao ponto/frame, não ao segmento.

---

## v8z4b24b — stage gesture arbitration and viewport navigation

- fix: zoom/pan com dois dedos não seleciona frames acidentalmente.
- fix: handles, overlays e elementos tutoriais do Stage não são ativados ao iniciar gesto de dois dedos.
- fix: adicionado bloqueio curto após navegação do Stage para evitar taps residuais.
- fix: área interativa de zoom/pan passa a cobrir o viewport de edição, não apenas a imagem.
- architecture note: imagem passa a ser tratada como conteúdo dentro do Stage, não como limite de navegação.

---

## v8z4b22c — ghost frame exclusive interaction fix

- fix: interação exclusiva do ghost frame.
- fix: handler de escala/rotação não aciona mais movimento simultâneo.
- fix: scale/rotate do ghost usam centro atual após drag.
- fix: Stage ignora eventos iniciados em controles do ghost.

---

## v8z4b22b — assisted frame insertion ghost UX fix

- fix: OK/Cancelar do ghost funcionando.
- ux: ações OK/Cancelar passam para dentro do ghost.
- feat/ux: ghost permite ajustar posição, escala e rotação antes de confirmar.
- fix: confirmação gera um único Undo e não salva estado transitório no JSON.

---

## v8z4b22a — assisted frame insertion

Nova função de UX controlada sobre v8z4b21e. Base obrigatória: v8z4b21e.

### Implementação

- O botão `+` não cria mais frame definitivo imediatamente.
- O app entra em modo temporário `isInsertingFrame` com `pendingFrameInsert`, `insertFrameMode` e `ghostFrame`.
- O Stage mostra um ghost frame translúcido, com rótulo do futuro frame e controles pequenos OK/Cancelar.
- Tocar ou arrastar no Stage reposiciona o ghost; mover o ghost não altera `frameCount`, arrays do projeto nem undo.
- Cancelar remove o ghost e restaura a interação normal sem alterar o projeto.
- Confirmar cria uma única entrada de undo e insere o frame definitivo na posição escolhida.

### Curvas, loop e timing

- Inserção entre frames divide o trecho original localmente.
- Se o ghost sugerido em t=0.5 for aceito sem mover, curvesV2 usa subdivisão De Casteljau para preservar a cúbica.
- Se o ghost for movido, os dois trechos locais recebem handles padrão de 1/3 da corda, com `manual:false`.
- Inserção no último frame com loop ativo adiciona o novo frame como último antes do fechamento; o loop passa a ser novo último→F1.
- Inserção depois do último sem loop usa `defaultNewSegmentDuration`.
- Ao dividir trecho existente, `segDurations` é dividido metade/metade e o novo frame nasce com pause 0.
- Rotação e tamanho são interpolados entre frames quando há próximo frame; ao inserir depois do último, são copiados do frame ativo.

### Preservações

- curvesV2 continua fonte de verdade; handles OUT/IN independentes preservados.
- Preview, MP4/export, Movimento inteligente, Reset Project e Reset Curves não receberam alteração funcional.
- Estado transitório (`isInsertingFrame`, `ghostFrame`, `pendingFrameInsert`, `insertFrameMode`) não é salvo no JSON.
- Direct Curve Drag, Path/Insert Tool e começar com 1 frame/0 frames ficaram apenas no ROADMAP.

### Arquivos alterados

- `index.html`: modo assisted frame insertion, ghost frame, confirmação/cancelamento, inserção local e versionamento → v8z4b22a.
- `CHANGELOG.md`: este registro.
- `QA.md`: checklist v8z4b22a.
- `ROADMAP.md`: v8z4b22a concluído e próximos itens mantidos como futuros.
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21e — restore local loop influence in smart movement

Correção funcional sobre v8z4b21d. Base obrigatória: v8z4b21d.

### Diagnóstico

A v8z4b21c/v8z4b21d evitou a falsa parada causada por loop curto usando `suppressLoop=true` nos trechos normais. Isso protegeu F1→F2, mas também removeu demais a continuidade local: o loop deixou de influenciar F1 e o último frame como vizinho real, deixando o Movimento inteligente mais achatado e o loop próximo de velocidade constante crua.

O bug original não era a presença do loop como vizinho. O bug era permitir que slopes extremos produzissem derivada interna zero no Hermite.

### Correção

- `_smartFrameVelocity()` voltou a considerar apenas vizinhos imediatos reais.
- Para F1, o trecho anterior é o loop último→F1 quando `loopEnabled=true`.
- Para o último frame, o trecho posterior é o loop último→F1 quando `loopEnabled=true`.
- Frames internos continuam usando somente os trechos normais adjacentes; o loop não entra em F2→F3, exceto em projetos pequenos onde o frame é fronteira real.
- `computeSmartMovementProgress()` não passa mais `suppressLoop=true` nos trechos normais.
- `_limitSmartHermiteSlopes()` continua aplicado após o cálculo local de velocidades: `m0 >= 0`, `m1 >= 0`, e `m0 + m1 <= 3`.

### Comportamento esperado

- F1→F2 usa loop como vizinho anterior e F2→F3 como vizinho posterior.
- F2→F3 usa F1→F2 e F3→F4, sem interferência direta do loop.
- F3→F4 usa F2→F3 e loop como vizinho posterior.
- Loop F4→F1 usa F3→F4 como anterior e F1→F2 como posterior.
- No caso mínimo 2 frames / F1→F2 4s / loop 1s / smart / manual / framePauses zeradas, F1→F2 não deve ter falsa parada no meio; o loop deve receber smart movement local perceptível.
- Reset Project, Reset Curves, handles OUT/IN independentes, JSON curvesV2, Preview e MP4 permanecem no mesmo fluxo existente.

### Arquivos alterados

- `index.html`: restaura vizinhança local real do loop no Movimento inteligente; versão → v8z4b21e.
- `CHANGELOG.md`: este registro.
- `QA.md`: checklist v8z4b21e.
- `ROADMAP.md`: v8z4b21e concluído; Direct Curve Drag e Assisted Frame Insertion continuam futuros.
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21d — fix project reset baseline and smart loop continuity

Correção funcional sobre v8z4b21c. Base obrigatória: v8z4b21c.

### Diagnóstico

**Bug 1 — Reset Project:** o reset reconstruía o template padrão (`pan-lr`) em vez de restaurar o projeto carregado no início da sessão. Ao abrir um JSON salvo, mexer no projeto e acionar Reset, frames/curvas/duração/loop voltavam ao template inicial.

**Bug 2 — loop no Movimento inteligente:** v8z4b21c isolou corretamente o loop dos trechos normais com `suppressLoop=true`, mas o trecho de loop ainda precisava de smart movement local com clamp monotônico. O clamp individual em `3*vAvg` podia criar combinações de slopes altas demais e trancos/quase-holds.

### Correção

- Adicionado `projectResetBaseline`, um snapshot profundo do estado normalizado da sessão.
- Ao carregar JSON com sucesso, `applyFrameData()` atualiza o baseline depois de normalizar arrays, migrar/converter curvesV2 e renderizar o Stage.
- Ao criar projeto inicial a partir de imagem/template, o baseline passa a ser esse template inicial da sessão.
- `resetAll()` agora restaura o baseline, cria uma única entrada de undo quando há diferença, e não limpa a pilha de undo.
- Salvar JSON não altera o baseline.
- Adicionado `_limitSmartHermiteSlopes()`: `m0 >= 0`, `m1 >= 0`, e se `m0 + m1 > 3`, ambos são escalados proporcionalmente.
- Trechos normais continuam usando `suppressLoop=true`, preservando a correção da v8z4b21c.
- O trecho de loop continua usando Movimento inteligente local (`suppressLoop=false`) e agora recebe o mesmo limiter monotônico.

### Comportamento após a correção

- Reset Project volta ao estado do projeto carregado, não ao template padrão.
- Undo após Reset Project volta ao estado anterior ao reset; Redo reaplica o reset.
- Loop curto não contamina o trecho normal F1→F2.
- O loop participa do Movimento inteligente com continuidade local e sem tranco forte.
- Reset Curves continua funcionando com curvesV2.
- Handles OUT/IN independentes não foram alterados.
- Preview e MP4 usam o mesmo cálculo corrigido via `getStateAtT`.
- Velocidade constante continua usando os cálculos de comprimento existentes.
- JSON salvo usa `version: v8z4b21d` e preserva `curvesV2`, `framePauses`, `segDurations` e `loopDuration`.

### Arquivos alterados

- `index.html`: baseline de Reset Project; undo/redo do reset; limiter monotônico do smart movement; versão → v8z4b21d.
- `CHANGELOG.md`: este registro.
- `QA.md`: checklist v8z4b21d.
- `ROADMAP.md`: v8z4b21d concluído; Direct Curve Drag e Assisted Frame Insertion mantidos como futuros.
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21c — fix smart loop false stop and reset curves v2

Correção funcional do Movimento inteligente com loop e do Reset Curves para curvesV2. Base obrigatória: v8z4b21b.

### Diagnóstico

Em v8z4b21b, com `movementEasingMode: smart`, `segmentTimingMode: manual`, `loopEnabled: true` e `loopDuration` curto (ex: 1s para trecho normal de 4s), o usuário observava uma falsa parada/ease no meio da curva normal.

**Causa raiz (Bug 1 — falsa parada):** O cálculo de continuidade do Hermite em `_smartFrameVelocity` incluía a velocidade do trecho de loop (`vLoop = loopLength / loopDuration`) na mistura das velocidades dos frames de fronteira (frame 0 e frame N). Com um loop curto, `vLoop` é muito maior que `vAvg` do trecho normal. O clamp a `3*vAvg` limitava as velocidades de fronteira ao máximo, e com `vStart = vEnd = 3*vAvg`, a derivada Hermite colapsa para zero em `τ = 0.5` — criando uma parada falsa exatamente no meio da curva.

**Prova matemática:** Com `vStart = vEnd = v = 3*curveLen/dur` (clamp máximo):
```
p(τ) = curveLen * (4τ³ - 6τ² + 3τ)
p'(τ) = curveLen * (12τ² - 12τ + 3) = 3*curveLen*(2τ-1)²
p'(0.5) = 0  ← falsa parada
```

**Causa raiz (Bug 2 — Reset Curves):** `resetSegmentCurve` resetava apenas os `ctrlPts` legados e `loopCtrlPt`, mas não tocava `curvesV2.frameHandles`. Como curvesV2 é a fonte de verdade da curva, o Stage continuava exibindo a curva antiga após o reset.

### Correção

**Bug 1 — suppressLoop:**
- Adicionado parâmetro `suppressLoop` a `_smartFrameVelocity`.
- Quando `suppressLoop=true`, `vLoop` não entra na mistura das velocidades de fronteira dos trechos normais.
- `computeSmartMovementProgress` passa `suppressLoop=true` ao calcular `vStart` e `vEnd` para trechos normais.
- O trecho de loop em si usa `suppressLoop=false` (omitido) — mantém continuidade com os trechos normais.
- Resultado: com `loopEnabled=true` e `loopDuration` curto, os frames de fronteira dos trechos normais usam apenas a velocidade do próprio trecho como referência → Hermite sem falsa parada.

**Bug 2 — Reset Curves para curvesV2:**
- `resetSegmentCurve` agora, quando `isCurvesV2Active()`, reseta também `curvesV2.frameHandles.out[fi0]` e `curvesV2.frameHandles.in[fi1]` para a posição padrão (1/3 da corda na direção do segmento).
- Para trecho normal `i→i+1`: `out[i] = {dx: (P3x-P0x)/3, dy: (P3y-P0y)/3}`, `in[i+1] = {dx: (P0x-P3x)/3, dy: (P0y-P3y)/3}`.
- Para trecho de loop `N-1→0`: `out[N-1]` e `in[0]` resetados proporcionalmente à corda do loop.
- Os `ctrlPts` legados continuam sendo resetados (fallback preservado).

### Comportamento após a correção

- 2 frames, F1→F2 4s, loop 1s, smart movement, framePauses zero: **sem falsa parada no meio da curva**.
- Loop curto não contamina o easing dos trechos normais.
- Desativar Movimento inteligente continua funcionando.
- Ativar Velocidade constante continua funcionando.
- Reset Curves exibido no Stage mostra a curva resetada imediatamente.
- Undo do Reset Curves restaura os handles anteriores (curvesV2 está no `captureState`).
- Handles OUT/IN independentes da v8z4b21a não foram alterados.
- `segmentTimingMode: manual` preservado — nenhuma redistribuição de duração ocorre.
- Compatibilidade com arquivos antigos (sem curvesV2) preservada.

### Caso mínimo de regressão (testado)

- 2 frames; F1→F2 duração 4s; `loopEnabled: true`; `loopDuration: 1s`; `movementEasingMode: smart`; `segmentTimingMode: manual`; `constantSpeedTotalDuration: null`; `framePauses` zerados; curvesV2 ativo.
- **Resultado: F1→F2 sem falsa parada. Loop rápido não contamina trecho normal.**

### Arquivos alterados

- `index.html`: `_smartFrameVelocity` (parâmetro `suppressLoop`), `computeSmartMovementProgress` (passa `suppressLoop=true` para trechos normais), `resetSegmentCurve` (reseta `curvesV2.frameHandles`); versão → v8z4b21c.
- `CHANGELOG.md`: este registro.
- `QA.md`: critérios de QA atualizados.
- `ROADMAP.md`: próximas ideias registradas (sem implementação).
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21b — fix smart movement timing for cubic curves

Correção funcional do Movimento inteligente aplicado a curvesV2/Bézier cúbica. Base obrigatória: v8z4b21a.

### Diagnóstico

Em v8z4b21a, com `movementEasingMode: smart` e `segmentTimingMode: manual`, o usuário observava uma falsa parada/ease indevido ao longo de trechos com curvesV2. Desativar o Movimento inteligente ou ativar Velocidade constante eliminava o problema.

**Causa raiz:** `measureSegmentCurveLength` e `measureLoopCurveLength` usavam Bézier **quadrática** (ctrlPts legados) para medir o comprimento do arco, mesmo quando `curvesV2` (Bézier cúbica real) estava ativo. Isso gerava `vAvg` incorreto no Hermite do smart movement, criando perfis de velocidade errôneos — em particular, desaceleração artificial próxima a frames quando a cúbica tem comprimento diferente da quadrática.

### Correção

- **`measureSegmentCurveLength`**: quando `isCurvesV2Active()`, usa `getCurvesV2CubicCP(segIndex)` + `evalCubicBezierPt()` para medir o comprimento da curva cúbica real. Fallback para quadrática legada se curvesV2 inativo ou inválido.
- **`measureLoopCurveLength`**: idem para o trecho de fechamento N→1, usando `getCurvesV2CubicCP(getLoopSegmentIndex())`.

Ambas as funções alimentam diretamente `_smartSegmentVAvg`, `_smartFrameVelocity` e `computeSmartMovementProgress` — assegurando que o Hermite cúbico do Movimento inteligente usa velocidades calibradas com o comprimento real da curva cúbica.

### Comportamento após a correção

- Movimento inteligente com curvesV2 não cria falsa parada quando `framePauses` são zeros.
- A câmera pode suavizar a velocidade entre trechos, mas não freia artificialmente.
- Velocidade constante continua funcionando (redistribui durações proporcionalmente ao comprimento cúbico — que já era correto via `mapProgressToBezierU`).
- Preview e MP4 usam o mesmo cálculo corrigido (via `getStateAtT`).
- Loop: `measureLoopCurveLength` corrigido elimina a falsa parada no trecho de fechamento.
- Handles OUT/IN independentes da v8z4b21a não foram alterados.
- Compatibilidade com arquivos antigos (sem curvesV2) preservada: fallback quadrático mantido.

### Arquivos alterados

- `index.html`: correção em `measureSegmentCurveLength` e `measureLoopCurveLength`; versão → v8z4b21b.
- `CHANGELOG.md`: este registro.
- `QA.md`: critérios de QA atualizados.
- `ROADMAP.md`: próximas ideias registradas (sem implementação).
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21a — implement real cubic in-out handles

Mudança arquitetural controlada do modelo de curvas. Base obrigatória: v8z4b20d.

### curvesV2 — novo modelo cúbico

Introduz `curvesV2` como fonte de verdade para curvas Bézier cúbicas com handles in/out independentes por frame.

**Estrutura:**
```json
{
  "version": 1,
  "mode": "cubic",
  "frameHandles": {
    "out": [{"dx": 40, "dy": 0, "manual": true}, ...],
    "in":  [null, {"dx": -40, "dy": 0, "manual": false}, ...]
  }
}
```
- `out[i]`: vetor relativo do centro do frame i até C1 do trecho i→i+1.
- `in[i]`:  vetor relativo do centro do frame i até C2 do trecho (i-1)→i.
- Vetores relativos: handles acompanham o frame ao mover (não precisam de resync).

### Handles independentes

- Arrastar OUT de F(i) altera apenas `curvesV2.frameHandles.out[i]`.
- Arrastar IN de F(i) altera apenas `curvesV2.frameHandles.in[i]`.
- Nenhum dos dois afeta o handle oposto do mesmo trecho.
- Não usa mais o ctrlPt legado como se fossem dois handles.

### Bézier cúbica real

- `drawBezier()`: usa `M P0 C C1 C2 P3` (SVG C) em vez de `Q`.
- `getStateAtT()`: `bezierPointAt()` usa `evalCubicBezierPt()` quando curvesV2 ativo.
- `evaluateSegmentPath()`: caminho preferencial usa cúbica antes do runtime legado.
- Preview e MP4 seguem a mesma curva desenhada.

### Compatibilidade com arquivos antigos

- `applyFrameData()`: se JSON não tem `curvesV2`, chama `convertLegacyCtrlPtsToCurvesV2()`.
- Conversão: quadrática Q → cúbica via C1 = P0 + 2/3*(Q-P0), C2 = P3 + 2/3*(Q-P3).
- Arquivos antigos abrem sem perda de curva visual.

### JSON

- `buildProjectData()` salva `curvesV2` no JSON.
- `version: "v8z4b21a"` persistido.
- Campos `ctrlPts`/`ctrlPtManual`/`loopCtrlPt` mantidos para fallback.

### Undo/Redo

- `captureState()` / `restoreState()` incluem `curvesV2` via `cloneCurvesV2()`.
- Handles são restaurados corretamente no Undo.

---

## v8z4b20d — fix handle sync after frame move and visible segment handles

Correção de estabilização sobre a v8z4b20c. Base obrigatória: v8z4b20c.

### Problema 1 — Handle fica parado ao mover frame

**Sintoma:** Após ajustar um handle IN/OUT e mover o frame, o handle visual permanecia na posição anterior enquanto o frame se deslocava.

**Causa raiz — handles de loop:** `syncCtrlPtsForFrame` não processava `loopCtrlPt`. Quando F1 ou o último frame era movido, `loopCtrlPt.nx/ny` não era recalculado, fazendo o handle de loop aparecer estático.

**Causa raiz — handles manuais próximos:** `getFrameHandleGeometryForTarget` usava threshold de 8px; se o ctrl pt recomposto ficasse dentro de 8px do frame, o fallback de direção de corda era ativado, dando aparência de handle "pulando" para nova posição.

**Correção A — syncCtrlPtsForFrame estendido:**
Quando `fi === 0` ou `fi === frameCount - 1` e `loopEnabled`, o `loopCtrlPt` é recalculado usando `t/perpX/perpY` armazenados na corda do trecho de loop (último frame → F1). O handle de loop agora acompanha visualmente F1 e o último frame quando são movidos.

**Correção B — applyFrameConnectedHandleEdit para loop:**
Ao arrastar um handle de loop, `t/perpX/perpY` agora são calculados e armazenados em `loopCtrlPt`. Isso permite que `syncCtrlPtsForFrame` reconstrua corretamente `nx/ny` após movimento de frame.

**Correção C — threshold reduzido:**
O threshold de 8px em `getFrameHandleGeometryForTarget` foi reduzido para 2px para ctrl pts manuais. Adicionado fallback seguro que sempre exibe o ctrl pt manual mesmo quando dist < threshold.

### Problema 2 — segBlurSettings desalinhado

**Sintoma:** JSON salvo com `frameCount:6` mas `segBlurSettings` com apenas 4 entradas (precisava de 5 = frameCount - 1).

**Causa raiz:** `deleteActiveFrame` não fazia splice em `segBlurSettings`. Após remover um frame, o array ficava maior que o necessário. `normalizeProjectArrays()` não tratava `segBlurSettings`.

**Correção D — ensureSegmentArraysIntegrity():**
Novo helper centralizado que normaliza todos os arrays por trecho para exatamente `frameCount - 1` entradas:
- `ctrlPts` (preenche com midpoint automático)
- `ctrlPtManual` (preenche com `false`)
- `segBlurSettings` (preenche com default `{enabled:false, maxPx:4, fadeIn:0.18, fadeOut:0.22}`)
- `segDurations` (preenche com `defaultNewSegmentDuration`)
- `rotEasings` (preenche com `'linear'`)
- `scaleEasings` (preenche com `'linear'`)

Chamado em: `deleteActiveFrame`, `buildProjectData` (antes de salvar), `applyFrameData` (após carregar).

**Correção E — deleteActiveFrame:**
Agora faz splice correto em `segBlurSettings` (como já fazia para `ctrlPts`/`ctrlPtManual`), depois chama `ensureSegmentArraysIntegrity()`.

### BLOCO D — Ghost handles do lado complementar (UX)

Para melhorar a leitura visual do trecho ativo, o app agora exibe os dois lados do trecho de forma simultânea:

- **Handles interativos** (âmbar sólido): os handles IN/OUT do frame selecionado — permanecem editáveis.
- **Ghost handles** (âmbar com 28% de opacidade, sem interação): o handle do frame vizinho no outro extremo do mesmo trecho — apenas indicação visual, `pointer-events: none`.

Exemplo (2 frames, sem loop):
- F1 selecionado: OUT de F1 (interativo) + IN de F2 como ghost
- F2 selecionado: IN de F2 (interativo) + OUT de F1 como ghost

Não fingem independência — ambos representam o mesmo `ctrlPt` legado do trecho. Não implementado para loop nesta versão.

### Preservações

- Edição local por trecho (segment-local editing da v8z4b20c): preservada.
- F1 mostra OUT; último frame mostra IN; loop em F1/último conforme esperado.
- Midpoint automático oculto.
- Ctrl-pt legado oculto em segmentos normais.
- `loopCtrlPt` continua como schema salvo; sem campo novo.
- Undo/Redo por trecho: preservado; não há undo duplicado.
- Preview, MP4, Salvar MP4: sem regressão.
- Arquivos da v8z4b20c abrem normalmente.

### Arquivos alterados

- `index.html`
- `CHANGELOG.md`
- `QA.md`
- `ROADMAP.md`
- `pages-deploy-stamp.txt`

---

## v8z4b20c — fix endpoint loop handles and segment-local editing

Correção funcional dos handles de frame revelados como problemáticos na v8z4b20b.

### Problema corrigido

A v8z4b20b criou dois handles IN/OUT para frames intermediários, mas revelou:
1. F1 e último frame não tinham handles, mesmo com trecho conectado.
2. Com loop ativo, F1 e último frame precisavam de handles para o trecho de loop.
3. Arrastar um handle resetava/sobrescrevia a curva ajustada pelo frame vizinho (modo linkado).

### BLOCO A — Nova regra de exibição: handles por trecho conectado

Substituída a regra limitada `activeIdx > 0 && activeIdx < frameCount - 1`
por uma regra baseada em conexões reais do frame ativo.

**Handle IN aparece se:**
- existe trecho anterior normal: `fi > 0`
- OU existe trecho de loop entrando no F1: `loopEnabled && fi === 0 && frameCount >= 2`

**Handle OUT aparece se:**
- existe trecho seguinte normal: `fi < frameCount - 1`
- OU existe trecho de loop saindo do último frame: `loopEnabled && fi === frameCount - 1 && frameCount >= 2`

**Exemplos:**
| Config | F1 | F2 | F3 | F4 |
|---|---|---|---|---|
| 4 frames, sem loop | OUT | IN+OUT | IN+OUT | IN |
| 4 frames, com loop | IN(loop)+OUT | IN+OUT | IN+OUT | IN+OUT(loop) |
| 2 frames, sem loop | OUT | IN | — | — |
| 2 frames, com loop | IN(loop)+OUT | IN+OUT(loop) | — | — |

### BLOCO B — Segment-local editing (substitui modo suave/linkado)

**Problema do modo linkado (v8z4b20b):** arrastar um handle atualizava dois ctrlPts vizinhos
ao mesmo tempo, fazendo o ajuste de um frame interferir no do frame vizinho.

**Novo comportamento:**
- **Handle IN** edita apenas `ctrlPts[fi - 1]` (trecho `F(fi-1) → F(fi)`).
- **Handle OUT** edita apenas `ctrlPts[fi]` (trecho `F(fi) → F(fi+1)`).
- Handle IN de F1 com loop edita apenas `loopCtrlPt`.
- Handle OUT do último frame com loop edita apenas `loopCtrlPt`.

**Importante (schema legado):**
O handle OUT de F4 e o handle IN de F5 representam o mesmo trecho F4→F5 no schema legado.
Editar um atualiza esse trecho; quando selecionar o outro frame, o handle correspondente reflete
a posição atual do mesmo ctrlPt. Isso é esperado e correto.

**O que foi desativado:** link automático que atualizava dois trechos vizinhos por drag.
- Modo Suavizar/Angular real ficará para etapa futura.
- Suavizar futuramente será ação/contexto explícito.

### BLOCO C — Novos helpers de target por conexão

- `getFrameConnectedHandleTargets(fi)` → `{ inTarget, outTarget }`: retorna os targets
  de segmento conectados aos handles IN e OUT do frame fi.
- `getFrameHandleGeometryForTarget(fi, role, target)` → `{ hx, hy }`: calcula posição
  visual do handle a partir do ctrlPt real do target.
- `getFrameHandleGeometry(fi)` → `{ Px, Py, inHx, inHy, outHx, outHy, inTarget, outTarget }`:
  geometria completa para qualquer frame ativo.

### BLOCO D — applyFrameConnectedHandleEdit

- Nova função `applyFrameConnectedHandleEdit(fi, role, target, hx, hy)`.
- Edita apenas o target indicado.
- Armazena `t/perpX/perpY` para preservar curva ao mover frame (v8z4b19z preservado).
- Não altera `ctrlPtManual` de outros segmentos.
- Não altera `loopCtrlPt` quando target não for loop.

### BLOCO E — Modo suave/linkado desativado

- Desativado em v8z4b20c: `applyFrameHandleEdit` (modo linkado) não é mais chamado na UI.
- Modo Suavizar/Angular real fica para etapa futura.
- `applyFrameHandleEdit` preservada internamente como legado.

### BLOCO F — Handles de loop

- F1 com loop: IN handle associado ao `loopCtrlPt`.
- Último frame com loop: OUT handle associado ao `loopCtrlPt`.
- Loop ctrl-pt (`cpt_loop`) fica oculto (opacity:0, pointer-events:none) quando
  handles de loop estão disponíveis — evita sobreposição visual.
- Arrastar IN de F1 (target loop) edita `loopCtrlPt`.
- Arrastar OUT do último frame (target loop) edita `loopCtrlPt`.

### BLOCO G — Visual

- Handles de loop: cor roxa (`rgba(180,100,255,1)`) para diferenciar de handles normais.
- Braços de haste no `bezierSvg`: roxo para loop, âmbar para normais.
- Endpoints com um único handle: apenas esse handle é exibido.
- Midpoint continua oculto; ctrl-pt legado continua oculto.

### BLOCO H — Undo/Redo

- Um drag de handle gera uma única entrada de undo (lazy capture no primeiro pixel).
- Tocar sem mover não cria undo.
- Undo desfaz apenas o trecho editado (segment-local).
- Redo refaz apenas o trecho editado.
- Loop: Undo/Redo restaura apenas `loopCtrlPt`.

### BLOCO I — Bugfix mover frame (v8z4b19z preservado)

- `applyFrameConnectedHandleEdit` armazena `t/perpX/perpY` após setar `nx/ny`.
- `syncCtrlPtsForFrame` preserva ajustes manuais ao mover frame ativo.

### JSON schema

- Sem campos novos.
- `version` salvo como `v8z4b20c`.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`, `framesNorm`, `frameRotations`,
  `segDurations`, `framePauses` — todos preservados.
- Arquivos da v8z4b20b continuam abrindo normalmente.

---

## v8z4b20b — prototype active frame in-out handles

Primeiro protótipo visual/funcional dos dois handles no frame intermediário ativo.
Substitui o handle único simétrico (`frame-tangent-dot`, v8z4b19z) por dois handles
distintos: **handle de entrada (IN)** e **handle de saída (OUT)**, ambos losangos âmbar.

### BLOCO A — Dois handles no frame intermediário ativo

**Decisão de produto:** o frame intermediário ativo agora mostra dois handles separados:
- **IN handle** (`.frame-in-handle`): controla o trecho anterior (fi-1 → fi), derivado de `ctrlPts[fi-1]`.
  Losango âmbar mais suave, no lado de entrada do frame.
- **OUT handle** (`.frame-out-handle`): controla o trecho seguinte (fi → fi+1), derivado de `ctrlPts[fi]`.
  Losango âmbar mais vivo (z-index 78), no lado de saída do frame.

**Visibilidade:**
- Aparece apenas quando: imagem carregada, `frameCount >= 3`, frame intermediário ativo
  (`activeIdx > 0` e `activeIdx < frameCount - 1`), não está em Preview, não está em `_isoMode`.
- F1 e último frame: sem handles IN/OUT.
- Loop: sem handles IN/OUT (loop ctrl-pt preservado).

### BLOCO B — Modo suave/linkado por padrão

**Comportamento seguro:** arrastar qualquer handle atualiza **os dois ctrlPts** em 180°
(colineares), preservando passagem contínua pelo frame ativo.

- Arrastar OUT handle: `ctrlPts[fi] ← P + dir*strengthOut`, `ctrlPts[fi-1] ← P - dir*strengthIn`
- Arrastar IN handle: `ctrlPts[fi-1] ← P + dir*strengthIn`, `ctrlPts[fi] ← P - dir*strengthOut`
- Modo Angular/Livre: **não implementado nesta versão** (roadmap futuro).

### BLOCO C — Geometria derivada dos ctrlPts reais

- Novo helper `getActiveFrameInOutHandleGeometry(fi)`: retorna `{Px, Py, inHx, inHy, outHx, outHy}`.
- Posição dos handles derivada dos ctrlPts reais, não de padrão automático.
- Se ctrlPts forem automáticos (não manuais), usa fallback pela corda `P[fi-1] → P[fi+1]`.
- Não sobrescreve ctrlPts apenas por renderizar.

### BLOCO D — Braços de haste no bezierSvg

- Dois braços (linhas) desenhados no `bezierSvg` para IN e OUT:
  - Braço IN: `stroke="rgba(255,210,0,0.55)"`, tracejado.
  - Braço OUT: `stroke="rgba(255,210,0,0.78)"`, sólido.
- Substituem o único braço tracejado do handle anterior.

### BLOCO E — Força por distância (v8z4b19z preservado)

- `dLen` controla intensidade: perto = suave, longe = curva mais oblíqua.
- Clamp: `MAX(10, MIN(lenSegment * 0.65, dLen))`.
- Lado oposto usa comprimento proporcional do seu trecho para estabilidade.

### BLOCO F — Bugfix mover frame (v8z4b19z preservado)

- `applyFrameHandleEdit()` armazena `t/perpX/perpY` consistentes após setar `nx/ny`.
- `syncCtrlPtsForFrame()` preserva ajustes manuais ao mover o frame ativo.
- Teste: ajustar handle → mover frame → curva não reseta.

### BLOCO G — Undo/Redo

- Um drag de handle gera uma única entrada de undo (lazy capture no primeiro pixel).
- Tocar sem mover não cria undo.
- Undo desfaz os dois ctrlPts juntos (modo linkado).
- Redo refaz os dois juntos.
- `markProjectDirty('frame-inout-handle')` ao término do drag.

### BLOCO H — Compatibilidade

- Handle legado `frame_tangent_dot` ocultado (display:'none') em `updateCtrlPts`.
- CSS e funções legadas preservadas (`startFrameTangentDrag`, `applyFrameTangentEdit` → delega para `applyFrameHandleEdit('out', ...)`).
- `frameTangentDragState` preservado como legado (não iniciado na UI normal).
- Loop ctrl-pt sem alteração.
- Midpoint continua oculto.
- ctrl-pt legado continua oculto.

### JSON schema

- Sem campos novos.
- `version` salvo como `v8z4b20b`.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`, `framesNorm`, `frameRotations`,
  `segDurations`, `framePauses` — todos preservados.
- Arquivos da v8z4b20a continuam abrindo normalmente.

---

## v8z4b20a — demote midpoint UI and document anchor handle model

Correção de direção conceitual: o midpoint automático não deve ser ferramenta
principal da interface, pois compete com os handles de frame. Esta versão oculta
o midpoint pathPoint da UI principal e documenta o modelo futuro de âncoras e handles.

### BLOCO A — Ocultar midpoint da UI principal

**Decisão de produto:** o midpoint automático cria dois sistemas concorrentes
(midpoint do trecho + handles do frame). Esta versão demove o midpoint da UI normal.

**Implementação:**
- `updateCtrlPts()`: midpoint pathPoints (`.mid-pathpt`) nunca recebem `display:'block'`.
  Elementos DOM existentes recebem `display:'none'` sempre; novos elementos não são criados.
- Midpoint do loop (`midpt_loop`): mesma lógica — sempre oculto.
- CSS `.mid-pathpt`: adicionado `pointer-events:none` para garantir que elementos
  residuais no DOM não interceptem toque mesmo se `display` for alterado.

**Preservado internamente:**
- `buildRuntimeCurveModel()`, `simulateRuntimePathPointEdit()`,
  `createLegacyCurvePatchFromSimulatedPathPointEdit()`, `validateLegacyCurvePatchCandidate()`,
  `applyLegacyCurvePatchCandidateToRealState()`, self-test interno (v8z4b19t):
  todo o código de midpoint permanece para compatibilidade, diagnóstico e fallback.

### BLOCO B — ctrl-pt/losango legado não reexibido

**Problema:** com midpoint oculto, o sync anterior (v8z4b19x) que só escondia
`ctrl-pt` quando midpoint estava ativo deixaria o ctrl-pt visível novamente.

**Correção:** `updateCtrlPts()` agora sempre aplica `opacity:'0'` e
`pointer-events:'none'` nos ctrl-pts de segmentos normais, independente do midpoint.

**Loop ctrl-pt preservado:** o `cpt_loop` (bolinha de edição da curva de loop)
permanece visível e interativo — não há frame tangent handle disponível para
o segmento de loop (handle só aparece em frames intermediários, não F1/último).

### BLOCO C — Frame tangent handle permanece foco atual

- Handle de frame intermediário da v8z4b19z mantido sem alteração.
- Visual losango/diamante âmbar preservado.
- Distância controlando força da tangente preservado.
- Preservação ao mover frame preservada.
- Undo/Redo/dirty preservados.
- JSON schema inalterado.

### BLOCO D — ROADMAP atualizado

- Modelo futuro de âncoras e handles documentado.
- Angular/Suavizar/Reta/Remover registrados como estados futuros.
- Pen/Patch Tool registrado como ferramenta futura.
- Desenho livre com dedo registrado como ferramenta futura.
- Ponto auxiliar/frame falso registrado como alternativa ao midpoint automático.
- Midpoint explicitamente classificado como legado/fallback, não UI principal.

### JSON schema

- Sem campos novos.
- `version` salvo como `v8z4b20a`.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`, `framesNorm`, `frameRotations`,
  `segDurations`, `framePauses` — todos preservados.

## v8z4b19z — preserve frame tangent edits when moving frames

Corrige o bug principal onde mover um frame após ajustar o handle/tangente resetava a curva
para uma posição automática/reta/ortogonal. Diferencia visualmente o handle de frame do
midpoint pathPoint. Faz a distância do handle ao centro do frame controlar a intensidade
da tangente.

### BLOCO A — Corrigir reset da tangente ao mover frame

**Bug corrigido:** após ajustar o handle de tangente, mover o frame resetava ctrlPts para
a posição padrão (midpoint automático).

**Causa:** `applyFrameTangentEdit()` setava apenas `{nx, ny}` nos ctrlPts, deixando
`{t, perpX, perpY}` com valores stale do estado anterior. Quando `syncCtrlPtsForFrame()`
rodava no próximo drag de frame, encontrava `t`/`perpX`/`perpY` finitos mas stale,
usava-os para reposicionar o ctrl pt, e resetava a tangente.

**Correção:** após setar `nx`/`ny`, `applyFrameTangentEdit()` agora chama
`computeTPerpForSeg()` para derivar `t`/`perpX`/`perpY` consistentes com a nova posição,
garantindo que `syncCtrlPtsForFrame()` preserve a tangente manual ao mover frames.

### BLOCO B — Diferenciar visualmente handle de frame do midpoint pathPoint

- Handle de frame (`#frame_tangent_dot`) trocado de **círculo** para **losango/diamante**:
  - `border-radius: 2px` (era `50%`) + `rotate(45deg)` no transform CSS.
  - Cor âmbar/dourada mantida; haste tracejada âmbar mantida.
  - midpoint pathPoint continua círculo branco com borda colorida.

### BLOCO C — Distância do handle controla força da tangente

- `applyFrameTangentEdit()` usa `dLen` (distância P→H) como `strength` dos ctrlPts:
  - `strengthPrev = clamp(dLen, 10, lenPrev * 0.65)` — trecho anterior.
  - `strengthNext = clamp(dLen, 10, lenNext * 0.65)` — trecho seguinte.
  - Perto do frame = suavidade leve; longe = curva mais oblíqua, sem explodir.
  - Antes: força era fixada em `0.4 * comprimento_do_trecho` independente do drag.

### Nova função `getFrameTangentGeometry(fi)`

- Substitui `getFrameTangentDir(fi)` — retorna posição absoluta `{hx, hy, dirX, dirY, dist}`.
- Deriva do estado real dos ctrlPts (não sobrescreve curvas).
- Se `ctrlPtManual[fi-1]` e/ou `ctrlPtManual[fi]`: usa vetores `P−Cprev` e `Cnext−P`.
- Fallback: corda `Pprev→Pnext` com `dist = 48px`.
- Usada em `drawBezier()` e `updateCtrlPts()`.

### Implementação

- `getFrameTangentGeometry(fi)` — nova função; substitui `getFrameTangentDir()`.
- `applyFrameTangentEdit(hx, hy)` — atualizado: dLen como strength + armazena t/perpX/perpY.
- `drawBezier()` — usa `getFrameTangentGeometry()`.
- `updateCtrlPts()` — usa `getFrameTangentGeometry()`.
- CSS `.frame-tangent-dot` — `border-radius:2px` + `rotate(45deg)`.
- JSON schema inalterado: sem campos novos.

## v8z4b19y — add active frame tangent handle prototype

Adiciona um **handle de tangente âmbar** no frame ativo intermediário para ajuste
suave de passagem (C1-ish) nas curvas de transição.

### Funcionalidade

- **Círculo dourado** (`.frame-tangent-dot`) aparece no frame ativo quando:
  - Imagem carregada, `frameCount >= 3`, `activeIdx > 0` e `< frameCount - 1`,
    não em isoMode, não em preview.
- **Linha tracejada âmbar** conecta o centro do frame ao handle (braço de tangente,
  48 px de comprimento visual).
- **Drag ajusta os dois segmentos adjacentes** simultâneamente: `ctrlPts[fi-1]` e
  `ctrlPts[fi]` são atualizados para produzir passagem suave C1-ish no frame ativo.
- **Undo lazy**: undo só é capturado se o usuário realmente arrastar ≥ 2 px —
  um toque sem movimento não cria entrada de undo.
- **JSON schema inalterado**: sem campos novos; usa `ctrlPts`/`ctrlPtManual` existentes.

### Implementação

- `getFrameTangentDir(fi)` — calcula direção da tangente (chord ou ctrl manual).
- `startFrameTangentDrag()` — inicia drag sem capturar undo.
- `applyFrameTangentEdit(hx, hy)` — aplica edição nos dois segmentos adjacentes.
- `frameTangentDragState` — estado de drag `{ didMove, undoCaptured }`.
- `onMove()` e `endDrag()` integrados; `markProjectDirty('frame-tangent')` se moveu.
- Whitelist da imageArea atualizada para incluir `.frame-tangent-dot`.

## v8z4b19x — hide legacy curve puller when midpoint path point is active

Oculta completamente o **curvePuller/losango legado** quando o **midpoint pathPoint**
está disponível como controle principal da curva.

### Objetivo

Na v8z4b19w, o curvePuller/losango ficava translúcido (`opacity: 0.38`) quando o
midpoint pathPoint estava ativo. Embora sem interatividade (`pointer-events: none`),
o elemento ainda aparecia visualmente parecendo um segundo controle, o que podia
confundir a leitura da interface: o usuário poderia pensar que havia dois controles
simultâneos para a mesma curva.

Esta versão oculta completamente o losango quando o midpoint pathPoint está disponível.
O midpoint pathPoint continua sendo o único controle principal visível.

### Mudanças

1. **`updateCtrlPts()` — ctrl-pt/losango completamente oculto quando midpoint ativo:**
   - `opacity: '0'` (era `'0.38'`) — losango fica invisível quando midpoint pathPoint
     está ativo no segmento.
   - `pointer-events: 'none'` — mantido; losango não intercepta toque/ponteiro.
   - Fallback preservado: se o midpoint pathPoint NÃO estiver disponível para o
     segmento (curva degenerada, falha de modelo), o ctrl-pt volta à visibilidade e
     interatividade normais.

2. **CSS `.mid-pathpt ~ .ctrl-pt` adicionado (v8z4b19x):**
   - `opacity: 0; pointer-events: none` — declaração CSS que complementa o inline
     style do JS; CSS aplicado como camada base, JS confirma via inline style.

3. **Loop — mesmo tratamento:**
   - `loopEl` recebe `opacity: '0'` (era `'0.38'`) quando `midpt_loop` está visível.
   - Fallback idêntico ao segmento normal.

4. **Comentários técnicos atualizados** em `updateCtrlPts()` e no cabeçalho do
   arquivo para refletir a nova decisão.

### Pipeline preservado

O arrasto do midpoint pathPoint continua usando o pipeline guardado aprovado:
1. `buildRuntimeCurveModel(segIndex)` — modelo runtime do segmento.
2. `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)` — deriva curvePuller
   candidato: `C = 2·M − 0.5·P0 − 0.5·P1`.
3. `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)` — patch.
4. `validateLegacyCurvePatchCandidate(patch)` — validação.
5. `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true })` —
   aplicação real guardada.

### Sem regressões

- JSON schema inalterado — nenhum campo novo.
- Preview e MP4 inalterados.
- Undo/Redo preservados.
- Salvar MP4 não regrediu.
- Compatibilidade total com projetos salvos em versões anteriores.

---

## v8z4b19w — make midpoint path point primary curve control

Inversão da hierarquia de edição de curva: o **midpoint pathPoint** (círculo sobre
a curva em t=0.5) passa a ser o controle principal e o **curvePuller/losango** vira
controle secundário/diagnóstico.

### Objetivo

Na v8z4b19v, embora o midpoint pathPoint estivesse visível e tecnicamente arrastável,
o curvePuller/losango (z-index 75) interceptava os gestos antes do midpoint pathPoint
(z-index 74). O arrasto parecia concentrado no losango, com o ponto na curva apenas
acompanhando. Esta versão inverte essa hierarquia.

### Mudanças

1. **z-index do `.mid-pathpt` elevado de 74 para 76** — supera o `.ctrl-pt` (75);
   o midpoint pathPoint recebe gestos antes do losango.

2. **Tamanho visual do `.mid-pathpt` aumentado de 8×8 px para 10×10 px** com borda
   2.5 px — mais visível e fácil de alvejar no iPhone.

3. **`updateCtrlPts()` — ctrl-pt/losango vira secundário quando midpoint pathPoint
   está ativo no segmento:**
   - `pointerEvents: 'none'` — losango não intercepta mais toque/ponteiro.
   - `opacity: 0.38` — losango permanece visível para diagnóstico mas fica visualmente
     de fundo.
   - Quando o midpoint pathPoint NÃO está disponível para o segmento, o ctrl-pt volta
     ao comportamento interativo normal (fallback seguro).

4. **Loop corrigido da mesma forma:** `loopEl` (ctrl-pt do loop) recebe
   `pointerEvents: 'none'` e `opacity: 0.38` quando o midpoint pathPoint do loop
   (`loopMidEl`) está visível. A lógica é aplicada após toda a seção de midpoints,
   garantindo estado consistente.

5. **`.mid-pathpt` adicionado ao whitelist do `attachImageAreaCloseHandler()`** —
   tocar no midpoint pathPoint não fecha mais o custBar inadvertidamente.

### Pipeline preservado

O arrasto do midpoint pathPoint continua usando o pipeline guardado aprovado:
1. `buildRuntimeCurveModel(segIndex)` — modelo runtime do segmento.
2. `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)` — deriva curvePuller
   candidato: `C = 2·M − 0.5·P0 − 0.5·P1`.
3. `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)` — patch
   candidato.
4. `validateLegacyCurvePatchCandidate(patch)` — validação da estrutura.
5. `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true })` —
   aplicação real guardada.

### Decisão sobre o losango (alternativas A/B/C)

**Alternativa adotada: B/C híbrido** — losango permanece visível mas não interativo:
- Visível com opacidade 0.38 (diagnóstico, confirma posição do curvePuller legado).
- Sem pointer-events (não intercepta gestos).
- Recupera interatividade se midpoint pathPoint não estiver disponível (fallback).
- Motivo: ocultar completamente (A) teria risco maior de confundir o usuário sobre
  o estado da curva. Manter visível mas secundário é a opção mais segura e informativa.

### JSON e schema

- **Nenhum campo novo** no JSON salvo.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` continuam sendo o único formato persistido.
- Arquivos v8z4b19v e anteriores continuam abrindo normalmente.

### Undo/Redo

Preservado sem mudança. Um único undo por arrasto de midpoint pathPoint (feito em
`startMidpointDrag()`). Tocar sem mover não cria undo.

---

## v8z4b19v — enable midpoint path point editing

Primeira implementação visível e interativa do pathPoint real: um ponto de passagem
em t=0.5 sobre a curva ativa, arrastável pelo usuário, convertido internamente para
curvePuller legado via pipeline guardado aprovado.

### Objetivo

Exibir e permitir arrastar um **midpoint pathPoint** (círculo branco com borda
colorida) sobre cada segmento de curva ativo. Ao arrastar, o app:

1. Chama `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)` para derivar
   o novo curvePuller via inversão matemática da Bézier quadrática.
2. Cria patch candidato com `createLegacyCurvePatchFromSimulatedPathPointEdit()`.
3. Valida com `validateLegacyCurvePatchCandidate()`.
4. Aplica com `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true })`.

O JSON continua salvando apenas `ctrlPts` / `ctrlPtManual` / `loopCtrlPt`.
Nenhum campo novo. Schema inalterado.

### Matemática

Para Bézier quadrática em t=0.5:

```
C = 2·M − 0.5·P0 − 0.5·P1
```

onde `P0` = frame inicial, `P1` = frame final, `M` = midpoint proposto, `C` = curvePuller derivado.

Implementada em `deriveLegacyCurvePullerFromMidpoint()` (v8z4b19m, intacto).

### Visual

- Círculo branco (`.mid-pathpt`) de 8×8 px, borda colorida.
- Cor: azul (`#00d4ff`) para segmento anterior ao frame ativo; laranja (`#f5a623`)
  para segmento posterior; roxo para loop.
- Aparece apenas sobre segmentos ativos (mesma visibilidade do curvePuller).
- `z-index: 74` (abaixo do curvePuller, z-index 75).

### Funções novas

#### `getMidpointEl(seg)`

Retorna o elemento DOM do midpoint pathPoint para o segmento `seg` (número ou `'loop'`).

#### `startMidpointDrag(seg, segType)`

Inicia o drag de midpoint pathPoint. Chama `pushUndo()`, inicializa `midpointDragState`.

#### `applyMidpointPathPointEdit(seg, segType, nx, ny)`

Pipeline completo: `buildRuntimeCurveModel` → `simulateRuntimePathPointEdit` →
`createLegacyCurvePatchFromSimulatedPathPointEdit` → `validateLegacyCurvePatchCandidate` →
`applyLegacyCurvePatchCandidateToRealState`. Retorna `true` se aplicado.

### Interação

- `pointerdown` no midpoint → `pushUndo()` + `midpointDragState = { seg, segType, didMove: false }`.
- `pointermove` → `applyMidpointPathPointEdit()` + `drawBezier()` + `updateCtrlPts()`.
- `pointerup` → limpa `midpointDragState`; se `didMove`, chama `markProjectDirty('midpoint-pathpoint')`.

### Undo/Redo

- Uma entrada de undo por arrasto (pushUndo no início do drag).
- Não duplica undo com o fluxo do curvePuller existente.

### Loop

Loop é suportado: midpoint pathPoint do loop é exibido quando loop ativo e F1 ou
último frame selecionado. Arrasto usa o mesmo pipeline via `target: { type: 'loop' }`.

### Preservação

- JSON schema inalterado. Nenhum campo novo.
- curvePuller legado continua disponível e funcional.
- Undo/Redo de curvas preservado.
- Preview e MP4 respeitam a curva resultante.
- Salvar MP4 não regrediu.
- Faixa preta superior do Preview intacta.
- Self-test harness da v8z4b19t intacto.

---

## v8z4b19u — route existing curve edits through guarded patch applier

Ativação controlada do novo pipeline interno de curvas para a edição de curvas já
existente. Não é redesenho de UI, não é novo modo de curvas, não é criação de
pathPoint visível, não é alteração de JSON, não é alteração de Preview/MP4.

### Objetivo

Fazer a edição de curva já existente (curva normal e curva de loop) passar pelo
aplicador guardado de patch legado `applyLegacyCurvePatchCandidateToRealState()`,
em vez de alterar `ctrlPts`/`loopCtrlPt` diretamente via `setSegmentCurve()`.

A mudança é arquitetural: a mutação real da curva passa pelo novo pipeline. O
comportamento visual, Undo/Redo, markProjectDirty, renderização e o formato JSON
permanecem idênticos à v8z4b19t.

### Helpers adicionados

#### `createLegacyCurvePatchFromCurrentCurveEdit(target, nextCtrlPt)`

Monta um patch candidato compatível com `validateLegacyCurvePatchCandidate()` e
`applyLegacyCurvePatchCandidateToRealState()` a partir dos valores já calculados
durante a edição de curva normal ou de loop.

**Parâmetros:**
- `target`: `{ type: 'segment', segIndex: number }` ou `{ type: 'loop' }`
- `nextCtrlPt`: `{ nx, ny, t, perpX, perpY }` — todos numéricos finitos

**Retorno (sucesso):**
```json
{
  "ok": true,
  "reason": "ok",
  "target": { "type": "segment", "segIndex": 0 },
  "field": "ctrlPts",
  "index": 0,
  "value": { "nx": ..., "ny": ..., "t": ..., "perpX": ..., "perpY": ... },
  "source": "existingCurveEdit",
  "appliesToSchema": "legacyCurvePuller",
  "applied": false
}
```

Para loop: `field: 'loopCtrlPt'`, `index: null`, `appliesToSchema: 'legacyLoopCurvePuller'`.

O patch é compatível com `validateLegacyCurvePatchCandidate()`.  
`applied === false` sempre (o candidato é aplicado pelo helper seguinte).

#### `applyExistingCurveEditViaPatch(target, nextCtrlPt, options)`

Roteia a edição de curva existente pelo aplicador guardado:

1. Cria patch com `createLegacyCurvePatchFromCurrentCurveEdit()`.
2. Valida com `validateLegacyCurvePatchCandidate()`.
3. Aplica com `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true, ... })`.
4. Retorna diagnóstico estruturado.

**Opções:**
- `pushUndo`: `false` (Undo gerenciado por `startCtrlDrag`)
- `markDirty`: `false` (dirty gerenciado por `endDrag`)
- `render`: `false` (render gerenciado por `onMove`)

### Integração na edição de curva

`setSegmentTrajectoryPoint()` foi modificado para chamar
`applyExistingCurveEditViaPatch()` em vez de `setSegmentCurve()` diretamente.

**Para segmentos normais:**
- Calcula `nx`, `ny` da posição do ponteiro.
- Calcula `t`, `perpX`, `perpY` via `computeTPerpForSeg()`.
- Monta `nextCtrlPt = { nx, ny, t, perpX, perpY }`.
- Chama `applyExistingCurveEditViaPatch({ type: 'segment', segIndex }, nextCtrlPt, ...)`.
- `applyLegacyCurvePatchCandidateToRealState` aplica em `ctrlPts[segIndex]` e
  marca `ctrlPtManual[segIndex] = true`.

**Para segmento de loop:**
- Calcula `nx`, `ny` da posição do ponteiro.
- Preserva `t`, `perpX`, `perpY` existentes de `loopCtrlPt`.
- Monta `nextCtrlPt = { nx, ny, t, perpX, perpY }`.
- Chama `applyExistingCurveEditViaPatch({ type: 'loop' }, nextCtrlPt, ...)`.
- `applyLegacyCurvePatchCandidateToRealState` aplica em `loopCtrlPt`.

### Preservação do comportamento existente

| Aspecto | Comportamento |
|---------|--------------|
| Visual | Idêntico à v8z4b19t |
| Undo/Redo | `pushUndo()` em `startCtrlDrag` — sem duplicação |
| markProjectDirty | `markProjectDirty('curve')` em `endDrag` — inalterado |
| invalidar MP4 | `markProjectDirty('curve')` em `endDrag` — inalterado |
| render | `drawBezier(); updateCtrlPts()` em `onMove` — inalterado |
| Curva de loop | Incluída no novo pipeline |
| Self-test v8z4b19t | Intacto — não removido, não auto-executado |
| JSON schema | Inalterado — nenhum campo novo |

### O que NÃO foi feito

- `pathPoint` visível não foi criado.
- `handles` não foram criados.
- UI não foi alterada.
- JSON schema não foi alterado (nenhum campo novo).
- Preview matemático não alterado.
- Motor de MP4/export core não alterado.
- Reset global de curvas registrado apenas no ROADMAP (futuro).
- Bug de `_file.json` sem `imageBase64` mantido apenas no ROADMAP.
- Tempos/proporções mantidos no roadmap futuro.
- Velocidade composta mantida no roadmap futuro.
- Criação de frame seguindo curva de loop mantida no roadmap futuro.

### Arquivos alterados

- `index.html`: 2 novos helpers + `setSegmentTrajectoryPoint` modificado + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` continuam sendo o schema persistido atual.
- Arquivos antigos continuam abrindo normalmente.
- Arquivos novos salvam no mesmo formato.
- Nenhum campo novo aparece no JSON.
- Curva aparece igual à v8z4b19t.
- Preview e MP4 percorrem o mesmo caminho da v8z4b19t.
- Curva de loop continua funcionando e aparecendo imediatamente ao ativar loop.
- Undo/Redo da curva normal e da curva de loop continuam funcionando.
- Fallback legado permanece.
- Correções de MP4/export continuam funcionando.
- Botão Salvar MP4 não regredido.
- Faixa preta superior do Preview continua funcionando.
- Limpeza de MP4 ao sair do Preview continua funcionando.

---

## v8z4b19t — add internal curve patch self-test harness

Implementação interna controlada de um harness/diagnóstico para testar o pipeline
completo de patch de curva sem UI, sem mutação real e sem alterar o comportamento
do app. Não é mudança visual, não é mudança de UI, não é mudança de JSON, não é
alteração de Preview/MP4/export, não é alteração de duração/tempos.

### Objetivo

Criar um conjunto de helpers de self-test interno que validam o pipeline:

```
runtime model
→ pathPoint runtime
→ proposedPathPoint simulado
→ simulateRuntimePathPointEdit()
→ createLegacyCurvePatchFromSimulatedPathPointEdit()
→ validateLegacyCurvePatchCandidate()
→ dryRunApplyLegacyCurvePatchCandidate()
→ applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: false })
→ confirmar que estado real permanece intacto
```

### Helpers adicionados

#### `runInternalCurvePatchSelfTestForModel(model, options)`

Harness principal. Recebe um runtime model e:
1. Valida o model.
2. Obtém `pathPoint` de `model.pathPoints[0]` (ou fallback via anchors).
3. Cria `proposedPathPoint` deslocado levemente (`dx=0.02, dy=0.02` por padrão).
4. Chama `simulateRuntimePathPointEdit()`.
5. Chama `createLegacyCurvePatchFromSimulatedPathPointEdit()`.
6. Valida patch com `validateLegacyCurvePatchCandidate()`.
7. Roda `dryRunApplyLegacyCurvePatchCandidate()`.
8. Chama `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: false, reason: 'self-test-guard' })`.
9. Confirma que a resposta é `real-mutation-disabled`.
10. Tira snapshot antes e depois com `cloneLegacyCurveStateForPatch()`.
11. Confirma via `compareRealCurveStateSnapshot()` que `ctrlPts`/`loopCtrlPt` reais não mudaram.
12. Retorna diagnóstico estruturado.

Opções suportadas:
- `targetType: 'segment' | 'loop'` — default derivado de `model.isLoop`.
- `segIndex: number` — default `model.segmentIndex`.
- `proposedOffset: { dx, dy }` — default `{ dx: 0.02, dy: 0.02 }`.
- `sampleCount: number` — reservado, não usado nesta versão.

Saída típica (sucesso):
```json
{
  "ok": true,
  "reason": "ok",
  "target": { "type": "segment", "segIndex": 0 },
  "simulationOk": true,
  "patchValid": true,
  "dryRunOk": true,
  "guardOk": true,
  "realStateUnchanged": true,
  "appliedToRealState": false
}
```

#### `runInternalCurvePatchSelfTestForSegment(segIndex, proposedOffset)`

Constrói runtime model do segmento informado via `buildRuntimeCurveModel()` e
delega a `runInternalCurvePatchSelfTestForModel()` com `targetType: 'segment'`.
Não altera estado.

#### `runInternalCurvePatchSelfTestForLoop(proposedOffset)`

Se loop estiver ativo e houver modelo de loop válido, roda self-test para loop.
Se loop não estiver ativo, retorna `{ ok: false, reason: 'loop-disabled' }`.
Não altera estado.

#### `runInternalCurvePatchSelfTestSuite()`

Suite completa:
1. Seleciona primeiro segmento normal válido.
2. Roda `runInternalCurvePatchSelfTestForSegment()`.
3. Se loop ativo, roda `runInternalCurvePatchSelfTestForLoop()`.
4. Retorna resumo estruturado com `segmentResult`, `loopResult`, `summary`.

**NÃO roda automaticamente** em Preview, MP4 nem no carregamento do app.

### Exposição para diagnóstico

Os helpers ficam disponíveis em `window.__arcoInternalDiag.curvePatchSelfTest`:

```js
window.__arcoInternalDiag.curvePatchSelfTest.suite()
window.__arcoInternalDiag.curvePatchSelfTest.forSegment(0)
window.__arcoInternalDiag.curvePatchSelfTest.forLoop()
window.__arcoInternalDiag.curvePatchSelfTest.forModel(model, options)
```

Exposição silenciosa: falha de exposição não afeta o app.

### O que NÃO foi feito

- `allowRealMutation: true` não é usado em nenhum fluxo.
- `applyLegacyCurvePatchCandidateToRealState` chamado apenas com `allowRealMutation: false`.
- `pushUndo` não é chamado pelos novos helpers.
- `renderAll` não é chamado pelos novos helpers.
- `markProjectDirty` não é chamado pelos novos helpers.
- `pathPoint` não é editável pelo usuário.
- Nenhum resultado é salvo no JSON.
- Harness não corre automaticamente em nenhum fluxo público.
- UI, Stage, curvas visuais, Preview matemático, MP4/export core, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.
- Bug de `_file.json` sem `imageBase64` mantido apenas no ROADMAP (fase UI/carregamento futura).
- Tempos/proporções mantidos no roadmap futuro.
- Velocidade composta mantida no roadmap futuro.
- Criação de frame seguindo curva de loop mantida no roadmap futuro.

### Arquivos alterados

- `index.html`: 4 helpers de self-test + bloco de diagnóstico + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` reais intocáveis.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export core não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Correção do botão Salvar MP4 da v8z4b19s intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19s — clear MP4 after save and prepare guarded real curve patch applier

Duas mudanças independentes: (A) correção de UX no estado do botão Salvar MP4 após
salvamento no dispositivo; (B) aplicador real guardado de legacy curve patch, sem
conexão com nenhum fluxo público.

### BLOCO A — Correção do botão Salvar MP4 após salvamento

#### Problema

Na v8z4b19r, depois de tocar em **Salvar MP4** para salvar no dispositivo, o botão
permanecia em estado `done` (pronto para salvar o mesmo MP4 novamente). O status
exibia "Salvo! Toque novamente para baixar de novo.", sugerindo reutilização do
mesmo arquivo.

#### Comportamento corrigido

1. Usuário entra no Preview.
2. Usuário gera MP4.
3. Botão fica pronto para salvar.
4. Usuário toca em **Salvar MP4**.
5. O salvamento/download inicia normalmente.
6. O botão volta imediatamente ao estado padrão (label "Salvar MP4", sem `done`).
7. Para salvar novamente, o usuário deve gerar um novo MP4.
8. Sair do Preview continua limpando MP4 como na v8z4b19o.
9. Cancelar export durante geração continua funcionando como na v8z4b19i.

#### Implementação

Adicionada função interna `consumeMp4AfterSave(capturedUrl)` dentro de
`handleGenerate()`:
- Chamada imediatamente após disparar download/share.
- Nulifica `generatedUrl` → impede re-tap de reusar o mesmo MP4.
- Remove classe `done` do botão e restaura label "Salvar MP4".
- Esconde `readyOverlay`.
- Revoga `ObjectURL` apenas após `setTimeout(1000ms)` para segurança no iOS/Safari:
  não revogar no mesmo stack do clique pode causar perda do arquivo no iOS.

Casos cobertos:
- Download direto via `<a>` (fallback não-share).
- Share via `navigator.share` bem-sucedido.
- Fallback de download após `navigator.share` falhar (não-`AbortError`).
- `AbortError` (usuário cancelou dialog de share) → estado `done` mantido para nova
  tentativa sem re-exportar.

Nenhum caso de `clearGeneratedMp4` existente foi removido:
- Saída normal do Preview: `clearGeneratedMp4('preview-exit-normal')` intacta.
- Cancelamento de export: `cancelMp4ExportAndResetState` intacta.
- `markProjectDirty`: `clearGeneratedMp4` intacta.
- Início de novo export: `clearGeneratedMp4('new-export-start')` intacta.

### BLOCO B — Aplicador real guardado de legacy curve patch

#### Objetivo

Preparar um aplicador real de patch candidato ao estado real de curvas, com guardas
fortes, mas deixar esse aplicador completamente desconectado de qualquer fluxo.

A v8z4b19r permite:
```
patch candidate validado → aplicação em draft/cópia → estado real intocado
```

A v8z4b19s prepara:
```
patch candidate validado
  → applyLegacyCurvePatchCandidateToRealState()
  → função guardada/interna
  → ainda não chamada por nenhum fluxo real
```

#### Helpers adicionados

##### `validateRealCurvePatchApplicationOptions(options)`

Valida e normaliza opções para `applyLegacyCurvePatchCandidateToRealState`.
- `allowRealMutation` só é `true` se explicitamente `=== true`.
- `pushUndo`, `markDirty`, `render` idem.
- `reason` defaults para `'internal-prepared-applier'`.
- Detecta inconsistências (ex: `pushUndo: true` sem `allowRealMutation: true`).
- NÃO altera nenhum estado.

##### `applyLegacyCurvePatchCandidateToRealState(patch, options)`

Aplicador real guardado. Comportamento por padrão (guarda principal):
- `options.allowRealMutation !== true` → retorna `{ ok: false, reason: 'real-mutation-disabled', appliedToRealState: false }` imediatamente.
- Não altera `ctrlPts`, `ctrlPtManual` nem `loopCtrlPt`.
- Não chama `pushUndo`, `markProjectDirty` nem `renderAll`.

Quando `allowRealMutation === true` (NÃO ativo nesta versão):
- Valida patch com `validateLegacyCurvePatchCandidate()`.
- Para `field === 'ctrlPts'`: aplica `patch.value` em `ctrlPts[index]`; marca
  `ctrlPtManual[index] = true`.
- Para `field === 'loopCtrlPt'`: aplica `patch.value` em `loopCtrlPt`.
- Chama `pushUndo`/`markProjectDirty`/`renderAll` apenas se `options` permitir.
- Retorna diagnóstico completo.

Restrições absolutas na v8z4b19s:
- Não conectado a UI, Stage, Preview, gesto, botão nem save/load.
- Não chamado por nenhum fluxo público.
- Nenhum JSON novo criado.

##### `dryRunApplyLegacyCurvePatchCandidate(patch)`

Dry-run explícito:
1. Valida patch.
2. Gera draft via `createLegacyCurvePatchApplicationDraft()`.
3. Valida draft via `validateLegacyCurvePatchApplicationDraft()`.
4. Compara before/after via `compareLegacyCurvePatchDraftWithCurrentState()`.
5. Confirma `appliedToRealState: false`.
6. Não altera nenhum estado real.

##### `compareRealCurveStateSnapshot(before, after)`

Diagnóstico passivo para confirmar se o estado real foi alterado entre dois
snapshots gerados por `cloneLegacyCurveStateForPatch()`.
- Compara `ctrlPts` índice a índice (delta `dNx`, `dNy`).
- Compara `loopCtrlPt`.
- Retorna `{ ok, unchanged, deltas }`.
- Não altera nenhum estado.

### O que NÃO foi feito

- `pathPoint` não é editável pelo usuário.
- `applyLegacyCurvePatchCandidateToRealState` não é chamado por nenhum fluxo.
- `allowRealMutation: true` não é usado em nenhum fluxo.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` reais intocáveis.
- `pushUndo` não é chamado pelos novos helpers.
- `renderAll` não é chamado pelos novos helpers.
- `markProjectDirty` não é chamado pelos novos helpers.
- Nenhum resultado é salvo no JSON.
- UI, Stage, curvas visuais, Preview, MP4/export core, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.

### Arquivos alterados

- `index.html`: correção de `handleGenerate()` + 4 helpers novos + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` reais intocáveis.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export core não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Undo/Redo não alterado.
- Save/load não alterado.
- ObjectURL não revogado antes do download começar (iOS/Safari seguro).

---

## v8z4b19r — prepare guarded legacy curve patch applier

Implementação interna controlada de helpers para preparar a aplicação segura de
um legacy curve patch candidate em um draft/cópia do estado legado, sem aplicar
nada automaticamente no estado real do app.
Sem alteração visual, sem alteração de UI, sem alteração de JSON, sem alteração
de Preview, MP4/export ou save/load.

### Objetivo

Preparar a ponte futura:

```
patch candidate validado
  → cloneLegacyCurveStateForPatch()           (snapshot "before")
  → applyLegacyCurvePatchCandidateToDraft()   (draft modificado)
  → futura aplicação real em ctrlPts[segIndex] ou loopCtrlPt
  → futura integração com pushUndo, markProjectDirty e renderAll
```

Nesta versão, o fluxo para no "draft aplicado". Nada é aplicado no estado real,
nada é salvo no JSON, nada é renderizado, nenhuma função de undo/redo é chamada.

### Helpers adicionados

#### `cloneLegacyCurveStateForPatch()`

Retorna uma cópia leve e independente dos campos legados de curva relevantes:

```json
{
  "ctrlPts":      [...],
  "ctrlPtManual": [...],
  "loopCtrlPt":   { "nx": ..., "ny": ..., "t": ..., "perpX": ..., "perpY": ... } | null,
  "loopEnabled":  true | false
}
```

Regras:
- Deep copy de objetos simples (campo a campo, sem `structuredClone`/`JSON.parse`).
- Sem referência mutável aos arrays reais.
- Não altera nenhuma variável global.

#### `applyLegacyCurvePatchCandidateToDraft(draftState, patch)`

Aplica um patch candidato validado em um `draftState` gerado por
`cloneLegacyCurveStateForPatch()`, **nunca** no estado real.

Comportamento:
- Se `patch.field === 'ctrlPts'`: valida `index`, substitui `draftState.ctrlPts[index]`
  por cópia de `patch.value`, marca `draftState.ctrlPtManual[index] = true`.
- Se `patch.field === 'loopCtrlPt'`: substitui `draftState.loopCtrlPt` por cópia de
  `patch.value`.

Retorno:
```json
{
  "ok": true,
  "reason": "ok",
  "draftState": { ... },
  "appliedField": "ctrlPts" | "loopCtrlPt",
  "appliedIndex": 0 | null,
  "appliedToDraft": true,
  "appliedToRealState": false
}
```

Garantias absolutas:
- `ctrlPts` real **não** é alterado.
- `ctrlPtManual` real **não** é alterado.
- `loopCtrlPt` real **não** é alterado.
- `pushUndo` **não** é chamado.
- `markProjectDirty` **não** é chamado.
- `renderAll` **não** é chamado.

#### `createLegacyCurvePatchApplicationDraft(patch)`

Função de alto nível:
1. Valida patch com `validateLegacyCurvePatchCandidate()`.
2. Clona estado legado (`before` e `after` — clones independentes).
3. Aplica patch no clone `after` via `applyLegacyCurvePatchCandidateToDraft()`.
4. Retorna draft aplicado + diagnóstico.

Retorno:
```json
{
  "ok": true,
  "reason": "ok",
  "patchValid": { ... },
  "before": { "ctrlPts": [...], "ctrlPtManual": [...], "loopCtrlPt": ..., "loopEnabled": ... },
  "after":  { "ctrlPts": [...], "ctrlPtManual": [...], "loopCtrlPt": ..., "loopEnabled": ... },
  "appliedField": "ctrlPts" | "loopCtrlPt",
  "appliedIndex": 0 | null,
  "appliedToDraft": true,
  "appliedToRealState": false
}
```

#### `validateLegacyCurvePatchApplicationDraft(result)`

Verifica integridade do resultado de `createLegacyCurvePatchApplicationDraft()`.

Critérios:
1. `result.ok === true`.
2. `before` e `after` existem com arrays válidos.
3. `appliedToDraft === true`.
4. `appliedToRealState === false`.
5. `ctrlPts` real não foi alterado (comparação com snapshot `before`).
6. `loopCtrlPt` real não foi alterado (comparação com snapshot `before`).
7. Arrays têm tamanhos coerentes (`before.ctrlPts.length === after.ctrlPts.length`).

Retorno: `{ ok, reason, checks }`.

#### `compareLegacyCurvePatchDraftWithCurrentState(result)` *(diagnóstico passivo)*

Compara `before`/`after` do draft e confirma que o estado real permanece igual.
Retorna:
- índice alterado no draft;
- delta (`dNx`, `dNy`, `distNorm`) entre valor anterior e valor pós-patch;
- confirmação de que o estado real não foi alterado.

Não altera nenhum estado.

### O que NÃO foi feito

- `pathPoint` não é editável pelo usuário.
- O patch candidato não é aplicado em `ctrlPts` real.
- O patch candidato não é aplicado em `loopCtrlPt` real.
- `pushUndo` não é chamado.
- `renderAll` não é chamado.
- `markProjectDirty` não é chamado.
- MP4 não é invalidado.
- Nenhum resultado é salvo no JSON.
- Nenhum resultado é renderizado.
- UI, Stage, curvas visuais, Preview, MP4/export, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.

### Arquivos alterados

- `index.html`: 5 helpers novos + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` reais intocáveis.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19q — prepare legacy curve patch from simulated path point edit

Implementação interna controlada de helpers para transformar uma edição simulada
de pathPoint em um patch legado candidato.
Sem alteração visual, sem alteração de UI, sem alteração de JSON, sem alteração de
Preview, MP4/export ou save/load.

### Objetivo

Preparar o futuro fluxo:

```
pathPoint movido
  → simulateRuntimePathPointEdit()
  → candidate curvePuller
  → legacy curve patch candidate
  → futura aplicação em ctrlPts[segIndex] ou loopCtrlPt
  → futura integração com undo/redo
```

Nesta versão, o fluxo para no "legacy curve patch candidate". O patch é apenas
um objeto diagnóstico retornado. Nada é aplicado no estado real, nada é salvo no
JSON, nada é renderizado.

### Helpers adicionados

#### `runtimeCurvePullerToLegacyCtrlPt(candidatePuller, fallbackCtrlPt)`

Converte um curvePuller runtime (`{ x, y }` normalizados 0–1) para o shape legado
de ctrlPt persistido (`{ nx, ny, t, perpX, perpY }`).

- `nx` / `ny` vêm de `candidatePuller.x` / `.y`.
- `t`, `perpX`, `perpY` preservados de `fallbackCtrlPt` (ctrlPt atual do schema).
- Se `fallbackCtrlPt` for nulo/inválido, usa defaults seguros: `t = 0.5`, `perpX = perpY = 0`.
- Apenas prepara o objeto — não aplica em `ctrlPts` nem `loopCtrlPt`.

#### `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)`

Constrói o objeto de patch candidato indicando qual campo do schema atual seria
alterado pela edição simulada de pathPoint.

Parâmetros:
- `target`: `{ type: 'segment' | 'loop', segIndex?: number }`
- `simulation`: retorno de `simulateRuntimePathPointEdit()` com `ok === true`

Retorno para `'segment'`:
```json
{
  "ok": true,
  "reason": "ok",
  "target": { "type": "segment", "segIndex": 0 },
  "field": "ctrlPts",
  "index": 0,
  "value": { "nx": ..., "ny": ..., "t": ..., "perpX": ..., "perpY": ... },
  "source": "simulatedRuntimePathPointEdit",
  "appliesToSchema": "legacyCurvePuller",
  "applied": false
}
```

Retorno para `'loop'`:
```json
{
  "ok": true,
  "reason": "ok",
  "target": { "type": "loop" },
  "field": "loopCtrlPt",
  "index": null,
  "value": { "nx": ..., "ny": ..., "t": ..., "perpX": ..., "perpY": ... },
  "source": "simulatedRuntimePathPointEdit",
  "appliesToSchema": "legacyLoopCurvePuller",
  "applied": false
}
```

`applied: false` sempre — o patch não é aplicado nesta versão.

#### `validateLegacyCurvePatchCandidate(patch)`

Verifica se o patch candidato é bem-formado e seguro para uso diagnóstico.

Critérios:
1. `patch` existe.
2. `ok === true`.
3. `target.type` é `'segment'` ou `'loop'`.
4. `field` é `'ctrlPts'` ou `'loopCtrlPt'`.
5. `value.nx` / `value.ny` numéricos finitos.
6. `value.t` numérico finito.
7. `value.perpX` / `value.perpY` numéricos finitos.
8. `applied === false`.

Retorna `{ ok, reason, checks }` com `checks` detalhando cada critério.

#### `createSimulatedPathPointEditPatch(model, target, pathPoint, nextPoint)`

Função de alto nível para desenvolvimento:
1. Chama `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)`.
2. Se simulação ok, chama `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)`.
3. Valida o patch com `validateLegacyCurvePatchCandidate(patch)`.
4. Retorna `{ ok, reason, simulation, patch, patchValid }`.

#### `compareLegacyPatchCandidateWithCurrentControl(model, patch)` *(diagnóstico passivo)*

Compara `patch.value` com o controle atual do schema persistido
(`ctrlPts[segIndex]` ou `loopCtrlPt`). Retorna delta em normalizado e em pixels.
Não altera estado.

### Matemática

Continua usando a inversão já aprovada:
```
C = 2·M − 0.5·P0 − 0.5·P1
```

Conversão para legacy ctrlPt:
- `nx = C.x`, `ny = C.y` (normalizados 0–1, mesma convenção de `ctrlPts[segIndex].nx/ny`).
- `t`, `perpX`, `perpY` preservados do ctrlPt anterior.

### O que NÃO foi feito

- `pathPoint` não é editável pelo usuário.
- O patch candidato não é aplicado em `ctrlPts`.
- O patch candidato não é aplicado em `loopCtrlPt`.
- `pushUndo` não é chamado.
- `renderAll` não é chamado.
- `markProjectDirty` não é chamado.
- MP4 não é invalidado.
- Nenhum resultado é salvo no JSON.
- Nenhum resultado é renderizado.
- UI, Stage, curvas visuais, Preview, MP4/export, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.

### Arquivos alterados

- `index.html`: 5 helpers novos + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `buildRuntimeCurveModel`, `evaluateRuntimeCurveModel`, `evaluateRuntimeCurveSpans`,
  `pathPoints`, `spans`, `curvePuller` reais intactos.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19p — simulate runtime path point edit pipeline

Implementação interna controlada do pipeline de edição simulada de pathPoint runtime.
Sem alteração visual, sem alteração de UI, sem alteração de JSON, sem alteração de Preview, MP4/export ou save/load.

### Objetivo

Preparar o futuro fluxo:

```
pathPoint movido
  → deriveLegacyCurvePullerFromMidpoint()
  → novo curvePuller candidato
  → curva equivalente atualizável no schema legado ctrlPts / loopCtrlPt
```

Nesta versão, o fluxo é apenas simulado e diagnóstico. Nada é aplicado no estado
real, nada é salvo no JSON, nada é renderizado.

### Helpers adicionados

#### `cloneRuntimeCurveModelLight(model)`

Clone leve do modelo runtime de curva. Retorna uma cópia estrutural independente
com todos os campos copiados por valor (deep copy de objetos simples). O modelo
original não é alterado. Base interna para as demais simulações desta versão.

#### `createRuntimeCurveModelWithCandidatePuller(model, candidatePuller)`

Retorna uma cópia runtime do modelo com `controls[0]` substituído pelo
`candidatePuller` proposto. O `pathPoint` derivado (`pathPoints[0]`) e os spans
derivados (`spans[]`) são recalculados internamente dentro da cópia para refletir
o novo curvePuller candidato. O campo `candidate: true` em `controls[0]` do
retorno marca o controle como hipotético.

- Não altera `model` original.
- Não altera `ctrlPts`, `loopCtrlPt` nem nenhum array persistido.
- Não persiste no JSON; não renderizado; não editável.

#### `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)`

Simula o que aconteceria se o `pathPoint` em `t=0.5` fosse movido para `nextPoint`.

Parâmetros:
- `model`: runtime curve model atual.
- `pathPoint`: pathPoint runtime existente (`model.pathPoints[0]`).
- `nextPoint`: novo ponto normalizado proposto, simulando posição futura editada.

Retorno:
```json
{
  "ok": true,
  "reason": "ok",
  "originalPathPoint": { "x": ..., "y": ... },
  "proposedPathPoint": { "x": ..., "y": ... },
  "derivedCurvePuller": { "x": ..., "y": ..., "source": "runtimePathPoint", "t": 0.5 },
  "originalCurvePuller": { "x": ..., "y": ..., "source": "ctrlPts", "manual": false },
  "deltaFromOriginal": { "dxNorm": ..., "dyNorm": ..., "distNorm": ..., "dxPx": ..., "dyPx": ..., "distPx": ... },
  "previewModel": "<runtime model clone com candidatePuller — não persiste, não renderiza>"
}
```

Matemática (inversão da Bézier quadrática):
```
C_novo = 2·M − 0.5·P0 − 0.5·P1
```
Onde M = `nextPoint`, P0 = anchor start, P1 = anchor end.
Unidades: coordenadas normalizadas (0–1).

#### `compareSimulatedPathPointEdit(model, proposedPathPoint)`

Diagnóstico passivo: simula a edição do pathPoint e avalia a diferença entre a
curva original e a curva simulada em 9 amostras uniformes (`t = 0, 0.125, ..., 1`).

Retorna deltas em pixels e em normalizado por amostra. Útil para desenvolvimento
e validação da matemática do pipeline futuro.

### Matemática

Para Bézier quadrática:
- P0 = frame inicial (anchor start, normalizado)
- C = curvePuller (normalizado)
- P1 = frame final (anchor end, normalizado)
- M = pathPoint em t=0.5

Dado novo M:
```
C = 2·M − 0.5·P0 − 0.5·P1
```

Unidades: coordenadas normalizadas 0–1, mesma de anchors, controls, pathPoints e spans.

### O que NÃO foi feito

- pathPoint não é editável pelo usuário.
- Nenhum resultado aplicado em `ctrlPts`.
- Nenhum resultado aplicado em `loopCtrlPt`.
- Nenhum resultado salvo no JSON.
- Nenhum resultado renderizado.
- UI, Stage, curvas visuais, Preview, MP4/export, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.

### Arquivos alterados

- `index.html`: 4 helpers novos + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `buildRuntimeCurveModel`, `evaluateRuntimeCurveModel`, `evaluateRuntimeCurveSpans`,
  `pathPoints`, `spans`, `curvePuller` reais intactos.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19o — clear generated MP4 when leaving preview

Ajuste de UX / ciclo de vida do MP4 gerado no Preview.
Stage, curvas, JSON, Preview matemático, motor de MP4/export e save/load inalterados.

### Problema

Após gerar um MP4 no Preview, o botão de download continuava disponível mesmo
após o usuário voltar ao Stage e re-entrar no Preview. O MP4 de uma sessão
anterior ficava "pendente", o que era conceitualmente confuso: o usuário podia
baixar um MP4 de uma sessão anterior sem ter gerado um novo.

### Solução

O MP4 gerado agora pertence exclusivamente à sessão atual do Preview.

**Regra principal:** ao sair do Preview e voltar ao Stage, o MP4 pronto é
limpo automaticamente. Na próxima entrada no Preview, o botão retorna ao
estado "Salvar MP4" (gerar novo).

**Implementação:**

`resetPreviewUiState()` — chamada por `stopPreview()` na saída normal (sem
export em andamento) — agora inclui uma chamada a
`clearGeneratedMp4('preview-exit-normal')`.

`clearGeneratedMp4(reason)` já existia (criado na v8z4b19i) e:
- revoga o ObjectURL anterior com `URL.revokeObjectURL()`
- limpa `generatedUrl`, `window._lastVideoBlob`, `window._lastVideoExt`
- esconde `readyOverlay`
- remove classes `done`/`recording` do `btnGenerate`
- restaura label para "Salvar MP4"
- não altera frames, curvas, JSON, Preview matemático nem motor de MP4

O fluxo de cancelamento de export em andamento (`cancelMp4ExportAndResetState`,
da v8z4b19i) permanece intacto e não foi alterado.

### Fluxo após a correção

1. Usuário entra no Preview.
2. Usuário gera MP4 → botão muda para estado "done"/download.
3. Usuário baixa MP4. Ainda no Preview, pode baixar novamente.
4. Usuário toca em **Voltar** → `stopPreview()` → `resetPreviewUiState()`
   → `clearGeneratedMp4('preview-exit-normal')`: MP4 limpo, ObjectURL revogado.
5. Usuário re-entra no Preview → botão está em estado "Salvar MP4" (gerar novo).
6. Se sair durante export ativo → `cancelMp4ExportAndResetState()` (v8z4b19i)
   cancela com segurança; Stage não trava.

### Arquivos alterados

- `index.html`: `resetPreviewUiState()` + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas (`buildRuntimeCurveModel`, `evaluateRuntimeCurveModel`,
  `evaluateRuntimeCurveSpans`, `pathPoints`, `spans`, `curvePuller` intactos).
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export não alterado (WebCodecs/muxer/MediaRecorder intactos).
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19n — add top safe preview band

Ajuste visual/UX no Preview para iPhone com Dynamic Island.
Stage, curvas, JSON, Preview matemático, MP4/export e save/load inalterados.

### Problema

No iPhone, o canvas do Preview ficava visualmente colado no topo, podendo
invadir a região da Dynamic Island / barra superior do sistema.

### Solução

Adicionado `padding-top: calc(env(safe-area-inset-top, 0px) + 18px)` em
`.preview-canvas-wrap`. O fundo preto de `.preview-screen` preenche
naturalmente a faixa superior, criando o respiro visual necessário.
O canvas continua centralizado (flex `align-items:center;justify-content:center`)
dentro do espaço restante.

### Arquivos alterados

- `index.html`: CSS `.preview-canvas-wrap` + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas.
- JSON não alterado.
- Preview matemático não alterado.
- MP4/export não alterado.
- Botão Salvar MP4 não alterado.
- Painel inferior do Preview não alterado.

---

## v8z4b19m — derive curve puller from runtime path point

Implementação interna controlada do runtime curve model.
Sem alteração de UI, layout, JSON, curvas, Preview matemático, MP4/export ou save/load.

### Objetivo

Adicionar helpers internos para derivar um legacy curvePuller a partir do pathPoint
runtime derivado em t=0.5, preparando o futuro ponto de passagem editável sem alterar
comportamento atual.

### Contexto

- v8z4b19f introduziu pathPoint derivado em runtime em t=0.5.
- v8z4b19h adicionou spans derivados via De Casteljau.
- v8z4b19j adicionou `evaluateRuntimeCurveSpans(model, t)`.
- v8z4b19l fez `evaluateRuntimeCurveModel()` tentar spans derivados primeiro,
  com fallback para `legacyQuadratic`.
- v8z4b19m prepara o caminho inverso: pathPoint em t=0.5 → curvePuller legado equivalente.

### Matemática

Para uma Bézier quadrática com P0=start, C=control, P1=end:

```
B(0.5) = 0.25·P0 + 0.5·C + 0.25·P1 = M
```

Isolando C (curvePuller):

```
C = 2·M − 0.5·P0 − 0.5·P1
```

Todos os pontos em coordenadas normalizadas (0–1) — mesma unidade de anchors,
controls, pathPoints e spans.

### Helpers criados

| Helper | Descrição |
|---|---|
| `deriveLegacyCurvePullerFromMidpoint(start, midpoint, end)` | Inversão da Bézier quadrática: dado um midpoint M (amostra real da curva em t=0.5), calcula o curvePuller C equivalente (C = 2·M − 0.5·P0 − 0.5·P1). Entrada/saída em normalizado (0–1). Retorna `{ x, y, source: 'runtimePathPoint', t: 0.5 }`. |
| `deriveLegacyCurvePullerFromRuntimePathPoint(model, pathPoint)` | Wrapper de conveniência: extrai anchors start/end do runtime model e chama `deriveLegacyCurvePullerFromMidpoint`. Permite derivar o curvePuller diretamente de model.pathPoints[0] sem expor os anchors ao chamador. |
| `compareDerivedPullerWithRuntimeControl(model)` | Diagnóstico passivo: calcula curvePuller derivado do pathPoints[0], compara com controls[0] (curvePuller atual), retorna delta normalizado e delta em pixels. Por construção matemática, o delta deve ser zero. Não altera estado, não corrige nada. |

### Helpers atualizados

| Helper | Descrição |
|---|---|
| `compareRuntimePathWithLegacy(segIndex, t)` | Agora inclui `pullerDiag` no retorno — retorno de `compareDerivedPullerWithRuntimeControl(model)`. Confirma paridade entre curvePuller derivado e controls[0]. Fluxo normal inalterado. |

### Fluxo de derivação (v8z4b19m)

```
pathPoint em t=0.5 (model.pathPoints[0], derivedMidpoint)
  ↓ deriveLegacyCurvePullerFromRuntimePathPoint(model, pathPoint)
  ↓ deriveLegacyCurvePullerFromMidpoint(start, midpoint, end)
  ↓ C = 2·M − 0.5·P0 − 0.5·P1
curvePuller derivado { x, y, source: 'runtimePathPoint', t: 0.5 }
  ↓ compareDerivedPullerWithRuntimeControl(model)
delta vs controls[0] → deve ser zero por construção
```

### Invariantes mantidos

- Resultado visual e matemático do app idêntico à v8z4b19l.
- Curva normal preservada igual à v8z4b19l.
- Curva de loop preservada igual à v8z4b19l.
- Preview e MP4 percorrem o mesmo caminho da v8z4b19l.
- JSON schema inalterado — nenhum campo novo aparece no JSON salvo.
  - `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`: schema persistido, inalterado.
  - `pathPoints`, `handles`, `spans`, `capabilities`: apenas runtime — não aparecem no JSON.
- Undo/Redo da curva normal e da curva de loop continuam funcionando.
- Fallback legado (`evaluateRuntimeLegacyQuadratic`) permanece ativo.
- Correções de MP4/export da v8z4b19i preservadas.
- `evaluateSegmentPath()`, `buildRuntimeCurveModel()`, `validateRuntimeCurveModel()`,
  `evaluateRuntimeCurveModel()` inalterados.
- Nenhum helper novo renderiza, salva, modifica ou substitui estado real.
- pathPoint não é editável, não é renderizado, não é arrastável.
- curvePuller real (controls[0], ctrlPts) não é alterado.

---

## v8z4b19l — route runtime curve model through derived spans

Implementação interna controlada do runtime curve model.
Sem alteração de UI, layout, JSON, curvas, Preview matemático, MP4/export ou save/load.

### Objetivo

Fazer `evaluateRuntimeCurveModel(model, t)` usar os spans derivados como caminho
preferencial quando o modelo estiver em `mode: 'legacyQuadratic'` e os spans forem
válidos, mantendo fallback seguro para o cálculo legacyQuadratic anterior por
anchors + curvePuller.

### Helpers criados / atualizados

| Helper | Descrição |
|---|---|
| `isValidRuntimePoint(pt)` | Helper de validação: retorna `true` se `pt` é objeto não-nulo com `x` e `y` numéricos finitos. Usado para validar o retorno de `evaluateRuntimeCurveSpans` antes de aceitar o resultado. |
| `evaluateRuntimeLegacyQuadratic(model, t)` | Contém exatamente a lógica anterior de `evaluateRuntimeCurveModel` para `mode === 'legacyQuadratic'`: avalia pelos anchors (start/end) + controls[0] (curvePuller) do modelo runtime. Extraído como helper separado para ser o fallback de segurança. |
| `evaluateRuntimeCurveModel(model, t)` | Atualizado: tenta `evaluateRuntimeCurveSpans(model, t)` primeiro (validando com `isValidRuntimePoint`), recai em `evaluateRuntimeLegacyQuadratic(model, t)` se spans forem inválidos ou resultado não finito. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Atualizado: inclui `pathUsed` no retorno — `'spans'` se o caminho preferencial foi usado, `'legacyFallback'` se o fallback foi tomado, `null` se falhou. |
| `evaluateRuntimeCurveSpans(model, t)` | Comentário atualizado: agora documentado como caminho preferencial de `evaluateRuntimeCurveModel()`. Lógica inalterada. |

### Fluxo de evaluateRuntimeCurveModel (v8z4b19l)

```
evaluateRuntimeCurveModel(model, t):
  1. Validar model (validateRuntimeCurveModel).
  2. Se mode === 'legacyQuadratic' e spans válidos (Array, length 2):
     2.1. Tentar evaluateRuntimeCurveSpans(model, t).
          isValidRuntimePoint(resultado)? → retornar resultado. [caminho: 'spans']
  3. Fallback: evaluateRuntimeLegacyQuadratic(model, t). [caminho: 'legacyFallback']
```

### Invariantes mantidos

- Resultado matemático idêntico à v8z4b19k — mesma Bézier quadrática, mesmos dados.
- A rota via spans foi validada em v8z4b19j (delta ≤ 0.001 px vs legado em 7 amostras).
- Curva normal preservada igual à v8z4b19k.
- Curva de loop preservada igual à v8z4b19k.
- Preview e MP4 percorrem o mesmo caminho da v8z4b19k.
- JSON schema inalterado — nenhum campo novo aparece no JSON salvo.
  - `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`: schema persistido, inalterado.
  - `pathPoints`, `handles`, `spans`, `capabilities`: apenas runtime — não aparecem no JSON.
- Undo/Redo da curva normal e da curva de loop continuam funcionando.
- Fallback legado (`evaluateRuntimeLegacyQuadratic`) permanece ativo.
- Correções de MP4/export da v8z4b19i preservadas.
- `evaluateSegmentPath()`, `buildRuntimeCurveModel()`, `validateRuntimeCurveModel()` inalterados.
- spans: NÃO editáveis, NÃO renderizados, NÃO persistidos no JSON.
- pathPoints: NÃO editáveis, NÃO renderizados, NÃO persistidos no JSON.

---

## v8z4b19k — render loop curve immediately on toggle

Bug fix visual: a curva de loop agora aparece imediatamente no Stage ao ativar/desativar loop, sem necessidade de tocar no Stage.
Sem alteração de UI, layout, JSON, curva normal, Preview matemático, MP4/export, save/load ou sistema de spans.

### Problema corrigido

Na v8z4b19j, ao ativar o loop via chip "Loop" no painel Duração, a curva de loop não aparecia imediatamente no Stage. Ela só aparecia depois que o usuário tocava/clicava no Stage — provavelmente porque um evento de toque posterior disparava um render/repaint do compositing layer do Stage.

**Causa raiz:** Em iOS/Safari, quando o painel flutuante está aberto (overlay fixo com z-index:40 cobre o Stage), atualizações de SVG feitas sincronicamente dentro de handlers de toque/click podem não ser composited imediatamente. O GPU compositor do Safari pode manter uma textura cached do Stage e só invalidá-la quando o overlay é removido (ao tocar no Stage para fechar o painel).

### Solução implementada

#### `refreshStageAfterLoopToggle()` — helper novo

Concentra `drawBezier()` + `updateCtrlPts()` em uma função nomeada, chamada via `requestAnimationFrame()` após o toggle de loop. O `requestAnimationFrame` força a execução no contexto do próximo frame de animação, garantindo que o Safari/iOS invalide o compositing layer do Stage e pinte a curva de loop sem aguardar interação do usuário.

**Não substitui `renderAll()`** — apenas complementa o repaint das curvas/handles no próximo frame visual. O `renderAll()` continua sendo chamado sincronicamente para atualizar posições de frames, handle global e autosave.

#### `setFinishing()` — atualizado

- Adicionado `markProjectDirty('loop-toggle')`: ativar/desativar loop altera o caminho de animação e deve invalidar o MP4 gerado.
- Adicionado `requestAnimationFrame(() => refreshStageAfterLoopToggle())` após `renderAll()`.

### Invariantes mantidos

- Curva normal preservada igual à v8z4b19j.
- Curva de loop preservada igual à v8z4b19j (apenas aparece imediatamente).
- Preview e MP4 percorrem o mesmo caminho da v8z4b19j.
- JSON schema inalterado — nenhum campo novo aparece no JSON salvo.
- Undo/Redo da curva normal e da curva de loop continuam funcionando.
- Fallback legado permanece ativo.
- Correções de MP4/export da v8z4b19i preservadas.
- `evaluateSegmentPath()`, `evaluateRuntimeCurveModel()`, `evaluateRuntimeCurveSpans()`, `buildRuntimeCurveModel()` inalterados.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` continuam sendo o schema persistido.

---

## v8z4b19j — evaluate derived runtime curve spans

Implementação interna controlada do runtime curve model.
Sem alteração de UI, JSON, curvas, Preview matemático, MP4/export ou save/load.

### Objetivo

Adicionar um avaliador interno para os spans derivados criados na v8z4b19h,
permitindo avaliar a curva runtime a partir dos dois `quadraticSpan` derivados
(derivedFirstHalf e derivedSecondHalf), preservando matematicamente a trajetória atual.

### Helpers criados / atualizados

| Helper | Descrição |
|---|---|
| `evaluateQuadraticSpanNormalized(span, localT)` | Avalia um `quadraticSpan` em espaço normalizado (0–1) em `localT ∈ [0,1]`. Retorna `{x, y}` normalizado. Helper baixo nível, sem conversão para pixels. |
| `evaluateRuntimeCurveSpans(model, t)` | Avaliador paralelo: avalia a curva pelos dois `quadraticSpan` derivados (v8z4b19h). Seleciona span por `t <= 0.5` / `t > 0.5`, converte `t` global para local, delega para `evaluateQuadraticSpanNormalized`, converte normalizado → pixels. Retorna `{x, y}` em pixels. NÃO substitui `evaluateSegmentPath()` nesta versão. |
| `compareRuntimeSpansWithLegacy(segIndex)` | Diagnóstico passivo: compara `evaluateRuntimeCurveSpans` vs `evaluateRuntimeCurveModel` (runtime) vs `evaluateLegacySegmentPath` (legado) em 7 amostras fixas (t = 0, 0.125, 0.25, 0.5, 0.75, 0.875, 1). Retorna objeto estruturado com `ok`, `passed`, `failed` e `samples[]`. |
| `validateDerivedRuntimeSpans(model)` | Atualizado: substituiu Bézier inline por `evaluateQuadraticSpanNormalized`. Lógica e resultado idênticos à v8z4b19h. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Atualizado: inclui `spanPoint`, `spanDelta`, `spanMatch` no retorno (avaliação via spans). |

### Algoritmo de evaluateRuntimeCurveSpans

1. Recebe `model` e `t` global do segmento, entre 0 e 1.
2. Se `t <= 0.5`, escolhe o primeiro span (`derivedFirstHalf`).
3. Se `t > 0.5`, escolhe o segundo span (`derivedSecondHalf`).
4. Converte `t` global para `t` local do span:
   - Primeiro span: `localT = t / 0.5`
   - Segundo span: `localT = (t - 0.5) / 0.5`
5. Avalia Bézier quadrática via `evaluateQuadraticSpanNormalized`.
6. Converte de normalizado (0–1) para pixels: `x = norm.x * stageW`.
7. Retorna `{ x, y }` em pixels do stage.

### Invariantes mantidos

- `evaluateSegmentPath()` continua usando `anchors + curvePuller` (legacyQuadratic) como caminho preferencial.
- Os spans são apenas runtime: não renderizados, não editáveis, não persistidos no JSON.
- JSON schema inalterado — nenhum campo novo aparece no JSON salvo.
- Comportamento visual e matemático idêntico à v8z4b19i.
- Preview, MP4/export, Undo/Redo, save/load e UI inalterados.
- Fallback legado permanece ativo.
- Correções de MP4/export da v8z4b19i preservadas.

---

## v8z4b19i — fix preview exit during mp4 export

Correção funcional do ciclo de vida de exportação de MP4 ao sair do Preview.
Sem alteração de UI, JSON, curvas, Preview matemático, encoder ou save/load.

### Problema corrigido

Em v8z4b19h (e v8z4b19i-a), se o usuário iniciava a geração de MP4 no Preview
e tocava em Voltar antes da exportação terminar:

- o export continuava em background (`isRecording = true` não era limpo);
- `finishExport()` era chamado ao final, reativando `isPreviewing = true` mesmo
  com o Preview fechado;
- um RAF loop (`loopAfter`) era iniciado sobre uma tela oculta;
- o Stage mostrava ícone de pause indevidamente;
- o Stage ficava travado ou sem responder a toques;
- havia estado híbrido Preview/Stage impossível de resolver sem reload.

### Correção

**1. `stopPreview()` detecta export em andamento e roteia para helper correto**

- Se `isRecording === true`: chama `cancelMp4ExportAndResetState('preview-exit-during-export')`.
- Se `isRecording === false`: chama `resetPreviewUiState()` (saída normal).

**2. `cancelMp4ExportAndResetState(reason)` — novo helper**

- Define `isRecording = false` → loop de encode quebra na próxima iteração.
- Define `exportCancelledFlag = true` → previne `finishExport()` de completar.
- Revoga ObjectURL/blob parcial → export cancelado não fica disponível.
- Chama `resetPreviewPlaybackState()` → limpa UI de playback.
- Restaura botão Salvar MP4 e esconde overlay de progresso.

**3. `exportCancelledFlag` — nova flag de estado**

Guards em três pontos do pipeline de export:
- `finishExport()`: retorna cedo se `exportCancelledFlag === true`.
- WebCodecs path: verifica antes de `encoder.flush()` / `muxer.finalize()`.
- MediaRecorder fallback: verifica antes de criar Blob e chamar `finishExport()`.

**4. Ordenação em `startRecord()`**

`stopPreview()` é chamado ANTES de `isRecording = true` para que o preview
de playback seja parado via `resetPreviewUiState()` (não via cancelamento).
`exportCancelledFlag = false` é resetado logo após `isRecording = true`.

**5. `resetPreviewAndExportStateForImageChange()` atualizado**

Ao forçar `isRecording = false` diretamente (troca de imagem), também define
`exportCancelledFlag = true` para que `finishExport()` não complete um vídeo
gerado a partir de um projeto já alterado.

**6. `resetPreviewUiState()` — novo helper**

Consolida a saída normal do Preview delegando para `resetPreviewPlaybackState()`.
Facilita extensão futura sem duplicar lógica.

### Helpers criados / consolidados

| Helper | Descrição |
|---|---|
| `cancelMp4ExportAndResetState(reason)` | Cancela export em progresso, sinaliza cancelamento, limpa estado completo de Preview+Export. |
| `resetPreviewUiState()` | Saída normal do Preview sem export em andamento. Delega para `resetPreviewPlaybackState()`. |
| `clearGeneratedMp4(reason)` | Revoga ObjectURL, limpa blob, esconde readyOverlay, restaura botão Salvar MP4. NÃO altera Preview, curvas, JSON. |
| `resetPreviewPlaybackState()` | Para rAF, limpa isPreviewing/animFrame/animStart, restaura ícone Play, esconde previewScreen/canvas/timeline. NÃO limpa MP4. |

### Invariantes mantidos

- JSON schema inalterado (nenhum campo novo)
- Curvas, Preview matemático e encoder MP4 inalterados estruturalmente
- Motor de MP4 (WebCodecs + muxer) inalterado além do controle de cancel/reset
- UI inalterada (exceto restauração do estado correto de play/pause)
- save/load inalterado

### Nota sobre v8z4b19i anterior (fix stale MP4 export state)

Esta versão consolida e inclui as correções de v8z4b19i-a:
- ObjectURL não revogado após download (re-download sem re-exportar)
- `markProjectDirty` cobre drag de ctrl-pt (curva normal e loop)

---

## v8z4b19h — derive split runtime curve spans

Implementação interna controlada do runtime curve model.
Adiciona, dentro do modelo runtime, uma estrutura de dois `quadraticSpan` derivados
que representam a curva quadrática legada dividida em dois sub-spans via divisão
De Casteljau em `t=0.5`. Os spans são apenas runtime — não persistidos, não
renderizados, não editáveis, não usados como avaliador principal. O resultado de
`evaluateSegmentPath()` é idêntico à v8z4b19g. Sem alterar UI, JSON, Preview,
MP4, save/load ou comportamento visual.

### Objetivo

Criar uma representação derivada da curva legada dividida em dois spans
quadráticos que passam pelo `pathPoint` derivado em `t=0.5`, preservando
matematicamente a trajetória atual. Prepara o futuro modo baseado em
`pathPoints` reais.

### Helpers adicionados

| Função | Descrição |
|---|---|
| `lerpPointNormalized(a, b, t)` | Interpolação linear entre dois pontos normalizados (0–1). Usado pela divisão De Casteljau. Retorna `{ x, y }` normalizado ou `null` se inválido. |
| `splitLegacyQuadraticAtMidpoint(start, control, end)` | Divide a curva quadrática de Bézier legada em `t=0.5` via De Casteljau. Retorna `{ firstHalfControl: A, midpoint: M, secondHalfControl: B }` em coordenadas normalizadas. |
| `validateDerivedRuntimeSpans(model)` | Diagnóstico passivo: valida que os spans derivados reconstituem matematicamente a curva legada. Verifica midpoint match, estrutura dos spans e reconstituição por amostragem em 9 pontos. Retorna `{ ok, reason, midpointMatch, spanCount, sampleChecks }`. |

### Funções alteradas em index.html

| Função | Alteração |
|---|---|
| `buildRuntimeCurveModel(segIndex)` | `spans[]` adicionado ao retorno: dois `quadraticSpan` derivados (`derivedFirstHalf` e `derivedSecondHalf`) calculados via `splitLegacyQuadraticAtMidpoint`. Todos em coordenadas normalizadas (0–1). `editable: false`, `derived: true`. |
| `validateRuntimeCurveModel(model)` | Aceita e valida `spans[]` opcional. Cada span derivado (`derived: true`) deve ter `kind: 'quadraticSpan'`, `editable: false`, `start/control/end` com `x/y` finitos. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Retorno inclui `spansDiag` via `validateDerivedRuntimeSpans(model)`. |

### Estrutura dos spans derivados (em buildRuntimeCurveModel)

Algoritmo De Casteljau em t=0.5:
```
P0 = frameAnchor inicial (normalizado)
C  = curvePuller legado  (normalizado)
P1 = frameAnchor final   (normalizado)
A  = lerp(P0, C,  0.5)   → controle do primeiro span
B  = lerp(C,  P1, 0.5)   → controle do segundo span
M  = lerp(A,  B,  0.5)   → ponto de divisão = pathPoints[0] (derivedMidpoint)
```

```js
// Em buildRuntimeCurveModel():
spans: [
  {
    kind:     'quadraticSpan',
    role:     'derivedFirstHalf',
    source:   'legacyQuadraticSplit',
    tRange:   [0, 0.5],
    start:   { kind: 'frameAnchor',   role: 'start',            x: P0.x, y: P0.y },
    control: { kind: 'derivedHandle', role: 'firstHalfControl', x: A.x,  y: A.y,  editable: false, derived: true },
    end:     { kind: 'pathPoint',     role: 'derivedMidpoint',  x: M.x,  y: M.y  },
    editable: false, derived: true
  },
  {
    kind:     'quadraticSpan',
    role:     'derivedSecondHalf',
    source:   'legacyQuadraticSplit',
    tRange:   [0.5, 1],
    start:   { kind: 'pathPoint',     role: 'derivedMidpoint',   x: M.x,  y: M.y  },
    control: { kind: 'derivedHandle', role: 'secondHalfControl', x: B.x,  y: B.y,  editable: false, derived: true },
    end:     { kind: 'frameAnchor',   role: 'end',               x: P1.x, y: P1.y },
    editable: false, derived: true
  }
]
```

### Propriedade matemática garantida

- `span1(s) = B_original(s/2)` para `s ∈ [0, 1]` (mapeia global `t ∈ [0, 0.5]`).
- `span2(s) = B_original(0.5 + s/2)` para `s ∈ [0, 1]` (mapeia global `t ∈ [0.5, 1]`).
- `M === pathPoints[0].x/y` (ponto de divisão = midpoint derivado).

### Unidade

Todos os pontos de `spans[]` (`start`, `control`, `end`) são coordenadas normalizadas
`(0–1)`, igual a `anchors` e `controls`. Convenção: `x = pixelX / stageW`, `y = pixelY / stageH`.
Nenhuma mistura com pixels sem conversão explícita.

### Comportamento passivo

- Spans não são usados como avaliador principal (`evaluateSegmentPath` continua com `curvePuller`).
- Spans não são renderizados na UI.
- Spans não são editáveis (`editable: false`).
- Spans não persistem no JSON (`derived: true`).
- `validateDerivedRuntimeSpans` não deve ser chamado durante animação, Preview ou exportação.

### Confirmações

- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19g.
- `pathPoints[0]` (derivedMidpoint) e `spans[0].end` / `spans[1].start` coincidem matematicamente.
- Os dois spans reconstituem a curva legada completa dentro da tolerância `0.000001` normalizado.
- Nenhum campo novo aparece no JSON salvo.
- UI, Preview, MP4, save/load e comportamento visual sem alteração.
- Schema persistido (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`) sem alteração.

---

## v8z4b19g — add runtime path point diagnostics

Diagnóstico interno passivo e controlado do runtime curve model.
Adiciona helpers para validar que o `pathPoint` derivado criado na v8z4b19f é
matematicamente coerente com `evaluateRuntimeCurveModel(model, 0.5)`.
O diagnóstico converte unidades corretamente (normalizado → pixels) antes de
comparar. Tolerância: 0.001 px (mesma de `compareRuntimePathWithLegacy`).
`compareRuntimePathWithLegacy` atualizado para reutilizar
`validateDerivedRuntimePathPoint`. Sem alterar UI, JSON, Preview, MP4,
save/load ou comportamento visual.

### Objetivo

Validar que o `pathPoint` derivado em `t=0.5` (introduzido na v8z4b19f)
é numericamente idêntico à posição avaliada por `evaluateRuntimeCurveModel(model, 0.5)`,
garantindo coerência matemática entre o modelo runtime e o ponto amostrado.

### Helpers adicionados

| Função | Descrição |
|---|---|
| `validateDerivedRuntimePathPoint(model)` | Valida se o `pathPoint` derivado em `t=0.5` é matematicamente coerente com `evaluateRuntimeCurveModel(model, 0.5)`. Converte pathPoint de normalizado para pixels antes de comparar. Tolerância: 0.001 px. Retorna `{ ok, reason, deltaPx, pathPoint, evaluatedPoint }`. |
| `diagnoseRuntimeCurveSegment(segIndex)` | Constrói o modelo runtime de um segmento e executa `validateDerivedRuntimePathPoint`. Retorna `{ segIndex, model, validation }`. |
| `diagnoseRuntimeCurveModel()` | Executa `diagnoseRuntimeCurveSegment` para todos os segmentos ativos. Retorna `{ ok, total, passed, failed, segments }`. |

### Funções alteradas em index.html

| Função | Descrição |
|---|---|
| `compareRuntimePathWithLegacy(segIndex, t)` | Atualizado para reutilizar `validateDerivedRuntimePathPoint(model)` ao verificar `derivedPathPointCheck`. O objeto retornado passa a incluir `diagOk` e `diagReason` para consistência com os novos helpers. |

### Retorno de validateDerivedRuntimePathPoint

```js
// Sucesso:
{ ok: true, reason: 'ok', deltaPx: 0, pathPoint, evaluatedPoint }

// Problema:
{ ok: false, reason: 'missing-pathpoint' | 'invalid-pathpoint' | 'delta-too-large' | 'invalid-model',
  deltaPx, pathPoint, evaluatedPoint }
```

### Critério matemático

- `pathPoint.x/y` estão em coordenadas normalizadas (0–1).
- `evaluateRuntimeCurveModel(model, t)` retorna pixels do stage.
- Conversão explícita antes de comparar: `pathPx = pp.x * stageW`, `pathPy = pp.y * stageH`.
- Delta euclidiano em pixels: `deltaPx = sqrt(dx² + dy²)`.
- Tolerância: 0.001 px — diferença esperada: zero (aritmética idêntica).
- Nunca mistura normalizado com pixels sem conversão explícita.

### Comportamento passivo (diagnóstico)

- Não altera `model`, `pathPoints`, `anchors`, `controls` nem nenhum array persistido.
- Não corrige `pathPoints` automaticamente.
- Não recalcula `ctrlPts`.
- Não altera a curva.
- Não imprime nada no console automaticamente.
- Não bloqueia Preview/MP4.
- Não chamado durante animação, Preview ou exportação.

### Confirmações

- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19f.
- O `pathPoint` derivado não é ponto de controle (não substitui `curvePuller`).
- O `pathPoint` derivado não altera a trajetória.
- O `pathPoint` derivado não é renderizado.
- O `pathPoint` derivado não é editável (`editable: false`).
- O `pathPoint` derivado não persiste no JSON (`derived: true`).
- Nenhum campo novo aparece no JSON salvo.
- UI, Preview, MP4, save/load e comportamento visual sem alteração.
- Schema persistido (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`) sem alteração.

## v8z4b19f — introduce derived runtime path point

Implementação interna controlada: o modelo runtime de curva
(`buildRuntimeCurveModel`) passa a preencher `pathPoints` com um `pathPoint`
derivado em `t=0.5`, calculado pela mesma fórmula quadrática de Bézier do motor,
em coordenadas normalizadas (0–1). O ponto é uma amostra real da trajetória atual
— não é ponto de controle, não substitui `ctrlPts`, não é editável, não é
renderizado e não persiste no JSON. `validateRuntimeCurveModel` atualizado para
validar a estrutura dos `pathPoints` derivados.
`evaluateRuntimeCurveModel` continua ignorando `pathPoints` enquanto
`mode === 'legacyQuadratic'`. Resultado de `evaluateSegmentPath()` idêntico à
v8z4b19e. Sem alterar comportamento visual, Preview, MP4, save/load, JSON ou UI.

### Objetivo

Introduzir o primeiro `pathPoint` derivado dentro do runtime curve model,
calculado a partir da curva quadrática legada atual, sem alterar nenhum
comportamento ativo. Prepara o futuro `pathPoint` editável real sem impacto
na trajetória, UI ou persistência.

### Helper adicionado

| Função | Descrição |
|---|---|
| `evaluateLegacyQuadraticNormalized(start, control, end, t)` | Calcula posição normalizada (0–1) sobre a curva quadrática de Bézier legada. Mesma fórmula de `evaluateRuntimeCurveModel`, aplicada em espaço normalizado. Usada por `buildRuntimeCurveModel()` para calcular o `pathPoint` derivado em `t=0.5`. |

### Funções alteradas em index.html

| Função | Descrição |
|---|---|
| `buildRuntimeCurveModel(segIndex)` | `pathPoints` agora contém um `pathPoint` derivado em `t=0.5`, calculado por `evaluateLegacyQuadraticNormalized`. O ponto tem `kind: 'pathPoint'`, `role: 'derivedMidpoint'`, `source: 'legacyQuadratic'`, `editable: false`, `derived: true`. |
| `validateRuntimeCurveModel(model)` | Atualizado para validar `pathPoints` derivados: cada entry com `derived: true` deve ter `kind: 'pathPoint'`, `t` numérico, `x/y` finitos, `editable === false`. |
| `evaluateRuntimeCurveModel(model, t)` | Comentário explícito: `pathPoints` derivados ignorados enquanto `mode === 'legacyQuadratic'`. Resultado idêntico à v8z4b19e. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Quando `t === 0.5`, inclui `derivedPathPointCheck` verificando que `pathPoints[0]` (normalizados) bate com `evaluateRuntimeCurveModel(model, 0.5)` normalizado. |

### Estrutura do pathPoint derivado (em buildRuntimeCurveModel)

```js
// Em buildRuntimeCurveModel():
pathPoints: [{
  kind:     'pathPoint',       // tipo — diferente de 'curvePuller' e 'frameAnchor'
  role:     'derivedMidpoint', // ponto médio derivado da curva atual
  source:   'legacyQuadratic', // derivado da curva quadrática legada
  t:        0.5,               // parâmetro da curva onde foi amostrado
  x:        <number>,          // normalizado (0–1): pixelX / stageW
  y:        <number>,          // normalizado (0–1): pixelY / stageH
  editable: false,             // não editável nesta versão
  derived:  true               // calculado automaticamente; não vem do JSON
}]
```

### Confirmações

- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19e.
- O `pathPoint` derivado é uma amostra real da trajetória em `t=0.5`.
- O `pathPoint` derivado não é ponto de controle (não substitui `curvePuller`).
- O `pathPoint` derivado não altera a trajetória.
- O `pathPoint` derivado não é renderizado.
- O `pathPoint` derivado não é editável (`editable: false`).
- O `pathPoint` derivado não persiste no JSON (`derived: true`).
- Nenhum campo novo aparece no JSON salvo.
- UI, Preview, MP4, save/load e comportamento visual sem alteração.
- Schema persistido (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`) sem alteração.

## v8z4b19e — prepare runtime path point model

Implementação interna controlada: o modelo runtime de curva
(`buildRuntimeCurveModel`) é ampliado com metadados de preparação futura —
`pathPoints: []`, `handles: []` e `capabilities` — documentando o contrato
interno para futuras evoluções sem alterar qualquer comportamento ativo.
`validateRuntimeCurveModel` e `evaluateRuntimeCurveModel` atualizados para
aceitar e ignorar os novos campos enquanto `mode === 'legacyQuadratic'`.
Sem alterar comportamento visual, Preview, MP4, save/load, JSON ou UI.
Resultado de `evaluateSegmentPath()` numericamente idêntico à v8z4b19d.

### Objetivo

Ampliar o contrato interno do runtime curve model para documentar e preparar
a presença futura de `pathPoints` e `handles`, mantendo o modelo atual em
modo `legacyQuadratic` sem qualquer alteração de comportamento.

### Glossário interno introduzido

| Conceito | Descrição |
|---|---|
| `frameAnchor` | Ponto REAL de câmera ligado a um frame da timeline. Início ou fim de cada segmento. Origem: `frames[frameIndex]`. |
| `curvePuller` | Controle legado QUADRÁTICO atual. Atrai a curva mas não é ponto de passagem real. Origem: `ctrlPts` / `loopCtrlPt`. |
| `pathPoint` | FUTURO: ponto real de passagem intermediária. A curva passa exatamente por ele. Na v8z4b19e: apenas `[]` vazio. |
| `handle/tangent` | FUTURO: controle vetorial de tangência associado a um `pathPoint`. Na v8z4b19e: apenas `[]` vazio. |
| `capabilities` | Metadados informativos do modo atual. Na v8z4b19e: `{ supportsPathPoints: false, supportsHandles: false }`. |

### Funções alteradas em index.html

| Função | Descrição |
|---|---|
| `buildRuntimeCurveModel(segIndex)` | Ampliada com `pathPoints: []`, `handles: []` e `capabilities`. Documentação de glossário adicionada. |
| `validateRuntimeCurveModel(model)` | Atualizada para aceitar `pathPoints` e `handles` como campos opcionais de array (presença ou ausência não afeta validade). |
| `evaluateRuntimeCurveModel(model, t)` | Comentário explícito: `pathPoints`/`handles` ignorados enquanto `mode === 'legacyQuadratic'`. Resultado idêntico à v8z4b19d. |

### Campos adicionados ao objeto runtime (NÃO ao JSON)

```js
// Em buildRuntimeCurveModel():
{
  // ... campos existentes ...
  pathPoints: [],       // contrato runtime vazio — nunca persiste no JSON
  handles:    [],       // contrato runtime vazio — nunca persiste no JSON
  capabilities: {
    supportsPathPoints: false,
    supportsHandles:    false
  }
}
```

### Confirmações

- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19d.
- `pathPoints` e `handles` são apenas contrato runtime vazio — ignorados em avaliação.
- `capabilities` é apenas metadado informativo — não altera avaliação.
- Nenhum campo novo aparece no JSON salvo.
- UI, Preview, MP4, save/load e comportamento visual sem alteração.
- Schema persistido (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`) sem alteração.
- Arquivos salvos em v8z4b19d continuam abrindo normalmente.

---

## v8z4b19d — route segment path through runtime curve model

Implementação interna controlada: `evaluateSegmentPath()` agora usa o modelo
runtime de curva (introduzido na v8z4b19c) como caminho preferencial de avaliação.
O cálculo legado é preservado como fallback automático de segurança.
Sem alterar comportamento visual, Preview, MP4, save/load, JSON ou UI.

### Objetivo

Ativar o modelo runtime de curva como caminho real do motor de trajetória,
garantindo que `evaluateSegmentPath()` passe por
`buildRuntimeCurveModel → validateRuntimeCurveModel → evaluateRuntimeCurveModel`,
mantendo resultado matemático e visual idêntico à v8z4b19c.

### Funções alteradas/criadas em index.html

| Função | Descrição |
|---|---|
| `evaluateLegacySegmentPath(segIndex, t)` | Corpo legado extraído de `evaluateSegmentPath`. Fallback interno de segurança. Não chamar diretamente no fluxo normal. |
| `evaluateSegmentPath(segIndex, t)` | Reimplementada como wrapper seguro: tenta runtime model; em qualquer falha, recai em `evaluateLegacySegmentPath`. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Helper interno de comparação/paridade. Retorna `{ runtime, legacy, match, delta }`. Uso apenas em desenvolvimento/teste — não chamado no fluxo normal. |

### Lógica de evaluateSegmentPath (v8z4b19d)

```
1. buildRuntimeCurveModel(segIndex)
   → null?  → fallback para evaluateLegacySegmentPath
2. validateRuntimeCurveModel(model)
   → false? → fallback para evaluateLegacySegmentPath
3. evaluateRuntimeCurveModel(model, t)
   → null / NaN / Infinity? → fallback para evaluateLegacySegmentPath
4. retorna {x, y} em pixels do stage
```

### Regras de fallback

- `buildRuntimeCurveModel()` retorna `null` → usa legado.
- `validateRuntimeCurveModel()` retorna `false` → usa legado.
- `evaluateRuntimeCurveModel()` retorna `null`, `NaN` ou `Infinity` → usa legado.
- Qualquer exceção inesperada no bloco try/catch → usa legado.
- Preview e MP4 não quebram em nenhum cenário de falha do runtime model.

### Paridade matemática

O resultado de `evaluateSegmentPath(segIndex, t)` é numericamente idêntico ao
da v8z4b19c. Ambos os caminhos (runtime e legado) implementam a mesma fórmula
de Bézier quadrática com os mesmos dados de entrada. `compareRuntimePathWithLegacy`
confirma `match: true` com `delta < 0.001 px` para qualquer entrada válida.

### Schema JSON persistido — sem alteração

- `ctrlPts`, `ctrlPtManual` e `loopCtrlPt` continuam sendo o schema persistido.
- O modelo runtime não aparece no JSON.
- Nenhum campo novo criado (`curvesV2`, `vectorPath`, `handles`, `pathPoints`,
  `runtimeCurveModel` — nenhum destes existe).
- Arquivos existentes abrem normalmente. Arquivos novos salvam no mesmo formato.

### O que NÃO foi alterado

- Nenhuma alteração em UI, layout, cor, ícones, textos visíveis, bolinhas.
- Nenhuma alteração em drag de curvas, `loopCtrlPt`, `ctrlPts`.
- Nenhuma alteração em `sampleSegmentPath()`, `measureSegmentPathLength()` ou
  qualquer outra função de trajetória existente.
- Nenhuma alteração em undo/redo, Preview, MP4, save/load.
- Nenhuma alteração em JSON schema.
- Nenhum campo novo no JSON.
- Nenhum pathPoint real criado. Nenhum handle real criado. Nenhuma caneta criada.

### Nota de roadmap (sem implementação)

Registrado apenas como ideia futura: "Movimento inteligente pode continuar como
configuração global, mas futuramente pode haver exceções/parcialidade por trecho
ou por passagem de frame. Não implementar enquanto o conceito ainda não estiver
fechado."

### Arquivos alterados

- `index.html` — funções refatoradas/criadas + atualização de versão.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b19d.
- `pages-deploy-stamp.txt` — stamp de redeploy.

---

## v8z4b19c — introduce runtime vector curve model

Implementação interna controlada do modelo runtime de curva vetorial.
Sem alterar comportamento visual, Preview, MP4, save/load, JSON ou UI.

### Objetivo

Introduzir uma camada runtime que represente cada segmento como um modelo
vetorial tipado e auto-descritivo (`buildRuntimeCurveModel`), preparado para
evolução futura sem quebrar projetos existentes.

### Funções criadas em index.html

| Função | Descrição |
|---|---|
| `buildRuntimeCurveModel(segIndex)` | Constrói o modelo runtime de curva do segmento. Retorna objeto com `version`, `mode`, `anchors`, `controls`. |
| `validateRuntimeCurveModel(model)` | Valida que o modelo runtime é bem-formado. Retorna `true`/`false`. |
| `evaluateRuntimeCurveModel(model, t)` | Avalia a posição na trajetória do modelo em t ∈ [0,1]. Retorna `{x, y}` em pixels do stage. |

### Estrutura do modelo runtime

```
{
  version: 1,
  mode: 'legacyQuadratic',
  segmentIndex,
  isLoop,
  fromFrameIndex,
  toFrameIndex,
  anchors: [
    { kind: 'frameAnchor', role: 'start', frameIndex, x, y },  // normalizado (0–1)
    { kind: 'frameAnchor', role: 'end',   frameIndex, x, y }   // normalizado (0–1)
  ],
  controls: [
    {
      kind:   'curvePuller',
      role:   'quadraticControl',
      source: 'ctrlPts' | 'loopCtrlPt',  // origem no schema JSON persistido
      x,      // normalizado (0–1)
      y,      // normalizado (0–1)
      manual  // boolean
    }
  ]
}
```

### Contrato de unidades

- `anchors[*].x / .y` e `controls[*].x / .y` são **normalizados (0–1)**.
- Convenção: `x = pixelX / stageW`, `y = pixelY / stageH`.
- `evaluateRuntimeCurveModel()` converte de volta para pixels do stage ao avaliar.
- Retorno de `evaluateRuntimeCurveModel()` é `{x, y}` em **pixels**, idêntico a `evaluateSegmentPath()`.

### Contrato de segmentos

**Segmentos normais:**
- `fromFrameIndex = segIndex`, `toFrameIndex = segIndex + 1`.
- `controls[0].source = 'ctrlPts'`.
- `controls[0].x/y = ctrlPts[segIndex].nx/ny` (normalizados).

**Segmento de loop:**
- `segmentIndex = getLoopSegmentIndex() = frameCount - 1`.
- `fromFrameIndex = frameCount - 1`, `toFrameIndex = 0`.
- `controls[0].source = 'loopCtrlPt'`.
- `controls[0].x/y = loopCtrlPt.nx/ny` (normalizados).

### Paridade matemática

O resultado de `evaluateRuntimeCurveModel(buildRuntimeCurveModel(segIndex), t)` é
numericamente idêntico ao de `evaluateSegmentPath(segIndex, t)` para os mesmos dados
de entrada. `evaluateSegmentPath()` **não foi alterada** — coexistência paralela por segurança.

### Modelo é runtime apenas

- Não persistido no JSON.
- Nenhum campo novo no JSON (`curvesV2`, `vectorPath`, `handles`, `pathPoints`,
  `runtimeCurveModel` — nenhum destes existe).
- `ctrlPts`, `ctrlPtManual` e `loopCtrlPt` continuam sendo o schema persistido.
- Arquivos existentes abrem normalmente. Arquivos novos salvam no mesmo formato.

### O que NÃO foi alterado

- Nenhuma alteração em UI, layout, cor, ícones, textos visíveis, bolinhas.
- Nenhuma alteração em drag de curvas, `loopCtrlPt`, `ctrlPts`.
- Nenhuma alteração em `evaluateSegmentPath()`, `sampleSegmentPath()` ou qualquer
  função de trajetória existente.
- Nenhuma alteração em undo/redo, Preview, MP4, save/load.
- Nenhuma alteração em JSON schema.
- Nenhum campo novo no JSON.
- Nenhum pathPoint real criado. Nenhum handle real criado. Nenhuma caneta criada.

### Arquivos alterados

- `index.html` — funções runtime criadas + atualização de versão.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b19c.
- `pages-deploy-stamp.txt` — stamp de redeploy.

---

## v8z4b19b — audit loop curve path consistency

Auditoria técnica interna: revisar, comentar e consolidar a coerência entre o
tratamento do segmento de loop e o tratamento dos segmentos normais nas funções
de trajetória. Nenhuma alteração de comportamento, motor, visual, UI ou JSON.

### Objetivo

Confirmar e documentar em código o contrato interno entre segmentos normais e
segmento de loop no sistema de curvas legadas, garantindo:
1. Segmentos normais usam `from = i, to = i+1`.
2. Segmento de loop usa `from = frameCount-1, to = 0`.
3. `getLoopSegmentIndex()` retorna `frameCount - 1` somente quando `loopEnabled`.
4. `getSegmentCurvePuller(getLoopSegmentIndex())` acessa `loopCtrlPt` corretamente.
5. `measureLoopCurveLength()` e `measureSegmentPathLength(getLoopSegmentIndex())` são coerentes.
6. O modo constant-speed usa o comprimento correto para cada tipo de segmento.
7. Preview e MP4 continuam lendo o mesmo caminho de câmera.
8. JSON continua igual.

### Funções revisadas em index.html (apenas comentários e guards)

| Função | Tipo de alteração |
|---|---|
| `getActiveSegments` | Comentário de contrato adicionado |
| `getLoopSegmentIndex` | Comentário de contrato expandido |
| `evaluateSegmentPath` | Comentário de contrato adicionado (normal vs loop) |
| `sampleSegmentPath` | Comentário de contrato adicionado |
| `measureSegmentPathLength` | Comentário de coerência com `measureLoopCurveLength` |
| `measureSegmentCurveLength` | Guard defensivo + comentário de exclusão do loop |
| `measureLoopCurveLength` | Comentário de contrato e coerência |
| `redistributeDurationsByCurveLength` | Comentário de contrato constant-speed + loop |

### Guard defensivo adicionado

`measureSegmentCurveLength(segIndex)`: adicionado `typeof segIndex !== 'number' || !isFinite(segIndex)`
antes do guard existente `segIndex < 0 || segIndex >= frameCount - 1`. Protege contra
chamada com `NaN` ou `Infinity` sem alterar comportamento para valores válidos.

### Confirmação de coerência auditada

- `measureSegmentPathLength(getLoopSegmentIndex())` e `measureLoopCurveLength()` medem
  identicamente: P1 = frame[frameCount-1], P2 = frame[0], CP = loopCtrlPt, 64 amostras.
- `redistributeDurationsByCurveLength()` chama `measureSegmentCurveLength(i)` apenas para
  segmentos normais (i < frameCount-1) e `measureLoopCurveLength()` para o loop.
  `measureSegmentCurveLength` retorna 0 para `segIndex >= frameCount-1` (guard correto).
- Preview e MP4 usam `evaluateSegmentPath()` como entrada única — cobre loop e normais.

### O que NÃO foi alterado

- Nenhuma alteração em UI, layout, cor, ícones, textos visíveis.
- Nenhuma alteração em matemática de Bézier.
- Nenhuma alteração em drag de curvas, bolinhas visuais, `loopCtrlPt`.
- Nenhuma alteração em undo/redo, Preview, MP4, save/load.
- Nenhuma alteração em JSON schema (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`).
- Nenhum campo novo criado.
- Nenhuma função nova de comportamento criada.

### Nota de roadmap (sem implementação)

Registrado apenas para referência futura: "Modo de ajuste global de transformação
deve voltar na fase de interface. Ele deve permitir aplicar escala, deslocamento
e rotação a todos os frames do projeto, diferente de ajuste local e diferente de
seleção múltipla."

### Arquivos alterados

- `index.html` — comentários de contrato + guard defensivo + atualização de versão.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b19b.
- `pages-deploy-stamp.txt` — stamp de redeploy.

---

## v8z4b19a — standardize curve puller usage in curve rendering

Patch de padronização interna controlada: substituir chamadas genéricas a
`getSegmentCurve()` por `getSegmentCurvePuller()` nas funções onde o valor
representa claramente o puxador legado da curva (legacy curve puller).

### Objetivo

Continuar a consolidação iniciada em v8z4b18x–v8z4b18y: usar os helpers
semânticos de curvePuller onde o contexto é explicitamente o puxador
quadrático legado. Não é nova função, não é ajuste visual, não é mudança
de comportamento.

### Funções alteradas em index.html

| Função | Linha | Alteração |
|---|---|---|
| `getSegmentPath` | ~4584 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `getSegmentVectorModel` | ~4881 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `evaluateSegmentPath` | ~4985 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `getCtrlPtPos` | ~5424 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `drawBezier` (normal) | ~6437 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `drawBezier` (loop) | ~6466 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `updateCtrlPts` (normal) | ~6500 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `updateCtrlPts` (loop) | ~6514 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `measureSegmentCurveLength` | ~10484 | `getSegmentCurve` → `getSegmentCurvePuller` |

### O que NÃO foi alterado

- `getSegmentCurve()` e `setSegmentCurve()` continuam existindo como primitivos.
- `getSegmentCurvePuller()` internamente chama `getSegmentCurve()` — sem mudança de lógica.
- Chamadas em wrappers de nível inferior (`getSegmentCurvePoint`, interno de `getSegmentCurvePuller`) mantidas como estão.
- Nenhuma alteração em UI, layout, cor, ícones, visual de curva.
- Nenhuma alteração em drag de curvas, bolinha visual, loopCtrlPt.
- Nenhuma alteração em undo/redo, Preview, MP4, save/load.
- Nenhuma alteração em JSON schema (ctrlPts, ctrlPtManual, loopCtrlPt).
- Nenhuma alteração em matemática de Bézier, cálculo de t/perp.
- Nenhum campo novo criado.

### Arquivos alterados

- `index.html` — substituições + atualização de versão/comentários.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b19a.
- `pages-deploy-stamp.txt` — stamp de redeploy.

---

## v8z4b18z — fix loop curve undo

Patch mínimo de correção de bug: editar a curva de loop não entrava no histórico de undo.

### Problema

No handler `pointerdown` do elemento `cpt_loop` (bolinha da curva de loop), o drag era
iniciado atribuindo diretamente `ctrlDragSeg = 'loop'`, ignorando `startCtrlDrag('loop')`.
A função `startCtrlDrag` é responsável por chamar `pushUndo()` antes de iniciar qualquer
drag de curva. Como `startCtrlDrag` não era chamada para o loop, o estado pré-drag não era
salvo no histórico, tornando o undo ineficaz para a curva de loop.

O sistema de undo já suportava `loopCtrlPt`: `captureState()` salva e `restoreState()`
restaura `loopCtrlPt` corretamente. A causa era exclusivamente a chamada direta.

### Correção em index.html

**`cpt_loop` — handler `pointerdown` (linha 6525 antes da correção)**

```js
// ANTES
loopEl.addEventListener('pointerdown', e => { if (!editorPanMode) { e.stopPropagation(); ctrlDragSeg = 'loop'; } });

// DEPOIS
loopEl.addEventListener('pointerdown', e => { if (!editorPanMode) { e.stopPropagation(); startCtrlDrag('loop'); } });
```

`startCtrlDrag('loop')` executa:
1. `document.body.classList.add('dragging')` — consistência com curvas normais.
2. `pushUndo()` — salva o estado antes do drag (correção do bug).
3. `ctrlDragSeg = 'loop'` — mesmo comportamento de antes para o restante do drag.
4. A guarda `if (typeof seg === 'number' && seg >= 0)` em `setSegmentCurveManual` não
   é ativada para `'loop'` — comportamento existente preservado.

### Arquivos alterados

- `index.html` — correção do handler + atualização de versão/changelog/comentários.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b18z.
- `pages-deploy-stamp.txt` — stamp de redeploy.

### Restrições respeitadas

Sem alteração de UI, layout, cor, texto visível, ícones, visual de curva, Preview, MP4,
save/load, JSON schema, curvesV2, vectorPath, handles, pathPoints, framePauses,
segDurations, filename, refatoração ampla. Patch restrito ao handler `pointerdown` do
`loopEl` e à atualização de versão.

---

## v8z4b18y — centralize legacy curve puller access

Patch de centralização gradual do acesso ao puxador de curva legado. Usa os helpers
introduzidos na v8z4b18x (`getSegmentCurvePuller`, `isSegmentCurvePullerManual`,
`setSegmentCurvePuller`) em funções internas claramente relacionadas a leitura e
escrita de curva. Sem alterar motor, visual, schema JSON, UI, save/load ou comportamento.

### Alterações em index.html

**`insertFrameAfterActive()` — leitura do puxador de curva do segmento ativo**
- `const cpSrc = ctrlPts[a]` → `getSegmentCurvePuller(a)`.
- Contexto: cálculo do ponto médio na curva quadrática para posicionar o frame inserido.
- Substituição segura: leitura direta sem efeitos colaterais.

**`syncCtrlPtsForFrame()` — sincronização do puxador após mover frame**
- `if (!ctrlPts[seg]) continue` → `const cp = getSegmentCurvePuller(seg); if (!cp) continue`.
- `if (!ctrlPtManual[seg])` → `if (!isSegmentCurvePullerManual(seg))`.
- Escrita de `ctrlPts[seg].nx/ny/t/perpX/perpY` → `setSegmentCurvePuller(seg, {...})`.
- Leitura de `ctrlPts[seg]` para recomputar t/perpX/perpY → via variável `cp` retornada pelo helper.
- Substituição segura: `setSegmentCurvePuller` usa `Object.assign(ctrlPts[seg], ...)` internamente,
  comportamento idêntico. `cp` referencia o mesmo objeto que `ctrlPts[seg]`.

**`getStateAtT()` — leitura do puxador no motor de animação**
- `let cp; if (loopEnabled && seg === frameCount - 1) { cp = loopCtrlPt || … } else { cp = ctrlPts[seg] || … }`
  substituído por:
  `const cp = getSegmentCurvePuller(seg) || { midpoint via % frameCount }`.
- O helper já encapsula a lógica loop vs normal: retorna `loopCtrlPt` para o trecho de loop,
  `ctrlPts[seg]` para trechos normais.
- Fallback usa `% frameCount` — matematicamente idêntico às expressões originais para todos os casos.

**`measureLoopCurveLength()` — leitura do puxador do trecho de loop**
- `const cp = loopCtrlPt || {midpoint}` → `getSegmentCurvePuller(getLoopSegmentIndex()) || {midpoint}`.
- Substituição segura: função só executa quando `loopEnabled && frameCount >= 2`,
  então `getLoopSegmentIndex()` retorna `frameCount - 1` (válido).

### Sem alteração

Motor, Preview, MP4, save/load, schema JSON (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`,
`framePauses`, `segDurations`), UI, layout, cores, ícones, comportamento visual da curva,
arrastar puxador, reset de curva, loop, filename, compatibilidade com projetos antigos.
Nenhum campo novo no JSON.

---

## v8z4b18x — clarify legacy curve puller architecture

Patch preparatório e conceitual: consolida o ponto de controle atual da curva
como **legacy curve puller**, reforça nomenclatura técnica interna sem alterar
motor, visual, schema JSON, comportamento ou UI.

### Alterações

**Declaração do legacy curve puller (ctrlPts / loopCtrlPt)**
- Bloco de comentário expandido junto à declaração de `ctrlPts[]` e `ctrlPtManual[]`.
- Deixa explícito que `ctrlPts[seg]` é o **puxador de curva legado** (legacy curve puller)
  do trecho `seg` — não é frame, não é ponto de passagem, não é handle vetorial.
- `loopCtrlPt` também é documentado como legacy curve puller do trecho de loop (N→1).
- Referencia os novos helpers nomeados de curvePuller para facilitar o entendimento.

**Novos helpers — Legacy Curve Puller Helpers (v8z4b18x)**

Adicionados logo após a seção "Extended Curve Segment Helpers":

| Helper | Equivale a | Descrição |
|---|---|---|
| `getSegmentCurvePuller(seg)` | `getSegmentCurve(seg)` | Lê o puxador legado do trecho |
| `setSegmentCurvePuller(seg, puller, opts)` | `setSegmentCurve(seg, puller, opts)` | Escreve o puxador legado |
| `isSegmentCurvePullerManual(seg)` | `isSegmentCurveManual(seg)` | Lê flag de ajuste manual |
| `setSegmentCurvePullerManual(seg, bool)` | `setSegmentCurveManual(seg, bool)` | Escreve flag de ajuste manual |

Esses helpers chamam internamente os primitivos da v8z4b18u. Não substituem em
massa as chamadas existentes — são fornecidos para código novo onde o contexto
de "puxador legado" deve ser explícito.

**`resetSegmentCurve` — comentário técnico**
- Comentário expandido deixando claro que a função reseta o legacy curve puller
  (ctrlPts[seg] para trechos normais, loopCtrlPt para o loop) para o ponto médio.

**Comentários em Curve Access Helpers e Extended Curve Segment Helpers**
- Seção "Curve Access Helpers" atualizada para referenciar v8z4b18x e os novos helpers.
- Seção "Extended Curve Segment Helpers" atualizada para referenciar v8z4b18x.
- `getLoopSegmentIndex`: comentário reforça que `loopCtrlPt` é legacy curve puller.

### Notas técnicas para evolução futura

- `ctrlPts[seg]` é o puxador quadrático legado — deve continuar salvo/carregado
  no JSON para compatibilidade com projetos antigos.
- `ctrlPtManual[seg]` continua como flag de ajuste manual — sem alteração.
- `loopCtrlPt` continua como legacy curve puller do loop — não migrado nem convertido.
- Futuramente, o novo sistema vetorial poderá derivar o puxador de handles/tangentes
  ou mantê-lo como ferramenta rápida de edição ("modo curvePuller").
- Nenhum campo novo no JSON (sem curvesV2, vectorPath, handles, pathPoints, etc.).

### Sem alteração

Motor, Preview, MP4, marca d'água, `framePauses`, `ctrlPts` (schema), `loopCtrlPt`
(schema), `ctrlPtManual`, velocidade constante, Movimento/Rotação/Escala Inteligente,
zoom contextual, layout, UI, cores, ícones, comportamento visual do Stage,
arrastar puxador de curva, reset de curva, loop, save/load, filename, schema JSON.

---

## v8z4b18w — fix project save filename preview and suffix

Patch de UX no modal "Salvar projeto": corrige o fluxo de nome do arquivo, exibe
prévia dos nomes finais antes de salvar e elimina duplicação de sufixos.

### Alterações

**Nome-base sugerido limpo**
- A sugestão inicial do campo de nome não inclui mais prefixos genéricos de câmera
  (`img_`, `IMG_`, `photo_`, etc.), evitando nomes redundantes como `arco_img_5163`.
- Padrão novo: `arco_5163` (campo); arquivo final: `arco_5163_img.json` ou `arco_5163_file.json`.
- Lógica: strip de `^(img|image|photo|foto|pic|dscf?|dcim|screenshot|captura)[_\-]?`
  do `_imageBaseName` antes de construir o `suggestedBase`.

**Prévia do nome final antes de salvar**
- Adicionado bloco `#saveModalPreview` ao modal com dois spans:
  `#savePreviewImg` e `#savePreviewFile`.
- A prévia é atualizada em tempo real conforme o usuário edita o campo.
- Exemplo exibido:
  - `Com imagem: arco_5163_img.json`
  - `Sem imagem: arco_5163_file.json`

**Função `normalizeBaseName(name)` — v8z4b18w**
- Nova função pública que limpa o nome digitado antes de montar o filename final:
  1. Remove extensão `.json` no final.
  2. Remove sufixo `_img` ou `_file` (com separador `_` ou `-`) para evitar duplicação.
  3. Substitui caracteres problemáticos para filename (`/ \ : * ? " < > |`) por `_`.
  4. Trim de espaços e underscores nas bordas.
  5. Colapsa múltiplos `__` consecutivos em `_`.
  6. Fallback para `arco_projeto` se o resultado ficar vazio.

**`promptSaveProject` atualizado**
- Usa `normalizeBaseName` no momento do clique (lê o valor atual do input).
- Armazena o nome-base normalizado (sem `_img`/`_file`) em `_lastProjectFileName`.
- Botão "Salvar com imagem": `base + '_img'` → `doSaveDirect(true, …)`.
- Botão "Salvar sem imagem": `base + '_file'` → `doSaveDirect(false, …)`.
- Prévia atualizada via `input.oninput`.

**`openSaveModal` atualizado**
- Usa o mesmo `cleanBase` para sugestão e inicializa a prévia.

**`confirmSaveModal` atualizado**
- Usa `normalizeBaseName` + aplica sufixo correto (`_img` ou `_file`) conforme `includeImage`.

**`doSaveDirect` — guard contra dupla extensão**
- Remove `.json` do `nome` antes de adicionar `.json` (safeguard contra edge cases).

### Exemplos de comportamento

| Usuário digita | Salvar com imagem | Salvar sem imagem |
|---|---|---|
| `arco_5163` | `arco_5163_img.json` | `arco_5163_file.json` |
| `teste_img` | `teste_img.json` | `teste_file.json` |
| `teste_file` | `teste_img.json` | `teste_file.json` |
| `teste.json` | `teste_img.json` | `teste_file.json` |
| `teste/projeto:18w?` | `teste_projeto_18w__img.json` | `teste_projeto_18w__file.json` |

### Sem alteração

Motor, Preview, MP4, marca d'água, `framePauses`, `ctrlPts`, `loopCtrlPt`, velocidade constante,
Movimento/Rotação/Escala Inteligente, zoom contextual, layout geral, UI estrutural,
JSON schema, fluxo de abrir projeto, salvar desabilitado no estado inicial vazio.

---

## v8z4b18v — update watermark to arcomotion.app

Patch de texto: atualiza exclusivamente a marca d'água do Preview e exportação MP4.

### Alteração

- `WATERMARK_TEXT` atualizado de `'Arco Motion App'` para `'arcomotion.app'`.
- Centralizado na constante `WATERMARK_TEXT`; nenhuma string duplicada.
- Posição, fonte, tamanho, cor, opacidade, sombra e alinhamento da marca d'água permanecem idênticos.
- Preview e MP4/exportação usam o mesmo `WATERMARK_TEXT`; consistência garantida.
- Nome do produto (Arco Motion App) mantido em títulos, menus e metadados — somente a marca d'água foi alterada.

### Sem alteração

Motor, UI, layout, JSON schema, `framePauses`, `ctrlPts`, `loopCtrlPt`, loop, velocidade constante,
Movimento/Rotação/Escala Inteligente, zoom contextual, salvar desabilitado no estado vazio.

---

## v8z4b18u — curve segment access foundation

Inicia a fundação técnica do novo sistema de curvas. Camada interna de helpers para
acessar, ler e atualizar curvas por trecho sem espalhar lógica condicional pelo código.
Preserva totalmente o sistema visual e de dados existente (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`).

### Novos helpers

- `getNormalSegmentCount()` — retorna o número de trechos normais (F1→F2, F2→F3, etc.) independente de `loopEnabled`.
- `getLoopSegmentIndex()` — retorna o índice do segmento de loop (N→1) quando loop está ativo, ou `-1`.
- `getSegmentCurvePoint(segIndex)` — retorna `{x, y}` normalizados do puxador de curva do trecho, ou `null`.
- `setSegmentCurvePoint(segIndex, point, options)` — define `{x, y}` normalizados do puxador de curva. Atalho sobre `setSegmentCurve()`.

### Helpers existentes ampliados

- Seção "Curve Access Helpers" atualizada para v8z4b18u com documentação do conceito de `legacyCurvePuller`.
- Comentário técnico adicionado à declaração de `ctrlPts[]` e `loopCtrlPt` explicando que são puxadores auxiliares legados:
  - não são frames (frameAnchor);
  - não são pontos de passagem (pathPoint);
  - não são handles vetoriais;
  - são compatíveis com projetos antigos;
  - futuramente poderão coexistir com handles/tangentes.

### Substituições seguras de acesso direto

Funções de leitura/desenho migradas para usar os helpers, sem alterar comportamento:

- `evaluateSegmentPath()` — substituído `seg.isLoop ? loopCtrlPt : ctrlPts[segIndex]` por `getSegmentCurve(segIndex)`.
- `getSegmentVectorModel()` — substituído acesso direto a `loopCtrlPt`/`ctrlPts[segIndex]` e `ctrlPtManual[]` por `getSegmentCurve()` / `isSegmentCurveManual()`.
- `drawBezier()` — substituído `ctrlPts[seg]` por `getSegmentCurve(seg)`; loop usa `getSegmentCurve(getLoopSegmentIndex())`.
- `updateCtrlPts()` — loop usa `getSegmentCurve(getLoopSegmentIndex())` para posição e visibilidade da bolinha.
- `getCtrlPtPos()` — substituído `ctrlPts[seg]` por `getSegmentCurve(seg)`.

### Acesso direto preservado (risco alto)

Mantido acesso direto em: `syncCtrlPtsForFrame()`, `buildProjectData()`, `applyFrameData()`,
`applyState()`, `addFrame()`, operações de splice em `ctrlPts[]`, e `getStateAtT()` (motor de animação).
Esses pontos serão migrados em versões futuras de forma controlada.

### Sem alteração de

- Visual (curvas, puxadores, cores, tamanhos, posições).
- UI (layout, textos, ícones, menus).
- Motor de animação (Preview, MP4, easing, pausas, velocidade constante, loop).
- JSON schema (nenhum campo novo; projetos antigos abrem normalmente).
- `framePauses`, `segDurations`, Movimento/Rotação/Escala Inteligente, zoom contextual.

## v8z4b18t — fix watermark brand and disable empty project save

- Marca d'água corrigida para **Arco Motion App** em Preview e exportação MP4 (era `Arc Motion`).
- Constante `WATERMARK_TEXT` atualizada para `'Arco Motion App'`; posição, tamanho, opacidade e alinhamento inalterados.
- Nome visível do produto atualizado para **Arco Motion App** em: `<title>`, `apple-mobile-web-app-title`, cabeçalho de Configurações e `navigator.share`.
- Adicionada função `canSaveProject()`: retorna `true` apenas quando há imagem carregada e frames válidos (`imgNatW > 0 && frameCount > 0`).
- Adicionada função `updateSaveProjectState()`: sincroniza visual disabled/ativo nos botões "Salvar projeto" (toolbar e settings) com base em `canSaveProject()`.
- "Salvar projeto" aparece cinza/desabilitado no estado inicial vazio; fica ativo após carregar imagem ou abrir projeto válido; volta a desabilitado após Reset.
- `promptSaveProject()` retorna imediatamente quando `canSaveProject()` é false (sem gerar JSON vazio nem abrir modal).
- Versão do JSON salvo: `v8z4b18t` via `APP_VERSION`.
- `framePauses` continua sendo salvo e carregado corretamente (sem alteração na lógica de persistência).

## v8z4b18s — rename app to Arc Motion and fix project version metadata

- Nome visível do app atualizado para **Arc Motion** em todos os textos visíveis ao usuário: `<title>`, `apple-mobile-web-app-title`, cabeçalho de Configurações, marca d'água do Preview/MP4 e `navigator.share`.
- Marca d'água centralizada na constante `WATERMARK_TEXT = 'Arc Motion'`; mesma posição, tamanho, opacidade e alinhamento.
- Corrigido `version` no JSON salvo/exportado: era hardcoded `'v8y3'`, agora usa `APP_VERSION` dinamicamente (`v8z4b18s`).
- Projetos antigos com `version: 'v8y3'` continuam abrindo normalmente (nenhuma alteração de schema ou migração).
- `framePauses` continua sendo salvo e carregado corretamente (sem alteração na lógica de persistência).

## v8z4b18r — fix frame pause persistence and stale load state

Patch de correção crítica de persistência de pausas por frame: resolve dois bugs independentes que faziam pausas configuradas no painel Duração desaparecerem ao reabrir projetos após recarregar o app.

### Bugs corrigidos

#### Bug 1 — Pausas não persistidas no JSON (save)

**Causa raiz**: `buildProjectData()` serializava `framePauses` sem garantir que o array estava sincronizado com `frameCount`. Após `applyTemplate()` (que zera `framePauses.length = 0`), se o usuário salvasse antes de qualquer operação que chamasse `ensureFramePauses()` (abrir painel, adicionar frame, etc.), o JSON recebia `"framePauses": []`. Na importação, `[] vazio` caia no Caso 2 (zeros), descartando qualquer pausa que o usuário tivesse configurado na sessão atual.

**Correção**: `buildProjectData()` chama `ensureFramePauses()` como primeira linha. Garante array com exatamente `frameCount` entradas antes de serializar, independente do estado interno.

#### Bug 2 — Falso positivo de "pausas restauradas" na mesma sessão (load)

**Causa raiz**: O path assíncrono de carregamento de projeto com imagem embutida (`data.hasImage = true`) retornava imediatamente de `applyProjectData()` enquanto a imagem era decodificada. Durante esse intervalo, `framePauses[]` da sessão anterior continuava em memória. A UI do painel Duração exibia os valores antigos, criando a falsa impressão de que as pausas do arquivo carregado estavam presentes. Após recarregar o app (memória limpa), o mesmo arquivo abria com zeros — revelando que o arquivo nunca tinha as pausas.

**Correção**: `applyProjectData()` limpa `framePauses.length = 0` como primeira ação, antes de qualquer desvio para o path assíncrono. `applyFrameData()` restaura os valores corretos do JSON após a imagem estar pronta.

### Outros ajustes

- **`normalizeImportedFramePauses()`**: logging promovido de `_arcoDebug`-only para sempre ativo (`console.info`), incluindo Caso 2 com diagnóstico do campo `framePauses` ausente/vazio. Facilita rastreamento em campo sem ativar modo debug.
- **`doSaveDirect()`**: log de diagnóstico que exibe `frameCount`, `framePauses.length` e contagem de pausas não-zero no momento do save. Permite verificar em console se os valores foram serializados corretamente.
- **Comentários de versão** atualizados para `v8z4b18r`.

### Critérios de aceite verificados (análise estática)

| Cenário | Comportamento esperado | Status |
|---------|----------------------|--------|
| Salvar com pausas configuradas | `framePauses` no JSON tem os valores corretos | ✓ (ensureFramePauses() antes do save) |
| Salvar sem abrir painel Duração | `framePauses: [{duration:0},…]` com `length = frameCount` | ✓ |
| Carregar em nova sessão | Pausas do JSON restauradas, sem herdar sessão anterior | ✓ |
| Carregar na mesma sessão | Estado anterior limpo imediatamente | ✓ |
| Arquivo sem `framePauses` | Abre com zeros, sem inventar valores | ✓ (Caso 2) |
| Arquivo com `framePauses: []` vazio | Abre com zeros (mesmo que sessão anterior tivesse pausas) | ✓ |
| Arquivo com `framePauses` válido | Valores restaurados exatamente | ✓ (Caso 1) |
| Loop + pausas | Loop e pausas independentes, ambos preservados | ✓ |

### O que NÃO foi alterado

- Visual do Stage, curvePuller, zoom contextual.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON — nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`.
- Scaffold vetorial — preservado da v8z4b18n.
- UI geral (design, cores, layout, painel inferior).
- Modo Curvas, pontos de passagem, handles — não implementados.
- Preview, MP4 — sem alteração (já usavam `framePauses[]` corretamente).
- Comportamento de curvas, loop, velocidade constante, Movimento/Rotação/Escala Inteligente.

---

## v8z4b18q — normalize imported frame pauses

Patch de correção de importação de pausas por frame: garante que projetos salvos com pausas por frame as tenham corretamente restauradas ao carregar, e que projetos sem pausas fiquem zerados sem inventar valores.

### O que foi corrigido

- **`normalizeImportedFramePauses(projectData, frameCount)`** — novo helper centralizado para importação de pausas. Detecta formatos atuais (`framePauses[]`) e legados (`finishMode='pause'`/`finishDuration`); nunca sobrescreve pausas carregadas com defaults após o load.
- **`migrateLegacyProjectData`** — seção de framePauses simplificada: não cria mais array de zeros (responsabilidade movida para `normalizeImportedFramePauses`). Continua neutralizando `pauseDuration` e `easeMode='pause'`.
- **`applyFrameData`** — chamada ao normalizador posicionada após o ajuste defensivo de `frameCount` (v8z4b18o), garantindo que o array de pausas tenha exatamente o número correto de entradas.
- **Migração legada finishMode='pause'** — integrada ao normalizador; `finishDuration` é mapeado para o último frame apenas quando `finishMode='pause'` está explicitamente presente no JSON.

### Casos cobertos

| Projeto | Comportamento |
|---------|---------------|
| Sem pausas (`framePauses` ausente ou `[]`) | Zeros, sem inventar valores |
| Com pausas por frame (`framePauses: [{duration:2.5},…]`) | Preserva todos os valores |
| Legado `finishMode='pause'` + `finishDuration` sem `framePauses` | Último frame recebe `finishDuration` |
| Legado `easeMode='pause'` + `pauseDuration` | Zeros (target por frame desconhecido) |
| Loop ligado + pausas | Loop e pausas preservados independentemente |

### O que NÃO foi alterado

- Visual do Stage, curvePuller, zoom contextual.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON — nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`.
- Scaffold vetorial — preservado da v8z4b18n.
- UI geral (design, cores, layout, painel inferior).
- Modo Curvas, pontos de passagem, handles — não implementados.
- Preview, MP4 (exceto que agora respeitam pausas corretamente carregadas).

---

## v8z4b18p — consolidate import fixes after duplicate 18o merges

Patch de consolidação e rastreabilidade: corrige a situação de dois PRs distintos mergeados com o mesmo rótulo `v8z4b18o`, garantindo histórico, CHANGELOG e QA consistentes. Nenhum avanço funcional. Consolida todos os fixes de importação da v8z4b18o em uma versão unificada com número correto.

### O que foi consolidado

- **Robustez para `imageBase64` ausente/inválido/placeholder** — `isValidImageBase64()` rejeita `null`/`undefined`, não-string, string vazia, strings com `<<` (placeholder), strings sem prefixo `data:image/`. Projetos com imagem placeholder carregam normalmente sem a imagem (fluxo "selecione a imagem para continuar").
- **`applyProjectData()`** — usa `isValidImageBase64()` em vez de truthy bruto; `img.onerror` como safety net; `console.warn` informativo quando placeholder detectado.
- **`restoreAutosave()`** — usa `applyFrameData(data)` em vez de `restoreState(data)`, corrigindo TypeError silencioso que impedia restauração de estado e pausas.
- **`renderAll()`** — null-check em `frames[i]` antes de acessar `.x/.y/.w/.h`.
- **`applyFrameData()`** — guard de `frameCount` vs `frames.length` após load.
- **`loadProjectFromFile()` / `loadProjectFromJson()`** — `console.error` no catch para diagnóstico.
- **Preservação de pausas** — `framePauses` restaurado corretamente via `applyFrameData`.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON — nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`.
- Scaffold vetorial (`getSegmentPathMode`, `getSegmentVectorModel`) — preservado da v8z4b18n, sem alterações.
- `migrateLegacyProjectData()` — comportamento de migração e preservação de pausas inalterado.
- Visual do Stage, curvePuller, zoom contextual, Undo/redo.
- UI geral (design, cores, layout, painel inferior).
- Modo Curvas, pontos de passagem, handles — não implementados nesta versão.

### Histórico desta consolidação

Dois PRs foram mergeados com o rótulo `v8z4b18o`:
- PR #106 (`fix-project-load-pauses`): corrigiu `restoreAutosave`, `renderAll`, `applyFrameData`, logs de load.
- PR #107 (`fix-project-import`): adicionou `isValidImageBase64`, `img.onerror` em `applyProjectData`.

A versão `v8z4b18p` registra formalmente a combinação dos dois patches como versão única, sem reverter nenhum merge.

---

## v8z4b18o — robust project import and pause preservation

Patch de robustez no importador de projetos: corrige falha silenciosa que travava o load de projetos com `imageBase64` ausente, inválido ou placeholder (ex.: `"<<mesma imageBase64 do original>>"`). Adiciona `isValidImageBase64()` para validar o campo antes de tentar decodificar; adiciona `img.onerror` como safety net para falhas de decodificação tardias; ambos os casos caem no fluxo existente de "projeto sem imagem" (pede ao usuário que selecione a imagem). Corrige também regressão crítica no restore do autosave e adiciona null-checks defensivos. Nenhuma mudança de visual, motor, schema JSON ou UI.

### O que foi corrigido

- **`isValidImageBase64(val)`** *(nova função)* — valida `imageBase64` antes de qualquer tentativa de decodificação. Rejeita: `null`/`undefined`, não-string, string vazia, strings contendo `<<` (placeholder), strings que não começam com `data:image/`. Projetos que falhavam silenciosamente por ter imagem placeholder agora são carregados normalmente sem a imagem.
- **`applyProjectData()`** — condição de entrada alterada de `data.imageBase64` (truthy bruto) para `isValidImageBase64(data.imageBase64)`. Adicionado `img.onerror` como safety net: se a imagem falhar ao decodificar mesmo passando na validação, o projeto é carregado sem imagem em vez de travar. Adicionado `console.warn` informativo quando imageBase64 inválido/placeholder é detectado.
- **`restoreAutosave()`** — substituído `restoreState(data)` por `applyFrameData(data)`. `buildProjectData()` (usado pelo autosave) salva `framesNorm` (coords normalizadas), mas `restoreState()` esperava `frames` (coords absolutas). O acesso a `state.frames.forEach` lançava `TypeError` silencioso, deixando o app sem estado após "Continuar de onde parou?" — projeto não carregava e pausas não eram restauradas.
- **`renderAll()`** — adicionado null-check para `frames[i]` antes de acessar `.x`, `.y`, `.w`, `.h`. Impede crash se `frames.length < frameCount` por qualquer razão.
- **`applyFrameData()`** — adicionado guard após carregar frames: se `frames.length < frameCount`, `frameCount` é ajustado para `frames.length` (com log de aviso no console), prevenindo acessos fora dos limites em todas as funções downstream.
- **`loadProjectFromFile()` / `loadProjectFromJson()`** — adicionado `console.error` no catch para facilitar diagnóstico sem expor UI complexa.

### Comportamento ao importar projeto com imagem inválida

1. `isValidImageBase64()` detecta placeholder/inválido antes de qualquer I/O.
2. `console.warn` informa no console.
3. Fluxo cai em `if (!imgNatW)` — `pendingProjectData = data` e mensagem "Projeto carregado — selecione a imagem para continuar".
4. Todos os dados válidos (frames, durações, pausas, curvas, loop) são preservados em `pendingProjectData`.
5. Após o usuário selecionar uma imagem compatível, `applyFrameData(pendingProjectData)` restaura tudo.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON — nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`. JSON salvo em v8z4b18o é idêntico ao de v8z4b18m/n.
- Scaffold vetorial (`getSegmentPathMode`, `getSegmentVectorModel`) — preservado da v8z4b18n, sem alterações.
- `migrateLegacyProjectData()` — comportamento de migração e preservação de pausas inalterado.
- Visual do Stage, curvePuller, zoom contextual, Undo/redo.
- UI geral (design, cores, layout, painel inferior).

---

## v8z4b18n — vector path mode scaffold

Patch estrutural/interno: cria base para o futuro modo vetorial de trajetória por segmento, separando claramente o modo atual (`legacyQuadratic`) do futuro modo `vectorAnchors`. Adiciona `getSegmentPathMode()` e `getSegmentVectorModel()`. Atualiza `evaluateSegmentPath()` com switch interno seguro. Nenhuma mudança de visual, motor, Preview, MP4, JSON ou UI.

### O que foi adicionado

- **`getSegmentPathMode(segIndex)`** — retorna o modo de trajetória do segmento. Nesta versão, sempre `"legacyQuadratic"`. Preparado para retornar `"vectorAnchors"` no futuro sem alterar código externo.
- **`getSegmentVectorModel(segIndex)`** — retorna modelo vetorial normalizado do segmento: `segmentIndex`, `label`, `from`, `to`, `isLoop`, `mode`, `frameAnchors` (start/end), `curvePuller` (com `kind`, `source`, `x`, `y`, `manual`), `pathPoints: []` e `handles: []`. Funciona para segmentos normais e para o segmento de loop (usa `loopCtrlPt` quando aplicável).
- **Bloco de documentação `vectorAnchors`** — estrutura conceitual futura documentada em comentário: `pathPoints` com `kind`, `id`, `x`, `y`, `pointType`, `handleIn`, `handleOut`; `handles`; TODOs para avaliador cúbico, UI e schema JSON.

### O que foi alterado

- **`evaluateSegmentPath(segIndex, t)`** — header atualizado para `v8z4b18l / mode switch v8z4b18n`. Adicionado `const mode = getSegmentPathMode(segIndex)` e branch `vectorAnchors` com TODO e fallback seguro para `legacyQuadratic`. Resultado matemático idêntico à v8z4b18m.
- **Cabeçalho, `APP_VERSION`, `APP_VERSION_NAME`** — atualizados para `v8z4b18n` / `vector path mode scaffold`.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`).
- Visual do curvePuller (losango ciano/azul/laranja/roxo conforme v8z4b18m).
- `sampleSegmentPath()`, `measureSegmentPathLength()` — continuam usando `evaluateSegmentPath()` sem alteração.
- `resetSegmentCurve()` — continua resetando o curvePuller no modo `legacyQuadratic`.
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18m — visual curve puller distinction

Patch visual: diferencia o curvePuller (puxador legado da curva) dos demais pontos da timeline, trocando seu formato de círculo para losango. Mantém área de toque, compensação de zoom, cores e comportamento exatamente iguais à v8z4b18l. Nenhuma mudança de comportamento, motor, Preview, MP4, JSON ou schema.

### O que foi alterado

- **`.ctrl-pt` (CSS)** — shape alterado de círculo (`border-radius:50%`) para losango (`rotate(45deg)`, `border-radius:0`, 10×10 px). O losango é visualmente equivalente ao círculo anterior (diagonal ≈ 14 px) mas claramente distinto de um ponto de passagem. Área de toque (`::before` 44×44 px, `border-radius:50%`) preservada.
- **Comentário CSS** — atualizado de "círculo ciano r=5" para "losango ciano (curvePuller)".

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller`, `curvesV2`, `vectorPath`, `sampledPath`).
- Lógica de cores do curvePuller (azul para segmento anterior, laranja para segmento ativo, roxo para loop).
- Área de toque (hit area) — mantida igual ou ligeiramente maior.
- Compensação de zoom contextual (`scale(var(--ez-inv,1))`).
- Comportamento de arrastar o curvePuller.
- `resetSegmentCurve()`, `getSegmentCurve()`, `setSegmentCurve()` — preservados.
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- `evaluateSegmentPath()`, `sampleSegmentPath()`, `measureSegmentPathLength()` — preservados.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18l — unified segment path evaluator

Patch estrutural/interno: cria avaliador único de trajetória por segmento, centralizando como o app calcula pontos ao longo da curva. Adiciona `evaluateSegmentPath()`, `sampleSegmentPath()` e `measureSegmentPathLength()` como base para futuros path points, handles e Modo Mapa/Curvas. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi adicionado

- **`evaluateSegmentPath(segIndex, t)`** — avaliador único de trajetória: retorna `{x, y}` em pixels do stage para o segmento no parâmetro `t ∈ [0,1]`. Avalia a curva quadrática atual com curvePuller legado. Trata segmentos normais e de loop. Valida: `segIndex` inválido, `frameCount < 2`, `stageW/stageH` ausente, `frames` ausentes, `ctrl` ausente (fallback ponto médio), `t` NaN/Infinity/fora de `[0,1]`. Retorna `null` para segmento inválido.
- **`sampleSegmentPath(segIndex, steps)`** — retorna `steps+1` pontos amostrados ao longo da trajetória (inclui `t=0` e `t=1`). Usa `evaluateSegmentPath()`. `steps` mínimo seguro: 8; padrão: 64. Retorna `[]` para segmento inválido.
- **`measureSegmentPathLength(segIndex, steps)`** — mede o comprimento aproximado da trajetória em pixels do stage. Usa `sampleSegmentPath()`. Funciona para segmentos normais e de loop (unified). Fallback para distância linear em casos degenerados.
- **Comentários de migração futura** — `measureSegmentCurveLength()` e `measureLoopCurveLength()` anotadas como candidatas à migração para `measureSegmentPathLength()` quando seguro.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller`, `curvesV2`, `vectorPath`, `sampledPath`).
- Visual do ponto atual da curva (curvePuller/legacyCurveControl).
- `measureSegmentCurveLength()`, `measureLoopCurveLength()` — preservadas e em uso.
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- `resetSegmentCurve()`, `getSegmentCurve()`, `setSegmentCurve()` — preservados.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18k — separate curve puller from path points

Patch conceitual/arquitetural: reclassifica internamente o ponto atual de controle da curva como `curvePuller` (puxador legado), separando-o conceitualmente dos futuros pontos de trajetória reais. Adiciona helper `getSegmentAnchors()` e documenta o modelo futuro de pathPoints e handles. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi alterado

- **`getSegmentTrajectoryPoints()`** — o ponto de controle quadrático agora retornado com `kind:'curvePuller'` (era `kind:'adjustment'`). Semântica corrigida: curvePuller é um puxador auxiliar/legado, não um pathPoint real. Comportamento visual idêntico.
- **`setSegmentTrajectoryPoint()`** — o guard agora aceita `kind:'curvePuller'` (era `kind:'adjustment'`). Comentários atualizados para refletir a terminologia correta.
- **Drag do ponto de curva no Stage** — o descritor `_adjDesc` atualizado para `kind:'curvePuller'`. Comportamento funcional idêntico ao da v8z4b18j.
- **`getSegmentAnchors(segIndex)`** — novo helper que retorna as âncoras reais do segmento (`frameAnchor` start e end). Nesta versão só existem frameAnchors; pathPoints persistentes não existem ainda.
- **Bloco de documentação interna** — comentários técnicos adicionados documentando:
  - Terminologia: `curvePuller`, `frameAnchor`, `pathPoint` (futuro), `handle` (futuro).
  - Formato futuro de `pathPoint` (não persistido, não renderizado).
  - Regras de handles futuros (não criados nesta versão).
  - Regra de compatibilidade: projetos antigos continuam com curvePuller sem conversão automática.
  - Ferramenta futura de caneta (decisão documentada).

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller`, `curvesV2`).
- Visual do ponto atual da curva (ciano, mesmo tamanho e posição).
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- `resetSegmentCurve()`, `getSegmentCurve()`, `setSegmentCurve()` — preservados como estão.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18j — editable trajectory adjustment point

Refatoração interna: consolida o ponto de controle da curva como ponto de ajuste editável da trajetória, roteando a edição pelo drag do Stage via `setSegmentTrajectoryPoint()`. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi alterado

- **`setSegmentTrajectoryPoint(segIndex, pointDescriptor, nextPoint)`** — estendido para também atualizar `t/perpX/perpY` em segmentos normais (não loop), via `computeTPerpForSeg()`. Comportamento visual preservado. Para o segmento de loop, apenas `nx/ny` são atualizados (igual ao comportamento anterior). Comentário técnico adicionado documentando que nesta versão há um único ponto de ajuste por segmento.
- **Drag do ponto de curva no Stage** — o handler `pointermove` agora roteia a edição via `setSegmentTrajectoryPoint()` em vez de chamar `setSegmentCurve()` diretamente. A lógica de `computeTPerpForSeg` foi movida para dentro de `setSegmentTrajectoryPoint`. Comportamento visual idêntico ao da v8z4b18i.
- **Loop** — drag do ponto de curva 3–1 continua atualizando apenas `loopCtrlPt` via `setSegmentCurve()`, sem afetar outros segmentos.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo).
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- `resetSegmentCurve()` — preservado como está (reset requer manual=false, incompatível com setSegmentTrajectoryPoint).
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18i — internal trajectory points model

Refatoração interna: adiciona camada de pontos de trajetória por segmento via `getSegmentTrajectoryPoints()`, `setSegmentTrajectoryPoint()` e `getAllTrajectoryPoints()`. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi adicionado

- **`getSegmentTrajectoryPoints(segIndex)`** — retorna lista normalizada de pontos representando a trajetória atual do segmento: ponto inicial (`kind:"frame"`, `role:"start"`), ponto de ajuste (`kind:"adjustment"`, `role:"control"`, `source:"quadraticCtrl"`) e ponto final (`kind:"frame"`, `role:"end"`). Todos com coordenadas normalizadas (`x`, `y`) relativas ao Stage. Retorna `[]` para índice inválido, `frameCount < 2`, segmento inexistente, `stageW/stageH <= 0`, frames ausentes ou `ctrl` com valores inválidos.
- **`setSegmentTrajectoryPoint(segIndex, pointDescriptor, nextPoint)`** — atualiza o ponto de controle quadrático do segmento a partir de um ponto de trajetória do tipo `adjustment/control/quadraticCtrl`. Marca a curva como manual. Ignora silenciosamente tentativas de editar pontos `kind:"frame"` (esses continuam sendo editados pelas ferramentas de frame). Validações defensivas para `pointDescriptor` incompleto, `nextPoint` inválido, NaN/Infinity.
- **`getAllTrajectoryPoints()`** — retorna lista de pontos de trajetória de todos os segmentos ativos: `[{ segmentIndex, segmentLabel, points: [...] }]`. Disponível para uso futuro sem alterar UI.

### Integração com helpers existentes

- `getSegmentTrajectoryPoints()` usa `getSegmentByIndex()`, `getSegmentPath()`, `frameCX()`, `frameCY()`, `stageW`, `stageH` internamente.
- `setSegmentTrajectoryPoint()` usa `setSegmentCurve()` e `setSegmentCurveManual()` — preserva comportamento atual de edição de curva.
- `getAllTrajectoryPoints()` usa `getAllSegmentPaths()` e `getSegmentTrajectoryPoints()`.
- Nenhum helper existente foi alterado.

### Suporte a Loop

- Segmento N→1 (loop): `getSegmentTrajectoryPoints()` retorna start = frame N, adjustment = `loopCtrlPt`, end = frame 1.
- `setSegmentTrajectoryPoint()` atualiza `loopCtrlPt` via `setSegmentCurve()` — comportamento preservado (sem flag manual separada no loop, igual a versões anteriores).

### Preparação para o futuro editor vetorial de trajetória

Nesta versão cada segmento tem apenas três pontos (start frame, adjustment control, end frame). No futuro esta camada poderá aceitar múltiplos pontos de trajetória, handles de tangência, desenho livre e conversão ponto ↔ frame.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `trajectoryPoints`, `guidePoints`, `handles`, `paths`, `curvesV2`).
- Velocidade constante, Loop como trecho real, Pausa final, Igualar intervalos.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- Curvas, resetar curva, edição manual de curva.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18h — refresh loop curve on toggle

Corrige o refresh visual da curva do loop (trecho N→1) no Stage ao ligar ou desligar Loop. A curva agora aparece e desaparece imediatamente, sem precisar de toque posterior no Stage.

### O que foi corrigido

- **`setFinishing(mode)`** — adicionada chamada a `renderAll()` logo após `maybeRedistributeByCurveLength()`. Sem essa chamada, `drawBezier()` nunca era invocado após a troca de modo de acabamento, causando o atraso visual.
- **Ligar Loop** — a curva N→1 (roxa) aparece imediatamente no Stage assim que o chip "Loop" é selecionado.
- **Desligar Loop** — a curva N→1 desaparece imediatamente do Stage ao selecionar "Nenhum" ou "Pausa final".
- **Ponto de controle do loop** — `updateCtrlPts()` (chamado dentro de `renderAll()`) garante que o ponto roxo seja exibido ou ocultado imediatamente junto com a curva.
- **Sem curva fantasma** — a flag `loopEnabled` já controlava corretamente a renderização em `drawBezier()` e `updateCtrlPts()`; o único problema era a ausência de `renderAll()`.

### O que NÃO foi alterado

- Motor de Preview, export MP4/WebCodecs.
- `drawBezier()`, `updateCtrlPts()`, `renderAll()` — lógica interna preservada.
- Schema do JSON (nenhum campo novo).
- Velocidade constante, Pausa final, Igualar intervalos.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- Curvas, resetar curva, edição manual de curva, handles, pontos de trajetória.
- UI geral (design, cores, layout).
- `toggleLoop()` — função mantida sem alteração (não é chamada pela UI atual).

---

## v8z4b18g — internal segment path object

Refatoração interna: adiciona camada de trajetória por segmento via `getSegmentPath()`, `setSegmentPath()` e `getAllSegmentPaths()`. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi adicionado

- **`getSegmentPath(segIndex)`** — retorna objeto normalizado representando a trajetória do segmento: `{ segmentIndex, from, to, isLoop, label, type, ctrl, manual, guides, handles }`. Mapeia para `ctrlPts`/`loopCtrlPt` e `ctrlPtManual` atuais. Retorna `null` para índice inválido, `frameCount < 2`, segmento inexistente, `ctrl` ausente ou com valores inválidos (NaN/Infinity).
- **`setSegmentPath(segIndex, path, options)`** — grava de volta apenas dados compatíveis com o sistema atual: `ctrl.x/y` → `ctrlPts[segIndex]` ou `loopCtrlPt`; `manual` → `ctrlPtManual[segIndex]` (loop sem flag separada — comportamento preservado); `guides`/`handles` ignorados nesta versão.
- **`getAllSegmentPaths()`** — retorna `getActiveSegments().map(seg => getSegmentPath(seg.index))` com filtragem defensiva de nulos. Preparatório para Modo Mapa/Curvas e editor vetorial de trajetória.

### Integração com helpers existentes

- Os novos helpers usam internamente `getSegmentCurve()`, `setSegmentCurve()`, `isSegmentCurveManual()` e `setSegmentCurveManual()` da camada v8z4b18c/v8z4b18f.
- Nenhum helper existente foi alterado.

### Preparação para o futuro editor vetorial de trajetória

`guides` e `handles` existem apenas como arrays vazios internos. Não salvos no JSON, não usados no motor. No futuro poderão conter pontos de trajetória e handles de tangência para o editor vetorial.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo).
- Velocidade constante, Loop como trecho real, Pausa final, Igualar intervalos.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- Curvas, resetar curva, edição manual de curva.
- UI geral (design, cores, layout).

---

## v8z4b18f — central active segments helper

Refatoração interna: adiciona `getActiveSegments()` como fonte única para trechos ativos do projeto. Nenhuma mudança de comportamento visual, motor, Preview ou MP4.

### O que foi adicionado

- **`getActiveSegments()`** — retorna array com todos os trechos ativos: `{ index, from, to, isLoop, label }`. Sem loop com 3 frames retorna 2 itens (1–2, 2–3); com loop retorna 3 itens (1–2, 2–3, 3–1). Retorna `[]` para `frameCount < 2` sem gerar erro.
- **`getSegmentByIndex(segIndex)`** — retorna o segmento pelo índice ou `null` para índice inválido (negativo, NaN, Infinity, fora do range).
- **`getSegmentLabel(segIndex)`** — retorna o label do trecho como `"1–2"`, `"2–3"`, `"3–1"`. Retorna `''` para índice inválido.

### O que foi atualizado

- **`getActiveSegmentCount()`** — agora delega para `getActiveSegments().length`.
- **`isLoopSegment(segIndex)`** — agora usa `getSegmentByIndex()` internamente.
- **`getSegmentEndpoints(segIndex)`** — agora usa `getSegmentByIndex()` internamente.
- **`openSegBreakdown()`** — usa `getActiveSegments()` para iterar sobre os trechos e gerar as linhas de "Tempo por trecho", incluindo labels e lógica do loop.

### Preparação para o futuro editor vetorial de trajetória

`getActiveSegments()` está documentada como ponto de extensão: no futuro, cada segmento poderá ter um objeto de trajetória próprio com pontos e handles. Este patch não implementa esses recursos.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo).
- Velocidade constante, Loop como trecho real, Pausa final, Igualar intervalos.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- Curvas, resetar curva, edição manual de curva.
- UI geral (design, cores, layout).

---

## v8z4b18e — manual segment duration disables constant speed

Corrige a relação entre Velocidade constante e ajustes manuais de duração por trecho: qualquer edição manual num slider de trecho (incluindo o loop N→1) desliga Velocidade constante imediatamente.

### O que foi corrigido

- **`disableConstantSpeedBecauseManualSegmentEdit()`** — novo helper central que desliga Velocidade constante, limpa `constantSpeedTotalDuration`, sincroniza a UI e exibe status "Velocidade constante desativada".
- **Sliders de trecho no breakdown** — em vez de bloquear a interação quando Velocidade constante está ativa, a edição é agora permitida e aciona o helper.
- **Slider do trecho de loop N→1 no breakdown** — mesmo comportamento; ajuste manual desliga Velocidade constante.
- **Slider "Retorno" (loopDurSlider) na seção Acabamento** — slider nunca estava na lista de sliders desabilitados; agora chama o helper quando Velocidade constante está ativa.
- **Painel ease contextual, trecho loop** — ajuste de duração do loop no painel de easing também desliga Velocidade constante.
- **Painel ease contextual, trecho normal** — código inline substituído pelo helper (comportamento preservado).
- **`distributeSegEqual()` (Igualar intervalos)** — código inline substituído pelo helper (comportamento preservado; mensagem de status própria mantida).
- **`syncTimingModeUI()`** — removido `sl.disabled = isConstant`; sliders permanecem interativos em modo Velocidade constante; opacidade reduzida mantida como hint visual.

### O que NÃO foi alterado

- Slider Total dos trechos (`durSlider`) — manter Velocidade constante ligada ao alterar total é o comportamento correto e permanece intacto.
- Ativar/desativar Loop com Velocidade constante — continua redistribuindo sem desligar o modo.
- Motor de animação, Preview, export MP4/WebCodecs.
- Curvas, helpers de curva, resetar curva, zoom contextual, Movimento/Rotação/Escala Inteligente, UI geral, pontos-guia, handles.
- Schema JSON (nenhum campo novo; estado do modo gravado como antes).

---

## v8z4b18d — include loop in segment duration totals

Corrige o painel Duração para que o trecho N→1 (loop) entre corretamente na contagem de trechos, no total de tempo dos trechos e nas distribuições/ajustes.

### O que foi corrigido

- **`getDurationParts()`** — `loopDuration` agora entra em `moveDur` (Tempo dos trechos) quando loop ativo, e não mais em `finish` (Acabamento). Total permanece idêntico.
- **`syncDurationUI()`** — `moveTotal` passa a usar `parts.moveDur` (inclui loop) em vez de `totalDuration()` (só segmentos normais).
- **slider Total dos trechos** — redistribui `loopDuration` proporcionalmente junto com `segDurations[]` ao arrastar; em modo Velocidade constante, subtrai loop antes de definir `constantSpeedTotalDuration` para evitar dupla contagem.
- **`distributeSegEqual()` (Igualar intervalos)** — distribui tempo igualmente entre todos os trechos ativos (N-1 normais + loop), incluindo atualização do slider de loop.

### O que não foi alterado

- Motor de animação, Preview, export MP4/WebCodecs.
- `totalDuration()` — permanece como soma dos segmentos normais (usado pelo motor).
- `totalDurationFull()` — total final é preservado (motor unaffected).
- Curves, helpers de curva, resetar curva, zoom contextual, Movimento/Rotação/Escala Inteligente, UI geral, design system.

---

## v8z4b18c — curve access helpers without behavior change

Refatoração interna: adiciona camada de helpers para acesso uniforme às curvas por trecho. Nenhuma mudança de comportamento visual, motor, Preview ou MP4.

### O que foi adicionado

- **`getActiveSegmentCount()`** — retorna a quantidade de trechos editáveis ativos (sem loop: `frames.length - 1`; com loop: `frames.length`). Trata `frameCount < 2` sem erro.
- **`isLoopSegment(segIndex)`** — retorna `true` quando `segIndex` representa o trecho de retorno N→1 com loop ativo.
- **`getSegmentEndpoints(segIndex)`** — retorna `{ from, to }` com os índices dos frames do trecho. Retorna `null` para índice inválido.
- **`getSegmentCurve(segIndex)`** — lê o ponto de controle do trecho: usa `ctrlPts[segIndex]` para trechos normais e `loopCtrlPt` para o loop. Não altera dados.
- **`setSegmentCurve(segIndex, curve, options)`** — grava curva no lugar correto: `ctrlPts[segIndex]` ou `loopCtrlPt`. Aceita `options.markManual` para marcar `ctrlPtManual[segIndex]` em trechos normais.
- **`isSegmentCurveManual(segIndex)`** — retorna se a curva do trecho é manual (`ctrlPtManual[segIndex]`). Para loop, retorna `false` (sem flag manual separada no schema atual).
- **`setSegmentCurveManual(segIndex, value)`** — marca/desmarca `ctrlPtManual[segIndex]`. Para loop, preserva comportamento atual (no-op).
- **`resetSegmentCurve(segIndex)`** — reseta curva do trecho para o ponto médio dos frames. Usa os helpers acima internamente.

### O que foi substituído (pontos seguros)

- `startCtrlDrag`: `ctrlPtManual[seg] = true` → `setSegmentCurveManual(seg, true)`.
- `updateCtrlPts`: `ctrlPts[seg]` → `getSegmentCurve(seg)` para leitura da posição do ponto de controle.
- Drag de ponto de controle (`onPointerMove`): writes diretos em `ctrlPts[ctrlDragSeg]` e `loopCtrlPt` → `setSegmentCurve(...)`.
- `resetSelectedSegmentCurve`: lógica de reset inline → `resetSegmentCurve(...)`.

### O que não foi alterado

- Schema do JSON salvo (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`).
- Motor de animação, Preview e export MP4/WebCodecs.
- Renderização visual das curvas e pontos de controle.
- Edição manual de curva, Resetar curva, Loop como trecho real.
- Pausa final, Velocidade constante, Movimento/Rotação/Escala inteligentes.
- Undo/redo, seleção de frames/trechos, zoom contextual.

---

## v8z4b18b — tune contextual zoom trigger

Ajusta o gatilho do zoom contextual de edição: em vez de um limiar fixo em px, o critério agora é proporcional à área visível do Stage (30%).

### O que foi alterado

- **`EDITOR_ZOOM_AUTO_SHOW_RATIO = 0.30`** — substitui `EDITOR_ZOOM_AUTO_SHOW_MIN_PX`. A barra de zoom aparece no modo normal quando `f.w < stageW * 0.30` ou `f.h < stageH * 0.30`.
- **`shouldShowEditorZoom()`** — critério atualizado para comparação proporcional ao Stage. Condição de zoom >100% mantida inalterada (barra permanece visível enquanto editorZoomScale > 1).
- **Remoção da regra de Modo Curvas** — a condição baseada em `panelEase.classList.contains('show')` foi removida pois Modo Curvas não existe ainda. Registrado em comentário para implementação futura.

### O que não foi alterado

- Motor de animação, Preview e export MP4/WebCodecs.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa, JSON).
- Coordenadas reais dos frames e pontos de controle.
- Modo Mapa, pinch zoom, sistema vetorial, pontos-guia.
- Níveis de zoom, clamp de pan, pan mode.

---

## v8z4b18a — contextual editor zoom visibility

Torna a barra de zoom do editor contextual: oculta quando não necessária no modo normal e sempre visível no modo Curvas (painel Easing).

### O que foi adicionado / alterado

- **Visibilidade contextual da barra de zoom** — a barra `#editorZoomCtrl` agora aparece apenas quando faz sentido, evitando poluição visual.
- **Constante `EDITOR_ZOOM_AUTO_SHOW_MIN_PX = 160`** — limiar em px abaixo do qual o frame ativo é considerado "pequeno demais" e dispara a exibição automática do zoom.
- **Helper `shouldShowEditorZoom()`** — avalia três condições: modo Curvas ativo, zoom acima de 100%, ou frame ativo menor que 160 px em algum eixo.
- **Helper `syncEditorZoomCtrlVisibility()`** — aplica a visibilidade no elemento `#editorZoomCtrl` via `style.display`.
- **Modo Curvas** — identificado como painel Easing aberto (`panelEase.classList.contains('show')`). Quando Easing está aberto, zoom fica sempre visível independente do tamanho do frame.
- **Hooks de sincronização** — `syncEditorZoomCtrlVisibility()` chamado em `applyEditorZoom()`, `renderAll()`, `openPanel()` e `closeAll()` para manter o estado correto em qualquer mudança de contexto.
- **Estado inicial oculto** — `#editorZoomCtrl` começa com `display:none` inline; a barra só aparece quando `shouldShowEditorZoom()` retorna true.

### O que não foi alterado

- Motor de animação, Preview e export MP4/WebCodecs.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa, JSON).
- Coordenadas reais dos frames e pontos de controle.
- `screenToStageCoord()` e conversão de coordenadas.
- Pan mode, níveis de zoom, clamp de pan.
- Pinch zoom (não implementado).
- Controles de edição com tamanho fixo de tela (--ez-inv).
- Posição da barra (flutuante no canto superior direito do Stage).

---

## v8z4b17z — fixed-size editor controls during zoom

Corrige o tamanho visual dos controles de edição durante o Zoom de edição. Bordas dos frames, labels, pontos de controle Bézier, handle ciano de escala/rotação e curvas agora mantêm tamanho visual constante independente do nível de zoom.

### O que foi corrigido

- **Bordas dos frames** — `borderWidth` dividido por `editorZoomScale` em `renderAll()`. Em 200% a borda continua visualmente 2–3.5 px como em 100%.
- **Labels/números dos frames** — `transform: scale(var(--ez-inv,1))` com `transform-origin: top left`. O label não cresce junto com o zoom.
- **Handle ciano de escala/rotação** — `transform: scale(1/editorZoomScale)` aplicado inline via `applyEditorZoom()` e `renderAll()`. Tamanho visual constante em qualquer nível.
- **Pontos de controle Bézier (ctrl-pt)** — CSS atualizado para `transform: translate(-50%,-50%) scale(var(--ez-inv,1))`. Visual 14 px, área de toque 42 px, em todos os níveis de zoom.
- **Curvas Bézier** — `stroke-width` e raio das bolinhas centrais divididos por `editorZoomScale` em `drawBezier()`. Linha ativa, linha inativa tracejada e curva de loop mantêm espessura proporcional.
- **Indicador de ângulo** — `transform: translate(-50%,-140%) scale(var(--ez-inv,1))`. Bolinha de ângulo não cresce durante rotação com zoom ativo.
- **CSS variable `--ez-inv`** — definida no elemento `#stage` e atualizada em `applyEditorZoom()`. Todas as regras de affordance usam `var(--ez-inv,1)` como fator compensador.

### O que não foi alterado

- Motor de Preview e export MP4/WebCodecs.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa, JSON).
- Coordenadas reais dos frames e pontos de controle.
- `screenToStageCoord()` e conversão de coordenadas.
- Pan mode, zoom levels, clamp de pan.
- Pinch zoom (não implementado).

---

## v8z4b17y — fix editor zoom toolbar and overlay isolation

Corrige a UX do Zoom de edição introduzido em v8z4b17x sem alterar motor, Preview, MP4 ou dados reais do projeto.

### O que foi corrigido

- **Ícone de mãozinha** — substituído o ícone genérico de mover/deslocar (4 setas) pelo ícone de mão (pan hand), correto para a função de mover a visão.
- **Controles em linha** — botão Mover visão movido para dentro da `ezc-row`, formando uma única linha horizontal: `[ − ] [ 125% ] [ + ] [ 🖐 ]`. Eliminada a quebra de linha anterior.
- **Status/toast fora do zoom** — `#statusBar` movido para fora do `#stage` (agora filho direto de `#imageArea`), garantindo que avisos, toasts e mensagens de status nunca sejam ampliados pelo `transform: scale()` do zoom de edição.
- **Release automático do pan mode** — `editorPanMode` é desligado automaticamente ao abrir qualquer painel inferior (`openPanel()`) ou ao abrir Configurações (`toggleSettingsSheet()`). O zoom e o pan permanecam preservados; apenas o modo mover é desativado.

### O que não foi alterado

- Motor de Preview e export MP4/WebCodecs.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa, JSON).
- Lógica de pan (`clampEditorPan`, `editorPanX`, `editorPanY`).
- Níveis de zoom (ZOOM_LEVELS).
- `screenToStageCoord()` e conversão de coordenadas.
- Pinch zoom (não implementado neste patch).

---

## v8z4b17x — fractional editor zoom and pan mode

Refatora o controle de Zoom de edição do Stage: substitui o botão cíclico inferior por um **controle flutuante** no canto superior direito do Stage, adiciona níveis fracionados (100% → 300% em passos progressivos) e um botão **Mover visão** para navegação da área ampliada sem interferir em frames ou curvas.

### O que foi adicionado / alterado

- **Controle flutuante `#editorZoomCtrl`** — posicionado `top: 8px; right: 8px` dentro do `image-area`, sobre o Stage. Visível apenas com imagem carregada, fora do Preview e fora do export. Composto por três elementos em linha: botão `[−]`, indicador de zoom clicável (`100%`), botão `[+]`, mais botão **Mover** abaixo (oculto quando zoom = 100%).
- **Níveis fracionados**: `[1, 1.25, 1.5, 1.75, 2, 2.5, 3]` (100% a 300%). Substituem o ciclo brusco 1× → 2× → 4×.
- **Botão `[−]`** — reduz ao nível anterior; desabilitado em 100%.
- **Botão `[+]`** — aumenta ao próximo nível; desabilitado em 300%.
- **Indicador de zoom** — exibe o percentual atual (ex: `125%`); toque volta para 100%.
- **Estado `editorPanMode`** — `false` por padrão. Quando `true`, arrastar no Stage move a viewport em vez de editar frames/curvas.
- **Botão Mover** — aparece só quando zoom > 100%; torna-se ativo (tint azul) ao ativar pan mode; toque alterna o modo.
- **Cursor visual**: `grab` quando pan mode ativo e zoom > 1, `grabbing` durante o arraste.
- **Guards de pan mode em todos os handlers de edição**: `startMove`, `startRotate`, `startResize`, `startCtrlDrag`, `globalHandleEl.pointerdown`, frame-element `pointerdown` e ctrl-pt `pointerdown` retornam cedo (sem `stopPropagation`) quando `editorPanMode = true`, permitindo que o evento chegue ao listener de pan do stage.
- **Whitelist atualizada**: `#editorZoomCtrl` adicionado ao `imageAreaCloseHandler` (toque no controle não fecha o menu contextual).

### O que não foi alterado

- Motor de Preview e export MP4/WebCodecs — ignoram completamente `editorZoomScale`.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa).
- JSON de save/load — zoom não é serializado.
- `screenToStageCoord()` — lógica de conversão mantida intacta (BoundingClientRect já reflete transform).
- `clampEditorPan()` — mantido com os mesmos limites.
- Layout geral dos menus inferiores, midBar, toolbar, panels.
- Pinch zoom não implementado.

---

## v8z4b17w — fixed editor zoom levels

Adiciona zoom de edição fixo no Stage com níveis **1× / 2× / 4×**, sem pinch zoom livre. O zoom é apenas uma lupa de visualização: não altera a animação, os frames, o export nem o JSON do projeto.

### O que foi adicionado

- **Botão `#editorZoomBtn`** no canto inferior direito do imageArea, visível apenas com imagem carregada e fora do Preview. Toque cíclico: 1× → 2× → 4× → 1×. Realce visual (tint azul) quando zoom > 1×.
- **Estado interno**: `editorZoomScale` (1 | 2 | 4), `editorPanX`, `editorPanY`. Nunca salvos no JSON do projeto.
- **`applyEditorZoom()`** — aplica `transform: translate(panX, panY) scale(scale)` com `transform-origin: 0 0` no `#stage`. Em 1× remove o transform completamente.
- **`cycleEditorZoom()`** — avança entre os níveis e centraliza automaticamente o zoom no centro do stage.
- **`resetEditorZoom()`** — retorna tudo para 1×/0/0. Chamada ao carregar nova imagem e ao `resetAll()`.
- **`clampEditorPan()`** — limita o pan para que o usuário possa alcançar qualquer borda do stage sem perder o conteúdo da tela.
- **`screenToStageCoord(clientX, clientY)`** — helper central que converte coordenadas de tela para coordenadas do stage considerando zoom e pan. Usado por todos os handlers de arraste.
- **Pan por arraste** em área vazia do stage quando zoom > 1 (pointerdown no stage, sem frame/ctrl-pt/handle). `panDragState` integrado ao sistema global `onMove`/`endDrag`.

### Coordenadas corrigidas

Todos os handlers de interação foram atualizados para usar `screenToStageCoord()` ou a divisão equivalente por `editorZoomScale`:
- `startMove`: cálculo de `grabDX/grabDY` agora em coords do stage.
- `onMove` (ctrl point drag): nx/ny calculados via `screenToStageCoord`.
- `onMove` (rotate): centro do frame convertido para coords de tela com `* editorZoomScale`.
- `onMove` (move): `lx/ly` via `screenToStageCoord`.
- `globalHandleEl.pointermove`: `px/py` e `prevDist` em coords do stage.

### O que não foi alterado

- Motor de Preview e export MP4/WebCodecs — ignoram completamente editorZoomScale.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa).
- JSON de save/load — zoom não é serializado.
- Layout geral dos menus inferiores, midBar, toolbar, panels.
- Pinch zoom não implementado.

---

## v8z4b17u — reset selected segment curve

Adiciona botão **Resetar curva** no painel de easing do trecho selecionado. A ação restaura o ponto de controle do trecho ativo para a posição padrão (midpoint automático entre os dois frames), sem alterar nenhum outro parâmetro.

### O que foi adicionado

- **Botão "Resetar curva"** no `panelEase`, abaixo do botão "Aplicar aos 3". Visível sempre que o painel de trecho/easing está aberto.
- **`resetSelectedSegmentCurve()`** — nova função JavaScript que:
  - Atua apenas no trecho selecionado em `_activeEaseSeg`.
  - Para trecho normal (seg 0 … N-2): define `ctrlPts[seg]` para o midpoint entre os dois frames e `ctrlPtManual[seg] = false`.
  - Para trecho de loop (seg N-1, quando Loop ligado): redefine `loopCtrlPt` para o midpoint entre o último e o primeiro frame.
  - Registra undo antes de alterar estado (compatível com undo/redo existente).
  - Marca projeto como sujo (`markProjectDirty`).
  - Chama `renderAll()` para atualizar visualmente o caminho imediatamente.
  - Exibe mensagem de status com o identificador do trecho.
  - Guards: retorna sem efeito se `frameCount < 2`, se não houver trecho válido selecionado, ou se o trecho de loop for solicitado com Loop desligado.

### O que não foi alterado

- Motor de Movimento Inteligente, Rotação Inteligente, Escala Inteligente.
- Velocidade constante, Loop como trecho real N→1, Pausa final.
- Sistema de load/migração legacy, Preview, export MP4/WebCodecs.
- Stage, frames, rotação, escala, duração, pausas, easing.
- Design system, nova timeline, novo sistema vetorial, seleção múltipla, safe area, menu inferior geral.

---

## v8z4b17t — smart easing defaults for new projects

Projetos novos e resets agora iniciam com `movementEasingMode = "smart"`, `rotationEasingMode = "smart"` e `scaleEasingMode = "smart"`. Projetos salvos respeitam exatamente os valores do JSON. Projetos antigos sem esses campos continuam abrindo em manual/manual/manual para preservar o resultado visual original.

### O que foi alterado

- **Declarações iniciais das variáveis** (`movementEasingMode`, `rotationEasingMode`, `scaleEasingMode`) alteradas de `'manual'` para `'smart'`. Garante que a sessão começa com modos inteligentes ativos antes de qualquer imagem ser carregada.
- **`loadImage` — branch de projeto novo** (`isFirstLoad || frameCount === 0`): adicionada atribuição explícita dos três modos para `'smart'` + chamadas às funções de sincronização de UI (`syncMovementEasingModeUI`, `syncRotationEasingModeUI`, `syncScaleEasingModeUI`). Garante que trocar de imagem em sessão ativa que reinicialize o projeto também restaura os modos inteligentes.
- **`resetAll()`**: já definia os três modos como `'smart'` desde v8z4b17k/v8z4b17q — sem alteração.

### O que não foi alterado

- `applyFrameData` / `migrateLegacyProjectData` — lógica de load de projetos salvos e antigos intacta da v8z4b17s.
- Motor de Movimento Inteligente, Rotação Inteligente, Escala Inteligente, Velocidade constante, Loop como trecho real N→1, Pausa final, painel visual de trecho/easing, design system, cards de easing, Preview/export MP4/WebCodecs, stage, curvas, sistema vetorial, safe area, nova timeline.

### Regras de default

| Situação | movementEasingMode | rotationEasingMode | scaleEasingMode |
|---|---|---|---|
| Projeto novo / primeiro load | smart | smart | smart |
| Reset (`resetAll`) | smart | smart | smart |
| Projeto salvo com campos novos | respeita JSON | respeita JSON | respeita JSON |
| Projeto antigo sem campos novos | manual | manual | manual |

---

## v8z4b17s — legacy project migration cleanup

Saneamento e migração de JSON antigo/misto: impede que campos legacy como `easeMode`, `easeAmount`, `pauseDuration`, `loopEnabled`, `loopDuration` e `finishDuration` continuem influenciando o motor de forma invisível após o load de qualquer projeto.

### Root cause

Em `applyFrameData`, campos legacy eram lidos diretamente para o estado do app sem verificar se campos do schema atual já estavam presentes no JSON. O principal caso problemático: `easeAmount: 1` em um JSON com `movementEasingMode: "manual"` fazia `applyEaseAtEnds()` criar suavização ease-in-out invisível em todos os trechos, pois essa função é chamada incondicionalmente em `getStateAtT`. A UI mostrava "Manual/Linear" mas o motor aplicava easing.

### O que foi adicionado

- **`migrateLegacyProjectData(raw)`** — nova função central executada no início de `applyFrameData`. Retorna cópia do objeto de dados com campos legacy neutralizados/migrados antes de qualquer atribuição ao estado do app. Garante que depois do load apenas o schema atual comanda o motor.

### Regras implementadas

**Easing legacy:**
- Se `movementEasingMode` existe no JSON: `easeAmount` é zerado; `easeMode` é revertido para `'global'`. Sem suavização invisível vinda de `easeAmount`.
- Se `movementEasingMode` não existe (projeto muito antigo): define `movementEasingMode = 'manual'` e `easeAmount = 0`. Sem estado legado paralelo.

**Pausas legacy:**
- Se `framePauses` existe e tem entradas: `pauseDuration` é zerado; `easeMode = 'pause'` é neutralizado. `framePauses` é a fonte de verdade.
- Se `framePauses` não existe: cria array de zeros; neutraliza `pauseDuration` e `easeMode = 'pause'`. Migração de `pauseDuration` para frame específico seria lossy — preferimos zeros seguros.

**Loop / finishMode:**
- Se `finishMode` existe: é a autoridade. `loopEnabled` é alinhado a ele (`'loop'` → `true`, outros → `false`). `finishDuration` não cria pausa final quando `finishMode = 'loop'`.
- Se `finishMode` não existe: migrado de `loopEnabled` legacy: `true` → `finishMode = 'loop'`; `false` → `finishMode = 'none'`.

### Caso testado: `arco_projeto- pausas_img.json`

JSON com `easeMode: "global"`, `easeAmount: 1`, `movementEasingMode: "manual"`, `framePauses` zerados, `finishMode: "loop"`, `loopEnabled: true`, `loopDuration: 1`.

Comportamento esperado após patch:
- `easeAmount` zerado → sem suavização invisível.
- `framePauses` zerados respeitados → sem pausas por frame.
- `finishMode: "loop"` manda → `loopEnabled = true`, trecho 8→1 ativo.
- `finishDuration: 0.8` não vira pausa final.
- Preview sem easing ou pausa invisível.

### Diagnóstico opcional

`window._arcoDebug = true` no console ativa log `[Arco] migrateLegacyProjectData applied` mostrando os campos que foram alterados. Silencioso em produção.

### O que não foi alterado

Motor de Movimento Inteligente, Rotação Inteligente, Escala Inteligente, Velocidade constante, Loop como trecho real N→1, Pausa final como espelho do último frame, painel visual de trecho/easing, design system, cards de easing, Preview/export MP4/WebCodecs, stage, curvas, sistema vetorial, safe area, nova timeline, defaults dos modos inteligentes. Este patch é exclusivamente saneamento de JSON antigo.

---

## v8z4b17r — fix project load segment list normalization

Corrige bug crítico no carregamento de projetos em que a seção Trechos do painel Duração/Tempo ficava sempre vazia após carregar qualquer projeto salvo.

### Root cause

Em `applyFrameData()`, o fim da função chamava `closeSegBreakdown()`, que escondia `#segBreakdown` sem reconstruir as linhas de trecho. Antes disso, `syncDurationUI()` → `syncSegRowsFromState()` tentava atualizar as linhas, mas `#segRows` estava vazio porque `openSegBreakdown()` nunca havia sido chamado após o load.

### O que foi corrigido

- **`applyFrameData`** — Removida a chamada `closeSegBreakdown()` do fim do fluxo de load. Substituída por `syncDurationSectionsUI()`, que chama `openSegBreakdown()` (reconstrói as linhas de trecho com o `frameCount` real), `renderFramePauseRows()` (reconstrói as linhas de pausa) e `syncDurationControlsFromState()`.
- **`segEasings` após load** — Adicionada limpeza e renormalização de `segEasings` durante o load. O array não é persistido em projetos salvos e poderia herdar valores de um projeto anterior com frameCount diferente.
- **`ensureSegDurations` após load** — Chamada explícita após restaurar `segDurations` do JSON, garantindo que valores ausentes ou NaN recebam defaults seguros antes de qualquer render.

### Regra garantida

Com N frames carregados:
- Sem loop: N−1 trechos visíveis na seção Trechos.
- Com loop: N trechos visíveis (inclui trecho N→1).
- Pausas por frame: F1 até FN visíveis.

### O que não foi alterado

Motor de Movimento Inteligente, Rotação Inteligente, Escala Inteligente, Velocidade constante, Loop como trecho real N→1, Pausa final, painel visual de trecho/easing, design system, cards de easing, Preview, export MP4/WebCodecs, stage, curvas, sistema vetorial, menu inferior, safe area, nova timeline.

---

## v8z4b17q — smart rotation and scale easing

Estende o Easing Inteligente já validado para Movimento aos canais Rotação e Escala, com continuidade de velocidade angular/escala entre trechos via Hermite cúbico. Cada canal tem seu próprio modo (`manual` | `smart`) e seu próprio toggle, totalmente independentes entre si.

### O que foi adicionado

- **Estados globais por canal** — `rotationEasingMode` e `scaleEasingMode` (`'manual'` | `'smart'`). Movimento continua em `movementEasingMode`. Projetos novos iniciam todos os três em `'smart'`; projetos salvos respeitam o valor armazenado. JSON antigo sem os campos abre como `'manual'` para preservar comportamento legado.
- **Toggles únicos por aba** — Painel real `panelEase`: aba Rotação ganha toggle `Rotação Inteligente`; aba Escala ganha toggle `Escala Inteligente`. Mesmo padrão de toggle liga/desliga já usado por `Movimento Inteligente` — sem botões duplicados Manual/Inteligente. Mini-painel `segEasePanel` repete o padrão (linhas `segRotEasingModeRow` e `segScaleEasingModeRow`).
- **Motor de continuidade Hermite escalar** — Novas funções `computeSmartRotationT(seg, tt)` e `computeSmartScaleT(seg, tt)`. Para cada trecho calcula `vAvg = delta / duração` (signed). Cada frame intermediário recebe `vStart`/`vEnd` derivados dos vizinhos (com média entre eles, com pausa zerando, e com mudança de sinal entre vizinhos zerando a tangente para evitar overshoot/chicote). Saída: `ttEased ∈ [0,1]` que substitui o `ttRot`/`ttScale` lineares.
- **Auxiliares compartilhados** — `_smartSegmentRotDelta`, `_smartSegmentScaleDelta`, `_smartSegmentDuration`, `_smartSegmentRotVAvg`, `_smartSegmentScaleVAvg`, `_smartFrameScalarVelocity`, `_smartScalarHermiteT`. Núcleo Hermite com clamp Fritsch–Carlson (`α,β ∈ [0,3]`, `α²+β² ≤ 9`) para manter monotonicidade e prevenir overshoot.
- **Integração com Loop N→1** — Quando Loop ativo, o trecho de fechamento N→1 participa da suavização tanto para Rotação quanto para Escala (mesmo padrão já usado por Movimento). Quando Loop desligado, N→1 é ignorado pelos cálculos inteligentes.
- **Integração com `getStateAtT`** — Em modo `'smart'`, `ttScale` e `ttRot` são produzidos pelas novas funções; em modo `'manual'`, continuam vindo de `applyScaleEasingToT`/`applyRotEasingToT`. Valores nos extremos de cada trecho são preservados exatamente. Modos são independentes entre canais.
- **UI contextual** — Quando o canal ativo está em `'smart'`, os cards manuais (Constante/Acelerar/Desacelerar/Suavizar) ficam visíveis porém apagados/inativos, o Globe daquele canal aparece implícito/travado (laranja, sem clique), e o botão "Aplicar aos 3" some. Ao desligar, tudo volta a funcionar normalmente, preservando os easings manuais salvos por trecho.
- **`captureState`/`restoreState`** — `rotationEasingMode` e `scaleEasingMode` participam do undo/redo.
- **`buildProjectData`/`applyFrameData`** — Persistência em JSON com fallback `'manual'` para projetos antigos.
- **`resetAll`** — Reseta também os dois novos modos para `'smart'` (padrão de projeto novo).
- **`syncRotationEasingModeUI`/`syncScaleEasingModeUI`** — UI sincronizada nos pontos onde a UI de Movimento já era sincronizada (`setEasePanelChannel`, `setEaseChannel`, `openSegEasePanel`, `initEasePanel`).
- **`updateSegGlobalButton`** — Refatorado para tratar Globe implícito/travado por canal: cada Globe vira implícito quando o canal correspondente está em `'smart'` E é o canal ativo no painel. Sem cruzamento entre canais.

### Regras de continuidade

- **Pausa manda mais que smart.** Frame com pausa > 0 → velocidade angular/escala = 0 naquele frame. O trecho anterior desacelera até zero; o seguinte sai do zero.
- **Trecho 0.0s = corte seco.** Sem aplicação smart; fallback linear seguro. Nada de NaN/Infinity.
- **Mudança de sentido = tangente zero.** Quando `sign(vPrev) !== sign(vNext)` e ambos não-zero, a velocidade no frame é zerada (anti-overshoot/chicote). Vale para Rotação (inverter sentido) e Escala (zoom in seguido de zoom out).
- **Monotonicidade.** Clamp Fritsch–Carlson nas tangentes (`α,β ∈ [0,3]`, `α²+β² ≤ 9`) limita a ultrapassagem para escala/rotação dentro da janela definida pelos frames.
- **Delta ≈ 0.** Sem variação no trecho → fallback linear (cálculo seria degenerado).
- **Compatibilidade com Velocidade constante.** Velocidade constante define durações; smart usa essas durações; ordem preservada.

### O que não foi alterado

Design system geral, hierarquia visual da v8z4b17n, painel Duração/Tempo, Loop como trecho real N→1 da v8z4b17o, Pausa final espelho do último frame da v8z4b17p, Velocidade constante, motor de cálculo espacial e Movimento Inteligente (salvo compatibilidade natural com os novos canais), WebCodecs/export MP4, stage, curvas, sistema vetorial, nova timeline, seleção múltipla, safe area, menu inferior, cores, cards de easing, estrutura geral dos painéis.

### Compatibilidade

JSON sem `rotationEasingMode`/`scaleEasingMode` carrega em `'manual'` (preserva o easing manual salvo). JSON com os campos respeita os valores. Projetos novos iniciam em `'smart'` para os três canais.

## v8z4b17p — finish timeline sync fixes

Correção de três bugs de sincronização na lógica de Acabamento introduzida na v8z4b17o.

### Bugs corrigidos

- **Bug A — Pausa final segue o último frame atual** — Quando Pausa final está ativa e o usuário adiciona/remove frames, o valor da pausa é transferido automaticamente para o novo último frame. Ao adicionar um frame ao final, o antigo último fica com 0s e o novo último recebe o valor. Ao remover o último frame, o penúltimo herda o valor. `insertFrameAfterActive()` já mantinha o índice correto para inserções no meio. `deleteActiveFrame()` agora também faz o splice correto de `framePauses` (que estava ausente) e transfere a pausa quando o último frame é deletado.

- **Bug B — Velocidade constante redistribui ao ligar/desligar Loop** — `toggleLoop()` e `setFinishing()` passam a chamar `maybeRedistributeByCurveLength()` imediatamente após atualizar o estado. Quando Loop é ligado, o trecho N→1 entra na redistribuição proporcional por comprimento curvo. Quando desligado, os trechos normais são redistribuídos sem o N→1.

- **Bug C — Pausa final desliga quando pausa do último frame vira 0.0s** — Nova função `syncFinishControlsFromTimeline()` verifica `framePauses[lastIdx].duration`; se for 0 com `finishMode === 'pause'`, muda `finishMode` para `'none'` e atualiza a UI. Chamada em: slider de Pausa final (ao arrastar para 0), `setFramePause()` quando o frame editado é o último, `resetAllFramePauses()`, e slider global de pausas.

### Novas funções auxiliares

- `syncFinalPauseToLastFrame(oldLastIdx, newLastIdx)` — transfere a pausa final entre índices quando o último frame muda.
- `syncFinishControlsFromTimeline()` — sincroniza `finishMode` com a realidade de `framePauses[lastIdx]`.

### O que não foi alterado

Conceito da v8z4b17o, Loop como trecho real N→1, painel visual de trecho/easing da v8z4b17n, design system geral, cards de easing, Movimento Inteligente (salvo sincronização com loop já existente), export MP4/WebCodecs, Preview, stage, curvas, sistema vetorial, menu inferior, safe area, nova timeline, seleção múltipla.

### Compatibilidade

Projetos salvos na v8z4b17o continuam abrindo normalmente. A pausa final salva reflete `framePauses[lastFrame]`. Ao carregar, `syncFinishControlsFromTimeline()` garante que o estado visual seja coerente com a timeline real.

## v8z4b17o — loop as closing segment and final pause mirror

Reestruturação da lógica de Acabamento: Loop passa a representar o trecho real de fechamento N→1 na timeline, com duração, easing e curva próprios. Pausa final passa a espelhar diretamente `framePauses[últimoFrame]`, eliminando o tempo paralelo artificial.

### O que foi alterado

- **Loop = trecho de fechamento N→1** — Quando Loop ativo, o trecho `N→1` (último frame → primeiro frame) entra na timeline com duração própria (`loopDuration`). Antes era apenas um ajuste separado sem presença real na lista de trechos.
- **Trecho N→1 aparece na lista de Trechos** — `openSegBreakdown()` adiciona linha `N–1` com slider editável quando Loop ativo. Sincroniza bidirecionalmente com o slider do Acabamento.
- **Easing próprio do trecho N→1** — Novos estados `loopSegEasing`, `loopSegRotEasing`, `loopSegScaleEasing`. `getSegEase()/getRotEase()/getScaleEase()` retornam os valores corretos para `seg === frameCount - 1` quando Loop ativo. `selectSegEase()` e `applyEaseAllChannels()` escrevem nesses estados.
- **Pausa final = espelho de `framePauses[lastFrame]`** — `getDurationParts()` não soma mais `finishDuration` separadamente quando `finishMode === 'pause'`. A pausa já está contabilizada em `internalPauses` via `framePauses`. `setFinishing('pause')` adiciona 1.0s ao último frame se ainda estava em 0.
- **`initFinishSlider()`** — Quando `finishMode === 'pause'`, o slider escreve em `framePauses[lastIdx]` diretamente, não em `finishDuration`. Também atualiza a linha correspondente nas Pausas por frame.
- **`syncFinishingUIFromState()`** — Quando `finishMode === 'pause'`, lê `framePauses[frameCount-1].duration` como valor do slider (não mais `finishDuration`). Guard de parseFloat previne interrupção de drag.
- **`getSegAndLocalTAtTime()`** — Removida a zona especial de `finishMode === 'pause'` após o último frame: a pausa já é tratada normalmente por `framePauses[normalSegs]`.
- **`getStateAtT()`** — `finishExtra` não inclui mais `finishMode === 'pause'` (sem zona de acabamento separada para pausa final).
- **Ease pill na faixa de frames** — `updateFrameSelector()` adiciona ease pill para o trecho N→1 após o último frame quando Loop ativo.
- **Movimento Inteligente com loop** — `_smartFrameVelocity()` considera o trecho de fechamento como vizinho do primeiro e do último frame. `computeSmartMovementProgress()` tem branch dedicado para `seg === frameCount - 1` quando Loop ativo.
- **Velocidade constante com loop** — `redistributeDurationsByCurveLength()` inclui comprimento do trecho N→1 na redistribuição e escala `loopDuration` proporcionalmente.
- **`measureLoopCurveLength()`** — Nova função que mede o comprimento curvo real do trecho N→1 usando a mesma geometria Bézier do motor.
- **`buildProjectData()`** — Passa a salvar explicitamente `finishMode`, `finishDuration`, `loopCtrlPt`, `loopSegEasing`, `loopSegRotEasing`, `loopSegScaleEasing`.
- **`applyFrameData()`** — Restaura `finishMode`, `finishDuration`, `loopCtrlPt`, `loopSegEasing*`. Migração de JSON antigo: se `finishMode === 'pause'` e `finishDuration > 0` e último frame com pausa 0, migra para `framePauses[lastFrame]`.
- **`updateDurationUI()`** — Pausa final exibe `framePauses[frameCount-1].duration` em vez de `finishDuration`.
- **undo/redo** — `captureState()/restoreState()` incluem `loopSegEasing*`.
- **`resetAll()`** — Reseta `loopSegEasing*` para `'linear'`.
- **Versão** — `APP_VERSION` → `v8z4b17o`, `APP_VERSION_NAME` → `loop as closing segment and final pause mirror`.

### O que não foi alterado

Design system geral, visual dos cards de easing, hierarquia visual resolvida na v8z4b17n, sistema vetorial de curvas, stage, safe area, menu inferior geral, nova timeline, seleção múltipla, WebCodecs/export MP4 (sem breaking changes).

### Compatibilidade

JSON antigo com `finishMode: 'pause'` e `finishDuration > 0` é migrado automaticamente para `framePauses[lastFrame]` sem duplicação. Projetos sem loop ou pausa final carregam sem alteração.

## v8z4b17n — duration movement hierarchy and connected tabs

Correção da hierarquia visual do painel real de trecho/easing: título do segmento centralizado, Duração e Movimento com mesmo valor gráfico de seção, abas Velocidade/Rotação/Escala com continuidade visual ao conteúdo ativo.

### O que foi alterado

- **Título do segmento centralizado** — `SEG. 2–3` (elemento `panelEaseTitle`) passa a ser centralizado horizontalmente no painel, marcando hierarquia superior ao conteúdo editável abaixo.
- **DURAÇÃO como seção equivalente a MOVIMENTO** — Antes, `Duração` aparecia como pequeno label ao lado do slider. Agora, usa o mesmo estilo de label de seção (`ease-section-label`) e o slider fica dentro de um bloco `ease-dur-block` com `background:#3a3a3c` e `border-radius:12px`, idêntico visualmente ao conteúdo ativo do bloco Movimento.
- **Abas reais com continuidade** — `.ease-tab` recebe `border-radius:8px 8px 0 0` (topo arredondado, base reta). `.ease-tab-content` usa `background:#3a3a3c` e `border-radius:0 0 12px 12px`. O container `.ease-channel-block` tem `overflow:hidden` e `border-radius:12px`, garantindo que aba ativa e conteúdo formem bloco contínuo visualmente.
- **Abas inativas recuadas** — Fundo `var(--surface2)` (#2c2c2e), discretamente mais escuro que a aba ativa/conteúdo (#3a3a3c). Tab bar usa o fundo do painel (`var(--surface)`) como separador natural entre abas.
- **Novos estilos CSS** — `.ease-section-label`, `.ease-dur-block`, `.ease-channel-block`, `.ease-tab-content` adicionados. Anteriores `.ease-tabs-bar` e `.ease-tab` ajustados.
- **Versão** — `APP_VERSION` → `v8z4b17n`, `APP_VERSION_NAME` → `duration movement hierarchy and connected tabs`.

### O que não foi alterado

Motor do Movimento Inteligente, cálculo Hermite, Velocidade constante, easing de Velocidade/Movimento, easing de Rotação, easing de Escala, cards Constante/Acelerar/Desacelerar/Suavizar, toggle Movimento Inteligente, ícone Global contextual, Preview, export MP4, WebCodecs, loop, pausas, duração funcional, stage, curvas, sistema vetorial, seleção múltipla, menu inferior, safe area, timeline, JSON.

### Compatibilidade

Nenhuma mudança de estrutura de dados. Todos os projetos existentes carregam sem alteração.

## v8z4b17m — real channel tabs and velocity naming

Correção da hierarquia visual do painel de trecho/easing e renomeação do canal de movimento.

### O que foi alterado

- **Renomeação de canal** — A aba `Movimento` dentro da barra de canais passa a se chamar `Velocidade`. O título `Movimento` é mantido como nome da seção acima da barra.
- **Hierarquia visual da barra de abas** — A aba ativa agora usa `background:#3a3a3c` (mais claro que a faixa `--surface2` = #2c2c2e), criando hierarquia legível: painel(#1c1c1e) → faixa(#2c2c2e) → aba-ativa(#3a3a3c). Antes, a aba ativa usava `var(--surface)` = #1c1c1e, idêntico ao fundo do painel.
- **Cor da aba ativa** — Texto branco (`#fff`) em vez de `var(--accent)`, com fundo sólido destacado. Aba inativa mantém texto em `rgba(174,174,178,0.75)` (discreto, mas legível).
- **Abas inativas mais discretas** — `color:rgba(174,174,178,0.75)` com `font-weight:500`, sem fundo.
- **Label de seção "Movimento"** — Adicionado acima da faixa de abas, em `font-size:10px`, uppercase, `color:var(--text3)`. Dá contexto sem poluir.
- **Mini-painel `segEasePanel`** — Botão do canal `movement` também renomeado para `Velocidade`.
- **CSS** — `.ease-tab` recebe `text-align:center` e `transition` ajustado para `.18s`. `.ease-tab-active` atualizado.
- **Versão** — `APP_VERSION` → `v8z4b17m`, `APP_VERSION_NAME` → `real channel tabs and velocity naming`.

### O que não foi alterado

Motor do Movimento Inteligente, cálculo Hermite, Velocidade constante, easing de Rotação, easing de Escala, toggle Movimento Inteligente, ícone Global contextual, cards Constante/Acelerar/Desacelerar/Suavizar, Preview, export MP4, WebCodecs, loop, pausas, duração, stage, curvas, sistema vetorial, seleção múltipla, menu inferior, safe area, timeline, JSON.

### Compatibilidade

Nenhuma mudança de estrutura de dados. Todos os projetos existentes carregam sem alteração.

## v8z4b17l — channel tabs and smart movement toggle

Reorganização visual do painel de easing para transformar Movimento/Rotação/Escala em abas reais, substituir o par de botões Manual/Inteligente por um único toggle switch e tornar o ícone Global contextual à aba ativa.

### O que foi alterado

- **Abas reais de canal** (`panelEase`) — Movimento/Rotação/Escala agora usam `.ease-tabs-bar` + `.ease-tab` em vez de botões com borda pill. Aba ativa recebe `.ease-tab-active` com cor accent e fundo destacado.
- **Toggle único Movimento Inteligente** — Removidos os botões `Manual` / `Inteligente`. Substituídos por um switch iOS-style (`<label class="smart-toggle">`). Label clicável ao lado do toggle. Mesmo padrão no mini-painel `segEasePanel`.
- **Ícone Global contextual por aba** — Removido do cabeçalho do painel. Cada aba tem sua própria instância: `easeGlobeLock` (Movimento), `easeGlobeRot` (Rotação), `easeGlobeScale` (Escala). Mostrado na linha de ações da aba ativa.
- **Global implícito quando Inteligente ON** — No canal Movimento com Inteligente ativo, o globe recebe `.global-implicit` (laranja, opacidade reduzida, sem pointer-events), indicando que o modo já é global por natureza.
- **Linhas de ações por aba** — `movChannelActions` (toggle + globe), `rotChannelActions` (apenas globe), `scaleChannelActions` (apenas globe). Exibição controlada por `_syncEaseChannelUI()`.
- **`updateSegGlobalButton()`** — Atualizada para sincronizar os três globes (`easeGlobeLock`, `easeGlobeRot`, `easeGlobeScale`) e aplicar `.global-implicit` ao globe de Movimento quando adequado.
- **`_syncEaseChannelUI()`** — Usa `.ease-tab-active` class em vez de inline styles para o painel principal. Mostra/oculta linhas de ações das abas.
- **`syncMovementEasingModeUI()`** — Reescrita: sincroniza toggle checkbox (principal e mini-painel), chama `updateSegGlobalButton()`, subordina chips, controla "Aplicar aos 3". Remove lógica de botão duplo.
- **`setMovementEasingModeFromToggle(checked)`** — Nova função wrapper para o handler `onchange` do toggle.
- **Dica curta removida** — `movSmartHint` removido do HTML (informação inline não era necessária após a melhora visual).
- **CSS** — `.ease-tabs-bar`, `.ease-tab`, `.ease-tab-active`, `.smart-toggle`, `.smart-toggle-track`, `.global-implicit` adicionados.
- **Versão** — `APP_VERSION` → `v8z4b17l`, `APP_VERSION_NAME` → `channel tabs and smart movement toggle`.

### O que não foi alterado

Motor do Movimento Inteligente, cálculo Hermite, Velocidade constante, easing de Rotação, easing de Escala, Preview, export MP4, WebCodecs, loop, pausas, duração, stage, curvas, sistema vetorial, seleção múltipla, menu inferior, safe area, timeline, indicadores visuais de easing, JSON (estrutura de dados inalterada).

### Compatibilidade

- Projetos antigos sem `movementEasingMode` → carregam como `'manual'` (sem mudança visual).
- Projetos salvos com `movementEasingMode: 'smart'` → carregam corretamente em Inteligente.
- Projetos salvos com `movementEasingMode: 'manual'` → carregam corretamente em Manual.
- Novos projetos (reset/imagem nova) → iniciam em Inteligente.

## v8z4b17k — clean smart movement panel

Reorganização visual do painel de easing para reduzir o excesso de pílulas e comunicar com clareza que **Movimento Inteligente** é um modo do canal Movimento — não um controle independente.

### O que foi alterado

- **Padrão para projetos novos** — `movementEasingMode` agora inicia como `'smart'` em `resetAll()`. Projetos antigos sem `movementEasingMode` no JSON continuam carregando em `'manual'` (retrocompatível).
- **Linha de modo condicional** — `movEasingModeRow` (e `segMovEasingModeRow` no mini-painel) só aparecem quando o canal **Movimento** está selecionado. Para Rotação e Escala, a linha some — sem pílulas extras.
- **Abas de canal mais discretas** (`panelEase`) — botões Movimento/Rotação/Escala agora usam `background:transparent` e `color:var(--text3)` quando inativos, reduzindo o peso visual. O mini-painel (`segEasePanel`) mantém o estilo pílula original.
- **Rótulo limpo** — "Movimento Inteligente" como texto corrido + dois botões compactos `Manual` / `Inteligente`, sem o rótulo em caixa-alta anterior.
- **"Aplicar aos 3" oculto em modo Inteligente** — `applyAllChannelsWrap` e `segApplyAllWrap` ficam com `display:none` quando `movementEasingMode === 'smart'`. Voltam ao normal em modo Manual.
- **Dica curta** — texto reduzido para "Continuidade automática entre trechos." (era uma frase longa explicando canais).
- **Modo Inteligente no mini-painel** — `segEasePanel` ganhou a linha `segMovEasingModeRow` com botões `segMovEaseMode_manual` / `segMovEaseMode_smart`, sincronizados pelos mesmos handlers existentes.
- **`_syncEaseChannelUI`** — diferencia o estilo inativo entre mini-painel (`var(--text2)`, weight 500) e painel principal (`var(--text3)`, weight 400).
- **`syncMovementEasingModeUI`** — expandida para controlar: visibilidade das linhas de modo, botões de ambos os painéis, chips, wrappers de "Aplicar aos 3" e dica.
- **Versão** — `APP_VERSION` → `v8z4b17k`, `APP_VERSION_NAME` → `clean smart movement panel`.

### O que não foi alterado

Motor do Movimento Inteligente, cálculo Hermite, Velocidade constante, easing de Rotação, easing de Escala, Preview, export MP4, WebCodecs, loop, pausas, duração, stage, curvas, sistema vetorial, seleção múltipla, menu inferior, safe area, timeline, indicadores visuais de easing.

### Compatibilidade

- Projetos antigos sem `movementEasingMode` → carregam como `'manual'` (sem mudança visual).
- Projetos salvos com `movementEasingMode: 'smart'` → carregam corretamente em Inteligente.
- Projetos salvos com `movementEasingMode: 'manual'` → carregam corretamente em Manual.
- Novos projetos (reset/imagem nova) → iniciam em Inteligente.

---

## v8z4b17j — smart movement easing experiment

Versão **experimental** que adiciona um modo opcional de **Easing Inteligente** apenas para o canal **Movimento**. O comportamento padrão continua sendo `Manual`; nada muda visualmente em projetos antigos.

### Conceito

`Easing Inteligente` é um modo automático de continuidade de velocidade entre trechos vizinhos. Em cada frame intermediário, a velocidade média do trecho anterior é casada com a velocidade média do trecho seguinte, criando uma transição suave (Hermite cúbica) em vez do "tranco" que aparece quando dois trechos têm velocidades médias muito diferentes.

- Pausa no frame  → velocidade no frame é `0` (desacelera até parar; sai do zero).
- Trecho `0.0s`   → corte seco (não tenta aplicar smart; sem NaN/Infinity).
- Primeiro/último frame → fallback com a velocidade média do próprio trecho.
- Rotação e Escala continuam usando seus próprios `rotEasings` / `scaleEasings` — Inteligente atua **somente** sobre Movimento.

### O que foi alterado

- **Novo estado `movementEasingMode`** — `'manual' | 'smart'`, default `'manual'`. Persiste em JSON (`buildProjectData` / `loadProjectFromJson`), entra no `captureState` / `restoreState` (undo/redo) e no `resetAll`.
- **Novo cálculo `computeSmartMovementProgress(seg, tt)`** — Hermite cúbica com `p0=0`, `p1=curveLen`, `m0=vStart`, `m1=vEnd`, `Δ=dur`; reaproveita `measureSegmentCurveLength()` do modo Velocidade constante. Velocidades de extremidade limitadas a `3·vAvg` para manter monotonicidade.
- **`getStateAtT()`** — quando `movementEasingMode === 'smart'`, `ttEased` vem de `computeSmartMovementProgress` em vez de `applySegEasingToT`. Toda a cadeia seguinte (`mapProgressToBezierU` → `bezierPointAt`) é a mesma; rotação e escala usam seus easings próprios como antes.
- **UI mínima no painel `panelEase`** — uma linha compacta `Movimento [ Manual ] [ Inteligente ]` logo abaixo do seletor de canal. Quando `Inteligente` está ativo e o canal selecionado é Movimento, os chips `Constante/Acelerar/Desacelerar/Suavizar` ficam subordinados (`opacity 0.4`, `pointer-events:none`) e aparece um aviso `Movimento em modo Inteligente: continuidade automática…`.
- **Sincronização** — `setMovementEasingMode`, `syncMovementEasingModeUI`, integrações em `setEaseChannel`, `setEasePanelChannel`, `initEasePanel` e nas restaurações de `restoreState`, `resetAll`, `loadProjectFromJson`.
- **Versão** — `APP_VERSION` → `v8z4b17j`, `APP_VERSION_NAME` → `smart movement easing experiment`; cabeçalho HTML, comentário de versão do arquivo e `Configurações` atualizados.

### O que não foi alterado

Sistema vetorial de curvas, edição visual das curvas, handles, stage, timeline, redesign do painel Duração/Tempo, indicadores visuais de easing, menu inferior, safe area, play, seleção múltipla, rotação inteligente, escala inteligente, cores, ícones, layout geral. Rotação e Escala continuam respeitando `rotEasings` / `scaleEasings` independentemente do modo de Movimento. `segEasings` continuam salvos no JSON — apenas são ignorados durante o cálculo espacial enquanto `smart` estiver ativo.

### Interação com Velocidade constante

`Velocidade constante` continua distribuindo `segDurations` por comprimento curvo **antes** do cálculo de Movimento. O `Easing Inteligente` lê essas durações já distribuídas para calcular `vAvg`. Quando ambos estão ativos, as velocidades médias dos trechos tendem a se igualar, o que faz a Hermite degenerar para linear — exatamente o comportamento esperado (Velocidade constante já entrega a transição contínua).

### Compatibilidade

Retrocompatível com projetos `v8z4b17i` e anteriores. Projetos antigos que não contêm `movementEasingMode` no JSON são carregados como `'manual'` — comportamento idêntico ao da v8z4b17i. Nenhuma promoção automática para `main` está prevista nesta versão experimental.

---

## v8z4b17i — duration panel always expanded

Ajuste de UX no painel Duração/Tempo: todas as seções (Trechos, Pausas por frame e Acabamento) ficam sempre abertas. O comportamento de recolher/expandir foi removido.

### O que foi alterado

- **`durationPanelSections`** — estado inicial de `finish` alterado de `false` para `true`; todos os valores agora são `true`.
- **`toggleDurationSection()`** — função convertida em no-op; cliques nos títulos não alteram mais o estado das seções.
- **`syncDurationSectionsUI()`** — simplificada para sempre exibir todas as seções (sem verificar booleanos); sempre chama `openSegBreakdown()`, `renderFramePauseRows()` e `syncDurationControlsFromState()`.
- **HTML títulos das seções** — `<button onclick="toggleDurationSection(...)">` substituído por `<div>` sem handler, eliminando o comportamento interativo dos cabeçalhos.
- **HTML `#finishSection`** — atributo inline `display:none` alterado para `display:block`; seção Acabamento já aparece visível antes do JS carregar.
- **CSS `.dur-section-header`** — `cursor:pointer` alterado para `cursor:default`; título não sinaliza mais interatividade.
- **CSS `.dur-section-chevron`** — `display:none`; chevrons/setas de accordion ocultados.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17i`.

### Comportamento após esta versão

| Situação | Resultado |
|---|---|
| Abrir painel Duração/Tempo | Trechos, Pausas por frame e Acabamento já aparecem abertos |
| Tocar nos títulos das seções | Nenhuma alteração visual ou de estado |
| Alterar qualquer valor do painel | Seções não recolhem |
| Fechar e reabrir o painel | Todas as seções continuam abertas |

### O que não foi alterado

Motor de animação, preview, export MP4, WebCodecs, cálculo de velocidade constante, easing por canal, Aplicar aos 3, modo global, Igualar intervalos, lógica de pausas e trechos, loop, acabamento, stage, menus, scroll do painel, controles internos das seções.

### Compatibilidade

Retrocompatível com projetos v8z4b17h e anteriores.

---

## v8z4b17h — duration sections stay expanded

Ajuste de UX no painel Duração/Tempo: as seções Trechos e Pausas por frame abrem expandidas por padrão e permanecem abertas durante toda a sessão.

### O que foi alterado

- **`durationPanelSections`** — estado inicial de `segments` e `pauses` alterado de `false` para `true`; a seção Acabamento (`finish`) permanece fechada por padrão.
- **HTML inicial** — `#segBreakdown` e `#framePauseSection` agora têm `display:flex` no atributo inline, e o chevron de Pausas por frame inicia com `▾`, evitando flash de conteúdo errado antes do JS carregar.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17h`.

### Comportamento após esta versão

| Situação | Resultado |
|---|---|
| Abrir painel Duração/Tempo | Trechos e Pausas por frame já aparecem expandidos |
| Fechar e reabrir o painel | Trechos e Pausas por frame continuam expandidos |
| Alterar qualquer valor do painel | Seções não recolhem automaticamente |
| Seção Acabamento | Mantém comportamento anterior (fechada por padrão) |

### O que não foi alterado

Motor de animação, preview, export MP4, WebCodecs, cálculo de velocidade constante, easing por canal, Aplicar aos 3, modo global, Igualar intervalos, lógica de pausas e trechos, loop, acabamento, stage, menus, scroll do painel.

### Compatibilidade

Retrocompatível com projetos v8z4b17g e anteriores.

---

## v8z4b17g — constant speed manual override state fix

Corrige inconsistências de estado do modo **Velocidade constante** após ações manuais de tempo.

### O que foi alterado

- **`distributeSegEqual()`** — ao clicar em "Igualar intervalos", o app agora muda para `segmentTimingMode = 'manual'` e limpa `constantSpeedTotalDuration`; botão Velocidade constante desliga imediatamente.
- **Ease panel (`easePanelSegSlider`) — handler `input`** — ao editar a duração individual de um trecho pelo painel contextual enquanto Velocidade constante está ativa, o modo muda automaticamente para Manual, os tempos ficam congelados e não há redistribuição.
- **Loop** — confirmado que `redistributeDurationsByCurveLength()` opera apenas sobre `segDurations[0..segs-1]`; `loopDuration` permanece separado e inalterado.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17g`.

### Regras de estado após esta versão

| Ação | Resultado |
|---|---|
| Ativar Velocidade constante | redistribui trechos por percurso curvo |
| Alterar tempo total (slider Total) | redistribui proporcionalmente (modo permanece ativo) |
| Mover frame / curva / inserir / remover frame | redistribui (modo permanece ativo) |
| "Igualar intervalos" | distribui igualmente, **muda para Manual** |
| Editar trecho individual (ease panel) | congela tempos, **muda para Manual** |
| Desligar Velocidade constante | tempos congelados, modo Manual |

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, durSlider total, sliders de `#segRows` desabilitados em constant-speed, easing de movimento/rotação/escala, blur, pausas, loop, acabamento, stage, menus.

### Compatibilidade

Retrocompatível com projetos v8z4b17f e anteriores.

---

## v8z4b17f — constant speed timing by curve length

Implementa modo persistente de distribuição de tempo por velocidade média constante, calculado pelo comprimento real da curva de cada trecho.

### O que foi alterado

- **Estado global** — adicionados `segmentTimingMode` (`'manual'` | `'constant-speed'`) e `constantSpeedTotalDuration`.
- **HTML `#segBreakdown`** — novo seletor de modo **Manual / Velocidade constante** inserido na seção de Trechos, antes dos sliders individuais; botões em estilo chip; dica discreta "Distribui o tempo conforme o percurso curvo." visível apenas no modo ativo.
- **`measureSegmentCurveLength(segIndex)`** — nova função que amostra 64 pontos ao longo da curva Bézier real do trecho (mesma geometria do motor) e retorna o comprimento em pixels do stage.
- **`redistributeDurationsByCurveLength()`** — nova função que distribui `constantSpeedTotalDuration` proporcionalmente aos comprimentos curvos; trechos com `0.0s` permanecem zerados (cortes secos); sanitiza NaN/Infinity.
- **`maybeRedistributeByCurveLength()`** — aciona redistribuição apenas quando o modo está ativo; chamada após eventos de geometria (mover frame, redimensionar, mover curva, inserir/remover frame, alterar total).
- **`setSegmentTimingMode(mode)`** — define o modo, salva undo, inicia redistribuição ao ativar e sincroniza a UI.
- **`syncTimingModeUI()`** — sincroniza botões de modo e desabilita/habilita sliders individuais conforme o modo ativo.
- **`endDrag()`** — agora chama `maybeRedistributeByCurveLength()` ao final de qualquer drag de frame ou curva.
- **`addFrame()`, `insertFrameAfterActive()`, `removeLastFrame()`** — chamam `maybeRedistributeByCurveLength()` ao finalizar.
- **`durSlider` input handler** — em modo `constant-speed`, atualiza `constantSpeedTotalDuration` e redistribui em vez de escalar proporcionalmente.
- **`openSegBreakdown()`** — chama `syncTimingModeUI()` ao montar as linhas, refletindo estado correto dos sliders.
- **Sliders individuais de trecho** — `input` handler recusa alteração quando modo `constant-speed` está ativo; visualmente desabilitados (opacity 0.4).
- **`buildProjectData()`** — persiste `segmentTimingMode` e `constantSpeedTotalDuration` no JSON.
- **`applyFrameData()`** — restaura `segmentTimingMode` e `constantSpeedTotalDuration`; projetos antigos recebem `'manual'`.
- **`captureState()` / `restoreState()`** — incluem `segmentTimingMode` e `constantSpeedTotalDuration` no undo/redo.
- **`resetAll()`** — redefine `segmentTimingMode = 'manual'` e `constantSpeedTotalDuration = null`.
- **`syncApplyAllChannelsButtonState()`** — corrigido para não manter o botão "Aplicar aos 3" ligado de forma persistente; sempre retorna ao estado neutro (v8z4b17f).
- **`applyEaseAllChannels()`** — adicionado flash momentâneo (700ms) no botão "Aplicar aos 3" após ação, voltando ao estilo neutro.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17f`.

### Comportamento do modo Manual

- Preserva o comportamento anterior completo.
- Sliders individuais editáveis.
- App não recalcula tempos automaticamente.

### Comportamento do modo Velocidade constante

- O usuário define o total via slider **Total**; o app redistribui proporcionalmente ao comprimento curvo.
- Trechos com `0.0s` (cortes secos) permanecem zerados e excluídos da distribuição.
- Redistribuição automática a cada: mover frame, mover curva, inserir/remover frame, alterar total.
- Ao desligar, os tempos calculados ficam congelados e o modo volta para Manual.

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, curvas Catmull-Rom, pausas por frame, loop, acabamento, menus, safe area, stage, easing, blur, seleção múltipla.

### Compatibilidade

Projetos antigos (sem `segmentTimingMode`) abrem em modo **Manual** sem recalculo.

---

## v8z4b17e — apply all channels active state

Adiciona feedback visual ao botão **Aplicar aos 3** no painel de edição de trecho (`#panelEase`).

### O que foi alterado

- **HTML `#panelEase`** — adicionado `id="btnApplyAllChannels"` ao botão **Aplicar aos 3** (v8z4b17e).
- **`syncApplyAllChannelsButtonState()`** — nova função que lê `segEasings[seg]`, `rotEasings[seg]` e `scaleEasings[seg]` do trecho ativo e destaca o botão (borda e texto em `var(--accent)`) quando os três valores são iguais; restaura estilo neutro caso contrário.
- **`initEasePanel()`** — chama `syncApplyAllChannelsButtonState()` após `_syncEaseChannelUI()`, garantindo atualização automática ao abrir o painel, trocar de canal, aplicar easing individual, aplicar aos 3 e carregar projeto.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17e`.

### Comportamento do botão

- **Ativo** (borda + texto `var(--accent)`): quando `segEasings[seg] === rotEasings[seg] === scaleEasings[seg]`.
- **Inativo** (estilo neutro): quando os três canais diferem.
- O estado é recalculado automaticamente ao abrir outro segmento, trocar de canal, alterar um canal individualmente ou carregar JSON.

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, cálculo de duração, pausas, curvas,
posição, rotação, escala, stage, menus, safe area, `segEasePanel` original,
modo global, comportamento funcional do botão Aplicar aos 3.

### Compatibilidade

Nenhuma alteração nos dados persistidos. Projetos antigos abrem normalmente.

---

## v8z4b17d — apply easing to all channels

Adiciona o botão **Aplicar aos 3** no painel real de edição de trecho (`#panelEase`),
permitindo aplicar em um clique o easing atualmente selecionado aos três canais
(**Movimento / Rotação / Escala**) do trecho ativo.

### O que foi alterado

- **HTML `#panelEase`** — novo botão compacto `Aplicar aos 3` inserido entre o
  seletor de canal e o grid de cards de easing (v8z4b17d).
- **`applyEaseAllChannels()`** — nova função que lê o easing atual do canal ativo
  via `_getActiveChannelEase(seg)` e o escreve em `segEasings[seg]`,
  `rotEasings[seg]` e `scaleEasings[seg]`; chama `pushUndo()` antes de modificar
  e `initEasePanel()` após para refletir o estado nos cards de cada canal.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17d`.

### Comportamento do botão

- Lê o easing do canal **atualmente ativo** no painel (Movimento, Rotação ou
  Escala) para o segmento aberto.
- Aplica esse easing **apenas ao trecho atual** — não altera outros segmentos.
- Não interfere com o modo global (globo/cadeado), que continua funcionando como antes.
- Após aplicar, alternar entre os canais mostra todos com o mesmo card ativo.

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, cálculo de duração, pausas, curvas,
posição, rotação, escala, stage, menus, safe area, seleção múltipla,
`segEasePanel` original, modo global.

### Compatibilidade

Projetos antigos continuam abrindo normalmente. O botão apenas escreve nos arrays
existentes (`segEasings`, `rotEasings`, `scaleEasings`).

---

## v8z4b17c — show channel easing in segment panel

Expõe o seletor de canal (**Movimento / Rotação / Escala**) diretamente no painel
real de edição de trecho (`#panelEase`), o mesmo painel que o usuário acessa no
fluxo normal e que exibe o título **SEG. 1-2**, o slider de Duração e os cards
Constante / Acelerar / Desacelerar / Suavizar.

### O que foi alterado

- **HTML `#panelEase`** — três botões `easePanelCh_movement / rotation / scale`
  inseridos como uma linha compacta acima do grid de cards de easing.
- **`initEasePanel()`** — agora lê o easing atual via `_getActiveChannelEase(seg)`
  (respeitando o canal ativo) e chama `_syncEaseChannelUI()` para destacar o
  botão de canal correto ao abrir ou atualizar o painel.
- **`selectSegEase(ease, seg)`** — agora escreve em `segEasings`, `rotEasings`
  ou `scaleEasings` dependendo de `_activeEaseChannel`; a verificação de
  redundância também usa `_getActiveChannelEase`.
- **`_syncEaseChannelUI()`** — passa a sincronizar também os botões
  `easePanelCh_*` do `#panelEase`, além dos `easeCh_*` do `segEasePanel`.
- **`setEasePanelChannel(ch)`** — nova função chamada pelos botões do `#panelEase`;
  delega para `_syncEaseChannelUI()` + `initEasePanel()`.

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, cálculo de duração, pausas, posição,
curvas, stage, menus, safe area, play, seleção múltipla, `segEasePanel` original.

### Compatibilidade

Projetos antigos continuam abrindo normalmente; arrays ausentes recebem `'linear'`.

---

## v8z4b17b — channel easing controls

Seletor de canal no painel de easing existente: permite escolher entre
**Movimento**, **Rotação** e **Escala** e ajustar o easing de cada canal
independentemente para o segmento ativo. Adiciona `scaleEasings` (N−1 entradas)
para controle de zoom/tamanho separado do movimento espacial. Compatibilidade
total com projetos antigos (campos ausentes preenchidos com `'linear'`).

### O que foi adicionado

- **`scaleEasings`** — array por segmento para easing de escala (w/h),
  paralelo a `segEasings` e `rotEasings`. Padrão: `'linear'`.
- **`ensureScaleEasings()`** / **`getScaleEase(seg)`** / **`applyScaleEasingToT(t, ease)`**
  — helpers de escala seguindo o mesmo padrão dos canais anteriores.
- **`_activeEaseChannel`** — estado local do painel: `'movement'` | `'rotation'` | `'scale'`.
- **`setEaseChannel(ch)`** — troca o canal ativo e atualiza os chips de easing.
- **Seletor de canal no `segEasePanel`** — três botões (Movimento / Rotação / Escala)
  no topo do mini-painel existente. Nenhum painel novo criado.
- Labels de easing atualizados: Linear · Entrada/Saída · Entrada · Saída.

### Motor de animação

`getStateAtT` agora calcula três parâmetros `t` independentes:
- `ttEased` (segEasings) → posição/trajetória
- `ttScale` (scaleEasings) → interpolação w/h
- `ttRot` (rotEasings) → interpolação angular

### Compatibilidade

- Projetos sem `scaleEasings` carregam normalmente; array preenchido com `'linear'`.
- Projetos sem `rotEasings` continuam funcionando (comportamento v8z4b17a).
- `buildProjectData` inclui ambos os campos; `applyFrameData` restaura com fallback.
- Inserção/remoção de frames mantém arrays alinhados.

---

## v8z4b17a — rotation easing engine foundation

Fundação técnica de easing de rotação por segmento. **Foco único:** preparar
o motor de interpolação para que a rotação entre frames possa usar uma curva
própria, independente do easing de movimento (`segEasings`). Sem alteração de
layout, menus, UI de preview, export MP4, WebCodecs, posição, escala, curvas
ou qualquer outro subsistema.

### O que foi adicionado

- **`rotEasings`** — novo array por segmento (N−1 entradas para N frames),
  paralelo ao `segEasings`. Padrão: `'linear'` em todos os trechos, preservando
  o comportamento visual de projetos antigos que não tenham o campo.
- **`ensureRotEasings()`** — garante tamanho correto do array (mesma lógica
  de `ensureSegEasings`).
- **`getRotEase(seg)`** — lê o easing de rotação do segmento com fallback
  `'linear'`.
- **`applyRotEasingToT(t, ease)`** — aplica a curva ao parâmetro `t` local.
  Valores aceitos: `'linear'`, `'ease-in'`, `'ease-out'`, `'ease-in-out'`
  (mesmos nomes já usados em `segEasings`).

### Onde a UI futura pode atuar

Para expor controle de rotEasings na interface, basta atribuir:
```js
rotEasings[seg] = 'ease-in-out'; // ou 'ease-in' / 'ease-out' / 'linear'
ensureRotEasings();
```
e chamar `stopPreview(); startPreview()` se o preview estiver ativo. Nenhuma
mudança adicional no motor é necessária.

### Interpolação

`getStateAtT` agora calcula:
- `tMove` (`ttEased`) = easing de movimento do segmento (segEasings) → usado em posição e escala
- `tRot` (`ttRot`) = `applyRotEasingToT(tt, rotEasings[seg])` → usado apenas na rotação

Por padrão `tRot = tt` (linear), o que equivale ao comportamento anterior para
projetos com `segEasings = 'linear'`.

### Gerenciamento de arrays

- **insertFrameBetween**: dois novos trechos recebem `'linear'` em `rotEasings`.
- **removeLastFrame / deleteFrame**: `normalizeProjectArrays()` e
  `ensureRotEasings()` mantêm o array alinhado.
- **Templates / reset completo**: `rotEasings.length = 0` junto com os demais arrays.
- **Undo/redo**: `captureState` e `restoreState` incluem `rotEasings`.

### Save / Load JSON

- `buildProjectData()` salva `rotEasings` no JSON.
- `applyFrameData()` carrega `rotEasings`; se o campo não existir (projeto
  antigo), `ensureRotEasings()` preenche com `'linear'` — sem quebra.

### Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para v8z4b17a.
  `pages-deploy-stamp.txt`, `CHANGELOG.md` e `QA.md` atualizados.

### Não alterado nesta rodada

Layout geral, menus inferiores, safe area, play, preview UI, menu de
transformação, nova timeline, stage, curvas visuais, seleção múltipla, export
MP4, WebCodecs, duração/tempo, pausas, escala, posição, textos, cores, ícones,
easing de movimento (`segEasings`).

## v8z4b16m — gap final slider/botões nos submenus de transformação

Microajuste visual final sobre a v8z4b16l. **Foco único:** aumentar em
5px o gap entre a linha do slider e a linha de botões (−5/+5/Reset) nos
submenus de transformação (Escala, Rotação, Pausa, Posição) para que a
bolinha do slider e os botões não fiquem encavalados em iPhone/Safari.
**Não toca** em motor de animação, preview, exportação MP4, WebCodecs /
MediaRecorder, cálculo de tempo, ranges dos sliders, valores exibidos,
comportamento dos botões −5/+5/Reset, lógica de escala, rotação, pausa
ou posição, menu de frames, posição da faixa de frames, botão Voltar,
safe-area, textos, ícones, cores ou layout geral.

### Alteração

- `#custBarContent .cust-content > div + div`: `margin-top` sobe de
  `10px` para `15px` (+5px). Esse é o único seletor CSS modificado.

### Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16m. `pages-deploy-stamp.txt`, `CHANGELOG.md` e `QA.md`
  atualizados.

### Não alterado nesta rodada

Motor de animação, WebCodecs / export MP4, preview/canvas, cálculo de
tempo, lógica de pausas, lógica de trechos, ranges dos sliders, valores
exibidos, comportamento dos botões −5%/+5%/Reset, easing, curvas, JSON,
templates, seleção múltipla, alinhamento/distribuição, ícones (SVGs),
textos de interface, paleta de cores, fluxo geral do app, botão Voltar,
menu de frames (continua fixo), safe-area.

## v8z3u — stable candidate

Base congelada para migração ao GitHub/Codex.

### Mantém

- Exportação via WebCodecs.
- MP4 sem trancos/kicks no teste principal.
- Curva/easing preservados após rollback da v8z3t.
- Comportamento atual do motor de movimento.
- Pausa por frame.
- Interface atual sem redesenho estrutural.

### Observações

- A v8z3t foi descartada por regressão: quebrou edição de curvas e trouxe de volta comportamento indevido de easing na curva.
- A próxima versão estável mínima deve corrigir apenas bugs pequenos e isolados.

## Próximos fixes candidatos

### Bug — Escala global reseta curvas

No Template Circular, ao alterar escala de vários frames com ajuste Global, as curvas não devem ser resetadas.

### Ajuste visual — Fixar ativo em vermelho

Quando Fixar estiver ativo em algum frame, usar destaque vermelho, não azul.

## v8z3w — Export stability diagnostics

- **Status:** candidata validada em teste prolongado.
- **Resultado:** bug do MP4 exportado sem imagem não foi reproduzido após múltiplos testes.
- **Testes realizados:** múltiplas edições, escala, posição, rotação, easing/transição, fundo branco/preto, múltiplas gerações de MP4 na mesma sessão e retorno para edição após export.
- **Decisão:** não aplicar patch adicional no export neste momento.
- **Fallback:** se o bug voltar, abrir **v8z3x — Isolated export/preview loop guard**.

## v8z4a — 30-frame capacity sprint

- Limite máximo de frames aumentado para 30.
- Capacidade técnica ampliada a partir do limite central de frames, preservando o fluxo atual de criação, remoção, seleção e renderização.
- Projetos antigos com menos frames devem permanecer compatíveis, sem alteração intencional no formato de JSON.
- Checklist de QA inclui teste obrigatório em iPhone/Safari via GitHub Pages com cache busting.

## v8z4b — Insert frame on existing curve

- Correção da inserção de frame dentro de curva existente quando o frame ativo possui próximo frame.
- Preservação do caminho ao dividir o segmento original em dois segmentos mantendo a forma visual da curva.
- Mantida compatibilidade com projetos antigos (JSON e fluxo de edição existente).

## v8z4b1 — Preserve split curve after frame edit

- Correção do reset de curva ao mover/editar frame inserido dentro de curva existente.
- Preservação das curvas adjacentes ao frame movido sem retilinização automática.
- Preservação de ctrlPts manuais dos segmentos vizinhos após a divisão da curva.

## v8z4b3 — Inserted frame pass-through easing

- Correção do easing duplicado ao inserir frame entre dois frames existentes.
- Frame inserido passa a funcionar como ponto de passagem contínua, sem criar desaceleração/aceleração extra no meio.
- Preservação do easing original entre os extremos do trecho original após o split.

## v8z4b2 — Restore curve/easing separation

- Correção da regressão em que o ponto de controle da curva influenciava a sensação de easing/velocidade temporal.
- Restauração da separação entre caminho geométrico (curva) e easing temporal (transição por segmento).
- Mantida a compatibilidade com o patch v8z4b de inserção de frame dentro da curva.

## v8z4b16k — Vertical breathing room in transform submenus

Microajuste visual sobre a v8z4b16j. **Foco único:** redistribuir o
espaço vertical dentro dos submenus de transformação (Pausa, Rotação,
Escala, Posição) para dar mais respiro entre a faixa de frames acima e
o thumb do slider, e eliminar a sobra inferior visível dentro do
painel — sem alterar a altura do `#custBar` (faixa de frames continua
fixa em todos os estados). **Não toca** em motor, preview, export MP4,
cálculo de tempo, ranges/valores dos sliders, comportamento dos botões
−5%/+5%/Reset, curvas, easing, seleção múltipla, textos, ícones, cores
ou estrutura geral.

### 1) Mais respiro entre faixa de frames e thumb do slider

Antes (v8z4b16j): `#custBarContent` reservava `padding-top:10px` acima
do slider. Com a faixa de frames colada no topo do painel, a metade
superior do thumb (30×30) ficava a ~10px da borda inferior do `#midBar`
e visualmente parecia "encostada" / parcialmente pressionada.

Correção:
- `padding-top` sobe de 10px para 16px (+6px de respiro acima do
  slider).
- Espaço extra vem da compactação dos chips (item 2), sem aumentar a
  altura do `#custBar`.
- A faixa de frames mantém posição exata em todos os estados.

### 2) Chips ainda mais enxutos para liberar espaço vertical

Antes (v8z4b16j): chips com `min-height:26px` e `padding:5px 12px` na
folha de estilo, mas os inline styles em cada chip
(`padding:6px 14px;min-height:30px`) tinham especificidade maior e
acabavam vencendo — chips renderizavam com 30px de altura.

Correção:
- `#custBarContent .chip` agora usa `!important` em `padding`,
  `min-height` e `font-size`, vencendo o inline style: `4px 12px`,
  `min-height:24px`, `font-size:13px`.
- Reduz a altura ocupada pelos chips em ~6px, exatamente o espaço
  redirecionado para o `padding-top` (item 1).
- Toque continua confortável (alvo total > 30px contando padding do
  painel, e o trilho dos chips fica em região segura acima da Home Bar).

### 3) Centro vertical em `.cust-content` elimina sobra inferior

Antes (v8z4b16j): `.cust-content` era `display:block`; o conteúdo
(slider + chips) ficava ancorado no topo do painel. Quando o conteúdo
era menor que a altura interna disponível, sobrava uma faixa vazia no
fundo do painel (acima da safe-area) — o "sobra inferior" relatado.

Correção:
- `#custBarContent > .cust-content` passa a ser `display:flex` com
  `flex-direction:column` e `justify-content:center`. Slider e chips
  são centralizados verticalmente dentro do espaço útil.
- Ganho duplo: a folga entre faixa de frames e thumb fica equilibrada
  com a folga abaixo dos chips, e a sobra inferior é eliminada porque
  o conteúdo aproveita o centro do painel em vez de empilhar do topo.

### 4) `#custBarContent` ocupa toda a área visível do `#custBar`

Antes (v8z4b16j): `#custBarContent` tinha altura natural (padding +
conteúdo), enquanto `#custBar` ficava fixo em `48px + safe`. Se o
conteúdo somasse menos que a altura do painel, o `#custBar` mostrava
uma faixa vazia entre o final do `#custBarContent` e o seu próprio
fundo (visualmente percebido como espaço morto inferior).

Correção:
- `#custBarContent` recebe `flex:1 1 auto` para ocupar toda a altura
  do `#custBar`. A área útil passa a ser definida apenas pelos
  paddings, e o `justify-content:center` do item 3 controla a
  distribuição interna.
- Compatível com o forçamento de altura em `#custBar:not(.compact-mode)`
  introduzido em v8z4b16j: o painel continua exatamente com a mesma
  altura do `compact-mode`, faixa de frames intocada.

### 5) Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16k. Comentários de versões anteriores preservados como
  contexto histórico; novas linhas marcadas v8z4b16k.

### Não alterado nesta rodada

Motor de animação, WebCodecs / export MP4, preview/canvas, cálculo de
tempo, lógica de pausas, lógica de trechos, ranges dos sliders, valores
exibidos, comportamento dos botões −5%/+5%/Reset, easing, curvas, JSON,
templates, seleção múltipla, alinhamento/distribuição, ícones (SVGs),
textos de interface, paleta de cores, fluxo geral do app, botão Voltar
reforçado, menu de frames (continua fixo na mesma posição em todos os
estados).

## v8z4b16j — Frame strip pinning, slider clipping fix, free Scale, footer breathing

Patch cirúrgico sobre v8z4b16i. **Foco único:** estabilizar a estrutura
inferior — faixa de frames travada na mesma posição visual em todos os
estados, thumbs dos sliders dos submenus de transformação visíveis
inteiros, slider de Escala livre para extrapolar a imagem, mais respiro
entre ícone e nome no menu contextual e leve descida do bloco inferior
para se aproximar mais da Home Bar. **Não toca** em motor de animação,
WebCodecs/export MP4, preview, cálculo de tempo, lógica de pausas/
trechos/tempo mínimo, easing, curvas, JSON, templates, seleção
múltipla, alinhamento/distribuição, ícones em si, textos de interface,
cores ou no fluxo geral do app. O botão Voltar reforçado em v8z4b16h
permanece intocado.

### 1) Faixa de frames (`#midBar`) com posição fixa em todos os estados

Antes (v8z4b16i): `#custBar.compact-mode` tinha height = `48px + safe`
(igual à toolbar) e `#custBar:not(.compact-mode)` ficava com height
automática — abrindo Pausa/Rotação/Escala/Posição, o conteúdo do
submenu (slider + chips + paddings) gerava cerca de +8–12px de altura,
empurrando o `#midBar` para cima alguns pixels no fluxo flex.

Correção:
- `#custBar:not(.compact-mode)` recebe a MESMA altura forçada do
  `compact-mode`: `calc(48px + max(env(safe-area-inset-bottom, 4px), 4px))`.
- O submenu encaixa nessa altura fixa graças aos chips mais compactos
  (`min-height:26px`, `padding:5px 12px`), gap menor entre slider/chips
  (`margin-top:4px`) e `padding-top:10px` reservado para o thumb.
- Resultado: a faixa de frames mantém posição exata ao abrir/fechar
  Pausa, Rotação, Escala e Posição — sem subir, sem descer, sem
  depender da altura do submenu.

### 2) Sliders dos submenus de transformação com thumb inteiro

Antes (v8z4b16i): `#custBarContent` tinha `padding:2px 14px 4px 2px`
— apenas 2px de padding-top. O thumb do slider (30×30) projeta-se
~15px acima do track; com 2px de folga, a metade superior do thumb
ficava cortada pelo limite superior do `#custBar` (com `overflow:hidden`)
e visualmente coberta pelo background sólido da faixa de frames acima.
Afetava Escala, Rotação, Pausa local.

Correção:
- `padding-top:10px` em `#custBarContent` reserva o espaço vertical
  necessário para o thumb caber INTEIRO dentro do painel.
- O slider continua com track 6px e thumb 30px (sem mudança de range,
  valor, cálculo ou comportamento).
- A faixa de frames continua sólida acima — agora nenhum thumb se
  projeta por baixo dela.

### 3) Slider de Escala: livre para extrapolar a imagem

Antes (v8z4b16i): `initScaleSlider` aplicava
`Math.max(40, Math.min(stageW * 0.98, refW * pct / 100))` ao calcular
`newW`/`tW`, travando o frame em 98% da largura do stage. O usuário não
conseguia escalar o frame além dos limites visuais da imagem com o
slider, mesmo com "Conter na imagem" desligado.

Correção:
- `Math.min(stageW * 0.98, …)` removido do cálculo do slider (apenas a
  cota inferior `Math.max(40, …)` permanece).
- `clampFrame()` continua sendo chamado e ainda respeita
  `containFrames` quando ativo — modo livre não trava, modo contido
  trava como antes.
- Botões −5%/+5% e Reset preservam o comportamento (já eram livres no
  modo padrão, agora apenas o slider se alinha).

### 4) Mais respiro entre ícone e nome no menu contextual de frames

Antes (v8z4b16i): `#custBar .cust-tab` usava `gap:1px` entre o SVG e o
rótulo — ícones de Pausa/Rotação/Escala/Posição ficavam visualmente
colados aos respectivos nomes.

Correção:
- `gap:5px` (cinco vezes maior) entre ícone e label nas abas de
  transformação. Hierarquia visual preservada; nenhum tamanho/cor/texto
  alterado.

### 5) Bloco inferior um pouco mais baixo

Antes (v8z4b16i): `.toolbar`, `#custBarTabs` e `#custBarContent`
subtraíam 20px da safe-area no `padding-bottom`
(`max(calc(env(safe-area-inset-bottom, 4px) - 20px), 6px)`).

Correção:
- Subtração passa para -26px nos três elementos, descendo os controles
  ~6px no iPhone (referência visual: Edits/Instagram/CapCut). Piso de
  6px preservado para manter a folga segura acima do indicador de Home.
- Sem reintrodução de degradê, fade, sombra falsa de rodapé ou overlay
  inferior. O background sólido var(--surface) do body continua
  cobrindo a safe area por baixo das barras.

### 6) Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16j. Comentários internos que descrevem versões anteriores
  como contexto histórico foram preservados; novas linhas explicativas
  desta rodada estão marcadas v8z4b16j.

### Não alterado nesta rodada

Motor de animação, WebCodecs / export MP4, preview/canvas, cálculo de
tempo, lógica de pausas, lógica de trechos, tempo mínimo 0.0s, easing,
curvas, JSON, templates, seleção múltipla, alinhamento/distribuição,
ícones (SVGs), textos de interface, paleta de cores, fluxo geral do
app, botão Voltar reforçado (`#custBarBack`, `.ab-back-strong`,
`.preview-btn.close-btn`).

## v8z4b16i — Safe-area regression fix, contextual submenu compaction

Patch cirúrgico sobre v8z4b16h. **Foco único:** corrigir a regressão da
camada de safe area que estava cobrindo controles do menu contextual e
compactar a altura excessiva dos submenus locais de frame. **Não toca**
em motor de animação, preview/canvas, exportação MP4, easing, curvas,
duração funcional, pausas funcionais, rotação funcional, escala
funcional, lógica de movimento, seleção múltipla, fluxo geral, cores
gerais já aprovadas, ou no botão Voltar reforçado em v8z4b16h.

### 1) Camada body::after de safe-area removida

Antes (v8z4b16h): pseudo-elemento `body::after` fixo (`position:fixed`,
`bottom:0`, `height:env(safe-area-inset-bottom)`, `z-index:0`,
`pointer-events:none`) foi adicionado como "rede de segurança" para
cobrir a faixa do home indicator com `var(--surface)`. Em iPhone/Safari,
esse layer fixo coincidia visualmente com a área inferior do
`#custBarContent` (que também tinha `padding-bottom = safe-area`),
gerando uma faixa de cor alta dentro do painel que parecia cobrir
slider e botões.

Correção:
- Bloco `body::after { ... }` removido do CSS.
- A continuidade visual da safe-area é mantida pelo background
  `var(--surface)` aplicado em `html, body` (já presente desde
  v8z4b16h).
- A toolbar (`.toolbar`), as tabs (`#custBarTabs`) e o conteúdo
  (`#custBarContent`) já incluem padding-bottom calculado a partir de
  `env(safe-area-inset-bottom)`, então a área da Home Bar segue coberta
  pela própria barra inferior, sem layer extra.
- Sem mudança em z-index, pointer-events ou empilhamento dos demais
  elementos.

### 2) Padding inferior do submenu compactado

Antes (v8z4b16h): `#custBarContent` usava
`padding-bottom: max(env(safe-area-inset-bottom, 4px), 4px) !important`
(~34px no iPhone). Esse valor alinhava o "fundo seguro" com o que a
toolbar reservava na compact-mode, mas no expanded-mode empurrava o
slider/chips ~20px para cima do que era necessário, criando espaço morto
visível abaixo dos controles.

Correção:
- `#custBarContent` agora usa o MESMO padrão de
  `.toolbar` e `#custBarTabs`:
  `padding-bottom: max(calc(env(safe-area-inset-bottom, 4px) - 20px), 6px) !important`.
- Resultado: o slider e os chips Reset/-5/+5 descem perto da Home Bar,
  com piso mínimo de 6px de folga (sem invadir touch da Home Bar).
- Submenu deixa de ter espaço morto inferior; altura visual cai ~20px
  no iPhone, mantendo o conforto de toque (chips continuam 30px,
  botão Voltar continua 44×44).

### 3) Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16i. Comentários internos que referenciam versões anteriores
  como precedente foram preservados; novos comentários explicativos
  das mudanças desta rodada são marcados v8z4b16i.

### Não alterado nesta rodada

Motor de animação, preview/canvas, exportação MP4, easing, curvas,
duração funcional, pausas funcionais, rotação funcional, escala
funcional, lógica de movimento, seleção múltipla, fluxo geral do app,
cores gerais já aprovadas, botão Voltar reforçado (`#custBarBack`,
`.ab-back-strong`, `.preview-btn.close-btn`) e demais melhorias
visuais já validadas em v8z4b16g/v8z4b16h.

## v8z4b16h — iPhone/Safari UI: pre-image guards, safe-area parity, Voltar reinforce, contextual compacting

Patch cirúrgico sobre v8z4b16g. **Foco único:** corrigir apenas o que foi
confirmado em teste no iPhone/Safari — guard de ações de frame antes da
imagem, faixa preta residual da safe area inferior, presença visual do
botão Voltar, compactação dos menus contextuais e ícone de Pausa/Tempo.
**Não toca** em motor de animação, preview, exportação MP4, easing,
curvas, duração funcional, pausas funcionais, rotação funcional, escala
funcional, lógica de movimento, seleção múltipla, cores gerais ou layout
fora dos pontos pedidos. Itens já OK na v8z4b16g preservados (Preview X→
Voltar, active-tab cleanup, Voltar lateral do custBar).

### 1) Bloquear ações de frame antes do carregamento da imagem

Antes: o app permitia ações de edição mesmo sem imagem carregada — botão
"+" tentava criar frame (com `frames[-1]` indefinido), botão "−" exibia
"Mínimo de 2 frames", lock/pin respondia, Play tentava iniciar preview,
e a faixa de frames podia exibir indicadores órfãos.

Correção:
- Helper único `hasImageLoaded()` (verdade = `imgNatW > 0`) consultado em
  todos os handlers: `addFrame`, `insertFrameAfterActive`, `deleteActiveFrame`,
  `removeLastFrame`, `toggleFrameLock`, `togglePlay`, `openCustBar`,
  `toggleMapa`, `invertFrames`. `promptSaveProject` já tinha o guard.
- Antes da imagem carregar, a faixa de frames (`#midBar`), a toolbar
  inferior (`#toolbar`) e o menu contextual (`#custBar`) ficam ocultos
  via CSS `body.no-image .mid-bar/#toolbar/#custBar{display:none}`. A
  classe `no-image` é removida no `imgEl.onload` do `loadImage()`.

Não altera o mínimo de 2 frames — só vale com projeto ativo (imagem
carregada).

### 2) Safe area inferior igualada à toolbar

Antes: no iPhone/Safari sobrava faixa preta abaixo da toolbar, distinta
da superfície do menu inferior. O `body` usava `var(--bg)` (#000), e
quando `100dvh` não cobria a safe-area-inset-bottom inteira, esse preto
vazava ao redor/abaixo da toolbar.

Correção:
- `html, body` agora usam `background: var(--surface)` em vez de
  `var(--bg)`. A `.image-area` continua com fundo preto sólido (não há
  vazamento visual no stage).
- Camada extra de segurança: pseudo-elemento `body::after` fixo no
  rodapé (`bottom:0`, `height: env(safe-area-inset-bottom, 0px)`,
  `background: var(--surface)`, `z-index:0`, `pointer-events:none`) —
  garante continuidade visual mesmo em cenários onde o flex não chega
  exatamente ao pixel do home indicator.
- Sem degradê, sem sombra, sem subir botões.

### 3) Reforço visual do botão Voltar nos submenus

Antes: o Voltar lateral do menu contextual de frames (`#custBarBack`)
estava 18×18 / stroke-width:2 / `rgba(235,235,235,0.92)` — discreto
demais, difícil de tocar no iPhone.

Correção:
- `#custBarBack`: ícone 26×26 (+44%), stroke-width 2.6 (+30%), cor
  `#fff` (branco puro), área de toque mínima 44×44 (alvo iOS HIG).
- `#alignBar` (seleção múltipla): mesmo tratamento via classe
  `.ab-back-strong` — SVG 28×28 com stroke-width 2.6, label em peso 700.
- Preview Voltar (`.preview-btn.close-btn`): cor `#fff`, stroke-width
  2.6 no SVG, label em peso 700.

Função preservada: continua chamando `collapseCustBar` / `clearMultiSelect`
/ `closeAlignSubmenu` / `stopPreview` respectivamente.

### 4) Menus contextuais de frame compactados

Antes: os submenus de Rotação, Escala e Pausa usavam chips com
`min-height:36px` inline, `padding:8px 16px` e `margin-top:10px` entre
slider e chips, gerando espaço morto perceptível abaixo dos controles.

Correção:
- Chips dentro dos cust-content: `min-height:30px`, `padding:6px 14px`,
  `gap:6px` e `margin-top:6px` (alinhado à regra global de v8z4b16f
  `#custBarContent .chip`, removendo overrides inline conflitantes).
- Padding-bottom seguro (safe-area) preservado para folga acima da Home
  Bar.
- Sem alteração em valores, ranges ou handlers — apenas dimensões
  visuais.

### 5) Menu Posição em duas colunas

Antes: o submenu Posição mostrava X e Y em DUAS LINHAS empilhadas
(altura ~80px sem motivo, já que cada eixo é uma linha pequena).

Correção:
- Reorganizado em DUAS COLUNAS lado a lado (X | Y), cada coluna com
  rótulo discreto (uppercase 10px) e seu próprio trio `− input +`.
- Sem rolagem interna, sem alteração em `nudgePos` / `setPosFromInput`.
- A altura útil do submenu cai para uma única linha de controles.

### 6) Ícone do menu Pausa trocado para relógio/duração

Antes: a aba "Pausa" do menu contextual usava `#i-pause` (dois traços
verticais — glifo de mídia parada), incoerente com o conceito de
"duração da pausa do frame".

Correção:
- Novo símbolo SVG `#i-clock` (Lucide clock: círculo + ponteiros) no
  sprite.
- Aba "framepause" do `#custBarTabs` passa a referenciar `#i-clock`.
- Texto "Pausa" preservado por já fazer parte da interface aprovada.
- Nenhuma mudança em `framePauseSlider`, `setFramePause`,
  `resetFramePause`, `syncFramePauseUI` ou no painel Duração.

### 7) Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16h. Comentários internos que referenciam v8z4b16g como
  precedente foram preservados; novos comentários explicativos das
  mudanças desta rodada são marcados v8z4b16h.

### Não alterado nesta rodada

Motor de animação, Preview/canvas, exportação MP4, easing, curvas,
duração funcional, pausas funcionais, rotação funcional, escala
funcional, lógica de movimento, seleção múltipla, cores gerais, layout
geral fora dos pontos pedidos, Preview X→Voltar (já feito em v8z4b16g),
limpeza de `.active-tab` (já em v8z4b16g) e botão Voltar lateral do
custBar (já em v8z4b16g — aqui só reforçado visualmente).

## v8z4b16g — UX state cleanup, Voltar standardization, version housekeeping

Patch cirúrgico sobre a v8z4b16f. **Foco único:** três correções de UX/estado
visual e padronização de versionamento. **Não toca** em motor de animação,
preview, exportação MP4, easing, curvas, duração, pausas, seleção múltipla,
rotação ou escala funcional, layout geral, cores, textos, ícones ou fluxo
além do que está explicitamente listado abaixo.

### 1) Limpa destaque visual preso no menu de frames

Antes: ao tocar em um ícone do menu contextual de frames (por exemplo
Rotação), fechar o menu e abrir novamente, o último ícone usado continuava
destacado/aceso em `compact-mode`. Bug puro de estado visual — sem lógica
real de "modo ativo" por trás. A classe `.active-tab` aplicada em
`switchCustTab()` ficava remanescente após `closeCustBar()` e mesmo após
`collapseCustBar()`, e era reaplicada na próxima abertura porque o nó DOM
preservava o estado.

Correção:
- `closeCustBar()` agora limpa `.active-tab` de todos os ícones em
  `#custBarTabs`.
- `collapseCustBar()` (botão Voltar do submenu) também limpa — quando o
  menu volta a compact-mode nenhum submenu está aberto, então nenhum
  ícone deve aparecer aceso.
- O default `<div class="cust-tab active-tab" data-tab="scale">` perdeu o
  `active-tab` para que a primeira abertura do menu também não acenda o
  ícone Escala sem motivo.

Lógicas reais de modo ativo (`custGlobalLock`, `frameLocked`,
`finishMode`) não foram tocadas.

### 2) Botão Voltar como coluna lateral à esquerda nos submenus contextuais

Antes (v8z4b16f): o botão Voltar (`#custBarBack`) era um header inline no
topo do submenu, ocupando ~22px de altura útil acima do slider/conteúdo.
Em v8z4b16e tinha sido coluna lateral mas com `min-height:32px` que
gerava faixa visual estranha.

Correção:
- `#custBarContent` virou `display:flex; flex-direction:row` com gap 6px.
- `#custBarBack` virou coluna estreita (`width:24px`, `align-self:stretch`),
  com SVG 18×18 centralizado vertical e horizontalmente.
- O conteúdo do submenu (`.cust-content` visível) ocupa o restante via
  `flex:1 1 0`.
- Resultado: o painel recupera ~22px de altura útil que antes era
  consumida pelo header, e a direção de interface aprovada (coluna
  lateral à esquerda discreta e verticalizada) volta a vigorar.

Comportamento do botão preservado: `collapseCustBar()` volta ao
`compact-mode` (ícones), `closeCustBar()` continua sendo o stage-tap.

Aplica-se aos submenus de Pausa, Rotação, Escala (transformação) e
Posição — mesmo container `#custBarContent`.

### 3) X do Preview trocado por Voltar

O botão da esquerda no rodapé do `previewScreen` ainda usava `#i-close`
(X) com label "Fechar". A linguagem aprovada agora é "Voltar" + chevron
para a esquerda, igual a `#custBarBack` e ao Voltar primário do
`#alignBar`.

Correção:
- SVG inline com `<polyline points="15 18 9 12 15 6"/>` (mesmo chevron
  dos outros painéis).
- Label `Voltar` substitui `Fechar`.
- `onclick="stopPreview()"` intocado: o botão continua fechando o
  Preview e devolvendo ao Stage.

Layout geral do Preview, botões de Play/Pause, botão Salvar MP4,
geração de vídeo e canvas: inalterados.

### 4) Versão atual padronizada para v8z4b16g

- `APP_VERSION` / `APP_VERSION_NAME` (constantes JS) → `v8z4b16g`.
- `<span id="appVersionText">` em `.settings-version` → `v8z4b16g`.
- Comentário/header no topo de `index.html` (linha 1–76) atualizado:
  "Versão: v8z3q" virou "Versão: v8z4b16g"; bloco de changelog antigo
  marcado como histórico (v8z3q deixou de carregar o "(atual)").
- `<!-- Arco App — v8z3v ... -->` virou `<!-- Arco App — v8z4b16g ... -->`.
- `pages-deploy-stamp.txt` atualizado.
- Referências internas históricas (`// v8z4b16f — ...`, etc.) preservadas
  porque descrevem MUDANÇAS da versão indicada e ajudam o QA a rastrear
  por que cada bloco existe. Não há mais nenhuma referência a versão
  antiga apresentada como "(atual)".

### Arquivos alterados

- `index.html`
  - HTML: header de comentário do topo; comentário `<!-- Arco App — vX -->`;
    `<div class="cust-tab" data-tab="scale">` (remoção do `active-tab`
    default); `previewScreen` close-btn (SVG + label); `.settings-version`
    span.
  - CSS: bloco `#custBarBack` (passou de header inline para coluna lateral)
    e `#custBarContent` (passou a `display:flex` row); nova regra
    `#custBarContent > .cust-content { flex:1 1 0 }`.
  - JS: `closeCustBar()` e `collapseCustBar()` ganharam limpeza de
    `.active-tab`; `APP_VERSION` e `APP_VERSION_NAME` atualizados.
- `pages-deploy-stamp.txt`: stamp v8z4b16g.
- `CHANGELOG.md`: esta entrada.
- `QA.md`: nova seção v8z4b16g.

### Riscos

- A coluna lateral usa `width:24px`. Em telas muito estreitas o chevron
  pode parecer apertado; área de toque útil real é `padding:0 4px` +
  24px = ~32px, mantendo conforto.
- Limpar `.active-tab` em `collapseCustBar()` significa que, ao voltar
  do submenu para o compact-mode, o ícone do último submenu não fica
  marcado. Isso é o comportamento solicitado: sem destaque preso.
- O padding-left de `#custBarContent` caiu de 14px para 2px para
  acomodar a coluna; o conteúdo visual real continua começando a ~32px
  da borda esquerda do painel (coluna do botão + gap).

### Não tocado

- WebCodecs / export pipeline / MP4: zero mudanças.
- Motor de animação, easing, curvas, smoothing: zero mudanças.
- Cálculo de tempo, sliders de duração/pausa/segmento: zero mudanças.
- Seleção múltipla, alignBar, distribuição: zero mudanças (alignBar já
  usava Voltar com chevron — não precisou de patch).
- Templates, JSON, BgColor, Format, settings sheet: zero mudanças.

### Testes obrigatórios (iPhone/Safari)

1. App abre normalmente.
2. Carregar imagem.
3. Preview abre e fecha pelo novo botão "Voltar" (chevron). Mesmo
   comportamento de antes.
4. Reset (botão de reset do topbar) continua funcionando.
5. Tocar num frame: menu contextual abre em compact-mode SEM ícone
   aceso.
6. Tocar em Rotação → submenu expande, ícone Rotação acende, botão
   Voltar aparece como coluna estreita à esquerda do slider.
7. Tocar no Voltar (coluna esquerda) → recolhe para compact-mode, NENHUM
   ícone fica aceso.
8. Tocar em Rotação → submenu, Tocar fora (no stage) → fecha. Reabrir
   o menu → NENHUM ícone fica aceso (bug do v8z4b16f corrigido).
9. Painéis de Pausa / Escala / Posição: mesmo layout, Voltar à esquerda.
10. Configurações → "Arco v8z4b16g" visível na versão.
11. Nenhuma referência interna na tela ou no CHANGELOG contradiz a
    versão atual v8z4b16g.

## v8z4b16f — Solid bottom strip, compact context submenu, slider fill sync

Patch cirúrgico sobre a v8z4b16e. **Foco único:** fechar os três problemas
visuais residuais que sobraram para promoção da linha v8z4b16 ao
app principal. **Não toca** em motor de animação, preview, export MP4,
cálculo de tempo, lógica de tempo global, Intervalo padrão, ranges de
sliders, easing, curvas, JSON, templates ou seleção múltipla.

### 1) Rodapé sólido — fim do degradê/faixa escura

`.float-panel` carregava `box-shadow:0 -8px 40px rgba(0,0,0,.6)` no estado
padrão (fechado). Com `transform:translateY(105%)` o painel some abaixo
da viewport, mas a sombra (offset -8 + blur 40 = ~48px acima do topo do
painel) ainda vazava 28–43px ABOVE the viewport bottom, criando o efeito
de degradê escuro vindo de baixo para cima visível no rodapé. Vários
`.float-panel` (Duration, Ease, Smooth, BgColor, Format, Template…)
contribuíam simultaneamente.

Correção: `box-shadow:none` no estado padrão; a sombra agora aparece
apenas com a classe `.show` (painel aberto). Rodapé fica visualmente
sólido até a base da tela, sem fade, sem faixa morta. Toolbar/custBar
seguem com `background-image:none` e `box-shadow:none` como já estavam.

### 2) Submenu contextual compacto + header com botão voltar

`#custBarBack` tinha `min-height:32px` + `padding:2px 12px` e ficava em
linha própria acima do slider, criando a "coluna vertical jogada à
esquerda" e exagerando a altura total do submenu (~148px sobre a
safe-area). Agora vira um header compacto:

- `min-height:22px`, `padding:1px 8px 1px 2px`, `min-width:36px`.
- SVG 20x20 (era 22x22), chevron alinhado ao conteúdo abaixo.
- `#custBarContent` com `padding:2px 14px 4px` (era `4px 14px 8px`).
- Chips do menu contextual com `padding:6px 14px` e `min-height:30px`
  (eram `8px 16px` e `36px`). Gap entre slider e chips reduzido a 6px.

O submenu fica próximo de ~110px sobre a safe-area (≈25% mais
compacto) sem alterar valores, ranges ou comportamento dos controles.
Mantida a navegação: toque no ícone expande, chevron recolhe ao
compact mode, toque fora fecha.

### 3) Faixa ciano do slider acompanha a bolinha

`updateSliderFill()` já existia e era disparada via listener delegado em
`input`. Quando o `value` era escrito de forma programática (abrir
painel, sincronizar valores entre painéis, drag de handle global), o
listener não rodava e a faixa ciano (CSS `--fill`) ficava com o valor
antigo — bolinha em 0.0s mas faixa cheia até o meio.

Correção: chama `updateSliderFill(slider)` imediatamente após cada
escrita programática em `.dur-slider` que pintaria valor stale:
- `initEasePanel` (slider Seg. X-Y do painel contextual de Trecho);
- `syncCustomizePanel` (rotSlider e scaleSlider);
- handle global de escala/rotação (drag no stage);
- arrasto de rotação por gesto (rotSlider);
- `initSmoothSlider`;
- `refreshPauseControls` (framePauseSlider local).

Adicionalmente, `openCustBar`, `switchCustTab` e `openPanel` chamam
`refreshSliderFills()` ao final, repintando todos os `.dur-slider`
visíveis após cada transição de painel/aba.

`updateSliderFill` já trata min/max inválidos, value NaN, max==min e
clampa entre 0..100; sem alteração na função.

### Arquivos alterados

- `index.html`
  - Estilo `.float-panel` / `.float-panel.show` (rodapé sólido).
  - Estilo `#custBarBack` + nova regra `#custBarContent .chip` e
    `.cust-content > div + div` (submenu compacto).
  - Inline `padding` de `#custBarContent` ajustado.
  - JS: `initEasePanel`, `syncCustomizePanel`, drag handlers de
    handle global e rotação, `initSmoothSlider`, `refreshPauseControls`,
    `openCustBar`, `switchCustTab`, `openPanel`.
  - `APP_VERSION`, `APP_VERSION_NAME` e texto visível em `settings-version`.
- `pages-deploy-stamp.txt` atualizado.

### Riscos

- Sombra do painel flutuante agora só aparece com `.show`. Pode haver
  um pop visual no início da transição de abertura (transition cobre
  apenas `transform`). Aceitável — painel fechado fica sem leak; aberto
  segue com a mesma sombra de elevação.
- Submenu mais compacto pode parecer "apertado" em telas muito
  pequenas. Mantidos paddings mínimos e altura de toque para chips.

### Não tocado

- WebCodecs/export pipeline / MP4: zero mudanças.
- Motor de animação: zero mudanças.
- Cálculo de tempo, sincronização numérica das pausas/trechos: mantida
  como na v8z4b16e.
- Seleção múltipla, alinhamento, distribuição: zero mudanças.
- Templates, JSON, easing, curvas: zero mudanças.

### Testes obrigatórios (iPhone/Safari)

1. Rodapé: carregar imagem; confirmar barra inferior sólida até a base,
   sem degradê; botões acima da Home Bar.
2. Submenus de frame: tocar frame → Pausa/Rotação/Escala/Posição →
   chevron voltar bem posicionado; sem tranco no stage.
3. Sliders: abrir Seg. 1-2; valor 0.0s → bolinha e faixa ciano no
   início; mover → faixa acompanha; abrir painel Duração e confirmar
   slider TOTAL e individuais.
4. MP4: tocar Preview; Gerar MP4; gerar de novo após pequena edição;
   sem tela preta nem botão preso.

## v8z4b16d — Fix MP4 generation and defensive export cleanup

Patch cirúrgico sobre a v8z4b16c. **Foco único:** recuperar a geração
de MP4, que estava entrando em estado de gravação (botão piscando
vermelho) sem produzir arquivo e deixando o app preso em tela preta.
**Não toca** em motor de animação, cálculo de tempo, sincronização de
sliders, menus contextuais, painel Duração, AlignBar, ou qualquer
item validado em v8z4b16c.

### Causa raiz

`cleanupFailedExport` em v8z4b16c (e versões anteriores) zerava o
estado interno mas **não fechava** o `previewScreen` (overlay preto
fixo, `z-index:90`) nem limpava o `previewDisplayCanvas` (que ficava
display:block sem nada desenhado). Em qualquer falha do encoder o
usuário ficava olhando um overlay totalmente preto, sem animação,
até tocar Fechar manualmente — exatamente o sintoma "tela preta"
relatado. Além disso, `startRecord` executa setup pesado **antes** do
`try { }` interno: se qualquer um daqueles passos lançasse exceção,
`isRecording` permanecia `true` e o botão Salvar MP4 ficava preso na
classe `recording` (vermelho piscando), pois o próprio `handleGenerate`
e `startRecord` retornam cedo quando `isRecording` é truthy.

### Correções

- **`cleanupFailedExport` agora restaura o app completamente:**
  esconde `previewScreen.show`, cancela `animFrame`, zera
  `isPreviewing`/`animStart`/`pausedElapsed`, limpa o
  `previewDisplayCanvas` (clearRect + display:none + filter:none) e
  chama `updatePlayButton()`. Em caso de erro o usuário volta direto
  ao stage de edição em vez de ficar olhando um overlay preto.
- **Guards de pré-condição em `startRecord` (antes de marcar
  `isRecording = true`):**
  - Imagem base carregada (`imgEl.complete`, `imgNatW`, `imgNatH`).
  - Dimensões de export válidas (`exportDims[currentRatio]` > 0).
  - Duração total finita e > 0 (`totalDurationFull()`).
  Se qualquer guard falhar, mostra `showStatus` e retorna sem
  entrar em estado de gravação — botão não pisca vermelho à toa.
- **Sanidade do `recCanvas`:** abortar com cleanup mínimo se W/H
  forem 0/NaN/Infinity em vez de tentar configurar o encoder.
- **`try { } catch { } finally { }` em torno do encode WebCodecs:**
  o `finally` garante que, mesmo se o `catch` falhar ou se algo
  escapar (encoder travado, promessa pendente), `isRecording` é
  forçado a `false` via `cleanupFailedExport`. Sem isso o app
  permanecia preso no estado de gravação após qualquer erro raro.
- **MediaRecorder fallback endurecido:**
  - Guard de presença (`MediaRecorder` + `recCanvas.captureStream`).
  - `try/finally` em volta da gravação: stream tracks são sempre
    liberadas, mesmo se o loop quebrar.
  - `hardResetCanvas(rCtx, recCanvas, bgColor)` por frame (antes só
    existia no caminho WebCodecs) — garante fundo limpo e descarta
    restos de frames anteriores se algum `drawImage` falhar.

### Comportamento garantido

- **Sucesso normal:** Gerar MP4 renderiza, finaliza e mostra
  `readyOverlay` como antes — caminho feliz inalterado.
- **Falha do encoder/codec:** previewScreen fecha, animFrame
  cancelado, botão volta a "Salvar MP4" sem `recording`, `showStatus`
  imprime mensagem útil, console registra erro com contexto.
- **Falha de pré-condição (imagem não carregada, duração 0,
  proporção inválida):** abortar antes de entrar em
  recording — botão nem pisca vermelho.
- **Erro raro escapou do catch:** `finally` aciona
  `cleanupFailedExport`; usuário pode tentar novamente.

### Não tocado nesta versão

- Motor de animação, easing, cálculo de tempo, sincronização de
  sliders, painel Duração, menu contextual, AlignBar, faixa
  inferior, fechamento ao tocar no stage, hierarquia tipográfica,
  nomenclatura Trechos.
- Curvas/easing/JSON/templates/arquitetura geral.
- Pendências visuais conhecidas (degradê inferior, altura da barra,
  altura de subpainéis, faixa azul do slider TOTAL, sincronização
  visual entre painel contextual de trecho e painel Duração)
  continuam abertas — não entram neste patch por escopo.

### Versão

- `appVersionText`: `v8z4b16d`.
- `appVersionNameText`: `Fix MP4 generation and defensive export cleanup`.
- Constantes `APP_VERSION` / `APP_VERSION_NAME` atualizadas.

## v8z4b16c — Stage stability, bottom slot and visual hierarchy

Patch cirúrgico sobre a v8z4b16b. **Não toca** na lógica de tempo
global, no cálculo de tempo total, no preview/export, nem na
sincronização dos sliders já validados.

### Estabilidade do stage no menu contextual

- Slot inferior com altura EXPLÍCITA: `.toolbar` e `#custBar.compact-mode`
  agora usam `height: calc(48px + max(env(safe-area-inset-bottom, 4px), 4px))`
  e `box-sizing:border-box`. Antes, ambas eram dimensionadas pelo
  conteúdo + padding e pequenas diferenças de arredondamento no iOS
  Safari produziam um tranco vertical ao trocar a toolbar pelo menu
  contextual. Agora a troca é visualmente neutra.
- `openCustBar` adiciona `body.cust-open` ANTES de mostrar o
  `#custBar`; `closeCustBar` mantém a simetria inversa. Elimina o
  frame intermediário em que toolbar e custBar coexistiam.
- `#custBar` perde o `box-shadow:0 -8px 28px rgba(0,0,0,.45)` (criava
  faixa escura projetada sobre o stage, percebida como degradê
  inferior). Superfície inferior fica sólida e contínua até a Home Bar.

### Fechar menu contextual em qualquer área vazia do stage

- Novo listener delegado em `.image-area` (`#imageArea`): `pointerdown`
  com whitelist explícita das regiões interativas (`#custBar`,
  `#midBar`, `#alignBar`, `.top-bar`, `.float-panel`, `.global-handle`,
  `.ctrl-pt`). Tocar na imagem, no fundo preto da área de edição ou
  no canvas vazio fecha o menu; tocar nos controles não fecha.
- Listener no `#stage` permanece como caminho secundário (compat).

### Barra inferior — visual compacto

- `.toolbar` passou a `align-items:flex-end` com `padding:2px 4px
  max(env(safe-area-inset-bottom, 4px), 4px)`; `.tb-item` agora alinha
  conteúdo ao fim com `gap:2px`. Botões/textos descem visualmente,
  absorvem a safe area, eliminam o espaço morto acima e dão aparência
  de app mobile nativo.
- `#custBar .cust-tab` segue o mesmo padrão para que toolbar e menu
  contextual sejam visualmente idênticos em posicionamento.

### Painel Duração — hierarquia tipográfica

- Títulos principais (`.dur-section-header`): `font-size:17px;
  font-weight:700; color:var(--text)`. Três blocos (Trechos,
  Pausas por frame, Acabamento) ficam visualmente equivalentes.
- Subtítulos descritivos (`.dur-sublabel`, `.dur-subitem-label`) e
  labels internos de slider (`.dur-edit-row > .dur-edit-label`):
  `font-size:11px; font-weight:600; color:var(--text3);
  letter-spacing:1.4px; text-transform:uppercase`. Claramente
  subordinados aos títulos principais.

### Nomenclatura visível

- "Segmentos" → "Trechos" (cabeçalho da seção).
- "Tempo por segmento" → "Tempo por trecho" (subtítulo dos sliders
  individuais).
- "Segmentos" (linha do summary topo) → "Tempo dos trechos".
- Texto do toast `'Próximo ajuste aplicado a todos os segmentos'` →
  `'... a todos os trechos'`.
- Variáveis internas (`segDurations`, `segEasings`, IDs como
  `durSummaryMove`, `segTotal`, `segBreakdown`) NÃO renomeadas —
  zero impacto na lógica de tempo, easing ou preview.

### Caixa de seleção múltipla / alinhamento

- `#alignBar` redesenhada para compartilhar a linguagem visual do
  `#custBar`: fundo sólido, slot inferior com mesma altura, ícones
  centralizados acima de labels curtas, `.ab-tab` espelhando
  `.cust-tab`.
- Duas camadas:
  - **Primária:** Voltar (contador de seleção) · Alinhar · Distribuir · Escala.
  - **Submenu Alinhar:** 6 alvos visuais — Esq, Centro H, Dir, Topo,
    Centro V, Base. Apenas Centro H e Centro V têm lógica (já existia
    como `cx`/`cy`); os 4 demais aparecem desabilitados (`.ab-tab-disabled`)
    sem criar função nova. Voltar leva à camada primária.
- A barra continua `position:fixed; bottom:0` — entra por cima sem
  empurrar o stage, exatamente como antes.

### Não tocado nesta versão

- Lógica de tempo global, cálculo de tempo total, sincronização dos
  sliders (subordinação cinza), handle sticky do painel Duração,
  preview/export MP4, tempo mínimo 0.0s.
- Nada de nova timeline, novo stage, novos handles, edição vetorial,
  curvas estilo Illustrator, easing de rotação/escala, novo motor,
  novo controle fino de tempo.

### Versão

- `appVersionText`: `v8z4b16c`.
- `appVersionNameText`: `Stage stability, bottom slot and visual hierarchy`.
- Constantes `APP_VERSION` / `APP_VERSION_NAME` atualizadas.

## v8z4b16b — Stabilize contextual menu and zero-second segments

Patch de estabilização sobre a v8z4b16a, fechando apenas os pontos
encontrados na revisão. **Não inclui** novo redesign do painel Tempo,
nova timeline contínua, novo stage, novo sistema de handles, edição
vetorial, nem reformulação de nomenclatura. Foco em correções
cirúrgicas e um único ajuste funcional (tempo zero).

### Menu contextual do frame

- Removidos os ícones **Curvas** e **Adicionar** do menu contextual.
  "Curvas" será futura edição vetorial/nódulos dos frames (não easing)
  e fica fora desta versão; "Adicionar" frame pertence à faixa de
  frames, não ao menu local de transformação.
- Menu contextual agora ocupa **exatamente a mesma altura** do menu
  inferior principal. `#custBar .cust-tab` passou de `min-height:56px`
  para `46px` (= 4 + 38 + 4, igual ao `tb-item` mais alto da toolbar
  com `flex:1` distribuindo os tabs). `align-items:stretch` no
  `#custBarTabs`. O slot inferior continua sendo a mesma faixa: pura
  troca de conteúdo, sem empurrar o stage nem cobrir a faixa de frames.

### Sliders — estado global

- Quando o estado "tudo sincronizado pelo global" está ativo, o
  **thumb/bolinha** dos sliders individuais agora também fica cinza
  (antes ficavam brancos porque o thumb tem `background:#fff` próprio
  e `filter:grayscale(1)` não tem efeito sobre branco puro). Aplicado
  via override `::-webkit-slider-thumb` e `::-moz-range-thumb` em
  `#framePauseRows.global-synced` e `.dur-edit-row.partial-synced`.
- Sincronização e largura útil já estavam corretas — não tocadas.

### Handle superior do painel

- `#panelDuration > .panel-handle` virou banner **sticky** no topo da
  área de rolagem: `position:sticky; top:0`, fundo `var(--surface)`
  cobrindo todo o conteúdo que desliza por baixo, bolinha visual via
  `::before`. O painel mantém `overflow-y:auto`; não foi criado novo
  scroll interno.

### Trecho/intervalo mínimo 0.0s

Ajuste funcional obrigatório para permitir corte seco entre frames.
Não altera nomenclatura visual ainda.

- Sliders/inputs aceitam `min=0`:
  - `#durSlider` (total dos segmentos).
  - `#newSegmentDurationInput` (intervalo padrão).
  - `#easePanelSegSlider` (tempo individual de segmento via painel
    de easing).
- Clamps de duração de segmento auditados e abaixados a 0:
  - `addFrame` usa `Math.max(0, Math.round(defaultNewSegmentDuration != null ? defaultNewSegmentDuration : 2))`.
  - `insertFrameAfterActive` (split em dois meios) usa
    `Math.max(0, ...)` em vez de `Math.max(0.1, ...)`.
  - Redistribuição proporcional pelo `durSlider` usa `Math.max(0, ...)`.
  - `defaultNewSegmentDuration` no load de projeto e estado interno
    aceita 0.
- Clamps de pausa, acabamento (Retorno/Duração), escala, rotação,
  easing e blur **não foram tocados** (escopo restrito ao tempo entre
  frames).
- `getSegDuration` e `openSegBreakdown` trocam o teste falsy
  (`segDurations[i] || fallback`) por `!= null`, preservando o valor
  legítimo 0.
- Redistribuição pelo total:
  - Total → 0 leva todos os trechos para 0.
  - Saindo de "tudo 0" para um total > 0, distribui igualmente entre
    os trechos (não há proporção anterior válida).
  - Total > 0 com valores diferentes preserva proporção atual.
- Motor temporal — proteção mínima contra duração total real igual a
  zero:
  - `startPreview`, `togglePreviewPlayback` e `finishExport.loopAfter`
    usam `Math.max(1, totalDurationFull() * 1000)` para o módulo do
    elapsed, evitando `% 0 = NaN`, loop infinito ou preview congelado.
  - Não altera valores do usuário; apenas garante que `t = elapsed/dur`
    seja válido. Quando todos os trechos são 0 e não há pausas, o
    preview mostra estado estático seguro (t=0).
  - `getSegAndLocalTAtTime` e `applySegWeights` já tratavam segmentos
    de duração zero como transição instantânea (localT=1); não
    alterados.
- Export MP4: `total = Math.max(1, Math.round(durationSec * fps))`
  já existia. Quando a duração total real é 0, o export gera 1 frame
  estático em vez de travar.

### Não tocado nesta versão

- Redesign do painel Tempo, timeline contínua, novo stage, novo
  sistema de handles, edição vetorial, easing de rotação/escala,
  WebCodecs (exceto guard mínimo já descrito), templates, cores
  gerais, layout geral aprovado, textos e ícones fora do escopo
  acima.

### Versão

- `appVersionText`: `v8z4b16b`.
- `appVersionNameText`: `Stabilize contextual menu and zero-second segments`.
- Constantes `APP_VERSION` / `APP_VERSION_NAME` atualizadas.

## v8z4b16a — Mobile UI consolidation: contextual menu, sliders, duration panel

Consolidação estrutural de UX em iPhone/Safari sobre a v15z. **Nenhuma
mudança no motor de animação, easing, curvas, render, preview, export,
WebCodecs ou `getStateAtT`/`drawAtT`.** Foco total em interface,
estados visuais, hierarquia e navegação.

### Menu contextual de frame — paridade visual com a toolbar

- `#custBarTabs` agora compartilha o MESMO padding da `.toolbar`
  (4px topo / 4px lateral / safe-area-inset-bottom no mínimo 4px) e
  `min-height` da cust-tab reduzido de 72px → 56px. Resultado: o menu
  contextual no modo compacto ocupa exatamente a mesma altura total
  do menu inferior principal — pura troca de conteúdo, sem aumento de
  faixa, sem invasão extra do stage.
- `#custBarContent` perdeu o `min-height:122px` (gerava altura extra
  quando o conteúdo era pequeno). Agora dimensiona pelo conteúdo;
  herda o mesmo `padding-bottom` de safe-area da toolbar.

### Menu contextual — ordem oficial e novas ações rápidas

- Ordem das abas atualizada para: **Pausa, Rotação, Escala, Posição,
  Curvas, Adicionar** (estilo CapCut). "Pausa" substitui o antigo
  rótulo "Duração" — controla a pausa local do frame, e o nome agora
  corresponde diretamente ao que faz.
- Novas ações rápidas:
  - **Curvas** → fecha o custBar e abre o painel de easing do
    segmento seguinte (`openEaseForSeg('next')`). Sem submenu interno
    duplicado.
  - **Adicionar** → insere frame após o ativo
    (`insertFrameAfterActive()`) e fecha o custBar.
- Submenu de Pausa simplificado: removidos o cabeçalho "Frame Fn" e o
  texto "Duração/pausa neste frame (0 = sem pausa)". Restam só os
  três elementos essenciais (slider + valor + reset). Margem do reset
  reduzida de 18px → 14px.

### Sliders — faixa ativa cyan + inativa cinza escuro

- Todos os sliders editáveis (`.dur-slider`) — pausas globais,
  pausas por frame, segmentos (Total + individuais), local do
  custBar, acabamento (Retorno/Duração) — recebem um gradiente
  dinâmico via CSS variable `--fill`:
  - Faixa ativa: `var(--accent)` (cyan/turquesa do app).
  - Faixa inativa: `var(--surface3)` (cinza escuro).
- Atualização sem listener por slider: delegação `input` no
  documento + helper `updateSliderFill()`. `refreshSliderFills()` é
  chamado no `DOMContentLoaded` e ao final de `refreshPauseControls`
  para mudanças programáticas. Sem glow.

### Painel Duração — limpeza estrutural

- Cabeçalhos de bloco (Segmentos, Pausas, Acabamento) padronizados via
  `.dur-section-header` com `.dur-section-chevron` (chevron cyan
  menor, 24px). Border-bottom de `.5px solid var(--border)` somente
  no cabeçalho — a única linha divisória **entre blocos principais**.
- Subitens dentro de cada bloco compartilham a mesma faixa contínua,
  sem traços horizontais entre si. Subtítulos descritivos ("Tempo
  por segmento", "Pausa por frame") rebaixados visualmente:
  `.dur-sublabel` em 10px/600/uppercase/`text3`, com valor
  acompanhante (`.dur-sublabel-value`) também em `text3`.
- Botões secundários ("Igualar intervalos", "Zerar pausas")
  unificados em `.dur-subitem-action` — visual discreto, mesma cor
  de superfície.
- Removidas as classes `is-bordered` redundantes entre subitens; a
  hierarquia é agora puramente tipográfica.

### Pausas globais — sliders individuais subordinados ao "Tudo"

- Quando **todos** os frames têm o mesmo valor de pausa (estado
  "tudo sincronizado pelo global"), o container `#framePauseRows`
  recebe a classe `.global-synced` e os sliders individuais ficam
  visualmente subordinados:
  - `filter:grayscale(1); opacity:.45`
  - rótulos/valores em `var(--text3)`
- Qualquer mudança num individual quebra o `allEqual`, o slider
  "Tudo" volta para o estado misto e os individuais voltam ao
  contraste cheio — comunicando a divergência sem texto.
- Base estrutural pronta para futura **seleção parcial de grupos**:
  classe `.partial-synced` aplicável a um subconjunto de rows
  (escopo menor), com a mesma dessaturação. Nenhuma seleção múltipla
  implementada ainda — apenas a arquitetura visual/estado.

### Safe area / toolbar inferior — invasão visual da Home Bar

- Padding superior da `.toolbar` reduzido de 8px → 4px; mesmo no
  custBar e no custBarTabs. Bottom continua sendo
  `env(safe-area-inset-bottom)` (mínimo 4px), preservando os botões
  acima da Home Bar. O fundo da toolbar agora colore TODA a área até
  a Home Bar — sem faixa preta visível, estilo
  CapCut/Instagram/Lightroom/TikTok.
- Resultado prático: ~8px verticais devolvidos ao stage no iPhone.

### Estrutura para futura timeline / play fixo superior

- `#midBar` marcado com `data-role="timeline-strip"` e `#pillsRow`
  com `data-role="timeline-pills"` — base semântica para a futura
  frame-strip contínua (swipe horizontal, frame ativo no centro).
- `#topBar` marcado com `data-role="top-bar"` — slot reservado para
  o futuro play permanente. Nenhuma mudança de layout/comportamento;
  apenas evita dependências (CSS/JS) que impeçam a evolução depois.

### Áreas explicitamente NÃO tocadas

- `getStateAtT`, `drawAtT`, `setFramePause`, `ensureFramePauses`,
  `refreshPauseControls` (apenas adicionado 1 hook de
  `refreshSliderFills` ao final).
- WebCodecs/export pipeline, MediaRecorder fallback.
- Easing, splines, curvas, templates, stage/aspect ratio.
- Sincronização v15u+ do estado de pausas por frame.
- Lógica de animação, preview, loops, finishing.

## v8z4b15z — Frame menu hierarchy and duration panel fixes

Correção dos problemas estruturais remanescentes da v15y. Foco:
sliders de pausa com a mesma largura útil dos sliders de segmento,
remoção definitiva do nested scroll, hierarquia correta do menu local
do frame (faixa de frames sempre visível) e padrão de navegação
estilo CapCut.

Todos os patches partem da v15y. **Não houve mudanças no motor**
(`getStateAtT`, `drawAtT`, `setFramePause`, `ensureFramePauses`,
`refreshPauseControls`, easing, splines, WebCodecs/export, templates,
stage/aspect ratio, sincronização v15u+).

### Sliders de pausa — largura útil real (problema estrutural)

- A v15y já tinha rows com mesmo padding/labels, mas o thumb das pausas
  ainda parecia preso por causa do `min-width:64px` na label e do
  `min-width:52px` no valor — em iPhone, o thumb perdia ~30% da faixa
  útil para esses dois polos.
- v15z introduz a classe **`.dur-edit-row`** (CSS unificado) usada por
  TODOS os sliders editáveis do painel Duração: Total dos segmentos,
  sliders por segmento, "Tudo" das pausas, sliders por frame de pausa
  e sliders de Acabamento. Estrutura: `display:flex; gap:12px;
  width:100%`, label `min-width:44px`, slider `flex:1 1 0; min-width:0`,
  valor `min-width:48px`. O thumb percorre a mesma largura útil em
  todas as seções.
- Removidos os `style.cssText` inline do `buildFramePauseRow` e do
  `openSegBreakdown` — antes podiam divergir entre versões; agora há
  uma única fonte de verdade na CSS (`.dur-edit-row`).
- `#panelDuration #segBreakdown`, `#framePauseSection`, `#finishSection`,
  `#segRows`, `#framePauseRows` são forçados a `width:100% !important;
  max-width:100% !important; box-sizing:border-box` — nenhum container
  intermediário consegue limitar a largura útil dos sliders.

### Nested scroll — eliminação definitiva

- Reforçado: `#panelDuration` é a única superfície que rola.
  Subseções (`#segBreakdown`, `#framePauseSection`, `#finishSection`,
  `#segRows`, `#framePauseRows`) agora têm `overflow:visible
  !important; max-height:none !important` com seletor mais específico
  (`#panelDuration #X`) para vencer qualquer regra antiga residual.

### Acabamento — padding superior

- `padding-top` aumentado de `22px` → `28px` ao abrir; `margin-bottom`
  do bloco de chips de `14px` → `18px`. O slider de retorno/duração não
  fica mais grudado ao título da seção.
- Linhas de slider (`#loopDurRow`, `#finishDurRow`) migradas para
  `.dur-edit-row` — mesma largura útil dos sliders de Segmentos/Pausas.

### "Tudo" como estado global real

- Estado já implementado em v15y (filtro grayscale + opacity:.55 +
  textos `var(--text3)` quando frames divergem; arrastar aplica a todos
  imediatamente). O seletor `.global-mixed` foi atualizado para casar
  com as novas classes `.dur-edit-label` / `.dur-edit-value`.
- Botão "Aplicar a todos" permanece removido — o slider "Tudo" é o
  ponto único de aplicação global.

### Menu local do frame — faixa de frames sempre visível

- Problema na v15y: `#custBar` era `position:fixed; bottom:0` e
  sobrepunha `#midBar` (faixa de frames) — o usuário perdia a
  visualização dos frames ao tocar no contextual.
- v15z: `#custBar` agora é **in-flow** (flex item de `.app`,
  `flex-shrink:0`). DOM order já posiciona `#midBar` antes de
  `#custBar`, então o painel ocupa apenas o slot da `#toolbar`
  (escondida via `body.cust-open #toolbar { display:none }`). A faixa
  de frames continua visível logo acima do menu local — sem deslocamento,
  sem sobreposição, sem espaço fantasma.
- Mantido `max-height:min(38dvh, 280px)` para limitar a altura do
  contextual.

### Navegação hierárquica estilo CapCut

- `#custBarBack`: removido o texto "Voltar"; a chevron passou de
  20×20 para **28×28**, sem moldura/fundo (apenas highlight sutil ao
  toque). Posicionada à esquerda do conteúdo expandido. Comportamento
  hierárquico:
  - Toque no frame → abre `#custBar` em `compact-mode` (só ícones)
  - Toque num ícone → expande os controles e revela a seta de voltar
  - Toque na seta → recolhe ao `compact-mode` (preserva aba ativa)
  - Toque fora (stage) → fecha `#custBar` por completo
- `#alignBar` (multiseleção): removido o botão `✕`, substituído por
  uma seta de voltar à esquerda (mesmo padrão visual). Limpa a
  multiseleção (`clearMultiSelect()`) — antes era um chip com um X.

### Direção futura (não implementado nesta versão)

- Edição em grupo (multiseleção) compatível com edição individual e
  global continua sendo a direção arquitetural — preservada para
  Escala/Rotação/Posição.
- Controles globais de Duração permanecem exclusivamente no painel
  Duração; não retornam para o menu local.

## v8z4b15x — Duration panel UX unification and local frame panel redesign

Refinamento sobre a v15w. Foco: equiparar visualmente os sliders de
"Pausas por frame" aos sliders de "Tempo por segmento", aumentar área
clicável dos botões auxiliares no painel local do frame, e reorganizar
o menu local para que o painel de ajuste **substitua** a barra de
ícones (em vez de empilhar) com uma seta de voltar dedicada.

### Sliders de pausa — paridade visual com os sliders de segmento

- `#framePauseSection` agora usa o mesmo container `flex-direction:column;
  gap:8px;padding-top:12px;margin-bottom:14px;` do `#segBreakdown`. Antes
  era um simples `padding-top:12px;margin-bottom:12px;`, sem o ritmo de
  gap das rows de segmento.
- Slider global de pausa: padding vertical da row passou de `8px 0` para
  `10px 0` (idêntico às rows de segmento). Label "Tudo" ajustado para
  `min-width:52px` (mesma largura da label dos segmentos individuais),
  garantindo que a track comece exatamente na mesma posição horizontal.
- Sliders por frame (`buildFramePauseRow`): label "F1..F10" passou de
  `min-width:36px` para `min-width:52px`, alinhando o início da track
  com os sliders de "Tempo por segmento" (`1-2`..`9-10`). Sem isso, a
  track das pausas começava ~16px antes e dava a sensação de slider
  menor / desalinhado.
- Adicionado cabeçalho "Pausa por frame · = Xs pausa" no topo dos
  sliders individuais, espelhando o cabeçalho "Tempo por segmento ·
  = Xs total" da seção Segmentos. `refreshPauseControls()` atualiza
  esse total junto com os demais.
- Resultado: mesma largura útil, mesma escala, mesma proporção. A
  diferença entre as duas seções é apenas semântica (intervalos vs
  pausas), não visual.

### Botões auxiliares / Reset — alvos de toque maiores

- Chips `−5%`/`+5%`/`Reset` (Escala), `−5°`/`+5°`/`Reset` (Rotação) e
  `Reset` (Duração local) passaram de `padding:8px 14px;font-size:12px`
  para `padding:11px 16px;font-size:13px;min-height:42px` com
  `justify-content:center`. Margin top da row de chips aumentado de
  `10px` para `14px`. Gap entre chips aumentado de `8px` para `10px`.
- Não parecem mais ícones decorativos perdidos; têm peso visual coerente
  com os thumbs/sliders ao lado.

### Painel local do frame — substituição em vez de empilhamento

- Quando o painel está expandido (mostrando controles), `#custBarTabs`
  é ocultado por CSS (`#custBar:not(.compact-mode) #custBarTabs{
  display:none }`). Quando recolhido (compact-mode), `#custBarContent`
  é ocultado. Os dois nunca aparecem ao mesmo tempo — o painel de
  ajuste substitui a barra de ícones.
- Adicionada seta de voltar `← Voltar` no topo do `#custBarContent`
  (`<div id="custBarBack">`). Ao tocar, chama `collapseCustBar()` que
  re-aplica `compact-mode`, voltando à barra de ícones com a aba ativa
  preservada.
- `switchCustTab()` simplificado: tocar em qualquer ícone agora SEMPRE
  expande para o ajuste daquela função (antes, re-tocar no ícone ativo
  recolhia, o que causava colapso acidental). O caminho oficial de
  voltar é a seta — sem ambiguidade.
- Stage-tap continua fechando o painel inteiro em qualquer modo
  (compact ou expandido), preservando o comportamento existente.

### Linguagem visual dos ícones — alinhada com a futura toolbar inferior

- Cada `.cust-tab` agora tem `<svg>` em cima + `<span class="cust-tab-lbl">`
  embaixo (`Escala`, `Rotação`, `Posição`, `Duração`). Layout vertical,
  ícone branco (`rgba(235,235,235,0.95)`) + label branco abaixo,
  `flex-direction:column;align-items:center;gap:4px;min-height:60px`.
- Aba ativa: ícone e label em `var(--accent)` (mesmo padrão de cor já
  existente, agora aplicado ao label também).
- Mesma linguagem visual da toolbar inferior principal planejada
  (faixa horizontal estilo mobile/TikTok, ícone + nome).

### Arquitetura preservada (intacta desde v15u)

- `setFramePause`, `ensureFramePauses`, `refreshPauseControls`,
  `getStateAtT`, `drawAtT`, motor de animação, easing, curvas/splines,
  WebCodecs/export, templates, stage/aspect ratio — sem alterações.
- Sincronização centralizada da v15u intacta: toda escrita em
  `framePauses[]` continua passando por `setFramePause`; todo refresh
  visual por `refreshPauseControls`; todo redimensionamento por
  `ensureFramePauses`.
- Todas as mudanças desta versão são CSS/markup (largura de label,
  padding, gap, container flex) + dois deltas mínimos em JS:
  `collapseCustBar()` (nova função) e remoção do toggle-on-active em
  `switchCustTab` (substituído pela seta de voltar). Nenhum handler
  novo na cadeia de pausas.

## v8z4b15w — Duration panel UX unification and local frame panel redesign

Refinamento estrutural sobre a base estável da v15u/v15v. Foco: UX,
organização, consistência visual, interação iPhone/Safari, clareza
semântica.

### Painel Duração — topo agora é só leitura

- Topo do painel passa a mostrar **apenas** a duração total e o breakdown
  por categoria: Duração total, Segmentos, Pausas, Acabamento.
- Removidos do topo: slider de segmentos, "Intervalo padrão" e botões
  editáveis. Topo não tem mais controle editável.
- Renomeado "Percurso" → "Segmentos" no card de breakdown.

### Seção Segmentos — todos os controles editáveis dos segmentos vivem aqui

- `durSlider` (slider proporcional dos segmentos) movido para dentro de
  `#segBreakdown`. Continua controlando apenas a soma dos segmentos —
  não inclui pausas nem acabamento.
- Input "Intervalo padrão" movido para dentro da seção.
- Botão "Igualar intervalos" maior e mais clicável.
- Sliders individuais com padding vertical aumentado (10px) para toque
  no iPhone.

### Seção Pausas por frame — slider global + botão "Aplicar a todos"

- Slider global (`framePauseGlobalSlider`) e os sliders por frame
  continuam usando `<input type="range">` nativo + classe `.dur-slider`
  + listeners simples (`input`/`change`) — mesmo padrão estrutural do
  painel de Segmentos, que já provou funcionar bem no iPhone/Safari.
- Adicionado botão "Aplicar a todos" → nova função
  `applyFramePauseGlobalToAll()`: lê o valor do slider global e força
  esse valor em todos os frames não-locked, útil para unificar quando o
  label mostra divergência ("0.7s\*").
- Linhas individuais com padding vertical 10px e gaps maiores; valor
  numérico com largura mínima 48px.
- Toda escrita continua passando por `setFramePause()`; redimensionamento
  por `ensureFramePauses()`; refresh por `refreshPauseControls()` —
  arquitetura estável da v15u preservada integralmente.

### Painel local do frame (`#custBar`) — controles em cima, ícones embaixo

- Markup invertido: `#custBarContent` (controles) é o **primeiro** filho;
  `#custBarTabs` (ícones) é o **último**. CSS migrado de
  `:first-child`/`:last-child` para alvos por ID — não depende mais da
  ordem.
- Comportamento "compact-first": ao primeiro toque no frame, o painel
  abre só com a barra de ícones embaixo (`compact-mode` adicionado por
  `openCustBar`). O segundo toque em qualquer ícone expande os controles
  acima. Tocar de novo no ícone ativo recolhe.
- Cadeado global (`#custGlobalLock`) removido do markup. Painel local
  agora é exclusivamente local — ajustes globais vivem no painel
  Duração. `custGlobalLock` (state) e `isCustLocked()` permanecem como
  no-op silencioso (sempre `false`), preservando os caminhos de código.
- Aba "framepause" rebatizada visualmente como "Duração/pausa local"
  no label do conteúdo. Texto secundário ajustado.
- Chips/Reset buttons aumentados (8px 14px) para alvos de toque
  acessíveis.

### Ícone semântico de duração

- Ícone da aba `framepause` substituído: era um ícone de "pause"
  geométrico; agora é um relógio (Lucide-style: círculo + ponteiros).
  Reflete o que o controle realmente faz: duração / timing /
  permanência / pausa local.

### Arquitetura preservada

- `setFramePause`, `ensureFramePauses`, `refreshPauseControls`,
  `getStateAtT`, `drawAtT`, motor de animação, easing, curvas/splines,
  WebCodecs/export, templates, stage/aspect ratio — sem alterações.
- `buildProjectData`/`applyFrameData` continuam persistindo
  `framePauses`.
- Sincronização centralizada da v15u intacta.

## v8z4b15v — Restore native slider UX for frame pauses on iPhone

Restaurada a UX do painel "Duração dos segmentos" para o painel "Pausas
por frame". A v15u trocou os sliders por steppers para resolver um
conflito de scroll no iPhone/Safari, mas o problema verdadeiro nunca
foi o `<input type="range">` nativo — era a implementação custom
(touch-action:none, gesture math manual, handlers duplicados). O
painel de segmentos prova que um range nativo, com listeners simples
(input/change) e sem touch-action override, convive bem com pan-y do
container. Reaproveitamos esse padrão aqui: mesma classe `.dur-slider`,
mesmos eventos, mesma estrutura.

## v8z4b15u — Stabilize frame pause state sync on iPhone

- **Causa raiz:** múltiplos caminhos paralelos escrevendo em `framePauses[]` (gesture custom em `bindPauseSlider`, listeners `input/change/touchend/pointerup` e `setFramePause`) sem fonte única de verdade. No iPhone/Safari, sliders nativos `input[type=range]` em lista rolável capturavam o pan vertical, causando alteração acidental ao tentar rolar; e o caminho de gesture atualizava o estado mas só refrescava o label/total ao soltar — daí "thumb se mexe e número fica em 0.0s". `removeLastFrame` também não fazia splice de `framePauses`, e o save/load de projeto não persistia pausas.
- **Centralização:** `setFramePause(idx, duration, opts)` é o único setter; `ensureFramePauses()` (alias `syncFramePausesLength()`) é o único redimensionador; `refreshPauseControls()` é o único refresh visual; `renderFramePauseRows()` reusa linhas e bind delegado único.
- **UX iPhone:** painel Duração agora usa stepper `−  0.0s  +  0` por frame (touch-action manipulation, hold-to-repeat) em vez de range slider — elimina conflito gesto/scroll. Painel local/contextual segue com slider, mas todas as escritas vão por `setFramePause`.
- **Persistência:** `framePauses` agora vai junto no `buildProjectData`/`applyFrameData`.
- **Não foi alterado:** `getStateAtT`, `drawAtT`, motor de animação, curvas/splines, easing, WebCodecs/export, templates, stage/aspect ratio, layout aprovado.
