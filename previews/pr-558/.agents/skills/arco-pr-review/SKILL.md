---
name: arco-pr-review
description: Use when reviewing, re-reviewing, verifying, or determining merge readiness for a pull request in the Arco Motion development repository (rowestudio/arco-app-test). Triggers on "revisar PR", "verificar PR", "conferir PR", "essa PR pode fazer merge?", "re-review", "merge readiness", "o HEAD mudou", "checa os checks", "pull request Arco Motion", or any request to judge whether a PR is technically ready.
---

# arco-pr-review

Procedimento canônico e durável para revisar, re-revisar e decidir merge-readiness de uma pull request no repositório de desenvolvimento do Arco Motion (`rowestudio/arco-app-test`).

Esta Skill ensina **como executar a revisão**. Ela **não** reproduz as regras permanentes de produto. As regras vêm sempre das fontes atuais, descobertas em cada execução. Se o produto ganhar novas features ou versões, esta Skill continua válida sem reescrita.

## Quando usar

- Ao revisar uma PR do Arco Motion pela primeira vez.
- Ao re-revisar uma PR depois que o HEAD dela mudou.
- Ao decidir se uma PR está tecnicamente pronta para merge.
- Ao verificar aderência integral ao objetivo, blockers, regressões ou escopo.
- Ao conferir se os checks certos passaram no SHA correto.

## Quando NÃO usar

- Para implementar feature, corrigir bug funcional ou alterar o comportamento do app.
- Para promover para produção (`rowestudio/arco-app`) — isso é tarefa separada, ver `docs/PROMOTION_TO_PRODUCTION.md`.
- Para fazer merge por conta própria (ver seção *Merge e produção*).

## Fonte de verdade e hierarquia

Ao revisar, resolva qualquer dúvida nesta ordem de precedência:

1. Estado atual do Git/GitHub (branches, HEADs, diff, checks, reviews).
2. `AGENTS.md`.
3. Documentos oficiais do Project OS aplicáveis ao escopo da PR.
4. Implementação e testes atuais.
5. Contexto fornecido pelo usuário.
6. Histórico de conversas — apenas referência auxiliar, nunca fonte permanente.

`CLAUDE.md` não é uma segunda fonte de regras; ele aponta Claude Code para `AGENTS.md`. Não congele nesta Skill: SHAs, números de PR, versões, nomes de feature, estados de roadmap ou resultados de CI. Descubra tudo isso durante a execução.

## Regras de ouro do método

- A **unidade de revisão é o HEAD remoto atual da PR**. Diff, checks, testes, reviews e análise de escopo devem descrever o mesmo HEAD.
- Checks verdes de um SHA anterior **nunca** aprovam um SHA novo.
- Nunca diga apenas "CI verde" quando existem gates distintos e relevantes: reporte cada gate.
- Não confunda falha preexistente da baseline com regressão introduzida pela PR.
- Não confunda teste quebrado com produto quebrado — exija evidência antes de concluir qualquer um dos dois.
- Aprovação técnica da PR ≠ validação física em iPhone/Safari ≠ aprovação visual de Roberto.
- Erro previsível pelo diff bloqueia merge, mesmo que todos os checks estejam verdes.
- Por padrão **não faça merge** e **não promova**: apenas recomende.

---

## Workflow

### Fase A — Resolver o contexto real

Identifique, usando as ferramentas disponíveis (GitHub connector/API, `git`, ou `gh` quando existir):

- repositório (confirme que é `rowestudio/arco-app-test`);
- número da PR; estado open/closed/merged; draft ou ready;
- título; autor;
- branch HEAD; branch base;
- HEAD SHA atual da PR; base SHA da PR;
- HEAD atual de `origin/main`;
- mergeability, quando disponível.

Se o usuário disser apenas "Verifique a PR", tente resolver a PR pela branch/repositório atuais antes de pedir informação. Só declare limitação se houver ambiguidade real que as ferramentas não resolvam.

O script auxiliar `scripts/collect-context.sh` coleta de forma determinística os fatos locais de Git; ele não decide nada.

### Fase B — HEAD atual é a unidade de revisão

Antes de qualquer conclusão, obtenha o HEAD remoto atual da PR e garanta que **todos** os fatos (diff, checks, testes, reviews, escopo) correspondem a ele.

Se o HEAD mudar durante a revisão:

1. registre o SHA anterior apenas como histórico;
2. abandone qualquer decisão final baseada nele;
3. busque o novo HEAD;
4. reavalie;
5. busque os checks correspondentes ao novo SHA;
6. emita a decisão final somente sobre o novo HEAD.

**Delta de re-review.** Se já houve revisão anterior (ou existe um SHA anterior conhecido), calcule também o delta `HEAD anterior → HEAD atual` e descreva-o concretamente (ex.: "o novo HEAD altera somente `docs/PRODUCT_RULES.md`" ou "a correção deveria ser só de teste, mas o novo commit também alterou `index.html`"). O delta **não** substitui a revisão do diff completo da PR contra a base — ambos são necessários.

### Fase C — Verificar a base da PR (base drift)

Compare a base SHA da PR com o HEAD atual de `origin/main`. Se a main avançou, determine se o avanço:

- é irrelevante ao escopo;
- introduz conflito;
- altera arquivos tocados pela PR;
- altera uma premissa técnica da implementação;
- incorpora uma PR concorrente;
- torna a PR desatualizada.

Não exija atualização da base só por formalidade. Bloqueie por drift apenas quando ele cria risco material, conflito, ambiguidade ou invalida evidência.

### Fase D — Inspecionar o diff completo

Compare a PR contra sua base real. Determine arquivos modificados/adicionados/removidos e a natureza de cada mudança: funcional, visual, teste, documental, CI/infra, versão, fora do escopo. Não confie apenas na descrição da PR — verifique o diff.

### Fase E — Auditar o corpo da PR contra a realidade

Compare o corpo atual da PR com o template em `.github/PULL_REQUEST_TEMPLATE.md`. Verifique se a PR declara adequadamente base, versão/ID operacional, classificação, objetivo, escopo, arquivos alterados, áreas não alteradas, testes, evidências, regressões, Safari/iPhone, itens não verificados, riscos e critérios de aprovação.

Não trate uma afirmação como verdadeira só porque está escrita. Valide fatos verificáveis contra Git, diff, workflows, resultados de CI e Project OS. Exemplos: se o corpo diz "Preview/Export não alterados" mas o diff toca renderer/export, sinalize a inconsistência; se o corpo informa um base SHA incorreto, use o Git como verdade e registre a divergência.

### Fase F — Classificar o tipo da PR

Classifique a PR em uma ou mais categorias: funcional, bugfix, visual/UX, Engine Sprint, documental, QA/teste, operacional, CI/CD, promoção, infraestrutura de agente. Aplique os requisitos correspondentes definidos no Project OS (`docs/DEFINITION_OF_DONE.md` distingue os tipos). Não use uma lista fixa de testes para toda PR.

### Fase G — Versionamento

Verifique `APP_VERSION` e `APP_VERSION_NAME` quando aplicável, conforme as regras vigentes (`AGENTS.md`, `docs/DEFINITION_OF_DONE.md`, `docs/PROMOTION_TO_PRODUCTION.md`):

- **PR funcional:** quando o projeto exigir bump, confirme que `APP_VERSION === APP_VERSION_NAME`.
- **PR documental, QA, operacional ou de infraestrutura sem alteração funcional:** por padrão, `APP_VERSION` e `APP_VERSION_NAME` não mudam. Só aceite exceção se houver marcador formal explícito permitido pelo Project OS (ex.: `APP_VERSION_EXCEPTION: <justificativa>`).

Não exija bump só porque houve novo commit.

### Fase H — Preservação de escopo

Pergunte: *a implementação corresponde exatamente ao pedido, sem diminuir, reinterpretar ou expandir silenciosamente o escopo?* Procure: solução parcial; coexistência indevida entre sistema antigo e novo; implementação paralela; código morto alcançável; refatoração não solicitada; mudança visual colateral; alteração de área protegida; feature futura antecipada; feature prometida pela UI mas ausente no renderer; mudança em produção/deploy/Pages/CNAME não solicitada. Erro previsível pelo diff bloqueia merge.

### Fase I — Áreas protegidas e invariantes (descoberta dinâmica)

Não mantenha aqui uma lista congelada de regras de produto. Em cada revisão:

1. identifique os subsistemas tocados pelo diff;
2. consulte `AGENTS.md`, `docs/PRODUCT_RULES.md`, `docs/REGRESSIONS.md`, `docs/TEST_CASES.md` e, quando relevantes, `docs/ARCHITECTURE.md` e `docs/DECISIONS.md`;
3. extraia os invariantes aplicáveis àqueles subsistemas;
4. confira se a PR os preserva.

Subsistemas normalmente sensíveis: renderer, ProjectWorld, Preview, Export, WebCodecs, Frames, Layers, Save/Load, seleção, geometria, câmera, undo/redo, autosave, timeline, UI. A fonte de verdade é o Project OS atual, não esta lista.

### Fase J — Vazamento técnico para a interface

Se a PR alterar HTML/JS/CSS ou conteúdo renderizado, verifique explicitamente vazamento acidental de prompts, instruções, changelog, texto de diagnóstico, texto técnico ou blocos destinados ao agente para elementos visíveis. Use o guardrail automatizado disponível **e** inspeção do diff. Um check verde não elimina a responsabilidade da revisão.

### Fase K — Checks: descoberta dinâmica, conteúdo e SHA correto

1. **Descubra os gates vigentes** inspecionando `.github/workflows/` no HEAD da PR. Não trate nomes de workflow como contrato eterno.
2. **Leia o conteúdo do gate** quando necessário para entender o que ele realmente executa: qual suíte, em qual SO, navegador e configuração; se valida Preview, Export ou codec real; se apenas faz smoke; se produz artifact; se usa retries/fallback. Não declare "H.264 real passou" só porque um workflow genérico de smoke ficou verde — confirme qual job/etapa executou aquele gate.
3. **Consulte os resultados no HEAD SHA atual.** Para cada gate relevante, informe nome, SHA, status e conclusão, usando estados explícitos: PASS, FAIL, PENDING, SKIPPED, NOT APPLICABLE ou NOT VERIFIED. Nunca reduza gates distintos a "CI verde".

### Fase L — Problema da PR vs problema da baseline

Quando um teste falhar, investigue se: (A) a PR introduziu a falha; (B) a falha já existe na base; (C) o ambiente não permite executar o gate; (D) o teste está incorreto; (E) há regressão real de produto. Compare comportamento no HEAD da PR e na base quando necessário.

Não atribua à PR uma falha comprovadamente preexistente. Mas uma falha preexistente **pode continuar bloqueando** se impedir comprovar o objetivo ou um invariante obrigatório daquela PR. "Já falhava antes" não é justificativa automática para ignorar um blocker.

### Fase M — Teste errado vs produto errado; não mascarar falha

Uma falha automatizada não prova regressão de produto sozinha. Investigue comportamento real, fluxo público, estado usado pelo teste, mutações artificiais, mocks, timing, asserts e evidência visual. Não altere o produto para satisfazer um teste que demonstradamente modela um estado impossível ou diferente do fluxo real; da mesma forma, não declare o teste errado só porque a implementação parece correta — exija evidência.

Nunca recomende como "correção de teste": timeout maior sem causa demonstrada, `force:true`, remoção arbitrária de assert, skip, redução silenciosa de cobertura, retries para esconder intermitência, ou mutação de estado interno só para passar. A correção deve atacar a causa comprovada.

### Fase N — Reviews e threads

Consulte, quando disponível: requested reviewers, submitted reviews, REQUEST_CHANGES, threads inline não resolvidas e comentários relevantes. Distinga comentário informativo, sugestão e blocker. Não recomende merge enquanto houver requested change ou thread relevante não resolvida, salvo evidência clara de que ficou obsoleta após novo commit — nesse caso, registre.

### Fase O — Project OS: detectar inconsistências

Compare os documentos relevantes durante a revisão. Se encontrar divergência material, não escolha silenciosamente uma versão: classifique como **PROJECT OS INCONSISTENTE** e determine se a inconsistência (A) foi introduzida pela PR; (B) já existe na baseline; (C) afeta o escopo da PR; (D) afeta promoção/versão; (E) é apenas histórica/obsoleta. Se foi introduzida pela PR e é material, bloqueie. Se já existia, registre como preexistente e decida se bloqueia conforme o impacto no escopo (ex.: uma inconsistência sobre promoção futura pode não bloquear um bugfix local, mas bloqueia uma promoção).

Documentos históricos, auditorias e QA versionados (`docs/QA-*.md`) são evidência histórica, não política vigente. Prefira os documentos canônicos definidos em `docs/DOCUMENTATION_MAINTENANCE.md`.

### Fase P — Aprovação técnica vs validação física

Mantenha separação formal:

- **PR tecnicamente aprovada para merge:** objetivo comprovado, diff aceitável, escopo correto, checks aplicáveis aprovados, blockers resolvidos.
- **Build publicada validada no iPhone/Safari:** só ocorre após merge autorizado e publicação da build de teste.
- **Aprovação visual de Roberto:** decisão humana final no ambiente de referência.

Não declare "versão aprovada" quando houve apenas aprovação técnica da PR. Não declare "PR tecnicamente reprovada" só porque a validação física pós-merge ainda não ocorreu.

### Fase Q — Pós-merge e fechamento documental

Se a PR já foi mergeada e o usuário pedir revisão de estado: reconheça que a fase de PR terminou, verifique publicação/validação quando houver evidência e indique a etapa seguinte (`docs/APPROVAL_WORKFLOW.md`). Não crie automaticamente uma PR de fechamento documental — apenas indique quando o Project OS precisa ser sincronizado. Fechamento pós-release é escopo de uma Skill futura dedicada.

## Merge e produção

Por padrão **não faça merge**, mesmo quando classificar como aprovada — apenas recomende; merge exige pedido explícito do usuário e observância das regras do projeto. **Nunca** promova para `rowestudio/arco-app` como consequência de uma aprovação no repo de teste: promoção é tarefa separada, com branch e PR próprios e aprovação explícita de Roberto, conforme `docs/PROMOTION_TO_PRODUCTION.md`.

## Classificações finais permitidas

Use uma classificação clara (pode combinar quando adequado, ex.: `BLOQUEADA — PROJECT OS INCONSISTENTE`):

- **APROVADA TECNICAMENTE PARA MERGE** — todos os gates aplicáveis e a revisão comprovam o objetivo.
- **APROVADA TECNICAMENTE — VALIDAÇÃO FÍSICA PÓS-MERGE PENDENTE** — quando for útil destacar que merge-readiness e validação em iPhone/Safari são etapas separadas.
- **BLOQUEADA** — há blocker comprovado.
- **INDETERMINADA — EVIDÊNCIA INSUFICIENTE** — não foi possível comprovar um requisito necessário.
- **PROJECT OS INCONSISTENTE** — divergência documental relevante a ser tratada ou registrada.

## Formato da resposta

1. **Classificação** (uma das acima).
2. **Snapshot revisado** — PR; HEAD SHA; base da PR; `origin/main` atual; houve base drift?
3. **Escopo e diff** — arquivos alterados; natureza; alterações fora do escopo; delta desde a revisão anterior, quando aplicável.
4. **Checks** — cada gate relevante individualmente (nome, SHA, status, conclusão).
5. **Reviews** — requested changes; threads; blockers.
6. **Project OS** — coerente ou divergências encontradas.
7. **Diagnóstico** — a razão da classificação.
8. **Próximo passo** — uma ação concreta.

## Prompt corretivo quando houver blocker

Quando houver problema corrigível, gere **um único** prompt operacional para corrigir a **mesma** PR, derivado da evidência encontrada (não genérico). O prompt deve incluir: repositório correto; número da PR; HEAD usado apenas como referência; obrigação de buscar o HEAD remoto mais recente antes de editar; diagnóstico comprovado; escopo da correção; arquivos/áreas autorizadas; áreas proibidas; comportamento a preservar; testes necessários; proibição de abrir nova PR se a intenção é corrigir a existente; proibição de novo bump de versão quando não há alteração funcional que o justifique; proibição de merge; produção fora do escopo.

- **Se o blocker for exclusivamente um teste:** delimite explicitamente teste/fixture/workflow autorizado e proíba mudar código funcional, salvo se nova evidência demonstrar bug real.
- **Se o blocker for produto:** aponte o comportamento observado, a causa demonstrada (se conhecida — não invente causa), os invariantes, os testes que devem falhar antes e passar depois, as regressões relacionadas e os sistemas que não podem mudar.

## Modos de falha que esta Skill previne

- Aprovar um HEAD novo com checks de um SHA antigo.
- Inventar alteração funcional numa correção puramente documental, ou exigir bump indevido.
- Retornar "CI verde"/"APROVADA" quando um gate distinto (ex.: WebKit) falhou.
- Atribuir à PR uma falha que também ocorre na base.
- Alterar produto para satisfazer um teste que modela um estado artificial.
- Ignorar base drift material — ou exigir sincronização quando o drift é irrelevante.
- Aceitar afirmação falsa do corpo da PR contra a evidência do diff.
- Confundir inconsistência preexistente do Project OS com algo introduzido pela PR.
- Declarar aprovação visual inexistente, ou reprovar por validação física ainda não feita.
- Aceitar alteração fora do escopo só porque os checks passaram.
