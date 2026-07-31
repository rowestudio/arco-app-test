import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
function extract(name){const s=html.indexOf(`function ${name}(`);assert.notEqual(s,-1);const b=html.indexOf('{',s);let d=0;for(let i=b;i<html.length;i++){if(html[i]==='{')d++;else if(html[i]==='}'&&--d===0)return html.slice(s,i+1)}throw new Error('extract')}
const source=extract('centerEditorViewportOnAsset');
const context=vm.createContext({Array,Number});
vm.runInContext(`
let assets=[],stageW=300,stageH=500,editorZoomScale=0.75,editorPanX=0,editorPanY=0,zoomApplications=0;
function computeEditorTransform(){}
function editorWorldToStage(x,y,w,h){return{x,y,w,h}}
function clampEditorPan(){editorPanX=Math.max(-10000,Math.min(10000,editorPanX));editorPanY=Math.max(-10000,Math.min(10000,editorPanY))}
function applyEditorZoom(){zoomApplications++}
${source}
function setAssets(value){assets=value}
function result(){return{editorPanX,editorPanY,zoomApplications}}
`,context);
for(const list of [
 [{id:'a',type:'image',worldX:-900,worldY:0,worldW:200,worldH:100},{id:'b',type:'image',worldX:900,worldY:0,worldW:200,worldH:100}],
 [{id:'a',type:'image',worldX:0,worldY:-1200,worldW:100,worldH:300},{id:'b',type:'image',worldX:0,worldY:1200,worldW:100,worldH:300}],
 [{id:'a',type:'image',worldX:-20,worldY:-20,worldW:250,worldH:400},{id:'b',type:'image',worldX:20,worldY:20,worldW:250,worldH:400}],
]){
 context.setAssets(list);
 for(const asset of list){assert.equal(context.centerEditorViewportOnAsset(asset.id),true);const r=context.result();assert.ok(Number.isFinite(r.editorPanX)&&Number.isFinite(r.editorPanY));}
}
assert.equal(context.centerEditorViewportOnAsset('missing'),false);
assert.equal(context.result().zoomApplications,6);
console.log('ProjectWorld viewport controller tests passed.');
