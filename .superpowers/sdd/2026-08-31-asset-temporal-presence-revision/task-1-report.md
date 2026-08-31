# Task 1 — Presença temporal: IDs de Frame e resolvedor canônico

## Escopo entregue

- IDs `frameId` estáveis foram adicionados a Frames novos, templates, inserções assistidas, snapshots de Undo/Redo, Save/Load e migração de projetos legados. A migração só acrescenta IDs ausentes ou duplicados e não altera geometria nem ordem.
- Foram adicionados `newFrameId`, `ensureFrameIds`, `normalizeTemporalBoundary`, `normalizeAssetPresence`, `normalizeProjectAssetPresenceDefaults`, `getProjectTimeAtFrameId`, `resolveTemporalBoundary`, `resolveAssetPresenceAt` e `isAssetPresentAt`.
- O resolvedor usa somente o contexto canônico de `segDurations` e `framePauses` para tempos absolutos de Frame; não usa `_segGlobalTimeWindow30ZC`.
- Presença usa o intervalo `[entrada, saída)`: sem Entrada começa em `0`; sem Saída termina na duração canônica do projeto. Offsets em segundos e `projectFraction` são suportados. Referências de Ativo tratam auto-referência, ciclos e referências removidas sem mutar estado.
- Não foram implementados renderer/Stage, Preview, Export, UI, efeitos, opacidade, exclusão de vínculos, escala de duração, câmera, `getStateAtT`, `drawAtT` ou `APP_VERSION`.

## Arquivos modificados

- `index.html`
  - Criação, inserção, templates e carregamento de Frames agora preservam/geram `frameId`.
  - Save/Load de Frames inclui `frameId` em `framesNorm` e `framesAbs`.
  - Modelo e resolvedor puro de presença temporal foram adicionados.
- `tests/smoke/app.spec.mjs`
  - Novo gate `E9AG — presença temporal: modelo canônico`.
- `.superpowers/sdd/2026-08-31-asset-temporal-presence-revision/task-1-report.md`
  - Este relatório.

## Decisões técnicas

- O resolvedor recebe um `context` opcional. Com contexto explícito, ele opera só nas coleções recebidas; isso permite teste e uso futuro sem efeitos colaterais. Sem contexto, apenas lê o estado atual.
- A pilha `visitingAssetIds` detecta ciclo; a referência direta ao próprio Ativo retorna especificamente `self-reference`; ativo ausente retorna `missing-reference`.
- A normalização de presença permanece disponível para os próximos limites de persistência/UI, mas esta task não introduz persistência ampla do ajuste temporal de Ativos.

## Evidências e testes

1. RED antes da implementação:

   ```text
   npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --workers=1 --retries=0 -g "E9AG — presença temporal: modelo canônico"
   ReferenceError: Can't find variable: getProjectTimeAtFrameId
   ```

2. Gate focado após implementação — passou:

   ```text
   npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --workers=1 --retries=0 -g "E9AG — presença temporal: modelo canônico"
   1 passed
   ```

   O fixture principal tem dois Frames e três Ativos, cobrindo Entrada por segundos, Frame com offset negativo e Ativo com `projectFraction`/Saída. Fixtures auxiliares verificam ausência de limites, ciclo, auto-referência, referência removida e migração estável de IDs. O gate também confirma que a resolução não muda `worldX/Y/W/H`, `depth`, `zIndex` nem `visible`.

3. Regressão adjacente — passou:

   ```text
   npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --workers=1 --retries=0 -g "E9AF|E9AG"
   2 passed
   ```

4. Integridade do diff — passou:

   ```text
   git diff --check
   ```

## Riscos e itens não verificados

- Stage editorial, Preview e Export ainda não consomem `isAssetPresentAt`; isso é intencionalmente delegado às tasks seguintes.
- Persistência ampla de presença, padrão global, Undo/Redo semântico, exclusão com congelamento de referências e redimensionamento proporcional ainda não foram implementados nesta task.
- Não houve validação física iPhone/Safari, pois não há mudança visual/interativa nesta task.
- A suíte smoke completa não foi usada como critério de aprovação porque o baseline E8X conhecido falha fora deste escopo; o gate focado e a regressão adjacente são a evidência principal.

## Commit

- `feat: add canonical asset temporal presence resolver` (este relatório é versionado no mesmo commit isolado).

## Fix round 1

### Mudanças

- O cálculo de chegada e duração temporal removeu todos os fallbacks a `duration`, `easeMode` e `pauseDuration`. Agora soma exclusivamente `segDurations` e `framePauses` do contexto canônico; a pausa legada não altera nenhum instante resolvido.
- `ensureFrameIds()` deixou de aplicar `trim()`: um `frameId` existente e único é preservado byte a byte, inclusive whitespace; somente valor ausente, vazio ou duplicado recebe ID novo.
- `resolveAssetPresenceAt()` agora devolve `invalidReason: 'entry-after-exit'` e `present: false` quando a Entrada resolvida é posterior à Saída.
- O gate E9AG passou a capturar também Frames, `ctrlPts` e `curvesV2` antes/depois da resolução, além de cobrir `entry-after-exit`, ID com whitespace e a invariância perante uma pausa legada grande.

### Comandos e resultados

1. RED do contrato novo:

   ```text
   npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --workers=1 --retries=0 -g "E9AG — presença temporal: modelo canônico"
   FAILED: Expected "entry-after-exit", Received null
   ```

2. Gate focado após o fix:

   ```text
   npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --workers=1 --retries=0 -g "E9AG — presença temporal: modelo canônico"
   1 passed
   ```

3. Regressão adjacente:

   ```text
   npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --workers=1 --retries=0 -g "E9AF|E9AG"
   2 passed
   ```

4. Inspeção estática e whitespace:

   ```text
   sed -n '15445,15595p' index.html | rg -n "duration|easeMode|pauseDuration|legacyPause|_segGlobalTimeWindow30ZC" || true
   git diff --check
   ```

   A inspeção encontrou somente as leituras esperadas de `framePauses`; o diff não apresentou erros de whitespace.
