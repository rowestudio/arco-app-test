# QA — v8z4b26c seleção múltipla sem destaque dominante e curva em lote preservada

## Escopo

- Versão alvo: **v8z4b26c**.
- Base confirmada: **v8z4b26b**, com botão `Sel` removido e seleção múltipla visível no Stage.
- Correção focada em seleção múltipla: não trazer o último frame tocado para frente, não manter destaque dominante do frame ativo no Stage e não limpar seleção antes de aplicar modo de curva.
- Sem alterações em Preview, MP4, JSON, motor de animação, zoom/pan, gestos de dois dedos, layout geral, cores globais, ícones ou textos além de versionamento/documentação.

## QA obrigatório

### Versionamento

- [x] Confirmar que `APP_VERSION` está em `v8z4b26c`.
- [x] Confirmar que `APP_VERSION_NAME` está em `multi selection batch curve UX fix`.
- [x] Confirmar texto visível de versão em Configurações como `v8z4b26c`.

### Regressão da v8z4b26b

- [x] Confirmar que não existe `btnMultiSelect` no HTML.
- [x] Confirmar que o botão visual `Sel` não voltou.
- [x] Confirmar que nenhum botão novo equivalente foi criado.
- [ ] Confirmar que a forma atual de seleção múltipla continua funcionando pelos próprios frames na faixa/menu.
- [ ] Confirmar que frames selecionados aparecem no Stage.
- [ ] Confirmar que é possível remover frames da seleção.
- [ ] Confirmar que é possível limpar a seleção múltipla.

### Bug 1 — Stage não deve trazer frame para frente durante seleção múltipla

- [ ] Criar ou usar frames sobrepostos.
- [ ] Selecionar vários frames.
- [ ] Confirmar que o último frame tocado não é trazido automaticamente para frente.
- [ ] Confirmar que a ordem visual dos frames permanece estável durante seleção múltipla.
- [ ] Confirmar que o último frame selecionado não fica visualmente mais importante que os demais.
- [ ] Confirmar que o destaque dominante do frame ativo é suprimido no Stage durante seleção múltipla.
- [ ] Confirmar que todos os frames selecionados têm destaque uniforme.
- [ ] Confirmar que frames não selecionados não recebem destaque de seleção.
- [ ] Sair da seleção múltipla.
- [ ] Confirmar que a edição individual volta a destacar normalmente o frame ativo.
- [ ] Confirmar que, fora da seleção múltipla, o comportamento normal de trazer frame ativo para frente continua, se já existia.

### Bug 2 — seleção não deve ser limpa ao aplicar modo de curva

- [ ] Selecionar múltiplos frames.
- [ ] Abrir/aplicar Canto.
- [ ] Confirmar que a seleção não é limpa antes da aplicação.
- [ ] Confirmar que Canto foi aplicado a todos os frames selecionados.
- [ ] Confirmar que frames não selecionados permaneceram intactos.
- [ ] Repetir com Simétrico.
- [ ] Repetir com Assimétrico.
- [ ] Repetir com Desconectado.
- [ ] Confirmar que a seleção permanece visível após aplicar o modo, salvo ação explícita de limpar.
- [ ] Confirmar que, sem múltiplos selecionados, o modo continua afetando apenas o frame ativo como antes.

### Undo/Redo

- [ ] Aplicar modo de curva em lote.
- [ ] Usar Undo.
- [ ] Confirmar que todos os frames afetados voltam juntos.
- [ ] Usar Redo.
- [ ] Confirmar que todos os frames afetados reaplicam juntos.
- [ ] Confirmar que Undo/Redo individual continua funcionando.

### Loop

- [ ] Ativar Loop.
- [ ] Selecionar F1 + último frame.
- [ ] Aplicar Canto.
- [ ] Aplicar Simétrico.
- [ ] Aplicar Assimétrico.
- [ ] Aplicar Desconectado.
- [ ] Confirmar que o fechamento do Loop continua coerente.
- [ ] Confirmar que não voltou bug de extremidade/handle funcionando só de um lado.

### Regressão da base estável

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

### Preview / MP4 / JSON

- [ ] Abrir Preview com seleção múltipla ativa.
- [ ] Confirmar que Preview funciona normalmente.
- [ ] Confirmar que Preview não mostra marcações de seleção.
- [ ] Exportar MP4.
- [ ] Confirmar que MP4 funciona normalmente.
- [ ] Confirmar que MP4 não mostra marcações de seleção.
- [ ] Salvar JSON.
- [ ] Carregar JSON.
- [ ] Confirmar que seleção múltipla não foi persistida.
- [ ] Confirmar que não há campos temporários de seleção no JSON.

### iPhone/Safari

- [ ] Testar toque nos frames da faixa inferior.
- [ ] Confirmar que scroll horizontal da faixa continua funcionando.
- [ ] Confirmar que zoom/pan com dois dedos no Stage continua funcionando.
- [ ] Confirmar que não há seleção nativa de texto/callout indesejado.
- [ ] Confirmar que toque para selecionar múltiplos frames não interfere com navegação do Stage.
- [ ] Confirmar que seleção múltipla continua utilizável em tela pequena.
