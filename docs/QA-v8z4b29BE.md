# QA pendente — v8z4b29BE bugfix: sincronização final do Novo Projeto com template

- Base obrigatória: `v8z4b29BD` (não aprovada — fluxo Novo Projeto: Formato → Template → Imagem → Criar). Esta versão é apenas bugfix de sincronização/finalização após criar Novo Projeto com template, sem alterar o fluxo, ordem, layout ou áreas aprovadas na v8z4b29BC.

## Bug corrigido

- Em `applyTemplate()`, os templates Pan L-R, Zoom in, Zoom out, Pan ↓, Rotação e Círculo definiam `document.getElementById('tbTemplate').textContent`, mas o elemento `#tbTemplate` não existe no DOM atual. Isso lançava `TypeError: Cannot set properties of null`, interrompendo `applyTemplate()` antes de `renderAll()`/`finalizeTemplateApply()`.
- Resultado: `frames`/`frameCount`/`ctrlPts`/`curvesV2` ficavam corretos internamente, mas a timeline, o contador, a label do frame ativo e o Stage não eram re-renderizados — produzindo "0 frames", timeline vazia e Stage com template parcial até o usuário chamar `addFrame()` (que não referencia `#tbTemplate` e completa sua própria sincronização).
- Correção: as 3 atribuições passam a usar guarda de existência (`if (tbTpl) tbTpl.textContent = ...`), permitindo que `applyTemplate()` conclua normalmente e chame `renderAll()`/`updateFrameSelector()`/`finalizeTemplateApply()` para qualquer template.

## QA manual pendente v8z4b29BE

1. Versão visível mostra `v8z4b29BE` (menu, comentário do topo, `APP_VERSION`/`APP_VERSION_NAME`).
2. Novo Projeto continua abrindo o fluxo Formato → Template → Imagem → Criar, sem mudanças visuais.
3. Novo Projeto com "Sem template" gera 1 frame (F1 ativo) imediatamente, contador "1 frame", timeline com F1, Stage com F1.
4. Novo Projeto com template Pan L-R gera 2 frames imediatamente: contador "2 frames", timeline com F1/F2, Stage mostra os 2 frames, curva do trecho visível.
5. Novo Projeto com template Pan ↓ gera 2 frames imediatamente, mesmas condições do item 4.
6. Novo Projeto com template Zoom in gera 2 frames imediatamente, mesmas condições do item 4.
7. Novo Projeto com template Zoom out gera 2 frames imediatamente, mesmas condições do item 4.
8. Novo Projeto com template Rotação gera 2 frames sobrepostos imediatamente, com loop ativado e curva do trecho visível.
9. Novo Projeto com template Círculo gera 8 frames imediatamente: contador "8 frames", timeline com F1–F8, Stage mostra os 8 frames, curvas dos 7 trechos visíveis.
10. Em nenhum caso (com template válido) o contador mostra "0 frames" ou a timeline aparece vazia.
11. `selectedFrameId`/`activeFrameId` (i.e. `activeIdx`) ficam válidos (frame 1 ativo) imediatamente após a criação, sem precisar tocar em outro frame.
12. A label "Frame 1" aparece no menu inferior imediatamente após a criação, para qualquer template.
13. Não é necessário tocar em "Adicionar frame" para sincronizar contador/timeline/Stage.
14. Adicionar um frame após Novo Projeto com template funciona normalmente e respeita o limite de frames (sem avisos de limite incoerentes).
15. Reset Project após Novo Projeto com Pan/Zoom/Rotação/Círculo restaura o estado inicial desse novo projeto (mesma quantidade de frames e curvas), não o JSON/projeto anterior nem 0 frames.
16. Reset Project após Novo Projeto com "Sem template" restaura F1 ativo.
17. Preview continua funcionando para qualquer template.
18. Export MP4 continua funcionando para qualquer template.
19. Salvar JSON continua funcionando.
20. Abrir JSON continua funcionando.
21. Funciona no iPhone/Safari.

## Áreas preservadas (não alteradas)

- Fluxo visual do painel Novo Projeto e ordem Formato → Template → Imagem.
- Menu superior, frame visual do Stage (v8z4b29BC), abas/pontos, faixa superior, cruz central, clamp de criação de frames.
- Timeline/menu inferior visual, curvas/Bézier.
- Preview/export/MP4, JSON, motor.
- Seleção múltipla, menus contextuais, Home/página inicial.
