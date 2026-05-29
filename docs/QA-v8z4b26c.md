# QA — v8z4b26c leitura visual da seleção múltipla no Stage

## Escopo

- Versão alvo: **v8z4b26c**.
- Base solicitada: **v8z4b26b**; no repositório de teste, a árvore já estava marcada como `v8z4b26c` antes desta correção visual.
- Correção focada em renderização do Stage: selecionados em camada visual superior como grupo, não selecionados mais apagados e frame ativo sem domínio excessivo dentro da seleção múltipla.
- Sem alterações em Preview, MP4, JSON, motor de animação, curvas, duração, pausa, easing, loop, escala, rotação, templates, layout geral ou menus não relacionados.

## QA obrigatório

### Versionamento

- [x] Confirmar que `APP_VERSION` está em `v8z4b26c`.
- [x] Confirmar que `APP_VERSION_NAME` está em `multi selection visual hierarchy`.
- [x] Confirmar texto visível de versão em Configurações como `v8z4b26c`.

### Seleção múltipla no Stage

- [ ] Abrir projeto com pelo menos 5 frames.
- [ ] Selecionar 3 frames próximos/sobrepostos.
- [ ] Confirmar que os 3 frames selecionados ficam claramente destacados.
- [ ] Confirmar que os 3 selecionados aparecem visualmente acima dos não selecionados.
- [ ] Confirmar que frames não selecionados continuam visíveis, porém mais apagados.
- [ ] Confirmar que o último frame tocado/ativo não é o único visualmente dominante.
- [ ] Confirmar que a ordem relativa entre os selecionados permanece coerente e não altera a timeline.
- [ ] Sair da seleção múltipla e confirmar que todos os frames voltam à aparência normal.

### Ações com seleção preservada

- [ ] Aplicar Alinhar nos frames selecionados e confirmar que a ação afeta o grupo.
- [ ] Desfazer.
- [ ] Aplicar Distribuir nos frames selecionados e confirmar que a ação afeta o grupo.
- [ ] Desfazer.
- [ ] Abrir Escala e confirmar que a seleção permanece coerente até a ação do usuário.

### Não regressão

- [ ] Mover frame individual fora da seleção múltipla continua funcionando.
- [ ] Seleção simples continua funcionando como antes.
- [ ] Seleção múltipla continua funcionando.
- [ ] Undo/Redo não é afetado pela mudança visual.
- [ ] Rodar Preview e confirmar que o motor permanece igual.
- [ ] Exportar MP4 curto e confirmar ausência de regressão.
- [ ] Exportar/importar JSON curto e confirmar que nenhuma ordem ou dado permanente foi alterado.
