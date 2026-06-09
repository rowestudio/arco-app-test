# QA — v8z4b29BB microcorreção visual frame ativo

> Base: v8z4b29BA (espaçamento HUD + redução visual das abas circulares).

## Escopo

- Remover aspecto de pill arredondado do fundo do texto superior (frameHud) do frame ativo.
- Remover pill separado de ângulo (.angle-indicator), mantendo o ângulo visível apenas no frameHud.
- Preservar: comportamento e conteúdo do frameHud, abas circulares, timeline/menu inferior, curvas, Preview/export, JSON, motor.

## Implementação

### Tarefa 1 — Fundo do frameHud sem formato de pill

- **Causa**: `#frameHud` tinha `border-radius:10px`, criando visual de cápsula/pill arredondada.
- **Solução**: `border-radius:10px` → `border-radius:2px` — faixa retangular neutra com canto levemente arredondado.
- **Arquivo**: `index.html` — CSS `#frameHud`, linha ~1011.
- **Sem alteração em**: conteúdo textual, posição, lógica de valores, comportamento.

### Tarefa 2 — Remoção do pill separado de ângulo

- **Causa**: `.angle-indicator.show{display:block;}` exibia um pill duplicado de ângulo durante rotação.
- **Solução**: `.angle-indicator.show{display:none;}` — pill permanece oculto; o ângulo já está visível no frameHud.
- **Arquivo**: `index.html` — CSS `.angle-indicator.show`, linha ~975.
- **Sem alteração em**: JS `showAngleIndicator`/`hideAngleIndicator`, motor de rotação, frameHud.

## QA manual — checklist

| # | Teste | Resultado |
|---|-------|-----------|
| 1 | Versão visível mostra `v8z4b29BB` | ⬜ |
| 2 | Texto superior do frame ativo (frameHud) aparece com pausa, rotação e escala | ⬜ |
| 3 | Fundo do frameHud não tem mais aspecto de pill/cápsula arredondado | ⬜ |
| 4 | Pill separado de ângulo (.angle-indicator) não aparece durante rotação | ⬜ |
| 5 | Ângulo continua visível no frameHud durante e após rotação | ⬜ |
| 6 | Rotação do frame funciona normalmente | ⬜ |
| 7 | Escala do frame funciona normalmente | ⬜ |
| 8 | Arrastar aba inicia scale/rotate corretamente | ⬜ |
| 9 | Arrastar o corpo do frame move normalmente | ⬜ |
| 10 | As 4 abas circulares permanecem visualmente inalteradas | ⬜ |
| 11 | Timeline/menu inferior não muda | ⬜ |
| 12 | Preview/export/MP4 continuam funcionando | ⬜ |
| 13 | JSON abre/salva normalmente | ⬜ |
| 14 | Funciona no iPhone/Safari | ⬜ |
