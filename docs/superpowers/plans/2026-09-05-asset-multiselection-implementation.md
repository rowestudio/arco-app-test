# Asset Multiselection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement temporary multi-selection of image and text assets from Layers, with collective Stage transforms, relative contextual transforms, collective ordering, and alpha-aware image hit-testing.

**Architecture:** Add asset selection state independent of Frame `selectedFrames`: ordered asset IDs, the initiating anchor, and an explicit temporary selection-mode flag. The flag is active already with the first selected ID, so the next simple tap adds/removes instead of replacing it. Stage, Layers and contextual panels consume that state; no persistent group is added to project data. Collective gestures snapshot every member once, mutate assets atomically, and leave Preview/Export on their existing canonical asset model.

**Tech Stack:** Vanilla DOM/Pointer Events in `index.html`; existing state snapshots/Undo/Redo/autosave; Playwright WebKit in `tests/smoke/app.spec.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-05-asset-multiselection-design.md`

## Global Constraints

- Work from a fresh worktree based on current `origin/main`; do not use this documentation branch for functional code.
- Functional PR version is `v8z4b32E9BG` unless main has advanced to a later functional version before the branch is created; then derive and record the next version.
- Selection begins only in Layers: hold without movement starts it; Stage does not start it.
- Include images and Text Assets. Text-content editing remains single-selection only.
- Include only move, scale, rotation and order. Exclude collective opacity, depth, visibility, timing and effects.
- Never serialize temporary selection or put it into Preview/Export snapshots.
- Preserve Frames, curves, `getStateAtT`, `drawAtT`, timing, ProjectWorld and Preview/Export behavior.
- Alpha sampling happens once for the initial Stage hit-test; Text Assets retain rectangular hit targets.
- Every completed collective mutation writes exactly one Undo snapshot and one dirty/autosave operation.

## File Structure

- `index.html`: selection state, Layers gestures, group overlay/transforms, ordering, alpha hit-test, cleanup and diagnostics.
- `tests/smoke/app.spec.mjs`: E9BG WebKit regression coverage.
- `docs/TEST_CASES.md`, `docs/PROJECT_STATE.md`, `docs/REGRESSIONS.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`: QA, evidence and boundary updates.

### Task 1: Canonical selection state

**Files:** Modify `index.html` near `selectedAssetId`, `selectAssetById()`, `clearSelectedAsset()`, `renderLayersPanelList()` and `updateCanonicalAssetSelectionDiagnostics()`; modify `tests/smoke/app.spec.mjs`.

**Interfaces:** Produce `selectedAssetIds: Set<string>`, `assetMultiSelectionModeActive: boolean`, `assetMultiSelectionAnchorId: string|null`, `isAssetMultiSelectionModeActive()`, `isAssetMultiSelectionActive()`, `getSelectedAssets()`, `beginAssetMultiSelection(assetId)`, `toggleAssetMultiSelection(assetId)`, and `clearAssetMultiSelection(reason)`. The mode function is true for the first held asset; the active group function is true only for two or more members.

- [ ] **Step 1: Write the failing selection-state test.** Add an E9BG test that loads `projectFixture`, enters Assets mode, starts selection with one valid ID, asserts mode true and group false, toggles two more, removes one, clears, and expects ordered IDs, `selectedAssetId === assetMultiSelectionAnchorId`, then mode false, empty IDs and null anchor.
- [ ] **Step 2: Verify it fails.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: asset multiselection state"`. Expected: `beginAssetMultiSelection is not defined`.
- [ ] **Step 3: Implement minimal state.** Define the state adjacent to `selectedAssetId`; resolve IDs only against live unlocked image/text assets; make the anchor the legacy `selectedAssetId`; set `assetMultiSelectionModeActive=true` in `beginAssetMultiSelection`; update Layer rows and Stage overlay without `markProjectDirty()`. If the anchor is removed, clear the complete set. `isAssetMultiSelectionModeActive()` reads the explicit flag, while `isAssetMultiSelectionActive()` requires mode active and at least two IDs.
- [ ] **Step 4: Verify state and existing Layers selection.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: asset multiselection state|asset.*select|Layers"`. Expected: PASS.
- [ ] **Step 5: Commit.** Run `git add index.html tests/smoke/app.spec.mjs && git commit -m "feat: add asset multiselection state"`.

### Task 2: Layers entry, toggling and collective drag reorder

**Files:** Modify `index.html` in `renderLayersPanelList()` and `layerMoveAssetToIndex()`; modify `tests/smoke/app.spec.mjs`.

**Interfaces:** Produce `moveSelectedAssetsToLayerIndex(targetIndex: number): boolean`. Selected rows use `multi-selected`; the anchor also retains `selected`.

- [ ] **Step 1: Write failing interaction tests.** Add tests for 320 ms stationary hold selecting the first row, simple clicks adding/removing rows, and `moveSelectedAssetsToLayerIndex(0)` moving selected IDs `[A,C]` to the top two rows in that order.
- [ ] **Step 2: Verify failure.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: Layers multiselection|E9BG: group layer reorder"`. Expected: missing class/function.
- [ ] **Step 3: Implement gestures and reorder.** Reuse the existing 320 ms timer but separate stationary hold from drag. Permit drag only after hold on a selected row and after its existing 8 px threshold. Sort assets by increasing z-index, remove selected members, insert the ordered group at a clamped target, and normalize z-index once. Capture one pre-mutation snapshot; only on actual change call `pushUndoSnapshot`, `markProjectDirty('asset-multi-layer-reorder')`, `renderProjectWorldExtraImages`, `renderAssetSelectionOverlay`, `renderLayersPanelList`, and `restackFilmEditorLayers` once.
- [ ] **Step 4: Verify group and single-row order behavior.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: Layers multiselection|E9BG: group layer reorder|layer.*reorder"`. Expected: PASS and existing single-row drag remains valid.
- [ ] **Step 5: Commit.** Run `git add index.html tests/smoke/app.spec.mjs && git commit -m "feat: select and reorder asset groups in layers"`.

### Task 3: Collective Stage geometry and transforms

**Files:** Modify `index.html` near `renderAssetSelectionOverlay()`, `_armAssetMove()`, `handleStageAssetMovePointer()`, `beginAssetTransformDrag()` and `endAssetTransformPointer()`; modify `tests/smoke/app.spec.mjs`.

**Interfaces:** Produce `getAssetMultiSelectionGeometry(): {x,y,w,h,cx,cy}` and `assetMultiTransformDragState` holding a single `undoSnapshot` and each member’s `worldX/worldY/worldW/worldH/rotation` baseline.

- [ ] **Step 1: Write failing transform tests.** Seed two separated assets; verify a world delta translates both equally, scale multiplies both dimensions and moves centers radially about group center, rotation rotates centers about group center and adds equal angle delta, and each gesture adds one Undo entry.
- [ ] **Step 2: Verify failure.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: group move|E9BG: group scale|E9BG: group rotation"`. Expected: current overlay has only one asset.
- [ ] **Step 3: Implement collective overlay.** Branch `renderAssetSelectionOverlay()` on `isAssetMultiSelectionActive()`: render one union box with four tabs and no per-asset tabs. Move adds the world delta to every baseline position. Scale derives a finite clamped factor from pointer distance to group center, multiplies member dimensions and maps each baseline center by that factor. Rotation derives pointer angle delta, rotates each baseline center with the 2D matrix, and sets `normalizeAssetRotation(baseline.rotation + deltaDegrees)`. Pointercancel restores the full baseline without Undo/autosave; pointerup pushes one snapshot and one `markProjectDirty('asset-multi-transform')`.
- [ ] **Step 4: Verify transforms and Undo/Redo.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: group (move|scale|rotation)|Undo|Redo|asset.*transform"`. Expected: PASS; single-asset tabs remain unchanged.
- [ ] **Step 5: Commit.** Run `git add index.html tests/smoke/app.spec.mjs && git commit -m "feat: transform selected assets as a group"`.

### Task 4: Contextual transforms and Front/Trás

**Files:** Modify `index.html` near asset scale/rotation panels, `bringSelectedAssetForward()` and `sendSelectedAssetBackward()`; modify `tests/smoke/app.spec.mjs`.

**Interfaces:** Produce `applyRelativeAssetGroupScale(factor)`, `applyRelativeAssetGroupRotation(deltaDeg)`, and `moveSelectedAssetsByLayerStep(direction)` where direction is `1|-1`.

- [ ] **Step 1: Write failing contextual tests.** With two selected assets of different initial rotations and sizes, assert contextual scale factor `1.2` changes each own size by `1.2` without moving its center and rotation delta `15` adds `15` to both. Assert Front/Trás shifts the ordered selected block one stack position while retaining internal order.
- [ ] **Step 2: Verify failure.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: contextual group|E9BG: group front|E9BG: group back"`. Expected: current handlers target only `selectedAssetId`.
- [ ] **Step 3: Implement relative actions.** For active group selection, contextual scale operates around every asset’s own center and contextual rotation adds a normalized delta to every asset. Dispatch Front/Trás to `moveSelectedAssetsByLayerStep`: remove selected IDs from sorted stack, insert them after nearest unselected neighbor for forward or before nearest neighbor for back, preserve internal order, and do nothing/Undo nothing at edge. Show a group count instead of misleading one-asset absolute values.
- [ ] **Step 4: Verify boundaries.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: contextual group|E9BG: group (front|back)|opacity|depth|timing"`. Expected: PASS and none of the excluded properties change.
- [ ] **Step 5: Commit.** Run `git add index.html tests/smoke/app.spec.mjs && git commit -m "feat: apply asset group context actions"`.

### Task 5: Alpha-aware image hit-test

**Files:** Modify `index.html` near `hitTestAssetAtWorld()` and source/drawable lifecycle; modify `tests/smoke/app.spec.mjs`.

**Interfaces:** Produce `isOpaqueImageAssetPoint(asset, localX, localY): boolean` and constant `ALPHA_HIT_TEST_THRESHOLD = 26`.

- [ ] **Step 1: Write failing alpha test.** Build a 2×2 PNG with a transparent pixel over a solid lower image. At identical geometry, `hitTestAssetAtWorld()` must return lower on the transparent point and upper on an opaque point; a Text Asset at that geometry must still capture by box.
- [ ] **Step 2: Verify failure.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: transparent image hit test"`. Expected: top image wins everywhere inside its rectangle.
- [ ] **Step 3: Implement one-sample alpha path.** Keep rotation inversion and visual-rectangle containment. Map local world point to source pixels; lazily cache decoded source pixels in an `OffscreenCanvas` or normal canvas and read one alpha byte. Below 26, skip to lower z-index candidate. If source/canvas read is unavailable, preserve rectangular behavior and record fallback diagnostic. Keep Text Asset rectangle path. Invalidate cache only on source replacement/deletion/version change, never during drag or Preview/Export.
- [ ] **Step 4: Verify hit-test and rendering regressions.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: transparent image hit test|hit.?test|replace|Preview|Export"`. Expected: PASS.
- [ ] **Step 5: Commit.** Run `git add index.html tests/smoke/app.spec.mjs && git commit -m "feat: pass asset hits through transparent pixels"`.

### Task 6: Lifecycle, diagnostics, documentation and release gate

**Files:** Modify `index.html`, `tests/smoke/app.spec.mjs`, `docs/TEST_CASES.md`, `docs/PROJECT_STATE.md`, `docs/REGRESSIONS.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`.

**Interfaces:** Diagnostics must expose `assetMultiSelectionActive`, `assetMultiSelectionIds`, `assetMultiSelectionAnchorId`, `assetMultiSelectionStageGeometry`, `assetMultiSelectionUndoAtomic`, `assetAlphaHitTestEnabled`, and `assetAlphaHitTestFallbackReason`.

- [ ] **Step 1: Write failing lifecycle tests.** Create a group, move it, rotate it contextually and reorder it; Save/Load and session restore must preserve changed assets while restoring `selectedAssetIds.size === 0`. Preview/Export frozen snapshots must contain normal asset IDs but no selection data.
- [ ] **Step 2: Verify failure.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke --grep "E9BG: asset group (save load|session restore)|E9BG: selection excluded from render"`. Expected: cleanup/diagnostics assertions fail before implementation.
- [ ] **Step 3: Implement cleanup and evidence.** Clear temporary selection on manual load, session restore, deletion of member/anchor, Assets-mode exit and Preview entry. Do not add state to `buildProjectData()` or render snapshots. Add live diagnostics and a permanent TC covering hold/toggle, group transforms, relative context actions, ordering, PNG pass-through, Undo/Redo, persistence and physical iPhone/Safari verification.
- [ ] **Step 4: Run full automated verification.** Run `npx playwright test tests/smoke/app.spec.mjs --project=webkit-mobile-smoke`, `node scripts/qa/check-project-os.mjs`, `node scripts/qa/run-self-tests.mjs`, and `git diff --check origin/main...HEAD`. Expected: all pass with no technical text rendered in the app.
- [ ] **Step 5: Commit and open reviewable PR.** Run `git add index.html tests/smoke/app.spec.mjs docs && git commit -m "test: cover asset multiselection lifecycle"`. Open a PR titled `v8z4b32E9BG — seleção múltipla de ativos`; use `arco-pr-review` on exact head SHA. Before recommending merge, perform iPhone/Safari validation of images+texts, selection entry/removal/cancel, transforms, Front/Trás, drag reorder, alpha pass-through, Undo/Redo, Save/Load, session restore, Preview and MP4. Do not merge or promote without explicit authorization.

## Plan Self-Review

- Tasks 1–2 implement temporary selection and Layers-only entry/order; Task 3 implements collective Stage geometry and transforms; Task 4 implements relative contextual behavior and buttons; Task 5 implements transparent image pass-through with text exception; Task 6 covers persistence, render exclusion, diagnostics, documentation, PR review and physical validation.
- Collective opacity, depth, visibility, timing and effects are exclusions only; no task alters them.
- All later tasks use the Task 1 state, Task 2 ordering rule and Task 3 gesture snapshot names; no undefined cross-task interface is referenced.
