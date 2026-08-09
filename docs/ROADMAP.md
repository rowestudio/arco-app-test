# ROADMAP

Este roadmap organiza áreas de atenção. Ele não aprova automaticamente implementação.

O roadmap detalhado de produto recuperado está registrado em `docs/PRODUCT_ROADMAP.md` como fonte rastreável do backlog de produto, sem autorizar implementação automática dos itens.

## Bugs críticos

- A confirmar por tarefa específica.

## Regressões abertas

- Ver catálogo em `docs/REGRESSIONS.md`.
- Não marcar regressão como resolvida sem evidência.
- Regressões históricas de escala/curva e sessão foram migradas de `docs/known-issues.md` para `docs/REGRESSIONS.md`; o status real de correção deve ser confirmado por tarefa específica antes de fechar qualquer item.

## Melhorias de UX

- A confirmar por aprovação explícita de Roberto.

## Melhorias visuais

- A confirmar por aprovação explícita de Roberto.
- Não alterar cor, ícone, texto, layout ou fluxo sem escopo.

## Novas funções autorizadas

- Nenhuma nova função autorizada por este documento.

## Backlog futuro

- Expansão de suíte de regressão.
- Matriz de validação por ambiente.
- Melhor rastreabilidade entre PR, versão, QA e promoção.
- Quadros de texto como ativos reais do projeto, com largura ajustável, quebra automática, transparência e evolução incremental de estilo.
- Presença temporal por ativo, preferencialmente baseada em intervalos de frames, antes de animações complexas.
- Presets simples de comportamento por ativo, separados da presença temporal.
- Colar ativos diretamente no projeto.
- Vista Profundidade 0 / vista absoluta no Modo Ativos, separada da profundidade/parallax básico já implementado.
- Formatos e, na sequência de prioridade indicada, grupos de frames; este registro não autoriza implementação.

## Ideias ainda não autorizadas

- Refatoração ampla do app monolítico.
- Separação de renderer.
- Novos fluxos de UI.
- Serviços externos de teste.
- Timeline avançada, keyframes manuais por ativo ou editor complexo de animação antes de proposta e autorização próprias.

## Infraestrutura e QA

Infraestrutura atual ou desejada, sem implicar implementação completa nesta PR:

- Project OS: implementado.
- Guardrails estáticos de PR com self-tests e fixtures positivas/negativas: implementados via OPS-02.
- Smoke tests iniciais com Playwright/WebKit: implementados via OPS-03.
- Suíte de regressão funcional futura.
- Regressão visual comparativa, fluxos de upload, Preview, Export, Save/Load, múltiplos assets, device cloud e staging fixo permanecem futuros e não autorizados por este documento.
- Avaliação de Safari/iPhone real em nuvem.
- Staging fixo antes do merge.
- Revisão automática/adversarial de PR.
- Fixtures para curvas manuais, escala global, Load e Export WebCodecs.
