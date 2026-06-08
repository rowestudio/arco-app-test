# QA — v8z4b29AJ escala interna real dos frames da timeline

## Objetivo

Validar a versão `v8z4b29AJ`, criada a partir da `v8z4b29AI`, com objetivo único de corrigir de forma visível e proporcional a escala interna dos frames `.fp` da timeline/faixa inferior.

## Escopo da alteração

- Ajuste restrito aos blocos de frame da timeline inferior (`.mid-bar.timeline-grid .fp` e estados ativo/selecionado existentes).
- `--timeline-frame-scale` passa a ser calculada em runtime por `syncLowerTimelineFrameScale()` a partir da largura disponível de `#pillsRow`, quantidade de frames e quantidade de trechos/ease pills visíveis.
- A escala afeta visualmente largura, altura, número/fonte, padding horizontal, padding vertical, raio de canto e line-height.
- A borda permanece fixa em `1.5px`, preservando a espessura aprovada.

## Preservações obrigatórias

- Menus deslizantes da seleção de frames aprovados na `v8z4b29AF`.
- Pontos laranja centralizados da timeline aprovados na `v8z4b29AH`.
- Snap-to-center e scroll da timeline.
- Alpha/spotlight.
- Seleção múltipla.
- Curvas e menu de curvas.
- Stage.
- Preview/export/MP4.
- JSON.
- Motor de renderização.

## Verificações estáticas realizadas

- [x] `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29AJ`.
- [x] `.mid-bar.timeline-grid .fp` usa `--timeline-frame-scale` real em `width`, `height`, `font-size`, `padding`, `border-radius` e `line-height`.
- [x] `.mid-bar.timeline-grid .fp` mantém `border:1.5px solid #b2b2b2`, sem borda proporcional.
- [x] `syncLowerTimelineFrameScale()` mede a largura disponível de `#pillsRow` e calcula escala menor que `1` quando a densidade de frames/trechos excede a faixa visível.
- [x] `scheduleLowerTimelineFrameScale()` recalcula a escala em `resize` e `orientationchange`, sem tocar no eixo de snap, em `timelineFocalFrameId`, no Stage, no motor, em Preview/export, JSON ou curvas.

## QA manual obrigatório no iPhone/Safari

1. Abrir o app em `v8z4b29AJ`.
2. Confirmar versão visível `v8z4b29AJ`.
3. Carregar projeto com vários frames, idealmente 8 ou mais.
4. Observar a timeline com frames próximos.
5. Confirmar que número, padding e radius estão menores/proporcionais nos frames menores.
6. Confirmar que a borda manteve a espessura aprovada.
7. Confirmar que ficou mais claro qual número pertence a qual frame.
8. Rolar a timeline.
9. Confirmar que o frame focal continua centralizado nos pontos laranja.
10. Confirmar que snap-to-center continua funcionando.
11. Confirmar que Alpha/spotlight continua funcionando.
12. Confirmar que menus deslizantes da `v8z4b29AF` continuam OK.
13. Confirmar que nenhuma função de curva foi alterada.
14. Confirmar Preview básico sem regressão.

## Teste comparativo recomendado

Comparar visualmente `v8z4b29AI` e `v8z4b29AJ` lado a lado ou por prints no iPhone/Safari. A `v8z4b29AJ` deve mostrar diferença clara na proporção interna dos frames da timeline: números menores, padding menor, cantos menos arredondados e borda com a mesma espessura visual.

## Pendências do ambiente automatizado

- iPhone/Safari real não disponível neste ambiente.
- Comparação visual por print contra `v8z4b29AI` não executada neste ambiente.
- Preview/export/MP4 real, JSON manual e curvas manuais devem ser validados antes de promover a versão.
