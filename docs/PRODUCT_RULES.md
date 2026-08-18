# PRODUCT_RULES

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

- Continuam futuros e não devem ser declarados implementados: raio de canto ajustável, borda, cor da borda, opacidade da borda, espessura da borda, opacidade geral do ativo, presença temporal e animação.

## Caixa de texto canônica — E8Z

- Text Assets usam `boxStyle: "block"`; o fundo nasce desligado e, quando ligado, envolve todas as linhas sem alterar a largura de composição (`boxWidth`).
- Cor e opacidade do fundo são independentes dos glifos. Padding fixo canônico é `0.50em` horizontal e `0.30em` vertical e deve persistir mesmo sem controle visível.
- Padding customizável e fundo por linha são evoluções futuras. Presença temporal é função geral dos ativos e não se confunde com animação.
