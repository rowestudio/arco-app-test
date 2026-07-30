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

  await dialog.getByText('Continuar de onde parei', { exact: true }).click();
  await expect(page.locator('#startupRecoveryBusy')).toContainText('Recuperando sessão…');
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await expect(dialog).toBeHidden();
  expect(fatalErrors).toEqual([]);
});

test('startup E8I descarta checkpoint real e ele não reaparece', async ({ page }) => {
  await seedRealSessionCheckpoint(page);
  await reloadForStartup(page);
  const dialog = page.getByRole('dialog', { name: 'Continuar sessão anterior?' });
  await expect(dialog).toBeVisible();
  await dialog.getByText('Começar novo projeto', { exact: true }).click();
  await expect(page.locator('#startupRecoveryBusy')).toContainText('Preparando novo projeto…');
  await expect(dialog).toBeHidden({ timeout: 30_000 });
  await expect(page.locator('body')).toHaveClass(/mode-launcher/);
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
