# QA — v8z4b29Q

## Versionamento

- [x] Base inicial limpa confirmada como `v8z4b29P` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- [x] Versão final esperada: `v8z4b29Q`.
- [x] `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29Q`.

## Verificações estáticas realizadas

- [x] Formato usa Lucide `proportions`.
- [x] Top bar usa Lucide `clapperboard` explícito para Arquivos/Ajustes.
- [x] Menus com ícone + texto preservam ícone branco e label `#b2b2b2`.
- [x] Linha inferior mantém slots estáveis entre seleção simples e múltipla.
- [x] Painéis deslizantes de Pausa/Rotação/Escala/Mover substituem o contexto inferior normal e usam Linhas 3/4 com overflow visível.
- [x] Timeline ganhou respiro vertical para os marcadores laranja/amarelos centrais.
- [x] Frames da timeline usam medidas proporcionais para número, padding, borda e raio.
- [x] Foco/alfa do Stage usa `timelineFocalFrameId` durante scroll manual e preserva o bloqueio de scroll programático.
- [x] `Selecionar todos` mantém multi-select ativo, preserva seleção existente e completa todos os frames com evento isolado.
- [x] Menus contextuais de trecho com 2 ações ficam centralizados na lógica de slots.
- [x] Menu de curvas permanece no lugar do menu contextual do Stage, com ícones maiores/leves e sem pills individuais.
- [x] Handles de curva locais do frame focal e vizinhos conectados ficam editáveis sem ativar todos os frames.
- [x] Ícone `Tempo` da Coluna 1 usa o mesmo tamanho/stroke/base dos botões da Linha 4.
- [x] Bloco “Projeto em arquivo JSON” recebeu borda sutil.

## QA manual obrigatório pendente — iPhone/Safari

1. Abrir o app e confirmar versão visível `v8z4b29Q` no menu/Configurações.
2. Confirmar Formato = `proportions` e Ajustes/Arquivos = `clapperboard`.
3. Abrir Rotação, Escala, Mover e Pausa; confirmar sliders, botões e Reset sem corte/sobreposição.
4. Alternar seleção simples/múltipla; confirmar que os ícones não “pulam”.
5. Em seleção múltipla, tocar em “Selecionar todos”; confirmar todos os frames selecionados e modo multi-select ativo.
6. Rolar a timeline manualmente; confirmar alfa/foco acompanhando o frame central.
7. Confirmar marcadores laranja/amarelos inteiros, simétricos e sem encostar no frame ativo.
8. Selecionar F3 e editar handles/pontos conectados de F2/F3/F4; confirmar Undo/Redo.
9. Salvar/abrir JSON e confirmar borda visual do bloco JSON.
10. Regressão: seleção simples, seleção múltipla, seleção de trecho, scroll horizontal, Preview, MP4/export, JSON e Undo/Redo.

> Observação: iPhone/Safari real, Preview real e MP4/export real não foram executados neste ambiente automatizado.
