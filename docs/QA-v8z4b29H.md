# QA — v8z4b29H

## Escopo

- Criar a base visual inferior em 2 colunas e 4 faixas a partir da base `v8z4b29G`.
- Corrigir padronização visual de ícones/pills e azul oficial.
- Ajustar apenas a animação visual do frame assistido para movimento oval sem rotação.
- Não alterar motor de Preview, MP4/export, WebCodecs, JSON, curvas, easing, cálculo real de frames ou duração.

## Confirmações estáticas

- Base inicial confirmada como `v8z4b29G` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- Versão final esperada: `v8z4b29H`.
- `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29H`.
- `index.html`: nova área inferior usa `midBar` como grid 2 colunas x 4 linhas, com coluna global estreita e coluna principal flexível.
- `index.html`: botão `+ frame` fica em pill com `var(--accent)` e é substituído no mesmo slot pelo ícone de selecionar todos quando há seleção múltipla.
- `index.html`: faixa de tempos parciais é informativa, renderiza pausas e durações existentes, sem handlers de edição direta.
- `index.html`: botão global de duração permanece chamando `openPanel('Duration')`.
- `index.html`: confirmação do frame assistido usa `var(--accent)`; cancelar permanece laranja.
- `index.html`: animação visual `ghostFloatIdle` não usa `rotate()` nem escala, apenas deslocamento oval discreto.

## Checklist manual obrigatório em iPhone/Safari real

1. Abrir o app e confirmar versão visível `v8z4b29H`.
2. Confirmar que a área inferior não aumentou a altura total e que o Stage não perdeu altura extra.
3. Confirmar que as quatro linhas das duas colunas alinham verticalmente.
4. Confirmar Coluna 1 estreita: tempo total, `+ frame`/selecionar todos, total de frames e duração geral.
5. Confirmar Coluna 2: tempos parciais, frames/trechos, estado ativo e ícones contextuais.
6. Testar adicionar frame, selecionar frame, selecionar trecho e seleção múltipla.
7. Na seleção múltipla, confirmar troca contextual do `+` por selecionar todos sem tranco visual.
8. Confirmar azul/ciano oficial em `+ frame`, confirmação do frame assistido e ações primárias.
9. Confirmar que o frame assistido flutua em movimento oval sem girar e pausa ao tocar/arrastar.
10. Confirmar que Preview e Export/MP4 continuam acessíveis e funcionais.
11. Confirmar salvar/abrir JSON, undo/redo e reset.

## Observação

- Testes em iPhone/Safari real e geração real de MP4 não foram executados no ambiente automatizado.
