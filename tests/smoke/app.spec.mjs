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

async function expectOperationalPlacementHud(page) {
  const geometry = await page.locator('#multiImagePlacementHud').evaluate((hud) => {
    const style = getComputedStyle(hud);
    const rect = hud.getBoundingClientRect();
    const stage = hud.closest('#stage');
    const stageRect = stage?.getBoundingClientRect();
    return {
      show:hud.classList.contains('show'), display:style.display, visibility:style.visibility,
      opacity:Number(style.opacity), rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
      stageRect:stageRect && {x:stageRect.x,y:stageRect.y,width:stageRect.width,height:stageRect.height},
    };
  });
  expect(geometry.show).toBe(true);
  expect(geometry.display).not.toBe('none');
  expect(geometry.visibility).not.toBe('hidden');
  expect(geometry.opacity).toBeGreaterThan(0);
  expect(geometry.rect.width).toBeGreaterThan(0);
  expect(geometry.rect.height).toBeGreaterThan(0);
  expect(geometry.stageRect.width).toBeGreaterThan(0);
  expect(geometry.stageRect.height).toBeGreaterThan(0);
  expect(geometry.rect.x).toBeGreaterThanOrEqual(geometry.stageRect.x - 0.5);
  expect(geometry.rect.y).toBeGreaterThanOrEqual(geometry.stageRect.y - 0.5);
  expect(geometry.rect.x + geometry.rect.width).toBeLessThanOrEqual(geometry.stageRect.x + geometry.stageRect.width + 0.5);
  expect(geometry.rect.y + geometry.rect.height).toBeLessThanOrEqual(geometry.stageRect.y + geometry.stageRect.height + 0.5);
}

async function createE8JBatch(page) {
  await openEmptyEditorForE8J(page);
  await chooseMultiImages(page, 3);
  await expect(page.locator('#multiImagePlacementHud')).toBeVisible({ timeout: 20_000 });
  await expectOperationalPlacementHud(page);
  for (let i = 0; i < 3; i++) await page.locator('#multiImagePlacementConfirm').click();
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

async function waitForSessionAutosaveQuiescent(page) {
  await expect.poll(() => page.evaluate(() => ({
    timerIdle: _sessionAutosaveTimer === null,
    writeIdle: !_sessionAutosaveWriteInFlight,
    activeWritesIdle: _sessionAutosaveActiveWrites.size === 0,
    caughtUp: _sessionAutosaveQueuedRevision <= _sessionAutosaveCommittedRevision,
  })), { timeout: 30_000 }).toEqual({ timerIdle:true, writeIdle:true, activeWritesIdle:true, caughtUp:true });
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

test('E8M: gate Plus distingue projeto vazio, adicional bloqueado e adicional permitido', async ({ page }) => {
  await openEmptyEditorForE8J(page);
  await page.evaluate(() => {
    window.__e8mOriginalCanAddImageAsset = canAddImageAsset;
    canAddImageAsset = () => false;
    document.getElementById('proModal').style.display = 'flex';
    startInsertImageFlow();
  });
  expect(await page.evaluate(() => multiImagePlacementPickerOpenedDirectly)).toBe(true);
  await expect(page.locator('#proModal')).toBeHidden();
  await chooseMultiImages(page, 1);
  await expect(page.locator('#multiImagePlacementHud')).toBeVisible({ timeout:15_000 });
  await expectOperationalPlacementHud(page);
  await page.locator('#multiImagePlacementConfirm').click();
  await expect.poll(() => page.evaluate(() => assets.length), { timeout:20_000 }).toBe(1);

  await page.evaluate(() => {
    canAddImageAsset = () => false;
    startInsertImageFlow();
  });
  await expect(page.locator('#proModal')).toBeHidden();
  await expect(page.locator('#multiImagePlacementHud')).toBeHidden();
  await expect(page.locator('#multiImagePlusModal')).toBeVisible();
  await page.evaluate(() => closeMultipleImagesPlusModal());

  await page.evaluate(() => {
    canAddImageAsset = () => true;
    startInsertImageFlow();
  });
  await expect(page.locator('#proModal')).toBeHidden();
  await chooseMultiImages(page, 1);
  await expect(page.locator('#multiImagePlacementHud')).toBeVisible({ timeout:15_000 });
  await expectOperationalPlacementHud(page);
  await page.locator('#multiImagePlacementConfirm').click();
  await expect.poll(() => page.evaluate(() => assets.length), { timeout:20_000 }).toBe(2);
  await page.evaluate(() => { canAddImageAsset = window.__e8mOriginalCanAddImageAsset; delete window.__e8mOriginalCanAddImageAsset; });
});

test('E8M: Inserir imagens abre picker direto e posiciona lote sem mutação canônica', async ({ page }) => {
  const fatalErrors=captureFatalErrors(page);
  await page.goto('/',{waitUntil:'domcontentloaded'}); await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/,{timeout:30000});
  await expect.poll(() => page.evaluate(() => loadSessionCompleted), { timeout:30_000 }).toBe(true);
  await waitForSessionAutosaveQuiescent(page);
  await page.evaluate(() => startInsertImageFlow());
  expect(await page.evaluate(() => ({
    direct:multiImagePlacementPickerOpenedDirectly,
    slot:multiImagePlacementLegacySlotChooserOpened,
    layout:multiImagePlacementLayoutSheetOpened,
    traceEnabled:multiImagePlacementAutosaveTraceEnabled,
  }))).toEqual({direct:true,slot:false,layout:false,traceEnabled:true});
  const before=await page.evaluate(()=>({assets:assets.length,undo:undoStack.length,revision:_sessionAutosaveQueuedRevision}));
  await page.evaluate(() => recordMultiImagePlacementAutosaveEvent('webkit-before-set-input-files'));
  await chooseMultiImages(page,3);
  await expect(page.locator('#multiImagePlacementHud')).toBeVisible({timeout:15000});
  await expectOperationalPlacementHud(page);
  await expect(page.locator('#multiImagePlacementCounter')).toHaveText('1/3');
  expect(await page.evaluate(()=>({assets:assets.length,undo:undoStack.length,revision:_sessionAutosaveQueuedRevision}))).toEqual(before);
  await page.locator('#multiImagePlacementConfirm').click();
  await expect(page.locator('#multiImagePlacementCounter')).toHaveText('2/3');
  await page.locator('#multiImagePlacementConfirm').click();
  await expect(page.locator('#multiImagePlacementCounter')).toHaveText('3/3');
  expect(await page.evaluate(()=>multiImagePlacementAutosavesBeforeCommit)).toBe(0);
  expect(await page.evaluate(()=>assets.length)).toBe(before.assets);
  expect(await page.evaluate(()=>multiImagePlacementAutosaveTrace.some(entry=>entry.reason==='manual-load'))).toBe(false);
  expect(await page.evaluate(()=>multiImagePlacementAutosaveTrace.filter(entry=>entry.point==='autosave-scheduled'))).toEqual([]);
  await page.locator('#multiImagePlacementConfirm').click();
  await expect(page.locator('#multiImagePlacementHud')).toBeHidden();
  expect(await page.evaluate(()=>({added:assets.length,history:multiImagePlacementHistoryEntriesCreated,autosaves:multiImagePlacementAutosavesScheduled,committed:multiImagePlacementFinalCommittedCount,selected:selectedAssetId,last:assets.at(-1).id})))
    .toEqual({added:before.assets+3,history:1,autosaves:1,committed:3,selected:await page.evaluate(()=>assets.at(-1).id),last:await page.evaluate(()=>assets.at(-1).id)});
  expect(await page.evaluate(()=>multiImagePlacementAutosaveTrace.filter(entry=>entry.point==='autosave-scheduled').map(entry=>({reason:entry.reason,before:entry.revisionBefore,after:entry.revisionAfter,phase:entry.phase})))).toEqual([
    {reason:'add-image-assets',before:before.revision,after:before.revision+1,phase:'committing'},
  ]);
  expect(await page.evaluate(()=>multiImagePlacementAutosaveTraceEnabled)).toBe(false);
  expect(fatalErrors).toEqual([]);
});

test('E8M: Cancelar sequência e arquivo inválido preservam integralmente o projeto', async ({ page }) => {
  await page.goto('/',{waitUntil:'domcontentloaded'}); await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/,{timeout:30000});
  const before=await page.evaluate(()=>JSON.stringify(captureState()));
  await chooseMultiImages(page,3); await expect(page.locator('#multiImagePlacementHud')).toBeVisible({timeout:15000});
  await page.locator('#multiImagePlacementConfirm').click(); await page.locator('#multiImagePlacementCancel').click();
  await expect(page.locator('#multiImagePlacementHud')).toBeHidden();
  expect(await page.evaluate(()=>JSON.stringify(captureState()))).toBe(before);
  await page.locator('#multiImageInsertInput').setInputFiles([imagePayload('ok.png'),{name:'invalid.webp',mimeType:'image/webp',buffer:Buffer.from('invalid')}]);
  await expect.poll(()=>page.evaluate(()=>multiImageInsertPreparationFailed),{timeout:15000}).toBe(true);
  expect(await page.evaluate(()=>JSON.stringify(captureState()))).toBe(before);
});
test('E8M: Save/Load real preserva lote, seleção, ProjectWorld e transparência', async ({ page }) => {
  const fatalErrors = captureFatalErrors(page);
  await createE8JBatch(page);
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

test('E8M: Session Restore real recupera lote completo pela escolha E8I', async ({ page }) => {
  const fatalErrors = captureFatalErrors(page);
  await createE8JBatch(page);
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

test('E8M: imagem única percorre o mesmo HUD e cria um Undo', async ({ page }) => {
  await openEmptyEditorForE8J(page); await chooseMultiImages(page,1);
  await expect(page.locator('#multiImagePlacementCounter')).toHaveText('1/1');
  expect(await page.evaluate(()=>assets.length)).toBe(0);
  await page.locator('#multiImagePlacementConfirm').click();
  await expect.poll(()=>page.evaluate(()=>assets.length),{timeout:20000}).toBe(1);
  expect(await page.evaluate(()=>({undo:undoStack.length,autosave:multiImagePlacementAutosavesScheduled,last:selectedAssetId===assets.at(-1).id}))).toEqual({undo:1,autosave:1,last:true});
});

test('E8M: arraste real mantém o alvo de pointer capture estável', async ({ page }) => {
  await openEmptyEditorForE8J(page); await chooseMultiImages(page,1); const ghost=page.locator('.pending-multi-image.current');
  await expect(ghost).toBeVisible(); const before=await ghost.boundingBox();
  await ghost.dispatchEvent('pointerdown',{pointerId:41,clientX:before.x+before.width/2,clientY:before.y+before.height/2,pointerType:'touch',isPrimary:true});
  await expect(page.locator('#multiImagePlacementConfirm')).toBeDisabled();
  await page.locator('#imageArea').dispatchEvent('pointermove',{pointerId:41,clientX:before.x+before.width/2+35,clientY:before.y+before.height/2+25,pointerType:'touch',isPrimary:true});
  await expect(page.locator('#multiImagePlacementConfirm')).toBeDisabled();
  await page.locator('#imageArea').dispatchEvent('pointerup',{pointerId:41,clientX:before.x+before.width/2+35,clientY:before.y+before.height/2+25,pointerType:'touch',isPrimary:true});
  const after=await ghost.boundingBox(); expect(after.x).not.toBe(before.x); expect(after.y).not.toBe(before.y);
  expect(await page.evaluate(()=>({stuck:multiImagePlacementPointerCaptureStuck,count:document.querySelectorAll('.pending-multi-image.current').length}))).toEqual({stuck:false,count:1});
});

test('E8M: toque e pan externos são bloqueados sem reposicionar o provisório', async ({ page }) => {
  await openEmptyEditorForE8J(page); await chooseMultiImages(page,1); const ghost=page.locator('.pending-multi-image.current'); await expect(ghost).toBeVisible();
  const area=await page.locator('#imageArea').boundingBox();
  const before=await page.evaluate(()=>({...pendingMultiImagePlacement.currentRect}));
  await page.locator('#imageArea').dispatchEvent('pointerdown',{pointerId:51,clientX:area.x+20,clientY:area.y+20,pointerType:'touch'});
  await page.locator('#imageArea').dispatchEvent('pointerup',{pointerId:51,clientX:area.x+20,clientY:area.y+20,pointerType:'touch'});
  expect(await page.evaluate(()=>pendingMultiImagePlacement.currentRect)).toEqual(before);
  await page.locator('#imageArea').dispatchEvent('pointerdown',{pointerId:52,clientX:area.x+30,clientY:area.y+30,pointerType:'touch'});
  await page.locator('#imageArea').dispatchEvent('pointermove',{pointerId:52,clientX:area.x+90,clientY:area.y+90,pointerType:'touch'});
  await page.locator('#imageArea').dispatchEvent('pointerup',{pointerId:52,clientX:area.x+90,clientY:area.y+90,pointerType:'touch'});
  expect(await page.evaluate(()=>pendingMultiImagePlacement.currentRect)).toEqual(before);
  await expect(page.locator('#statusBar')).toContainText('Confirme ou cancele a inserção atual para continuar.');
});

test('E8M: pointercancel libera captura e reabilita confirmação', async ({ page }) => {
  await openEmptyEditorForE8J(page);await chooseMultiImages(page,1);const ghost=page.locator('.pending-multi-image.current');const box=await ghost.boundingBox();
  await ghost.dispatchEvent('pointerdown',{pointerId:61,clientX:box.x+5,clientY:box.y+5,pointerType:'touch'});await ghost.dispatchEvent('pointercancel',{pointerId:61,clientX:box.x+5,clientY:box.y+5,pointerType:'touch'});
  await expect(page.locator('#multiImagePlacementConfirm')).toBeEnabled();expect(await page.evaluate(()=>multiImagePlacementPointerCaptureStuck)).toBe(false);
});

test('E8M: OK acompanha escala, rotação, pinch e perda de pointer capture reais', async ({ page }) => {
  await openEmptyEditorForE8J(page); await chooseMultiImages(page,1);
  const ok=page.locator('#multiImagePlacementConfirm');
  const handle=page.locator('.pending-multi-image.current .asset-corner-handle[data-asset-corner="br"]');
  const box=await handle.boundingBox();
  await handle.dispatchEvent('pointerdown',{pointerId:71,clientX:box.x+box.width/2,clientY:box.y+box.height/2,pointerType:'touch',isPrimary:true});
  await expect(ok).toBeDisabled();
  await handle.dispatchEvent('pointermove',{pointerId:71,clientX:box.x+box.width/2+45,clientY:box.y+box.height/2+45,pointerType:'touch',isPrimary:true});
  await expect(ok).toBeDisabled();
  await handle.dispatchEvent('pointerup',{pointerId:71,clientX:box.x+box.width/2+45,clientY:box.y+box.height/2+45,pointerType:'touch',isPrimary:true});
  await expect(ok).toBeEnabled();

  const rotatedBefore=await page.evaluate(()=>pendingMultiImagePlacement.currentRect.rotation);
  const rotatedHandleBox=await handle.boundingBox(); const rotatedGhostBox=await page.locator('.pending-multi-image.current').boundingBox();
  const startX=rotatedHandleBox.x+rotatedHandleBox.width/2,startY=rotatedHandleBox.y+rotatedHandleBox.height/2;
  const dx=startX-rotatedGhostBox.x,dy=startY-rotatedGhostBox.y;
  const endX=rotatedGhostBox.x+(dx-dy)/Math.sqrt(2),endY=rotatedGhostBox.y+(dx+dy)/Math.sqrt(2);
  await handle.dispatchEvent('pointerdown',{pointerId:72,clientX:startX,clientY:startY,pointerType:'touch',isPrimary:true});
  await expect(ok).toBeDisabled();
  await handle.dispatchEvent('pointermove',{pointerId:72,clientX:endX,clientY:endY,pointerType:'touch',isPrimary:true});
  await handle.dispatchEvent('pointercancel',{pointerId:72,clientX:endX,clientY:endY,pointerType:'touch',isPrimary:true});
  await expect(ok).toBeEnabled();
  expect(await page.evaluate(()=>pendingMultiImagePlacement.currentRect.rotation)).not.toBe(rotatedBefore);

  await page.locator('#imageArea').dispatchEvent('touchstart',{touches:[{identifier:1,clientX:30,clientY:30},{identifier:2,clientX:90,clientY:90}]});
  await expect(ok).toBeDisabled();
  await page.locator('#imageArea').dispatchEvent('touchend',{touches:[],changedTouches:[{identifier:1,clientX:30,clientY:30},{identifier:2,clientX:90,clientY:90}]});
  await expect(ok).toBeEnabled();

  const ghost=page.locator('.pending-multi-image.current'); const ghostBox=await ghost.boundingBox();
  await ghost.dispatchEvent('pointerdown',{pointerId:73,clientX:ghostBox.x+ghostBox.width/2,clientY:ghostBox.y+ghostBox.height/2,pointerType:'touch',isPrimary:true});
  await expect(ok).toBeDisabled();
  expect(await page.evaluate(()=>({pointerId:multiImagePlacementGestureDiagnostics.pointerId,active:multiImagePlacementGestureDiagnostics.gestureActive,disabled:multiImagePlacementGestureDiagnostics.confirmDisabled}))).toEqual({pointerId:73,active:true,disabled:true});
  await ghost.evaluate((element,pointerId)=>element.hasPointerCapture(pointerId)&&element.releasePointerCapture(pointerId),73);
  await expect(ok).toBeEnabled();
  expect(await page.evaluate(()=>({gesture:pendingMultiImagePlacement.gesture,stuck:multiImagePlacementPointerCaptureStuck,count:document.querySelectorAll('.pending-multi-image.current').length,reason:multiImagePlacementGestureDiagnostics.finishReason}))).toEqual({gesture:null,stuck:false,count:1,reason:expect.stringMatching(/^(lostpointercapture|capture-monitor|orphaned-capture-request|explicit-release)$/)});
});

test('E8M: Cancelar na primeira e na última etapa restaura snapshot profundo', async ({ page }) => {
  for(const confirmations of [0,2]){await openEmptyEditorForE8J(page);const before=await page.evaluate(()=>getMultiImagePlacementFingerprint());await chooseMultiImages(page,3);for(let i=0;i<confirmations;i++)await page.locator('#multiImagePlacementConfirm').click();await page.locator('#multiImagePlacementCancel').click();expect(await page.evaluate(()=>getMultiImagePlacementFingerprint())).toBe(before);expect(await page.evaluate(()=>multiImagePlacementSnapshotRestored)).toBe(true)}
});

test('E8M: falha forçada no commit faz rollback profundo sem parcial', async ({ page }) => {
  await page.goto('/',{waitUntil:'domcontentloaded'}); await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/,{timeout:30000});
  await expect.poll(()=>page.evaluate(()=>loadSessionCompleted),{timeout:30000}).toBe(true);
  await waitForSessionAutosaveQuiescent(page);
  const before=await page.evaluate(()=>({
    fingerprint:getMultiImagePlacementFingerprint(), revision:_sessionAutosaveQueuedRevision,
    selectedAssetId,nextLayerSequence,assets:stableMultiImageValue(assets),frames:stableMultiImageValue(frames.slice(0,frameCount)),
    curves:stableMultiImageValue(curvesV2),world:stableMultiImageValue(projectWorld),undo:stableMultiImageValue(undoStack),redo:stableMultiImageValue(redoStack),
    canonicalSources:assets.map(a=>{const src=_assetPersistentSourceE8E(a),dims=getImageSourceDimensions(a.drawSource||a._img);return{kind:_persistentSourceKindE8J(src),length:src.length,hash:_diagSourceHashE8E(src),width:dims.width,height:dims.height}}),
  }));
  try {
    await page.evaluate(()=>{window.__ARCO_TEST_MULTI_IMAGE_COMMIT_FAIL_AFTER__=1});
    await chooseMultiImages(page,2); await page.locator('#multiImagePlacementConfirm').click(); await page.locator('#multiImagePlacementConfirm').click();
    await expect.poll(()=>page.evaluate(()=>multiImagePlacementLastErrorType)).toBe('TypeError');
    const after=await page.evaluate(()=>({
      fingerprint:getMultiImagePlacementFingerprint(), revision:_sessionAutosaveQueuedRevision,
      selectedAssetId,nextLayerSequence,assets:stableMultiImageValue(assets),frames:stableMultiImageValue(frames.slice(0,frameCount)),
      curves:stableMultiImageValue(curvesV2),world:stableMultiImageValue(projectWorld),undo:stableMultiImageValue(undoStack),redo:stableMultiImageValue(redoStack),
      canonicalSources:assets.map(a=>{const src=_assetPersistentSourceE8E(a),dims=getImageSourceDimensions(a.drawSource||a._img);return{kind:_persistentSourceKindE8J(src),length:src.length,hash:_diagSourceHashE8E(src),width:dims.width,height:dims.height}}),pending:document.querySelectorAll('.pending-multi-image').length,
      hud:document.getElementById('multiImagePlacementHud').classList.contains('show'),restored:multiImagePlacementSnapshotRestored,
    }));
    expect(after).toEqual({...before,pending:0,hud:false,restored:true});
    expect(await page.evaluate(()=>multiImagePlacementAutosaveTraceEnabled)).toBe(false);
  } finally {
    await page.evaluate(()=>{delete window.__ARCO_TEST_MULTI_IMAGE_COMMIT_FAIL_AFTER__});
  }
});

test('E8M: Layers só recebe lote no commit; Undo e Redo são integrais', async ({ page }) => {
  await openEmptyEditorForE8J(page);
  const prepareGate=await installControlledAsyncGate(page,'prepareMultiImageFiles');
  try {
    await chooseMultiImages(page,3);
    await expect.poll(()=>page.evaluate(()=>multiImageInsertionTransactionPhase)).toBe('preparing');
    const blocked=await page.evaluate(async()=>{
      const selectionBefore=selectedAssetId;
      const layers=openLayersPanel();
      const menu=openAssetsModeContextMenu();
      const insert=startInsertImageFlow();
      togglePlay();
      await startRecord();
      selectAssetById('blocked-selection','stage');
      return {layers,menu,insert,selectionPreserved:selectedAssetId===selectionBefore,preview:isPreviewing,recording:isRecording,exportPreparing};
    });
    expect(blocked).toEqual({layers:false,menu:false,insert:false,selectionPreserved:true,preview:false,recording:false,exportPreparing:false});
    await expect(page.locator('#layersPanel')).toBeHidden();
    await expect(page.locator('#assetsModeContextMenu')).not.toHaveClass(/open/);
    await expect(page.locator('#statusBar')).toContainText('Confirme ou cancele a inserção atual para continuar.');
    await prepareGate.release();
    await expect(page.locator('#multiImagePlacementHud')).toBeVisible({timeout:15000});
    for(let i=0;i<3;i++)await page.locator('#multiImagePlacementConfirm').click();
    expect(await page.evaluate(()=>openLayersPanel())).toBe(true);
    await expect(page.locator('#layersPanel')).toBeVisible();
    await expect(page.locator('#layersList .layers-item')).toHaveCount(3);
    await page.evaluate(()=>closeLayersPanel());await page.evaluate(()=>undo());await expect.poll(()=>page.evaluate(()=>assets.length)).toBe(0);await page.evaluate(()=>redo());await expect.poll(()=>page.evaluate(()=>assets.length)).toBe(3);
  } finally { await prepareGate.restore(); }
});

test('E8M: previews pendentes não entram no renderer e Trocar continua unitário', async ({ page }) => {
  await createE8JBatch(page);
  const canonical=await page.evaluate(()=>assets.length);
  await page.evaluate(() => startInsertImageFlow());
  await chooseMultiImages(page,2);
  await expect(page.locator('#multiImagePlacementHud')).toBeVisible({timeout:15000});
  await expect.poll(()=>page.evaluate(()=>({
    active:!!pendingMultiImagePlacement?.active,
    index:pendingMultiImagePlacement?.currentIndex,
    pending:document.querySelectorAll('.pending-multi-image').length,
  }))).toEqual({active:true,index:0,pending:1});
  expect(await page.evaluate(()=>({
    assets:assets.length,
    render:buildCompleteSessionProjectData().assets.length,
    pending:document.querySelectorAll('.pending-multi-image').length,
  }))).toEqual({assets:canonical,render:canonical,pending:1});
  await page.locator('#multiImagePlacementCancel').click();
  await expect(page.locator('#multiImagePlacementHud')).toBeHidden();
  await expect(page.locator('.pending-multi-image')).toHaveCount(0);
  const target=await page.evaluate(()=>assets[0].id);
  await page.evaluate(id=>{selectAssetById(id,'webkit-unit-replace');freezeReplaceTarget({asset:assets[0],slotKey:getAssetSlotKey(assets[0])||'center'})},target);
  await page.locator('#fileInput2').setInputFiles(imagePayload('troca.png'));
  await expect.poll(()=>page.evaluate(()=>lastImageActionType),{timeout:15000}).toBe('replaceImage');
  expect(await page.evaluate(()=>assets.length)).toBe(canonical);
});

test('E8M: pinch mantém zoom do Stage e bloqueia confirmação durante o gesto', async ({ page }) => {
  await createE8JBatch(page);await chooseMultiImages(page,1);
  await page.evaluate(()=>{const event={touches:[{clientX:100,clientY:100},{clientX:200,clientY:100}],target:document.getElementById('imageArea'),preventDefault(){}};handlePendingMultiImageTouchNavigation(event);startStageNavigationFromTouches(event)});
  await expect(page.locator('#multiImagePlacementConfirm')).toBeDisabled();expect(await page.evaluate(()=>isPinching)).toBe(true);
  await page.evaluate(()=>{finishStageNavigation(false);cancelPendingMultiImageNavigation()});await expect(page.locator('#multiImagePlacementConfirm')).toBeEnabled();expect(await page.evaluate(()=>multiImagePlacementGestureConflictDetected)).toBe(false);
});

test('E8M: criação provisória de Frame permanece cancelável e confirmável', async ({ page }) => {
  await createE8JBatch(page);
  const preparation=await page.evaluate(()=>{
    setEditorMode('camera','webkit-e8k-frame-regression');
    return {mode:editorMode,frameCount,activeFrameIndex:activeIdx,insertionMode:insertFrameMode,pendingMultiImagePlacement:!!pendingMultiImagePlacement,bodyClass:document.body.className};
  });
  expect(preparation.mode).toBe('camera');expect(preparation.pendingMultiImagePlacement).toBe(false);
  const before=preparation.frameCount;
  await page.evaluate(()=>insertFrameAfterActive());await expect(page.locator('.ghost-frame')).toBeVisible();
  await page.locator('#insertionCancelBtn').dispatchEvent('pointerdown',{pointerId:701,pointerType:'touch',isPrimary:true});expect(await page.evaluate(()=>frameCount)).toBe(before);
  await page.evaluate(()=>insertFrameAfterActive());await expect(page.locator('.ghost-frame')).toBeVisible();
  await page.locator('#insertionConfirmBtn').dispatchEvent('pointerdown',{pointerId:702,pointerType:'touch',isPrimary:true});expect(await page.evaluate(()=>frameCount)).toBe(before+1);
});
