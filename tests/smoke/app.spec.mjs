import { expect, test } from '@playwright/test';
import path from 'node:path';

const projectFixture = path.resolve('samples/arquivo 8vo imagem.json');

async function clearStartupStorage(page) {
  await page.evaluate(async () => {
    sessionStorage.removeItem('arco-motion-reload-intent');
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase('arco-motion-session');
      request.onsuccess = resolve; request.onerror = () => reject(request.error); request.onblocked = resolve;
    });
  });
}

async function seedRealSessionCheckpoint(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await expect.poll(() => page.evaluate(() => isCompleteSessionProjectData(buildCompleteSessionProjectData())), { timeout: 30_000 }).toBe(true);
  await page.evaluate(async () => {
    const data = buildCompleteSessionProjectData();
    if (!isCompleteSessionProjectData(data)) throw new Error('fixture não produziu projeto completo');
    const payload = JSON.stringify(data);
    const checkpoint = { schema: SESSION_AUTOSAVE_SCHEMA, complete: true, revision: 999, payload, checksum: sessionPayloadChecksum(payload), savedAt: Date.now() };
    const db = await openSessionAutosaveDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(SESSION_AUTOSAVE_STORE, 'readwrite');
      tx.objectStore(SESSION_AUTOSAVE_STORE).put(checkpoint, SESSION_AUTOSAVE_KEY);
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    });
    db.close();
  });
}

async function reloadForStartup(page) {
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30_000 });
}

function captureFatalErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message || String(error)));
  return errors;
}

async function installControlledAsyncGate(page, functionName) {
  const gateKey = `__arcoE8iGate_${functionName}`;
  await page.evaluate(({ functionName, gateKey }) => {
    const original = window[functionName];
    if (typeof original !== 'function') throw new Error(`função indisponível: ${functionName}`);
    let release;
    const pending = new Promise((resolve) => { release = resolve; });
    window[gateKey] = { original, release };
    window[functionName] = async (...args) => {
      await pending;
      const result = await original(...args);
      window[gateKey].lastResult = result;
      return result;
    };
  }, { functionName, gateKey });
  return {
    async release() {
      await page.evaluate((key) => window[key]?.release(), gateKey);
    },
    async restore() {
      await page.evaluate(({ functionName, gateKey }) => {
        const control = window[gateKey];
        if (!control) return;
        control.release();
        window[functionName] = control.original;
        delete window[gateKey];
      }, { functionName, gateKey });
    },
    async result() {
      return page.evaluate((key) => window[key]?.lastResult, gateKey);
    },
  };
}

async function sessionCheckpointExists(page) {
  return page.evaluate(async () => {
    const db = await openSessionAutosaveDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(SESSION_AUTOSAVE_STORE, 'readonly');
        const request = tx.objectStore(SESSION_AUTOSAVE_STORE).get(SESSION_AUTOSAVE_KEY);
        request.onsuccess = () => resolve(!!request.result);
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  });
}

test('smoke test: abre o Arco Motion sem erro JS e captura render inicial', async ({ page }, testInfo) => {
  const pageErrors = [];
  const consoleErrors = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message || String(error));
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForLoadState('networkidle', { timeout: 15_000 });

  await expect(page.locator('.app'), 'elemento .app ausente no render inicial').toHaveCount(1, { timeout: 5_000 });
  await expect(page.locator('.stage'), 'elemento .stage ausente no render inicial').toHaveCount(1, { timeout: 5_000 });
  await expect(page.locator('#topBar'), 'elemento #topBar ausente no render inicial').toHaveCount(1, { timeout: 5_000 });

  const bodyText = await page.locator('body').evaluate((body) => body.innerText.trim());
  expect(bodyText.length, 'body vazio no render inicial').toBeGreaterThan(0);

  const screenshotPath = testInfo.outputPath('arco-motion-initial-render.png');
  await page.screenshot({ path: screenshotPath, fullPage: true, timeout: 10_000 }).catch((error) => {
    throw new Error(`falha de screenshot do render inicial: ${error.message}`);
  });
  await testInfo.attach('arco-motion-initial-render', { path: screenshotPath, contentType: 'image/png' });

  const capturedErrors = [...pageErrors.map((error) => `pageerror: ${error}`), ...consoleErrors.map((error) => `console.error: ${error}`)];
  expect(capturedErrors, `erro JS capturado durante a abertura:\n${capturedErrors.join('\n')}`).toEqual([]);
});

test('Recarregar abre escolha explícita e pode ser cancelado sem recarga', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.getByRole('button', { name: 'Recarregar', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Como deseja recarregar?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Reiniciar e restaurar sessão', { exact: true })).toBeVisible();
  await expect(dialog.getByText('Reabre o projeto no estado atual.', { exact: true })).toBeVisible();
  await expect(dialog.getByText('Reiniciar do zero', { exact: true })).toBeVisible();
  await expect(dialog.getByText('Limpa a sessão automática e volta ao início.', { exact: true })).toBeVisible();

  const screenshotPath = testInfo.outputPath('arco-motion-reload-choice.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('arco-motion-reload-choice', { path: screenshotPath, contentType: 'image/png' });

  await dialog.getByRole('button', { name: 'Fechar' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Arco Motion App', { exact: true })).toBeVisible();
});

test('Reiniciar do zero sem projeto recarrega e reapresenta o launcher limpo', async ({ page }) => {
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message || String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.getByRole('button', { name: 'Recarregar', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Como deseja recarregar?' });
  await expect(dialog).toBeVisible();

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30_000 }),
    dialog.getByText('Reiniciar do zero', { exact: true }).click(),
  ]);

  await expect(page.getByText('Arco Motion App', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Como deseja recarregar?' })).toBeHidden();
  const capturedErrors = [...pageErrors.map((error) => `pageerror: ${error}`), ...consoleErrors.map((error) => `console.error: ${error}`)];
  expect(capturedErrors, `erro JS capturado no reinício limpo:\n${capturedErrors.join('\n')}`).toEqual([]);
});

test('startup E8I sem checkpoint mantém launcher e não abre recuperação', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await reloadForStartup(page);
  await expect(page.locator('body')).toHaveClass(/mode-launcher/);
  await expect(page.getByRole('dialog', { name: 'Continuar sessão anterior?' })).toBeHidden();
});

test('startup E8I com checkpoint real pergunta, bloqueia dismissal e só então restaura', async ({ page }, testInfo) => {
  const fatalErrors = captureFatalErrors(page);
  await seedRealSessionCheckpoint(page);
  await reloadForStartup(page);
  const dialog = page.getByRole('dialog', { name: 'Continuar sessão anterior?' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/mode-launcher/);
  await expect.poll(() => page.evaluate(() => startupRecoveryProjectAppliedBeforeChoice)).toBe(false);
  await expect.poll(() => page.evaluate(() => startupRecoveryHydrationStartedBeforeChoice)).toBe(false);
  await expect(dialog.getByRole('button')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await page.locator('#startupRecoveryDialog').click({ position: { x: 2, y: 2 } });
  await expect(dialog).toBeVisible();
  const screenshotPath = testInfo.outputPath('arco-motion-startup-recovery-choice.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('arco-motion-startup-recovery-choice', { path: screenshotPath, contentType: 'image/png' });

  const restoreGate = await installControlledAsyncGate(page, 'restoreLastSessionAutosave');
  try {
    await dialog.getByText('Continuar de onde parei', { exact: true }).click();
    await expect(page.locator('#startupRecoveryBusy')).toBeVisible();
    await expect(page.locator('#startupRecoveryBusy')).toContainText('Recuperando sessão…');
    await expect(page.locator('#startupRecoveryContinueButton')).toBeDisabled();
    await expect(page.locator('#startupRecoveryDiscardButton')).toBeDisabled();
    await expect(dialog).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/mode-launcher/);

    await restoreGate.release();
    await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
    await expect(dialog).toBeHidden();
    await expect(page.locator('#startupRecoveryBusy')).toBeHidden();
    await expect.poll(() => restoreGate.result()).toBe(true);
    const restoreState = await page.evaluate(() => ({
      sessionRestoreCompleted,
      sessionRestoreFailed,
      sessionRestoreAppliedSuccessfully,
      sessionRestoreTokenCurrent,
      sessionRestoreNoPartialState,
      sessionRestoreAssetCount,
      sessionRestoreHydratedAssetCount,
      restoredAssetCount: assets.filter((asset) => asset && asset.type === 'image').length,
      sessionRestoreLayerIdentitiesPreserved,
      sessionRestoreProjectWorldRestored,
      appMode,
      imageLoaded: hasImageLoaded(),
      startupRecoveryEditorOpened,
      startupRecoveryRestoreCompleted,
      startupRecoveryRestoreFailed,
      startupRecoveryOperationInProgress,
    }));
    expect(restoreState).toMatchObject({
      sessionRestoreCompleted: true,
      sessionRestoreFailed: false,
      sessionRestoreAppliedSuccessfully: true,
      sessionRestoreTokenCurrent: true,
      sessionRestoreNoPartialState: true,
      sessionRestoreLayerIdentitiesPreserved: true,
      sessionRestoreProjectWorldRestored: true,
      appMode: 'editor',
      imageLoaded: true,
      startupRecoveryEditorOpened: true,
      startupRecoveryRestoreCompleted: true,
      startupRecoveryRestoreFailed: false,
      startupRecoveryOperationInProgress: false,
    });
    expect(restoreState.sessionRestoreHydratedAssetCount).toBe(restoreState.sessionRestoreAssetCount);
    expect(restoreState.restoredAssetCount).toBe(restoreState.sessionRestoreAssetCount);
  } finally {
    await restoreGate.restore();
  }
  expect(fatalErrors).toEqual([]);
});

test('startup E8I mantém recuperação disponível após falha operacional real', async ({ page }) => {
  await seedRealSessionCheckpoint(page);
  await reloadForStartup(page);
  const dialog = page.getByRole('dialog', { name: 'Continuar sessão anterior?' });
  await expect(dialog).toBeVisible();
  await page.evaluate(() => {
    window.__arcoE8iFailedRestoreOriginal = window.restoreLastSessionAutosave;
    window.restoreLastSessionAutosave = async () => false;
  });
  try {
    await dialog.getByText('Continuar de onde parei', { exact: true }).click();
    await expect(dialog).toBeVisible();
    await expect(page.locator('#startupRecoveryError')).toContainText('Não foi possível recuperar a sessão.');
    await expect(page.locator('#startupRecoveryBusy')).toBeHidden();
    await expect(page.locator('#startupRecoveryContinueButton')).toBeEnabled();
    await expect(page.locator('#startupRecoveryDiscardButton')).toBeEnabled();
    await expect(page.locator('body')).toHaveClass(/mode-launcher/);
    expect(await sessionCheckpointExists(page)).toBe(true);
    await expect.poll(() => page.evaluate(() => startupRecoveryOperationInProgress)).toBe(false);
  } finally {
    await page.evaluate(() => {
      window.restoreLastSessionAutosave = window.__arcoE8iFailedRestoreOriginal;
      delete window.__arcoE8iFailedRestoreOriginal;
    });
  }
});

test('startup E8I descarta checkpoint real e ele não reaparece', async ({ page }) => {
  await seedRealSessionCheckpoint(page);
  await reloadForStartup(page);
  const dialog = page.getByRole('dialog', { name: 'Continuar sessão anterior?' });
  await expect(dialog).toBeVisible();
  const clearGate = await installControlledAsyncGate(page, 'clearSessionAutosave');
  try {
    await dialog.getByText('Começar novo projeto', { exact: true }).click();
    await expect(page.locator('#startupRecoveryBusy')).toBeVisible();
    await expect(page.locator('#startupRecoveryBusy')).toContainText('Preparando novo projeto…');
    await expect(page.locator('#startupRecoveryContinueButton')).toBeDisabled();
    await expect(page.locator('#startupRecoveryDiscardButton')).toBeDisabled();
    await expect(dialog).toBeVisible();
    expect(await sessionCheckpointExists(page)).toBe(true);

    await clearGate.release();
    await expect(dialog).toBeHidden({ timeout: 30_000 });
    await expect(page.locator('body')).toHaveClass(/mode-launcher/);
    await expect(page.locator('#startupRecoveryBusy')).toBeHidden();
    expect(await sessionCheckpointExists(page)).toBe(false);
  } finally {
    await clearGate.restore();
  }
  await reloadForStartup(page);
  await expect(page.getByRole('dialog', { name: 'Continuar sessão anterior?' })).toBeHidden();
  await expect(page.locator('body')).toHaveClass(/mode-launcher/);
});

test('startup E8I rejeita checkpoint IndexedDB inválido com launcher seguro', async ({ page }) => {
  await seedRealSessionCheckpoint(page);
  await page.evaluate(async () => {
    const db = await openSessionAutosaveDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(SESSION_AUTOSAVE_STORE, 'readwrite');
      const request = tx.objectStore(SESSION_AUTOSAVE_STORE).get(SESSION_AUTOSAVE_KEY);
      request.onsuccess = () => { request.result.checksum = 'corrompido'; tx.objectStore(SESSION_AUTOSAVE_STORE).put(request.result, SESSION_AUTOSAVE_KEY); };
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await reloadForStartup(page);
  await expect(page.locator('body')).toHaveClass(/mode-launcher/);
  await expect(page.getByRole('dialog', { name: 'Continuar sessão anterior?' })).toBeHidden();
  await expect.poll(() => page.evaluate(() => startupRecoveryInvalidCheckpointHandledSafely)).toBe(true);
});

test('intenção E8H restore restaura diretamente sem pergunta E8I', async ({ page }) => {
  await seedRealSessionCheckpoint(page);
  await page.evaluate(() => sessionStorage.setItem(RELOAD_STARTUP_INTENT_KEY, 'restore'));
  await reloadForStartup(page);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await expect(page.getByRole('dialog', { name: 'Continuar sessão anterior?' })).toBeHidden();
  await expect.poll(() => page.evaluate(() => startupRecoveryBypassReason)).toBe('explicit-reload-restore');
});

test('intenção E8H clean mantém launcher sem pergunta E8I', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.evaluate(() => sessionStorage.setItem(RELOAD_STARTUP_INTENT_KEY, 'clean'));
  await reloadForStartup(page);
  await expect(page.locator('body')).toHaveClass(/mode-launcher/);
  await expect(page.getByRole('dialog', { name: 'Continuar sessão anterior?' })).toBeHidden();
  await expect.poll(() => page.evaluate(() => startupRecoveryBypassReason)).toBe('explicit-reload-clean');
});

test('E8O mantém imagem, seleção e painéis de asset sincronizados no Stage', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await page.evaluate(() => {
    setEditorMode('assets', 'webkit-e8o');
    const asset = assets.find((candidate) => candidate && candidate.type === 'image');
    selectAssetById(asset.id, 'webkit-e8o');
    asset.depth = 50;
    if (frameCount < 2) {
      frames[1] = { ...frames[0], x: frames[0].x + 80, y: frames[0].y + 40 };
      frameRotations[1] = frameRotations[0] || 0;
      frameCount = 2;
    }
    commitFilmSelection(0, -1, 'webkit-e8o-start');
    refreshAssetStageVisualGeometry('webkit-e8o-start');
  });

  await page.locator('#tbAssetScale').click();
  await expect(page.locator('#assetContextPanel')).toBeVisible();
  await expect(page.locator('#assetContextPanelTitle')).toHaveText('Escala');
  const openPanelLayout = await page.evaluate(() => {
    const panel = document.getElementById('assetContextPanel').getBoundingClientRect();
    const slot = document.getElementById('lowerContextSlot').getBoundingClientRect();
    const normalToolbar = getComputedStyle(document.getElementById('toolbar'));
    const backButton = getComputedStyle(document.querySelector('#assetContextPanel .asset-context-back'));
    const lowerLeftControl = document.querySelector('.lower-global-duration').getBoundingClientRect();
    return {
      bodyState: document.body.classList.contains('asset-context-panel-open'),
      toolbarDisplay: normalToolbar.display,
      backButtonBackground: backButton.backgroundColor,
      backButtonBorderStyle: backButton.borderStyle,
      slotSpansBothColumns: slot.left <= lowerLeftControl.left + 1 && slot.right >= lowerLeftControl.right - 1,
      panelUsesSlotWidth: Math.abs(panel.left - slot.left) <= 1 && Math.abs(panel.right - slot.right) <= 1,
      panelCoversNormalLeftControl: panel.left <= lowerLeftControl.left + 1 && panel.right >= lowerLeftControl.right - 1
    };
  });
  expect(openPanelLayout).toEqual({
    bodyState: true,
    toolbarDisplay: 'none',
    backButtonBackground: 'rgba(0, 0, 0, 0)',
    backButtonBorderStyle: 'none',
    slotSpansBothColumns: true,
    panelUsesSlotWidth: true,
    panelCoversNormalLeftControl: true
  });
  await expect.poll(() => page.evaluate(() => ({
    proModalDoesNotInterceptAssetToolbar: buildDiagnosticsText().includes('proModalInterceptsAssetToolbar: false'),
    hiddenAssetPanelDoesNotIntercept: buildDiagnosticsText().includes('hiddenAssetPanelInterceptDetected: false'),
    assetContextPanelsAreExclusive: buildDiagnosticsText().includes('assetContextPanelsExclusive: true'),
    assetContextPanelMode: assetContextPanelKind
  }))).toEqual({
    proModalDoesNotInterceptAssetToolbar: true,
    hiddenAssetPanelDoesNotIntercept: true,
    assetContextPanelsAreExclusive: true,
    assetContextPanelMode: 'scale'
  });

  const scaleResult = await page.evaluate(() => {
    const asset = getSelectedAsset();
    const baseline = getAssetScaleBaselineWorldSize(asset);
    const cx = (asset.worldX || 0) + (asset.worldW || 0) / 2;
    const cy = (asset.worldY || 0) + (asset.worldH || 0) / 2;
    asset.worldW = baseline.width;
    asset.worldH = baseline.height;
    asset.worldX = cx - baseline.width / 2;
    asset.worldY = cy - baseline.height / 2;
    asset.rotation = 17;
    asset.depth = 42;
    invalidateProjectWorldComposite();
    refreshAssetStageVisualGeometry('webkit-e8o-scale-baseline');
    openAssetContextPanel('scale');
    const slider = document.getElementById('assetContextSlider');
    const before = {
      pct: getAssetContextScalePercent(asset),
      sliderValue: Number(slider.value),
      cx: asset.worldX + asset.worldW / 2,
      cy: asset.worldY + asset.worldH / 2,
      ratio: asset.worldW / asset.worldH,
      rotation: asset.rotation,
      depth: asset.depth,
      zIndex: asset.zIndex,
      visible: asset.visible,
      slotRow: asset.slotRow,
      slotCol: asset.slotCol,
      id: asset.id
    };
    setAssetContextValue(before.pct + 1);
    const firstMove = {
      pct: getAssetContextScalePercent(asset),
      jumpDetected: assetScaleFirstDragJumpDetected,
      widthDelta: Math.abs(asset.worldW - baseline.width)
    };
    commitAssetContextGesture();
    openAssetContextPanel('scale');
    setAssetContextValue(150);
    commitAssetContextGesture();
    openAssetContextPanel('scale');
    setAssetContextValue(80);
    commitAssetContextGesture();
    openAssetContextPanel('scale');
    resetAssetContextValue();
    const afterReset = {
      pct: getAssetContextScalePercent(asset),
      w: asset.worldW,
      h: asset.worldH,
      cx: asset.worldX + asset.worldW / 2,
      cy: asset.worldY + asset.worldH / 2,
      ratio: asset.worldW / asset.worldH,
      rotation: asset.rotation,
      depth: asset.depth,
      zIndex: asset.zIndex,
      visible: asset.visible,
      slotRow: asset.slotRow,
      slotCol: asset.slotCol,
      id: asset.id,
      baselineValid: assetScaleBaselineValid,
      usesCanonicalBaseline: assetScaleUsesCanonicalBaseline,
      initialMatchesVisual: assetScaleInitialValueMatchesVisualGeometry,
      resetReturns100: assetScaleResetReturnsCanonical100Percent,
      resetMatchesBaseline: assetScaleResetGeometryMatchesBaseline
    };
    undo();
    const afterUndoPct = getAssetContextScalePercent(getSelectedAsset());
    redo();
    const afterRedoPct = getAssetContextScalePercent(getSelectedAsset());
    const project = buildProjectData(true);
    const saved = project.assets.find(candidate => candidate && candidate.id === asset.id);
    return { baseline, before, firstMove, afterReset, afterUndoPct, afterRedoPct,
      savedWorldW: saved && saved.worldW, savedWorldH: saved && saved.worldH };
  });
  expect(scaleResult.baseline.valid).toBe(true);
  expect(scaleResult.before.pct).toBeCloseTo(100, 3);
  expect(scaleResult.before.sliderValue).toBeCloseTo(100, 3);
  expect(scaleResult.firstMove.pct).toBeCloseTo(101, 3);
  expect(scaleResult.firstMove.jumpDetected).toBe(false);
  expect(scaleResult.firstMove.widthDelta).toBeLessThan(scaleResult.baseline.width * 0.02);
  expect(scaleResult.afterReset.pct).toBeCloseTo(100, 3);
  expect(scaleResult.afterReset.w).toBeCloseTo(scaleResult.baseline.width, 3);
  expect(scaleResult.afterReset.h).toBeCloseTo(scaleResult.baseline.height, 3);
  expect(scaleResult.afterReset.cx).toBeCloseTo(scaleResult.before.cx, 3);
  expect(scaleResult.afterReset.cy).toBeCloseTo(scaleResult.before.cy, 3);
  expect(scaleResult.afterReset.ratio).toBeCloseTo(scaleResult.before.ratio, 6);
  expect(scaleResult.afterReset.rotation).toBe(scaleResult.before.rotation);
  expect(scaleResult.afterReset.depth).toBe(scaleResult.before.depth);
  expect(scaleResult.afterReset.zIndex).toBe(scaleResult.before.zIndex);
  expect(scaleResult.afterReset.visible).toBe(scaleResult.before.visible);
  expect(scaleResult.afterReset.slotRow).toBe(scaleResult.before.slotRow);
  expect(scaleResult.afterReset.slotCol).toBe(scaleResult.before.slotCol);
  expect(scaleResult.afterReset.id).toBe(scaleResult.before.id);
  expect(scaleResult.afterReset.baselineValid).toBe(true);
  expect(scaleResult.afterReset.usesCanonicalBaseline).toBe(true);
  expect(scaleResult.afterReset.initialMatchesVisual).toBe(true);
  expect(scaleResult.afterReset.resetReturns100).toBe(true);
  expect(scaleResult.afterReset.resetMatchesBaseline).toBe(true);
  expect(scaleResult.afterUndoPct).toBeCloseTo(80, 3);
  expect(scaleResult.afterRedoPct).toBeCloseTo(100, 3);
  expect(scaleResult.savedWorldW).toBeCloseTo(scaleResult.baseline.width, 3);
  expect(scaleResult.savedWorldH).toBeCloseTo(scaleResult.baseline.height, 3);
  await page.locator('#assetContextPanel .asset-context-back').click();
  await expect(page.locator('#assetContextPanel')).toBeHidden();
  await expect(page.locator('#tbAssetRotate')).toBeVisible();
  await expect.poll(() => page.evaluate(() => ({
    bodyState: document.body.classList.contains('asset-context-panel-open'),
    panelPointerEvents: getComputedStyle(document.getElementById('assetContextPanel')).pointerEvents,
    toolbarDisplay: getComputedStyle(document.getElementById('toolbar')).display
  }))).toEqual({ bodyState: false, panelPointerEvents: 'none', toolbarDisplay: 'flex' });
  await page.locator('#tbAssetRotate').click();
  await expect(page.locator('#assetContextPanelTitle')).toHaveText('Rotação');
  await expect.poll(() => page.evaluate(() => assetContextPanelKind)).toBe('rotation');
  await page.locator('#assetContextPanel .asset-context-back').click();
  await expect(page.locator('#assetContextPanel')).toBeHidden();
  await expect(page.locator('#tbAssetDepth')).toBeVisible();
  await page.locator('#tbAssetDepth').click();
  await expect(page.locator('#assetContextPanelTitle')).toHaveText('Profundidade');
  await expect.poll(() => page.evaluate(() => assetContextPanelKind)).toBe('depth');
  await page.locator('#assetContextPanel .asset-context-back').click();
  await expect(page.locator('#assetContextPanel')).toBeHidden();
  await expect(page.locator('#tbAssetScale')).toBeVisible();
  await page.locator('#tbAssetDepth').click();
  await expect(page.locator('#assetContextPanelTitle')).toHaveText('Profundidade');

  const transformResult = await page.evaluate(() => {
    let asset = getSelectedAsset();
    const zIndex = asset.zIndex;
    const undoStart = undoStack.length;
    setAssetContextValue(60); commitAssetContextGesture();
    const depthUndoCount = undoStack.length - undoStart;
    const undoBeforeReset = undoStack.length;
    resetAssetContextValue();
    const resetUndoCount = undoStack.length - undoBeforeReset;
    const depthAfterReset = asset.depth;
    undo(); const depthAfterUndo = getSelectedAsset().depth; redo();
    asset = getSelectedAsset();
    openAssetContextPanel('scale');
    const widthBefore = asset.worldW;
    setAssetContextValue(Math.min(300, getAssetContextScalePercent(asset) + 10)); commitAssetContextGesture();
    openAssetContextPanel('rotation');
    const rotationBefore = asset.rotation;
    setAssetContextValue(rotationBefore + 10); commitAssetContextGesture();
    return { depthUndoCount, resetUndoCount, depthAfterReset, depthAfterUndo,
      zIndexUnchanged: asset.zIndex === zIndex, scaled: asset.worldW !== widthBefore,
      rotated: asset.rotation !== rotationBefore };
  });
  expect(transformResult.depthUndoCount).toBe(1);
  expect(transformResult.resetUndoCount).toBe(1);
  expect(transformResult.depthAfterReset).toBe(0);
  expect(transformResult.depthAfterUndo).toBe(60);
  expect(transformResult.zIndexUnchanged).toBe(true);
  expect(transformResult.scaled).toBe(true);
  expect(transformResult.rotated).toBe(true);

  const activeFrameGeometryResult = await page.evaluate(() => {
    closeAssetContextPanel();
    commitFilmSelection(0, -1, 'webkit-e8o-active-frame-geometry-start');
    const asset = getSelectedAsset();
    asset.depth = 50;
    refreshAssetStageVisualGeometry('webkit-e8o-active-frame-geometry-start');
    const imageBefore = document.querySelector(`.world-extra-img[data-asset-id="${asset.id}"]`).getBoundingClientRect();
    const selectionBefore = document.getElementById('assetSelectOutline').getBoundingClientRect();
    const canonicalBefore = { x: asset.worldX, y: asset.worldY, w: asset.worldW, h: asset.worldH, rotation: asset.rotation };
    const frameIndexBefore = activeIdx;
    frames[activeIdx].x += 24;
    frames[activeIdx].y += 12;
    frames[activeIdx].w *= 1.02;
    frameRotations[activeIdx] = (frameRotations[activeIdx] || 0) + 5;
    renderAll();
    const imageAfter = document.querySelector(`.world-extra-img[data-asset-id="${asset.id}"]`).getBoundingClientRect();
    const selectionAfter = document.getElementById('assetSelectOutline').getBoundingClientRect();
    return {
      sameFrameIndex: activeIdx === frameIndexBefore,
      imageDelta: { x: imageAfter.x - imageBefore.x, y: imageAfter.y - imageBefore.y },
      selectionDelta: { x: selectionAfter.x - selectionBefore.x, y: selectionAfter.y - selectionBefore.y },
      canonicalUnchanged: asset.worldX === canonicalBefore.x && asset.worldY === canonicalBefore.y &&
        asset.worldW === canonicalBefore.w && asset.worldH === canonicalBefore.h && asset.rotation === canonicalBefore.rotation,
      updatedAfterGeometryChange: parallaxStageUpdatesAfterActiveFrameGeometryChange,
      requiresFrameIndexChange: parallaxStageRefreshRequiresFrameIndexChange,
      requiresModeSwitch: parallaxStageRefreshRequiresModeSwitch,
      requiresTimelineRetap: parallaxStageRefreshRequiresTimelineRetap,
      cameraMatchesCanonical: parallaxStageCameraStateMatchesCanonicalReference
    };
  });
  expect(activeFrameGeometryResult.sameFrameIndex).toBe(true);
  expect(Math.abs(activeFrameGeometryResult.imageDelta.x) + Math.abs(activeFrameGeometryResult.imageDelta.y)).toBeGreaterThan(0);
  expect(activeFrameGeometryResult.imageDelta.x).toBeCloseTo(activeFrameGeometryResult.selectionDelta.x, 1);
  expect(activeFrameGeometryResult.imageDelta.y).toBeCloseTo(activeFrameGeometryResult.selectionDelta.y, 1);
  expect(activeFrameGeometryResult.canonicalUnchanged).toBe(true);
  expect(activeFrameGeometryResult.updatedAfterGeometryChange).toBe(true);
  expect(activeFrameGeometryResult.requiresFrameIndexChange).toBe(false);
  expect(activeFrameGeometryResult.requiresModeSwitch).toBe(false);
  expect(activeFrameGeometryResult.requiresTimelineRetap).toBe(false);
  expect(activeFrameGeometryResult.cameraMatchesCanonical).toBe(true);

  const result = await page.evaluate(() => {
    closeAssetContextPanel();
    const asset = getSelectedAsset();
    const imageBefore = document.querySelector(`.world-extra-img[data-asset-id="${asset.id}"]`).getBoundingClientRect();
    const selectionBefore = document.getElementById('assetSelectOutline').getBoundingClientRect();
    const canonicalBefore = { x: asset.worldX, y: asset.worldY };
    const undoBefore = undoStack.length;
    const revisionBefore = sessionAutosaveRevision;
    commitFilmSelection(1, -1, 'timeline-tap-webkit-e8o');
    const imageAfter = document.querySelector(`.world-extra-img[data-asset-id="${asset.id}"]`).getBoundingClientRect();
    const selectionAfter = document.getElementById('assetSelectOutline').getBoundingClientRect();
    return {
      imageDelta: { x: imageAfter.x - imageBefore.x, y: imageAfter.y - imageBefore.y },
      selectionDelta: { x: selectionAfter.x - selectionBefore.x, y: selectionAfter.y - selectionBefore.y },
      canonicalUnchanged: asset.worldX === canonicalBefore.x && asset.worldY === canonicalBefore.y,
      undoUnchanged: undoStack.length === undoBefore,
      autosaveUnchanged: sessionAutosaveRevision === revisionBefore,
      hiddenPanelPointerEvents: getComputedStyle(document.getElementById('assetContextPanel')).pointerEvents,
    };
  });
  expect(result.imageDelta.x).toBeCloseTo(result.selectionDelta.x, 1);
  expect(result.imageDelta.y).toBeCloseTo(result.selectionDelta.y, 1);
  expect(result.canonicalUnchanged).toBe(true);
  expect(result.undoUnchanged).toBe(true);
  expect(result.autosaveUnchanged).toBe(true);
  expect(result.hiddenPanelPointerEvents).toBe('none');
});
