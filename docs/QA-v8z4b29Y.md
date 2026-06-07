# QA — v8z4b29Y

## Escopo
- Corrigir somente a estabilidade da Linha 4 / Coluna 2 em seleção múltipla a partir da base `v8z4b29W`.
- Não alterar snap-to-center, Alpha/spotlight, ícone Formato, Preview, MP4/export, JSON, curvas ou motor de animação.

## Verificações estáticas
- [x] Base `v8z4b29W` confirmada antes das alterações por busca em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Versionamento atualizado para `v8z4b29Y`.
- [x] `#alignBar` neutraliza a herança antiga de barra fixa dentro de `#midBar.timeline-grid`: `position:static`, `height:100%`, `padding:0`, `margin:0`, `bottom:auto`, `left:auto`, `right:auto`.
- [x] `#alignBarPrimary` ocupa somente a Linha 4 / Coluna 2 em seleção múltipla sem submenu.
- [x] `#alignBarSubmenu` ocupa o mesmo slot da Linha 4 / Coluna 2, sem `left` negativo ou cálculo manual de altura/bottom para cobrir Linhas 3–4.
- [x] `#lowerSelectionActions` / `Selecionar todos` permanece na Linha 3 como área absoluta fora do fluxo, sem alterar a altura da Linha 3 nem empurrar a Linha 4.
- [x] `#custBar` não coexiste visualmente com `#alignBarSubmenu`.

## QA manual obrigatório pendente
1. Abrir o app em iPhone/Safari com vários frames.
2. Observar a Linha 4 / Coluna 2 em seleção simples.
3. Entrar em seleção múltipla.
4. Confirmar que `Selecionar todos` aparece sem empurrar a Linha 4.
5. Confirmar que Pausa, Rotação, Escala e Mover permanecem exatamente no mesmo Y.
6. Clicar em `Selecionar todos` e confirmar que a lógica continua funcionando.
7. Sair da seleção múltipla.
8. Abrir e fechar menus contextuais e confirmar ausência de menu duplicado ou ícone escondido por baixo.
9. Confirmar que a Coluna 1 permanece estável.
10. Confirmar que snap-to-center, Alpha/spotlight e ícone Formato continuam corretos.

## Limitações do ambiente
- Não executado em iPhone/Safari real neste ambiente automatizado.
- Não executados Preview real, MP4/export real nem JSON manual, pois não fazem parte do escopo funcional desta correção.
