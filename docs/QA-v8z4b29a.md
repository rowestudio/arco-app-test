# QA pendente — v8z4b29a reorganizar menus contextuais da interface

## Base obrigatória
- [x] Base `v8z4b28f` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] `APP_VERSION = v8z4b29a`.
- [x] `APP_VERSION_NAME = v8z4b29a`.
- [x] Versão visível do app atualizada para `v8z4b29a`.
- [x] Comentário/changelog do topo atualizado para `v8z4b29a`.

## Inventário antes/depois
| Função antiga | Novo local | Status |
| --- | --- | --- |
| Voltar/fechar painel | Faixa do topo | OK |
| Visualizar/Mapa | Faixa do topo | OK |
| Preview | Faixa do topo | OK |
| Undo | Faixa do topo | OK |
| Redo | Faixa do topo | OK |
| Salvar projeto/JSON | Menu Arquivos | OK |
| Abrir/Carregar projeto/JSON | Menu Arquivos | OK |
| Imagem | Menu Arquivos e upload inicial legado | OK |
| Templates | Menu Arquivos | OK |
| Reset | Menu Arquivos | OK |
| Recarregar | Menu Arquivos | OK |
| Exportar/MP4 | Tela de Preview existente | OK |
| Adicionar frame / `+` | Botão fixo à esquerda da faixa de frames/trechos | OK |
| Selecionar frame | Frame no Stage ou pill de frame | OK |
| Deletar frame / `-` | Menu contextual de frame no Stage | OK |
| Fixar/desfixar frame | Menu contextual de frame no Stage | OK |
| Editar tipo de curva/ponto | Menu contextual de frame no Stage | OK |
| Pausa de frames | Menu inferior contextual — Frame | OK |
| Rotação | Menu inferior contextual — Frame | OK |
| Escala | Menu inferior contextual — Frame | OK |
| Mover/Posição | Menu inferior contextual — Frame | OK |
| Selecionar trecho | Pill de trecho na faixa de frames/trechos | OK |
| Menu contextual atual de trecho | Ícones Tempo do trecho e Movimento | OK |
| Duração de trecho | Painel atual de trecho/easing chamado pelos ícones | OK |
| Movimento/easing/movimento inteligente existente | Painel atual de trecho/easing chamado pelos ícones | OK |
| Duração completa | Menu inferior contextual, sempre disponível | OK |
| Pausas por frame | Painel Duração existente e Pausa contextual de frame | OK |
| Duração dos trechos | Painel Duração existente e painel atual de trecho | OK |
| Loop/acabamento | Painel Duração existente | OK |
| Duração total | Painel Duração existente | OK |
| Fundo / cor de fundo | Menu inferior contextual | OK |
| Inverter | Menu inferior contextual | OK |
| Formato | Menu inferior contextual | OK |
| Zoom/pan | Controles e gestos existentes do Stage | OK |
| Seleção múltipla | Fluxo legado preservado | OK |
| Inserção assistida | Botão `+` preservado | OK |

## Checklist obrigatório
1. [x] Confirmar APP_VERSION = v8z4b29a.
2. [x] Confirmar APP_VERSION_NAME = v8z4b29a.
3. [x] Confirmar versão visível no app = v8z4b29a.
4. [x] Confirmar changelog/topo atualizado.
5. [x] Listar funções existentes antes.
6. [x] Mapear onde cada função ficou depois.
7. [x] Confirmar que nenhuma função desapareceu por inspeção estática.
8. [x] Nenhuma função ficou sem destino claro; Export/MP4 permanece na tela de Preview existente.
9. [ ] Voltar funciona em dispositivo real.
10. [ ] Arquivos abre funções de arquivo/projeto em dispositivo real.
11. [ ] Visualizar funciona como hoje em dispositivo real.
12. [ ] Preview funciona como hoje em dispositivo real.
13. [ ] Undo funciona em dispositivo real.
14. [ ] Redo funciona em dispositivo real.
15. [ ] Salvar funciona em dispositivo real.
16. [ ] Abrir funciona em dispositivo real.
17. [ ] Imagem funciona em dispositivo real.
18. [ ] Templates funciona em dispositivo real.
19. [ ] Reset funciona como hoje em dispositivo real.
20. [ ] Recarregar recarrega o app como hoje em dispositivo real.
21. [ ] JSON funciona em dispositivo real.
22. [ ] Export/MP4 continua acessível na tela de Preview existente.
23. [x] Botão `+` fica fixo à esquerda por inspeção estática.
24. [x] Botão `+` chama `insertFrameAfterActive()` como hoje.
25. [x] Frames continuam selecionáveis por inspeção estática.
26. [x] Trechos continuam selecionáveis por inspeção estática.
27. [x] Clicar em trecho não abre automaticamente o menu contextual legado; apenas seleciona o trecho.
28. [x] Clicar em frame no Stage chama menu contextual do Stage por inspeção estática.
29. [x] Menu contextual do frame fica acima da faixa de frames/trechos por CSS.
30. [x] Deletar frame chama `deleteActiveFrame()`.
31. [x] Fixar/desfixar chama `toggleFrameLock()`.
32. [x] Editar tipo de curva/ponto chama o menu existente de modo de ponto.
33. [x] Ao começar mover/rotacionar/redimensionar frame, o menu some por inspeção estática.
34. [x] Ao tocar fora, handler existente fecha o menu contextual inferior/stage.
35. [x] Ao selecionar trecho, menu de frame desaparece.
36. [x] Em Preview, menu de frame não abre e é ocultado ao iniciar Preview.
37. [x] Em inserção assistida, menu de frame não abre.
38. [x] Durante zoom/pan com dois dedos, guard de navegação impede abertura do menu.
39. [x] Com frame selecionado, aparecem funções de frame por classes contextuais.
40. [x] Duração completa aparece no menu contextual.
41. [x] Pausa de frames aparece e chama a lógica existente.
42. [x] Rotação chama a lógica existente.
43. [x] Escala chama a lógica existente.
44. [x] Mover chama a lógica existente.
45. [x] Fundo chama `openPanel('BgColor')`.
46. [x] Inverter chama `invertFrames()`.
47. [x] Formato chama `openPanel('Format')`.
48. [x] Funções de trecho ficam ocultas no contexto de frame.
49. [x] Com trecho selecionado, aparecem funções de trecho por classes contextuais.
50. [x] Funções de frame desaparecem no contexto de trecho.
51. [x] Duração completa aparece no contexto de trecho.
52. [x] Ícone Tempo do trecho aparece.
53. [x] Ícone Movimento aparece.
54. [x] Tempo do trecho abre o painel contextual de trecho atual.
55. [x] Movimento abre o mesmo painel contextual de trecho atual.
56. [x] Painel contextual de trecho mantém a lógica atual por reutilização de `openPanel('Ease')`.
57. [x] Fundo funciona por chamada existente.
58. [x] Inverter funciona por chamada existente.
59. [x] Formato funciona por chamada existente.
60. [x] Menu completo de Duração continua disponível via `openPanel('Duration')`.
61. [ ] Pausas por frame continuam funcionando em teste real.
62. [ ] Duração dos trechos continua funcionando em teste real.
63. [ ] Loop/acabamento continuam funcionando em teste real.
64. [ ] Duração total continua funcionando em teste real.
65. [x] Nada no cálculo de tempo foi alterado por inspeção do diff.
66. [ ] Preview abre em teste real.
67. [ ] Preview fecha em teste real.
68. [ ] Preview continua estável em teste real.
69. [ ] MP4 gera em teste real.
70. [ ] MP4 não trava em teste real.
71. [ ] MP4 não dá tela preta em teste real.
72. [ ] MP4 não perdeu qualidade em teste real.
73. [x] MP4 não usa proxy de Preview por ausência de alterações no pipeline.
74. [ ] Carregar imagem grande.
75. [ ] Carregar imagem pequena.
76. [ ] Salvar JSON.
77. [ ] Carregar JSON.
78. [ ] Zoom/pan com dois dedos.
79. [ ] Seleção múltipla.
80. [ ] Inserção assistida.
81. [ ] Rotação/escala/mover frame.
82. [ ] Pausa.
83. [ ] Duração de trecho.
84. [ ] Loop.
85. [ ] Gerar MP4 duas vezes.
86. [ ] Salvar no Rolo de Fotos e voltar ao app.
87. [ ] Testar em iPhone/Safari real.
88. [ ] Confirmar botões tocáveis.
89. [ ] Confirmar que menu deslizante não conflita com gestos do sistema.
90. [ ] Confirmar que menu contextual de frame não aparece indevidamente.
91. [ ] Confirmar que Stage continua editável.
92. [ ] Confirmar que app segue responsivo.
