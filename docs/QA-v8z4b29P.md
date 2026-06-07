# QA — v8z4b29P

## Base obrigatória

- [x] Base inicial confirmada como `v8z4b29O` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Versão final esperada: `v8z4b29P`.
- [x] `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29P`.

## Verificações estáticas executadas

- [x] Fundo geral/Stage vazio e menus principais usam a base `#3c3c3b`/`var(--menu-bg)`.
- [x] Ícones em menus com label seguem branco para SVG e `#b2b2b2` para texto.
- [x] Ajustes/Arquivos usa o símbolo Lucide `clapperboard`; Formato usa `proportions`.
- [x] Timeline mantém frames retangulares arredondados, menos largos, com borda cinza mais espessa e destaque ciano para ativo/selecionado.
- [x] Tempos parciais são discretos e sem sufixo `s`; tempo total mantém `s`.
- [x] Scroll manual da timeline recalcula o frame central e atualiza foco visual/overlay do Stage.
- [x] Centralização programática usa janela de supressão para não aplicar foco/alfa aos frames intermediários durante a rolagem suave.
- [x] `Selecionar todos` preserva multi-select, seleciona todos os frames e mantém texto antes do ícone.
- [x] Painéis de ajuste expandidos podem ocupar linhas 3 e 4 e as duas colunas da área inferior.
- [x] Curvas/caminhos permanecem acima do alfa escuro do Stage por z-index superior ao overlay.
- [x] Motor de animação, Preview, export/MP4 e JSON não foram alterados.

## Testes manuais recomendados em iPhone/Safari

1. Abrir o app e confirmar versão visível `v8z4b29P` no menu/Configurações.
2. Carregar imagem, criar múltiplos frames e rolar manualmente a timeline: o frame no centro deve ficar com alfa/foco no Stage, limpando o anterior.
3. Tocar em um frame no Stage ou na timeline fora de seleção múltipla: a timeline deve centralizar suavemente sem flicker dos frames intermediários.
4. Entrar em seleção múltipla e tocar em `Selecionar todos`: o modo deve permanecer ativo e todos os frames devem ficar selecionados.
5. Abrir Pausa/Rotação/Escala/Mover: os controles devem ter respiro suficiente, sem corte de slider ou botões `-5/+5`, podendo cobrir as linhas 3/4.
6. Verificar a área inferior com Home Indicator: o espaço morto deve estar reduzido e a zona morta deve manter fundo `#3c3c3b`.
7. Selecionar trecho e comparar espaçamento dos ícones contextuais com o menu de frame.

## Limitações

- Não foram executados testes em iPhone/Safari real neste ambiente automatizado.
- Não foi executada geração real de MP4, por estar fora do escopo desta rodada.
