# QA — v8z4b29S

## Versionamento

- [x] Base inicial limpa confirmada como `v8z4b29R` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Versão final esperada: `v8z4b29S`.
- [x] `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29S`.

## Escopo implementado

- [x] `timelineFocalFrameId`/frame central da timeline controla o alfa/spotlight do Stage durante scroll manual.
- [x] `activeIdx`/seleção simples controla edição e destaque laranja no Stage e no painel de frames, podendo coexistir com foco em outro frame.
- [x] Scroll horizontal da timeline agenda snap-to-center ao fim do gesto/debounce e recentraliza o frame mais próximo.
- [x] Centralização programática continua bloqueando foco em frames intermediários.
- [x] Menu “Formato” usa `#i-proportions` como definição única do Lucide `proportions`.
- [x] Submenus de Pausa, Rotação, Escala e Mover ficam em camada sólida `#3c3c3b`, cobrindo Linhas 3/4 sem vazamento da contagem de frames.
- [x] “Selecionar todos” mantém texto antes do ícone e reduz altura/padding para não empurrar Linha 4.
- [x] Área inferior mantém Linha 3/Linha 4 estáveis entre seleção simples, seleção múltipla e submenus.

## QA obrigatório em iPhone/Safari

- [ ] A. Confirmar `v8z4b29S` em APP_VERSION, APP_VERSION_NAME, texto visível de Configurações e comentário/changelog do topo.
- [ ] B. Selecionar Frame 2, rolar timeline até Frame 1 centralizar e confirmar Frame 2 laranja + Frame 1 com alfa/spotlight.
- [ ] C. Confirmar coexistência: selecionado diferente do central sem anulação dos estados.
- [ ] D. Soltar timeline entre frames e confirmar snap para o mais próximo com alfa no frame central.
- [ ] E. Abrir menu principal e confirmar “Formato” com Lucide `proportions`, sem grid/layout/crop/aspect genérico.
- [ ] F. Abrir Rotação, Escala, Pausa e Mover; confirmar slider, -5/+5, valor e Reset inteiros, sem “16 frames” vazando e sem Linha 4 descer.
- [ ] G. Entrar em seleção múltipla, usar “Selecionar todos” e confirmar todos selecionados sem deslocar Linha 4.
- [ ] H. Regressão manual: seleção simples/múltipla, scroll da timeline, seleção no Stage, curvas, Preview, MP4/export, JSON e Undo/Redo.

## Observação

- [ ] Teste manual em iPhone/Safari ainda precisa ser executado em dispositivo real.
