# Auditoria DOM/CSS — área inferior (lower area)

**Contexto:** a versão v8z4b29AC foi aplicada e não produziu mudança visível no bug
relatado da área inferior. Antes de criar v8z4b29AD, foi feita uma auditoria ao
vivo do DOM e do CSS ativo (sem nenhuma correção visual) usando Playwright
(Chromium headless, viewport 414×896) sobre `index.html`, carregando o projeto de
amostra `templo-cliff-epico-v8q-com-imagem-10f.json` e acionando diretamente as
funções internas (`applyProjectData`, `toggleFrameSelection`, `openAlignSubmenu`)
para alcançar os 3 estados pedidos, com `getBoundingClientRect()` /
`getComputedStyle()` em cada um.

## Tabela de medições reais

| Estado | bodyClass | Elemento visível | rect (top/bottom/h/w) | position |
|---|---|---|---|---|
| 1. Normal | `bottom-context-frame` | `#toolbar` | 846 / 892 / 46 / 326 | static |
| 2. Multi-seleção | `+ has-multi-selection` | `#alignBar` | 846 / 892 / 46 / 326 | static |
| 3. Multi-sel + submenu Rotação | `+ align-submenu-open` | **`#alignBarSubmenu`** | **806 / 886 / 80 / 409** | **absolute** |

`#lowerContextSlot` (`.lower-cell.lower-main`) = **{top:846, bottom:892, left:78,
width:336, height:46}** — idêntico, byte a byte, nos 3 estados. Nunca muda de
retângulo.

## 1) Qual elemento muda de retângulo?

Nenhum dos 4 elementos da lista original (`#lowerContextSlot`, `#toolbar`,
`#alignBar`, `#custBar`) muda de geometria de fato:

- `#lowerContextSlot` é a célula do grid (`.lower-cell.lower-main`) e fica fixa
  em `top:846 / bottom:892 / height:46px` nos 3 estados — é o "slot" que hospeda
  tudo, mas o slot em si não se move.
- `#toolbar` ↔ `#alignBar` apenas trocam `display` (`flex`↔`none` /
  `none`↔`block`), ocupando exatamente o mesmo retângulo do slot (846–892, h:46).
  É um simples *swap* de visibilidade, sem mudança de caixa.
- `#custBar` permanece `display:none` o tempo todo nesse fluxo (ver item 2).

**O elemento que de fato muda de retângulo é um quinto elemento, fora da lista
original: `#alignBarSubmenu`.** Ele não existe (rect 0×0, `display:none`) nos
estados 1 e 2, e "nasce" no estado 3 como uma caixa `position:absolute` de
**80px de altura, indo de `top:806` até `bottom:886`** — ultrapassando os limites
do slot (846–892) tanto por cima (40px) quanto ficando 6px aquém por baixo.

## 2) Qual elemento é o submenu real?

**`#alignBarSubmenu`**, e não `#custBar`.

- `#custBar` permanece `display:none` nas 3 capturas — pertence a um fluxo
  totalmente separado (frame único: `openCustBarTabFromBottom` → `openCustBar` →
  `switchCustTab`, classes `cust-open`/`cust-expanded`) que **nunca** é acionado
  em multi-seleção.
- O painel de Rotação que aparece na tela é `#alignBarSubmenu`, filho de
  `#alignBar`, controlado por `openAlignSubmenu('rotation')`.

**Achado relevante para scripts de debug futuros**: `#alignBarSubmenu` **não tem
atributo `class`** (`getAttribute('class')` → `null`, `className` → `""`). Por
isso ele não é capturado por seletores como `[class*="align"]`,
`[class*="lower"]`, `.align-bar`, `#alignBar` etc. — um script de inspeção que
dependa apenas dessas classes roda sem erro, mas pula silenciosamente o elemento
que é, na prática, o submenu real renderizado na tela. Recomenda-se incluir
`#alignBarSubmenu` e `#alignBarPrimary` (por ID) em qualquer lista de seletores
de auditoria desta região.

## 3) Qual CSS ativo está vencendo?

A regra que define a caixa do `#alignBarSubmenu` em multi-seleção + submenu é,
em `index.html` linha 1257:

```css
.mid-bar.timeline-grid #alignBar.align-submenu-open #alignBarSubmenu{
  position:absolute;
  left:calc(-1 * (var(--lower-left-w) + 5px));
  right:0;
  bottom:var(--lower-home-breath);                                            /* 6px  */
  height:calc(var(--lower-row-3) + var(--lower-row-4) + 4px - var(--lower-home-breath)) !important; /* 36+46+4-6 = 80px */
  ...
}
```

Computado no navegador confirma exatamente isso: `position:absolute; bottom:6px;
height:80px` ⇒ `top` resultante = `-40px` em relação a `#alignBar` (que vira
`position:relative` ao ganhar a classe `align-submenu-open`). Como `#alignBar`
está em `top:846`, o submenu acaba ocupando **806→886px** na tela — 40px acima do
que seria o slot de 46px, encostando exatamente no limite inferior de
`#pillsRow` (`.mid-pills`, que termina em `bottom:806`).

Não há regra concorrente/duplicada disputando essa especificidade — `.toolbar`,
`.cust-bar`, `.align-bar`, `.lower-context-slot` (variantes "soltas" via classe)
**não existem em lugar nenhum do DOM renderizado**; são apenas convenções de
nomenclatura que não geram elementos duplicados nem CSS conflitante por
cascata/`!important`.

## 4) Que código JS altera a posição/exibição?

Dois fluxos **independentes** manipulam essa região, e só um age no cenário
relatado:

- **`openAlignSubmenu(group)` / `closeAlignSubmenu()`** (≈ linha 22039): alterna
  a classe `align-submenu-open` no `body`/`#alignBar` e o `display` de
  `#alignBarPrimary` ↔ `#alignBarSubmenu`. **Este é o caminho realmente usado**
  ao selecionar vários frames e abrir Rotação/Pausa/Escala/Mover.
- **`openCustBar()` / `closeCustBar()` / `switchCustTab()` /
  `collapseCustBar()`** (≈ linha 22311): alteram `cust-open`/`cust-expanded` em
  `#custBar`. Esse caminho só é disparado por `openCustBarTabFromBottom()`
  (linha 11110), que por sua vez só existe nos botões `ctx-only ctx-frame` do
  `#toolbar` — ou seja, **só roda no modo de frame único**, nunca em
  multi-seleção. Em nenhuma das 3 capturas o `body` chega a ganhar
  `cust-open`/`cust-expanded`.

Não há nenhum outro listener, observer ou rotina de layout (`ResizeObserver`,
`requestAnimationFrame`, manipulação inline de `style.*`) tocando
`#alignBarSubmenu`, `#alignBar`, `#toolbar` ou `#lowerContextSlot` nesses 3
estados — toda a geometria observada é 100% explicada pelas regras CSS acima
combinadas com o *toggle* de classes.

## 5) Por que a correção da v8z4b29AC não teve efeito visível?

A v8z4b29AC mexeu em duas frentes, e nenhuma delas resolve o problema visível:

**a) Mudou a âncora do `#alignBarSubmenu`:**
`bottom: var(--lower-home-breath)` (6px) → `bottom:0`, e
`height: ...+4px-var(--lower-home-breath)` (80px) → `...+2px` (84px).

Resultado líquido:

| Borda | Antes | Depois | Δ |
|---|---|---|---|
| inferior | 886 | 892 | **+6px** (fecha o "espaço morto", mas essa borda fica colada ao indicador home, sem conteúdo visível ali → imperceptível) |
| superior | 806 | 808 | **+2px** (overlap com `#pillsRow` praticamente não muda) |

Ou seja: a parte que de fato é visível ao usuário — o slider de rotação
encavalando os números dos frames "1"/"2" na régua de miniaturas — se deslocou
apenas **2 pixels**, abaixo do limiar de percepção em uma tela de 414px.

**b) Mexeu em `body.cust-expanded #lowerContextSlot` / `#custBar`** — regras que
**nunca se aplicam neste cenário**, porque (i) `cust-expanded` jamais é
adicionado ao `body` durante multi-seleção (pertence ao fluxo de frame único
`openCustBar`), e (ii) `#custBar` permanece `display:none` o tempo todo aqui.
Essas edições são, na prática, código morto para o bug relatado.

**Em suma:** a v8z4b29AC ajustou a âncora certa por uma margem pequena demais
(2–6px) e, paralelamente, editou um componente (`#custBar`/`cust-expanded`) que
sequer participa da cena de multi-seleção + submenu — daí o "nenhuma mudança
visível".

## Evidência visual

Screenshots com contornos coloridos sobre os elementos reais (capturados em
`/tmp/pwtest/outlined-rotation*.png`, fora do repositório):

- **magenta** = `#alignBarSubmenu` (top:806 → bottom:886)
- **amarelo** = `#pillsRow` (top:750 → bottom:806)
- **laranja** = `#lowerActiveLabel` / pill ativo "1"

A imagem mostra a borda superior do submenu encostando exatamente no limite
inferior da régua de pills, e o *thumb* do slider de rotação sobrepondo
visualmente o círculo numerado "1" — esse é o defeito real percebido pelo
usuário, e ocorre ~40px acima do "slot" de 46px que a máquina de estados de
classes do `body` reserva.

## Conclusão / ponto de alavanca para a próxima correção

O ponto de alavanca real é a regra da **linha 1257** — especificamente a
combinação `bottom:6px` (ou `0`, pós-AC) + `height:80px !important` (ou `84px`,
pós-AC), que faz o submenu "crescer para cima" ~40px além do slot e empurrar o
conteúdo para dentro da régua de pills. Qualquer correção precisa atuar sobre
**altura/ancoragem (`top`/`bottom`/`height`) do `#alignBarSubmenu`**, não sobre
`#custBar` / `cust-expanded` / `#lowerContextSlot`, que são geometricamente
estáveis e não fazem parte deste fluxo.

---

**Esta auditoria não fez nenhuma alteração visual, não criou v8z4b29AD e não
tocou em snap, Alpha, Preview/Export, JSON, curvas, motor ou ícone Formato** —
apenas inspecionou o DOM/CSS ao vivo via Playwright, conforme solicitado.
