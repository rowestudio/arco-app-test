# QA — v8z4b29R

## Versionamento

- [x] Base inicial limpa confirmada como `v8z4b29Q` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Versão final esperada: `v8z4b29R`.
- [x] `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29R`.

## Escopo implementado

- [x] Scroll manual da timeline define `timelineFocalFrameId`/`lowerTimelineCenterFrameIndex` e aplica foco/alfa no Stage pelo frame central.
- [x] Bloco focal da timeline recebe destaque visual sem acumular em vários frames.
- [x] Toque em frame no Stage seleciona o frame e agenda centralização programática controlada, sem focar frames intermediários durante a animação.
- [x] Seleção múltipla atualiza apenas o conjunto `selectedFrames`, sem auto-centralizar ou promover frame principal.
- [x] `Selecionar todos` seleciona todos os frames, mantém seleção múltipla ativa e isola eventos de limpeza por propagação.
- [x] Submenus de Pausa/Rotação/Escala/Mover em seleção múltipla abrem em camada superior e não são empurrados pela Linha 3.
- [x] Linha 3 permanece com altura estável e não desloca a timeline nem a Linha 4.
- [x] Blocos de frame na timeline escalam fonte, padding e raio com borda controlada por `clamp()`.
- [x] Menu Formato usa o símbolo Lucide `proportions` existente.

## Checklist manual obrigatório

### A. Timeline → Stage

1. Criar projeto com vários frames.
2. Rolar manualmente a timeline.
3. Confirmar que o frame que passa pelo centro recebe alfa/destaque no Stage.
4. Confirmar que o frame anterior perde o alfa.
5. Confirmar que o bloco central na timeline também fica destacado.
6. Confirmar que não há destaque acumulado.

### B. Stage → timeline

1. Tocar em um frame no Stage.
2. Confirmar que o frame correspondente é selecionado na timeline.
3. Confirmar que a timeline centraliza esse frame suavemente.
4. Confirmar que a timeline para exatamente no centro, sem passar.
5. Confirmar que o menu contextual corresponde ao frame tocado.

### C. Seleção múltipla

1. Entrar em seleção múltipla.
2. Selecionar vários frames.
3. Desmarcar um frame e confirmar que ele perde destaque.
4. Clicar em “Selecionar todos”.
5. Confirmar que todos os frames ficam selecionados.
6. Confirmar que o modo seleção múltipla continua ativo.
7. Confirmar que nenhum frame individual é centralizado ou ganha hierarquia.

### D. Menus contextuais em seleção múltipla

1. Em seleção múltipla, abrir Pausa.
2. Abrir Rotação.
3. Abrir Escala.
4. Abrir Mover.
5. Confirmar que o submenu cobre Linha 3, Linha 4 e Coluna 1 quando necessário.
6. Confirmar que “Selecionar todos” não empurra nem corta o submenu.
7. Confirmar que sliders não ficam prensados/cortados.
8. Confirmar que a Linha 3 fica por baixo e não interfere.

### E. Responsividade dos blocos

1. Verificar frames pequenos na timeline.
2. Confirmar que número, padding, raio e respiro interno diminuem junto com o bloco.
3. Confirmar que a borda mantém espessura mínima legível.
4. Confirmar que o número não fica grande demais nem solto dentro do bloco.

### F. Ícone Formato

1. Confirmar que o menu Formato usa Lucide `proportions`.

### G. Regressão rápida

1. Confirmar que os pontos laranja continuam centralizados.
2. Confirmar que Preview abre e fecha.
3. Confirmar que Undo/Redo básico continua funcionando.
4. Confirmar que JSON/export não foram alterados.
5. Confirmar que curvas continuam visíveis e editáveis.

## Observação

- QA visual/interativo completo deve ser executado em iPhone/Safari ou em ambiente que reproduza WebKit mobile.
