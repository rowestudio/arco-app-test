# QA — v8z4b29BL

## Escopo

- Corrigir a inconsistência visual entre o frame ativo no Stage, o frame destacado na faixa/timeline, o label inferior e os controles de edição (Pausa/Rotação/Escala/Mover).
- Garantir que, no modo normal de edição de frame, exista um único frame ativo oficial (`activeIdx`), usado simultaneamente por Stage, timeline, label, controles, handles/abas, HUD, Undo/Redo e Preview/export/JSON.
- Preservar seleção múltipla, edição de trecho, ícones Iconoir aprovados (`cinema-old`, `director-chair`), Stage, timeline, Preview/export, JSON e motor.

## Mudanças técnicas

- `getTimelineStageFocusIndex()` passa a retornar sempre `activeIdx` (fonte única de verdade), em vez de um estado paralelo (`timelineFocalFrameId`/`lowerTimelineCenterFrameIndex`) que podia divergir do frame ativo oficial.
- `selectFrameContext(fi)` sincroniza imediatamente `lowerTimelineCenterFrameIndex` e `timelineFocalFrameId` com o novo `activeIdx`, sem depender da animação de centralização da timeline.
- `updateLowerTimelineCenterFrameFromScroll()` (scroll/scrub da faixa de frames) agora também atualiza `activeIdx` quando o frame centralizado muda, mantendo Stage/label/controles sincronizados com o destaque da timeline.
- Extraída a função `refreshActiveFrameVisuals()` (alça global, cantos/handles e HUD do frame ativo) de `renderAll()`, reaproveitada no scrub da timeline sem reconstruir a faixa de pills (preserva a posição de scroll).
- `clearFrameMultiSelectState()` também sincroniza `timelineFocalFrameId` ao sair da seleção múltipla.

## Checklist estático

- [x] Base `v8z4b29BK` confirmada antes das alterações (ícones Iconoir `cinema-old` e `director-chair` presentes e preservados).
- [x] Versionamento atualizado para `v8z4b29BL` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível de versão e comentário/changelog do topo.
- [x] `CHANGELOG.md` e `QA.md` atualizados.
- [x] Nenhuma mudança em ícones Iconoir, visual do frame no Stage, abas/handles, faixa superior, cruz central, toast, launcher, Novo Projeto, menu superior, largura de frames/trechos, snap, bolinhas, curvas/Bézier, Preview/export/MP4, JSON, motor, templates ou formato.

## Checklist manual obrigatório (iPhone/Safari)

- [ ] Tocar em um frame na faixa/timeline: o mesmo frame fica ativo no Stage, o label inferior mostra "Frame N" correspondente e os controles (Pausa/Rotação/Escala/Mover) editam esse frame.
- [ ] Tocar/selecionar um frame no Stage (corpo do frame, handles de rotação/escala/mover): a timeline destaca esse mesmo frame, sem nenhum outro pill aparentando estar "ativo" simultaneamente.
- [ ] Arrastar/scrollar a faixa de frames até centralizar outro frame: Stage, label e controles passam a refletir esse novo frame.
- [ ] Confirmar que não há dois frames parecendo ativos ao mesmo tempo (ex: um pill ciano + outro pill laranja "selecionado") no modo normal de frame.
- [ ] Trocar repetidamente de frame ativo e confirmar que o destaque anterior é removido corretamente (sem "fantasma").
- [ ] Seleção múltipla: selecionar vários frames, confirmar que a seleção múltipla continua funcionando e que nenhum frame é trazido para frente indevidamente.
- [ ] Edição de trecho: selecionar um trecho, confirmar label "Trecho X–Y" e botões contextuais de trecho preservados, sem virar "Frame N" indevidamente.
- [ ] Preview: rodar Preview e confirmar que a animação não é afetada.
- [ ] Export MP4: gerar exportação e confirmar funcionamento normal.
- [ ] Salvar/Abrir JSON: confirmar que projeto salva e recarrega corretamente, com frame ativo coerente.
- [ ] Confirmar ícones Iconoir `cinema-old` (menu superior) e `director-chair` (Tempo/Duração) inalterados.

## Limitações do ambiente

- Não houve validação em iPhone/Safari real neste ambiente automatizado.
- Não houve geração real de MP4 neste ambiente automatizado.
