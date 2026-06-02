# QA — v8z4b28b estabilizar render em zoom extremo

## Base confirmada antes das alterações

- `APP_VERSION = v8z4b28a`.
- `APP_VERSION_NAME = v8z4b28a`.
- Texto visível de versão no app: `v8z4b28a`.
- Comentário/changelog do topo coerente com `v8z4b28a`.

## Engine Sprint — render Preview/Export em zoom extremo

1. Problema exato: zoom extremo podia acionar render inválido/blank e deixar Preview/Export escuro, interromper geração ou fechar o Preview durante falha.
2. Funções envolvidas: `setupPreviewCanvas`, `drawAtT`, `drawAtTDirect`, `drawMirrorBg`, `startPreview`, `togglePreviewPlayback`, `startRecord`, `exportWithMediaRecorderFallback`, `cleanupFailedExport`, `buildRenderDiagnostics`, `logRenderFallback`.
3. Comportamento atual esperado antes da mudança: v8z4b28a preservava melhor nitidez usando a fonte original, mas frames muito pequenos podiam exceder limite seguro de zoom/render.
4. Comportamento novo esperado: canvas final do MP4 permanece fixo, Preview limita backing store, parâmetros de render são validados, zoom acima do limite aciona fallback direto/log técnico e falhas reais limpam export mantendo Preview controlado.
5. Riscos: fallback em zoom absurdo não melhora detalhe inexistente; logs `[RenderFallback]` aparecem em frames acima do limite; guard de blank frame continua abortando casos inválidos fora do fallback extremo.
6. Regressões a cobrir: Preview abre/fecha, MP4 gera, zoom leve/médio/forte preserva nitidez da v8z4b28a, zoom extremo não fecha Preview, rotação/escala/curvas/pausas mantêm enquadramento, JSON e iPhone/Safari permanecem estáveis.

## Implementação

- Versionamento atualizado para `v8z4b28b` no comentário do topo, constantes JS e texto visível.
- Adicionados limites internos: `MAX_INTERNAL_CANVAS_PIXELS`, `MAX_PREVIEW_DPR`, `MAX_EXPORT_SUPERSAMPLE` e `MAX_SAFE_SOURCE_ZOOM`.
- Preview limita escala/backing store por orçamento de pixels sem alterar canvas final do Export/MP4.
- Export/MP4 mantém `recCanvas.width = outputWidth` e `recCanvas.height = outputHeight`, sem DPR de tela nem supersampling proporcional ao zoom.
- Render valida tempo, output, imagem, estado, source rect, cover e zoom antes de `drawImage`.
- Fallback seguro desenha direto da imagem original no canvas final e registra `[RenderFallback]` com frame, tempo, motivo, qualidade, source rect, output e tamanho natural.
- Loop WebCodecs e fallback MediaRecorder capturam erro por frame e tentam render direto seguro antes de abortar.
- Falha de geração limpa estado/overlay/botões e mantém Preview aberto em vez de fechar sozinho.

## QA obrigatório

### Versionamento

1. Confirmar versão visível `v8z4b28b`.
2. Confirmar `APP_VERSION = v8z4b28b`.
3. Confirmar `APP_VERSION_NAME = v8z4b28b`.
4. Confirmar changelog/topo atualizado.

### Reprodução principal

5. Criar projeto novo do zero.
6. Carregar imagem.
7. Criar 2 ou 3 frames.
8. Reduzir muito um frame para zoom extremo.
9. Abrir Preview.
10. Gerar MP4.
11. Confirmar que o app não escurece permanentemente.
12. Confirmar que o Preview não fecha sozinho.
13. Confirmar que a geração não trava silenciosamente.
14. Confirmar que, se fallback for acionado, há log técnico `[RenderFallback]`.
15. Confirmar que o MP4 gera quando possível.

### Comparação do limite

16. Usar o mesmo projeto.
17. Manter frame extremamente pequeno.
18. Testar MP4.
19. Aumentar um pouco o frame.
20. Testar MP4.
21. Confirmar que o comportamento volta ao normal quando o frame sai do limite crítico.

### Qualidade

22. Criar zoom leve.
23. Criar zoom médio.
24. Criar zoom forte, mas não extremo.
25. Gerar Preview.
26. Gerar MP4.
27. Confirmar que a qualidade da v8z4b28a foi preservada.
28. Confirmar que a imagem não voltou a ficar desnecessariamente borrada.

### Preview

29. Preview abre.
30. Preview fecha.
31. Preview com 1 frame funciona.
32. Preview com vários frames funciona.
33. Preview não mostra overlays/handles indevidos.
34. Preview não fica preto.

### MP4

35. MP4 gera.
36. MP4 não exporta menus/handles/overlays.
37. MP4 respeita duração.
38. MP4 respeita curvas.
39. MP4 respeita rotação.
40. MP4 respeita escala.
41. MP4 respeita pausa.

### Regressão geral

42. Carregar imagem.
43. Mover frame.
44. Escalar frame.
45. Rotacionar frame.
46. Reset de rotação individual.
47. Seleção múltipla.
48. Escala multi-select.
49. Rotação multi-select.
50. Igualar.
51. Delta relativo.
52. Inserir frame entre frames rotacionados.
53. Salvar JSON.
54. Carregar JSON.
55. Trocar imagem.
56. Salvar novamente.
57. Gerar Preview.
58. Gerar MP4.
59. Reset Project.
60. Zoom/pan com dois dedos.
61. Inserção assistida / ghost frame.

### iPhone/Safari

62. Testar em iPhone/Safari real.
63. Usar imagem grande.
64. Usar zoom médio.
65. Usar zoom extremo.
66. Gerar MP4.
67. Confirmar ausência de tela preta permanente.
68. Confirmar ausência de travamento.
69. Confirmar ausência de reload do Safari.
70. Confirmar que o app continua responsivo depois de uma falha tratada.
