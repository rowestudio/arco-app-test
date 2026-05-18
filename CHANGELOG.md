# Changelog

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
