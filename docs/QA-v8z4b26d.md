# QA — v8z4b26d separar seleção simples e seleção múltipla

## Escopo

- Versão alvo: **v8z4b26d**.
- Base confirmada: **v8z4b26c** em `APP_VERSION`, `APP_VERSION_NAME`, texto visível de Configurações e comentário/changelog do topo antes da alteração.
- Correção focada em estado/UX/renderização da seleção múltipla: seleção simples mantém frame ativo com hierarquia e auto-center; seleção múltipla trata selecionados como grupo sem hierarquia individual.
- Sem alterações em Preview, MP4, JSON, motor de animação, curvas, duração, pausa, easing, loop, templates, sequência real dos frames ou dados internos permanentes.

## QA obrigatório

### Versionamento

- [x] Confirmar que `APP_VERSION` está em `v8z4b26d`.
- [x] Confirmar que `APP_VERSION_NAME` está em `simple and multi selection separation`.
- [x] Confirmar texto visível de versão em Configurações como `v8z4b26d`.

### Seleção simples

- [ ] Abrir projeto com pelo menos 5 frames em iPhone/Safari.
- [ ] Selecionar um único frame.
- [ ] Confirmar que o frame único continua vindo para o centro da faixa/painel de frames.
- [ ] Confirmar que o destaque normal de frame ativo permanece funcionando.

### Seleção múltipla sem hierarquia individual

- [ ] Entrar em seleção múltipla e selecionar 3 frames.
- [ ] Confirmar que os 3 ficam destacados como grupo.
- [ ] Confirmar que nenhum frame selecionado fica visualmente dominante sozinho.
- [ ] Confirmar que nenhum selecionado é puxado sozinho para frente.
- [ ] Confirmar que a faixa de frames não recentraliza no último frame tocado durante a seleção múltipla.
- [ ] Confirmar que frames não selecionados ficam mais apagados.

### Desseleção dentro da seleção múltipla

- [ ] Desselecionar um dos 3 frames.
- [ ] Confirmar que ele perde imediatamente stroke/halo/opacidade de selecionado.
- [ ] Confirmar que ele volta para a camada visual dos não selecionados.
- [ ] Confirmar que ele não fica preso na frente.
- [ ] Confirmar que os frames restantes continuam destacados como grupo.

### Transição múltipla para simples

- [ ] Desselecionar até sobrar apenas 1 frame.
- [ ] Confirmar que o app volta ao comportamento normal de seleção simples.
- [ ] Confirmar que o único frame restante pode voltar a ser tratado como frame ativo normal.

### Ações com seleção preservada

- [ ] Aplicar Alinhar em múltiplos selecionados.
- [ ] Desfazer.
- [ ] Aplicar Distribuir em múltiplos selecionados.
- [ ] Desfazer.
- [ ] Abrir Escala e confirmar que a seleção continua coerente.

### Não regressão

- [ ] Mover frame individual continua funcionando.
- [ ] Seleção simples continua funcionando.
- [ ] Seleção múltipla continua funcionando.
- [ ] Undo/Redo continua funcionando.
- [ ] Rodar Preview para confirmar ausência de regressão.
- [ ] Exportar MP4 curto para confirmar ausência de regressão.
- [ ] Exportar/importar JSON curto para confirmar que nenhuma ordem ou dado permanente foi alterado.
