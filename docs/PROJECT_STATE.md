# PROJECT_STATE

## Atualização 2026-08-21 — v8z4b32E9F3 mergeada e aprovada fisicamente; v8z4b32E9F4 em PR (Cores — REG-055: painel compartilhado + paleta pessoal persistente)

- **PR #506 mergeada** na `main` de teste em 2026-08-20/21, versão `v8z4b32E9F3`. **Merge commit da PR #506:** `67661047f822ba8434783b862af9f31b502d6d76` (verificado por `git fetch origin` + `git rev-parse origin/main` nesta sessão, coincide com o HEAD de referência informado na tarefa).
- **Build publicada e teste físico:** a build `v8z4b32E9F3` foi publicada no repositório de teste e **Roberto testou fisicamente em iPhone/Safari**, aprovando visualmente a correção da REG-053 (painel de transformação em multi-seleção deixa de depender da ordem das ações). Conforme `docs/APPROVAL_WORKFLOW.md`, essa validação publicada é o que fecha fisicamente a REG-053 — ver atualização correspondente em `docs/REGRESSIONS.md`.
- **Base confirmada para a v8z4b32E9F4:** `origin/main` no merge acima (`6766104`/`67661047…`). `git fetch origin` executado nesta sessão; repositório confirmado como `rowestudio/arco-app-test`; `git status` limpo antes de editar; **nenhuma PR aberta concorrente** identificada para o mesmo escopo de cores; branch de trabalho própria `claude/custom-colors-persistent-palette-ceyg90` (equivalente à branch sugerida `fix/v8z4b32e9f4-reg055-custom-colors`, já existente neste ambiente de sessão); nenhum merge/promoção.
- **Escopo (aprimoramento funcional de UX + clarificação/correção da REG-055; risco médio — interface de cores, persistência local, WYSIWYG de Text Asset):** unifica a customização de cor de **Cor de Fundo do projeto**, **Cor do texto** e **Fundo da caixa** em um único painel compartilhado (`#customColorPanel`), reaproveitando a identidade visual já existente — estrutura `.float-panel`/`panel-handle`/`panel-title` do seletor de Fundo do projeto **mais** o cabeçalho ×/✓ (`text-editor-header`) já aprovado no editor de Text Asset — em vez de três painéis independentes. Mapeamento prévio (auditoria obrigatória, sem arquitetura paralela): trigger antigo "Personalizar" do Fundo do projeto = quadrado cinza `input[type=color]#bgHexInput` + campo de texto `#bgHexText`, sempre visíveis, aplicando via `setBgColorHex`/`onBgHexText`/`commitBgColorEdit`; botões `+` de Cor do texto/Fundo da caixa = `openTextColorPicker()`/`openTextBgColorPicker()`, que só clicavam um `input[type=color]` oculto (`#textCreationColor`/`#textBoxBackgroundColor`); handlers canônicos que já aplicavam a cor e foram **reutilizados sem alteração de semântica**: `setBgColor()` (Fundo do projeto — Undo/dirty/restart de Preview preservados), `setTextColor()` (Cor do texto — altera só os glifos do `pendingTextDraft`), `setTextBoxBackground()` (Fundo da caixa — liga `boxBackgroundEnabled` e revela a opacidade E9F1); infraestrutura de persistência local já existente e reaproveitada: `localStorage` com padrão defensivo try/catch (mesmo usado por `AUTOSAVE_KEY`/`hasSeenCameraModeHint`), não IndexedDB (reservado à sessão do projeto) — não existia mecanismo de "preferência do usuário" dedicado antes desta PR, então foi criada a menor chave nova necessária, versionada e namespaced (`arco_user_custom_colors_v1`, seguindo a convenção `arco_*` já usada por `arco_autosave`).
- **Clarificação de produto de Roberto sobre REG-055 (2026-08-21):** o relato original ("botão `+` deveria abrir o color picker nativo") é substituído por: `+` significa **adicionar/personalizar cor**; abre o painel compartilhado de customização (preview, campo hexadecimal, confirmação explícita ✓); a cor confirmada entra em uma **paleta pessoal persistente** compartilhada pelos três seletores. Ver atualização de `docs/REGRESSIONS.md` (REG-055) e `docs/DECISIONS.md`.
- **Paleta pessoal persistente:** `customColorPalette` (variável de módulo) carregada de `localStorage['arco_user_custom_colors_v1']` no boot, validando estrutura, normalizando (`#rrggbb` minúsculo, aceitando entrada com/sem `#`), removendo duplicatas e descartando entradas inválidas sem quebrar o app; neutros built-in (`PROJECT_BG_NEUTRALS`) continuam disponíveis mesmo se a preferência não carregar. **NÃO** integra `buildProjectData`/Save-Load/Session Restore/ProjectWorld/Text Asset — é preferência local do navegador, sem sync/nuvem/conta.
- **Não toca:** REG-052 (fill dos sliders), matemática/targets de REG-054 (`getNormalTransformTargets`), REG-053, motor/curvas/timing, Preview/Export/renderer/`getStateAtT`/`drawAtT`, ProjectWorld, Save/Load, Layers, produção. `DEFAULT_PROJECT_BG` (`#3c3c3b`) intocado.
- **Testes:** novo gate `E9F4 — REG-055: painel compartilhado de customização de cor e paleta pessoal persistente` em `tests/smoke/app.spec.mjs` (ver `docs/TEST_CASES.md` TC-053), cobrindo os três contextos, hex válido/inválido, cancelamento sem efeito colateral, aplicação pelo caminho canônico, `DEFAULT_PROJECT_BG` intocado, deduplicação por normalização, ausência da paleta no schema do projeto, compartilhamento entre contextos, storage corrompido/malformado tratado com segurança, e persistência entre reload e entre projetos. Verificação equivalente executada em **Chromium `hasTouch`** (WebKit ausente no ambiente desta sessão): suíte completa `tests/smoke/app.spec.mjs` executada — 25 passam, 2 falhas idênticas à base já documentadas como limitações do ambiente Chromium (404 de rede no smoke inicial; gesto multi-touch do E9B), sem nenhuma regressão nova introduzida; gates E8Z/E9A–E9F1/REG-053/REG-054 continuam passando.
- `APP_VERSION` = `APP_VERSION_NAME` = `v8z4b32E9F4`.
- **Estado:** implementação em PR no repositório de teste; execução local em WebKit bloqueada pela ausência do WebKit neste ambiente (checks obrigatórios do HEAD final — QA Guardrails, Browser/WebKit Smoke Tests, WebKit functional smoke, Real Export Smoke/H.264 real — devem pertencer ao HEAD final da PR). **Validação física obrigatória em iPhone/Safari por Roberto permanece pendente para a REG-055**; somente Roberto poderá fechá-la fisicamente após testar a build publicada. Produção intocada; nenhuma promoção autorizada.

## Atualização 2026-08-20 — v8z4b32E9F3 em PR (Frames — REG-053: painel de transformação em multi-seleção)

- **Base confirmada:** `origin/main` do repo de teste no merge da **PR #505 / E9F2**, commit **`4373ef432ba7a1fafa40be63b3df4ecb127256be`**. `git fetch origin` executado; `rowestudio/arco-app-test` confirmado; **nenhuma PR aberta concorrente** identificada; nenhum trabalho local não relacionado descartado. Branch de trabalho própria (`fix/v8z4b32e9f3-reg053-multiselect-panel`); nenhum merge/promoção.
- **Escopo (correção funcional de regressão de UI/interação; risco médio — área inferior de Frames em multi-seleção):** corrige **exclusivamente REG-053** — a apresentação do painel de transformação (Rotação/Escala/Mover/Pausa) em multi-seleção de Frames deixa de depender da ORDEM das ações. NÃO corrige REG-052 (fill dos sliders) nem REG-055 (botões `+` dos color pickers); NÃO altera a matemática/targets de REG-054 já implementada na E9F2.
- **Bug histórico, NÃO introduzido pela E9F2/PR #505:** confirmado por Roberto em teste físico em 2026-08-20 que o sintoma já era conhecido de builds anteriores; investigação relacionada documentada em `docs/AUDIT-lower-area-v8z4b29AC.md` e `docs/QA-v8z4b29AE.md` (série histórica v8z4b29, usada apenas como mapa de investigação e reconfirmada na `main` atual antes de qualquer correção).
- **Reprodução física atual (E9F2, iPhone real/Safari, iPhone OS 18_7, Safari 26.6, 390×797, DPR 3, projeto com 3 Frames):** selecionar dois Frames e SÓ DEPOIS abrir Rotação quebra a apresentação (painel cortado/comprimido, Voltar pode sumir); abrir o painel normal em um Frame e SÓ DEPOIS selecionar dois Frames não quebra. MESMA seleção + MESMA transformação + ordem diferente ⇒ apresentação diferente.
- **Causa comprovada por reprodução direta na `main` atual (Playwright, Chromium `hasTouch`, 390×797):** `#lowerContextSheetShell`/`#lowerContextSlot` só recebiam a expansão estrutural de grid (linhas 3/5, `overflow:visible`) para `cust-expanded`/`asset-context-panel-open` (painel normal de Frame único); em `align-submenu-open` (multi-seleção) o mesmo ancestral ficava confinado à Linha 4 (46px) com `overflow:hidden` herdado de `.lower-cell`, cortando visualmente a parte superior de `#alignBarSubmenu` — inclusive Voltar — sempre que a multi-seleção precedia a abertura do painel. Detalhe completo em `docs/REGRESSIONS.md` (REG-053).
- **Correção estrutural mínima:** as mesmas regras de expansão do ancestral já usadas pelo custBar (série E8U–E8V) passam a valer também para `body.align-submenu-open`; `#alignBarSubmenu` deixa de usar o deslocamento horizontal pensado para um ancestral estreito (agora full-width) e ancora pelo topo com paridade de gap em relação ao custBar. Nenhuma segunda apresentação paralela foi criada — a mesma primitiva geométrica do custBar passou a ser reaproveitada pelo alignBar. Sem refatoração ampla da área inferior; sem tocar matemática de transformação, Undo/Redo, Preview/Export, Stage ou timeline.
- **Diagnóstico observacional novo** (sem texto técnico na UI normal, via `buildDiagnosticsText()`): `multiSelectionActive`, `multiSelectionCount`, `lowerContextVisiblePanel`, `alignBarVisible`, `alignBarSubmenuVisible`, `custBarVisible`, `custBarContentVisible`, `bodyHasMultiSelection`, `bodyHasAlignSubmenuOpen`, `bodyHasCustOpen`, `bodyHasCustExpanded`, `lowerContextTransitionSource`, `lowerContextLastOpenedGroup`, `lowerContextCompetingPanelsDetected`, `lowerContextClippingDetected`.
- **Testes:** novo gate `REG-053 —` em `tests/smoke/app.spec.mjs` (viewport 390×797 obrigatório; Fluxo A vs Fluxo B para Rotação/Escala/Mover/Pausa; ver `docs/TEST_CASES.md` TC-052). O gate aciona o **fluxo público real** (long-press/toque nas pills; toque no botão visível do grupo em `#alignBarActions`/`#toolbar .ctx-frame`), sem chamar `openAlignSubmenu()`/`openCustBar()`/`switchCustTab()` diretamente para estabelecer o estado testado — revisado nesta PR após apontamento de que a versão inicial usava esses atalhos internos. Verificação equivalente local em **Chromium `hasTouch`** (WebKit ausente no ambiente): o gate REG-053 passa na `v8z4b32E9F3` pelo fluxo público e falha comprovadamente, também pelo fluxo público, quando a correção CSS é revertida (validado nesta sessão); suíte completa `tests/smoke/app.spec.mjs` executada — 24 passam, 2 falhas idênticas à base e já documentadas como limitações do ambiente Chromium (404 de rede no smoke inicial; gesto multi-touch do E9B), sem nenhuma regressão nova introduzida; REG-054 (TC-051) continua passando integralmente.
- **Validação física PARCIAL registrada de REG-054 (não integra o escopo funcional desta PR, apenas registro):** Rotação em dois Frames selecionados confirmada funcionando fisicamente na E9F2; REG-054 ainda não deve ser marcada RESOLVIDA integralmente sem os demais itens do checklist físico (ver `docs/REGRESSIONS.md`).
- `APP_VERSION` = `APP_VERSION_NAME` = `v8z4b32E9F3`.
- **Estado:** implementação em PR no repositório de teste; execução local em WebKit bloqueada pela ausência do WebKit. Checks obrigatórios do HEAD final (QA Guardrails; Browser/WebKit Smoke Tests; WebKit functional smoke; Real Export Smoke / H.264 real quando disparado) devem pertencer ao HEAD final da PR. **Validação física obrigatória em iPhone/Safari por Roberto permanece pendente**; REG-053 só será marcada resolvida integralmente após esse teste. REG-052 e REG-055 permanecem ABERTAS. Produção intocada; nenhuma promoção autorizada.

## Atualização 2026-08-20 — v8z4b32E9F2 em PR (Frames — REG-054: transformações na multi-seleção)

- **Base confirmada:** `origin/main` do repo de teste no merge da **PR #504 / OPS-06**, commit **`426e48a607d480f95386326cc4ca25249fe4cc87`**. `git fetch origin` executado; `rowestudio/arco-app-test` confirmado; **nenhuma PR aberta concorrente**; nenhum trabalho local não relacionado descartado. Branch de trabalho própria (`claude/frame-multiselect-transforms-p3ao1l`); nenhum merge/promoção.
- **Escopo (correção funcional de regressão; risco médio/alto — Frames/seleção/geometria/Undo/autosave):** corrige **exclusivamente REG-054**. Com 2+ Frames selecionados, os controles PÚBLICOS de **Posição/Escala/Rotação** do menu contextual de Frame (custBar) passam a atingir **todos e somente** os Frames da seleção corrente, **sem exigir Global**. Global permanece um modo distinto (todos os Frames elegíveis) e não é workaround da multi-seleção.
- **Causa comprovada (reprodução determinística na `v8z4b32E9F1`, fluxo público):** as seis rotas normais do custBar — `nudgePos`, `setPosFromInput`, `input` do `scaleSlider`, `nudgeScale`, `input` do `rotSlider`, `nudgeRotation` — resolviam o alvo como `Global ? todos : activeIdx`, ignorando `selectedFrames`. Detalhe em `docs/REGRESSIONS.md` (REG-054).
- **Correção:** função única `getNormalTransformTargets()` (precedência Global → multi-seleção → Frame ativo; Frames travados nunca entram) aplicada às seis rotas, reaproveitando o **mesmo delta** do modo Global; distâncias relativas (Posição), proporção/centro individual (Escala) e rotações independentes (Rotação) preservados. **Sem sistema de batch paralelo**; Undo consolidado por gesto e Preview/Export intactos.
- **Follow-up de revisão (PR #505, 1ª rodada):** o capturador de Undo do slider de Rotação ainda abortava por `frameLocked[activeIdx]` — com `activeIdx` travado/fora da seleção o gesto mutava os Frames selecionados **sem Undo**. Corrigido para usar a mesma semântica de alvos efetivos; o capturador de Escala foi auditado (não tinha o defeito de mutação-sem-Undo) e harmonizado. Gate REG-054 reforçado com o cenário-armadilha e o caso de zero alvos editáveis; falha também no HEAD `85a53b2`.
- **Follow-up de revisão (PR #505, 2ª rodada):** o gesto contínuo dos sliders normais de Rotação/Escala acumulava indevidamente entre eventos `input` quando `activeIdx` não pertencia aos alvos (delta recalculado contra baseline congelado e reaplicado sobre alvos já modificados → +10+20+30 = +60° em vez de +30°). Corrigido com **sessão de gesto** (snapshot de baseline + alvos no início; cada `input` = `snapshot + deslocamento líquido`), reusando `pushUndo`/`undoStack` (1 Undo/gesto), sem sistema paralelo; preserva proporções/centro/limites/rotação independente/seleção/locks. Gate reforçado com drag multi-input real (mousedown → +10 → +20 → +30 → change) exigindo deslocamento líquido e equivalência 1-input vs multi-input; falha também no HEAD `960cd02`.
- **Não toca:** infraestrutura de batch/alignBar, REG-052 (fill dos sliders), REG-053 (painel cortado), layout/CSS do painel, motor/curvas/easing/timing, `getStateAtT`/`drawAtT`, renderer, Preview/Export/WebCodecs, ProjectWorld, Save/Load, Layers, Text Assets, E9G e **produção**.
- **Testes:** novo gate `REG-054 —` em `tests/smoke/app.spec.mjs` (Casos A/A'/C/D/E + Frame travado + Undo/Redo consolidado + finitude + persistência no modelo real); ver `docs/TEST_CASES.md` TC-051. Verificação equivalente local em **Chromium `hasTouch`** (WebKit ausente no ambiente): o gate REG-054 passa na `v8z4b32E9F2` e falha na base pré-correção; as 3 falhas restantes do smoke sob Chromium (smoke inicial 404 de rede, E9B multi-touch, e um flake de ordenação de sessão) são idênticas à base e limitações do ambiente Chromium, validadas no WebKit CI.
- **Nova regressão registrada (NÃO corrigida aqui):** **REG-055** — os botões “+” das paletas de Cor do texto e Fundo da caixa do editor de Text Asset não abrem o color picker nativo (iPhone/Safari, relato de 2026-08-20). Registrada ABERTA em `docs/REGRESSIONS.md`; causa a investigar; nenhum handler/input/UI de cor foi alterado nesta PR.
- `APP_VERSION` = `APP_VERSION_NAME` = `v8z4b32E9F2`.
- **Estado:** implementação em PR no repositório de teste; execução local em WebKit bloqueada pela ausência do WebKit. Checks obrigatórios do HEAD final (QA Guardrails; Browser/WebKit Smoke Tests; WebKit functional smoke; Real Export Smoke / H.264 real quando disparado) devem pertencer ao HEAD final da PR. **Validação física obrigatória em iPhone/Safari por Roberto permanece pendente**; REG-054 só será marcada resolvida após esse teste. Produção intocada; nenhuma promoção autorizada.

## Atualização 2026-08-19 — OPS-06 (documental): três regressões ABERTAS registradas + continuidade do Project OS

- **OPS-06 é documental/operacional** (governança do Project OS): formaliza a regra Conversation Delta → Project OS e a auditoria de handoff, e registra pendências reais ainda não formalizadas. **Nenhuma mudança funcional**; `APP_VERSION = APP_VERSION_NAME = v8z4b32E9F1` intacta; `index.html` e produção intocados.
- **Três bugs ABERTOS e ainda NÃO corrigidos** (relato físico; causa a investigar; não implementados) — registrados individualmente em `docs/REGRESSIONS.md`:
  - **REG-052** — fill visual dos sliders (especialmente em Ativos) não corresponde à posição do thumb e pode avançar além dele.
  - **REG-053** — painel de transformação com multi-seleção de Frames pode ser cortado/desaparecer e remover o botão Voltar (iPhone/Safari).
  - **REG-054** — transformação de multi-seleção de Frames afeta apenas um Frame (exceto com Global ativo); o esperado é afetar todos os Frames selecionados, sem exigir Global.
- Essas regressões abertas devem ser consideradas antes de avançar a próxima frente; **Roberto decide a ordem efetiva** (ver `docs/ROADMAP.md`).
- Ambiguidades documentais corrigidas nesta OPS-06 (sem alterar produto): Layers e Profundidade/parallax são sistemas **já existentes**, e a próxima frente é **readequação de interface + revisão visual** do controle existente, não criação do zero; a proposta histórica de “painel de Layers permanente” foi marcada como **superada**; o fill de Profundidade passa a ser descrito com o coral vigente de Ativos `#FF6B8A`, sem reintroduzir o roxo antigo.

## Atualização 2026-08-19 — v8z4b32E9F1 mergeada, publicada e APROVADA fisicamente (Texto — refino visual/funcional encerrado)

- **PR #500 mergeada** na `main` de teste em 2026-08-19: "v8z4b32E9F1 — fix(text): refina editor, cores, viewport e largura". **Merge commit da PR #500:** `6739dbc018f335ad6b1faead6de4f4469e5ebf78`.
- **Build publicada:** a `v8z4b32E9F1` foi publicada no repositório de teste.
- **Teste físico:** Roberto testou a build publicada em **iPhone/Safari** e **APROVOU visual/funcionalmente** a E9F1 nos itens do seu escopo em **2026-08-19**. O relato visual de Roberto é a referência final de aprovação. Diagnóstico físico confirmou, entre outros: `exportSuccess = true`, `encoderPathUsed = webcodecs`, `fallbackUsed = false`, resolução de exportação `720 × 1280`, `textAssetCount = 2`, paridades de editor/box/asset entre Stage↔Preview↔Export e Session Restore `true`, opacidade da caixa não afeta glifos, `assetTransformCornerHandlesCount = 4`, paridade de câmera Preview↔Export e sem salto visual detectado em Preview/Export.
- **Export real:** executado com sucesso via **WebCodecs** (sem fallback), `APP_VERSION = APP_VERSION_NAME = v8z4b32E9F1`.
- **Encerramento:** a **rodada corretiva E9F1 está encerrada**; a E9F1 é a versão corrente aprovada do repositório de teste.
- **Produção NÃO alterada:** `rowestudio/arco-app` permanece intocada; **nenhuma promoção autorizada**. E9G continua FUTURA/não implementada; a readequação da interface de Layers existente + revisão visual do controle de Profundidade existente não foi iniciada (Layers e Profundidade/parallax básico JÁ EXISTEM, não serão criados do zero); Engine Sprint não iniciado.
- O histórico E9F/E9F1 anterior é preservado abaixo e permanece rastreável.

## Atualização 2026-08-18 — v8z4b32E9F1 em PR (Texto — refino visual/funcional pós-teste físico da E9F)

- **Base confirmada:** `origin/main` do repo de teste no merge da **PR #499 / v8z4b32E9F**, commit **`82131049e52974a1922206c92bf573b9d2c78ff5`** (mensagem "Merge pull request #499 from rowestudio/claude/v8z4b32e9f-text-editor-p5f6w4"). `git fetch origin` foi executado. **Incompatibilidade registrada (AGENTS.md):** a instrução da tarefa citava o merge commit `7e3978208976281dfe57d9832e5cb3b9626ecda2`, que **não existe** neste repositório; a fonte oficial (git) mostra `82131049…` como o merge real da PR #499 (v8z4b32E9F). Como o conteúdo corresponde exatamente ao esperado (merge da PR #499 / v8z4b32E9F), a nova base foi reavaliada e adotada. Não há PR aberta concorrente para o mesmo escopo. Branch de trabalho própria (`claude/v8z4b32e9f1-text-ui-refinement-z044xq`); nenhum merge/promoção.
- **Fato histórico registrado:** a **v8z4b32E9F** foi mergeada pela **PR #499** (merge commit `82131049…`) e **testada fisicamente por Roberto em iPhone/Safari**. A estrutura geral da E9F foi aprovada (editor iconográfico, organização geral, caixa de edição do conteúdo, atualização WYSIWYG, paleta neutra, acento coral de Ativos) e a maioria das funções operou; porém a **E9F NÃO foi aprovada visualmente como encerrada**. A **v8z4b32E9F1** é a rodada corretiva localizada decorrente desse teste. Bugs de multi-seleção de Frames e sliders gerais de Escala/Rotação relatados posteriormente **não** pertencem a esta PR.
- **Escopo E9F1 (correção visual/funcional LOCALIZADA do Text Asset Editor; risco médio):** (A) compactação do cabeçalho da bottom sheet (alça/×/✓/rail próximos, sem vazio; × e ✓ preservados; touch targets seguros); (B) novo ícone de Estilo B+I (negrito+itálico) no lugar do "I" itálico; (C) ícone de Alinhamento na rail reflete `textAlign` do draft (left/center/right, fallback left); (D/E) Cor do texto vira paleta rápida de swatches reutilizando os neutros do seletor de Fundo do projeto (constante única `PROJECT_BG_NEUTRALS`) + botão `+` para o color picker; (F/G/H) Fundo da caixa com ícone inequívoco de preenchimento (`#i-box-fill`), estado padrão "Sem cor / Transparente" (checkerboard) com `boxBackgroundEnabled=false` e SEM slider de opacidade, escolher cor liga o fundo e revela o slider, alfa afeta só `boxBackgroundOpacity`; (J) editar texto existente localiza a VISTA (pan canônico) para manter o texto visível acima da sheet/teclado, SEM mover o asset; (L/M/N) Largura = Auto compacto + slider (step 5): mover o slider entra em `fixed` no mesmo gesto, Auto recalcula e re-sincroniza sem sair de auto, removidos o botão "Fixa" grande e o stepper −/+.
- **Não toca:** geometria canônica do Text Asset (`worldX/worldY/worldW/worldH`, `rotation`, `depth`, `zIndex`), renderer, Preview/Export/WebCodecs, `getStateAtT`/`drawAtT`, Frames, curvas, timeline, Layers, ProjectWorld, Save/Load, Session Restore, Settings, menu global e produção. **E9G não foi antecipada** (exatamente quatro alças `tl/tr/bl/br`). O menu de Fundo do PROJETO não foi redesenhado — apenas passou a consumir a mesma constante única `PROJECT_BG_NEUTRALS`, eliminando listas hardcoded duplicadas. `DEFAULT_PROJECT_BG` (`#3c3c3b`) intacto.
- **Diagnósticos:** adicionado `getTextEditorE9F1Diagnostics()` (não expõe texto técnico na UI) com as flags de cabeçalho compacto, ícone de estilo/alinhamento, paleta compartilhada, Sem cor/opacidade condicional, localização de viewport (com invariantes de geometria/Frames/ProjectWorld/Undo/autosave) e largura Auto/slider.
- **Testes:** novo gate `E9F1 —` em `tests/smoke/app.spec.mjs` (viewport 390 × 797, Testes 1–11); gates E8Z/E9C/E9D/E9E/E9F **adaptados** à nova UI (paleta de Fundo por swatches + slider de largura) sem enfraquecer asserções; `tests/smoke/export.spec.mjs` ajustado ao novo fluxo de Fundo. Verificação equivalente executada em **Chromium `hasTouch`** (binário do ambiente; WebKit ausente): E9F1, E8Z, E9C, E9D, E9E e E9F passam; **E9B** falha por depender de gesto multi-touch de seleção imagem×texto que não reproduz em Chromium (falha idêntica na base) e o smoke inicial registra um 404 de recurso de rede também presente na base — ambos são limitações do ambiente Chromium, não regressões, e devem ser validados no WebKit CI.
- `APP_VERSION` = `APP_VERSION_NAME` = `v8z4b32E9F1`.
- **Estado:** implementação em PR no repositório de teste; execução local em WebKit permanece bloqueada pela ausência do WebKit. Os checks obrigatórios do HEAD final (QA Guardrails; Browser/WebKit Smoke Tests; WebKit functional smoke through Preview; Real Export Smoke WebKit macOS; Real H.264 Export smoke) devem pertencer ao HEAD final da PR. Validação visual final em iPhone/Safari real por Roberto permanece obrigatória; produção não foi tocada e nenhuma promoção está autorizada.

## Atualização 2026-08-18 — v8z4b32E9F em PR (Texto — editor iconográfico neutro)

- Base confirmada: `main` de teste no merge da PR #498 (v8z4b32E9E), commit `4254ed370ecee64b7f98d411fe6994b8c4538ba5`. `git fetch origin` confirmou que `origin/main` não avançou além desse HEAD e que não há PR aberta concorrente. Branch de trabalho própria (`claude/v8z4b32e9f-text-editor-p5f6w4`); nenhuma reutilização da PR #498; nenhum merge/promoção.
- Fato histórico registrado: a **v8z4b32E9E** foi mergeada pela PR #498 (merge commit `4254ed370ecee64b7f98d411fe6994b8c4538ba5`) e **testada fisicamente por Roberto em iPhone/Safari na build publicada**, sendo **aprovada visual e funcionalmente nos itens do seu escopo em 2026-08-18** (novo texto centralizado na vista atual; pan/zoom antes da inserção; WYSIWYG ao vivo; texto/fundo/seleção/quatro alças sincronizados; fonte/estilo/alinhamento/cores em tempo real; minimizar/reabrir preservando draft; confirmar sem salto; editar existente sem recentralizar; texto horizontal preservado). Essa aprovação não autoriza promoção para produção.
- Escopo E9F: revisão visual e de interação **localizada no editor de Text Asset**, com a paleta de UI aprovada desta rodada. NÃO altera modelo canônico do Text Asset, geometria, renderer, Preview/Export, persistência, Stage↔World nem as quatro alças. E9G (alças laterais de largura) e Camadas/Profundidade/Engine Sprint permanecem fora do escopo.
- Implementação E9F: o editor tipográfico E9D/E9E, baseado em tabs textuais (Texto|Fonte|Cor|Estilo), passa a usar uma **rail horizontal iconográfica neutra** com sete propriedades por ícone, sem label textual visível e com `aria-label` acessível (semântica `tablist/tab` preservada internamente): editar texto, fonte, estilo, alinhamento, cor do texto, fundo da caixa, largura da caixa. A rail rola horizontalmente em uma única linha; item ativo usa **contraste neutro invertido (superfície branca + símbolo escuro)**, nunca coral/ciano/verde. Alinhamento saiu do corpo permanente do Texto e virou controle iconográfico próprio; Cor do texto e Fundo da caixa ficaram semanticamente separados, com a opacidade **fisicamente dentro** do painel de Fundo; Largura mantém Auto/Fixa + stepper (E9C intacta) sob o ícone Largura. Arrastar a alça superior para baixo minimiza (mesma semântica `minimizeTextEditor`: preserva `pendingTextDraft`, zero Undo, zero autosave, mesmo ID); × cancela e ✓ confirma; o swipe horizontal da rail e o slider de opacidade não minimizam a sheet.
- Paleta: os tokens neutros de UI adotam a paleta aprovada — chrome principal `#24262B`, bottom sheets `#303238`, campos/pills/controles internos `#393C43`, divisores `~#4A4D55` — sem tocar `DEFAULT_PROJECT_BG` (`#3c3c3b`), `currentProjectBg`, `getProjectBackgroundColor()` nem o background que entra em Preview/Export. A identidade do workspace **Ativos migra de roxo para coral `#FF6B8A`** (token `--accent` de `body.editor-assets` + contorno/alças de asset, pill de modo e botão `+`); **Frames preservam o ciano existente `#04fff2`**. A revisão global dos demais painéis (Settings, Frames, etc.) NÃO foi feita e fica registrada como trabalho futuro.
- Regressões E9A–E9E verificadas na verificação equivalente em Chromium `hasTouch` (WebKit ausente no ambiente): os gates E8Z, E9A, E9B, E9C, E9D e E9E foram adaptados apenas na navegação (tabs textuais → ícones), sem enfraquecer asserções funcionais, e o novo gate E9F cobre rail, estado ativo neutro, superfícies, coral/ciano, navegação por propriedade, alinhamento iconográfico, fundo com opacidade isolada, largura Auto/Fixa, minimizar por gesto, independência swipe×drag, cancelar/confirmar e quatro alças.
- `APP_VERSION` = `APP_VERSION_NAME` = `v8z4b32E9F`.
- Estado: implementação em PR no repositório de teste; execução local em WebKit permanece bloqueada pela ausência do WebKit (verificação equivalente em Chromium `hasTouch`). Os checks obrigatórios do HEAD final (QA Guardrails; Browser/WebKit Smoke Tests; WebKit functional smoke through Preview; Real Export Smoke) devem pertencer ao HEAD final da PR. Validação visual final em iPhone/Safari real por Roberto permanece obrigatória; produção não foi tocada e nenhuma promoção está autorizada.

## Atualização 2026-08-18 — v8z4b32E9E mergeada e aprovada fisicamente (Texto — estabilização funcional)

- Base: `main` de teste no merge da PR #497 (v8z4b32E9D), commit `312b46af1b1b4955b5cb85cb9e3ea52876ea5cb6`. `git fetch origin` confirmou que `origin/main` não avançou além desse HEAD e que não há PR posterior conflitante. Branch de trabalho própria; nenhuma reutilização da PR #497.
- Escopo: correção funcional localizada pós-E9D. (1) NOVO Text Asset passa a nascer centralizado na VISTA ATUAL do Stage; (2) sincronização WYSIWYG ao vivo durante criação/edição. Sem redesign visual (E9F) nem alças laterais (E9G); UI E9D preservada.
- Objetivo 1 — centralização na vista: o ponto de criação (`createPendingTextAsset`) deixou de centralizar no centro da célula base do ProjectWorld e passa a centralizar no centro da vista corrente, capturado ANTES de abrir/focar a sheet e ANTES do resize do teclado. O centro é obtido em coordenadas de World pela cadeia canônica já existente: `computeEditorTransform → screenToStageCoord → editorStageToWorld` (novo helper `getEditorViewCenterWorld()`, sem fórmula de câmera paralela, sem `window.innerWidth/innerHeight` como sistema canônico, sem compensação CSS e sem mexer no ProjectWorld). A geometria REAL medida do draft é usada para fazer o centro geométrico coincidir com o centro da vista; sem vista válida, cai no centro da célula base (comportamento pré-E9E). Editar um asset existente nunca recentraliza (a edição não passa por `createPendingTextAsset` e o commit preserva o centro anterior).
- Objetivo 2 — WYSIWYG ao vivo: causa comprovada da dessincronia por teste — `updateTextDraft` e o listener global de `input` re-renderizavam o Stage (`renderProjectWorldExtraImages`) mas NÃO a seleção (`renderAssetSelectionOverlay`), e a seleção consumia `getSelectedAsset()` (estado confirmado/target), não o `pendingTextDraft` vivo. Assim, mudanças de conteúdo, fonte, peso/itálico e fundo atualizavam glifos/fundo no Stage mas deixavam contorno e quatro alças na geometria anterior (na edição) ou ausentes (na criação). Correção mínima na origem: `renderAssetSelectionOverlay` passa a consumir a geometria viva de `pendingTextDraft` enquanto o editor está ativo (medindo o draft antes de resolver a geometria) e `updateTextDraft`/`input`/abertura do editor passam a re-renderizar a seleção. Nenhum polling, timer ou render duplicado foi introduzido.
- Regressões E9D–E9A verificadas: os gates E8Z, E9A, E9C e E9D continuam passando na verificação equivalente em Chromium `hasTouch`. Os gates novos E9E (centralização e WYSIWYG) falham na main pré-E9E e passam após a implementação.
- Estado: **mergeada** na `main` de teste pela **PR #498**, merge commit `4254ed370ecee64b7f98d411fe6994b8c4538ba5`. **Testada fisicamente por Roberto em iPhone/Safari na build publicada e APROVADA visual/funcionalmente nos itens do seu escopo em 2026-08-18** (centralização na vista atual; pan/zoom antes da inserção; WYSIWYG ao vivo; texto/fundo/seleção/quatro alças sincronizados; fonte/estilo/alinhamento/cores em tempo real; minimizar/reabrir preservando draft; confirmar sem salto; editar existente sem recentralizar; texto horizontal preservado). Produção não foi tocada e nenhuma promoção está autorizada; a E9E é agora a base funcional aprovada sobre a qual a E9F é construída.

## Atualização 2026-08-16 — v8z4b32E9D em PR (Texto)

- Base funcional: `02919cba11738d32f0609df1e3d4b641af9a51a7`, `v8z4b32E9C`; HEAD remoto auditado da PR #497 antes da revisão E9D-R1: `b4c177970568b3d354fcd262fad036f3c0153258`.
- O relato visual de texto vertical no iPhone/Safari é real. A E9D adota no limite canônico de medição uma reserva de 1 px entre a largura retornada por `measureText` e a caixa consumida pelo Stage. A hipótese causal de divergência subpixel Canvas × DOM/Safari só será classificada como validada após o gate público WebKit e a validação física oferecerem evidência A/B compatível.
- O editor passa a usar quatro abas reais (`Texto`, `Fonte`, `Cor`, `Estilo`), ícones acessíveis `×`/`✓`, alinhamentos e Auto/Fixa + stepper em Texto, fundo em Cor e alça que minimiza sem confirmar nem persistir. O draft vivo reabre pelo fluxo Editar; confirmação preserva o ID.
- A E9D-R1 corrige o escopo do tablist, remove o listener morto do slider eliminado e amplia o gate público para `R`/`Texto`, Stage, Preview, draft, histórico, fundo, depth, hit-test e quatro alças; o gate H.264 passa a criar `Texto` pelo fluxo E9D. Resultados efetivos constam no plano. Validação visual final no iPhone/Safari permanece obrigatória; produção não foi tocada e nenhuma promoção está autorizada.

## Atualização 2026-08-16 — v8z4b32E9C é a base auditada da série pré-promoção

- HEAD atual da `main` de teste: `8f1b2686ae6cc99bb716b200a79d04281cd968d7`; `APP_VERSION` e `APP_VERSION_NAME` permanecem `v8z4b32E9C`.
- A `v8z4b32E9C` foi mergeada na `main` de teste pela PR #492. A `main` atual inclui também, após esse merge:
  - PR #493 e PR #494: atualização de `assets/icons/apple-touch-icon.png`;
  - PR #495: atualização dos logos SVG do Arco (`assets/brand/arco-logo.svg`, `assets/brand/arco-logo-white.svg`, `assets/brand/arco-logo-symbol.svg`).
- A `v8z4b32E9C` é a **base auditada** desta série, **não** uma promoção liberada. A candidata real de produção será o HEAD posterior à série completa de PRs funcionais, à documentação coerente e à validação completa no iPhone/Safari por Roberto.
- O plano aprovado de entrega é uma série de três PRs funcionais antes de qualquer promoção — (1) Texto, (2) Camadas e Profundidade, (3) Engine Sprint de Movimento inteligente/easing — seguida de revisão integrada no iPhone/Safari. O registro canônico está em `docs/PRE_PROMOTION_RELEASE_PLAN.md`; a sequência também consta em `docs/ROADMAP.md`.
- A promoção para produção permanece **bloqueada** e depende da conclusão dessa série, dos testes obrigatórios e de autorização explícita de Roberto. Nenhuma promoção foi executada.
- Produção (`rowestudio/arco-app`) permanece em `v8z4b32E7H`, commit `626327280e3a4126fac259e205bbe0bdf3cc8719`, fora do escopo desta série. O registro operacional da candidata futura está em `docs/PROMOTION_TO_PRODUCTION.md`.
- Houve testes físicos **parciais** em iPhone/Safari real das versões E9B/E9C — foi esse teste parcial que revelou a regressão aberta de texto vertical registrada em `docs/REGRESSIONS.md`. A validação **completa** de release ainda **não** foi concluída nem aprovada; a evidência automática (checks de CI no HEAD da PR #492) está registrada em `QA.md` como complementar, não substituta.
- Regressão aberta relevante para a série: um Text Asset novo pode aparecer vertical, letra a letra, no Stage/Preview sem edição (registrada em `docs/REGRESSIONS.md`, causa a demonstrar).

## Atualização 2026-08-15 — v8z4b32E9C mergeada (PR #492)

- Item 1 de 4 da série de Text Asset (auto-largura → border-radius → borda com opacidade → opacidade de ativo global). Cada item é PR própria e sequencial; os itens 2–4 não foram adiantados.
- Relato de Roberto: digitar um único caractere deixava a caixa enorme e vazia. A E9C torna a largura da caixa derivada do conteúdo (a LINHA MAIS LONGA, quebra apenas por Enter) como modo padrão do texto NOVO; o padding canônico 0.50em/0.30em da E8Z continua aplicado sobre a largura calculada.
- Modo opcional de LARGURA FIXA (override manual) reintroduz a quebra automática dentro de uma largura travada, útil para storytelling. A alternância é um toggle claro no editor tipográfico (aba **Alinhar**), com slider de largura no modo fixo. A opção de alça de largura no Stage foi descartada por conflitar com o invariante aprovado de exatamente quatro alças (REG-028) do sistema de transformação de Ativos.
- A largura é derivada exclusivamente em `measureTextAsset`, mantendo a cadeia `measureTextAsset → resolveAssetStageVisualGeometry → visualRect` estabilizada pela E9A/E9B; nenhum offset aparente é gravado em geometria, Frames, curvas ou ProjectWorld. Depth/parallax translacional e Preview/Export permanecem inalterados.
- `boxWidthMode` (e o valor travado no modo fixo) persiste em Undo/Redo, Save/Load e Session Restore; projetos legados sem o campo migram para `fixed`, preservando a geometria confirmada anterior.
- Cobertura automatizada E9C em `tests/smoke/app.spec.mjs` cobre caractere único, múltiplas linhas com a largura seguindo a mais longa, alternância auto/fixo com persistência em Undo/Redo e Save/Load, e paridade glifos/fundo/seleção sob profundidade não-zero (padrão `expectHugsSelection`). A execução local do gate em WebKit permanece bloqueada pela ausência do WebKit; verificação equivalente foi executada em Chromium `hasTouch`. Validação final em iPhone/Safari real permanece pendente e nenhuma promoção para produção está autorizada.

## Atualização 2026-08-14 — v8z4b32E9B em PR

- Roberto identificou em iPhone/Safari que, com `depth` finito, seleção, abas e hit-test acompanhavam a paralaxe, mas glifos e fundo do Text Asset permaneciam na posição canônica no Stage.
- Causa raiz: o ramo DOM de texto media a caixa e convertia diretamente `worldX/worldY/worldW/worldH`, enquanto imagens e overlays consumiam `resolveAssetStageVisualGeometry().visualRect`.
- A E9B mede primeiro o texto e posiciona seu único elemento DOM pela geometria visual resolvida existente. O offset aparente não é gravado em geometria, Frames, curvas ou ProjectWorld; Preview e Export permanecem inalterados.
- O teste automatizado E9B define cobertura para profundidades positivas e negativas, DOM/seleção/alças/hit-test, histórico, navegação e persistência; sua execução local permanece bloqueada pela ausência do WebKit no ambiente. A validação final em iPhone/Safari físico permanece pendente e nenhuma promoção para produção está autorizada.
- Revisão corretiva do gate WebKit: 17 testes passaram e o E9B parou no baseline porque a expectativa das abas ignorava os 3 px de borda do contorno. O teste passa a calcular centros pela origem interna, bordas e posições CSS reais, sem alterar o produto, e amplia a evidência de autosave concluído/checkpoint, pan, Manual Save/Load, Continuar sessão e Preview; a execução integral do novo HEAD permanece obrigatória.
- No HEAD `6c57e4a`, a paridade visual direta já passava, mas o diagnóstico lia somente `style.height`; como o Text Asset declara `style.minHeight`, auditava altura zero e gerava falso negativo. A leitura declarativa passa a compartilhar fallback `height → minHeight` (e `width → minWidth`) no mesmo espaço CSS do Stage, mantendo renderer e tolerâncias intactos; os checks do novo HEAD ainda devem ser executados.

Última atualização documental: 2026-08-08.

## Atualização 2026-08-13 — v8z4b32E9A em hotfix

- Relato em iPhone/Safari: a Profundidade escolhida para um Text Asset voltava a zero após medição/redraw e não sobrevivia a Save/Load ou Session Restore.
- A causa raiz eram três limites destrutivos exclusivos de texto: normalização, serialização e hidratação gravavam zero. A E9A preserva qualquer número finito e usa zero somente como fallback legado ou inválido.
- `depth` permanece independente de `zIndex` e afeta apenas o parallax aparente; geometria canônica, Frames, curvas e ProjectWorld não são regravados. Fórmula de parallax, UI e renderer não mudam.
- Cobertura automatizada protege o controle público, Stage/Preview/Export, Undo/Redo, Save/Load e Session Restore. A validação final publicada em iPhone/Safari real permanece pendente e nenhuma promoção está autorizada.

## Atualização 2026-08-11 — v8z4b32E8X em desenvolvimento

- A primeira etapa de Texto introduz `type: "text"` como ativo canônico editável, com criação por `+`, cor, largura/quebra automática e confirmação/cancelamento.
- O mesmo estado textual participa da pilha de Layers, seleção e transformações genéricas, Save/Load, checkpoint de sessão e composição Canvas compartilhada por Preview/Export; drafts não entram em persistência.
- Resize de teclado durante a criação é apenas auditado e não recalcula Frames, ProjectWorld ou ativos confirmados.
- A aprovação final continua dependente de publicação e validação por Roberto em iPhone/Safari real; nenhuma promoção está autorizada.

## Atualização 2026-08-11 — v8z4b32E8W em PR

- A reprodução real após Session Restore comprovou uma regressão de sistema de coordenadas, não de Parallax: Frames do ProjectWorld permaneciam em `baseStageW/baseStageH`, enquanto o sampler da câmera ainda os convertia por `stageW/stageH`, dimensões CSS variáveis do viewport.
- O foco do campo de nome no fluxo Salvar pode redimensionar o viewport no iPhone; o listener global de `resize` então reescalava e gravava novamente todos os Frames do ProjectWorld, fazendo o overlay “pular” para a geometria que a câmera já mostrava.
- A E8W torna `projectWorld.baseStageW/baseStageH` a dimensão canônica compartilhada por câmera, `framesNorm` e Restore, e faz resize de ProjectWorld alterar apenas o viewport/render. A fórmula de Parallax, os renderers, ProjectWorld persistido e o fluxo manual de Save permanecem preservados.
- O teste E8W executa Manual Load → checkpoint real → reload/startup recovery → Preview nos waypoints de todos os Frames → Save com resize, comparando modelo, payload, overlay e câmera por valores reais.
- Nenhuma promoção para produção está autorizada; validação publicada em iPhone/Safari real permanece obrigatória.

## Atualização 2026-08-10 — v8z4b32E8V em desenvolvimento

- Roberto aprovou visualmente em iPhone/Safari real a geometria e a compactação da `v8z4b32E8U`, incluindo pills `−5`/`+5`, Reset, densidade, distância slider → controles e paridade Frames × Ativos.
- Roberto reprovou visualmente na `v8z4b32E8U` as superfícies neutras e a interrupção da superfície do bottom sheet antes da borda inferior.
- A `v8z4b32E8V` corrige exclusivamente essa continuidade no container contextual real e adota os valores canônicos: fundo principal `#3C3C3C`, superfície contextual `#434247` e controles neutros `#505054`. A revisão estrutural final da PR #484 mantém `#lowerContextSheetShell` como item de grid e ancestral visual único das tracks 3–4/safe-area. A causa final confirmada eram três células irmãs ainda presentes no auto-placement com `visibility:hidden`; ao colidirem com o shell, criavam linhas implícitas. Nos estados contextuais abertos, as células de contagem, estado ativo e duração global saem do fluxo com `display:none` e retornam normalmente ao fechar. Painéis permanecem dentro do slot com largura E8O, sem pintura de `body` ou timeline. Esses tokens não autorizam mudanças nos acentos funcionais ciano/roxo.
- Estado: correção em desenvolvimento no repositório de teste; a aprovação visual final permanece dependente de merge/publicação e validação de Roberto em iPhone/Safari real. Nenhuma promoção para produção está autorizada.

## Atualização 2026-08-09 — v8z4b32E8U em PR

- Base confirmada: merge da PR #481 na `main` de teste, commit `53546d1`, versão `v8z4b32E8T`.
- A `v8z4b32E8U` compacta a primitiva geométrica compartilhada de `−5`/`+5` e Reset em Frames e Ativos, reduz a distância para o slider e consolida a superfície neutra contextual até a safe-area.
- A hierarquia aprovada preserva o fundo principal como neutro mais escuro, usa superfície contextual discretamente mais clara e controles cerca de 10–20% mais claros que ela, sem alterar os acentos ciano/roxo.
- Não há alteração de handlers, matemática, transformação, profundidade/parallax, Stage, timeline, Preview ou Export. Aprovação visual final permanece dependente de publicação na `main` de teste e validação de Roberto em iPhone/Safari real.

## Atualização 2026-08-08 — v8z4b32E8T em PR

- Base confirmada: `main` após o merge da PR #479, no commit `2defcfd2462a23ffc8bf3289a2db19009632ec55`, baseline aprovada `v8z4b32E8S`.
- A `v8z4b32E8T` faz os steps e o Reset dos painéis contextuais de Escala e Rotação de Ativos reutilizarem as métricas CSS canônicas dos controles equivalentes de Frames, preservando a identidade roxa dos Ativos e a ciano dos Frames.
- Matemática, handlers, slider, Profundidade, Frames, Preview/Export e persistência permanecem fora do diff funcional. WebKit automatizado em viewport de 390 px protege geometria, overflow, deltas, Undo/Redo/Reset e exclusividade dos modos; aprovação visual publicada em iPhone/Safari real permanece com Roberto.

## Atualização 2026-08-08 — v8z4b32E8S mergeada e aprovada visualmente

- A PR #478 foi mergeada na `main` de teste em 2026-08-08, no commit `18a03dadf13c40e34454181accda99f3b1189437`; a baseline de teste resultante é `v8z4b32E8S`.
- Roberto testou e aprovou visualmente a build publicada em iPhone/Safari real, no viewport 390 × 797, DPR 3, usando um projeto real com 9 image assets e 10 frames.
- O P1 que motivou a versão está resolvido na baseline de teste: após `Trocar imagem`, a fonte nova não regride para a fonte anterior em Save → Load nem em Session Autosave → Session Restore.
- O teste real confirmou Session Restore completo: `sessionRestoreCompleted = true`; `sessionRestoreAppliedSuccessfully = true`; `sessionRestoreAssetCount = 9`; `sessionRestoreHydratedAssetCount = 9`; `sessionRestoreLayerIdentitiesPreserved = true`; `sessionRestoreProjectWorldRestored = true`; `sessionRestoreNoPartialState = true`; `loadedAssetsCount = 9`; `loadedImageAssetsCount = 9`; `loadedHydratedImageAssetsCount = 9`; `loadedStableDrawableCount = 9`; `loadedBlankDrawableCount = 0`; `saveLoadRoundTripIssue = none`.
- A E8S passa a ser a baseline funcional visualmente aprovada corrente do repositório de teste.
- A aprovação da baseline de teste não autoriza promoção automática para produção. `rowestudio/arco-app` permanece dependente de decisão explícita de Roberto e PR separada.

## Atualização 2026-08-07 — v8z4b32E8Q mergeada e aprovada visualmente

- A PR #475 foi mergeada na `main` do repositório de teste no commit `cfef63c74ff90d50d472884d79f3a8a47597362c`.
- A versão atual da base de teste é `v8z4b32E8Q`.
- A `v8z4b32E8Q` consolida Frames e Ativos na mesma apresentação de bottom sheet contextual compacto, com largura total, superfície própria, cantos superiores arredondados e substituição estrutural da toolbar normal.
- A troca entre Câmera/Frames e Ativos fecha o painel do modo anterior; ações individuais de Ativo exigem `selectedAssetId` canônico válido e nenhum painel de Ativo abre sem alvo.
- O ponto laranja da timeline deriva do mesmo eixo geométrico canônico da faixa rolável usado para centralização, sem offset compensatório.
- O estado pronto de Preview/Export volta a usar o ciano fixo aprovado do Arco, independente da cor do modo, sem mudança no renderer, WebCodecs ou download.
- Roberto testou a build publicada em iPhone/Safari real e aprovou visualmente a `v8z4b32E8Q`, que passa a ser a baseline funcional visualmente aprovada corrente do repositório de teste.
- Após essa aprovação, Roberto identificou uma omissão localizada no painel Escala de Ativos: a implementação atual exibe slider, valor e Reset, mas os botões auxiliares de ajuste esperados não estão presentes. Essa pendência pequena e isolada será analisada e especificada em tarefa funcional posterior; ela não está resolvida, não reprova a `v8z4b32E8Q`, não invalida as demais correções aprovadas e não integra esta consolidação documental.
- A aprovação da baseline de teste não autoriza promoção automática para `rowestudio/arco-app`. Produção continua exigindo decisão explícita de Roberto e PR de promoção separada.

## Atualização 2026-08-07 — v8z4b32E8P em PR

- Base confirmada: `main` após o merge da `v8z4b32E8O`, no commit `ea4b8f7`.
- A `v8z4b32E8P` corrige exclusivamente a ocupação estrutural dos painéis contextuais de Escala, Rotação e Profundidade no Modo Ativos.
- Causa: o painel ocultava `#toolbar`, mas permanecia restrito à célula direita da quarta linha de `#lowerContextSlot`; a célula esquerda `.lower-global-duration` (botão Edição) continuava no grid, enquanto o próprio botão `.asset-context-back` conservava a aparência branca nativa de `<button>`, formando o quadrado residual mostrado na referência.
- Correção: o estado `asset-context-panel-open` passa a reutilizar no `#lowerContextSlot` a mesma expansão `grid-column: 1 / 3` e `grid-row: 3 / 5` do painel contextual expandido de Frames, substituindo a faixa normal; a seta reutiliza o tratamento neutro aprovado de `#custBarBack`, sem alterar os controles ou a matemática de transformação.
- Estado: correção em PR; validação visual publicada em iPhone/Safari real permanece obrigatória. Nenhuma promoção para produção está autorizada.

## Atualização 2026-08-06 — v8z4b32E8O em PR

- A `v8z4b32E8N` teve o conceito e o motor de parallax manual aprovados em teste visual no iPhone/Safari; permaneceu uma regressão de integração do Stage, em que o contorno acompanhava a câmera mas a imagem DOM não era recalculada na navegação da timeline.
- A `v8z4b32E8O` consolida uma geometria visual única para imagem, seleção, alças e hit-test do Stage e restaura painéis contextuais exclusivos de Escala, Rotação e Profundidade na região inferior existente.
- Revisão P1: o controle contextual de escala passa a medir 100% contra o baseline fitted canônico em coordenadas do ProjectWorld, não contra pixels naturais da fonte.
- Revisão P1: o Stage recalcula imediatamente a geometria visual derivada de parallax quando a câmera/frame ativo muda sua geometria sem troca de índice.
- `depth` permanece resposta aparente ao movimento da câmera e `zIndex` permanece ordem de sobreposição; nenhum deles deriva ou reescreve o outro.
- A compatibilidade futura permanece: grupos de frames operam sobre câmera, Frames, curvas e tempo sem reescrever profundidade dos assets.
- Estado: correção em PR; QA WebKit e validação visual publicada em iPhone/Safari real permanecem obrigatórios. A E8O não está aprovada e nenhuma promoção para produção está autorizada.

## Atualização 2026-08-06 — OPS-04 em PR

- A OPS-04 restaura o fluxo operacional mobile-first de CI para PRs abertas contra `main` quando eventos `pull_request` não associam automaticamente `QA Guardrails` e `WebKit Smoke Tests` ao HEAD atual.
- Arquitetura escolhida: workflow `Mobile CI Watchdog` em `schedule` moderado e `workflow_dispatch` administrativo, detectando PRs abertas, HEAD SHA corrente e evidência já existente por SHA antes de criar check-runs explícitos via Checks API.
- O watchdog preserva os workflows normais `QA Guardrails` e `WebKit Smoke Tests`; quando eles já existem para o SHA, a OPS-04 não duplica execução. Quando faltam, executa os comandos originais no checkout exato do HEAD da PR e finaliza check-runs no mesmo SHA.
- Revisão bloqueante antes do merge: o watchdog transporta `title` e `body` reais da PR na matriz e define `QA_PR_TITLE`/`QA_PR_BODY` a partir desses metadados, preservando texto multilinha e caracteres especiais para `check-app-version.mjs`.
- Frequência: a cada 30 minutos, com `concurrency` global do workflow e concorrência por PR/suíte/SHA para evitar duplicidade. Novo SHA é elegível para nova validação; resultado de SHA anterior não libera SHA novo.
- Segurança: metadados e finalização usam `contents: read`, `pull-requests: read`, `actions: read` e `checks: write` apenas onde necessário. Checkouts usam `persist-credentials: false`; forks e repositórios externos são ignorados pela automação.
- Recuperação: se o watchdog falhar, executar manualmente `Mobile CI Watchdog` pela aba Actions como ação administrativa; se a Checks API estiver indisponível, a falha fica visível no próprio workflow e não deve ser simulada como sucesso.
- Classificação: infraestrutura crítica de CI/CD, sem alteração funcional do Arco Motion App e sem alteração de `APP_VERSION` ou `APP_VERSION_NAME`.

## Atualização 2026-08-19 — OPS-05 em PR (WebKit/Linux bounded + Watchdog resiliente)

- A OPS-05 corrige o incidente em que o job `WebKit Smoke Tests` (Ubuntu) ficava preso em `npx playwright install --with-deps webkit` sem alcançar a suíte funcional, enquanto o `Real Export Smoke (WebKit macOS)` concluía normalmente — incidente de infraestrutura/instalação, não regressão de produto.
- Execução bounded no Linux: `smoke-tests.yml` recebe `timeout-minutes: 25` no job WebKit e `timeout 12m` na instalação; estouro encerra com exit code real, nunca convertendo erro em PASS.
- Aplicabilidade conservadora: Browser Smoke é pulado apenas quando TODOS os arquivos alterados são non-runtime (`docs/**`, `.agents/**`, `.claude/**`, Markdown); qualquer runtime/teste/workflow/package/desconhecido mantém a suíte. `QA Guardrails` continua obrigatório.
- Watchdog resiliente: distingue `success`, `terminal-failure`, `active-fresh`, `active-stale`, `missing` e `not-applicable`; `in_progress` não é saudável para sempre (`STALE_ACTIVE_MS = 60 min`, coerente com o cap de 25 min); falha terminal não vira loop de rerun; a suíte WebKit do watchdog é o gate canônico `--project=webkit-mobile-smoke --workers=1 --retries=0`. Política de SHA preservada.
- Classificação: infraestrutura de CI/CD, sem alteração funcional do Arco Motion App e sem alteração de `APP_VERSION` ou `APP_VERSION_NAME`. Detalhes em `docs/QA_STRATEGY.md` e `docs/DECISIONS.md` (DEC-2026-08-19-01).

## Atualização 2026-08-06 — v8z4b32E8N em PR

- Base funcional restaurada: `v8z4b32E8I`, após as reversões das PRs #467 e #461 no repositório de teste.
- A `v8z4b32E8N` adiciona `depth` finito, persistente e independente à imagem, com padrão zero e controle contextual de -100 a +100 no Modo Ativos.
- O parallax inicial é exclusivamente translacional e usa um helper compartilhado no momento do render; não grava o deslocamento aparente em `worldX`, `worldY`, Frames, curvas ou ProjectWorld.
- A referência neutra é o centro da célula principal canônica do ProjectWorld, estável entre Stage, Preview, Export, Save/Load e Session Restore.
- Estado: implementação técnica em PR; QA automatizado e teste visual publicado em iPhone/Safari real permanecem pendentes. O recurso não está aprovado e nenhuma promoção para produção está autorizada.

## Estado auditado

- Repo de desenvolvimento/teste: `rowestudio/arco-app-test`.
- Branch base: `main`.
- HEAD auditado do teste: `9d81fcf0ede89806debc3a42761c846edb642613`.
- Versão corrente do teste: `v8z4b32E8F` (base da E8G em desenvolvimento).
- Repo estável/produção: `rowestudio/arco-app`.
- HEAD auditado de produção: `626327280e3a4126fac259e205bbe0bdf3cc8719`.
- Versão de produção: `v8z4b32E7H`.
- Origem dos dados de produção: auditoria comparativa realizada antes da OPS-01; não revalidado nesta PR.

## Fluxo confirmado

Teste → aprovação de Roberto → promoção para produção.

`v8z4b32E7X` contém evoluções posteriores à produção `v8z4b32E7H`.

Nenhuma promoção está autorizada nesta PR.

Status atual: OPS-02 integrada via PR #439, merge commit `52e4f917e28f148278ba8fc135a0f9a8d4c1eacb`, como infraestrutura de QA com guardrails estáticos, fixtures controladas e self-tests versionados. A execução final da PR do workflow QA Guardrails passou; esse workflow é disparado por `pull_request` ou `workflow_dispatch`, portanto este documento não afirma execução automática no merge commit. Nenhuma promoção está autorizada.

OPS-03 foi integrada via PR #446, merge commit `5d4ebf0b3af48501f61c33c6a20eee67617c3458`, como fechamento inicial dos smoke tests automatizados com Playwright/WebKit. A execução da PR dos WebKit Smoke Tests passou e gerou artifact de screenshot. WebKit automatizado em Linux é evidência operacional útil, mas não substitui validação real em iPhone/Safari. Nenhuma promoção está autorizada.

OPS documental v8z4b32E7X incorporou ao Project OS o backlog de produto recuperado das conversas do projeto Arco Motion App em `docs/PRODUCT_ROADMAP.md`. Esse registro é documental e rastreável, não altera fatos de produção, não altera a versão do app, não modifica OPS-02/OPS-03 e não implica autorização de implementação de todos os itens listados.

## Atualização 2026-07-22 — v8z4b32E7Y reprovada visualmente

- PR #449 mergeada na main de teste com a versão `v8z4b32E7Y`.
- A versão `v8z4b32E7Y` foi reprovada visualmente porque os Ativos passaram a exibir quatro abas decorativas sobre o sistema antigo, mantendo alça antiga de rotação, alça antiga de escala, cinco controles visuais e círculos entrando na imagem.
- Decisão: não reverter imediatamente a PR #449, pois a implementação é incompleta e visualmente reprovada, mas estável e aproveitável para correção sobre a main atual.
- `v8z4b32E7Z` passa a ser a correção em desenvolvimento para concluir a paridade funcional e visual das alças de Ativos com o modelo aprovado dos Frames e registrar as novas decisões operacionais no Project OS.
- Pendente após merge/publicação: validação visual em iPhone/Safari real antes de considerar a versão aprovada por Roberto.


## Atualização 2026-07-28 — v8z4b32E8A em PR

- Base confirmada: `main` no HEAD `6df20c42b6a5192dba2279c0dfff71bd0a1f5ea0`, versão `v8z4b32E7Z`.
- A `v8z4b32E8A` remove na origem o HUD informativo redundante preso aos Frames no Stage, preservando a faixa informativa existente acima da timeline e os elementos funcionais dos Frames.
- Classificação: ajuste visual cirúrgico de UI, sem alteração de Preview, Export, renderer, ProjectWorld, Save/Load, timeline ou motor de Frames.
- Estado: PR técnica em preparação no repositório de teste; nenhuma promoção para produção autorizada.
- Aprovação visual final: pendente de merge, publicação na `main` de teste e validação de Roberto em iPhone/Safari real.

## Atualização 2026-07-28 — v8z4b32E8B em PR

- Base confirmada: `main` no merge commit da PR #451, HEAD `e60f62fcce214a791b66de60189573f735e5a227`, versão `v8z4b32E8A`.
- A `v8z4b32E8B` consolida `selectedAssetId` como identidade canônica da seleção de Ativos entre Stage, Layers, faixa contextual, toolbar, contorno e reorder.
- Causa encontrada: embora já existisse um resolvedor por ID, entradas de seleção ainda escreviam diretamente em `selectedAssetId`/`selectedImageAssetId`, linhas de Layers não expunham o ID no DOM e não havia verificação observacional comum após reconstrução/reorder; além disso, Layers numerava “Imagem N” pela ordem visual enquanto o contexto resolvia o nome pela ordem do array, permitindo rótulos diferentes para o mesmo asset.
- A regra de nomenclatura “Imagem N” foi preservada e nomes persistentes não foram adicionados; a correção desta PR opera exclusivamente sobre identidade por `asset.id`.
- Classificação: bug funcional de seleção e sincronização, risco médio nas interações Stage/Layers/toolbar/reorder.
- Estado: PR técnica em preparação no repositório de teste; nenhuma promoção para produção autorizada.
- Aprovação visual final: pendente de merge, publicação na `main` de teste e validação de Roberto em iPhone/Safari real, inclusive com o projeto complexo de 9 assets.

## Atualização 2026-07-28 — v8z4b32E8C em PR

- Base confirmada: `main` no HEAD `64452debc54e75b46dd237aea8ea0e2d3a5d1de3`, versão `v8z4b32E8B`.
- A `v8z4b32E8C` corrige a preparação compartilhada de Preview/Export para aceitar um `stableDrawable` válido sem exigir simultaneamente decode da fonte viva, e tenta reidratação persistente antes de declarar `asset-not-ready`.
- Causa raiz: a preparação anterior passava toda fonte, inclusive `stableDrawable` já válido, novamente pelo caminho genérico de decode e fazia `allReady` depender de `decodeReady`; assim era possível observar 9 drawables válidos, apenas 8 assets classificados como decoded e abortar a sessão inteira.
- Falha continua explícita e não reduz a contagem visível: snapshot parcial é descartado e estados de loading/locks são liberados para nova tentativa sem reload.
- Aprovação visual final e confirmação 9/9 do projeto real, inclusive do asset `img-1781622678250-715`, permanecem pendentes de merge/publicação e teste em iPhone/Safari real por Roberto.


## Atualização 2026-07-28 — v8z4b32E8D em PR

- Base confirmada: `main` no merge commit da PR #453, HEAD `62d401173caa7c1bafd5f2f191bb454af38e17ec`, versão `v8z4b32E8C`.
- A `v8z4b32E8D` atribui a cada image asset um nome `Camada N` persistente e independente de posição/`zIndex`, com contador monotônico salvo no projeto.
- Projetos antigos recebem migração determinística e não destrutiva; Save/Load, exclusão, reorder e seleção canônica preservam a identidade por asset.
- Aprovação visual final permanece pendente de merge/publicação e validação em iPhone/Safari real por Roberto. Nenhuma promoção para produção está autorizada.

## Atualização 2026-07-29 — v8z4b32E8E mergeada e validada

- A PR #455 foi mergeada na `main` de teste no commit `bed53f960427f18d128d50922daf10d435fa6cdc`, versão `v8z4b32E8E`.
- Roberto aprovou em iPhone/Safari real Session Autosave, Session Restore, preservação de ProjectWorld e Save/Load.
- Export foi aprovado e permanece fluido; o MP4 não apresenta a pequena travada observada exclusivamente no início do Preview.
- A pendência isolada confirmada em projetos diferentes é a pequena travada perceptível no primeiro início do Preview.

## Atualização 2026-07-29 — v8z4b32E8F em PR

- Base de conteúdo confirmada no commit da `main` informado para a tarefa, `bed53f960427f18d128d50922daf10d435fa6cdc`, versão `v8z4b32E8E`; o clone não possuía referência local `main`, mas o `HEAD` de trabalho correspondia exatamente ao commit obrigatório.
- A `v8z4b32E8F` limita-se ao preflight/warm-up do Preview: o relógio e o loop só são liberados após render canônico bem-sucedido de `t=0` e ciclos posteriores de composição, com falha/cancelamento liberando retry.
- Export, WebCodecs, câmera, sampler, matemática do renderer, Save/Load e Session Autosave/Restore permanecem fora do diff funcional.
- Estado: correção em PR no repositório de teste; aprovação visual permanece pendente de merge/publicação e validação por Roberto em iPhone/Safari real. Nenhuma promoção para produção está autorizada.

## Atualização 2026-07-29 — v8z4b32E8F mergeada e v8z4b32E8G em desenvolvimento

- A PR #456 (`v8z4b32E8F`) foi mergeada na `main` de teste no commit `9d81fcf0ede89806debc3a42761c846edb642613`.
- Roberto reprovou visualmente a E8F: a pequena travada inicial persistiu tanto no projeto com 9 ativos (~69 MB por checkpoint) quanto no projeto com 4 ativos (~53 MB).
- Os diagnósticos comprovaram que o primeiro frame `t=0` foi renderizado e composto antes do relógio; essa hipótese fica encerrada como causa da travada observada.
- A `v8z4b32E8G` isola Session Autosave de Preview/Export, removendo o disparo global por `pointerup` e adiando checkpoint pendente sem perda de revisão.

## Atualização 2026-07-30 — v8z4b32E8G aprovada em observação no teste publicado

- No primeiro teste publicado da E8G no iPhone/Safari/PWA, Roberto confirmou Preview sem a travada inicial e Session Autosave funcionando normalmente; após fechar completamente e reabrir o PWA, o último projeto foi restaurado normalmente.
- A E8G fica aprovada em observação no repositório de teste. Repetições com projetos de tamanhos diferentes continuam recomendadas e nenhuma promoção para produção está autorizada.

## Atualização 2026-07-29 — v8z4b32E8G mergeada e v8z4b32E8H em desenvolvimento

- Base confirmada no merge commit da PR #457, `e76ad1987f267d6f7a63df6529b2e8c6c6abbad0`, versão `v8z4b32E8G`.
- A `v8z4b32E8H` substitui a recarga direta por uma escolha explícita entre concluir o checkpoint e restaurá-lo ou apagar somente a sessão automática e abrir o launcher limpo.
- As duas operações aguardam IndexedDB, são mutuamente exclusivas e usam intenção de startup isolada e de uso único; falhas mantêm a abertura atual sem recarga silenciosa.
- Preview, Export, WebCodecs, renderer, Save/Load manual, schema do projeto, Frames, Layers e ProjectWorld permanecem fora do diff funcional. Validação em iPhone/Safari/PWA real continua obrigatória.

## Atualização 2026-07-30 — v8z4b32E8H aprovada e v8z4b32E8I em desenvolvimento

- A PR #458 foi mergeada na `main` de teste no commit `0d8edd33f4d4e236eb3f7a894cdb700db8785c6c`, versão `v8z4b32E8H`.
- Roberto aprovou no teste publicado em iPhone/Safari/PWA os dois caminhos de Recarregar: restaurar sessão e reiniciar do zero. Tela branca/HTML bruto não foi reproduzido, e Preview, Export e Save/Load permaneceram preservados.
- A `v8z4b32E8I` altera somente a abertura normal: sem intenção explícita da E8H e com checkpoint automático completamente válido, o launcher pergunta se deve continuar a sessão anterior ou descartar somente o checkpoint e permanecer no início.
- As intenções explícitas `restore` e `clean` da E8H continuam prioritárias e não abrem uma segunda pergunta. Nenhuma promoção para produção está autorizada.
- O relato isolado sobre intenção escala × rotação de Frames ocorreu em um arquivo específico, não voltou a ser reproduzido e permanece em observação; não integra o escopo da E8I e não autoriza alteração ou PR de Frames nesta versão.
- A revisão da PR #459 substitui o harness paralelo por execução em `vm` dos controladores reais do `index.html`, cobre startup e IndexedDB reais no smoke WebKit e adiciona feedback visual aguardável dentro do modal durante restore/clear, sem novo bump de versão ou mudança na arquitetura funcional.
- A revisão funcional seguinte identificou a causa exata do falso negativo da recuperação: `applyProjectData()` inicia a carga assíncrona da imagem e retornava antes de `applyFrameData()` concluir, portanto `restoreLastSessionAutosave()` consultava `sessionRestoreCompleted` ainda em `false`, mesmo com o editor sendo aplicado logo depois. O restore agora aguarda o callback final da aplicação, separa sucesso operacional das métricas observacionais de paridade e mantém rollback recuperável em falha; a validação automatizada em WebKit permanece responsabilidade do workflow e a validação em iPhone/Safari/PWA real continua pendente.

## QA E8X — split de navegador

A cobertura permanente separa capacidade funcional de Text Asset (WebKit/Linux até Preview real) da capacidade nativa de Export H.264 (WebKit/macOS). Chrome 150/Linux foi rejeitado como gate por retornar H.264 não suportado. O crash da consulta H.264 foi reproduzido na `main` sem texto; portanto, não é tratado como regressão funcional E8X. Aprovação em iPhone/Safari real permanece pendente e obrigatória.

## Atualização 2026-08-13 — v8z4b32E8Y em desenvolvimento

- O Text Asset da E8X passa a usar um editor tipográfico único nos modos `create` e `edit`, aberto por **Editar** na toolbar contextual ou por dois taps concluídos no mesmo texto.
- O draft isolado substitui visualmente o alvo somente no Stage; Cancelar descarta a sessão e Concluir atualiza o mesmo asset com um único Undo e uma única revisão de Session Autosave apenas quando há mudança.
- `fontKey`, família resolvida, `fontWeight`, `fontStyle` e `textAlign` são normalizados, persistidos e compartilhados por Stage, Preview e Export. Aprovação final permanece dependente de publicação e validação por Roberto em iPhone/Safari real.

## Revisão bloqueante 2026-08-13 — v8z4b32E8Y na PR #488

- A mesma versão E8Y mantém as tabs semânticas e corrige os locators Playwright para `role="tab"`.
- Eventos `change` originados no editor enquanto há draft deixam de criar revisão de Session Autosave; os testes comparam `undoStack`, `_sessionAutosaveQueuedRevision`, payload canônico e snapshot real em Cancelar, commit alterado e commit sem alteração.
- `#textCreationSheet` passa a capturar ponteiros e toque em toda a viewport, mantendo o Stage visível e os controles/rolagem horizontal internos operáveis, sem permitir pan, zoom ou edição atrás do sheet.
- Esta revisão atualiza somente a PR #488; produção e merge continuam não autorizados.

## Revisão final de bloqueadores da v8z4b32E8Y na PR #488

- Undo e Redo passam a comparar o snapshot canônico completo antes/depois da restauração e agendam uma revisão de Session Autosave para toda mudança real, mantendo o diagnóstico específico de fonte de imagem sem usá-lo como condição exclusiva.
- `pointercancel` encerra o gesto de asset como cancelado, limpa o tap pendente, restaura um movimento parcial sem histórico e nunca participa da contagem de dois taps concluídos.
- O gate funcional escolhe um ponto de imagem confirmado por `hitTestAssetAtWorld()` e compara o Undo tipográfico com o estado pós-drag, preservando a entrada de movimento anterior.

## Correção do gate WebKit 15/16 na v8z4b32E8Y

- A comparação de Undo/Redo deixa de reutilizar o snapshot reduzido de Reset e passa a usar fingerprint canônico dedicado, incluindo assets, tipografia, ProjectWorld, ordem e identidade de Layers, sem DOM/bitmaps/caches.
- Cancelamento de escala e rotação restaura o snapshot inicial e termina sem Undo ou Session Autosave, como já ocorria no cancelamento de movimento/tap.
- O gate lê e aplica o checkpoint IndexedDB real após Undo e Redo, comprovando paridade do estado restaurado, e mantém a versão E8Y da PR #488.

## Ajuste final do gate funcional E8Y

- O teste de transformação cancelada readquire o Text Asset por `id` após cada `restoreState()`, evitando observar uma referência stale removida de `assets`.
- Checkpoints de Undo e Redo são capturados antes de qualquer restore; o Redo roda com a pilha íntegra, e somente depois ambos os checkpoints são aplicados e validados com retorno de sucesso.
- Movimento parcial cancelado também percorre listeners reais de pointer e comprova geometria, histórico, revisão e estados de gesto intactos.

## Ajuste pós-Session Restore no gate E8Y

- O teste respeita o comportamento existente de Load/Restore voltar ao Modo Câmera e limpar seleção: reentra publicamente em Ativos, readquire o DOM do Text Asset restaurado, toca para selecionar e só então valida **Editar** e o commit sem alteração.
- Nenhum comportamento de Session Restore, modo ou seleção foi alterado no produto para acomodar o teste.

## Atualização 2026-08-13 — v8z4b32E8Z em desenvolvimento

- A E8Z adiciona ao Text Asset a caixa canônica `block`, com fundo sólido opcional, opacidade independente e padding fixo em `em`, preservando wrapping e centro ao alternar o fundo.
- Stage e o compositor Canvas compartilhado por Preview/Export usam o mesmo modelo persistido. Padding customizável, estilos por linha, presença temporal e animação permanecem futuros e separados.
- A revisão geral de interface/contraste permanece tarefa separada e não bloqueia esta entrega funcional.
