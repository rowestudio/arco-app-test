# QA Checklist

Use depois de qualquer alteração, mesmo pequena.

## Teste mínimo obrigatório

1. Abrir o app.
2. Carregar imagem.
3. Aplicar Template Circular.
4. Editar curva manualmente.
5. Confirmar que a curva não reseta.
6. Rodar Preview.
7. Gerar MP4.
8. Confirmar que o MP4 não tem trancos/kicks.
9. Alterar escala de um frame.
10. Alterar rotação de um frame.
11. Alterar easing.
12. Inserir pausa em frame.
13. Gerar MP4 novamente.
14. Testar no iPhone/Safari.

## Teste específico — Escala global

1. Carregar imagem.
2. Aplicar Template Circular.
3. Editar a curva manualmente.
4. Abrir ajuste de escala.
5. Ativar Global.
6. Alterar escala.
7. Confirmar que as curvas continuam no lugar.
8. Rodar Preview.
9. Gerar MP4.

## Teste específico — Fixar

1. Selecionar um frame.
2. Ativar Fixar.
3. Confirmar destaque vermelho.
4. Desativar Fixar.
5. Confirmar volta ao estado visual normal.

## v8z3w — Export stability diagnostics

- **Ambiente:** GitHub Pages com cache busting, iPhone/Safari.
- **Objetivo do teste:** verificar se o bug intermitente do MP4 sem imagem ainda ocorre.
- **Procedimento:** carregar imagem, editar frames, alterar escala, posição, rotação, easing/transição, alternar fundo preto/branco e gerar múltiplos MP4s.
- **Resultado:** nenhum MP4 saiu apenas com a cor de fundo.
- **Decisão de QA:** manter v8z3w como checkpoint provisório de estabilidade.
- **Plano de contingência:** v8z3x somente se o bug reaparecer.

## v8z4a — 30-frame capacity sprint

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4a — 30-frame capacity sprint**.
3. Carregar imagem.
4. Criar frames até chegar a 30.
5. Selecionar F1, frames intermediários e F30.
6. Mover/editar frames.
7. Remover alguns frames.
8. Adicionar novamente até validar estabilidade.
9. Rodar Preview.
10. Exportar MP4.
11. Salvar JSON.
12. Reabrir JSON.
13. Confirmar que projetos antigos com 2 a 8 frames continuam funcionando.
14. Testar no iPhone/Safari com GitHub Pages e cache busting.
