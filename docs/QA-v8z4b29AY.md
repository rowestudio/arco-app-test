# QA — v8z4b29AY: refinamento visual handles/abas + HUD discreta

## Escopo

- Base obrigatória preservada: `v8z4b29AX` (4 handles/abas nos cantos + HUD visor/câmera + mira central).
- Objetivo: refinar o visual da interface do frame ativo no Stage para ficar fiel ao mockup de visor/câmera.
- Fora de escopo preservado: lógica de transformação, motor, timeline, curvas, Preview/export, JSON, fluxo de arquivos, menus contextuais, seleção múltipla, inserção assistida.

## Problemas corrigidos (v8z4b29AX → v8z4b29AY)

1. Abas/círculos grandes demais (36px) → reduzidos para 24px visual.
2. Abas sobrepostas à borda do frame → reposicionadas 12px para fora de cada canto.
3. Pill HUD preto pesado → faixa cinza translúcida discreta (rgba 60,60,60 / 52%).
4. Mira central pequena demais (20px) → 30px, levemente mais visível.
5. Número do frame coberto pela aba TL → resolvido pelo reposicionamento externo das abas.
6. Sinal `+` na rotação no HUD → removido (formato: `3.0s     0.0°     100%`).

## Diagnóstico e implementação

1. `.corner-handle`: width/height de 36px → 24px; margin de -18px → -12px; box-shadow reduzida.
2. `.corner-handle::before`: área de toque mantida em 44px (sem alteração).
3. `#frameHud`: background `rgba(0,0,0,.72)` → `rgba(60,60,60,.52)`; font-size 12px → 11px; font-weight 600 → 500; padding menor; border-radius 20px → 10px; offset CSS -10px → -14px.
4. `.frame-crosshair`: 20px → 30px; opacidade background 0.55 → 0.48.
5. JS render loop (renderAll): offset de 12px na direção centro→canto para cada handle, usando `getFrameCenter` + normalização do vetor.
6. `updateFrameHud`: rotStr sem sinal `+`; espaçamento alinhado ao formato do mockup.

## Verificações de critério de aceite

- [x] Versão v8z4b29AY visível no app
- [x] `APP_VERSION` e `APP_VERSION_NAME` = `'v8z4b29AY'`
- [x] Abas/círculos visualmente menores que na AX (~24px)
- [x] Abas fora da borda do frame (offset 12px externo)
- [x] Abas não cobrem a moldura branca do frame
- [x] Abas não cobrem o número do frame (TL externo ao frame)
- [x] HUD superior é faixa discreta cinza translúcida, não pill preto pesado
- [x] HUD exibe pausa, rotação e escala no formato `{s}s     {°}°     {%}%`
- [x] HUD não é tocável/interativo (pointer-events:none)
- [x] Mira central fina e centralizada no frame ativo
- [x] Área de toque dos handles mantida em 44px (iPhone/Safari)
- [x] Função dos 4 handles idêntica à v8z4b29AX (escala + rotação)
- [x] Handles seguem rotação/escala/movimento do frame ativo
- [x] Handles ocultados durante: preview, multi-seleção, inserção assistida
- [x] Número do frame preservado e legível
- [x] Pontos de curva/Bézier não alterados
- [x] Ghost-frame handle (inserção assistida) preservado
- [x] Timeline/menu inferior não alterados
- [x] Preview/export/JSON não alterados

## Riscos e regressões monitorados

- Offset externo (12px) calculado via normalização do vetor centro→canto: funciona para frames rotacionados.
- `getFrameCenter(activeIdx)` chamado uma vez antes do forEach para eficiência.
- Drag logic usa `getRawHandlePosForFrame` (posição real do canto), não a posição visual — offset não afeta o motor de transformação.
- `_CORNER_OUT` = 12px: respiro visual suficiente sem afastar demais a área de toque da borda.
- HUD offset CSS -14px (era -10px): garante separação das abas superiores TL/TR.
