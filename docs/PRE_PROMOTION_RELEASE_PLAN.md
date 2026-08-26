# PRE_PROMOTION_RELEASE_PLAN

Registro canônico da base auditada `v8z4b32E9C` e do plano aprovado de PRs funcionais que devem ocorrer **antes** de qualquer promoção para produção. Este documento é a fonte de verdade do plano pré-promoção; qualquer LLM, Codex ou desenvolvedor deve conseguir entender a sequência sem depender de conversa externa.

Versionado por data. Última atualização: 2026-08-24 (v8z4b32E9H em PR — Camadas/Profundidade).

## Atualização 2026-08-24 — v8z4b32E9H em PR: readequação de Camadas + revisão visual de Profundidade

- Parte do HEAD remoto `1f449943692f9f525d760876a57f14ad077f1ebb` (merge da PR #515, rollback físico da E9G1/REG-058). A `v8z4b32E9F6` restaurada foi testada novamente por Roberto em iPhone/Safari e **aceita fisicamente como base de continuidade**; nesse mesmo teste, **REG-058 passou a RESOLVIDA FISICAMENTE PELO ROLLBACK/RESTAURAÇÃO DA E9F6** (mesmo tratamento de REG-057) — ver `docs/PROJECT_STATE.md`/`docs/REGRESSIONS.md`. REG-056 permanece ABERTA/PENDENTE; nenhuma tentativa de side width handles nesta PR.
- Implementa o item 3 abaixo (**PR de Camadas e Profundidade**): readequação da interface de Layers já existente (affordance compacto + sheet parcial) e revisão visual do controle de Profundidade já existente (régua com três números + oito ticks intermediários, preenchimento bidirecional coral, botões `−10`/`+10`). Nenhuma lógica nova de Layers/depth foi criada.
- **Decisão nova, substitui o plano anterior de `−5`/`+5` descrito na seção 3 (Desenho aprovado — Profundidade):** os botões rápidos de Profundidade passam a ser `−10`/`+10` (mais Reset para 0), documentado abaixo e em `docs/PRODUCT_RULES.md`/`docs/DECISIONS.md`. Esta é uma superação explícita, não um erro de implementação anterior — a seção 3 nunca havia sido implementada antes desta PR.
- Testes automatizados novos em `tests/smoke/app.spec.mjs` (gates `E9H —`); execução local de WebKit/Chromium bloqueada pelo acesso de rede desta sessão (proxy recusa o host de download dos browsers). Checks obrigatórios do HEAD final da PR (QA Guardrails, Browser/WebKit Smoke Tests, Real Export Smoke) pertencem ao CI. Validação física de Roberto em iPhone/Safari para a `v8z4b32E9H` permanece pendente.

## Atualização 2026-08-24 — rollback da E9G1 (PR #514) após REG-058

- A `v8z4b32E9G1` (PR #514) foi uma SEGUNDA tentativa de implementação, sobre a base restaurada pelo rollback anterior, reimplementando as side width handles e corrigindo REG-056 na origem. A build publicada foi **REPROVADA FISICAMENTE** por Roberto em iPhone/Safari: durante o teste, após manipulação/edição de largura do Text Asset chegando ao limite, o Stage deixou de permitir edição/interação (**REG-058**, causa raiz ainda não comprovada — não afirmar pointer capture, clamp, overlay, listener ou side handle como causa sem evidência).
- Por gravidade e ausência de causa raiz comprovada, a PR #514 foi **revertida integralmente** (`git revert -m 1` do merge commit, rollback funcional para `v8z4b32E9F6`, restaurando os arquivos funcionais/testes centrais ao estado byte-idêntico do commit `2ff86e1bc6323b57b7371fd5ff38dab2dfd1d3ac`) em vez de corrigida na mesma versão. Ver `docs/DECISIONS.md` (DEC-2026-08-24-02) e `docs/REGRESSIONS.md` (REG-056 permanece ABERTA/PENDENTE DE NOVA TENTATIVA; REG-058 registrada).
- **REG-057 não foi reaberta por este rollback**: o teste físico que a resolveu ("OK" no fluxo de reedição pós-Preview) ocorreu na build restaurada do PRIMEIRO rollback, é um fato físico anterior e independente da E9G1, e permanece RESOLVIDA FISICAMENTE PELO ROLLBACK/RESTAURAÇÃO DA E9F6.
- **REG-055 também não foi afetada por este rollback**, pelo mesmo motivo: seu teste físico é anterior e independente. Permanece RESOLVIDA FISICAMENTE.
- Nenhuma tentativa de corrigir REG-056 ou REG-058 foi feita nesta PR (proibido explicitamente pelo escopo da tarefa).
- Nenhuma frente seguinte do roadmap (Layers/Profundidade, Engine Sprint) foi autorizada a avançar por causa deste rollback. Nenhuma promoção autorizada.

## Atualização 2026-08-23 — rollback da E9G após REG-057 (histórico, preservado)

- A `v8z4b32E9G` (PR #512) chegou a ser **mergeada** na `main` de teste, implementando as side width handles descritas no item E9G abaixo e corrigindo REG-056 na origem. A build publicada foi **REPROVADA FISICAMENTE** por Roberto em iPhone/Safari: a primeira edição/confirmação/Preview de um Text Asset funcionou, mas a REEDIÇÃO do mesmo Text Asset depois de sair do Preview deixou de abrir o editor (**REG-057**, causa raiz ainda não comprovada).
- Por gravidade e ausência de causa raiz comprovada, a PR #512 foi **revertida** (rollback funcional para `v8z4b32E9F6`, última base funcional conhecida) em vez de corrigida na mesma versão. Ver `docs/DECISIONS.md` (DEC-2026-08-23-02) e `docs/REGRESSIONS.md` (REG-056 volta a ABERTA/PENDENTE DE NOVA TENTATIVA; REG-057 registrada).
- **REG-055 não foi afetada por este rollback**: o teste físico que a resolveu ("Tudo ok" no protocolo completo) ocorreu depois do merge da E9F6, é independente do código da E9G, e permanece RESOLVIDA FISICAMENTE.
- O estado corrente após este primeiro rollback foi funcionalmente idêntico ao estado "E9G — FUTURA" descrito abaixo (item 13), exceto pelo aprendizado adicional: qualquer nova tentativa da E9G deve validar fisicamente a sequência de reedição pós-Preview (ver `docs/TEST_CASES.md`, TC-054) pelas duas rotas públicas de reedição (toolbar "Editar"; duplo toque). Esse estado foi posteriormente reimplementado como `v8z4b32E9G1` (PR #514) e revertido de novo — ver "Atualização 2026-08-24" acima.
- Nenhuma frente seguinte do roadmap (Layers/Profundidade, Engine Sprint) foi autorizada a avançar por causa deste rollback. Nenhuma promoção autorizada.

## Estado correto após a rodada de Texto (2026-08-19)

- **E9D — mergeada** (PR #497).
- **E9E — mergeada e aprovada fisicamente** (PR #498, merge commit `4254ed370ecee64b7f98d411fe6994b8c4538ba5`; teste físico de Roberto em iPhone/Safari em 2026-08-18).
- **E9F — mergeada** (PR #499, merge commit `82131049e52974a1922206c92bf573b9d2c78ff5`). Testada fisicamente por Roberto em iPhone/Safari: estrutura geral aprovada e maioria das funções operando, mas **NÃO aprovada visualmente como encerrada**. (Nota: a instrução da E9F1 citou o merge commit `7e3978…`, inexistente no git; a fonte oficial mostra `82131049…`.)
- **E9F1 — MERGEADA, PUBLICADA e APROVADA fisicamente** (PR #500, merge commit `6739dbc018f335ad6b1faead6de4f4469e5ebf78`; build publicada e testada por Roberto em iPhone/Safari, **aprovada em 2026-08-19**). Refino visual/funcional localizado: cabeçalho compacto; ícone de Estilo B+I; ícone de Alinhamento dinâmico; paleta rápida de Cor do texto e de Fundo reutilizando a constante única `PROJECT_BG_NEUTRALS` + botão `+`; Fundo com "Sem cor/Transparente" e opacidade condicional; localização do VIEWPORT ao editar existente sem tocar geometria/Frames/ProjectWorld/Undo/autosave; Largura = Auto compacto + slider step 5. Não antecipa E9G. Rodada corretiva E9F1 encerrada.
- **E9G — FUTURA** (alças laterais de largura no Stage; exige revisão de REG-028). DUAS tentativas foram mergeadas e depois REVERTIDAS: PR #512 em 2026-08-23 por REG-057; PR #514 (`v8z4b32E9G1`) em 2026-08-24 por REG-058; ver "Atualização 2026-08-24" e "Atualização 2026-08-23" acima.
- **Camadas e Profundidade JÁ EXISTEM; a readequação da interface de Layers existente + a revisão visual do controle de Profundidade existente — EM PR (`v8z4b32E9H`).** O app já possui múltiplos assets/Layers (seleção, visibilidade, ordenação, identidades persistentes) e profundidade/parallax básico; esta frente **não** cria Layers nem Profundidade do zero, e sim readequa a interface e revisa o controle já existentes. Ver "Atualização 2026-08-24 — v8z4b32E9H em PR" no topo deste documento; validação física de Roberto pendente.
- **Engine Sprint — não iniciado.**

Nenhuma etapa avança automaticamente; nenhuma promoção está autorizada.

## Estado de referência

- `main` de teste: commit `8f1b2686ae6cc99bb716b200a79d04281cd968d7`, versão `v8z4b32E9C`.
- `v8z4b32E9C` é a **base auditada** desta série, **não** uma promoção liberada.
- Produção (`rowestudio/arco-app`) permanece em `v8z4b32E7H`, commit `626327280e3a4126fac259e205bbe0bdf3cc8719`, fora do escopo desta série.
- A candidata real de produção será o HEAD posterior às três PRs funcionais abaixo, à documentação coerente e à validação completa no iPhone/Safari por Roberto.

## 1. Estratégia de entrega

Não haverá uma PR única e gigante. A ordem aprovada é:

1. **PR funcional de Texto.**
2. **PR funcional de readequação da interface de Layers existente + revisão visual do controle de Profundidade existente** (Layers e Profundidade/parallax básico JÁ EXISTEM; não criar do zero — ver item 3).
3. **Engine Sprint funcional de Movimento inteligente e intensidade de easing.**
4. **Revisão integrada no iPhone/Safari.**
5. **PR documental de readiness**, se ainda necessária.
6. **PR separada de promoção** para `rowestudio/arco-app`, somente com autorização explícita de Roberto.

Cada PR funcional (itens 1 a 3) deve:

- partir do HEAD remoto atualizado da `main` de teste;
- receber nova versão própria;
- manter `APP_VERSION === APP_VERSION_NAME`;
- passar por revisão do HEAD atual, QA Guardrails, Browser Smoke Tests, WebKit funcional e export H.264 real;
- **não** liberar promoção por si só.

## 2. PR de Texto

Classificação: correção de regressão + melhoria visual localizada.

### Bloqueador relatado no iPhone/Safari

- Um Text Asset novo pode aparecer vertical, letra a letra, no Stage ou no Preview, sem edição.
- O caso de uma letra não pode resultar em caixa excessivamente larga.
- A causa técnica ainda deve ser demonstrada antes da correção; **não** registrar causa presumida.

### Requisitos aprovados

- Stage, Preview e Export devem usar a mesma geometria canônica do texto.
- Editor com abas reais do padrão existente do aplicativo, e não botões arredondados.
- Abas: `Texto`, `Fonte`, `Cor`, `Estilo`.
- Remover a aba separada `Alinhar`.
- Incluir a alça horizontal de arraste no topo da sheet.
- Cabeçalho com `×` para cancelar e `✓` para confirmar.
- `×` restaura o original e descarta o draft.
- Fechar/minimizar pela alça preserva o draft da sessão, sem confirmar, sem Undo e sem autosave.
- `✓` aplica ao mesmo ID e, havendo mudança, gera exatamente um Undo e uma revisão de autosave.
- Na aba `Texto`: campo de escrita, três botões abaixo para alinhamento esquerda/centro/direita e escolha `Auto | Fixa`.
- Não usar menu deslizante horizontal na aba `Texto`.
- Largura fixa usa stepper compacto `− / valor / +`, com quebra automática; Enter continua sendo quebra explícita.
- `Fonte` concentra a seleção tipográfica.
- `Cor` concentra cor do texto, cor de fundo da caixa e previsão semântica para futura cor de borda.
- `Estilo` preserva os controles tipográficos pertinentes.
- Raio de canto, borda, cor/opacidade/espessura de borda e opacidade geral do ativo permanecem trabalho futuro explícito.
- A interface não pode fingir que uma borda foi entregue antes de ela existir no renderer.

### Sequência aprovada da rodada de Texto

A PR de Texto foi subdividida na seguinte sequência aprovada. Registrar como plano; apenas o que está marcado como implementado é comportamento atual.

- **E9D — mergeada** (PR #497): reserva de 1 px canônico contra a quebra vertical no Safari e reorganização do editor em `Texto | Fonte | Cor | Estilo`, com draft minimizável e confirmação no mesmo ID.
- **E9E — mergeada e aprovada fisicamente** (PR #498, merge commit `4254ed370ecee64b7f98d411fe6994b8c4538ba5`): posição + WYSIWYG. (1) NOVO Text Asset nasce centralizado na VISTA ATUAL do Stage, com o centro capturado antes do resize do teclado pela transformação canônica existente; editar asset existente não recentraliza. (2) `pendingTextDraft` é a fonte única da verdade visual enquanto o editor está ativo; painel, Stage, fundo, seleção e quatro alças refletem imediatamente o mesmo draft. **Testada e aprovada por Roberto em iPhone/Safari na build publicada em 2026-08-18** nos itens do seu escopo. É a base funcional aprovada da E9F.
- **E9F — revisão visual/iconográfica do editor de Texto: MERGEADA** (PR #499, merge commit `82131049e52974a1922206c92bf573b9d2c78ff5`; estrutura geral aprovada no teste físico, porém não encerrada — refinada pela E9F1). Editor iconográfico neutro implementado sobre a E9E:
  - rail horizontal de ícones sem label textual visível (semântica `tablist/tab` interna com `aria-label`); item ativo usa contraste neutro invertido (branco + símbolo escuro), nunca coral/ciano/verde; estados internos não herdam a cor do espaço Ativos;
  - ordem: texto, fonte, estilo, alinhamento, cor do texto, fundo da caixa, largura da caixa; alinhamento iconográfico próprio; cor do texto e fundo separados, com a opacidade dentro do painel de Fundo; largura Auto/Fixa + stepper mantida (E9C intacta); minimizar por gesto vertical da alça; × cancela, ✓ confirma;
  - paleta aprovada aplicada aos tokens de UI: chrome `#24262B`, sheet `#303238`, controles `#393C43`, divisor `~#4A4D55`; **Ativos `#FF6B8A`**, Frames mantém o ciano existente `#04fff2`; `DEFAULT_PROJECT_BG` (`#3c3c3b`) intacto;
  - a aplicação global dessa filosofia neutra aos demais painéis fica para revisão visual posterior (não feita nesta PR);
  - não antecipa E9G (nenhuma alça lateral; exatamente quatro alças preservadas).
- **E9G — manipulação direta futura da largura da caixa no Stage (FUTURA, NÃO implementada).** Proposta aprovada de largura direta no Stage por alças laterais específicas de Text Asset; exige revisão explícita da proteção REG-028/exatamente quatro alças antes da implementação. DUAS tentativas foram mergeadas e depois REVERTIDAS por reprovação física de builds publicadas: `v8z4b32E9G` (PR #512), **REVERTIDA em 2026-08-23** por REG-057 (reedição de Text Asset não reabre o editor após Preview); `v8z4b32E9G1` (PR #514), reimplementação sobre a base restaurada, **REVERTIDA em 2026-08-24** por **REG-058** (Stage deixa de permitir edição/interação após a largura do Text Asset chegar ao limite; causa raiz NÃO comprovada) — ver "Atualização 2026-08-24" e "Atualização 2026-08-23" no topo deste documento e `docs/REGRESSIONS.md`/`docs/DECISIONS.md`. Não implementar nesta PR (de rollback); qualquer nova tentativa futura exige validar fisicamente AMBAS as regressões descobertas (REG-057 e REG-058).
- Somente depois dessa rodada de Texto avançar para a **readequação da interface de Layers existente + revisão visual do controle de Profundidade existente** (item 3; sistemas já existentes, não criados do zero) e, em seguida, para o **Engine Sprint** de Movimento inteligente/easing.

## 3. PR de Camadas e Profundidade

Classificação: **readequação da interface de Layers existente + revisão visual do controle de Profundidade existente.** Layers (múltiplos assets, seleção, visibilidade, ordenação e identidades persistentes) e Profundidade/parallax básico **já existem**; esta frente readequa a interface de acesso/organização e revisa visualmente o controle já implementado — **não** cria Layers nem Profundidade do zero.

**Status: EM PR (`v8z4b32E9H`)**, ver "Atualização 2026-08-24 — v8z4b32E9H em PR" no topo deste documento. Validação física de Roberto pendente.

### Desenho aprovado — Camadas (readequação da interface existente)

- No Modo Ativos, haverá um affordance compacto no Stage que representa a camada selecionada e oferece expandir.
- Ele **não** reutiliza o ícone de visualização/referências já existente.
- Expandir abre uma sheet parcial `Camadas` a partir de baixo.
- Altura máxima aproximada de 40% do viewport, com rolagem vertical interna e Stage visível.
- A sheet tem alça, título e `×` para fechar.
- Cada camada mostra thumbnail ou ícone de tipo, nome, posição na pilha e profundidade, por exemplo `Camada 3 · Prof. +42`.
- Tocar em uma camada altera a seleção do Stage, mas **não** fecha o painel.
- Apenas fechar explicitamente encerra o painel.
- Ações da camada selecionada no painel: visibilidade, frente, trás, trocar imagem quando aplicável, excluir e Profundidade.
- A entrada `Camadas` deixa o menu inferior de Ativos.
- Painel e affordance **não** entram em Preview nem Export e **não** alteram ProjectWorld.

### Desenho aprovado — revisão visual do controle de Profundidade existente

- Intervalo público contínuo de `−100` a `+100`, sem snap pelas marcas.
- Rótulos de referência `−100`, `0`, `+100`.
- Quatro subdivisões de cada lado: `−80`, `−60`, `−40`, `−20`, `+20`, `+40`, `+60`, `+80`.
- Marco zero visível.
- Preenchimento bidirecional do zero até o thumb, tanto para valor negativo quanto positivo, no acento vigente do workspace Ativos **coral `#FF6B8A`**. (Sincronização documental com a identidade já aprovada da E9F; o roxo antigo de Ativos **não** deve ser reintroduzido — ver `docs/PRODUCT_RULES.md`.)
- **Controles `−10`, `+10` e Reset para zero.** Decisão nova registrada em 2026-08-24 (`v8z4b32E9H`), **SUPERA** a formulação anterior deste documento que mencionava `−5`/`+5` para Profundidade (essa formulação nunca havia sido implementada). Ver `docs/DECISIONS.md`.
- `depth` continua independente de `zIndex`.
- Valores finitos continuam persistindo.
- Texto, fundo do texto, seleção, hit-test e alças devem acompanhar a paralaxe juntos no Stage.
- Preservar paridade Stage/Preview/Export.
- Um gesto confirmado gera somente uma entrada de Undo e uma revisão de autosave.

## 4. Engine Sprint — Movimento inteligente e easing

Classificação: Engine Sprint isolado. **Não** pode ser misturado às duas PRs anteriores.

- Desligar Movimento inteligente em um trecho deve alterar somente aquele trecho; nunca um estado global nem outros segmentos.
- O controle de intensidade permanece em `Trechos`.
- Há três níveis: `Baixa`, `Média`, `Alta`.
- No modo manual, a intensidade controla desaceleração e reaceleração na fronteira do trecho.
- Sem pausa real, ela representa quase-parada/lentidão, sem criar hold.
- Com pausa real, ela controla a força de chegada e saída, sem mudar a duração da pausa.
- No Movimento inteligente, ela regula os easings automáticos ao redor de pausas reais existentes, por trecho.
- Movimento inteligente **não** cria pausa nova, **não** destrói o modo manual e **não** muda outros trechos.
- Intensidade redistribui o tempo já existente dentro do trecho: não aumenta nem reduz duração de trecho ou do projeto.
- Somente uma pausa real de frame adiciona duração.
- Preview e Export devem usar o mesmo sampler temporal e manter paridade de duração e movimento.

## 5. Backlog explícito

- Registrado em `docs/PRODUCT_ROADMAP.md`: os modos Frames e Ativos devem futuramente se tornar abas visuais reais, com diferenciação sutil de tom/fundo, sem alterar o comportamento nesta série. Não implementar essa mudança visual agora.

## Bloqueio de promoção

- `v8z4b32E9C` não é uma promoção autorizada.
- A promoção para produção permanece bloqueada até a conclusão da série completa (itens 1 a 4), documentação coerente e aprovação explícita de Roberto após validação no iPhone/Safari real.
- Registro operacional da candidata em `docs/PROMOTION_TO_PRODUCTION.md`; estado corrente em `docs/PROJECT_STATE.md`; sequência de entrega também em `docs/ROADMAP.md`.
