import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const start = html.indexOf('function loadMainImageForMultiInsert(');
assert.notEqual(start, -1);
const brace = html.indexOf('{', start); let depth = 0; let source = '';
for (let i = brace; i < html.length; i++) {
  if (html[i] === '{') depth++;
  else if (html[i] === '}' && --depth === 0) { source = html.slice(start, i + 1); break; }
}
assert.ok(source);

function createHarness() {
  const timers = new Map(); let timerId = 0;
  const context = vm.createContext({ Error,
    setTimeout: callback => { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id),
  });
  vm.runInContext(`
    let completion, initialFrameCalls=0, renderCalls=0;
    const mainAsset={id:'main'};
    function loadImage(file,onSuccess,options){ completion={onSuccess,options}; }
    function createInitialFrameForNewImageProject(){initialFrameCalls++}
    function renderProjectWorldExtraImages(){renderCalls++}
    function renderAll(){renderCalls++}
    function updateFrameSelector(){renderCalls++}
    function updateToolbarLabels(){renderCalls++}
    function getMainImageAsset(){return mainAsset}
    function getCompletion(){return completion}
    function getInitialFrameCalls(){return initialFrameCalls}
    ${source}
  `, context);
  return { context, timers };
}

// Sucesso conclui uma vez, cancela timeout e ignora erro tardio.
{
  const { context, timers } = createHarness();
  const promise = context.loadMainImageForMultiInsert({ name:'ok.png' });
  context.getCompletion().onSuccess();
  assert.equal((await promise).id, 'main');
  assert.equal(context.getInitialFrameCalls(), 1);
  assert.equal(timers.size, 0);
  context.getCompletion().options.onError(new Error('late-error'));
  assert.equal(context.getInitialFrameCalls(), 1);
}

// Falha real tardia (depois de qualquer marco lógico de 1 s) rejeita sem ficar pendente.
{
  const { context, timers } = createHarness();
  const promise = context.loadMainImageForMultiInsert({ name:'late.png' });
  context.getCompletion().options.onError(new Error('delayed-decode-failure'));
  await assert.rejects(promise, /delayed-decode-failure/);
  assert.equal(context.getInitialFrameCalls(), 0);
  assert.equal(timers.size, 0);
}

// Timeout de segurança cancela o pipeline e uma resolução posterior não aplica a imagem.
{
  const { context, timers } = createHarness();
  const promise = context.loadMainImageForMultiInsert({ name:'timeout.png' });
  assert.equal(timers.size, 1);
  [...timers.values()][0]();
  await assert.rejects(promise, /main-image-load-timeout/);
  assert.equal(context.getCompletion().options.isCancelled(), true);
  context.getCompletion().onSuccess();
  assert.equal(context.getInitialFrameCalls(), 0);
}

console.log('Multi-image main load completion tests passed.');
