# Presença temporal de ativos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que imagens e textos tenham entrada e saída temporais, preservando opacidade manual, referências semânticas e paridade Stage/Preview/Export.

**Architecture:** A presença será um pequeno modelo persistível por ativo, resolvido por uma função canônica para um instante `t` do projeto. Stage, hit-test, Preview e Export consomem esse mesmo resultado; referências são IDs e eventos semânticos, enquanto somente tempos absolutos e offsets são números escaláveis. A correção dos botões de zoom é uma PR funcional anterior e isolada.

**Tech Stack:** HTML/CSS/JavaScript sem framework em `index.html`; Playwright WebKit mobile; IndexedDB Session Autosave; GitHub Actions existente.

**Spec:** `docs/superpowers/specs/2026-08-30-asset-temporal-presence-design.md`

## Global Constraints

- Cada PR funcional parte da `origin/main` atual, recebe branch própria, versão inédita e `APP_VERSION === APP_VERSION_NAME`; não reutilizar identificação de versão.
- iPhone/Safari é a referência de produto; diagnósticos não substituem validação física.
- Não alterar `getStateAtT`, matemática de câmera, curvas, easing, WebCodecs ou geometria canônica sem necessidade demonstrada nesta tarefa.
- Opacidade manual é base persistente; presença resolve apenas visibilidade e opacidade efetiva temporária.
- `depth` e `zIndex` continuam independentes; presença não altera ProjectWorld, Frames, curvas, ordem ou geometria.
- Stage, Preview e Export devem consumir um único resolvedor; não criar renderer paralelo.
- Todo vínculo removido pela exclusão de um ativo vira tempo absoluto resolvido somente após confirmação explícita; Undo restaura os vínculos.

---

## Estrutura de arquivos e entregas

| Entrega | Arquivos primários | Resultado verificável |
| --- | --- | --- |
| PR 1 — Zoom | `index.html`, `tests/smoke/app.spec.mjs`, docs de estado/regressão | `−` e `+` avançam/recuam incrementalmente também abaixo de 100%, sem resetar pan; o rótulo continua sendo o único Reset. |
| PR 2 — Modelo de presença | `index.html`, `tests/smoke/app.spec.mjs`, `docs/DECISIONS.md`, `docs/REGRESSIONS.md` | schema legado seguro, resolvedor de Projeto/Frame/Ativo, histórico e persistência. Sem controles novos. |
| PR 3 — UI individual e Stage | `index.html`, `tests/smoke/app.spec.mjs` | `Animação` compacto no Ativo, Entrada/Saída expansíveis, Stage e hit-test obedecem ao tempo selecionado. |
| PR 4 — Preview/Export e dependências | `index.html`, smoke/export tests, docs | render único aplica presença a todo frame; exclusão referenciada confirma/congela tempos e Undo reverte. |
| PR 5 — Padrões globais e escala de duração | `index.html`, `tests/smoke/app.spec.mjs`, docs | Aparência aplica padrão a todos ou somente herdados; escala global respeita a escolha proporcional. |

## Task 1: PR funcional isolada — botões de zoom do Stage

**Files:**
- Modify: `index.html:22752-22927`
- Modify: `tests/smoke/app.spec.mjs` (novo teste após E9AD)
- Modify: `docs/REGRESSIONS.md`, `docs/PROJECT_STATE.md`, `docs/DECISIONS.md`

**Interfaces:**
- Consumes: `getEditorMinZoom()`, `clampEditorPan()`, `applyEditorZoom()`.
- Produces: `getNextEditorZoomStep(current)`, `getPreviousEditorZoomStep(current)`, `_setEditorZoom(scale, options)`.

- [ ] **Step 1: Write the failing mobile smoke test**

```js
test('zoom buttons step from dynamic sub-100 zoom without reset', async ({ page }) => {
  await openLoadedEditor(page);
  const before = await page.evaluate(() => {
    editorZoomScale = Math.max(getEditorMinZoom() + .08, .55);
    editorPanX = 31; editorPanY = -27; clampEditorPan(); applyEditorZoom();
    return { zoom: editorZoomScale, panX: editorPanX, panY: editorPanY, min: getEditorMinZoom() };
  });
  await page.locator('#ezBtnPlus').tap();
  const plus = await page.evaluate(() => ({ zoom: editorZoomScale, panX: editorPanX, panY: editorPanY }));
  expect(plus.zoom).toBeGreaterThan(before.zoom);
  expect(plus.panX).not.toBe(0);
  await page.locator('#ezBtnMinus').tap();
  expect(await page.evaluate(() => editorZoomScale)).toBeLessThanOrEqual(plus.zoom);
  expect(await page.locator('#ezLabel')).not.toHaveText('100%');
});
```

- [ ] **Step 2: Run the isolated test and confirm it fails on the current reset behavior**

Run: `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "zoom buttons step"`

Expected: the assertion for pan or the non-`100%` label fails when the current zoom is below 1.

- [ ] **Step 3: Implement monotonic, dynamic steps without implicit reset**

```js
function getNextEditorZoomStep(current) {
  const min = getEditorMinZoom();
  const normalized = Math.max(min, Number(current) || min);
  const fixed = ZOOM_LEVELS.filter(level => level > 1e-4);
  const above = fixed.find(level => level > normalized + 1e-4);
  return Math.min(MAX_EDITOR_ZOOM, above ?? Math.min(MAX_EDITOR_ZOOM, normalized * 1.25));
}
function getPreviousEditorZoomStep(current) {
  const min = getEditorMinZoom();
  const normalized = Math.max(min, Number(current) || min);
  const below = ZOOM_LEVELS.filter(level => level < normalized - 1e-4).pop();
  return Math.max(min, below ?? normalized / 1.25);
}
```

Extend `_setEditorZoom(scale, { preservePan:true })` so a button step clamps the current pan instead of zeroing/recentering it. `resetEditorZoom()` remains the sole explicit route to 100% and pan zero.

- [ ] **Step 4: Run the focused smoke, full smoke, QA self-tests and inspect the functional diff**

Run:

```bash
npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "zoom buttons step"
npm run test:smoke
node scripts/qa/run-self-tests.mjs
git diff --check
```

- [ ] **Step 5: Update the version/documents, commit and open the PR**

Use a new version computed from the fetched `origin/main` at execution time; document the sub-100 reproduction, monotonic steps and explicit-reset rule. Record iPhone/Safari verification as pending until actually performed.

## Task 2: PR funcional — schema e resolvedor canônico de presença

**Files:**
- Modify: `index.html:14813-15120`, `15707-15820`, `30598-30790`, `31898-32430`
- Modify: `tests/smoke/app.spec.mjs`
- Modify: `docs/DECISIONS.md`, `docs/REGRESSIONS.md`, `docs/PROJECT_STATE.md`

**Interfaces:**
- Produces `normalizeAssetPresence(asset)`, `normalizeProjectAssetPresenceDefaults(value)`, `getFrameArrivalTimesSec()`, `resolveAssetPresenceAtT(assetId, tSec, options)`, `resolveAssetEffectiveOpacityAtT(assetId, tSec, options)`.
- `resolveAssetPresenceAtT` returns `{ visible, effectiveOpacity, entrySec, exitSec, source, invalidReason }` and never mutates assets, Frames or project defaults.

- [ ] **Step 1: Write failing resolver/persistence tests inside the existing public smoke harness**

```js
const result = await page.evaluate(() => {
  const a = assets[0], b = assets[1];
  a.assetPresence = { mode:'custom', entry:{ anchor:{ kind:'project', timeSec:1 }, offsetSec:.25 }, exit:null };
  b.assetPresence = { mode:'custom', entry:{ anchor:{ kind:'asset', assetId:String(a.id), event:'entry' }, offsetSec:.5 }, exit:null };
  return {
    before: resolveAssetPresenceAtT(String(b.id), 1.70),
    shown: resolveAssetPresenceAtT(String(b.id), 1.76),
    saved: buildProjectData(true),
  };
});
expect(result.before.visible).toBe(false);
expect(result.shown.visible).toBe(true);
expect(result.saved.assets[1].assetPresence.entry.anchor.kind).toBe('asset');
```

Add separate cases for no fields (always visible), `entry` only, `exit` only, both boundaries, Frame anchor, cycle rejection, Undo/Redo, manual Save/Load and Session Restore.

- [ ] **Step 2: Run the new cases and confirm missing helper/schema failures**

Run: `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "presença temporal — modelo"`

Expected: reference errors or assertions fail before the schema exists.

- [ ] **Step 3: Add normalized immutable data and a dependency-safe resolver**

```js
function normalizeAssetPresence(asset) {
  const raw = asset?.assetPresence;
  const mode = raw?.mode === 'custom' ? 'custom' : 'inherit';
  return {
    mode,
    entry: normalizeTemporalTrigger(raw?.entry),
    exit: normalizeTemporalTrigger(raw?.exit),
  };
}
function resolveAssetPresenceAtT(assetId, tSec, options = {}) {
  // DFS uses a visiting Set; a repeated ID returns invalidReason:'cycle'.
  // Resolve triggers to seconds, reject exit < entry, then return only derived data.
}
```

Add fields to asset creation/normalization, capture/restore snapshots, history fingerprint, project serializer and `applyProjectData`. Missing legacy fields normalize to inherited, no limits; defaults are disabled and resolve to fully visible.

- [ ] **Step 4: Verify state boundaries and no render behavior change yet**

Run:

```bash
npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "presença temporal — modelo"
npm run test:smoke
node scripts/qa/run-self-tests.mjs
git diff --check
```

Require a regression assertion that `worldX/worldY/worldW/worldH`, `depth`, `zIndex`, Frames and curves are byte-equivalent after resolver calls.

- [ ] **Step 5: Document, version, commit and open a dedicated PR**

Record legacy migration, cycle blocking and persistence boundaries. Do not add UI or Preview/Export filtering in this PR.

## Task 3: PR funcional — painel individual e consumo no Stage/hit-test

**Files:**
- Modify: `index.html:2363-2891`, `4389-4436`, `16069-16290`, `17440-17460`, `35368-36160`
- Modify: `tests/smoke/app.spec.mjs`
- Modify: `docs/PROJECT_STATE.md`, `docs/REGRESSIONS.md`

**Interfaces:**
- Consumes: `resolveAssetPresenceAtT`, `resolveAssetEffectiveOpacityAtT`.
- Produces: `openAssetPresencePanel()`, `closeAssetPresencePanel()`, `setSelectedAssetPresenceOverride(next)`, `getStageInspectionTimeSec()`.

- [ ] **Step 1: Add failing touch tests for the compact panel and Stage**

```js
await selectImageAsset(page);
await page.getByRole('button', { name:'Animação', exact:true }).tap();
await expect(page.getByText('Entrada', { exact:true })).toBeVisible();
await expect(page.getByText('Âncora', { exact:true })).toBeHidden();
await page.getByRole('switch', { name:'Ativar entrada' }).tap();
await expect(page.getByText('Âncora', { exact:true })).toBeVisible();
```

Set a project-time entry after the current active-frame instant; assert the asset has no stage DOM, cannot win `hitTestAssetAtWorld`, and returns after moving the timeline past entry. Assert one Undo and one autosave revision for a confirmed edit.

- [ ] **Step 2: Run the focused test and confirm that Animação and derived Stage visibility do not yet exist**

Run: `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "presença temporal — painel e Stage"`

- [ ] **Step 3: Add a fourth exclusive asset-context kind and inline controls**

Reuse `assetContextPanel` and its single-panel controller; add `presence` without creating a second bottom sheet. The closed panel has `display:none` and `pointer-events:none`. Show only Entrada/Saída until the related switch is on; show project/frame/asset anchor selectors and signed seconds only in the expanded block. The toolbar action remains disabled without canonical asset selection.

- [ ] **Step 4: Apply the resolved state in DOM render and hit-test**

```js
const presence = resolveAssetPresenceAtT(String(a.id), getStageInspectionTimeSec());
if (!presence.visible) return;
el.style.opacity = String(presence.effectiveOpacity);
```

Use the same `presence.visible` predicate in `renderProjectWorldExtraImages`, `getSelectableImageAssets`, `assetIsHitTestable` and selection-overlay rendering. Do not change canonical `visible`, which remains the manual layer visibility flag.

- [ ] **Step 5: Run UI regression coverage and commit a dedicated PR**

Run focused test, full mobile smoke, self-tests and visual overflow checks at 390 px. Confirm Scale/Rotation/Depth remain exclusive and unaffected.

## Task 4: PR funcional — Preview/Export, references and deletion conversion

**Files:**
- Modify: `index.html:24323-24670`, `37640-37970`, asset-deletion controller near `deleteSelectedAsset`
- Modify: `tests/smoke/app.spec.mjs`, `tests/smoke/export.spec.mjs` when export coverage requires it
- Modify: `docs/REGRESSIONS.md`, `docs/PROJECT_STATE.md`

**Interfaces:**
- Consumes: `resolveAssetPresenceAtT`.
- Produces: `collectWorldRenderAssets(mainSource, canonicalDims, context, tSec)`, `prepareReferencedAssetDeletion(assetId)`, `convertDependentTriggersToProjectTime(assetId)`.

- [ ] **Step 1: Write failing parity and deletion tests**

```js
const snapshot = await page.evaluate(() => {
  const t = 1.25;
  return {
    stage: resolveAssetPresenceAtT(String(assets[0].id), t),
    preview: collectWorldRenderAssets(getCanonicalRenderSource(), getImageSourceDimensions(getCanonicalRenderSource()), 'preview', t)
      .map(a => String(a.id)),
  };
});
expect(snapshot.preview).toContain(String(assets[0].id));
```

Create `A -> B` asset reference, delete A through the public action, confirm the dialog copy and `Excluir e preservar tempos`, then assert B's trigger is `kind:'project'` at the previously resolved second. Undo must restore A and B's `kind:'asset'` trigger.

- [ ] **Step 2: Run focused tests and confirm Preview/Export currently ignore presence**

Run: `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "presença temporal — render e exclusão"`

- [ ] **Step 3: Pass render time through the one world-render pipeline**

Make `drawAtT`/`drawAtTDirect` pass their existing `t` to `drawWorldToCanvas`; make `drawWorldToCanvas` pass it to `collectWorldRenderAssets`. Filter by resolver visibility before drawing and set `ctx.globalAlpha` to the resolved effective opacity around each individual image or text draw, restoring it after every asset. Keep frame/camera sampling unchanged.

- [ ] **Step 4: Implement explicit deletion conversion transaction**

Capture the Undo snapshot before any change. Calculate every dependent trigger at the current canonical timeline, present the count and exact approved copy, and only on confirmation replace affected triggers with `{ anchor:{kind:'project', timeSec:resolved}, offsetSec:0 }`. Cancel leaves the model untouched. Follow the existing dialog conventions; do not use browser `confirm()`.

- [ ] **Step 5: Run Preview/Export and persistence checks, then commit a dedicated PR**

Run full smoke, the affected export suite, self-tests and manual iPhone/Safari test covering preview, exported video, dialog cancel/confirm and Undo/Redo. Record any unavailable H.264 runner as unverified rather than passing it by inference.

## Task 5: PR funcional — padrões globais e escala proporcional de duração

**Files:**
- Modify: `index.html` project-controls markup/styles and timing slider handler at `26580-26720`
- Modify: `index.html` project capture/restore/serialization paths at `14813-15120`, `30598-30790`, `31898-32430`
- Modify: `tests/smoke/app.spec.mjs`
- Modify: `docs/DECISIONS.md`, `docs/PROJECT_STATE.md`, `docs/REGRESSIONS.md`

**Interfaces:**
- Produces: `applyProjectPresenceDefaults(scope)`, `scaleAssetPresenceTimes(factor)`, `projectAssetPresenceDefaults`.
- `scope` is exactly `'all'` or `'inherited-only'`.

- [ ] **Step 1: Write failing project-controls tests**

```js
await openProjectAppearance(page);
await configureProjectPresenceDefault(page, { entryProjectSec: 1, exitProjectSec: 4 });
await page.getByRole('button', { name:'Aplicar aos sem ajuste individual', exact:true }).tap();
expect(await readAssetPresence(page, inheritedId)).toMatchObject({ mode:'inherit' });
expect(await readAssetPresence(page, customId)).toMatchObject({ mode:'custom' });
await page.getByRole('button', { name:'Aplicar a todos', exact:true }).tap();
expect(await readAssetPresence(page, customId)).toMatchObject({ mode:'inherit' });
```

Add duration-slider cases with proportional tracking on and off. With tracking on, fixed project seconds and offsets scale by `newTotal / oldTotal`; Frame/Asset anchor identity remains unchanged.

- [ ] **Step 2: Run the focused tests and confirm defaults/scaling do not exist**

Run: `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "presença temporal — padrões globais"`

- [ ] **Step 3: Add inline Aparência controls and scope-specific application**

Place the controls inside `Edição do projeto > Aparência`, never in a nested modal. `Aplicar a todos` writes the project default into every asset as inherited; `Aplicar aos sem ajuste individual` only changes assets whose normalized presence mode is `inherit`. Preserve custom assets exactly.

- [ ] **Step 4: Integrate transactional duration scaling**

```js
function scaleAssetPresenceTimes(factor) {
  // Scale project anchor timeSec and trigger offsetSec only when the option is true.
  // Leave anchor.kind === 'frame' and anchor.kind === 'asset' structurally unchanged.
}
```

Call this once from the existing total-duration transaction, guarded by the new project option. It shares the duration slider's single Undo snapshot and single autosave revision; it must not run while the requested total is rejected or unchanged.

- [ ] **Step 5: Run the final functional matrix, document and open PR**

Run all prior focused tests, complete mobile smoke, QA self-tests, export suite and a physical iPhone/Safari scenario with inherited/custom assets, Frame/Asset references, duration scaling both ways, Save/Load and Session Restore.

## Final release gate

- [ ] Compare every PR against the approved spec and confirm no implementation has added effects, keyframes, camera changes or an additional renderer.
- [ ] Confirm each functional PR had a unique version and a current-HEAD CI result.
- [ ] Confirm the final physical test used the deployed test build, not diagnostics alone.
- [ ] Update only the documentation whose facts are proven by the corresponding PR; do not claim unexecuted Preview/Export or iPhone validation.
