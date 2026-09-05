# PRODUCT_RULES

## Frames sobrepostos (REG-071)

- Uma borda ou geometria de Frame que esteja visivelmente exposta deve ser selecionável mesmo quando outro Frame maior está à frente.
- Para uma região completamente coberta, nenhuma regra de ciclo automático, mudança de ordem ou seleção arbitrária é inferida sem nova decisão de produto.

## Regra REG-071 — seleção de Frames sobrepostos preserva alcance de edição

- Um Frame grande à frente não pode tornar um Frame atrás inalcançável quando a borda ou outra geometria visível do alvo está exposta. A interação direta no Stage deve permitir selecionar o Frame visível pretendido sem mover antes o Frame de cima.
- Esta regra não define ainda seleção em uma área de sobreposição total, ciclo automático de Frames, nem mudança de z-index; essas alternativas exigem decisão explícita antes de implementação.

## Regra E9AW — Play de Frames precisa de presença física e parada global

- Play e Stop não podem herdar a célula genérica `.tb-item`: são ícone e label ciano sem borda, caixa, fundo, pill, outline, sombra ou estado pressionado perceptível.
- A piscada ciano de chegada deve estar em camada visual acima dos Frames reais, sem bloquear seus gestos; existir no DOM sem estar visível não satisfaz a regra.
- Qualquer toque fora do próprio Play/Stop — inclusive Stage, área vazia, timeline ou outro controle — interrompe o Play de Frames e mantém selecionado o último Frame alcançado.

## Regra E9AV — chegada do Play de Frames é marca independente

- A moldura editorial permanece laranja `#ff9500` e continua a se mover inclusive ao cruzar um Frame; ela nunca vira azul nem para para indicar chegada.
- Cada chegada cria marcador ciano `#04fff2` separado, sobre a geometria do Frame atravessado e por fração curta de segundo. Na mesma janela, a pill correspondente pode mostrar apenas a borda ciano; ela não ganha seleção, preenchimento, halo, foco, pausa nem relógio próprio.
- Play e Stop seguem sólidos em ciano e não podem ter borda, outline, fundo, caixa, pill, sombra ou aparência nativa perceptível.

## Regra E9BD — Play Frames é diagnóstico de Frames, não preview de profundidade

- Play Frames mostra a moldura temporal dos Frames e sua chegada na faixa inferior; não anima Ativos por profundidade/parallax.
- A decisão preserva o diagnóstico aproximado sem alterar a câmera/viewport, Preview, MP4, renderer, geometria ou dados persistidos.

## Regra E9AU — Play de Frames: pulso de chegada, Loop e parada editorial

- No Modo Frames, o controle **Frames** não tem borda, contorno, fundo, caixa ou pill, inclusive enquanto assume Stop. Play e Stop são ícones sólidos em ciano `#04fff2`; somente a moldura editorial é laranja `#ff9500` durante o deslocamento.
- Ao alcançar um Frame, a moldura transitória e a pill correspondente ficam em ciano `#04fff2` somente como pulso breve; em seguida, os Frames reais voltam ao estado neutro. A seleção canônica e a barra inferior acompanham cada passagem, mas não permanecem visualmente marcadas durante o percurso. Stop mantém selecionado o último Frame alcançado.
- A chegada é calculada pelo mesmo relógio de segmentos, pausas por Frame, pausa global, curvas e Loop. Um pulso exclusivamente visual torna a chegada legível; não cria pausa, duração, escrita de tempo ou alteração de geometria.
- Stop explícito ou qualquer outro botão, campo ou controle seleciona o Frame corrente naquele instante e interrompe a demonstração. Somente **Frames** pode retomá-la. Sem Loop, Play no último Frame reinicia no primeiro; com Loop, o trecho N→1 fecha e reinicia continuamente.
- A vista editorial é invariante: pan, zoom, transformação e posição do viewport não mudam. A moldura pode sair da vista e nunca provoca centralização automática.
- A moldura não é Frame real nem dado do projeto: não participa de seleção, hit-test, Undo/Redo, autosave, Save/Load, Preview ou MP4. Stop e qualquer saída desse contexto interrompem e limpam o elemento transitório.

## Regra E9Z — copiar, colar e duplicar ativos

- Duplicar em Camadas cria uma nova camada sobreposta, selecionada e desbloqueada. Duplicar na barra inferior cria a mesma cópia com leve deslocamento visual.
- Copiar não altera o projeto. Colar fica exclusivamente no menu `+` de Ativos, usa a última cópia disponível no clipboard e nunca reutiliza silenciosamente uma cópia antiga após falha, permissão negada ou conteúdo incompatível.
- Imagem externa colada entra pelo fluxo canônico de inserção; Stage, Preview e Export continuam usando o renderer existente. O import aceita PNG, JPEG, WebP, GIF, HEIC e HEIF quando o navegador consegue decodificá-los; o app registra o MIME recebido e verifica o alpha do bitmap decodificado, sem converter silenciosamente para JPEG.

## Estado implementado após rollback E9H (2026-08-26)

A implementação funcional de Camadas/Profundidade da `v8z4b32E9H` foi integralmente revertida após REG-059, restaurando `v8z4b32E9F6`. A E9I implementa a nova tentativa aprovada: controle próprio no Stage, lista vertical com uma área de ações e lock canônico por asset. A régua/fill/steps E9H não existem. Layer travada permanece renderizada e persistida, mas não participa do hit-test nem aceita movimento ou transformação direta; o painel permite selecioná-la e destravá-la.


## Nota — E9G/E9G1 (side width handles) revertidas DUAS vezes (2026-08-23 e 2026-08-24)

Duas implementações sucessivas da largura direta do Text Asset no Stage por duas side width handles (corrigindo REG-056 na origem) chegaram a ser mergeadas e foram **ambas revertidas** após reprovação física em iPhone/Safari:

- `v8z4b32E9G` (PR #512): REPROVADA FISICAMENTE por REG-057 (reedição de Text Asset não reabre o editor após o ciclo edição → confirmação → Preview → sair do Preview); revertida em 2026-08-23.
- `v8z4b32E9G1` (PR #514): reimplementou o mesmo desenho técnico sobre a base restaurada; REPROVADA FISICAMENTE por **REG-058** (após manipulação/edição de largura do Text Asset chegando ao limite, o Stage deixou de permitir edição/interação); revertida em 2026-08-24 (esta PR). A causa raiz de REG-058 NÃO foi comprovada — não afirmar pointer capture, clamp, overlay, listener ou side handle como causa sem evidência.

O código corrente **não contém** side width handles nem qualquer infraestrutura específica da E9G/E9G1 (`.text-width-handle`, `beginTextWidthDrag`, `handleTextWidthPointerMove`, `endTextWidthPointer` ausentes); Text Asset mantém exatamente quatro corner handles, como qualquer outro Asset. O desenho de produto completo (invariantes width≠scale, limite lógico, geometria do drag) permanece registrado em `docs/DECISIONS.md` (DEC-2026-08-23-01 e DEC-2026-08-24-01, ambas marcadas SUPERADA/REVERTIDA) e como possibilidade futura em `docs/ROADMAP.md`/`docs/PRE_PROMOTION_RELEASE_PLAN.md` — uma nova tentativa exige investigação de causa raiz de AMBAS as reprovações físicas (REG-057 e REG-058) antes de reimplementar o mesmo desenho sem alteração. Ver `docs/REGRESSIONS.md` (REG-056, REG-057, REG-058) para o estado corrente. Esta PR de rollback não tentou corrigir REG-056 nem REG-058.

## Regra canônica — picker de cor do Arco vs. paleta pessoal (E9F6, REG-055; implementada)

Existem DUAS coisas distintas que não podem ser confundidas de novo (essa confusão gerou duas reprovações físicas — E9F4/PR #507 e E9F5/PR #509 — antes desta regra ser fixada):

1. **PICKER NATIVO DO SISTEMA.** O botão "+" do painel do Arco (Fundo do projeto, Cor do texto, Fundo da caixa) abre o `input[type=color]` nativo COMPLETO do Safari/iOS — roda/espectro/sliders/conta-gotas pertencem ao sistema operacional. O Arco não cria painel/modal/sheet/roda/espectro/conta-gotas próprio para escolher cor. **Arquitetura visual idêntica nos três contextos** (corrigida na revisão R1, que unificou o Fundo do projeto ao mesmo padrão de Cor do texto/Fundo da caixa): `[presets] [cores pessoais] [+]` na mesma linha, seguida de `[HEX inline]` abaixo. O "+" é sempre a primitiva `.color-trigger-wrap` — "+" visual puramente decorativo (`pointer-events:none`) sobreposto pelo MESMO `input[type=color]` nativo, real, nunca 1×1/off-screen, nunca aberto por `.click()` programático, nunca clonado/recriado/remontado (nem durante os próprios eventos do picker).
2. **PALETA PESSOAL DO ARCO.** `customColorPalette`: browser-local, persistente entre reload e entre projetos, compartilhada pelos três contextos, fora do projeto/Save/Load/Session Restore/Text Asset, sem sync/cloud.

Regras de evento (a causa raiz exata da runaway palette física da E9F5):

- Eventos produzidos pelo picker nativo enquanto o usuário movimenta RGB/roda/espectro/sliders — inclusive MÚLTIPLOS eventos `input`/`change` durante um único gesto contínuo, padrão real do WebKit/iOS — podem continuar alterando/aplicando a cor corrente ao contexto (preview/aplicação), mas NUNCA chamam `addCustomColorToPalette`, NUNCA persistem swatch pessoal e NUNCA aumentam a contagem da paleta. "Aplicar cor" ≠ "salvar cor pessoal".
- O "+" que aparece DENTRO da interface nativa de cores do iOS pertence ao sistema operacional: o Arco não intercepta, não tenta detectar, não tenta espelhar e não cria swatch próprio por causa dele. Se o iOS salvar essa cor em sua própria coleção nativa, isso permanece responsabilidade do iOS — o JavaScript do Arco não pode prometer que sabe quando esse "+" interno foi pressionado.
- O campo HEX inline (presente nos três contextos — Fundo do projeto, Cor do texto, Fundo da caixa) aceita entrada completa `#RRGGBB` com ou sem "#", normalizando internamente. Enquanto o usuário digita, pode atualizar preview/aplicação quando houver valor completo válido, mas NÃO persiste nenhum estado intermediário. Somente no COMMIT real do campo (Enter, `change`/blur apropriado) uma cor válida completa é aplicada e adicionada EXATAMENTE UMA VEZ à paleta pessoal — editar vários caracteres numa única edição não produz vários swatches, e confirmar a mesma cor de novo não duplica (deduplicação contra presets e contra a própria paleta). **Enter comita explicitamente** (corrigido na revisão R1): não depende de `change` disparar sozinho ao apertar Enter num input de texto, comportamento não garantido entre navegadores; um `blur`/`change` subsequente com o MESMO valor não duplica.
- Não existe limite arbitrário de quantidade de cores pessoais nesta regra. O painel que exibe a paleta (Fundo do projeto) NUNCA pode crescer indefinidamente até empurrar alça/título/HEX/fechamento para fora do viewport — a área de SWATCHES é a única parte que pode ganhar rolagem interna própria; layout visual/grid dos swatches é preservado, sem inventar altura fixa desacoplada do viewport. As linhas de Cor do texto/Fundo da caixa já rolam horizontalmente e por isso não sofrem desse crescimento vertical.
- A chave de storage legada `arco_user_custom_colors_v1` (usada pela E9F5, contaminável pelo bug físico de runaway) é tratada como sempre inválida: removida defensivamente na inicialização, nunca migrada/importada, mesmo com centenas de entradas, corrompida, vazia ou com storage bloqueado — falha de storage nunca impede o app de abrir. A paleta corrigida usa chave nova `arco_user_custom_colors_v2`.
- Gestão de coleção (remover cor, favoritos, reordenação, sync) está fora do escopo desta regra e não deve ser implementada sem pedido explícito.

## Regras E9E — criação na vista atual e WYSIWYG ao vivo (implementadas)

Regras aprovadas e já IMPLEMENTADAS nesta E9E:

1. Um NOVO Text Asset nasce centralizado na VISTA ATUAL do Stage, com o centro capturado antes do resize do teclado virtual. O centro é obtido em coordenadas de World pela transformação canônica existente (`computeEditorTransform → screenToStageCoord → editorStageToWorld`); não se usa o centro da célula base do ProjectWorld quando a vista corrente enquadra outra região, nem `window.innerWidth/innerHeight` como sistema canônico, nem fórmula de câmera paralela, nem compensação CSS, nem mudança no ProjectWorld.
2. Editar um Text Asset já existente nunca o recentraliza; a edição preserva a posição/centro confirmados.
3. Enquanto o editor de texto está ativo, `pendingTextDraft` é a fonte única da verdade VISUAL do Text Asset em edição.
4. Painel, Stage, fundo, seleção e as quatro alças refletem imediatamente o mesmo `pendingTextDraft`: toda propriedade alterada no painel atualiza na hora o Stage (glifos e fundo), o contorno de seleção e as quatro alças, mantendo hit-test coerente, sem persistir o draft prematuramente.

Estas regras não antecipam a manipulação direta de largura por alças laterais (E9G), registrada apenas como plano futuro em `docs/PRE_PROMOTION_RELEASE_PLAN.md` e `docs/ROADMAP.md`.

## Regra E9F — editor de Text Asset iconográfico neutro (implementada)

Comportamento aprovado e IMPLEMENTADO na v8z4b32E9F (substitui a apresentação em tabs textuais da E9D/E9E; toda a base funcional E9E é preservada):

1. O editor de Text Asset usa uma **rail horizontal iconográfica**: as propriedades principais são representadas por ÍCONES, não por labels. Nenhum nome de propriedade aparece visualmente na rail; a semântica acessível `tablist/tab` é mantida internamente com `aria-label` correto em cada item. Sem emoji e sem caracteres improvisados; os ícones seguem o sistema SVG já usado no app.
2. A rail permanece em uma única linha, rola horizontalmente (scroll de toque nativo, sem scrollbar intrusiva, sem segunda linha, sem comprimir os ícones) e tem sempre **exatamente um item ativo**.
3. Ordem das propriedades: **texto, fonte, estilo, alinhamento, cor do texto, fundo da caixa, largura da caixa**. `aria-label`: “Editar texto”, “Fonte”, “Estilo”, “Alinhamento”, “Cor do texto”, “Fundo da caixa”, “Largura da caixa”.
4. A seleção INTERNA do editor usa **contraste neutro invertido: superfície branca + símbolo escuro** no item ativo; item inativo usa superfície neutra escura + símbolo claro. O editor interno **não herda o coral de Ativos nem o ciano de Frames** para os seus estados de seleção; nunca usa verde.
5. **Alinhamento** deixa de ocupar espaço permanente sob o textarea e vira controle iconográfico próprio (esquerda/centro/direita, com `aria-label`, sem grandes botões “Esquerda/Centro/Direita”).
6. **Cor do texto** (glifos) e **Fundo da caixa** são propriedades separadas e inequívocas. O painel de Fundo agrupa **somente** ligar/desligar fundo, cor do fundo e opacidade do fundo, com o slider de opacidade e o valor percentual **fisicamente dentro** do painel de Fundo; a opacidade nunca pode ser confundida com opacidade dos glifos ou do ativo inteiro.
7. **Largura da caixa** mantém Auto/Fixa e, no modo Fixa, o stepper numérico (funcionalidade E9C intacta) sob o ícone Largura; E9F apenas muda ONDE e COMO esses controles aparecem. `boxWidth`, `boxWidthMode`, algoritmo de wrap, reserva +1 px (E9D), `textBaseBoxWidth`, escala do texto e persistência não mudam.
8. O textarea de conteúdo é visualmente distinto da sheet (superfície própria), sem depender de borda pesada.
9. A sheet mantém a pequena alça horizontal, sem título redundante “Texto”. **Arrastar a alça/topo para baixo minimiza** (mesma semântica `minimizeTextEditor`: preserva `pendingTextDraft`, zero Undo, zero autosave, mesmo ID, reabre restaurando exatamente o draft). Não existe botão separado escrito “Fechar/Minimizar”. `×` cancela e ✓ confirma — três ações com semânticas distintas. O gesto vertical da alça é independente do scroll horizontal da rail e do slider de opacidade; swipe horizontal não minimiza e o slider não arrasta a sheet.
10. A sheet é content-aware: cresce apenas o necessário, preservando o máximo razoável do Stage, com overflow interno quando o conteúdo é grande — sem modal full-screen.
11. Toda a base E9E permanece intacta: novo texto no centro da vista atual, editar existente não recentraliza, `pendingTextDraft` como fonte única da verdade visual, WYSIWYG imediato (glifo/fundo/seleção/quatro alças), minimizar/reabrir, confirmar sem salto, cancelar corretamente, exatamente 1 Undo + 1 autosave quando há alteração confirmada e zero enquanto é somente draft.

## Regra E9F1 — refino visual/funcional localizado do editor de Texto (implementada)

Comportamento aprovado e IMPLEMENTADO na v8z4b32E9F1 (correção localizada sobre a E9F após teste físico; a estrutura da E9F é preservada — não é um redesign):

1. **Cabeçalho compacto:** a alça horizontal, a linha de ações (× Cancelar / ✓ Confirmar) e a rail iconográfica ficam próximas, sem vazio vertical fantasma. `×` e `✓` permanecem ambos presentes; os touch targets dos botões não descem abaixo de um tamanho seguro para iPhone (≥ 44 px). A compactação é estrutural (padding/margin/altura), não um `transform` visual arbitrário.
2. **Ícone de Estilo:** representação combinada **B (negrito) + I (itálico)** (`#i-text-bold-italic`), comunicando Normal/Bold/Italic/Bold+Italic; não é mais o "I" itálico isolado. Sem emoji, sem biblioteca de ícones. `aria-label` = "Estilo".
3. **Ícone de Alinhamento dinâmico:** o ícone da propriedade Alinhamento na rail reflete o `textAlign` do `pendingTextDraft`/asset (`left`→align-left, `center`→align-center, `right`→align-right), atualizado imediatamente. Fonte de verdade é o próprio estado canônico do draft (sem segundo estado só para o ícone); fallback defensivo `align-left`. Os três controles iconográficos permanecem no painel de Alinhamento.
4. **Paleta rápida compartilhada:** Cor do texto e Fundo da caixa usam sequências compactas de swatches que **reutilizam a mesma constante única** `PROJECT_BG_NEUTRALS` (preto + escala de cinza 10→90% + branco), a mesma fonte agora consumida também pelo seletor de "Cor de fundo" do PROJETO. Não existem listas de neutros hardcoded duplicadas. Cada paleta termina com um botão `+` compacto (não preenchido como cor) que abre o color picker nativo — `aria-label` "Escolher outra cor do texto" / "Escolher outra cor do fundo". Não há schema persistente novo de histórico de cores; o custom atual vive apenas em estado de UI/sessão e o valor final continua salvo no próprio Text Asset. O menu de Fundo do PROJETO **não** foi redesenhado.
5. **Fundo da caixa — ícone e estado transparente:** o ícone da propriedade Fundo é inequívoco de preenchimento (`#i-box-fill`), não a paleta genérica. O estado padrão é **"Sem cor / Transparente"** (swatch com checkerboard cinza/branco discreto; `aria-label` "Sem cor", `title`/acessibilidade "Transparente") com `boxBackgroundEnabled = false` e **sem** o slider de opacidade (`#textEditorBgOpacityWrap` oculto). Não se simula preto/branco com alpha zero. `boxBackgroundColor`/`boxBackgroundOpacity` são preservados internamente para restaurar a última escolha, mas não produzem fundo enquanto `enabled=false`.
6. **Fundo da caixa — escolher cor:** selecionar qualquer cor (swatch neutro, custom atual ou `+`) faz `boxBackgroundEnabled = true`, grava `boxBackgroundColor`, renderiza WYSIWYG imediatamente e **então** mostra o slider de opacidade. Voltar a "Sem cor" remove o fundo imediatamente e oculta o slider, sem alterar a opacidade dos glifos. O alfa controla **somente** `boxBackgroundOpacity`; nunca opacidade de glifo, de ativo, seleção ou alças.
7. **Localização do viewport ao editar existente:** ao abrir o editor em `mode==='edit'`, a VISTA do editor é reposicionada por **pan de navegação canônico** (`computeEditorTransform → editorWorldToStage`, `editorPanX/Y`, `clampEditorPan`, `applyEditorZoom`) para manter o centro visual do Text Asset dentro da área de Stage realmente visível acima da sheet/teclado. A operação **não** move o asset (`worldX/worldY/worldW/worldH`, `rotation`, `depth`, `zIndex` inalterados), **não** altera Frames, curvas nem ProjectWorld, **não** dispara Undo nem agenda autosave, **não** altera o hash canônico e **preserva o zoom** (só translação, sem zoom automático agressivo). Usa a geometria REAL (`stage`, `#textCreationSheet`, `visualViewport`/teclado do Safari) com deadzone anti-jitter e reexecuta após abrir, após a estabilização do layout e a cada `resize` relevante de `visualViewport`. A E9E continua valendo: editar existente **não** recentraliza o ASSET; a E9F1 apenas localiza o VIEWPORT.
8. **Criação de novo texto inalterada (E9E):** novo texto continua nascendo no centro da VISTA ATUAL, capturado antes do resize do teclado. A localização de edit não é reaproveitada para mudar o create.
9. **Largura = Auto compacto + slider:** existe **um** único botão de modo explícito (**Auto**, quadrado/compacto, `aria-label` "Ajustar largura automaticamente"), mais um slider (step 5, limites canônicos de largura) e o valor numérico compacto. Iniciar uma alteração efetiva pelo slider define `boxWidthMode = 'fixed'` **no mesmo gesto** e o botão Auto deixa de aparecer ativo. Tocar Auto volta a `boxWidthMode = 'auto'`, executa a medição canônica de auto-largura (wrap, +1 px E9D, `textBaseBoxWidth`, `measureTextAsset`, centro visual, WYSIWYG preservados) e re-sincroniza o slider **sem** sair de auto (distinção entre atualização programática do slider e input do usuário). **Não** existe botão "Fixa" grande nem stepper `−`/`+`; nenhum handler morto alcançável permanece.
10. **E9G não antecipada:** exatamente quatro alças de transformação (`tl`, `tr`, `bl`, `br`); nenhuma alça lateral, drag lateral de largura ou conversão Auto→Fixa pelo Stage.

## Paleta de UI aprovada (v8z4b32E9F)

- UI/chrome principal: `#24262B`.
- Bottom sheets: `#303238`.
- Campos, pills e controles internos: `#393C43`.
- Divisores/bordas discretas: `~#4A4D55`.
- Acento do workspace **Ativos: `#FF6B8A`** (coral).
- Acento do workspace **Frames: ciano existente `#04fff2`** (preservado exatamente).

**PROJECT BACKGROUND não é UI background.** `#24262B` é fundo/chrome da INTERFACE. `DEFAULT_PROJECT_BG` (`#3c3c3b`), `currentProjectBg`, `getProjectBackgroundColor()`, `renderBgUsed` e o background que entra em Preview/Export são conteúdo/render e NÃO mudam por causa desta paleta.

**Princípio visual (registrado):** as cores de Frames/Ativos identificam o workspace; elas não constituem automaticamente a cor interna dos painéis. Na E9F essa linguagem neutra é aplicada SOMENTE ao editor de Texto; a migração dos demais painéis (Settings, Frames, etc.) fica como revisão visual futura e não foi feita agora.

## Regra E9B — geometria visual de Text Assets no Stage

- Após a medição canônica da caixa, glifos e fundo, seleção, quatro abas e hit-test devem consumir a mesma `visualRect` de `resolveAssetStageVisualGeometry`.
- Paralaxe é geometria visual derivada: nunca altera `worldX/worldY/worldW/worldH`, `boxWidth`, Frames, curvas ou ProjectWorld.
- Não se admite compensação CSS, fórmula paralela nem mudança nos renderers de Preview/Export para corrigir a paridade do Stage.

## Profundidade de Text Assets — v8z4b32E9A

- Text Assets novos nascem com `depth = 0`; projetos legados sem valor e valores ausentes, inválidos ou não finitos migram para zero.
- Normalização, serialização e hidratação preservam todo valor finito sem clamp adicional. O controle público continua responsável pelo intervalo de -100 a 100.
- `depth` controla somente profundidade/parallax aparente e `zIndex` somente sobreposição. Um não pode alterar o outro, nem gravar geometria derivada em Frames, curvas ou ProjectWorld.
- Stage, Preview, Export, Undo/Redo, Save/Load e Session Restore devem consumir a mesma profundidade canônica.

## Superfícies neutras dos painéis contextuais

- O fundo principal usa o neutro mais escuro da interface.
- O bottom sheet contextual usa um neutro discretamente mais claro que o fundo principal.
- Pills e controles pequenos usam um neutro aproximadamente 10–20% visualmente mais claro que a superfície contextual.
- Quando aberto, o bottom sheet forma uma superfície única até a borda inferior e a safe-area, sem faixa residual do fundo principal.
- Frames e Ativos compartilham a mesma geometria e densidade compacta nos controles contextuais `−5`/`+5` e Reset.
- “Cor da interface”, nesta hierarquia neutra, não substitui os acentos funcionais: Frames permanecem ciano (`#04fff2`) e Ativos usam o coral aprovado (`#FF6B8A`, antes roxo). A migração global dos demais painéis para a linguagem neutra da E9F fica registrada como revisão visual futura.

## Regras aprovadas de produto e UX

- Alterar somente o que foi solicitado.
- Preservar layout, cores, textos, ícones, fluxos e menus.
- O modo inicial após adicionar imagem continua sendo Câmera/Frames.
- Frames e referências devem respeitar decisões já aprovadas.
- Relato visual de Roberto prevalece sobre diagnósticos internos.
- Preview e Export devem ser preservados quando não forem escopo.
- Save/Load, Layers, ProjectWorld, seleção e renderer devem ser preservados quando não forem escopo.
- iPhone/Safari é a referência real.
- Nenhuma mudança colateral é aceitável.
- Frames e Ativos compartilham a linguagem de bottom sheet contextual; a troca de modo sempre fecha o painel pertencente ao modo anterior.
- Ações individuais e painéis contextuais de Ativos exigem seleção canônica válida e permanecem desabilitados sem `selectedAssetId` existente.
- Preview/Export pronto usa a identidade ciano própria do Arco, sem herdar cor de modo nem verde semântico legado.

## Regra global — não existe verde na UI aprovada do Arco

- Verde não faz parte da identidade cromática atualmente aprovada da interface do Arco Motion App.
- Nenhum elemento de chrome/UI produzido pelo próprio Arco pode ser criado, restaurado ou alterado para verde sem autorização explícita de Roberto.
- A regra é global e inclui botões, ícones, checks, indicadores, textos, labels, bordas, backgrounds, menus, painéis, sliders, controles, estados selecionados, estados de sucesso, estados “pronto”, timeline, Layers, Stage UI, Preview, Export, mensagens e feedback visual do aplicativo.

### Estados semânticos e Preview/Export

- Não assumir convenções genéricas como verde = sucesso, pronto, confirmação ou download concluído. O Arco não deve receber uma cor por convenção genérica de design system quando essa cor não pertence à identidade aprovada do produto.
- O estado pronto de Preview/Export continua usando o ciano próprio aprovado do Arco.
- A existência histórica ou técnica de tokens ou nomes como `green`, `semantic-green`, `--green` ou equivalentes não constitui decisão de produto e não autoriza sua renderização na interface. Legado técnico, diagnóstico ou interpretação de agente também não concede essa autoridade.

### Chrome do Arco e conteúdo do usuário

- A ausência de verde aplica-se ao chrome/interface produzida pelo Arco; ela não proíbe verde no conteúdo do usuário.
- Fotografias, ilustrações, vídeos, imagens, SVGs e outros assets podem conter qualquer cor, inclusive verde. Pixels pertencentes ao conteúdo do usuário não devem ser confundidos com a identidade cromática da UI.
- Verde só poderá passar a fazer parte da interface mediante decisão futura explícita de Roberto; nenhum agente pode inferir essa autorização.

## Regras de revisão

- Não inventar novas decisões de produto.
- Não aceitar “parece seguro” como evidência.
- Não trocar comportamento aprovado por simplificação técnica.
- Não usar diagnóstico interno como substituto de validação visual.
- Não permitir texto técnico renderizado no app.

## Editor tipográfico de Text Assets

- Um toque em texto apenas seleciona; **Editar** na toolbar e dois taps concluídos no mesmo Text Asset abrem o editor.

### Estrutura do editor (v8z4b32E9F — rail iconográfica)

- O editor reutiliza o mesmo draft para criação e reedição.
- A navegação principal é a **rail horizontal iconográfica** descrita em “Regra E9F — editor de Text Asset iconográfico neutro (implementada)”. Não existem mais tabs textuais `Texto | Fonte | Cor | Estilo`; a semântica `tablist/tab` é mantida internamente com `aria-label`, sem label visível.
- Ordem das propriedades: texto, fonte, estilo, alinhamento, cor do texto, fundo da caixa, largura da caixa. Cada propriedade abre seu painel abaixo da rail; a sheet cresce apenas o necessário.

### Propriedade: Editar texto

- Mostra essencialmente o campo de escrita (textarea), com superfície própria distinta da sheet. Enter continua criando quebra explícita de linha.
- Alinhamento e largura NÃO ficam permanentemente sob o textarea; cada um tem sua própria propriedade na rail.

### Propriedade: Fonte

- Concentra a seleção tipográfica; os nomes das fontes podem permanecer visíveis (são conteúdo/opções, não a navegação principal).

### Propriedade: Estilo

- Preserva os controles tipográficos pertinentes, incluindo peso e itálico; apenas a apresentação foi reorganizada.

### Propriedade: Alinhamento

- Controles iconográficos esquerda/centro/direita, com `aria-label`; sem grandes botões textuais.

### Propriedade: Cor do texto

- Seletor de cor dos glifos, separado do fundo da caixa.

### Propriedade: Fundo da caixa

- Agrupa **somente** ligar/desligar fundo, cor do fundo e opacidade do fundo, com o slider de opacidade e o valor percentual **fisicamente dentro** deste painel. A opacidade pertence ao FUNDO e não reduz a opacidade dos glifos nem do ativo inteiro. A borda não é declarada como implementada nesta etapa.

### Propriedade: Largura da caixa

- Mantém Auto/Fixa e, no modo Fixa, o stepper numérico (funcionalidade E9C intacta). E9G (alças laterais de largura no Stage) NÃO pertence a esta etapa.

### Cabeçalho e draft

- O editor possui `×` para cancelar, `✓` para confirmar e alça superior para minimizar.
- `×` descarta as alterações do draft, restaura o estado confirmado e não confirma alteração.
- Minimizar pela alça fecha a sheet e mantém o draft vivo somente em memória: não confirma, não cria entrada de Undo, não cria revisão de Session Autosave e permite reabrir o mesmo draft pelo fluxo de **Editar**.
- `✓` preserva o mesmo ID do Text Asset; havendo mudança real, produz exatamente uma entrada de Undo e uma revisão de autosave; sem mudança, não cria checkpoint artificial.

### Persistência do draft

- Enquanto não confirmado, o draft não participa de Preview, Export, Save/Load nem Session Autosave.

### Caixa de texto

- Preserva as regras E8Z: `boxStyle: "block"`, fundo desligado por padrão e, quando ativado, envolvendo a caixa.
- Padding horizontal canônico `0.50em` e padding vertical canônico `0.30em`; padding ainda não é customizável nesta etapa.

### Trabalho futuro explícito

- Continuam futuros e não devem ser declarados implementados: raio de canto ajustável, borda, cor da borda, opacidade da borda, espessura da borda, opacidade geral do ativo e animação. Presença temporal foi implementada como primeira frente funcional na `v8z4b32E9AG`, sem incluir efeitos de Entrada/Saída nem transparência manual do ativo.

## Caixa de texto canônica — E8Z

- Text Assets usam `boxStyle: "block"`; o fundo nasce desligado e, quando ligado, envolve todas as linhas sem alterar a largura de composição (`boxWidth`).
- Cor e opacidade do fundo são independentes dos glifos. Padding fixo canônico é `0.50em` horizontal e `0.30em` vertical e deve persistir mesmo sem controle visível.
- Padding customizável e fundo por linha são evoluções futuras. Presença temporal é função geral dos ativos e não se confunde com animação.

## Presença temporal de ativos — E9AG implementada

- Imagens e Text Assets compartilham uma Entrada referenciável ao tempo do projeto, a um Frame ou a outro ativo, com offset. A saída, quando necessária, é derivada por um Tempo de permanência opcional contado sempre a partir dessa Entrada.
- Referência Projeto representa um instante absoluto e não oferece controle Antes/Depois. Referências Frame e Ativo podem expor Antes/Depois para definir o offset relativo à sua âncora móvel.
- O padrão global vive em `Edição do projeto > Projeto > Aparência`. O override individual vive no painel `Animação` do Ativo selecionado. Entrada/Saída ficam recolhidas até serem ativadas, para não pesar a interface.
- No editor, um ativo fora do intervalo permanece como referência visual suavizada e tracejada; selecioná-lo preserva o coral de Ativos e a edição. Preview e Export o omitem inteiramente fora do intervalo.
- A referência editorial não é opacidade manual, não é persistida e não muda geometria, profundidade, `zIndex` ou ordem de Layers.
- Âncoras por Frame usam `frameId` estável, não índice visual frágil. Âncoras por ativo podem mirar Entrada ou Saída do outro ativo; ciclos e autorreferência são inválidos.
- Ao excluir ativo usado como âncora, não há relink automático: após confirmação, os dependentes assumem o tempo absoluto resolvido no projeto. Cancelar preserva tudo.
- Ao alterar proporcionalmente a duração total do projeto, offsets e permanências em segundos acompanham a escala quando a escolha contextual estiver ligada; âncoras semânticas continuam vinculadas a Frames/Ativos.
- Transparência manual e efeitos de Entrada/Saída são frentes posteriores e separadas. A regra completa está na DEC-2026-08-31-01 e na especificação correspondente.
