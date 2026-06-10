# QA pendente — v8z4b29BD Novo Projeto: Formato → Template → Imagem → Criar

- Base obrigatória: `v8z4b29BC` aprovada (frame ativo/HUD/menu superior em 4 colunas, "Novo Projeto" simples imagem→criar). Sem Home, sem página inicial, sem comunidade, sem recentes, sem perfil/conta, sem novo sistema de arquivos.
- Implementação: "Novo Projeto" no menu superior abre painel interno (`#newProjectModal`) com etapas Formato e Template (incluindo "Sem template") em estado temporário do painel; botão final "Escolher imagem e criar" abre o seletor de imagem (JPG/PNG/WebP); o projeto atual só é substituído após a nova imagem carregar com sucesso.
- Painel:
  - Formato: chips reaproveitados do painel de Formato existente (9:16, 3:4, 1:1, 4:3, 16:9), seleção inicial = formato atual do projeto (ou padrão do app).
  - Template: "Sem template", Pan L→R, Zoom in, Zoom out, Pan ↓, Rotação, Círculo — reaproveitando os tipos existentes em `applyTemplate()`. Seleção inicial = "Sem template".
  - Cancelar fecha o painel sem alterar formato/template/projeto atual.
- Criação do novo projeto (após imagem carregar):
  - Limpa frames, curvas (`curvesV2`/`ctrlPts`), pausas, durações, seleção múltipla, foco/frame ativo, undo/redo e vínculo com JSON anterior (via `clearCurrentProjectForNewFile`).
  - Aplica o formato escolhido (`currentRatio`) antes de criar os frames.
  - "Sem template": cria F1 ativo/numerado via `createInitialFrameForNewImageProject()`.
  - Template ≠ "Sem template": cria os frames do template via `applyTemplate()` imediatamente após F1, e undo/redo são limpos novamente em seguida.
  - Renderiza Stage/timeline/contador/handles imediatamente, com segunda renderização via `requestAnimationFrame`.
  - Captura novo `projectResetBaseline` — Reset Project volta a este estado (imagem + formato + template escolhidos), nunca ao JSON/projeto anterior.

## QA manual pendente v8z4b29BD

1. Versão visível mostra `v8z4b29BD` (menu, comentário do topo, `APP_VERSION`/`APP_VERSION_NAME`).
2. App abre normalmente, sem Home/página inicial.
3. Menu superior mantém "Novo Projeto" (Salvar, Novo Projeto, Abrir, Recarregar).
4. Tocar em "Novo Projeto" abre o painel interno (Formato, Template, botões Cancelar / Escolher imagem e criar).
5. Painel permite escolher Formato (9:16, 3:4, 1:1, 4:3, 16:9).
6. Painel permite escolher Template ou "Sem template" (selecionado por padrão).
7. Trocar Formato/Template no painel não altera o projeto atual (Stage, JSON, undo/redo intactos).
8. Cancelar fecha o painel e não altera o projeto atual.
9. Tocar "Escolher imagem e criar" abre o seletor; cancelar o seletor preserva o projeto atual.
10. Escolher imagem JPG/PNG/WebP válida cria o novo projeto somente após o carregamento.
11. Imagem inválida mostra "Não foi possível abrir esta imagem. Use JPG, PNG ou WebP." e preserva o projeto atual.
12. Formato escolhido no painel é aplicado ao novo projeto (Stage e export refletem o formato).
13. Template escolhido no painel é aplicado ao novo projeto (frames/curvas corretos).
14. "Sem template" cria F1 ativo/numerado imediatamente.
15. Template ≠ "Sem template" cria a quantidade correta de frames imediatamente (ex.: Pan L-R = 2, Círculo = 8).
16. Timeline/menu inferior mostra a quantidade correta de frames imediatamente, sem precisar tocar Stage/timeline/Preview.
17. Nunca aparece 0 frames.
18. Novo projeto não herda frames do projeto anterior.
19. Novo projeto não herda curvas/pausas/durações/seleção do projeto anterior.
20. Reset Project volta ao estado inicial do novo projeto (imagem + formato + template escolhidos), não ao JSON/projeto antigo.
21. Abrir JSON continua funcionando normalmente.
22. Salvar JSON continua funcionando normalmente.
23. Preview continua funcionando normalmente.
24. Export MP4 continua funcionando normalmente.
25. Funciona no iPhone/Safari (toques, scroll do painel, safe-area do bottom sheet).

## Áreas preservadas (não alteradas)

- Frame visual do Stage, abas/pontos, faixa superior (frameHud), cruz central, clamp de criação de frames (v8z4b29BC).
- Timeline/menu inferior visual e motor de animação.
- Curvas/Bézier, Tangente, Global.
- Preview/export/MP4, JSON salvo/aberto.
- Seleção múltipla, menus contextuais ancorados ao Stage, confirmação de inserção assistida.
- Menu superior aprovado, exceto a ação de "Novo Projeto" agora abrir o novo painel.
