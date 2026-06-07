# QA — v8z4b29N

## Escopo

Correção de UX/layout/visual/estado da área inferior, timeline de frames/trechos, seleção múltipla e destaque visual no Stage, sem alterações no motor de animação, Preview, MP4/export, JSON schema ou gestos de edição temporal.

## Checklist estático executado

- [x] Base aberta confirmada como `v8z4b29m` antes das alterações.
- [x] Versionamento atualizado para `v8z4b29N` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Área inferior usa fundo base `#3c3c3b` e textos/bordas/trechos secundários em `#b2b2b2`.
- [x] Botões com ícone + texto na base inferior usam ícone branco e label cinza.
- [x] Frames da timeline ficam visualmente mais estreitos, com altura preservada, fundo `#3c3c3b` e borda `#b2b2b2`.
- [x] Trechos permanecem conectados, com linha/círculos em `#b2b2b2`, círculos maiores e sem caixa azul no trecho selecionado.
- [x] Pontos laranja centrais ficam fora da área útil dos blocos de frame.
- [x] Apenas o tempo total mantém `s`; tempos parciais ficam menores, sem bold forte e sem `s`.
- [x] Linha 3 ganha respiro; `Selecionar todos` fica sem pill/fundo e com ícone maior que o texto.
- [x] Texto de seleção múltipla lista apenas frames entre parênteses, sem “selecionado(s)”.
- [x] `Selecionar todos` isola o evento e mantém `selectedFrames`/seleção múltipla ativos.
- [x] Menu de trechos usa o mesmo ritmo visual dos botões contextuais de frames na Linha 4.
- [x] Curvas do Stage ficam acima do overlay escuro.
- [x] Frame central da timeline destaca visualmente no Stage junto dos trechos adjacentes, sem disputar com seleção múltipla.

## Pendente em dispositivo real

- [ ] Validar em iPhone/Safari real: scroll horizontal, toque/long press, seleção simples, seleção de trecho, seleção múltipla e botão `Selecionar todos`.
- [ ] Validar que Preview, MP4/export, JSON salva/abre e Undo/Redo seguem funcionando sem regressão.
