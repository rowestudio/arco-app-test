# QA pendente — v8z4b28f otimizar Preview com proxy e duração computada

## Base confirmada

- Base `v8z4b28e` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.

## Alterações estáticas verificadas

1. `APP_VERSION = v8z4b28f`.
2. `APP_VERSION_NAME = v8z4b28f`.
3. Versão visível do app atualizada para `v8z4b28f`.
4. Comentário/changelog do topo atualizado para `v8z4b28f`.
5. Preview passa a usar `getComputedTimelineDuration()` como fonte lógica de duração, preservando o campo salvo `duration` no JSON.
6. Export/MP4 também lê `getComputedTimelineDuration()` para manter a mesma duração lógica do Preview sem alterar resolução, qualidade ou fonte canônica do MP4.
7. `previewRenderSource` é criado/cacheado apenas para Preview, limitado por `PREVIEW_SOURCE_MAX_SIDE`, e cai para a fonte canônica se a criação falhar.
8. `canonicalRenderImage` continua sendo a fonte de Export/MP4; chamadas de export não passam `previewRenderSource` para `renderFrameSafely`.
9. Loops de Preview usam token `previewLoopToken` para ignorar rAF antigo.
10. Preview aplica throttle leve por `PREVIEW_TARGET_FRAME_MS`, mantendo avanço por timestamp atual do `requestAnimationFrame` e sem backlog de frames atrasados.
11. Logs de performance ficam atrás de `DEBUG_PREVIEW_PERF = false`.

## Checklist manual obrigatório

### Arquivo principal

1. Carregar `arco_diagramacao_i_ah8_c10_img 28e.json`.
2. Confirmar `version` salvo no JSON como `v8z4b28e` e `duration = 14`.
3. Abrir Preview.
4. Confirmar redução perceptível do engasgo em imagem PNG grande (~8000 × 5491 px).
5. Confirmar que o Preview percorre os 9 frames.
6. Confirmar que loop funciona.
7. Confirmar que pausas continuam funcionando.
8. Confirmar ausência de tela preta.
9. Confirmar que o Preview não tenta recuperar frames atrasados em backlog.

### Duração

1. Conferir duração computada pela timeline com segmentos, pausas e loop.
2. Confirmar que Preview usa duração computada quando aplicável.
3. Confirmar que Preview e MP4 têm a mesma duração lógica.
4. Confirmar que barra/progresso do Preview não salta por divergência entre `duration` salvo e timeline computada.

### Proxy de Preview

1. Confirmar que imagem grande gera `previewRenderSource`.
2. Confirmar que `previewRenderSource` não é recriado a cada frame.
3. Confirmar que `previewRenderSource` é invalidado ao trocar imagem.
4. Confirmar que `previewRenderSource` é invalidado ao carregar novo JSON com imagem.
5. Confirmar que Export/MP4 não usa `previewRenderSource`.

### MP4

1. Gerar MP4.
2. Confirmar que o MP4 continua correto.
3. Confirmar que o MP4 não perdeu qualidade.
4. Confirmar que o MP4 não usa preview proxy.
5. Confirmar que o MP4 não apresenta imagem resetada.
6. Confirmar que a geração não voltou a travar.

### Regressão geral

1. Testar imagem grande.
2. Testar imagem pequena.
3. Testar zoom forte.
4. Testar rotação.
5. Testar pausa.
6. Testar loop.
7. Testar JSON recarregado.
8. Testar gerar MP4 duas vezes.
9. Testar salvar no Rolo de Fotos e voltar ao app.
10. Testar fechar/reabrir Preview.
11. Testar trocar imagem.
12. Testar Reset Project.
13. Mover frame.
14. Escalar frame.
15. Rotacionar frame.
16. Seleção múltipla.
17. Salvar JSON.
18. Carregar JSON.
19. Zoom/pan com dois dedos.
20. Inserção assistida.
21. Preview abre/fecha.
22. MP4 gera.

### iPhone/Safari real

1. Testar obrigatoriamente em iPhone/Safari real antes de promover.
2. Confirmar que o Preview ficou mais fluido.
3. Confirmar que o app não recarrega.
4. Confirmar que MP4 continua estável.
5. Confirmar ausência de tela preta.
6. Confirmar ausência de travamento.
7. Confirmar que o app continua responsivo depois de voltar do Rolo de Fotos.
