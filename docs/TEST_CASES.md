# TEST_CASES

## TC-070 — Moldura transitória temporal do Play de Frames (E9AQ/E9AW / REG-069)

- Pré-condição: projeto com pelo menos dois Frames de geometrias e rotações diferentes, Frame inicial selecionado e Stage com pan/zoom não triviais.
- Passos: tocar **Frames**, observar a transição até Frames posteriores e tocar Stop durante a execução. Repetir com uma trajetória cuja moldura saia da área visível, com pausa no Frame de chegada, sem Loop a partir do último Frame, com Loop e tocando no Stage, em área vazia, timeline e outro controle durante o percurso.
- Resultado esperado: o botão não cria borda, contorno, fundo ou pill, não herda a célula contextual genérica e não mantém foco tabulável que produza anel nativo; Play e Stop são `path`/`rect` sólidos próprios em ciano, sem `<use>` nem `stroke` de SVG. Stage, pan, zoom, transform e viewport permanecem imóveis; uma única moldura temporária laranja se desloca, escala e gira pelo timing/interpolação/curvas existentes e não para nem fica azul ao chegar. Ao alcançar um Frame, **o próprio Frame fixo** troca de azul ciano para cinza continuamente por cerca de 360 ms, sem halo, sombra ou segunda moldura, antes de a referência ficar a 28%; na mesma janela, a pill correspondente mostra somente borda ciano, sem seleção, preenchimento, halo ou retenção. A moldura laranja continua sem pausa, salto ou reconstrução de assets/Stage, inclusive quando a pausa do Frame é zero. Frames futuros permanecem neutros; em N→1 essa leitura visual recomeça. A seleção canônica avança pelas chegadas, enquanto a faixa inferior acompanha continuamente o mesmo relógio do trecho: uma duração de três segundos leva três segundos para percorrer a distância entre os chips e uma pausa real mantém o chip parado. Stop ou qualquer toque fora de Play/Stop interrompe, remove a moldura e mantém selecionado o último Frame alcançado. Sem Loop, Play no último reinicia em 1; com Loop, N→1→N continua usando a decisão de Loop congelada no início do Play. Play Frames é diagnóstico de Frames e não anima Ativos por profundidade/parallax. Não há centralização automática ou duração temporal artificial.
- Integridade: Frames reais, curvas, durações, pausas, projeto, Undo/Redo e autosave permanecem idênticos; Preview e MP4 não exibem nem consomem a moldura editorial.
- Evidência automatizada: contrato estático e smoke WebKit mobile E9AQ/E9AV/E9AU/E9AW/E9AX/E9AY/E9AZ/E9BA em `tests/smoke/app.spec.mjs`. Validação física obrigatória em iPhone/Safari antes de merge.

## TC-069 — Retorno ao Preview após exportação com Text Asset (E9AO)

- Pré-condição: projeto com imagem e Text Asset visível, inclusive com presença temporal configurável.
- Passos: abrir o Preview, gerar e salvar um MP4, aguardar a tela voltar ao Preview e deixar o playback reiniciar.
- Resultado esperado: o MP4 preserva o texto e o Preview pós-export volta a mostrá-lo quando o relógio de presença o considera presente. O retorno usa o contexto Preview, não o contexto Export; imagens, opacidade manual, presença temporal, Frames e ProjectWorld permanecem inalterados.
- Evidência automatizada: WebKit/H.264 gera MP4 real com Text Asset e verifica o primeiro ciclo de Preview pós-export pelo renderer canônico.
- Validação física obrigatória em iPhone/Safari antes de merge.

## TC-068 — Opacidade individual de Ativos (E9AM)

- Pré-condição: projeto com imagem e Text Asset no Modo Ativos, incluindo um ativo com presença temporal customizada.
- Passos: selecionar cada ativo, abrir **Opacidade** depois de **Tempo**, aplicar 40%, confirmar o Reset em 100%, usar Undo/Redo, salvar/carregar e reabrir sessão.
- Resultado esperado: somente o ativo selecionado muda seu alpha; presença, geometria, Frames, ProjectWorld, profundidade, zIndex, Layers e seleção não mudam. O texto reduz glifos e fundo juntos, preservando a proporção da opacidade própria do fundo.
- Preview/Export: sem precisar salvar antes, abrir Preview imediatamente após aplicar 40% e baixar o arquivo; ambos devem usar o mesmo alpha quando o ativo está presente. Fora do intervalo temporal ele continua omitido. Nenhum efeito global é mostrado nesta etapa.
- Validação física obrigatória em iPhone/Safari antes de merge.

## TC-067 — Presença temporal de Ativos (E9AG)

- Pré-condição: projeto com pelo menos dois Frames, uma imagem e um Text Asset no Modo Ativos.
- Passos: configurar padrão global em `Edição do projeto > Projeto > Aparência`; aplicar a todos e aplicar apenas aos sem ajuste individual; criar override individual em `Animação`; usar âncoras por tempo do projeto, Frame e Entrada/Saída de outro ativo; tentar ciclo/autorreferência; salvar/carregar e repetir após Session Restore.
- Resultado esperado no editor: ativo fora do intervalo permanece visível como referência editorial suavizada/tracejada, selecionável e editável; selecionado conserva coral e alças. A referência não altera opacidade manual, geometria, profundidade, `zIndex`, ordem de Layers, Frames, curvas ou ProjectWorld.
- Resultado esperado em Preview/Export: ativo fora do intervalo é omitido pelo resolvedor canônico em tempo de projeto, tanto imagem quanto texto; a ausência temporal não conta como erro de render nem quadro vazio quando outro conteúdo está presente. Preview e Export devem usar a mesma regra, sem depender do DOM do Stage.
- Exclusão de âncora: excluir um ativo referenciado abre confirmação; Cancelar não muta; confirmar converte dependentes para tempo absoluto resolvido, sem relink automático, com Undo/Redo preservando os vínculos.
- Duração proporcional: quando a preferência de acompanhar duração estiver ligada, offsets absolutos escalam junto com a duração total; âncoras semânticas por Frame/Ativo continuam semânticas.
- Evidência automatizada: smoke WebKit mobile cobre resolvedor, controles, referência editorial no Stage, persistência e diálogo de dependências; smoke de Export cobre filtro de presença sem quadro vazio; self-tests precisam continuar verdes.
- Validação física obrigatória em iPhone/Safari antes de merge/release, incluindo rolagem nativa do painel de dependências em tela pequena.

## TC-051 — Copiar, colar e duplicar ativos (E9Z)

- Pré-condição: projeto aberto no Modo Ativos com ao menos um ativo.
- Passos: duplicar pelo painel Layers, duplicar pela barra inferior, copiar e colar pelo menu `+`; repetir com uma imagem copiada do sistema e com clipboard negado/incompatível. No iPhone/Safari, repetir com HEIC/HEIF que o sistema consiga decodificar e, quando houver recorte, conferir o alpha sobre fundos de cores distintas.
- Resultado esperado: a duplicação de Layers sobrepõe e seleciona o clone; a da barra desloca-o levemente; ambas criam um único Undo/Redo e o clone nasce desbloqueado. Colar só muta quando o clipboard atual contém ativo Arco compatível ou imagem; falhas não reutilizam cópia anterior. HEIC/HEIF aceitos preservam o bitmap decodificado; o diagnóstico registra MIME e alpha observados. Preview, Export e Save/Load preservam os ativos pelo caminho canônico.
- Ambiente: WebKit automatizado e validação física em iPhone/Safari antes de qualquer promoção.

## TC-066 — Superfície contextual contínua (E9Y / REG-063)

- Em iPhone/Safari, abrir Escala ou Rotação de Frames e Escala, Rotação ou Profundidade de Ativos. A superfície do painel e toda a área inferior até a borda/safe-area devem ter o mesmo cinza contextual, sem faixa residual do chrome.
- Evidência automatizada: o gate E8U em WebKit verifica que `#lowerContextSlot`, `#lowerContextSheetShell` e o `body` usam a mesma cor computada em todos os cinco estados; após fechar, o `body` volta ao chrome escuro. A timeline acima preserva seu cinza escuro e os acentos ciano/coral permanecem inalterados.
- Validação física obrigatória em iPhone/Safari.

## TC-065 — Régua e passos de Profundidade (E9W)

- Em iPhone/Safari, Profundidade mostra marcas cinza compactas a cada 20 pontos acima do slider e labels `−100`, `0` e `+100` abaixo dele. Não há marca coral grande nem sobreposição entre traço e número; fill, passos `−5/+5` e Reset permanecem coerentes após arraste.
- O menu de Camadas não mostra Subir/Descer; reordenação direta E9R permanece disponível.

## TC-064 — Reordenação viva de Camadas (E9Q)

- Pressão longa numa miniatura ativa reorder; itens abrem espaço ao cruzar; retorno ao ponto inicial cancela sem mutação; soltar em novo ponto confirma uma alteração e Undo/Redo a preservam.
- Validação física obrigatória em iPhone/Safari.

## TC-063 — Fechamento e feedback de Camadas (E9P)

- Tocar um ativo ou área vazia do Stage com Camadas aberta fecha a pilha antes da interação do Stage.
- A miniatura selecionada e em arrasto usa coral e acompanha o dedo; ações indisponíveis conservam fundo opaco e símbolo esmaecido.
- Validação física obrigatória em iPhone/Safari.

## TC-062 — Correção física de Camadas (E9O)

- Em Preview/Export, o controle e a pilha de Camadas não aparecem. Ao retornar ao editor, o controle reaparece normalmente.
- A faixa inferior de Ativos mostra Camada, Profundidade, escala e rotação. A faixa contextual tem Visibilidade, Subir, Descer, Profundidade, Fixar/Desafixar e Excluir, todos de 60 × 60 px.
- Segurar uma miniatura não abre o preview da imagem nem a folha de compartilhar/salvar do iPhone. Até nova validação do arrasto, Subir/Descer devem reordenar a Layer.
- Validação física obrigatória em iPhone/Safari.

## TC-061 — Faixa canônica e reordenação direta de Camadas (E9N)

- Em iPhone/Safari, abrir Camadas e tocar uma miniatura: a faixa contém somente Visibilidade, Profundidade, Fixar/Desafixar e Excluir, com os símbolos canônicos do app e alvos de toque de pelo menos 44 × 44 px. Não contém Trocar, Subir ou Descer.
- Segurar uma miniatura e arrastá-la para outra posição reordena a Layer; arrastar imediatamente apenas rola a lista. Layer travada não reordena. A seleção, a identidade e a Profundidade permanecem preservadas.
- Evidência automatizada: gate E9N WebKit verifica as quatro ações, símbolos e alvos, e a mutação de ordem/Undo pelo helper canônico. Pressão longa/arrasto e rolagem manual exigem validação física em iPhone/Safari obrigatória.

## TC-060 — Faixa opaca e Profundidade sincronizada durante o ajuste (E9M / REG-062)

- Em iPhone/Safari, abrir Camadas, tocar uma miniatura e confirmar que cada ação tem fundo opaco legível sobre imagem e texto. Excluir usa lixeira, não `×`.
- Abrir Profundidade com valor positivo e negativo: o valor do botão da faixa deve acompanhar o arraste imediatamente, sem fechar o painel; o valor do painel, thumb e término do fill devem representar o mesmo valor.
- Evidência automatizada: gate E9M em `tests/smoke/app.spec.mjs` usa `tap()` WebKit, verifica fundo opaco, SVG de lixeira e sincronização `modelo → painel → thumb → fill → faixa` para `+48` e `−24`.
- **Limite:** não testa nem autoriza régua/ticks da E9H; REG-059 permanece sem causa atribuída.
- **Estado:** implementação automatizada; validação física obrigatória.

## TC-059 — Detalhe horizontal de Camadas (E9L / REG-061)

- Em iPhone/Safari, abrir Camadas e tocar uma miniatura: a pilha continua somente com previews; o detalhe abre em faixa horizontal saindo da miniatura, com nome acima e sem caixa de fundo ou botão Fechar.
- Confirmar que Profundidade mostra o valor atual no botão, abre o controle canônico e permite ajuste. Tocar a mesma miniatura fecha somente o detalhe; tocar outra troca o detalhe; tocar área vazia do Stage fecha a pilha sem alterar o projeto.
- Tocar visibilidade, subir/descer, Profundidade, lock/unlock e excluir não pode selecionar, ampliar, mover ou transformar a imagem pelo Stage. Segurar/arrastar preview para reordenar não integra esta versão.
- Evidência automatizada: gate E9L usa `tap()` WebKit real e exige faixa horizontal transparente, ausência de fechar, abertura de Profundidade sem perda da seleção e fechamento pelo segundo toque.
- **Estado:** implementação automatizada; validação física obrigatória.

## TC-058 — Miniaturas e detalhe de Camadas (E9K / REG-060)

- Em iPhone/Safari, abrir Camadas: cada item da pilha deve mostrar somente a miniatura, sem número nem nome ao lado.
- Tocar uma miniatura deve selecionar a Layer e abrir seu detalhe. A formulação vertical foi superada pelo TC-059/E9L. Tocar outra miniatura troca o detalhe; rolar a pilha não reordena Layers.
- Evidência automatizada: os gates E9K usam `tap()` em WebKit para provar a seleção de Layer e validam preview puro e detalhe aberto.
- **Estado:** implementação automatizada; validação física obrigatória.

## TC-057 — Pilha de Camadas sobre o Stage (E9J; apresentação superada pela E9K)

- Em iPhone/Safari, selecionar um Asset no Stage e tocar o ícone de Camadas. A pilha deve abrir acima do ícone, sobre o Stage, sem modal central. A formulação E9J de ações acima das linhas foi substituída por TC-058/E9K.
- Com muitas Layers, arrastar a lista apenas rola; não seleciona outra Layer nem reordena. Tocar uma linha troca a seleção/ações canônicas; tocar área vazia do Stage fecha a pilha sem mutar a seleção.
- Evidência automatizada: gate `E9J — Camadas expande sobre o Stage e deixa ações acima da pilha selecionada` em `tests/smoke/app.spec.mjs` valida abertura pelo controle real, ancoragem em `#imageArea`, relação acima do ícone, ações antes da lista, rolagem programática e invariância da seleção/ordem. O gesto físico de arrasto permanece parte obrigatória da validação em iPhone/Safari.
- **Estado:** implementação automatizada; validação física em iPhone/Safari obrigatória antes de recomendar merge.

## TC-055 — Camadas + lock canônico (E9I)

- Em iPhone/Safari, validar controle compacto → lista rolável na ordem da pilha; primeiro tap normal seleciona e abre opções contextuais; scroll apenas rola e não abre ações; tocar outra Layer troca seleção/ações; tocar fora no Stage fecha sem mutação.
- Validar linha limpa com ordem antes de thumbnail/ícone maior e nome, sem `Posição N de M · Prof. X` nem ações repetidas; cabeçalho com título, quantidade e fechar; profundidade contextual em ícone + valor; uma única área de ações para a selecionada.
- Validar lock/unlock canônico: Layer travada permanece em Stage/Preview/Export/projeto/lista, não responde a seleção/transformação/edição pelo Stage nem a ações diretas de toolbar/painel (trocar, profundidade, reordenação, exclusão ou visibilidade), e permite hit-test alcançar Layer destravada abaixo; painel permite selecionar/inspecionar/destravar. Cobrir Save/Load, Session Restore, Undo/Redo, autosave, default destravado e projeto antigo.
- **Estado:** implementado na E9I; o gate WebKit cobre lock, hit-test abaixo e persistência. A apresentação de Camadas E9I foi aprovada visualmente por Roberto em iPhone/Safari; a evolução E9J requer sua própria validação física.

## TC-056 — REG-059: Profundidade sem régua E9H (E9I)

- Em iPhone/Safari, abrir o controle de Profundidade da futura tentativa, alterar o valor e executar Reset.
- Exigir valor 0 e thumb central no slider canônico; a nova UI exibe ícone + valor e não contém régua/tick textual independente. Não atribuir causa à REG-059 sem evidência. **Estado:** mitigação E9I pendente de validação física.


## TC-053 — Picker de cor do Arco: runaway palette, HEX inline, recovery da v1 e contenção do painel (REG-055)

Três gates em `tests/smoke/app.spec.mjs`, viewport iPhone **390 × 797**. Cobrem a nova tentativa de correção da REG-055 (`v8z4b32E9F6`, revisada na `v8z4b32E9F6-R1` — mesma PR #511, mesma versão) após as reprovações físicas da E9F4 (painel próprio) e da E9F5 (runaway palette).

**Gate 1 — `REG-055 — picker nativo não alimenta a paleta pessoal (runaway), HEX inline salva exatamente 1 cor por commit, v1 contaminada é descartada`:**

- **Recovery da v1:** semeia `localStorage['arco_user_custom_colors_v1']` com 200 cores válidas simulando a contaminação física da E9F5 ANTES de carregar o app; exige v1 removida (`localStorage.getItem(...)===null`), `customColorLegacyV1Purged===true`, `customColorPalette` iniciando vazia, app funcional (fluxo de abrir projeto real completo depois da contaminação).
- **Runaway do picker nativo (os três contextos — Fundo do projeto/`#bgHexInput`, Cor do texto/`#textCreationColor`, Fundo da caixa/`#textBoxBackgroundColor`):** simula uma sessão de arraste contínuo reproduzindo o padrão físico do WebKit — 20 valores diferentes via `input` intercalados com MÚLTIPLOS eventos `change` (não só ao final) — e exige `customColorPalette.length` inalterado ao fim da sessão inteira. Prova, ao mesmo tempo, que o picker continua aplicando a cor normalmente (preview/aplicação real: `bgColor`/`pendingTextDraft.color`/`pendingTextDraft.boxBackgroundColor` refletem o último valor do arraste) e que o Fundo do projeto ainda cria Undo no commit funcional.
- **HEX inválido:** não aplica nem salva, nos três contextos.
- **Edição progressiva do HEX** (`#1 → #12 → … → #123456`, valores distintos por contexto para não colidir por deduplicação): `customColorPalette.length` não cresce durante a digitação; o COMMIT (`change`) com HEX completo válido soma exatamente `+1` e aplica o valor correto (Fundo/glifos/fundo da caixa, preservando a separação glifos×fundo).
- **Deduplicação:** confirmar a MESMA cor de novo (com/sem "#", maiúsculas) soma `+0` e marca `customColorDuplicatePrevented===true`.
- **Escopo:** `buildProjectData(true)` nunca contém a estrutura da paleta pessoal (chave `customColorPalette`/`arco_user_custom_colors`) nem uma cor pessoal que não seja o valor efetivamente aplicado ao projeto.
- **Persistência via v2:** reload preserva a paleta pessoal (chave `arco_user_custom_colors_v2`, não v1); abrir outro projeto preserva a mesma paleta (browser-local, fora do projeto); nenhuma das 200 cores de contaminação da v1 reaparece.
- **Verificação equivalente:** falha comprovadamente contra o código revertido da E9F5 (`git worktree` isolado no commit `3c64bdb`, tip da PR #509) — a paleta cresce de 200 para 206 durante a sessão simulada de arraste (reproduzindo REG-055A) e falha também por ausência do purge de v1 (REG-055C). Passa na `v8z4b32E9F6`.

**Gate 2 — `REG-055 — painel de Fundo do projeto permanece contido em 390×797 com paleta pessoal volumosa (100+ cores)`:**

- Semeia `arco_user_custom_colors_v2` com 120 cores válidas antes de carregar; abre o painel de Fundo do projeto (único dos três contextos cujos swatches crescem verticalmente — `flex-wrap`; Cor do texto/Fundo da caixa já rolam horizontalmente e não entram neste gate).
- Exige: painel inteiro (`#panelBgColor`) contido no viewport 390×797; alça, título e o campo HEX texto (`#bgHexText`) dentro do viewport SEM rolar; a área de swatches (`#bgSwatches`) tem `scrollHeight > clientHeight` (overflow interno real) e altura visível bem menor que o viewport (não "engoliu" o painel); é possível chegar do primeiro ao último swatch rolando internamente; o input nativo "+" (`#bgColorTriggerWrap`/`#bgHexInput`, desde a R1 dentro da MESMA linha rolável dos swatches) também é alcançável pela mesma rolagem; fechar o painel continua funcionando; Stage/layout externo não fica preso (outro painel abre normalmente em seguida).
- **Ajuste de revisão (R1):** antes da R1 este gate exigia `#bgHexInput` sempre visível SEM rolar (quando ele vivia numa linha separada, "Personalizar" + input). Com a unificação de arquitetura do blocker 1 (o "+" passa a ser o último item da linha de swatches, igual aos outros dois contextos), essa exigência foi substituída por "alcançável rolando a mesma área dos swatches" — condição estruturalmente equivalente à do último swatch pessoal.

**Gate 3 (R1) — `REG-055 — os três "+" são o input[type=color] nativo real (alvo de toque), sem painel intermediário, e Enter confirma o HEX inline sem duplicar`:**

- **Prova estrutural do "+" unificado nos TRÊS contextos** (Fundo do projeto, Cor do texto, Fundo da caixa): exatamente um "+" visível por contexto; o "+" NÃO é um swatch de cor (sem `data-color`) e é puramente decorativo (`pointer-events:none`); o `input[type=color]` nativo ocupa fisicamente a MESMA área do "+" (tolerância 1.5px), não é 1×1, não está fora da tela, é interativo (`pointer-events != none`); `document.elementFromPoint` no centro do "+" resolve exatamente para o input nativo (nunca para o "+" visual nem outro elemento); tocar o trigger não abre `#customColorPanel` nem nenhum painel intermediário do Arco.
- **Fundo do projeto especificamente:** o antigo texto "Personalizar" não existe mais em lugar nenhum do `document.body.textContent` visível.
- **Estabilidade do DOM:** `MutationObserver` prova que wrapper/input não são removidos/recriados/reparentados ao reagir aos SEUS PRÓPRIOS eventos `input`/`change`, nos três contextos.
- **Consistência HEX/Enter, nos três campos:** digitação progressiva não altera `customColorPalette.length`; pressionar Enter (`locator.press('Enter')`) aplica e soma exatamente `+1`; um `blur` seguido de `change` no MESMO valor não soma novamente (permanece `+1`, nunca `+2`).

**Não testado neste TC (fora do escopo automatizável):** a abertura efetiva da UI nativa de cores do Safari/iOS (roda/espectro/conta-gotas) — um agente headless não pode pilotar o picker do sistema operacional; a prova estrutural (Safari-safe: input real, não 1×1/off-screen, sem `.click()`) é coberta pelo Gate 3 acima e pelos gates herdados `E9F`/`E9F1`. `tests/smoke/export.spec.mjs` (WebKit macOS) não executado no ambiente de desenvolvimento (WebKit ausente); os usos de `#textCreationColor`/`#textBoxBackgroundColor` nesse arquivo dependem apenas de IDs preservados nesta PR.

## TC-052 — Painel de transformação em multi-seleção é invariante à ordem das ações (REG-053)

Gate `tests/smoke/app.spec.mjs`, `REG-053 — painel de transformação em multi-seleção é invariante à ordem das ações (390×797)`, viewport iPhone **390 × 797** (obrigatório para esta regressão). Fluxo 100% público: seleção por long-press/toque reais nas pills e abertura do grupo por toque real no MESMO botão visível que o usuário toca — nenhuma chamada direta a `openAlignSubmenu()`, `openCustBar()` ou `switchCustTab()` estabelece o estado principal do teste (elas só disparam indiretamente, dentro dos handlers reais dos botões clicados). Grupos testados: Rotação, Escala, Mover e Pausa (mesmo shell inferior). Falha na base pré-`v8z4b32E9F3` e passa após a correção — inclusive acionado pelo fluxo público, não apenas pelas funções internas.

- **FLUXO A (quebra na base):** sem painel expandido, selecionar F1 por long-press público na pill, selecionar F2 por toque público na pill (`toggleFrameSelection` real via evento de pointer/click) e SÓ DEPOIS tocar no botão visível do grupo dentro de `#alignBarActions` (`page.locator('#alignBarActions button.ab-tab').filter({hasText: label}).click()` — mesmo `<button>` que o usuário toca em multi-seleção; internamente aciona `openAlignSubmenu(group)`, mas o teste nunca chama essa função diretamente).
- **FLUXO B (não quebra na base):** tocar no botão visível do grupo dentro de `#toolbar .tb-item.ctx-frame` com F1 ativo (`page.locator('#toolbar .tb-item.ctx-frame').filter({hasText: label}).click()` — mesmo elemento que o usuário toca com 1 Frame; internamente aciona `openCustBarTabFromBottom(tab) → openCustBar() → switchCustTab(tab)`, sem chamada direta a essas funções no teste), painel normal abre pelo caminho real, mantê-lo aberto, e SÓ DEPOIS selecionar F1+F2 pelo mesmo fluxo público de long-press/toque nas pills.
- **Critérios de aceite aplicados a CADA estado (A e B), para CADA grupo:**
  - o submenu real reportado por `lowerContextVisiblePanel` (via `buildDiagnosticsText()`) está entre `alignBarSubmenu`/`custBarContent` (nunca `none`/`toolbar`/`alignBarPrimary`);
  - `lowerContextCompetingPanelsDetected === 'false'` (nenhum painel concorrente intercepta pointer);
  - `lowerContextClippingDetected === 'false'` (nenhuma área é cortada por overflow de um ancestral);
  - o `getBoundingClientRect()` do painel real está inteiramente dentro do viewport (390×797) e não invade `#pillsRow`;
  - o botão Voltar (`#alignBarBack` ou `#custBarBack`, conforme o painel ativo) está visível e inteiramente dentro do viewport.
- **Equivalência A×B:** mesma seleção final (`[F1,F2]`) nos dois fluxos; o retângulo real do painel (`#alignBarSubmenu` em A, `#custBarContent` em B) é geometricamente equivalente entre A e B (tolerância de 2 px em top/bottom/left/right) — MESMA seleção + MESMA transformação + ORDEM diferente ⇒ MESMA apresentação.
- **Causa comprovada por reprodução direta na main:** `#lowerContextSheetShell`/`#lowerContextSlot` só recebiam a expansão estrutural de grid (linhas 3/5, `overflow:visible`) para `cust-expanded`/`asset-context-panel-open`; em `align-submenu-open` permaneciam confinados à Linha 4 (46px) com `overflow:hidden` herdado de `.lower-cell`, cortando a parte superior de `#alignBarSubmenu` (inclusive Voltar) sempre que a multi-seleção precedia a abertura do painel.
- **Correção:** a mesma expansão estrutural do ancestral (já usada e aprovada pelo custBar desde a série E8U–E8V) passa a valer também para `body.align-submenu-open`; `#alignBarSubmenu` deixa de depender do deslocamento horizontal pensado para um ancestral estreito (agora full-width) e ancora pelo topo, com paridade de gap em relação ao custBar. Nenhuma segunda apresentação paralela foi criada.
- **Não altera:** REG-052 (fill dos sliders), REG-054 (targets/matemática de Posição/Escala/Rotação em multi-seleção, gate TC-051 continua passando), Undo/Redo, Preview/Export, Stage, timeline.
- **Ambiente:** WebKit é o gate obrigatório (checks do HEAD final); verificação equivalente local executada em **Chromium `hasTouch`** (passa pelo fluxo público; falha comprovadamente na CSS pré-correção mesmo acionado pelo fluxo público, validando que o gate detecta a regressão real e não apenas um atalho interno). Validação física obrigatória em iPhone/Safari **pendente** (Roberto, após merge e publicação da build, conforme `docs/APPROVAL_WORKFLOW.md`), repetindo Rotação/Escala/Posição/Pausa nos dois fluxos A e B.

## TC-051 — Multi-seleção de Frames aplica Posição/Escala/Rotação a todos os selecionados (REG-054)

Gate `tests/smoke/app.spec.mjs`, `REG-054 — multi-seleção de Frames aplica Posição/Escala/Rotação a todos os selecionados sem Global`, viewport iPhone 390 × 844. Fluxo público: seleção por long-press/toque nas pills; controles públicos do menu contextual de Frame (custBar). Falha na `v8z4b32E9F1` (só o Frame ativo muda) e passa na `v8z4b32E9F2`.

- **Caso A — dois Frames (F1,F2) selecionados, F3 fora, Global desligado:**
  - **Posição** (`nudgePos`) aplica o **mesmo delta** a F1 e F2 (distâncias relativas preservadas); F3 intacto; seleção permanece `[F1,F2]`; Global permanece desligado.
  - **Escala** (`nudgeScale`) aumenta a largura de F1 e F2 (delta percentual relativo à própria escala, sem igualar); F3 intacto; seleção mantida.
  - **Rotação** (`nudgeRotation`) aplica o mesmo delta a F1 e F2; F3 intacto; seleção mantida; todos os valores finitos.
- **Caso A' — Undo/Redo consolidado:** uma sessão contínua de drag do slider de Escala produz **exatamente 1 Undo**; Undo restaura AMBOS os Frames; Redo reaplica AMBOS. Limpar a seleção não altera a geometria (mutação vive no modelo real consumido por Preview/Export, não em overlay de seleção).
- **Captura de Undo por alvos efetivos (revisão PR #505):** cenário-armadilha com `activeIdx=F1` **travado** e fora da seleção, F2/F3 selecionados/destravados, F4 fora, Global desligado. O gesto REAL do slider (incluindo o capturador de Undo real) de **Rotação** e de **Escala** altera F2 e F3, mantém F1(travado)/F4 intactos, captura **exatamente 1 Undo** que restaura F2/F3 (Redo reaplica) e preserva a seleção. Protege contra "mutação sem snapshot de Undo" quando o capturador dependia só de `activeIdx`.
- **Gesto contínuo multi-input (2ª revisão PR #505):** no mesmo cenário-armadilha, o drag REAL emite **vários eventos input** (mousedown → +10 → +20 → +30 → change). O estado final de F2/F3 corresponde ao **deslocamento líquido +30** do slider, **não** à soma dos deltas intermediários (+60), tanto em Rotação quanto em Escala; exatamente 1 Undo; e um gesto de **1 input direto** produz o mesmo estado final que o **multi-input** equivalente (tolerância numérica). Cobre a realidade de Safari/iPhone, que emitem muitos eventos input por drag.
- **Zero alvos editáveis:** `activeIdx=F1` travado, sem seleção, Global desligado — o gesto (multi-input) de Rotação/Escala **não altera nada e não cria Undo**.
- **Caso D — seleção simples (sem multi-seleção):** só o Frame ativo muda; demais intactos (não regride).
- **Caso E — Global ligado:** afeta todos os Frames elegíveis (semântica global preservada; distinta da multi-seleção).
- **Caso C — “Selecionar todos” sem Global:** todos os Frames entram na seleção e recebem a transformação sem Global.
- **Frame travado:** com F2 travado na seleção `{F1,F2,F3}`, F1 e F3 mudam e F2 (travado) permanece intacto — regra de lock preservada.
- **Ambiente:** WebKit é o gate obrigatório (checks do HEAD final); verificação equivalente local executada em **Chromium `hasTouch`** (passa). Validação física obrigatória em iPhone/Safari **pendente** (Roberto).

## TC-050 — Refino do editor de Text Asset (E9F1)

Gate `tests/smoke/app.spec.mjs`, `E9F1 — refino do editor de texto: cabeçalho compacto, ícones, paletas, viewport e largura`, viewport iPhone 390 × 797, Testes 1–11:

- **1) Cabeçalho compacto:** × e ✓ presentes; gaps reais (`getBoundingClientRect`) alça→ações e ações→rail compactos e sem sobreposição; alça e linha de ações com altura compacta (catch da regressão do vazio da E9F); touch targets ≥ 44 px; diagnósticos coerentes com as medidas.
- **2) Ícone de Estilo:** ferramenta Estilo presente, `aria-label="Estilo"`, ícone `#i-text-bold-italic` (não o antigo `#i-text-style`), símbolo com composição B+I (≥ 4 traços), sem label textual na rail.
- **3) Alinhamento dinâmico:** novo texto center → rail `align-text-center`; selecionar Esquerda/Direita atualiza `pendingTextDraft.textAlign`, o `textAlign` computado no Stage e o ícone da rail; voltar a Centro restaura `align-text-center`.
- **4) Quick palette de texto:** múltiplos swatches incluindo preto/branco e um cinza existente; botão `+` (`aria-label` "Escolher outra cor do texto"); selecionar preset encadeia controle → `pendingTextDraft.color` → computed color do Stage; exatamente um swatch atual selecionado; picker completo acessível.
- **5) Fundo transparente:** novo texto com `boxBackgroundEnabled===false`, swatch "Sem cor/Transparente" selecionado (`aria-label` "Sem cor", `title` "Transparente") e slider de opacidade oculto; ícone da rail `#i-box-fill`; escolher cor → `enabled===true`, cor aplicada, slider visível; mudar alpha → alpha do fundo muda e opacidade dos glifos permanece 1; voltar a "Sem cor" → fundo some, slider some, texto inalterado, glifos intactos.
- **6) Fundo e texto compartilham presets:** a constante única `PROJECT_BG_NEUTRALS` existe; os swatches do Fundo do PROJETO derivam dela; os neutros de Cor do texto e de Fundo da caixa são exatamente essa lista; as três não são cópias independentes.
- **7) Viewport ao editar existente:** captura geometria canônica (`worldX/worldY/worldW/worldH/rotation/depth/zIndex`), Frames, ProjectWorld, Undo e revisão de autosave; leva o texto para perto do rodapé por pan; abre a edição e localiza a vista; exige o texto (e a seleção) dentro da área visível acima da sheet, geometria canônica byte/valor-equivalente, Frames/ProjectWorld/Undo/autosave iguais e zoom preservado; reduz a altura disponível (teclado) e reexige visibilidade sem jitter (segunda chamada não altera o pan).
- **8) Create mode não regrediu (E9E):** com pan aplicado, novo texto nasce no centro da vista atual (`getEditorViewCenterWorld`), distinto do centro da célula base.
- **9) Largura Auto + slider:** exatamente um botão de modo (Auto), slider (step 5) e valor; sem botão Fixa nem stepper −/+; estado inicial Auto ativo; mover o slider → `fixed`, `boxWidth` muda, Auto perde ativo, Stage/ seleção/quatro alças acompanham; tocar Auto → `auto`, ativo, medição canônica, sem salto de centro; diagnósticos de ativação de fixed e restauração de auto coerentes.
- **10) E9G não vazou:** exatamente quatro alças `tl/tr/bl/br`; nenhuma alça lateral.
- **11) Cancel/Confirm/Minimize:** minimizar por gesto preserva draft, ID e propriedade ativa com zero Undo/autosave; Cancel descarta sem commit/Undo/autosave; Confirm cria exatamente 1 Undo + 1 revisão, mesmo ID e sem salto (seleção sobre o asset).
- **Ambiente:** WebKit é o gate obrigatório (checks do HEAD final); verificação equivalente local executada em **Chromium `hasTouch`** — E9F1, E8Z, E9C, E9D, E9E e E9F passam; E9B depende de gesto multi-touch imagem×texto não reproduzível em Chromium (falha idêntica na base) e o smoke inicial registra um 404 de recurso de rede também presente na base; ambos validam no WebKit CI.
- **Validação final (atualizado 2026-08-19):** a validação física obrigatória em **iPhone/Safari** da build publicada `v8z4b32E9F1` (PR #500, merge commit `6739dbc018f335ad6b1faead6de4f4469e5ebf78`) foi **realizada e APROVADA por Roberto em 2026-08-19**. O requisito de validação física em iPhone/Safari permanece obrigatório para regressões futuras. Nenhuma promoção autorizada.

## TC-049 — Editor de Text Asset iconográfico neutro (E9F)

Gate `tests/smoke/app.spec.mjs`, `E9F — editor de texto iconográfico neutro: rail, paleta, coral, gestos e draft`, viewport iPhone 390 × 797:

- **A) Rail iconográfica:** nenhuma tab textual principal; rail com 7 tabs sem texto visível e `aria-label` na ordem editar texto/fonte/estilo/alinhamento/cor do texto/fundo da caixa/largura da caixa; cada item tem SVG; rail em uma única linha (mesmo topo, `flex-wrap:nowrap`) com overflow horizontal disponível (`scrollWidth > clientWidth`); exatamente um item ativo; tocar em cada ícone mostra SOMENTE o painel correspondente.
- **B) Estado ativo neutro:** por `computedStyle`, item ativo com superfície branca e ícone escuro; item inativo neutro escuro; ativo NÃO usa `#FF6B8A`/ciano/verde.
- **C) Superfícies:** sheet `#303238`; campo de texto `#393C43` e diferente da sheet; chrome/UI principal `#24262B` (via `#topBar`, não `DEFAULT_PROJECT_BG`).
- **D) Ativos/Frames:** `--accent` de `body.editor-assets` = `#ff6b8a`; `--accent` de `:root` (Frames) = `#04fff2`; `DEFAULT_PROJECT_BG` = `#3c3c3b` intacto.
- **E) Navegação de propriedades:** percorrer texto→fonte→estilo→alinhamento→cor→fundo→largura; cada alteração reflete no `pendingTextDraft` e no Stage imediatamente; seleção/quatro alças acompanham; retornar ao painel mostra o valor atual do draft.
- **F) Alinhamento:** três controles iconográficos com `aria-label` (Alinhar Esquerda/Centro/Direita), sem texto visível; alterar reflete em `textAlign`.
- **G) Fundo:** enable + cor + opacidade + percent no MESMO painel; alterar a opacidade do fundo não reduz a opacidade dos glifos (alpha do texto permanece 1).
- **H) Largura:** Auto e Fixa acessíveis; stepper visível somente no modo Fixa; alternância e stepper funcionam (E9C intacta).
- **I) Minimizar por gesto:** arrasto vertical para baixo sobre a alça (`#textCreationDrag`, via pointer events reais) minimiza; `pendingTextDraft` persiste com mesmo ID e campos idênticos; Undo e revisão de autosave inalterados; reabrir restaura exatamente o draft.
- **J) Conflito de gestos:** swipe horizontal sobre a rail desloca a rail e NÃO minimiza (draft permanece); o slider de opacidade funciona e não arrasta a sheet.
- **K) Cancelar/Confirmar:** Cancelar descarta o draft sem commit/Undo/autosave; Confirmar mantém o mesmo ID, cria exatamente 1 Undo e 1 revisão e o estado visível coincide com o persistido.
- **L) Quatro alças:** exatamente `tl/tr/bl/br`; nenhuma alça lateral E9G.
- **Ambiente:** WebKit é o gate obrigatório (checks do HEAD final); verificação equivalente local executada em Chromium `hasTouch` com binário do ambiente. E9F, E8Z, E9A, E9C, E9D e E9E passam nessa verificação; E9B depende de um gesto multi-touch de seleção imagem×texto que não reproduz em Chromium (falha idêntica na base pré-E9F) e deve ser validado no WebKit CI. Validação visual final em iPhone/Safari real permanece obrigatória; nenhuma promoção autorizada.

## TC-048 — Centralização na vista atual e WYSIWYG ao vivo (E9E)

- Gate de centralização (`tests/smoke/app.spec.mjs`, `E9E — novo Text Asset nasce no centro da vista atual`):
  - Caso A (vista padrão): sem pan/zoom, o centro da vista coincide com o centro base e o draft nasce nesse centro.
  - Caso B (vista deslocada por pan): o centro da vista difere claramente do centro base; o draft nasce na região enquadrada e NÃO no centro base — reprova o comportamento pré-E9E.
  - Caso C (zoom diferente): com zoom ≠ 1 e pan, o draft continua nascendo no centro da vista corrente.
  - Caso D (teclado): o centro é capturado ANTES do resize; reduzir a viewport (simulando o teclado) e disparar `resize` não recalcula o ponto inicial do draft.
  - Caso E (editar existente): posicionar um Text Asset confirmado fora do centro, editar o conteúdo e confirmar não recentraliza — o centro permanece e não salta para o centro da vista.
  - A vista de referência é medida pela MESMA cadeia canônica pré-existente (`computeEditorTransform → screenToStageCoord → editorStageToWorld`), independente do helper novo.
- Gate de WYSIWYG ao vivo (`E9E — WYSIWYG: painel, Stage, fundo, seleção e alças refletem o mesmo draft`):
  - Cenário determinístico único percorrendo: criar, digitar curto, texto mais longo, alinhamento, Auto/Fixa, largura fixa, fonte, peso/itálico, cor do texto, ligar fundo, cor do fundo, opacidade, minimizar, reabrir e confirmar.
  - Em cada operação exige `panelState == pendingTextDraft` (campo, alinhamento, fonte, modo/valor de largura, fundo/cor/opacidade e cor do texto) e a coincidência das geometrias reais: DOM textual == retângulo de seleção, exatamente quatro alças coladas nos cantos e fundo acompanhando o estado do draft.
  - Minimizar mantém o draft vivo; reabrir restaura exatamente o mesmo draft; confirmar não causa salto (o retângulo confirmado coincide com o do draft imediatamente anterior).
- Ambiente: WebKit automatizado (verificação equivalente executada em Chromium `hasTouch` com binário local, pois o WebKit não está disponível no ambiente); validação visual final em iPhone/Safari real permanece obrigatória e nenhuma promoção está autorizada.

## TC-047 — Regressão e editor tipográfico E9D

- Criar publicamente `R` e `Texto`; exigir ID do draft preservado na confirmação, uma camada, modo Auto, uma linha horizontal e largura natural + 1 px canônico.
- Em Auto, Enter cria linhas explícitas e a maior define a largura; em Fixa, o stepper altera a largura e força wrap automático. Verificar esquerda/centro/direita.
- Editar, alterar e tocar a alça: sheet fecha, draft permanece apenas em memória, Undo/autosave/payload confirmado não mudam; Editar reabre o mesmo draft. `×` restaura o original; `✓` alterado gera exatamente um Undo/revisão no mesmo ID.
- Verificar Save/Load, Session Restore, fundo + depth, seleção/hit-test/quatro alças, toque simples, dois taps, teclado e paridade Stage/Preview/Export/H.264.
- Ambiente: WebKit automatizado e iPhone/Safari real obrigatório para aprovação visual final.

## TC-045 — paridade de paralaxe do Text Asset no Stage (E9B)

- Em viewport 390 × 797, abrir projeto com imagem e Frames, dispensar o modal Pro, entrar em Ativos, criar texto com fundo e manter a seleção.
- Aplicar profundidades `+42` e `-37` pelo controle público; exigir deslocamento real e idêntico de glifos, fundo, seleção e quatro abas, hit-test no centro deslocado e ausência de captura na posição antiga.
- Exigir tolerância DOM/seleção menor que 1 px, exatamente um Undo/revisão por gesto confirmado e nenhum Undo/autosave por redraw, troca de modo/frame, pan ou zoom.
- Exigir geometria, `boxWidth`, zIndex, Frames, curvas e ProjectWorld canônicos invariantes; Undo/Redo, Preview, Export H.264 real, Save/Load e Session Restore devem preservar a paridade.
- Evidência automatizada inicial: `tests/smoke/app.spec.mjs`. Validação visual final em iPhone/Safari físico permanece obrigatória e nenhuma promoção está autorizada.

## TC-044 — Persistência da Profundidade em Text Assets E9A

- Criar e selecionar texto pelo fluxo público; no painel Profundidade confirmar `42` e `-37`, exigindo igualdade no modelo, slider e payload serializado após medição, redraw, reconstrução do Stage e sincronização.
- Mover, escalar, rotacionar, trocar frame/timeline e modo, e reordenar camada sem perder `depth`; alterar profundidade não muda `zIndex`, Frames, curvas ou ProjectWorld.
- Cada gesto confirmado cria exatamente um Undo e uma revisão de Session Autosave; Undo/Redo reencontram o asset por ID e restauram os valores. Redraw/Preview/sincronização sem mutação não criam revisão.
- Manual Save/Load e checkpoint IndexedDB/Session Restore preservam profundidade, rotação, ordem e geometria canônica. Ausência, `NaN`, infinitos e inválidos viram zero; finitos positivos/negativos sobrevivem; imagens não regridem.
- Com câmera deslocada, Stage, Preview e Export mantêm paridade de parallax, hit-test/contorno/alças e não persistem geometria aparente. O Export H.264 real inclui Text Asset com `depth = 42`, sem omissões ou overlays.
- Ambiente: WebKit automatizado e gate H.264 real no macOS; validação publicada final em iPhone/Safari real pendente.

## TC-038 — Criação e persistência de Text Asset

- Pré-condição: projeto com imagem aberto no Modo Ativos.
- Passos: criar e cancelar drafts; confirmar texto com cor e quebra automática; mover/escalar/rotacionar/reordenar; executar Save/Load, Session Restore, Preview e Export; repetir criação com resize do teclado.
- Resultado esperado: somente OK cria uma layer, o texto permanece canônico/editável e Stage/Preview/Export mantêm conteúdo, cor, geometria e zIndex; Cancelar não muta o projeto; resize não altera Frames, ProjectWorld ou ativos anteriores.
- Evidência: smoke WebKit E8X, JSON/checkpoint, amostras Canvas e validação publicada em iPhone/Safari real.
- Ambiente: WebKit automatizado e iPhone/Safari real obrigatório para aprovação final.

Formato: pré-condição, passos, resultado esperado, evidência, ambiente e automatizável.

## TC-001 — Abertura do app

- Pré-condição: app publicado ou servido localmente.
- Passos: abrir o app.
- Resultado esperado: app carrega sem erro fatal.
- Evidência: screenshot e console.
- Ambiente: desktop e iPhone/Safari quando aplicável.
- Automatizável: sim.
- Cobertura OPS-03: parcial; o smoke test WebKit abre `/`, valida render inicial básico e gera screenshot, sem substituir Safari/iPhone real.

## TC-002 — Ausência de textos técnicos visíveis

- Pré-condição: app aberto.
- Passos: navegar telas, menus e painéis principais.
- Resultado esperado: nenhum prompt, changelog ou bloco técnico aparece na UI.
- Evidência: screenshots e busca DOM.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-003 — Importação de imagem

- Pré-condição: app aberto sem projeto.
- Passos: importar uma imagem.
- Resultado esperado: imagem aparece e app entra no fluxo aprovado, mantendo Câmera/Frames.
- Evidência: screenshot.
- Ambiente: iPhone/Safari prioritário.
- Automatizável: parcial.

## TC-004 — Projeto com múltiplos assets

- Pré-condição: projeto com assets múltiplos.
- Passos: carregar ou montar projeto.
- Resultado esperado: todos os assets esperados aparecem.
- Evidência: contagem e screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: sim.

## TC-005 — Contagem modelo × Stage

- Pré-condição: projeto com múltiplos assets.
- Passos: comparar quantidade no modelo com Stage.
- Resultado esperado: Stage não omite asset visível esperado.
- Evidência: log/DOM/screenshot.
- Ambiente: desktop.
- Automatizável: sim.

## TC-006 — Seleção direta

- Pré-condição: Stage com asset/frame selecionável.
- Passos: tocar/clicar diretamente no Stage.
- Resultado esperado: item correto é selecionado.
- Evidência: screenshot e estado.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-007 — Seleção por Layers

- Pré-condição: painel Layers disponível com múltiplos assets.
- Passos: selecionar item por Layers.
- Resultado esperado: seleção sincroniza com Stage.
- Evidência: screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: sim.

## TC-008 — Reorder

- Pré-condição: múltiplos layers.
- Passos: reordenar layers.
- Resultado esperado: ordem visual e modelo ficam consistentes.
- Evidência: antes/depois.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-009 — Visibilidade

- Pré-condição: múltiplos layers.
- Passos: alternar visibilidade.
- Resultado esperado: Stage/Preview/Export respeitam visibilidade.
- Evidência: screenshots.
- Ambiente: desktop.
- Automatizável: parcial.

## TC-010 — Troca de imagem

- Pré-condição: asset existente.
- Passos: trocar imagem alvo.
- Resultado esperado: asset correto é substituído sem criar camada indevida.
- Evidência: contagem e screenshot.
- Ambiente: iPhone/Safari prioritário.
- Automatizável: parcial.

## TC-011 — Alternância Ativos/Câmera

- Pré-condição: projeto carregado.
- Passos: alternar entre Ativos/Mundo e Câmera/Frames.
- Resultado esperado: estado visual e seleção permanecem coerentes.
- Evidência: screenshots.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: sim.

## TC-012 — Frame central

- Pré-condição: projeto com frames.
- Passos: selecionar frame central.
- Resultado esperado: frame central destaca corretamente.
- Evidência: screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-013 — Diagnóstico

- Pré-condição: app aberto.
- Passos: abrir Diagnóstico.
- Resultado esperado: painel abre e não interfere no fluxo.
- Evidência: screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: sim.

## TC-014 — Save/Load

- Pré-condição: projeto com assets, layers e frames.
- Passos: salvar, recarregar e comparar.
- Resultado esperado: estado essencial é restaurado.
- Evidência: arquivo salvo e screenshots.
- Ambiente: desktop.
- Automatizável: sim.

## TC-015 — Preview

- Pré-condição: projeto válido.
- Passos: abrir Preview.
- Resultado esperado: Preview reproduz sem erro fatal.
- Evidência: screenshot/log.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-016 — Export

- Pré-condição: projeto válido.
- Passos: exportar MP4.
- Resultado esperado: arquivo é gerado ou falha é reportada de modo controlado.
- Evidência: arquivo/log.
- Ambiente: desktop e Safari quando aplicável.
- Automatizável: parcial.

## TC-017 — Consistência Preview/Export

- Pré-condição: Preview e Export executados.
- Passos: comparar frames amostrados.
- Resultado esperado: sem divergência visual relevante.
- Evidência: capturas comparadas.
- Ambiente: desktop.
- Automatizável: futuro.

## TC-018 — PNG com alpha

- Pré-condição: fixture PNG com transparência.
- Passos: importar e visualizar.
- Resultado esperado: alpha/scrim são preservados conforme comportamento aprovado.
- Evidência: screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-019 — Projeto com 14 ou mais frames

- Pré-condição: projeto fixture com 14+ frames.
- Passos: carregar, navegar timeline, Preview e Save/Load.
- Resultado esperado: frames e tempos permanecem consistentes.
- Evidência: screenshot/log.
- Ambiente: desktop.
- Automatizável: sim.

## TC-020 — Rotação, escala e movimento

- Pré-condição: projeto com frames editáveis.
- Passos: alterar rotação, escala e movimento.
- Resultado esperado: Stage, Preview e Export preservam a intenção.
- Evidência: screenshots/vídeo.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-021 — Console sem erro fatal

- Pré-condição: fluxo crítico em execução.
- Passos: abrir console durante abertura, load, preview e export.
- Resultado esperado: nenhum erro fatal não tratado.
- Evidência: log.
- Ambiente: desktop.
- Automatizável: sim.
- Cobertura OPS-03: parcial; o smoke test WebKit captura `pageerror` e `console.error` somente durante a abertura inicial, sem cobrir load, preview ou export.

## TC-022 — Escala global preserva curvas

- Pré-condição: projeto com Template Circular ou curva manual visível.
- Passos: editar curva manualmente, abrir escala, ativar Global e alterar escala.
- Resultado esperado: tamanho dos frames muda, mas a curva não se move, não reseta e não é recriada.
- Evidência: screenshot antes/depois e comparação do estado de curva.
- Ambiente: desktop e iPhone/Safari quando aplicável.
- Automatizável: sim.

## TC-023 — Escala após Load preserva curvas

- Pré-condição: projeto salvo com curva manual.
- Passos: carregar projeto, alterar escala de frame ou escala global.
- Resultado esperado: curva carregada permanece igual após ajuste de escala.
- Evidência: arquivo fixture, screenshot antes/depois e comparação do estado de curva.
- Ambiente: desktop e iPhone/Safari quando aplicável.
- Automatizável: sim.

## TC-024 — Pipeline principal de Export

- Pré-condição: projeto válido para exportação.
- Passos: revisar caminho de export e gerar MP4.
- Resultado esperado: export principal usa WebCodecs no caminho Canvas → VideoFrame → VideoEncoder → MP4; `captureStream + MediaRecorder` não substitui o pipeline principal.
- Evidência: inspeção estática, logs de export e arquivo gerado quando possível.
- Ambiente: desktop/Safari conforme suporte.
- Automatizável: parcial.

## TC-025 — Session Autosave/Restore integral

- Pré-condição: projeto complexo com múltiplas imagens, Layers persistentes, transformações, frames, curvas e tempos.
- Passos: editar; aguardar debounce; recarregar/descartar a página; reabrir; comparar estado; executar Preview e Export; fazer Load manual de outro projeto e recarregar; criar Novo Projeto e recarregar.
- Resultado esperado: somente checkpoint completo e íntegro é restaurado; todos os assets hidratam; identidades e `nextLayerSequence` permanecem; Load manual vira a sessão corrente; Novo Projeto elimina a sessão anterior.
- Evidência: diagnósticos Session Autosave/Restore, comparação do projeto e execução de Preview/Export.
- Ambiente: WebKit automatizado e iPhone/Safari real obrigatório para aprovação final.
- Automatizável: parcial; guardrail estático cobre arquitetura, integridade e precedência, mas o ciclo real permanece obrigatório.


## TC-026 — Primeiro frame do Preview confirmado antes do relógio

- Pré-condição: projeto simples válido no início da timeline.
- Passos: abrir o Preview; observar os primeiros segundos; fechar; repetir a abertura pelo menos três vezes.
- Resultado esperado: `t=0` é renderizado e composto antes do relógio/loop, loading só desaparece após a confirmação e não há travada inicial perceptível.
- Evidência: diagnósticos de ordem do warm-up e vídeo/observação das repetições.
- Ambiente: iPhone/Safari real obrigatório para aprovação visual; guardrail estático como evidência técnica complementar.
- Automatizável: parcial.

## TC-027 — Primeiro frame após Session Restore

- Pré-condição: projeto complexo restaurado por Session Restore, com múltiplos assets, frames e camadas íntegros.
- Passos: iniciar o Preview imediatamente após a restauração; fechar e reabrir três vezes; durante outra tentativa, fechar rapidamente no loading e abrir novamente.
- Resultado esperado: todos os assets permanecem visíveis; não há travada inicial; cancelamento invalida callbacks antigos e libera nova tentativa sem reload.
- Evidência: comparação do projeto, diagnósticos de token/retry e observação do Preview.
- Ambiente: iPhone/Safari real obrigatório.
- Automatizável: parcial.

## TC-028 — Isolamento Session Autosave × Preview/Export

- Pré-condição: projeto com checkpoint grande; fake timers/harness disponível para evidência automatizada.
- Passos: (1) editar e abrir Preview antes de 700 ms; (2) abrir/fechar Preview sem editar; (3) acumular várias mutações; (4) ocultar/disparar `pagehide` durante Preview; (5) repetir durante Export; (6) executar Session Restore, Novo Projeto e Load manual; (7) concluir escala e rotação pelos controles reais de canto do Frame, repetir com toque simples, retorno ao valor inicial, ghost e vários `pointermove`; (8) provocar saída por `recCanvas` inválido e erro de cleanup pós-export; (9) alterar o projeto, salvar, executar Reset e salvar novamente; (10) trocar 9:16 → 1:1 e tocar novamente em 1:1.
- Resultado esperado: nenhum build/write normal durante playback; após fechar, exatamente um checkpoint da revisão mais recente; Play não altera revisão; flush de segurança persiste; cada transformação real cria uma revisão somente ao soltar; saídas completas do Export retomam uma vez o checkpoint; Reset aplicado cria uma revisão com o baseline final, mas Reset sem diferença não cria; troca real de formato cria uma revisão depois da normalização, mas formato já ativo não cria Undo nem revisão.
- Evidência: `node scripts/qa/check-session-autosave-preview-isolation.mjs`, `node scripts/qa/test-session-autosave-preview-isolation.mjs` e diagnósticos `sessionAutosave*`.
- Ambiente: harness Node; WebKit CI; iPhone/Safari real obrigatório com projetos de 4 e 9 ativos para aprovação visual.
- Automatizável: parcial; concorrência lógica automatizada, percepção visual real pendente.

## TC-029 — Escolha de recarga e intenção de startup de uso único

- Pré-condição: launcher sem checkpoint e projeto complexo com checkpoint grande disponíveis em execuções separadas.
- Passos: abrir Recarregar pelo launcher e pelo menu; cancelar por X, toque fora e Escape; restaurar imediatamente após uma mutação; repetir com dois toques; reiniciar do zero; fechar e reabrir o PWA; simular falhas de escrita e exclusão no IndexedDB.
- Resultado esperado: nenhuma recarga ocorre sem escolha; restore preserva a última revisão completa; clean abre o launcher e a sessão antiga não reaparece; operações duplicadas são bloqueadas; falhas mantêm a tela atual e permitem nova tentativa; arquivos manuais não são alterados.
- Evidência: `node scripts/qa/test-reload-session-choice.mjs`, diagnósticos observáveis `reload*`, comparação integral do projeto, console sem erro fatal, inspeção visual de tela branca/HTML bruto e arquivo JSON manual ainda acessível.
- Ambiente: WebKit automatizado e iPhone/Safari/PWA instalado obrigatório para aprovação final.
- Automatizável: parcial; guardrail estático cobre a sequência arquitetural e WebKit cobre o modal, mas IndexedDB/PWA e preservação visual integral exigem teste real.

## TC-030 — Escolha de recuperação na abertura normal

- Pré-condição: execuções separadas sem checkpoint, com checkpoint íntegro, com checkpoint corrompido e com intenções explícitas `restore`/`clean` da E8H.
- Passos: abrir nova instância; observar launcher antes da escolha; testar Continuar, Começar novo projeto, falhas e toques concorrentes; recarregar após descarte; alternar para outro app e voltar com a mesma instância viva.
- Resultado esperado: somente checkpoint válido sem intenção E8H abre o modal; nenhuma hidratação/aplicação acontece antes da escolha; restore e clear executam uma vez e são mutuamente exclusivos; falhas permitem retry sem destruir o checkpoint; mesma instância viva não pergunta novamente.
- Evidência: `node scripts/qa/check-startup-session-choice.mjs`, `node scripts/qa/test-startup-session-choice.mjs` sobre funções reais extraídas do app, WebKit com IndexedDB/schema/store/chave/checksum reais, feedback “Recuperando sessão…”/“Preparando novo projeto…” e validação publicada em iPhone/Safari/PWA.
- Ambiente: harness Node, WebKit automatizado e iPhone/Safari/PWA real obrigatório para aprovação final.
- Automatizável: parcial; encerramento real do processo, persistência grande, arquivos manuais, Preview e Export exigem validação no aparelho.

## TC-031 — Painéis contextuais, seleção de Ativo e troca de modo

- Pré-condição: projeto com Frames e ao menos um asset; viewport de 390 px.
- Passos: abrir cada slider de Frame; selecionar asset e abrir Escala/Rotação/Profundidade; voltar; limpar seleção; tentar as ações; abrir painel em um modo e trocar para o outro.
- Resultado esperado: bottom sheet full-width sem resíduo ou título de Ativo; Rotação contém slider, valor, -5°, +5° e Reset; ações ficam disabled sem alvo; nenhum painel abre sem seleção; troca de modo fecha o painel anterior.
- Evidência: smoke WebKit, inspeção DOM/estilos e screenshots em iPhone/Safari real.
- Ambiente: WebKit automatizado e iPhone/Safari real obrigatório para aprovação visual.
- Automatizável: parcial.

## TC-032 — Eixo central da timeline e identidade pronta de Preview/Export

- Pré-condição: projeto com primeiro, intermediário e último frame; Preview/Export disponível.
- Passos: navegar por tap, scroll e centralização programática nos dois modos; medir ponto e eixo fixo; gerar MP4 a partir dos dois modos.
- Resultado esperado: delta horizontal do ponto igual a zero; check, texto e download prontos em ciano próprio, sem verde legado ou vazamento roxo/ciano do modo; download funcional preservado.
- Evidência: medidas DOM, smoke WebKit e validação real do MP4 no iPhone/Safari.
- Ambiente: viewport 390 px, WebKit automatizado e iPhone/Safari real.
- Automatizável: parcial.

## TC-033 — Ausência de verde na interface do Arco

- Pré-condição: app aberto com projeto válido; conteúdo do usuário claramente distinguível do chrome/interface do aplicativo.
- Passos: (1) abrir o app; (2) navegar pelo launcher/editor quando aplicável; (3) alternar entre Câmera/Frames e Ativos; (4) selecionar Ativos; (5) abrir Layers; (6) abrir painéis contextuais; (7) navegar na timeline; (8) observar sliders, botões e controles; (9) abrir Preview; (10) chegar ao estado pronto de Preview/Export; (11) observar checks, textos, ícones, botões de download e feedbacks próprios do aplicativo.
- Resultado esperado: nenhum elemento produzido pela própria interface do Arco é exibido em verde; Preview/Export pronto usa o ciano aprovado. Imagens ou outros assets do usuário podem conter verde e não constituem falha.
- Evidência: screenshots, inspeção visual, inspeção de estilos computados quando útil e validação publicada em iPhone/Safari real.
- Ambiente: iPhone/Safari real como referência de produto; WebKit automatizado apenas como evidência complementar.
- Automatizável: parcial/futuro. Não implementar heurística cromática genérica suscetível a falsos positivos em assets do usuário.

## TC-034 — Steps exclusivos dos painéis contextuais de Ativos

- Pré-condição: projeto com ao menos um asset selecionável no Modo Ativos; viewport de 390 px.
- Passos: medir no DOM os steps e Reset de Frames em Escala/Rotação; selecionar o asset e repetir as medidas nos painéis equivalentes; aplicar `+5%`/`−5%` e `+5°`/`−5°`; validar slider e valor; executar Undo/Redo; aplicar `+5%` duas vezes e Reset; alternar Escala → Rotação → Profundidade → Escala; fechar e reabrir; limpar a seleção e tentar abrir Escala.
- Resultado esperado: Escala exibe somente `−5%`/`+5%`, com delta aditivo exato de cinco pontos percentuais, uma alteração lógica por toque, sincronização imediata e Reset em 100%; Rotação exibe somente `-5°`/`+5°`, com delta exato de cinco graus; os steps e Reset de Ativos repetem altura, largura/min-width, padding, tipografia, raio, gap e posição vertical dos equivalentes de Frames com tolerância subpixel menor que 1 px; Profundidade não exibe steps; não há overflow em 390 px; a troca por `data-kind` não deixa painel ou handler residual; sem seleção o painel não abre.
- Evidência: estado real do asset, contagem de Undo, revisão de Session Autosave, `getBoundingClientRect()`, estilos computados, screenshot WebKit e validação publicada em iPhone/Safari real.
- Ambiente: WebKit automatizado e iPhone/Safari real obrigatório para aprovação visual.
- Automatizável: sim para DOM/estado/Undo/Redo/autosave; toque, espaçamento e Safe Area exigem validação real complementar.

## TC-035 — Fonte substituída persiste em arquivo e sessão

- Pré-condição: projeto com pelo menos três image assets, Frames/curvas e ProjectWorld definidos; asset alvo identificado por `asset.id`/identidade de camada; fontes A e B com fingerprints distintos.
- Passos: substituir somente o alvo A → B; comparar modelo canônico; executar Save → Load pelo pipeline oficial; aguardar hidratação; executar Autosave no IndexedDB real → Session Restore; executar Undo (A), Redo (B), salvar novamente e aguardar callbacks assíncronos.
- Resultado esperado: quantidade e fontes dos demais assets permanecem; `id`, `layerSequence`, `layerName`, `zIndex`, slot, visibilidade, Frames, curvas e ProjectWorld não mudam; fingerprint B aparece no modelo, payload manual, Load, checkpoint e Session Restore; Undo persiste A e Redo persiste B; callback stale não restaura A; PNG mantém alpha quando usado.
- Evidência: `tests/smoke/app.spec.mjs`, fingerprints protegidos do Diagnóstico e inspeção do checkpoint real. Existência/tamanho de payload ou conclusão do load, sem igualdade de fingerprint, não é evidência suficiente.
- Ambiente: WebKit automatizado e iPhone/Safari real com projeto grande multiasset obrigatório para aprovação final.
- Automatizável: sim para round-trips e invariantes; validação publicada real da E8S aprovada por Roberto em 2026-08-08.

## TC-036 — Densidade e continuidade dos bottom sheets contextuais

- Pré-condição: projeto com Frame e asset selecionáveis; viewport 390 × 797.
- Passos: abrir Escala e Rotação em Frames e Ativos; medir steps, Reset e distância entre slider e linha de controles; verificar overflow; comparar o background do painel com a região até a borda inferior; fechar e reabrir cada painel.
- Resultado esperado: todos os controles compartilham altura máxima de 28 px, padding, tipografia, raio e alinhamento; a distância slider→controles é idêntica com tolerância subpixel; não há overflow; painel e rodapé usam a mesma superfície; Frames preserva ciano `#04fff2`, Ativos preserva roxo `#8b3fff`; abertura, fechamento, `−5`/`+5` e Reset continuam funcionais.
- Evidência: retângulos e estilos computados, screenshot WebKit complementar e teste publicado em iPhone/Safari real.
- Ambiente: WebKit automatizado em 390 × 797 e iPhone/Safari real.
- Automatizável: sim, exceto aprovação visual final e percepção da safe-area no aparelho real.

## TC-037 — Session Restore preserva paridade Frame/câmera

- Pré-condição: projeto ProjectWorld com três ou mais assets e três ou mais Frames, checkpoint IndexedDB real e viewport mobile variável.
- Passos: Manual Load; estabilizar; persistir checkpoint; alterar altura do viewport; reload; Continuar sessão; comparar todos os Frames; amostrar Preview em cada waypoint; abrir Save, disparar resize equivalente ao teclado do iPhone e concluir o Save.
- Resultado esperado: checkpoint corresponde ao estado vivo; estado canônico pós-Restore é idêntico ao pré-fechamento; overlays e câmera coincidem com cada Frame com tolerância menor que 0,001; conversão Norm→Abs ocorre no máximo uma vez; Save/resize não altera modelo, overlays, câmera, curvas ou ProjectWorld.
- Evidência: teste WebKit E8W em `tests/smoke/app.spec.mjs` e sequência diagnóstica `restoreStep*`.
- Ambiente: WebKit automatizado; iPhone/Safari real obrigatório para validar fechamento/reabertura, teclado e visual viewport.
- Automatizável: sim para estado/geometria; ciclo real de processo e percepção visual exigem aparelho real.

### TC-038 — divisão permanente de gates E8X

- WebKit/Linux: criação, cancelamento, whitespace, transformações, Layers, Save/Load, Session Restore, ProjectWorld/Frames e Preview/composição por pixels.
- WebKit/macOS: preflight nativo sequencial `avc1.42001f`, `avc1.42E01E`, `avc1.4D401F` em 720×1280/30 fps/10 Mbps/prefer-hardware e Export WebCodecs real, somente imagem e imagem + Text Asset, exigindo MP4 não vazio. Chrome 150/Linux foi avaliado e rejeitado por retornar H.264 não suportado.
- Nenhum dos gates usa skip, retry ou mock; Safari/iPhone publicado permanece aprovação manual obrigatória.

## TC-039 — Editor tipográfico e reedição de Text Assets E8Y

- Pré-condição: projeto com image asset e Text Asset; Modo Ativos; viewport 390 × 797.
- Passos: selecionar com um toque; abrir por Editar e por dois taps; testar Texto/Fonte/Cor/Estilo/Alinhar, Enter, Cancelar, Concluir, Concluir sem mudança, drag, Undo/Redo, Save/Load, Session Restore, Preview e Export MP4 real.
- Resultado esperado: um toque não abre teclado; imagem mantém Trocar; draft aparece apenas no Stage; Cancelar não muda estado/revisão; commit altera o mesmo ID com exatamente um Undo/autosave; tipografia normalizada é idêntica em persistência e renderers; não há largura manual, overflow ou verde no chrome.
- Evidência: `tests/smoke/app.spec.mjs`, `tests/smoke/export.spec.mjs`, screenshot WebKit e checklist publicado em iPhone/Safari.
- Ambiente: WebKit automatizado; gate H.264 em WebKit/macOS; iPhone/Safari real obrigatório para aprovação final.

## TC-040 — Isolamento modal e de autosave do draft na E8Y

- Pré-condição: Text Asset confirmado, Modo Ativos, editor fechado e contagens reais de Undo/revisão conhecidas.
- Passos: abrir por toolbar; alterar textarea/cor, trocar tabs e cancelar; repetir com commit; repetir sem alteração; abrir e tentar taps/gestos fora do painel; abrir por dois taps reais, testar drag, imagem, vazio e `dblclick` no Modo Câmera.
- Resultado esperado: Cancelar e no-op mantêm `undoStack` e `_sessionAutosaveQueuedRevision`; commit alterado incrementa ambos exatamente uma vez; payload/checkpoint/snapshot nunca recebem o draft; sheet bloqueia Stage; tabs conservam `role="tab"`; apenas dois taps concluídos no mesmo texto abrem o editor.
- Evidência: gate E8Y em `tests/smoke/app.spec.mjs`, gate de Export real em `tests/smoke/export.spec.mjs` e screenshot 390 × 797.

## TC-041 — Persistência de histórico textual e cancelamento de ponteiro

- Confirmar edição tipográfica, aguardar o checkpoint real, executar Undo e Redo e, após cada ação, exigir exatamente uma revisão e payload IndexedDB correspondente ao estado visível; o Undo deve preservar a geometria pós-drag anterior.
- Executar pointerdown/pointercancel em texto seguido de um tap válido dentro de 360 ms: o editor permanece fechado, não há Undo/autosave e o estado de gesto termina limpo; somente dois taps concluídos abrem.
- Para imagem sobreposta, localizar por amostragem um ponto visual cujo hit-test canônico retorne a imagem; dois taps nesse ponto selecionam a imagem, mantêm **Trocar** e não abrem texto.

## TC-042 — Fingerprint de histórico e cancelamento de transformações

- Uma edição somente tipográfica deve diferir no fingerprint, fazer Undo/Redo agendar uma revisão cada e sobreviver à aplicação real dos respectivos checkpoints IndexedDB.
- `pointercancel` durante escala, rotação, movimento ou tap restaura o estado inicial, mantém Undo/revisão, fecha todos os estados de gesto e não abre o editor.

## TC-043 — Fundo canônico da caixa de texto E8Z

Criar texto multilinha pelo fluxo público; confirmar fundo desligado; editar em **Caixa**, ativar `#112233` a 65% e concluir. Exigir modelo `block`, paddings `0.50em`/`0.30em`, wrapping e centro preservados, retângulo externo em seleção/hit-test, glifos opacos, exatamente um Undo/autosave, Undo/Redo, Cancelar/no-op, Save/Load, checkpoint/Restore e paridade Stage/Preview/Export. Projeto E8Y sem campos deve permanecer sem fundo e sem mudança geométrica. Em 390 × 797 não pode haver overflow; teclado não altera ProjectWorld, Frames ou outros ativos. O gate H.264 real inclui imagem, texto multilinha, fundo, opacidade e rotação, sem mocks.

### TC-043 — revisão bloqueante da PR #489

A cobertura permanente também exige ativação/desativação durante criação com centro e wrapping invariantes, rótulo imediato em 0/65/100%, escala pública em 100→105→100, slider/Reset, alça e rotação, além de mudanças isoladas de cor e opacidade com Undo/Redo e payload IndexedDB real correspondente.

## TC-046 — Auto-largura do Text Asset e modo fixo opcional (E9C)

- Pré-condição: Modo Ativos, editor tipográfico disponível, fixture real carregada.
- Passos: (a) criar texto de um único caractere pelo fluxo público; (b) editar para múltiplas linhas de larguras diferentes; (c) em **Alinhar**, alternar para **Largura fixa**, travar uma largura menor pelo slider e concluir; executar Undo/Redo e Save/Load; voltar para **Largura automática**; (d) aplicar profundidade não-zero (positiva e negativa) pelo painel público.
- Resultado esperado: (a) a caixa abraça o glifo (largura ≈ largura natural + 1 px), sem caixa vazia gigante, com paridade DOM↔seleção; (b) a largura acompanha a LINHA MAIS LONGA e as linhas ficam contidas na mesma largura, com altura de múltiplas linhas; (c) o modo passa a `fixed`, a largura travada quebra o texto dentro dela, e `boxWidthMode`/valor sobrevivem a Undo/Redo e Save/Load; (d) sob profundidade não-zero, glifos, fundo e seleção/alças permanecem alinhados (mesma cadeia `measureTextAsset → resolveAssetStageVisualGeometry → visualRect` da E9A/E9B) e a geometria canônica não é reescrita pela paralaxe.
- Evidência: gate E9C em `tests/smoke/app.spec.mjs` (WebKit Smoke Tests). Execução local do gate em WebKit permanece bloqueada pela ausência do WebKit no ambiente; verificação equivalente executada em Chromium `hasTouch`. Validação final em iPhone/Safari real permanece pendente.

## TC-054 — Side width handles do Text Asset e correção de REG-056 (E9G) — GATE OBRIGATÓRIO FUTURO, NÃO IMPLEMENTADO NESTA PR

> **Estado (2026-08-24):** DUAS tentativas sucessivas implementaram este gate em `tests/smoke/app.spec.mjs` e o código correspondente em `index.html`, e ambas foram integralmente revertidas após reprovação física: `v8z4b32E9G` (PR #512), REPROVADA por REG-057, revertida em 2026-08-23; `v8z4b32E9G1` (PR #514), REPROVADA por **REG-058** (Stage deixa de permitir edição/interação após a largura do Text Asset chegar ao limite; causa raiz NÃO comprovada), revertida em 2026-08-24 (esta PR). Este TC-054 é preservado como especificação do gate obrigatório para uma FUTURA nova tentativa — não descreve comportamento atual do código, que não possui side width handles nem este gate nesta PR de rollback. Nenhuma tentativa de corrigir REG-056/REG-058 foi feita nesta PR.

- Pré-condição (para a futura implementação): Modo Ativos, fixture real carregada, viewport 390 × 797.
- Passos originais (a)–(k): contar alças de imagem vs. Text Asset; comparar corner scale × side width drag; gesto direto fora do editor; `pointercancel`; Undo/Redo; rotação 45° + width drag; escalar 50/100/200% e verificar mesma faixa lógica (`textBaseBoxWidth`) nos limites (REG-056); tentar extrapolar o limite (no-op); fundo/padding; Save/Load; Text Asset de uma linha em escala pequena; ausência das side width handles em Preview.
- **Requisito adicional obrigatório, herdado da REG-057 (descoberto em 2026-08-23):** além dos passos acima, o gate deve provar a sequência completa de REEDIÇÃO após Preview, pelas DUAS rotas públicas de reedição existentes (toolbar "Editar"; duplo toque): criar/selecionar Text Asset → Editar → alterar → Confirmar → Preview → sair do Preview → selecionar/reutilizar o MESMO Text Asset → Editar novamente → **o editor deve abrir no mesmo ID** → alterar novamente → Confirmar → **sem criar asset duplicado**. Nenhuma das flags de diagnóstico (`textEditorOpen`, `textEditorMode`, `textEditorTargetAssetId`, `pendingTextCreationActive`) pode ficar presa em estado inativo após esse ciclo.
- **Requisito adicional obrigatório, herdado da REG-058 (descoberto em 2026-08-24):** o gate deve provar explicitamente que o Stage permanece interativo/editável DEPOIS que a largura de um Text Asset atinge o limite lógico (`textBaseBoxWidth`) em ambos os sentidos (mínimo e máximo), com e sem edição ativa — nenhum outro elemento/asset do Stage deve deixar de responder a toque/seleção após esse gesto. Nenhuma hipótese de causa (pointer capture, clamp, overlay, listener, side handle) deve ser assumida ao escrever o gate sem reprodução prévia.
- Resultado esperado: idêntico ao especificado nas implementações revertidas (ver histórico em `docs/DECISIONS.md`, DEC-2026-08-23-01 e DEC-2026-08-24-01), acrescido dos dois requisitos acima (reedição pós-Preview da REG-057 e interatividade do Stage no limite de largura da REG-058), que devem passar antes de qualquer nova tentativa ser considerada fisicamente aprovável.
- Evidência exigida da futura tentativa: gate `E9G —`/`TC-054 —` (ou equivalente) em `tests/smoke/app.spec.mjs`, WebKit Smoke Tests verde no CI, e validação física completa em iPhone/Safari por Roberto — incluindo explicitamente a reedição repetida do mesmo Text Asset depois de sair do Preview e a interação do Stage após a largura atingir o limite.
