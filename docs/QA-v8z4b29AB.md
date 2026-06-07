# QA — v8z4b29AB estabilidade real da Linha 3/4 em seleção múltipla

## Escopo
- Corrigir a geometria da Linha 3 / Coluna 2 e Linha 4 / Coluna 2 em seleção múltipla.
- Manter `Selecionar todos` em uma única linha, com texto antes do ícone.
- Preservar snap-to-center, Alpha/spotlight, Preview/export/JSON/curvas/motor, Stage, ícone Formato e menu superior.

## Verificações estáticas executadas
- [x] Base `v8z4b29W` confirmada antes das alterações em `index.html`.
- [x] Versionamento atualizado para `v8z4b29AB` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- [x] Linha 3 / Coluna 2 reserva `--lower-select-all-w` mesmo quando `#lowerSelectionActions` está invisível.
- [x] `#lowerSelectionActions` alterna `visibility`/`pointer-events`, sem `display:none` para mudar a geometria da Linha 3.
- [x] `.lower-selection-action` usa `inline-flex`, `white-space: nowrap`, `min-width: max-content`, texto antes do ícone e sem `overflow:hidden` no label.
- [x] `#lowerContextSlot`, `#toolbar` e `#alignBar` permanecem na Linha 4 / Coluna 2, com largura/altura de 100% do mesmo slot.
- [x] Não houve alteração em snap-to-center, Alpha/spotlight, Preview/export, JSON, curvas, motor, Stage, ícone Formato ou menu superior.

## QA manual obrigatório antes de promover
1. Entrar em seleção múltipla.
2. Confirmar que `Selecionar todos` fica em uma linha só.
3. Confirmar que o texto vem antes do ícone.
4. Confirmar que Linha 4 / Coluna 2 não desce.
5. Confirmar que Linha 4 / Coluna 2 não desloca para a esquerda.
6. Confirmar que Coluna 1 / Linha 4 e Coluna 2 / Linha 4 continuam alinhadas.
7. Confirmar que snap-to-center continua funcionando.
8. Confirmar que Alpha/spotlight continua funcionando.
9. Confirmar que Preview/export/JSON/curvas/motor não foram alterados.

## Limitação
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.
