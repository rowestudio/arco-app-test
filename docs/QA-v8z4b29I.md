# QA — v8z4b29I

## Escopo

- Corrigir a estrutura visual inferior criada na v8z4b29H.
- Manter o slot/altura total da área inferior, sem roubar altura extra do Stage.
- Não alterar motor de Preview, MP4/export, WebCodecs, JSON, curvas, easing, cálculos reais de frames, duração, paths ou renderização.

## Inventário estático

- Base inicial confirmada como `v8z4b29H` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- Versão final esperada: `v8z4b29I`.
- `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29I`.
- `index.html`: área inferior usa grade real de 2 colunas por 4 linhas, com Coluna 1 global estreita e Coluna 2 contextual/timeline.
- `index.html`: Linha 1 mostra tempo total e tempos parciais; Linha 2 mostra `+ frame` e timeline; Linha 3 mostra total de frames e estado/ações locais; Linha 4 mostra Duração geral e ícones contextuais com labels.
- `index.html`: seleção múltipla não usa overlay fixo sobre a Coluna 1; ações ficam na grade inferior.
- `index.html`: não há edição direta de pausa/duração pela faixa, nem alteração de Preview/Export/JSON/motor.

## Checklist manual iPhone/Safari

1. Abrir o app e confirmar versão visível `v8z4b29I`.
2. Confirmar que a área inferior ocupa a mesma altura da versão anterior e não cria scroll vertical interno.
3. Confirmar Coluna 1 estreita: tempo total, `+ frame`, total de frames e Duração geral.
4. Confirmar que a Duração geral permanece visível ao selecionar frame, trecho e múltiplos frames.
5. Confirmar Coluna 2: tempos parciais, frames/trechos, estado local e ícones contextuais com labels.
6. Rolar horizontalmente a timeline e confirmar que tempos parciais acompanham frames/trechos.
7. Confirmar frames como blocos numerados e trechos como conexões com bolinhas nas extremidades.
8. Tocar em frame e trecho e confirmar seleção sem ambiguidade visual.
9. Ativar seleção múltipla e confirmar que não cobre Coluna 1 nem Linha 4; ações aparecem nas linhas da grade.
10. Confirmar labels: Pausa, Rotação, Escala, Mover, Tempo/Movimento e Alinhar/Distribuir quando aplicável.
11. Testar adicionar frame, selecionar frame, selecionar trecho, selecionar todos, deletar/fixar frame, pausa, duração geral, duração de trecho, rotação, escala, mover, curvas/movimento/alinhamento quando aplicável.
12. Testar salvar/abrir JSON, upload de imagem, reset, undo/redo, Preview e Export/MP4 como regressão.

## Resultado esperado

A v8z4b29I mantém a área inferior em 2 colunas e 4 linhas alinhadas, sem sobreposição, sem scroll vertical interno e sem perda do botão de Duração geral.
