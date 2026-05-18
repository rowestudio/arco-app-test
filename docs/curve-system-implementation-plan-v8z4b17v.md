# Plano Técnico de Implementação — Sistema de Curvas do Arco App
**Complementa:** `audit-curve-system-v8z4b17v.md`  
**Branch de trabalho:** `claude/curve-system-plan-fICKx`  
**Data:** 2026-05-18  
**Status:** Documento técnico — nenhum comportamento alterado

---

## 1. Resumo Executivo

### O que existe hoje

O sistema atual opera sobre três estruturas de dados independentes:

- **`ctrlPts[seg]`** — array de objetos `{nx, ny, t, perpX, perpY}`, um por segmento normal (`frameCount - 1` entradas). Contém a posição do ponto de controle da Bézier quadrática em coordenadas normalizadas e também em coordenadas paramétricas relativas ao segmento.
- **`ctrlPtManual[seg]`** — array de booleanos paralelo a `ctrlPts`. `false` = recalculado automaticamente ao mover frame; `true` = preserva offset relativo ao segmento.
- **`loopCtrlPt`** — objeto único `{nx, ny, t, perpX, perpY}` para o trecho de fechamento N→1. Não tem flag `loopCtrlPtManual` equivalente. Não é sincronizado quando frames extremos são movidos.

O motor usa Bézier quadrática pura (`getStateAtT`). O código Catmull-Rom presente em `getStateAtT` (linhas 6307–6358) é código morto — os valores `crX/crY` nunca são utilizados na posição final.

### Por que não devemos implementar "Suavizar curva" agora

A feature de "Suavizar curva" (em qualquer forma — suavidade por frame, handles duais, tangência C1) requer que o sistema trate todos os segmentos de forma uniforme. Hoje isso não é verdade:

1. O trecho de loop é um objeto singular, separado do array de segmentos normais, sem flag de manual.
2. A dualidade `nx/ny` vs `t/perpX/perpY` cria dois caminhos de sincronização que podem divergir.
3. Não existe `removeFrameAt(i)` genérico — qualquer evolução do sistema que mude o número de segmentos pode dessincronizar os arrays.
4. O código morto Catmull-Rom dificulta a leitura do motor e aumenta o risco de regressão ao tocar em `getStateAtT`.

Implementar suavidade local agora, sobre essa base, significaria adicionar complexidade sobre inconsistências existentes, aumentando o risco de quebrar Preview, MP4, Velocidade Constante e Movimento Inteligente.

### Quais riscos precisam ser reduzidos antes

| Risco | Redução necessária |
|---|---|
| `loopCtrlPt` sem `Manual` e sem sync | Fase 1: sincronização + flag |
| `ctrlPts[0]` sem campos `t/perpX/perpY` | Fase 1: consistência de forma |
| Código morto Catmull-Rom em `getStateAtT` | Fase 1: remoção planejada |
| Inconsistência 24 vs 64 amostras | Fase 1: unificação |
| Loop como estrutura especial | Fase 2: normalização |
| Dualidade `nx/ny` vs `t/perp` | Fase 3: representação canônica única |

---

## 2. Fase 1 — Normalização interna sem mudança visual

**Objetivo:** eliminar dívida técnica e inconsistências documentadas na auditoria, sem alterar comportamento visível, sem tocar na UI, sem mudar o formato do JSON.

**Critério de aceite:** Preview e MP4 gerados com projetos existentes são pixel-a-pixel idênticos à versão atual. Todas as operações de curva (drag, reset, sync ao mover frame) continuam funcionando.

### 2.1 Helper de acesso por segmento

Criar funções de acesso centralizadas para abstrair a diferença entre segmentos normais e segmento de loop. Nenhum comportamento muda — são wrappers diretos sobre as estruturas existentes:

```js
// Retorna o ponto de controle do segmento segIndex.
// Para segIndex < normalSegs: retorna ctrlPts[segIndex]
// Para segIndex === normalSegs (loop): retorna loopCtrlPt
function getSegmentCurve(segIndex) {
  if (isLoopSegment(segIndex)) return loopCtrlPt;
  return ctrlPts[segIndex];
}

// Define o ponto de controle do segmento segIndex.
function setSegmentCurve(segIndex, curve) {
  if (isLoopSegment(segIndex)) {
    loopCtrlPt = curve ? { ...curve } : null;
  } else {
    ctrlPts[segIndex] = curve ? { ...curve } : null;
  }
}

// Retorna o flag de manual do segmento.
// Loop sempre age como manual (comportamento atual preservado).
function isSegmentManual(segIndex) {
  if (isLoopSegment(segIndex)) return true;
  return ctrlPtManual[segIndex] === true;
}

// Define o flag de manual do segmento.
function setSegmentManual(segIndex, value) {
  if (isLoopSegment(segIndex)) return; // loop: sem-op, sempre manual
  ctrlPtManual[segIndex] = value;
}

// Retorna true se segIndex é o segmento de loop N→1.
function isLoopSegment(segIndex) {
  return loopEnabled && frameCount >= 2 && segIndex === frameCount - 1;
}

// Retorna o número de segmentos ativos (incluindo loop, se ativo).
function getActiveSegmentCount() {
  const normal = Math.max(0, frameCount - 1);
  return loopEnabled ? normal + 1 : normal;
}
```

Esses helpers não substituem os acessos diretos existentes — são adicionados como utilitários para novos código. A refatoração dos acessos diretos fica para as próximas fases.

### 2.2 Corrigir `initDefaultFrames` — campos ausentes em `ctrlPts[0]`

**Problema (B.1 da auditoria):** `initDefaultFrames` (linha 4978) cria `ctrlPts[0]` sem os campos `t`, `perpX`, `perpY`. Todos os outros caminhos de criação incluem esses campos.

**Correção:**
```js
// Antes (linha 4978):
ctrlPts[0] = {
  nx: (frameCX(0)/stageW + frameCX(1)/stageW) / 2,
  ny: (frameCY(0)/stageH + frameCY(1)/stageH) / 2
};

// Depois:
ctrlPts[0] = {
  nx: (frameCX(0)/stageW + frameCX(1)/stageW) / 2,
  ny: (frameCY(0)/stageH + frameCY(1)/stageH) / 2,
  t: 0.5,
  perpX: 0,
  perpY: 0
};
```

Impacto: nenhum comportamento muda. O branch `!ctrlPtManual` em `syncCtrlPtsForFrame` continua sendo ativado (recalcula midpoint). Os campos novos são redundantes mas eliminam a inconsistência de forma.

### 2.3 Sincronizar `loopCtrlPt` quando frames extremos são movidos

**Problema (B.3 da auditoria):** `syncCtrlPtsForFrame(fi)` não atualiza `loopCtrlPt` quando `fi === 0` ou `fi === frameCount - 1`.

**Correção:** adicionar ao final de `syncCtrlPtsForFrame`:

```js
// Ao final de syncCtrlPtsForFrame(fi):
if (loopEnabled && loopCtrlPt && (fi === 0 || fi === frameCount - 1)) {
  // Loop sempre age como manual — preserva offset relativo aos frames extremos.
  // Recalcula nx/ny do ponto de loop a partir de t/perp (mesmo tratamento de manual).
  const loopSeg = frameCount - 1; // segmento N→1
  const p0 = frames[loopSeg];     // último frame
  const p1 = frames[0];           // primeiro frame
  if (Number.isFinite(loopCtrlPt.t) &&
      Number.isFinite(loopCtrlPt.perpX) &&
      Number.isFinite(loopCtrlPt.perpY)) {
    const result = computeNxNyFromTPerp(loopSeg, loopCtrlPt.t, loopCtrlPt.perpX, loopCtrlPt.perpY);
    loopCtrlPt.nx = result.nx;
    loopCtrlPt.ny = result.ny;
  }
  // Se t/perp não estiverem válidos: resetar para midpoint (comportamento seguro).
  else {
    loopCtrlPt.nx = (frameCX(loopSeg)/stageW + frameCX(0)/stageW) / 2;
    loopCtrlPt.ny = (frameCY(loopSeg)/stageH + frameCY(0)/stageH) / 2;
    loopCtrlPt.t = 0.5;
    loopCtrlPt.perpX = 0;
    loopCtrlPt.perpY = 0;
  }
}
```

**Nota:** `computeNxNyFromTPerp` precisa aceitar `segIndex === normalSegs` para o trecho de loop. Verificar se a função usa `ctrlPts[seg]` internamente para obter `p0/p1` — se sim, adicionar um branch para o segmento de loop usando `frames[frameCount-1]` e `frames[0]`.

### 2.4 Remover código morto Catmull-Rom em `getStateAtT`

**Problema (B.2 da auditoria):** linhas 6307–6358 calculam `crX`, `crY` via Catmull-Rom mas os valores nunca são usados. A posição final vem de `bz.x`, `bz.y`.

**Ação:** remover os blocos `getWaypoint`, `p0/p1/p2/p3`, `catmullRom`, `crX/crY` de `getStateAtT`. Não remover mais nada nessa função.

**Critério de validação:** resultado de `getStateAtT` deve ser idêntico ao atual para qualquer entrada (os valores removidos nunca foram usados na saída).

### 2.5 Unificar número de amostras de arc-length

**Problema (B.4 da auditoria):** `mapProgressToBezierU` usa 24 amostras; `measureSegmentCurveLength` usa 64.

**Ação:** alterar `mapProgressToBezierU` de 24 para 64 amostras.

**Impacto:** leve melhora de precisão em curvas muito acentuadas. A diferença visual é imperceptível, mas elimina a inconsistência entre as duas fontes de verdade.

**Atenção:** verificar se o número de amostras está como literal ou constante. Se for literal, alterar em todos os locais onde `mapProgressToBezierU` é definida/copiada.

---

## 3. Fase 2 — Tratar loop como segmento de curva equivalente

**Objetivo:** reduzir a diferença estrutural entre `ctrlPts[]` e `loopCtrlPt` sem quebrar o JSON atual nem alterar comportamento visível.

**Critério de aceite:** projetos com loop carregam, renderizam e exportam de forma idêntica à versão anterior.

### 3.1 Problema atual

```
ctrlPts[0..normalSegs-1]       → array, indexado por segmento
loopCtrlPt                     → objeto singular, sem índice, sem flag manual
ctrlPtManual[0..normalSegs-1]  → array paralelo a ctrlPts
(sem loopCtrlPtManual)
```

O motor (`getStateAtT`) já trata o loop com um branch explícito:
```js
if (loopEnabled && seg === frameCount - 1) {
  cp = loopCtrlPt || midpointFallback;
} else {
  cp = ctrlPts[seg] || midpointFallback;
}
```

### 3.2 Estratégia de normalização interna

Sem alterar o JSON e sem alterar o motor, introduzir uma visão unificada internamente:

```js
// Getter unificado já definido na Fase 1 (getSegmentCurve / isSegmentManual)
// Na Fase 2: usar esses getters dentro das funções de sincronização e medição.
```

**Mover `loopCtrlPtManual` para dentro de um objeto paralelo:**

```js
// Adicionar variável de suporte (não persiste no JSON ainda):
let loopCtrlPtManual = false; // começa como false; vira true ao ser arrastado

// Em startCtrlDrag (quando o ponto arrastado é o loop):
loopCtrlPtManual = true;

// Em resetCurveSegment (quando isLoopSeg):
loopCtrlPtManual = false;

// Atualizar isSegmentManual:
function isSegmentManual(segIndex) {
  if (isLoopSegment(segIndex)) return loopCtrlPtManual;
  return ctrlPtManual[segIndex] === true;
}
```

Isso permite que `syncCtrlPtsForFrame` (da Fase 1) diferencie entre um loop arrastado manualmente (preserva offset) e um loop nunca tocado (auto-recalcula).

### 3.3 O que NÃO mudar nesta fase

- O JSON continua usando `loopCtrlPt` como objeto singular — nenhuma mudança em `buildProjectData` ou `applyProjectData`.
- O motor (`getStateAtT`) mantém o branch explícito para loop.
- A UI de ctrl pts (`updateCtrlPts`, `#cpt_loop`) não muda.

### 3.4 Validação necessária

Testar os seguintes cenários com loop ativo:

1. Arrastar ponto de controle do loop → marcar como manual → mover F1 → verificar que o ponto permanece em offset relativo correto.
2. Arrastar ponto de controle do loop → reset → verificar que volta ao midpoint e `loopCtrlPtManual = false`.
3. Mover F1 com loop nunca tocado → verificar que o ponto recalcula o midpoint (comportamento auto).
4. Salvar e recarregar JSON → verificar que `loopCtrlPtManual` é restaurado corretamente.

**Nota sobre persistência de `loopCtrlPtManual`:** como não persiste no JSON, ao recarregar um projeto o loop volta para `loopCtrlPtManual = false`. Isso é aceitável nesta fase — o usuário perde o estado "foi arrastado" ao recarregar, mas a posição visual (`nx/ny`) é preservada pelo JSON existente. A persistência de `loopCtrlPtManual` é tratada na Fase 3.

---

## 4. Fase 3 — Compatibilidade e migração

**Objetivo:** garantir que JSONs antigos (sem `ctrlPtsV2`) e novos (com `ctrlPtsV2`) carregem corretamente, sem perder curvas manuais.

### 4.1 Estratégia de versionamento do JSON

Adicionar campo `curveSystemVersion` ao JSON salvo:

```js
// buildProjectData:
curveSystemVersion: 2,  // indica presença de ctrlPtsV2 e loopCtrlPtManual
ctrlPtsV2: ctrlPts.map(p => p ? { ...p } : null),
ctrlPtManualV2: [...ctrlPtManual],
loopCtrlPt: loopCtrlPt ? { ...loopCtrlPt } : null,
loopCtrlPtManual: loopCtrlPtManual,
// Manter ctrlPts e ctrlPtManual por compatibilidade retroativa:
ctrlPts: ctrlPts.map(p => p ? { ...p } : null),
ctrlPtManual: [...ctrlPtManual],
```

### 4.2 Lógica de carregamento com fallback

```js
// applyProjectData:
function loadCurveSystem(data) {
  const version = data.curveSystemVersion || 1;

  if (version >= 2 && data.ctrlPtsV2) {
    // Caminho novo: usa ctrlPtsV2
    ctrlPts.length = 0;
    (data.ctrlPtsV2 || []).forEach(p => ctrlPts.push(p ? { ...p } : null));
    ctrlPtManual.length = 0;
    (data.ctrlPtManualV2 || []).forEach(v => ctrlPtManual.push(!!v));
    loopCtrlPt = data.loopCtrlPt ? { ...data.loopCtrlPt } : null;
    loopCtrlPtManual = !!data.loopCtrlPtManual;
  } else {
    // Caminho legado: usa ctrlPts (v1)
    ctrlPts.length = 0;
    (data.ctrlPts || []).forEach(p => ctrlPts.push(p ? { ...p } : null));
    ctrlPtManual.length = 0;
    (data.ctrlPtManual || []).forEach(v => ctrlPtManual.push(!!v));
    loopCtrlPt = data.loopCtrlPt ? { ...data.loopCtrlPt } : null;
    loopCtrlPtManual = false; // JSONs v1 não têm esse campo; assume não-manual
  }
}
```

### 4.3 Invariantes a preservar após migração

Após carregar qualquer JSON (v1 ou v2):

- `ctrlPts.length === frameCount - 1` — verificado por `validateProjectState`.
- `ctrlPtManual.length === frameCount - 1` — adicionar verificação.
- `loopCtrlPt !== null ↔ loopEnabled` — validar na `validateProjectState`.
- Nenhum `ctrlPts[i]` com campos `t/perpX/perpY` inválidos em ponto marcado como manual.

### 4.4 Undo/Redo

`captureState` e `restoreState` precisam incluir `loopCtrlPtManual`:

```js
// captureState: adicionar
loopCtrlPtManual: loopCtrlPtManual,

// restoreState: adicionar
loopCtrlPtManual = state.loopCtrlPtManual ?? false;
```

Sem isso, um undo após arrastar o ponto de loop pode restaurar a posição `nx/ny` mas deixar `loopCtrlPtManual` incorreto, causando dessincronização na próxima vez que um frame extremo for movido.

### 4.5 Política de depreciação

- **v8z4b17v a v8z4b17x:** salvar ambos `ctrlPts` (legado) e `ctrlPtsV2` no JSON. Carregar prefere `ctrlPtsV2` mas faz fallback para `ctrlPts`.
- **v8z4b17y em diante:** remover gravação de `ctrlPts` legado. Manter leitura para compatibilidade por pelo menos 2 versões.
- **v8z4b17z em diante (estimado):** remover leitura de `ctrlPts` legado. JSON mínimo suportado = v2.

---

## 5. Fase 4 — Suavidade local por frame

**Objetivo:** introduzir arquitetura onde cada frame funciona como ponto âncora com handles de entrada e saída, permitindo controle de suavidade local por segmento de forma não destrutiva.

Esta fase só deve ser iniciada após as Fases 1–3 estarem estabilizadas em produção.

### 5.1 Conceito: frame como âncora de curva

No sistema atual, o ponto de controle pertence ao **segmento**. No novo sistema, o ponto de controle pertence ao **frame** que o gera:

```
Sistema atual:
  F1 ──[ctrlPts[0]]──► F2 ──[ctrlPts[1]]──► F3

Sistema novo:
  F1.outH ──────────────────► F2.inH
               segmento 0
              (Bézier quadrática: 1 ponto de controle = outH do frame origem)

  F2.outH ──────────────────► F3.inH
               segmento 1
```

Para preservar a Bézier quadrática atual: cada segmento usa apenas `outH` do frame de origem como ponto de controle. O `inH` fica reservado para futura evolução para Bézier cúbica.

### 5.2 Estrutura de dados proposta

```js
frameHandles[i] = {
  outH: {
    nx: Number,    // posição X normalizada do handle de saída
    ny: Number,    // posição Y normalizada do handle de saída
    manual: Boolean // false = auto (midpoint); true = arrastado pelo usuário
  },
  inH: {
    nx: Number,
    ny: Number,
    manual: Boolean
  },
  linked: Boolean  // true = inH e outH mantêm tangência C1 (ângulo 180°)
}
```

O trecho de loop usa `frameHandles[frameCount-1].outH` como ponto de controle do segmento N→1. Isso elimina `loopCtrlPt` como objeto especial.

### 5.3 Derivação dos pontos de controle atuais

```js
// getSegmentControlPoint(seg) — ponto de controle para o motor:
function getSegmentControlPoint(seg) {
  if (isLoopSegment(seg)) {
    // Segmento loop N→1: usa outH do último frame
    return frameHandles[frameCount - 1].outH;
  }
  // Segmento normal i→i+1: usa outH do frame i
  return frameHandles[seg].outH;
}
```

O motor (`getStateAtT`) usaria `getSegmentControlPoint(seg)` ao invés dos branches atuais. Isso unifica o tratamento do loop com os segmentos normais.

### 5.4 "Suavizar frame" — operação de reset local

O botão "Suavizar curva" atual (reset de segmento) evolui para "Suavizar frame":

```js
function smoothenFrame(fi) {
  pushUndo();
  // Reset do outH (afeta o segmento que sai de fi):
  const outSeg = fi;
  const midOut = getMidpoint(frames[fi], frames[(fi + 1) % frameCount]);
  frameHandles[fi].outH = { nx: midOut.nx, ny: midOut.ny, manual: false };

  // Reset do inH (afeta o segmento que chega em fi):
  const prevSeg = (fi - 1 + frameCount) % frameCount;
  if (!isLoopSegment(prevSeg) || loopEnabled) {
    const midIn = getMidpoint(frames[prevSeg], frames[fi]);
    frameHandles[fi].inH = { nx: midIn.nx, ny: midIn.ny, manual: false };
  }

  // linked: ao suavizar, ativar tangência C1 se desejado
  frameHandles[fi].linked = true;
  renderAll();
}
```

### 5.5 Tangência C1 com `linked: true`

Quando `frameHandles[fi].linked === true`, ao arrastar `outH[fi]`:

```js
// Em startCtrlDrag / onCtrlDrag (ao mover outH[fi]):
if (frameHandles[fi].linked) {
  // Espelhar inH em relação ao frame fi:
  const dx = outH.nx - frames[fi].nx / stageW;
  const dy = outH.ny - frames[fi].ny / stageH;
  frameHandles[fi].inH.nx = frames[fi].nx / stageW - dx;
  frameHandles[fi].inH.ny = frames[fi].ny / stageH - dy;
}
```

Isso garante que a curva que chega em Fi e a curva que sai de Fi sejam tangentes — produzindo suavidade visual contínua.

### 5.6 Migração de `ctrlPts` para `frameHandles`

```js
function migrateCtrlPtsToFrameHandles(ctrlPts, ctrlPtManual, frames) {
  frameHandles = frames.map((_, i) => ({
    outH: { nx: 0, ny: 0, manual: false },
    inH:  { nx: 0, ny: 0, manual: false },
    linked: false
  }));

  ctrlPts.forEach((cp, seg) => {
    if (!cp) return;
    // O ponto de controle do segmento seg pertence ao outH do frame seg:
    frameHandles[seg].outH = {
      nx: cp.nx,
      ny: cp.ny,
      manual: ctrlPtManual[seg] === true
    };
  });

  if (loopCtrlPt) {
    frameHandles[frameCount - 1].outH = {
      nx: loopCtrlPt.nx,
      ny: loopCtrlPt.ny,
      manual: loopCtrlPtManual === true
    };
  }
}
```

### 5.7 O que esta fase NÃO inclui

- Bézier cúbica (usa apenas `outH`, não `inH`, para manter compatibilidade com Bézier quadrática).
- Handles visuais de `inH` no stage (UI de drag para `inH` é trabalho futuro).
- Remoção das estruturas legadas `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` (mantidas até estabilizar).

---

## 6. Riscos por componente

### Preview (canvas em tempo real)

| Risco | Fase | Mitigação |
|---|---|---|
| Alteração em `mapProgressToBezierU` (24→64 amostras) muda timing visível | F1 | Validar frame a frame contra versão anterior antes de release |
| Remoção de Catmull-Rom pode ter efeito colateral não mapeado | F1 | Auditoria de todas as variáveis removidas; confirmar que nenhuma é lida downstream |
| `syncCtrlPtsForFrame` para loop pode mover ctrl pt inesperadamente | F1 | Testar com loop ativo + frames extremos em posições extremas |
| Migração `ctrlPts` → `frameHandles` com índice errado | F4 | Teste de regressão em projetos com N=2, 3, 10, max frames |

### MP4 (renderização headless)

| Risco | Fase | Mitigação |
|---|---|---|
| `getStateAtT` produz valor diferente após remoção de Catmull-Rom | F1 | Os valores `crX/crY` nunca eram usados — risco teórico nulo, mas validar com teste de saída |
| Mudança de amostras em `mapProgressToBezierU` produz timing diferente no MP4 | F1 | Comparar MP4 gerado antes e depois com projeto de referência |
| Novo `getSegmentControlPoint()` retorna valor ligeiramente diferente de `getStateAtT` atual | F4 | Teste A/B de MP4 antes e depois da migração |

### Velocidade Constante (`redistributeDurationsByCurveLength`)

| Risco | Fase | Mitigação |
|---|---|---|
| Inconsistência 24 vs 64 amostras corrigida pode redistribuir durações de forma diferente | F1 | Documentar a mudança; avisar usuário que projetos com velocidade constante podem ter leve variação de timing ao reabrir após a atualização |
| `loopCtrlPt` recalculado incorretamente após move de frame extremo afeta comprimento medido | F1 | Teste de loop ativo com `constant-speed` + move de F1 |
| Fase 4: `measureLoopCurveLength` precisa ser atualizada para ler `frameHandles` ao invés de `loopCtrlPt` | F4 | Não alterar `measureLoopCurveLength` antes de Fase 4 completa |

### Movimento Inteligente (`movementEasingMode === 'smart'`)

| Risco | Fase | Mitigação |
|---|---|---|
| Hermite usa comprimento real da Bézier — qualquer mudança de ctrl pt afeta velocidade calculada | F1/F2 | O sync de loop (F1) não muda o comprimento total — apenas reposiciona o ctrl pt. Verificar comprimento antes e depois |
| Fase 4: handles duais sem Bézier cúbica real podem criar inconsistência entre comprimento medido e curva renderizada | F4 | Manter Bézier quadrática derivada de `outH` apenas até F4 estabilizar |

### Loop N→1

| Risco | Fase | Mitigação |
|---|---|---|
| `syncCtrlPtsForFrame` nova lógica para loop: if/else incorreto pode atualizar loop quando não deveria | F1 | Guard rigoroso: só atualizar se `loopEnabled && loopCtrlPt && (fi === 0 || fi === frameCount - 1)` |
| `loopCtrlPtManual` não persistido no JSON v1 — recarregar um projeto com loop arrastado e salvo em v1 perde o estado manual | F2/F3 | Comportamento aceitável em F2; corrigido na F3 com `loopCtrlPtManual` no JSON v2 |
| Inverter ordem dos frames (`invertFrameOrder`) não atualiza `loopCtrlPt` — já documentado como risco B.7 | F2 | Adicionar ao escopo de F2: `invertFrameOrder` deve fazer swap de `loopCtrlPt` se necessário |

### Undo/Redo

| Risco | Fase | Mitigação |
|---|---|---|
| `captureState` sem `loopCtrlPtManual` → undo restaura posição mas não estado manual | F2 | Incluir `loopCtrlPtManual` no snapshot de undo na mesma PR que introduz a variável |
| Fase 4: `captureState` sem `frameHandles` → undo perde handles | F4 | `frameHandles` deve entrar no snapshot antes de qualquer uso em produção |
| Snapshot de undo com `frameHandles` grande (N frames × 2 handles) aumenta memória por snapshot | F4 | Medir impacto em projetos com 20+ frames; considerar shallow copy |

### JSON antigo (v1)

| Risco | Fase | Mitigação |
|---|---|---|
| `applyProjectData` sem campo `curveSystemVersion` cai no fallback legado corretamente? | F3 | Testar com JSON sem `curveSystemVersion` — deve usar `ctrlPts` legado sem erro |
| JSON com `ctrlPts.length !== frameCount - 1` (corrompido) | F3 | `validateProjectState` já detecta; adicionar log de aviso com truncamento seguro |
| JSON v1 com `loopCtrlPt` mas sem `loopCtrlPtManual` → `loopCtrlPtManual = false` pode mudar comportamento de sync | F3 | Comportamento mais conservador: `loopCtrlPtManual = true` em JSONs v1 com `loopCtrlPt` não-nulo (assume que foi arrastado, preserva posição) |

### Projetos com muitos frames (N ≥ 10)

| Risco | Fase | Mitigação |
|---|---|---|
| `getActiveSegmentCount()` com N=20 + loop = 20 segmentos — `redistributeDurationsByCurveLength` chama `measureSegmentCurveLength` 20 vezes (64 amostras cada = 1280 operações) | F1 | Profiling com N=20 no caminho de constant-speed; 1280 ops é aceitável mas documentar |
| F4: `frameHandles` array com N=20 frames + 2 handles por frame = 40 objetos no snapshot de undo | F4 | Shallow copy de array é O(N); aceitável até N=50 |
| `syncCtrlPtsForFrame` com nova lógica de loop chamada para cada frame durante playback | F1/F2 | `syncCtrlPtsForFrame` só é chamada no drag de frame, não durante playback — risco nulo |

---

## 7. Recomendação Final

### Próximo patch de código mais seguro após a auditoria

**O único patch que deve ser feito agora é a Fase 1, em ordem:**

**Passo 1 (menor risco):** adicionar campos `t: 0.5, perpX: 0, perpY: 0` em `initDefaultFrames` (linha 4978). Uma linha de mudança. Impacto zero em comportamento.

**Passo 2 (baixo risco):** remover código morto Catmull-Rom de `getStateAtT` (linhas 6307–6358). Os valores `crX/crY` nunca são usados — a remoção não pode afetar output. Reduz a superfície de leitura futura do motor.

**Passo 3 (baixo risco, testável):** unificar amostras de 24→64 em `mapProgressToBezierU`. Validar com projeto de referência que Preview e MP4 são equivalentes (diferença < 0.5% de timing em curvas extremas é aceitável).

**Passo 4 (médio risco, testável):** adicionar sincronização de `loopCtrlPt` em `syncCtrlPtsForFrame` para frames extremos. Testar os 4 cenários descritos em 2.3. Incluir `loopCtrlPtManual` no undo/redo na mesma PR.

**O que não fazer agora:**
- Não iniciar Fase 2 (normalização de loop como segmento) sem os 4 passos da Fase 1 estabilizados.
- Não iniciar Fase 3 (migração JSON) sem Fase 2 completa.
- Não tocar em `getStateAtT` além da remoção de Catmull-Rom.
- Não alterar o formato JSON até que `loopCtrlPtManual` esteja em undo/redo e testado.
- Não implementar "Suavizar curva" ou qualquer feature de handles duais antes da Fase 4.

### Critério de entrada para a Fase 2

- Fase 1 está em produção por pelo menos uma versão sem regressões relatadas.
- Preview e MP4 com projetos salvos antes de Fase 1 são idênticos aos gerados após Fase 1.
- `loopCtrlPtManual` está no undo/redo e no JSON.
- Os 4 cenários de loop da seção 2.3 passam manualmente.

---

*Documento técnico complementar — não altera código do app.*  
*Próximo artefato esperado: PR de implementação da Fase 1 sobre a branch de desenvolvimento.*
