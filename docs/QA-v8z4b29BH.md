# QA pendente — v8z4b29BH: ajustes de UX sobre launcher/Novo Projeto/editor

- Base obrigatória: `v8z4b29BG` (aprovada — separou launcher, fluxo de Novo Projeto e editor/Stage em estados explícitos; o fluxo Novo Projeto funcionou). Esta versão faz três correções de fluxo/UX sobre essa base, sem alterar a separação estrutural launcher / newProject / editor.

## O que mudou

- **Etapa Imagem do Novo Projeto**: os três botões próprios (Fototeca / Tirar Foto / Escolher Arquivo) foram substituídos por um único botão "Escolher imagem", que abre o seletor nativo de imagem (`<input type="file" accept="image/...">` sem `capture`). O iOS/Safari resolve Fototeca/Tirar Foto/Escolher Arquivo no próprio menu nativo, eliminando a duplicidade visual. A etapa continua fora do Stage, sem mostrar projeto anterior, sem abrir Projeto/JSON.
- **Launcher**: nova ação discreta "Recarregar" abaixo de "Abrir Projeto", que chama `location.reload()`. Após recarregar, o app sempre volta ao launcher (comportamento padrão de `DOMContentLoaded`, preservado da v8z4b29BG).
- **Botão X/fechar do Stage** (`requestCloseStageToLauncher()`): se houver projeto aberto (imagem carregada ou frames > 0), mostra o aviso "Fechar projeto — O projeto atual pode ser perdido se não foi salvo." com botões Cancelar/Fechar. "Cancelar" mantém o editor intacto. "Fechar" (`confirmStageCloseToLauncher()` → `closeProjectAndReturnToLauncher()`) limpa frames, imagem, Stage, timeline e toolbar, e volta ao launcher independente. Se não houver risco de perda, volta direto ao launcher.

## QA manual pendente v8z4b29BH

1. Versão visível mostra `v8z4b29BH` (menu Arquivos, comentário do topo, `APP_VERSION`/`APP_VERSION_NAME`, CHANGELOG).
2. Recarregar o app (botão do launcher ou reload do navegador) sempre volta para a página inicial independente "Arco Motion App".
3. Launcher mostra "Novo Projeto", "Abrir Projeto" e, abaixo, a ação discreta "Recarregar".
4. Tocar em "Recarregar" no launcher recarrega o app e mantém o usuário no launcher (sem abrir Stage, sem criar projeto, sem restaurar projeto anterior).
5. "Novo Projeto" continua abrindo o painel Formato → Template → Imagem normalmente.
6. Na etapa Imagem do Novo Projeto, aparece apenas o botão "Escolher imagem" (e "Voltar") — sem Fototeca/Tirar Foto/Escolher Arquivo próprios do app.
7. Tocar em "Escolher imagem" abre o seletor nativo do iOS/Safari, que pode mostrar Fototeca/Tirar Foto/Escolher Arquivo — sem duplicidade visual com a tela do app.
8. Cancelar o seletor nativo mantém o app na etapa Imagem (ou permite voltar ao painel Formato/Template) — nunca mostra o Stage nem projeto anterior.
9. Durante a etapa Imagem, Stage/timeline/toolbar/projeto anterior continuam ocultos (preserva v8z4b29BG).
10. Escolher uma imagem válida com "Sem template" cria F1 ativo imediatamente e entra no editor sem "0 frames".
11. Escolher uma imagem válida com template Pan cria os frames do template imediatamente, visíveis no Stage e na timeline.
12. Escolher uma imagem válida com template Círculo cria os frames imediatamente, visíveis no Stage e na timeline.
13. No editor, com projeto aberto (imagem carregada e/ou frames > 0), tocar no X do topo mostra o aviso "Fechar projeto — O projeto atual pode ser perdido se não foi salvo." (Cancelar/Fechar).
14. "Cancelar" no aviso mantém o editor exatamente como estava (Stage, frames, timeline, toolbar inalterados).
15. "Fechar" no aviso limpa o projeto (frames, imagem, curvas), oculta Stage, timeline/menu inferior e toolbar, e volta ao launcher independente.
16. Após "Fechar", o Stage não fica vazio visível e a timeline não fica visível sem projeto.
17. Recarregar o app depois de "Fechar" continua abrindo no launcher.
18. "Novo Projeto" e "Abrir" no menu do editor continuam mostrando o aviso de possível perda existente (Cancelar/Continuar) — sem regressão.
19. Preview continua funcionando depois de criar/abrir um projeto.
20. Export MP4 continua funcionando depois de criar/abrir um projeto.
21. Salvar/Abrir JSON continuam funcionando.
22. Funciona no iPhone/Safari.

## Áreas preservadas (não alteradas)

- Frame visual do Stage, abas/pontos, faixa superior, cruz central, clamp de criação de frames.
- Timeline/menu inferior visual, curvas/Bézier.
- Preview/export/MP4, JSON salvo/aberto, motor.
- Templates e formato em si.
- Separação launcher / newProject / editor (v8z4b29BG) e commit final do Novo Projeto (F1 ativo, templates Pan/Círculo criando frames imediatamente).
- Menu superior, exceto o comportamento do botão X.
