# Auditoria v8z4b28d — Preview/Export/MP4

## 1. Estado geral

**Base confirmada:** `APP_VERSION = 'v8z4b28d'`, `APP_VERSION_NAME = 'v8z4b28d'`,
texto visível idêntico, changelog no cabeçalho coerente.

**Avaliação geral:** A correção crítica da v8z4b28d (motor universal, validação
de canvas, guard de encoder, `cleanupFailedExport` sem fechar tela preta) está
preservada e bem estruturada. Não há risco imediato de travamento ou tela preta
na versão atual. O fluxo Preview → Export → MP4 está funcionalmente correto. Os
problemas remanescentes são de **performance em tempo real no Preview**,
explicados em detalhe abaixo.

---

## 2. Achados críticos

**Nenhum achado crítico novo.** As correções de v8z4b28c/d (HEIC canonical
source, validação de frame antes de encode, flag `exportCancelledFlag`, `finally`
fechando encoder) estão corretas e coerentes.

---

## 3. Achados de performance do Preview

### 3.1 — Dupla execução de `buildRenderDiagnostics` por frame 🔴 ALTO

**Localização:** `renderFrameSafely` (linha 15135) e `drawAtT` (linha 15569).

**Problema:** O caminho normal do Preview executa `buildRenderDiagnostics`
**duas vezes por frame**. O primeiro resultado (de `renderFrameSafely`) só é
usado em caminhos de fallback/erro. O segundo (de `drawAtT`) é o que
efetivamente alimenta `drawAtTDirect`.

`buildRenderDiagnostics` chama `getRenderStateAtTime`, que chama `getStateAtT`,
que executa:
- `getSegAndLocalTAtTime` (loop por segmentos)
- `applyEaseAtEnds` + easing individual
- Catmull-Rom com 4 waypoints
- `mapProgressToBezierU` com loop de 24 iterações para arc-length
- Cálculos de escala e rotação com easings independentes

**Todo esse custo matemático roda 2× por frame no caminho feliz do Preview.**
É a causa mais provável do engasgo.

### 3.2 — Alocação de funções internas dentro de `getStateAtT` 🟠 MÉDIO

**Localização:** `getStateAtT` (linhas 15430–15536).

Quatro funções são declaradas como closures *dentro* de `getStateAtT`:

- `getWaypoint` (linha 15430)
- `catmullRom` (linha 15475)
- `bezierPointAt` (linha 15502)
- `mapProgressToBezierU` (linha 15515)

Como `getStateAtT` é chamada 2× por frame (via dupla `buildRenderDiagnostics`),
esses **4 objetos de função são alocados 2× por frame** e imediatamente elegíveis
para GC. No iPhone/Safari, o GC intermitente causado por essa pressão é um fator
de microtravadas.

Além disso, `mapProgressToBezierU` cria `const lens = [0]` com 24 `push()` calls,
gerando um array de 25 elementos alocado 2× por frame.

### 3.3 — `document.getElementById` dentro do rAF 🟠 MÉDIO

**Localização:** Linha 15767 dentro do `loop` de `startPreview`, linha 15834
no loop de retomada.

```javascript
document.getElementById('previewTimelineFill').style.width = (t * 100) + '%';
```

Busca DOM `getElementById` executada **a cada frame de Preview** (~30×/segundo).
Deveria ser uma referência cacheada uma vez. A atribuição de `style.width` sozinha
não causa reflow síncrono, mas a busca DOM tem custo não trivial e pode pressionar
o compositor no Safari.

### 3.4 — Blur computado e aplicado em duplicata 🟡 BAIXO

**Localização:** Linha 15759 (`startPreview`) e linha 15628 (`drawAtTDirect`).

`getBlurAtT(t, pW2)` é chamado duas vezes por frame:

1. No `loop` de Preview para definir `dispCanvas.style.filter = blur(0.5x)`
2. Dentro de `drawAtTDirect` para definir `ctx.filter = blur(1x)` (dentro do save/restore)

O resultado: no Preview, o blur visual é **CSS blur (0.5×) + canvas filter blur (1×)
empilhados**. No MP4, apenas o `ctx.filter` é aplicado. O Preview mostra blur mais
suave/diferente do MP4, e o cálculo roda em duplicata por frame.

### 3.5 — `applyCanvasRenderQuality` chamado 3× por frame 🟡 BAIXO

**Localização:** `drawAtT` (linha 15568), `drawAtTDirect` (linha 15589), e
indiretamente via `hardResetCanvas` (linhas 16013–16014).

O mesmo `ctx.imageSmoothingEnabled = true` e `imageSmoothingQuality = 'high'`
são definidos 3 vezes por frame no mesmo contexto.

### 3.6 — Canvas limpo e preenchido 2× por frame 🟡 BAIXO

**Localização:** `hardResetCanvas` (linhas 16019–16021) e `drawAtTDirect`
(linhas 15608–15615).

`hardResetCanvas` executa `clearRect` + `fillRect`. Depois, `drawAtTDirect`
executa `clearRect` + `fillRect` de novo no mesmo canvas. Dobra o custo de
setup por frame.

### 3.7 — Object literal construído por frame para `debugRenderExport` quando flag desligada 🟡 BAIXO

**Localização:** `getRenderStateAtTime` linha 14942.

```javascript
debugRenderExport('[RenderState]', {
  frameNumber: null,
  globalTime: state.globalTime,
  ...
});
```

O objeto literal é avaliado *antes* da chamada à função. Mesmo com
`DEBUG_RENDER_EXPORT = false` (que causa retorno imediato na linha 14879),
o objeto é alocado e descartado **a cada frame** (2× por frame pelo problema 3.1).
Pressão leve de GC, mas presente.

### 3.8 — Preview em resolução total 🟡 BAIXO / DECISÃO DE DESIGN

**Localização:** Linha 10641, `PREVIEW_SCALE = 1`.

O Preview usa a mesma resolução do Export (`720×1280` para 9:16, `1080×1080`
para 1:1). Para um iPhone mais antigo ou em `1:1`, o backing store do canvas
tem >1 megapixel renderizado a 30fps em tempo real. Funciona em iPhones modernos,
mas pode causar engasgo em dispositivos mais antigos ou quando a bateria está fraca.

---

## 4. Achados de memória/cleanup

### 4.1 — Ausência de guard `!isPreviewing` nos loops principais 🟠 MÉDIO

**Localização:** `loop` em `startPreview` (linha 15754), `loop` em
`togglePreviewPlayback` retomada (linha 15822).

O `loopAfter` em `finishExport` tem:

```javascript
function loopAfter(ts) {
  if (!isPreviewing) return; // ← guard presente
  ...
}
```

Mas os loops de `startPreview` e de retomada **não têm esse guard**. Se
`cancelAnimationFrame` não cancela o frame (ID stale, race condition de um frame),
o loop continua renderizando mesmo com `isPreviewing = false`. O risco é baixo
em condições normais, mas existe.

### 4.2 — `hardResetCanvas` cria contexto de clipping sem save/restore 🟡 BAIXO

**Localização:** `hardResetCanvas` (linhas 16015–16018).

```javascript
try { ctx.restore(); } catch(e) {}  // especulativo — sem save pareado
try { ctx.beginPath(); } catch(e) {}
try { ctx.rect(0, 0, ...); } catch(e) {}
try { ctx.clip(); } catch(e) {}     // clip sem save — persiste para sempre
```

O `ctx.clip()` é chamado sem um `ctx.save()` prévio, estabelecendo um clipping
region permanente. A cada frame, o `ctx.clip()` interseciona com o clip anterior
(ambos são retângulos do canvas inteiro, então o resultado é sempre o canvas
completo). Funcionalmente correto, mas é acúmulo de estado desnecessário.

### 4.3 — `previewCanvas` (stage) dimensionado mas nunca desenhado 🟡 OBSERVAÇÃO

**Localização:** `<canvas id="previewCanvas">` (linha 2256, dentro de
`stageContent`), `setupPreviewCanvas()` (linha 10865).

O `previewCanvas` dentro do Stage tem suas dimensões de backing store definidas
em `setupPreviewCanvas()` e `layoutStage()`. O contexto `pCtx` é obtido na linha
10711. Mas **nenhum draw é feito neste canvas durante o Preview real** — o
rendering efetivo vai para `previewDisplayCanvas` (dentro do `previewScreen`
overlay).

**Potencial de memória:** para `9:16`, o `previewCanvas` tem backing store de
720×1280×4 bytes ≈ 3,5 MB. Nunca desenhado, nunca exibido ao usuário no Preview.

### 4.4 — `pCtx` global shadowing por `pCtx` local em `startPreview` 🟡 OBSERVAÇÃO

**Localização:** `const pCtx = previewCanvas.getContext('2d')` na linha 10711
(global) e `const pCtx = dispCanvas.getContext('2d')` na linha 15727
(local em `startPreview`).

O nome `pCtx` é reutilizado para dois contextos diferentes. O global refere-se ao
`previewCanvas` vestigial (não usado para rendering). O local em `startPreview`
refere-se ao `previewDisplayCanvas`. Shadowing pode causar confusão em manutenção,
apesar de não ter bug funcional.

### 4.5 — `isExportFrameLikelyBlank` cria canvas DOM por chamada 🟡 OBSERVAÇÃO (Export only)

**Localização:** Linha 16035.

```javascript
const probe = document.createElement('canvas');
```

Criado dentro de `isExportFrameLikelyBlank`, que é chamado per-frame durante o
Export com `{ rejectBlank: true }`. Para um Export de 30fps × 10s = 300 frames,
300 mini-canvas são criados e GC'd. Em Export sequencial com `await`, o GC tem
janelas para rodar. Não impacta o Preview.

---

## 5. Diferenças Preview vs MP4

| Aspecto               | Preview                              | MP4 Export                          |
|-----------------------|--------------------------------------|-------------------------------------|
| Resolução de render   | Idêntica ao Export (PREVIEW_SCALE=1) | Export resolution                   |
| Timing                | Tempo real via rAF (~16ms/frame)     | Sequencial + await setTimeout(0)    |
| Blur                  | CSS filter (0.5×) + ctx.filter (1×)  | Apenas ctx.filter (1×)              |
| Canvas alpha          | getContext('2d') com alpha           | getContext('2d', { alpha: false })  |
| rejectBlank           | Não usado                            | Usado — fallback se frame branco    |
| Pressão de GC         | Alta (2× buildRenderDiagnostics)     | Baixa (sequential, GC entre frames) |
| Backpressure          | Nenhum — 30fps forçado pelo rAF      | Queue limit + flush a cada 90 fr.   |
| Fonte canônica        | Mesma (getCanonicalRenderSource())   | Mesma — consistente                 |

**Conclusão principal:** O MP4 está correto porque o Export é sequencial e tem
margens de tempo para cada frame. O Preview "engasga" porque tenta 30fps em tempo
real, fazendo 2× o trabalho matemático por frame e gerando pressão de GC contínua
que o Safari/iPhone interrompe periodicamente para coletar lixo. A correção da
fonte canônica (v8z4b28c) está preservada em ambos os caminhos.

---

## 6. Melhorias recomendadas de baixo risco

### M1 — Eliminar dupla `buildRenderDiagnostics` (impacto máximo)

**Como:** Em `renderFrameSafely`, passar o resultado do `buildRenderDiagnostics`
já computado para `drawAtT` em vez de deixar `drawAtT` recalcular. `drawAtT`
receberia um parâmetro opcional `diagnostics` e só chamaria `buildRenderDiagnostics`
se não receber.

**Benefício:** Metade do custo matemático do Preview eliminado. Estimativa:
redução de 40–50% do custo por frame no caminho feliz.

**Risco:** Baixo — é refatoração cirúrgica de interface entre duas funções
internas. Sem alteração de comportamento visível.

### M2 — Cachear `document.getElementById('previewTimelineFill')` fora do rAF

**Como:** Resolver a referência antes do início do loop e usar a variável
cacheada dentro.

**Benefício:** Elimina busca DOM por frame.

**Risco:** Muito baixo.

### M3 — Adicionar guard `if (!isPreviewing) return;` nos loops de Preview

**Como:** Nos loops em `startPreview` e `togglePreviewPlayback`, adicionar a
mesma verificação que já existe no `loopAfter` de `finishExport`.

**Benefício:** Segurança secundária — previne continuação acidental do loop se
`cancelAnimationFrame` falhar silenciosamente.

**Risco:** Muito baixo.

### M4 — Remover double-blur no Preview (CSS filter + ctx.filter)

**Como:** No loop de `startPreview`, não aplicar `dispCanvas.style.filter` para
blur — deixar apenas o `ctx.filter` dentro de `drawAtTDirect` funcionar, como no
Export.

**Benefício:** Preview fica visualmente mais próximo do MP4. Elimina uma passagem
extra de blur por frame no compositor CSS.

**Risco:** Baixo, mas **altera comportamento visual do Preview** — deve ser
verificado que o blur continua correto após a mudança.

### M5 — Remover `applyCanvasRenderQuality` redundante

**Como:** `drawAtTDirect` chama `applyCanvasRenderQuality` no início. Se
`hardResetCanvas` e `drawAtT` já o chamaram, a chamada em `drawAtTDirect`
pode ser removida.

**Benefício:** Elimina 2 canvas API calls por frame.

**Risco:** Muito baixo.

### M6 — Wrapping do payload de `debugRenderExport` em guard

**Como:** Em `getRenderStateAtTime`, envolver a chamada em:

```javascript
if (DEBUG_RENDER_EXPORT) { debugRenderExport('[RenderState]', { ... }); }
```

**Benefício:** Elimina alocação de objeto por frame com flag desligada.

**Risco:** Muito baixo.

---

## 7. Melhorias que NÃO devem ser feitas agora

- **Mover closures de `getStateAtT` para fora:** Tornar `getWaypoint`,
  `catmullRom`, `bezierPointAt`, `mapProgressToBezierU` funções de módulo exige
  refatorar o acesso a variáveis locais (`p1`, `p2`, `cpx`, etc.), aumentando a
  superfície de mudança. Benefício real existe, mas risco de regressão é médio.

- **Reduzir resolução do Preview:** Alterar `PREVIEW_SCALE` para 0.5 ou similar
  diminuiria a carga de GPU, mas quebraria a premissa de "Preview = qualidade MP4"
  estabelecida nas versões recentes como feature explícita.

- **Eliminar `previewCanvas` do stage:** Remover o elemento HTML e a função
  `setupPreviewCanvas()` exigiria auditar todos os usos de `previewCanvas` e
  `pCtx` globais, com risco de deixar uma referência nula em algum caminho de
  erro. Candidato para versão futura com auditoria dedicada.

- **Unificar os 3 loops de Preview em uma função:** A deduplicação é válida,
  mas os 3 loops têm variações de contexto (canvas local capturado, resize logic,
  guard de `isPreviewing`) que tornam a unificação não trivial. Risco de regressão
  maior que o benefício agora.

- **Substituir `hardResetCanvas` por sequência mais simples:** A função atual
  tem 11+ canvas API calls com muitos try/catch defensivos que nasceram de bugs
  históricos. Simplificá-la requer entender exatamente quais casos cada guarda
  cobre. Candidato para refatoração futura, não agora.

---

## 8. Plano sugerido

### Manter como está

- Motor WebCodecs/VideoEncoder — correto e robusto
- Pipeline `canonicalRenderImage` — consistente entre Preview e Export
- Lógica de `exportCancelledFlag` — correta
- Guard de encoder no `finally` — correto
- `cleanupFailedExport` retornando ao Preview sem tela preta — correto
- Flags `DEBUG_RENDER_EXPORT = false` e `DEBUG_IMAGE_PIPELINE = false` — corretas

### Corrigir agora (baixo risco, alto impacto)

1. M1 — Eliminar dupla `buildRenderDiagnostics` (causa principal do engasgo)
2. M2 — Cachear `getElementById('previewTimelineFill')` fora do rAF
3. M3 — Adicionar guard `!isPreviewing` nos loops principais

### Deixar para versão futura

- M4 — Remover double-blur (pequena mudança visual, requer teste visual cuidadoso)
- M5, M6 — Micro-otimizações (fazer junto com outra iteração)
- Unificação dos loops de Preview em função comum
- Eliminação do `previewCanvas` vestigial do Stage
- Simplificação de `hardResetCanvas`
- Mover closures de `getStateAtT` para escopo de módulo

---

## 9. Patch sugerido (não aplicar — apenas descrição)

### Patch P1 — Eliminar dupla `buildRenderDiagnostics`

**Função alvo:** `drawAtT` (linha 15567)

**Mudança:** Adicionar parâmetro opcional `existingDiagnostics`:

```javascript
// ANTES:
function drawAtT(ctx, t, W, H, totalFrames, frameIdx) {
  applyCanvasRenderQuality(ctx);
  const diagnostics = buildRenderDiagnostics(t, W, H, frameIdx);
  ...
}

// DEPOIS:
function drawAtT(ctx, t, W, H, totalFrames, frameIdx, existingDiagnostics) {
  applyCanvasRenderQuality(ctx);
  const diagnostics = existingDiagnostics || buildRenderDiagnostics(t, W, H, frameIdx);
  ...
}
```

**Chamador em `renderFrameSafely`:** Passar `diagnostics` já computado:

```javascript
// ANTES:
ok = drawAtT(ctx, t, W, H, totalFrames, frameIdx) === true;

// DEPOIS:
ok = drawAtT(ctx, t, W, H, totalFrames, frameIdx, diagnostics) === true;
```

**Impacto:** `buildRenderDiagnostics` (e portanto `getStateAtT` + toda a
matemática de interpolação) passa a rodar 1× por frame em vez de 2×.
Sem alteração de comportamento.

---

### Patch P2 — Guard `isPreviewing` nos loops e cache de `getElementById`

**Função alvo:** `startPreview` loop (linha 15754)

**Mudança 1:** Adicionar no topo da `function loop(ts)`:

```javascript
if (!isPreviewing) return;
```

**Mudança 2:** Antes do `animFrame = requestAnimationFrame(loop)` inicial,
capturar referência:

```javascript
const timelineFill = document.getElementById('previewTimelineFill');
```

Dentro do `loop`, substituir `document.getElementById('previewTimelineFill')`
pela variável cacheada.

Repetir equivalente para o loop de retomada em `togglePreviewPlayback`.

---

### Patch P3 — Wrapping do payload de `debugRenderExport` em `getRenderStateAtTime`

**Função alvo:** `getRenderStateAtTime` (linha 14942)

**Mudança:**

```javascript
// ANTES:
debugRenderExport('[RenderState]', { ... objeto sempre construído ... });

// DEPOIS:
if (DEBUG_RENDER_EXPORT) debugRenderExport('[RenderState]', { ... });
```

---

**Resumo dos patches:** P1 é o mais importante (corrige o engasgo principal).
P2 e P3 são seguros e complementares. Nenhum deles toca UI, layout, qualidade
de export, ou fluxo de dados.
