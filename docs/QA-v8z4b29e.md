# QA pendente — v8z4b29e correções visuais/UX da linha v29

## Confirmação de base e versionamento

- [x] Base `v8z4b29d` confirmada antes das alterações em `APP_VERSION`, `APP_VERSION_NAME`, texto visível do app e comentário/changelog do topo.
- [x] `APP_VERSION = v8z4b29e`.
- [x] `APP_VERSION_NAME = v8z4b29e`.
- [x] Versão visível do app atualizada para `v8z4b29e`.
- [x] Comentário/changelog do topo atualizado para `v8z4b29e`.

## A. Projeto novo / F1 assistido

- [x] Bloqueio global do modo assistido libera `topBar` e painel `Arquivos`.
- [x] Carregar imagem, carregar projeto, Templates, Reset e Recarregar permanecem acessíveis pelo topo/painel Arquivos.
- [x] Interior do ghost/F1 assistido fica transparente, sem fill azulado.
- [x] Overlay escuro externo é recortado pelo frame assistido.
- [x] Borda do ghost fica mais forte e com tracejado animado leve.
- [x] Menu “Posicione o frame” fica dentro do Stage, acompanha o ghost e é clampado para não cobrir a faixa de frames.
- [ ] Validar em iPhone/Safari real: abrir projeto novo, carregar imagem/projeto/templates e confirmar/cancelar F1.

## B. Zoom/Pan

- [x] `applyEditorZoom()` atualiza bordas, curvas/trechos, handles, dim overlay e ghost no mesmo ciclo visual.
- [x] Números/labels de frame deixam de ser compensados por `--ez-inv`, acompanhando melhor o frame/stage.
- [ ] Validar em iPhone/Safari real com pinch/pan e vários frames/trechos.

## C. Seleção de trecho

- [x] Trecho ativo em azul/ciano.
- [x] Trechos/caminhos não ativos em laranja contínuo e legível.
- [x] Frames inicial/final do trecho selecionado permanecem em foco e com overlay externo.
- [x] Caminho completo permanece visível; não há branco para caminhos inativos.
- [ ] Validar em imagem clara e imagem escura no iPhone/Safari real.

## C2. Seleção de frame

- [x] Ao selecionar frame intermediário, trecho anterior e seguinte entram no conjunto ativo ciano.
- [x] Demais trechos/caminhos ficam laranja contínuo e legível.
- [x] Primeiro/último frame destacam apenas o trecho sequencial existente.
- [ ] Validar alternância Frame/Trecho sem seleção dupla no iPhone/Safari real.

## D. Topbar

- [x] Bloco Visualização + Preview deslocado levemente à direita com `#topBtnMapa`.
- [x] Preview mantido destacado, compacto e mais retangular/quase quadrado.
- [x] Ícone Voltar/X recebe traço mais presente sem alterar lógica.
- [x] Altura da topbar preservada.
- [ ] Validar toque/visual em iPhone/Safari real.

## E. Sanidade geral

- [x] Motor de Preview/MP4/exportação não foi alterado.
- [x] Cálculo real de curvas/paths não foi alterado; mudanças são de renderização visual do editor.
- [x] Roadmap da área inferior registrado sem implementação estrutural.
- [ ] Validar Preview, MP4/export, Undo/Redo, Salvar/Carregar em iPhone/Safari real.
