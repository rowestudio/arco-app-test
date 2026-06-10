# QA pendente — v8z4b29BF: launcher simples Novo Projeto / Abrir Projeto

- Base obrigatória: `v8z4b29BE` (não aprovada — fluxo Novo Projeto: Formato → Template → Imagem → Criar). Esta versão substitui a tela inicial antiga "Imagem / Projeto" por uma entrada simples (Novo Projeto / Abrir Projeto), preservando o fluxo Formato → Template → Imagem → Criar e todas as áreas aprovadas até a v8z4b29BC.

## O que mudou

- A antiga tela inicial com as opções "Imagem" (começar do zero) e "Projeto" (abrir um salvo) deixou de ser a entrada principal do app.
- Quando o app abre sem projeto carregado, aparece a entrada simples "Arco Motion App" com dois botões: **Novo Projeto** e **Abrir Projeto**.
- **Novo Projeto** (entrada inicial ou menu do editor) abre o fluxo já existente Formato → Template → Imagem → Criar.
- **Abrir Projeto** (entrada inicial ou menu do editor) abre o seletor de arquivo JSON do app, preservando o fluxo de "Abrir" já existente.
- A etapa final de imagem do fluxo Novo Projeto continua mostrando apenas Fototeca / Tirar Foto / Escolher Arquivo (ação nativa do seletor de imagem do iOS), sem opção de "Projeto" ou "Abrir JSON".
- No editor, o menu superior mantém "Novo Projeto" e "Abrir". Se houver projeto aberto (imagem carregada ou frames existentes), tocar em qualquer um dos dois mostra um aviso "O projeto atual pode ser perdido se não foi salvo." com os botões Cancelar/Continuar.
- A antiga tela "Imagem / Projeto" permanece disponível apenas no caso legado de projeto JSON carregado sem imagem embutida (aguardando o usuário escolher a imagem para concluir o carregamento) — não é mais a entrada principal do app.

## QA manual pendente v8z4b29BF

1. Versão visível mostra `v8z4b29BF` (menu, comentário do topo, `APP_VERSION`/`APP_VERSION_NAME`).
2. Ao abrir o app sem nenhum projeto carregado, aparece a entrada simples "Arco Motion App" com os botões "Novo Projeto" e "Abrir Projeto".
3. A tela antiga com "Imagem" / "Projeto" e o texto "Imagem para começar do zero / Projeto para abrir um salvo" não aparece mais como entrada principal.
4. Tocar em "Novo Projeto" na entrada inicial abre o painel Formato → Template → Imagem.
5. A etapa final de imagem do Novo Projeto mostra apenas as opções nativas de imagem (Fototeca / Tirar Foto / Escolher Arquivo) — sem "Projeto" e sem abrir JSON.
6. Tocar em "Abrir Projeto" na entrada inicial abre o seletor de arquivo (`.json`) do projeto salvo.
7. Cancelar o seletor de imagem do fluxo Novo Projeto (sem projeto anterior) mantém a entrada simples Novo Projeto / Abrir Projeto.
8. Cancelar o seletor de arquivo do "Abrir Projeto" (sem projeto anterior) mantém a entrada simples Novo Projeto / Abrir Projeto.
9. Criar Novo Projeto com "Sem template" gera F1 ativo imediatamente e entra no editor normalmente (entrada simples desaparece).
10. Criar Novo Projeto com template Pan renderiza os frames do template imediatamente.
11. Criar Novo Projeto com template Círculo renderiza os 8 frames imediatamente.
12. A timeline não mostra "0 frames" após qualquer criação válida de Novo Projeto.
13. Abrir um projeto JSON válido pela entrada inicial carrega o projeto e entra no editor normalmente.
14. No editor, com um projeto aberto (imagem carregada), tocar em "Novo Projeto" no menu superior mostra o aviso "O projeto atual pode ser perdido se não foi salvo." com Cancelar/Continuar.
15. Tocar em "Cancelar" no aviso mantém o projeto atual intacto (Stage, frames, curvas, timeline inalterados).
16. Tocar em "Continuar" no aviso abre o fluxo Novo Projeto → Formato → Template → Imagem → Criar normalmente.
17. No editor, com um projeto aberto, tocar em "Abrir" no menu superior também mostra o aviso de possível perda antes de abrir o seletor de JSON.
18. Reset Project após criar um Novo Projeto (com ou sem template) restaura corretamente o novo projeto criado.
19. Salvar JSON continua funcionando.
20. Abrir JSON continua funcionando (incluindo projeto salvo sem imagem embutida, que ainda solicita a imagem para continuar).
21. Preview continua funcionando.
22. Export MP4 continua funcionando.
23. Funciona no iPhone/Safari.

## Áreas preservadas (não alteradas)

- Frame visual do Stage (v8z4b29BC), abas/pontos, faixa superior, cruz central, clamp de criação de frames.
- Timeline/menu inferior visual, curvas/Bézier.
- Preview/export/MP4, JSON salvo/aberto (exceto novo acionamento via "Abrir Projeto"), motor.
- Seleção múltipla, menus contextuais, templates, formato.
- Fluxo interno Formato → Template → Imagem → Criar e sua sincronização final (v8z4b29BD/BE).
