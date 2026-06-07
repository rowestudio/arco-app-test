# QA v8z4b29U — arquitetura dos submenus inferiores

## Base
- Partir da versão validada `v8z4b29T`.
- Manter a correção funcional de Alpha/spotlight aprovada.
- Manter o ícone Formato corrigido.
- Não incorporar PRs rejeitadas que duplicaram menus ou quebraram a área inferior.

## Inventário estático
- `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo atualizados para `v8z4b29U`.
- `#custBar` fica dentro de `#lowerContextSlot`, junto de `#toolbar` e `#alignBar`.
- `#custBar` não é renderizado como barra extra abaixo de `#midBar.timeline-grid`.
- `cust-open` oculta menus concorrentes.
- `cust-expanded` faz o slot contextual ocupar Linhas 3–4 e oculta `#lowerFrameCount`, `.lower-active-state` e `.lower-selection-actions`.
- `align-submenu-open` mantém `#alignBarPrimary`/`#alignBarSubmenu` mutuamente exclusivos e oculta a Linha 3.
- Safe-area inferior continua centralizada em `--lower-safe-bottom` da grade inferior, sem nova barra externa do submenu.

## QA manual obrigatório
- [ ] Desktop.
- [ ] iPhone/Safari.
- [ ] Seleção simples.
- [ ] Seleção múltipla.
- [ ] Pausa.
- [ ] Rotação.
- [ ] Escala.
- [ ] Mover.
- [ ] Abrir e fechar submenu várias vezes.
- [ ] Alternar entre submenus.
- [ ] Timeline com poucos frames.
- [ ] Timeline com 16 frames.
- [ ] Confirmar que Alpha continua seguindo o frame central.
- [ ] Confirmar que snap-to-center continua funcionando.
- [ ] Confirmar que Formato continua com o ícone correto.
- [ ] Confirmar que Preview/export não foram alterados.

## Resultado esperado
1. Selecionar um frame.
2. Abrir Rotação.
3. O submenu aparece no lugar correto da área inferior.
4. O menu anterior não aparece duplicado.
5. Textos como “16 frames” ou “8 frames” não aparecem cortados por baixo.
6. O painel não sobe demais.
7. O topo do painel não é cortado.
8. A safe-area inferior não cria espaço morto excessivo.
9. Fechar o submenu volta ao menu contextual normal.
10. Repetir com Pausa, Escala e Mover.
