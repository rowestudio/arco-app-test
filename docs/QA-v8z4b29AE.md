# QA — v8z4b29AE camada inferior unificada de submenus

## Base confirmada

- Versão anterior preservada: `v8z4b29AD`.
- Escopo da `v8z4b29AD`: microcorreção parcial de `#alignBarSubmenu` em seleção múltipla.
- Registro obrigatório: `v8z4b29AD` não foi considerada solução completa para a área inferior, porque não corrigia frame simples nem estabilizava a camada inferior como sistema único.
- Áreas não alteradas: Stage, menu superior, ícone Formato, snap-to-center, `timelineFocalFrameId`, Alpha/spotlight, Preview/export/MP4, JSON, curvas e motor.

## Auditoria obrigatória antes da alteração

### 1. Elemento real do submenu em frame simples

- O submenu real de frame simples é `#custBarContent`.
- Fluxo: o clique em Pausa/Rotação/Escala/Mover chama `openCustBarTabFromBottom(...)`, abre `#custBar`, remove `compact-mode` em `switchCustTab(...)`, aplica `body.cust-expanded` e mostra uma `.cust-content` dentro de `#custBarContent`.
- `#custBar` é o contêiner do menu contextual; `#custBarContent` é o painel real que contém botão Voltar, slider/chips e conteúdo de Pausa/Rotação/Escala/Mover.

### 2. Elemento real do submenu em seleção múltipla

- O submenu real de seleção múltipla é `#alignBarSubmenu`.
- Fluxo: `openAlignSubmenu(group)` oculta `#alignBarPrimary`, mostra `#alignBarSubmenu`, adiciona `.align-submenu-open` em `#alignBar` e adiciona `body.align-submenu-open`.
- `#alignBar` continua sendo o contêiner da Linha 4 / Coluna 2; o painel aberto é `#alignBarSubmenu`.

### 3. CSS rules relevantes de bottom/height/padding/overflow

#### Área inferior / grid

- `.mid-bar.timeline-grid` define:
  - `--lower-row-3:36px`;
  - `--lower-row-4:46px`;
  - `--lower-context-gap:2px`;
  - `--lower-context-panel-h:calc(var(--lower-row-3) + var(--lower-row-4) + var(--lower-context-gap))`;
  - `--lower-safe-bottom:max(calc(env(safe-area-inset-bottom, 0px) - 34px), 0px)`;
  - `grid-template-rows:var(--lower-row-1) var(--lower-row-2) var(--lower-row-3) var(--lower-row-4)`;
  - `row-gap:var(--lower-context-gap)`;
  - `padding:0 0 var(--lower-safe-bottom)`;
  - `overflow:visible`.

#### Seleção múltipla

- `.mid-bar.timeline-grid #alignBarSubmenu` fechado/base:
  - `height:100% !important`;
  - `overflow-x:auto !important`;
  - `overflow-y:hidden !important`;
  - `padding:0 !important`.
- `.mid-bar.timeline-grid #alignBar.align-submenu-open #alignBarSubmenu` aberto:
  - `position:absolute`;
  - `left:calc(-1 * (var(--lower-left-w) + 5px))`;
  - `right:0`;
  - `bottom:0`;
  - `height:var(--lower-context-panel-h) !important`;
  - `min-height:var(--lower-context-panel-h)`;
  - `overflow-x:auto !important`;
  - `overflow-y:visible !important`;
  - `padding:8px 8px 6px 6px !important`;
  - `box-sizing:border-box`.

#### Frame simples

- `body.cust-expanded #lowerContextSlot`:
  - `grid-column:1 / 3`;
  - `grid-row:3 / 5`;
  - `padding:0`;
  - `overflow:visible`.
- `body.cust-expanded .mid-bar.timeline-grid #custBar`:
  - `height:100% !important`;
  - `max-height:100% !important`;
  - `pointer-events:auto`.
- `body.cust-expanded .mid-bar.timeline-grid #custBarContent`:
  - `height:100%`;
  - `min-height:100%`;
  - `padding:8px 8px 6px 6px !important`;
  - `box-sizing:border-box`;
  - `overflow-x:auto !important`;
  - `overflow-y:visible !important`.

### 4. Safe-area duplicada

- Antes da v8z4b29AE, o grid tinha safe-area própria em `.mid-bar.timeline-grid`, e o estado `body.cust-expanded #lowerContextSlot` ainda adicionava `var(--lower-home-breath)` no padding inferior do slot expandido.
- Na v8z4b29AE, a safe-area continua centralizada no grid (`--lower-safe-bottom` + `padding-bottom` da `.mid-bar.timeline-grid`) e o slot expandido de frame simples passa a usar `padding:0` para evitar respiro inferior duplicado no próprio slot.
- `#alignBarSubmenu` continua com padding interno pequeno para o conteúdo e thumbs, mas não adiciona nova safe-area estrutural.

### 5. Linha 3 participando do fluxo da Linha 4

- Linha 3 não participa do fluxo da Linha 4 como reflow vertical: a `.mid-bar.timeline-grid` é uma grade de quatro linhas explícitas.
- Em frame simples expandido, `#lowerContextSlot` ocupa explicitamente `grid-row:3 / 5`, substituindo a área contextual por um painel único de Linha 3 + gap + Linha 4.
- Em seleção múltipla, `#alignBarSubmenu` é `position:absolute` dentro de `#alignBar.align-submenu-open`, ancorado em `bottom:0`, e sua altura usa a variável comum de painel inferior; isso evita usar `#custBar` para corrigir fluxo de seleção múltipla.

### 6. “Selecionar todos” alterando geometria da Linha 4

- “Selecionar todos” da área inferior é `.lower-selection-action` dentro de `.lower-selection-actions`.
- `.lower-selection-actions` é `position:absolute` dentro de `.lower-active-state`, com `width/min-width/flex-basis:var(--lower-select-all-w)` e alterna apenas `visibility`/`pointer-events` em `body.has-multi-selection`.
- `.lower-active-label` reserva espaço com `padding-right:var(--lower-select-all-w)`.
- Portanto, “Selecionar todos” ocupa área pré-alocada na Linha 3 / Coluna 2 e não altera altura, largura, gap, padding nem posição de `#lowerContextSlot`, `#toolbar` ou `#alignBar` na Linha 4 / Coluna 2.
- O botão mantém texto antes do ícone, `white-space:nowrap`, `min-width:max-content` e SVG depois do texto.

## Correção aplicada

- A altura contextual comum passou a ser `--lower-context-panel-h`, calculada a partir de Linha 3 + gap + Linha 4.
- `#alignBarSubmenu` preserva a correção da v8z4b29AD (`bottom:0`, `overflow-y:visible`, camada absoluta), mas deixa de usar a altura residual `calc(var(--lower-row-3) + var(--lower-row-4) - 8px)`.
- Frame simples passa a aplicar o mesmo princípio ao elemento real `#custBarContent`: o slot expandido define a área estrutural, e o conteúdo ocupa 100% dessa área sem padding inferior adicional em `#lowerContextSlot`.
- Nenhuma alteração foi feita em motor, Preview/export, JSON, curvas, Stage, menu superior, snap-to-center, `timelineFocalFrameId` ou Alpha/spotlight.


## Mapeamento de estados para `getBoundingClientRect()`

> Como não há browser gráfico disponível neste ambiente, esta auditoria registra os seletores reais e o ponto de medição. Os valores numéricos devem ser coletados no QA visual com o snippet abaixo.

### Estado A — frame simples, menu normal

Medir: `#lowerContextSlot`, `#toolbar`, `#custBar`, `#custBarContent`, `#pillsRow`, Linha 3 / Coluna 2 (`.lower-active-state`) e Linha 4 / Coluna 2 (`#lowerContextSlot`).

### Estado B — frame simples + submenu aberto

Abrir Pausa, Rotação, Escala e Mover/Posição; em cada abertura medir: `#custBarContent` como submenu real, `#custBar`, `#lowerContextSlot` e `#pillsRow`.

### Estado C — seleção múltipla, menu normal

Medir: `#alignBar`, `#alignBarPrimary`, `#alignBarSubmenu`, `.lower-selection-actions`, `.lower-selection-action`, `#lowerContextSlot`, Linha 3 / Coluna 2 (`.lower-active-state`) e Linha 4 / Coluna 2 (`#lowerContextSlot`).

### Estado D — seleção múltipla + submenu aberto

Abrir Pausa, Rotação, Escala e Mover; em cada abertura medir: `#alignBarSubmenu` como submenu real, `#alignBar`, `#lowerContextSlot` e `#pillsRow`.

## Medição obrigatória pós-correção

> Ambiente automatizado atual não possui browser/iPhone/Safari disponível. As medições abaixo devem ser preenchidas no QA visual usando `getBoundingClientRect()`.

### Snippet de medição

```js
function rectOf(sel) {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top:r.top, right:r.right, bottom:r.bottom, left:r.left, width:r.width, height:r.height };
}
function lowerAudit(submenuSel) {
  const slot = rectOf('#lowerContextSlot');
  const submenu = rectOf(submenuSel);
  const pills = rectOf('#pillsRow');
  return {
    lowerContextSlot: slot,
    submenu,
    pillsRow: pills,
    submenuTopMinusPillsBottom: submenu && pills ? submenu.top - pills.bottom : null,
    lowerSlotBottomMinusSubmenuBottom: slot && submenu ? slot.bottom - submenu.bottom : null
  };
}
```

### Frame simples + submenu aberto

Medir após abrir Pausa, Rotação, Escala e Mover/Posição:

| Submenu | `#lowerContextSlot` rect | submenu real rect (`#custBarContent`) | `#pillsRow` rect | `submenu.top - pills.bottom` | `lowerContextSlot.bottom - submenu.bottom` |
|---|---|---|---|---:|---:|
| Pausa | Pendente browser real | Pendente browser real | Pendente browser real | Pendente | Pendente |
| Rotação | Pendente browser real | Pendente browser real | Pendente browser real | Pendente | Pendente |
| Escala | Pendente browser real | Pendente browser real | Pendente browser real | Pendente | Pendente |
| Mover/Posição | Pendente browser real | Pendente browser real | Pendente browser real | Pendente | Pendente |

Critério esperado: `lowerContextSlot.bottom - submenu.bottom` próximo de `0px`; `submenu.top - pills.bottom` não negativo; thumb do slider visível; sem espaço morto exagerado embaixo.

### Seleção múltipla + submenu aberto

Medir após abrir Pausa, Rotação, Escala e Mover:

| Submenu | `#lowerContextSlot` rect | submenu real rect (`#alignBarSubmenu`) | `#pillsRow` rect | `submenu.top - pills.bottom` | `lowerContextSlot.bottom - submenu.bottom` |
|---|---|---|---|---:|---:|
| Pausa | Pendente browser real | Pendente browser real | Pendente browser real | Pendente | Pendente |
| Rotação | Pendente browser real | Pendente browser real | Pendente browser real | Pendente | Pendente |
| Escala | Pendente browser real | Pendente browser real | Pendente browser real | Pendente | Pendente |
| Mover | Pendente browser real | Pendente browser real | Pendente browser real | Pendente | Pendente |

Critério esperado: `lowerContextSlot.bottom - submenu.bottom` próximo de `0px`; `submenu.top - pills.bottom` não negativo; submenu não invade faixa de frames/pills; sem espaço morto exagerado embaixo.

## Checklist de aceite visual

1. Frame simples: abrir Pausa; submenu não sobe demais.
2. Frame simples: abrir Rotação; submenu não sobe demais.
3. Frame simples: abrir Escala; submenu não sobe demais.
4. Frame simples: abrir Mover/Posição; submenu não sobe demais.
5. Seleção múltipla: abrir Pausa; submenu não sobe demais.
6. Seleção múltipla: abrir Rotação; submenu não sobe demais.
7. Seleção múltipla: abrir Escala; submenu não sobe demais.
8. Seleção múltipla: abrir Mover; submenu não sobe demais.
9. Em todos os casos, não há espaço morto exagerado embaixo.
10. Em todos os casos, submenu não invade `#pillsRow`/faixa de frames.
11. Em seleção múltipla, “Selecionar todos” não empurra Linha 4 / Coluna 2.
12. Linha 4 / Coluna 1 e Coluna 2 permanecem alinhadas.
13. “Selecionar todos” permanece em uma linha, com texto antes do ícone e ícone depois do texto.
14. Snap-to-center continua funcionando.
15. Alpha/spotlight continua funcionando.
16. Preview/export/JSON/curvas/motor não têm alteração.

## Limitações do ambiente

- Não foram executados testes em iPhone/Safari real, screenshot visual, Preview real, MP4/export real, JSON manual nem curvas manuais neste ambiente automatizado.
