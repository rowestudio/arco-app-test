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

const transparentPngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNgYGAAAAAEAAHI6uv5AAAAAElFTkSuQmCC',
  'base64',
);
const imagePayload = (name) => ({ name, mimeType: 'image/png', buffer: transparentPngBuffer });

async function openEmptyEditorForE8J(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.evaluate(() => setAppMode('editor'));
}

async function chooseMultiImages(page, count = 3) {
  await page.locator('#multiImageInsertInput').setInputFiles(
    Array.from({ length: count }, (_, index) => imagePayload(`imagem-${index + 1}.png`)),
  );
}

async function createE8JBatch(page, layoutButton = 'Distribuir na horizontal') {
  await openEmptyEditorForE8J(page);
  await chooseMultiImages(page, 3);
  await page.getByRole('dialog', { name: 'Inserir 3 imagens' }).getByRole('button', { name: layoutButton }).click();
  await expect.poll(() => page.evaluate(() => multiImageInsertCommittedCount), { timeout: 20_000 }).toBe(3);
}

async function captureE8JProjectState(page) {
  return page.evaluate(() => ({
    assets: assets.filter(a => a?.type === 'image').map(a => ({
      id:a.id, layerSequence:a.layerSequence, layerName:a.layerName, worldX:a.worldX, worldY:a.worldY,
      worldW:a.worldW, worldH:a.worldH, zIndex:a.zIndex, mimeType:a.mimeType, hasAlpha:a.hasAlpha,
    })),
    selectedAssetId,
    projectWorld: { ...projectWorld },
  }));
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

test('E8J: uma imagem usa fluxo unitário sem folha múltipla', async ({ page }) => {
  const fatalErrors = captureFatalErrors(page);
  await openEmptyEditorForE8J(page);
  await chooseMultiImages(page, 1);
  await expect(page.locator('#multiImageLayoutSheet')).toBeHidden();
  await expect.poll(() => page.evaluate(() => assets.filter(a => a?.type === 'image').length), { timeout: 15_000 }).toBe(1);
  expect(fatalErrors).toEqual([]);
});

test('E8J: três imagens abrem folha sem mutar e Cancelar preserva projeto', async ({ page }) => {
  await openEmptyEditorForE8J(page);
  const before = await page.evaluate(() => ({ assets: assets.length, undo: undoStack.length, revision: _sessionAutosaveQueuedRevision, sequence: nextLayerSequence }));
  await chooseMultiImages(page, 3);
  const dialog = page.getByRole('dialog', { name: 'Inserir 3 imagens' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Como deseja organizar as imagens no Stage?', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => ({ assets: assets.length, undo: undoStack.length, revision: _sessionAutosaveQueuedRevision, sequence: nextLayerSequence }))).toEqual(before);
  await dialog.getByRole('button', { name: 'Cancelar' }).click();
  await expect(dialog).toBeHidden();
  expect(await page.evaluate(() => ({ assets: assets.length, undo: undoStack.length, revision: _sessionAutosaveQueuedRevision, sequence: nextLayerSequence }))).toEqual(before);
});

for (const [button, layout] of [
  ['Empilhar no centro', 'stack'],
  ['Distribuir na horizontal', 'horizontal'],
  ['Distribuir na vertical', 'vertical'],
]) {
  test(`E8J: ${button} faz commit atômico no projeto vazio`, async ({ page }) => {
    const fatalErrors = captureFatalErrors(page);
    await openEmptyEditorForE8J(page);
    await chooseMultiImages(page, 3);
    const dialog = page.getByRole('dialog', { name: 'Inserir 3 imagens' });
    const prepareGate = await installControlledAsyncGate(page, 'prepareMultiImageFiles');
    try {
      await dialog.getByRole('button', { name: button }).click();
      await expect(dialog.getByText('Preparando 3 imagens…', { exact: true })).toBeVisible();
      await expect(page.locator('#multiImageLayoutActions')).toBeHidden();
      await expect(dialog).toBeVisible();
      expect(await page.evaluate(() => ({
        committed: multiImageInsertCommittedCount,
        assets: assets.length,
        undo: undoStack.length,
        autosaves: multiImageInsertAutosavesScheduled,
      }))).toEqual({ committed: 0, assets: 0, undo: 0, autosaves: 0 });
      await prepareGate.release();
      await expect(dialog).toBeHidden({ timeout: 20_000 });
    } finally {
      await prepareGate.restore();
    }
    const state = await page.evaluate(() => ({
      count: assets.filter(a => a?.type === 'image').length,
      layout: multiImageInsertLayout,
      committed: multiImageInsertCommittedCount,
      selected: selectedAssetId,
      last: assets.filter(a => a?.type === 'image').at(-1)?.id,
      sequences: assets.filter(a => a?.type === 'image').map(a => a.layerSequence),
      alpha: multiImageInsertAlphaCount,
      undo: undoStack.length,
      autosaves: multiImageInsertAutosavesScheduled,
      bounds: getWorldViewBoundsWorld(),
      rects: assets.filter(a => a?.type === 'image').map(a => ({ id:a.id,x:a.worldX,y:a.worldY,w:a.worldW,h:a.worldH })),
    }));
    expect(state).toMatchObject({ count: 3, layout, committed: 3, alpha: 3, undo: 1, autosaves: 1 });
    expect(state.selected).toBe(state.last);
    expect(state.sequences).toEqual([1, 2, 3]);
    expect(state.bounds.w).toBeGreaterThan(0); expect(state.bounds.h).toBeGreaterThan(0);
    if (layout === 'horizontal') {
      for (let i = 1; i < state.rects.length; i++) expect(state.rects[i - 1].x + state.rects[i - 1].w).toBeLessThan(state.rects[i].x);
    }
    if (layout === 'vertical') {
      for (let i = 1; i < state.rects.length; i++) expect(state.rects[i - 1].y + state.rects[i - 1].h).toBeLessThan(state.rects[i].y);
    }
    const navigation = await page.evaluate(() => {
      const imageAssets = assets.filter(a => a?.type === 'image');
      const first = imageAssets[0], last = imageAssets.at(-1);
      const firstReached = centerEditorViewportOnAsset(first.id); selectAssetById(first.id, 'webkit-project-world-first');
      const firstSelected = selectedAssetId === first.id;
      const lastReached = centerEditorViewportOnAsset(last.id); selectAssetById(last.id, 'webkit-project-world-last');
      return { firstReached, firstSelected, lastReached, lastSelected: selectedAssetId === last.id };
    });
    expect(navigation).toEqual({ firstReached:true, firstSelected:true, lastReached:true, lastSelected:true });
    expect(fatalErrors).toEqual([]);
  });
}

test('E8J: arquivo inválido intermediário não deixa commit parcial', async ({ page }) => {
  await openEmptyEditorForE8J(page);
  await page.locator('#multiImageInsertInput').setInputFiles([
    imagePayload('valida-1.png'),
    { name: 'invalida.png', mimeType: 'image/png', buffer: Buffer.from('arquivo-invalido') },
    imagePayload('valida-2.png'),
  ]);
  const dialog = page.getByRole('dialog', { name: 'Inserir 3 imagens' });
  await dialog.getByRole('button', { name: 'Empilhar no centro' }).click();
  await expect.poll(() => page.evaluate(() => multiImageInsertPreparationFailed), { timeout: 15_000 }).toBe(true);
  expect(await page.evaluate(() => ({ assets: assets.length, undo: undoStack.length, revision: _sessionAutosaveQueuedRevision, committed: multiImageInsertCommittedCount })))
    .toEqual({ assets: 0, undo: 0, revision: 0, committed: 0 });
});

test('E8J: lote existente tem Undo/Redo único e Trocar imagem segue unitário', async ({ page }) => {
  await openEmptyEditorForE8J(page);
  await chooseMultiImages(page, 1);
  await expect.poll(() => page.evaluate(() => assets.length), { timeout: 15_000 }).toBe(1);
  await page.evaluate(() => { pendingImageAction = 'insertImage'; pendingImageTargetSlot = { key: 'center', row: 0, col: 0 }; });
  await chooseMultiImages(page, 3);
  await page.getByRole('dialog', { name: 'Inserir 3 imagens' }).getByRole('button', { name: 'Distribuir na horizontal' }).click();
  await expect.poll(() => page.evaluate(() => assets.length), { timeout: 20_000 }).toBe(4);
  await page.evaluate(() => undo());
  await expect.poll(() => page.evaluate(() => assets.length)).toBe(1);
  await page.evaluate(() => redo());
  await expect.poll(() => page.evaluate(() => assets.length)).toBe(4);
  const inputContract = await page.evaluate(() => ({ unitMultiple: document.getElementById('fileInput2').multiple, multiMultiple: document.getElementById('multiImageInsertInput').multiple }));
  expect(inputContract).toEqual({ unitMultiple: false, multiMultiple: true });
  await page.evaluate(() => { pendingImageAction = 'replaceImage'; pendingImageTargetAssetId = assets[0].id; selectAssetById(assets[0].id, 'webkit-replace'); });
  await page.locator('#fileInput2').setInputFiles(imagePayload('troca.png'));
  await expect.poll(() => page.evaluate(() => lastImageActionType), { timeout: 15_000 }).toBe('replaceImage');
});

test('E8J: Save/Load real preserva lote, seleção, ProjectWorld e transparência', async ({ page }) => {
  const fatalErrors = captureFatalErrors(page);
  await createE8JBatch(page, 'Distribuir na horizontal');
  const before = await captureE8JProjectState(page);
  const serialized = await page.evaluate(() => buildCompleteSessionProjectData());
  expect(serialized.assets).toHaveLength(3);
  await page.evaluate(async data => {
    clearCurrentProjectForNewFile();
    const applied = await applyProjectData(data, { origin: 'webkit-e8j-save-load' });
    if (!applied) throw new Error('applyProjectData-failed');
  }, serialized);
  await expect.poll(() => page.evaluate(() => loadSessionCompleted), { timeout: 20_000 }).toBe(true);
  const after = await captureE8JProjectState(page);
  expect(after).toEqual(before);
  await expect(page.locator('#layersList .layers-item')).toHaveCount(3);
  const navigation = await page.evaluate(() => {
    const list = assets.filter(a => a?.type === 'image');
    return [centerEditorViewportOnAsset(list[0].id), centerEditorViewportOnAsset(list.at(-1).id)];
  });
  expect(navigation).toEqual([true, true]);
  const alphaPixel = await page.evaluate(async () => {
    const asset = assets.find(a => a?.type === 'image' && a.hasAlpha);
    const drawable = asset.drawSource || asset._img || (asset === getMainImageAsset() ? getCanonicalRenderSource() : null);
    const dims = getImageSourceDimensions(drawable);
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#ff00ff'; ctx.fillRect(0,0,1,1); ctx.drawImage(drawable,0,0,1,1);
    const pixel = Array.from(ctx.getImageData(0,0,1,1).data);
    multiImageLoadedAlphaPixelPreserved = pixel.join(',') === '255,0,255,255';
    recordMultiImageLoadedSourceDiagnostics(asset, drawable);
    return {
      id:asset.id, pixel, mime:asset.mimeType, hasAlpha:asset.hasAlpha,
      sourceKind:multiImageLoadedSourceKind, durable:multiImageLoadedSourceDurable,
      drawableReady:multiImageLoadedDrawableReady, width:dims.width, height:dims.height,
      staleBlob:multiImageStaleBlobDetected, alphaPreserved:multiImageLoadedAlphaPixelPreserved,
    };
  });
  expect(alphaPixel.mime).toBe('image/png');
  expect(alphaPixel.hasAlpha).toBe(true);
  expect(alphaPixel.sourceKind).toBe('data');
  expect(alphaPixel.durable).toBe(true);
  expect(alphaPixel.drawableReady).toBe(true);
  expect(alphaPixel.width).toBeGreaterThan(0);
  expect(alphaPixel.height).toBeGreaterThan(0);
  expect(alphaPixel.staleBlob).toBe(false);
  expect(alphaPixel.alphaPreserved).toBe(true);
  expect(alphaPixel.pixel).toEqual([255, 0, 255, 255]);
  expect(fatalErrors).toEqual([]);
});

test('E8J: Session Restore real recupera lote completo pela escolha E8I', async ({ page }) => {
  const fatalErrors = captureFatalErrors(page);
  await createE8JBatch(page, 'Distribuir na vertical');
  const before = await captureE8JProjectState(page);
  await page.evaluate(async () => {
    clearTimeout(_sessionAutosaveTimer); _sessionAutosaveTimer = null;
    const revision = Math.max(_sessionAutosaveQueuedRevision, _sessionAutosaveCommittedRevision) + 1;
    const ok = await writeSessionAutosave(revision, _sessionAutosaveEpoch, true, 'webkit-e8j-session');
    if (!ok) throw new Error('session-write-failed');
  });
  expect(await sessionCheckpointExists(page)).toBe(true);
  await reloadForStartup(page);
  const dialog = page.getByRole('dialog', { name: 'Continuar sessão anterior?' });
  await expect(dialog).toBeVisible();
  await dialog.getByText('Continuar de onde parei', { exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await expect(dialog).toBeHidden();
  await expect.poll(() => page.evaluate(() => sessionRestoreCompleted), { timeout: 30_000 }).toBe(true);
  const after = await captureE8JProjectState(page);
  expect(after).toEqual(before);
  await expect(page.locator('#layersList .layers-item')).toHaveCount(3);
  const restored = await page.evaluate(() => {
    const list = assets.filter(a => a?.type === 'image');
    const first = centerEditorViewportOnAsset(list[0].id);
    const last = centerEditorViewportOnAsset(list.at(-1).id);
    return { first, last, noPartial:sessionRestoreNoPartialState, alpha:list.filter(a=>a.hasAlpha).length };
  });
  expect(restored).toEqual({ first:true, last:true, noPartial:true, alpha:3 });
  expect(fatalErrors).toEqual([]);
});
