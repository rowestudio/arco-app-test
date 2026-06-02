# QA — v8z4b28c corrigir pipeline HEIC e fonte de render

## Base confirmada antes das alterações

- `APP_VERSION = v8z4b28b`.
- `APP_VERSION_NAME = v8z4b28b`.
- Texto visível de versão no app: `v8z4b28b`.
- Comentário/changelog do topo coerente com `v8z4b28b`.

## Engine Sprint — pipeline de imagem/render/export HEIC

1. Problema exato: projeto com `imageBase64` HEIC de iPhone podia alternar fonte real de render, dimensões/orientação ou fallback, deixando Preview/Export escuro e podendo travar/falhar a geração.
2. Funções envolvidas: `loadImage`, `applyProjectData`, `setupPreviewCanvas`, `startPreview`, `drawAtT`, `drawAtTDirect`, `drawMirrorBg`, `buildRenderDiagnostics`, `logRenderFallback`, `startRecord`, `exportWithMediaRecorderFallback`, `cleanupFailedExport`.
3. Comportamento atual esperado antes da mudança: v8z4b28b melhorava estabilidade em zoom extremo, mas Preview/MP4 ainda dependiam do caminho direto `imgEl` e não diagnosticavam explicitamente a fonte canônica/origem HEIC embutida.
4. Comportamento novo esperado: imagem direta e `imageBase64` recriam uma fonte canônica decodificada, Preview/MP4/fallback usam a mesma fonte, orientação/dimensões vêm do browser após decode e erros de export ficam controlados com logs técnicos.
5. Riscos: se um browser não decodificar HEIC nativamente, a imagem ainda não ficará disponível; diagnóstico interno fica silencioso até `window._arcoDebugImagePipeline = true`; QA real em iPhone/Safari continua obrigatório antes de promover.
6. Regressões a cobrir: nitidez v8z4b28a/v8z4b28b, Preview abre/fecha, MP4 gera, HEIC direto, HEIC embutido, rotação F5→F6, curvasV2, fallback sem thumbnail, salvar/carregar, troca de imagem e responsividade no iPhone/Safari.

## Implementação

- Versionamento atualizado para `v8z4b28c` no comentário do topo, constantes JS, texto visível, `CHANGELOG.md`, `QA.md` e este checklist.
- `canonicalRenderImage` passa a ser recriada em toda troca/carregamento de imagem e marcada com metadados de origem (`upload-direct` ou `imageBase64`) e MIME original.
- `loadImage` preserva o data URL original, decodifica em `Image`, registra discrepância natural entre `tmp` e `imgEl` e define a fonte canônica antes de aplicar frames ou projeto.
- `drawAtTDirect` e `drawMirrorBg` usam `getCanonicalRenderSource()` em vez de `imgEl` como fonte final de render.
- `buildRenderDiagnostics` valida dimensões da fonte canônica e usa esse tamanho para source rect, zoom e qualidade.
- `debugImagePipeline(label)` registra dimensões reais e fonte quando ativado por `window._arcoDebugImagePipeline = true`.
- `logRenderFallback` marca fallback em metadados e inclui tamanho/tipo da fonte canônica.
- `startRecord` exige fonte canônica disponível antes de iniciar MP4.
- `logExportError` registra frame, tempo, segmento, source rect, transform, tamanho da fonte e output em falhas de render/blank/export.

## QA obrigatório

### Versionamento

1. Confirmar versão visível `v8z4b28c`.
2. Confirmar `APP_VERSION = v8z4b28c`.
3. Confirmar `APP_VERSION_NAME = v8z4b28c`.
4. Confirmar changelog/topo atualizado.

### Caso principal — `arco_5537 28b2_img.json`

5. Carregar `arco_5537 28b2_img.json`.
6. Confirmar que a imagem HEIC embutida aparece.
7. Confirmar `imageBase64` como `image/heic`.
8. Ativar `window._arcoDebugImagePipeline = true` e confirmar criação da fonte canônica.
9. Confirmar dimensões próximas de `4284 × 5712`, ou justificar/logar se o browser entregar outra dimensão orientada.
10. Abrir Preview.
11. Gerar MP4.
12. Confirmar que não há tela preta.
13. Confirmar que o Preview não fecha sozinho.
14. Confirmar que a geração não trava.
15. Confirmar MP4 gerado.

### Trecho crítico

16. Observar F4 → F5 → F6.
17. Confirmar que F5 não quebra a renderização.
18. Confirmar que rotação entre F5 e F6 não quebra.
19. Confirmar que fallback, se acionado, aparece no console.

### Imagem direta

20. Criar projeto novo.
21. Carregar a mesma imagem HEIC direto da galeria.
22. Criar frames próximos aos do JSON.
23. Gerar Preview.
24. Gerar MP4.
25. Confirmar estabilidade.

### Salvar/carregar

26. Salvar JSON leve.
27. Salvar JSON com imagem.
28. Carregar JSON leve e reassociar imagem.
29. Carregar JSON com imagem embutida.
30. Confirmar que ambos usam fonte correta.
31. Gerar MP4 nos dois casos.

### Regressão geral

32. Carregar imagem.
33. Mover frame.
34. Escalar frame.
35. Rotacionar frame.
36. Reset de rotação individual.
37. Seleção múltipla.
38. Escala multi-select.
39. Rotação multi-select.
40. Igualar.
41. Delta relativo.
42. Inserir frame entre frames rotacionados.
43. Salvar JSON.
44. Carregar JSON.
45. Trocar imagem.
46. Salvar novamente.
47. Reset Project.
48. Zoom/pan com dois dedos.
49. Inserção assistida / ghost frame.
50. Preview abre/fecha.
51. MP4 gera.

### iPhone/Safari

52. Testar em iPhone/Safari real.
53. Usar imagem HEIC da galeria.
54. Usar JSON com imagem HEIC embutida.
55. Gerar Preview.
56. Gerar MP4.
57. Confirmar ausência de tela preta permanente.
58. Confirmar ausência de travamento.
59. Confirmar ausência de reload do Safari.
60. Confirmar que app continua responsivo depois da geração.

## Resultado local

- Verificação estática executada: scripts extraídos de `index.html` passam em `node --check`.
- O arquivo real `arco_5537 28b2_img.json` não está presente no repositório de teste; QA manual principal permanece pendente até anexar/carregar esse arquivo em browser, preferencialmente iPhone/Safari.
