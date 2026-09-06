# ROADMAP

## Prioridade de estabilidade antes da seleção de Frames sobrepostos

- A REG-070 permanece aberta: no Modo Frames, o Stage apresenta o deslocamento visual de profundidade/parallax durante a edição e Roberto relatou reinicialização do PWA após algumas manipulações. A associação é observacional, não uma causa comprovada; a próxima investigação deve reproduzir e instrumentar essa condição antes de qualquer correção de desempenho ou alteração ampla do parallax.
- A REG-071 (seleção de Frames sobrepostos pela borda/área visível) segue como frente funcional separada. Não deve absorver nem mascarar a investigação de estabilidade da REG-070.

## Próxima frente aprovada — seleção múltipla de Ativos

- Roberto aprovou o desenho de seleção múltipla temporária para imagens e Text Assets: entrada pelo painel de Camadas, transformação coletiva no Stage, ajustes contextuais relativos e reordenação como conjunto.
- A primeira entrega fica limitada a mover, escala, rotação e ordem de Camadas. Opacidade, profundidade, visibilidade, timing e efeitos coletivos permanecem evolução posterior.
- Especificação canônica: `docs/superpowers/specs/2026-09-05-asset-multiselection-design.md`.

## Pesquisa futura — ícone e posicionamento do Play de Frames

- Referência visual registrada por Roberto: ícone Lucide `gallery-vertical-end` (imagem recebida em 2026-09-05) como possibilidade para substituir o controle atual de Play Frames.
- Também fica aberta a possibilidade de tirar esse controle da faixa inferior e posicioná-lo sobre o Stage. Nenhuma alteração de ícone, cor, posição, interação ou layout está autorizada nesta rodada; a decisão fica aguardando pesquisa e retomada explícita de Roberto.

## Frente em validação — E9AW: moldura temporal no Play de Frames

- A interpretação E9AP de navegação do Stage foi superada. No Modo Frames, o controle **Frames** ciano e sem borda, contorno ou fundo mantém o viewport imóvel e anima uma moldura editorial transitória, a partir do Frame ativo, pela posição, escala e rotação do sampler canônico. A moldura é laranja continuamente; ao alcançar cada Frame, um marcador ciano separado pisca sobre ele. A seleção canônica e a timeline acompanham suavemente cada passagem, mas os Frames reais voltam a neutro.
- O mesmo controle vira Stop. Sem Loop, Play no último Frame reinicia no primeiro; com Loop, o trecho N→1 fecha e recomeça continuamente. Qualquer toque fora do próprio Play/Stop, inclusive no Stage, interrompe e preserva a seleção do último Frame alcançado. A moldura pode sair da vista sem centralização e é removida no Stop. Não substitui o Play rosa de Preview, não gera MP4 e não altera dados de movimento, Undo/Redo ou autosave.
- A toolbar contextual deve permanecer em uma única linha com rolagem horizontal no iPhone; o controle não aparece no Modo Ativos.

## Atualização 2026-09-03 — itens futuros após E9AP

- **Tremor global em Frame parado:** pesquisar e especificar como o tremor global deve atuar quando o projeto tem um único Frame estático; não implementado nesta PR.
- **Exportar Frame único como imagem:** pesquisar e especificar uma opção explícita de exportar projeto de Frame único como imagem; não implementada nesta PR.

## Atualização 2026-08-29 — E9Z: duplicar, copiar e colar ativos

- Implementado: duplicar uma camada no painel Layers no mesmo lugar; duplicar pelo menu inferior com deslocamento leve; copiar ativo e colar pelo menu `+` no centro da vista atual.
- O menu `+` também recebe imagem do clipboard quando o navegador a disponibiliza, incluindo HEIC/HEIF decodificáveis no Safari. Grupos, múltiplos ativos e formatos além de imagem permanecem futuros.

## Atualização 2026-08-29 — release cut E9Y e próximo ciclo

- A `v8z4b32E9Y`/PR #535 foi mergeada, publicada e aprovada fisicamente por Roberto em iPhone/Safari. É a candidata vigente para a promoção separada a produção.
- Camadas e Profundidade básicas já estão implementadas no runtime aprovado da E9Y. Registros anteriores que as descrevem como pendentes pertencem ao histórico pré-E9Y e não definem o estado atual.
- Engine Sprint permanece não implementado e passa para a próxima rodada de desenvolvimento. A ordem histórica que o colocava como bloqueador da promoção E9Y foi superada por decisão explícita de Roberto.
- Nenhuma melhoria funcional nova deve entrar antes da promoção E9Y.

## Profundidade — implementada após E9N, com ajustes físicos E9W

- Escala contínua `−100..+100`, marcas visuais a cada 20 pontos, labels `−100`, `0` e `+100`, e botões `−5/+5`.
- Thumb, fill e marcas usam a mesma normalização do slider. O ajuste E9W organiza as marcas neutras a cada 20 pontos acima do slider e os labels abaixo, removendo somente as marcas coral grandes; REG-059 permanece sem hipótese de causa atribuída.

## Atualização 2026-08-26 — Camadas/Profundidade pendentes de nova tentativa após rollback E9H

- A PR #516 / `v8z4b32E9H` foi mergeada, publicada e reprovada fisicamente por REG-059; o rollback restaura `v8z4b32E9F6`. Camadas/Profundidade retornam a **PENDENTES DE NOVA TENTATIVA**.
- A próxima tentativa deve seguir `DEC-2026-08-26-01`: lista limpa rolável, primeiro tap abrindo ações contextuais, scroll sem abertura acidental, fechamento pelo Stage, ordem antes da thumbnail, total no cabeçalho, profundidade em ícone + valor e área única de ações. Lock/unlock integra essa tentativa como função aprovada, com propriedade canônica persistida.
- Nada disso está implementado neste rollback. REG-059 permanece aberta e sem causa comprovada; Engine Sprint não foi iniciado e nenhuma etapa posterior avançou automaticamente. REG-052..REG-058 permanecem inalteradas.


Este roadmap organiza áreas de atenção. Ele não aprova automaticamente implementação.

O roadmap detalhado de produto recuperado está registrado em `docs/PRODUCT_ROADMAP.md` como fonte rastreável do backlog de produto, sem autorizar implementação automática dos itens.

## Série pré-promoção (ordem aprovada)

A partir da base auditada `v8z4b32E9C`, a entrega segue uma sequência de PRs separadas, sem uma PR única e gigante. O registro canônico do plano está em `docs/PRE_PROMOTION_RELEASE_PLAN.md`. Ordem:

1. PR funcional de Texto (correção de regressão + melhoria visual localizada), subdividida na rodada de Texto:
   - **E9D — mergeada** (PR #497): reserva de 1 px canônico e editor `Texto | Fonte | Cor | Estilo`.
   - **E9E — mergeada e aprovada fisicamente** (PR #498, merge commit `4254ed370ecee64b7f98d411fe6994b8c4538ba5`): posição (novo texto nasce no centro da vista atual, antes do resize do teclado; editar não recentraliza) + WYSIWYG ao vivo (`pendingTextDraft` é a fonte única da verdade visual; painel, Stage, fundo, seleção e alças refletem o mesmo draft imediatamente). Testada e aprovada por Roberto em iPhone/Safari na build publicada em 2026-08-18 nos itens do seu escopo.
   - **E9F — revisão visual/iconográfica do editor de Texto: MERGEADA** (PR #499, merge commit `82131049e52974a1922206c92bf573b9d2c78ff5`). Estrutura geral aprovada no teste físico de Roberto em iPhone/Safari, porém não aprovada como encerrada.
   - **E9F1 — refino visual/funcional localizado do editor de Texto: MERGEADA e APROVADA fisicamente em 2026-08-19** (PR #500, merge commit `6739dbc018f335ad6b1faead6de4f4469e5ebf78`; build publicada e testada por Roberto em iPhone/Safari). Cabeçalho compacto; ícone de Estilo B+I; ícone de Alinhamento dinâmico; paleta rápida de Cor do texto e Fundo reutilizando a constante única `PROJECT_BG_NEUTRALS` + botão `+`; Fundo "Sem cor/Transparente" com opacidade condicional; localização do VIEWPORT ao editar existente sem mover o asset nem tocar Frames/ProjectWorld/Undo/autosave; Largura Auto compacto + slider step 5. Não antecipa E9G.
   - **E9G — manipulação direta da largura da caixa no Stage por alças laterais: FUTURA, NÃO implementada.** DUAS tentativas sucessivas chegaram a ser mergeadas e foram ambas **REVERTIDAS**: `v8z4b32E9G` (PR #512), revertida em 2026-08-23 após REPROVAÇÃO FÍSICA por REG-057 (reedição de Text Asset não reabre o editor após o ciclo edição → confirmação → Preview); e `v8z4b32E9G1` (PR #514), revertida em 2026-08-24 após REPROVAÇÃO FÍSICA por **REG-058** (após manipulação/edição de largura do Text Asset chegando ao limite, o Stage deixou de permitir edição/interação — causa raiz NÃO comprovada). Ver `docs/DECISIONS.md` (DEC-2026-08-23-02, DEC-2026-08-24-02) e `docs/REGRESSIONS.md` (REG-056, REG-057, REG-058). O conceito permanece aprovado como item futuro; uma nova tentativa exige revisão explícita de REG-028/exatamente quatro alças e nova validação física completa cobrindo AMBAS as regressões descobertas (a sequência de reedição pós-Preview da REG-057 e a interatividade do Stage no limite de largura da REG-058) — ver `docs/TEST_CASES.md` (TC-054).
2. PR funcional de readequação da interface de Layers existente + revisão visual do controle de Profundidade existente. Layers (múltiplos assets, seleção, visibilidade, ordenação, identidades persistentes) e Profundidade/parallax básico **JÁ EXISTEM** e não serão criados do zero; esta frente readequa a interface de acesso/organização e revisa visualmente o controle já implementado.
3. Engine Sprint funcional de Movimento inteligente e intensidade de easing (isolado; não misturar às anteriores), incluindo a avaliação aprovada de override local por trecho: manter o modo Inteligente como padrão global por canal, mas permitir que um trecho específico use ajuste manual sem desligar os demais.
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
- Regressões abertas recém-relatadas devem ser consideradas antes de avançar a próxima frente. Sete regressões, sete status distintos (ver detalhe completo em `docs/REGRESSIONS.md`, não agrupar): **REG-052** (fill dos sliders) está **ABERTA**, não corrigida. **REG-053** (painel de transformação cortado em multi-seleção) foi **RESOLVIDA FISICAMENTE** — Roberto testou a build publicada da `v8z4b32E9F3` em iPhone/Safari e aprovou visualmente. **REG-054** (transformação de multi-seleção afeta apenas um Frame) teve correção implementada/automatizada na `v8z4b32E9F2`, com validação física **PARCIAL** (só a Rotação em multi-seleção confirmada fisicamente; demais itens do checklist ainda pendentes) — não tratar como totalmente validada. **REG-055** (picker de cor do Arco) foi **RESOLVIDA FISICAMENTE** — fato anterior à E9G/E9G1, preservado através de ambos os rollbacks. **REG-056** (largura manual do Text Asset dependente da escala visual) permanece **ABERTA/PENDENTE DE NOVA TENTATIVA**: DUAS implementações sucessivas que a corrigiam (`v8z4b32E9G` e `v8z4b32E9G1`) foram revertidas por regressões distintas descobertas em validação física (REG-057 e REG-058, respectivamente), não por refutação da própria análise de causa raiz da REG-056. **REG-057** (reedição de Text Asset não reabre o editor após o ciclo edição → confirmação → Preview → sair do Preview) está **RESOLVIDA FISICAMENTE PELO ROLLBACK/RESTAURAÇÃO DA E9F6** — fato físico anterior à E9G1, preservado e não reaberto por este segundo rollback; causa raiz da falha original ainda não comprovada. **REG-058** (NOVA — após manipulação/edição de largura do Text Asset chegando ao limite, o Stage deixou de permitir edição/interação, relatada fisicamente por Roberto na build publicada `v8z4b32E9G1`) está **ABERTA** — causa raiz NÃO comprovada; nenhuma hipótese (pointer capture, clamp, overlay, listener, side handle) deve ser afirmada sem evidência. Este roadmap não altera automaticamente a ordem por causa delas: **Roberto decide a ordem efetiva** entre validar/fechar essas regressões e avançar a série pré-promoção. Nenhuma frente seguinte (Layers/Profundidade, Engine Sprint) foi autorizada a avançar por causa deste rollback.

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
- Opção futura em Ajustes para ordenar automaticamente as Camadas pela Profundidade. O padrão atual continua com `depth` e `zIndex` independentes; a opção, quando especificada e implementada em PR funcional própria, deverá ser explícita, reversível e preservar a ordem manual quando desligada.
- Seleção múltipla de Camadas: desenho aprovado para posição, escala, rotação e ordem na primeira entrega; ver a frente aprovada e a especificação de 2026-09-05. Profundidade e demais efeitos coletivos continuam futuros.
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
- [Pesquisa / Infraestrutura QA] Preview físico de PR no iPhone/Safari antes do merge: estudar URL HTTPS isolada por PR e HEAD SHA, identificável e exibida automaticamente na PR, que represente exatamente o SHA atual e invalide aprovação física anterior após novo HEAD. A solução deve evitar cache antigo de Safari/PWA, não sobrescrever a build estável da `main`, não usar credenciais de produção, expirar/remover o preview após fechar ou mergear e não depender de desktop local, token pessoal ou operação manual recorrente. Avaliar GitHub Actions com hosting isolado, subdomínio/namespace próprio ou equivalente, sem escolher fornecedor antes de spike técnico. A regra vigente permanece teste físico pós-merge; `docs/APPROVAL_WORKFLOW.md` só muda quando a infraestrutura for implementada e aprovada.
