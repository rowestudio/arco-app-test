# QA — v8z4b29AD ancoragem do submenu de seleção múltipla

## Base confirmada

- Versão encontrada antes das alterações: `v8z4b29AB` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo).
- Registro obrigatório: `v8z4b29AB` não foi aprovada funcionalmente para o bug visual dos submenus de seleção múltipla.
- Correção limitada à regra CSS `.mid-bar.timeline-grid #alignBar.align-submenu-open #alignBarSubmenu` e ao versionamento/documentação da `v8z4b29AD`.

## Verificações estáticas executadas

- `#alignBarSubmenu` em seleção múltipla permanece `position:absolute`, com `left`, `right`, `z-index`, `background`, `border`, `box-shadow`, `overflow-x:auto`, `overflow-y:visible`, `box-sizing:border-box` e `pointer-events:auto` preservados.
- A âncora mudou de `bottom:var(--lower-home-breath)` para `bottom:0`.
- A altura mudou para `calc(var(--lower-row-3) + var(--lower-row-4) - 8px)` em `height` e `min-height`.
- O padding interno mudou para `8px 8px 6px 6px`, dando respiro ao slider sem subir o painel.
- Não foram alterados snap-to-center, `timelineFocalFrameId`, Alpha/spotlight, Preview/export/MP4, JSON, curvas, motor, ícone Formato, menu superior nem lógica de seleção múltipla.

## QA manual obrigatório pendente

1. iPhone/Safari ou viewport equivalente.
2. Entrar em seleção múltipla.
3. Abrir Rotação.
4. Medir `#lowerContextSlot`, `#alignBarSubmenu` e `#pillsRow` com `getBoundingClientRect()`.
5. Confirmar que `submenu.bottom` coincide com `slot.bottom` ou fica no máximo 1px diferente.
6. Confirmar que `submenu.top` fica abaixo de `pills.bottom` com respiro visual real.
7. Confirmar que o submenu não sobe demais.
8. Confirmar que não fica espaço morto embaixo.
9. Confirmar que o slider não invade frames/pills.
10. Fechar Rotação.
11. Abrir Pausa.
12. Abrir Escala.
13. Abrir Mover.
14. Confirmar que Linha 4 / Coluna 2 não desloca.
15. Confirmar que `Selecionar todos` permanece em uma linha.
16. Confirmar snap-to-center.
17. Confirmar Alpha/spotlight.
18. Confirmar Preview/export/JSON/curvas sem regressão.

## Limitações do ambiente

- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real, JSON manual nem curvas manuais neste ambiente automatizado.
