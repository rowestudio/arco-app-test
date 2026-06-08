# QA — v8z4b29AH alinhamento dos pontos ao frame/pill focal real

## Objetivo

Validar que os pontos laranja superior e inferior da timeline inferior ficam no centro real renderizado do frame/pill focal visível, sem depender de ajuste fixo, centro geométrico genérico ou `left: calc(50% - Npx)`.

## Escopo preservado

- Preservar a `v8z4b29AF` aprovada para menus deslizantes da seleção de frames.
- Não alterar menus, seleção múltipla, Linha 3/Linha 4/Coluna 2, snap, Alpha, Preview/export, JSON, curvas ou motor.
- Corrigir apenas a origem horizontal de `.lower-timeline-slot::before` e `.lower-timeline-slot::after` por meio de `--lower-timeline-center-x`.

## Verificação estática

- [x] `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29AH`.
- [x] `syncLowerTimelineCenterMarkers()` localiza `.lower-timeline-slot` e `#pillsRow`.
- [x] `syncLowerTimelineCenterMarkers()` procura o focal real nesta ordem: `#pillsRow .fp.timeline-focal`, `#pillsRow .fp.active`, `#pillsRow .fp.selected`, e por fim `.fp[data-frame-index="timelineFocalFrameId"]`.
- [x] O X dos pontos é calculado por `focalRect.left + focalRect.width / 2 - slotRect.left` quando há focal válido.
- [x] O centro funcional de `#pillsRow` é usado somente como fallback quando nenhum focal válido é encontrado.
- [x] `.lower-timeline-slot::before` e `.lower-timeline-slot::after` continuam usando `left: var(--lower-timeline-center-x)` e `transform: translateX(-50%)`.
- [x] Não foi introduzido deslocamento fixo em pixels, `left: calc(50% - Npx)`, alteração de snap, largura de frames ou padding da timeline.

## Medição obrigatória no browser

Executar no console após carregar um projeto com vários frames e deixar o snap finalizar:

```js
const slotEl = document.querySelector('.lower-timeline-slot');
const focalEl = document.querySelector('#pillsRow .fp.timeline-focal, #pillsRow .fp.active, #pillsRow .fp.selected');
const slot = slotEl?.getBoundingClientRect();
const focal = focalEl?.getBoundingClientRect();
const markerValue = getComputedStyle(slotEl).getPropertyValue('--lower-timeline-center-x');
const markerAbsX = slot && markerValue ? slot.left + parseFloat(markerValue) : null;
const focalCenterX = focal ? focal.left + focal.width / 2 : null;
console.log({ markerAbsX, focalCenterX, delta: markerAbsX - focalCenterX });
```

Critério de aceite: `delta` entre `-1` e `1` px após o snap, aceitando apenas arredondamento do browser.

## Checklist visual obrigatório

1. Abrir o app em `v8z4b29AH`.
2. Carregar um projeto com vários frames.
3. Confirmar Frame 1 alinhado aos dois pontos laranja.
4. Rolar manualmente a timeline e aguardar o snap terminar.
5. Confirmar um frame intermediário alinhado aos dois pontos laranja.
6. Confirmar Frame 5 alinhado aos dois pontos laranja.
7. Confirmar o último frame acessível alinhado aos dois pontos laranja.
8. Confirmar que os pontos atualizam durante rolagem manual, após seleção de frame, após mudança de foco e após resize/orientation change.
9. Confirmar que o snap continua funcionando.
10. Confirmar que menus deslizantes da seleção de frames continuam funcionando como na `v8z4b29AF`.
11. Confirmar que seleção múltipla, Linha 3/Linha 4/Coluna 2, Alpha, Preview/export, JSON, curvas e motor não sofreram regressão.

## Resultado neste ambiente

- Validação visual em browser real: pendente.
- Validação em iPhone/Safari real: pendente.
- Medição runtime com `getBoundingClientRect()` em browser real: pendente.
- Verificação estática concluída nos arquivos alterados.
