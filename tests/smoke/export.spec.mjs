import { expect, test } from '@playwright/test';
import path from 'node:path';

const projectFixture = path.resolve('samples/arquivo 8vo imagem.json');
const h264Config = { codec:'avc1.42001f', width:720, height:1280, framerate:30, bitrate:10_000_000, hardwareAcceleration:'prefer-hardware' };

async function openProject(page) {
  const errors=[];
  page.on('pageerror', error => errors.push(error.message || String(error)));
  await page.goto('/', { waitUntil:'domcontentloaded', timeout:30_000 });
  await page.locator('#projectFileInput').setInputFiles(projectFixture);
  await expect(page.locator('body')).toHaveClass(/mode-editor/, { timeout:30_000 });
  return errors;
}

async function requireNativeH264(page) {
  const result = await page.evaluate(async config => {
    if (typeof VideoEncoder === 'undefined') throw new Error('VideoEncoder indisponível no Google Chrome estável');
    return Promise.race([
      VideoEncoder.isConfigSupported(config),
      new Promise((_, reject) => setTimeout(() => reject(new Error('VideoEncoder.isConfigSupported não resolveu em 10 s')), 10_000)),
    ]);
  }, h264Config);
  expect(result.supported, `H.264 não suportado: ${JSON.stringify(result.config)}`).toBe(true);
}

async function exportRealMp4(page, testInfo, name) {
  await page.evaluate(() => { loopEnabled=false; for(let i=0;i<segDurations.length;i++) segDurations[i]=0.1; startRecord(); });
  await expect.poll(() => page.evaluate(() => exportGenerationCompleted || arcoExportDiag.exportSuccess === true), { timeout:120_000 }).toBe(true);
  const proof = await page.evaluate(async () => {
    const blob=window._lastVideoBlob;
    return { success:arcoExportDiag.exportSuccess===true, bytes:blob?.size||0, type:blob?.type||'', canvas:[recCanvas.width,recCanvas.height], data:blob?Array.from(new Uint8Array(await blob.arrayBuffer())):[] };
  });
  expect(proof).toMatchObject({success:true,canvas:[720,1280]});
  expect(proof.bytes).toBeGreaterThan(0); expect(proof.type).toBe('video/mp4');
  await testInfo.attach(`${name}.mp4`, { body:Buffer.from(proof.data), contentType:'video/mp4' });
  return proof;
}

test('Chrome real Export — controle somente imagem', async ({page}, testInfo) => {
  test.setTimeout(180_000); const errors=await openProject(page); await requireNativeH264(page);
  expect(await page.evaluate(() => assets.filter(a=>a?.type==='text').length)).toBe(0);
  await exportRealMp4(page,testInfo,'image-only'); expect(errors).toEqual([]);
});

test('Chrome real Export — imagem com Text Asset E8X', async ({page}, testInfo) => {
  test.setTimeout(180_000); const errors=await openProject(page); await requireNativeH264(page);
  await page.evaluate(() => { setEditorMode('assets','chrome-export'); startTextCreation(); });
  const content='A  B\tC\nD'; await page.locator('#textCreationInput').fill(content);
  await page.locator('#textCreationColor').evaluate(el=>{el.value='#ff3366';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.getByRole('button',{name:'OK',exact:true}).click();
  const before=await page.evaluate(() => {
    const text=assets.find(a=>a?.type==='text'), cx=text.worldX+text.worldW/2, cy=text.worldY+text.worldH/2;
    text.boxWidth=text.worldW*=1.2; text.fontSize*=1.2; measureTextAsset(text); text.worldX=cx-text.worldW/2; text.worldY=cy-text.worldH/2; text.rotation=18;
    while(getAssetZOrderInfo().canForward) bringSelectedAssetForward();
    return {text:serializeProjectAsset(text,0,false),frames:structuredClone(frames.slice(0,frameCount)),world:structuredClone(projectWorld),order:assets.slice().sort((a,b)=>a.zIndex-b.zIndex).map(a=>String(a.id))};
  });
  expect(before.text).toMatchObject({text:content,color:'#ff3366',rotation:18}); expect(before.text.boxWidth).toBeCloseTo(before.text.worldW);
  await exportRealMp4(page,testInfo,'image-text-e8x');
  const after=await page.evaluate(id=>({text:renderSessionSnapshot?.textAssets?.find(a=>String(a.id)===id),frames:structuredClone(frames.slice(0,frameCount)),world:structuredClone(projectWorld),order:assets.slice().sort((a,b)=>a.zIndex-b.zIndex).map(a=>String(a.id))}),String(before.text.id));
  expect(after.text).toMatchObject({id:before.text.id,text:content,color:'#ff3366',worldX:before.text.worldX,worldY:before.text.worldY,worldW:before.text.worldW,rotation:18,zIndex:before.text.zIndex});
  expect(after.frames).toEqual(before.frames); expect(after.world).toEqual(before.world); expect(after.order).toEqual(before.order); expect(errors).toEqual([]);
});
