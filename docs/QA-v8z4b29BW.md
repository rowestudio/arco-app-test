# QA — v8z4b29BW: corrige travamento da Pausa global, "Novo Projeto" no menu, ícones de trecho e padronização visual da Edição de Tempo

> Base: **v8z4b29BV**. Objetivo: **correção visual/UX** dos problemas deixados pela
> v8z4b29BV + **bug pontual de travamento do slider de Pausa quando "Aplicar a
> todos" está ativo**. Sem mudança de motor, JSON, Preview, export, Stage,
> timeline ou lógica principal (Tremor, Movimento Inteligente, Velocidade
> Constante).

---

## 1. O que mudou

### 1.1 fix(frame): slider de Pausa não trava mais com "Aplicar a todos" ativo

- **Bug**: na v8z4b29BV, com `custGlobalLock.framepause` ativo, cada evento
  `input` do slider de Pausa (`#framePauseSlider`) percorria todos os frames
  chamando `setFramePause(i, ...)`, e cada chamada disparava
  `refreshPauseControls()` (rebuild completo da lista `#cena1Seq` + totais +
  fills dos sliders). Em um drag contínuo no iPhone/Safari, isso travava o
  slider (UI sem resposta por vários ticks).
- **Correção** (`_bindLocalFramePauseSliderOnce`):
  - `input`: com `isCustLocked()` ativo, escreve direto em
    `framePauses[i] = { duration: value }` (via `clampFramePauseValue`) para
    todos os frames destravados, e chama `refreshPauseControls()` **uma única
    vez** por evento. Sem global, comportamento inalterado
    (`setFramePause(idx, ..., { render:false })`).
  - `change`: com `isCustLocked()` ativo, aplica o valor final a todos os
    frames destravados, marca `markProjectDirty('frame-pause')` se houve
    mudança, chama `refreshPauseControls()` uma vez, sincroniza `finishMode`
    se o último frame foi afetado, e roda `renderAll()` + restart de preview
    uma única vez. Sem global, comportamento inalterado
    (`setFramePause(idx, ..., { render:true })`).
- `toggleCustGlobalLock()` (fluxo "global depois") inalterado — continua
  aplicando o valor do frame ativo a todos os frames destravados ao ligar o
  global.
- Afeta **apenas** `framePauses[]` (Pausa de frame). Não altera
  `segDurations[]`, `frameRotations[]`, posição ou escala.

### 1.2 fix(ui): "Novo Projeto" não quebra linha no menu superior aberto

- `#menuNewProjectLabel` (span dentro do item "Novo Projeto" em
  `#settingsSheet`): `white-space:nowrap`.
- Nova função `fitMenuNewProjectLabel()`: ao abrir o menu
  (`toggleSettingsSheet()`) e em `resize`, mede `scrollWidth` vs `clientWidth`
  do label; se "Novo Projeto" não couber em uma linha, troca para "Novo".
- `onclick="requestNewProjectFlow()"` e o fluxo do item **inalterados** —
  apenas o texto exibido pode mudar.
- Launcher (`.start-launcher-btn--primary`, `fitNovoProjetoLabel()`)
  inalterado.

### 1.3 tweak(ui): ícone de trecho maior no filtro "Trechos"

- `.cena1-filter .seq-icon-segment`: `20×20px` → `28×18px` (proporção mais
  larga, compatível com o desenho do ícone — segmento com dois círculos nas
  extremidades). `.cena1-filter .seq-icon-frame` inalterado (`20×20px`).
- Altura do botão (`.cena1-filter`, `min-height:34px`) inalterada.
- Ícone não foi trocado — continua `#i-seq-segment`.

### 1.4 fix(ui): número + ícone de trecho como um único item visual

- `.dur-edit-row > .dur-edit-icon-label`: `min-width` `64px` → `56px` (libera
  mais largura para os sliders) e `gap` `1px` → `0`.
- Número do trecho (`.seq-icon-seg-num`) continua acima, ícone
  (`.seq-icon-segment`, segmento com dois círculos) continua abaixo, sem
  sobrepor — apenas o espaço entre os dois foi eliminado.
- `buildFramePauseRow`/`buildSegDurationRow` (markup) inalterados.

### 1.5 tweak(ui): padronização de botões grandes, botões pequenos e campos

- Novas variáveis CSS `--surface-action` (`#48484c`) e `--border-action`
  (`#6e6e72`) — tons levemente mais claros que o fundo do painel
  (`--surface2`/`--bg`, ambos `#3c3c3b`), sem mudar a paleta aprovada.
- **Botões grandes de ação** (`.dur-subitem-action`: "Igualar intervalos",
  "Zerar pausas"): altura fixa `48px` (antes `min-height:44px` +
  `padding:8px 0`, variável), `background:var(--surface-action)`,
  `border:1px solid var(--border-action)`, `font-weight:700`. Largura
  (100%) preservada.
- **Botões pequenos contextuais** (ex.: "Reset" da Pausa em
  `#custTabFramepause`): mantêm o padrão menor (`min-height:30px`), agora com
  `background:var(--surface-action)`/`border-color:var(--border-action)`.
- **Campo** "Intervalo padrão" (`#newSegmentDurationInput`): mesmos tons
  (`--surface-action`/`--border-action`), reforçando a aparência de campo
  editável.
- **Abas/filtros** (`.ds-tab`, `.cena1-filter`, `.finish-chip`) **inalterados**
  — continuam em `--surface2`/`--border2`, mantendo a aparência de
  seleção/modo, distinta dos botões de ação e campos.

### 1.6 tweak(ui): espaçamento entre grupos no painel Edição de Tempo

- `.dur-section-header`: `margin` `2px 0 0` → `14px 0 0` — separa visualmente
  Cena 1 / Trechos — Duração / Frames — Pausas / Acabamento.
- Espaçamento **dentro** de cada grupo (`.dur-section-body`, `.dur-subitem`,
  `.dur-sublabel-row`, `.dur-edit-row`, `.dur-summary-box`,
  `.dur-velocity-block`) inalterado — painel continua denso e operacional.

---

## 2. O que NÃO mudou (preservação)

- Lógica de Tremor (Global/Desligado/Personalizado), herança, salvamento,
  Preview/export do Tremor.
- Lógica de Movimento Inteligente e de Velocidade Constante.
- Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção
  simples/múltipla.
- Painel Movimento (`#panelEase`) fora dos ajustes citados.
- `setFramePause`, `ensureFramePauses`, `resetAllFramePauses`,
  `distributeSegEqual`, `setSegEaseAll`, `applyEaseAllChannels`, `nudgePos`,
  `nudgeRotation`, `nudgeScale`/`nudgeAllScale` — apenas
  `_bindLocalFramePauseSliderOnce` ganhou o caminho "global" sem
  `refreshPauseControls`/`setFramePause` por frame.
- Ordem título→toggle/global e hierarquia `.dur-item-title` (v8z4b29BU/BV),
  mantidas sem alteração.
- Preview, export MP4, JSON (antigo e novo), templates, formato, launcher
  (fluxo), logo, ícone iOS, motor de renderização.

---

## 3. Checklist de aceite

1. [ ] A versão visível mostra **v8z4b29BW** (`APP_VERSION` +
   `APP_VERSION_NAME` + texto de versão no menu).
2. [ ] No painel de Pausa do frame, **sem** "Aplicar a todos" ativo, o slider
   funciona normalmente (drag fluido, sem travar).
3. [ ] No painel de Pausa do frame, ativar "Aplicar a todos"
   (`#custGlobalLock`) e então arrastar o slider: o slider continua
   respondendo normalmente durante o drag (sem travar) e o valor é aplicado a
   todos os frames destravados.
4. [ ] Soltar o slider (fim do drag) com "Aplicar a todos" ativo: valor final
   aplicado a todos, projeto marcado como alterado, sem travamento.
5. [ ] Ajustar o slider de Pausa **e então** ativar "Aplicar a todos": o valor
   atual é aplicado a todos os frames (fluxo `toggleCustGlobalLock`,
   inalterado).
6. [ ] Pausa salva corretamente no JSON; Preview/export respeitam os valores
   atualizados.
7. [ ] Outros painéis com "Aplicar a todos" (Rotação, Escala, Posição)
   continuam funcionando sem regressão.
8. [ ] No menu superior aberto, "Novo Projeto" aparece em uma única linha
   (sem quebra); se não couber, aparece "Novo". Fluxo de criar novo projeto
   inalterado.
9. [ ] Tela inicial/launcher inalterada (continua usando
   `fitNovoProjetoLabel()` já existente).
10. [ ] No painel Edição de Tempo, aba Tempo, o ícone do filtro "Trechos" está
    visivelmente maior/mais reconhecível que na v8z4b29BV, mantendo o desenho
    de segmento com dois círculos nas extremidades; altura do botão
    inalterada.
11. [ ] Na lista do painel Edição de Tempo, o número do trecho (ex.: "1–2") e
    o ícone de trecho aparecem "encostados", formando um único símbolo
    composto, sem sobreposição.
12. [ ] A lista não tem recuo lateral esquerdo excessivo; sliders mantêm boa
    largura útil.
13. [ ] Botões grandes de ação ("Igualar intervalos", "Zerar pausas") têm a
    mesma altura, fundo e borda entre si, com aparência clara de botão
    pressionável.
14. [ ] Botões pequenos contextuais (ex.: "Reset" da Pausa) mantêm um padrão
    menor próprio, consistente entre si.
15. [ ] Abas/filtros (Todos/Frames/Trechos, Tempo/Preferências, Loop/Pausa
    final) continuam com aparência de seleção/modo, visualmente diferentes
    dos botões de ação.
16. [ ] Campo "Intervalo padrão" tem aparência de campo editável (fundo/borda
    diferenciados), distinto de aba/botão.
17. [ ] No painel Edição de Tempo, há separação visual clara entre Cena 1 /
    Trechos — Duração / Frames — Pausas / Acabamento; dentro de cada grupo o
    espaçamento continua compacto.
18. [ ] Toggles/globo/"Aplicar a todos" continuam aparecendo depois do
    título/texto (Velocidade Constante, Movimento/Rotação/Escala Inteligente,
    Tremor Global, Pausa/Duração/Rotação/Mover).
19. [ ] Valores de tempo (segundos) continuam mais valorizados visualmente que
    números de frame/trecho.
20. [ ] A lógica do Tremor não mudou (Global/Desligado/Personalizado, herança,
    Preview/export).
21. [ ] A lógica de Movimento Inteligente não mudou.
22. [ ] A lógica de Velocidade Constante não mudou.
23. [ ] **Preview** continua funcionando normalmente.
24. [ ] **Export MP4** continua funcionando normalmente.
25. [ ] **JSON antigo** continua abrindo.
26. [ ] **JSON novo** salva e reabre normalmente.
27. [ ] Sem regressões no Stage, timeline, curvas/Bézier, seleção ou demais
    controles de duração/sliders no iPhone/Safari.

---

## 4. Riscos e mitigação

- **fix(frame) Pausa global**: alteração isolada em
  `_bindLocalFramePauseSliderOnce`, condicionada a `isCustLocked()`; usa
  `clampFramePauseValue` (mesma função de `setFramePause`) para garantir
  valores válidos. `setFramePause()` continua sendo a fonte única de verdade
  para o fluxo sem global e para `toggleCustGlobalLock`.
- **`fitMenuNewProjectLabel()`**: função nova, somente leitura de
  `scrollWidth`/`clientWidth` e troca de `textContent` do span
  `#menuNewProjectLabel` — não altera `onclick`/fluxo de
  `requestNewProjectFlow()`.
- **Novas variáveis `--surface-action`/`--border-action`**: aplicadas apenas a
  `.dur-subitem-action`, ao chip "Reset" da Pausa e a
  `#newSegmentDurationInput` — não afetam `.chip` globalmente (templates,
  formatos etc.) nem `.cena1-filter`/`.ds-tab`/`.finish-chip`.
- **Espaçamento entre grupos**: alteração restrita a `.dur-section-header`
  (`margin-top`); `.dur-section-body` e demais espaçamentos internos
  inalterados.
