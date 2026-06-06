# QA — v8z4b29L

## Escopo

- Refinar visual/UX/layout da área inferior da v8z4b29K.
- Corrigir padding inferior, proporção da timeline, centralização suave e hierarquia da Linha 3.
- Preservar motor de Preview, MP4/export, JSON schema, Undo/Redo e cálculos de tempo, curvas, movimento, interpolação, escala e rotação.

## Checklist estático

- [x] Base `v8z4b29K` confirmada antes das alterações.
- [x] Versionamento atualizado para `v8z4b29L` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentários/changelog do topo.
- [x] Área inferior continua em 2 colunas e 4 linhas, sem scroll vertical interno e sem empurrar o Stage.
- [x] Safe area inferior da grade foi reduzida para não duplicar `env(safe-area-inset-bottom)` e preservar apenas folga mínima útil.
- [x] Altura recuperada foi redistribuída em `row-gap`/linhas, sem aumentar a altura base do painel.
- [x] Submenus de Linha 4 continuam no `#lowerContextSlot`, sem novo bloco vertical e sem esconder a Coluna 1 ou o botão `Tempo`.
- [x] Coluna 1 mantém tempo total, botão `+ frame`, total de frames e botão global `Tempo`, com o `+` circular em `var(--accent)`.
- [x] Frames da timeline foram estreitados, mantendo altura, cantos arredondados, número legível e borda espessa.
- [x] Trechos foram estreitados e conectados visualmente aos frames por linha/pontos, sem virar botões soltos.
- [x] Faixa de tempos usa as mesmas larguras da faixa de frames/trechos para manter sincronia visual.
- [x] Centralização de frame selecionado usa rolagem suave nas duas faixas e continua bloqueada durante seleção múltipla.
- [x] Linha 3 usa tom cinza/secundário, sem `Frame ativo` e sem subtítulo redundante.

## Checklist manual obrigatório

- [ ] iPhone/Safari: confirmar que o espaço entre a quarta linha e a Home Bar diminuiu claramente e não sobra faixa escura exagerada.
- [ ] iPhone/Safari: abrir Rotação, Escala, Pausa, Mover e Movimento de trecho e confirmar que nenhum submenu empurra Linhas 1–3, Coluna 1 ou botão `Tempo`.
- [ ] iPhone/Safari: validar que tempo total, botão `+`, total de frames e `Tempo` respiram e continuam visíveis.
- [ ] iPhone/Safari: com 2 frames, tocar F1/F2 e confirmar centralização suave, sem pulo, com tempos acompanhando a timeline.
- [ ] iPhone/Safari: validar frames menos largos, trechos conectados e Linha 3 mais discreta.
- [ ] Regressão: Preview, MP4/export, JSON salvar/abrir, Undo/Redo, seleção simples/múltipla, upload, salvar, abrir e reset.

## Limitações do ambiente

- Não houve validação em iPhone/Safari real neste ambiente automatizado.
- Não houve geração real de MP4 neste ambiente automatizado.
