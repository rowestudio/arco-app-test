# QA — v8z4b29BR: reduz cabeçalho fixo, separa Tempo/Movimento do trecho e recupera Tremor Global

> Base: **v8z4b29BQ** (cabeçalho fixo + design system de abas no painel Edição
> de Tempo).
> Objetivo: corrigir problemas observados na v8z4b29BQ — reduzir a área fixa
> do painel Edição de Tempo, separar os painéis contextuais de trecho entre
> Tempo (apenas duração) e Movimento (Velocidade/Rotação/Escala/Tremor),
> recuperar o Tremor Global no painel Movimento do trecho e refinar o padrão
> visual das abas (linha grossa na ativa, linha fina nas inativas). É uma
> correção **visual/UX** — motor, JSON, Preview, export, Stage, timeline e
> lógica de duração/tremor permanecem inalterados.

---

## 1. Conceito implementado

```
Edição de Tempo                                  ← cabeçalho fixo (reduzido)
  [handle]
  Edição de Tempo                          [✓]   ← título + check, mesma linha
  ───────────────────────────────────────────
  ↓ área rolável (.dur-scroll-area) ↓
  [duração total grande]
  Resumo: Duração Total · Trechos · Pausas · Acabamento
  Velocidade Constante  [Manual] [Velocidade constante]
  [ Tempo ] [ Preferências ]                      ← linha grossa na ativa
  Aba Tempo:
    Cena 1
      filtro: Todos | Frames | Trechos
      F1   slider pausa    0.9s
      1–2  slider trecho   1.0s
      …
    Trechos — Duração
    Frames — Pausas
    Acabamento
  Aba Preferências:
    Movimento (nota informativa)
    Tremor Global do projeto
    Mais preferências (espaço reservado)
```

Painel contextual de trecho — **Tempo** (`#panelSegTime`, novo):

```
SEG. 2-3
  Duração [slider] [4.0s]
```

Painel contextual de trecho — **Movimento** (`#panelEase`):

```
SEG. 2-3
  Movimento
    [ Velocidade ] [ Rotação ] [ Escala ]   ← linha grossa na ativa, fina nas inativas
    ───────────────────────────────────────
    [conteúdo da aba ativa: Inteligente, curvas, Aplicar aos 3, Resetar curva]
  Tremor
    Tremor Global do projeto
      toggle + Intensidade + Frequência     ← espelha o bloco de Preferências
    Tremor deste trecho
      [Global] [Desligado] [Personalizado]
      (zona de Intensidade/Frequência se Personalizado)
```

---

## 2. O que mudou (apenas apresentação)

### 2.1 Painel Edição de Tempo — cabeçalho reduzido

- `.dur-fixed-header` agora contém **apenas** `.panel-handle` e
  `.dur-header-row` (título "Edição de Tempo" + `panel-close-check`, mesma
  linha).
- `#durationSummaryTop`, `.dur-velocity-block` (Velocidade Constante,
  `#segTimingModeRow`/`#segTimingHint`) e `.ds-tab-bar` (Tempo/Preferências)
  saíram do cabeçalho fixo e passaram para dentro de `.dur-scroll-area`,
  antes de `#durTabTempo`/`#durTabPrefs`.
- `#panelDuration` continua sendo a única superfície de scroll
  (`overflow-y:auto`); `.dur-fixed-header` continua `position:sticky;top:0`,
  agora bem mais baixo.
- Nenhum id, cálculo de duração ou wiring de slider foi alterado —
  `setSegmentTimingMode`/`syncTimingModeUI`/`switchDurTab`/`syncDurationUI`
  continuam id-based e inalterados.

### 2.2 Painéis contextuais de trecho — Tempo vs. Movimento

- Novo painel `#panelSegTime` ("Tempo do trecho"): handle + check + título
  `#panelSegTimeTitle` (ex.: "SEG. 2-3") + bloco Duração (`easePanelSegSlider`
  / `easePanelSegVal`, mesmos ids/lógica de antes).
- `#panelEase` ("Movimento do trecho"): mantém handle + check + título
  `#panelEaseTitle` + bloco Movimento (abas Velocidade/Rotação/Escala +
  conteúdo) + bloco Tremor. O bloco Duração saiu daqui.
- `openSelectedSegmentMenu(target)` recebe `'time'` ou `'movement'`:
  - botão **Tempo** do menu contextual → `openPanel('SegTime')` →
    `initSegTimePanel()`.
  - botão **Movimento** → `openPanel('Ease')` → `initEasePanel()`.
- `_resolveActiveSegInfo()` (novo helper) calcula o segmento ativo e o texto
  de identificação ("Seg. X-Y" / "Seg. N–1 · Loop"), usado pelos dois
  painéis.
- `initSegTimePanel()` contém a lógica de duração que antes vivia em
  `initEasePanel()` (slider, listeners de undo, escrita em
  `segDurations[]`/`loopDuration`, `syncDurationUI()`) — **sem alteração de
  comportamento**, apenas movida.
- `initEasePanel()` mantém `_syncEaseChannelUI`, `syncApplyAllChannelsButtonState`,
  `syncMovementEasingModeUI`, `syncRotationEasingModeUI`,
  `syncScaleEasingModeUI`, grade de chips de easing e `syncTremorPanel()`.
- `syncStateFromUndo`/restauração de estado agora também chama
  `initSegTimePanel()` quando `#panelSegTime` está visível (espelha a chamada
  já existente para `#panelEase`).

### 2.3 Tremor Global recuperado no painel Movimento do trecho

- Novo bloco "Tremor Global do projeto" em `#panelEase`, acima de "Tremor
  deste trecho": toggle (`#tremorGlobalToggle2`) + zona
  (`#tremorGlobalZone2`) com sliders de Intensidade
  (`#tremorGlobalIntensitySlider2`/`#tremorGlobalIntensityVal2`) e Frequência
  (`#tremorGlobalFreqSlider2`/`#tremorGlobalFreqVal2`).
- `_initTremorListeners()` passou a conectar os dois conjuntos de
  controles (sufixo `''` em Preferências e `'2'` em Movimento) aos mesmos
  `applyProjectShakeSetting('intensity'|'frequency', …)`, chamando
  `syncTremorPanel()` ao final de cada `input` para manter ambos os conjuntos
  sincronizados com `projectShake`.
- `syncTremorPanel()` passou a sincronizar **ambos** os conjuntos (`''` e
  `'2'`) de toggle/zona/sliders/labels do Tremor Global a partir do mesmo
  `projectShake`.
- O bloco "Tremor deste trecho" (chips Global/Desligado/Personalizado,
  `#tremorGlobalHint`, `#tremorZone`) permanece em `#panelEase`, sem
  alteração de ids ou lógica (`setSegTremorMode`, `applySegTremorSetting`,
  `_tremorTargetSeg`).
- O bloco "Tremor Global do projeto" da aba Preferências (`#panelDuration`)
  **não foi removido** — continua com os ids originais
  (`tremorGlobalToggle`/`tremorGlobalZone`/`tremorGlobalIntensitySlider`/…).

### 2.4 Design system de abas — linha grossa/fina

- `.ds-tab`: troca `border-bottom:2px solid transparent` por
  `box-shadow:inset 0 -1px 0 0 var(--border2)` (linha fina discreta,
  inativa) — não altera a altura da caixa.
- `.ds-tab.ds-tab-active`: troca `border-bottom-color:var(--accent)` por
  `box-shadow:inset 0 -3px 0 0 var(--accent)` (linha grossa ciano).
- Aplica-se automaticamente a todas as instâncias de `.ds-tab-bar`/`.ds-tab`:
  abas Tempo/Preferências (Edição de Tempo) e Velocidade/Rotação/Escala
  (painel Movimento do trecho). Sem novo fundo, sem pill, sem padding extra.

---

## 3. O que NÃO mudou (preservação)

- Motor de render (`getStateAtT` / `getStateAtTBase` / `applySegTremorLayer`).
- Estados de tempo: `framePauses[]`, `segDurations[]`, `loopDuration`,
  `finishMode`, `segmentTimingMode`, `projectShake`, `segTremorSettings[]`.
- JSON (`buildProjectData` / load): formato idêntico ao da BQ. JSON antigo
  continua abrindo; JSON novo salva e reabre igual.
- Preview e export MP4 (Tremor determinístico inclusive).
- Stage, timeline inferior, frames/trechos no Stage, curvas/Bézier, seleção
  simples/múltipla, templates, formato, launcher, logo, apple-touch-icon,
  ícones Iconoir, menu superior, botão "Edição".
- Tremor Global e por trecho — motor e estados inalterados; apenas ganharam
  um segundo conjunto de controles (espelhados) no painel Movimento.
- Sequência Cena 1, `renderCena1Sequence`, `buildSegDurationRow`,
  `buildFramePauseRow`, `setCena1Filter`/`applyCena1Filter`.
- Sem multi-cena real, Cena 2, múltiplas imagens, transição entre cenas,
  rótulos coloridos de frame, Variação do Tremor, Tremor em pausa, Fundo em
  Preferências, ou mudança no export/JSON de cenas.

---

## 4. Checklist de aceite

1. [ ] A versão visível mostra **v8z4b29BR** (launcher/ajustes + `APP_VERSION`
   + `APP_VERSION_NAME`).
2. [ ] No painel Edição de Tempo, **apenas** handle, título "Edição de Tempo"
   e botão check ficam fixos no topo.
3. [ ] Resumo de duração, Velocidade Constante, abas Tempo/Preferências e todo
   o conteúdo abaixo rolam junto ao arrastar a lista.
4. [ ] A lista de frames/trechos (Cena 1) e os blocos globais ganham mais
   espaço útil de scroll (cabeçalho visivelmente mais baixo que na BQ).
5. [ ] Nenhum conteúdo fica escondido atrás do cabeçalho fixo.
6. [ ] No menu contextual de trecho, o botão **Tempo** abre um painel
   (`SEG. X-Y`) contendo **apenas** identificação do trecho + slider de
   duração + valor em segundos.
7. [ ] O painel **Tempo** do trecho NÃO mostra Velocidade, Rotação, Escala,
   Movimento Inteligente, Tremor, Tremor Global ou curvas.
8. [ ] No menu contextual de trecho, o botão **Movimento** abre um painel
   (`SEG. X-Y`) contendo abas **Velocidade / Rotação / Escala**, Movimento
   Inteligente, curvas (Aplicar aos 3 / Resetar curva) e Tremor.
9. [ ] O painel **Movimento** do trecho NÃO mostra o slider de Duração.
10. [ ] O slider de **Duração** no painel Tempo edita a mesma duração do
    trecho refletida em Edição de Tempo (sem divergência).
11. [ ] O painel **Movimento** do trecho mostra um bloco **"Tremor Global do
    projeto"** com toggle + Intensidade + Frequência.
12. [ ] Ajustar o Tremor Global pelo painel Movimento reflete corretamente em
    Preferências (Edição de Tempo) e vice-versa (mesmo estado).
13. [ ] O bloco **"Tremor deste trecho"** (Global / Desligado / Personalizado)
    continua no painel Movimento e funciona como antes (incluindo a nota
    "Herdando o Tremor Global do projeto" no modo Global).
14. [ ] As abas **Tempo / Preferências** e **Velocidade / Rotação / Escala**
    mostram a aba ativa com **linha grossa ciano** e as inativas com **linha
    fina discreta** (cinza/baixa opacidade).
15. [ ] Nenhuma aba ganhou fundo novo, formato de pill ou padding extra.
16. [ ] O filtro **Todos / Frames / Trechos** continua como filtro secundário,
    com peso visual distinto das abas principais.
17. [ ] Trocar de aba ou de painel (Tempo/Movimento/Preferências) não fecha o
    painel indevidamente nem altera a seleção de frame/trecho.
18. [ ] **Preview** continua funcionando.
19. [ ] **Export MP4** continua funcionando.
20. [ ] **JSON antigo** continua abrindo.
21. [ ] **JSON novo** salva e reabre normalmente.
22. [ ] **Tremor Global** e **Tremor por trecho** continuam funcionando
    (toggle, Intensidade, Frequência, herança Global) em ambos os pontos de
    acesso (Preferências e painel Movimento).
23. [ ] Sem regressões no iPhone/Safari (scroll único do painel preservado;
    sliders nativos `.dur-slider`; sem nested-scroll novo; cabeçalho sticky
    sem "vazamentos" visuais).

---

## 5. Riscos e mitigação

- **Divisão de `initEasePanel()`**: a lógica de duração (slider, listeners de
  undo, escrita em `segDurations[]`/`loopDuration`) foi movida para
  `initSegTimePanel()` sem alteração — `easePanelSegSlider`/`easePanelSegVal`
  continuam os mesmos ids/elementos, apenas em outro painel. `_activeEaseSeg`
  e `_resolveActiveSegInfo()` são compartilhados pelos dois painéis, evitando
  divergência de qual segmento está sendo editado.
- **Tremor Global duplicado (sufixo "2")**: ambos os conjuntos de controles
  leem/escrevem o mesmo objeto `projectShake` via
  `applyProjectShakeSetting`/`toggleProjectShake`; `syncTremorPanel()`
  sincroniza os dois conjuntos a cada mudança, evitando que fiquem
  dessincronizados mesmo com apenas um painel visível por vez.
- **Cabeçalho fixo reduzido**: `.dur-fixed-header` continua
  `position:sticky;top:0` dentro de `#panelDuration` (única superfície de
  scroll); apenas o conteúdo dentro dele diminuiu. Nenhum novo container de
  scroll foi criado.
- **Refinamento de abas via `box-shadow`**: evita alterar a altura da caixa
  (diferente de variar `border-bottom-width`), prevenindo qualquer
  reflow/salto entre aba ativa e inativas.
