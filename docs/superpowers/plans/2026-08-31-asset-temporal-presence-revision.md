# Presença temporal de ativos — plano de implementação revisado

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use `superpowers:subagent-driven-development` (recomendada) ou `superpowers:executing-plans` para executar este plano tarefa por tarefa. As etapas usam checkboxes (`- [ ]`) para acompanhamento.

**Objetivo:** implementar presença temporal para imagens e Text Assets: cada ativo poderá entrar e sair em um instante do projeto, ancorado no projeto, em um Frame estável ou no evento de outro ativo. Fora do intervalo, Stage mantém uma referência editorial identificável; Preview e Export omitem o ativo.

**Arquitetura:** um modelo persistente de limites temporais e um resolvedor puro convertem todas as âncoras para segundos do projeto. O Stage consome esse resolvedor apenas para apresentação editorial; o caminho de renderização existente consome o mesmo resultado para incluir ou omitir o ativo em Preview/Export. Referências semânticas guardam IDs estáveis; somente valores em segundos participam da escala proporcional de duração.

**Stack:** aplicativo HTML/CSS/JavaScript monolítico em `index.html`; Playwright WebKit mobile; IndexedDB para Session Autosave; smoke tests em `tests/smoke/app.spec.mjs`.

**Especificação vinculante:** `docs/superpowers/specs/2026-08-31-asset-temporal-presence-editor-reference-revision.md`. Ela prevalece sobre o plano de 2026-08-30 onde houver divergência.

## Restrições globais

- Esta é uma única PR funcional de Engine Sprint, criada a partir da `origin/main` atual em uma branch nova; não alterar a PR documental #548 nem reutilizar seu branch para a implementação.
- Antes de editar, executar os gates de `AGENTS.md`: autenticação GitHub pela rota de rede autorizada, `git fetch`, base/remote/worktree limpos e leitura do Project OS. Se um gate material falhar, não alterar arquivos.
- Reservar uma versão inédita verificando `APP_VERSION` e `APP_VERSION_NAME` contra `origin/main`; ambos devem receber exatamente a mesma nova versão. Nunca reutilizar uma versão já exposta para teste.
- Não implementar nesta PR opacidade manual de ativo, fade, zoom, movimento, efeito de entrada/saída, easing, curvas, alterações de câmera ou promoção para produção.
- Não alterar `getStateAtT` nem a matemática de câmera. O tempo `t` já recebido pelo renderizador é apenas encaminhado ao resolvedor de presença.
- `visible` continua significando visibilidade manual da camada. Presença temporal nunca grava ou altera `visible`, `worldX/Y/W/H`, `depth`, `zIndex`, Frames, curvas ou ProjectWorld.
- O Stage não usa opacidade manual do asset para comunicar ausência temporal: fora do intervalo, aplica somente uma classe editorial não persistida (conteúdo suavizado + contorno neutro tracejado). Quando selecionado, o coral de Ativos continua prevalecendo na seleção.
- Preview e Export não incluem referência, tracejado, seleção, handles ou scrim editorial; consomem somente a decisão canônica de presença.
- A mesma função de resolução deve ser usada no Stage, Preview, Export, Delete, Undo/Redo e diagnósticos. Não criar um segundo renderer, uma cache de tempo paralela ou conversões por índice de Frame.
- iPhone/Safari continua a referência final. Diagnóstico e smoke tests confirmam comportamento técnico, não substituem validação física.

## Contratos de dados aprovados

```js
// Todos os IDs são strings persistentes.
Frame = { id, x, y, w, h, rotation, ... }

TemporalBoundary = {
  anchor: 'project' | 'frame' | 'asset',
  anchorId: string | null,       // frameId ou assetId; null para project
  assetEvent: 'entry' | 'exit' | null,
  offset: { unit: 'seconds' | 'projectFraction', value: number }
}

AssetPresence = {
  mode: 'inherit' | 'custom',
  entry: TemporalBoundary | null,
  exit: TemporalBoundary | null
}

ProjectAssetPresenceDefaults = {
  entry: TemporalBoundary | null,
  exit: TemporalBoundary | null,
  scaleSecondsWithProjectDuration: boolean // padrão true
}
```

- Sem Entrada, o limite inicial é `0`; sem Saída, o final é `totalDurationFull()`.
- Para `project`, `anchorId` é nulo e `offset.value` é o instante do projeto; uma fração vale `value * totalDurationFull()`.
- Para `frame`, o instante é a chegada do `frameId` no tempo do projeto. Para `asset`, o instante é o limite Entrada ou Saída já resolvido do `assetId` indicado.
- `entry > exit`, auto-referência, referência ausente e ciclos não podem ser confirmados. O resolvedor reporta o motivo sem mutar modelo; a UI preserva a edição e informa o erro.

## Task 1: Fundar IDs de Frame e o resolvedor puro, com teste que falha primeiro

**Arquivos:**
- Modificar: `index.html` — criação/inserção/carregamento de Frames; normalização de assets; helpers de duração.
- Modificar: `tests/smoke/app.spec.mjs` — grupo `E9AG — presença temporal: modelo canônico`.

**Interfaces:**
- Adicionar `newFrameId()`, `ensureFrameIds()`, `normalizeTemporalBoundary(value)`, `normalizeAssetPresence(asset)`, `normalizeProjectAssetPresenceDefaults(value)`.
- Adicionar `getProjectTimeAtFrameId(frameId)`, `resolveTemporalBoundary(boundary, context)`, `resolveAssetPresenceAt(assetId, projectTime, context)` e `isAssetPresentAt(assetId, projectTime, context)`.
- `resolveAssetPresenceAt` retorna `{ configured, present, entryTime, exitTime, invalidReason }` e é puro: não cria Undo, não salva e não muda estado canônico.

- [ ] Escrever no smoke um fixture mínimo com dois Frames e três assets: um com entrada por segundos do projeto, um com entrada por `frameId` e outro com Entrada baseada na Entrada do primeiro asset. Expor a chamada no `page.evaluate` e exigir ausente antes do limite e presente no limite.
- [ ] Executar `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --workers=1 --retries=0 -g "E9AG — presença temporal: modelo canônico"`; confirmar que falha porque o resolvedor e os IDs ainda não existem.
- [ ] Implementar IDs de Frame persistentes no construtor padrão, em `addFrame`, `insertFrameAfterActive`, `applyFrameData` e em qualquer migração de Frame. Projetos legados recebem ID novo uma única vez ao carregar, sem alterar geometria ou a ordem visual.
- [ ] Implementar o resolvedor com uma pilha `visitingAssetIds`: referência repetida devolve `invalidReason:'cycle'`; referência a si mesmo devolve `invalidReason:'self-reference'`; referência removida devolve `invalidReason:'missing-reference'`.
- [ ] Calcular tempo de chegada do Frame por fonte canônica de pausas e `segDurations`; não reutilizar `_segGlobalTimeWindow30ZC`, pois ele é diagnóstico observacional. Cobrir entrada, saída, sem limites, offset negativo, `projectFraction`, Frame e ciclo.
- [ ] Reexecutar o gate focado. Acrescentar asserções de que uma chamada ao resolvedor não alterou `worldX/Y/W/H`, `depth`, `zIndex`, Frame, curvas ou `visible`.
- [ ] Fazer um commit isolado: `feat: add canonical asset temporal presence resolver`.

## Task 2: Persistir, restaurar e incluir presença no histórico canônico

**Arquivos:**
- Modificar: `index.html` — `captureState`, `restoreState`, fingerprint canônico, `serializeProjectAsset`, `buildProjectData`, `applyProjectData`, `applyFrameData`, `restoreProjectAssetsFromData`.
- Modificar: `tests/smoke/app.spec.mjs` — grupo `E9AG — presença temporal: persistência e histórico`.

**Interfaces:**
- `buildProjectData()` grava `assetPresenceDefaults`, `scaleSecondsWithProjectDuration` e `AssetPresence` de cada asset.
- A serialização de Frames preserva `frame.id`; quando a estrutura de coordenadas escolhida não carrega IDs, persistir um mapa `frameIds` paralelo indexado à mesma ordem.
- `captureState`, Undo/Redo e o hash canônico carregam `assetPresenceDefaults` e cada `asset.presence`.

- [ ] Escrever primeiro um teste que constrói uma configuração customizada, salva com `buildProjectData(true)`, chama a restauração pública e exige igualdade estrutural dos `frameId`, limites e modo `inherit/custom`.
- [ ] Executar o teste focado; confirmar a falha por ausência dos campos no payload ou no histórico.
- [ ] Persistir a presença na mesma rota de imagem e Text Asset, aplicando normalização defensiva a projetos antigos sem os campos. O padrão legado é `inherit` sem limites, portanto o asset continua presente o tempo inteiro.
- [ ] Incluir presença e defaults no snapshot/fingerprint de Undo/Redo antes de registrar edições. Uma alteração confirmada produz uma entrada de Undo; resolução e renderização não produzem histórico.
- [ ] Cobrir Save/Load manual, Session Autosave/Restore e Undo/Redo. Testar também um Text Asset, não só imagens.
- [ ] Reexecutar o grupo focado e `node scripts/qa/run-self-tests.mjs`; revisar `git diff --check`.
- [ ] Fazer um commit isolado: `feat: persist temporal presence and stable frame ids`.

## Task 3: Integrar escala de duração e exclusão de referências de forma semântica

**Arquivos:**
- Modificar: `index.html` — `scaleSegmentDurationsToTotal`, controlador de exclusão de ativo, controlador de modal existente ou novo modal de confirmação.
- Modificar: `tests/smoke/app.spec.mjs` — grupo `E9AG — presença temporal: duração e exclusão`.

**Interfaces:**
- Adicionar `scaleAssetPresenceSeconds(factor)`; atua somente em `offset.unit === 'seconds'`, inclusive nos defaults globais, quando `scaleSecondsWithProjectDuration` estiver ativo.
- Adicionar `findTemporalDependents(assetId)` e `convertTemporalDependentsToResolvedProjectTime(assetId)`.
- Adicionar `openAssetTemporalDependencyDialog(assetId, dependents)` com ações `Cancelar` e `Excluir e preservar tempos`.

- [ ] Escrever teste que amplia a duração total e compara quatro limites: segundos escalam somente com a preferência ligada; `projectFraction`, Frame e Asset permanecem sem conversão.
- [ ] Escrever teste de cadeia `A → B`: ao excluir A pela ação pública, o diálogo lista B, Cancelar não altera nada e Confirmar substitui a âncora de B por `project` no segundo previamente resolvido. Undo restaura A e a âncora Asset; Redo repete a conversão.
- [ ] Executar os testes focados e confirmar que a exclusão corrente remove o ativo sem proteger dependências.
- [ ] Implementar os helpers de escala e conversão antes do commit destrutivo. A conversão precisa resolver todos os tempos a partir do estado anterior e trocar apenas as fronteiras dependentes.
- [ ] Reutilizar uma superfície de diálogo segura para toque; bloquear confirmação dupla e não usar `window.confirm`. A mensagem identifica o asset e o número de limites vinculados, sem texto técnico.
- [ ] Capturar uma única vez o estado de histórico antes de converter/remover. Não relinkar automaticamente um asset removido; referências ausentes que restem de payload legado continuam inválidas e visíveis para correção.
- [ ] Reexecutar o grupo focado e o smoke WebKit completo.
- [ ] Fazer um commit isolado: `feat: preserve temporal references on asset deletion`.

## Task 4: Aplicar presença ao Stage sem perder seleção ou edição

**Arquivos:**
- Modificar: `index.html` — `renderProjectWorldExtraImages`, `renderAssetSelectionOverlay`, `assetIsHitTestable`, `hitTestAssetAtWorld` e CSS do Stage.
- Modificar: `tests/smoke/app.spec.mjs` — grupo `E9AG — presença temporal: referência no Stage`.

**Interfaces:**
- Adicionar `getStagePresenceProjectTime()` que resolve o tempo do Frame central/ativo através de `getProjectTimeAtFrameId`.
- CSS: `.asset-temporal-reference` e `.asset-temporal-reference-selected`, somente classes de apresentação do Stage.

- [ ] Escrever teste que configura uma Entrada depois do tempo do Frame ativo. Exigir que o DOM do ativo ainda exista no Stage, tenha `asset-temporal-reference`, seja selecionável e que, selecionado, mantenha a seleção coral e quatro alças canônicas.
- [ ] No mesmo teste, mover a referência temporal para antes do Frame ativo e exigir remoção da classe editorial sem qualquer mudança de geometria ou Layer.
- [ ] Executar o teste focado; confirmar que o Stage atual não diferencia presença temporal.
- [ ] Renderizar imagem e Text Asset existentes mesmo quando `present === false`, desde que `visible !== false`; acrescentar apenas a classe editorial calculada. Não filtrar `getSelectableImageAssets`, `assetIsHitTestable` ou hit-test por presença temporal, pois o ativo ausente continua editável no editor.
- [ ] Fazer a seleção continuar usando a geometria resolvida existente e aplicar coral apenas via a seleção canônica; o tracejado permanece como informação secundária. Não criar um retângulo, cache ou sistema de seleção paralelo.
- [ ] Garantir que o Stage só recalcula a referência após mudança de Frame/timeline, edição de presença, carregamento/restauração ou duração, invalidando somente a apresentação necessária.
- [ ] Reexecutar o grupo focado em WebKit mobile; testar `Câmera`, `Ativos`, mão ativa, Assets com depth e Text Asset.
- [ ] Fazer um commit isolado: `feat: show temporal asset references in editor stage`.

## Task 5: Filtrar Preview e Export pelo mesmo resolvedor

**Arquivos:**
- Modificar: `index.html` — `drawAtT`, `drawAtTDirect`, `drawWorldToCanvas`, `collectWorldRenderAssets`, preparação de snapshot de renderização.
- Modificar: `tests/smoke/app.spec.mjs` e, se já existir cobertura dedicada de saída, `tests/smoke/export.spec.mjs`.

**Interfaces:**
- Evoluir `drawWorldToCanvas(..., options)` para receber `options.projectTime`.
- Evoluir `collectWorldRenderAssets(mainSource, canonicalDims, context, projectTime)` para filtrar cada item por `isAssetPresentAt`.
- Preservar o snapshot com presença e IDs atuais; o snapshot não lê DOM ao desenhar.

- [ ] Escrever testes que tomam dois instantes `t`: antes e depois da entrada. Exigir que Stage, lista de render de Preview e lista de render de Export concordem quanto a `present`; exigir que Preview/Export não recebam a classe editorial do Stage.
- [ ] Cobrir projeto com um único asset e com múltiplos assets, além de Text Asset, para impedir que o antigo caminho de imagem principal ignore presença.
- [ ] Executar os testes focados e confirmar que o render atual desenha todos os assets `visible` em qualquer `t`.
- [ ] Encaminhar somente o `t` que já chega a `drawAtT` para o pipeline mundo/canvas. Não mudar amostragem de câmera, `getStateAtT`, WebCodecs ou duração de segmentos.
- [ ] Aplicar o filtro no snapshot/render canônico antes do draw de cada asset. Restaurar estado de canvas entre itens, não ler wrappers DOM e não usar a classe editorial fora do Stage.
- [ ] Verificar que assets presentes permanecem com pixels, geometria e ordem idênticos ao comportamento anterior; assets ausentes têm contagem de draw zero e não produzem frame vazio indevido quando outros assets estão presentes.
- [ ] Reexecutar Preview e Export real compatíveis com o ambiente, smoke WebKit completo e guardas de export. Registrar qualquer indisponibilidade de encoder em vez de mascará-la.
- [ ] Fazer um commit isolado: `feat: filter preview and export by temporal presence`.

## Task 6: Expor controles global e individual sem criar superfícies concorrentes

**Arquivos:**
- Modificar: `index.html` — `#durTabPrefs`, toolbar de Ativos, `openAssetContextPanel`, render/handlers de painel, CSS dos campos e modal.
- Modificar: `tests/smoke/app.spec.mjs` — grupo `E9AG — presença temporal: controles`.

**Interfaces e IDs:**
- Adicionar `#projectPresenceDefaults` dentro da aba **Projeto/Aparência** existente; não abrir uma segunda sheet.
- Adicionar `#assetTimingPanel` como quarto tipo exclusivo de painel contextual de Ativo e `#tbAssetTiming` na toolbar deslizante, antes de `#tbAssetDelete`; Excluir continua a última ação.
- Controles individuais: `#assetTimingUseProjectDefault`, `#assetTimingEntryEnabled`, `#assetTimingExitEnabled`, `#assetTimingEntryAnchor`, `#assetTimingExitAnchor`, `#assetTimingApplyAll`, `#assetTimingApplyInherited`.

- [ ] Escrever teste de toque que abre `Tempo` com um asset selecionado e exige que Entrada e Saída comecem compactas; detalhes de âncora/offset aparecem apenas depois que o limite correspondente é ativado.
- [ ] Escrever teste que configura padrão global, aplica a todos, cria um override divergente, aplica somente aos sem ajuste e exige que o override continue intacto. Cobrir **Usar padrão do projeto** removendo somente o override do asset selecionado.
- [ ] Executar os testes focados e confirmar a ausência da ação Tempo/painel.
- [ ] Construir os controles globalmente dentro de Aparência, junto das configurações de projeto já aprovadas. A escolha de Formato/Fundo e o painel de projeto permanecem inline; Tempo não fecha nem substitui esse painel.
- [ ] Construir o painel individual pelo controlador existente de exclusividade. Sem seleção canônica, botão permanece desabilitado. Os blocos Entrada/Saída só expandem após ativação; o usuário escolhe Projeto, Frame ou Ativo e um offset com unidade segundos/fração.
- [ ] Popular seletores por IDs estáveis e excluir do seletor o próprio ativo e candidatos que produziriam ciclo. Revalidar ao confirmar, pois a lista pode ter mudado.
- [ ] Implementar aplicação: **Aplicar a todos** materializa o padrão como override em todos os assets; **Aplicar aos sem ajuste individual** altera somente `inherit`; cada ação é atômica, com uma entrada Undo e uma revisão de autosave quando houver mudança.
- [ ] Reexecutar o grupo focado, checar overflow a 390 px e testar coexistência com Escala, Rotação e Profundidade. O fechamento/mudança de modo não pode deixar painel invisível capturando toque.
- [ ] Fazer um commit isolado: `feat: add temporal presence project and asset controls`.

## Task 7: Fechar diagnóstico, documentação, versão e gates de PR

**Arquivos:**
- Modificar: `index.html` — `buildDiagnosticsText` e coleta de diagnóstico sem flags decorativas.
- Modificar: `tests/smoke/app.spec.mjs` e guardrails de QA necessários.
- Modificar: `docs/PROJECT_STATE.md`, `docs/DECISIONS.md`, `docs/PRODUCT_RULES.md`, `docs/TEST_CASES.md`, `docs/REGRESSIONS.md` quando houver risco novo confirmado.

- [ ] Antes do primeiro código funcional, confirmar que a versão escolhida não ocorre em `origin/main` nem nos documentos de versões ativas. Definir `APP_VERSION` e `APP_VERSION_NAME` uma única vez na PR.
- [ ] Incluir no diagnóstico somente fatos observáveis: modo/presença do asset selecionado, limites resolvidos, tempo Stage, quantidade de assets incluídos/omitidos em Preview e Export, ciclo/referência ausente e resultado de conversão por Delete. Não usar diagnóstico como sinal de aprovação visual.
- [ ] Adicionar casos preventivos para migração legada, persistência, ciclo, escala, Delete+Undo, referência editorial selecionada, paridade Stage/Preview/Export, um asset, múltiplos assets e Text Asset.
- [ ] Executar, na ordem, `git diff --check`, smoke WebKit focado, smoke WebKit completo, `node scripts/qa/check-project-os.mjs`, `node scripts/qa/check-markdown-links.mjs` e `node scripts/qa/run-self-tests.mjs`. Para Preview/Export, executar o teste real que estiver disponível e registrar qualquer limitação de ambiente.
- [ ] Revisar o diff contra as restrições: `getStateAtT`, câmera, curvas, easing, WebCodecs, geometria e opacidade manual não devem ter mudado. Procurar também vazamento de textos técnicos no app visível.
- [ ] Atualizar o Project OS com o escopo entregue, testes que realmente passaram, riscos e validação física pendente. Criar PR funcional com título contendo a versão inédita e a identificação de presença temporal; não fazer merge nem promoção.
- [ ] Fazer um commit final: `docs: record asset temporal presence engine sprint evidence`.

## Critérios de aceite físico iPhone/Safari

- Um asset antes da entrada e depois da saída permanece legível no Stage como referência suavizada e tracejada; ao selecionar, fica coral e continua editável.
- No instante em que entra/sai, Preview e Export concordam e não exibem a referência editorial.
- Uma âncora em Frame acompanha inserção, remoção e mudança de duração de Frame sem trocar de Frame por índice.
- Uma âncora em outro asset acompanha a Entrada/Saída daquele ativo; excluir a referência exibe diálogo e preserva o instante somente após confirmação.
- **Aplicar a todos**, **Aplicar aos sem ajuste individual** e **Usar padrão do projeto** obedecem às diferenças entre padrão e override.
- Alterar duração total escala somente segundos quando a preferência está ligada; frações e vínculos semânticos permanecem sem conversão.
- Zoom, mão, Layers, Profundidade, Text Asset, seleção, Save/Load, Preview e Export não apresentam regressão visível.
