# QA — v8z4b29BP: painel "Edição de Tempo" com abas Tempo e Preferências

> Base: **v8z4b29BO** (Tremor Global do projeto + Frequência + modo por trecho).
> Objetivo: reorganizar o painel aberto pelo item **Edição** do menu inferior
> para um **centro de controle de tempo** mais claro, com resumo fixo no topo e
> duas abas (Tempo | Preferências). É uma reorganização **visual/UX** — a lógica
> de cálculo de tempo, o motor, o JSON, o export e o Tremor permanecem
> inalterados. **Multi-cena real NÃO é implementada** nesta versão.

---

## 1. Conceito implementado

O painel (antigo "Duração", aberto por `openPanel('Duration')`) passa a se
chamar **Edição de Tempo** e tem a estrutura:

```
Edição de Tempo
  [duração total grande]
  Resumo: Duração Total · Trechos · Pausas · Acabamento
  [ Tempo ] [ Preferências ]

  Aba Tempo (padrão):
    Cena 1
      filtro: Todos | Frames | Trechos
      F1   slider pausa    0.9s
      1–2  slider trecho   1.0s
      F2   slider pausa    0.0s
      2–3  slider trecho   0.9s
      …
    Trechos — Duração   (Intervalo padrão · Total · Igualar)
    Frames — Pausas     (Tudo · Zerar pausas)
    Acabamento          (Nenhum/Loop/Pausa final + tempos)

  Aba Preferências:
    Movimento — Distribuição do tempo (Manual / Velocidade constante)
    Tremor — Tremor Global do projeto (toggle + Intensidade + Frequência)
    Mais preferências (espaço reservado)
```

---

## 2. O que mudou (apenas apresentação)

- **Título**: "Duração" → **"Edição de Tempo"**. Botão de fechar/confirmar
  (`panel-close-check` → `closeAll()`) e item "Edição" (ícone `director-chair`)
  preservados.
- **Resumo fixo** (`#durationSummaryTop`): rótulos ajustados para **Duração
  Total / Trechos / Pausas / Acabamento**. Valores continuam vindo de
  `getDurationParts()` via `syncDurationUI()` — **nenhuma fórmula alterada**.
- **Abas** (`switchDurTab('tempo'|'prefs')`): só alternam visibilidade e
  re-sincronizam os controles da aba exibida. Não fecham o painel, não mexem na
  seleção de frame/trecho nem no estado. Abertura do painel força a aba **Tempo**.
- **Sequência Cena 1** (`renderCena1Sequence()`): lista intercalada construída
  com `buildFramePauseRow()` (reuso direto) e `buildSegDurationRow()` (extraído
  do antigo `openSegBreakdown`, wiring idêntico). Ordem: `F1, 1–2, F2, 2–3, …`
  e, se houver Loop, o trecho de fechamento `N–1` ao final.
  - As linhas por item, que antes viviam em `#segRows` e `#framePauseRows`,
    agora vivem **somente** em `#cena1Seq`. As funções de sync foram
    repontadas para `#cena1Seq` por atributo (`data-seg-row` / `data-seg-index`
    e `data-frame-pause-row` / `data-frame-index`).
- **Filtro** (`setCena1Filter` / `applyCena1Filter`): radio simples via classe
  no container (`flt-all|frames|segs`). Estado padrão **Todos**; nunca fica tudo
  desligado (sem estado ambíguo). Não altera lógica interna.
- **Controles globais** permanecem na aba Tempo: `Trechos — Duração` (Intervalo
  padrão, Total, Igualar intervalos), `Frames — Pausas` (Tudo, Zerar pausas) e
  `Acabamento`.
- **Preferências**:
  - **Distribuição do tempo** (Velocidade Constante): `btnTimingManual` /
    `btnTimingConstant` movidos para cá. `setSegmentTimingMode` /
    `syncTimingModeUI` inalterados (id-based).
  - **Tremor Global do projeto**: bloco (toggle + Intensidade + Frequência)
    movido de `panelEase` para Preferências. `syncTremorPanel`,
    `_initTremorListeners`, `toggleProjectShake`, `applyProjectShakeSetting` são
    todos id-based → continuam achando os controles. O **Tremor por trecho**
    (chips Global/Desligado/Personalizado) permanece em `panelEase`.
  - **Movimento Inteligente** permanece no painel de Movimento de cada trecho
    (controle por canal/segmento — posição contextual mais limpa).

---

## 3. O que NÃO mudou (preservação)

- Motor de render (`getStateAtT` / `getStateAtTBase` / `applySegTremorLayer`).
- Estados de tempo: `framePauses[]`, `segDurations[]`, `loopDuration`,
  `finishMode`, `segmentTimingMode`, `projectShake`, `segTremorSettings[]`.
- JSON (`buildProjectData` / load): formato idêntico ao da BO. JSON antigo e da
  BN/BO abrem normalmente; JSON novo salva e reabre igual.
- Preview e export MP4 (Tremor determinístico inclusive).
- Stage, timeline inferior, frames/trechos no Stage, curvas/Bézier, seleção
  simples/múltipla, templates, formato, launcher, logo, apple-touch-icon,
  ícones Iconoir, menu superior.
- Tremor Global e por trecho (apenas o **bloco visual** do Global foi
  reposicionado; modos Global/Desligado/Personalizado, JSON e Preview/MP4 do
  Tremor intactos).
- **Sem** multi-cena real, Cena 2, múltiplas imagens, transição entre cenas,
  rótulos coloridos de frame, Variação do Tremor, Tremor em pausa, ou mudança
  no export/JSON de cenas.

---

## 4. Checklist de aceite

1. [ ] A versão visível mostra **v8z4b29BP** (launcher/ajustes + `APP_VERSION`).
2. [ ] O painel aberto por "Edição" se chama **Edição de Tempo**.
3. [ ] O painel possui abas **Tempo** e **Preferências**.
4. [ ] A aba **Tempo** abre por padrão.
5. [ ] O topo mostra resumo com **Duração Total, Trechos, Pausas e Acabamento**
   e os valores acompanham mudanças de pausa/trecho/acabamento.
6. [ ] A aba Tempo mostra a sequência agrupada como **Cena 1**.
7. [ ] Dentro de Cena 1, frames e trechos aparecem em sequência lógica
   (`F1, 1–2, F2, 2–3, …`; trecho de fechamento ao final quando Loop ligado).
8. [ ] Slider de **frame** edita a pausa do frame (reflete no total e no Stage).
9. [ ] Slider de **trecho** edita a duração do percurso.
10. [ ] O filtro **Todos / Frames / Trechos** funciona; padrão Todos; nunca
    fica tudo oculto.
11. [ ] Controles globais **Frames – Pausas**, **Trechos – Duração** e
    **Acabamento** estão na aba Tempo e funcionam (Tudo, Zerar, Total, Igualar,
    Intervalo padrão, modos de acabamento).
12. [ ] **Velocidade Constante** está em Preferências e alterna com Manual;
    **Movimento Inteligente** continua no painel de Movimento do trecho.
13. [ ] **Tremor Global** em Preferências liga/desliga e ajusta Intensidade e
    Frequência; o Tremor por trecho em `panelEase` continua funcionando e
    herdando o Global.
14. [ ] Não há implementação real de multi-cena (só o agrupamento Cena 1).
15. [ ] **Preview** continua funcionando.
16. [ ] **Export MP4** continua funcionando.
17. [ ] **JSON antigo** continua abrindo.
18. [ ] **JSON novo** salva e reabre normalmente.
19. [ ] Sem regressões no iPhone/Safari (scroll único do painel preservado;
    sliders nativos `.dur-slider`; sem nested-scroll novo).

---

## 5. Riscos e mitigação

- **Linhas por item migradas para `#cena1Seq`**: todas as funções dependentes
  (`refreshPauseControls`, `syncSegRowsFromState`, `syncTimingModeUI`,
  `openSegBreakdown`, `renderFramePauseRows`) foram repontadas para `#cena1Seq`
  usando seletores por atributo (não por posição), cobrindo a lista intercalada.
  Os call sites antigos (`openSegBreakdown`, `renderFramePauseRows`,
  `syncDurationSectionsUI`, `refreshBreakdownIfOpen`) continuam válidos.
- **Tremor Global reposicionado**: como toda a UI do Tremor é id-based
  (`getElementById` + bind único em `window._tremorListenersInit`), mover o bloco
  no DOM não quebra o wiring. `openPanel('Duration')` e a aba Preferências
  chamam `syncTremorPanel()` para refletir o estado ao abrir.
- **Scroll iPhone/Safari**: o único container com scroll continua sendo
  `#panelDuration`; `#cena1Seq` herda `overflow:visible`. Sliders seguem com a
  classe `.dur-edit-row` / `.dur-slider`, sem `touch-action` override.
