# Presença temporal de ativos — desenho aprovado

**Status:** desenho de produto aprovado por Roberto em 2026-08-30. Este documento não autoriza alteração funcional automática.

## Objetivo e limite da primeira etapa

Adicionar presença temporal genérica para qualquer ativo visual (imagem ou texto): definir quando ele entra em cena e quando sai. A primeira etapa altera somente a opacidade efetiva entre invisível e a opacidade manual do ativo; não apresenta seletor de efeitos, keyframes, curvas, zoom, deslocamento ou animações contínuas.

Os efeitos futuros reutilizarão os mesmos pontos de entrada e saída, sem mudar referências nem tempos já salvos.

## Modelo de estado

Cada ativo mantém uma `opacity` manual persistente, independente da presença temporal. A presença contém dois limites opcionais, `entry` e `exit`, e um estado de herança:

- sem `entry`: o ativo já está visível no início do projeto;
- sem `exit`: o ativo continua visível até o fim do projeto;
- com ambos: fica visível somente entre os dois eventos;
- `inherit`: recebe o padrão global do projeto;
- `custom`: usa seus próprios limites.

A opacidade resolvida é zero antes da entrada e após a saída; dentro do intervalo, é exatamente a opacidade manual do ativo. Assim, 70% continua sendo 70% quando o ativo está presente. A futura transição de dissolve deverá interpolar de zero até esse valor, nunca substituir ou gravar a opacidade manual.

Projetos legados, assets sem o novo campo e assets novos começam sem entrada nem saída, portanto visíveis durante todo o projeto.

## Âncoras temporais

Uma entrada ou saída é um `TemporalTrigger` composto por uma âncora e um deslocamento assinado em milissegundos. As âncoras permitidas são:

1. **Tempo do projeto:** instante absoluto, por exemplo `00:12,400`.
2. **Frame:** instante em que a timeline chega a um frame escolhido.
3. **Ativo:** entrada ou saída de outro ativo escolhido.

O deslocamento permite antes/depois sem criar tipos paralelos: `-0,4 s`, `0 s` ou `+1,0 s`. A interface pode apresentá-lo como Antes, No momento ou Depois.

Âncoras de Frame e Ativo permanecem semânticas quando Frames são inseridos, removidos ou têm duração alterada. Âncoras de Tempo do projeto permanecem fixas no relógio do projeto. Dependências cíclicas entre ativos são inválidas e devem ser bloqueadas antes de salvar.

## Localização dos controles

### Padrão do projeto

`Edição do projeto > Aparência` concentra o padrão global de presença dos ativos e dois comandos explícitos:

- **Aplicar a todos:** substitui inclusive ajustes individuais.
- **Aplicar aos sem ajuste individual:** atualiza somente assets em herança.

O padrão não deve abrir um novo sheet dentro do painel Projeto; seus controles permanecem inline na superfície atual.

### Ajuste individual do ativo

Com um ativo selecionado, a barra inferior recebe `Opacidade` e `Animação`. O painel Animação começa compacto, com duas linhas desligadas: **Entrada** e **Saída**. Somente ao ativar uma linha, seu bloco se expande para mostrar Âncora, Referência e Ajuste em segundos.

O topo do painel declara `Usando padrão do projeto` ou `Ajuste individual`. Personalizar cria override só daquele ativo; `Usar padrão do projeto` descarta o override e volta à herança.

Não existe seletor de efeito nesta primeira etapa. Quando efeitos forem introduzidos, aparecem somente dentro do bloco Entrada ou Saída que já estiver ativado.

## Regras de integridade

- Uma saída anterior à entrada não pode ser confirmada; o painel explica o conflito e mantém o último estado válido.
- Ao selecionar uma referência de ativo, o destino não pode ser ele próprio nem fechar um ciclo de dependências.
- Excluir um ativo referenciado não religa dependentes automaticamente. O diálogo informa quantos ativos dependem dele e oferece `Cancelar` ou `Excluir e preservar tempos`.
- Em `Excluir e preservar tempos`, cada vínculo dependente é convertido para o instante absoluto atualmente resolvido no projeto.
- Undo restaura o ativo excluído e os vínculos semânticos originais; Redo aplica novamente a conversão aprovada.

## Duração global do projeto

Ao usar o comando existente que redimensiona proporcionalmente a duração total do projeto, a UI oferece a opção, ligada por padrão, **Acompanhar proporcionalmente as animações dos ativos**.

Quando ativa, ela escala os números dependentes do relógio: tempos absolutos de projeto, deslocamentos e futuras durações de efeitos. Não converte nem congela vínculos semânticos a Frames ou Ativos; eles continuam sendo resolvidos por suas referências.

Adicionar ou remover Frames por si só não escala tempos absolutos de ativos. As âncoras semânticas acompanham naturalmente a nova posição temporal de seus Frames ou ativos de referência.

## Resolução e renderização

Um resolvedor canônico recebe o tempo do projeto e a lista de assets, resolve as dependências em ordem válida e retorna a presença/opacidade efetiva de cada ativo. Stage, Preview e Export consomem essa mesma resolução; não é permitido criar uma regra visual exclusiva do Stage nem caminho paralelo de renderer.

O Stage reflete o instante atualmente selecionado pela timeline: antes da entrada o ativo não é renderizado/selecionável; durante a presença ele usa sua geometria e opacidade canônicas; após a saída deixa de participar de render e hit-test. Nenhuma decisão de presença altera `ProjectWorld`, geometria, `depth`, `zIndex`, Frames ou curvas.

## Persistência e histórico

Presença, herança e referências temporais fazem parte do modelo canônico de ativo e dos padrões do projeto. Eles devem sobreviver a Undo/Redo, Save/Load, Session Autosave e Session Restore. O fingerprint canônico precisa incluir os campos persistíveis de presença; caches, DOM e tempos resolvidos não são persistidos como fonte de verdade.

## Fatiamento de implementação proposto

1. Corrigir separadamente os botões de zoom do Stage, com PR funcional própria e versão nova.
2. Introduzir schema, migração e resolvedor de presença com âncoras Projeto/Frame, sem nova UI de efeitos.
3. Expor o painel individual compacto e a atualização correta do Stage, seleção e hit-test.
4. Integrar Preview/Export, persistência, dependências entre assets, diálogo de exclusão e Undo/Redo.
5. Introduzir padrões globais, aplicação em lote e escala proporcional da duração total.
6. Somente depois de validação física, adicionar efeitos de entrada/saída sobre esses mesmos gatilhos.

Cada etapa funcional terá PR, versão e validação próprias; nenhuma é autorizada por este documento isoladamente.

## Evidência exigida por etapa funcional

- testes do resolvedor: limites ausentes, Âncora Projeto, Frame e Ativo, offsets, ciclo bloqueado e entrada/saída inválidas;
- Stage: render, seleção e hit-test respeitam presença sem alterar geometria canônica;
- Preview e Export: mesmo conjunto de ativos e opacidade resolvida em amostras equivalentes;
- Save/Load, Session Autosave/Restore e Undo/Redo preservam herança, override, âncoras e conversão após exclusão;
- teste de duração proporcional com a opção ligada e desligada;
- validação física em iPhone/Safari, especialmente interações de painel, diálogo de exclusão, timeline, Preview e Export.

## Fora de escopo

- efeitos além de aparecimento/desaparecimento discreto;
- keyframes e editor avançado de animação;
- alteração de curva, easing, `getStateAtT`, motor de câmera ou WebCodecs sem tarefa própria;
- mudanças de geometria, Layers, ProjectWorld, profundidade ou ordem de camada;
- promoção para produção.
