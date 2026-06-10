# QA pendente — v8z4b29BI: remove etapa "Imagem" do Novo Projeto e bloqueia UI durante criação de frame

- Base obrigatória: `v8z4b29BH` (avançou na separação launcher → Novo Projeto → editor/Stage, mas não foi aprovada por dois problemas de fluxo/UX). Esta versão corrige esses dois pontos sem alterar a separação estrutural launcher / newProject / editor.

## O que mudou

### 1. Etapa "Imagem" deixa de ser um passo a mais

- O painel Novo Projeto (Formato → Template) agora mostra, na própria tela, um botão único "Escolher imagem" logo após as seções Formato e Template.
- Tocar em "Escolher imagem" abre direto o seletor nativo do iOS/Safari (`<input type="file" accept="image/...">` sem `capture`), que pode oferecer Fototeca/Tirar Foto/Escolher Arquivo no próprio menu do sistema — sem botões próprios duplicados no app.
- Não existe mais uma tela/página separada chamada "Imagem": o painel Novo Projeto permanece visível (Stage e projeto anterior continuam ocultos) enquanto o seletor nativo está aberto.
- Ao escolher uma imagem válida, o painel Novo Projeto fecha, o projeto é criado (formato + template aplicados, F1/frames sincronizados, Stage, timeline e contador atualizados) e o editor/Stage abre.
- Imagem inválida ou seletor cancelado: o painel Novo Projeto permanece aberto, com mensagem de erro quando aplicável; nada muda no app.

### 2. Bloqueio total da interface durante criação/inserção de frame

- Enquanto houver um frame pendente de confirmação/cancelamento (`isInsertingFrame`/ghost ativo), toda a interface fora da barra de inserção (`#insertionActionBar`) fica bloqueada:
  - menu superior (Voltar/Fechar projeto, Arquivos, Visualizar, Preview, Undo/Redo);
  - painel "Arquivos" (Formato, Template, Fundo, Reset, Salvar, Abrir, Recarregar etc.);
  - menu inferior / timeline, painel de Tempo, toolbar contextual (Pausa, Rotação, Escala, Mover, Tempo do trecho, Movimento);
  - menus contextuais do Stage e qualquer outra navegação.
- Tocar em qualquer controle bloqueado mostra a mensagem "Confirme ou cancele o frame atual." (toast existente via `showStatus`), sem abrir painel, sem trocar de tela e sem alterar o estado do projeto.
- Confirmar o frame: salva/cria o frame, sincroniza Stage/timeline e libera toda a interface normalmente.
- Cancelar o frame: remove o frame pendente/ghost, sincroniza Stage/timeline e libera toda a interface normalmente.
- Em nenhum caso o app fica preso em modo bloqueado depois de confirmar ou cancelar.

## QA manual pendente v8z4b29BI

1. Versão visível mostra `v8z4b29BI` (menu Arquivos, comentário do topo, `APP_VERSION`/`APP_VERSION_NAME`, CHANGELOG).
2. Launcher continua abrindo independente do Stage (sem regressão da v8z4b29BH).
3. "Novo Projeto" abre fora do Stage, sem mostrar projeto anterior atrás.
4. No painel Novo Projeto, escolher Formato e Template não abre nenhuma tela/página separada "Imagem".
5. O botão "Escolher imagem" aparece diretamente no painel Novo Projeto, depois de Formato e Template.
6. Tocar em "Escolher imagem" abre o seletor nativo do iPhone/Safari.
7. Não existem botões próprios "Fototeca"/"Tirar Foto"/"Escolher Arquivo" no app — apenas "Escolher imagem".
8. Criar projeto com "Sem template" gera F1 ativo imediatamente, com Stage/timeline/contador sincronizados.
9. Criar projeto com template Pan renderiza os frames imediatamente no Stage e na timeline.
10. Criar projeto com template Círculo renderiza os frames imediatamente no Stage e na timeline.
11. Stage só aparece depois de um projeto válido criado ou aberto.
12. Iniciar criação/inserção de frame mostra "Confirme ou cancele o frame atual." e exibe a barra de Confirmar/Cancelar.
13. Durante a inserção, tocar no menu superior (Voltar, Arquivos, Visualizar, Preview, Undo/Redo) não executa a ação e mostra "Confirme ou cancele o frame atual."
14. Durante a inserção, tocar no menu inferior/timeline (pílulas, Tempo, +) não executa a ação e mostra a mensagem.
15. Durante a inserção, abrir Arquivos e tocar em Formato/Template/Imagem/Reset/Salvar/Abrir/Recarregar não abre painel nenhum e mostra a mensagem.
16. Durante a inserção, tocar em Preview/Play não inicia a reprodução.
17. Durante a inserção, painéis de Pausa/Rotação/Escala/Mover/Tempo do trecho não abrem.
18. Confirmar o frame pendente salva/cria o frame normalmente, sincroniza Stage/timeline e libera todos os menus e botões.
19. Cancelar o frame pendente remove o frame/ghost, sincroniza Stage/timeline e libera todos os menus e botões.
20. Depois de confirmar ou cancelar, nenhum controle continua bloqueado e nenhuma mensagem residual aparece.
21. Preview continua funcionando normalmente fora do modo de inserção.
22. Export MP4 continua funcionando normalmente.
23. Salvar/Abrir JSON continuam funcionando normalmente.
24. Funciona no iPhone/Safari.

## Áreas preservadas (não alteradas)

- Visual do frame no Stage, abas/pontos, faixa superior, cruz central, clamp de criação de frames.
- Timeline/menu inferior visual, curvas/Bézier.
- Preview/export/MP4, JSON salvo/aberto, motor.
- Templates e formato em si.
- Layout geral do editor e menu superior (exceto o bloqueio durante frame pendente).
- Launcher independente, separação launcher / newProject / editor, botão X do Stage e "Recarregar" do launcher (v8z4b29BH).
