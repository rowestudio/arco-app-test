import { expect, test } from '@playwright/test';
import path from 'node:path';
import { dismissProModalIfVisible } from './ui-helpers.mjs';

const projectFixture = path.resolve('samples/arquivo 8vo imagem.json');
const h264Candidates = ['avc1.42001f','avc1.42E01E','avc1.4D401F'];
const h264Base = { width:720, height:1280, framerate:30, bitrate:10_000_000, hardwareAcceleration:'prefer-hardware' };

async function openProject(page) {
  const errors=[];
  page.on('crash', () => errors.push('page crash'));
  page.on('pageerror', error => errors.push(error.message || String(error)));
  await page.goto('/', { waitUntil:'domcontentloaded', timeout:30_000 });
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout:30_000 });
  return errors;
}

async function requireNativeH264(page) {
  const results = await page.evaluate(async ({candidates,base}) => {
    if (typeof VideoEncoder === 'undefined') throw new Error('VideoEncoder indisponível no WebKit/macOS');
    const attempts=[];
    for(const codec of candidates) {
      const config={codec,...base};
      try {
        const result=await Promise.race([VideoEncoder.isConfigSupported(config),new Promise((_,reject)=>setTimeout(()=>reject(new Error(`timeout H.264 ${codec}`)),10_000))]);
        attempts.push({codec,supported:result.supported,config:result.config});
        if(result.supported) return {selected:codec,attempts};
      } catch(error) { attempts.push({codec,error:`${error.name}: ${error.message}`}); }
    }
    return {selected:null,attempts};
  }, {candidates:h264Candidates,base:h264Base});
  console.log(`H.264 preflight: ${JSON.stringify(results)}`);
  expect(results.selected, `Nenhum candidato H.264 suportado: ${JSON.stringify(results.attempts)}`).toBeTruthy();
  return results.selected;
}

async function exportRealMp4(page, testInfo, name) {
  await page.evaluate(() => { loopEnabled=false; for(let i=0;i<segDurations.length;i++) segDurations[i]=0.1; startRecord(); });
  await expect.poll(() => page.evaluate(() => exportGenerationCompleted || arcoExportDiag.exportSuccess === true), { timeout:120_000 }).toBe(true);
  const proof = await page.evaluate(async () => {
    const blob=window._lastVideoBlob;
    const data=blob?new Uint8Array(await blob.arrayBuffer()):new Uint8Array();
    const signature=String.fromCharCode(...data.slice(4,8));
    return { success:arcoExportDiag.exportSuccess===true, completed:exportGenerationCompleted===true, encoderPath:arcoExportDiag.encoderPathUsed, fallback:arcoExportDiag.fallbackUsed, ext:window._lastVideoExt, bytes:blob?.size||0, type:blob?.type||'', canvas:[recCanvas.width,recCanvas.height], signature, data:Array.from(data) };
  });
  expect(proof).toMatchObject({success:true,completed:true,encoderPath:'webcodecs',fallback:false,ext:'mp4',canvas:[720,1280],type:'video/mp4',signature:'ftyp'});
  expect(proof.bytes).toBeGreaterThan(0);
  await testInfo.attach(`${name}.mp4`, { body:Buffer.from(proof.data), contentType:'video/mp4' });
  return proof;
}

test('WebKit macOS real Export — controle somente imagem', async ({page}, testInfo) => {
  test.setTimeout(180_000); const errors=await openProject(page); await requireNativeH264(page);
  expect(await page.evaluate(() => assets.filter(a=>a?.type==='text').length)).toBe(0);
  await exportRealMp4(page,testInfo,'image-only'); expect(errors).toEqual([]);
});

test('WebKit macOS real Export — imagem com Text Asset E9D horizontal, caixa e profundidade', async ({page}, testInfo) => {
  test.setTimeout(180_000); const errors=await openProject(page); await requireNativeH264(page);
  await dismissProModalIfVisible(page);
  await page.locator('#modeAssetsBtn').click(); await expect(page.locator('body')).toHaveClass(/editor-assets/); await page.locator('#lowerAddOrSelectAllBtn').click(); await page.locator('#assetsMenuTextBtn').click();
  const content='Texto'; await page.locator('#textCreationInput').fill(content);
  await page.locator('#textCreationColor').evaluate(el=>{el.value='#ff3366';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.getByRole('tab',{name:'Fonte',exact:true}).click(); await page.getByRole('button',{name:'Fonte Serifada',exact:true}).click();
  await page.getByRole('tab',{name:'Estilo',exact:true}).click(); await page.getByRole('button',{name:'Estilo Negrito + itálico',exact:true}).click();
  await page.getByRole('tab',{name:'Alinhamento',exact:true}).click(); await page.getByRole('button',{name:'Alinhar Direita',exact:true}).click();
  // v8z4b32E9F1 — escolher uma cor no picker de Fundo já LIGA o fundo (boxBackgroundEnabled=true) e revela o slider de opacidade.
  await page.getByRole('tab',{name:'Fundo da caixa',exact:true}).click(); await page.locator('#textBoxBackgroundColor').evaluate(el=>{el.value='#112233';el.dispatchEvent(new Event('input',{bubbles:true}))}); await page.locator('#textBoxBackgroundOpacity').fill('65');
  await page.getByRole('button',{name:'Confirmar',exact:true}).click();
  const stage=await page.locator('.world-text-asset').filter({hasText:'Texto'}).boundingBox(); expect(stage.width).toBeGreaterThan(stage.height);
  await page.locator('#tbAssetDepth').click(); await page.locator('#assetContextSlider').fill('42'); await page.locator('#assetContextSlider').dispatchEvent('change'); await page.getByRole('button',{name:'Voltar'}).click();
  const before=await page.evaluate(() => {const text=getSelectedAsset(),m=measureTextAsset({...text});return{text:serializeProjectAsset(text,0,false),lines:m.lines,frames:structuredClone(frames.slice(0,frameCount)),world:structuredClone(projectWorld),order:assets.slice().sort((a,b)=>a.zIndex-b.zIndex).map(a=>String(a.id))}});
  expect(before.text).toMatchObject({text:content,color:'#ff3366',fontKey:'serif',fontWeight:700,fontStyle:'italic',textAlign:'right',depth:42,boxStyle:'block',boxBackgroundEnabled:true,boxBackgroundColor:'#112233',boxBackgroundOpacity:.65}); expect(before.lines).toEqual(['Texto']); expect(before.text.worldW).toBeGreaterThan(before.text.boxWidth);
  await exportRealMp4(page,testInfo,'image-text-e9d');
  const after=await page.evaluate(id=>({text:renderSessionSnapshot?.textAssets?.find(a=>String(a.id)===id),frames:structuredClone(frames.slice(0,frameCount)),world:structuredClone(projectWorld),order:assets.slice().sort((a,b)=>a.zIndex-b.zIndex).map(a=>String(a.id))}),String(before.text.id));
  expect(after.text).toMatchObject({id:before.text.id,text:content,color:'#ff3366',fontKey:'serif',fontWeight:700,fontStyle:'italic',textAlign:'right',worldX:before.text.worldX,worldY:before.text.worldY,worldW:before.text.worldW,depth:42,zIndex:before.text.zIndex});
  expect(after.frames).toEqual(before.frames); expect(after.world).toEqual(before.world); expect(after.order).toEqual(before.order); expect(errors).toEqual([]);
});

test('WebKit macOS real Export — presença temporal mantém o quadro não vazio quando outro asset continua presente', async ({page}, testInfo) => {
  test.setTimeout(180_000);
  const errors = await openProject(page);
  await requireNativeH264(page);
  await dismissProModalIfVisible(page);

  const setup = await page.evaluate(async () => {
    const original = { isProMode, bgColor, isPreviewing, isRecording, renderSessionSnapshot, renderSessionActiveContext, exportTransform: renderTransform.export };
    const outputBg = '#010203';
    const parseHex = (hex) => {
      const raw = String(hex || '').replace('#', '');
      return raw.length === 6
        ? { r: parseInt(raw.slice(0, 2), 16), g: parseInt(raw.slice(2, 4), 16), b: parseInt(raw.slice(4, 6), 16) }
        : { r: 0, g: 0, b: 0 };
    };
    const countNonBackgroundPixels = (canvas, hex) => {
      const { r, g, b } = parseHex(hex);
      const data = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data;
      let count = 0;
      for (let index = 0; index < data.length; index += 4) {
        if (data[index + 3] === 0) continue;
        if (data[index] !== r || data[index + 1] !== g || data[index + 2] !== b) count++;
      }
      return count;
    };
    const readEntry = (snapshot, id) => {
      const image = Array.isArray(snapshot?.assets) ? snapshot.assets.find(asset => String(asset.id) === String(id)) : null;
      if (image) return image;
      return Array.isArray(snapshot?.textAssets) ? snapshot.textAssets.find(asset => String(asset.id) === String(id)) : null;
    };
    const drawExportAt = async (t, frameIndex, ids) => {
      renderSessionSnapshot = null;
      renderSessionActiveContext = '';
      renderTransform.export = null;
      const prepared = await prepareRenderSessionSnapshot('export');
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 568;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const previousPreviewing = isPreviewing;
      const previousRecording = isRecording;
      try {
        isPreviewing = false;
        isRecording = true;
        const ok = drawAtT(ctx, t, canvas.width, canvas.height, frameCount, frameIndex, null, null);
        return {
          ok,
          prepared,
          drawnIds: Array.isArray(renderTransform.export?.assets) ? renderTransform.export.assets.map(asset => String(asset.id)) : [],
          snapshot: Object.fromEntries(ids.map(id => {
            const entry = readEntry(renderSessionSnapshot, id);
            return [id, entry ? { present: entry.present, type: entry.type || (typeof entry.text === 'string' ? 'text' : 'image') } : null];
          })),
          nonBackgroundPixels: countNonBackgroundPixels(canvas, outputBg),
          leakedEditorialClassText: JSON.stringify({
            snapshotAssets: renderSessionSnapshot?.assets || [],
            snapshotTextAssets: renderSessionSnapshot?.textAssets || [],
            auditAssets: renderTransform.export?.assets || [],
          }).includes('asset-temporal-reference'),
        };
      } finally {
        isPreviewing = previousPreviewing;
        isRecording = previousRecording;
      }
    };

    try {
      if (frameCount < 2) throw new Error('fixture sem dois frames para o teste de export');
      const main = assets.find(asset => asset && asset.type === 'image');
      if (!main) throw new Error('fixture sem imagem principal');
      const beforeFrameIndex = 0;
      const afterFrameIndex = 1;
      const beforeTime = getProjectTimeAtFrameId(frames[beforeFrameIndex].frameId);
      const afterFrameId = frames[afterFrameIndex].frameId;
      if (!Number.isFinite(beforeTime)) throw new Error('instante inicial inválido');
      isProMode = true;
      bgColor = outputBg;

      const frameA = frames[beforeFrameIndex];
      const frameB = frames[afterFrameIndex];
      const centerX = ((frameA.x + frameA.w / 2) + (frameB.x + frameB.w / 2)) / 2;
      const centerY = ((frameA.y + frameA.h / 2) + (frameB.y + frameB.h / 2)) / 2;
      const baseWidth = Math.min(frameA.w, frameB.w) * 0.34;
      const sourceAR = (Number(main.sourceW) > 0 && Number(main.sourceH) > 0) ? (main.sourceW / main.sourceH) : 1;
      const baseHeight = baseWidth / Math.max(sourceAR, 0.1);
      main.worldW = baseWidth;
      main.worldH = baseHeight;
      main.worldX = centerX - baseWidth * 0.88;
      main.worldY = centerY - baseHeight * 0.54;

      await ensureRenderableAssetSource(main, 'export');
      const extra = cloneAssetForDuplicate(main, 'toolbar');
      if (!extra) throw new Error('falha ao clonar asset de imagem para export');
      if (!extra.src) {
        const stageSrc = getAssetThumbSrc(main);
        if (stageSrc) extra.src = stageSrc;
      }
      extra.worldX = centerX + baseWidth * 0.12;
      extra.worldY = centerY - baseHeight * 0.46;
      extra.zIndex = Math.max(...assets.map(asset => Number(asset?.zIndex) || 0)) + 1;
      extra.presence = { mode: 'custom' };
      assets.push(extra);

      const textWidth = Math.min(frameA.w, frameB.w) * 0.72;
      const text = normalizeTextAsset({
        id: 'e9ag-export-text',
        type: 'text',
        text: 'Export temporal',
        color: '#ffffff',
        fontSize: 44,
        worldW: textWidth,
        worldH: 84,
        boxWidth: textWidth,
        worldX: centerX - textWidth / 2,
        worldY: centerY + baseHeight * 0.18,
      });
      assignPersistentLayerIdentity(text);
      text.zIndex = Math.max(...assets.map(asset => Number(asset?.zIndex) || 0)) + 1;
      assets.push(text);

      const delayedEntry = { anchor: 'frame', anchorId: afterFrameId, offset: { unit: 'seconds', value: 0 } };
      main.presence = { mode: 'custom', entry: delayedEntry };
      text.presence = { mode: 'custom', entry: delayedEntry };
      normalizeAssetZIndices();
      renderProjectWorldExtraImages();

      return {
        before: await drawExportAt(beforeTime, beforeFrameIndex, [String(main.id), String(extra.id), String(text.id)]),
        ids: { main: String(main.id), extra: String(extra.id), text: String(text.id) },
      };
    } finally {
      isProMode = original.isProMode;
      bgColor = original.bgColor;
      isPreviewing = original.isPreviewing;
      isRecording = original.isRecording;
      renderSessionSnapshot = original.renderSessionSnapshot;
      renderSessionActiveContext = original.renderSessionActiveContext;
      renderTransform.export = original.exportTransform;
    }
  });

  expect(setup.before.prepared?.ok).toBe(true);
  expect(setup.before.ok).toBe(true);
  expect(setup.before.snapshot[setup.ids.main]?.present).toBe(false);
  expect(setup.before.snapshot[setup.ids.extra]?.present).toBe(true);
  expect(setup.before.snapshot[setup.ids.text]?.present).toBe(false);
  expect(setup.before.drawnIds).toEqual([setup.ids.extra]);
  expect(setup.before.nonBackgroundPixels).toBeGreaterThan(0);
  expect(setup.before.leakedEditorialClassText).toBe(false);

  await exportRealMp4(page, testInfo, 'temporal-presence-other-asset-present');
  expect(errors).toEqual([]);
});
