# Seleção múltipla de Ativos — desenho aprovado

**Status:** desenho de produto aprovado por Roberto em 2026-09-05. Ainda não
implementado. Este documento define a primeira entrega funcional; não autoriza
alterações em produção.

## Objetivo

Permitir que imagens e Text Assets sejam selecionados como uma seleção temporária
única, para serem transformados conjuntamente no Stage e reordenados na pilha de
Camadas. A experiência não cria um grupo persistente no projeto.

## Entrada e seleção

- A seleção múltipla começa exclusivamente no painel de Camadas.
- Tocar e segurar uma camada, **sem arrastar**, entra no modo e seleciona o
  primeiro Ativo.
- Enquanto o modo estiver ativo, um toque simples em outra camada acrescenta o
  Ativo; toque simples em uma camada já incluída a remove.
- Tocar e segurar novamente o Ativo que iniciou a seleção anula toda a seleção.
- Tocar em área vazia também encerra a seleção.
- Stage e painel de Camadas refletem o mesmo conjunto canônico de IDs e um modo
  temporário explícito, que já está ativo com apenas o primeiro ID; o Stage não
  inicia a seleção múltipla.
- Imagens e Text Assets participam juntos. A edição de conteúdo de texto
  continua possível somente com seleção única.

## Transformação no Stage

O Stage apresenta uma única caixa coletiva, calculada como a união da geometria
visual já resolvida dos Ativos selecionados (incluindo parallax de profundidade),
com um único sistema de abas/alças. Cada gesto é convertido de volta para a
geometria canônica própria de cada Ativo, sem alterar sua profundidade.

- Movimento aplica a mesma translação a todos os Ativos.
- Escala é uniforme em torno do centro da caixa coletiva: posições, dimensões e
  escalas individuais acompanham o fator do conjunto.
- Rotação ocorre em torno do centro coletivo: posições giram em torno desse
  centro e cada rotação individual recebe o mesmo delta.
- Uma transformação inteira gera uma única entrada de Undo/Redo.

## Ações contextuais e ordem de Camadas

- Nos painéis contextuais de Escala e Rotação, o valor é relativo ao estado
  atual de cada Ativo: escala multiplica o valor individual e rotação adiciona
  um delta em torno do centro próprio de cada item.
- Os controles existentes **Frente** e **Trás** permanecem ativos. Com múltiplos
  Ativos, deslocam o conjunto uma posição na pilha, preservando a ordem relativa
  interna.
- No painel de Camadas, segurar uma camada já selecionada e então arrastar move
  toda a seleção para a posição de soltura, também preservando a ordem interna.
- Reordenação coletiva é uma única entrada de Undo/Redo e não altera Frames,
  curvas, ProjectWorld ou a geometria dos Ativos.

## Transparência e hit-test

- Para imagem, o toque inicial deve testar o alfa no pixel correspondente após
  aplicar a transformação do Ativo. Pixel abaixo de um limiar explícito de
  opacidade não captura o toque, permitindo atingir o Ativo visível abaixo.
- Para texto, a primeira entrega usa a caixa visual do Text Asset como alvo;
  teste de glifo pixel a pixel não faz parte desta frente.
- O teste de alfa roda somente na decisão inicial de toque, nunca no loop de
  arrasto, para preservar desempenho em iPhone/Safari.

## Persistência, escopo e exclusões

- Save/Load e Session Restore preservam as mudanças feitas nos Ativos, mas não
  restauram a seleção temporária.
- Preview, Export, motor de câmera, Frames, curvas, timing e ProjectWorld não
  entram no escopo funcional.
- Esta primeira versão cobre mover, escala, rotação e ordenação. Opacidade,
  profundidade, visibilidade, timing e efeitos coletivos ficam para evolução
  posterior.

## Arquitetura recomendada

Usar um estado canônico de seleção temporária (IDs ordenados e ID âncora), que
seja a fonte única para Stage, painel de Camadas, toolbar e painel contextual.
Não criar uma entidade `group` persistida no projeto. As operações coletivas
devem derivar sua geometria desse conjunto e registrar uma única mutação
atômica no mecanismo existente de Undo/Redo.

## Critérios de aceitação e QA

1. Selecionar e desselecionar imagens e textos pelo painel de Camadas mantém
   Stage e painel sincronizados.
2. Cada transformação coletiva preserva relações espaciais e gera somente um
   Undo; Redo restaura o mesmo resultado.
3. Escala e rotação contextuais preservam os centros e diferenças individuais.
4. Frente/Trás e drag de Camadas movem o conjunto como bloco, preservando sua
   ordem interna.
5. Toque em transparência de PNG seleciona o Ativo abaixo; toque em região
   opaca seleciona o superior.
6. Save/Load e Session Restore mantêm as mutações, sem persistir a seleção.
7. Preview e Export permanecem visualmente inalterados por seleção temporária.
8. WebKit automatizado e validação física iPhone/Safari cobrem seleção, Stage,
   Camadas, Undo/Redo, Save/Load e o cenário de PNG transparente sobre outro
   Ativo.
