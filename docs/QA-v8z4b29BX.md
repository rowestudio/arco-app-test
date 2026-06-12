# QA — v8z4b29BX: auditoria visual + padronização de componentes (Edição de Tempo)

> Base: **v8z4b29BW**. Objetivo: **auditoria visual + padronização de
> componentes** — lista de frames/trechos, agrupamento número + ícone de
> trecho, ícone do filtro "Trechos", famílias de botões (grandes de ação /
> pequenos contextuais), campos, filtros, textos explicativos e alinhamento
> dos painéis contextuais. **Sem redesign, sem mudança de fluxo e sem
> alteração de lógica.** O motor, JSON, Preview, export, Stage, timeline e a
> lógica do Tremor permanecem inalterados nesta versão.

---

## 1. O que mudou

### 1.1 fix(ui): lista de frames/trechos padronizada (Tarefa 1)

Frames e trechos passam a pertencer ao mesmo sistema visual na coluna
esquerda da listagem (`#cena1Seq`):

- **Cor dos números**: número de frame (`.seq-icon-num`) e número de trecho
  (`.seq-icon-seg-num`) compartilham corpo (11px), peso (700) e cor
  (`--text2`) — identificação discreta, nunca competindo com o valor de tempo
  (`.dur-edit-value`, `--accent`, à direita).
- **Cor dos ícones**: ícone de frame (`.seq-icon-frame`) e de trecho
  (`.seq-icon-segment`) compartilham a mesma cor base (`--text3`).
- **Espessura**: ambos os símbolos usam `stroke-width:1.5`; com a correção do
  `viewBox` do trecho (ver 1.2), o traço aparente do trecho passa a ter
  espessura equivalente à do frame.
- **Largura visual**: a coluna de identificação (`.dur-edit-icon-label`) tem
  largura única (56px) para frame e trecho — mesma coluna visual, sem
  indentação arbitrária.
- **Hierarquia preservada**: valor de tempo (direita) = informação principal;
  slider = controle principal; ícone/número = identificação.

### 1.2 fix(ui): número + ícone de trecho como um único componente (Tarefa 2)

- O par "número acima / ícone abaixo" é uma pilha central única
  (`.dur-edit-icon-label`: `flex-direction:column; align-items:center;
  gap:2px; line-height:1`), sem margens herdadas — percebido como um símbolo
  composto, sem sobrepor.
- **Distorção corrigida**: o símbolo `#i-seq-segment` deixa de esticar um
  `viewBox` 24×24 numa caixa larga (que achatava os círculos em elipses) e
  passa a `viewBox="0 0 32 16"` (mesma razão da caixa de render), mantendo os
  **círculos das extremidades redondos**. `.seq-icon-segment` 62×34px →
  **56×28px** (razão 2.0). O ícone continua sendo segmento horizontal com
  dois círculos nas extremidades — símbolo inalterado.

### 1.3 tweak(ui): ícone de trecho no filtro "Trechos" (Tarefa 3)

- `.cena1-filter .seq-icon-segment` 28×18px (distorcido) → **34×17px** (sem
  distorção, razão 2.0): perceptivelmente maior e reconhecível como o mesmo
  símbolo da lista, na mesma família visual do ícone de "Frames"
  (20×20px, inalterado). Altura do botão preservada.

### 1.4 tweak(ui): altura máxima oficial dos botões grandes (Tarefas 4 e 5)

- Nova variável `--ctrl-lg-h: 40px`, tendo a linha **Todos/Frames/Trechos**
  (`.cena1-filter`) como referência. Nenhum botão grande ultrapassa essa
  altura:
  - `.dur-subitem-action` (Igualar intervalos, Zerar pausas): 48px → **40px**.
  - `.finish-chip` (Nenhum/Loop/Pausa final): 46px → **40px**.
- Botões grandes de **ação** parecem botões (não abas): borda mais perceptível
  (1px → **1.5px**), fundo destacado (`--surface-action`), texto branco/forte
  centralizado e feedback de toque (`:active` escurece + realça borda).

### 1.5 tweak(ui): famílias visuais diferenciadas (Tarefas 6, 7 e 8)

- **Botões pequenos contextuais** (`#custBarContent .chip`: -5%, +5%, Reset):
  família própria, menor (`--ctrl-sm-h: 30px`), com fundo (`--surface-action`)
  e borda (`--border-action`) próprios — clicáveis, uniformes, não parecem
  tag/rótulo. Estado `.active` (se houver) preservado por override dedicado.
- **Campos** (`#newSegmentDurationInput` — Intervalo padrão): tokens
  dedicados `--surface-field`/`--border-field` (borda mais clara), aparência
  de campo editável (texto à direita), distinta de botão de ação. Lógica de
  input inalterada.
- **Abas/filtros/modos** (`.ds-tab`, `.cena1-filter`, `.finish-chip`):
  continuam em `--surface2`/`--border2` (fundo neutro do painel + borda fina;
  ativo = `--accent`), visualmente distintos dos botões de ação e dos campos.

### 1.6 tweak(ui): textos explicativos maiores (Tarefa 9)

- `.prefs-note` 10px → **12px** com `line-height` 1.45 → **1.5** (aplica-se a
  todas as notas que usam a classe — Movimento, Tremor, Preferências, etc.).
- Dica de Velocidade Constante (`#segTimingHint`) 10px → **12px** com
  `line-height:1.5`.
- Mantida a hierarquia (menor que título, mais legível que rodapé) e o
  contraste (`--text3`).

### 1.7 fix(ui): Reset + Global alinhados (Tarefa 10)

- O globo "Aplicar a todos" (`#custGlobalLock`) deixa de ficar
  centralizado/solto (`align-self:center`) e passa a alinhar à direita
  (`align-self:flex-end`), formando um bloco de ações à direita no mesmo eixo
  do Reset. Slider continua ocupando a largura útil. Lógica
  (`toggleCustGlobalLock`/`isCustLocked`) inalterada.

### 1.8 verify: itens herdados da v8z4b29BW (Tarefas 13 e 14)

- **Pausa global sem travamento** (Tarefa 13): a correção da BW continua em
  `_bindLocalFramePauseSliderOnce` — com `isCustLocked()` ativo, o `input`
  escreve direto em `framePauses[]` e chama `refreshPauseControls()` uma única
  vez por evento; cobre "global antes" e "global depois". Nenhuma mudança
  nesta versão.
- **"Novo Projeto" no menu superior aberto** (Tarefa 14): `fitMenuNewProjectLabel()`
  troca para "Novo" (`#menuNewProjectLabel`, `white-space:nowrap`) quando não
  cabe em uma linha. Nenhuma mudança nesta versão.

### 1.9 preserve (Tarefas 11, 12, 15 e 16)

- Espaçamento entre grupos (Tarefa 11) e ordem "texto antes do controle"
  (Tarefa 12) já vigentes na BW — sem regressão.
- **Tremor não alterado** (Tarefa 15): Global/Desligado/Personalizado, Tremor
  Global e por trecho, intensidade, frequência, herança, salvamento,
  Preview/export — intactos.
- Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção,
  Preview, export MP4, JSON (antigo/novo), templates, formato, launcher,
  logo, ícone iOS e o motor de renderização — intactos (Tarefa 16).

---

## 2. Critérios de aceite

1. ✅ Versão visível mostra **v8z4b29BX** (`APP_VERSION`, `APP_VERSION_NAME`,
   texto visível, comentário do topo, CHANGELOG.md, QA.md).
2. ✅ Números de frame/trecho na lista usam a mesma cor base (`--text2`).
3. ✅ Ícones de frame/trecho usam a mesma espessura visual (traço equivalente).
4. ✅ Ícones de frame/trecho com largura visual coerente (coluna 56px).
5. ✅ Número + ícone de trecho próximos e percebidos como um único item.
6. ✅ Ícone do filtro "Trechos" maior e reconhecível (34×17px, sem distorção).
7. ✅ Botões grandes não ultrapassam a altura de Todos/Frames/Trechos (40px).
8. ✅ Botões grandes de ação com altura padronizada (40px).
9. ✅ Botões grandes de ação parecem botões (borda 1.5px, fundo, `:active`).
10. ✅ Botões pequenos contextuais com padrão próprio menor (30px).
11. ✅ Botões pequenos contextuais com borda/fundo mais perceptíveis.
12. ✅ Campos parecem campos (tokens de campo), não abas nem botões.
13. ✅ Botões, campos e filtros com linguagens visuais distintas.
14. ✅ Textos explicativos maiores e mais legíveis (12px / line-height 1.5).
15. ✅ Reset e Global alinhados no painel contextual (bloco à direita).
16. ✅ Slider usa a largura útil; valor/Reset/Global no mesmo eixo à direita.
17. ✅ Espaçamento interno dos grupos compacto (inalterado da BW).
18. ✅ Espaçamento entre grupos suficiente (inalterado da BW).
19. ✅ Texto antes de toggle/global/aplicar a todos (inalterado da BW).
20. ✅ Slider de Pausa não trava com global ativo (verificado, BW).
21. ✅ "Novo Projeto" não quebra em duas linhas no menu superior aberto.
22. ✅ Se não couber, aparece "Novo".
23. ✅ Lógica do Tremor não mudou.
24. ⏳ Preview continua funcionando (validar no device).
25. ⏳ Export MP4 continua funcionando (validar no device).
26. ⏳ JSON antigo continua abrindo (validar no device).
27. ⏳ JSON novo salva e reabre normalmente (validar no device).
28. ⏳ Sem regressões no iPhone/Safari (validar no device).

---

## 3. Testes manuais sugeridos (iPhone/Safari)

1. Abrir **Edição de Tempo → aba Tempo**: conferir que, na lista intercalada,
   números e ícones de frame e trecho têm a mesma cor/peso e largura; os
   círculos do ícone de trecho estão **redondos** (não achatados).
2. Conferir que **número + ícone de trecho** formam um bloco único (quase
   encostados, alinhados ao centro), sem sobrepor.
3. Filtro **Trechos**: o ícone está maior e reconhecível; a altura do botão é
   igual a Todos/Frames.
4. Botões **Igualar intervalos** / **Zerar pausas** e **Nenhum/Loop/Pausa
   final**: mesma altura de Todos/Frames/Trechos (40px), com cara de botão
   (fundo/borda) e feedback ao toque nos de ação.
5. Painel de frame (Pausa/Escala): **-5% / +5% / Reset** menores, com
   borda/fundo visíveis; **Reset** e **Global** alinhados à direita.
6. Campo **Intervalo padrão**: parece campo editável (não botão).
7. Textos explicativos (Movimento/Tremor/Preferências, dica de Velocidade
   Constante): maiores e legíveis.
8. **Pausa com "Aplicar a todos"**: arrastar o slider não trava; valor aplica
   a todos os frames (global antes e global depois).
9. **Preview / Export MP4 / salvar e reabrir JSON**: sem regressão.
