# QA Checklist

Use depois de qualquer alteração, mesmo pequena.

## Teste mínimo obrigatório

1. Abrir o app.
2. Carregar imagem.
3. Aplicar Template Circular.
4. Editar curva manualmente.
5. Confirmar que a curva não reseta.
6. Rodar Preview.
7. Gerar MP4.
8. Confirmar que o MP4 não tem trancos/kicks.
9. Alterar escala de um frame.
10. Alterar rotação de um frame.
11. Alterar easing.
12. Inserir pausa em frame.
13. Gerar MP4 novamente.
14. Testar no iPhone/Safari.

## Teste específico — Escala global

1. Carregar imagem.
2. Aplicar Template Circular.
3. Editar a curva manualmente.
4. Abrir ajuste de escala.
5. Ativar Global.
6. Alterar escala.
7. Confirmar que as curvas continuam no lugar.
8. Rodar Preview.
9. Gerar MP4.

## Teste específico — Fixar

1. Selecionar um frame.
2. Ativar Fixar.
3. Confirmar destaque vermelho.
4. Desativar Fixar.
5. Confirmar volta ao estado visual normal.

## v8z3w — Export stability diagnostics

- **Ambiente:** GitHub Pages com cache busting, iPhone/Safari.
- **Objetivo do teste:** verificar se o bug intermitente do MP4 sem imagem ainda ocorre.
- **Procedimento:** carregar imagem, editar frames, alterar escala, posição, rotação, easing/transição, alternar fundo preto/branco e gerar múltiplos MP4s.
- **Resultado:** nenhum MP4 saiu apenas com a cor de fundo.
- **Decisão de QA:** manter v8z3w como checkpoint provisório de estabilidade.
- **Plano de contingência:** v8z3x somente se o bug reaparecer.

## v8z4a — 30-frame capacity sprint

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4a — 30-frame capacity sprint**.
3. Carregar imagem.
4. Criar frames até chegar a 30.
5. Selecionar F1, frames intermediários e F30.
6. Mover/editar frames.
7. Remover alguns frames.
8. Adicionar novamente até validar estabilidade.
9. Rodar Preview.
10. Exportar MP4.
11. Salvar JSON.
12. Reabrir JSON.
13. Confirmar que projetos antigos com 2 a 8 frames continuam funcionando.
14. Testar no iPhone/Safari com GitHub Pages e cache busting.

## v8z4b — Insert frame on existing curve

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b — Insert frame on existing curve**.
3. Carregar imagem.
4. Criar dois frames: F1 e F2.
5. Editar manualmente a curva entre F1 e F2.
6. Com F1 ativo, adicionar novo frame.
7. Confirmar que o novo F2 nasce dentro da curva.
8. Confirmar que o antigo F2 vira F3.
9. Confirmar que a curva não virou reta.
10. Confirmar que a curva visual foi preservada em dois trechos.
11. Mover o novo frame e confirmar que a edição continua funcionando.
12. Fazer undo e redo da inserção.
13. Rodar preview.
14. Exportar MP4.
15. Salvar JSON.
16. Reabrir JSON e confirmar que a curva permanece correta.
17. Repetir o teste com mais frames.
18. Repetir até perto do limite de 30 frames.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b1 — Preserve split curve after frame edit

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b1 — Preserve split curve after frame edit**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Editar a curva entre F1 e F2, deixando ela bem visível.
6. Inserir novo frame entre F1 e F2.
7. Confirmar que o novo F2 nasce sobre a curva.
8. Mover o novo F2.
9. Confirmar que a curva não vira reta.
10. Confirmar que os segmentos F1→F2 e F2→F3 continuam curvos.
11. Mover F1 e confirmar que a curva não reseta indevidamente.
12. Mover F3 e confirmar que a curva não reseta indevidamente.
13. Fazer undo/redo.
14. Rodar preview.
15. Exportar MP4.
16. Salvar JSON.
17. Reabrir JSON e confirmar que a curva continua correta.
18. Repetir com mais de 3 frames.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b2 — Restore curve/easing separation

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b2 — Restore curve/easing separation**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Definir easing/transição como Constante.
6. Mover a bolinha da curva para criar uma curva exagerada.
7. Confirmar que a velocidade temporal continua constante.
8. Trocar easing para Acelerar.
9. Mover a bolinha da curva.
10. Confirmar que o easing continua Acelerar, sem ser substituído pela curva.
11. Trocar easing para Desacelerar.
12. Mover a bolinha da curva.
13. Confirmar que o easing continua Desacelerar.
14. Trocar easing para Suavizar.
15. Mover a bolinha da curva.
16. Confirmar que o easing continua Suavizar.
17. Inserir frame dentro da curva.
18. Confirmar que o novo frame nasce na curva.
19. Mover o frame inserido.
20. Confirmar que a curva não vira reta.
21. Rodar preview.
22. Exportar MP4.
23. Salvar JSON.
24. Reabrir JSON.
25. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b15z — Frame menu hierarchy and duration panel fixes

Foco: validar a paridade visual real dos sliders, a ausência de nested
scroll, a faixa de frames sempre visível e a navegação estilo CapCut.

### Versão

1. Abrir o app.
2. Abrir o menu de configurações (engrenagem).
3. Confirmar: **Arco v8z4b15z — Frame menu hierarchy and duration panel
   fixes**.

### Painel Duração — sliders com mesma largura útil

4. Abrir **Duração** na toolbar.
5. Expandir **Segmentos** e **Pausas por frame**.
6. Confirmar que o slider **Total** (segmentos), o slider **Tudo**
   (pausas) e os sliders individuais (`1-2`, `2-3`, `F1`, `F2`...)
   percorrem **a mesma largura útil**.
7. Em iPhone, confirmar que o thumb das pausas vai do início ao fim da
   faixa sem parecer "preso a um container estreito".
8. Comparar a posição inicial do thumb no slider "Total" com a do
   slider "Tudo" — devem começar exatamente no mesmo X.

### Sem nested scroll

9. Com Segmentos e Pausas expandidas, confirmar que **só** o painel
   Duração rola verticalmente.
10. Tentar fazer scroll dentro da lista de segmentos / lista de pausas
    — não pode haver scroll local.
11. Mesmo com 30 frames criados, confirmar uma única superfície de
    rolagem.

### Acabamento — espaçamento

12. Expandir **Acabamento**.
13. Confirmar respiro entre o título "Acabamento" e a linha de chips
    Nenhum/Loop/Pausa final (`padding-top:28px`).
14. Selecionar **Loop** e confirmar que o slider "Retorno" tem a mesma
    largura útil dos sliders de Segmentos/Pausas.

### "Tudo" como estado global real

15. Mover o slider "Tudo" para 1.5s. Confirmar que F1, F2, F3...
    recebem 1.5s.
16. Mover só o slider F2 para 0.5s. Confirmar que o slider "Tudo"
    fica cinza/dessaturado e o valor exibe "—".
17. Mover "Tudo" novamente. Confirmar que **todos** os frames recebem
    o novo valor e o estado misto sai.

### Faixa de frames sempre visível

18. Tocar em um frame na faixa para abrir o menu local.
19. Confirmar que a faixa de frames continua **visível acima** do
    menu local — não some, não é sobreposta, não é deslocada.
20. Confirmar que a toolbar inferior sumiu (foi substituída pelo menu
    local).
21. Tocar em outro frame — confirmar troca de seleção sem fechar o
    menu local.

### Navegação CapCut

22. Com o menu local aberto em compact-mode (só ícones), confirmar
    que **não** há texto "Voltar" nem botão ✕.
23. Tocar no ícone **Escala** — confirmar expansão dos controles e
    aparição da seta de voltar grande à esquerda, sem texto.
24. Tocar na seta — confirmar volta ao compact-mode preservando a aba
    "Escala" como ativa.
25. Tocar fora do menu (no stage) — confirmar fechamento total.
26. Selecionar 2 frames. Confirmar que `#alignBar` aparece com seta
    de voltar à esquerda (sem ✕). Tocar a seta — confirma saída da
    multiseleção.

### Preview e export — não-regressão

27. Rodar Preview com pausas individuais distintas (F1=0.5s, F2=1s,
    F3=1.5s).
28. Confirmar que a duração total e as pausas tocam corretamente.
29. Gerar MP4 e confirmar que não há trancos/kicks e que pausas estão
    no MP4.
30. Salvar projeto JSON e reabrir. Confirmar que durações e pausas
    persistem.
31. Repetir 27-30 no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b15w — Duration panel UX unification and local frame panel redesign

Foco: validar a reorganização do painel Duração e o redesign do painel
local sem regressões nos valores/sincronização.

### Painel Duração — topo

1. Abrir o app.
2. Confirmar versão no menu: **Arco v8z4b15w — Duration panel UX
   unification and local frame panel redesign**.
3. Carregar imagem.
4. Abrir o painel **Duração** (toolbar).
5. Confirmar topo só com leitura: número grande de Duração total +
   card com Duração total, Segmentos, Pausas, Acabamento.
6. Confirmar que **não há slider nem input editável** acima do card.

### Painel Duração — seção Segmentos

7. Expandir a seção **Segmentos**.
8. Mover o slider "Total segs" e confirmar:
   - sliders individuais redistribuem proporcionalmente;
   - card do topo atualiza Segmentos / Duração total;
   - chip "Duração" da toolbar inferior atualiza.
9. Alterar o input **Intervalo padrão**, criar novos frames e confirmar
   que cada novo segmento usa esse valor.
10. Mover sliders individuais e confirmar que o card do topo reflete
    a nova soma de Segmentos.
11. Apertar **Igualar intervalos** e confirmar redistribuição igual.

### Painel Duração — seção Pausas por frame

12. Expandir a seção **Pausas por frame**.
13. Mover o slider **Tudo** (global) e confirmar:
    - todos os sliders por frame movem juntos;
    - labels (`F1`, `F2`, ...) atualizam em tempo real;
    - card do topo atualiza Pausas / Duração total;
    - chip "Duração" da toolbar atualiza.
14. Mover só o slider de F2; confirmar que o label global mostra `*`
    indicando divergência.
15. Apertar **Aplicar a todos**; confirmar que o `*` some, todos os
    frames recebem o valor global e o card do topo atualiza.
16. No iPhone/Safari, scrollar a lista de pausas verticalmente e
    confirmar que **o scroll funciona sem alterar valores**.
17. Tocar rapidamente em um slider de pausa e confirmar que o valor muda
    sem sequestrar o scroll.

### Painel local do frame — controles em cima, ícones embaixo

18. Tocar em um frame ativo para abrir o `custBar`.
19. Confirmar **modo compacto inicial**: só a barra de ícones embaixo,
    sem controles visíveis acima.
20. Tocar no ícone de **escala**; confirmar que os controles abrem
    **acima** dos ícones.
21. Tocar no ícone de **rotação**; confirmar troca de aba sem fechar.
22. Tocar no ícone de **posição**; idem.
23. Tocar no novo ícone **relógio** (duração/pausa local); confirmar
    que o slider atualiza para o valor do frame ativo.
24. Tocar **de novo** no ícone ativo; confirmar que recolhe para modo
    compacto.
25. Confirmar que **não há mais o cadeado global** (globe-lock) na
    barra de ícones.
26. Mover o slider local de pausa; confirmar que o valor reflete no
    painel Duração e no chip da toolbar.

### Sincronização e arquitetura preservada

27. Editar pausas via slider global, slider individual e slider local —
    confirmar que todos chegam ao mesmo estado.
28. Adicionar e remover frames; confirmar que `framePauses` mantém
    tamanho correto e nada quebra.
29. Salvar projeto JSON.
30. Recarregar app, abrir projeto JSON.
31. Confirmar que todas as pausas voltam corretamente.
32. Rodar **Preview** — confirmar timing igual ao esperado.
33. Exportar **MP4** — confirmar timing e ausência de trancos.
34. Repetir cenário em iPhone/Safari via GitHub Pages com cache busting.

## v8z4b3 — Inserted frame pass-through easing

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b3 — Inserted frame pass-through easing**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Definir easing entre F1 e F2 como Constante.
6. Editar a curva.
7. Inserir novo frame.
8. Confirmar que o movimento passa pelo novo frame sem pausa/easing extra.
9. Repetir com Acelerar.
10. Repetir com Desacelerar.
11. Repetir com Suavizar.
12. Confirmar que o easing não é duplicado nos dois novos segmentos.
13. Confirmar que o frame inserido continua na curva.
14. Mover o frame inserido e confirmar que a curva não vira reta.
15. Rodar preview.
16. Exportar MP4.
17. Salvar JSON.
18. Reabrir JSON.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.

