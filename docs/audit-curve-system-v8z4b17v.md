# Auditoria Técnica — Sistema de Curvas do Arco App
**Versão auditada:** v8z4b17u  
**Branch de auditoria:** `claude/audit-curve-system-eSDXi`  
**Data:** 2026-05-18  
**Status:** Leitura + mapeamento apenas — nenhum comportamento alterado

---

## A. Como funciona hoje

### A.1 Estruturas de dados das curvas

#### `ctrlPts[]` — array de pontos de controle por segmento

```
ctrlPts[seg] = {
  nx,     // posição X normalizada (0–1) do ponto de controle no stage
  ny,     // posição Y normalizada (0–1) do ponto de controle no stage
  t,      // projeção escalar ao longo da linha F_seg → F_(seg+1) (0=início, 1=fim)
  perpX,  // offset perpendicular X em px do stage em relação à linha do segmento
  perpY   // offset perpendicular Y em px do stage em relação à linha do segmento
}
```

**Tamanho:** `frameCount - 1` entradas (uma por segmento normal).  
**Índices:** `ctrlPts[0]` → segmento F1→F2; `ctrlPts[1]` → F2→F3; etc.  
**Fonte de verdade:** `nx` e `ny` são o que o motor e o visual usam para desenhar a curva. Os campos `t`, `perpX` e `perpY` são usados apenas para recalcular `nx/ny` quando o frame adjacente é movido (em `syncCtrlPtsForFrame`).

#### `ctrlPtManual[]` — array de flags de controle manual

```
ctrlPtManual[seg] = false  // ponto automático — recalculado ao mover frame adjacente
ctrlPtManual[seg] = true   // ponto manual — mantém offset mesmo ao mover frame
```

**Papel crítico:** separa pontos que o usuário arrastou (preservados em relação ao segmento) dos que foram gerados automaticamente (reposicionados no meio do segmento).

#### `loopCtrlPt` — ponto de controle do trecho de fechamento N→1

```
loopCtrlPt = null                        // quando loop desativado
loopCtrlPt = { nx, ny, t, perpX, perpY } // quando loop ativado
```

**Diferença importante:** não existe `loopCtrlPtManual`. O ponto de loop sempre age como "manual" uma vez criado — não tem auto-recalculação quando F1 ou o último frame se move.

---

### A.2 Ciclo de vida dos campos

#### Criação — `initDefaultFrames` (linha 4978)

```js
ctrlPts[0] = {
  nx: (frameCX(0)/stageW + frameCX(1)/stageW) / 2,
  ny: (frameCY(0)/stageH + frameCY(1)/stageH) / 2
  // ⚠️ t, perpX, perpY NÃO são criados aqui
};
ctrlPtManual[0] = false;
```

**Anomalia:** o objeto criado em `initDefaultFrames` omite os campos `t`, `perpX` e `perpY`. Todos os outros caminhos de criação incluem esses campos. O sistema tolera a omissão porque `syncCtrlPtsForFrame` (linha 6000–6006) detecta valores não-finitos e os recalcula.

#### Adição de frame — `addFrame` (linha 5011)

```js
ctrlPts[seg] = {
  nx: midX, ny: midY,
  t: 0.5, perpX: 0, perpY: 0
};
ctrlPtManual[seg] = false;
```

Cria o ponto no centro do novo segmento. Não afeta os segmentos existentes.

#### Inserção entre frames — `insertFrameAfterActive` (linha 5118)

Divide a Bézier do segmento `a` ao ponto médio (t=0.5) usando o algoritmo de de Casteljau:
```
p01 = lerp(p0, cp, 0.5)   // ponto de controle do primeiro sub-segmento
p12 = lerp(cp, p2, 0.5)   // ponto de controle do segundo sub-segmento
```
Ambos os novos segmentos são marcados como `ctrlPtManual = true` (linhas 5118–5122), preservando a forma visual da curva original.

#### Remoção de frame — `removeLastFrame` (linha 5180)

```js
ctrlPts.splice(i - 1, 1);   // remove o segmento que terminava no frame removido
```

Só funciona para o **último** frame. Remoção de frame intermediário não está implementada como função genérica — apenas via `insertFrameAfterActive` ao reverter.

#### Normalização — `normalizeProjectArrays` (linha 8517)

Chamada após cada mutação de `frameCount`. Não toca em `ctrlPts` nem `ctrlPtManual` (não são incluídos na normalização automática). A validação em `validateProjectState` (linha 8563) verifica apenas se `ctrlPts.length === segs`, não verifica os campos internos de cada ponto.

#### Troca de imagem — `sanitizeCtrlPtsAfterImageChange` (linha 6771)

Trunca o array para `frameCount - 1` e clipa `nx/ny` para `[-0.35, 1.35]`. Pontos inválidos são substituídos pelo midpoint do segmento.

---

### A.3 Sincronização ao mover frame — `syncCtrlPtsForFrame` (linha 5990)

Chamada sempre que um frame é movido ou redimensionado. Atua nos segmentos adjacentes ao frame `fi`:

```
segs = [fi-1, fi]   (o que termina em fi e o que começa em fi)
```

Para cada segmento adjacente:
- Se `ctrlPtManual[seg] === false`: reposiciona `nx/ny` no midpoint, t=0.5, perp=0.
- Se `ctrlPtManual[seg] === true`: recalcula `nx/ny` usando `computeNxNyFromTPerp(seg, t, perpX, perpY)` para manter o offset relativo ao segmento.

**`computeTPerpForSeg`** e **`computeNxNyFromTPerp`** (linhas 5965–5987): convertem entre representação cartesiana (`nx/ny`) e paramétrica (`t + perp`). A representação paramétrica é o que permite manter a "pegada" do controle mesmo ao mover frames.

---

### A.4 Renderização visual — `drawBezier` (linha 5576)

Desenha um SVG no elemento `#bezierSvg` (posição absolute, pointer-events:none, z-index:3).

Para cada segmento:
```
M p0.cx p0.cy   Q cp.nx*stageW cp.ny*stageH   p1.cx p1.cy
```

É uma **Bézier quadrática pura** (um único ponto de controle). Não é uma curva cúbica nem Catmull-Rom.

Cores:
- Segmento anterior ao frame ativo → azul `#00d4ff`
- Segmento posterior ao frame ativo → laranja `#f5a623`
- Demais segmentos → branco tracejado com opacidade 0.75
- Trecho de loop → roxo com opacidade variável (0.9 se ativo, 0.22 se distante)

Bolinhas brancas são desenhadas nos centros dos frames dentro de dist ≤ 1 do frame ativo.

#### `updateCtrlPts` (linha 5634)

Controla a visibilidade e posição dos elementos DOM `.ctrl-pt` (bolinhas arrastáveis). Visíveis apenas para os dois segmentos adjacentes ao frame ativo. O elemento `#cpt_loop` é criado on-demand quando o loop é ativado.

---

### A.5 Uso da curva no motor — `getStateAtT` (linha 6220)

O motor usa a curva em dois momentos:

**1. Posição no tempo t:**

```js
// Bézier quadrática usando ctrlPts[seg]
function bezierPointAt(u) {
  const inv = 1 - u;
  return {
    x: inv*inv * p1.cx + 2*inv*u * cpx + u*u * p2.cx,
    y: inv*inv * p1.cy + 2*inv*u * cpy + u*u * p2.cy
  };
}
```

O parâmetro `u` não é o tempo diretamente — ele passa por `mapProgressToBezierU(ttEased)` que converte progresso temporal em progresso de arco com 24 amostras.

**2. Modo `movementEasingMode === 'smart'`:**  
Usa Hermite (`computeSmartMovementProgress`) ao invés de `segEasings` por trecho. A velocidade Hermite é calculada a partir do comprimento real da curva Bézier.

**Catmull-Rom presente mas não utilizado:**  
O código em `getStateAtT` (linhas 6307–6358) calcula `crX`, `crY` via Catmull-Rom mas esses valores **nunca são usados** — a posição final vem de `bz.x`, `bz.y` (Bézier quadrática). O Catmull-Rom é código morto, resquício de uma versão anterior que blendava os dois sistemas.

**Trecho de loop no motor:**  
Quando `_timeInfo.isLoopSeg === true`, o `seg` retornado é `normalSegs` (= `frameCount - 1`). Em `getStateAtT`, a linha 6332 trata esse caso:
```js
if (loopEnabled && seg === frameCount - 1) {
  cp = loopCtrlPt || { midpoint fallback };
} else {
  cp = ctrlPts[seg] || { midpoint fallback };
}
```
O trecho de loop usa `loopCtrlPt` como ponto de controle da Bézier entre `frames[frameCount-1]` e `frames[0]`.

---

### A.6 Comprimento da curva — `measureSegmentCurveLength` (linha 9452)

Integração numérica com **64 amostras** da Bézier quadrática:
```js
function bezPt(u) {
  return (1-u)^2 * P1 + 2*(1-u)*u * CP + u^2 * P2;
}
let len = 0;
for (i = 1; i <= 64; i++) {
  len += hypot(bezPt(i/64) - bezPt((i-1)/64));
}
```

`measureLoopCurveLength` (linha 9492) usa a mesma lógica para o trecho N→1.

Inconsistência: o motor usa **24 amostras** em `mapProgressToBezierU`; a medição usa 64. A diferença é imperceptível na prática mas representa duas fontes de verdade distintas.

---

### A.7 Velocidade Constante — `redistributeDurationsByCurveLength` (linha 9526)

Ativo quando `segmentTimingMode === 'constant-speed'`. Mede o comprimento de todos os segmentos ativos e distribui `constantSpeedTotalDuration` proporcionalmente. Inclui o trecho de loop quando ativo.

Chamada após: adição/remoção/inserção de frame, fim de drag de frame ou ctrl pt, mudança de modo de loop.

---

### A.8 Reset de curva — `resetCurveSegment` (linha 7761)

```js
function resetCurveSegment() {
  const isLoopSeg = loopEnabled && frameCount >= 2 && _activeEaseSeg === normalSegs;
  const seg = _activeEaseSeg;

  pushUndo();                          // entra no undo/redo ✓
  markProjectDirty('reset-curve');     // será salvo no JSON ✓

  if (isLoopSeg) {
    loopCtrlPt = {
      nx: midpoint(frames[last], frames[0]).nx,
      ny: midpoint(frames[last], frames[0]).ny,
      t: 0.5, perpX: 0, perpY: 0
    };
  } else {
    ctrlPts[seg].nx = midpoint.nx;
    ctrlPts[seg].ny = midpoint.ny;
    ctrlPts[seg].t  = 0.5;
    ctrlPts[seg].perpX = 0;
    ctrlPts[seg].perpY = 0;
    ctrlPtManual[seg] = false;        // volta ao modo automático ✓
  }

  renderAll();
  showStatus('Curva do Seg. X–Y resetada');
}
```

Funciona corretamente para:
- Trecho normal: `_activeEaseSeg` = 0 a `normalSegs-1`
- Trecho de loop: `_activeEaseSeg === normalSegs`

Não existe reset global de todas as curvas de uma vez (funcionalidade não implementada).

---

### A.9 Persistência no JSON

#### Salvar — `buildProjectData`

```js
loopCtrlPt: loopCtrlPt ? {...loopCtrlPt} : null,
// ctrlPts e ctrlPtManual são serializados em outro campo não mostrado no excerpt
```

`ctrlPts` e `ctrlPtManual` são salvos explicitamente com cópia rasa dos objetos.

#### Carregar — `applyProjectData` (linha 10515)

```js
ctrlPts.length = 0;
(data.ctrlPts || []).forEach(p => ctrlPts.push(p ? {...p} : null));
ctrlPtManual.length = 0;
(data.ctrlPtManual || []).forEach(v => ctrlPtManual.push(v));
loopCtrlPt = data.loopCtrlPt ? {...data.loopCtrlPt} : null;
```

Fallbacks seguros: `data.ctrlPts || []` evita crash em JSONs antigos sem esse campo.

#### Undo/Redo — `captureState` / `restoreState` (linhas 4293–4389)

`ctrlPts`, `ctrlPtManual` e `loopCtrlPt` são todos capturados no snapshot de undo com cópias rasas dos objetos. A restauração reconstrói os arrays e o DOM de ctrl pts do zero.

---

## B. Onde estão os riscos

### B.1 Objeto `ctrlPts[0]` sem campos `t`, `perpX`, `perpY`

**Onde:** `initDefaultFrames`, linha 4978.  
**Impacto:** Se F1 ou F2 for movido após a init padrão e `ctrlPtManual[0] === false`, `syncCtrlPtsForFrame` recalcula o midpoint corretamente (branch `!ctrlPtManual`). O problema só apareceria se de alguma forma `ctrlPtManual[0]` virar `true` sem os campos terem sido criados — nesse caso `t` seria `undefined`, falharia no teste `Number.isFinite(t)` e seria tratado como não-finito, recalculado da posição nx/ny. O comportamento é tolerado, mas é inconsistência de forma.

### B.2 Código morto: Catmull-Rom em `getStateAtT`

**Onde:** linhas 6307–6358.  
**Impacto:** `crX` e `crY` são computados mas nunca utilizados. Custo de CPU mínimo (4 multiplicações), mas confunde qualquer leitura futura do motor — parece que a posição usa Catmull-Rom quando na verdade usa Bézier quadrática pura.

### B.3 Ausência de `loopCtrlPtManual`

**Onde:** sistema inteiro.  
**Impacto:** quando F1 ou o último frame é movido, `syncCtrlPtsForFrame` não atualiza `loopCtrlPt` (esse frame não está em segs `[fi-1, fi]` do ponto de vista de nenhum segmento normal com loop). O ponto de controle de loop **fica deslocado** visualmente quando o usuário move o primeiro ou último frame com loop ativo. Não é um crash, mas é desconexão visual. Comportamento atual: o usuário precisa resetar manualmente a curva de loop após mover frames extremos.

### B.4 Inconsistência de amostras: 24 vs 64

**Onde:** `mapProgressToBezierU` (motor, 24 amostras) vs `measureSegmentCurveLength` (64 amostras).  
**Impacto:** a velocidade exibida no Preview e no MP4 é mapeada com resolução menor do que o comprimento medido para redistribuição de tempo. Em curvas muito longas e acentuadas a diferença pode criar leve dessincronia entre o comprimento calculado e a sensação de velocidade constante.

### B.5 Remoção de frame intermediário não normaliza ctrlPts adequadamente

**Onde:** só `removeLastFrame` está implementado. Não existe `removeFrameAt(i)` genérico.  
**Impacto:** se no futuro uma remoção de frame intermediário for adicionada sem cuidado, `ctrlPts.splice` no índice errado pode dessincronizar os arrays. O sistema atual está protegido porque só remove o último, mas a ausência de uma função genérica é uma dívida técnica.

### B.6 Clipping arbitrário em `sanitizeCtrlPtsAfterImageChange`

**Onde:** linha 6786.  
**Impacto:** `[-0.35, 1.35]` foi escolhido empiricamente. Em stages com formato muito diferente do habitual (ex.: 9:16 vs 16:9 em dispositivos extremos) um ponto de controle legítimo muito fora do stage seria clipado sem aviso. Não é crítico mas é um número mágico sem comentário.

### B.7 Loop: `loopCtrlPt` não move ao escalar/redimensionar stage

**Onde:** `loopCtrlPt.nx/ny` é normalizado, então acompanha redimensionamentos de stage. OK nesse aspecto. Mas: ao inverter a ordem dos frames (`invertFrameOrder`, linha ~9350), `ctrlPts` é invertido corretamente, mas `loopCtrlPt` não é tocado. O trecho de loop no sentido N→1 invertido ainda usa o ctrl pt original. Pode criar curva inesperada.

### B.8 Dupla representação de posição no `ctrlPts`

Cada ponto tem `{nx, ny}` (posição absoluta normalizada) E `{t, perpX, perpY}` (posição relativa ao segmento). Ao salvar e recarregar, ambas são persistidas. Ao recarregar, `syncCtrlPtsForFrame` pode reescrever `nx/ny` baseado em `t/perp` — ou vice-versa. Há risco de drift entre as duas representações se algum caminho de código atualizar uma sem atualizar a outra.

---

## C. O que não deve ser mexido agora

| Componente | Razão para não mexer |
|---|---|
| `drawBezier` / SVG visual | Correto e consistente com o motor. |
| `getStateAtT` / motor de posição | Funciona em Preview e MP4; qualquer toque pode quebrar sincronismo. |
| `measureSegmentCurveLength` / `measureLoopCurveLength` | Base do modo velocidade constante e do easing inteligente. |
| `resetCurveSegment` | Funciona corretamente. Posição do botão será tratada em design system. |
| JSON save/load de `ctrlPts` / `loopCtrlPt` | Compatibilidade com projetos salvos. |
| `splitInsertedSegmentEase` / `insertFrameAfterActive` curve split | Lógica de de Casteljau correta; garantia de forma visual preservada. |
| Catmull-Rom (código morto) | Remover apenas em refactor planejado, não isolado. |

---

## D. Arquitetura recomendada para o novo sistema

### D.1 Princípios

1. **Frame como âncora explícita.** Cada frame tem handles de entrada e saída (como no Bézier cúbico). A curva entre F_i e F_(i+1) é controlada pelo handle de saída de F_i e pelo handle de entrada de F_(i+1). Isso resolve naturalmente a continuidade C1 e permite "suavidade local por frame".

2. **Trecho de loop como segmento real.** `loopCtrlPt` deixa de ser um objeto especial e passa a ser o handle do segmento `seg = normalSegs`, com `ctrlPtManual` próprio.

3. **Representação canônica única.** Eliminar a dualidade `nx/ny` vs `t/perpX/perpY`. Manter apenas `nx/ny` (absolutos normalizados) como dado primário. Recalcular t/perp sob demanda, nunca persistir.

4. **Migração suave.** JSON atual continua lendo-se com as mesmas funções. Novo campo `ctrlPtsV2` adicionado gradualmente sem remover `ctrlPts` até estabilizar.

### D.2 Estrutura de dados futura

```js
// Por frame: dois handles (em/out)
frameHandles[i] = {
  inH:  { nx, ny, linked: true },   // handle de entrada (← chegando em Fi)
  outH: { nx, ny, linked: true }    // handle de saída (→ saindo de Fi)
}
// linked: se true, os dois handles formam ângulo de 180° (tangência C1)
```

O ponto de controle de cada segmento `i → i+1` seria derivado de:
- `frameHandles[i].outH` → primeiro ponto de controle da Bézier cúbica
- `frameHandles[i+1].inH` → segundo ponto de controle

Para compatibilidade com o sistema atual (Bézier quadrática), o `outH` pode ser colapsado sobre o handle único atual.

### D.3 Reset de curva no novo sistema

- **Reset do trecho `i → i+1`:** zera `outH[i]` e `inH[i+1]` para posições de tangência neutra.
- **Reset do frame `i`:** zera `inH[i]` e `outH[i]` (afeta os dois trechos adjacentes).
- **Reset de tudo:** itera todos os frames.

### D.4 Loop como trecho real

```js
// Segmento de loop N→1 usa os mesmos handles do primeiro e último frame:
// ponto de controle 1 = frameHandles[last].outH
// ponto de controle 2 = frameHandles[0].inH
// Sem objeto loopCtrlPt especial.
```

Isso elimina B.3 (ausência de `loopCtrlPtManual`) e B.7 (loop não atualizado ao inverter).

### D.5 Compatibilidade com JSON atual

```js
// applyProjectData:
if (data.ctrlPtsV2) {
  // novo sistema
} else if (data.ctrlPts) {
  // migração: converter ctrlPts[seg] → frameHandles[seg].outH colapsado
  migrateCtrlPtsToHandles(data.ctrlPts);
}
```

---

## E. Plano de implementação em fases

### Fase 0 — Auditoria (esta branch)
- [x] Mapear estruturas existentes
- [x] Identificar riscos
- [x] Documentar divergências
- [ ] Nenhuma mudança de comportamento

### Fase 1 — Limpeza segura (sem mudança de comportamento)
**Objetivo:** eliminar dívida técnica que dificulta a evolução.

- Remover o código Catmull-Rom morto em `getStateAtT` (linhas 6307–6358: `getWaypoint`, `p0/p1/p2/p3`, `catmullRom`, `crX/crY`).
- Unificar amostras de arc-length: `mapProgressToBezierU` de 24 → 64 amostras para consistência com `measureSegmentCurveLength`.
- Adicionar `t: 0.5, perpX: 0, perpY: 0` ao `ctrlPts[0]` em `initDefaultFrames` para consistência de forma.
- Adicionar `syncCtrlPtsForFrame` ao handler de `loopCtrlPt` quando frames extremos são movidos.

**Critério de aceite:** Preview e MP4 idênticos à v8z4b17u. Resetar curva continua funcionando.

### Fase 2 — Introdução de handles duais (feature flag)
**Objetivo:** introduzir `frameHandles` sem quebrar o sistema atual.

- Criar `frameHandles[]` como array paralelo.
- Derivar o ponto de controle quadrático atual a partir de `outH[i]` apenas.
- UI: nenhuma — os handles ainda não aparecem visualmente.
- JSON: salvar `ctrlPtsV2` junto com `ctrlPts` por compatibilidade.

### Fase 3 — Suavidade local por frame
**Objetivo:** `linked: true` em `frameHandles` cria tangência automática C1.

- `syncCtrlPtsForFrame` passa a operar sobre `frameHandles`.
- Reset de frame reseta os dois handles adjacentes.
- UI: botão "Suavizar curva" vira "Suavizar frame" — reseta `inH` e `outH` do frame com linked=true.

### Fase 4 — Migração e remoção do sistema legado
**Objetivo:** eliminar `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` como estruturas primárias.

- Remover leitura de `ctrlPts` legado (manter migração por 2+ versões).
- Trecho de loop integrado ao sistema de handles.
- JSON `ctrlPtsV2` vira o único formato suportado.

---

## Apêndice: mapa de funções críticas

| Função | Linha | Papel |
|---|---|---|
| `initDefaultFrames` | 4948 | Init: cria F1/F2 e ctrlPts[0] |
| `addFrame` | 4991 | Adiciona último frame e novo segmento |
| `insertFrameAfterActive` | 5073 | Insere frame intermediário com split de Bézier |
| `removeLastFrame` | 5169 | Remove último frame e seu segmento |
| `computeTPerpForSeg` | 5965 | Converte nx/ny → t + perp relativo ao segmento |
| `computeNxNyFromTPerp` | 5978 | Converte t + perp → nx/ny |
| `syncCtrlPtsForFrame` | 5990 | Atualiza ctrl pts ao mover frame |
| `drawBezier` | 5576 | Renderiza curvas no SVG do stage |
| `updateCtrlPts` | 5634 | Posiciona bolinhas DOM arrastáveis |
| `startCtrlDrag` | 5749 | Inicia drag de ctrl pt (marca como manual) |
| `getStateAtT` | 6220 | Motor: posição/escala/rot em tempo t |
| `getSegAndLocalTAtTime` | 6060 | Mapeia t global → (seg, localT) |
| `measureSegmentCurveLength` | 9452 | Comprimento Bézier por 64 amostras |
| `measureLoopCurveLength` | 9492 | Comprimento curva de loop |
| `redistributeDurationsByCurveLength` | 9526 | Velocidade constante: redistribui tempos |
| `maybeRedistributeByCurveLength` | 9581 | Gatilho de redistribuição |
| `resetCurveSegment` | 7761 | Reset de curva do trecho ativo |
| `sanitizeCtrlPtsAfterImageChange` | 6771 | Sanitiza ctrl pts ao trocar imagem |
| `normalizeProjectArrays` | 8517 | Garante tamanho correto de todos os arrays |
| `validateProjectState` | 8541 | Verifica invariantes (log de aviso) |
| `captureState` | 4293 | Snapshot para undo |
| `restoreState` | 4332 | Restaura snapshot de undo |
| `buildProjectData` | ~10200 | Serializa projeto para JSON |
| `applyProjectData` | ~10460 | Desserializa projeto do JSON |
