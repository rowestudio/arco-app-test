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

