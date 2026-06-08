# QA — v8z4b29AG alinhamento dos pontos centrais da timeline

## Objetivo

Validar que os pontos laranja/amarelos de centro da timeline inferior usam o mesmo eixo horizontal funcional de `#pillsRow`, preservando integralmente a base aprovada `v8z4b29AF`.

## Escopo

- Corrigir apenas a referência horizontal visual dos pontos de `.lower-timeline-slot`.
- Não alterar snap-to-center, seleção múltipla, menus deslizantes, `timelineFocalFrameId`, Alpha/spotlight, Preview/export/MP4, JSON, curvas, motor, `#alignBarSubmenu`, `#custBar`, `#custBarContent` ou arquitetura da Linha 3 / Linha 4 / Coluna 2.

## Medição obrigatória com `getBoundingClientRect()`

Executar no console do browser após carregar um projeto com vários frames e deixar um frame cair no centro pelo snap:

```js
const pills = document.querySelector('#pillsRow')?.getBoundingClientRect();
const slot = document.querySelector('.lower-timeline-slot')?.getBoundingClientRect();
const active = document.querySelector('#pillsRow .fp.active, #pillsRow .fp.timeline-focal, #pillsRow .fp.selected')?.getBoundingClientRect();
const markerX = (() => {
  const value = getComputedStyle(document.querySelector('.lower-timeline-slot')).getPropertyValue('--lower-timeline-center-x');
  return slot && value ? slot.left + parseFloat(value) : null;
})();

console.log({
  pillsCenter: pills ? pills.left + pills.width / 2 : null,
  pillsFunctionalCenter: pills ? pills.left + document.querySelector('#pillsRow').clientWidth / 2 : null,
  slotCenter: slot ? slot.left + slot.width / 2 : null,
  activeCenter: active ? active.left + active.width / 2 : null,
  markerX,
  markerDeltaToActive: markerX && active ? markerX - (active.left + active.width / 2) : null
});
```

Critério de aceite: `markerDeltaToActive` deve ficar entre `-1` e `1` px após o snap, aceitando apenas arredondamento do browser.

## Checklist visual obrigatório

1. Abrir o app em `v8z4b29AG`.
2. Carregar projeto com vários frames.
3. Observar a timeline inferior com o Frame 1 no centro.
4. Confirmar que o centro horizontal do frame/pill focal coincide com os dois pontos laranja.
5. Rolar a timeline manualmente.
6. Deixar outro frame cair no centro pelo snap.
7. Confirmar novamente que os pontos laranja estão alinhados ao centro desse frame.
8. Repetir com frame intermediário.
9. Repetir com último frame acessível.
10. Confirmar que o offset constante para a direita desapareceu.
11. Confirmar que o snap-to-center continua funcionando.
12. Confirmar que Alpha/spotlight continua seguindo o frame focal.
13. Confirmar que menus deslizantes da seleção de frames continuam funcionando como na `v8z4b29AF`.
14. Confirmar que Linha 3 / Linha 4 / Coluna 2 não sofreu regressão.

## Resultado neste ambiente

- Validação manual visual em browser/iPhone real: pendente.
- Medição runtime com `getBoundingClientRect()` em browser real: pendente.
- Verificação estática realizada: a variável `--lower-timeline-center-x` é calculada a partir de `#pillsRow` usando `clientWidth / 2`, que é o mesmo eixo horizontal funcional usado pelos cálculos aprovados de foco/snap da timeline.
