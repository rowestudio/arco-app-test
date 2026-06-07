# AUDITORIA TÉCNICA — Arco Motion App / Ken Burns App
## `index.html` — Diagnóstico de causa raiz (Problemas 1 e 2)

> Documento de auditoria apenas (sem implementação). Referências de linha baseadas no estado de `index.html` no momento da análise (HEAD = commit `cd43813`, "fix: stabilize lower timeline markers", v8z4b29W).

---

## BLOCO 1 — RESUMO EXECUTIVO

Os dois problemas relatados têm **causas raiz distintas, mas do mesmo tipo**: mistura de sistemas de coordenadas/estado sem uma fonte única de verdade.

- **Problema 1** (marcador ≠ frame focal): existe um **deslocamento constante de ~5px** entre o sistema de coordenadas usado para desenhar o marcador (`getBoundingClientRect`, correto) e o sistema usado para calcular/snapar o frame central (`offsetLeft` + `scrollLeft`/`clientWidth`, misturados). A versão 29W **não corrigiu isso** — ela reescreveu a fórmula do marcador, que já estava certa (e é matematicamente idêntica à fórmula antiga `left:50%`), deixando intacta a função que de fato contém o bug.

- **Problema 2** (multi-seleção desestabiliza Coluna 2/Row 4): a função `toggleFrameSelection` **nunca chama `closeCustBar()`** na transição para o modo de multi-seleção (o guard `selectedFrames.size === 0` já é falso nesse momento), e um listener global bloqueia explicitamente o fechamento de `#custBar` para toques dentro de `#midBar`. Isso permite que **duas arquiteturas de menu coexistam simultaneamente** (`cust-open`/`cust-expanded` vs `has-multi-selection`/`align-submenu-open`), cada uma reescrevendo `grid-row`/`grid-column`/`z-index` de `#lowerContextSlot` de forma incompatível — daí o menu-sobre-menu, ícones residuais e a "Row 4 empurrada para baixo".

Ambos os problemas são sintomas de **falta de uma única fonte de verdade**: no Problema 1, para coordenadas geométricas; no Problema 2, para estado de UI/exclusão mútua entre modos.

---

## BLOCO 2 — DIAGNÓSTICO DETALHADO: PROBLEMA 1 (Marcador vs Frame Focal)

### 2.1 Elementos envolvidos (mapa)

```
.lower-timeline-slot   (position: relative;  --lower-timeline-center-x: 50%)  ← offsetParent real dos .fp
 └── ::before / ::after                       (left: var(--lower-timeline-center-x); transform: translateX(-50%))
 └── .lower-main        (padding: 0 5px)      ← introduz constante C ≈ 5px
      └── #pillsRow / .mid-pills (flex; overflow-x:auto; padding: 0 12px; position: STATIC)
           └── .fp (pills)                    ← elementos cujo offsetLeft é medido
```

### 2.2 Funções envolvidas e seus sistemas de coordenadas

| Função | Linha | Fórmula | Sistema de coordenadas |
|---|---|---|---|
| `getTimelineStageFocusIndex()` | 11125 | retorna `activeIdx` em multi-seleção, senão `timelineFocalFrameId → lowerTimelineCenterFrameIndex → activeIdx` | (lógico, não geométrico) |
| `syncLowerTimelineCenterMarkers()` | 11131 | `slotEl.style.setProperty('--lower-timeline-center-x', (pillsRect.left - slotRect.left + pillsRect.width/2) + 'px')` | **`getBoundingClientRect()`** — geometria visual renderizada |
| `getLowerTimelineNearestFrameIndex()` | 11140 | `centerX = pillsEl.scrollLeft + pillsEl.clientWidth/2`; compara com `el.offsetLeft + el.offsetWidth/2` | **mistura**: `scrollLeft`/`clientWidth` (viewport interno de `#pillsRow`) com `offsetLeft` (relativo a `.lower-timeline-slot`) |
| `centerLowerTimelineOnFrame()` | 11294 | `nextScroll = Math.min(maxScroll, Math.max(0, pill.offsetLeft + pill.offsetWidth/2 - pillsEl.clientWidth/2))` | mesma mistura `offsetLeft` × `clientWidth` |
| `updateLowerTimelineCenterFrameFromScroll()` | 11153 | dispara o cálculo de frame central a partir do scroll | depende de `getLowerTimelineNearestFrameIndex` |
| `applyTimelinePillFocusClasses()` | 11162 | aplica classes visuais de foco | (lógico) |
| `applyStageTimelineFocusVisuals()` | 11179 | aplica visuais no stage | (lógico) |
| `scheduleLowerTimelineCenterFrameUpdate()` | 11202 | debounce do recálculo | — |
| `scheduleLowerTimelineSnapToCenter()` | 11209 | debounce do snap | — |
| `updateLowerTimelineMeta()` | 11226 | chama `syncLowerTimelineCenterMarkers()` (11245) e `body.classList.toggle('has-multi-selection', isMultiSelectionActive())` (11227) | — |
| `centerLowerTimelineOnFrame` chamado por | `requestLowerTimelineCenter()` (11340), `bindLowerTimelineScrollSync()` (11349) | — | — |

### 2.3 Causa raiz exata

`#pillsRow`/`.mid-pills` **não tem `position` definido** (confirmado nas linhas 1041-1045: `flex:1; display:flex; align-items:center; gap:6px; overflow-x:auto; padding:0 12px;` — sem `position`). Logo, é `position: static`.

Isso significa que o **`offsetParent`** de cada `.fp` (pill) **não é `#pillsRow`**, e sim `.lower-timeline-slot` — o ancestral mais próximo com `position: relative` (linha 1203).

Consequência: `el.offsetLeft` em `getLowerTimelineNearestFrameIndex`/`centerLowerTimelineOnFrame` é medido **a partir de `.lower-timeline-slot`**, enquanto `pillsEl.scrollLeft`/`pillsEl.clientWidth` são medidos **no viewport interno de `#pillsRow`**. A diferença entre essas duas origens é exatamente o `padding-left: 5px` de `.lower-main` (linha 1186) — uma constante que chamo de **C ≈ 5px**.

Já `syncLowerTimelineCenterMarkers()` usa **`getBoundingClientRect()`** dos dois elementos (`pillsRect` e `slotRect`) e subtrai um do outro — isso produz a posição correta e consistente do marcador, **sem** o erro C.

**Prova de que a fórmula do marcador é equivalente à antiga `left:50%`:** Como `.lower-main` tem padding simétrico (`0 5px`) e `#pillsRow` ocupa 100% do content-box de `.lower-main`, `pillsRect.left - slotRect.left + pillsRect.width/2` resolve algebricamente para o mesmo valor que `50%` da largura de `.lower-timeline-slot`. Ou seja: **a fórmula nova do marcador (29W) produz o mesmo resultado numérico que a fórmula antiga `left:50%`** — não houve mudança de comportamento real.

### 2.4 Resultado do bug

O frame que efetivamente é centralizado pelo snap (`centerLowerTimelineOnFrame`) fica deslocado em **~5px (constante C)** em relação à posição onde o marcador laranja/amarelo é desenhado (`syncLowerTimelineCenterMarkers`). O usuário enxerga a bolinha "fora do lugar" — mas na verdade é o **snap que está errado**, não o marcador.

### 2.5 Qual deveria ser a fonte única de verdade

**`getBoundingClientRect()` de `#pillsRow` relativo a `.lower-timeline-slot`** — o mesmo sistema já usado corretamente por `syncLowerTimelineCenterMarkers()`. As funções `getLowerTimelineNearestFrameIndex` e `centerLowerTimelineOnFrame` precisam:
- ou converter `el.offsetLeft` para o referencial de `#pillsRow` (subtraindo o offset de `#pillsRow` em relação a `.lower-timeline-slot`, isto é, removendo a constante C);
- ou recalcular tudo via `getBoundingClientRect()`, abandonando `offsetLeft`/`offsetParent` por completo.

### 2.6 Por que a versão 29W falhou

29W reescreveu **`syncLowerTimelineCenterMarkers()`** — trocou `left: 50%` fixo por `--lower-timeline-center-x` calculado via `getBoundingClientRect`. Mas, como provado em 2.3, **essa fórmula já era matematicamente equivalente à anterior**. O commit `cd43813` ("fix: stabilize lower timeline markers") mexeu na peça que **já estava certa**, e não tocou em `getLowerTimelineNearestFrameIndex`/`centerLowerTimelineOnFrame`, onde o erro de fato mora. Por isso o sintoma persiste — a causa raiz nunca foi alcançada.

### Propostas de correção

- **Mínima**: em `getLowerTimelineNearestFrameIndex` e `centerLowerTimelineOnFrame`, substituir `el.offsetLeft` por `(el.getBoundingClientRect().left - pillsEl.getBoundingClientRect().left) + pillsEl.scrollLeft`, eliminando a dependência de `offsetParent`.
- **Ideal**: criar uma função utilitária única, ex. `getPillCenterInScrollSpace(pillEl, pillsEl)`, usada por **todas** as três funções (marcador, nearest-frame, snap), garantindo que os três cálculos sempre derivem do mesmo sistema de coordenadas.

---

## BLOCO 3 — DIAGNÓSTICO DETALHADO: PROBLEMA 2 (Multi-seleção desestabiliza Coluna 2 / Row 4)

### 3.1 Mapa real da arquitetura do `#midBar.timeline-grid`

```
#midBar.timeline-grid                              (grid 2 colunas × 4 linhas — auto-placement)
 └── #lowerContextSlot   (linhas 2690-2875)        ← container que muda de modo
      ├── #toolbar       (linha 2692)              ← MODO A: single-frame padrão
      ├── #alignBar      (linha 2716, fecha 2752)  ← MODO B: multi-seleção
      │    ├── #alignBarPrimary
      │    └── #alignBarSubmenu                    ← overlay absoluto do submenu de alinhamento
      └── #custBar       (linha 2762, fecha 2873)  ← MODO C: customização single-frame
```

`#toolbar`, `#alignBar` e `#custBar` são **irmãos** dentro de `#lowerContextSlot` — ou seja, fisicamente coexistem no DOM; apenas regras de CSS condicionadas por classes de `body` decidem qual aparece.

### 3.2 Classes de estado e o que cada uma controla

| Classe em `body` | Efeito CSS relevante | Linha |
|---|---|---|
| `body.has-multi-selection` | mostra `#alignBar` (linha 1256: `body:not(.has-multi-selection) #alignBar{display:none!important}`); esconde `#toolbar` (1253: `body.has-multi-selection #toolbar{display:none}`) | 1253, 1256 |
| `body.cust-open` | esconde `#toolbar` e `#alignBar` (1254-1255: `display:none!important`) | 1254-1255 |
| `body.cust-expanded` | **reposiciona** `#lowerContextSlot{grid-column:1/3; grid-row:3/5; z-index:14}` — ocupa 2 colunas e 2 linhas de grid | 1257 |
| `body.align-submenu-open` (+ `#alignBar.align-submenu-open`) | ativa `#alignBarSubmenu{position:absolute; left:calc(-1*(--lower-left-w + 5px)); right:0; bottom:var(--lower-home-breath); height:calc(--lower-row-3 + --lower-row-4 + 4px - --lower-home-breath)!important; z-index:12}` | 1251 |

### 3.3 Causa raiz exata

A função crítica é `toggleFrameSelection(fi, makeActive)` (linha 21563):

```js
function toggleFrameSelection(fi, makeActive) {
  if (shouldBlockGlobalUIAction()) return;
  if (fi < 0 || fi >= frameCount) return;
  const wasMultiSelectionActive = isMultiSelectionActive();      // selectedFrames.size >= 1
  const wasSelected = selectedFrames.has(fi);
  if (wasSelected) selectedFrames.delete(fi);
  else selectedFrames.add(fi);
  frameMultiSelectMode = selectedFrames.size > 0;
  const isSelectingMultiple = wasMultiSelectionActive || selectedFrames.size > 1;
  if (makeActive && !isSelectingMultiple && selectedFrames.size === 0) {
    resetCustGlobalLocks();
    selectFrameContext(fi, { centerTimeline: true });
    lastPillTap = fi;
    closeCustBar();                                              // <- só roda se size === 0
  }
  renderAll();
  ...
  updateAlignBar();
}
```

No instante em que o usuário aciona "Selecionar todos" (`selectAllFramesForContext`, linha ~21925) ou inicia qualquer multi-seleção, `selectedFrames.size` **já é maior que zero** — então o guard `selectedFrames.size === 0` é **falso**, e `closeCustBar()` **nunca é executado** nessa transição.

Some-se a isso a linha **15206**, dentro da IIFE `attachImageAreaCloseHandler`:

```js
if (e.target.closest('#midBar')) return;   // bloqueia fechamento de #custBar para toques dentro de #midBar
```

Esse guard impede que **qualquer interação dentro da área inferior** dispare o fechamento de `#custBar` — mesmo quando o usuário está claramente mudando de contexto (entrando em multi-seleção).

**Resultado**: é possível que `body.cust-open` + `body.cust-expanded` (arquitetura de menu single-frame, que reposiciona `#lowerContextSlot` via `grid-row:3/5` e `z-index:14`) e `body.has-multi-selection` + `body.align-submenu-open` (arquitetura de menu multi-seleção, overlay absoluto `#alignBarSubmenu` via cálculo de altura "mágico" e `z-index:12`) **estejam ativas simultaneamente** — sem nenhuma rotina central garantindo exclusão mútua entre elas.

### 3.4 Explicação técnica símbolo a símbolo

- **`display`/`grid`**: `body.cust-expanded #lowerContextSlot{grid-column:1/3; grid-row:3/5}` — o slot passa a ocupar **2 linhas de grid** (3 e 4) em vez de uma. Isso é o que tecnicamente "empurra"/sobrepõe a Row 4 — não é um bug de overflow, é uma **reescrita deliberada de geometria de grid** que entra em conflito quando outro modo (multi-seleção) também quer essa área.
- **`z-index`**: `#lowerContextSlot.cust-expanded` tem `z-index:14`; `#alignBarSubmenu` tem `z-index:12`. Quando ambos ficam visíveis, o de maior z-index cobre o outro — daí "menu sobre menu".
- **`position`**: `#alignBarSubmenu` é `position:absolute` com `left`/`right`/`bottom`/`height` calculados a partir de variáveis (`--lower-row-3`, `--lower-row-4`, `--lower-home-breath`) que assumem que `#lowerContextSlot` está nas linhas 3-4 normais; quando `cust-expanded` o estica para `3/5`, a base geométrica do cálculo já não corresponde à realidade — daí o "submenu subindo demais"/se posicionando errado.
- **`overflow`/`safe-area`**: não é a causa primária do deslocamento de Row 4 (isso é geométrico/grid), mas contribui para clipping/recortes quando as duas geometrias coexistem em uma área já contestada.
- **Coluna 1 permanece estável** porque **nenhuma regra condicional de `grid-row`/`grid-column`/`z-index`** existe para ela — só `#lowerContextSlot` (Coluna 2) tem essas reescritas por classe de `body`.

### 3.5 Explicação símbolo a símbolo dos sintomas relatados

| Sintoma | Causa técnica |
|---|---|
| Row 4 "empurrada para baixo" | `cust-expanded` aplica `grid-row:3/5` ao mesmo tempo em que `has-multi-selection` espera a área de Row 4 livre para `#alignBar`/`#alignBarSubmenu` |
| Submenu abre no lugar errado / "sobe demais" | fórmula de `height`/`bottom` do `#alignBarSubmenu` (1251) pressupõe `#lowerContextSlot` em `grid-row:3/4`; com `cust-expanded` ativo a referência geométrica já não bate |
| Menu sobre menu | `z-index:14` (`cust-expanded`) e `z-index:12` (`align-submenu-open`) podem coexistir — não há exclusão mútua |
| Texto/ícone residual | nós DOM de `#toolbar`/`#custBar`/`#alignBar` continuam no DOM (são irmãos); como as classes de `body` não são mutuamente exclusivas, certas combinações deixam elementos visíveis sem a classe que deveria escondê-los |
| Mudança só na Coluna 2, Coluna 1 estável | só `#lowerContextSlot` tem regras de reposicionamento condicional; a Coluna 1 não tem equivalentes |

### 3.6 É um único container que "entra no fluxo"?

Sim — **`#lowerContextSlot`** é o único elemento da Coluna 2 com regras de `grid-row`/`grid-column`/`z-index` condicionadas a estado (`cust-expanded`). Não é uma questão de `overflow` "vazando"; é uma **reescrita ativa e deliberada da própria geometria de grid**, que dois modos de UI tentam aplicar à mesma área ao mesmo tempo.

### Propostas de correção (nível de arquitetura)

1. **Garantir exclusão mútua de estado**: criar uma função central, ex. `setLowerContextMode(mode)` (`'toolbar' | 'align' | 'cust' | 'cust-expanded'`), que sempre limpa todos os outros estados antes de ativar o novo — chamada obrigatoriamente em `toggleFrameSelection`, `selectAllFramesForContext`, `openCustBar`, `openAlignSubmenu`, etc.
2. **`closeCustBar()` deve rodar sempre que se entra em multi-seleção**, independentemente do valor de `selectedFrames.size` — remover/ajustar o guard `selectedFrames.size === 0`.
3. **Remover o whitelist de `#midBar`** em `attachImageAreaCloseHandler` (linha 15206) ou substituí-lo por uma checagem que permita fechar `#custBar` quando o alvo da interação é claramente de outro modo (ex. botão "Selecionar todos"/checkbox de multi-seleção).
4. **`#alignBarSubmenu` não deveria depender de `#lowerContextSlot` estar em `grid-row:3/4`**: tratá-lo como **overlay absoluto posicionado relativo a `#midBar`** (não a `#lowerContextSlot`), com altura/posição calculadas a partir de variáveis de grid do próprio `#midBar`, independentemente do estado de `cust-expanded`.
5. **`cust-expanded` não deveria crescer sobre Row 4** se outro modo (`has-multi-selection`) estiver ativo — ou melhor: os dois modos deveriam ser estruturalmente exclusivos (um único "modo de contexto inferior" ativo por vez).

---

## BLOCO 4 — RISCOS DE IMPLEMENTAÇÃO

| Risco | Descrição |
|---|---|
| Regressão no scroll-snap (Problema 1) | Corrigir o offset C em `getLowerTimelineNearestFrameIndex`/`centerLowerTimelineOnFrame` exige interagir com o guard de "scroll programático" (`lowerTimelineProgrammaticScrollUntil`/`isLowerTimelineProgrammaticCentering`); um erro de sincronismo pode introduzir loops de re-snap ou "tremedeira" visual |
| Quebra de layout em cascata (Problema 2) | `#lowerContextSlot` participa de pelo menos 3 estados de grid diferentes (`toolbar` padrão, `cust-expanded grid-row:3/5`, `has-multi-selection`); mudar uma regra sem mapear todas as combinações pode trocar um bug visível por outro mais sutil |
| Guerra de especificidade `!important` | `#alignBar`/`#custBar` têm tanto regras legadas (`position:fixed; bottom:0; height:calc(48px+...)`) quanto regras novas de grid-cell (`position:static!important`); remover `!important` sem remover a regra legada correspondente pode reativar o comportamento antigo |
| Fórmulas de `safe-area-inset-bottom` redundantes | Existem 4+ fórmulas coexistindo (`--lower-safe-bottom` subtrai 34px; barras legadas somam 48px; padding legado subtrai 26px; `--lower-home-breath:6px`); alterar uma sem as outras pode gerar recortes ou espaços extras em iPhones com notch/home-indicator |
| Dependência entre os dois problemas | Como ambos tocam `#lowerContextSlot`/`#midBar`, uma correção feita isoladamente para o Problema 2 (reposicionamento de `#alignBarSubmenu`, mudanças de `grid-row`) pode alterar `clientWidth`/`getBoundingClientRect` usados no Problema 1 — recomenda-se medir novamente os valores de C após qualquer mudança estrutural na Coluna 2 |
| Teste real necessário em iOS/Safari | `env(safe-area-inset-bottom)` e comportamento de `overflow-x:auto`/scroll-snap têm diferenças sutis entre Safari iOS e outros engines; qualquer correção precisa ser validada em dispositivo real, não apenas em simulador/desktop |

---

## BLOCO 5 — PLANO MÍNIMO DE CORREÇÃO (4 PRs sugeridas)

### PR A — Unificar o eixo de centro da timeline (resolve Problema 1)
- Criar uma função utilitária única (ex. `getPillCenterInScrollSpace(pillEl, pillsEl)`) baseada em `getBoundingClientRect()`.
- Substituir os usos de `el.offsetLeft`/`offsetParent` em `getLowerTimelineNearestFrameIndex` (11140) e `centerLowerTimelineOnFrame` (11294) por essa função, eliminando a constante C (~5px).
- Não tocar em `syncLowerTimelineCenterMarkers` (já está correta).
- Validar visualmente: o frame que para no centro deve ser exatamente aquele sob a bolinha laranja.

### PR B — Garantir exclusão mútua entre modos do `#lowerContextSlot` (resolve Problema 2 — núcleo)
- Criar `setLowerContextMode(mode)` central que limpa **todas** as classes de modo (`cust-open`, `cust-expanded`, `has-multi-selection`, `align-submenu-open`) antes de aplicar a nova.
- Chamar essa função em todos os pontos de entrada: `toggleFrameSelection`, `selectAllFramesForContext`, `openCustBar`, `closeCustBar`, `openAlignSubmenu`, `closeAlignSubmenu`, `clearMultiSelect`.
- Remover o guard `selectedFrames.size === 0` que impede `closeCustBar()` de rodar ao entrar em multi-seleção.
- Ajustar/remover o whitelist `if (e.target.closest('#midBar')) return;` (linha 15206).

### PR C — Desacoplar `#alignBarSubmenu` da geometria de `#lowerContextSlot` (resolve "submenu no lugar errado")
- Reposicionar `#alignBarSubmenu` como overlay absoluto relativo a `#midBar` (não a `#lowerContextSlot`/`#alignBar`).
- Recalcular `height`/`bottom`/`left` a partir das variáveis de grid de `#midBar` (`--lower-row-1..4`), sem depender do estado `cust-expanded`.
- Isso evita que a expansão de `#lowerContextSlot` quebre a geometria do submenu.

### PR D — Consolidar fórmulas de safe-area e remover regras legadas mortas
- Auditar todas as ocorrências de `env(safe-area-inset-bottom)` e `calc(48px + ...)` / `calc(... - 26px)` / `--lower-safe-bottom` / `--lower-home-breath`.
- Definir **uma única variável** (`--lower-safe-bottom-final`, por exemplo) calculada uma vez no `:root` ou em `#midBar`, e referenciá-la em todos os lugares.
- Remover as regras `position:fixed; bottom:0; height:calc(48px+...)` legadas de `#alignBar`/`#custBar` que hoje são neutralizadas via `!important` pelas regras de grid-cell — eliminando a guerra de especificidade.

**Ordem recomendada de execução**: PR B (estabiliza o estado, evita que A/C sejam testadas sobre um sistema instável) → PR A (resolve o problema mais "isolado" e mensurável) → PR C (depende de B estar pronta) → PR D (limpeza final, menor risco).

---

## ANEXO — Confirmação/Refutação das 7 suspeitas levantadas

| # | Suspeita | Veredito | Evidência |
|---|---|---|---|
| 1 | Eixo do marcador ≠ eixo do snap | **CONFIRMADA** | marcador usa `getBoundingClientRect`; snap usa `offsetLeft`/`scrollLeft` mistos (offset constante C≈5px) |
| 2 | Container de referência errado | **CONFIRMADA** | `offsetParent` real é `.lower-timeline-slot`, não `#pillsRow`, mas o cálculo trata `offsetLeft` como se fosse relativo a `#pillsRow` |
| 3 | Multi-seleção altera geometria (não só conteúdo) | **CONFIRMADA** | `body.cust-expanded #lowerContextSlot{grid-column:1/3;grid-row:3/5}` reescreve posicionamento de grid, não apenas visibilidade |
| 4 | Row 3/Coluna 2 não está realmente "reservada" | **CONFIRMADA** | `grid-row:3/5` faz o slot crescer sobre território de Row 4 |
| 5 | Mistura de arquiteturas antiga/nova | **CONFIRMADA** | `#alignBar`/`#custBar` têm regra legada `position:fixed;bottom:0;height:calc(48px+...)` (linha ~2716 inline + 1689-1718) sobrescrita por `!important` em regras de grid-cell (1240) — duas arquiteturas convivendo via guerra de especificidade |
| 6 | Safe-area aplicada em camadas redundantes | **CONFIRMADA** | 4+ fórmulas distintas de `env(safe-area-inset-bottom)`: `--lower-safe-bottom` (subtrai 34px), barras legadas (+48px), padding legado (−26px), `--lower-home-breath:6px` |
| 7 | Falta de exclusão mútua entre `#toolbar`/`#alignBar`/`#alignBarSubmenu`/`#custBar` | **CONFIRMADA** | nenhuma rotina centraliza "ativar X desativa Y, Z, W"; cada estado é ligado/desligado independentemente via classes de `body`, permitindo combinações inválidas |
