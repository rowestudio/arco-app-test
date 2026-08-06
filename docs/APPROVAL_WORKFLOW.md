# APPROVAL_WORKFLOW

Fluxo mínimo de aprovação para PRs no repositório de teste.

1. **Checks automatizados:** executar os checks compatíveis com o escopo, incluindo guardrails do Project OS, versão, vazamento de UI, links Markdown, smoke tests e validações específicas quando existirem. A evidência deve corresponder ao HEAD SHA atual da PR; resultado de SHA anterior não libera SHA novo.
2. **Revisão técnica:** revisar o diff, arquitetura, listeners, estado, undo/redo, z-index, geometria e preservação das áreas protegidas.
3. **Revisão de aderência ao objetivo:** confirmar que a implementação corresponde integralmente ao que Roberto pediu, sem interpretação reduzida, sistema paralelo indevido ou coexistência entre solução antiga e nova.
4. **Decisão de merge:** recomendar merge somente quando checks e revisão técnica/produto comprovarem que a PR está completa. Checks verdes sem aderência integral não liberam merge.
5. **Teste publicado no iPhone/Safari:** após o merge aprovado na `main` do repositório de teste e a publicação da build de teste, validar no aparelho/navegador real de referência.
6. **Aprovação visual:** Roberto valida visualmente a experiência publicada. Diagnóstico interno não substitui essa aprovação.
7. **Reversão em caso de regressão grave:** se a versão quebrar ou comprometer a base, recomendar reversão antes de nova tentativa. Se for implementação incompleta, mas estável e aproveitável, registrar a decisão e corrigir por nova PR sobre a base atual.

O chat não é fonte de verdade permanente; decisões relevantes deste fluxo devem ser registradas no Project OS.
