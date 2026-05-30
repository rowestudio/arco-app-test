# QA — v8z4b26g remover laranja interno e corrigir overlay da seleção múltipla

Correção visual/UX da seleção múltipla a partir da v8z4b26f. A fonte de verdade continua sendo `selectedFrames`; o Stage e a faixa devem continuar sincronizados por `renderAll()`/`updateFrameSelector()` sem foco dominante no último frame tocado.

## Escopo implementado

- `APP_VERSION = v8z4b26g`.
- `APP_VERSION_NAME = v8z4b26g`.
- Texto visível de versão em Settings atualizado para `v8z4b26g`.
- Removido o preenchimento/tingimento laranja interno de `.frame-dim` em frames com `.multi-selected`.
- Borda laranja de selecionado preservada; halo externo discreto aplicado sem `inset`/fill interno.
- Overlay escuro externo implementado em `updateDimOverlay()` durante seleção múltipla com máscara SVG e recortes para todos os frames em `selectedFrames`.
- Recortes do overlay múltiplo usam `getRotatedFrameCorners()`, respeitando posição e rotação dos frames.
- Caminho/curva não teve geometria alterada e permanece desenhado por `drawBezier()`.
- Sem novos botões; botão `Sel` não foi restaurado.
- Preview, MP4 e JSON não foram alterados.

## Verificações estáticas executadas

1. Base `v8z4b26f` confirmada antes das alterações por busca de `APP_VERSION`, `APP_VERSION_NAME`, texto visível e cabeçalho.
2. Versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível confirmado como `v8z4b26g`.
3. Ausência de `btnMultiSelect` e de botão `Sel` confirmada por busca textual.
4. Seleção múltipla continua baseada em `selectedFrames`.
5. `renderAll()` mantém `.multi-selected` para frames selecionados, borda laranja e halo externo sem box-shadow `inset`.
6. `.frame.multi-selected .frame-dim` permanece transparente e sem sombra/fill.
7. `updateDimOverlay()` não oculta mais o overlay durante seleção múltipla; cria máscara SVG externa com recortes múltiplos.
8. `drawBezier()` não foi alterado para a v8z4b26g.
9. Sintaxe básica de `index.html` validada.

## QA manual obrigatório antes de promover

### Versionamento

1. Confirmar `APP_VERSION = v8z4b26g`.
2. Confirmar `APP_VERSION_NAME = v8z4b26g`.
3. Confirmar versão visível no app = `v8z4b26g`.

### Regressão básica

4. Confirmar que botão `Sel` não voltou.
5. Confirmar que nenhum botão novo equivalente foi criado.
6. Confirmar que seleção múltipla continua funcionando pela forma atual.
7. Confirmar que seleção aparece no Stage e na faixa inferior.

### Overlay laranja interno

8. Selecionar múltiplos frames.
9. Confirmar que frames selecionados têm borda laranja.
10. Confirmar que o interior dos frames selecionados NÃO fica laranja.
11. Confirmar que não há fill, tint, opacity, filter ou camada laranja dentro do frame.
12. Confirmar que a imagem dentro do frame selecionado permanece limpa.

### Overlay externo múltiplo

13. Confirmar que há overlay escuro externo para múltiplos frames.
14. Selecionar 2 frames.
15. Confirmar que a área externa aos frames selecionados fica discretamente escurecida.
16. Confirmar que o interior dos frames selecionados fica limpo/recortado.
17. Selecionar 3 ou mais frames.
18. Confirmar que todos os recortes funcionam.
19. Testar frames rotacionados.
20. Confirmar que o recorte respeita rotação e posição.
21. Confirmar que bordas dos frames continuam visíveis acima do overlay.
22. Confirmar que frames não selecionados não somem.

### Primeiro frame e desseleção

23. Pressionar e segurar o primeiro frame para iniciar seleção múltipla.
24. Confirmar que ele recebe borda laranja imediatamente.
25. Confirmar que ele NÃO recebe overlay laranja interno.
26. Confirmar que ele entra no recorte do overlay externo.
27. Selecionar 3 frames e desselecionar 1.
28. Confirmar que o desselecionado perde borda laranja, mantém moldura normal, não fica laranja e não some.
29. Confirmar que overlay externo/recortes atualizam corretamente.

### Caminho/curva

30. Entrar em seleção múltipla.
31. Confirmar que o caminho/curva principal continua visível.
32. Confirmar que o caminho/curva não some.
33. Confirmar que o caminho/curva não vira linha branca tracejada fraca.
34. Confirmar que o caminho/curva não é escondido pelo overlay escuro.
35. Confirmar que a geometria da curva não foi alterada.
36. Confirmar que pontos/handles continuam compreensíveis.

### Aplicação em lote e Undo/Redo

37. Selecionar múltiplos frames.
38. Aplicar Canto, Simétrico, Assimétrico e Desconectado.
39. Confirmar que apenas os selecionados recebem cada modo.
40. Confirmar que seleção permanece visível após aplicar.
41. Usar Undo e confirmar que todos os frames afetados voltam juntos.
42. Usar Redo e confirmar que todos reaplicam juntos.
43. Confirmar que visual/overlay da seleção permanece sincronizado.

### Loop, Reset, JSON, Preview, MP4 e iPhone/Safari

44. Ativar Loop e testar F1 + último frame + intermediário conforme checklist da tarefa.
45. Reset Project deve limpar seleção e overlay externo sem apagar molduras normais.
46. Salvar/carregar JSON não deve persistir seleção múltipla nem campos temporários.
47. Preview deve ignorar seleção múltipla e não mostrar overlay/marcações.
48. MP4 deve ignorar seleção múltipla e não mostrar overlay/marcações.
49. Em iPhone/Safari com imagem clara, confirmar legibilidade das bordas, ausência de laranja interno, utilidade do overlay externo/halo, scroll horizontal da faixa e zoom/pan com dois dedos.

## Observação futura

O overlay normal da edição individual não foi ajustado nesta versão, conforme solicitado. Avaliar separadamente se ele parecer escuro demais em teste visual futuro.
