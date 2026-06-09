# QA — v8z4b29BA refinamentos visuais frame ativo

> Base: v8z4b29AZ (clamp posição inicial de frame novo + 4 abas no ghost).

## Escopo

- Aumentar espaçamento horizontal entre os blocos pausa / rotação / escala no HUD do frame ativo.
- Reduzir ~10% o tamanho visual das 4 abas circulares, preservando a posição dos centros e área de toque.
- Preservar: clamp de frame novo, timeline/menu inferior, curvas, Preview/export, JSON, motor de animação.

## Implementação

### Problema 1 — HUD muito colado
- **Causa**: `textContent` com múltiplos espaços que colapsam no HTML.
- **Solução**: substituído por três `<span>` via `innerHTML`; CSS `#frameHud.show` muda de `display:block` para `display:flex; align-items:center; gap:16px`.
- **Arquivos**: `index.html` — CSS linha ~1001, JS `updateFrameHud` linha ~12558.

### Problema 2 — Abas circulares grandes
- **Causa**: tamanho visual de 24px era ligeiramente grande para o mockup refinado.
- **Solução**: CSS `.corner-handle` — `width/height: 24px → 22px`; `margin-left/top: -12px → -11px` (mantém centro); `::before` 44px preservado para área de toque.
- **Redução efetiva**: (24 - 22) / 24 = 8,3% ≈ 10%.
- **Arquivos**: `index.html` — CSS linha ~985.

## QA manual — checklist

| # | Teste | Resultado |
|---|-------|-----------|
| 1 | Versão visível mostra `v8z4b29BA` | ⬜ |
| 2 | HUD exibe pausa, rotação e escala com espaçamento visivelmente maior | ⬜ |
| 3 | Os 3 blocos do HUD não se sobrepõem em frames pequenos | ⬜ |
| 4 | Abas ~10% menores visualmente vs v8z4b29AZ | ⬜ |
| 5 | Centro de cada aba na mesma posição de antes | ⬜ |
| 6 | Área de toque das abas confortável no iPhone (≥ 44px) | ⬜ |
| 7 | Arrastar aba inicia scale/rotate corretamente | ⬜ |
| 8 | Arrastar corpo do frame move normalmente | ⬜ |
| 9 | Frame novo nasce dentro do Stage (correção v8z4b29AZ preservada) | ⬜ |
| 10 | Frame ghost exibe 4 abas brancas nos cantos | ⬜ |
| 11 | Mira central, número do frame e borda não alterados | ⬜ |
| 12 | Timeline/menu inferior não muda | ⬜ |
| 13 | Preview/export/MP4 funcionando | ⬜ |
| 14 | JSON abre/salva normalmente | ⬜ |
| 15 | Funciona no iPhone/Safari | ⬜ |
