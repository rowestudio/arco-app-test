# QA pendente — v8z4b29BP: painel "Edição de Tempo" com abas Tempo e Preferências

> Base: v8z4b29BO (aprovada — Tremor Global do projeto + Frequência + modo por trecho). Esta versão é uma **reorganização visual/UX** do painel aberto pelo item "Edição" do menu inferior. Não há mudança de motor, JSON, export, multi-cena nem na lógica de cálculo de tempo — apenas a apresentação foi reorganizada.

## Escopo v8z4b29BP

- Renomeia o painel (antigo "Duração", aberto por `openPanel('Duration')`) para **Edição de Tempo**, preservando o botão de fechar/confirmar e o item "Edição" (ícone `director-chair`) no menu inferior.
- **Resumo fixo no topo**: Duração Total, Trechos, Pausas e Acabamento. Reaproveita os elementos `durSummaryTotal/Move/Pauses/Finish`, atualizados por `syncDurationUI()` a partir de `getDurationParts()` — nenhuma fórmula de cálculo foi alterada.
- **Abas Tempo / Preferências** (`switchDurTab`): a aba Tempo abre por padrão; trocar de aba não fecha o painel, não altera a seleção de frame/trecho e não toca no estado — apenas alterna a visibilidade e re-sincroniza os controles exibidos.
- **Aba Tempo**:
  - **Cena 1** (agrupamento visual preparatório — multi-cena NÃO é real): sequência intercalada `F1, 1–2, F2, 2–3, …` montada por `renderCena1Sequence()`, reaproveitando `buildFramePauseRow()` (pausas) e `buildSegDurationRow()` (durações de trecho). Os sliders escrevem nos mesmos estados `framePauses[]` / `segDurations[]` / `loopDuration` e usam o mesmo wiring de undo/preview de antes.
  - **Filtro** Todos / Frames / Trechos (`setCena1Filter`): radio simples via classe no container (`flt-all|frames|segs`), sem estado ambíguo (nunca tudo desligado).
  - **Controles globais** permanecem na aba Tempo: Trechos – Duração (Intervalo padrão, Total, Igualar intervalos), Frames – Pausas (Tudo, Zerar pausas) e Acabamento (Nenhum/Loop/Pausa final + tempos).
- **Aba Preferências**:
  - **Movimento — Distribuição do tempo**: botões Manual / Velocidade constante (`btnTimingManual`/`btnTimingConstant`) movidos para cá (lógica `setSegmentTimingMode`/`syncTimingModeUI` inalterada, id-based).
  - **Tremor Global do projeto**: bloco (toggle + Intensidade + Frequência) reposicionado de `panelEase` para a aba Preferências. O motor do Tremor, o JSON e o Tremor **por trecho** (que continua em `panelEase`) NÃO foram alterados; toda a sincronização (`syncTremorPanel`/`_initTremorListeners`) é id-based e segue funcionando.
  - Espaço reservado para preferências futuras. **Movimento Inteligente** permanece no painel de Movimento de cada trecho (posição contextual mais limpa).
- Preserva Stage, timeline, frames/trechos no Stage, curvas/Bézier, seleção (simples/múltipla), Preview, export MP4, JSON (antigo e novo), templates, formato, launcher, logo, ícone iOS, ícones Iconoir e o motor de renderização. Não implementa Cena 2, múltiplas imagens, transição entre cenas, rótulos coloridos, Variação do Tremor nem Tremor em pausa.

Checklist detalhado: ver `docs/QA-v8z4b29BP.md`.

---

# QA pendente — v8z4b29BO: Tremor Global do projeto + Frequência + modo por trecho

> Base: v8z4b29BN (aprovada — efeito experimental de Tremor/handheld por trecho). Esta versão evolui apenas a camada procedural de Tremor criada na BN, sem refatorar o motor: separa Intensidade (amplitude) de Frequência (velocidade/quantidade de tremidas), adiciona um Tremor Global no nível do projeto e permite que cada trecho use Global, fique Desligado ou tenha configuração Personalizada. Preview e MP4 continuam determinísticos.

## Escopo v8z4b29BO

- Adiciona `projectShake = { enabled:false, intensity:0.4, frequency:1.0 }` (Tremor Global do projeto). Por padrão desligado; projetos antigos sem o campo abrem com Global desligado (mesmo visual de antes).
- Evolui `segTremorSettings[i]` para `{ mode:'global'|'off'|'custom', intensity, frequency }`. Migração segura do JSON da v8z4b29BN (`{enabled,intensity}`): `enabled:true` → `custom`; `enabled` false/ausente → `global` (Global desligado por padrão preserva o visual). Novos trechos nascem em `global`.
- Adiciona Frequência (0.5–8.0) ao motor: a frequência multiplica a velocidade angular das senoides do ruído (sem `Math.random`), mantendo movimento suave/orgânico e 100% determinístico — Preview = MP4, repetir Preview não muda o efeito. Intensidade continua controlando a amplitude (≤2% do quadro / ≤0,5° de rotação no máximo).
- `resolveSegTremor(cfg)` é a fonte única de verdade: combina o modo do trecho com o Global e devolve `{active,intensity,frequency}`. O motor (`applySegTremorLayer`) e a UI usam o mesmo resolvedor.
- UI no painel de Edição/Movimento (`panelEase`), seção "Tremor": (1) toggle "Tremor Global" + sliders Intensidade e Frequência (Lenta ←→ Rápida); (2) por trecho, chips de modo Global/Desligado/Personalizado; no modo Global mostra nota de herança e oculta sliders locais; no modo Personalizado mostra Intensidade e Frequência próprias; Desligado não treme.
- Persistência: `projectShake` e `segTremorSettings` (com `mode/intensity/frequency`) salvos/lidos no JSON, incluídos em undo/redo e resets de novo projeto. JSON antigo e JSON da BN abrem sem erro.
- Não redesenha página inicial, Edição, templates nem o fluxo Novo Projeto; mantém nome "Edição", ícone director-chair, demais ícones, Stage, timeline, curvas, Preview e export. Sem zoom automático global novo.

Checklist detalhado: ver `docs/QA-v8z4b29BO.md`.

---

# QA pendente — v8z4b29BN: efeito experimental de Tremor (câmera na mão) por trecho

> Base: v8z4b29BM (aprovada — logo no launcher, apple-touch-icon e "Tempo" → "Edição"). Esta versão adiciona uma função experimental de motor: um efeito opcional de tremida/manual por TRECHO, aplicado como camada procedural sobre o movimento já calculado, sem criar frames e sem alterar frames/curvas/timeline. Escopo pequeno, isolado e reversível (desligar o Tremor reproduz exatamente o comportamento anterior).

## Escopo v8z4b29BN

- Adiciona `segTremorSettings[]` (array paralelo por trecho, espelhando `segBlurSettings`), com `{ enabled:false, intensity:0.4 }` por padrão. Projetos antigos sem o campo abrem com Tremor desligado.
- Motor: `getStateAtT(t)` passa a ser uma fina camada que aplica o Tremor sobre o estado base (renomeado para `getStateAtTBase(t)`, que mantém o motor original intacto). O Tremor perturba só `cx`/`cy` (deslocamento) e `rot` (rotação leve); escala não é tocada.
- O efeito é determinístico: oscilação por soma de senoides incomensuráveis em função do tempo absoluto (sem `Math.random`), com envelope de extremidade (fade-in/out por trecho) que zera o offset nos keyposes — frames reais permanecem exatos e não há salto entre trechos. Preview e MP4 usam a mesma função, casando visualmente.
- Limites internos de segurança: deslocamento ≤ 2% do tamanho do quadro e rotação ≤ 0,5° na intensidade máxima; envelope evita revelar bordas nos pontos de quadro.
- UI: no painel de Edição/Movimento do trecho (`panelEase`), adiciona a seção "Tremor" com toggle e slider "Intensidade" (0–100%), que só aparece quando o Tremor está ligado. Atua sobre o trecho selecionado (`_activeEaseSeg`), nunca sobre o projeto inteiro ou frame individual.
- Persistência: `segTremorSettings` é salvo/lido no JSON, incluído em undo/redo (captureState/restoreState/clone), reset e templates. Carregar JSON antigo continua funcionando (Tremor desligado por ausência do campo).
- Preserva motor, frames, posição/curvas/timeline, launcher, fluxo Novo Projeto/Abrir Projeto, Preview básico, export MP4 (exceto inclusão do efeito quando ativo), templates, ícones e seleção múltipla.

Checklist detalhado: ver `docs/QA-v8z4b29BN.md`.

---

# QA pendente — v8z4b29BM: logo no launcher, apple-touch-icon e renomeação "Tempo" → "Edição"

> Base: v8z4b29BL (aprovada — sincronização do frame ativo entre Stage/timeline/label/controles). Esta versão faz três ajustes pontuais: insere o logotipo do Arco Motion no launcher, configura o ícone do app para iOS via `apple-touch-icon.png` local, e renomeia o item "Tempo" (ícone `director-chair`) para "Edição", sem alterar função.

## Escopo v8z4b29BM

- Adiciona `<img class="launcher-logo" src="assets/brand/arco-logo-white.svg">` na tela `#startLauncher`, centralizado e acima dos botões "Novo Projeto"/"Abrir Projeto"/"Recarregar", com CSS mínimo (`.launcher-logo`).
- Atualiza o `<head>` para usar `assets/icons/apple-touch-icon.png` como `apple-touch-icon` local (substitui o ícone embutido em base64) e ajusta `apple-mobile-web-app-title` para "Arco Motion".
- Renomeia o rótulo visível do botão de Duração geral (4ª linha do menu inferior, ícone `i-director-chair`) de "Tempo" para "Edição", preservando `onclick="openPanel('Duration')"` e o painel de Duração.
- Preserva Stage, timeline, frame ativo, sincronização frame ativo/timeline, launcher (exceto logo), fluxo Novo Projeto/Abrir Projeto, Preview/export, JSON, templates e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BM.md`.

---

# QA pendente — v8z4b29BL: sincronização do frame ativo (Stage/timeline/label/controles)

> Base: v8z4b29BK (aprovada — ícones Iconoir cinema-old e director-chair). Esta versão corrige a divergência visual entre o frame ativo no Stage, o frame destacado na faixa/timeline, o label inferior e os controles de edição.

## Escopo v8z4b29BL

- Unifica a fonte de verdade do frame ativo: `getTimelineStageFocusIndex()` passa a refletir sempre `activeIdx`, eliminando o estado paralelo de "foco" da timeline que podia divergir do frame ativo oficial.
- Ao tocar em um frame na faixa/timeline, ele vira o frame ativo oficial e o Stage, o label inferior e os controles passam a refletir esse mesmo frame imediatamente.
- Ao tocar/selecionar um frame no Stage (incluindo abas de rotação/escala/handles), o mesmo frame passa a ser destacado na timeline e no label inferior.
- Ao centralizar um frame na timeline por scroll/scrub, esse frame também passa a ser o frame ativo oficial (Stage, label e controles seguem).
- Remove o destaque "fantasma" (pill laranja "selecionado" simultâneo ao pill "ativo" ciano) ao trocar de frame ativo.
- Preserva seleção múltipla, edição de trecho (label "Trecho X–Y" e botões contextuais), Preview, ícones Iconoir (cinema-old, director-chair), Stage, timeline, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BL.md`.

---

# QA pendente — v8z4b29BK: ícones Iconoir cinema-old e director-chair

> Base: v8z4b29BJ (aprovada — ajustes finos de UI/UX e ícones de Arquivos/Tempo já trocados, mas com formas próprias). Esta versão substitui apenas esses dois ícones pelos ícones individuais do Iconoir, sem regressões.

## Escopo v8z4b29BK

- Substitui o ícone do botão "Arquivos" no menu superior pelo ícone Iconoir `cinema-old` (símbolo `i-cinema-old`), inline, com `currentColor`, mesmo tamanho/área de toque/estado ativo dos demais ícones do topo.
- Substitui o ícone do item "Tempo/Duração" na 4ª linha do menu inferior pelo ícone Iconoir `director-chair` (símbolo `i-director-chair`, conteúdo atualizado para o SVG do Iconoir), inline, com `currentColor`, mesmo tamanho/alinhamento/área de toque/estado ativo dos demais ícones da linha.
- Não importa a biblioteca Iconoir nem usa CDN; apenas os dois SVGs individuais foram copiados e adaptados inline.
- Preserva launcher → Novo Projeto → editor, Stage, timeline, templates, Preview/export, JSON, motor e todos os demais ícones.

Checklist detalhado: ver `docs/QA-v8z4b29BK.md`.

---

# QA pendente — v8z4b29BJ: ajustes finos de UI/UX e ícones

> Base: v8z4b29BI (aprovada — launcher separado do Stage, fluxo de Novo Projeto mais direto, bloqueio da interface durante confirmação/cancelamento de frame e criação funcional de projeto).

## Escopo v8z4b29BJ

- Reposiciona o aviso "Confirme ou cancele o frame atual." para uma área mais segura do Stage, sem sobrepor o pill de zoom nem colidir com o topo.
- Tocar em qualquer ação do menu superior (Voltar, Arquivos, Visualizar, Preview, Undo/Redo) fecha o painel de Duração/Tempo, se estiver aberto, antes de executar a ação.
- Alinha à esquerda os ícones contextuais de trecho (Tempo, Movimento) na 4ª linha do menu inferior, com o mesmo ritmo/compacidade dos ícones contextuais de frame.
- Aumenta levemente (≈2px) a largura visual de frames e trechos na faixa/timeline, sem alterar snap, posição das bolinhas, altura da timeline ou lógica de seleção.
- Troca o ícone de Arquivos no menu superior (claquete → rolo de filme), preservando função, tamanho, alinhamento e área de toque.
- Troca o ícone de Tempo/Duração na 4ª linha do menu inferior (relógio → cadeira de diretor), preservando função, tamanho, alinhamento e área de toque.
- Preserva launcher → Novo Projeto → editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BJ.md`.

---

# QA pendente — v8z4b29BI: remove etapa "Imagem" do Novo Projeto e bloqueia UI durante criação de frame

> Base: v8z4b29BH (não aprovada — duas pendências de fluxo/UX: etapa "Imagem" extra no Novo Projeto, e menus abrindo durante a criação/inserção de frame).

## Escopo v8z4b29BI

- Remove a etapa/página intermediária "Imagem" do fluxo Novo Projeto. O botão "Escolher imagem" passa a aparecer diretamente no painel Novo Projeto, depois de Formato e Template; tocar nele abre o seletor nativo do iOS/Safari sem trocar de tela.
- Ao escolher uma imagem válida, o painel Novo Projeto fecha, o projeto é criado (formato, template/Sem template → F1, frames, Stage, timeline, contador) e o editor/Stage abre.
- Durante criação/inserção de frame (estado "Confirme ou cancele o frame atual."), bloqueia toda a interface: menu superior, Arquivos/settings, painéis de Formato/Template/Imagem, Novo Projeto, Abrir Projeto, Salvar, Recarregar, Reset, Preview/Play, timeline, menu inferior e painéis de Tempo/Pausa/Rotação/Escala/Mover. Permite apenas Confirmar ou Cancelar o frame.
- Tocar em qualquer controle bloqueado mostra a mensagem "Confirme ou cancele o frame atual." sem abrir painel ou navegar.
- Confirmar ou cancelar o frame libera novamente toda a interface.
- Preserva launcher independente, separação launcher/Novo Projeto/editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BI.md`.

---

# QA pendente — v8z4b29BH: ajustes de UX sobre launcher/Novo Projeto/editor

> Base: v8z4b29BG (aprovada — separou launcher, Novo Projeto e editor/Stage em estados explícitos; fluxo Novo Projeto funcionou).

## Escopo v8z4b29BH

- Etapa Imagem do Novo Projeto mostra apenas o botão "Escolher imagem", removendo a duplicidade com o menu nativo de Fototeca/Tirar Foto/Escolher Arquivo do iOS/Safari.
- Launcher ganha ação discreta "Recarregar" abaixo de "Abrir Projeto", que recarrega o app e mantém o usuário no launcher.
- Botão X/fechar do Stage fecha o projeto atual e volta ao launcher; mostra aviso "Fechar projeto" (Cancelar/Fechar) quando há projeto aberto.
- Preserva separação launcher → Novo Projeto → editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BH.md`.

---

# QA pendente — v8z4b29BG: separa launcher, Novo Projeto e editor/Stage em estados explícitos

> Base: v8z4b29BF (não aprovada — entrada inicial e fluxo de Novo Projeto continuavam presos ao Stage).

## Escopo v8z4b29BG

- Introduz estado explícito de tela (`launcher` / `newProject` / `editor`); Stage/timeline/toolbar só existem em modo `editor`.
- Recarregar o app sempre volta ao launcher; nunca restaura Stage, projeto, imagem ou frames anteriores.
- Etapa final de imagem do Novo Projeto vira tela própria do fluxo (Fototeca/Tirar Foto/Escolher Arquivo), visível mesmo com o seletor nativo aberto — cancelar nunca expõe o Stage.
- Cancelar o Novo Projeto nunca deixa o app em Stage vazio: volta ao launcher (origem launcher) ou restaura o editor intacto (origem editor, projeto ainda válido).
- Preserva editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BG.md`.

---

# QA pendente — v8z4b29BF: launcher simples Novo Projeto / Abrir Projeto

> Base: v8z4b29BE (não aprovada — fluxo Novo Projeto: Formato → Template → Imagem → Criar).

## Escopo v8z4b29BF

- Substitui a tela inicial antiga "Imagem / Projeto" (entrada principal sem projeto carregado) por uma entrada simples com duas opções: "Novo Projeto" e "Abrir Projeto".
- "Novo Projeto" na entrada inicial abre o fluxo já existente Formato → Template → Imagem → Criar.
- "Abrir Projeto" na entrada inicial abre o seletor de JSON/projeto salvo, preservando o fluxo atual de abrir JSON.
- No editor, o menu superior mantém "Novo Projeto" e "Abrir"; ao tocar em qualquer um deles com um projeto aberto, exibe aviso de possível perda (Cancelar/Continuar) antes de prosseguir.
- Não cria Home completa, comunidade, recentes, perfil, conta, galeria, dashboard ou onboarding novo.

Checklist detalhado: ver `docs/QA-v8z4b29BF.md`.

---

# QA pendente — v8z4b29BE bugfix: sincronização final do Novo Projeto com template

> Base: v8z4b29BD (não aprovada — fluxo Novo Projeto: Formato → Template → Imagem → Criar).

## Escopo v8z4b29BE

- Corrige `applyTemplate()` (Pan, Zoom in/out, Pan ↓, Rotação, Círculo): referência a um elemento `#tbTemplate` inexistente lançava `TypeError` e interrompia a função antes de `renderAll()`/`finalizeTemplateApply()`.
- Resultado da correção: Novo Projeto com qualquer template nasce com frames, contador, timeline, Stage, frame ativo e curvas sincronizados imediatamente — sem precisar adicionar outro frame.
- Reset Project após Novo Projeto com template volta corretamente ao estado inicial desse novo projeto.
- Não altera fluxo visual do painel Novo Projeto, ordem Formato → Template → Imagem, layout aprovado, motor, Preview/export, JSON ou curvas.

Checklist detalhado: ver `docs/QA-v8z4b29BE.md`.

---

# QA pendente — v8z4b29BD Novo Projeto: Formato → Template → Imagem → Criar

> Base preservada: v8z4b29BC (ajustes finos do frame ativo + menu superior, "Novo Projeto" simples imagem→criar).

## Escopo v8z4b29BD

- Evolui "Novo Projeto" para um fluxo interno de pré-configuração: Formato → Template → Imagem → Criar, sem reintroduzir Home/página inicial/comunidade/recentes/perfil.
- Painel interno permite escolher Formato (chips existentes) e Template (incluindo "Sem template") em estado temporário, sem afetar o projeto atual.
- "Escolher imagem e criar" abre o seletor de imagem (JPG/PNG/WebP); o projeto atual só é substituído após a imagem carregar com sucesso.
- Novo projeto não herda frames/curvas/pausas/durações/seleção/vínculo com JSON do projeto anterior; aplica formato e template escolhidos imediatamente (F1 ativo se "Sem template", ou frames do template).
- Reset Project após Novo Projeto volta ao estado inicial desse novo projeto (imagem + formato + template), nunca ao JSON/projeto anterior.
- Preserva: frame ativo/HUD/abas/cruz central/clamp (v8z4b29BC), timeline/menu inferior, curvas/Bézier, Preview/export/MP4, JSON, motor.

Checklist detalhado: ver `docs/QA-v8z4b29BD.md`.

---

# QA pendente — v8z4b29BC ajustes finos do frame ativo + menu superior

> Base preservada: v8z4b29BB (remoção do pill do frameHud).

## Escopo v8z4b29BC

- Aproximar e realinhar a faixa superior (frameHud) do frame ativo em relação à moldura e às abas superiores.
- Reduzir o padding interno da faixa superior, preservando o espaçamento entre pausa/rotação/escala.
- Diminuir o tamanho visual das 4 abas/pontos circulares do frame ativo, preservando o centro e a área de toque.
- Tornar a cruz central do frame ativo escalável com o tamanho do frame (clamp suave).
- Reorganizar o menu superior em 4 colunas.
- Renomear "Novo arquivo" para "Novo Projeto" e mover para a linha final de arquivos (Salvar, Novo Projeto, Abrir, Recarregar).
- Preservar: motor, timeline/menu inferior, Preview/export/MP4, JSON, curvas/Bézier, clamp de criação de frames, Novo Projeto guiado/Home, lógica dos handles/abas.

## QA manual pendente v8z4b29BC

1. Versão visível mostra `v8z4b29BC`.
2. A faixa superior (frameHud) do frame ativo está visivelmente mais próxima da borda superior da moldura.
3. A faixa superior está melhor alinhada horizontalmente com os 2 pontos/abas superiores.
4. O padding da faixa superior está mais enxuto, mas pausa/rotação/escala continuam legíveis e com espaçamento claro entre si.
5. As 4 abas/pontos circulares estão visivelmente menores.
6. O centro de cada aba/ponto permanece exatamente na mesma posição de antes (sem deslocamento).
7. A área de toque das abas continua confortável no iPhone (mínimo 44px).
8. A cruz central aumenta/diminui ao escalar o frame (aumentar e diminuir o frame ativo via abas).
9. A cruz permanece centralizada e não interativa.
10. O menu superior (overlay de ajustes/arquivos) exibe os itens em 4 colunas.
11. O item "Novo arquivo" não existe mais; em seu lugar há "Novo Projeto".
12. "Novo Projeto" aparece na última linha de arquivos, na 2ª posição, logo após "Salvar".
13. A ordem da última linha de arquivos é: Salvar, Novo Projeto, Abrir, Recarregar.
14. Tocar em "Novo Projeto" abre o fluxo já existente de criação de novo projeto a partir de imagem, sem duplicidade.
15. Rotação do frame continua funcionando normalmente.
16. Escala do frame continua funcionando normalmente.
17. Arrastar aba inicia scale/rotate corretamente.
18. Arrastar o corpo do frame move normalmente.
19. Timeline/menu inferior não muda.
20. Preview/export/MP4 continuam funcionando.
21. JSON abre/salva normalmente.
22. Funciona no iPhone/Safari.

---

# QA pendente — v8z4b29BB microcorreção visual frame ativo

> Base preservada: v8z4b29BA (espaçamento HUD + redução visual das abas circulares).

## Escopo v8z4b29BB

- Remover aspecto de pill arredondado do fundo do texto superior (frameHud) do frame ativo.
- Remover pill separado de ângulo (.angle-indicator), mantendo o ângulo visível apenas no frameHud.
- Preservar: comportamento e conteúdo do frameHud, abas circulares, timeline/menu inferior, curvas, Preview/export, JSON, motor.

## Diagnóstico e implementação

1. `#frameHud` CSS: `border-radius:10px` → `border-radius:2px` — elimina o aspecto de cápsula/pill, mantém cantos levemente arredondados de forma discreta.
2. `.angle-indicator.show` CSS: `display:block` → `display:none` — pill separado de ângulo permanece oculto mesmo quando JS adiciona a classe `.show`; não há alteração em JS.
3. Nenhuma alteração em lógica de rotação, escala, motor, timeline ou fluxo de arquivos.

## QA manual pendente v8z4b29BB

1. Versão visível mostra `v8z4b29BB`.
2. Texto superior do frame ativo (frameHud) continua aparecendo com pausa, rotação e escala.
3. O fundo do frameHud não tem mais formato de pill/cápsula arredondado.
4. O pill separado de ângulo (.angle-indicator) não aparece durante rotação.
5. O valor de ângulo continua visível no frameHud durante e após rotação.
6. Rotação do frame continua funcionando normalmente.
7. Escala do frame continua funcionando normalmente.
8. Arrastar aba inicia scale/rotate corretamente.
9. Arrastar o corpo do frame move normalmente.
10. As 4 abas circulares permanecem visualmente inalteradas.
11. Timeline/menu inferior não muda.
12. Preview/export/MP4 continuam funcionando.
13. JSON abre/salva normalmente.
14. Funciona no iPhone/Safari.

---
