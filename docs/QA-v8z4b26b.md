# QA — v8z4b26b remover Sel e mostrar seleção múltipla no Stage

## Escopo

- Versão alvo: **v8z4b26b**.
- Base confirmada: **v8z4b26a**, que já contém seleção múltipla temporária e aplicação em lote de Canto, Simétrico, Assimétrico e Desconectado.
- O botão visual `Sel` foi removido da faixa inferior de frames.
- Nenhum botão novo equivalente foi criado.
- A seleção múltipla continua temporária e não entra no JSON.
- Preview/MP4 ignoram seleção e marcações visuais.

## QA obrigatório

### Versionamento

- [x] Confirmar que `APP_VERSION` está em `v8z4b26b`.
- [x] Confirmar que `APP_VERSION_NAME` está em `remove Sel and show multi selection on Stage`.
- [x] Confirmar texto visível de versão em Configurações como `v8z4b26b`.

### Remoção do botão

- [x] Confirmar que não existe mais `btnMultiSelect` no HTML.
- [x] Confirmar que o texto visual `Sel` não aparece mais na faixa/menu inferior.
- [x] Confirmar que a faixa de frames não reserva slot vazio no lugar do botão removido.
- [x] Confirmar que nenhum botão novo equivalente foi criado.

### Seleção de frames

- [ ] Tocar em frames na faixa inferior e confirmar ativação normal do frame.
- [ ] Com seleção vazia, tocar uma vez no frame ativo e confirmar abertura do menu contextual como antes.
- [ ] Alternar seleção pelo segundo toque no frame ativo, sem botão dedicado.
- [ ] Alternar seleção por long press apenas como compatibilidade, sem depender exclusivamente dele.
- [ ] Com seleção iniciada, tocar outros frames na faixa e confirmar entrada/saída do lote.
- [ ] Remover um frame selecionado e confirmar que o frame ativo continua válido.
- [ ] Limpar seleção múltipla pela seta/voltar da barra contextual e confirmar seleção vazia.

### Stage

- [ ] Selecionar múltiplos frames pela faixa/menu de frames.
- [ ] Confirmar que todos os frames selecionados aparecem marcados no Stage.
- [ ] Confirmar que o frame ativo continua mais evidente que os selecionados.
- [ ] Confirmar que frame ativo + selecionado combina destaque ativo e indicação de seleção.
- [ ] Remover um frame da seleção e confirmar que sua marcação some do Stage.
- [ ] Limpar seleção múltipla e confirmar que nenhuma marcação residual fica no Stage.
- [ ] Trocar o frame ativo e confirmar atualização correta no Stage.

### Curvas em lote

- [ ] Selecionar múltiplos frames e aplicar Canto.
- [ ] Selecionar múltiplos frames e aplicar Simétrico.
- [ ] Selecionar múltiplos frames e aplicar Assimétrico.
- [ ] Selecionar múltiplos frames e aplicar Desconectado.
- [ ] Confirmar que apenas frames selecionados foram alterados.
- [ ] Confirmar que frames não selecionados permaneceram intactos.
- [ ] Sem múltiplos selecionados, confirmar que o modo afeta apenas o frame ativo.

### Undo/Redo e regressões

- [ ] Aplicar modo de curva em lote e confirmar que Undo desfaz o lote inteiro.
- [ ] Confirmar que Redo reaplica o lote inteiro.
- [ ] Confirmar Undo/Redo individual sem seleção múltipla.
- [ ] Confirmar Loop ligado com F1 + último frame selecionados nos quatro modos.
- [ ] Confirmar projeto novo com F1 assistido.
- [ ] Confirmar mínimo de 1 frame, Preview estático e MP4 com 1 frame.
- [ ] Confirmar Reset Project em projeto novo e JSON carregado.
- [ ] Confirmar bloqueios durante frame pendente/ghost e liberação após Confirmar/Cancelar.

### Preview / MP4 / JSON

- [ ] Abrir Preview com seleção múltipla ativa e confirmar funcionamento normal.
- [ ] Exportar MP4 com seleção múltipla ativa e confirmar funcionamento normal.
- [ ] Salvar JSON e confirmar que seleção múltipla não foi persistida.
- [ ] Carregar JSON e confirmar seleção múltipla limpa.
- [ ] Confirmar ausência de campos temporários de seleção no JSON.

### iPhone/Safari

- [ ] Testar toque nos frames da faixa inferior.
- [ ] Confirmar scroll horizontal da faixa.
- [ ] Confirmar zoom/pan com dois dedos no Stage.
- [ ] Confirmar ausência de seleção nativa/callout indesejado.
- [ ] Confirmar que toques na faixa não confundem seleção de frame com navegação do Stage.
