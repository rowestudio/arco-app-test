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

async function sampleContextSheetToViewportBottom(page) {
  return page.evaluate(() => {
    const slot = document.getElementById('lowerContextSlot');
    const shell = document.getElementById('lowerContextSheetShell');
    const rect = shell.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const controls = [...slot.querySelectorAll('.context-control-actions')].find((element) => element.getClientRects().length > 0);
    const controlsRect = controls?.getBoundingClientRect();
    const shellStyle = getComputedStyle(shell);
    const timelineStyle = getComputedStyle(document.getElementById('midBar'));
    const bodyStyle = getComputedStyle(document.body);
    const panel = document.body.classList.contains('asset-context-panel-open')
      ? document.getElementById('assetContextPanel')
      : document.getElementById('custBar');
    const panelRect = panel.getBoundingClientRect();
    const parentChain = [];
    for (let ancestor = shell; ancestor; ancestor = ancestor.parentElement) {
      const ancestorRect = ancestor.getBoundingClientRect();
      parentChain.push({
        selector: ancestor.id ? `#${ancestor.id}` : ancestor === document.body ? 'body' : ancestor === document.documentElement ? 'html' : ancestor.tagName.toLowerCase(),
        top: ancestorRect.top, bottom: ancestorRect.bottom, height: ancestorRect.height,
        left: ancestorRect.left, right: ancestorRect.right, width: ancestorRect.width,
      });
    }
    const x = Math.round(rect.left + rect.width / 2);
    const resolveBackground = (element) => {
      let current = element;
      while (current) {
        const color = getComputedStyle(current).backgroundColor;
        if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') return color;
        current = current.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    };
    const points = [
      ['sheet-top', x, Math.ceil(rect.top + 2)],
      ['controls', Math.floor(rect.right - 2), Math.round((controlsRect?.top || rect.top) + (controlsRect?.height || 0) / 2)],
      ['below-controls', x, Math.min(window.innerHeight - 2, Math.ceil((controlsRect?.bottom || rect.top) + 1))],
      ['lower-middle', x, Math.round(rect.top + rect.height * 0.7)],
      ['safe-area', x, window.innerHeight - 8],
      ['viewport-edge', x, window.innerHeight - 2],
    ];
    return {
      rect: { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width },
      viewportBottom: window.innerHeight,
      shellSelector: '#lowerContextSheetShell',
      shellBackground: shellStyle.backgroundColor,
      slotRect: { left: slotRect.left, right: slotRect.right, width: slotRect.width },
      panelRect: { left: panelRect.left, right: panelRect.right, width: panelRect.width },
      parentChain,
      bodyBackground: bodyStyle.backgroundColor,
      timelineBackground: timelineStyle.backgroundColor,
      samples: points.map(([point, sampleX, y]) => {
        const element = document.elementFromPoint(sampleX, y);
        return { point, x: sampleX, y, id: element?.id || '', className: String(element?.className || ''), color: resolveBackground(element) };
      }),
    };
  });
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

async function prepareE8WSessionFixture(page) {
  return page.evaluate(async () => {
    const baseAsset = assets.find(asset => asset && asset.type === 'image');
    if (!baseAsset) throw new Error('fixture E8W sem image asset base');
    const source = _assetPersistentSourceE8E(baseAsset) || imageOriginalDataUrl || imgEl?.src || '';
    if (!isValidImageBase64(source)) throw new Error('fixture E8W sem fonte persistente válida');

    const slots = ['middle-left', 'middle-right'];
    let slotIndex = 0;
    while (assets.filter(asset => asset && asset.type === 'image').length < 3) {
      const file = dataUrlToFile(source, `e8w-asset-${slotIndex + 2}`);
      pendingImageAction = 'insertImage';
      pendingImageTargetAssetId = null;
      performInsertImageAtSlot(slots[slotIndex], file);
      slotIndex++;
      await new Promise((resolve, reject) => {
        const started = Date.now();
        const expectedCount = slotIndex + 1;
        const timer = setInterval(() => {
          if (assets.filter(asset => asset && asset.type === 'image').length >= expectedCount) {
            clearInterval(timer); resolve();
          } else if (Date.now() - started > 20_000) {
            clearInterval(timer); reject(new Error(`timeout ao inserir image asset E8W ${expectedCount}`));
          }
        }, 25);
      });
    }

    while (frameCount < 3) {
      const previous = frames[frameCount - 1] || { x:0, y:0, w:projectWorld.baseStageW * 0.5, h:projectWorld.baseStageH * 0.5 };
      frames.push({ ...previous, x:previous.x + 37 * frameCount, y:previous.y + 23 * frameCount });
      frameRotations.push((frameRotations[frameCount - 1] || 0) + 5);
      frameLocked.push(false);
      frameCount++;
      createFrameDOM(frameCount - 1);
    }
    ensureSegmentArraysIntegrity();
    ensureFramePauses();

    const imageAssets = assets.filter(asset => asset && asset.type === 'image');
    await Promise.all(imageAssets.map((asset, index) => {
      const assetSource = index === 0 ? (asset.src || source) : _assetPersistentSourceE8E(asset);
      return hydrateSessionImage(assetSource);
    }));
    invalidateProjectWorldComposite();
    renderProjectWorldExtraImages();
    renderAll();
    return { frameCount, imageAssetsCount:imageAssets.length, hydratedImageAssetsCount:imageAssets.length };
  });
}

function expectCloseGeometry(actual, expected, { frameIndex, label, tolerance = 0.001 }) {
  let maxDelta = 0;
  for (const field of ['x', 'y', 'w', 'h', 'rotation']) {
    const delta = Math.abs(actual[field] - expected[field]);
    maxDelta = Math.max(maxDelta, delta);
    expect(
      delta,
      `Frame ${frameIndex} ${label}.${field}: expected=${expected[field]}, actual=${actual[field]}, delta=${delta}, tolerance<${tolerance}`
    ).toBeLessThan(tolerance);
  }
  return maxDelta;
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

test('E8X cobre TC-038 por criação, transformação, persistência e renderer reais', async ({ page }) => {
  test.setTimeout(240_000);
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await page.evaluate(() => setEditorMode('assets', 'webkit-e8x'));

  const baseline = await page.evaluate(() => ({
    projectWorld: structuredClone(projectWorld),
    frames: structuredClone(frames.slice(0, frameCount)),
    assets: assets.map(a => ({ id:a.id, type:a.type, worldX:a.worldX, worldY:a.worldY, worldW:a.worldW, worldH:a.worldH, rotation:a.rotation, zIndex:a.zIndex })),
  }));

  // Cancelar exercita o fluxo real e não pode deixar asset, Layer, Undo ou mutação canônica.
  await page.evaluate(() => startTextCreation());
  await expect(page.locator('#textCreationSheet')).toHaveClass(/open/);
  await page.locator('#textCreationInput').fill('Este draft deve ser descartado');
  await page.setViewportSize({ width:390, height:620 });
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.setViewportSize({ width:390, height:844 });
  await page.getByRole('button', { name:'Cancelar', exact:true }).click();
  const cancelled = await page.evaluate(() => ({
    projectWorld:structuredClone(projectWorld), frames:structuredClone(frames.slice(0,frameCount)),
    assets:assets.map(a=>({id:a.id,type:a.type,worldX:a.worldX,worldY:a.worldY,worldW:a.worldW,worldH:a.worldH,rotation:a.rotation,zIndex:a.zIndex})),
    textCount:assets.filter(a=>a&&a.type==='text').length, pending:pendingTextDraft,
  }));
  expect(cancelled).toMatchObject({ projectWorld:baseline.projectWorld, frames:baseline.frames, assets:baseline.assets, textCount:0, pending:null });

  // OK cria exatamente um asset; texto longo força wrap sem Enter e a cor vem do controle real.
  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill('Arco Motion texto longo para comprovar quebra automática dentro do quadro canônico');
  await page.locator('#textCreationColor').evaluate((el) => { el.value='#ff3366'; el.dispatchEvent(new Event('input',{bubbles:true})); });
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.getByRole('button', { name:'OK', exact:true }).click();
  const confirmed = await page.evaluate(() => {
    const text=assets.find(a=>a&&a.type==='text'), data=buildProjectData(true);
    const canvas=document.createElement('canvas'), ctx=canvas.getContext('2d'); ctx.font=`${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
    return { count:assets.filter(a=>a&&a.type==='text').length, text:{...text}, saved:data.assets.find(a=>a&&a.type==='text'), lines:wrapTextLines(ctx,text.text,text.boxWidth),
      selected:selectedAssetId, outline:document.getElementById('assetSelectOutline')?.dataset.assetId||'',
      resize:[textCreationKeyboardResizeChangedProjectWorld,textCreationKeyboardResizeChangedFrames,textCreationKeyboardResizeChangedExistingAssets] };
  });
  expect(confirmed.count).toBe(1); expect(confirmed.text.text).toContain('Arco Motion'); expect(confirmed.text.color).toBe('#ff3366'); expect(confirmed.lines.length).toBeGreaterThan(1);
  expect(confirmed.text.boxWidth).toBeGreaterThan(100); expect(confirmed.saved).toMatchObject({type:'text',text:confirmed.text.text,color:'#ff3366'});
  expect(confirmed.selected).toBe(confirmed.text.id); expect(confirmed.outline).toBe(confirmed.text.id); expect(confirmed.resize).toEqual([false,false,false]);

  // Seleção/hit-test e movimento usam os handlers reais do Stage.
  const moved = await page.evaluate(() => {
    const text=assets.find(a=>a&&a.type==='text'), before={x:text.worldX,y:text.worldY,w:text.worldW,h:text.worldH};
    const center=editorWorldToStage(text.worldX+text.worldW/2,text.worldY+text.worldH/2,0,0), rect=stageContent.getBoundingClientRect();
    const event=(x,y)=>({clientX:rect.left+center.x*editorZoomScale+x,clientY:rect.top+center.y*editorZoomScale+y,pointerId:81,pointerType:'touch',isPrimary:true,target:stageContent,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}});
    const firstFrame=frames[0], target=editorWorldToStage(firstFrame.x+firstFrame.w/2,firstFrame.y+firstFrame.h/2,0,0);
    let dx=(target.x-center.x)*editorZoomScale, dy=(target.y-center.y)*editorZoomScale;
    if (Math.abs(dx)<18) dx+=dx<0?-18:18;
    if (Math.abs(dy)<18) dy+=dy<0?-18:18;
    handleStageAssetSelectPointer(event(0,0)); handleStageAssetMovePointer(event(dx,dy)); endStageAssetMovePointer(event(dx,dy));
    return {id:text.id,selected:selectedAssetId,before,after:{x:text.worldX,y:text.worldY,w:text.worldW,h:text.worldH},hit:hitTestAssetAtWorld(text.worldX+text.worldW/2,text.worldY+text.worldH/2)?.id};
  });
  expect(moved.selected).toBe(moved.id); expect(moved.hit).toBe(moved.id); expect(moved.after.x).not.toBeCloseTo(moved.before.x); expect(moved.after.y).not.toBeCloseTo(moved.before.y);
  expect(moved.after.w).toBeCloseTo(moved.before.w); expect(moved.after.h).toBeCloseTo(moved.before.h);

  // Escala e rotação percorrem a infraestrutura real das quatro alças.
  const transformed = await page.evaluate(() => {
    const text=assets.find(a=>a&&a.type==='text'), fakeTarget={setPointerCapture(){},releasePointerCapture(){}};
    const point=(angle,radius,id)=>{ computeEditorTransform(); const c=editorWorldToStage(text.worldX+text.worldW/2,text.worldY+text.worldH/2,0,0), sr=stageContent.getBoundingClientRect(); return {clientX:sr.left+c.x*editorZoomScale+Math.cos(angle)*radius,clientY:sr.top+c.y*editorZoomScale+Math.sin(angle)*radius,pointerId:id,currentTarget:fakeTarget,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}}; };
    const before={w:text.worldW,h:text.worldH,fontSize:text.fontSize,rotation:text.rotation};
    beginAssetTransformDrag(point(0,80,82),'br'); handleAssetTransformPointerMove(point(0,135,82)); endAssetTransformPointer(point(0,135,82),false);
    const scaled={w:text.worldW,h:text.worldH,fontSize:text.fontSize};
    beginAssetTransformDrag(point(0,100,83),'br'); handleAssetTransformPointerMove(point(Math.PI/3,100,83)); endAssetTransformPointer(point(Math.PI/3,100,83),false);
    return {before,scaled,after:{w:text.worldW,h:text.worldH,fontSize:text.fontSize,rotation:text.rotation}};
  });
  expect(transformed.scaled.w).toBeGreaterThan(transformed.before.w); expect(transformed.scaled.fontSize).toBeGreaterThan(transformed.before.fontSize); expect(transformed.after.rotation).not.toBe(transformed.before.rotation);

  // Layers executa reorder real texto↔imagem e prova ordem no modelo e no DOM.
  const reordered = await page.evaluate(() => {
    const text=assets.find(a=>a&&a.type==='text'), before=text.zIndex; layerMoveAssetDown(text.id); renderLayersPanelList();
    const order=assets.slice().sort((a,b)=>(a.zIndex||0)-(b.zIndex||0)).map(a=>String(a.id));
    const dom=[...document.querySelectorAll('#layersList .layers-item')].map(el=>el.dataset.assetId);
    return {id:String(text.id),before,after:text.zIndex,order,dom,imageIds:assets.filter(a=>a&&a.type==='image').map(a=>String(a.id))};
  });
  expect(reordered.after).not.toBe(reordered.before); expect(reordered.order).toContain(reordered.id); expect(reordered.imageIds.some(id=>reordered.order.indexOf(id)>reordered.order.indexOf(reordered.id))).toBe(true);
  expect(reordered.dom).toEqual([...reordered.order].reverse());

  // Save/Load real pelos fluxos públicos canônicos: download completo e file input.
  const beforeRoundTrip = await page.evaluate(() => {
    const text=assets.find(a=>a&&a.type==='text');
    const projectAsset = a => ({id:String(a.id),type:a.type,layerSequence:a.layerSequence,layerName:a.layerName,
      worldX:a.worldX,worldY:a.worldY,worldW:a.worldW,worldH:a.worldH,rotation:Number(a.rotation)||0,
      zIndex:Number(a.zIndex)||0,visible:a.visible!==false,boxWidth:a.type==='text'?a.boxWidth:null,
      text:a.type==='text'?a.text:null,color:a.type==='text'?a.color:null,fontSize:a.type==='text'?a.fontSize:null});
    return {text:serializeProjectAsset(text,0,false),assets:assets.map(projectAsset),frames:structuredClone(frames.slice(0,frameCount)),projectWorld:structuredClone(projectWorld)};
  });
  const downloadPromise = page.waitForEvent('download');
  await page.evaluate(() => doSaveDirect(true,'e8x-text-round-trip'));
  const savedProjectDownload = await downloadPromise;
  const savedProjectPath = await savedProjectDownload.path();
  expect(savedProjectPath, 'Save completo não produziu arquivo para o Manual Load').toBeTruthy();
  await page.locator('#projectFileInput').setInputFiles(savedProjectPath);
  await expect.poll(() => page.evaluate(() => loadSessionCompleted), {timeout:30_000}).toBe(true);
  const afterLoad = await page.evaluate((id) => {
    const text=assets.find(a=>String(a.id)===id);
    const projectAsset = a => ({id:String(a.id),type:a.type,layerSequence:a.layerSequence,layerName:a.layerName,
      worldX:a.worldX,worldY:a.worldY,worldW:a.worldW,worldH:a.worldH,rotation:Number(a.rotation)||0,
      zIndex:Number(a.zIndex)||0,visible:a.visible!==false,boxWidth:a.type==='text'?a.boxWidth:null,
      text:a.type==='text'?a.text:null,color:a.type==='text'?a.color:null,fontSize:a.type==='text'?a.fontSize:null});
    return {text:text?serializeProjectAsset(text,0,false):null,count:assets.filter(a=>a&&a.type==='text').length,
      assets:assets.map(projectAsset),frames:structuredClone(frames.slice(0,frameCount)),projectWorld:structuredClone(projectWorld),lastLoadError};
  }, String(confirmed.text.id));
  expect(afterLoad.lastLoadError).toBe(''); expect(afterLoad.count).toBe(1); expect(afterLoad.text).toEqual(beforeRoundTrip.text);
  expect(afterLoad.assets).toEqual(beforeRoundTrip.assets); expect(afterLoad.frames).toEqual(beforeRoundTrip.frames); expect(afterLoad.projectWorld).toEqual(beforeRoundTrip.projectWorld);

  // Checkpoint real em IndexedDB + reload + escolha real de Continuar sessão.
  await page.evaluate(async () => {
    scheduleSessionAutosave('e8x-smoke',true);
    flushSessionAutosave();
    while (_sessionAutosaveActiveWrites.size) await Promise.all([..._sessionAutosaveActiveWrites]);
  });
  await expect.poll(() => sessionCheckpointExists(page), {timeout:30_000}).toBe(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.getByRole('dialog',{name:'Continuar sessão anterior?'})).toBeVisible();
  await page.getByText('Continuar de onde parei',{exact:true}).click();
  await expect(page.locator('body')).toHaveClass(/mode-editor/,{timeout:30_000});
  const afterSession = await page.evaluate((id) => { const text=assets.find(a=>String(a.id)===id); return text?serializeProjectAsset(text,0,false):null; }, String(confirmed.text.id));
  expect(afterSession).toEqual(beforeRoundTrip.text);

  // Preview real: snapshot contém o mesmo texto e pixels na caixa canônica apresentam a cor escolhida.
  await page.evaluate(() => startPreview());
  await expect(page.locator('#previewScreen')).toHaveClass(/show/,{timeout:30_000});
  await expect.poll(() => page.evaluate(() => previewLoadingHiddenAfterFirstFrame),{timeout:30_000}).toBe(true);
  const previewProof = await page.evaluate((id) => {
    if (animFrame) togglePreviewPlayback();
    const text=assets.find(a=>String(a.id)===id), canvas=document.getElementById('previewDisplayCanvas'), ctx=canvas.getContext('2d');
    const durationSec=getComputedTimelineDuration(), totalPF=Math.max(1,Math.round(durationSec*25)), previewSource=getPreviewRenderSource();
    renderFrameSafely(ctx,canvas,0,canvas.width,canvas.height,totalPF,0,{renderSource:previewSource});
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let colored=0; for(let i=0;i<pixels.length;i+=4) if(pixels[i]>pixels[i+1]*1.35&&pixels[i]>pixels[i+2]*1.15&&pixels[i+3]>100) colored++;
    const textRenderAudit=renderTransform.preview?.assets?.find(a=>String(a.id)===id)||null;
    const originalSnapshot=renderSessionSnapshot, noText=document.createElement('canvas'); noText.width=canvas.width; noText.height=canvas.height;
    renderSessionSnapshot={...originalSnapshot,textAssets:[]};
    renderFrameSafely(noText.getContext('2d'),noText,0,noText.width,noText.height,totalPF,0,{renderSource:previewSource});
    renderSessionSnapshot=originalSnapshot;
    const base=noText.getContext('2d').getImageData(0,0,noText.width,noText.height).data; let changed=0;
    for(let i=0;i<pixels.length;i+=4) if(Math.abs(pixels[i]-base[i])+Math.abs(pixels[i+1]-base[i+1])+Math.abs(pixels[i+2]-base[i+2])+Math.abs(pixels[i+3]-base[i+3])>20) changed++;
    return {snapshot:originalSnapshot?.textAssets?.find(a=>String(a.id)===id)||null,textRenderAudit,colored,changed,canvas:[canvas.width,canvas.height]};
  }, String(confirmed.text.id));
  expect(previewProof.snapshot).toMatchObject({id:confirmed.text.id,text:beforeRoundTrip.text.text,color:'#ff3366',zIndex:beforeRoundTrip.text.zIndex});
  expect(previewProof.textRenderAudit).toMatchObject({id:confirmed.text.id,drawn:true,intersectsCamera:true});
  expect(previewProof.textRenderAudit.screenW).toBeGreaterThan(0); expect(previewProof.textRenderAudit.screenH).toBeGreaterThan(0);
  expect(previewProof.canvas[0]).toBeGreaterThan(0); expect(previewProof.colored).toBeGreaterThan(0); expect(previewProof.changed).toBeGreaterThan(0);
  await page.evaluate(() => stopPreview());

  // Export real (timeline curta para o smoke) deve gerar blob e congelar o mesmo text asset no snapshot.
  await page.evaluate(() => { loopEnabled=false; for(let i=0;i<segDurations.length;i++) segDurations[i]=0.1; startRecord(); });
  await expect.poll(() => page.evaluate(() => exportGenerationCompleted || arcoExportDiag.exportSuccess===true),{timeout:120_000}).toBe(true);
  const exportProof = await page.evaluate((id) => ({blob:exportFinalBlobBytes,snapshot:renderSessionSnapshot?.textAssets?.find(a=>String(a.id)===id)||null,success:arcoExportDiag.exportSuccess}), String(confirmed.text.id));
  expect(exportProof.success).toBe(true); expect(exportProof.blob).toBeGreaterThan(0); expect(exportProof.snapshot).toMatchObject({text:beforeRoundTrip.text.text,color:'#ff3366',zIndex:beforeRoundTrip.text.zIndex});
});

test('replace preserva a fonte canônica em Save/Load, Session Restore e Undo/Redo', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });

  const syntheticSetup = await page.evaluate(() => {
    const base = assets.find((asset) => asset && asset.type === 'image');
    if (!base) throw new Error('fixture não forneceu image asset base para o cenário E8S');
    const source = _assetPersistentSourceE8E(base) || imageOriginalDataUrl || (imgEl && imgEl.src) || '';
    if (!source) throw new Error('asset base sem fonte persistente para o cenário E8S');
    const makeAsset = (id, layerSequence, zIndex, offsetX) => ({
      ...base,
      id,
      name: id,
      layerSequence,
      layerName: `Camada ${layerSequence}`,
      zIndex,
      worldX: (Number(base.worldX) || 0) + offsetX,
      src: source,
      persistentSrc: source,
      sourcePayload: { kind: 'dataUrl', dataUrl: source, bytes: source.length },
      _img: base._img,
      drawSource: base.drawSource,
      stableDrawable: base.stableDrawable
    });
    const baseControl = makeAsset('img-1', 901, 1, 0);
    const target = makeAsset('e8s-target-b', 902, 2, 48);
    const control = makeAsset('e8s-control-c', 903, 3, 96);
    assets.splice(0, assets.length, baseControl, target, control);
    invalidateProjectWorldComposite();
    renderAll();
    return {
      ok: true,
      ids: assets.filter((asset) => asset && asset.type === 'image').map((asset) => asset.id),
      targetReady: !!assets.find((asset) => asset && asset.id === 'e8s-target-b')
    };
  });
  expect(syntheticSetup.ok).toBe(true);
  expect(syntheticSetup.ids).toEqual(['img-1', 'e8s-target-b', 'e8s-control-c']);
  expect(syntheticSetup.targetReady).toBe(true);

  const replaced = await page.evaluate(async () => {
    const images = assets.filter(a => a && a.type === 'image');
    const target = assets.find(a => a && a.id === 'e8s-target-b');
    if (!target) throw new Error('asset alvo E8S não encontrado por id');
    const identity = ({ id, layerSequence, layerName, zIndex, slotRow, slotCol, visible }) =>
      ({ id, layerSequence, layerName, zIndex, slotRow, slotCol, visible });
    const before = {
      count: images.length,
      sourceHash: _diagSourceHashE8E(_assetPersistentSourceE8E(target)),
      identity: identity(target),
      otherHashes: images.filter(a => a !== target).map(a => [a.id, _diagSourceHashE8E(_assetPersistentSourceE8E(a))]),
      frames: JSON.stringify(frames), curves: JSON.stringify({ ctrlPts, curvesV2 }), world: JSON.stringify(projectWorld)
    };
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 640, 480);
    ctx.fillStyle = '#d32f2f'; ctx.fillRect(32, 24, 576, 432);
    ctx.fillStyle = '#1565c0'; ctx.fillRect(160, 120, 320, 240);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'source-b-alpha.png', { type: 'image/png' });
    selectAssetById(target.id, 'webkit-e8s');
    replaceCommittedAtomically = false;
    replaceImageAssetInPlace(target, file, 'webkit-e8s');
    await new Promise((resolve, reject) => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (replaceCommittedAtomically) { clearInterval(timer); resolve(); }
        else if (Date.now() - started > 20_000) { clearInterval(timer); reject(new Error('replace timeout')); }
      }, 25);
    });
    const afterHash = _diagSourceHashE8E(_assetPersistentSourceE8E(target));
    const after = {
      sourceHash: afterHash,
      identity: identity(target),
      canonicalFieldsAgree: target.src === target.persistentSrc && target.src === target.sourcePayload.dataUrl,
      alpha: target.hasAlpha,
      otherHashes: assets.filter(a => a !== target && a.type === 'image').map(a => [a.id, _diagSourceHashE8E(_assetPersistentSourceE8E(a))]),
      frames: JSON.stringify(frames), curves: JSON.stringify({ ctrlPts, curvesV2 }), world: JSON.stringify(projectWorld)
    };
    undo();
    const undoAsset = assets.find(a => a.id === target.id);
    const undoHash = _diagSourceHashE8E(_assetPersistentSourceE8E(undoAsset));
    const undoProject = JSON.parse(JSON.stringify(buildProjectData(true)));
    const undoSavedHash = _diagSourceHashE8E(_assetPersistentSourceE8E(undoProject.assets.find(a => a.id === target.id)));
    redo();
    const redoAsset = assets.find(a => a.id === target.id);
    const redoHash = _diagSourceHashE8E(_assetPersistentSourceE8E(redoAsset));
    const manual = buildProjectData(true);
    const manualJson = JSON.stringify(manual);
    const manualRoundTrip = JSON.parse(manualJson);
    _recordReplacedSourceBoundaryE8S('manual-save', manualRoundTrip.assets);
    const savedTarget = manualRoundTrip.assets.find(a => a.id === target.id);
    after.savedHash = _diagSourceHashE8E(_assetPersistentSourceE8E(savedTarget));
    return { before, after, undoHash, undoSavedHash, redoHash, manualJson };
  });

  expect(replaced.before.count).toBe(3);
  expect(replaced.before.sourceHash).not.toBe(replaced.after.sourceHash);
  expect(replaced.after.canonicalFieldsAgree).toBe(true);
  expect(replaced.after.savedHash).toBe(replaced.after.sourceHash);
  expect(replaced.undoHash).toBe(replaced.before.sourceHash);
  expect(replaced.undoSavedHash).toBe(replaced.before.sourceHash);
  expect(replaced.redoHash).toBe(replaced.after.sourceHash);
  expect(replaced.after.identity).toEqual(replaced.before.identity);
  expect(replaced.after.otherHashes).toEqual(replaced.before.otherHashes);
  expect(replaced.after.frames).toBe(replaced.before.frames);
  expect(replaced.after.curves).toBe(replaced.before.curves);
  expect(replaced.after.world).toBe(replaced.before.world);
  expect(replaced.after.alpha).toBe(true);

  await page.locator('#projectFileInput').setInputFiles({
    name: 'e8s-manual-roundtrip.json',
    mimeType: 'application/json',
    buffer: Buffer.from(replaced.manualJson, 'utf8')
  });
  await expect.poll(() => page.evaluate(() => {
    const asset = assets.find(a => a && a.id === 'e8s-target-b');
    return asset ? _diagSourceHashE8E(_assetPersistentSourceE8E(asset)) : '';
  }), { timeout: 30_000 }).toBe(replaced.after.sourceHash);
  const manualLoad = await page.evaluate(() => {
    const asset = assets.find(a => a && a.id === 'e8s-target-b');
    return {
      hash: asset ? _diagSourceHashE8E(_assetPersistentSourceE8E(asset)) : '',
      count: assets.filter(a => a && a.type === 'image').length
    };
  });
  expect(manualLoad.hash).toBe(replaced.after.sourceHash);
  expect(manualLoad.count).toBe(replaced.before.count);

  const session = await page.evaluate(async () => {
    clearTimeout(_sessionAutosaveTimer);
    const revision = ++_sessionAutosaveQueuedRevision;
    const written = await writeSessionAutosave(revision, _sessionAutosaveEpoch, true, 'webkit-e8s');
    const checkpoint = await readSessionCheckpoint();
    const saved = JSON.parse(checkpoint.payload);
    const savedAsset = saved.assets.find(a => a.id === replacedSourceDiagnosticAssetId);
    const checkpointHash = _diagSourceHashE8E(_assetPersistentSourceE8E(savedAsset));
    const restored = await restoreLastSessionAutosave(checkpoint);
    await new Promise(resolve => setTimeout(resolve, 150));
    const asset = assets.find(a => a.id === replacedSourceDiagnosticAssetId);
    return {
      written,
      restored,
      checkpointHash,
      restoredHash: _diagSourceHashE8E(_assetPersistentSourceE8E(asset)),
      restoreDiagnosticHash: sessionRestoreRestoredSourceHash,
      restoreDiagnosticMatches: sessionRestoreRestoresReplacedSource
    };
  });
  expect(session.written).toBe(true);
  expect(session.restored).toBe(true);
  expect(session.checkpointHash).toBe(replaced.after.sourceHash);
  expect(session.restoredHash).toBe(replaced.after.sourceHash);
  expect(session.restoreDiagnosticHash).toBe(replaced.after.sourceHash);
  expect(session.restoreDiagnosticMatches).toBe(true);
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

test('E8U compacta controles e mantém paridade e superfície contextual contínua', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });

  const measureControls = (page, stepSelector, resetSelector) => page.evaluate(({ stepSelector, resetSelector }) => {
    const step = document.querySelector(stepSelector);
    const reset = document.querySelector(resetSelector);
    const row = step?.parentElement;
    const sliderRow = row?.previousElementSibling;
    const slider = sliderRow?.querySelector('input[type="range"]');
    const stack = row?.parentElement;
    if (!step || !reset || !row || !slider || !sliderRow || !stack) throw new Error('controles contextuais não encontrados');
    const stepRect = step.getBoundingClientRect();
    const resetRect = reset.getBoundingClientRect();
    const sliderRect = slider.getBoundingClientRect();
    const sliderRowRect = sliderRow.getBoundingClientRect();
    const controlsRowRect = row.getBoundingClientRect();
    const stackRect = stack.getBoundingClientRect();
    const stepStyle = getComputedStyle(step);
    const resetStyle = getComputedStyle(reset);
    const measuredStyle = (element) => {
      const style = getComputedStyle(element);
      return {
        display: style.display, flexDirection: style.flexDirection,
        justifyContent: style.justifyContent, alignItems: style.alignItems,
        gap: style.gap, rowGap: style.rowGap, columnGap: style.columnGap,
        height: style.height,
        minHeight: style.minHeight, paddingBlock: `${style.paddingTop} ${style.paddingBottom}`,
        paddingTop: style.paddingTop, paddingBottom: style.paddingBottom,
        marginBlock: `${style.marginTop} ${style.marginBottom}`,
        marginTop: style.marginTop, marginBottom: style.marginBottom,
        borderTopWidth: style.borderTopWidth, borderBottomWidth: style.borderBottomWidth,
        lineHeight: style.lineHeight, boxSizing: style.boxSizing,
        flex: style.flex, flexGrow: style.flexGrow,
        verticalAlign: style.verticalAlign, alignSelf: style.alignSelf,
        appearance: style.appearance, webkitAppearance: style.webkitAppearance,
        position: style.position, top: style.top, transform: style.transform,
      };
    };
    return {
      step: {
        width: stepRect.width, height: stepRect.height, top: stepRect.top,
        computedHeight: stepStyle.height, minHeight: stepStyle.minHeight, maxHeight: stepStyle.maxHeight,
        minWidth: stepStyle.minWidth, paddingInline: `${stepStyle.paddingLeft} ${stepStyle.paddingRight}`,
        paddingBlock: `${stepStyle.paddingTop} ${stepStyle.paddingBottom}`,
        fontSize: stepStyle.fontSize, fontWeight: stepStyle.fontWeight,
        lineHeight: stepStyle.lineHeight, borderRadius: stepStyle.borderRadius,
        borderBlock: `${stepStyle.borderTopWidth} ${stepStyle.borderBottomWidth}`,
        boxSizing: stepStyle.boxSizing, appearance: stepStyle.appearance,
        webkitAppearance: stepStyle.webkitAppearance, display: stepStyle.display,
        alignItems: stepStyle.alignItems, backgroundColor: stepStyle.backgroundColor,
        marginBlock: `${stepStyle.marginTop} ${stepStyle.marginBottom}`,
      },
      reset: { width: resetRect.width, height: resetRect.height, top: resetRect.top,
        minHeight: resetStyle.minHeight,
        paddingInline: `${resetStyle.paddingLeft} ${resetStyle.paddingRight}`,
        paddingBlock: `${resetStyle.paddingTop} ${resetStyle.paddingBottom}`,
        fontSize: resetStyle.fontSize, borderRadius: resetStyle.borderRadius,
        boxSizing: resetStyle.boxSizing, backgroundColor: resetStyle.backgroundColor },
      gap: getComputedStyle(row).gap,
      sliderRect: {
        top: sliderRect.top, bottom: sliderRect.bottom, height: sliderRect.height,
        left: sliderRect.left, right: sliderRect.right,
        offsetTop: sliderRect.top - sliderRowRect.top,
        offsetBottom: sliderRowRect.bottom - sliderRect.bottom,
      },
      stack: { top: stackRect.top, bottom: stackRect.bottom, height: stackRect.height },
      sliderRow: { top: sliderRowRect.top, bottom: sliderRowRect.bottom, height: sliderRowRect.height },
      controlsRow: { top: controlsRowRect.top, bottom: controlsRowRect.bottom, height: controlsRowRect.height },
      sliderToControlsGap: controlsRowRect.top - sliderRect.bottom,
      rowToControlsGap: controlsRowRect.top - sliderRowRect.bottom,
      computed: { slider: measuredStyle(slider), sliderRow: measuredStyle(sliderRow), controlsRow: measuredStyle(row), stack: measuredStyle(stack) },
      relativeTop: stepRect.top - row.getBoundingClientRect().top,
      resetRelativeTop: resetRect.top - row.getBoundingClientRect().top,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, { stepSelector, resetSelector });

  await page.evaluate(() => { setEditorMode('camera', 'webkit-e8t-frame'); openCustBar(); switchCustTab('scale'); });
  const frameScale = await measureControls(page, '#custTabScale .chip:nth-child(2)', '#custTabScale .chip:last-child');
  const frameScaleTabDisplays = await page.evaluate(() => ({
    scale: getComputedStyle(document.getElementById('custTabScale')).display,
    rotation: getComputedStyle(document.getElementById('custTabRot')).display,
  }));
  const hitArea = await page.evaluate(() => {
    const slider = document.getElementById('scaleSlider');
    const pill = document.querySelector('#custTabScale .context-small-control:nth-child(2)');
    const sliderRect = slider.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const owner = (x, y) => {
      const element = document.elementFromPoint(x, y);
      return {
        id: element?.id || '',
        isSlider: element === slider || element?.closest?.('input[type="range"]') === slider,
        isPill: element === pill || element?.closest?.('.context-small-control') === pill,
      };
    };
    return {
      abovePill: owner(pillRect.left + pillRect.width / 2, pillRect.top - 1),
      sliderCenter: owner(sliderRect.left + sliderRect.width / 2, sliderRect.top + sliderRect.height / 2),
      pillCenter: owner(pillRect.left + pillRect.width / 2, pillRect.top + pillRect.height / 2),
      sliderRect: { left: sliderRect.left, right: sliderRect.right, top: sliderRect.top, bottom: sliderRect.bottom },
      pillRect: { left: pillRect.left, right: pillRect.right, top: pillRect.top, bottom: pillRect.bottom },
    };
  });
  const frameSliderBox = await page.locator('#scaleSlider').boundingBox();
  if (!frameSliderBox) throw new Error('slider de Escala de Frames sem geometria');
  const sliderValueBeforeDrag = await page.locator('#scaleSlider').inputValue();
  await page.mouse.move(frameSliderBox.x + frameSliderBox.width / 2, frameSliderBox.y + frameSliderBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(frameSliderBox.x + frameSliderBox.width * 0.7, frameSliderBox.y + frameSliderBox.height / 2, { steps: 4 });
  await page.mouse.up();
  await expect(page.locator('#scaleSlider')).not.toHaveValue(sliderValueBeforeDrag);
  await page.evaluate(() => resetScale());
  await page.locator('#custTabScale .context-small-control').first().click();
  await expect(page.locator('#scaleSlider')).toHaveValue('95');
  await page.evaluate(() => resetScale());
  const frameSurface = await page.evaluate(() => ({
    accent: getComputedStyle(document.body).getPropertyValue('--accent').trim(),
    sheet: getComputedStyle(document.getElementById('lowerContextSheetShell')).backgroundColor,
    footer: getComputedStyle(document.getElementById('midBar')).backgroundColor,
  }));
  const frameViewportSurface = await sampleContextSheetToViewportBottom(page);
  await page.evaluate(() => switchCustTab('rot'));
  const frameRotation = await measureControls(page, '#custTabRot .chip:nth-child(2)', '#custTabRot .chip:last-child');
  const frameRotationTabDisplays = await page.evaluate(() => ({
    scale: getComputedStyle(document.getElementById('custTabScale')).display,
    rotation: getComputedStyle(document.getElementById('custTabRot')).display,
  }));
  const frameRotationViewportSurface = await sampleContextSheetToViewportBottom(page);

  await page.evaluate(() => {
    closeCustBar();
    setEditorMode('assets', 'webkit-e8t-asset');
    const asset = assets.find((candidate) => candidate?.type === 'image');
    selectAssetById(asset.id, 'webkit-e8t-asset');
    openAssetContextPanel('scale');
  });
  const assetScale = await measureControls(page, '#assetContextScalePlus', '#assetContextReset');
  const assetSurface = await page.evaluate(() => ({
    accent: getComputedStyle(document.body).getPropertyValue('--accent').trim(),
    sheet: getComputedStyle(document.getElementById('lowerContextSheetShell')).backgroundColor,
    footer: getComputedStyle(document.getElementById('midBar')).backgroundColor,
  }));
  const assetViewportSurface = await sampleContextSheetToViewportBottom(page);
  await page.evaluate(() => openAssetContextPanel('rotation'));
  const assetRotation = await measureControls(page, '#assetContextRotationPlus', '#assetContextReset');
  const assetRotationViewportSurface = await sampleContextSheetToViewportBottom(page);
  await page.evaluate(() => openAssetContextPanel('depth'));
  const assetDepthViewportSurface = await sampleContextSheetToViewportBottom(page);

  const logContextMetrics = (label, metrics) => {
    console.log(`${label}:\n${JSON.stringify({
      stack: { ...metrics.stack, computed: metrics.computed.stack },
      range: { ...metrics.sliderRect, computed: metrics.computed.slider },
      sliderRow: { ...metrics.sliderRow, computed: metrics.computed.sliderRow },
      controlsRow: { ...metrics.controlsRow, computed: metrics.computed.controlsRow },
      rowToControlsGap: metrics.rowToControlsGap,
      sliderToControlsGap: metrics.sliderToControlsGap,
    }, null, 2)}`);
  };
  logContextMetrics('FRAME SCALE', frameScale);
  logContextMetrics('ASSET SCALE', assetScale);
  logContextMetrics('FRAME ROTATION', frameRotation);
  logContextMetrics('ASSET ROTATION', assetRotation);

  expect(frameScale.computed.stack.display).toBe('flex');
  expect(frameRotation.computed.stack.display).toBe('flex');
  expect(assetScale.computed.stack.display).toBe('flex');
  expect(assetRotation.computed.stack.display).toBe('flex');
  expect(frameScaleTabDisplays).toEqual({ scale: 'flex', rotation: 'none' });
  expect(frameRotationTabDisplays).toEqual({ scale: 'none', rotation: 'flex' });

  await testInfo.attach('asset-frame-control-metrics.json', {
    body: Buffer.from(JSON.stringify({ frameScale, assetScale, frameRotation, assetRotation, frameSurface, assetSurface, frameViewportSurface, frameRotationViewportSurface, assetViewportSurface, assetRotationViewportSurface, assetDepthViewportSurface, hitArea }, null, 2)),
    contentType: 'application/json',
  });

  for (const [frameMetrics, assetMetrics] of [[frameScale, assetScale], [frameRotation, assetRotation]]) {
    expect(Math.abs(frameMetrics.step.height - assetMetrics.step.height)).toBeLessThan(1);
    expect(Math.abs(frameMetrics.step.width - assetMetrics.step.width)).toBeLessThan(1);
    expect(frameMetrics.step.computedHeight).toBe(assetMetrics.step.computedHeight);
    expect(frameMetrics.step.minHeight).toBe(assetMetrics.step.minHeight);
    expect(frameMetrics.step.maxHeight).toBe(assetMetrics.step.maxHeight);
    expect(frameMetrics.step.minWidth).toBe(assetMetrics.step.minWidth);
    expect(frameMetrics.step.paddingInline).toBe(assetMetrics.step.paddingInline);
    expect(frameMetrics.step.paddingBlock).toBe(assetMetrics.step.paddingBlock);
    expect(frameMetrics.step.fontSize).toBe(assetMetrics.step.fontSize);
    expect(frameMetrics.step.fontWeight).toBe(assetMetrics.step.fontWeight);
    expect(frameMetrics.step.lineHeight).toBe(assetMetrics.step.lineHeight);
    expect(frameMetrics.step.borderBlock).toBe(assetMetrics.step.borderBlock);
    expect(frameMetrics.step.borderRadius).toBe(assetMetrics.step.borderRadius);
    expect(frameMetrics.step.boxSizing).toBe(assetMetrics.step.boxSizing);
    expect(frameMetrics.step.appearance).toBe(assetMetrics.step.appearance);
    expect(frameMetrics.step.webkitAppearance).toBe(assetMetrics.step.webkitAppearance);
    expect(frameMetrics.step.display).toBe(assetMetrics.step.display);
    expect(frameMetrics.step.alignItems).toBe(assetMetrics.step.alignItems);
    expect(frameMetrics.step.marginBlock).toBe(assetMetrics.step.marginBlock);
    expect(frameMetrics.gap).toBe(assetMetrics.gap);
    expect(Math.abs(frameMetrics.sliderRect.height - assetMetrics.sliderRect.height)).toBeLessThan(1);
    expect(frameMetrics.computed.slider.height).toBe(assetMetrics.computed.slider.height);
    expect(frameMetrics.computed.slider.height).toBe('4px');
    expect(Math.abs(frameMetrics.sliderRow.height - assetMetrics.sliderRow.height)).toBeLessThan(1);
    expect(Math.abs(frameMetrics.rowToControlsGap - assetMetrics.rowToControlsGap)).toBeLessThan(1);
    expect(Math.abs(frameMetrics.sliderToControlsGap - assetMetrics.sliderToControlsGap)).toBeLessThan(1);
    expect(frameMetrics.step.height).toBeLessThanOrEqual(28);
    expect(frameMetrics.step.paddingBlock).toBe('2px 2px');
    expect(Math.abs(frameMetrics.reset.height - assetMetrics.reset.height)).toBeLessThan(1);
    expect(Math.abs(frameMetrics.reset.width - assetMetrics.reset.width)).toBeLessThan(1);
    expect(frameMetrics.reset.minHeight).toBe(assetMetrics.reset.minHeight);
    expect(frameMetrics.reset.paddingInline).toBe(assetMetrics.reset.paddingInline);
    expect(frameMetrics.reset.paddingBlock).toBe(assetMetrics.reset.paddingBlock);
    expect(frameMetrics.reset.fontSize).toBe(assetMetrics.reset.fontSize);
    expect(frameMetrics.reset.borderRadius).toBe(assetMetrics.reset.borderRadius);
    expect(frameMetrics.reset.boxSizing).toBe(assetMetrics.reset.boxSizing);
    expect(Math.abs(frameMetrics.relativeTop - assetMetrics.relativeTop)).toBeLessThan(1);
    expect(Math.abs(frameMetrics.resetRelativeTop - assetMetrics.resetRelativeTop)).toBeLessThan(1);
    expect(assetMetrics.overflow).toBeLessThanOrEqual(0);
  }

  expect(frameSurface.sheet).toBe('rgb(67, 66, 71)');
  expect(assetSurface.sheet).toBe('rgb(67, 66, 71)');
  for (const surface of [frameViewportSurface, frameRotationViewportSurface, assetViewportSurface, assetRotationViewportSurface, assetDepthViewportSurface]) {
    expect(Math.abs(surface.rect.bottom - surface.viewportBottom)).toBeLessThan(1);
    expect(surface.shellSelector).toBe('#lowerContextSheetShell');
    expect(surface.shellBackground).toBe('rgb(67, 66, 71)');
    expect(Math.abs(surface.panelRect.left - surface.slotRect.left)).toBeLessThan(1);
    expect(Math.abs(surface.panelRect.right - surface.slotRect.right)).toBeLessThan(1);
    expect(Math.abs(surface.panelRect.width - surface.slotRect.width)).toBeLessThan(1);
    expect(surface.bodyBackground).toBe('rgb(60, 60, 60)');
    expect(surface.timelineBackground).toBe('rgb(60, 60, 60)');
    expect(surface.samples.map(({ color }) => color)).toEqual(Array(6).fill('rgb(67, 66, 71)'));
  }
  expect(frameScale.step.backgroundColor).toBe('rgb(80, 80, 84)');
  expect(frameScale.reset.backgroundColor).toBe('rgb(80, 80, 84)');
  expect(assetScale.step.backgroundColor).toBe('rgb(80, 80, 84)');
  expect(assetScale.reset.backgroundColor).toBe('rgb(80, 80, 84)');
  expect(frameSurface.accent).toBe('#04fff2');
  expect(assetSurface.accent).toBe('#8b3fff');
  expect(hitArea.abovePill.isSlider).toBe(true);
  expect(hitArea.abovePill.isPill).toBe(false);
  expect(hitArea.sliderCenter.isSlider).toBe(true);
  expect(hitArea.sliderCenter.isPill).toBe(false);
  expect(hitArea.pillCenter.isPill).toBe(true);

  const contextSheetDiagnostics = await page.evaluate(() => buildDiagnosticsText());
  for (const expected of [
    'contextSheetShellSelector: #lowerContextSheetShell',
    'contextSheetPanelUsesSlotWidth: true',
    'contextSheetShellBackground: rgb(67, 66, 71)',
    'contextSheetSafeAreaAppliedCount: 1',
    'contextSheetGridUnusedBlockSpace: 0',
    'contextSheetImplicitRowCount: 0',
    'contextSheetUsesSingleSurface: true',
    'contextSheetUsesBodyHack: false',
    'contextSheetUsesTimelineHack: false',
    'contextSheetUsesBodyBackgroundHack: false',
    'contextSheetUsesTimelineBackgroundHack: false',
    'contextSheetSafeAreaIntegrated: true',
    'contextSheetAnimationReady: true',
  ]) expect(contextSheetDiagnostics).toContain(expected);

  await page.evaluate(() => closeAssetContextPanel());
  const closedViewportSurface = await sampleContextSheetToViewportBottom(page);
  expect(closedViewportSurface.samples.at(-1)?.color).toBe('rgb(60, 60, 60)');

  await page.screenshot({ path: testInfo.outputPath('asset-frame-control-parity.png'), fullPage: true });
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

  const normalLowerLayout = await page.evaluate(() => {
    const durationCell = document.getElementById('lowerGlobalDurationCell');
    const rect = durationCell.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: rect.width, display: getComputedStyle(durationCell).display };
  });
  expect(normalLowerLayout.display).toBe('flex');
  expect(normalLowerLayout.width).toBeGreaterThan(0);
  await page.locator('#tbAssetScale').click();
  await expect(page.locator('#assetContextPanel')).toBeVisible();
  await expect(page.locator('#assetContextPanel .asset-context-title')).toHaveCount(0);
  await expect(page.locator('#assetContextSlider')).toHaveAttribute('aria-label', 'Escala do ativo');
  await expect(page.locator('#assetContextScaleMinus')).toBeVisible();
  await expect(page.locator('#assetContextScalePlus')).toBeVisible();
  await expect(page.locator('#assetContextRotationMinus')).toBeHidden();
  await expect(page.locator('#assetContextRotationPlus')).toBeHidden();
  const openPanelLayout = await page.evaluate((normalDurationRect) => {
    const panel = document.getElementById('assetContextPanel').getBoundingClientRect();
    const slot = document.getElementById('lowerContextSlot').getBoundingClientRect();
    const normalToolbar = getComputedStyle(document.getElementById('toolbar'));
    const backButton = getComputedStyle(document.querySelector('#assetContextPanel .asset-context-back'));
    const durationCellDisplay = getComputedStyle(document.getElementById('lowerGlobalDurationCell')).display;
    const activeStateCellDisplay = getComputedStyle(document.getElementById('lowerActiveStateCell')).display;
    const frameCountDisplay = getComputedStyle(document.getElementById('lowerFrameCount')).display;
    return {
      bodyState: document.body.classList.contains('asset-context-panel-open'),
      toolbarDisplay: normalToolbar.display,
      backButtonBackground: backButton.backgroundColor,
      backButtonBorderStyle: backButton.borderStyle,
      durationCellDisplay,
      activeStateCellDisplay,
      frameCountDisplay,
      slotSpansBothColumns: slot.left <= normalDurationRect.left + 1 && slot.right >= normalDurationRect.right - 1,
      panelUsesSlotWidth: Math.abs(panel.left - slot.left) <= 1 && Math.abs(panel.right - slot.right) <= 1,
      panelCoversNormalLeftControl: panel.left <= normalDurationRect.left + 1 && panel.right >= normalDurationRect.right - 1
    };
  }, normalLowerLayout);
  expect(openPanelLayout).toEqual({
    bodyState: true,
    toolbarDisplay: 'none',
    backButtonBackground: 'rgba(0, 0, 0, 0)',
    backButtonBorderStyle: 'none',
    durationCellDisplay: 'none',
    activeStateCellDisplay: 'none',
    frameCountDisplay: 'none',
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
  const scaleStepResult = await page.evaluate(() => {
    const asset = getSelectedAsset();
    openAssetContextPanel('scale');
    resetAssetContextValue();
    const undoBefore = undoStack.length;
    const revisionBefore = sessionAutosaveRevision;
    const baseline = getAssetScaleBaselineWorldSize(asset);
    return { start: getAssetContextScalePercent(asset), undoBefore, revisionBefore,
      queuedRevisionBefore: _sessionAutosaveQueuedRevision,
      baselineW: baseline.width, baselineH: baseline.height };
  });
  await page.locator('#assetContextScalePlus').click();
  await expect(page.locator('#assetContextValue')).toHaveText('105%');
  await expect(page.locator('#assetContextSlider')).toHaveValue('105');
  const afterPlus = await page.evaluate(() => ({
    percent: getAssetContextScalePercent(getSelectedAsset()), undoCount: undoStack.length,
    queuedRevision: _sessionAutosaveQueuedRevision,
    scheduledAt: sessionAutosaveLastScheduledAt,
    triggerReason: sessionAutosaveLastTriggerReason
  }));
  expect(afterPlus.percent - scaleStepResult.start).toBeCloseTo(5, 3);
  expect(afterPlus.undoCount - scaleStepResult.undoBefore).toBe(1);
  expect(afterPlus.queuedRevision).toBeGreaterThan(scaleStepResult.queuedRevisionBefore);
  expect(afterPlus.scheduledAt).not.toBeNull();
  expect(afterPlus.triggerReason).toBe('asset-scale');
  await expect.poll(() => page.evaluate(() => sessionAutosaveRevision), { timeout: 30_000 })
    .toBeGreaterThanOrEqual(afterPlus.queuedRevision);
  expect(await page.evaluate(() => sessionAutosaveRevision)).toBeGreaterThan(scaleStepResult.revisionBefore);
  await page.evaluate(() => undo());
  const afterPlusUndo = await page.evaluate(() => {
    const asset = getSelectedAsset();
    return { percent: getAssetContextScalePercent(asset), worldW: asset.worldW, worldH: asset.worldH,
      slider: Number(document.getElementById('assetContextSlider').value),
      value: document.getElementById('assetContextValue').textContent,
      kind: assetContextPanelKind };
  });
  expect(afterPlusUndo.percent).toBeCloseTo(100, 3);
  expect(afterPlusUndo.worldW).toBeCloseTo(scaleStepResult.baselineW, 3);
  expect(afterPlusUndo.worldH).toBeCloseTo(scaleStepResult.baselineH, 3);
  expect(afterPlusUndo.slider).toBeCloseTo(100, 3);
  expect(afterPlusUndo.value).toBe('100%');
  expect(afterPlusUndo.kind).toBe('scale');
  await page.evaluate(() => redo());
  const afterPlusRedo = await page.evaluate(() => {
    const asset = getSelectedAsset();
    return { percent: getAssetContextScalePercent(asset), worldW: asset.worldW, worldH: asset.worldH,
      slider: Number(document.getElementById('assetContextSlider').value),
      value: document.getElementById('assetContextValue').textContent,
      kind: assetContextPanelKind };
  });
  expect(afterPlusRedo.percent).toBeCloseTo(105, 3);
  expect(afterPlusRedo.worldW).toBeCloseTo(scaleStepResult.baselineW * 1.05, 3);
  expect(afterPlusRedo.worldH).toBeCloseTo(scaleStepResult.baselineH * 1.05, 3);
  expect(afterPlusRedo.slider).toBeCloseTo(105, 3);
  expect(afterPlusRedo.value).toBe('105%');
  expect(afterPlusRedo.kind).toBe('scale');
  const undoBeforeMinus = await page.evaluate(() => undoStack.length);
  await page.locator('#assetContextScaleMinus').click();
  await expect(page.locator('#assetContextValue')).toHaveText('100%');
  await expect(page.locator('#assetContextSlider')).toHaveValue('100');
  expect(await page.evaluate(() => undoStack.length)).toBe(undoBeforeMinus + 1);
  await page.evaluate(() => undo());
  await expect.poll(() => page.evaluate(() => getAssetContextScalePercent(getSelectedAsset()))).toBeCloseTo(105, 3);
  await expect(page.locator('#assetContextSlider')).toHaveValue('105');
  await expect(page.locator('#assetContextValue')).toHaveText('105%');
  await page.evaluate(() => redo());
  await expect.poll(() => page.evaluate(() => getAssetContextScalePercent(getSelectedAsset()))).toBeCloseTo(100, 3);
  await expect(page.locator('#assetContextSlider')).toHaveValue('100');
  await expect(page.locator('#assetContextValue')).toHaveText('100%');
  await page.locator('#assetContextScalePlus').click();
  await page.locator('#assetContextScalePlus').click();
  await expect(page.locator('#assetContextValue')).toHaveText('110%');
  await page.locator('#assetContextReset').click();
  await expect(page.locator('#assetContextValue')).toHaveText('100%');
  await page.locator('#assetContextPanel .asset-context-back').click();
  await expect(page.locator('#assetContextPanel')).toBeHidden();
  await expect(page.locator('#tbAssetRotate')).toBeVisible();
  await expect.poll(() => page.evaluate(() => ({
    bodyState: document.body.classList.contains('asset-context-panel-open'),
    panelPointerEvents: getComputedStyle(document.getElementById('assetContextPanel')).pointerEvents,
    toolbarDisplay: getComputedStyle(document.getElementById('toolbar')).display,
    durationCellDisplay: getComputedStyle(document.getElementById('lowerGlobalDurationCell')).display,
    activeStateCellDisplay: getComputedStyle(document.getElementById('lowerActiveStateCell')).display,
    frameCountDisplay: getComputedStyle(document.getElementById('lowerFrameCount')).display,
    durationCellHasGeometry: document.getElementById('lowerGlobalDurationCell').getBoundingClientRect().width > 0
  }))).toEqual({ bodyState: false, panelPointerEvents: 'none', toolbarDisplay: 'flex', durationCellDisplay: 'flex', activeStateCellDisplay: 'flex', frameCountDisplay: 'flex', durationCellHasGeometry: true });
  await page.locator('#tbAssetRotate').click();
  await expect(page.locator('#assetContextSlider')).toHaveAttribute('aria-label', 'Rotação do ativo');
  await expect.poll(() => page.evaluate(() => assetContextPanelKind)).toBe('rotation');
  await expect(page.locator('#assetContextRotationMinus')).toBeVisible();
  await expect(page.locator('#assetContextRotationMinus')).toHaveText('-5°');
  await expect(page.locator('#assetContextRotationPlus')).toBeVisible();
  await expect(page.locator('#assetContextScaleMinus')).toBeHidden();
  await expect(page.locator('#assetContextScalePlus')).toBeHidden();
  await page.locator('#assetContextPanel .asset-context-back').click();
  await expect(page.locator('#assetContextPanel')).toBeHidden();
  await expect(page.locator('#tbAssetDepth')).toBeVisible();
  await page.locator('#tbAssetDepth').click();
  await expect(page.locator('#assetContextSlider')).toHaveAttribute('aria-label', 'Profundidade do ativo');
  await expect.poll(() => page.evaluate(() => assetContextPanelKind)).toBe('depth');
  await expect(page.locator('#assetContextScaleMinus')).toBeHidden();
  await expect(page.locator('#assetContextScalePlus')).toBeHidden();
  await expect(page.locator('#assetContextRotationMinus')).toBeHidden();
  await expect(page.locator('#assetContextRotationPlus')).toBeHidden();
  await page.locator('#assetContextPanel .asset-context-back').click();
  await expect(page.locator('#assetContextPanel')).toBeHidden();
  await expect(page.locator('#tbAssetScale')).toBeVisible();
  await page.locator('#tbAssetScale').click();
  await expect(page.locator('#assetContextScaleMinus')).toBeVisible();
  await expect(page.locator('#assetContextRotationMinus')).toBeHidden();
  await page.locator('#assetContextPanel .asset-context-back').click();
  await expect(page.locator('#assetContextPanel')).toBeHidden();
  await page.locator('#tbAssetDepth').click();
  await expect(page.locator('#assetContextSlider')).toHaveAttribute('aria-label', 'Profundidade do ativo');

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

  const uiStateResult = await page.evaluate(() => {
    const asset = getSelectedAsset();
    openAssetContextPanel('rotation');
    const beforeStep = asset.rotation;
    stepAssetContextRotation(5);
    const rotationStep = asset.rotation - beforeStep;
    setEditorMode('camera', 'webkit-e8q-mode-switch');
    const assetPanelClosedInCamera = assetContextPanelKind === 'none' && !document.body.classList.contains('asset-context-panel-open');
    openCustBar();
    switchCustTab('scale');
    setEditorMode('assets', 'webkit-e8q-mode-switch');
    const framePanelClosedInAssets = !document.body.classList.contains('cust-expanded') && !document.body.classList.contains('cust-open');
    clearSelectedAsset('webkit-e8q-no-selection');
    syncAssetToolbarState();
    const actionIds = ['tbAssetReplace','tbAssetScale','tbAssetRotate','tbAssetDepth','tbAssetDelete','tbAssetForward','tbAssetBackward'];
    const disabledWithoutSelection = actionIds.every(id => document.getElementById(id).classList.contains('asset-tool-disabled'));
    openAssetContextPanel('scale');
    const blockedWithoutSelection = assetContextPanelKind === 'none';
    selectAssetById(asset.id, 'webkit-e8q-restore-selection');
    updateFrameSelector();
    centerLowerTimelineOnFrame(Math.min(1, frameCount - 1), false);
    syncLowerTimelineCenterMarkers();
    const axisX = getLowerTimelineCanonicalAxisX();
    const slot = document.querySelector('.lower-timeline-slot');
    const slotRect = slot.getBoundingClientRect();
    const markerX = slotRect.left + parseFloat(getComputedStyle(slot).getPropertyValue('--lower-timeline-center-x'));
    const readyColor = getComputedStyle(document.documentElement).getPropertyValue('--preview-ready-color').trim();
    return { rotationStep, assetPanelClosedInCamera, framePanelClosedInAssets, disabledWithoutSelection,
      blockedWithoutSelection, centerDelta: Math.abs(markerX - axisX), readyColor };
  });
  expect(uiStateResult.rotationStep).toBe(5);
  expect(uiStateResult.assetPanelClosedInCamera).toBe(true);
  expect(uiStateResult.framePanelClosedInAssets).toBe(true);
  expect(uiStateResult.disabledWithoutSelection).toBe(true);
  expect(uiStateResult.blockedWithoutSelection).toBe(true);
  expect(uiStateResult.centerDelta).toBeLessThan(0.01);
  expect(uiStateResult.readyColor).toBe('#04fff2');
});

test('E8W Session Restore preserva todos os Frames e Save não sincroniza geometria', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });

  const fixtureState = await prepareE8WSessionFixture(page);
  expect(fixtureState.frameCount).toBeGreaterThanOrEqual(3);
  expect(fixtureState.imageAssetsCount).toBeGreaterThanOrEqual(3);
  expect(fixtureState.hydratedImageAssetsCount).toBe(fixtureState.imageAssetsCount);

  const beforeClose = await page.evaluate(async () => {
    if (frameCount < 3 || assets.filter(a => a && a.type === 'image').length < 3) {
      throw new Error('fixture E8W requer 3 assets e 3 Frames');
    }
    // Waypoints determinísticos: t=i/(N-1) corresponde exatamente ao Frame i.
    loopEnabled = false; finishMode = 'none'; easeAmount = 0;
    segDurations.length = 0;
    for (let i = 0; i < frameCount - 1; i++) segDurations.push(1);
    framePauses.length = 0;
    for (let i = 0; i < frameCount; i++) framePauses.push({ duration: 0 });
    segTremorSettings.length = 0;
    for (let i = 0; i < frameCount - 1; i++) segTremorSettings.push({ mode:'off', enabled:false, intensity:0, frequency:1 });
    projectShake = { enabled:false, intensity:0, frequency:1 };
    renderAll();
    const live = captureSessionFrameParitySnapshot();
    clearTimeout(_sessionAutosaveTimer);
    const revision = ++_sessionAutosaveQueuedRevision;
    const written = await writeSessionAutosave(revision, _sessionAutosaveEpoch, true, 'webkit-e8w-roundtrip');
    const checkpoint = await readSessionCheckpoint();
    const payload = JSON.parse(checkpoint.payload);
    return { live, written, checkpoint: {
      framesAbs:payload.framesAbs, framesNorm:payload.framesNorm,
      frameRotations:payload.frameRotations, projectWorld:payload.projectWorld,
      curvesV2:payload.curvesV2, ctrlPts:payload.ctrlPts, segDurations:payload.segDurations,
      assets:payload.assets.filter(a=>a&&a.type==='image').map(a=>({id:String(a.id),worldX:a.worldX,worldY:a.worldY,worldW:a.worldW,worldH:a.worldH,rotation:Number(a.rotation)||0,depth:Number(a.depth)||0})),
      activeIdx:payload.activeIdx
    }};
  });
  expect(beforeClose.written).toBe(true);
  expect(beforeClose.checkpoint.framesAbs).toEqual(beforeClose.live.canonicalState.framesAbs);
  expect(beforeClose.checkpoint.framesNorm).toEqual(beforeClose.live.canonicalState.framesNorm);
  expect(beforeClose.checkpoint.projectWorld).toMatchObject(beforeClose.live.canonicalState.projectWorld);
  expect(beforeClose.checkpoint.curvesV2).toEqual(beforeClose.live.canonicalState.curvesV2);
  expect(beforeClose.checkpoint.assets).toEqual(beforeClose.live.canonicalState.assets);
  expect(beforeClose.checkpoint.activeIdx).toBe(beforeClose.live.canonicalState.activeFrameIndex);

  // Simula a mudança de viewport do Safari entre encerramento e nova abertura.
  await page.setViewportSize({ width: 390, height: 700 });
  await reloadForStartup(page);
  const dialog = page.getByRole('dialog', { name: 'Continuar sessão anterior?' });
  await expect(dialog).toBeVisible();
  await dialog.getByText('Continuar de onde parei', { exact: true }).click();
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await expect.poll(() => page.evaluate(() => sessionRestoreAppliedSuccessfully)).toBe(true);

  const afterRestore = await page.evaluate(() => {
    const snapshot = captureSessionFrameParitySnapshot();
    const dims = getCanonicalFrameCoordinateDimensions();
    const sx = imgNatW / dims.width, sy = imgNatH / dims.height;
    const previewFrames = frames.slice(0, frameCount).map((frame, index) => {
      const renderState = getRenderStateAtTime(frameCount === 1 ? 0 : index / (frameCount - 1));
      if (!renderState.ok) throw new Error(`Preview Frame ${index}: ${renderState.reason}`);
      const camera = renderState.camera;
      return { index, x:(camera.cx-camera.sw/2)/sx, y:(camera.cy-camera.sh/2)/sy,
        w:camera.sw/sx, h:camera.sh/sy, rotation:camera.rot||0 };
    });
    return { snapshot, previewFrames, sequence:sessionRestoreSequence.map(entry=>entry.step),
      coordinateSource:sessionRestoreFrameCoordinateSource,
      conversionCount:sessionRestoreNormToAbsConversionCount,
      doubleConversion:sessionRestoreDoubleFrameConversionDetected,
      invalidated:[sessionRestoreInvalidatedSegmentCache,sessionRestoreInvalidatedCurveCache,
        sessionRestoreInvalidatedPreviewCache,sessionRestoreInvalidatedFrameOverlay,
        sessionRestoreInvalidatedScrim,sessionRestoreRebuiltCameraDerivedState] };
  });

  const withoutEphemeralSelection = ({ selectedSegmentIndex, ...canonical }) => canonical;
  expect(withoutEphemeralSelection(afterRestore.snapshot.canonicalState)).toEqual(withoutEphemeralSelection(beforeClose.live.canonicalState));
  for (const frame of afterRestore.snapshot.frames) {
    expectCloseGeometry(frame.overlay, frame.canonical, { frameIndex:frame.index, label:'overlay' });
    expectCloseGeometry(afterRestore.previewFrames[frame.index], frame.canonical, { frameIndex:frame.index, label:'preview' });
  }
  expect(afterRestore.coordinateSource).toBe('framesAbs');
  expect(afterRestore.conversionCount).toBe(0);
  expect(afterRestore.doubleConversion).toBe(false);
  expect(afterRestore.invalidated.every(Boolean)).toBe(true);
  expect(afterRestore.sequence).toContain('final-overlay-scrim-camera-rebuilt');

  const saveRoundTrip = await page.evaluate(() => {
    const before = captureSessionFrameParitySnapshot();
    openSaveModal(false);
    // No iPhone, foco do input altera o visual viewport e dispara resize.
    window.dispatchEvent(new Event('resize'));
    const beforeDirectSave = captureSessionFrameParitySnapshot();
    confirmSaveModal(false);
    const after = captureSessionFrameParitySnapshot();
    return { before, beforeDirectSave, after };
  });
  expect(saveRoundTrip.before.canonicalState).toEqual(saveRoundTrip.beforeDirectSave.canonicalState);
  expect(saveRoundTrip.before.canonicalState).toEqual(saveRoundTrip.after.canonicalState);
  const expectStableDerivedFrames = (actual, expected, phase) => {
    expect(actual).toHaveLength(expected.length);
    actual.forEach((frame, position) => {
      const expectedFrame = expected[position];
      expect(frame.index).toBe(expectedFrame.index);
      expect(frame.canonical).toEqual(expectedFrame.canonical);
      expectCloseGeometry(frame.camera, expectedFrame.camera, { frameIndex:frame.index, label:`${phase}.camera` });
      expectCloseGeometry(frame.overlay, expectedFrame.overlay, { frameIndex:frame.index, label:`${phase}.overlay` });
    });
  };
  expectStableDerivedFrames(saveRoundTrip.beforeDirectSave.frames, saveRoundTrip.before.frames, 'before-save');
  expectStableDerivedFrames(saveRoundTrip.after.frames, saveRoundTrip.before.frames, 'after-save');
});
