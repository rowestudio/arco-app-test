# QA — v8z4b29BS: padroniza painel Tempo do trecho, reorganiza Edição de Tempo e adiciona ícones de frame/trecho

> Base: **v8z4b29BR** (cabeçalho fixo reduzido + separação Tempo/Movimento do
> trecho + Tremor Global recuperado no painel Movimento).
> Objetivo: corrigir/ajustar apresentação do painel **Tempo do trecho**
> (`#panelSegTime`) para a mesma família visual dos painéis compactos,
> adicionar ajuste global "Aplicar a todos os trechos" para duração,
> reorganizar o painel **Edição de Tempo** (abas no topo, resumo só na aba
> Tempo e mais destacado, Velocidade Constante como toggle) e adicionar
> ícones de frame/trecho na lista e nos filtros. É uma correção
> **visual/UX** — motor, JSON, Preview, export, Stage, timeline e lógica de
> duração/tremor permanecem inalterados.

---

## 1. Conceito implementado

```
Edição de Tempo                                  ← cabeçalho fixo (handle + título + check)
  [handle]
  Edição de Tempo                          [✓]
  ───────────────────────────────────────────
  ↓ área rolável (.dur-scroll-area) ↓
  [ Tempo ] [ Preferências ]                      ← abas no topo, navegação principal
  Aba Tempo:
    Duração total grande
    ┌─ Resumo (.dur-summary-box) ──────────┐
    │ Duração Total · Trechos · Pausas ·    │
    │ Acabamento (linha principal destacada)│
    └────────────────────────────────────────┘
    Velocidade Constante  [toggle ⚪/🔵]
    Cena 1
      filtro: Todos | [🖼1] Frames | [⊙—⊙ 1–2] Trechos
      [🖼1]   slider pausa    0.9s
      [1–2 ⊙—⊙]  slider trecho   1.0s
      …
    Trechos — Duração
    Frames — Pausas
    Acabamento
  Aba Preferências:
    Movimento (nota informativa)
    Tremor Global do projeto
    Mais preferências (espaço reservado)
```

Painel contextual de trecho — **Tempo** (`#panelSegTime`), agora no mesmo
padrão visual compacto dos painéis de Movimento/Frame:

```
┌──────────────────────────────────────────┐
│ [handle]                                  │
│ Seg. 2-3                            [✓]   │  ← .dur-header-row
│──────────────────────────────────────────│
│ Duração          [🌐 Aplicar a todos]     │  ← ease-channel-block
│ [============slider=========]   4.0s      │
└──────────────────────────────────────────┘
```

---

## 2. O que mudou (apenas apresentação)

### 2.1 Painel Tempo do trecho (`#panelSegTime`) — padronização visual

- Cabeçalho passou a usar `.dur-header-row` (mesmo padrão de
  `#panelDuration`/`#panelEase`): handle + título `#panelSegTimeTitle`
  ("Seg. X-Y") + `panel-close-check`, na mesma linha.
- Conteúdo reduzido a um único bloco `.ease-channel-block` ("Duração"):
  label "Duração" + controle "Aplicar a todos os trechos" (ícone
  `i-globe-lock`) na mesma linha, e abaixo o slider `#easePanelSegSlider`
  + valor `#easePanelSegVal`.
- Altura do painel agora acompanha o conteúdo (sem área vazia abaixo do
  slider), igual à densidade dos painéis de Movimento/Frame.
- Nenhuma alteração em `easePanelSegSlider`/`easePanelSegVal` (ids, min/max,
  passo, lógica de escrita em `segDurations[]`/`loopDuration`) nem na função
  `closeAll()`.

### 2.2 Ajuste global "Aplicar a todos os trechos" (Tempo)

- Novo controle `#segTimeGlobeLock` (ícone `i-globe-lock` + rótulo "Todos os
  trechos"), com `onclick="setSegEaseAll()"` — reaproveita o **mesmo**
  `segGlobalMode`/`setSegEaseAll()`/`paintGlobe()` já usados no painel
  Movimento (Velocidade/Rotação/Escala) e no slider de duração.
- `updateSegGlobalButton()` agora também chama
  `paintGlobe(document.getElementById('segTimeGlobeLock'), false)`, mantendo
  `#segTimeGlobeLock` sincronizado com o mesmo estado `segGlobalMode` que
  pinta `#easeGlobeLock`/`#easeGlobeRot`/`#easeGlobeScale`/`#custGlobalLock`.
- `initSegTimePanel()` chama `updateSegGlobalButton()` ao abrir o painel,
  garantindo que o ícone reflita o estado atual de `segGlobalMode`.
- Quando ativo (`segGlobalMode = true`), o slider de duração do trecho
  selecionado já propaga o valor para todos os trechos
  (`segDurations[i] = nextVal` para todo `i`), exatamente como o código
  pré-existente em `initSegTimePanel()` — **nenhuma lógica nova de
  propagação foi criada**, apenas exposto o controle.
- Afeta **somente** `segDurations[]`/`loopDuration` — pausas de frame,
  Tremor, curvas, Movimento Inteligente, Velocidade/Rotação/Escala não são
  tocados.
- Undo/Redo, JSON e Preview continuam consistentes (mesmos estados, mesmas
  funções de sincronização: `syncDurationUI()`, `syncStateFromUndo`).

### 2.3 Painel Edição de Tempo — abas no topo da `.dur-scroll-area`

- `.ds-tab-bar` (Tempo/Preferências) é agora o **primeiro elemento** dentro
  de `.dur-scroll-area`, logo abaixo do cabeçalho fixo
  (handle + título + check).
- `switchDurTab('tempo'|'prefs')` inalterado (id-based,
  `durTabBtnTempo`/`durTabBtnPrefs`/`durTabTempo`/`durTabPrefs`).
- Design system de abas (`.ds-tab`/`.ds-tab-active`, linha grossa ciano /
  linha fina discreta, sem pill, sem novo fundo) preservado e aplicado a
  ambos os pares de abas (Tempo/Preferências e
  Velocidade/Rotação/Escala em `#panelEase`).

### 2.4 Resumo de duração — somente na aba Tempo, com destaque visual

- `#durationSummaryTop` (Duração Total / Trechos / Pausas / Acabamento)
  passou a viver **dentro** de `#durTabTempo`, logo após a duração total
  grande (`#durNum`) e **antes** de Velocidade Constante e Cena 1. Não
  existe (e nunca existiu nesta versão) cópia em Preferências.
- Novo wrapper `.dur-summary-box` (fundo `var(--surface2)`, borda
  `var(--border2)`, padding/raio discretos) + `.dur-summary-row`/
  `.dur-summary-row-main` (linha "Duração Total" com peso/cor de destaque e
  divisor fino abaixo, separando-a das demais linhas).
- Nenhum id, cálculo ou função de sincronização (`syncDurationUI()`) foi
  alterado — apenas o contêiner visual ao redor dos mesmos
  `#durSummaryTotal`/`#durSummaryMove`/`#durSummaryPauses`/
  `#durSummaryFinish`.

### 2.5 Velocidade Constante — toggle simples

- Os antigos botões `btnTimingManual`/`btnTimingConstant` foram substituídos
  por um único toggle `.smart-toggle` (`#constSpeedToggle`, mesmo padrão
  visual do toggle de Tremor Global / Movimento Inteligente).
- `onchange="setSegmentTimingMode(this.checked ? 'constant-speed' : 'manual')"`
  — desligado = Manual, ligado = Velocidade Constante. `setSegmentTimingMode`
  inalterado.
- `syncTimingModeUI()` reescrito para refletir `segmentTimingMode` no estado
  `checked` de `#constSpeedToggle` (em vez de alternar classes ativas em dois
  botões); `#segTimingHint` continua aparecendo/escondendo conforme o modo.
- Bloco `.dur-velocity-block` permanece dentro da aba Tempo, agora ocupando
  uma única linha (toggle + rótulo clicável), economizando espaço vertical.

### 2.6 Ícones de frame e trecho na lista (Cena 1)

- `buildFramePauseRow(i)`: o rótulo textual do frame foi substituído por
  `.seq-icon-frame` (símbolo `i-seq-frame`, retângulo arredondado) com o
  número do frame **dentro** do ícone (`.seq-icon-num`, posicionado em
  overlay absoluto sobre o SVG).
- `buildSegDurationRow(seg)`: o rótulo textual do trecho foi substituído por
  `.seq-icon-segment` (símbolo `i-seq-segment`, dois círculos ligados por uma
  linha) precedido pelo número do trecho **acima/ao lado** do ícone
  (`.seq-icon-seg-num`, ex.: "1–2").
- Novos símbolos SVG `i-seq-frame` e `i-seq-segment` adicionados ao sprite
  existente, reaproveitando o mesmo estilo stroke-based (Iconoir) já usado
  pelos demais ícones do app — nenhuma biblioteca nova.
- `syncSegRowsFromState()` e o restante da sincronização de estado não foram
  alterados: continuam operando sobre `.dur-edit-value` e os sliders, não
  sobre os rótulos/ícones.
- Estados de "global sync" (`#cena1Seq.global-synced`) e "partial-synced"
  passaram a também esmaecer (`opacity`) o novo `.dur-edit-icon-label`,
  mantendo a indicação visual existente.

### 2.7 Ícones nos filtros Frames/Trechos

- Botões `.cena1-filter[data-filter="frames"]` e
  `[data-filter="segs"]` ganharam os mesmos ícones `.seq-icon-frame`/
  `.seq-icon-segment` (em tamanho reduzido, 16×16) antes do texto "Frames"/
  "Trechos". O botão "Todos" permanece sem ícone.
- `.cena1-filter` passou a `display:flex` com `gap` para alinhar
  ícone + texto sem aumentar significativamente a altura do botão.
- Cor do ícone acompanha o estado do botão (`color:inherit`; ícone fica
  `var(--accent)` quando `.cena1-filter.active`).
- `setCena1Filter`/`applyCena1Filter` inalterados — filtros continuam com
  peso visual distinto (`.cena1-filter`) das abas principais (`.ds-tab`).

---

## 3. O que NÃO mudou (preservação)

- Motor de render (`getStateAtT` / `getStateAtTBase` / `applySegTremorLayer`).
- Estados de tempo: `framePauses[]`, `segDurations[]`, `loopDuration`,
  `finishMode`, `segmentTimingMode`, `projectShake`, `segTremorSettings[]`,
  `segGlobalMode`.
- JSON (`buildProjectData` / load): formato idêntico ao da BR. JSON antigo
  continua abrindo; JSON novo salva e reabre igual.
- Preview e export MP4 (Tremor determinístico inclusive).
- Stage, timeline inferior, frames/trechos no Stage, curvas/Bézier, seleção
  simples/múltipla, templates, formato, launcher, logo, apple-touch-icon,
  ícones Iconoir, menu superior, botão "Edição".
- Painel **Movimento** do trecho (`#panelEase`): Velocidade/Rotação/Escala,
  Movimento Inteligente, curvas (Aplicar aos 3 / Resetar curva), Tremor
  Global do projeto (espelhado) e Tremor deste trecho — sem alteração.
- Tremor Global e por trecho — motor e estados inalterados.
- Sequência Cena 1, `renderCena1Sequence`, `setCena1Filter`/
  `applyCena1Filter` (lógica de filtragem).
- Sem multi-cena real, Cena 2, múltiplas imagens, transição entre cenas,
  rótulos coloridos de frame, Variação do Tremor, Tremor em pausa, Fundo em
  Preferências, ou mudança no export/JSON de cenas.

---

## 4. Checklist de aceite

1. [ ] A versão visível mostra **v8z4b29BS** (launcher/ajustes + `APP_VERSION`
   + `APP_VERSION_NAME`).
2. [ ] O painel **Tempo do trecho** (`#panelSegTime`) segue a mesma família
   visual dos painéis compactos: handle + título "Seg. X-Y" + check na mesma
   linha, sem área vazia abaixo do conteúdo.
3. [ ] O painel **Tempo do trecho** mostra: identificação do trecho, label
   "Duração", controle "Aplicar a todos os trechos", slider de duração e
   valor em segundos — e **nada mais** (sem Velocidade, Rotação, Escala,
   Movimento Inteligente, Tremor ou curvas).
4. [ ] O slider de Duração no painel Tempo do trecho mantém o mesmo
   id/lógica (`easePanelSegSlider`/`easePanelSegVal`), min/max e passo de
   antes.
5. [ ] O botão **"Aplicar a todos os trechos"** (`#segTimeGlobeLock`) aplica
   a duração do trecho atual a todos os trechos (`segDurations[]`), sem
   alterar `framePauses[]`, Tremor, curvas, Movimento Inteligente ou
   Escala/Rotação.
6. [ ] O estado de "Aplicar a todos" (`segGlobalMode`) é o mesmo entre o
   painel Tempo do trecho e o painel Movimento (ícones sincronizados via
   `paintGlobe`).
7. [ ] Undo/Redo continuam funcionando corretamente após usar "Aplicar a
   todos os trechos".
8. [ ] No painel **Edição de Tempo**, as abas **Tempo / Preferências**
   aparecem no topo da área rolável, imediatamente abaixo do cabeçalho
   (título + check).
9. [ ] O **resumo de duração** (Duração Total / Trechos / Pausas /
   Acabamento) aparece **apenas** dentro da aba Tempo, em um contêiner
   visualmente destacado (`.dur-summary-box`), sem duplicação em
   Preferências.
10. [ ] Dentro da aba Tempo, a ordem do conteúdo é: resumo → Velocidade
    Constante → Cena 1 (filtro + lista) → blocos globais (Trechos–Duração,
    Frames–Pausas, Acabamento).
11. [ ] **Velocidade Constante** aparece como um toggle simples (ligado =
    Velocidade Constante, desligado = Manual), com o mesmo comportamento de
    `setSegmentTimingMode`/`syncTimingModeUI` de antes.
12. [ ] A lista de Cena 1 mostra ícone de **frame** com o número **dentro**
    do ícone, e ícone de **trecho** (dois círculos) com o número do trecho
    (ex. "1–2") associado ao ícone.
13. [ ] Os filtros **Frames** e **Trechos** mostram os mesmos ícones da
    lista (em tamanho reduzido); o filtro **Todos** permanece sem ícone.
14. [ ] Os filtros Frames/Trechos/Todos continuam com peso visual distinto
    das abas principais Tempo/Preferências.
15. [ ] As abas **Tempo / Preferências** e **Velocidade / Rotação / Escala**
    mantêm o design system: linha grossa ciano na ativa, linha fina
    discreta nas inativas, sem pill e sem novo fundo.
16. [ ] O painel **Movimento** do trecho (`#panelEase`) permanece inalterado:
    abas Velocidade/Rotação/Escala, Movimento Inteligente, curvas, Tremor
    Global do projeto (espelhado) e Tremor deste trecho — sem slider de
    Duração.
17. [ ] Ajustar o Tremor Global pelo painel Movimento continua refletindo em
    Preferências (Edição de Tempo) e vice-versa.
18. [ ] Trocar de aba/painel (Tempo/Movimento/Preferências) não fecha o
    painel indevidamente nem altera a seleção de frame/trecho.
19. [ ] A duração total e o resumo continuam corretos ao editar via slider de
    duração (painel Tempo do trecho) e via "Trechos — Duração" (Edição de
    Tempo).
20. [ ] **Preview** continua funcionando.
21. [ ] **Export MP4** continua funcionando.
22. [ ] **JSON antigo** continua abrindo.
23. [ ] **JSON novo** salva e reabre normalmente.
24. [ ] Sem regressões no iPhone/Safari (scroll único do painel preservado;
    sliders nativos `.dur-slider`; sem nested-scroll novo; cabeçalho sticky
    sem "vazamentos" visuais; ícones renderizam corretamente em telas
    pequenas).

---

## 5. Riscos e mitigação

- **Reaproveitamento de `setSegEaseAll()`/`segGlobalMode` no painel Tempo**:
  o mesmo estado global já controlava o slider de duração antes (quando
  visível em `#panelEase`); apenas foi exposto um controle equivalente
  (`#segTimeGlobeLock`) no novo local, reaproveitando `paintGlobe()` para
  manter os múltiplos ícones (`#easeGlobeLock`/`#easeGlobeRot`/
  `#easeGlobeScale`/`#custGlobalLock`/`#segTimeGlobeLock`) sincronizados a
  partir de uma única fonte de verdade.
- **Reposicionamento do resumo e das abas**: nenhum id foi removido —
  `#durationSummaryTop`, `#durSummaryTotal/Move/Pauses/Finish`,
  `#durTabBtnTempo/Prefs`, `#durTabTempo/Prefs` continuam existindo,
  apenas em nova ordem dentro de `.dur-scroll-area`. `switchDurTab` e
  `syncDurationUI()` continuam id-based e funcionam independentemente da
  ordem do DOM.
- **Conversão de Velocidade Constante em toggle**: `syncTimingModeUI()` foi
  reescrito para um único elemento (`#constSpeedToggle.checked`), mas
  `setSegmentTimingMode('manual'|'constant-speed')` — a função que
  efetivamente altera `segmentTimingMode` e recalcula tempos — não foi
  tocada. Removida toda referência aos antigos `btnTimingManual`/
  `btnTimingConstant`/`segTimingModeRow` (confirmado via busca no código).
- **Ícones de frame/trecho substituindo texto**: confirmado por busca no
  código que os rótulos textuais de `buildFramePauseRow`/
  `buildSegDurationRow` não eram lidos por `syncSegRowsFromState()` ou
  outras funções — apenas `.dur-edit-value` e os sliders são lidos/escritos
  no estado. A troca de `innerHTML` dos labels é puramente visual.
- **Painel `#panelSegTime` reduzido**: `.dur-header-row` já era usado em
  `#panelDuration`/`#panelEase`; aplicá-lo a `#panelSegTime` reaproveita CSS
  existente sem novas regras de layout que pudessem afetar outros painéis
  (`#segTimeGlobeLock` e `.global-on` foram adicionados apenas à lista de
  seletores que já pintavam os outros ícones de globo).
