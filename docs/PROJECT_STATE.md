# PROJECT_STATE

Última atualização documental: 2026-08-08.

## Atualização 2026-08-10 — v8z4b32E8V em desenvolvimento

- Roberto aprovou visualmente em iPhone/Safari real a geometria e a compactação da `v8z4b32E8U`, incluindo pills `−5`/`+5`, Reset, densidade, distância slider → controles e paridade Frames × Ativos.
- Roberto reprovou visualmente na `v8z4b32E8U` as superfícies neutras e a interrupção da superfície do bottom sheet antes da borda inferior.
- A `v8z4b32E8V` corrige exclusivamente essa continuidade no container contextual real e adota os valores canônicos: fundo principal `#3C3C3C`, superfície contextual `#434247` e controles neutros `#505054`. A revisão estrutural final da PR #484 mantém `#lowerContextSheetShell` como item de grid e ancestral visual único das tracks 3–4/safe-area; corrige ainda o fechamento prematuro de `#lowerContextSlot` no markup, que havia tornado os painéis irmãos do slot e dividido a geometria flex horizontal. Com os painéis novamente dentro do slot, a largura E8O e a separação shell-superfície/slot-layout são preservadas, sem pintura de `body` ou timeline. Esses tokens não autorizam mudanças nos acentos funcionais ciano/roxo.
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
