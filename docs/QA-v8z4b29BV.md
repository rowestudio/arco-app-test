# QA — v8z4b29BV: corrige recuo da lista, ícone de trecho, hierarquia, densidade e bug de Pausa global

> Base: **v8z4b29BU** (compacta Edição de Tempo, amplia ícone de trecho e
> padroniza toggles/ícones globais). Objetivo: **correção visual/UX** dos
> problemas deixados pela v8z4b29BU + **bug pontual de "Aplicar a todos" na
> Pausa de frame**. Sem mudança de motor, JSON, Preview, export, Stage,
> timeline ou lógica principal (Tremor, Movimento Inteligente, Velocidade
> Constante).

---

## 1. O que mudou (apenas apresentação + bug pontual)

### 1.1 Recuo lateral esquerdo da lista (Edição de Tempo, aba Tempo)

- `.dur-edit-row > .dur-edit-icon-label`: `min-width` de `84px` para
  `64px` e `gap` de `2px` para `1px`.
- Coluna de identificação de frames/trechos fica mais próxima da borda
  útil do painel; sliders ganham largura útil adicional (`.dur-slider`
  continua `flex:1 1 0`).
- `.dur-edit-row`: `gap:10px` → `8px`.
- Estrutura da lista (`buildFramePauseRow`/`buildSegDurationRow`)
  inalterada — apenas dimensões via CSS.

### 1.2 Ícone de trecho ~80% do tamanho da v8z4b29BU

- `.seq-icon-segment` (`i-seq-segment`, segmento com dois círculos):
  `78×42px` → `62×34px` (~80%), ainda maior que o tamanho pré-BU
  (`39×21px` na v8z4b29BT).
- Lógica preservada: número do trecho continua **acima** do ícone; ícone
  continua sendo o segmento com dois círculos (não foi trocado).
- `.seq-icon-frame` (ícone de frame) inalterado: `39×39px`.

### 1.3 Número + ícone de trecho como bloco único

- `.dur-edit-row > .dur-edit-icon-label`: `gap` reduzido de `2px` para
  `1px` — número do trecho (`.seq-icon-seg-num`) e ícone
  (`.seq-icon-segment`) ficam visualmente agrupados, sem sobrepor.
- Número do trecho continua acima, ícone continua abaixo.

### 1.4 Hierarquia tipográfica dos números de frame/trecho

- `.seq-icon-frame .seq-icon-num` (número dentro do ícone de frame):
  `14px` → `10px` — discreto, cabe bem dentro do ícone, não compete com
  `.dur-edit-value`.
- `.seq-icon-seg-num` (número do trecho, acima do ícone): `15px` →
  `11px` — discreto, mas legível mesmo com dois dígitos (10–11, 24–25,
  30–31).
- `.dur-edit-value` (valor em segundos) **inalterado** — continua sendo a
  informação mais valorizada da linha.

### 1.5 Espaçamento vertical da lista

- `.dur-edit-row`: `padding:6px 0` → `4px 0`.
- Distância entre frame/trecho/frame seguinte reduzida, mantendo área
  mínima de toque no iPhone (sliders/ícones preservam tamanho).

### 1.6 Espaçamento geral do painel Edição de Tempo

- `.dur-section-header`: `margin:4px 0 0` → `2px 0 0`,
  `padding:10px 0 8px` → `8px 0 6px`.
- `.dur-section-body`: `padding-top:4px` → `2px`.
- `.dur-subitem`: `padding:6px 0` → `4px 0`.
- `.dur-sublabel-row`: `padding:6px 0 4px 0` → `4px 0 2px 0`.
- `.dur-subitem-action`: `margin:4px 0` → `3px 0`, `padding:10px 0` →
  `8px 0` (mantém `min-height:44px`, alvo de toque preservado).
- `.dur-summary-box`: `gap:6px` → `4px`, `margin-bottom:8px` → `6px`,
  `padding:12px` → `10px`.
- `.dur-velocity-block{margin-bottom:8px}` → `6px`.
- Inline styles de `#cena1Block`, `#segBreakdown`, `#framePauseSection`,
  `#finishSection` e do resumo (`margin-bottom`/`padding-top`) reduzidos
  de forma equivalente.
- Nenhum slider, valor, cálculo ou ordem funcional de blocos foi alterado.

### 1.7 Painel "Tempo do trecho" (`#panelSegTime`) — altura compacta

- `#panelSegTime > .panel-handle{margin:0 auto 12px}` → `8px`.
- `#panelSegTime > .dur-header-row{margin-bottom:10px}` → `8px`.
- Bloco "Duração" (`.ease-channel-block`): `padding:10px` (inline) → `8px`
  (alinhado à regra `#panelSegTime .ease-channel-block{padding:8px}`).
- Margem interna entre label "Duração"/globo e o slider:
  `margin-bottom:8px` → `6px`.
- Conteúdo (handle, identificação "SEG. X–Y", check/fechar, label
  "Duração", `#segTimeGlobeLock`, slider `#easePanelSegSlider`, valor
  `#easePanelSegVal`) inalterado — só o respiro diminuiu, eliminando o
  vazio inferior remanescente.
- Nenhum canal de Movimento/Tremor/Rotação/Escala foi adicionado a este
  painel.

### 1.8 fix(frame): "Aplicar a todos" na Pausa de frame

- **Bug corrigido**: o slider local de pausa (`#framePauseSlider`,
  vinculado em `_bindLocalFramePauseSliderOnce`) não consultava
  `isCustLocked()`/`custGlobalLock.framepause` — escrevia sempre apenas no
  frame ativo via `setFramePause(idx, ...)`, mesmo com o ícone global
  (`#custGlobalLock`) ativado.
- **Correção**:
  - `_bindLocalFramePauseSliderOnce`: handlers `input`/`change` agora
    checam `isCustLocked()`; se `true`, aplicam o valor do slider a
    `framePauses[i]` de **todos os frames destravados** via
    `setFramePause(i, slider.value, ...)`.
  - `toggleCustGlobalLock()`: ao ativar `custGlobalLock.framepause`
    (aba Pausa ativa), aplica imediatamente o valor de pausa do frame
    ativo (`framePauses[activeIdx]`) a todos os frames destravados —
    cobre o fluxo "global depois" (usuário ajusta o slider e só então
    ativa o global).
- **Fluxo 1 — global antes**: abrir Pausa → ativar global → mover slider
  → todos os frames recebem o novo valor (handler `input`/`change`).
- **Fluxo 2 — global depois**: abrir Pausa → mover slider → ativar global
  → valor atual é aplicado a todos (via `toggleCustGlobalLock`).
- Afeta **apenas** `framePauses[]` (Pausa de frame). Não altera
  `segDurations[]`/duração de trechos, `frameRotations[]`, posição
  (`nudgePos`) ou escala (`nudgeScale`/`nudgeAllScale`) — esses já
  funcionavam corretamente e permanecem inalterados.
- Atualização visual (`refreshPauseControls`/`renderAll`) e
  salvamento/leitura via `framePauses[]` (JSON) preservados;
  Preview/export respeitam os valores atualizados (mesma fonte de
  verdade).

### 1.9 "Novo Projeto" → "Novo" (fallback)

- `.start-launcher-btn`: `white-space:nowrap; overflow:hidden;
  text-overflow:ellipsis;` — impede quebra de linha.
- Nova função `fitNovoProjetoLabel()`: ao exibir o launcher
  (`showStartLauncher()`) e em `resize`, mede `scrollWidth` vs
  `clientWidth` do botão primário; se "Novo Projeto" não couber em uma
  linha, troca o texto para "Novo".
- `onclick="launcherStartNewProject()"` e o fluxo do botão **inalterados**
  — apenas o texto exibido pode mudar.

---

## 2. O que NÃO mudou (preservação)

- Lógica de Tremor (Global/Desligado/Personalizado), herança, salvamento,
  Preview/export do Tremor.
- Lógica de Movimento Inteligente e de Velocidade Constante
  (`setSegmentTimingMode`/`syncTimingModeUI`).
- Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção
  simples/múltipla.
- Painel Movimento (`#panelEase`) fora dos ajustes citados.
- `setFramePause`, `refreshPauseControls`, `resetAllFramePauses`,
  `distributeSegEqual`, `setSegEaseAll`, `applyEaseAllChannels`,
  `nudgePos`, `nudgeRotation`, `nudgeScale`/`nudgeAllScale` — apenas
  `_bindLocalFramePauseSliderOnce`/`toggleCustGlobalLock` ganharam o
  ramo de aplicação a todos para Pausa.
- Ordem título→toggle/global (Velocidade Constante, Movimento/Rotação/
  Escala Inteligente, Tremor Global, `#segTimeGlobeLock`,
  `#custGlobalLock`) e hierarquia `.dur-item-title` — já corrigidas na
  v8z4b29BU, mantidas sem alteração.
- Preview, export MP4, JSON (antigo e novo), templates, formato, launcher
  (fluxo), logo, ícone iOS, motor de renderização.

---

## 3. Checklist de aceite

1. [ ] A versão visível mostra **v8z4b29BV** (`APP_VERSION` +
   `APP_VERSION_NAME` + texto de versão nos Ajustes).
2. [ ] O recuo esquerdo excessivo da lista do painel Edição de Tempo
   desapareceu.
3. [ ] A coluna de ícones/números fica mais próxima da borda útil do
   painel.
4. [ ] O ícone de trecho está visivelmente menor que na v8z4b29BU, em
   torno de 80% do tamanho anterior, e maior que o tamanho pré-BU.
5. [ ] O número do trecho fica próximo do ícone de trecho (sem espaço
   grande entre eles).
6. [ ] Número + ícone de trecho formam um único bloco visual (sem
   sobreposição).
7. [ ] O número dentro do ícone de frame está mais discreto (menor) que
   na v8z4b29BU.
8. [ ] O número do trecho (acima do ícone) está mais discreto que na
   v8z4b29BU.
9. [ ] Os valores de tempo (segundos) à direita continuam mais
   valorizados visualmente que os números de frame/trecho.
10. [ ] A lista está mais compacta verticalmente (mais itens visíveis por
    tela), preservando área de toque.
11. [ ] O painel Edição de Tempo tem menos vazios entre Cena 1, Trechos —
    Duração, Frames — Pausas e Acabamento.
12. [ ] O painel "Tempo do trecho" (`#panelSegTime`) está compacto, sem
    espaço vazio abaixo do bloco Duração.
13. [ ] No painel de Pausa do frame, ativar "Aplicar a todos"
    (`#custGlobalLock`) **antes** de mover o slider e então mover o
    slider aplica o novo valor de pausa a todos os frames.
14. [ ] No painel de Pausa do frame, mover o slider **e então** ativar
    "Aplicar a todos" aplica o valor atual a todos os frames.
15. [ ] O bug de "Aplicar a todos" na Pausa está corrigido sem quebrar os
    outros painéis (Rotação, Escala, Posição/Mover) onde já funcionava.
16. [ ] Toggles (Velocidade Constante, Movimento/Rotação/Escala
    Inteligente, Tremor Global) continuam aparecendo depois do título.
17. [ ] Ícones globais/"Aplicar a todos" (`#easeGlobeLock`,
    `#easeGlobeRot`, `#easeGlobeScale`, `#segTimeGlobeLock`,
    `#custGlobalLock`) continuam aparecendo depois do título/conteúdo.
18. [ ] Nenhum controle aparece antes do texto/título do item.
19. [ ] "Novo Projeto" não quebra linha no launcher; se não couber,
    aparece "Novo".
20. [ ] A lógica do Tremor não mudou (Global/Desligado/Personalizado,
    herança, Preview/export).
21. [ ] A lógica de Movimento Inteligente não mudou.
22. [ ] A lógica de Velocidade Constante não mudou.
23. [ ] **Preview** continua funcionando normalmente.
24. [ ] **Export MP4** continua funcionando normalmente.
25. [ ] **JSON antigo** continua abrindo.
26. [ ] **JSON novo** salva e reabre normalmente.
27. [ ] Sem regressões no Stage, timeline, curvas/Bézier, seleção ou
    controles de duração/sliders no iPhone/Safari.

---

## 4. Riscos e mitigação

- **Redução de colunas/ícones**: alterações restritas a
  `.dur-edit-icon-label`, `.seq-icon-segment`, `.seq-icon-seg-num`,
  `.seq-icon-frame .seq-icon-num` (CSS já dedicado); markup de
  `buildFramePauseRow`/`buildSegDurationRow` inalterado.
- **Compactação de espaçamentos**: todos os `min-height:44px` de botões
  tocáveis (`.dur-subitem-action`) preservados; apenas espaços vazios ao
  redor reduzidos.
- **fix(frame) Pausa global**: ramo novo isolado em
  `_bindLocalFramePauseSliderOnce`/`toggleCustGlobalLock`, condicionado a
  `activeTab === 'framepause'`/`isCustLocked()` — não afeta `rot`/`scale`/
  `pos`, cujos fluxos de `isCustLocked()` permanecem como estavam
  (`nudgePos`, `nudgeRotation`, `nudgeScale`/`nudgeAllScale`).
  `setFramePause()` (fonte única de verdade) inalterado; apenas chamado
  para mais índices quando o global está ativo.
- **`fitNovoProjetoLabel()`**: função nova, somente leitura de
  `scrollWidth`/`clientWidth` e troca de `textContent` — não altera
  `onclick`/fluxo de `launcherStartNewProject()`.
