# QA_STRATEGY

## Camadas de QA

1. Inspeção de escopo: confirmar que a mudança corresponde ao pedido.
2. Revisão de diff: identificar arquivos fora do escopo, alterações colaterais e risco.
3. Validação estática: buscas, sintaxe, links e versionamento.
4. Self-tests versionados dos guardrails: fixtures positivas e negativas em `test-fixtures/qa-guardrails/` executadas por `scripts/qa/run-self-tests.mjs`.
5. Testes unitários futuros: cobrir funções puras quando forem extraídas ou estabilizadas.
6. Playwright/WebKit OPS-03: automatizar smoke inicial em WebKit para abertura, erros de console/page e evidência de render.
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
- Checks de PR devem validar o HEAD SHA atual. Resultado de SHA anterior não libera SHA novo.

## OPS-03 smoke tests WebKit iniciais

- A OPS-03 adiciona uma suíte mínima automatizada com Playwright usando somente WebKit para abrir o Arco Motion servido localmente.
- A cobertura inicial valida abertura de `/`, erros JavaScript não tratados via `pageerror`, mensagens `console.error`, presença de `.app`, `.stage` e `#topBar`, corpo não vazio e screenshot do render inicial como evidência do job.
- WebKit automatizado em Linux não equivale ao Safari real nem ao iPhone real; continua sendo uma barreira técnica complementar.
- Preview, Export, upload/importação, Save/Load, múltiplos assets e regressão visual comparativa ainda não são cobertos pela OPS-03.

## OPS-04 Mobile CI Watchdog

- A OPS-04 adiciona o workflow `Mobile CI Watchdog` para restaurar o fluxo mobile-first quando os eventos normais de PR não criarem checks no SHA atual.
- Frequência: `schedule` a cada 30 minutos, mais `workflow_dispatch` administrativo. Essa periodicidade evita varredura excessiva e ainda reduz a dependência de desktop/terminal.
- Política de duplicidade: antes de executar, o watchdog consulta workflow runs dos arquivos originais e check-runs explícitos do próprio watchdog. Qualquer execução `queued`, `in_progress` ou `completed` para a mesma suíte e o mesmo SHA impede nova execução.
- Política de SHA: a unidade de validação é o HEAD SHA corrente da PR. Mudança de SHA torna as suítes elegíveis novamente; resultado de SHA anterior não conta.
- Política de segurança: drafts e forks são ignorados; o código da PR é testado em checkout separado, sem credenciais persistidas. Metadados e finalização rodam a partir do código do watchdog da `main`.
- Evidência: cada execução ausente gera check-run `QA Guardrails` ou `WebKit Smoke Tests` no SHA da PR, com PR, branch, SHA planejado, SHA corrente e conclusão.
- Recuperação: se o watchdog falhar, executar manualmente `Mobile CI Watchdog` como ação administrativa e investigar o log. Não criar commit vazio, não simular aprovação e não exigir token pessoal de Roberto.

## OPS-05 resiliência do WebKit/Linux e do Watchdog

- **Timeout WebKit/Linux:** o job `WebKit Smoke Tests` em `smoke-tests.yml` passa a ter `timeout-minutes: 25`, além de um `timeout 12m` portátil de coreutils no passo de instalação `npx playwright install --with-deps webkit`. Um download/instalação travado encerra de forma bounded, com exit code real (o `timeout` retorna 124 em estouro), nunca convertendo erro de instalação em PASS. Referência: instalação normal em poucos minutos; 25 min é confortavelmente superior e ainda na ordem de dezenas de minutos, não horas. O job macOS de Export mantém o próprio `timeout-minutes: 20`.
- **PR non-runtime e aplicabilidade do Browser Smoke:** um PR é non-runtime somente quando TODOS os arquivos alterados pertencem à allowlist inequívoca: `docs/**`, `.agents/**`, `.claude/**` e qualquer arquivo Markdown (raiz ou aninhado, ex.: `AGENTS.md`, `CLAUDE.md`, `README.md`). Qualquer outro arquivo — `index.html`, assets de runtime, `package.json`/`package-lock.json`, configuração do Playwright, `tests/**`, `.github/workflows/**`, `scripts/**` ou arquivo não reconhecido — mantém o Browser Smoke aplicável. O filtro `paths-ignore` do `smoke-tests.yml` implementa exatamente essa allowlist conservadora (o GitHub só pula o workflow quando TODOS os paths casam com `paths-ignore`); a mesma semântica está em `isWebKitSuiteApplicable()` no watchdog. O filtro é conservador por construção: nada de `paths-ignore` amplo que possa esconder alteração funcional.
- **QA continua obrigatório:** PRs documentais/operacionais continuam executando `QA Guardrails`; `qa-guardrails.yml` não recebe `paths-ignore`. Somente o WebKit pode ser NOT APPLICABLE.
- **Watchdog — estados distintos por HEAD SHA:** o planejamento diferencia explicitamente
  1. `success` (concluído com sucesso) → suíte satisfeita, não reexecutar;
  2. `terminal-failure` (concluído com `failure`/`cancelled`/`timed_out` ou outro resultado terminal negativo) → resultado terminal que exige reexecução deliberada; **não** classificar como `missing` e **não** entrar em loop automático de rerun;
  3. `active-fresh` (`queued`/`in_progress`/`waiting`/`requested`/`pending` dentro da janela de frescor) → execução ativa válida, não duplicar;
  4. `active-stale` (mesma classe ativa, porém antiga demais) → não bloqueia recuperação; volta a ser elegível;
  5. `missing` (nenhum run reconhecido) → executar;
  6. `not-applicable` (WebKit em PR non-runtime) → registrar skip, razão `not applicable: non-runtime-only PR`, sem criar check artificial e sem rodar Playwright.
  - Precedência de classificação: `success` > `active-fresh` > `terminal-failure` > `active-stale` > `missing`.
- **Threshold de stale:** `STALE_ACTIVE_MS = 60 min`, coerente com o cap de 25 min do job WebKit/Linux (>2x mais o overhead de fila). Como o threshold excede o timeout do job, um run saudável sempre atinge estado terminal antes de poder ser confundido com stale, o que impede loop de recuperação sem um contador efêmero. Fonte temporal: `run_started_at` (fallback `created_at`) para workflow runs e `started_at` para check-runs. Timestamp ausente ou não parseável é tratado conservadoramente como `active-fresh` — nunca se inventa idade/stale. O relógio é injetável (`planWatchdog({ now })`) para testes determinísticos de fronteira.
- **Paridade da suíte WebKit:** o watchdog executa exatamente o gate funcional canônico `npx playwright test --project=webkit-mobile-smoke --workers=1 --retries=0`, idêntico ao `smoke-tests.yml`, e nunca um `npx playwright test` genérico que ampliaria o escopo para o projeto macOS de Export. A instalação do watchdog usa o mesmo `timeout 12m` e o job de recuperação tem `timeout-minutes: 25`.
- **Política de SHA preservada:** a unidade de validação continua sendo o HEAD SHA corrente da PR; evidência de SHA anterior nunca libera SHA novo; mudança de SHA torna as suítes aplicáveis novamente; `buildFinalCheckRunUpdate()` mantém `neutral` quando o SHA muda durante a execução. Sem aprovação simulada.
- **Concorrência:** `smoke-tests.yml` passa a ter `concurrency` por PR (`browser-smoke-<workflow>-<pr|ref>`) com `cancel-in-progress: true`, justificado porque um novo commit supersede o run do commit anterior (checks são por-SHA) e libera o runner caso a instalação WebKit tenha travado no SHA superado; PRs distintos não se cancelam. O watchdog mantém `concurrency` global e por PR/suíte/SHA com `cancel-in-progress: false` (não cancelar recuperação útil); o `qa-guardrails.yml` permanece sempre executável, sem cancelamento, por ser obrigatório e barato.

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

## Gates de navegador para Text Asset e Export H.264 (E8X)

- O gate WebKit/Linux valida o TC-038 até o Preview real, incluindo composição por pixels; ele não declara o Export validado nesse ambiente.
- O Google Chrome 150/Linux foi avaliado e rejeitado como gate porque retornou `supported: false` para a configuração H.264 real. O gate `Real Export Smoke (WebKit macOS)` valida WebCodecs/H.264 real, com preflight dos três candidatos canônicos e MP4 não vazio.
- A separação existe porque `VideoEncoder.isConfigSupported()` encerrou o WebKit/Linux também na base `main`, sem Text Asset. Playwright WebKit/macOS também não equivale a aprovação Safari.
- A validação publicada em iPhone/Safari real continua obrigatória após eventual merge.
