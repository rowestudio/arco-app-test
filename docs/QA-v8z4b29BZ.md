# QA — v8z4b29BZ: ajustes visuais da Edição de Tempo e Movimento

## Validação obrigatória em iPhone/Safari real

1. Abrir Edição de Tempo > Tempo.
2. Confirmar que o bloco grande duplicado de duração foi removido.
3. Confirmar que o box de resumo continua correto.
4. Confirmar que “Velocidade constante” está mais separado do resumo.
5. Confirmar que a legenda aparece sempre com o texto: “Mantém o movimento em ritmo uniforme entre os frames.”
6. Confirmar que filtros Todos / Frames / Trechos aparecem acima de Cena 1.
7. Confirmar que Cena 1 aparece como bloco da lista.
8. Confirmar que o ícone de trecho está cerca de 30% menor.
9. Confirmar que ícone de trecho e ícone de frame usam mesma linguagem de borda/cor.
10. Confirmar que números de frame e trecho usam a mesma cor.
11. Confirmar que botões grandes usam fundo #5b5b5b.
12. Confirmar que botões grandes não usam borda grossa.
13. Confirmar que botões estão um pouco mais finos e com mais respiro.
14. Confirmar que inputs estão menores, mais próximos do label e com fundo diferente dos botões.
15. Confirmar que Tremor Global em Preferências tem hierarquia de controle, não de explicação.
16. Confirmar que Tremor Global no painel contextual não está duplicado.
17. Confirmar que toggles estão 20% a 25% maiores e mais visíveis.
18. Confirmar que Movimento inteligente, Tremor Global e Velocidade constante usam toggles consistentes.
19. Confirmar que Aplicar aos 3 e Resetar curva estão visualmente padronizados.
20. Confirmar que nada foi alterado em preview/export/JSON.
21. Confirmar que não houve regressão na lógica do Tremor.
22. Confirmar que não houve regressão na Pausa Global.

## Pausa Global — verificação obrigatória

- Global desligado: pausa edita apenas o frame atual.
- Global ligado antes de mexer no slider: slider continua funcionando e aplica a todos os frames.
- Usuário ajusta primeiro e liga Global depois: valor atual é aplicado a todos, preservando a regra da v8z4b29BY.
- Não pode travar no iPhone/Safari.
- Preview/export e JSON devem respeitar os valores.

## Observação de escopo

A v8z4b29BZ não altera motor, Tremor conceitual, Movimento Inteligente, Velocidade Constante, Preview/export, JSON, launcher, upload ou fluxo de projeto.
