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
