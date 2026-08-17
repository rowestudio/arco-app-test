# PRODUCT_RULES

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
- “Cor da interface”, nesta hierarquia neutra, não substitui os acentos funcionais: Frames permanecem ciano e Ativos permanecem roxo.

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

### Estrutura do editor

- O editor reutiliza o mesmo draft para criação e reedição.
- As únicas abas principais são `Texto`, `Fonte`, `Cor` e `Estilo`.
- Não existe mais aba principal separada `Alinhar`.

### Aba Texto

- Contém o campo de escrita e, abaixo dele, os alinhamentos esquerda, centro e direita.
- Contém a escolha `Auto | Fixa`; no modo `Fixa`, um stepper compacto `− / valor / +` define a largura.
- Enter continua criando quebra explícita de linha; o modo `Fixa` permite quebra automática dentro da largura escolhida.
- Não existe menu horizontal deslizante de controles na aba `Texto`.

### Aba Fonte

- Concentra a seleção tipográfica.

### Aba Cor

- Concentra cor do texto, ativação do fundo, cor do fundo e opacidade do fundo.
- A borda não é declarada como implementada nesta etapa.

### Aba Estilo

- Preserva os controles tipográficos pertinentes, incluindo peso e itálico.

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

- Continuam futuros e não devem ser declarados implementados: raio de canto ajustável, borda, cor da borda, opacidade da borda, espessura da borda, opacidade geral do ativo, presença temporal e animação.

## Caixa de texto canônica — E8Z

- Text Assets usam `boxStyle: "block"`; o fundo nasce desligado e, quando ligado, envolve todas as linhas sem alterar a largura de composição (`boxWidth`).
- Cor e opacidade do fundo são independentes dos glifos. Padding fixo canônico é `0.50em` horizontal e `0.30em` vertical e deve persistir mesmo sem controle visível.
- Padding customizável e fundo por linha são evoluções futuras. Presença temporal é função geral dos ativos e não se confunde com animação.
