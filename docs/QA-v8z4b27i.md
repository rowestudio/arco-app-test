# QA — v8z4b27i referência multi-select, reset de rotação e faixa rolável

## Base confirmada antes das alterações

- `APP_VERSION = v8z4b27h`.
- `APP_VERSION_NAME = v8z4b27h`.
- Texto visível em Configurações: `v8z4b27h`.
- Comentário/changelog do topo coerente com `v8z4b27h`.

## Implementação estática concluída

- Versionamento atualizado para `v8z4b27i` no comentário do topo, constantes JS e texto visível.
- A faixa rolável do menu multi-select reserva largura para `Selecionar todos`, com padding inicial para impedir corte do primeiro item.
- Pausa, Escala e Rotação multi-select usam o primeiro frame da seleção atual como referência.
- `Selecionar todos` limpa/recria a seleção começando pelo frame ativo atual; se não houver referência ativa válida, usa F1.
- Sliders de Escala/Rotação exibem valor absoluto da referência e aplicam delta relativo ao snapshot dos selecionados.
- `Igualar` de Escala/Rotação copia o valor do frame de referência, sem média nem fallback padrão.
- Reset individual de Rotação ressincroniza slider, texto, fill ciano e Stage por rotina central.
- `renderAll()` atualiza o texto dos badges numerados para acompanhar renumeração após inserção.

## Checklist obrigatório

1. Confirmar `APP_VERSION = v8z4b27i`.
2. Confirmar `APP_VERSION_NAME = v8z4b27i`.
3. Confirmar versão visível no app `v8z4b27i`.
4. Confirmar changelog/comentário do topo atualizado.
5. Abrir seleção múltipla e confirmar `Selecionar todos` fixo, sem caixa/borda/pill, e `Pausa` inteira no estado inicial.
6. Rolar a faixa para direita/esquerda, fechar/reabrir e confirmar que nenhum item passa por baixo de `Selecionar todos` e que o scroll volta ao início.
7. Criar frames com escalas diferentes, selecionar F1 depois F2, abrir Escala e confirmar valor de F1; desselecionar F1 e confirmar atualização imediata para F2.
8. Repetir Escala em ordem inversa e com 3 frames removendo o primeiro selecionado.
9. Repetir a regra de referência em Rotação.
10. Confirmar que slider, `+5` e `-5` preservam diferenças entre frames por delta relativo.
11. Confirmar que `Igualar` copia o valor do frame de referência para os demais em Escala e Rotação.
12. Confirmar Undo/Redo com painel aberto sem valor antigo.
13. Em frame individual, rotacionar, fechar/reabrir Rotação, tocar Reset e confirmar 0°, frame visual em 0° e fill/handle ciano sincronizado imediatamente.
14. Inserir/criar frame entre frames rotacionados e confirmar badge/número coerente com os demais após renumeração.
15. Confirmar submenu Alinhar com ícones Lucide exatos e sem labels visíveis.
16. Confirmar Alinhar em frames rotacionados usando bounds visuais e ação correspondente ao ícone.
17. Confirmar que motor, Preview, MP4, JSON, curvas, zoom/pan e ghost frame não sofreram regressão.
