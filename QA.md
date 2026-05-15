# QA Checklist

Use depois de qualquer alteração, mesmo pequena.

## v8z4b17a — rotation easing engine foundation

### Teste A — Projeto básico com rotação

1. Carregar imagem.
2. Criar 3 frames.
3. Aplicar rotações diferentes em F1, F2 e F3 (ex.: 0°, +180°, −90°).
4. Abrir Preview → animação roda sem travamento, NaN ou rotação errada.
5. Gerar MP4 → arquivo gerado sem erro.

### Teste B — Inserir frame entre frames com rotação

1. Criar dois frames com rotações diferentes (ex.: 0° e +360°).
2. Inserir frame entre eles (botão +Frame ou long-press).
3. Confirmar que o app não quebra e `rotEasings` tem tamanho = frameCount−1.
4. Preview OK; MP4 OK.

### Teste C — Remover frame intermediário

1. Criar 4 frames com rotações distintas.
2. Remover um frame intermediário.
3. Confirmar que `rotEasings.length === frameCount−1` (verificar via console se necessário).
4. Preview OK; MP4 OK.

### Teste D — Save/Load JSON com rotEasings

1. Criar projeto com rotações e salvar como JSON.
2. Reabrir o JSON.
3. Confirmar que frames, rotações e `rotEasings` estão presentes e válidos.
4. Preview OK.

### Teste E — Compatibilidade com projeto antigo (sem rotEasings)

1. Abrir um JSON antigo que não contém o campo `rotEasings`.
2. Confirmar que o app não lança erro e preenche `rotEasings` com `'linear'`.
3. Preview OK; MP4 OK.

### Teste F — Versão visível

1. Topbar → Configurações → confirmar `Arco v8z4b17a`.
2. Em `CHANGELOG.md`, primeira entrada é v8z4b17a.
3. Em `pages-deploy-stamp.txt`, stamp é v8z4b17a.
4. Buscar no `index.html` por "Versão:" — apenas v8z4b17a no cabeçalho.

### Teste G — Regressão geral

1. Posição, escala, curvas e easing de movimento continuam funcionando.
2. Não há NaN, undefined ou travamento no console.
3. Undo/redo funciona normalmente (rotEasings é preservado no undo).

## v8z4b16m — gap final slider/botões nos submenus de transformação (iPhone/Safari obrigatório)

### A. Respiro entre slider e botões

1. Carregar imagem; criar 3 frames.
2. Tocar num frame → abrir submenu **Escala**.
3. Confirmar: há respiro claro e visível entre a linha do slider e a
   linha de botões (−5% / +5% / Reset). A bolinha do slider **não
   encosta nem cavalga** nos botões.
4. Repetir para **Rotação** e **Pausa**.
5. Tocar no Voltar → recolhe para compact-mode. Repetir a abertura
   para confirmar que o gap persiste.

### B. Faixa de frames continua fixa

1. Abrir Escala → confirmar que a faixa de frames **não se move**.
2. Abrir Rotação → idem.
3. Abrir Pausa → idem.
4. Em nenhum estado a faixa de frames deve subir ou descer.

### C. Nenhum controle invade a Home Bar

1. Com submenu aberto, confirmar que a linha de botões (−5/+5/Reset)
   fica acima do indicador de Home com folga visível.
2. Confirmar que nada toca ou atravessa o Home Bar.

### D. Preview e Gerar MP4 (não podem ter regredido)

1. Carregar imagem; criar 3 frames; tocar **Preview** → roda normal.
2. Tocar **Voltar** no Preview → volta ao Stage sem tela preta.
3. Tocar **Salvar MP4** → arquivo gerado normalmente.
4. Aplicar pequena edição → tocar **Salvar MP4** de novo → segundo
   arquivo gerado sem botão preso.

### E. Versão visível

1. Topbar → Configurações → confirmar `Arco v8z4b16m`.
2. Em `CHANGELOG.md`, primeira entrada é v8z4b16m.
3. Em `pages-deploy-stamp.txt`, stamp é v8z4b16m.
4. Buscar no `index.html` por "Versão:" — apenas v8z4b16m no cabeçalho.

## v8z4b16j — Faixa de frames fixa, sliders inteiros, escala livre (iPhone/Safari obrigatório)

### A. Faixa de frames fixa em todos os estados

1. Carregar imagem; criar 3 frames.
2. Tocar num frame → menu contextual abre em compact-mode.
3. Tocar em **Pausa** → submenu expande. Confirmar: a faixa de frames
   NÃO sobe nem desce, permanece exatamente no mesmo lugar.
4. Tocar no Voltar (coluna estreita) → recolhe. Faixa de frames continua
   no mesmo lugar.
5. Repetir para **Rotação**, **Escala** e **Posição**.
6. Confirmar: em nenhum estado a faixa de frames se move.

### B. Sliders dos submenus de transformação com thumb inteiro

1. Abrir o submenu **Escala** → confirmar que a bolinha/thumb do slider
   aparece INTEIRA acima do track, sem corte superior pelo limite da
   faixa de frames.
2. Abrir o submenu **Rotação** → mesmo teste, thumb inteiro visível.
3. Abrir o submenu **Pausa** → mesmo teste, thumb inteiro visível.
4. Abrir o submenu **Posição** → confirmar que as colunas X e Y (input
   + setas) não estão cortadas e ficam visualmente acima da Home Bar.

### C. Escala livre além da imagem

1. Abrir o submenu **Escala**.
2. Arrastar o slider até o máximo (300%) → o frame deve aumentar além
   dos limites visuais da imagem/stage, SEM travar em ~98% do stage.
3. Tocar **+5%** repetidamente → frame continua crescendo livremente.
4. Tocar **−5%** → frame diminui normalmente, sem ficar abaixo do
   mínimo prático (40px).
5. Tocar **Reset** → frame volta à largura de referência (baseFrameW).
6. Em `Configurações → Conter na imagem: Sim`, repetir o teste — agora
   o frame respeita os limites (comportamento intencional, igual antes).

### D. Espaçamento entre ícone e nome no menu contextual

1. Tocar num frame para abrir o menu contextual em compact-mode.
2. Observar Pausa, Rotação, Escala, Posição.
3. Confirmar: o espaço vertical entre o ícone e o texto está
   claramente maior (mais respirado) que na v8z4b16i.
4. Confirmar: nenhum ícone, texto ou cor mudou — só o gap.

### E. Bloco inferior mais baixo

1. Observar a toolbar inferior em estado normal (sem submenu aberto).
2. Confirmar: ícones/textos descem alguns pixels em relação à v8z4b16i,
   ficando mais próximos da Home Bar.
3. Confirmar: NENHUM elemento toca/atravessa o indicador da Home Bar
   nem reintroduziu degradê/fade/sombra falsa de rodapé.
4. Abrir Pausa/Rotação/Escala/Posição — slider/chips também descem
   levemente, mantendo folga segura acima da Home Bar.

### F. Segurança Preview / MP4 (não pode ter regredido)

1. Carregar imagem; criar 3 frames; tocar **Preview** → roda normal.
2. Tocar **Voltar** no Preview → volta ao Stage sem tela preta.
3. Tocar **Salvar MP4** (Gerar) → arquivo gerado normalmente.
4. Aplicar pequena edição (rotação ou pausa) → tocar **Salvar MP4** de
   novo → segundo arquivo gerado sem botão preso.

### G. Botão Voltar (NÃO alterado)

1. Confirmar: o trilho lateral do `#custBarBack` continua com 44px de
   largura, ícone 26×26 e stroke 2.6 — IGUAL à v8z4b16i.
2. Confirmar: o `Voltar` do `alignBar` e o `Voltar` do Preview também
   permanecem inalterados.

### H. Versão visível

1. Topbar → Configurações → confirmar `Arco v8z4b16j`.
2. Em `CHANGELOG.md`, primeira entrada cronológica é v8z4b16j;
   v8z4b16i permanece como histórico.
3. Em `pages-deploy-stamp.txt`, stamp deve ser `v8z4b16j`.
4. Buscar no `index.html` por "Versão:" — apenas v8z4b16j aparece como
   versão atual no cabeçalho/comentário superior.

## v8z4b16g — UX state cleanup + Voltar padronizado (iPhone/Safari obrigatório)

### A. Estado visual do menu de frames (bug do destaque preso)

1. Carregar imagem.
2. Tocar num frame → menu contextual abre em `compact-mode` (apenas
   barra de ícones).
3. Confirmar: **nenhum ícone aparece aceso/destacado** logo na primeira
   abertura (antes, Escala aparecia destacado).
4. Tocar em **Rotação** → submenu expande; o ícone Rotação agora acende
   em ciano (estado legítimo de submenu aberto).
5. Tocar no botão **Voltar** (coluna estreita à esquerda do submenu) →
   recolhe para `compact-mode`.
6. Confirmar: **nenhum ícone fica aceso após o Voltar**.
7. Tocar fora do menu (em qualquer área vazia do stage) → menu inteiro
   fecha.
8. Reabrir o menu (tocar num frame) → confirmar: nenhum ícone fica aceso
   apenas por ter sido o último usado. **(bug do v8z4b16f corrigido)**
9. Repetir com **Pausa**, **Escala** e **Posição**.

### B. Botão Voltar como coluna lateral

1. Abrir submenu de Rotação.
2. Confirmar layout: chevron estreito à esquerda + slider + chip de
   reset à direita, todos na mesma linha visual.
3. Confirmar: o submenu NÃO tem mais o header horizontal acima do
   slider; recuperou ~22px de altura útil.
4. Tocar no chevron → recolhe para `compact-mode` (mesmo comportamento
   de antes).
5. Repetir em Pausa, Escala, Posição.

### C. Preview com Voltar (não mais X)

1. Carregar imagem; criar 3 frames.
2. Tocar **Preview** (play da toolbar).
3. Confirmar no rodapé do Preview: o botão da esquerda agora é
   `Voltar` + chevron para a esquerda (não mais `Fechar` + X).
4. Tocar no Voltar → Preview fecha e volta ao Stage. Mesmo
   comportamento de antes.
5. Confirmar Play/Pause central e botão Salvar MP4 inalterados.

### D. Regressões (NÃO podem ter quebrado)

1. Abrir/fechar Preview com rotação aplicada → roda normal.
2. Salvar MP4 → arquivo gerado, sem tela preta, sem botão vermelho
   preso.
3. Painéis flutuantes (Template, Formato, Duração, Easing, Suavidade,
   Cor de fundo): seguem abrindo/fechando pelo handle do topo, sem
   mudança de layout.
4. Reset (botão circular no topbar) continua resetando tudo.
5. Seleção múltipla / AlignBar: Voltar primário e submenu Alinhar
   intactos.

### E. Versão visível

1. Topbar → Configurações → confirmar `Arco v8z4b16g`.
2. Em `CHANGELOG.md`, a primeira entrada cronológica deve ser
   v8z4b16g; v8z4b16f continua presente como histórico.
3. Em `pages-deploy-stamp.txt`, stamp deve ser `v8z4b16g`.
4. Buscar no `index.html` por "atual" — nenhuma referência a v8z3q,
   v8z3v, v8z4b16e ou v8z4b16f deve aparecer marcada como versão
   atual.

## v8z4b16f — Rodapé sólido, submenu compacto, faixa ciano sincronizada (iPhone/Safari obrigatório)

### A. Rodapé sem degradê

1. Carregar imagem.
2. Observar a barra inferior em estado normal (toolbar, sem painel aberto).
3. Confirmar: nenhum degradê / fade escuro subindo do rodapé.
4. Confirmar: o fundo da barra é sólido até a base da tela.
5. Confirmar: botões da toolbar continuam visíveis e seguros acima da
   Home Bar (clearance ≥ ~14px sobre o indicador).
6. Abrir e fechar o painel **Duração** uma vez; observar a transição —
   ao fechar, NÃO sobra halo / sombra residual no rodapé.

### B. Submenus contextuais compactos

1. Tocar em um frame para abrir o menu contextual (compact-mode com
   ícones).
2. Tocar em **Pausa**:
   - Submenu abre compacto (~110px sobre a safe-area).
   - Chevron de voltar à esquerda no topo, em faixa estreita (~22px de
     altura).
   - Slider e chip Reset abaixo, sem espaço morto vertical exagerado.
3. Tocar no chevron de voltar → volta ao compact-mode (ícones), sem
   fechar o menu inteiro.
4. Tocar em **Rotação** → mesmo padrão compacto.
5. Tocar em **Escala** → mesmo padrão.
6. Tocar em **Posição** → header compacto + dois pares de inputs X/Y.
7. Tocar fora do menu (no stage) → fecha completamente. Sem tranco no
   stage em nenhuma das transições acima.

### C. Faixa ciano dos sliders

1. Tocar em um frame; abrir o painel contextual de Trecho (Seg. X-Y) via
   pill de easing.
2. Mover o slider de duração para **0.0s**.
3. Confirmar:
   - Bolinha do slider está no início (esquerda).
   - Faixa ciano também está no início — não fica preenchida até o meio.
4. Mudar o valor para 2.0s, depois 4.0s, depois 8.0s.
5. Confirmar que a faixa ciano acompanha a bolinha em cada valor.
6. Abrir **Duração** (painel principal); olhar slider **TOTAL** de Trechos
   e os individuais de "Tempo por trecho" — faixas devem refletir os
   valores atuais (não stale).
7. Voltar ao menu contextual, abrir **Pausa**, mexer no slider de pausa.
   Faixa ciano acompanha a bolinha.

### D. Regressão MP4 (NÃO pode ter quebrado)

1. Carregar imagem; criar 3 frames com easings variados.
2. Tocar **Preview** — confirma que roda.
3. Tocar **Salvar MP4** — confirmar arquivo gerado, sem tela preta, sem
   botão vermelho preso.
4. Voltar à edição; mover um frame.
5. Tocar **Salvar MP4** de novo — segunda geração também funciona.

### E. Regressão visual

1. Versão visível em Configurações deve mostrar `v8z4b16f`.
2. Hierarquia tipográfica do painel Duração (Trechos / Pausas /
   Acabamento) inalterada.
3. Seleção múltipla / AlignBar inalterada.
4. Tempo mínimo 0.0s segue aceito em trechos e pausas.

## v8z4b16d — Recuperação do Gerar MP4 (iPhone/Safari obrigatório)

### A. Teste básico

1. Carregar imagem.
2. Criar 3 frames.
3. Tocar Preview e confirmar que roda.
4. Tocar **Salvar MP4**.
5. Confirmar que o MP4 é gerado (overlay "Vídeo pronto!" aparece).
6. Confirmar que a tela **não fica preta** durante geração — overlay
   com spinner e progress está visível, animação volta após salvar.
7. Confirmar que o botão **para de piscar vermelho** ao concluir.

### B. Teste com tempos

1. Alterar duração de um trecho.
2. Inserir um trecho com 0.0s.
3. Inserir pausas em alguns frames.
4. Gerar MP4 — arquivo válido, sem loop infinito, sem travamento.

### C. Teste após edição prolongada

1. Mover frames, escalar, rotacionar.
2. Abrir e fechar menu contextual.
3. Abrir painel Duração e fechar.
4. Gerar MP4 — sem tela preta após qualquer um desses passos.

### D. Teste de recuperação de erro (forçado)

1. Em DevTools, simular falha do encoder (ex.: throw em
   `VideoEncoder.isConfigSupported` ou cortar `imgEl.src`).
2. Tocar Salvar MP4.
3. Confirmar que:
   - app **sai** do estado de gravação automaticamente;
   - `previewScreen` fecha — sem overlay preto persistente;
   - botão volta a "Salvar MP4" sem classe `recording`;
   - `showStatus` exibe mensagem clara;
   - `console.error`/`console.warn` registra o erro com contexto;
   - usuário pode tocar Salvar MP4 de novo (não fica preso em
     `isRecording=true`).

### E. Teste de pré-condição

1. Antes da imagem carregar, tocar Salvar MP4 → status "Imagem ainda
   não carregada", **sem** entrar em recording, **sem** previewScreen.
2. Com duração total 0 (zerando todos os trechos) tocar Salvar MP4 →
   status "Duração total inválida", sem entrar em recording.

### Não regressões

- Menu contextual sem tranco no stage.
- Fechar menu contextual tocando no stage.
- Apenas Pausa / Rotação / Escala / Posição no menu contextual.
- Hierarquia visual do painel Duração/Tempo.
- Nomenclatura Trechos.
- Seleção múltipla / AlignBar.
- Tempo mínimo 0.0s.
- Scroll do painel Duração/Tempo.
- Handle fixo do painel.
- Motor de animação, easing, JSON, templates.

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

## v8z4b16c — Stage stability, bottom slot and visual hierarchy

Foco: validar correções da revisão da v8z4b16b — tranco do stage,
fechamento do menu contextual em qualquer área do stage, degradê
inferior, hierarquia tipográfica do painel Duração, nomenclatura
"Trechos" e redesign visual da caixa de seleção múltipla. Itens já
validados na v8z4b16b (sincronização, handle sticky, tempo 0.0s,
preview/export, sliders subordinados) NÃO devem ter regredido.

### Versão

1. Abrir o app no iPhone/Safari (GitHub Pages com cache busting).
2. Abrir o menu de configurações (engrenagem).
3. Confirmar: **Arco v8z4b16c — Stage stability, bottom slot and
   visual hierarchy**.

### Estabilidade do stage ao abrir o menu contextual

4. Carregar uma imagem com pelo menos 2 frames.
5. Observar a posição vertical da imagem/stage com a toolbar
   inferior visível.
6. Tocar em F1 (ou no frame ativo) para abrir o menu contextual em
   modo compacto.
7. Confirmar que a imagem/stage **não dá nenhum salto vertical** ao
   abrir o menu. A faixa de frames também não se move.
8. Fechar o menu (tocando no stage). Confirmar que ao voltar para a
   toolbar normal o stage permanece imóvel.
9. Abrir/fechar o menu várias vezes em sequência. Confirmar zero
   reflow perceptível.

### Fechar menu contextual em qualquer área vazia do stage

10. Com menu contextual aberto, tocar **na imagem** dentro do stage:
    deve fechar.
11. Reabrir o menu. Tocar no **fundo preto** da área de edição
    (.image-area) fora da imagem: deve fechar.
12. Reabrir o menu. Tocar na **área vazia do canvas** (sobre o stage
    mas sem imagem): deve fechar.
13. Reabrir o menu. Tocar nos **botões/ícones do menu** (Pausa,
    Rotação, Escala, Posição): **não** deve fechar.
14. Tocar nos **sliders** do menu expandido: **não** deve fechar.
15. Tocar nos **handles** do frame ativo ou nas bolinhas de Bézier:
    **não** deve fechar.
16. Tocar na **faixa de frames** (#midBar): **não** deve fechar.

### Itens do menu contextual

17. Confirmar que os ícones presentes são, e somente:
    - Pausa
    - Rotação
    - Escala
    - Posição
18. Confirmar ausência de Curvas, Adicionar, easing e funções extras.

### Barra inferior — degradê e safe area

19. Observar a barra inferior (toolbar e menu contextual).
20. Confirmar que **não existe degradê escuro** acima da barra
    invadindo o stage.
21. Confirmar que o fundo da barra é **sólido e contínuo até o fim
    da tela** (até a Home Bar do iPhone).
22. Confirmar que não há faixa morta/vazia abaixo dos botões/textos.
23. Confirmar que os botões continuam **acima da Home Bar** com
    folga mínima de toque.

### Barra inferior — compactação visual

24. Confirmar que botões e textos da toolbar começam **mais baixos**
    do que antes (sobra superior reduzida).
25. Confirmar que o menu contextual em modo compacto repete o mesmo
    padrão visual (ícones e labels alinhados ao fim).
26. Confirmar que a altura total da barra **não aumentou**.

### Painel Duração — hierarquia tipográfica

27. Abrir painel Duração.
28. Confirmar que os três títulos principais — **Trechos**, **Pausas
    por frame**, **Acabamento** — aparecem com mesmo corpo, peso e
    cor (17px, bold, branco/cor principal). Visualmente equivalentes.
29. Confirmar que os subtítulos internos (**INTERVALO PADRÃO**,
    **TOTAL**, **TEMPO POR TRECHO**, **PAUSA POR FRAME**, **TUDO**,
    **RETORNO**, **DURAÇÃO**) aparecem menores, em uppercase, com
    letter-spacing discreto e cor cinza. Subordinados aos títulos.

### Nomenclatura

30. Confirmar que no painel Duração não aparece mais "Segmentos".
31. Confirmar que aparece **Trechos** como cabeçalho da seção.
32. Confirmar que aparece **Tempo por trecho** como subtítulo dos
    sliders individuais.
33. Confirmar que o resumo do topo mostra **Tempo dos trechos** em
    vez de "Segmentos".

### Caixa de seleção múltipla / alinhamento

34. Selecionar 2 ou mais frames (toque longo).
35. Confirmar que a caixa contextual aparece **por cima** sem
    empurrar o stage.
36. Confirmar layout primário: contador (número) · **Alinhar** ·
    **Distribuir** · **Escala**.
37. Confirmar que o visual usa o mesmo padrão do menu contextual de
    frames (fundo sólido, mesmo slot inferior, ícones centralizados
    acima de labels curtos, espaçamento limpo, sem amontoamento).
38. Tocar em **Alinhar**. Confirmar que abre o submenu com 6 alvos
    (Esq · Centro H · Dir · Topo · Centro V · Base) + botão Voltar.
39. Confirmar que **Centro H** e **Centro V** funcionam (frames
    alinhados horizontal/verticalmente como antes).
40. Confirmar que **Esq, Dir, Topo, Base** aparecem desabilitados
    visualmente (sem criar lógica nova nesta versão).
41. Tocar em Voltar no submenu. Confirmar que volta à camada primária.
42. Tocar no botão "Voltar" (chevron à esquerda) na camada primária.
43. Confirmar que limpa a seleção múltipla e fecha a caixa.

### Já validado na v8z4b16b — não pode ter regredido

44. Sliders individuais subordinados ao global continuam **totalmente
    cinzas** (track + thumb).
45. Handle superior do painel Duração continua **fixo** ao rolar.
46. Tempo mínimo de trecho funciona em **0.0s**.
47. Sincronização painel Duração ↔ menu contextual continua válida.
48. Scroll do painel Duração sem scroll interno indevido.
49. Preview MP4 estável.
50. Export MP4 estável.

### Não pode ter regredido (geral)

51. Lógica de tempo global, cálculo de tempo total, easing, curvas,
    escala, rotação, posição: inalterados.
52. Templates, cores, layout geral aprovado, ícones fora do escopo:
    inalterados.

### Critério de aceite

A v8z4b16c deve fechar todos os pontos da revisão da v8z4b16b sem
mexer no que já estava OK. Após teste manual completo, fica pronta
para promoção ao app principal.

## v8z4b16b — Stabilize contextual menu and zero-second segments

Foco: validar correções pontuais sobre a v8z4b16a — menu contextual
sem Curvas/Adicionar e com altura idêntica à toolbar, thumbs cinzas
quando o global está ativo, handle do painel Tempo fixo ao rolar, e
suporte a trecho/intervalo de 0.0s sem quebrar preview/export.

### Versão

1. Abrir o app.
2. Abrir o menu de configurações (engrenagem).
3. Confirmar: **Arco v8z4b16b — Stabilize contextual menu and
   zero-second segments**.

### Menu contextual — altura idêntica à toolbar

4. Sem tocar em nenhum frame, observar a altura do menu inferior
   principal (toolbar).
5. Tocar num frame para abrir o menu contextual em modo compacto.
6. Confirmar que o topo da faixa contextual fica **na mesma posição**
   do topo da toolbar — o stage não se mexe, encolhe ou desloca.
7. Confirmar que a faixa de frames continua visível acima do menu
   contextual.

### Menu contextual — itens e ações rápidas

8. Confirmar que os ícones presentes são, e somente:
   - Pausa
   - Rotação
   - Escala
   - Posição
9. Confirmar que **não existe** o ícone Curvas.
10. Confirmar que **não existe** o ícone Adicionar.
11. Tocar fora do menu contextual (no stage). Confirmar que ele fecha
    e a toolbar inferior volta ao normal.
12. Tocar de novo no mesmo frame. Confirmar que o menu contextual
    reabre.
13. Tocar em outro frame. Confirmar que o app não fica preso no
    submenu do frame anterior (a aba/conteúdo expandido fecha, ou ao
    menos passa a refletir o novo frame).

### Submenu local de pausa / ajustes do frame

14. Abrir submenu Pausa local. Confirmar que mostra slider + valor +
    Reset, sem texto "Frame F10 / Duração pausa neste frame".
15. Confirmar que pausa local, rotação, escala e posição continuam
    funcionando.
16. Confirmar sincronização com painel Duração ao alterar a pausa.

### Sliders — estado global "Tudo"

17. Abrir painel Duração → Pausas por frame.
18. Mover o slider **Tudo** para um valor diferente de zero.
19. Confirmar que **todas** as faixas individuais ficaram cinzas,
    incluindo o **thumb/bolinha** (não brancos).
20. Mover um slider individual. Confirmar que ele "reativa"
    visualmente (cyan/normal) e os demais voltam para o estado
    cinza/subordinado correto conforme a sincronização real.
21. Confirmar que o painel local (menu contextual → Pausa) e o
    painel Duração continuam sincronizados após qualquer mudança.

### Handle superior do painel

22. Abrir painel Duração.
23. Rolar verticalmente até o final.
24. Confirmar que o tracinho/handle no topo permanece **fixo** no
    topo do painel ao rolar, sem deslocar e sem desaparecer.
25. Confirmar que não há um segundo scroll interno; a única rolagem
    vertical é a do painel principal.

### Trecho / intervalo mínimo 0.0s

26. Painel Duração → Segmentos.
27. Mover o slider de "Total" todo para a esquerda. Confirmar que
    chega em **0.0s** sem barrar em 1s/0.5s/0.1s.
28. Confirmar que todos os sliders individuais de segmento foram
    para **0.0s** e os rótulos mostram corretamente "0.0s".
29. Subir o "Total" novamente. Confirmar que os trechos são
    redistribuídos igualmente (não houve proporção anterior válida).
30. Mover apenas o segmento 1-2 para **0.0s**, deixando os demais
    com valor positivo. Rodar Preview. Confirmar que entre F1 e F2 há
    corte seco (pulo instantâneo) e os demais segmentos continuam
    com movimento.
31. Inverter: 1-2 em 2.0s, 2-3 em 0.0s. Preview deve mostrar
    movimento no primeiro trecho e corte seco no segundo.
32. Colocar vários trechos 0.0s seguidos. Confirmar que o preview não
    trava nem pisca de forma anômala.
33. Todos os trechos em 0.0s **com pausas por frame** ativas. Preview
    deve rodar normalmente, somente pausando nos frames.
34. Todos os trechos em 0.0s **sem pausas** e sem acabamento. Preview
    deve permanecer em estado estático seguro, sem travar nem dar NaN.
35. Definir "Intervalo padrão" como **0** e adicionar um novo frame.
    Confirmar que o frame nasce com tempo padrão 0 sem erro.
36. Em Sliders → Acabamento, confirmar que Retorno (loop) e Duração
    (pausa final) **ainda têm mínimo 0.1s** (clamp não foi tocado).
37. Exportar MP4 com pelo menos um trecho 0.0s. Confirmar que o
    export conclui sem travar e o arquivo é reproduzível.
38. Exportar MP4 com **todos** os trechos em 0.0s e sem pausas/loop.
    Confirmar que o export gera ao menos um frame e não trava.

### Não pode ter regredido

39. Easing de segmento, curvas, blur, escala/rotação por frame:
    inalterados.
40. WebCodecs/export comum (com durações > 0): inalterado.
41. Layout geral, cores, templates, textos fora do escopo: inalterados.

### iPhone/Safari

42. Repetir o checklist acima no iPhone/Safari via GitHub Pages com
    cache busting.

### Critério de aceite

A versão v8z4b16b deve ficar estável o suficiente para, depois de
teste manual completo, ser promovida do `arco-app-test` para o app
principal.

## v8z4b16a — Mobile UI consolidation: contextual menu, sliders, duration panel

Foco: validar a paridade de altura entre menu contextual e toolbar,
ordem nova das abas, sliders com faixa ativa cyan, painel Duração com
hierarquia limpa, sliders individuais subordinados ao "Tudo", invasão
visual da safe area e que nada da engine de animação foi tocado.

### Versão

1. Abrir o app.
2. Abrir o menu de configurações (engrenagem).
3. Confirmar: **Arco v8z4b16a — Mobile UI consolidation**.

### Menu contextual — altura idêntica à toolbar

4. Sem tocar em nenhum frame, conferir a altura da toolbar inferior.
5. Tocar num frame para abrir o menu contextual em modo compacto.
6. Confirmar que a faixa do menu contextual ocupa **exatamente** a
   mesma altura total da toolbar (parece pura troca de conteúdo, sem
   invasão extra do stage, sem wrapper extra).
7. Expandir uma função (ex. Escala). Confirmar que a altura do bloco
   expandido também respeita o safe-area-inset-bottom igual à toolbar.

### Menu contextual — ordem e ações rápidas

8. Em modo compacto, confirmar a ordem exata das abas:
   **Pausa, Rotação, Escala, Posição, Curvas, Adicionar**.
9. Tocar em **Curvas**: o menu contextual fecha e o painel de easing
   do segmento seguinte abre.
10. Reabrir o contextual num frame e tocar em **Adicionar**:
    confirmar que um frame é inserido após o ativo e o contextual
    fecha.
11. Tocar na aba **Pausa**: confirmar que o submenu mostra **apenas**
    slider + valor + Reset. Sem rótulo "Frame F1", sem texto
    "Duração/pausa neste frame".
12. Tocar fora (stage) durante o submenu: confirmar que tudo fecha e
    a toolbar inferior reaparece (não exige múltiplos "voltar").
13. Tocar em outro frame com o contextual aberto: confirmar que o
    menu troca para aquele frame sem fechar.

### Sliders — faixa ativa cyan

14. Abrir o painel **Duração** na toolbar e expandir Segmentos e
    Pausas por frame.
15. Confirmar visualmente que **todos** os sliders (Total, Tudo,
    individuais de segmento, individuais de pausa, Retorno do
    Acabamento) têm:
    - parte antes do thumb pintada de **cyan/turquesa**;
    - parte depois do thumb em **cinza escuro**;
    - sem glow exagerado.
16. Arrastar qualquer slider e confirmar que a faixa cyan acompanha
    em tempo real.
17. Abrir o menu contextual num frame → aba Pausa: o slider local
    também deve ter a mesma faixa cyan/cinza.

### Painel Duração — hierarquia limpa

18. Abrir o painel **Duração**.
19. Confirmar que apenas os cabeçalhos **Segmentos / Pausas por
    frame / Acabamento** têm linha divisória (border-bottom).
20. Dentro de cada bloco expandido, confirmar que NÃO há linhas
    horizontais entre os subitens — a leitura é contínua.
21. Confirmar que os subtítulos "Tempo por segmento" e "Pausa por
    frame" estão em tamanho menor (uppercase, cinza), claramente
    subordinados aos cabeçalhos.

### "Tudo" e individuais — sincronização visual

22. Com Pausas expandidas, mover o slider **Tudo** para 1.0s.
23. Confirmar que F1, F2, F3… recebem 1.0s.
24. Confirmar que os sliders individuais ficam **dessaturados** e os
    rótulos/valores em cinza claro (estado "sincronizado pelo
    global").
25. Mover o slider de F2 para 0.5s.
26. Confirmar que F2 volta ao contraste cheio, "Tudo" entra em estado
    misto/cinza, e os demais individuais voltam ao contraste cheio
    também (pois saímos do sincronismo).
27. Mover "Tudo" outra vez — todos voltam para o mesmo valor e os
    individuais voltam ao estado subordinado.

### Safe area inferior

28. No iPhone, comparar a toolbar com a versão anterior: a faixa
    preta acima da Home Bar deve estar visivelmente menor — o fundo
    da toolbar pinta até a Home Bar, mas os botões continuam acima
    dela.
29. Confirmar que nada foi cortado pela Home Bar (todos os botões
    permanecem clicáveis).

### Nada quebrado no motor

30. Rodar Preview — confirmar fluido, sem trancos.
31. Exportar MP4 — confirmar arquivo gerado normalmente.
32. Editar curva manualmente — confirmar que continua respondendo.
33. Salvar projeto JSON e reabrir — confirmar que tudo é restaurado.
34. Testar tudo no **iPhone/Safari** via GitHub Pages com cache
    busting.

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

