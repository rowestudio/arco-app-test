# QA — v8z4b29O

## Escopo
- Correção UX/layout/visual/estado de interface a partir de `v8z4b29N`.
- Sem alterações no motor de animação, Preview, MP4/exportação, JSON schema, undo/redo ou cálculo de curvas.

## Verificações implementadas
- [x] Base confirmada como `v8z4b29N` antes das alterações por busca em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Versionamento atualizado para `v8z4b29O` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Menus e painéis principais passam a usar a variável `--menu-bg: #3c3c3b`.
- [x] Safe area inferior usa o fundo global do menu para continuidade visual com a base inferior.
- [x] Top bar usa o fundo oficial dos menus.
- [x] Menu contextual do Stage usa cápsula/pill e ícones/textos padronizados.
- [x] Menu de curvas substitui visualmente o menu contextual do Stage, sem pills individuais nos botões de curva.
- [x] Timeline ganhou mais respiro vertical e dois marcadores centrais visíveis.
- [x] Destaque do frame central da timeline atualiza bordas/adjacências e overlay escuro do Stage.
- [x] Botão `Selecionar todos` mantém seleção múltipla ativa e usa texto antes do ícone.
- [x] Texto de seleção múltipla lista apenas frames entre parênteses com reticências quando necessário.

## QA manual obrigatório em iPhone/Safari real
1. Abrir o app e confirmar versão visível `v8z4b29O`.
2. Confirmar que top bar, base inferior, menus contextuais, curvas, ajustes, arquivos/configurações e safe area inferior usam `#3c3c3b`.
3. Confirmar ícones brancos e labels `#b2b2b2` nos menus afetados.
4. Confirmar que `Formato` usa o símbolo Lucide `proportions`.
5. Tocar em um frame no Stage, abrir `Curva` e confirmar substituição pelo menu de curvas no mesmo espaço, sem pills individuais.
6. Rolar a timeline horizontalmente e confirmar frame central destacado no Stage com alfa escuro claro ao redor e curvas/handles visíveis.
7. Confirmar duas esferas/marcadores centrais da timeline com respiro, sem corte.
8. Entrar em seleção múltipla, selecionar alguns frames, tocar `Selecionar todos` e confirmar que todos permanecem selecionados em multi-select.
9. Conferir regressão: seleção simples, seleção de trecho, seleção múltipla, scroll, centralização, abertura/fechamento de menus, Preview, MP4/export, JSON e Undo/Redo.
