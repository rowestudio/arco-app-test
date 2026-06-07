# QA — v8z4b29Q

## Base obrigatória

- [x] Base inicial confirmada como `v8z4b29P` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Versão final esperada: `v8z4b29Q`.
- [x] `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível (`#appVersionText`/`#appVersionNameText`) e comentário/changelog do topo apontam para `v8z4b29Q`.

## Verificações estáticas executadas

- [x] Menu de trecho (segmento) com espaçamento dos ícones de contexto equivalente ao menu de frame, incluindo correção de sub-pixel no botão de reticências (`⋯`).
- [x] `easeChipsGrid`: ícones de modo/easing revisados para `stroke-width:1.6`, `stroke-linecap/linejoin:round`, sem fundo tipo "pílula", combinando com o restante da UI.
- [x] `pointModeMenu`: posição e estilo ajustados para alinhar com os demais menus contextuais do Stage, com rótulos revisados.
- [x] Ícone "Tempo" trocado para `#i-clock`, igual ao símbolo já usado em outros contextos de tempo/duração.
- [x] Multi-seleção: `Selecionar todos` confirma comportamento (texto antes do ícone, modo preservado) — sem regressão da v8z4b29P.
- [x] Espaçamento do submenu de multi-seleção revisado e alinhado aos demais menus contextuais.
- [x] **Nova funcionalidade — edição local de pontos de curva nos frames vizinhos (sem motor):**
  - [x] As alças "ghost" (`#frame_ghost_in`/`#frame_ghost_out`), antes apenas decorativas (`pointer-events:none`, opacidade fixa 0.28), agora são interativas: recebem classes `frame-in-handle`/`frame-out-handle` + `frame-neighbor-handle`, listeners de `pointerdown` e armazenam `_arcoFi`/`_arcoTarget` para identificar a qual frame/segmento pertencem.
  - [x] Nova classe CSS `.frame-neighbor-handle` mantém presença discreta em repouso (`opacity:.46`) e ganha destaque pleno ao ser tocada/arrastada (`opacity:.92` + glow amarelo sutil), confirmando visualmente que é editável sem poluir o Stage com 6 alças simultâneas em destaque total.
  - [x] `startFrameHandleDrag` generalizado para aceitar `(which, fi, target)` — quando chamado sem `fi`/`target` (alças do frame ativo) calcula a partir de `activeIdx`/`getFrameConnectedHandleTargets`, preservando o comportamento anterior; quando chamado com `fi`/`target` explícitos (alças vizinhas) edita o segmento correto via `applyFrameConnectedHandleEdit(fi, ...)`, já generalizado.
  - [x] Novo helper `pickClosestFrameHandle(clientX, clientY)` resolve sobreposição: quando dois pontos de controle do MESMO segmento de bezier (ex.: `F3.out` e `F4.in`) ficam visualmente próximos, a alça geometricamente mais próxima do toque vence — independente de qual elemento o navegador entregou o evento por z-index. Os quatro listeners de `pointerdown` (IN/OUT ativos + ghost-in/ghost-out) usam o mesmo helper.
  - [x] `frameHandleDragState` estendido para `{which, fi, target, didMove, undoCaptured}`, e o handler de `pointermove` usa `frameHandleDragState.fi`/`.target` (em vez de assumir sempre `activeIdx`) para aplicar a edição no segmento correto, capturar o undo no ponto certo e redesenhar (`drawBezier`/`updateCtrlPts`).
  - [x] Seleção do frame (`activeIdx`) permanece intacta ao editar uma alça vizinha — confirmado via Playwright (`activeIdx` não muda durante nem após o arrasto).
  - [x] Isolamento por segmento confirmado: editar `F2.out`/`F4.in` (vizinhos de `F3`) não altera `F3.in`/`F3.out` nem qualquer outro segmento.
  - [x] Modo de ponto (`manual`/auto) preservado corretamente após edição das alças vizinhas.
  - [x] Undo/Redo testados e funcionando para edições feitas via alças vizinhas — valor antes/depois do undo bate exatamente com o estado original/editado.
  - [x] Casos de borda confirmados: primeiro frame mostra apenas o ghost IN (não há `F0.out`/segmento anterior); último frame mostra apenas o ghost OUT — sem loop habilitado.
  - [x] Com `loopEnabled = true`: comportamento de ghosts no primeiro/último frame inspecionado e confirmado consistente com a exclusão pré-existente ("não implementado para loop") — nenhuma regressão introduzida.
  - [x] Regressão: arrastar a alça primária (IN/OUT) do PRÓPRIO frame ativo continua funcionando exatamente como antes (mesmo valor de `curvesV2.frameHandles`, seleção preservada).
  - [x] Nenhum erro de console (`CONSOLE ERROR`/`PAGE ERROR`) registrado durante toda a bateria de testes Playwright.
- [x] Motor de animação, Preview, export/MP4 e JSON schema não foram alterados (nenhuma função relacionada a esses sistemas foi tocada nesta versão).

## Testes manuais recomendados em iPhone/Safari

1. Abrir o app e confirmar versão visível `v8z4b29Q` no menu/Configurações.
2. Selecionar um trecho (segmento) entre dois frames e comparar o espaçamento/alinhamento dos ícones do menu contextual com o menu de frame — não deve haver corte/desalinhamento na reticência `⋯`.
3. Abrir o menu de curva de um frame com handle manual e conferir os ícones de modo/easing (`easeChipsGrid`): devem ter traço fino e uniforme, sem fundo tipo pílula.
4. Abrir `pointModeMenu` a partir de uma alça de curva e conferir posição/alinhamento/rótulos em relação aos demais menus do Stage.
5. Conferir o ícone "Tempo" nos contextos relevantes — deve corresponder ao símbolo de relógio (`#i-clock`) usado em outros lugares do app.
6. Selecionar um frame do meio (com dois segmentos conectados) e verificar visualmente as DUAS alças "fantasma" (vizinhas) nas extremidades da curva: devem aparecer discretas (semi-transparentes) e, ao serem tocadas/arrastadas, ganhar destaque (mais opacas, com leve brilho).
7. Arrastar uma alça vizinha (ghost): a curva do segmento correspondente deve se ajustar normalmente, a seleção do frame não deve mudar, e Desfazer/Refazer devem restaurar/reaplicar a edição corretamente.
8. Repetir o arrasto da alça vizinha em um frame onde as duas pontas de controle do mesmo segmento (alça própria + alça vizinha) aparecem próximas na tela: confirmar que cada uma responde ao toque mais próximo dela, sem "roubar" o gesto da outra.
9. No primeiro e no último frame da timeline, confirmar que aparece apenas uma alça vizinha (a aplicável) — e que, com "Finalizar em loop" ativado, o comportamento permanece o mesmo de antes (sem alças adicionais para o segmento de loop).
10. Conferir que arrastar as alças primárias (IN/OUT) do próprio frame selecionado continua funcionando exatamente como antes, sem nenhuma regressão perceptível.

## Limitações

- Não foram executados testes em iPhone/Safari real neste ambiente automatizado.
- Não foi executada geração real de MP4, por estar fora do escopo desta rodada.
- A nova edição local de pontos foi validada via Playwright em viewport móvel emulado (390×844, touch); recomenda-se confirmação tátil em dispositivo real, especialmente para o caso de sobreposição de alças (item 8 dos testes manuais).
