# Changelog

## v8z4b10 — No undo on frame selection

- Correção para evitar criação de estado de Undo ao apenas selecionar frame no stage.
- Seleção de frame permanece estado de interface; Undo/Redo ficam reservados para mutações reais de edição.
- Ajuste de limiar mínimo de movimento no drag do frame antes de aplicar mudança e capturar undo.

## v8z3u — stable candidate

Base congelada para migração ao GitHub/Codex.

### Mantém

- Exportação via WebCodecs.
- MP4 sem trancos/kicks no teste principal.
- Curva/easing preservados após rollback da v8z3t.
- Comportamento atual do motor de movimento.
- Pausa por frame.
- Interface atual sem redesenho estrutural.

### Observações

- A v8z3t foi descartada por regressão: quebrou edição de curvas e trouxe de volta comportamento indevido de easing na curva.
- A próxima versão estável mínima deve corrigir apenas bugs pequenos e isolados.

## Próximos fixes candidatos

### Bug — Escala global reseta curvas

No Template Circular, ao alterar escala de vários frames com ajuste Global, as curvas não devem ser resetadas.

### Ajuste visual — Fixar ativo em vermelho

Quando Fixar estiver ativo em algum frame, usar destaque vermelho, não azul.

## v8z3w — Export stability diagnostics

- **Status:** candidata validada em teste prolongado.
- **Resultado:** bug do MP4 exportado sem imagem não foi reproduzido após múltiplos testes.
- **Testes realizados:** múltiplas edições, escala, posição, rotação, easing/transição, fundo branco/preto, múltiplas gerações de MP4 na mesma sessão e retorno para edição após export.
- **Decisão:** não aplicar patch adicional no export neste momento.
- **Fallback:** se o bug voltar, abrir **v8z3x — Isolated export/preview loop guard**.

## v8z4a — 30-frame capacity sprint

- Limite máximo de frames aumentado para 30.
- Capacidade técnica ampliada a partir do limite central de frames, preservando o fluxo atual de criação, remoção, seleção e renderização.
- Projetos antigos com menos frames devem permanecer compatíveis, sem alteração intencional no formato de JSON.
- Checklist de QA inclui teste obrigatório em iPhone/Safari via GitHub Pages com cache busting.

## v8z4b — Insert frame on existing curve

- Correção da inserção de frame dentro de curva existente quando o frame ativo possui próximo frame.
- Preservação do caminho ao dividir o segmento original em dois segmentos mantendo a forma visual da curva.
- Mantida compatibilidade com projetos antigos (JSON e fluxo de edição existente).

## v8z4b1 — Preserve split curve after frame edit

- Correção do reset de curva ao mover/editar frame inserido dentro de curva existente.
- Preservação das curvas adjacentes ao frame movido sem retilinização automática.
- Preservação de ctrlPts manuais dos segmentos vizinhos após a divisão da curva.

## v8z4b3 — Inserted frame pass-through easing

- Correção do easing duplicado ao inserir frame entre dois frames existentes.
- Frame inserido passa a funcionar como ponto de passagem contínua, sem criar desaceleração/aceleração extra no meio.
- Preservação do easing original entre os extremos do trecho original após o split.

## v8z4b2 — Restore curve/easing separation

- Correção da regressão em que o ponto de controle da curva influenciava a sensação de easing/velocidade temporal.
- Restauração da separação entre caminho geométrico (curva) e easing temporal (transição por segmento).
- Mantida a compatibilidade com o patch v8z4b de inserção de frame dentro da curva.
