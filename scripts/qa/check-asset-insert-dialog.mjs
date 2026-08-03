import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const html=readFileSync(process.env.QA_ASSET_INSERT_HTML||path.join(root,'index.html'),'utf8');
const failures=[];
function body(name){const marker=`function ${name}(`,start=html.indexOf(marker);if(start<0){failures.push(`${name} ausente`);return '';}const brace=html.indexOf('{',start);let depth=0;for(let i=brace;i<html.length;i++){if(html[i]==='{')depth++;else if(html[i]==='}'&&--depth===0)return html.slice(brace+1,i);}failures.push(`${name} incompleta`);return '';}
const start=body('startInsertImageFlow'), chosen=body('handleMultiImageInsertChosen'), begin=body('beginAssetInsertionMode'), confirm=body('confirmAssetInsertionDraft'), commit=body('commitPendingMultiImageInsert'), cancel=body('cancelAssetInsertionMode');
const require=(ok,msg)=>{if(!ok)failures.push(msg)};
require(!html.includes('id="assetInsertDialog"'),'modal pré-Fototeca ainda existe');
require(!html.includes('id="multiImageLayoutSheet"'),'escolha de layout ainda existe');
require(!html.includes('Empilhar no centro')&&!html.includes('Distribuir na horizontal')&&!html.includes('Distribuir na vertical'),'opções de layout ainda visíveis');
require(start.includes('triggerMultiImageInsertPicker()'),'Inserir imagens não abre diretamente o picker múltiplo');
require(!start.includes('openAssetInsertDialog'),'fluxo ainda roteia pelo modal pré-Fototeca');
require(chosen.includes('beginAssetInsertionMode(files)'),'arquivos escolhidos não iniciam o modo no Stage');
require(begin.includes('await prepareMultiImageFiles(files)'),'lote não é preparado integralmente antes do primeiro provisório');
require(begin.indexOf('await prepareMultiImageFiles(files)')<begin.indexOf('assetInsertionMode ='),'estado modal nasce antes do preparo integral');
require(confirm.includes('m.confirmed.push')&&confirm.includes('commitPendingMultiImageInsert()'),'OK não confirma geometria e avança até commit final');
require(commit.includes('pushUndoSnapshot(snapshot.state)')&&commit.includes("markProjectDirty('add-image-assets')"),'commit final não consolida Undo/autosave');
require(!begin.includes('assets.push')&&!confirm.includes('assets.push'),'provisório entra em assets antes do commit final');
require(!begin.includes('selectedAssetId =')&&!confirm.includes('selectedAssetId ='),'provisório usa identidade canônica antes do commit');
require(cancel.includes('releasePreparedMultiImages')&&!cancel.includes('pushUndoSnapshot')&&!cancel.includes('markProjectDirty'),'cancelamento não é transacionalmente neutro');
require(html.includes('blockOutsideAssetInsertionInteraction')&&html.includes('Confirme ou cancele a inserção atual para continuar.'),'bloqueio modal externo ausente');
require(html.includes("['tl','tr','bl','br']")&&html.includes('beginAssetInsertionMove')&&html.includes('beginAssetInsertionTransform'),'provisório não oferece movimento e quatro abas completas');
if(failures.length){console.error(failures.map(x=>`- ${x}`).join('\n'));process.exit(1)}
console.log('Asset insertion mode guardrail passed.');
