# QA — v8z4b29BQ: cabeçalho fixo + design system de abas no painel Edição de Tempo

> Base: **v8z4b29BP** (painel "Edição de Tempo" com abas Tempo e Preferências).
> Objetivo: corrigir visualmente a v8z4b29BP — cabeçalho/resumo/Velocidade
> Constante/abas fixos no topo do painel Edição de Tempo, abas Tempo /
> Preferências com padrão visual claro (texto grande, sublinhado, divisória),
> e o mesmo padrão aplicado às abas do painel contextual de trechos
> (Velocidade/Rotação/Escala). É uma correção **visual/UX e de design system**
> — motor, JSON, Preview, export, Stage, timeline e lógica de tremor
> permanecem inalterados.

---

## 1. Conceito implementado

```
Edição de Tempo                                  ← cabeçalho fixo
  [handle]
  Edição de Tempo                          [✓]   ← título + check, mesma linha
  [duração total grande]
  Resumo: Duração Total · Trechos · Pausas · Acabamento
  Velocidade Constante  [Manual] [Velocidade constante]
  [ Tempo ] [ Preferências ]                      ← abas com sublinhado + divisória
  ───────────────────────────────────────────
  ↓ área rolável (.dur-scroll-area) ↓
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

Painel contextual de trechos (Easing/Movimento, `#panelEase`):

```
Easing
  Duração [slider]
  Movimento
    [ Velocidade ] [ Rotação ] [ Escala ]   ← mesmo padrão de abas
    ───────────────────────────────────────
    [conteúdo da aba ativa]
  Tremor (por trecho)
```

---

## 2. O que mudou (apenas apresentação)

- **Cabeçalho fixo** (`.dur-fixed-header`, `position:sticky;top:0`): agrupa
  handle, `.dur-header-row` (título + `panel-close-check` na mesma linha,
  agora `position:static` dentro do cabeçalho), `#durationSummaryTop`,
  `.dur-velocity-block` (Velocidade Constante) e `.ds-tab-bar` (Tempo /
  Preferências). Nenhum desses elementos rola com a lista.
- **Velocidade Constante**: `#segTimingModeRow` (`btnTimingManual` /
  `btnTimingConstant`) e `#segTimingHint` saem da aba Preferências e passam a
  viver em `.dur-velocity-block`, dentro do cabeçalho fixo da aba Tempo.
  `setSegmentTimingMode` / `syncTimingModeUI` continuam id-based, sem
  alteração de lógica.
- **Área rolável** (`.dur-scroll-area`): envolve `#durTabTempo` e
  `#durTabPrefs`. `#panelDuration` continua sendo a única superfície de
  scroll (`overflow-y:auto`); `.dur-fixed-header` é sticky dentro dela.
- **Design system de abas** (`.ds-tab-bar` / `.ds-tab` / `.ds-tab-active`):
  texto 15px, aba ativa com cor de maior contraste (`var(--text)`), peso 700 e
  sublinhado (`border-bottom` cor `var(--accent)`); abas inativas em
  `var(--text3)`; divisória fina (`border-bottom:.5px solid var(--border)`)
  abaixo do conjunto. Área de toque mínima 44px.
  - Abas **Tempo / Preferências** (`#durTabBtnTempo` / `#durTabBtnPrefs`):
    `switchDurTab` agora alterna `ds-tab-active` (antes `dur-tab-active`).
  - Abas **Velocidade / Rotação / Escala** (`#easePanelCh_movement` /
    `_rotation` / `_scale`, painel `#panelEase`): `_syncEaseChannelUI` agora
    alterna `ds-tab-active` (antes `ease-tab-active`). `.ease-tab-content`
    passa a ser um cartão independente abaixo das abas (fundo próprio,
    `border-radius:12px`, `margin-top`).
- **Aba Preferências**: fica enxuta — seção "Movimento" agora contém apenas
  uma nota informativa (Movimento Inteligente / Velocidade Constante movida
  para Tempo); seções Tremor Global e "Mais preferências" preservadas.
- **Filtro Todos / Frames / Trechos** (`.cena1-filter`): inalterado, continua
  como filtro secundário dentro da aba Tempo, com peso visual distinto das
  abas principais (`.ds-tab-bar`).

---

## 3. O que NÃO mudou (preservação)

- Motor de render (`getStateAtT` / `getStateAtTBase` / `applySegTremorLayer`).
- Estados de tempo: `framePauses[]`, `segDurations[]`, `loopDuration`,
  `finishMode`, `segmentTimingMode`, `projectShake`, `segTremorSettings[]`.
- JSON (`buildProjectData` / load): formato idêntico ao da BP. JSON antigo
  continua abrindo; JSON novo salva e reabre igual.
- Preview e export MP4 (Tremor determinístico inclusive).
- Stage, timeline inferior, frames/trechos no Stage, curvas/Bézier, seleção
  simples/múltipla, templates, formato, launcher, logo, apple-touch-icon,
  ícones Iconoir, menu superior, botão "Edição".
- Tremor Global e por trecho (apenas classes de aba foram trocadas; toggles,
  sliders e sincronização id-based intactos).
- Sequência Cena 1, `renderCena1Sequence`, `buildSegDurationRow`,
  `buildFramePauseRow`, `setCena1Filter`/`applyCena1Filter`.
- Sem multi-cena real, Cena 2, múltiplas imagens, transição entre cenas,
  rótulos coloridos de frame, Variação do Tremor, Tremor em pausa, Fundo em
  Preferências, ou mudança no export/JSON de cenas.

---

## 4. Checklist de aceite

1. [ ] A versão visível mostra **v8z4b29BQ** (launcher/ajustes + `APP_VERSION`
   + `APP_VERSION_NAME`).
2. [ ] No painel Edição de Tempo, o título **"Edição de Tempo"** e o botão de
   confirmar/fechar (✓) ficam na **mesma linha**.
3. [ ] O cabeçalho do painel (handle, título/check, resumo, Velocidade
   Constante, abas) **não rola** ao arrastar a lista de frames/trechos.
4. [ ] O resumo de duração (Duração Total / Trechos / Pausas / Acabamento)
   **não rola** e continua refletindo o estado real do projeto.
5. [ ] **Velocidade Constante** aparece na área fixa da aba Tempo (acima das
   abas Tempo/Preferências).
6. [ ] **Velocidade Constante NÃO aparece** na aba Preferências.
7. [ ] As abas **Tempo / Preferências** usam o novo padrão visual: texto
   grande, aba ativa com sublinhado e maior contraste, abas inativas em cinza,
   divisória fina abaixo do conjunto.
8. [ ] A aba ativa é **imediatamente identificável** ao alternar entre Tempo e
   Preferências.
9. [ ] A área rolável começa **apenas abaixo das abas** Tempo/Preferências; o
   conteúdo não fica escondido atrás do cabeçalho fixo.
10. [ ] A lista de frames/trechos (Cena 1), os blocos globais (Trechos —
    Duração, Frames — Pausas, Acabamento) e a aba Preferências rolam
    normalmente, sem cobrir o cabeçalho.
11. [ ] O filtro **Todos / Frames / Trechos** continua funcionando como filtro
    secundário, com peso visual distinto das abas principais.
12. [ ] No painel contextual de trechos (Easing/Movimento), as abas
    **Velocidade / Rotação / Escala** usam o mesmo padrão de abas (sublinhado,
    contraste, divisória) e a aba ativa é clara.
13. [ ] Trocar de aba (Tempo/Preferências e Velocidade/Rotação/Escala) não
    fecha o painel nem altera a seleção de frame/trecho.
14. [ ] **Preview** continua funcionando.
15. [ ] **Export MP4** continua funcionando.
16. [ ] **JSON antigo** continua abrindo.
17. [ ] **JSON novo** salva e reabre normalmente.
18. [ ] **Tremor Global** e **Tremor por trecho** continuam funcionando
    (toggle, Intensidade, Frequência, herança Global).
19. [ ] Sem regressões no iPhone/Safari (scroll único do painel preservado;
    sliders nativos `.dur-slider`; sem nested-scroll novo; cabeçalho sticky
    sem "vazamentos" visuais).

---

## 5. Riscos e mitigação

- **Cabeçalho sticky dentro de `#panelDuration`**: reaproveita a técnica já
  usada para o handle na BP (`position:sticky;top:0` + background sólido),
  agora aplicada a `.dur-fixed-header` (que envolve handle + título + resumo +
  Velocidade Constante + abas) em vez de só o handle. `#panelDuration`
  continua sendo o único container com `overflow-y:auto`.
- **Velocidade Constante reposicionada**: `btnTimingManual`/
  `btnTimingConstant`/`segTimingHint` continuam sendo os mesmos elementos
  (mesmos ids), apenas movidos de lugar no DOM — `setSegmentTimingMode` e
  `syncTimingModeUI` são id-based e não foram alterados.
- **Renomeação de classes de aba** (`dur-tab-active` → `ds-tab-active`,
  `ease-tab-active` → `ds-tab-active`): os dois pontos de JS que tocam essas
  classes (`switchDurTab` e `_syncEaseChannelUI`) foram atualizados juntos;
  nenhuma outra função depende dos nomes antigos (`dur-tab`, `dur-tabs-bar`,
  `ease-tab`, `ease-tabs-bar` removidos do CSS).
- **`.ease-tab-content` sem fundo unificado com as abas**: o cartão de
  conteúdo (`#movChannelActions`/`#rotChannelActions`/`#scaleChannelActions`,
  grid de chips de easing, botões "Aplicar aos 3"/"Resetar curva") não mudou
  de estrutura nem de wiring — apenas o contêiner visual ao redor.
