# QA — v8z4b26e limpar marcação residual ao desselecionar frames

## Escopo

Correção visual/estado da seleção múltipla a partir da v8z4b26d. A fonte de verdade permanece `selectedFrames`; Stage e faixa de frames devem limpar marcações antigas e reaplicar destaque apenas quando há seleção múltipla real (2+ frames selecionados).

## Verificações estáticas executadas neste repositório de teste

- `APP_VERSION = v8z4b26e`.
- `APP_VERSION_NAME = v8z4b26e`.
- Texto visível de versão em Settings atualizado para `v8z4b26e`.
- Botão `btnMultiSelect`/`Sel` não foi recriado.
- `selectedFrames` não é salvo no JSON.
- `renderAll()` usa `clearFrameSelectionVisuals()` e `isFrameVisuallyMultiSelected()` para limpar/reaplicar destaque de Stage quando a seleção real não tem 2+ frames.
- `updateFrameSelector()` usa `isFrameVisuallyMultiSelected()` para limpar destaque da faixa quando a seleção real não tem 2+ frames.
- Sintaxe básica de `index.html` validada com parser HTML.

## Checklist manual obrigatório antes de promover

### Versionamento
1. Confirmar `APP_VERSION = v8z4b26e`.
2. Confirmar `APP_VERSION_NAME = v8z4b26e`.
3. Confirmar versão visível no app = `v8z4b26e`.

### Regressão básica
4. Confirmar que o botão `Sel` não voltou.
5. Confirmar que nenhum botão novo equivalente foi criado.
6. Confirmar que a seleção múltipla continua funcionando pela forma atual.
7. Confirmar que frames selecionados aparecem no Stage.

### Bug principal — desseleção
8. Selecionar 3 frames.
9. Desselecionar o frame do meio.
10. Confirmar que ele perde imediatamente o destaque no Stage.
11. Confirmar que ele perde imediatamente o destaque na faixa/menu.
12. Confirmar que os outros dois permanecem selecionados.
13. Desselecionar mais um frame.
14. Confirmar que não sobra marcação residual.
15. Limpar toda a seleção.
16. Confirmar que nenhuma marcação de seleção múltipla permanece no Stage.
17. Confirmar que nenhuma marcação de seleção múltipla permanece na faixa/menu.

### Frames sobrepostos e frame ativo
18. Criar/usar frames sobrepostos.
19. Selecionar múltiplos frames.
20. Desselecionar um frame parcialmente coberto por outro.
21. Confirmar que a marcação residual não fica escondida ou reaplicada por z-index.
22. Confirmar que o último frame tocado não fica com destaque dominante.
23. Durante seleção múltipla, confirmar que o frame ativo não fica com destaque dominante no Stage.
24. Confirmar que apenas frames realmente selecionados têm destaque.
25. Sair/limpar seleção múltipla.
26. Confirmar que o destaque individual do frame ativo volta ao normal fora da seleção múltipla.

### Aplicação em lote / Undo / Redo / Loop
27. Selecionar múltiplos frames, desselecionar um deles e aplicar Canto; confirmar que apenas os frames ainda selecionados receberam Canto.
28. Repetir com Simétrico, Assimétrico e Desconectado.
29. Confirmar que o frame desselecionado não foi alterado.
30. Usar Undo e Redo; confirmar que todos os frames afetados voltam/reaplicam juntos.
31. Confirmar que a marcação visual continua sincronizada depois de Undo/Redo.
32. Ativar Loop; selecionar F1 + último frame + intermediário; desselecionar intermediário; aplicar modos de curva; confirmar que só F1 e último frame são afetados e que o fechamento do Loop continua coerente.

### Reset / JSON / Preview / MP4 / iPhone Safari
33. Selecionar múltiplos frames e usar Reset Project; confirmar que seleção e marcações visuais somem.
34. Salvar e carregar JSON; confirmar que seleção múltipla não foi persistida e que não há campos temporários de seleção no JSON.
35. Abrir Preview com seleção múltipla ativa; confirmar que Preview funciona e não mostra marcação de seleção.
36. Exportar MP4; confirmar que MP4 funciona e não mostra marcação de seleção.
37. No iPhone/Safari, testar toques rápidos selecionando/desselecionando frames; confirmar que não sobra destaque residual.
38. Confirmar que scroll horizontal da faixa continua funcionando.
39. Confirmar que zoom/pan com dois dedos no Stage continua funcionando.
40. Confirmar que não há seleção nativa de texto/callout indesejado.
