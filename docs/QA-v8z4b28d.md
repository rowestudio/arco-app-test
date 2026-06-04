# QA — v8z4b28d estabilizar motor universal de Preview/MP4

## Base confirmada antes das alterações

- `APP_VERSION = v8z4b28c`.
- `APP_VERSION_NAME = v8z4b28c`.
- Texto visível de versão no app: `v8z4b28c`.
- Comentário/changelog do topo coerente com `v8z4b28c`.

## Engine Sprint — estabilidade estrutural Preview/Export/MP4

1. Problema exato: zoom forte/extremo, pausa como gatilho possível, rotação/loop ou fonte/canvas/encoder inválidos podiam gerar tela escura, export interrompido, Preview fechado ou estado preso.
2. Funções envolvidas: `getStateAtT`, `getRenderStateAtTime`, `buildRenderDiagnostics`, `drawAtT`, `drawAtTDirect`, `renderFrameSafely`, `renderUniversalFallback`, `startPreview`, `togglePreviewPlayback`, `startRecord`, `exportWithMediaRecorderFallback`, `cleanupExportSession` e caminho `VideoEncoder`/`VideoFrame`.
3. Comportamento esperado antes da mudança: v8z4b28c preservava fonte canônica/HEIC/nitidez e já possuía fallback parcial, mas ainda podia deixar passar quadro inválido ou preto para Preview/Export/encoder.
4. Comportamento novo esperado: cada quadro valida estado, transform, source rect, canvas e fonte antes de desenhar/encodar; falhas usam fallback universal ou abortam controladamente; Preview não fecha sozinho; MP4 pode ser tentado novamente sem recarregar.
5. Riscos: fallback universal pode mostrar enquadramento central em caso extremo em vez do frame exato; `DEBUG_RENDER_EXPORT` fica desligado por padrão; QA real em iPhone/Safari continua obrigatório para memória/WebCodecs.
6. Regressões a cobrir: nitidez v8z4b28a/v8z4b28b/v8z4b28c, fonte canônica, HEIC/orientação, zoom extremo, pausas, loop, rotação, Preview abre/fecha, MP4 gera, falha controlada, salvar/carregar JSON, troca de imagem e Reset Project.

## Implementação

- Versionamento atualizado para `v8z4b28d` no comentário do topo, constantes JS, texto visível, `CHANGELOG.md`, `QA.md` e este checklist.
- `getRenderStateAtTime(time)` centraliza o estado de render com `globalTime`, segmento, frames de origem/destino, `localT`, pausa, loop, finish, escala, rotação, câmera, easing e validade.
- `renderFrameSafely(...)` valida canvas/output, chama o render normal, detecta falha/quadro preto e aciona `renderUniversalFallback(...)` antes de Preview/MediaRecorder/WebCodecs usarem o frame.
- `renderUniversalFallback(...)` desenha a fonte canônica direto no canvas final fixo, com reset de transform e smoothing high, sem canvas gigante, supersampling ou thumbnail.
- O caminho WebCodecs valida timestamps monotônicos, canvas final fixo e criação de `VideoFrame`; `ImageBitmap`/`VideoFrame` são fechados em `finally`; erros do encoder são logados por frame.
- `cleanupExportSession(reason)` registra cleanup técnico e auxilia a limpeza de timers/overlay/progresso/canvas sem prender a sessão.
- Logs técnicos sob `DEBUG_RENDER_EXPORT`: `[RenderState]`, `[RenderValidationError]`, `[ExportFrameError]`, `[EncoderError]` e `[ExportCleanup]`.

## QA obrigatório

### Versionamento

1. Confirmar versão visível `v8z4b28d`.
2. Confirmar `APP_VERSION = v8z4b28d`.
3. Confirmar `APP_VERSION_NAME = v8z4b28d`.
4. Confirmar changelog/topo atualizado.

### Motor básico

5. Criar projeto novo.
6. Carregar imagem.
7. Criar 3 frames.
8. Abrir Preview.
9. Gerar MP4.
10. Confirmar que gera.

### Zoom forte

11. Reduzir bastante um frame.
12. Abrir Preview.
13. Gerar MP4.
14. Confirmar que não fica tela preta.
15. Confirmar que não trava.
16. Confirmar que se houver erro, ele é tratado.
17. Aumentar um pouco o frame.
18. Gerar novamente.
19. Confirmar que gera sem reload.

### Pausa

20. Adicionar pausa em frame intermediário.
21. Gerar Preview.
22. Gerar MP4.
23. Remover pausa.
24. Gerar MP4 novamente.
25. Confirmar que ambos não travam.

### Loop

26. Testar com loop ligado.
27. Testar com loop desligado, se houver modo.
28. Confirmar que último frame/retorno não quebra.

### Rotação

29. Criar frames com rotação positiva e negativa.
30. Gerar Preview.
31. Gerar MP4.
32. Confirmar que rotação não quebra.

### Imagem e JSON

33. Testar HEIC.
34. Testar JPG/PNG menor.
35. Testar JSON leve + imagem reassociada.
36. Testar JSON com imagem embutida.
37. Confirmar estabilidade.

### Arquivo real

38. Carregar `arco_5537 28b2_img.json`, se disponível no ambiente de teste.
39. Observar trecho F4 → F5 → F6.
40. Gerar MP4.
41. Confirmar ausência de tela preta/travamento.

### Erro controlado

42. Forçar caso extremo.
43. Confirmar que, se falhar, o app limpa estado.
44. Confirmar que Preview continua utilizável.
45. Confirmar que é possível tentar gerar de novo sem recarregar a página.

### Regressão geral

46. Carregar imagem.
47. Selecionar frame.
48. Mover frame.
49. Escalar frame.
50. Rotacionar frame.
51. Seleção múltipla.
52. Escala multi-select.
53. Rotação multi-select.
54. Igualar.
55. Delta relativo.
56. Inserir frame.
57. Salvar JSON.
58. Carregar JSON.
59. Trocar imagem.
60. Reset Project.
61. Zoom/pan com dois dedos.
62. Inserção assistida / ghost frame.
63. Preview abre/fecha.
64. MP4 gera.

### iPhone/Safari

65. Testar em iPhone/Safari real.
66. Gerar MP4 com zoom forte.
67. Gerar MP4 com pausa.
68. Gerar MP4 com rotação.
69. Confirmar ausência de tela preta permanente.
70. Confirmar ausência de travamento.
71. Confirmar ausência de reload do Safari.
72. Confirmar que app continua responsivo depois de erro tratado.
