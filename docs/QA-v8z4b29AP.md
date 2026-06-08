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
