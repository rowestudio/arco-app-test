# QA_STRATEGY

## Camadas de QA

1. Inspeção de escopo: confirmar que a mudança corresponde ao pedido.
2. Revisão de diff: identificar arquivos fora do escopo, alterações colaterais e risco.
3. Validação estática: buscas, sintaxe, links e versionamento.
4. Self-tests versionados dos guardrails: fixtures positivas e negativas em `test-fixtures/qa-guardrails/` executadas por `scripts/qa/run-self-tests.mjs`.
5. Testes unitários futuros: cobrir funções puras quando forem extraídas ou estabilizadas.
6. Playwright/WebKit futuro: automatizar fluxos críticos em motor próximo ao Safari.
7. Screenshots e comparação visual: detectar alterações de layout e regressões visíveis.
8. Safari/iPhone real: validar o ambiente de referência.
9. Validação humana de Roberto: aprovação final de UX/produto.
10. Promoção para produção: apenas após aprovação explícita e PR próprio.

## Princípios

- WebKit automatizado não equivale sozinho a Safari real.
- Testes automatizados não substituem avaliação de UX.
- Roberto não deve ser a primeira barreira contra erros objetivos.
- Ausência de teste deve ser reportada como “não verificado”.
- Diagnóstico interno não comprova resultado visual.
- Não contratar nem configurar serviço externo nesta PR.

## OPS-02 guardrails

- O workflow `QA Guardrails` roda self-tests antes de validar o repositório real.
- Self-tests devem confirmar casos válidos e inválidos; fixture inválida que passa deve reprovar o runner.
- Em `workflow_dispatch`, a base deve ser resolvida de forma verificável por `origin/main` ou `main`; se não houver base, a validação falha.
- A exceção explícita para PR funcional sem bump é uma linha própria `APP_VERSION_EXCEPTION: <justificativa>`. Palavras incidentais como “exceção” não liberam a regra.
- O Job Summary deve reportar resultado real por camada e não marcar como aprovada uma camada não executada.
- A heurística de vazamento técnico ignora comentários, `script` e `style`, junta texto inline e separa blocos renderizáveis comuns; não substitui avaliação visual.

## Evidência mínima por tipo de tarefa

- Documentação: diff, links internos, ausência de alteração funcional, versão preservada.
- Bug funcional: reprodução, correção, teste relacionado e risco residual.
- Visual/UX: comparação visual e validação em ambiente relevante.
- Engine Sprint: testes de regressão da área do motor e preservação dos sistemas não relacionados.
