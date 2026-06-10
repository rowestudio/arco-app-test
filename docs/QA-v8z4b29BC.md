# QA — v8z4b29BC ajustes finos do frame ativo + menu superior

> Base: v8z4b29BB (remoção do pill do frameHud).

## Escopo

- Aproximar a faixa superior (frameHud) da moldura do frame ativo e melhorar seu alinhamento com os pontos/abas superiores.
- Reduzir o padding interno da faixa superior, preservando o espaçamento entre pausa/rotação/escala da v8z4b29BA.
- Diminuir o tamanho visual das 4 abas/pontos circulares do frame ativo, preservando o centro e a área de toque.
- Tornar a cruz central do frame ativo escalável com o tamanho do frame (clamp suave).
- Reorganizar o menu superior/overlay de ajustes em 4 colunas.
- Renomear "Novo arquivo" para "Novo Projeto" e mover para a linha final de arquivos (Salvar, Novo Projeto, Abrir, Recarregar).
- Preservar: motor, timeline/menu inferior, Preview/export/MP4, JSON, curvas/Bézier, clamp de criação de frames, Novo Projeto guiado/Home, lógica dos handles/abas.

## Implementação

### Tarefa 1, 2 e 3 — Faixa superior (frameHud) mais próxima, alinhada e compacta

- **Causa**: `#frameHud` ficava deslocado `calc(-100% - 14px)` acima do frame, com padding `3px 16px`, resultando em texto "perdido" e distante das abas superiores.
- **Solução**: offset reduzido para `calc(-100% - 6px)` (mais próximo da moldura, sem sobrepor) e padding reduzido para `2px 10px` (mais enxuto, mantendo `gap:16px` entre pausa/rotação/escala da v8z4b29BA).
- **Arquivo**: `index.html` — CSS `#frameHud`, próximo da linha ~1015.
- **Sem alteração em**: conteúdo textual, cálculo de posição (top-center do frame), lógica de valores (pausa/rotação/escala).

### Tarefa 4 — Abas/pontos circulares menores, centro preservado

- **Causa**: `.corner-handle` tinha visual de 22px (já reduzido na v8z4b29BA).
- **Solução**: visual reduzido para 18px (`width`/`height: 18px`, `margin: -9px`). Como a posição é definida pelo centro (left/top do ponto), e a margem negativa é sempre metade do tamanho, o centro permanece exatamente no mesmo lugar. A hit area (`::before`, 44px) não foi alterada.
- **Arquivo**: `index.html` — CSS `.corner-handle`, próximo da linha ~999.
- **Sem alteração em**: lógica de posicionamento (`getRawHandlePosForFrame`, offset `_CORNER_OUT`), hit area, comportamento de scale/rotate.

### Tarefa 5 — Cruz central escalável

- **Causa**: `.frame-crosshair` tinha tamanho fixo (30px) independente do tamanho do frame.
- **Solução**: adicionado `scale(var(--stage-frame-ui-scale,1))` ao transform da cruz. Essa variável já é calculada por `updateStageFrameUIScale()` com clamp entre 0.58 e 1, com base no menor lado do frame relativo a 180px de referência — mesma lógica já usada para outros elementos do frame.
- **Arquivo**: `index.html` — CSS `.frame-crosshair`, próximo da linha ~1031.
- **Sem alteração em**: geometria do frame, posição central, comportamento dos handles, lógica de cálculo de `--stage-frame-ui-scale`.

### Tarefa 6 — Menu superior em 4 colunas

- **Causa**: `.settings-grid` usava `grid-template-columns:repeat(3, minmax(0, 1fr))`.
- **Solução**: alterado para `repeat(4, minmax(0, 1fr))`. Estilo visual, ícones e tipografia dos itens (`.settings-row`) não foram alterados.
- **Arquivo**: `index.html` — CSS `.settings-grid`, próximo da linha ~825.

### Tarefas 7 e 8 — "Novo Projeto" renomeado e movido para a linha de arquivos

- **Causa**: o item "Novo arquivo" ficava na grade principal de ajustes, e a linha final de arquivos tinha apenas Salvar, Abrir e Recarregar.
- **Solução**: removido o item da grade principal e adicionado à grade de arquivos como segundo item, com o rótulo "Novo Projeto": `Salvar → Novo Projeto → Abrir → Recarregar` (4 itens, preenchendo perfeitamente as 4 colunas). O `onclick="showNewFileConfirm();closeSettingsSheet()"` e o ícone `i-file-plus-2` foram preservados sem duplicação.
- **Arquivo**: `index.html` — markup do `#settingsSheet`, próximo da linha ~3062-3097.
- **Sem alteração em**: função `showNewFileConfirm()`, modal "Novo arquivo?", fluxo de criação de projeto a partir de imagem.

## QA manual — checklist

| # | Teste | Resultado |
|---|-------|-----------|
| 1 | Versão visível mostra `v8z4b29BC` | ⬜ |
| 2 | A faixa superior (frameHud) está visivelmente mais próxima da borda superior da moldura | ⬜ |
| 3 | A faixa superior está melhor alinhada horizontalmente com os 2 pontos/abas superiores | ⬜ |
| 4 | O padding da faixa superior está mais enxuto, mas pausa/rotação/escala continuam legíveis | ⬜ |
| 5 | As 4 abas/pontos circulares estão visivelmente menores | ⬜ |
| 6 | O centro de cada aba/ponto permanece exatamente na mesma posição de antes | ⬜ |
| 7 | A área de toque das abas continua confortável no iPhone (mínimo 44px) | ⬜ |
| 8 | A cruz central aumenta/diminui ao escalar o frame ativo | ⬜ |
| 9 | A cruz permanece centralizada e não interativa | ⬜ |
| 10 | O menu superior exibe os itens em 4 colunas | ⬜ |
| 11 | O item "Novo arquivo" não existe mais; em seu lugar há "Novo Projeto" | ⬜ |
| 12 | "Novo Projeto" aparece na última linha de arquivos, na 2ª posição, após "Salvar" | ⬜ |
| 13 | A ordem da última linha de arquivos é: Salvar, Novo Projeto, Abrir, Recarregar | ⬜ |
| 14 | Tocar em "Novo Projeto" abre o fluxo já existente de criação a partir de imagem, sem duplicidade | ⬜ |
| 15 | Rotação do frame funciona normalmente | ⬜ |
| 16 | Escala do frame funciona normalmente | ⬜ |
| 17 | Arrastar aba inicia scale/rotate corretamente | ⬜ |
| 18 | Arrastar o corpo do frame move normalmente | ⬜ |
| 19 | Timeline/menu inferior não muda | ⬜ |
| 20 | Preview/export/MP4 continuam funcionando | ⬜ |
| 21 | JSON abre/salva normalmente | ⬜ |
| 22 | Funciona no iPhone/Safari | ⬜ |
