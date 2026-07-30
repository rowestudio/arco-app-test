import assert from 'node:assert/strict';

function deferred() { let resolve; let reject; const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; }); return { promise, resolve, reject }; }

function createController({ checkpoint = null, intent = null, restoreResult = true, clearResult = true } = {}) {
  const calls = { modal: 0, restore: 0, clear: 0, apply: 0, hydrate: 0, launcher: 0, editor: 0 };
  const state = { busy: false, choice: 'none', modal: false, error: false, checkpoint, liveEditor: false };
  const valid = (entry) => !!(entry && entry.schema === 1 && entry.complete === true && entry.payload && entry.checksum === 'ok' && entry.projectComplete === true);
  async function startup() {
    calls.launcher++;
    if (intent === 'restore') { calls.restore++; if (await restoreResult) calls.editor++; return; }
    if (intent === 'clean') return;
    if (!valid(checkpoint)) return;
    state.modal = true; calls.modal++;
  }
  async function choose(kind) {
    if (state.busy) return false;
    state.busy = true; state.choice = kind;
    if (kind === 'continue') {
      calls.restore++;
      const ok = await restoreResult;
      if (!ok) { state.error = true; state.busy = false; calls.launcher++; return false; }
      calls.hydrate++; calls.apply++; calls.editor++; state.modal = false; return true;
    }
    calls.clear++;
    const ok = await clearResult;
    if (!ok) { state.error = true; state.busy = false; return false; }
    checkpoint = null; calls.launcher++; state.modal = false; return true;
  }
  function resumeLiveInstance() { state.liveEditor = true; }
  return { calls, state, startup, choose, resumeLiveInstance, getCheckpoint: () => checkpoint };
}
const validCheckpoint = { schema: 1, complete: true, payload: '{}', checksum: 'ok', projectComplete: true };

// 1 — sem checkpoint.
{ const c = createController(); await c.startup(); assert.equal(c.calls.launcher, 1); assert.equal(c.calls.modal, 0); assert.equal(c.calls.restore, 0); }
// 2 — checkpoint válido apenas pergunta.
{ const c = createController({ checkpoint: validCheckpoint }); await c.startup(); assert.equal(c.calls.modal, 1); assert.equal(c.calls.restore, 0); assert.equal(c.calls.apply, 0); assert.equal(c.calls.hydrate, 0); }
// 3 — continuar restaura uma vez e entra no editor.
{ const c = createController({ checkpoint: validCheckpoint }); await c.startup(); await c.choose('continue'); assert.equal(c.calls.restore, 1); assert.equal(c.calls.clear, 0); assert.equal(c.calls.editor, 1); }
// 4 — começar novo limpa uma vez e só então abre launcher.
{ const c = createController({ checkpoint: validCheckpoint }); await c.startup(); await c.choose('discard'); assert.equal(c.calls.clear, 1); assert.equal(c.calls.restore, 0); assert.equal(c.calls.launcher, 2); }
// 5 — clear pendente não confirma launcher.
{ const gate = deferred(); const c = createController({ checkpoint: validCheckpoint, clearResult: gate.promise }); await c.startup(); const op = c.choose('discard'); await Promise.resolve(); assert.equal(c.calls.launcher, 1); gate.resolve(true); await op; assert.equal(c.calls.launcher, 2); }
// 6 — falha de clear mantém modal e permite retry.
{ let ok = false; const c = createController({ checkpoint: validCheckpoint, clearResult: { then(resolve) { resolve(ok); } } }); await c.startup(); await c.choose('discard'); assert.equal(c.state.modal, true); assert.equal(c.calls.restore, 0); ok = true; await c.choose('discard'); assert.equal(c.calls.clear, 2); }
// 7 — falha de restore retorna ao launcher e libera outra escolha.
{ let ok = false; const result = { then(resolve) { resolve(ok); } }; const c = createController({ checkpoint: validCheckpoint, restoreResult: result }); await c.startup(); await c.choose('continue'); assert.equal(c.calls.apply, 0); assert.equal(c.state.modal, true); ok = true; await c.choose('continue'); assert.equal(c.calls.restore, 2); }
// 8 — toque duplicado inicia uma operação.
{ const gate = deferred(); const c = createController({ checkpoint: validCheckpoint, restoreResult: gate.promise }); await c.startup(); const first = c.choose('continue'); assert.equal(await c.choose('continue'), false); assert.equal(c.calls.restore, 1); gate.resolve(true); await first; }
// 9 — restore e clean concorrentes aceitam apenas o primeiro.
{ const gate = deferred(); const c = createController({ checkpoint: validCheckpoint, restoreResult: gate.promise }); await c.startup(); const first = c.choose('continue'); assert.equal(await c.choose('discard'), false); assert.equal(c.calls.clear, 0); gate.resolve(true); await first; }
// 10 — intenção E8H restore ignora pergunta.
{ const c = createController({ checkpoint: validCheckpoint, intent: 'restore' }); await c.startup(); assert.equal(c.calls.modal, 0); assert.equal(c.calls.restore, 1); }
// 11 — intenção E8H clean ignora pergunta e não restaura.
{ const c = createController({ checkpoint: validCheckpoint, intent: 'clean' }); await c.startup(); assert.equal(c.calls.modal, 0); assert.equal(c.calls.restore, 0); assert.equal(c.calls.launcher, 1); }
// 12 — checkpoint inválido abre launcher seguro.
{ const c = createController({ checkpoint: { ...validCheckpoint, checksum: 'bad' } }); await c.startup(); assert.equal(c.calls.restore, 0); assert.equal(c.calls.modal, 0); }
// 13 — sem escolha, checkpoint permanece.
{ const c = createController({ checkpoint: validCheckpoint }); await c.startup(); assert.equal(c.getCheckpoint(), validCheckpoint); }
// 14 — retomada da mesma instância não executa startup.
{ const c = createController({ checkpoint: validCheckpoint }); c.resumeLiveInstance(); assert.equal(c.calls.modal, 0); assert.equal(c.state.liveEditor, true); }
// 15 e 16 — inspeção não aplica projeto nem hidrata assets.
{ const c = createController({ checkpoint: validCheckpoint }); await c.startup(); assert.equal(c.calls.apply, 0); assert.equal(c.calls.hydrate, 0); }

console.log('Startup session choice behavioral harness passed: 16/16 cases.');
