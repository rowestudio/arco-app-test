# QA — v8z4b29AM menu de curvas Global armado e bissetriz

## Escopo
- Base confirmada: `v8z4b29AL` já existe no app e em `docs/QA-v8z4b29AL.md`; portanto a v8z4b29AM parte da v8z4b29AL e preserva v8z4b29AF, v8z4b29AH, v8z4b29AK e v8z4b29AL.
- Área alterada: menu de curvas/pontos e reconstrução de handles cubic `curvesV2` por bissetriz.
- Áreas preservadas: timeline/menu inferior, `.fp`, `#pillsRow`, `.mid-pills`, snap-to-center, pontos laranja, menus deslizantes, Preview/export/MP4, JSON e posição/escala/rotação/duração/pausa dos frames.

## Checklist manual obrigatório
1. Abrir o app e confirmar versão visível `v8z4b29AM`.
2. Abrir o menu de curvas e confirmar que os quatro ícones principais estão levemente maiores, legíveis sem texto e com traço suave.
3. Confirmar que o Global aparece à direita, cinza/neutro por padrão, separado por divisor vertical discreto.
4. Tocar Global uma vez e confirmar que fica laranja; tocar novamente e confirmar que volta ao cinza.
5. Com Global armado, tocar Canto e confirmar que Canto é aplicado a todos os frames/pontos editáveis e o Global desarma.
6. Repetir com Simétrico, Assimétrico e Desconectado.
7. Confirmar que Undo desfaz cada aplicação global em um único passo e Redo reaplica em um único passo.
8. Tocar Canto/Simétrico/Assimétrico/Desconectado sem Global armado e confirmar que a aplicação local/seleção não fecha o menu.
9. Confirmar que o modo ativo fica destacado enquanto o menu permanece aberto.
10. Armar Global, fechar o menu e reabrir; confirmar que Global está cinza/desarmado.
11. Armar Global, tocar fora do menu e reabrir; confirmar que Global está cinza/desarmado.
12. Acionar “recriar curva suave” e confirmar que a curva fica suave/cinematográfica pela bissetriz sem mover frames.
13. Confirmar que a reconstrução suave não altera escala, rotação, posição, duração, pausa ou ordem dos frames.
14. Confirmar que Undo desfaz a reconstrução suave em um único passo e Redo reaplica em um único passo.
15. Confirmar que Preview continua funcionando.
16. Abrir e salvar JSON; confirmar que os dados continuam compatíveis e que não houve alteração de schema fora de `curvesV2` já existente.
17. Comparar timeline/menu inferior com v8z4b29AL e confirmar ausência de alteração visual.

## Verificações estáticas executadas
- Versionamento atualizado para `v8z4b29AM` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- Menu de curvas mantém os quatro modos sem texto, adiciona divisores, Global neutro/armável e ação de reconstrução suave.
- `rebuildSmoothCurvesByAngleBisector()` altera apenas handles `curvesV2.frameHandles.in/out`, com comprimentos proporcionais e clampados; não altera frames, rotação, escala, duração ou pausa.
