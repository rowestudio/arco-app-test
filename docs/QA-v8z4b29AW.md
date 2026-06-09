# QA pendente — v8z4b29AW F1 ativo e confirmação assistida no Stage

## Escopo

- Base obrigatória preservada: `v8z4b29AV`, sem reintroduzir Home nem Novo Projeto guiado.
- Objetivos: consolidar início por imagem já com Frame 1 criado/numerado/ativo e reposicionar a UI Confirmar/Cancelar da inserção assistida para o overlay do Stage.
- Fora de escopo preservado: Preview/export/MP4, JSON, motor, timeline visual, curvas, menu inferior, pontos laranja, snap-to-center, Alpha/spotlight, handles, Tangente, Global, seleção múltipla e fluxo de abrir projeto.

## Diagnóstico e implementação

1. Problema exato — início por imagem: o fluxo normal de imagem ainda podia entrar no estado transitório de F1 assistido com `frameCount = 0`, exigindo confirmação antes de existir Frame 1 real.
2. Funções envolvidas — início por imagem: `loadImage()`, `createInitialFrameForNewImageProject()` e fallback de `resetAll()` para projetos novos por imagem.
3. Comportamento novo — início por imagem: os fluxos de imagem nova criam imediatamente um projeto limpo com `frameCount = 1`, `activeIdx = 0`, Frame 1 visível/numerado e timeline atualizada.
4. Problema exato — UI assistida: `showInsertionActionBar()` e `updateInsertionActionBarPosition()` anexavam `#insertionActionBar` ao `#stage`, elemento dimensionado pela imagem, fazendo a confirmação acompanhar imagem/conteúdo.
5. Funções/elementos envolvidos — UI assistida: `#stageContextOverlay`, `#insertionActionBar`, `showInsertionActionBar()` e `updateInsertionActionBarPosition()`.
6. Comportamento novo — UI assistida: `#insertionActionBar` passa a ser anexado ao `#stageContextOverlay`, mesma camada conceitual dos menus contextuais de frame/curva da v8z4b29AU, mantendo posição fixa relativa ao viewport do Stage.
7. Riscos: regressão de Reset Project em projeto novo, baseline de novo arquivo, bloqueio indevido de toque pelo overlay, sobreposição com menu inferior em iPhone/Safari, ou fluxo assistido de F2+ não confirmar/cancelar.

## Verificações estáticas executadas

- Versionamento atualizado para `v8z4b29AW` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME`, texto visível e configurações.
- `createInitialFrameForNewImageProject()` zera arrays de frames/curvas/timing derivados e cria F1 real com `frameCount = 1`, `activeIdx = 0`, `baseFrameW` e DOM do frame.
- `loadImage()` no caminho de imagem sem JSON chama `createInitialFrameForNewImageProject()`, renderiza Stage/timeline, centraliza F1, captura baseline de reset e valida o estado.
- `#insertionActionBar` agora é reparentado para `#stageContextOverlay` por `showInsertionActionBar()` e `updateInsertionActionBarPosition()`, fora de `#stage` e fora de `#stageContent`.
- `#insertionActionBar` usa `bottom:calc(10px + var(--safe-bottom))`, `pointer-events:auto` e z-index acima do overlay, preservando toque nos botões sem bloquear todo o Stage.

## QA manual pendente

1. Abrir o app e confirmar versão visível `v8z4b29AW`.
2. Confirmar que não aparece Home nem Novo Projeto guiado.
3. Iniciar por imagem no fluxo normal e confirmar Frame 1 visível, numerado, ativo, contador/timeline com 1 frame e ausência de estado com 0 frames.
4. Abrir `Novo arquivo`, escolher imagem válida e confirmar Frame 1 visível/ativo imediatamente.
5. Testar Reset Project após Novo arquivo e confirmar retorno ao baseline com 1 frame, não ao JSON anterior.
6. Entrar em inserção assistida de F2+ e confirmar/cancelar pelos botões circulares.
7. Durante inserção assistida, mover/zoomar/panar imagem e confirmar que Confirmar/Cancelar permanecem fixos no Stage, acima do menu inferior.
8. Confirmar que menus contextuais de frame/curva continuam ancorados ao Stage.
9. Salvar/abrir JSON e confirmar que projetos carregados preservam seus frames.
10. Testar Preview/export/MP4 com 1 frame e com múltiplos frames.
11. Validar no iPhone/Safari que botões permanecem acessíveis e não cobrem indevidamente o menu inferior.
