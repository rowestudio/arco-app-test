# PROJECT_STATE

## Atualização 2026-08-16 — v8z4b32E9D em PR (Texto)

- Base funcional: `02919cba11738d32f0609df1e3d4b641af9a51a7`, `v8z4b32E9C`; HEAD remoto auditado da PR #497 antes da revisão E9D-R1: `b4c177970568b3d354fcd262fad036f3c0153258`.
- O relato visual de texto vertical no iPhone/Safari é real. A E9D adota no limite canônico de medição uma reserva de 1 px entre a largura retornada por `measureText` e a caixa consumida pelo Stage. A hipótese causal de divergência subpixel Canvas × DOM/Safari só será classificada como validada após o gate público WebKit e a validação física oferecerem evidência A/B compatível.
- O editor passa a usar quatro abas reais (`Texto`, `Fonte`, `Cor`, `Estilo`), ícones acessíveis `×`/`✓`, alinhamentos e Auto/Fixa + stepper em Texto, fundo em Cor e alça que minimiza sem confirmar nem persistir. O draft vivo reabre pelo fluxo Editar; confirmação preserva o ID.
- A E9D-R1 corrige o escopo do tablist, remove o listener morto do slider eliminado e amplia o gate público para `R`/`Texto`, Stage, Preview, draft, histórico, fundo, depth, hit-test e quatro alças; o gate H.264 passa a criar `Texto` pelo fluxo E9D. Resultados efetivos constam no plano. Validação visual final no iPhone/Safari permanece obrigatória; produção não foi tocada e nenhuma promoção está autorizada.

## Atualização 2026-08-16 — v8z4b32E9C é a base auditada da série pré-promoção

- HEAD atual da `main` de teste: `8f1b2686ae6cc99bb716b200a79d04281cd968d7`; `APP_VERSION` e `APP_VERSION_NAME` permanecem `v8z4b32E9C`.
- A `v8z4b32E9C` foi mergeada na `main` de teste pela PR #492. A `main` atual inclui também, após esse merge:
  - PR #493 e PR #494: atualização de `assets/icons/apple-touch-icon.png`;
  - PR #495: atualização dos logos SVG do Arco (`assets/brand/arco-logo.svg`, `assets/brand/arco-logo-white.svg`, `assets/brand/arco-logo-symbol.svg`).
- A `v8z4b32E9C` é a **base auditada** desta série, **não** uma promoção liberada. A candidata real de produção será o HEAD posterior à série completa de PRs funcionais, à documentação coerente e à validação completa no iPhone/Safari por Roberto.
- O plano aprovado de entrega é uma série de três PRs funcionais antes de qualquer promoção — (1) Texto, (2) Camadas e Profundidade, (3) Engine Sprint de Movimento inteligente/easing — seguida de revisão integrada no iPhone/Safari. O registro canônico está em `docs/PRE_PROMOTION_RELEASE_PLAN.md`; a sequência também consta em `docs/ROADMAP.md`.
- A promoção para produção permanece **bloqueada** e depende da conclusão dessa série, dos testes obrigatórios e de autorização explícita de Roberto. Nenhuma promoção foi executada.
- Produção (`rowestudio/arco-app`) permanece em `v8z4b32E7H`, commit `626327280e3a4126fac259e205bbe0bdf3cc8719`, fora do escopo desta série. O registro operacional da candidata futura está em `docs/PROMOTION_TO_PRODUCTION.md`.
- Houve testes físicos **parciais** em iPhone/Safari real das versões E9B/E9C — foi esse teste parcial que revelou a regressão aberta de texto vertical registrada em `docs/REGRESSIONS.md`. A validação **completa** de release ainda **não** foi concluída nem aprovada; a evidência automática (checks de CI no HEAD da PR #492) está registrada em `QA.md` como complementar, não substituta.
- Regressão aberta relevante para a série: um Text Asset novo pode aparecer vertical, letra a letra, no Stage/Preview sem edição (registrada em `docs/REGRESSIONS.md`, causa a demonstrar).

## Atualização 2026-08-15 — v8z4b32E9C mergeada (PR #492)

- Item 1 de 4 da série de Text Asset (auto-largura → border-radius → borda com opacidade → opacidade de ativo global). Cada item é PR própria e sequencial; os itens 2–4 não foram adiantados.
- Relato de Roberto: digitar um único caractere deixava a caixa enorme e vazia. A E9C torna a largura da caixa derivada do conteúdo (a LINHA MAIS LONGA, quebra apenas por Enter) como modo padrão do texto NOVO; o padding canônico 0.50em/0.30em da E8Z continua aplicado sobre a largura calculada.
- Modo opcional de LARGURA FIXA (override manual) reintroduz a quebra automática dentro de uma largura travada, útil para storytelling. A alternância é um toggle claro no editor tipográfico (aba **Alinhar**), com slider de largura no modo fixo. A opção de alça de largura no Stage foi descartada por conflitar com o invariante aprovado de exatamente quatro alças (REG-028) do sistema de transformação de Ativos.
- A largura é derivada exclusivamente em `measureTextAsset`, mantendo a cadeia `measureTextAsset → resolveAssetStageVisualGeometry → visualRect` estabilizada pela E9A/E9B; nenhum offset aparente é gravado em geometria, Frames, curvas ou ProjectWorld. Depth/parallax translacional e Preview/Export permanecem inalterados.
- `boxWidthMode` (e o valor travado no modo fixo) persiste em Undo/Redo, Save/Load e Session Restore; projetos legados sem o campo migram para `fixed`, preservando a geometria confirmada anterior.
- Cobertura automatizada E9C em `tests/smoke/app.spec.mjs` cobre caractere único, múltiplas linhas com a largura seguindo a mais longa, alternância auto/fixo com persistência em Undo/Redo e Save/Load, e paridade glifos/fundo/seleção sob profundidade não-zero (padrão `expectHugsSelection`). A execução local do gate em WebKit permanece bloqueada pela ausência do WebKit; verificação equivalente foi executada em Chromium `hasTouch`. Validação final em iPhone/Safari real permanece pendente e nenhuma promoção para produção está autorizada.

## Atualização 2026-08-14 — v8z4b32E9B em PR

- Roberto identificou em iPhone/Safari que, com `depth` finito, seleção, abas e hit-test acompanhavam a paralaxe, mas glifos e fundo do Text Asset permaneciam na posição canônica no Stage.
- Causa raiz: o ramo DOM de texto media a caixa e convertia diretamente `worldX/worldY/worldW/worldH`, enquanto imagens e overlays consumiam `resolveAssetStageVisualGeometry().visualRect`.
- A E9B mede primeiro o texto e posiciona seu único elemento DOM pela geometria visual resolvida existente. O offset aparente não é gravado em geometria, Frames, curvas ou ProjectWorld; Preview e Export permanecem inalterados.
- O teste automatizado E9B define cobertura para profundidades positivas e negativas, DOM/seleção/alças/hit-test, histórico, navegação e persistência; sua execução local permanece bloqueada pela ausência do WebKit no ambiente. A validação final em iPhone/Safari físico permanece pendente e nenhuma promoção para produção está autorizada.
- Revisão corretiva do gate WebKit: 17 testes passaram e o E9B parou no baseline porque a expectativa das abas ignorava os 3 px de borda do contorno. O teste passa a calcular centros pela origem interna, bordas e posições CSS reais, sem alterar o produto, e amplia a evidência de autosave concluído/checkpoint, pan, Manual Save/Load, Continuar sessão e Preview; a execução integral do novo HEAD permanece obrigatória.
- No HEAD `6c57e4a`, a paridade visual direta já passava, mas o diagnóstico lia somente `style.height`; como o Text Asset declara `style.minHeight`, auditava altura zero e gerava falso negativo. A leitura declarativa passa a compartilhar fallback `height → minHeight` (e `width → minWidth`) no mesmo espaço CSS do Stage, mantendo renderer e tolerâncias intactos; os checks do novo HEAD ainda devem ser executados.

Última atualização documental: 2026-08-08.

## Atualização 2026-08-13 — v8z4b32E9A em hotfix

- Relato em iPhone/Safari: a Profundidade escolhida para um Text Asset voltava a zero após medição/redraw e não sobrevivia a Save/Load ou Session Restore.
- A causa raiz eram três limites destrutivos exclusivos de texto: normalização, serialização e hidratação gravavam zero. A E9A preserva qualquer número finito e usa zero somente como fallback legado ou inválido.
- `depth` permanece independente de `zIndex` e afeta apenas o parallax aparente; geometria canônica, Frames, curvas e ProjectWorld não são regravados. Fórmula de parallax, UI e renderer não mudam.
- Cobertura automatizada protege o controle público, Stage/Preview/Export, Undo/Redo, Save/Load e Session Restore. A validação final publicada em iPhone/Safari real permanece pendente e nenhuma promoção está autorizada.

## Atualização 2026-08-11 — v8z4b32E8X em desenvolvimento

- A primeira etapa de Texto introduz `type: "text"` como ativo canônico editável, com criação por `+`, cor, largura/quebra automática e confirmação/cancelamento.
- O mesmo estado textual participa da pilha de Layers, seleção e transformações genéricas, Save/Load, checkpoint de sessão e composição Canvas compartilhada por Preview/Export; drafts não entram em persistência.
- Resize de teclado durante a criação é apenas auditado e não recalcula Frames, ProjectWorld ou ativos confirmados.
- A aprovação final continua dependente de publicação e validação por Roberto em iPhone/Safari real; nenhuma promoção está autorizada.

## Atualização 2026-08-11 — v8z4b32E8W em PR

- A reprodução real após Session Restore comprovou uma regressão de sistema de coordenadas, não de Parallax: Frames do ProjectWorld permaneciam em `baseStageW/baseStageH`, enquanto o sampler da câmera ainda os convertia por `stageW/stageH`, dimensões CSS variáveis do viewport.
- O foco do campo de nome no fluxo Salvar pode redimensionar o viewport no iPhone; o listener global de `resize` então reescalava e gravava novamente todos os Frames do ProjectWorld, fazendo o overlay “pular” para a geometria que a câmera já mostrava.
- A E8W torna `projectWorld.baseStageW/baseStageH` a dimensão canônica compartilhada por câmera, `framesNorm` e Restore, e faz resize de ProjectWorld alterar apenas o viewport/render. A fórmula de Parallax, os renderers, ProjectWorld persistido e o fluxo manual de Save permanecem preservados.
- O teste E8W executa Manual Load → checkpoint real → reload/startup recovery → Preview nos waypoints de todos os Frames → Save com resize, comparando modelo, payload, overlay e câmera por valores reais.
- Nenhuma promoção para produção está autorizada; validação publicada em iPhone/Safari real permanece obrigatória.

## Atualização 2026-08-10 — v8z4b32E8V em desenvolvimento

- Roberto aprovou visualmente em iPhone/Safari real a geometria e a compactação da `v8z4b32E8U`, incluindo pills `−5`/`+5`, Reset, densidade, distância slider → controles e paridade Frames × Ativos.
- Roberto reprovou visualmente na `v8z4b32E8U` as superfícies neutras e a interrupção da superfície do bottom sheet antes da borda inferior.
- A `v8z4b32E8V` corrige exclusivamente essa continuidade no container contextual real e adota os valores canônicos: fundo principal `#3C3C3C`, superfície contextual `#434247` e controles neutros `#505054`. A revisão estrutural final da PR #484 mantém `#lowerContextSheetShell` como item de grid e ancestral visual único das tracks 3–4/safe-area. A causa final confirmada eram três células irmãs ainda presentes no auto-placement com `visibility:hidden`; ao colidirem com o shell, criavam linhas implícitas. Nos estados contextuais abertos, as células de contagem, estado ativo e duração global saem do fluxo com `display:none` e retornam normalmente ao fechar. Painéis permanecem dentro do slot com largura E8O, sem pintura de `body` ou timeline. Esses tokens não autorizam mudanças nos acentos funcionais ciano/roxo.
- Estado: correção em desenvolvimento no repositório de teste; a aprovação visual final permanece dependente de merge/publicação e validação de Roberto em iPhone/Safari real. Nenhuma promoção para produção está autorizada.

## Atualização 2026-08-09 — v8z4b32E8U em PR

- Base confirmada: merge da PR #481 na `main` de teste, commit `53546d1`, versão `v8z4b32E8T`.
- A `v8z4b32E8U` compacta a primitiva geométrica compartilhada de `−5`/`+5` e Reset em Frames e Ativos, reduz a distância para o slider e consolida a superfície neutra contextual até a safe-area.
- A hierarquia aprovada preserva o fundo principal como neutro mais escuro, usa superfície contextual discretamente mais clara e controles cerca de 10–20% mais claros que ela, sem alterar os acentos ciano/roxo.
- Não há alteração de handlers, matemática, transformação, profundidade/parallax, Stage, timeline, Preview ou Export. Aprovação visual final permanece dependente de publicação na `main` de teste e validação de Roberto em iPhone/Safari real.

## Atualização 2026-08-08 — v8z4b32E8T em PR

- Base confirmada: `main` após o merge da PR #479, no commit `2defcfd2462a23ffc8bf3289a2db19009632ec55`, baseline aprovada `v8z4b32E8S`.
- A `v8z4b32E8T` faz os steps e o Reset dos painéis contextuais de Escala e Rotação de Ativos reutilizarem as métricas CSS canônicas dos controles equivalentes de Frames, preservando a identidade roxa dos Ativos e a ciano dos Frames.
- Matemática, handlers, slider, Profundidade, Frames, Preview/Export e persistência permanecem fora do diff funcional. WebKit automatizado em viewport de 390 px protege geometria, overflow, deltas, Undo/Redo/Reset e exclusividade dos modos; aprovação visual publicada em iPhone/Safari real permanece com Roberto.

## Atualização 2026-08-08 — v8z4b32E8S mergeada e aprovada visualmente

- A PR #478 foi mergeada na `main` de teste em 2026-08-08, no commit `18a03dadf13c40e34454181accda99f3b1189437`; a baseline de teste resultante é `v8z4b32E8S`.
- Roberto testou e aprovou visualmente a build publicada em iPhone/Safari real, no viewport 390 × 797, DPR 3, usando um projeto real com 9 image assets e 10 frames.
- O P1 que motivou a versão está resolvido na baseline de teste: após `Trocar imagem`, a fonte nova não regride para a fonte anterior em Save → Load nem em Session Autosave → Session Restore.
- O teste real confirmou Session Restore completo: `sessionRestoreCompleted = true`; `sessionRestoreAppliedSuccessfully = true`; `sessionRestoreAssetCount = 9`; `sessionRestoreHydratedAssetCount = 9`; `sessionRestoreLayerIdentitiesPreserved = true`; `sessionRestoreProjectWorldRestored = true`; `sessionRestoreNoPartialState = true`; `loadedAssetsCount = 9`; `loadedImageAssetsCount = 9`; `loadedHydratedImageAssetsCount = 9`; `loadedStableDrawableCount = 9`; `loadedBlankDrawableCount = 0`; `saveLoadRoundTripIssue = none`.
- A E8S passa a ser a baseline funcional visualmente aprovada corrente do repositório de teste.
- A aprovação da baseline de teste não autoriza promoção automática para produção. `rowestudio/arco-app` permanece dependente de decisão explícita de Roberto e PR separada.

## Atualização 2026-08-07 — v8z4b32E8Q mergeada e aprovada visualmente

- A PR #475 foi mergeada na `main` do repositório de teste no commit `cfef63c74ff90d50d472884d79f3a8a47597362c`.
- A versão atual da base de teste é `v8z4b32E8Q`.
- A `v8z4b32E8Q` consolida Frames e Ativos na mesma apresentação de bottom sheet contextual compacto, com largura total, superfície própria, cantos superiores arredondados e substituição estrutural da toolbar normal.
- A troca entre Câmera/Frames e Ativos fecha o painel do modo anterior; ações individuais de Ativo exigem `selectedAssetId` canônico válido e nenhum painel de Ativo abre sem alvo.
- O ponto laranja da timeline deriva do mesmo eixo geométrico canônico da faixa rolável usado para centralização, sem offset compensatório.
- O estado pronto de Preview/Export volta a usar o ciano fixo aprovado do Arco, independente da cor do modo, sem mudança no renderer, WebCodecs ou download.
- Roberto testou a build publicada em iPhone/Safari real e aprovou visualmente a `v8z4b32E8Q`, que passa a ser a baseline funcional visualmente aprovada corrente do repositório de teste.
- Após essa aprovação, Roberto identificou uma omissão localizada no painel Escala de Ativos: a implementação atual exibe slider, valor e Reset, mas os botões auxiliares de ajuste esperados não estão presentes. Essa pendência pequena e isolada será analisada e especificada em tarefa funcional posterior; ela não está resolvida, não reprova a `v8z4b32E8Q`, não invalida as demais correções aprovadas e não integra esta consolidação documental.
- A aprovação da baseline de teste não autoriza promoção automática para `rowestudio/arco-app`. Produção continua exigindo decisão explícita de Roberto e PR de promoção separada.

## Atualização 2026-08-07 — v8z4b32E8P em PR

- Base confirmada: `main` após o merge da `v8z4b32E8O`, no commit `ea4b8f7`.
- A `v8z4b32E8P` corrige exclusivamente a ocupação estrutural dos painéis contextuais de Escala, Rotação e Profundidade no Modo Ativos.
- Causa: o painel ocultava `#toolbar`, mas permanecia restrito à célula direita da quarta linha de `#lowerContextSlot`; a célula esquerda `.lower-global-duration` (botão Edição) continuava no grid, enquanto o próprio botão `.asset-context-back` conservava a aparência branca nativa de `<button>`, formando o quadrado residual mostrado na referência.
- Correção: o estado `asset-context-panel-open` passa a reutilizar no `#lowerContextSlot` a mesma expansão `grid-column: 1 / 3` e `grid-row: 3 / 5` do painel contextual expandido de Frames, substituindo a faixa normal; a seta reutiliza o tratamento neutro aprovado de `#custBarBack`, sem alterar os controles ou a matemática de transformação.
- Estado: correção em PR; validação visual publicada em iPhone/Safari real permanece obrigatória. Nenhuma promoção para produção está autorizada.

## Atualização 2026-08-06 — v8z4b32E8O em PR

- A `v8z4b32E8N` teve o conceito e o motor de parallax manual aprovados em teste visual no iPhone/Safari; permaneceu uma regressão de integração do Stage, em que o contorno acompanhava a câmera mas a imagem DOM não era recalculada na navegação da timeline.
- A `v8z4b32E8O` consolida uma geometria visual única para imagem, seleção, alças e hit-test do Stage e restaura painéis contextuais exclusivos de Escala, Rotação e Profundidade na região inferior existente.
- Revisão P1: o controle contextual de escala passa a medir 100% contra o baseline fitted canônico em coordenadas do ProjectWorld, não contra pixels naturais da fonte.
- Revisão P1: o Stage recalcula imediatamente a geometria visual derivada de parallax quando a câmera/frame ativo muda sua geometria sem troca de índice.
- `depth` permanece resposta aparente ao movimento da câmera e `zIndex` permanece ordem de sobreposição; nenhum deles deriva ou reescreve o outro.
- A compatibilidade futura permanece: grupos de frames operam sobre câmera, Frames, curvas e tempo sem reescrever profundidade dos assets.
- Estado: correção em PR; QA WebKit e validação visual publicada em iPhone/Safari real permanecem obrigatórios. A E8O não está aprovada e nenhuma promoção para produção está autorizada.

## Atualização 2026-08-06 — OPS-04 em PR

- A OPS-04 restaura o fluxo operacional mobile-first de CI para PRs abertas contra `main` quando eventos `pull_request` não associam automaticamente `QA Guardrails` e `WebKit Smoke Tests` ao HEAD atual.
- Arquitetura escolhida: workflow `Mobile CI Watchdog` em `schedule` moderado e `workflow_dispatch` administrativo, detectando PRs abertas, HEAD SHA corrente e evidência já existente por SHA antes de criar check-runs explícitos via Checks API.
- O watchdog preserva os workflows normais `QA Guardrails` e `WebKit Smoke Tests`; quando eles já existem para o SHA, a OPS-04 não duplica execução. Quando faltam, executa os comandos originais no checkout exato do HEAD da PR e finaliza check-runs no mesmo SHA.
- Revisão bloqueante antes do merge: o watchdog transporta `title` e `body` reais da PR na matriz e define `QA_PR_TITLE`/`QA_PR_BODY` a partir desses metadados, preservando texto multilinha e caracteres especiais para `check-app-version.mjs`.
- Frequência: a cada 30 minutos, com `concurrency` global do workflow e concorrência por PR/suíte/SHA para evitar duplicidade. Novo SHA é elegível para nova validação; resultado de SHA anterior não libera SHA novo.
- Segurança: metadados e finalização usam `contents: read`, `pull-requests: read`, `actions: read` e `checks: write` apenas onde necessário. Checkouts usam `persist-credentials: false`; forks e repositórios externos são ignorados pela automação.
- Recuperação: se o watchdog falhar, executar manualmente `Mobile CI Watchdog` pela aba Actions como ação administrativa; se a Checks API estiver indisponível, a falha fica visível no próprio workflow e não deve ser simulada como sucesso.
- Classificação: infraestrutura crítica de CI/CD, sem alteração funcional do Arco Motion App e sem alteração de `APP_VERSION` ou `APP_VERSION_NAME`.

## Atualização 2026-08-06 — v8z4b32E8N em PR

- Base funcional restaurada: `v8z4b32E8I`, após as reversões das PRs #467 e #461 no repositório de teste.
- A `v8z4b32E8N` adiciona `depth` finito, persistente e independente à imagem, com padrão zero e controle contextual de -100 a +100 no Modo Ativos.
- O parallax inicial é exclusivamente translacional e usa um helper compartilhado no momento do render; não grava o deslocamento aparente em `worldX`, `worldY`, Frames, curvas ou ProjectWorld.
- A referência neutra é o centro da célula principal canônica do ProjectWorld, estável entre Stage, Preview, Export, Save/Load e Session Restore.
- Estado: implementação técnica em PR; QA automatizado e teste visual publicado em iPhone/Safari real permanecem pendentes. O recurso não está aprovado e nenhuma promoção para produção está autorizada.

## Estado auditado

- Repo de desenvolvimento/teste: `rowestudio/arco-app-test`.
- Branch base: `main`.
- HEAD auditado do teste: `9d81fcf0ede89806debc3a42761c846edb642613`.
- Versão corrente do teste: `v8z4b32E8F` (base da E8G em desenvolvimento).
- Repo estável/produção: `rowestudio/arco-app`.
- HEAD auditado de produção: `626327280e3a4126fac259e205bbe0bdf3cc8719`.
- Versão de produção: `v8z4b32E7H`.
- Origem dos dados de produção: auditoria comparativa realizada antes da OPS-01; não revalidado nesta PR.

## Fluxo confirmado

Teste → aprovação de Roberto → promoção para produção.

`v8z4b32E7X` contém evoluções posteriores à produção `v8z4b32E7H`.

Nenhuma promoção está autorizada nesta PR.

Status atual: OPS-02 integrada via PR #439, merge commit `52e4f917e28f148278ba8fc135a0f9a8d4c1eacb`, como infraestrutura de QA com guardrails estáticos, fixtures controladas e self-tests versionados. A execução final da PR do workflow QA Guardrails passou; esse workflow é disparado por `pull_request` ou `workflow_dispatch`, portanto este documento não afirma execução automática no merge commit. Nenhuma promoção está autorizada.

OPS-03 foi integrada via PR #446, merge commit `5d4ebf0b3af48501f61c33c6a20eee67617c3458`, como fechamento inicial dos smoke tests automatizados com Playwright/WebKit. A execução da PR dos WebKit Smoke Tests passou e gerou artifact de screenshot. WebKit automatizado em Linux é evidência operacional útil, mas não substitui validação real em iPhone/Safari. Nenhuma promoção está autorizada.

OPS documental v8z4b32E7X incorporou ao Project OS o backlog de produto recuperado das conversas do projeto Arco Motion App em `docs/PRODUCT_ROADMAP.md`. Esse registro é documental e rastreável, não altera fatos de produção, não altera a versão do app, não modifica OPS-02/OPS-03 e não implica autorização de implementação de todos os itens listados.

## Atualização 2026-07-22 — v8z4b32E7Y reprovada visualmente

- PR #449 mergeada na main de teste com a versão `v8z4b32E7Y`.
- A versão `v8z4b32E7Y` foi reprovada visualmente porque os Ativos passaram a exibir quatro abas decorativas sobre o sistema antigo, mantendo alça antiga de rotação, alça antiga de escala, cinco controles visuais e círculos entrando na imagem.
- Decisão: não reverter imediatamente a PR #449, pois a implementação é incompleta e visualmente reprovada, mas estável e aproveitável para correção sobre a main atual.
- `v8z4b32E7Z` passa a ser a correção em desenvolvimento para concluir a paridade funcional e visual das alças de Ativos com o modelo aprovado dos Frames e registrar as novas decisões operacionais no Project OS.
- Pendente após merge/publicação: validação visual em iPhone/Safari real antes de considerar a versão aprovada por Roberto.


## Atualização 2026-07-28 — v8z4b32E8A em PR

- Base confirmada: `main` no HEAD `6df20c42b6a5192dba2279c0dfff71bd0a1f5ea0`, versão `v8z4b32E7Z`.
- A `v8z4b32E8A` remove na origem o HUD informativo redundante preso aos Frames no Stage, preservando a faixa informativa existente acima da timeline e os elementos funcionais dos Frames.
- Classificação: ajuste visual cirúrgico de UI, sem alteração de Preview, Export, renderer, ProjectWorld, Save/Load, timeline ou motor de Frames.
- Estado: PR técnica em preparação no repositório de teste; nenhuma promoção para produção autorizada.
- Aprovação visual final: pendente de merge, publicação na `main` de teste e validação de Roberto em iPhone/Safari real.

## Atualização 2026-07-28 — v8z4b32E8B em PR

- Base confirmada: `main` no merge commit da PR #451, HEAD `e60f62fcce214a791b66de60189573f735e5a227`, versão `v8z4b32E8A`.
- A `v8z4b32E8B` consolida `selectedAssetId` como identidade canônica da seleção de Ativos entre Stage, Layers, faixa contextual, toolbar, contorno e reorder.
- Causa encontrada: embora já existisse um resolvedor por ID, entradas de seleção ainda escreviam diretamente em `selectedAssetId`/`selectedImageAssetId`, linhas de Layers não expunham o ID no DOM e não havia verificação observacional comum após reconstrução/reorder; além disso, Layers numerava “Imagem N” pela ordem visual enquanto o contexto resolvia o nome pela ordem do array, permitindo rótulos diferentes para o mesmo asset.
- A regra de nomenclatura “Imagem N” foi preservada e nomes persistentes não foram adicionados; a correção desta PR opera exclusivamente sobre identidade por `asset.id`.
- Classificação: bug funcional de seleção e sincronização, risco médio nas interações Stage/Layers/toolbar/reorder.
- Estado: PR técnica em preparação no repositório de teste; nenhuma promoção para produção autorizada.
- Aprovação visual final: pendente de merge, publicação na `main` de teste e validação de Roberto em iPhone/Safari real, inclusive com o projeto complexo de 9 assets.

## Atualização 2026-07-28 — v8z4b32E8C em PR

- Base confirmada: `main` no HEAD `64452debc54e75b46dd237aea8ea0e2d3a5d1de3`, versão `v8z4b32E8B`.
- A `v8z4b32E8C` corrige a preparação compartilhada de Preview/Export para aceitar um `stableDrawable` válido sem exigir simultaneamente decode da fonte viva, e tenta reidratação persistente antes de declarar `asset-not-ready`.
- Causa raiz: a preparação anterior passava toda fonte, inclusive `stableDrawable` já válido, novamente pelo caminho genérico de decode e fazia `allReady` depender de `decodeReady`; assim era possível observar 9 drawables válidos, apenas 8 assets classificados como decoded e abortar a sessão inteira.
- Falha continua explícita e não reduz a contagem visível: snapshot parcial é descartado e estados de loading/locks são liberados para nova tentativa sem reload.
- Aprovação visual final e confirmação 9/9 do projeto real, inclusive do asset `img-1781622678250-715`, permanecem pendentes de merge/publicação e teste em iPhone/Safari real por Roberto.


## Atualização 2026-07-28 — v8z4b32E8D em PR

- Base confirmada: `main` no merge commit da PR #453, HEAD `62d401173caa7c1bafd5f2f191bb454af38e17ec`, versão `v8z4b32E8C`.
- A `v8z4b32E8D` atribui a cada image asset um nome `Camada N` persistente e independente de posição/`zIndex`, com contador monotônico salvo no projeto.
- Projetos antigos recebem migração determinística e não destrutiva; Save/Load, exclusão, reorder e seleção canônica preservam a identidade por asset.
- Aprovação visual final permanece pendente de merge/publicação e validação em iPhone/Safari real por Roberto. Nenhuma promoção para produção está autorizada.

## Atualização 2026-07-29 — v8z4b32E8E mergeada e validada

- A PR #455 foi mergeada na `main` de teste no commit `bed53f960427f18d128d50922daf10d435fa6cdc`, versão `v8z4b32E8E`.
- Roberto aprovou em iPhone/Safari real Session Autosave, Session Restore, preservação de ProjectWorld e Save/Load.
- Export foi aprovado e permanece fluido; o MP4 não apresenta a pequena travada observada exclusivamente no início do Preview.
- A pendência isolada confirmada em projetos diferentes é a pequena travada perceptível no primeiro início do Preview.

## Atualização 2026-07-29 — v8z4b32E8F em PR

- Base de conteúdo confirmada no commit da `main` informado para a tarefa, `bed53f960427f18d128d50922daf10d435fa6cdc`, versão `v8z4b32E8E`; o clone não possuía referência local `main`, mas o `HEAD` de trabalho correspondia exatamente ao commit obrigatório.
- A `v8z4b32E8F` limita-se ao preflight/warm-up do Preview: o relógio e o loop só são liberados após render canônico bem-sucedido de `t=0` e ciclos posteriores de composição, com falha/cancelamento liberando retry.
- Export, WebCodecs, câmera, sampler, matemática do renderer, Save/Load e Session Autosave/Restore permanecem fora do diff funcional.
- Estado: correção em PR no repositório de teste; aprovação visual permanece pendente de merge/publicação e validação por Roberto em iPhone/Safari real. Nenhuma promoção para produção está autorizada.

## Atualização 2026-07-29 — v8z4b32E8F mergeada e v8z4b32E8G em desenvolvimento

- A PR #456 (`v8z4b32E8F`) foi mergeada na `main` de teste no commit `9d81fcf0ede89806debc3a42761c846edb642613`.
- Roberto reprovou visualmente a E8F: a pequena travada inicial persistiu tanto no projeto com 9 ativos (~69 MB por checkpoint) quanto no projeto com 4 ativos (~53 MB).
- Os diagnósticos comprovaram que o primeiro frame `t=0` foi renderizado e composto antes do relógio; essa hipótese fica encerrada como causa da travada observada.
- A `v8z4b32E8G` isola Session Autosave de Preview/Export, removendo o disparo global por `pointerup` e adiando checkpoint pendente sem perda de revisão.

## Atualização 2026-07-30 — v8z4b32E8G aprovada em observação no teste publicado

- No primeiro teste publicado da E8G no iPhone/Safari/PWA, Roberto confirmou Preview sem a travada inicial e Session Autosave funcionando normalmente; após fechar completamente e reabrir o PWA, o último projeto foi restaurado normalmente.
- A E8G fica aprovada em observação no repositório de teste. Repetições com projetos de tamanhos diferentes continuam recomendadas e nenhuma promoção para produção está autorizada.

## Atualização 2026-07-29 — v8z4b32E8G mergeada e v8z4b32E8H em desenvolvimento

- Base confirmada no merge commit da PR #457, `e76ad1987f267d6f7a63df6529b2e8c6c6abbad0`, versão `v8z4b32E8G`.
- A `v8z4b32E8H` substitui a recarga direta por uma escolha explícita entre concluir o checkpoint e restaurá-lo ou apagar somente a sessão automática e abrir o launcher limpo.
- As duas operações aguardam IndexedDB, são mutuamente exclusivas e usam intenção de startup isolada e de uso único; falhas mantêm a abertura atual sem recarga silenciosa.
- Preview, Export, WebCodecs, renderer, Save/Load manual, schema do projeto, Frames, Layers e ProjectWorld permanecem fora do diff funcional. Validação em iPhone/Safari/PWA real continua obrigatória.

## Atualização 2026-07-30 — v8z4b32E8H aprovada e v8z4b32E8I em desenvolvimento

- A PR #458 foi mergeada na `main` de teste no commit `0d8edd33f4d4e236eb3f7a894cdb700db8785c6c`, versão `v8z4b32E8H`.
- Roberto aprovou no teste publicado em iPhone/Safari/PWA os dois caminhos de Recarregar: restaurar sessão e reiniciar do zero. Tela branca/HTML bruto não foi reproduzido, e Preview, Export e Save/Load permaneceram preservados.
- A `v8z4b32E8I` altera somente a abertura normal: sem intenção explícita da E8H e com checkpoint automático completamente válido, o launcher pergunta se deve continuar a sessão anterior ou descartar somente o checkpoint e permanecer no início.
- As intenções explícitas `restore` e `clean` da E8H continuam prioritárias e não abrem uma segunda pergunta. Nenhuma promoção para produção está autorizada.
- O relato isolado sobre intenção escala × rotação de Frames ocorreu em um arquivo específico, não voltou a ser reproduzido e permanece em observação; não integra o escopo da E8I e não autoriza alteração ou PR de Frames nesta versão.
- A revisão da PR #459 substitui o harness paralelo por execução em `vm` dos controladores reais do `index.html`, cobre startup e IndexedDB reais no smoke WebKit e adiciona feedback visual aguardável dentro do modal durante restore/clear, sem novo bump de versão ou mudança na arquitetura funcional.
- A revisão funcional seguinte identificou a causa exata do falso negativo da recuperação: `applyProjectData()` inicia a carga assíncrona da imagem e retornava antes de `applyFrameData()` concluir, portanto `restoreLastSessionAutosave()` consultava `sessionRestoreCompleted` ainda em `false`, mesmo com o editor sendo aplicado logo depois. O restore agora aguarda o callback final da aplicação, separa sucesso operacional das métricas observacionais de paridade e mantém rollback recuperável em falha; a validação automatizada em WebKit permanece responsabilidade do workflow e a validação em iPhone/Safari/PWA real continua pendente.

## QA E8X — split de navegador

A cobertura permanente separa capacidade funcional de Text Asset (WebKit/Linux até Preview real) da capacidade nativa de Export H.264 (WebKit/macOS). Chrome 150/Linux foi rejeitado como gate por retornar H.264 não suportado. O crash da consulta H.264 foi reproduzido na `main` sem texto; portanto, não é tratado como regressão funcional E8X. Aprovação em iPhone/Safari real permanece pendente e obrigatória.

## Atualização 2026-08-13 — v8z4b32E8Y em desenvolvimento

- O Text Asset da E8X passa a usar um editor tipográfico único nos modos `create` e `edit`, aberto por **Editar** na toolbar contextual ou por dois taps concluídos no mesmo texto.
- O draft isolado substitui visualmente o alvo somente no Stage; Cancelar descarta a sessão e Concluir atualiza o mesmo asset com um único Undo e uma única revisão de Session Autosave apenas quando há mudança.
- `fontKey`, família resolvida, `fontWeight`, `fontStyle` e `textAlign` são normalizados, persistidos e compartilhados por Stage, Preview e Export. Aprovação final permanece dependente de publicação e validação por Roberto em iPhone/Safari real.

## Revisão bloqueante 2026-08-13 — v8z4b32E8Y na PR #488

- A mesma versão E8Y mantém as tabs semânticas e corrige os locators Playwright para `role="tab"`.
- Eventos `change` originados no editor enquanto há draft deixam de criar revisão de Session Autosave; os testes comparam `undoStack`, `_sessionAutosaveQueuedRevision`, payload canônico e snapshot real em Cancelar, commit alterado e commit sem alteração.
- `#textCreationSheet` passa a capturar ponteiros e toque em toda a viewport, mantendo o Stage visível e os controles/rolagem horizontal internos operáveis, sem permitir pan, zoom ou edição atrás do sheet.
- Esta revisão atualiza somente a PR #488; produção e merge continuam não autorizados.

## Revisão final de bloqueadores da v8z4b32E8Y na PR #488

- Undo e Redo passam a comparar o snapshot canônico completo antes/depois da restauração e agendam uma revisão de Session Autosave para toda mudança real, mantendo o diagnóstico específico de fonte de imagem sem usá-lo como condição exclusiva.
- `pointercancel` encerra o gesto de asset como cancelado, limpa o tap pendente, restaura um movimento parcial sem histórico e nunca participa da contagem de dois taps concluídos.
- O gate funcional escolhe um ponto de imagem confirmado por `hitTestAssetAtWorld()` e compara o Undo tipográfico com o estado pós-drag, preservando a entrada de movimento anterior.

## Correção do gate WebKit 15/16 na v8z4b32E8Y

- A comparação de Undo/Redo deixa de reutilizar o snapshot reduzido de Reset e passa a usar fingerprint canônico dedicado, incluindo assets, tipografia, ProjectWorld, ordem e identidade de Layers, sem DOM/bitmaps/caches.
- Cancelamento de escala e rotação restaura o snapshot inicial e termina sem Undo ou Session Autosave, como já ocorria no cancelamento de movimento/tap.
- O gate lê e aplica o checkpoint IndexedDB real após Undo e Redo, comprovando paridade do estado restaurado, e mantém a versão E8Y da PR #488.

## Ajuste final do gate funcional E8Y

- O teste de transformação cancelada readquire o Text Asset por `id` após cada `restoreState()`, evitando observar uma referência stale removida de `assets`.
- Checkpoints de Undo e Redo são capturados antes de qualquer restore; o Redo roda com a pilha íntegra, e somente depois ambos os checkpoints são aplicados e validados com retorno de sucesso.
- Movimento parcial cancelado também percorre listeners reais de pointer e comprova geometria, histórico, revisão e estados de gesto intactos.

## Ajuste pós-Session Restore no gate E8Y

- O teste respeita o comportamento existente de Load/Restore voltar ao Modo Câmera e limpar seleção: reentra publicamente em Ativos, readquire o DOM do Text Asset restaurado, toca para selecionar e só então valida **Editar** e o commit sem alteração.
- Nenhum comportamento de Session Restore, modo ou seleção foi alterado no produto para acomodar o teste.

## Atualização 2026-08-13 — v8z4b32E8Z em desenvolvimento

- A E8Z adiciona ao Text Asset a caixa canônica `block`, com fundo sólido opcional, opacidade independente e padding fixo em `em`, preservando wrapping e centro ao alternar o fundo.
- Stage e o compositor Canvas compartilhado por Preview/Export usam o mesmo modelo persistido. Padding customizável, estilos por linha, presença temporal e animação permanecem futuros e separados.
- A revisão geral de interface/contraste permanece tarefa separada e não bloqueia esta entrega funcional.
