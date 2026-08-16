# Plano executado — E9D Text Regression + Editor

Este plano operacional complementa, sem substituir, `docs/PRE_PROMOTION_RELEASE_PLAN.md`.

## Base, classe e limites

- Base local confirmada: `02919cba11738d32f0609df1e3d4b641af9a51a7`, `v8z4b32E9C`.
- A consulta remota ao GitHub foi tentada antes da edição, mas o ambiente recusou autenticação/conexão; a limitação deve constar na PR.
- Classe: correção de regressão de Text Asset + melhoria visual localizada; risco médio.
- Dentro do escopo: geometria/medição textual, draft, editor tipográfico, seleção/hit-test/alças, persistência textual e testes Stage/Preview/Export.
- Fora do escopo: Camadas/Profundidade, Movimento inteligente, easing/timing/duração, escala máxima, raio/borda/opacidade global, Frames/Ativos, ProjectWorld e refatorações amplas.

## Causa a demonstrar antes do produto

- [ ] Reproduzir pelos controles públicos `R` e `Texto` recém-criados.
- [x] Capturar em cada limite `text`, `boxWidthMode`, largura natural, `boxWidth`, linhas e retângulo Stage.
- [x] Comparar Stage DOM com Preview/Export Canvas e com Text Asset confirmado correto.
- [x] Fazer o teste E9D falhar antes da implementação.
- [x] Registrar a causa comprovada, sem atribuí-la a CSS ou renderer sem evidência.

## Tarefas verificáveis

1. [x] Criar gate E9D em `tests/smoke/app.spec.mjs` antes de alterar `index.html`.
2. [x] Corrigir minimamente a origem demonstrada em `index.html`, preservando padding e migração legada.
3. [x] Reorganizar a sheet real em quatro abas (`Texto`, `Fonte`, `Cor`, `Estilo`), com alça, ícones acessíveis, alinhamento e `Auto | Fixa` + stepper na aba Texto.
4. [x] Implementar minimizar sem commit/persistência e reabertura pública do draft vivo; garantir `×`/no-op sem histórico e `✓` alterado com exatamente um Undo/autosave no mesmo ID.
5. [x] Atualizar `APP_VERSION` e `APP_VERSION_NAME` juntos para `v8z4b32E9D`.
6. [x] Atualizar somente `PROJECT_STATE`, `REGRESSIONS`, `TEST_CASES` e, se houver decisão nova, `DECISIONS`.
7. [ ] Executar gate isolado, suítes compatíveis, self-tests, Project OS, links, leakage e `git diff --check`.
8. [ ] Registrar arquivos/funções reais, riscos e itens não verificados na PR.

## Arquivos reais previstos/alterados

- `index.html`: `measureTextAsset`, fluxo `openTextEditor`/cancelar/minimizar/confirmar, opções do editor e markup/CSS da sheet.
- `tests/smoke/app.spec.mjs`: gate funcional E9D.
- `tests/smoke/export.spec.mjs`: paridade/export E9D, somente se a cobertura existente não comprovar o caso.
- `docs/PROJECT_STATE.md`, `docs/REGRESSIONS.md`, `docs/TEST_CASES.md`: estado e evidência.
- Este plano.

## Checklist iPhone/Safari (Roberto)

- [ ] Criar `R`: caixa abraça o glifo + padding canônico; nenhuma coluna vertical.
- [ ] Criar `Texto`: horizontal no Stage e no Preview; export H.264 visualmente idêntico.
- [ ] Auto multilinha usa a maior linha; Enter cria quebra explícita.
- [ ] Fixa quebra automaticamente e o stepper não causa overflow.
- [ ] Um toque só seleciona; Editar e dois taps abrem; teclado não abre no toque simples.
- [ ] `×` restaura/descarta; alça minimiza e reabre o draft; `✓` confirma no mesmo ID.
- [ ] Alinhamentos esquerda/centro/direita, fonte, peso, itálico, cor e fundo funcionam.
- [ ] Fundo + depth não-zero mantém glifos, fundo, seleção e quatro alças juntos.
- [ ] Sheet bloqueia toque/pan/zoom atrás, rola internamente e respeita Home Bar/safe area.
- [ ] Undo/Redo, Save/Load e fechar/reabrir sessão preservam apenas estado confirmado.

