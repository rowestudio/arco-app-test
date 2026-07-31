import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
assert.ok(!html.includes('function loadMainImageForMultiInsert('),'o posicionamento não pode aplicar a imagem principal antes do commit final');
assert.ok(html.includes('prepared = await prepareMultiImageFiles(files);'));
assert.ok(html.indexOf('prepared = await prepareMultiImageFiles(files);') < html.indexOf('pendingMultiImagePlacement = {'));
assert.ok(html.includes('if (state.currentIndex < state.preparedImages.length)'));
console.log('Multi-image preparation-before-placement contract passed.');
