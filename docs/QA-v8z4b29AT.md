# QA pendente — v8z4b29AT Novo Projeto Home direto e commit sincronizado

- Base obrigatória confirmada: `v8z4b29AS` em teste, rejeitada/não aprovada, antes das alterações.
- Versionamento atualizado para `v8z4b29AT` em comentário/changelog do topo, `APP_VERSION`, `APP_VERSION_NAME`, texto visível no menu do editor e versão exibida no menu da Home.
- Auditoria do DOM da Home: a Home é markup estático em `#homeScreen`; o elemento real exibido é `button#homeNewProjectBtn.home-action.primary`, com `data-home-action="new-project"`; a versão AT conecta `onclick` direto ao botão renderizado e mantém delegação por `data-home-action` apenas como fallback.
- Diagnósticos discretos adicionados durante a correção: `[Home] render`, `[Home] new project button found` e `[Home] new project clicked` confirmam que o botão real renderizado recebe o evento.
- `Novo projeto` da Home continua chamando o mesmo `openNewProjectFlow({ origin: 'home' })` usado pelo editor; o editor chama `openNewProjectFlow({ origin: 'editor' })`, preservando cancelamento específico por origem.
- `commitPendingNewProject()` agora protege o commit com `try/catch`, mostra estado de criação, valida dimensões reais da imagem, só fecha a tela de Novo Projeto após frames válidos, limpa undo/redo inicial e força sincronização completa do editor.
- `syncNewProjectUiAfterCommit()` centraliza a sincronização pós-commit: normaliza arrays, seleciona/focaliza F1, limpa seleção/menus/preview/export antigo, renderiza Stage/timeline/contador e agenda segunda atualização por `requestAnimationFrame` para Safari/iPhone.
- Nenhum Novo Projeto deve terminar com `0` frames: se template ou Sem template não produzir frames válidos, o app registra `[NewProject] template produced 0 frames; fallback to F1 assisted` e cria F1 assistido.
- Template `Círculo` permanece padronizado internamente como `circle`, com aliases normalizados, aplicado somente depois da imagem carregada e dimensões/stage válidos, seguido da sincronização pós-commit.
- Ícone da Home para menu/recarregar passa a reutilizar exatamente o símbolo `#i-reload`, o mesmo usado no menu interno do editor.
- Riscos: validar manualmente em iPhone/Safari/PWA se o picker de arquivo mantém a intenção `newProjectImage`, se os logs confirmam o clique real no botão e se a segunda renderização via `requestAnimationFrame` elimina o atraso visual.
- Regressão obrigatória preservada: Abrir Projeto pela Home, Fechar Projeto com aviso, escala proporcional dos frames no Stage, offset do número, espessura de borda, timeline/menu inferior visual, `.fp`, `#pillsRow`, `.mid-pills`, pontos laranja, snap-to-center, Alpha/spotlight, curvas/handles, Tangente/Global, Preview/export/MP4, JSON e motor.

## Funções alteradas

- `bindHomeActions()` adicionada para ligar diretamente o botão real `homeNewProjectBtn` renderizado.
- `showAppHome()` atualizado para registrar renderização e religar ações após exibir a Home.
- `syncNewProjectUiAfterCommit()` reforçado para resetar preview/export antigo, atualizar painéis/metadados e fazer segunda renderização completa.
- `ensureNewProjectHasFrames()` ajustado para o warning obrigatório do fallback F1 assistido.
- `commitPendingNewProject()` reforçado com estado de processamento, validação de dimensões, try/catch e fechamento da tela apenas após commit válido.

## Test steps

1. Abrir o app sem projeto ativo e confirmar que a Home aparece.
2. Abrir menu da Home e confirmar `Versão: v8z4b29AT`.
3. Confirmar no console `[Home] new project button found` apontando para `button#homeNewProjectBtn`.
4. Tocar `Novo projeto` na Home e confirmar `[Home] new project clicked` e abertura imediata da tela de criação.
5. Confirmar que o card/botão `Novo projeto` não fica permanentemente selecionado/focado ao abrir a Home.
6. Cancelar/X no Novo Projeto vindo da Home e confirmar retorno à Home sem projeto vazio.
7. Novo Projeto vindo da Home: escolher formato, `Sem template`, imagem e confirmar editor aberto automaticamente com F1 real/fallback seguro, contador diferente de `0`, Stage e timeline visíveis sem tocar.
8. Novo Projeto vindo da Home: escolher template `Círculo`, imagem e confirmar Stage/timeline/contador com frames circulares imediatamente, sem tocar no Stage/timeline.
9. No editor, Arquivos → `Novo projeto`: cancelar confirmação e confirmar editor intacto.
10. No editor, Arquivos → `Novo projeto`: confirmar, concluir com `Sem template` e confirmar fechamento automático da tela de Novo Projeto e editor sincronizado.
11. No editor, Arquivos → `Novo projeto`: confirmar, concluir com template `Círculo` e confirmar Preview usando o movimento circular correto, sem herdar pan antigo.
12. Simular template sem frames e confirmar warning `[NewProject] template produced 0 frames; fallback to F1 assisted` e abertura com F1 seguro.
13. Simular erro no commit e confirmar `[NewProject] commit failed`, erro visível por status, modal aberto e sem editor parcial.
14. Tocar `Abrir projeto` na Home, cancelar seletor e confirmar permanência na Home.
15. Tocar `Abrir projeto` na Home, carregar JSON válido e confirmar editor direto, sem tela de Novo Projeto.
16. No editor, tocar `Voltar`, escolher Cancelar no aviso e confirmar permanência no editor.
17. No editor, tocar `Voltar`, escolher Sair/OK no aviso e confirmar volta à Home.
18. Carregar JSON pela Home e testar Reset Project para confirmar baseline do JSON preservado.
19. Confirmar que o ícone de recarregar da Home usa o mesmo `#i-reload` do menu interno do editor.
20. Rodar regressão manual de Stage, escala proporcional, offset do número, timeline/menu inferior, pontos laranja, snap-to-center, curvas/Tangente/Global, Preview/export/MP4, JSON e iPhone/Safari.

