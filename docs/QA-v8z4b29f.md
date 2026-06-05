# QA — v8z4b29f

## Escopo

Correções visuais rigorosas da linha v29 para Menu/Arquivos, frame assistido, botões assistidos, topbar, atualização visual de zoom/pan e leitura de caminhos/trechos, sem alterar motor de Preview, MP4/exportação, cálculos reais de frames/curvas/paths ou schema JSON.

## Base confirmada

- Base inicial confirmada como `v8z4b29e` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- Versão final esperada: `v8z4b29f`.

## Checklist estático executado

- `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29f`.
- `index.html`: Menu/Arquivos usa título centralizado `MENU` e fechar/check branco no canto superior direito.
- `index.html`: grade superior mantém exatamente 3 colunas: Imagem, Formato, Templates; Fundo, Não limitar, Reset.
- `index.html`: divisor horizontal fino separa a grade superior da linha Salvar, Abrir, Recarregar.
- `index.html`: bloco JSON inferior separado mostra explicação à esquerda, documento JSON com chaves à direita e label `Json`.
- `index.html`: Formato usa `i-proportions`; Reset usa o símbolo de reset/timer aprovado; Abrir usa pasta aberta; JSON usa documento com `{}`.
- `index.html`: frame assistido não contém texto `Posicione o frame`, pill textual, caixa de texto ou fill interno colorido.
- `index.html`: frame assistido usa borda tracejada branca animada, quatro círculos brancos nos cantos e dim escuro externo.
- `index.html`: botões assistidos são apenas círculos: X preto em laranja e check preto em ciano, sem label visual.
- `index.html`: botões assistidos acompanham rotação do frame, compensam zoom/escala para manter tamanho tocável e têm fallback no rodapé do Stage com histerese simples.
- `index.html`: Menu/Arquivos, imagem, projeto, Templates, Fundo, Formato, Não limitar, Reset e Recarregar permanecem acionáveis durante F1 assistido; comandos de edição dependentes de frame confirmado continuam bloqueáveis.
- `index.html`: `applyEditorZoom()` continua chamando atualização visual imediata de bordas, curvas, handles, dim overlay e ghost.
- `index.html`: seleção de trecho/frame mantém caminhos completos visíveis, com ativo em ciano e demais em laranja contínuo.
- `index.html`: topbar preserva Visualização + Preview como bloco, deslocado levemente à direita, Preview mais retangular e X com traço mais evidente.
- `ROADMAP.md`: roadmap inferior registrado sem implementar faixa de tempo, nova faixa de informações, eliminação de faixa contextual ou arquitetura nova.

## Checklist manual recomendado em iPhone/Safari

1. Abrir o app e confirmar versão visível `v8z4b29f`.
2. Abrir Menu/Arquivos e comparar a ordem/ícones/bloco JSON com a referência visual.
3. Iniciar projeto novo e validar F1 assistido com borda branca tracejada animada, cantos brancos, interior limpo, dim externo e ausência de texto/pill.
4. Validar botões assistidos em frame grande, médio, pequeno, rotacionado e próximo ao rodapé.
5. Durante F1 assistido, abrir Menu, carregar imagem, abrir projeto, usar Templates, Reset e Recarregar.
6. Com vários frames, aplicar zoom/pan e confirmar atualização imediata de bordas, caminhos, pontos, handles, dim e labels.
7. Selecionar trechos e frames em imagem clara para confirmar caminhos ciano/laranja visíveis.
8. Confirmar que Preview e MP4/export continuam acessíveis no fluxo aprovado e que Undo/Redo, salvar/abrir e menus contextuais não regrediram.

## Limitações

- Testes reais em iPhone/Safari e geração real de MP4 não foram executados no ambiente automatizado.
