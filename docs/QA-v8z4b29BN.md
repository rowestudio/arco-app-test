# QA — v8z4b29BN

## Escopo

- Adicionar um efeito **experimental, opcional e por trecho** chamado **Tremor** (câmera na mão / handheld), aplicado como **camada procedural sobre o movimento já calculado** do trecho (posição/escala/rotação/curvas/duração permanecem como antes).
- O efeito atua só no trecho selecionado, nunca no projeto inteiro nem no frame individual.
- Funciona em **Preview e MP4** de forma **determinística** (mesmo trecho + mesma config → mesmo resultado; repetir Preview não muda; export casa com Preview).
- Não cria frames, não altera frames reais, posição salva, curvas, timeline nem estrutura agressiva do JSON.
- Reversível: desligar o Tremor reproduz exatamente o comportamento anterior do motor.

## Mudanças técnicas

- **Modelo de dados** (`index.html`): adiciona `segTremorSettings[]`, array paralelo por trecho espelhando `segBlurSettings`, com `cloneDefaultSegTremor()` → `{ enabled:false, intensity:0.4 }` e `ensureSegTremorSettings()` (clamp de `intensity` em 0..1, comprimento = `frameCount-1`).
- **Integridade de arrays**: `ensureSegmentArraysIntegrity()` passa a normalizar `segTremorSettings` junto com os demais arrays por trecho (chamado após add/remove/split de frame, ao carregar e ao salvar).
- **Motor** (`getStateAtT`): renomeado o corpo original para `getStateAtTBase(t)` (motor intacto). Novo `getStateAtT(t)` chama a base e aplica `applySegTremorLayer(base, t)`:
  - identifica o trecho via `getSegAndLocalTAtTime(t)` (loop herda o último trecho normal, igual ao blur);
  - se desligado/intensidade 0 → retorna o estado base inalterado;
  - **envelope de extremidade** (`edge=0.14`, `smooth01`): offset = 0 em `localT` 0 e 1 → frames reais exatos nos keyposes e sem salto entre trechos;
  - **oscilação determinística**: soma de senoides de frequências incomensuráveis em função do tempo absoluto (`t * totalDurationFull()`), sem `Math.random`;
  - **limites internos**: deslocamento ≤ 2% do tamanho do quadro em X/Y (proporcional ao zoom) e rotação ≤ 0,5° na intensidade máxima; escala não é tocada.
- **Convergência Preview/MP4**: ambos passam por `renderFrameSafely` → `getRenderStateAtTime` → `getStateAtT`, então o efeito aparece igual nos dois caminhos.
- **UI** (`panelEase`, painel de Edição/Movimento do trecho): nova seção "Tremor" com toggle (`#tremorToggle` → `toggleSegTremor`) e slider "Intensidade" 0–100% (`#tremorIntensitySlider`, em `#tremorZone` que só aparece com o efeito ligado). `syncTremorPanel()` é chamado no fim de `initEasePanel()` e opera sobre o trecho ativo (`_activeEaseSeg`). Slider captura `pushUndo()` no início do arrasto; Preview lê em tempo real (sem reiniciar).
- **Persistência**: `segTremorSettings` incluído em `captureState`, `cloneProjectStateSnapshot`, `restoreState` (undo/redo), nos resets/templates, no save JSON e no load JSON. Load de JSON antigo sem o campo → Tremor desligado (`cloneDefaultSegTremor`).
- **Versão**: `APP_VERSION`/`APP_VERSION_NAME`, texto visível (`#appVersionText`/`#appVersionNameText`), comentário/changelog do topo e banner ASCII atualizados para `v8z4b29BN`. `CHANGELOG.md` e `QA.md` atualizados.

## Checklist estático

- [x] Base `v8z4b29BM` confirmada antes das alterações (`APP_VERSION`/`APP_VERSION_NAME` = `v8z4b29BM`, texto visível e comentário do topo = `v8z4b29BM`).
- [x] Versionamento atualizado para `v8z4b29BN` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível, comentário/changelog do topo e banner ASCII.
- [x] `CHANGELOG.md`, `QA.md` e `docs/QA-v8z4b29BN.md` atualizados/criados.
- [x] Efeito é por trecho selecionado (usa `_activeEaseSeg`/`segTremorSettings[seg]`), não global nem por frame.
- [x] Começa desligado por padrão; slider de Intensidade só aparece com o Tremor ligado.
- [x] Aplicado como camada após o motor base (`getStateAtTBase`), só em `cx`/`cy`/`rot`; escala intacta.
- [x] Determinístico (sem `Math.random`; oscilação por senoides em função do tempo); Preview e MP4 usam a mesma função.
- [x] Envelope zera o offset nos keyposes → frames reais não são alterados e não há salto entre trechos.
- [x] Limites internos de amplitude (≤2% do quadro, ≤0,5°) para evitar bordas.
- [x] Persistência no JSON + undo/redo; JSON antigo abre com Tremor desligado.
- [x] Sintaxe JS validada (`node --check` nos blocos de script).
- [x] Sem alterações em lógica de frames, curvas/Bézier, timeline, launcher, fluxo Novo Projeto, seleção múltipla, ícones ou Preview básico.

## Checklist manual obrigatório (iPhone/Safari)

- [ ] Abrir um projeto com 2+ frames; selecionar um trecho e abrir o painel de Edição/Movimento: a seção "Tremor" aparece com o toggle desligado e sem slider visível.
- [ ] Ligar o Tremor: o slider "Intensidade" aparece (padrão 40%).
- [ ] Dar Play no Preview: o trecho ganha uma leve tremida orgânica e contínua, sem flicker, sem saltos bruscos; os outros trechos (Tremor desligado) seguem normais.
- [ ] Aumentar/diminuir a Intensidade reflete no Preview ao vivo; em 0% o trecho fica idêntico ao comportamento anterior.
- [ ] Repetir o Preview várias vezes: o tremor se comporta igual todas as vezes (determinístico).
- [ ] Exportar MP4: o tremor no vídeo casa visualmente com o Preview, no mesmo trecho.
- [ ] Confirmar que o efeito não revela bordas/fundo no trecho com Tremor ligado em intensidade alta.
- [ ] Salvar JSON e reabrir: o estado do Tremor (ligado/intensidade) por trecho é preservado.
- [ ] Abrir um JSON antigo (sem `segTremorSettings`): abre normalmente, com Tremor desligado em todos os trechos.
- [ ] Undo/Redo após ligar/ajustar o Tremor restaura o estado corretamente.
- [ ] Conferir que frames, curvas, timeline, launcher, Novo Projeto, seleção múltipla e Preview básico seguem sem regressões.

## Limitações do ambiente

- Não houve validação em iPhone/Safari real neste ambiente automatizado.
- Não houve geração/inspeção real de MP4 neste ambiente automatizado.

## Notas / decisões

- Em trechos de **loop** e durante **pausas/zona de acabamento**, o `localT` fica fixo nas extremidades, então o envelope mantém o tremor próximo de zero — comportamento estável e seguro (sem tremida em quadros parados).
- Operações estruturais de frame (split/insert no meio) mantêm o **comprimento** correto de `segTremorSettings` via `ensureSegmentArraysIntegrity()`. Como o efeito é experimental, optou-se por não alterar o código de manipulação de frames; em edições estruturais no meio do projeto, a config de Tremor pode se deslocar de trecho (sem quebra, sem perda de dados). Sinalizado para refinamento futuro caso o efeito seja promovido.
