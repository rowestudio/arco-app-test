import { expect, test } from '@playwright/test';
import path from 'node:path';

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
  await page.locator('#modeAssetsBtn').click(); await expect(page.locator('body')).toHaveClass(/editor-assets/); await page.locator('#lowerAddOrSelectAllBtn').click(); await page.locator('#assetsMenuTextBtn').click();
  const content='Texto'; await page.locator('#textCreationInput').fill(content);
  await page.locator('#textCreationColor').evaluate(el=>{el.value='#ff3366';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.getByRole('tab',{name:'Fonte',exact:true}).click(); await page.getByRole('button',{name:'Fonte Serifada',exact:true}).click();
  await page.getByRole('tab',{name:'Estilo',exact:true}).click(); await page.getByRole('button',{name:'Estilo Negrito + itálico',exact:true}).click();
  await page.getByRole('tab',{name:'Texto',exact:true}).click(); await page.getByRole('button',{name:'Alinhar Direita',exact:true}).click();
  await page.getByRole('tab',{name:'Cor',exact:true}).click(); await page.locator('#textBoxBackgroundToggle').click(); await page.locator('#textBoxBackgroundColor').evaluate(el=>{el.value='#112233';el.dispatchEvent(new Event('input',{bubbles:true}))}); await page.locator('#textBoxBackgroundOpacity').fill('65');
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
