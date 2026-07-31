import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} deve existir no app real`);
  const brace = html.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < html.length; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}' && --depth === 0) return html.slice(start, i + 1);
  }
  throw new Error(`fim de ${name} não encontrado`);
}

const context = vm.createContext({ Uint8Array, String, Math });
vm.runInContext(`
  const WORLD_SLOTS = {
    topLeft:{row:-1,col:-1}, top:{row:-1,col:0}, topRight:{row:-1,col:1},
    left:{row:0,col:-1}, center:{row:0,col:0}, right:{row:0,col:1},
    bottomLeft:{row:1,col:-1}, bottom:{row:1,col:0}, bottomRight:{row:1,col:1}
  };
  async ${extractFunction('readSupportedImageKind')}
  ${extractFunction('getInitialInsertSlotKeys')}
`, context);

function inMemoryFile(base64, name, type) {
  const blob = new Blob([Buffer.from(base64, 'base64')], { type });
  return { name, type, slice: blob.slice.bind(blob) };
}

// Fixtures ficam exclusivamente em memória: JPEG, PNG transparente, WebP e inválido.
const jpeg = inMemoryFile('/9j/4AAQSkZJRg==', 'foto.jpg', 'image/jpeg');
const transparentPng = inMemoryFile('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ', 'alpha.png', 'image/png');
const webp = inMemoryFile('UklGRgQAAABXRUJQ', 'foto.webp', 'image/webp');
const invalid = inMemoryFile('bmFvLWUtaW1hZ2Vt', 'enganoso.png', 'image/png');

assert.equal(await context.readSupportedImageKind(jpeg), 'image/jpeg');
assert.equal(await context.readSupportedImageKind(transparentPng), 'image/png');
assert.equal(await context.readSupportedImageKind(webp), 'image/webp');
assert.equal(await context.readSupportedImageKind(invalid), null);

const centered = Array.from(context.getInitialInsertSlotKeys('center', 9));
assert.equal(centered.length, 9);
assert.equal(centered[0], 'center');
assert.equal(new Set(centered).size, 9, 'organização inicial não deve repetir slots disponíveis');
assert.deepEqual(Array.from(context.getInitialInsertSlotKeys('topLeft', 3)), ['topLeft', 'top', 'left']);

assert.match(html, /id="fileInput2"[^>]*accept="image\/jpeg,image\/png,image\/webp"[^>]*multiple/);
assert.match(html, /await doInsertImagesFromFiles\(files\)/);
assert.match(html, /pushUndoSnapshot\(beforeBatch\)/);
assert.match(html, /deferHistory:\s*true/);

console.log('Multi-image insert tests passed.');
