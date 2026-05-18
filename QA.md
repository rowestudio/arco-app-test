# QA Checklist

Use depois de qualquer alteração, mesmo pequena.

## v8z4b17x — fractional editor zoom and pan mode

### Teste A — posição do controle
1. Carregar imagem.
2. Confirmar que o controle `[-] [100%] [+]` aparece no canto **superior direito** do Stage (não na parte inferior).
3. Confirmar que não desloca os menus inferiores.
4. Confirmar que desaparece durante Preview.
5. Confirmar que reaparece após sair do Preview.
6. Confirmar que não aparece antes de carregar imagem.

### Teste B — zoom fracionado
1. Tocar em `[+]`. Confirmar 100% → 125%.
2. Tocar novamente. Confirmar 125% → 150%.
3. Continuar: 175%, 200%, 250%, 300%.
4. Em 300%, `[+]` fica desabilitado.
5. Tocar em `[−]`. Confirmar 300% → 250%.
6. Continuar reduzindo. Confirmar passos progressivos.
7. Em 100%, `[−]` fica desabilitado.
8. Confirmar que 2× não é mais o primeiro salto de 100%.

### Teste C — mover visão
1. Ativar zoom 125% ou maior.
2. Confirmar que o botão **Mover** aparece abaixo do controle de zoom.
3. Tocar em **Mover**. Confirmar que o botão fica azul (ativo).
4. Arrastar no Stage. Confirmar que a viewport se move.
5. Confirmar que nenhum frame se move.
6. Confirmar que nenhum ponto de curva se move.
7. Tocar em **Mover** novamente. Confirmar que desativa.
8. Arrastar no Stage. Confirmar que frames voltam a ser arrastáveis.

### Teste D — edição com zoom
1. Zoom em 125%.
2. Mover frame. Confirmar que acompanha corretamente o dedo.
3. Zoom em 150%.
4. Arrastar ponto de curva. Confirmar posição correta.
5. Zoom em 200%.
6. Repetir mover frame e ponto de curva. Confirmar sem deslocamento.

### Teste E — duplo toque
1. Dar duplo toque nos botões `[−]`, `[+]` e no indicador `100%`.
2. Confirmar que não troca frame nem aciona ação não esperada.
3. Ativar Mover visão.
4. Dar duplo toque no Stage.
5. Confirmar que não aciona troca/seleção de frame.
6. Desativar Mover visão.
7. Confirmar que o comportamento normal de duplo toque (se houver) volta.

### Teste F — indicador toca → resetar
1. Ativar zoom 150%, fazer pan.
2. Tocar no indicador de zoom (`150%`).
3. Confirmar que volta para 100% e pan é zerado.

### Teste G — botão Mover oculto em 100%
1. Em 100%, confirmar que o botão Mover não aparece.
2. Ativar 125%. Confirmar que aparece.
3. Reduzir para 100% via `[−]`. Confirmar que o botão desaparece.
4. Confirmar que `editorPanMode` foi desativado automaticamente.

### Teste H — Preview e MP4
1. Ativar zoom 200%. Fazer pan.
2. Rodar Preview. Confirmar que o Preview está correto e não ampliado.
3. Gerar MP4. Confirmar que o MP4 está correto.
4. Voltar do Preview. Confirmar que o controle de zoom ainda mostra 200%.

### Teste I — reset de zoom
1. Ativar 250%. Fazer pan.
2. Carregar nova imagem. Confirmar que zoom volta para 100% e pan para 0,0.
3. Ativar 175%.
4. Tocar em Reset (ícone no topo). Confirmar que zoom volta para 100%.

### Teste J — regressão geral
1. Movimento Inteligente continua funcionando.
2. Rotação Inteligente continua funcionando.
3. Escala Inteligente continua funcionando.
4. Velocidade constante continua funcionando.
5. Loop como trecho real continua funcionando.
6. Pausa final continua seguindo o último frame.
7. Load de projeto antigo/misto continua OK.
8. Trechos aparecem corretamente após load.
9. Resetar curva continua funcionando.
10. Sem tela preta.
11. Sem botão preso.
12. Sem NaN/Infinity no console.

---

## v8z4b17w — fixed editor zoom levels

### Teste A — comportamento em 1×
1. Abrir app.
2. Carregar imagem.
3. Confirmar que o Stage aparece igual ao comportamento anterior (sem zoom).
4. Mover frame. Confirmar que frame acompanha o dedo.
5. Arrastar ponto de controle de curva. Confirmar posição correta.
6. Preview OK.
7. MP4 OK.

### Teste B — zoom 2×
1. Tocar no botão "1×" (canto inferior direito do stage). Confirmar que muda para "2×".
2. Confirmar que imagem, frames, curvas e pontos ampliam juntos.
3. Arrastar em área vazia para pan. Confirmar que apenas a visualização se move.
4. Mover um frame em 2×. Confirmar que o frame acompanha o dedo sem deslocamento.
5. Arrastar ponto de controle de curva em 2×. Confirmar posição correta.
6. Preview OK.

### Teste C — zoom 4×
1. Tocar no botão "2×". Confirmar que muda para "4×".
2. Fazer pan até uma região específica da imagem.
3. Selecionar e mover frame nessa região. Confirmar sem deslocamento entre dedo e frame.
4. Arrastar ponto de controle. Confirmar sem deslocamento.
5. Tocar no botão "4×". Confirmar retorno para "1×".
6. Confirmar que o Stage recentraliza (sem transform residual).

### Teste D — não alterar dados reais
1. Criar projeto com frames e curvas configuradas.
2. Ativar 4× e fazer pan.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que o zoom não foi salvo (app abre em 1×).
6. Confirmar que frames/curvas estão iguais ao salvo.
7. Preview OK.

### Teste E — Preview e MP4 ignoram zoom
1. Ativar 4× e pan para canto.
2. Rodar Preview. Confirmar que o Preview não aparece ampliado ou deslocado.
3. Gerar MP4. Confirmar que o MP4 está correto (sem zoom de edição).
4. Voltar do Preview. Confirmar que o app continua estável.

### Teste F — interações em zoom
1. Em 2× e 4×, testar:
   - Mover frame.
   - Selecionar frame diferente.
   - Usar handle de escala/rotação (global handle).
   - Mover ponto de controle de curva.
   - Selecionar trecho via pill do midBar.
   - Abrir painel de easing.
   - Resetar curva.
2. Confirmar que tudo usa coordenadas corretas.

### Teste G — reset de zoom
1. Ativar 2× ou 4×.
2. Carregar nova imagem. Confirmar que zoom volta para 1×.
3. Ativar 4× novamente.
4. Tocar em Reset (ícone de reset no topo). Confirmar que zoom volta para 1×.

### Teste H — regressão geral
1. Movimento Inteligente continua funcionando.
2. Rotação Inteligente continua funcionando.
3. Escala Inteligente continua funcionando.
4. Velocidade constante continua funcionando.
5. Loop como trecho real continua funcionando.
6. Pausa final continua seguindo o último frame.
7. Load de projeto antigo/misto continua OK.
8. Preview OK.
9. Gerar MP4 OK.
10. Sem tela preta, sem botão preso, sem NaN/Infinity no console.

---

## v8z4b17u — reset selected segment curve

### Teste A — reset em trecho normal
1. Criar 3 frames.
2. Selecionar trecho 1–2 (abrir painel Easing via pill do segmento).
3. Alterar manualmente a curva 1–2 (arrastar ponto de controle).
4. Tocar em **Resetar curva**.
5. Confirmar que a curva 1–2 voltou à posição padrão (midpoint).
6. Confirmar que a curva 2–3 não foi alterada.
7. Preview OK.

### Teste B — reset em outro trecho
1. Alterar manualmente as curvas 1–2 e 2–3.
2. Selecionar trecho 2–3.
3. Tocar em **Resetar curva**.
4. Confirmar que 2–3 voltou ao padrão.
5. Confirmar que 1–2 permanece manual.
6. Preview OK.

### Teste C — reset com loop ligado
1. Criar 4 frames.
2. Ligar Loop.
3. Confirmar que aparece trecho 4–1 no seletor.
4. Alterar manualmente a curva 4–1.
5. Selecionar trecho 4–1 no painel Easing.
6. Tocar em **Resetar curva**.
7. Confirmar que a curva 4–1 voltou ao padrão.
8. Confirmar que Loop permanece ligado.
9. Confirmar que duração e easing do loop não mudaram.
10. Preview OK.

### Teste D — não alterar outros parâmetros
1. Em um trecho, configurar duração específica.
2. Configurar easing manual ou modo inteligente.
3. Configurar rotação e escala nos frames.
4. Alterar curva manualmente.
5. Tocar em **Resetar curva**.
6. Confirmar que duração não mudou.
7. Confirmar que easing não mudou.
8. Confirmar que rotação não mudou.
9. Confirmar que escala não mudou.
10. Preview OK.

### Teste E — salvar/reabrir
1. Alterar uma curva manualmente.
2. Tocar em **Resetar curva**.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que a curva continua no padrão (não manual).
6. Preview OK.

### Teste F — undo/redo
1. Alterar curva manualmente.
2. Tocar em **Resetar curva**.
3. Usar undo.
4. Confirmar que a curva manual anterior voltou.
5. Usar redo.
6. Confirmar que o reset foi reaplicado.
7. Preview OK.

### Teste G — regressão geral
1. Movimento Inteligente continua funcionando.
2. Rotação Inteligente continua funcionando.
3. Escala Inteligente continua funcionando.
4. Velocidade constante continua funcionando.
5. Loop como trecho real continua funcionando.
6. Pausa final continua seguindo o último frame.
7. Load de projeto antigo/misto continua OK.
8. Trechos aparecem corretamente após load.
9. Preview OK.
10. Gerar MP4 OK.
11. Sem tela preta.
12. Sem botão preso.
13. Sem NaN/Infinity no console.

---

## v8z4b17t — smart easing defaults for new projects

### Teste A — projeto novo
1. Abrir app limpo (nova aba).
2. Carregar imagem.
3. Criar frames.
4. Abrir painel de trecho/easing.
5. Confirmar que Velocidade/Movimento Inteligente está ligado.
6. Confirmar que Rotação Inteligente está ligada.
7. Confirmar que Escala Inteligente está ligada.
8. Preview OK.

### Teste B — reset
1. Desligar Movimento Inteligente, Rotação Inteligente, Escala Inteligente.
2. Fazer Reset (botão reset na toolbar).
3. Abrir painel de trecho/easing.
4. Confirmar que os três modos voltaram ligados.

### Teste C — salvar projeto novo com modos smart
1. Criar projeto novo (app limpo + imagem).
2. Confirmar que os três modos inteligentes estão ligados.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que os três modos continuam ligados.
6. Preview OK.

### Teste D — projeto salvo com modos manual
1. Criar projeto novo.
2. Desligar Rotação Inteligente e Escala Inteligente.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que Rotação e Escala continuam manuais.
6. Confirmar que Movimento Inteligente continua ligado.
7. Preview OK.

### Teste E — projeto antigo sem campos novos
1. Carregar JSON antigo sem `movementEasingMode`/`rotationEasingMode`/`scaleEasingMode`.
2. Confirmar que abre em manual/manual/manual.
3. Confirmar que não herda easeMode/easeAmount invisível.
4. Preview OK.

### Teste F — projeto antigo/misto da v8z4b17s
1. Carregar `arco_projeto- pausas_img.json`.
2. Confirmar que continua sem pausa invisível.
3. Confirmar que continua sem easing invisível.
4. Confirmar que os modos respeitam os campos do JSON.
5. Preview OK.

### Teste G — regressão geral
1. Loop como trecho real continua funcionando.
2. Pausa final continua seguindo o último frame.
3. Velocidade constante continua redistribuindo com loop.
4. Movimento Inteligente continua funcionando.
5. Rotação Inteligente continua funcionando.
6. Escala Inteligente continua funcionando.
7. Painel Duração/Tempo mostra Trechos corretamente após load.
8. Preview OK.
9. Gerar MP4 OK.
10. Sem tela preta, sem botão preso, sem NaN/Infinity no console.

---

## v8z4b17s — legacy project migration cleanup

### Teste A — arquivo antigo/misto (arco_projeto- pausas_img.json)
1. Carregar o arquivo `arco_projeto- pausas_img.json`.
2. Confirmar que os 8 frames carregam corretamente.
3. Abrir painel Duração/Tempo → Pausas. Confirmar que framePauses aparecem todos 0.
4. Confirmar que não há pausa por frame invisível (Preview não pausa entre frames).
5. Confirmar que Pausa final está desligada (finishMode ≠ 'pause').
6. Confirmar que Loop está ligado (finishMode = 'loop' → trecho 8→1 visível).
7. Confirmar que o trecho 8–1 aparece como trecho real de loop na lista de Trechos.
8. Confirmar que finishDuration 0.8 não aparece como pausa final.
9. Preview: movimento fluido sem pausas ou easing invisível.

### Teste B — easeMode/easeAmount não comandam invisivelmente
1. No mesmo arquivo (easeMode: "global", easeAmount: 1, movementEasingMode: "manual").
2. Confirmar que o painel mostra Modo Manual para Movimento.
3. Preview: sem easing invisível (movimento deve ser linear/constante, não ease-in-out).
4. Confirmar que a UI mostra o mesmo modo que o motor usa.
5. Se não houver segEasings salvos, comportamento deve ser linear/constante.

### Teste C — salvar/reabrir
1. Carregar o arquivo antigo/misto.
2. Salvar novamente como JSON.
3. Reabrir o JSON novo.
4. Confirmar que não volta a aparecer easing invisível.
5. Confirmar que não aparece pausa invisível.
6. Confirmar que loop continua coerente (8–1 visível).

### Teste D — JSON antigo sem movementEasingMode
1. Carregar um JSON antigo que tenha easeMode/easeAmount mas não tenha movementEasingMode.
2. Confirmar que o app define movementEasingMode = 'manual' automaticamente.
3. Confirmar que easeAmount não cria easing invisível.
4. Confirmar que a UI mostra o modo correto.

### Teste E — JSON com easeMode 'pause' e framePauses zerados
1. Carregar JSON com easeMode: "pause" e framePauses presentes (todos zero).
2. Confirmar que pauseDuration é neutralizado.
3. Confirmar que não há pausa inter-segmento invisível no Preview.

### Teste F — finishMode versus loopEnabled
1. Carregar arquivo com finishMode: "loop" e loopEnabled: true. Confirmar que loop ativo.
2. Se disponível: carregar arquivo com finishMode: "pause" e loopEnabled: true.
3. Confirmar que finishMode: "pause" manda e loop fica desligado.
4. Confirmar que loopEnabled legacy não sobrescreve finishMode atual.

### Teste G — regressão de projetos novos
1. Criar projeto novo. Confirmar modos atuais funcionam.
2. Confirmar Movimento Inteligente, Rotação Inteligente e Escala Inteligente OK.
3. Confirmar Loop como trecho N→1 OK.
4. Confirmar Pausa final espelhando o último frame OK.
5. Preview OK. MP4 OK.

### Teste H — regressão geral
1. Carregar projeto com 6 frames. Confirmar Trechos corretos.
2. Carregar projeto com 30 frames. Confirmar Trechos corretos.
3. Ativar Velocidade constante. Ativar Loop. Confirmar redistribuição.
4. Preview OK. Gerar MP4 OK. Sem NaN/Infinity no console.

---

## v8z4b17r — fix project load segment list normalization

### Teste A — projeto com 2 frames
1. Carregar projeto salvo com 2 frames.
2. Abrir painel Duração/Tempo.
3. Confirmar que Trechos mostra 1 trecho: 1–2.
4. Preview OK.

### Teste B — projeto com 6 frames
1. Carregar projeto salvo com 6 frames.
2. Abrir painel Duração/Tempo.
3. Confirmar que Trechos mostra 5 trechos: 1–2, 2–3, 3–4, 4–5, 5–6.
4. Confirmar que Pausas por frame mostra F1 até F6.
5. Preview OK.

### Teste C — projeto com 6 frames e loop
1. Carregar projeto salvo com 6 frames e loop ligado.
2. Confirmar que Trechos mostra 6 trechos: 1–2, 2–3, 3–4, 4–5, 5–6, 6–1.
3. Confirmar que 6–1 aparece também na faixa de frames.
4. Selecionar 6–1. Confirmar que abre painel real de trecho/easing.
5. Preview OK.

### Teste D — projeto com 30 frames
1. Carregar projeto salvo com 30 frames.
2. Abrir painel Duração/Tempo.
3. Confirmar que Trechos mostra 29 trechos sem loop.
4. Confirmar que Pausas por frame mostra F1 até F30.
5. Confirmar que o painel rola normalmente.
6. Preview OK.

### Teste E — projeto com 30 frames e loop
1. Carregar projeto salvo com 30 frames e loop ligado.
2. Confirmar que Trechos mostra 30 trechos.
3. Confirmar que o último é 30–1 e é selecionável/editável.
4. Preview OK. MP4 OK.

### Teste F — reset continua correto
1. Resetar o app.
2. Confirmar que o estado inicial mostra o número correto de frames padrão.
3. Confirmar que Trechos mostra a quantidade correta.
4. Não quebrar o comportamento que já funcionava após reset.

### Teste G — Velocidade constante após load
1. Carregar projeto com vários frames.
2. Ativar Velocidade constante.
3. Confirmar que todos os trechos visíveis entram na redistribuição.
4. Se loop estiver ligado, confirmar que N→1 entra também.
5. Preview OK.

### Teste H — modos inteligentes após load
1. Carregar projeto com Movimento Inteligente, Rotação Inteligente e Escala Inteligente.
2. Confirmar que os modos aparecem corretos nas abas.
3. Confirmar que Preview respeita os modos.
4. Sem NaN/Infinity.

### Teste I — Pausa final após load
1. Carregar projeto com Pausa final.
2. Confirmar que a pausa está no último frame real.
3. Adicionar frame. Confirmar que a pausa final migra para o novo último frame.
4. Preview OK.

### Teste J — regressão geral
1. Painel Duração/Tempo continua sempre aberto.
2. Loop como trecho real continua funcionando.
3. Pausa final continua seguindo o último frame.
4. Movimento Inteligente, Rotação Inteligente, Escala Inteligente: Preview OK.
5. Gerar MP4 OK. Sem tela preta. Sem botão preso.
6. Sem NaN/Infinity no console.

---

## v8z4b17q — smart rotation and scale easing

### Teste A — estados padrão

1. Abrir projeto novo.
2. Abrir painel de trecho/easing.
3. Confirmar que Movimento Inteligente continua funcionando.
4. Abrir aba Rotação.
5. Confirmar que existe toggle `Rotação Inteligente`.
6. Abrir aba Escala.
7. Confirmar que existe toggle `Escala Inteligente`.
8. Confirmar que não existem botões duplicados Manual/Inteligente.

### Teste B — Rotação Inteligente

1. Criar 3 ou 4 frames.
2. Aplicar rotações diferentes entre frames.
3. Ativar Rotação Inteligente.
4. Confirmar que os cards manuais de Rotação ficam apagados/inativos.
5. Rodar Preview.
6. Confirmar que a rotação ficou mais suave entre trechos, sem tranco.
7. Desligar Rotação Inteligente.
8. Confirmar que os cards voltam a funcionar.
9. Aplicar easing manual de Rotação.
10. Preview OK.

### Teste C — Escala Inteligente

1. Criar 3 ou 4 frames com escalas diferentes.
2. Ativar Escala Inteligente.
3. Confirmar que os cards manuais de Escala ficam apagados/inativos.
4. Rodar Preview.
5. Confirmar que o zoom fica mais suave entre trechos.
6. Desligar Escala Inteligente.
7. Confirmar que os cards voltam a funcionar.
8. Aplicar easing manual de Escala.
9. Preview OK.

### Teste D — canais independentes

1. Deixar Movimento Inteligente ligado.
2. Deixar Rotação Inteligente desligada.
3. Deixar Escala Inteligente ligada.
4. Confirmar que cada canal respeita seu próprio modo.
5. Confirmar que desligar um canal não desliga os outros.

### Teste E — pausas

1. Criar F1, F2, F3.
2. Aplicar rotação e escala diferentes.
3. Colocar pausa em F2.
4. Ativar Rotação Inteligente e Escala Inteligente.
5. Confirmar que a rotação desacelera até F2, para, e sai depois.
6. Confirmar que a escala desacelera até F2, para, e sai depois.
7. Preview OK.

### Teste F — mudança de direção

1. Criar escala com zoom in seguido de zoom out.
2. Ativar Escala Inteligente.
3. Confirmar que não há overshoot exagerado.
4. Criar rotação em um sentido e depois no sentido oposto.
5. Ativar Rotação Inteligente.
6. Confirmar que não há efeito chicote exagerado.

### Teste G — trechos 0.0s

1. Definir um trecho com duração 0.0s.
2. Ativar Rotação Inteligente.
3. Ativar Escala Inteligente.
4. Confirmar que o trecho 0.0s continua corte seco.
5. Confirmar que não há erro, NaN ou Infinity.
6. Preview OK.

### Teste H — loop

1. Criar 4 frames.
2. Ativar Loop.
3. Confirmar que aparece trecho 4–1.
4. Aplicar rotação e escala diferentes entre F4 e F1.
5. Ativar Rotação Inteligente.
6. Ativar Escala Inteligente.
7. Confirmar que o trecho 4–1 participa da suavização.
8. Preview OK.
9. MP4 OK.

### Teste I — Velocidade constante + inteligentes

1. Criar 4 frames com distâncias diferentes, rotações e escalas diferentes.
2. Ativar Velocidade constante.
3. Ativar Movimento Inteligente.
4. Ativar Rotação Inteligente.
5. Ativar Escala Inteligente.
6. Confirmar que os tempos redistribuem corretamente.
7. Confirmar que movimento, rotação e escala ficam suaves.
8. Preview OK.
9. MP4 OK.

### Teste J — JSON

1. Criar projeto com Rotação Inteligente ligada.
2. Criar projeto com Escala Inteligente ligada.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que os modos foram preservados.
6. Carregar JSON antigo sem `rotationEasingMode`/`scaleEasingMode`.
7. Confirmar que abre em `manual` para esses canais.
8. Preview OK.

### Teste K — undo/redo

1. Ligar Rotação Inteligente.
2. Desligar Rotação Inteligente.
3. Usar undo/redo.
4. Confirmar que o estado volta corretamente.
5. Repetir com Escala Inteligente.

### Teste L — regressão geral

1. Painel Duração/Tempo continua sempre aberto.
2. Loop como trecho real continua funcionando.
3. Pausa final continua seguindo o último frame.
4. Velocidade constante continua redistribuindo com loop.
5. Movimento Inteligente continua funcionando.
6. Preview OK.
7. Gerar MP4 OK.
8. Fazer pequena edição.
9. Gerar MP4 novamente OK.
10. Sem tela preta.
11. Sem botão preso.
12. Sem NaN/Infinity no console.

## v8z4b17p — finish timeline sync fixes

### Teste A — adicionar frame com Pausa final ativa

1. Criar F1, F2, F3.
2. Ativar Pausa final com 2.0s.
3. Confirmar que F3 tem pausa 2.0s.
4. Adicionar F4.
5. Confirmar que F3 volta para 0.0s.
6. Confirmar que F4 recebe 2.0s.
7. Confirmar que Pausa final continua ativa.
8. Confirmar que o tempo total não duplicou.

### Teste B — adicionar vários frames com Pausa final ativa

1. Com F4 como último e Pausa final 2.0s, adicionar F5.
2. Confirmar que F4 volta para 0.0s.
3. Confirmar que F5 recebe 2.0s.
4. Confirmar que não há pausas finais acumuladas em frames antigos.

### Teste C — remover último frame com Pausa final ativa

1. Criar F1, F2, F3, F4.
2. Ativar Pausa final com 2.0s em F4.
3. Remover F4.
4. Confirmar que F3 passa a ter pausa 2.0s.
5. Confirmar que Pausa final continua ativa.
6. Confirmar que o tempo total está correto.

### Teste D — pausa intermediária preservada

1. Criar F1, F2, F3.
2. Colocar pausa manual em F2 de 1.0s.
3. Ativar Pausa final em F3 com 2.0s.
4. Adicionar F4.
5. Confirmar que F2 continua com 1.0s.
6. Confirmar que F3 fica 0.0s.
7. Confirmar que F4 recebe 2.0s.

### Teste E — Pausa final desligada (sem transferência automática)

1. Desligar Pausa final.
2. Adicionar frames.
3. Confirmar que o app não move pausas automaticamente.
4. Pausas por frame devem continuar manuais.

### Teste F — Velocidade constante + ligar Loop

1. Criar 4 frames com percursos diferentes.
2. Ativar Velocidade constante.
3. Confirmar que os trechos normais redistribuem.
4. Ligar Loop.
5. Confirmar que aparece trecho 4–1.
6. Confirmar que 4–1 entra redistribuído imediatamente.
7. Confirmar que o tempo total aumenta corretamente.
8. Preview OK.

### Teste G — Velocidade constante + desligar Loop

1. Com Velocidade constante e Loop ligados, desligar Loop.
2. Confirmar que 4–1 sai da conta.
3. Confirmar que os trechos normais redistribuem novamente.
4. Confirmar que o tempo total reduz corretamente.
5. Preview OK.

### Teste H — zerar todas as pausas

1. Ativar Pausa final com valor > 0.
2. Ir ao painel Duração/Tempo.
3. Zerar todas as pausas.
4. Confirmar que Pausa final desliga.
5. Confirmar que framePauses[lastFrameIndex] = 0.
6. Confirmar que Loop volta a ficar disponível.
7. Confirmar que tempo total atualiza.

### Teste I — zerar pausa do último frame

1. Ativar Pausa final com 2.0s.
2. Zerar apenas a pausa do último frame.
3. Confirmar que Pausa final desliga.
4. Confirmar que pausas intermediárias não mudam.
5. Confirmar que o total atualiza.

### Teste J — slider de Pausa final para 0

1. Ativar Pausa final com 2.0s.
2. No controle de Pausa final, arrastar para 0.
3. Confirmar que Pausa final desliga.
4. Confirmar que o último frame fica com pausa 0.
5. Confirmar que Loop volta a ficar disponível.

### Teste K — Loop como trecho real continua OK

1. Ligar Loop.
2. Confirmar que aparece trecho N–1 em Trechos.
3. Confirmar que aparece na faixa/painel de frames.
4. Selecionar N–1.
5. Confirmar que abre painel real de trecho/easing.
6. Editar duração/easing.
7. Preview OK.
8. MP4 OK.

### Teste L — JSON

1. Criar projeto com Pausa final ativa.
2. Adicionar frame e confirmar que a pausa migrou.
3. Salvar JSON.
4. Reabrir JSON.
5. Confirmar que a pausa está no último frame atual.
6. Criar projeto com Loop + Velocidade constante.
7. Salvar e reabrir.
8. Confirmar que Loop e distribuição continuam coerentes.

### Teste M — regressão geral

1. Painel Duração/Tempo continua sempre aberto.
2. Painel de trecho/easing mantém hierarquia da v8z4b17n.
3. Movimento Inteligente continua funcionando.
4. Velocidade constante continua funcionando.
5. Loop como trecho real continua funcionando.
6. Preview OK.
7. Gerar MP4 OK.
8. Fazer pequena edição.
9. Gerar MP4 novamente OK.
10. Sem tela preta.
11. Sem botão preso.
12. Sem NaN/Infinity no console.

## v8z4b17o — loop as closing segment and final pause mirror

### Teste A — loop cria trecho de fechamento

1. Criar projeto com 4 frames.
2. Ativar Loop no Acabamento.
3. Confirmar que aparece trecho `4–1` na lista de Trechos (painel Duração/Tempo).
4. Confirmar que aparece ease pill de loop na faixa de frames após F4.
5. Confirmar que o ease pill é selecionável (abre painel real de trecho/easing com título `Seg. 4–1 · Loop`).
6. Confirmar que o tempo total aumenta pelo valor do trecho 4–1.

### Teste B — editar trecho de loop

1. Selecionar o trecho 4–1 pela faixa ou pela lista de Trechos.
2. Alterar duração no slider.
3. Confirmar que o total atualiza.
4. Alterar easing de Velocidade (ex: Acelerar).
5. Alterar easing de Rotação.
6. Alterar easing de Escala.
7. Rodar Preview — confirmar que o loop usa esses ajustes.

### Teste C — loop desligado

1. Desligar Loop.
2. Confirmar que o trecho 4–1 desaparece da lista de Trechos.
3. Confirmar que o ease pill de loop desaparece da faixa.
4. Confirmar que o total não inclui o tempo de loop.
5. Preview não deve fazer movimento de retorno.

### Teste D — Pausa final sem pausa prévia

1. Garantir que o último frame está com pausa 0.0s.
2. Tocar em Pausa final no Acabamento.
3. Confirmar que o app adiciona pausa de 1.0s ao último frame.
4. Confirmar que o slider de Pausa final mostra 1.0s.
5. Confirmar que a lista de Pausas por frame mostra 1.0s no último frame.
6. Confirmar que Loop fica desligado.

### Teste E — Pausa final com pausa já existente

1. Definir pausa do último frame como 2.0s na lista de Pausas por frame.
2. Ir ao Acabamento e tocar em Pausa final.
3. Confirmar que não soma novo tempo (permanece 2.0s).
4. Confirmar que o slider abre mostrando 2.0s.
5. Alterar para 3.0s.
6. Confirmar que a pausa do último frame na lista também vira 3.0s.
7. Confirmar que não existe tempo paralelo de pausa final.

### Teste F — editar último frame reflete em Pausa final

1. Com Pausa final ativa, editar a pausa do último frame pela lista de Pausas por frame.
2. Confirmar que o slider de Pausa final reflete o novo valor.
3. Confirmar que o total atualiza corretamente.

### Teste G — Loop versus Pausa final

1. Ativar Loop. Confirmar que Pausa final fica desativada (chip não ativo).
2. Desligar Loop. Ativar Pausa final.
3. Confirmar que Loop fica desligado.
4. Confirmar que não existem os dois modos ativos ao mesmo tempo.

### Teste H — Velocidade constante com loop

1. Criar trechos de tamanhos diferentes. Ativar Loop.
2. Ativar Velocidade constante.
3. Confirmar que o trecho N–1 entra na redistribuição proporcional.
4. Confirmar que o tempo total é coerente.
5. Preview OK.

### Teste I — Movimento Inteligente com loop

1. Ativar Movimento Inteligente. Ativar Loop.
2. Confirmar que o trecho N–1 recebe continuidade de velocidade.
3. Colocar pausa no último frame — confirmar que o movimento para antes de sair para o loop.
4. Preview OK.

### Teste J — adicionar/remover frames com loop ativo

1. Criar 4 frames com Loop ligado. Confirmar trecho `4–1`.
2. Adicionar F5. Confirmar que o trecho final vira `5–1`.
3. Remover F5. Confirmar que volta para `4–1`.
4. Preview OK.

### Teste K — JSON

1. Criar projeto com Loop ligado e trecho N–1 ajustado. Salvar JSON.
2. Reabrir JSON. Confirmar que Loop, duração do trecho N–1 e easings foram preservados.
3. Criar projeto com Pausa final ligada. Salvar JSON.
4. Reabrir JSON. Confirmar que Pausa final reflete a pausa do último frame.

### Teste L — regressão geral

1. Painel Duração/Tempo continua sempre aberto.
2. Painel de trecho/easing continua com hierarquia da v8z4b17n.
3. Preview OK. Gerar MP4 OK.
4. Sem tela preta. Sem botão preso. Sem NaN/Infinity no console.

## v8z4b17n — duration movement hierarchy and connected tabs

### Teste A — título do segmento

1. Abrir painel real de trecho/easing (tocar em trecho).
2. Confirmar que `SEG. 2–3` (ou número do segmento) está centralizado horizontalmente.
3. Confirmar que o título parece hierarquia principal do painel.

### Teste B — Duração e Movimento equivalentes

1. Confirmar que `DURAÇÃO` e `MOVIMENTO` usam o mesmo estilo de label de seção (uppercase, mesmo tamanho, mesma cor).
2. Confirmar que o slider de duração está dentro de um bloco com fundo cinza (#3a3a3c), igual ao conteúdo ativo das abas.
3. Confirmar que Duração não parece label solto ao lado do slider.

### Teste C — abas reais

1. Confirmar que Velocidade / Rotação / Escala não parecem pills nem botões isolados.
2. Confirmar que abas inativas têm fundo `#2c2c2e` (recuado, mas visível).
3. Confirmar que aba ativa muda inteira de cor para `#3a3a3c`.
4. Confirmar que a aba ativa se conecta visualmente ao conteúdo abaixo (sem linha divisória perceptível).

### Teste D — continuidade visual

1. Selecionar aba **Velocidade** → confirmar que aba e conteúdo abaixo formam bloco contínuo.
2. Selecionar aba **Rotação** → confirmar a mesma continuidade.
3. Selecionar aba **Escala** → confirmar a mesma continuidade.

### Teste E — Movimento Inteligente

1. Na aba Velocidade, confirmar presença de: Movimento Inteligente [toggle] + Global [ícone].
2. Confirmar ordem: Movimento Inteligente primeiro, Global depois.
3. Ligar Movimento Inteligente: cards Constante/Acelerar/Desacelerar/Suavizar ficam apagados/inativos.
4. Desligar Movimento Inteligente: cards voltam ao normal.

### Teste F — regressão funcional

1. Velocidade constante continua funcionando.
2. Movimento Inteligente continua funcionando.
3. Rotação continua funcionando.
4. Escala continua funcionando.
5. Preview OK.
6. MP4 OK.
7. Painel Duração/Tempo continua sempre aberto.

## v8z4b17m — real channel tabs and velocity naming

### Teste A — nomenclatura

1. Abrir painel de easing (tocar em trecho).
2. Confirmar que "Movimento" aparece como nome de seção (label pequeno, uppercase, acima da barra de abas).
3. Confirmar que as abas são: **Velocidade** / Rotação / Escala (não "Movimento").

### Teste B — aparência das abas

1. Confirmar que a faixa das abas tem cor própria (`#2c2c2e`), visivelmente diferente do fundo do painel (`#1c1c1e`).
2. Confirmar que não parece linha de botões/pills.
3. Confirmar que a aba ativa tem fundo `#3a3a3c` (mais claro que a faixa) e texto branco.
4. Confirmar que aba inativa é discreta (texto acinzentado, sem fundo).
5. Confirmar que há hierarquia visual clara: painel → faixa → aba ativa.

### Teste C — aba Velocidade

1. Abrir aba Velocidade.
2. Confirmar presença de: Movimento Inteligente [toggle] + Global [ícone].
3. Confirmar ordem: Movimento Inteligente → Global.
4. Ligar Movimento Inteligente: cards Constante/Acelerar/Desacelerar/Suavizar ficam apagados/inativos.
5. Desligar Movimento Inteligente: cards voltam ao normal.
6. Preview OK.

### Teste D — aba Rotação

1. Abrir aba Rotação.
2. Confirmar que a navegação funciona (aba ativa muda para Rotação).
3. Confirmar que os cards ficam normais (não subordinados ao Movimento Inteligente).
4. Confirmar presença do Global contextual.
5. Preview OK.

### Teste E — aba Escala

1. Abrir aba Escala.
2. Confirmar que a navegação funciona.
3. Confirmar que os cards ficam normais.
4. Confirmar presença do Global contextual.
5. Preview OK.

### Teste F — regressão

1. Movimento Inteligente continua funcionando.
2. Velocidade constante continua funcionando.
3. Painel Duração/Tempo continua sempre aberto.
4. Preview OK.
5. MP4 OK.

## v8z4b17l — channel tabs and smart movement toggle

### Teste A — abas reais

1. Abrir app.
2. Carregar imagem.
3. Criar frames.
4. Abrir painel de easing.
5. Confirmar que Movimento/Rotação/Escala aparecem como abas em uma barra segmentada (não pills soltos).
6. Confirmar que a aba ativa fica com cor accent e fundo destacado.
7. Confirmar que abas inativas são discretas (texto cinza).

### Teste B — aba Movimento com Inteligente ligado

1. Abrir aba Movimento.
2. Confirmar toggle único "Movimento Inteligente" (switch iOS-style) — não dois botões.
3. Confirmar que vem ligado em projeto novo.
4. Confirmar que o ícone Global aparece após o toggle (não no cabeçalho).
5. Confirmar que o ícone Global aparece em laranja/implícito (travado).
6. Confirmar que Constante/Acelerar/Desacelerar/Suavizar ficam apagados/inativos.
7. Confirmar que "Aplicar aos 3" está oculto.
8. Preview OK.

### Teste C — aba Movimento com Inteligente desligado

1. Desligar toggle Movimento Inteligente.
2. Confirmar que os cards de easing voltam ao estado normal.
3. Confirmar que ícone Global fica clicável/disponível.
4. Ativar Global, aplicar Acelerar — confirmar que afeta todos os trechos de Movimento.
5. Desativar Global, aplicar Suavizar — confirmar que afeta só o trecho atual.
6. Confirmar que "Aplicar aos 3" reapareceu.
7. Preview OK.

### Teste D — aba Rotação

1. Abrir aba Rotação.
2. Confirmar que ícone Global contextual aparece na linha da aba.
3. Confirmar que não aparece toggle Movimento Inteligente.
4. Confirmar que cards de easing estão normais (não subordinados).
5. Aplicar easing local de Rotação.
6. Ativar Global e aplicar easing global de Rotação.
7. Confirmar que Movimento e Escala não são afetados.
8. Preview OK.

### Teste E — aba Escala

1. Abrir aba Escala.
2. Confirmar que ícone Global contextual aparece na linha da aba.
3. Confirmar que não aparece toggle Movimento Inteligente.
4. Confirmar que cards de easing estão normais.
5. Aplicar easing local de Escala.
6. Ativar Global e aplicar easing global de Escala.
7. Confirmar que Movimento e Rotação não são afetados.
8. Preview OK.

### Teste F — Aplicar aos 3

1. Com Inteligente ligado: confirmar que "Aplicar aos 3" está oculto.
2. Com Inteligente desligado: confirmar que "Aplicar aos 3" reapareceu.
3. Confirmar que é ação pontual (não toggle persistente).

### Teste G — JSON/projetos

1. Criar projeto novo → Inteligente ligado por padrão.
2. Salvar JSON e reabrir → Inteligente continua ligado.
3. Carregar JSON antigo sem `movementEasingMode` → abre em Manual.
4. Preview OK em ambos os casos.

### Teste H — regressão geral

1. Velocidade constante funciona.
2. Painel Duração/Tempo continua sempre aberto.
3. Movimento Inteligente funciona (continuidade entre trechos no preview).
4. Rotação e Escala usam easings próprios corretamente.
5. Preview OK.
6. Gerar MP4 OK.
7. Editar projeto → gerar MP4 novamente OK.

## v8z4b17k — clean smart movement panel

### Teste A — novo projeto (Movimento Inteligente como padrão)

1. Abrir o app.
2. Carregar uma imagem.
3. Criar frames.
4. Abrir o painel de easing (botão na barra).
5. Confirmar que o canal **Movimento** está selecionado e **Inteligente** está ativo (destaque accent).
6. Confirmar que os chips Constante/Acelerar/Desacelerar/Suavizar aparecem subordinados (opacidade reduzida).
7. Confirmar que **Aplicar aos 3** está oculto.
8. Preview OK.

### Teste B — linha de modo aparece só para Movimento

1. Com Movimento selecionado, confirmar que a linha "Movimento Inteligente [Manual] [Inteligente]" está visível.
2. Clicar em **Rotação** — confirmar que a linha de modo some.
3. Clicar em **Escala** — confirmar que a linha de modo some.
4. Clicar em **Movimento** — confirmar que a linha de modo reaparece.
5. Repetir no mini-painel contextual de segmento.

### Teste C — Movimento Manual

1. Com canal Movimento selecionado, clicar em **Manual**.
2. Confirmar que os chips voltam à aparência normal (sem subordinação).
3. Confirmar que **Aplicar aos 3** reaparece.
4. Escolher **Suavizar** ou **Acelerar**.
5. Preview OK — easing manual de Movimento funciona.

### Teste D — Rotação e Escala não afetadas pelo modo Inteligente

1. Com Movimento Inteligente ativo, clicar em **Rotação**.
2. Confirmar que os chips de easing ficam normais (sem subordinação).
3. Aplicar Acelerar em Rotação. Preview OK.
4. Clicar em **Escala**.
5. Confirmar que os chips ficam normais.
6. Aplicar Desacelerar em Escala. Preview OK.

### Teste E — "Aplicar aos 3" em modo Manual

1. Com Movimento em Manual, abrir painel de easing.
2. Confirmar que **Aplicar aos 3** está visível.
3. Escolher Suavizar em Movimento.
4. Clicar em Aplicar aos 3.
5. Confirmar feedback visual momentâneo (borda accent, depois volta ao neutro).
6. Confirmar que Rotação e Escala do trecho também ficaram Suavizar.

### Teste F — projeto antigo (sem movementEasingMode)

1. Carregar um JSON antigo sem o campo `movementEasingMode`.
2. Confirmar que abre em **Movimento Manual**.
3. Confirmar que o resultado visual/animação não muda em relação à v8z4b17j.
4. Preview OK.

### Teste G — JSON novo com Inteligente

1. Criar projeto novo (Inteligente ativo por padrão).
2. Salvar JSON.
3. Reabrir JSON.
4. Confirmar que **Movimento Inteligente** continua ativo.
5. Preview OK.

### Teste H — regressão geral

1. Velocidade constante continua funcionando.
2. Painel Duração/Tempo continua sempre aberto (seções não recolhem).
3. Preview OK.
4. Gerar MP4 OK.
5. Fazer pequena edição de frame.
6. Gerar MP4 novamente OK.
7. Undo/Redo: mudar de Inteligente para Manual e voltar — confirmar que undo/redo funciona.

---

## v8z4b17j — smart movement easing experiment

### Teste A — modo padrão

1. Abrir o app.
2. Carregar uma imagem.
3. Criar 3 frames.
4. Abrir o painel contextual de easing de um trecho.
5. Confirmar que `Movimento` está em `Manual` (padrão).
6. Rodar Preview.
7. Confirmar que o resultado é compatível com a v8z4b17i (sem regressão visual).

### Teste B — ativar Inteligente

1. Com 3 frames em distâncias bem diferentes (ex.: F1 pequeno, F2 médio, F3 grande), abrir o painel de easing.
2. Selecionar canal `Movimento`.
3. Clicar em `Inteligente`.
4. Confirmar que os chips `Constante/Acelerar/Desacelerar/Suavizar` ficam subordinados (opacidade reduzida, sem clique).
5. Confirmar que aparece o aviso `Movimento em modo Inteligente…`.
6. Rodar Preview.
7. Confirmar que a passagem pelo frame intermediário fica mais contínua/suave do que em Manual `Constante` (sem tranco súbito).

### Teste C — trecho lento → trecho rápido

1. Criar F1, F2, F3.
2. Definir trecho `1-2` curto/lento e trecho `2-3` longo/rápido (durações ou distâncias bem diferentes).
3. Ativar `Movimento › Inteligente`.
4. Rodar Preview.
5. Confirmar que a aceleração começa **antes** de F2 e continua **depois** de F2 (sem step seco no frame).

### Teste D — pausa no frame

1. Criar F1, F2, F3.
2. No painel Duração/Tempo, colocar uma pausa > 0s em F2.
3. Ativar `Movimento › Inteligente`.
4. Rodar Preview.
5. Confirmar que o movimento **desacelera** até F2, fica parado durante a pausa e **sai do zero** ao continuar.
6. Não pode passar batido pela pausa.

### Teste E — trecho 0.0s (corte seco)

1. Criar F1, F2, F3.
2. No painel Duração/Tempo, colocar o trecho `1-2` em `0.0s`.
3. Ativar `Movimento › Inteligente`.
4. Rodar Preview.
5. Confirmar que o trecho `1-2` continua como corte seco (sem easing).
6. Confirmar console: nenhum `NaN`, `Infinity` ou erro; preview não trava.

### Teste F — Velocidade constante + Inteligente

1. Ativar `Velocidade constante` no painel Duração/Tempo.
2. Confirmar que os tempos foram redistribuídos pelo comprimento curvo.
3. Abrir o painel de easing e ativar `Movimento › Inteligente`.
4. Confirmar que os tempos **não mudam** (Velocidade constante manda no tempo).
5. Rodar Preview.
6. Confirmar que o movimento fica contínuo (com Velocidade constante já entregando trechos com vAvg igual, a Hermite degenera para linear — comportamento esperado).

### Teste G — Rotação e Escala preservadas

1. Criar 3 frames com rotações e escalas distintas.
2. No painel de easing, no canal `Rotação`, escolher `Acelerar`.
3. No canal `Escala`, escolher `Desacelerar`.
4. Voltar ao canal `Movimento` e ativar `Inteligente`.
5. Rodar Preview.
6. Confirmar que a rotação está acelerando e a escala desacelerando — Inteligente afeta **apenas** o movimento.

### Teste H — JSON (salvar/recarregar)

1. Ativar `Movimento › Inteligente`.
2. Salvar projeto como JSON.
3. Abrir o JSON em editor de texto e confirmar a presença do campo `"movementEasingMode": "smart"`.
4. Recarregar o JSON no app.
5. Confirmar que o botão `Inteligente` volta marcado e a UI dos chips subordinados.
6. Preview OK.

### Teste I — projeto antigo (compatibilidade)

1. Carregar um JSON salvo na v8z4b17i (ou anterior), sem o campo `movementEasingMode`.
2. Confirmar que abre com `Manual` (padrão) — comportamento idêntico ao da v8z4b17i.
3. Preview OK.

### Teste J — undo / redo

1. Ativar `Movimento › Inteligente`.
2. Pressionar Desfazer (`Ctrl+Z` / botão de undo).
3. Confirmar que volta para `Manual`.
4. Pressionar Refazer.
5. Confirmar que volta para `Inteligente`.

### Teste K — MP4

1. Com `Movimento › Inteligente` ativo, Preview OK.
2. Gerar MP4.
3. Fazer uma pequena edição (mover um frame).
4. Gerar MP4 novamente.
5. Confirmar: sem tela preta, sem botão preso, sem erro no console.

### Teste L — Versão

1. Abrir Configurações.
2. Confirmar que a versão exibe `v8z4b17j`.
3. Confirmar que o nome exibe `smart movement easing experiment`.

---

## v8z4b17i — duration panel always expanded

### Teste A — Abertura do painel

1. Carregar o app.
2. Carregar uma imagem.
3. Abrir o painel Duração/Tempo.
4. Confirmar que **Trechos** está aberto (sem chevron, sem seta).
5. Confirmar que **Pausas por frame** está aberto (sem chevron, sem seta).
6. Confirmar que **Acabamento** está aberto (sem chevron, sem seta).

### Teste B — Sem recolhimento

1. Tocar nos títulos **Trechos**, **Pausas por frame** e **Acabamento**.
2. Confirmar que nenhuma seção recolhe.
3. Confirmar que não há mudança visual de estado aberto/fechado.
4. Confirmar que não há chevron ou seta visível nos títulos.

### Teste C — Uso normal

1. Alterar duração de um trecho (slider individual).
2. Alterar pausa de um frame.
3. Alterar opção de Acabamento (Nenhum / Loop / Pausa final).
4. Ativar/desativar **Velocidade constante**.
5. Tocar em **Igualar intervalos**.
6. Confirmar que nenhuma seção recolhe sozinha.

### Teste D — Scroll do painel

1. Criar vários frames (5+).
2. Abrir Duração/Tempo.
3. Confirmar que o painel inteiro rola normalmente (scroll principal do painel).
4. Confirmar que **não** voltou scroll interno ruim dentro da lista de pausas.

### Teste E — Regressão geral

1. Preview OK.
2. Gerar MP4 OK (sem tela preta, sem travamento).
3. Velocidade constante continua funcionando.
4. Igualar intervalos continua desligando Velocidade constante.
5. Ajuste individual de trecho continua saindo do modo Velocidade constante.
6. Easing por canal continua funcionando.

### Teste F — Versão

1. Abrir app; ir em Configurações.
2. Confirmar que a versão exibe **v8z4b17i**.
3. Confirmar que o nome exibe **duration panel always expanded**.

---

## v8z4b17h — duration sections stay expanded

### Teste A — Abertura inicial

1. Carregar o app.
2. Carregar uma imagem.
3. Abrir o painel Duração/Tempo.
4. Confirmar que **Trechos** já aparece aberto (chevron ▾).
5. Confirmar que **Pausas por frame** já aparece aberto (chevron ▾).

### Teste B — Reabrir painel

1. Fechar o painel Duração/Tempo.
2. Abrir novamente.
3. Confirmar que **Trechos** e **Pausas por frame** continuam abertos.

### Teste C — Alterar valores não recolhe seções

1. Alterar duração de um trecho (slider individual).
2. Alterar pausa de um frame.
3. Ativar/desativar **Velocidade constante**.
4. Tocar em **Igualar intervalos**.
5. Confirmar que **Trechos** e **Pausas por frame** não recolhem sozinhos.

### Teste D — Scroll do painel

1. Criar vários frames (5+).
2. Abrir Duração/Tempo.
3. Confirmar que o painel inteiro rola normalmente (scroll principal do painel).
4. Confirmar que **não** voltou scroll interno ruim dentro da lista de pausas.

### Teste E — Regressão geral

1. Preview OK.
2. Gerar MP4 OK (sem tela preta, sem travamento).
3. Velocidade constante continua funcionando.
4. Igualar intervalos continua desligando Velocidade constante.
5. Ajuste individual de trecho continua saindo do modo Velocidade constante.
6. Easing por canal continua funcionando.
7. Seção **Acabamento** mantém comportamento anterior (fechada por padrão, abre ao clicar).

### Teste F — Versão

1. Abrir app; ir em Configurações.
2. Confirmar que a versão exibe **v8z4b17h**.
3. Confirmar que o nome exibe **duration sections stay expanded**.

---

## v8z4b17g — constant speed manual override state fix

### Teste A — Igualar intervalos sai do modo Velocidade constante

1. Criar 3+ frames com trechos de comprimentos distintos.
2. Ativar **Velocidade constante** → confirmar redistribuição por percurso.
3. Clicar **Igualar intervalos**.
4. Confirmar que os intervalos ficam iguais.
5. Confirmar que o botão **Velocidade constante** desliga (volta ao estilo neutro).
6. Confirmar que o botão **Manual** fica ativo (accent).
7. Mover um frame → confirmar que os tempos **não** são redistribuídos automaticamente.

### Teste B — Edição individual no ease panel sai do modo Velocidade constante

1. Ativar **Velocidade constante**.
2. Abrir o painel contextual de um trecho (ícone de easing de um segmento).
3. Alterar o slider de duração do trecho.
4. Confirmar que o valor do trecho muda.
5. Confirmar que **Velocidade constante** desliga.
6. Confirmar que **Manual** fica ativo.
7. Mover um frame → confirmar que os tempos ficam congelados.

### Teste C — Tempo total mantém Velocidade constante ativa

1. Ativar **Velocidade constante**.
2. Alterar o slider **Total** da seção Trechos.
3. Confirmar que **Velocidade constante** permanece ativa.
4. Confirmar que os trechos redistribuem proporcionalmente ao percurso curvo.

### Teste D — Loop não é alterado pela redistribuição

1. Ativar loop; definir duração de loop (ex.: 2.0s).
2. Ativar **Velocidade constante**.
3. Confirmar que a duração do loop não é alterada.
4. Confirmar que apenas os trechos normais (F1→F2, F2→F3…) são redistribuídos.
5. Alterar slider Total → loop continua inalterado.

### Teste E — Preview e MP4

1. Preview com Velocidade constante ativa → OK.
2. Gerar MP4 → sem tela preta, sem travamento.
3. Fazer pequena edição; gerar MP4 novamente → OK.

### Teste F — Versão

1. Abrir app; ir em Configurações.
2. Confirmar que a versão exibida é **v8z4b17g**.

---

## v8z4b17f — constant speed timing by curve length

### Teste 1 — Versão
1. Abrir app; ir em Configurações.
2. Confirmar que a versão exibida é **v8z4b17f**.

### Teste 2 — Modo Manual (padrão)
1. Criar 3 frames.
2. Abrir painel Duração → seção Trechos.
3. Confirmar que o botão **Manual** está ativo (accent) e **Velocidade constante** neutro.
4. Alterar sliders individuais de trecho → confirmar que funcionam normalmente.
5. Mover um frame → confirmar que tempos não mudam automaticamente.

### Teste 3 — Ativar Velocidade constante
1. Com 3 frames e trechos de tamanhos distintos, ativar **Velocidade constante**.
2. Confirmar que o botão **Velocidade constante** fica ativo e a dica aparece.
3. Confirmar que os sliders individuais ficam desabilitados (opacidade reduzida).
4. Trecho mais longo deve receber mais tempo; trecho mais curto menos.

### Teste 4 — Curva real vs. distância reta (Teste B da spec)
1. Criar 2 trechos com distância reta parecida.
2. Arrastar o ponto de controle de um trecho para criar uma curva muito grande.
3. Ativar Velocidade constante.
4. Confirmar que o trecho com curva maior recebeu mais tempo.

### Teste 5 — Persistência geométrica (Teste C da spec)
1. Com modo ativo, mover um frame.
2. Confirmar que os tempos são recalculados automaticamente.
3. Arrastar ponto de controle (curva) de um trecho.
4. Confirmar que os tempos são recalculados automaticamente.
5. Inserir ou remover um frame.
6. Confirmar que os tempos são recalculados automaticamente.

### Teste 6 — Desligar modo (Teste D da spec)
1. Com modo ativo e tempos distribuídos, clicar **Manual**.
2. Confirmar que botão Manual fica ativo e sliders individuais voltam habilitados.
3. Mover um frame → confirmar que tempos NÃO mudam automaticamente.
4. Confirmar que os tempos calculados permanecem congelados.

### Teste 7 — Corte seco 0.0s (Teste E da spec)
1. Definir um trecho manualmente em 0.0s.
2. Ativar Velocidade constante.
3. Confirmar que o trecho 0.0s continua 0.0s.
4. Confirmar que o tempo é distribuído entre os demais trechos.

### Teste 8 — Total via slider
1. Modo Velocidade constante ativo.
2. Alterar o slider **Total** da seção Trechos.
3. Confirmar que os tempos individuais são redistribuídos proporcionalmente.

### Teste 9 — Pausas não são afetadas
1. Definir pausas por frame e acabamento.
2. Ativar Velocidade constante.
3. Confirmar que pausas por frame não mudam.
4. Confirmar que acabamento/loop não muda.
5. Confirmar que o resumo de duração total é coerente.

### Teste 10 — Preview e MP4 (Teste F da spec)
1. Ativar Velocidade constante; clicar Preview → deve funcionar.
2. Gerar MP4 → sem tela preta, sem travamento.
3. Fazer edição pequena; gerar MP4 novamente → ok.

### Teste 11 — Persistência JSON
1. Ativar Velocidade constante; salvar JSON.
2. Reabrir JSON → modo e tempos devem ser restaurados.
3. Confirmar que `segmentTimingMode: "constant-speed"` está no JSON.
4. Abrir JSON antigo (sem `segmentTimingMode`) → deve abrir em Manual sem erros.

### Teste 12 — Botão "Aplicar aos 3" não persiste
1. Abrir painel de easing de um trecho.
2. Confirmar que o botão **Aplicar aos 3** aparece com estilo neutro (borda e cor padrão).
3. Clicar **Aplicar aos 3** → botão deve piscar accent brevemente (~700ms) e voltar ao neutro.
4. Confirmar que o botão NÃO fica continuamente destacado.

### Teste 13 — iPhone/Safari
- Todos os testes acima devem passar no iPhone/Safari.
- Sliders de modo devem responder ao toque sem jitter.
- Redistribuição deve ser rápida e sem travamento.

---

## v8z4b17e — apply all channels active state

### Teste A — Estado inicial do botão

1. Carregar imagem; criar 2+ frames.
2. Abrir painel de easing (SEG. 1-2).
3. Confirmar que o botão **Aplicar aos 3** aparece com estilo neutro (borda e texto padrão) quando os canais têm easings diferentes.
4. Se todos os canais já forem iguais (ex.: todos `linear`), confirmar que o botão aparece ativo (borda + texto em accent).

### Teste B — Botão fica ativo após Aplicar aos 3

1. Criar 3 frames. Abrir painel SEG. 1-2.
2. Canal **Movimento** → clicar **Suavizar**.
3. Clicar **Aplicar aos 3**.
4. Confirmar que o botão **Aplicar aos 3** fica imediatamente destacado (borda + texto accent).
5. Alternar para **Rotação** → botão deve continuar ativo.
6. Alternar para **Escala** → botão deve continuar ativo.
7. Voltar para **Movimento** → botão ainda ativo.

### Teste C — Botão perde destaque ao alterar um canal individualmente

1. Após o Teste B, com botão ativo.
2. Canal **Rotação** → clicar **Acelerar** (diferente de Suavizar).
3. Confirmar que o botão **Aplicar aos 3** perde o destaque imediatamente.

### Teste D — Botão volta a ficar ativo ao igualar os canais novamente

1. Após o Teste C, botão inativo.
2. Clicar **Aplicar aos 3** com Acelerar.
3. Confirmar que o botão volta a ficar ativo.

### Teste E — Estado correto ao abrir outro segmento

1. Aplicar **Suavizar aos 3** no SEG. 1-2 (botão ativo).
2. Abrir painel do SEG. 2-3.
3. Confirmar que o estado do botão reflete os canais do SEG. 2-3 (não do anterior).

### Teste F — Salvar e reabrir JSON preserva o estado visual

1. Aplicar **Suavizar aos 3** no SEG. 1-2.
2. Salvar JSON.
3. Recarregar página e importar o JSON.
4. Abrir painel SEG. 1-2.
5. Confirmar que o botão **Aplicar aos 3** aparece ativo.

### Teste G — Preview e export OK

1. Aplicar easing; clicar Preview → deve funcionar normalmente.
2. Gerar MP4 → deve funcionar normalmente.

---

## v8z4b17d — apply easing to all channels

### Teste A — Botão visível no painel real

1. Carregar imagem; criar 2+ frames.
2. Abrir o painel de easing pelo fluxo normal (tocar no segmento ou botão Ease).
3. Confirmar que o título mostra **SEG. X-Y**.
4. Confirmar que os três botões **Movimento / Rotação / Escala** estão visíveis.
5. Confirmar que o botão **Aplicar aos 3** está visível abaixo do seletor de canal.
6. Confirmar que os cards Constante / Acelerar / Desacelerar / Suavizar continuam presentes.

### Teste B — Aplicar Suavizar aos 3 canais

1. Criar 3 frames. Abrir painel do trecho 1-2.
2. Selecionar **Movimento** → clicar **Suavizar**.
3. Clicar **Aplicar aos 3**.
4. Alternar para **Rotação** → card **Suavizar** deve aparecer ativo.
5. Alternar para **Escala** → card **Suavizar** deve aparecer ativo.
6. Alternar para **Movimento** → card **Suavizar** ainda ativo.

### Teste C — Aplicar Acelerar aos 3 canais

1. Sem mudar de segmento, clicar **Acelerar**.
2. Clicar **Aplicar aos 3**.
3. Verificar que os três canais mostram **Acelerar** ativo ao alternar.

### Teste D — Outros segmentos não afetados

1. Aplicar **Suavizar aos 3** no trecho 1-2.
2. Abrir painel do trecho 2-3.
3. Confirmar que Movimento, Rotação e Escala do trecho 2-3 mostram **Constante** (linear).

### Teste E — Modo global continua funcionando

1. Ativar modo global (ícone globo).
2. Selecionar canal **Rotação** → aplicar **Suavizar**.
3. Confirmar que todos os segmentos têm rotEasings = 'ease-in-out'.
4. Desativar global. Clicar **Aplicar aos 3** num trecho.
5. Confirmar que apenas o trecho atual foi alterado.

### Teste F — Save / Load preserva os 3 canais

1. Trecho 1-2: aplicar **Suavizar aos 3** via botão.
2. Trecho 2-3: deixar **Constante**.
3. Salvar JSON. Reabrir.
4. Verificar que trecho 1-2 mostra Suavizar nos três canais.
5. Verificar que trecho 2-3 mostra Constante nos três canais.

### Teste G — Preview e MP4

1. Configurar conforme Teste B.
2. Preview: animação OK, sem travamento.
3. Gerar MP4 → arquivo OK.

### Teste H — Projeto antigo (sem rotEasings/scaleEasings)

1. Abrir JSON antigo sem esses campos.
2. Abrir painel de trecho; verificar que botão **Aplicar aos 3** aparece.
3. Clicar **Aplicar aos 3** → sem erro, três canais recebem o easing ativo.
4. Preview OK; MP4 OK.

---

## v8z4b17c — show channel easing in segment panel

### Teste A — Botões de canal visíveis no painel real

1. Carregar imagem; criar 2+ frames.
2. Abrir o painel de easing pelo fluxo normal (tocar no segmento ou acessar via botão Ease).
3. Confirmar que o título mostra **SEG. X-Y**.
4. Confirmar que os três botões **Movimento / Rotação / Escala** estão visíveis acima dos cards.
5. Confirmar que os cards Constante / Acelerar / Desacelerar / Suavizar continuam presentes.

### Teste B — Canal Rotação via painel real

1. F1 rotação 0°, F2 rotação 180°.
2. Abrir painel de easing do trecho 1-2.
3. Selecionar **Rotação** → aplicar **Suavizar**.
4. Selecionar **Movimento** → verificar que mostra Constante (linear).
5. Selecionar **Escala** → verificar que mostra Constante.
6. Preview: rotação suaviza visivelmente; percurso e zoom sem alteração.
7. MP4 OK.

### Teste C — Canal Escala via painel real

1. F1 escala normal, F2 zoom maior.
2. Abrir painel de easing do trecho 1-2.
3. Selecionar **Escala** → aplicar **Suavizar**.
4. Selecionar **Movimento** → verificar Constante. Selecionar **Rotação** → verificar Constante.
5. Preview: zoom suaviza; percurso e rotação sem alteração.
6. MP4 OK.

### Teste D — Troca de canal reflete easing salvo

1. Segmento 1-2: Movimento = Acelerar, Rotação = Suavizar, Escala = Desacelerar.
2. Ao clicar cada botão de canal, o card ativo deve mudar para o easing correto.
3. Nenhum card errado deve aparecer destacado.

### Teste E — Global mode

1. Ativar modo global (ícone globo). Selecionar canal Rotação → aplicar Suavizar.
2. Confirmar que todos os segmentos têm rotEasings = 'ease-in-out'.
3. Desativar global. Alterar Escala de um único segmento.
4. Confirmar que apenas aquele segmento mudou.

### Teste F — Save / Load

1. Configurar Movimento, Rotação e Escala diferentes por segmento.
2. Salvar JSON. Reabrir.
3. Abrir painel de trecho; trocar canais e verificar valores preservados.

### Teste G — Projeto antigo (sem rotEasings/scaleEasings)

1. Abrir JSON antigo sem esses campos.
2. Abrir painel de trecho; trocar canais → todos mostram Constante (linear).
3. Preview OK; MP4 OK.

### Teste H — segEasePanel (mini-painel) ainda funciona

1. Abrir segEasePanel via caminho anterior (se acessível).
2. Confirmar que Movimento/Rotação/Escala ainda operam corretamente.
3. Trocar canal no segEasePanel → painel real deve refletir ao reabrir.

---

## v8z4b17b — channel easing controls

### Teste A — Movimento separado

1. Carregar imagem; criar 3 frames.
2. Abrir painel de easing no segmento 1-2 → selecionar canal **Movimento** → aplicar "Saída".
3. Canal Rotação e Escala devem continuar Linear.
4. Preview OK; rotação e escala sem alteração de comportamento.
5. Gerar MP4 → arquivo OK.

### Teste B — Rotação separada

1. F1 com rotação 0°, F2 com rotação 90° ou 180°.
2. Canal **Rotação** → aplicar "Entrada/Saída".
3. Canal Movimento = Linear; Escala = Linear.
4. Preview: rotação suaviza; deslocamento espacial e zoom sem alteração.
5. MP4 OK.

### Teste C — Escala separada

1. F1 escala normal; F2 mais aproximado (zoom in).
2. Canal **Escala** → aplicar "Entrada/Saída".
3. Canal Movimento = Linear; Rotação = Linear.
4. Preview: zoom suaviza; percurso espacial e rotação sem alteração.
5. MP4 OK.

### Teste D — Combinação de canais

1. Segmento 1-2: Movimento = Saída; Rotação = Entrada/Saída; Escala = Entrada.
2. Confirmar que o painel reflete o canal correto ao trocar entre Movimento/Rotação/Escala.
3. Preview OK; MP4 OK.

### Teste E — Save/Load JSON com scaleEasings

1. Criar projeto, configurar easing de escala diferente por segmento.
2. Salvar como JSON.
3. Reabrir o JSON.
4. Confirmar que `scaleEasings` e `rotEasings` preservam os valores.
5. Preview OK.

### Teste F — Projeto antigo (sem rotEasings/scaleEasings)

1. Abrir um JSON antigo sem os campos `rotEasings` e `scaleEasings`.
2. Confirmar que o app não lança erro.
3. Confirmar que ambos os arrays são preenchidos com `'linear'`.
4. Preview OK; MP4 OK.

### Teste G — Inserir/remover frame

1. Criar 3 frames; configurar easings de escala e rotação.
2. Inserir frame entre F1 e F2.
3. Confirmar que `scaleEasings.length === frameCount−1`.
4. Remover frame inserido; confirmar alinhamento dos arrays.
5. Preview OK; MP4 OK.

---

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

