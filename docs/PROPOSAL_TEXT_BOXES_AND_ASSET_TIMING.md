# Proposta futura: quadros de texto, presença temporal e comportamentos de ativos

Documento de planejamento. Não autoriza implementação automática.

## Contexto

Roberto identificou que quadros de texto são uma capacidade importante para o propósito do Arco Motion App, especialmente para títulos, legendas, logos, overlays, áreas com transparência e composições visuais com texto integrado ao mundo do projeto.

Na mesma conversa, foi consolidada a necessidade futura de controlar quando cada ativo existe na tela e de permitir comportamentos simples, matemáticos e previsíveis durante o intervalo em que o ativo está visível.

Este registro é apenas documental. Qualquer implementação futura precisa de tarefa própria, branch própria, PR própria, escopo fechado, testes compatíveis e validação real em iPhone/Safari quando aplicável.

## Princípios

- Texto deve ser tratado como um objeto visual do projeto, não como texto solto da interface.
- O quadro de texto deve participar de ProjectWorld, Layers, seleção, Preview, Export e Save/Load.
- Nesta etapa não há controle manual de largura: a geometria canônica existente continua responsável pelo wrapping, e `Enter` cria e preserva quebra manual.
- Presença temporal e animação são conceitos diferentes.
- Presença temporal define quando o ativo aparece.
- Animação define como o ativo se comporta enquanto está presente.
- Referências temporais devem favorecer frames e trechos do projeto, evitando dependência exclusiva de tempo absoluto que possa dessincronizar a composição.
- O renderer único/canônico deve ser preservado; não criar caminho paralelo entre Stage, Preview e Export.

## Modelo mental de quadro de texto

Um quadro de texto futuro deve poder armazenar, no mínimo:

- conteúdo textual;
- largura canônica existente, sem controle manual nesta etapa;
- altura derivada;
- quebra automática compatível e quebra manual por `Enter`;
- cor do texto;
- fundo com transparência;
- padding interno;
- alinhamento;
- posição, escala e rotação;
- identidade de layer;
- estado de seleção;
- persistência em Save/Load e Session Restore;
- renderização equivalente em Stage, Preview e Export.

Itens como fonte, peso, borda, sombra, espaçamento, presets tipográficos e texto em curva devem ser tratados como evolução posterior, salvo escopo explícito.

## Modelo mental de presença temporal

Cada ativo visual, incluindo imagem e texto, deve poder declarar sua presença no projeto:

- sempre visível;
- visível a partir de um frame;
- visível até um frame;
- visível entre dois frames;
- opcionalmente, em versão futura, por tempo absoluto quando isso for realmente necessário.

O modelo preferencial inicial é baseado em frames porque os frames já funcionam como marcas temporais e visuais do projeto. Um ativo associado ao intervalo `Frame X -> Frame Y` acompanha melhor mudanças futuras de duração, pausa e ritmo do que um ativo preso apenas a segundos absolutos.

Exemplo conceitual:

```text
Ativo A:
- presença: Frame 3 -> Frame 6
- entrada: fade nos primeiros 8 frames renderizados do intervalo
- permanência: visível durante o trecho
- saída: fade nos últimos 8 frames renderizados do intervalo
```

## Modelo mental de comportamento

Comportamentos devem começar como presets simples por ativo, com poucos controles:

- nenhum;
- fade in;
- fade out;
- pulsar;
- flutuar;
- girar lento;
- surgir com escala;
- deslizar;
- movimento pendular.

Controles iniciais esperados:

- duração;
- atraso;
- intensidade;
- velocidade, quando aplicável.

Esses presets devem atuar sobre propriedades simples:

- opacidade;
- posição `x/y`;
- escala;
- rotação.

Não iniciar por timeline avançada, keyframes manuais, editor de curvas por ativo ou sistema completo de animação, salvo nova decisão explícita.

## Sequência incremental recomendada

1. Criar quadro de texto estático como ativo/layer real, com largura e quebra automática.
2. Persistir o quadro de texto em Save/Load e Session Restore.
3. Garantir paridade do texto em Stage, Preview e Export.
4. Adicionar controles básicos de estilo: fonte local limitada, cor, peso/itálico e alinhamento (concluído na E8Y).
5. Evoluir fundo/transparência e padding como propriedades futuras da caixa de texto.
6. Adicionar presença temporal genérica e compartilhada por imagens e textos: sempre visível ou visível entre frames.
7. Adicionar fade in/fade out baseado no intervalo de presença.
8. Adicionar presets matemáticos simples por ativo.
9. Avaliar necessidade de timeline/keyframes avançados somente depois da validação dos passos anteriores.

## Fora de escopo nesta proposta documental

- Implementar qualquer função.
- Alterar `APP_VERSION` ou `APP_VERSION_NAME`.
- Alterar `index.html`.
- Alterar Preview, Export, WebCodecs, renderer, ProjectWorld, Layers, Save/Load ou UI atual.
- Definir layout final dos controles.
- Escolher biblioteca de fontes.
- Aprovar timeline avançada.
- Promover qualquer mudança para produção.

## Riscos para futuras PRs funcionais

- Divergência entre Stage, Preview e Export se o texto for renderizado por caminho paralelo.
- Quebra de Save/Load ou Session Restore se texto e presença temporal não entrarem no schema do projeto de forma controlada.
- Regressão em Layers, seleção e ordenação se texto não seguir a identidade canônica de ativos.
- Dessincronização se presença de ativos depender apenas de segundos absolutos.
- Complexidade excessiva se texto, estilos, presença temporal e animações forem implementados juntos.
- Regressão visual em iPhone/Safari se quebra de linha, fontes e transparência não forem testadas em viewport real.

## Critérios mínimos para uma primeira PR funcional futura

- Uma única capacidade por PR.
- Texto como ativo real do projeto.
- Geometria canônica preservando quebra automática e `Enter` preservando quebra manual, sem controle de largura nesta etapa.
- Paridade entre Stage, Preview e Export.
- Round-trip Save/Load com texto preservado.
- Sem alteração colateral de imagem, Frames, curvas, Preview, Export, Layers ou ProjectWorld fora do escopo.
- Testes automatizados compatíveis e validação visual publicada em iPhone/Safari real antes de aprovação final da função.
