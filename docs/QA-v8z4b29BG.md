# QA pendente — v8z4b29BG: separa launcher, Novo Projeto e editor/Stage em estados explícitos

- Base obrigatória: `v8z4b29BF` (não aprovada — a entrada inicial e o fluxo de Novo Projeto continuavam presos ao Stage). Esta versão introduz um estado explícito de tela do app (`launcher` / `newProject` / `editor`) e garante que o Stage/timeline/toolbar só existam quando há um projeto funcional.

## O que mudou

- Novo controle de estado `appMode` (`launcher` | `newProject` | `editor`), refletido em classes no `<body>` (`mode-launcher`, `mode-newproject`, `mode-editor`).
- Em `launcher` e `newProject`, todo o conteúdo de `#imageArea` (Stage, overlay de contexto, status bar, zoom de edição, placeholder) é ocultado via CSS, exceto as telas do fluxo (`.flow-screen`). Top bar, mid bar (timeline), toolbar e `#custBar` também ficam ocultos.
- Recarregar o app sempre chama `setAppMode('launcher')` e mostra a página inicial — nenhum projeto, imagem ou frame anterior é restaurado automaticamente.
- A etapa final de imagem do Novo Projeto agora é uma tela própria do fluxo (`#newProjectImageStep`), com apenas três opções: **Fototeca**, **Tirar Foto**, **Escolher Arquivo**, além de "Voltar". Essa tela permanece visível mesmo enquanto o seletor nativo de imagem (iOS) está aberto, então cancelar o seletor nunca expõe o Stage/projeto anterior.
- O app só entra em modo `editor` (`enterEditorMode()`):
  - no commit final do Novo Projeto, após a imagem escolhida carregar com sucesso (antes de limpar o projeto anterior e montar o novo);
  - ao final de `applyFrameData()`, quando um JSON válido com imagem (embutida ou escolhida posteriormente) termina de carregar.
- Cancelamento do fluxo Novo Projeto (`exitNewProjectFlow()`):
  - iniciado do launcher → volta ao launcher;
  - iniciado do editor (após confirmar "Continuar" no aviso de possível perda) → restaura o editor intacto se o projeto anterior ainda é válido (nada foi destruído antes da imagem nova carregar); caso contrário volta ao launcher. Nunca fica em Stage vazio.
- "Novo Projeto" e "Abrir" no menu do editor continuam mostrando o aviso de possível perda (Cancelar/Continuar) antes de sair do editor.

## QA manual pendente v8z4b29BG

1. Versão visível mostra `v8z4b29BG` (menu, comentário do topo, `APP_VERSION`/`APP_VERSION_NAME`, CHANGELOG).
2. Recarregar o app (ou abrir pela primeira vez) sempre mostra a página inicial independente "Arco Motion App" com "Novo Projeto" e "Abrir Projeto".
3. Recarregar o app não mostra Stage (nem vazio, nem com projeto anterior).
4. Recarregar o app não mostra timeline/menu inferior nem toolbar.
5. Tocar em "Novo Projeto" na página inicial abre o painel Formato → Template, fora do Stage.
6. Durante o painel Formato → Template, Stage/timeline/toolbar/projeto anterior não aparecem.
7. Tocar em "Escolher imagem e criar" abre a etapa Imagem própria do fluxo, mostrando apenas Fototeca / Tirar Foto / Escolher Arquivo (sem "Projeto"/"Abrir JSON").
8. Cancelar o seletor nativo de imagem na etapa Imagem mantém o app na etapa Imagem (ou permite voltar ao painel Formato/Template) — nunca mostra o Stage.
9. Tocar em "Voltar" na etapa Imagem retorna ao painel Formato → Template.
10. Tocar em "Cancelar" no painel Formato → Template (iniciado do launcher) volta ao launcher.
11. Escolher uma imagem válida com "Sem template" cria F1 ativo imediatamente e entra no editor (Stage, timeline e toolbar aparecem juntos, sem "0 frames").
12. Escolher uma imagem válida com template Pan cria os frames do template imediatamente, visíveis no Stage e na timeline.
13. Escolher uma imagem válida com template Círculo cria os 8 frames imediatamente, visíveis no Stage e na timeline.
14. Tocar em "Abrir Projeto" na página inicial abre o seletor de `.json`.
15. Cancelar o seletor de `.json` volta ao launcher.
16. Selecionar um `.json` inválido mantém o app no launcher e mostra mensagem de erro.
17. Selecionar um `.json` válido com imagem embutida carrega o projeto e entra no editor automaticamente.
18. No editor, com projeto aberto, tocar em "Novo Projeto" no menu mostra o aviso "O projeto atual pode ser perdido se não foi salvo." (Cancelar/Continuar).
19. "Cancelar" no aviso mantém o editor exatamente como estava (Stage, frames, timeline, toolbar inalterados).
20. "Continuar" no aviso sai visualmente do editor (Stage/timeline/toolbar somem) e abre o fluxo Novo Projeto, sem mostrar o projeto anterior atrás.
21. Cancelar o fluxo Novo Projeto iniciado do editor (após "Continuar"), antes de escolher imagem, restaura o editor anterior intacto (frames, Stage, timeline como estavam).
22. Preview continua funcionando depois de criar/abrir um projeto.
23. Export MP4 continua funcionando depois de criar/abrir um projeto.
24. Salvar/Abrir JSON continuam funcionando.
25. Funciona no iPhone/Safari (sem dependência de eventos de cancelamento do seletor nativo para manter o app fora do Stage).

## Áreas preservadas (não alteradas)

- Frame visual do Stage (v8z4b29BC), abas/pontos, faixa superior, cruz central, clamp de criação de frames.
- Timeline/menu inferior visual, curvas/Bézier.
- Preview/export/MP4, JSON salvo/aberto (exceto novo acionamento via "Abrir Projeto"), motor.
- Templates e formato em si.
- Fluxo interno Formato → Template e sua sincronização final de criação (v8z4b29BD/BE).
