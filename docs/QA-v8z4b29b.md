# QA pendente — v8z4b29b corrigir hierarquia dos menus contextuais

## Base e versionamento

- [x] Base `v8z4b29a` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] `APP_VERSION = v8z4b29b`.
- [x] `APP_VERSION_NAME = v8z4b29b`.
- [x] Versão visível do app atualizada para `v8z4b29b`.
- [x] Comentário/changelog do topo atualizado para `v8z4b29b`.

## Inventário de funções preservadas

- [x] Deletar frame continua acessível pelo menu contextual de frame no Stage.
- [x] Fixar/desfixar frame continua acessível pelo menu contextual de frame no Stage.
- [x] Curva continua acessível pelo menu contextual de frame no Stage e abre o menu atual de curvas/tipo de ponto.
- [x] Duração completa continua acessível no menu inferior Frame e Trecho.
- [x] Pausa de frames continua acessível no menu inferior Frame.
- [x] Rotação, Escala e Mover continuam acessíveis no menu inferior Frame.
- [x] Tempo do trecho e Movimento continuam acessíveis no menu inferior Trecho e chamam o mesmo painel atual de trecho/easing.
- [x] Fundo, Inverter e Formato continuam acessíveis em Arquivos/faixa superior.
- [x] Adicionar frame continua no botão `+` à esquerda da faixa de frames/trechos.
- [x] Arquivos, Visualizar, Preview, Undo e Redo continuam na faixa superior.

## QA obrigatório — pendente de validação manual completa

1. [x] Confirmar APP_VERSION = v8z4b29b.
2. [x] Confirmar APP_VERSION_NAME = v8z4b29b.
3. [x] Confirmar versão visível = v8z4b29b.
4. [x] Confirmar que Curva saiu da faixa superior.
5. [x] Confirmar que topo contém Voltar, Arquivos, Visualizar, Preview, Undo e Redo.
6. [ ] Confirmar que Visualizar funciona como hoje.
7. [ ] Confirmar que Preview funciona como hoje.
8. [ ] Confirmar Undo/Redo.
9. [ ] Clicar em frame mostra menu contextual no Stage.
10. [x] Menu aparece dentro do Stage, na parte inferior.
11. [x] Menu não sobrepõe a faixa de frames/trechos.
12. [x] Menu tem um único contêiner.
13. [x] Ícones não estão dentro de pills individuais.
14. [ ] Deletar funciona e o menu some.
15. [ ] Fixar funciona e o menu some.
16. [ ] Curva abre/substitui pelo menu de curvas e o menu contextual some.
17. [ ] Ao mover frame, o menu some.
18. [ ] Ao tocar fora, o menu some.
19. [ ] Ao selecionar trecho, o menu some.
20. [ ] Durante zoom/pan com dois dedos, o menu não abre indevidamente.
21. [x] Fundo está acessível no novo local.
22. [x] Inverter está acessível no novo local.
23. [x] Formato está acessível no novo local.
24. [ ] Fundo mantém função atual.
25. [ ] Inverter mantém função atual.
26. [ ] Formato mantém função atual.
27. [x] Sem seleção, aparece menu de Frame.
28. [x] Com frame selecionado, aparece menu de Frame.
29. [x] Duração completa aparece.
30. [x] Pausa de frames aparece.
31. [ ] Rotação aparece e funciona.
32. [ ] Escala aparece e funciona.
33. [ ] Mover aparece e funciona.
34. [x] Fundo/Inverter/Formato não aparecem no menu inferior de Frame.
35. [x] Tempo do trecho/Movimento não aparecem no menu de Frame.
36. [ ] Ao clicar em trecho, seleciona trecho.
37. [x] Clique em trecho não abre menu contextual legado automaticamente.
38. [x] Menu inferior muda para Trecho.
39. [x] Duração completa aparece.
40. [x] Tempo do trecho aparece.
41. [x] Movimento aparece.
42. [ ] Tempo do trecho abre o menu contextual de trecho atual.
43. [ ] Movimento abre o mesmo menu contextual de trecho atual.
44. [x] Funções de frame somem no contexto Trecho.
45. [x] Fundo/Inverter/Formato não aparecem no menu inferior de Trecho.
46. [x] Botão + fica fixo à esquerda.
47. [ ] Botão + adiciona frame como hoje.
48. [x] No menu Frame, trechos intermediários continuam visíveis.
49. [ ] Trechos intermediários continuam clicáveis.
50. [ ] Frames continuam clicáveis.
51. [ ] Duração completa continua como hoje.
52. [ ] Pausa de frames continua como hoje.
53. [ ] Menu contextual de trecho atual continua como hoje quando chamado por Tempo do trecho/Movimento.
54. [ ] Preview continua estável.
55. [ ] MP4 continua gerando.
56. [ ] JSON salva/carrega.
57. [ ] Zoom/pan funciona.
58. [ ] Inserção assistida funciona.
59. [ ] Seleção múltipla não foi quebrada.
60. [ ] Testar em iPhone/Safari real.
61. [ ] Confirmar toque nos ícones.
62. [ ] Confirmar que o menu contextual do Stage não conflita com drag.
63. [ ] Confirmar que não há sobreposição ruim na faixa inferior.
64. [ ] Confirmar que o Stage continua editável.

## Observação de ambiente

Os itens marcados como pendentes exigem execução manual no app, iPhone/Safari real ou geração real de MP4 fora deste ambiente automatizado.
