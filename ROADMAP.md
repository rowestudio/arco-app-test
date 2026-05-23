# Roadmap

## Objetivo imediato — v8z4b20c (concluído)

- ✅ Corrigir exibição de handles para endpoints e loop (F1, último frame, com/sem loop).
- ✅ Handles baseados em trechos conectados, não apenas em frame intermediário.
- ✅ Segment-local editing: cada handle edita apenas o trecho conectado.
- ✅ Desativar atualização automática dos dois trechos vizinhos por drag.
- ✅ Handles de loop em F1 (IN) e último frame (OUT) via `loopCtrlPt`.
- ✅ Helpers `getFrameConnectedHandleTargets`, `getFrameHandleGeometry`, `applyFrameConnectedHandleEdit`.
- ✅ Midpoint oculto; ctrl-pt legado oculto; JSON schema inalterado.
- ✅ Bugfix mover frame preservado (v8z4b19z).

## Objetivo anterior — v8z4b20b (concluído)

- ✅ Substituir handle único simétrico por dois handles: IN handle (entrada) e OUT handle (saída).
- ✅ Modo suave/linkado por padrão (os dois ctrlPts atualizados em 180° ao arrastar qualquer handle).
- ✅ Geometria derivada dos ctrlPts reais via `getActiveFrameInOutHandleGeometry()`.
- ✅ Força por distância preservada (v8z4b19z).
- ✅ Bugfix mover frame preservado (v8z4b19z).
- ✅ JSON schema inalterado.
- ✅ Handles não aparecem em F1, último frame, loop, Preview, isoMode.
- ✅ Midpoint continua oculto; ctrl-pt legado continua oculto.

## Objetivo anterior — v8z4b20a (concluído)

- ✅ Ocultar midpoint automático da UI principal.
- ✅ Manter midpoint apenas como recurso interno/legado/fallback.
- ✅ Manter handle de frame da v8z4b19z como ferramenta visível principal de curva.
- ✅ Registrar no ROADMAP o modelo futuro de âncoras e handles.
- ✅ JSON schema inalterado.

## Objetivo anterior — v8z4b19z (concluído)

- ✅ Corrigir reset da tangente/curva ao mover frames.
- ✅ Diferenciar visualmente handle de frame (losango) do midpoint pathPoint (círculo).
- ✅ Distância do handle controla força da tangente.
- ✅ `getFrameTangentGeometry()` substitui `getFrameTangentDir()`.
- ✅ JSON schema inalterado.

## Decisão de produto consolidada — v8z4b20a

O midpoint automático NÃO é ferramenta principal da interface.
Ele cria dois sistemas concorrentes (midpoint do trecho + handles do frame),
o que não é desejado para a interface final.

**O sistema final será baseado em:**
- Frames como âncoras principais de câmera.
- Handles de entrada e saída nos frames.
- Estados Angular / Suavizar / Reta / Remover.
- Pontos auxiliares criados explicitamente pelo usuário quando necessário.
- Ferramenta futura Pen/Patch para trajetórias vetoriais.
- Ferramenta futura de desenho livre com dedo.

**"Puxar a curva" no futuro:**
- É uma metáfora para ajustar handles — não midpoint persistente e concorrente.
- Midpoint automático pode existir como legado/fallback interno, mas não como controle normal.

## Modelo futuro de curva — âncoras e handles

### Arquitetura geral

- **Frames são âncoras principais de câmera** (anchor points).
- Cada frame poderá ter **handle de entrada** e **handle de saída**.
- Os handles controlam a tangência da curva de Bézier que passa pelo frame.

### Modos de handle

**1. Suavizar / Arredondar (modo padrão):**
- Handles de entrada e saída vinculados em 180° (colineares).
- Passagem contínua e suave pelo frame (C1 continuity).
- Mover um handle realinha automaticamente o oposto.
- Comportamento similar ao Illustrator "smooth anchor".

**2. Angular / Livre:**
- Handles de entrada e saída independentes.
- Permite ângulo reto, agudo, obtuso ou quebra narrativa entre segmentos.
- Mover um handle não altera o oposto.
- Comportamento similar ao Illustrator "corner anchor".

### Ações contextuais futuras (inspiradas no Illustrator para iPad)

| Ação | Efeito |
|---|---|
| **Suavizar / Arredondar** | Transforma o frame em âncora suave; alinha handles em 180°. |
| **Angular** | Transforma o frame em âncora angular; handles independentes. |
| **Reta** | Neutraliza handles do frame; segmentos vizinhos ficam retos. |
| **Remover** | Remove o ponto; une os trechos (só para pontos auxiliares). |

**Regras:**
- Para **frame real**, "Remover" é ação estrutural de frame (excluir frame) — tratar com cuidado.
- Para **ponto auxiliar**, "Remover" remove o ponto do caminho e une os trechos.
- "Reta" neutraliza handles sem necessariamente remover o frame.
- "Suavizar" e "Angular" alteram apenas o modo do handle, sem mover âncora.

### Estado atual (v8z4b20c)

- **Frame IN/OUT handles (v8z4b20c):** handles visíveis para qualquer frame com trecho conectado:
  - **IN handle** (`.frame-in-handle`): controla o trecho de entrada; âmbar (normal) ou roxo (loop).
  - **OUT handle** (`.frame-out-handle`): controla o trecho de saída; âmbar (normal) ou roxo (loop).
  - **Segment-local editing:** cada handle edita apenas o trecho diretamente conectado.
  - Modo Angular/Livre: **ainda não implementado** — roadmap futuro.
  - Suavização automática de dois trechos (modo linkado): **desativada nesta versão**.
- **Handles de loop (v8z4b20c):** F1 com loop mostra IN handle (→ `loopCtrlPt`);
  último frame com loop mostra OUT handle (→ `loopCtrlPt`).
- **Loop ctrl-pt (`cpt_loop`):** oculto quando handles de loop estão disponíveis.
- **Frame tangent handle (v8z4b19z):** ocultado; substituído pelos dois handles IN/OUT.
- **Midpoint pathPoint:** demovido da UI principal (v8z4b20a); mantido internamente.
- **ctrl-pt/losango legado:** não exibido como controle principal para segmentos normais.

### Limitações do schema legado (v8z4b20c)

No schema atual, cada trecho normal possui apenas um `ctrlPt`:
- `ctrlPts[segIndex]` controla todo o trecho.
- O handle OUT de F4 e o handle IN de F5 são dois acessos ao mesmo `ctrlPts[segIndex]` do trecho F4→F5.
- Eles **não** têm independência persistente nesta versão.
- Ao editar um, o outro refletirá a mesma posição ao selecionar o frame vizinho — comportamento esperado.
- Independência real de handles (tangentes de entrada e saída separadas) exige modelo futuro `curvesV2` ou cúbico.

### Próximos passos de handles (futuro, não imediato)

- **Modo Angular/Livre real:** handles independentes; menu contextual Suavizar/Angular/Reta/Remover.
- **Menu contextual** estilo Illustrator para iPad: ações por toque longo no frame ativo.
- Implementar ação "Reta" (neutralizar handles).
- **Suavizar automático entre frames (modo linkado):** ação explícita futura — desativado em v8z4b20c para evitar interferência entre frames.
- Reset local da curva do frame ativo.
- Reset global de curvas.
- Handles independentes persistidos no JSON (novo schema, nova versão maior).
- **Ponto auxiliar / frame falso:** criar ponto no meio de um trecho sem duplicar frame real.
- **Pen / Patch Tool:** construção vetorial do caminho.
- **Desenho livre com dedo:** traço livre → frames com handles suaves.
- Bug: _file.json sem imageBase64 para fase de UI/carregamento.
- Velocidade composta (ease de velocidade além de ease de curva).
- Preservação de proporções internas de tempos.

## Pontos auxiliares / frame falso

Se o usuário precisar controlar o meio de um trecho:
- Deve criar um **ponto auxiliar** (ou "frame de passagem") explicitamente.
- Esse ponto auxiliar será editável e poderá ter handles próprios.
- Não deve ser midpoint automático permanente.
- "Remover" em ponto auxiliar une os segmentos sem excluir frames adjacentes.
- **Não implementado nesta versão** — requer UI de criação e ferramenta de inserção.

## Ferramentas futuras de construção de movimento

### 1. Pen / Patch Tool

Inspirado no Illustrator Pen Tool, adaptado para iPhone/Safari.

- Usuário toca/clica para criar ponto/frame (âncora).
- Usuário toca/clica e **arrasta** para criar frame com handles (tangente).
- Cada ponto nasce como frame por padrão (âncora com tempo) até o usuário indicar o contrário.
- Frame criado pode ser promovido a ponto de passagem sem tempo próprio (auxiliar).
- Comportamento de handle ao criar: arrastar define direção e comprimento da tangente de saída.
- Handle de entrada no ponto seguinte é o oposto do de saída (modo suave por padrão).

### 2. Desenho livre com dedo

- Usuário **desenha livremente** o movimento de câmera no Stage com o dedo.
- App **interpreta o traço** automaticamente.
- App **cria pontos/frames editáveis** ao longo do traço.
- Usuário **refina** depois com handles, Angular/Suavizar, Reta/Remover.
- Pós-processamento: simplificação do traço (redução de pontos redundantes).
- Resultado: frames editáveis com handles suaves derivados da curvatura do traço.

**Fluxo:**
1. Usuário ativa modo de desenho livre.
2. Usuário desenha o caminho desejado da câmera.
3. App exibe prévia dos frames gerados.
4. Usuário confirma ou descarta.
5. Frames gerados entram no editor normal (handles, Undo/Redo, etc.).

## Próximo passo

## v8z3v — Estabilização mínima

- Corrigir escala global resetando curvas no Template Circular.
- Ajustar Fixar ativo para destaque vermelho.
- Validar export WebCodecs após as correções.
- Não mexer em motor, easing, curva ou UI estrutural.

## v8z3w — Interação de curva

- Aumentar área de toque da bolinha de edição da curva.
- Reforçar preferência pela edição da curva direto no Stage.
- Ao inserir frame entre dois frames, posicionar o novo frame sobre a curva existente.
- Preservar curva ao alterar escala após carregar projeto.

## v8z3x — Suavização inteligente

- Botão “Suavizar curva”.
- Easing automático de rotação.
- Amaciamento automático de escala entre segmentos.
- Avaliar como mostrar esses controles sem sobrecarregar a UI.

## Futuro — Zoom assistido por frame ativo

- Ao selecionar frame muito pequeno, o app pode aproximar automaticamente a região do frame.
- Ao tocar fora ou selecionar outro frame, pode retornar ao zoom 100%.
- Deve respeitar zoom manual do usuário (não sobrescrever se ele já ajustou).
- No modo normal, o zoom continua contextual (comportamento atual, aprovado em v8z4b18b).
- No Modo Mapa/Curvas, o zoom pode ficar sempre visível por ser um modo de precisão.

## Futuro — Modo Mapa / Curvas — edição avançada de trajetória

O Modo Mapa atual deve evoluir para um modo de edição de trajetória mais completo.
Esse modo pode incorporar o futuro Modo Curvas, sendo tratados como um único modo de precisão.

### Zoom e navegação

- O zoom de edição deve ficar sempre disponível nesse modo.
- A ferramenta de pan (mãozinha) deve ficar disponível sempre que houver zoom ativo.

### Opacidade da imagem-base

- Deve existir controle de opacidade da imagem-base/fundo nesse modo.
- A opacidade ajuda a destacar curvas, frames, pontos e trajetória sobre o fundo.
- O controle de opacidade é apenas visual/editorial: não altera Preview, MP4 nem JSON da animação.

### Destaque visual de curvas

- Curvas devem ter maior destaque visual nesse modo em relação ao modo normal.

### Evoluções futuras desse modo (não imediato)

- Pontos-guia de curva.
- Conversão frame ↔ ponto-guia.
- Handles de tangência local (bezier handles).

## Futuro — Evolução do modelo runtime de curva (v8z4b19c+)

O `buildRuntimeCurveModel` introduzido na v8z4b19c e ampliado na v8z4b19e já
inclui o contrato runtime completo de `pathPoints`, `handles` e `capabilities`.
O modelo está preparado para receber implementação real futura sem quebrar
compatibilidade. Nenhum desses itens está ativo — são apenas contrato vazio.

### Estado atual (v8z4b20a)

- **Frame tangent handle (v8z4b19z, foco atual):** handle losango/diamante âmbar (`.frame-tangent-dot`) no frame ativo intermediário; conectado por linha tracejada âmbar (braço de tangente); drag ajusta `ctrlPts[fi-1]` e `ctrlPts[fi]` simultâneamente para passagem suave C1-ish; distância do handle controla força da tangente; tangente preservada ao mover frame (`getFrameTangentGeometry()` + `applyFrameTangentEdit()` com t/perpX/perpY); undo lazy; JSON schema inalterado.
- **Midpoint pathPoint — DEMOVIDO da UI principal (v8z4b20a):** midpoint pathPoint permanece apenas como recurso interno/legado/fallback; nunca renderizado como controle normal; `display:'none'` sempre; `pointer-events:none`; código de pipeline guardado preservado (`buildRuntimeCurveModel`, `simulateRuntimePathPointEdit`, etc.).
- **ctrl-pt/losango legado — não reexibido como controle principal (v8z4b20a):** sempre com `opacity:0 + pointer-events:none` em segmentos normais; loop ctrl-pt mantido interativo (sem handle alternativo para loop).
- **Legacy curvePuller/losango (v8z4b19x):** histórico — foi oculto quando midpoint estava ativo; agora (v8z4b20a) também midpoint foi ocultado, e ctrl-pt nunca reaparece como primário.
- `pathPoints` contém um `pathPoint` derivado em `t=0.5` — amostra real da trajetória atual, calculada pela mesma fórmula quadrática. Não editável, não renderizado, não persistido no JSON.
- `handles: []` — contrato runtime vazio; campo presente mas sem conteúdo.
- `capabilities: { supportsPathPoints: false, supportsHandles: false }` — modo ativo: `legacyQuadratic`.
- `spans[]` — dois `quadraticSpan` derivados representando a curva legada dividida em dois sub-spans por De Casteljau em `t=0.5`. Apenas runtime: não persistidos, não renderizados, não editáveis. Introduzidos na v8z4b19h.
  - `spans[0]` (`derivedFirstHalf`): P0 → M com controle A = lerp(P0,C,0.5).
  - `spans[1]` (`derivedSecondHalf`): M → P1 com controle B = lerp(C,P1,0.5).
  - M coincide com `pathPoints[0]` (derivedMidpoint).
  - Propriedade: `span1(s) = B_orig(s/2)` e `span2(s) = B_orig(0.5+s/2)`.
- `evaluateSegmentPath()` continua com resultado matematicamente idêntico à v8z4b19l.
- Nenhum campo novo persiste no JSON.
- O `pathPoint` derivado NÃO tem UI, NÃO é editável e NÃO altera a trajetória.
- Os spans derivados NÃO têm UI, NÃO são editáveis, NÃO alteram a trajetória.
- `evaluateRuntimeCurveModel()` usa `spans` como caminho preferencial (v8z4b19l), com fallback para `evaluateRuntimeLegacyQuadratic()`. Resultado matemático idêntico.
- `isValidRuntimePoint(pt)` — valida x/y finitos. Introduzido na v8z4b19l.
- `evaluateRuntimeLegacyQuadratic(model, t)` — lógica legacyQuadratic anterior, extraída como fallback explícito. Introduzido na v8z4b19l.
- `validateDerivedRuntimePathPoint(model)` — diagnóstico passivo: confirma coerência matemática entre `pathPoint` derivado e `evaluateRuntimeCurveModel(model, 0.5)`, com conversão explícita de unidades (normalizado → pixels). Introduzido na v8z4b19g.
- `diagnoseRuntimeCurveSegment(segIndex)` — encapsula diagnóstico por segmento. Introduzido na v8z4b19g.
- `diagnoseRuntimeCurveModel()` — agrega diagnóstico de todos os segmentos ativos. Introduzido na v8z4b19g.
- `lerpPointNormalized(a, b, t)` — lerp normalizado para divisão De Casteljau. Introduzido na v8z4b19h.
- `splitLegacyQuadraticAtMidpoint(start, control, end)` — divisão De Casteljau em t=0.5. Introduzido na v8z4b19h.
- `validateDerivedRuntimeSpans(model)` — diagnóstico passivo dos spans derivados: verifica midpoint match e reconstituição por amostragem. Introduzido na v8z4b19h.
- `deriveLegacyCurvePullerFromMidpoint(start, midpoint, end)` — inversão da Bézier quadrática: C = 2·M − 0.5·P0 − 0.5·P1. Entrada/saída em normalizado (0–1). Introduzido na v8z4b19m.
- `deriveLegacyCurvePullerFromRuntimePathPoint(model, pathPoint)` — wrapper: extrai anchors do runtime model e deriva curvePuller equivalente do pathPoint runtime. Introduzido na v8z4b19m.
- `compareDerivedPullerWithRuntimeControl(model)` — diagnóstico passivo: compara curvePuller derivado do pathPoints[0] com controls[0]; retorna delta normalizado e delta em pixels. Por construção, delta deve ser zero. Introduzido na v8z4b19m.
- `cloneRuntimeCurveModelLight(model)` — clone leve e independente do runtime model; todos os campos copiados por valor; base para simulação de edição. Introduzido na v8z4b19p.
- `createRuntimeCurveModelWithCandidatePuller(model, candidatePuller)` — cópia runtime com controls[0] substituído pelo candidatePuller; pathPoints e spans recalculados internamente; o campo `candidate: true` marca o controle como hipotético; não altera model original, ctrlPts nem loopCtrlPt. Introduzido na v8z4b19p.
- `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)` — simula o efeito de mover pathPoint para nextPoint: deriva curvePuller candidato via `C = 2·M − 0.5·P0 − 0.5·P1`, constrói previewModel (cópia runtime com candidato), calcula delta entre curvePullers original e candidato. Sem UI, sem persistência, sem renderização. Introduzido na v8z4b19p.
- `compareSimulatedPathPointEdit(model, proposedPathPoint)` — diagnóstico passivo: simula edição e amostra curva original vs simulada em 9 pontos; retorna deltas em pixels e normalizado por amostra; sem UI, sem persistência, sem renderização. Introduzido na v8z4b19p.
- **Pipeline runtime de edição simulada preparado (v8z4b19p):** o fluxo `pathPoint movido → deriveLegacyCurvePullerFromMidpoint() → curvePuller candidato → previewModel` está implementado e validável em runtime. Sem UI e sem persistência nesta versão. O schema persistido continua sendo `ctrlPts / ctrlPtManual / loopCtrlPt`.
- `runtimeCurvePullerToLegacyCtrlPt(candidatePuller, fallbackCtrlPt)` — converte curvePuller runtime `{ x, y }` para shape legado `{ nx, ny, t, perpX, perpY }`; preserva `t/perpX/perpY` do ctrlPt atual; apenas prepara objeto, não aplica. Introduzido na v8z4b19q.
- `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)` — constrói patch candidato indicando `ctrlPts[segIndex]` ou `loopCtrlPt` que seria alterado; `applied: false` sempre; não altera estado real. Introduzido na v8z4b19q.
- `validateLegacyCurvePatchCandidate(patch)` — valida estrutura e campos do patch candidato; retorna `{ ok, reason, checks }`; não altera estado. Introduzido na v8z4b19q.
- `createSimulatedPathPointEditPatch(model, target, pathPoint, nextPoint)` — função de alto nível: simula edição → monta patch → valida; retorna `{ ok, reason, simulation, patch, patchValid }`; não aplica nada. Introduzido na v8z4b19q.
- `compareLegacyPatchCandidateWithCurrentControl(model, patch)` — diagnóstico passivo: compara `patch.value` com controle atual do schema persistido; retorna delta em normalizado e pixels; não altera estado. Introduzido na v8z4b19q.
- **Pipeline de patch legado candidato preparado (v8z4b19q):** o fluxo completo `pathPoint movido → simulateRuntimePathPointEdit() → curvePuller candidato → legacy curve patch candidate` está implementado. O patch identifica exatamente `ctrlPts[segIndex]` ou `loopCtrlPt` e o valor candidato em formato `{ nx, ny, t, perpX, perpY }`. Sem UI, sem aplicação real e sem persistência nesta versão. O schema persistido continua sendo `ctrlPts / ctrlPtManual / loopCtrlPt`.
- `cloneLegacyCurveStateForPatch()` — cópia leve e independente dos campos legados de curva (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`, `loopEnabled`); deep copy campo a campo; sem ref. mutável; sem alteração de estado global. Introduzido na v8z4b19r.
- `applyLegacyCurvePatchCandidateToDraft(draftState, patch)` — aplica patch validado em `draftState` (clone); substitui `ctrlPts[index]` ou `loopCtrlPt` no draft; marca `ctrlPtManual[index] = true` no draft; não altera estado real; não chama `pushUndo`/`markProjectDirty`/`renderAll`. Introduzido na v8z4b19r.
- `createLegacyCurvePatchApplicationDraft(patch)` — função de alto nível: valida patch → clona estado antes e depois → aplica patch no clone `after` → retorna `{ ok, patchValid, before, after, appliedField, appliedIndex, appliedToDraft: true, appliedToRealState: false }`; estado real intocável. Introduzido na v8z4b19r.
- `validateLegacyCurvePatchApplicationDraft(result)` — verifica integridade do draft: `result.ok`, `before`/`after` existem, `appliedToDraft === true`, `appliedToRealState === false`, estado real não foi mutado, arrays com tamanhos coerentes; retorna `{ ok, reason, checks }`. Introduzido na v8z4b19r.
- `compareLegacyCurvePatchDraftWithCurrentState(result)` — diagnóstico passivo: compara `before`/`after` do draft; indica índice alterado e delta (`dNx`, `dNy`, `distNorm`); confirma que estado real permanece igual; não altera nada. Introduzido na v8z4b19r.
- **Draft applier de patch legado preparado (v8z4b19r):** existe um aplicador guardado/interno capaz de produzir uma cópia/draft do estado de curvas com o patch aplicado, sem mutar o estado real. Sem UI, sem aplicação real, sem persistência nova.
- `validateRealCurvePatchApplicationOptions(options)` — valida e normaliza opções para `applyLegacyCurvePatchCandidateToRealState`; garante que `allowRealMutation` só é `true` se explicitamente definido; todos os defaults são seguros (false); não altera estado. Introduzido na v8z4b19s.
- `applyLegacyCurvePatchCandidateToRealState(patch, options)` — **aplicador real guardado**: por padrão retorna `{ ok: false, reason: 'real-mutation-disabled' }` sem alterar nada; quando `allowRealMutation: true` (não usado nesta versão), aplica patch em `ctrlPts[index]` ou `loopCtrlPt` e opcionalmente chama `pushUndo`/`markProjectDirty`/`renderAll`; não conectado a UI/Stage/Preview/gesto/save/load nesta versão. Introduzido na v8z4b19s.
- `dryRunApplyLegacyCurvePatchCandidate(patch)` — dry-run explícito: valida patch, gera draft, valida draft, compara before/after; confirma `appliedToRealState: false`; não altera estado real. Introduzido na v8z4b19s.
- `compareRealCurveStateSnapshot(before, after)` — diagnóstico passivo de dois snapshots de `cloneLegacyCurveStateForPatch()`; compara `ctrlPts` e `loopCtrlPt`; retorna `{ ok, unchanged, deltas }`; não altera estado. Introduzido na v8z4b19s.
- **Aplicador real guardado preparado (v8z4b19s):** `applyLegacyCurvePatchCandidateToRealState` existe como helper interno guardado, com guarda forte (`allowRealMutation: false` por padrão), sem conexão com nenhum fluxo público. Tempos/proporções continuam apenas no roadmap futuro. Velocidade composta continua apenas no roadmap futuro. Criação de frame seguindo curva de loop registrada como roadmap futuro (ver abaixo).
- `runInternalCurvePatchSelfTestForModel(model, options)` — harness interno principal: valida o pipeline completo de patch de curva (simulação → patch → validação → dry-run → apply com guarda → snapshot antes/depois) sem mutação real; `allowRealMutation: false` sempre; confirma `guardOk`, `realStateUnchanged`, `appliedToRealState: false`; não conectado a UI/Stage/Preview/gesto/save/load; não chama pushUndo/markProjectDirty/renderAll. Introduzido na v8z4b19t.
- `runInternalCurvePatchSelfTestForSegment(segIndex, proposedOffset)` — harness para segmento normal: constrói runtime model via `buildRuntimeCurveModel()` e delega a `runInternalCurvePatchSelfTestForModel()`; não altera estado. Introduzido na v8z4b19t.
- `runInternalCurvePatchSelfTestForLoop(proposedOffset)` — harness para curva de loop: roda self-test no loop se ativo; retorna `{ ok: false, reason: 'loop-disabled' }` se loop inativo; não altera estado. Introduzido na v8z4b19t.
- `runInternalCurvePatchSelfTestSuite()` — suite completa: roda self-test em segmento normal + loop (se ativo); retorna resumo com `segmentResult`, `loopResult`, `summary`; **não roda automaticamente** em nenhum fluxo público. Introduzido na v8z4b19t.
- **Self-test interno do pipeline de patch preparado (v8z4b19t):** o harness `runInternalCurvePatchSelfTestSuite()` valida o pipeline completo `pathPoint → simulação → patch candidato → dry-run → apply guardado` sem mutação real. Disponível em `window.__arcoInternalDiag.curvePatchSelfTest` apenas para diagnóstico de desenvolvimento.
- `createLegacyCurvePatchFromCurrentCurveEdit(target, nextCtrlPt)` — monta patch candidato compatível com `validateLegacyCurvePatchCandidate()` a partir de `{ nx, ny, t, perpX, perpY }` já calculados durante edição de curva; `applied: false` sempre; não altera estado. Introduzido na v8z4b19u.
- `applyExistingCurveEditViaPatch(target, nextCtrlPt, options)` — roteia edição de curva existente pelo aplicador guardado: cria patch → valida → aplica com `allowRealMutation: true`; pushUndo/markDirty/render gerenciados externamente pelo chamador. Introduzido na v8z4b19u.
- **Edição de curva existente agora passa pelo aplicador guardado (v8z4b19u):** `setSegmentTrajectoryPoint()` usa `applyExistingCurveEditViaPatch()` em vez de `setSegmentCurve()` direto; curvas normais e curva de loop incluídas; comportamento visual idêntico à v8z4b19t; Undo/Redo/markDirty/render preservados; JSON schema inalterado; nenhum campo novo.
- **Midpoint pathPoint editável implementado (v8z4b19v):** `pathPoints[0]` (em `t=0.5`) agora é visível como círculo branco arrastável sobre curvas ativas; drag usa `simulateRuntimePathPointEdit()` → `createLegacyCurvePatchFromSimulatedPathPointEdit()` → `validateLegacyCurvePatchCandidate()` → `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true })`; loop também suportado; curvePuller legado preservado; JSON schema inalterado; nenhum campo novo.
- **Midpoint pathPoint elevado a controle principal (v8z4b19w):** z-index elevado para 76 (supera ctrl-pt em 75); `ctrl-pt`/losango recebe `pointer-events: none` + `opacity: 0.38` quando midpoint pathPoint está ativo no segmento — fica visível mas não intercepta gestos; loop corrigido da mesma forma (`loopEl` vira secundário quando `midpt_loop` está visível); `.mid-pathpt` adicionado ao whitelist do `attachImageAreaCloseHandler()`; pipeline guardado preservado; JSON schema inalterado; nenhum campo novo.
- **Reset global de curvas registrado como roadmap futuro:** não implementado; avaliar integração com o pipeline guardado quando a UI estiver pronta.
- **Bug de `_file.json` sem `imageBase64`** mantido apenas no ROADMAP (fase UI/carregamento futura). Tempos/proporções mantidos no roadmap futuro. Velocidade composta mantida no roadmap futuro. Criação de frame seguindo curva de loop mantida no roadmap futuro.

### Próximos passos (futuros, não imediatos)

- **Handles independentes de entrada e saída no frame:** separar tangente de chegada e saída no frame ativo (atualmente simétrica); requer UI de alternância entre tangente simétrica e assimétrica.
- **Handles em F1/último frame com loop:** estender o frame tangent handle para o primeiro e último frame quando loop está ativo; tangente de chegada/saída do segmento de loop.
- **Reset local da curva do frame:** desfazer ajuste de tangente do frame ativo específico, restaurando curvePuller dos dois segmentos adjacentes para posição automática.
- **Handles/tangentes estilo Illustrator em frameAnchors e pathPoints:** controles de tangência; requer `mode = 'vectorAnchors'` e avaliador Bézier cúbico.
- **Handles nos frames:** suporte a tangentes diretamente associadas a frameAnchors.
- **Handles nos pathPoints:** suporte a tangentes diretamente associadas a pathPoints.
- **Múltiplos pathPoints por trecho:** adicionar pontos de passagem além do midpoint em t=0.5 (ex: t=0.25, t=0.75); requer modelo de edição mais completo.
- **Modo caneta / criação de trajetória vetorial:** clicar cria frame; clicar e arrastar cria handle; modo desenho livre.
- **Reset global de curvas:** resetar todos os `ctrlPts` + `loopCtrlPt` para posição padrão; conectar ao pipeline guardado; preservar Undo/Redo.
- **Bug `_file.json` sem `imageBase64`:** arquivos salvos sem imagem não têm `imageBase64`; ao reabrir, app deve tratar ausência sem erro ou campo fantasma.
- **Preservação de proporções internas dos tempos:** ao alterar duração total, preservar proporções relativas dos `segDurations`; requer UI de confirmação.
- **Velocidade composta:** combinação de easing + velocidade relativa por segmento; requer modelo de controle por trecho.
- **Criação de frame seguindo curva de loop:** inserir novo frame ao longo da trajetória do loop; posição inicial derivada da curva, não do centro do stage.
- Adicionar `pathPoints` reais como pontos de passagem sem tempo próprio.
- Adicionar `handles` de tangência para controle Bézier cúbico.
- Implementar `mode = 'vectorAnchors'` com avaliador Bézier cúbico.
- Schema JSON versionado para persistir `pathPoints` e `handles`.
- Migração controlada de `legacyQuadratic` → `vectorAnchors`.

### Nota sobre movimento inteligente

Movimento inteligente pode continuar como configuração global, mas futuramente
pode haver exceções ou parcialidade por trecho ou por passagem de frame.
Não implementar enquanto o conceito ainda não estiver fechado.

## Futuro — Ferramenta de caneta / criação de trajetória vetorial

Decisão de produto registrada em v8z4b18k. Não implementado ainda.

- Modo criar frames: clicar cria frame; clicar e arrastar cria frame com tangência.
- Modo criar pontos de passagem (pathPoints): clicar cria ponto; clicar e arrastar cria handle.
- Modo desenho livre: o app interpreta o traçado e sugere pontos e/ou frames.
- Ao deletar frame: oferecer opção de converter em ponto de passagem.
- Conversão ponto de passagem ↔ frame: em ambas as direções.
- Edição de handles: transformar ponto suave em canto e vice-versa.
- Desenho livre poderá gerar pontos e/ou frames após confirmação e escolha do tempo total.
- curvePuller (legado) coexiste com pathPoints; migração somente ao entrar no modo vetorial.

## Futuro — Criação de frame seguindo curva de loop

Registrado em v8z4b19r. Não implementado ainda.

- Ao ativar loop, oferecer opção de criar novo frame posicionado automaticamente
  sobre a curva de loop, em um ponto de passagem calculado pela trajetória ativa.
- O novo frame deve seguir a curvatura do segmento de loop (avaliado via
  `evaluateSegmentPath` no segmento de loop).
- Sem alteração de schema: o novo frame seria um frame comum, inserido no array
  de frames; a curva de loop seria automaticamente recalculada/ajustada.
- Não implementar enquanto o modelo de edição de pathPoint não estiver finalizado.

## Futuro — Modo de ajuste global de transformação

Registrado em v8z4b19b. Não implementado ainda.

- Permitir aplicar escala, deslocamento e rotação a todos os frames do projeto de uma vez.
- Diferente de ajuste local de frame individual.
- Diferente de seleção múltipla de frames.
- Deve retornar na fase de interface, após estabilização do motor atual.

## v9 — Interface final

- Nova interface completa.
- Home com arquivos recentes, se houver wrapper nativo.
- Menu contextual de frame/segmento.
- Visualização temporal interativa.
- Leitura visual de velocidade no trajeto.
- Refinamentos de overlay, painéis e microinterações.
