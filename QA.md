# QA pendente — v8z4b29AS Novo Projeto Home robusto e commit/template sincronizados

- Base obrigatória confirmada: `v8z4b29AR` em teste, ainda não aprovada.
- Versionamento atualizado para `v8z4b29AS` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME`, texto visível no menu do editor e versão exibida no menu da Home.
- `Novo projeto` da Home agora possui `data-home-action="new-project"`, usa botão real clicável com cursor/toque explícitos e é acionado por delegação de evento no container da Home/documento, chamando o mesmo `openNewProjectFlow({ origin: 'home' })` usado pelo fluxo do editor.
- `Abrir projeto` da Home agora possui `data-home-action="open-project"` e continua chamando `openProjectFromHome()` diretamente para JSON/projeto salvo, sem passar pela tela de Novo Projeto.
- Estado visual preso do card `Novo projeto` foi removido: a borda de destaque da ação primária fica restrita a `focus-visible`/`active`, sem parecer seleção permanente ao abrir a Home.
- `commitPendingNewProject()` centraliza o commit final do Novo Projeto: valida formato/template/imagem, aguarda `loadImage()` concluir e obter dimensões reais, limpa o projeto anterior, reaplica formato, aplica template ou fallback, valida frames, abre o editor e sincroniza Stage/timeline/contador.
- Nenhum Novo Projeto deve abrir com `0` frames: se template/sem-template não produzir frame válido, o app registra `Template returned 0 frames; fallback to assisted F1.` e cria F1 seguro com o enquadramento assistido inicial.
- Template circular permanece padronizado em `circle`, aceita aliases (`circular`, `circulo`, `círculo`) e é aplicado somente depois de a imagem/stage terem dimensões válidas, com sincronização completa imediata da UI.
- Sincronização pós-criação limpa seleção, trecho ativo, foco da timeline, preview/export antigo, undo/redo e painéis, renderiza Stage/timeline/contador e agenda segunda atualização via `requestAnimationFrame` para Safari/iPhone.
- Roadmap futuro registrado: Novo Projeto poderá começar por imagem/Fotos, por template ou por formato, todos alimentando o mesmo construtor interno `pendingNewProject = { format, template, imageFile, entryMode }` ou equivalente.
- Riscos: validar manualmente em iPhone/Safari/PWA os eventos nativos de arquivo/toque, cancelamento de seletor e criação com template circular. O fallback F1 usa o enquadramento assistido padrão e evita estado vazio.
- Regressão obrigatória preservada: escala proporcional dos frames no Stage, offset do número, espessura de borda, timeline/menu inferior visual, `.fp`, `#pillsRow`, `.mid-pills`, pontos laranja, snap-to-center, Alpha/spotlight, curvas/handles, Tangente/Global, Preview/export/MP4, JSON e motor.

## Roadmap futuro — múltiplas entradas para criação

1. Começar pela imagem/Fotos:
   - usuário escolhe imagem primeiro;
   - depois define formato;
   - depois escolhe template ou Sem template.
2. Começar pelo template:
   - usuário escolhe template primeiro;
   - depois escolhe imagem;
   - depois confirma/ajusta formato.
3. Começar pelo formato:
   - fluxo atual: formato → template → imagem.

Regra de arquitetura futura: essas entradas devem alimentar o mesmo construtor interno, por exemplo `pendingNewProject = { format, template, imageFile, entryMode }`.

Fora do escopo desta versão: picker especial do Fotos além do input atual, biblioteca completa de templates, templates remotos, conta/perfil, comunidade, multi-imagem e canvas expandido.

## Test steps

1. Abrir o app sem projeto ativo e confirmar que a Home aparece.
2. Abrir menu da Home e confirmar `Versão: v8z4b29AS`.
3. Confirmar que o card `Novo projeto` não aparece permanentemente selecionado/focado ao abrir a Home.
4. Tocar `Novo projeto` na Home e confirmar abertura imediata da tela de criação.
5. Cancelar/X no Novo Projeto vindo da Home e confirmar retorno à Home sem projeto vazio.
6. Novo Projeto vindo da Home: escolher formato, `Sem template`, imagem e confirmar editor aberto com F1 real/fallback seguro, contador diferente de `0`.
7. Novo Projeto vindo da Home: escolher template `Círculo`, imagem e confirmar Stage/timeline/contador com frames circulares imediatamente, sem tocar na timeline e sem Add Frame.
8. No editor, Arquivos → `Novo projeto`: cancelar confirmação e confirmar editor intacto.
9. No editor, Arquivos → `Novo projeto`: confirmar, concluir com template `Círculo` e confirmar Stage/timeline/Preview usando os frames circulares corretos imediatamente.
10. Simular template sem frames e confirmar warning `Template returned 0 frames; fallback to assisted F1.` e abertura com F1 seguro.
11. Tocar `Abrir projeto` na Home, cancelar seletor e confirmar permanência na Home.
12. Tocar `Abrir projeto` na Home, carregar JSON válido e confirmar editor direto, sem tela de Novo Projeto.
13. No editor, tocar `Voltar`, escolher Cancelar no aviso e confirmar permanência no editor.
14. No editor, tocar `Voltar`, escolher Sair/OK no aviso e confirmar volta à Home.
15. Carregar JSON pela Home e testar Reset Project para confirmar baseline do JSON preservado.
16. Rodar regressão manual de Stage, timeline/menu inferior, curvas/Tangente/Global, Preview/export/MP4, JSON e iPhone/Safari.

# QA pendente — v8z4b29AR Novo Projeto Home e sincronização completa

- Base obrigatória confirmada: `v8z4b29AQ` em teste, ainda não aprovada completamente.
- Versionamento atualizado para `v8z4b29AR` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME`, texto visível no menu do editor e versão exibida no menu da Home.
- `Novo projeto` da Home passa a ter binding direto por `id="homeNewProjectBtn"` e chama o mesmo `openNewProjectFlow('home')` usado pelo fluxo guiado, mantendo origem `home` para cancelamento voltar à Home.
- `clearCurrentProjectForNewProject()` agora limpa também cache/DOM da timeline inferior, tempos parciais, foco da timeline, trecho selecionado, seleção múltipla, painéis/contextos abertos e template ativo antes do commit do novo projeto.
- `syncNewProjectUiAfterCommit()` centraliza a sincronização pós-criação: normaliza arrays do novo projeto, define frame ativo/focal inicial, limpa seleção/trecho, atualiza duração/toolbar, reconstrói Stage/timeline/contador, centraliza a timeline e agenda um segundo render via `requestAnimationFrame` para Safari/iPhone.
- `commitNewProjectWithImage()` chama a sincronização completa depois de aplicar template ou preparar o fluxo sem template, preservando a regra de só substituir o projeto antigo após imagem válida.
- Template `círculo` aceita variações de identificador (`circle`, `circulo`, `círculo`, `circular`) via normalizador compartilhado, mantém a geração existente dos frames circulares e usa a mesma sincronização pós-commit.
- Carregar Projeto pela Home e Fechar Projeto foram preservados: JSON continua usando intenção `openProjectJson`, sem passar pela tela de Novo Projeto, e o aviso de saída continua no fluxo do editor.
- Roadmap futuro registrado: Novo Projeto poderá começar por imagem/Fotos, por template ou por formato, todos alimentando o mesmo construtor interno `pendingNewProject = { format, template, imageFile, entryMode }` ou equivalente. Não implementar agora picker especial do Fotos, biblioteca completa, múltiplos modos visuais, multi-imagem, comunidade ou conta/perfil.
- Riscos: os fluxos de arquivo e toque ainda dependem dos seletores nativos e do navegador; validar manualmente em iPhone/Safari/PWA. O caminho sem template continua abrindo o F1 assistido já existente, sem criar frame vazio no cancelamento.
- Regressão obrigatória preservada: escala proporcional dos frames no Stage, offset do número, espessura de borda, timeline/menu inferior visual, `.fp`, `#pillsRow`, `.mid-pills`, pontos laranja, snap-to-center, Alpha/spotlight, curvas/handles, Tangente/Global, Preview/export/MP4, JSON e motor.

## Roadmap futuro — múltiplas entradas para criação

1. Começar pela imagem:
   - usuário escolhe imagem primeiro, inclusive vindo do Fotos/iPhone;
   - depois escolhe formato;
   - depois escolhe template ou `Sem template`.
2. Começar pelo template:
   - usuário escolhe template primeiro;
   - depois escolhe imagem;
   - depois escolhe formato, se necessário.
3. Começar pelo formato:
   - fluxo atual: formato → template → imagem.

Regra de arquitetura futura: todos os fluxos devem alimentar o mesmo construtor interno, por exemplo:

```js
pendingNewProject = {
  format,
  template,
  imageFile,
  entryMode
};
```

## Test steps

1. Abrir o app sem projeto ativo e confirmar que a Home aparece.
2. Abrir menu da Home e confirmar `Versão: v8z4b29AR`.
3. Tocar `Novo projeto` na Home e confirmar abertura imediata da tela de criação.
4. Cancelar/X no Novo Projeto vindo da Home e confirmar retorno à Home sem projeto vazio.
5. Novo Projeto vindo da Home: escolher formato, `Sem template`, imagem e confirmar editor aberto com F1 assistido, sem substituir projeto anterior antes da imagem válida.
6. Novo Projeto vindo da Home: repetir com template de 2 frames e confirmar Stage, timeline, contador e label `Frame 1` atualizados imediatamente.
7. Novo Projeto vindo da Home: repetir com template `Círculo` e confirmar frames do círculo imediatamente no Stage e na timeline.
8. Abrir um projeto com muitos frames, criar Novo Projeto com template menor e confirmar que contador/timeline não herdam a quantidade antiga.
9. Tocar `Abrir projeto` na Home, cancelar seletor e confirmar permanência na Home.
10. Tocar `Abrir projeto` na Home, carregar JSON válido e confirmar editor direto, sem tela de Novo Projeto.
11. Tocar `Abrir projeto` na Home, carregar JSON inválido e confirmar erro com Home mantida.
12. No editor, Arquivos → `Novo projeto`: cancelar confirmação e confirmar editor intacto.
13. No editor, Arquivos → `Novo projeto`: confirmar, abrir tela guiada, cancelar/X e confirmar editor/projeto anterior intacto.
14. No editor, Arquivos → `Novo projeto`: confirmar, concluir com imagem e template e confirmar substituição apenas após imagem carregada com sucesso.
15. No editor, tocar `Voltar`, escolher Cancelar no aviso e confirmar permanência no editor.
16. No editor, tocar `Voltar`, escolher Sair/OK no aviso e confirmar volta à Home.
17. Carregar JSON pela Home e testar Reset Project para confirmar baseline do JSON preservado.
18. Rodar regressão manual de Stage, escala proporcional, offset do número, timeline/menu inferior visual, pontos laranja, snap-to-center, curvas/Tangente/Global, Preview/export/MP4, JSON e iPhone/Safari.

# QA pendente — v8z4b29AQ roteamento Home/Novo/Abrir/Cancelar

- Base obrigatória confirmada: `v8z4b29AP` em `index.html` antes do patch.
- Versionamento atualizado para `v8z4b29AQ` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME`, texto visível no menu do editor e versão exibida no menu da Home.
- `Novo projeto` da Home chama o mesmo fluxo guiado usado pelo menu interno, com `origin: 'home'` e cancelamento voltando à Home.
- `Abrir projeto` da Home usa intenção `openProjectJson`, reutiliza o input/importador JSON existente e fecha qualquer modal de Novo Projeto antes de aplicar JSON válido.
- A imagem do Novo Projeto usa intenção `newProjectImage`, impedindo que JSON seja tratado como imagem ou que imagem caia no fluxo de abrir projeto.
- Cancelar/X da tela de Novo Projeto limpa apenas o estado pendente, preservando Home ou editor anterior conforme a origem.
- A ação superior `Voltar` no editor passa a pedir confirmação antes de fechar o projeto ativo e voltar para a Home, sem tentar fechar navegador/app.
- Riscos: os fluxos de arquivo ainda dependem dos seletores nativos do navegador; validar manualmente em iPhone/Safari/PWA para cancelamento de seletor, toque e confirmação.
- Regressão obrigatória preservada: escala proporcional dos frames no Stage da `v8z4b29AE`, offset do número, espessura de borda, timeline/menu inferior, pontos laranja, snap-to-center, Alpha/spotlight, curvas/handles, Tangente/Global, Preview/export/MP4, JSON, motor e Undo/Redo.

## Test steps

1. Abrir o app sem projeto ativo e confirmar que a Home aparece.
2. Abrir menu da Home e confirmar `Versão: v8z4b29AQ`.
3. Tocar `Novo projeto` na Home e confirmar abertura imediata da tela de criação.
4. Cancelar/X no Novo Projeto vindo da Home e confirmar retorno à Home sem projeto vazio.
5. Novo Projeto vindo da Home: escolher formato, `Sem template`, imagem e confirmar editor aberto com F1 assistido.
6. Novo Projeto vindo da Home: repetir com template e confirmar criação após imagem válida.
7. Tocar `Abrir projeto` na Home, cancelar seletor e confirmar permanência na Home.
8. Tocar `Abrir projeto` na Home, carregar JSON válido e confirmar editor direto, sem tela de Novo Projeto.
9. Tocar `Abrir projeto` na Home, carregar JSON inválido e confirmar erro com Home mantida.
10. No editor, Arquivos → `Novo projeto`: cancelar confirmação e confirmar editor intacto.
11. No editor, Arquivos → `Novo projeto`: confirmar, abrir tela guiada, cancelar/X e confirmar editor/projeto anterior intacto.
12. No editor, Arquivos → `Novo projeto`: confirmar, concluir com imagem e confirmar substituição apenas após imagem carregada com sucesso.
13. No editor, tocar `Voltar`, escolher Cancelar no aviso e confirmar permanência no editor.
14. No editor, tocar `Voltar`, escolher Sair/OK no aviso e confirmar volta à Home sem tentativa de fechar navegador/app.
15. Carregar JSON pela Home e testar Reset Project para confirmar baseline do JSON preservado.
16. Rodar regressão manual de Stage, timeline/menu inferior, curvas/Tangente/Global, Preview/export/MP4, JSON e iPhone/Safari.

# QA pendente — v8z4b29AP Home provisória e Novo Projeto guiado

- Base obrigatória confirmada antes das alterações: `v8z4b29AE` em `index.html` (`APP_VERSION`, `APP_VERSION_NAME`, texto visível de versão e comentário/changelog do topo).
- Versionamento atualizado para `v8z4b29AP` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME`, texto visível no menu do editor e versão exibida no menu da Home.
- Home provisória adicionada para o estado sem projeto ativo, com ações `Novo projeto`, `Abrir projeto`, menu utilitário, versão e `Recarregar aplicativo` via `window.location.reload()`.
- Fluxo guiado de Novo Projeto usa `pendingNewProject` temporário com ordem obrigatória: formato, template/`Sem template`, imagem por último.
- Novo Projeto vindo do editor pede confirmação antes de abrir o fluxo guiado e só descarta o projeto anterior no commit final, após imagem validada.
- `Abrir projeto` da Home reutiliza o input/importador JSON existente; cancelamento do seletor mantém a Home e erro de JSON não cria projeto vazio.
- `Sem template` cria projeto novo com imagem/formato e inicia F1 assistido, preservando mínimo oficial de 1 frame e reset de projeto novo.
- Template escolhido reutiliza `applyTemplate()` após carregar imagem/formato e captura baseline para Reset Project do novo projeto.
- Visão futura registrada: Home pode receber Tutoriais, Templates, Efeitos, Comunidade, Recentes, Site, Ajuda, Sobre, Termos/licença e Contato; multi-imagem/assets poderá evoluir para `project.assets = [{ id, type: 'image', src, x, y, width, height }]` sem implementação nesta versão.
- Não implementar nesta versão: multi-imagem, schema JSON de múltiplos assets, canvas expandido, layers, troca de imagem por frame, timeline multi-imagem, tutoriais reais, comunidade, loja, login, conta ou biblioteca completa de templates.
- Riscos: fluxo de imagem ainda depende do pipeline atual de `loadImage()`; validação manual em iPhone/Safari real continua obrigatória para toque, seletor de arquivo, reload e modal/sheet.
- Regressão obrigatória: preservar escala proporcional dos frames no Stage da `v8z4b29AE`, offset interno do número, espessura de borda, posição/escala/rotação reais, timeline/menu inferior, pontos laranja, snap-to-center, Alpha/spotlight, curvas/handles, Preview/export/MP4, JSON, motor e Undo/Redo.

## Test steps

1. Abrir o app sem projeto ativo e confirmar que a Home aparece antes do editor.
2. Abrir menu da Home e confirmar `Versão: v8z4b29AP`.
3. Acionar `Recarregar aplicativo` e confirmar reload sem limpeza de storage persistente.
4. Tocar `Abrir projeto`, cancelar o seletor e confirmar permanência na Home sem projeto vazio.
5. Tocar `Abrir projeto`, carregar JSON válido e confirmar editor aberto com Reset Project preservando o baseline do JSON.
6. Tocar `Abrir projeto`, carregar JSON inválido e confirmar erro com Home mantida.
7. Tocar `Novo projeto` na Home, escolher formato, `Sem template`, cancelar e confirmar Home intacta.
8. Tocar `Novo projeto` na Home, escolher formato, `Sem template`, escolher imagem e confirmar editor com F1 assistido.
9. Repetir Novo Projeto com template existente e confirmar frames/durações/curvas padrão do template.
10. Com projeto aberto, usar menu superior/Arquivos → `Novo projeto`, cancelar confirmação e confirmar editor intacto.
11. Repetir pelo editor, continuar, cancelar o sheet guiado e confirmar projeto anterior intacto.
12. Repetir pelo editor, continuar, concluir com imagem e confirmar que JSON anterior, undo/redo, curvas/handles, pausas/durações, seleção múltipla, foco ativo e preview foram substituídos apenas no commit final.
13. Testar Reset Project em projeto novo sem template, projeto novo com template e projeto carregado por JSON.
14. Rodar regressão manual de Stage, timeline/menu inferior, pontos laranja, snap-to-center, Alpha/spotlight, curvas/handles, Preview/export/MP4, JSON e iPhone/Safari.
# QA pendente — v8z4b29AE offset interno do número dos frames no Stage

- Base funcional tratada conforme solicitação como `v8z4b29AD`; versionamento visível atualizado para `v8z4b29AE` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- Verificações estáticas executadas: `.frame-num` mantém o canto superior esquerdo, o `font-size`, o `padding` e o `border-radius` existentes, mas passa a comprimir apenas `top`/`left` com `--stage-frame-num-offset-scale: .65` sobre `--stage-frame-ui-scale`.
- Preservados sem alteração: tamanho real, posição, rotação e escala real dos frames; espessura da borda; curvas; handles; timeline/menu inferior; `.fp`; `#pillsRow`; `.mid-pills`; Preview/export; JSON; motor.
- QA manual obrigatório pendente: abrir em desktop e iPhone/Safari, criar/usar frames pequenos no Stage, confirmar que o número continua legível no canto superior esquerdo e mais próximo da borda sem parecer apertado demais em frames médios/grandes.
- Não foram executados testes em iPhone/Safari real, Preview/export real, JSON manual nem medição visual real neste ambiente automatizado.

# QA pendente — v8z4b29AO auditoria da escala interna dos frames do Stage

- Checklist detalhado criado em `docs/QA-v8z4b29AO.md`.
- Base confirmada: `v8z4b29AN`, preservando `v8z4b29AF`, `v8z4b29AH`, `v8z4b29AK`, `v8z4b29AL`, `v8z4b29AM` e `v8z4b29AN`.
- Auditoria estática: `--stage-frame-ui-scale`, `updateStageFrameUIScale()`, CSS proporcional de `.frame-border`/`.frame-num` e chamada em `renderAll()` continuam presentes; a escala também foi reativada no caminho `refreshEditorViewVisualOverlays()` para manter o repaint visual do Stage sincronizado.
- QA manual obrigatório pendente: validar visualmente em iPhone/Safari que frames pequenos mostram número, padding e radius menores, borda fixa, sem alteração de geometria; confirmar timeline/menu inferior, menu de curvas da AN, Tangente, Global, Preview/export e JSON sem regressão.

# QA pendente — v8z4b29AN Modo Tangente e Global armado no pill de curvas

- Checklist detalhado criado em `docs/QA-v8z4b29AN.md`.
- Base atualizada para `v8z4b29AN`, partindo da base mais recente do app (`v8z4b29AM`) e preservando `v8z4b29AL`, `v8z4b29AF`, `v8z4b29AH` e `v8z4b29AK`.
- Verificações estáticas executadas: versionamento atualizado; todos os botões do menu de curvas permanecem dentro do mesmo pill; Tangente usa o SVG Lucide `tangent`; Global é armado/cancelável com feedback curto; aplicação local/global não fecha o menu; Tangente altera somente handles `curvesV2` e `pointMode`.
- QA manual obrigatório pendente: validar iPhone/Safari, Global armado/cancelamento, Undo/Redo em um passo, Tangente local/global, Preview/export/MP4 real, JSON e ausência de regressão visual na timeline/menu inferior.

# QA pendente — v8z4b29AM menu de curvas Global armado e bissetriz

- Checklist detalhado criado em `docs/QA-v8z4b29AM.md`.
- Base confirmada: `v8z4b29AL` presente antes da alteração; preservadas v8z4b29AF, v8z4b29AH, v8z4b29AK e v8z4b29AL.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AM`; menu de curvas mantém ícones sem texto e mais legíveis; Global fica neutro por padrão, separado por divisor e funciona como modo armado; modos locais/globais não fecham o menu; reconstrução suave por bissetriz altera somente handles `curvesV2` com clamp proporcional.
- QA manual obrigatório pendente: validar Global armado/cancelamento, Undo/Redo em um passo para aplicação global e reconstrução suave, Preview, JSON e ausência de alteração visual na timeline/menu inferior.

# QA pendente — v8z4b29AL escala interna dos frames do Stage

- Checklist detalhado criado em `docs/QA-v8z4b29AL.md`.
- Base obrigatória confirmada como `v8z4b29AK`, validada para remoção/limpeza das alterações indevidas dos frames da timeline/menu inferior.
- Diagnóstico antes da alteração: `.frame` define o contêiner absoluto do Stage e agora só recebe a variável visual; `.frame-visual` continua com `transform-origin:center center` e rotação aplicada sem mudança; `.frame-border` tinha `border-radius:10px` fixo e borda aprovada controlada em JS; `.frame-num` tinha `top:6px`, `left:8px`, `font-size:12px`, `padding:2px 7px` e `border-radius:6px` fixos.
- Diagnóstico do tamanho do Stage: `renderAll()` representa cada frame por `frames[i] = {x,y,w,h}` aplicado diretamente a `style.left`, `style.top`, `style.width` e `style.height`; a rotação continua em `.frame-visual`; a escala visual da UI interna agora usa `offsetWidth/offsetHeight` do próprio `.frame`, com fallback para `frame.w/frame.h`, sem ler timeline/menu inferior.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AL`; `--stage-frame-ui-scale` afeta apenas `.frame-border`/`.frame-num`; não houve alteração em `.fp`, `.mid-bar.timeline-grid .fp`, `#pillsRow` ou `.mid-pills`; dados `frames[]`, rotação, curvas, Preview/export e JSON não foram alterados.
- QA manual obrigatório pendente: iPhone/Safari; abrir app; confirmar versão visível `v8z4b29AL`; carregar projeto com frames grandes, médios e pequenos; confirmar escala proporcional do número/label/radius no Stage; confirmar borda com espessura aprovada; confirmar posição, escala, rotação, handles, gestos, curvas, menus deslizantes, pontos laranja, timeline/menu inferior, Preview e JSON/export sem regressão.
- Não foram executados testes em iPhone/Safari real, Preview/export real, MP4 real, JSON manual nem comparação visual real com `v8z4b29AK` neste ambiente automatizado.

# QA pendente — v8z4b29AK limpeza seletiva dos frames da timeline/menu inferior

- Checklist detalhado criado em `docs/QA-v8z4b29AK.md`.
- Contexto registrado: a `v8z4b29AJ` já foi revertida manualmente pelo usuário; esta versão não tenta reverter a AJ inteira novamente.
- Correção estática executada: a parte indevida da `v8z4b29AI` sobre “responsive/proportional timeline frames” foi removida de `.mid-bar.timeline-grid .fp`, restaurando o padrão fixo anterior dos blocos `.fp` da timeline/menu inferior.
- Escopo corrigido e pendente: o pedido correto de escala proporcional era sobre frames desenhados no Stage (`.frame`, `.frame-visual`, `.frame-border`, `.frame-num`), mas essa implementação continua pendente e não foi feita na `v8z4b29AK`.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AK`; não há variáveis `--timeline-frame-*` ou `--fp-scale` aplicadas aos `.fp`; não há funções/estado/chamadas `lowerTimelineFrameScale`, `syncLowerTimelineFrameScale()` ou `scheduleLowerTimelineFrameScale()`; listeners de `resize`/`orientationchange` seguem chamando `syncLowerTimelineCenterMarkers()`.
- Preservados sem alteração: menus deslizantes da `v8z4b29AF`, pontos laranja centralizados da `v8z4b29AH`, snap-to-center, `timelineFocalFrameId`, scroll da timeline, Alpha/spotlight, Preview/export/MP4, JSON, curvas existentes, `applyCurrentCurveModeToAllFrames()` e motor.
- QA manual obrigatório pendente: abrir o app; confirmar versão visível `v8z4b29AK`; comparar a timeline/menu inferior com o visual anterior à parte errada da `v8z4b29AI`; confirmar pontos laranja centralizados; confirmar menus deslizantes; confirmar pill de curvas e ação global; confirmar que nenhum frame do Stage foi alterado nesta versão.
- Não foram executados testes em iPhone/Safari real, Preview/export real, MP4 real, JSON manual nem QA visual manual neste ambiente automatizado.

> Nota histórica: a seção antiga da `v8z4b29AI` abaixo foi superada pela `v8z4b29AK` na parte que afirmava proporcionalidade dos frames da timeline/menu inferior; essa proporcionalidade em `.fp` foi removida e não deve ser tratada como comportamento aprovado.

# QA pendente — v8z4b29AI pill de curvas e frames proporcionais da timeline

- Checklist detalhado criado em `docs/QA-v8z4b29AI.md`.
- Base obrigatória confirmada como `v8z4b29AH`, aprovada para centralização dos pontos laranja, preservando a `v8z4b29AF` aprovada para menus deslizantes da seleção de frames.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AI`; ícones do pill de curvas suavizados; novo ícone global sem texto adicionado ao mesmo pill; `applyCurrentCurveModeToAllFrames()` aplica o modo de curva ativo a todos os frames editáveis via lógica existente de modo por frame e com uma única entrada de undo; frames da timeline usam variáveis proporcionais para número, padding e raio.
- QA manual obrigatório pendente: iPhone/Safari ou viewport equivalente; abrir pill de curvas; validar stroke dos ícones; aplicar modo global; testar Undo/Redo; confirmar que posição, escala, rotação, duração e pausa dos frames não mudam; confirmar timeline proporcional; confirmar pontos laranja da `v8z4b29AH`, menus deslizantes da `v8z4b29AF`, snap-to-center, Alpha/spotlight, Preview básico e JSON/export preservados.
- Não foram executados testes em iPhone/Safari real, Preview real, export real nem JSON manual neste ambiente automatizado.

# QA — v8z4b29AH alinhamento dos pontos ao frame/pill focal real

- Checklist detalhado criado em `docs/QA-v8z4b29AH.md`.
- Base inicial confirmada como `v8z4b29AG`, tratada como não aprovada visualmente para os pontos laranja, preservando a `v8z4b29AF` aprovada para menus deslizantes da seleção de frames.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AH`; `syncLowerTimelineCenterMarkers()` mede `.lower-timeline-slot` e o pill focal real via `getBoundingClientRect()`; a variável `--lower-timeline-center-x` recebe o centro renderizado do pill focal relativo ao slot; o centro de `#pillsRow` permanece apenas como fallback.
- Verificações estáticas executadas: a sincronização dos pontos é chamada quando a timeline renderiza, quando classes de foco/seleção dos pills são aplicadas, durante scroll manual e em `resize`/`orientationchange`; snap-to-center, menus da `v8z4b29AF`, seleção múltipla, Linha 3/Linha 4/Coluna 2, Alpha, Preview/export, JSON, curvas e motor não foram alterados.
- QA manual obrigatório pendente: desktop; iPhone/Safari; Frame 1; Frame intermediário; Frame 5; último frame acessível; scroll lento; scroll rápido com momentum; seleção por pill; seleção por Stage; confirmar snap; confirmar menus deslizantes da seleção de frames como na `v8z4b29AF`.
- Não foram executados testes em iPhone/Safari real, Preview/export real, MP4 real, JSON manual nem medição visual real neste ambiente automatizado.

# QA pendente — v8z4b29AG alinhamento dos pontos centrais da timeline

- Checklist detalhado criado em `docs/QA-v8z4b29AG.md`.
- Base obrigatória preservada: `v8z4b29AF`, aprovada para os menus deslizantes da seleção de frames; a correção da Linha 3 / Linha 4 / Coluna 2 permanece fora do escopo desta mudança.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AG`; `.lower-timeline-slot::before` e `.lower-timeline-slot::after` continuam usando `left: var(--lower-timeline-center-x)` e `transform: translateX(-50%)`; `syncLowerTimelineCenterMarkers()` agora deriva a variável do eixo funcional de `#pillsRow` (`pillsRect.left - slotRect.left + pillsEl.clientWidth / 2`), preservando o snap aprovado e sem alterar scroll, seleção múltipla, menus, motor, Preview/export, JSON ou curvas.
- Medição obrigatória em browser/iPhone ainda pendente neste ambiente: executar o snippet `getBoundingClientRect()` do documento da versão para registrar `pillsCenter`, `slotCenter`, `activeCenter` e o centro visual dos pontos; critério de aceite = diferença entre pontos e `activeCenter` de 0 a 1px após o snap.
- QA manual obrigatório pendente: Frame 1, frame intermediário e último frame acessível; rolagem manual com snap; confirmar pontos alinhados ao centro do frame/pill focal, snap-to-center funcionando, Alpha/spotlight seguindo frame focal, menus deslizantes preservados como na `v8z4b29AF`, e Linha 3 / Linha 4 / Coluna 2 sem regressão.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real, JSON manual nem curvas manuais neste ambiente automatizado.

# QA — v8z4b29AF estabilidade da Linha 4 / Coluna 2 em seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b29AF.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29AE` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo; registrado que a `v8z4b29AE` não foi aprovada visualmente para este problema (não alterou o deslocamento aparente da Linha 4 / Coluna 2 em seleção múltipla); a microcorreção da `v8z4b29AD` em `#alignBarSubmenu` foi preservada.
- Objetivo único: resolver a influência da seleção múltipla (e de `Selecionar todos` na Linha 3 / Coluna 2) sobre o deslocamento visual da Linha 4 / Coluna 2, sem tocar em submenus, `#alignBarSubmenu`, `#custBar`, `#custBarContent`, Pausa/Rotação/Escala/Mover, safe-area, timeline, snap-to-center, Alpha/spotlight, `timelineFocalFrameId`, Preview/export/MP4/JSON/curvas/motor.
- Medição com `getBoundingClientRect()` (Playwright headless, viewport 430×932, projeto `samples/arquivo 9por16 2 frames.json`):
  - **Estado A** (`#lowerContextSlot`, frame simples): `top:882 bottom:928 left:78 right:430 width:352 height:46`; ícone do `.tb-item` ativo: `top:886 bottom:910`; label: `top:913 bottom:924`.
  - **Estado B** (mesma medição, seleção múltipla com `Selecionar todos` visível na Linha 3 / Coluna 2): `#lowerContextSlot` idêntico (`top:882 bottom:928 left:78 right:430 width:352 height:46`, diff = 0 em todas as propriedades); **antes da correção**, o ícone/label de `#alignBar` apareciam ~4px mais abaixo (`top:890/917`) que em `#toolbar` (`top:886/913`), por causa de `align-items:flex-end`/`justify-content:flex-end` herdados do antigo `#alignBar` flutuante; **após a correção**, ícone/label de `#alignBar` ficam em `top:886/913`, idênticos a `#toolbar`.
- Causa raiz identificada: não era reflow/empurrão do `Selecionar todos` sobre `#lowerContextSlot` (o contêiner da Linha 4 / Coluna 2 já mantinha o mesmo retângulo nos dois estados) — era a propriedade `align-items`/`justify-content` de `#alignBarPrimary`/`#alignBarActions`/`.ab-tab`, herdada do layout antigo de `#alignBar` como barra flutuante (`position:fixed`), divergindo da centralização vertical usada por `#toolbar .tb-item` dentro da grade `.mid-bar.timeline-grid`.
- Correção aplicada (escopo mínimo, restrito a `.mid-bar.timeline-grid`): `#alignBarPrimary.ab-primary-strip` e `#alignBarActions` passam a usar `align-items:stretch`; `#alignBarActions .ab-tab` passa a usar `justify-content:center`. Isso reproduz exatamente a centralização vertical de `#toolbar .tb-item`, sem alterar altura, padding, gap, margin, `grid-row`, `grid-column` ou posição de `#lowerContextSlot`/`#alignBar`/`#toolbar`/`Selecionar todos`. Nenhuma regra de `#alignBarSubmenu`, `#custBar`, `#custBarContent` ou submenus foi tocada.
- Ciclo de regressão (3x): em cada ciclo, Estado A → Estado B → Estado A, o retângulo de `#lowerContextSlot` e de `.lower-global-duration` (Coluna 1 / Linha 4) permaneceram idênticos byte-a-byte, e o `top`/`bottom` dos ícones de Coluna 2 / Linha 4 ficaram idênticos entre `#toolbar` e `#alignBar` nos três ciclos — sem acúmulo de estado.
- Smoke test de não regressão: abertura do submenu `Pausa` (`#alignBarSubmenu`) em seleção múltipla segue ancorada (`bottom:0`, altura `var(--lower-context-panel-h)`), confirmando que a correção da `v8z4b29AD`/`AE` permanece intacta.
- QA manual obrigatório pendente (iPhone/Safari real): repetir o ciclo de 10 passos do enunciado (selecionar frame normal → registrar Linha 4/Coluna 2 → entrar em seleção múltipla → confirmar `Selecionar todos` na Linha 3/Coluna 2 → confirmar Linha 4/Coluna 2 estável e alinhada à Coluna 1 → sair da seleção múltipla → confirmar retorno → repetir 3x); confirmar visualmente que ícones/labels de Pausa, Rotação, Escala, Mover, Alinhar e Distribuir não "descem" ao entrar em seleção múltipla.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado (apenas Chromium headless via Playwright).

# QA pendente — v8z4b29AE camada inferior unificada de submenus

- Checklist detalhado criado em `docs/QA-v8z4b29AE.md`.
- Base obrigatória preservada: `v8z4b29AD` como microcorreção parcial de `#alignBarSubmenu` em seleção múltipla; a `v8z4b29AD` não foi tratada como solução completa para frame simples nem para a área inferior como sistema único.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AE`; `--lower-context-gap` e `--lower-context-panel-h` definem a altura comum de Linha 3 + gap + Linha 4; `#alignBarSubmenu` permanece ancorado em `bottom:0`, com `overflow-y:visible`, e troca a altura residual `calc(... - 8px)` por `var(--lower-context-panel-h)`; frame simples usa o elemento real `#custBarContent` dentro do `#lowerContextSlot` expandido, removendo o padding inferior extra do slot; `Selecionar todos` segue reservado na Linha 3 / Coluna 2 sem participar do fluxo da Linha 4.
- Auditoria estática obrigatória: elemento real do submenu em frame simples = `#custBarContent`; elemento real do submenu em seleção múltipla = `#alignBarSubmenu`; safe-area única fica em `.mid-bar.timeline-grid` (`--lower-safe-bottom` + padding do grid); Linha 3 não participa do fluxo da Linha 4 porque a grade separa as linhas e `Selecionar todos` é absoluto dentro de `.lower-active-state`; `Selecionar todos` não altera a geometria da Linha 4 / Coluna 2.
- Medição obrigatória pós-correção em browser/iPhone ainda pendente neste ambiente: usar `getBoundingClientRect()` para registrar `#lowerContextSlot`, submenu real, `#pillsRow`, distância `submenu.top - pills.bottom` e distância `lowerContextSlot.bottom - submenu.bottom` para Pausa, Rotação, Escala e Mover, em frame simples e seleção múltipla.
- QA manual obrigatório pendente: frame simples e seleção múltipla; abrir Pausa/Rotação/Escala/Mover; confirmar que o submenu não sobe demais, não deixa espaço morto exagerado embaixo, não invade frames/pills e não corta thumb; confirmar Linha 4 / Coluna 1 e Coluna 2 alinhadas; confirmar `Selecionar todos` em uma linha; confirmar snap-to-center, Alpha/spotlight, Preview/export, JSON, curvas e motor sem regressão.

# QA pendente — v8z4b29AD ancoragem do submenu de seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b29AD.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29AB` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo; registrado que `v8z4b29AB` não foi aprovada funcionalmente para o bug visual dos submenus de seleção múltipla.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AD`; `.mid-bar.timeline-grid #alignBar.align-submenu-open #alignBarSubmenu` agora usa `bottom:0`, altura/min-height `calc(var(--lower-row-3) + var(--lower-row-4) - 8px)`, `overflow-y:visible` e padding `8px 8px 6px 6px`; `#custBar` permanece irrelevante para esse fluxo; snap, Alpha/spotlight, Preview/export, JSON, curvas e motor preservados.
- QA manual obrigatório pendente: iPhone/Safari ou viewport equivalente; seleção múltipla; abrir Rotação/Pausa/Escala/Mover; medir `#lowerContextSlot`, `#alignBarSubmenu` e `#pillsRow`; confirmar submenu ancorado ao rodapé real, sem espaço morto embaixo, sem invasão dos frames/pills, Linha 4 / Coluna 2 estável, `Selecionar todos` em uma linha, snap-to-center, Alpha/spotlight e Preview/export/JSON/curvas sem regressão.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real, JSON manual nem curvas manuais neste ambiente automatizado.

# QA pendente — v8z4b29AB estabilidade real da Linha 3/4 em seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b29AB.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29W` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29AB`; Linha 3 / Coluna 2 reserva largura fixa para `Selecionar todos`; o controle usa `inline-flex`, `white-space: nowrap`, texto antes do ícone, `min-width: max-content` e label sem corte; `#lowerContextSlot`, `#toolbar` e `#alignBar` mantêm o mesmo retângulo-base da Linha 4 / Coluna 2 sem deslocamento em seleção múltipla.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29W estabilidade da Linha 4 e marcadores centrais

- Checklist detalhado criado em `docs/QA-v8z4b29W.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29V` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo, mantendo ícone Formato corrigido, Alpha/spotlight aprovado, snap-to-center da timeline e `#custBar` integrado ao `#lowerContextSlot`.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29W`; `#lowerSelectionActions` agora usa área reservada fixa na Linha 3 / Coluna 2 e alterna apenas `visibility`; `.lower-active-label` mantém reserva horizontal estável; `#alignBar` e `#lowerContextSlot` continuam ocupando a Linha 4; marcadores centrais de `.lower-timeline-slot` usam o centro geométrico real de `#pillsRow`, alinhando bolinhas ao eixo do snap sem alterar `activeIdx`, seleção, Alpha/spotlight, Preview, MP4/export, JSON, curvas ou motor.
- QA manual obrigatório pendente: iPhone/Safari; seleção múltipla; clicar em `Selecionar todos`; confirmar Linha 4 da Coluna 2 estável; confirmar Pausa/Rotação/Escala/Mover na mesma altura; scroll lento; scroll rápido com momentum; snap-to-center; alinhamento das bolinhas; Alpha seguindo frame central; seleção independente do foco; poucos frames, 8 frames e 16 frames.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.

# QA pendente — v8z4b29V ajuste residual inferior

- Checklist detalhado criado em `docs/QA-v8z4b29V.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29U` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo, mantendo ícone Formato corrigido, Alpha/spotlight aprovado, snap-to-center da timeline e `#custBar` integrado ao `#lowerContextSlot`.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29V`; `--lower-safe-bottom` preserva a safe-area única; `--lower-home-breath` adiciona apenas respiro visual; submenus simples e de seleção múltipla recuam do rodapé sem subir o topo; `Selecionar todos` fica fora do fluxo vertical da Linha 3 para não deslocar a Linha 4; Alpha/spotlight, `timelineFocalFrameId`, `activeIdx`, snap-to-center, Formato, Preview, MP4/export, JSON, curvas e motor preservados.
- QA manual obrigatório pendente: iPhone/Safari; seleção simples; seleção múltipla; abrir Pausa; abrir Rotação; abrir Escala; abrir Mover; ativar/desativar seleção múltipla; clicar em `Selecionar todos`; confirmar Linha 4 estável; confirmar submenus fora da zona morta/home indicator; confirmar sem menu duplicado; confirmar `8 frames`/`16 frames` sem vazamento; confirmar Alpha e snap funcionando.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.

# QA pendente — v8z4b29U arquitetura dos submenus inferiores

- Checklist detalhado criado em `docs/QA-v8z4b29U.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29T` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo, mantendo snap-to-center da timeline, Alpha/spotlight aprovado e ícone Formato corrigido.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29U`; `#custBar` agora está estruturalmente dentro de `#lowerContextSlot`; remoção do reencaixe runtime de `#custBar`; estados `cust-open`/`cust-expanded` ocultam `#toolbar`/`#alignBar` concorrentes; submenus simples cobrem Linhas 3–4 com fundo sólido; `#lowerFrameCount`, `.lower-active-state` e `.lower-selection-actions` são ocultados em `cust-expanded` e `align-submenu-open`; safe-area do submenu passa a depender da grade inferior sem nova barra externa; Alpha/spotlight, `timelineFocalFrameId`, `activeIdx`, snap-to-center, Formato, Preview, MP4/export, JSON, curvas, motor e upload preservados.
- QA manual obrigatório pendente: desktop; iPhone/Safari; seleção simples; seleção múltipla; Pausa; Rotação; Escala; Mover; abrir/fechar submenu várias vezes; alternar entre submenus; timeline com poucos frames; timeline com 16 frames; confirmar Alpha seguindo frame central; confirmar snap-to-center; confirmar Formato com ícone correto; confirmar Preview/export não alterados.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.

# QA pendente — v8z4b29T snap-to-center da timeline inferior

- Checklist detalhado criado em `docs/QA-v8z4b29T.md`.
- Base inicial encontrada antes das alterações: `v8z4b29S` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo, mantendo a correção funcional de Alpha/spotlight já aplicada.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29T`; adicionado helper puro `getLowerTimelineNearestFrameIndex()`; `updateLowerTimelineCenterFrameFromScroll()` continua atualizando apenas foco visual/focal sem alterar `activeIdx`; scroll manual da timeline inferior agenda snap debounceado após cessar scroll/momentum; centralização programática bloqueia snaps concorrentes e finaliza com `timelineFocalFrameId` no frame encaixado; seleção, menus inferiores, Alpha/spotlight aprovado, Formato, Preview, MP4/export, JSON, curvas e motor preservados.
- QA manual obrigatório pendente: desktop; iPhone/Safari; scroll lento; scroll rápido com momentum; seleção de frame pelo Stage; seleção pela timeline; projetos com 3 frames e 16 frames; confirmar Alpha seguindo frame central; confirmar que `activeIdx`/seleção não muda apenas por scroll; confirmar que menus inferiores não foram alterados.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.

# QA pendente — v8z4b29S separação seleção/foco visual da timeline

- Checklist detalhado criado em `docs/QA-v8z4b29S.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29R` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29S`; `selectFrameContext()` não contamina `timelineFocalFrameId`/`lowerTimelineCenterFrameIndex` por padrão; centralização programática e scroll manual continuam como fontes explícitas do foco visual; `getTimelineStageFocusIndex()` preserva prioridade `timelineFocalFrameId` → `lowerTimelineCenterFrameIndex` → `activeIdx` em seleção simples; fallback de `updateDimOverlay()` usa `focusIdx`; menus inferiores, CSS inferior, Formato, Preview, MP4/export, JSON, motor, curvas e seleção múltipla funcional preservados.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.

# QA pendente — v8z4b29R sincronização Stage/timeline, seleção múltipla e menus de frame

- Checklist detalhado criado em `docs/QA-v8z4b29R.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29Q` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29R`; foco central da timeline separado da seleção simples; scroll manual atualiza alfa/destaque do Stage pelo frame central; centralização programática termina no frame selecionado sem focar intermediários; seleção múltipla e `Selecionar todos` preservam o conjunto sem hierarquia; submenus multi-select abrem em camada superior sobre Linha 3/Linha 4; blocos da timeline escalam número/padding/raio com borda controlada; Formato usa `proportions`; Preview, MP4/export, JSON e curvas preservados.

# QA pendente — v8z4b29Q correção limpa de ícones, timeline e menus inferiores

- Checklist detalhado criado em `docs/QA-v8z4b29Q.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29P` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29Q`; Formato em `proportions`; Arquivos/Ajustes em `clapperboard`; slots inferiores estáveis entre seleção simples/múltipla; painéis de ajuste usando Linhas 3/4 sem restos visuais; timeline com respiro para marcadores centrais e frames proporcionais; `timelineFocalFrameId` aplicado ao foco/alfa durante scroll manual; `Selecionar todos` aditivo dentro de multi-select; menu de trecho centralizado; curvas locais com ícones mais leves e handles vizinhos editáveis; bloco JSON com borda; Preview, MP4/export e JSON schema preservados.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.

# QA pendente — v8z4b29P consolidação UX, timeline e foco central

- Checklist detalhado criado em `docs/QA-v8z4b29P.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29O` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29P`; fundo padrão `#3c3c3b`; ícones/textos padronizados; Ajustes/Arquivos em `clapperboard`; Formato em `proportions`; timeline mais compacta com destaque ciano; scroll manual com foco/alfa no frame central; centralização programática sem flicker intermediário; `Selecionar todos` preserva multi-select; painéis de ajuste ocupam mais área quando expandidos; curvas acima do alfa; motor, Preview, MP4/export e JSON preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29O menus, timeline e seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b29O.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29N` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29O`; menus/top bar/safe area inferior usam `#3c3c3b`; ícones e labels dos menus afetados foram padronizados; menu contextual do Stage e menu de curvas usam cápsula principal; menu de curvas remove pills individuais; timeline ganhou respiro e dois marcadores centrais; foco central da timeline aciona overlay do Stage; `Selecionar todos` mantém multi-select ativo com texto antes do ícone; motor, Preview, MP4/export, JSON e undo/redo preservados.
- Não foram executados testes em iPhone/Safari real, Preview real, MP4/export real nem JSON manual neste ambiente automatizado.

# QA pendente — v8z4b29N UX inferior, timeline e seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b29N.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29m` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29N`; área inferior padronizada com fundo `#3c3c3b`, bordas/trechos/textos secundários `#b2b2b2`; botões com ícone + texto usando ícone branco e label cinza; frames da timeline mais estreitos; trechos conectados com círculos maiores; pontos laranja fora do bloco dos frames; tempos parciais sem `s`; Linha 3 com mais respiro e seleção listada entre parênteses; `Selecionar todos` sem pill e com evento isolado para preservar a seleção múltipla; curvas acima do overlay escuro; destaque visual do frame central no Stage e trechos adjacentes; motor, Preview, MP4/export, JSON, gestos de edição temporal e menu completo de Tempo/Duração preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29m correção crítica inferior, scroll e menus

- Checklist detalhado criado em `docs/QA-v8z4b29m.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29L` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29m`; seleção de trecho sem moldura azul/ciano no Stage; rolagem horizontal comandada pela faixa de frames com sincronização direta da faixa de tempos; centralização suave preservada fora de seleção múltipla; `Selecionar todos` explícito, secundário e aditivo; Duração e Movimento com tick/check; safe area inferior reduzida, linhas com mais respiro, bolinhas laranjas sem sobrepor frames e hierarquia de textos ajustada; motor, Preview, MP4/export, JSON, curvas/easing, câmera, Stage e zoom/pan preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29L refinamento visual da base inferior

- Checklist detalhado criado em `docs/QA-v8z4b29L.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29K` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29L`; safe area inferior da grade reduzida sem duplicação; respiro entre as 4 linhas ajustado sem aumentar o painel; Linha 3 em tom secundário e sem `Frame ativo`; blocos de frame reduzidos; trechos conectados e larguras sincronizadas com a faixa de tempos; centralização suave por `scrollTo` bloqueada em seleção múltipla; motor, Preview, MP4/export, JSON, Undo/Redo e cálculos de movimento preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29K base inferior compacta e submenus na Linha 4

- Checklist detalhado criado em `docs/QA-v8z4b29K.md`.
- Verificações estáticas executadas: base `v8z4b29J` confirmada antes das alterações; versionamento atualizado para `v8z4b29K`; área inferior preserva 2 colunas e 4 linhas; `#custBar` é reencaixado em `#lowerContextSlot` para substituir a Linha 4 / Coluna 2 sem empurrar a timeline; Coluna 1 ganhou padding compacto; botão `+ frame` ficou circular em `var(--accent)`; frames têm borda mais espessa e ativo/selecionado em ciano; trechos ficam conectados e discretos; texto `Frame ativo` removido da Linha 3; motor, Preview, MP4/export, JSON, curvas/easing e cálculos reais preservados.
- QA manual completo em iPhone/Safari, abertura dos submenus de frame/trecho, zona inferior, tocabilidade dos trechos, Preview, MP4/export, JSON, Undo/Redo e regressão geral permanece obrigatório antes de promover a versão.

# QA pendente — v8z4b29J área inferior proporcional e pausa distinta

- Checklist detalhado criado em `docs/QA-v8z4b29J.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29I` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29J`; área inferior preserva 2 colunas e 4 linhas; Coluna 1 ampliada; espaço morto inferior removido por padding inferior zerado; botão `+` maior em `var(--accent)`; controle global com label `Tempo`; tempos parciais e timeline sincronizados por `scrollLeft` imediato; frames mais fortes que trechos; bolinhas de conexão e foco central preservadas; frame ativo recentraliza fora de seleção múltipla; ícone de Pausa substituído por `i-frame-pause`; motor, Preview, MP4/export, JSON, curvas/easing e cálculos reais preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29I estrutura inferior alinhada sem sobreposição

- Checklist detalhado criado em `docs/QA-v8z4b29I.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29H` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29I`; área inferior mantida no mesmo slot/altura com 2 colunas e 4 linhas alinhadas; Coluna 1 estreita/global; Coluna 2 principal; sem overflow vertical interno; Duração geral fixa; `+ frame` sempre em pill `var(--accent)`; seleção múltipla integrada à grade; labels contextuais restaurados; tempos parciais sincronizados horizontalmente com frames/trechos; Preview, MP4/export, JSON, cálculos reais, curvas/easing e renderização preservados.

# QA pendente — v8z4b29H base inferior em 2 colunas e 4 faixas

- Checklist detalhado criado em `docs/QA-v8z4b29H.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29G` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29H`; área inferior estruturada em 2 colunas e 4 faixas no slot existente; Coluna 1 estreita/global; Coluna 2 principal; tempos parciais informativos sem edição direta; `+ frame` em pill `var(--accent)` com troca contextual por selecionar todos na seleção múltipla; duração geral preserva painel atual; ícones contextuais mantidos; confirmação assistida usa `var(--accent)`; flutuação assistida oval sem rotação/escala; motor, Preview, MP4/export, JSON, curvas/easing e cálculos reais preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29g ícones e frame assistido da linha v29

- Checklist detalhado criado em `docs/QA-v8z4b29g.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29f` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29g`; ícones pendentes corrigidos para Formato/`proportions`, Templates/`layout-template` e Não limitar-Conter/`fullscreen`; frame assistido sem círculos brancos de canto, sem texto/pill/fill interno, com borda branca tracejada, cantos arredondados, dim externo e flutuação visual sutil; flutuação pausa em toque/drag/handle e retorna após atraso curto; botões X/check permanecem círculos sem texto e ficam fixos no HUD do Stage, fora do layer de pan/zoom; roadmap pós-v8z4b29g registrado; motor, Preview, MP4/export e JSON preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29f menu, frame assistido e estados visuais da linha v29

- Checklist detalhado criado em `docs/QA-v8z4b29f.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29e` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29f`; Menu/Arquivos em 3 colunas na ordem solicitada com divisor e bloco JSON; ícones obrigatórios revisados; frame assistido sem texto/fill interno com borda tracejada, cantos brancos e dim externo; botões X/check circulares com rotação sem escala e fallback; F1 assistido mantém navegação/arquivos acessíveis; zoom/pan atualiza overlays imediatamente; seleção de frame/trecho mantém caminhos ciano/laranja; topbar refinada; roadmap inferior registrado; motor, Preview, MP4/export e JSON preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29e correções visuais/UX da linha v29

- Checklist detalhado criado em `docs/QA-v8z4b29e.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29d` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29e`; topo/Arquivos liberados durante F1 assistido; ghost sem fill azulado e com dim externo; borda assistida animada; confirmação ancorada no Stage; zoom/pan atualiza overlays imediatamente; labels de frame acompanham o frame; trechos ativos em ciano e inativos em laranja contínuo; ajuste fino de topbar; roadmap inferior registrado; motor, Preview, MP4/export e JSON preservados.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29d correções visuais/UX da linha v29

- Checklist detalhado criado em `docs/QA-v8z4b29d.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29c` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29d`; Criação em 2 colunas; ícones Templates/Formato/Reset ajustados; seleção visual Frame/Trecho exclusiva reforçada; trecho ativo ciano; frame assistido mais evidente; menus inferiores padronizados; label visual `Tempo`; motor, Preview, MP4 e JSON preservados.

# QA pendente — v8z4b29c refinar topo, Arquivos e seleção frame/trecho

- Checklist detalhado criado em `docs/QA-v8z4b29c.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29b` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29c`; topo sem labels visíveis; Preview em pill; painel Arquivos em grade por blocos com fechar visível; Duração com `clipboard-clock` sem valor; Formato com `proportions`; Deletar frame com `trash`; seleção visual frame/trecho exclusiva; motor, Preview, MP4 e JSON preservados.

# QA pendente — v8z4b29b corrigir hierarquia dos menus contextuais

- Checklist detalhado criado em `docs/QA-v8z4b29b.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b29a` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29b`; Curva removida da faixa superior; Fundo/Inverter/Formato movidos para Arquivos; menus inferiores reduzidos aos contextos Frame/Trecho; Frame definido como contexto padrão; menu contextual de frame posicionado no Stage em contêiner único; ações Deletar/Fixar/Curva escondem o menu antes de chamar as funções existentes; Tempo do trecho e Movimento continuam chamando o painel atual de trecho/easing; trechos intermediários permanecem visíveis na faixa de frames.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b29a reorganizar menus contextuais da interface

- Checklist detalhado criado em `docs/QA-v8z4b29a.md`.
- Base obrigatória confirmada antes das alterações: `v8z4b28f` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- Verificações estáticas executadas: versionamento atualizado para `v8z4b29a`; topo reorganizado para Voltar/Arquivos/Visualizar/Preview/Undo/Redo; painel Arquivos preserva funções de projeto; botão `+` fica à esquerda da faixa temporal; menu inferior contextual passa por Geral/Frame/Trecho; menu contextual de frame no Stage preserva Deletar/Fixar/Curva; clique direto em trecho seleciona sem abrir automaticamente o painel legado; Tempo do trecho e Movimento chamam o painel atual de trecho/easing.
- Não foram executados testes em iPhone/Safari real nem geração real de MP4 neste ambiente automatizado.

# QA pendente — v8z4b28f otimizar Preview com proxy e duração computada

- Checklist detalhado criado em `docs/QA-v8z4b28f.md`.
- Verificações estáticas executadas: base `v8z4b28e` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo; versionamento atualizado para `v8z4b28f`; `getComputedTimelineDuration()` centraliza a duração lógica usada por Preview e Export; Preview usa `previewRenderSource` cacheado com limite de 4096 px apenas quando a imagem é grande; Export/MP4 continua sem proxy e sem alteração de qualidade; loops de Preview usam timestamp atual do rAF, token anti-loop antigo e throttle leve; logs ficam sob `DEBUG_PREVIEW_PERF = false`.
- QA manual completo com `arco_diagramacao_i_ah8_c10_img 28e.json`, proxy de imagem grande, duração computada, geração MP4, regressão geral e iPhone/Safari real permanece obrigatório antes de promover a versão.

# QA pendente — v8z4b28e otimizar Preview sem alterar Export

- Verificações estáticas executadas: base `v8z4b28d` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo; versionamento atualizado para `v8z4b28e`; `renderFrameSafely` reutiliza diagnostics em `drawAtT`; loops de Preview cacheiam `previewTimelineFill` e têm guard `isPreviewing`; payload de `[RenderState]` só é montado com `DEBUG_RENDER_EXPORT` ativo.
- QA manual obrigatório permanece pendente no repositório de teste: imagem grande/menor, Preview abre/fecha/reabre sem loop preso, redução perceptível de engasgo, geração MP4 repetida sem tela preta/travamento, JSON recarregado, zoom forte, rotação, pausa, loop, seleção múltipla, salvar/carregar JSON, troca de imagem, Reset Project, zoom/pan com dois dedos, inserção assistida e validação em iPhone/Safari real.

# QA pendente — v8z4b28d estabilizar motor universal de Preview/MP4

- Checklist detalhado criado em `docs/QA-v8z4b28d.md`.
- Verificações estáticas executadas: base `v8z4b28c` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo; versionamento atualizado para `v8z4b28d`; `getRenderStateAtTime` centraliza validação de estado/câmera por tempo; Preview, WebCodecs e MediaRecorder usam `renderFrameSafely`; `VideoFrame`/`ImageBitmap` são fechados por frame; timestamps/canvas são validados antes do encode; `cleanupExportSession` e logs técnicos foram adicionados sob `DEBUG_RENDER_EXPORT`.
- QA manual completo em iPhone/Safari, zoom forte/extremo, pausa adicionada/removida, loop ligado/desligado, rotação positiva/negativa, HEIC/JPG/PNG, JSON leve/com imagem, arquivo real `arco_5537 28b2_img.json` se disponível, Preview abre/fecha e nova tentativa de MP4 sem reload permanece pendente antes de promover a versão.

# QA pendente — v8z4b28c corrigir pipeline HEIC e fonte de render

- Checklist detalhado criado em `docs/QA-v8z4b28c.md`.
- Verificações estáticas executadas: base `v8z4b28b` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível/comentário do topo atualizado para `v8z4b28c`; fonte canônica `canonicalRenderImage` criada em `loadImage`; `imageBase64` marca origem `imageBase64`; `drawAtTDirect` e `drawMirrorBg` usam `getCanonicalRenderSource()`; `buildRenderDiagnostics` usa dimensões canônicas; `startRecord` valida fonte canônica; logs `[ImagePipeline]`, `[RenderFallback]` e `[ExportError]` adicionados; sintaxe JS extraída de `index.html` validada.
- QA manual com `arco_5537 28b2_img.json`, HEIC direto, Preview, MP4, trecho F4→F5→F6, salvar/carregar e iPhone/Safari permanece obrigatório antes de promover, pois o arquivo real não está presente no repositório de teste.

# QA pendente — v8z4b28b estabilizar render em zoom extremo

- Checklist detalhado criado em `docs/QA-v8z4b28b.md`.
- Verificações estáticas executadas: base `v8z4b28a` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo; versionamento atualizado para `v8z4b28b`; Export/MP4 mantém canvas final fixo sem DPR de tela; Preview limita backing store por orçamento de pixels; render valida estado/source rect/output/imagem antes de `drawImage`; zoom acima do limite seguro aciona fallback direto com log `[RenderFallback]`; falhas de geração limpam overlay/estado sem fechar o Preview sozinho.
- QA manual completo em iPhone/Safari, imagem grande, zoom médio/extremo, Preview, MP4 e regressão geral permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b28a auditar resolução e qualidade de render

- Checklist detalhado criado em `docs/QA-v8z4b28a.md`.
- Verificações estáticas executadas: base `v8z4b27i` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo; versionamento atualizado para `v8z4b28a`; Preview renderiza em resolução final segura do formato em vez de meia resolução; contextos de Preview/Export reaplicam `imageSmoothingEnabled` e `imageSmoothingQuality = "high"`; JSON completo preserva a imagem original carregada sem reamostragem por canvas; carga de JSON com imagem embutida recria `File` direto do data URL; diagnóstico interno por frame disponível por chamada manual sem alerta visual.
- QA manual completo em iPhone/Safari, imagem grande com detalhes finos, zoom leve/médio/forte, Preview, MP4, análise interna de resolução, JSON com imagem e regressão geral permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b27i corrigir referência multi-select, reset de rotação e faixa rolável

- Checklist detalhado criado em `docs/QA-v8z4b27i.md`.
- Verificações estáticas executadas: base `v8z4b27h` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo; versionamento atualizado para `v8z4b27i`; faixa rolável do menu multi-select reserva largura para `Selecionar todos`; painéis Pausa/Escala/Rotação usam o primeiro frame da seleção atual como referência; `Selecionar todos` usa o frame ativo como referência inicial; sliders de Escala/Rotação mostram valor absoluto da referência e continuam aplicando delta relativo; Reset individual de Rotação ressincroniza slider/texto/fill/Stage; renderização atualiza badges numerados; `getStateAtT`, `drawAtT`, curvas, zoom/pan, JSON, Preview e pipeline MP4/WebCodecs não foram alterados.
- QA manual completo em iPhone/Safari, Undo/Redo com painéis abertos, Preview, MP4, JSON, Reset, inserção assistida, Mover/Alinhar/Distribuir, Escala e Rotação permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b27h corrigir sliders delta, ícones e alinhamento multi-select

- Checklist detalhado criado em `docs/QA-v8z4b27h.md`.
- Verificações estáticas executadas: base `v8z4b27g` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário do topo; versionamento atualizado para `v8z4b27h`; sliders de Rotação/Escala multi-select convertidos para delta relativo ao snapshot inicial com render ao vivo e Undo consolidado; `Selecionar todos` separado da faixa rolável e scroll resetado; ícones de Distribuir/Mover/Alinhar migrados para símbolos Lucide via `<use>`; Alinhar/Distribuir usam bounds visuais transformados; `getStateAtT`, `drawAtT`, curvas, zoom/pan, JSON, Preview e pipeline MP4/WebCodecs não foram alterados.
- QA manual completo em iPhone/Safari, Undo/Redo com painéis abertos, Preview, MP4, JSON, Reset, inserção assistida, Mover/Alinhar/Distribuir, Escala e Rotação permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b27g corrigir padronização real dos menus multi-select

- Checklist detalhado criado em `docs/QA-v8z4b27g.md`.
- Verificações estáticas executadas: base `v8z4b27f` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível atualizado para `v8z4b27g`; menu individual `#custBarTabs` inspecionado na ordem `Pausa`, `Rotação`, `Escala`, `Posição`; menu multi-select ajustado para `Selecionar todos`, `Pausa`, `Rotação`, `Escala`, `Mover`, `Alinhar`, `Distribuir`; `Selecionar todos` continua fixo e sem caixa/fundo/borda; painéis Pausa/Rotação/Escala multi-select usam estrutura de slider + valor + chips textuais do padrão `#custBarContent`; Reset/Igualar são textuais; Alinhar usa símbolo Lucide `align-end-horizontal`; Distribuir usa símbolos Lucide de space-between; SVGs inline improvisados de alinhar/distribuir foram removidos dos menus; `getStateAtT`, `drawAtT`, curvas, zoom/pan e pipeline WebCodecs/export não foram alterados.
- QA manual completo em iPhone/Safari, Undo/Redo com painéis abertos, Preview, MP4, JSON, Reset, inserção assistida, Mover/Alinhar/Distribuir, Escala e Rotação permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b27f ajustar painéis, ícones e menu rolável de frames selecionados

- Checklist detalhado criado em `docs/QA-v8z4b27f.md`.
- Verificações estáticas executadas: base `v8z4b27e` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível atualizado para `v8z4b27f`; painel Pausa centralizado e sem `Zerar`/`Definir pausa`; Undo/Redo com painel aberto ressincroniza o submenu; ícones de Pausa, Selecionar todos, Alinhar, Distribuir e Zerar corrigidos; menu principal de frames selecionados com Selecionar todos fixo e ações roláveis horizontalmente; `Posição` renomeado para `Mover`; `Alinhar` e `Distribuir` expostos no menu principal; `Distribuir` desabilitado com menos de 3 frames; seleção continua temporária e não entra no JSON; `getStateAtT`, `drawAtT`, curvas, zoom/pan e pipeline WebCodecs/export estrutural não foram alterados.
- QA manual completo em iPhone/Safari, Undo/Redo com painéis abertos, Preview, MP4, JSON, Reset, inserção assistida, Mover/Alinhar/Distribuir, Escala e Rotação permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b27e corrigir menu contextual, primeiro selecionado, Pausa e Undo de Conter

- Checklist detalhado criado em `docs/QA-v8z4b27e.md`.
- Verificações estáticas executadas: base `v8z4b27d` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível atualizado para `v8z4b27e`; menu contextual principal sem `Voltar` e sem texto redundante do alvo; `Selecionar todos` reposicionado à esquerda; subpainéis preservando `Voltar` e texto do alvo; seleção contextual com 1 frame já destacada no Stage e na faixa; painel Pausa sem botão `Zerar`; `containFrames` integrado ao Undo/Redo de `Conter na imagem`; carregamento de JSON e Reset de projeto novo limpando estado interno de contenção; seleção continua temporária e não entra no JSON; `drawBezier()`, `getStateAtT`, `drawAtT` e pipeline WebCodecs/export estrutural não foram alterados.

# QA pendente — v8z4b27d simplificar Pausa, menu com 1 frame, Undo da cor e overlay

- Checklist detalhado criado em `docs/QA-v8z4b27d.md`.
- Verificações estáticas executadas: base `v8z4b27c` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível atualizado para `v8z4b27d`; botão `Definir pausa` removido; slider de Pausa aplicando diretamente aos frames-alvo; Undo da Pausa consolidado em `commitBatchPauseEditSession()` ao fechar/sair; menu contextual habilitado com 1 frame selecionado; ação `Selecionar todos`; `bgColor` integrado ao Undo/Redo, Reset e JSON; overlay normal alterado para `rgba(0,0,0,0.38)` e overlay múltiplo preservado em `rgba(0,0,0,0.34)`; ausência do botão `Sel`/`btnMultiSelect`; seleção continua temporária e não entra no JSON; `drawBezier()`, `getStateAtT`, `drawAtT` e pipeline WebCodecs/export estrutural não foram alterados.
- QA manual completo em iPhone/Safari, Preview, MP4, JSON, Reset, inserção assistida, Undo/Redo e painel Pausa permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b27c simplificar Pausa em seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b27c.md`.
- Verificações estáticas executadas: base `v8z4b27b` confirmada antes das alterações; painel anterior localizado com `Aplicar aos selecionados` e `Igualar ao ativo`; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível; painel Pausa da seleção múltipla com título `Pausa`, contexto dos frames afetados, slider decimal e valor em segundos; ação principal `Definir pausa`; ação secundária `Zerar`; ausência de `Igualar ao ativo`, `Aplicar aos selecionados`, `+0.5s` e `-0.5s`; ausência do botão `Sel`/`btnMultiSelect`; seleção múltipla continua temporária e não entra no JSON; `drawBezier()`, `getStateAtT`, `drawAtT` e pipeline WebCodecs/export não foram alterados.
- `Adicionar pausa` não foi implementado nesta versão para evitar misturar fluxos; permanece como próximo passo em painel/modo separado.
- QA manual completo em iPhone/Safari, Preview, MP4, JSON, Reset, inserção assistida, Undo/Redo e painel Pausa permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b27b corrigir Pausa em lote sem incrementos fixos

- Checklist detalhado criado em `docs/QA-v8z4b27b.md`.
- Verificações estáticas executadas: base `v8z4b27a` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível; submenu Pausa da seleção múltipla sem `+0.5s`/`-0.5s`; painel Pausa em lote usando `dur-slider` com `FRAME_PAUSE_MIN`/`FRAME_PAUSE_MAX`/`FRAME_PAUSE_STEP`; ação `Aplicar aos selecionados` alterando somente `selectedFrames` editáveis com `pushUndoSnapshot(before)` único; ações `Zerar` e `Igualar ao ativo` preservadas via `alignFrames()`; ausência do botão `Sel`/`btnMultiSelect`; seleção múltipla continua temporária e não entra no JSON; `drawBezier()`, `getStateAtT`, `drawAtT` e pipeline WebCodecs/export não foram alterados.
- QA manual completo em iPhone/Safari, Preview, MP4, JSON, Reset, inserção assistida, Undo/Redo e painel Pausa permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b27a expandir menu de seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b27a.md`.
- Verificações estáticas executadas: base remota `v8z4b26g` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível; ausência do botão `Sel`/`btnMultiSelect`; menu próprio `#alignBar` preservado; grupos Pausa, Escala, Rotação e Posição presentes; ações em lote passam por `alignFrames()` com um único snapshot de Undo; seleção múltipla continua temporária e não entra no JSON; `drawBezier()`, `getStateAtT`, `drawAtT` e pipeline WebCodecs/export não foram alterados.
- QA manual completo em iPhone/Safari, Preview, MP4, JSON, Reset, Loop, inserção assistida e todos os itens de Pausa/Escala/Rotação/Posição permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b26g remover laranja interno e corrigir overlay da seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b26g.md`.
- Verificações estáticas executadas: base `v8z4b26f` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível; ausência do botão `Sel`/`btnMultiSelect`; seleção múltipla existente por `selectedFrames`; `.frame.multi-selected .frame-dim` sem fill/tingimento laranja; `renderAll()` usando borda laranja e halo externo sem `inset`; `updateDimOverlay()` com overlay escuro externo e máscara SVG para recortes múltiplos rotacionados; `drawBezier()` sem alteração geométrica; sintaxe básica de `index.html`.
- QA manual completo em iPhone/Safari, imagem clara, recortes rotacionados, aplicação em lote, Undo/Redo, Loop, Reset, JSON, Preview e MP4 permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b26f corrigir luz, moldura e caminhos na seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b26f.md`.
- Verificações estáticas executadas: base `v8z4b26e` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível; ausência do botão `Sel`/`btnMultiSelect`; seleção múltipla existente por `selectedFrames`; seleção iniciada com `selectedFrames.size > 0` já ilumina o primeiro frame; `renderAll()` suprimindo destaque ativo dominante e preservando molduras durante seleção múltipla; `toggleFrameSelection()` sem troca de `activeIdx` enquanto há seleção múltipla real; `updateDimOverlay()` oculto durante seleção múltipla; `drawBezier()` com caminhos sólidos/visíveis em seleção múltipla; sintaxe básica de `index.html`; `docs/ROADMAP.md` atualizado com status v8z4b26f.

# QA pendente — v8z4b26e limpar marcação residual ao desselecionar frames

- Checklist detalhado criado em `docs/QA-v8z4b26e.md`.
- Verificações estáticas executadas: base `v8z4b26d` confirmada antes das alterações; ausência do botão `Sel`/`btnMultiSelect`; seleção múltipla existente por `selectedFrames`; versionamento `APP_VERSION`/`APP_VERSION_NAME`/texto visível; `renderAll()` e `updateFrameSelector()` sincronizando destaque por `isFrameVisuallyMultiSelected()`/`clearFrameSelectionVisuals()`; ausência de persistência de `selectedFrames` no JSON; sintaxe básica de `index.html`.
- QA manual completo em iPhone/Safari, desseleção com frames sobrepostos, aplicação em lote, Undo/Redo, Loop, Reset, JSON, Preview e MP4 permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b26d separar seleção simples e seleção múltipla

- Checklist detalhado criado em `docs/QA-v8z4b26d.md`.
- Verificações estáticas executadas: base `v8z4b26c` confirmada antes das alterações; versionamento `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão, comentário/changelog do topo, bloqueio de auto-center em seleção múltipla, camada visual de selecionados como grupo sem destaque ativo dominante e sintaxe básica de `index.html`.
- QA manual completo em iPhone/Safari, Alinhar, Distribuir, Escala, Undo/Redo, Preview, MP4 e JSON permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b26c leitura visual da seleção múltipla no Stage

- Checklist detalhado criado em `docs/QA-v8z4b26c.md`.
- Verificações estáticas executadas: versionamento `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão, destaque em `renderAll()` para frames selecionados em camada visual superior, opacidade reduzida dos não selecionados e sintaxe básica de `index.html`.
- QA manual completo em iPhone/Safari, Stage com frames próximos/sobrepostos, Alinhar, Distribuir, Escala, Undo/Redo, Preview, MP4 e JSON permanece como checklist operacional antes de promover a versão.

# QA pendente — v8z4b26b remover Sel e mostrar seleção múltipla no Stage

- Checklist detalhado criado em `docs/QA-v8z4b26b.md`.
- Verificações estáticas executadas: versionamento `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão, ausência do botão `Sel`/`btnMultiSelect`, ausência de `selectedFrames` no JSON salvo e sintaxe básica de `index.html`.
- QA manual completo em iPhone/Safari, Preview, MP4, JSON, Loop e Undo/Redo permanece como checklist operacional antes de promover a versão.

# QA confirmado — v8z4b25h checkpoint interno

## Status da v8z4b25h

- v8z4b25h aprovada funcionalmente como checkpoint interno.
- Não é release comercial.
- Deve servir como base segura antes das próximas evoluções de curva, seleção múltipla, aplicação em lote e nova interface.
- A versão deve permanecer disponível como ponto de retorno caso próximas versões quebrem curva, loop, Preview, MP4, JSON, inserção assistida de frame ou gestos no iPhone/Safari.
- v8z4b25g foi a base aprovada anterior; v8z4b25h é o checkpoint estável atual por incluir a correção do bloqueio durante frame pendente.

## QA confirmado na v8z4b25h

- Menu de curva acessível.
- Ícones do menu de curva claros/legíveis.
- Ausência de texto indevido nos ícones.
- Modos Canto, Simétrico, Assimétrico e Desconectado funcionando.
- Comportamento de Loop preservado/corrigido.
- Undo/Redo sem regressão relatada.
- Preview sem regressão relatada.
- MP4 sem regressão relatada.
- Zoom/pan sem regressão relatada.
- Projeto com F1 assistido e mínimo de 1 frame continua como base da linha atual.
- Durante frame novo pendente/assistido, ações externas ficam bloqueadas.
- Painel de Duração não abre durante frame pendente.
- Confirmar frame pendente libera a interface normalmente.
- Cancelar frame pendente libera a interface normalmente.
- JSON salvo com imagem embutida em v8z4b25h foi validado estruturalmente.

## Pendência visual não bloqueante

- Ícones do menu de curva ficaram com traço visualmente espesso demais.
- Tratar como ajuste visual futuro dentro da revisão maior de interface.
- Não abrir patch específico apenas para isso neste momento.

---

# QA Checklist

Use depois de qualquer alteração, mesmo pequena.

## v8z4b22c — ghost frame exclusive interaction fix

Checklist obrigatório:

1. Confirmar que exibe `v8z4b22c` na UI (Settings).
2. Tocar `+` e confirmar que `frameCount`/pills não aumentam antes do OK.
3. Confirmar que aparece ghost frame com rótulo futuro dentro do Stage.
4. Mover o ghost primeiro e depois escalar; confirmar que não pula e não move junto.
5. Mover o ghost primeiro e depois rotacionar; confirmar que não pula e não move junto.
6. Escalar/rotacionar primeiro e mover depois; confirmar que o fluxo aprovado da 22B continua.
7. Tocar no corpo do ghost e confirmar que apenas movimento acontece.
8. Tocar no handler e confirmar que nunca centraliza o ghost na posição do dedo.
9. Tocar OK e confirmar que cria o frame definitivo com uma única ação de Undo.
10. Tocar Cancelar/X e confirmar que remove o ghost sem alterar frames/curvas/undo.
11. Exportar/salvar JSON durante modo ghost e confirmar que não há `isInsertingFrame`, `ghostFrame`, `pendingFrameInsert` ou `insertFrameMode`.
12. Confirmar que Preview, MP4, Reset Project, Reset Curves, handles OUT/IN independentes e Movimento inteligente com loop não regrediram.

---

## v8z4b22a — assisted frame insertion

### Teste A — versão
1. Abrir app.
2. Confirmar que exibe `v8z4b22a` na UI (Settings).
3. Confirmar que nome exibe `assisted frame insertion`.

### Teste B — fluxo básico com 2 frames
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com 2 frames.
3. Selecionar F1.
4. Tocar `+`.
5. Confirmar que frame definitivo não é criado imediatamente e `frameCount` não muda.
6. Confirmar que aparece ghost frame translúcido no Stage.
7. Tocar no Stage e confirmar que o ghost muda de posição.
8. Arrastar no Stage e confirmar que o ghost acompanha o toque.
9. Tocar Cancelar.
10. Confirmar que `frameCount` não mudou.
11. Tocar `+` novamente, posicionar o ghost e tocar OK.
12. Confirmar que o novo frame definitivo foi criado na posição escolhida.
13. Confirmar Undo remove a inserção.
14. Confirmar Redo restaura a inserção.

### Teste C — inserção entre frames
1. Criar projeto com 4 frames.
2. Selecionar F2.
3. Tocar `+`.
4. Confirmar que o ghost aparece no trecho F2→F3.
5. Confirmar OK sem mover e verificar que a inserção acontece entre F2 e F3.
6. Confirmar que a duração do trecho original foi dividida de modo coerente.
7. Confirmar que o novo frame nasce com pause 0.
8. Confirmar que rotação e escala foram interpoladas.
9. Confirmar que curvas/handles de trechos não adjacentes não mudaram.

### Teste D — ghost movido e handles locais
1. Selecionar um frame com próximo frame normal.
2. Tocar `+`.
3. Mover o ghost para posição livre.
4. Confirmar.
5. Confirmar que apenas os trechos locais ao novo frame foram recalculados.
6. Confirmar que handles OUT/IN independentes continuam editáveis.
7. Confirmar que midpoint e ctrl-pt legado não aparecem como UI.

### Teste E — loop, Preview, MP4, resets e JSON
1. Ativar loop.
2. Selecionar o último frame.
3. Tocar `+`.
4. Confirmar que o ghost aparece em posição coerente no fechamento.
5. Confirmar OK.
6. Confirmar que loop continua funcionando.
7. Rodar Preview.
8. Gerar MP4.
9. Testar Reset Project.
10. Testar Reset Curves.
11. Testar Movimento inteligente com loop.
12. Salvar JSON e confirmar `"version": "v8z4b22a"`.
13. Confirmar `curvesV2` presente.
14. Confirmar que `isInsertingFrame`, `ghostFrame`, `pendingFrameInsert` e `insertFrameMode` não aparecem no JSON.
15. Abrir JSON salvo e confirmar que o projeto abre corretamente.
16. Confirmar sem NaN/Infinity e sem erro de console.
17. Confirmar PR aberto e não mergeado.

### Teste F — ROADMAP sem implementação indevida
1. Confirmar que Direct Curve Drag está no ROADMAP como etapa futura.
2. Confirmar que Path/Insert Tool está no ROADMAP como etapa futura.
3. Confirmar que começar com 1 frame ou 0 frames está no ROADMAP como etapa futura.
4. Confirmar que esses itens não foram implementados na v8z4b22a.

---

## v8z4b21e — restore local loop influence in smart movement

### Teste A — versão
1. Abrir app.
2. Confirmar que exibe `v8z4b21e` na UI (Settings).
3. Confirmar que nome exibe `restore local loop influence in smart movement`.

### Teste B — caso mínimo: 2 frames / 4s / loop 1s / smart movement
1. Criar projeto com 2 frames.
2. Definir F1→F2 duração 4s.
3. Ativar Loop.
4. Definir `loopDuration = 1s`.
5. Garantir `segmentTimingMode: manual`.
6. Garantir `movementEasingMode: smart`.
7. Garantir Velocidade constante desligada (`constantSpeedTotalDuration: null`).
8. Garantir `framePauses` zeradas.
9. Garantir curvesV2 ativo.
10. Rodar Preview.
11. Confirmar que F1→F2 não tem falsa parada no meio da curva.
12. Confirmar que o loop usa Movimento inteligente local e não fica com velocidade constante crua.
13. Alterar `loopDuration` para valores maiores e menores.
14. Confirmar que isso influencia localmente a transição, sem criar falsa parada.

### Teste C — projeto com 4 frames e loop
1. Criar projeto com F1→F2, F2→F3, F3→F4 e Loop F4→F1.
2. Confirmar que F1→F2 considera o loop como vizinho anterior.
3. Confirmar que F2→F3 não é afetado diretamente pelo loop.
4. Confirmar que F3→F4 considera o loop como vizinho posterior.
5. Confirmar que o loop considera F3→F4 e F1→F2 como vizinhos.

### Teste D — regressões preservadas
1. Confirmar Reset Project continua voltando ao projeto carregado.
2. Confirmar Undo/Redo do Reset Project.
3. Confirmar Reset Curves continua funcionando com curvesV2.
4. Confirmar handles OUT/IN continuam independentes.
5. Confirmar que mover OUT não move IN.
6. Confirmar que mover IN não move OUT.
7. Confirmar que Velocidade constante continua funcionando.
8. Confirmar que midpoint e ctrl-pt legado não aparecem como UI.

### Teste E — Preview, MP4, JSON e compatibilidade
1. Rodar Preview e confirmar a trajetória corrigida.
2. Gerar MP4 e confirmar que segue o Preview.
3. Salvar JSON e confirmar `"version": "v8z4b21e"`.
4. Confirmar `curvesV2` presente.
5. Confirmar `framePauses`, `segDurations`, `loopDuration`, `segmentTimingMode` e `movementEasingMode` preservados.
6. Abrir JSON antigo sem `curvesV2` e confirmar conversão automática.
7. Confirmar sem NaN/Infinity e sem erro de console.
8. Confirmar PR aberto e não mergeado.

### Teste F — ROADMAP registrado sem implementação
1. Abrir ROADMAP.md.
2. Confirmar que Direct Curve Drag e Assisted Frame Insertion estão listados como futuros.
3. Confirmar que não foram implementados na v8z4b21e.

---

## v8z4b21d — fix project reset baseline and smart loop continuity

### Teste A — versão
1. Abrir app.
2. Confirmar que exibe `v8z4b21d` na UI (Settings).
3. Confirmar que nome exibe `fix project reset baseline and smart loop continuity`.

### Teste B — Reset Project usa baseline carregado
1. Abrir um projeto JSON salvo com vários frames, curvas, loop e `curvesV2`.
2. Mexer em frames, handles e duração.
3. Acionar Reset Project.
4. Confirmar que volta exatamente ao projeto como estava ao abrir o JSON.
5. Confirmar que não volta para o template padrão.
6. Confirmar que frames, curvas, duração, loop, `framePauses`, `segDurations` e `loopDuration` foram restaurados do baseline.

### Teste C — Undo/Redo do Reset Project
1. Com um projeto carregado, alterar o estado.
2. Acionar Reset Project.
3. Confirmar que uma única entrada de undo foi criada.
4. Acionar Undo e confirmar retorno ao estado anterior ao reset.
5. Acionar Redo e confirmar reaplicação do reset.
6. Acionar Reset Project novamente quando já está igual ao baseline e confirmar que não cria undo extra.

### Teste D — caso mínimo: 2 frames / 4s / loop 1s / smart movement
1. Criar projeto com 2 frames.
2. Definir F1→F2 duração 4s.
3. Ativar Loop.
4. Definir `loopDuration = 1s`.
5. Garantir `segmentTimingMode: manual`.
6. Garantir `movementEasingMode: smart`.
7. Garantir Velocidade constante desligada (`constantSpeedTotalDuration: null`).
8. Garantir `framePauses` zeradas.
9. Garantir curvesV2 ativo.
10. Rodar Preview.
11. Confirmar que F1→F2 não tem falsa parada no meio da curva.
12. Confirmar que o loop não dá tranco forte de velocidade.
13. Alterar `loopDuration` para valores maiores e menores.
14. Confirmar que a mudança não contamina dramaticamente o trecho normal.
15. Confirmar que Movimento inteligente ainda atua no loop de forma local.

### Teste E — Reset Curves e handles independentes
1. Confirmar que Reset Curves ainda funciona com curvesV2.
2. Confirmar que handles OUT/IN continuam independentes.
3. Confirmar que mover OUT não move IN.
4. Confirmar que mover IN não move OUT.
5. Confirmar que midpoint e ctrl-pt legado não aparecem como UI.

### Teste F — Preview, MP4, JSON e compatibilidade
1. Rodar Preview e confirmar a trajetória corrigida.
2. Gerar MP4 e confirmar que segue o Preview.
3. Salvar JSON e confirmar `"version": "v8z4b21d"`.
4. Confirmar `curvesV2` presente.
5. Confirmar `framePauses`, `segDurations` e `loopDuration` preservados.
6. Abrir JSON antigo sem `curvesV2` e confirmar conversão automática.
7. Confirmar sem NaN/Infinity e sem erro de console.

### Teste G — ROADMAP registrado sem implementação
1. Abrir ROADMAP.md.
2. Confirmar que Direct Curve Drag e Assisted Frame Insertion estão listados como futuros.
3. Confirmar que não foram implementados na v8z4b21d.

---

## v8z4b21c — fix smart loop false stop and reset curves v2

### Teste A — versão
1. Abrir app.
2. Confirmar que exibe `v8z4b21c` na UI (Settings).
3. Confirmar que nome exibe `fix smart loop false stop and reset curves v2`.

### Teste B — caso mínimo: 2 frames / 4s / loop 1s / smart movement
1. Criar projeto com 2 frames.
2. Definir F1→F2 duração 4s.
3. Ativar Loop.
4. Definir `loopDuration = 1s`.
5. Garantir `segmentTimingMode: manual`.
6. Garantir `movementEasingMode: smart`.
7. Garantir Velocidade constante desligada (`constantSpeedTotalDuration: null`).
8. Garantir `framePauses` zeradas (nenhum frame com pausa).
9. curvesV2 ativo (padrão para projetos novos).
10. Rodar Preview.
11. **Confirmar que NÃO há falsa parada ou ease abrupto no meio da curva F1→F2.**
12. **Confirmar que o loop curto (1s) não contamina o trecho normal (4s).**
13. Confirmar que o movimento F1→F2 é fluido do início ao fim.

### Teste C — Movimento inteligente ligado/desligado sem regressão
1. Com o cenário do Teste B, desligar Movimento inteligente.
2. Confirmar que o movimento continua sem erro.
3. Religar Movimento inteligente.
4. **Confirmar que ainda não há falsa parada.**

### Teste D — Velocidade constante não regrediu
1. Com o cenário do Teste B, ativar Velocidade constante.
2. Confirmar que o Preview funciona normalmente.
3. Confirmar que `segDurations` foram redistribuídas proporcionalmente.
4. Desativar Velocidade constante (modo manual).
5. Confirmar que o Preview volta ao comportamento esperado.

### Teste E — Reset Curves para curvesV2
1. Criar projeto com 2 ou mais frames.
2. Arrastar o handle OUT de um frame para posição não-padrão.
3. Arrastar o handle IN de outro frame para posição não-padrão.
4. **Confirmar que a curva no Stage está visivelmente diferente da padrão.**
5. Abrir painel do trecho com handle modificado.
6. Clicar **Resetar curva**.
7. **Confirmar que a curva no Stage volta para a posição padrão (linha reta / 1/3 da corda).**
8. **Confirmar que os handles voltam visivelmente para a posição padrão.**
9. Confirmar que o trecho vizinho NÃO foi alterado.
10. Confirmar que `framePauses` e `segDurations` estão preservados.
11. **Confirmar que Undo (Ctrl+Z) restaura os handles anteriores ao reset.**
12. **Confirmar que Redo (Ctrl+Shift+Z) reaplicar o reset.**

### Teste F — Reset Curves no trecho de loop
1. Com `loopEnabled: true` e projeto com 2+ frames.
2. Modificar handles OUT do último frame e IN do primeiro frame.
3. Selecionar o trecho de loop no painel.
4. Clicar **Resetar curva**.
5. **Confirmar que os handles do loop voltam para a posição padrão.**
6. Confirmar que os trechos normais NÃO foram alterados.

### Teste G — handles independentes (regressão v8z4b21a)
1. Criar projeto com 3 frames.
2. Selecionar F2; arrastar handle OUT.
3. **Confirmar que apenas F2→F3 é alterado.**
4. Arrastar handle IN de F2.
5. **Confirmar que apenas F1→F2 é alterado.**
6. **Confirmar que mover OUT não move IN.**
7. **Confirmar que mover IN não move OUT.**

### Teste H — Preview e MP4 coerentes
1. Criar projeto com 2+ frames, curvesV2 ativo, smart movement.
2. Rodar Preview; observar trajetória.
3. Exportar MP4.
4. **Confirmar que MP4 segue a mesma trajetória do Preview.**
5. **Confirmar que não há parada falsa no MP4.**
6. Após Reset Curves, rodar Preview novamente.
7. **Confirmar que Preview reflete as curvas resetadas.**

### Teste I — loop sem falsa parada (regressão v8z4b21b)
1. Com `loopEnabled: true` e `framePauses` zerados.
2. Rodar Preview no modo loop.
3. **Confirmar que o trecho de fechamento N→1 não tem falsa parada.**
4. **Confirmar que a transição de volta ao frame inicial é suave.**

### Teste J — JSON salva v8z4b21c e curvesV2
1. Criar projeto, ajustar handles, acionar Reset Curves, salvar JSON.
2. Abrir o JSON.
3. **Confirmar `"version": "v8z4b21c"`.**
4. **Confirmar `curvesV2` presente e handles resetados salvos.**
5. Confirmar `framePauses` preservados.
6. Confirmar `segDurations` preservados.

### Teste K — compatibilidade com arquivos antigos
1. Abrir JSON antigo (sem curvesV2).
2. **Confirmar que abre sem erro.**
3. Confirmar conversão automática para curvesV2.
4. Confirmar que midpoint não aparece como ponto de edição.
5. Confirmar que ctrl-pt legado não aparece como UI.

### Teste L — sem erros de console
1. Executar os testes acima.
2. **Confirmar que não há NaN, Infinity ou erros no console.**

### Teste M — ROADMAP registrado sem implementação
1. Abrir ROADMAP.md.
2. Confirmar que **Direct Curve Drag** e **Assisted Frame Insertion** estão listados como futuros.
3. **Confirmar que não foram implementados na v8z4b21c.**

---

## v8z4b21b — fix smart movement timing for cubic curves

### Teste A — versão
1. Abrir app.
2. Confirmar que exibe `v8z4b21b` na UI (Settings).
3. Confirmar que nome exibe `fix smart movement timing for cubic curves`.

### Teste B — arquivo de regressão (arquivo salvo em v8z4b21a)
1. Abrir um arquivo JSON salvo em v8z4b21a com:
   - `curvesV2` presente
   - `segmentTimingMode: manual`
   - `constantSpeedTotalDuration: null`
   - `movementEasingMode: smart`
   - `framePauses` zerados em todos os frames
   - `loopEnabled: true`
2. Clicar em Preview.
3. **Confirmar que não há falsa parada ou ease indevido.**
4. **Confirmar que a câmera não freia quase até parar antes de chegar ao próximo frame** (sem framePause).
5. Confirmar que o movimento é suave ao longo dos trechos com curvesV2.

### Teste C — Movimento inteligente ligado/desligado sem regressão
1. Com o arquivo acima, desligar Movimento inteligente.
2. Confirmar que o movimento continua sem erro.
3. Religar Movimento inteligente.
4. **Confirmar que ainda não há falsa parada.**

### Teste D — Velocidade constante não regrediu
1. Com o mesmo arquivo, ativar Velocidade constante.
2. Confirmar que o Preview funciona normalmente.
3. Desativar Velocidade constante (modo manual).
4. Confirmar que o Preview volta ao comportamento esperado.

### Teste E — handles independentes (regressão v8z4b21a)
1. Criar projeto com 3 frames.
2. Selecionar F2; arrastar OUT handle.
3. **Confirmar que apenas F2→F3 é alterado.**
4. Arrastar IN handle de F2.
5. **Confirmar que apenas F1→F2 é alterado.**
6. **Confirmar que mover OUT não move IN.**
7. **Confirmar que mover IN não move OUT.**

### Teste F — Preview e MP4 coerentes
1. Criar projeto com 2+ frames, curvesV2 ativo, smart movement.
2. Rodar Preview; observar trajetória.
3. Exportar MP4.
4. **Confirmar que MP4 segue a mesma trajetória do Preview.**
5. **Confirmar que não há parada falsa no MP4.**

### Teste G — loop
1. Com `loopEnabled: true` e `framePauses` zerados.
2. Rodar Preview no modo loop.
3. **Confirmar que o trecho de fechamento N→1 não tem falsa parada.**
4. **Confirmar que a transição de volta ao frame inicial é suave.**

### Teste H — JSON salva v8z4b21b e curvesV2
1. Criar projeto, ajustar handles, salvar JSON.
2. Abrir o JSON.
3. **Confirmar `"version": "v8z4b21b"`.**
4. **Confirmar `curvesV2` presente e handles preservados.**

### Teste I — compatibilidade com arquivos antigos
1. Abrir JSON antigo (sem curvesV2).
2. **Confirmar que abre sem erro.**
3. Confirmar conversão automática para curvesV2.
4. Confirmar que midpoint não aparece como ponto de edição.
5. Confirmar que ctrl-pt legado não aparece como UI.

### Teste J — sem erros de console
1. Executar os testes acima.
2. **Confirmar que não há NaN, Infinity ou erros no console.**

### Teste K — ROADMAP registrado sem implementação
1. Abrir ROADMAP.md.
2. Confirmar que **Direct Curve Drag** e **Assisted Frame Insertion** estão listados como futuros.
3. **Confirmar que não foram implementados na v8z4b21b.**

---

## v8z4b21a — implement real cubic in-out handles

### Teste A — versão
1. Abrir app.
2. Confirmar que exibe `v8z4b21a` na UI (Settings).
3. Confirmar que nome da versão exibe `implement real cubic in-out handles`.

### Teste B — curvesV2 criado automaticamente
1. Carregar imagem.
2. Criar projeto com 3 frames.
3. Abrir console do browser.
4. **Confirmar log `[Arco v8z4b21a] convertLegacyCtrlPtsToCurvesV2: 2 segmentos convertidos`** (ou similar).
5. Confirmar que `curvesV2.mode === 'cubic'`.
6. Confirmar que `curvesV2.frameHandles.in` e `curvesV2.frameHandles.out` são arrays com `frameCount` entradas.

### Teste C — dois handles independentes por trecho
1. Criar projeto com 3 frames (F1→F2→F3).
2. Selecionar F2.
3. **Confirmar que aparecem dois handles distintos:** OUT (saída de F2→F3) e IN (entrada de F1→F2).
4. Arrastar o OUT handle de F2 para uma posição livre.
5. **Confirmar que apenas o trecho F2→F3 é alterado.**
6. **Confirmar que o trecho F1→F2 não foi alterado.**
7. Arrastar o IN handle de F2 para outra posição.
8. **Confirmar que apenas o trecho F1→F2 é alterado.**
9. **Confirmar que o trecho F2→F3 não foi alterado.**

### Teste D — Bézier cúbica real no canvas
1. Criar projeto com 2 frames.
2. Ajustar o OUT handle de F1 e o IN handle de F2 em posições independentes.
3. Verificar no SVG do canvas (DevTools) que o path contém `C` (não `Q`).
4. **Confirmar que a curva muda conforme ambos os handles são ajustados.**

### Teste E — Preview usa cubic
1. Criar projeto com 2 frames.
2. Ajustar ambos os handles do único trecho em posições distintas.
3. Clicar em Preview.
4. **Confirmar que a animação segue a curva cúbica real** (não a quadrática legacy).
5. Confirmar que o movimento visual é suave e consistente com os handles configurados.

### Teste F — JSON salva curvesV2
1. Criar projeto com 2 frames, ajustar handles manualmente.
2. Salvar JSON (Export > Save JSON ou equivalente).
3. Abrir o JSON em um editor de texto.
4. **Confirmar que `curvesV2` existe no JSON salvo.**
5. **Confirmar estrutura:** `{ version: 1, mode: "cubic", frameHandles: { in: [...], out: [...] } }`.
6. Confirmar que os vetores `dx`/`dy` refletem as posições ajustadas.

### Teste G — compatibilidade com arquivos antigos (sem curvesV2)
1. Abrir um JSON antigo (v8z4b20d ou anterior) que não contenha campo `curvesV2`.
2. **Confirmar que o projeto carrega sem erro.**
3. **Confirmar log `[Arco v8z4b21a] convertLegacyCtrlPtsToCurvesV2:`** no console.
4. Confirmar que a animação visual está preservada (não reseta para padrão).
5. Confirmar que os handles aparecem nos segmentos.

### Teste H — handles acompanham frame ao mover (regressão v8z4b20d)
1. Criar projeto com 4 frames.
2. Ajustar o OUT handle de F2 manualmente.
3. Mover o frame F2.
4. **Confirmar que o handle acompanha F2 visualmente** (haste parte do centro do frame).
5. **Confirmar que a curva NÃO reseta.**
6. Selecionar outro frame e voltar para F2.
7. **Confirmar que os handles estão coerentes.**

### Teste I — inserir frame no meio preserva curva (De Casteljau)
1. Criar projeto com 2 frames, ajustar handles do único trecho.
2. Anotar visualmente a forma da curva.
3. Inserir um frame no meio (botão "Insert Frame After").
4. **Confirmar que a forma visual da curva está preservada** (dois trechos formam a mesma curva original).
5. Confirmar que os novos handles do frame inserido fazem sentido geometricamente.

### Teste J — deletar frame remove handles correspondentes
1. Criar projeto com 4 frames.
2. Ajustar handles de todos os trechos.
3. Deletar F2 (frame intermediário).
4. **Confirmar que `curvesV2.frameHandles.in` e `.out` têm comprimento correto** (frameCount entradas).
5. Confirmar que os handles restantes estão coerentes.

### Teste K — templates resetam curvesV2 corretamente
1. Abrir o app, aplicar um template qualquer (ex: pan-lr, rotation, circle).
2. Ajustar alguns handles manualmente.
3. Aplicar outro template.
4. **Confirmar que os handles do template novo estão corretos** (não há contaminação do template anterior).
5. Confirmar no console que `convertLegacyCtrlPtsToCurvesV2` foi chamado após o template.

### Teste L — Undo/Redo preserva curvesV2
1. Criar projeto com 2 frames.
2. Ajustar o OUT handle de F1.
3. Pressionar Ctrl+Z (Undo).
4. **Confirmar que o handle voltou à posição anterior.**
5. Pressionar Ctrl+Y (Redo).
6. **Confirmar que o handle voltou à posição ajustada.**

### Teste M — modo livre/Angular por padrão (sem Smooth)
1. Criar projeto com 3 frames.
2. Selecionar F2.
3. Arrastar o OUT handle independentemente.
4. **Confirmar que o IN handle NÃO se move em espelho** (modo Angular/livre, não Smooth).
5. Arrastar o IN handle independentemente.
6. **Confirmar que o OUT handle NÃO se move em espelho.**

### Teste N — handles em endpoints
1. Criar projeto com 2 frames (F1, F2), sem loop.
2. Selecionar F1 → **confirmar que aparece apenas OUT handle interativo**.
3. Selecionar F2 → **confirmar que aparece apenas IN handle interativo**.
4. Confirmar que não há handle fantasma desnecessário nos endpoints.

### Teste O — regressão: MP4 export usa cubic
1. Criar projeto com 2 frames, handles ajustados em posições assimétricas.
2. Exportar como MP4 (ou usar função de renderização interna).
3. **Confirmar que a animação do MP4 corresponde visualmente ao Preview** (mesma curva cúbica).

---

## v8z4b20d — fix handle sync after frame move and visible segment handles

### Teste A — versão
1. Abrir app.
2. Confirmar que exibe `v8z4b20d` na UI (Settings).
3. Confirmar que nome da versão exibe `fix handle sync after frame move and visible segment handles`.

### Teste B — handle acompanha frame ao mover (bug principal)
1. Carregar imagem.
2. Criar projeto com 4 ou mais frames.
3. Selecionar um frame intermediário (ex: F2).
4. Arrastar o OUT handle para ajustar a curva.
5. Mover o frame F2.
6. **Confirmar que o handle acompanha o frame visualmente.**
7. **Confirmar que a haste do handle parte do centro atual do frame.**
8. **Confirmar que a curva NÃO reseta para padrão automático.**
9. Selecionar outro frame e voltar para F2.
10. **Confirmar que os handles continuam coerentes.**

### Teste C — handles em endpoints, sem loop
1. Criar projeto com 2 frames, sem loop.
2. Selecionar F1 → confirmar que aparece **OUT** interativo.
3. Confirmar que IN de F2 aparece como **ghost** (âmbar com menor opacidade, não interativo).
4. Selecionar F2 → confirmar que aparece **IN** interativo.
5. Confirmar que OUT de F1 aparece como **ghost** (não interativo).

### Teste D — handle de loop acompanha frame ao mover
1. Criar projeto com 2+ frames. Ativar loop.
2. Selecionar F1 → confirmar handle IN do loop (roxo).
3. Arrastar o handle IN do loop.
4. Mover F1.
5. **Confirmar que o handle de loop acompanha F1 visualmente.**
6. **Confirmar que loopCtrlPt não reseta.**
7. Repetir para o último frame com handle OUT do loop.
8. Mover o último frame após ajustar handle de loop.
9. **Confirmar que handle acompanha o último frame.**

### Teste E — edição local por trecho (regressão)
1. Criar projeto com 3+ frames.
2. Selecionar F2 → ajustar IN handle (edita trecho F1→F2).
3. **Confirmar que o trecho F2→F3 não foi alterado.**
4. Selecionar F2 → ajustar OUT handle (edita trecho F2→F3).
5. **Confirmar que o trecho F1→F2 não foi alterado.**

### Teste F — segBlurSettings normalizado
1. Criar projeto com 6 frames.
2. Salvar como _img.json.
3. Abrir o JSON no editor de texto.
4. **Confirmar que `segBlurSettings` tem exatamente 5 entradas (frameCount - 1 = 5).**
5. Deletar o frame F4 (via botão −).
6. Salvar novamente.
7. **Confirmar que `segBlurSettings` tem 4 entradas.**

### Teste G — Undo/Redo por handle
1. Ajustar handle de um trecho.
2. Fazer Undo → **confirmar que curva voltou ao estado anterior.**
3. Fazer Redo → **confirmar que curva reaplicada.**
4. Tocar sem mover o handle → **confirmar que não cria undo extra.**

### Teste H — midpoint e ctrl-pt legado
1. Em qualquer projeto:
2. **Confirmar que midpoint automático NÃO aparece na UI.**
3. **Confirmar que ctrl-pt/losango legado NÃO aparece para segmentos normais.**

### Teste I — Preview e MP4
1. Rodar Preview → **confirmar que segue as curvas ajustadas.**
2. Gerar MP4 → **confirmar que segue as curvas.**
3. Salvar MP4 → **confirmar que botão não trava.**
4. Voltar antes de terminar MP4 → **confirmar que stage não trava.**

### Teste J — JSON legado sem campos novos
1. Salvar projeto com imagem (_img.json).
2. **Confirmar que versão é `v8z4b20d`.**
3. **Confirmar ausência de campos proibidos:**
   - curvesV2, vectorPath, handles, frameHandles, frameTangents
   - inHandles, outHandles, anchorHandles, pathPoints, midpoints
   - runtimeCurveModel, spans, capabilities, generatedMp4, exportBlob
   - selfTest, legacyCurvePatch
4. Abrir JSON da v8z4b20c → **confirmar compatibilidade.**

### Teste K — drag de frames normal
1. **Confirmar que drag de frames continua funcionando.**
2. **Confirmar que frame travado não move.**
3. **Confirmar que selecionar outro frame esconde handles corretamente.**

---

## v8z4b20c — fix endpoint loop handles and segment-local editing

### Teste A — versão
1. Abrir app.
2. Confirmar que exibe `v8z4b20c` na UI (Settings).
3. Confirmar que nome da versão exibe `fix endpoint loop handles and segment-local editing`.

### Teste B — handles em endpoints (sem loop)
1. Carregar imagem.
2. Criar projeto com 2 frames, sem loop.
3. Selecionar F1 → confirmar que aparece **OUT** handle.
4. Selecionar F2 → confirmar que aparece **IN** handle.
5. Criar projeto com 4 frames, sem loop.
6. Confirmar: F1=OUT; F2=IN+OUT; F3=IN+OUT; F4=IN.
7. Confirmar que midpoint **não** aparece.
8. Confirmar que ctrl-pt legado **não** aparece.

### Teste C — handles com loop
1. Ativar loop com 2 frames.
2. Confirmar: F1=IN(loop)+OUT; F2=IN+OUT(loop).
3. Criar projeto com 4 frames e ativar loop.
4. Confirmar: F1=IN(loop)+OUT; F2=IN+OUT; F3=IN+OUT; F4=IN+OUT(loop).
5. Confirmar que handles de loop têm cor diferente (roxa).
6. Confirmar que loop ctrl-pt legado fica oculto quando handles de loop são exibidos.

### Teste D — segment-local editing
1. Projeto com 5 frames, sem loop.
2. Selecionar F3 e ajustar IN handle (trecho F2→F3).
3. Confirmar que apenas o trecho F2→F3 muda.
4. Confirmar que trecho F3→F4 **não** muda automaticamente.
5. Selecionar F4 e ajustar IN handle (trecho F3→F4).
6. Confirmar que apenas o trecho F3→F4 muda.
7. Confirmar que trecho F2→F3 **não** foi resetado.

### Teste E — OUT de F4 e IN de F5 são o mesmo trecho
1. Projeto com 5 frames.
2. Selecionar F4, arrastar OUT handle (trecho F4→F5).
3. Selecionar F5, verificar que IN handle reflete a mesma posição do ctrlPt F4→F5.
4. Arrastar IN de F5 (mesmo trecho F4→F5).
5. Confirmar que trecho F3→F4 **não** mudou.
6. Confirmar que trecho F5→F6 (se existir) **não** mudou.

### Teste F — Handles de loop
1. Projeto com pelo menos 2 frames, loop ativo.
2. Selecionar F1, arrastar IN handle (loop).
3. Confirmar que `loopCtrlPt` muda.
4. Selecionar último frame, verificar que OUT handle de loop reflete mesmo `loopCtrlPt`.
5. Arrastar OUT do último frame (loop).
6. Confirmar que trechos normais não foram alterados.
7. Undo → confirmar que `loopCtrlPt` voltou ao estado anterior.
8. Redo → confirmar que `loopCtrlPt` foi refeito.

### Teste G — Undo/Redo
1. Ajustar qualquer handle.
2. Confirmar Undo reverte apenas aquele trecho.
3. Confirmar Redo refaz apenas aquele trecho.
4. Confirmar tocar sem mover não cria undo.
5. Confirmar não há undo duplicado.

### Teste H — bugfix mover frame preservado
1. Selecionar F1 (2 frames mínimo).
2. Arrastar OUT handle para ajustar curva.
3. Mover F1 para nova posição.
4. Confirmar que curva não resetou para padrão automático.

### Teste I — Preview, MP4, Salvar
1. Rodar Preview — confirmar que respeita as curvas ajustadas.
2. Gerar MP4 — confirmar que respeita as curvas.
3. Salvar MP4 — confirmar que botão não fica preso.
4. Salvar projeto → confirmar version=v8z4b20c, sem campos novos no JSON.
5. Abrir projeto salvo em v8z4b20b → confirmar compatibilidade.

### Teste J — Campos proibidos no JSON
Confirmar que **nenhum** destes campos aparece no JSON salvo:
`curvesV2`, `vectorPath`, `handles`, `frameHandles`, `frameTangents`,
`inHandles`, `outHandles`, `anchorHandles`, `pathPoints`, `midpoints`,
`runtimeCurveModel`, `capabilities`, `spans`, `generatedMp4`, `exportBlob`.

---

## v8z4b20b — prototype active frame in-out handles

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b20b` na UI (Settings).
3. Confirmar que nome da versão exibe `prototype active frame in-out handles`.

### Teste B — dois handles no frame intermediário ativo
1. Carregar imagem.
2. Criar projeto com pelo menos 4 frames.
3. Selecionar F2 ou F3 (frame intermediário).
4. Confirmar que aparecem **dois** handles losango âmbar:
   - Handle de **entrada (IN)**: um dos lados, mais suave.
   - Handle de **saída (OUT)**: lado oposto, mais vivo (z-index maior).
5. Confirmar que F1 **não** mostra esses handles.
6. Confirmar que o último frame **não** mostra esses handles.
7. Confirmar que o midpoint automático **NÃO** aparece.
8. Confirmar que o puxador/losango legado (ctrl-pt) **não** aparece como controle principal.
9. Confirmar que os dois handles **não** parecem novos frames.

### Teste C — braços de haste visíveis
1. Com frame intermediário ativo, confirmar que há duas hastes (linhas):
   - Braço IN: âmbar mais suave, tracejado, do centro do frame ao IN handle.
   - Braço OUT: âmbar mais vivo, sólido, do centro do frame ao OUT handle.
2. Confirmar que as linhas partem do centro do frame ativo.

### Teste D — arrastar handle de saída (OUT)
1. Com frame intermediário ativo, arrastar o OUT handle.
2. Confirmar que a curva do **trecho seguinte** muda em tempo real.
3. Confirmar que, em modo suave/linkado, o **trecho anterior** também se ajusta coerentemente.
4. Confirmar que os dois handles ficam visualmente alinhados (colineares) em modo suave.

### Teste E — arrastar handle de entrada (IN)
1. Com frame intermediário ativo, arrastar o IN handle.
2. Confirmar que a curva do **trecho anterior** muda em tempo real.
3. Confirmar que, em modo suave/linkado, o **trecho seguinte** também se ajusta.
4. Confirmar que os dois handles ficam visualmente alinhados.

### Teste F — força por distância
1. Arrastar qualquer handle para perto do centro do frame.
2. Confirmar que a curva tem suavidade leve (pouco desvio).
3. Arrastar o handle para mais longe do centro.
4. Confirmar que a curva fica mais oblíqua/pronunciada.
5. Confirmar que a curva não explode nem sai da tela.

### Teste G — Undo/Redo
1. Ajustar um handle.
2. Confirmar que **Undo** reverte a alteração nos dois trechos.
3. Confirmar que **Redo** refaz a alteração nos dois trechos.
4. Confirmar que tocar sem mover não cria undo.
5. Confirmar que não há undo duplicado.

### Teste H — tangente preservada ao mover frame (não regrediu)
1. Selecionar frame intermediário (F2 de pelo menos 4 frames).
2. Arrastar qualquer handle para ajustar a curva.
3. **Sem desfazer**, arrastar o próprio frame para nova posição.
4. Confirmar que a curva **NÃO reseta** para ângulo reto/padrão automático.

### Teste I — seleção de outro frame
1. Confirmar que selecionar outro frame (F1 ou último) oculta os dois handles.
2. Confirmar que selecionar um frame intermediário diferente reposiciona os handles.

### Teste J — loop não quebrou
1. Ativar loop.
2. Confirmar que a curva de loop aparece imediatamente.
3. Confirmar que o loop ctrl-pt (bolinha roxa) permanece visível e arrastável.
4. Confirmar que os handles IN/OUT **não** aparecem no loop.
5. Confirmar que midpoint do loop não aparece.

### Teste K — Preview e MP4
1. Rodar Preview.
2. Confirmar que Preview respeita as curvas ajustadas pelos handles.
3. Confirmar que os handles **não** aparecem no Preview (sem imagem de handle).
4. Gerar MP4.
5. Confirmar que MP4 respeita as curvas.
6. Confirmar que Salvar MP4 não fica preso em estado done/pronto.
7. Confirmar que ao sair do Preview o MP4 gerado é limpo.
8. Iniciar geração de MP4 e tocar Voltar antes de terminar — Stage não deve travar.

### Teste L — drag de frames não bloqueado pelos handles
1. Confirmar que dragging de frames continua funcionando.
2. Confirmar que os handles não interceptam drag de frames indevidamente.

### Teste M — JSON schema
1. Salvar projeto com imagem:
   - `filename` termina em `_img.json`.
   - `version` salvo como `v8z4b20b`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - `filename` termina em `_file.json`.
   - `version` salvo como `v8z4b20b`.
   - `imageBase64` não existe.
3. Abrir JSON salvo em v8z4b20a e confirmar compatibilidade.
4. Confirmar que **nenhum** campo proibido apareceu no JSON:
   `curvesV2`, `vectorPath`, `handles`, `frameHandles`, `frameTangents`,
   `inHandles`, `outHandles`, `anchorHandles`, `pathPoints`, `midpoints`,
   `runtimeCurveModel`, `capabilities`, `spans`, `generatedMp4`, `exportBlob`,
   `legacyCurvePatch`, `patchCandidate`, `patchApplicationDraft`,
   `realCurvePatchApplication`, `selfTest`.

### Teste N — erros de console
1. Confirmar que não há erro de console, NaN ou Infinity visíveis.

### Teste O — ROADMAP atualizado
1. Confirmar que ROADMAP registrou:
   - v8z4b20b como protótipo de dois handles IN/OUT.
   - Modo Angular/Livre como futuro.
   - Menu contextual (Illustrator-style) como futuro.
   - Pen/Patch Tool como futuro.
   - Desenho livre com dedo como futuro.
   - Ponto auxiliar/frame falso como futuro.

---

## v8z4b20a — demote midpoint UI and document anchor handle model

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b20a` na UI (Settings).
3. Confirmar que nome da versão exibe `demote midpoint UI and document anchor handle model`.

### Teste B — handle de frame visível, midpoint não aparece
1. Carregar imagem.
2. Criar projeto com pelo menos 4 frames.
3. Selecionar F2 ou F3 (frame intermediário).
4. Confirmar que o **handle de frame** (losango/diamante âmbar) aparece.
5. Confirmar que o **midpoint pathPoint** (círculo branco/colorido) **NÃO aparece** por padrão.
6. Confirmar que o **puxador/losango legado** (ctrl-pt) também não aparece como controle principal.

### Teste C — drag do handle de frame funciona
1. Com frame intermediário ativo, arrastar o losango âmbar.
2. Confirmar que os dois trechos vizinhos mudam em tempo real.
3. Confirmar que distância do handle continua alterando força/intensidade da tangente.
4. Confirmar que Undo reverte a alteração.
5. Confirmar que Redo refaz a alteração.
6. Confirmar que tocar sem mover não cria undo.

### Teste D — tangente preservada ao mover frame (não regrediu)
1. Selecionar frame intermediário (F2 de pelo menos 4 frames).
2. Arrastar o losango âmbar para ajustar a tangente.
3. **Sem desfazer**, arrastar o próprio frame para nova posição.
4. Confirmar que a curva/tangente **NÃO reseta** para ângulo reto/padrão automático.

### Teste E — midpoint oculto não bloqueia toque
1. Confirmar que tocar na área onde o midpoint estaria não bloqueia drag de frames.
2. Confirmar que drag de frames continua funcionando normalmente.
3. Confirmar que selecionar outro frame atualiza/esconde handle corretamente.

### Teste F — loop funciona, midpoint oculto não quebra loop
1. Ativar loop.
2. Confirmar que a curva de loop aparece imediatamente.
3. Confirmar que o loop ctrl-pt (bolinha roxa) permanece visível e arrastável.
4. Confirmar que o midpoint do loop NÃO aparece.
5. Confirmar que a curva de loop continua funcionando normalmente.

### Teste G — Preview e MP4
1. Rodar Preview.
2. Confirmar que Preview respeita as curvas ajustadas pelo handle.
3. Gerar MP4.
4. Confirmar que MP4 respeita as curvas.
5. Confirmar que Salvar MP4 não fica preso em estado done/pronto.
6. Confirmar que ao sair do Preview o MP4 gerado é limpo.
7. Iniciar geração de MP4 e tocar Voltar antes de terminar — Stage não deve travar.

### Teste H — JSON schema
1. Salvar projeto com imagem:
   - `filename` termina em `_img.json`.
   - `version` salvo como `v8z4b20a`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - `filename` termina em `_file.json`.
   - `version` salvo como `v8z4b20a`.
   - `imageBase64` não existe.
3. Abrir JSON salvo em v8z4b19z e confirmar compatibilidade.
4. Confirmar que nenhum campo proibido apareceu no JSON:
   `curvesV2`, `vectorPath`, `handles`, `frameHandles`, `frameTangents`,
   `inHandles`, `outHandles`, `anchorHandles`, `pathPoints`, `midpoints`,
   `runtimeCurveModel`, `capabilities`, `spans`, `generatedMp4`, `exportBlob`,
   `legacyCurvePatch`, `patchCandidate`, `patchApplicationDraft`,
   `realCurvePatchApplication`, `selfTest`.

### Teste I — erros de console
1. Confirmar que não há erro de console, NaN ou Infinity visíveis.

### Teste J — ROADMAP
1. Confirmar que ROADMAP registrou:
   - Modelo âncoras/handles com handles de entrada e saída.
   - Estados Angular/Suavizar/Reta/Remover.
   - Pen/Patch Tool.
   - Desenho livre com dedo.
   - Ponto auxiliar/frame falso como alternativa ao midpoint automático.
   - Midpoint classificado como legado/fallback, não UI principal.

## v8z4b19z — preserve frame tangent edits when moving frames

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19z` na UI (Settings).
3. Confirmar que nome da versão exibe `preserve frame tangent edits when moving frames`.

### Teste B — handle de frame é losango/diamante
1. Carregar imagem.
2. Criar projeto com pelo menos 3 frames.
3. Selecionar frame intermediário (F2 em 3-frame).
4. Confirmar que aparece um **losango/diamante âmbar** deslocado do centro do frame ativo.
5. Confirmar que **não** é um círculo igual ao midpoint pathPoint.
6. Confirmar que existe uma linha tracejada âmbar conectando o centro do frame ao losango.

### Teste C — distância do handle controla força da tangente
1. Com frame intermediário ativo, arrastar o losango âmbar para perto do centro do frame.
2. Confirmar que a curva tem suavidade leve (pouco desvio).
3. Arrastar o losango para mais longe do centro.
4. Confirmar que a curva fica mais oblíqua/pronunciada.
5. Confirmar que a curva não explode nem sai da tela.

### Teste D — tangente preservada ao mover frame (bug principal)
1. Selecionar frame intermediário (F2 de pelo menos 4 frames).
2. Arrastar o losango âmbar para ajustar a tangente — curva deve mudar.
3. **Sem desfazer**, arrastar o próprio frame para uma nova posição.
4. Confirmar que a curva/tangente **NÃO reseta** para ângulo reto/padrão automático.
5. Confirmar que `ctrlPtManual` dos segmentos vizinhos foi preservado.
6. Confirmar que a passagem pelo frame ainda reflete o ajuste manual.

### Teste E — undo/redo cobre dois ctrlPts
1. Arrastar o losango âmbar.
2. Confirmar que Ctrl+Z / botão Undo reverte a alteração dos dois segmentos vizinhos.
3. Confirmar que Ctrl+Y / botão Redo refaz a alteração dos dois segmentos.
4. Confirmar que não há undo duplicado (um undo por arrasto).
5. Tocar no losango sem mover — confirmar que não cria undo.

### Teste F — midpoint pathPoint não afetado
1. Confirmar que o midpoint pathPoint (círculo branco/colorido) continua visível.
2. Confirmar que arrastar o midpoint pathPoint continua funcionando.
3. Confirmar que o losango âmbar não bloqueia acesso ao midpoint.

### Teste G — antigo puxador legado continua oculto
1. Com midpoint pathPoint ativo no segmento, confirmar que o losango legado está oculto.
2. Confirmar que não há segundo controle legado visível.

### Teste H — loop não regrediu
1. Ativar loop.
2. Confirmar que a curva de loop continua aparecendo.
3. Confirmar que o handle de frame não quebra o loop.
4. Confirmar que midpoint pathPoint do loop continua editável.

### Teste I — Preview e MP4
1. Rodar Preview.
2. Confirmar que Preview respeita as curvas ajustadas pelo handle.
3. Gerar MP4.
4. Confirmar que MP4 respeita as curvas ajustadas pelo handle.
5. Confirmar que Salvar MP4 não fica preso em estado done/pronto.

### Teste J — JSON schema
1. Salvar projeto.
2. Abrir JSON e confirmar:
   - `version: "v8z4b19z"`
   - `ctrlPts` preservado
   - `ctrlPtManual` preservado
   - Nenhum dos campos proibidos: `handles`, `frameHandles`, `frameTangents`, `pathPoints`, `curvesV2`, `vectorPath`, etc.

## v8z4b19y — add active frame tangent handle prototype

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19y` na UI (Settings).
3. Confirmar que nome da versão exibe `add active frame tangent handle prototype`.

### Teste B — handle de tangente aparece
1. Carregar imagem.
2. Criar projeto com pelo menos 3 frames.
3. Selecionar frame intermediário (F2 em 3-frame, por exemplo).
4. Confirmar que aparece um **círculo âmbar/dourado** deslocado do centro do frame ativo.
5. Confirmar que existe uma **linha tracejada âmbar** conectando o centro do frame ao círculo.
6. Selecionar F1 ou último frame — confirmar que o handle **não aparece** (só em frames intermediários).

### Teste C — drag do handle ajusta curvas
1. Com frame intermediário ativo (F2 de 3), arrastar o círculo âmbar.
2. Confirmar que as curvas do segmento anterior e posterior ao frame se atualizam em tempo real.
3. Confirmar que a passagem pelo frame ativo fica suave (C1-ish).
4. Confirmar que o handle se move para onde o usuário arrastou.

### Teste D — undo lazy (sem toque sem movimento)
1. Tocar no handle âmbar sem arrastar.
2. Soltar imediatamente.
3. Confirmar que **não há nova entrada de undo** (Ctrl+Z / botão de undo não deve reverter nada novo).
4. Arrastar o handle alguns pixels.
5. Confirmar que Ctrl+Z reverte o arrasto.

### Teste E — whitelist do custBar
1. Abrir menu contextual (custBar).
2. Tocar no handle âmbar enquanto o custBar estiver aberto.
3. Confirmar que o custBar **não fecha** ao tocar no handle.

### Teste F — isoMode e preview
1. Entrar em isoMode ou preview.
2. Confirmar que o handle âmbar **não aparece**.

---

## v8z4b19x — hide legacy curve puller when midpoint path point is active

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19x` na UI (Settings).
3. Confirmar que nome da versão exibe `hide legacy curve puller when midpoint path point is active`.

### Teste B — losango legado oculto quando midpoint ativo
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Selecionar frame F2 (ativo).
4. Confirmar que o midpoint pathPoint (círculo branco/colorido) está visível sobre a curva ativa.
5. **Confirmar que o losango/curvePuller NÃO está visível** — deve estar completamente oculto (opacity 0), não apenas translúcido.
6. Confirmar que não há segundo controle visual aparente sobre a curva.
7. Tentar arrastar tocando diretamente no ponto branco sobre a curva.
8. Confirmar que o arrasto parte do midpoint pathPoint.
9. Confirmar que a curva passa pelo ponto arrastado em tempo real.
10. Soltar e confirmar que a curva permanece na posição editada.

### Teste C — fallback do losango
1. Se o midpoint pathPoint não puder ser calculado para um segmento (ex: curva degenerada):
   - Confirmar que o losango recupera interatividade e visibilidade (opacity normal, pointer-events normal).
   - Confirmar que não há quebra ou tela travada.

### Teste D — Undo/Redo do midpoint pathPoint
1. Arrastar midpoint pathPoint.
2. Confirmar Undo (curva volta ao estado anterior).
3. Confirmar Redo (curva volta ao estado editado).
4. Confirmar que não há undo duplicado (um undo por arrasto).
5. Tocar no midpoint pathPoint sem mover — confirmar que não cria undo.

### Teste E — drag de frames após edição
1. Após editar midpoint pathPoint, arrastar frame.
2. Confirmar que a curva não pula nem reseta sozinha.
3. Confirmar que drag de frames continua funcionando normalmente.

### Teste F — loop
1. Ativar loop com pelo menos 2 frames.
2. Selecionar F1 ou último frame.
3. Confirmar que curva de loop aparece imediatamente.
4. Confirmar que midpoint pathPoint do loop está visível sobre a curva de loop.
5. **Confirmar que loopEl (losango roxo) NÃO está visível** quando midpt_loop está disponível.
6. Arrastar midpoint pathPoint do loop.
7. Confirmar que a curva de loop passa pelo ponto arrastado.
8. Confirmar Undo/Redo do loop.

### Teste G — Preview e MP4
1. Rodar Preview.
2. Confirmar que faixa preta superior do Preview continua presente.
3. Confirmar que Preview respeita a curva editada pelo midpoint pathPoint.
4. Gerar MP4.
5. Confirmar que MP4 respeita a curva editada.
6. Tocar em Salvar MP4.
7. Confirmar que botão não fica preso em estado done/pronto.
8. Ao sair do Preview, confirmar que MP4 gerado é limpo.
9. Iniciar geração de MP4 e tocar Voltar antes de terminar — confirmar que Stage não trava.

### Teste H — persistência JSON
1. Salvar projeto com imagem:
   - filename termina em `_img.json`; version = `v8z4b19x`; imageBase64 existe;
   - ctrlPts preservado; ctrlPtManual preservado; loopCtrlPt preservado (se loop ativo);
   - framePauses preservado; segDurations preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`; version = `v8z4b19x`; imageBase64 não existe;
   - ctrlPts preservado; ctrlPtManual preservado.
3. Abrir JSON salvo em v8z4b19w — confirmar compatibilidade.
4. Confirmar que estes campos NÃO aparecem no JSON:
   - curvesV2, vectorPath, handles, pathPoints, runtimeCurveModel, capabilities, spans,
     generatedMp4, exportBlob, legacyCurvePatch, patchCandidate, patchApplicationDraft,
     realCurvePatchApplication, selfTest.
5. Confirmar que segDurations não mudou de schema.

### Teste I — console
1. Confirmar que não há erro de console, NaN ou Infinity durante edição de midpoint.
2. Confirmar que não há erro ao abrir projeto v8z4b19w anterior.

---

## v8z4b19w — make midpoint path point primary curve control

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19w` na UI (Settings).
3. Confirmar que nome da versão exibe `make midpoint path point primary curve control`.

### Teste B — midpoint pathPoint como controle principal
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Selecionar frame F2 (ativo).
4. Confirmar que o midpoint pathPoint (círculo branco/colorido) está visível sobre a curva ativa.
5. Confirmar que o losango/curvePuller está visível mas com opacidade reduzida (~40%).
6. Tentar arrastar tocando diretamente no ponto branco sobre a curva.
7. Confirmar que o arrasto parte do midpoint pathPoint (não do losango).
8. Confirmar que a curva passa pelo ponto arrastado em tempo real.
9. Confirmar que o losango não é o controle que recebe o gesto.
10. Confirmar que o losango acompanha a conversão interna (se visível).
11. Soltar e confirmar que a curva permanece na posição editada.

### Teste C — Undo/Redo do midpoint pathPoint
1. Arrastar midpoint pathPoint.
2. Confirmar Undo (curva volta ao estado anterior).
3. Confirmar Redo (curva volta ao estado editado).
4. Confirmar que não há undo duplicado (um undo por arrasto).
5. Tocar no midpoint pathPoint sem mover — confirmar que não cria undo.

### Teste D — drag de frames após edição
1. Após editar midpoint pathPoint, arrastar frame.
2. Confirmar que a curva não pula nem reseta sozinha.
3. Confirmar que drag de frames continua funcionando normalmente.

### Teste E — fallback do losango
1. Se o midpoint pathPoint não puder ser calculado para um segmento (ex: curva degenerada):
   - Confirmar que o losango recupera interatividade (pointer-events normal, opacity normal).
   - Confirmar que não há quebra ou tela travada.

### Teste F — loop
1. Ativar loop com pelo menos 2 frames.
2. Selecionar F1 ou último frame.
3. Confirmar que curva de loop aparece imediatamente.
4. Confirmar que midpoint pathPoint do loop está visível sobre a curva de loop.
5. Confirmar que loopEl (losango roxo) está com opacidade reduzida.
6. Arrastar midpoint pathPoint do loop.
7. Confirmar que a curva de loop passa pelo ponto arrastado.
8. Confirmar Undo/Redo do loop.

### Teste G — Preview e MP4
1. Rodar Preview.
2. Confirmar que faixa preta superior do Preview continua presente.
3. Confirmar que Preview respeita a curva editada pelo midpoint pathPoint.
4. Gerar MP4.
5. Confirmar que MP4 respeita a curva editada.
6. Tocar em Salvar MP4.
7. Confirmar que botão não fica preso.
8. Ao sair do Preview, confirmar que MP4 gerado é limpo.
9. Iniciar geração de MP4 e tocar Voltar antes de terminar — confirmar que Stage não trava.

### Teste H — persistência JSON
1. Salvar projeto com imagem:
   - filename termina em `_img.json`; version = `v8z4b19w`; imageBase64 existe;
   - ctrlPts preservado; ctrlPtManual preservado; loopCtrlPt preservado (se loop ativo);
   - framePauses preservado; segDurations preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`; version = `v8z4b19w`; imageBase64 não existe;
   - ctrlPts preservado; ctrlPtManual preservado.
3. Abrir JSON salvo em v8z4b19v — confirmar compatibilidade.
4. Confirmar que estes campos NÃO aparecem no JSON:
   - curvesV2, vectorPath, handles, pathPoints, runtimeCurveModel, capabilities, spans,
     generatedMp4, exportBlob, legacyCurvePatch, patchCandidate, patchApplicationDraft,
     realCurvePatchApplication, selfTest.

### Teste I — console
1. Confirmar que não há erro de console, NaN ou Infinity durante edição de midpoint.
2. Confirmar que não há erro ao abrir projeto v8z4b19v anterior.

---

## v8z4b19v — enable midpoint path point editing

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19v` na UI (Settings).
3. Confirmar que nome da versão exibe `enable midpoint path point editing`.

### Teste B — midpoint pathPoint: exibição
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Selecionar frame F2 (ativo).
4. Confirmar que aparecem dois midpoint pathPoints: um no segmento F1→F2 (azul) e um no segmento F2→F3 (laranja).
5. Confirmar que os midpoint pathPoints estão sobre as curvas correspondentes.
6. Selecionar F1: confirmar que midpoint do segmento F1→F2 (laranja) está visível.
7. Selecionar frame intermediário sem curvas: confirmar que midpoints aparecem apenas nos segmentos adjacentes ao frame ativo.

### Teste C — midpoint pathPoint: edição de segmento normal
1. Selecionar trecho/frame ativo (ex: F2).
2. Arrastar o midpoint pathPoint do segmento F1→F2.
3. Confirmar que a curva atualiza em tempo real durante o arrasto.
4. Confirmar que a curva passa pelo ponto onde o midpoint foi solto.
5. Confirmar Undo da edição (curva volta ao estado anterior).
6. Confirmar Redo da edição (curva volta ao estado editado).
7. Confirmar que não há undo duplicado.
8. Arrastar frame depois de editar midpoint pathPoint.
9. Confirmar que a curva não pula nem reseta sozinha.

### Teste D — midpoint pathPoint: não conflita com curvePuller
1. Editar curva normal pelo fluxo antigo (arrastando o curvePuller — losango colorido).
2. Confirmar que curva normal continua funcionando pelo fluxo antigo.
3. Editar pelo midpoint pathPoint no mesmo segmento.
4. Confirmar que ambas as edições funcionam independentemente.
5. Confirmar Undo/Redo de ambas.

### Teste E — midpoint pathPoint: loop
1. Ativar loop via chip Loop no painel Duração.
2. Confirmar que curva de loop aparece imediatamente no Stage.
3. Confirmar que midpoint pathPoint do loop (roxo) aparece quando F1 ou último frame está ativo.
4. Arrastar midpoint pathPoint do loop.
5. Confirmar que a curva de loop atualiza em tempo real.
6. Confirmar Undo/Redo do loop.
7. Confirmar que Preview respeita a curva de loop editada.

### Teste F — faixa preta superior (regressão v8z4b19n)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que a faixa preta superior continua presente.
4. Confirmar que o canvas não invade a Dynamic Island.

### Teste G — Preview (regressão)
1. Rodar Preview.
2. Confirmar que Preview respeita a curva editada pelo midpoint pathPoint.
3. Confirmar que Preview respeita curvas normais e loop.
4. Confirmar que a faixa preta superior do Preview continua presente.

### Teste H — MP4/export e botão Salvar MP4 (regressão v8z4b19s)
1. Editar midpoint pathPoint de um segmento.
2. Gerar MP4.
3. Confirmar que MP4 respeita a curva editada pelo midpoint pathPoint.
4. Tocar em **Salvar MP4**.
5. Confirmar que o salvamento/download inicia normalmente.
6. Confirmar que o botão **não** fica preso em estado done/pronto/ativo.
7. Confirmar que, ao sair do Preview, o MP4 gerado é limpo (regressão v8z4b19o).
8. Iniciar geração de MP4 e tocar Voltar antes de terminar.
9. Confirmar que Stage não trava.

### Teste I — save/load (regressão)
1. Editar midpoint pathPoint.
2. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19v`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado (true no segmento editado).
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
3. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19v`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
4. Abrir JSON salvo em v8z4b19u com imagem e confirmar compatibilidade total.
5. Confirmar que nenhum destes campos apareceu no JSON:
   - `curvesV2`, `vectorPath`, `handles`, `pathPoints`
   - `runtimeCurveModel`, `capabilities`, `spans`
   - `generatedMp4`, `exportBlob`
   - `legacyCurvePatch`, `patchCandidate`, `patchApplicationDraft`, `realCurvePatchApplication`
   - `selfTest`, `midpointDragState`
6. Confirmar que não há erro de console, NaN ou Infinity.

---

## v8z4b19u — route existing curve edits through guarded patch applier

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19u` na UI (Settings).
3. Confirmar que nome da versão exibe `route existing curve edits through guarded patch applier`.

### Teste B — faixa preta superior (regressão v8z4b19n)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que a faixa preta superior continua presente.
4. Confirmar que o canvas não invade a Dynamic Island.

### Teste C — curvas normais (edição via novo pipeline)
1. Criar projeto com pelo menos 4 frames.
2. Puxar curva normal F1→F2.
3. Confirmar que curva muda visualmente igual à v8z4b19t.
4. Puxar curva normal F2→F3.
5. Confirmar que curva muda visualmente igual à v8z4b19t.
6. Confirmar Undo da curva normal (curva volta ao estado anterior).
7. Confirmar Redo da curva normal (curva avança ao estado seguinte).
8. Mover frame depois de puxar curvas e confirmar que as curvas não pulam.

### Teste D — loop e curva de loop (edição via novo pipeline)
1. Ativar loop via chip Loop no painel Duração.
2. Confirmar que curva de loop aparece imediatamente no Stage, sem tocar no Stage.
3. Puxar curva de loop.
4. Confirmar que curva de loop muda visualmente igual à v8z4b19t.
5. Confirmar Undo da curva de loop.
6. Confirmar Redo da curva de loop.

### Teste E — Preview (regressão)
1. Rodar Preview.
2. Confirmar que a faixa preta superior do Preview continua presente.
3. Confirmar que Preview respeita curvas normais.
4. Confirmar que Preview respeita curva de loop.

### Teste F — MP4/export e botão Salvar MP4 (regressão v8z4b19s)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. Entrar no Preview e gerar MP4.
4. Tocar em **Salvar MP4**.
5. Confirmar que o salvamento/download inicia normalmente.
6. Confirmar que o botão **não** fica preso em estado done/pronto/ativo.
7. Confirmar que, ao sair do Preview, o MP4 gerado é limpo (regressão v8z4b19o).
8. Iniciar geração de MP4 e tocar Voltar antes de terminar.
9. Confirmar que Stage não trava.
10. Confirmar que play/pause não fica preso.

### Teste G — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19u`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19u`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
3. Abrir JSON salvo em v8z4b19t com imagem e confirmar compatibilidade.
4. Confirmar que nenhum destes campos apareceu no JSON:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
   - `spans`
   - `generatedMp4`
   - `exportBlob`
   - `legacyCurvePatch`
   - `patchCandidate`
   - `patchApplicationDraft`
   - `realCurvePatchApplication`
   - `selfTest`
5. Confirmar que `segDurations` não mudou de schema.

### Teste H — pipeline guardado (novo v8z4b19u)
1. Com projeto de pelo menos 2 frames, puxar uma curva normal.
2. Confirmar que a curva visual muda como antes.
3. Confirmar que `ctrlPts[segIndex]` foi atualizado com os valores corretos.
4. Confirmar que `ctrlPtManual[segIndex] === true` após puxar.
5. Ativar loop, puxar curva de loop.
6. Confirmar que `loopCtrlPt` foi atualizado com os valores corretos.
7. Confirmar que self-test da v8z4b19t continua disponível:
   ```js
   window.__arcoInternalDiag.curvePatchSelfTest.suite()
   ```
8. Confirmar que self-test ainda retorna `appliedToRealState: false` (harness guardado).
9. Confirmar que self-test não afeta curvas após ser rodado.

### Teste I — console (regressão)
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19t — add internal curve patch self-test harness

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19t` na UI (Settings).
3. Confirmar que nome da versão exibe `add internal curve patch self-test harness`.

### Teste B — faixa preta superior (regressão v8z4b19n)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que a faixa preta superior continua presente.
4. Confirmar que o canvas não invade a Dynamic Island.

### Teste C — curvas normais (regressão)
1. Criar projeto com pelo menos 4 frames.
2. Puxar curva normal F1→F2.
3. Puxar curva normal F2→F3.
4. Confirmar que curvas normais continuam iguais à v8z4b19s.
5. Confirmar Undo/Redo da curva normal.
6. Mover frame depois de puxar curvas e confirmar que as curvas não pulam.

### Teste D — loop e curva de loop (regressão)
1. Ativar loop via chip Loop no painel Duração.
2. Confirmar que curva de loop aparece imediatamente no Stage, sem tocar no Stage.
3. Puxar curva de loop.
4. Confirmar que a curva de loop aparece igual à v8z4b19s.
5. Confirmar Undo/Redo da curva de loop.

### Teste E — Preview (regressão)
1. Rodar Preview.
2. Confirmar que a faixa preta superior do Preview continua presente.
3. Confirmar que Preview respeita curvas normais.
4. Confirmar que Preview respeita curva de loop.

### Teste F — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.

### Teste G — MP4/export e botão Salvar MP4 (regressão v8z4b19s)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. Entrar no Preview e gerar MP4.
4. Tocar em **Salvar MP4**.
5. Confirmar que o salvamento/download inicia normalmente.
6. Confirmar que o botão **não** fica preso em estado done/pronto/ativo.
7. Confirmar que o botão voltou ao estado padrão "Salvar MP4" (gerar novo).
8. Confirmar que, ao sair do Preview, o MP4 gerado é limpo (regressão v8z4b19o).
9. Iniciar geração de MP4 e tocar Voltar antes de terminar.
10. Confirmar que Stage não trava.
11. Confirmar que play/pause não fica preso.

### Teste H — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19t`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19t`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
3. Abrir JSON salvo em v8z4b19s com imagem e confirmar compatibilidade.
4. Confirmar que o bug conhecido de `_file.json` sem `imageBase64` continua registrado no ROADMAP,
   sem tentativa parcial de correção nesta versão.
5. Confirmar que nenhum destes campos apareceu no JSON:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
   - `spans`
   - `generatedMp4`
   - `exportBlob`
   - `legacyCurvePatch`
   - `patchCandidate`
   - `patchApplicationDraft`
   - `realCurvePatchApplication`
   - `selfTest`
6. Confirmar que `segDurations` não mudou de schema.

### Teste I — harness de self-test (novo v8z4b19t)
1. Confirmar que o harness **não** roda automaticamente ao abrir o app.
2. Confirmar que o harness **não** roda automaticamente ao entrar em Preview.
3. Confirmar que o harness **não** roda automaticamente ao gerar MP4.
4. Confirmar que `window.__arcoInternalDiag.curvePatchSelfTest` existe no console.
5. Com projeto de pelo menos 2 frames carregado, executar no console:
   ```js
   window.__arcoInternalDiag.curvePatchSelfTest.forSegment(0)
   ```
6. Confirmar que o resultado contém `ok: true` ou erro razoável (ex: `model-not-available` se não houver imagem).
7. Se resultado ok, confirmar:
   - `simulationOk: true`
   - `patchValid: true`
   - `dryRunOk: true`
   - `guardOk: true`
   - `realStateUnchanged: true`
   - `appliedToRealState: false`
8. Após rodar o harness, confirmar que curvas no Stage **não mudaram**.
9. Após rodar o harness, confirmar que Preview **não foi afetado**.
10. Confirmar que `applyLegacyCurvePatchCandidateToRealState` **não** foi chamado com `allowRealMutation: true`.

### Teste J — console (regressão)
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19s — clear MP4 after save and prepare guarded real curve patch applier

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19s` na UI (Settings).
3. Confirmar que nome da versão exibe `clear MP4 after save and prepare guarded real curve patch applier`.

### Teste B — faixa preta superior (regressão v8z4b19n)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que a faixa preta superior continua presente.
4. Confirmar que o canvas não invade a Dynamic Island.

### Teste C — curvas normais (regressão)
1. Criar projeto com pelo menos 4 frames.
2. Puxar curva normal F1→F2.
3. Puxar curva normal F2→F3.
4. Confirmar que a curva normal aparece igual à v8z4b19r.
5. Confirmar Undo/Redo da curva normal.
6. Mover frame depois de puxar curvas e confirmar que as curvas não pulam.

### Teste D — loop e curva de loop (regressão)
1. Ativar loop via chip Loop no painel Duração.
2. Confirmar que curva de loop aparece imediatamente no Stage, sem tocar no Stage.
3. Puxar curva de loop.
4. Confirmar que a curva de loop aparece igual à v8z4b19r.
5. Confirmar Undo/Redo da curva de loop.

### Teste E — Preview (regressão)
1. Rodar Preview.
2. Confirmar que a faixa preta superior do Preview continua presente.
3. Confirmar que Preview respeita curvas normais.
4. Confirmar que Preview respeita curva de loop.

### Teste F — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.

### Teste G — MP4/export e botão Salvar MP4 (correção v8z4b19s + regressão)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. **NOVO — Salvar MP4 e verificar reset do botão:**
   - Entrar no Preview.
   - Gerar MP4.
   - Confirmar que botão fica no estado pronto (done/Salvar MP4).
   - Tocar em **Salvar MP4**.
   - Confirmar que o salvamento/download inicia normalmente.
   - Confirmar que o botão **não** fica preso em estado done/pronto/ativo.
   - Confirmar que o botão voltou ao estado padrão "Salvar MP4" (gerar novo).
   - Confirmar que label e visual do botão estão normais.
   - Tocar no botão novamente: deve iniciar **nova geração**, não re-download.
4. Confirmar que, ao sair do Preview, o MP4 gerado é limpo (regressão v8z4b19o):
   - Entrar no Preview.
   - Gerar MP4.
   - Voltar ao Stage.
   - Re-entrar no Preview.
   - **Confirmar que botão voltou ao estado "Salvar MP4" (gerar novo).**
5. Testar correção de MP4 (regressão v8z4b19i):
   - Iniciar geração de MP4.
   - Tocar Voltar antes de terminar.
   - Confirmar que Stage não trava.
   - Confirmar que play/pause não fica preso.

### Teste H — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19s`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19s`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
3. Abrir JSON salvo em v8z4b19r e confirmar compatibilidade.
4. Confirmar que nenhum destes campos apareceu no JSON:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
   - `spans`
   - `generatedMp4`
   - `exportBlob`
   - `legacyCurvePatch`
   - `patchCandidate`
   - `patchApplicationDraft`
   - `realCurvePatchApplication`
5. Confirmar que `segDurations` não mudou de schema.

### Teste I — console (regressão)
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19r — prepare guarded legacy curve patch applier

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19r` na UI (Settings).
3. Confirmar que nome da versão exibe `prepare guarded legacy curve patch applier`.

### Teste B — faixa preta superior (regressão v8z4b19n)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que a faixa preta superior continua presente.
4. Confirmar que o canvas não invade a Dynamic Island.

### Teste C — curvas normais (regressão)
1. Criar projeto com pelo menos 4 frames.
2. Puxar curva normal F1→F2.
3. Puxar curva normal F2→F3.
4. Confirmar que a curva normal aparece igual à v8z4b19q.
5. Confirmar Undo/Redo da curva normal.
6. Mover frame depois de puxar curvas e confirmar que as curvas não pulam.

### Teste D — loop e curva de loop (regressão)
1. Ativar loop via chip Loop no painel Duração.
2. Confirmar que curva de loop aparece imediatamente no Stage, sem tocar no Stage.
3. Puxar curva de loop.
4. Confirmar que a curva de loop aparece igual à v8z4b19q.
5. Confirmar Undo/Redo da curva de loop.

### Teste E — Preview (regressão)
1. Rodar Preview.
2. Confirmar que a faixa preta superior do Preview continua presente.
3. Confirmar que Preview respeita curvas normais.
4. Confirmar que Preview respeita curva de loop.

### Teste F — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.

### Teste G — MP4/export (regressão)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. Confirmar que, ao sair do Preview, o MP4 gerado é limpo (regressão v8z4b19o):
   - Entrar no Preview.
   - Gerar MP4.
   - Voltar ao Stage.
   - Re-entrar no Preview.
   - **Confirmar que botão voltou ao estado "Salvar MP4" (gerar novo).**
4. Testar correção de MP4 (regressão v8z4b19i):
   - Iniciar geração de MP4.
   - Tocar Voltar antes de terminar.
   - Confirmar que Stage não trava.
   - Confirmar que play/pause não fica preso.

### Teste H — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19r`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19r`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
3. Abrir JSON salvo em v8z4b19q e confirmar compatibilidade.
4. Confirmar que nenhum destes campos apareceu no JSON:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
   - `spans`
   - `generatedMp4`
   - `exportBlob`
   - `legacyCurvePatch`
   - `patchCandidate`
   - `patchApplicationDraft`
5. Confirmar que `segDurations` não mudou de schema.

### Teste I — console (regressão)
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19q — prepare legacy curve patch from simulated path point edit

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19q` na UI (Settings).
3. Confirmar que nome da versão exibe `prepare legacy curve patch from simulated path point edit`.

### Teste B — faixa preta superior (regressão v8z4b19n)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que a faixa preta superior continua presente.
4. Confirmar que o canvas não invade a Dynamic Island.

### Teste C — curvas normais (regressão)
1. Criar projeto com pelo menos 4 frames.
2. Puxar curva normal F1→F2.
3. Puxar curva normal F2→F3.
4. Confirmar que a curva normal aparece igual à v8z4b19p.
5. Confirmar Undo/Redo da curva normal.
6. Mover frame depois de puxar curvas e confirmar que as curvas não pulam.

### Teste D — loop e curva de loop (regressão)
1. Ativar loop via chip Loop no painel Duração.
2. Confirmar que curva de loop aparece imediatamente no Stage, sem tocar no Stage.
3. Puxar curva de loop.
4. Confirmar que a curva de loop aparece igual à v8z4b19p.
5. Confirmar Undo/Redo da curva de loop.

### Teste E — Preview (regressão)
1. Rodar Preview.
2. Confirmar que a faixa preta superior do Preview continua presente.
3. Confirmar que Preview respeita curvas normais.
4. Confirmar que Preview respeita curva de loop.

### Teste F — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.

### Teste G — MP4/export (regressão)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. Confirmar que, ao sair do Preview, o MP4 gerado é limpo (regressão v8z4b19o):
   - Entrar no Preview.
   - Gerar MP4.
   - Voltar ao Stage.
   - Re-entrar no Preview.
   - **Confirmar que botão voltou ao estado "Salvar MP4" (gerar novo).**
4. Testar correção de MP4 (regressão v8z4b19i):
   - Iniciar geração de MP4.
   - Tocar Voltar antes de terminar.
   - Confirmar que Stage não trava.
   - Confirmar que play/pause não fica preso.

### Teste H — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19q`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19q`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
3. Abrir JSON salvo em v8z4b19p e confirmar compatibilidade.
4. Confirmar que nenhum destes campos apareceu no JSON:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
   - `spans`
   - `generatedMp4`
   - `exportBlob`
   - `legacyCurvePatch`
   - `patchCandidate`
5. Confirmar que `segDurations` não mudou de schema.

### Teste I — console (regressão)
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19p — simulate runtime path point edit pipeline

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19p` na UI (Settings).
3. Confirmar que nome da versão exibe `simulate runtime path point edit pipeline`.

### Teste B — faixa preta superior (regressão v8z4b19n)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que a faixa preta superior continua presente.
4. Confirmar que o canvas não invade a Dynamic Island.

### Teste C — curvas normais (regressão)
1. Criar projeto com pelo menos 4 frames.
2. Puxar curva normal F1→F2.
3. Puxar curva normal F2→F3.
4. Confirmar que a curva normal aparece igual à v8z4b19o.
5. Confirmar Undo/Redo da curva normal.
6. Mover frame depois de puxar curvas e confirmar que as curvas não pulam.

### Teste D — loop e curva de loop (regressão)
1. Ativar loop via chip Loop no painel Duração.
2. Confirmar que curva de loop aparece imediatamente no Stage, sem tocar no Stage.
3. Puxar curva de loop.
4. Confirmar que a curva de loop aparece igual à v8z4b19o.
5. Confirmar Undo/Redo da curva de loop.

### Teste E — Preview (regressão)
1. Rodar Preview.
2. Confirmar que a faixa preta superior do Preview continua presente.
3. Confirmar que Preview respeita curvas normais.
4. Confirmar que Preview respeita curva de loop.

### Teste F — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.

### Teste G — MP4/export (regressão)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. Confirmar que, ao sair do Preview, o MP4 gerado é limpo (regressão v8z4b19o):
   - Entrar no Preview.
   - Gerar MP4.
   - Voltar ao Stage.
   - Re-entrar no Preview.
   - **Confirmar que botão voltou ao estado "Salvar MP4" (gerar novo).**
4. Testar correção de MP4 (regressão v8z4b19i):
   - Iniciar geração de MP4.
   - Tocar Voltar antes de terminar.
   - Confirmar que Stage não trava.
   - Confirmar que play/pause não fica preso.

### Teste H — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19p`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19p`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
3. Abrir JSON salvo em v8z4b19o e confirmar compatibilidade.
4. Confirmar que nenhum destes campos apareceu no JSON:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
   - `spans`
   - `generatedMp4`
   - `exportBlob`
5. Confirmar que `segDurations` não mudou de schema.

### Teste I — console (regressão)
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19o — clear generated MP4 when leaving preview

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19o` na UI (Settings).
3. Confirmar que nome da versão exibe `clear generated MP4 when leaving preview`.

### Teste B — faixa preta superior (regressão v8z4b19n)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que a faixa preta superior continua presente.
4. Confirmar que o canvas não invade a Dynamic Island.

### Teste C — ciclo de vida do MP4 (feature nova)
1. Carregar imagem e criar pelo menos 2 frames.
2. Entrar no Preview.
3. Gerar MP4 normalmente.
4. Confirmar que botão muda para estado de download/Baixar MP4.
5. Baixar MP4.
6. Confirmar que o botão continua disponível para baixar novamente enquanto no Preview.
7. Tocar em **Voltar** para retornar ao Stage.
8. Confirmar que o Stage está editável e desbloqueado.
9. Confirmar que play/pause do Stage não fica preso.
10. Entrar novamente no Preview.
11. **Confirmar que o MP4 anterior NÃO aparece como pronto para baixar.**
12. **Confirmar que o botão voltou ao estado "Salvar MP4" (gerar novo).**
13. Gerar MP4 novamente.
14. Confirmar que a nova geração funciona normalmente.
15. Confirmar que MP4 gerado respeita curvas normais e curva de loop.

### Teste D — cancelamento de export durante saída (regressão v8z4b19i)
1. Entrar no Preview.
2. Iniciar geração de MP4.
3. Tocar em **Voltar** antes de terminar a exportação.
4. Confirmar que a exportação é cancelada com segurança.
5. Confirmar que o Stage não trava.
6. Confirmar que play/pause do Stage não fica preso.
7. Confirmar que não aparece MP4 parcial pronto para baixar.
8. Entrar no Preview novamente e gerar MP4.
9. Confirmar que a nova geração funciona normalmente.

### Teste E — curvas e loop (regressão)
1. Criar projeto com pelo menos 4 frames.
2. Puxar curva normal F1→F2.
3. Ativar loop via chip Loop no painel Duração.
4. Confirmar que curva de loop aparece imediatamente no Stage.
5. Confirmar que Preview respeita curvas normais.
6. Confirmar que Preview respeita curva de loop.

### Teste F — Stage (regressão)
1. Confirmar que Stage continua igual após a alteração.
2. Confirmar que toolbar inferior do Stage continua igual.
3. Confirmar que painéis e menus continuam iguais.

### Teste G — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19o`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19o`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
3. Abrir JSON salvo em v8z4b19n e confirmar compatibilidade.
4. Confirmar que nenhum destes campos aparece no JSON:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
   - `spans`
   - `generatedMp4`
   - `exportBlob`

### Teste H — console (regressão)
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19n — add top safe preview band

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19n` na UI (Settings).
3. Confirmar que nome da versão exibe `add top safe preview band`.

### Teste B — faixa preta superior no Preview (feature nova)
1. Carregar imagem no iPhone/Safari.
2. Entrar no Preview.
3. Confirmar que existe uma faixa preta visível no topo do Preview.
4. Confirmar que o canvas/mídia fica visualmente mais baixo (não colado no topo).
5. Confirmar que a imagem não invade a região da Dynamic Island / barra superior.
6. Confirmar que imagem vertical não fica cortada no topo.
7. Confirmar que imagem horizontal continua bem centralizada.
8. Confirmar que o enquadramento geral continua bom.

### Teste C — painel inferior e controles do Preview (regressão)
1. Confirmar que o painel inferior do Preview continua igual.
2. Confirmar que Play/Pause continua funcionando.
3. Confirmar que Voltar continua funcionando.
4. Confirmar que Gerar/Salvar MP4 continua funcionando.

### Teste D — curvas e loop (regressão)
1. Criar projeto com pelo menos 4 frames.
2. Puxar curva normal F1→F2.
3. Ativar loop via chip Loop no painel Duração.
4. Confirmar que curva de loop aparece imediatamente no Stage.
5. Confirmar que Preview respeita curvas normais.
6. Confirmar que Preview respeita curva de loop.

### Teste E — Stage (regressão)
1. Confirmar que Stage continua igual após a alteração.
2. Confirmar que toolbar inferior do Stage continua igual.
3. Confirmar que painéis e menus continuam iguais.

### Teste F — MP4/export (regressão)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. Iniciar geração de MP4 e tocar Voltar antes de terminar.
4. Confirmar que Stage não trava.
5. Confirmar que play/pause não fica preso.
6. Confirmar que o comportamento do botão Salvar MP4/Baixar MP4 não foi alterado.

### Teste G — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19n`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19n`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado quando loop ativo.
3. Abrir JSON salvo em v8z4b19m e confirmar compatibilidade.

### Teste H — campos proibidos no JSON
Confirmar que nenhum destes campos apareceu no JSON salvo:
- `curvesV2`
- `vectorPath`
- `handles`
- `pathPoints`
- `runtimeCurveModel`
- `capabilities`
- `spans`
- `generatedMp4`
- `exportBlob`

### Teste I — console limpo
1. Confirmar que não há erro de console.
2. Confirmar que não há NaN ou Infinity nos logs.

### Teste J — PR
1. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19m — derive curve puller from runtime path point

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19m` na UI (Settings).
3. Confirmar que nome da versão exibe `derive curve puller from runtime path point`.

### Teste B — curvas e loop (regressão)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Puxar curva normal F1→F2.
4. Puxar curva normal F2→F3.
5. Ativar loop via chip Loop no painel Duração.
6. Confirmar que curva de loop aparece **imediatamente** no Stage, sem precisar tocar no Stage.
7. Puxar curva de loop.
8. Confirmar que a curva normal aparece igual à v8z4b19l.
9. Confirmar que a curva de loop aparece igual à v8z4b19l.

### Teste C — Undo/Redo (regressão)
1. Confirmar Undo/Redo da curva normal.
2. Confirmar Undo/Redo da curva de loop.

### Teste D — mover frames (regressão)
1. Mover frame depois de puxar curvas.
2. Confirmar que as curvas não pulam ou se comportam de forma inesperada.

### Teste E — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.
3. Confirmar comportamento igual à v8z4b19l.

### Teste F — Preview (regressão)
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais.
3. Confirmar que Preview respeita curva de loop.

### Teste G — MP4/export (regressão)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. Testar correção de MP4 da v8z4b19i:
   - Iniciar geração de MP4.
   - Tocar Voltar antes de terminar.
   - Confirmar que Stage não trava.
   - Confirmar que play/pause não fica preso.

### Teste H — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19m`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19m`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
3. Abrir JSON salvo em v8z4b19l e confirmar compatibilidade.

### Teste I — campos proibidos no JSON
Confirmar que nenhum destes campos apareceu no JSON salvo:
- `curvesV2`
- `vectorPath`
- `handles`
- `pathPoints`
- `runtimeCurveModel`
- `capabilities`
- `spans`
- `generatedMp4`
- `exportBlob`

### Teste J — console limpo
1. Confirmar que não há erro de console.
2. Confirmar que não há NaN ou Infinity nos logs.

### Teste K — PR
1. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19l — route runtime curve model through derived spans

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19l` na UI (Settings).
3. Confirmar que nome da versão exibe `route runtime curve model through derived spans`.

### Teste B — curvas e loop (regressão)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Puxar curva normal F1→F2.
4. Puxar curva normal F2→F3.
5. Ativar loop via chip Loop no painel Duração.
6. Confirmar que curva de loop aparece **imediatamente** no Stage, sem precisar tocar no Stage.
7. Puxar curva de loop.
8. Confirmar que a curva normal aparece igual à v8z4b19k.
9. Confirmar que a curva de loop aparece igual à v8z4b19k.

### Teste C — Undo/Redo (regressão)
1. Confirmar Undo/Redo da curva normal.
2. Confirmar Undo/Redo da curva de loop.

### Teste D — mover frames (regressão)
1. Mover frame depois de puxar curvas.
2. Confirmar que as curvas não pulam ou se comportam de forma inesperada.

### Teste E — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.
3. Confirmar comportamento igual à v8z4b19k.

### Teste F — Preview (regressão)
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais.
3. Confirmar que Preview respeita curva de loop.

### Teste G — MP4/export (regressão)
1. Gerar MP4 normalmente.
2. Confirmar que MP4 respeita curvas normais e loop.
3. Testar correção de MP4 da v8z4b19i:
   - Iniciar geração de MP4.
   - Tocar Voltar antes de terminar.
   - Confirmar que Stage não trava.
   - Confirmar que play/pause não fica preso.

### Teste H — save/load (regressão)
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19l`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19l`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
3. Abrir JSON salvo em v8z4b19k e confirmar compatibilidade.

### Teste I — campos proibidos no JSON
Confirmar que nenhum destes campos apareceu no JSON salvo:
- `curvesV2`
- `vectorPath`
- `handles`
- `pathPoints`
- `runtimeCurveModel`
- `capabilities`
- `spans`
- `generatedMp4`
- `exportBlob`

### Teste J — console limpo
1. Confirmar que não há erro de console.
2. Confirmar que não há NaN ou Infinity nos logs.

### Teste K — PR
1. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19k — render loop curve immediately on toggle

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19k` na UI (Settings).
3. Confirmar que nome da versão exibe `render loop curve immediately on toggle`.

### Teste B — render imediato da curva de loop (bug fix)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Confirmar que loop começa desligado (chip "Nenhum" ativo no painel Duração).
4. Abrir painel Duração.
5. Tocar no chip **Loop**.
6. Confirmar que a curva de loop aparece **imediatamente** no Stage, sem precisar tocar no Stage.
7. Confirmar que o puxador/ctrl point roxo da curva de loop aparece/atualiza imediatamente (quando F1 ou último frame está ativo).
8. Tocar no chip **Nenhum** (desativar loop).
9. Confirmar que a curva de loop **desaparece imediatamente** do Stage.
10. Tocar no chip **Loop** novamente.
11. Confirmar que a curva de loop **reaparece imediatamente**.

### Teste C — curvas normais e loop (regressão)
1. Puxar curva normal F1→F2.
2. Puxar curva normal F2→F3.
3. Ativar loop via chip Loop no painel Duração.
4. Selecionar F1 ou último frame.
5. Puxar curva de loop.
6. Confirmar que a curva normal aparece igual à v8z4b19j.
7. Confirmar que a curva de loop aparece igual à v8z4b19j.
8. Confirmar Undo/Redo da curva normal.
9. Confirmar Undo/Redo da curva de loop.
10. Mover frame depois de puxar curvas e confirmar que as curvas não pulam.

### Teste D — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.
3. Confirmar que o comportamento é idêntico à v8z4b19j.

### Teste E — Preview e MP4 (regressão)
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais.
3. Confirmar que Preview respeita curva de loop.
4. Gerar MP4 normalmente.
5. Confirmar que MP4 respeita curvas normais e loop.
6. Testar correção de MP4 (v8z4b19i):
   - Iniciar geração de MP4.
   - Tocar Voltar antes de terminar.
   - Confirmar que Stage não trava.
   - Confirmar que play/pause não fica preso.

### Teste F — JSON salvo
1. Salvar projeto com imagem (com loop ativo e curva de loop puxada):
   - `filename` termina em `_img.json`.
   - `version` salva como `v8z4b19k`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
   - **Nenhum campo novo** aparece no JSON.
2. Salvar projeto sem imagem:
   - `filename` termina em `_file.json`.
   - `version` salva como `v8z4b19k`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
3. Abrir JSON salvo em v8z4b19j e confirmar compatibilidade.

---

## v8z4b19j — evaluate derived runtime curve spans

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19j` na UI (Settings).
3. Confirmar que nome da versão exibe `evaluate derived runtime curve spans`.

### Teste B — curvas normais e loop (regressão)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Puxar curva normal F1→F2.
4. Puxar curva normal F2→F3.
5. Ativar loop.
6. Selecionar F1 ou último frame.
7. Puxar curva de loop.
8. Confirmar que a curva normal aparece igual à v8z4b19i.
9. Confirmar que a curva de loop aparece igual à v8z4b19i.
10. Confirmar Undo/Redo da curva normal.
11. Confirmar Undo/Redo da curva de loop.
12. Mover frame depois de puxar curvas e confirmar que as curvas não pulam.

### Teste C — velocidade constante (regressão)
1. Usar velocidade constante com curvas normais.
2. Usar velocidade constante com loop ativo.
3. Confirmar que o comportamento é idêntico à v8z4b19i.

### Teste D — Preview e MP4 (regressão)
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais.
3. Confirmar que Preview respeita curva de loop.
4. Gerar MP4 normalmente.
5. Confirmar que MP4 respeita curvas normais e loop.
6. Testar correção de MP4 (v8z4b19i):
   - Iniciar geração de MP4.
   - Tocar Voltar antes de terminar.
   - Confirmar que Stage não trava.
   - Confirmar que play/pause não fica preso.

### Teste E — JSON salvo
1. Salvar projeto com imagem:
   - `filename` termina em `_img.json`.
   - `version` salva como `v8z4b19j`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - `filename` termina em `_file.json`.
   - `version` salva como `v8z4b19j`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
3. Abrir JSON salvo em v8z4b19i e confirmar compatibilidade.
4. Confirmar que NENHUM campo novo apareceu no JSON:
   - `curvesV2`, `vectorPath`, `handles`, `pathPoints`, `runtimeCurveModel`,
     `capabilities`, `spans`, `generatedMp4`, `exportBlob`.

### Teste F — console limpo
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19i — fix preview exit during mp4 export

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19i` na UI (Settings).
3. Confirmar que nome da versão exibe `fix preview exit during mp4 export`.

### Teste B — cancelamento de export ao sair do Preview (foco desta versão)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com 4 frames.
3. Entrar no Preview.
4. Iniciar geração de MP4 (Salvar MP4).
5. Antes do fim da geração, tocar em Voltar.
6. Confirmar que a exportação é cancelada com segurança:
   - overlay de progresso desaparece imediatamente;
   - botão Salvar MP4 volta ao estado neutro (não mostra MB, não está em "recording").
7. Confirmar que o Stage volta imediatamente editável.
8. Confirmar que o botão Play/Pause do Stage mostra ícone de Play (não preso em Pause).
9. Confirmar que não há overlay invisível bloqueando toque no Stage.
10. Confirmar que é possível tocar em frame, menu e Stage imediatamente.
11. Voltar ao Preview — confirmar que o preview abre normalmente (sem estado residual).
12. Confirmar que o botão mostra "Salvar MP4" (export cancelado não fica disponível).
13. Gerar MP4 novamente (Salvar MP4).
14. Deixar concluir normalmente.
15. Confirmar que o MP4 fica disponível para download (botão mostra MB).
16. Baixar MP4 — confirmar que o arquivo salva.
17. Voltar ao Stage e confirmar interação normal.
18. Voltar ao Preview — confirmar que o MP4 ainda está disponível (botão mostra MB).
19. Alterar o projeto (mover frame).
20. Confirmar que o export anterior foi invalidado: botão volta para "Salvar MP4".
21. Confirmar que Preview continua funcionando normalmente.
22. Confirmar que MP4 respeita curvas normais e loop.

### Teste C — saída normal do Preview sem export em andamento
1. Entrar no Preview sem iniciar export.
2. Tocar em Voltar.
3. Confirmar que o Stage volta imediatamente editável.
4. Confirmar que play/pause está correto no Stage.
5. Confirmar que não há regressão de comportamento normal.

### Teste D — JSON salvo
1. Salvar JSON com imagem e sem imagem:
   - `version` salva como `v8z4b19i`.
   - `imageBase64` apenas no `_img.json`.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Confirmar que NENHUM campo novo apareceu no JSON:
   - `curvesV2`, `vectorPath`, `handles`, `pathPoints`, `runtimeCurveModel`,
     `capabilities`, `spans`, `generatedMp4`, `exportBlob`.

### Teste E — console limpo
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b19h — derive split runtime curve spans

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19h` na UI (Settings).
3. Confirmar que nome da versão exibe `derive split runtime curve spans`.

### Teste B — curvas normais (segmentos normais F1→F2, F2→F3)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Puxar curva normal F1→F2.
4. Confirmar que a bolinha da curva aparece na posição correta (igual à v8z4b19g).
5. Confirmar que a curva desenhada aparece igual à v8z4b19g.
6. Puxar curva normal F2→F3.
7. Confirmar que a segunda bolinha e curva aparecem corretamente.

### Teste C — curva de loop (segmento N→1)
1. Ativar loop.
2. Selecionar F1 ou último frame para exibir a bolinha roxa da curva de loop.
3. Confirmar que a bolinha roxa aparece.
4. Arrastar a bolinha da curva de loop.
5. Confirmar que a curva de loop se move igual à v8z4b19g.
6. Confirmar que o trecho de loop vai do último frame ao primeiro frame.

### Teste D — undo/redo das curvas
1. Puxar curva normal.
2. Confirmar Undo da curva normal.
3. Confirmar Redo da curva normal.
4. Com loop ativo, puxar curva de loop.
5. Confirmar Undo da curva de loop.
6. Confirmar Redo da curva de loop.

### Teste E — Preview
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais.
3. Confirmar que Preview respeita curva de loop.
4. Confirmar que Preview parece idêntico à v8z4b19g.

### Teste F — velocidade constante
1. Usar velocidade constante com curvas normais.
2. Confirmar que Preview com velocidade constante parece idêntico à v8z4b19g.
3. Ativar loop.
4. Confirmar que Preview com velocidade constante e loop parece idêntico à v8z4b19g.

### Teste G — mover frame após puxar curvas
1. Puxar curvas normais F1→F2 e F2→F3.
2. Mover F2 na tela.
3. Confirmar que as curvas não pulam.
4. Confirmar que as bolinhas de curva seguem os frames.

### Teste H — salvar projeto (com imagem)
1. Salvar projeto com imagem.
2. Confirmar que o filename termina em `_img.json`.
3. Abrir o JSON salvo e confirmar:
   - `version` = `v8z4b19h`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
4. Confirmar que NENHUM destes campos apareceu no JSON:
   - `curvesV2`, `vectorPath`, `handles`, `pathPoints`,
     `runtimeCurveModel`, `capabilities`, `spans`.

### Teste I — salvar projeto (sem imagem)
1. Salvar projeto sem imagem.
2. Confirmar que o filename termina em `_file.json`.
3. Abrir o JSON salvo e confirmar:
   - `version` = `v8z4b19h`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.

### Teste J — compatibilidade com JSON de versões anteriores
1. Abrir JSON salvo em v8z4b19g.
2. Confirmar que o projeto abre normalmente.
3. Confirmar que as curvas aparecem corretamente.
4. Confirmar que Preview funciona.

### Teste K — sem erros de console
1. Abrir app em modo de desenvolvimento.
2. Executar todos os testes acima.
3. Confirmar que não há erros de console, NaN ou Infinity relacionados a curvas.

### Critério central
- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19g.
- Spans derivados existem apenas no modelo runtime (não no JSON).
- Spans não são editáveis, não são renderizados.
- UI, JSON, Preview, MP4, save/load e comportamento visual sem alteração.

---

## v8z4b19g — add runtime path point diagnostics

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19g` na UI (Settings).
3. Confirmar que nome da versão exibe `add runtime path point diagnostics`.

### Teste B — curvas normais (segmentos normais F1→F2, F2→F3)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Puxar curva normal F1→F2.
4. Confirmar que a bolinha da curva aparece na posição correta (igual à v8z4b19f).
5. Confirmar que a curva desenhada aparece igual à v8z4b19f.
6. Puxar curva normal F2→F3.
7. Confirmar que a segunda bolinha e curva aparecem corretamente.

### Teste C — curva de loop (segmento N→1)
1. Ativar loop.
2. Selecionar F1 ou último frame para exibir a bolinha roxa da curva de loop.
3. Confirmar que a bolinha roxa aparece.
4. Arrastar a bolinha da curva de loop.
5. Confirmar que a curva de loop se move igual à v8z4b19f.
6. Confirmar que o trecho de loop vai do último frame ao primeiro frame.

### Teste D — undo/redo das curvas
1. Puxar curva normal.
2. Tocar em Undo.
3. Confirmar que a curva normal volta à posição anterior.
4. Tocar em Redo.
5. Confirmar que a curva normal volta à posição editada.
6. Puxar curva de loop.
7. Tocar em Undo.
8. Confirmar que a curva de loop volta à posição anterior ao drag.
9. Tocar em Redo.
10. Confirmar que a curva de loop volta à posição editada.

### Teste E — mover frame com curvas puxadas
1. Com curvas normais já puxadas, mover um frame.
2. Confirmar que as curvas não pulsam nem resetam indevidamente.
3. Tocar em Undo.
4. Confirmar comportamento correto.
5. Puxar curva de loop, depois mover um frame.
6. Confirmar que a curva de loop não pula.

### Teste F — modo velocidade constante com loop ativo
1. Ativar modo de velocidade constante, se disponível.
2. Arrastar frame com velocidade constante.
3. Confirmar que a trajetória usa curvas normais corretamente.
4. Ativar loop e confirmar velocidade constante com loop.

### Teste G — Preview e MP4
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais (igual à v8z4b19f).
3. Confirmar que Preview respeita curva de loop (igual à v8z4b19f).
4. Confirmar que Preview não fica preto e não trava.
5. Gerar MP4, se possível.
6. Confirmar que MP4 respeita curvas normais.
7. Confirmar que MP4 respeita curva de loop.

### Teste H — save/load e compatibilidade JSON
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19g`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19g`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
3. Confirmar que nenhum destes campos apareceu no JSON salvo:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
4. Abrir JSON salvo na v8z4b19f e confirmar compatibilidade total.

### Teste I — ausência de erros de console
1. Abrir console do browser.
2. Realizar fluxo completo (criar frames, puxar curvas, Preview, save/load).
3. Confirmar que não há erro de console, NaN ou Infinity.

### Teste J — diagnóstico do pathPoint derivado (verificação interna)
1. No console do browser, executar:
   ```js
   const model = buildRuntimeCurveModel(0);
   validateDerivedRuntimePathPoint(model);
   ```
2. Confirmar que o retorno é `{ ok: true, reason: 'ok', deltaPx: <~0>, pathPoint: {...}, evaluatedPoint: {...} }`.
3. Confirmar que `deltaPx` é praticamente zero (< 0.001).
4. Confirmar que `pathPoint.derived === true` e `pathPoint.editable === false`.
5. Executar `diagnoseRuntimeCurveSegment(0)` e confirmar:
   - `validation.ok === true`
   - `validation.reason === 'ok'`
6. Executar `diagnoseRuntimeCurveModel()` com projeto de 4 frames (3 segmentos):
   - `ok === true`
   - `total === 3` (ou 4 com loop ativo)
   - `passed === total`
   - `failed === 0`
7. Confirmar que `compareRuntimePathWithLegacy(0, 0.5).derivedPathPointCheck.diagOk === true`.
8. Confirmar que nenhum helper alterou estado (re-executar `buildRuntimeCurveModel(0)` e confirmar que o resultado é idêntico).
9. Confirmar que os helpers de diagnóstico não imprimem nada no console automaticamente.
10. Confirmar que `validateDerivedRuntimePathPoint` retorna `{ ok: false, reason: 'invalid-model', ... }` para `null`.
11. Confirmar que o pathPoint derivado NÃO aparece visualmente na UI.

## v8z4b19f — introduce derived runtime path point

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19f` na UI (Settings).
3. Confirmar que nome da versão exibe `introduce derived runtime path point`.

### Teste B — curvas normais (segmentos normais F1→F2, F2→F3)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Puxar curva normal F1→F2.
4. Confirmar que a bolinha da curva aparece na posição correta (igual à v8z4b19e).
5. Confirmar que a curva desenhada aparece igual à v8z4b19e.
6. Puxar curva normal F2→F3.
7. Confirmar que a segunda bolinha e curva aparecem corretamente.

### Teste C — curva de loop (segmento N→1)
1. Ativar loop.
2. Selecionar F1 ou último frame para exibir a bolinha roxa da curva de loop.
3. Confirmar que a bolinha roxa aparece.
4. Arrastar a bolinha da curva de loop.
5. Confirmar que a curva de loop se move igual à v8z4b19e.
6. Confirmar que o trecho de loop vai do último frame ao primeiro frame.

### Teste D — undo/redo das curvas
1. Puxar curva normal.
2. Tocar em Undo.
3. Confirmar que a curva normal volta à posição anterior.
4. Tocar em Redo.
5. Confirmar que a curva normal volta à posição editada.
6. Puxar curva de loop.
7. Tocar em Undo.
8. Confirmar que a curva de loop volta à posição anterior ao drag.
9. Tocar em Redo.
10. Confirmar que a curva de loop volta à posição editada.

### Teste E — mover frame com curvas puxadas
1. Com curvas normais já puxadas, mover um frame.
2. Confirmar que as curvas não pulsam nem resetam indevidamente.
3. Tocar em Undo.
4. Confirmar comportamento correto.
5. Puxar curva de loop, depois mover um frame.
6. Confirmar que a curva de loop não pula.

### Teste F — modo velocidade constante com loop ativo
1. Ativar modo de velocidade constante, se disponível.
2. Arrastar frame com velocidade constante.
3. Confirmar que a trajetória usa curvas normais corretamente.
4. Ativar loop e confirmar velocidade constante com loop.

### Teste G — Preview e MP4
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais (igual à v8z4b19e).
3. Confirmar que Preview respeita curva de loop (igual à v8z4b19e).
4. Confirmar que Preview não fica preto e não trava.
5. Gerar MP4, se possível.
6. Confirmar que MP4 respeita curvas normais.
7. Confirmar que MP4 respeita curva de loop.

### Teste H — save/load e compatibilidade JSON
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19f`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19f`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
3. Confirmar que nenhum destes campos apareceu no JSON salvo:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`
4. Abrir JSON salvo na v8z4b19e e confirmar compatibilidade total.

### Teste I — ausência de erros de console
1. Abrir console do browser.
2. Realizar fluxo completo (criar frames, puxar curvas, Preview, save/load).
3. Confirmar que não há erro de console, NaN ou Infinity.

### Teste J — pathPoint derivado (verificação interna)
1. No console do browser, executar:
   ```js
   const model = buildRuntimeCurveModel(0);
   console.log(model.pathPoints);
   ```
2. Confirmar que `pathPoints` tem exatamente 1 elemento.
3. Confirmar que o elemento tem:
   - `kind === 'pathPoint'`
   - `role === 'derivedMidpoint'`
   - `source === 'legacyQuadratic'`
   - `t === 0.5`
   - `x` e `y` são números finitos entre 0 e 1
   - `editable === false`
   - `derived === true`
4. Confirmar que o pathPoint derivado NÃO aparece visualmente na UI.
5. Executar `compareRuntimePathWithLegacy(0, 0.5)` e confirmar:
   - `match === true`
   - `derivedPathPointCheck.match === true`

## v8z4b19e — prepare runtime path point model

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19e` na UI (Settings).
3. Confirmar que nome da versão exibe `prepare runtime path point model`.

### Teste B — curvas normais (segmentos normais F1→F2, F2→F3)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Puxar curva normal F1→F2.
4. Confirmar que a bolinha da curva aparece na posição correta (igual à v8z4b19d).
5. Confirmar que a curva desenhada aparece igual à v8z4b19d.
6. Puxar curva normal F2→F3.
7. Confirmar que a segunda bolinha e curva aparecem corretamente.

### Teste C — curva de loop (segmento N→1)
1. Ativar loop.
2. Selecionar F1 ou último frame para exibir a bolinha roxa da curva de loop.
3. Confirmar que a bolinha roxa aparece.
4. Arrastar a bolinha da curva de loop.
5. Confirmar que a curva de loop se move igual à v8z4b19d.
6. Confirmar que o trecho de loop vai do último frame ao primeiro frame.

### Teste D — undo/redo das curvas
1. Puxar curva normal.
2. Tocar em Undo.
3. Confirmar que a curva normal volta à posição anterior.
4. Tocar em Redo.
5. Confirmar que a curva normal volta à posição editada.
6. Puxar curva de loop.
7. Tocar em Undo.
8. Confirmar que a curva de loop volta à posição anterior ao drag.
9. Tocar em Redo.
10. Confirmar que a curva de loop volta à posição editada.

### Teste E — mover frame com curvas puxadas
1. Com curvas normais já puxadas, mover um frame.
2. Confirmar que as curvas não pulsam nem resetam indevidamente.
3. Tocar em Undo.
4. Confirmar comportamento correto.
5. Puxar curva de loop, depois mover um frame.
6. Confirmar que a curva de loop não pula.

### Teste F — modo velocidade constante com loop ativo
1. Ativar modo de velocidade constante, se disponível.
2. Arrastar frame com velocidade constante.
3. Confirmar que a trajetória usa curvas normais corretamente.
4. Ativar loop e confirmar velocidade constante com loop.

### Teste G — Preview e MP4
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais (igual à v8z4b19d).
3. Confirmar que Preview respeita curva de loop (igual à v8z4b19d).
4. Confirmar que Preview não fica preto e não trava.
5. Gerar MP4, se possível.
6. Confirmar que MP4 respeita curvas normais.
7. Confirmar que MP4 respeita curva de loop.

### Teste H — save/load e compatibilidade JSON
1. Salvar projeto com imagem:
   - filename termina em `_img.json`.
   - `version` salva como `v8z4b19e`.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
2. Salvar projeto sem imagem:
   - filename termina em `_file.json`.
   - `version` salva como `v8z4b19e`.
   - `imageBase64` não existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
3. Abrir JSON salvo em v8z4b19d e confirmar compatibilidade.
4. Confirmar que **nenhum** destes campos apareceu no JSON:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
   - `capabilities`

### Teste I — integridade do console
1. Abrir DevTools.
2. Confirmar que não há erro de console, NaN ou Infinity durante uso normal.
3. Confirmar que não há erro ao puxar curvas, rodar Preview ou salvar projeto.

### Teste J — PR e deploy
1. Confirmar que o PR ficou aberto e não foi mergeado.
2. Confirmar que pages-deploy-stamp.txt foi atualizado para v8z4b19e.

---

## v8z4b19d — route segment path through runtime curve model

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19d` na UI (Settings).
3. Confirmar que nome da versão exibe `route segment path through runtime curve model`.

### Teste B — curvas normais (segmentos normais F1→F2, F2→F3)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Puxar curva normal F1→F2.
4. Confirmar que a bolinha da curva aparece na posição correta (igual à v8z4b19c).
5. Confirmar que a curva desenhada aparece igual à v8z4b19c.
6. Puxar curva normal F2→F3.
7. Confirmar que a segunda bolinha e curva aparecem corretamente.

### Teste C — curva de loop (segmento N→1)
1. Ativar loop.
2. Selecionar F1 ou último frame para exibir a bolinha roxa da curva de loop.
3. Confirmar que a bolinha roxa aparece.
4. Arrastar a bolinha da curva de loop.
5. Confirmar que a curva de loop se move igual à v8z4b19c.
6. Confirmar que o trecho de loop vai do último frame ao primeiro frame.

### Teste D — undo/redo das curvas
1. Puxar curva normal.
2. Tocar em Undo.
3. Confirmar que a curva normal volta à posição anterior.
4. Tocar em Redo.
5. Confirmar que a curva normal volta à posição editada.
6. Puxar curva de loop.
7. Tocar em Undo.
8. Confirmar que a curva de loop volta à posição anterior ao drag.
9. Tocar em Redo.
10. Confirmar que a curva de loop volta à posição editada.

### Teste E — mover frame com curvas puxadas
1. Com curvas normais já puxadas, mover um frame.
2. Confirmar que as curvas não pulsam nem resetam indevidamente.
3. Tocar em Undo.
4. Confirmar comportamento correto.
5. Puxar curva de loop, depois mover um frame.
6. Confirmar que a curva de loop não pula.

### Teste F — modo velocidade constante com loop ativo
1. Ativar modo de velocidade constante, se disponível.
2. Ativar loop.
3. Puxar curva de loop.
4. Confirmar que a distribuição de tempo não fica estranha.
5. Puxar curvas normais e confirmar que segDurations são redistribuídos corretamente.

### Teste G — Preview com curvas
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais.
3. Confirmar que Preview respeita curva de loop.
4. Confirmar que o Preview não fica preto e não trava.

### Teste H — MP4
1. Gerar MP4, se possível.
2. Confirmar que MP4 reflete as curvas puxadas (normais e loop).
3. Confirmar que o vídeo não fica preto.

### Teste I — save com imagem
1. Salvar projeto com imagem.
2. Confirmar que filename termina em `_img.json`.
3. Abrir o JSON e confirmar:
   - `version` = `v8z4b19d`;
   - `imageBase64` existe;
   - `ctrlPts` preservado;
   - `ctrlPtManual` preservado;
   - `loopCtrlPt` preservado;
   - `framePauses` preservado;
   - `segDurations` preservado;
   - nenhum campo novo criado.

### Teste J — save sem imagem
1. Salvar projeto sem imagem.
2. Confirmar que filename termina em `_file.json`.
3. Confirmar que `version` = `v8z4b19d`.
4. Confirmar que `imageBase64` não existe.
5. Confirmar que `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` estão preservados.

### Teste K — compatibilidade com JSON de v8z4b19c
1. Abrir um JSON salvo na v8z4b19c.
2. Confirmar que o projeto abre corretamente.
3. Confirmar que curvas e loop são exibidos corretamente.
4. Confirmar que nenhum campo novo foi criado ao re-salvar.

### Teste L — ausência de campos indevidos no JSON
1. Salvar o projeto e inspecionar o JSON.
2. Confirmar que NENHUM destes campos está presente:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
3. Confirmar que o JSON é idêntico ao formato da v8z4b19c.

### Teste M — ausência de erros de console
1. Abrir DevTools (Console).
2. Realizar todos os testes acima.
3. Confirmar que não há erro de console, NaN ou Infinity.
4. Confirmar que PR ficou aberto e não foi mergeado.

---

## v8z4b19c — introduce runtime vector curve model

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19c` na UI (Settings).
3. Confirmar que nome da versão exibe `introduce runtime vector curve model`.

### Teste B — curvas normais (segmentos normais F1→F2, F2→F3)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com 4 frames.
3. Puxar curva normal F1→F2.
4. Confirmar que a bolinha da curva aparece na posição correta (igual à v8z4b19b).
5. Confirmar que a curva desenhada aparece igual à v8z4b19b.
6. Puxar curva normal F2→F3.
7. Confirmar que a segunda bolinha e curva aparecem corretamente.

### Teste C — curva de loop (segmento N→1)
1. Ativar loop.
2. Selecionar F1 ou último frame para exibir a bolinha roxa da curva de loop.
3. Confirmar que a bolinha roxa aparece.
4. Arrastar a bolinha da curva de loop.
5. Confirmar que a curva de loop se move igual à v8z4b19b.
6. Confirmar que o trecho de loop vai do último frame ao primeiro frame.

### Teste D — undo/redo das curvas
1. Puxar curva normal.
2. Tocar em Undo.
3. Confirmar que a curva normal volta à posição anterior.
4. Tocar em Redo.
5. Confirmar que a curva normal volta à posição editada.
6. Puxar curva de loop.
7. Tocar em Undo.
8. Confirmar que a curva de loop volta à posição anterior ao drag.
9. Tocar em Redo.
10. Confirmar que a curva de loop volta à posição editada.

### Teste E — mover frame com curvas puxadas
1. Com curvas normais já puxadas, mover um frame.
2. Confirmar que as curvas não pulsam nem resetam indevidamente.
3. Tocar em Undo.
4. Confirmar comportamento correto.
5. Puxar curva de loop, depois mover um frame.
6. Confirmar que a curva de loop não pula.

### Teste F — modo velocidade constante com loop ativo
1. Ativar modo de velocidade constante, se disponível.
2. Ativar loop.
3. Puxar curva de loop.
4. Confirmar que a distribuição de tempo não fica estranha.
5. Puxar curvas normais e confirmar que segDurations são redistribuídos corretamente.

### Teste G — Preview com curvas
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais.
3. Confirmar que Preview respeita curva de loop.
4. Confirmar que o Preview não quebra.

### Teste H — MP4
1. Gerar MP4, se possível.
2. Confirmar que MP4 reflete as curvas puxadas.
3. Confirmar que o trecho de loop aparece corretamente no MP4.

### Teste I — save com imagem
1. Salvar projeto com imagem.
2. Confirmar que filename termina em `_img.json`.
3. Abrir o JSON e confirmar:
   - `version` = `v8z4b19c`;
   - `imageBase64` existe;
   - `ctrlPts` preservado;
   - `ctrlPtManual` preservado;
   - `loopCtrlPt` preservado;
   - `framePauses` preservado;
   - `segDurations` preservado;
   - nenhum campo novo criado.

### Teste J — save sem imagem
1. Salvar projeto sem imagem.
2. Confirmar que filename termina em `_file.json`.
3. Confirmar que `version` = `v8z4b19c`.
4. Confirmar que `imageBase64` não existe.
5. Confirmar que `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` estão preservados.

### Teste K — compatibilidade com JSON de v8z4b19b
1. Abrir um JSON salvo na v8z4b19b.
2. Confirmar que o projeto abre corretamente.
3. Confirmar que curvas e loop são exibidos corretamente.
4. Confirmar que nenhum campo novo foi criado ao re-salvar.

### Teste L — ausência de campos indevidos no JSON
1. Salvar o projeto e inspecionar o JSON.
2. Confirmar que NENHUM destes campos está presente:
   - `curvesV2`
   - `vectorPath`
   - `handles`
   - `pathPoints`
   - `runtimeCurveModel`
3. Confirmar que o JSON é idêntico ao formato da v8z4b19b.

### Teste M — ausência de erros de console
1. Abrir DevTools (Console).
2. Realizar todos os testes acima.
3. Confirmar que não há erro de console, NaN ou Infinity.
4. Confirmar que PR ficou aberto e não foi mergeado.

---

## v8z4b19b — audit loop curve path consistency

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19b` na UI (Settings).
3. Confirmar que nome da versão exibe `audit loop curve path consistency`.

### Teste B — curvas normais (segmentos normais F1→F2, F2→F3)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com 4 frames.
3. Puxar curva normal F1→F2.
4. Confirmar que a bolinha da curva aparece na posição correta (igual à v8z4b19a).
5. Confirmar que a curva desenhada aparece igual à v8z4b19a.
6. Puxar curva normal F2→F3.
7. Confirmar que a segunda bolinha e curva aparecem corretamente.

### Teste C — curva de loop (segmento de loop N→1)
1. Ativar loop.
2. Selecionar F1 ou último frame para exibir a bolinha roxa da curva de loop.
3. Confirmar que a bolinha roxa aparece.
4. Arrastar a bolinha da curva de loop.
5. Confirmar que a curva de loop se move igual à v8z4b19a.
6. Confirmar que o trecho de loop vai do último frame ao primeiro frame.

### Teste D — undo/redo das curvas
1. Puxar curva normal.
2. Tocar em Undo.
3. Confirmar que a curva normal volta à posição anterior.
4. Tocar em Redo.
5. Confirmar que a curva normal volta à posição editada.
6. Puxar curva de loop.
7. Tocar em Undo.
8. Confirmar que a curva de loop volta à posição anterior ao drag.
9. Tocar em Redo.
10. Confirmar que a curva de loop volta à posição editada.

### Teste E — mover frame com curvas puxadas
1. Com curvas normais já puxadas, mover um frame.
2. Confirmar que as curvas não pulsam nem resetam indevidamente.
3. Tocar em Undo.
4. Confirmar comportamento correto.
5. Puxar curva de loop, depois mover um frame.
6. Confirmar que a curva de loop não pula.

### Teste F — modo velocidade constante com loop ativo
1. Ativar modo de velocidade constante, se disponível.
2. Ativar loop.
3. Puxar curva de loop.
4. Confirmar que a distribuição de tempo não fica estranha.
5. Confirmar que loopDuration é redistribuído proporcionalmente ao comprimento do trecho de loop.
6. Puxar curvas normais e confirmar que segDurations são redistribuídos corretamente.

### Teste G — Preview com curvas
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais (`evaluateSegmentPath` / `getSegmentPath`).
3. Confirmar que Preview respeita curva de loop.
4. Confirmar que o Preview não quebra.

### Teste H — MP4
1. Gerar MP4, se possível.
2. Confirmar que MP4 reflete as curvas puxadas.
3. Confirmar que o trecho de loop aparece corretamente no MP4.

### Teste I — save com imagem
1. Salvar projeto com imagem.
2. Confirmar que filename termina em `_img.json`.
3. Abrir o JSON e confirmar:
   - `version` = `v8z4b19b`;
   - `imageBase64` existe;
   - `ctrlPts` preservado;
   - `ctrlPtManual` preservado;
   - `loopCtrlPt` preservado;
   - `framePauses` preservado;
   - `segDurations` preservado;
   - nenhum campo novo criado.

### Teste J — save sem imagem
1. Salvar projeto sem imagem.
2. Confirmar que filename termina em `_file.json`.
3. Confirmar que `version` = `v8z4b19b`.
4. Confirmar que `imageBase64` não existe.
5. Confirmar que `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` estão preservados.

### Teste K — compatibilidade com JSON de v8z4b19a
1. Abrir um JSON salvo na v8z4b19a.
2. Confirmar que o projeto abre corretamente.
3. Confirmar que curvas e loop são exibidos corretamente.
4. Confirmar que nenhum campo novo foi criado ao re-salvar.

### Teste L — ausência de erros de console
1. Abrir DevTools (Console).
2. Realizar todos os testes acima.
3. Confirmar que não há erro de console, NaN ou Infinity.
4. Confirmar que PR ficou aberto e não foi mergeado.

---

## v8z4b19a — standardize curve puller usage in curve rendering

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b19a` na UI (Settings).
3. Confirmar que nome da versão exibe `standardize curve puller usage in curve rendering`.

### Teste B — curvas normais (getCtrlPtPos, drawBezier, updateCtrlPts)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com 4 frames.
3. Puxar curva normal F1→F2.
4. Confirmar que a bolinha da curva aparece na posição correta (igual à v8z4b18z).
5. Confirmar que a curva desenhada aparece igual à v8z4b18z.
6. Puxar curva normal F2→F3.
7. Confirmar que a segunda bolinha e curva aparecem corretamente.

### Teste C — curva de loop (drawBezier loop, updateCtrlPts loop)
1. Ativar loop.
2. Selecionar F1 ou último frame para exibir a bolinha roxa da curva de loop.
3. Confirmar que a bolinha roxa aparece.
4. Arrastar a bolinha da curva de loop.
5. Confirmar que a curva de loop se move corretamente.

### Teste D — undo/redo das curvas
1. Puxar curva normal.
2. Tocar em Undo.
3. Confirmar que a curva normal volta à posição anterior.
4. Tocar em Redo.
5. Confirmar que a curva normal volta à posição editada.
6. Puxar curva de loop.
7. Tocar em Undo.
8. Confirmar que a curva de loop volta à posição anterior ao drag.
9. Tocar em Redo.
10. Confirmar que a curva de loop volta à posição editada.

### Teste E — mover frame com curvas puxadas
1. Com curvas normais já puxadas, mover um frame.
2. Confirmar que as curvas não pulsam nem resetam indevidamente.
3. Tocar em Undo.
4. Confirmar comportamento correto.

### Teste F — Preview com curvas
1. Rodar Preview.
2. Confirmar que Preview respeita curvas normais (evaluateSegmentPath/getSegmentPath).
3. Confirmar que Preview respeita curva de loop.
4. Confirmar que o Preview não quebra.

### Teste G — MP4
1. Gerar MP4, se possível.
2. Confirmar que MP4 reflete as curvas puxadas.

### Teste H — save com imagem
1. Salvar projeto com imagem.
2. Confirmar que filename termina em `_img.json`.
3. Abrir o JSON e confirmar:
   - `version` = `v8z4b19a`;
   - `imageBase64` existe;
   - `ctrlPts` preservado;
   - `ctrlPtManual` preservado;
   - `loopCtrlPt` preservado;
   - `framePauses` preservado;
   - `segDurations` preservado;
   - nenhum campo novo criado.

### Teste I — save sem imagem
1. Salvar projeto sem imagem.
2. Confirmar que filename termina em `_file.json`.
3. Confirmar que `version` = `v8z4b19a`.
4. Confirmar que `imageBase64` não existe.
5. Confirmar que `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` estão preservados.

### Teste J — compatibilidade com JSON de v8z4b18z
1. Abrir um JSON salvo na v8z4b18z.
2. Confirmar que o projeto abre corretamente.
3. Confirmar que curvas e loop são exibidos corretamente.
4. Confirmar que nenhum campo novo foi criado ao re-salvar.

### Teste K — ausência de erros
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Confirmar que o PR ficou aberto e não foi mergeado.

---

## v8z4b18z — fix loop curve undo

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b18z` na UI (Settings).
3. Confirmar que nome da versão exibe `fix loop curve undo`.

### Teste B — undo/redo da curva de loop (núcleo da correção)
1. Carregar imagem no iPhone/Safari.
2. Criar projeto com pelo menos 4 frames.
3. Ativar loop.
4. Selecionar F1 ou o último frame para mostrar a bolinha roxa da curva de loop.
5. Arrastar a bolinha da curva de loop para uma nova posição.
6. Tocar em Undo.
7. Confirmar que a curva de loop volta para a posição anterior ao drag.
8. Tocar em Redo.
9. Confirmar que a curva de loop volta para a posição editada.

### Teste C — curvas normais não afetadas
1. Arrastar uma curva normal (não loop) entre dois frames.
2. Tocar em Undo.
3. Confirmar que a curva normal volta à posição anterior.
4. Tocar em Redo.
5. Confirmar que a curva normal volta à posição editada.

### Teste D — histórico misto (loop + normal + frame)
1. Mover frame.
2. Arrastar curva de loop.
3. Arrastar curva normal.
4. Tocar em Undo três vezes.
5. Confirmar que cada operação desfaz na ordem correta.
6. Tocar em Redo três vezes.
7. Confirmar que cada operação refaz na ordem correta.

### Teste E — Preview com curva de loop
1. Com curva de loop ajustada, rodar Preview.
2. Confirmar que a curva de loop é respeitada na animação.
3. Confirmar que o Preview não quebra.

### Teste F — save com imagem
1. Salvar projeto com imagem.
2. Confirmar que filename termina em `_img.json`.
3. Abrir o JSON e confirmar:
   - `version` = `v8z4b18z`;
   - `imageBase64` existe;
   - `loopCtrlPt` preservado;
   - `ctrlPts` preservado;
   - `ctrlPtManual` preservado;
   - `framePauses` preservado;
   - `segDurations` preservado;
   - nenhum campo novo criado.

### Teste G — save sem imagem
1. Salvar projeto sem imagem.
2. Confirmar que filename termina em `_file.json`.
3. Confirmar que `version` = `v8z4b18z`.
4. Confirmar que `imageBase64` não existe.
5. Confirmar que `loopCtrlPt` preservado.

### Teste H — PR aberto e não mergeado
1. Confirmar que o PR está aberto.
2. Confirmar que não foi mergeado automaticamente.

---

## v8z4b18y — centralize legacy curve puller access

### Teste A — abertura e versão
1. Abrir app.
2. Confirmar que exibe `v8z4b18y` na UI.
3. Carregar imagem no iPhone/Safari.

### Teste B — curva normal
1. Criar projeto com 4 frames.
2. Mover frames.
3. Escalar frames.
4. Rotacionar frames.
5. Puxar curva entre F1→F2.
6. Puxar curva entre F2→F3.
7. Confirmar que visual e comportamento da curva são idênticos à v8z4b18x.

### Teste C — reset de curva
1. Ajustar uma curva manualmente.
2. Usar reset de curva em um trecho.
3. Confirmar que só aquele trecho muda.
4. Confirmar que outros trechos não mudam indevidamente.

### Teste D — loop e puxador de loop
1. Ativar loop.
2. Confirmar que a curva de loop aparece.
3. Ajustar curva de loop (loopCtrlPt).
4. Rodar Preview.
5. Confirmar que Preview respeita curvas normais e de loop.
6. Exportar MP4.

### Teste E — inserção de frame entre F1 e F2
1. Com curva ajustada em F1→F2, inserir frame entre eles.
2. Confirmar que os dois novos trechos têm curvas razoáveis.
3. Confirmar que não há erro de console, NaN ou Infinity.

### Teste F — mover frame (syncCtrlPtsForFrame)
1. Arrastar frame que tem curva automática em ambos os lados.
2. Confirmar que as bolinha do puxador seguem o frame corretamente.
3. Arrastar frame com curva manual em um lado.
4. Confirmar que o trecho manual mantém posição relativa; o automático se atualiza.

### Teste G — save/load
1. Criar projeto com curvas manuais e loop ativo.
2. Salvar com imagem:
   - filename termina em `_img.json`.
   - `"version": "v8z4b18y"` no JSON.
   - `imageBase64` existe.
   - `ctrlPts` preservado.
   - `ctrlPtManual` preservado.
   - `loopCtrlPt` preservado.
   - `framePauses` preservado.
   - `segDurations` preservado.
3. Salvar sem imagem:
   - filename termina em `_file.json`.
   - `"version": "v8z4b18y"`.
   - `imageBase64` não existe.
   - `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` preservados.
4. Confirmar que nenhum campo novo foi criado (`curvesV2`, `vectorPath`, `handles`, `pathPoints` ausentes).

### Teste H — compatibilidade com versões anteriores
1. Abrir JSON salvo em v8z4b18w ou v8z4b18x.
2. Confirmar que abre normalmente.
3. Confirmar que curvas aparecem corretamente.
4. Confirmar que Preview funciona.
5. Confirmar que MP4 funciona.

### Teste I — regressão rápida
1. Confirmar que não há erro de console, NaN ou Infinity.
2. Marca d'água continua `arcomotion.app`.
3. Pausas OK.
4. Velocidade constante OK.
5. Movimento Inteligente OK.
6. Rotação Inteligente OK.
7. Escala Inteligente OK.

### Teste J — entrega
1. Confirmar que o PR ficou aberto e não foi mergeado.
2. Confirmar que não há auto-merge ativo.

---

## v8z4b18x — clarify legacy curve puller architecture

### Teste A — curva normal
1. Abrir app.
2. Carregar imagem.
3. Criar 4 frames.
4. Puxar curva entre F1→F2.
5. Puxar curva entre F2→F3.
6. Confirmar que o comportamento é igual ao da v8z4b18w.
7. Rodar Preview.
8. Confirmar que o movimento segue a curva.

### Teste B — reset de curva
1. Ajustar uma curva manualmente.
2. Usar reset de curva.
3. Confirmar que o trecho correto é resetado para o ponto médio.
4. Confirmar que outros trechos não mudam indevidamente.

### Teste C — loop
1. Criar projeto com 4 frames.
2. Ativar loop.
3. Confirmar que a curva de loop aparece.
4. Ajustar curva de loop, se disponível.
5. Preview OK.
6. MP4 OK.

### Teste D — save/load
1. Criar projeto com curvas manuais.
2. Salvar com imagem.
3. Confirmar filename `_img.json`.
4. Abrir JSON.
5. Confirmar `"version": "v8z4b18x"`.
6. Confirmar `ctrlPts` salvo.
7. Confirmar `ctrlPtManual` salvo.
8. Confirmar `loopCtrlPt` salvo quando loop estiver ligado.
9. Confirmar `framePauses` salvo.
10. Confirmar que **não** há schema vetorial novo (`curvesV2`, `vectorPath`, `handles`, `pathPoints`).

### Teste E — reabrir projeto
1. Recarregar app.
2. Abrir JSON salvo pela v8z4b18x.
3. Confirmar imagem.
4. Confirmar frames.
5. Confirmar curvas.
6. Confirmar pausas.
7. Preview OK.
8. MP4 OK.

### Teste F — projeto antigo
1. Abrir projeto salvo por versão anterior (com `ctrlPts` no JSON).
2. Confirmar que abre normalmente.
3. Confirmar que curvas aparecem corretamente.
4. Confirmar que Preview funciona.
5. Confirmar que MP4 funciona.

### Teste G — regressão rápida
1. Salvar projeto desabilitado no estado inicial vazio — botão desabilitado.
2. Salvar com imagem gera `_img.json`.
3. Salvar sem imagem gera `_file.json`.
4. Marca d'água continua `arcomotion.app`.
5. Pausas OK.
6. Velocidade constante OK.
7. Movimento Inteligente OK.
8. Rotação Inteligente OK.
9. Escala Inteligente OK.
10. Zoom contextual OK.
11. Sem NaN/Infinity no console.
12. Sem tela preta.
13. Sem botão preso.
14. Configurações: versão exibe `v8z4b18x` e `clarify legacy curve puller architecture`.

---

## v8z4b18w — fix project save filename preview and suffix

### Teste A — sugestão inicial limpa
1. Abrir app.
2. Carregar imagem com nome como `img_5163.jpg`.
3. Abrir "Salvar projeto".
4. Confirmar que o campo de nome **NÃO** exibe `arco_img_5163`.
5. Confirmar que o campo exibe nome-base limpo, ex: `arco_5163`.

### Teste B — prévia do nome final visível antes de salvar
1. No modal "Salvar projeto", verificar o bloco de prévia abaixo do campo.
2. Confirmar que mostra algo como:
   - `Com imagem: arco_5163_img.json`
   - `Sem imagem: arco_5163_file.json`
3. Editar o nome no campo e confirmar que a prévia atualiza em tempo real.
4. Confirmar que o usuário consegue prever o nome final antes de tocar no botão.

### Teste C — salvar com imagem
1. Campo-base: `arco_5163`
2. Tocar em "Salvar com imagem".
3. Confirmar que o arquivo final se chama `arco_5163_img.json`.
4. Confirmar que **não** saiu `arco_img_5163_img.json`.
5. Abrir JSON.
6. Confirmar que existe `imageBase64`.
7. Confirmar que `"version": "v8z4b18w"`.

### Teste D — salvar sem imagem
1. Campo-base: `arco_5163`
2. Tocar em "Salvar sem imagem".
3. Confirmar que o arquivo final se chama `arco_5163_file.json`.
4. Confirmar que **não** saiu `arco_img_5163_file.json`.
5. Abrir JSON.
6. Confirmar que **não** existe `imageBase64`.
7. Confirmar que o arquivo é pequeno.
8. Confirmar que `"version": "v8z4b18w"`.

### Teste E — evitar duplicação de sufixo
1. Digitar `teste_img` no campo → salvar com imagem → confirmar `teste_img.json` (não `teste_img_img.json`).
2. Digitar `teste_file` no campo → salvar sem imagem → confirmar `teste_file.json` (não `teste_file_file.json`).
3. Digitar `teste.json` no campo → salvar com imagem → confirmar `teste_img.json` (não `teste.json_img.json`).
4. Confirmar que todos os arquivos terminam corretamente com `.json`.

### Teste F — caracteres problemáticos
1. Digitar `teste / projeto : 18w ?` no campo.
2. Salvar com imagem.
3. Confirmar que o nome é sanitizado (caracteres `/ : ?` viram `_`).
4. Confirmar que o arquivo salva normalmente.
5. Confirmar que termina com `.json`.

### Teste G — conteúdo preservado
1. Criar projeto com imagem, 5 ou 6 frames, pausas, curvas manuais e loop ligado.
2. Salvar com imagem.
3. Abrir JSON.
4. Confirmar: `"version": "v8z4b18w"`, `imageBase64` presente, `framePauses` presente, `ctrlPts` presente, `ctrlPtManual` presente, `loopCtrlPt` presente, `segDurations` presente.
5. Confirmar ausência de campos vetoriais novos (`vectorAnchors`, `pathPoints`, `handles`, etc.).

### Teste H — reabrir projeto salvo
1. Recarregar app.
2. Abrir o JSON salvo com imagem.
3. Confirmar que imagem abre.
4. Confirmar que pausas voltam.
5. Confirmar que curvas voltam.
6. Confirmar que loop volta.
7. Preview OK. MP4 OK.

### Teste I — regressão rápida
1. Salvar projeto continua desabilitado no estado inicial vazio.
2. Salvar projeto ativa após carregar imagem.
3. Abrir projeto OK.
4. Preview OK. MP4 OK.
5. Marca d'água continua `arcomotion.app`.
6. Curva normal OK. Curva de loop OK.
7. Velocidade constante OK. Zoom contextual OK.
8. Sem NaN/Infinity no console. Sem tela preta. Sem botão preso.

---

## v8z4b18v — update watermark to arcomotion.app

### Teste A — Preview com nova marca d'água
1. Abrir app.
2. Carregar imagem.
3. Criar movimento simples (mínimo 4 frames).
4. Abrir Preview.
5. Confirmar que a marca d'água aparece como: `arcomotion.app`
6. Confirmar que **não** aparece: Weigand Studio, Arco Motion App, Arco Motion, Arc Motion, Ken Burns App, www.arcomotion.app.

### Teste B — MP4 com nova marca d'água
1. Gerar MP4.
2. Abrir o vídeo exportado.
3. Confirmar que a marca d'água aparece como: `arcomotion.app`
4. Confirmar que posição, tamanho, cor, opacidade e alinhamento continuam iguais.
5. Confirmar que o vídeo não ficou preto.
6. Confirmar que não houve falha de exportação.

### Teste C — JSON preservado
1. Criar projeto com 5 ou 6 frames.
2. Definir pausas diferentes.
3. Criar curvas manuais.
4. Ligar loop.
5. Salvar JSON.
6. Confirmar `"version": "v8z4b18v"`.
7. Confirmar que `framePauses` está presente e correto.
8. Confirmar que `ctrlPts` está presente.
9. Confirmar que `loopCtrlPt` está presente.
10. Confirmar ausência de campos vetoriais novos (`vectorAnchors`, `pathPoints`, `handles`, etc.).

### Teste D — reabrir projeto salvo
1. Recarregar app.
2. Abrir o JSON salvo.
3. Confirmar que imagem abre.
4. Confirmar que pausas voltam.
5. Confirmar que curvas voltam.
6. Confirmar que loop volta.
7. Rodar Preview.
8. Gerar MP4.

### Teste E — regressão rápida
1. Preview OK.
2. MP4 OK.
3. Pausas OK.
4. `framePauses` OK.
5. Curva normal OK.
6. Curva de loop OK.
7. Resetar curva OK.
8. Velocidade constante OK.
9. Movimento Inteligente OK.
10. Rotação Inteligente OK.
11. Escala Inteligente OK.
12. Zoom contextual OK.
13. Salvar projeto continua desabilitado no estado inicial vazio.
14. Sem NaN/Infinity no console.
15. Sem tela preta.
16. Sem botão preso.

---

## v8z4b18u — curve segment access foundation

### Teste A — curva normal
1. Abrir app.
2. Carregar imagem.
3. Criar pelo menos 4 frames.
4. Ajustar a curva entre F1→F2 (arrastar puxador de curva).
5. Ajustar a curva entre F2→F3.
6. Confirmar que as curvas aparecem corretamente (mesmas cores, posições e tamanhos da v8z4b18t).
7. Rodar Preview.
8. Confirmar que o movimento segue as curvas corretamente.

### Teste B — reset de curva
1. Ajustar uma curva manualmente.
2. Usar reset da curva (se disponível via UI).
3. Confirmar que o trecho volta ao padrão (puxador centralizado).
4. Confirmar que outros trechos não são afetados.

### Teste C — loop
1. Criar projeto com 4 frames.
2. Ativar loop.
3. Confirmar que a bolinha de curva de loop aparece (roxa).
4. Ajustar curva de loop arrastando a bolinha.
5. Rodar Preview; confirmar que o loop funciona.
6. Gerar MP4; confirmar que o loop funciona no vídeo.

### Teste D — velocidade constante
1. Criar projeto com curvas visíveis.
2. Ativar Velocidade constante.
3. Confirmar que o movimento continua fluido.
4. Ajustar um trecho manualmente.
5. Confirmar comportamento igual à v8z4b18t.

### Teste E — save/load
1. Criar projeto com curvas manuais.
2. Salvar JSON.
3. Recarregar app.
4. Abrir o JSON.
5. Confirmar que curvas manuais voltam corretamente.
6. Confirmar que `framePauses` continuam preservadas.
7. Confirmar que `version` no JSON é `v8z4b18u`.

### Teste F — projeto antigo
1. Abrir projeto antigo (com `ctrlPts` e versão anterior).
2. Confirmar que abre normalmente.
3. Confirmar que curvas aparecem.
4. Confirmar que Preview funciona.
5. Confirmar que MP4 funciona.

### Teste G — regressão geral
1. Preview OK.
2. MP4 OK.
3. Pausas por frame OK.
4. `framePauses` OK.
5. Curva normal OK.
6. Curva de loop OK.
7. Resetar curva OK.
8. Velocidade constante OK.
9. Movimento Inteligente OK.
10. Rotação Inteligente OK.
11. Escala Inteligente OK.
12. Zoom contextual OK.
13. Marca d'água continua **Arco Motion App**.
14. "Salvar projeto" continua desabilitado no estado inicial vazio.
15. Sem NaN/Infinity no console.
16. Sem tela preta.
17. Sem botão preso.

## v8z4b18t — fix watermark brand and disable empty project save

### Teste A — estado inicial vazio
1. Abrir app limpo.
2. Confirmar que "Salvar projeto" na toolbar aparece cinza/desabilitado.
3. Abrir Configurações; confirmar que "Salvar projeto" aparece cinza/desabilitado.
4. Tocar/clicar em "Salvar projeto".
5. Confirmar que nada acontece (sem modal, sem JSON gerado).
6. Confirmar que "Carregar projeto" continua disponível.
7. Confirmar que "Carregar imagem" continua disponível.

### Teste B — ativar salvar após carregar imagem
1. Carregar uma imagem.
2. Confirmar que "Salvar projeto" ficou ativo (toolbar e Configurações).
3. Salvar projeto.
4. Confirmar que o JSON é gerado normalmente com `version: "v8z4b18t"`.

### Teste C — ativar salvar após abrir projeto
1. Abrir app limpo.
2. Carregar projeto JSON válido.
3. Confirmar que "Salvar projeto" ficou ativo.
4. Salvar novamente; confirmar JSON gerado normalmente.

### Teste D — reset geral
1. Carregar imagem ou projeto.
2. Confirmar que "Salvar projeto" está ativo.
3. Usar Reset geral.
4. Abrir Configurações.
5. Confirmar que "Salvar projeto" voltou a ficar cinza/desabilitado.

### Teste E — marca d'água Preview
1. Carregar imagem; criar movimento com 4+ frames.
2. Abrir Preview.
3. Confirmar que a marca d'água mostra **Arco Motion App**.
4. Confirmar ausência de "Arc Motion", "Weigand Studio", "Ken Burns".

### Teste F — marca d'água MP4
1. Gerar MP4.
2. Confirmar que a marca d'água no vídeo mostra **Arco Motion App**.
3. Confirmar posição, tamanho, opacidade e alinhamento inalterados.
4. Confirmar que o vídeo não ficou preto.

### Teste G — version no JSON
1. Criar projeto; salvar JSON.
2. Confirmar `"version": "v8z4b18t"` no arquivo.

### Teste H — regressão rápida
1. Preview OK.
2. MP4 OK.
3. Pausas por frame OK.
4. Curva normal OK.
5. Loop OK.
6. Velocidade constante OK.
7. Zoom contextual OK.
8. Movimento/Rotação/Escala Inteligentes OK.
9. Sem NaN/Infinity no console.
10. Sem tela preta.

## v8z4b18s — rename app to Arc Motion and fix project version metadata

### Teste A — nome visível do app
1. Abrir app.
2. Verificar `<title>` da aba do browser: confirmar `Arc Motion`.
3. Abrir Configurações.
4. Confirmar que a versão exibe `Arc Motion v8z4b18s`.
5. Confirmar que "Weigand Studio", "Arco Motion" e "Ken Burns" não aparecem em nenhum texto visível ao usuário.

### Teste B — marca d'água
1. Carregar imagem.
2. Criar movimento simples com 2 frames.
3. Gerar Preview ou MP4 no modo em que a marca d'água aparece.
4. Confirmar que a marca d'água mostra `Arc Motion`.
5. Confirmar que posição, tamanho, opacidade e alinhamento continuam iguais.

### Teste C — version salvo no JSON
1. Criar projeto novo.
2. Salvar JSON.
3. Abrir o JSON num editor de texto.
4. Confirmar que `"version"` é `"v8z4b18s"` (não mais `"v8y3"`).

### Teste D — framePauses preservado
1. Criar projeto com 4 frames.
2. Definir pausas diferentes (ex: F1=0s, F2=1.2s, F3=0.5s, F4=2.0s).
3. Salvar JSON.
4. Confirmar que `framePauses` existe com 4 entradas corretas.
5. Recarregar app e abrir o JSON — confirmar que pausas voltam corretamente.

### Teste E — projeto antigo
1. Carregar projeto antigo com `"version": "v8y3"`.
2. Confirmar que abre normalmente sem erro.
3. Confirmar que `framePauses` ausente resulta em pausas zeradas.

### Teste F — regressão geral
1. Preview OK.
2. MP4 OK.
3. Curva normal OK.
4. Velocidade constante OK.
5. Movimento Inteligente OK.
6. Rotação Inteligente OK.
7. Escala Inteligente OK.
8. Zoom contextual OK.
9. Sem NaN/Infinity no console.
10. Sem tela preta.

## v8z4b18r — fix frame pause persistence and stale load state

### Teste 0 — versão visível

1. Abrir Configurações.
2. Confirmar que a versão exibe `v8z4b18r`.
3. Confirmar que o nome exibe `fix frame pause persistence and stale load state`.

### Teste A — salvar pausas no JSON (regressão crítica Bug 1)

1. Criar projeto com 4 frames.
2. Abrir painel Duração → Pausas por frame.
3. Configurar: F1 = 0s, F2 = 1.2s, F3 = 0.5s, F4 = 2.0s.
4. Salvar JSON (com imagem).
5. Abrir o JSON num editor de texto.
6. Confirmar que `framePauses` existe com 4 entradas.
7. Confirmar que os valores batem: `[{duration:0},{duration:1.2},{duration:0.5},{duration:2}]`.
8. Confirmar que não existe `"framePauses": []` vazio.

### Teste B — reabrir na mesma sessão (sem recarregar)

1. Sem recarregar o app, carregar o JSON salvo no Teste A.
2. Abrir painel Duração → Pausas por frame.
3. Confirmar: F1 = 0.0s, F2 = 1.2s, F3 = 0.5s, F4 = 2.0s.
4. Rodar Preview — pausas respeitadas.

### Teste C — reabrir após recarregar app (regressão crítica Bug 2)

1. Recarregar completamente o app (F5 ou fechar/abrir).
2. Carregar o mesmo JSON do Teste A.
3. Abrir painel Duração → Pausas por frame.
4. Confirmar: F1 = 0.0s, F2 = 1.2s, F3 = 0.5s, F4 = 2.0s.
5. Rodar Preview — pausas respeitadas.
6. Gerar MP4 — MP4 respeita as pausas.

### Teste D — não herdar pausas antigas (isolamento de sessão)

1. Carregar um projeto COM pausas configuradas.
2. Confirmar que pausas aparecem corretamente.
3. Sem recarregar o app, carregar um projeto SEM `framePauses` (arquivo antigo).
4. Confirmar que as pausas ficam ZERADAS — não herdou pausas do projeto anterior.
5. Confirmar especificamente que o painel mostra 0.0s para todos os frames.

### Teste E — arquivo sem framePauses (arco_img_5236_img.json ou similar)

1. Carregar arquivo antigo sem campo `framePauses`.
2. Confirmar que o app carrega normalmente.
3. Confirmar que todas as pausas ficam 0.0s.
4. Confirmar que o app não inventa pausas.
5. Preview OK — sem paradas indevidas.

### Teste F — salvar sem abrir painel Duração

1. Criar projeto novo (carregar imagem, template pan-lr).
2. NÃO abrir o painel Duração.
3. Salvar JSON imediatamente.
4. Abrir o JSON num editor de texto.
5. Confirmar que `framePauses` existe com `length = frameCount` (ex.: 2 entradas para 2 frames).
6. Confirmar que não é `[]` vazio.

### Teste G — pausa final / último frame

1. Criar projeto com 3 frames.
2. No painel Duração → Acabamento, selecionar "Pausa final".
3. Ajustar slider para 1.5s.
4. Confirmar que F3 mostra 1.5s em Pausas por frame.
5. Salvar JSON.
6. Recarregar app.
7. Carregar JSON.
8. Confirmar que F3 mostra 1.5s.
9. Preview OK — pausa final respeitada.

### Teste H — loop + pausas

1. Criar 4 frames.
2. Ligar Loop.
3. Configurar pausas diferentes em frames.
4. Salvar JSON.
5. Recarregar app.
6. Carregar JSON.
7. Confirmar que loop permanece correto.
8. Confirmar que pausas permanecem corretas.
9. Preview OK.
10. MP4 OK.

### Teste I — painel Duração aberto ao salvar/carregar

1. Abrir painel Duração com aba Pausas visível.
2. Alterar pausas.
3. Salvar projeto com painel aberto.
4. Recarregar app.
5. Reabrir projeto.
6. Confirmar que pausas foram salvas.
7. Confirmar que painel não travou.
8. Confirmar que botão Voltar/fechar funciona.

### Teste J — console de diagnóstico

1. Abrir console do navegador (F12).
2. Criar projeto com pausas não-zero.
3. Salvar projeto.
4. Confirmar log: `[Arco] doSaveDirect: frameCount=N, framePauses.length=N, pausas>0=M` onde M > 0.
5. Carregar o projeto.
6. Confirmar log: `[Arco] normalizeImportedFramePauses: caso 1 — N entr. salvas, N frames, M pausa(s) não-zero restaurada(s)`.
7. Carregar arquivo sem `framePauses`.
8. Confirmar log: `[Arco] normalizeImportedFramePauses: caso 2 — sem framePauses no JSON`.

### Teste K — regressão geral

1. Curva normal OK.
2. Curva de loop OK.
3. Resetar curva OK.
4. Velocidade constante OK.
5. Ajuste manual de trecho desliga Velocidade constante.
6. Zoom contextual OK.
7. Movimento Inteligente OK.
8. Rotação Inteligente OK.
9. Escala Inteligente OK.
10. Preview OK.
11. MP4 OK.
12. Sem NaN/Infinity no console.
13. Sem tela preta.
14. Sem botão preso.

---

## v8z4b18q — normalize imported frame pauses

### Teste 0 — versão visível

1. Abrir Configurações.
2. Confirmar que a versão exibe `v8z4b18q`.
3. Confirmar que o nome exibe `normalize imported frame pauses`.

### Teste A — projeto sem pausas

1. Carregar projeto sem pausas (ex.: `arco_mona1_img_suave_lite.json`).
2. Confirmar que todas as pausas no painel Duração ficam `0.0s`.
3. Confirmar que o app não inventa pausas.
4. Preview OK — sem paradas indevidas.

### Teste B — projeto com pausas por frame

1. Criar projeto com 3 frames; configurar pausa F1 = 1.5s, F2 = 0s, F3 = 2.0s.
2. Salvar JSON.
3. Recarregar o app e carregar o JSON salvo.
4. Confirmar que painel Duração mostra F1 = 1.5s, F2 = 0.0s, F3 = 2.0s.
5. Rodar Preview — animação deve parar 1.5s no F1 e 2.0s no F3.
6. Gerar MP4 — confirmar que MP4 respeita as pausas.

### Teste C — pausa final / finishMode='pause' legado

1. Criar projeto com `finishMode='pause'`, `finishDuration=2.0`, sem `framePauses` no JSON (editar manualmente).
2. Carregar o projeto.
3. Confirmar que o último frame mostra 2.0s de pausa.
4. Preview respeita a pausa final.

### Teste D — loop + pausas

1. Carregar projeto com loop ligado e pausas por frame configuradas.
2. Confirmar que loop continua funcionando.
3. Confirmar que pausas continuam preservadas.
4. Preview OK — loop e pausas respeitados.

### Teste E — painel Duração aberto ao carregar

1. Abrir painel Duração (aba Pausas visível).
2. Carregar projeto com pausas.
3. Confirmar que o painel não trava e mostra os valores corretos.
4. Fechar painel normalmente.

### Teste F — regressão geral

1. Curva normal OK.
2. Curva de loop OK.
3. Resetar curva OK.
4. Velocidade constante OK.
5. Zoom contextual OK.
6. Movimento Inteligente OK.
7. Rotação Inteligente OK.
8. Escala Inteligente OK.
9. Preview OK.
10. MP4 OK.
11. Sem NaN/Infinity no console.
12. Sem botão preso.

---

## v8z4b18p — consolidate import fixes after duplicate 18o merges

Versão de consolidação — mesmos critérios da v8z4b18o aplicam-se integralmente. Nenhum comportamento novo; validar rastreabilidade de versão.

### Teste 0 — versão visível

1. Abrir Configurações.
2. Confirmar que a versão exibe `v8z4b18p`.
3. Confirmar que o nome exibe `consolidate import fixes after duplicate 18o merges`.
4. Confirmar ausência de qualquer menção a duas versões 18o contraditórias na UI.

### Teste A — arquivo com imageBase64 placeholder

(Idêntico à v8z4b18o — validar que o fix continua funcionando.)

1. Carregar projeto com `imageBase64: "<<mesma imageBase64 do original>>"`.
2. O app NÃO deve travar.
3. O app deve exibir "Projeto carregado — selecione a imagem para continuar".
4. Selecionar imagem compatível — frames, durações, pausas e curvas restaurados.
5. Preview OK.
6. Console: warn de placeholder, sem erros.

### Teste B — projeto com imagem válida (regressão)

1. Carregar projeto normal com `imageBase64` válido.
2. Confirmar que abre exatamente como antes.
3. Frames, durações, curvas e pausas corretos.
4. Preview OK.

### Teste C — preservação de pausas

1. Criar (ou carregar) projeto com pausas por frame.
2. Salvar JSON.
3. Reabrir o JSON.
4. Confirmar que as pausas aparecem no painel Pausas.
5. Rodar Preview — pausas respeitadas.
6. Gerar MP4 — MP4 respeita as pausas.

### Teste D — autosave restore

1. Criar projeto com 3 frames e pausas configuradas.
2. Aguardar autosave (1.5s após a última ação).
3. Recarregar a página.
4. Clicar "Continuar de onde parou?".
5. Confirmar que os frames aparecem corretamente.
6. Confirmar que as pausas configuradas estão restauradas.
7. Preview OK.

### Teste E — regressão geral

1. Curva normal OK.
2. Curva de loop OK.
3. Resetar curva OK.
4. Velocidade constante OK.
5. Ajuste manual de trecho desliga Velocidade constante.
6. Zoom contextual OK.
7. Preview OK.
8. MP4 OK.
9. Sem NaN/Infinity no console.
10. Sem tela preta.

---

## v8z4b18o — robust project import and pause preservation

### Teste A — arquivo com imageBase64 placeholder (arco_mona1_img_suave_lite.json)
1. Carregar `samples/arco_mona1_img_suave_lite.json` (version: v8r, imageBase64: `<<mesma imageBase64 do original>>`).
2. O app NÃO deve travar nem exibir "Carregando projeto com imagem…" indefinidamente.
3. O app deve exibir "Projeto carregado — selecione a imagem para continuar".
4. Os dados do projeto devem estar preservados em `pendingProjectData`.
5. Selecionar uma imagem compatível (qualquer foto 9:16 ou 16:9).
6. Os 8 frames devem aparecer no Stage.
7. Os 7 trechos devem manter: 0.9, 1.0, 1.0, 1.0, 1.0, 1.2, 1.6.
8. As curvas devem carregar (ctrlPts/ctrlPtManual restaurados).
9. Preview deve funcionar normalmente após a imagem ser selecionada.
10. No console: `[Arco] imageBase64 inválido ou placeholder — ignorando imagem embutida` (sem erros).

### Teste B — projeto com imagem válida (regressão)
1. Carregar projeto normal com imageBase64 válido (ex.: `samples/arco_mona1_img.json`).
2. Confirmar que abre exatamente como antes.
3. Frames, durações, curvas e pausas corretos.
4. Preview OK.

### Teste C — projeto com pausas
1. Criar (ou carregar) projeto com pausas por frame.
2. Salvar JSON.
3. Reabrir o JSON.
4. Confirmar que as pausas aparecem no painel Pausas.
5. Rodar Preview — confirmar que as pausas são respeitadas.
6. Gerar MP4 — confirmar que o MP4 respeita as pausas.

### Teste D — projeto sem pausas
1. Criar projeto sem pausas.
2. Salvar e reabrir.
3. Confirmar que o app não inventa pausas (todas = 0s).
4. Preview OK.

### Teste E — autosave restore (regressão v8z4b18o)
1. Criar projeto com 3 frames e pausas configuradas.
2. Aguardar autosave (1.5s após a última ação).
3. Recarregar a página.
4. Clicar "Continuar de onde parou?".
5. Confirmar que os frames aparecem corretamente.
6. Confirmar que as pausas configuradas estão restauradas.
7. Preview OK.

### Teste F — compatibilidade com projetos antigos
1. Carregar projeto salvo antes da v8z4b18n (ex. arquivos v8m, v8r com imageBase64 válido).
2. Confirmar que carrega sem travar.
3. Confirmar que frames aparecem.
4. Confirmar que curvas aparecem.
5. Salvar novamente e confirmar que o JSON não ganhou campos vetoriais novos.
6. Preview OK.

### Teste G — regressão geral
1. Curva normal OK.
2. Curva de loop OK.
3. Resetar curva OK.
4. Velocidade constante OK.
5. Ajuste manual de trecho desliga Velocidade constante.
6. Zoom contextual OK.
7. Movimento Inteligente OK.
8. Rotação Inteligente OK.
9. Escala Inteligente OK.
10. Preview OK.
11. MP4 OK.
12. Sem NaN/Infinity no console.
13. Sem tela preta.
14. Sem botão preso.

---

## v8z4b18n — vector path mode scaffold

### Teste A — sem mudança visual
1. Abrir app.
2. Carregar imagem.
3. Criar 3 frames.
4. Confirmar que o Stage permanece visualmente igual à v8z4b18m.
5. Confirmar que o curvePuller continua com o visual aprovado (losango ciano/azul).
6. Preview OK.

### Teste B — curva normal
1. Selecionar trecho 1–2.
2. Arrastar o curvePuller.
3. Confirmar que só 1–2 muda.
4. Selecionar 2–3.
5. Arrastar o curvePuller.
6. Confirmar que só 2–3 muda.
7. Preview OK.

### Teste C — loop
1. Criar 3 frames.
2. Ligar Loop.
3. Confirmar que curva 3–1 aparece imediatamente.
4. Arrastar o curvePuller de 3–1.
5. Confirmar que só 3–1 muda.
6. Resetar curva 3–1.
7. Confirmar que só 3–1 reseta.
8. Preview OK.

### Teste D — Velocidade constante
1. Criar 4 frames.
2. Ligar Loop.
3. Ligar Velocidade constante.
4. Confirmar que todos os segmentos entram no cálculo.
5. Confirmar que a fluidez permanece igual à v8z4b18m.
6. Alterar manualmente duração de um trecho.
7. Confirmar que Velocidade constante desliga.
8. Preview OK.

### Teste E — salvar/carregar
1. Criar projeto com curva manual em 1–2.
2. Criar curva manual no loop 3–1.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que curvas continuam iguais.
6. Confirmar que o JSON não ganhou `mode`, `vectorAnchors`, `pathPoints`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath` ou `curvesV2`.
7. Preview OK.

### Teste F — zoom contextual
1. Confirmar que zoom contextual continua funcionando.
2. Confirmar que mover frame com zoom funciona.
3. Confirmar que mover o curvePuller com zoom funciona.
4. Confirmar que mãozinha/pan continua funcionando.

### Teste G — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Load de projeto antigo/misto OK.
9. Trechos aparecem corretamente após load.
10. Preview OK.
11. Gerar MP4 OK.
12. Sem tela preta.
13. Sem botão preso.
14. Sem NaN/Infinity no console.

---

## v8z4b18m — visual curve puller distinction

### Teste A — aparência do curvePuller
1. Abrir app.
2. Carregar imagem.
3. Criar 3 frames.
4. Selecionar trecho 1–2.
5. Confirmar que o curvePuller aparece como losango (não círculo).
6. Confirmar que o losango é ciano/azul e visualmente distinto de um frame anchor.
7. Selecionar trecho 2–3.
8. Confirmar que o curvePuller desse trecho também é losango.

### Teste B — edição normal
1. Selecionar trecho 1–2.
2. Arrastar o curvePuller.
3. Confirmar que só 1–2 muda.
4. Selecionar trecho 2–3.
5. Arrastar o curvePuller.
6. Confirmar que só 2–3 muda.
7. Preview OK.

### Teste C — loop
1. Criar 3 frames.
2. Ligar Loop.
3. Confirmar que curvePuller 3–1 aparece como losango roxo.
4. Arrastar o curvePuller de 3–1.
5. Confirmar que só 3–1 muda.
6. Resetar curva 3–1.
7. Confirmar que só 3–1 reseta.
8. Preview OK.

### Teste D — zoom contextual
1. Ativar zoom contextual.
2. Confirmar que o curvePuller mantém tamanho visual adequado (não cresce proporcionalmente).
3. Arrastar o curvePuller com zoom.
4. Confirmar que acompanha corretamente o dedo/cursor.

### Teste E — salvar/carregar
1. Criar curvas manuais.
2. Salvar JSON.
3. Reabrir JSON.
4. Confirmar que curvas continuam iguais.
5. Confirmar que o JSON não ganhou `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller`, `curvesV2` ou `vectorPath`.

### Teste F — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Preview OK.
9. Gerar MP4 OK.
10. Sem NaN/Infinity no console.

---

## v8z4b18l — unified segment path evaluator

### Teste A — sem mudança visual
1. Abrir app.
2. Carregar imagem.
3. Criar 3 frames.
4. Confirmar que o Stage permanece visualmente igual à v8z4b18k.
5. Confirmar que o ponto atual da curva continua igual.
6. Preview OK.

### Teste B — curva normal
1. Selecionar trecho 1–2.
2. Arrastar o ponto atual da curva.
3. Confirmar que só 1–2 muda.
4. Selecionar 2–3.
5. Arrastar o ponto atual da curva.
6. Confirmar que só 2–3 muda.
7. Preview OK.

### Teste C — loop
1. Criar 3 frames.
2. Ligar Loop.
3. Confirmar que curva 3–1 aparece imediatamente.
4. Editar o ponto atual da curva 3–1.
5. Confirmar que só 3–1 muda.
6. Resetar curva 3–1.
7. Confirmar que só 3–1 reseta.
8. Preview OK.

### Teste D — Velocidade constante
1. Criar 4 frames.
2. Ligar Loop.
3. Ligar Velocidade constante.
4. Confirmar que todos os segmentos entram no cálculo.
5. Confirmar que o movimento continua fluido.
6. Alterar manualmente duração de um trecho.
7. Confirmar que Velocidade constante desliga.
8. Preview OK.

### Teste E — movimentos suavizados
1. Criar movimento com vários frames.
2. Usar movimento/rotação/escala inteligentes.
3. Confirmar que a fluidez permanece igual à v8z4b18k.
4. Confirmar que não houve regressão perceptível.

### Teste F — salvar/carregar
1. Criar projeto com curva manual em 1–2.
2. Criar curva manual no loop 3–1.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que curvas continuam iguais.
6. Confirmar que o JSON não ganhou `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller`, `curvesV2`, `vectorPath` ou `sampledPath`.
7. Preview OK.

### Teste G — zoom contextual
1. Confirmar que zoom contextual continua funcionando.
2. Confirmar que mover frame com zoom funciona.
3. Confirmar que mover o ponto atual da curva com zoom funciona.
4. Confirmar que mãozinha/pan continua funcionando.

### Teste H — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Load de projeto antigo/misto OK.
9. Trechos aparecem corretamente após load.
10. Preview OK.
11. Gerar MP4 OK.
12. Sem tela preta.
13. Sem botão preso.
14. Sem NaN/Infinity no console.

---

## v8z4b18k — separate curve puller from path points

### Teste A — sem mudança visual
1. Abrir app.
2. Carregar imagem.
3. Criar 3 frames.
4. Confirmar que o Stage permanece visualmente igual à v8z4b18j.
5. Confirmar que o ponto atual da curva continua igual (ciano, mesmo tamanho).
6. Preview OK.

### Teste B — curva normal
1. Selecionar trecho 1–2.
2. Arrastar o ponto atual da curva.
3. Confirmar que só 1–2 muda.
4. Selecionar 2–3.
5. Arrastar o ponto atual da curva.
6. Confirmar que só 2–3 muda.
7. Preview OK.

### Teste C — loop
1. Criar 3 frames.
2. Ligar Loop.
3. Confirmar que curva 3–1 aparece imediatamente.
4. Editar o ponto atual da curva 3–1.
5. Confirmar que só 3–1 muda.
6. Resetar curva 3–1.
7. Confirmar que só 3–1 reseta.
8. Preview OK.

### Teste D — salvar/carregar
1. Criar projeto com curva manual em 1–2.
2. Criar curva manual no loop 3–1.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que curvas continuam iguais.
6. Confirmar que o JSON não ganhou `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller` ou `curvesV2`.
7. Preview OK.

### Teste E — velocidade constante
1. Criar 4 frames.
2. Ligar Loop.
3. Ligar Velocidade constante.
4. Confirmar que todos os segmentos entram no cálculo.
5. Alterar manualmente duração de um trecho.
6. Confirmar que Velocidade constante desliga.
7. Preview OK.

### Teste F — zoom contextual
1. Confirmar que zoom contextual continua funcionando.
2. Confirmar que mover frame com zoom funciona.
3. Confirmar que mover o ponto atual da curva com zoom funciona.
4. Confirmar que mãozinha/pan continua funcionando.

### Teste G — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Load de projeto antigo/misto OK.
9. Trechos aparecem corretamente após load.
10. Preview OK.
11. Gerar MP4 OK.
12. Sem tela preta.
13. Sem botão preso.
14. Sem NaN/Infinity no console.

---

## v8z4b18j — editable trajectory adjustment point

### Teste A — sem mudança visual
1. Abrir app.
2. Carregar imagem.
3. Criar 3 frames.
4. Confirmar que o Stage permanece igual à v8z4b18i.
5. Confirmar que curvas aparecem igual.
6. Preview OK.

### Teste B — editar ponto de ajuste em trecho normal
1. Selecionar trecho 1–2.
2. Arrastar o ponto de curva.
3. Confirmar que só 1–2 muda.
4. Selecionar 2–3.
5. Arrastar o ponto de curva.
6. Confirmar que só 2–3 muda.
7. Preview OK.

### Teste C — reset de curva normal
1. Alterar curva 1–2.
2. Usar Resetar curva.
3. Confirmar que apenas 1–2 volta ao padrão.
4. Confirmar que 2–3 não muda.
5. Preview OK.

### Teste D — loop
1. Criar 3 frames.
2. Ligar Loop.
3. Confirmar que curva 3–1 aparece imediatamente.
4. Editar ponto de curva 3–1.
5. Confirmar que só 3–1 muda.
6. Resetar curva 3–1.
7. Confirmar que só 3–1 reseta.
8. Preview OK.

### Teste E — salvar/carregar
1. Criar projeto com curva manual em 1–2.
2. Criar curva manual no loop 3–1.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que curvas continuam iguais.
6. Confirmar que o JSON não ganhou `trajectoryPoints`, `guidePoints`, `handles` ou `paths`.
7. Preview OK.

### Teste F — undo/redo
1. Alterar ponto de curva 1–2.
2. Usar Undo.
3. Confirmar que a curva volta.
4. Usar Redo.
5. Confirmar que a curva retorna ao ajuste.
6. Repetir com o loop 3–1, se undo/redo já cobrir isso.

### Teste G — velocidade constante
1. Criar 4 frames.
2. Ligar Loop.
3. Ligar Velocidade constante.
4. Editar ponto de curva em algum trecho.
5. Confirmar que a curva muda normalmente.
6. Confirmar que Velocidade constante mantém o comportamento aprovado na v8z4b18i.
7. Preview OK.

### Teste H — zoom contextual
1. Confirmar que zoom contextual continua funcionando.
2. Confirmar que mover frame com zoom funciona.
3. Confirmar que mover ponto de curva com zoom funciona.
4. Confirmar que mãozinha/pan continua funcionando.

### Teste I — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Load de projeto antigo/misto OK.
9. Trechos aparecem corretamente após load.
10. Preview OK.
11. Gerar MP4 OK.
12. Sem tela preta.
13. Sem botão preso.
14. Sem NaN/Infinity no console.

---

## v8z4b18i — internal trajectory points model

### Teste A — sem mudança visual
1. Abrir app.
2. Carregar imagem.
3. Criar 3 frames.
4. Confirmar que o Stage permanece visualmente igual à v8z4b18h.
5. Confirmar que curvas aparecem igual.
6. Preview OK.

### Teste B — curva normal
1. Selecionar trecho 1–2.
2. Arrastar ponto de curva.
3. Confirmar que só 1–2 muda.
4. Selecionar 2–3.
5. Arrastar ponto de curva.
6. Confirmar que só 2–3 muda.
7. Preview OK.

### Teste C — loop
1. Criar 3 frames.
2. Ligar Loop.
3. Confirmar que curva 3–1 aparece imediatamente.
4. Editar ponto de curva 3–1.
5. Confirmar que só 3–1 muda.
6. Resetar curva 3–1.
7. Confirmar que só 3–1 reseta.
8. Preview OK.

### Teste D — salvar/carregar
1. Criar projeto com curva manual em 1–2.
2. Criar curva manual no loop 3–1.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que curvas continuam iguais.
6. Confirmar que o JSON não ganhou `trajectoryPoints`, `guidePoints`, `handles` ou `paths`.
7. Preview OK.

### Teste E — velocidade constante
1. Criar 4 frames.
2. Ligar Loop.
3. Ligar Velocidade constante.
4. Confirmar que todos os segmentos entram no cálculo.
5. Alterar manualmente um trecho.
6. Confirmar que Velocidade constante desliga.
7. Preview OK.

### Teste F — zoom contextual
1. Confirmar que zoom contextual continua funcionando.
2. Confirmar que mover frame com zoom funciona.
3. Confirmar que mover ponto de curva com zoom funciona.
4. Confirmar que mãozinha/pan continua funcionando.

### Teste G — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Load de projeto antigo/misto OK.
9. Trechos aparecem corretamente após load.
10. Preview OK.
11. Gerar MP4 OK.
12. Sem tela preta.
13. Sem botão preso.
14. Sem NaN/Infinity no console.

---

## v8z4b18h — refresh loop curve on toggle

### Teste A — ligar Loop
1. Carregar imagem. Criar 3 frames.
2. Confirmar que Loop está desligado (chip "Nenhum" ativo).
3. Clicar no chip "Loop" no painel Duração → Acabamento.
4. Sem tocar no Stage, confirmar que a curva roxa 3–1 aparece imediatamente.
5. Confirmar que o ponto de controle roxo aparece se F1 ou F3 estiver selecionado.

### Teste B — desligar Loop
1. Com Loop ligado e curva 3–1 visível, clicar no chip "Nenhum".
2. Confirmar que a curva 3–1 desaparece imediatamente do Stage.
3. Confirmar que o ponto de controle roxo desaparece (sem fantasma).

### Teste C — editar curva do loop
1. Ligar Loop. Selecionar F1 ou F3.
2. Arrastar o ponto de controle roxo (curva 3–1).
3. Confirmar que a curva 3–1 responde normalmente.
4. Usar Resetar curva no trecho 3–1.
5. Confirmar que apenas 3–1 reseta; demais trechos inalterados.

### Teste D — duração e velocidade constante
1. Ligar Loop. Confirmar que trecho 3–1 aparece no painel "Tempo por trecho".
2. Ligar Velocidade constante. Confirmar que 3–1 entra no cálculo.
3. Alterar manualmente a duração do trecho 3–1.
4. Confirmar que Velocidade constante desliga.

### Teste E — regressão geral
1. Preview OK após ligar/desligar Loop.
2. Exportar MP4 OK.
3. Zoom contextual OK.
4. Salvar JSON com Loop ativo e reabrir. Confirmar que curva 3–1 carrega correta.
5. Sem NaN/Infinity no console.
6. Sem tela preta.
7. Sem botão preso.

---

## v8z4b18g — internal segment path object

### Teste A — sem mudança visual
1. Abrir app.
2. Carregar imagem.
3. Criar 3 frames.
4. Confirmar que o Stage permanece visualmente igual à v8z4b18f.
5. Confirmar que curvas aparecem igual.
6. Preview OK.

### Teste B — curva normal
1. Selecionar trecho 1–2.
2. Arrastar ponto de curva.
3. Confirmar que só 1–2 muda.
4. Selecionar 2–3.
5. Arrastar ponto de curva.
6. Confirmar que só 2–3 muda.
7. Preview OK.

### Teste C — reset de curva normal
1. Alterar curva 1–2.
2. Usar Resetar curva.
3. Confirmar que apenas 1–2 volta ao padrão.
4. Confirmar que 2–3 não muda.
5. Preview OK.

### Teste D — loop
1. Criar 3 frames.
2. Ligar Loop.
3. Selecionar trecho 3–1.
4. Alterar curva do loop.
5. Confirmar que apenas a curva 3–1 muda.
6. Usar Resetar curva no loop.
7. Confirmar que apenas 3–1 reseta.
8. Preview OK.

### Teste E — salvar/carregar
1. Criar projeto com curva manual 1–2.
2. Criar curva manual no loop 3–1.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que curvas continuam iguais.
6. Confirmar que o JSON não ganhou schema novo de paths/guides/handles.
7. Preview OK.

### Teste F — velocidade constante
1. Criar 4 frames.
2. Ligar Loop.
3. Ligar Velocidade constante.
4. Confirmar que todos os segmentos entram no cálculo.
5. Alterar manualmente um trecho.
6. Confirmar que Velocidade constante desliga.
7. Preview OK.

### Teste G — zoom contextual
1. Confirmar que zoom contextual continua funcionando.
2. Confirmar que mover frame com zoom funciona.
3. Confirmar que mover ponto de curva com zoom funciona.
4. Confirmar que mãozinha/pan continua funcionando.

### Teste H — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Load de projeto antigo/misto OK.
9. Trechos aparecem corretamente após load.
10. Preview OK.
11. Gerar MP4 OK.
12. Sem tela preta.
13. Sem botão preso.
14. Sem NaN/Infinity no console.

---

## v8z4b18f — central active segments helper

### Teste A — sem loop
1. Criar 3 frames.
2. Desligar Loop.
3. Abrir painel Duração → Trechos.
4. Confirmar que aparecem apenas: 1–2, 2–3.
5. Confirmar que Tempo dos trechos soma apenas esses dois.
6. Preview OK.

### Teste B — com loop
1. Criar 3 frames.
2. Ligar Loop.
3. Abrir painel Duração → Trechos.
4. Confirmar que aparecem: 1–2, 2–3, 3–1.
5. Confirmar que Tempo dos trechos soma os 3 trechos.
6. Preview OK.

### Teste C — Igualar intervalos com loop
1. Criar 3 frames, Loop ligado.
2. Tocar em "Igualar intervalos".
3. Confirmar que 1–2, 2–3 e 3–1 ficam com o mesmo tempo.
4. Confirmar que Velocidade constante desliga se estava ativa.
5. Preview OK.

### Teste D — Velocidade constante com loop
1. Criar 4 frames, Loop ligado.
2. Ligar Velocidade constante.
3. Confirmar que todos os segmentos ativos entram no cálculo (incluindo 4–1).
4. Alterar manualmente o slider 4–1 no breakdown.
5. Confirmar que Velocidade constante desliga.
6. Preview OK.

### Teste E — curvas por trecho
1. Criar 3 frames.
2. Alterar curva 1–2. Confirmar que só 1–2 muda.
3. Alterar curva 2–3. Confirmar que só 2–3 muda.
4. Ligar Loop. Alterar curva 3–1. Confirmar que só o loop muda.
5. Resetar curva do loop. Confirmar que só o loop reseta.
6. Preview OK.

### Teste F — adicionar/remover frames
1. Criar 4 frames, Loop ligado.
2. Remover um frame. Confirmar que a lista de trechos atualiza sem erro.
3. Adicionar frame. Confirmar que a lista atualiza sem erro.
4. Sem NaN/Infinity no console.

### Teste G — salvar/carregar
1. Criar projeto com loop, curvas e tempos ajustados.
2. Salvar JSON.
3. Reabrir JSON.
4. Confirmar que trechos, loop, curvas e durações estão corretos.
5. Preview OK.

### Teste H — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK (inclui loop).
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Zoom contextual OK.
9. Load de projeto antigo/misto OK.
10. Preview OK.
11. Gerar MP4 OK.
12. Sem tela preta, sem botão preso, sem NaN/Infinity no console.

---

## v8z4b18e — manual segment duration disables constant speed

### Teste A — trecho normal desliga Velocidade constante
1. Criar 3 frames.
2. Ligar Velocidade constante.
3. Abrir painel Duração → Trechos.
4. Arrastar o slider do trecho 1-2.
5. Confirmar que o valor do trecho muda.
6. Confirmar que Velocidade constante desliga (botão Manual fica ativo).
7. Confirmar que os outros trechos mantêm seus valores.

### Teste B — trecho de loop desliga Velocidade constante
1. Criar 3 frames.
2. Ligar Loop (chip "Loop" em Acabamento).
3. Ligar Velocidade constante.
4. Abrir painel Duração → Trechos.
5. Arrastar o slider do trecho 3-1.
6. Confirmar que o valor muda.
7. Confirmar que Velocidade constante desliga.
8. Confirmar que Manual fica ativo.
9. Confirmar que o total atualiza corretamente.

### Teste C — Igualar intervalos desliga Velocidade constante
1. Criar 3 frames.
2. Ligar Velocidade constante.
3. Tocar em "Igualar intervalos".
4. Confirmar que os trechos recebem o mesmo valor.
5. Confirmar que Velocidade constante desliga.
6. Confirmar que Manual fica ativo.

### Teste D — slider Total preserva Velocidade constante
1. Criar 3 frames.
2. Ligar Velocidade constante.
3. Arrastar o slider Total dos trechos.
4. Confirmar que Velocidade constante permanece ligada.
5. Confirmar que os trechos são redistribuídos proporcionalmente ao comprimento de curva.
6. Com Loop ligado: confirmar que N→1 entra na redistribuição.

### Teste E — ativar Loop preserva Velocidade constante
1. Criar 3 frames.
2. Ligar Velocidade constante.
3. Ativar Loop.
4. Confirmar que o trecho 3-1 entra na distribuição.
5. Confirmar que Velocidade constante permanece ligada.
6. Desativar Loop.
7. Confirmar que redistribuição remove 3-1 e mantém Velocidade constante.

### Teste F — slider Retorno (loopDurSlider) desliga Velocidade constante
1. Criar 3 frames.
2. Ligar Loop.
3. Ligar Velocidade constante.
4. Arrastar o slider "Retorno" na seção Acabamento (fora do breakdown).
5. Confirmar que Velocidade constante desliga.
6. Confirmar que Manual fica ativo.

### Teste G — painel ease contextual, trecho loop
1. Criar 3 frames.
2. Ligar Loop.
3. Ligar Velocidade constante.
4. Abrir painel de easing do trecho 3-1.
5. Alterar a duração pelo slider do painel.
6. Confirmar que Velocidade constante desliga.

### Teste H — regressão geral
1. Preview OK.
2. MP4 OK.
3. Movimento Inteligente OK.
4. Rotação Inteligente OK.
5. Escala Inteligente OK.
6. Resetar curva OK.
7. Zoom contextual OK.
8. Salvar/reabrir JSON OK (modo salvo corretamente).
9. Sem NaN/Infinity no console.
10. Sem botão preso.

---

## v8z4b18d — include loop in segment duration totals

### Teste A — 3 frames com loop: contagem e total
1. Criar 3 frames.
2. Ligar Loop (chip "Loop" em Acabamento).
3. Abrir painel Duração → seção Trechos.
4. Confirmar que aparecem: 1-2, 2-3, 3-1.
5. Confirmar que "Tempo dos trechos" no resumo inclui os 3 valores somados.
6. Confirmar que o trecho 3-1 NÃO aparece em Acabamento como componente separado.
7. Confirmar que "Acabamento" mostra 0.0s.

### Teste B — Igualar intervalos
1. Com 3 frames e Loop ligado.
2. Tocar em "Igualar intervalos".
3. Confirmar que 1-2, 2-3 e 3-1 recebem o mesmo valor.
4. Confirmar que "Tempo dos trechos" = soma dos 3.

### Teste C — slider Total
1. Com 3 frames e Loop ligado.
2. Arrastar slider Total.
3. Confirmar que os 3 trechos são redistribuídos proporcionalmente.
4. Confirmar que o loop não fica parado em valor fixo.

### Teste D — ajuste manual do loop
1. Alterar manualmente o slider do trecho 3-1.
2. Confirmar que "Tempo dos trechos" atualiza imediatamente.
3. Confirmar que "Duração total" atualiza corretamente.

### Teste E — loop desligado
1. Desligar Loop (chip "Nenhum").
2. Confirmar que 3-1 desaparece da lista de trechos.
3. Confirmar que "Tempo dos trechos" conta apenas 1-2 e 2-3.
4. Confirmar que Acabamento/Pausa final continua funcionando.

### Teste F — velocidade constante com loop
1. Ligar Loop.
2. Ligar "Velocidade constante".
3. Confirmar que o trecho N→1 entra na redistribuição.
4. Desligar Loop.
5. Confirmar que o cálculo remove N→1 sem erro.

### Teste G — regressão geral
1. Preview OK.
2. MP4 OK.
3. Movimento Inteligente OK.
4. Rotação Inteligente OK.
5. Escala Inteligente OK.
6. Resetar curva OK.
7. Zoom contextual OK.
8. Load de projeto antigo OK.
9. Salvar/reabrir JSON OK.
10. Sem NaN/Infinity no console.
11. Sem tela preta.

---

## v8z4b18c — curve access helpers without behavior change

### Teste A — sem mudança visual
1. Abrir app.
2. Carregar imagem.
3. Criar 3 frames.
4. Confirmar que visual do Stage permanece igual à v8z4b18b.
5. Confirmar que curvas aparecem igual.

### Teste B — curva normal
1. Selecionar trecho 1–2.
2. Arrastar ponto de curva.
3. Confirmar que a curva 1–2 muda corretamente.
4. Confirmar que trecho 2–3 não muda.
5. Preview OK.

### Teste C — reset de curva normal
1. Alterar curva 1–2.
2. Usar Resetar curva.
3. Confirmar que apenas 1–2 volta ao padrão.
4. Preview OK.

### Teste D — loop
1. Criar 4 frames.
2. Ligar Loop.
3. Selecionar trecho 4–1.
4. Alterar curva do loop.
5. Confirmar que apenas a curva do loop muda.
6. Usar Resetar curva no loop.
7. Confirmar que apenas o loop reseta.
8. Preview OK.

### Teste E — sem loop
1. Desligar Loop.
2. Confirmar que não aparece erro de índice.
3. Confirmar que trechos normais continuam editáveis.
4. Preview OK.

### Teste F — salvar/carregar
1. Criar projeto com curva manual em trecho normal.
2. Criar curva manual no loop.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que curvas continuam iguais.
6. Preview OK.

### Teste G — zoom contextual
1. Confirmar que zoom contextual da v8z4b18b continua funcionando.
2. Confirmar que mover frame com zoom funciona.
3. Confirmar que mover ponto de curva com zoom funciona.
4. Confirmar que mãozinha/pan continua funcionando.

### Teste H — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Load de projeto antigo/misto OK.
9. Trechos aparecem corretamente após load.
10. Preview OK.
11. Gerar MP4 OK.
12. Sem tela preta.
13. Sem botão preso.
14. Sem NaN/Infinity no console.

---

## v8z4b18b — tune contextual zoom trigger

### Teste A — frame médio (não deve mostrar zoom)
1. Carregar imagem.
2. Selecionar frame com tamanho confortável (acima de 30% do Stage em ambos os eixos).
3. Confirmar que a barra de zoom NÃO aparece.

### Teste B — frame pequeno (deve mostrar zoom)
1. Reduzir frame até ficar menor que ~30% do Stage em algum eixo.
2. Confirmar que a barra de zoom aparece automaticamente.
3. Confirmar que aparece sem quebrar layout.

### Teste C — zoom ativo (barra permanece visível)
1. Fazer a barra aparecer (frame pequeno).
2. Aumentar zoom para 125% ou mais.
3. Confirmar que a barra continua visível.
4. Aumentar o frame até ultrapassar 30% do Stage — enquanto editorZoomScale > 1, barra segue visível.

### Teste D — voltar para 100%
1. Reduzir zoom até 100%.
2. Selecionar frame grande/médio (>30% do Stage).
3. Confirmar que a barra desaparece.

### Teste E — regressão
1. Mover frame.
2. Mover ponto de curva.
3. Usar mãozinha.
4. Preview OK.
5. MP4 OK.
6. Sem NaN/Infinity no console.

---

## v8z4b18a — contextual editor zoom visibility

### Teste A — modo normal, frame grande
1. Carregar imagem.
2. Selecionar frame grande (>160 px em ambos os eixos no stage).
3. Confirmar que a barra de zoom NÃO aparece.
4. Confirmar que a tela ficou mais limpa.

### Teste B — modo normal, frame pequeno
1. Reduzir bastante o frame ativo (abaixo de 160 px em algum eixo).
2. Confirmar que a barra de zoom aparece automaticamente.
3. Confirmar que ela aparece sem quebrar layout.

### Teste C — zoom já ativado (>100%)
1. Fazer aparecer a barra (frame pequeno ou modo Curvas).
2. Aumentar zoom para 125% ou mais.
3. Confirmar que a barra continua visível.
4. Redimensionar o frame para grande — enquanto zoom >100%, barra segue visível.

### Teste D — voltar ao normal
1. Reduzir zoom até 100%.
2. Deixar o frame ativo grande o suficiente (>160 px).
3. Confirmar que a barra desaparece.

### Teste E — modo Curvas (painel Easing)
1. Com 2+ frames, clicar em uma ease-pill para abrir o painel Easing.
2. Confirmar que a barra de zoom aparece.
3. Confirmar que continua aparecendo mesmo com frame grande.
4. Confirmar que mãozinha continua disponível (se zoom >100%).
5. Fechar o painel Easing (arrastar para baixo ou tocar fora).
6. Confirmar que a barra some (se frame grande e zoom =100%).

### Teste F — mãozinha
1. Ativar zoom (frame pequeno ou abrindo Easing).
2. Ativar mãozinha.
3. Fazer pan.
4. Abrir menu inferior (ex: Template).
5. Confirmar que mãozinha desliga.
6. Confirmar que zoom/pan não quebram.

### Teste G — regressão
1. Mover frame.
2. Mover ponto de curva.
3. Usar handle ciano.
4. Preview OK.
5. MP4 OK.
6. Loop OK.
7. Pausa final OK.
8. Velocidade constante OK.
9. Movimento Inteligente OK.
10. Sem NaN/Infinity no console.

---

## v8z4b17z — fixed-size editor controls during zoom

### Teste A — tamanho dos controles
1. Carregar imagem.
2. Ver tamanho dos controles em 100%.
3. Aumentar para 125%.
4. Confirmar que bordas, pontos e handle ciano continuam visualmente do mesmo tamanho.
5. Repetir em 150%, 175% e 200%.

### Teste B — handle ciano
1. Ativar 200%.
2. Confirmar que o handle ciano não fica gigante.
3. Confirmar que o ícone dentro dele não fica gigante.
4. Usar o handle (arrastar).
5. Confirmar que escala/rotação continuam funcionando.

### Teste C — bordas dos frames
1. Ativar 200%.
2. Confirmar que a borda do frame não engrossa proporcionalmente.
3. Confirmar que labels/números não crescem demais.
4. Confirmar que o frame continua legível.

### Teste D — curvas
1. Ativar 200%.
2. Confirmar que a curva não fica grossa demais.
3. Confirmar que tracejado e linha ativa continuam proporcionais.
4. Mover ponto de curva.
5. Confirmar que acompanha o dedo corretamente.

### Teste E — pan e edição
1. Ativar zoom > 100%.
2. Ativar mãozinha.
3. Fazer pan.
4. Desativar mãozinha.
5. Mover frame.
6. Mover ponto de curva.
7. Confirmar que tudo funciona.

### Teste F — Preview/MP4
1. Ativar zoom 200%.
2. Fazer pan.
3. Rodar Preview.
4. Confirmar que Preview está normal.
5. Gerar MP4.
6. Confirmar que MP4 está normal.

### Teste G — regressão geral
1. Movimento Inteligente OK.
2. Rotação Inteligente OK.
3. Escala Inteligente OK.
4. Velocidade constante OK.
5. Loop como trecho real OK.
6. Pausa final OK.
7. Resetar curva OK.
8. Load de projeto antigo/misto OK.
9. Sem tela preta.
10. Sem botão preso.
11. Sem NaN/Infinity no console.

---

## v8z4b17y — fix editor zoom toolbar and overlay isolation

### Teste A — ícone correto
1. Carregar imagem.
2. Ver controle de zoom no Stage.
3. Confirmar que o botão Mover visão usa ícone de **mãozinha** (não ícone de 4 setas).

### Teste B — controles em linha
1. Confirmar que os controles aparecem em uma **única linha horizontal**: `[ − ] [ 125% ] [ + ] [ 🖐 ]`.
2. Confirmar que nenhum botão quebra para uma linha abaixo.
3. Confirmar que continuam sobre o Stage, no canto superior direito.

### Teste C — avisos não dão zoom
1. Ativar zoom 150% ou 200%.
2. Gerar algum aviso/status/toast (ex: carregar imagem inválida, acionar ação que mostra toast).
3. Confirmar que o aviso aparece em **tamanho normal** (não ampliado).
4. Confirmar que o aviso não acompanha o scale do Stage.
5. Confirmar que o aviso continua legível e posicionado corretamente.

### Teste D — zoom só no conteúdo editável
1. Ativar zoom 150%.
2. Confirmar que imagem, frames, curvas e pontos ampliam.
3. Confirmar que botões de zoom, status, menus e painéis **não ampliam**.

### Teste E — release automático da mãozinha ao abrir menu
1. Ativar zoom > 100%.
2. Ativar botão mãozinha (editorPanMode = true).
3. Abrir painel inferior (ex: Duração, Easing, Formato).
4. Confirmar que **editorPanMode desliga** (mãozinha perde estado azul).
5. Confirmar que o zoom e pan **permanecem preservados**.
6. Fechar painel.
7. Confirmar que o Stage não está mais em modo Mover visão.
8. Repetir com Configurações (botão de engrenagem).

### Teste F — regressão
1. Mover frame com zoom ativo e mãozinha desligada. Confirmar comportamento correto.
2. Mover ponto de curva com zoom ativo. Confirmar sem deslocamento.
3. Ativar mãozinha e fazer pan. Confirmar que frame/ponto não movem durante pan.
4. Preview OK.
5. MP4 OK.
6. Sem NaN/Infinity no console.

---

## v8z4b17x — fractional editor zoom and pan mode

### Teste A — posição do controle
1. Carregar imagem.
2. Confirmar que o controle `[-] [100%] [+]` aparece no canto **superior direito** do Stage (não na parte inferior).
3. Confirmar que não desloca os menus inferiores.
4. Confirmar que desaparece durante Preview.
5. Confirmar que reaparece após sair do Preview.
6. Confirmar que não aparece antes de carregar imagem.

### Teste B — zoom fracionado
1. Tocar em `[+]`. Confirmar 100% → 125%.
2. Tocar novamente. Confirmar 125% → 150%.
3. Continuar: 175%, 200%, 250%, 300%.
4. Em 300%, `[+]` fica desabilitado.
5. Tocar em `[−]`. Confirmar 300% → 250%.
6. Continuar reduzindo. Confirmar passos progressivos.
7. Em 100%, `[−]` fica desabilitado.
8. Confirmar que 2× não é mais o primeiro salto de 100%.

### Teste C — mover visão
1. Ativar zoom 125% ou maior.
2. Confirmar que o botão **Mover** aparece abaixo do controle de zoom.
3. Tocar em **Mover**. Confirmar que o botão fica azul (ativo).
4. Arrastar no Stage. Confirmar que a viewport se move.
5. Confirmar que nenhum frame se move.
6. Confirmar que nenhum ponto de curva se move.
7. Tocar em **Mover** novamente. Confirmar que desativa.
8. Arrastar no Stage. Confirmar que frames voltam a ser arrastáveis.

### Teste D — edição com zoom
1. Zoom em 125%.
2. Mover frame. Confirmar que acompanha corretamente o dedo.
3. Zoom em 150%.
4. Arrastar ponto de curva. Confirmar posição correta.
5. Zoom em 200%.
6. Repetir mover frame e ponto de curva. Confirmar sem deslocamento.

### Teste E — duplo toque
1. Dar duplo toque nos botões `[−]`, `[+]` e no indicador `100%`.
2. Confirmar que não troca frame nem aciona ação não esperada.
3. Ativar Mover visão.
4. Dar duplo toque no Stage.
5. Confirmar que não aciona troca/seleção de frame.
6. Desativar Mover visão.
7. Confirmar que o comportamento normal de duplo toque (se houver) volta.

### Teste F — indicador toca → resetar
1. Ativar zoom 150%, fazer pan.
2. Tocar no indicador de zoom (`150%`).
3. Confirmar que volta para 100% e pan é zerado.

### Teste G — botão Mover oculto em 100%
1. Em 100%, confirmar que o botão Mover não aparece.
2. Ativar 125%. Confirmar que aparece.
3. Reduzir para 100% via `[−]`. Confirmar que o botão desaparece.
4. Confirmar que `editorPanMode` foi desativado automaticamente.

### Teste H — Preview e MP4
1. Ativar zoom 200%. Fazer pan.
2. Rodar Preview. Confirmar que o Preview está correto e não ampliado.
3. Gerar MP4. Confirmar que o MP4 está correto.
4. Voltar do Preview. Confirmar que o controle de zoom ainda mostra 200%.

### Teste I — reset de zoom
1. Ativar 250%. Fazer pan.
2. Carregar nova imagem. Confirmar que zoom volta para 100% e pan para 0,0.
3. Ativar 175%.
4. Tocar em Reset (ícone no topo). Confirmar que zoom volta para 100%.

### Teste J — regressão geral
1. Movimento Inteligente continua funcionando.
2. Rotação Inteligente continua funcionando.
3. Escala Inteligente continua funcionando.
4. Velocidade constante continua funcionando.
5. Loop como trecho real continua funcionando.
6. Pausa final continua seguindo o último frame.
7. Load de projeto antigo/misto continua OK.
8. Trechos aparecem corretamente após load.
9. Resetar curva continua funcionando.
10. Sem tela preta.
11. Sem botão preso.
12. Sem NaN/Infinity no console.

---

## v8z4b17w — fixed editor zoom levels

### Teste A — comportamento em 1×
1. Abrir app.
2. Carregar imagem.
3. Confirmar que o Stage aparece igual ao comportamento anterior (sem zoom).
4. Mover frame. Confirmar que frame acompanha o dedo.
5. Arrastar ponto de controle de curva. Confirmar posição correta.
6. Preview OK.
7. MP4 OK.

### Teste B — zoom 2×
1. Tocar no botão "1×" (canto inferior direito do stage). Confirmar que muda para "2×".
2. Confirmar que imagem, frames, curvas e pontos ampliam juntos.
3. Arrastar em área vazia para pan. Confirmar que apenas a visualização se move.
4. Mover um frame em 2×. Confirmar que o frame acompanha o dedo sem deslocamento.
5. Arrastar ponto de controle de curva em 2×. Confirmar posição correta.
6. Preview OK.

### Teste C — zoom 4×
1. Tocar no botão "2×". Confirmar que muda para "4×".
2. Fazer pan até uma região específica da imagem.
3. Selecionar e mover frame nessa região. Confirmar sem deslocamento entre dedo e frame.
4. Arrastar ponto de controle. Confirmar sem deslocamento.
5. Tocar no botão "4×". Confirmar retorno para "1×".
6. Confirmar que o Stage recentraliza (sem transform residual).

### Teste D — não alterar dados reais
1. Criar projeto com frames e curvas configuradas.
2. Ativar 4× e fazer pan.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que o zoom não foi salvo (app abre em 1×).
6. Confirmar que frames/curvas estão iguais ao salvo.
7. Preview OK.

### Teste E — Preview e MP4 ignoram zoom
1. Ativar 4× e pan para canto.
2. Rodar Preview. Confirmar que o Preview não aparece ampliado ou deslocado.
3. Gerar MP4. Confirmar que o MP4 está correto (sem zoom de edição).
4. Voltar do Preview. Confirmar que o app continua estável.

### Teste F — interações em zoom
1. Em 2× e 4×, testar:
   - Mover frame.
   - Selecionar frame diferente.
   - Usar handle de escala/rotação (global handle).
   - Mover ponto de controle de curva.
   - Selecionar trecho via pill do midBar.
   - Abrir painel de easing.
   - Resetar curva.
2. Confirmar que tudo usa coordenadas corretas.

### Teste G — reset de zoom
1. Ativar 2× ou 4×.
2. Carregar nova imagem. Confirmar que zoom volta para 1×.
3. Ativar 4× novamente.
4. Tocar em Reset (ícone de reset no topo). Confirmar que zoom volta para 1×.

### Teste H — regressão geral
1. Movimento Inteligente continua funcionando.
2. Rotação Inteligente continua funcionando.
3. Escala Inteligente continua funcionando.
4. Velocidade constante continua funcionando.
5. Loop como trecho real continua funcionando.
6. Pausa final continua seguindo o último frame.
7. Load de projeto antigo/misto continua OK.
8. Preview OK.
9. Gerar MP4 OK.
10. Sem tela preta, sem botão preso, sem NaN/Infinity no console.

---

## v8z4b17u — reset selected segment curve

### Teste A — reset em trecho normal
1. Criar 3 frames.
2. Selecionar trecho 1–2 (abrir painel Easing via pill do segmento).
3. Alterar manualmente a curva 1–2 (arrastar ponto de controle).
4. Tocar em **Resetar curva**.
5. Confirmar que a curva 1–2 voltou à posição padrão (midpoint).
6. Confirmar que a curva 2–3 não foi alterada.
7. Preview OK.

### Teste B — reset em outro trecho
1. Alterar manualmente as curvas 1–2 e 2–3.
2. Selecionar trecho 2–3.
3. Tocar em **Resetar curva**.
4. Confirmar que 2–3 voltou ao padrão.
5. Confirmar que 1–2 permanece manual.
6. Preview OK.

### Teste C — reset com loop ligado
1. Criar 4 frames.
2. Ligar Loop.
3. Confirmar que aparece trecho 4–1 no seletor.
4. Alterar manualmente a curva 4–1.
5. Selecionar trecho 4–1 no painel Easing.
6. Tocar em **Resetar curva**.
7. Confirmar que a curva 4–1 voltou ao padrão.
8. Confirmar que Loop permanece ligado.
9. Confirmar que duração e easing do loop não mudaram.
10. Preview OK.

### Teste D — não alterar outros parâmetros
1. Em um trecho, configurar duração específica.
2. Configurar easing manual ou modo inteligente.
3. Configurar rotação e escala nos frames.
4. Alterar curva manualmente.
5. Tocar em **Resetar curva**.
6. Confirmar que duração não mudou.
7. Confirmar que easing não mudou.
8. Confirmar que rotação não mudou.
9. Confirmar que escala não mudou.
10. Preview OK.

### Teste E — salvar/reabrir
1. Alterar uma curva manualmente.
2. Tocar em **Resetar curva**.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que a curva continua no padrão (não manual).
6. Preview OK.

### Teste F — undo/redo
1. Alterar curva manualmente.
2. Tocar em **Resetar curva**.
3. Usar undo.
4. Confirmar que a curva manual anterior voltou.
5. Usar redo.
6. Confirmar que o reset foi reaplicado.
7. Preview OK.

### Teste G — regressão geral
1. Movimento Inteligente continua funcionando.
2. Rotação Inteligente continua funcionando.
3. Escala Inteligente continua funcionando.
4. Velocidade constante continua funcionando.
5. Loop como trecho real continua funcionando.
6. Pausa final continua seguindo o último frame.
7. Load de projeto antigo/misto continua OK.
8. Trechos aparecem corretamente após load.
9. Preview OK.
10. Gerar MP4 OK.
11. Sem tela preta.
12. Sem botão preso.
13. Sem NaN/Infinity no console.

---

## v8z4b17t — smart easing defaults for new projects

### Teste A — projeto novo
1. Abrir app limpo (nova aba).
2. Carregar imagem.
3. Criar frames.
4. Abrir painel de trecho/easing.
5. Confirmar que Velocidade/Movimento Inteligente está ligado.
6. Confirmar que Rotação Inteligente está ligada.
7. Confirmar que Escala Inteligente está ligada.
8. Preview OK.

### Teste B — reset
1. Desligar Movimento Inteligente, Rotação Inteligente, Escala Inteligente.
2. Fazer Reset (botão reset na toolbar).
3. Abrir painel de trecho/easing.
4. Confirmar que os três modos voltaram ligados.

### Teste C — salvar projeto novo com modos smart
1. Criar projeto novo (app limpo + imagem).
2. Confirmar que os três modos inteligentes estão ligados.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que os três modos continuam ligados.
6. Preview OK.

### Teste D — projeto salvo com modos manual
1. Criar projeto novo.
2. Desligar Rotação Inteligente e Escala Inteligente.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que Rotação e Escala continuam manuais.
6. Confirmar que Movimento Inteligente continua ligado.
7. Preview OK.

### Teste E — projeto antigo sem campos novos
1. Carregar JSON antigo sem `movementEasingMode`/`rotationEasingMode`/`scaleEasingMode`.
2. Confirmar que abre em manual/manual/manual.
3. Confirmar que não herda easeMode/easeAmount invisível.
4. Preview OK.

### Teste F — projeto antigo/misto da v8z4b17s
1. Carregar `arco_projeto- pausas_img.json`.
2. Confirmar que continua sem pausa invisível.
3. Confirmar que continua sem easing invisível.
4. Confirmar que os modos respeitam os campos do JSON.
5. Preview OK.

### Teste G — regressão geral
1. Loop como trecho real continua funcionando.
2. Pausa final continua seguindo o último frame.
3. Velocidade constante continua redistribuindo com loop.
4. Movimento Inteligente continua funcionando.
5. Rotação Inteligente continua funcionando.
6. Escala Inteligente continua funcionando.
7. Painel Duração/Tempo mostra Trechos corretamente após load.
8. Preview OK.
9. Gerar MP4 OK.
10. Sem tela preta, sem botão preso, sem NaN/Infinity no console.

---

## v8z4b17s — legacy project migration cleanup

### Teste A — arquivo antigo/misto (arco_projeto- pausas_img.json)
1. Carregar o arquivo `arco_projeto- pausas_img.json`.
2. Confirmar que os 8 frames carregam corretamente.
3. Abrir painel Duração/Tempo → Pausas. Confirmar que framePauses aparecem todos 0.
4. Confirmar que não há pausa por frame invisível (Preview não pausa entre frames).
5. Confirmar que Pausa final está desligada (finishMode ≠ 'pause').
6. Confirmar que Loop está ligado (finishMode = 'loop' → trecho 8→1 visível).
7. Confirmar que o trecho 8–1 aparece como trecho real de loop na lista de Trechos.
8. Confirmar que finishDuration 0.8 não aparece como pausa final.
9. Preview: movimento fluido sem pausas ou easing invisível.

### Teste B — easeMode/easeAmount não comandam invisivelmente
1. No mesmo arquivo (easeMode: "global", easeAmount: 1, movementEasingMode: "manual").
2. Confirmar que o painel mostra Modo Manual para Movimento.
3. Preview: sem easing invisível (movimento deve ser linear/constante, não ease-in-out).
4. Confirmar que a UI mostra o mesmo modo que o motor usa.
5. Se não houver segEasings salvos, comportamento deve ser linear/constante.

### Teste C — salvar/reabrir
1. Carregar o arquivo antigo/misto.
2. Salvar novamente como JSON.
3. Reabrir o JSON novo.
4. Confirmar que não volta a aparecer easing invisível.
5. Confirmar que não aparece pausa invisível.
6. Confirmar que loop continua coerente (8–1 visível).

### Teste D — JSON antigo sem movementEasingMode
1. Carregar um JSON antigo que tenha easeMode/easeAmount mas não tenha movementEasingMode.
2. Confirmar que o app define movementEasingMode = 'manual' automaticamente.
3. Confirmar que easeAmount não cria easing invisível.
4. Confirmar que a UI mostra o modo correto.

### Teste E — JSON com easeMode 'pause' e framePauses zerados
1. Carregar JSON com easeMode: "pause" e framePauses presentes (todos zero).
2. Confirmar que pauseDuration é neutralizado.
3. Confirmar que não há pausa inter-segmento invisível no Preview.

### Teste F — finishMode versus loopEnabled
1. Carregar arquivo com finishMode: "loop" e loopEnabled: true. Confirmar que loop ativo.
2. Se disponível: carregar arquivo com finishMode: "pause" e loopEnabled: true.
3. Confirmar que finishMode: "pause" manda e loop fica desligado.
4. Confirmar que loopEnabled legacy não sobrescreve finishMode atual.

### Teste G — regressão de projetos novos
1. Criar projeto novo. Confirmar modos atuais funcionam.
2. Confirmar Movimento Inteligente, Rotação Inteligente e Escala Inteligente OK.
3. Confirmar Loop como trecho N→1 OK.
4. Confirmar Pausa final espelhando o último frame OK.
5. Preview OK. MP4 OK.

### Teste H — regressão geral
1. Carregar projeto com 6 frames. Confirmar Trechos corretos.
2. Carregar projeto com 30 frames. Confirmar Trechos corretos.
3. Ativar Velocidade constante. Ativar Loop. Confirmar redistribuição.
4. Preview OK. Gerar MP4 OK. Sem NaN/Infinity no console.

---

## v8z4b17r — fix project load segment list normalization

### Teste A — projeto com 2 frames
1. Carregar projeto salvo com 2 frames.
2. Abrir painel Duração/Tempo.
3. Confirmar que Trechos mostra 1 trecho: 1–2.
4. Preview OK.

### Teste B — projeto com 6 frames
1. Carregar projeto salvo com 6 frames.
2. Abrir painel Duração/Tempo.
3. Confirmar que Trechos mostra 5 trechos: 1–2, 2–3, 3–4, 4–5, 5–6.
4. Confirmar que Pausas por frame mostra F1 até F6.
5. Preview OK.

### Teste C — projeto com 6 frames e loop
1. Carregar projeto salvo com 6 frames e loop ligado.
2. Confirmar que Trechos mostra 6 trechos: 1–2, 2–3, 3–4, 4–5, 5–6, 6–1.
3. Confirmar que 6–1 aparece também na faixa de frames.
4. Selecionar 6–1. Confirmar que abre painel real de trecho/easing.
5. Preview OK.

### Teste D — projeto com 30 frames
1. Carregar projeto salvo com 30 frames.
2. Abrir painel Duração/Tempo.
3. Confirmar que Trechos mostra 29 trechos sem loop.
4. Confirmar que Pausas por frame mostra F1 até F30.
5. Confirmar que o painel rola normalmente.
6. Preview OK.

### Teste E — projeto com 30 frames e loop
1. Carregar projeto salvo com 30 frames e loop ligado.
2. Confirmar que Trechos mostra 30 trechos.
3. Confirmar que o último é 30–1 e é selecionável/editável.
4. Preview OK. MP4 OK.

### Teste F — reset continua correto
1. Resetar o app.
2. Confirmar que o estado inicial mostra o número correto de frames padrão.
3. Confirmar que Trechos mostra a quantidade correta.
4. Não quebrar o comportamento que já funcionava após reset.

### Teste G — Velocidade constante após load
1. Carregar projeto com vários frames.
2. Ativar Velocidade constante.
3. Confirmar que todos os trechos visíveis entram na redistribuição.
4. Se loop estiver ligado, confirmar que N→1 entra também.
5. Preview OK.

### Teste H — modos inteligentes após load
1. Carregar projeto com Movimento Inteligente, Rotação Inteligente e Escala Inteligente.
2. Confirmar que os modos aparecem corretos nas abas.
3. Confirmar que Preview respeita os modos.
4. Sem NaN/Infinity.

### Teste I — Pausa final após load
1. Carregar projeto com Pausa final.
2. Confirmar que a pausa está no último frame real.
3. Adicionar frame. Confirmar que a pausa final migra para o novo último frame.
4. Preview OK.

### Teste J — regressão geral
1. Painel Duração/Tempo continua sempre aberto.
2. Loop como trecho real continua funcionando.
3. Pausa final continua seguindo o último frame.
4. Movimento Inteligente, Rotação Inteligente, Escala Inteligente: Preview OK.
5. Gerar MP4 OK. Sem tela preta. Sem botão preso.
6. Sem NaN/Infinity no console.

---

## v8z4b17q — smart rotation and scale easing

### Teste A — estados padrão

1. Abrir projeto novo.
2. Abrir painel de trecho/easing.
3. Confirmar que Movimento Inteligente continua funcionando.
4. Abrir aba Rotação.
5. Confirmar que existe toggle `Rotação Inteligente`.
6. Abrir aba Escala.
7. Confirmar que existe toggle `Escala Inteligente`.
8. Confirmar que não existem botões duplicados Manual/Inteligente.

### Teste B — Rotação Inteligente

1. Criar 3 ou 4 frames.
2. Aplicar rotações diferentes entre frames.
3. Ativar Rotação Inteligente.
4. Confirmar que os cards manuais de Rotação ficam apagados/inativos.
5. Rodar Preview.
6. Confirmar que a rotação ficou mais suave entre trechos, sem tranco.
7. Desligar Rotação Inteligente.
8. Confirmar que os cards voltam a funcionar.
9. Aplicar easing manual de Rotação.
10. Preview OK.

### Teste C — Escala Inteligente

1. Criar 3 ou 4 frames com escalas diferentes.
2. Ativar Escala Inteligente.
3. Confirmar que os cards manuais de Escala ficam apagados/inativos.
4. Rodar Preview.
5. Confirmar que o zoom fica mais suave entre trechos.
6. Desligar Escala Inteligente.
7. Confirmar que os cards voltam a funcionar.
8. Aplicar easing manual de Escala.
9. Preview OK.

### Teste D — canais independentes

1. Deixar Movimento Inteligente ligado.
2. Deixar Rotação Inteligente desligada.
3. Deixar Escala Inteligente ligada.
4. Confirmar que cada canal respeita seu próprio modo.
5. Confirmar que desligar um canal não desliga os outros.

### Teste E — pausas

1. Criar F1, F2, F3.
2. Aplicar rotação e escala diferentes.
3. Colocar pausa em F2.
4. Ativar Rotação Inteligente e Escala Inteligente.
5. Confirmar que a rotação desacelera até F2, para, e sai depois.
6. Confirmar que a escala desacelera até F2, para, e sai depois.
7. Preview OK.

### Teste F — mudança de direção

1. Criar escala com zoom in seguido de zoom out.
2. Ativar Escala Inteligente.
3. Confirmar que não há overshoot exagerado.
4. Criar rotação em um sentido e depois no sentido oposto.
5. Ativar Rotação Inteligente.
6. Confirmar que não há efeito chicote exagerado.

### Teste G — trechos 0.0s

1. Definir um trecho com duração 0.0s.
2. Ativar Rotação Inteligente.
3. Ativar Escala Inteligente.
4. Confirmar que o trecho 0.0s continua corte seco.
5. Confirmar que não há erro, NaN ou Infinity.
6. Preview OK.

### Teste H — loop

1. Criar 4 frames.
2. Ativar Loop.
3. Confirmar que aparece trecho 4–1.
4. Aplicar rotação e escala diferentes entre F4 e F1.
5. Ativar Rotação Inteligente.
6. Ativar Escala Inteligente.
7. Confirmar que o trecho 4–1 participa da suavização.
8. Preview OK.
9. MP4 OK.

### Teste I — Velocidade constante + inteligentes

1. Criar 4 frames com distâncias diferentes, rotações e escalas diferentes.
2. Ativar Velocidade constante.
3. Ativar Movimento Inteligente.
4. Ativar Rotação Inteligente.
5. Ativar Escala Inteligente.
6. Confirmar que os tempos redistribuem corretamente.
7. Confirmar que movimento, rotação e escala ficam suaves.
8. Preview OK.
9. MP4 OK.

### Teste J — JSON

1. Criar projeto com Rotação Inteligente ligada.
2. Criar projeto com Escala Inteligente ligada.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que os modos foram preservados.
6. Carregar JSON antigo sem `rotationEasingMode`/`scaleEasingMode`.
7. Confirmar que abre em `manual` para esses canais.
8. Preview OK.

### Teste K — undo/redo

1. Ligar Rotação Inteligente.
2. Desligar Rotação Inteligente.
3. Usar undo/redo.
4. Confirmar que o estado volta corretamente.
5. Repetir com Escala Inteligente.

### Teste L — regressão geral

1. Painel Duração/Tempo continua sempre aberto.
2. Loop como trecho real continua funcionando.
3. Pausa final continua seguindo o último frame.
4. Velocidade constante continua redistribuindo com loop.
5. Movimento Inteligente continua funcionando.
6. Preview OK.
7. Gerar MP4 OK.
8. Fazer pequena edição.
9. Gerar MP4 novamente OK.
10. Sem tela preta.
11. Sem botão preso.
12. Sem NaN/Infinity no console.

## v8z4b17p — finish timeline sync fixes

### Teste A — adicionar frame com Pausa final ativa

1. Criar F1, F2, F3.
2. Ativar Pausa final com 2.0s.
3. Confirmar que F3 tem pausa 2.0s.
4. Adicionar F4.
5. Confirmar que F3 volta para 0.0s.
6. Confirmar que F4 recebe 2.0s.
7. Confirmar que Pausa final continua ativa.
8. Confirmar que o tempo total não duplicou.

### Teste B — adicionar vários frames com Pausa final ativa

1. Com F4 como último e Pausa final 2.0s, adicionar F5.
2. Confirmar que F4 volta para 0.0s.
3. Confirmar que F5 recebe 2.0s.
4. Confirmar que não há pausas finais acumuladas em frames antigos.

### Teste C — remover último frame com Pausa final ativa

1. Criar F1, F2, F3, F4.
2. Ativar Pausa final com 2.0s em F4.
3. Remover F4.
4. Confirmar que F3 passa a ter pausa 2.0s.
5. Confirmar que Pausa final continua ativa.
6. Confirmar que o tempo total está correto.

### Teste D — pausa intermediária preservada

1. Criar F1, F2, F3.
2. Colocar pausa manual em F2 de 1.0s.
3. Ativar Pausa final em F3 com 2.0s.
4. Adicionar F4.
5. Confirmar que F2 continua com 1.0s.
6. Confirmar que F3 fica 0.0s.
7. Confirmar que F4 recebe 2.0s.

### Teste E — Pausa final desligada (sem transferência automática)

1. Desligar Pausa final.
2. Adicionar frames.
3. Confirmar que o app não move pausas automaticamente.
4. Pausas por frame devem continuar manuais.

### Teste F — Velocidade constante + ligar Loop

1. Criar 4 frames com percursos diferentes.
2. Ativar Velocidade constante.
3. Confirmar que os trechos normais redistribuem.
4. Ligar Loop.
5. Confirmar que aparece trecho 4–1.
6. Confirmar que 4–1 entra redistribuído imediatamente.
7. Confirmar que o tempo total aumenta corretamente.
8. Preview OK.

### Teste G — Velocidade constante + desligar Loop

1. Com Velocidade constante e Loop ligados, desligar Loop.
2. Confirmar que 4–1 sai da conta.
3. Confirmar que os trechos normais redistribuem novamente.
4. Confirmar que o tempo total reduz corretamente.
5. Preview OK.

### Teste H — zerar todas as pausas

1. Ativar Pausa final com valor > 0.
2. Ir ao painel Duração/Tempo.
3. Zerar todas as pausas.
4. Confirmar que Pausa final desliga.
5. Confirmar que framePauses[lastFrameIndex] = 0.
6. Confirmar que Loop volta a ficar disponível.
7. Confirmar que tempo total atualiza.

### Teste I — zerar pausa do último frame

1. Ativar Pausa final com 2.0s.
2. Zerar apenas a pausa do último frame.
3. Confirmar que Pausa final desliga.
4. Confirmar que pausas intermediárias não mudam.
5. Confirmar que o total atualiza.

### Teste J — slider de Pausa final para 0

1. Ativar Pausa final com 2.0s.
2. No controle de Pausa final, arrastar para 0.
3. Confirmar que Pausa final desliga.
4. Confirmar que o último frame fica com pausa 0.
5. Confirmar que Loop volta a ficar disponível.

### Teste K — Loop como trecho real continua OK

1. Ligar Loop.
2. Confirmar que aparece trecho N–1 em Trechos.
3. Confirmar que aparece na faixa/painel de frames.
4. Selecionar N–1.
5. Confirmar que abre painel real de trecho/easing.
6. Editar duração/easing.
7. Preview OK.
8. MP4 OK.

### Teste L — JSON

1. Criar projeto com Pausa final ativa.
2. Adicionar frame e confirmar que a pausa migrou.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que a pausa está no último frame atual.
6. Criar projeto com Loop + Velocidade constante.
7. Salvar e reabrir.
8. Confirmar que Loop e distribuição continuam coerentes.

### Teste M — regressão geral

1. Painel Duração/Tempo continua sempre aberto.
2. Painel de trecho/easing mantém hierarquia da v8z4b17n.
3. Movimento Inteligente continua funcionando.
4. Velocidade constante continua funcionando.
5. Loop como trecho real continua funcionando.
6. Preview OK.
7. Gerar MP4 OK.
8. Fazer pequena edição.
9. Gerar MP4 novamente OK.
10. Sem tela preta.
11. Sem botão preso.
12. Sem NaN/Infinity no console.

## v8z4b17o — loop as closing segment and final pause mirror

### Teste A — loop cria trecho de fechamento

1. Criar projeto com 4 frames.
2. Ativar Loop no Acabamento.
3. Confirmar que aparece trecho `4–1` na lista de Trechos (painel Duração/Tempo).
4. Confirmar que aparece ease pill de loop na faixa de frames após F4.
5. Confirmar que o ease pill é selecionável (abre painel real de trecho/easing com título `Seg. 4–1 · Loop`).
6. Confirmar que o tempo total aumenta pelo valor do trecho 4–1.

### Teste B — editar trecho de loop

1. Selecionar o trecho 4–1 pela faixa ou pela lista de Trechos.
2. Alterar duração no slider.
3. Confirmar que o total atualiza.
4. Alterar easing de Velocidade (ex: Acelerar).
5. Alterar easing de Rotação.
6. Alterar easing de Escala.
7. Rodar Preview — confirmar que o loop usa esses ajustes.

### Teste C — loop desligado

1. Desligar Loop.
2. Confirmar que o trecho 4–1 desaparece da lista de Trechos.
3. Confirmar que o ease pill de loop desaparece da faixa.
4. Confirmar que o total não inclui o tempo de loop.
5. Preview não deve fazer movimento de retorno.

### Teste D — Pausa final sem pausa prévia

1. Garantir que o último frame está com pausa 0.0s.
2. Tocar em Pausa final no Acabamento.
3. Confirmar que o app adiciona pausa de 1.0s ao último frame.
4. Confirmar que o slider de Pausa final mostra 1.0s.
5. Confirmar que a lista de Pausas por frame mostra 1.0s no último frame.
6. Confirmar que Loop fica desligado.

### Teste E — Pausa final com pausa já existente

1. Definir pausa do último frame como 2.0s na lista de Pausas por frame.
2. Ir ao Acabamento e tocar em Pausa final.
3. Confirmar que não soma novo tempo (permanece 2.0s).
4. Confirmar que o slider abre mostrando 2.0s.
5. Alterar para 3.0s.
6. Confirmar que a pausa do último frame na lista também vira 3.0s.
7. Confirmar que não existe tempo paralelo de pausa final.

### Teste F — editar último frame reflete em Pausa final

1. Com Pausa final ativa, editar a pausa do último frame pela lista de Pausas por frame.
2. Confirmar que o slider de Pausa final reflete o novo valor.
3. Confirmar que o total atualiza corretamente.

### Teste G — Loop versus Pausa final

1. Ativar Loop. Confirmar que Pausa final fica desativada (chip não ativo).
2. Desligar Loop. Ativar Pausa final.
3. Confirmar que Loop fica desligado.
4. Confirmar que não existem os dois modos ativos ao mesmo tempo.

### Teste H — Velocidade constante com loop

1. Criar trechos de tamanhos diferentes. Ativar Loop.
2. Ativar Velocidade constante.
3. Confirmar que o trecho N–1 entra na redistribuição proporcional.
4. Confirmar que o tempo total é coerente.
5. Preview OK.

### Teste I — Movimento Inteligente com loop

1. Ativar Movimento Inteligente. Ativar Loop.
2. Confirmar que o trecho N–1 recebe continuidade de velocidade.
3. Colocar pausa no último frame — confirmar que o movimento para antes de sair para o loop.
4. Preview OK.

### Teste J — adicionar/remover frames com loop ativo

1. Criar 4 frames com Loop ligado. Confirmar trecho `4–1`.
2. Adicionar F5. Confirmar que o trecho final vira `5–1`.
3. Remover F5. Confirmar que volta para `4–1`.
4. Preview OK.

### Teste K — JSON

1. Criar projeto com Loop ligado e trecho N–1 ajustado. Salvar JSON.
2. Reabrir JSON. Confirmar que Loop, duração do trecho N–1 e easings foram preservados.
3. Criar projeto com Pausa final ligada. Salvar JSON.
4. Reabrir JSON. Confirmar que Pausa final reflete a pausa do último frame.

### Teste L — regressão geral

1. Painel Duração/Tempo continua sempre aberto.
2. Painel de trecho/easing continua com hierarquia da v8z4b17n.
3. Preview OK. Gerar MP4 OK.
4. Sem tela preta. Sem botão preso. Sem NaN/Infinity no console.

## v8z4b17n — duration movement hierarchy and connected tabs

### Teste A — título do segmento

1. Abrir painel real de trecho/easing (tocar em trecho).
2. Confirmar que `SEG. 2–3` (ou número do segmento) está centralizado horizontalmente.
3. Confirmar que o título parece hierarquia principal do painel.

### Teste B — Duração e Movimento equivalentes

1. Confirmar que `DURAÇÃO` e `MOVIMENTO` usam o mesmo estilo de label de seção (uppercase, mesmo tamanho, mesma cor).
2. Confirmar que o slider de duração está dentro de um bloco com fundo cinza (#3a3a3c), igual ao conteúdo ativo das abas.
3. Confirmar que Duração não parece label solto ao lado do slider.

### Teste C — abas reais

1. Confirmar que Velocidade / Rotação / Escala não parecem pills nem botões isolados.
2. Confirmar que abas inativas têm fundo `#2c2c2e` (recuado, mas visível).
3. Confirmar que aba ativa muda inteira de cor para `#3a3a3c`.
4. Confirmar que a aba ativa se conecta visualmente ao conteúdo abaixo (sem linha divisória perceptível).

### Teste D — continuidade visual

1. Selecionar aba **Velocidade** → confirmar que aba e conteúdo abaixo formam bloco contínuo.
2. Selecionar aba **Rotação** → confirmar a mesma continuidade.
3. Selecionar aba **Escala** → confirmar a mesma continuidade.

### Teste E — Movimento Inteligente

1. Na aba Velocidade, confirmar presença de: Movimento Inteligente [toggle] + Global [ícone].
2. Confirmar ordem: Movimento Inteligente primeiro, Global depois.
3. Ligar Movimento Inteligente: cards Constante/Acelerar/Desacelerar/Suavizar ficam apagados/inativos.
4. Desligar Movimento Inteligente: cards voltam ao normal.

### Teste F — regressão funcional

1. Velocidade constante continua funcionando.
2. Movimento Inteligente continua funcionando.
3. Rotação continua funcionando.
4. Escala continua funcionando.
5. Preview OK.
6. MP4 OK.
7. Painel Duração/Tempo continua sempre aberto.

## v8z4b17m — real channel tabs and velocity naming

### Teste A — nomenclatura

1. Abrir painel de easing (tocar em trecho).
2. Confirmar que "Movimento" aparece como nome de seção (label pequeno, uppercase, acima da barra de abas).
3. Confirmar que as abas são: **Velocidade** / Rotação / Escala (não "Movimento").

### Teste B — aparência das abas

1. Confirmar que a faixa das abas tem cor própria (`#2c2c2e`), visivelmente diferente do fundo do painel (`#1c1c1e`).
2. Confirmar que não parece linha de botões/pills.
3. Confirmar que a aba ativa tem fundo `#3a3a3c` (mais claro que a faixa) e texto branco.
4. Confirmar que aba inativa é discreta (texto acinzentado, sem fundo).
5. Confirmar que há hierarquia visual clara: painel → faixa → aba ativa.

### Teste C — aba Velocidade

1. Abrir aba Velocidade.
2. Confirmar presença de: Movimento Inteligente [toggle] + Global [ícone].
3. Confirmar ordem: Movimento Inteligente → Global.
4. Ligar Movimento Inteligente: cards Constante/Acelerar/Desacelerar/Suavizar ficam apagados/inativos.
5. Desligar Movimento Inteligente: cards voltam ao normal.
6. Preview OK.

### Teste D — aba Rotação

1. Abrir aba Rotação.
2. Confirmar que a navegação funciona (aba ativa muda para Rotação).
3. Confirmar que os cards ficam normais (não subordinados ao Movimento Inteligente).
4. Confirmar presença do Global contextual.
5. Preview OK.

### Teste E — aba Escala

1. Abrir aba Escala.
2. Confirmar que a navegação funciona.
3. Confirmar que os cards ficam normais.
4. Confirmar presença do Global contextual.
5. Preview OK.

### Teste F — regressão

1. Movimento Inteligente continua funcionando.
2. Velocidade constante continua funcionando.
3. Painel Duração/Tempo continua sempre aberto.
4. Preview OK.
5. MP4 OK.

## v8z4b17l — channel tabs and smart movement toggle

### Teste A — abas reais

1. Abrir app.
2. Carregar imagem.
3. Criar frames.
4. Abrir painel de easing.
5. Confirmar que Movimento/Rotação/Escala aparecem como abas em uma barra segmentada (não pills soltos).
6. Confirmar que a aba ativa fica com cor accent e fundo destacado.
7. Confirmar que abas inativas são discretas (texto cinza).

### Teste B — aba Movimento com Inteligente ligado

1. Abrir aba Movimento.
2. Confirmar toggle único "Movimento Inteligente" (switch iOS-style) — não dois botões.
3. Confirmar que vem ligado em projeto novo.
4. Confirmar que o ícone Global aparece após o toggle (não no cabeçalho).
5. Confirmar que o ícone Global aparece em laranja/implícito (travado).
6. Confirmar que Constante/Acelerar/Desacelerar/Suavizar ficam apagados/inativos.
7. Confirmar que "Aplicar aos 3" está oculto.
8. Preview OK.

### Teste C — aba Movimento com Inteligente desligado

1. Desligar toggle Movimento Inteligente.
2. Confirmar que os cards de easing voltam ao estado normal.
3. Confirmar que ícone Global fica clicável/disponível.
4. Ativar Global, aplicar Acelerar — confirmar que afeta todos os trechos de Movimento.
5. Desativar Global, aplicar Suavizar — confirmar que afeta só o trecho atual.
6. Confirmar que "Aplicar aos 3" reapareceu.
7. Preview OK.

### Teste D — aba Rotação

1. Abrir aba Rotação.
2. Confirmar que ícone Global contextual aparece na linha da aba.
3. Confirmar que não aparece toggle Movimento Inteligente.
4. Confirmar que cards de easing estão normais (não subordinados).
5. Aplicar easing local de Rotação.
6. Ativar Global e aplicar easing global de Rotação.
7. Confirmar que Movimento e Escala não são afetados.
8. Preview OK.

### Teste E — aba Escala

1. Abrir aba Escala.
2. Confirmar que ícone Global contextual aparece na linha da aba.
3. Confirmar que não aparece toggle Movimento Inteligente.
4. Confirmar que cards de easing estão normais.
5. Aplicar easing local de Escala.
6. Ativar Global e aplicar easing global de Escala.
7. Confirmar que Movimento e Rotação não são afetados.
8. Preview OK.

### Teste F — Aplicar aos 3

1. Com Inteligente ligado: confirmar que "Aplicar aos 3" está oculto.
2. Com Inteligente desligado: confirmar que "Aplicar aos 3" reapareceu.
3. Confirmar que é ação pontual (não toggle persistente).

### Teste G — JSON/projetos

1. Criar projeto novo → Inteligente ligado por padrão.
2. Salvar JSON e reabrir → Inteligente continua ligado.
3. Carregar JSON antigo sem `movementEasingMode` → abre em Manual.
4. Preview OK em ambos os casos.

### Teste H — regressão geral

1. Velocidade constante funciona.
2. Painel Duração/Tempo continua sempre aberto.
3. Movimento Inteligente funciona (continuidade entre trechos no preview).
4. Rotação e Escala usam easings próprios corretamente.
5. Preview OK.
6. Gerar MP4 OK.
7. Editar projeto → gerar MP4 novamente OK.

## v8z4b17k — clean smart movement panel

### Teste A — novo projeto (Movimento Inteligente como padrão)

1. Abrir o app.
2. Carregar uma imagem.
3. Criar frames.
4. Abrir o painel de easing (botão na barra).
5. Confirmar que o canal **Movimento** está selecionado e **Inteligente** está ativo (destaque accent).
6. Confirmar que os chips Constante/Acelerar/Desacelerar/Suavizar aparecem subordinados (opacidade reduzida).
7. Confirmar que **Aplicar aos 3** está oculto.
8. Preview OK.

### Teste B — linha de modo aparece só para Movimento

1. Com Movimento selecionado, confirmar que a linha "Movimento Inteligente [Manual] [Inteligente]" está visível.
2. Clicar em **Rotação** — confirmar que a linha de modo some.
3. Clicar em **Escala** — confirmar que a linha de modo some.
4. Clicar em **Movimento** — confirmar que a linha de modo reaparece.
5. Repetir no mini-painel contextual de segmento.

### Teste C — Movimento Manual

1. Com canal Movimento selecionado, clicar em **Manual**.
2. Confirmar que os chips voltam à aparência normal (sem subordinação).
3. Confirmar que **Aplicar aos 3** reaparece.
4. Escolher **Suavizar** ou **Acelerar**.
5. Preview OK — easing manual de Movimento funciona.

### Teste D — Rotação e Escala não afetadas pelo modo Inteligente

1. Com Movimento Inteligente ativo, clicar em **Rotação**.
2. Confirmar que os chips de easing ficam normais (sem subordinação).
3. Aplicar Acelerar em Rotação. Preview OK.
4. Clicar em **Escala**.
5. Confirmar que os chips ficam normais.
6. Aplicar Desacelerar em Escala. Preview OK.

### Teste E — "Aplicar aos 3" em modo Manual

1. Com Movimento em Manual, abrir painel de easing.
2. Confirmar que **Aplicar aos 3** está visível.
3. Escolher Suavizar em Movimento.
4. Clicar em Aplicar aos 3.
5. Confirmar feedback visual momentâneo (borda accent, depois volta ao neutro).
6. Confirmar que Rotação e Escala do trecho também ficaram Suavizar.

### Teste F — projeto antigo (sem movementEasingMode)

1. Carregar um JSON antigo sem o campo `movementEasingMode`.
2. Confirmar que abre em **Movimento Manual**.
3. Confirmar que o resultado visual/animação não muda em relação à v8z4b17j.
4. Preview OK.

### Teste G — JSON novo com Inteligente

1. Criar projeto novo (Inteligente ativo por padrão).
2. Salvar JSON.
3. Reabrir JSON.
4. Confirmar que **Movimento Inteligente** continua ativo.
5. Preview OK.

### Teste H — regressão geral

1. Velocidade constante continua funcionando.
2. Painel Duração/Tempo continua sempre aberto (seções não recolhem).
3. Preview OK.
4. Gerar MP4 OK.
5. Fazer pequena edição de frame.
6. Gerar MP4 novamente OK.
7. Undo/Redo: mudar de Inteligente para Manual e voltar — confirmar que undo/redo funciona.

---

## v8z4b17j — smart movement easing experiment

### Teste A — modo padrão

1. Abrir o app.
2. Carregar uma imagem.
3. Criar 3 frames.
4. Abrir o painel contextual de easing de um trecho.
5. Confirmar que `Movimento` está em `Manual` (padrão).
6. Rodar Preview.
7. Confirmar que o resultado é compatível com a v8z4b17i (sem regressão visual).

### Teste B — ativar Inteligente

1. Com 3 frames em distâncias bem diferentes (ex.: F1 pequeno, F2 médio, F3 grande), abrir o painel de easing.
2. Selecionar canal `Movimento`.
3. Clicar em `Inteligente`.
4. Confirmar que os chips `Constante/Acelerar/Desacelerar/Suavizar` ficam subordinados (opacidade reduzida, sem clique).
5. Confirmar que aparece o aviso `Movimento em modo Inteligente…`.
6. Rodar Preview.
7. Confirmar que a passagem pelo frame intermediário fica mais contínua/suave do que em Manual `Constante` (sem tranco súbito).

### Teste C — trecho lento → trecho rápido

1. Criar F1, F2, F3.
2. Definir trecho `1-2` curto/lento e trecho `2-3` longo/rápido (durações ou distâncias bem diferentes).
3. Ativar `Movimento › Inteligente`.
4. Rodar Preview.
5. Confirmar que a aceleração começa **antes** de F2 e continua **depois** de F2 (sem step seco no frame).

### Teste D — pausa no frame

1. Criar F1, F2, F3.
2. No painel Duração/Tempo, colocar uma pausa > 0s em F2.
3. Ativar `Movimento › Inteligente`.
4. Rodar Preview.
5. Confirmar que o movimento **desacelera** até F2, fica parado durante a pausa e **sai do zero** ao continuar.
6. Não pode passar batido pela pausa.

### Teste E — trecho 0.0s (corte seco)

1. Criar F1, F2, F3.
2. No painel Duração/Tempo, colocar o trecho `1-2` em `0.0s`.
3. Ativar `Movimento › Inteligente`.
4. Rodar Preview.
5. Confirmar que o trecho `1-2` continua como corte seco (sem easing).
6. Confirmar console: nenhum `NaN`, `Infinity` ou erro; preview não trava.

### Teste F — Velocidade constante + Inteligente

1. Ativar `Velocidade constante` no painel Duração/Tempo.
2. Confirmar que os tempos foram redistribuídos pelo comprimento curvo.
3. Abrir o painel de easing e ativar `Movimento › Inteligente`.
4. Confirmar que os tempos **não mudam** (Velocidade constante manda no tempo).
5. Rodar Preview.
6. Confirmar que o movimento fica contínuo (com Velocidade constante já entregando trechos com vAvg igual, a Hermite degenera para linear — comportamento esperado).

### Teste G — Rotação e Escala preservadas

1. Criar 3 frames com rotações e escalas distintas.
2. No painel de easing, no canal `Rotação`, escolher `Acelerar`.
3. No canal `Escala`, escolher `Desacelerar`.
4. Voltar ao canal `Movimento` e ativar `Inteligente`.
5. Rodar Preview.
6. Confirmar que a rotação está acelerando e a escala desacelerando — Inteligente afeta **apenas** o movimento.

### Teste H — JSON (salvar/recarregar)

1. Ativar `Movimento › Inteligente`.
2. Salvar projeto como JSON.
3. Abrir o JSON em editor de texto e confirmar a presença do campo `"movementEasingMode": "smart"`.
4. Recarregar o JSON no app.
5. Confirmar que o botão `Inteligente` volta marcado e a UI dos chips subordinados.
6. Preview OK.

### Teste I — projeto antigo (compatibilidade)

1. Carregar um JSON salvo na v8z4b17i (ou anterior), sem o campo `movementEasingMode`.
2. Confirmar que abre com `Manual` (padrão) — comportamento idêntico ao da v8z4b17i.
3. Preview OK.

### Teste J — undo / redo

1. Ativar `Movimento › Inteligente`.
2. Pressionar Desfazer (`Ctrl+Z` / botão de undo).
3. Confirmar que volta para `Manual`.
4. Pressionar Refazer.
5. Confirmar que volta para `Inteligente`.

### Teste K — MP4

1. Com `Movimento › Inteligente` ativo, Preview OK.
2. Gerar MP4.
3. Fazer uma pequena edição (mover um frame).
4. Gerar MP4 novamente.
5. Confirmar: sem tela preta, sem botão preso, sem erro no console.

### Teste L — Versão

1. Abrir Configurações.
2. Confirmar que a versão exibe `v8z4b17j`.
3. Confirmar que o nome exibe `smart movement easing experiment`.

---

## v8z4b17i — duration panel always expanded

### Teste A — Abertura do painel

1. Carregar o app.
2. Carregar uma imagem.
3. Abrir o painel Duração/Tempo.
4. Confirmar que **Trechos** está aberto (sem chevron, sem seta).
5. Confirmar que **Pausas por frame** está aberto (sem chevron, sem seta).
6. Confirmar que **Acabamento** está aberto (sem chevron, sem seta).

### Teste B — Sem recolhimento

1. Tocar nos títulos **Trechos**, **Pausas por frame** e **Acabamento**.
2. Confirmar que nenhuma seção recolhe.
3. Confirmar que não há mudança visual de estado aberto/fechado.
4. Confirmar que não há chevron ou seta visível nos títulos.

### Teste C — Uso normal

1. Alterar duração de um trecho (slider individual).
2. Alterar pausa de um frame.
3. Alterar opção de Acabamento (Nenhum / Loop / Pausa final).
4. Ativar/desativar **Velocidade constante**.
5. Tocar em **Igualar intervalos**.
6. Confirmar que nenhuma seção recolhe sozinha.

### Teste D — Scroll do painel

1. Criar vários frames (5+).
2. Abrir Duração/Tempo.
3. Confirmar que o painel inteiro rola normalmente (scroll principal do painel).
4. Confirmar que **não** voltou scroll interno ruim dentro da lista de pausas.

### Teste E — Regressão geral

1. Preview OK.
2. Gerar MP4 OK (sem tela preta, sem travamento).
3. Velocidade constante continua funcionando.
4. Igualar intervalos continua desligando Velocidade constante.
5. Ajuste individual de trecho continua saindo do modo Velocidade constante.
6. Easing por canal continua funcionando.

### Teste F — Versão

1. Abrir app; ir em Configurações.
2. Confirmar que a versão exibe **v8z4b17i**.
3. Confirmar que o nome exibe **duration panel always expanded**.

---

## v8z4b17h — duration sections stay expanded

### Teste A — Abertura inicial

1. Carregar o app.
2. Carregar uma imagem.
3. Abrir o painel Duração/Tempo.
4. Confirmar que **Trechos** já aparece aberto (chevron ▾).
5. Confirmar que **Pausas por frame** já aparece aberto (chevron ▾).

### Teste B — Reabrir painel

1. Fechar o painel Duração/Tempo.
2. Abrir novamente.
3. Confirmar que **Trechos** e **Pausas por frame** continuam abertos.

### Teste C — Alterar valores não recolhe seções

1. Alterar duração de um trecho (slider individual).
2. Alterar pausa de um frame.
3. Ativar/desativar **Velocidade constante**.
4. Tocar em **Igualar intervalos**.
5. Confirmar que **Trechos** e **Pausas por frame** não recolhem sozinhos.

### Teste D — Scroll do painel

1. Criar vários frames (5+).
2. Abrir Duração/Tempo.
3. Confirmar que o painel inteiro rola normalmente (scroll principal do painel).
4. Confirmar que **não** voltou scroll interno ruim dentro da lista de pausas.

### Teste E — Regressão geral

1. Preview OK.
2. Gerar MP4 OK (sem tela preta, sem travamento).
3. Velocidade constante continua funcionando.
4. Igualar intervalos continua desligando Velocidade constante.
5. Ajuste individual de trecho continua saindo do modo Velocidade constante.
6. Easing por canal continua funcionando.
7. Seção **Acabamento** mantém comportamento anterior (fechada por padrão, abre ao clicar).

### Teste F — Versão

1. Abrir app; ir em Configurações.
2. Confirmar que a versão exibe **v8z4b17h**.
3. Confirmar que o nome exibe **duration sections stay expanded**.

---

## v8z4b17g — constant speed manual override state fix

### Teste A — Igualar intervalos sai do modo Velocidade constante

1. Criar 3+ frames com trechos de comprimentos distintos.
2. Ativar **Velocidade constante** → confirmar redistribuição por percurso.
3. Clicar **Igualar intervalos**.
4. Confirmar que os intervalos ficam iguais.
5. Confirmar que o botão **Velocidade constante** desliga (volta ao estilo neutro).
6. Confirmar que o botão **Manual** fica ativo (accent).
7. Mover um frame → confirmar que os tempos **não** são redistribuídos automaticamente.

### Teste B — Edição individual no ease panel sai do modo Velocidade constante

1. Ativar **Velocidade constante**.
2. Abrir o painel contextual de um trecho (ícone de easing de um segmento).
3. Alterar o slider de duração do trecho.
4. Confirmar que o valor do trecho muda.
5. Confirmar que **Velocidade constante** desliga.
6. Confirmar que **Manual** fica ativo.
7. Mover um frame → confirmar que os tempos ficam congelados.

### Teste C — Tempo total mantém Velocidade constante ativa

1. Ativar **Velocidade constante**.
2. Alterar o slider **Total** da seção Trechos.
3. Confirmar que **Velocidade constante** permanece ativa.
4. Confirmar que os trechos redistribuem proporcionalmente ao percurso curvo.

### Teste D — Loop não é alterado pela redistribuição

1. Ativar loop; definir duração de loop (ex.: 2.0s).
2. Ativar **Velocidade constante**.
3. Confirmar que a duração do loop não é alterada.
4. Confirmar que apenas os trechos normais (F1→F2, F2→F3…) são redistribuídos.
5. Alterar slider Total → loop continua inalterado.

### Teste E — Preview e MP4

1. Preview com Velocidade constante ativa → OK.
2. Gerar MP4 → sem tela preta, sem travamento.
3. Fazer pequena edição; gerar MP4 novamente → OK.

### Teste F — Versão

1. Abrir app; ir em Configurações.
2. Confirmar que a versão exibida é **v8z4b17g**.

---

## v8z4b17f — constant speed timing by curve length

### Teste 1 — Versão
1. Abrir app; ir em Configurações.
2. Confirmar que a versão exibida é **v8z4b17f**.

### Teste 2 — Modo Manual (padrão)
1. Criar 3 frames.
2. Abrir painel Duração → seção Trechos.
3. Confirmar que o botão **Manual** está ativo (accent) e **Velocidade constante** neutro.
4. Alterar sliders individuais de trecho → confirmar que funcionam normalmente.
5. Mover um frame → confirmar que tempos não mudam automaticamente.

### Teste 3 — Ativar Velocidade constante
1. Com 3 frames e trechos de tamanhos distintos, ativar **Velocidade constante**.
2. Confirmar que o botão **Velocidade constante** fica ativo e a dica aparece.
3. Confirmar que os sliders individuais ficam desabilitados (opacidade reduzida).
4. Trecho mais longo deve receber mais tempo; trecho mais curto menos.

### Teste 4 — Curva real vs. distância reta (Teste B da spec)
1. Criar 2 trechos com distância reta parecida.
2. Arrastar o ponto de controle de um trecho para criar uma curva muito grande.
3. Ativar Velocidade constante.
4. Confirmar que o trecho com curva maior recebeu mais tempo.

### Teste 5 — Persistência geométrica (Teste C da spec)
1. Com modo ativo, mover um frame.
2. Confirmar que os tempos são recalculados automaticamente.
3. Arrastar ponto de controle (curva) de um trecho.
4. Confirmar que os tempos são recalculados automaticamente.
5. Inserir ou remover um frame.
6. Confirmar que os tempos são recalculados automaticamente.

### Teste 6 — Desligar modo (Teste D da spec)
1. Com modo ativo e tempos distribuídos, clicar **Manual**.
2. Confirmar que botão Manual fica ativo e sliders individuais voltam habilitados.
3. Mover um frame → confirmar que tempos NÃO mudam automaticamente.
4. Confirmar que os tempos calculados permanecem congelados.

### Teste 7 — Corte seco 0.0s (Teste E da spec)
1. Definir um trecho manualmente em 0.0s.
2. Ativar Velocidade constante.
3. Confirmar que o trecho 0.0s continua 0.0s.
4. Confirmar que o tempo é distribuído entre os demais trechos.

### Teste 8 — Total via slider
1. Modo Velocidade constante ativo.
2. Alterar o slider **Total** da seção Trechos.
3. Confirmar que os tempos individuais são redistribuídos proporcionalmente.

### Teste 9 — Pausas não são afetadas
1. Definir pausas por frame e acabamento.
2. Ativar Velocidade constante.
3. Confirmar que pausas por frame não mudam.
4. Confirmar que acabamento/loop não muda.
5. Confirmar que o resumo de duração total é coerente.

### Teste 10 — Preview e MP4 (Teste F da spec)
1. Ativar Velocidade constante; clicar Preview → deve funcionar.
2. Gerar MP4 → sem tela preta, sem travamento.
3. Fazer edição pequena; gerar MP4 novamente → ok.

### Teste 11 — Persistência JSON
1. Ativar Velocidade constante; salvar JSON.
2. Reabrir JSON → modo e tempos devem ser restaurados.
3. Confirmar que `segmentTimingMode: "constant-speed"` está no JSON.
4. Abrir JSON antigo (sem `segmentTimingMode`) → deve abrir em Manual sem erros.

### Teste 12 — Botão "Aplicar aos 3" não persiste
1. Abrir painel de easing de um trecho.
2. Confirmar que o botão **Aplicar aos 3** aparece com estilo neutro (borda e cor padrão).
3. Clicar **Aplicar aos 3** → botão deve piscar accent brevemente (~700ms) e voltar ao neutro.
4. Confirmar que o botão NÃO fica continuamente destacado.

### Teste 13 — iPhone/Safari
- Todos os testes acima devem passar no iPhone/Safari.
- Sliders de modo devem responder ao toque sem jitter.
- Redistribuição deve ser rápida e sem travamento.

---

## v8z4b17e — apply all channels active state

### Teste A — Estado inicial do botão

1. Carregar imagem; criar 2+ frames.
2. Abrir painel de easing (SEG. 1-2).
3. Confirmar que o botão **Aplicar aos 3** aparece com estilo neutro (borda e texto padrão) quando os canais têm easings diferentes.
4. Se todos os canais já forem iguais (ex.: todos `linear`), confirmar que o botão aparece ativo (borda + texto em accent).

### Teste B — Botão fica ativo após Aplicar aos 3

1. Criar 3 frames. Abrir painel SEG. 1-2.
2. Canal **Movimento** → clicar **Suavizar**.
3. Clicar **Aplicar aos 3**.
4. Confirmar que o botão **Aplicar aos 3** fica imediatamente destacado (borda + texto accent).
5. Alternar para **Rotação** → botão deve continuar ativo.
6. Alternar para **Escala** → botão deve continuar ativo.
7. Voltar para **Movimento** → botão ainda ativo.

### Teste C — Botão perde destaque ao alterar um canal individualmente

1. Após o Teste B, com botão ativo.
2. Canal **Rotação** → clicar **Acelerar** (diferente de Suavizar).
3. Confirmar que o botão **Aplicar aos 3** perde o destaque imediatamente.

### Teste D — Botão volta a ficar ativo ao igualar os canais novamente

1. Após o Teste C, botão inativo.
2. Clicar **Aplicar aos 3** com Acelerar.
3. Confirmar que o botão volta a ficar ativo.

### Teste E — Estado correto ao abrir outro segmento

1. Aplicar **Suavizar aos 3** no SEG. 1-2 (botão ativo).
2. Abrir painel do SEG. 2-3.
3. Confirmar que o estado do botão reflete os canais do SEG. 2-3 (não do anterior).

### Teste F — Salvar e reabrir JSON preserva o estado visual

1. Aplicar **Suavizar aos 3** no SEG. 1-2.
2. Salvar JSON.
3. Recarregar página e importar o JSON.
4. Abrir painel SEG. 1-2.
5. Confirmar que o botão **Aplicar aos 3** aparece ativo.

### Teste G — Preview e export OK

1. Aplicar easing; clicar Preview → deve funcionar normalmente.
2. Gerar MP4 → deve funcionar normalmente.

---

## v8z4b17d — apply easing to all channels

### Teste A — Botão visível no painel real

1. Carregar imagem; criar 2+ frames.
2. Abrir o painel de easing pelo fluxo normal (tocar no segmento ou botão Ease).
3. Confirmar que o título mostra **SEG. X-Y**.
4. Confirmar que os três botões **Movimento / Rotação / Escala** estão visíveis.
5. Confirmar que o botão **Aplicar aos 3** está visível abaixo do seletor de canal.
6. Confirmar que os cards Constante / Acelerar / Desacelerar / Suavizar continuam presentes.

### Teste B — Aplicar Suavizar aos 3 canais

1. Criar 3 frames. Abrir painel do trecho 1-2.
2. Selecionar **Movimento** → clicar **Suavizar**.
3. Clicar **Aplicar aos 3**.
4. Alternar para **Rotação** → card **Suavizar** deve aparecer ativo.
5. Alternar para **Escala** → card **Suavizar** deve aparecer ativo.
6. Alternar para **Movimento** → card **Suavizar** ainda ativo.

### Teste C — Aplicar Acelerar aos 3 canais

1. Sem mudar de segmento, clicar **Acelerar**.
2. Clicar **Aplicar aos 3**.
3. Verificar que os três canais mostram **Acelerar** ativo ao alternar.

### Teste D — Outros segmentos não afetados

1. Aplicar **Suavizar aos 3** no trecho 1-2.
2. Abrir painel do trecho 2-3.
3. Confirmar que Movimento, Rotação e Escala do trecho 2-3 mostram **Constante** (linear).

### Teste E — Modo global continua funcionando

1. Ativar modo global (ícone globo).
2. Selecionar canal **Rotação** → aplicar **Suavizar**.
3. Confirmar que todos os segmentos têm rotEasings = 'ease-in-out'.
4. Desativar global. Clicar **Aplicar aos 3** num trecho.
5. Confirmar que apenas o trecho atual foi alterado.

### Teste F — Save / Load preserva os 3 canais

1. Trecho 1-2: aplicar **Suavizar aos 3** via botão.
2. Trecho 2-3: deixar **Constante**.
3. Salvar JSON. Reabrir.
4. Verificar que trecho 1-2 mostra Suavizar nos três canais.
5. Verificar que trecho 2-3 mostra Constante nos três canais.

### Teste G — Preview e MP4

1. Configurar conforme Teste B.
2. Preview: animação OK, sem travamento.
3. Gerar MP4 → arquivo OK.

### Teste H — Projeto antigo (sem rotEasings/scaleEasings)

1. Abrir JSON antigo sem esses campos.
2. Abrir painel de trecho; verificar que botão **Aplicar aos 3** aparece.
3. Clicar **Aplicar aos 3** → sem erro, três canais recebem o easing ativo.
4. Preview OK; MP4 OK.

---

## v8z4b17c — show channel easing in segment panel

### Teste A — Botões de canal visíveis no painel real

1. Carregar imagem; criar 2+ frames.
2. Abrir o painel de easing pelo fluxo normal (tocar no segmento ou acessar via botão Ease).
3. Confirmar que o título mostra **SEG. X-Y**.
4. Confirmar que os três botões **Movimento / Rotação / Escala** estão visíveis acima dos cards.
5. Confirmar que os cards Constante / Acelerar / Desacelerar / Suavizar continuam presentes.

### Teste B — Canal Rotação via painel real

1. F1 rotação 0°, F2 rotação 180°.
2. Abrir painel de easing do trecho 1-2.
3. Selecionar **Rotação** → aplicar **Suavizar**.
4. Selecionar **Movimento** → verificar que mostra Constante (linear).
5. Selecionar **Escala** → verificar que mostra Constante.
6. Preview: rotação suaviza visivelmente; percurso e zoom sem alteração.
7. MP4 OK.

### Teste C — Canal Escala via painel real

1. F1 escala normal, F2 zoom maior.
2. Abrir painel de easing do trecho 1-2.
3. Selecionar **Escala** → aplicar **Suavizar**.
4. Selecionar **Movimento** → verificar Constante. Selecionar **Rotação** → verificar Constante.
5. Preview: zoom suaviza; percurso e rotação sem alteração.
6. MP4 OK.

### Teste D — Troca de canal reflete easing salvo

1. Segmento 1-2: Movimento = Acelerar, Rotação = Suavizar, Escala = Desacelerar.
2. Ao clicar cada botão de canal, o card ativo deve mudar para o easing correto.
3. Nenhum card errado deve aparecer destacado.

### Teste E — Global mode

1. Ativar modo global (ícone globo). Selecionar canal Rotação → aplicar Suavizar.
2. Confirmar que todos os segmentos têm rotEasings = 'ease-in-out'.
3. Desativar global. Alterar Escala de um único segmento.
4. Confirmar que apenas aquele segmento mudou.

### Teste F — Save / Load

1. Configurar Movimento, Rotação e Escala diferentes por segmento.
2. Salvar JSON. Reabrir.
3. Abrir painel de trecho; trocar canais e verificar valores preservados.

### Teste G — Projeto antigo (sem rotEasings/scaleEasings)

1. Abrir JSON antigo sem esses campos.
2. Abrir painel de trecho; trocar canais → todos mostram Constante (linear).
3. Preview OK; MP4 OK.

### Teste H — segEasePanel (mini-painel) ainda funciona

1. Abrir segEasePanel via caminho anterior (se acessível).
2. Confirmar que Movimento/Rotação/Escala ainda operam corretamente.
3. Trocar canal no segEasePanel → painel real deve refletir ao reabrir.

---

## v8z4b17b — channel easing controls

### Teste A — Movimento separado

1. Carregar imagem; criar 3 frames.
2. Abrir painel de easing no segmento 1-2 → selecionar canal **Movimento** → aplicar "Saída".
3. Canal Rotação e Escala devem continuar Linear.
4. Preview OK; rotação e escala sem alteração de comportamento.
5. Gerar MP4 → arquivo OK.

### Teste B — Rotação separada

1. F1 com rotação 0°, F2 com rotação 90° ou 180°.
2. Canal **Rotação** → aplicar "Entrada/Saída".
3. Canal Movimento = Linear; Escala = Linear.
4. Preview: rotação suaviza; deslocamento espacial e zoom sem alteração.
5. MP4 OK.

### Teste C — Escala separada

1. F1 escala normal; F2 mais aproximado (zoom in).
2. Canal **Escala** → aplicar "Entrada/Saída".
3. Canal Movimento = Linear; Rotação = Linear.
4. Preview: zoom suaviza; percurso espacial e rotação sem alteração.
5. MP4 OK.

### Teste D — Combinação de canais

1. Segmento 1-2: Movimento = Saída; Rotação = Entrada/Saída; Escala = Entrada.
2. Confirmar que o painel reflete o canal correto ao trocar entre Movimento/Rotação/Escala.
3. Preview OK; MP4 OK.

### Teste E — Save/Load JSON com scaleEasings

1. Criar projeto, configurar easing de escala diferente por segmento.
2. Salvar como JSON.
3. Reabrir o JSON.
4. Confirmar que `scaleEasings` e `rotEasings` preservam os valores.
5. Preview OK.

### Teste F — Projeto antigo (sem rotEasings/scaleEasings)

1. Abrir um JSON antigo sem os campos `rotEasings` e `scaleEasings`.
2. Confirmar que o app não lança erro.
3. Confirmar que ambos os arrays são preenchidos com `'linear'`.
4. Preview OK; MP4 OK.

### Teste G — Inserir/remover frame

1. Criar 3 frames; configurar easings de escala e rotação.
2. Inserir frame entre F1 e F2.
3. Confirmar que `scaleEasings.length === frameCount−1`.
4. Remover frame inserido; confirmar alinhamento dos arrays.
5. Preview OK; MP4 OK.

---

## v8z4b17a — rotation easing engine foundation

### Teste A — Projeto básico com rotação

1. Carregar imagem.
2. Criar 3 frames.
3. Aplicar rotações diferentes em F1, F2 e F3 (ex.: 0°, +180°, −90°).
4. Abrir Preview → animação roda sem travamento, NaN ou rotação errada.
5. Gerar MP4 → arquivo gerado sem erro.

### Teste B — Inserir frame entre frames com rotação

1. Criar dois frames com rotações diferentes (ex.: 0° e +360°).
2. Inserir frame entre eles (botão +Frame ou long-press).
3. Confirmar que o app não quebra e `rotEasings` tem tamanho = frameCount−1.
4. Preview OK; MP4 OK.

### Teste C — Remover frame intermediário

1. Criar 4 frames com rotações distintas.
2. Remover um frame intermediário.
3. Confirmar que `rotEasings.length === frameCount−1` (verificar via console se necessário).
4. Preview OK; MP4 OK.

### Teste D — Save/Load JSON com rotEasings

1. Criar projeto com rotações e salvar como JSON.
2. Reabrir o JSON.
3. Confirmar que frames, rotações e `rotEasings` estão presentes e válidos.
4. Preview OK.

### Teste E — Compatibilidade com projeto antigo (sem rotEasings)

1. Abrir um JSON antigo que não contém o campo `rotEasings`.
2. Confirmar que o app não lança erro e preenche `rotEasings` com `'linear'`.
3. Preview OK; MP4 OK.

### Teste F — Versão visível

1. Topbar → Configurações → confirmar `Arco v8z4b17a`.
2. Em `CHANGELOG.md`, primeira entrada é v8z4b17a.
3. Em `pages-deploy-stamp.txt`, stamp é v8z4b17a.
4. Buscar no `index.html` por "Versão:" — apenas v8z4b17a no cabeçalho.

### Teste G — Regressão geral

1. Posição, escala, curvas e easing de movimento continuam funcionando.
2. Não há NaN, undefined ou travamento no console.
3. Undo/redo funciona normalmente (rotEasings é preservado no undo).

## v8z4b16m — gap final slider/botões nos submenus de transformação (iPhone/Safari obrigatório)

### A. Respiro entre slider e botões

1. Carregar imagem; criar 3 frames.
2. Tocar num frame → abrir submenu **Escala**.
3. Confirmar: há respiro claro e visível entre a linha do slider e a
   linha de botões (−5% / +5% / Reset). A bolinha do slider **não
   encosta nem cavalga** nos botões.
4. Repetir para **Rotação** e **Pausa**.
5. Tocar no Voltar → recolhe para compact-mode. Repetir a abertura
   para confirmar que o gap persiste.

### B. Faixa de frames continua fixa

1. Abrir Escala → confirmar que a faixa de frames **não se move**.
2. Abrir Rotação → idem.
3. Abrir Pausa → idem.
4. Em nenhum estado a faixa de frames deve subir ou descer.

### C. Nenhum controle invade a Home Bar

1. Com submenu aberto, confirmar que a linha de botões (−5/+5/Reset)
   fica acima do indicador de Home com folga visível.
2. Confirmar que nada toca ou atravessa o Home Bar.

### D. Preview e Gerar MP4 (não podem ter regredido)

1. Carregar imagem; criar 3 frames; tocar **Preview** → roda normal.
2. Tocar **Voltar** no Preview → volta ao Stage sem tela preta.
3. Tocar **Salvar MP4** → arquivo gerado normalmente.
4. Aplicar pequena edição → tocar **Salvar MP4** de novo → segundo
   arquivo gerado sem botão preso.

### E. Versão visível

1. Topbar → Configurações → confirmar `Arco v8z4b16m`.
2. Em `CHANGELOG.md`, primeira entrada é v8z4b16m.
3. Em `pages-deploy-stamp.txt`, stamp é v8z4b16m.
4. Buscar no `index.html` por "Versão:" — apenas v8z4b16m no cabeçalho.

## v8z4b16j — Faixa de frames fixa, sliders inteiros, escala livre (iPhone/Safari obrigatório)

### A. Faixa de frames fixa em todos os estados

1. Carregar imagem; criar 3 frames.
2. Tocar num frame → menu contextual abre em compact-mode.
3. Tocar em **Pausa** → submenu expande. Confirmar: a faixa de frames
   NÃO sobe nem desce, permanece exatamente no mesmo lugar.
4. Tocar no Voltar (coluna estreita) → recolhe. Faixa de frames continua
   no mesmo lugar.
5. Repetir para **Rotação**, **Escala** e **Posição**.
6. Confirmar: em nenhum estado a faixa de frames se move.

### B. Sliders dos submenus de transformação com thumb inteiro

1. Abrir o submenu **Escala** → confirmar que a bolinha/thumb do slider
   aparece INTEIRA acima do track, sem corte superior pelo limite da
   faixa de frames.
2. Abrir o submenu **Rotação** → mesmo teste, thumb inteiro visível.
3. Abrir o submenu **Pausa** → mesmo teste, thumb inteiro visível.
4. Abrir o submenu **Posição** → confirmar que as colunas X e Y (input
   + setas) não estão cortadas e ficam visualmente acima da Home Bar.

### C. Escala livre além da imagem

1. Abrir o submenu **Escala**.
2. Arrastar o slider até o máximo (300%) → o frame deve aumentar além
   dos limites visuais da imagem/stage, SEM travar em ~98% do stage.
3. Tocar **+5%** repetidamente → frame continua crescendo livremente.
4. Tocar **−5%** → frame diminui normalmente, sem ficar abaixo do
   mínimo prático (40px).
5. Tocar **Reset** → frame volta à largura de referência (baseFrameW).
6. Em `Configurações → Conter na imagem: Sim`, repetir o teste — agora
   o frame respeita os limites (comportamento intencional, igual antes).

### D. Espaçamento entre ícone e nome no menu contextual

1. Tocar num frame para abrir o menu contextual em compact-mode.
2. Observar Pausa, Rotação, Escala, Posição.
3. Confirmar: o espaço vertical entre o ícone e o texto está
   claramente maior (mais respirado) que na v8z4b16i.
4. Confirmar: nenhum ícone, texto ou cor mudou — só o gap.

### E. Bloco inferior mais baixo

1. Observar a toolbar inferior em estado normal (sem submenu aberto).
2. Confirmar: ícones/textos descem alguns pixels em relação à v8z4b16i,
   ficando mais próximos da Home Bar.
3. Confirmar: NENHUM elemento toca/atravessa o indicador da Home Bar
   nem reintroduziu degradê/fade/sombra falsa de rodapé.
4. Abrir Pausa/Rotação/Escala/Posição — slider/chips também descem
   levemente, mantendo folga segura acima da Home Bar.

### F. Segurança Preview / MP4 (não pode ter regredido)

1. Carregar imagem; criar 3 frames; tocar **Preview** → roda normal.
2. Tocar **Voltar** no Preview → volta ao Stage sem tela preta.
3. Tocar **Salvar MP4** (Gerar) → arquivo gerado normalmente.
4. Aplicar pequena edição (rotação ou pausa) → tocar **Salvar MP4** de
   novo → segundo arquivo gerado sem botão preso.

### G. Botão Voltar (NÃO alterado)

1. Confirmar: o trilho lateral do `#custBarBack` continua com 44px de
   largura, ícone 26×26 e stroke 2.6 — IGUAL à v8z4b16i.
2. Confirmar: o `Voltar` do `alignBar` e o `Voltar` do Preview também
   permanecem inalterados.

### H. Versão visível

1. Topbar → Configurações → confirmar `Arco v8z4b16j`.
2. Em `CHANGELOG.md`, primeira entrada cronológica é v8z4b16j;
   v8z4b16i permanece como histórico.
3. Em `pages-deploy-stamp.txt`, stamp deve ser `v8z4b16j`.
4. Buscar no `index.html` por "Versão:" — apenas v8z4b16j aparece como
   versão atual no cabeçalho/comentário superior.

## v8z4b16g — UX state cleanup + Voltar padronizado (iPhone/Safari obrigatório)

### A. Estado visual do menu de frames (bug do destaque preso)

1. Carregar imagem.
2. Tocar num frame → menu contextual abre em `compact-mode` (apenas
   barra de ícones).
3. Confirmar: **nenhum ícone aparece aceso/destacado** logo na primeira
   abertura (antes, Escala aparecia destacado).
4. Tocar em **Rotação** → submenu expande; o ícone Rotação agora acende
   em ciano (estado legítimo de submenu aberto).
5. Tocar no botão **Voltar** (coluna estreita à esquerda do submenu) →
   recolhe para `compact-mode`.
6. Confirmar: **nenhum ícone fica aceso após o Voltar**.
7. Tocar fora do menu (em qualquer área vazia do stage) → menu inteiro
   fecha.
8. Reabrir o menu (tocar num frame) → confirmar: nenhum ícone fica aceso
   apenas por ter sido o último usado. **(bug do v8z4b16f corrigido)**
9. Repetir com **Pausa**, **Escala** e **Posição**.

### B. Botão Voltar como coluna lateral

1. Abrir submenu de Rotação.
2. Confirmar layout: chevron estreito à esquerda + slider + chip de
   reset à direita, todos na mesma linha visual.
3. Confirmar: o submenu NÃO tem mais o header horizontal acima do
   slider; recuperou ~22px de altura útil.
4. Tocar no chevron → recolhe para `compact-mode` (mesmo comportamento
   de antes).
5. Repetir em Pausa, Escala, Posição.

### C. Preview com Voltar (não mais X)

1. Carregar imagem; criar 3 frames.
2. Tocar **Preview** (play da toolbar).
3. Confirmar no rodapé do Preview: o botão da esquerda agora é
   `Voltar` + chevron para a esquerda (não mais `Fechar` + X).
4. Tocar no Voltar → Preview fecha e volta ao Stage. Mesmo
   comportamento de antes.
5. Confirmar Play/Pause central e botão Salvar MP4 inalterados.

### D. Regressões (NÃO podem ter quebrado)

1. Abrir/fechar Preview com rotação aplicada → roda normal.
2. Salvar MP4 → arquivo gerado, sem tela preta, sem botão vermelho
   preso.
3. Painéis flutuantes (Template, Formato, Duração, Easing, Suavidade,
   Cor de fundo): seguem abrindo/fechando pelo handle do topo, sem
   mudança de layout.
4. Reset (botão circular no topbar) continua resetando tudo.
5. Seleção múltipla / AlignBar: Voltar primário e submenu Alinhar
   intactos.

### E. Versão visível

1. Topbar → Configurações → confirmar `Arco v8z4b16g`.
2. Em `CHANGELOG.md`, a primeira entrada cronológica deve ser
   v8z4b16g; v8z4b16f continua presente como histórico.
3. Em `pages-deploy-stamp.txt`, stamp deve ser `v8z4b16g`.
4. Buscar no `index.html` por "atual" — nenhuma referência a v8z3q,
   v8z3v, v8z4b16e ou v8z4b16f deve aparecer marcada como versão
   atual.

## v8z4b16f — Rodapé sólido, submenu compacto, faixa ciano sincronizada (iPhone/Safari obrigatório)

### A. Rodapé sem degradê

1. Carregar imagem.
2. Observar a barra inferior em estado normal (toolbar, sem painel aberto).
3. Confirmar: nenhum degradê / fade escuro subindo do rodapé.
4. Confirmar: o fundo da barra é sólido até a base da tela.
5. Confirmar: botões da toolbar continuam visíveis e seguros acima da
   Home Bar (clearance ≥ ~14px sobre o indicador).
6. Abrir e fechar o painel **Duração** uma vez; observar a transição —
   ao fechar, NÃO sobra halo / sombra residual no rodapé.

### B. Submenus contextuais compactos

1. Tocar em um frame para abrir o menu contextual (compact-mode com
   ícones).
2. Tocar em **Pausa**:
   - Submenu abre compacto (~110px sobre a safe-area).
   - Chevron de voltar à esquerda no topo, em faixa estreita (~22px de
     altura).
   - Slider e chip Reset abaixo, sem espaço morto vertical exagerado.
3. Tocar no chevron de voltar → volta ao compact-mode (ícones), sem
   fechar o menu inteiro.
4. Tocar em **Rotação** → mesmo padrão compacto.
5. Tocar em **Escala** → mesmo padrão.
6. Tocar em **Posição** → header compacto + dois pares de inputs X/Y.
7. Tocar fora do menu (no stage) → fecha completamente. Sem tranco no
   stage em nenhuma das transições acima.

### C. Faixa ciano dos sliders

1. Tocar em um frame; abrir o painel contextual de Trecho (Seg. X-Y) via
   pill de easing.
2. Mover o slider de duração para **0.0s**.
3. Confirmar:
   - Bolinha do slider está no início (esquerda).
   - Faixa ciano também está no início — não fica preenchida até o meio.
4. Mudar o valor para 2.0s, depois 4.0s, depois 8.0s.
5. Confirmar que a faixa ciano acompanha a bolinha em cada valor.
6. Abrir **Duração** (painel principal); olhar slider **TOTAL** de Trechos
   e os individuais de "Tempo por trecho" — faixas devem refletir os
   valores atuais (não stale).
7. Voltar ao menu contextual, abrir **Pausa**, mexer no slider de pausa.
   Faixa ciano acompanha a bolinha.

### D. Regressão MP4 (NÃO pode ter quebrado)

1. Carregar imagem; criar 3 frames com easings variados.
2. Tocar **Preview** — confirma que roda.
3. Tocar **Salvar MP4** — confirmar arquivo gerado, sem tela preta, sem
   botão vermelho preso.
4. Voltar à edição; mover um frame.
5. Tocar **Salvar MP4** de novo — segunda geração também funciona.

### E. Regressão visual

1. Versão visível em Configurações deve mostrar `v8z4b16f`.
2. Hierarquia tipográfica do painel Duração (Trechos / Pausas /
   Acabamento) inalterada.
3. Seleção múltipla / AlignBar inalterada.
4. Tempo mínimo 0.0s segue aceito em trechos e pausas.

## v8z4b16d — Recuperação do Gerar MP4 (iPhone/Safari obrigatório)

### A. Teste básico

1. Carregar imagem.
2. Criar 3 frames.
3. Tocar Preview e confirmar que roda.
4. Tocar **Salvar MP4**.
5. Confirmar que o MP4 é gerado (overlay "Vídeo pronto!" aparece).
6. Confirmar que a tela **não fica preta** durante geração — overlay
   com spinner e progress está visível, animação volta após salvar.
7. Confirmar que o botão **para de piscar vermelho** ao concluir.

### B. Teste com tempos

1. Alterar duração de um trecho.
2. Inserir um trecho com 0.0s.
3. Inserir pausas em alguns frames.
4. Gerar MP4 — arquivo válido, sem loop infinito, sem travamento.

### C. Teste após edição prolongada

1. Mover frames, escalar, rotacionar.
2. Abrir e fechar menu contextual.
3. Abrir painel Duração e fechar.
4. Gerar MP4 — sem tela preta após qualquer um desses passos.

### D. Teste de recuperação de erro (forçado)

1. Em DevTools, simular falha do encoder (ex.: throw em
   `VideoEncoder.isConfigSupported` ou cortar `imgEl.src`).
2. Tocar Salvar MP4.
3. Confirmar que:
   - app **sai** do estado de gravação automaticamente;
   - `previewScreen` fecha — sem overlay preto persistente;
   - botão volta a "Salvar MP4" sem classe `recording`;
   - `showStatus` exibe mensagem clara;
   - `console.error`/`console.warn` registra o erro com contexto;
   - usuário pode tocar Salvar MP4 de novo (não fica preso em
     `isRecording=true`).

### E. Teste de pré-condição

1. Antes da imagem carregar, tocar Salvar MP4 → status "Imagem ainda
   não carregada", **sem** entrar em recording, **sem** previewScreen.
2. Com duração total 0 (zerando todos os trechos) tocar Salvar MP4 →
   status "Duração total inválida", sem entrar em recording.

### Não regressões

- Menu contextual sem tranco no stage.
- Fechar menu contextual tocando no stage.
- Apenas Pausa / Rotação / Escala / Posição no menu contextual.
- Hierarquia visual do painel Duração/Tempo.
- Nomenclatura Trechos.
- Seleção múltipla / AlignBar.
- Tempo mínimo 0.0s.
- Scroll do painel Duração/Tempo.
- Handle fixo do painel.
- Motor de animação, easing, JSON, templates.

## Teste mínimo obrigatório

1. Abrir o app.
2. Carregar imagem.
3. Aplicar Template Circular.
4. Editar curva manualmente.
5. Confirmar que a curva não reseta.
6. Rodar Preview.
7. Gerar MP4.
8. Confirmar que o MP4 não tem trancos/kicks.
9. Alterar escala de um frame.
10. Alterar rotação de um frame.
11. Alterar easing.
12. Inserir pausa em frame.
13. Gerar MP4 novamente.
14. Testar no iPhone/Safari.

## Teste específico — Escala global

1. Carregar imagem.
2. Aplicar Template Circular.
3. Editar a curva manualmente.
4. Abrir ajuste de escala.
5. Ativar Global.
6. Alterar escala.
7. Confirmar que as curvas continuam no lugar.
8. Rodar Preview.
9. Gerar MP4.

## Teste específico — Fixar

1. Selecionar um frame.
2. Ativar Fixar.
3. Confirmar destaque vermelho.
4. Desativar Fixar.
5. Confirmar volta ao estado visual normal.

## v8z3w — Export stability diagnostics

- **Ambiente:** GitHub Pages com cache busting, iPhone/Safari.
- **Objetivo do teste:** verificar se o bug intermitente do MP4 sem imagem ainda ocorre.
- **Procedimento:** carregar imagem, editar frames, alterar escala, posição, rotação, easing/transição, alternar fundo preto/branco e gerar múltiplos MP4s.
- **Resultado:** nenhum MP4 saiu apenas com a cor de fundo.
- **Decisão de QA:** manter v8z3w como checkpoint provisório de estabilidade.
- **Plano de contingência:** v8z3x somente se o bug reaparecer.

## v8z4a — 30-frame capacity sprint

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4a — 30-frame capacity sprint**.
3. Carregar imagem.
4. Criar frames até chegar a 30.
5. Selecionar F1, frames intermediários e F30.
6. Mover/editar frames.
7. Remover alguns frames.
8. Adicionar novamente até validar estabilidade.
9. Rodar Preview.
10. Exportar MP4.
11. Salvar JSON.
12. Reabrir JSON.
13. Confirmar que projetos antigos com 2 a 8 frames continuam funcionando.
14. Testar no iPhone/Safari com GitHub Pages e cache busting.

## v8z4b — Insert frame on existing curve

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b — Insert frame on existing curve**.
3. Carregar imagem.
4. Criar dois frames: F1 e F2.
5. Editar manualmente a curva entre F1 e F2.
6. Com F1 ativo, adicionar novo frame.
7. Confirmar que o novo F2 nasce dentro da curva.
8. Confirmar que o antigo F2 vira F3.
9. Confirmar que a curva não virou reta.
10. Confirmar que a curva visual foi preservada em dois trechos.
11. Mover o novo frame e confirmar que a edição continua funcionando.
12. Fazer undo e redo da inserção.
13. Rodar preview.
14. Exportar MP4.
15. Salvar JSON.
16. Reabrir JSON e confirmar que a curva permanece correta.
17. Repetir o teste com mais frames.
18. Repetir até perto do limite de 30 frames.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b1 — Preserve split curve after frame edit

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b1 — Preserve split curve after frame edit**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Editar a curva entre F1 e F2, deixando ela bem visível.
6. Inserir novo frame entre F1 e F2.
7. Confirmar que o novo F2 nasce sobre a curva.
8. Mover o novo F2.
9. Confirmar que a curva não vira reta.
10. Confirmar que os segmentos F1→F2 e F2→F3 continuam curvos.
11. Mover F1 e confirmar que a curva não reseta indevidamente.
12. Mover F3 e confirmar que a curva não reseta indevidamente.
13. Fazer undo/redo.
14. Rodar preview.
15. Exportar MP4.
16. Salvar JSON.
17. Reabrir JSON e confirmar que a curva continua correta.
18. Repetir com mais de 3 frames.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b2 — Restore curve/easing separation

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b2 — Restore curve/easing separation**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Definir easing/transição como Constante.
6. Mover a bolinha da curva para criar uma curva exagerada.
7. Confirmar que a velocidade temporal continua constante.
8. Trocar easing para Acelerar.
9. Mover a bolinha da curva.
10. Confirmar que o easing continua Acelerar, sem ser substituído pela curva.
11. Trocar easing para Desacelerar.
12. Mover a bolinha da curva.
13. Confirmar que o easing continua Desacelerar.
14. Trocar easing para Suavizar.
15. Mover a bolinha da curva.
16. Confirmar que o easing continua Suavizar.
17. Inserir frame dentro da curva.
18. Confirmar que o novo frame nasce na curva.
19. Mover o frame inserido.
20. Confirmar que a curva não vira reta.
21. Rodar preview.
22. Exportar MP4.
23. Salvar JSON.
24. Reabrir JSON.
25. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b16c — Stage stability, bottom slot and visual hierarchy

Foco: validar correções da revisão da v8z4b16b — tranco do stage,
fechamento do menu contextual em qualquer área do stage, degradê
inferior, hierarquia tipográfica do painel Duração, nomenclatura
"Trechos" e redesign visual da caixa de seleção múltipla. Itens já
validados na v8z4b16b (sincronização, handle sticky, tempo 0.0s,
preview/export, sliders subordinados) NÃO devem ter regredido.

### Versão

1. Abrir o app no iPhone/Safari (GitHub Pages com cache busting).
2. Abrir o menu de configurações (engrenagem).
3. Confirmar: **Arco v8z4b16c — Stage stability, bottom slot and
   visual hierarchy**.

### Estabilidade do stage ao abrir o menu contextual

4. Carregar uma imagem com pelo menos 2 frames.
5. Observar a posição vertical da imagem/stage com a toolbar
   inferior visível.
6. Tocar em F1 (ou no frame ativo) para abrir o menu contextual em
   modo compacto.
7. Confirmar que a imagem/stage **não dá nenhum salto vertical** ao
   abrir o menu. A faixa de frames também não se move.
8. Fechar o menu (tocando no stage). Confirmar que ao voltar para a
   toolbar normal o stage permanece imóvel.
9. Abrir/fechar o menu várias vezes em sequência. Confirmar zero
   reflow perceptível.

### Fechar menu contextual em qualquer área vazia do stage

10. Com menu contextual aberto, tocar **na imagem** dentro do stage:
    deve fechar.
11. Reabrir o menu. Tocar no **fundo preto** da área de edição
    (.image-area) fora da imagem: deve fechar.
12. Reabrir o menu. Tocar na **área vazia do canvas** (sobre o stage
    mas sem imagem): deve fechar.
13. Reabrir o menu. Tocar nos **botões/ícones do menu** (Pausa,
    Rotação, Escala, Posição): **não** deve fechar.
14. Tocar nos **sliders** do menu expandido: **não** deve fechar.
15. Tocar nos **handles** do frame ativo ou nas bolinhas de Bézier:
    **não** deve fechar.
16. Tocar na **faixa de frames** (#midBar): **não** deve fechar.

### Itens do menu contextual

17. Confirmar que os ícones presentes são, e somente:
    - Pausa
    - Rotação
    - Escala
    - Posição
18. Confirmar ausência de Curvas, Adicionar, easing e funções extras.

### Barra inferior — degradê e safe area

19. Observar a barra inferior (toolbar e menu contextual).
20. Confirmar que **não existe degradê escuro** acima da barra
    invadindo o stage.
21. Confirmar que o fundo da barra é **sólido e contínuo até o fim
    da tela** (até a Home Bar do iPhone).
22. Confirmar que não há faixa morta/vazia abaixo dos botões/textos.
23. Confirmar que os botões continuam **acima da Home Bar** com
    folga mínima de toque.

### Barra inferior — compactação visual

24. Confirmar que botões e textos da toolbar começam **mais baixos**
    do que antes (sobra superior reduzida).
25. Confirmar que o menu contextual em modo compacto repete o mesmo
    padrão visual (ícones e labels alinhados ao fim).
26. Confirmar que a altura total da barra **não aumentou**.

### Painel Duração — hierarquia tipográfica

27. Abrir painel Duração.
28. Confirmar que os três títulos principais — **Trechos**, **Pausas
    por frame**, **Acabamento** — aparecem com mesmo corpo, peso e
    cor (17px, bold, branco/cor principal). Visualmente equivalentes.
29. Confirmar que os subtítulos internos (**INTERVALO PADRÃO**,
    **TOTAL**, **TEMPO POR TRECHO**, **PAUSA POR FRAME**, **TUDO**,
    **RETORNO**, **DURAÇÃO**) aparecem menores, em uppercase, com
    letter-spacing discreto e cor cinza. Subordinados aos títulos.

### Nomenclatura

30. Confirmar que no painel Duração não aparece mais "Segmentos".
31. Confirmar que aparece **Trechos** como cabeçalho da seção.
32. Confirmar que aparece **Tempo por trecho** como subtítulo dos
    sliders individuais.
33. Confirmar que o resumo do topo mostra **Tempo dos trechos** em
    vez de "Segmentos".

### Caixa de seleção múltipla / alinhamento

34. Selecionar 2 ou mais frames (toque longo).
35. Confirmar que a caixa contextual aparece **por cima** sem
    empurrar o stage.
36. Confirmar layout primário: contador (número) · **Alinhar** ·
    **Distribuir** · **Escala**.
37. Confirmar que o visual usa o mesmo padrão do menu contextual de
    frames (fundo sólido, mesmo slot inferior, ícones centralizados
    acima de labels curtos, espaçamento limpo, sem amontoamento).
38. Tocar em **Alinhar**. Confirmar que abre o submenu com 6 alvos
    (Esq · Centro H · Dir · Topo · Centro V · Base) + botão Voltar.
39. Confirmar que **Centro H** e **Centro V** funcionam (frames
    alinhados horizontal/verticalmente como antes).
40. Confirmar que **Esq, Dir, Topo, Base** aparecem desabilitados
    visualmente (sem criar lógica nova nesta versão).
41. Tocar em Voltar no submenu. Confirmar que volta à camada primária.
42. Tocar no botão "Voltar" (chevron à esquerda) na camada primária.
43. Confirmar que limpa a seleção múltipla e fecha a caixa.

### Já validado na v8z4b16b — não pode ter regredido

44. Sliders individuais subordinados ao global continuam **totalmente
    cinzas** (track + thumb).
45. Handle superior do painel Duração continua **fixo** ao rolar.
46. Tempo mínimo de trecho funciona em **0.0s**.
47. Sincronização painel Duração ↔ menu contextual continua válida.
48. Scroll do painel Duração sem scroll interno indevido.
49. Preview MP4 estável.
50. Export MP4 estável.

### Não pode ter regredido (geral)

51. Lógica de tempo global, cálculo de tempo total, easing, curvas,
    escala, rotação, posição: inalterados.
52. Templates, cores, layout geral aprovado, ícones fora do escopo:
    inalterados.

### Critério de aceite

A v8z4b16c deve fechar todos os pontos da revisão da v8z4b16b sem
mexer no que já estava OK. Após teste manual completo, fica pronta
para promoção ao app principal.

## v8z4b16b — Stabilize contextual menu and zero-second segments

Foco: validar correções pontuais sobre a v8z4b16a — menu contextual
sem Curvas/Adicionar e com altura idêntica à toolbar, thumbs cinzas
quando o global está ativo, handle do painel Tempo fixo ao rolar, e
suporte a trecho/intervalo de 0.0s sem quebrar preview/export.

### Versão

1. Abrir o app.
2. Abrir o menu de configurações (engrenagem).
3. Confirmar: **Arco v8z4b16b — Stabilize contextual menu and
   zero-second segments**.

### Menu contextual — altura idêntica à toolbar

4. Sem tocar em nenhum frame, observar a altura do menu inferior
   principal (toolbar).
5. Tocar num frame para abrir o menu contextual em modo compacto.
6. Confirmar que o topo da faixa contextual fica **na mesma posição**
   do topo da toolbar — o stage não se mexe, encolhe ou desloca.
7. Confirmar que a faixa de frames continua visível acima do menu
   contextual.

### Menu contextual — itens e ações rápidas

8. Confirmar que os ícones presentes são, e somente:
   - Pausa
   - Rotação
   - Escala
   - Posição
9. Confirmar que **não existe** o ícone Curvas.
10. Confirmar que **não existe** o ícone Adicionar.
11. Tocar fora do menu contextual (no stage). Confirmar que ele fecha
    e a toolbar inferior volta ao normal.
12. Tocar de novo no mesmo frame. Confirmar que o menu contextual
    reabre.
13. Tocar em outro frame. Confirmar que o app não fica preso no
    submenu do frame anterior (a aba/conteúdo expandido fecha, ou ao
    menos passa a refletir o novo frame).

### Submenu local de pausa / ajustes do frame

14. Abrir submenu Pausa local. Confirmar que mostra slider + valor +
    Reset, sem texto "Frame F10 / Duração pausa neste frame".
15. Confirmar que pausa local, rotação, escala e posição continuam
    funcionando.
16. Confirmar sincronização com painel Duração ao alterar a pausa.

### Sliders — estado global "Tudo"

17. Abrir painel Duração → Pausas por frame.
18. Mover o slider **Tudo** para um valor diferente de zero.
19. Confirmar que **todas** as faixas individuais ficaram cinzas,
    incluindo o **thumb/bolinha** (não brancos).
20. Mover um slider individual. Confirmar que ele "reativa"
    visualmente (cyan/normal) e os demais voltam para o estado
    cinza/subordinado correto conforme a sincronização real.
21. Confirmar que o painel local (menu contextual → Pausa) e o
    painel Duração continuam sincronizados após qualquer mudança.

### Handle superior do painel

22. Abrir painel Duração.
23. Rolar verticalmente até o final.
24. Confirmar que o tracinho/handle no topo permanece **fixo** no
    topo do painel ao rolar, sem deslocar e sem desaparecer.
25. Confirmar que não há um segundo scroll interno; a única rolagem
    vertical é a do painel principal.

### Trecho / intervalo mínimo 0.0s

26. Painel Duração → Segmentos.
27. Mover o slider de "Total" todo para a esquerda. Confirmar que
    chega em **0.0s** sem barrar em 1s/0.5s/0.1s.
28. Confirmar que todos os sliders individuais de segmento foram
    para **0.0s** e os rótulos mostram corretamente "0.0s".
29. Subir o "Total" novamente. Confirmar que os trechos são
    redistribuídos igualmente (não houve proporção anterior válida).
30. Mover apenas o segmento 1-2 para **0.0s**, deixando os demais
    com valor positivo. Rodar Preview. Confirmar que entre F1 e F2 há
    corte seco (pulo instantâneo) e os demais segmentos continuam
    com movimento.
31. Inverter: 1-2 em 2.0s, 2-3 em 0.0s. Preview deve mostrar
    movimento no primeiro trecho e corte seco no segundo.
32. Colocar vários trechos 0.0s seguidos. Confirmar que o preview não
    trava nem pisca de forma anômala.
33. Todos os trechos em 0.0s **com pausas por frame** ativas. Preview
    deve rodar normalmente, somente pausando nos frames.
34. Todos os trechos em 0.0s **sem pausas** e sem acabamento. Preview
    deve permanecer em estado estático seguro, sem travar nem dar NaN.
35. Definir "Intervalo padrão" como **0** e adicionar um novo frame.
    Confirmar que o frame nasce com tempo padrão 0 sem erro.
36. Em Sliders → Acabamento, confirmar que Retorno (loop) e Duração
    (pausa final) **ainda têm mínimo 0.1s** (clamp não foi tocado).
37. Exportar MP4 com pelo menos um trecho 0.0s. Confirmar que o
    export conclui sem travar e o arquivo é reproduzível.
38. Exportar MP4 com **todos** os trechos em 0.0s e sem pausas/loop.
    Confirmar que o export gera ao menos um frame e não trava.

### Não pode ter regredido

39. Easing de segmento, curvas, blur, escala/rotação por frame:
    inalterados.
40. WebCodecs/export comum (com durações > 0): inalterado.
41. Layout geral, cores, templates, textos fora do escopo: inalterados.

### iPhone/Safari

42. Repetir o checklist acima no iPhone/Safari via GitHub Pages com
    cache busting.

### Critério de aceite

A versão v8z4b16b deve ficar estável o suficiente para, depois de
teste manual completo, ser promovida do `arco-app-test` para o app
principal.

## v8z4b16a — Mobile UI consolidation: contextual menu, sliders, duration panel

Foco: validar a paridade de altura entre menu contextual e toolbar,
ordem nova das abas, sliders com faixa ativa cyan, painel Duração com
hierarquia limpa, sliders individuais subordinados ao "Tudo", invasão
visual da safe area e que nada da engine de animação foi tocado.

### Versão

1. Abrir o app.
2. Abrir o menu de configurações (engrenagem).
3. Confirmar: **Arco v8z4b16a — Mobile UI consolidation**.

### Menu contextual — altura idêntica à toolbar

4. Sem tocar em nenhum frame, conferir a altura da toolbar inferior.
5. Tocar num frame para abrir o menu contextual em modo compacto.
6. Confirmar que a faixa do menu contextual ocupa **exatamente** a
   mesma altura total da toolbar (parece pura troca de conteúdo, sem
   invasão extra do stage, sem wrapper extra).
7. Expandir uma função (ex. Escala). Confirmar que a altura do bloco
   expandido também respeita o safe-area-inset-bottom igual à toolbar.

### Menu contextual — ordem e ações rápidas

8. Em modo compacto, confirmar a ordem exata das abas:
   **Pausa, Rotação, Escala, Posição, Curvas, Adicionar**.
9. Tocar em **Curvas**: o menu contextual fecha e o painel de easing
   do segmento seguinte abre.
10. Reabrir o contextual num frame e tocar em **Adicionar**:
    confirmar que um frame é inserido após o ativo e o contextual
    fecha.
11. Tocar na aba **Pausa**: confirmar que o submenu mostra **apenas**
    slider + valor + Reset. Sem rótulo "Frame F1", sem texto
    "Duração/pausa neste frame".
12. Tocar fora (stage) durante o submenu: confirmar que tudo fecha e
    a toolbar inferior reaparece (não exige múltiplos "voltar").
13. Tocar em outro frame com o contextual aberto: confirmar que o
    menu troca para aquele frame sem fechar.

### Sliders — faixa ativa cyan

14. Abrir o painel **Duração** na toolbar e expandir Segmentos e
    Pausas por frame.
15. Confirmar visualmente que **todos** os sliders (Total, Tudo,
    individuais de segmento, individuais de pausa, Retorno do
    Acabamento) têm:
    - parte antes do thumb pintada de **cyan/turquesa**;
    - parte depois do thumb em **cinza escuro**;
    - sem glow exagerado.
16. Arrastar qualquer slider e confirmar que a faixa cyan acompanha
    em tempo real.
17. Abrir o menu contextual num frame → aba Pausa: o slider local
    também deve ter a mesma faixa cyan/cinza.

### Painel Duração — hierarquia limpa

18. Abrir o painel **Duração**.
19. Confirmar que apenas os cabeçalhos **Segmentos / Pausas por
    frame / Acabamento** têm linha divisória (border-bottom).
20. Dentro de cada bloco expandido, confirmar que NÃO há linhas
    horizontais entre os subitens — a leitura é contínua.
21. Confirmar que os subtítulos "Tempo por segmento" e "Pausa por
    frame" estão em tamanho menor (uppercase, cinza), claramente
    subordinados aos cabeçalhos.

### "Tudo" e individuais — sincronização visual

22. Com Pausas expandidas, mover o slider **Tudo** para 1.0s.
23. Confirmar que F1, F2, F3… recebem 1.0s.
24. Confirmar que os sliders individuais ficam **dessaturados** e os
    rótulos/valores em cinza claro (estado "sincronizado pelo
    global").
25. Mover o slider de F2 para 0.5s.
26. Confirmar que F2 volta ao contraste cheio, "Tudo" entra em estado
    misto/cinza, e os demais individuais voltam ao contraste cheio
    também (pois saímos do sincronismo).
27. Mover "Tudo" outra vez — todos voltam para o mesmo valor e os
    individuais voltam ao estado subordinado.

### Safe area inferior

28. No iPhone, comparar a toolbar com a versão anterior: a faixa
    preta acima da Home Bar deve estar visivelmente menor — o fundo
    da toolbar pinta até a Home Bar, mas os botões continuam acima
    dela.
29. Confirmar que nada foi cortado pela Home Bar (todos os botões
    permanecem clicáveis).

### Nada quebrado no motor

30. Rodar Preview — confirmar fluido, sem trancos.
31. Exportar MP4 — confirmar arquivo gerado normalmente.
32. Editar curva manualmente — confirmar que continua respondendo.
33. Salvar projeto JSON e reabrir — confirmar que tudo é restaurado.
34. Testar tudo no **iPhone/Safari** via GitHub Pages com cache
    busting.

## v8z4b15z — Frame menu hierarchy and duration panel fixes

Foco: validar a paridade visual real dos sliders, a ausência de nested
scroll, a faixa de frames sempre visível e a navegação estilo CapCut.

### Versão

1. Abrir o app.
2. Abrir o menu de configurações (engrenagem).
3. Confirmar: **Arco v8z4b15z — Frame menu hierarchy and duration panel
   fixes**.

### Painel Duração — sliders com mesma largura útil

4. Abrir **Duração** na toolbar.
5. Expandir **Segmentos** e **Pausas por frame**.
6. Confirmar que o slider **Total** (segmentos), o slider **Tudo**
   (pausas) e os sliders individuais (`1-2`, `2-3`, `F1`, `F2`...)
   percorrem **a mesma largura útil**.
7. Em iPhone, confirmar que o thumb das pausas vai do início ao fim da
   faixa sem parecer "preso a um container estreito".
8. Comparar a posição inicial do thumb no slider "Total" com a do
   slider "Tudo" — devem começar exatamente no mesmo X.

### Sem nested scroll

9. Com Segmentos e Pausas expandidas, confirmar que **só** o painel
   Duração rola verticalmente.
10. Tentar fazer scroll dentro da lista de segmentos / lista de pausas
    — não pode haver scroll local.
11. Mesmo com 30 frames criados, confirmar uma única superfície de
    rolagem.

### Acabamento — espaçamento

12. Expandir **Acabamento**.
13. Confirmar respiro entre o título "Acabamento" e a linha de chips
    Nenhum/Loop/Pausa final (`padding-top:28px`).
14. Selecionar **Loop** e confirmar que o slider "Retorno" tem a mesma
    largura útil dos sliders de Segmentos/Pausas.

### "Tudo" como estado global real

15. Mover o slider "Tudo" para 1.5s. Confirmar que F1, F2, F3...
    recebem 1.5s.
16. Mover só o slider F2 para 0.5s. Confirmar que o slider "Tudo"
    fica cinza/dessaturado e o valor exibe "—".
17. Mover "Tudo" novamente. Confirmar que **todos** os frames recebem
    o novo valor e o estado misto sai.

### Faixa de frames sempre visível

18. Tocar em um frame na faixa para abrir o menu local.
19. Confirmar que a faixa de frames continua **visível acima** do
    menu local — não some, não é sobreposta, não é deslocada.
20. Confirmar que a toolbar inferior sumiu (foi substituída pelo menu
    local).
21. Tocar em outro frame — confirmar troca de seleção sem fechar o
    menu local.

### Navegação CapCut

22. Com o menu local aberto em compact-mode (só ícones), confirmar
    que **não** há texto "Voltar" nem botão ✕.
23. Tocar no ícone **Escala** — confirmar expansão dos controles e
    aparição da seta de voltar grande à esquerda, sem texto.
24. Tocar na seta — confirmar volta ao compact-mode preservando a aba
    "Escala" como ativa.
25. Tocar fora do menu (no stage) — confirmar fechamento total.
26. Selecionar 2 frames. Confirmar que `#alignBar` aparece com seta
    de voltar à esquerda (sem ✕). Tocar a seta — confirma saída da
    multiseleção.

### Preview e export — não-regressão

27. Rodar Preview com pausas individuais distintas (F1=0.5s, F2=1s,
    F3=1.5s).
28. Confirmar que a duração total e as pausas tocam corretamente.
29. Gerar MP4 e confirmar que não há trancos/kicks e que pausas estão
    no MP4.
30. Salvar projeto JSON e reabrir. Confirmar que durações e pausas
    persistem.
31. Repetir 27-30 no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b15w — Duration panel UX unification and local frame panel redesign

Foco: validar a reorganização do painel Duração e o redesign do painel
local sem regressões nos valores/sincronização.

### Painel Duração — topo

1. Abrir o app.
2. Confirmar versão no menu: **Arco v8z4b15w — Duration panel UX
   unification and local frame panel redesign**.
3. Carregar imagem.
4. Abrir o painel **Duração** (toolbar).
5. Confirmar topo só com leitura: número grande de Duração total +
   card com Duração total, Segmentos, Pausas, Acabamento.
6. Confirmar que **não há slider nem input editável** acima do card.

### Painel Duração — seção Segmentos

7. Expandir a seção **Segmentos**.
8. Mover o slider "Total segs" e confirmar:
   - sliders individuais redistribuem proporcionalmente;
   - card do topo atualiza Segmentos / Duração total;
   - chip "Duração" da toolbar inferior atualiza.
9. Alterar o input **Intervalo padrão**, criar novos frames e confirmar
   que cada novo segmento usa esse valor.
10. Mover sliders individuais e confirmar que o card do topo reflete
    a nova soma de Segmentos.
11. Apertar **Igualar intervalos** e confirmar redistribuição igual.

### Painel Duração — seção Pausas por frame

12. Expandir a seção **Pausas por frame**.
13. Mover o slider **Tudo** (global) e confirmar:
    - todos os sliders por frame movem juntos;
    - labels (`F1`, `F2`, ...) atualizam em tempo real;
    - card do topo atualiza Pausas / Duração total;
    - chip "Duração" da toolbar atualiza.
14. Mover só o slider de F2; confirmar que o label global mostra `*`
    indicando divergência.
15. Apertar **Aplicar a todos**; confirmar que o `*` some, todos os
    frames recebem o valor global e o card do topo atualiza.
16. No iPhone/Safari, scrollar a lista de pausas verticalmente e
    confirmar que **o scroll funciona sem alterar valores**.
17. Tocar rapidamente em um slider de pausa e confirmar que o valor muda
    sem sequestrar o scroll.

### Painel local do frame — controles em cima, ícones embaixo

18. Tocar em um frame ativo para abrir o `custBar`.
19. Confirmar **modo compacto inicial**: só a barra de ícones embaixo,
    sem controles visíveis acima.
20. Tocar no ícone de **escala**; confirmar que os controles abrem
    **acima** dos ícones.
21. Tocar no ícone de **rotação**; confirmar troca de aba sem fechar.
22. Tocar no ícone de **posição**; idem.
23. Tocar no novo ícone **relógio** (duração/pausa local); confirmar
    que o slider atualiza para o valor do frame ativo.
24. Tocar **de novo** no ícone ativo; confirmar que recolhe para modo
    compacto.
25. Confirmar que **não há mais o cadeado global** (globe-lock) na
    barra de ícones.
26. Mover o slider local de pausa; confirmar que o valor reflete no
    painel Duração e no chip da toolbar.

### Sincronização e arquitetura preservada

27. Editar pausas via slider global, slider individual e slider local —
    confirmar que todos chegam ao mesmo estado.
28. Adicionar e remover frames; confirmar que `framePauses` mantém
    tamanho correto e nada quebra.
29. Salvar projeto JSON.
30. Recarregar app, abrir projeto JSON.
31. Confirmar que todas as pausas voltam corretamente.
32. Rodar **Preview** — confirmar timing igual ao esperado.
33. Exportar **MP4** — confirmar timing e ausência de trancos.
34. Repetir cenário em iPhone/Safari via GitHub Pages com cache busting.

## v8z4b3 — Inserted frame pass-through easing

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b3 — Inserted frame pass-through easing**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Definir easing entre F1 e F2 como Constante.
6. Editar a curva.
7. Inserir novo frame.
8. Confirmar que o movimento passa pelo novo frame sem pausa/easing extra.
9. Repetir com Acelerar.
10. Repetir com Desacelerar.
11. Repetir com Suavizar.
12. Confirmar que o easing não é duplicado nos dois novos segmentos.
13. Confirmar que o frame inserido continua na curva.
14. Mover o frame inserido e confirmar que a curva não vira reta.
15. Rodar preview.
16. Exportar MP4.
17. Salvar JSON.
18. Reabrir JSON.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.
