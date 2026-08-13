# DECISIONS

## DEC-2026-08-09-01 — Hierarquia neutra e densidade dos bottom sheets contextuais

- **Data:** 2026-08-09.
- **Assunto:** superfícies e controles contextuais de Frames e Ativos.
- **Classificação:** produto / UI / QA visual.
- **Decisão:** manter o fundo principal no neutro mais escuro; usar no bottom sheet um neutro discretamente mais claro; usar nos pills um neutro aproximadamente 10–20% mais claro que a superfície; prolongar a superfície aberta até a borda inferior/safe-area; e compartilhar entre Frames e Ativos a mesma geometria contextual compacta.
- **Preservação:** “cor da interface” neste sistema significa somente superfícies neutras e não autoriza substituir ciano de Frames, roxo de Ativos ou outros acentos funcionais.
- **Consequência:** divergência geométrica entre modos, faixa escura sob painel aberto ou mudança colateral dos acentos bloqueia aprovação.
- **Status:** regra aplicada tecnicamente na `v8z4b32E8U`; aprovação visual publicada em iPhone/Safari real permanece pendente.

## DEC-2026-08-08-02 — Registrar texto, presença temporal e comportamento de ativos como proposta futura incremental

- **Data:** 2026-08-08.
- **Assunto:** backlog futuro de quadros de texto e ativos.
- **Classificação:** produto / planejamento / documentação.
- **Decisão:** registrar como direção futura, ainda sem autorização de implementação, que quadros de texto devem evoluir como ativos reais do projeto, com largura ajustável, quebra automática, fundo/transparência e participação em ProjectWorld, Layers, Save/Load, Preview e Export. Registrar também que presença temporal de ativos deve ser tratada separadamente de animação, com preferência inicial por intervalos baseados em frames.
- **Contexto:** Roberto apontou a importância de texto para o propósito do Arco e a necessidade de controlar quando ativos aparecem ou somem, evitando dessincronização quando o controle depender somente de tempo absoluto.
- **Consequência:** futuras PRs devem começar por escopos pequenos: primeiro quadro de texto estático e confiável; depois presença temporal por frames; depois fade in/fade out; depois presets matemáticos simples. Timeline avançada, keyframes manuais e editor complexo permanecem fora de escopo até nova decisão explícita.
- **Status:** proposta documental registrada; não implementada; não autoriza roadmap automático.
- **Documento relacionado:** `docs/PROPOSAL_TEXT_BOXES_AND_ASSET_TIMING.md`.

## DEC-2026-08-08-01 — Fonte persistente canônica de image asset substituído

- **Data:** 2026-08-08.
- **Decisão:** após leitura, decode e preparação válida do drawable, o replace do mesmo `asset.id` atualiza atomicamente `src`, `persistentSrc` e `sourcePayload` para a mesma data URL. Save e Session Autosave serializam essa identidade persistente; drawables e caches permanecem fontes de render, não fontes de verdade do projeto.
- **Contexto:** `sourcePayload` antigo podia sobreviver ao replace e vencer `src` novo no resolvedor compartilhado de persistência.
- **Consequência:** projetos substituídos anteriores à E8S usam `src` do commit canônico como migração quando o flag canônico existe; novos commits mantêm todas as representações persistentes iguais. Undo/Redo restaura e persiste a fonte do estado corrente.
- **Status:** ativa; PR #478 mergeada e validação visual publicada aprovada por Roberto em iPhone/Safari real em 2026-08-08.
- **Versão relacionada:** `v8z4b32E8S`.

## 2026-08-07 — Painéis contextuais e identidade de Preview/Export na v8z4b32E8Q

- Frames e Ativos usam uma apresentação compartilhada de bottom sheet compacto na faixa inferior, sem animação ou handle de arraste nesta versão.
- Painéis são propriedade do modo e nunca atravessam uma troca Câmera/Frames ↔ Ativos.
- Ações individuais de Ativo dependem da resolução canônica de `selectedAssetId`; sem asset existente, permanecem visíveis e desabilitadas.
- O ponto central da timeline e a centralização dos chips compartilham o eixo X da faixa rolável como fonte geométrica única.
- Preview/Export pronto possui token ciano local e não deriva de verde semântico nem do accent do modo.

Formato: ID, data, decisão, contexto, consequência e status.

## DEC-2026-08-07-01 — Verde não pertence à identidade atual da interface

- **Data:** 2026-08-07.
- **Assunto:** identidade cromática da interface.
- **Classificação:** produto / UX / identidade visual.
- **Decisão:** a interface atualmente aprovada do Arco Motion App não utiliza verde como cor de UI. Verde não deve ser introduzido por convenção semântica genérica, design system externo, estados de sucesso ou conclusão, código legado, tokens CSS históricos, diagnósticos, nomes internos ou interpretação do agente. O estado pronto de Preview/Export usa o ciano aprovado próprio do Arco.
- **Exceção:** conteúdo importado pelo usuário não está sujeito a essa restrição cromática.
- **Contexto:** a `v8z4b32E8Q` corrigiu uma regressão na qual o estado de Preview/Export havia retornado ao verde por interpretação incorreta da semântica de sucesso. A regra passa a ser global para impedir recorrência em outros componentes.
- **Consequência:** toda mudança futura de UI deve preservar essa identidade; qualquer introdução futura de verde exige aprovação explícita de Roberto.
- **Status:** aprovada.
- **Versão relacionada:** `v8z4b32E8Q`.

## DEC-001 — Dois modos do app

- Data: data não consolidada.
- Decisão: o app trabalha com os modos Ativos/Mundo e Câmera/Frames.
- Contexto: separar organização de assets/mundo da edição de câmera/frames.
- Consequência: mudanças devem preservar a separação de responsabilidades.
- Status: aprovada.

## DEC-002 — Repositório de teste e repositório estável

- Data: data não consolidada.
- Decisão: `rowestudio/arco-app-test` é desenvolvimento/teste; `rowestudio/arco-app` é estável/produção.
- Contexto: permitir validação antes de promoção.
- Consequência: produção não pode ser alterada por inferência.
- Status: aprovada.

## DEC-003 — Promoção somente após aprovação

- Data: data não consolidada.
- Decisão: promoção para produção só ocorre após aprovação explícita de Roberto.
- Contexto: Roberto valida o comportamento real antes da promoção.
- Consequência: agentes não promovem por conta própria.
- Status: aprovada.

## DEC-004 — Fluxo via branch e PR

- Data: data não consolidada.
- Decisão: mudanças devem ser feitas em branch própria e PR.
- Contexto: preservar revisão, rastreabilidade e rollback.
- Consequência: não encerrar tarefa relevante apenas com alteração local.
- Status: aprovada.

## DEC-005 — Não gerar HTML independente

- Data: data não consolidada.
- Decisão: não criar HTML paralelo fora do repositório para substituir o app.
- Contexto: evitar fontes divergentes e perda de histórico.
- Consequência: mudanças devem ocorrer na base oficial.
- Status: aprovada.

## DEC-006 — Preservar renderer único

- Data: data não consolidada.
- Decisão: preservar renderer único/canônico entre Stage, Preview e Export.
- Contexto: pipelines paralelos tendem a gerar divergência visual.
- Consequência: alterações no renderer exigem escopo explícito.
- Status: aprovada.

## DEC-007 — Teste real em iPhone/Safari

- Data: data não consolidada.
- Decisão: iPhone/Safari é referência real.
- Contexto: o produto é mobile-first e validado visualmente por Roberto.
- Consequência: WebKit automatizado ajuda, mas não substitui Safari real.
- Status: aprovada.

## DEC-008 — Diagnóstico não substitui validação visual

- Data: data não consolidada.
- Decisão: diagnóstico interno não supera relato visual de Roberto.
- Contexto: flags podem estar corretas e ainda assim a UX estar quebrada.
- Consequência: evidência visual e relato humano são decisivos para UX.
- Status: aprovada.

## DEC-009 — Título de PR com versão ou operação

- Data: data não consolidada.
- Decisão: títulos de PR devem conter a versão ou identificação operacional.
- Contexto: facilitar rastreabilidade entre tarefa, versão e release.
- Consequência: PRs documentais usam ID operacional, como `OPS-01`.
- Status: aprovada.

## DEC-010 — WebCodecs como pipeline principal de exportação

- Data: data não consolidada.
- Decisão: o pipeline principal de MP4 é WebCodecs, no caminho Canvas → VideoFrame → VideoEncoder → MP4.
- Contexto: histórico do projeto registrou trancos com `captureStream + MediaRecorder`.
- Consequência: `captureStream + MediaRecorder` não deve voltar como export principal sem decisão explícita e PR própria.
- Status: aprovada.

## DEC-011 — Curva controla caminho, não velocidade

- Data: data não consolidada.
- Decisão: a curva visual controla o caminho do movimento, não a velocidade.
- Contexto: regras históricas em `docs/codex-rules.md` e tarefas de curva/escala foram consolidadas na OPS-01.
- Consequência: não reintroduzir easing na curva sem autorização explícita.
- Status: aprovada.

## DEC-012 — Escala não deve resetar curvas

- Data: data não consolidada.
- Decisão: ajuste de escala, inclusive escala global, não deve resetar, recriar ou alterar curvas existentes.
- Contexto: regressões históricas indicaram curva resetada ao alterar escala, especialmente após carregar projeto ou usar escala global.
- Consequência: não chamar rotinas de reset/recriação de curva como efeito colateral de escala.
- Status: aprovada.

## DEC-013 — v8z3t rejeitada como base

- Data: data não consolidada.
- Decisão: `v8z3t` não deve ser usada como base.
- Contexto: versão histórica descartada por regressão em curva/easing.
- Consequência: tarefas futuras não devem partir dessa base nem reaproveitar sua lógica sem auditoria explícita.
- Status: aprovada.

## DEC-014 — Documentos antigos não são fonte operacional

- Data: 2026-07-16.
- Decisão: documentos antigos de regras, tarefas e versionamento devem ser obsoletados ou marcados como referência histórica após migração do conteúdo válido.
- Contexto: revisão independente apontou risco de fontes paralelas de verdade.
- Consequência: `AGENTS.md` e os documentos oficiais da OPS-01 prevalecem.
- Status: aprovada.

## DEC-015 — Merge direto não é fluxo operacional

- Data: 2026-07-16.
- Decisão: o fluxo obrigatório é branch própria, PR e aprovação; merge direto ou trabalho direto na `main` não é permitido como regra operacional.
- Contexto: regras históricas de versionamento citavam merge de forma genérica.
- Consequência: qualquer promoção ou merge exige PR e autorização aplicável.
- Status: aprovada.

## DEC-2026-07-22-01 — Fonte de verdade e registro obrigatório

- **ID:** DEC-2026-07-22-01
- **Data:** 2026-07-22
- **Assunto:** Fonte de verdade e registro obrigatório
- **Classificação:** Processo / Project OS
- **Decisão:** O chat não é fonte de verdade do projeto. Toda decisão relevante de produto, arquitetura, processo, QA, aprovação, regressão ou roadmap deve ser registrada no Project OS do repositório de teste. A decisão também deve ser refletida no documento temático correspondente: produto em `PRODUCT_RULES.md`; processo em `APPROVAL_WORKFLOW.md` ou `AGENTS.md`; conclusão/liberação em `DEFINITION_OF_DONE.md`; regressão em `REGRESSIONS.md`; planejamento em `ROADMAP.md` ou `PRODUCT_ROADMAP.md`; estado atual em `PROJECT_STATE.md`.
- **Motivo:** Evitar perda de contexto, divergência entre agentes e decisões mantidas apenas em conversas.
- **Impacto:** PRs funcionais ou documentais devem atualizar o Project OS sempre que consolidarem decisões relevantes.
- **O que substitui ou corrige:** Substitui decisões operacionais dependentes apenas do chat.
- **Sistemas/documentos afetados:** `AGENTS.md`, `docs/APPROVAL_WORKFLOW.md`, `docs/DEFINITION_OF_DONE.md`, `docs/PROJECT_STATE.md`, `docs/PRODUCT_RULES.md`, `docs/REGRESSIONS.md`, `docs/ROADMAP.md`, `docs/PRODUCT_ROADMAP.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-02 — Revisão não se limita a checks verdes

- **ID:** DEC-2026-07-22-02
- **Data:** 2026-07-22
- **Assunto:** Revisão técnica e aderência ao objetivo
- **Classificação:** QA / Revisão de PR
- **Decisão:** Checks verdes, diff pequeno, ausência de erro de sintaxe e testes automatizados aprovados não são suficientes para recomendar merge. Antes de liberar uma PR, a revisão deve validar aderência integral ao objetivo, coerência com o sistema já aprovado, ausência de coexistência indevida entre sistema antigo e novo, geometria/UI verificável pelo diff, regressões/preservações e correspondência entre implementação e proposta de produto. Se houver erro previsível no diff, inconsistência, ambiguidade material ou implementação parcial, a PR deve ser bloqueada.
- **Motivo:** A v8z4b32E7Y passou por implementação parcial visualmente reprovada apesar de baixo risco aparente no diff.
- **Impacto:** Revisões precisam avaliar arquitetura, comportamento e evidência visual objetiva, não apenas checks automatizados.
- **O que substitui ou corrige:** Corrige o entendimento de que checks verdes bastam para recomendar merge.
- **Sistemas/documentos afetados:** `docs/DEFINITION_OF_DONE.md`, `docs/APPROVAL_WORKFLOW.md`, `AGENTS.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-03 — Dúvidas materiais devem ser resolvidas antes

- **ID:** DEC-2026-07-22-03
- **Data:** 2026-07-22
- **Assunto:** Tratamento de ambiguidade material
- **Classificação:** Processo / Escopo
- **Decisão:** Quando o objetivo estiver consolidado no Project OS, ele deve ser executado integralmente e não pode ser reduzido pelo agente. Quando houver dúvida material real, deve-se perguntar antes de gerar o prompt ou bloquear a PR e solicitar esclarecimento. Não é permitido escolher silenciosamente uma interpretação menor, parcial ou mais simples.
- **Motivo:** Evitar entregas que pareçam cumprir visualmente uma parte do pedido, mas deixem o problema central sem solução.
- **Impacto:** Agentes devem bloquear ou esclarecer escopo material em vez de simplificar a implementação sem registro.
- **O que substitui ou corrige:** Corrige interpretações silenciosamente reduzidas de objetivos aprovados.
- **Sistemas/documentos afetados:** `AGENTS.md`, `docs/DEFINITION_OF_DONE.md`, `docs/APPROVAL_WORKFLOW.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-04 — Distinção entre regressão grave e implementação incompleta

- **ID:** DEC-2026-07-22-04
- **Data:** 2026-07-22
- **Assunto:** Reversão versus conclusão corretiva
- **Classificação:** Processo / Regressão
- **Decisão:** Regressão grave que quebra ou compromete a base deve recomendar reversão antes de nova tentativa. Implementação incompleta, mas funcionalmente estável e aproveitável, pode ser concluída por nova PR sobre a base atual. A escolha deve ser fundamentada na revisão do código e no impacto observado, e não feita automaticamente. Nesta situação específica, a v8z4b32E7Y é implementação incompleta e visualmente reprovada, mas pode ser corrigida a partir da main atual sem reversão imediata.
- **Motivo:** Diferenciar risco estrutural de entrega incompleta aproveitável.
- **Impacto:** A correção v8z4b32E7Z continua sobre a main atual, sem reverter a PR #449.
- **O que substitui ou corrige:** Corrige a decisão automática de reverter qualquer versão reprovada.
- **Sistemas/documentos afetados:** `docs/REGRESSIONS.md`, `docs/PROJECT_STATE.md`, `docs/APPROVAL_WORKFLOW.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-28-01 — Identidade canônica de seleção de Ativos

- **Data:** 2026-07-28.
- **Decisão:** `selectedAssetId` é a única identidade canônica do Ativo selecionado. Stage, Layers, contexto, toolbar, contorno e reorder devem resolver o objeto exclusivamente por esse ID; aliases legados só podem derivar dele.
- **Contexto:** escritas diretas e observações posicionais permitiam divergência real ou aparente entre componentes após seleção e reorder.
- **Consequência:** nenhuma posição de array, linha, `zIndex`, slot ou rótulo “Imagem N” pode servir como identidade de seleção; reconstruções devem reencontrar o mesmo `asset.id`.
- **Status:** ativa na `v8z4b32E8B`, com aprovação visual pendente em iPhone/Safari real.

## DEC-2026-07-28-02 — Precedência de fontes estáveis na render session

- **Data:** 2026-07-28.
- **Decisão:** Preview e Export usam a mesma rotina de readiness por asset. Um `stableDrawable` com dimensões, pixels e versão de fonte compatíveis é suficiente; a fonte viva não precisa estar simultaneamente pronta. Sem drawable válido, a rotina tenta fonte viva e depois fonte persistente recuperável antes de falhar.
- **Contexto:** fontes DOM são voláteis no Safari/iPhone e não devem invalidar um raster já congelado e comprovadamente desenhável.
- **Consequência:** snapshots de render armazenam apenas fontes estáveis verificadas, nunca pulam assets visíveis e são descartados integralmente se qualquer asset permanecer irrecuperável.
- **Status:** ativa na `v8z4b32E8C`, com validação real em iPhone/Safari pendente.


## DEC-2026-07-28-03 — Identidade nominal persistente de Layers

- **Data:** 2026-07-28.
- **Decisão:** cada image asset recebe uma única sequência positiva e imutável, exibida como `Camada N`; reorder não renomeia, exclusão não libera o número e `nextLayerSequence` nunca recua.
- **Contexto:** nomes posicionais derivados de array ou `zIndex` mudavam a identidade aparente do mesmo asset após reorder.
- **Consequência:** criação e migração passam pela rotina canônica de identidade; Save/Load persiste identidade e contador; `originalFileName` é preservado sem virar título principal.
- **Status:** ativa na `v8z4b32E8D`, com validação real em iPhone/Safari pendente.

## DEC-2026-07-29-01 — Checkpoint integral de sessão em IndexedDB

- **Data:** 2026-07-29.
- **Decisão:** Session Autosave é independente do Save/Load manual, reutiliza `buildProjectData(true)` e `applyProjectData()`, e mantém em IndexedDB somente o último checkpoint completo com checksum e revisão monotônica.
- **Contexto:** reload, descarte de página pelo iOS/Safari e retorno posterior não podem depender do Save manual nem aceitar reconstrução parcial.
- **Consequência:** assets são pré-hidratados antes de qualquer aplicação; falha preserva o checkpoint anterior; Load manual invalida callbacks anteriores e se torna a sessão corrente; Novo Projeto limpa a sessão anterior antes de gravar a nova.
- **Status:** ativa na `v8z4b32E8E`; Session Autosave, Session Restore, preservação de ProjectWorld e Save/Load foram validados por Roberto em iPhone/Safari real.


## DEC-2026-07-29-02 — Relógio do Preview depende do commit do primeiro frame

- **Data:** 2026-07-29.
- **Decisão:** em uma nova abertura do Preview, o relógio visual e o loop de playback só podem iniciar depois que o renderer canônico concluir o desenho final de `t=0` sem erro e o preflight aguardar os ciclos posteriores de composição definidos, preservando os guards de token/fechamento.
- **Contexto:** concluir o warm-up apenas por término da função, sem confirmação posterior ao desenho final, permitia uma travada perceptível no Safari.
- **Consequência:** falha ou cancelamento não marca warm-up concluído, não agenda playback, mantém Export fora do caminho e libera tentativa posterior.
- **Status:** ativa tecnicamente na `v8z4b32E8F`, com aprovação visual pendente em iPhone/Safari real.

## DEC-2026-07-29-03 — Session Autosave normal é isolado de playback/export

- **Data:** 2026-07-29.
- **Decisão:** Session Autosave normal nunca executa build integral, serialização, checksum ou escrita durante preparação/reprodução do Preview ou Export; Play não é mutação do projeto.
- **Contexto:** o `pointerup` global do Play podia vencer o debounce durante a reprodução e executar checkpoint de dezenas de megabytes no thread principal.
- **Consequência:** revisão pendente é preservada e retomada uma única vez após a saída completa; `visibilitychange hidden` e `pagehide` continuam autorizados a ultrapassar a barreira como flush prioritário de segurança.
- **Status:** ativa tecnicamente na `v8z4b32E8G`, com validação real em iPhone/Safari pendente.

## DEC-2026-07-30-01 — Recuperação de sessão exige escolha na abertura normal

- **Data:** 2026-07-30.
- **Decisão:** uma nova instância da página sem intenção explícita de Recarregar só pode restaurar um checkpoint automático válido depois que o usuário escolher “Continuar de onde parei”; a alternativa descarta somente esse checkpoint e mantém o launcher normal.
- **Contexto:** a abertura normal restaurava silenciosamente a sessão anterior, sem permitir que o usuário optasse por iniciar outro fluxo pelo launcher.
- **Consequência:** a inspeção inicial valida schema, completude, payload, checksum, JSON e estrutura mínima sem hidratar ou aplicar o projeto; intenções `restore` e `clean` da E8H mantêm prioridade e nunca abrem a pergunta novamente.
- **Status:** ativa tecnicamente na `v8z4b32E8I`; validação real em iPhone/Safari/PWA permanece obrigatória.
## DEC-2026-08-06-01 — Profundidade de asset não altera geometria canônica

- **Data:** 2026-08-06.
- **Decisão:** `depth` é propriedade finita e persistente de cada image asset, com padrão zero; seu efeito 2.5D inicial é somente um offset translacional calculado por helper compartilhado depois da câmera e antes do desenho.
- **Referência neutra:** centro da célula principal canônica do ProjectWorld. O offset aparente nunca é escrito em `worldX`, `worldY`, `worldW`, `worldH`, `rotation`, Frames, curvas ou ProjectWorld.
- **Compatibilidade futura:** grupos de Frames, templates e blocos continuam operando sobre câmera, Frames, curvas e tempo; aplicar, importar ou duplicar esses grupos não deve zerar nem reescrever a profundidade independente dos assets.
- **Status:** ativa tecnicamente na `v8z4b32E8N`; paridade visual e aprovação em iPhone/Safari real permanecem pendentes.

## DEC-2026-08-06-02 — Profundidade e ordem de camada são independentes

- **Data:** 2026-08-06.
- **Decisão:** `zIndex` define exclusivamente sobreposição/ordem visual e `depth` define exclusivamente intensidade e direção da resposta aparente à câmera; alterar um campo nunca ordena, limita, classifica ou corrige o outro.
- **Integração do Stage:** imagem DOM, seleção, quatro alças e hit-test derivam da mesma geometria visual resolvida a partir da geometria canônica mais o offset temporário de parallax.
- **Painéis:** Escala, Rotação e Profundidade compartilham a região e as métricas contextuais existentes, com somente um painel interativo por vez.
- **Compatibilidade futura:** grupos de frames e templates continuam livres para reutilizar câmera/Frames/curvas/tempo sem alterar profundidade ou ordem dos assets.
- **Status:** ativa tecnicamente na `v8z4b32E8O`; validação visual publicada em iPhone/Safari real pendente.

## DEC-2026-08-06-03 — OPS-04 Mobile CI Watchdog

- **Data:** 2026-08-06.
- **Decisão:** PRs abertas contra `main` devem receber validação automática de `QA Guardrails` e `WebKit Smoke Tests` para o HEAD SHA atual mesmo quando o evento original `pull_request` não criar checks. A OPS-04 usa um watchdog agendado e manual administrativo para detectar suítes ausentes por SHA e publicar check-runs explícitos no SHA correto.
- **Contexto:** o fluxo principal de Roberto é mobile-first; depender de desktop, terminal, GitHub CLI, token pessoal ou execução manual recorrente na aba Actions não é aceitável como solução permanente.
- **Arquitetura:** o workflow `Mobile CI Watchdog` roda na `main`, lê metadados de PRs abertas contra `main`, ignora drafts e forks, consulta workflow runs e check-runs existentes, cria check-runs somente para suítes ausentes e executa os comandos originais no checkout exato do HEAD SHA planejado.
- **Concorrência e frequência:** execução a cada 30 minutos, `workflow_dispatch` administrativo, `concurrency` global do watchdog e `concurrency` por PR/suíte/SHA. Um check existente em `queued`, `in_progress` ou `completed` evita duplicidade no mesmo SHA; mudança de SHA permite nova execução.
- **Segurança:** permissões padrão `contents: read`; o planejamento usa `pull-requests: read`, `actions: read` e `checks: write`; a execução usa `contents: read`, `pull-requests: read` e `checks: write` somente para finalizar o check-run. O código testado fica em `pr-source`, o código do watchdog em `watchdog-source`, ambos com `persist-credentials: false`, e a finalização roda a partir do watchdog da `main`.
- **Limitações:** forks e branches externas são ignorados por segurança; WebKit automatizado em Linux segue sem substituir Safari/iPhone real; falha da Checks API deve aparecer como falha real do workflow, nunca como aprovação simulada.
- **Status:** ativa em OPS-04, sem alteração funcional do aplicativo e sem alteração de versão.

## 2026-08-12 — Gates permanentes por capacidade nativa do navegador

Decisão: manter WebKit/Linux como gate funcional de Text Asset até Preview/composição e usar WebKit/macOS como gate do Export WebCodecs/H.264 real; Chrome 150/Linux foi rejeitado após retornar H.264 não suportado. O split não altera o produto nem reduz o TC-038: isola uma limitação nativa reproduzida também na `main`, enquanto preserva a exigência de validação posterior em iPhone/Safari real.

## DEC-2026-08-13-01 — Draft isolado e tipografia canônica de Text Assets

- **Data:** 2026-08-13.
- **Decisão:** criação e reedição usam um controlador com draft isolado. No Stage o draft substitui visualmente o alvo; Preview, Export e persistência consomem somente o asset confirmado. Concluir sem mudança não cria Undo ou autosave.
- **Tipografia:** `fontKey` usa whitelist local de cinco stacks seguras; peso, estilo e alinhamento usam whitelists. E8X sem `fontKey` migra para Sistema.
- **Interação:** um toque seleciona, a ação primária adaptativa exibe Editar para texto/Trocar para imagem, e dois taps concluídos no mesmo texto abrem o editor sem transformar o asset.
- **Futuro:** fundo e padding pertencem à caixa; presença temporal pertence ao sistema geral de ativos e define quando aparecem, separadamente de animação, que define como aparecem ou se comportam.
- **Status:** implementada tecnicamente na E8Y; validação real em iPhone/Safari pendente.
