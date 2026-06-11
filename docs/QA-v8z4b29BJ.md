# QA pendente — v8z4b29BJ: ajustes finos de UI/UX e ícones

- Base obrigatória: `v8z4b29BI` (aprovada — launcher separado do Stage, fluxo de Novo Projeto mais direto, bloqueio da interface durante confirmação/cancelamento de frame e criação funcional de projeto). Esta versão faz apenas ajustes finos de UI/UX e troca de ícones, sem regressões.

## O que mudou

### 1. Aviso/toast de bloqueio reposicionado

- Durante a criação/inserção de frame, o aviso "Confirme ou cancele o frame atual." (`#statusBar`) desce de `top:10px` para `top:56px`, criando uma "safe zone" abaixo do pill de zoom (`#editorZoomCtrl`, `top:8px`).
- O aviso continua centralizado horizontalmente, visível, legível e sem sobrepor o pill de zoom nem o topo do Stage.
- O pill de zoom não foi movido.

### 2. Painel de Duração/Tempo fecha ao usar o menu superior

- Com o painel "Duração" (`#panelDuration`) aberto, tocar em qualquer botão do menu superior (`#topBar`: Voltar/Fechar projeto, Arquivos, Visualizar, Preview, Undo/Redo) fecha o painel (via `closeAll()`) antes da ação do topo continuar.
- O menu superior continua acessível normalmente; nenhuma ação do topo é bloqueada.
- A ação do topo (abrir Arquivos, alternar Visualizar, iniciar Preview, Undo/Redo, fechar projeto) continua funcionando normalmente após o fechamento do painel.
- Estado da timeline e do Stage não são alterados pelo fechamento do painel.

### 3. Ícones contextuais de trecho alinhados à esquerda (4ª linha)

- Na seleção de trecho, os itens "Tempo" e "Movimento" da 4ª linha do menu inferior deixam de ficar centralizados/espalhados e passam a ficar alinhados à esquerda, com largura fixa (68px) e o mesmo espaçamento (gap 6px) usado pelos ícones contextuais de frame (Pausa, Rotação, Escala, Mover).
- Tamanho dos ícones, textos, cores, altura da linha e estilo visual geral preservados.

### 4. Frames e trechos um pouco mais largos na faixa

- Frames (`.fp`) na faixa/timeline passam de 34px para 36px de largura.
- Trechos (`.ease-fp` no `#pillsRow` e `.lower-time-chip.segment`/`.lower-time-chip.pause` no `#lowerPartialTimes`) aumentam ~2px (22px → 24px e 34px → 36px, respectivamente), mantendo o alinhamento entre as duas faixas sincronizadas.
- Padding de centralização (`calc(50% - 17px)` → `calc(50% - 18px)`) ajustado para acompanhar a nova metade da largura do frame.
- Snap, posição das bolinhas (`.seg-dot`), altura da timeline, lógica de seleção e comportamento geral preservados.

### 5. Ícone de Arquivos no menu superior

- O ícone de "Arquivos" no menu superior troca de claquete (`i-clapperboard`) para rolo de filme (`i-film-roll`).
- Função, posição, tamanho, peso de traço, alinhamento, cor/estado ativo-inativo e área de toque preservados.

### 6. Ícone de Tempo/Duração na 4ª linha

- O item "Tempo" (botão de Duração geral) na 4ª linha do menu inferior troca o ícone de relógio/prancheta (`i-clipboard-clock`) por uma cadeira de diretor (`i-director-chair`).
- Função, alinhamento com o texto, tamanho, peso de traço, área de toque e cor/estado preservados.

## QA manual pendente v8z4b29BJ

1. Versão visível mostra `v8z4b29BJ` (menu Arquivos, comentário do topo, `APP_VERSION`/`APP_VERSION_NAME`, CHANGELOG).
2. Durante criação/inserção de frame, o aviso "Confirme ou cancele o frame atual." aparece mais abaixo, sem colidir com o topo do Stage.
3. O aviso não sobrepõe o pill de zoom em nenhum momento.
4. O aviso continua visível, legível e centralizado horizontalmente.
5. O pill de zoom permanece na mesma posição (`top:8px;right:8px`).
6. Abrir o painel de Duração/Tempo e tocar em "Voltar/Fechar projeto" fecha o painel e executa a ação normalmente.
7. Abrir o painel de Duração/Tempo e tocar em "Arquivos" fecha o painel e abre o menu de Arquivos normalmente.
8. Abrir o painel de Duração/Tempo e tocar em "Visualizar" fecha o painel e alterna a visualização normalmente.
9. Abrir o painel de Duração/Tempo e tocar em "Preview" fecha o painel e inicia a reprodução normalmente.
10. Abrir o painel de Duração/Tempo e tocar em Undo/Redo (quando habilitados) fecha o painel e desfaz/refaz normalmente.
11. Após o fechamento do painel pelo menu superior, a timeline e o Stage continuam no mesmo estado (sem perda de seleção/posição inesperada).
12. Selecionar um trecho mostra os ícones "Tempo" e "Movimento" alinhados à esquerda na 4ª linha, sem grande vazio entre eles.
13. O espaçamento entre os ícones de trecho é semelhante ao espaçamento entre os ícones de frame (Pausa, Rotação, Escala, Mover).
14. Selecionar um frame continua mostrando os ícones contextuais de frame normalmente, sem alteração visual.
15. Frames na faixa ficam visualmente um pouco mais largos (34px → 36px).
16. Trechos entre frames na faixa ficam visualmente um pouco mais compridos (22px → 24px).
17. Snap da timeline continua funcionando ao soltar o scroll.
18. Bolinhas (seg-dot) de início/fim de trecho continuam bem posicionadas nas extremidades dos trechos.
19. Centralização do frame focal na faixa continua funcionando normalmente.
20. O ícone de "Arquivos" no menu superior é um rolo de filme, com tamanho, alinhamento, cor e área de toque coerentes com os demais ícones do topo.
21. Tocar no ícone de Arquivos abre o painel de Arquivos normalmente (função preservada).
22. O ícone de "Tempo" na 4ª linha do menu inferior é uma cadeira de diretor, com tamanho, alinhamento e área de toque coerentes.
23. Tocar no ícone de "Tempo" abre o painel de Duração normalmente (função preservada).
24. Fluxo launcher → Novo Projeto → editor continua funcionando sem regressões.
25. Bloqueio principal durante criação de frame continua funcionando (mensagem, barra de Confirmar/Cancelar).
26. Stage, visual do frame, abas/pontos, faixa superior, cruz central, clamp de criação de frames e curvas/Bézier sem alteração.
27. Preview continua funcionando normalmente.
28. Export MP4 continua funcionando normalmente.
29. Salvar/Abrir JSON continuam funcionando normalmente.
30. Funciona no iPhone/Safari, sem regressões.

## Áreas preservadas (não alteradas)

- Fluxo launcher → Novo Projeto → editor.
- Bloqueio principal durante criação de frame.
- Stage, visual do frame no Stage, abas/pontos do frame, faixa superior do frame, cruz central, clamp de criação de frames, curvas/Bézier.
- Preview/export/MP4, JSON salvo/aberto, motor.
- Templates e formato.
- Lógica da timeline (snap, seleção, scroll/centralização), exceto os ajustes visuais de largura desta versão.
- Ícones não citados nesta versão.
