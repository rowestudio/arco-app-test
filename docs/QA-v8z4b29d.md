# QA pendente — v8z4b29d correções visuais/UX da linha v29

## Confirmação de base e versionamento

- [x] Base `v8z4b29c` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- [x] `APP_VERSION = v8z4b29d`.
- [x] `APP_VERSION_NAME = v8z4b29d`.
- [x] Versão visível do app atualizada para `v8z4b29d`.
- [x] Comentário/changelog do topo atualizado para `v8z4b29d`.

## Verificações estáticas feitas nesta implementação

- [x] Menu Arquivos preserva Templates, Carregar imagem, Salvar projeto, Carregar projeto, Fundo, Inverter, Formato, Reset e Recarregar app.
- [x] Bloco Criação usa 2 colunas reais; demais grades continuam usando o padrão de 3 colunas.
- [x] Templates usa desenho Lucide `layout-panel-top`.
- [x] Formato permanece com desenho Lucide `proportions`.
- [x] Reset usa desenho Lucide `timer-reset` e mantém classe `danger`.
- [x] Duração continua usando `clipboard-clock` e não mostra valor/estado no menu inferior.
- [x] Seleção de trecho chama renderização completa e a troca para frame limpa `selectedSegmentIndex`.
- [x] Trecho ativo no Stage fica ciano; trechos inativos ficam brancos.
- [x] Frame assistido inicial tem fill translúcido, borda pontilhada mais forte e pulsação leve em CSS.
- [x] Menus inferiores de Frame/Trecho compartilham largura estrutural, área mínima de toque e ícones até 28px.
- [x] Label visual `Tempo trecho` trocado para `Tempo`, mantendo acessibilidade/title como `Tempo do trecho`.
- [x] Motor de Preview/MP4/exportação não foi alterado.

## QA manual obrigatório — iPhone/Safari real ou simulação equivalente

### A. Menu Arquivos

1. [ ] Abrir menu Arquivos.
2. [ ] Fechar menu Arquivos facilmente.
3. [ ] Confirmar Criação com 2 colunas, sem buraco visual à direita.
4. [ ] Confirmar Templates abre e mantém função original.
5. [ ] Confirmar Carregar imagem abre seletor/fluxo original.
6. [ ] Confirmar Salvar projeto funciona.
7. [ ] Confirmar Carregar projeto funciona.
8. [ ] Confirmar Fundo funciona.
9. [ ] Confirmar Inverter funciona.
10. [ ] Confirmar Formato funciona sem alterar aspect ratio/Stage/Preview/export.
11. [ ] Confirmar Reset funciona.
12. [ ] Confirmar Recarregar app funciona.

### B. Ícones

13. [ ] Confirmar Templates usa `layout-panel-top`.
14. [ ] Confirmar Formato usa `proportions`.
15. [ ] Confirmar Reset usa `timer-reset` e mantém destaque atual.
16. [ ] Confirmar Duração usa `clipboard-clock` e não mostra estado/valor.

### C. Seleção Frame/Trecho

17. [ ] Selecionar trecho.
18. [ ] Tocar em frame no Stage.
19. [ ] Confirmar que o menu inferior muda para Frame.
20. [ ] Confirmar que alfa/overlay de trecho desaparece.
21. [ ] Mover o frame.
22. [ ] Abrir Curva.
23. [ ] Selecionar trecho novamente.
24. [ ] Alternar várias vezes entre frame e trecho sem seleção dupla.

### D. Trechos no Stage

25. [ ] Selecionar trecho 1–2 e confirmar trecho ativo ciano, demais brancos.
26. [ ] Selecionar trecho 2–3 e confirmar migração do ciano.
27. [ ] Tocar em frame e confirmar destaque de trecho limpo.
28. [ ] Testar sobre imagem clara e imagem escura.

### E. Frame assistido inicial

29. [ ] Criar projeto novo.
30. [ ] Confirmar frame assistido inicial mais evidente.
31. [ ] Confirmar alfa interno leve sem atrapalhar a imagem.
32. [ ] Mover, escalar e rotacionar o frame assistido.
33. [ ] Confirmar F1.
34. [ ] Confirmar que o frame vira normal.
35. [ ] Resetar projeto novo e confirmar retorno do estado assistido.

### F. Menus inferiores

36. [ ] Abrir menu de Frame com Duração, Pausa, Rotação, Escala, Mover.
37. [ ] Confirmar espaçamento uniforme, ícones menores e toque confortável.
38. [ ] Abrir menu de Trecho com Duração, Tempo, Movimento.
39. [ ] Confirmar que labels não encavalam e não há scroll horizontal acidental.
40. [ ] Testar toque em todos os itens.

### G. Preview/MP4 — sanidade apenas

41. [ ] Preview abre normalmente.
42. [ ] MP4/export continua acessível se já estava.
43. [ ] Não investigar/alterar motor se estiver funcionando.
