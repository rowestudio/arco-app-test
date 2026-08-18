# PRE_PROMOTION_RELEASE_PLAN

Registro canônico da base auditada `v8z4b32E9C` e do plano aprovado de PRs funcionais que devem ocorrer **antes** de qualquer promoção para produção. Este documento é a fonte de verdade do plano pré-promoção; qualquer LLM, Codex ou desenvolvedor deve conseguir entender a sequência sem depender de conversa externa.

Versionado por data. Última atualização: 2026-08-16.

## Estado de referência

- `main` de teste: commit `8f1b2686ae6cc99bb716b200a79d04281cd968d7`, versão `v8z4b32E9C`.
- `v8z4b32E9C` é a **base auditada** desta série, **não** uma promoção liberada.
- Produção (`rowestudio/arco-app`) permanece em `v8z4b32E7H`, commit `626327280e3a4126fac259e205bbe0bdf3cc8719`, fora do escopo desta série.
- A candidata real de produção será o HEAD posterior às três PRs funcionais abaixo, à documentação coerente e à validação completa no iPhone/Safari por Roberto.

## 1. Estratégia de entrega

Não haverá uma PR única e gigante. A ordem aprovada é:

1. **PR funcional de Texto.**
2. **PR funcional de Camadas e Profundidade.**
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
- **E9E — estabilização funcional (esta PR): posição + WYSIWYG.** (1) NOVO Text Asset nasce centralizado na VISTA ATUAL do Stage, com o centro capturado antes do resize do teclado pela transformação canônica existente; editar asset existente não recentraliza. (2) `pendingTextDraft` é a fonte única da verdade visual enquanto o editor está ativo; painel, Stage, fundo, seleção e quatro alças refletem imediatamente o mesmo draft. UI E9D preservada; nenhum redesign visual antecipado.
- **E9F — revisão visual/iconográfica do editor de Texto (FUTURA, NÃO implementada nesta PR).** Decisões já aprovadas, apenas registradas:
  - editor tipográfico neutro/iconográfico; estados internos não precisam herdar a cor do espaço Ativos;
  - nova paleta aprovada para a rodada visual: fundo principal `#24262B`, sheet `#303238`, controles `#393C43`, Ativos `#FF6B8A`; Frames mantém seu ciano atual;
  - a aplicação global dessa filosofia aos demais painéis fica para revisão visual posterior.
  Não implementar E9F nesta PR (sem novo editor iconográfico, sem faixa horizontal de ícones, sem remover as tabs `Texto/Fonte/Cor/Estilo` nem o título, sem nova paleta).
- **E9G — manipulação direta futura da largura da caixa no Stage (FUTURA, NÃO implementada nesta PR).** Proposta aprovada de largura direta no Stage por alças laterais específicas de Text Asset; exige revisão explícita da proteção REG-028/exatamente quatro alças antes da implementação. Não implementar nesta PR.
- Somente depois dessa rodada de Texto avançar para **Camadas e Profundidade** e, em seguida, para o **Engine Sprint** de Movimento inteligente/easing.

## 3. PR de Camadas e Profundidade

Classificação: nova função de interface + correção visual de controle existente.

### Desenho aprovado — Camadas

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

### Desenho aprovado — controle de Profundidade

- Intervalo público contínuo de `−100` a `+100`, sem snap pelas marcas.
- Rótulos de referência `−100`, `0`, `+100`.
- Quatro subdivisões de cada lado: `−80`, `−60`, `−40`, `−20`, `+20`, `+40`, `+60`, `+80`.
- Marco zero visível.
- Preenchimento roxo bidirecional do zero até o thumb, tanto para valor negativo quanto positivo.
- Controles `−5`, `+5` e Reset para zero.
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
