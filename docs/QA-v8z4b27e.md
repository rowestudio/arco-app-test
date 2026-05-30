# QA — v8z4b27e corrigir menu contextual, primeiro selecionado, Pausa e Undo de Conter

## Base confirmada antes das alterações

- `APP_VERSION = v8z4b27d`.
- `APP_VERSION_NAME = v8z4b27d`.
- Texto visível em Configurações: `v8z4b27d`.

## Verificações estáticas executadas nesta entrega

- Versionamento atualizado para `v8z4b27e` no comentário do topo, constantes JS e texto visível.
- Menu contextual principal revisado para conter, nesta ordem, `Selecionar todos`, `Pausa`, `Escala`, `Rotação` e `Posição`.
- Menu contextual principal sem botão `Voltar` e sem texto de alvo/contador redundante.
- Subpainéis mantêm botão `Voltar` e texto do alvo da seleção.
- Seleção contextual passa a tratar `selectedFrames.size >= 1` como seleção visual válida para Stage e faixa de frames.
- Painel `Pausa` contextual mantém título, alvo, slider e valor, sem botão `Zerar`.
- `Conter na imagem` passa a entrar no estado de Undo/Redo por `captureState()`/`restoreState()`, incluindo o flag interno `containFrames`.
- Reset de projeto novo e carregamento de JSON limpam `containFrames` para evitar estado interno preso entre fluxos.
- Seleção contextual continua estado temporário de UI e não é serializada no JSON.
- Não houve alteração em `getStateAtT`, `drawAtT`, WebCodecs/export estrutural, curvas, zoom/pan ou inserção assistida.

## QA manual obrigatório pendente em iPhone/Safari

1. Confirmar `APP_VERSION = v8z4b27e`, `APP_VERSION_NAME = v8z4b27e` e versão visível `v8z4b27e`.
2. Selecionar apenas F2 e confirmar destaque laranja no Stage e na faixa.
3. Confirmar que F2 não fica apenas com visual branco de frame ativo.
4. Selecionar F3 também e confirmar F2/F3 com o mesmo padrão de selecionado.
5. Desselecionar F3 e confirmar que F2 continua laranja.
6. Abrir o menu contextual principal e confirmar ausência de `Voltar` e de `F2 selecionado` ou equivalente.
7. Confirmar `Selecionar todos` à esquerda e que tocar fora/stage fecha o menu.
8. Abrir Pausa/Escala/Rotação/Posição e confirmar que o texto do alvo aparece nos subpainéis e `Voltar` funciona ali.
9. Abrir Pausa e confirmar que o botão `Zerar` não existe, sem buraco visual, com slider funcionando e Undo consolidado ao fechar.
10. Tocar `Selecionar todos` e confirmar que o menu continua aberto e todos os frames ficam destacados no Stage e na faixa.
11. Salvar/carregar JSON e confirmar que a seleção não é restaurada.
12. Posicionar frame parcialmente fora, ativar `Conter na imagem`, usar Undo, mover/tocar o frame e confirmar que ele não pula de volta para dentro.
13. Usar Redo e confirmar que `Conter na imagem` reaplica de modo consistente.
14. Repetir `Conter na imagem` com mais de um frame quando aplicável.
15. Confirmar regressões: botão `Sel` não voltou, overlay externo múltiplo preservado, sem overlay laranja interno, caminhos/curvas visíveis, Preview abre/fecha, MP4 funciona, Reset limpa seleção, zoom/pan dois dedos funciona e ghost frame bloqueia menus externos.
