# QA_STRATEGY

## Camadas de QA

1. Inspeção de escopo: confirmar que a mudança corresponde ao pedido.
2. Revisão de diff: identificar arquivos fora do escopo, alterações colaterais e risco.
3. Validação estática: buscas, sintaxe, links e versionamento.
4. Testes unitários futuros: cobrir funções puras quando forem extraídas ou estabilizadas.
5. Playwright/WebKit futuro: automatizar fluxos críticos em motor próximo ao Safari.
6. Screenshots e comparação visual: detectar alterações de layout e regressões visíveis.
7. Safari/iPhone real: validar o ambiente de referência.
8. Validação humana de Roberto: aprovação final de UX/produto.
9. Promoção para produção: apenas após aprovação explícita e PR próprio.

## Princípios

- WebKit automatizado não equivale sozinho a Safari real.
- Testes automatizados não substituem avaliação de UX.
- Roberto não deve ser a primeira barreira contra erros objetivos.
- Ausência de teste deve ser reportada como “não verificado”.
- Diagnóstico interno não comprova resultado visual.
- Não contratar nem configurar serviço externo nesta PR.

## Evidência mínima por tipo de tarefa

- Documentação: diff, links internos, ausência de alteração funcional, versão preservada.
- Bug funcional: reprodução, correção, teste relacionado e risco residual.
- Visual/UX: comparação visual e validação em ambiente relevante.
- Engine Sprint: testes de regressão da área do motor e preservação dos sistemas não relacionados.
