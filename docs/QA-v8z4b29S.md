# QA — v8z4b29S

## Versionamento

- [x] Base inicial limpa confirmada como `v8z4b29R` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Versão final esperada: `v8z4b29S`.
- [x] `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29S`.

## Escopo implementado

- [x] `activeIdx` continua controlando seleção, edição, handles, destaque de seleção e controles contextuais.
- [x] `selectFrameContext()` não sobrescreve `timelineFocalFrameId` nem `lowerTimelineCenterFrameIndex` por padrão.
- [x] Centralização programática explícita continua podendo atualizar `timelineFocalFrameId`/`lowerTimelineCenterFrameIndex` ao finalizar a centralização.
- [x] Scroll manual da timeline continua atualizando `lowerTimelineCenterFrameIndex` e `timelineFocalFrameId` sem alterar `activeIdx`.
- [x] `getTimelineStageFocusIndex()` mantém, para seleção simples, a prioridade `timelineFocalFrameId` válido → `lowerTimelineCenterFrameIndex` válido → `activeIdx` final, preservando o retorno por `activeIdx` em seleção múltipla e modo de trecho.
- [x] `updateDimOverlay()` usa `getTimelineStageFocusIndex()` no caminho principal e também no fallback sem `mix-blend-mode`.

## Checklist manual obrigatório em iPhone/Safari

1. Criar ou abrir projeto com vários frames.
2. Selecionar o Frame 2 pelo Stage.
3. Confirmar que o Frame 2 permanece selecionado/editável e com handles/controles contextuais corretos.
4. Rolar manualmente a timeline até o Frame 1 ficar no centro.
5. Confirmar que o Frame 2 continua selecionado e editável.
6. Confirmar que o destaque de seleção continua no Frame 2, se aplicável.
7. Confirmar que o alfa/spotlight escuro do Stage passa para o Frame 1.
8. Rolar para outro frame central e confirmar que o alfa acompanha o novo frame central sem trocar a seleção.
9. Selecionar frame pela timeline e confirmar que a seleção funciona sem duplicar menus ou alterar área inferior.
10. Testar rapidamente seleção múltipla e confirmar que nada quebra.
11. Testar modo de trecho e confirmar que nada quebra.
12. Abrir Preview e confirmar ausência de regressão visual.
13. Salvar/carregar JSON básico e confirmar que não houve alteração de schema.

## Itens fora de escopo preservados

- Menus inferiores, `#custBar`, `#alignBar`, `#lowerContextSlot` e CSS da área inferior.
- Escala visual dos frames da timeline, snap-to-center e ícone Formato.
- Preview, MP4/export, JSON, motor de animação, curvas e seleção múltipla funcional.

## Observação

- QA visual/interativo completo deve ser executado em iPhone/Safari ou em ambiente que reproduza WebKit mobile.
