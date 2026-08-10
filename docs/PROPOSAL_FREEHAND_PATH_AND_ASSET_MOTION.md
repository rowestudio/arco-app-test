# Proposta: desenho livre de trajetória e movimento por ativo

> **Status:** proposta de produto, arquitetura futura e roadmap (`DOC-2026-08-09-01`). Este documento não autoriza implementação. UI, nomenclatura e parâmetros matemáticos finais permanecem a confirmar por estudos e protótipos funcionais posteriores.

## 1. Contexto

O Arco Motion App organiza um `ProjectWorld` com ativos e uma câmera conduzida pelo sistema canônico de Frames e curvas. Esta proposta registra duas evoluções futuras e complementares:

1. transformar um gesto livre feito com dedo/pointer no Stage em uma trajetória editável de câmera;
2. permitir que cada ativo tenha movimento e efeitos temporais próprios ao longo do tempo global do projeto.

O registro é exclusivamente documental. Ele não modifica o comportamento atual de Frames, Stage, ProjectWorld, profundidade/parallax, Preview, Export ou renderer e não concede autorização automática para trabalho funcional posterior.

## 2. Princípios de produto

- A ferramenta de trajetória deve interpretar intenção espacial; não deve transformar o Arco em aplicativo/editor de desenho nem em editor técnico de splines.
- O produto deve apresentar **uma solução automática bem calibrada**, em vez de uma coleção de controles técnicos de curva.
- Frames de câmera, estado dos ativos e `depth`/parallax têm responsabilidades distintas.
- Toda evolução deve preservar o renderer único/canônico e a paridade **Stage = Preview = Export**.
- A economia de Frames é princípio do produto: a representação deve ser satisfatória sem multiplicar elementos desnecessários.
- Uma implementação futura deverá ser dividida em tarefas pequenas, independentes, explicitamente aprovadas e verificáveis.

## 3. Desenho livre de trajetória

A ação deverá futuramente estar disponível no menu associado ao botão `+` / criação de Frames. Esse menu poderá reunir ações como **Novo frame**, **Duplicar frame**, futuras ações de grupos — por exemplo, **Duplicar grupo** — e **Desenhar**. A nomenclatura e o layout finais desse menu não são definidos nesta proposta.

Ao iniciar **Desenhar**, existe um frame ativo, que funciona como ponto de partida lógico da nova trajetória. O usuário desenha diretamente no Stage com dedo/pointer, e o gesto expressa a intenção espacial do percurso da câmera. Internamente, o Arco captura os pontos necessários e simplifica, suaviza e interpreta matematicamente o gesto.

O usuário não deve:

- escolher algoritmo de suavização;
- controlar tolerância matemática ou *thresholds*;
- escolher a quantidade de pontos;
- manipular a curva bruta capturada.

Essas decisões matemáticas devem permanecer internas, consistentes e calibradas pelo produto.

Pipeline conceitual:

```text
pointer gesture
→ amostragem
→ filtragem/simplificação
→ representação suave da trajetória
→ determinação de âncoras necessárias
→ criação econômica de Frames
→ curva editável canônica
```

## 4. Geração econômica de Frames

Ao fim do gesto, o Arco deverá gerar automaticamente uma trajetória editável compatível com o sistema canônico de Frames/curvas. A conversão deve usar a menor quantidade razoável de Frames capaz de representar satisfatoriamente o caminho.

Uma amostra do pointer não equivale a um Frame. A solução não deve criar um Frame para cada ponto capturado nem gerar dezenas de Frames desnecessários. Algoritmo, tolerâncias, limites mínimo/máximo, *thresholds* e critérios numéricos de fidelidade ficam deliberadamente em aberto para estudo e protótipo funcional futuros.

## 5. Relação com o frame ativo e inserção sequencial

O frame que estava ativo no instante em que o desenho começou é a origem lógica da operação. Os novos Frames resultantes deverão ser inseridos sequencialmente **depois desse frame**, mantendo a trajetória na ordem produzida pelo gesto.

A operação não redefine nesta proposta a UI final, o nome definitivo da função, a duração dos trechos nem a interação com grupos. Em particular, a menção a ações futuras de grupos no mesmo menu não altera a prioridade já registrada para grupos de Frames.

## 6. Edição posterior dos Frames gerados

Depois da conversão, os Frames gerados tornam-se Frames comuns do projeto. O usuário poderá posteriormente:

- mover ou ajustar esses Frames;
- excluir Frames que não sejam necessários;
- inserir Frames adicionais entre os gerados;
- aperfeiçoar a curva por meio das capacidades canônicas de edição que venham a ser aprovadas.

O desenho livre é um meio econômico de criação inicial, não um formato paralelo nem uma curva bruta permanente. A edição direta de curva no Stage continua sendo uma capacidade futura distinta.

## 7. Movimento independente por ativo

Como evolução estratégica futura, um ativo no ProjectWorld poderá possuir movimento próprio, independente do percurso da câmera:

- **Câmera/Frames** controla o movimento da câmera pelo Mundo;
- **Ativos/Mundo** contém os objetos;
- cada ativo poderá ter seu estado transformado ao longo do mesmo tempo global do projeto.

Frames de câmera não devem ser vinculados automaticamente aos keyframes ou estados temporais do ativo. Um ativo poderá se mover enquanto a câmera também se move, `depth`/parallax continua atuando e os demais ativos permanecem independentes.

## 8. Relação entre câmera, ativo e ProjectWorld

O movimento próprio altera o estado canônico do ativo no ProjectWorld ao longo do tempo, sem fundi-lo ao movimento da câmera. Uma futura trajetória espacial por ativo poderá partir de:

- estado inicial;
- estado final;
- eventualmente estados intermediários;
- curva ou Motion Path editável.

Esta proposta não define um editor completo de keyframes nem sua UI. A independência conceitual deve permitir que câmera e múltiplos ativos evoluam no mesmo relógio sem compartilhar obrigatoriamente pontos de controle.

## 9. Relação com depth/parallax

O movimento próprio do ativo é conceitualmente independente do `depth`/parallax existente. Esta proposta não reescreve, substitui nem define nova fórmula de parallax, e `depth` não deve reescrever a posição canônica do ativo.

Exemplo conceitual: uma personagem ou figurinha desloca-se pelo ProjectWorld; simultaneamente, a câmera percorre seus Frames; `depth`/parallax modifica a resposta aparente desse ativo à câmera; os componentes convergem somente no estado visual final.

## 10. Efeitos temporais por ativo

A capacidade poderá evoluir progressivamente, sem promessa de implementação conjunta, para contemplar:

- posição X/Y;
- escala;
- rotação;
- opacidade;
- entrada/aparecimento;
- saída/desaparecimento;
- fade;
- blur;
- outros efeitos simples que sejam aprovados futuramente.

Cada transformação ou efeito exige definição própria de modelo, persistência, interação, limites, composição e QA. Presença temporal e efeitos não devem ser tratados implicitamente como uma única entrega indivisível.

## 11. Animated Assets / GIF / Lottie

**Animated Asset** é um ativo cuja fonte visual possui animação interna própria. GIFs animados e Lottie permanecem possibilidades futuras, mas animação/movimento próprio de ativos é uma capacidade mais ampla e estrategicamente mais importante.

Suporte a GIF não deve bloquear nem determinar a arquitetura do sistema de animação por ativo. Caso decoder, memória, desempenho ou compatibilidade tragam custo ou complexidade excessivos no iPhone/Safari, GIF poderá permanecer como item futuro/de pesquisa. Esta proposta não escolhe decoder, biblioteca ou formato interno.

Um Animated Asset poderá futuramente também receber posição, escala, rotação, `depth`/parallax, movimento próprio, presença temporal e efeitos compatíveis. Assim, uma figurinha/personagem animada internamente poderá caminhar ou mover-se pelo Stage enquanto câmera e parallax também atuam.

## 12. Renderer e tempo global

Modelo conceitual de avaliação:

```text
tempo global t
→ estado da câmera em t
→ estado de transformação do ativo em t
→ profundidade/parallax do ativo em relação à câmera
→ composição final pelo renderer canônico
```

O encadeamento é conceitual e não define fórmula nem implementação. Câmera, transformação própria do ativo e resposta aparente de profundidade mantêm seus domínios; apenas o estado visual final é composto pelo renderer único/canônico. Qualquer solução futura deve preservar **Stage = Preview = Export**.

## 13. Evolução incremental futura

Qualquer implementação posterior deverá ocorrer em tarefas pequenas e independentes, com autorização explícita, critérios de aceitação e evidência compatível. Estudos podem validar separadamente captura do gesto, simplificação, conversão econômica em Frames, modelo temporal de ativos, transformações individuais, efeitos e fontes visuais animadas.

Uma etapa não autoriza automaticamente as seguintes. Não há neste documento cronograma, versão futura, data ou ordem vinculante de implementação.

## 14. Fora de escopo

Esta proposta não:

- implementa código, UI ou comportamento;
- escolhe algoritmo de suavização/simplificação;
- fixa tolerância, quantidade de Frames ou qualquer *threshold*;
- define nomenclatura ou layout final do menu;
- define editor completo de splines ou keyframes;
- altera Frames, curvas, timeline, ProjectWorld ou a matemática atual;
- altera renderer, Stage, Preview, Export, Save/Load ou Layers;
- altera `depth`/parallax ou determina fórmula nova;
- escolhe decoder, biblioteca ou formato interno para GIF/Lottie;
- autoriza implementação posterior.

## 15. Riscos arquiteturais

- **Excesso de Frames:** converter amostras diretamente em Frames tornaria a trajetória pesada e difícil de editar.
- **Perda de intenção:** simplificação excessiva pode descaracterizar o gesto; simplificação insuficiente pode preservar ruído.
- **Acoplamento temporal:** vincular Frames da câmera aos estados do ativo impediria evolução independente dos sistemas.
- **Dupla aplicação de posição:** misturar movimento próprio e parallax pode reescrever coordenadas canônicas ou aplicar deslocamentos mais de uma vez.
- **Divergência de renderização:** caminhos separados para Stage, Preview e Export podem produzir resultados diferentes.
- **Complexidade prematura de UI:** controles técnicos de curva ou um editor completo de keyframes podem contrariar a solução automática e incremental.
- **Compatibilidade mobile:** captura de pointer, desempenho, memória e fontes animadas exigem validação específica em iPhone/Safari.
- **Persistência e compatibilidade:** futuros estados temporais precisarão de evolução de schema e leitura segura de projetos existentes.

Esses riscos devem orientar protótipos e tarefas futuras; não justificam mudança funcional nesta PR documental.
