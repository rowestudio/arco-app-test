# QA pendente — v8z4b29Z exclusão mútua custBar e multi-seleção

- [x] Base obrigatória confirmada antes das alterações: `v8z4b29W` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- [x] Versionamento atualizado para `v8z4b29Z` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] `toggleFrameSelection()` fecha `#custBar` ao entrar em multi-seleção sem limpar `selectedFrames`, sem alterar `activeIdx` desnecessariamente e sem centralizar timeline automaticamente.
- [x] `selectAllFramesForContext()` mantém `preventDefault()`/`stopPropagation()`, fecha `#custBar`, mantém `has-multi-selection` e preserva seleção de todos os frames.
- [x] `openCustBar()`, `openCustBarTabFromBottom()` e `switchCustTab()` não abrem `#custBar` durante multi-seleção.
- [x] `openAlignSubmenu()` fecha `#custBar` antes de abrir submenu de seleção múltipla; `closeAlignSubmenu()` não reabre `#custBar`.
- [x] CSS defensivo oculta `#custBar` e neutraliza `cust-expanded` em `body.has-multi-selection`.
- [x] Não foram alterados snap-to-center, geometria do snap, `getLowerTimelineNearestFrameIndex()`, `centerLowerTimelineOnFrame()`, `scheduleLowerTimelineSnapToCenter()`, Alpha/spotlight, Preview, MP4/export, JSON, curvas ou motor de animação.

## QA manual obrigatório pendente em iPhone/Safari

1. Seleção simples.
2. Abrir Pausa.
3. Abrir Rotação.
4. Abrir Escala.
5. Abrir Mover.
6. Entrar em seleção múltipla com menu simples aberto e confirmar fechamento imediato de `#custBar`.
7. Clicar em `Selecionar todos` e confirmar seleção de todos os frames com multi-seleção ativa.
8. Abrir submenu de seleção múltipla e confirmar ausência de menu sobre menu.
9. Sair da seleção múltipla e confirmar que `#custBar` não reaparece sozinho.
10. Confirmar Linha 4 da Coluna 2 estável, Coluna 1 estável, snap-to-center funcionando, Alpha funcionando e ícone Formato correto.

Não foram executados testes em iPhone/Safari real neste ambiente automatizado.
