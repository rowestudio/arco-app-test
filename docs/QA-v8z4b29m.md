# QA — v8z4b29m

## Escopo

- Correção crítica de UX/layout/scroll da área inferior, timeline e menus contextuais.
- Motor de preview, exportação MP4, JSON/import/export, curvas/handles, easing, movimento inteligente, cálculo de câmera, Stage, criação/remoção geral de frames e zoom/pan preservados.

## Verificações estáticas executadas

- [x] Base `v8z4b29L` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- [x] Versionamento atualizado para `v8z4b29m` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Seleção de trecho não usa mais foco visual azul/ciano de Stage nos frames endpoints; indicação fica restrita à timeline e contexto inferior.
- [x] Faixa de frames é a fonte da rolagem horizontal, com `touch-action: pan-x`, rolagem inercial iOS e sem listener reverso da faixa de tempos.
- [x] Tempos acompanham frames por sincronização direta de `scrollLeft`, no mesmo passo do scroll da timeline.
- [x] Centralização suave do frame selecionado permanece bloqueada durante seleção múltipla e volta na seleção individual.
- [x] `Selecionar todos` permanece aditivo/complete a seleção, usa texto por extenso antes do ícone e hierarquia cinza secundária.
- [x] Duração e Movimento têm tick/check para confirmar/fechar.
- [x] Safe area inferior foi reduzida sem aumentar o painel; linhas ganharam respiro com bolinhas laranjas afastadas dos frames.
- [x] Hierarquia de textos ajustada: pausa cinza, trecho branco, frame/nome cinza, quantidade de frames mais escura.

## QA manual obrigatório em iPhone/Safari ou simulação mobile equivalente

- [ ] Com 16 frames: rolar horizontalmente até o frame 16 e confirmar acesso a todos os frames sem resistência/travamento.
- [ ] Sincronização: rolar frames e confirmar tempos/trechos/frames alinhados em tempo real.
- [ ] Seleção individual: tocar F1, F5, F9 e F16 e confirmar centralização suave quando possível.
- [ ] Seleção múltipla: selecionar vários frames, acionar `Selecionar todos` e confirmar que todos permanecem selecionados sem limpar a seleção.
- [ ] Seleção de trecho: selecionar trecho 3–4 (ou equivalente) e confirmar ausência de moldura/contorno azul indevido no Stage.
- [ ] Menu Movimento: abrir, confirmar que não cresce/empurra timeline e fechar pelo tick/check.
- [ ] Menu Duração: abrir, confirmar tick/check, fechar e verificar que o layout não salta.
- [ ] Layout inferior: confirmar menu mais baixo perto da safe area real, mais respiro entre linhas, bolinhas sem sobrepor frames e cores conforme hierarquia.

## Observações

- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.
