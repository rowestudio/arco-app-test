# QA — v8z4b29J

## Escopo

- Ajustar a área inferior da v8z4b29I para seguir melhor a referência proporcional do usuário.
- Preservar Preview, MP4/export, JSON schema e cálculos reais de frames/curvas/easing/renderização.

## Checklist estático

- [x] Versionamento atualizado para `v8z4b29J` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentários/changelog do topo.
- [x] Estrutura inferior continua em 2 colunas e 4 linhas.
- [x] Coluna 1 ampliada e mais presente.
- [x] Padding inferior morto removido da grade inferior.
- [x] Botão `+ frame` maior, circular/pill e em `var(--accent)`.
- [x] Linha 4 / Coluna 1 mantém ícone global de duração com label `Tempo`.
- [x] Tempos parciais usam as mesmas larguras visuais de frames/trechos e são sincronizados com a timeline sem atraso perceptível por `scrollLeft` imediato.
- [x] Frames ficam visualmente mais importantes que trechos; trechos são conexões estreitas com bolinhas e hit area preservada.
- [x] Centro/foco da timeline mantém marcadores laranja.
- [x] Frame ativo clicado/adicionado recentraliza, exceto em seleção múltipla ativa.
- [x] Pausa de frame usa `i-frame-pause`, distinto de Tempo/Duração, com label `Pausa` preservado.

## Limitações do ambiente

- Não houve validação em iPhone/Safari real neste ambiente automatizado.
- Não houve geração real de MP4 neste ambiente automatizado.
