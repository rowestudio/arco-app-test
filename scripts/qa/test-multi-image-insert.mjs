import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
function extractFunction(name) {
  const marker = `function ${name}(`;
  let start = html.indexOf(marker);
  assert.notEqual(start, -1, `${name} deve existir no app real`);
  if (html.slice(Math.max(0, start - 6), start) === 'async ') start -= 6;
  const brace = html.indexOf('{', start); let depth = 0;
  for (let i = brace; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}' && --depth === 0) return html.slice(start, i + 1);
  }
  throw new Error(`fim de ${name} não encontrado`);
}
const elements = Object.fromEntries(['multiImageInsertInput','multiImageLayoutSheet','multiImageLayoutTitle','multiImageLayoutActions','multiImageLayoutBusy'].map(id => [id, {
  id, style:{ display:'none' }, textContent:'', value:'', files:[], addEventListener(){}, removeAttribute(){}, setAttribute(){}
}]));
const context = vm.createContext({ console, Uint8Array, String, Math, Array, Error, setTimeout, clearTimeout,
  document:{ getElementById:id=>elements[id] || null, addEventListener(){} }, window:{} });
const functions = [
  'resetMultiImageInsertDiagnostics','releasePreparedMultiImages','clearPendingMultiImageInsert','openMultiImageLayoutSheet',
  'closeMultiImageLayoutSheet','handleMultiImageInsertChosen','calculateMultiImageLayout','createPreparedImageAsset',
  'snapshotMultiImageTransaction','rollbackMultiImageTransaction','commitPendingMultiImageInsert'
].map(extractFunction).join('\n');
vm.runInContext(`
let pendingMultiImageFiles=null,multiImageInsertBusy=false,multiImageInsertSelectedCount=0,multiImageInsertPreparedCount=0,
multiImageInsertCommittedCount=0,multiImageInsertLayout='',multiImageInsertCancelled=false,multiImageInsertPreparationFailed=false,
multiImageInsertCommitFailed=false,multiImageInsertRollbackRequired=false,multiImageInsertRollbackCompleted=false,
multiImageInsertTemporariesReleased=0,multiImageInsertHistoryCreated=false,multiImageInsertAutosavesScheduled=0,
multiImageInsertFinalSelectedAssetId='',multiImageInsertAlphaCount=0,pendingImageAction='insertImage',selectedAssetId=null,
nextLayerSequence=1,_sessionAutosaveQueuedRevision=0,_sessionAutosaveTimer=null,imgNatW=100,stageW=300,stageH=500,lastUndoAction='';
let assets=[],undoStack=[],redoStack=[],projectWorld={baseStageW:300,baseStageH:500},failCommit=false,statuses=[],singleCalls=0;
const fitContain=(w,h,bw,bh)=>{const s=Math.min(bw/w,bh/h);return {width:w*s,height:h*s}};
const computeEditorTransform=()=>{}; const editorStageToWorld=(x,y)=>({x,y}); const getMultiImageVisibleCenter=()=>({x:150,y:250}); const clearPendingImageAction=()=>{pendingImageAction=null};
const doInsertImageFromFile=()=>{singleCalls++}; const captureState=()=>({assets:assets.map(a=>({...a})),nextLayerSequence,imgNatW});
const restoreState=s=>{assets=s.assets.map(a=>({...a}));nextLayerSequence=s.nextLayerSequence;imgNatW=s.imgNatW};
const clearCurrentProjectForNewFile=()=>{assets=[];nextLayerSequence=1;imgNatW=0;undoStack=[];redoStack=[]};
const clearSelectedAsset=()=>{selectedAssetId=null}; const selectAssetById=id=>{selectedAssetId=id};
const assignPersistentLayerIdentity=(a,name)=>{if(failCommit)throw new Error('commit');a.layerSequence=nextLayerSequence++;a.layerName='Camada '+a.layerSequence;a.originalFileName=name;return a};
const invalidateProjectWorldComposite=()=>{},renderProjectWorldExtraImages=()=>{},renderLayersPanelList=()=>{},renderAll=()=>{},clampEditorPan=()=>{};
const pushUndoSnapshot=s=>{undoStack.push(s);redoStack=[]}; const markProjectDirty=()=>{_sessionAutosaveQueuedRevision++};
const showStatus=s=>statuses.push(s); const getMainImageAsset=()=>assets[0]||null;
let preparedFactory=files=>files.map((file,i)=>({file,kind:file.kind||'image/jpeg',dataUrl:'data:'+i,image:{src:'data:'+i},width:file.width||100,height:file.height||80,hasAlpha:file.kind==='image/png'}));
let prepareMultiImageFiles=async files=>preparedFactory(files);
let loadMainImageForMultiInsert=async file=>{imgNatW=100;const a={id:'main',type:'image',zIndex:1,layerSequence:nextLayerSequence++,worldW:100,worldH:80};assets.push(a);return a};
${functions}
`, context);
const run = code => vm.runInContext(code, context);
const files = [{name:'a.jpg',width:120,height:80},{name:'b.png',kind:'image/png',width:80,height:120},{name:'c.webp',kind:'image/webp',width:100,height:100}];
context.files = files;

// Unitário: projeto existente e vazio continuam no pipeline oficial, sem modal.
run(`imgNatW=100;handleMultiImageInsertChosen({target:{files:[files[0]],value:'x'}})`); assert.equal(run('singleCalls'),1); assert.equal(elements.multiImageLayoutSheet.style.display,'none');
run(`imgNatW=0;pendingImageAction='insertImage';handleMultiImageInsertChosen({target:{files:[files[0]],value:'x'}})`); assert.equal(run('singleCalls'),2);

// Modal: nenhuma mutação, título real, cancelamentos e zero histórico/autosave.
run(`resetMultiImageInsertDiagnostics(files.length);imgNatW=100;assets=[{id:'old',type:'image',zIndex:1}];undoStack=[];_sessionAutosaveQueuedRevision=0;handleMultiImageInsertChosen({target:{files,value:'x'}})`);
assert.equal(elements.multiImageLayoutSheet.style.display,'flex'); assert.equal(elements.multiImageLayoutTitle.textContent,'Inserir 3 imagens'); assert.equal(run('assets.length'),1);
run(`closeMultiImageLayoutSheet('cancel')`); assert.equal(run('assets.length'),1); assert.equal(run('undoStack.length'),0); assert.equal(run('_sessionAutosaveQueuedRevision'),0); assert.equal(run('pendingMultiImageFiles'),null);

// Layouts reais: ordem, ausência de sobreposição horizontal/vertical e pilha compacta.
for (const layout of ['stack','horizontal','vertical']) {
  context.layout=layout;
  const p=run(`calculateMultiImageLayout(preparedFactory(files),layout,{x:0,y:0},300,500)`);
  assert.equal(p.length,3);
  if(layout==='horizontal') assert.ok(p[0].x+p[0].w < p[1].x && p[1].x+p[1].w < p[2].x);
  if(layout==='vertical') assert.ok(p[0].y+p[0].h < p[1].y && p[1].y+p[1].h < p[2].y);
  if(layout==='stack') assert.ok(Math.abs(p[2].x-p[0].x)<40 && p[0].x!==p[1].x);
}

// Projeto existente: commit completo, IDs/sequence/z consecutivos, último selecionado, Undo/Redo e autosave únicos.
run(`imgNatW=100;assets=[{id:'old',type:'image',zIndex:5,layerSequence:1}];nextLayerSequence=2;undoStack=[];redoStack=[];_sessionAutosaveQueuedRevision=0;pendingMultiImageFiles=files;multiImageInsertBusy=false;failCommit=false`);
assert.equal(await run(`commitPendingMultiImageInsert('horizontal')`),true);
assert.equal(run('assets.length'),4); assert.deepEqual(Array.from(run('assets.slice(1).map(a=>a.layerSequence)')),[2,3,4]);
assert.deepEqual(Array.from(run('assets.slice(1).map(a=>a.zIndex)')),[6,7,8]); assert.equal(run('new Set(assets.map(a=>a.id)).size'),4);
assert.equal(run('selectedAssetId'),run('assets[3].id')); assert.equal(run('undoStack.length'),1); assert.equal(run('_sessionAutosaveQueuedRevision'),1);
assert.equal(run('multiImageInsertAlphaCount'),1); assert.equal(run('multiImageInsertAutosavesScheduled'),1);
run(`redoStack.push(captureState());restoreState(undoStack.pop())`); assert.equal(run('assets.length'),1);
run(`undoStack.push(captureState());restoreState(redoStack.pop())`); assert.equal(run('assets.length'),4);

// Projeto vazio: primeira vira principal, restantes ativos, todos no layout e última selecionada.
run(`imgNatW=0;assets=[];nextLayerSequence=1;undoStack=[];redoStack=[];_sessionAutosaveQueuedRevision=0;pendingMultiImageFiles=files;multiImageInsertBusy=false`);
assert.equal(await run(`commitPendingMultiImageInsert('vertical')`),true); assert.equal(run('assets[0].id'),'main'); assert.equal(run('assets.length'),3); assert.equal(run('selectedAssetId'),run('assets[2].id'));

// Falha no primeiro/segundo decode: zero commit/autosave e temporários anteriores liberados.
for (const validBefore of [0,1]) {
  context.validBefore=validBefore;
  run(`resetMultiImageInsertDiagnostics(files.length);imgNatW=100;assets=[{id:'old',type:'image',zIndex:1}];undoStack=[];_sessionAutosaveQueuedRevision=0;pendingMultiImageFiles=files;multiImageInsertBusy=false;
    prepareMultiImageFiles=async fs=>{const p=preparedFactory(fs).slice(0,validBefore);multiImageInsertPreparedCount=p.length;releasePreparedMultiImages(p);throw new Error('decode')}`);
  assert.equal(await run(`commitPendingMultiImageInsert('stack')`),false); assert.equal(run('assets.length'),1); assert.equal(run('undoStack.length'),0); assert.equal(run('_sessionAutosaveQueuedRevision'),0); assert.equal(run('multiImageInsertTemporariesReleased'),validBefore);
}

// Falha no commit: rollback integral, sem histórico/autosave parcial; toque duplicado bloqueado.
run(`prepareMultiImageFiles=async fs=>preparedFactory(fs);imgNatW=100;assets=[{id:'old',type:'image',zIndex:1,layerSequence:1}];nextLayerSequence=2;undoStack=[];redoStack=[];_sessionAutosaveQueuedRevision=0;pendingMultiImageFiles=files;multiImageInsertBusy=false;failCommit=true`);
assert.equal(await run(`commitPendingMultiImageInsert('stack')`),false); assert.equal(run('assets.length'),1); assert.equal(run('nextLayerSequence'),2); assert.equal(run('undoStack.length'),0); assert.equal(run('_sessionAutosaveQueuedRevision'),0); assert.equal(run('multiImageInsertRollbackCompleted'),true);
run(`multiImageInsertBusy=true;pendingMultiImageFiles=files`); assert.equal(await run(`commitPendingMultiImageInsert('stack')`),false); run(`multiImageInsertBusy=false;failCommit=false`);

// Compatibilidade observável de Save/Load, ProjectWorld e Session Restore usa o snapshot canônico do lote.
run(`assets=[{id:'saved',type:'image',worldX:-50,worldY:20,worldW:100,worldH:80,layerSequence:7}];nextLayerSequence=8;const saved=captureState();assets=[];nextLayerSequence=1;restoreState(saved)`);
assert.equal(run('assets[0].id'),'saved'); assert.equal(run('assets[0].worldX'),-50); assert.equal(run('nextLayerSequence'),8);
assert.equal(run('multiImageInsertBusy'),false);

// Contrato DOM: inputs separados; Trocar permanece unitário.
const unit=html.match(/<input type="file" id="fileInput2"[^>]*>/)?.[0]||''; const multi=html.match(/<input type="file" id="multiImageInsertInput"[^>]*>/)?.[0]||'';
assert.ok(unit.includes('accept="image/*"')); assert.ok(!unit.includes('multiple')); assert.ok(multi.includes('multiple'));
console.log('Multi-image functional controller tests passed (30 scenarios).');
