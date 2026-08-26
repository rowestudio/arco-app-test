# Roadmap de Produto Recuperado

## Atualização 2026-08-26 — rollback E9H

- Camadas/Profundidade: **PENDENTES DE NOVA TENTATIVA** após reprovação física e rollback da `v8z4b32E9H` para `v8z4b32E9F6` (REG-059, causa não comprovada).
- Próxima tentativa aprovada: lista limpa/rolável e ações contextuais únicas conforme `DEC-2026-08-26-01`; inclui lock/unlock canônico e persistido. Itens futuros, não implementados neste rollback.


Este documento registra a recuperação das decisões de produto originadas nas conversas do projeto Arco Motion App. A lista abaixo preserva o inventário recuperado como fonte detalhada e rastreável do backlog de produto; não é um novo plano criado pelo Codex, não define prioridade, ordem de implementação, estimativas, datas ou versões futuras, e não autoriza implementação automática dos itens.

Estados usados neste documento:

- Em evolução
- Futuro
- Pesquisa
- Regra
- Superada — decisão/formulação histórica preservada para rastreabilidade, mas que não deve mais ser implementada.

## 1. Mundo, câmera e Stage

- [Em evolução] O Arco é um mundo visual navegável por câmera, não apenas uma foto com zoom.
- [Em evolução] Stage, trilho/curvas, frames, câmera, tempos e export devem formar o mesmo sistema.
- [Futuro] Edição direta de curva no Stage, com alças maiores, suavização de ângulos e adição de frame sobre curva existente.
- [Futuro] Ferramenta de desenho contínuo de trajetória com dedo/pointer no Stage, acessível futuramente pelo menu associado ao botão `+` de Frames: a partir do frame ativo, o gesto será interpretado automaticamente e convertido na menor quantidade razoável de Frames comuns e editáveis, inseridos sequencialmente depois dele, sem criar um Frame por amostra nem expor controles técnicos de suavização. UI, nome e parâmetros matemáticos permanecem a confirmar em estudo/protótipo próprio.
- [Futuro] Ajustes por frame de posição, escala, rotação, foco/zoom e duração.
- [Futuro] Randomização controlada de posição, escala, rotação e duração, para seleção ou todos os frames.
- [Futuro] Distribuição proporcional horizontal/vertical de frames.
- [Futuro] Preservar curvas ao aplicar escala global ou templates.
- [Futuro] Movimento contínuo de rotação entre frames, inclusive voltas completas.
- [Futuro] Os modos Câmera/Frames e Ativos devem se tornar abas visuais reais, com diferenciação sutil de tom/fundo, sem alterar o comportamento. Backlog registrado pela série pré-promoção (`docs/PRE_PROMOTION_RELEASE_PLAN.md`); não implementar essa mudança visual nesta série.

## 2. Frames, trechos e reprodução

- [Futuro] Play no menu de Frames para tocar somente o trecho atual, por exemplo F3 → F4.
- [Futuro] Esse play deve respeitar posição, escala, rotação, curva e duração, sem alterar dados nem exportar.
- [Futuro] Preview deve mostrar a passagem real pelos frames e trechos.
- [Futuro] Durante o Preview, o frame ativo deve acompanhar a reprodução; tocar num frame deve permitir pausar/pular para edição.
- [Futuro] Durações por trecho, pausas por frame, loop e comportamento final configurável.
- [Futuro] Intensidade de easing por segmento: permitir ajustar localmente quanto a chegada/saída acelera, desacelera ou amortece, com possibilidade posterior de aplicação global, sem exigir editor técnico de curva e preservando `Constante` como ausência de easing temporal. Este registro não autoriza implementação.
- [Futuro] Passeio de Frames no modo Ativos/Stage como referência visual da câmera.

## 3. Ativos e composição

- [Em evolução] Múltiplos ativos, seleção direta, troca de imagem, ordem e preservação de composição.
- [Futuro] Inserir imagem e substituir imagem devem ser ações distintas.
- [Futuro] PNG com alpha, WebP, SVG, texto, stickers e elementos gráficos.
- [Futuro] Movimento próprio por ativo no mesmo tempo global do projeto, independente dos Frames da câmera e de `depth`/parallax: Motion Path editável e transformações progressivas de posição X/Y, escala, rotação e opacidade, sem vincular automaticamente keyframes do ativo aos Frames da câmera.
- [Futuro] Efeitos temporais compatíveis por ativo, incluindo possibilidades incrementais de entrada/aparecimento, saída/desaparecimento, fade e blur, sujeitos a aprovação e tarefas futuras independentes.
- [Futuro] Animated Assets — ativos cuja fonte visual possui animação interna própria — incluindo GIFs animados e Lottie como possibilidades futuras/pesquisa. Esse suporte é subordinado ao sistema mais amplo de animação por ativo, não o bloqueia nem determina sua arquitetura, e poderá permanecer em pesquisa se o custo ou a complexidade em iPhone/Safari forem excessivos.
- [Regra] Movimento próprio do ativo, câmera e profundidade permanecem componentes conceitualmente independentes: um ativo pode se mover enquanto a câmera percorre Frames, o parallax continua atuando e outros ativos mantêm estados próprios; todos convergem apenas na composição do renderer canônico, preservando Stage = Preview = Export.
- [Futuro] Texto editável: títulos, legendas, logos, overlays e quadros com largura ajustável, quebra automática e fundo/transparência.
- [Pesquisa] Project Background transparente + estudo de formatos/exportadores capazes de preservar canal alpha. Registro de POSSIBILIDADE FUTURA apenas (não implementado na E9F1). Não se afirma que o MP4 atual suporta alpha, nem que GIF ou HTML transparentes serão implementados; trata-se de investigação futura de formatos compatíveis, sujeita a tarefa e aprovação próprias.
- [Futuro] Crop, máscaras/molduras, bordas e controles independentes por ativo.
- [Futuro] Colar ativos diretamente no projeto.
- [Futuro] Distorção, inclinação e “achatamento” de ativos.
- [Futuro] Visibilidade temporal: ativo sempre visível, por intervalo de frames ou por tempo.
- [Futuro] Efeitos e comportamentos por ativo, começando por sombra configurável e presets simples como fade, pulsar, flutuar, girar lento e surgir com escala.
- [Pesquisa] Detalhamento incremental de quadros de texto, presença temporal por frames e comportamentos matemáticos em `docs/PROPOSAL_TEXT_BOXES_AND_ASSET_TIMING.md`.
- [Pesquisa] Proposta de desenho livre de trajetória e movimento independente por ativo em `docs/PROPOSAL_FREEHAND_PATH_AND_ASSET_MOTION.md`; o registro não autoriza implementação.

## 4. Layers

- [Em evolução] Layers já existe: o app possui múltiplos assets/Layers com seleção, visibilidade, ordenação e identidades persistentes. A frente aprovada é **readequação da interface de Layers existente**, não criação do zero (ver `docs/PRE_PROMOTION_RELEASE_PLAN.md`).
- [SUPERADAS/REVERTIDAS] Duas formulações históricas são preservadas apenas para rastreabilidade e **não são regra atual**: (1) painel permanente na lateral/sobre o Stage; (2) apresentação E9H com affordance compacto + sheet parcial. A E9H foi revertida e sua apresentação visualmente carregada foi superada. A decisão futura vigente é `DEC-2026-08-26-01`/`docs/PRE_PROMOTION_RELEASE_PLAN.md`: lista limpa e rolável; primeiro tap abre ações contextuais; scroll não abre; toque fora fecha; ordem antes da thumbnail; ações únicas; lock/unlock futuro. Nada disso está implementado neste rollback.
- [Futuro] O painel deve permitir ver, selecionar, ordenar, ocultar e trocar ativos sem sair do contexto do Stage.
- [Regra] Frames, curvas e HUD não entram na pilha visual dos ativos.

## 5. Grupos e blocos reutilizáveis

- [Regra de prioridade] Após formatos, a prioridade indicada é grupos de frames; este registro não autoriza implementação.

- [Futuro] Grupo de frames com cor/identidade própria.
- [Futuro] Editar grupo no Stage ou editar um frame individual dentro dele.
- [Futuro] Vincular e desvincular frames.
- [Futuro] Duplicar grupos preservando relações internas.
- [Futuro] Templates de grupos/blocos de animação reutilizáveis.
- [Futuro] Presets como zoom rápido, voo e estilingue.
- [Futuro] Importar/exportar projeto, grupo ou bloco de animação em formato editável.

## 6. Templates, formatos e comunidade

- [Futuro] Templates de Mundo, de música e de formatos.
- [Futuro] Área de trabalho vertical e horizontal; horizontal com Stage mais largo, adequado a filme.
- [Futuro] Templates adaptáveis aos ativos e à sequência do projeto.
- [Futuro] Usuários criam, salvam, reutilizam e compartilham templates/blocos.
- [Pesquisa] Comunidade/loja de templates, com importação do template inteiro ou apenas partes dele.

## 7. Cenas, narrativa e formatos de saída

- [Futuro] Múltiplas cenas/Stages no mesmo projeto, com passagem entre elas.
- [Futuro] Criar uma cena seguinte a partir de um frame da anterior.
- [Futuro] Export de imagem estática e presets de formatos sociais.
- [Futuro] Uso de PDF/documentos como base para trajetos visuais, narrativa ou tutorial.

## 8. Música e IA

- [Futuro] Templates guiados por música: BPM, batida, compasso e estrutura.
- [Futuro] Agente de IA atualizado com as capacidades reais do Arco.
- [Futuro] A IA gera projeto editável — frames, curvas, tempo, rotação, escala, composição e ativos — não vídeo fechado.
- [Futuro] A IA pode transformar uma imagem em roteiro/animação usando os recursos do app.
- [Futuro] A IA pode gerar templates e movimentos a partir de música.
- [Futuro] Caminho de câmera em JSON como formato estratégico para projetos e IA.

## 9. Profundidade e captura

- [Em evolução] Profundidade básica/parallax translacional por ativo já existe, com distância relativa à câmera e paridade canônica entre Stage, Preview, Export e persistência.
- [Futuro] Vista Profundidade 0 / vista absoluta no Modo Ativos, separada do controle de profundidade já existente.
- [Pesquisa] Evolução da distância para comportamento animável, preservando paridade entre Stage, Preview, Export e Save/Load.
- [Pesquisa] Motion Take: gravar movimento virtual da câmera por toque, arrasto, pinch e rotação, convertendo-o em frames editáveis.
- [Pesquisa] Captura por acelerômetro/AR do iPhone, possivelmente como produto complementar.

## 10. Escolha explícita ao encontrar checkpoint de sessão

- [Em evolução] O checkpoint de abertura/restauração e a escolha explícita entre recuperar a sessão ou começar do início já foram implementados.
- Evoluções futuras desse fluxo exigem tarefa própria e não fazem parte da `v8z4b32E8U`.

## 11. Evolução de Text Assets

- [Implementado em E8Y] Reedição tipográfica por toolbar e duplo toque, com fontes locais limitadas, cor, peso/itálico e alinhamento.
- [Futuro] Fundo e padding são propriedades da caixa de texto, sem placeholder inativo na interface atual.
- [Futuro] Presença temporal é função geral e compartilhada por imagens e textos: define **quando** o ativo aparece; animação define **como** aparece ou se comporta.

## Após E8Z — evolução de texto e interface

- Futuro: padding customizável e estilos de caixa por linha, sem declará-los implementados na E8Z.
- Futuro separado: presença temporal geral dos ativos; animação continua conceito e entrega distinta.
- A revisão geral tentará primeiro melhorar superfícies e estados ativos. O roxo atual tem pouco contraste em títulos, fontes e ícones; se ainda insuficiente, a própria cor de destaque deverá ser revista. Isso não bloqueia a E8Z.

## E9C — evolução visual e dimensional da caixa de texto (backlog; não implementado na E9B)

- Largura automática ajustada ao conteúdo: a caixa cresce conforme a maior linha até um limite seguro dentro do Stage e, depois desse limite, aplica quebra automática; Enter continua criando quebras manuais.
- Texto curto, como “R”, deve produzir caixa curta proporcional ao glifo e ao padding.
- Adicionar controle ajustável de raio das quinas.
- Preparar, em tarefa própria, arquitetura para futura borda da caixa — ativação, cor e espessura — sem controle, renderização, propriedades canônicas ou campos visíveis antecipados na E9B.
- Investigar e ampliar o limite de escala dos Text Assets para fontes maiores, preservando geometria finita, proporção, hit-test, Preview, Export e persistência.
- O limite exato de escala será definido somente após análise específica da E9C; esta etapa não inventa valor nem autoriza implementação automática.
