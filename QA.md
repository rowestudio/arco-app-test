# QA pendente — v8z4b29BB microcorreção visual frame ativo

> Base preservada: v8z4b29BA (espaçamento HUD + redução visual das abas circulares).

## Escopo v8z4b29BB

- Remover aspecto de pill arredondado do fundo do texto superior (frameHud) do frame ativo.
- Remover pill separado de ângulo (.angle-indicator), mantendo o ângulo visível apenas no frameHud.
- Preservar: comportamento e conteúdo do frameHud, abas circulares, timeline/menu inferior, curvas, Preview/export, JSON, motor.

## Diagnóstico e implementação

1. `#frameHud` CSS: `border-radius:10px` → `border-radius:2px` — elimina o aspecto de cápsula/pill, mantém cantos levemente arredondados de forma discreta.
2. `.angle-indicator.show` CSS: `display:block` → `display:none` — pill separado de ângulo permanece oculto mesmo quando JS adiciona a classe `.show`; não há alteração em JS.
3. Nenhuma alteração em lógica de rotação, escala, motor, timeline ou fluxo de arquivos.

## QA manual pendente v8z4b29BB

1. Versão visível mostra `v8z4b29BB`.
2. Texto superior do frame ativo (frameHud) continua aparecendo com pausa, rotação e escala.
3. O fundo do frameHud não tem mais formato de pill/cápsula arredondado.
4. O pill separado de ângulo (.angle-indicator) não aparece durante rotação.
5. O valor de ângulo continua visível no frameHud durante e após rotação.
6. Rotação do frame continua funcionando normalmente.
7. Escala do frame continua funcionando normalmente.
8. Arrastar aba inicia scale/rotate corretamente.
9. Arrastar o corpo do frame move normalmente.
10. As 4 abas circulares permanecem visualmente inalteradas.
11. Timeline/menu inferior não muda.
12. Preview/export/MP4 continuam funcionando.
13. JSON abre/salva normalmente.
14. Funciona no iPhone/Safari.

---
