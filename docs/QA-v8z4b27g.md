# QA — v8z4b27g corrigir padronização real dos menus multi-select

## Verificações estáticas executadas

- Base anterior confirmada como `v8z4b27f` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo antes das alterações.
- Versionamento atualizado para `v8z4b27g` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app, comentário do topo, `CHANGELOG.md`, `QA.md`, este checklist e `docs/ROADMAP.md`.
- `#custBarTabs` inspecionado e confirmado na ordem aprovada: `Pausa`, `Rotação`, `Escala`, `Posição`.
- `#alignBarPrimary` ajustado para seguir a ordem: `Selecionar todos`, `Pausa`, `Rotação`, `Escala`, `Mover`, `Alinhar`, `Distribuir`.
- `Selecionar todos` permanece fixo à esquerda, usa símbolo Lucide `list-check` e não tem fundo, borda, border-radius, card, pill ou box visual.
- `#alignBarSubmenu` passa a usar o mesmo slot/padrão visual do `#custBarContent`: botão Voltar lateral, conteúdo centralizado, slider + valor e chips textuais nos painéis aplicáveis.
- Pausa, Rotação e Escala multi-select usam slider em cima, valor à direita e chips textuais abaixo; `Reset` e `Igualar` não usam ícones.
- `Alinhar` usa símbolo Lucide `align-end-horizontal`; Distribuir usa símbolos Lucide de `space-between`; subações de Alinhar/Distribuir não usam SVG inline improvisado.
- `Distribuir` permanece desabilitado/não acionável com menos de 3 frames selecionados.
- Fora de escopo preservado: motor de animação, `getStateAtT`, `drawAtT`, Preview, MP4/WebCodecs, JSON, curvas, zoom/pan e lógica estrutural de seleção múltipla.

## Checklist manual obrigatório antes de promover

### Versionamento

1. Confirmar `APP_VERSION = v8z4b27g`.
2. Confirmar `APP_VERSION_NAME = v8z4b27g`.
3. Confirmar versão visível no app `v8z4b27g`.
4. Confirmar comentário/changelog de topo atualizado.

### Design system e ordem

5. Comparar menu individual e menu multi-select lado a lado.
6. Confirmar ícones com mesmo tamanho, stroke, espaçamento e alinhamento.
7. Confirmar que ícone + texto formam o mesmo tipo de componente.
8. Confirmar ausência de caixa/fundo/borda indevida em ícones de menu.
9. Confirmar ordem: `Selecionar todos`, `Pausa`, `Rotação`, `Escala`, `Mover`, `Alinhar`, `Distribuir`.

### Selecionar todos

10. Confirmar fixo à esquerda.
11. Confirmar sem caixa/fundo/borda.
12. Confirmar ícone `list-check`.
13. Confirmar que seleciona todos os frames e mantém o menu aberto.
14. Confirmar que seleção não entra no JSON.
15. Confirmar que seleção não entra no Undo do projeto.

### Painéis

16. Abrir Pausa individual e Pausa multi-select e confirmar mesmo padrão visual.
17. Abrir Rotação individual e Rotação multi-select e confirmar slider, valor, `−5`, `+5`, `Igualar` se exibido e `Reset` textual.
18. Abrir Escala individual e Escala multi-select e confirmar slider, valor, `−5`, `+5`, `Igualar` se exibido e `Reset` textual.
19. Confirmar que `Voltar` segue o padrão aprovado do menu individual.
20. Confirmar que Alinhar abre controles diretos e Distribuir abre controles diretos, sem terceiro nível.

### Funcional e regressão

21. Selecionar múltiplos frames e confirmar destaque laranja no Stage/faixa.
22. Alterar Pausa, Rotação, Escala e Mover; confirmar que só frames selecionados mudam.
23. Testar Undo/Redo com painel aberto; confirmar slider/texto sincronizados e valor antigo não reaplica ao fechar.
24. Testar Alinhar com 2+ frames.
25. Testar Distribuir com 3+ frames.
26. Confirmar Distribuir desabilitado/não acionável com menos de 3 frames.
27. Confirmar Reset do projeto limpa seleção/menu/overlays.
28. Confirmar carregar/salvar JSON sem seleção antiga.
29. Confirmar Preview abre/fecha e não mostra menus/overlays.
30. Confirmar MP4 não exporta menus/overlays.
31. Confirmar zoom/pan com dois dedos.
32. Confirmar mover/escala/rotação individual.
33. Confirmar curvas visíveis.
34. Confirmar ghost frame bloqueando menus externos.

### iPhone/Safari

35. Testar em iPhone/Safari real.
36. Confirmar rolagem horizontal suave.
37. Confirmar áreas de toque confortáveis.
38. Confirmar que nada fica escondido pela Home Bar.
39. Confirmar ausência de seleção nativa de texto/callout.
40. Confirmar que gestos do menu não conflitam com Stage nem com a faixa de frames.
