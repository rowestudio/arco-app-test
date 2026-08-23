# ROADMAP

Este roadmap organiza áreas de atenção. Ele não aprova automaticamente implementação.

O roadmap detalhado de produto recuperado está registrado em `docs/PRODUCT_ROADMAP.md` como fonte rastreável do backlog de produto, sem autorizar implementação automática dos itens.

## Série pré-promoção (ordem aprovada)

A partir da base auditada `v8z4b32E9C`, a entrega segue uma sequência de PRs separadas, sem uma PR única e gigante. O registro canônico do plano está em `docs/PRE_PROMOTION_RELEASE_PLAN.md`. Ordem:

1. PR funcional de Texto (correção de regressão + melhoria visual localizada), subdividida na rodada de Texto:
   - **E9D — mergeada** (PR #497): reserva de 1 px canônico e editor `Texto | Fonte | Cor | Estilo`.
   - **E9E — mergeada e aprovada fisicamente** (PR #498, merge commit `4254ed370ecee64b7f98d411fe6994b8c4538ba5`): posição (novo texto nasce no centro da vista atual, antes do resize do teclado; editar não recentraliza) + WYSIWYG ao vivo (`pendingTextDraft` é a fonte única da verdade visual; painel, Stage, fundo, seleção e alças refletem o mesmo draft imediatamente). Testada e aprovada por Roberto em iPhone/Safari na build publicada em 2026-08-18 nos itens do seu escopo.
   - **E9F — revisão visual/iconográfica do editor de Texto: MERGEADA** (PR #499, merge commit `82131049e52974a1922206c92bf573b9d2c78ff5`). Estrutura geral aprovada no teste físico de Roberto em iPhone/Safari, porém não aprovada como encerrada.
   - **E9F1 — refino visual/funcional localizado do editor de Texto: MERGEADA e APROVADA fisicamente em 2026-08-19** (PR #500, merge commit `6739dbc018f335ad6b1faead6de4f4469e5ebf78`; build publicada e testada por Roberto em iPhone/Safari). Cabeçalho compacto; ícone de Estilo B+I; ícone de Alinhamento dinâmico; paleta rápida de Cor do texto e Fundo reutilizando a constante única `PROJECT_BG_NEUTRALS` + botão `+`; Fundo "Sem cor/Transparente" com opacidade condicional; localização do VIEWPORT ao editar existente sem mover o asset nem tocar Frames/ProjectWorld/Undo/autosave; Largura Auto compacto + slider step 5. Não antecipa E9G.
   - **E9G — manipulação direta da largura da caixa no Stage por alças laterais: EM IMPLEMENTAÇÃO nesta PR** (`v8z4b32E9G`). Revisão explícita de REG-028/exatamente quatro alças executada: Text Asset ganha exatamente duas side width handles adicionais (seis alças totais), todo outro tipo de Asset permanece com exatamente quatro. Corrige também REG-056 (largura manual dependente da escala). Não marcar concluída/aprovada fisicamente antes do teste publicado.
2. PR funcional de readequação da interface de Layers existente + revisão visual do controle de Profundidade existente. Layers (múltiplos assets, seleção, visibilidade, ordenação, identidades persistentes) e Profundidade/parallax básico **JÁ EXISTEM** e não serão criados do zero; esta frente readequa a interface de acesso/organização e revisa visualmente o controle já implementado.
3. Engine Sprint funcional de Movimento inteligente e intensidade de easing (isolado; não misturar às anteriores).
4. Revisão integrada no iPhone/Safari.
5. PR documental de readiness, se ainda necessária.
6. PR separada de promoção para `rowestudio/arco-app`, somente com autorização explícita de Roberto.

Cada PR funcional parte do HEAD remoto atualizado da `main` de teste, recebe nova versão com `APP_VERSION === APP_VERSION_NAME`, passa por revisão do HEAD atual, QA Guardrails, Browser Smoke Tests, WebKit funcional e export H.264 real, e não libera promoção por si só. Este roadmap organiza a ordem; a autorização de implementação de cada item segue as regras de escopo e aprovação vigentes.

## Bugs críticos

- A confirmar por tarefa específica.

## Regressões abertas

- Ver catálogo em `docs/REGRESSIONS.md`.
- Não marcar regressão como resolvida sem evidência.
- Regressões históricas de escala/curva e sessão foram migradas de `docs/known-issues.md` para `docs/REGRESSIONS.md`; o status real de correção deve ser confirmado por tarefa específica antes de fechar qualquer item.
- Regressões abertas recém-relatadas devem ser consideradas antes de avançar a próxima frente. Cinco regressões, cinco status distintos (ver detalhe completo em `docs/REGRESSIONS.md`, não agrupar): **REG-052** (fill dos sliders) está **ABERTA**, não corrigida. **REG-053** (painel de transformação cortado em multi-seleção) foi **RESOLVIDA FISICAMENTE** — Roberto testou a build publicada da `v8z4b32E9F3` em iPhone/Safari e aprovou visualmente. **REG-054** (transformação de multi-seleção afeta apenas um Frame) teve correção implementada/automatizada na `v8z4b32E9F2`, com validação física **PARCIAL** (só a Rotação em multi-seleção confirmada fisicamente; demais itens do checklist ainda pendentes) — não tratar como totalmente validada. **REG-055** (picker de cor do Arco — nova tentativa `v8z4b32E9F6` após duas reprovações físicas anteriores, E9F4/painel próprio e E9F5/runaway palette) foi **RESOLVIDA FISICAMENTE** — Roberto testou a build publicada em iPhone/Safari e reportou "Tudo ok" para o protocolo físico completo. **REG-056** (largura manual do Text Asset dependente da escala visual, relatada fisicamente por Roberto) teve correção implementada/automatizada na `v8z4b32E9G` (substituição do slider pelas side width handles), com validação física **PENDENTE**. Este roadmap não altera automaticamente a ordem por causa delas: **Roberto decide a ordem efetiva** entre validar/fechar essas regressões e avançar a série pré-promoção. Não avançar automaticamente Layers/Profundidade ou Engine Sprint por causa da E9G.

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
