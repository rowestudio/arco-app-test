# QA — v8z4b27c simplificar Pausa em seleção múltipla

Correção controlada a partir da v8z4b27b. O painel Pausa da seleção múltipla passa a se comportar como um painel de pausa normal aplicado à seleção atual: mostra os frames afetados, mantém slider decimal, usa `Definir pausa` como ação principal e deixa `Zerar` como ação secundária.

## Base e versionamento

1. Confirmar base anterior `v8z4b27b`.
2. Confirmar `APP_VERSION = v8z4b27c`.
3. Confirmar `APP_VERSION_NAME = v8z4b27c`.
4. Confirmar texto visível de versão em Settings atualizado para `v8z4b27c`.

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
3. Confirmar que o painel mostra o título `Pausa`.
4. Confirmar que o painel mostra quais frames estão afetados, por exemplo `F1, F2 selecionados`, `F1, F2, F4 selecionados` ou `4 frames selecionados`.
5. Confirmar que não existe mais `Igualar ao ativo`.
6. Confirmar que não existe mais botão grande `Aplicar aos selecionados` com esse texto.
7. Confirmar que não existem botões fixos `+0.5s`/`-0.5s`.
8. Confirmar que o painel usa slider decimal com mínimo, máximo e passo existentes do controle real de pausa.
9. Confirmar que valores decimais como `0.4s`, `0.6s` e `0.7s` podem ser escolhidos quando permitidos pelo controle.
10. Confirmar que a interface está mais simples e legível.

## Definir pausa

1. Selecionar F1 e F2.
2. Escolher pausa `0.4s` no slider.
3. Acionar `Definir pausa`.
4. Confirmar que F1 e F2 ficam com `0.4s`.
5. Confirmar que F3, F4 etc. não mudam.
6. Repetir com outro valor decimal permitido.
7. Confirmar que a seleção múltipla continua ativa após definir pausa.

## Reset/Zerar

1. Selecionar múltiplos frames com pausas diferentes.
2. Acionar `Zerar` no painel Pausa em lote.
3. Confirmar que apenas os selecionados ficam com pausa `0`.
4. Confirmar que frames não selecionados não mudam.
5. Confirmar que Undo desfaz o reset como uma única ação.

## Adicionar pausa

1. Confirmar que `Adicionar` não foi misturado ao painel principal de `Definir pausa` nesta versão.
2. Registrar como próximo passo: se implementado futuramente, deve abrir modo/painel separado chamado `Adicionar pausa` e somar o valor escolhido à pausa atual de cada frame selecionado.

## Undo/Redo

1. Definir pausa nos selecionados.
2. Usar Undo e confirmar que todos os valores anteriores voltam juntos.
3. Usar Redo e confirmar que todos reaplicam juntos.
4. Repetir com `Zerar`.
5. Confirmar que não é criado um Undo por frame nem por micro-movimento do slider.

## Preview / MP4 / JSON / Reset

1. Aplicar pausa em lote e abrir Preview; confirmar timing atualizado.
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
