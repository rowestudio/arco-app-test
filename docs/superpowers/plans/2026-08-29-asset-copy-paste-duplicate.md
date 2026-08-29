# Asset Copy, Paste, and Duplicate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to execute this plan task-by-task.

**Goal:** Add intentional asset duplication, internal copy/paste, and explicit paste from the system clipboard without changing the canonical Stage, Preview, Export, ProjectWorld, or engine render paths.

**Architecture:** A single asset-clone helper creates a new canonical asset identity and owns the one-step Undo, dirty-state, composite invalidation, render, selection, and Layers refresh. Layer duplication and toolbar duplication are thin location-specific callers; internal paste calls the same helper with the current-view placement policy. The Assets `+` menu performs the browser clipboard read only after the user taps `Colar`; image content enters the existing image-import pipeline as a `File`.

**Tech Stack:** Single-file browser app (`index.html`), Playwright smoke tests, existing Project OS QA scripts, Web Clipboard API (`navigator.clipboard.read()` / `write()`), iPhone/Safari physical validation.

**Approved design:** `docs/superpowers/specs/2026-08-29-asset-copy-paste-duplicate-design.md`

## Global constraints

- Branch from the current test `origin/main`; complete the repository/GitHub preflight before editing.
- This is a functional release. Set both `APP_VERSION` and `APP_VERSION_NAME` to `v8z4b32E9Z`; do not change either independently.
- Do not alter `getStateAtT`, `drawAtT`, WebCodecs/export, Preview timing, frame/curve interpolation, ProjectWorld dimensions, or Save/Load schema except through the already-persisted normal asset fields.
- No clipboard contents, external files, permissions, or approval state are persisted in project JSON, session restore, or diagnostics.
- All project mutations use a snapshot taken before mutation and create exactly one Undo entry. Clipboard copy alone creates none.
- Never silently substitute stale in-memory copied data after a clipboard read failure, unsupported API, permission denial, or non-Arco text clipboard.
- Keep the published iPhone/Safari gate mandatory. Automated browser tests prove routing and model invariants, not physical Safari approval.

---

### Task 1: Establish the executable contract in Playwright

**Files:**
- Modify: `tests/smoke/app.spec.mjs`
- Modify: `index.html` only after the first red test demonstrates the missing public action

1. Add an `E9Z — duplicar, copiar e colar ativos` test next to `E9N — faixa canônica ampla e reordenação de Camada`.
2. Load `projectFixture`, switch by the public `#modeAssetsBtn`, select an existing asset through `#layersStageControl` and its `#layersList` item.
3. Assert the expanded Layer action rail exposes exactly these semantic labels in order: `Visibilidade`, `Profundidade`, `Travar camada`, `Duplicar camada`, `Excluir camada`; assert every action remains a 60 × 60 touch target and the duplicate uses the new canonical duplicate SVG symbol.
4. Tap `Duplicar camada` through the visible rail and assert through page state that:
   - asset count increased by one;
   - the new ID differs from the source;
   - the clone is selected and immediately above the source (`zIndex` ordering);
   - `worldX`, `worldY`, `worldW`, `worldH`, rotation, depth, visibility, and source/text payload match the source;
   - the clone is unlocked even if the source was locked;
   - one Undo restores the pre-duplicate canonical list and one Redo restores the duplicate.
5. Select a source asset again and tap the bottom toolbar `#tbAssetDuplicate`; assert count +1, selection of the clone, source fidelity, an offset of `16` world units in both X and Y, and exactly one Undo entry.
6. Tap bottom toolbar `#tbAssetCopy`; assert project asset count, Undo stack, dirty state, ProjectWorld geometry, and frame state did not change. Then use `+` → `Colar` and assert a new clone appears centered at the current world-view center with a new identity, unlocked state, top z-order, selection, and one Undo entry.
7. Stub `navigator.clipboard.read` before page use to return a `ClipboardItem` containing a PNG `Blob`; tap `+` → `Colar`, then assert the normal image insertion route was requested (not a replacement), that a new image asset is selected, and that preview/export-related state was not routed through an alternate renderer.
8. Stub read rejection and a text-only item separately; assert a clear visible status, no asset mutation, no Undo, and no stale internal asset fallback.
9. Run the test before implementation and record its expected failure: missing `Duplicar camada`, `#tbAssetDuplicate`, `#tbAssetCopy`, and `Colar` controls.

### Task 2: Add canonical clone and clipboard-session state

**Files:**
- Modify: `index.html` near `getSelectedAsset()` (around line 15625), `captureState()` / `restoreState()` (around 14921 / 15111), and existing asset operation helpers (around 17647–17910)

1. Add transient module-level state only: an Arco clipboard marker/version string and an in-memory clipboard snapshot containing the copied source asset’s serializable canonical fields plus source identity. Do not include it in `captureState`, `restoreState`, `serializeProjectAsset`, autosave, or diagnostics output.
2. Add `createDuplicatedAsset(source, placement)` that deep-copies image or text asset fields, allocates a new type-appropriate unique ID, calls `assignPersistentLayerIdentity`, sets `locked:false`, keeps `visible`, rotation, scale/geometry, depth, source payload and text styling intact, and gives the clone a top-level `zIndex` above the source/current stack.
3. Implement the only three placement modes:
   - `layer`: same `worldX/worldY` as source;
   - `toolbar`: source `worldX + 16`, `worldY + 16`;
   - `paste`: calculate `getEditorViewCenterWorld()` at the tap and place the clone’s geometric center there.
4. Add `commitAssetDuplicate(source, placement, reason)` as the sole mutating operation: reject absent source, capture the pre-change state, append the clone, normalize z-indices, select by the new ID, invalidate ProjectWorld composite, refresh Stage/Layers/toolbar, record exactly one Undo snapshot, and call `markProjectDirty(reason)`.
5. Add `copySelectedAssetToClipboard()` that rejects absent selection with a status, snapshots the selected asset, and writes a small plain-text Arco marker with `navigator.clipboard.writeText` only in the user activation. A failed marker write may report that system copying was unavailable, but must leave the in-session snapshot usable only if a later clipboard read positively finds the Arco marker.
6. Add `pasteInternalAssetFromClipboard()` which first reads the system clipboard in the user action; it may call `commitAssetDuplicate` with `paste` only when the read result includes the current Arco marker and the in-session snapshot is present and version-compatible. Any mismatch, unavailable read, denial, or text without the marker reports status and returns without mutation.

### Task 3: Surface internal asset actions in the approved locations

**Files:**
- Modify: `index.html` lower toolbar markup around lines 4333–4470
- Modify: `index.html` `renderLayersPanelList()` around lines 36290–36445
- Modify: `index.html` inline SVG symbol sprite around lines 3700–4050
- Modify: `tests/smoke/app.spec.mjs`

1. Add one canonical duplicate icon symbol to the existing SVG sprite (two overlapping rectangles), named `#i-copy`; do not introduce external icon assets.
2. Insert `#tbAssetCopy` and `#tbAssetDuplicate` in the existing asset-only bottom toolbar, with accessible labels `Copiar ativo` and `Duplicar ativo`, existing toolbar styling, and normal disabled state whenever `getSelectedAsset()` is absent. Keep Replace, transform, depth, delete, forward, and backward actions intact.
3. In `renderLayersPanelList()`, insert `Duplicar camada` immediately before `Excluir camada`; it calls `commitAssetDuplicate(selected, 'layer', 'layer-duplicate')`. It is enabled even for a locked source because the result is intentionally unlocked.
4. Wire the bottom buttons to `copySelectedAssetToClipboard()` and `commitAssetDuplicate(getSelectedAsset(), 'toolbar', 'toolbar-duplicate')`; update the existing toolbar synchronizer so their state tracks selected assets and asset mode.
5. Preserve event containment (`pointerdown`, `touchstart`, and click behavior) for the Layer rail so Safari does not send the action tap to the Stage.
6. Re-run the E9N canonical rail test and update only its expected action list/count/symbol map for the approved additional duplicate action; leave its reorder coverage unchanged.

### Task 4: Add explicit Paste to the Assets `+` menu and external-image routing

**Files:**
- Modify: `index.html` `#assetsAddMenu` markup around lines 5023–5042
- Modify: `index.html` `openAssetsAddMenu()` around lines 17156–17166
- Modify: `index.html` existing file-import functions around lines 33171–33305 and `handleImageFileChosen()`
- Modify: `tests/smoke/app.spec.mjs`

1. Add `#assetsMenuPasteBtn` labelled `Colar` in `#assetsAddMenu`, adjacent to `Nova imagem` and before optional replacement. It is not a Stage contextual menu and is visible only in Modo Ativos via the existing `+` entry point.
2. Implement `pasteFromClipboard()` as an `async` direct click handler. Read the clipboard only after this tap. Prefer `navigator.clipboard.read()` and inspect returned MIME types in this order: an Arco marker suitable for internal paste, then `image/png`, `image/jpeg`, `image/webp`, `image/gif`.
3. For image data, convert the chosen `Blob` to a `File`, explicitly set `pendingImageAction='insertImage'`, freeze a center/current-view insert target using the same insertion intent rules as `startInsertImageFlow`, then enter the existing insertion pipeline without opening the native file picker. Do not call replacement code and do not create a separate image-render path.
4. For unsupported browser API, denied/failed clipboard read, text-only content, unsupported MIME, or no content: close the menu, show a concise Portuguese status explaining that no image or Arco asset could be pasted, and make no model mutation.
5. Do not request the Permissions API, cache granted state, or claim permissions are supported on Safari. The first real Safari paste may show the browser’s native authorization prompt; the app must wait for the result.
6. Ensure the image input’s `change` listener and `handleImageFileChosen()` retain their existing behavior for manual `Nova imagem`/`Trocar imagem`; only add a small shared file-routing helper if necessary to let clipboard files use the exact same `doInsertImageFromFile` route.

### Task 5: Update Project OS and release metadata

**Files:**
- Modify: `index.html`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/PRODUCT_RULES.md`
- Modify: `docs/ROADMAP.md`
- Modify: `docs/TEST_CASES.md`
- Modify: `docs/DECISIONS.md`

1. Set `APP_VERSION` and `APP_VERSION_NAME` together to `v8z4b32E9Z`; update the current release comment only to describe this scoped feature, without embedding technical prompt text in visible DOM.
2. In `docs/DECISIONS.md`, record the approved placement semantics: Layer duplicate overlaps; toolbar duplicate offsets; `+` owns Paste; system clipboard governs the last copy; failed reads never fall back silently.
3. In `docs/PRODUCT_RULES.md`, add the user-facing asset action rule, including clone identity/lock semantics and the distinction between internal duplication and external image paste.
4. In `docs/ROADMAP.md`, mark individual asset duplication and first external clipboard image paste as implemented in E9Z; leave any future multi-asset/group duplication and richer clipboard formats explicitly future.
5. In `docs/TEST_CASES.md`, add an E9Z case covering public touch targets, identical/offset/center placements, one-step Undo/Redo, locked source behavior, clipboard-denied non-mutation, manual image import non-regression, Save/Load, Preview/Export parity, and physical iPhone/Safari validation.
6. In `docs/PROJECT_STATE.md`, record the branch/PR evidence only after its SHA, checks, and physical status are known; do not declare physical approval before Roberto tests the published build.

### Task 6: Verify, commit, open the test PR, and await physical approval

**Files:**
- Verify all modified files; do not edit production repository

1. Run `git diff --check`.
2. Run the focused E9Z Playwright test and the affected existing E9N test under the repository’s supported Playwright command.
3. Run the full compatible smoke suite, then the repository guardrails with the bundled Node runtime:

   ```bash
   /Users/robertoweigand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/qa/check-repository-state.mjs
   /Users/robertoweigand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/qa/check-app-version.mjs
   /Users/robertoweigand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/qa/check-project-os.mjs
   /Users/robertoweigand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/qa/check-markdown-links.mjs
   ```

4. Confirm `git diff -- index.html` contains only the E9Z UI/action/clipboard/version work; search visible templates for forbidden technical text (`PROBLEMA`, `CORREÇÃO`, `DIAGNÓSTICO`, `INSTRUÇÕES`, `CHANGELOG`, `PROMPT`).
5. Commit all scoped functional, test, and Project OS changes on `codex/asset-clipboard-copy-paste`; push it and open one test-repository PR titled `v8z4b32E9Z — assets: duplicar, copiar e colar`.
6. In the PR body list exact behavior, test commands/results, browser API limitation, documentation changes, and the explicit remaining gate: physical iPhone/Safari validation on a SHA-identified preview or the published test main workflow. Do not merge or promote to production automatically.
