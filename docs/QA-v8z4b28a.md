# QA — v8z4b28a auditar resolução e qualidade de render

## Base confirmada antes das alterações

- `APP_VERSION = v8z4b27i`.
- `APP_VERSION_NAME = v8z4b27i`.
- Texto visível em Configurações: `v8z4b27i`.
- Comentário/changelog do topo coerente com `v8z4b27i`.

## Engine Sprint — render Preview/Export

1. Problema exato: Preview podia renderizar em meia resolução e projetos completos com imagem podiam reamostrar/reduzir a fonte antes de render posterior.
2. Funções envolvidas: `setupPreviewCanvas`, `startPreview`, `togglePreviewPlayback`, `drawAtT`, `drawMirrorBg`, `hardResetCanvas`, `loadImage`, `doSaveDirect`, `applyProjectData`, `analyzeFrameResolutionQuality`.
3. Comportamento atual esperado antes da mudança: v8z4b27i funcional, mas com risco de perda de nitidez por canvas reduzido no Preview e por reamostragem em JSON completo.
4. Comportamento novo esperado: Preview e MP4 desenham direto de `imgEl` em resolução original disponível; Preview usa backing store final seguro; JSON completo preserva a fonte original carregada; diagnóstico informa limite real por frame.
5. Riscos: maior uso de memória no Preview por sair de meia resolução; JSON com imagem pode ficar maior ao preservar a imagem original; imagens enormes continuam limitadas pelo arquivo original e pelo tamanho final do vídeo.
6. Regressões a cobrir: Preview abre/fecha, MP4 gera, rotação/escala/curvas mantêm enquadramento, JSON salva/carrega, iPhone/Safari não apresenta tela preta/travamento/reload.

## Implementação estática concluída

- Versionamento atualizado para `v8z4b28a` no comentário do topo, constantes JS e texto visível.
- Preview passa a usar `PREVIEW_SCALE = 1`, mantendo o limite seguro dos tamanhos finais de `exportDims`.
- Contextos de canvas recebem helper comum para `imageSmoothingEnabled = true` e `imageSmoothingQuality = "high"`.
- Export/MP4 mantém `recCanvas` em pixels finais do vídeo e reaplica smoothing após reset, sem aplicar `devicePixelRatio`.
- Salvamento com imagem usa o data URL original da sessão, sem canvas intermediário reduzido.
- Carregamento de projeto com imagem embutida converte data URL diretamente em `File`, sem reencode JPEG por canvas.
- Diagnóstico interno expõe `window.analyzeProjectResolutionQuality()` e `window.analyzeFrameResolutionQuality(...)`, sem UI visível.

## Procedimento manual de comparação antes/depois

1. Usar uma imagem grande com detalhes finos: arte, ilustração, mapa, página, quadrinhos ou textura.
2. Criar pelo menos três frames: zoom leve, zoom médio e zoom forte/extremo.
3. Abrir Preview e comparar nitidez nas áreas de detalhe.
4. Gerar MP4 e comparar o enquadramento com o Preview.
5. Rodar `window.analyzeProjectResolutionQuality()` no console.
6. Confirmar que frames leves aparecem como `OK` ou `LIMITE` e que zoom extremo pode aparecer como `ACIMA_DO_LIMITE`.
7. Confirmar que a perda de nitidez restante corresponde ao limite real de pixels do arquivo original.

## Checklist obrigatório

### Versionamento

1. Confirmar versão visível `v8z4b28a`.
2. Confirmar `APP_VERSION = v8z4b28a`.
3. Confirmar `APP_VERSION_NAME = v8z4b28a`.
4. Confirmar changelog/comentário do topo atualizado.

### Imagem original

5. Carregar imagem grande.
6. Confirmar `naturalWidth`/`naturalHeight` corretos.
7. Confirmar que a fonte original não foi substituída por versão reduzida.
8. Confirmar que Preview/Export usam a fonte original.
9. Salvar JSON com imagem, carregar novamente e confirmar metadados corretos.

### Preview

10. Criar zoom leve.
11. Criar zoom médio.
12. Criar zoom forte.
13. Abrir Preview.
14. Confirmar que não há tela preta.
15. Confirmar que a qualidade não piorou.
16. Confirmar que movimento continua correto.
17. Confirmar que curvas continuam corretas.
18. Confirmar que rotação continua correta.

### MP4

19. Gerar MP4.
20. Confirmar que o vídeo é gerado.
21. Confirmar que não exporta overlays, menus ou handles.
22. Confirmar que a qualidade não piorou.
23. Confirmar que o enquadramento é igual ao Preview.
24. Confirmar que duração/fps/loop não mudaram.

### Diagnóstico

25. Rodar `window.analyzeProjectResolutionQuality()`.
26. Confirmar relatório por frame.
27. Confirmar que frames com zoom extremo aparecem como `ACIMA_DO_LIMITE`.
28. Confirmar que frames com zoom leve aparecem como `OK`.
29. Confirmar que o diagnóstico não altera o projeto.
30. Confirmar que não há alerta visual novo.

### Regressão geral

31. Carregar imagem.
32. Selecionar frame.
33. Mover frame.
34. Escala individual.
35. Rotação individual.
36. Seleção múltipla.
37. Escala multi-select.
38. Rotação multi-select.
39. Igualar.
40. Delta relativo.
41. Reset de rotação individual.
42. Inserir frame entre frames rotacionados.
43. Reset Project.
44. Salvar JSON.
45. Carregar JSON.
46. Preview abre/fecha.
47. MP4 gera.
48. Zoom/pan com dois dedos.
49. Ghost frame/inserção assistida.
50. Confirmar que menus continuam funcionando.

### iPhone/Safari

51. Testar em iPhone/Safari real.
52. Usar imagem grande.
53. Usar zoom forte.
54. Abrir Preview.
55. Gerar MP4.
56. Confirmar ausência de tela preta.
57. Confirmar ausência de travamento.
58. Confirmar ausência de reload do Safari.
59. Confirmar que toque/gestos continuam funcionando.
60. Confirmar que não há seleção nativa de texto/callout.
