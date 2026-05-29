# QA — v8z4b26f corrigir luz, moldura e caminhos na seleção múltipla

Correção visual/estado da seleção múltipla a partir da v8z4b26e. A fonte de verdade continua sendo `selectedFrames`; o Stage e a faixa devem ser reconstruídos por `renderAll()`/`updateFrameSelector()` sem reaproveitar destaque visual acumulado.

## Versionamento

- `APP_VERSION = v8z4b26f`.
- `APP_VERSION_NAME = v8z4b26f`.
- Texto visível de versão em Settings atualizado para `v8z4b26f`.

## Verificações estáticas executadas

- Base anterior `v8z4b26e` confirmada antes das alterações por busca em `index.html`, `CHANGELOG.md`, `QA.md` e `docs/QA-v8z4b26e.md`.
- Ausência do botão `Sel`/`btnMultiSelect` mantida.
- `selectedFrames` continua sendo a fonte de verdade da seleção múltipla.
- `renderAll()` remove/reaplica classes visuais a partir de `selectedFrames`, sem destaque ativo dominante durante seleção múltipla.
- `updateDimOverlay()` fica oculto durante seleção múltipla para não iluminar o último frame tocado nem apagar molduras/caminhos.
- `drawBezier()` mantém caminhos sólidos e legíveis durante seleção múltipla, sem alterar geometria.
- `toggleFrameSelection()` não altera `activeIdx` enquanto a interação estiver em seleção múltipla real.

## Checklist obrigatório

1. Confirmar `APP_VERSION = v8z4b26f`.
2. Confirmar `APP_VERSION_NAME = v8z4b26f`.
3. Confirmar versão visível no app = `v8z4b26f`.
4. Confirmar que botão Sel não voltou.
5. Confirmar que nenhum botão novo equivalente foi criado.
6. Confirmar que seleção múltipla continua funcionando pela forma atual.
7. Selecionar 3 frames e confirmar luz/clareamento apenas nos selecionados.
8. Desselecionar 1 frame e confirmar que ele perde a luz imediatamente, preservando moldura.
9. Repetir desseleção em sequência e confirmar ausência de resíduo visual.
10. Entrar em seleção múltipla e confirmar caminhos/curvas visíveis, sólidos e sem geometria alterada.
11. Confirmar que o último frame tocado não é centralizado automaticamente nem trazido para frente durante seleção múltipla.
12. Aplicar Canto, Simétrico, Assimétrico e Desconectado em lote e confirmar que só frames ainda selecionados mudam.
13. Usar Undo/Redo e confirmar que a ação em lote continua agrupada e o visual permanece sincronizado.
14. Testar Loop com F1 + último frame + intermediário selecionados e confirmar coerência do fechamento.
15. Reset Project limpa seleção/luz e mantém molduras normais.
16. Salvar/carregar JSON e confirmar que seleção múltipla não foi persistida.
17. Preview/MP4 ignoram marcações de seleção múltipla.
18. Em iPhone/Safari, testar toques rápidos de selecionar/desselecionar, scroll horizontal da faixa e zoom/pan com dois dedos.
