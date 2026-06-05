# QA pendente — v8z4b29c refinar topo, Arquivos e seleção frame/trecho

## Base e versionamento

- [x] Base `v8z4b29b` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- [x] `APP_VERSION = v8z4b29c`.
- [x] `APP_VERSION_NAME = v8z4b29c`.
- [x] Versão visível do app atualizada para `v8z4b29c`.
- [x] Comentário/changelog do topo atualizado para `v8z4b29c`.

## Inventário estático de preservação

- [x] Templates, Carregar imagem, Salvar projeto e Carregar projeto continuam acessíveis no painel Arquivos.
- [x] Fundo, Inverter, Formato e Conter na imagem continuam acessíveis no painel Arquivos.
- [x] Reset e Recarregar app continuam acessíveis no painel Arquivos.
- [x] Duração, Pausa, Rotação, Escala e Mover continuam acessíveis no menu inferior de Frame.
- [x] Duração, Tempo do trecho e Movimento continuam acessíveis no menu inferior de Trecho.
- [x] Deletar frame, Fixar e Curva continuam acessíveis no menu contextual de frame no Stage.
- [x] Adicionar frame continua no botão `+` fixo à esquerda da faixa de frames/trechos.
- [x] Visualizar, Preview, Undo e Redo continuam na faixa superior.

## Checklist obrigatório

1. [x] Confirmar APP_VERSION = v8z4b29c.
2. [x] Confirmar APP_VERSION_NAME = v8z4b29c.
3. [x] Confirmar versão visível = v8z4b29c.
4. [x] Confirmar que os ícones do topo não têm texto visível.
5. [x] Confirmar que Preview está em pill destacada.
6. [x] Confirmar espaçamento depois de Voltar.
7. [x] Confirmar espaçamento depois de Arquivos.
8. [ ] Confirmar Visualizar funciona.
9. [ ] Confirmar Preview funciona.
10. [ ] Confirmar Undo/Redo.
11. [ ] Confirmar que o menu Arquivos abre.
12. [ ] Confirmar que o menu Arquivos fecha facilmente.
13. [x] Confirmar que o botão de fechar fica visível.
14. [x] Confirmar que o menu não fica alto demais.
15. [x] Confirmar que os itens aparecem lado a lado.
16. [x] Confirmar blocos por tema: criação, projeto, aparência e manutenção.
17. [ ] Confirmar Templates funciona, se existir.
18. [ ] Confirmar Carregar imagem funciona.
19. [ ] Confirmar Salvar projeto funciona.
20. [ ] Confirmar Carregar projeto funciona.
21. [ ] Confirmar Fundo funciona.
22. [ ] Confirmar Inverter funciona.
23. [x] Confirmar Formato usa ícone proportions.
24. [ ] Confirmar Reset funciona.
25. [ ] Confirmar Recarregar app funciona.
26. [x] Confirmar Duração usa lucide clipboard-clock.
27. [x] Confirmar Duração não mostra estado/valor.
28. [x] Confirmar Formato usa lucide proportions.
29. [x] Confirmar Deletar frame usa lucide trash.
30. [ ] Selecionar frame.
31. [x] Confirmar que nenhum trecho fica selecionado ao mesmo tempo.
32. [ ] Selecionar trecho.
33. [x] Confirmar que nenhum frame fica selecionado visualmente como ativo ao mesmo tempo.
34. [ ] Alternar várias vezes frame/trecho.
35. [x] Confirmar que menus alternam corretamente por estado.
36. [x] Confirmar que não há destaque simultâneo conflituoso.
37. [ ] Selecionar frame abre menu contextual no Stage.
38. [x] Deletar usa ícone trash e mantém chamada existente.
39. [ ] Fixar funciona.
40. [ ] Curva abre menu de curvas.
41. [x] Ao selecionar trecho, menu contextual de frame some.
42. [x] Com frame selecionado, mostrar Duração, Pausa, Rotação, Escala, Mover.
43. [x] Com trecho selecionado, mostrar Duração, Tempo do trecho, Movimento.
44. [x] Fundo/Inverter/Formato não aparecem no menu inferior.
45. [x] Adicionar não aparece no menu inferior.
46. [x] Botão + fica à esquerda.
47. [ ] Botão + adiciona frame.
48. [x] Trechos intermediários continuam visíveis.
49. [ ] Trechos intermediários continuam clicáveis.
50. [ ] Frames continuam clicáveis.
51. [ ] Duração completa abre como hoje.
52. [ ] Pausa funciona como hoje.
53. [ ] Tempo do trecho abre menu contextual de trecho atual.
54. [ ] Movimento abre o mesmo menu contextual de trecho atual.
55. [ ] Preview continua estável.
56. [ ] MP4 continua gerando.
57. [ ] JSON salva/carrega.
58. [ ] Zoom/pan funciona.
59. [ ] Inserção assistida funciona.
60. [ ] Seleção múltipla não foi quebrada.
61. [ ] Testar em iPhone/Safari real.
62. [ ] Confirmar botões tocáveis.
63. [ ] Confirmar menu Arquivos fechável.
64. [ ] Confirmar que não há sobreposição ruim.
65. [ ] Confirmar que Stage continua editável.

## Observações

- Verificações marcadas como pendentes exigem execução manual/interativa em navegador ou iPhone/Safari real.
- Nenhuma função nova foi adicionada; os acessos existentes foram preservados e alguns foram apenas reorganizados visualmente dentro do painel Arquivos.
