## v8z4b29O — menus, safe area, curvas e seleção múltipla

- `index.html`: base `v8z4b29N` confirmada antes das alterações e versionamento atualizado para `v8z4b29O` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: menus, top bar, painéis, safe area inferior e submenus passam a compartilhar `--menu-bg: #3c3c3b`, com ícones brancos e labels `#b2b2b2` nos menus afetados.
- `index.html`: menu contextual do Stage e menu de curvas usam cápsulas principais; o menu de curvas substitui o menu contextual no Stage e remove pills individuais dos ícones.
- `index.html`: timeline ganha respiro vertical, restaura os dois marcadores centrais e preserva tempos parciais discretos sem alterar lógica de scroll/seleção.
- `index.html`: frame central da timeline atualiza foco visual no Stage e o overlay escuro usa o frame focal em vez de depender apenas do clique direto.
- `index.html`: `Selecionar todos` mantém seleção múltipla ativa, isola o evento de toque e exibe texto antes do ícone.
- `QA.md` e `docs/QA-v8z4b29O.md`: checklist/inventário da v8z4b29O documentado.

## v8z4b29N — UX inferior, timeline e seleção múltipla

- `index.html`: base `v8z4b29m` confirmada antes das alterações e versionamento atualizado para `v8z4b29N` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: área inferior, Coluna 1/2, frames, trechos e textos secundários padronizados em `#3c3c3b`/`#b2b2b2`, com ícones brancos em botões com ícone + texto.
- `index.html`: timeline recebe frames mais estreitos, bordas cinza, trechos conectados com círculos maiores, pontos laranja fora do bloco dos frames e tempos parciais sem `s`.
- `index.html`: Linha 3 ganha respiro, `Selecionar todos` perde pill/fundo, mantém seleção múltipla ativa por evento isolado e lista frames apenas entre parênteses.
- `index.html`: curvas do Stage ficam acima do overlay escuro e o frame visualmente centralizado na timeline passa a destacar no Stage com seus trechos adjacentes sem alterar o motor.
- `QA.md` e `docs/QA-v8z4b29N.md`: checklist/inventário da v8z4b29N documentado.

## v8z4b29m — correção crítica inferior, scroll e menus contextuais

- `index.html`: base `v8z4b29L` confirmada antes das alterações e versionamento atualizado para `v8z4b29m` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: seleção de trecho deixa de aplicar foco visual azul/ciano nos frames do Stage; o trecho selecionado permanece indicado apenas na timeline e no contexto inferior.
- `index.html`: rolagem horizontal da timeline passa a ser comandada pela faixa de frames com inércia nativa, sem feedback de scroll da faixa de tempos, e com sincronização imediata de `scrollLeft` para manter tempos/trechos/frames alinhados.
- `index.html`: frame selecionado mantém centralização suave fora de seleção múltipla, com larguras compactas e compatíveis entre tempos, trechos e frames.
- `index.html`: ação `Selecionar todos` fica explícita, secundária em cinza claro, com texto antes do ícone e sem cor de destaque normal.
- `index.html`: painéis flutuantes de Duração e Movimento recebem tick/check de confirmação/fechamento sem alterar motor, Preview, MP4/export, JSON, curvas/easing ou cálculo de câmera.
- `index.html`: área inferior reduz ainda mais o espaço morto da safe area, ganha respiro entre linhas, bolinhas laranjas se afastam dos frames e a hierarquia de textos passa a diferenciar pausa (cinza), trecho (branco), frame (cinza) e quantidade de frames (mais escura).
- `QA.md` e `docs/QA-v8z4b29m.md`: checklist/inventário da v8z4b29m documentado.

## v8z4b29L — refinamento inferior, timeline e centralização suave

- `index.html`: base `v8z4b29K` confirmada antes das alterações e versionamento atualizado para `v8z4b29L` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: grade inferior mantém 2 colunas x 4 linhas, remove duplicação de safe area, reduz padding inferior real e redistribui a altura recuperada como respiro entre as linhas.
- `index.html`: Linha 3 fica mais discreta em tom secundário, sem subtítulo redundante, mantendo identificação compacta de frame, trecho ou seleção múltipla.
- `index.html`: frames da timeline ficam menos largos e trechos ficam mais estreitos/conectados, com larguras sincronizadas entre Linha 1 de tempos e Linha 2 de frames.
- `index.html`: centralização do frame selecionado passa a usar `scrollTo(..., behavior: 'smooth')` nas faixas de tempos e frames, preservando bloqueio durante seleção múltipla.
- `QA.md` e `docs/QA-v8z4b29L.md`: checklist/inventário da v8z4b29L documentado.

## v8z4b29K — base inferior compacta e submenus na Linha 4

- `index.html`: base `v8z4b29J` confirmada antes das alterações e versionamento atualizado para `v8z4b29K` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: submenus locais de Pausa, Rotação, Escala e Mover passam a ocupar o slot contextual da Linha 4 / Coluna 2, substituindo os ícones sem criar novo bloco vertical nem empurrar timeline, Coluna 1 ou Stage.
- `index.html`: Coluna 1 recebe padding compacto, botão `+ frame` volta a ser circular real em `var(--accent)` e tipografia da área inferior fica mais consistente.
- `index.html`: timeline reduz gaps, conecta visualmente frames e trechos, engrossa bordas dos frames, deixa trechos mais discretos e usa `var(--accent)` para frame ativo/selecionado.
- `index.html`: espaço morto inferior dos menus contextuais é reduzido ao encaixar painéis no mesmo slot da Linha 4, preservando apenas a safe area da grade inferior.
- `index.html`: Linha 3 remove o subtítulo redundante `Frame ativo` e mostra seleção ativa/múltipla de forma compacta.
- `QA.md` e `docs/QA-v8z4b29K.md`: checklist/inventário da v8z4b29K documentado.

## v8z4b29J — área inferior proporcional e pausa distinta

- `index.html`: base `v8z4b29I` confirmada antes das alterações e versionamento atualizado para `v8z4b29J` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: área inferior mantém 2 colunas e 4 linhas, amplia a Coluna 1, remove padding inferior morto e redistribui a altura útil para tempo total, botão `+`, total de frames e controle global `Tempo`.
- `index.html`: Linha 1 e Linha 2 passam a usar larguras equivalentes para pausas/frames e trechos/conexões, com sincronização imediata de `scrollLeft` para evitar atraso visual entre tempos e timeline.
- `index.html`: frames ganham blocos maiores e trechos viram conexões menores com bolinhas, mantendo hit area invisível sem deixar o trecho mais importante que o frame.
- `index.html`: frame ativo clicado/adicionado é recentralizado na faixa, com bloqueio de recentralização durante seleção múltipla.
- `index.html`: ícone de Pausa de frame trocado para `i-frame-pause` (círculo com barras), separado dos ícones de Tempo/Duração, com label `Pausa` preservado.
- `QA.md` e `docs/QA-v8z4b29J.md`: checklist/inventário da v8z4b29J documentado.

## v8z4b29I — estrutura inferior alinhada sem sobreposição

- `index.html`: base `v8z4b29H` confirmada antes das alterações e versionamento atualizado para `v8z4b29I` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: área inferior mantém o mesmo slot/altura e passa a usar grade real de 2 colunas por 4 linhas, com Coluna 1 estreita/global e Coluna 2 flexível, `overflow` vertical bloqueado e Duração geral fixa na Linha 4.
- `index.html`: botão `+ frame` fica sempre no slot global da Linha 2, mais forte, em pill `var(--accent)`, sem troca por seleção múltipla.
- `index.html`: tempos parciais da Linha 1 e faixa de frames/trechos da Linha 2 têm larguras compatíveis e sincronização horizontal de scroll, sem edição direta de pausa/duração.
- `index.html`: frames aparecem como blocos numerados; trechos aparecem como conexões com bolinhas nas extremidades, hit area horizontal preservada e marcadores centrais laranja adicionados à faixa.
- `index.html`: seleção múltipla deixa de ser overlay sobre a base inferior; suas ações ocupam a Linha 3 / Coluna 2 e a Linha 4 / Coluna 2, sem cobrir a Coluna 1 nem a Duração geral.
- `index.html`: labels dos ícones contextuais inferiores voltam a aparecer abaixo dos ícones, com scroll horizontal permitido apenas na Linha 4 / Coluna 2.
- `QA.md` e `docs/QA-v8z4b29I.md`: checklist/inventário da v8z4b29I documentado.

## v8z4b29H — base inferior em 2 colunas e 4 faixas

- `index.html`: base `v8z4b29G` confirmada antes das alterações e versionamento atualizado para `v8z4b29H` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: área inferior reorganizada estruturalmente em 2 colunas e 4 faixas no mesmo slot inferior, com Coluna 1 estreita/global e Coluna 2 flexível para tempos, frames/trechos, estado ativo e ícones contextuais.
- `index.html`: botão `+ frame` passa a usar pill com `var(--accent)` e troca no mesmo slot para selecionar todos durante seleção múltipla, sem criar botão extra na faixa de seleção.
- `index.html`: Linha 1 passa a renderizar tempos parciais informativos de pausas e trechos usando os valores existentes, sem edição direta nem alteração de cálculo.
- `index.html`: confirmação do frame assistido usa o azul/ciano oficial `var(--accent)`; cancelamento permanece laranja.
- `index.html`: flutuação do frame assistido passa a ser oval/discreta sem rotação e sem escala, mantendo pausa ao toque/drag e retorno suave existente.
- `QA.md` e `docs/QA-v8z4b29H.md`: checklist/inventário da v8z4b29H documentado.

## v8z4b29g — ícones pendentes e frame assistido flutuante

- `index.html`: base `v8z4b29f` confirmada antes das alterações e versionamento atualizado para `v8z4b29g` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: Menu/Arquivos mantém layout da v29f e corrige apenas ícones pendentes: Formato com Lucide `proportions`, Templates com silhueta `layout-template` e Não limitar/Conter na imagem com Lucide `fullscreen`.
- `index.html`: frame assistido remove os círculos brancos de canto ainda não funcionais, mantém borda branca tracejada/cantos arredondados/dim externo/interior limpo e ganha flutuação visual sutil que pausa ao toque/drag/handle e retorna após atraso curto.
- `index.html`: botões Confirmar/Cancelar do frame assistido passam a ser HUD fixo do Stage, centralizado no rodapé visível, fora da camada transformada por pan/zoom e sem acompanhar foto/frame/rotação.
- `ROADMAP.md`: registrada a próxima frente pós-v8z4b29g para revisão de motor: velocidade constante, escala, rotação e movimento inteligente, sem implementação nesta versão.
- `QA.md` e `docs/QA-v8z4b29g.md`: checklist/inventário da correção v8z4b29g documentado.

## v8z4b29f — menu, frame assistido e estados visuais da linha v29

- `index.html`: base `v8z4b29e` confirmada antes das alterações e versionamento atualizado para `v8z4b29f` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: painel Menu/Arquivos reorganizado em 3 colunas na ordem obrigatória: Imagem, Formato, Templates; Fundo, Não limitar, Reset; divisor; Salvar, Abrir, Recarregar; bloco JSON inferior separado com documento `{}`.
- `index.html`: ícones do Menu/Arquivos ajustados para foto/imagem, `proportions`, template/layout, paleta, contain livre, `timer-reset`/reset, download/salvar, pasta aberta, recarregar e documento JSON.
- `index.html`: frame assistido fica sem texto/pill/fill interno, com borda branca tracejada animada, quatro cantos circulares brancos, dim externo e botões circulares X laranja/check ciano.
- `index.html`: botões do frame assistido acompanham rotação sem escalar visualmente, mantêm toque confortável e usam fallback com histerese simples no rodapé do Stage quando não cabem no frame.
- `index.html`: Menu/Arquivos, imagem, projeto, Templates, Fundo/Formato/Não limitar/Reset/Recarregar permanecem acessíveis durante F1 assistido, preservando bloqueios de edição dependente de frame confirmado.
- `index.html`: zoom/pan continua forçando atualização visual imediata dos overlays, e seleção de frame/trecho mantém caminhos completos em ciano/laranja legíveis.
- `index.html`: topbar ajustada para deslocar Visualização/Preview levemente à direita, Preview mais retangular e X mais evidente sem aumentar altura.
- `ROADMAP.md`: roadmap inferior re-registrado para v8z4b29f sem implementar nova arquitetura/faixas.
- `QA.md` e `docs/QA-v8z4b29f.md`: checklist/inventário da correção v8z4b29f documentado.

## v8z4b29e — correções assistidas, zoom e caminhos da linha v29

- `index.html`: versionamento atualizado para `v8z4b29e` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo, com base `v8z4b29d` confirmada antes das alterações.
- `index.html`: modo F1 assistido mantém topo/Arquivos navegáveis e libera carregar imagem, carregar projeto, Templates, Reset e Recarregar, bloqueando apenas edição dependente de frame confirmado.
- `index.html`: frame assistido remove fill azulado interno, usa dim externo recortado, borda tracejada mais forte/animada e confirmação ancorada/clampada dentro do Stage.
- `index.html`: zoom/pan atualiza imediatamente bordas, curvas/trechos, handles, dim overlay e ghost no mesmo ciclo visual, sem alterar coordenadas reais, JSON, Preview, MP4 ou exportação.
- `index.html`: números/labels visuais de frame deixam de compensar o zoom para acompanhar melhor o frame/stage, preservando controles tocáveis com compensação quando necessário.
- `index.html`: seleção de trecho e seleção de frame mantêm caminho completo visível; trechos ativos ficam em azul/ciano e trechos não ativos em laranja contínuo/legível.
- `index.html`: topbar recebe ajuste fino no bloco Visualização/Preview e no X, sem aumentar altura nem reorganizar a faixa superior.
- `ROADMAP.md`: registrada direção futura da área inferior em quatro faixas sem implementação nesta versão.
- `QA.md` e `docs/QA-v8z4b29e.md`: checklist/inventário da correção v8z4b29e documentado.

## v8z4b29d — correções visuais/UX da linha v29

- `index.html`: versionamento atualizado para `v8z4b29d` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: painel Arquivos ajustado para grade de 2 colunas no bloco Criação, preservando blocos com 3 colunas quando têm itens reais.
- `index.html`: ícones do painel Arquivos atualizados para Templates (`layout-panel-top`), Formato (`proportions`) e Reset (`timer-reset`), mantendo labels/funções/cores.
- `index.html`: seleção visual Frame/Trecho reforçada para limpar destaque de trecho ao voltar ao frame e destacar o trecho ativo em ciano no Stage/faixa.
- `index.html`: frame assistido inicial ganhou preenchimento translúcido, borda pontilhada mais forte e pulsação leve, removidos automaticamente com o fim do modo ghost.
- `index.html`: menus inferiores de Frame/Trecho padronizados com ícones menores, distribuição estável e label visual `Tempo` para evitar encavalar.
- `QA.md` e `docs/QA-v8z4b29d.md`: checklist/inventário da correção v8z4b29d documentado.

## v8z4b29c — refinar topo, Arquivos e seleção frame/trecho

- `index.html`: versionamento atualizado para `v8z4b29c` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: faixa superior mantém Voltar, Arquivos, Visualizar, Preview, Undo e Redo somente com ícones visíveis; Preview ganhou pill destacada e espaçamentos foram adicionados após Voltar e Arquivos.
- `index.html`: painel Arquivos reorganizado em grade compacta por blocos de criação, projeto, aparência e manutenção, com botão de fechar visível e altura máxima segura.
- `index.html`: Duração usa `clipboard-clock` sem estado/valor no botão, Formato usa `proportions` e Deletar frame usa `trash` no menu contextual do Stage.
- `index.html`: seleção visual de frame/trecho ficou exclusiva, limpando destaque conflitante e escondendo o menu contextual de frame ao selecionar trecho.
- `QA.md` e `docs/QA-v8z4b29c.md`: checklist/inventário da correção v8z4b29c documentado.

## v8z4b29b — corrigir hierarquia dos menus contextuais

- `index.html`: versionamento atualizado para `v8z4b29b` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: Curva removida da faixa superior; topo permanece com Voltar, Arquivos, Visualizar, Preview, Undo e Redo.
- `index.html`: menu contextual de frame movido para dentro do Stage, na parte inferior do Stage, em um único contêiner para Deletar, Fixar/Desfixar e Curva; os três botões chamam as funções existentes e escondem o menu antes da ação.
- `index.html`: Fundo, Inverter e Formato removidos do menu inferior e movidos para Arquivos/faixa superior, mantendo as funções existentes.
- `index.html`: menu inferior fica apenas com os contextos Frame e Trecho; Frame é o padrão quando nada está selecionado; Tempo do trecho e Movimento continuam chamando o mesmo painel atual de trecho/easing.
- `index.html`: faixa de frames/trechos mantém os trechos intermediários visíveis e clicáveis no contexto Frame, com o botão `+` preservado à esquerda.
- Preservados fora do escopo: motor, Preview, Export/MP4, WebCodecs, JSON estrutural, cálculos de duração/pausas/trecho, curvas/easing como motor, zoom/pan, seleção múltipla, inserção assistida e Undo/Redo.
- `QA.md` e `docs/QA-v8z4b29b.md`: checklist/inventário da correção v8z4b29b documentado.

## v8z4b29a — reorganizar menus contextuais da interface

- `index.html`: versionamento atualizado para `v8z4b29a` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: topo reorganizado para Voltar, Arquivos, Visualizar, Preview, Undo e Redo, preservando as chamadas existentes de Visualizar/Preview/Undo/Redo.
- `index.html`: botão Arquivos abre o painel existente de projeto, com acessos preservados para Templates, Imagem, Fundo, Conter, Salvar, Abrir/Carregar projeto, Reset e Recarregar.
- `index.html`: botão `+` fica fixo à esquerda da faixa de frames/trechos e continua chamando a inserção assistida existente.
- `index.html`: toolbar inferior passa a ser contextual para geral/frame/trecho, mantendo Duração sempre disponível, Pausa/Rotação/Escala/Mover no contexto Frame e Tempo do trecho/Movimento no contexto Trecho.
- `index.html`: menu contextual de frame no Stage criado para Deletar, Fixar/Desfixar e Editar Curva/Ponto, chamando as funções existentes.
- `index.html`: clique direto no trecho agora seleciona o trecho e muda o contexto inferior; Tempo do trecho e Movimento abrem o painel atual de trecho/easing.
- Motor de Preview/Export/MP4, JSON, cálculos de tempo, curvas, easing, zoom/pan, seleção múltipla e inserção assistida não foram alterados funcionalmente.
- `QA.md` e `docs/QA-v8z4b29a.md`: checklist/inventário da transição v8z4b29a documentado.

## v8z4b28f — otimizar Preview com proxy e duração computada

- `index.html`: versionamento atualizado para `v8z4b28f` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionada fonte `previewRenderSource` cacheada apenas para Preview, com limite conservador de lado maior e fallback para `canonicalRenderImage` quando necessário.
- `index.html`: `renderFrameSafely`/`drawAtT` aceitam fonte de render opcional para o Preview, mantendo Export/MP4 sem proxy e usando a fonte canônica/original.
- `index.html`: criada `getComputedTimelineDuration()` e aplicada no Preview e no Export para evitar divergência entre `duration` salvo/stale e timeline calculada com segmentos, pausas e loop.
- `index.html`: loops de Preview ficam time-based com token anti-rAF antigo, throttle leve de ~30 fps e logs técnicos sob `DEBUG_PREVIEW_PERF = false`.
- Preservados fora do escopo: UI/UX, JSON salvo, imagem original, qualidade/resolução do MP4, WebCodecs, VideoEncoder, VideoFrame e muxer.
- `QA.md` e `docs/QA-v8z4b28f.md`: checklist de QA criado/atualizado, incluindo arquivo grande `arco_diagramacao_i_ah8_c10_img 28e.json`, duração computada, proxy de Preview, MP4 e iPhone/Safari real.

## v8z4b28e — otimizar Preview sem alterar Export

- `index.html`: versionamento atualizado para `v8z4b28e` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: `renderFrameSafely` passa os diagnósticos já calculados para `drawAtT`, mantendo compatibilidade com chamadas sem diagnósticos e evitando segunda chamada normal a `buildRenderDiagnostics` por frame.
- `index.html`: loops de Preview em `startPreview` e retomada de `togglePreviewPlayback` cacheiam `previewTimelineFill` fora do `requestAnimationFrame` e retornam imediatamente quando `isPreviewing` está desligado.
- `index.html`: `getRenderStateAtTime` só monta o payload de `[RenderState]` quando `DEBUG_RENDER_EXPORT` está ativo.
- Preservados fora do escopo: UI, qualidade visual, JSON, curvas/easing/timing, WebCodecs, VideoEncoder, VideoFrame, muxer, fallback universal e motor de Export/MP4 da v8z4b28d.

## v8z4b28d — estabilizar motor universal de Preview/MP4

- `index.html`: versionamento atualizado para `v8z4b28d` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionada validação universal de estado/câmera por tempo via `getRenderStateAtTime`, com status de pausa, loop, trecho, escala, rotação e validade antes do render.
- `index.html`: `buildRenderDiagnostics`, `drawAtT`, `drawAtTDirect` e o novo `renderFrameSafely` passam a validar canvas, fonte canônica, source rect, transform e frame em cada render, acionando fallback universal sem thumbnail/downscale quando o quadro é inválido ou preto.
- `index.html`: Preview usa render seguro por frame e mantém canvas/controles ativos em caso de erro, evitando tela preta permanente e fechamento espontâneo.
- `index.html`: Export/MP4 e fallback MediaRecorder só entregam frames renderizados e canvas válidos; criação de `VideoFrame`, timestamps, snapshot `ImageBitmap`, encode, fechamento e erros do encoder passam a ser tratados por frame.
- `index.html`: adicionados `cleanupExportSession`, logs técnicos `[RenderState]`, `[RenderValidationError]`, `[ExportFrameError]`, `[EncoderError]` e `[ExportCleanup]` sob `DEBUG_RENDER_EXPORT`, preservando a nitidez/fonte canônica conquistada nas versões v8z4b28a/v8z4b28b/v8z4b28c.
- `QA.md` e `docs/QA-v8z4b28d.md`: checklist de QA da versão criado/atualizado, com zoom extremo, pausa, loop, rotação, HEIC/JPG/PNG, JSON com imagem e erro controlado.

## v8z4b28c — corrigir pipeline HEIC e fonte de render

- `index.html`: versionamento atualizado para `v8z4b28c` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionada fonte canônica de render (`canonicalRenderImage`) recriada ao carregar imagem direta ou `imageBase64`, preservando o elemento decodificado em orientação visual do browser sem reamostrar/downscale global.
- `index.html`: Preview, Export/MP4, fallback direto e fundo espelhado passam a desenhar a partir da fonte canônica, mantendo o canvas final de vídeo fixo e sem usar thumbnail/canvas reduzido como fonte principal.
- `index.html`: diagnóstico interno `debugImagePipeline(label)` registra fonte real, MIME, origem upload/JSON, dimensões naturais/canônicas, canvases de Preview/Export, DPR e fallback quando ativado via `window._arcoDebugImagePipeline`.
- `index.html`: validação de export passa a exigir fonte canônica disponível, e erros por frame registram `[ExportError]` com frame, tempo, trecho, source rect, transform, fonte canônica e output.
- `QA.md` e `docs/QA-v8z4b28c.md`: checklist de QA da versão criado/atualizado, incluindo pendência do caso real quando o arquivo `arco_5537 28b2_img.json` não está presente no repositório de teste.

## v8z4b28b — estabilizar render em zoom extremo

- `index.html`: versionamento atualizado para `v8z4b28b` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- `index.html`: adicionados limites internos de canvas/zoom e validação defensiva de source rect, transform, output e imagem antes do render.
- `index.html`: Preview limita backing store por orçamento de pixels; Export/MP4 mantém canvas final fixo e desenha direto da imagem original.
- `index.html`: fallback seguro para zoom extremo registra `[RenderFallback]` e evita canvas/buffer gigante proporcional ao zoom.
- `index.html`: loop WebCodecs/MediaRecorder captura falha por frame e o cleanup de erro mantém o Preview aberto em estado controlado.
- `QA.md` e `docs/QA-v8z4b28b.md`: checklist de QA da versão criado/atualizado.

## v8z4b28a — auditar resolução e qualidade de render

- `index.html`: versionamento atualizado para `v8z4b28a` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário/changelog do topo.
- Preview: escala interna volta a renderizar no tamanho final seguro de `exportDims`, mantendo `imageSmoothingEnabled` e `imageSmoothingQuality = "high"` nos contextos usados e evitando ampliar um canvas de meia resolução.
- MP4/Export: canvas de export permanece no tamanho final real do vídeo, sem `devicePixelRatio`, com qualidade de smoothing reaplicada após resets de canvas e desenho direto da fonte `imgEl` original.
- Imagem original/JSON: a sessão mantém o data URL original carregado; salvar/carregar projeto com imagem não reamostra por canvas intermediário nem reduz para 2560 px antes de render posterior.
- Diagnóstico interno: adicionadas `analyzeFrameResolutionQuality(...)` e `window.analyzeProjectResolutionQuality(...)` para estimar pixels disponíveis por frame, razão de qualidade e status `OK`/`LIMITE`/`BAIXA`/`ACIMA_DO_LIMITE` via `console.table` somente quando chamado manualmente.
- QA manual recomendado: usar imagem grande com textura fina, criar zoom leve/médio/forte, comparar Preview e MP4 e confirmar se a perda restante corresponde ao limite real do arquivo original.
- Preservados fora do escopo: interface, ícones do submenu Alinhar, seleção múltipla, curvas/easing/timing, JSON estrutural, zoom/pan do Stage, ghost frame e fluxo de Preview/MP4.

## v8z4b27i — corrigir referência multi-select, reset de rotação e faixa rolável

- `index.html`: versionamento atualizado para `v8z4b27i` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário do topo.
- Menu multi-select: faixa rolável passa a reservar largura maior para `Selecionar todos`, evitando que a primeira ação (`Pausa`) nasça cortada sob a coluna fixa.
- Painéis multi-select: Pausa, Escala e Rotação passam a usar o primeiro frame da seleção atual como referência; `Selecionar todos` insere o frame ativo como primeira referência; sliders mostram valor absoluto da referência e aplicam delta relativo aos demais frames.
- Rotação individual: abertura/reabertura do painel e `Reset` ressincronizam slider, texto, fill ciano e Stage pela mesma rotina central de UI.
- Badges de frames: renderização completa atualiza o número exibido em cada frame a cada `renderAll()`, evitando rótulos stale após inserção/renumeração.
- Mantidos fora do escopo: motor, `getStateAtT`, `drawAtT`, Preview, MP4/WebCodecs, JSON, curvas, zoom/pan e ghost frame.

## v8z4b27h — corrigir sliders delta, ícones e alinhamento multi-select

- `index.html`: versionamento atualizado para `v8z4b27h` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentário do topo.
- Rotação/Escala multi-select: sliders passam a representar delta relativo a um snapshot capturado ao abrir/arrastar o painel; `input` aplica o delta ao vivo no Stage com renderização via `requestAnimationFrame`; `change`/`pointerup`/fechamento consolidam um único Undo.
- `Selecionar todos`: botão separado da faixa rolável em coluna fixa sem caixa/borda/radius, usando o fundo da barra como máscara; a faixa de ações reseta `scrollLeft = 0` ao fechar, sair ou reabrir.
- Ícones: Distribuir troca para `align-horizontal-distribute-center`/`align-vertical-distribute-center`; Mover e Alinhar usam botões apenas com ícones Lucide via sprite interno.
- Alinhar/Distribuir: ações usam bounds visuais transformados dos frames selecionados, considerando posição, tamanho, escala efetiva e rotação; Distribuir continua bloqueado com menos de 3 frames.
- Mantidos fora do escopo: motor, `getStateAtT`, `drawAtT`, Preview, MP4/WebCodecs, JSON, curvas, zoom/pan e inserção assistida/ghost frame.

## v8z4b27g — corrigir padronização real dos menus multi-select

- `index.html`: versionamento atualizado para `v8z4b27g` em constantes, texto visível e comentário do topo.
- Menu de seleção múltipla: ordem espelhada do menu individual aprovado (`Pausa`, `Rotação`, `Escala`, `Mover`) antes de `Alinhar` e `Distribuir`, mantendo `Selecionar todos` fixo à esquerda e a faixa rolável horizontal.
- Design system multi-select: `Selecionar todos` perde caixa/fundo/borda e passa a usar símbolo Lucide `list-check`; `Alinhar` usa `align-end-horizontal`; `Distribuir` usa símbolos de space-between; subações deixam de usar SVG inline improvisado quando há símbolo equivalente.
- Painéis multi-select: Pausa, Rotação e Escala passam a ocupar o slot do submenu com estrutura de slider + valor + chips textuais, seguindo o padrão real do `custBarContent`; `Reset` e `Igualar` permanecem textuais.
- Preservados: seleção temporária de UI fora do JSON/Undo de projeto, lógica de atuação somente nos frames selecionados, Preview, MP4, JSON, curvas, zoom/pan e motor de animação.

## v8z4b27f — ajustar painéis, ícones e menu rolável de frames selecionados

- `index.html`: versionamento atualizado para `v8z4b27f` em constantes, texto visível e comentário do topo.
- Painel Pausa: layout vertical do submenu ajustado para seguir o padrão dos demais painéis, com slider, valor textual e Voltar visíveis, sem reintroduzir `Zerar`, `Definir pausa`, OK ou Cancelar.
- Undo/Redo com painel aberto: sessão de Pausa aberta é cancelada antes da restauração de estado e o submenu ativo é ressincronizado depois do render, evitando valor antigo no slider/texto e evitando reaplicação ao fechar.
- Ícones: `Pausa` no menu principal usa relógio/tempo, `Selecionar todos` usa `list-check`, `Alinhar`/`Distribuir` usam pictogramas de objetos/frames, e `Zerar` nos submenus de Escala/Rotação usa o símbolo oficial `i-reset`.
- Menu principal de frames selecionados: reorganizado como `Selecionar todos` fixo à esquerda + ações em faixa horizontal rolável, com áreas de toque confortáveis e proteção contra seleção/callout nativos em iPhone/Safari.
- `Posição` virou `Mover`; `Alinhar` e `Distribuir` foram expostos no menu principal rolável, com `Distribuir` desabilitado para menos de 3 frames.
- Preservado da v8z4b27e: seleção múltipla como estado temporário de UI, destaque aprovado, ações em lote com Undo, Preview/MP4/JSON, curvas, zoom/pan e motor de animação sem alterações estruturais.
- Fora do escopo: transformação direta de grupo no Stage, UI v8z5, botão OK/Cancelar, adicionar/subtrair pausa, Undo/Redo de troca de imagem, loop ping-pong e velocidade constante perceptiva.
- `docs/QA-v8z4b27f.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27f no repositório de teste.

## v8z4b27e — corrigir menu contextual, primeiro selecionado, Pausa e Undo de Conter

- `index.html`: versionamento atualizado para `v8z4b27e` em constantes, texto visível e comentário do topo.
- Menu contextual principal: removidos o botão `Voltar` e o texto redundante do alvo; `Selecionar todos` foi reposicionado à esquerda e mantém o menu aberto após selecionar todos os frames.
- Seleção contextual: `selectedFrames.size >= 1` passa a acionar o visual de selecionado no Stage e na faixa, fazendo o primeiro frame selecionado aparecer em laranja.
- Painel Pausa: removido o botão `Zerar`, preservando título, texto do alvo, slider decimal e Undo consolidado ao fechar/sair do painel.
- Conter na imagem: `containFrames` agora participa de `captureState()`/`restoreState()`, permitindo Undo/Redo restaurar também o estado interno de contenção; carregamento de JSON e Reset de projeto novo limpam o flag temporário.
- Preservado da v8z4b27d: seleção como estado temporário de UI, overlay externo múltiplo, ausência do botão `Sel`, cor de fundo no Undo/JSON e slider direto de Pausa.
- Fora do escopo preservado: não houve alterações em `getStateAtT`, `drawAtT`, WebCodecs/export estrutural, curvas, zoom/pan, inserção assistida, transformação direta de grupo ou JSON estrutural.
- `docs/QA-v8z4b27e.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27e no repositório de teste.

## v8z4b27d — simplificar Pausa contextual, menu com 1 frame e Undo da cor

- `index.html`: versionamento atualizado para `v8z4b27d` em constantes, texto visível e comentário do topo.
- Painel Pausa: removido o botão grande `Definir pausa`; o slider passa a aplicar diretamente o valor decimal aos frames-alvo da seleção aberta, mantendo apenas `Zerar` como ação secundária.
- Undo da Pausa: edição do slider e do `Zerar` passa a ser consolidada em uma sessão única, registrada somente ao fechar/sair do painel quando houver diferença entre estado inicial e final.
- Menu contextual: `#alignBar` passa a aparecer com 1 frame selecionado, mantém os grupos Pausa, Escala, Rotação e Posição e adiciona `Selecionar todos` sem persistir seleção no JSON.
- Cor de fundo: `bgColor` passa a entrar em `captureState()`/`restoreState()`, no baseline de Reset e no JSON, com Undo/Redo para swatches e consolidação no fechamento/`change` dos campos de cor.
- Overlay normal: alfa do overlay escuro do frame ativo reduzido de `rgba(0,0,0,0.52)` para `rgba(0,0,0,0.38)`; overlay múltiplo preservado em `rgba(0,0,0,0.34)`.
- Fora do escopo preservado: não houve alterações em `getStateAtT`, `drawAtT`, WebCodecs/export estrutural, curvas, zoom/pan, inserção assistida ou JSON estrutural além de preservar a cor real existente.
- `docs/QA-v8z4b27d.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27d e itens futuros registrados sem implementação.

## v8z4b27c — simplificar Pausa em seleção múltipla

- `index.html`: versionamento atualizado para `v8z4b27c`.
- Correção de UX: painel Pausa da seleção múltipla passa a mostrar o contexto dos frames afetados (`F1, F2 selecionados` ou contagem quando a seleção é longa).
- Remoção de redundâncias: removidos do painel o botão `Igualar ao ativo` e o texto/botão grande `Aplicar aos selecionados`.
- Definir pausa: ação principal renomeada para `Definir pausa`, definindo o valor decimal do slider apenas nos frames selecionados editáveis, com seleção múltipla preservada e Undo único.
- Reset/Zerar: `Zerar` permanece como ação secundária pequena, zerando apenas os frames selecionados com Undo único.
- Adicionar pausa: não implementado nesta versão; fica registrado como próximo passo para fluxo separado, sem misturar com `Definir pausa`.
- Fora do escopo: Subtrair, Igualar ao ativo, escala, rotação, posição, alinhamento/distribuição, overlay externo, curvas, Preview, MP4 e JSON estrutural.
- `docs/QA-v8z4b27c.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27c no repositório de teste.

## v8z4b27b — corrigir Pausa em lote sem incrementos fixos

- `index.html`: versionamento atualizado para `v8z4b27b`.
- Correção de UX: submenu Pausa da seleção múltipla deixa de oferecer atalhos rígidos `+0.5s`/`-0.5s`.
- Pausa em lote: painel passa a usar slider decimal com os mesmos limites e passo do controle real de pausa (`FRAME_PAUSE_MIN`, `FRAME_PAUSE_MAX`, `FRAME_PAUSE_STEP`).
- Aplicar aos selecionados: define a pausa escolhida apenas nos frames selecionados editáveis, preservando a seleção múltipla ativa e registrando um único Undo.
- Zerar e Igualar ao ativo permanecem como ações secundárias de lote, também com Undo único.
- Fora do escopo: Adicionar/Subtrair pausa em lote, lógica proporcional, escala, rotação, posição, alinhamento, distribuição, curvas, Preview, MP4 e JSON estrutural.
- `docs/QA-v8z4b27b.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27b no repositório de teste.

## v8z4b27a — expandir menu de seleção múltipla com ações em lote

- `index.html`: versionamento atualizado para `v8z4b27a`.
- Nova função: menu próprio de seleção múltipla passa a ter 4 grupos principais: Pausa, Escala, Rotação e Posição.
- Pausa: `+0.5s`, `-0.5s`, zerar e igualar ao frame ativo para os frames selecionados.
- Escala: `+5%` relativo, `-5%` relativo, igualar ao frame ativo e reset para a escala base existente (`baseFrameW`).
- Rotação: `+5°`, `-5°`, igualar ao frame ativo e zerar rotação.
- Posição: movimento relativo em 4 direções, alinhamento por referência no frame ativo e distribuição horizontal/vertical em ordem de frames.
- Undo/Redo: cada ação em lote registra um único snapshot antes da alteração; seleção múltipla, overlay e frames não selecionados são preservados.
- Preservado: menu próprio de seleção múltipla, ausência do botão `Sel`, overlay externo múltiplo, caminho/curva, JSON sem persistir seleção, Preview/MP4 sem UI de seleção.
- `docs/QA-v8z4b27a.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b27a no repositório de teste.

## v8z4b26g — remover laranja interno e corrigir overlay da seleção múltipla

- `index.html`: versionamento atualizado para `v8z4b26g`; seleção múltipla deixa de aplicar qualquer fill/luz laranja interna em `.frame-dim`.
- `index.html`: `renderAll()` mantém borda laranja dos frames selecionados, substitui o inset/tingimento por halo externo discreto e preserva a moldura normal dos não selecionados.
- `index.html`: `updateDimOverlay()` passa a exibir overlay escuro externo durante seleção múltipla usando máscara SVG com recortes para todos os frames selecionados, reaproveitando `getRotatedFrameCorners()` para respeitar posição e rotação.
- `index.html`: `drawBezier()` e geometria das curvas não foram alterados; a camada de caminho permanece acima/compatível com o overlay e abaixo das molduras.
- `docs/QA-v8z4b26g.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: ponteiro de QA/status atualizado para v8z4b26g no repositório de teste.

## v8z4b26f — corrigir luz, moldura e caminhos na seleção múltipla

- `index.html`: versionamento atualizado para `v8z4b26f`; seleção múltipla deixa de acionar foco ativo dominante, auto bring-to-front e overlay escuro do frame ativo.
- `index.html`: `renderAll()` preserva molduras de frames desselecionados, remove resíduos visuais e reaplica luz interna apenas a frames presentes em `selectedFrames`, inclusive no primeiro frame pressionado ao iniciar a seleção.
- `index.html`: `drawBezier()` mantém caminhos/curvas sólidos e legíveis durante seleção múltipla, sem alterar a geometria das curvas.
- `docs/QA-v8z4b26f.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: ponteiro de QA/status atualizado para v8z4b26f no repositório de teste.

## v8z4b26e — limpar marcação residual ao desselecionar frames

- fix: Stage e faixa de frames passam a reaplicar destaque de seleção múltipla somente quando `selectedFrames` contém 2+ frames.
- fix: frames removidos da seleção deixam de manter `multi-selected`, `.fp.selected`, halo, box-shadow ou z-index de selecionado quando a seleção deixa de ser múltipla.
- preservado: forma atual de seleção múltipla da v8z4b26d, aplicação em lote de Canto/Simétrico/Assimétrico/Desconectado, Undo/Redo, Preview, MP4 e JSON.
- `index.html`: versionamento atualizado para `v8z4b26e`; novos helpers `isFrameVisuallyMultiSelected()` e `clearFrameSelectionVisuals()` usados por `renderAll()` e `updateFrameSelector()` para sincronizar Stage/faixa a partir do estado real.
- `docs/QA-v8z4b26e.md`: checklist específico da versão.
- `QA.md`, `ROADMAP.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b26e no repositório de teste.

## v8z4b26d — separar seleção simples e seleção múltipla

- ux: separa o comportamento visual de seleção simples e seleção múltipla.
- ux: mantém o auto-center da faixa de frames na seleção simples.
- ux: desativa hierarquia visual individual durante seleção múltipla.
- fix: impede que o último frame tocado seja promovido sozinho quando há múltiplos selecionados.
- fix: corrige resíduo visual ao desselecionar frames dentro de uma seleção múltipla.
- preservado: Preview, Export, JSON, timeline e dados internos não foram alterados.
- `index.html`: versionamento atualizado para `v8z4b26d`; `renderAll()` e seleção por pills ajustados para bloquear foco visual/auto-center individual durante seleção múltipla.
- `docs/QA-v8z4b26d.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b26d no repositório de teste.

## v8z4b26c — melhorar leitura visual da seleção múltipla no Stage

- ux: durante seleção múltipla, todos os frames selecionados são desenhados como grupo em camada visual superior, preservando a ordem relativa entre eles.
- ux: frames selecionados recebem contorno/halo de seleção mais forte e números mais legíveis, mantendo a cor de seleção já usada no app.
- ux: frames não selecionados permanecem visíveis, mas com opacidade reduzida para funcionar como fundo visual durante seleção múltipla.
- fix: evita que apenas o último frame tocado/ativo roube o destaque visual quando há vários frames selecionados.
- preservado: a mudança é apenas de renderização do Stage; dados, ordem real dos frames, timeline, JSON, Preview, Export, duração, pausa, easing, loop, escala e rotação não foram alterados.
- `index.html`: versionamento mantido em `v8z4b26c`; renderização de `renderAll()` ajustada para separar camada visual de selecionados e não selecionados em seleção múltipla.
- `docs/QA-v8z4b26c.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b26c no repositório de teste.

## v8z4b26b — remover Sel e mostrar seleção múltipla no Stage

- ux: remove o botão visual `Sel` da faixa inferior de frames sem criar botão substituto ou deixar espaço vazio.
- ux: preserva ativação normal por toque na faixa de frames e permite alternar seleção múltipla pela própria interação nos frames: segundo toque no frame ativo ou long press como compatibilidade; com seleção iniciada, toques nos frames alternam entrada/saída do lote.
- ux: mantém diferença visual entre frame ativo, frames selecionados, ativo + selecionado e frames não selecionados nas pills e no Stage.
- preservado: aplicação em lote continua restrita aos modos Canto, Simétrico, Assimétrico e Desconectado, reaproveitando `applyPointModeForFrame()` e um único registro de Undo/Redo.
- preservado: seleção múltipla segue estado temporário; JSON, Preview, MP4, zoom/pan do Stage, inserção assistida, Reset, escala, rotação, duração, pausa, easing e motor de animação não foram alterados.
- `index.html`: versionamento atualizado para `v8z4b26b`; remoção do botão `btnMultiSelect`; seleção múltipla desacoplada do botão; marcação localizada de seleção no Stage/pills ajustada.
- `docs/QA-v8z4b26b.md`: checklist específico da versão.
- `QA.md` e `docs/ROADMAP.md`: documentação atualizada para v8z4b26b no repositório de teste.

## v8z4b26a — seleção múltipla de frames e modo de curva em lote

- feat: adiciona modo explícito `Sel` na faixa de frames para seleção múltipla por toque, sem depender de long press.
- feat: aplica Canto, Simétrico, Assimétrico e Desconectado em lote quando há 2 ou mais frames selecionados.
- fix: ação de modo de curva em lote usa um único registro de Undo/Redo e reaproveita `applyPointModeForFrame()`.
- preservado: seleção múltipla não entra no JSON, Preview/MP4 ignoram seleção, inserção assistida continua bloqueando ações externas e zoom/pan do Stage não foi alterado.
- `index.html`: versionamento atualizado para `v8z4b26a`; estado temporário `frameMultiSelectMode`; botão `Sel`; destaque localizado de frames selecionados; helper de aplicação em lote de modo de curva.
- `docs/QA-v8z4b26a.md`: checklist específico da versão.
- `docs/ROADMAP.md`: marca v8z4b26a como implementada.

## Checkpoint interno — v8z4b25h consolidada como base estável

- docs/checkpoint: v8z4b25h aprovada funcionalmente como checkpoint interno estável; não é release comercial e não cria nova versão funcional.
- docs/checkpoint: v8z4b25h substitui v8z4b25g como checkpoint atual porque inclui a correção do bloqueio de ações externas durante frame novo pendente/assistido.
- docs/checkpoint: v8z4b25g permanece registrada como base aprovada anterior da sequência de modos de ponto/curva.
- docs/checkpoint: manter v8z4b25h disponível como ponto de retorno caso próximas versões quebrem curva, loop, Preview, MP4, JSON, inserção assistida de frame ou gestos no iPhone/Safari.
- Escopo desta consolidação: documentação/roadmap/QA; nenhum comportamento do app, número de versão, interface, motor, Preview, MP4, JSON, zoom/pan, Undo/Redo, Loop, seleção de frames ou modos de curva foi alterado.

## v8z4b25h — pending assisted frame global UI guard

- fix: bloqueia ações globais enquanto existe frame assistido pendente de confirmação.
- fix: impede abertura de Duração, Curva, Transformação/Frame, Preview, MP4, JSON, Reset, Settings, seleção/troca/deleção/adição de frame até Confirmar ou Cancelar.
- `index.html`: adiciona guarda central para estado de frame pendente/ghost e atualiza `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão e comentário de topo.

## v8z4b25g — curve mode icons light color and pius wording cleanup

- visual: ajusta ícones do menu de curva para cor clara no tema escuro.
- visual: melhora leitura dos quatro modos de curva no iPhone/Safari.
- fix: remove referência textual indevida a “Pius” no contexto do menu de curva.
- `index.html`: `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão, comentário de topo e renderização dos ícones de modos de ponto/curva atualizados para usar `currentColor` via máscara vetorial.

## v8z4b25f — point mode icon SVG cleanup for iPhone readability

- visual: remove textos internos dos SVGs dos modos de ponto.
- visual: aumenta e normaliza leitura dos ícones Canto, Simétrico, Assimétrico e Desconectado.
- visual: ajusta viewBox/renderização dos ícones para melhor leitura no iPhone/Safari.
- `assets/icons/curve-modes/curve-corner.svg`, `curve-symmetric.svg`, `curve-asymmetric.svg`, `curve-disconnected.svg`: ícones vetoriais limpos, sem `<text>`, usando apenas símbolo gráfico com `stroke="currentColor"`.
- `index.html`: `APP_VERSION`/`APP_VERSION_NAME`, texto visível de versão, comentário de topo e tamanho visual de `.point-mode-icon` atualizados.

## v8z4b25e — curve mode menu icon refresh

- visual: substitui ícones dos modos de ponto/curva por novos SVGs fornecidos.
- visual: melhora leitura dos modos Canto, Simétrico, Assimétrico e Desconectado no menu de curva.

# Changelog

## v8z4b25d — loop-closed endpoint point modes fix

- fix: F1 e último frame com Loop ativo passam a respeitar modos de ponto como curva fechada.
- fix: Canto no fechamento do Loop reabre criando par de handles locais.
- fix: Simétrico e Assimétrico passam a considerar o handle do segmento de Loop.
- fix: Desconectado permanece como único modo com autonomia real entre os lados do ponto.

---

## v8z4b25c — corner reopen symmetric handles fix

- fix: reabrir ponto em modo Canto cria par de handles locais em vez de alternar apenas um lado.
- fix: ponto reaberto a partir de Canto passa automaticamente para Simétrico.
- fix: Undo/Redo preserva pointMode e handles locais ao fechar/reabrir ponto.

---

## v8z4b25b — point mode quick access

- fix: menu de modos de ponto/frame fica acessível por controle provisório claro.
- fix: modos Canto/Simétrico/Assimétrico/Desconectado podem ser testados no frame ativo.
- architecture: modos continuam associados ao ponto/frame, não ao segmento.

---

## v8z4b24b — stage gesture arbitration and viewport navigation

- fix: zoom/pan com dois dedos não seleciona frames acidentalmente.
- fix: handles, overlays e elementos tutoriais do Stage não são ativados ao iniciar gesto de dois dedos.
- fix: adicionado bloqueio curto após navegação do Stage para evitar taps residuais.
- fix: área interativa de zoom/pan passa a cobrir o viewport de edição, não apenas a imagem.
- architecture note: imagem passa a ser tratada como conteúdo dentro do Stage, não como limite de navegação.

---

## v8z4b22c — ghost frame exclusive interaction fix

- fix: interação exclusiva do ghost frame.
- fix: handler de escala/rotação não aciona mais movimento simultâneo.
- fix: scale/rotate do ghost usam centro atual após drag.
- fix: Stage ignora eventos iniciados em controles do ghost.

---

## v8z4b22b — assisted frame insertion ghost UX fix

- fix: OK/Cancelar do ghost funcionando.
- ux: ações OK/Cancelar passam para dentro do ghost.
- feat/ux: ghost permite ajustar posição, escala e rotação antes de confirmar.
- fix: confirmação gera um único Undo e não salva estado transitório no JSON.

---

## v8z4b22a — assisted frame insertion

Nova função de UX controlada sobre v8z4b21e. Base obrigatória: v8z4b21e.

### Implementação

- O botão `+` não cria mais frame definitivo imediatamente.
- O app entra em modo temporário `isInsertingFrame` com `pendingFrameInsert`, `insertFrameMode` e `ghostFrame`.
- O Stage mostra um ghost frame translúcido, com rótulo do futuro frame e controles pequenos OK/Cancelar.
- Tocar ou arrastar no Stage reposiciona o ghost; mover o ghost não altera `frameCount`, arrays do projeto nem undo.
- Cancelar remove o ghost e restaura a interação normal sem alterar o projeto.
- Confirmar cria uma única entrada de undo e insere o frame definitivo na posição escolhida.

### Curvas, loop e timing

- Inserção entre frames divide o trecho original localmente.
- Se o ghost sugerido em t=0.5 for aceito sem mover, curvesV2 usa subdivisão De Casteljau para preservar a cúbica.
- Se o ghost for movido, os dois trechos locais recebem handles padrão de 1/3 da corda, com `manual:false`.
- Inserção no último frame com loop ativo adiciona o novo frame como último antes do fechamento; o loop passa a ser novo último→F1.
- Inserção depois do último sem loop usa `defaultNewSegmentDuration`.
- Ao dividir trecho existente, `segDurations` é dividido metade/metade e o novo frame nasce com pause 0.
- Rotação e tamanho são interpolados entre frames quando há próximo frame; ao inserir depois do último, são copiados do frame ativo.

### Preservações

- curvesV2 continua fonte de verdade; handles OUT/IN independentes preservados.
- Preview, MP4/export, Movimento inteligente, Reset Project e Reset Curves não receberam alteração funcional.
- Estado transitório (`isInsertingFrame`, `ghostFrame`, `pendingFrameInsert`, `insertFrameMode`) não é salvo no JSON.
- Direct Curve Drag, Path/Insert Tool e começar com 1 frame/0 frames ficaram apenas no ROADMAP.

### Arquivos alterados

- `index.html`: modo assisted frame insertion, ghost frame, confirmação/cancelamento, inserção local e versionamento → v8z4b22a.
- `CHANGELOG.md`: este registro.
- `QA.md`: checklist v8z4b22a.
- `ROADMAP.md`: v8z4b22a concluído e próximos itens mantidos como futuros.
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21e — restore local loop influence in smart movement

Correção funcional sobre v8z4b21d. Base obrigatória: v8z4b21d.

### Diagnóstico

A v8z4b21c/v8z4b21d evitou a falsa parada causada por loop curto usando `suppressLoop=true` nos trechos normais. Isso protegeu F1→F2, mas também removeu demais a continuidade local: o loop deixou de influenciar F1 e o último frame como vizinho real, deixando o Movimento inteligente mais achatado e o loop próximo de velocidade constante crua.

O bug original não era a presença do loop como vizinho. O bug era permitir que slopes extremos produzissem derivada interna zero no Hermite.

### Correção

- `_smartFrameVelocity()` voltou a considerar apenas vizinhos imediatos reais.
- Para F1, o trecho anterior é o loop último→F1 quando `loopEnabled=true`.
- Para o último frame, o trecho posterior é o loop último→F1 quando `loopEnabled=true`.
- Frames internos continuam usando somente os trechos normais adjacentes; o loop não entra em F2→F3, exceto em projetos pequenos onde o frame é fronteira real.
- `computeSmartMovementProgress()` não passa mais `suppressLoop=true` nos trechos normais.
- `_limitSmartHermiteSlopes()` continua aplicado após o cálculo local de velocidades: `m0 >= 0`, `m1 >= 0`, e `m0 + m1 <= 3`.

### Comportamento esperado

- F1→F2 usa loop como vizinho anterior e F2→F3 como vizinho posterior.
- F2→F3 usa F1→F2 e F3→F4, sem interferência direta do loop.
- F3→F4 usa F2→F3 e loop como vizinho posterior.
- Loop F4→F1 usa F3→F4 como anterior e F1→F2 como posterior.
- No caso mínimo 2 frames / F1→F2 4s / loop 1s / smart / manual / framePauses zeradas, F1→F2 não deve ter falsa parada no meio; o loop deve receber smart movement local perceptível.
- Reset Project, Reset Curves, handles OUT/IN independentes, JSON curvesV2, Preview e MP4 permanecem no mesmo fluxo existente.

### Arquivos alterados

- `index.html`: restaura vizinhança local real do loop no Movimento inteligente; versão → v8z4b21e.
- `CHANGELOG.md`: este registro.
- `QA.md`: checklist v8z4b21e.
- `ROADMAP.md`: v8z4b21e concluído; Direct Curve Drag e Assisted Frame Insertion continuam futuros.
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21d — fix project reset baseline and smart loop continuity

Correção funcional sobre v8z4b21c. Base obrigatória: v8z4b21c.

### Diagnóstico

**Bug 1 — Reset Project:** o reset reconstruía o template padrão (`pan-lr`) em vez de restaurar o projeto carregado no início da sessão. Ao abrir um JSON salvo, mexer no projeto e acionar Reset, frames/curvas/duração/loop voltavam ao template inicial.

**Bug 2 — loop no Movimento inteligente:** v8z4b21c isolou corretamente o loop dos trechos normais com `suppressLoop=true`, mas o trecho de loop ainda precisava de smart movement local com clamp monotônico. O clamp individual em `3*vAvg` podia criar combinações de slopes altas demais e trancos/quase-holds.

### Correção

- Adicionado `projectResetBaseline`, um snapshot profundo do estado normalizado da sessão.
- Ao carregar JSON com sucesso, `applyFrameData()` atualiza o baseline depois de normalizar arrays, migrar/converter curvesV2 e renderizar o Stage.
- Ao criar projeto inicial a partir de imagem/template, o baseline passa a ser esse template inicial da sessão.
- `resetAll()` agora restaura o baseline, cria uma única entrada de undo quando há diferença, e não limpa a pilha de undo.
- Salvar JSON não altera o baseline.
- Adicionado `_limitSmartHermiteSlopes()`: `m0 >= 0`, `m1 >= 0`, e se `m0 + m1 > 3`, ambos são escalados proporcionalmente.
- Trechos normais continuam usando `suppressLoop=true`, preservando a correção da v8z4b21c.
- O trecho de loop continua usando Movimento inteligente local (`suppressLoop=false`) e agora recebe o mesmo limiter monotônico.

### Comportamento após a correção

- Reset Project volta ao estado do projeto carregado, não ao template padrão.
- Undo após Reset Project volta ao estado anterior ao reset; Redo reaplica o reset.
- Loop curto não contamina o trecho normal F1→F2.
- O loop participa do Movimento inteligente com continuidade local e sem tranco forte.
- Reset Curves continua funcionando com curvesV2.
- Handles OUT/IN independentes não foram alterados.
- Preview e MP4 usam o mesmo cálculo corrigido via `getStateAtT`.
- Velocidade constante continua usando os cálculos de comprimento existentes.
- JSON salvo usa `version: v8z4b21d` e preserva `curvesV2`, `framePauses`, `segDurations` e `loopDuration`.

### Arquivos alterados

- `index.html`: baseline de Reset Project; undo/redo do reset; limiter monotônico do smart movement; versão → v8z4b21d.
- `CHANGELOG.md`: este registro.
- `QA.md`: checklist v8z4b21d.
- `ROADMAP.md`: v8z4b21d concluído; Direct Curve Drag e Assisted Frame Insertion mantidos como futuros.
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21c — fix smart loop false stop and reset curves v2

Correção funcional do Movimento inteligente com loop e do Reset Curves para curvesV2. Base obrigatória: v8z4b21b.

### Diagnóstico

Em v8z4b21b, com `movementEasingMode: smart`, `segmentTimingMode: manual`, `loopEnabled: true` e `loopDuration` curto (ex: 1s para trecho normal de 4s), o usuário observava uma falsa parada/ease no meio da curva normal.

**Causa raiz (Bug 1 — falsa parada):** O cálculo de continuidade do Hermite em `_smartFrameVelocity` incluía a velocidade do trecho de loop (`vLoop = loopLength / loopDuration`) na mistura das velocidades dos frames de fronteira (frame 0 e frame N). Com um loop curto, `vLoop` é muito maior que `vAvg` do trecho normal. O clamp a `3*vAvg` limitava as velocidades de fronteira ao máximo, e com `vStart = vEnd = 3*vAvg`, a derivada Hermite colapsa para zero em `τ = 0.5` — criando uma parada falsa exatamente no meio da curva.

**Prova matemática:** Com `vStart = vEnd = v = 3*curveLen/dur` (clamp máximo):
```
p(τ) = curveLen * (4τ³ - 6τ² + 3τ)
p'(τ) = curveLen * (12τ² - 12τ + 3) = 3*curveLen*(2τ-1)²
p'(0.5) = 0  ← falsa parada
```

**Causa raiz (Bug 2 — Reset Curves):** `resetSegmentCurve` resetava apenas os `ctrlPts` legados e `loopCtrlPt`, mas não tocava `curvesV2.frameHandles`. Como curvesV2 é a fonte de verdade da curva, o Stage continuava exibindo a curva antiga após o reset.

### Correção

**Bug 1 — suppressLoop:**
- Adicionado parâmetro `suppressLoop` a `_smartFrameVelocity`.
- Quando `suppressLoop=true`, `vLoop` não entra na mistura das velocidades de fronteira dos trechos normais.
- `computeSmartMovementProgress` passa `suppressLoop=true` ao calcular `vStart` e `vEnd` para trechos normais.
- O trecho de loop em si usa `suppressLoop=false` (omitido) — mantém continuidade com os trechos normais.
- Resultado: com `loopEnabled=true` e `loopDuration` curto, os frames de fronteira dos trechos normais usam apenas a velocidade do próprio trecho como referência → Hermite sem falsa parada.

**Bug 2 — Reset Curves para curvesV2:**
- `resetSegmentCurve` agora, quando `isCurvesV2Active()`, reseta também `curvesV2.frameHandles.out[fi0]` e `curvesV2.frameHandles.in[fi1]` para a posição padrão (1/3 da corda na direção do segmento).
- Para trecho normal `i→i+1`: `out[i] = {dx: (P3x-P0x)/3, dy: (P3y-P0y)/3}`, `in[i+1] = {dx: (P0x-P3x)/3, dy: (P0y-P3y)/3}`.
- Para trecho de loop `N-1→0`: `out[N-1]` e `in[0]` resetados proporcionalmente à corda do loop.
- Os `ctrlPts` legados continuam sendo resetados (fallback preservado).

### Comportamento após a correção

- 2 frames, F1→F2 4s, loop 1s, smart movement, framePauses zero: **sem falsa parada no meio da curva**.
- Loop curto não contamina o easing dos trechos normais.
- Desativar Movimento inteligente continua funcionando.
- Ativar Velocidade constante continua funcionando.
- Reset Curves exibido no Stage mostra a curva resetada imediatamente.
- Undo do Reset Curves restaura os handles anteriores (curvesV2 está no `captureState`).
- Handles OUT/IN independentes da v8z4b21a não foram alterados.
- `segmentTimingMode: manual` preservado — nenhuma redistribuição de duração ocorre.
- Compatibilidade com arquivos antigos (sem curvesV2) preservada.

### Caso mínimo de regressão (testado)

- 2 frames; F1→F2 duração 4s; `loopEnabled: true`; `loopDuration: 1s`; `movementEasingMode: smart`; `segmentTimingMode: manual`; `constantSpeedTotalDuration: null`; `framePauses` zerados; curvesV2 ativo.
- **Resultado: F1→F2 sem falsa parada. Loop rápido não contamina trecho normal.**

### Arquivos alterados

- `index.html`: `_smartFrameVelocity` (parâmetro `suppressLoop`), `computeSmartMovementProgress` (passa `suppressLoop=true` para trechos normais), `resetSegmentCurve` (reseta `curvesV2.frameHandles`); versão → v8z4b21c.
- `CHANGELOG.md`: este registro.
- `QA.md`: critérios de QA atualizados.
- `ROADMAP.md`: próximas ideias registradas (sem implementação).
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21b — fix smart movement timing for cubic curves

Correção funcional do Movimento inteligente aplicado a curvesV2/Bézier cúbica. Base obrigatória: v8z4b21a.

### Diagnóstico

Em v8z4b21a, com `movementEasingMode: smart` e `segmentTimingMode: manual`, o usuário observava uma falsa parada/ease indevido ao longo de trechos com curvesV2. Desativar o Movimento inteligente ou ativar Velocidade constante eliminava o problema.

**Causa raiz:** `measureSegmentCurveLength` e `measureLoopCurveLength` usavam Bézier **quadrática** (ctrlPts legados) para medir o comprimento do arco, mesmo quando `curvesV2` (Bézier cúbica real) estava ativo. Isso gerava `vAvg` incorreto no Hermite do smart movement, criando perfis de velocidade errôneos — em particular, desaceleração artificial próxima a frames quando a cúbica tem comprimento diferente da quadrática.

### Correção

- **`measureSegmentCurveLength`**: quando `isCurvesV2Active()`, usa `getCurvesV2CubicCP(segIndex)` + `evalCubicBezierPt()` para medir o comprimento da curva cúbica real. Fallback para quadrática legada se curvesV2 inativo ou inválido.
- **`measureLoopCurveLength`**: idem para o trecho de fechamento N→1, usando `getCurvesV2CubicCP(getLoopSegmentIndex())`.

Ambas as funções alimentam diretamente `_smartSegmentVAvg`, `_smartFrameVelocity` e `computeSmartMovementProgress` — assegurando que o Hermite cúbico do Movimento inteligente usa velocidades calibradas com o comprimento real da curva cúbica.

### Comportamento após a correção

- Movimento inteligente com curvesV2 não cria falsa parada quando `framePauses` são zeros.
- A câmera pode suavizar a velocidade entre trechos, mas não freia artificialmente.
- Velocidade constante continua funcionando (redistribui durações proporcionalmente ao comprimento cúbico — que já era correto via `mapProgressToBezierU`).
- Preview e MP4 usam o mesmo cálculo corrigido (via `getStateAtT`).
- Loop: `measureLoopCurveLength` corrigido elimina a falsa parada no trecho de fechamento.
- Handles OUT/IN independentes da v8z4b21a não foram alterados.
- Compatibilidade com arquivos antigos (sem curvesV2) preservada: fallback quadrático mantido.

### Arquivos alterados

- `index.html`: correção em `measureSegmentCurveLength` e `measureLoopCurveLength`; versão → v8z4b21b.
- `CHANGELOG.md`: este registro.
- `QA.md`: critérios de QA atualizados.
- `ROADMAP.md`: próximas ideias registradas (sem implementação).
- `pages-deploy-stamp.txt`: atualizado.

---

## v8z4b21a — implement real cubic in-out handles

Mudança arquitetural controlada do modelo de curvas. Base obrigatória: v8z4b20d.

### curvesV2 — novo modelo cúbico

Introduz `curvesV2` como fonte de verdade para curvas Bézier cúbicas com handles in/out independentes por frame.

**Estrutura:**
```json
{
  "version": 1,
  "mode": "cubic",
  "frameHandles": {
    "out": [{"dx": 40, "dy": 0, "manual": true}, ...],
    "in":  [null, {"dx": -40, "dy": 0, "manual": false}, ...]
  }
}
```
- `out[i]`: vetor relativo do centro do frame i até C1 do trecho i→i+1.
- `in[i]`:  vetor relativo do centro do frame i até C2 do trecho (i-1)→i.
- Vetores relativos: handles acompanham o frame ao mover (não precisam de resync).

### Handles independentes

- Arrastar OUT de F(i) altera apenas `curvesV2.frameHandles.out[i]`.
- Arrastar IN de F(i) altera apenas `curvesV2.frameHandles.in[i]`.
- Nenhum dos dois afeta o handle oposto do mesmo trecho.
- Não usa mais o ctrlPt legado como se fossem dois handles.

### Bézier cúbica real

- `drawBezier()`: usa `M P0 C C1 C2 P3` (SVG C) em vez de `Q`.
- `getStateAtT()`: `bezierPointAt()` usa `evalCubicBezierPt()` quando curvesV2 ativo.
- `evaluateSegmentPath()`: caminho preferencial usa cúbica antes do runtime legado.
- Preview e MP4 seguem a mesma curva desenhada.

### Compatibilidade com arquivos antigos

- `applyFrameData()`: se JSON não tem `curvesV2`, chama `convertLegacyCtrlPtsToCurvesV2()`.
- Conversão: quadrática Q → cúbica via C1 = P0 + 2/3*(Q-P0), C2 = P3 + 2/3*(Q-P3).
- Arquivos antigos abrem sem perda de curva visual.

### JSON

- `buildProjectData()` salva `curvesV2` no JSON.
- `version: "v8z4b21a"` persistido.
- Campos `ctrlPts`/`ctrlPtManual`/`loopCtrlPt` mantidos para fallback.

### Undo/Redo

- `captureState()` / `restoreState()` incluem `curvesV2` via `cloneCurvesV2()`.
- Handles são restaurados corretamente no Undo.

---

## v8z4b20d — fix handle sync after frame move and visible segment handles

Correção de estabilização sobre a v8z4b20c. Base obrigatória: v8z4b20c.

### Problema 1 — Handle fica parado ao mover frame

**Sintoma:** Após ajustar um handle IN/OUT e mover o frame, o handle visual permanecia na posição anterior enquanto o frame se deslocava.

**Causa raiz — handles de loop:** `syncCtrlPtsForFrame` não processava `loopCtrlPt`. Quando F1 ou o último frame era movido, `loopCtrlPt.nx/ny` não era recalculado, fazendo o handle de loop aparecer estático.

**Causa raiz — handles manuais próximos:** `getFrameHandleGeometryForTarget` usava threshold de 8px; se o ctrl pt recomposto ficasse dentro de 8px do frame, o fallback de direção de corda era ativado, dando aparência de handle "pulando" para nova posição.

**Correção A — syncCtrlPtsForFrame estendido:**
Quando `fi === 0` ou `fi === frameCount - 1` e `loopEnabled`, o `loopCtrlPt` é recalculado usando `t/perpX/perpY` armazenados na corda do trecho de loop (último frame → F1). O handle de loop agora acompanha visualmente F1 e o último frame quando são movidos.

**Correção B — applyFrameConnectedHandleEdit para loop:**
Ao arrastar um handle de loop, `t/perpX/perpY` agora são calculados e armazenados em `loopCtrlPt`. Isso permite que `syncCtrlPtsForFrame` reconstrua corretamente `nx/ny` após movimento de frame.

**Correção C — threshold reduzido:**
O threshold de 8px em `getFrameHandleGeometryForTarget` foi reduzido para 2px para ctrl pts manuais. Adicionado fallback seguro que sempre exibe o ctrl pt manual mesmo quando dist < threshold.

### Problema 2 — segBlurSettings desalinhado

**Sintoma:** JSON salvo com `frameCount:6` mas `segBlurSettings` com apenas 4 entradas (precisava de 5 = frameCount - 1).

**Causa raiz:** `deleteActiveFrame` não fazia splice em `segBlurSettings`. Após remover um frame, o array ficava maior que o necessário. `normalizeProjectArrays()` não tratava `segBlurSettings`.

**Correção D — ensureSegmentArraysIntegrity():**
Novo helper centralizado que normaliza todos os arrays por trecho para exatamente `frameCount - 1` entradas:
- `ctrlPts` (preenche com midpoint automático)
- `ctrlPtManual` (preenche com `false`)
- `segBlurSettings` (preenche com default `{enabled:false, maxPx:4, fadeIn:0.18, fadeOut:0.22}`)
- `segDurations` (preenche com `defaultNewSegmentDuration`)
- `rotEasings` (preenche com `'linear'`)
- `scaleEasings` (preenche com `'linear'`)

Chamado em: `deleteActiveFrame`, `buildProjectData` (antes de salvar), `applyFrameData` (após carregar).

**Correção E — deleteActiveFrame:**
Agora faz splice correto em `segBlurSettings` (como já fazia para `ctrlPts`/`ctrlPtManual`), depois chama `ensureSegmentArraysIntegrity()`.

### BLOCO D — Ghost handles do lado complementar (UX)

Para melhorar a leitura visual do trecho ativo, o app agora exibe os dois lados do trecho de forma simultânea:

- **Handles interativos** (âmbar sólido): os handles IN/OUT do frame selecionado — permanecem editáveis.
- **Ghost handles** (âmbar com 28% de opacidade, sem interação): o handle do frame vizinho no outro extremo do mesmo trecho — apenas indicação visual, `pointer-events: none`.

Exemplo (2 frames, sem loop):
- F1 selecionado: OUT de F1 (interativo) + IN de F2 como ghost
- F2 selecionado: IN de F2 (interativo) + OUT de F1 como ghost

Não fingem independência — ambos representam o mesmo `ctrlPt` legado do trecho. Não implementado para loop nesta versão.

### Preservações

- Edição local por trecho (segment-local editing da v8z4b20c): preservada.
- F1 mostra OUT; último frame mostra IN; loop em F1/último conforme esperado.
- Midpoint automático oculto.
- Ctrl-pt legado oculto em segmentos normais.
- `loopCtrlPt` continua como schema salvo; sem campo novo.
- Undo/Redo por trecho: preservado; não há undo duplicado.
- Preview, MP4, Salvar MP4: sem regressão.
- Arquivos da v8z4b20c abrem normalmente.

### Arquivos alterados

- `index.html`
- `CHANGELOG.md`
- `QA.md`
- `ROADMAP.md`
- `pages-deploy-stamp.txt`

---

## v8z4b20c — fix endpoint loop handles and segment-local editing

Correção funcional dos handles de frame revelados como problemáticos na v8z4b20b.

### Problema corrigido

A v8z4b20b criou dois handles IN/OUT para frames intermediários, mas revelou:
1. F1 e último frame não tinham handles, mesmo com trecho conectado.
2. Com loop ativo, F1 e último frame precisavam de handles para o trecho de loop.
3. Arrastar um handle resetava/sobrescrevia a curva ajustada pelo frame vizinho (modo linkado).

### BLOCO A — Nova regra de exibição: handles por trecho conectado

Substituída a regra limitada `activeIdx > 0 && activeIdx < frameCount - 1`
por uma regra baseada em conexões reais do frame ativo.

**Handle IN aparece se:**
- existe trecho anterior normal: `fi > 0`
- OU existe trecho de loop entrando no F1: `loopEnabled && fi === 0 && frameCount >= 2`

**Handle OUT aparece se:**
- existe trecho seguinte normal: `fi < frameCount - 1`
- OU existe trecho de loop saindo do último frame: `loopEnabled && fi === frameCount - 1 && frameCount >= 2`

**Exemplos:**
| Config | F1 | F2 | F3 | F4 |
|---|---|---|---|---|
| 4 frames, sem loop | OUT | IN+OUT | IN+OUT | IN |
| 4 frames, com loop | IN(loop)+OUT | IN+OUT | IN+OUT | IN+OUT(loop) |
| 2 frames, sem loop | OUT | IN | — | — |
| 2 frames, com loop | IN(loop)+OUT | IN+OUT(loop) | — | — |

### BLOCO B — Segment-local editing (substitui modo suave/linkado)

**Problema do modo linkado (v8z4b20b):** arrastar um handle atualizava dois ctrlPts vizinhos
ao mesmo tempo, fazendo o ajuste de um frame interferir no do frame vizinho.

**Novo comportamento:**
- **Handle IN** edita apenas `ctrlPts[fi - 1]` (trecho `F(fi-1) → F(fi)`).
- **Handle OUT** edita apenas `ctrlPts[fi]` (trecho `F(fi) → F(fi+1)`).
- Handle IN de F1 com loop edita apenas `loopCtrlPt`.
- Handle OUT do último frame com loop edita apenas `loopCtrlPt`.

**Importante (schema legado):**
O handle OUT de F4 e o handle IN de F5 representam o mesmo trecho F4→F5 no schema legado.
Editar um atualiza esse trecho; quando selecionar o outro frame, o handle correspondente reflete
a posição atual do mesmo ctrlPt. Isso é esperado e correto.

**O que foi desativado:** link automático que atualizava dois trechos vizinhos por drag.
- Modo Suavizar/Angular real ficará para etapa futura.
- Suavizar futuramente será ação/contexto explícito.

### BLOCO C — Novos helpers de target por conexão

- `getFrameConnectedHandleTargets(fi)` → `{ inTarget, outTarget }`: retorna os targets
  de segmento conectados aos handles IN e OUT do frame fi.
- `getFrameHandleGeometryForTarget(fi, role, target)` → `{ hx, hy }`: calcula posição
  visual do handle a partir do ctrlPt real do target.
- `getFrameHandleGeometry(fi)` → `{ Px, Py, inHx, inHy, outHx, outHy, inTarget, outTarget }`:
  geometria completa para qualquer frame ativo.

### BLOCO D — applyFrameConnectedHandleEdit

- Nova função `applyFrameConnectedHandleEdit(fi, role, target, hx, hy)`.
- Edita apenas o target indicado.
- Armazena `t/perpX/perpY` para preservar curva ao mover frame (v8z4b19z preservado).
- Não altera `ctrlPtManual` de outros segmentos.
- Não altera `loopCtrlPt` quando target não for loop.

### BLOCO E — Modo suave/linkado desativado

- Desativado em v8z4b20c: `applyFrameHandleEdit` (modo linkado) não é mais chamado na UI.
- Modo Suavizar/Angular real fica para etapa futura.
- `applyFrameHandleEdit` preservada internamente como legado.

### BLOCO F — Handles de loop

- F1 com loop: IN handle associado ao `loopCtrlPt`.
- Último frame com loop: OUT handle associado ao `loopCtrlPt`.
- Loop ctrl-pt (`cpt_loop`) fica oculto (opacity:0, pointer-events:none) quando
  handles de loop estão disponíveis — evita sobreposição visual.
- Arrastar IN de F1 (target loop) edita `loopCtrlPt`.
- Arrastar OUT do último frame (target loop) edita `loopCtrlPt`.

### BLOCO G — Visual

- Handles de loop: cor roxa (`rgba(180,100,255,1)`) para diferenciar de handles normais.
- Braços de haste no `bezierSvg`: roxo para loop, âmbar para normais.
- Endpoints com um único handle: apenas esse handle é exibido.
- Midpoint continua oculto; ctrl-pt legado continua oculto.

### BLOCO H — Undo/Redo

- Um drag de handle gera uma única entrada de undo (lazy capture no primeiro pixel).
- Tocar sem mover não cria undo.
- Undo desfaz apenas o trecho editado (segment-local).
- Redo refaz apenas o trecho editado.
- Loop: Undo/Redo restaura apenas `loopCtrlPt`.

### BLOCO I — Bugfix mover frame (v8z4b19z preservado)

- `applyFrameConnectedHandleEdit` armazena `t/perpX/perpY` após setar `nx/ny`.
- `syncCtrlPtsForFrame` preserva ajustes manuais ao mover frame ativo.

### JSON schema

- Sem campos novos.
- `version` salvo como `v8z4b20c`.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`, `framesNorm`, `frameRotations`,
  `segDurations`, `framePauses` — todos preservados.
- Arquivos da v8z4b20b continuam abrindo normalmente.

---

## v8z4b20b — prototype active frame in-out handles

Primeiro protótipo visual/funcional dos dois handles no frame intermediário ativo.
Substitui o handle único simétrico (`frame-tangent-dot`, v8z4b19z) por dois handles
distintos: **handle de entrada (IN)** e **handle de saída (OUT)**, ambos losangos âmbar.

### BLOCO A — Dois handles no frame intermediário ativo

**Decisão de produto:** o frame intermediário ativo agora mostra dois handles separados:
- **IN handle** (`.frame-in-handle`): controla o trecho anterior (fi-1 → fi), derivado de `ctrlPts[fi-1]`.
  Losango âmbar mais suave, no lado de entrada do frame.
- **OUT handle** (`.frame-out-handle`): controla o trecho seguinte (fi → fi+1), derivado de `ctrlPts[fi]`.
  Losango âmbar mais vivo (z-index 78), no lado de saída do frame.

**Visibilidade:**
- Aparece apenas quando: imagem carregada, `frameCount >= 3`, frame intermediário ativo
  (`activeIdx > 0` e `activeIdx < frameCount - 1`), não está em Preview, não está em `_isoMode`.
- F1 e último frame: sem handles IN/OUT.
- Loop: sem handles IN/OUT (loop ctrl-pt preservado).

### BLOCO B — Modo suave/linkado por padrão

**Comportamento seguro:** arrastar qualquer handle atualiza **os dois ctrlPts** em 180°
(colineares), preservando passagem contínua pelo frame ativo.

- Arrastar OUT handle: `ctrlPts[fi] ← P + dir*strengthOut`, `ctrlPts[fi-1] ← P - dir*strengthIn`
- Arrastar IN handle: `ctrlPts[fi-1] ← P + dir*strengthIn`, `ctrlPts[fi] ← P - dir*strengthOut`
- Modo Angular/Livre: **não implementado nesta versão** (roadmap futuro).

### BLOCO C — Geometria derivada dos ctrlPts reais

- Novo helper `getActiveFrameInOutHandleGeometry(fi)`: retorna `{Px, Py, inHx, inHy, outHx, outHy}`.
- Posição dos handles derivada dos ctrlPts reais, não de padrão automático.
- Se ctrlPts forem automáticos (não manuais), usa fallback pela corda `P[fi-1] → P[fi+1]`.
- Não sobrescreve ctrlPts apenas por renderizar.

### BLOCO D — Braços de haste no bezierSvg

- Dois braços (linhas) desenhados no `bezierSvg` para IN e OUT:
  - Braço IN: `stroke="rgba(255,210,0,0.55)"`, tracejado.
  - Braço OUT: `stroke="rgba(255,210,0,0.78)"`, sólido.
- Substituem o único braço tracejado do handle anterior.

### BLOCO E — Força por distância (v8z4b19z preservado)

- `dLen` controla intensidade: perto = suave, longe = curva mais oblíqua.
- Clamp: `MAX(10, MIN(lenSegment * 0.65, dLen))`.
- Lado oposto usa comprimento proporcional do seu trecho para estabilidade.

### BLOCO F — Bugfix mover frame (v8z4b19z preservado)

- `applyFrameHandleEdit()` armazena `t/perpX/perpY` consistentes após setar `nx/ny`.
- `syncCtrlPtsForFrame()` preserva ajustes manuais ao mover o frame ativo.
- Teste: ajustar handle → mover frame → curva não reseta.

### BLOCO G — Undo/Redo

- Um drag de handle gera uma única entrada de undo (lazy capture no primeiro pixel).
- Tocar sem mover não cria undo.
- Undo desfaz os dois ctrlPts juntos (modo linkado).
- Redo refaz os dois juntos.
- `markProjectDirty('frame-inout-handle')` ao término do drag.

### BLOCO H — Compatibilidade

- Handle legado `frame_tangent_dot` ocultado (display:'none') em `updateCtrlPts`.
- CSS e funções legadas preservadas (`startFrameTangentDrag`, `applyFrameTangentEdit` → delega para `applyFrameHandleEdit('out', ...)`).
- `frameTangentDragState` preservado como legado (não iniciado na UI normal).
- Loop ctrl-pt sem alteração.
- Midpoint continua oculto.
- ctrl-pt legado continua oculto.

### JSON schema

- Sem campos novos.
- `version` salvo como `v8z4b20b`.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`, `framesNorm`, `frameRotations`,
  `segDurations`, `framePauses` — todos preservados.
- Arquivos da v8z4b20a continuam abrindo normalmente.

---

## v8z4b20a — demote midpoint UI and document anchor handle model

Correção de direção conceitual: o midpoint automático não deve ser ferramenta
principal da interface, pois compete com os handles de frame. Esta versão oculta
o midpoint pathPoint da UI principal e documenta o modelo futuro de âncoras e handles.

### BLOCO A — Ocultar midpoint da UI principal

**Decisão de produto:** o midpoint automático cria dois sistemas concorrentes
(midpoint do trecho + handles do frame). Esta versão demove o midpoint da UI normal.

**Implementação:**
- `updateCtrlPts()`: midpoint pathPoints (`.mid-pathpt`) nunca recebem `display:'block'`.
  Elementos DOM existentes recebem `display:'none'` sempre; novos elementos não são criados.
- Midpoint do loop (`midpt_loop`): mesma lógica — sempre oculto.
- CSS `.mid-pathpt`: adicionado `pointer-events:none` para garantir que elementos
  residuais no DOM não interceptem toque mesmo se `display` for alterado.

**Preservado internamente:**
- `buildRuntimeCurveModel()`, `simulateRuntimePathPointEdit()`,
  `createLegacyCurvePatchFromSimulatedPathPointEdit()`, `validateLegacyCurvePatchCandidate()`,
  `applyLegacyCurvePatchCandidateToRealState()`, self-test interno (v8z4b19t):
  todo o código de midpoint permanece para compatibilidade, diagnóstico e fallback.

### BLOCO B — ctrl-pt/losango legado não reexibido

**Problema:** com midpoint oculto, o sync anterior (v8z4b19x) que só escondia
`ctrl-pt` quando midpoint estava ativo deixaria o ctrl-pt visível novamente.

**Correção:** `updateCtrlPts()` agora sempre aplica `opacity:'0'` e
`pointer-events:'none'` nos ctrl-pts de segmentos normais, independente do midpoint.

**Loop ctrl-pt preservado:** o `cpt_loop` (bolinha de edição da curva de loop)
permanece visível e interativo — não há frame tangent handle disponível para
o segmento de loop (handle só aparece em frames intermediários, não F1/último).

### BLOCO C — Frame tangent handle permanece foco atual

- Handle de frame intermediário da v8z4b19z mantido sem alteração.
- Visual losango/diamante âmbar preservado.
- Distância controlando força da tangente preservado.
- Preservação ao mover frame preservada.
- Undo/Redo/dirty preservados.
- JSON schema inalterado.

### BLOCO D — ROADMAP atualizado

- Modelo futuro de âncoras e handles documentado.
- Angular/Suavizar/Reta/Remover registrados como estados futuros.
- Pen/Patch Tool registrado como ferramenta futura.
- Desenho livre com dedo registrado como ferramenta futura.
- Ponto auxiliar/frame falso registrado como alternativa ao midpoint automático.
- Midpoint explicitamente classificado como legado/fallback, não UI principal.

### JSON schema

- Sem campos novos.
- `version` salvo como `v8z4b20a`.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`, `framesNorm`, `frameRotations`,
  `segDurations`, `framePauses` — todos preservados.

## v8z4b19z — preserve frame tangent edits when moving frames

Corrige o bug principal onde mover um frame após ajustar o handle/tangente resetava a curva
para uma posição automática/reta/ortogonal. Diferencia visualmente o handle de frame do
midpoint pathPoint. Faz a distância do handle ao centro do frame controlar a intensidade
da tangente.

### BLOCO A — Corrigir reset da tangente ao mover frame

**Bug corrigido:** após ajustar o handle de tangente, mover o frame resetava ctrlPts para
a posição padrão (midpoint automático).

**Causa:** `applyFrameTangentEdit()` setava apenas `{nx, ny}` nos ctrlPts, deixando
`{t, perpX, perpY}` com valores stale do estado anterior. Quando `syncCtrlPtsForFrame()`
rodava no próximo drag de frame, encontrava `t`/`perpX`/`perpY` finitos mas stale,
usava-os para reposicionar o ctrl pt, e resetava a tangente.

**Correção:** após setar `nx`/`ny`, `applyFrameTangentEdit()` agora chama
`computeTPerpForSeg()` para derivar `t`/`perpX`/`perpY` consistentes com a nova posição,
garantindo que `syncCtrlPtsForFrame()` preserve a tangente manual ao mover frames.

### BLOCO B — Diferenciar visualmente handle de frame do midpoint pathPoint

- Handle de frame (`#frame_tangent_dot`) trocado de **círculo** para **losango/diamante**:
  - `border-radius: 2px` (era `50%`) + `rotate(45deg)` no transform CSS.
  - Cor âmbar/dourada mantida; haste tracejada âmbar mantida.
  - midpoint pathPoint continua círculo branco com borda colorida.

### BLOCO C — Distância do handle controla força da tangente

- `applyFrameTangentEdit()` usa `dLen` (distância P→H) como `strength` dos ctrlPts:
  - `strengthPrev = clamp(dLen, 10, lenPrev * 0.65)` — trecho anterior.
  - `strengthNext = clamp(dLen, 10, lenNext * 0.65)` — trecho seguinte.
  - Perto do frame = suavidade leve; longe = curva mais oblíqua, sem explodir.
  - Antes: força era fixada em `0.4 * comprimento_do_trecho` independente do drag.

### Nova função `getFrameTangentGeometry(fi)`

- Substitui `getFrameTangentDir(fi)` — retorna posição absoluta `{hx, hy, dirX, dirY, dist}`.
- Deriva do estado real dos ctrlPts (não sobrescreve curvas).
- Se `ctrlPtManual[fi-1]` e/ou `ctrlPtManual[fi]`: usa vetores `P−Cprev` e `Cnext−P`.
- Fallback: corda `Pprev→Pnext` com `dist = 48px`.
- Usada em `drawBezier()` e `updateCtrlPts()`.

### Implementação

- `getFrameTangentGeometry(fi)` — nova função; substitui `getFrameTangentDir()`.
- `applyFrameTangentEdit(hx, hy)` — atualizado: dLen como strength + armazena t/perpX/perpY.
- `drawBezier()` — usa `getFrameTangentGeometry()`.
- `updateCtrlPts()` — usa `getFrameTangentGeometry()`.
- CSS `.frame-tangent-dot` — `border-radius:2px` + `rotate(45deg)`.
- JSON schema inalterado: sem campos novos.

## v8z4b19y — add active frame tangent handle prototype

Adiciona um **handle de tangente âmbar** no frame ativo intermediário para ajuste
suave de passagem (C1-ish) nas curvas de transição.

### Funcionalidade

- **Círculo dourado** (`.frame-tangent-dot`) aparece no frame ativo quando:
  - Imagem carregada, `frameCount >= 3`, `activeIdx > 0` e `< frameCount - 1`,
    não em isoMode, não em preview.
- **Linha tracejada âmbar** conecta o centro do frame ao handle (braço de tangente,
  48 px de comprimento visual).
- **Drag ajusta os dois segmentos adjacentes** simultâneamente: `ctrlPts[fi-1]` e
  `ctrlPts[fi]` são atualizados para produzir passagem suave C1-ish no frame ativo.
- **Undo lazy**: undo só é capturado se o usuário realmente arrastar ≥ 2 px —
  um toque sem movimento não cria entrada de undo.
- **JSON schema inalterado**: sem campos novos; usa `ctrlPts`/`ctrlPtManual` existentes.

### Implementação

- `getFrameTangentDir(fi)` — calcula direção da tangente (chord ou ctrl manual).
- `startFrameTangentDrag()` — inicia drag sem capturar undo.
- `applyFrameTangentEdit(hx, hy)` — aplica edição nos dois segmentos adjacentes.
- `frameTangentDragState` — estado de drag `{ didMove, undoCaptured }`.
- `onMove()` e `endDrag()` integrados; `markProjectDirty('frame-tangent')` se moveu.
- Whitelist da imageArea atualizada para incluir `.frame-tangent-dot`.

## v8z4b19x — hide legacy curve puller when midpoint path point is active

Oculta completamente o **curvePuller/losango legado** quando o **midpoint pathPoint**
está disponível como controle principal da curva.

### Objetivo

Na v8z4b19w, o curvePuller/losango ficava translúcido (`opacity: 0.38`) quando o
midpoint pathPoint estava ativo. Embora sem interatividade (`pointer-events: none`),
o elemento ainda aparecia visualmente parecendo um segundo controle, o que podia
confundir a leitura da interface: o usuário poderia pensar que havia dois controles
simultâneos para a mesma curva.

Esta versão oculta completamente o losango quando o midpoint pathPoint está disponível.
O midpoint pathPoint continua sendo o único controle principal visível.

### Mudanças

1. **`updateCtrlPts()` — ctrl-pt/losango completamente oculto quando midpoint ativo:**
   - `opacity: '0'` (era `'0.38'`) — losango fica invisível quando midpoint pathPoint
     está ativo no segmento.
   - `pointer-events: 'none'` — mantido; losango não intercepta toque/ponteiro.
   - Fallback preservado: se o midpoint pathPoint NÃO estiver disponível para o
     segmento (curva degenerada, falha de modelo), o ctrl-pt volta à visibilidade e
     interatividade normais.

2. **CSS `.mid-pathpt ~ .ctrl-pt` adicionado (v8z4b19x):**
   - `opacity: 0; pointer-events: none` — declaração CSS que complementa o inline
     style do JS; CSS aplicado como camada base, JS confirma via inline style.

3. **Loop — mesmo tratamento:**
   - `loopEl` recebe `opacity: '0'` (era `'0.38'`) quando `midpt_loop` está visível.
   - Fallback idêntico ao segmento normal.

4. **Comentários técnicos atualizados** em `updateCtrlPts()` e no cabeçalho do
   arquivo para refletir a nova decisão.

### Pipeline preservado

O arrasto do midpoint pathPoint continua usando o pipeline guardado aprovado:
1. `buildRuntimeCurveModel(segIndex)` — modelo runtime do segmento.
2. `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)` — deriva curvePuller
   candidato: `C = 2·M − 0.5·P0 − 0.5·P1`.
3. `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)` — patch.
4. `validateLegacyCurvePatchCandidate(patch)` — validação.
5. `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true })` —
   aplicação real guardada.

### Sem regressões

- JSON schema inalterado — nenhum campo novo.
- Preview e MP4 inalterados.
- Undo/Redo preservados.
- Salvar MP4 não regrediu.
- Compatibilidade total com projetos salvos em versões anteriores.

---

## v8z4b19w — make midpoint path point primary curve control

Inversão da hierarquia de edição de curva: o **midpoint pathPoint** (círculo sobre
a curva em t=0.5) passa a ser o controle principal e o **curvePuller/losango** vira
controle secundário/diagnóstico.

### Objetivo

Na v8z4b19v, embora o midpoint pathPoint estivesse visível e tecnicamente arrastável,
o curvePuller/losango (z-index 75) interceptava os gestos antes do midpoint pathPoint
(z-index 74). O arrasto parecia concentrado no losango, com o ponto na curva apenas
acompanhando. Esta versão inverte essa hierarquia.

### Mudanças

1. **z-index do `.mid-pathpt` elevado de 74 para 76** — supera o `.ctrl-pt` (75);
   o midpoint pathPoint recebe gestos antes do losango.

2. **Tamanho visual do `.mid-pathpt` aumentado de 8×8 px para 10×10 px** com borda
   2.5 px — mais visível e fácil de alvejar no iPhone.

3. **`updateCtrlPts()` — ctrl-pt/losango vira secundário quando midpoint pathPoint
   está ativo no segmento:**
   - `pointerEvents: 'none'` — losango não intercepta mais toque/ponteiro.
   - `opacity: 0.38` — losango permanece visível para diagnóstico mas fica visualmente
     de fundo.
   - Quando o midpoint pathPoint NÃO está disponível para o segmento, o ctrl-pt volta
     ao comportamento interativo normal (fallback seguro).

4. **Loop corrigido da mesma forma:** `loopEl` (ctrl-pt do loop) recebe
   `pointerEvents: 'none'` e `opacity: 0.38` quando o midpoint pathPoint do loop
   (`loopMidEl`) está visível. A lógica é aplicada após toda a seção de midpoints,
   garantindo estado consistente.

5. **`.mid-pathpt` adicionado ao whitelist do `attachImageAreaCloseHandler()`** —
   tocar no midpoint pathPoint não fecha mais o custBar inadvertidamente.

### Pipeline preservado

O arrasto do midpoint pathPoint continua usando o pipeline guardado aprovado:
1. `buildRuntimeCurveModel(segIndex)` — modelo runtime do segmento.
2. `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)` — deriva curvePuller
   candidato: `C = 2·M − 0.5·P0 − 0.5·P1`.
3. `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)` — patch
   candidato.
4. `validateLegacyCurvePatchCandidate(patch)` — validação da estrutura.
5. `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true })` —
   aplicação real guardada.

### Decisão sobre o losango (alternativas A/B/C)

**Alternativa adotada: B/C híbrido** — losango permanece visível mas não interativo:
- Visível com opacidade 0.38 (diagnóstico, confirma posição do curvePuller legado).
- Sem pointer-events (não intercepta gestos).
- Recupera interatividade se midpoint pathPoint não estiver disponível (fallback).
- Motivo: ocultar completamente (A) teria risco maior de confundir o usuário sobre
  o estado da curva. Manter visível mas secundário é a opção mais segura e informativa.

### JSON e schema

- **Nenhum campo novo** no JSON salvo.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` continuam sendo o único formato persistido.
- Arquivos v8z4b19v e anteriores continuam abrindo normalmente.

### Undo/Redo

Preservado sem mudança. Um único undo por arrasto de midpoint pathPoint (feito em
`startMidpointDrag()`). Tocar sem mover não cria undo.

---

## v8z4b19v — enable midpoint path point editing

Primeira implementação visível e interativa do pathPoint real: um ponto de passagem
em t=0.5 sobre a curva ativa, arrastável pelo usuário, convertido internamente para
curvePuller legado via pipeline guardado aprovado.

### Objetivo

Exibir e permitir arrastar um **midpoint pathPoint** (círculo branco com borda
colorida) sobre cada segmento de curva ativo. Ao arrastar, o app:

1. Chama `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)` para derivar
   o novo curvePuller via inversão matemática da Bézier quadrática.
2. Cria patch candidato com `createLegacyCurvePatchFromSimulatedPathPointEdit()`.
3. Valida com `validateLegacyCurvePatchCandidate()`.
4. Aplica com `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true })`.

O JSON continua salvando apenas `ctrlPts` / `ctrlPtManual` / `loopCtrlPt`.
Nenhum campo novo. Schema inalterado.

### Matemática

Para Bézier quadrática em t=0.5:

```
C = 2·M − 0.5·P0 − 0.5·P1
```

onde `P0` = frame inicial, `P1` = frame final, `M` = midpoint proposto, `C` = curvePuller derivado.

Implementada em `deriveLegacyCurvePullerFromMidpoint()` (v8z4b19m, intacto).

### Visual

- Círculo branco (`.mid-pathpt`) de 8×8 px, borda colorida.
- Cor: azul (`#00d4ff`) para segmento anterior ao frame ativo; laranja (`#f5a623`)
  para segmento posterior; roxo para loop.
- Aparece apenas sobre segmentos ativos (mesma visibilidade do curvePuller).
- `z-index: 74` (abaixo do curvePuller, z-index 75).

### Funções novas

#### `getMidpointEl(seg)`

Retorna o elemento DOM do midpoint pathPoint para o segmento `seg` (número ou `'loop'`).

#### `startMidpointDrag(seg, segType)`

Inicia o drag de midpoint pathPoint. Chama `pushUndo()`, inicializa `midpointDragState`.

#### `applyMidpointPathPointEdit(seg, segType, nx, ny)`

Pipeline completo: `buildRuntimeCurveModel` → `simulateRuntimePathPointEdit` →
`createLegacyCurvePatchFromSimulatedPathPointEdit` → `validateLegacyCurvePatchCandidate` →
`applyLegacyCurvePatchCandidateToRealState`. Retorna `true` se aplicado.

### Interação

- `pointerdown` no midpoint → `pushUndo()` + `midpointDragState = { seg, segType, didMove: false }`.
- `pointermove` → `applyMidpointPathPointEdit()` + `drawBezier()` + `updateCtrlPts()`.
- `pointerup` → limpa `midpointDragState`; se `didMove`, chama `markProjectDirty('midpoint-pathpoint')`.

### Undo/Redo

- Uma entrada de undo por arrasto (pushUndo no início do drag).
- Não duplica undo com o fluxo do curvePuller existente.

### Loop

Loop é suportado: midpoint pathPoint do loop é exibido quando loop ativo e F1 ou
último frame selecionado. Arrasto usa o mesmo pipeline via `target: { type: 'loop' }`.

### Preservação

- JSON schema inalterado. Nenhum campo novo.
- curvePuller legado continua disponível e funcional.
- Undo/Redo de curvas preservado.
- Preview e MP4 respeitam a curva resultante.
- Salvar MP4 não regrediu.
- Faixa preta superior do Preview intacta.
- Self-test harness da v8z4b19t intacto.

---

## v8z4b19u — route existing curve edits through guarded patch applier

Ativação controlada do novo pipeline interno de curvas para a edição de curvas já
existente. Não é redesenho de UI, não é novo modo de curvas, não é criação de
pathPoint visível, não é alteração de JSON, não é alteração de Preview/MP4.

### Objetivo

Fazer a edição de curva já existente (curva normal e curva de loop) passar pelo
aplicador guardado de patch legado `applyLegacyCurvePatchCandidateToRealState()`,
em vez de alterar `ctrlPts`/`loopCtrlPt` diretamente via `setSegmentCurve()`.

A mudança é arquitetural: a mutação real da curva passa pelo novo pipeline. O
comportamento visual, Undo/Redo, markProjectDirty, renderização e o formato JSON
permanecem idênticos à v8z4b19t.

### Helpers adicionados

#### `createLegacyCurvePatchFromCurrentCurveEdit(target, nextCtrlPt)`

Monta um patch candidato compatível com `validateLegacyCurvePatchCandidate()` e
`applyLegacyCurvePatchCandidateToRealState()` a partir dos valores já calculados
durante a edição de curva normal ou de loop.

**Parâmetros:**
- `target`: `{ type: 'segment', segIndex: number }` ou `{ type: 'loop' }`
- `nextCtrlPt`: `{ nx, ny, t, perpX, perpY }` — todos numéricos finitos

**Retorno (sucesso):**
```json
{
  "ok": true,
  "reason": "ok",
  "target": { "type": "segment", "segIndex": 0 },
  "field": "ctrlPts",
  "index": 0,
  "value": { "nx": ..., "ny": ..., "t": ..., "perpX": ..., "perpY": ... },
  "source": "existingCurveEdit",
  "appliesToSchema": "legacyCurvePuller",
  "applied": false
}
```

Para loop: `field: 'loopCtrlPt'`, `index: null`, `appliesToSchema: 'legacyLoopCurvePuller'`.

O patch é compatível com `validateLegacyCurvePatchCandidate()`.  
`applied === false` sempre (o candidato é aplicado pelo helper seguinte).

#### `applyExistingCurveEditViaPatch(target, nextCtrlPt, options)`

Roteia a edição de curva existente pelo aplicador guardado:

1. Cria patch com `createLegacyCurvePatchFromCurrentCurveEdit()`.
2. Valida com `validateLegacyCurvePatchCandidate()`.
3. Aplica com `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: true, ... })`.
4. Retorna diagnóstico estruturado.

**Opções:**
- `pushUndo`: `false` (Undo gerenciado por `startCtrlDrag`)
- `markDirty`: `false` (dirty gerenciado por `endDrag`)
- `render`: `false` (render gerenciado por `onMove`)

### Integração na edição de curva

`setSegmentTrajectoryPoint()` foi modificado para chamar
`applyExistingCurveEditViaPatch()` em vez de `setSegmentCurve()` diretamente.

**Para segmentos normais:**
- Calcula `nx`, `ny` da posição do ponteiro.
- Calcula `t`, `perpX`, `perpY` via `computeTPerpForSeg()`.
- Monta `nextCtrlPt = { nx, ny, t, perpX, perpY }`.
- Chama `applyExistingCurveEditViaPatch({ type: 'segment', segIndex }, nextCtrlPt, ...)`.
- `applyLegacyCurvePatchCandidateToRealState` aplica em `ctrlPts[segIndex]` e
  marca `ctrlPtManual[segIndex] = true`.

**Para segmento de loop:**
- Calcula `nx`, `ny` da posição do ponteiro.
- Preserva `t`, `perpX`, `perpY` existentes de `loopCtrlPt`.
- Monta `nextCtrlPt = { nx, ny, t, perpX, perpY }`.
- Chama `applyExistingCurveEditViaPatch({ type: 'loop' }, nextCtrlPt, ...)`.
- `applyLegacyCurvePatchCandidateToRealState` aplica em `loopCtrlPt`.

### Preservação do comportamento existente

| Aspecto | Comportamento |
|---------|--------------|
| Visual | Idêntico à v8z4b19t |
| Undo/Redo | `pushUndo()` em `startCtrlDrag` — sem duplicação |
| markProjectDirty | `markProjectDirty('curve')` em `endDrag` — inalterado |
| invalidar MP4 | `markProjectDirty('curve')` em `endDrag` — inalterado |
| render | `drawBezier(); updateCtrlPts()` em `onMove` — inalterado |
| Curva de loop | Incluída no novo pipeline |
| Self-test v8z4b19t | Intacto — não removido, não auto-executado |
| JSON schema | Inalterado — nenhum campo novo |

### O que NÃO foi feito

- `pathPoint` visível não foi criado.
- `handles` não foram criados.
- UI não foi alterada.
- JSON schema não foi alterado (nenhum campo novo).
- Preview matemático não alterado.
- Motor de MP4/export core não alterado.
- Reset global de curvas registrado apenas no ROADMAP (futuro).
- Bug de `_file.json` sem `imageBase64` mantido apenas no ROADMAP.
- Tempos/proporções mantidos no roadmap futuro.
- Velocidade composta mantida no roadmap futuro.
- Criação de frame seguindo curva de loop mantida no roadmap futuro.

### Arquivos alterados

- `index.html`: 2 novos helpers + `setSegmentTrajectoryPoint` modificado + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` continuam sendo o schema persistido atual.
- Arquivos antigos continuam abrindo normalmente.
- Arquivos novos salvam no mesmo formato.
- Nenhum campo novo aparece no JSON.
- Curva aparece igual à v8z4b19t.
- Preview e MP4 percorrem o mesmo caminho da v8z4b19t.
- Curva de loop continua funcionando e aparecendo imediatamente ao ativar loop.
- Undo/Redo da curva normal e da curva de loop continuam funcionando.
- Fallback legado permanece.
- Correções de MP4/export continuam funcionando.
- Botão Salvar MP4 não regredido.
- Faixa preta superior do Preview continua funcionando.
- Limpeza de MP4 ao sair do Preview continua funcionando.

---

## v8z4b19t — add internal curve patch self-test harness

Implementação interna controlada de um harness/diagnóstico para testar o pipeline
completo de patch de curva sem UI, sem mutação real e sem alterar o comportamento
do app. Não é mudança visual, não é mudança de UI, não é mudança de JSON, não é
alteração de Preview/MP4/export, não é alteração de duração/tempos.

### Objetivo

Criar um conjunto de helpers de self-test interno que validam o pipeline:

```
runtime model
→ pathPoint runtime
→ proposedPathPoint simulado
→ simulateRuntimePathPointEdit()
→ createLegacyCurvePatchFromSimulatedPathPointEdit()
→ validateLegacyCurvePatchCandidate()
→ dryRunApplyLegacyCurvePatchCandidate()
→ applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: false })
→ confirmar que estado real permanece intacto
```

### Helpers adicionados

#### `runInternalCurvePatchSelfTestForModel(model, options)`

Harness principal. Recebe um runtime model e:
1. Valida o model.
2. Obtém `pathPoint` de `model.pathPoints[0]` (ou fallback via anchors).
3. Cria `proposedPathPoint` deslocado levemente (`dx=0.02, dy=0.02` por padrão).
4. Chama `simulateRuntimePathPointEdit()`.
5. Chama `createLegacyCurvePatchFromSimulatedPathPointEdit()`.
6. Valida patch com `validateLegacyCurvePatchCandidate()`.
7. Roda `dryRunApplyLegacyCurvePatchCandidate()`.
8. Chama `applyLegacyCurvePatchCandidateToRealState(patch, { allowRealMutation: false, reason: 'self-test-guard' })`.
9. Confirma que a resposta é `real-mutation-disabled`.
10. Tira snapshot antes e depois com `cloneLegacyCurveStateForPatch()`.
11. Confirma via `compareRealCurveStateSnapshot()` que `ctrlPts`/`loopCtrlPt` reais não mudaram.
12. Retorna diagnóstico estruturado.

Opções suportadas:
- `targetType: 'segment' | 'loop'` — default derivado de `model.isLoop`.
- `segIndex: number` — default `model.segmentIndex`.
- `proposedOffset: { dx, dy }` — default `{ dx: 0.02, dy: 0.02 }`.
- `sampleCount: number` — reservado, não usado nesta versão.

Saída típica (sucesso):
```json
{
  "ok": true,
  "reason": "ok",
  "target": { "type": "segment", "segIndex": 0 },
  "simulationOk": true,
  "patchValid": true,
  "dryRunOk": true,
  "guardOk": true,
  "realStateUnchanged": true,
  "appliedToRealState": false
}
```

#### `runInternalCurvePatchSelfTestForSegment(segIndex, proposedOffset)`

Constrói runtime model do segmento informado via `buildRuntimeCurveModel()` e
delega a `runInternalCurvePatchSelfTestForModel()` com `targetType: 'segment'`.
Não altera estado.

#### `runInternalCurvePatchSelfTestForLoop(proposedOffset)`

Se loop estiver ativo e houver modelo de loop válido, roda self-test para loop.
Se loop não estiver ativo, retorna `{ ok: false, reason: 'loop-disabled' }`.
Não altera estado.

#### `runInternalCurvePatchSelfTestSuite()`

Suite completa:
1. Seleciona primeiro segmento normal válido.
2. Roda `runInternalCurvePatchSelfTestForSegment()`.
3. Se loop ativo, roda `runInternalCurvePatchSelfTestForLoop()`.
4. Retorna resumo estruturado com `segmentResult`, `loopResult`, `summary`.

**NÃO roda automaticamente** em Preview, MP4 nem no carregamento do app.

### Exposição para diagnóstico

Os helpers ficam disponíveis em `window.__arcoInternalDiag.curvePatchSelfTest`:

```js
window.__arcoInternalDiag.curvePatchSelfTest.suite()
window.__arcoInternalDiag.curvePatchSelfTest.forSegment(0)
window.__arcoInternalDiag.curvePatchSelfTest.forLoop()
window.__arcoInternalDiag.curvePatchSelfTest.forModel(model, options)
```

Exposição silenciosa: falha de exposição não afeta o app.

### O que NÃO foi feito

- `allowRealMutation: true` não é usado em nenhum fluxo.
- `applyLegacyCurvePatchCandidateToRealState` chamado apenas com `allowRealMutation: false`.
- `pushUndo` não é chamado pelos novos helpers.
- `renderAll` não é chamado pelos novos helpers.
- `markProjectDirty` não é chamado pelos novos helpers.
- `pathPoint` não é editável pelo usuário.
- Nenhum resultado é salvo no JSON.
- Harness não corre automaticamente em nenhum fluxo público.
- UI, Stage, curvas visuais, Preview matemático, MP4/export core, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.
- Bug de `_file.json` sem `imageBase64` mantido apenas no ROADMAP (fase UI/carregamento futura).
- Tempos/proporções mantidos no roadmap futuro.
- Velocidade composta mantida no roadmap futuro.
- Criação de frame seguindo curva de loop mantida no roadmap futuro.

### Arquivos alterados

- `index.html`: 4 helpers de self-test + bloco de diagnóstico + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` reais intocáveis.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export core não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Correção do botão Salvar MP4 da v8z4b19s intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19s — clear MP4 after save and prepare guarded real curve patch applier

Duas mudanças independentes: (A) correção de UX no estado do botão Salvar MP4 após
salvamento no dispositivo; (B) aplicador real guardado de legacy curve patch, sem
conexão com nenhum fluxo público.

### BLOCO A — Correção do botão Salvar MP4 após salvamento

#### Problema

Na v8z4b19r, depois de tocar em **Salvar MP4** para salvar no dispositivo, o botão
permanecia em estado `done` (pronto para salvar o mesmo MP4 novamente). O status
exibia "Salvo! Toque novamente para baixar de novo.", sugerindo reutilização do
mesmo arquivo.

#### Comportamento corrigido

1. Usuário entra no Preview.
2. Usuário gera MP4.
3. Botão fica pronto para salvar.
4. Usuário toca em **Salvar MP4**.
5. O salvamento/download inicia normalmente.
6. O botão volta imediatamente ao estado padrão (label "Salvar MP4", sem `done`).
7. Para salvar novamente, o usuário deve gerar um novo MP4.
8. Sair do Preview continua limpando MP4 como na v8z4b19o.
9. Cancelar export durante geração continua funcionando como na v8z4b19i.

#### Implementação

Adicionada função interna `consumeMp4AfterSave(capturedUrl)` dentro de
`handleGenerate()`:
- Chamada imediatamente após disparar download/share.
- Nulifica `generatedUrl` → impede re-tap de reusar o mesmo MP4.
- Remove classe `done` do botão e restaura label "Salvar MP4".
- Esconde `readyOverlay`.
- Revoga `ObjectURL` apenas após `setTimeout(1000ms)` para segurança no iOS/Safari:
  não revogar no mesmo stack do clique pode causar perda do arquivo no iOS.

Casos cobertos:
- Download direto via `<a>` (fallback não-share).
- Share via `navigator.share` bem-sucedido.
- Fallback de download após `navigator.share` falhar (não-`AbortError`).
- `AbortError` (usuário cancelou dialog de share) → estado `done` mantido para nova
  tentativa sem re-exportar.

Nenhum caso de `clearGeneratedMp4` existente foi removido:
- Saída normal do Preview: `clearGeneratedMp4('preview-exit-normal')` intacta.
- Cancelamento de export: `cancelMp4ExportAndResetState` intacta.
- `markProjectDirty`: `clearGeneratedMp4` intacta.
- Início de novo export: `clearGeneratedMp4('new-export-start')` intacta.

### BLOCO B — Aplicador real guardado de legacy curve patch

#### Objetivo

Preparar um aplicador real de patch candidato ao estado real de curvas, com guardas
fortes, mas deixar esse aplicador completamente desconectado de qualquer fluxo.

A v8z4b19r permite:
```
patch candidate validado → aplicação em draft/cópia → estado real intocado
```

A v8z4b19s prepara:
```
patch candidate validado
  → applyLegacyCurvePatchCandidateToRealState()
  → função guardada/interna
  → ainda não chamada por nenhum fluxo real
```

#### Helpers adicionados

##### `validateRealCurvePatchApplicationOptions(options)`

Valida e normaliza opções para `applyLegacyCurvePatchCandidateToRealState`.
- `allowRealMutation` só é `true` se explicitamente `=== true`.
- `pushUndo`, `markDirty`, `render` idem.
- `reason` defaults para `'internal-prepared-applier'`.
- Detecta inconsistências (ex: `pushUndo: true` sem `allowRealMutation: true`).
- NÃO altera nenhum estado.

##### `applyLegacyCurvePatchCandidateToRealState(patch, options)`

Aplicador real guardado. Comportamento por padrão (guarda principal):
- `options.allowRealMutation !== true` → retorna `{ ok: false, reason: 'real-mutation-disabled', appliedToRealState: false }` imediatamente.
- Não altera `ctrlPts`, `ctrlPtManual` nem `loopCtrlPt`.
- Não chama `pushUndo`, `markProjectDirty` nem `renderAll`.

Quando `allowRealMutation === true` (NÃO ativo nesta versão):
- Valida patch com `validateLegacyCurvePatchCandidate()`.
- Para `field === 'ctrlPts'`: aplica `patch.value` em `ctrlPts[index]`; marca
  `ctrlPtManual[index] = true`.
- Para `field === 'loopCtrlPt'`: aplica `patch.value` em `loopCtrlPt`.
- Chama `pushUndo`/`markProjectDirty`/`renderAll` apenas se `options` permitir.
- Retorna diagnóstico completo.

Restrições absolutas na v8z4b19s:
- Não conectado a UI, Stage, Preview, gesto, botão nem save/load.
- Não chamado por nenhum fluxo público.
- Nenhum JSON novo criado.

##### `dryRunApplyLegacyCurvePatchCandidate(patch)`

Dry-run explícito:
1. Valida patch.
2. Gera draft via `createLegacyCurvePatchApplicationDraft()`.
3. Valida draft via `validateLegacyCurvePatchApplicationDraft()`.
4. Compara before/after via `compareLegacyCurvePatchDraftWithCurrentState()`.
5. Confirma `appliedToRealState: false`.
6. Não altera nenhum estado real.

##### `compareRealCurveStateSnapshot(before, after)`

Diagnóstico passivo para confirmar se o estado real foi alterado entre dois
snapshots gerados por `cloneLegacyCurveStateForPatch()`.
- Compara `ctrlPts` índice a índice (delta `dNx`, `dNy`).
- Compara `loopCtrlPt`.
- Retorna `{ ok, unchanged, deltas }`.
- Não altera nenhum estado.

### O que NÃO foi feito

- `pathPoint` não é editável pelo usuário.
- `applyLegacyCurvePatchCandidateToRealState` não é chamado por nenhum fluxo.
- `allowRealMutation: true` não é usado em nenhum fluxo.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` reais intocáveis.
- `pushUndo` não é chamado pelos novos helpers.
- `renderAll` não é chamado pelos novos helpers.
- `markProjectDirty` não é chamado pelos novos helpers.
- Nenhum resultado é salvo no JSON.
- UI, Stage, curvas visuais, Preview, MP4/export core, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.

### Arquivos alterados

- `index.html`: correção de `handleGenerate()` + 4 helpers novos + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` reais intocáveis.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export core não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Undo/Redo não alterado.
- Save/load não alterado.
- ObjectURL não revogado antes do download começar (iOS/Safari seguro).

---

## v8z4b19r — prepare guarded legacy curve patch applier

Implementação interna controlada de helpers para preparar a aplicação segura de
um legacy curve patch candidate em um draft/cópia do estado legado, sem aplicar
nada automaticamente no estado real do app.
Sem alteração visual, sem alteração de UI, sem alteração de JSON, sem alteração
de Preview, MP4/export ou save/load.

### Objetivo

Preparar a ponte futura:

```
patch candidate validado
  → cloneLegacyCurveStateForPatch()           (snapshot "before")
  → applyLegacyCurvePatchCandidateToDraft()   (draft modificado)
  → futura aplicação real em ctrlPts[segIndex] ou loopCtrlPt
  → futura integração com pushUndo, markProjectDirty e renderAll
```

Nesta versão, o fluxo para no "draft aplicado". Nada é aplicado no estado real,
nada é salvo no JSON, nada é renderizado, nenhuma função de undo/redo é chamada.

### Helpers adicionados

#### `cloneLegacyCurveStateForPatch()`

Retorna uma cópia leve e independente dos campos legados de curva relevantes:

```json
{
  "ctrlPts":      [...],
  "ctrlPtManual": [...],
  "loopCtrlPt":   { "nx": ..., "ny": ..., "t": ..., "perpX": ..., "perpY": ... } | null,
  "loopEnabled":  true | false
}
```

Regras:
- Deep copy de objetos simples (campo a campo, sem `structuredClone`/`JSON.parse`).
- Sem referência mutável aos arrays reais.
- Não altera nenhuma variável global.

#### `applyLegacyCurvePatchCandidateToDraft(draftState, patch)`

Aplica um patch candidato validado em um `draftState` gerado por
`cloneLegacyCurveStateForPatch()`, **nunca** no estado real.

Comportamento:
- Se `patch.field === 'ctrlPts'`: valida `index`, substitui `draftState.ctrlPts[index]`
  por cópia de `patch.value`, marca `draftState.ctrlPtManual[index] = true`.
- Se `patch.field === 'loopCtrlPt'`: substitui `draftState.loopCtrlPt` por cópia de
  `patch.value`.

Retorno:
```json
{
  "ok": true,
  "reason": "ok",
  "draftState": { ... },
  "appliedField": "ctrlPts" | "loopCtrlPt",
  "appliedIndex": 0 | null,
  "appliedToDraft": true,
  "appliedToRealState": false
}
```

Garantias absolutas:
- `ctrlPts` real **não** é alterado.
- `ctrlPtManual` real **não** é alterado.
- `loopCtrlPt` real **não** é alterado.
- `pushUndo` **não** é chamado.
- `markProjectDirty` **não** é chamado.
- `renderAll` **não** é chamado.

#### `createLegacyCurvePatchApplicationDraft(patch)`

Função de alto nível:
1. Valida patch com `validateLegacyCurvePatchCandidate()`.
2. Clona estado legado (`before` e `after` — clones independentes).
3. Aplica patch no clone `after` via `applyLegacyCurvePatchCandidateToDraft()`.
4. Retorna draft aplicado + diagnóstico.

Retorno:
```json
{
  "ok": true,
  "reason": "ok",
  "patchValid": { ... },
  "before": { "ctrlPts": [...], "ctrlPtManual": [...], "loopCtrlPt": ..., "loopEnabled": ... },
  "after":  { "ctrlPts": [...], "ctrlPtManual": [...], "loopCtrlPt": ..., "loopEnabled": ... },
  "appliedField": "ctrlPts" | "loopCtrlPt",
  "appliedIndex": 0 | null,
  "appliedToDraft": true,
  "appliedToRealState": false
}
```

#### `validateLegacyCurvePatchApplicationDraft(result)`

Verifica integridade do resultado de `createLegacyCurvePatchApplicationDraft()`.

Critérios:
1. `result.ok === true`.
2. `before` e `after` existem com arrays válidos.
3. `appliedToDraft === true`.
4. `appliedToRealState === false`.
5. `ctrlPts` real não foi alterado (comparação com snapshot `before`).
6. `loopCtrlPt` real não foi alterado (comparação com snapshot `before`).
7. Arrays têm tamanhos coerentes (`before.ctrlPts.length === after.ctrlPts.length`).

Retorno: `{ ok, reason, checks }`.

#### `compareLegacyCurvePatchDraftWithCurrentState(result)` *(diagnóstico passivo)*

Compara `before`/`after` do draft e confirma que o estado real permanece igual.
Retorna:
- índice alterado no draft;
- delta (`dNx`, `dNy`, `distNorm`) entre valor anterior e valor pós-patch;
- confirmação de que o estado real não foi alterado.

Não altera nenhum estado.

### O que NÃO foi feito

- `pathPoint` não é editável pelo usuário.
- O patch candidato não é aplicado em `ctrlPts` real.
- O patch candidato não é aplicado em `loopCtrlPt` real.
- `pushUndo` não é chamado.
- `renderAll` não é chamado.
- `markProjectDirty` não é chamado.
- MP4 não é invalidado.
- Nenhum resultado é salvo no JSON.
- Nenhum resultado é renderizado.
- UI, Stage, curvas visuais, Preview, MP4/export, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.

### Arquivos alterados

- `index.html`: 5 helpers novos + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` reais intocáveis.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19q — prepare legacy curve patch from simulated path point edit

Implementação interna controlada de helpers para transformar uma edição simulada
de pathPoint em um patch legado candidato.
Sem alteração visual, sem alteração de UI, sem alteração de JSON, sem alteração de
Preview, MP4/export ou save/load.

### Objetivo

Preparar o futuro fluxo:

```
pathPoint movido
  → simulateRuntimePathPointEdit()
  → candidate curvePuller
  → legacy curve patch candidate
  → futura aplicação em ctrlPts[segIndex] ou loopCtrlPt
  → futura integração com undo/redo
```

Nesta versão, o fluxo para no "legacy curve patch candidate". O patch é apenas
um objeto diagnóstico retornado. Nada é aplicado no estado real, nada é salvo no
JSON, nada é renderizado.

### Helpers adicionados

#### `runtimeCurvePullerToLegacyCtrlPt(candidatePuller, fallbackCtrlPt)`

Converte um curvePuller runtime (`{ x, y }` normalizados 0–1) para o shape legado
de ctrlPt persistido (`{ nx, ny, t, perpX, perpY }`).

- `nx` / `ny` vêm de `candidatePuller.x` / `.y`.
- `t`, `perpX`, `perpY` preservados de `fallbackCtrlPt` (ctrlPt atual do schema).
- Se `fallbackCtrlPt` for nulo/inválido, usa defaults seguros: `t = 0.5`, `perpX = perpY = 0`.
- Apenas prepara o objeto — não aplica em `ctrlPts` nem `loopCtrlPt`.

#### `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)`

Constrói o objeto de patch candidato indicando qual campo do schema atual seria
alterado pela edição simulada de pathPoint.

Parâmetros:
- `target`: `{ type: 'segment' | 'loop', segIndex?: number }`
- `simulation`: retorno de `simulateRuntimePathPointEdit()` com `ok === true`

Retorno para `'segment'`:
```json
{
  "ok": true,
  "reason": "ok",
  "target": { "type": "segment", "segIndex": 0 },
  "field": "ctrlPts",
  "index": 0,
  "value": { "nx": ..., "ny": ..., "t": ..., "perpX": ..., "perpY": ... },
  "source": "simulatedRuntimePathPointEdit",
  "appliesToSchema": "legacyCurvePuller",
  "applied": false
}
```

Retorno para `'loop'`:
```json
{
  "ok": true,
  "reason": "ok",
  "target": { "type": "loop" },
  "field": "loopCtrlPt",
  "index": null,
  "value": { "nx": ..., "ny": ..., "t": ..., "perpX": ..., "perpY": ... },
  "source": "simulatedRuntimePathPointEdit",
  "appliesToSchema": "legacyLoopCurvePuller",
  "applied": false
}
```

`applied: false` sempre — o patch não é aplicado nesta versão.

#### `validateLegacyCurvePatchCandidate(patch)`

Verifica se o patch candidato é bem-formado e seguro para uso diagnóstico.

Critérios:
1. `patch` existe.
2. `ok === true`.
3. `target.type` é `'segment'` ou `'loop'`.
4. `field` é `'ctrlPts'` ou `'loopCtrlPt'`.
5. `value.nx` / `value.ny` numéricos finitos.
6. `value.t` numérico finito.
7. `value.perpX` / `value.perpY` numéricos finitos.
8. `applied === false`.

Retorna `{ ok, reason, checks }` com `checks` detalhando cada critério.

#### `createSimulatedPathPointEditPatch(model, target, pathPoint, nextPoint)`

Função de alto nível para desenvolvimento:
1. Chama `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)`.
2. Se simulação ok, chama `createLegacyCurvePatchFromSimulatedPathPointEdit(target, simulation)`.
3. Valida o patch com `validateLegacyCurvePatchCandidate(patch)`.
4. Retorna `{ ok, reason, simulation, patch, patchValid }`.

#### `compareLegacyPatchCandidateWithCurrentControl(model, patch)` *(diagnóstico passivo)*

Compara `patch.value` com o controle atual do schema persistido
(`ctrlPts[segIndex]` ou `loopCtrlPt`). Retorna delta em normalizado e em pixels.
Não altera estado.

### Matemática

Continua usando a inversão já aprovada:
```
C = 2·M − 0.5·P0 − 0.5·P1
```

Conversão para legacy ctrlPt:
- `nx = C.x`, `ny = C.y` (normalizados 0–1, mesma convenção de `ctrlPts[segIndex].nx/ny`).
- `t`, `perpX`, `perpY` preservados do ctrlPt anterior.

### O que NÃO foi feito

- `pathPoint` não é editável pelo usuário.
- O patch candidato não é aplicado em `ctrlPts`.
- O patch candidato não é aplicado em `loopCtrlPt`.
- `pushUndo` não é chamado.
- `renderAll` não é chamado.
- `markProjectDirty` não é chamado.
- MP4 não é invalidado.
- Nenhum resultado é salvo no JSON.
- Nenhum resultado é renderizado.
- UI, Stage, curvas visuais, Preview, MP4/export, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.

### Arquivos alterados

- `index.html`: 5 helpers novos + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `buildRuntimeCurveModel`, `evaluateRuntimeCurveModel`, `evaluateRuntimeCurveSpans`,
  `pathPoints`, `spans`, `curvePuller` reais intactos.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19p — simulate runtime path point edit pipeline

Implementação interna controlada do pipeline de edição simulada de pathPoint runtime.
Sem alteração visual, sem alteração de UI, sem alteração de JSON, sem alteração de Preview, MP4/export ou save/load.

### Objetivo

Preparar o futuro fluxo:

```
pathPoint movido
  → deriveLegacyCurvePullerFromMidpoint()
  → novo curvePuller candidato
  → curva equivalente atualizável no schema legado ctrlPts / loopCtrlPt
```

Nesta versão, o fluxo é apenas simulado e diagnóstico. Nada é aplicado no estado
real, nada é salvo no JSON, nada é renderizado.

### Helpers adicionados

#### `cloneRuntimeCurveModelLight(model)`

Clone leve do modelo runtime de curva. Retorna uma cópia estrutural independente
com todos os campos copiados por valor (deep copy de objetos simples). O modelo
original não é alterado. Base interna para as demais simulações desta versão.

#### `createRuntimeCurveModelWithCandidatePuller(model, candidatePuller)`

Retorna uma cópia runtime do modelo com `controls[0]` substituído pelo
`candidatePuller` proposto. O `pathPoint` derivado (`pathPoints[0]`) e os spans
derivados (`spans[]`) são recalculados internamente dentro da cópia para refletir
o novo curvePuller candidato. O campo `candidate: true` em `controls[0]` do
retorno marca o controle como hipotético.

- Não altera `model` original.
- Não altera `ctrlPts`, `loopCtrlPt` nem nenhum array persistido.
- Não persiste no JSON; não renderizado; não editável.

#### `simulateRuntimePathPointEdit(model, pathPoint, nextPoint)`

Simula o que aconteceria se o `pathPoint` em `t=0.5` fosse movido para `nextPoint`.

Parâmetros:
- `model`: runtime curve model atual.
- `pathPoint`: pathPoint runtime existente (`model.pathPoints[0]`).
- `nextPoint`: novo ponto normalizado proposto, simulando posição futura editada.

Retorno:
```json
{
  "ok": true,
  "reason": "ok",
  "originalPathPoint": { "x": ..., "y": ... },
  "proposedPathPoint": { "x": ..., "y": ... },
  "derivedCurvePuller": { "x": ..., "y": ..., "source": "runtimePathPoint", "t": 0.5 },
  "originalCurvePuller": { "x": ..., "y": ..., "source": "ctrlPts", "manual": false },
  "deltaFromOriginal": { "dxNorm": ..., "dyNorm": ..., "distNorm": ..., "dxPx": ..., "dyPx": ..., "distPx": ... },
  "previewModel": "<runtime model clone com candidatePuller — não persiste, não renderiza>"
}
```

Matemática (inversão da Bézier quadrática):
```
C_novo = 2·M − 0.5·P0 − 0.5·P1
```
Onde M = `nextPoint`, P0 = anchor start, P1 = anchor end.
Unidades: coordenadas normalizadas (0–1).

#### `compareSimulatedPathPointEdit(model, proposedPathPoint)`

Diagnóstico passivo: simula a edição do pathPoint e avalia a diferença entre a
curva original e a curva simulada em 9 amostras uniformes (`t = 0, 0.125, ..., 1`).

Retorna deltas em pixels e em normalizado por amostra. Útil para desenvolvimento
e validação da matemática do pipeline futuro.

### Matemática

Para Bézier quadrática:
- P0 = frame inicial (anchor start, normalizado)
- C = curvePuller (normalizado)
- P1 = frame final (anchor end, normalizado)
- M = pathPoint em t=0.5

Dado novo M:
```
C = 2·M − 0.5·P0 − 0.5·P1
```

Unidades: coordenadas normalizadas 0–1, mesma de anchors, controls, pathPoints e spans.

### O que NÃO foi feito

- pathPoint não é editável pelo usuário.
- Nenhum resultado aplicado em `ctrlPts`.
- Nenhum resultado aplicado em `loopCtrlPt`.
- Nenhum resultado salvo no JSON.
- Nenhum resultado renderizado.
- UI, Stage, curvas visuais, Preview, MP4/export, save/load — inalterados.
- Schema JSON — inalterado. Nenhum campo novo.

### Arquivos alterados

- `index.html`: 4 helpers novos + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `ROADMAP.md`: estado atual atualizado
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas visualmente.
- `buildRuntimeCurveModel`, `evaluateRuntimeCurveModel`, `evaluateRuntimeCurveSpans`,
  `pathPoints`, `spans`, `curvePuller` reais intactos.
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export não alterado.
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Limpeza de MP4 ao sair do Preview da v8z4b19o intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19o — clear generated MP4 when leaving preview

Ajuste de UX / ciclo de vida do MP4 gerado no Preview.
Stage, curvas, JSON, Preview matemático, motor de MP4/export e save/load inalterados.

### Problema

Após gerar um MP4 no Preview, o botão de download continuava disponível mesmo
após o usuário voltar ao Stage e re-entrar no Preview. O MP4 de uma sessão
anterior ficava "pendente", o que era conceitualmente confuso: o usuário podia
baixar um MP4 de uma sessão anterior sem ter gerado um novo.

### Solução

O MP4 gerado agora pertence exclusivamente à sessão atual do Preview.

**Regra principal:** ao sair do Preview e voltar ao Stage, o MP4 pronto é
limpo automaticamente. Na próxima entrada no Preview, o botão retorna ao
estado "Salvar MP4" (gerar novo).

**Implementação:**

`resetPreviewUiState()` — chamada por `stopPreview()` na saída normal (sem
export em andamento) — agora inclui uma chamada a
`clearGeneratedMp4('preview-exit-normal')`.

`clearGeneratedMp4(reason)` já existia (criado na v8z4b19i) e:
- revoga o ObjectURL anterior com `URL.revokeObjectURL()`
- limpa `generatedUrl`, `window._lastVideoBlob`, `window._lastVideoExt`
- esconde `readyOverlay`
- remove classes `done`/`recording` do `btnGenerate`
- restaura label para "Salvar MP4"
- não altera frames, curvas, JSON, Preview matemático nem motor de MP4

O fluxo de cancelamento de export em andamento (`cancelMp4ExportAndResetState`,
da v8z4b19i) permanece intacto e não foi alterado.

### Fluxo após a correção

1. Usuário entra no Preview.
2. Usuário gera MP4 → botão muda para estado "done"/download.
3. Usuário baixa MP4. Ainda no Preview, pode baixar novamente.
4. Usuário toca em **Voltar** → `stopPreview()` → `resetPreviewUiState()`
   → `clearGeneratedMp4('preview-exit-normal')`: MP4 limpo, ObjectURL revogado.
5. Usuário re-entra no Preview → botão está em estado "Salvar MP4" (gerar novo).
6. Se sair durante export ativo → `cancelMp4ExportAndResetState()` (v8z4b19i)
   cancela com segurança; Stage não trava.

### Arquivos alterados

- `index.html`: `resetPreviewUiState()` + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas (`buildRuntimeCurveModel`, `evaluateRuntimeCurveModel`,
  `evaluateRuntimeCurveSpans`, `pathPoints`, `spans`, `curvePuller` intactos).
- JSON não alterado (nenhum campo novo criado).
- Preview matemático não alterado.
- Motor de MP4/export não alterado (WebCodecs/muxer/MediaRecorder intactos).
- Faixa preta superior do Preview (v8z4b19n) intacta.
- Lógica de cancelamento de export da v8z4b19i intacta.
- Undo/Redo não alterado.
- Save/load não alterado.

---

## v8z4b19n — add top safe preview band

Ajuste visual/UX no Preview para iPhone com Dynamic Island.
Stage, curvas, JSON, Preview matemático, MP4/export e save/load inalterados.

### Problema

No iPhone, o canvas do Preview ficava visualmente colado no topo, podendo
invadir a região da Dynamic Island / barra superior do sistema.

### Solução

Adicionado `padding-top: calc(env(safe-area-inset-top, 0px) + 18px)` em
`.preview-canvas-wrap`. O fundo preto de `.preview-screen` preenche
naturalmente a faixa superior, criando o respiro visual necessário.
O canvas continua centralizado (flex `align-items:center;justify-content:center`)
dentro do espaço restante.

### Arquivos alterados

- `index.html`: CSS `.preview-canvas-wrap` + versionamento
- `CHANGELOG.md`: esta entrada
- `QA.md`: checklist da versão
- `pages-deploy-stamp.txt`: stamp de deploy

### Restrições respeitadas

- Stage não alterado.
- Curvas não alteradas.
- JSON não alterado.
- Preview matemático não alterado.
- MP4/export não alterado.
- Botão Salvar MP4 não alterado.
- Painel inferior do Preview não alterado.

---

## v8z4b19m — derive curve puller from runtime path point

Implementação interna controlada do runtime curve model.
Sem alteração de UI, layout, JSON, curvas, Preview matemático, MP4/export ou save/load.

### Objetivo

Adicionar helpers internos para derivar um legacy curvePuller a partir do pathPoint
runtime derivado em t=0.5, preparando o futuro ponto de passagem editável sem alterar
comportamento atual.

### Contexto

- v8z4b19f introduziu pathPoint derivado em runtime em t=0.5.
- v8z4b19h adicionou spans derivados via De Casteljau.
- v8z4b19j adicionou `evaluateRuntimeCurveSpans(model, t)`.
- v8z4b19l fez `evaluateRuntimeCurveModel()` tentar spans derivados primeiro,
  com fallback para `legacyQuadratic`.
- v8z4b19m prepara o caminho inverso: pathPoint em t=0.5 → curvePuller legado equivalente.

### Matemática

Para uma Bézier quadrática com P0=start, C=control, P1=end:

```
B(0.5) = 0.25·P0 + 0.5·C + 0.25·P1 = M
```

Isolando C (curvePuller):

```
C = 2·M − 0.5·P0 − 0.5·P1
```

Todos os pontos em coordenadas normalizadas (0–1) — mesma unidade de anchors,
controls, pathPoints e spans.

### Helpers criados

| Helper | Descrição |
|---|---|
| `deriveLegacyCurvePullerFromMidpoint(start, midpoint, end)` | Inversão da Bézier quadrática: dado um midpoint M (amostra real da curva em t=0.5), calcula o curvePuller C equivalente (C = 2·M − 0.5·P0 − 0.5·P1). Entrada/saída em normalizado (0–1). Retorna `{ x, y, source: 'runtimePathPoint', t: 0.5 }`. |
| `deriveLegacyCurvePullerFromRuntimePathPoint(model, pathPoint)` | Wrapper de conveniência: extrai anchors start/end do runtime model e chama `deriveLegacyCurvePullerFromMidpoint`. Permite derivar o curvePuller diretamente de model.pathPoints[0] sem expor os anchors ao chamador. |
| `compareDerivedPullerWithRuntimeControl(model)` | Diagnóstico passivo: calcula curvePuller derivado do pathPoints[0], compara com controls[0] (curvePuller atual), retorna delta normalizado e delta em pixels. Por construção matemática, o delta deve ser zero. Não altera estado, não corrige nada. |

### Helpers atualizados

| Helper | Descrição |
|---|---|
| `compareRuntimePathWithLegacy(segIndex, t)` | Agora inclui `pullerDiag` no retorno — retorno de `compareDerivedPullerWithRuntimeControl(model)`. Confirma paridade entre curvePuller derivado e controls[0]. Fluxo normal inalterado. |

### Fluxo de derivação (v8z4b19m)

```
pathPoint em t=0.5 (model.pathPoints[0], derivedMidpoint)
  ↓ deriveLegacyCurvePullerFromRuntimePathPoint(model, pathPoint)
  ↓ deriveLegacyCurvePullerFromMidpoint(start, midpoint, end)
  ↓ C = 2·M − 0.5·P0 − 0.5·P1
curvePuller derivado { x, y, source: 'runtimePathPoint', t: 0.5 }
  ↓ compareDerivedPullerWithRuntimeControl(model)
delta vs controls[0] → deve ser zero por construção
```

### Invariantes mantidos

- Resultado visual e matemático do app idêntico à v8z4b19l.
- Curva normal preservada igual à v8z4b19l.
- Curva de loop preservada igual à v8z4b19l.
- Preview e MP4 percorrem o mesmo caminho da v8z4b19l.
- JSON schema inalterado — nenhum campo novo aparece no JSON salvo.
  - `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`: schema persistido, inalterado.
  - `pathPoints`, `handles`, `spans`, `capabilities`: apenas runtime — não aparecem no JSON.
- Undo/Redo da curva normal e da curva de loop continuam funcionando.
- Fallback legado (`evaluateRuntimeLegacyQuadratic`) permanece ativo.
- Correções de MP4/export da v8z4b19i preservadas.
- `evaluateSegmentPath()`, `buildRuntimeCurveModel()`, `validateRuntimeCurveModel()`,
  `evaluateRuntimeCurveModel()` inalterados.
- Nenhum helper novo renderiza, salva, modifica ou substitui estado real.
- pathPoint não é editável, não é renderizado, não é arrastável.
- curvePuller real (controls[0], ctrlPts) não é alterado.

---

## v8z4b19l — route runtime curve model through derived spans

Implementação interna controlada do runtime curve model.
Sem alteração de UI, layout, JSON, curvas, Preview matemático, MP4/export ou save/load.

### Objetivo

Fazer `evaluateRuntimeCurveModel(model, t)` usar os spans derivados como caminho
preferencial quando o modelo estiver em `mode: 'legacyQuadratic'` e os spans forem
válidos, mantendo fallback seguro para o cálculo legacyQuadratic anterior por
anchors + curvePuller.

### Helpers criados / atualizados

| Helper | Descrição |
|---|---|
| `isValidRuntimePoint(pt)` | Helper de validação: retorna `true` se `pt` é objeto não-nulo com `x` e `y` numéricos finitos. Usado para validar o retorno de `evaluateRuntimeCurveSpans` antes de aceitar o resultado. |
| `evaluateRuntimeLegacyQuadratic(model, t)` | Contém exatamente a lógica anterior de `evaluateRuntimeCurveModel` para `mode === 'legacyQuadratic'`: avalia pelos anchors (start/end) + controls[0] (curvePuller) do modelo runtime. Extraído como helper separado para ser o fallback de segurança. |
| `evaluateRuntimeCurveModel(model, t)` | Atualizado: tenta `evaluateRuntimeCurveSpans(model, t)` primeiro (validando com `isValidRuntimePoint`), recai em `evaluateRuntimeLegacyQuadratic(model, t)` se spans forem inválidos ou resultado não finito. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Atualizado: inclui `pathUsed` no retorno — `'spans'` se o caminho preferencial foi usado, `'legacyFallback'` se o fallback foi tomado, `null` se falhou. |
| `evaluateRuntimeCurveSpans(model, t)` | Comentário atualizado: agora documentado como caminho preferencial de `evaluateRuntimeCurveModel()`. Lógica inalterada. |

### Fluxo de evaluateRuntimeCurveModel (v8z4b19l)

```
evaluateRuntimeCurveModel(model, t):
  1. Validar model (validateRuntimeCurveModel).
  2. Se mode === 'legacyQuadratic' e spans válidos (Array, length 2):
     2.1. Tentar evaluateRuntimeCurveSpans(model, t).
          isValidRuntimePoint(resultado)? → retornar resultado. [caminho: 'spans']
  3. Fallback: evaluateRuntimeLegacyQuadratic(model, t). [caminho: 'legacyFallback']
```

### Invariantes mantidos

- Resultado matemático idêntico à v8z4b19k — mesma Bézier quadrática, mesmos dados.
- A rota via spans foi validada em v8z4b19j (delta ≤ 0.001 px vs legado em 7 amostras).
- Curva normal preservada igual à v8z4b19k.
- Curva de loop preservada igual à v8z4b19k.
- Preview e MP4 percorrem o mesmo caminho da v8z4b19k.
- JSON schema inalterado — nenhum campo novo aparece no JSON salvo.
  - `ctrlPts`, `ctrlPtManual`, `loopCtrlPt`: schema persistido, inalterado.
  - `pathPoints`, `handles`, `spans`, `capabilities`: apenas runtime — não aparecem no JSON.
- Undo/Redo da curva normal e da curva de loop continuam funcionando.
- Fallback legado (`evaluateRuntimeLegacyQuadratic`) permanece ativo.
- Correções de MP4/export da v8z4b19i preservadas.
- `evaluateSegmentPath()`, `buildRuntimeCurveModel()`, `validateRuntimeCurveModel()` inalterados.
- spans: NÃO editáveis, NÃO renderizados, NÃO persistidos no JSON.
- pathPoints: NÃO editáveis, NÃO renderizados, NÃO persistidos no JSON.

---

## v8z4b19k — render loop curve immediately on toggle

Bug fix visual: a curva de loop agora aparece imediatamente no Stage ao ativar/desativar loop, sem necessidade de tocar no Stage.
Sem alteração de UI, layout, JSON, curva normal, Preview matemático, MP4/export, save/load ou sistema de spans.

### Problema corrigido

Na v8z4b19j, ao ativar o loop via chip "Loop" no painel Duração, a curva de loop não aparecia imediatamente no Stage. Ela só aparecia depois que o usuário tocava/clicava no Stage — provavelmente porque um evento de toque posterior disparava um render/repaint do compositing layer do Stage.

**Causa raiz:** Em iOS/Safari, quando o painel flutuante está aberto (overlay fixo com z-index:40 cobre o Stage), atualizações de SVG feitas sincronicamente dentro de handlers de toque/click podem não ser composited imediatamente. O GPU compositor do Safari pode manter uma textura cached do Stage e só invalidá-la quando o overlay é removido (ao tocar no Stage para fechar o painel).

### Solução implementada

#### `refreshStageAfterLoopToggle()` — helper novo

Concentra `drawBezier()` + `updateCtrlPts()` em uma função nomeada, chamada via `requestAnimationFrame()` após o toggle de loop. O `requestAnimationFrame` força a execução no contexto do próximo frame de animação, garantindo que o Safari/iOS invalide o compositing layer do Stage e pinte a curva de loop sem aguardar interação do usuário.

**Não substitui `renderAll()`** — apenas complementa o repaint das curvas/handles no próximo frame visual. O `renderAll()` continua sendo chamado sincronicamente para atualizar posições de frames, handle global e autosave.

#### `setFinishing()` — atualizado

- Adicionado `markProjectDirty('loop-toggle')`: ativar/desativar loop altera o caminho de animação e deve invalidar o MP4 gerado.
- Adicionado `requestAnimationFrame(() => refreshStageAfterLoopToggle())` após `renderAll()`.

### Invariantes mantidos

- Curva normal preservada igual à v8z4b19j.
- Curva de loop preservada igual à v8z4b19j (apenas aparece imediatamente).
- Preview e MP4 percorrem o mesmo caminho da v8z4b19j.
- JSON schema inalterado — nenhum campo novo aparece no JSON salvo.
- Undo/Redo da curva normal e da curva de loop continuam funcionando.
- Fallback legado permanece ativo.
- Correções de MP4/export da v8z4b19i preservadas.
- `evaluateSegmentPath()`, `evaluateRuntimeCurveModel()`, `evaluateRuntimeCurveSpans()`, `buildRuntimeCurveModel()` inalterados.
- `ctrlPts`, `ctrlPtManual`, `loopCtrlPt` continuam sendo o schema persistido.

---

## v8z4b19j — evaluate derived runtime curve spans

Implementação interna controlada do runtime curve model.
Sem alteração de UI, JSON, curvas, Preview matemático, MP4/export ou save/load.

### Objetivo

Adicionar um avaliador interno para os spans derivados criados na v8z4b19h,
permitindo avaliar a curva runtime a partir dos dois `quadraticSpan` derivados
(derivedFirstHalf e derivedSecondHalf), preservando matematicamente a trajetória atual.

### Helpers criados / atualizados

| Helper | Descrição |
|---|---|
| `evaluateQuadraticSpanNormalized(span, localT)` | Avalia um `quadraticSpan` em espaço normalizado (0–1) em `localT ∈ [0,1]`. Retorna `{x, y}` normalizado. Helper baixo nível, sem conversão para pixels. |
| `evaluateRuntimeCurveSpans(model, t)` | Avaliador paralelo: avalia a curva pelos dois `quadraticSpan` derivados (v8z4b19h). Seleciona span por `t <= 0.5` / `t > 0.5`, converte `t` global para local, delega para `evaluateQuadraticSpanNormalized`, converte normalizado → pixels. Retorna `{x, y}` em pixels. NÃO substitui `evaluateSegmentPath()` nesta versão. |
| `compareRuntimeSpansWithLegacy(segIndex)` | Diagnóstico passivo: compara `evaluateRuntimeCurveSpans` vs `evaluateRuntimeCurveModel` (runtime) vs `evaluateLegacySegmentPath` (legado) em 7 amostras fixas (t = 0, 0.125, 0.25, 0.5, 0.75, 0.875, 1). Retorna objeto estruturado com `ok`, `passed`, `failed` e `samples[]`. |
| `validateDerivedRuntimeSpans(model)` | Atualizado: substituiu Bézier inline por `evaluateQuadraticSpanNormalized`. Lógica e resultado idênticos à v8z4b19h. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Atualizado: inclui `spanPoint`, `spanDelta`, `spanMatch` no retorno (avaliação via spans). |

### Algoritmo de evaluateRuntimeCurveSpans

1. Recebe `model` e `t` global do segmento, entre 0 e 1.
2. Se `t <= 0.5`, escolhe o primeiro span (`derivedFirstHalf`).
3. Se `t > 0.5`, escolhe o segundo span (`derivedSecondHalf`).
4. Converte `t` global para `t` local do span:
   - Primeiro span: `localT = t / 0.5`
   - Segundo span: `localT = (t - 0.5) / 0.5`
5. Avalia Bézier quadrática via `evaluateQuadraticSpanNormalized`.
6. Converte de normalizado (0–1) para pixels: `x = norm.x * stageW`.
7. Retorna `{ x, y }` em pixels do stage.

### Invariantes mantidos

- `evaluateSegmentPath()` continua usando `anchors + curvePuller` (legacyQuadratic) como caminho preferencial.
- Os spans são apenas runtime: não renderizados, não editáveis, não persistidos no JSON.
- JSON schema inalterado — nenhum campo novo aparece no JSON salvo.
- Comportamento visual e matemático idêntico à v8z4b19i.
- Preview, MP4/export, Undo/Redo, save/load e UI inalterados.
- Fallback legado permanece ativo.
- Correções de MP4/export da v8z4b19i preservadas.

---

## v8z4b19i — fix preview exit during mp4 export

Correção funcional do ciclo de vida de exportação de MP4 ao sair do Preview.
Sem alteração de UI, JSON, curvas, Preview matemático, encoder ou save/load.

### Problema corrigido

Em v8z4b19h (e v8z4b19i-a), se o usuário iniciava a geração de MP4 no Preview
e tocava em Voltar antes da exportação terminar:

- o export continuava em background (`isRecording = true` não era limpo);
- `finishExport()` era chamado ao final, reativando `isPreviewing = true` mesmo
  com o Preview fechado;
- um RAF loop (`loopAfter`) era iniciado sobre uma tela oculta;
- o Stage mostrava ícone de pause indevidamente;
- o Stage ficava travado ou sem responder a toques;
- havia estado híbrido Preview/Stage impossível de resolver sem reload.

### Correção

**1. `stopPreview()` detecta export em andamento e roteia para helper correto**

- Se `isRecording === true`: chama `cancelMp4ExportAndResetState('preview-exit-during-export')`.
- Se `isRecording === false`: chama `resetPreviewUiState()` (saída normal).

**2. `cancelMp4ExportAndResetState(reason)` — novo helper**

- Define `isRecording = false` → loop de encode quebra na próxima iteração.
- Define `exportCancelledFlag = true` → previne `finishExport()` de completar.
- Revoga ObjectURL/blob parcial → export cancelado não fica disponível.
- Chama `resetPreviewPlaybackState()` → limpa UI de playback.
- Restaura botão Salvar MP4 e esconde overlay de progresso.

**3. `exportCancelledFlag` — nova flag de estado**

Guards em três pontos do pipeline de export:
- `finishExport()`: retorna cedo se `exportCancelledFlag === true`.
- WebCodecs path: verifica antes de `encoder.flush()` / `muxer.finalize()`.
- MediaRecorder fallback: verifica antes de criar Blob e chamar `finishExport()`.

**4. Ordenação em `startRecord()`**

`stopPreview()` é chamado ANTES de `isRecording = true` para que o preview
de playback seja parado via `resetPreviewUiState()` (não via cancelamento).
`exportCancelledFlag = false` é resetado logo após `isRecording = true`.

**5. `resetPreviewAndExportStateForImageChange()` atualizado**

Ao forçar `isRecording = false` diretamente (troca de imagem), também define
`exportCancelledFlag = true` para que `finishExport()` não complete um vídeo
gerado a partir de um projeto já alterado.

**6. `resetPreviewUiState()` — novo helper**

Consolida a saída normal do Preview delegando para `resetPreviewPlaybackState()`.
Facilita extensão futura sem duplicar lógica.

### Helpers criados / consolidados

| Helper | Descrição |
|---|---|
| `cancelMp4ExportAndResetState(reason)` | Cancela export em progresso, sinaliza cancelamento, limpa estado completo de Preview+Export. |
| `resetPreviewUiState()` | Saída normal do Preview sem export em andamento. Delega para `resetPreviewPlaybackState()`. |
| `clearGeneratedMp4(reason)` | Revoga ObjectURL, limpa blob, esconde readyOverlay, restaura botão Salvar MP4. NÃO altera Preview, curvas, JSON. |
| `resetPreviewPlaybackState()` | Para rAF, limpa isPreviewing/animFrame/animStart, restaura ícone Play, esconde previewScreen/canvas/timeline. NÃO limpa MP4. |

### Invariantes mantidos

- JSON schema inalterado (nenhum campo novo)
- Curvas, Preview matemático e encoder MP4 inalterados estruturalmente
- Motor de MP4 (WebCodecs + muxer) inalterado além do controle de cancel/reset
- UI inalterada (exceto restauração do estado correto de play/pause)
- save/load inalterado

### Nota sobre v8z4b19i anterior (fix stale MP4 export state)

Esta versão consolida e inclui as correções de v8z4b19i-a:
- ObjectURL não revogado após download (re-download sem re-exportar)
- `markProjectDirty` cobre drag de ctrl-pt (curva normal e loop)

---

## v8z4b19h — derive split runtime curve spans

Implementação interna controlada do runtime curve model.
Adiciona, dentro do modelo runtime, uma estrutura de dois `quadraticSpan` derivados
que representam a curva quadrática legada dividida em dois sub-spans via divisão
De Casteljau em `t=0.5`. Os spans são apenas runtime — não persistidos, não
renderizados, não editáveis, não usados como avaliador principal. O resultado de
`evaluateSegmentPath()` é idêntico à v8z4b19g. Sem alterar UI, JSON, Preview,
MP4, save/load ou comportamento visual.

### Objetivo

Criar uma representação derivada da curva legada dividida em dois spans
quadráticos que passam pelo `pathPoint` derivado em `t=0.5`, preservando
matematicamente a trajetória atual. Prepara o futuro modo baseado em
`pathPoints` reais.

### Helpers adicionados

| Função | Descrição |
|---|---|
| `lerpPointNormalized(a, b, t)` | Interpolação linear entre dois pontos normalizados (0–1). Usado pela divisão De Casteljau. Retorna `{ x, y }` normalizado ou `null` se inválido. |
| `splitLegacyQuadraticAtMidpoint(start, control, end)` | Divide a curva quadrática de Bézier legada em `t=0.5` via De Casteljau. Retorna `{ firstHalfControl: A, midpoint: M, secondHalfControl: B }` em coordenadas normalizadas. |
| `validateDerivedRuntimeSpans(model)` | Diagnóstico passivo: valida que os spans derivados reconstituem matematicamente a curva legada. Verifica midpoint match, estrutura dos spans e reconstituição por amostragem em 9 pontos. Retorna `{ ok, reason, midpointMatch, spanCount, sampleChecks }`. |

### Funções alteradas em index.html

| Função | Alteração |
|---|---|
| `buildRuntimeCurveModel(segIndex)` | `spans[]` adicionado ao retorno: dois `quadraticSpan` derivados (`derivedFirstHalf` e `derivedSecondHalf`) calculados via `splitLegacyQuadraticAtMidpoint`. Todos em coordenadas normalizadas (0–1). `editable: false`, `derived: true`. |
| `validateRuntimeCurveModel(model)` | Aceita e valida `spans[]` opcional. Cada span derivado (`derived: true`) deve ter `kind: 'quadraticSpan'`, `editable: false`, `start/control/end` com `x/y` finitos. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Retorno inclui `spansDiag` via `validateDerivedRuntimeSpans(model)`. |

### Estrutura dos spans derivados (em buildRuntimeCurveModel)

Algoritmo De Casteljau em t=0.5:
```
P0 = frameAnchor inicial (normalizado)
C  = curvePuller legado  (normalizado)
P1 = frameAnchor final   (normalizado)
A  = lerp(P0, C,  0.5)   → controle do primeiro span
B  = lerp(C,  P1, 0.5)   → controle do segundo span
M  = lerp(A,  B,  0.5)   → ponto de divisão = pathPoints[0] (derivedMidpoint)
```

```js
// Em buildRuntimeCurveModel():
spans: [
  {
    kind:     'quadraticSpan',
    role:     'derivedFirstHalf',
    source:   'legacyQuadraticSplit',
    tRange:   [0, 0.5],
    start:   { kind: 'frameAnchor',   role: 'start',            x: P0.x, y: P0.y },
    control: { kind: 'derivedHandle', role: 'firstHalfControl', x: A.x,  y: A.y,  editable: false, derived: true },
    end:     { kind: 'pathPoint',     role: 'derivedMidpoint',  x: M.x,  y: M.y  },
    editable: false, derived: true
  },
  {
    kind:     'quadraticSpan',
    role:     'derivedSecondHalf',
    source:   'legacyQuadraticSplit',
    tRange:   [0.5, 1],
    start:   { kind: 'pathPoint',     role: 'derivedMidpoint',   x: M.x,  y: M.y  },
    control: { kind: 'derivedHandle', role: 'secondHalfControl', x: B.x,  y: B.y,  editable: false, derived: true },
    end:     { kind: 'frameAnchor',   role: 'end',               x: P1.x, y: P1.y },
    editable: false, derived: true
  }
]
```

### Propriedade matemática garantida

- `span1(s) = B_original(s/2)` para `s ∈ [0, 1]` (mapeia global `t ∈ [0, 0.5]`).
- `span2(s) = B_original(0.5 + s/2)` para `s ∈ [0, 1]` (mapeia global `t ∈ [0.5, 1]`).
- `M === pathPoints[0].x/y` (ponto de divisão = midpoint derivado).

### Unidade

Todos os pontos de `spans[]` (`start`, `control`, `end`) são coordenadas normalizadas
`(0–1)`, igual a `anchors` e `controls`. Convenção: `x = pixelX / stageW`, `y = pixelY / stageH`.
Nenhuma mistura com pixels sem conversão explícita.

### Comportamento passivo

- Spans não são usados como avaliador principal (`evaluateSegmentPath` continua com `curvePuller`).
- Spans não são renderizados na UI.
- Spans não são editáveis (`editable: false`).
- Spans não persistem no JSON (`derived: true`).
- `validateDerivedRuntimeSpans` não deve ser chamado durante animação, Preview ou exportação.

### Confirmações

- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19g.
- `pathPoints[0]` (derivedMidpoint) e `spans[0].end` / `spans[1].start` coincidem matematicamente.
- Os dois spans reconstituem a curva legada completa dentro da tolerância `0.000001` normalizado.
- Nenhum campo novo aparece no JSON salvo.
- UI, Preview, MP4, save/load e comportamento visual sem alteração.
- Schema persistido (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`) sem alteração.

---

## v8z4b19g — add runtime path point diagnostics

Diagnóstico interno passivo e controlado do runtime curve model.
Adiciona helpers para validar que o `pathPoint` derivado criado na v8z4b19f é
matematicamente coerente com `evaluateRuntimeCurveModel(model, 0.5)`.
O diagnóstico converte unidades corretamente (normalizado → pixels) antes de
comparar. Tolerância: 0.001 px (mesma de `compareRuntimePathWithLegacy`).
`compareRuntimePathWithLegacy` atualizado para reutilizar
`validateDerivedRuntimePathPoint`. Sem alterar UI, JSON, Preview, MP4,
save/load ou comportamento visual.

### Objetivo

Validar que o `pathPoint` derivado em `t=0.5` (introduzido na v8z4b19f)
é numericamente idêntico à posição avaliada por `evaluateRuntimeCurveModel(model, 0.5)`,
garantindo coerência matemática entre o modelo runtime e o ponto amostrado.

### Helpers adicionados

| Função | Descrição |
|---|---|
| `validateDerivedRuntimePathPoint(model)` | Valida se o `pathPoint` derivado em `t=0.5` é matematicamente coerente com `evaluateRuntimeCurveModel(model, 0.5)`. Converte pathPoint de normalizado para pixels antes de comparar. Tolerância: 0.001 px. Retorna `{ ok, reason, deltaPx, pathPoint, evaluatedPoint }`. |
| `diagnoseRuntimeCurveSegment(segIndex)` | Constrói o modelo runtime de um segmento e executa `validateDerivedRuntimePathPoint`. Retorna `{ segIndex, model, validation }`. |
| `diagnoseRuntimeCurveModel()` | Executa `diagnoseRuntimeCurveSegment` para todos os segmentos ativos. Retorna `{ ok, total, passed, failed, segments }`. |

### Funções alteradas em index.html

| Função | Descrição |
|---|---|
| `compareRuntimePathWithLegacy(segIndex, t)` | Atualizado para reutilizar `validateDerivedRuntimePathPoint(model)` ao verificar `derivedPathPointCheck`. O objeto retornado passa a incluir `diagOk` e `diagReason` para consistência com os novos helpers. |

### Retorno de validateDerivedRuntimePathPoint

```js
// Sucesso:
{ ok: true, reason: 'ok', deltaPx: 0, pathPoint, evaluatedPoint }

// Problema:
{ ok: false, reason: 'missing-pathpoint' | 'invalid-pathpoint' | 'delta-too-large' | 'invalid-model',
  deltaPx, pathPoint, evaluatedPoint }
```

### Critério matemático

- `pathPoint.x/y` estão em coordenadas normalizadas (0–1).
- `evaluateRuntimeCurveModel(model, t)` retorna pixels do stage.
- Conversão explícita antes de comparar: `pathPx = pp.x * stageW`, `pathPy = pp.y * stageH`.
- Delta euclidiano em pixels: `deltaPx = sqrt(dx² + dy²)`.
- Tolerância: 0.001 px — diferença esperada: zero (aritmética idêntica).
- Nunca mistura normalizado com pixels sem conversão explícita.

### Comportamento passivo (diagnóstico)

- Não altera `model`, `pathPoints`, `anchors`, `controls` nem nenhum array persistido.
- Não corrige `pathPoints` automaticamente.
- Não recalcula `ctrlPts`.
- Não altera a curva.
- Não imprime nada no console automaticamente.
- Não bloqueia Preview/MP4.
- Não chamado durante animação, Preview ou exportação.

### Confirmações

- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19f.
- O `pathPoint` derivado não é ponto de controle (não substitui `curvePuller`).
- O `pathPoint` derivado não altera a trajetória.
- O `pathPoint` derivado não é renderizado.
- O `pathPoint` derivado não é editável (`editable: false`).
- O `pathPoint` derivado não persiste no JSON (`derived: true`).
- Nenhum campo novo aparece no JSON salvo.
- UI, Preview, MP4, save/load e comportamento visual sem alteração.
- Schema persistido (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`) sem alteração.

## v8z4b19f — introduce derived runtime path point

Implementação interna controlada: o modelo runtime de curva
(`buildRuntimeCurveModel`) passa a preencher `pathPoints` com um `pathPoint`
derivado em `t=0.5`, calculado pela mesma fórmula quadrática de Bézier do motor,
em coordenadas normalizadas (0–1). O ponto é uma amostra real da trajetória atual
— não é ponto de controle, não substitui `ctrlPts`, não é editável, não é
renderizado e não persiste no JSON. `validateRuntimeCurveModel` atualizado para
validar a estrutura dos `pathPoints` derivados.
`evaluateRuntimeCurveModel` continua ignorando `pathPoints` enquanto
`mode === 'legacyQuadratic'`. Resultado de `evaluateSegmentPath()` idêntico à
v8z4b19e. Sem alterar comportamento visual, Preview, MP4, save/load, JSON ou UI.

### Objetivo

Introduzir o primeiro `pathPoint` derivado dentro do runtime curve model,
calculado a partir da curva quadrática legada atual, sem alterar nenhum
comportamento ativo. Prepara o futuro `pathPoint` editável real sem impacto
na trajetória, UI ou persistência.

### Helper adicionado

| Função | Descrição |
|---|---|
| `evaluateLegacyQuadraticNormalized(start, control, end, t)` | Calcula posição normalizada (0–1) sobre a curva quadrática de Bézier legada. Mesma fórmula de `evaluateRuntimeCurveModel`, aplicada em espaço normalizado. Usada por `buildRuntimeCurveModel()` para calcular o `pathPoint` derivado em `t=0.5`. |

### Funções alteradas em index.html

| Função | Descrição |
|---|---|
| `buildRuntimeCurveModel(segIndex)` | `pathPoints` agora contém um `pathPoint` derivado em `t=0.5`, calculado por `evaluateLegacyQuadraticNormalized`. O ponto tem `kind: 'pathPoint'`, `role: 'derivedMidpoint'`, `source: 'legacyQuadratic'`, `editable: false`, `derived: true`. |
| `validateRuntimeCurveModel(model)` | Atualizado para validar `pathPoints` derivados: cada entry com `derived: true` deve ter `kind: 'pathPoint'`, `t` numérico, `x/y` finitos, `editable === false`. |
| `evaluateRuntimeCurveModel(model, t)` | Comentário explícito: `pathPoints` derivados ignorados enquanto `mode === 'legacyQuadratic'`. Resultado idêntico à v8z4b19e. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Quando `t === 0.5`, inclui `derivedPathPointCheck` verificando que `pathPoints[0]` (normalizados) bate com `evaluateRuntimeCurveModel(model, 0.5)` normalizado. |

### Estrutura do pathPoint derivado (em buildRuntimeCurveModel)

```js
// Em buildRuntimeCurveModel():
pathPoints: [{
  kind:     'pathPoint',       // tipo — diferente de 'curvePuller' e 'frameAnchor'
  role:     'derivedMidpoint', // ponto médio derivado da curva atual
  source:   'legacyQuadratic', // derivado da curva quadrática legada
  t:        0.5,               // parâmetro da curva onde foi amostrado
  x:        <number>,          // normalizado (0–1): pixelX / stageW
  y:        <number>,          // normalizado (0–1): pixelY / stageH
  editable: false,             // não editável nesta versão
  derived:  true               // calculado automaticamente; não vem do JSON
}]
```

### Confirmações

- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19e.
- O `pathPoint` derivado é uma amostra real da trajetória em `t=0.5`.
- O `pathPoint` derivado não é ponto de controle (não substitui `curvePuller`).
- O `pathPoint` derivado não altera a trajetória.
- O `pathPoint` derivado não é renderizado.
- O `pathPoint` derivado não é editável (`editable: false`).
- O `pathPoint` derivado não persiste no JSON (`derived: true`).
- Nenhum campo novo aparece no JSON salvo.
- UI, Preview, MP4, save/load e comportamento visual sem alteração.
- Schema persistido (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`) sem alteração.

## v8z4b19e — prepare runtime path point model

Implementação interna controlada: o modelo runtime de curva
(`buildRuntimeCurveModel`) é ampliado com metadados de preparação futura —
`pathPoints: []`, `handles: []` e `capabilities` — documentando o contrato
interno para futuras evoluções sem alterar qualquer comportamento ativo.
`validateRuntimeCurveModel` e `evaluateRuntimeCurveModel` atualizados para
aceitar e ignorar os novos campos enquanto `mode === 'legacyQuadratic'`.
Sem alterar comportamento visual, Preview, MP4, save/load, JSON ou UI.
Resultado de `evaluateSegmentPath()` numericamente idêntico à v8z4b19d.

### Objetivo

Ampliar o contrato interno do runtime curve model para documentar e preparar
a presença futura de `pathPoints` e `handles`, mantendo o modelo atual em
modo `legacyQuadratic` sem qualquer alteração de comportamento.

### Glossário interno introduzido

| Conceito | Descrição |
|---|---|
| `frameAnchor` | Ponto REAL de câmera ligado a um frame da timeline. Início ou fim de cada segmento. Origem: `frames[frameIndex]`. |
| `curvePuller` | Controle legado QUADRÁTICO atual. Atrai a curva mas não é ponto de passagem real. Origem: `ctrlPts` / `loopCtrlPt`. |
| `pathPoint` | FUTURO: ponto real de passagem intermediária. A curva passa exatamente por ele. Na v8z4b19e: apenas `[]` vazio. |
| `handle/tangent` | FUTURO: controle vetorial de tangência associado a um `pathPoint`. Na v8z4b19e: apenas `[]` vazio. |
| `capabilities` | Metadados informativos do modo atual. Na v8z4b19e: `{ supportsPathPoints: false, supportsHandles: false }`. |

### Funções alteradas em index.html

| Função | Descrição |
|---|---|
| `buildRuntimeCurveModel(segIndex)` | Ampliada com `pathPoints: []`, `handles: []` e `capabilities`. Documentação de glossário adicionada. |
| `validateRuntimeCurveModel(model)` | Atualizada para aceitar `pathPoints` e `handles` como campos opcionais de array (presença ou ausência não afeta validade). |
| `evaluateRuntimeCurveModel(model, t)` | Comentário explícito: `pathPoints`/`handles` ignorados enquanto `mode === 'legacyQuadratic'`. Resultado idêntico à v8z4b19d. |

### Campos adicionados ao objeto runtime (NÃO ao JSON)

```js
// Em buildRuntimeCurveModel():
{
  // ... campos existentes ...
  pathPoints: [],       // contrato runtime vazio — nunca persiste no JSON
  handles:    [],       // contrato runtime vazio — nunca persiste no JSON
  capabilities: {
    supportsPathPoints: false,
    supportsHandles:    false
  }
}
```

### Confirmações

- `evaluateSegmentPath(segIndex, t)` → resultado idêntico à v8z4b19d.
- `pathPoints` e `handles` são apenas contrato runtime vazio — ignorados em avaliação.
- `capabilities` é apenas metadado informativo — não altera avaliação.
- Nenhum campo novo aparece no JSON salvo.
- UI, Preview, MP4, save/load e comportamento visual sem alteração.
- Schema persistido (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`) sem alteração.
- Arquivos salvos em v8z4b19d continuam abrindo normalmente.

---

## v8z4b19d — route segment path through runtime curve model

Implementação interna controlada: `evaluateSegmentPath()` agora usa o modelo
runtime de curva (introduzido na v8z4b19c) como caminho preferencial de avaliação.
O cálculo legado é preservado como fallback automático de segurança.
Sem alterar comportamento visual, Preview, MP4, save/load, JSON ou UI.

### Objetivo

Ativar o modelo runtime de curva como caminho real do motor de trajetória,
garantindo que `evaluateSegmentPath()` passe por
`buildRuntimeCurveModel → validateRuntimeCurveModel → evaluateRuntimeCurveModel`,
mantendo resultado matemático e visual idêntico à v8z4b19c.

### Funções alteradas/criadas em index.html

| Função | Descrição |
|---|---|
| `evaluateLegacySegmentPath(segIndex, t)` | Corpo legado extraído de `evaluateSegmentPath`. Fallback interno de segurança. Não chamar diretamente no fluxo normal. |
| `evaluateSegmentPath(segIndex, t)` | Reimplementada como wrapper seguro: tenta runtime model; em qualquer falha, recai em `evaluateLegacySegmentPath`. |
| `compareRuntimePathWithLegacy(segIndex, t)` | Helper interno de comparação/paridade. Retorna `{ runtime, legacy, match, delta }`. Uso apenas em desenvolvimento/teste — não chamado no fluxo normal. |

### Lógica de evaluateSegmentPath (v8z4b19d)

```
1. buildRuntimeCurveModel(segIndex)
   → null?  → fallback para evaluateLegacySegmentPath
2. validateRuntimeCurveModel(model)
   → false? → fallback para evaluateLegacySegmentPath
3. evaluateRuntimeCurveModel(model, t)
   → null / NaN / Infinity? → fallback para evaluateLegacySegmentPath
4. retorna {x, y} em pixels do stage
```

### Regras de fallback

- `buildRuntimeCurveModel()` retorna `null` → usa legado.
- `validateRuntimeCurveModel()` retorna `false` → usa legado.
- `evaluateRuntimeCurveModel()` retorna `null`, `NaN` ou `Infinity` → usa legado.
- Qualquer exceção inesperada no bloco try/catch → usa legado.
- Preview e MP4 não quebram em nenhum cenário de falha do runtime model.

### Paridade matemática

O resultado de `evaluateSegmentPath(segIndex, t)` é numericamente idêntico ao
da v8z4b19c. Ambos os caminhos (runtime e legado) implementam a mesma fórmula
de Bézier quadrática com os mesmos dados de entrada. `compareRuntimePathWithLegacy`
confirma `match: true` com `delta < 0.001 px` para qualquer entrada válida.

### Schema JSON persistido — sem alteração

- `ctrlPts`, `ctrlPtManual` e `loopCtrlPt` continuam sendo o schema persistido.
- O modelo runtime não aparece no JSON.
- Nenhum campo novo criado (`curvesV2`, `vectorPath`, `handles`, `pathPoints`,
  `runtimeCurveModel` — nenhum destes existe).
- Arquivos existentes abrem normalmente. Arquivos novos salvam no mesmo formato.

### O que NÃO foi alterado

- Nenhuma alteração em UI, layout, cor, ícones, textos visíveis, bolinhas.
- Nenhuma alteração em drag de curvas, `loopCtrlPt`, `ctrlPts`.
- Nenhuma alteração em `sampleSegmentPath()`, `measureSegmentPathLength()` ou
  qualquer outra função de trajetória existente.
- Nenhuma alteração em undo/redo, Preview, MP4, save/load.
- Nenhuma alteração em JSON schema.
- Nenhum campo novo no JSON.
- Nenhum pathPoint real criado. Nenhum handle real criado. Nenhuma caneta criada.

### Nota de roadmap (sem implementação)

Registrado apenas como ideia futura: "Movimento inteligente pode continuar como
configuração global, mas futuramente pode haver exceções/parcialidade por trecho
ou por passagem de frame. Não implementar enquanto o conceito ainda não estiver
fechado."

### Arquivos alterados

- `index.html` — funções refatoradas/criadas + atualização de versão.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b19d.
- `pages-deploy-stamp.txt` — stamp de redeploy.

---

## v8z4b19c — introduce runtime vector curve model

Implementação interna controlada do modelo runtime de curva vetorial.
Sem alterar comportamento visual, Preview, MP4, save/load, JSON ou UI.

### Objetivo

Introduzir uma camada runtime que represente cada segmento como um modelo
vetorial tipado e auto-descritivo (`buildRuntimeCurveModel`), preparado para
evolução futura sem quebrar projetos existentes.

### Funções criadas em index.html

| Função | Descrição |
|---|---|
| `buildRuntimeCurveModel(segIndex)` | Constrói o modelo runtime de curva do segmento. Retorna objeto com `version`, `mode`, `anchors`, `controls`. |
| `validateRuntimeCurveModel(model)` | Valida que o modelo runtime é bem-formado. Retorna `true`/`false`. |
| `evaluateRuntimeCurveModel(model, t)` | Avalia a posição na trajetória do modelo em t ∈ [0,1]. Retorna `{x, y}` em pixels do stage. |

### Estrutura do modelo runtime

```
{
  version: 1,
  mode: 'legacyQuadratic',
  segmentIndex,
  isLoop,
  fromFrameIndex,
  toFrameIndex,
  anchors: [
    { kind: 'frameAnchor', role: 'start', frameIndex, x, y },  // normalizado (0–1)
    { kind: 'frameAnchor', role: 'end',   frameIndex, x, y }   // normalizado (0–1)
  ],
  controls: [
    {
      kind:   'curvePuller',
      role:   'quadraticControl',
      source: 'ctrlPts' | 'loopCtrlPt',  // origem no schema JSON persistido
      x,      // normalizado (0–1)
      y,      // normalizado (0–1)
      manual  // boolean
    }
  ]
}
```

### Contrato de unidades

- `anchors[*].x / .y` e `controls[*].x / .y` são **normalizados (0–1)**.
- Convenção: `x = pixelX / stageW`, `y = pixelY / stageH`.
- `evaluateRuntimeCurveModel()` converte de volta para pixels do stage ao avaliar.
- Retorno de `evaluateRuntimeCurveModel()` é `{x, y}` em **pixels**, idêntico a `evaluateSegmentPath()`.

### Contrato de segmentos

**Segmentos normais:**
- `fromFrameIndex = segIndex`, `toFrameIndex = segIndex + 1`.
- `controls[0].source = 'ctrlPts'`.
- `controls[0].x/y = ctrlPts[segIndex].nx/ny` (normalizados).

**Segmento de loop:**
- `segmentIndex = getLoopSegmentIndex() = frameCount - 1`.
- `fromFrameIndex = frameCount - 1`, `toFrameIndex = 0`.
- `controls[0].source = 'loopCtrlPt'`.
- `controls[0].x/y = loopCtrlPt.nx/ny` (normalizados).

### Paridade matemática

O resultado de `evaluateRuntimeCurveModel(buildRuntimeCurveModel(segIndex), t)` é
numericamente idêntico ao de `evaluateSegmentPath(segIndex, t)` para os mesmos dados
de entrada. `evaluateSegmentPath()` **não foi alterada** — coexistência paralela por segurança.

### Modelo é runtime apenas

- Não persistido no JSON.
- Nenhum campo novo no JSON (`curvesV2`, `vectorPath`, `handles`, `pathPoints`,
  `runtimeCurveModel` — nenhum destes existe).
- `ctrlPts`, `ctrlPtManual` e `loopCtrlPt` continuam sendo o schema persistido.
- Arquivos existentes abrem normalmente. Arquivos novos salvam no mesmo formato.

### O que NÃO foi alterado

- Nenhuma alteração em UI, layout, cor, ícones, textos visíveis, bolinhas.
- Nenhuma alteração em drag de curvas, `loopCtrlPt`, `ctrlPts`.
- Nenhuma alteração em `evaluateSegmentPath()`, `sampleSegmentPath()` ou qualquer
  função de trajetória existente.
- Nenhuma alteração em undo/redo, Preview, MP4, save/load.
- Nenhuma alteração em JSON schema.
- Nenhum campo novo no JSON.
- Nenhum pathPoint real criado. Nenhum handle real criado. Nenhuma caneta criada.

### Arquivos alterados

- `index.html` — funções runtime criadas + atualização de versão.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b19c.
- `pages-deploy-stamp.txt` — stamp de redeploy.

---

## v8z4b19b — audit loop curve path consistency

Auditoria técnica interna: revisar, comentar e consolidar a coerência entre o
tratamento do segmento de loop e o tratamento dos segmentos normais nas funções
de trajetória. Nenhuma alteração de comportamento, motor, visual, UI ou JSON.

### Objetivo

Confirmar e documentar em código o contrato interno entre segmentos normais e
segmento de loop no sistema de curvas legadas, garantindo:
1. Segmentos normais usam `from = i, to = i+1`.
2. Segmento de loop usa `from = frameCount-1, to = 0`.
3. `getLoopSegmentIndex()` retorna `frameCount - 1` somente quando `loopEnabled`.
4. `getSegmentCurvePuller(getLoopSegmentIndex())` acessa `loopCtrlPt` corretamente.
5. `measureLoopCurveLength()` e `measureSegmentPathLength(getLoopSegmentIndex())` são coerentes.
6. O modo constant-speed usa o comprimento correto para cada tipo de segmento.
7. Preview e MP4 continuam lendo o mesmo caminho de câmera.
8. JSON continua igual.

### Funções revisadas em index.html (apenas comentários e guards)

| Função | Tipo de alteração |
|---|---|
| `getActiveSegments` | Comentário de contrato adicionado |
| `getLoopSegmentIndex` | Comentário de contrato expandido |
| `evaluateSegmentPath` | Comentário de contrato adicionado (normal vs loop) |
| `sampleSegmentPath` | Comentário de contrato adicionado |
| `measureSegmentPathLength` | Comentário de coerência com `measureLoopCurveLength` |
| `measureSegmentCurveLength` | Guard defensivo + comentário de exclusão do loop |
| `measureLoopCurveLength` | Comentário de contrato e coerência |
| `redistributeDurationsByCurveLength` | Comentário de contrato constant-speed + loop |

### Guard defensivo adicionado

`measureSegmentCurveLength(segIndex)`: adicionado `typeof segIndex !== 'number' || !isFinite(segIndex)`
antes do guard existente `segIndex < 0 || segIndex >= frameCount - 1`. Protege contra
chamada com `NaN` ou `Infinity` sem alterar comportamento para valores válidos.

### Confirmação de coerência auditada

- `measureSegmentPathLength(getLoopSegmentIndex())` e `measureLoopCurveLength()` medem
  identicamente: P1 = frame[frameCount-1], P2 = frame[0], CP = loopCtrlPt, 64 amostras.
- `redistributeDurationsByCurveLength()` chama `measureSegmentCurveLength(i)` apenas para
  segmentos normais (i < frameCount-1) e `measureLoopCurveLength()` para o loop.
  `measureSegmentCurveLength` retorna 0 para `segIndex >= frameCount-1` (guard correto).
- Preview e MP4 usam `evaluateSegmentPath()` como entrada única — cobre loop e normais.

### O que NÃO foi alterado

- Nenhuma alteração em UI, layout, cor, ícones, textos visíveis.
- Nenhuma alteração em matemática de Bézier.
- Nenhuma alteração em drag de curvas, bolinhas visuais, `loopCtrlPt`.
- Nenhuma alteração em undo/redo, Preview, MP4, save/load.
- Nenhuma alteração em JSON schema (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`).
- Nenhum campo novo criado.
- Nenhuma função nova de comportamento criada.

### Nota de roadmap (sem implementação)

Registrado apenas para referência futura: "Modo de ajuste global de transformação
deve voltar na fase de interface. Ele deve permitir aplicar escala, deslocamento
e rotação a todos os frames do projeto, diferente de ajuste local e diferente de
seleção múltipla."

### Arquivos alterados

- `index.html` — comentários de contrato + guard defensivo + atualização de versão.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b19b.
- `pages-deploy-stamp.txt` — stamp de redeploy.

---

## v8z4b19a — standardize curve puller usage in curve rendering

Patch de padronização interna controlada: substituir chamadas genéricas a
`getSegmentCurve()` por `getSegmentCurvePuller()` nas funções onde o valor
representa claramente o puxador legado da curva (legacy curve puller).

### Objetivo

Continuar a consolidação iniciada em v8z4b18x–v8z4b18y: usar os helpers
semânticos de curvePuller onde o contexto é explicitamente o puxador
quadrático legado. Não é nova função, não é ajuste visual, não é mudança
de comportamento.

### Funções alteradas em index.html

| Função | Linha | Alteração |
|---|---|---|
| `getSegmentPath` | ~4584 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `getSegmentVectorModel` | ~4881 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `evaluateSegmentPath` | ~4985 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `getCtrlPtPos` | ~5424 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `drawBezier` (normal) | ~6437 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `drawBezier` (loop) | ~6466 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `updateCtrlPts` (normal) | ~6500 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `updateCtrlPts` (loop) | ~6514 | `getSegmentCurve` → `getSegmentCurvePuller` |
| `measureSegmentCurveLength` | ~10484 | `getSegmentCurve` → `getSegmentCurvePuller` |

### O que NÃO foi alterado

- `getSegmentCurve()` e `setSegmentCurve()` continuam existindo como primitivos.
- `getSegmentCurvePuller()` internamente chama `getSegmentCurve()` — sem mudança de lógica.
- Chamadas em wrappers de nível inferior (`getSegmentCurvePoint`, interno de `getSegmentCurvePuller`) mantidas como estão.
- Nenhuma alteração em UI, layout, cor, ícones, visual de curva.
- Nenhuma alteração em drag de curvas, bolinha visual, loopCtrlPt.
- Nenhuma alteração em undo/redo, Preview, MP4, save/load.
- Nenhuma alteração em JSON schema (ctrlPts, ctrlPtManual, loopCtrlPt).
- Nenhuma alteração em matemática de Bézier, cálculo de t/perp.
- Nenhum campo novo criado.

### Arquivos alterados

- `index.html` — substituições + atualização de versão/comentários.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b19a.
- `pages-deploy-stamp.txt` — stamp de redeploy.

---

## v8z4b18z — fix loop curve undo

Patch mínimo de correção de bug: editar a curva de loop não entrava no histórico de undo.

### Problema

No handler `pointerdown` do elemento `cpt_loop` (bolinha da curva de loop), o drag era
iniciado atribuindo diretamente `ctrlDragSeg = 'loop'`, ignorando `startCtrlDrag('loop')`.
A função `startCtrlDrag` é responsável por chamar `pushUndo()` antes de iniciar qualquer
drag de curva. Como `startCtrlDrag` não era chamada para o loop, o estado pré-drag não era
salvo no histórico, tornando o undo ineficaz para a curva de loop.

O sistema de undo já suportava `loopCtrlPt`: `captureState()` salva e `restoreState()`
restaura `loopCtrlPt` corretamente. A causa era exclusivamente a chamada direta.

### Correção em index.html

**`cpt_loop` — handler `pointerdown` (linha 6525 antes da correção)**

```js
// ANTES
loopEl.addEventListener('pointerdown', e => { if (!editorPanMode) { e.stopPropagation(); ctrlDragSeg = 'loop'; } });

// DEPOIS
loopEl.addEventListener('pointerdown', e => { if (!editorPanMode) { e.stopPropagation(); startCtrlDrag('loop'); } });
```

`startCtrlDrag('loop')` executa:
1. `document.body.classList.add('dragging')` — consistência com curvas normais.
2. `pushUndo()` — salva o estado antes do drag (correção do bug).
3. `ctrlDragSeg = 'loop'` — mesmo comportamento de antes para o restante do drag.
4. A guarda `if (typeof seg === 'number' && seg >= 0)` em `setSegmentCurveManual` não
   é ativada para `'loop'` — comportamento existente preservado.

### Arquivos alterados

- `index.html` — correção do handler + atualização de versão/changelog/comentários.
- `CHANGELOG.md` — esta entrada.
- `QA.md` — checklist atualizado para v8z4b18z.
- `pages-deploy-stamp.txt` — stamp de redeploy.

### Restrições respeitadas

Sem alteração de UI, layout, cor, texto visível, ícones, visual de curva, Preview, MP4,
save/load, JSON schema, curvesV2, vectorPath, handles, pathPoints, framePauses,
segDurations, filename, refatoração ampla. Patch restrito ao handler `pointerdown` do
`loopEl` e à atualização de versão.

---

## v8z4b18y — centralize legacy curve puller access

Patch de centralização gradual do acesso ao puxador de curva legado. Usa os helpers
introduzidos na v8z4b18x (`getSegmentCurvePuller`, `isSegmentCurvePullerManual`,
`setSegmentCurvePuller`) em funções internas claramente relacionadas a leitura e
escrita de curva. Sem alterar motor, visual, schema JSON, UI, save/load ou comportamento.

### Alterações em index.html

**`insertFrameAfterActive()` — leitura do puxador de curva do segmento ativo**
- `const cpSrc = ctrlPts[a]` → `getSegmentCurvePuller(a)`.
- Contexto: cálculo do ponto médio na curva quadrática para posicionar o frame inserido.
- Substituição segura: leitura direta sem efeitos colaterais.

**`syncCtrlPtsForFrame()` — sincronização do puxador após mover frame**
- `if (!ctrlPts[seg]) continue` → `const cp = getSegmentCurvePuller(seg); if (!cp) continue`.
- `if (!ctrlPtManual[seg])` → `if (!isSegmentCurvePullerManual(seg))`.
- Escrita de `ctrlPts[seg].nx/ny/t/perpX/perpY` → `setSegmentCurvePuller(seg, {...})`.
- Leitura de `ctrlPts[seg]` para recomputar t/perpX/perpY → via variável `cp` retornada pelo helper.
- Substituição segura: `setSegmentCurvePuller` usa `Object.assign(ctrlPts[seg], ...)` internamente,
  comportamento idêntico. `cp` referencia o mesmo objeto que `ctrlPts[seg]`.

**`getStateAtT()` — leitura do puxador no motor de animação**
- `let cp; if (loopEnabled && seg === frameCount - 1) { cp = loopCtrlPt || … } else { cp = ctrlPts[seg] || … }`
  substituído por:
  `const cp = getSegmentCurvePuller(seg) || { midpoint via % frameCount }`.
- O helper já encapsula a lógica loop vs normal: retorna `loopCtrlPt` para o trecho de loop,
  `ctrlPts[seg]` para trechos normais.
- Fallback usa `% frameCount` — matematicamente idêntico às expressões originais para todos os casos.

**`measureLoopCurveLength()` — leitura do puxador do trecho de loop**
- `const cp = loopCtrlPt || {midpoint}` → `getSegmentCurvePuller(getLoopSegmentIndex()) || {midpoint}`.
- Substituição segura: função só executa quando `loopEnabled && frameCount >= 2`,
  então `getLoopSegmentIndex()` retorna `frameCount - 1` (válido).

### Sem alteração

Motor, Preview, MP4, save/load, schema JSON (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`,
`framePauses`, `segDurations`), UI, layout, cores, ícones, comportamento visual da curva,
arrastar puxador, reset de curva, loop, filename, compatibilidade com projetos antigos.
Nenhum campo novo no JSON.

---

## v8z4b18x — clarify legacy curve puller architecture

Patch preparatório e conceitual: consolida o ponto de controle atual da curva
como **legacy curve puller**, reforça nomenclatura técnica interna sem alterar
motor, visual, schema JSON, comportamento ou UI.

### Alterações

**Declaração do legacy curve puller (ctrlPts / loopCtrlPt)**
- Bloco de comentário expandido junto à declaração de `ctrlPts[]` e `ctrlPtManual[]`.
- Deixa explícito que `ctrlPts[seg]` é o **puxador de curva legado** (legacy curve puller)
  do trecho `seg` — não é frame, não é ponto de passagem, não é handle vetorial.
- `loopCtrlPt` também é documentado como legacy curve puller do trecho de loop (N→1).
- Referencia os novos helpers nomeados de curvePuller para facilitar o entendimento.

**Novos helpers — Legacy Curve Puller Helpers (v8z4b18x)**

Adicionados logo após a seção "Extended Curve Segment Helpers":

| Helper | Equivale a | Descrição |
|---|---|---|
| `getSegmentCurvePuller(seg)` | `getSegmentCurve(seg)` | Lê o puxador legado do trecho |
| `setSegmentCurvePuller(seg, puller, opts)` | `setSegmentCurve(seg, puller, opts)` | Escreve o puxador legado |
| `isSegmentCurvePullerManual(seg)` | `isSegmentCurveManual(seg)` | Lê flag de ajuste manual |
| `setSegmentCurvePullerManual(seg, bool)` | `setSegmentCurveManual(seg, bool)` | Escreve flag de ajuste manual |

Esses helpers chamam internamente os primitivos da v8z4b18u. Não substituem em
massa as chamadas existentes — são fornecidos para código novo onde o contexto
de "puxador legado" deve ser explícito.

**`resetSegmentCurve` — comentário técnico**
- Comentário expandido deixando claro que a função reseta o legacy curve puller
  (ctrlPts[seg] para trechos normais, loopCtrlPt para o loop) para o ponto médio.

**Comentários em Curve Access Helpers e Extended Curve Segment Helpers**
- Seção "Curve Access Helpers" atualizada para referenciar v8z4b18x e os novos helpers.
- Seção "Extended Curve Segment Helpers" atualizada para referenciar v8z4b18x.
- `getLoopSegmentIndex`: comentário reforça que `loopCtrlPt` é legacy curve puller.

### Notas técnicas para evolução futura

- `ctrlPts[seg]` é o puxador quadrático legado — deve continuar salvo/carregado
  no JSON para compatibilidade com projetos antigos.
- `ctrlPtManual[seg]` continua como flag de ajuste manual — sem alteração.
- `loopCtrlPt` continua como legacy curve puller do loop — não migrado nem convertido.
- Futuramente, o novo sistema vetorial poderá derivar o puxador de handles/tangentes
  ou mantê-lo como ferramenta rápida de edição ("modo curvePuller").
- Nenhum campo novo no JSON (sem curvesV2, vectorPath, handles, pathPoints, etc.).

### Sem alteração

Motor, Preview, MP4, marca d'água, `framePauses`, `ctrlPts` (schema), `loopCtrlPt`
(schema), `ctrlPtManual`, velocidade constante, Movimento/Rotação/Escala Inteligente,
zoom contextual, layout, UI, cores, ícones, comportamento visual do Stage,
arrastar puxador de curva, reset de curva, loop, save/load, filename, schema JSON.

---

## v8z4b18w — fix project save filename preview and suffix

Patch de UX no modal "Salvar projeto": corrige o fluxo de nome do arquivo, exibe
prévia dos nomes finais antes de salvar e elimina duplicação de sufixos.

### Alterações

**Nome-base sugerido limpo**
- A sugestão inicial do campo de nome não inclui mais prefixos genéricos de câmera
  (`img_`, `IMG_`, `photo_`, etc.), evitando nomes redundantes como `arco_img_5163`.
- Padrão novo: `arco_5163` (campo); arquivo final: `arco_5163_img.json` ou `arco_5163_file.json`.
- Lógica: strip de `^(img|image|photo|foto|pic|dscf?|dcim|screenshot|captura)[_\-]?`
  do `_imageBaseName` antes de construir o `suggestedBase`.

**Prévia do nome final antes de salvar**
- Adicionado bloco `#saveModalPreview` ao modal com dois spans:
  `#savePreviewImg` e `#savePreviewFile`.
- A prévia é atualizada em tempo real conforme o usuário edita o campo.
- Exemplo exibido:
  - `Com imagem: arco_5163_img.json`
  - `Sem imagem: arco_5163_file.json`

**Função `normalizeBaseName(name)` — v8z4b18w**
- Nova função pública que limpa o nome digitado antes de montar o filename final:
  1. Remove extensão `.json` no final.
  2. Remove sufixo `_img` ou `_file` (com separador `_` ou `-`) para evitar duplicação.
  3. Substitui caracteres problemáticos para filename (`/ \ : * ? " < > |`) por `_`.
  4. Trim de espaços e underscores nas bordas.
  5. Colapsa múltiplos `__` consecutivos em `_`.
  6. Fallback para `arco_projeto` se o resultado ficar vazio.

**`promptSaveProject` atualizado**
- Usa `normalizeBaseName` no momento do clique (lê o valor atual do input).
- Armazena o nome-base normalizado (sem `_img`/`_file`) em `_lastProjectFileName`.
- Botão "Salvar com imagem": `base + '_img'` → `doSaveDirect(true, …)`.
- Botão "Salvar sem imagem": `base + '_file'` → `doSaveDirect(false, …)`.
- Prévia atualizada via `input.oninput`.

**`openSaveModal` atualizado**
- Usa o mesmo `cleanBase` para sugestão e inicializa a prévia.

**`confirmSaveModal` atualizado**
- Usa `normalizeBaseName` + aplica sufixo correto (`_img` ou `_file`) conforme `includeImage`.

**`doSaveDirect` — guard contra dupla extensão**
- Remove `.json` do `nome` antes de adicionar `.json` (safeguard contra edge cases).

### Exemplos de comportamento

| Usuário digita | Salvar com imagem | Salvar sem imagem |
|---|---|---|
| `arco_5163` | `arco_5163_img.json` | `arco_5163_file.json` |
| `teste_img` | `teste_img.json` | `teste_file.json` |
| `teste_file` | `teste_img.json` | `teste_file.json` |
| `teste.json` | `teste_img.json` | `teste_file.json` |
| `teste/projeto:18w?` | `teste_projeto_18w__img.json` | `teste_projeto_18w__file.json` |

### Sem alteração

Motor, Preview, MP4, marca d'água, `framePauses`, `ctrlPts`, `loopCtrlPt`, velocidade constante,
Movimento/Rotação/Escala Inteligente, zoom contextual, layout geral, UI estrutural,
JSON schema, fluxo de abrir projeto, salvar desabilitado no estado inicial vazio.

---

## v8z4b18v — update watermark to arcomotion.app

Patch de texto: atualiza exclusivamente a marca d'água do Preview e exportação MP4.

### Alteração

- `WATERMARK_TEXT` atualizado de `'Arco Motion App'` para `'arcomotion.app'`.
- Centralizado na constante `WATERMARK_TEXT`; nenhuma string duplicada.
- Posição, fonte, tamanho, cor, opacidade, sombra e alinhamento da marca d'água permanecem idênticos.
- Preview e MP4/exportação usam o mesmo `WATERMARK_TEXT`; consistência garantida.
- Nome do produto (Arco Motion App) mantido em títulos, menus e metadados — somente a marca d'água foi alterada.

### Sem alteração

Motor, UI, layout, JSON schema, `framePauses`, `ctrlPts`, `loopCtrlPt`, loop, velocidade constante,
Movimento/Rotação/Escala Inteligente, zoom contextual, salvar desabilitado no estado vazio.

---

## v8z4b18u — curve segment access foundation

Inicia a fundação técnica do novo sistema de curvas. Camada interna de helpers para
acessar, ler e atualizar curvas por trecho sem espalhar lógica condicional pelo código.
Preserva totalmente o sistema visual e de dados existente (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`).

### Novos helpers

- `getNormalSegmentCount()` — retorna o número de trechos normais (F1→F2, F2→F3, etc.) independente de `loopEnabled`.
- `getLoopSegmentIndex()` — retorna o índice do segmento de loop (N→1) quando loop está ativo, ou `-1`.
- `getSegmentCurvePoint(segIndex)` — retorna `{x, y}` normalizados do puxador de curva do trecho, ou `null`.
- `setSegmentCurvePoint(segIndex, point, options)` — define `{x, y}` normalizados do puxador de curva. Atalho sobre `setSegmentCurve()`.

### Helpers existentes ampliados

- Seção "Curve Access Helpers" atualizada para v8z4b18u com documentação do conceito de `legacyCurvePuller`.
- Comentário técnico adicionado à declaração de `ctrlPts[]` e `loopCtrlPt` explicando que são puxadores auxiliares legados:
  - não são frames (frameAnchor);
  - não são pontos de passagem (pathPoint);
  - não são handles vetoriais;
  - são compatíveis com projetos antigos;
  - futuramente poderão coexistir com handles/tangentes.

### Substituições seguras de acesso direto

Funções de leitura/desenho migradas para usar os helpers, sem alterar comportamento:

- `evaluateSegmentPath()` — substituído `seg.isLoop ? loopCtrlPt : ctrlPts[segIndex]` por `getSegmentCurve(segIndex)`.
- `getSegmentVectorModel()` — substituído acesso direto a `loopCtrlPt`/`ctrlPts[segIndex]` e `ctrlPtManual[]` por `getSegmentCurve()` / `isSegmentCurveManual()`.
- `drawBezier()` — substituído `ctrlPts[seg]` por `getSegmentCurve(seg)`; loop usa `getSegmentCurve(getLoopSegmentIndex())`.
- `updateCtrlPts()` — loop usa `getSegmentCurve(getLoopSegmentIndex())` para posição e visibilidade da bolinha.
- `getCtrlPtPos()` — substituído `ctrlPts[seg]` por `getSegmentCurve(seg)`.

### Acesso direto preservado (risco alto)

Mantido acesso direto em: `syncCtrlPtsForFrame()`, `buildProjectData()`, `applyFrameData()`,
`applyState()`, `addFrame()`, operações de splice em `ctrlPts[]`, e `getStateAtT()` (motor de animação).
Esses pontos serão migrados em versões futuras de forma controlada.

### Sem alteração de

- Visual (curvas, puxadores, cores, tamanhos, posições).
- UI (layout, textos, ícones, menus).
- Motor de animação (Preview, MP4, easing, pausas, velocidade constante, loop).
- JSON schema (nenhum campo novo; projetos antigos abrem normalmente).
- `framePauses`, `segDurations`, Movimento/Rotação/Escala Inteligente, zoom contextual.

## v8z4b18t — fix watermark brand and disable empty project save

- Marca d'água corrigida para **Arco Motion App** em Preview e exportação MP4 (era `Arc Motion`).
- Constante `WATERMARK_TEXT` atualizada para `'Arco Motion App'`; posição, tamanho, opacidade e alinhamento inalterados.
- Nome visível do produto atualizado para **Arco Motion App** em: `<title>`, `apple-mobile-web-app-title`, cabeçalho de Configurações e `navigator.share`.
- Adicionada função `canSaveProject()`: retorna `true` apenas quando há imagem carregada e frames válidos (`imgNatW > 0 && frameCount > 0`).
- Adicionada função `updateSaveProjectState()`: sincroniza visual disabled/ativo nos botões "Salvar projeto" (toolbar e settings) com base em `canSaveProject()`.
- "Salvar projeto" aparece cinza/desabilitado no estado inicial vazio; fica ativo após carregar imagem ou abrir projeto válido; volta a desabilitado após Reset.
- `promptSaveProject()` retorna imediatamente quando `canSaveProject()` é false (sem gerar JSON vazio nem abrir modal).
- Versão do JSON salvo: `v8z4b18t` via `APP_VERSION`.
- `framePauses` continua sendo salvo e carregado corretamente (sem alteração na lógica de persistência).

## v8z4b18s — rename app to Arc Motion and fix project version metadata

- Nome visível do app atualizado para **Arc Motion** em todos os textos visíveis ao usuário: `<title>`, `apple-mobile-web-app-title`, cabeçalho de Configurações, marca d'água do Preview/MP4 e `navigator.share`.
- Marca d'água centralizada na constante `WATERMARK_TEXT = 'Arc Motion'`; mesma posição, tamanho, opacidade e alinhamento.
- Corrigido `version` no JSON salvo/exportado: era hardcoded `'v8y3'`, agora usa `APP_VERSION` dinamicamente (`v8z4b18s`).
- Projetos antigos com `version: 'v8y3'` continuam abrindo normalmente (nenhuma alteração de schema ou migração).
- `framePauses` continua sendo salvo e carregado corretamente (sem alteração na lógica de persistência).

## v8z4b18r — fix frame pause persistence and stale load state

Patch de correção crítica de persistência de pausas por frame: resolve dois bugs independentes que faziam pausas configuradas no painel Duração desaparecerem ao reabrir projetos após recarregar o app.

### Bugs corrigidos

#### Bug 1 — Pausas não persistidas no JSON (save)

**Causa raiz**: `buildProjectData()` serializava `framePauses` sem garantir que o array estava sincronizado com `frameCount`. Após `applyTemplate()` (que zera `framePauses.length = 0`), se o usuário salvasse antes de qualquer operação que chamasse `ensureFramePauses()` (abrir painel, adicionar frame, etc.), o JSON recebia `"framePauses": []`. Na importação, `[] vazio` caia no Caso 2 (zeros), descartando qualquer pausa que o usuário tivesse configurado na sessão atual.

**Correção**: `buildProjectData()` chama `ensureFramePauses()` como primeira linha. Garante array com exatamente `frameCount` entradas antes de serializar, independente do estado interno.

#### Bug 2 — Falso positivo de "pausas restauradas" na mesma sessão (load)

**Causa raiz**: O path assíncrono de carregamento de projeto com imagem embutida (`data.hasImage = true`) retornava imediatamente de `applyProjectData()` enquanto a imagem era decodificada. Durante esse intervalo, `framePauses[]` da sessão anterior continuava em memória. A UI do painel Duração exibia os valores antigos, criando a falsa impressão de que as pausas do arquivo carregado estavam presentes. Após recarregar o app (memória limpa), o mesmo arquivo abria com zeros — revelando que o arquivo nunca tinha as pausas.

**Correção**: `applyProjectData()` limpa `framePauses.length = 0` como primeira ação, antes de qualquer desvio para o path assíncrono. `applyFrameData()` restaura os valores corretos do JSON após a imagem estar pronta.

### Outros ajustes

- **`normalizeImportedFramePauses()`**: logging promovido de `_arcoDebug`-only para sempre ativo (`console.info`), incluindo Caso 2 com diagnóstico do campo `framePauses` ausente/vazio. Facilita rastreamento em campo sem ativar modo debug.
- **`doSaveDirect()`**: log de diagnóstico que exibe `frameCount`, `framePauses.length` e contagem de pausas não-zero no momento do save. Permite verificar em console se os valores foram serializados corretamente.
- **Comentários de versão** atualizados para `v8z4b18r`.

### Critérios de aceite verificados (análise estática)

| Cenário | Comportamento esperado | Status |
|---------|----------------------|--------|
| Salvar com pausas configuradas | `framePauses` no JSON tem os valores corretos | ✓ (ensureFramePauses() antes do save) |
| Salvar sem abrir painel Duração | `framePauses: [{duration:0},…]` com `length = frameCount` | ✓ |
| Carregar em nova sessão | Pausas do JSON restauradas, sem herdar sessão anterior | ✓ |
| Carregar na mesma sessão | Estado anterior limpo imediatamente | ✓ |
| Arquivo sem `framePauses` | Abre com zeros, sem inventar valores | ✓ (Caso 2) |
| Arquivo com `framePauses: []` vazio | Abre com zeros (mesmo que sessão anterior tivesse pausas) | ✓ |
| Arquivo com `framePauses` válido | Valores restaurados exatamente | ✓ (Caso 1) |
| Loop + pausas | Loop e pausas independentes, ambos preservados | ✓ |

### O que NÃO foi alterado

- Visual do Stage, curvePuller, zoom contextual.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON — nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`.
- Scaffold vetorial — preservado da v8z4b18n.
- UI geral (design, cores, layout, painel inferior).
- Modo Curvas, pontos de passagem, handles — não implementados.
- Preview, MP4 — sem alteração (já usavam `framePauses[]` corretamente).
- Comportamento de curvas, loop, velocidade constante, Movimento/Rotação/Escala Inteligente.

---

## v8z4b18q — normalize imported frame pauses

Patch de correção de importação de pausas por frame: garante que projetos salvos com pausas por frame as tenham corretamente restauradas ao carregar, e que projetos sem pausas fiquem zerados sem inventar valores.

### O que foi corrigido

- **`normalizeImportedFramePauses(projectData, frameCount)`** — novo helper centralizado para importação de pausas. Detecta formatos atuais (`framePauses[]`) e legados (`finishMode='pause'`/`finishDuration`); nunca sobrescreve pausas carregadas com defaults após o load.
- **`migrateLegacyProjectData`** — seção de framePauses simplificada: não cria mais array de zeros (responsabilidade movida para `normalizeImportedFramePauses`). Continua neutralizando `pauseDuration` e `easeMode='pause'`.
- **`applyFrameData`** — chamada ao normalizador posicionada após o ajuste defensivo de `frameCount` (v8z4b18o), garantindo que o array de pausas tenha exatamente o número correto de entradas.
- **Migração legada finishMode='pause'** — integrada ao normalizador; `finishDuration` é mapeado para o último frame apenas quando `finishMode='pause'` está explicitamente presente no JSON.

### Casos cobertos

| Projeto | Comportamento |
|---------|---------------|
| Sem pausas (`framePauses` ausente ou `[]`) | Zeros, sem inventar valores |
| Com pausas por frame (`framePauses: [{duration:2.5},…]`) | Preserva todos os valores |
| Legado `finishMode='pause'` + `finishDuration` sem `framePauses` | Último frame recebe `finishDuration` |
| Legado `easeMode='pause'` + `pauseDuration` | Zeros (target por frame desconhecido) |
| Loop ligado + pausas | Loop e pausas preservados independentemente |

### O que NÃO foi alterado

- Visual do Stage, curvePuller, zoom contextual.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON — nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`.
- Scaffold vetorial — preservado da v8z4b18n.
- UI geral (design, cores, layout, painel inferior).
- Modo Curvas, pontos de passagem, handles — não implementados.
- Preview, MP4 (exceto que agora respeitam pausas corretamente carregadas).

---

## v8z4b18p — consolidate import fixes after duplicate 18o merges

Patch de consolidação e rastreabilidade: corrige a situação de dois PRs distintos mergeados com o mesmo rótulo `v8z4b18o`, garantindo histórico, CHANGELOG e QA consistentes. Nenhum avanço funcional. Consolida todos os fixes de importação da v8z4b18o em uma versão unificada com número correto.

### O que foi consolidado

- **Robustez para `imageBase64` ausente/inválido/placeholder** — `isValidImageBase64()` rejeita `null`/`undefined`, não-string, string vazia, strings com `<<` (placeholder), strings sem prefixo `data:image/`. Projetos com imagem placeholder carregam normalmente sem a imagem (fluxo "selecione a imagem para continuar").
- **`applyProjectData()`** — usa `isValidImageBase64()` em vez de truthy bruto; `img.onerror` como safety net; `console.warn` informativo quando placeholder detectado.
- **`restoreAutosave()`** — usa `applyFrameData(data)` em vez de `restoreState(data)`, corrigindo TypeError silencioso que impedia restauração de estado e pausas.
- **`renderAll()`** — null-check em `frames[i]` antes de acessar `.x/.y/.w/.h`.
- **`applyFrameData()`** — guard de `frameCount` vs `frames.length` após load.
- **`loadProjectFromFile()` / `loadProjectFromJson()`** — `console.error` no catch para diagnóstico.
- **Preservação de pausas** — `framePauses` restaurado corretamente via `applyFrameData`.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON — nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`.
- Scaffold vetorial (`getSegmentPathMode`, `getSegmentVectorModel`) — preservado da v8z4b18n, sem alterações.
- `migrateLegacyProjectData()` — comportamento de migração e preservação de pausas inalterado.
- Visual do Stage, curvePuller, zoom contextual, Undo/redo.
- UI geral (design, cores, layout, painel inferior).
- Modo Curvas, pontos de passagem, handles — não implementados nesta versão.

### Histórico desta consolidação

Dois PRs foram mergeados com o rótulo `v8z4b18o`:
- PR #106 (`fix-project-load-pauses`): corrigiu `restoreAutosave`, `renderAll`, `applyFrameData`, logs de load.
- PR #107 (`fix-project-import`): adicionou `isValidImageBase64`, `img.onerror` em `applyProjectData`.

A versão `v8z4b18p` registra formalmente a combinação dos dois patches como versão única, sem reverter nenhum merge.

---

## v8z4b18o — robust project import and pause preservation

Patch de robustez no importador de projetos: corrige falha silenciosa que travava o load de projetos com `imageBase64` ausente, inválido ou placeholder (ex.: `"<<mesma imageBase64 do original>>"`). Adiciona `isValidImageBase64()` para validar o campo antes de tentar decodificar; adiciona `img.onerror` como safety net para falhas de decodificação tardias; ambos os casos caem no fluxo existente de "projeto sem imagem" (pede ao usuário que selecione a imagem). Corrige também regressão crítica no restore do autosave e adiciona null-checks defensivos. Nenhuma mudança de visual, motor, schema JSON ou UI.

### O que foi corrigido

- **`isValidImageBase64(val)`** *(nova função)* — valida `imageBase64` antes de qualquer tentativa de decodificação. Rejeita: `null`/`undefined`, não-string, string vazia, strings contendo `<<` (placeholder), strings que não começam com `data:image/`. Projetos que falhavam silenciosamente por ter imagem placeholder agora são carregados normalmente sem a imagem.
- **`applyProjectData()`** — condição de entrada alterada de `data.imageBase64` (truthy bruto) para `isValidImageBase64(data.imageBase64)`. Adicionado `img.onerror` como safety net: se a imagem falhar ao decodificar mesmo passando na validação, o projeto é carregado sem imagem em vez de travar. Adicionado `console.warn` informativo quando imageBase64 inválido/placeholder é detectado.
- **`restoreAutosave()`** — substituído `restoreState(data)` por `applyFrameData(data)`. `buildProjectData()` (usado pelo autosave) salva `framesNorm` (coords normalizadas), mas `restoreState()` esperava `frames` (coords absolutas). O acesso a `state.frames.forEach` lançava `TypeError` silencioso, deixando o app sem estado após "Continuar de onde parou?" — projeto não carregava e pausas não eram restauradas.
- **`renderAll()`** — adicionado null-check para `frames[i]` antes de acessar `.x`, `.y`, `.w`, `.h`. Impede crash se `frames.length < frameCount` por qualquer razão.
- **`applyFrameData()`** — adicionado guard após carregar frames: se `frames.length < frameCount`, `frameCount` é ajustado para `frames.length` (com log de aviso no console), prevenindo acessos fora dos limites em todas as funções downstream.
- **`loadProjectFromFile()` / `loadProjectFromJson()`** — adicionado `console.error` no catch para facilitar diagnóstico sem expor UI complexa.

### Comportamento ao importar projeto com imagem inválida

1. `isValidImageBase64()` detecta placeholder/inválido antes de qualquer I/O.
2. `console.warn` informa no console.
3. Fluxo cai em `if (!imgNatW)` — `pendingProjectData = data` e mensagem "Projeto carregado — selecione a imagem para continuar".
4. Todos os dados válidos (frames, durações, pausas, curvas, loop) são preservados em `pendingProjectData`.
5. Após o usuário selecionar uma imagem compatível, `applyFrameData(pendingProjectData)` restaura tudo.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON — nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`. JSON salvo em v8z4b18o é idêntico ao de v8z4b18m/n.
- Scaffold vetorial (`getSegmentPathMode`, `getSegmentVectorModel`) — preservado da v8z4b18n, sem alterações.
- `migrateLegacyProjectData()` — comportamento de migração e preservação de pausas inalterado.
- Visual do Stage, curvePuller, zoom contextual, Undo/redo.
- UI geral (design, cores, layout, painel inferior).

---

## v8z4b18n — vector path mode scaffold

Patch estrutural/interno: cria base para o futuro modo vetorial de trajetória por segmento, separando claramente o modo atual (`legacyQuadratic`) do futuro modo `vectorAnchors`. Adiciona `getSegmentPathMode()` e `getSegmentVectorModel()`. Atualiza `evaluateSegmentPath()` com switch interno seguro. Nenhuma mudança de visual, motor, Preview, MP4, JSON ou UI.

### O que foi adicionado

- **`getSegmentPathMode(segIndex)`** — retorna o modo de trajetória do segmento. Nesta versão, sempre `"legacyQuadratic"`. Preparado para retornar `"vectorAnchors"` no futuro sem alterar código externo.
- **`getSegmentVectorModel(segIndex)`** — retorna modelo vetorial normalizado do segmento: `segmentIndex`, `label`, `from`, `to`, `isLoop`, `mode`, `frameAnchors` (start/end), `curvePuller` (com `kind`, `source`, `x`, `y`, `manual`), `pathPoints: []` e `handles: []`. Funciona para segmentos normais e para o segmento de loop (usa `loopCtrlPt` quando aplicável).
- **Bloco de documentação `vectorAnchors`** — estrutura conceitual futura documentada em comentário: `pathPoints` com `kind`, `id`, `x`, `y`, `pointType`, `handleIn`, `handleOut`; `handles`; TODOs para avaliador cúbico, UI e schema JSON.

### O que foi alterado

- **`evaluateSegmentPath(segIndex, t)`** — header atualizado para `v8z4b18l / mode switch v8z4b18n`. Adicionado `const mode = getSegmentPathMode(segIndex)` e branch `vectorAnchors` com TODO e fallback seguro para `legacyQuadratic`. Resultado matemático idêntico à v8z4b18m.
- **Cabeçalho, `APP_VERSION`, `APP_VERSION_NAME`** — atualizados para `v8z4b18n` / `vector path mode scaffold`.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `mode`, `pathPoints`, `vectorAnchors`, `handles`, `frameAnchors`, `curvePuller`, `vectorPath`, `curvesV2`).
- Visual do curvePuller (losango ciano/azul/laranja/roxo conforme v8z4b18m).
- `sampleSegmentPath()`, `measureSegmentPathLength()` — continuam usando `evaluateSegmentPath()` sem alteração.
- `resetSegmentCurve()` — continua resetando o curvePuller no modo `legacyQuadratic`.
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18m — visual curve puller distinction

Patch visual: diferencia o curvePuller (puxador legado da curva) dos demais pontos da timeline, trocando seu formato de círculo para losango. Mantém área de toque, compensação de zoom, cores e comportamento exatamente iguais à v8z4b18l. Nenhuma mudança de comportamento, motor, Preview, MP4, JSON ou schema.

### O que foi alterado

- **`.ctrl-pt` (CSS)** — shape alterado de círculo (`border-radius:50%`) para losango (`rotate(45deg)`, `border-radius:0`, 10×10 px). O losango é visualmente equivalente ao círculo anterior (diagonal ≈ 14 px) mas claramente distinto de um ponto de passagem. Área de toque (`::before` 44×44 px, `border-radius:50%`) preservada.
- **Comentário CSS** — atualizado de "círculo ciano r=5" para "losango ciano (curvePuller)".

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller`, `curvesV2`, `vectorPath`, `sampledPath`).
- Lógica de cores do curvePuller (azul para segmento anterior, laranja para segmento ativo, roxo para loop).
- Área de toque (hit area) — mantida igual ou ligeiramente maior.
- Compensação de zoom contextual (`scale(var(--ez-inv,1))`).
- Comportamento de arrastar o curvePuller.
- `resetSegmentCurve()`, `getSegmentCurve()`, `setSegmentCurve()` — preservados.
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- `evaluateSegmentPath()`, `sampleSegmentPath()`, `measureSegmentPathLength()` — preservados.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18l — unified segment path evaluator

Patch estrutural/interno: cria avaliador único de trajetória por segmento, centralizando como o app calcula pontos ao longo da curva. Adiciona `evaluateSegmentPath()`, `sampleSegmentPath()` e `measureSegmentPathLength()` como base para futuros path points, handles e Modo Mapa/Curvas. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi adicionado

- **`evaluateSegmentPath(segIndex, t)`** — avaliador único de trajetória: retorna `{x, y}` em pixels do stage para o segmento no parâmetro `t ∈ [0,1]`. Avalia a curva quadrática atual com curvePuller legado. Trata segmentos normais e de loop. Valida: `segIndex` inválido, `frameCount < 2`, `stageW/stageH` ausente, `frames` ausentes, `ctrl` ausente (fallback ponto médio), `t` NaN/Infinity/fora de `[0,1]`. Retorna `null` para segmento inválido.
- **`sampleSegmentPath(segIndex, steps)`** — retorna `steps+1` pontos amostrados ao longo da trajetória (inclui `t=0` e `t=1`). Usa `evaluateSegmentPath()`. `steps` mínimo seguro: 8; padrão: 64. Retorna `[]` para segmento inválido.
- **`measureSegmentPathLength(segIndex, steps)`** — mede o comprimento aproximado da trajetória em pixels do stage. Usa `sampleSegmentPath()`. Funciona para segmentos normais e de loop (unified). Fallback para distância linear em casos degenerados.
- **Comentários de migração futura** — `measureSegmentCurveLength()` e `measureLoopCurveLength()` anotadas como candidatas à migração para `measureSegmentPathLength()` quando seguro.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação (`getStateAtT`, `drawAtT`), `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller`, `curvesV2`, `vectorPath`, `sampledPath`).
- Visual do ponto atual da curva (curvePuller/legacyCurveControl).
- `measureSegmentCurveLength()`, `measureLoopCurveLength()` — preservadas e em uso.
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- `resetSegmentCurve()`, `getSegmentCurve()`, `setSegmentCurve()` — preservados.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18k — separate curve puller from path points

Patch conceitual/arquitetural: reclassifica internamente o ponto atual de controle da curva como `curvePuller` (puxador legado), separando-o conceitualmente dos futuros pontos de trajetória reais. Adiciona helper `getSegmentAnchors()` e documenta o modelo futuro de pathPoints e handles. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi alterado

- **`getSegmentTrajectoryPoints()`** — o ponto de controle quadrático agora retornado com `kind:'curvePuller'` (era `kind:'adjustment'`). Semântica corrigida: curvePuller é um puxador auxiliar/legado, não um pathPoint real. Comportamento visual idêntico.
- **`setSegmentTrajectoryPoint()`** — o guard agora aceita `kind:'curvePuller'` (era `kind:'adjustment'`). Comentários atualizados para refletir a terminologia correta.
- **Drag do ponto de curva no Stage** — o descritor `_adjDesc` atualizado para `kind:'curvePuller'`. Comportamento funcional idêntico ao da v8z4b18j.
- **`getSegmentAnchors(segIndex)`** — novo helper que retorna as âncoras reais do segmento (`frameAnchor` start e end). Nesta versão só existem frameAnchors; pathPoints persistentes não existem ainda.
- **Bloco de documentação interna** — comentários técnicos adicionados documentando:
  - Terminologia: `curvePuller`, `frameAnchor`, `pathPoint` (futuro), `handle` (futuro).
  - Formato futuro de `pathPoint` (não persistido, não renderizado).
  - Regras de handles futuros (não criados nesta versão).
  - Regra de compatibilidade: projetos antigos continuam com curvePuller sem conversão automática.
  - Ferramenta futura de caneta (decisão documentada).

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `pathPoints`, `trajectoryPoints`, `handles`, `anchors`, `curvePuller`, `curvesV2`).
- Visual do ponto atual da curva (ciano, mesmo tamanho e posição).
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- `resetSegmentCurve()`, `getSegmentCurve()`, `setSegmentCurve()` — preservados como estão.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18j — editable trajectory adjustment point

Refatoração interna: consolida o ponto de controle da curva como ponto de ajuste editável da trajetória, roteando a edição pelo drag do Stage via `setSegmentTrajectoryPoint()`. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi alterado

- **`setSegmentTrajectoryPoint(segIndex, pointDescriptor, nextPoint)`** — estendido para também atualizar `t/perpX/perpY` em segmentos normais (não loop), via `computeTPerpForSeg()`. Comportamento visual preservado. Para o segmento de loop, apenas `nx/ny` são atualizados (igual ao comportamento anterior). Comentário técnico adicionado documentando que nesta versão há um único ponto de ajuste por segmento.
- **Drag do ponto de curva no Stage** — o handler `pointermove` agora roteia a edição via `setSegmentTrajectoryPoint()` em vez de chamar `setSegmentCurve()` diretamente. A lógica de `computeTPerpForSeg` foi movida para dentro de `setSegmentTrajectoryPoint`. Comportamento visual idêntico ao da v8z4b18i.
- **Loop** — drag do ponto de curva 3–1 continua atualizando apenas `loopCtrlPt` via `setSegmentCurve()`, sem afetar outros segmentos.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo).
- Velocidade constante, Loop como trecho real, Pausa final.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- `resetSegmentCurve()` — preservado como está (reset requer manual=false, incompatível com setSegmentTrajectoryPoint).
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18i — internal trajectory points model

Refatoração interna: adiciona camada de pontos de trajetória por segmento via `getSegmentTrajectoryPoints()`, `setSegmentTrajectoryPoint()` e `getAllTrajectoryPoints()`. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi adicionado

- **`getSegmentTrajectoryPoints(segIndex)`** — retorna lista normalizada de pontos representando a trajetória atual do segmento: ponto inicial (`kind:"frame"`, `role:"start"`), ponto de ajuste (`kind:"adjustment"`, `role:"control"`, `source:"quadraticCtrl"`) e ponto final (`kind:"frame"`, `role:"end"`). Todos com coordenadas normalizadas (`x`, `y`) relativas ao Stage. Retorna `[]` para índice inválido, `frameCount < 2`, segmento inexistente, `stageW/stageH <= 0`, frames ausentes ou `ctrl` com valores inválidos.
- **`setSegmentTrajectoryPoint(segIndex, pointDescriptor, nextPoint)`** — atualiza o ponto de controle quadrático do segmento a partir de um ponto de trajetória do tipo `adjustment/control/quadraticCtrl`. Marca a curva como manual. Ignora silenciosamente tentativas de editar pontos `kind:"frame"` (esses continuam sendo editados pelas ferramentas de frame). Validações defensivas para `pointDescriptor` incompleto, `nextPoint` inválido, NaN/Infinity.
- **`getAllTrajectoryPoints()`** — retorna lista de pontos de trajetória de todos os segmentos ativos: `[{ segmentIndex, segmentLabel, points: [...] }]`. Disponível para uso futuro sem alterar UI.

### Integração com helpers existentes

- `getSegmentTrajectoryPoints()` usa `getSegmentByIndex()`, `getSegmentPath()`, `frameCX()`, `frameCY()`, `stageW`, `stageH` internamente.
- `setSegmentTrajectoryPoint()` usa `setSegmentCurve()` e `setSegmentCurveManual()` — preserva comportamento atual de edição de curva.
- `getAllTrajectoryPoints()` usa `getAllSegmentPaths()` e `getSegmentTrajectoryPoints()`.
- Nenhum helper existente foi alterado.

### Suporte a Loop

- Segmento N→1 (loop): `getSegmentTrajectoryPoints()` retorna start = frame N, adjustment = `loopCtrlPt`, end = frame 1.
- `setSegmentTrajectoryPoint()` atualiza `loopCtrlPt` via `setSegmentCurve()` — comportamento preservado (sem flag manual separada no loop, igual a versões anteriores).

### Preparação para o futuro editor vetorial de trajetória

Nesta versão cada segmento tem apenas três pontos (start frame, adjustment control, end frame). No futuro esta camada poderá aceitar múltiplos pontos de trajetória, handles de tangência, desenho livre e conversão ponto ↔ frame.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo: sem `trajectoryPoints`, `guidePoints`, `handles`, `paths`, `curvesV2`).
- Velocidade constante, Loop como trecho real, Pausa final, Igualar intervalos.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- Curvas, resetar curva, edição manual de curva.
- UI geral (design, cores, layout, Stage, painel inferior).

---

## v8z4b18h — refresh loop curve on toggle

Corrige o refresh visual da curva do loop (trecho N→1) no Stage ao ligar ou desligar Loop. A curva agora aparece e desaparece imediatamente, sem precisar de toque posterior no Stage.

### O que foi corrigido

- **`setFinishing(mode)`** — adicionada chamada a `renderAll()` logo após `maybeRedistributeByCurveLength()`. Sem essa chamada, `drawBezier()` nunca era invocado após a troca de modo de acabamento, causando o atraso visual.
- **Ligar Loop** — a curva N→1 (roxa) aparece imediatamente no Stage assim que o chip "Loop" é selecionado.
- **Desligar Loop** — a curva N→1 desaparece imediatamente do Stage ao selecionar "Nenhum" ou "Pausa final".
- **Ponto de controle do loop** — `updateCtrlPts()` (chamado dentro de `renderAll()`) garante que o ponto roxo seja exibido ou ocultado imediatamente junto com a curva.
- **Sem curva fantasma** — a flag `loopEnabled` já controlava corretamente a renderização em `drawBezier()` e `updateCtrlPts()`; o único problema era a ausência de `renderAll()`.

### O que NÃO foi alterado

- Motor de Preview, export MP4/WebCodecs.
- `drawBezier()`, `updateCtrlPts()`, `renderAll()` — lógica interna preservada.
- Schema do JSON (nenhum campo novo).
- Velocidade constante, Pausa final, Igualar intervalos.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- Curvas, resetar curva, edição manual de curva, handles, pontos de trajetória.
- UI geral (design, cores, layout).
- `toggleLoop()` — função mantida sem alteração (não é chamada pela UI atual).

---

## v8z4b18g — internal segment path object

Refatoração interna: adiciona camada de trajetória por segmento via `getSegmentPath()`, `setSegmentPath()` e `getAllSegmentPaths()`. Nenhuma mudança de comportamento visual, motor, Preview, MP4, JSON ou UI.

### O que foi adicionado

- **`getSegmentPath(segIndex)`** — retorna objeto normalizado representando a trajetória do segmento: `{ segmentIndex, from, to, isLoop, label, type, ctrl, manual, guides, handles }`. Mapeia para `ctrlPts`/`loopCtrlPt` e `ctrlPtManual` atuais. Retorna `null` para índice inválido, `frameCount < 2`, segmento inexistente, `ctrl` ausente ou com valores inválidos (NaN/Infinity).
- **`setSegmentPath(segIndex, path, options)`** — grava de volta apenas dados compatíveis com o sistema atual: `ctrl.x/y` → `ctrlPts[segIndex]` ou `loopCtrlPt`; `manual` → `ctrlPtManual[segIndex]` (loop sem flag separada — comportamento preservado); `guides`/`handles` ignorados nesta versão.
- **`getAllSegmentPaths()`** — retorna `getActiveSegments().map(seg => getSegmentPath(seg.index))` com filtragem defensiva de nulos. Preparatório para Modo Mapa/Curvas e editor vetorial de trajetória.

### Integração com helpers existentes

- Os novos helpers usam internamente `getSegmentCurve()`, `setSegmentCurve()`, `isSegmentCurveManual()` e `setSegmentCurveManual()` da camada v8z4b18c/v8z4b18f.
- Nenhum helper existente foi alterado.

### Preparação para o futuro editor vetorial de trajetória

`guides` e `handles` existem apenas como arrays vazios internos. Não salvos no JSON, não usados no motor. No futuro poderão conter pontos de trajetória e handles de tangência para o editor vetorial.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo).
- Velocidade constante, Loop como trecho real, Pausa final, Igualar intervalos.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- Curvas, resetar curva, edição manual de curva.
- UI geral (design, cores, layout).

---

## v8z4b18f — central active segments helper

Refatoração interna: adiciona `getActiveSegments()` como fonte única para trechos ativos do projeto. Nenhuma mudança de comportamento visual, motor, Preview ou MP4.

### O que foi adicionado

- **`getActiveSegments()`** — retorna array com todos os trechos ativos: `{ index, from, to, isLoop, label }`. Sem loop com 3 frames retorna 2 itens (1–2, 2–3); com loop retorna 3 itens (1–2, 2–3, 3–1). Retorna `[]` para `frameCount < 2` sem gerar erro.
- **`getSegmentByIndex(segIndex)`** — retorna o segmento pelo índice ou `null` para índice inválido (negativo, NaN, Infinity, fora do range).
- **`getSegmentLabel(segIndex)`** — retorna o label do trecho como `"1–2"`, `"2–3"`, `"3–1"`. Retorna `''` para índice inválido.

### O que foi atualizado

- **`getActiveSegmentCount()`** — agora delega para `getActiveSegments().length`.
- **`isLoopSegment(segIndex)`** — agora usa `getSegmentByIndex()` internamente.
- **`getSegmentEndpoints(segIndex)`** — agora usa `getSegmentByIndex()` internamente.
- **`openSegBreakdown()`** — usa `getActiveSegments()` para iterar sobre os trechos e gerar as linhas de "Tempo por trecho", incluindo labels e lógica do loop.

### Preparação para o futuro editor vetorial de trajetória

`getActiveSegments()` está documentada como ponto de extensão: no futuro, cada segmento poderá ter um objeto de trajetória próprio com pontos e handles. Este patch não implementa esses recursos.

### O que NÃO foi alterado

- Comportamento do Preview, export MP4/WebCodecs.
- Motor de animação, `totalDuration()`, `totalDurationFull()`.
- Schema do JSON (nenhum campo novo).
- Velocidade constante, Loop como trecho real, Pausa final, Igualar intervalos.
- Movimento/Rotação/Escala Inteligente, zoom contextual, Undo/redo.
- Curvas, resetar curva, edição manual de curva.
- UI geral (design, cores, layout).

---

## v8z4b18e — manual segment duration disables constant speed

Corrige a relação entre Velocidade constante e ajustes manuais de duração por trecho: qualquer edição manual num slider de trecho (incluindo o loop N→1) desliga Velocidade constante imediatamente.

### O que foi corrigido

- **`disableConstantSpeedBecauseManualSegmentEdit()`** — novo helper central que desliga Velocidade constante, limpa `constantSpeedTotalDuration`, sincroniza a UI e exibe status "Velocidade constante desativada".
- **Sliders de trecho no breakdown** — em vez de bloquear a interação quando Velocidade constante está ativa, a edição é agora permitida e aciona o helper.
- **Slider do trecho de loop N→1 no breakdown** — mesmo comportamento; ajuste manual desliga Velocidade constante.
- **Slider "Retorno" (loopDurSlider) na seção Acabamento** — slider nunca estava na lista de sliders desabilitados; agora chama o helper quando Velocidade constante está ativa.
- **Painel ease contextual, trecho loop** — ajuste de duração do loop no painel de easing também desliga Velocidade constante.
- **Painel ease contextual, trecho normal** — código inline substituído pelo helper (comportamento preservado).
- **`distributeSegEqual()` (Igualar intervalos)** — código inline substituído pelo helper (comportamento preservado; mensagem de status própria mantida).
- **`syncTimingModeUI()`** — removido `sl.disabled = isConstant`; sliders permanecem interativos em modo Velocidade constante; opacidade reduzida mantida como hint visual.

### O que NÃO foi alterado

- Slider Total dos trechos (`durSlider`) — manter Velocidade constante ligada ao alterar total é o comportamento correto e permanece intacto.
- Ativar/desativar Loop com Velocidade constante — continua redistribuindo sem desligar o modo.
- Motor de animação, Preview, export MP4/WebCodecs.
- Curvas, helpers de curva, resetar curva, zoom contextual, Movimento/Rotação/Escala Inteligente, UI geral, pontos-guia, handles.
- Schema JSON (nenhum campo novo; estado do modo gravado como antes).

---

## v8z4b18d — include loop in segment duration totals

Corrige o painel Duração para que o trecho N→1 (loop) entre corretamente na contagem de trechos, no total de tempo dos trechos e nas distribuições/ajustes.

### O que foi corrigido

- **`getDurationParts()`** — `loopDuration` agora entra em `moveDur` (Tempo dos trechos) quando loop ativo, e não mais em `finish` (Acabamento). Total permanece idêntico.
- **`syncDurationUI()`** — `moveTotal` passa a usar `parts.moveDur` (inclui loop) em vez de `totalDuration()` (só segmentos normais).
- **slider Total dos trechos** — redistribui `loopDuration` proporcionalmente junto com `segDurations[]` ao arrastar; em modo Velocidade constante, subtrai loop antes de definir `constantSpeedTotalDuration` para evitar dupla contagem.
- **`distributeSegEqual()` (Igualar intervalos)** — distribui tempo igualmente entre todos os trechos ativos (N-1 normais + loop), incluindo atualização do slider de loop.

### O que não foi alterado

- Motor de animação, Preview, export MP4/WebCodecs.
- `totalDuration()` — permanece como soma dos segmentos normais (usado pelo motor).
- `totalDurationFull()` — total final é preservado (motor unaffected).
- Curves, helpers de curva, resetar curva, zoom contextual, Movimento/Rotação/Escala Inteligente, UI geral, design system.

---

## v8z4b18c — curve access helpers without behavior change

Refatoração interna: adiciona camada de helpers para acesso uniforme às curvas por trecho. Nenhuma mudança de comportamento visual, motor, Preview ou MP4.

### O que foi adicionado

- **`getActiveSegmentCount()`** — retorna a quantidade de trechos editáveis ativos (sem loop: `frames.length - 1`; com loop: `frames.length`). Trata `frameCount < 2` sem erro.
- **`isLoopSegment(segIndex)`** — retorna `true` quando `segIndex` representa o trecho de retorno N→1 com loop ativo.
- **`getSegmentEndpoints(segIndex)`** — retorna `{ from, to }` com os índices dos frames do trecho. Retorna `null` para índice inválido.
- **`getSegmentCurve(segIndex)`** — lê o ponto de controle do trecho: usa `ctrlPts[segIndex]` para trechos normais e `loopCtrlPt` para o loop. Não altera dados.
- **`setSegmentCurve(segIndex, curve, options)`** — grava curva no lugar correto: `ctrlPts[segIndex]` ou `loopCtrlPt`. Aceita `options.markManual` para marcar `ctrlPtManual[segIndex]` em trechos normais.
- **`isSegmentCurveManual(segIndex)`** — retorna se a curva do trecho é manual (`ctrlPtManual[segIndex]`). Para loop, retorna `false` (sem flag manual separada no schema atual).
- **`setSegmentCurveManual(segIndex, value)`** — marca/desmarca `ctrlPtManual[segIndex]`. Para loop, preserva comportamento atual (no-op).
- **`resetSegmentCurve(segIndex)`** — reseta curva do trecho para o ponto médio dos frames. Usa os helpers acima internamente.

### O que foi substituído (pontos seguros)

- `startCtrlDrag`: `ctrlPtManual[seg] = true` → `setSegmentCurveManual(seg, true)`.
- `updateCtrlPts`: `ctrlPts[seg]` → `getSegmentCurve(seg)` para leitura da posição do ponto de controle.
- Drag de ponto de controle (`onPointerMove`): writes diretos em `ctrlPts[ctrlDragSeg]` e `loopCtrlPt` → `setSegmentCurve(...)`.
- `resetSelectedSegmentCurve`: lógica de reset inline → `resetSegmentCurve(...)`.

### O que não foi alterado

- Schema do JSON salvo (`ctrlPts`, `ctrlPtManual`, `loopCtrlPt`).
- Motor de animação, Preview e export MP4/WebCodecs.
- Renderização visual das curvas e pontos de controle.
- Edição manual de curva, Resetar curva, Loop como trecho real.
- Pausa final, Velocidade constante, Movimento/Rotação/Escala inteligentes.
- Undo/redo, seleção de frames/trechos, zoom contextual.

---

## v8z4b18b — tune contextual zoom trigger

Ajusta o gatilho do zoom contextual de edição: em vez de um limiar fixo em px, o critério agora é proporcional à área visível do Stage (30%).

### O que foi alterado

- **`EDITOR_ZOOM_AUTO_SHOW_RATIO = 0.30`** — substitui `EDITOR_ZOOM_AUTO_SHOW_MIN_PX`. A barra de zoom aparece no modo normal quando `f.w < stageW * 0.30` ou `f.h < stageH * 0.30`.
- **`shouldShowEditorZoom()`** — critério atualizado para comparação proporcional ao Stage. Condição de zoom >100% mantida inalterada (barra permanece visível enquanto editorZoomScale > 1).
- **Remoção da regra de Modo Curvas** — a condição baseada em `panelEase.classList.contains('show')` foi removida pois Modo Curvas não existe ainda. Registrado em comentário para implementação futura.

### O que não foi alterado

- Motor de animação, Preview e export MP4/WebCodecs.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa, JSON).
- Coordenadas reais dos frames e pontos de controle.
- Modo Mapa, pinch zoom, sistema vetorial, pontos-guia.
- Níveis de zoom, clamp de pan, pan mode.

---

## v8z4b18a — contextual editor zoom visibility

Torna a barra de zoom do editor contextual: oculta quando não necessária no modo normal e sempre visível no modo Curvas (painel Easing).

### O que foi adicionado / alterado

- **Visibilidade contextual da barra de zoom** — a barra `#editorZoomCtrl` agora aparece apenas quando faz sentido, evitando poluição visual.
- **Constante `EDITOR_ZOOM_AUTO_SHOW_MIN_PX = 160`** — limiar em px abaixo do qual o frame ativo é considerado "pequeno demais" e dispara a exibição automática do zoom.
- **Helper `shouldShowEditorZoom()`** — avalia três condições: modo Curvas ativo, zoom acima de 100%, ou frame ativo menor que 160 px em algum eixo.
- **Helper `syncEditorZoomCtrlVisibility()`** — aplica a visibilidade no elemento `#editorZoomCtrl` via `style.display`.
- **Modo Curvas** — identificado como painel Easing aberto (`panelEase.classList.contains('show')`). Quando Easing está aberto, zoom fica sempre visível independente do tamanho do frame.
- **Hooks de sincronização** — `syncEditorZoomCtrlVisibility()` chamado em `applyEditorZoom()`, `renderAll()`, `openPanel()` e `closeAll()` para manter o estado correto em qualquer mudança de contexto.
- **Estado inicial oculto** — `#editorZoomCtrl` começa com `display:none` inline; a barra só aparece quando `shouldShowEditorZoom()` retorna true.

### O que não foi alterado

- Motor de animação, Preview e export MP4/WebCodecs.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa, JSON).
- Coordenadas reais dos frames e pontos de controle.
- `screenToStageCoord()` e conversão de coordenadas.
- Pan mode, níveis de zoom, clamp de pan.
- Pinch zoom (não implementado).
- Controles de edição com tamanho fixo de tela (--ez-inv).
- Posição da barra (flutuante no canto superior direito do Stage).

---

## v8z4b17z — fixed-size editor controls during zoom

Corrige o tamanho visual dos controles de edição durante o Zoom de edição. Bordas dos frames, labels, pontos de controle Bézier, handle ciano de escala/rotação e curvas agora mantêm tamanho visual constante independente do nível de zoom.

### O que foi corrigido

- **Bordas dos frames** — `borderWidth` dividido por `editorZoomScale` em `renderAll()`. Em 200% a borda continua visualmente 2–3.5 px como em 100%.
- **Labels/números dos frames** — `transform: scale(var(--ez-inv,1))` com `transform-origin: top left`. O label não cresce junto com o zoom.
- **Handle ciano de escala/rotação** — `transform: scale(1/editorZoomScale)` aplicado inline via `applyEditorZoom()` e `renderAll()`. Tamanho visual constante em qualquer nível.
- **Pontos de controle Bézier (ctrl-pt)** — CSS atualizado para `transform: translate(-50%,-50%) scale(var(--ez-inv,1))`. Visual 14 px, área de toque 42 px, em todos os níveis de zoom.
- **Curvas Bézier** — `stroke-width` e raio das bolinhas centrais divididos por `editorZoomScale` em `drawBezier()`. Linha ativa, linha inativa tracejada e curva de loop mantêm espessura proporcional.
- **Indicador de ângulo** — `transform: translate(-50%,-140%) scale(var(--ez-inv,1))`. Bolinha de ângulo não cresce durante rotação com zoom ativo.
- **CSS variable `--ez-inv`** — definida no elemento `#stage` e atualizada em `applyEditorZoom()`. Todas as regras de affordance usam `var(--ez-inv,1)` como fator compensador.

### O que não foi alterado

- Motor de Preview e export MP4/WebCodecs.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa, JSON).
- Coordenadas reais dos frames e pontos de controle.
- `screenToStageCoord()` e conversão de coordenadas.
- Pan mode, zoom levels, clamp de pan.
- Pinch zoom (não implementado).

---

## v8z4b17y — fix editor zoom toolbar and overlay isolation

Corrige a UX do Zoom de edição introduzido em v8z4b17x sem alterar motor, Preview, MP4 ou dados reais do projeto.

### O que foi corrigido

- **Ícone de mãozinha** — substituído o ícone genérico de mover/deslocar (4 setas) pelo ícone de mão (pan hand), correto para a função de mover a visão.
- **Controles em linha** — botão Mover visão movido para dentro da `ezc-row`, formando uma única linha horizontal: `[ − ] [ 125% ] [ + ] [ 🖐 ]`. Eliminada a quebra de linha anterior.
- **Status/toast fora do zoom** — `#statusBar` movido para fora do `#stage` (agora filho direto de `#imageArea`), garantindo que avisos, toasts e mensagens de status nunca sejam ampliados pelo `transform: scale()` do zoom de edição.
- **Release automático do pan mode** — `editorPanMode` é desligado automaticamente ao abrir qualquer painel inferior (`openPanel()`) ou ao abrir Configurações (`toggleSettingsSheet()`). O zoom e o pan permanecam preservados; apenas o modo mover é desativado.

### O que não foi alterado

- Motor de Preview e export MP4/WebCodecs.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa, JSON).
- Lógica de pan (`clampEditorPan`, `editorPanX`, `editorPanY`).
- Níveis de zoom (ZOOM_LEVELS).
- `screenToStageCoord()` e conversão de coordenadas.
- Pinch zoom (não implementado neste patch).

---

## v8z4b17x — fractional editor zoom and pan mode

Refatora o controle de Zoom de edição do Stage: substitui o botão cíclico inferior por um **controle flutuante** no canto superior direito do Stage, adiciona níveis fracionados (100% → 300% em passos progressivos) e um botão **Mover visão** para navegação da área ampliada sem interferir em frames ou curvas.

### O que foi adicionado / alterado

- **Controle flutuante `#editorZoomCtrl`** — posicionado `top: 8px; right: 8px` dentro do `image-area`, sobre o Stage. Visível apenas com imagem carregada, fora do Preview e fora do export. Composto por três elementos em linha: botão `[−]`, indicador de zoom clicável (`100%`), botão `[+]`, mais botão **Mover** abaixo (oculto quando zoom = 100%).
- **Níveis fracionados**: `[1, 1.25, 1.5, 1.75, 2, 2.5, 3]` (100% a 300%). Substituem o ciclo brusco 1× → 2× → 4×.
- **Botão `[−]`** — reduz ao nível anterior; desabilitado em 100%.
- **Botão `[+]`** — aumenta ao próximo nível; desabilitado em 300%.
- **Indicador de zoom** — exibe o percentual atual (ex: `125%`); toque volta para 100%.
- **Estado `editorPanMode`** — `false` por padrão. Quando `true`, arrastar no Stage move a viewport em vez de editar frames/curvas.
- **Botão Mover** — aparece só quando zoom > 100%; torna-se ativo (tint azul) ao ativar pan mode; toque alterna o modo.
- **Cursor visual**: `grab` quando pan mode ativo e zoom > 1, `grabbing` durante o arraste.
- **Guards de pan mode em todos os handlers de edição**: `startMove`, `startRotate`, `startResize`, `startCtrlDrag`, `globalHandleEl.pointerdown`, frame-element `pointerdown` e ctrl-pt `pointerdown` retornam cedo (sem `stopPropagation`) quando `editorPanMode = true`, permitindo que o evento chegue ao listener de pan do stage.
- **Whitelist atualizada**: `#editorZoomCtrl` adicionado ao `imageAreaCloseHandler` (toque no controle não fecha o menu contextual).

### O que não foi alterado

- Motor de Preview e export MP4/WebCodecs — ignoram completamente `editorZoomScale`.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa).
- JSON de save/load — zoom não é serializado.
- `screenToStageCoord()` — lógica de conversão mantida intacta (BoundingClientRect já reflete transform).
- `clampEditorPan()` — mantido com os mesmos limites.
- Layout geral dos menus inferiores, midBar, toolbar, panels.
- Pinch zoom não implementado.

---

## v8z4b17w — fixed editor zoom levels

Adiciona zoom de edição fixo no Stage com níveis **1× / 2× / 4×**, sem pinch zoom livre. O zoom é apenas uma lupa de visualização: não altera a animação, os frames, o export nem o JSON do projeto.

### O que foi adicionado

- **Botão `#editorZoomBtn`** no canto inferior direito do imageArea, visível apenas com imagem carregada e fora do Preview. Toque cíclico: 1× → 2× → 4× → 1×. Realce visual (tint azul) quando zoom > 1×.
- **Estado interno**: `editorZoomScale` (1 | 2 | 4), `editorPanX`, `editorPanY`. Nunca salvos no JSON do projeto.
- **`applyEditorZoom()`** — aplica `transform: translate(panX, panY) scale(scale)` com `transform-origin: 0 0` no `#stage`. Em 1× remove o transform completamente.
- **`cycleEditorZoom()`** — avança entre os níveis e centraliza automaticamente o zoom no centro do stage.
- **`resetEditorZoom()`** — retorna tudo para 1×/0/0. Chamada ao carregar nova imagem e ao `resetAll()`.
- **`clampEditorPan()`** — limita o pan para que o usuário possa alcançar qualquer borda do stage sem perder o conteúdo da tela.
- **`screenToStageCoord(clientX, clientY)`** — helper central que converte coordenadas de tela para coordenadas do stage considerando zoom e pan. Usado por todos os handlers de arraste.
- **Pan por arraste** em área vazia do stage quando zoom > 1 (pointerdown no stage, sem frame/ctrl-pt/handle). `panDragState` integrado ao sistema global `onMove`/`endDrag`.

### Coordenadas corrigidas

Todos os handlers de interação foram atualizados para usar `screenToStageCoord()` ou a divisão equivalente por `editorZoomScale`:
- `startMove`: cálculo de `grabDX/grabDY` agora em coords do stage.
- `onMove` (ctrl point drag): nx/ny calculados via `screenToStageCoord`.
- `onMove` (rotate): centro do frame convertido para coords de tela com `* editorZoomScale`.
- `onMove` (move): `lx/ly` via `screenToStageCoord`.
- `globalHandleEl.pointermove`: `px/py` e `prevDist` em coords do stage.

### O que não foi alterado

- Motor de Preview e export MP4/WebCodecs — ignoram completamente editorZoomScale.
- Dados do projeto (frames, curvas, rotações, escalas, durações, easings, loop, pausa).
- JSON de save/load — zoom não é serializado.
- Layout geral dos menus inferiores, midBar, toolbar, panels.
- Pinch zoom não implementado.

---

## v8z4b17u — reset selected segment curve

Adiciona botão **Resetar curva** no painel de easing do trecho selecionado. A ação restaura o ponto de controle do trecho ativo para a posição padrão (midpoint automático entre os dois frames), sem alterar nenhum outro parâmetro.

### O que foi adicionado

- **Botão "Resetar curva"** no `panelEase`, abaixo do botão "Aplicar aos 3". Visível sempre que o painel de trecho/easing está aberto.
- **`resetSelectedSegmentCurve()`** — nova função JavaScript que:
  - Atua apenas no trecho selecionado em `_activeEaseSeg`.
  - Para trecho normal (seg 0 … N-2): define `ctrlPts[seg]` para o midpoint entre os dois frames e `ctrlPtManual[seg] = false`.
  - Para trecho de loop (seg N-1, quando Loop ligado): redefine `loopCtrlPt` para o midpoint entre o último e o primeiro frame.
  - Registra undo antes de alterar estado (compatível com undo/redo existente).
  - Marca projeto como sujo (`markProjectDirty`).
  - Chama `renderAll()` para atualizar visualmente o caminho imediatamente.
  - Exibe mensagem de status com o identificador do trecho.
  - Guards: retorna sem efeito se `frameCount < 2`, se não houver trecho válido selecionado, ou se o trecho de loop for solicitado com Loop desligado.

### O que não foi alterado

- Motor de Movimento Inteligente, Rotação Inteligente, Escala Inteligente.
- Velocidade constante, Loop como trecho real N→1, Pausa final.
- Sistema de load/migração legacy, Preview, export MP4/WebCodecs.
- Stage, frames, rotação, escala, duração, pausas, easing.
- Design system, nova timeline, novo sistema vetorial, seleção múltipla, safe area, menu inferior geral.

---

## v8z4b17t — smart easing defaults for new projects

Projetos novos e resets agora iniciam com `movementEasingMode = "smart"`, `rotationEasingMode = "smart"` e `scaleEasingMode = "smart"`. Projetos salvos respeitam exatamente os valores do JSON. Projetos antigos sem esses campos continuam abrindo em manual/manual/manual para preservar o resultado visual original.

### O que foi alterado

- **Declarações iniciais das variáveis** (`movementEasingMode`, `rotationEasingMode`, `scaleEasingMode`) alteradas de `'manual'` para `'smart'`. Garante que a sessão começa com modos inteligentes ativos antes de qualquer imagem ser carregada.
- **`loadImage` — branch de projeto novo** (`isFirstLoad || frameCount === 0`): adicionada atribuição explícita dos três modos para `'smart'` + chamadas às funções de sincronização de UI (`syncMovementEasingModeUI`, `syncRotationEasingModeUI`, `syncScaleEasingModeUI`). Garante que trocar de imagem em sessão ativa que reinicialize o projeto também restaura os modos inteligentes.
- **`resetAll()`**: já definia os três modos como `'smart'` desde v8z4b17k/v8z4b17q — sem alteração.

### O que não foi alterado

- `applyFrameData` / `migrateLegacyProjectData` — lógica de load de projetos salvos e antigos intacta da v8z4b17s.
- Motor de Movimento Inteligente, Rotação Inteligente, Escala Inteligente, Velocidade constante, Loop como trecho real N→1, Pausa final, painel visual de trecho/easing, design system, cards de easing, Preview/export MP4/WebCodecs, stage, curvas, sistema vetorial, safe area, nova timeline.

### Regras de default

| Situação | movementEasingMode | rotationEasingMode | scaleEasingMode |
|---|---|---|---|
| Projeto novo / primeiro load | smart | smart | smart |
| Reset (`resetAll`) | smart | smart | smart |
| Projeto salvo com campos novos | respeita JSON | respeita JSON | respeita JSON |
| Projeto antigo sem campos novos | manual | manual | manual |

---

## v8z4b17s — legacy project migration cleanup

Saneamento e migração de JSON antigo/misto: impede que campos legacy como `easeMode`, `easeAmount`, `pauseDuration`, `loopEnabled`, `loopDuration` e `finishDuration` continuem influenciando o motor de forma invisível após o load de qualquer projeto.

### Root cause

Em `applyFrameData`, campos legacy eram lidos diretamente para o estado do app sem verificar se campos do schema atual já estavam presentes no JSON. O principal caso problemático: `easeAmount: 1` em um JSON com `movementEasingMode: "manual"` fazia `applyEaseAtEnds()` criar suavização ease-in-out invisível em todos os trechos, pois essa função é chamada incondicionalmente em `getStateAtT`. A UI mostrava "Manual/Linear" mas o motor aplicava easing.

### O que foi adicionado

- **`migrateLegacyProjectData(raw)`** — nova função central executada no início de `applyFrameData`. Retorna cópia do objeto de dados com campos legacy neutralizados/migrados antes de qualquer atribuição ao estado do app. Garante que depois do load apenas o schema atual comanda o motor.

### Regras implementadas

**Easing legacy:**
- Se `movementEasingMode` existe no JSON: `easeAmount` é zerado; `easeMode` é revertido para `'global'`. Sem suavização invisível vinda de `easeAmount`.
- Se `movementEasingMode` não existe (projeto muito antigo): define `movementEasingMode = 'manual'` e `easeAmount = 0`. Sem estado legado paralelo.

**Pausas legacy:**
- Se `framePauses` existe e tem entradas: `pauseDuration` é zerado; `easeMode = 'pause'` é neutralizado. `framePauses` é a fonte de verdade.
- Se `framePauses` não existe: cria array de zeros; neutraliza `pauseDuration` e `easeMode = 'pause'`. Migração de `pauseDuration` para frame específico seria lossy — preferimos zeros seguros.

**Loop / finishMode:**
- Se `finishMode` existe: é a autoridade. `loopEnabled` é alinhado a ele (`'loop'` → `true`, outros → `false`). `finishDuration` não cria pausa final quando `finishMode = 'loop'`.
- Se `finishMode` não existe: migrado de `loopEnabled` legacy: `true` → `finishMode = 'loop'`; `false` → `finishMode = 'none'`.

### Caso testado: `arco_projeto- pausas_img.json`

JSON com `easeMode: "global"`, `easeAmount: 1`, `movementEasingMode: "manual"`, `framePauses` zerados, `finishMode: "loop"`, `loopEnabled: true`, `loopDuration: 1`.

Comportamento esperado após patch:
- `easeAmount` zerado → sem suavização invisível.
- `framePauses` zerados respeitados → sem pausas por frame.
- `finishMode: "loop"` manda → `loopEnabled = true`, trecho 8→1 ativo.
- `finishDuration: 0.8` não vira pausa final.
- Preview sem easing ou pausa invisível.

### Diagnóstico opcional

`window._arcoDebug = true` no console ativa log `[Arco] migrateLegacyProjectData applied` mostrando os campos que foram alterados. Silencioso em produção.

### O que não foi alterado

Motor de Movimento Inteligente, Rotação Inteligente, Escala Inteligente, Velocidade constante, Loop como trecho real N→1, Pausa final como espelho do último frame, painel visual de trecho/easing, design system, cards de easing, Preview/export MP4/WebCodecs, stage, curvas, sistema vetorial, safe area, nova timeline, defaults dos modos inteligentes. Este patch é exclusivamente saneamento de JSON antigo.

---

## v8z4b17r — fix project load segment list normalization

Corrige bug crítico no carregamento de projetos em que a seção Trechos do painel Duração/Tempo ficava sempre vazia após carregar qualquer projeto salvo.

### Root cause

Em `applyFrameData()`, o fim da função chamava `closeSegBreakdown()`, que escondia `#segBreakdown` sem reconstruir as linhas de trecho. Antes disso, `syncDurationUI()` → `syncSegRowsFromState()` tentava atualizar as linhas, mas `#segRows` estava vazio porque `openSegBreakdown()` nunca havia sido chamado após o load.

### O que foi corrigido

- **`applyFrameData`** — Removida a chamada `closeSegBreakdown()` do fim do fluxo de load. Substituída por `syncDurationSectionsUI()`, que chama `openSegBreakdown()` (reconstrói as linhas de trecho com o `frameCount` real), `renderFramePauseRows()` (reconstrói as linhas de pausa) e `syncDurationControlsFromState()`.
- **`segEasings` após load** — Adicionada limpeza e renormalização de `segEasings` durante o load. O array não é persistido em projetos salvos e poderia herdar valores de um projeto anterior com frameCount diferente.
- **`ensureSegDurations` após load** — Chamada explícita após restaurar `segDurations` do JSON, garantindo que valores ausentes ou NaN recebam defaults seguros antes de qualquer render.

### Regra garantida

Com N frames carregados:
- Sem loop: N−1 trechos visíveis na seção Trechos.
- Com loop: N trechos visíveis (inclui trecho N→1).
- Pausas por frame: F1 até FN visíveis.

### O que não foi alterado

Motor de Movimento Inteligente, Rotação Inteligente, Escala Inteligente, Velocidade constante, Loop como trecho real N→1, Pausa final, painel visual de trecho/easing, design system, cards de easing, Preview, export MP4/WebCodecs, stage, curvas, sistema vetorial, menu inferior, safe area, nova timeline.

---

## v8z4b17q — smart rotation and scale easing

Estende o Easing Inteligente já validado para Movimento aos canais Rotação e Escala, com continuidade de velocidade angular/escala entre trechos via Hermite cúbico. Cada canal tem seu próprio modo (`manual` | `smart`) e seu próprio toggle, totalmente independentes entre si.

### O que foi adicionado

- **Estados globais por canal** — `rotationEasingMode` e `scaleEasingMode` (`'manual'` | `'smart'`). Movimento continua em `movementEasingMode`. Projetos novos iniciam todos os três em `'smart'`; projetos salvos respeitam o valor armazenado. JSON antigo sem os campos abre como `'manual'` para preservar comportamento legado.
- **Toggles únicos por aba** — Painel real `panelEase`: aba Rotação ganha toggle `Rotação Inteligente`; aba Escala ganha toggle `Escala Inteligente`. Mesmo padrão de toggle liga/desliga já usado por `Movimento Inteligente` — sem botões duplicados Manual/Inteligente. Mini-painel `segEasePanel` repete o padrão (linhas `segRotEasingModeRow` e `segScaleEasingModeRow`).
- **Motor de continuidade Hermite escalar** — Novas funções `computeSmartRotationT(seg, tt)` e `computeSmartScaleT(seg, tt)`. Para cada trecho calcula `vAvg = delta / duração` (signed). Cada frame intermediário recebe `vStart`/`vEnd` derivados dos vizinhos (com média entre eles, com pausa zerando, e com mudança de sinal entre vizinhos zerando a tangente para evitar overshoot/chicote). Saída: `ttEased ∈ [0,1]` que substitui o `ttRot`/`ttScale` lineares.
- **Auxiliares compartilhados** — `_smartSegmentRotDelta`, `_smartSegmentScaleDelta`, `_smartSegmentDuration`, `_smartSegmentRotVAvg`, `_smartSegmentScaleVAvg`, `_smartFrameScalarVelocity`, `_smartScalarHermiteT`. Núcleo Hermite com clamp Fritsch–Carlson (`α,β ∈ [0,3]`, `α²+β² ≤ 9`) para manter monotonicidade e prevenir overshoot.
- **Integração com Loop N→1** — Quando Loop ativo, o trecho de fechamento N→1 participa da suavização tanto para Rotação quanto para Escala (mesmo padrão já usado por Movimento). Quando Loop desligado, N→1 é ignorado pelos cálculos inteligentes.
- **Integração com `getStateAtT`** — Em modo `'smart'`, `ttScale` e `ttRot` são produzidos pelas novas funções; em modo `'manual'`, continuam vindo de `applyScaleEasingToT`/`applyRotEasingToT`. Valores nos extremos de cada trecho são preservados exatamente. Modos são independentes entre canais.
- **UI contextual** — Quando o canal ativo está em `'smart'`, os cards manuais (Constante/Acelerar/Desacelerar/Suavizar) ficam visíveis porém apagados/inativos, o Globe daquele canal aparece implícito/travado (laranja, sem clique), e o botão "Aplicar aos 3" some. Ao desligar, tudo volta a funcionar normalmente, preservando os easings manuais salvos por trecho.
- **`captureState`/`restoreState`** — `rotationEasingMode` e `scaleEasingMode` participam do undo/redo.
- **`buildProjectData`/`applyFrameData`** — Persistência em JSON com fallback `'manual'` para projetos antigos.
- **`resetAll`** — Reseta também os dois novos modos para `'smart'` (padrão de projeto novo).
- **`syncRotationEasingModeUI`/`syncScaleEasingModeUI`** — UI sincronizada nos pontos onde a UI de Movimento já era sincronizada (`setEasePanelChannel`, `setEaseChannel`, `openSegEasePanel`, `initEasePanel`).
- **`updateSegGlobalButton`** — Refatorado para tratar Globe implícito/travado por canal: cada Globe vira implícito quando o canal correspondente está em `'smart'` E é o canal ativo no painel. Sem cruzamento entre canais.

### Regras de continuidade

- **Pausa manda mais que smart.** Frame com pausa > 0 → velocidade angular/escala = 0 naquele frame. O trecho anterior desacelera até zero; o seguinte sai do zero.
- **Trecho 0.0s = corte seco.** Sem aplicação smart; fallback linear seguro. Nada de NaN/Infinity.
- **Mudança de sentido = tangente zero.** Quando `sign(vPrev) !== sign(vNext)` e ambos não-zero, a velocidade no frame é zerada (anti-overshoot/chicote). Vale para Rotação (inverter sentido) e Escala (zoom in seguido de zoom out).
- **Monotonicidade.** Clamp Fritsch–Carlson nas tangentes (`α,β ∈ [0,3]`, `α²+β² ≤ 9`) limita a ultrapassagem para escala/rotação dentro da janela definida pelos frames.
- **Delta ≈ 0.** Sem variação no trecho → fallback linear (cálculo seria degenerado).
- **Compatibilidade com Velocidade constante.** Velocidade constante define durações; smart usa essas durações; ordem preservada.

### O que não foi alterado

Design system geral, hierarquia visual da v8z4b17n, painel Duração/Tempo, Loop como trecho real N→1 da v8z4b17o, Pausa final espelho do último frame da v8z4b17p, Velocidade constante, motor de cálculo espacial e Movimento Inteligente (salvo compatibilidade natural com os novos canais), WebCodecs/export MP4, stage, curvas, sistema vetorial, nova timeline, seleção múltipla, safe area, menu inferior, cores, cards de easing, estrutura geral dos painéis.

### Compatibilidade

JSON sem `rotationEasingMode`/`scaleEasingMode` carrega em `'manual'` (preserva o easing manual salvo). JSON com os campos respeita os valores. Projetos novos iniciam em `'smart'` para os três canais.

## v8z4b17p — finish timeline sync fixes

Correção de três bugs de sincronização na lógica de Acabamento introduzida na v8z4b17o.

### Bugs corrigidos

- **Bug A — Pausa final segue o último frame atual** — Quando Pausa final está ativa e o usuário adiciona/remove frames, o valor da pausa é transferido automaticamente para o novo último frame. Ao adicionar um frame ao final, o antigo último fica com 0s e o novo último recebe o valor. Ao remover o último frame, o penúltimo herda o valor. `insertFrameAfterActive()` já mantinha o índice correto para inserções no meio. `deleteActiveFrame()` agora também faz o splice correto de `framePauses` (que estava ausente) e transfere a pausa quando o último frame é deletado.

- **Bug B — Velocidade constante redistribui ao ligar/desligar Loop** — `toggleLoop()` e `setFinishing()` passam a chamar `maybeRedistributeByCurveLength()` imediatamente após atualizar o estado. Quando Loop é ligado, o trecho N→1 entra na redistribuição proporcional por comprimento curvo. Quando desligado, os trechos normais são redistribuídos sem o N→1.

- **Bug C — Pausa final desliga quando pausa do último frame vira 0.0s** — Nova função `syncFinishControlsFromTimeline()` verifica `framePauses[lastIdx].duration`; se for 0 com `finishMode === 'pause'`, muda `finishMode` para `'none'` e atualiza a UI. Chamada em: slider de Pausa final (ao arrastar para 0), `setFramePause()` quando o frame editado é o último, `resetAllFramePauses()`, e slider global de pausas.

### Novas funções auxiliares

- `syncFinalPauseToLastFrame(oldLastIdx, newLastIdx)` — transfere a pausa final entre índices quando o último frame muda.
- `syncFinishControlsFromTimeline()` — sincroniza `finishMode` com a realidade de `framePauses[lastIdx]`.

### O que não foi alterado

Conceito da v8z4b17o, Loop como trecho real N→1, painel visual de trecho/easing da v8z4b17n, design system geral, cards de easing, Movimento Inteligente (salvo sincronização com loop já existente), export MP4/WebCodecs, Preview, stage, curvas, sistema vetorial, menu inferior, safe area, nova timeline, seleção múltipla.

### Compatibilidade

Projetos salvos na v8z4b17o continuam abrindo normalmente. A pausa final salva reflete `framePauses[lastFrame]`. Ao carregar, `syncFinishControlsFromTimeline()` garante que o estado visual seja coerente com a timeline real.

## v8z4b17o — loop as closing segment and final pause mirror

Reestruturação da lógica de Acabamento: Loop passa a representar o trecho real de fechamento N→1 na timeline, com duração, easing e curva próprios. Pausa final passa a espelhar diretamente `framePauses[últimoFrame]`, eliminando o tempo paralelo artificial.

### O que foi alterado

- **Loop = trecho de fechamento N→1** — Quando Loop ativo, o trecho `N→1` (último frame → primeiro frame) entra na timeline com duração própria (`loopDuration`). Antes era apenas um ajuste separado sem presença real na lista de trechos.
- **Trecho N→1 aparece na lista de Trechos** — `openSegBreakdown()` adiciona linha `N–1` com slider editável quando Loop ativo. Sincroniza bidirecionalmente com o slider do Acabamento.
- **Easing próprio do trecho N→1** — Novos estados `loopSegEasing`, `loopSegRotEasing`, `loopSegScaleEasing`. `getSegEase()/getRotEase()/getScaleEase()` retornam os valores corretos para `seg === frameCount - 1` quando Loop ativo. `selectSegEase()` e `applyEaseAllChannels()` escrevem nesses estados.
- **Pausa final = espelho de `framePauses[lastFrame]`** — `getDurationParts()` não soma mais `finishDuration` separadamente quando `finishMode === 'pause'`. A pausa já está contabilizada em `internalPauses` via `framePauses`. `setFinishing('pause')` adiciona 1.0s ao último frame se ainda estava em 0.
- **`initFinishSlider()`** — Quando `finishMode === 'pause'`, o slider escreve em `framePauses[lastIdx]` diretamente, não em `finishDuration`. Também atualiza a linha correspondente nas Pausas por frame.
- **`syncFinishingUIFromState()`** — Quando `finishMode === 'pause'`, lê `framePauses[frameCount-1].duration` como valor do slider (não mais `finishDuration`). Guard de parseFloat previne interrupção de drag.
- **`getSegAndLocalTAtTime()`** — Removida a zona especial de `finishMode === 'pause'` após o último frame: a pausa já é tratada normalmente por `framePauses[normalSegs]`.
- **`getStateAtT()`** — `finishExtra` não inclui mais `finishMode === 'pause'` (sem zona de acabamento separada para pausa final).
- **Ease pill na faixa de frames** — `updateFrameSelector()` adiciona ease pill para o trecho N→1 após o último frame quando Loop ativo.
- **Movimento Inteligente com loop** — `_smartFrameVelocity()` considera o trecho de fechamento como vizinho do primeiro e do último frame. `computeSmartMovementProgress()` tem branch dedicado para `seg === frameCount - 1` quando Loop ativo.
- **Velocidade constante com loop** — `redistributeDurationsByCurveLength()` inclui comprimento do trecho N→1 na redistribuição e escala `loopDuration` proporcionalmente.
- **`measureLoopCurveLength()`** — Nova função que mede o comprimento curvo real do trecho N→1 usando a mesma geometria Bézier do motor.
- **`buildProjectData()`** — Passa a salvar explicitamente `finishMode`, `finishDuration`, `loopCtrlPt`, `loopSegEasing`, `loopSegRotEasing`, `loopSegScaleEasing`.
- **`applyFrameData()`** — Restaura `finishMode`, `finishDuration`, `loopCtrlPt`, `loopSegEasing*`. Migração de JSON antigo: se `finishMode === 'pause'` e `finishDuration > 0` e último frame com pausa 0, migra para `framePauses[lastFrame]`.
- **`updateDurationUI()`** — Pausa final exibe `framePauses[frameCount-1].duration` em vez de `finishDuration`.
- **undo/redo** — `captureState()/restoreState()` incluem `loopSegEasing*`.
- **`resetAll()`** — Reseta `loopSegEasing*` para `'linear'`.
- **Versão** — `APP_VERSION` → `v8z4b17o`, `APP_VERSION_NAME` → `loop as closing segment and final pause mirror`.

### O que não foi alterado

Design system geral, visual dos cards de easing, hierarquia visual resolvida na v8z4b17n, sistema vetorial de curvas, stage, safe area, menu inferior geral, nova timeline, seleção múltipla, WebCodecs/export MP4 (sem breaking changes).

### Compatibilidade

JSON antigo com `finishMode: 'pause'` e `finishDuration > 0` é migrado automaticamente para `framePauses[lastFrame]` sem duplicação. Projetos sem loop ou pausa final carregam sem alteração.

## v8z4b17n — duration movement hierarchy and connected tabs

Correção da hierarquia visual do painel real de trecho/easing: título do segmento centralizado, Duração e Movimento com mesmo valor gráfico de seção, abas Velocidade/Rotação/Escala com continuidade visual ao conteúdo ativo.

### O que foi alterado

- **Título do segmento centralizado** — `SEG. 2–3` (elemento `panelEaseTitle`) passa a ser centralizado horizontalmente no painel, marcando hierarquia superior ao conteúdo editável abaixo.
- **DURAÇÃO como seção equivalente a MOVIMENTO** — Antes, `Duração` aparecia como pequeno label ao lado do slider. Agora, usa o mesmo estilo de label de seção (`ease-section-label`) e o slider fica dentro de um bloco `ease-dur-block` com `background:#3a3a3c` e `border-radius:12px`, idêntico visualmente ao conteúdo ativo do bloco Movimento.
- **Abas reais com continuidade** — `.ease-tab` recebe `border-radius:8px 8px 0 0` (topo arredondado, base reta). `.ease-tab-content` usa `background:#3a3a3c` e `border-radius:0 0 12px 12px`. O container `.ease-channel-block` tem `overflow:hidden` e `border-radius:12px`, garantindo que aba ativa e conteúdo formem bloco contínuo visualmente.
- **Abas inativas recuadas** — Fundo `var(--surface2)` (#2c2c2e), discretamente mais escuro que a aba ativa/conteúdo (#3a3a3c). Tab bar usa o fundo do painel (`var(--surface)`) como separador natural entre abas.
- **Novos estilos CSS** — `.ease-section-label`, `.ease-dur-block`, `.ease-channel-block`, `.ease-tab-content` adicionados. Anteriores `.ease-tabs-bar` e `.ease-tab` ajustados.
- **Versão** — `APP_VERSION` → `v8z4b17n`, `APP_VERSION_NAME` → `duration movement hierarchy and connected tabs`.

### O que não foi alterado

Motor do Movimento Inteligente, cálculo Hermite, Velocidade constante, easing de Velocidade/Movimento, easing de Rotação, easing de Escala, cards Constante/Acelerar/Desacelerar/Suavizar, toggle Movimento Inteligente, ícone Global contextual, Preview, export MP4, WebCodecs, loop, pausas, duração funcional, stage, curvas, sistema vetorial, seleção múltipla, menu inferior, safe area, timeline, JSON.

### Compatibilidade

Nenhuma mudança de estrutura de dados. Todos os projetos existentes carregam sem alteração.

## v8z4b17m — real channel tabs and velocity naming

Correção da hierarquia visual do painel de trecho/easing e renomeação do canal de movimento.

### O que foi alterado

- **Renomeação de canal** — A aba `Movimento` dentro da barra de canais passa a se chamar `Velocidade`. O título `Movimento` é mantido como nome da seção acima da barra.
- **Hierarquia visual da barra de abas** — A aba ativa agora usa `background:#3a3a3c` (mais claro que a faixa `--surface2` = #2c2c2e), criando hierarquia legível: painel(#1c1c1e) → faixa(#2c2c2e) → aba-ativa(#3a3a3c). Antes, a aba ativa usava `var(--surface)` = #1c1c1e, idêntico ao fundo do painel.
- **Cor da aba ativa** — Texto branco (`#fff`) em vez de `var(--accent)`, com fundo sólido destacado. Aba inativa mantém texto em `rgba(174,174,178,0.75)` (discreto, mas legível).
- **Abas inativas mais discretas** — `color:rgba(174,174,178,0.75)` com `font-weight:500`, sem fundo.
- **Label de seção "Movimento"** — Adicionado acima da faixa de abas, em `font-size:10px`, uppercase, `color:var(--text3)`. Dá contexto sem poluir.
- **Mini-painel `segEasePanel`** — Botão do canal `movement` também renomeado para `Velocidade`.
- **CSS** — `.ease-tab` recebe `text-align:center` e `transition` ajustado para `.18s`. `.ease-tab-active` atualizado.
- **Versão** — `APP_VERSION` → `v8z4b17m`, `APP_VERSION_NAME` → `real channel tabs and velocity naming`.

### O que não foi alterado

Motor do Movimento Inteligente, cálculo Hermite, Velocidade constante, easing de Rotação, easing de Escala, toggle Movimento Inteligente, ícone Global contextual, cards Constante/Acelerar/Desacelerar/Suavizar, Preview, export MP4, WebCodecs, loop, pausas, duração, stage, curvas, sistema vetorial, seleção múltipla, menu inferior, safe area, timeline, JSON.

### Compatibilidade

Nenhuma mudança de estrutura de dados. Todos os projetos existentes carregam sem alteração.

## v8z4b17l — channel tabs and smart movement toggle

Reorganização visual do painel de easing para transformar Movimento/Rotação/Escala em abas reais, substituir o par de botões Manual/Inteligente por um único toggle switch e tornar o ícone Global contextual à aba ativa.

### O que foi alterado

- **Abas reais de canal** (`panelEase`) — Movimento/Rotação/Escala agora usam `.ease-tabs-bar` + `.ease-tab` em vez de botões com borda pill. Aba ativa recebe `.ease-tab-active` com cor accent e fundo destacado.
- **Toggle único Movimento Inteligente** — Removidos os botões `Manual` / `Inteligente`. Substituídos por um switch iOS-style (`<label class="smart-toggle">`). Label clicável ao lado do toggle. Mesmo padrão no mini-painel `segEasePanel`.
- **Ícone Global contextual por aba** — Removido do cabeçalho do painel. Cada aba tem sua própria instância: `easeGlobeLock` (Movimento), `easeGlobeRot` (Rotação), `easeGlobeScale` (Escala). Mostrado na linha de ações da aba ativa.
- **Global implícito quando Inteligente ON** — No canal Movimento com Inteligente ativo, o globe recebe `.global-implicit` (laranja, opacidade reduzida, sem pointer-events), indicando que o modo já é global por natureza.
- **Linhas de ações por aba** — `movChannelActions` (toggle + globe), `rotChannelActions` (apenas globe), `scaleChannelActions` (apenas globe). Exibição controlada por `_syncEaseChannelUI()`.
- **`updateSegGlobalButton()`** — Atualizada para sincronizar os três globes (`easeGlobeLock`, `easeGlobeRot`, `easeGlobeScale`) e aplicar `.global-implicit` ao globe de Movimento quando adequado.
- **`_syncEaseChannelUI()`** — Usa `.ease-tab-active` class em vez de inline styles para o painel principal. Mostra/oculta linhas de ações das abas.
- **`syncMovementEasingModeUI()`** — Reescrita: sincroniza toggle checkbox (principal e mini-painel), chama `updateSegGlobalButton()`, subordina chips, controla "Aplicar aos 3". Remove lógica de botão duplo.
- **`setMovementEasingModeFromToggle(checked)`** — Nova função wrapper para o handler `onchange` do toggle.
- **Dica curta removida** — `movSmartHint` removido do HTML (informação inline não era necessária após a melhora visual).
- **CSS** — `.ease-tabs-bar`, `.ease-tab`, `.ease-tab-active`, `.smart-toggle`, `.smart-toggle-track`, `.global-implicit` adicionados.
- **Versão** — `APP_VERSION` → `v8z4b17l`, `APP_VERSION_NAME` → `channel tabs and smart movement toggle`.

### O que não foi alterado

Motor do Movimento Inteligente, cálculo Hermite, Velocidade constante, easing de Rotação, easing de Escala, Preview, export MP4, WebCodecs, loop, pausas, duração, stage, curvas, sistema vetorial, seleção múltipla, menu inferior, safe area, timeline, indicadores visuais de easing, JSON (estrutura de dados inalterada).

### Compatibilidade

- Projetos antigos sem `movementEasingMode` → carregam como `'manual'` (sem mudança visual).
- Projetos salvos com `movementEasingMode: 'smart'` → carregam corretamente em Inteligente.
- Projetos salvos com `movementEasingMode: 'manual'` → carregam corretamente em Manual.
- Novos projetos (reset/imagem nova) → iniciam em Inteligente.

## v8z4b17k — clean smart movement panel

Reorganização visual do painel de easing para reduzir o excesso de pílulas e comunicar com clareza que **Movimento Inteligente** é um modo do canal Movimento — não um controle independente.

### O que foi alterado

- **Padrão para projetos novos** — `movementEasingMode` agora inicia como `'smart'` em `resetAll()`. Projetos antigos sem `movementEasingMode` no JSON continuam carregando em `'manual'` (retrocompatível).
- **Linha de modo condicional** — `movEasingModeRow` (e `segMovEasingModeRow` no mini-painel) só aparecem quando o canal **Movimento** está selecionado. Para Rotação e Escala, a linha some — sem pílulas extras.
- **Abas de canal mais discretas** (`panelEase`) — botões Movimento/Rotação/Escala agora usam `background:transparent` e `color:var(--text3)` quando inativos, reduzindo o peso visual. O mini-painel (`segEasePanel`) mantém o estilo pílula original.
- **Rótulo limpo** — "Movimento Inteligente" como texto corrido + dois botões compactos `Manual` / `Inteligente`, sem o rótulo em caixa-alta anterior.
- **"Aplicar aos 3" oculto em modo Inteligente** — `applyAllChannelsWrap` e `segApplyAllWrap` ficam com `display:none` quando `movementEasingMode === 'smart'`. Voltam ao normal em modo Manual.
- **Dica curta** — texto reduzido para "Continuidade automática entre trechos." (era uma frase longa explicando canais).
- **Modo Inteligente no mini-painel** — `segEasePanel` ganhou a linha `segMovEasingModeRow` com botões `segMovEaseMode_manual` / `segMovEaseMode_smart`, sincronizados pelos mesmos handlers existentes.
- **`_syncEaseChannelUI`** — diferencia o estilo inativo entre mini-painel (`var(--text2)`, weight 500) e painel principal (`var(--text3)`, weight 400).
- **`syncMovementEasingModeUI`** — expandida para controlar: visibilidade das linhas de modo, botões de ambos os painéis, chips, wrappers de "Aplicar aos 3" e dica.
- **Versão** — `APP_VERSION` → `v8z4b17k`, `APP_VERSION_NAME` → `clean smart movement panel`.

### O que não foi alterado

Motor do Movimento Inteligente, cálculo Hermite, Velocidade constante, easing de Rotação, easing de Escala, Preview, export MP4, WebCodecs, loop, pausas, duração, stage, curvas, sistema vetorial, seleção múltipla, menu inferior, safe area, timeline, indicadores visuais de easing.

### Compatibilidade

- Projetos antigos sem `movementEasingMode` → carregam como `'manual'` (sem mudança visual).
- Projetos salvos com `movementEasingMode: 'smart'` → carregam corretamente em Inteligente.
- Projetos salvos com `movementEasingMode: 'manual'` → carregam corretamente em Manual.
- Novos projetos (reset/imagem nova) → iniciam em Inteligente.

---

## v8z4b17j — smart movement easing experiment

Versão **experimental** que adiciona um modo opcional de **Easing Inteligente** apenas para o canal **Movimento**. O comportamento padrão continua sendo `Manual`; nada muda visualmente em projetos antigos.

### Conceito

`Easing Inteligente` é um modo automático de continuidade de velocidade entre trechos vizinhos. Em cada frame intermediário, a velocidade média do trecho anterior é casada com a velocidade média do trecho seguinte, criando uma transição suave (Hermite cúbica) em vez do "tranco" que aparece quando dois trechos têm velocidades médias muito diferentes.

- Pausa no frame  → velocidade no frame é `0` (desacelera até parar; sai do zero).
- Trecho `0.0s`   → corte seco (não tenta aplicar smart; sem NaN/Infinity).
- Primeiro/último frame → fallback com a velocidade média do próprio trecho.
- Rotação e Escala continuam usando seus próprios `rotEasings` / `scaleEasings` — Inteligente atua **somente** sobre Movimento.

### O que foi alterado

- **Novo estado `movementEasingMode`** — `'manual' | 'smart'`, default `'manual'`. Persiste em JSON (`buildProjectData` / `loadProjectFromJson`), entra no `captureState` / `restoreState` (undo/redo) e no `resetAll`.
- **Novo cálculo `computeSmartMovementProgress(seg, tt)`** — Hermite cúbica com `p0=0`, `p1=curveLen`, `m0=vStart`, `m1=vEnd`, `Δ=dur`; reaproveita `measureSegmentCurveLength()` do modo Velocidade constante. Velocidades de extremidade limitadas a `3·vAvg` para manter monotonicidade.
- **`getStateAtT()`** — quando `movementEasingMode === 'smart'`, `ttEased` vem de `computeSmartMovementProgress` em vez de `applySegEasingToT`. Toda a cadeia seguinte (`mapProgressToBezierU` → `bezierPointAt`) é a mesma; rotação e escala usam seus easings próprios como antes.
- **UI mínima no painel `panelEase`** — uma linha compacta `Movimento [ Manual ] [ Inteligente ]` logo abaixo do seletor de canal. Quando `Inteligente` está ativo e o canal selecionado é Movimento, os chips `Constante/Acelerar/Desacelerar/Suavizar` ficam subordinados (`opacity 0.4`, `pointer-events:none`) e aparece um aviso `Movimento em modo Inteligente: continuidade automática…`.
- **Sincronização** — `setMovementEasingMode`, `syncMovementEasingModeUI`, integrações em `setEaseChannel`, `setEasePanelChannel`, `initEasePanel` e nas restaurações de `restoreState`, `resetAll`, `loadProjectFromJson`.
- **Versão** — `APP_VERSION` → `v8z4b17j`, `APP_VERSION_NAME` → `smart movement easing experiment`; cabeçalho HTML, comentário de versão do arquivo e `Configurações` atualizados.

### O que não foi alterado

Sistema vetorial de curvas, edição visual das curvas, handles, stage, timeline, redesign do painel Duração/Tempo, indicadores visuais de easing, menu inferior, safe area, play, seleção múltipla, rotação inteligente, escala inteligente, cores, ícones, layout geral. Rotação e Escala continuam respeitando `rotEasings` / `scaleEasings` independentemente do modo de Movimento. `segEasings` continuam salvos no JSON — apenas são ignorados durante o cálculo espacial enquanto `smart` estiver ativo.

### Interação com Velocidade constante

`Velocidade constante` continua distribuindo `segDurations` por comprimento curvo **antes** do cálculo de Movimento. O `Easing Inteligente` lê essas durações já distribuídas para calcular `vAvg`. Quando ambos estão ativos, as velocidades médias dos trechos tendem a se igualar, o que faz a Hermite degenerar para linear — exatamente o comportamento esperado (Velocidade constante já entrega a transição contínua).

### Compatibilidade

Retrocompatível com projetos `v8z4b17i` e anteriores. Projetos antigos que não contêm `movementEasingMode` no JSON são carregados como `'manual'` — comportamento idêntico ao da v8z4b17i. Nenhuma promoção automática para `main` está prevista nesta versão experimental.

---

## v8z4b17i — duration panel always expanded

Ajuste de UX no painel Duração/Tempo: todas as seções (Trechos, Pausas por frame e Acabamento) ficam sempre abertas. O comportamento de recolher/expandir foi removido.

### O que foi alterado

- **`durationPanelSections`** — estado inicial de `finish` alterado de `false` para `true`; todos os valores agora são `true`.
- **`toggleDurationSection()`** — função convertida em no-op; cliques nos títulos não alteram mais o estado das seções.
- **`syncDurationSectionsUI()`** — simplificada para sempre exibir todas as seções (sem verificar booleanos); sempre chama `openSegBreakdown()`, `renderFramePauseRows()` e `syncDurationControlsFromState()`.
- **HTML títulos das seções** — `<button onclick="toggleDurationSection(...)">` substituído por `<div>` sem handler, eliminando o comportamento interativo dos cabeçalhos.
- **HTML `#finishSection`** — atributo inline `display:none` alterado para `display:block`; seção Acabamento já aparece visível antes do JS carregar.
- **CSS `.dur-section-header`** — `cursor:pointer` alterado para `cursor:default`; título não sinaliza mais interatividade.
- **CSS `.dur-section-chevron`** — `display:none`; chevrons/setas de accordion ocultados.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17i`.

### Comportamento após esta versão

| Situação | Resultado |
|---|---|
| Abrir painel Duração/Tempo | Trechos, Pausas por frame e Acabamento já aparecem abertos |
| Tocar nos títulos das seções | Nenhuma alteração visual ou de estado |
| Alterar qualquer valor do painel | Seções não recolhem |
| Fechar e reabrir o painel | Todas as seções continuam abertas |

### O que não foi alterado

Motor de animação, preview, export MP4, WebCodecs, cálculo de velocidade constante, easing por canal, Aplicar aos 3, modo global, Igualar intervalos, lógica de pausas e trechos, loop, acabamento, stage, menus, scroll do painel, controles internos das seções.

### Compatibilidade

Retrocompatível com projetos v8z4b17h e anteriores.

---

## v8z4b17h — duration sections stay expanded

Ajuste de UX no painel Duração/Tempo: as seções Trechos e Pausas por frame abrem expandidas por padrão e permanecem abertas durante toda a sessão.

### O que foi alterado

- **`durationPanelSections`** — estado inicial de `segments` e `pauses` alterado de `false` para `true`; a seção Acabamento (`finish`) permanece fechada por padrão.
- **HTML inicial** — `#segBreakdown` e `#framePauseSection` agora têm `display:flex` no atributo inline, e o chevron de Pausas por frame inicia com `▾`, evitando flash de conteúdo errado antes do JS carregar.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17h`.

### Comportamento após esta versão

| Situação | Resultado |
|---|---|
| Abrir painel Duração/Tempo | Trechos e Pausas por frame já aparecem expandidos |
| Fechar e reabrir o painel | Trechos e Pausas por frame continuam expandidos |
| Alterar qualquer valor do painel | Seções não recolhem automaticamente |
| Seção Acabamento | Mantém comportamento anterior (fechada por padrão) |

### O que não foi alterado

Motor de animação, preview, export MP4, WebCodecs, cálculo de velocidade constante, easing por canal, Aplicar aos 3, modo global, Igualar intervalos, lógica de pausas e trechos, loop, acabamento, stage, menus, scroll do painel.

### Compatibilidade

Retrocompatível com projetos v8z4b17g e anteriores.

---

## v8z4b17g — constant speed manual override state fix

Corrige inconsistências de estado do modo **Velocidade constante** após ações manuais de tempo.

### O que foi alterado

- **`distributeSegEqual()`** — ao clicar em "Igualar intervalos", o app agora muda para `segmentTimingMode = 'manual'` e limpa `constantSpeedTotalDuration`; botão Velocidade constante desliga imediatamente.
- **Ease panel (`easePanelSegSlider`) — handler `input`** — ao editar a duração individual de um trecho pelo painel contextual enquanto Velocidade constante está ativa, o modo muda automaticamente para Manual, os tempos ficam congelados e não há redistribuição.
- **Loop** — confirmado que `redistributeDurationsByCurveLength()` opera apenas sobre `segDurations[0..segs-1]`; `loopDuration` permanece separado e inalterado.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17g`.

### Regras de estado após esta versão

| Ação | Resultado |
|---|---|
| Ativar Velocidade constante | redistribui trechos por percurso curvo |
| Alterar tempo total (slider Total) | redistribui proporcionalmente (modo permanece ativo) |
| Mover frame / curva / inserir / remover frame | redistribui (modo permanece ativo) |
| "Igualar intervalos" | distribui igualmente, **muda para Manual** |
| Editar trecho individual (ease panel) | congela tempos, **muda para Manual** |
| Desligar Velocidade constante | tempos congelados, modo Manual |

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, durSlider total, sliders de `#segRows` desabilitados em constant-speed, easing de movimento/rotação/escala, blur, pausas, loop, acabamento, stage, menus.

### Compatibilidade

Retrocompatível com projetos v8z4b17f e anteriores.

---

## v8z4b17f — constant speed timing by curve length

Implementa modo persistente de distribuição de tempo por velocidade média constante, calculado pelo comprimento real da curva de cada trecho.

### O que foi alterado

- **Estado global** — adicionados `segmentTimingMode` (`'manual'` | `'constant-speed'`) e `constantSpeedTotalDuration`.
- **HTML `#segBreakdown`** — novo seletor de modo **Manual / Velocidade constante** inserido na seção de Trechos, antes dos sliders individuais; botões em estilo chip; dica discreta "Distribui o tempo conforme o percurso curvo." visível apenas no modo ativo.
- **`measureSegmentCurveLength(segIndex)`** — nova função que amostra 64 pontos ao longo da curva Bézier real do trecho (mesma geometria do motor) e retorna o comprimento em pixels do stage.
- **`redistributeDurationsByCurveLength()`** — nova função que distribui `constantSpeedTotalDuration` proporcionalmente aos comprimentos curvos; trechos com `0.0s` permanecem zerados (cortes secos); sanitiza NaN/Infinity.
- **`maybeRedistributeByCurveLength()`** — aciona redistribuição apenas quando o modo está ativo; chamada após eventos de geometria (mover frame, redimensionar, mover curva, inserir/remover frame, alterar total).
- **`setSegmentTimingMode(mode)`** — define o modo, salva undo, inicia redistribuição ao ativar e sincroniza a UI.
- **`syncTimingModeUI()`** — sincroniza botões de modo e desabilita/habilita sliders individuais conforme o modo ativo.
- **`endDrag()`** — agora chama `maybeRedistributeByCurveLength()` ao final de qualquer drag de frame ou curva.
- **`addFrame()`, `insertFrameAfterActive()`, `removeLastFrame()`** — chamam `maybeRedistributeByCurveLength()` ao finalizar.
- **`durSlider` input handler** — em modo `constant-speed`, atualiza `constantSpeedTotalDuration` e redistribui em vez de escalar proporcionalmente.
- **`openSegBreakdown()`** — chama `syncTimingModeUI()` ao montar as linhas, refletindo estado correto dos sliders.
- **Sliders individuais de trecho** — `input` handler recusa alteração quando modo `constant-speed` está ativo; visualmente desabilitados (opacity 0.4).
- **`buildProjectData()`** — persiste `segmentTimingMode` e `constantSpeedTotalDuration` no JSON.
- **`applyFrameData()`** — restaura `segmentTimingMode` e `constantSpeedTotalDuration`; projetos antigos recebem `'manual'`.
- **`captureState()` / `restoreState()`** — incluem `segmentTimingMode` e `constantSpeedTotalDuration` no undo/redo.
- **`resetAll()`** — redefine `segmentTimingMode = 'manual'` e `constantSpeedTotalDuration = null`.
- **`syncApplyAllChannelsButtonState()`** — corrigido para não manter o botão "Aplicar aos 3" ligado de forma persistente; sempre retorna ao estado neutro (v8z4b17f).
- **`applyEaseAllChannels()`** — adicionado flash momentâneo (700ms) no botão "Aplicar aos 3" após ação, voltando ao estilo neutro.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17f`.

### Comportamento do modo Manual

- Preserva o comportamento anterior completo.
- Sliders individuais editáveis.
- App não recalcula tempos automaticamente.

### Comportamento do modo Velocidade constante

- O usuário define o total via slider **Total**; o app redistribui proporcionalmente ao comprimento curvo.
- Trechos com `0.0s` (cortes secos) permanecem zerados e excluídos da distribuição.
- Redistribuição automática a cada: mover frame, mover curva, inserir/remover frame, alterar total.
- Ao desligar, os tempos calculados ficam congelados e o modo volta para Manual.

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, curvas Catmull-Rom, pausas por frame, loop, acabamento, menus, safe area, stage, easing, blur, seleção múltipla.

### Compatibilidade

Projetos antigos (sem `segmentTimingMode`) abrem em modo **Manual** sem recalculo.

---

## v8z4b17e — apply all channels active state

Adiciona feedback visual ao botão **Aplicar aos 3** no painel de edição de trecho (`#panelEase`).

### O que foi alterado

- **HTML `#panelEase`** — adicionado `id="btnApplyAllChannels"` ao botão **Aplicar aos 3** (v8z4b17e).
- **`syncApplyAllChannelsButtonState()`** — nova função que lê `segEasings[seg]`, `rotEasings[seg]` e `scaleEasings[seg]` do trecho ativo e destaca o botão (borda e texto em `var(--accent)`) quando os três valores são iguais; restaura estilo neutro caso contrário.
- **`initEasePanel()`** — chama `syncApplyAllChannelsButtonState()` após `_syncEaseChannelUI()`, garantindo atualização automática ao abrir o painel, trocar de canal, aplicar easing individual, aplicar aos 3 e carregar projeto.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17e`.

### Comportamento do botão

- **Ativo** (borda + texto `var(--accent)`): quando `segEasings[seg] === rotEasings[seg] === scaleEasings[seg]`.
- **Inativo** (estilo neutro): quando os três canais diferem.
- O estado é recalculado automaticamente ao abrir outro segmento, trocar de canal, alterar um canal individualmente ou carregar JSON.

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, cálculo de duração, pausas, curvas,
posição, rotação, escala, stage, menus, safe area, `segEasePanel` original,
modo global, comportamento funcional do botão Aplicar aos 3.

### Compatibilidade

Nenhuma alteração nos dados persistidos. Projetos antigos abrem normalmente.

---

## v8z4b17d — apply easing to all channels

Adiciona o botão **Aplicar aos 3** no painel real de edição de trecho (`#panelEase`),
permitindo aplicar em um clique o easing atualmente selecionado aos três canais
(**Movimento / Rotação / Escala**) do trecho ativo.

### O que foi alterado

- **HTML `#panelEase`** — novo botão compacto `Aplicar aos 3` inserido entre o
  seletor de canal e o grid de cards de easing (v8z4b17d).
- **`applyEaseAllChannels()`** — nova função que lê o easing atual do canal ativo
  via `_getActiveChannelEase(seg)` e o escreve em `segEasings[seg]`,
  `rotEasings[seg]` e `scaleEasings[seg]`; chama `pushUndo()` antes de modificar
  e `initEasePanel()` após para refletir o estado nos cards de cada canal.
- **Versão** — `APP_VERSION` atualizado para `v8z4b17d`.

### Comportamento do botão

- Lê o easing do canal **atualmente ativo** no painel (Movimento, Rotação ou
  Escala) para o segmento aberto.
- Aplica esse easing **apenas ao trecho atual** — não altera outros segmentos.
- Não interfere com o modo global (globo/cadeado), que continua funcionando como antes.
- Após aplicar, alternar entre os canais mostra todos com o mesmo card ativo.

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, cálculo de duração, pausas, curvas,
posição, rotação, escala, stage, menus, safe area, seleção múltipla,
`segEasePanel` original, modo global.

### Compatibilidade

Projetos antigos continuam abrindo normalmente. O botão apenas escreve nos arrays
existentes (`segEasings`, `rotEasings`, `scaleEasings`).

---

## v8z4b17c — show channel easing in segment panel

Expõe o seletor de canal (**Movimento / Rotação / Escala**) diretamente no painel
real de edição de trecho (`#panelEase`), o mesmo painel que o usuário acessa no
fluxo normal e que exibe o título **SEG. 1-2**, o slider de Duração e os cards
Constante / Acelerar / Desacelerar / Suavizar.

### O que foi alterado

- **HTML `#panelEase`** — três botões `easePanelCh_movement / rotation / scale`
  inseridos como uma linha compacta acima do grid de cards de easing.
- **`initEasePanel()`** — agora lê o easing atual via `_getActiveChannelEase(seg)`
  (respeitando o canal ativo) e chama `_syncEaseChannelUI()` para destacar o
  botão de canal correto ao abrir ou atualizar o painel.
- **`selectSegEase(ease, seg)`** — agora escreve em `segEasings`, `rotEasings`
  ou `scaleEasings` dependendo de `_activeEaseChannel`; a verificação de
  redundância também usa `_getActiveChannelEase`.
- **`_syncEaseChannelUI()`** — passa a sincronizar também os botões
  `easePanelCh_*` do `#panelEase`, além dos `easeCh_*` do `segEasePanel`.
- **`setEasePanelChannel(ch)`** — nova função chamada pelos botões do `#panelEase`;
  delega para `_syncEaseChannelUI()` + `initEasePanel()`.

### O que não foi alterado

Motor de preview, export MP4, WebCodecs, cálculo de duração, pausas, posição,
curvas, stage, menus, safe area, play, seleção múltipla, `segEasePanel` original.

### Compatibilidade

Projetos antigos continuam abrindo normalmente; arrays ausentes recebem `'linear'`.

---

## v8z4b17b — channel easing controls

Seletor de canal no painel de easing existente: permite escolher entre
**Movimento**, **Rotação** e **Escala** e ajustar o easing de cada canal
independentemente para o segmento ativo. Adiciona `scaleEasings` (N−1 entradas)
para controle de zoom/tamanho separado do movimento espacial. Compatibilidade
total com projetos antigos (campos ausentes preenchidos com `'linear'`).

### O que foi adicionado

- **`scaleEasings`** — array por segmento para easing de escala (w/h),
  paralelo a `segEasings` e `rotEasings`. Padrão: `'linear'`.
- **`ensureScaleEasings()`** / **`getScaleEase(seg)`** / **`applyScaleEasingToT(t, ease)`**
  — helpers de escala seguindo o mesmo padrão dos canais anteriores.
- **`_activeEaseChannel`** — estado local do painel: `'movement'` | `'rotation'` | `'scale'`.
- **`setEaseChannel(ch)`** — troca o canal ativo e atualiza os chips de easing.
- **Seletor de canal no `segEasePanel`** — três botões (Movimento / Rotação / Escala)
  no topo do mini-painel existente. Nenhum painel novo criado.
- Labels de easing atualizados: Linear · Entrada/Saída · Entrada · Saída.

### Motor de animação

`getStateAtT` agora calcula três parâmetros `t` independentes:
- `ttEased` (segEasings) → posição/trajetória
- `ttScale` (scaleEasings) → interpolação w/h
- `ttRot` (rotEasings) → interpolação angular

### Compatibilidade

- Projetos sem `scaleEasings` carregam normalmente; array preenchido com `'linear'`.
- Projetos sem `rotEasings` continuam funcionando (comportamento v8z4b17a).
- `buildProjectData` inclui ambos os campos; `applyFrameData` restaura com fallback.
- Inserção/remoção de frames mantém arrays alinhados.

---

## v8z4b17a — rotation easing engine foundation

Fundação técnica de easing de rotação por segmento. **Foco único:** preparar
o motor de interpolação para que a rotação entre frames possa usar uma curva
própria, independente do easing de movimento (`segEasings`). Sem alteração de
layout, menus, UI de preview, export MP4, WebCodecs, posição, escala, curvas
ou qualquer outro subsistema.

### O que foi adicionado

- **`rotEasings`** — novo array por segmento (N−1 entradas para N frames),
  paralelo ao `segEasings`. Padrão: `'linear'` em todos os trechos, preservando
  o comportamento visual de projetos antigos que não tenham o campo.
- **`ensureRotEasings()`** — garante tamanho correto do array (mesma lógica
  de `ensureSegEasings`).
- **`getRotEase(seg)`** — lê o easing de rotação do segmento com fallback
  `'linear'`.
- **`applyRotEasingToT(t, ease)`** — aplica a curva ao parâmetro `t` local.
  Valores aceitos: `'linear'`, `'ease-in'`, `'ease-out'`, `'ease-in-out'`
  (mesmos nomes já usados em `segEasings`).

### Onde a UI futura pode atuar

Para expor controle de rotEasings na interface, basta atribuir:
```js
rotEasings[seg] = 'ease-in-out'; // ou 'ease-in' / 'ease-out' / 'linear'
ensureRotEasings();
```
e chamar `stopPreview(); startPreview()` se o preview estiver ativo. Nenhuma
mudança adicional no motor é necessária.

### Interpolação

`getStateAtT` agora calcula:
- `tMove` (`ttEased`) = easing de movimento do segmento (segEasings) → usado em posição e escala
- `tRot` (`ttRot`) = `applyRotEasingToT(tt, rotEasings[seg])` → usado apenas na rotação

Por padrão `tRot = tt` (linear), o que equivale ao comportamento anterior para
projetos com `segEasings = 'linear'`.

### Gerenciamento de arrays

- **insertFrameBetween**: dois novos trechos recebem `'linear'` em `rotEasings`.
- **removeLastFrame / deleteFrame**: `normalizeProjectArrays()` e
  `ensureRotEasings()` mantêm o array alinhado.
- **Templates / reset completo**: `rotEasings.length = 0` junto com os demais arrays.
- **Undo/redo**: `captureState` e `restoreState` incluem `rotEasings`.

### Save / Load JSON

- `buildProjectData()` salva `rotEasings` no JSON.
- `applyFrameData()` carrega `rotEasings`; se o campo não existir (projeto
  antigo), `ensureRotEasings()` preenche com `'linear'` — sem quebra.

### Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para v8z4b17a.
  `pages-deploy-stamp.txt`, `CHANGELOG.md` e `QA.md` atualizados.

### Não alterado nesta rodada

Layout geral, menus inferiores, safe area, play, preview UI, menu de
transformação, nova timeline, stage, curvas visuais, seleção múltipla, export
MP4, WebCodecs, duração/tempo, pausas, escala, posição, textos, cores, ícones,
easing de movimento (`segEasings`).

## v8z4b16m — gap final slider/botões nos submenus de transformação

Microajuste visual final sobre a v8z4b16l. **Foco único:** aumentar em
5px o gap entre a linha do slider e a linha de botões (−5/+5/Reset) nos
submenus de transformação (Escala, Rotação, Pausa, Posição) para que a
bolinha do slider e os botões não fiquem encavalados em iPhone/Safari.
**Não toca** em motor de animação, preview, exportação MP4, WebCodecs /
MediaRecorder, cálculo de tempo, ranges dos sliders, valores exibidos,
comportamento dos botões −5/+5/Reset, lógica de escala, rotação, pausa
ou posição, menu de frames, posição da faixa de frames, botão Voltar,
safe-area, textos, ícones, cores ou layout geral.

### Alteração

- `#custBarContent .cust-content > div + div`: `margin-top` sobe de
  `10px` para `15px` (+5px). Esse é o único seletor CSS modificado.

### Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16m. `pages-deploy-stamp.txt`, `CHANGELOG.md` e `QA.md`
  atualizados.

### Não alterado nesta rodada

Motor de animação, WebCodecs / export MP4, preview/canvas, cálculo de
tempo, lógica de pausas, lógica de trechos, ranges dos sliders, valores
exibidos, comportamento dos botões −5%/+5%/Reset, easing, curvas, JSON,
templates, seleção múltipla, alinhamento/distribuição, ícones (SVGs),
textos de interface, paleta de cores, fluxo geral do app, botão Voltar,
menu de frames (continua fixo), safe-area.

## v8z3u — stable candidate

Base congelada para migração ao GitHub/Codex.

### Mantém

- Exportação via WebCodecs.
- MP4 sem trancos/kicks no teste principal.
- Curva/easing preservados após rollback da v8z3t.
- Comportamento atual do motor de movimento.
- Pausa por frame.
- Interface atual sem redesenho estrutural.

### Observações

- A v8z3t foi descartada por regressão: quebrou edição de curvas e trouxe de volta comportamento indevido de easing na curva.
- A próxima versão estável mínima deve corrigir apenas bugs pequenos e isolados.

## Próximos fixes candidatos

### Bug — Escala global reseta curvas

No Template Circular, ao alterar escala de vários frames com ajuste Global, as curvas não devem ser resetadas.

### Ajuste visual — Fixar ativo em vermelho

Quando Fixar estiver ativo em algum frame, usar destaque vermelho, não azul.

## v8z3w — Export stability diagnostics

- **Status:** candidata validada em teste prolongado.
- **Resultado:** bug do MP4 exportado sem imagem não foi reproduzido após múltiplos testes.
- **Testes realizados:** múltiplas edições, escala, posição, rotação, easing/transição, fundo branco/preto, múltiplas gerações de MP4 na mesma sessão e retorno para edição após export.
- **Decisão:** não aplicar patch adicional no export neste momento.
- **Fallback:** se o bug voltar, abrir **v8z3x — Isolated export/preview loop guard**.

## v8z4a — 30-frame capacity sprint

- Limite máximo de frames aumentado para 30.
- Capacidade técnica ampliada a partir do limite central de frames, preservando o fluxo atual de criação, remoção, seleção e renderização.
- Projetos antigos com menos frames devem permanecer compatíveis, sem alteração intencional no formato de JSON.
- Checklist de QA inclui teste obrigatório em iPhone/Safari via GitHub Pages com cache busting.

## v8z4b — Insert frame on existing curve

- Correção da inserção de frame dentro de curva existente quando o frame ativo possui próximo frame.
- Preservação do caminho ao dividir o segmento original em dois segmentos mantendo a forma visual da curva.
- Mantida compatibilidade com projetos antigos (JSON e fluxo de edição existente).

## v8z4b1 — Preserve split curve after frame edit

- Correção do reset de curva ao mover/editar frame inserido dentro de curva existente.
- Preservação das curvas adjacentes ao frame movido sem retilinização automática.
- Preservação de ctrlPts manuais dos segmentos vizinhos após a divisão da curva.

## v8z4b3 — Inserted frame pass-through easing

- Correção do easing duplicado ao inserir frame entre dois frames existentes.
- Frame inserido passa a funcionar como ponto de passagem contínua, sem criar desaceleração/aceleração extra no meio.
- Preservação do easing original entre os extremos do trecho original após o split.

## v8z4b2 — Restore curve/easing separation

- Correção da regressão em que o ponto de controle da curva influenciava a sensação de easing/velocidade temporal.
- Restauração da separação entre caminho geométrico (curva) e easing temporal (transição por segmento).
- Mantida a compatibilidade com o patch v8z4b de inserção de frame dentro da curva.

## v8z4b16k — Vertical breathing room in transform submenus

Microajuste visual sobre a v8z4b16j. **Foco único:** redistribuir o
espaço vertical dentro dos submenus de transformação (Pausa, Rotação,
Escala, Posição) para dar mais respiro entre a faixa de frames acima e
o thumb do slider, e eliminar a sobra inferior visível dentro do
painel — sem alterar a altura do `#custBar` (faixa de frames continua
fixa em todos os estados). **Não toca** em motor, preview, export MP4,
cálculo de tempo, ranges/valores dos sliders, comportamento dos botões
−5%/+5%/Reset, curvas, easing, seleção múltipla, textos, ícones, cores
ou estrutura geral.

### 1) Mais respiro entre faixa de frames e thumb do slider

Antes (v8z4b16j): `#custBarContent` reservava `padding-top:10px` acima
do slider. Com a faixa de frames colada no topo do painel, a metade
superior do thumb (30×30) ficava a ~10px da borda inferior do `#midBar`
e visualmente parecia "encostada" / parcialmente pressionada.

Correção:
- `padding-top` sobe de 10px para 16px (+6px de respiro acima do
  slider).
- Espaço extra vem da compactação dos chips (item 2), sem aumentar a
  altura do `#custBar`.
- A faixa de frames mantém posição exata em todos os estados.

### 2) Chips ainda mais enxutos para liberar espaço vertical

Antes (v8z4b16j): chips com `min-height:26px` e `padding:5px 12px` na
folha de estilo, mas os inline styles em cada chip
(`padding:6px 14px;min-height:30px`) tinham especificidade maior e
acabavam vencendo — chips renderizavam com 30px de altura.

Correção:
- `#custBarContent .chip` agora usa `!important` em `padding`,
  `min-height` e `font-size`, vencendo o inline style: `4px 12px`,
  `min-height:24px`, `font-size:13px`.
- Reduz a altura ocupada pelos chips em ~6px, exatamente o espaço
  redirecionado para o `padding-top` (item 1).
- Toque continua confortável (alvo total > 30px contando padding do
  painel, e o trilho dos chips fica em região segura acima da Home Bar).

### 3) Centro vertical em `.cust-content` elimina sobra inferior

Antes (v8z4b16j): `.cust-content` era `display:block`; o conteúdo
(slider + chips) ficava ancorado no topo do painel. Quando o conteúdo
era menor que a altura interna disponível, sobrava uma faixa vazia no
fundo do painel (acima da safe-area) — o "sobra inferior" relatado.

Correção:
- `#custBarContent > .cust-content` passa a ser `display:flex` com
  `flex-direction:column` e `justify-content:center`. Slider e chips
  são centralizados verticalmente dentro do espaço útil.
- Ganho duplo: a folga entre faixa de frames e thumb fica equilibrada
  com a folga abaixo dos chips, e a sobra inferior é eliminada porque
  o conteúdo aproveita o centro do painel em vez de empilhar do topo.

### 4) `#custBarContent` ocupa toda a área visível do `#custBar`

Antes (v8z4b16j): `#custBarContent` tinha altura natural (padding +
conteúdo), enquanto `#custBar` ficava fixo em `48px + safe`. Se o
conteúdo somasse menos que a altura do painel, o `#custBar` mostrava
uma faixa vazia entre o final do `#custBarContent` e o seu próprio
fundo (visualmente percebido como espaço morto inferior).

Correção:
- `#custBarContent` recebe `flex:1 1 auto` para ocupar toda a altura
  do `#custBar`. A área útil passa a ser definida apenas pelos
  paddings, e o `justify-content:center` do item 3 controla a
  distribuição interna.
- Compatível com o forçamento de altura em `#custBar:not(.compact-mode)`
  introduzido em v8z4b16j: o painel continua exatamente com a mesma
  altura do `compact-mode`, faixa de frames intocada.

### 5) Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16k. Comentários de versões anteriores preservados como
  contexto histórico; novas linhas marcadas v8z4b16k.

### Não alterado nesta rodada

Motor de animação, WebCodecs / export MP4, preview/canvas, cálculo de
tempo, lógica de pausas, lógica de trechos, ranges dos sliders, valores
exibidos, comportamento dos botões −5%/+5%/Reset, easing, curvas, JSON,
templates, seleção múltipla, alinhamento/distribuição, ícones (SVGs),
textos de interface, paleta de cores, fluxo geral do app, botão Voltar
reforçado, menu de frames (continua fixo na mesma posição em todos os
estados).

## v8z4b16j — Frame strip pinning, slider clipping fix, free Scale, footer breathing

Patch cirúrgico sobre v8z4b16i. **Foco único:** estabilizar a estrutura
inferior — faixa de frames travada na mesma posição visual em todos os
estados, thumbs dos sliders dos submenus de transformação visíveis
inteiros, slider de Escala livre para extrapolar a imagem, mais respiro
entre ícone e nome no menu contextual e leve descida do bloco inferior
para se aproximar mais da Home Bar. **Não toca** em motor de animação,
WebCodecs/export MP4, preview, cálculo de tempo, lógica de pausas/
trechos/tempo mínimo, easing, curvas, JSON, templates, seleção
múltipla, alinhamento/distribuição, ícones em si, textos de interface,
cores ou no fluxo geral do app. O botão Voltar reforçado em v8z4b16h
permanece intocado.

### 1) Faixa de frames (`#midBar`) com posição fixa em todos os estados

Antes (v8z4b16i): `#custBar.compact-mode` tinha height = `48px + safe`
(igual à toolbar) e `#custBar:not(.compact-mode)` ficava com height
automática — abrindo Pausa/Rotação/Escala/Posição, o conteúdo do
submenu (slider + chips + paddings) gerava cerca de +8–12px de altura,
empurrando o `#midBar` para cima alguns pixels no fluxo flex.

Correção:
- `#custBar:not(.compact-mode)` recebe a MESMA altura forçada do
  `compact-mode`: `calc(48px + max(env(safe-area-inset-bottom, 4px), 4px))`.
- O submenu encaixa nessa altura fixa graças aos chips mais compactos
  (`min-height:26px`, `padding:5px 12px`), gap menor entre slider/chips
  (`margin-top:4px`) e `padding-top:10px` reservado para o thumb.
- Resultado: a faixa de frames mantém posição exata ao abrir/fechar
  Pausa, Rotação, Escala e Posição — sem subir, sem descer, sem
  depender da altura do submenu.

### 2) Sliders dos submenus de transformação com thumb inteiro

Antes (v8z4b16i): `#custBarContent` tinha `padding:2px 14px 4px 2px`
— apenas 2px de padding-top. O thumb do slider (30×30) projeta-se
~15px acima do track; com 2px de folga, a metade superior do thumb
ficava cortada pelo limite superior do `#custBar` (com `overflow:hidden`)
e visualmente coberta pelo background sólido da faixa de frames acima.
Afetava Escala, Rotação, Pausa local.

Correção:
- `padding-top:10px` em `#custBarContent` reserva o espaço vertical
  necessário para o thumb caber INTEIRO dentro do painel.
- O slider continua com track 6px e thumb 30px (sem mudança de range,
  valor, cálculo ou comportamento).
- A faixa de frames continua sólida acima — agora nenhum thumb se
  projeta por baixo dela.

### 3) Slider de Escala: livre para extrapolar a imagem

Antes (v8z4b16i): `initScaleSlider` aplicava
`Math.max(40, Math.min(stageW * 0.98, refW * pct / 100))` ao calcular
`newW`/`tW`, travando o frame em 98% da largura do stage. O usuário não
conseguia escalar o frame além dos limites visuais da imagem com o
slider, mesmo com "Conter na imagem" desligado.

Correção:
- `Math.min(stageW * 0.98, …)` removido do cálculo do slider (apenas a
  cota inferior `Math.max(40, …)` permanece).
- `clampFrame()` continua sendo chamado e ainda respeita
  `containFrames` quando ativo — modo livre não trava, modo contido
  trava como antes.
- Botões −5%/+5% e Reset preservam o comportamento (já eram livres no
  modo padrão, agora apenas o slider se alinha).

### 4) Mais respiro entre ícone e nome no menu contextual de frames

Antes (v8z4b16i): `#custBar .cust-tab` usava `gap:1px` entre o SVG e o
rótulo — ícones de Pausa/Rotação/Escala/Posição ficavam visualmente
colados aos respectivos nomes.

Correção:
- `gap:5px` (cinco vezes maior) entre ícone e label nas abas de
  transformação. Hierarquia visual preservada; nenhum tamanho/cor/texto
  alterado.

### 5) Bloco inferior um pouco mais baixo

Antes (v8z4b16i): `.toolbar`, `#custBarTabs` e `#custBarContent`
subtraíam 20px da safe-area no `padding-bottom`
(`max(calc(env(safe-area-inset-bottom, 4px) - 20px), 6px)`).

Correção:
- Subtração passa para -26px nos três elementos, descendo os controles
  ~6px no iPhone (referência visual: Edits/Instagram/CapCut). Piso de
  6px preservado para manter a folga segura acima do indicador de Home.
- Sem reintrodução de degradê, fade, sombra falsa de rodapé ou overlay
  inferior. O background sólido var(--surface) do body continua
  cobrindo a safe area por baixo das barras.

### 6) Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16j. Comentários internos que descrevem versões anteriores
  como contexto histórico foram preservados; novas linhas explicativas
  desta rodada estão marcadas v8z4b16j.

### Não alterado nesta rodada

Motor de animação, WebCodecs / export MP4, preview/canvas, cálculo de
tempo, lógica de pausas, lógica de trechos, tempo mínimo 0.0s, easing,
curvas, JSON, templates, seleção múltipla, alinhamento/distribuição,
ícones (SVGs), textos de interface, paleta de cores, fluxo geral do
app, botão Voltar reforçado (`#custBarBack`, `.ab-back-strong`,
`.preview-btn.close-btn`).

## v8z4b16i — Safe-area regression fix, contextual submenu compaction

Patch cirúrgico sobre v8z4b16h. **Foco único:** corrigir a regressão da
camada de safe area que estava cobrindo controles do menu contextual e
compactar a altura excessiva dos submenus locais de frame. **Não toca**
em motor de animação, preview/canvas, exportação MP4, easing, curvas,
duração funcional, pausas funcionais, rotação funcional, escala
funcional, lógica de movimento, seleção múltipla, fluxo geral, cores
gerais já aprovadas, ou no botão Voltar reforçado em v8z4b16h.

### 1) Camada body::after de safe-area removida

Antes (v8z4b16h): pseudo-elemento `body::after` fixo (`position:fixed`,
`bottom:0`, `height:env(safe-area-inset-bottom)`, `z-index:0`,
`pointer-events:none`) foi adicionado como "rede de segurança" para
cobrir a faixa do home indicator com `var(--surface)`. Em iPhone/Safari,
esse layer fixo coincidia visualmente com a área inferior do
`#custBarContent` (que também tinha `padding-bottom = safe-area`),
gerando uma faixa de cor alta dentro do painel que parecia cobrir
slider e botões.

Correção:
- Bloco `body::after { ... }` removido do CSS.
- A continuidade visual da safe-area é mantida pelo background
  `var(--surface)` aplicado em `html, body` (já presente desde
  v8z4b16h).
- A toolbar (`.toolbar`), as tabs (`#custBarTabs`) e o conteúdo
  (`#custBarContent`) já incluem padding-bottom calculado a partir de
  `env(safe-area-inset-bottom)`, então a área da Home Bar segue coberta
  pela própria barra inferior, sem layer extra.
- Sem mudança em z-index, pointer-events ou empilhamento dos demais
  elementos.

### 2) Padding inferior do submenu compactado

Antes (v8z4b16h): `#custBarContent` usava
`padding-bottom: max(env(safe-area-inset-bottom, 4px), 4px) !important`
(~34px no iPhone). Esse valor alinhava o "fundo seguro" com o que a
toolbar reservava na compact-mode, mas no expanded-mode empurrava o
slider/chips ~20px para cima do que era necessário, criando espaço morto
visível abaixo dos controles.

Correção:
- `#custBarContent` agora usa o MESMO padrão de
  `.toolbar` e `#custBarTabs`:
  `padding-bottom: max(calc(env(safe-area-inset-bottom, 4px) - 20px), 6px) !important`.
- Resultado: o slider e os chips Reset/-5/+5 descem perto da Home Bar,
  com piso mínimo de 6px de folga (sem invadir touch da Home Bar).
- Submenu deixa de ter espaço morto inferior; altura visual cai ~20px
  no iPhone, mantendo o conforto de toque (chips continuam 30px,
  botão Voltar continua 44×44).

### 3) Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16i. Comentários internos que referenciam versões anteriores
  como precedente foram preservados; novos comentários explicativos
  das mudanças desta rodada são marcados v8z4b16i.

### Não alterado nesta rodada

Motor de animação, preview/canvas, exportação MP4, easing, curvas,
duração funcional, pausas funcionais, rotação funcional, escala
funcional, lógica de movimento, seleção múltipla, fluxo geral do app,
cores gerais já aprovadas, botão Voltar reforçado (`#custBarBack`,
`.ab-back-strong`, `.preview-btn.close-btn`) e demais melhorias
visuais já validadas em v8z4b16g/v8z4b16h.

## v8z4b16h — iPhone/Safari UI: pre-image guards, safe-area parity, Voltar reinforce, contextual compacting

Patch cirúrgico sobre v8z4b16g. **Foco único:** corrigir apenas o que foi
confirmado em teste no iPhone/Safari — guard de ações de frame antes da
imagem, faixa preta residual da safe area inferior, presença visual do
botão Voltar, compactação dos menus contextuais e ícone de Pausa/Tempo.
**Não toca** em motor de animação, preview, exportação MP4, easing,
curvas, duração funcional, pausas funcionais, rotação funcional, escala
funcional, lógica de movimento, seleção múltipla, cores gerais ou layout
fora dos pontos pedidos. Itens já OK na v8z4b16g preservados (Preview X→
Voltar, active-tab cleanup, Voltar lateral do custBar).

### 1) Bloquear ações de frame antes do carregamento da imagem

Antes: o app permitia ações de edição mesmo sem imagem carregada — botão
"+" tentava criar frame (com `frames[-1]` indefinido), botão "−" exibia
"Mínimo de 2 frames", lock/pin respondia, Play tentava iniciar preview,
e a faixa de frames podia exibir indicadores órfãos.

Correção:
- Helper único `hasImageLoaded()` (verdade = `imgNatW > 0`) consultado em
  todos os handlers: `addFrame`, `insertFrameAfterActive`, `deleteActiveFrame`,
  `removeLastFrame`, `toggleFrameLock`, `togglePlay`, `openCustBar`,
  `toggleMapa`, `invertFrames`. `promptSaveProject` já tinha o guard.
- Antes da imagem carregar, a faixa de frames (`#midBar`), a toolbar
  inferior (`#toolbar`) e o menu contextual (`#custBar`) ficam ocultos
  via CSS `body.no-image .mid-bar/#toolbar/#custBar{display:none}`. A
  classe `no-image` é removida no `imgEl.onload` do `loadImage()`.

Não altera o mínimo de 2 frames — só vale com projeto ativo (imagem
carregada).

### 2) Safe area inferior igualada à toolbar

Antes: no iPhone/Safari sobrava faixa preta abaixo da toolbar, distinta
da superfície do menu inferior. O `body` usava `var(--bg)` (#000), e
quando `100dvh` não cobria a safe-area-inset-bottom inteira, esse preto
vazava ao redor/abaixo da toolbar.

Correção:
- `html, body` agora usam `background: var(--surface)` em vez de
  `var(--bg)`. A `.image-area` continua com fundo preto sólido (não há
  vazamento visual no stage).
- Camada extra de segurança: pseudo-elemento `body::after` fixo no
  rodapé (`bottom:0`, `height: env(safe-area-inset-bottom, 0px)`,
  `background: var(--surface)`, `z-index:0`, `pointer-events:none`) —
  garante continuidade visual mesmo em cenários onde o flex não chega
  exatamente ao pixel do home indicator.
- Sem degradê, sem sombra, sem subir botões.

### 3) Reforço visual do botão Voltar nos submenus

Antes: o Voltar lateral do menu contextual de frames (`#custBarBack`)
estava 18×18 / stroke-width:2 / `rgba(235,235,235,0.92)` — discreto
demais, difícil de tocar no iPhone.

Correção:
- `#custBarBack`: ícone 26×26 (+44%), stroke-width 2.6 (+30%), cor
  `#fff` (branco puro), área de toque mínima 44×44 (alvo iOS HIG).
- `#alignBar` (seleção múltipla): mesmo tratamento via classe
  `.ab-back-strong` — SVG 28×28 com stroke-width 2.6, label em peso 700.
- Preview Voltar (`.preview-btn.close-btn`): cor `#fff`, stroke-width
  2.6 no SVG, label em peso 700.

Função preservada: continua chamando `collapseCustBar` / `clearMultiSelect`
/ `closeAlignSubmenu` / `stopPreview` respectivamente.

### 4) Menus contextuais de frame compactados

Antes: os submenus de Rotação, Escala e Pausa usavam chips com
`min-height:36px` inline, `padding:8px 16px` e `margin-top:10px` entre
slider e chips, gerando espaço morto perceptível abaixo dos controles.

Correção:
- Chips dentro dos cust-content: `min-height:30px`, `padding:6px 14px`,
  `gap:6px` e `margin-top:6px` (alinhado à regra global de v8z4b16f
  `#custBarContent .chip`, removendo overrides inline conflitantes).
- Padding-bottom seguro (safe-area) preservado para folga acima da Home
  Bar.
- Sem alteração em valores, ranges ou handlers — apenas dimensões
  visuais.

### 5) Menu Posição em duas colunas

Antes: o submenu Posição mostrava X e Y em DUAS LINHAS empilhadas
(altura ~80px sem motivo, já que cada eixo é uma linha pequena).

Correção:
- Reorganizado em DUAS COLUNAS lado a lado (X | Y), cada coluna com
  rótulo discreto (uppercase 10px) e seu próprio trio `− input +`.
- Sem rolagem interna, sem alteração em `nudgePos` / `setPosFromInput`.
- A altura útil do submenu cai para uma única linha de controles.

### 6) Ícone do menu Pausa trocado para relógio/duração

Antes: a aba "Pausa" do menu contextual usava `#i-pause` (dois traços
verticais — glifo de mídia parada), incoerente com o conceito de
"duração da pausa do frame".

Correção:
- Novo símbolo SVG `#i-clock` (Lucide clock: círculo + ponteiros) no
  sprite.
- Aba "framepause" do `#custBarTabs` passa a referenciar `#i-clock`.
- Texto "Pausa" preservado por já fazer parte da interface aprovada.
- Nenhuma mudança em `framePauseSlider`, `setFramePause`,
  `resetFramePause`, `syncFramePauseUI` ou no painel Duração.

### 7) Versionamento

- Cabeçalho HTML, comentário de topo do `<body>`, `APP_VERSION`,
  `APP_VERSION_NAME` e display em Configurações atualizados para
  v8z4b16h. Comentários internos que referenciam v8z4b16g como
  precedente foram preservados; novos comentários explicativos das
  mudanças desta rodada são marcados v8z4b16h.

### Não alterado nesta rodada

Motor de animação, Preview/canvas, exportação MP4, easing, curvas,
duração funcional, pausas funcionais, rotação funcional, escala
funcional, lógica de movimento, seleção múltipla, cores gerais, layout
geral fora dos pontos pedidos, Preview X→Voltar (já feito em v8z4b16g),
limpeza de `.active-tab` (já em v8z4b16g) e botão Voltar lateral do
custBar (já em v8z4b16g — aqui só reforçado visualmente).

## v8z4b16g — UX state cleanup, Voltar standardization, version housekeeping

Patch cirúrgico sobre a v8z4b16f. **Foco único:** três correções de UX/estado
visual e padronização de versionamento. **Não toca** em motor de animação,
preview, exportação MP4, easing, curvas, duração, pausas, seleção múltipla,
rotação ou escala funcional, layout geral, cores, textos, ícones ou fluxo
além do que está explicitamente listado abaixo.

### 1) Limpa destaque visual preso no menu de frames

Antes: ao tocar em um ícone do menu contextual de frames (por exemplo
Rotação), fechar o menu e abrir novamente, o último ícone usado continuava
destacado/aceso em `compact-mode`. Bug puro de estado visual — sem lógica
real de "modo ativo" por trás. A classe `.active-tab` aplicada em
`switchCustTab()` ficava remanescente após `closeCustBar()` e mesmo após
`collapseCustBar()`, e era reaplicada na próxima abertura porque o nó DOM
preservava o estado.

Correção:
- `closeCustBar()` agora limpa `.active-tab` de todos os ícones em
  `#custBarTabs`.
- `collapseCustBar()` (botão Voltar do submenu) também limpa — quando o
  menu volta a compact-mode nenhum submenu está aberto, então nenhum
  ícone deve aparecer aceso.
- O default `<div class="cust-tab active-tab" data-tab="scale">` perdeu o
  `active-tab` para que a primeira abertura do menu também não acenda o
  ícone Escala sem motivo.

Lógicas reais de modo ativo (`custGlobalLock`, `frameLocked`,
`finishMode`) não foram tocadas.

### 2) Botão Voltar como coluna lateral à esquerda nos submenus contextuais

Antes (v8z4b16f): o botão Voltar (`#custBarBack`) era um header inline no
topo do submenu, ocupando ~22px de altura útil acima do slider/conteúdo.
Em v8z4b16e tinha sido coluna lateral mas com `min-height:32px` que
gerava faixa visual estranha.

Correção:
- `#custBarContent` virou `display:flex; flex-direction:row` com gap 6px.
- `#custBarBack` virou coluna estreita (`width:24px`, `align-self:stretch`),
  com SVG 18×18 centralizado vertical e horizontalmente.
- O conteúdo do submenu (`.cust-content` visível) ocupa o restante via
  `flex:1 1 0`.
- Resultado: o painel recupera ~22px de altura útil que antes era
  consumida pelo header, e a direção de interface aprovada (coluna
  lateral à esquerda discreta e verticalizada) volta a vigorar.

Comportamento do botão preservado: `collapseCustBar()` volta ao
`compact-mode` (ícones), `closeCustBar()` continua sendo o stage-tap.

Aplica-se aos submenus de Pausa, Rotação, Escala (transformação) e
Posição — mesmo container `#custBarContent`.

### 3) X do Preview trocado por Voltar

O botão da esquerda no rodapé do `previewScreen` ainda usava `#i-close`
(X) com label "Fechar". A linguagem aprovada agora é "Voltar" + chevron
para a esquerda, igual a `#custBarBack` e ao Voltar primário do
`#alignBar`.

Correção:
- SVG inline com `<polyline points="15 18 9 12 15 6"/>` (mesmo chevron
  dos outros painéis).
- Label `Voltar` substitui `Fechar`.
- `onclick="stopPreview()"` intocado: o botão continua fechando o
  Preview e devolvendo ao Stage.

Layout geral do Preview, botões de Play/Pause, botão Salvar MP4,
geração de vídeo e canvas: inalterados.

### 4) Versão atual padronizada para v8z4b16g

- `APP_VERSION` / `APP_VERSION_NAME` (constantes JS) → `v8z4b16g`.
- `<span id="appVersionText">` em `.settings-version` → `v8z4b16g`.
- Comentário/header no topo de `index.html` (linha 1–76) atualizado:
  "Versão: v8z3q" virou "Versão: v8z4b16g"; bloco de changelog antigo
  marcado como histórico (v8z3q deixou de carregar o "(atual)").
- `<!-- Arco App — v8z3v ... -->` virou `<!-- Arco App — v8z4b16g ... -->`.
- `pages-deploy-stamp.txt` atualizado.
- Referências internas históricas (`// v8z4b16f — ...`, etc.) preservadas
  porque descrevem MUDANÇAS da versão indicada e ajudam o QA a rastrear
  por que cada bloco existe. Não há mais nenhuma referência a versão
  antiga apresentada como "(atual)".

### Arquivos alterados

- `index.html`
  - HTML: header de comentário do topo; comentário `<!-- Arco App — vX -->`;
    `<div class="cust-tab" data-tab="scale">` (remoção do `active-tab`
    default); `previewScreen` close-btn (SVG + label); `.settings-version`
    span.
  - CSS: bloco `#custBarBack` (passou de header inline para coluna lateral)
    e `#custBarContent` (passou a `display:flex` row); nova regra
    `#custBarContent > .cust-content { flex:1 1 0 }`.
  - JS: `closeCustBar()` e `collapseCustBar()` ganharam limpeza de
    `.active-tab`; `APP_VERSION` e `APP_VERSION_NAME` atualizados.
- `pages-deploy-stamp.txt`: stamp v8z4b16g.
- `CHANGELOG.md`: esta entrada.
- `QA.md`: nova seção v8z4b16g.

### Riscos

- A coluna lateral usa `width:24px`. Em telas muito estreitas o chevron
  pode parecer apertado; área de toque útil real é `padding:0 4px` +
  24px = ~32px, mantendo conforto.
- Limpar `.active-tab` em `collapseCustBar()` significa que, ao voltar
  do submenu para o compact-mode, o ícone do último submenu não fica
  marcado. Isso é o comportamento solicitado: sem destaque preso.
- O padding-left de `#custBarContent` caiu de 14px para 2px para
  acomodar a coluna; o conteúdo visual real continua começando a ~32px
  da borda esquerda do painel (coluna do botão + gap).

### Não tocado

- WebCodecs / export pipeline / MP4: zero mudanças.
- Motor de animação, easing, curvas, smoothing: zero mudanças.
- Cálculo de tempo, sliders de duração/pausa/segmento: zero mudanças.
- Seleção múltipla, alignBar, distribuição: zero mudanças (alignBar já
  usava Voltar com chevron — não precisou de patch).
- Templates, JSON, BgColor, Format, settings sheet: zero mudanças.

### Testes obrigatórios (iPhone/Safari)

1. App abre normalmente.
2. Carregar imagem.
3. Preview abre e fecha pelo novo botão "Voltar" (chevron). Mesmo
   comportamento de antes.
4. Reset (botão de reset do topbar) continua funcionando.
5. Tocar num frame: menu contextual abre em compact-mode SEM ícone
   aceso.
6. Tocar em Rotação → submenu expande, ícone Rotação acende, botão
   Voltar aparece como coluna estreita à esquerda do slider.
7. Tocar no Voltar (coluna esquerda) → recolhe para compact-mode, NENHUM
   ícone fica aceso.
8. Tocar em Rotação → submenu, Tocar fora (no stage) → fecha. Reabrir
   o menu → NENHUM ícone fica aceso (bug do v8z4b16f corrigido).
9. Painéis de Pausa / Escala / Posição: mesmo layout, Voltar à esquerda.
10. Configurações → "Arco v8z4b16g" visível na versão.
11. Nenhuma referência interna na tela ou no CHANGELOG contradiz a
    versão atual v8z4b16g.

## v8z4b16f — Solid bottom strip, compact context submenu, slider fill sync

Patch cirúrgico sobre a v8z4b16e. **Foco único:** fechar os três problemas
visuais residuais que sobraram para promoção da linha v8z4b16 ao
app principal. **Não toca** em motor de animação, preview, export MP4,
cálculo de tempo, lógica de tempo global, Intervalo padrão, ranges de
sliders, easing, curvas, JSON, templates ou seleção múltipla.

### 1) Rodapé sólido — fim do degradê/faixa escura

`.float-panel` carregava `box-shadow:0 -8px 40px rgba(0,0,0,.6)` no estado
padrão (fechado). Com `transform:translateY(105%)` o painel some abaixo
da viewport, mas a sombra (offset -8 + blur 40 = ~48px acima do topo do
painel) ainda vazava 28–43px ABOVE the viewport bottom, criando o efeito
de degradê escuro vindo de baixo para cima visível no rodapé. Vários
`.float-panel` (Duration, Ease, Smooth, BgColor, Format, Template…)
contribuíam simultaneamente.

Correção: `box-shadow:none` no estado padrão; a sombra agora aparece
apenas com a classe `.show` (painel aberto). Rodapé fica visualmente
sólido até a base da tela, sem fade, sem faixa morta. Toolbar/custBar
seguem com `background-image:none` e `box-shadow:none` como já estavam.

### 2) Submenu contextual compacto + header com botão voltar

`#custBarBack` tinha `min-height:32px` + `padding:2px 12px` e ficava em
linha própria acima do slider, criando a "coluna vertical jogada à
esquerda" e exagerando a altura total do submenu (~148px sobre a
safe-area). Agora vira um header compacto:

- `min-height:22px`, `padding:1px 8px 1px 2px`, `min-width:36px`.
- SVG 20x20 (era 22x22), chevron alinhado ao conteúdo abaixo.
- `#custBarContent` com `padding:2px 14px 4px` (era `4px 14px 8px`).
- Chips do menu contextual com `padding:6px 14px` e `min-height:30px`
  (eram `8px 16px` e `36px`). Gap entre slider e chips reduzido a 6px.

O submenu fica próximo de ~110px sobre a safe-area (≈25% mais
compacto) sem alterar valores, ranges ou comportamento dos controles.
Mantida a navegação: toque no ícone expande, chevron recolhe ao
compact mode, toque fora fecha.

### 3) Faixa ciano do slider acompanha a bolinha

`updateSliderFill()` já existia e era disparada via listener delegado em
`input`. Quando o `value` era escrito de forma programática (abrir
painel, sincronizar valores entre painéis, drag de handle global), o
listener não rodava e a faixa ciano (CSS `--fill`) ficava com o valor
antigo — bolinha em 0.0s mas faixa cheia até o meio.

Correção: chama `updateSliderFill(slider)` imediatamente após cada
escrita programática em `.dur-slider` que pintaria valor stale:
- `initEasePanel` (slider Seg. X-Y do painel contextual de Trecho);
- `syncCustomizePanel` (rotSlider e scaleSlider);
- handle global de escala/rotação (drag no stage);
- arrasto de rotação por gesto (rotSlider);
- `initSmoothSlider`;
- `refreshPauseControls` (framePauseSlider local).

Adicionalmente, `openCustBar`, `switchCustTab` e `openPanel` chamam
`refreshSliderFills()` ao final, repintando todos os `.dur-slider`
visíveis após cada transição de painel/aba.

`updateSliderFill` já trata min/max inválidos, value NaN, max==min e
clampa entre 0..100; sem alteração na função.

### Arquivos alterados

- `index.html`
  - Estilo `.float-panel` / `.float-panel.show` (rodapé sólido).
  - Estilo `#custBarBack` + nova regra `#custBarContent .chip` e
    `.cust-content > div + div` (submenu compacto).
  - Inline `padding` de `#custBarContent` ajustado.
  - JS: `initEasePanel`, `syncCustomizePanel`, drag handlers de
    handle global e rotação, `initSmoothSlider`, `refreshPauseControls`,
    `openCustBar`, `switchCustTab`, `openPanel`.
  - `APP_VERSION`, `APP_VERSION_NAME` e texto visível em `settings-version`.
- `pages-deploy-stamp.txt` atualizado.

### Riscos

- Sombra do painel flutuante agora só aparece com `.show`. Pode haver
  um pop visual no início da transição de abertura (transition cobre
  apenas `transform`). Aceitável — painel fechado fica sem leak; aberto
  segue com a mesma sombra de elevação.
- Submenu mais compacto pode parecer "apertado" em telas muito
  pequenas. Mantidos paddings mínimos e altura de toque para chips.

### Não tocado

- WebCodecs/export pipeline / MP4: zero mudanças.
- Motor de animação: zero mudanças.
- Cálculo de tempo, sincronização numérica das pausas/trechos: mantida
  como na v8z4b16e.
- Seleção múltipla, alinhamento, distribuição: zero mudanças.
- Templates, JSON, easing, curvas: zero mudanças.

### Testes obrigatórios (iPhone/Safari)

1. Rodapé: carregar imagem; confirmar barra inferior sólida até a base,
   sem degradê; botões acima da Home Bar.
2. Submenus de frame: tocar frame → Pausa/Rotação/Escala/Posição →
   chevron voltar bem posicionado; sem tranco no stage.
3. Sliders: abrir Seg. 1-2; valor 0.0s → bolinha e faixa ciano no
   início; mover → faixa acompanha; abrir painel Duração e confirmar
   slider TOTAL e individuais.
4. MP4: tocar Preview; Gerar MP4; gerar de novo após pequena edição;
   sem tela preta nem botão preso.

## v8z4b16d — Fix MP4 generation and defensive export cleanup

Patch cirúrgico sobre a v8z4b16c. **Foco único:** recuperar a geração
de MP4, que estava entrando em estado de gravação (botão piscando
vermelho) sem produzir arquivo e deixando o app preso em tela preta.
**Não toca** em motor de animação, cálculo de tempo, sincronização de
sliders, menus contextuais, painel Duração, AlignBar, ou qualquer
item validado em v8z4b16c.

### Causa raiz

`cleanupFailedExport` em v8z4b16c (e versões anteriores) zerava o
estado interno mas **não fechava** o `previewScreen` (overlay preto
fixo, `z-index:90`) nem limpava o `previewDisplayCanvas` (que ficava
display:block sem nada desenhado). Em qualquer falha do encoder o
usuário ficava olhando um overlay totalmente preto, sem animação,
até tocar Fechar manualmente — exatamente o sintoma "tela preta"
relatado. Além disso, `startRecord` executa setup pesado **antes** do
`try { }` interno: se qualquer um daqueles passos lançasse exceção,
`isRecording` permanecia `true` e o botão Salvar MP4 ficava preso na
classe `recording` (vermelho piscando), pois o próprio `handleGenerate`
e `startRecord` retornam cedo quando `isRecording` é truthy.

### Correções

- **`cleanupFailedExport` agora restaura o app completamente:**
  esconde `previewScreen.show`, cancela `animFrame`, zera
  `isPreviewing`/`animStart`/`pausedElapsed`, limpa o
  `previewDisplayCanvas` (clearRect + display:none + filter:none) e
  chama `updatePlayButton()`. Em caso de erro o usuário volta direto
  ao stage de edição em vez de ficar olhando um overlay preto.
- **Guards de pré-condição em `startRecord` (antes de marcar
  `isRecording = true`):**
  - Imagem base carregada (`imgEl.complete`, `imgNatW`, `imgNatH`).
  - Dimensões de export válidas (`exportDims[currentRatio]` > 0).
  - Duração total finita e > 0 (`totalDurationFull()`).
  Se qualquer guard falhar, mostra `showStatus` e retorna sem
  entrar em estado de gravação — botão não pisca vermelho à toa.
- **Sanidade do `recCanvas`:** abortar com cleanup mínimo se W/H
  forem 0/NaN/Infinity em vez de tentar configurar o encoder.
- **`try { } catch { } finally { }` em torno do encode WebCodecs:**
  o `finally` garante que, mesmo se o `catch` falhar ou se algo
  escapar (encoder travado, promessa pendente), `isRecording` é
  forçado a `false` via `cleanupFailedExport`. Sem isso o app
  permanecia preso no estado de gravação após qualquer erro raro.
- **MediaRecorder fallback endurecido:**
  - Guard de presença (`MediaRecorder` + `recCanvas.captureStream`).
  - `try/finally` em volta da gravação: stream tracks são sempre
    liberadas, mesmo se o loop quebrar.
  - `hardResetCanvas(rCtx, recCanvas, bgColor)` por frame (antes só
    existia no caminho WebCodecs) — garante fundo limpo e descarta
    restos de frames anteriores se algum `drawImage` falhar.

### Comportamento garantido

- **Sucesso normal:** Gerar MP4 renderiza, finaliza e mostra
  `readyOverlay` como antes — caminho feliz inalterado.
- **Falha do encoder/codec:** previewScreen fecha, animFrame
  cancelado, botão volta a "Salvar MP4" sem `recording`, `showStatus`
  imprime mensagem útil, console registra erro com contexto.
- **Falha de pré-condição (imagem não carregada, duração 0,
  proporção inválida):** abortar antes de entrar em
  recording — botão nem pisca vermelho.
- **Erro raro escapou do catch:** `finally` aciona
  `cleanupFailedExport`; usuário pode tentar novamente.

### Não tocado nesta versão

- Motor de animação, easing, cálculo de tempo, sincronização de
  sliders, painel Duração, menu contextual, AlignBar, faixa
  inferior, fechamento ao tocar no stage, hierarquia tipográfica,
  nomenclatura Trechos.
- Curvas/easing/JSON/templates/arquitetura geral.
- Pendências visuais conhecidas (degradê inferior, altura da barra,
  altura de subpainéis, faixa azul do slider TOTAL, sincronização
  visual entre painel contextual de trecho e painel Duração)
  continuam abertas — não entram neste patch por escopo.

### Versão

- `appVersionText`: `v8z4b16d`.
- `appVersionNameText`: `Fix MP4 generation and defensive export cleanup`.
- Constantes `APP_VERSION` / `APP_VERSION_NAME` atualizadas.

## v8z4b16c — Stage stability, bottom slot and visual hierarchy

Patch cirúrgico sobre a v8z4b16b. **Não toca** na lógica de tempo
global, no cálculo de tempo total, no preview/export, nem na
sincronização dos sliders já validados.

### Estabilidade do stage no menu contextual

- Slot inferior com altura EXPLÍCITA: `.toolbar` e `#custBar.compact-mode`
  agora usam `height: calc(48px + max(env(safe-area-inset-bottom, 4px), 4px))`
  e `box-sizing:border-box`. Antes, ambas eram dimensionadas pelo
  conteúdo + padding e pequenas diferenças de arredondamento no iOS
  Safari produziam um tranco vertical ao trocar a toolbar pelo menu
  contextual. Agora a troca é visualmente neutra.
- `openCustBar` adiciona `body.cust-open` ANTES de mostrar o
  `#custBar`; `closeCustBar` mantém a simetria inversa. Elimina o
  frame intermediário em que toolbar e custBar coexistiam.
- `#custBar` perde o `box-shadow:0 -8px 28px rgba(0,0,0,.45)` (criava
  faixa escura projetada sobre o stage, percebida como degradê
  inferior). Superfície inferior fica sólida e contínua até a Home Bar.

### Fechar menu contextual em qualquer área vazia do stage

- Novo listener delegado em `.image-area` (`#imageArea`): `pointerdown`
  com whitelist explícita das regiões interativas (`#custBar`,
  `#midBar`, `#alignBar`, `.top-bar`, `.float-panel`, `.global-handle`,
  `.ctrl-pt`). Tocar na imagem, no fundo preto da área de edição ou
  no canvas vazio fecha o menu; tocar nos controles não fecha.
- Listener no `#stage` permanece como caminho secundário (compat).

### Barra inferior — visual compacto

- `.toolbar` passou a `align-items:flex-end` com `padding:2px 4px
  max(env(safe-area-inset-bottom, 4px), 4px)`; `.tb-item` agora alinha
  conteúdo ao fim com `gap:2px`. Botões/textos descem visualmente,
  absorvem a safe area, eliminam o espaço morto acima e dão aparência
  de app mobile nativo.
- `#custBar .cust-tab` segue o mesmo padrão para que toolbar e menu
  contextual sejam visualmente idênticos em posicionamento.

### Painel Duração — hierarquia tipográfica

- Títulos principais (`.dur-section-header`): `font-size:17px;
  font-weight:700; color:var(--text)`. Três blocos (Trechos,
  Pausas por frame, Acabamento) ficam visualmente equivalentes.
- Subtítulos descritivos (`.dur-sublabel`, `.dur-subitem-label`) e
  labels internos de slider (`.dur-edit-row > .dur-edit-label`):
  `font-size:11px; font-weight:600; color:var(--text3);
  letter-spacing:1.4px; text-transform:uppercase`. Claramente
  subordinados aos títulos principais.

### Nomenclatura visível

- "Segmentos" → "Trechos" (cabeçalho da seção).
- "Tempo por segmento" → "Tempo por trecho" (subtítulo dos sliders
  individuais).
- "Segmentos" (linha do summary topo) → "Tempo dos trechos".
- Texto do toast `'Próximo ajuste aplicado a todos os segmentos'` →
  `'... a todos os trechos'`.
- Variáveis internas (`segDurations`, `segEasings`, IDs como
  `durSummaryMove`, `segTotal`, `segBreakdown`) NÃO renomeadas —
  zero impacto na lógica de tempo, easing ou preview.

### Caixa de seleção múltipla / alinhamento

- `#alignBar` redesenhada para compartilhar a linguagem visual do
  `#custBar`: fundo sólido, slot inferior com mesma altura, ícones
  centralizados acima de labels curtas, `.ab-tab` espelhando
  `.cust-tab`.
- Duas camadas:
  - **Primária:** Voltar (contador de seleção) · Alinhar · Distribuir · Escala.
  - **Submenu Alinhar:** 6 alvos visuais — Esq, Centro H, Dir, Topo,
    Centro V, Base. Apenas Centro H e Centro V têm lógica (já existia
    como `cx`/`cy`); os 4 demais aparecem desabilitados (`.ab-tab-disabled`)
    sem criar função nova. Voltar leva à camada primária.
- A barra continua `position:fixed; bottom:0` — entra por cima sem
  empurrar o stage, exatamente como antes.

### Não tocado nesta versão

- Lógica de tempo global, cálculo de tempo total, sincronização dos
  sliders (subordinação cinza), handle sticky do painel Duração,
  preview/export MP4, tempo mínimo 0.0s.
- Nada de nova timeline, novo stage, novos handles, edição vetorial,
  curvas estilo Illustrator, easing de rotação/escala, novo motor,
  novo controle fino de tempo.

### Versão

- `appVersionText`: `v8z4b16c`.
- `appVersionNameText`: `Stage stability, bottom slot and visual hierarchy`.
- Constantes `APP_VERSION` / `APP_VERSION_NAME` atualizadas.

## v8z4b16b — Stabilize contextual menu and zero-second segments

Patch de estabilização sobre a v8z4b16a, fechando apenas os pontos
encontrados na revisão. **Não inclui** novo redesign do painel Tempo,
nova timeline contínua, novo stage, novo sistema de handles, edição
vetorial, nem reformulação de nomenclatura. Foco em correções
cirúrgicas e um único ajuste funcional (tempo zero).

### Menu contextual do frame

- Removidos os ícones **Curvas** e **Adicionar** do menu contextual.
  "Curvas" será futura edição vetorial/nódulos dos frames (não easing)
  e fica fora desta versão; "Adicionar" frame pertence à faixa de
  frames, não ao menu local de transformação.
- Menu contextual agora ocupa **exatamente a mesma altura** do menu
  inferior principal. `#custBar .cust-tab` passou de `min-height:56px`
  para `46px` (= 4 + 38 + 4, igual ao `tb-item` mais alto da toolbar
  com `flex:1` distribuindo os tabs). `align-items:stretch` no
  `#custBarTabs`. O slot inferior continua sendo a mesma faixa: pura
  troca de conteúdo, sem empurrar o stage nem cobrir a faixa de frames.

### Sliders — estado global

- Quando o estado "tudo sincronizado pelo global" está ativo, o
  **thumb/bolinha** dos sliders individuais agora também fica cinza
  (antes ficavam brancos porque o thumb tem `background:#fff` próprio
  e `filter:grayscale(1)` não tem efeito sobre branco puro). Aplicado
  via override `::-webkit-slider-thumb` e `::-moz-range-thumb` em
  `#framePauseRows.global-synced` e `.dur-edit-row.partial-synced`.
- Sincronização e largura útil já estavam corretas — não tocadas.

### Handle superior do painel

- `#panelDuration > .panel-handle` virou banner **sticky** no topo da
  área de rolagem: `position:sticky; top:0`, fundo `var(--surface)`
  cobrindo todo o conteúdo que desliza por baixo, bolinha visual via
  `::before`. O painel mantém `overflow-y:auto`; não foi criado novo
  scroll interno.

### Trecho/intervalo mínimo 0.0s

Ajuste funcional obrigatório para permitir corte seco entre frames.
Não altera nomenclatura visual ainda.

- Sliders/inputs aceitam `min=0`:
  - `#durSlider` (total dos segmentos).
  - `#newSegmentDurationInput` (intervalo padrão).
  - `#easePanelSegSlider` (tempo individual de segmento via painel
    de easing).
- Clamps de duração de segmento auditados e abaixados a 0:
  - `addFrame` usa `Math.max(0, Math.round(defaultNewSegmentDuration != null ? defaultNewSegmentDuration : 2))`.
  - `insertFrameAfterActive` (split em dois meios) usa
    `Math.max(0, ...)` em vez de `Math.max(0.1, ...)`.
  - Redistribuição proporcional pelo `durSlider` usa `Math.max(0, ...)`.
  - `defaultNewSegmentDuration` no load de projeto e estado interno
    aceita 0.
- Clamps de pausa, acabamento (Retorno/Duração), escala, rotação,
  easing e blur **não foram tocados** (escopo restrito ao tempo entre
  frames).
- `getSegDuration` e `openSegBreakdown` trocam o teste falsy
  (`segDurations[i] || fallback`) por `!= null`, preservando o valor
  legítimo 0.
- Redistribuição pelo total:
  - Total → 0 leva todos os trechos para 0.
  - Saindo de "tudo 0" para um total > 0, distribui igualmente entre
    os trechos (não há proporção anterior válida).
  - Total > 0 com valores diferentes preserva proporção atual.
- Motor temporal — proteção mínima contra duração total real igual a
  zero:
  - `startPreview`, `togglePreviewPlayback` e `finishExport.loopAfter`
    usam `Math.max(1, totalDurationFull() * 1000)` para o módulo do
    elapsed, evitando `% 0 = NaN`, loop infinito ou preview congelado.
  - Não altera valores do usuário; apenas garante que `t = elapsed/dur`
    seja válido. Quando todos os trechos são 0 e não há pausas, o
    preview mostra estado estático seguro (t=0).
  - `getSegAndLocalTAtTime` e `applySegWeights` já tratavam segmentos
    de duração zero como transição instantânea (localT=1); não
    alterados.
- Export MP4: `total = Math.max(1, Math.round(durationSec * fps))`
  já existia. Quando a duração total real é 0, o export gera 1 frame
  estático em vez de travar.

### Não tocado nesta versão

- Redesign do painel Tempo, timeline contínua, novo stage, novo
  sistema de handles, edição vetorial, easing de rotação/escala,
  WebCodecs (exceto guard mínimo já descrito), templates, cores
  gerais, layout geral aprovado, textos e ícones fora do escopo
  acima.

### Versão

- `appVersionText`: `v8z4b16b`.
- `appVersionNameText`: `Stabilize contextual menu and zero-second segments`.
- Constantes `APP_VERSION` / `APP_VERSION_NAME` atualizadas.

## v8z4b16a — Mobile UI consolidation: contextual menu, sliders, duration panel

Consolidação estrutural de UX em iPhone/Safari sobre a v15z. **Nenhuma
mudança no motor de animação, easing, curvas, render, preview, export,
WebCodecs ou `getStateAtT`/`drawAtT`.** Foco total em interface,
estados visuais, hierarquia e navegação.

### Menu contextual de frame — paridade visual com a toolbar

- `#custBarTabs` agora compartilha o MESMO padding da `.toolbar`
  (4px topo / 4px lateral / safe-area-inset-bottom no mínimo 4px) e
  `min-height` da cust-tab reduzido de 72px → 56px. Resultado: o menu
  contextual no modo compacto ocupa exatamente a mesma altura total
  do menu inferior principal — pura troca de conteúdo, sem aumento de
  faixa, sem invasão extra do stage.
- `#custBarContent` perdeu o `min-height:122px` (gerava altura extra
  quando o conteúdo era pequeno). Agora dimensiona pelo conteúdo;
  herda o mesmo `padding-bottom` de safe-area da toolbar.

### Menu contextual — ordem oficial e novas ações rápidas

- Ordem das abas atualizada para: **Pausa, Rotação, Escala, Posição,
  Curvas, Adicionar** (estilo CapCut). "Pausa" substitui o antigo
  rótulo "Duração" — controla a pausa local do frame, e o nome agora
  corresponde diretamente ao que faz.
- Novas ações rápidas:
  - **Curvas** → fecha o custBar e abre o painel de easing do
    segmento seguinte (`openEaseForSeg('next')`). Sem submenu interno
    duplicado.
  - **Adicionar** → insere frame após o ativo
    (`insertFrameAfterActive()`) e fecha o custBar.
- Submenu de Pausa simplificado: removidos o cabeçalho "Frame Fn" e o
  texto "Duração/pausa neste frame (0 = sem pausa)". Restam só os
  três elementos essenciais (slider + valor + reset). Margem do reset
  reduzida de 18px → 14px.

### Sliders — faixa ativa cyan + inativa cinza escuro

- Todos os sliders editáveis (`.dur-slider`) — pausas globais,
  pausas por frame, segmentos (Total + individuais), local do
  custBar, acabamento (Retorno/Duração) — recebem um gradiente
  dinâmico via CSS variable `--fill`:
  - Faixa ativa: `var(--accent)` (cyan/turquesa do app).
  - Faixa inativa: `var(--surface3)` (cinza escuro).
- Atualização sem listener por slider: delegação `input` no
  documento + helper `updateSliderFill()`. `refreshSliderFills()` é
  chamado no `DOMContentLoaded` e ao final de `refreshPauseControls`
  para mudanças programáticas. Sem glow.

### Painel Duração — limpeza estrutural

- Cabeçalhos de bloco (Segmentos, Pausas, Acabamento) padronizados via
  `.dur-section-header` com `.dur-section-chevron` (chevron cyan
  menor, 24px). Border-bottom de `.5px solid var(--border)` somente
  no cabeçalho — a única linha divisória **entre blocos principais**.
- Subitens dentro de cada bloco compartilham a mesma faixa contínua,
  sem traços horizontais entre si. Subtítulos descritivos ("Tempo
  por segmento", "Pausa por frame") rebaixados visualmente:
  `.dur-sublabel` em 10px/600/uppercase/`text3`, com valor
  acompanhante (`.dur-sublabel-value`) também em `text3`.
- Botões secundários ("Igualar intervalos", "Zerar pausas")
  unificados em `.dur-subitem-action` — visual discreto, mesma cor
  de superfície.
- Removidas as classes `is-bordered` redundantes entre subitens; a
  hierarquia é agora puramente tipográfica.

### Pausas globais — sliders individuais subordinados ao "Tudo"

- Quando **todos** os frames têm o mesmo valor de pausa (estado
  "tudo sincronizado pelo global"), o container `#framePauseRows`
  recebe a classe `.global-synced` e os sliders individuais ficam
  visualmente subordinados:
  - `filter:grayscale(1); opacity:.45`
  - rótulos/valores em `var(--text3)`
- Qualquer mudança num individual quebra o `allEqual`, o slider
  "Tudo" volta para o estado misto e os individuais voltam ao
  contraste cheio — comunicando a divergência sem texto.
- Base estrutural pronta para futura **seleção parcial de grupos**:
  classe `.partial-synced` aplicável a um subconjunto de rows
  (escopo menor), com a mesma dessaturação. Nenhuma seleção múltipla
  implementada ainda — apenas a arquitetura visual/estado.

### Safe area / toolbar inferior — invasão visual da Home Bar

- Padding superior da `.toolbar` reduzido de 8px → 4px; mesmo no
  custBar e no custBarTabs. Bottom continua sendo
  `env(safe-area-inset-bottom)` (mínimo 4px), preservando os botões
  acima da Home Bar. O fundo da toolbar agora colore TODA a área até
  a Home Bar — sem faixa preta visível, estilo
  CapCut/Instagram/Lightroom/TikTok.
- Resultado prático: ~8px verticais devolvidos ao stage no iPhone.

### Estrutura para futura timeline / play fixo superior

- `#midBar` marcado com `data-role="timeline-strip"` e `#pillsRow`
  com `data-role="timeline-pills"` — base semântica para a futura
  frame-strip contínua (swipe horizontal, frame ativo no centro).
- `#topBar` marcado com `data-role="top-bar"` — slot reservado para
  o futuro play permanente. Nenhuma mudança de layout/comportamento;
  apenas evita dependências (CSS/JS) que impeçam a evolução depois.

### Áreas explicitamente NÃO tocadas

- `getStateAtT`, `drawAtT`, `setFramePause`, `ensureFramePauses`,
  `refreshPauseControls` (apenas adicionado 1 hook de
  `refreshSliderFills` ao final).
- WebCodecs/export pipeline, MediaRecorder fallback.
- Easing, splines, curvas, templates, stage/aspect ratio.
- Sincronização v15u+ do estado de pausas por frame.
- Lógica de animação, preview, loops, finishing.

## v8z4b15z — Frame menu hierarchy and duration panel fixes

Correção dos problemas estruturais remanescentes da v15y. Foco:
sliders de pausa com a mesma largura útil dos sliders de segmento,
remoção definitiva do nested scroll, hierarquia correta do menu local
do frame (faixa de frames sempre visível) e padrão de navegação
estilo CapCut.

Todos os patches partem da v15y. **Não houve mudanças no motor**
(`getStateAtT`, `drawAtT`, `setFramePause`, `ensureFramePauses`,
`refreshPauseControls`, easing, splines, WebCodecs/export, templates,
stage/aspect ratio, sincronização v15u+).

### Sliders de pausa — largura útil real (problema estrutural)

- A v15y já tinha rows com mesmo padding/labels, mas o thumb das pausas
  ainda parecia preso por causa do `min-width:64px` na label e do
  `min-width:52px` no valor — em iPhone, o thumb perdia ~30% da faixa
  útil para esses dois polos.
- v15z introduz a classe **`.dur-edit-row`** (CSS unificado) usada por
  TODOS os sliders editáveis do painel Duração: Total dos segmentos,
  sliders por segmento, "Tudo" das pausas, sliders por frame de pausa
  e sliders de Acabamento. Estrutura: `display:flex; gap:12px;
  width:100%`, label `min-width:44px`, slider `flex:1 1 0; min-width:0`,
  valor `min-width:48px`. O thumb percorre a mesma largura útil em
  todas as seções.
- Removidos os `style.cssText` inline do `buildFramePauseRow` e do
  `openSegBreakdown` — antes podiam divergir entre versões; agora há
  uma única fonte de verdade na CSS (`.dur-edit-row`).
- `#panelDuration #segBreakdown`, `#framePauseSection`, `#finishSection`,
  `#segRows`, `#framePauseRows` são forçados a `width:100% !important;
  max-width:100% !important; box-sizing:border-box` — nenhum container
  intermediário consegue limitar a largura útil dos sliders.

### Nested scroll — eliminação definitiva

- Reforçado: `#panelDuration` é a única superfície que rola.
  Subseções (`#segBreakdown`, `#framePauseSection`, `#finishSection`,
  `#segRows`, `#framePauseRows`) agora têm `overflow:visible
  !important; max-height:none !important` com seletor mais específico
  (`#panelDuration #X`) para vencer qualquer regra antiga residual.

### Acabamento — padding superior

- `padding-top` aumentado de `22px` → `28px` ao abrir; `margin-bottom`
  do bloco de chips de `14px` → `18px`. O slider de retorno/duração não
  fica mais grudado ao título da seção.
- Linhas de slider (`#loopDurRow`, `#finishDurRow`) migradas para
  `.dur-edit-row` — mesma largura útil dos sliders de Segmentos/Pausas.

### "Tudo" como estado global real

- Estado já implementado em v15y (filtro grayscale + opacity:.55 +
  textos `var(--text3)` quando frames divergem; arrastar aplica a todos
  imediatamente). O seletor `.global-mixed` foi atualizado para casar
  com as novas classes `.dur-edit-label` / `.dur-edit-value`.
- Botão "Aplicar a todos" permanece removido — o slider "Tudo" é o
  ponto único de aplicação global.

### Menu local do frame — faixa de frames sempre visível

- Problema na v15y: `#custBar` era `position:fixed; bottom:0` e
  sobrepunha `#midBar` (faixa de frames) — o usuário perdia a
  visualização dos frames ao tocar no contextual.
- v15z: `#custBar` agora é **in-flow** (flex item de `.app`,
  `flex-shrink:0`). DOM order já posiciona `#midBar` antes de
  `#custBar`, então o painel ocupa apenas o slot da `#toolbar`
  (escondida via `body.cust-open #toolbar { display:none }`). A faixa
  de frames continua visível logo acima do menu local — sem deslocamento,
  sem sobreposição, sem espaço fantasma.
- Mantido `max-height:min(38dvh, 280px)` para limitar a altura do
  contextual.

### Navegação hierárquica estilo CapCut

- `#custBarBack`: removido o texto "Voltar"; a chevron passou de
  20×20 para **28×28**, sem moldura/fundo (apenas highlight sutil ao
  toque). Posicionada à esquerda do conteúdo expandido. Comportamento
  hierárquico:
  - Toque no frame → abre `#custBar` em `compact-mode` (só ícones)
  - Toque num ícone → expande os controles e revela a seta de voltar
  - Toque na seta → recolhe ao `compact-mode` (preserva aba ativa)
  - Toque fora (stage) → fecha `#custBar` por completo
- `#alignBar` (multiseleção): removido o botão `✕`, substituído por
  uma seta de voltar à esquerda (mesmo padrão visual). Limpa a
  multiseleção (`clearMultiSelect()`) — antes era um chip com um X.

### Direção futura (não implementado nesta versão)

- Edição em grupo (multiseleção) compatível com edição individual e
  global continua sendo a direção arquitetural — preservada para
  Escala/Rotação/Posição.
- Controles globais de Duração permanecem exclusivamente no painel
  Duração; não retornam para o menu local.

## v8z4b15x — Duration panel UX unification and local frame panel redesign

Refinamento sobre a v15w. Foco: equiparar visualmente os sliders de
"Pausas por frame" aos sliders de "Tempo por segmento", aumentar área
clicável dos botões auxiliares no painel local do frame, e reorganizar
o menu local para que o painel de ajuste **substitua** a barra de
ícones (em vez de empilhar) com uma seta de voltar dedicada.

### Sliders de pausa — paridade visual com os sliders de segmento

- `#framePauseSection` agora usa o mesmo container `flex-direction:column;
  gap:8px;padding-top:12px;margin-bottom:14px;` do `#segBreakdown`. Antes
  era um simples `padding-top:12px;margin-bottom:12px;`, sem o ritmo de
  gap das rows de segmento.
- Slider global de pausa: padding vertical da row passou de `8px 0` para
  `10px 0` (idêntico às rows de segmento). Label "Tudo" ajustado para
  `min-width:52px` (mesma largura da label dos segmentos individuais),
  garantindo que a track comece exatamente na mesma posição horizontal.
- Sliders por frame (`buildFramePauseRow`): label "F1..F10" passou de
  `min-width:36px` para `min-width:52px`, alinhando o início da track
  com os sliders de "Tempo por segmento" (`1-2`..`9-10`). Sem isso, a
  track das pausas começava ~16px antes e dava a sensação de slider
  menor / desalinhado.
- Adicionado cabeçalho "Pausa por frame · = Xs pausa" no topo dos
  sliders individuais, espelhando o cabeçalho "Tempo por segmento ·
  = Xs total" da seção Segmentos. `refreshPauseControls()` atualiza
  esse total junto com os demais.
- Resultado: mesma largura útil, mesma escala, mesma proporção. A
  diferença entre as duas seções é apenas semântica (intervalos vs
  pausas), não visual.

### Botões auxiliares / Reset — alvos de toque maiores

- Chips `−5%`/`+5%`/`Reset` (Escala), `−5°`/`+5°`/`Reset` (Rotação) e
  `Reset` (Duração local) passaram de `padding:8px 14px;font-size:12px`
  para `padding:11px 16px;font-size:13px;min-height:42px` com
  `justify-content:center`. Margin top da row de chips aumentado de
  `10px` para `14px`. Gap entre chips aumentado de `8px` para `10px`.
- Não parecem mais ícones decorativos perdidos; têm peso visual coerente
  com os thumbs/sliders ao lado.

### Painel local do frame — substituição em vez de empilhamento

- Quando o painel está expandido (mostrando controles), `#custBarTabs`
  é ocultado por CSS (`#custBar:not(.compact-mode) #custBarTabs{
  display:none }`). Quando recolhido (compact-mode), `#custBarContent`
  é ocultado. Os dois nunca aparecem ao mesmo tempo — o painel de
  ajuste substitui a barra de ícones.
- Adicionada seta de voltar `← Voltar` no topo do `#custBarContent`
  (`<div id="custBarBack">`). Ao tocar, chama `collapseCustBar()` que
  re-aplica `compact-mode`, voltando à barra de ícones com a aba ativa
  preservada.
- `switchCustTab()` simplificado: tocar em qualquer ícone agora SEMPRE
  expande para o ajuste daquela função (antes, re-tocar no ícone ativo
  recolhia, o que causava colapso acidental). O caminho oficial de
  voltar é a seta — sem ambiguidade.
- Stage-tap continua fechando o painel inteiro em qualquer modo
  (compact ou expandido), preservando o comportamento existente.

### Linguagem visual dos ícones — alinhada com a futura toolbar inferior

- Cada `.cust-tab` agora tem `<svg>` em cima + `<span class="cust-tab-lbl">`
  embaixo (`Escala`, `Rotação`, `Posição`, `Duração`). Layout vertical,
  ícone branco (`rgba(235,235,235,0.95)`) + label branco abaixo,
  `flex-direction:column;align-items:center;gap:4px;min-height:60px`.
- Aba ativa: ícone e label em `var(--accent)` (mesmo padrão de cor já
  existente, agora aplicado ao label também).
- Mesma linguagem visual da toolbar inferior principal planejada
  (faixa horizontal estilo mobile/TikTok, ícone + nome).

### Arquitetura preservada (intacta desde v15u)

- `setFramePause`, `ensureFramePauses`, `refreshPauseControls`,
  `getStateAtT`, `drawAtT`, motor de animação, easing, curvas/splines,
  WebCodecs/export, templates, stage/aspect ratio — sem alterações.
- Sincronização centralizada da v15u intacta: toda escrita em
  `framePauses[]` continua passando por `setFramePause`; todo refresh
  visual por `refreshPauseControls`; todo redimensionamento por
  `ensureFramePauses`.
- Todas as mudanças desta versão são CSS/markup (largura de label,
  padding, gap, container flex) + dois deltas mínimos em JS:
  `collapseCustBar()` (nova função) e remoção do toggle-on-active em
  `switchCustTab` (substituído pela seta de voltar). Nenhum handler
  novo na cadeia de pausas.

## v8z4b15w — Duration panel UX unification and local frame panel redesign

Refinamento estrutural sobre a base estável da v15u/v15v. Foco: UX,
organização, consistência visual, interação iPhone/Safari, clareza
semântica.

### Painel Duração — topo agora é só leitura

- Topo do painel passa a mostrar **apenas** a duração total e o breakdown
  por categoria: Duração total, Segmentos, Pausas, Acabamento.
- Removidos do topo: slider de segmentos, "Intervalo padrão" e botões
  editáveis. Topo não tem mais controle editável.
- Renomeado "Percurso" → "Segmentos" no card de breakdown.

### Seção Segmentos — todos os controles editáveis dos segmentos vivem aqui

- `durSlider` (slider proporcional dos segmentos) movido para dentro de
  `#segBreakdown`. Continua controlando apenas a soma dos segmentos —
  não inclui pausas nem acabamento.
- Input "Intervalo padrão" movido para dentro da seção.
- Botão "Igualar intervalos" maior e mais clicável.
- Sliders individuais com padding vertical aumentado (10px) para toque
  no iPhone.

### Seção Pausas por frame — slider global + botão "Aplicar a todos"

- Slider global (`framePauseGlobalSlider`) e os sliders por frame
  continuam usando `<input type="range">` nativo + classe `.dur-slider`
  + listeners simples (`input`/`change`) — mesmo padrão estrutural do
  painel de Segmentos, que já provou funcionar bem no iPhone/Safari.
- Adicionado botão "Aplicar a todos" → nova função
  `applyFramePauseGlobalToAll()`: lê o valor do slider global e força
  esse valor em todos os frames não-locked, útil para unificar quando o
  label mostra divergência ("0.7s\*").
- Linhas individuais com padding vertical 10px e gaps maiores; valor
  numérico com largura mínima 48px.
- Toda escrita continua passando por `setFramePause()`; redimensionamento
  por `ensureFramePauses()`; refresh por `refreshPauseControls()` —
  arquitetura estável da v15u preservada integralmente.

### Painel local do frame (`#custBar`) — controles em cima, ícones embaixo

- Markup invertido: `#custBarContent` (controles) é o **primeiro** filho;
  `#custBarTabs` (ícones) é o **último**. CSS migrado de
  `:first-child`/`:last-child` para alvos por ID — não depende mais da
  ordem.
- Comportamento "compact-first": ao primeiro toque no frame, o painel
  abre só com a barra de ícones embaixo (`compact-mode` adicionado por
  `openCustBar`). O segundo toque em qualquer ícone expande os controles
  acima. Tocar de novo no ícone ativo recolhe.
- Cadeado global (`#custGlobalLock`) removido do markup. Painel local
  agora é exclusivamente local — ajustes globais vivem no painel
  Duração. `custGlobalLock` (state) e `isCustLocked()` permanecem como
  no-op silencioso (sempre `false`), preservando os caminhos de código.
- Aba "framepause" rebatizada visualmente como "Duração/pausa local"
  no label do conteúdo. Texto secundário ajustado.
- Chips/Reset buttons aumentados (8px 14px) para alvos de toque
  acessíveis.

### Ícone semântico de duração

- Ícone da aba `framepause` substituído: era um ícone de "pause"
  geométrico; agora é um relógio (Lucide-style: círculo + ponteiros).
  Reflete o que o controle realmente faz: duração / timing /
  permanência / pausa local.

### Arquitetura preservada

- `setFramePause`, `ensureFramePauses`, `refreshPauseControls`,
  `getStateAtT`, `drawAtT`, motor de animação, easing, curvas/splines,
  WebCodecs/export, templates, stage/aspect ratio — sem alterações.
- `buildProjectData`/`applyFrameData` continuam persistindo
  `framePauses`.
- Sincronização centralizada da v15u intacta.

## v8z4b15v — Restore native slider UX for frame pauses on iPhone

Restaurada a UX do painel "Duração dos segmentos" para o painel "Pausas
por frame". A v15u trocou os sliders por steppers para resolver um
conflito de scroll no iPhone/Safari, mas o problema verdadeiro nunca
foi o `<input type="range">` nativo — era a implementação custom
(touch-action:none, gesture math manual, handlers duplicados). O
painel de segmentos prova que um range nativo, com listeners simples
(input/change) e sem touch-action override, convive bem com pan-y do
container. Reaproveitamos esse padrão aqui: mesma classe `.dur-slider`,
mesmos eventos, mesma estrutura.

## v8z4b15u — Stabilize frame pause state sync on iPhone

- **Causa raiz:** múltiplos caminhos paralelos escrevendo em `framePauses[]` (gesture custom em `bindPauseSlider`, listeners `input/change/touchend/pointerup` e `setFramePause`) sem fonte única de verdade. No iPhone/Safari, sliders nativos `input[type=range]` em lista rolável capturavam o pan vertical, causando alteração acidental ao tentar rolar; e o caminho de gesture atualizava o estado mas só refrescava o label/total ao soltar — daí "thumb se mexe e número fica em 0.0s". `removeLastFrame` também não fazia splice de `framePauses`, e o save/load de projeto não persistia pausas.
- **Centralização:** `setFramePause(idx, duration, opts)` é o único setter; `ensureFramePauses()` (alias `syncFramePausesLength()`) é o único redimensionador; `refreshPauseControls()` é o único refresh visual; `renderFramePauseRows()` reusa linhas e bind delegado único.
- **UX iPhone:** painel Duração agora usa stepper `−  0.0s  +  0` por frame (touch-action manipulation, hold-to-repeat) em vez de range slider — elimina conflito gesto/scroll. Painel local/contextual segue com slider, mas todas as escritas vão por `setFramePause`.
- **Persistência:** `framePauses` agora vai junto no `buildProjectData`/`applyFrameData`.
- **Não foi alterado:** `getStateAtT`, `drawAtT`, motor de animação, curvas/splines, easing, WebCodecs/export, templates, stage/aspect ratio, layout aprovado.
