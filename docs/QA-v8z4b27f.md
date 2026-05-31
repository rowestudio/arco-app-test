# QA — v8z4b27f ajustar painéis, ícones e menu rolável de frames selecionados

## Base confirmada antes das alterações

- `APP_VERSION = v8z4b27e`.
- `APP_VERSION_NAME = v8z4b27e`.
- Texto visível em Configurações: `v8z4b27e`.
- Comentário/changelog do topo coerente com `v8z4b27e`.

## Verificações estáticas executadas

- Versionamento atualizado para `v8z4b27f` no comentário do topo, constantes JS e texto visível.
- Painel Pausa do menu de frames selecionados ajustado para centralizar verticalmente o conteúdo, preservar `Voltar`, slider e valor visíveis e não reintroduzir `Zerar`, `Definir pausa`, OK ou Cancelar.
- Undo/Redo cancela a sessão aberta de Pausa antes de restaurar estado e ressincroniza o submenu aberto depois de renderizar o projeto.
- Menu principal de frames selecionados virou `Selecionar todos` fixo à esquerda + faixa de ações horizontal rolável, com áreas de toque preservadas e prevenção de seleção/callout nativos no iPhone/Safari.
- Ícone de `Pausa` trocado para relógio/tempo; `Selecionar todos` trocado para `list-check`; `Alinhar`/`Distribuir` trocados para ícones de objetos/frames; `Zerar` em Escala/Rotação passa a usar o símbolo oficial `i-reset`.
- `Posição` renomeado para `Mover`, mantendo Cima/Baixo/Esq/Dir; `Alinhar` e `Distribuir` expostos no menu principal rolável; `Distribuir` desabilita com menos de 3 frames.
- Preservado: motor de animação, `getStateAtT`, `drawAtT`, Preview, MP4/WebCodecs, JSON estrutural, curvas, zoom/pan e seleção como estado temporário de UI.

## Checklist manual obrigatório antes de promover

1. Confirmar `APP_VERSION = v8z4b27f`, `APP_VERSION_NAME = v8z4b27f` e versão visível `v8z4b27f`.
2. Selecionar 1 frame, abrir Pausa e confirmar painel sem corte, slider/texto/Voltar visíveis e sem botão `Zerar`.
3. Selecionar múltiplos frames, abrir Pausa, alterar valor e confirmar alteração somente nos selecionados.
4. Com Pausa aberta, acionar Undo e Redo e confirmar slider/texto sincronizados ao estado real; fechar painel e confirmar que valor antigo não reaplica.
5. Abrir o menu principal e confirmar ícones de `Pausa` (relógio), `Selecionar todos` (`list-check`) e `Reset`/`Zerar` oficial em Escala/Rotação.
6. Confirmar `Selecionar todos` fixo à esquerda e ações rolando horizontalmente ao lado, sem espremer itens e sem interferir na faixa de frames.
7. Confirmar `Mover` com Cima/Baixo/Esq/Dir em vários frames, sem alterar frames não selecionados.
8. Confirmar `Alinhar` visível no menu principal e funcional com 2+ frames.
9. Confirmar `Distribuir` desabilitado com 2 frames, ativo com 3+ frames e com Undo/Redo funcional.
10. Confirmar botões existentes de Escala e Rotação preservados.
11. Confirmar seleção/deseleção, destaque laranja no Stage/faixa, Selecionar todos, Reset, JSON sem seleção, Preview/MP4 sem overlays, zoom/pan, edição individual, curvas e inserção assistida.
12. Testar em iPhone/Safari real: rolagem horizontal suave, áreas de toque confortáveis, nada escondido pela Home Bar e sem seleção nativa/callout.
