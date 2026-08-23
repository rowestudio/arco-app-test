import { expect, test } from '@playwright/test';
import path from 'node:path';
import { dismissProModalIfVisible } from './ui-helpers.mjs';

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

// Pan real do viewport em contexto hasTouch/isMobile, sem simulação de gesto. Em
// WebKit não é possível construir Touch/TouchEvent por script ("Illegal constructor"),
// então o gesto real de dois dedos — único que move o viewport no Modo Ativos, já que
// um arrasto de um dedo sobre um asset é capturado pela seleção — não é simulável.
// page.mouse também não dirige o handler de pan (baseado em pointer events) no WebKit
// mobile. Aplicamos então o MESMO efeito de câmera que o handler de pan executa em cada
// movimento (editorPanX/Y += delta; clampEditorPan(); applyEditorZoom(); cf.
// index.html), movendo o viewport de verdade e mantendo intacta a verificação
// expectParity(panned) sob a câmera deslocada.
async function panEditorViewport(page, dxFrac, dyFrac) {
  const box = await page.locator('#imageArea').boundingBox();
  if (!box) throw new Error('#imageArea sem geometria para o pan');
  await page.evaluate(({ dx, dy }) => {
    editorPanX += dx;
    editorPanY += dy;
    clampEditorPan();
    applyEditorZoom();
  }, { dx: box.width * dxFrac, dy: box.height * dyFrac });
}

// v8z4b32E9F1 — helpers da nova UI do editor de Texto (paleta de Fundo por swatches +
// slider de largura). Escolher uma cor de Fundo já LIGA o fundo (auto-enable) e revela
// o slider de opacidade; "Sem cor / Transparente" desliga. Mover o slider de largura
// entra em 'fixed' no mesmo gesto. Adaptam os gates E8Z–E9F sem enfraquecer asserções.
async function enableTextBoxColor(page, color) {
  await page.locator('#textBoxBackgroundColor').evaluate((el, c) => { el.value = c; el.dispatchEvent(new Event('input', { bubbles: true })); }, color);
}
async function disableTextBox(page) {
  await page.locator('#textBgSwatches [data-swatch-none]').click();
}
// v8z4b32E9G — a edição manual de largura pelo painel (slider) foi substituída pelas
// side width handles no Stage. dragTextWidthHandle aciona o fluxo público REAL: eventos
// de pointer reais despachados na própria alça (.text-width-handle[data-asset-width-
// handle]), a única forma pública de alterar largura agora. moves é uma lista de
// deslocamentos [dx,dy] em pixels de TELA a partir do centro da alça (aplicados em
// sequência, simulando vários pointermove de um mesmo gesto); cancel dispara
// pointercancel em vez de pointerup ao final.
// v8z4b32E9G-R2 — hardened per revisão: exige a alça REAL visível/interativa (nunca
// aceita um elemento oculto/sem área por engano) e devolve snapshots do diagnóstico de
// lifecycle em cada etapa do gesto (pointerdown/primeiro pointermove/todos os
// pointermove/pointerup-ou-cancel), lidos pela MESMA função de resolução que o produto
// usa (resolveActiveTextAssetForWidthDrag), para tornar um FAIL autoexplicativo sem
// precisar de uma nova rodada só para instrumentar.
async function dragTextWidthHandle(page, side, moves, { cancel = false } = {}) {
  return await page.evaluate(({ side, moves, cancel }) => {
    const selector = `.text-width-handle.show[data-asset-width-handle="${side}"]`;
    const handle = document.querySelector(selector);
    if (!handle) throw new Error('side width handle not visible: ' + selector);
    const style = getComputedStyle(handle);
    const rect0 = handle.getBoundingClientRect();
    if (style.display === 'none' || rect0.width <= 0 || rect0.height <= 0) {
      throw new Error('side width handle has no usable geometry: ' + JSON.stringify({ display: style.display, w: rect0.width, h: rect0.height }));
    }
    const cx = rect0.left + rect0.width / 2, cy = rect0.top + rect0.height / 2;
    const pointerId = 7771;
    const fire = (type, x, y) => handle.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId, pointerType: 'touch', isPrimary: true }));
    const snapshot = () => {
      const resolved = typeof resolveActiveTextAssetForWidthDrag === 'function' ? resolveActiveTextAssetForWidthDrag() : null;
      return {
        textWidthGestureActive: typeof textWidthDragState !== 'undefined' && !!textWidthDragState,
        textWidthHandleSide: (typeof textWidthDragState !== 'undefined' && textWidthDragState) ? textWidthDragState.side : null,
        assetTransformDragStateActive: typeof assetTransformDragState !== 'undefined' && !!assetTransformDragState,
        selectedAssetId: typeof selectedAssetId !== 'undefined' && selectedAssetId != null ? String(selectedAssetId) : null,
        boxWidth: resolved ? resolved.asset.boxWidth : null,
        textBaseBoxWidth: resolved ? resolved.asset.textBaseBoxWidth : null,
        boxWidthMode: resolved ? resolved.asset.boxWidthMode : null,
      };
    };
    const diag = { beforeDown: snapshot() };
    fire('pointerdown', cx, cy);
    diag.afterDown = snapshot();
    let lastX = cx, lastY = cy, firstMoveDiag = null;
    moves.forEach(([dx, dy], i) => {
      lastX = cx + dx; lastY = cy + (dy || 0);
      fire('pointermove', lastX, lastY);
      if (i === 0) firstMoveDiag = snapshot();
    });
    diag.afterFirstMove = firstMoveDiag;
    diag.afterAllMoves = snapshot();
    fire(cancel ? 'pointercancel' : 'pointerup', lastX, lastY);
    diag.afterUp = snapshot();
    return { startX: cx, startY: cy, diag };
  }, { side, moves, cancel });
}
// Atalho para um único deslocamento horizontal (screen px); positivo estende a alça
// para FORA da caixa em ambos os lados (direita cresce à direita, esquerda cresce à
// esquerda), como o usuário percebe visualmente.
async function dragTextWidthHandleBy(page, side, deltaPx, opts = {}) {
  const dx = side === 'right' ? deltaPx : -deltaPx;
  return dragTextWidthHandle(page, side, [[dx * 0.34, 0], [dx * 0.67, 0], [dx, 0]], opts);
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

test('E8X WebKit gate — TC-038 até Preview e composição real', async ({ page }) => {
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

  // OK cria exatamente um asset; whitespace canônico e wrap automático não podem divergir do Stage.
  const canonicalText = 'A  B\tC\nD texto longo para comprovar quebra automática dentro do quadro canônico';
  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill(canonicalText);
  await page.locator('#textCreationColor').evaluate((el) => { el.value='#ff3366'; el.dispatchEvent(new Event('input',{bubbles:true})); });
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.getByRole('button', { name:'Confirmar', exact:true }).click();
  const confirmed = await page.evaluate(() => {
    const text=assets.find(a=>a&&a.type==='text'), data=buildProjectData(true);
    const canvas=document.createElement('canvas'), ctx=canvas.getContext('2d'); ctx.font=`${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
    return { count:assets.filter(a=>a&&a.type==='text').length, text:{...text}, saved:data.assets.find(a=>a&&a.type==='text'), lines:wrapTextLines(ctx,text.text,text.boxWidth),
      selected:selectedAssetId, outline:document.getElementById('assetSelectOutline')?.dataset.assetId||'',
      resize:[textCreationKeyboardResizeChangedProjectWorld,textCreationKeyboardResizeChangedFrames,textCreationKeyboardResizeChangedExistingAssets] };
  });
  expect(confirmed.count).toBe(1); expect(confirmed.text.text).toBe(canonicalText); expect(confirmed.text.color).toBe('#ff3366'); expect(confirmed.lines.length).toBeGreaterThan(1);
  expect(confirmed.lines[0]).toContain('A  B    C');
  await expect(page.locator(`.world-text-asset[data-asset-id="${confirmed.text.id}"]`)).toHaveText(canonicalText);
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
    const before={x:text.worldX,y:text.worldY,w:text.worldW,h:text.worldH,boxWidth:text.boxWidth,fontSize:text.fontSize,rotation:text.rotation,cx:text.worldX+text.worldW/2,cy:text.worldY+text.worldH/2};
    beginAssetTransformDrag(point(0,80,82),'br'); handleAssetTransformPointerMove(point(0,135,82)); endAssetTransformPointer(point(0,135,82),false);
    const scaled={x:text.worldX,y:text.worldY,w:text.worldW,h:text.worldH,boxWidth:text.boxWidth,fontSize:text.fontSize,cx:text.worldX+text.worldW/2,cy:text.worldY+text.worldH/2};
    beginAssetTransformDrag(point(0,100,83),'br'); handleAssetTransformPointerMove(point(Math.PI/3,100,83)); endAssetTransformPointer(point(Math.PI/3,100,83),false);
    return {before,scaled,after:{w:text.worldW,h:text.worldH,fontSize:text.fontSize,rotation:text.rotation}};
  });
  expect(transformed.scaled.w).toBeGreaterThan(transformed.before.w); expect(transformed.scaled.fontSize).toBeGreaterThan(transformed.before.fontSize); expect(transformed.after.rotation).not.toBe(transformed.before.rotation);
  expect(transformed.scaled.boxWidth).toBeCloseTo(transformed.scaled.w); expect(transformed.scaled.cx).toBeCloseTo(transformed.before.cx); expect(transformed.scaled.cy).toBeCloseTo(transformed.before.cy);

  // O painel de Escala usa a mesma largura canônica e também preserva o centro.
  const panelScaled = await page.evaluate((id) => {
    selectAssetById(id,'layers'); const text=assets.find(a=>String(a.id)===id);
    const before={w:text.worldW,cx:text.worldX+text.worldW/2,cy:text.worldY+text.worldH/2};
    openAssetContextPanel('scale'); setAssetContextValue(getAssetContextScalePercent(text)+20); commitAssetContextGesture();
    return {before,after:{w:text.worldW,boxWidth:text.boxWidth,cx:text.worldX+text.worldW/2,cy:text.worldY+text.worldH/2}};
  }, String(confirmed.text.id));
  expect(panelScaled.after.w).toBeGreaterThan(panelScaled.before.w); expect(panelScaled.after.boxWidth).toBeCloseTo(panelScaled.after.w);
  expect(panelScaled.after.cx).toBeCloseTo(panelScaled.before.cx); expect(panelScaled.after.cy).toBeCloseTo(panelScaled.before.cy);

  // Undo/Redo preserva a geometria canônica produzida pelo painel.
  const undoRedo = await page.evaluate((id) => {
    const geometry=()=>{const a=assets.find(item=>String(item.id)===id);return {worldX:a.worldX,worldY:a.worldY,worldW:a.worldW,worldH:a.worldH,boxWidth:a.boxWidth,fontSize:a.fontSize};};
    const committed=geometry(); undo(); const undone=geometry(); redo(); const redone=geometry(); return {committed,undone,redone};
  }, String(confirmed.text.id));
  expect(undoRedo.undone.worldW).not.toBeCloseTo(undoRedo.committed.worldW); expect(undoRedo.redone).toEqual(undoRedo.committed);

  // Visibilidade controla desenho, não a topologia persistida do mundo.
  const visibility = await page.evaluate((id) => {
    const text=assets.find(a=>String(a.id)===id), world=structuredClone(projectWorld), frameState=structuredClone(frames.slice(0,frameCount));
    const multiBefore=isMultiImageWorldActive(); text.visible=false; renderProjectWorldExtraImages();
    const hidden={multi:isMultiImageWorldActive(),world:structuredClone(projectWorld),frames:structuredClone(frames.slice(0,frameCount))};
    text.visible=true; renderProjectWorldExtraImages();
    return {multiBefore,hidden,shown:{world:structuredClone(projectWorld),frames:structuredClone(frames.slice(0,frameCount))},world,frameState};
  }, String(confirmed.text.id));
  expect(visibility.multiBefore).toBe(true); expect(visibility.hidden.multi).toBe(true);
  expect(visibility.hidden.world).toEqual(visibility.world); expect(visibility.hidden.frames).toEqual(visibility.frameState);
  expect(visibility.shown.world).toEqual(visibility.world); expect(visibility.shown.frames).toEqual(visibility.frameState);

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

  // Prova física da composição anterior: texto atrás da imagem opaca deve ser
  // equivalente, em pixels finais, ao mesmo frame sem o Text Asset.
  const previewCompositionBefore = await page.evaluate((id) => {
    setEditorMode('assets','webkit-e8x-preview-composition'); selectAssetById(id,'layers');
    const text=assets.find(a=>String(a.id)===id);
    return {textZBefore:text.zIndex,maxZBefore:Math.max(...assets.map(a=>Number(a.zIndex)||0))};
  }, String(confirmed.text.id));
  expect(previewCompositionBefore.textZBefore).toBeLessThan(previewCompositionBefore.maxZBefore);
  await page.evaluate(() => startPreview());
  await expect(page.locator('#previewScreen')).toHaveClass(/show/,{timeout:30_000});
  await expect.poll(() => page.evaluate(() => previewLoadingHiddenAfterFirstFrame),{timeout:30_000}).toBe(true);
  const occludedProof = await page.evaluate(() => {
    if (animFrame) togglePreviewPlayback();
    const canvas=document.getElementById('previewDisplayCanvas'), durationSec=getComputedTimelineDuration();
    const totalPF=Math.max(1,Math.round(durationSec*25)), previewSource=getPreviewRenderSource(), originalSnapshot=renderSessionSnapshot;
    renderFrameSafely(canvas.getContext('2d'),canvas,0,canvas.width,canvas.height,totalPF,0,{renderSource:previewSource});
    const withText=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    const noText=document.createElement('canvas'); noText.width=canvas.width; noText.height=canvas.height;
    renderSessionSnapshot={...originalSnapshot,textAssets:[]};
    renderFrameSafely(noText.getContext('2d'),noText,0,noText.width,noText.height,totalPF,0,{renderSource:previewSource});
    renderSessionSnapshot=originalSnapshot;
    const withoutText=noText.getContext('2d').getImageData(0,0,noText.width,noText.height).data; let beforeChanged=0,beforeColored=0;
    for(let i=0;i<withText.length;i+=4){
      if(Math.abs(withText[i]-withoutText[i])+Math.abs(withText[i+1]-withoutText[i+1])+Math.abs(withText[i+2]-withoutText[i+2])+Math.abs(withText[i+3]-withoutText[i+3])>20) beforeChanged++;
      if(withText[i]>withText[i+1]*1.35&&withText[i]>withText[i+2]*1.15&&withText[i+3]>100) beforeColored++;
    }
    noText.width=1; noText.height=1;
    return {beforeChanged,beforeColored};
  });
  expect(occludedProof.beforeChanged).toBe(0);
  await page.evaluate(() => { stopPreview(); const canvas=document.getElementById('previewDisplayCanvas'); canvas.width=1; canvas.height=1; });

  // Reorder real: trazer o mesmo texto até maxZ deve tornar sua contribuição física visível.
  const previewComposition = await page.evaluate((id) => {
    setEditorMode('assets','webkit-e8x-preview-composition'); selectAssetById(id,'layers');
    const text=assets.find(a=>String(a.id)===id);
    while (getAssetZOrderInfo().canForward) bringSelectedAssetForward();
    return {visibleText:serializeProjectAsset(text,0,false),maxZ:Math.max(...assets.map(a=>Number(a.zIndex)||0))};
  }, String(confirmed.text.id));
  expect(previewComposition.visibleText.zIndex).toBe(previewComposition.maxZ);

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
    const canvasSize=[canvas.width,canvas.height]; noText.width=1; noText.height=1;
    return {snapshot:originalSnapshot?.textAssets?.find(a=>String(a.id)===id)||null,textRenderAudit,colored,changed,canvas:canvasSize};
  }, String(confirmed.text.id));
  expect(previewProof.snapshot).toMatchObject({id:confirmed.text.id,text:previewComposition.visibleText.text,color:'#ff3366',zIndex:previewComposition.visibleText.zIndex});
  expect(previewProof.textRenderAudit).toMatchObject({id:confirmed.text.id,drawn:true,intersectsCamera:true});
  expect(previewProof.textRenderAudit.screenW).toBeGreaterThan(0); expect(previewProof.textRenderAudit.screenH).toBeGreaterThan(0);
  expect(previewProof.canvas[0]).toBeGreaterThan(0); expect(previewProof.colored).toBeGreaterThan(0); expect(previewProof.changed).toBeGreaterThan(0);
  await page.evaluate(() => { stopPreview(); const canvas=document.getElementById('previewDisplayCanvas'); canvas.width=1; canvas.height=1; });

  // Export H.264 é validado separadamente pelo gate Chrome estável.

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
    // v8z4b32E9F — paleta de UI aprovada: chrome principal passou de #3c3c3c para #24262B.
    // As superfícies contextuais (#434247) e controles não foram redesenhados nesta rodada.
    expect(surface.bodyBackground).toBe('rgb(36, 38, 43)');
    expect(surface.timelineBackground).toBe('rgb(36, 38, 43)');
    expect(surface.samples.map(({ color }) => color)).toEqual(Array(6).fill('rgb(67, 66, 71)'));
  }
  expect(frameScale.step.backgroundColor).toBe('rgb(80, 80, 84)');
  expect(frameScale.reset.backgroundColor).toBe('rgb(80, 80, 84)');
  expect(assetScale.step.backgroundColor).toBe('rgb(80, 80, 84)');
  expect(assetScale.reset.backgroundColor).toBe('rgb(80, 80, 84)');
  expect(frameSurface.accent).toBe('#04fff2');
  expect(assetSurface.accent).toBe('#FF6B8A'); // v8z4b32E9F — Ativos migrou de roxo para coral
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
  expect(closedViewportSurface.samples.at(-1)?.color).toBe('rgb(36, 38, 43)'); // v8z4b32E9F — chrome #24262B

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

test('E8Z — editor tipográfico e caixa usam fluxo público, isolam draft e bloqueiam o Stage', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  await page.setViewportSize({width:390,height:797}); await page.goto('/',{waitUntil:'domcontentloaded'}); await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture); await expect(page.locator('body')).toHaveClass(/mode-editor/,{timeout:30_000});
  await page.evaluate(()=>setEditorMode('assets','webkit-e8y'));
  await page.evaluate(()=>startTextCreation()); await page.locator('#textCreationInput').fill('Linha 1\nLinha 2');
  // v8z4b32E9F — a navegação principal do editor passou a ser uma rail iconográfica:
  // sete propriedades por ícone, sem label textual visível, com aria-label acessível.
  const e9fRail = await page.locator('#textCreationSheet [data-text-tool]').evaluateAll(els => els.map(e => ({ label: e.getAttribute('aria-label'), text: e.textContent.trim() })));
  expect(e9fRail).toEqual([
    { label:'Editar texto', text:'' }, { label:'Fonte', text:'' }, { label:'Estilo', text:'' },
    { label:'Alinhamento', text:'' }, { label:'Cor do texto', text:'' }, { label:'Fundo da caixa', text:'' }, { label:'Largura da caixa', text:'' },
  ]);
  // v8z4b32E9G — o controle de largura deixou de existir no painel (nem slider nem
  // stepper): a largura agora é editada diretamente no Stage pelas side width handles;
  // o painel de Largura mantém somente o comando Auto, sem range algum.
  await expect(page.locator('[data-text-panel="text"] input[type="range"]')).toHaveCount(0);
  await expect(page.locator('[data-text-panel="width"] input[type="range"]')).toHaveCount(0);
  await expect(page.locator('[data-text-panel="width"] #textWidthAuto')).toHaveCount(1);
  const creationWithoutBox=await page.evaluate(()=>{const m=measureTextAsset(pendingTextDraft);return{enabled:pendingTextDraft.boxBackgroundEnabled,cx:pendingTextDraft.worldX+pendingTextDraft.worldW/2,cy:pendingTextDraft.worldY+pendingTextDraft.worldH/2,boxWidth:pendingTextDraft.boxWidth,lines:m.lines,geometry:serializeProjectAsset(pendingTextDraft,0,false)}});
  expect(creationWithoutBox.enabled).toBe(false);
  // v8z4b32E9F1 — ligar o fundo escolhendo uma cor (auto-enable) preserva wrapping e centro.
  await page.getByRole('tab',{name:'Fundo da caixa',exact:true}).click(); await enableTextBoxColor(page,'#000000');
  const creationWithBox=await page.evaluate(()=>{const m=measureTextAsset(pendingTextDraft);return{enabled:pendingTextDraft.boxBackgroundEnabled,cx:pendingTextDraft.worldX+pendingTextDraft.worldW/2,cy:pendingTextDraft.worldY+pendingTextDraft.worldH/2,boxWidth:pendingTextDraft.boxWidth,lines:m.lines,worldW:pendingTextDraft.worldW,paddingX:m.paddingX}});
  expect(creationWithBox.enabled).toBe(true); expect(creationWithBox.cx).toBeCloseTo(creationWithoutBox.cx); expect(creationWithBox.cy).toBeCloseTo(creationWithoutBox.cy); expect(creationWithBox.boxWidth).toBe(creationWithoutBox.boxWidth); expect(creationWithBox.lines).toEqual(creationWithoutBox.lines); expect(creationWithBox.worldW).toBeCloseTo(creationWithBox.boxWidth+2*creationWithBox.paddingX);
  // Slider de opacidade só existe (e funciona) com o fundo ligado.
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeVisible();
  for(const [opacity,label] of [['65','65%'],['0','0%'],['100','100%']]){await page.locator('#textBoxBackgroundOpacity').fill(opacity);await expect(page.locator('#textBoxBackgroundOpacityValue')).toHaveText(label)}
  // "Sem cor / Transparente" desliga o fundo, esconde o slider e restaura a geometria.
  await disableTextBox(page); await expect(page.locator('#textEditorBgOpacityWrap')).toBeHidden(); const creationRestored=await page.evaluate(()=>({enabled:pendingTextDraft.boxBackgroundEnabled,cx:pendingTextDraft.worldX+pendingTextDraft.worldW/2,cy:pendingTextDraft.worldY+pendingTextDraft.worldH/2,boxWidth:pendingTextDraft.boxWidth,worldW:pendingTextDraft.worldW,worldH:pendingTextDraft.worldH})); expect(creationRestored).toMatchObject({enabled:false,cx:creationWithoutBox.cx,cy:creationWithoutBox.cy,boxWidth:creationWithoutBox.boxWidth,worldW:creationWithoutBox.geometry.worldW,worldH:creationWithoutBox.geometry.worldH});
  await page.getByRole('button',{name:'Confirmar',exact:true}).click();
  const id=await page.evaluate(()=>assets.find(a=>a?.type==='text').id);
  const textBox=await page.locator(`.world-text-asset[data-asset-id="${id}"]`).boundingBox();
  expect(textBox).toBeTruthy(); const textPoint={x:textBox.x+textBox.width/2,y:textBox.y+textBox.height/2};

  // Um tap real apenas seleciona; não abre sheet nem teclado.
  await page.touchscreen.tap(textPoint.x,textPoint.y);
  expect(await page.evaluate(()=>selectedAssetId)).toBe(id);
  await expect(page.locator('#textCreationSheet')).not.toHaveClass(/open/);
  expect(await page.evaluate(()=>document.activeElement?.id)).not.toBe('textCreationInput');
  await expect(page.locator('#tbAssetReplace .tb-lbl')).toHaveText('Editar');

  // Cancelamentos de escala e rotação restauram integralmente e não criam histórico/revisão.
  const cancelledTransforms=await page.evaluate(id=>{const fake={setPointerCapture(){},releasePointerCapture(){}},snapshot=()=>{const current=assets.find(a=>String(a.id)===id);if(!current)throw new Error('Text Asset atual ausente após restoreState');return serializeProjectAsset(current,0,false)},event=(x,y,pid)=>({clientX:x,clientY:y,pointerId:pid,currentTarget:fake,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}}),run=(mode,pid)=>{renderAssetSelectionOverlay();const box=document.getElementById('assetSelectOutline').getBoundingClientRect(),start=event(box.right,box.bottom,pid);beginAssetTransformDrag(start,'br');assetTransformDragState.mode=mode;handleAssetTransformPointerMove(event(box.right+(mode==='scale'?60:0),box.bottom+(mode==='rotate'?60:30),pid));endAssetTransformPointer(event(box.right,box.bottom,pid),true);return snapshot()};const before=snapshot(),undo=undoStack.length,rev=_sessionAutosaveQueuedRevision,scaled=run('scale',911),rotated=run('rotate',912);return{before,scaled,rotated,undoBefore:undo,undoAfter:undoStack.length,revBefore:rev,revAfter:_sessionAutosaveQueuedRevision,transform:assetTransformDragState,mode:assetTransformMode}},String(id));
  expect(cancelledTransforms.scaled).toEqual(cancelledTransforms.before); expect(cancelledTransforms.rotated).toEqual(cancelledTransforms.before); expect(cancelledTransforms).toMatchObject({undoAfter:cancelledTransforms.undoBefore,revAfter:cancelledTransforms.revBefore,transform:null,mode:'idle'});

  // Movimento parcial cancelado percorre os listeners reais e restaura o objeto canônico atual.
  const cancelledMove=await page.evaluate(({id,x,y})=>{const snapshot=()=>serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),before=snapshot(),undo=undoStack.length,rev=_sessionAutosaveQueuedRevision,target=document.elementFromPoint(x,y),init={bubbles:true,clientX:x,clientY:y,pointerId:913,pointerType:'touch',isPrimary:true};target.dispatchEvent(new PointerEvent('pointerdown',init));target.dispatchEvent(new PointerEvent('pointermove',{...init,clientX:x+48,clientY:y+32}));target.dispatchEvent(new PointerEvent('pointercancel',{...init,clientX:x+48,clientY:y+32}));return{before,after:snapshot(),undoBefore:undo,undoAfter:undoStack.length,revBefore:rev,revAfter:_sessionAutosaveQueuedRevision,move:assetDragState,transform:assetTransformDragState,mode:assetTransformMode}}, {id:String(id),x:textPoint.x,y:textPoint.y});
  expect(cancelledMove.after).toEqual(cancelledMove.before); expect(cancelledMove).toMatchObject({undoAfter:cancelledMove.undoBefore,revAfter:cancelledMove.revBefore,move:null,transform:null,mode:'idle'});

  // O botão público da toolbar abre o editor; Cancelar não cria Undo/autosave nem persiste draft.
  const cancelBefore=await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision,checkpoint:buildProjectData(true),canonical:serializeProjectAsset(assets.find(a=>String(a.id)===String(selectedAssetId)),0,false)}));
  await page.locator('#tbAssetReplace').click(); await expect(page.locator('#textCreationSheet')).toHaveClass(/open/);
  await expect(page.locator('#textCreationInput')).toHaveValue('Linha 1\nLinha 2');
  await page.locator('#textCreationInput').fill('Rascunho cancelado'); await page.getByRole('tab',{name:'Fonte',exact:true}).click(); await page.getByRole('button',{name:'Fonte Mono',exact:true}).click();
  const draftIsolation=await page.evaluate(id=>({saved:buildProjectData(true).assets.find(a=>String(a.id)===id),snapshot:renderSessionSnapshot?.textAssets?.find(a=>String(a.id)===id)||null,canonical:serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false)}),String(id));
  expect(draftIsolation.saved).toEqual(cancelBefore.canonical); expect(draftIsolation.canonical).toEqual(cancelBefore.canonical); expect(draftIsolation.snapshot?.text).not.toBe('Rascunho cancelado');
  await page.getByRole('button',{name:'Cancelar',exact:true}).click();
  expect(await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision}))).toEqual({undo:cancelBefore.undo,rev:cancelBefore.rev});
  expect(await page.evaluate(id=>serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),String(id))).toEqual(cancelBefore.canonical);

  // Pointercancel nunca conta como tap concluído; um único tap posterior mantém o editor fechado.
  await page.evaluate(({x,y})=>{const target=document.elementFromPoint(x,y);target.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:x,clientY:y,pointerId:901,pointerType:'touch',isPrimary:true}));target.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,clientX:x,clientY:y,pointerId:901,pointerType:'touch',isPrimary:true}));},{x:textPoint.x,y:textPoint.y});
  await page.touchscreen.tap(textPoint.x,textPoint.y); await expect(page.locator('#textCreationSheet')).not.toHaveClass(/open/);
  expect(await page.evaluate(()=>({drag:assetDragState,tap:lastCompletedTextTap}))).toMatchObject({drag:null});

  // Dois taps reais abrem texto; drag, imagem e vazio não abrem.
  await page.waitForTimeout(380); await page.touchscreen.tap(textPoint.x,textPoint.y); await page.waitForTimeout(60); await page.touchscreen.tap(textPoint.x,textPoint.y);
  await expect(page.locator('#textCreationSheet')).toHaveClass(/open/); expect(await page.evaluate(()=>textEditorOpenSource)).toBe('double-tap'); await page.getByRole('button',{name:'Cancelar',exact:true}).click();
  await page.mouse.move(textPoint.x,textPoint.y); await page.mouse.down(); await page.mouse.move(textPoint.x+45,textPoint.y+30,{steps:4}); await page.mouse.up(); await expect(page.locator('#textCreationSheet')).not.toHaveClass(/open/);
  const imagePoint=await page.evaluate(()=>{computeEditorTransform();const images=assets.filter(a=>a?.type==='image'&&a.visible!==false).sort((a,b)=>(b.zIndex||0)-(a.zIndex||0));for(const image of images){const r=resolveAssetStageVisualGeometry(image).visualRect;for(let gy=1;gy<10;gy++)for(let gx=1;gx<10;gx++){const wx=r.x+r.w*gx/10,wy=r.y+r.h*gy/10,hit=hitTestAssetAtWorld(wx,wy);if(hit?.type==='image'&&String(hit.id)===String(image.id)){const p=editorWorldToStage(wx,wy,0,0),sr=stageContent.getBoundingClientRect();return{x:sr.left+p.x*editorZoomScale,y:sr.top+p.y*editorZoomScale,id:String(image.id)}}}}throw new Error('nenhum ponto de imagem livre de Text Assets encontrado')});
  await page.touchscreen.tap(imagePoint.x,imagePoint.y); await page.waitForTimeout(60); await page.touchscreen.tap(imagePoint.x,imagePoint.y); await expect(page.locator('#textCreationSheet')).not.toHaveClass(/open/); expect(await page.evaluate(()=>String(selectedAssetId))).toBe(imagePoint.id); await expect(page.locator('#tbAssetReplace .tb-lbl')).toHaveText('Trocar');
  const area=await page.locator('#imageArea').boundingBox(); await page.touchscreen.tap(area.x+4,area.y+4); await page.waitForTimeout(60); await page.touchscreen.tap(area.x+4,area.y+4); await expect(page.locator('#textCreationSheet')).not.toHaveClass(/open/);
  await page.evaluate(()=>setEditorMode('camera','e8y-camera-regression')); await page.locator('#stage').dblclick({position:{x:20,y:20}}); expect(await page.evaluate(()=>pointModeMenuVisible)).toBe(true); await page.evaluate(()=>{closePointModeMenu();setEditorMode('assets','e8y-edit')});

  // O drag anterior tem histórico próprio; Undo tipográfico deve preservar sua geometria.
  const postDrag=await page.evaluate(id=>({canonical:serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),undo:undoStack.length}),String(id));
  expect(postDrag.canonical.worldX===cancelBefore.canonical.worldX&&postDrag.canonical.worldY===cancelBefore.canonical.worldY).toBe(false);

  // Re-seleciona publicamente e confirma uma sessão como exatamente um Undo/revisão.
  const movedTextBox=await page.locator(`.world-text-asset[data-asset-id="${id}"]`).boundingBox(); await page.touchscreen.tap(movedTextBox.x+movedTextBox.width/2,movedTextBox.y+movedTextBox.height/2); await page.locator('#tbAssetReplace').click();
  const commitBefore=await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision,count:assets.length}));
  await page.locator('#textCreationInput').fill('Editado\ncom Enter'); await page.getByRole('tab',{name:'Fonte',exact:true}).click(); await page.getByRole('button',{name:'Fonte Serifada',exact:true}).click(); await page.getByRole('tab',{name:'Cor do texto',exact:true}).click(); await page.locator('#textCreationColor').evaluate(el=>{el.value='#3366ff';el.dispatchEvent(new Event('input',{bubbles:true}))});
  await page.getByRole('tab',{name:'Estilo',exact:true}).click(); await page.getByRole('button',{name:'Estilo Negrito + itálico',exact:true}).click(); await page.getByRole('tab',{name:'Alinhamento',exact:true}).click(); await page.getByRole('button',{name:'Alinhar Direita',exact:true}).click(); await page.getByRole('tab',{name:'Fundo da caixa',exact:true}).click(); await enableTextBoxColor(page,'#112233'); await page.locator('#textBoxBackgroundOpacity').fill('65');
  const blockedBefore=await page.evaluate(()=>({zoom:editorZoomScale,panX:editorPanX,panY:editorPanY,frames:structuredClone(frames.slice(0,frameCount)),world:structuredClone(projectWorld)}));
  await page.touchscreen.tap(10,10); await page.touchscreen.tap(40,40); const blockedAfter=await page.evaluate(()=>({zoom:editorZoomScale,panX:editorPanX,panY:editorPanY,frames:structuredClone(frames.slice(0,frameCount)),world:structuredClone(projectWorld)})); expect(blockedAfter).toEqual(blockedBefore); await expect(page.locator('#textCreationSheet')).toHaveClass(/open/);
  await page.screenshot({path:testInfo.outputPath('e8z-text-editor-390x797.png')}); await page.getByRole('button',{name:'Confirmar',exact:true}).click();
  const committed=await page.evaluate(id=>({asset:serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),id:selectedAssetId,count:assets.length,undo:undoStack.length,rev:_sessionAutosaveQueuedRevision}),String(id));
  expect(committed).toMatchObject({id,count:commitBefore.count,undo:commitBefore.undo+1,rev:commitBefore.rev+1,asset:{id:String(id),text:'Editado\ncom Enter',color:'#3366ff',fontKey:'serif',fontWeight:700,fontStyle:'italic',textAlign:'right',boxStyle:'block',boxBackgroundEnabled:true,boxBackgroundColor:'#112233',boxBackgroundOpacity:.65,boxPaddingXEm:.5,boxPaddingYEm:.3}});
  await page.waitForTimeout(800); await page.evaluate(async()=>{while(_sessionAutosaveActiveWrites.size)await Promise.all([..._sessionAutosaveActiveWrites])});
  const committedCheckpoint=await page.evaluate(async id=>{const cp=await readSessionCheckpoint();return JSON.parse(cp.payload).assets.find(a=>String(a.id)===id)},String(id)); expect(committedCheckpoint).toMatchObject(committed.asset);
  const undoRevision=await page.evaluate(()=>_sessionAutosaveQueuedRevision); await page.evaluate(()=>undo()); expect(await page.evaluate(()=>_sessionAutosaveQueuedRevision)).toBe(undoRevision+1); expect(await page.evaluate(id=>serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),String(id))).toEqual(postDrag.canonical);
  await page.waitForTimeout(800); await page.evaluate(async()=>{while(_sessionAutosaveActiveWrites.size)await Promise.all([..._sessionAutosaveActiveWrites]);window.__e8yCheckpointUndo=structuredClone(await readSessionCheckpoint())}); const undoneCheckpoint=await page.evaluate(id=>JSON.parse(window.__e8yCheckpointUndo.payload).assets.find(a=>String(a.id)===id),String(id)); expect(undoneCheckpoint).toMatchObject(postDrag.canonical);
  const redoRevision=await page.evaluate(()=>_sessionAutosaveQueuedRevision); await page.evaluate(()=>redo()); expect(await page.evaluate(()=>_sessionAutosaveQueuedRevision)).toBe(redoRevision+1); expect(await page.evaluate(id=>serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),String(id))).toEqual(committed.asset);
  await page.waitForTimeout(800); await page.evaluate(async()=>{while(_sessionAutosaveActiveWrites.size)await Promise.all([..._sessionAutosaveActiveWrites]);window.__e8yCheckpointRedo=structuredClone(await readSessionCheckpoint())}); const redoneCheckpoint=await page.evaluate(id=>JSON.parse(window.__e8yCheckpointRedo.payload).assets.find(a=>String(a.id)===id),String(id)); expect(redoneCheckpoint).toMatchObject(committed.asset);
  const restoredUndo=await page.evaluate(async()=>await restoreLastSessionAutosave(window.__e8yCheckpointUndo)); expect(restoredUndo).toBe(true); expect(await page.evaluate(id=>serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),String(id))).toEqual(postDrag.canonical);
  const restoredRedo=await page.evaluate(async()=>await restoreLastSessionAutosave(window.__e8yCheckpointRedo)); expect(restoredRedo).toBe(true); expect(await page.evaluate(id=>serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),String(id))).toEqual(committed.asset);

  // Session Restore volta ao Modo Câmera e limpa seleção; reentra e seleciona pelo fluxo público.
  await page.locator('#modeAssetsBtn').click(); await expect(page.locator('body')).toHaveClass(/editor-assets/); await expect(page.locator('#modeAssetsBtn')).toHaveClass(/active/);
  expect(await page.evaluate(id=>!!assets.find(a=>String(a.id)===id&&a.type==='text'),String(id))).toBe(true);
  const finalTextBox=await page.locator(`.world-text-asset[data-asset-id="${id}"]`).boundingBox(); expect(finalTextBox).toBeTruthy(); await page.touchscreen.tap(finalTextBox.x+finalTextBox.width/2,finalTextBox.y+finalTextBox.height/2);
  expect(await page.evaluate(()=>String(selectedAssetId))).toBe(String(id)); await expect(page.locator('#tbAssetReplace')).toBeVisible(); await expect(page.locator('#tbAssetReplace')).not.toHaveClass(/asset-tool-disabled/); await expect(page.locator('#tbAssetReplace .tb-lbl')).toHaveText('Editar');

  // Concluir sem alteração pelo botão público não cria histórico nem revisão.
  await page.locator('#tbAssetReplace').click(); await expect(page.locator('#textCreationSheet')).toHaveClass(/open/);
  const noChange=await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision})); await page.getByRole('button',{name:'Confirmar',exact:true}).click(); expect(await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision}))).toEqual(noChange);

  // Escala pública usa baseline de conteúdo: painel não salta, steps são exatos e Reset recompõe o retângulo externo uma única vez.
  // v8z4b32E9C — a escala ARITMÉTICA exata de boxWidth (× fator) é contrato do modo de LARGURA FIXA. O modo auto (padrão desde a E9C)
  // deriva boxWidth de measureText, que não é perfeitamente linear na fontSize; a cobertura de auto-largura vive no gate E9C. Fixa a
  // largura sem histórico para validar aqui o contrato aritmético do modo fixo.
  await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id);a.boxWidthMode='fixed';measureTextAsset(a);renderProjectWorldExtraImages();renderAssetSelectionOverlay();},String(id));
  const scale100=await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id),m=measureTextAsset(a);return{cx:a.worldX+a.worldW/2,cy:a.worldY+a.worldH/2,pct:getAssetContextScalePercent(a),boxWidth:a.boxWidth,worldW:a.worldW,paddingX:m.paddingX}},String(id));
  await page.locator('#tbAssetScale').click(); await expect(page.locator('#assetContextValue')).toHaveText('100%'); expect(await page.evaluate(id=>serializeProjectAsset(assets.find(a=>String(a.id)===id),0,false),String(id))).toMatchObject({boxWidth:scale100.boxWidth,worldW:scale100.worldW});
  await page.locator('#assetContextScalePlus').click(); await expect(page.locator('#assetContextValue')).toHaveText('105%'); let scaled=await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id),m=measureTextAsset(a);return{pct:getAssetContextScalePercent(a),cx:a.worldX+a.worldW/2,cy:a.worldY+a.worldH/2,boxWidth:a.boxWidth,worldW:a.worldW,paddingX:m.paddingX}},String(id)); expect(scaled.pct).toBeCloseTo(105);expect(scaled.boxWidth).toBeCloseTo(scale100.boxWidth*1.05);expect(scaled.worldW).toBeCloseTo(scaled.boxWidth+2*scaled.paddingX);expect(scaled.cx).toBeCloseTo(scale100.cx);expect(scaled.cy).toBeCloseTo(scale100.cy);
  await page.locator('#assetContextScaleMinus').click(); await expect(page.locator('#assetContextValue')).toHaveText('100%'); await page.locator('#assetContextSlider').fill('135'); await page.locator('#assetContextSlider').dispatchEvent('change'); await expect(page.locator('#assetContextValue')).toHaveText('135%'); await page.locator('#assetContextReset').click(); await expect(page.locator('#assetContextValue')).toHaveText('100%'); scaled=await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id),m=measureTextAsset(a);return{pct:getAssetContextScalePercent(a),cx:a.worldX+a.worldW/2,cy:a.worldY+a.worldH/2,boxWidth:a.boxWidth,worldW:a.worldW,paddingX:m.paddingX}},String(id));expect(scaled).toMatchObject({pct:100,cx:scale100.cx,cy:scale100.cy,boxWidth:scale100.boxWidth,worldW:scale100.worldW,paddingX:scale100.paddingX}); await page.getByRole('button',{name:'Voltar'}).click();
  const corner=page.locator('.asset-corner-handle[data-asset-corner="br"]'),cornerBox=await corner.boundingBox();await page.mouse.move(cornerBox.x+cornerBox.width/2,cornerBox.y+cornerBox.height/2);await page.mouse.down();await page.mouse.move(cornerBox.x+70,cornerBox.y+70,{steps:5});await page.mouse.up();const cornerScaled=await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id),m=measureTextAsset(a);return{cx:a.worldX+a.worldW/2,cy:a.worldY+a.worldH/2,worldW:a.worldW,boxWidth:a.boxWidth,paddingX:m.paddingX}},String(id));expect(cornerScaled.worldW).toBeCloseTo(cornerScaled.boxWidth+2*cornerScaled.paddingX);expect(cornerScaled.cx).toBeCloseTo(scale100.cx);expect(cornerScaled.cy).toBeCloseTo(scale100.cy);
  await page.locator('#tbAssetRotate').click();await page.locator('#assetContextSlider').fill('18');await page.locator('#assetContextSlider').dispatchEvent('change');await expect(page.locator('#assetContextValue')).toHaveText('18°');expect(await page.evaluate(id=>assets.find(a=>String(a.id)===id).rotation,String(id))).toBe(18);await page.getByRole('button',{name:'Voltar'}).click();await page.evaluate(()=>undo());await page.evaluate(()=>undo());

  // Alterações exclusivas da caixa entram no fingerprint e geram checkpoints reais em Undo/Redo.
  const waitCheckpoint=async()=>{await page.waitForTimeout(800);await page.evaluate(async()=>{while(_sessionAutosaveActiveWrites.size)await Promise.all([..._sessionAutosaveActiveWrites])})};
  const stableBeforeBoxOnly=await page.evaluate(id=>{const a=serializeProjectAsset(assets.find(x=>String(x.id)===id),0,false);return{text:a.text,worldX:a.worldX,worldY:a.worldY,worldW:a.worldW,worldH:a.worldH,frames:structuredClone(frames.slice(0,frameCount)),world:structuredClone(projectWorld),layers:assets.map(x=>[String(x.id),x.zIndex,x.layerSequence])}},String(id));
  await page.locator('#tbAssetReplace').click(); await page.getByRole('tab',{name:'Fundo da caixa',exact:true}).click(); await page.locator('#textBoxBackgroundColor').evaluate(el=>{el.value='#445566';el.dispatchEvent(new Event('input',{bubbles:true}))}); await page.getByRole('button',{name:'Confirmar',exact:true}).click();
  const colorRevision=await page.evaluate(()=>_sessionAutosaveQueuedRevision); await page.evaluate(()=>undo()); expect(await page.evaluate(()=>_sessionAutosaveQueuedRevision)).toBe(colorRevision+1); await waitCheckpoint(); expect(await page.evaluate(async id=>JSON.parse((await readSessionCheckpoint()).payload).assets.find(a=>String(a.id)===id).boxBackgroundColor,String(id))).toBe('#112233');
  const colorRedoRevision=await page.evaluate(()=>_sessionAutosaveQueuedRevision); await page.evaluate(()=>redo()); expect(await page.evaluate(()=>_sessionAutosaveQueuedRevision)).toBe(colorRedoRevision+1); await waitCheckpoint(); expect(await page.evaluate(async id=>JSON.parse((await readSessionCheckpoint()).payload).assets.find(a=>String(a.id)===id).boxBackgroundColor,String(id))).toBe('#445566');
  await page.locator('#tbAssetReplace').click(); await page.getByRole('tab',{name:'Fundo da caixa',exact:true}).click(); await page.locator('#textBoxBackgroundOpacity').fill('35'); await expect(page.locator('#textBoxBackgroundOpacityValue')).toHaveText('35%'); await page.getByRole('button',{name:'Confirmar',exact:true}).click();
  const opacityRevision=await page.evaluate(()=>_sessionAutosaveQueuedRevision); await page.evaluate(()=>undo()); expect(await page.evaluate(()=>_sessionAutosaveQueuedRevision)).toBe(opacityRevision+1); await waitCheckpoint(); expect(await page.evaluate(async id=>JSON.parse((await readSessionCheckpoint()).payload).assets.find(a=>String(a.id)===id).boxBackgroundOpacity,String(id))).toBe(.65);
  const opacityRedoRevision=await page.evaluate(()=>_sessionAutosaveQueuedRevision); await page.evaluate(()=>redo()); expect(await page.evaluate(()=>_sessionAutosaveQueuedRevision)).toBe(opacityRedoRevision+1); await waitCheckpoint(); expect(await page.evaluate(async id=>JSON.parse((await readSessionCheckpoint()).payload).assets.find(a=>String(a.id)===id).boxBackgroundOpacity,String(id))).toBe(.35);
  const stableAfterBoxOnly=await page.evaluate(id=>{const a=serializeProjectAsset(assets.find(x=>String(x.id)===id),0,false);return{text:a.text,worldX:a.worldX,worldY:a.worldY,worldW:a.worldW,worldH:a.worldH,frames:structuredClone(frames.slice(0,frameCount)),world:structuredClone(projectWorld),layers:assets.map(x=>[String(x.id),x.zIndex,x.layerSequence])}},String(id)); expect(stableAfterBoxOnly).toEqual(stableBeforeBoxOnly);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=390)).toBe(true);
});

test('E9A — profundidade de Text Asset persiste no modelo, redraw, histórico e payload', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 797 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  const proModal = page.locator('#proModal');
  if (await proModal.isVisible()) {
    await page.getByRole('button', { name: 'Dispensar', exact: true }).click();
    await expect(proModal).toBeHidden();
    await expect(proModal).toHaveAttribute('aria-hidden', 'true');
  }
  await page.locator('#modeAssetsBtn').click();
  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill('Profundidade E9A');
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  const textId = await page.evaluate(() => String(assets.find(asset => asset?.type === 'text').id));
  const baseline = await page.evaluate(id => {
    const current = assets.find(candidate => String(candidate?.id) === id);
    return { zIndex: current.zIndex, frames: structuredClone(frames.slice(0, frameCount)), curves: JSON.stringify({ ctrlPts, curvesV2 }), world: structuredClone(projectWorld), undo: undoStack.length, revision: _sessionAutosaveQueuedRevision };
  }, textId);

  await page.locator('#tbAssetDepth').click();
  await page.locator('#assetContextSlider').fill('42');
  await page.locator('#assetContextSlider').dispatchEvent('change');
  await expect(page.locator('#assetContextValue')).toHaveText('42');
  const positive = await page.evaluate(id => {
    const current = assets.find(candidate => String(candidate?.id) === id);
    measureTextAsset(current); renderProjectWorldExtraImages(); renderAssetSelectionOverlay(); syncAssetContextPanel();
    const refreshed = assets.find(candidate => String(candidate?.id) === id);
    return { depth: refreshed.depth, serialized: serializeProjectAsset(refreshed, 0, false).depth, zIndex: refreshed.zIndex, panel: Number(document.getElementById('assetContextSlider').value), undo: undoStack.length, revision: _sessionAutosaveQueuedRevision, frames: structuredClone(frames.slice(0, frameCount)), curves: JSON.stringify({ ctrlPts, curvesV2 }), world: structuredClone(projectWorld) };
  }, textId);
  expect(positive).toMatchObject({ depth: 42, serialized: 42, panel: 42, zIndex: baseline.zIndex, undo: baseline.undo + 1, revision: baseline.revision + 1, frames: baseline.frames, curves: baseline.curves, world: baseline.world });

  await page.evaluate(() => undo());
  expect(await page.evaluate(id => assets.find(candidate => String(candidate?.id) === id).depth, textId)).toBe(0);
  await page.evaluate(() => redo());
  expect(await page.evaluate(id => assets.find(candidate => String(candidate?.id) === id).depth, textId)).toBe(42);
  await page.locator('#assetContextSlider').fill('-37');
  await page.locator('#assetContextSlider').dispatchEvent('change');
  await expect(page.locator('#assetContextValue')).toHaveText('-37');
  expect(await page.evaluate(id => { const current = assets.find(candidate => String(candidate?.id) === id); return { depth: current.depth, serialized: serializeProjectAsset(current, 0, false).depth, zIndex: current.zIndex }; }, textId)).toEqual({ depth: -37, serialized: -37, zIndex: baseline.zIndex });

  const roundTrip = await page.evaluate(async id => {
    const payload = buildProjectData(true), saved = payload.assets.find(candidate => String(candidate?.id) === id);
    await new Promise((resolve, reject) => applyProjectData(payload, { origin: 'manual-load', onApplied: ok => ok ? resolve() : reject(new Error('Manual Load E9A falhou')) }));
    const loaded = assets.find(candidate => String(candidate?.id) === id);
    const checkpointPayload = JSON.stringify(buildCompleteSessionProjectData());
    const checkpoint = { schema: SESSION_AUTOSAVE_SCHEMA, complete: true, revision: 1001, payload: checkpointPayload, checksum: sessionPayloadChecksum(checkpointPayload), savedAt: Date.now() };
    const restored = await restoreLastSessionAutosave(checkpoint);
    const session = assets.find(candidate => String(candidate?.id) === id);
    return { savedDepth: saved.depth, loadedDepth: loaded.depth, restored, sessionDepth: session.depth };
  }, textId);
  expect(roundTrip).toEqual({ savedDepth: -37, loadedDepth: -37, restored: true, sessionDepth: -37 });

  const finiteRules = await page.evaluate(id => {
    const current = assets.find(candidate => String(candidate?.id) === id), image = assets.find(candidate => candidate?.type === 'image');
    const normalize = value => { current.depth = value; normalizeTextAsset(current); return current.depth; };
    const imageDepth = image.depth;
    return { positive: normalize(17.5), negative: normalize(-8), missing: normalize(undefined), nan: normalize(NaN), infinity: normalize(Infinity), negativeInfinity: normalize(-Infinity), invalid: normalize('invalid'), imageUnchanged: image.depth === imageDepth };
  }, textId);
  expect(finiteRules).toEqual({ positive: 17.5, negative: -8, missing: 0, nan: 0, infinity: 0, negativeInfinity: 0, invalid: 0, imageUnchanged: true });
});

test('E9B — Text Asset acompanha seleção na paralaxe do Stage', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 390, height: 797 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  const proModal = page.locator('#proModal');
  if (await proModal.isVisible()) await page.getByRole('button', { name: 'Dispensar', exact: true }).click();
  await page.locator('#modeAssetsBtn').click();
  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill('R');
  await page.getByRole('tab', { name: 'Fundo da caixa', exact: true }).click();
  await enableTextBoxColor(page, '#000000');
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  const textId = await page.evaluate(() => String(getSelectedAsset().id));
  const autosaveState = () => page.evaluate(() => ({ queued:_sessionAutosaveQueuedRevision, committed:sessionAutosaveRevision, timer:!!_sessionAutosaveTimer, active:_sessionAutosaveActiveWrites.size, inFlight:_sessionAutosaveWriteInFlight }));
  const waitAutosave = async (expectedRevision, expectedDepth) => {
    await expect.poll(async () => (await autosaveState()).committed, {timeout:30_000}).toBe(expectedRevision);
    await expect.poll(async () => { const state=await autosaveState(); return !state.timer&&!state.active&&!state.inFlight; }, {timeout:30_000}).toBe(true);
    const checkpoint=await page.evaluate(async id=>{const stored=await readSessionCheckpoint(),data=stored&&JSON.parse(stored.payload),asset=data?.assets?.find(candidate=>String(candidate.id)===id);return{revision:stored?.revision,depth:asset?.depth}},textId);
    expect(checkpoint).toEqual({revision:expectedRevision,depth:expectedDepth});
  };
  const rects = async () => page.evaluate(id => {
    const asset = assets.find(candidate => String(candidate.id) === id);
    const text = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(id)}"]`);
    const selection = document.getElementById('assetSelectOutline');
    const read = element => { const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y, w: rect.width, h: rect.height }; };
    const selectionStyle=getComputedStyle(selection),handles=Object.fromEntries([...selection.querySelectorAll('.asset-corner-handle')].map(element => { const rect=element.getBoundingClientRect(),style=getComputedStyle(element); return [element.dataset.assetCorner,{x:rect.x+rect.width/2,y:rect.y+rect.height/2,left:parseFloat(style.left),top:parseFloat(style.top)}]; }));
    return { id:String(asset.id), canonical: { worldX:asset.worldX, worldY:asset.worldY, worldW:asset.worldW, worldH:asset.worldH, boxWidth:asset.boxWidth, fontSize:asset.fontSize, rotation:asset.rotation, zIndex:asset.zIndex, frames:JSON.stringify(frames.slice(0,frameCount)), curves:JSON.stringify({ctrlPts,curvesV2}), world:JSON.stringify(projectWorld) }, depth:asset.depth, text:read(text), selection:read(selection), selectionBorder:{left:parseFloat(selectionStyle.borderLeftWidth),top:parseFloat(selectionStyle.borderTopWidth)},zoom:editorZoomScale, handles, background:getComputedStyle(text).backgroundColor, undo:undoStack.length, queued:_sessionAutosaveQueuedRevision, committed:sessionAutosaveRevision };
  }, textId);
  const expectParity = snapshot => {
    const close=(a,b,tolerance=1)=>expect(Math.abs(a-b)).toBeLessThan(tolerance);
    close(snapshot.text.x,snapshot.selection.x); close(snapshot.text.y,snapshot.selection.y); close(snapshot.text.w,snapshot.selection.w); close(snapshot.text.h,snapshot.selection.h);
    expect(Object.keys(snapshot.handles).sort()).toEqual(['bl','br','tl','tr']);
    for(const corner of Object.keys(snapshot.handles)){const handle=snapshot.handles[corner],expectedX=snapshot.selection.x+(snapshot.selectionBorder.left+handle.left)*snapshot.zoom,expectedY=snapshot.selection.y+(snapshot.selectionBorder.top+handle.top)*snapshot.zoom;close(handle.x,expectedX,.75);close(handle.y,expectedY,.75);}
    const offsets={tl:{x:snapshot.handles.tl.x-snapshot.selection.x,y:snapshot.handles.tl.y-snapshot.selection.y},tr:{x:snapshot.handles.tr.x-(snapshot.selection.x+snapshot.selection.w),y:snapshot.handles.tr.y-snapshot.selection.y},bl:{x:snapshot.handles.bl.x-snapshot.selection.x,y:snapshot.handles.bl.y-(snapshot.selection.y+snapshot.selection.h)},br:{x:snapshot.handles.br.x-(snapshot.selection.x+snapshot.selection.w),y:snapshot.handles.br.y-(snapshot.selection.y+snapshot.selection.h)}};
    expect(offsets.tl.x).toBeLessThan(0);expect(offsets.tl.y).toBeLessThan(0);expect(offsets.tr.x).toBeGreaterThan(0);expect(offsets.tr.y).toBeLessThan(0);expect(offsets.bl.x).toBeLessThan(0);expect(offsets.bl.y).toBeGreaterThan(0);expect(offsets.br.x).toBeGreaterThan(0);expect(offsets.br.y).toBeGreaterThan(0);
    expect(snapshot.background).not.toBe('rgba(0, 0, 0, 0)');
  };
  const expectVisualDelta = (from,to) => { const dx=to.text.x-from.text.x,dy=to.text.y-from.text.y; expect(Math.hypot(dx,dy)).toBeGreaterThan(.5); for(const corner of Object.keys(to.handles)){expect(to.handles[corner].x-from.handles[corner].x).toBeCloseTo(dx,1);expect(to.handles[corner].y-from.handles[corner].y).toBeCloseTo(dy,1);} };
  const setDepth = async (value, previous) => {
    await page.locator('#assetContextSlider').fill(String(value));
    await page.locator('#assetContextSlider').dispatchEvent('change');
    await expect(page.locator('#assetContextValue')).toHaveText(String(value));
    const queued=await page.evaluate(()=>_sessionAutosaveQueuedRevision); expect(queued).toBe(previous.queued+1);
    await waitAutosave(queued,value);
  };
  const creationQueued=await page.evaluate(()=>_sessionAutosaveQueuedRevision); await waitAutosave(creationQueued,0);
  const before = await rects();
  expect(before.depth).toBe(0); expectParity(before);
  await page.locator('#tbAssetDepth').click();
  await setDepth(42,before);
  const after = await rects();
  expect(after.depth).toBe(42);
  expect(after.canonical).toEqual(before.canonical);
  expect(after.undo).toBe(before.undo+1); expect(after.queued).toBe(before.queued+1); expect(after.committed).toBe(before.committed+1);
  expectVisualDelta(before,after);
  expectParity(after);
  const diagnostics=await page.evaluate(()=>Object.fromEntries(buildDiagnosticsText().split('\n').filter(line=>line.includes(': ')).map(line=>{const i=line.indexOf(': ');return[line.slice(0,i),line.slice(i+2)]})));
  expect(diagnostics).toMatchObject({selectedAssetStageDomKind:'text',assetImageUsesResolvedParallaxGeometry:'n/d',textAssetStageUsesResolvedParallaxGeometry:'true',textAssetDomSelectionParityOk:'true',textAssetMovedWithDepthOnStage:'true',textAssetCanonicalGeometryUnchangedByParallax:'true'});
  const diagnosticTextRect=JSON.parse(diagnostics.selectedTextAssetDomRect);expect(Number.isFinite(diagnosticTextRect.h)).toBe(true);expect(diagnosticTextRect.h).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Voltar'}).click(); await page.locator('#tbAssetDepth').click();
  await expect(page.locator('#assetContextSlider')).toHaveValue('42');
  await setDepth(-37,after);
  const negative=await rects(); expect(negative.depth).toBe(-37); expect(negative.canonical).toEqual(before.canonical); expect(negative.undo).toBe(after.undo+1); expect(negative.queued).toBe(after.queued+1); expect(negative.committed).toBe(after.committed+1); expectParity(negative);
  expectVisualDelta(after,negative);
  await page.getByRole('button',{name:'Voltar'}).click(); await page.locator('#tbAssetDepth').click(); await expect(page.locator('#assetContextSlider')).toHaveValue('-37'); await page.getByRole('button',{name:'Voltar'}).click();

  // O hit-test público acompanha a área deslocada e abandona a faixa exclusiva da posição antiga.
  const exclusive=(inside,outside)=>{if(inside.x<outside.x)return{x:(inside.x+outside.x)/2,y:inside.y+inside.h/2};if(inside.x+inside.w>outside.x+outside.w)return{x:(inside.x+inside.w+outside.x+outside.w)/2,y:inside.y+inside.h/2};if(inside.y<outside.y)return{x:inside.x+inside.w/2,y:(inside.y+outside.y)/2};if(inside.y+inside.h>outside.y+outside.h)return{x:inside.x+inside.w/2,y:(inside.y+inside.h+outside.y+outside.h)/2};};
  const shiftedPoint=exclusive(negative.text,before.text),oldPoint=exclusive(before.text,negative.text); expect(shiftedPoint).toBeTruthy(); expect(oldPoint).toBeTruthy();
  const imagePoint=await page.evaluate(id=>{const image=[...document.querySelectorAll('.world-extra-img')].find(el=>el.dataset.assetId!==id),r=image.getBoundingClientRect();return{x:r.left+4,y:r.top+4}},textId);
  await page.touchscreen.tap(imagePoint.x,imagePoint.y); expect(await page.evaluate(()=>getSelectedAsset()?.type)).toBe('image');
  await page.touchscreen.tap(shiftedPoint.x,shiftedPoint.y); expect(await page.evaluate(()=>String(selectedAssetId))).toBe(textId);
  await page.touchscreen.tap(imagePoint.x,imagePoint.y); await page.touchscreen.tap(oldPoint.x,oldPoint.y); expect(await page.evaluate(()=>String(selectedAssetId||''))).not.toBe(textId);
  await page.touchscreen.tap(shiftedPoint.x,shiftedPoint.y); expect(await page.evaluate(()=>String(selectedAssetId))).toBe(textId); expectParity(await rects());

  // Undo/Redo públicos restauram valor e geometria sem passos intermediários.
  const historyBeforeUndo=await rects(); await page.locator('#topBtnUndo').click(); await waitAutosave(historyBeforeUndo.queued+1,42); const undone=await rects(); expect(undone.depth).toBe(42); expectParity(undone); expect(undone.queued).toBe(historyBeforeUndo.queued+1);expect(undone.committed).toBe(historyBeforeUndo.committed+1);
  await page.locator('#topBtnRedo').click(); await waitAutosave(undone.queued+1,-37); const redone=await rects(); expect(redone.depth).toBe(-37); expectParity(redone); expect(redone.queued).toBe(undone.queued+1);expect(redone.committed).toBe(undone.committed+1);

  // Trocas públicas de seleção/modo/frame e zoom apenas recalculam o Stage.
  const navigationBaseline=await rects();
  await page.touchscreen.tap(imagePoint.x,imagePoint.y); await page.touchscreen.tap(shiftedPoint.x,shiftedPoint.y);
  await page.locator('#modeCameraBtn').click(); await page.locator('#modeAssetsBtn').click();
  const pills=page.locator('#pillsRow [data-frame-index]'); if(await pills.count()>1){await pills.nth(1).click();expectParity(await rects());await pills.nth(0).click();}
  await page.locator('#ezBtnPlus').click(); expectParity(await rects());
  await page.locator('#ezBtnPan').click(); const panBefore=await page.evaluate(()=>({x:editorPanX,y:editorPanY})); await panEditorViewport(page,.15,.12); const panAfter=await page.evaluate(()=>({x:editorPanX,y:editorPanY}));expect(panAfter).not.toEqual(panBefore);const panned=await rects();expectParity(panned);expect(panned.depth).toBe(-37);expect(panned.canonical).toEqual(navigationBaseline.canonical);
  const pannedImagePoint=await page.evaluate(id=>{const image=[...document.querySelectorAll('.world-extra-img')].find(el=>el.dataset.assetId!==id),r=image.getBoundingClientRect();return{x:r.left+4,y:r.top+4}},textId),pannedText=await page.locator(`.world-text-asset[data-asset-id="${textId}"]`).boundingBox();await page.locator('#ezBtnPan').click();await page.touchscreen.tap(pannedImagePoint.x,pannedImagePoint.y);await page.touchscreen.tap(pannedText.x+pannedText.width/2,pannedText.y+pannedText.height/2);expect(await page.evaluate(()=>String(selectedAssetId))).toBe(textId);
  await page.locator('#ezLabel').click();
  await page.evaluate(()=>{renderProjectWorldExtraImages();renderAssetSelectionOverlay()});
  const navigated=await rects(); expect(navigated.depth).toBe(-37); expect(navigated.canonical).toEqual(navigationBaseline.canonical); expect(navigated.undo).toBe(navigationBaseline.undo); expect(navigated.queued).toBe(navigationBaseline.queued); expect(navigated.committed).toBe(navigationBaseline.committed); expectParity(navigated); expect(await autosaveState()).toMatchObject({queued:navigationBaseline.queued,committed:navigationBaseline.committed,timer:false,active:0,inFlight:false});

  // Manual Save/Load real: download canônico, file input e inspeção intermediária antes do Restore.
  const downloadPromise=page.waitForEvent('download');await page.evaluate(()=>doSaveDirect(true,'e9b-text-parallax'));const download=await downloadPromise,savedPath=await download.path();expect(savedPath).toBeTruthy();
  await page.locator('#projectFileInput').setInputFiles(savedPath);await expect.poll(()=>page.evaluate(()=>loadSessionCompleted),{timeout:30_000}).toBe(true);expect(await page.evaluate(()=>lastLoadError)).toBe('');
  await page.locator('#modeAssetsBtn').click();let loadedText=await page.locator(`.world-text-asset[data-asset-id="${textId}"]`).boundingBox();await page.touchscreen.tap(loadedText.x+loadedText.width/2,loadedText.y+loadedText.height/2);const afterManualLoad=await rects();expect(afterManualLoad.depth).toBe(-37);expect(afterManualLoad.canonical).toEqual(navigationBaseline.canonical);expectParity(afterManualLoad);
  let postLoadDiagnostics=await page.evaluate(()=>buildDiagnosticsText());expect(postLoadDiagnostics).toContain('textAssetStageUsesResolvedParallaxGeometry: true');expect(postLoadDiagnostics).toContain('textAssetDomSelectionParityOk: true');expect(postLoadDiagnostics).toContain('textAssetMovedWithDepthOnStage: n/d');

  // Checkpoint IndexedDB real + reload + botão público Continuar.
  await page.evaluate(async()=>{scheduleSessionAutosave('e9b-session-restore',true);await flushSessionAutosave();while(_sessionAutosaveActiveWrites.size)await Promise.all([..._sessionAutosaveActiveWrites])});await expect.poll(()=>sessionCheckpointExists(page),{timeout:30_000}).toBe(true);
  await page.reload({waitUntil:'domcontentloaded'});await expect(page.getByRole('dialog',{name:'Continuar sessão anterior?'})).toBeVisible();await page.getByText('Continuar de onde parei',{exact:true}).click();await expect(page.locator('body')).toHaveClass(/mode-editor/,{timeout:30_000});await expect.poll(()=>page.evaluate(()=>sessionRestoreCompleted),{timeout:30_000}).toBe(true);
  expect(await page.evaluate(()=>({ok:sessionRestoreAppliedSuccessfully,partial:sessionRestoreNoPartialState}))).toEqual({ok:true,partial:true});if(await proModal.isVisible())await page.getByRole('button',{name:'Dispensar',exact:true}).click();await page.locator('#modeAssetsBtn').click();loadedText=await page.locator(`.world-text-asset[data-asset-id="${textId}"]`).boundingBox();await page.touchscreen.tap(loadedText.x+loadedText.width/2,loadedText.y+loadedText.height/2);const afterSession=await rects();expect(afterSession.id).toBe(textId);expect(afterSession.depth).toBe(-37);expect(afterSession.canonical).toEqual(navigationBaseline.canonical);expectParity(afterSession);
  postLoadDiagnostics=await page.evaluate(()=>buildDiagnosticsText());expect(postLoadDiagnostics).toContain('textAssetStageUsesResolvedParallaxGeometry: true');expect(postLoadDiagnostics).toContain('textAssetDomSelectionParityOk: true');expect(postLoadDiagnostics).toContain('textAssetMovedWithDepthOnStage: n/d');

  // Preview canônico preserva texto/fundo/depth e não leva overlays do editor.
  // v8z4b32E9E — desde a E9E o novo Text Asset nasce no centro da VISTA ATUAL (nesta
  // vista padrão, o centro da célula base), que pode não coincidir com a câmera do
  // frame 0. Como intersectsCamera é medido pelo retângulo CANÔNICO do texto contra a
  // câmera de t=0, posicionamos o texto no centro dessa câmera (frame 0) para tornar a
  // asserção de intersecção determinística, sem alterar depth, fundo ou a paridade já
  // verificada acima.
  await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id),f=frames[0];a.worldX=(f.x+f.w/2)-a.worldW/2;a.worldY=(f.y+f.h/2)-a.worldH/2;renderProjectWorldExtraImages();renderAssetSelectionOverlay();},textId);
  await page.evaluate(()=>startPreview());await expect(page.locator('#previewScreen')).toHaveClass(/show/,{timeout:30_000});await expect.poll(()=>page.evaluate(()=>previewLoadingHiddenAfterFirstFrame),{timeout:30_000}).toBe(true);
  const previewProof=await page.evaluate(id=>{if(animFrame)togglePreviewPlayback();const snapshot=renderSessionSnapshot?.textAssets?.find(a=>String(a.id)===id),audit=renderTransform.preview?.assets?.find(a=>String(a.id)===id),screen=document.getElementById('previewScreen'),overlay=document.getElementById('assetSelectOutline'),handles=document.querySelectorAll('.asset-corner-handle.show'),widthHandles=document.querySelectorAll('.text-width-handle.show');return{snapshot,audit,overlayInsidePreview:!!(overlay&&screen.contains(overlay)),handlesInsidePreview:[...handles].some(h=>screen.contains(h)),widthHandlesInsidePreview:[...widthHandles].some(h=>screen.contains(h)),loading:previewLoadingHiddenAfterFirstFrame}},textId);
  expect(previewProof.snapshot).toMatchObject({id:textId,depth:-37,boxBackgroundEnabled:true});expect(previewProof.audit).toMatchObject({id:textId,drawn:true,intersectsCamera:true});expect(previewProof).toMatchObject({overlayInsidePreview:false,handlesInsidePreview:false,widthHandlesInsidePreview:false,loading:true});await page.evaluate(()=>stopPreview());await expect(page.locator('body')).toHaveClass(/mode-editor/);
});

test('E9C — Text Asset auto-largura ao conteúdo, modo fixo e paridade sob depth', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 390, height: 797 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  const proModal = page.locator('#proModal');
  if (await proModal.isVisible()) await page.getByRole('button', { name: 'Dispensar', exact: true }).click();
  await page.locator('#modeAssetsBtn').click();

  // Largura natural (linha mais longa) medida com o MESMO ctx/fonte do asset.
  const naturalWidth = (id, text) => page.evaluate(({ id, text }) => {
    const a = assets.find(x => String(x.id) === id);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${a.fontStyle} ${a.fontWeight} ${a.fontSize}px ${a.fontFamily}`;
    return Math.max(...String(text).split('\n').map(line => ctx.measureText(line.replace(/\t/g, '    ')).width));
  }, { id, text });
  const geom = id => page.evaluate(id => {
    const a = assets.find(x => String(x.id) === id);
    const textEl = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(id)}"]`);
    const selection = document.getElementById('assetSelectOutline');
    const read = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
    return {
      mode: a.boxWidthMode, boxWidth: a.boxWidth, worldW: a.worldW, worldH: a.worldH, fontSize: a.fontSize, textBaseFontSize: a.textBaseFontSize,
      text: textEl ? read(textEl) : null, selection: selection && selection.style.display !== 'none' ? read(selection) : null,
    };
  }, id);
  const expectHugsSelection = g => {
    expect(g.text).toBeTruthy(); expect(g.selection).toBeTruthy();
    for (const k of ['x', 'y', 'w', 'h']) expect(Math.abs(g.text[k] - g.selection[k])).toBeLessThan(1.2);
  };

  // (a) Um único caractere NÃO gera caixa vazia: a largura abraça o glifo.
  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill('R');
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  const textId = await page.evaluate(() => String(getSelectedAsset().id));
  const defaultCreateWidth = await page.evaluate(() => { const b = projectWorld.baseStageW || stageW || 360; return Math.max(120, Math.min(b * 0.72, 320)); });
  let g = await geom(textId);
  expect(g.mode).toBe('auto');
  const rNatural = await naturalWidth(textId, 'R');
  expect(Math.abs(g.boxWidth - (rNatural + 1))).toBeLessThan(0.5);
  expect(g.boxWidth).toBeLessThan(defaultCreateWidth * 0.6); // não é mais uma caixa gigante e vazia
  expect(g.worldW).toBeLessThan(defaultCreateWidth * 0.6);
  expectHugsSelection(g);

  // (b) Múltiplas linhas de larguras diferentes: a caixa acompanha a MAIS LONGA.
  const multiline = 'R\nLinha bem mais larga que a primeira';
  await page.evaluate(id => startTextAssetEditing(assets.find(a => String(a.id) === id)), textId);
  await page.locator('#textCreationInput').fill(multiline);
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  g = await geom(textId);
  expect(g.mode).toBe('auto');
  const longest = await naturalWidth(textId, multiline);
  expect(Math.abs(g.boxWidth - (longest + 1))).toBeLessThan(0.5);
  const singleLineH = await page.evaluate(id => { const a = assets.find(x => String(x.id) === id); return a.fontSize * a.lineHeight; }, textId);
  expect(g.worldH).toBeGreaterThan(singleLineH * 1.8); // duas linhas contidas na mesma largura
  expectHugsSelection(g);
  const autoWorldH = g.worldH;

  // (c) Modo fixo (override manual): a E9G substituiu o slider pela side width handle
  // no Stage — arrastar a alça DIREITA para dentro reduz a largura e trava o modo.
  await page.evaluate(id => startTextAssetEditing(assets.find(a => String(a.id) === id)), textId);
  await page.getByRole('tab', { name: 'Largura da caixa', exact: true }).click();
  const widthBeforeFix = (await geom(textId)).boxWidth;
  await dragTextWidthHandleBy(page, 'right', -160);
  expect(await page.evaluate(() => pendingTextDraft.boxWidthMode)).toBe('fixed');
  await expect(page.locator('#textWidthAuto')).not.toHaveClass(/active/);
  const fixedDraftWidth = await page.evaluate(() => pendingTextDraft.boxWidth);
  expect(fixedDraftWidth).toBeLessThan(widthBeforeFix); // arrastar para dentro reduziu a largura lógica
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  const undoBaseline = await page.evaluate(() => undoStack.length);
  g = await geom(textId);
  expect(g.mode).toBe('fixed');
  expect(Math.abs(g.boxWidth - fixedDraftWidth)).toBeLessThan(1.5); // confirm preserva a largura do draft (não recentraliza)
  expect(g.worldW).toBeLessThan(longest); // quebra dentro da largura travada
  expect(g.worldH).toBeGreaterThan(autoWorldH); // mais linhas por causa da quebra
  expectHugsSelection(g);

  // (c) Persistência do modo em Undo/Redo.
  await page.locator('#topBtnUndo').click();
  await expect.poll(() => page.evaluate(id => assets.find(a => String(a.id) === id).boxWidthMode, textId)).toBe('auto');
  await page.locator('#topBtnRedo').click();
  await expect.poll(() => page.evaluate(id => assets.find(a => String(a.id) === id).boxWidthMode, textId)).toBe('fixed');
  // v8z4b32E9G-R1 — correção de revisão: fixedDraftWidth é uma const do contexto
  // Node/Playwright; não pode ser referenciada dentro do corpo de page.evaluate()
  // (executa no browser, onde essa variável não existe). Lê o valor real via
  // page.evaluate() e compara no lado Node, preservando a mesma prova (Undo → Auto,
  // Redo → Fixed com exatamente a largura confirmada no draft).
  const redoneBoxWidth = await page.evaluate(id => assets.find(a => String(a.id) === id).boxWidth, textId);
  expect(Math.abs(redoneBoxWidth - fixedDraftWidth)).toBeLessThan(1.5);

  // (c) Persistência do modo/valor em Save/Load real.
  const downloadPromise = page.waitForEvent('download');
  await page.evaluate(() => doSaveDirect(true, 'e9c-text-auto-width'));
  const download = await downloadPromise; const savedPath = await download.path(); expect(savedPath).toBeTruthy();
  const serialized = await page.evaluate(id => serializeProjectAsset(assets.find(a => String(a.id) === id), 0, false), textId);
  expect(serialized.boxWidthMode).toBe('fixed');
  await page.locator('#projectFileInput').setInputFiles(savedPath);
  await expect.poll(() => page.evaluate(() => loadSessionCompleted), { timeout: 30_000 }).toBe(true);
  expect(await page.evaluate(() => lastLoadError)).toBe('');
  const loaded = await page.evaluate(id => { const a = assets.find(x => String(x.id) === id); return { mode: a.boxWidthMode, boxWidth: a.boxWidth }; }, textId);
  expect(loaded.mode).toBe('fixed');
  expect(Math.abs(loaded.boxWidth - serialized.boxWidth)).toBeLessThan(1.5);

  // Volta ao modo auto para a checagem de paridade sob depth com largura dinâmica.
  await page.locator('#modeAssetsBtn').click();
  let box = await page.locator(`.world-text-asset[data-asset-id="${textId}"]`).boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  expect(await page.evaluate(() => String(selectedAssetId))).toBe(textId);
  await page.evaluate(id => startTextAssetEditing(assets.find(a => String(a.id) === id)), textId);
  await page.getByRole('tab', { name: 'Largura da caixa', exact: true }).click();
  await page.locator('#textWidthAuto').click(); // fixed -> auto
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  expect(await page.evaluate(id => assets.find(a => String(a.id) === id).boxWidthMode, textId)).toBe('auto');

  // (d) Paridade glifos/fundo/seleção sob depth != 0, com a largura dinâmica.
  // O texto já está selecionado após o commit acima (ainda em Modo Ativos); não
  // reabrir o menu contextual do botão Ativos.
  expect(await page.evaluate(() => String(selectedAssetId))).toBe(textId);
  const setDepth = async value => {
    await page.locator('#tbAssetDepth').click();
    await page.locator('#assetContextSlider').fill(String(value));
    await page.locator('#assetContextSlider').dispatchEvent('change');
    await expect(page.locator('#assetContextValue')).toHaveText(String(value));
    await page.getByRole('button', { name: 'Voltar' }).click();
  };
  for (const depth of [42, -37]) {
    await setDepth(depth);
    g = await geom(textId);
    expect(await page.evaluate(id => assets.find(a => String(a.id) === id).depth, textId)).toBe(depth);
    expectHugsSelection(g); // glifos (DOM) e seleção/alças permanecem alinhados sob parallax
  }
  const diagnostics = await page.evaluate(() => Object.fromEntries(buildDiagnosticsText().split('\n').filter(l => l.includes(': ')).map(l => { const i = l.indexOf(': '); return [l.slice(0, i), l.slice(i + 2)]; })));
  expect(diagnostics).toMatchObject({ selectedTextBoxWidthMode: 'auto', textAssetStageUsesResolvedParallaxGeometry: 'true', textAssetDomSelectionParityOk: 'true' });
});

test('E9D — criação pública horizontal e editor tipográfico preserva draft minimizado', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width:390, height:797 }); await page.goto('/', { waitUntil:'domcontentloaded' }); await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture); await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout:30_000 });
  await dismissProModalIfVisible(page);
  await page.locator('#modeAssetsBtn').click(); await expect(page.locator('body')).toHaveClass(/editor-assets/);
  const sheet=page.locator('#textCreationSheet'), openPublicTextCreation=async()=>{await page.locator('#lowerAddOrSelectAllBtn').click();await expect(page.locator('#assetsAddMenu')).toHaveClass(/open/);await page.locator('#assetsMenuTextBtn').click();await expect(sheet).toHaveClass(/open/)};
  const confirm=()=>sheet.getByRole('button',{name:'Confirmar',exact:true}).click();

  // A criação percorre apenas controles públicos. O tablist é o da sheet, não
  // outras abas existentes no aplicativo.
  await openPublicTextCreation();
  const e9dRailTabs = sheet.getByRole('tablist',{name:'Propriedades do texto'}).getByRole('tab');
  await expect(e9dRailTabs).toHaveText(['','','','','','','']); // rail iconográfica: nenhum label textual
  await expect(e9dRailTabs).toHaveCount(7);
  expect(await e9dRailTabs.evaluateAll(els=>els.map(e=>e.getAttribute('aria-label')))).toEqual(['Editar texto','Fonte','Estilo','Alinhamento','Cor do texto','Fundo da caixa','Largura da caixa']);
  await expect(sheet.getByRole('button',{name:'Cancelar',exact:true})).toHaveText('×'); await expect(sheet.getByRole('button',{name:'Confirmar',exact:true})).toHaveText('✓');
  await page.locator('#textCreationInput').fill('R'); const rDraftId=await page.evaluate(()=>pendingTextDraft.id); await confirm();
  const rProof=await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id),m=measureTextAsset({...a}),el=document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(id)}"]`),rect=el.getBoundingClientRect(),natural=measureTextNaturalWidth(measureTextAsset.canvas.getContext('2d'),a.text);return{id:a.id,text:a.text,mode:a.boxWidthMode,lines:m.lines,natural,boxWidth:a.boxWidth,worldW:a.worldW,paddingX:m.paddingX,rect:{w:rect.width,h:rect.height},count:assets.filter(x=>x?.type==='text').length}},String(rDraftId));
  expect(rProof).toMatchObject({id:rDraftId,text:'R',mode:'auto',lines:['R'],count:1}); expect(rProof.boxWidth).toBeCloseTo(rProof.natural+1); expect(rProof.worldW).toBeCloseTo(rProof.boxWidth+2*rProof.paddingX); expect(rProof.rect.w).toBeGreaterThan(0);

  // O relato real usa “Texto”: prova uma linha no modelo e um retângulo DOM
  // horizontal, com fundo/padding habilitados pelo editor público.
  await openPublicTextCreation(); await page.locator('#textCreationInput').fill('Texto'); await sheet.getByRole('tab',{name:'Fundo da caixa',exact:true}).click(); await enableTextBoxColor(page,'#112233'); await page.locator('#textBoxBackgroundOpacity').fill('65');
  const textDraftId=await page.evaluate(()=>pendingTextDraft.id); await confirm();
  const stageProof=await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id),m=measureTextAsset({...a}),el=document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(id)}"]`),outline=document.getElementById('assetSelectOutline'),r=el.getBoundingClientRect(),o=outline.getBoundingClientRect();return{asset:serializeProjectAsset(a,0,false),lines:m.lines,paddingX:m.paddingX,domText:el.textContent,rect:{x:r.x,y:r.y,w:r.width,h:r.height},outline:{x:o.x,y:o.y,w:o.width,h:o.height},implicitColumn:r.height>r.width}} ,String(textDraftId));
  expect(stageProof.asset).toMatchObject({id:textDraftId,text:'Texto',boxWidthMode:'auto',boxBackgroundEnabled:true,boxBackgroundColor:'#112233',boxBackgroundOpacity:.65}); expect(stageProof.lines).toEqual(['Texto']); expect(stageProof.domText).toBe('Texto'); expect(stageProof.implicitColumn).toBe(false); expect(stageProof.asset.worldW).toBeCloseTo(stageProof.asset.boxWidth+2*stageProof.paddingX);
  for(const k of ['x','y','w','h'])expect(Math.abs(stageProof.rect[k]-stageProof.outline[k])).toBeLessThan(1.2);

  // Auto/Fixa, stepper e os três alinhamentos operam no draft. Minimizar não
  // altera canônico, histórico, autosave nem payload persistível.
  await page.locator('#tbAssetReplace').click(); const before=await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision,canonical:serializeProjectAsset(getSelectedAsset(),0,false),payload:buildProjectData(true)}));
  await sheet.getByRole('tab',{name:'Alinhamento',exact:true}).click();
  for(const alignment of ['Esquerda','Centro','Direita'])await sheet.getByRole('button',{name:`Alinhar ${alignment}`,exact:true}).click();
  // v8z4b32E9G — Auto + side width handle: arrastar a alça no Stage entra em fixed e
  // altera a largura; sem slider, sem botão "Fixa", sem stepper −/+.
  await sheet.getByRole('tab',{name:'Largura da caixa',exact:true}).click(); const widthBefore=await page.evaluate(()=>pendingTextDraft.boxWidth); await dragTextWidthHandleBy(page,'right',80); expect(await page.evaluate(()=>pendingTextDraft.boxWidthMode)).toBe('fixed'); expect(await page.evaluate(()=>pendingTextDraft.boxWidth)).not.toBeCloseTo(widthBefore,0);
  await sheet.getByRole('tab',{name:'Editar texto',exact:true}).click(); await page.locator('#textCreationInput').fill('Texto draft'); const liveDraft=await page.evaluate(()=>textEditorDraftFields(pendingTextDraft)); await sheet.getByRole('button',{name:'Minimizar editor de texto',exact:true}).click(); await expect(sheet).not.toHaveClass(/open/);
  expect(await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision,canonical:serializeProjectAsset(getSelectedAsset(),0,false),payload:buildProjectData(true),draft:!!pendingTextDraft}))).toEqual({...before,draft:true});
  await page.locator('#tbAssetReplace').click(); await expect(page.locator('#textCreationInput')).toHaveValue('Texto draft'); expect(await page.evaluate(()=>textEditorDraftFields(pendingTextDraft))).toEqual(liveDraft); await sheet.getByRole('button',{name:'Cancelar',exact:true}).click();
  expect(await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision,canonical:serializeProjectAsset(getSelectedAsset(),0,false),payload:buildProjectData(true)}))).toEqual(before);

  // Uma mudança confirmada gera exatamente um Undo/revisão e preserva ID.
  await page.locator('#tbAssetReplace').click(); const commitBefore=await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision,count:assets.length,id:String(getSelectedAsset().id)})); await sheet.getByRole('tab',{name:'Alinhamento',exact:true}).click(); await sheet.getByRole('button',{name:'Alinhar Esquerda',exact:true}).click(); await confirm();
  expect(await page.evaluate(()=>({undo:undoStack.length,rev:_sessionAutosaveQueuedRevision,count:assets.length,id:String(getSelectedAsset().id),align:getSelectedAsset().textAlign}))).toEqual({...commitBefore,undo:commitBefore.undo+1,rev:commitBefore.rev+1,align:'left'});

  // Depth público: DOM/fundo, hit-test, seleção e quatro alças continuam juntos.
  await page.locator('#tbAssetDepth').click(); await page.locator('#assetContextSlider').fill('42'); await page.locator('#assetContextSlider').dispatchEvent('change'); await page.getByRole('button',{name:'Voltar'}).click();
  const geometry=await page.evaluate(id=>{const a=assets.find(x=>String(x.id)===id),el=document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(id)}"]`),outline=document.getElementById('assetSelectOutline'),r=el.getBoundingClientRect(),o=outline.getBoundingClientRect(),visual=resolveAssetStageVisualGeometry(a).visualRect,hit=hitTestAssetAtWorld(visual.x+visual.w/2,visual.y+visual.h/2);return{depth:a.depth,background:getComputedStyle(el).backgroundColor,delta:[r.x-o.x,r.y-o.y,r.width-o.width,r.height-o.height],hit:String(hit?.id||''),handles:document.querySelectorAll('.asset-corner-handle.show').length}},String(textDraftId));
  expect(geometry.depth).toBe(42); expect(geometry.background).not.toBe('rgba(0, 0, 0, 0)'); expect(geometry.delta.every(v=>Math.abs(v)<1.2)).toBe(true); expect(geometry.hit).toBe(String(textDraftId)); expect(geometry.handles).toBe(4);

  // Preview aberto publicamente: observar somente o primeiro frame real já
  // comprometido. Não reamostrar t=0 nem mutar o snapshot do renderer durante
  // a asserção, pois isso não representa necessariamente o frame exibido.
  await page.locator('#topBtnPreview').click(); await expect(page.locator('#previewScreen')).toHaveClass(/show/,{timeout:30_000}); await expect.poll(()=>page.evaluate(()=>previewLoadingHiddenAfterFirstFrame),{timeout:30_000}).toBe(true);
  // O snapshot COMPROMETIDO do renderer é estável e é verificado diretamente. A
  // auditoria (`renderTransform.preview`) reflete o frame VIVO do Preview, que anima
  // (câmera + parallax de depth); uma leitura única pode cair num frame em que o
  // glifo já saiu do enquadramento. Poll até observar o Text Asset desenhado e
  // enquadrado no Preview real — sem reamostrar t=0 nem mutar o snapshot do renderer;
  // as asserções funcionais (drawn, enquadrado, horizontal) são preservadas.
  const previewSnap=await page.evaluate(id=>renderSessionSnapshot?.textAssets?.find(a=>String(a.id)===id)||null,String(textDraftId));
  expect(previewSnap).toMatchObject({id:textDraftId,text:'Texto',worldW:stageProof.asset.worldW,worldH:stageProof.asset.worldH,depth:42});
  await expect.poll(()=>page.evaluate(id=>{const a=renderTransform.preview?.assets?.find(x=>String(x.id)===id);return a?{id:String(a.id),drawn:!!a.drawn,intersectsCamera:!!a.intersectsCamera,landscape:a.screenW>a.screenH}:null;},String(textDraftId)),{timeout:30_000}).toEqual({id:textDraftId,drawn:true,intersectsCamera:true,landscape:true});
  await page.locator('#previewScreen .close-btn').click();
});

// v8z4b32E9E — gate de CENTRALIZAÇÃO. Um NOVO Text Asset deve nascer centralizado
// na VISTA ATUAL do Stage (centro capturado em coords de World pela cadeia canônica
// computeEditorTransform → screenToStageCoord → editorStageToWorld), antes do resize
// do teclado. Editar um asset existente nunca o recentraliza. Este gate FALHA na main
// pré-E9E, que centraliza no centro da célula base do ProjectWorld.
test('E9E — novo Text Asset nasce no centro da vista atual (pan/zoom) e editar não recentraliza', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width:390, height:797 });
  await page.goto('/', { waitUntil:'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout:30_000 });
  await dismissProModalIfVisible(page);
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('body')).toHaveClass(/editor-assets/);

  const sheet = page.locator('#textCreationSheet');
  const startCreate = async () => { await page.evaluate(() => startTextCreation()); await expect(sheet).toHaveClass(/open/); };
  const cancel = () => sheet.getByRole('button', { name:'Cancelar', exact:true }).click();
  const confirm = () => sheet.getByRole('button', { name:'Confirmar', exact:true }).click();
  // Referência independente: centro da vista corrente em World calculado pela MESMA
  // cadeia canônica pré-existente (computeEditorTransform → screenToStageCoord →
  // editorStageToWorld). Não depende do helper novo, então o gate demonstra o defeito
  // real de centralização na main pré-E9E (draft nasce no centro base, não na vista).
  const viewCenter = () => page.evaluate(() => { computeEditorTransform(); const sr=stage.getBoundingClientRect(); const sc=screenToStageCoord(sr.left+sr.width/2, sr.top+sr.height/2); return editorStageToWorld(sc.x, sc.y); });
  const baseDims = () => page.evaluate(() => ({ w:(Number(projectWorld.baseStageW)||Number(stageW)||0), h:(Number(projectWorld.baseStageH)||Number(stageH)||0) }));
  const draftCenter = () => page.evaluate(() => ({ x:pendingTextDraft.worldX+pendingTextDraft.worldW/2, y:pendingTextDraft.worldY+pendingTextDraft.worldH/2 }));
  const resetView = () => page.evaluate(() => { editorPanX=0; editorPanY=0; editorZoomScale=1; clampEditorPan(); applyEditorZoom(); });
  const TOL = 1.0;
  const dims = await baseDims();
  const baseCenter = { x:dims.w/2, y:dims.h/2 };
  // Deslocamento mínimo (em World) que separa a vista corrente do centro base.
  const OFFSET = Math.max(6, Math.min(dims.w, dims.h) * 0.05);

  // Caso A — vista padrão: sem pan, o centro da vista coincide com o centro base;
  // o draft nasce nesse centro.
  await resetView();
  const cA = await viewCenter();
  expect(Math.hypot(cA.x - baseCenter.x, cA.y - baseCenter.y)).toBeLessThan(TOL);
  await startCreate();
  const dA = await draftCenter();
  expect(Math.abs(dA.x - cA.x)).toBeLessThan(TOL);
  expect(Math.abs(dA.y - cA.y)).toBeLessThan(TOL);
  await cancel();

  // Caso B — vista deslocada por pan: o draft nasce na região enquadrada e NÃO no
  // centro base do ProjectWorld (reprova o comportamento pré-E9E).
  await resetView();
  await panEditorViewport(page, -0.28, -0.22);
  const cB = await viewCenter();
  expect(Math.hypot(cB.x - baseCenter.x, cB.y - baseCenter.y)).toBeGreaterThan(OFFSET);
  await startCreate();
  const dB = await draftCenter();
  expect(Math.abs(dB.x - cB.x)).toBeLessThan(TOL);
  expect(Math.abs(dB.y - cB.y)).toBeLessThan(TOL);
  expect(Math.hypot(dB.x - baseCenter.x, dB.y - baseCenter.y)).toBeGreaterThan(OFFSET);
  await cancel();

  // Caso C — zoom diferente do padrão: continua nascendo no centro da vista corrente.
  await resetView();
  await page.evaluate(() => { editorZoomScale=1.8; clampEditorPan(); applyEditorZoom(); });
  await panEditorViewport(page, 0.18, 0.14);
  const cC = await viewCenter();
  await startCreate();
  const dC = await draftCenter();
  expect(Math.abs(dC.x - cC.x)).toBeLessThan(TOL);
  expect(Math.abs(dC.y - cC.y)).toBeLessThan(TOL);
  await cancel();

  // Caso D — o centro é capturado ANTES do resize do teclado; um resize posterior
  // não recalcula o ponto inicial do draft.
  await resetView();
  await panEditorViewport(page, -0.24, 0.2);
  const cD = await viewCenter();
  await startCreate();
  const dDbefore = await draftCenter();
  expect(Math.abs(dDbefore.x - cD.x)).toBeLessThan(TOL);
  expect(Math.abs(dDbefore.y - cD.y)).toBeLessThan(TOL);
  await page.setViewportSize({ width:390, height:560 });
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  const dDafter = await draftCenter();
  expect(Math.abs(dDafter.x - dDbefore.x)).toBeLessThan(TOL);
  expect(Math.abs(dDafter.y - dDbefore.y)).toBeLessThan(TOL);
  await cancel();
  await page.setViewportSize({ width:390, height:797 });

  // Caso E — editar um Text Asset confirmado FORA do centro nunca o recentraliza.
  await resetView();
  await startCreate();
  await page.locator('#textCreationInput').fill('Fixo');
  await confirm();
  const editId = await page.evaluate(() => String(getSelectedAsset().id));
  const offCenter = await page.evaluate(id => { const a=assets.find(x=>String(x.id)===id); a.worldX=12; a.worldY=16; measureTextAsset(a); renderProjectWorldExtraImages(); renderAssetSelectionOverlay(); return { x:a.worldX+a.worldW/2, y:a.worldY+a.worldH/2 }; }, editId);
  const viewCenterE = await viewCenter();
  await page.locator('#tbAssetReplace').click();
  await expect(sheet).toHaveClass(/open/);
  await page.locator('#textCreationInput').fill('Fixo editado');
  await confirm();
  const afterEdit = await page.evaluate(id => { const a=assets.find(x=>String(x.id)===id); return { x:a.worldX+a.worldW/2, y:a.worldY+a.worldH/2 }; }, editId);
  expect(Math.abs(afterEdit.x - offCenter.x)).toBeLessThan(2);
  expect(Math.abs(afterEdit.y - offCenter.y)).toBeLessThan(2);
  // Prova explícita de que não saltou para o centro da vista.
  expect(Math.hypot(afterEdit.x - viewCenterE.x, afterEdit.y - viewCenterE.y)).toBeGreaterThan(OFFSET);
});

// v8z4b32E9E — gate de WYSIWYG ao vivo. pendingTextDraft é a fonte única da verdade
// visual enquanto o editor está ativo: cada mudança no painel deve atualizar
// imediatamente o Stage, o fundo, a seleção e as quatro alças. A cada operação o gate
// exige panelState == pendingTextDraft e a coincidência da geometria do DOM textual,
// do fundo, do retângulo de seleção e das alças. FALHA na main pré-E9E, onde a seleção
// não acompanha o draft (updateTextDraft/input não re-renderizam a seleção e a seleção
// consome o estado confirmado, não o draft).
test('E9E — WYSIWYG: painel, Stage, fundo, seleção e alças refletem o mesmo draft', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width:390, height:797 });
  await page.goto('/', { waitUntil:'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout:30_000 });
  await dismissProModalIfVisible(page);
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('body')).toHaveClass(/editor-assets/);

  const sheet = page.locator('#textCreationSheet');
  const confirm = () => sheet.getByRole('button', { name:'Confirmar', exact:true }).click();

  // Lê, num único ponto, o draft, o estado público dos controles e a geometria real
  // do Stage (DOM textual, fundo, retângulo de seleção e quatro alças).
  const probe = () => page.evaluate(() => {
    const d = pendingTextDraft;
    const draft = { text:d.text, textAlign:d.textAlign, fontKey:d.fontKey, fontWeight:d.fontWeight, fontStyle:d.fontStyle, color:String(d.color).toLowerCase(), boxWidthMode:d.boxWidthMode, boxWidth:Math.round(Number(d.boxWidth)||0), bgEnabled:!!d.boxBackgroundEnabled, bgColor:String(d.boxBackgroundColor).toLowerCase(), bgOpacity:Math.round(Number(d.boxBackgroundOpacity)*100) };
    const alignActive = document.querySelector('#textEditorAlignOptions .text-editor-option.active');
    const alignLabel = alignActive ? alignActive.getAttribute('aria-label') : '';
    const alignFromPanel = alignLabel==='Alinhar Esquerda' ? 'left' : alignLabel==='Alinhar Direita' ? 'right' : alignLabel==='Alinhar Centro' ? 'center' : '';
    const fontActive = document.querySelector('#textEditorFontOptions .text-editor-option.active');
    const styleActive = document.querySelector('#textEditorStyleOptions .text-editor-option.active');
    const panel = {
      text: document.getElementById('textCreationInput').value,
      align: alignFromPanel,
      fontLabel: fontActive ? fontActive.textContent : '',
      styleLabel: styleActive ? styleActive.textContent : '',
      color: String(document.getElementById('textCreationColor').value).toLowerCase(),
      // v8z4b32E9G — modo derivado do único botão Auto (ativo=auto, senão fixed); não
      // há mais valor numérico de largura no painel (a largura em si vive só no Stage,
      // pelas side width handles); "fundo ligado" reflete pela visibilidade do slider
      // de opacidade (só existe com fundo ligado).
      widthMode: document.getElementById('textWidthAuto').classList.contains('active') ? 'auto' : 'fixed',
      bgPressed: String(!document.getElementById('textEditorBgOpacityWrap').hidden),
      bgColor: String(document.getElementById('textBoxBackgroundColor').value).toLowerCase(),
      bgOpacity: Math.round(parseFloat(document.getElementById('textBoxBackgroundOpacity').value)||0),
    };
    const expectedFontLabel = (TEXT_ASSET_FONTS[d.fontKey]||{}).label || '';
    const textEl = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(String(d.id))}"]`);
    const selEl = document.getElementById('assetSelectOutline');
    const read = el => { if(!el) return { present:false, x:0, y:0, w:0, h:0 }; const r=el.getBoundingClientRect(); return { present:true, x:r.x, y:r.y, w:r.width, h:r.height }; };
    const selVisible = !!(selEl && getComputedStyle(selEl).display !== 'none');
    const handles = selEl ? [...selEl.querySelectorAll('.asset-corner-handle.show')].map(h => { const r=h.getBoundingClientRect(); return { c:h.dataset.assetCorner, cx:r.x+r.width/2, cy:r.y+r.height/2 }; }) : [];
    const visual = resolveAssetStageVisualGeometry(d).visualRect;
    const expectedStage = editorWorldToStage(visual.x, visual.y, visual.w, visual.h);
    // Estilos COMPUTADOS do Text Asset renderizado no Stage — prova que o Stage
    // representa o MESMO pendingTextDraft para as propriedades visuais, não só a
    // geometria. Normalização RGB/família só no teste, sem tocar o produto.
    const parseNums = str => { const m = String(str).match(/-?\d+(?:\.\d+)?/g); return m ? m.map(Number) : []; };
    const hexRGB = hex => { const n = parseInt(String(hex).slice(1), 16); return [ (n>>16)&255, (n>>8)&255, n&255 ]; };
    const normFam = s => String(s).replace(/["']/g, '').replace(/\s+/g, '').toLowerCase();
    const cs = textEl ? getComputedStyle(textEl) : null;
    const computed = cs ? { textAlign: cs.textAlign, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, color: parseNums(cs.color).slice(0,3), fontFamily: normFam(cs.fontFamily), bg: parseNums(cs.backgroundColor) } : null;
    const expectedColor = hexRGB(d.color);
    const expectedFontFamily = normFam((TEXT_ASSET_FONTS[d.fontKey]||{}).family || '');
    const expectedBgRGB = hexRGB(d.boxBackgroundColor);
    const expectedStyleLabel = d.fontWeight === 700 ? (d.fontStyle === 'italic' ? 'Negrito + itálico' : 'Negrito') : (d.fontStyle === 'italic' ? 'Itálico' : 'Normal');
    return { draft, panel, expectedFontLabel, text:read(textEl), sel:read(selEl), selVisible, handles, background:textEl?getComputedStyle(textEl).backgroundColor:'', worldRect:{w:d.worldW,h:d.worldH,cx:d.worldX+d.worldW/2,cy:d.worldY+d.worldH/2}, computed, expectedColor, expectedFontFamily, expectedBgRGB, expectedStyleLabel };
  });

  // Verificação canônica em cada operação. Não testa só existência de DOM: compara
  // estado do painel vs draft e geometrias reais (Stage textual == seleção == fundo).
  const check = async (label, expectBg) => {
    const s = await probe();
    // panelState == pendingTextDraft
    expect(s.panel.text, `${label}: input == draft.text`).toBe(s.draft.text);
    expect(s.panel.align, `${label}: alinhamento do painel == draft.textAlign`).toBe(s.draft.textAlign);
    expect(s.panel.fontLabel, `${label}: fonte ativa == draft.fontKey`).toBe(s.expectedFontLabel);
    expect(s.panel.widthMode, `${label}: modo de largura == draft.boxWidthMode`).toBe(s.draft.boxWidthMode);
    expect(s.panel.bgPressed, `${label}: toggle de fundo == draft.bgEnabled`).toBe(String(s.draft.bgEnabled));
    expect(s.panel.bgColor, `${label}: cor do fundo == draft.bgColor`).toBe(s.draft.bgColor);
    expect(s.panel.bgOpacity, `${label}: opacidade do fundo == draft.bgOpacity`).toBe(s.draft.bgOpacity);
    expect(s.panel.color, `${label}: cor do texto == draft.color`).toBe(s.draft.color);
    // draftGeometry == StageGeometry == selectionGeometry (retângulos de tela coincidem)
    expect(s.text.present, `${label}: DOM textual do draft presente`).toBe(true);
    expect(s.selVisible, `${label}: seleção visível acompanhando o draft`).toBe(true);
    for (const k of ['x','y','w','h']) expect(Math.abs(s.text[k]-s.sel[k]), `${label}: text.${k} == selection.${k}`).toBeLessThan(1.2);
    // As quatro alças acompanham os cantos da seleção do draft (offset externo
    // canônico de 12 px: cada alça fica logo do lado de fora do seu canto).
    expect(s.handles.map(h=>h.c).sort(), `${label}: exatamente quatro alças`).toEqual(['bl','br','tl','tr']);
    const hm = Object.fromEntries(s.handles.map(h=>[h.c,h]));
    const near = v => Math.abs(v) < 24; // 12px offset + área de toque/zoom
    expect(hm.tl.cx-s.sel.x, `${label}: alça tl fora à esquerda`).toBeLessThan(0); expect(hm.tl.cy-s.sel.y, `${label}: alça tl fora acima`).toBeLessThan(0);
    expect(hm.tr.cx-(s.sel.x+s.sel.w), `${label}: alça tr fora à direita`).toBeGreaterThan(0); expect(hm.tr.cy-s.sel.y, `${label}: alça tr fora acima`).toBeLessThan(0);
    expect(hm.bl.cx-s.sel.x, `${label}: alça bl fora à esquerda`).toBeLessThan(0); expect(hm.bl.cy-(s.sel.y+s.sel.h), `${label}: alça bl fora abaixo`).toBeGreaterThan(0);
    expect(hm.br.cx-(s.sel.x+s.sel.w), `${label}: alça br fora à direita`).toBeGreaterThan(0); expect(hm.br.cy-(s.sel.y+s.sel.h), `${label}: alça br fora abaixo`).toBeGreaterThan(0);
    expect(near(hm.tl.cx-s.sel.x)&&near(hm.tl.cy-s.sel.y)&&near(hm.tr.cx-(s.sel.x+s.sel.w))&&near(hm.tr.cy-s.sel.y)&&near(hm.bl.cx-s.sel.x)&&near(hm.bl.cy-(s.sel.y+s.sel.h))&&near(hm.br.cx-(s.sel.x+s.sel.w))&&near(hm.br.cy-(s.sel.y+s.sel.h)), `${label}: alças coladas nos cantos`).toBe(true);
    // backgroundGeometry == expectedVisualRect (o fundo é o próprio retângulo textual).
    if (expectBg) expect(s.background, `${label}: fundo ativo`).not.toBe('rgba(0, 0, 0, 0)');
    else expect(s.background, `${label}: fundo desligado`).toBe('rgba(0, 0, 0, 0)');
    // Cadeia completa das propriedades VISUAIS: controle → pendingTextDraft →
    // estilos COMPUTADOS do DOM real do Stage. Prova que o Stage representa o draft.
    const c = s.computed;
    expect(c, `${label}: estilos computados do Stage disponíveis`).not.toBeNull();
    // 1. text-align
    expect(c.textAlign, `${label}: computed text-align == draft.textAlign`).toBe(s.draft.textAlign);
    // 2. font-weight (semântico: normal=400, bold=700)
    const computedWeight = c.fontWeight === 'normal' ? 400 : c.fontWeight === 'bold' ? 700 : parseInt(c.fontWeight, 10);
    expect(computedWeight, `${label}: computed font-weight == draft.fontWeight`).toBe(s.draft.fontWeight);
    // 3. font-style
    expect(c.fontStyle, `${label}: computed font-style == draft.fontStyle`).toBe(s.draft.fontStyle);
    // 4. color (RGB canônico do draft, normalizado apenas no teste)
    expect(c.color.length, `${label}: cor computada em RGB`).toBe(3);
    for (let i = 0; i < 3; i++) expect(Math.abs(c.color[i] - s.expectedColor[i]), `${label}: cor computada canal ${i} == draft.color`).toBeLessThanOrEqual(1);
    // 5. família da fonte (robusta a aspas/fallbacks, sem enfraquecer o contrato)
    expect(c.fontFamily, `${label}: família computada == fonte selecionada (fontKey)`).toBe(s.expectedFontFamily);
    // 7. estado do painel Estilo == peso + itálico do draft (não só presença de .active)
    expect(s.panel.styleLabel, `${label}: painel Estilo ativo == peso+itálico do draft`).toBe(s.expectedStyleLabel);
    // 6. background computado
    if (expectBg) {
      expect(c.bg.length, `${label}: fundo computado com canais RGB(A)`).toBeGreaterThanOrEqual(3);
      for (let i = 0; i < 3; i++) expect(Math.abs(c.bg[i] - s.expectedBgRGB[i]), `${label}: fundo computado canal ${i} == draft.boxBackgroundColor`).toBeLessThanOrEqual(1);
      const computedAlpha = c.bg.length >= 4 ? c.bg[3] : 1;
      expect(Math.abs(computedAlpha - (s.draft.bgOpacity / 100)), `${label}: alpha do fundo == draft.boxBackgroundOpacity`).toBeLessThan(0.02);
    } else {
      const computedAlpha = c.bg.length >= 4 ? c.bg[3] : 0;
      expect(computedAlpha, `${label}: fundo efetivo transparente quando desligado`).toBe(0);
    }
    return s;
  };

  // 1. criar Texto
  await page.evaluate(() => startTextCreation());
  await expect(sheet).toHaveClass(/open/);
  await page.locator('#textCreationInput').fill('Oi');
  await check('01 criar+digitar curto', false);
  // 2/3. texto mais longo (mantido abaixo da largura base para a etapa de largura fixa
  // exercitar o stepper sem esbarrar no clamp de exibição maxW herdado da E9D).
  await page.locator('#textCreationInput').fill('Texto maior');
  await check('03 texto longo', false);
  // 4. alinhamento (agora sob o ícone Alinhamento da rail)
  await sheet.getByRole('tab', { name:'Alinhamento', exact:true }).click();
  await sheet.getByRole('button', { name:'Alinhar Direita', exact:true }).click();
  await check('04 alinhar direita', false);
  // 5. Auto → Fixa pela side width handle (v8z4b32E9G): arrastar a alça no Stage entra
  // em fixed no mesmo gesto — a única forma pública de sair de Auto continua sendo um
  // único gesto, só que agora no Stage em vez do painel.
  await sheet.getByRole('tab', { name:'Largura da caixa', exact:true }).click();
  const widthStep5Before = await page.evaluate(()=>pendingTextDraft.boxWidth);
  await dragTextWidthHandleBy(page, 'right', -60);
  expect(await page.evaluate(()=>pendingTextDraft.boxWidthMode)).toBe('fixed');
  expect(await page.evaluate(()=>pendingTextDraft.boxWidth)).not.toBeCloseTo(widthStep5Before, 0);
  await check('05 largura fixa', false);
  // 6. modificar largura fixa (novo arrasto na mesma alça)
  const widthStep6Before = await page.evaluate(()=>pendingTextDraft.boxWidth);
  await dragTextWidthHandleBy(page, 'right', 40);
  expect(await page.evaluate(()=>pendingTextDraft.boxWidth)).not.toBeCloseTo(widthStep6Before, 0);
  await check('06 aumentar largura', false);
  // 7. alterar fonte
  await sheet.getByRole('tab', { name:'Fonte', exact:true }).click();
  const fontButtons = sheet.locator('#textEditorFontOptions .text-editor-option');
  await fontButtons.nth((await fontButtons.count())-1).click();
  await check('07 fonte', false);
  // 8. peso/itálico
  await sheet.getByRole('tab', { name:'Estilo', exact:true }).click();
  await sheet.getByRole('button', { name:'Estilo Negrito + itálico', exact:true }).click();
  await check('08 peso/itálico', false);
  // 9. cor do texto (propriedade própria: apenas os glifos)
  await sheet.getByRole('tab', { name:'Cor do texto', exact:true }).click();
  await page.locator('#textCreationColor').evaluate(el=>{el.value='#ff8800';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await check('09 cor do texto', false);
  // 10. ativar fundo (v8z4b32E9F1: escolher uma cor liga o fundo e revela a opacidade)
  await sheet.getByRole('tab', { name:'Fundo da caixa', exact:true }).click();
  await enableTextBoxColor(page, '#000000');
  await check('10 fundo ligado', true);
  // 11. cor do fundo
  await page.locator('#textBoxBackgroundColor').evaluate(el=>{el.value='#113355';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await check('11 cor do fundo', true);
  // 12. opacidade do fundo
  await page.locator('#textBoxBackgroundOpacity').fill('40');
  await check('12 opacidade do fundo', true);
  // 13. minimizar
  const beforeMin = await probe();
  await sheet.getByRole('button', { name:'Minimizar editor de texto', exact:true }).click();
  await expect(sheet).not.toHaveClass(/open/);
  expect(await page.evaluate(()=>!!pendingTextDraft)).toBe(true);
  // 14. reabrir — nenhuma propriedade volta ao estado anterior
  await page.evaluate(() => startTextCreation());
  await expect(sheet).toHaveClass(/open/);
  const afterReopen = await check('14 reabrir', true);
  expect(afterReopen.draft).toEqual(beforeMin.draft);
  // 15. confirmar — sem salto visual: o asset confirmado mantém a geometria do draft.
  const draftId = await page.evaluate(()=>String(pendingTextDraft.id));
  const beforeConfirm = await probe();
  await confirm();
  const confirmed = await page.evaluate(id => { const a=assets.find(x=>String(x.id)===id); const el=document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(id)}"]`); const r=el.getBoundingClientRect(); const o=document.getElementById('assetSelectOutline').getBoundingClientRect(); return { text:a.text, align:a.textAlign, bg:a.boxBackgroundEnabled, worldW:a.worldW, worldH:a.worldH, rect:{x:r.x,y:r.y,w:r.width,h:r.height}, outline:{x:o.x,y:o.y,w:o.width,h:o.height} }; }, draftId);
  expect(confirmed.text).toBe(beforeConfirm.draft.text);
  expect(confirmed.align).toBe(beforeConfirm.draft.textAlign);
  expect(confirmed.bg).toBe(true);
  expect(Math.abs(confirmed.worldW-beforeConfirm.worldRect.w)).toBeLessThan(0.01);
  expect(Math.abs(confirmed.worldH-beforeConfirm.worldRect.h)).toBeLessThan(0.01);
  for (const k of ['x','y','w','h']) expect(Math.abs(confirmed.rect[k]-confirmed.outline[k])).toBeLessThan(1.2);
  // Sem salto no momento da confirmação: o retângulo confirmado coincide com o do draft.
  for (const k of ['x','y','w','h']) expect(Math.abs(confirmed.rect[k]-beforeConfirm.text[k])).toBeLessThan(1.2);
});

// v8z4b32E9F — gate da rail iconográfica neutra do editor de Text Asset. Cobre a
// substituição das tabs textuais por ícones (sem label visível), o estado ativo
// neutro invertido (branco + símbolo escuro, nunca coral/ciano/verde), a paleta de
// UI aprovada, o coral #FF6B8A dos Ativos com o ciano dos Frames preservado, a
// navegação por propriedade refletindo pendingTextDraft ao vivo, alinhamento e fundo
// iconográficos/separados, largura Auto/Fixa, minimizar por gesto vertical (sem
// conflito com o swipe horizontal da rail nem com o slider) e as quatro alças.
test('E9F — editor de texto iconográfico neutro: rail, paleta, coral, gestos e draft', async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width:390, height:797 });
  await page.goto('/', { waitUntil:'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout:30_000 });
  await dismissProModalIfVisible(page);
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('body')).toHaveClass(/editor-assets/);

  const sheet = page.locator('#textCreationSheet');
  const railTabs = sheet.getByRole('tablist',{name:'Propriedades do texto'}).getByRole('tab');
  const railTool = label => sheet.getByRole('tab',{name:label,exact:true});
  const confirm = () => sheet.getByRole('button',{name:'Confirmar',exact:true}).click();
  const cancel = () => sheet.getByRole('button',{name:'Cancelar',exact:true}).click();
  const rgb = s => (String(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
  const CORAL=[255,107,138], CYAN=[4,255,242], GREEN=[48,209,88];
  const near = (a,b,t=2) => a.length>=3 && b.length>=3 && Math.abs(a[0]-b[0])<=t && Math.abs(a[1]-b[1])<=t && Math.abs(a[2]-b[2])<=t;
  const TOOLS = [
    ['Editar texto','text'],['Fonte','font'],['Estilo','style'],['Alinhamento','align'],
    ['Cor do texto','color'],['Fundo da caixa','background'],['Largura da caixa','width'],
  ];

  // ---------- A) RAIL ICONOGRÁFICA ----------
  await page.evaluate(() => startTextCreation());
  await expect(sheet).toHaveClass(/open/);
  // Nenhuma tab textual principal: a rail só tem ícones, sem texto visível.
  await expect(railTabs).toHaveCount(7);
  await expect(railTabs).toHaveText(['','','','','','','']);
  expect(await railTabs.evaluateAll(els => els.map(e => e.getAttribute('aria-label'))))
    .toEqual(TOOLS.map(t => t[0]));
  // Nenhuma label textual "Texto/Fonte/Cor/Estilo" sob os ícones.
  expect(await sheet.locator('.text-rail-item').evaluateAll(els => els.map(e => e.textContent.trim()).join('')))
    .toBe('');
  // Cada ícone tem um SVG (sem emoji/caractere improvisado).
  expect(await sheet.locator('.text-rail-item svg.text-rail-icon').count()).toBe(7);
  // Rail em uma única linha, sem wrap, com overflow horizontal disponível.
  const railLayout = await sheet.locator('.text-editor-rail').evaluate(el => ({
    flexWrap: getComputedStyle(el).flexWrap, scrollW: el.scrollWidth, clientW: el.clientWidth, top0: el.getBoundingClientRect().top,
  }));
  expect(railLayout.flexWrap).toBe('nowrap');
  expect(railLayout.scrollW).toBeGreaterThan(railLayout.clientW); // conteúdo excede: rola horizontalmente
  // Todos os ícones em uma linha só (mesmo topo) — não criou segunda linha.
  const railTops = await sheet.locator('.text-rail-item').evaluateAll(els => els.map(e => Math.round(e.getBoundingClientRect().top)));
  expect(new Set(railTops).size).toBe(1);
  // Exatamente um item ativo e tocar em cada ícone mostra SOMENTE o painel dele.
  for (const [label, panel] of TOOLS) {
    await railTool(label).click();
    await expect(sheet.locator('.text-rail-item.active')).toHaveCount(1);
    const state = await sheet.evaluate(p => ({
      activeTool: (document.querySelector('.text-rail-item.active')||{}).getAttribute?.('data-text-tool'),
      openPanels: [...document.querySelectorAll('.text-editor-panel')].filter(x => getComputedStyle(x).display !== 'none').map(x => x.getAttribute('data-text-panel')),
    }), panel);
    expect(state.activeTool).toBe(panel);
    expect(state.openPanels).toEqual([panel]);
    expect(await railTool(label).getAttribute('aria-selected')).toBe('true');
  }

  // ---------- B) ESTADO ATIVO NEUTRO ----------
  await railTool('Editar texto').click();
  await page.screenshot({ path: testInfo.outputPath('e9f-rail-texto-390x797.png') }); // rail iconográfica com item ativo (Texto)
  const activeStyle = await sheet.locator('.text-rail-item.active').evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color, icon: getComputedStyle(el.querySelector('.text-rail-icon')).color }));
  const inactiveStyle = await sheet.locator('.text-rail-item:not(.active)').first().evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }));
  const aBg = rgb(activeStyle.bg), aIcon = rgb(activeStyle.icon), iBg = rgb(inactiveStyle.bg);
  expect(aBg.slice(0,3)).toEqual([255,255,255]);                 // superfície branca
  expect(aIcon[0]+aIcon[1]+aIcon[2]).toBeLessThan(150);          // símbolo escuro
  expect(iBg.slice(0,3)).not.toEqual([255,255,255]);             // inativo neutro escuro
  expect(iBg[0]+iBg[1]+iBg[2]).toBeLessThan(360);
  for (const c of [aBg, aIcon]) { expect(near(c,CORAL)).toBe(false); expect(near(c,CYAN)).toBe(false); expect(near(c,GREEN)).toBe(false); }

  // ---------- C) SUPERFÍCIES (paleta aprovada) ----------
  const surfaces = await page.evaluate(() => ({
    sheet: getComputedStyle(document.querySelector('.text-creation-inner')).backgroundColor,
    field: getComputedStyle(document.getElementById('textCreationInput')).backgroundColor,
    chrome: getComputedStyle(document.getElementById('topBar')).backgroundColor,
  }));
  expect(rgb(surfaces.sheet).slice(0,3)).toEqual([48,50,56]);    // sheet #303238
  expect(rgb(surfaces.field).slice(0,3)).toEqual([57,60,67]);    // campo #393C43
  expect(rgb(surfaces.field).slice(0,3)).not.toEqual(rgb(surfaces.sheet).slice(0,3)); // campo != sheet
  expect(rgb(surfaces.chrome).slice(0,3)).toEqual([36,38,43]);   // chrome/UI principal #24262B (não é DEFAULT_PROJECT_BG)

  // ---------- D) ATIVOS coral / Frames ciano ----------
  const accents = await page.evaluate(() => ({
    assets: getComputedStyle(document.body).getPropertyValue('--accent').trim().toLowerCase(),
    frames: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().toLowerCase(),
    projectBg: (typeof DEFAULT_PROJECT_BG !== 'undefined') ? DEFAULT_PROJECT_BG : null,
  }));
  expect(accents.assets).toBe('#ff6b8a');   // token de Ativos = coral #FF6B8A
  expect(accents.frames).toBe('#04fff2');   // Frames preservam o ciano existente
  expect(accents.projectBg).toBe('#3c3c3b'); // DEFAULT_PROJECT_BG intacto (não virou UI)

  // ---------- E) NAVEGAÇÃO DE PROPRIEDADES reflete pendingTextDraft ao vivo ----------
  await railTool('Editar texto').click();
  await page.locator('#textCreationInput').fill('Arco');
  const liveProbe = () => page.evaluate(() => {
    const d = pendingTextDraft;
    const el = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(String(d.id))}"]`);
    const sel = document.getElementById('assetSelectOutline');
    const handles = sel ? [...sel.querySelectorAll('.asset-corner-handle.show')].map(h => h.dataset.assetCorner).sort() : [];
    return { text:d.text, align:d.textAlign, fontKey:d.fontKey, weight:d.fontWeight, style:d.fontStyle, color:String(d.color).toLowerCase(), mode:d.boxWidthMode, bg:!!d.boxBackgroundEnabled,
      domText: el ? el.textContent : null, domAlign: el ? getComputedStyle(el).textAlign : null, selVisible: !!(sel && getComputedStyle(sel).display !== 'none'), handles };
  });
  let p0 = await liveProbe();
  expect(p0.domText).toBe('Arco'); expect(p0.selVisible).toBe(true); expect(p0.handles).toEqual(['bl','br','tl','tr']);
  // Fonte
  await railTool('Fonte').click();
  await page.screenshot({ path: testInfo.outputPath('e9f-rail-fonte-390x797.png') });
  const fontOpts = sheet.locator('#textEditorFontOptions .text-editor-option');
  await fontOpts.nth((await fontOpts.count())-1).click();
  let p = await liveProbe(); expect(p.fontKey).not.toBe(p0.fontKey); expect(p.selVisible).toBe(true); expect(p.handles).toEqual(['bl','br','tl','tr']);
  // Estilo
  await railTool('Estilo').click();
  await sheet.getByRole('button',{name:'Estilo Negrito',exact:true}).click();
  p = await liveProbe(); expect(p.weight).toBe(700);
  // Alinhamento — reflete no Stage imediatamente
  await railTool('Alinhamento').click();
  await page.screenshot({ path: testInfo.outputPath('e9f-rail-alinhamento-390x797.png') });
  await sheet.getByRole('button',{name:'Alinhar Direita',exact:true}).click();
  p = await liveProbe(); expect(p.align).toBe('right'); expect(p.domAlign).toBe('right'); expect(p.handles).toEqual(['bl','br','tl','tr']);
  // Cor do texto — v8z4b32E9F1: paleta rápida de swatches + botão + (picker completo).
  await railTool('Cor do texto').click();
  // Único texto visível no painel é o "+" do botão de picker; os swatches não têm texto.
  expect((await sheet.locator('[data-text-panel="color"]').evaluate(el => el.textContent)).trim()).toBe('+');
  expect(await sheet.locator('#textColorSwatches .text-swatch').count()).toBeGreaterThan(1);
  // v8z4b32E9F6 — REG-055: o "+" visual é puramente decorativo (aria-hidden); o
  // PRÓPRIO input nativo, sobreposto sobre a área do "+" (alvo real de toque via
  // .color-trigger-wrap), carrega o aria-label acessível.
  expect(await sheet.locator('#textColorSwatches .text-swatch-add').getAttribute('aria-hidden')).toBe('true');
  expect(await page.locator('#textCreationColor').getAttribute('aria-label')).toBe('Escolher outra cor do texto');
  await page.locator('#textCreationColor').evaluate(el=>{el.value='#ff8800';el.dispatchEvent(new Event('input',{bubbles:true}));});
  p = await liveProbe(); expect(p.color).toBe('#ff8800');
  // Retornar a uma propriedade mostra o valor atual do draft.
  await railTool('Alinhamento').click();
  expect(await sheet.locator('#textEditorAlignOptions .text-editor-option.active').getAttribute('aria-label')).toBe('Alinhar Direita');

  // ---------- F) ALINHAMENTO iconográfico (sem grandes labels textuais) ----------
  const alignBtns = await sheet.locator('#textEditorAlignOptions .text-editor-option').evaluateAll(els => els.map(e => ({ label:e.getAttribute('aria-label'), text:e.textContent.trim(), svg:e.querySelectorAll('svg').length })));
  expect(alignBtns.map(b=>b.label)).toEqual(['Alinhar Esquerda','Alinhar Centro','Alinhar Direita']);
  expect(alignBtns.every(b => b.text === '' && b.svg === 1)).toBe(true); // ícones, não "Esquerda/Centro/Direita"
  await sheet.getByRole('button',{name:'Alinhar Centro',exact:true}).click();
  expect(await page.evaluate(()=>pendingTextDraft.textAlign)).toBe('center');

  // ---------- G) FUNDO agrupa enable/cor/opacidade e não reduz opacidade dos glifos ----------
  await railTool('Fundo da caixa').click();
  const bgPanel = sheet.locator('[data-text-panel="background"]');
  for (const id of ['#textBgSwatches','#textBoxBackgroundColor','#textEditorBgOpacityWrap','#textBoxBackgroundOpacity','#textBoxBackgroundOpacityValue'])
    expect(await bgPanel.locator(id).count(), `${id} dentro do painel de Fundo`).toBe(1);
  // v8z4b32E9F1 — padrão "Sem cor / Transparente": sem slider de opacidade.
  expect(await bgPanel.locator('[data-swatch-none]').getAttribute('aria-pressed')).toBe('true');
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeHidden();
  // Escolher uma cor liga o fundo e revela o slider (opacidade dentro do painel de Fundo).
  await enableTextBoxColor(page, '#113355');
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeVisible();
  await page.locator('#textBoxBackgroundOpacity').fill('40');
  await expect(page.locator('#textBoxBackgroundOpacityValue')).toHaveText('40%');
  await page.screenshot({ path: testInfo.outputPath('e9f-rail-fundo-390x797.png') }); // opacidade dentro do painel de Fundo
  const bgProof = await page.evaluate(() => {
    const d = pendingTextDraft; const el = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(String(d.id))}"]`);
    const cs = getComputedStyle(el); const nums = s => (String(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
    return { glyphAlpha: (nums(cs.color)[3] ?? 1), bgAlpha: (nums(cs.backgroundColor)[3] ?? 1), bgOpacity: d.boxBackgroundOpacity };
  });
  expect(bgProof.bgOpacity).toBeCloseTo(0.4, 5);
  expect(Math.abs(bgProof.bgAlpha - 0.4)).toBeLessThan(0.02); // opacidade pertence ao FUNDO
  expect(bgProof.glyphAlpha).toBe(1);                          // e NÃO reduz a opacidade dos glifos

  // ---------- H) LARGURA Auto + side width handle (v8z4b32E9G; E9C intacta por baixo) ----------
  await railTool('Largura da caixa').click();
  const widthPanel = sheet.locator('[data-text-panel="width"]');
  expect(await widthPanel.locator('#textWidthAuto').count()).toBe(1);       // único botão de modo: Auto
  expect(await widthPanel.locator('input[type="range"]').count()).toBe(0);  // sem slider de largura
  expect(await widthPanel.locator('#textWidthFixedMode').count()).toBe(0);  // sem botão "Fixa"
  expect(await widthPanel.locator('#textWidthFixedStepper').count()).toBe(0); // sem stepper −/+
  await expect(page.locator('#textWidthAuto')).toHaveClass(/active/);        // começa em Auto
  const wBefore = await page.evaluate(()=>pendingTextDraft.boxWidth);
  await dragTextWidthHandleBy(page, 'right', 60);                            // arrastar a alça entra em fixed no mesmo gesto
  expect(await page.evaluate(()=>pendingTextDraft.boxWidthMode)).toBe('fixed');
  await expect(page.locator('#textWidthAuto')).not.toHaveClass(/active/);
  expect(await page.evaluate(()=>pendingTextDraft.boxWidth)).not.toBeCloseTo(wBefore, 0);
  await page.locator('#textWidthAuto').click();                             // Auto volta para auto
  expect(await page.evaluate(()=>pendingTextDraft.boxWidthMode)).toBe('auto');
  await expect(page.locator('#textWidthAuto')).toHaveClass(/active/);

  // ---------- L) QUATRO CORNER HANDLES + DUAS SIDE WIDTH HANDLES (E9G, Text Asset) ----------
  const handleAudit = await page.evaluate(() => {
    const sel = document.getElementById('assetSelectOutline');
    const shown = [...sel.querySelectorAll('.asset-corner-handle.show')].map(h => h.dataset.assetCorner).sort();
    const all = [...document.querySelectorAll('.asset-corner-handle')].map(h => h.dataset.assetCorner).sort();
    const widthShown = [...sel.querySelectorAll('.text-width-handle.show')].map(h => h.dataset.assetWidthHandle).sort();
    const widthAll = [...document.querySelectorAll('.text-width-handle')].map(h => h.dataset.assetWidthHandle).sort();
    return { shown, all, widthShown, widthAll };
  });
  expect(handleAudit.shown).toEqual(['bl','br','tl','tr']);
  expect(handleAudit.all).toEqual(['bl','br','tl','tr']);
  expect(handleAudit.widthShown).toEqual(['left','right']); // Text Asset ganha exatamente as duas side width handles (E9G)
  expect(handleAudit.widthAll).toEqual(['left','right']);

  // ---------- I) MINIMIZAR POR GESTO VERTICAL preservando a propriedade ativa ----------
  // Abre uma propriedade DIFERENTE de 'text' antes de minimizar; ao reabrir o MESMO
  // draft, a propriedade ativa da rail (item ativo + painel visível) deve ser
  // preservada — continuidade da sessão de edição, sem forçar 'Editar texto'.
  await railTool('Fundo da caixa').click();
  const editorRailState = () => page.evaluate(() => ({
    tool: textEditorActiveTool,
    activeRail: [...document.querySelectorAll('.text-rail-item.active')].map(b => b.getAttribute('data-text-tool')),
    ariaSelected: [...document.querySelectorAll('.text-rail-item[aria-selected="true"]')].map(b => b.getAttribute('data-text-tool')),
    visiblePanels: [...document.querySelectorAll('.text-editor-panel')].filter(p => getComputedStyle(p).display !== 'none').map(p => p.getAttribute('data-text-panel')),
  }));
  const draftBeforeMin = await page.evaluate(() => ({ id:String(pendingTextDraft.id), fields:textEditorDraftFields(pendingTextDraft), undo:undoStack.length, rev:_sessionAutosaveQueuedRevision }));
  const railBeforeMin = await editorRailState();
  expect(railBeforeMin.tool).toBe('background');            // propriedade ativa != 'text'
  expect(railBeforeMin.activeRail).toEqual(['background']); // exatamente um item ativo
  expect(railBeforeMin.ariaSelected).toEqual(['background']);
  expect(railBeforeMin.visiblePanels).toEqual(['background']); // exatamente um painel visível
  // Arrasto vertical para baixo sobre a ALÇA superior (pointer events reais na alça).
  await page.evaluate(() => {
    const el = document.getElementById('textCreationDrag'); const r = el.getBoundingClientRect();
    const x = r.left + r.width/2, y = r.top + r.height/2;
    el.dispatchEvent(new PointerEvent('pointerdown', { clientX:x, clientY:y, bubbles:true, pointerId:1 }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX:x, clientY:y+60, bubbles:true, pointerId:1 }));
    window.dispatchEvent(new PointerEvent('pointerup', { clientX:x, clientY:y+60, bubbles:true, pointerId:1 }));
  });
  await expect(sheet).not.toHaveClass(/open/);
  const draftAfterMin = await page.evaluate(() => ({ exists:!!pendingTextDraft, id:pendingTextDraft?String(pendingTextDraft.id):null, fields:pendingTextDraft?textEditorDraftFields(pendingTextDraft):null, undo:undoStack.length, rev:_sessionAutosaveQueuedRevision }));
  expect(draftAfterMin.exists).toBe(true);
  expect(draftAfterMin.id).toBe(draftBeforeMin.id);
  expect(draftAfterMin.fields).toEqual(draftBeforeMin.fields);
  expect(draftAfterMin.undo).toBe(draftBeforeMin.undo);   // minimizar não cria Undo
  expect(draftAfterMin.rev).toBe(draftBeforeMin.rev);     // nem revisão de autosave
  // Reabrir restaura exatamente o mesmo draft/ID E a MESMA propriedade ativa.
  await page.evaluate(() => startTextCreation());
  await expect(sheet).toHaveClass(/open/);
  const reopened = await page.evaluate(() => ({ id:String(pendingTextDraft.id), fields:textEditorDraftFields(pendingTextDraft), undo:undoStack.length, rev:_sessionAutosaveQueuedRevision }));
  expect(reopened).toEqual({ id:draftBeforeMin.id, fields:draftBeforeMin.fields, undo:draftBeforeMin.undo, rev:draftBeforeMin.rev });
  const railAfterReopen = await editorRailState();
  expect(railAfterReopen.tool).toBe(railBeforeMin.tool);            // mesma propriedade ativa (não 'text')
  expect(railAfterReopen.tool).not.toBe('text');
  expect(railAfterReopen.activeRail).toEqual(railBeforeMin.activeRail);       // um item ativo, o mesmo
  expect(railAfterReopen.ariaSelected).toEqual(railBeforeMin.ariaSelected);
  expect(railAfterReopen.visiblePanels).toEqual(railBeforeMin.visiblePanels); // um painel visível, o mesmo

  // ---------- J) CONFLITO DE GESTOS ----------
  // Swipe horizontal sobre a rail desloca a rail e NÃO minimiza a sheet.
  const rail = sheet.locator('.text-editor-rail');
  await rail.evaluate(el => { el.scrollLeft = 40; el.dispatchEvent(new PointerEvent('pointerdown',{clientX:el.getBoundingClientRect().left+30,clientY:el.getBoundingClientRect().top+20,bubbles:true,pointerId:2})); window.dispatchEvent(new PointerEvent('pointermove',{clientX:el.getBoundingClientRect().left-40,clientY:el.getBoundingClientRect().top+20,bubbles:true,pointerId:2})); window.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:2})); });
  expect(await rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(0); // rail deslocou horizontalmente
  await expect(sheet).toHaveClass(/open/);                             // sheet NÃO minimizou
  expect(await page.evaluate(()=>!!pendingTextDraft)).toBe(true);      // draft permanece
  // Interagir com o slider de opacidade: funciona e não arrasta a sheet.
  await railTool('Fundo da caixa').click();
  const slider = page.locator('#textBoxBackgroundOpacity');
  await slider.evaluate(el => { el.dispatchEvent(new PointerEvent('pointerdown',{clientX:el.getBoundingClientRect().left+5,clientY:el.getBoundingClientRect().top+5,bubbles:true,pointerId:3})); window.dispatchEvent(new PointerEvent('pointermove',{clientX:el.getBoundingClientRect().left+5,clientY:el.getBoundingClientRect().top+40,bubbles:true,pointerId:3})); window.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:3})); });
  await expect(sheet).toHaveClass(/open/);                             // slider não arrasta a sheet
  await slider.fill('55'); await expect(page.locator('#textBoxBackgroundOpacityValue')).toHaveText('55%');

  // ---------- K) CANCELAR / CONFIRMAR ----------
  // Cancelar: descarta o draft sem confirmar (zero commit, sem resíduo, mesmo ID some do draft).
  const beforeCancel = await page.evaluate(() => ({ undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, count:assets.length }));
  await cancel();
  await expect(sheet).not.toHaveClass(/open/);
  expect(await page.evaluate(() => ({ draft:!!pendingTextDraft, undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, count:assets.length }))).toEqual({ draft:false, ...beforeCancel });
  // Confirmar: estado visível = estado persistido; mesmo ID; exatamente 1 Undo e 1 revisão.
  await page.evaluate(() => startTextCreation());
  await expect(sheet).toHaveClass(/open/);
  await page.locator('#textCreationInput').fill('Confirmado');
  const commitBefore = await page.evaluate(() => ({ id:String(pendingTextDraft.id), undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, count:assets.length }));
  await confirm();
  await expect(sheet).not.toHaveClass(/open/);
  const commitAfter = await page.evaluate(id => { const a = assets.find(x => String(x.id)===id); const el = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(id)}"]`); const o = document.getElementById('assetSelectOutline'); const r = el.getBoundingClientRect(), ob = o.getBoundingClientRect(); return { exists:!!a, text:a?a.text:null, id:String(getSelectedAsset().id), undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, count:assets.length, parity:['x','y','width','height'].every(k => Math.abs(r[k]-ob[k])<1.2) }; }, commitBefore.id);
  expect(commitAfter.exists).toBe(true);
  expect(commitAfter.text).toBe('Confirmado');
  expect(commitAfter.id).toBe(commitBefore.id);           // mesmo ID
  expect(commitAfter.count).toBe(commitBefore.count + 1);
  expect(commitAfter.undo).toBe(commitBefore.undo + 1);   // exatamente 1 Undo
  expect(commitAfter.rev).toBe(commitBefore.rev + 1);     // e 1 revisão de autosave
  expect(commitAfter.parity).toBe(true);                  // estado visível == persistido (seleção sobre o asset)
});

test('E9F1 — refino do editor de texto: cabeçalho compacto, ícones, paletas, viewport e largura', async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width:390, height:797 });
  await page.goto('/', { waitUntil:'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout:30_000 });
  await dismissProModalIfVisible(page);
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('body')).toHaveClass(/editor-assets/);

  const sheet = page.locator('#textCreationSheet');
  const railTool = label => sheet.getByRole('tab',{name:label,exact:true});
  const rgb = s => (String(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
  const CORAL=[255,107,138], CYAN=[4,255,242], GREEN=[48,209,88];
  const near = (a,b,t=3) => a.length>=3 && b.length>=3 && Math.abs(a[0]-b[0])<=t && Math.abs(a[1]-b[1])<=t && Math.abs(a[2]-b[2])<=t;
  const draftAlignHref = () => page.locator('#textAlignRailIcon').getAttribute('href');
  const draftColor = () => page.evaluate(()=>String(pendingTextDraft.color).toLowerCase());
  const stageComputed = prop => page.evaluate(p=>{const el=document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(String(pendingTextDraft.id))}"]`);return el?getComputedStyle(el)[p]:null;}, prop);

  // =========================================================================
  // TESTE 1 — CABEÇALHO COMPACTO (× e ✓ presentes; alça próxima da linha de ações;
  // linha de ações próxima da rail; sem linha vazia; touch targets preservados).
  // =========================================================================
  await page.evaluate(() => startTextCreation());
  await expect(sheet).toHaveClass(/open/);
  await expect(sheet.getByRole('button',{name:'Cancelar',exact:true})).toBeVisible(); // ×
  await expect(sheet.getByRole('button',{name:'Confirmar',exact:true})).toBeVisible(); // ✓
  const header = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const rc = el => { const b = el.getBoundingClientRect(); return { top:b.top, bottom:b.bottom, height:b.height }; };
    const drag = rc(q('#textCreationSheet .text-editor-drag'));
    const hdr = rc(q('#textCreationSheet .text-editor-header'));
    const rail = rc(q('#textCreationSheet .text-editor-rail'));
    const cancel = q('#textCreationCancel').getBoundingClientRect();
    const confirm = q('#textCreationOk').getBoundingClientRect();
    return {
      handleToActions: +(hdr.top - drag.bottom).toFixed(2),
      actionsToRail: +(rail.top - hdr.bottom).toFixed(2),
      dragH: drag.height, headerH: hdr.height, cancelH: cancel.height, confirmH: confirm.height,
      overlapHeaderRail: hdr.bottom > rail.top + 0.5,
      diag: getTextEditorE9F1Diagnostics(),
    };
  });
  // Gaps compactos e coerentes, sem grande área vazia (nem sobreposição).
  expect(header.handleToActions).toBeLessThanOrEqual(14);
  expect(header.handleToActions).toBeGreaterThanOrEqual(-1);
  expect(header.actionsToRail).toBeLessThanOrEqual(14);
  expect(header.actionsToRail).toBeGreaterThanOrEqual(-1);
  expect(header.overlapHeaderRail).toBe(false);
  // Alça compacta e linha de ações compacta (catch de regressão do vazio herdado da E9F).
  expect(header.dragH).toBeLessThanOrEqual(22);
  expect(header.headerH).toBeLessThanOrEqual(48);
  // Touch targets preservados (≥44px seguro para iPhone).
  expect(header.cancelH).toBeGreaterThanOrEqual(43.5);
  expect(header.confirmH).toBeGreaterThanOrEqual(43.5);
  // Diagnóstico coerente com as medidas reais.
  expect(header.diag.textEditorCompactHeaderEnabled).toBe(true);
  expect(header.diag.textEditorHandleToActionsGapPx).toBeLessThanOrEqual(14);
  expect(header.diag.textEditorActionsToToolRailGapPx).toBeLessThanOrEqual(14);
  await page.screenshot({ path: testInfo.outputPath('e9f1-cabecalho-compacto-390x797.png') });

  // Conteúdo para as checagens de Stage.
  await railTool('Editar texto').click();
  await page.locator('#textCreationInput').fill('Arco teste');

  // =========================================================================
  // TESTE 2 — ÍCONE DE ESTILO representa Bold + Italic (não é mais o "I" isolado).
  // =========================================================================
  const styleTab = railTool('Estilo');
  await expect(styleTab).toHaveAttribute('aria-label','Estilo');
  const styleHref = await styleTab.locator('use').getAttribute('href');
  expect(styleHref).toBe('#i-text-bold-italic');
  expect(styleHref).not.toBe('#i-text-style');           // não é o antigo "I" itálico
  expect((await styleTab.textContent()).trim()).toBe(''); // sem label textual na rail
  const styleSymbol = await page.evaluate(() => { const s = document.getElementById('i-text-bold-italic'); return s ? s.querySelectorAll('path,line,rect').length : 0; });
  expect(styleSymbol).toBeGreaterThanOrEqual(4);          // composição B + I, não um traço só

  // =========================================================================
  // TESTE 3 — ALINHAMENTO DINÂMICO: ícone da rail acompanha left/center/right.
  // =========================================================================
  await railTool('Alinhamento').click();
  expect(await page.evaluate(()=>pendingTextDraft.textAlign)).toBe('center'); // default center
  expect(await draftAlignHref()).toBe('#i-align-text-center');
  await sheet.getByRole('button',{name:'Alinhar Esquerda',exact:true}).click();
  expect(await page.evaluate(()=>pendingTextDraft.textAlign)).toBe('left');
  expect(await stageComputed('textAlign')).toBe('left');
  expect(await draftAlignHref()).toBe('#i-align-text-left');
  await sheet.getByRole('button',{name:'Alinhar Direita',exact:true}).click();
  expect(await page.evaluate(()=>pendingTextDraft.textAlign)).toBe('right');
  expect(await stageComputed('textAlign')).toBe('right');
  expect(await draftAlignHref()).toBe('#i-align-text-right');
  await sheet.getByRole('button',{name:'Alinhar Centro',exact:true}).click();
  expect(await draftAlignHref()).toBe('#i-align-text-center');

  // =========================================================================
  // TESTE 4 — QUICK PALETTE DE TEXTO (swatches neutros + preto/branco + botão +).
  // =========================================================================
  await railTool('Cor do texto').click();
  const textSwatchColors = await sheet.locator('#textColorSwatches .text-swatch[data-swatch-color]').evaluateAll(els=>els.map(e=>(e.dataset.swatchColor||'').toLowerCase()));
  expect(textSwatchColors.length).toBeGreaterThan(2);
  expect(textSwatchColors).toContain('#000000'); // preto
  expect(textSwatchColors).toContain('#ffffff'); // branco
  expect(textSwatchColors).toContain('#808080'); // cinza existente
  await expect(sheet.locator('#textColorSwatches .text-swatch-add')).toHaveCount(1); // botão + (decorativo, aria-hidden)
  // v8z4b32E9F6 — REG-055: o PRÓPRIO input nativo, sobreposto sobre a área do "+"
  // (alvo real de toque), carrega o aria-label acessível.
  expect(await sheet.locator('#textColorSwatches .text-swatch-add').getAttribute('aria-hidden')).toBe('true');
  expect(await page.locator('#textCreationColor').getAttribute('aria-label')).toBe('Escolher outra cor do texto');
  expect(await page.locator('#textCreationColor').count()).toBe(1); // picker completo acessível
  // Selecionar um preset: controle → pendingTextDraft.color → computed color do Stage.
  await sheet.locator('#textColorSwatches .text-swatch[data-swatch-color="#000000"]').click();
  expect(await draftColor()).toBe('#000000');
  expect(rgb(await stageComputed('color')).slice(0,3)).toEqual([0,0,0]);
  expect(await sheet.locator('#textColorSwatches .text-swatch.active').count()).toBe(1); // um swatch atual selecionado
  await sheet.locator('#textColorSwatches .text-swatch[data-swatch-color="#ffffff"]').click();
  expect(await draftColor()).toBe('#ffffff');
  expect(await sheet.locator('#textColorSwatches .text-swatch.active').count()).toBe(1);

  // =========================================================================
  // TESTE 5 — FUNDO TRANSPARENTE (Sem cor padrão → cor → alpha → Sem cor).
  // =========================================================================
  await railTool('Fundo da caixa').click();
  // Ícone de Fundo na rail é inequívoco de preenchimento (não a paleta genérica).
  expect(await railTool('Fundo da caixa').locator('use').getAttribute('href')).toBe('#i-box-fill');
  expect(await page.evaluate(()=>!!pendingTextDraft.boxBackgroundEnabled)).toBe(false); // padrão
  const noneBtn = () => sheet.locator('#textBgSwatches [data-swatch-none]');
  expect(await noneBtn().getAttribute('aria-pressed')).toBe('true');   // Sem cor selecionado
  expect(await noneBtn().getAttribute('aria-label')).toBe('Sem cor');
  expect(await noneBtn().getAttribute('title')).toBe('Transparente');
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeHidden();  // slider NÃO visível
  // Selecionar uma cor → enabled true, cor aplicada, slider visível.
  await sheet.locator('#textBgSwatches .text-swatch[data-swatch-color="#333333"]').click();
  expect(await page.evaluate(()=>!!pendingTextDraft.boxBackgroundEnabled)).toBe(true);
  expect(await page.evaluate(()=>String(pendingTextDraft.boxBackgroundColor).toLowerCase())).toBe('#333333');
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeVisible();
  await expect(sheet.locator('#textBgSwatches [data-swatch-none]')).toHaveAttribute('aria-pressed','false');
  // Mudar alpha: background alpha muda; glyph computed opacity/cor não é reduzido.
  await page.locator('#textBoxBackgroundOpacity').fill('40');
  await expect(page.locator('#textBoxBackgroundOpacityValue')).toHaveText('40%');
  const alphaProof = await page.evaluate(() => {
    const el = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(String(pendingTextDraft.id))}"]`);
    const cs = getComputedStyle(el); const nums = s => (String(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
    return { glyphAlpha:(nums(cs.color)[3] ?? 1), bgAlpha:(nums(cs.backgroundColor)[3] ?? 1), bgOpacity: pendingTextDraft.boxBackgroundOpacity };
  });
  expect(alphaProof.bgOpacity).toBeCloseTo(0.4, 5);
  expect(Math.abs(alphaProof.bgAlpha - 0.4)).toBeLessThan(0.02); // alfa pertence ao FUNDO
  expect(alphaProof.glyphAlpha).toBe(1);                         // glifos intactos
  // Selecionar Sem cor novamente → fundo desaparece; slider some; texto inalterado.
  const textBeforeNoColor = await page.evaluate(()=>pendingTextDraft.text);
  await sheet.locator('#textBgSwatches [data-swatch-none]').click();
  expect(await page.evaluate(()=>!!pendingTextDraft.boxBackgroundEnabled)).toBe(false);
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeHidden();
  expect(await page.evaluate(()=>pendingTextDraft.text)).toBe(textBeforeNoColor);
  expect(await page.evaluate(() => { const el = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(String(pendingTextDraft.id))}"]`); const nums = s => (String(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number); return (nums(getComputedStyle(el).color)[3] ?? 1); })).toBe(1);

  // =========================================================================
  // TESTE 6 — FUNDO E TEXTO COMPARTILHAM PRESETS (mesma constante única).
  // =========================================================================
  const palettes = await page.evaluate(() => ({
    constColors: (typeof PROJECT_BG_NEUTRALS !== 'undefined') ? PROJECT_BG_NEUTRALS.map(n => String(n.value).toLowerCase()) : null,
    projectSwatches: [...document.querySelectorAll('#bgSwatches .bg-swatch')].map(e => (e.dataset.color||'').toLowerCase()),
    textSwatches: [...document.querySelectorAll('#textColorSwatches .text-swatch[data-swatch-color]')].map(e => (e.dataset.swatchColor||'').toLowerCase()),
    bgSwatches: [...document.querySelectorAll('#textBgSwatches .text-swatch[data-swatch-color]')].map(e => (e.dataset.swatchColor||'').toLowerCase()),
  }));
  expect(palettes.constColors).not.toBeNull();          // abstração única existe
  const neutrals = palettes.constColors;
  expect(palettes.projectSwatches).toEqual(neutrals);   // Fundo do projeto deriva da constante
  const textNeutrals = palettes.textSwatches.filter(c => neutrals.includes(c));
  const bgNeutrals = palettes.bgSwatches.filter(c => neutrals.includes(c));
  expect(textNeutrals).toEqual(neutrals);               // Cor do texto usa os mesmos neutros
  expect(bgNeutrals).toEqual(neutrals);                 // Fundo da caixa usa os mesmos neutros
  // Não são três listas independentes copiadas: as três derivam da mesma fonte.
  expect(new Set([JSON.stringify(palettes.projectSwatches), JSON.stringify(textNeutrals), JSON.stringify(bgNeutrals)]).size).toBe(1);

  // Fecha o draft de exploração sem confirmar.
  await sheet.getByRole('button',{name:'Cancelar',exact:true}).click();
  await expect(sheet).not.toHaveClass(/open/);

  // =========================================================================
  // TESTE 7 — VIEWPORT AO EDITAR TEXTO EXISTENTE (localiza a VISTA, não o asset).
  // =========================================================================
  // Cria e confirma um texto.
  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill('Rodape');
  await sheet.getByRole('button',{name:'Confirmar',exact:true}).click();
  await expect(sheet).not.toHaveClass(/open/);
  const editedId = await page.evaluate(() => String(getSelectedAsset().id));
  // Leva o texto para perto da região inferior do Stage (pan de navegação; não move o asset).
  await panEditorViewport(page, 0, 0.36);
  // Geometria canônica + Frames + ProjectWorld + histórico ANTES da edição.
  const beforeEdit = await page.evaluate(id => {
    const a = assets.find(x => String(x.id) === id);
    return {
      canonical: JSON.stringify(serializeProjectAsset(a, 0, false)),
      geom: { worldX:a.worldX, worldY:a.worldY, worldW:a.worldW, worldH:a.worldH, rotation:a.rotation, depth:a.depth, zIndex:a.zIndex },
      frames: JSON.stringify(frames.slice(0, frameCount)),
      world: JSON.stringify(projectWorld),
      undo: undoStack.length, rev: _sessionAutosaveQueuedRevision,
      panX: editorPanX, panY: editorPanY, zoom: editorZoomScale,
    };
  }, editedId);
  // Abre a edição do texto existente e localiza a VISTA.
  await page.evaluate(id => startTextAssetEditing(assets.find(a => String(a.id) === id)), editedId);
  await expect(sheet).toHaveClass(/open/);
  await page.waitForTimeout(120);
  const localized = await page.evaluate(() => { ensureTextEditorTargetVisible(); const c = _textEditTargetScreenCenter(); const r = getTextEditorAvailableStageRect(); return { c, r, zoom: editorZoomScale, diag: getTextEditorE9F1Diagnostics() }; });
  // O texto fica dentro da área realmente visível acima da sheet.
  expect(localized.r && localized.r.valid).toBeTruthy();
  expect(localized.c.x).toBeGreaterThanOrEqual(localized.r.left);
  expect(localized.c.x).toBeLessThanOrEqual(localized.r.right);
  expect(localized.c.y).toBeGreaterThanOrEqual(localized.r.top);
  expect(localized.c.y).toBeLessThanOrEqual(localized.r.bottom);
  expect(localized.diag.textEditorEditViewportLocalizationRan).toBe(true);
  expect(localized.diag.textEditorEditTargetVisibleAboveSheet).toBe(true);
  expect(localized.zoom).toBeCloseTo(beforeEdit.zoom, 6); // preserva o zoom (só pan)
  await page.screenshot({ path: testInfo.outputPath('e9f1-viewport-edit-390x797.png') });
  // Geometria canônica / Frames / ProjectWorld / Undo / autosave INALTERADOS.
  const duringEdit = await page.evaluate(id => {
    const a = assets.find(x => String(x.id) === id);
    return { canonical: JSON.stringify(serializeProjectAsset(a, 0, false)), frames: JSON.stringify(frames.slice(0, frameCount)), world: JSON.stringify(projectWorld), undo: undoStack.length, rev: _sessionAutosaveQueuedRevision };
  }, editedId);
  expect(duringEdit.canonical).toBe(beforeEdit.canonical); // byte/valor equivalente
  expect(duringEdit.frames).toBe(beforeEdit.frames);
  expect(duringEdit.world).toBe(beforeEdit.world);
  expect(duringEdit.undo).toBe(beforeEdit.undo);           // sem Undo por localização
  expect(duringEdit.rev).toBe(beforeEdit.rev);             // sem autosave por localização
  expect(localized.diag.textEditorViewportLocalizationChangedCanonicalTextGeometry).toBe(false);
  expect(localized.diag.textEditorViewportLocalizationChangedFrames).toBe(false);
  expect(localized.diag.textEditorViewportLocalizationChangedProjectWorld).toBe(false);
  expect(localized.diag.textEditorViewportLocalizationCreatedUndo).toBe(false);
  expect(localized.diag.textEditorViewportLocalizationScheduledAutosave).toBe(false);
  // Altera a altura disponível (simula o teclado) e recalcula — continua visível, sem jitter.
  await page.setViewportSize({ width:390, height:560 });
  await page.waitForTimeout(120);
  const afterResize = await page.evaluate(() => {
    ensureTextEditorTargetVisible();
    const panA = { x: editorPanX, y: editorPanY };
    // segunda chamada não deve mexer no pan (deadzone anti-jitter)
    ensureTextEditorTargetVisible();
    const panB = { x: editorPanX, y: editorPanY };
    const c = _textEditTargetScreenCenter(); const r = getTextEditorAvailableStageRect();
    return { c, r, panA, panB };
  });
  expect(afterResize.r && afterResize.r.valid).toBeTruthy();
  expect(afterResize.c.y).toBeGreaterThanOrEqual(afterResize.r.top);
  expect(afterResize.c.y).toBeLessThanOrEqual(afterResize.r.bottom);
  expect(Math.abs(afterResize.panB.x - afterResize.panA.x)).toBeLessThan(0.01); // sem jitter
  expect(Math.abs(afterResize.panB.y - afterResize.panA.y)).toBeLessThan(0.01);
  // Geometria canônica ainda intacta após o resize.
  expect(await page.evaluate(id => JSON.stringify(serializeProjectAsset(assets.find(x => String(x.id) === id), 0, false)), editedId)).toBe(beforeEdit.canonical);
  await page.evaluate(() => cancelTextCreation());
  await page.setViewportSize({ width:390, height:797 });

  // =========================================================================
  // TESTE 8 — CREATE MODE NÃO REGREDIU (E9E: novo texto nasce no centro da vista).
  // =========================================================================
  await panEditorViewport(page, 0.18, -0.12);
  const createProof = await page.evaluate(() => {
    const viewCenter = getEditorViewCenterWorld();
    startTextCreation();
    const c = { x: pendingTextDraft.worldX + pendingTextDraft.worldW/2, y: pendingTextDraft.worldY + pendingTextDraft.worldH/2 };
    const base = { x: (projectWorld.baseStageW||0)/2, y: (projectWorld.baseStageH||0)/2 };
    return { viewCenter, c, base };
  });
  expect(Math.abs(createProof.c.x - createProof.viewCenter.x)).toBeLessThan(2); // nasce no centro da vista
  expect(Math.abs(createProof.c.y - createProof.viewCenter.y)).toBeLessThan(2);
  // Com pan aplicado, o centro da vista difere do centro da célula base (não regrediu para o base).
  expect(Math.hypot(createProof.viewCenter.x - createProof.base.x, createProof.viewCenter.y - createProof.base.y)).toBeGreaterThan(2);

  // =========================================================================
  // TESTE 9 — LARGURA AUTO + SIDE WIDTH HANDLE (E9G: arrastar a alça entra em fixed;
  // a lateral OPOSTA fica ancorada; Auto volta ao cálculo automático).
  // =========================================================================
  await page.locator('#textCreationInput').fill('Largura teste');
  await railTool('Largura da caixa').click();
  const widthPanel = sheet.locator('[data-text-panel="width"]');
  expect(await widthPanel.getByRole('button',{name:'Ajustar largura automaticamente',exact:true}).count()).toBe(1); // único botão de modo
  expect(await widthPanel.locator('input[type="range"]').count()).toBe(0); // sem slider de largura
  expect(await widthPanel.locator('#textWidthFixedMode').count()).toBe(0); // sem botão Fixa
  expect(await widthPanel.locator('#textWidthFixedStepper').count()).toBe(0); // sem −/+
  // Estado inicial Auto.
  expect(await page.evaluate(()=>pendingTextDraft.boxWidthMode)).toBe('auto');
  await expect(page.locator('#textWidthAuto')).toHaveClass(/active/);
  // Arrastar a alça DIREITA → fixed, boxWidth muda, lateral ESQUERDA permanece ancorada,
  // Auto perde ativo, seleção e as quatro corner handles acompanham.
  const beforeDrag = await page.evaluate(() => {
    const d = pendingTextDraft; const sel = document.getElementById('assetSelectOutline'); const sr = sel.getBoundingClientRect();
    return { boxWidth: Math.round(d.boxWidth), leftEdge: sr.x };
  });
  await dragTextWidthHandleBy(page, 'right', 60);
  expect(await page.evaluate(()=>pendingTextDraft.boxWidthMode)).toBe('fixed');
  await expect(page.locator('#textWidthAuto')).not.toHaveClass(/active/);
  const fixedState = await page.evaluate(() => {
    const d = pendingTextDraft; const el = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(String(d.id))}"]`);
    const sel = document.getElementById('assetSelectOutline');
    const r = el.getBoundingClientRect(), sr = sel.getBoundingClientRect();
    const handles = [...sel.querySelectorAll('.asset-corner-handle.show')].map(h=>h.dataset.assetCorner).sort();
    const widthHandles = [...sel.querySelectorAll('.text-width-handle.show')].map(h=>h.dataset.assetWidthHandle).sort();
    return { boxWidth: Math.round(d.boxWidth), leftEdge: sr.x, parity:['x','y','width','height'].every(k=>Math.abs(r[k]-sr[k])<1.4), handles, widthHandles };
  });
  expect(fixedState.boxWidth).not.toBe(beforeDrag.boxWidth); // boxWidth muda
  expect(fixedState.boxWidth).toBeGreaterThan(beforeDrag.boxWidth); // arrastar a direita para fora aumenta a largura
  expect(Math.abs(fixedState.leftEdge - beforeDrag.leftEdge)).toBeLessThan(1.5); // lateral esquerda ancorada
  expect(fixedState.parity).toBe(true);                   // seleção acompanha (Stage reflow)
  expect(fixedState.handles).toEqual(['bl','br','tl','tr']); // quatro corner handles acompanham
  expect(fixedState.widthHandles).toEqual(['left','right']); // as duas side width handles continuam presentes
  // Diagnóstico: o gesto ativou fixed e preservou escala/ancoragem (REG-056/E9G).
  const dragDiag = await page.evaluate(()=>getTextEditorE9F1Diagnostics());
  expect(dragDiag.textWidthModeBefore).toBe('auto');
  expect(dragDiag.textWidthModeAfter).toBe('fixed');
  expect(dragDiag.textWidthScalePreserved).toBe(true);
  expect(dragDiag.textWidthOppositeEdgeAnchored).toBe(true);
  // Tocar Auto → auto, ativo, medição automática canônica, sem salto indevido de centro.
  const centerBeforeAuto = await page.evaluate(()=>({x:pendingTextDraft.worldX+pendingTextDraft.worldW/2,y:pendingTextDraft.worldY+pendingTextDraft.worldH/2}));
  await page.locator('#textWidthAuto').click();
  expect(await page.evaluate(()=>pendingTextDraft.boxWidthMode)).toBe('auto');
  await expect(page.locator('#textWidthAuto')).toHaveClass(/active/);
  const centerAfterAuto = await page.evaluate(()=>({x:pendingTextDraft.worldX+pendingTextDraft.worldW/2,y:pendingTextDraft.worldY+pendingTextDraft.worldH/2}));
  expect(Math.abs(centerAfterAuto.x - centerBeforeAuto.x)).toBeLessThan(1.5);
  expect(Math.abs(centerAfterAuto.y - centerBeforeAuto.y)).toBeLessThan(1.5);
  const autoDiag = await page.evaluate(()=>getTextEditorE9F1Diagnostics());
  expect(autoDiag.textEditorWidthAutoButtonRestoredAutoMode).toBe(true);
  expect(autoDiag.textEditorWidthHasFixedButton).toBe(false);
  expect(autoDiag.textEditorWidthHasPlusMinusStepper).toBe(false);

  // =========================================================================
  // TESTE 10 — E9G: exatamente quatro corner handles + duas side width handles
  // (Text Asset), sistemas distintos (REG-028 especializado).
  // =========================================================================
  const handleAudit = await page.evaluate(() => {
    const sel = document.getElementById('assetSelectOutline');
    return {
      shown: [...sel.querySelectorAll('.asset-corner-handle.show')].map(h=>h.dataset.assetCorner).sort(),
      all: [...document.querySelectorAll('.asset-corner-handle')].map(h=>h.dataset.assetCorner).sort(),
      widthShown: [...sel.querySelectorAll('.text-width-handle.show')].map(h=>h.dataset.assetWidthHandle).sort(),
      widthAll: [...document.querySelectorAll('.text-width-handle')].map(h=>h.dataset.assetWidthHandle).sort(),
    };
  });
  expect(handleAudit.shown).toEqual(['bl','br','tl','tr']);
  expect(handleAudit.all).toEqual(['bl','br','tl','tr']);
  expect(handleAudit.widthShown).toEqual(['left','right']);
  expect(handleAudit.widthAll).toEqual(['left','right']);

  // =========================================================================
  // TESTE 11 — CANCEL / CONFIRM / MINIMIZE (proteção E9F/E9E reexecutada).
  // =========================================================================
  // Minimizar por gesto preserva draft + propriedade ativa; zero Undo/autosave.
  const beforeMin = await page.evaluate(() => ({ id:String(pendingTextDraft.id), fields:textEditorDraftFields(pendingTextDraft), undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, tool:textEditorActiveTool }));
  await page.evaluate(() => {
    const el = document.getElementById('textCreationDrag'); const r = el.getBoundingClientRect();
    const x = r.left + r.width/2, y = r.top + r.height/2;
    el.dispatchEvent(new PointerEvent('pointerdown',{clientX:x,clientY:y,bubbles:true,pointerId:1}));
    window.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y+60,bubbles:true,pointerId:1}));
    window.dispatchEvent(new PointerEvent('pointerup',{clientX:x,clientY:y+60,bubbles:true,pointerId:1}));
  });
  await expect(sheet).not.toHaveClass(/open/);
  const afterMin = await page.evaluate(() => ({ exists:!!pendingTextDraft, id:pendingTextDraft?String(pendingTextDraft.id):null, fields:pendingTextDraft?textEditorDraftFields(pendingTextDraft):null, undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, tool:textEditorActiveTool }));
  expect(afterMin).toEqual({ exists:true, id:beforeMin.id, fields:beforeMin.fields, undo:beforeMin.undo, rev:beforeMin.rev, tool:beforeMin.tool });
  // Cancel restaura confirmado (descarta o draft; zero commit/Undo/autosave).
  const beforeCancel = await page.evaluate(() => ({ undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, count:assets.length }));
  await page.evaluate(() => startTextCreation());
  await expect(sheet).toHaveClass(/open/);
  await page.evaluate(() => cancelTextCreation());
  await expect(sheet).not.toHaveClass(/open/);
  expect(await page.evaluate(() => ({ draft:!!pendingTextDraft, undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, count:assets.length }))).toEqual({ draft:false, ...beforeCancel });
  // Confirm cria exatamente 1 Undo + 1 autosave; mesmo asset ID; sem jump.
  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill('Final E9F1');
  const commitBefore = await page.evaluate(() => ({ id:String(pendingTextDraft.id), undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, count:assets.length }));
  await sheet.getByRole('button',{name:'Confirmar',exact:true}).click();
  await expect(sheet).not.toHaveClass(/open/);
  const commitAfter = await page.evaluate(id => { const a = assets.find(x => String(x.id)===id); const el = document.querySelector(`.world-text-asset[data-asset-id="${CSS.escape(id)}"]`); const o = document.getElementById('assetSelectOutline'); const r = el.getBoundingClientRect(), ob = o.getBoundingClientRect(); return { exists:!!a, id:String(getSelectedAsset().id), undo:undoStack.length, rev:_sessionAutosaveQueuedRevision, count:assets.length, parity:['x','y','width','height'].every(k => Math.abs(r[k]-ob[k])<1.3) }; }, commitBefore.id);
  expect(commitAfter.exists).toBe(true);
  expect(commitAfter.id).toBe(commitBefore.id);
  expect(commitAfter.count).toBe(commitBefore.count + 1);
  expect(commitAfter.undo).toBe(commitBefore.undo + 1);
  expect(commitAfter.rev).toBe(commitBefore.rev + 1);
  expect(commitAfter.parity).toBe(true);
});

// v8z4b32E9G — gate central da manipulação direta de largura do Text Asset no Stage
// por duas alças laterais (side width handles), substituindo a edição manual do
// painel (slider), e da correção REG-056 (a faixa lógica de largura disponível não
// pode diminuir só porque o Text Asset foi escalado). Cobre: contagem de alças por
// tipo de ativo (imagem = 4+0, texto = 4+2), separação corner(escala)×side(largura),
// ancoragem da lateral oposta sob rotação não trivial, gesto direto fora do editor =
// exatamente 1 Undo/1 autosave, pointercancel restaura integralmente, Undo/Redo,
// REG-056 (mesma faixa lógica de textBaseBoxWidth em 50/100/200%), clamp/no-op no
// limite lógico (zero Undo/dirty/autosave, geometria intacta — distinto de um gesto
// válido com delta real), fundo/padding acompanhando o reflow e Save/Load preservando
// os campos relevantes.
test('E9G — side width handles do Text Asset: largura direta no Stage separada de escala (REG-056)', async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 390, height: 797 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await dismissProModalIfVisible(page);
  await page.locator('#modeAssetsBtn').click();

  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill('Largura E9G de teste');
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  const id = await page.evaluate(() => String(getSelectedAsset().id));
  const selectText = async () => {
    const box = await page.locator(`.world-text-asset[data-asset-id="${id}"]`).boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    expect(await page.evaluate(() => String(selectedAssetId))).toBe(id);
  };
  const readAsset = () => page.evaluate(id => { const a = assets.find(x => String(x.id) === id); return { fontSize:a.fontSize, textBaseFontSize:a.textBaseFontSize, boxWidth:a.boxWidth, textBaseBoxWidth:a.textBaseBoxWidth, worldX:a.worldX, worldY:a.worldY, worldW:a.worldW, worldH:a.worldH, rotation:a.rotation, boxWidthMode:a.boxWidthMode, pct: getAssetContextScalePercent(a) }; }, id);
  const setScalePercent = async pct => {
    await page.locator('#tbAssetScale').click();
    await page.locator('#assetContextSlider').fill(String(pct));
    await page.locator('#assetContextSlider').dispatchEvent('change');
    await expect(page.locator('#assetContextValue')).toHaveText(pct + '%');
    await page.getByRole('button', { name: 'Voltar' }).click();
  };

  // v8z4b32E9G-R1 — correção de revisão (Blocker 2): a largura Auto do texto recém-
  // criado nasce da medição natural do conteúdo, que pode ficar perto do limite lógico
  // MÁXIMO dependendo da fixture/viewport — um drag de AUMENTO ali seria um clamp
  // legítimo (no-op), não prova nem reprova a side handle. Prepara o Text Asset em
  // Fixed com textBaseBoxWidth no MEIO da faixa lógica (folga real para crescer e para
  // encolher nos dois sentidos), preservando a escala canônica (100% logo após a
  // criação: boxWidth == textBaseBoxWidth). Estado de SETUP, não o comportamento sob
  // teste — mesmo princípio já usado alhures neste arquivo para preparar precondições
  // de largura fixa sem depender do slider/gesto público.
  await page.evaluate(id => {
    const a = assets.find(x => String(x.id) === id);
    const bounds = getTextWidthLogicalBounds();
    const mid = (bounds.min + bounds.max) / 2;
    a.boxWidthMode = 'fixed';
    a.textBaseBoxWidth = mid;
    a.boxWidth = mid;
    measureTextAsset(a);
    renderProjectWorldExtraImages();
    renderAssetSelectionOverlay();
  }, id);

  // ---------- A) contagem por tipo: imagem 4+0, Text Asset 4+2 ----------
  const imageId = await page.evaluate(() => assets.find(a => a && a.type === 'image').id);
  await page.evaluate(id => selectAssetById(id, 'e9g-test'), String(imageId));
  const imageHandles = await page.evaluate(() => {
    const sel = document.getElementById('assetSelectOutline');
    return { corners: sel.querySelectorAll('.asset-corner-handle.show').length, width: sel.querySelectorAll('.text-width-handle.show').length };
  });
  expect(imageHandles).toEqual({ corners: 4, width: 0 });
  await selectText();
  const textHandles = await page.evaluate(() => {
    const sel = document.getElementById('assetSelectOutline');
    return {
      corners: [...sel.querySelectorAll('.asset-corner-handle.show')].map(h => h.dataset.assetCorner).sort(),
      width: [...sel.querySelectorAll('.text-width-handle.show')].map(h => h.dataset.assetWidthHandle).sort(),
    };
  });
  expect(textHandles.corners).toEqual(['bl', 'br', 'tl', 'tr']);
  expect(textHandles.width).toEqual(['left', 'right']);

  // ---------- B) CORNER escala (fontSize+boxWidth juntos); SIDE nunca escala ----------
  const beforeCorner = await readAsset();
  const corner = page.locator('.asset-corner-handle[data-asset-corner="br"]');
  const doCornerDrag = async () => {
    const cornerBox = await corner.boundingBox();
    await page.mouse.move(cornerBox.x + cornerBox.width / 2, cornerBox.y + cornerBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(cornerBox.x + 40, cornerBox.y + 40, { steps: 5 });
    await page.mouse.up();
  };
  await doCornerDrag();
  // v8z4b32E9G-R2 — DIAGNÓSTICO OBRIGATÓRIO: lifecycle do corner drag logo após o
  // pointerup real, medido (não assumido) para descartar/confirmar estado residual de
  // assetTransformDragState bloqueando o próximo gesto (side width handle).
  const afterCornerUp = await page.evaluate(id => ({
    assetTransformDragStateActive: typeof assetTransformDragState !== 'undefined' && !!assetTransformDragState,
    selectedAssetId: typeof selectedAssetId !== 'undefined' && selectedAssetId != null ? String(selectedAssetId) : null,
  }), id);
  console.log('[E9G diag] afterCornerUp', JSON.stringify(afterCornerUp));
  expect(afterCornerUp.assetTransformDragStateActive, 'assetTransformDragState deve ficar idle após pointerup real do corner').toBe(false);
  expect(afterCornerUp.selectedAssetId).toBe(id);
  const afterCorner1 = await readAsset();
  expect(afterCorner1.fontSize).not.toBeCloseTo(beforeCorner.fontSize, 3); // corner altera a fonte
  expect(afterCorner1.textBaseFontSize).toBeCloseTo(beforeCorner.textBaseFontSize, 5); // baseline não muda

  // B-direto) sequência mais direta do usuário: escalar pelos cantos → SEM Undo →
  // ajustar largura pela side handle já precisa funcionar, sem re-seleção nem reset
  // escondido.
  const beforeSideNoUndo = await readAsset();
  const dragNoUndo = await dragTextWidthHandleBy(page, 'right', 60);
  console.log('[E9G diag] side drag (corner sem Undo)', JSON.stringify(dragNoUndo.diag));
  const afterSideNoUndo = await readAsset();
  expect(afterSideNoUndo.boxWidth, `corner→SEM Undo→side deve mudar boxWidth; diag=${JSON.stringify(dragNoUndo.diag)}`).not.toBeCloseTo(beforeSideNoUndo.boxWidth, 0);
  expect(afterSideNoUndo.fontSize).toBe(beforeSideNoUndo.fontSize); // side não escala mesmo empilhado sobre corner sem Undo
  await page.locator('#topBtnUndo').click(); // desfaz o side drag
  await page.locator('#topBtnUndo').click(); // desfaz o corner drag
  expect(await readAsset()).toEqual(beforeCorner); // volta ao baseline limpo

  // B-com-Undo) sequência relatada na revisão: corner drag → pointerup → Undo → side.
  await doCornerDrag();
  const afterCorner2 = await readAsset();
  expect(afterCorner2.fontSize).not.toBeCloseTo(beforeCorner.fontSize, 3);
  await page.locator('#topBtnUndo').click(); // desfaz só o corner drag
  // DIAGNÓSTICO OBRIGATÓRIO: lifecycle logo após o Undo.
  const afterUndo = await page.evaluate(id => {
    const sel = document.getElementById('assetSelectOutline');
    return {
      assetTransformDragStateActive: typeof assetTransformDragState !== 'undefined' && !!assetTransformDragState,
      selectedAssetId: typeof selectedAssetId !== 'undefined' && selectedAssetId != null ? String(selectedAssetId) : null,
      cornerHandlesShown: sel ? sel.querySelectorAll('.asset-corner-handle.show').length : -1,
      widthHandlesShown: sel ? sel.querySelectorAll('.text-width-handle.show').length : -1,
    };
  }, id);
  console.log('[E9G diag] afterUndo', JSON.stringify(afterUndo));
  expect(afterUndo.assetTransformDragStateActive, 'assetTransformDragState deve continuar idle após Undo').toBe(false);
  expect(afterUndo.selectedAssetId).toBe(id);
  expect(afterUndo.cornerHandlesShown).toBe(4);
  expect(afterUndo.widthHandlesShown).toBe(2);

  const beforeSide = await readAsset();
  const preSideDrag = await page.evaluate(id => {
    const resolved = typeof resolveActiveTextAssetForWidthDrag === 'function' ? resolveActiveTextAssetForWidthDrag() : null;
    return {
      boxWidth: resolved ? resolved.asset.boxWidth : null,
      textBaseBoxWidth: resolved ? resolved.asset.textBaseBoxWidth : null,
      selectedAssetId: typeof selectedAssetId !== 'undefined' && selectedAssetId != null ? String(selectedAssetId) : null,
      assetTransformDragStateActive: typeof assetTransformDragState !== 'undefined' && !!assetTransformDragState,
      textWidthDragStateActive: typeof textWidthDragState !== 'undefined' && !!textWidthDragState,
    };
  }, id);
  console.log('[E9G diag] preSideDrag', JSON.stringify(preSideDrag));
  const sideDrag = await dragTextWidthHandleBy(page, 'right', 60);
  console.log('[E9G diag] side drag (após Undo do corner)', JSON.stringify(sideDrag.diag));
  const afterSide = await readAsset();
  expect(afterSide.fontSize).toBe(beforeSide.fontSize); // SIDE nunca muda fontSize
  expect(afterSide.textBaseFontSize).toBe(beforeSide.textBaseFontSize);
  expect(Math.abs(afterSide.pct - beforeSide.pct)).toBeLessThan(0.05); // escala% preservada
  expect(afterSide.boxWidth, `largura mudou de verdade; preSideDrag=${JSON.stringify(preSideDrag)} diag=${JSON.stringify(sideDrag.diag)}`).not.toBeCloseTo(beforeSide.boxWidth, 0);
  expect(afterSide.boxWidthMode).toBe('fixed'); // primeiro delta efetivo entra em fixed
  // DIAGNÓSTICO OBRIGATÓRIO: estado pós-pointerup do produto (não só do helper).
  const postSideProductDiag = await page.evaluate(() => getTextEditorE9F1Diagnostics());
  console.log('[E9G diag] postSideProductDiag', JSON.stringify({
    textWidthGestureActive: postSideProductDiag.textWidthGestureActive,
    textWidthCurrentBoxWidth: postSideProductDiag.textWidthCurrentBoxWidth,
    textWidthModeBefore: postSideProductDiag.textWidthModeBefore,
    textWidthModeAfter: postSideProductDiag.textWidthModeAfter,
    textWidthScalePreserved: postSideProductDiag.textWidthScalePreserved,
    textWidthOppositeEdgeAnchored: postSideProductDiag.textWidthOppositeEdgeAnchored,
  }));
  expect(postSideProductDiag.textWidthGestureActive).toBe(false);
  expect(postSideProductDiag.textWidthScalePreserved).toBe(true);
  expect(postSideProductDiag.textWidthOppositeEdgeAnchored).toBe(true);

  // ---------- C) gesto direto fora do editor = exatamente 1 Undo + 1 autosave ----------
  const undoBefore = await page.evaluate(() => undoStack.length);
  const revBefore = await page.evaluate(() => _sessionAutosaveQueuedRevision);
  await dragTextWidthHandleBy(page, 'left', -30);
  expect(await page.evaluate(() => undoStack.length)).toBe(undoBefore + 1);
  expect(await page.evaluate(() => _sessionAutosaveQueuedRevision)).toBe(revBefore + 1);

  // ---------- D) pointercancel restaura integralmente; zero Undo/autosave ----------
  const preCancel = await readAsset();
  const undoBeforeCancel = await page.evaluate(() => undoStack.length);
  const revBeforeCancel = await page.evaluate(() => _sessionAutosaveQueuedRevision);
  await dragTextWidthHandle(page, 'right', [[80, 0]], { cancel: true });
  const postCancel = await readAsset();
  expect(postCancel).toEqual(preCancel);
  expect(await page.evaluate(() => undoStack.length)).toBe(undoBeforeCancel);
  expect(await page.evaluate(() => _sessionAutosaveQueuedRevision)).toBe(revBeforeCancel);
  expect((await page.evaluate(() => getTextEditorE9F1Diagnostics())).textWidthPointerCancelRestored).toBe(true);

  // ---------- E) Undo/Redo restauram largura/posição/boxWidthMode ----------
  const beforeUR = await readAsset();
  await dragTextWidthHandleBy(page, 'right', 45);
  const afterUR = await readAsset();
  await page.locator('#topBtnUndo').click();
  await expect.poll(readAsset).toEqual(beforeUR);
  await page.locator('#topBtnRedo').click();
  await expect.poll(readAsset).toEqual(afterUR);
  await page.locator('#topBtnUndo').click(); // volta ao estado anterior ao passo E

  // ---------- F) rotação não trivial: lateral oposta ancorada no World ----------
  await page.locator('#tbAssetRotate').click();
  await page.locator('#assetContextSlider').fill('45');
  await page.locator('#assetContextSlider').dispatchEvent('change');
  await expect(page.locator('#assetContextValue')).toHaveText('45°');
  await page.getByRole('button', { name: 'Voltar' }).click();
  const computeAnchor = (side, centerX, centerY, worldW, rotDeg) => {
    const rot = rotDeg * Math.PI / 180, half = worldW / 2 * (side === 'right' ? -1 : 1);
    return { x: centerX + half * Math.cos(rot), y: centerY + half * Math.sin(rot) };
  };
  const beforeRot = await readAsset();
  const anchorBefore = computeAnchor('right', beforeRot.worldX + beforeRot.worldW / 2, beforeRot.worldY + beforeRot.worldH / 2, beforeRot.worldW, beforeRot.rotation);
  await dragTextWidthHandleBy(page, 'right', 90);
  const afterRot = await readAsset();
  const anchorAfter = computeAnchor('right', afterRot.worldX + afterRot.worldW / 2, afterRot.worldY + afterRot.worldH / 2, afterRot.worldW, afterRot.rotation);
  expect(afterRot.rotation).toBe(beforeRot.rotation); // rotação intocada
  expect(afterRot.fontSize).toBe(beforeRot.fontSize); // fontSize intocado
  expect(Math.abs(afterRot.pct - beforeRot.pct)).toBeLessThan(0.05); // escala% preservada
  expect(afterRot.worldW).not.toBeCloseTo(beforeRot.worldW, 0); // largura mudou de verdade
  expect(Math.hypot(anchorAfter.x - anchorBefore.x, anchorAfter.y - anchorBefore.y)).toBeLessThan(1); // lateral esquerda ancorada no World sob rotação
  await page.locator('#topBtnUndo').click(); // desfaz o width drag rotacionado
  await page.locator('#topBtnUndo').click(); // desfaz a rotação de 45°

  // ---------- G) REG-056: mesma faixa LÓGICA de largura em 50/100/200% ----------
  const bounds = await page.evaluate(() => getTextWidthLogicalBounds());
  for (const scalePct of [50, 100, 200]) {
    await setScalePercent(scalePct);
    await expect.poll(async () => Math.round((await readAsset()).pct)).toBe(scalePct);
    await dragTextWidthHandleBy(page, 'right', 3000); // arrasta até o limite lógico MÁXIMO
    let s = await readAsset();
    expect(s.textBaseBoxWidth).toBeCloseTo(bounds.max, 0); // MESMA faixa lógica em qualquer escala
    expect(Number.isFinite(s.worldW) && s.worldW > 0).toBe(true);
    expect(s.fontSize).toBeCloseTo(s.textBaseFontSize * (scalePct / 100), 3); // width drag não escala a fonte
    await page.locator('#topBtnUndo').click();
    await dragTextWidthHandleBy(page, 'right', -3000); // arrasta até o limite lógico MÍNIMO
    s = await readAsset();
    expect(s.textBaseBoxWidth).toBeCloseTo(bounds.min, 0);
    expect(Number.isFinite(s.worldW) && s.worldW > 0).toBe(true);
    await page.locator('#topBtnUndo').click();
    await page.locator('#topBtnUndo').click(); // desfaz a mudança de escala desta iteração
  }

  // ---------- G2) CLAMP/NO-OP: gesto absorvido pelo limite lógico não altera
  // geometria nem gera Undo/dirty/autosave — diferencia GESTO VÁLIDO COM DELTA
  // (seções B/G acima) de GESTO CLAMPADO SEM ALTERAÇÃO (Blocker 3 da revisão) ----------
  for (const boundKind of ['max', 'min']) {
    await page.evaluate(({ id, boundKind }) => {
      const a = assets.find(x => String(x.id) === id);
      const bounds = getTextWidthLogicalBounds();
      const target = boundKind === 'max' ? bounds.max : bounds.min;
      a.boxWidthMode = 'fixed';
      a.rotation = 0;
      a.textBaseBoxWidth = target;
      a.boxWidth = target;
      measureTextAsset(a);
      renderProjectWorldExtraImages();
      renderAssetSelectionOverlay();
    }, { id, boundKind });
    const before = await readAsset();
    const undoBeforeClamp = await page.evaluate(() => undoStack.length);
    const revBeforeClamp = await page.evaluate(() => _sessionAutosaveQueuedRevision);
    // No máximo, tenta crescer mais (extrapolaria); no mínimo, tenta encolher mais.
    await dragTextWidthHandleBy(page, 'right', boundKind === 'max' ? 300 : -300);
    const after = await readAsset();
    expect(after.boxWidth).toBeCloseTo(before.boxWidth, 3);
    expect(after.textBaseBoxWidth).toBeCloseTo(before.textBaseBoxWidth, 3);
    expect(after.worldX).toBeCloseTo(before.worldX, 3);
    expect(after.worldY).toBeCloseTo(before.worldY, 3);
    expect(after.worldW).toBeCloseTo(before.worldW, 3);
    expect(after.worldH).toBeCloseTo(before.worldH, 3);
    expect(after.boxWidthMode).toBe(before.boxWidthMode); // sem mudança espúria de modo
    expect(await page.evaluate(() => undoStack.length)).toBe(undoBeforeClamp); // clamp/no-op: 0 Undo
    expect(await page.evaluate(() => _sessionAutosaveQueuedRevision)).toBe(revBeforeClamp); // 0 autosave
  }

  // ---------- H) fundo/padding acompanham o reflow; nada se descola ----------
  await selectText();
  await page.locator('#tbAssetReplace').click();
  await page.getByRole('tab', { name: 'Fundo da caixa', exact: true }).click();
  await enableTextBoxColor(page, '#224466');
  await page.locator('#textBoxBackgroundOpacity').fill('55');
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  const beforeBg = await page.evaluate(id => { const a = assets.find(x => String(x.id) === id), m = measureTextAsset({ ...a }); return { boxWidth:a.boxWidth, worldW:a.worldW, paddingX:m.paddingX, color:a.boxBackgroundColor, opacity:a.boxBackgroundOpacity }; }, id);
  await dragTextWidthHandleBy(page, 'right', 55);
  const afterBg = await page.evaluate(id => { const a = assets.find(x => String(x.id) === id), m = measureTextAsset({ ...a }); return { boxWidth:a.boxWidth, worldW:a.worldW, paddingX:m.paddingX, color:a.boxBackgroundColor, opacity:a.boxBackgroundOpacity }; }, id);
  expect(afterBg.worldW).toBeCloseTo(afterBg.boxWidth + 2 * afterBg.paddingX, 1); // worldW = boxWidth + 2·paddingX
  expect(afterBg.paddingX).toBeCloseTo(beforeBg.paddingX, 3); // padding não muda pelo width drag
  expect(afterBg.color).toBe(beforeBg.color);
  expect(afterBg.opacity).toBe(beforeBg.opacity);
  const bgEl = page.locator(`.world-text-asset[data-asset-id="${id}"]`);
  const bgRect = await bgEl.boundingBox();
  const outlineRect = await page.locator('#assetSelectOutline').boundingBox();
  for (const k of ['x', 'y', 'width', 'height']) expect(Math.abs(bgRect[k] - outlineRect[k])).toBeLessThan(1.5); // fundo acompanha o novo worldW sem descolar

  // ---------- I) Save/Load preservam boxWidth/textBaseBoxWidth/boxWidthMode/rotation/posição ----------
  const beforeSave = await readAsset();
  const downloadPromise = page.waitForEvent('download');
  await page.evaluate(() => doSaveDirect(true, 'e9g-width-handles'));
  const download = await downloadPromise; const savedPath = await download.path(); expect(savedPath).toBeTruthy();
  await page.locator('#projectFileInput').setInputFiles(savedPath);
  await expect.poll(() => page.evaluate(() => loadSessionCompleted), { timeout: 30_000 }).toBe(true);
  expect(await page.evaluate(() => lastLoadError)).toBe('');
  const afterLoad = await readAsset();
  expect(afterLoad).toEqual(beforeSave);

  // ---------- J) caixa pequena em 390×797: as seis alças permanecem alcançáveis ----------
  await page.locator('#modeAssetsBtn').click();
  await page.evaluate(() => startTextCreation());
  await page.locator('#textCreationInput').fill('R');
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  const smallId = await page.evaluate(() => String(getSelectedAsset().id));
  await page.evaluate(id => { const a = assets.find(x => String(x.id) === id); a.boxWidthMode = 'fixed'; a.boxWidth = 60; a.textBaseBoxWidth = 60; a.fontSize = 12; a.textBaseFontSize = 12; measureTextAsset(a); renderProjectWorldExtraImages(); renderAssetSelectionOverlay(); }, smallId);
  const smallBox = await page.locator(`.world-text-asset[data-asset-id="${smallId}"]`).boundingBox();
  await page.touchscreen.tap(smallBox.x + smallBox.width / 2, smallBox.y + smallBox.height / 2);
  const smallHandles = await page.evaluate(() => {
    const sel = document.getElementById('assetSelectOutline');
    const rect = el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, w:r.width, h:r.height }; };
    return {
      corners: [...sel.querySelectorAll('.asset-corner-handle.show')].map(h => ({ c:h.dataset.assetCorner, ...rect(h) })),
      width: [...sel.querySelectorAll('.text-width-handle.show')].map(h => ({ c:h.dataset.assetWidthHandle, ...rect(h) })),
      viewportOverflow: document.documentElement.scrollWidth > 390,
    };
  });
  expect(smallHandles.corners.map(h => h.c).sort()).toEqual(['bl', 'br', 'tl', 'tr']);
  expect(smallHandles.width.map(h => h.c).sort()).toEqual(['left', 'right']);
  expect(smallHandles.viewportOverflow).toBe(false);
  for (const h of [...smallHandles.corners, ...smallHandles.width]) expect(h.w).toBeGreaterThan(0); // nenhuma alça com área nula/inalcançável

  // ---------- K) Preview/Export nunca mostram as side width handles ----------
  await page.evaluate(() => startPreview());
  await expect(page.locator('#previewScreen')).toHaveClass(/show/, { timeout: 30_000 });
  await expect.poll(() => page.evaluate(() => previewLoadingHiddenAfterFirstFrame), { timeout: 30_000 }).toBe(true);
  const previewHandles = await page.evaluate(() => {
    const screen = document.getElementById('previewScreen');
    return [...document.querySelectorAll('.text-width-handle.show')].some(h => screen.contains(h));
  });
  expect(previewHandles).toBe(false);
  await page.evaluate(() => stopPreview());
});

// v8z4b32E9F2 — gate de REG-054. Com 2+ Frames selecionados, os controles PÚBLICOS
// de Posição/Escala/Rotação do menu contextual de Frame (custBar) devem afetar TODOS e
// SOMENTE os Frames da seleção corrente, SEM exigir Global. Global permanece um modo
// distinto (todos os Frames elegíveis). Frames fora da seleção não podem mudar; Frames
// travados preservam a regra de lock; a operação por gesto de slider gera 1 Undo
// consolidado. Este gate FALHA na main pré-correção (só o Frame ativo muda) e passa
// após a correção da resolução de targets na origem (getNormalTransformTargets).
test('REG-054 — multi-seleção de Frames aplica Posição/Escala/Rotação a todos os selecionados sem Global', async ({ page }) => {
  test.setTimeout(180_000);
  const errors = captureFatalErrors(page);
  await page.goto('/', { waitUntil:'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout:30_000 });
  await dismissProModalIfVisible(page);

  // Projeto com pelo menos 3 Frames de geometria claramente diferente (a fixture traz 5).
  const frameCount0 = await page.evaluate(() => frameCount);
  expect(frameCount0).toBeGreaterThanOrEqual(3);

  // Snapshot do modelo REAL consumido por Preview/Export (frames/frameRotations),
  // sem overlays de seleção.
  const snap = () => page.evaluate(() => ({
    frames: frames.map(f => ({ x:f.x, y:f.y, w:f.w, h:f.h })),
    rot: frameRotations.slice(),
    selected: Array.from(selectedFrames).sort((a,b)=>a-b),
    multi: isMultiSelectionActive(),
    global: JSON.parse(JSON.stringify(custGlobalLock)),
    undo: undoStack.length,
    allFinite: frames.every(f => [f.x,f.y,f.w,f.h].every(Number.isFinite)) && frameRotations.every(Number.isFinite),
  }));
  const near = (a, b, tol=0.01) => Math.abs(a - b) <= tol;

  // Fluxo público de seleção: long-press real na pill entra na multi-seleção; com a
  // seleção já ativa, um clique na pill alterna. As pills são reconstruídas a cada
  // render, então re-localizamos sempre.
  const pill = (i) => page.locator(`#pillsRow .fp[data-frame-index="${i}"]`);
  const longPressPill = async (i) => {
    await pill(i).dispatchEvent('pointerdown');
    await page.waitForTimeout(520); // > 420ms do timer de long-press
    await pill(i).dispatchEvent('pointerup').catch(() => {});
  };
  const clickPillToggle = async (i) => { await pill(i).click(); };
  const openTab = async (tab) => { await page.evaluate(t => { openCustBar(); switchCustTab(t); }, tab); };
  const ensureGlobalOff = async (tab) => page.evaluate(t => { switchCustTab(t); if (custGlobalLock[t]) toggleCustGlobalLock(); }, tab);
  const clearSel = () => page.evaluate(() => clearMultiSelect());

  // ── CASO A — dois Frames selecionados (F1,F2); F3 fora da seleção ──
  await page.evaluate(() => { activeIdx = 0; openCustBar(); });
  await longPressPill(0);
  expect(await page.evaluate(() => isMultiSelectionActive())).toBe(true);
  await clickPillToggle(1);
  let s = await snap();
  expect(s.selected).toEqual([0,1]);
  expect(s.global.pos || s.global.scale || s.global.rot).toBeFalsy();

  // Posição: mesmo delta em F1 e F2; F3 intacto.
  await ensureGlobalOff('pos');
  let before = await snap();
  await page.evaluate(() => nudgePos(30, -20));
  let after = await snap();
  const d0x = after.frames[0].x - before.frames[0].x, d0y = after.frames[0].y - before.frames[0].y;
  const d1x = after.frames[1].x - before.frames[1].x, d1y = after.frames[1].y - before.frames[1].y;
  expect(Math.abs(d0x)).toBeGreaterThan(0.001);
  expect(near(d0x, d1x)).toBe(true); expect(near(d0y, d1y)).toBe(true); // distâncias relativas preservadas
  expect(near(after.frames[2].x, before.frames[2].x)).toBe(true);
  expect(near(after.frames[2].y, before.frames[2].y)).toBe(true);
  expect(after.selected).toEqual([0,1]); // seleção permanece ativa
  expect(after.global.pos).toBeFalsy(); // Global permanece desligado

  // Escala: ambos mudam (delta relativo à própria escala); F3 intacto.
  await ensureGlobalOff('scale');
  before = await snap();
  await page.evaluate(() => nudgeScale(20));
  after = await snap();
  expect(after.frames[0].w).toBeGreaterThan(before.frames[0].w + 0.01);
  expect(after.frames[1].w).toBeGreaterThan(before.frames[1].w + 0.01);
  expect(near(after.frames[2].w, before.frames[2].w)).toBe(true);
  expect(after.selected).toEqual([0,1]);

  // Rotação: mesmo delta em F1 e F2; F3 intacto.
  await ensureGlobalOff('rot');
  before = await snap();
  await page.evaluate(() => nudgeRotation(15));
  after = await snap();
  expect(near(after.rot[0] - before.rot[0], 15)).toBe(true);
  expect(near(after.rot[1] - before.rot[1], 15)).toBe(true);
  expect(near(after.rot[2], before.rot[2])).toBe(true);
  expect(after.selected).toEqual([0,1]);
  expect(after.allFinite).toBe(true);

  // ── CASO A' — Undo consolidado do gesto de slider (1 sessão de drag = 1 Undo) ──
  await ensureGlobalOff('scale');
  const dragBefore = await page.evaluate(() => { switchCustTab('scale'); initScaleSlider(); return { undo:undoStack.length, w0:frames[0].w, w1:frames[1].w }; });
  await page.evaluate(() => {
    const sl = document.getElementById('scaleSlider');
    sl.dispatchEvent(new Event('mousedown'));
    for (const dv of [8, 16, 24]) { sl.value = String(Math.round(parseFloat(sl.value)) + dv); sl.dispatchEvent(new Event('input')); }
    sl.dispatchEvent(new Event('change'));
  });
  const dragAfter = await page.evaluate(() => ({ undo:undoStack.length, w0:frames[0].w, w1:frames[1].w }));
  expect(dragAfter.undo).toBe(dragBefore.undo + 1); // exatamente 1 Undo para o lote
  expect(dragAfter.w0).toBeGreaterThan(dragBefore.w0 + 0.01);
  expect(dragAfter.w1).toBeGreaterThan(dragBefore.w1 + 0.01);
  await page.evaluate(() => undo());
  let undone = await page.evaluate(() => ({ w0:frames[0].w, w1:frames[1].w }));
  expect(near(undone.w0, dragBefore.w0)).toBe(true); // Undo restaura AMBOS
  expect(near(undone.w1, dragBefore.w1)).toBe(true);
  await page.evaluate(() => { if (typeof redo === 'function') redo(); });
  let redone = await page.evaluate(() => ({ w0:frames[0].w, w1:frames[1].w }));
  expect(near(redone.w0, dragAfter.w0)).toBe(true); // Redo reaplica AMBOS
  expect(near(redone.w1, dragAfter.w1)).toBe(true);

  // Preview/Export consomem o estado REAL: limpar a seleção não altera a geometria
  // (a mutação vive no modelo, não em overlay de seleção).
  const beforeClear = await snap();
  await clearSel();
  const afterClear = await snap();
  expect(afterClear.frames).toEqual(beforeClear.frames);
  expect(afterClear.rot).toEqual(beforeClear.rot);
  expect(afterClear.multi).toBe(false);

  // ── CASO D — seleção simples (sem multi-seleção) não regride: só o Frame ativo ──
  await page.evaluate(() => { clearMultiSelect(); activeIdx = 2; openCustBar(); });
  await ensureGlobalOff('scale');
  before = await snap();
  await page.evaluate(() => nudgeScale(20));
  after = await snap();
  expect(after.frames[2].w).toBeGreaterThan(before.frames[2].w + 0.01);
  for (const i of [0,1,3,4]) expect(near(after.frames[i].w, before.frames[i].w)).toBe(true);

  // ── CASO E — Global não regride: afeta todos os Frames elegíveis ──
  await page.evaluate(() => { clearMultiSelect(); activeIdx = 2; openCustBar(); switchCustTab('scale'); if (!custGlobalLock.scale) toggleCustGlobalLock(); });
  before = await snap();
  await page.evaluate(() => nudgeScale(15));
  after = await snap();
  for (let i = 0; i < after.frames.length; i++) expect(after.frames[i].w).toBeGreaterThan(before.frames[i].w + 0.01);
  await page.evaluate(() => { switchCustTab('scale'); if (custGlobalLock.scale) toggleCustGlobalLock(); });

  // ── CASO C — "Selecionar todos" sem Global aplica a todos ──
  await page.evaluate(() => { clearMultiSelect(); activeIdx = 0; openCustBar(); resetCustGlobalLocks(); selectAllFramesForContext(); });
  s = await snap();
  expect(s.selected.length).toBe(frameCount0);
  expect(s.global.rot).toBeFalsy();
  await ensureGlobalOff('rot');
  before = await snap();
  await page.evaluate(() => nudgeRotation(10));
  after = await snap();
  for (let i = 0; i < after.rot.length; i++) expect(near(after.rot[i] - before.rot[i], 10)).toBe(true);
  await clearSel();

  // ── Frame travado preserva a regra de lock: F2 travado na seleção {F1,F2,F3} não muda ──
  await page.evaluate(() => { clearMultiSelect(); activeIdx = 0; openCustBar(); frameLocked[1] = true; });
  await longPressPill(0); await clickPillToggle(1); await clickPillToggle(2);
  expect(await page.evaluate(() => Array.from(selectedFrames).sort((a,b)=>a-b))).toEqual([0,1,2]);
  await ensureGlobalOff('scale');
  before = await snap();
  await page.evaluate(() => nudgeScale(20));
  after = await snap();
  expect(after.frames[0].w).toBeGreaterThan(before.frames[0].w + 0.01); // F1 muda
  expect(near(after.frames[1].w, before.frames[1].w)).toBe(true);       // F2 travado NÃO muda
  expect(after.frames[2].w).toBeGreaterThan(before.frames[2].w + 0.01); // F3 muda
  await page.evaluate(() => { frameLocked[1] = false; });
  expect(after.allFinite).toBe(true);

  // ── Captura de Undo + gesto contínuo multi-input por alvos efetivos ──
  // Cenário-armadilha: activeIdx = F1 TRAVADO e fora dos alvos; F2 e F3 selecionados e
  // destravados; F4 não selecionado; Global desligado. O gesto REAL do slider dispara
  // VÁRIOS eventos 'input' durante um drag (como Safari/iPhone): mousedown → input(+10)
  // → input(+20) → input(+30) → change. O estado final deve depender do DESLOCAMENTO
  // LÍQUIDO do slider (+30), NÃO da soma dos deltas intermediários (+60), capturar
  // EXATAMENTE 1 Undo e nunca mutar sem snapshot. Falha no HEAD anterior 960cd02
  // (rotação/escala acumulavam entre eventos quando activeIdx não era alvo).
  expect(frameCount0).toBeGreaterThanOrEqual(4);
  // Drag REAL contínuo: mousedown → um 'input' por valor NET (relativo ao baseline exibido) → change.
  const dragRotSteps = async (netSteps) => page.evaluate((steps) => {
    const s = document.getElementById('rotSlider');
    const base = frameRotations[activeIdx] || 0;
    s.dispatchEvent(new Event('mousedown'));
    for (const n of steps) { s.value = String(base + n); s.dispatchEvent(new Event('input')); }
    s.dispatchEvent(new Event('change'));
  }, netSteps);
  const dragScaleSteps = async (netSteps) => page.evaluate((steps) => {
    initScaleSlider();
    const s = document.getElementById('scaleSlider');
    const base = Math.round(parseFloat(s.value));
    s.dispatchEvent(new Event('mousedown'));
    for (const n of steps) { s.value = String(base + n); s.dispatchEvent(new Event('input')); }
    s.dispatchEvent(new Event('change'));
  }, netSteps);

  await page.evaluate(() => { clearMultiSelect(); activeIdx = 0; openCustBar(); frameLocked[0] = true; });
  await longPressPill(1); await clickPillToggle(2);
  expect(await page.evaluate(() => Array.from(selectedFrames).sort((a,b)=>a-b))).toEqual([1,2]);
  // F1 (activeIdx) é 0° na fixture, travado e FORA dos alvos → baseline congelado seria a armadilha.
  await ensureGlobalOff('rot');
  before = await snap();
  await dragRotSteps([10, 20, 30]);   // drag contínuo, deslocamento líquido +30°
  after = await snap();
  expect(after.undo).toBe(before.undo + 1);                  // exatamente 1 Undo para o gesto
  expect(near(after.rot[1] - before.rot[1], 30)).toBe(true); // F2 = +30° (NÃO +60°)
  expect(near(after.rot[2] - before.rot[2], 30)).toBe(true); // F3 = +30°
  expect(near(after.rot[0], before.rot[0])).toBe(true);      // F1 travado NÃO muda
  expect(near(after.rot[3], before.rot[3])).toBe(true);      // F4 não selecionado NÃO muda
  expect(after.selected).toEqual([1,2]);                     // seleção permanece
  expect(after.allFinite).toBe(true);
  await page.evaluate(() => undo());
  let undo1 = await snap();
  expect(near(undo1.rot[1], before.rot[1])).toBe(true);      // Undo restaura F2
  expect(near(undo1.rot[2], before.rot[2])).toBe(true);      // Undo restaura F3
  await page.evaluate(() => { if (typeof redo === 'function') redo(); });
  let redo1 = await snap();
  expect(near(redo1.rot[1], after.rot[1])).toBe(true);       // Redo reaplica F2 (estado final)
  expect(near(redo1.rot[2], after.rot[2])).toBe(true);       // Redo reaplica F3
  // Equivalência: um gesto DIRETO (1 input +30) leva ao MESMO estado que o multi-input.
  await page.evaluate(() => undo());
  before = await snap();
  await dragRotSteps([30]);
  const rotDirect = await snap();
  expect(near(rotDirect.rot[1], redo1.rot[1])).toBe(true);
  expect(near(rotDirect.rot[2], redo1.rot[2])).toBe(true);
  await page.evaluate(() => undo());   // volta ao estado pré-rotação

  // Escala no mesmo cenário-armadilha e mesma propriedade (deslocamento líquido, não acúmulo):
  await ensureGlobalOff('scale');
  before = await snap();
  await dragScaleSteps([10, 20, 30]);  // drag contínuo, deslocamento líquido +30%
  after = await snap();
  expect(after.undo).toBe(before.undo + 1);
  expect(after.frames[1].w).toBeGreaterThan(before.frames[1].w + 0.01);
  expect(after.frames[2].w).toBeGreaterThan(before.frames[2].w + 0.01);
  expect(near(after.frames[0].w, before.frames[0].w)).toBe(true);   // F1 travado intacto
  expect(near(after.frames[3].w, before.frames[3].w)).toBe(true);   // F4 intacto
  expect(after.selected).toEqual([1,2]);
  // Equivalência Escala: multi-input vs 1 input direto → mesma largura final (tolerância numérica).
  await page.evaluate(() => undo());
  await ensureGlobalOff('scale');
  await dragScaleSteps([30]);
  const scaleDirect = await snap();
  expect(near(scaleDirect.frames[1].w, after.frames[1].w, 0.6)).toBe(true);
  expect(near(scaleDirect.frames[2].w, after.frames[2].w, 0.6)).toBe(true);
  await page.evaluate(() => undo());   // volta ao estado pré-escala

  // ── Zero alvos editáveis: nenhum estado muda, nenhum Undo é criado ──
  // activeIdx = F1 travado, sem seleção, Global desligado.
  await page.evaluate(() => { clearMultiSelect(); activeIdx = 0; openCustBar(); });
  expect(await page.evaluate(() => isMultiSelectionActive())).toBe(false);
  await ensureGlobalOff('rot');
  before = await snap();
  await dragRotSteps([10, 20, 30]);
  after = await snap();
  expect(after.undo).toBe(before.undo);                      // nenhum Undo
  expect(after.rot).toEqual(before.rot);                     // rotação inalterada
  await ensureGlobalOff('scale');
  before = await snap();
  await dragScaleSteps([10, 20, 30]);
  after = await snap();
  expect(after.undo).toBe(before.undo);                      // nenhum Undo
  expect(after.frames.map(f => f.w)).toEqual(before.frames.map(f => f.w)); // escala inalterada
  await page.evaluate(() => { frameLocked[0] = false; });

  expect(errors, `erros fatais: ${errors.join(' | ')}`).toEqual([]);
});

// v8z4b32E9F3 — gate de REG-053. Com 2+ Frames selecionados, o painel de
// transformação (Rotação/Escala/Mover/Pausa) precisa ser INVARIANTE à ORDEM das
// ações: (A) selecionar F1+F2 pelo fluxo público e SÓ DEPOIS tocar no controle
// público real do grupo (botão do #alignBarActions) deve terminar no MESMO
// estado visual/funcional que (B) tocar no controle público real do grupo na
// toolbar normal (#toolbar .ctx-frame) com F1 e SÓ DEPOIS selecionar F1+F2 pelo
// fluxo público. Os DOIS painéis são abertos pelos MESMOS elementos interativos
// que o usuário toca de verdade — nenhuma chamada direta a openAlignSubmenu(),
// openCustBar() ou switchCustTab() estabelece o estado principal do teste;
// essas funções só aparecem indiretamente, disparadas pelos handlers reais dos
// botões clicados. Causa comprovada na base pré-correção: o ancestral
// #lowerContextSheetShell só ganha a expansão estrutural (grid-row 3/5,
// overflow:visible) para os estados cust-expanded/asset-context-panel-open;
// em align-submenu-open ele herdava overflow:hidden de .lower-cell e ficava
// confinado à Linha 4 (46px), cortando a parte superior de #alignBarSubmenu
// (inclusive o botão Voltar). Correção: a mesma expansão de grid já usada por
// cust-expanded passa a valer também para align-submenu-open (sem tocar
// REG-052, REG-054 nem a matemática de transformação). Viewport obrigatório
// 390×797. Este gate FALHA na base pré-correção (Fluxo A corta o painel /
// esconde Voltar) e passa após a correção.
test('REG-053 — painel de transformação em multi-seleção é invariante à ordem das ações (390×797)', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = captureFatalErrors(page);
  await page.setViewportSize({ width: 390, height: 797 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await dismissProModalIfVisible(page);

  const frameCount0 = await page.evaluate(() => frameCount);
  expect(frameCount0).toBeGreaterThanOrEqual(2);

  const pill = (i) => page.locator(`#pillsRow .fp[data-frame-index="${i}"]`);
  const longPressPill = async (i) => {
    await pill(i).dispatchEvent('pointerdown');
    await page.waitForTimeout(520); // > 420ms do timer de long-press
    await pill(i).dispatchEvent('pointerup').catch(() => {});
  };
  const clickPillToggle = async (i) => { await pill(i).click(); };
  // Auxiliar de limpeza entre iterações (não é a interação testada: apenas
  // garante estado inicial normal — sem painel expandido, sem multi-seleção —
  // antes de cada fluxo público).
  const reset = () => page.evaluate(() => { closeAlignSubmenu(); clearMultiSelect(); closeCustBar(); });

  // Controle público real da barra de multi-seleção (#alignBarActions), visível
  // somente com has-multi-selection e sem cust-open: o mesmo botão que o
  // usuário toca para abrir Rotação/Escala/Mover/Pausa em 2+ Frames.
  const tapAlignBarButton = async (label) => {
    await page.locator('#alignBarActions button.ab-tab').filter({ hasText: label }).click();
  };
  // Controle público real da toolbar normal de Frame único (#toolbar .ctx-frame),
  // visível em body.bottom-context-frame: o mesmo botão que o usuário toca para
  // abrir o painel normal de Rotação/Escala/Mover/Pausa em 1 Frame.
  const tapToolbarFrameButton = async (label) => {
    await page.locator('#toolbar .tb-item.ctx-frame').filter({ hasText: label }).click();
  };

  // Estado DOM/CSS real do painel contextual inferior, via buildDiagnosticsText()
  // (mesmo coletor observacional do Diagnóstico) + getBoundingClientRect() dos
  // elementos exigidos pela tarefa.
  const measure = () => page.evaluate(() => {
    const rectOf = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      if (cs.display === 'none') return null;
      const r = el.getBoundingClientRect();
      if (r.width < 0.5 || r.height < 0.5) return null;
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
    };
    const diag = Object.fromEntries(buildDiagnosticsText().split('\n').filter(l => l.includes(': ')).map(l => { const i = l.indexOf(': '); return [l.slice(0, i), l.slice(i + 2)]; }));
    const panelSelector = { alignBarSubmenu: '#alignBarSubmenu', custBarContent: '#custBarContent' }[diag.lowerContextVisiblePanel] || null;
    const backSelector = { alignBarSubmenu: '#alignBarBack', custBarContent: '#custBarBack' }[diag.lowerContextVisiblePanel] || null;
    return {
      diag,
      selected: Array.from(selectedFrames).sort((a, b) => a - b),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      panelRect: panelSelector ? rectOf(panelSelector) : null,
      backRect: backSelector ? rectOf(backSelector) : null,
      pillsRect: rectOf('#pillsRow'),
      slotRect: rectOf('#lowerContextSlot'),
      lowerContextSlotRect: rectOf('#lowerContextSlot'),
      lowerContextSheetShellRect: rectOf('#lowerContextSheetShell'),
      alignBarRect: rectOf('#alignBar'),
      alignBarSubmenuRect: rectOf('#alignBarSubmenu'),
      custBarRect: rectOf('#custBar'),
      custBarContentRect: rectOf('#custBarContent'),
    };
  });

  // Critérios de aceite (seção 9/13 da tarefa REG-053), aplicados a UM estado capturado.
  const expectPanelHealthy = (state, label) => {
    expect(state.diag.lowerContextVisiblePanel, `${label}: submenu real deve estar visível`).toMatch(/^(alignBarSubmenu|custBarContent)$/);
    expect(state.diag.lowerContextCompetingPanelsDetected, `${label}: nenhum painel concorrente pode interceptar pointer`).toBe('false');
    expect(state.diag.lowerContextClippingDetected, `${label}: nenhuma área essencial pode ser cortada por overflow`).toBe('false');
    expect(state.panelRect, `${label}: painel real precisa ter geometria renderizada`).not.toBeNull();
    const v = state.viewport, p = state.panelRect;
    // Bounding rect do painel dentro da área permitida (viewport), com tolerância de 1px.
    expect(p.top).toBeGreaterThanOrEqual(-1);
    expect(p.left).toBeGreaterThanOrEqual(-1);
    expect(p.right).toBeLessThanOrEqual(v.width + 1);
    expect(p.bottom).toBeLessThanOrEqual(v.height + 1);
    // Não invade a régua de pills/timeline.
    expect(p.top, `${label}: painel não pode invadir #pillsRow`).toBeGreaterThanOrEqual(state.pillsRect.bottom - 1);
    // Botão Voltar existe e está inteiramente dentro do viewport.
    expect(state.backRect, `${label}: botão Voltar precisa estar visível`).not.toBeNull();
    expect(state.backRect.top).toBeGreaterThanOrEqual(-1);
    expect(state.backRect.left).toBeGreaterThanOrEqual(-1);
    expect(state.backRect.right).toBeLessThanOrEqual(v.width + 1);
    expect(state.backRect.bottom).toBeLessThanOrEqual(v.height + 1);
  };

  const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;
  const expectEquivalentPresentation = (a, b, label) => {
    expect(a.selected, `${label}: mesma seleção em ambos os fluxos`).toEqual(b.selected);
    expect(near(a.panelRect.top, b.panelRect.top)).toBe(true);
    expect(near(a.panelRect.bottom, b.panelRect.bottom)).toBe(true);
    expect(near(a.panelRect.left, b.panelRect.left)).toBe(true);
    expect(near(a.panelRect.right, b.panelRect.right)).toBe(true);
  };

  // Grupos testados: Rotação, Escala, Mover e Pausa (mesmo shell inferior). O
  // rótulo é o texto visível do botão público tocado tanto na barra de
  // multi-seleção (#alignBarActions) quanto na toolbar normal (#toolbar
  // .ctx-frame) — os dois caminhos usam exatamente o mesmo texto por grupo.
  const groups = [
    { align: 'rotation', cust: 'rot', label: 'Rotação' },
    { align: 'scale', cust: 'scale', label: 'Escala' },
    { align: 'move', cust: 'pos', label: 'Mover' },
    { align: 'pause', cust: 'framepause', label: 'Pausa' },
  ];

  for (const { align, cust, label } of groups) {
    // ── FLUXO A: selecionar F1+F2 pelo fluxo público PRIMEIRO, depois tocar no
    // controle público real do grupo na barra de multi-seleção ──
    await reset();
    await page.evaluate(() => { activeIdx = 0; }); // setup auxiliar: não é a interação testada
    await longPressPill(0); // fluxo público: long-press real na pill
    expect(await page.evaluate(() => isMultiSelectionActive())).toBe(true);
    await clickPillToggle(1); // fluxo público: toque real na pill
    await tapAlignBarButton(label); // fluxo público: toque real no botão do grupo
    await page.waitForTimeout(60);
    const stateA = await measure();
    expectPanelHealthy(stateA, `Fluxo A (${label})`);
    expect(stateA.selected).toEqual([0, 1]);
    expect(stateA.diag.lowerContextTransitionSource).toBe('multi-select');
    expect(stateA.diag.lowerContextVisiblePanel).toBe('alignBarSubmenu');
    expect(stateA.diag.lowerContextLastOpenedGroup).toBe(align);

    // ── FLUXO B: tocar no controle público real do grupo na toolbar normal com
    // F1 PRIMEIRO (painel normal abre pelo caminho real), mantê-lo aberto, e SÓ
    // DEPOIS selecionar F1+F2 pelo fluxo público ──
    await reset();
    await page.evaluate(() => { activeIdx = 0; }); // setup auxiliar: não é a interação testada
    await tapToolbarFrameButton(label); // fluxo público: toque real no botão do grupo
    await page.waitForTimeout(60);
    await longPressPill(0); // fluxo público: long-press real na pill
    expect(await page.evaluate(() => isMultiSelectionActive())).toBe(true);
    await clickPillToggle(1); // fluxo público: toque real na pill
    await page.waitForTimeout(60);
    const stateB = await measure();
    expectPanelHealthy(stateB, `Fluxo B (${label})`);
    expect(stateB.selected).toEqual([0, 1]);
    expect(stateB.diag.lowerContextTransitionSource).toBe('single-frame');
    expect(stateB.diag.lowerContextVisiblePanel).toBe('custBarContent');
    expect(stateB.diag.lowerContextLastOpenedGroup).toBe(cust);

    // MESMA seleção + MESMA transformação, ordens diferentes → apresentação
    // final geometricamente equivalente (invariante à ordem das ações).
    expectEquivalentPresentation(stateA, stateB, `A×B (${label})`);
  }

  await reset();
  expect(errors, `erros fatais: ${errors.join(' | ')}`).toEqual([]);
});

// v8z4b32E9F6 — gate de REG-055 (nova tentativa após duas reprovações físicas: E9F4/
// PR #507 — painel próprio, reprovado — e E9F5/PR #509 — picker nativo restaurado,
// MAS runaway palette física: mover roda/espectro/sliders no picker nativo do
// iPhone/Safari criava e persistia centenas de swatches intermediários, o painel
// crescia sem limite e a contaminação sobrevivia a reiniciar o app). Causa raiz
// comprovada na leitura do código revertido: os três "+" chamavam
// addCustomColorToPalette diretamente no 'change' do input[type=color] nativo,
// assumindo 'change' == "usuário confirmou uma cor pessoal" — falso no picker nativo
// do WebKit/iOS, que dispara múltiplos eventos durante um único gesto contínuo.
//
// Este gate prova que, na E9F6: (1) NENHUM evento input/change do picker nativo dos
// três contextos — mesmo simulando uma sessão longa de arraste com 20+ valores
// diferentes e múltiplos 'change' — persiste uma única cor na paleta pessoal
// (REG-055A); (2) o picker continua livre para aplicar/pré-visualizar a cor corrente
// (Undo/dirty do Fundo do projeto preservados); (3) o campo HEX inline dos três
// contextos aplica em tempo real durante a digitação SEM salvar nenhum estado
// intermediário, e salva EXATAMENTE 1 cor por commit efetivo (Enter/blur), com
// deduplicação; (4) a chave antiga arco_user_custom_colors_v1 (usada pela E9F5,
// contaminável pelo bug físico) é descartada defensivamente na inicialização, mesmo
// contendo centenas de entradas — nunca migrada/importada — e a paleta corrigida usa
// a chave nova v2, persistente e fora do payload do projeto. Fluxo 100% público: os
// pickers nativos do SO (roda/espectro/conta-gotas do iPhone/Safari) não são
// pilotáveis por um agente headless — a abertura efetiva da UI nativa permanece
// validação física pós-merge; este gate substitui o toque físico por eventos DOM
// reais (input/change) nos próprios inputs nativos, provando a REGRA DE EVENTOS que
// causou o bug físico, não a abertura da UI do sistema operacional.
test('REG-055 — picker nativo não alimenta a paleta pessoal (runaway), HEX inline salva exatamente 1 cor por commit, v1 contaminada é descartada', async ({ page }) => {
  test.setTimeout(180_000);
  const errors = captureFatalErrors(page);

  // ── Contaminação simulada da E9F5: 200 cores "intermediárias de drag" em v1 ──
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const fake = [];
    for (let i = 0; i < 200; i++) fake.push('#' + (i.toString(16).padStart(6, '0')));
    localStorage.setItem('arco_user_custom_colors_v1', JSON.stringify(fake));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);

  // v1 removida/ignorada; v2 inicia limpa; app continua funcional mesmo com a
  // contaminação presente ao carregar.
  expect(await page.evaluate(() => localStorage.getItem('arco_user_custom_colors_v1'))).toBeNull();
  expect(await page.evaluate(() => customColorPalette.length)).toBe(0);
  expect(await page.evaluate(() => customColorLegacyV1Purged)).toBe(true);

  await page.setViewportSize({ width: 390, height: 797 });
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await dismissProModalIfVisible(page);

  // Nenhuma das 200 cores da v1 aparece; painel de tamanho normal (sem swatches
  // pessoais contaminados ainda).
  expect(await page.evaluate(() => customColorPalette)).toEqual([]);
  expect(await page.evaluate(() => !!document.getElementById('customColorPanel'))).toBe(false);

  const dispatchInput = (locator, value) => locator.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
  const dispatchChange = (locator) => locator.evaluate((el) => { el.dispatchEvent(new Event('change', { bubbles: true })); });
  // Reproduz o padrão físico do drag contínuo no picker nativo do WebKit: uma
  // sequência de 'input' (cada frame do arraste) seguida de MÚLTIPLOS 'change'
  // intercalados — exatamente o padrão que a E9F5 tratava incorretamente como
  // "usuário confirmou uma cor pessoal" a cada 'change'.
  const simulateDragSession = async (locator, baseHex) => {
    // Foca ANTES de mudar o valor, replicando a ordem real do gesto do usuário
    // (pointerdown/focus → arraste → change) — necessário para beginBgColorEdit()
    // (onfocus, no Fundo do projeto) capturar o snapshot de Undo ANTES da mudança,
    // exatamente como no fluxo público real.
    await locator.focus();
    const values = [];
    for (let i = 0; i < 20; i++) values.push('#' + ((baseHex + i * 4919) % 0xffffff).toString(16).padStart(6, '0'));
    for (let i = 0; i < values.length; i++) {
      await dispatchInput(locator, values[i]);
      if (i % 4 === 0) await dispatchChange(locator); // 'change' intercalado, não só ao final
    }
    await dispatchChange(locator); // change final do gesto (soltar o dedo)
    return values[values.length - 1];
  };

  // ── TESTE A — Fundo do projeto: runaway do picker nativo ──
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('body')).toHaveClass(/editor-assets/);
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('#assetsModeContextMenu')).toHaveClass(/open/);
  await page.locator('#assetsModeContextMenu .assets-menu-btn').filter({ hasText: 'Fundo' }).click();
  const bgPanel = page.locator('#panelBgColor');
  await expect(bgPanel).toHaveClass(/show/);
  await page.waitForFunction(() => {
    const t = getComputedStyle(document.getElementById('panelBgColor')).transform;
    return t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
  }, { timeout: 5_000 });

  let paletteBefore = await page.evaluate(() => customColorPalette.length);
  const undoBefore = await page.evaluate(() => undoStack.length);
  const lastBgDragValue = await simulateDragSession(bgPanel.locator('#bgHexInput'), 0x102030);
  // A paleta pessoal NÃO cresceu — nenhum dos 20 valores intermediários nem os
  // 'change' intercalados foram persistidos (REG-055A).
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  // O picker continua aplicando a cor normalmente (preview/aplicação real
  // preservados) e o commit funcional cria Undo/dirty como antes.
  await expect.poll(() => page.evaluate(() => bgColor)).toBe(lastBgDragValue);
  expect(await page.evaluate(() => undoStack.length)).toBeGreaterThan(undoBefore);

  // HEX inválido não aplica nem salva.
  const bgBeforeInvalid = await page.evaluate(() => ({ bg: bgColor, palette: [...customColorPalette] }));
  await dispatchInput(bgPanel.locator('#bgHexText'), 'zzzzzz');
  await dispatchChange(bgPanel.locator('#bgHexText'));
  expect(await page.evaluate(() => ({ bg: bgColor, palette: [...customColorPalette] }))).toEqual(bgBeforeInvalid);

  // Edição PROGRESSIVA do HEX (#1 → #12 → … → #123456): cada caractere digitado
  // dispara 'input'; nenhum estado intermediário incompleto é persistido.
  const progressiveBg = '#123456';
  for (let i = 1; i <= progressiveBg.length; i++) {
    await dispatchInput(bgPanel.locator('#bgHexText'), progressiveBg.slice(0, i));
  }
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  // Só o COMMIT (change/blur/Enter) com HEX completo e válido salva — exatamente +1.
  await dispatchChange(bgPanel.locator('#bgHexText'));
  await expect.poll(() => page.evaluate(() => bgColor)).toBe('#123456');
  expect(await page.evaluate(() => customColorPalette)).toContain('#123456');
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);

  // Confirmar a MESMA cor de novo (com/sem "#", maiúsculas) → +0, deduplicação.
  const countAfterFirstCommit = await page.evaluate(() => customColorPalette.length);
  await dispatchInput(bgPanel.locator('#bgHexText'), '123456');
  await dispatchChange(bgPanel.locator('#bgHexText'));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(countAfterFirstCommit);
  expect(await page.evaluate(() => customColorDuplicatePrevented)).toBe(true);

  // Editar de uma cor válida para outra por HEX: só a cor final confirmada entra.
  await dispatchInput(bgPanel.locator('#bgHexText'), '#87a46b');
  await dispatchChange(bgPanel.locator('#bgHexText'));
  expect(await page.evaluate(() => customColorPalette)).toContain('#87a46b');
  expect(await page.evaluate(() => customColorPalette.length)).toBe(countAfterFirstCommit + 1);

  // Volta o Fundo do projeto a um preset canônico — a cor pessoal permanece salva na
  // paleta mesmo sem ser a cor efetivamente usada pelo projeto (usado pelo teste de
  // escopo abaixo: a paleta é browser-local, fora do payload do projeto salvo).
  await bgPanel.locator('#bgSwatches .bg-swatch[data-color]').first().click();
  await expect(bgPanel).not.toHaveClass(/show/);

  // ── TESTE B — Cor do texto: runaway + HEX inline ──
  const sheet = page.locator('#textCreationSheet');
  await page.locator('#lowerAddOrSelectAllBtn').click();
  await expect(page.locator('#assetsAddMenu')).toHaveClass(/open/);
  await page.locator('#assetsMenuTextBtn').click();
  await expect(sheet).toHaveClass(/open/);
  await page.locator('#textCreationInput').fill('REG055');
  await sheet.getByRole('tab', { name: 'Cor do texto', exact: true }).click();
  await expect(sheet.locator('#textColorSwatches .color-trigger-wrap')).toBeVisible();
  await expect(page.locator('#textColorHexText')).toBeVisible();

  paletteBefore = await page.evaluate(() => customColorPalette.length);
  const lastTextColorDragValue = await simulateDragSession(page.locator('#textCreationColor'), 0x203040);
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  await expect.poll(() => page.evaluate(() => pendingTextDraft.color)).toBe(lastTextColorDragValue);
  // Fundo da caixa não é afetado pela Cor do texto (glifos/fundo permanecem separados).
  expect(await page.evaluate(() => pendingTextDraft.boxBackgroundEnabled)).toBe(false);

  const progressiveTextColor = '#654321';
  for (let i = 1; i <= progressiveTextColor.length; i++) await dispatchInput(page.locator('#textColorHexText'), progressiveTextColor.slice(0, i));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  await dispatchChange(page.locator('#textColorHexText'));
  await expect.poll(() => page.evaluate(() => pendingTextDraft.color)).toBe(progressiveTextColor);
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);

  // ── TESTE C — Fundo da caixa: runaway + HEX inline + "Sem cor" preservado ──
  await sheet.getByRole('tab', { name: 'Fundo da caixa', exact: true }).click();
  await expect(sheet.locator('#textBgSwatches [data-swatch-none]')).toHaveClass(/active/);
  expect(await page.evaluate(() => pendingTextDraft.boxBackgroundEnabled)).toBe(false);
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeHidden();
  await expect(sheet.locator('#textBgSwatches .color-trigger-wrap')).toBeVisible();
  await expect(page.locator('#textBoxBackgroundHexText')).toBeVisible();

  paletteBefore = await page.evaluate(() => customColorPalette.length);
  const glyphColorBeforeBoxDrag = await page.evaluate(() => pendingTextDraft.color);
  const lastBoxDragValue = await simulateDragSession(page.locator('#textBoxBackgroundColor'), 0x304050);
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  await expect.poll(() => page.evaluate(() => pendingTextDraft.boxBackgroundEnabled)).toBe(true);
  expect(await page.evaluate(() => pendingTextDraft.boxBackgroundColor)).toBe(lastBoxDragValue);
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeVisible();
  // A cor dos glifos não muda por causa do drag no Fundo da caixa.
  expect(await page.evaluate(() => pendingTextDraft.color)).toBe(glyphColorBeforeBoxDrag);

  const progressiveTextBox = '#abcdef';
  for (let i = 1; i <= progressiveTextBox.length; i++) await dispatchInput(page.locator('#textBoxBackgroundHexText'), progressiveTextBox.slice(0, i));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  await dispatchChange(page.locator('#textBoxBackgroundHexText'));
  await expect.poll(() => page.evaluate(() => pendingTextDraft.boxBackgroundColor)).toBe(progressiveTextBox);
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);

  // "Sem cor" continua funcionando após todo o exercício de runaway/HEX.
  await sheet.locator('#textBgSwatches [data-swatch-none]').click();
  await expect.poll(() => page.evaluate(() => pendingTextDraft.boxBackgroundEnabled)).toBe(false);
  await expect(page.locator('#textEditorBgOpacityWrap')).toBeHidden();

  await sheet.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(sheet).not.toHaveClass(/open/);

  // ── TESTE — a paleta pessoal NUNCA entra no projeto salvo ──
  const payload = await page.evaluate(() => JSON.stringify(buildProjectData(true)));
  for (const needle of ['87a46b', 'arco_user_custom_colors', 'customColorPalette']) {
    expect(payload.toLowerCase().includes(needle.toLowerCase()), `payload não deve conter "${needle}"`).toBe(false);
  }

  // ── TESTE — persistência: sobrevive a um novo carregamento (chave v2, não v1) ──
  const paletteBeforeReload = await page.evaluate(() => [...customColorPalette].sort());
  expect(paletteBeforeReload.length).toBeGreaterThan(0);
  expect(await page.evaluate(() => localStorage.getItem('arco_user_custom_colors_v1'))).toBeNull();
  expect(await page.evaluate(() => !!localStorage.getItem('arco_user_custom_colors_v2'))).toBe(true);
  await clearStartupStorage(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);
  await expect(page.locator('#startupRecoveryDialog')).toBeHidden();
  const paletteAfterReload = await page.evaluate(() => [...customColorPalette].sort());
  expect(paletteAfterReload).toEqual(paletteBeforeReload);
  // Nenhuma das 200 cores de contaminação da v1 ressuscitou.
  expect(paletteAfterReload.length).toBeLessThan(20);

  expect(await page.evaluate(() => !!document.getElementById('customColorPanel'))).toBe(false);
  expect(errors, `erros fatais: ${errors.join(' | ')}`).toEqual([]);
});

// v8z4b32E9F6 — gate de REG-055B/contenção: com uma paleta pessoal volumosa (100+
// cores, seguindo o cenário físico que quebrou a E9F5), o painel de Fundo do
// projeto — a única superfície das três cujos swatches crescem verticalmente
// (flex-wrap; as linhas de texto já rolam horizontalmente e não crescem em altura)
// — precisa permanecer inteiramente contido no viewport do iPhone: alça, título,
// campo HEX e texto de rodapé sempre alcançáveis, com rolagem interna própria
// apenas na área de swatches. Reproduz o sintoma físico B da E9F5 (painel crescia
// até controles/fechamento ficarem inacessíveis) e prova que não volta a acontecer.
test('REG-055 — painel de Fundo do projeto permanece contido em 390×797 com paleta pessoal volumosa (100+ cores)', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = captureFatalErrors(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const colors = [];
    for (let i = 0; i < 120; i++) colors.push('#' + (((i * 65537) % 0xffffff)).toString(16).padStart(6, '0'));
    localStorage.setItem('arco_user_custom_colors_v2', JSON.stringify(colors));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);
  expect(await page.evaluate(() => customColorPalette.length)).toBeGreaterThanOrEqual(100);

  await page.setViewportSize({ width: 390, height: 797 });
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await dismissProModalIfVisible(page);

  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('body')).toHaveClass(/editor-assets/);
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('#assetsModeContextMenu')).toHaveClass(/open/);
  await page.locator('#assetsModeContextMenu .assets-menu-btn').filter({ hasText: 'Fundo' }).click();
  const bgPanel = page.locator('#panelBgColor');
  await expect(bgPanel).toHaveClass(/show/);
  await page.waitForFunction(() => {
    const t = getComputedStyle(document.getElementById('panelBgColor')).transform;
    return t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
  }, { timeout: 5_000 });

  expect(await bgPanel.locator('#bgSwatches .bg-swatch').count()).toBeGreaterThanOrEqual(100);

  const geometry = await page.evaluate(() => {
    const vh = window.innerHeight;
    const panel = document.getElementById('panelBgColor').getBoundingClientRect();
    const handle = document.querySelector('#panelBgColor .panel-handle').getBoundingClientRect();
    const title = document.querySelector('#panelBgColor .panel-title').getBoundingClientRect();
    const hexInput = document.getElementById('bgHexInput').getBoundingClientRect();
    const hexText = document.getElementById('bgHexText').getBoundingClientRect();
    const swatches = document.getElementById('bgSwatches');
    const sw = swatches.getBoundingClientRect();
    return {
      vh,
      panelTop: panel.top, panelBottom: panel.bottom,
      handleTop: handle.top, handleBottom: handle.bottom,
      titleTop: title.top, titleBottom: title.bottom,
      hexInputTop: hexInput.top, hexInputBottom: hexInput.bottom,
      hexTextTop: hexText.top, hexTextBottom: hexText.bottom,
      swatchesTop: sw.top, swatchesBottom: sw.bottom, swatchesHeight: sw.height,
      swatchesScrollHeight: swatches.scrollHeight,
      swatchesClientHeight: swatches.clientHeight,
    };
  });
  // O painel inteiro permanece dentro do viewport (nunca é empurrado para cima e
  // para fora da área visível pelo crescimento da paleta pessoal).
  expect(geometry.panelTop).toBeGreaterThanOrEqual(-1);
  expect(geometry.panelBottom).toBeLessThanOrEqual(geometry.vh + 1);
  // Alça, título e o campo HEX texto (abaixo da área de swatches) permanecem
  // alcançáveis dentro do viewport SEM rolar — nenhum foi empurrado para fora pelo
  // crescimento da paleta. O input[type=color] nativo ("+") agora faz parte da
  // MESMA linha rolável dos swatches (arquitetura [presets][pessoais][+] — revisão
  // de blocker 1), por isso é verificado separadamente abaixo via rolagem, não
  // exigido visível sem rolar.
  for (const [label, top, bottom] of [
    ['alça', geometry.handleTop, geometry.handleBottom],
    ['título', geometry.titleTop, geometry.titleBottom],
    ['HEX texto', geometry.hexTextTop, geometry.hexTextBottom],
  ]) {
    expect(top, `${label}: topo fora do viewport`).toBeGreaterThanOrEqual(-1);
    expect(bottom, `${label}: base fora do viewport`).toBeLessThanOrEqual(geometry.vh + 1);
  }
  // A área de SWATCHES (só ela) tem conteúdo maior que sua própria altura visível —
  // ou seja, existe overflow real contido internamente, não um painel que cresceu
  // para acomodar tudo.
  expect(geometry.swatchesScrollHeight).toBeGreaterThan(geometry.swatchesClientHeight);
  // A altura VISÍVEL da área de swatches é bem menor que a altura total do viewport
  // (a paleta não "engoliu" o painel inteiro).
  expect(geometry.swatchesHeight).toBeLessThan(geometry.vh * 0.5);

  // É possível chegar do primeiro ao último swatch rolando internamente a área.
  const lastSwatchReached = await page.evaluate(() => {
    const swatches = document.getElementById('bgSwatches');
    const all = [...swatches.querySelectorAll('.bg-swatch')];
    const last = all[all.length - 1];
    last.scrollIntoView({ block: 'nearest' });
    const sw = swatches.getBoundingClientRect(), lr = last.getBoundingClientRect();
    return lr.top >= sw.top - 1 && lr.bottom <= sw.bottom + 1;
  });
  expect(lastSwatchReached).toBe(true);

  // O "+" (input[type=color] nativo, último item da linha rolável) também é
  // alcançável rolando a mesma área — permanece o alvo real de toque mesmo com
  // 100+ cores pessoais, sem exigir um painel/scroll separado.
  const plusTriggerReached = await page.evaluate(() => {
    const swatches = document.getElementById('bgSwatches');
    const wrap = document.getElementById('bgColorTriggerWrap');
    wrap.scrollIntoView({ block: 'nearest' });
    const sw = swatches.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    return wr.top >= sw.top - 1 && wr.bottom <= sw.bottom + 1;
  });
  expect(plusTriggerReached).toBe(true);
  await bgPanel.locator('#bgHexInput').scrollIntoViewIfNeeded();
  await expect(bgPanel.locator('#bgHexInput')).toBeVisible();

  // Fechar o painel continua funcionando normalmente após o exercício de volume.
  await bgPanel.locator('.panel-handle').click();
  await expect(bgPanel).not.toHaveClass(/show/);

  // Stage/layout externo não fica preso: outro painel abre normalmente em seguida.
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('#assetsModeContextMenu')).toHaveClass(/open/);
  await page.locator('#assetsModeContextMenu .panel-close-check[aria-label="Fechar"]').click();
  await expect(page.locator('#assetsModeContextMenu')).not.toHaveClass(/open/);

  expect(errors, `erros fatais: ${errors.join(' | ')}`).toEqual([]);
});

// v8z4b32E9F6-R1 — gate de REVISÃO (blocker 1 + consistência HEX/Enter) sobre a
// v8z4b32E9F6. Blocker 1: a especificação exige a MESMA arquitetura visual
// Safari-safe nos TRÊS contextos — [presets] [cores pessoais] [+] seguido de [HEX
// inline] — sem deixar o Fundo do projeto como exceção com o antigo quadrado/input
// de "Personalizar" visível como trigger. Este gate prova ESTRUTURALMENTE, nos TRÊS
// contextos, que existe exatamente um "+" decorativo (não é um swatch de cor) e que
// o input[type=color] nativo — nunca 1×1/off-screen, nunca aberto por .click()
// programático — ocupa fisicamente a área do "+" e é o alvo real resolvido por
// elementFromPoint, sem remontagem durante os próprios eventos do picker, e sem
// abrir nenhum painel intermediário do Arco. Consistência HEX/Enter: a
// documentação promete commit por Enter/blur/change — este gate prova que Enter
// comita exatamente 1 cor e que um blur/change subsequente com o MESMO valor não
// duplica, nos três campos HEX inline.
test('REG-055 — os três "+" são o input[type=color] nativo real (alvo de toque), sem painel intermediário, e Enter confirma o HEX inline sem duplicar', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = captureFatalErrors(page);
  await page.setViewportSize({ width: 390, height: 797 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await clearStartupStorage(page);
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout: 30_000 });
  await dismissProModalIfVisible(page);

  const dispatchInput = (locator, value) => locator.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
  const dispatchChange = (locator) => locator.evaluate((el) => { el.dispatchEvent(new Event('change', { bubbles: true })); });
  const pressEnter = (locator) => locator.press('Enter');

  // Prova ESTRUTURAL de que o "+" visual (pointer-events:none, decorativo) e o
  // input[type=color] nativo — nunca 1×1/off-screen, nunca aberto por .click()
  // programático — compartilham exatamente a mesma área física, e que o ponto
  // central tocável resolve, via elementFromPoint, para o próprio input.
  const assertPlusIsRealTouchTarget = async (rowSelector, wrapSelector, plusSelector, inputSelector, label) => {
    await page.locator(wrapSelector).scrollIntoViewIfNeeded();
    const result = await page.evaluate(({ rowSelector, wrapSelector, plusSelector, inputSelector }) => {
      const row = document.querySelector(rowSelector);
      const wrap = document.querySelector(wrapSelector);
      const plus = document.querySelector(plusSelector);
      const input = document.querySelector(inputSelector);
      if (!row || !wrap || !plus || !input) return { ok: false };
      const plusCountInRow = row.querySelectorAll(plusSelector).length;
      const w = wrap.getBoundingClientRect();
      const i = input.getBoundingClientRect();
      const cx = w.left + w.width / 2, cy = w.top + w.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      return {
        ok: true,
        plusCountInRow,
        plusIsColorSwatch: plus.hasAttribute('data-color') || !!plus.dataset.swatchColor,
        plusPointerEvents: getComputedStyle(plus).pointerEvents,
        inputIsChildOfWrap: wrap.contains(input),
        wrapRect: { x: w.left, y: w.top, w: w.width, h: w.height },
        inputRect: { x: i.left, y: i.top, w: i.width, h: i.height },
        inputType: input.type,
        inputPointerEvents: getComputedStyle(input).pointerEvents,
        hitIsInput: hit === input,
        hitTag: hit ? hit.tagName : null,
      };
    }, { rowSelector, wrapSelector, plusSelector, inputSelector });
    expect(result.ok, `${label}: linha/wrapper/"+"/input precisam existir no DOM`).toBe(true);
    expect(result.plusCountInRow, `${label}: exatamente um "+" trigger visível`).toBe(1);
    expect(result.plusIsColorSwatch, `${label}: o "+" NÃO pode ser um swatch de cor`).toBe(false);
    expect(result.plusPointerEvents, `${label}: o "+" visual precisa ser puramente decorativo`).toBe('none');
    expect(result.inputType, `${label}: alvo precisa ser input[type=color]`).toBe('color');
    expect(result.inputIsChildOfWrap, `${label}: o input nativo precisa estar dentro do wrapper do "+"`).toBe(true);
    expect(result.inputRect.w, `${label}: input não pode ser 1×1`).toBeGreaterThan(20);
    expect(result.inputRect.h, `${label}: input não pode ser 1×1`).toBeGreaterThan(20);
    expect(result.inputRect.x, `${label}: input não pode estar deslocado para fora da tela`).toBeGreaterThan(-1);
    expect(result.inputRect.y, `${label}: input não pode estar deslocado para fora da tela`).toBeGreaterThan(-1);
    expect(Math.abs(result.inputRect.x - result.wrapRect.x), `${label}: input deve cobrir a MESMA área do "+"`).toBeLessThan(1.5);
    expect(Math.abs(result.inputRect.y - result.wrapRect.y), `${label}`).toBeLessThan(1.5);
    expect(Math.abs(result.inputRect.w - result.wrapRect.w), `${label}`).toBeLessThan(1.5);
    expect(Math.abs(result.inputRect.h - result.wrapRect.h), `${label}`).toBeLessThan(1.5);
    expect(result.inputPointerEvents, `${label}: input precisa ser interativo (pointer-events != none)`).not.toBe('none');
    expect(result.hitTag, `${label}: o ponto central tocável do "+" deve resolver para um <input>`).toBe('INPUT');
    expect(result.hitIsInput, `${label}: deve resolver exatamente para o input nativo, não para o "+" visual`).toBe(true);
  };

  // Prova de que o wrapper/input NÃO é removido/recriado/reparentado ao reagir aos
  // SEUS PRÓPRIOS eventos ('input'/'change') — MutationObserver detecta remoção
  // momentânea mesmo quando o objeto DOM volta a ser o mesmo depois.
  const assertNeverRemounted = async (rowSelector, wrapSelector, inputSelector, action, label) => {
    await page.evaluate(({ rowSelector, wrapSelector, inputSelector }) => {
      const row = document.querySelector(rowSelector);
      const wrap = document.querySelector(wrapSelector);
      const input = document.querySelector(inputSelector);
      const probe = { removed: false, wrap, input };
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) for (const n of m.removedNodes) if (n === wrap || n === input) probe.removed = true;
      });
      observer.observe(row, { childList: true, subtree: true });
      window.__triggerStabilityProbe = probe;
      window.__triggerStabilityObserver = observer;
    }, { rowSelector, wrapSelector, inputSelector });
    await action();
    const result = await page.evaluate(({ inputSelector, wrapSelector }) => {
      const probe = window.__triggerStabilityProbe;
      window.__triggerStabilityObserver.disconnect();
      const inputNow = document.querySelector(inputSelector), wrapNow = document.querySelector(wrapSelector);
      return { removedDuringUpdate: probe.removed, sameInputNode: probe.input === inputNow, sameWrapNode: probe.wrap === wrapNow, connected: inputNow ? inputNow.isConnected : false };
    }, { inputSelector, wrapSelector });
    expect(result.removedDuringUpdate, `${label}: input/wrapper não pode ser removido do DOM ao reagir aos seus próprios eventos`).toBe(false);
    expect(result.sameInputNode, `${label}: mesmo objeto DOM do input antes/depois`).toBe(true);
    expect(result.sameWrapNode, `${label}: mesmo objeto DOM do wrapper antes/depois`).toBe(true);
    expect(result.connected, `${label}: input precisa permanecer conectado ao documento`).toBe(true);
  };

  // ── Fundo do projeto ──
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('body')).toHaveClass(/editor-assets/);
  await page.locator('#modeAssetsBtn').click();
  await expect(page.locator('#assetsModeContextMenu')).toHaveClass(/open/);
  await page.locator('#assetsModeContextMenu .assets-menu-btn').filter({ hasText: 'Fundo' }).click();
  const bgPanel = page.locator('#panelBgColor');
  await expect(bgPanel).toHaveClass(/show/);
  await page.waitForFunction(() => {
    const t = getComputedStyle(document.getElementById('panelBgColor')).transform;
    return t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
  }, { timeout: 5_000 });

  await assertPlusIsRealTouchTarget('#bgSwatches', '#bgColorTriggerWrap', '#bgSwatches .bg-swatch-add', '#bgHexInput', 'Fundo do projeto');
  // O antigo quadrado cinza/input "Personalizar" (visível fora do wrapper do "+",
  // rotulado por texto ao lado) não permanece como trigger visual separado.
  expect(await page.evaluate(() => document.body.textContent.includes('Personalizar'))).toBe(false);
  expect(await page.evaluate(() => !!document.getElementById('customColorPanel'))).toBe(false);
  await assertNeverRemounted('#bgSwatches', '#bgColorTriggerWrap', '#bgHexInput', async () => {
    await dispatchInput(bgPanel.locator('#bgHexInput'), '#a1a2a3');
    await dispatchChange(bgPanel.locator('#bgHexInput'));
  }, 'Fundo do projeto');

  // Enter no HEX confirma exatamente 1 cor; blur/change subsequente com o MESMO
  // valor não duplica.
  let paletteBefore = await page.evaluate(() => customColorPalette.length);
  const progressiveBg = '#a4b5c6';
  for (let i = 1; i <= progressiveBg.length; i++) await dispatchInput(bgPanel.locator('#bgHexText'), progressiveBg.slice(0, i));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  await pressEnter(bgPanel.locator('#bgHexText'));
  await expect.poll(() => page.evaluate(() => bgColor)).toBe(progressiveBg);
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);
  // blur em seguida (dispara 'change' nativo do navegador) não duplica.
  await bgPanel.locator('#bgHexText').evaluate((el) => el.blur());
  await dispatchChange(bgPanel.locator('#bgHexText'));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);

  await bgPanel.locator('.panel-handle').click();
  await expect(bgPanel).not.toHaveClass(/show/);

  // ── Cor do texto ──
  const sheet = page.locator('#textCreationSheet');
  await page.locator('#lowerAddOrSelectAllBtn').click();
  await expect(page.locator('#assetsAddMenu')).toHaveClass(/open/);
  await page.locator('#assetsMenuTextBtn').click();
  await expect(sheet).toHaveClass(/open/);
  await page.locator('#textCreationInput').fill('REG055R1');
  await sheet.getByRole('tab', { name: 'Cor do texto', exact: true }).click();

  await assertPlusIsRealTouchTarget('#textColorSwatches', '#textColorTriggerWrap', '#textColorSwatches .text-swatch-add', '#textCreationColor', 'Cor do texto');
  await assertNeverRemounted('#textColorSwatches', '#textColorTriggerWrap', '#textCreationColor', async () => {
    await dispatchInput(page.locator('#textCreationColor'), '#b1b2b3');
    await dispatchChange(page.locator('#textCreationColor'));
  }, 'Cor do texto');

  paletteBefore = await page.evaluate(() => customColorPalette.length);
  const progressiveTextColor = '#c7d8e9';
  for (let i = 1; i <= progressiveTextColor.length; i++) await dispatchInput(page.locator('#textColorHexText'), progressiveTextColor.slice(0, i));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  await pressEnter(page.locator('#textColorHexText'));
  await expect.poll(() => page.evaluate(() => pendingTextDraft.color)).toBe(progressiveTextColor);
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);
  await page.locator('#textColorHexText').evaluate((el) => el.blur());
  await dispatchChange(page.locator('#textColorHexText'));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);

  // ── Fundo da caixa ──
  await sheet.getByRole('tab', { name: 'Fundo da caixa', exact: true }).click();
  await assertPlusIsRealTouchTarget('#textBgSwatches', '#textBgTriggerWrap', '#textBgSwatches .text-swatch-add', '#textBoxBackgroundColor', 'Fundo da caixa');
  await assertNeverRemounted('#textBgSwatches', '#textBgTriggerWrap', '#textBoxBackgroundColor', async () => {
    await dispatchInput(page.locator('#textBoxBackgroundColor'), '#c1c2c3');
    await dispatchChange(page.locator('#textBoxBackgroundColor'));
  }, 'Fundo da caixa');

  paletteBefore = await page.evaluate(() => customColorPalette.length);
  const progressiveTextBox = '#d9e0f1';
  for (let i = 1; i <= progressiveTextBox.length; i++) await dispatchInput(page.locator('#textBoxBackgroundHexText'), progressiveTextBox.slice(0, i));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore);
  await pressEnter(page.locator('#textBoxBackgroundHexText'));
  await expect.poll(() => page.evaluate(() => pendingTextDraft.boxBackgroundColor)).toBe(progressiveTextBox);
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);
  await page.locator('#textBoxBackgroundHexText').evaluate((el) => el.blur());
  await dispatchChange(page.locator('#textBoxBackgroundHexText'));
  expect(await page.evaluate(() => customColorPalette.length)).toBe(paletteBefore + 1);

  await sheet.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(sheet).not.toHaveClass(/open/);

  expect(await page.evaluate(() => !!document.getElementById('customColorPanel'))).toBe(false);
  expect(errors, `erros fatais: ${errors.join(' | ')}`).toEqual([]);
});
