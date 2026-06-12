# QA — v8z4b29BU: compacta Edição de Tempo, amplia ícone de trecho e padroniza toggles/ícones globais

> Base: **v8z4b29BT** (ícones de frame/trecho ~50% maiores no painel Edição de
> Tempo). Objetivo: ajuste **visual/UX e de padronização de componentes** —
> corrigir densidade, hierarquia e padronização de controles que a v8z4b29BT
> deixou pendentes. Sem mudança de motor, JSON, Preview, export, Stage,
> timeline ou lógica principal (Tremor, Movimento Inteligente, Velocidade
> Constante).

---

## 1. O que mudou (apenas apresentação)

### 1.1 Ícone de trecho ~2x maior (Edição de Tempo, aba Tempo)

- `.seq-icon-segment` (`i-seq-segment`, segmento com dois círculos nas
  extremidades): de `78px` de largura por `42px` de altura (era `39×21px` na
  v8z4b29BT) — aproximadamente o dobro.
- `.seq-icon-seg-num` (número do trecho, acima do ícone, ex. "10–11"): de
  `13px` para `15px`, mantendo `white-space:nowrap` para não espremer
  trechos com dois dígitos (10–11, 12–13, 24–25, 30–31).
- `.dur-edit-icon-label` (coluna esquerda): `min-width` de `50px` para
  `84px` e `gap` de `3px` para `2px`, para acomodar o ícone maior sem
  encostar no `.dur-slider` (que continua `flex:1 1 0`) e sem empurrar
  `.dur-edit-value` para fora.
- `.seq-icon-frame` (ícone de frame, número dentro) **inalterado**:
  continua `39×39px`. Apenas o ícone de trecho cresceu.
- `buildFramePauseRow(i)`/`buildSegDurationRow(seg)`: nenhuma alteração de
  estrutura/markup — apenas tamanhos via CSS.

### 1.2 Lista e blocos do painel Edição de Tempo mais compactos

- `.dur-edit-row`: `padding:14px 0` → `6px 0`, `gap:12px` → `10px`.
- `.dur-section-header`: `margin:6px 0 0` → `4px 0 0`,
  `padding:14px 0 10px` → `10px 0 8px`.
- `.dur-section-body`: `padding-top:6px` → `4px`.
- `.dur-subitem`: `padding:10px 0` → `6px 0`.
- `.dur-subitem-action`: `margin:8px 0 4px` → `4px 0`,
  `padding:11px 0` → `10px 0` (mantém `min-height:44px`, alvo de toque
  preservado).
- `.dur-sublabel-row`: `padding:12px 0 4px 0` → `6px 0 4px 0`.
- `.dur-velocity-block`: `margin-bottom:14px` → `8px`.
- `.dur-summary-box`: `gap:8px` → `6px`, `margin-bottom:14px` → `8px`,
  `padding:14px` → `12px`.
- Inline styles dos blocos `#cena1Block`, `#segBreakdown`,
  `#framePauseSection`, `#finishSection` e do bloco "Nenhum/Loop/Pausa
  final" tiveram `padding-top`/`margin-bottom` reduzidos de forma
  equivalente.
- Nenhum slider, valor, cálculo de duração/pausa ou ordem funcional de
  blocos foi alterado.

### 1.3 Painel "Tempo do trecho" (`#panelSegTime`) compacto

- `#panelSegTime > .panel-handle{margin:0 auto 12px}` (era `18px` via
  `.panel-handle` base).
- `#panelSegTime > .dur-header-row{margin-bottom:10px}` (era `14px`).
- `#panelSegTime .ease-channel-block{padding:8px}` (era `10px`).
- Conteúdo (handle, identificação "SEG. X–Y", check/fechar, label
  "Duração", `#segTimeGlobeLock`, slider `#easePanelSegSlider`, valor
  `#easePanelSegVal`) inalterado — apenas o respiro ao redor diminuiu,
  eliminando o vazio inferior do painel.

### 1.4 Ordem universal: título primeiro, controle depois

- **Velocidade Constante** (Edição de Tempo): label "Velocidade constante"
  agora vem antes do `#constSpeedToggle` (antes o toggle vinha primeiro).
- **Movimento Inteligente** (painel Movimento, aba Velocidade): label
  "Movimento inteligente" antes de `#movSmartToggle`, que vem antes do
  ícone `#easeGlobeLock` ("Aplicar a todos").
- **Rotação Inteligente** / **Escala Inteligente**: mesma correção —
  label antes de `#rotSmartToggle`/`#scaleSmartToggle`, ícones
  `#easeGlobeRot`/`#easeGlobeScale` continuam depois.
- **Tremor Global** (Preferências `#tremorGlobalToggle` e painel Movimento
  `#tremorGlobalToggle2`): label "Tremor Global (projeto inteiro)" antes do
  toggle.
- `#segTimeGlobeLock` (painel Tempo do trecho) já estava correto (label
  "Duração" antes do ícone) — sem alteração.
- Todos os `id`s, `onchange`/`onclick` e handlers permanecem idênticos —
  apenas a ordem dos elementos no markup foi invertida.

### 1.5 Hierarquia tipográfica de itens principais

- Nova classe `.dur-item-title` (`font-size:15px`, `font-weight:600`,
  `color:var(--text)` — branco, `letter-spacing:normal`,
  `text-transform:none`).
- Aplicada a:
  - "Velocidade constante" (Edição de Tempo) — antes `.dur-sublabel`
    (11px, uppercase, letter-spacing, cinza).
  - "Movimento inteligente" (painel Movimento) — antes estilo inline
    11px cinza.
  - "Tremor" (painel Movimento, título da seção de Tremor) — antes
    `.ease-section-label` (10px, uppercase, letter-spacing, cinza).
- "Rotação Inteligente"/"Escala Inteligente" e textos auxiliares ("Tremor
  Global do projeto", "Tremor deste trecho") mantêm o estilo secundário
  existente — fora do escopo desta correção de hierarquia.

### 1.6 "Aplicar a todos" nos painéis de frame

- Novo botão `#custGlobalLock` (ícone `i-globe-lock`, 22×22px) adicionado
  ao final de `#custBarContent`, visível para qualquer aba ativa do menu
  contextual de frame (Pausa/Rotação/Escala/Posição).
- `onclick="toggleCustGlobalLock()"` — função e estado
  `custGlobalLock = { scale, rot, pos, framepause }` **já existiam em JS**
  (incluindo CSS `#custGlobalLock`/`.global-on` e o reset em
  `switchCustTab`/`resetCustGlobalLocks`), mas não havia elemento na UI.
  Esta versão apenas expõe o controle já implementado.
- `isCustLocked()` (usado por `nudgePos`, `nudgeRotation`,
  `resetFramePause`/pausas e ajustes de escala) passa a ser alcançável
  pela UI, sem nenhuma mudança de lógica.

---

## 2. O que NÃO mudou (preservação)

- Lógica de Tremor (Global/Desligado/Personalizado), herança, salvamento,
  Preview/export do Tremor.
- Lógica de Movimento Inteligente e de Velocidade Constante
  (`setSegmentTimingMode`/`syncTimingModeUI`).
- Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção
  simples/múltipla.
- Painel Movimento (`#panelEase`) fora dos ajustes de ordem/tipografia
  citados; abas Velocidade/Rotação/Escala (linha grossa ciano na ativa,
  linha fina nas inativas).
- Sliders, valores em segundos, cálculo de duração/pausa,
  `distributeSegEqual`, `resetAllFramePauses`, `setSegEaseAll`,
  `applyEaseAllChannels`.
- Preview, export MP4, JSON (antigo e novo), templates, formato, launcher,
  logo, ícone iOS, motor de renderização.

---

## 3. Checklist de aceite

1. [ ] A versão visível mostra **v8z4b29BU** (`APP_VERSION` +
   `APP_VERSION_NAME` + texto de versão nos Ajustes).
2. [ ] O ícone de trecho no painel Edição de Tempo está visivelmente
   ~2x maior que na v8z4b29BT.
3. [ ] O número do trecho continua **acima** do ícone de trecho.
4. [ ] O ícone de trecho continua sendo um segmento com dois círculos nas
   extremidades (não foi trocado por outro símbolo).
5. [ ] Trechos com dois dígitos (10–11, 12–13, 24–25, 30–31) ficam
   legíveis, sem espremer o número.
6. [ ] Nenhum ícone (frame ou trecho) encosta no slider ao lado.
7. [ ] O número do frame continua **dentro** do ícone de frame (ícone de
   frame inalterado, 39px).
8. [ ] A lista de frames/trechos da Edição de Tempo está visivelmente mais
   compacta (menos espaço vazio entre itens).
9. [ ] A distância vertical entre frame/trecho/frame seguinte foi reduzida,
   sem prejudicar o toque no iPhone.
10. [ ] O painel Edição de Tempo não tem grandes vazios entre Cena 1,
    Trechos — Duração, Frames — Pausas e Acabamento.
11. [ ] Trechos — Duração e Frames — Pausas estão visivelmente mais
    compactos (labels, sliders, botões e totais mais próximos).
12. [ ] O painel "Tempo do trecho" (`#panelSegTime`) tem altura compacta,
    sem espaço vazio abaixo do bloco Duração.
13. [ ] O painel "Tempo do trecho" segue a mesma densidade dos painéis
    contextuais compactos já existentes (handle + título + check na mesma
    linha).
14. [ ] "Velocidade constante" aparece **antes** do toggle (Edição de
    Tempo).
15. [ ] "Movimento inteligente", "Rotação Inteligente" e "Escala
    Inteligente" aparecem **antes** dos respectivos toggles (painel
    Movimento).
16. [ ] Ícones "Aplicar a todos" (`#easeGlobeLock`/`#easeGlobeRot`/
    `#easeGlobeScale`/`#segTimeGlobeLock`) continuam **depois** do
    título/toggle, nunca antes.
17. [ ] "Tremor Global (projeto inteiro)" aparece **antes** do toggle, em
    Preferências e no painel Movimento.
18. [ ] "Velocidade constante" aparece em caixa alta e baixa, fonte
    branca, sem aparência de cabeçalho espaçado.
19. [ ] "Movimento inteligente" aparece em caixa alta e baixa, fonte
    branca, sem aparência de cabeçalho espaçado.
20. [ ] "Tremor" (painel Movimento) aparece em caixa alta e baixa, fonte
    branca, sem aparência de cabeçalho espaçado.
21. [ ] No menu contextual de frame, o ícone "Aplicar a todos" (globo)
    aparece para Pausa, Rotação, Escala e Posição/Mover.
22. [ ] Ativar "Aplicar a todos" no menu de frame e ajustar
    Pausa/Rotação/Posição aplica a todos os frames (lógica
    `isCustLocked`/`custGlobalLock` inalterada).
23. [ ] A lógica do Tremor não mudou (Global/Desligado/Personalizado,
    herança, Preview/export).
24. [ ] A lógica de Movimento Inteligente não mudou.
25. [ ] A lógica de Velocidade Constante não mudou.
26. [ ] **Preview** continua funcionando normalmente.
27. [ ] **Export MP4** continua funcionando normalmente.
28. [ ] **JSON antigo** continua abrindo.
29. [ ] **JSON novo** salva e reabre normalmente.
30. [ ] Sem regressões no Stage, timeline, curvas/Bézier, seleção ou
    controles de duração/sliders no iPhone/Safari.

---

## 4. Riscos e mitigação

- **Ícone de trecho 2x maior**: alteração restrita a `.seq-icon-segment`/
  `.seq-icon-seg-num`/`.dur-edit-icon-label` (CSS já dedicado); markup de
  `buildSegDurationRow` inalterado. Coluna alargada (50px → 84px) absorve o
  aumento sem reduzir `.dur-edit-value` (`min-width:48px`, inalterado).
- **Redução de paddings/margens**: todos os `min-height:44px` de botões
  tocáveis (`.dur-subitem-action`) foram preservados; apenas espaços vazios
  ao redor foram reduzidos.
- **Reordenação de toggles/ícones**: apenas a ordem dos elementos no
  markup mudou — `id`s, `onchange`/`onclick`, `for`/`title` e classes
  `.smart-toggle`/`.smart-toggle-track` permanecem idênticos, preservando
  `setSegmentTimingMode`, `setMovementEasingModeFromToggle`,
  `setRotationEasingModeFromToggle`, `setScaleEasingModeFromToggle` e
  `toggleProjectShake`.
- **`.dur-item-title`**: classe nova, puramente visual (cor/peso/tamanho),
  sem `display`/`position` que afete layout além da tipografia.
- **`#custGlobalLock`**: reaproveita CSS, estado e funções 100%
  pré-existentes (`#custGlobalLock{...}`, `.global-on`,
  `toggleCustGlobalLock`, `resetCustGlobalLocks`, `isCustLocked`); o único
  elemento novo é o botão em si. Reset ao trocar de aba já era tratado por
  `switchCustTab`.
