# QA — v8z4b29CA

Base confirmada antes do patch: `v8z4b29BZ` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app, comentário/changelog do topo e `CHANGELOG.md`.

## Validação obrigatória em iPhone/Safari real

### Teste A — Trajetória / Linha reta

1. Criar ou abrir projeto com pelo menos 2 frames.
2. Criar uma curva visível entre F1 e F2.
3. Abrir painel contextual do trecho F1 → F2.
4. Entrar em Movimento.
5. Confirmar que a ação não está mais dentro do bloco de Velocidade.
6. Confirmar que aparece na seção própria `Trajetória`.
7. Acionar `Linha reta`.
8. Confirmar que o trajeto entre F1 e F2 vira linha reta.
9. Confirmar que os cards de velocidade/easing não são alterados indevidamente.
10. Confirmar que preview/export/JSON continuam funcionando.

### Teste B — edição com frame final selecionado

1. Criar projeto com F1 e F2.
2. Selecionar F2.
3. Confirmar que a curva F1 → F2 pode ser editada mesmo com F2 selecionado.
4. Arrastar o ponto/handle da curva.
5. Confirmar que F2 continua selecionado.
6. Confirmar que o preview usa a curva ajustada.

### Teste C — frame intermediário

1. Criar projeto com F1, F2 e F3.
2. Selecionar F2.
3. Confirmar que é possível editar F1 → F2.
4. Confirmar que é possível editar F2 → F3.
5. Confirmar que não há conflito de toque entre as duas curvas.
6. Confirmar que os dados de cada trecho continuam independentes.

### Teste D — último frame

1. Criar projeto com pelo menos 3 frames.
2. Selecionar o último frame.
3. Confirmar que a curva anterior pode ser editada.
4. Confirmar que não há tentativa de editar curva inexistente depois do último frame.
