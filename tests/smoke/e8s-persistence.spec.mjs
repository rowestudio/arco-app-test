import { expect, test } from '@playwright/test';
import path from 'node:path';

const projectFixture = path.resolve('samples/arquivo 8vo imagem.json');

async function clearStartupStorage(page) {
  await page.evaluate(async () => {
    sessionStorage.removeItem('arco-motion-reload-intent');
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase('arco-motion-session');
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
      request.onblocked = resolve;
    });
  });
}

test('E8S real multilayer preserva fonte substituída em Save Load e Session Restore', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });

  await page.waitForFunction(() => {
    const images = assets.filter((asset) => asset && asset.type === 'image');
    return images.length >= 3 && images.every((asset) => !!_assetPersistentSourceE8E(asset));
  }, null, { timeout: 45_000 });

  const replaced = await page.evaluate(async () => {
    const images = assets.filter((asset) => asset && asset.type === 'image');
    const candidates = images
      .filter((asset) => String(asset.id) !== 'img-1' && !!_assetPersistentSourceE8E(asset))
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const target = candidates[0];
    if (!target) throw new Error('fixture real multiasset sem alvo não primário persistente');

    const identity = (asset) => ({
      id: String(asset.id),
      layerSequence: asset.layerSequence,
      layerName: asset.layerName,
      zIndex: asset.zIndex,
      slotRow: asset.slotRow,
      slotCol: asset.slotCol,
      visible: asset.visible,
      worldX: asset.worldX,
      worldY: asset.worldY,
      worldW: asset.worldW,
      worldH: asset.worldH,
      rotation: asset.rotation,
      scale: asset.scale,
      depth: asset.depth
    });
    const snapshotOthers = () => assets
      .filter((asset) => asset && asset.type === 'image' && String(asset.id) !== String(target.id))
      .map((asset) => ({ identity: identity(asset), hash: _diagSourceHashE8E(_assetPersistentSourceE8E(asset)) }))
      .sort((a, b) => a.identity.id.localeCompare(b.identity.id));

    const before = {
      count: images.length,
      targetId: String(target.id),
      hashA: _diagSourceHashE8E(_assetPersistentSourceE8E(target)),
      targetIdentity: identity(target),
      others: snapshotOthers(),
      frames: JSON.stringify(frames),
      curves: JSON.stringify({ ctrlPts, curvesV2 }),
      world: JSON.stringify(projectWorld)
    };

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(16, 16, 608, 448);
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(160, 120, 320, 240);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'e8s-source-b.png', { type: 'image/png' });

    selectAssetById(target.id, 'webkit-e8s-real');
    replaceCommittedAtomically = false;
    replaceImageAssetInPlace(target, file, 'webkit-e8s-real');
    await new Promise((resolve, reject) => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (replaceCommittedAtomically) {
          clearInterval(timer);
          resolve();
        } else if (Date.now() - started > 20_000) {
          clearInterval(timer);
          reject(new Error('replace E8S timeout'));
        }
      }, 25);
    });

    const currentTarget = assets.find((asset) => String(asset.id) === before.targetId);
    const hashB = _diagSourceHashE8E(_assetPersistentSourceE8E(currentTarget));
    const canonicalFieldsAgree = currentTarget.src === currentTarget.persistentSrc &&
      currentTarget.src === currentTarget.sourcePayload?.dataUrl;

    undo();
    const undoTarget = assets.find((asset) => String(asset.id) === before.targetId);
    const undoHash = _diagSourceHashE8E(_assetPersistentSourceE8E(undoTarget));
    const undoJson = JSON.stringify(buildProjectData(true));
    const undoRoundTrip = JSON.parse(undoJson);
    const undoSavedHash = _diagSourceHashE8E(_assetPersistentSourceE8E(
      undoRoundTrip.assets.find((asset) => String(asset.id) === before.targetId)
    ));

    redo();
    const redoTarget = assets.find((asset) => String(asset.id) === before.targetId);
    const redoHash = _diagSourceHashE8E(_assetPersistentSourceE8E(redoTarget));

    const manualJson = JSON.stringify(buildProjectData(true));
    const manualRoundTrip = JSON.parse(manualJson);
    const savedTarget = manualRoundTrip.assets.find((asset) => String(asset.id) === before.targetId);
    const manualSaveHash = _diagSourceHashE8E(_assetPersistentSourceE8E(savedTarget));

    return {
      before,
      hashB,
      canonicalFieldsAgree,
      undoHash,
      undoSavedHash,
      redoHash,
      manualSaveHash,
      manualJson,
      targetIdentityAfter: identity(redoTarget),
      othersAfter: snapshotOthers(),
      framesAfter: JSON.stringify(frames),
      curvesAfter: JSON.stringify({ ctrlPts, curvesV2 }),
      worldAfter: JSON.stringify(projectWorld)
    };
  });

  expect(replaced.before.count).toBeGreaterThanOrEqual(3);
  expect(replaced.hashB).not.toBe(replaced.before.hashA);
  expect(replaced.canonicalFieldsAgree).toBe(true);
  expect(replaced.undoHash).toBe(replaced.before.hashA);
  expect(replaced.undoSavedHash).toBe(replaced.before.hashA);
  expect(replaced.redoHash).toBe(replaced.hashB);
  expect(replaced.manualSaveHash).toBe(replaced.hashB);
  expect(replaced.targetIdentityAfter).toEqual(replaced.before.targetIdentity);
  expect(replaced.othersAfter).toEqual(replaced.before.others);
  expect(replaced.framesAfter).toBe(replaced.before.frames);
  expect(replaced.curvesAfter).toBe(replaced.before.curves);
  expect(replaced.worldAfter).toBe(replaced.before.world);

  const manualLoad = await page.evaluate(async ({ manualJson, targetId }) => {
    const data = JSON.parse(manualJson);
    const applied = await new Promise((resolve) => applyProjectData(data, { origin: 'manual-load', onApplied: resolve }));
    await new Promise((resolve) => setTimeout(resolve, 150));
    const target = assets.find((asset) => String(asset.id) === targetId);
    return {
      applied,
      hash: _diagSourceHashE8E(_assetPersistentSourceE8E(target)),
      count: assets.filter((asset) => asset && asset.type === 'image').length
    };
  }, { manualJson: replaced.manualJson, targetId: replaced.before.targetId });

  expect(manualLoad.applied).toBe(true);
  expect(manualLoad.hash).toBe(replaced.hashB);
  expect(manualLoad.count).toBe(replaced.before.count);

  const session = await page.evaluate(async ({ targetId }) => {
    clearTimeout(_sessionAutosaveTimer);
    const revision = ++_sessionAutosaveQueuedRevision;
    const written = await writeSessionAutosave(revision, _sessionAutosaveEpoch, true, 'webkit-e8s-real');
    const checkpoint = await readSessionCheckpoint();
    if (!checkpoint?.payload) throw new Error('checkpoint E8S ausente após escrita real');
    const persisted = JSON.parse(checkpoint.payload);
    const persistedTarget = persisted.assets.find((asset) => String(asset.id) === targetId);
    const checkpointHash = _diagSourceHashE8E(_assetPersistentSourceE8E(persistedTarget));
    const restored = await restoreLastSessionAutosave(checkpoint);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const restoredTarget = assets.find((asset) => String(asset.id) === targetId);
    return {
      written,
      restored,
      checkpointHash,
      restoredHash: _diagSourceHashE8E(_assetPersistentSourceE8E(restoredTarget)),
      count: assets.filter((asset) => asset && asset.type === 'image').length
    };
  }, { targetId: replaced.before.targetId });

  expect(session.written).toBe(true);
  expect(session.checkpointHash).toBe(replaced.hashB);
  expect(session.restored).toBe(true);
  expect(session.restoredHash).toBe(replaced.hashB);
  expect(session.count).toBe(replaced.before.count);
});
