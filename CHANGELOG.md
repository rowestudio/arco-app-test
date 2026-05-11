# Changelog

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
