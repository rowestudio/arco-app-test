# QA — v8z4b29AI pill de curvas e frames proporcionais da timeline

## Objetivo

Validar a versão `v8z4b29AI`, criada sobre a base aprovada `v8z4b29AH`, preservando integralmente:

- menus deslizantes da seleção de frames corrigidos na `v8z4b29AF`;
- centralização dos pontos laranja da timeline corrigida na `v8z4b29AH`;
- snap-to-center, Alpha/spotlight, Preview/export/MP4, JSON, timeline focal e motor de animação.

## Verificações estáticas executadas

- [x] `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29AI`.
- [x] Ícones SVG do pill/menu de curvas mantêm `stroke-linecap="round"` e `stroke-linejoin="round"` e usam stroke mais suave, sem trocar desenho, texto, posição, cor ou comportamento do pill.
- [x] `#pointModeMenu` contém um novo botão global apenas com ícone, sem label textual visível.
- [x] `applyCurrentCurveModeToAllFrames()` usa o modo do frame/ponto ativo e chama a lógica existente de aplicação de modo por frame, sem copiar coordenadas absolutas de handles.
- [x] A ação global chama `pushUndo()` uma única vez antes da aplicação em lote e atualiza renderização/UI após a alteração.
- [x] `.mid-bar.timeline-grid .fp` usa variáveis proporcionais para fonte, padding e raio dos frames da timeline, preservando a regra visual de borda e os estados ativo/selecionado.
- [x] Não houve alteração em `getStateAtT`, `drawAtT`, Preview/export/MP4, JSON, snap-to-center, Alpha/spotlight, `timelineFocalFrameId`, Linha 3 / Linha 4 / Coluna 2, seleção múltipla, menu superior, pontos laranja ou menus deslizantes.

## Checklist manual obrigatório — iPhone/Safari ou viewport equivalente

1. Abrir o app em `v8z4b29AI`.
2. Confirmar que a versão visível mostra `v8z4b29AI`.
3. Abrir o pill/menu de curvas.
4. Conferir que os ícones ficaram com traço mais suave e da mesma família visual dos ícones de Pausa, Rotação, Escala e Mover.
5. Conferir que o pill continua no mesmo lugar e com o mesmo comportamento.
6. Conferir que existe novo ícone global sem texto dentro do mesmo pill.
7. Selecionar um frame/ponto.
8. Escolher um modo de curva: Canto, Simétrico, Assimétrico ou Desconectado.
9. Tocar no ícone global.
10. Confirmar que todos os frames/pontos editáveis passam a usar o mesmo modo de curva.
11. Confirmar que nenhum frame muda posição, escala, rotação, duração ou pausa.
12. Testar Undo e confirmar que a aplicação global inteira desfaz em um passo.
13. Testar Redo e confirmar que a aplicação global inteira reaplica em um passo.
14. Conferir a timeline com vários frames.
15. Confirmar que número, padding, respiro interno e raio dos frames estão proporcionais ao tamanho visual.
16. Confirmar que a borda manteve a espessura/aparência aprovada e que os estados ativo/selecionado continuam corretos.
17. Confirmar que os pontos laranja continuam centralizados como na `v8z4b29AH`.
18. Confirmar que os menus deslizantes da seleção de frames continuam funcionando como na `v8z4b29AF`.
19. Confirmar snap-to-center.
20. Confirmar Alpha/spotlight.
21. Confirmar Preview básico.
22. Confirmar que JSON/export não foram alterados.

## Riscos

- A ação global de modo de curva recalcula handles via função existente; validar visualmente especialmente projetos com muitos frames e modos mistos.
- A redução do stroke dos ícones é visual; validar em iPhone/Safari para confirmar que não ficou fino demais.
- A proporcionalidade dos frames depende das variáveis CSS da timeline; validar legibilidade em viewports estreitos e com muitos frames.

## Resultado neste ambiente

- Verificações automatizadas/estáticas realizadas no repositório.
- QA manual em iPhone/Safari real, Preview real, export real e JSON manual permanecem pendentes por limitação do ambiente.
