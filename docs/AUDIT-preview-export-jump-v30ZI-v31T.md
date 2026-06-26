# Auditoria Forense — Pulo em Preview/Export (v8z4b30ZI → v8z4b31T)

**Projeto:** Arco Motion App / Ken Burns App
**Tipo:** Auditoria forense de regressão (Preview/Export), somente por histórico Git, diffs e código.
**Data:** 2026-06-26
**Sintoma confirmado pelo usuário:** pulo visual no Preview **e** no MP4 exportado; aparece em vários lugares.
**Pistas de diagnóstico:** `jumpType: rotation-delta-spike` / `camera-delta-spike`, `jumpSegmentIndex: 4`, `jumpFromFrameIndex: 4 → jumpToFrameIndex: 5`, `derivedStateDirtyReason: projectWorldComposite-dirty`, `exportUsedWorldRenderer: true`, `renderTransformConsistent: true`, `endpointContinuityOkAllSegments: true`, `framesChangedAfterPostLoad: false`.

---

## 1. Resumo executivo

A investigação foi conduzida por análise técnica do histórico (sem bisseção manual de versões). A conclusão é **forte e mensurável**:

> **Nenhum commit entre v8z4b30ZI e v8z4b31T modificou o caminho compartilhado de câmera/interpolação/render/export.** Todas as funções determinísticas desse caminho são **idênticas byte-a-byte** entre as duas versões. Os ~37 commits do intervalo são exclusivamente de **editor/overlay/modo/diagnóstico** (camadas de filme, z-index, Modo Câmera ↔ Modo Ativos, timeline, painel de Diagnóstico).

Prova direta (extração balanceada das funções nas duas revisões — `4a4b2a4` = v30ZI, `efe9eb4` = v31T):

| Função (caminho compartilhado Preview/Export) | v30ZI → v31T |
|---|---|
| `getStateAtT` | **IDÊNTICA** |
| `getStateAtTBase` (motor de câmera) | **IDÊNTICA** |
| `evaluateSegmentPath` | **IDÊNTICA** |
| `evaluateRuntimeCurveModel` | **IDÊNTICA** |
| `getCurvesV2CubicCP` (pontos de controle reais do render) | **IDÊNTICA** |
| `getSegAndLocalTAtTime` (amostragem temporal) | **IDÊNTICA** |
| `applyEaseAtEnds` (easing) | **IDÊNTICA** |
| `drawWorldToCanvas` (renderer mundo, Preview+Export) | **IDÊNTICA** |
| `renderFrameSafely` + 1200 linhas seguintes (loop export) | **IDÊNTICA** |
| `getProjectWorldCompositeSource` (cache composto) | **IDÊNTICA** |
| Relógio de Preview (`advancePreviewClockMs`, `PREVIEW_MAX_DT_MS`, `startPreview`) | **não tocado no intervalo** |
| Warm-up/preflight do renderer (v30ZI) | **não tocado no intervalo** |
| Detector de pulo (`_runPassiveJumpDetector30ZC`) | **não tocado no intervalo** |
| Loop de encode / WebCodecs (`renderVideoFrame`, encoder) | **não tocado no intervalo** |

**Consequência lógica decisiva:** o Export renderiza offscreen e **não usa overlays DOM**. Como o pulo aparece no MP4 exportado, ele **não pode** vir das camadas de filme/overlay (a única coisa que mudou no intervalo). E como o motor determinístico é idêntico, **o pulo não é uma regressão introduzida entre v30ZI e v31T** — é uma **descontinuidade pré-existente de câmera/rotação** no motor, que renderiza igual nas duas versões.

---

## 2. Última versão conhecida como estável (inferência do histórico)

Não há uma versão "estável" inferível *dentro deste intervalo* para o caminho Preview/Export, porque **o caminho é idêntico em todo o intervalo**. Em particular:

- **v8z4b30ZH** introduziu o mascaramento do pulo **apenas no Preview** (avanço temporal limitado, `PREVIEW_MAX_DT_MS`). O próprio comentário da versão declara: *"NÃO altera Export (render determinístico por frame)"*. Logo o **Export sempre exibiu o pulo cru** desde antes de v30ZI.
- **v8z4b30ZI** apenas adicionou warm-up assíncrono do renderer (eliminar tranco da **primeira passada** do Preview). Não toca a matemática.

A memória de que "v30ZI era estável" provavelmente reflete um projeto de teste diferente (o pulo é **dependente de dados** — frame 4→5 com um perfil de rotação específico), e/ou o fato de que em v30ZI o Preview já vinha mascarado por v30ZH. **v30ZI tem exatamente o mesmo motor que v31T.**

---

## 3. Lista de commits/PRs no intervalo (todos editor-only)

| Versão | Commit | PR | Natureza |
|---|---|---|---|
| v30ZJ | 959d473 | #343 | seleção de assets/layers no ProjectWorld (UI) |
| v30ZK | e096106 | #344 | alternância Modo Câmera/Ativos (UI) |
| v30ZL | 430a7a2 | #345 | refinamento visual de modos (UI) |
| v30ZM | f82ca82 | #346 | pills/ícones; **ordenação DOM de extras** + comentário em `drawWorldToCanvas` |
| v30ZN | 783145d | #347 | barra superior fixa (UI) |
| v30ZO | 747c068 | #348 | Frente/Trás, `renderProjectWorldExtraImages` (DOM editor) |
| v30ZP | dd7aee2 | #349 | estado de contexto Modo Ativos (UI) |
| v30ZQ | 4a17014 | #350 | central mode router (UI) |
| v30ZR | f44c0b0 | #351 | troca de modo / toolbar (UI) |
| v30ZS | af65782 | #352 | clareza visual Modo Ativos (UI) |
| v30ZT | 1f57a11 | #353 | separação Modo Ativos × Câmera (UI) |
| v30ZU | 530f972 | #354 | ghost handles, reorder (UI) |
| v30ZV | caad9ce | #355 | Frente/Trás render DOM, chips de frame; **invalidate composite só em reorder** |
| v30ZW | aeb6484 | #356 | menu frames/timeline (UI) |
| v30ZX | befc2b6 | #357 | UI ancorada ao frame |
| v30ZY | 7cde820 | #358 | estabilização visual; **invalidate composite só em delete/undo** |
| v30ZZ | 625e8a3 | #359 | camada absoluta de câmera acima dos assets (overlay DOM/SVG, `rAF` de overlay) |
| v31A | 5e9441a | #360 | curvas acima dos assets, Redo de delete; **invalidate composite em redo** |
| v31B | c05eb24 | #361 | toggle Modo Ativos (UI) |
| v31C | 5f7bf09 | #362 | curvas Bézier "reais" no overlay — **lê** `getCurvesV2CubicCP` p/ desenhar SVG |
| v31D | 6441e3a | #363 | geometria frame/curva (overlay) |
| v31E | 1f0fd07 | #364 | Unified Film Overlay System (overlay) — **lê** `getSegmentCurve` |
| v31F | b2d899b | #365 | Single Film System Architecture (overlay) |
| v31G | 5ec0c18 | #366 | **"curve parity fix"** — altera `drawBezier()` (curva ciano do editor), não o render |
| — | 50d2cf5 | #367 | restaurar alpha/scrim do filme (overlay) |
| — | c7219f2 | #368 | scrim global + visuais de referência (overlay) |
| v31J | 5410cf4 | #369 | stage film overlay layer stack — **revertido** |
| — | 2b910a0 | #370 | **Revert** do v31J |
| v31K | cbfdebc | #371 | overlay seguro acima dos assets + timeline ref sync (overlay) |
| — | 771b6f6 | #372 | DOM film layer restack, `renderProjectWorldExtraImages` |
| v31M | 17ea49b | #373 | scrim visual, timeline dots (overlay) |
| v31N | ba3669d | #374 | viewport-fixed film alpha scrim (overlay) |
| v31O | c9c3bdd | #375 | assets frame sync (UI) |
| — | ad66334 | #376 | menu de diagnóstico + contornos de frame (UI) |
| — | a50e870 | #377 | wiring do menu de diagnóstico |
| — | a4bbb99 | #378 | abrir painel de diagnóstico |
| v31S | 2dd53df | #379 | restaurar diagnóstico real (Debug Core) — `VideoEncoder` só em feature-check |
| v31T | efe9eb4 | #380 | hardening do coletor de diagnóstico |

Nenhum desses commits altera função do motor determinístico (ver tabela byte-a-byte da seção 1).

---

## 4. Tabela de arquivos/funções alteradas (tudo em `index.html`)

| Função citada na tarefa | Tocada no intervalo? | Onde | Toca render Preview/Export? |
|---|---|---|---|
| `getStateAtT` / `getStateAtTBase` | Não | — | — |
| `renderFrameSafely` / `renderVideoFrame` | Não | — | — |
| `drawWorldToCanvas` | Só **comentário** (v30ZM/ZV) | corpo idêntico | corpo inalterado |
| `evaluateSegmentPath`/`evaluateRuntimeCurveModel`/`evalCubicBezierPt` | Não | — | — |
| `getCurvesV2CubicCP`/`getSegmentCurve` | **Lido** por v31C/E/G | **`drawBezier()` e overlays do editor** | **Não** (somente desenho do editor) |
| `getProjectWorldCompositeSource`/`invalidateProjectWorldComposite` | invalidação **só em mutação** (load/undo/redo/add/replace/reorder) | v30ZV/ZY/ZZ/v31A | **Não** (nunca chamado em loop de render) |
| `segDurations`/`getSegAndLocalTAtTime`/`applyEaseAtEnds` | Não | — | — |
| Relógio Preview / warm-up | Não | — | — |
| `renderProjectWorldExtraImages` | Sim (DOM do editor) | v30ZM/ZO/ZV/ZY/v31A | **Não** (elementos `<img>` do editor; export usa canvas) |

---

## 5. Hipótese principal da causa

**Hipótese A — descontinuidade de câmera/rotação no motor (C1 / velocidade), pré-existente e dependente de dados.**

O `jumpType` é `rotation-delta-spike`/`camera-delta-spike` no limite do **segmento 4** (frame 4 → frame 5). Com `endpointContinuityOkAllSegments: true`, a **posição** é contínua (C0 ok) — o salto é de **velocidade/rotação** (C1) no keyframe: o segmento que chega ao frame 4 e o que sai dele têm taxas de rotação/movimento muito diferentes, produzindo um "tranco" percebido como pulo. Isso é comportamento intrínseco do motor:

- Posição via **Catmull-Rom** com `curvePuller` por segmento (`getStateAtTBase`, ~linha 21855+).
- Rotação por waypoint a partir de `frameRotations[]`, interpolada por segmento.
- `applyEaseAtEnds` aplica easing **nas pontas de cada segmento independentemente** → cria descontinuidade de velocidade entre segmentos vizinhos quando os easings/tangentes não coincidem.

Esse motor é **idêntico** em v30ZI e v31T. v30ZH apenas **suaviza o ritmo temporal no Preview** (limita `dt`); isso **não remove** uma descontinuidade geométrica/rotacional — só a distribui em mais frames. O Export nunca teve mascaramento algum.

---

## 6. Evidência por diff

- Extração balanceada de chaves das 10 funções do caminho compartilhado em `4a4b2a4` vs `efe9eb4`: **todas idênticas** (mesmos comprimentos e bytes) — seção 1.
- `git log -S` no intervalo para `evaluateSegmentPath`, `evaluateRuntimeCurveModel`, `buildRuntimeCurveModel`, `evalCubicBezierPt`, `getSegAndLocalTAtTime`, `segDurations`, `getStateAtTBase`, `applyEaseAtEnds`, `bezierPointAt`, `renderFrameSafely`, `renderVideoFrame`, relógio de Preview e warm-up: **0 commits**.
- `drawWorldToCanvas` aparece em `git log -S` (v30ZM/ZV) **apenas** por comentário/`renderProjectWorldExtraImages` adjacentes; corpo idêntico.
- `getCurvesV2CubicCP`/`getSegmentCurve` aparecem em v31C/E/G **somente como leitura** para desenhar o overlay do editor (`drawBezier`, `renderAssetsModeReferenceCurves`). O comentário de v31G é explícito: *"preserve: preview/export sem overlays"*.
- Diff de `renderFrameSafely` + 1200 linhas seguintes (todo o bloco de export): **idêntico**.

---

## 7. Evidência por diagnóstico

- `renderTransformConsistent: true`, `endpointContinuityOkAllSegments: true`, `framesChangedAfterPostLoad: false` → transform e **posição** consistentes; dados de frames íntegros após load. Reforça que **não** é Hipótese B (render/desenho/dados).
- `jumpType: rotation-delta-spike` em `jumpSegmentIndex: 4` → o salto é de **rotação/velocidade**, não de posição. Coerente com Hipótese A.
- `derivedStateDirty: true / projectWorldComposite-dirty / previewCacheDirty: true` → **não é causa de mid-render rebuild**: `invalidateProjectWorldComposite()` só é chamado em eventos de **mutação** (load, undo, redo, add, replace, reorder), **nunca** dentro do loop de Preview/Export. Esse flag dirty reflete o estado **antes da primeira reconstrução de warm-up** do composto (reconstrução preguiçosa em `getProjectWorldCompositeSource`), e o resultado da reconstrução é pixel-idêntico (mesma geometria 3×3). Ou seja: **pista a usar como contexto, não como prova de bug de cache.** (Observação alinhada à instrução de não tratar o detector passivo como prova de ausência de bug — aqui ele confirma rotação, não cache.)
- `exportUsedWorldRenderer: true` → Export usa `drawWorldToCanvas` (idêntico), confirmando que Preview e Export compartilham o mesmo render.

---

## 8. É câmera/interpolação ou render/desenho?

**É câmera/interpolação (Hipótese A).** 

- **Sustenta A:** `rotation-delta-spike`; `getStateAtTBase`/`applyEaseAtEnds`/Catmull-Rom idênticos e com easing por-ponta independente (gera C1 quebrado); pulo idêntico em Preview e Export; `endpointContinuityOkAllSegments: true` isola o problema em **velocidade/rotação**, não posição.
- **Enfraquece B (render/desenho):** `drawWorldToCanvas` e `renderFrameSafely` idênticos; composite invalidado só em mutação (nunca em loop); `renderTransformConsistent: true`; `framesChangedAfterPostLoad: false`; overlays DOM não existem no Export, mas o Export pula — logo não é overlay/draw order/“piscada”.

---

## 9. Recomendação de correção

Como **não há regressão no intervalo**, **não há revert seletivo possível** que resolva o pulo (reverter overlays não toca o motor). As opções reais, em ordem de menor risco:

1. **(Recomendada — primeiro) Medir antes de corrigir.** Rodar o teste único da seção 11 para confirmar, no projeto exato do usuário, **qual** descontinuidade domina (salto de rotação vs. salto de velocidade de translação) no segmento 4. Sem isso, qualquer patch no motor é especulativo. **Não abrir PR funcional ainda** (critério da Tarefa 8: o intervalo não contém a causa; a correção seria mudança de motor, não um patch pequeno de Preview/Export).
2. **Patch cirúrgico de continuidade C1 (se confirmado):** suavizar **somente a tangente de rotação** nos keyframes — interpolar `rot` com a mesma base Catmull-Rom já usada para posição (tangentes por waypoint), em vez de easing independente por segmento. Mudança localizada em `getStateAtTBase` (bloco de rotação), aplicada igualmente a Preview e Export (mesmo motor → paridade automática). Risco médio (altera trajetória de rotação de projetos existentes).
3. **Isolamento de cache/render:** **não recomendado** — a evidência mostra que o cache do composto não é a causa.

> Importante: a opção 2 é uma alteração de **motor de interpolação**, não um "ajuste de Preview/Export". Por isso ela **não** deve ser misturada com overlays/Layers/menu/Diagnóstico/UI, e só deve ser feita após a medição da seção 11.

---

## 10. Riscos da correção

- Alterar a interpolação de rotação muda a **trajetória de TODOS os projetos existentes** (não só o do bug) — risco de "aprovado vira reprovado" em outros vídeos. Precisa de validação A/B de câmera-trace em vários samples.
- Como Preview e Export usam o mesmo motor, a correção propaga para os dois (bom para paridade, mas amplia a superfície de regressão).
- Se o salto real for de **escala/translação** (Catmull-Rom com `curvePuller` assimétrico no segmento 4), mexer só na rotação não resolve — daí a obrigatoriedade da medição primeiro.
- Não tocar: overlays/film, Layers, Modo Contextual, Settings, Diagnóstico (exceto ler), layout, cores, ícones, fluxo.

---

## 11. Teste mínimo necessário (único, automatizável — sem bisseção manual)

Há projetos de teste no repositório (`samples/*.json`) e já existe instrumentação embutida: `previewTrace30ZC` / `exportTrace30ZC`, o detector `_runPassiveJumpDetector30ZC`, e a flag `DEBUG_PREVIEW_CLOCK`. **Um único teste**, sem testar versões antigas:

1. Carregar **um** projeto que reproduza o pulo (preferir o que o usuário usou; senão, um `samples/*.json` com ≥6 frames e rotação variável).
2. Gerar um **camera-trace por frame** chamando `getStateAtT(t)` para `t` em passos finos (ex.: 240 amostras) sobre toda a duração — a **mesma** função de Preview e Export.
3. Computar, por amostra, os deltas de `rot` e do vetor de câmera `(cx,cy,sw,sh)`; calcular a **segunda diferença** (aceleração) ao redor do limite do segmento 4 (frame 4→5).
4. **Critério mensurável:** localizar o pico de `|Δrot|`/`|Δcâmera|` e confirmar se ele coincide com a fronteira de segmento (descontinuidade C1). Comparar a magnitude do pico no segmento 4 com a média dos demais segmentos (mesma lógica do detector passivo). 

Esse trace decide objetivamente entre rotação vs. translação **e** valida a correção depois (o pico deve sumir/cair abaixo do limiar). Como Preview e Export compartilham `getStateAtT`, basta **um** trace para cobrir ambos — não é preciso exportar MP4 nem testar v31S/v31N/v30ZI manualmente.

> Se o projeto exato do usuário não estiver no repositório, este relatório declara: usar `samples/*.json` como proxy e, idealmente, pedir ao usuário **apenas o JSON do projeto que pula** (um arquivo, não uma bateria de versões) para reproduzir com fidelidade.

---

---

# ADENDO — Investigação ancorada no horário (último export bom ~22:04 UTC)

**Âncora fornecida:** último export bom ≈ 2026-06-25 19:04 BRT ≈ **22:04 UTC**; diagnóstico v31T gerado 2026-06-25 **22:05:10Z**. Comportamento ruim observado **depois** disso.

## A.1 — Reconstrução exata da linha do tempo (commit UTC, todos os branches)

| Hora UTC | Commit | Evento | Estado de `index.html` |
|---|---|---|---|
| 2026-06-25 21:59:31Z | `efe9eb4` | **v8z4b31T** (harden diagnostics) | **base BOA** |
| 2026-06-25 22:00:43Z | `f5e4307` | Merge #380 → main | **v31T em produção** |
| **~22:04 UTC** | — | **último export BOM** + diagnóstico v31T (22:05:10Z) | **= v31T** |
| 2026-06-26 00:23:56Z | `46de57b` | **v8z4b32A** "contextual assets mode menu" | v32A (bump correto) |
| 2026-06-26 00:24:09Z | `80fabfb` | Merge #381 → main | **v32A em produção (~17 min)** |
| 2026-06-26 00:40:51Z | `3533f08` | **Revert** de v32A | restaurado |
| 2026-06-26 00:41:10Z | `abdbfc4` | Merge #382 → main (**HEAD atual**) | **= v31T byte-a-byte** |

Não há **nenhum** outro commit após o merge de v31T, em **nenhum** branch (`git log --all --since="22:00:43"`).

## A.2 — Build ativo às 22:04 UTC

**v8z4b31T** (`efe9eb4`, publicado via merge `f5e4307` às 22:00:43Z). É exatamente o build do diagnóstico das 22:05:10Z. **Build bom = v31T.**

## A.3 — Houve alteração sem bump correto de versão? **NÃO.**

- v32A **bumpou corretamente** `APP_VERSION = APP_VERSION_NAME = 'v8z4b32A'` (diff explícito `-'v8z4b31T'` → `+'v8z4b32A'`). Não reutilizou o rótulo v31T.
- O **revert** restaurou `index.html` **exatamente** ao estado pré-v32A: `git diff f5e4307 3533f08 -- index.html` = **vazio**.

## A.4 — v31T foi reaproveitada/redeployada com código diferente? **NÃO.**

`git diff efe9eb4 HEAD -- index.html` = **vazio**. O `index.html` atualmente publicado é **idêntico byte-a-byte** ao v31T bom. A label diz v31T porque **o código É v31T**. Working tree limpo (só este relatório é novo).

## A.5 — O único commit após 22:04 que poderia importar: v32A — **não tocou o caminho compartilhado**

Diff de v32A (`46de57b`, 193 linhas) filtrado por `drawWorldToCanvas | renderFrameSafely | getStateAtT | evaluateSegment | getCurvesV2CubicCP | invalidateProjectWorldComposite | _worldCompositeDirty | previewElapsed | startPreview | renderVideoFrame | getProjectWorldComposite | drawAsset | renderProjectWorld` = **0 ocorrências**. v32A é só menu contextual de modo (Layers/Ver frames/Inserir/Trocar/ordem de assets). Comentário da versão: *"Preview/Export/ProjectWorld não alterados."*

## A.6 — Cache / service worker / build artifact

- **Sem service worker** no projeto (`navigator.serviceWorker` ausente). **Sem workflow de build/deploy** (`.github/workflows` não existe; Pages publica `main` direto — não há etapa que injete código diferente).
- **PORÉM:** `pages-deploy-stamp.txt` documenta histórico do **GitHub Pages servindo build velho ao iPhone/webapp** ("the published GitHub Pages webapp still shows v8z4b29BZ on iPhone/webapp" apesar do merge). Esse é o **único vetor real** pelo qual "bom às 22:04, ruim depois" pode ocorrer com o código de servidor idêntico: **cache de cliente (Safari/iOS "adicionar à tela inicial") ou CDN do Pages servindo o `index.html` do v32A (ou misto) ao usuário**.

## A.7 — Veio de Preview/Export/câmera/render ou de estado compartilhado?

**Não veio de código de Preview/Export/câmera/render/interpolação/ProjectWorld/timeline/cache/WebCodecs após 22:04** — esse código é idêntico em v31T e no HEAD atual, e v32A não o tocou. As explicações reais, em ordem de probabilidade:

1. **Cache de cliente / iOS webapp / CDN do Pages** servindo o v32A (ou build velho) ao usuário enquanto o repositório já estava bom — vetor documentado neste repo. **Mais provável.**
2. **Export gerado durante a janela em que v32A esteve no ar (00:24–00:41 UTC).** Mesmo assim, o motor de render de v32A == v31T; só produziria salto se os **dados do projeto** diferissem.
3. **Mutação de dados do projeto sob o novo menu de v32A** (reordenar assets / Ver frames / Inserir / Trocar) gravando uma descontinuidade no projeto salvo. **Reverter o código NÃO desfaz mutação de projeto salvo** — o JSON do usuário pode conter agora o salto.
4. **Spike de rotação pré-existente** (seções 5/8) — presente igualmente em todos os builds; aflora conforme o perfil de rotação do frame 4→5 do projeto.

## A.8 — Menor correção possível / revert seletivo

**Não há revert de código a fazer:** o build atual já É o v31T bom (`diff` vazio). Não existe regressão de render no código publicado.

Ações mínimas, em ordem:
1. **Cache-bust no dispositivo do usuário** (recarregar forçado / remover e readicionar o webapp à tela inicial) e **conferir a versão exibida**: se aparecer **v8z4b32A**, é cache servindo build velho → resolvido pelo bust. Opcional e cirúrgico: atualizar `pages-deploy-stamp.txt` para forçar redeploy do Pages (mesma técnica já usada em v8z4b29CA) — **não toca código de app**.
2. **Reexportar o MESMO projeto** com a versão confirmada como v31T. Se **não** pular → era cache/v32A. Se **ainda** pular → ver item 3.
3. Se ainda pular em v31T confirmado: é o **spike de rotação pré-existente** (seção 5). Aí, e só aí, aplica-se o **patch cirúrgico de continuidade de rotação** em `getStateAtTBase` (seção 9), precedido da medição da seção 11. Verificar também se o **JSON do projeto** foi mutado sob v32A (ordem de assets / rotações do frame 4→5).

> Critério de PR (Tarefa 8): **não abrir PR funcional agora** — não há causa de código no caminho Preview/Export após 22:04. Qualquer PR seria (a) `pages-deploy-stamp.txt` para forçar redeploy (infra, não app), ou (b) patch de motor de rotação (somente após medição confirmar). Nenhum toca menu contextual/Layers/UI.

---

## Respostas diretas às 5 perguntas da tarefa

1. **Quais commits entre v30ZI e v31T tocaram Preview/Export/câmera/render?** Nenhum tocou o **caminho determinístico** compartilhado (motor idêntico byte-a-byte). Tocaram **apenas overlays/editor**: composite invalidado em mutação (v30ZV/ZY/ZZ/v31A) e leitura de curvas para overlay (v31C/E/G). Ver seções 3–4.
2. **Suspeito principal?** Não há commit-suspeito no intervalo. A causa é **pré-existente**: descontinuidade de rotação/velocidade no motor (`getStateAtTBase` + `applyEaseAtEnds`), mascarada só no Preview por v30ZH e sempre presente no Export.
3. **Câmera/interpolação ou render/desenho?** **Câmera/interpolação** (rotation-delta-spike, C1 quebrado no segmento 4). Render/desenho está descartado por evidência.
4. **Menor correção possível?** Primeiro **medir** (seção 11). Se confirmado, **patch cirúrgico de continuidade de rotação** em `getStateAtTBase` (tangentes Catmull-Rom para `rot`), aplicado ao motor único → paridade Preview/Export automática. **Não** é um revert e **não** é um patch "só de Preview/Export".
5. **Teste único depois?** O **camera-trace por frame** via `getStateAtT` (seção 11): o pico de `|Δrot|` na fronteira do segmento 4 deve cair abaixo do limiar do detector passivo.
