# QA pendente — v8z4b29BA refinamentos visuais frame ativo

> Base preservada: v8z4b29AZ (clamp posição inicial de frame novo + 4 abas no ghost).

## Escopo v8z4b29BA

- Aumentar espaçamento horizontal entre os blocos pausa / rotação / escala no HUD do frame ativo.
- Reduzir ~10% o tamanho visual das 4 abas circulares, preservando a posição dos centros e área de toque.
- Preservar: clamp de frame novo, timeline/menu inferior, curvas, Preview/export, JSON, motor de animação.

## Diagnóstico e implementação

1. HUD (frameHud): `textContent` com espaços colapsáveis substituído por três `<span>` com `display:flex; gap:16px` — espaçamento consistente e legível no iPhone.
2. Abas circulares: tamanho visual reduzido de 24px para 22px (~8,3% ≈ 10%); margens negativas ajustadas de -12px para -11px para manter o centro exato; `::before` de 44px preservado para área de toque adequada no iPhone/Safari.
3. Nenhuma alteração em lógica de transformação, posicionamento de handles, motor ou fluxo de arquivos.

## QA manual pendente v8z4b29BA

1. Versão visível mostra `v8z4b29BA`.
2. HUD do frame ativo exibe pausa, rotação e escala com espaçamento visivelmente mais arejado.
3. Os 3 blocos do HUD não se sobrepõem em frames pequenos.
4. As 4 abas circulares estão visivelmente menores (~10%) comparadas à v8z4b29AZ.
5. O centro de cada aba permanece exatamente na mesma posição de antes.
6. A área de toque das abas permanece confortável no iPhone (≥ 44px).
7. Arrastar aba inicia scale/rotate corretamente.
8. Arrastar o corpo do frame move normalmente.
9. Criar frame perto da borda: frame nasce inteiro dentro do Stage (correção v8z4b29AZ preservada).
10. Frame ghost/novo exibe 4 abas brancas nos cantos.
11. Mira central, número do frame e borda/moldura não foram alterados.
12. Timeline/menu inferior não muda.
13. Preview/export/MP4 continuam funcionando.
14. JSON abre/salva normalmente.
15. Funciona no iPhone/Safari.

---
