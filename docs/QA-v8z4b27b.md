# QA — v8z4b27b corrigir Pausa em lote sem incrementos fixos

Correção controlada a partir da v8z4b27a. O menu próprio de seleção múltipla permanece separado do menu normal de frames, mas o grupo Pausa deixa de usar atalhos rígidos de incremento e passa a usar um painel de lote com slider decimal baseado na lógica real de pausa do app.

## Base e versionamento

1. Confirmar base anterior `v8z4b27a`.
2. Confirmar `APP_VERSION = v8z4b27b`.
3. Confirmar `APP_VERSION_NAME = v8z4b27b`.
4. Confirmar texto visível de versão em Settings atualizado para `v8z4b27b`.

## Regressão de seleção múltipla

1. Confirmar que o botão `Sel` não voltou.
2. Confirmar que seleção múltipla continua funcionando por toque/long press compatível.
3. Confirmar que o overlay externo múltiplo continua funcionando.
4. Confirmar que não há overlay laranja interno.
5. Confirmar que caminho/curva continua visível.
6. Confirmar que seleção múltipla não é salva no JSON.

## Painel Pausa em seleção múltipla

1. Selecionar múltiplos frames.
2. Abrir `Pausa` no menu de seleção múltipla.
3. Confirmar que os botões `+0.5s` e `-0.5s` foram removidos.
4. Confirmar que não há botões fixos de incremento de pausa.
5. Confirmar que o painel usa slider decimal com mínimo `0`, máximo e passo existentes do controle real de pausa.
6. Confirmar que valores decimais como `0.5s`, `0.6s` e `0.7s` podem ser escolhidos quando permitidos pelo controle.
7. Confirmar que não há restrição indevida a números inteiros.

## Aplicar aos selecionados

1. Selecionar múltiplos frames.
2. Escolher pausa `0.5s` no slider.
3. Acionar `Aplicar aos selecionados`.
4. Confirmar que apenas os frames selecionados recebem `0.5s`.
5. Confirmar que frames não selecionados não mudam.
6. Repetir com `0.6s` e `0.7s`.
7. Confirmar que a seleção múltipla continua ativa após aplicar.

## Zerar

1. Selecionar múltiplos frames com pausas diferentes.
2. Acionar `Zerar` no painel Pausa em lote.
3. Confirmar que apenas os selecionados ficam com pausa `0`.
4. Confirmar que frames não selecionados não mudam.

## Igualar ao ativo

1. Definir pausa diferente no frame ativo.
2. Selecionar múltiplos frames.
3. Acionar `Igualar ao ativo`.
4. Confirmar que selecionados recebem a pausa do ativo.
5. Confirmar que não selecionados não mudam.

## Undo/Redo

1. Aplicar valor aos selecionados.
2. Usar Undo e confirmar que todas as pausas anteriores voltam juntas.
3. Usar Redo e confirmar que todas reaplicam juntas.
4. Repetir com `Zerar`.
5. Repetir com `Igualar ao ativo`.
6. Confirmar que não é criado um Undo por frame.

## Preview / MP4 / JSON / Reset

1. Aplicar pausas em lote e abrir Preview; confirmar timing atualizado.
2. Exportar MP4; confirmar timing atualizado e ausência de overlays/marcações de seleção.
3. Salvar JSON, carregar JSON e confirmar que pausas foram preservadas.
4. Confirmar que seleção múltipla não foi preservada no JSON.
5. Usar Reset Project e confirmar que pausas voltam ao baseline correto e seleção múltipla é limpa.

## Inserção assistida e iPhone/Safari

1. Durante frame pendente/ghost, confirmar que o painel Pausa em lote fica bloqueado.
2. Confirmar/cancelar ghost e confirmar que a interface volta ao normal.
3. Testar em iPhone/Safari real.
4. Confirmar que o painel é tocável, respeita área segura, não cria scroll interno ruim e não quebra scroll horizontal da faixa.
5. Confirmar que zoom/pan com dois dedos continua funcionando.
