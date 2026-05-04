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

## v8z4b — Insert frame on existing curve

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b — Insert frame on existing curve**.
3. Carregar imagem.
4. Criar dois frames: F1 e F2.
5. Editar manualmente a curva entre F1 e F2.
6. Com F1 ativo, adicionar novo frame.
7. Confirmar que o novo F2 nasce dentro da curva.
8. Confirmar que o antigo F2 vira F3.
9. Confirmar que a curva não virou reta.
10. Confirmar que a curva visual foi preservada em dois trechos.
11. Mover o novo frame e confirmar que a edição continua funcionando.
12. Fazer undo e redo da inserção.
13. Rodar preview.
14. Exportar MP4.
15. Salvar JSON.
16. Reabrir JSON e confirmar que a curva permanece correta.
17. Repetir o teste com mais frames.
18. Repetir até perto do limite de 30 frames.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b1 — Preserve split curve after frame edit

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b1 — Preserve split curve after frame edit**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Editar a curva entre F1 e F2, deixando ela bem visível.
6. Inserir novo frame entre F1 e F2.
7. Confirmar que o novo F2 nasce sobre a curva.
8. Mover o novo F2.
9. Confirmar que a curva não vira reta.
10. Confirmar que os segmentos F1→F2 e F2→F3 continuam curvos.
11. Mover F1 e confirmar que a curva não reseta indevidamente.
12. Mover F3 e confirmar que a curva não reseta indevidamente.
13. Fazer undo/redo.
14. Rodar preview.
15. Exportar MP4.
16. Salvar JSON.
17. Reabrir JSON e confirmar que a curva continua correta.
18. Repetir com mais de 3 frames.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b2 — Restore curve/easing separation

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b2 — Restore curve/easing separation**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Definir easing/transição como Constante.
6. Mover a bolinha da curva para criar uma curva exagerada.
7. Confirmar que a velocidade temporal continua constante.
8. Trocar easing para Acelerar.
9. Mover a bolinha da curva.
10. Confirmar que o easing continua Acelerar, sem ser substituído pela curva.
11. Trocar easing para Desacelerar.
12. Mover a bolinha da curva.
13. Confirmar que o easing continua Desacelerar.
14. Trocar easing para Suavizar.
15. Mover a bolinha da curva.
16. Confirmar que o easing continua Suavizar.
17. Inserir frame dentro da curva.
18. Confirmar que o novo frame nasce na curva.
19. Mover o frame inserido.
20. Confirmar que a curva não vira reta.
21. Rodar preview.
22. Exportar MP4.
23. Salvar JSON.
24. Reabrir JSON.
25. Testar no iPhone/Safari via GitHub Pages com cache busting.

## v8z4b3 — Inserted frame pass-through easing

1. Abrir app.
2. Confirmar versão no menu: **Arco v8z4b3 — Inserted frame pass-through easing**.
3. Carregar imagem.
4. Criar F1 e F2.
5. Definir easing entre F1 e F2 como Constante.
6. Editar a curva.
7. Inserir novo frame.
8. Confirmar que o movimento passa pelo novo frame sem pausa/easing extra.
9. Repetir com Acelerar.
10. Repetir com Desacelerar.
11. Repetir com Suavizar.
12. Confirmar que o easing não é duplicado nos dois novos segmentos.
13. Confirmar que o frame inserido continua na curva.
14. Mover o frame inserido e confirmar que a curva não vira reta.
15. Rodar preview.
16. Exportar MP4.
17. Salvar JSON.
18. Reabrir JSON.
19. Testar no iPhone/Safari via GitHub Pages com cache busting.

