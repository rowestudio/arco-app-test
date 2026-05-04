# Changelog

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
