# QA — v8z4b29g

## Escopo

Correções visuais/UX pontuais da linha v29: ícones pendentes do Menu/Arquivos, aparência do frame assistido, pausa da flutuação em interação e botões Confirmar/Cancelar fixos no Stage, sem alterar motor de Preview, MP4/exportação, cálculos reais de frames/curvas/paths ou schema JSON.

## Base confirmada

- Base inicial confirmada como `v8z4b29f` antes do patch via busca estática por `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- Versão final esperada: `v8z4b29g`.

## Checklist estático executado

- `index.html`: `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo apontam para `v8z4b29g`.
- `index.html`: Formato usa o símbolo `i-proportions` com SVG Lucide `proportions`.
- `index.html`: Templates usa o símbolo `i-tpl-play` atualizado para a silhueta aprovada de área superior + blocos inferiores (`layout-template`).
- `index.html`: Não limitar/Conter na imagem usa o símbolo `i-contain` atualizado para SVG Lucide `fullscreen`, sem crop/expand/maximize/scan.
- `index.html`: frame assistido não contém círculos brancos de canto, texto `Posicione o frame`, pill textual, caixa de texto ou fill interno colorido.
- `index.html`: frame assistido mantém borda branca tracejada, cantos arredondados, espessura chamativa, interior limpo e dim escuro externo.
- `index.html`: frame assistido ocioso recebe flutuação/rotação visual discreta em camada interna, sem alterar `ghostFrame.x/y/w/h/rotation`.
- `index.html`: `pointerdown`/`touchstart` no frame assistido, drag no Stage em modo de inserção e handle de escala/rotação pausam a flutuação imediatamente; `pointerup` agenda retorno suave após cerca de 950ms quando o ghost ainda está pendente.
- `index.html`: botões assistidos continuam círculos sem texto, X preto em laranja e check preto em ciano.
- `index.html`: `insertionActionBar` é anexado ao `stage`, não ao `stageContent`, ficando fora da camada transformada por pan/zoom e fixo no HUD do Stage.
- `ROADMAP.md`: próxima frente técnica de motor registrada sem implementar velocidade constante, escala, rotação ou movimento inteligente nesta versão.

## Checklist manual recomendado em iPhone/Safari

1. Abrir o app e confirmar versão visível `v8z4b29g`.
2. Abrir Menu/Arquivos e confirmar: Formato = `proportions`; Templates = área superior + blocos inferiores; Não limitar/Conter = `fullscreen`.
3. Iniciar projeto novo e validar frame assistido com borda branca tracejada, cantos arredondados, interior limpo, dim externo, sem texto/pill e sem círculos de canto.
4. Observar o frame assistido ocioso flutuando/girando discretamente sem prejudicar leitura da imagem.
5. Tocar e arrastar o frame assistido; confirmar pausa imediata da flutuação e precisão no dedo.
6. Soltar o frame; confirmar retorno da flutuação após atraso curto, sem flicker brusco.
7. Confirmar o frame; validar que o frame normal não flutua.
8. Validar que X cancela e check confirma; botões ficam fixos no rodapé do Stage, acima da faixa de frames, sem acompanhar pan/zoom/foto/frame/rotação.
9. Conferir sanidade geral: Menu, Imagem, Formato, Templates, Não limitar/Conter, Preview, MP4/export, Undo/Redo, Salvar/Abrir, Reset e Recarregar continuam acessíveis no fluxo aprovado.

## Limitações

- Testes reais em iPhone/Safari e geração real de MP4 não foram executados no ambiente automatizado.
