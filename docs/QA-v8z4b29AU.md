# QA — v8z4b29AU menus contextuais ancorados ao Stage

## Escopo

- Objetivo único: corrigir o posicionamento dos menus contextuais de frame e de curva no Stage.
- Base obrigatória: `v8z4b29AE` pós-revert da PR #262.
- Fora de escopo preservado: Home, Novo Projeto guiado, fluxo de abertura, JSON, Preview/export/MP4, motor, posição/escala/rotação reais dos frames, curvas/handles, timeline/menu inferior, pontos laranja, snap-to-center e Alpha/spotlight.

## Diagnóstico antes da alteração

1. Problema exato: os menus contextuais de frame/curva estavam ancorados a elementos dimensionados pela imagem renderizada, fazendo a UI acompanhar a imagem/conteúdo visual em vez do viewport de edição.
2. Funções/elementos envolvidos:
   - `#stageFrameMenu`, usado por `showStageFrameMenu()` e `hideStageFrameMenu()`.
   - `#pointModeMenu`, usado por `openPointModeMenu()`, `closePointModeMenu()` e `togglePointModeMenuFromButton()`.
   - Referências DOM iniciais de `stage`, `stageContent`, `stageContextOverlay`, `stageFrameMenuEl` e `pointModeMenuEl`.
3. Comportamento atual esperado antes da correção: menu aparece ao selecionar frame/curva, mas pode ficar visualmente preso à área da imagem.
4. Comportamento novo esperado: os menus aparecem em uma camada de UI do Stage, estáveis em relação ao viewport de edição, acima do menu inferior.
5. Riscos: bloqueio indevido de toque por overlay absoluto; fechamento incorreto dos menus ao tocar nos botões; sobreposição da timeline/menu inferior; regressão de acessibilidade no iPhone/Safari.
6. Regressões a testar: seleção de frame, botão Deletar, botão Fixar/Desfixar, botão Curva, modos Canto/Simétrico/Assimétrico/Desconectado/Tangente/Global, pan/zoom do Stage, timeline/menu inferior, JSON e Preview/export.

## Alterações verificadas estaticamente

- `#stageContextOverlay` criado como camada absoluta dentro de `#imageArea`, com `inset:0`, `z-index:130` e `pointer-events:none`.
- `#stageFrameMenu` movido para `#stageContextOverlay`, fora de `#stage` e fora de `#stageContent`.
- `#pointModeMenu` movido para `#stageContextOverlay`; o fallback JS também garante que `#stageFrameMenu` e `#pointModeMenu` permaneçam nessa camada.
- `#stageFrameMenu` e `#pointModeMenu` mantêm `pointer-events:auto`, preservando a interação dos botões sem tornar o overlay inteiro bloqueante.
- Ambos usam `bottom:calc(10px + var(--safe-bottom))`, ficando acima do limite inferior da área de edição e respeitando safe area.
- `isPendingFrameAllowedTarget()` passou a reconhecer `#stageFrameMenu` como alvo permitido durante fluxo de frame pendente, sem alterar o fluxo de abertura.

## Checklist manual obrigatório

1. Abrir o app e confirmar que não aparece Home nem Novo Projeto guiado.
2. Abrir uma imagem e confirmar que o Stage carrega normalmente.
3. Selecionar um frame e confirmar que o menu `Deletar / Fixar / Curva` aparece acima do menu inferior.
4. Confirmar que o menu de frame não cobre a timeline/menu inferior.
5. Mover a imagem no Stage e confirmar que o menu de frame permanece estável em relação ao viewport.
6. Aplicar zoom/pan do editor e confirmar que o menu de frame não acompanha `#stageContent` transformado.
7. Selecionar outro frame e confirmar que o menu atualiza estado, mas não salta para a posição da imagem.
8. Abrir `Curva` e confirmar que o menu de curva aparece na mesma camada de UI, acima do menu inferior.
9. Mover/zoomar/panar a imagem com o menu de curva aberto e confirmar que o pill de curva permanece estável.
10. Confirmar que modos de curva/handles continuam funcionando.
11. Confirmar que timeline/menu inferior não mudou visualmente.
12. Confirmar que JSON abre/salva.
13. Confirmar Preview/export/MP4.
14. Repetir em iPhone/Safari, validando safe area e acessibilidade dos botões.

## Limitações do ambiente automatizado

- Não há validação visual real em iPhone/Safari neste ambiente.
- Não há medição manual de pixels da timeline/menu inferior neste ambiente.
- Preview/export/MP4 e abertura/salvamento JSON devem ser validados manualmente no navegador.
