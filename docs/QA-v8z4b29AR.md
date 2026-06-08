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
