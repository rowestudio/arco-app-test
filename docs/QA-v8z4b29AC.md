# QA — v8z4b29AC

## Objetivo

Corrigir estruturalmente a área inferior para estabilizar Linha 4 / Coluna 2 em seleção múltipla e ancorar submenus Pausa/Rotação/Escala/Mover ao rodapé real da área inferior, sem alterar motor, Preview/export, JSON, curvas, snap-to-center, Alpha/spotlight, ícone Formato ou menu superior.

## Auditoria antes da alteração

- [x] Base atual identificada como `v8z4b29AB` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Base funcional de referência `v8z4b29W` comparada via diff estático com `v8z4b29AB`.
- [x] Elementos mapeados por inspeção estrutural equivalente ao inventário de `getBoundingClientRect()`: `#midBar`, `#lowerContextSlot`, `#toolbar`, `#alignBar`, `#custBar`, wrappers diretos da Coluna 1, wrappers diretos da Coluna 2, Linha 3 da Coluna 2, Linha 4 da Coluna 2 e `#alignBarSubmenu`/`#custBar` aberto.
- [x] Causa encontrada: `body.cust-expanded #lowerContextSlot` tirava a Linha 4 / Coluna 2 do seu slot fixo ao mudar para `grid-column: 1 / 3` e `grid-row: 3 / 5`; `#alignBarSubmenu` ainda usava `bottom: var(--lower-home-breath)`, produzindo ancoragem acima do rodapé real e espaço morto inferior.

## Verificações estáticas

- [x] `APP_VERSION = v8z4b29AC`.
- [x] `APP_VERSION_NAME = v8z4b29AC`.
- [x] Versão visível do app atualizada para `v8z4b29AC`.
- [x] Comentário/changelog do topo atualizado para `v8z4b29AC`.
- [x] Linha 3 / Coluna 2 recebeu slot explícito `#lowerRow3Col2` / `.lower-row-3-slot`.
- [x] Linha 4 / Coluna 2 (`#lowerContextSlot`) recebeu `.lower-row-4-slot`, altura fixa e permanece no mesmo retângulo.
- [x] `Selecionar todos` fica dentro da Linha 3, com `white-space: nowrap`, texto completo antes do ícone e sem alterar altura, largura ou posição da Linha 4.
- [x] `#toolbar`, `#alignBar` e `#custBar` continuam no slot/camada da Linha 4 e não disputam fluxo vertical com `Selecionar todos`.
- [x] Submenu de seleção múltipla (`#alignBarSubmenu`) é camada absoluta sobre Linhas 3/4, com `bottom: 0`.
- [x] Submenu de ajuste local (`#custBar` expandido) é camada absoluta sobre Linhas 3/4, com `bottom: 0`.
- [x] Safe-area não foi recontada nos submenus; a área inferior preserva a safe-area única do `#midBar`.
- [x] Snap-to-center, Alpha/spotlight, Preview/export/JSON/curvas/motor não foram alterados.

## QA manual obrigatório

1. [ ] Estado normal: confirmar Linha 4 estável.
2. [ ] Seleção múltipla: confirmar `Selecionar todos` em uma linha, texto completo antes do ícone, sem empurrar menus.
3. [ ] Seleção múltipla: confirmar Linha 4 / Coluna 2 sem descer.
4. [ ] Seleção múltipla: confirmar Linha 4 / Coluna 2 sem deslocar para esquerda.
5. [ ] Abrir Pausa em seleção múltipla: submenu não sobe demais.
6. [ ] Abrir Rotação em seleção múltipla: submenu não sobe demais.
7. [ ] Abrir Escala em seleção múltipla: submenu não sobe demais.
8. [ ] Abrir Mover em seleção múltipla: submenu não sobe demais.
9. [ ] Confirmar ausência de espaço morto exagerado abaixo do submenu perto da home indicator.
10. [ ] Confirmar que o topo do submenu não é cortado.
11. [ ] Confirmar snap-to-center da timeline.
12. [ ] Confirmar Alpha/spotlight.
13. [ ] Confirmar Preview/export/JSON/curvas/motor preservados.
