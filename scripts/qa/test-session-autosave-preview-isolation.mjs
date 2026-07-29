import assert from 'node:assert/strict';

class Harness {
  queued=0; committed=0; epoch=1; blocked=false; deferred=false; timer=false; builds=0; writes=0; restores=0;
  mutate(){ this.queued++; this.timer=true; }
  begin(){ if(this.timer){this.timer=false;this.deferred=this.queued>this.committed;} this.blocked=true; }
  end(){ this.blocked=false;if(this.deferred&&this.queued>this.committed){this.timer=true;this.deferred=false;} }
  tick(){if(!this.timer)return;this.timer=false;if(this.blocked){this.deferred=true;return;}this.builds++;this.writes++;this.committed=this.queued;}
  flush(){if(this.queued<=this.committed)this.queued++;this.builds++;this.writes++;this.committed=this.queued;}
  newProject(){this.epoch++;this.queued++;this.committed=this.queued;this.timer=false;this.deferred=false;}
  manualLoad(){this.epoch++;this.queued++;this.timer=true;}
}

class FrameTransformHarness {
  revision=0; frame={w:100,rotation:0}; drag=null;
  begin(){this.drag={mode:null,startW:this.frame.w,initialRot:this.frame.rotation,undoCaptured:false};}
  move(mode,value){
    if(!this.drag)return;
    this.drag.mode=mode;this.drag.undoCaptured=true;
    if(mode==='scale')this.frame.w=value;
    if(mode==='rotate')this.frame.rotation=value;
  }
  end(){
    const completed=this.drag;this.drag=null;
    if(!completed)return;
    const changed=completed.mode==='scale' ? Math.abs(this.frame.w-completed.startW)>0.01 : completed.mode==='rotate' ? Math.abs(this.frame.rotation-completed.initialRot)>0.01 : false;
    if(completed.undoCaptured&&changed)this.revision++;
  }
}

// Caso 1: mutação antes do debounce é adiada e salva uma vez após fechar.
let h=new Harness();h.mutate();h.begin();h.tick();assert.equal(h.builds,0);h.end();h.tick();assert.deepEqual([h.writes,h.committed],[1,1]);
// Caso 2: Play sem mutação não cria revisão nem escrita.
h=new Harness();const base=[h.queued,h.writes];h.begin();h.end();h.tick();assert.deepEqual([h.queued,h.writes],base);
// Caso 3: várias mutações consolidam somente a revisão mais recente.
h=new Harness();h.mutate();h.mutate();h.mutate();h.begin();h.end();h.tick();assert.deepEqual([h.writes,h.committed],[1,3]);
// Caso 4: flush de saída/ocultação ultrapassa a barreira.
h=new Harness();h.mutate();h.begin();h.flush();assert.deepEqual([h.writes,h.committed],[1,1]);
// Caso 5: Export bloqueia escrita normal e retoma o checkpoint.
h=new Harness();h.mutate();h.begin();h.tick();assert.equal(h.writes,0);h.end();h.tick();assert.equal(h.writes,1);
// Caso 6: Novo Projeto e Load manual avançam epoch e preservam precedência.
h=new Harness();const epoch=h.epoch;h.newProject();assert.equal(h.epoch,epoch+1);h.manualLoad();assert.equal(h.epoch,epoch+2);h.tick();assert.equal(h.committed,h.queued);

// Transformações reais de Frame marcam uma única revisão somente na conclusão.
let f=new FrameTransformHarness();f.begin();f.move('scale',125);f.end();assert.equal(f.revision,1);
f=new FrameTransformHarness();f.begin();f.move('rotate',35);f.end();assert.equal(f.revision,1);
f=new FrameTransformHarness();f.begin();f.end();assert.equal(f.revision,0);
f=new FrameTransformHarness();f.begin();f.move('scale',110);f.move('scale',120);f.move('scale',130);assert.equal(f.revision,0);f.end();assert.equal(f.revision,1);

console.log('Session autosave/Preview behavioral harness passed: 10/10 cases.');
