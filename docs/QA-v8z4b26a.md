# QA — v8z4b26a seleção múltipla e modo de curva em lote

## Status

- Versão alvo: **v8z4b26a**.
- Base funcional conferida antes do patch: **v8z4b25h**.
- Escopo: seleção múltipla explícita de frames e aplicação em lote dos modos de ponto/curva.
- Seleção múltipla é estado temporário de edição e não entra no JSON.

## Checklist obrigatório

### Base/versionamento

- [x] Confirmar que `APP_VERSION` está em `v8z4b26a`.
- [x] Confirmar que `APP_VERSION_NAME` está em `multi frame selection and batch point mode`.
- [x] Confirmar texto visível de versão em Configurações como `v8z4b26a`.
- [x] Confirmar que o app não mantém `v8z4b25h` como versão funcional atual.

### Regressão v8z4b25h

- [ ] Projeto novo inicia com F1 assistido.
- [ ] Mínimo de 1 frame continua válido.
- [ ] Projeto com 1 frame abre Preview como vídeo estático.
- [ ] MP4 com 1 frame continua funcionando.
- [ ] Reset Project em projeto novo volta para F1 assistido.
- [ ] Reset Project em JSON carregado volta para o estado carregado.
- [ ] Inserção assistida bloqueia ações externas durante frame pendente.
- [ ] Painel de Duração não abre durante frame pendente.
- [ ] Confirmar frame pendente libera a interface.
- [ ] Cancelar frame pendente libera a interface.

### Seleção múltipla

- [ ] Entrar no modo seleção múltipla pelo botão `Sel` na faixa de frames.
- [ ] Selecionar dois frames por toque.
- [ ] Selecionar três ou mais frames por toque.
- [ ] Remover um frame da seleção por novo toque.
- [ ] Sair do modo seleção múltipla pelo botão `Sel`.
- [ ] Confirmar que o frame ativo continua válido.
- [ ] Confirmar que seleção individual normal continua funcionando fora do modo múltiplo.

### Aplicação de modo de curva em lote

- [ ] Selecionar múltiplos frames e aplicar Canto.
- [ ] Selecionar múltiplos frames e aplicar Simétrico.
- [ ] Selecionar múltiplos frames e aplicar Assimétrico.
- [ ] Selecionar múltiplos frames e aplicar Desconectado.
- [ ] Confirmar que apenas os frames selecionados foram alterados.
- [ ] Confirmar que frames não selecionados permanecem intactos.
- [ ] Confirmar que, sem múltiplos selecionados, o modo afeta apenas o frame ativo como antes.

### Loop

- [ ] Testar aplicação em lote envolvendo F1 e último frame com Loop ligado.
- [ ] Confirmar que o fechamento de loop continua coerente.
- [ ] Confirmar que os modos Canto/Simétrico/Assimétrico/Desconectado continuam consistentes nas extremidades.

### Undo/Redo

- [ ] Aplicar modo em lote e usar Undo.
- [ ] Confirmar que todos os frames afetados voltam juntos.
- [ ] Usar Redo.
- [ ] Confirmar que todos os frames afetados reaplicam juntos.
- [ ] Confirmar que Undo/Redo individual continua funcionando.

### Preview/MP4/JSON

- [ ] Abrir Preview após seleção múltipla.
- [ ] Confirmar que Preview ignora seleção visual e anima normalmente.
- [ ] Exportar MP4.
- [ ] Confirmar que MP4 não é afetado por seleção múltipla.
- [ ] Salvar JSON.
- [ ] Carregar JSON.
- [ ] Confirmar que seleção múltipla não fica persistida indevidamente.
- [ ] Confirmar estrutura JSON sem campos temporários desnecessários.

### Gestos iPhone/Safari

- [ ] Testar zoom/pan com dois dedos no Stage.
- [ ] Confirmar que não há conflito com seleção múltipla.
- [ ] Testar toque em frames na faixa.
- [ ] Confirmar que scroll horizontal da faixa continua funcionando no iPhone/Safari.

## Observações de implementação

- O botão explícito `Sel` evita depender de long press no iPhone/Safari.
- A aplicação em lote usa a mesma função individual `applyPointModeForFrame()` e um único `pushUndo()` por ação.
- Durante frame pendente/ghost, a seleção múltipla e a aplicação em lote ficam bloqueadas pela guarda global existente.
