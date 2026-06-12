# QA — v8z4b29BY: limpeza visual conservadora da Edição de Tempo

> Base: **v8z4b29BX**. Objetivo: **limpeza visual conservadora** — melhorar
> legibilidade, hierarquia e espaçamento dos controles do painel Edição de
> Tempo (filtros, botões grandes de ação, números de frame/trecho, textos
> auxiliares e resumo), aproveitando os testes manuais do Safari Inspector
> **apenas como referência de intenção**, sem aplicar o CSS bruto. **Sem
> redesign, sem novo design system, sem mudança de fluxo e sem alteração de
> lógica.** O motor, JSON, Preview, export, Stage, timeline e a lógica do
> Tremor permanecem inalterados nesta versão.
>
> **Riscos do teste manual descartados nesta versão:** Style Attribute inline
> do Inspector; `line-height:0` no número de trecho; `border:3px`/`3.5px`;
> `font-size:18px` nas abas; qualquer mexida no `.lower-add-pill`.

---

## 1. O que mudou

### 1.1 tweak(ui): filtros Todos/Frames/Trechos mais legíveis (Escopo 2)

- `.cena1-filter`: texto **11px → 14px** (leitura), fundo **um pouco mais claro
  que o painel** (novo token `--surface-filter: #434346`) e **borda na mesma
  cor do fundo** (discreta), mantendo a espessura já usada na v8z4b29BX
  (**1.5px** — nada de 3px/3.5px).
- O fundo dos filtros fica **abaixo** de `--surface-action` (botões de ação) na
  hierarquia de presença: filtro não vira CTA principal nem aba solta.
- Altura de referência **`--ctrl-lg-h` (40px) preservada**; estado `.active`
  (borda/texto `--accent`) inalterado.

### 1.2 tweak(ui): botões grandes de ação com borda discreta (Escopo 3)

- `.dur-subitem-action` (Zerar pausas, Igualar intervalos): mantém **altura
  `--ctrl-lg-h` (40px)** — nunca acima dos filtros.
- Presença vem do **fundo destacado** (`--surface-action`, mais perceptível que
  o dos filtros); a **borda passa a ser discreta** — variação mínima do fundo
  (`--surface3`, **1.5px**) no lugar de `--border-action`. Borda grossa do
  teste manual **descartada**. `:active` preservado.

### 1.3 tweak(ui): números de frame/trecho e bloco único (Escopo 1)

- Números 11px → **12px**: `.seq-icon-num` (frame, dentro do ícone) e
  `.seq-icon-seg-num` (trecho, acima do ícone) — identificação discreta, sem
  competir com o valor de tempo (`.dur-edit-value`, à direita).
- **Aproximação número ↔ ícone do trecho**: `gap` da coluna
  `.dur-edit-icon-label` **2px → 1px** + `margin-bottom:-4px` em
  `.seq-icon-seg-num`, que entra na **área vazia do topo do SVG** do ícone
  (acima dos círculos). Resultado: número + ícone parecem **um único bloco**.
- **Sem `line-height:0`**, sem sobrepor os círculos das extremidades e **sem
  trocar o desenho** do ícone (continua segmento horizontal com dois círculos).
- Valores de tempo à direita **não se deslocam**.

### 1.4 tweak(ui): textos auxiliares maiores (Escopo 6)

- `.prefs-note` 12px → **13px** com `line-height` 1.5 → **1.35**.
- `#segTimingHint` (dica de Velocidade Constante) 12px → **13px**,
  `line-height` **1.35**.
- Labels/sublabels uppercase 11px → **12px** mantendo uppercase, tracking e cor
  secundária (`--text3`): `.dur-edit-label`, `.dur-subitem-label`,
  `.dur-sublabel`, `.dur-sublabel-value` — **continuam subtítulos** (não viram
  título) e **não deslocam** os valores à direita.

### 1.5 tweak(ui): resumo de duração mais legível (Escopo 8)

- `.dur-summary-row` (linhas secundárias) 12px → **13px**;
  `.dur-summary-row-main` (linha principal) 13px → **14px**.
- **Borda do box mantida discreta** (1px) — sem virar caixa pesada.

### 1.6 preserve(ui): abas, botões pequenos, campos (Escopos 4, 5, 7)

- **Abas** (`.ds-tab`): mantidas em **15px** (já compatível; **sem 18px**),
  estado ativo e altura/toque inalterados.
- **Botões pequenos contextuais** (`#custBarContent .chip`: -5%/+5%/Reset):
  mantêm os tokens dedicados da BX (`--surface-action`/`--border-action`),
  menores e uniformes — sem padronizar com os botões grandes.
- **Campos** (`#newSegmentDurationInput`): mantêm `--surface-field`/
  `--border-field` (aparência de campo editável), distintos de filtro/botão.

### 1.7 verify: Pausa global e alinhamento (Escopos 10 e 11)

- **Pausa global sem travamento**: `_bindLocalFramePauseSliderOnce` continua
  com a correção da BW — com `isCustLocked()` ativo, o `input` escreve direto
  em `framePauses[]` e chama `refreshPauseControls()` **uma vez por evento**;
  cobre "global antes" e "global depois". **Nenhuma mudança de lógica.**
- **Alinhamento slider/valor/Reset/Global**: `#custGlobalLock` permanece à
  direita (`align-self:flex-end`), no eixo do Reset; slider ocupa a largura
  útil. Inalterado.

### 1.8 preserve (Escopo 12)

- Não aplica Style Attribute inline do Inspector, `line-height:0`, `border:3px`/
  `3.5px`, `18px` nas abas, nem mexe no `.lower-add-pill`.
- Tremor (Global/Desligado/Personalizado, Global e por trecho), Movimento
  Inteligente, Velocidade Constante, Stage, timeline, frames/trechos no Stage,
  curvas/Bézier, seleção, Preview, export MP4, JSON (antigo/novo), templates,
  formato, launcher/Novo Projeto, logo, ícone iOS e o motor — **intactos**.

---

## 2. Critérios de aceite

1. ✅ Versão visível mostra **v8z4b29BY** (`APP_VERSION`, `APP_VERSION_NAME`,
   texto visível, comentário do topo, CHANGELOG.md, QA.md).
2. ✅ Filtros Todos/Frames/Trechos com texto mais legível (14px), fundo sutil e
   borda discreta — sem borda pesada, altura padrão (40px) mantida.
3. ✅ Botões grandes (Zerar pausas / Igualar intervalos) parecem botões, **não**
   mais altos que os filtros (40px), **sem** borda grossa.
4. ✅ Número do frame dentro do ícone; número do trecho próximo do ícone;
   trecho parece um bloco único; valores de tempo à direita continuam
   principais; nada desalinhado.
5. ✅ Botões pequenos (-5%/+5%/Reset) menores, padronizados entre si, não
   parecem abas.
6. ✅ Campo "Intervalo padrão" parece campo editável (não botão/filtro).
7. ✅ Textos auxiliares legíveis no iPhone, sem virar título nem ficar
   microscópicos.
8. ✅ Abas em ~15px (sem 18px), boa leitura.
9. ✅ Slider/valor/Reset/Global alinhados, sem encavalamento; slider aproveita a
   largura.
10. ✅ `.lower-add-pill` intacto; sem `line-height:0`, `border:3px`/`3.5px`.
11. ✅ Lógica do Tremor não mudou.
12. ⏳ Pausa global sem travamento, aplicando corretamente (validar no device).
13. ⏳ Preview continua funcionando (validar no device).
14. ⏳ Export MP4 continua funcionando (validar no device).
15. ⏳ JSON antigo/novo abre e salva normalmente (validar no device).
16. ⏳ Sem regressões no iPhone/Safari (validar no device).

---

## 3. Testes manuais sugeridos (iPhone/Safari)

1. Abrir **Edição de Tempo → aba Tempo**: conferir filtros Todos/Frames/Trechos
   com leitura melhor (14px), fundo um pouco mais presente e borda discreta;
   altura igual entre os três.
2. Na lista intercalada: número do frame dentro do ícone e número do trecho
   colado ao ícone (bloco único), círculos do trecho **redondos**; valores de
   tempo à direita continuam sendo a informação principal.
3. Botões **Zerar pausas** / **Igualar intervalos**: cara de botão (fundo +
   borda discreta), mesma altura dos filtros, sem borda grossa.
4. Painel de frame (Pausa/Escala): **-5% / +5% / Reset** menores e uniformes;
   **Reset** e **Global** alinhados à direita, slider ocupando a largura.
5. Campo **Intervalo padrão**: aparência de campo editável.
6. Textos explicativos (Movimento/Tremor/Preferências, dica de Velocidade
   Constante) e labels/sublabels: legíveis, sem virar título.
7. Resumo de duração (Total/Trechos/Pausas/Acabamento): mais legível, borda
   ainda discreta.
8. **Pausa com "Aplicar a todos"**: arrastar o slider não trava; valor aplica a
   todos os frames (global antes e global depois); Preview/export/JSON
   respeitam os valores.
9. **Preview / Export MP4 / salvar e reabrir JSON**: sem regressão.
