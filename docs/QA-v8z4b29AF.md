# QA — v8z4b29AF estabiliza Linha 4 / Coluna 2 em seleção múltipla

## Base confirmada

- Versão de partida: `v8z4b29AE`.
- Registro obrigatório: a `v8z4b29AE` **não foi aprovada visualmente** para este problema — não produziu alteração aparente no deslocamento da Linha 4 / Coluna 2 ao entrar em seleção múltipla.
- Preservada a microcorreção da `v8z4b29AD` em `#alignBarSubmenu` (`bottom:0`, `overflow-y:visible`, altura via `var(--lower-context-panel-h)`).
- Áreas fora de escopo e não alteradas nesta versão: `#alignBarSubmenu`, `#custBar`, `#custBarContent`, Pausa/Rotação/Escala/Mover (submenus), safe-area global, timeline, snap-to-center, Alpha/spotlight, `timelineFocalFrameId`, Preview/export/MP4/JSON/curvas/motor, ícones/textos/cores/layout geral, menu superior.

## Objetivo único

Resolver **apenas** a influência da seleção múltipla — em especial da ação “Selecionar todos” que aparece na Linha 3 / Coluna 2 — sobre o deslocamento visual da Linha 4 / Coluna 2 do menu inferior.

## Investigação obrigatória

### 1. Elemento real da Linha 4 / Coluna 2

- O contêiner estrutural da Linha 4 / Coluna 2 (grade `.mid-bar.timeline-grid`, linha 4 / coluna 2) é `#lowerContextSlot`.
- Em frame simples, o conteúdo visível dentro dele é `#toolbar` (com os itens Pausa, Rotação, Escala, Mover, etc., como `.tb-item`).
- Em seleção múltipla, o conteúdo visível passa a ser `#alignBar` → `#alignBarPrimary` → `#alignBarActions` (com os mesmos rótulos Pausa, Rotação, Escala, Mover, mais Alinhar/Distribuir, como `.ab-tab`).
- Linha 4 / Coluna 1 é `.lower-global-duration` (botão “Tempo”).
- Linha 3 / Coluna 2 é `.lower-active-state`, que contém `.lower-selection-actions` (“Selecionar todos”), absolutamente posicionado e com largura pré-alocada (`--lower-select-all-w:154px`).

### 2–5. Medição com `getBoundingClientRect()` — Estado A vs. Estado B

> Medição feita em ambiente automatizado com Chromium headless (Playwright 1.56), viewport `430×932`, projeto carregado de `samples/arquivo 9por16 2 frames.json` (2 frames + imagem real). Sem browser iPhone/Safari disponível neste ambiente; ver seção “QA manual pendente”.

Snippet de medição usado (idêntico ao sugerido no enunciado):

```js
function rectOf(sel) {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top:r.top, right:r.right, bottom:r.bottom, left:r.left, width:r.width, height:r.height };
}
```

#### Estado A — frame selecionado normalmente, sem seleção múltipla

| Elemento | top | bottom | left | right | width | height |
|---|---:|---:|---:|---:|---:|---:|
| `#lowerContextSlot` (Linha 4 / Col 2) | 882 | 928 | 78 | 430 | 352 | 46 |
| `.lower-global-duration` (Linha 4 / Col 1) | 884 | 926 | 8 | 69 | 61 | 42 |
| ícone `.tb-item .tb-icon` (Pausa/Rotação/Escala/Mover) | 886 | 910 | — | — | 24 | 24 |
| label `.tb-item .tb-lbl` | 913 | 924 | — | — | — | 11 |

#### Estado B — seleção múltipla ativa, “Selecionar todos” visível na Linha 3 / Col 2, sem submenu aberto

| Elemento | top | bottom | left | right | width | height |
|---|---:|---:|---:|---:|---:|---:|
| `#lowerContextSlot` (Linha 4 / Col 2) | 882 | 928 | 78 | 430 | 352 | 46 |
| `.lower-global-duration` (Linha 4 / Col 1) | 884 | 926 | 8 | 69 | 61 | 42 |
| `#alignBar` | 882 | 928 | 83 | 425 | 342 | 46 |
| `.lower-selection-actions` (“Selecionar todos”, Linha 3 / Col 2) | 844 | 880 | 271 | 425 | 154 | 36 |
| ícone `.ab-tab svg` (Pausa/Rotação/Escala/Mover/Alinhar/Distribuir) — **antes da correção** | 890 | 914 | — | — | 24 | 24 |
| label `.ab-tab .ab-lbl` — **antes da correção** | 917 | 928 | — | — | — | 11 |
| ícone `.ab-tab svg` — **depois da correção** | 886 | 910 | — | — | 24 | 24 |
| label `.ab-tab .ab-lbl` — **depois da correção** | 913 | 924 | — | — | — | 11 |

### 6. Qual propriedade mudava e onde

- `#lowerContextSlot` (o contêiner real da Linha 4 / Coluna 2): **nenhuma propriedade muda** — `top/bottom/left/right/width/height` são idênticos entre Estado A e Estado B (diff = 0 em todas).
- O que mudava de fato era o **conteúdo visível** dentro da célula: o ícone/label de `#alignBar` apareciam **~4px mais abaixo** do que os de `#toolbar` (compare `top:886→890` no ícone e `top:913→917`/`bottom:924→928` no label).
- Propriedade responsável: **`align-items`** (em `#alignBarPrimary.ab-primary-strip` e `#alignBarActions`, valor `flex-end`) e **`justify-content`** (em `.ab-tab`, valor `flex-end`), herdadas do layout antigo de `#alignBar` como barra flutuante (`position:fixed`, ancorada no rodapé da tela). Dentro da grade `.mid-bar.timeline-grid`, `#toolbar .tb-item` usa `justify-content:center` e o contêiner usa `align-items:stretch`, centralizando o conteúdo verticalmente — enquanto `#alignBar` mantinha o alinhamento "encostado embaixo" do contexto flutuante antigo, produzindo ~4px de diferença vertical perceptível ao alternar de `#toolbar` para `#alignBar`.
- Não havia mudança de `top`/`bottom`/`height`/`transform`/`padding`/`margin`/`display`/`grid-row`/`position`/`flex`/`gap` em `#lowerContextSlot`, `#toolbar`, `#alignBar` ou `#alignBarPrimary` atribuível à seleção múltipla.

### Origem da mudança

- **Não** vinha de `body.has-multi-selection` empurrando `#lowerContextSlot` (a célula da grade permanece fixa: `grid-template-rows` usa comprimentos fixos `21px 56px 36px 46px`, e nenhuma regra altera `grid-row`/`grid-column`/altura/posição de `#lowerContextSlot` fora do contexto `cust-expanded`, que é outro fluxo).
- **Não** vinha de `.lower-selection-actions`/`.lower-selection-action` empurrando algo: o elemento é `position:absolute` dentro de `.lower-active-state`, com largura pré-alocada por `--lower-select-all-w` mesmo quando oculto (`visibility:hidden`/`visible`), e a Linha 3 (`.lower-active-state`, `max-height:var(--lower-row-3)`) não participa do fluxo da Linha 4 — a grade tem 4 linhas explícitas e `row-gap` fixo.
- **Não** vinha de `.lower-active-state`/`#alignBar`/`#alignBarPrimary`/`#lowerContextSlot` mudando `display`, `position` ou tamanho.
- **Vinha** de `#alignBarPrimary.ab-primary-strip` e `#alignBarActions` usarem `align-items:flex-end`, e `.ab-tab` usar `justify-content:flex-end` — uma regra CSS pré-existente (do tempo em que `#alignBar` era uma barra flutuante e fixa no rodapé) que continuava em vigor mesmo dentro da grade `.mid-bar.timeline-grid`, sem ser sobrescrita para alinhar com o comportamento centralizado de `#toolbar .tb-item`.

## Regra correta confirmada após a correção

A Linha 4 / Coluna 2 (`#lowerContextSlot`) mantém o **mesmo retângulo** em ambos os estados — `top`, `bottom`, `height`, `left`, `right`, `width` idênticos (diff = 0px, dentro da tolerância de 0–1px de arredondamento). Adicionalmente, o **conteúdo visível** (ícones/labels de Pausa, Rotação, Escala, Mover) também passa a ocupar exatamente a mesma posição vertical em `#toolbar` (frame simples) e em `#alignBar` (seleção múltipla): ícone `top:886 bottom:910`, label `top:913 bottom:924` em ambos os casos.

## Correção aplicada

- Escopo estritamente restrito a `.mid-bar.timeline-grid` (não altera o `#alignBar` em outros contextos, caso existam, nem `#alignBarSubmenu`):
  - `.mid-bar.timeline-grid #alignBarPrimary.ab-primary-strip` ganha `align-items:stretch` (era implicitamente `flex-end`, herdado da regra base `#alignBarPrimary.ab-primary-strip{align-items:flex-end}`).
  - `.mid-bar.timeline-grid #alignBarActions` ganha `align-items:stretch` (era implicitamente `flex-end`, herdado da regra base `#alignBarActions{align-items:flex-end}`).
  - `.mid-bar.timeline-grid #alignBarActions .ab-tab` ganha `justify-content:center` (era implicitamente `flex-end`, herdado da regra base `#alignBar .ab-tab{justify-content:flex-end}`).
- Resultado: `#alignBarActions .ab-tab` passa a se comportar exatamente como `#toolbar .tb-item` (que já usa `justify-content:center` dentro de um contêiner com `align-items:stretch`), centralizando ícone + label verticalmente dentro da célula de 46px da Linha 4, igual ao `#toolbar`.
- “Selecionar todos” continua exclusivamente na Linha 3 / Coluna 2, em área pré-alocada (`--lower-select-all-w`), `position:absolute`, sem participar do fluxo vertical da Linha 4, sem alterar altura/padding/gap/margin/`grid-row` de `#lowerContextSlot`/`#alignBar`/`#toolbar`.
- Nenhuma alteração foi feita em `#alignBarSubmenu`, `#custBar`, `#custBarContent`, Pausa/Rotação/Escala/Mover, safe-area global, timeline, snap-to-center, Alpha/spotlight, `timelineFocalFrameId`, Preview/export/MP4/JSON/curvas/motor, menu superior, ícones, textos, cores ou layout geral.

## Ciclo de regressão (3x), sem acúmulo de estado

Repetido 3 vezes (Estado A → Estado B → Estado A), usando `toggleFrameSelection` para entrar/sair da seleção múltipla:

| Ciclo | `#lowerContextSlot` igual em A e B? | `.lower-global-duration` (Col 1) igual em A e B? | ícones Col 2 (`top`/`bottom`) iguais entre `#toolbar` e `#alignBar`? | retorno ao Estado A idêntico ao inicial? |
|---|---|---|---|---|
| 1 | sim (diff 0px em todas as propriedades) | sim | sim (`top:886 bottom:910` em ambos) | sim |
| 2 | sim | sim | sim | sim |
| 3 | sim | sim | sim | sim |

Nenhum acúmulo de deslocamento foi observado entre ciclos.

## Smoke test de não regressão (fora do escopo, apenas para confirmar que nada quebrou)

- Abertura do submenu “Pausa” (`#alignBarSubmenu`) em seleção múltipla: `display:flex`, ancorado em `bottom:0`, altura igual a `var(--lower-context-panel-h)` (`top:844 bottom:928 height:84`), preservando integralmente a correção da `v8z4b29AD`/`v8z4b29AE`.

## Checklist de aceite visual

1. Selecionar um frame normal; registrar visualmente a posição da Linha 4 / Coluna 2 (`#toolbar`: Pausa, Rotação, Escala, Mover).
2. Entrar em seleção múltipla (toque longo em uma pill ou seleção de 2+ frames).
3. Confirmar que “Selecionar todos” aparece na Linha 3 / Coluna 2, em uma linha, com texto antes do ícone.
4. Confirmar que a Linha 4 / Coluna 2 (agora `#alignBar`: Pausa, Rotação, Escala, Mover, Alinhar, Distribuir) **não muda de posição** em relação ao Estado A.
5. Confirmar que a Linha 4 / Coluna 1 (“Tempo”) permanece estável e alinhada horizontalmente com os ícones da Linha 4 / Coluna 2.
6. Sair da seleção múltipla; confirmar que a Linha 4 / Coluna 2 retorna exatamente à mesma posição do passo 1.
7. Repetir os passos 2–6 mais duas vezes (total de 3 ciclos); confirmar ausência de acúmulo de deslocamento.
8. Confirmar que `#alignBarSubmenu`, `#custBar`, `#custBarContent`, Pausa, Rotação, Escala, Mover (submenus), snap-to-center, Alpha/spotlight, Preview/export/JSON/curvas/motor permanecem sem alteração.

## Limitações do ambiente

- Não foi possível executar testes em iPhone/Safari real, screenshot visual em dispositivo físico, Preview real, MP4/export real, JSON manual nem curvas manuais neste ambiente automatizado.
- Medições e capturas de tela foram feitas via Chromium headless (Playwright), com projeto de exemplo carregado a partir de `samples/arquivo 9por16 2 frames.json`, em viewport `430×932`. Os valores em pixels podem variar ligeiramente em dispositivos reais por causa de `devicePixelRatio`, `env(safe-area-inset-bottom)` e fontes do sistema, mas o critério de igualdade entre Estado A e Estado B (diff ≈ 0px) deve se manter.
