# DECISIONS

## DEC-2026-09-02-04 — Play verde de Frames é diagnóstico local do Stage

- **Decisão:** o controle verde **Frames**, visível apenas no Modo Frames, inicia no Frame ativo e percorre o Stage até o fim do ciclo ou até Stop. O Play rosa permanente continua reservado ao Preview final.
- **Consequência:** a execução usa o sampler temporal existente apenas para navegação visual do editor; não abre Preview, não entra no pipeline de Export e não persiste Frames, durações, pausas, curvas, Undo ou autosave.

## DEC-2026-09-02-03 — Retorno do MP4 reusa o snapshot canônico no contexto Preview

- **Decisão:** ao terminar um MP4, o renderer não cai para assets ao vivo para reiniciar o Preview. O snapshot estável recém-validado pelo Export é transferido para o contexto `preview`, e a presença temporal é resolvida novamente pelo relógio do Preview.
- **Motivo:** Export correto não garante retorno de Preview correto se os contextos divergirem; imagens e Text Assets precisam manter a mesma fonte canônica de renderização na transição.
- **Consequência:** o arquivo concluído não é modificado, e a reentrada não altera Frames, ProjectWorld, geometria, opacidade manual, timing ou estado persistido. Implementação técnica na `v8z4b32E9AO`; validação física em iPhone/Safari ainda é obrigatória.

## DEC-2026-09-02-02 — Snapshot de render inclui toda a aparência manual do ativo

- **Decisão:** o snapshot imutável de Preview/Export deve carregar `asset.opacity` de imagens, além da fonte, geometria, rotação, profundidade e presença já congeladas. A entrada intermediária de desenho conserva o mesmo valor.
- **Motivo:** Stage usa o modelo vivo, mas Preview e Export usam snapshot. Omitir um atributo visual nesse limite cria divergência temporal e torna o arquivo exportado diferente do editor.
- **Escopo:** a correção não altera câmera, timing, loop, WebCodecs, geometria, presença temporal, opacidade própria do fundo de texto ou qualquer regra global futura.

## DEC-2026-09-02-01 — Opacidade manual é baseline individual do ativo

- **Decisão:** imagens e Text Assets passam a ter `asset.opacity` canônica, individual e persistente, limitada a 0–1 e iniciada em 1. O controle aparece em Ativos imediatamente após **Tempo**, com slider 0–100% e Reset em 100%.
- **Semântica:** presença temporal decide se o ativo participa do instante; opacidade manual decide seu alpha somente quando ele participa. No texto, a opacidade manual reduz glifos e fundo como conjunto; a opacidade específica do fundo continua sendo seu alpha interno.
- **Paridade e evolução:** Stage, Preview, Export, Save/Load, Session Restore e Undo/Redo usam o mesmo baseline. Efeitos globais futuros devem multiplicar esse valor — nunca substituir `asset.opacity`.
- **Escopo:** sem controle global de opacidade e sem efeitos de entrada/saída nesta frente.

## DEC-2026-08-31-01 — Presença temporal mantém referência editorial fora do intervalo

- **Decisão:** a primeira implementação de presença temporal separa rigorosamente o instante em que o asset entra/sai da aparência editorial do Stage. Preview e Export omitem o asset fora do intervalo; no editor ele continua como referência suavizada com contorno neutro tracejado. Selecioná-lo conserva coral de Ativos e permite edição.
- **Escopo:** transparência/opacidade manual e efeitos de entrada/saída não entram nesta frente. A marca editorial não é opacidade persistida, não altera geometria, profundidade, zIndex, hit-test canônico nem é renderizada em Preview/Export.
- **Referências:** cada Entrada/Saída pode ancorar em tempo do projeto (fixo ou proporcional), `frameId` estável ou Entrada/Saída de outro asset, mais offset. Ciclos são inválidos; a exclusão de uma âncora converte os dependentes para o tempo resolvido após confirmação explícita.
- **Implementação:** executada na `v8z4b32E9AG` em PR funcional própria. O escopo implementado inclui resolvedor canônico, persistência, `frameId` estável, controles globais/individuais, referência editorial no Stage, filtro de Preview/Export e confirmação de exclusão de âncora.
- **Registro:** detalhes e critérios de QA em `docs/superpowers/specs/2026-08-31-asset-temporal-presence-editor-reference-revision.md`. Esta decisão revisa o comportamento de Stage descrito no desenho de 2026-08-30; qualquer próxima etapa de opacidade manual ou efeitos exige nova frente.

## DEC-2026-08-30-04 — Mão é um modo explícito de navegação de um dedo

- **Decisão:** enquanto o ícone de mão estiver ativo, o gesto primário no Stage desloca somente a vista, em qualquer zoom permitido pelo editor. A precedência vale sobre seleção, movimento e edição de Frames/Ativos; o gesto de dois dedos continua preservado.
- **Motivo:** o zoom dinâmico pode estar abaixo de 100%, e navegar por um dedo precisa manter a mesma semântica visual e de interação nesse intervalo, sem transformar um arraste em edição acidental.
- **Consequência:** a ativação da mão não muda geometria canônica nem é persistida no projeto. Implementação técnica em `v8z4b32E9AF`; validação física iPhone/Safari permanece pendente.

## DEC-2026-08-30-03 — Zoom dinâmico não implica reset de navegação

- **Data:** 2026-08-30.
- **Decisão:** os botões de zoom do Stage percorrem passos incrementais também abaixo de 100%, respeitando `getEditorMinZoom()`. Um passo de zoom preserva o pan corrente, limitado somente pelo clamp canônico.
- **Regra de interação:** resetar para 100% e pan zero exige a ação explícita no rótulo percentual; `−` no mínimo fica desabilitado e nunca executa reset implícito.
- **Consequência:** o controle distingue navegação incremental de reset, inclusive quando o ProjectWorld reduz o mínimo dinâmico. Implementação técnica em `v8z4b32E9AE`; validação física iPhone/Safari permanece pendente.

## DEC-2026-08-30-02 — Presença temporal de ativos é genérica, referencial e separada de efeitos

- **Data:** 2026-08-30.
- **Decisão:** imagens e textos terão presença temporal por Entrada e Saída, com âncoras de tempo do projeto, Frame ou evento de outro ativo, mais deslocamento em segundos. Opacidade manual é base persistente e não é substituída pela presença. A primeira etapa não expõe efeitos; futura animação reutilizará os mesmos gatilhos.
- **Hierarquia:** padrões ficam em `Edição do projeto > Aparência`; o ativo selecionado recebe painel compacto `Animação`, com Entrada/Saída desligadas por padrão e expansão somente após ativação. `Aplicar a todos` sobrescreve overrides; `Aplicar aos sem ajuste individual` preserva-os.
- **Integridade:** vínculos cíclicos são bloqueados. Ao excluir ativo referenciado, a confirmação converte dependências em tempos absolutos resolvidos, sem relink automático; Undo restaura os vínculos.
- **Duração:** redimensionamento proporcional do projeto oferece, ligado por padrão, acompanhar tempos absolutos, offsets e futuras durações de efeitos; vínculos semânticos a Frames/Ativos permanecem vínculos.
- **Status:** especificação aprovada em `docs/superpowers/specs/2026-08-30-asset-temporal-presence-design.md`; nenhuma implementação funcional é autorizada por este registro isoladamente.

## DEC-2026-08-30-01 — Cor sempre tem amostra inline; placeholder de texto mede sua própria largura

- **Data:** 2026-08-30.
- **Decisão:** o valor hexadecimal de uma cor não é a única representação visual: Fundo do projeto, Cor do texto e Fundo da caixa exibem uma amostra da cor ativa na mesma linha do campo, imediatamente antes do código. Não se cria uma linha adicional nem uma nova superfície. Para texto novo, `Texto...` é somente o preview de criação; o rascunho salvo continua vazio até a confirmação com conteúdo do usuário.
- **Consequência:** paleta, picker e edição hexadecimal convergem na mesma cor apresentada. A caixa automática do rascunho reserva a largura do placeholder durante a criação, eliminando a quebra por caractere sem introduzir conteúdo falso em assets confirmados. Implementação técnica em `v8z4b32E9AD`; validação física iPhone/Safari ainda pendente.

## DEC-2026-08-29-01 — Controles gerais ficam em Edição do projeto

- **Data:** 2026-08-29.
- **Decisão:** os botões de modo Câmera e Ativos têm uma única função: alternar o modo. O ícone de olho mantém a alteração direta de visualização sem abrir sheet. Formato, Fundo e Tremor Global ficam em Edição do projeto > Projeto > Aparência.
- **Contexto:** o segundo toque no modo ativo escondia um submenu com ações de naturezas diferentes. Inserir imagem já tem entrada direta; Formato e Fundo são propriedades gerais do projeto, não do modo atual.
- **Consequência:** a visualização permanece direta e contextual ao modo; Formato e Fundo são controles inline, sem empilhar ou fechar o painel Projeto. A futura organização de easing e outras preferências pode subdividir Aparência quando houver volume suficiente.
- **Status:** corrigida tecnicamente na `v8z4b32E9AC`; validação física em iPhone/Safari permanece pendente e não há promoção para produção.

## DEC-2026-08-29-01 — E9Z: ações de duplicação e clipboard

- Roberto aprovou ações distintas: duplicar no painel Layers sem deslocamento, duplicar na barra inferior com deslocamento e colar somente no menu `+` de Ativos.
- O clipboard do sistema determina a última cópia. Leitura incompatível ou negada não pode causar fallback silencioso para um ativo copiado anteriormente.
- HEIC/HEIF passam a ser formatos aceitos quando o navegador os decodifica. O Arco não inventa transparência: registra o alpha observado e não achata a imagem para JPEG.

## DEC-2026-08-29-01 — release cut E9Y e promoção autorizada

- A PR #535, `v8z4b32E9Y`, foi mergeada na `main` de teste em `ffca487a5dc1ef081a29f2f53ba453d2c0599180`, publicada e aprovada fisicamente por Roberto em iPhone/Safari. ProjectWorld, Preview e Export WebCodecs foram confirmados; `exportSuccess = true`.
- A E9Y fecha esta release e é a fonte exata da PR separada de promoção para `rowestudio/arco-app`. Não criar versão, melhoria funcional ou merge automático durante a promoção.
- A exigência histórica de Engine Sprint antes da promoção é superada exclusivamente para E9Y. Engine Sprint segue não implementado e passa à próxima rodada de desenvolvimento. Nenhuma melhoria funcional nova entra antes da promoção E9Y.

## DEC-2026-08-28-10 — E9W: trilhas verticais separadas na régua de Profundidade

- As marcas neutras ficam numa trilha acima do slider; o slider ocupa a trilha central; os labels `−100`, `0` e `+100` ficam abaixo, com espaço físico entre eles. A marca coral não retorna.
- O indicador central da timeline de Frames foi medido contra o eixo canônico e o chip ativo; esta PR não altera sua geometria sem evidência de desalinhamento reproduzível.

## DEC-2026-08-28-09 — E9V: marcas neutras acima dos labels de Profundidade

- O esclarecimento físico da E9U preserva as 11 marcas da escala de `−100..+100` a cada 20 pontos, inclusive em `−100`, `0` e `+100`. Todas usam o mesmo cinza neutro e altura compacta, acima dos labels.
- Somente as marcas coral grandes são removidas. Os labels `−100`, `0` e `+100` permanecem abaixo das marcas, sem sobreposição; thumb, fill, `−5/+5` e Reset não mudam.

## DEC-2026-08-28-08 — E9U: régua de Profundidade apenas com labels

- Pelo retorno físico da E9T, a régua de Profundidade remove todas as marcas lineares, inclusive a marca coral central. Permanecem somente os labels `−100`, `0` e `+100`, o thumb, o fill, os passos `−5/+5` e Reset.
- Seleção múltipla de Camadas para posição, escala e profundidade em grupo é registrada no roadmap como evolução futura; não é implementada nesta versão.

## DEC-2026-08-28-07 — E9T: legibilidade da régua de Profundidade

- Após validação física da E9S, o ícone redundante ao lado do valor de Profundidade é removido e as marcas/rótulos da régua ganham contraste tipográfico suficiente sobre a superfície escura.
- A alteração preserva o intervalo, as gradações, o cálculo de alinhamento, os passos `−5/+5`, Undo/Redo e os demais controles de Camadas.

## DEC-2026-08-28-06 — Evidência mínima determinística do Export WebKit macOS

- O job `Real Export Smoke (WebKit macOS)` mantém falha real do teste como falha do job, mas sempre gera um manifesto de evidência com SHA, ref, runner e tentativa antes do upload.
- A correção trata exclusivamente o upload sem arquivos ocorrido após teste H.264 bem-sucedido; não altera Preview, Export, WebCodecs, UI ou versão do aplicativo.

## DEC-2026-08-28-05 — E9S: régua e passos de Profundidade

- Profundidade mantém intervalo canônico `−100..+100`; a régua e o fill derivam do mesmo cálculo normalizado do slider para marcas a cada 20 e labels `−100`, `0`, `+100`.
- Botões `−5/+5` usam o mesmo caminho do slider, com Undo/autosave único. Setas de Camadas são removidas após aprovação física da E9R.
- REG-059 não recebe causa atribuída; a validação física desta nova apresentação continua obrigatória.

## DEC-2026-08-28-04 — E9R: estabilidade de destino no reorder

- Os centros da pilha são capturados no início do gesto; mudanças de destino exigem cruzar o ponto médio com margem de histerese. A prévia não muta o modelo e só o `pointerup` confirma ordem.

## DEC-2026-08-28-03 — E9Q: reordenação viva de Camadas

- Pressão longa inicia reorder visual: a miniatura acompanha o dedo e as demais abrem espaço em tempo real.
- Voltar à posição original e soltar não altera a ordem. Somente soltar em outra posição confirma uma única mudança e um único Undo.
- Subir/Descer permanecem até aprovação física deste gesto no iPhone/Safari.

## DEC-2026-08-28-02 — E9P: fechamento e feedback de Camadas

- Tocar o Stage fora da UI de Camadas fecha pilha e detalhe antes de o Stage selecionar/manipular um ativo.
- Durante pressão longa/arrasto, a miniatura selecionada usa o coral de Ativos e acompanha visualmente o dedo. A seleção de Camada também usa coral, não azul.
- Ação indisponível mantém superfície opaca; somente seu símbolo fica esmaecido.

## DEC-2026-08-28-01 — E9O: correção física da E9N em Camadas

- **Decisão:** Camadas é UI exclusiva do editor e fica oculta durante Preview/Export. A faixa inferior de Ativos passa a mostrar a profundidade finita atual junto da identificação já existente da Camada, escala e rotação.
- **Reordenação:** enquanto o gesto pressão longa/arrasto não for aprovado fisicamente, Subir e Descer permanecem como controles temporários na faixa contextual. O toque longo em miniaturas não pode abrir a imagem nem a folha nativa de compartilhar/salvar.
- **Tamanho:** ações contextuais passam a 60 × 60 px, igualando a dimensão da miniatura da Camada.
- **Fora do escopo:** Preview/Export em seu conteúdo, ProjectWorld, Save/Load, Frames, curvas, Text Asset e Engine.

## DEC-2026-08-27-05 — E9N: ações canônicas e reordenação direta de Camadas

- **Data:** 2026-08-27. **Versão:** `v8z4b32E9N`, sobre a `main` que contém E9M.
- **Decisão:** a faixa horizontal mantém somente Visibilidade, Profundidade, Fixar/Desafixar e Excluir. Todas usam os símbolos SVG canônicos do app e alvo de toque de 44 × 44 px. “Trocar” continua exclusivamente no menu inferior de Ativos; Subir/Descer são substituídos por segurar e arrastar a miniatura para reordenar.
- **Interação:** arrasto iniciado antes da pressão longa preserva a rolagem normal da pilha. Layer travada não pode ser reordenada. A reordenação preserva a seleção canônica, identidade, `depth` e os limites protegidos desta frente.
- **Profundidade futura registrada:** uma PR posterior e isolada poderá especificar escala `−100..+100`, marcas de 20 em 20, labels `−100/0/+100` e passos `−5/+5`. Não reutiliza a régua E9H sem um desenho em que thumb, fill e marcas derivem da mesma geometria; REG-059 continua sem causa atribuída.
- **Fora do escopo:** Preview, Export, ProjectWorld, Save/Load, Frames, curvas, Text Asset e Engine.

## DEC-2026-08-27-04 — E9M: legibilidade e sincronização imediata da Profundidade

- **Data:** 2026-08-27. **Versão:** `v8z4b32E9M`, correção funcional localizada sobre a `main` que contém a E9L.
- **Decisão:** os botões da faixa horizontal de Camadas usam superfície opaca para leitura sobre qualquer asset; a ação destrutiva usa exclusivamente o símbolo de lixeira, nunca `×`. O valor de Profundidade da faixa é atualizado durante o arraste no painel contextual, sem fechar o painel.
- **Correção visual do painel atual:** toda sincronização programática de `#assetContextSlider` repinta imediatamente o fill pelo mesmo valor efetivamente aplicado ao thumb. Não altera intervalo, steps, matemática de profundidade, ordem das Camadas ou a semântica independente de `depth` e `zIndex`.
- **Limite explícito:** não reintroduz a régua, ticks, labels `−100/0/+100`, fill bidirecional ou steps E9H. Esse desenho histórico foi revertido após REG-059 e sua causa raiz segue não comprovada; qualquer retomada exige decisão funcional específica.
- **Fora do escopo:** Preview, Export, ProjectWorld, Save/Load, Frames, curvas, Text Asset e Engine.

## DEC-2026-08-27-03 — E9L: detalhe horizontal de Camada (APROVADA PARA IMPLEMENTAÇÃO)

- **Data:** 2026-08-27. **Versão:** `v8z4b32E9L`, PR funcional corretiva sobre a `main` que contém a E9K.
- **Decisão de apresentação:** preserva a pilha de miniaturas E9K, cuja abertura e seleção foram aprovadas fisicamente por Roberto. O toque numa miniatura abre uma faixa horizontal compacta, projetada para a esquerda a partir daquela miniatura. Os botões ficam lado a lado; o nome da Layer fica acima, direto sobre o Stage, sem caixa de fundo; não há botão Fechar.
- **Fechamento e profundidade:** tocar novamente a mesma miniatura fecha somente o detalhe; tocar outra muda o detalhe; tocar área vazia do Stage fecha a pilha pelo comportamento canônico. O botão de Profundidade mostra ícone e valor finito atual (`0`, `+30`, `−20`) e abre o mesmo controle contextual canônico para ajustar.
- **Interação:** os botões de ação interrompem a propagação para o Stage, mas não cancelam o `click` WebKit do próprio botão. O olho usa glyph vetorial claro; lock/unlock e as demais ações existentes permanecem canônicos. Arrastar/segurar uma miniatura para reordenar continua fora desta PR.
- **Fora do escopo:** Preview, Export, ProjectWorld, Save/Load, Frames, curvas, Text Asset e Engine.

## DEC-2026-08-27-02 — E9K: miniaturas puras e detalhe vertical de Camada (IMPLEMENTADA; detalhe superado pela E9L)

- **Data:** 2026-08-27. **Versão:** `v8z4b32E9K`, em PR funcional corretiva sobre a `main` que contém E9I/E9J.
- **Decisão de apresentação:** a pilha de Camadas mostra somente miniaturas, sem número, nome ou informação textual em cada preview. Tocar uma miniatura abre o detalhe da Layer. A formulação vertical foi superada pela DEC-2026-08-27-03/E9L. O detalhe não aparece ao abrir a pilha; aparece somente após tocar a miniatura.
- **Relação com E9J:** esta decisão supersede a posição da área de ações definida para E9J; a aprovação visual E9I continua sendo o fallback seguro, mas a E9K passa a ser o desenho ativo em validação.
- **Correção de REG-060:** o alvo `#layersPanel` passa a ser explicitamente excluído da navegação por toque do Stage. Antes disso, o `touchstart` global do Stage classificava a miniatura como viewport, chamava `preventDefault()` e o WebKit não emitia o `click` que seleciona a Layer.
- **Preservação:** a seleção continua em `selectAssetById()`; lock/unlock e as ações existentes são reutilizados. Sem drag-and-drop de reordenação nesta etapa.
- **Fora do escopo:** Preview, Export, ProjectWorld, Save/Load, Frames, curvas, Text Asset e Engine.

## DEC-2026-08-27-01 — E9J: pilha de Camadas sobre o Stage, ancorada ao ícone (APROVADA PARA IMPLEMENTAÇÃO)

- **Data:** 2026-08-27. **Versão:** `v8z4b32E9J`, em PR funcional própria sobre a `main` que contém a PR #518 (`v8z4b32E9I`).
- **Assunto:** evolução localizada da apresentação de Camadas, sem reimplementar modelo, seleção, reordenação, lock/unlock ou Profundidade.
- **Decisão:** tocar o ícone de Camadas no Stage expande uma pilha vertical sobre o próprio Stage, acima do ícone, sem modal central e sem quadro único que cubra o editor. A lista mantém rolagem nativa; arrastar a lista apenas rola nesta etapa, não reordena Layers. Quando já houver Asset selecionado, a pilha abre com a respectiva linha selecionada e as ações contextuais prontas. Tocar uma linha troca a seleção canônica por `selectAssetById()` e atualiza a única área de ações.
- **Ações:** a área única de ações fica acima da pilha de linhas; não há ações repetidas em cada linha nem abaixo da lista. Continua usando as ações canônicas existentes, inclusive lock/unlock.
- **Fallback aprovado:** Roberto aprovou visualmente a E9I em iPhone/Safari como fallback seguro. Se uma reversão futura retornar à apresentação E9I, as ações de Camadas deverão ficar na parte superior da interface contextual, não abaixo da lista.
- **Fora do escopo:** Preview, Export, ProjectWorld, Save/Load, Frames, curvas, Text Asset e Engine. Esta decisão não atribui causa à REG-059 nem reabre a REG-058.

## DEC-2026-08-26-01 — rollback da E9H e novo desenho futuro de Camadas (APROVADA)

> **Implementação E9I (2026-08-26):** a nova tentativa foi implementada e mergeada pela PR #518. `asset.locked` usa o campo canônico já serializado/hidratado, com default destravado, Undo/Redo e autosave pelo fluxo normal; o Stage ignora Layer travada no hit-test e bloqueia movimento/transformação. A UI não reutiliza a régua E9H: Profundidade preserva o slider canônico com ícone + valor. A aprovação física da base E9F6/rollback #517 e o status resolvido fisicamente de REG-058 foram preservados no Project OS. Roberto aprovou visualmente a apresentação de Camadas E9I em iPhone/Safari; a evolução de apresentação E9J é registrada em DEC-2026-08-27-01.

- **Decisão de rollback:** a PR #516 / `v8z4b32E9H`, já mergeada e publicada, foi reprovada fisicamente por REG-059 e deve ser revertida integralmente para `v8z4b32E9F6`, sem correção na mesma PR. A apresentação E9H de Camadas fica preservada no histórico, mas **SUPERADA**.
- **Próxima tentativa de Camadas:** controle compacto no Stage expande lista vertical rolável na ordem da pilha. Com a lista aberta, o primeiro toque normal numa Layer seleciona e abre imediatamente suas opções; não há segundo toque, double tap ou long press. Gesto de scroll apenas rola. Tocar outra Layer troca seleção e ações. Tocar fora, no Stage, fecha lista/opções sem alterar o projeto.
- **Lista/cabeçalho futuros:** cada linha prioriza ordem numérica **antes** de thumbnail/ícone (um pouco maior que na E9H) e nome; remover `Posição N de M · Prof. X` e botões repetidos. Cabeçalho mostra `Camadas`, total (`7 camadas`, por exemplo) e fechamento compatível com o app. Profundidade contextual usa ícone antes do valor (`0`, `+30`, `−20`), nunca texto corrido. Há uma única área de ações para a selecionada: visibilidade, subir, descer, profundidade, trocar imagem quando aplicável, travar/destravar e excluir.
- **Lock/unlock futuro:** Layer travada permanece visível, no projeto, Camadas, Preview e Export, mas não pode ser selecionada pelo hit-test do Stage, movida, escalada, rotacionada ou editada diretamente; o toque pode alcançar Layer destravada elegível abaixo. No painel ela pode ser selecionada para inspeção/destravar, com estado indicado e destravar acessível. A trava será propriedade canônica do asset, default destravado, backward-compatible e integrada a Save/Load, Session Restore, Undo/Redo e autosave; são proibidos array/Set/localStorage paralelos, `selectedLockedAssetId` e segundo modelo de Assets.
- **Limite desta decisão:** tudo acima é **FUTURO/APROVADO e NÃO IMPLEMENTADO neste rollback**. Engine Sprint não foi iniciado.



## DEC-2026-08-24-03 — HISTÓRICA / SUPERADA / REVERTIDA — v8z4b32E9H: readequação de Camadas + revisão visual de Profundidade; base `v8z4b32E9F6` aceita fisicamente; REG-058 resolvida fisicamente pelo rollback; botões `−10`/`+10` substituem `−5`/`+5`

- **Data:** 2026-08-24. **Versão:** `v8z4b32E9H` (PR própria, branch `claude/v8z4b32e9h-layers-depth-gf58ay`).
- **Assunto:** três decisões distintas persistidas na mesma tarefa: (1) aceite físico da base restaurada; (2) readequação de interface de Layers/Camadas + revisão visual de Profundidade sobre sistemas já existentes; (3) substituição da decisão anterior de botões `−5`/`+5` de Profundidade por `−10`/`+10`.
- **Classificação:** PR funcional — readequação de interface + revisão visual localizada. Não é criação de Layers/Profundidade do zero, não é Engine Sprint, não é redesign geral, não é refatoração arquitetural, não é correção de Text Asset, não é promoção.
- **Decisão A — base restaurada `v8z4b32E9F6` aceita fisicamente como continuidade:** após o merge da PR #515 (rollback da E9G1) e a publicação da build restaurada, Roberto testou novamente em iPhone/Safari e decidiu aceitar essa versão como base funcional para continuidade do produto. Consequência direta: **REG-058 passa de ABERTA para RESOLVIDA FISICAMENTE PELO ROLLBACK/RESTAURAÇÃO DA E9F6**, o mesmo tratamento físico já registrado para REG-057 — a causa raiz original da REG-058 continua NÃO comprovada, e nenhuma hipótese (pointer capture, clamp, overlay, listener, side handle) é registrada como causa sem evidência de reprodução. **REG-056 permanece ABERTA/PENDENTE DE NOVA TENTATIVA** — nenhuma terceira tentativa de side width handles foi iniciada nesta PR, por estar fora do escopo desta tarefa (Camadas/Profundidade, não Text Asset).
- **Decisão B — limitação conhecida do Text Asset registrada, não investigada:** a rota de edição do Text Asset pelo menu/controle deslizante pode, ocasionalmente, não abrir o editor, enquanto o duplo toque continua abrindo normalmente. Por decisão explícita de Roberto, isso é uma limitação conhecida e não bloqueadora, não impede aceitar a base, e fica registrada para revisão futura — sem investigação, sem correção e sem causa inventada nesta PR.
- **Decisão C — Camadas: affordance compacto + sheet parcial, reaproveitando o modelo/funções existentes:** implementado `#layersAffordance` (Stage, Modo Ativos, não reutiliza `#stageEyeShortcut`) como entrada principal de Camadas, substituindo a entrada "Layers" do menu inferior de Ativos. `#layersPanel` foi reconstruído como sheet parcial a partir de baixo (altura máxima ~40vh, rolagem interna, Stage visível/interativo acima, fechamento só por ação explícita, seleção nunca fecha a sheet). Nenhuma lógica nova de seleção/zIndex/visibilidade foi criada: `selectAssetById`, `layerMoveAssetUp`/`layerMoveAssetDown`, `layerReplaceImageForAsset` e `deleteSelectedAsset` são reaproveitadas sem alteração de comportamento; as duas únicas funções novas (`toggleAssetVisibility`, `layerDeleteAsset`) apenas expõem/delegam para infraestrutura já existente (`asset.visible`, `deleteSelectedAsset()`).
- **Decisão D — Profundidade: régua visual + preenchimento bidirecional + `−10`/`+10`, reaproveitando o controle existente:** o intervalo público contínuo `−100..+100` e a semântica `assetContextPanelKind==='depth'`/`setAssetContextValue`/`commitAssetContextGesture` não mudam. Adições puramente visuais/de apresentação: régua com apenas três números (`−100`, `0`, `+100`) e oito ticks intermediários sem número, com o zero mais destacado; preenchimento bidirecional a partir do zero (`updateDepthSliderFill`, função nova e isolada — não altera `updateSliderFill`/REG-052); título "Profundidade" (elemento próprio, não substitui `#assetContextValue`, preservando os gates existentes de E9A/TC-044).
- **Decisão E — botões `−10`/`+10` substituem a formulação anterior de `−5`/`+5` para Profundidade:** o plano registrado em `docs/PRE_PROMOTION_RELEASE_PLAN.md` (seção 3, nunca implementada) mencionava `−5`/`+5`. Essa formulação está **SUPERADA** por decisão explícita desta tarefa; a implementação usa `−10`/`+10` + Reset para 0, com o mesmo padrão de 1 Undo/1 autosave por clique já usado por Escala/Rotação, sem criar snap do slider para múltiplos de 10.
- **Alternativa rejeitada:** manter `−5`/`+5` por já estarem documentados — rejeitada porque a instrução desta tarefa supersede explicitamente essa formulação nunca implementada.
- **Alternativa rejeitada:** reaproveitar `#stageEyeShortcut` para a entrada de Camadas — rejeitada explicitamente pelo desenho aprovado (ícones distintos, funções distintas).
- **Alternativa rejeitada:** aumentar a altura de `#assetContextPanel` globalmente (afetando também `custBar`/`alignBarSubmenu` de Frames) para caber a régua de Profundidade — rejeitada; a altura extra é escopada por um marcador dedicado (`body.asset-context-depth-open`) que só afeta o kind `depth` do próprio `#assetContextPanel`, preservando Frames e os demais kinds (Escala/Rotação) intactos.
- **Status atual:** **HISTÓRICA / SUPERADA / REVERTIDA.** A implementação foi mergeada pela PR #516, publicada e a build E9H foi reprovada fisicamente por REG-059 em Profundidade. Camadas não apresentou regressão funcional grave comprovada, mas sua apresentação foi considerada visualmente carregada e superada. O rollback restaurou `v8z4b32E9F6`; esta decisão não está ativa e não autoriza reimplementar a E9H. A decisão futura vigente é `DEC-2026-08-26-01`.
- **Documento relacionado:** `docs/PROJECT_STATE.md`, `docs/REGRESSIONS.md` (REG-056, REG-057, REG-058), `docs/PRODUCT_RULES.md` (Regra E9H), `docs/PRE_PROMOTION_RELEASE_PLAN.md` (seção 3), `docs/ROADMAP.md`, `docs/PRODUCT_ROADMAP.md`, `docs/TEST_CASES.md`, DEC-2026-08-24-02 (rollback que restaurou a base desta PR).

## DEC-2026-08-24-02 — ROLLBACK da E9G1 (PR #514) após REG-058; REG-056 permanece ABERTA; REG-057 preservada como resolvida fisicamente

- **Data:** 2026-08-24. **Versão:** `v8z4b32E9F6` restaurada (PR própria de rollback, `claude/rollback-v8z4b32e9g1-e9f6-gwdtei`).
- **Assunto:** rollback funcional integral da PR #514 / `v8z4b32E9G1` (segunda tentativa de side width handles do Text Asset) após reprovação física da build publicada em iPhone/Safari — **REG-058** (após manipulação/edição de largura do Text Asset chegando ao limite, o Stage deixou de permitir edição/interação).
- **Classificação:** rollback funcional de build publicada reprovada fisicamente. Não é nova implementação, não é redesign, não é correção de REG-056/REG-057/REG-058, não é Engine Sprint, não é promoção.
- **Decisão A — reverter integralmente, não corrigir:** a causa raiz de REG-058 não foi comprovada nesta sessão. Investigar/corrigir dentro da mesma janela arriscaria publicar uma terceira tentativa não validada sobre uma build já reprovada fisicamente pela segunda vez na mesma área (Text Asset/largura/Stage). A decisão foi reverter integralmente para a última base funcional conhecida (`v8z4b32E9F6`, tree do commit `2ff86e1bc6323b57b7371fd5ff38dab2dfd1d3ac`, merge da PR #513) via `git revert -m 1` do commit de merge da PR #514 (`4d54b917559b863b78d2590f3271aa31c1349ea5`), usando corretamente o parent principal. Confirmado por diff que `index.html`, `scripts/qa/check-asset-transform-handles.mjs`, `scripts/qa/run-self-tests.mjs` e `tests/smoke/app.spec.mjs` ficaram byte-idênticos à base `2ff86e1b`; nenhum resíduo alcançável de `.text-width-handle`, `beginTextWidthDrag`, `handleTextWidthPointerMove`, `endTextWidthPointer` ou demais infraestrutura específica da E9G1 permanece. `APP_VERSION`/`APP_VERSION_NAME` restaurados para `v8z4b32E9F6`.
- **Decisão B — não fazer revert cego da documentação:** um revert mecânico de `docs/PROJECT_STATE.md`, `docs/REGRESSIONS.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`, `docs/PRE_PROMOTION_RELEASE_PLAN.md` e `docs/TEST_CASES.md` apagaria o fato de que a `v8z4b32E9G1` foi mergeada, publicada e REPROVADA FISICAMENTE (voltando os documentos ao estado de 2026-08-23, como se a E9G1 nunca tivesse existido), e reverteria indevidamente **REG-057** do status já comprovado fisicamente ("RESOLVIDA FISICAMENTE PELO ROLLBACK/RESTAURAÇÃO DA E9F6") de volta a "validação pendente" — um fato físico anterior à E9G1 que não deve ser reaberto por este segundo rollback. Por isso, após o revert mecânico do código recuperar a base, a documentação foi reconstruída manualmente: REG-057 permanece RESOLVIDA FISICAMENTE PELO ROLLBACK; REG-055 permanece RESOLVIDA FISICAMENTE; REG-053 permanece RESOLVIDA FISICAMENTE; REG-054 permanece com validação física PARCIAL; REG-052 permanece ABERTA.
- **Decisão C — REG-056 permanece ABERTA/PENDENTE DE NOVA TENTATIVA:** a segunda implementação que corrigia REG-056 na origem (mesmo desenho técnico da primeira tentativa, clamp sobre `textBaseBoxWidth`) foi revertida junto com o restante do código da PR #514. A causa raiz de REG-056 permanece válida e registrada; nenhuma das duas reprovações físicas (REG-057 na primeira tentativa, REG-058 nesta) refutou essa causa raiz — ambas são regressões distintas descobertas durante a validação física das tentativas de correção.
- **Decisão D — REG-058 registrada como NOVA, causa raiz explicitamente NÃO comprovada:** nenhuma hipótese (pointer capture, clamp, overlay, listener, side handle) é registrada como causa comprovada da REG-058 sem evidência de reprodução. O rollback restaura o comportamento anterior conhecido (o mesmo já validado fisicamente para REG-057), mas não investiga nem comprova a causa da REG-058.
- **Decisão E — nenhuma tentativa de correção de REG-056/REG-058 nesta PR:** por instrução explícita do escopo desta tarefa, esta PR é estritamente um rollback; nenhum diagnóstico funcional novo, nenhuma correção alternativa e nenhuma nova implementação de largura direta no Stage foram feitas.
- **Decisão F — E9G/E9G1 não apagadas do roadmap, apenas devolvidas:** a especificação/conceito de largura direta no Stage por alças laterais permanece registrada como item futuro possível em `docs/ROADMAP.md`/`docs/PRE_PROMOTION_RELEASE_PLAN.md`, agora com duas tentativas de implementação (PR #512 e PR #514) reprovadas fisicamente e revertidas. Nenhuma frente seguinte do roadmap (Layers/Profundidade, Engine Sprint) foi autorizada a avançar por causa deste rollback.
- **Alternativa rejeitada:** corrigir REG-056/REG-058 dentro da mesma PR de rollback — rejeitada explicitamente pelo escopo do ticket, que proíbe qualquer nova tentativa de correção nesta PR.
- **Alternativa rejeitada:** revert mecânico completo, incluindo documentação — rejeitada porque apagaria o fato de que a E9G1 foi publicada e reprovada fisicamente, e reabriria indevidamente REG-057 (fato físico anterior e independente), violando a regra de persistência Conversation Delta → Project OS.
- **Alternativa rejeitada:** afirmar pointer capture, clamp, overlay, listener ou side handle como causa da REG-058 sem evidência — rejeitada explicitamente pelo escopo do ticket.
- **Status:** ativa; código funcional idêntico à `v8z4b32E9F6` (byte-idêntico ao commit `2ff86e1b`); `APP_VERSION = APP_VERSION_NAME = v8z4b32E9F6`. Nenhum merge automático; nenhuma promoção autorizada; PR aberta aguardando revisão (sem merge).
- **Documento relacionado:** `docs/REGRESSIONS.md` (REG-056/REG-057/REG-058), `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`, `docs/PRE_PROMOTION_RELEASE_PLAN.md`, `docs/TEST_CASES.md` (TC-054), `docs/PRODUCT_RULES.md`, DEC-2026-08-24-01 (decisão original da E9G1, preservada abaixo como histórico, agora SUPERADA/revertida), DEC-2026-08-23-02 (primeiro rollback, E9G → E9F6).

## DEC-2026-08-24-01 — E9G1: nova tentativa de side width handles sobre a base restaurada, após validação física do rollback (HISTÓRICO — implementação SUPERADA/REVERTIDA por DEC-2026-08-24-02)

> **Nota de rollback (2026-08-24):** a implementação descrita nesta decisão (`v8z4b32E9G1`, PR #514) foi mergeada, publicada e REPROVADA FISICAMENTE por REG-058 (Stage deixa de permitir edição/interação após a largura do Text Asset chegar ao limite) e revertida por DEC-2026-08-24-02. O texto abaixo é preservado como registro histórico da decisão e do desenho técnico reaproveitado — nenhuma delas está ativa no código corrente. O desenho conceitual permanece uma possibilidade futura, agora com DUAS tentativas de implementação reprovadas fisicamente (REG-057 na primeira, REG-058 na segunda); qualquer nova tentativa futura exige investigação de causa raiz de ambas antes de reimplementar o mesmo desenho sem alteração.

- **Data:** 2026-08-24. **Versão:** `v8z4b32E9G1` (PR própria, branch `feat/v8z4b32e9g1-text-width-handles-reg056`).
- **Assunto:** nova implementação da manipulação direta de largura do Text Asset no Stage por duas side width handles, sobre a base restaurada `v8z4b32E9F6`, corrigindo REG-056 na origem, após o teste físico do rollback ter confirmado o fluxo de reedição que falhara na REG-057.
- **Classificação:** nova tentativa de função já aprovada no roadmap + correção funcional de REG-056. Risco médio/alto localizado em geometria de Text Asset, width×scale, rotação, seleção/hit-test, handles, `pendingTextDraft`, Undo/Redo, Session Autosave, Save/Load, reentrada do editor após Preview. Não é Engine Sprint, não é redesign, não é mudança de Layers/Profundidade, não é promoção.
- **Decisão A — registrar o teste físico do rollback antes de qualquer nova implementação:** Roberto testou fisicamente, na build restaurada `v8z4b32E9F6`, o fluxo Text Asset → Editar → alterar → Confirmar → Preview → sair do Preview → selecionar o mesmo Text Asset → Editar novamente, com resultado OK. Isso é registrado como REG-057 **RESOLVIDA FISICAMENTE PELO ROLLBACK/RESTAURAÇÃO DA E9F6** — não como descoberta ou correção de causa raiz. A causa da falha específica da antiga `v8z4b32E9G` permanece desconhecida (ver `docs/REGRESSIONS.md`).
- **Decisão B — reimplementar do zero sobre a base restaurada, reaproveitando o desenho de produto já aprovado:** o desenho técnico registrado em DEC-2026-08-23-01 (Decisões A–L, incluindo a correção do gatekeeper de seleção R2) permanece válido como especificação de referência — nenhuma causa nova foi encontrada que o invalidasse. A E9G1 reimplementa esse mesmo desenho (side width handles, clamp sobre `textBaseBoxWidth`, geometria no eixo local, ancoragem da lateral oposta, Auto→Fixed no primeiro delta efetivo, isolamento width≠scale, proteção do gatekeeper de seleção para `.text-width-handle`) sem alterar a lição de que a causa raiz da REG-057 original não foi comprovada — a correção do gatekeeper (R2 da E9G original) é preservada como aprendizado preventivo, não como explicação da REG-057.
- **Decisão C — não versão a partir de `v8z4b32E9G`:** a versão anterior `v8z4b32E9G` existiu, foi mergeada, publicada, reprovada fisicamente e revertida — não é reutilizada. A nova versão é `v8z4b32E9G1`.
- **Decisão D — GATE REG-057 ampliado com um terceiro ciclo específico da E9G1:** além dos dois ciclos de reedição pós-Preview herdados da REG-057 (toolbar "Editar"; duplo toque, sem side width drag), esta tentativa exige e implementa um terceiro ciclo: Editar → side width drag → Confirmar → Preview → sair do Preview → reabrir o MESMO Text Asset → side width drag novamente → Confirmar → Preview novamente — provando que a superfície de risco introduzida pela própria E9G1 (edição de largura, reflow, recomposição de centro no commit) não reintroduz a REG-057. Implementado como gate `TC-054 —` em `tests/smoke/app.spec.mjs`, tratado como BLOCKER de merge.
- **Decisão E — REG-028 especializada, não enfraquecida:** mesma decisão técnica de DEC-2026-08-23-01 (Decisão C), reimplementada: não-texto mantém exatamente quatro corner handles/zero side handles; Text Asset ganha exatamente quatro corner + duas side width handles, sistema/classe/handlers próprios; guardrail `scripts/qa/check-asset-transform-handles.mjs` com self-tests positivos e negativos versionados em `scripts/qa/run-self-tests.mjs`.
- **Alternativa rejeitada:** redesenhar a geometria/algoritmo do drag do zero, ignorando o desenho já aprovado em DEC-2026-08-23-01 — rejeitada porque nenhuma evidência aponta o desenho técnico da E9G original como causa da REG-057 (a causa raiz permanece não comprovada), e descartar um desenho já revisado tecnicamente (R1/R2) sem motivo aumentaria o risco em vez de reduzi-lo.
- **Alternativa rejeitada:** afirmar que a correção do gatekeeper de seleção (R2 da E9G original) foi a causa raiz da REG-057 — rejeitada explicitamente pelo escopo do ticket; a REG-057 não tem causa raiz comprovada, apenas um sintoma resolvido fisicamente pelo rollback.
- **Status (histórico):** implementação mergeada pela PR #514, publicada e REPROVADA FISICAMENTE por REG-058; revertida por DEC-2026-08-24-02. Nenhuma promoção foi ou é autorizada.
- **Documento relacionado:** `docs/REGRESSIONS.md` (REG-056, REG-057, REG-058, REG-028), `docs/PRODUCT_RULES.md`, `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`, `docs/PRE_PROMOTION_RELEASE_PLAN.md`, `docs/TEST_CASES.md` (TC-054), DEC-2026-08-23-01 (desenho técnico de referência, histórico), DEC-2026-08-23-02 (primeiro rollback), DEC-2026-08-24-02 (este rollback).

## DEC-2026-08-23-02 — ROLLBACK da E9G (PR #512) após REG-057; REG-056 volta a ABERTA; REG-055 preservada

- **Data:** 2026-08-23. **Versão:** `v8z4b32E9F6` restaurada (PR própria de rollback, `claude/rollback-e9g-reg-057`).
- **Assunto:** rollback funcional da PR #512 / `v8z4b32E9G` (side width handles do Text Asset) após reprovação física da build publicada em iPhone/Safari — REG-057 (reedição de Text Asset não reabre o editor após o ciclo edição → confirmação → Preview → sair do Preview).
- **Classificação:** rollback funcional urgente de regressão grave publicada + persistência documental do teste físico. Não é nova implementação, não é redesign, não é Engine Sprint, não é promoção, não é correção da causa raiz de REG-057.
- **Decisão A — reverter, não corrigir:** a causa raiz de REG-057 ainda não foi comprovada (diagnóstico físico mostra seleção canônica íntegra e consistente, mas nenhuma das rotas de reabertura do editor — `textEditorOpen`/`textEditorMode`/`textEditorTargetAssetId` — reativa). Investigar e corrigir a causa raiz dentro da mesma janela de decisão arriscaria publicar uma segunda tentativa não validada sobre uma build já reprovada fisicamente. A decisão foi reverter para a última base funcional conhecida (`v8z4b32E9F6`, merge da PR #511, commit `8ec6e45416f6ae9b1cc2f2896baa41a5ea22f591`) via `git revert -m 1` do commit de merge da PR #512 (`0e2715fafca71590a577f65c04d478f467608afe`), confirmando por diff que `index.html`, `scripts/qa/check-asset-transform-handles.mjs`, `scripts/qa/run-self-tests.mjs` e `tests/smoke/app.spec.mjs` ficaram byte-idênticos à base `8ec6e454`.
- **Decisão B — não fazer revert cego da documentação:** um revert mecânico de `docs/PROJECT_STATE.md`, `docs/REGRESSIONS.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`, `docs/PRE_PROMOTION_RELEASE_PLAN.md` e `docs/TEST_CASES.md` apagaria fatos ocorridos DEPOIS do merge da E9F6 — em especial o teste físico completo de Roberto que resolveu REG-055 ("Tudo ok" no protocolo completo), que aconteceu depois da E9F6 mergeada e é independente do código da E9G. Por isso, após o revert mecânico do código recuperar a base, a documentação foi reconstruída manualmente: REG-055 permanece **RESOLVIDA FISICAMENTE** (não volta para "validação pendente"); REG-053 permanece RESOLVIDA FISICAMENTE; REG-054 permanece com validação física PARCIAL; REG-052 permanece ABERTA.
- **Decisão C — REG-056 volta a ABERTA/PENDENTE DE NOVA TENTATIVA, não "resolvida" nem apagada:** a implementação da E9G que corrigia REG-056 na origem (clamp sobre `textBaseBoxWidth` lógico em vez de `boxWidth` físico) foi revertida junto com o restante do código da PR #512. A causa raiz de REG-056, já comprovada por auditoria de código antes da E9G, permanece registrada e válida; o desenho da E9G (side width handles) permanece como possibilidade futura aprovada, sem nenhuma nova implementação nesta PR.
- **Decisão D — REG-057 registrada com status específico, não "resolvida":** REG-057 é uma regressão física nova, cuja causa raiz ainda não foi comprovada. O rollback restaura o comportamento anterior conhecido, mas não prova nem descarta nenhuma hipótese sobre a causa de REG-057. Status registrado: REPRODUÇÃO FÍSICA CONFIRMADA NA E9G; ROLLBACK EM REVISÃO; VALIDAÇÃO FÍSICA DA BASE RESTAURADA (`v8z4b32E9F6`) PENDENTE — somente Roberto pode confirmar essa validação na build publicada após o merge deste rollback.
- **Decisão E — E9G não apagada do roadmap, apenas devolvida:** a especificação/conceito E9G (side width handles, corrigindo REG-056 na origem) permanece registrada como item futuro aprovado em `docs/ROADMAP.md`/`docs/PRE_PROMOTION_RELEASE_PLAN.md`. A IMPLEMENTAÇÃO específica da `v8z4b32E9G`/PR #512 foi reprovada fisicamente e revertida; nenhuma frente seguinte do roadmap (Layers/Profundidade, Engine Sprint) foi autorizada a avançar por causa deste rollback.
- **Alternativa rejeitada:** corrigir REG-057 dentro da mesma PR de rollback (hotfix funcional) — rejeitada explicitamente pelo escopo do ticket: a causa raiz não estava comprovada, e misturar uma tentativa de correção não validada com um rollback de urgência aumentaria o risco em vez de reduzi-lo.
- **Alternativa rejeitada:** revert mecânico completo, incluindo documentação — rejeitada porque apagaria a aprovação física de REG-055 (fato posterior à E9F6) e devolveria REG-056 para um estado incorreto (nem "aberta original" nem "corrigida"), violando a regra de persistência Conversation Delta → Project OS.
- **Status:** ativa; código funcional idêntico à `v8z4b32E9F6`; `APP_VERSION = APP_VERSION_NAME = v8z4b32E9F6`; validação física da build restaurada pendente (Roberto, iPhone/Safari, com ênfase na reedição repetida do mesmo Text Asset após Preview). Nenhum merge automático; nenhuma promoção autorizada.
- **Documento relacionado:** `docs/REGRESSIONS.md` (REG-055/REG-056/REG-057), `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`, `docs/PRE_PROMOTION_RELEASE_PLAN.md`, `docs/TEST_CASES.md` (TC-054), DEC-2026-08-23-01 (decisão original da E9G, preservada abaixo como histórico, agora SUPERADA/revertida).

## DEC-2026-08-23-01 — E9G: side width handles substituem o slider de largura; revisão deliberada de REG-028 (HISTÓRICO — implementação SUPERADA/REVERTIDA por DEC-2026-08-23-02)

> **Nota de rollback (2026-08-23):** a implementação descrita nesta decisão (`v8z4b32E9G`, PR #512) foi REPROVADA FISICAMENTE por REG-057 e revertida por DEC-2026-08-23-02. O texto abaixo é preservado como registro histórico do desenho de produto e das decisões técnicas de revisão (Decisões A–L) — nenhuma delas está ativa no código corrente. O desenho conceitual permanece uma possibilidade futura aprovada (ver `docs/ROADMAP.md`), mas requer nova implementação e nova validação física completa, incluindo a sequência de reedição pós-Preview descoberta pela REG-057.

- **Data:** 2026-08-23. **Versão:** `v8z4b32E9G` (PR própria).
- **Assunto:** manipulação direta da largura da caixa de Text Asset no Stage por duas alças laterais específicas, substituindo a edição MANUAL de largura pelo slider existente no painel; correção de REG-056 (largura manual dependente da escala visual).
- **Classificação:** nova função já aprovada no roadmap (`docs/PRE_PROMOTION_RELEASE_PLAN.md`/`docs/ROADMAP.md`) + correção funcional REG-056. Risco médio/alto localizado em geometria de Text Asset, seleção, handles, scale×width, rotação, Undo/Redo, draft de texto, Save/Load, Stage/Preview/Export. Não é Engine Sprint.
- **Decisão A — não corrigir o slider transitório; substituir pela E9G:** a REG-056 não foi corrigida no slider absoluto do painel (que clampava `boxWidth` já escalado contra um limite físico fixo). O slider foi **removido** e a edição de largura passou a ser feita diretamente no Stage, por duas alças laterais exclusivas do Text Asset, que operam sobre a largura LÓGICA (`textBaseBoxWidth`, scale-invariante), eliminando a causa raiz da REG-056 na origem em vez de mascará-la.
- **Decisão B — separação estrita entre CORNER (escala) e SIDE (largura):** as quatro corner handles permanecem INALTERADAS e continuam fazendo escala proporcional (`boxWidth`/`fontSize` em relação a `textBaseBoxWidth`/`textBaseFontSize`). As duas novas side width handles alteram somente a largura lógica da caixa e o reflow decorrente — nunca `fontSize`, `textBaseFontSize`, percentual de escala, rotation, depth, zIndex, texto, cor, fundo, opacidade, padding ou timing. As duas operações nunca alteram uma à outra.
- **Decisão C — revisão deliberada de REG-028 (invariante de quatro handles), especializada e não enfraquecida:** REG-028 existe porque uma implementação histórica tentou "unificar" transformações adicionando alças puramente visuais enquanto o sistema antigo continuava coexistindo. A E9G é uma exceção DELIBERADA e ESPECÍFICA para Text Asset: todo Asset não-texto continua com exatamente quatro corner handles e zero side width handles; Text Asset ganha exatamente quatro corner handles + duas side width handles (seis alças totais), em sistema/classe/handlers próprios (`.text-width-handle`/`data-asset-width-handle`), nunca reaproveitando `.asset-corner-handle` nem os handlers de escala/rotação. O guardrail `scripts/qa/check-asset-transform-handles.mjs` foi especializado (não simplesmente trocou "4" por "6") com self-tests próprios positivos e negativos, wired em `scripts/qa/run-self-tests.mjs` via fixtures derivadas do `index.html` real por corrupção cirúrgica de um trecho guardado por vez.
- **Decisão D — invariante central width≠scale, com limite lógico (REG-056):** no início do gesto, captura-se a escala corrente (`boxWidth/textBaseBoxWidth`); durante todo o drag, `textBaseBoxWidth` é recalculado para que essa razão permaneça constante, e o clamp de bounds (`getTextWidthLogicalBounds()`, `[40, baseStageW do projeto]`) opera sobre `textBaseBoxWidth` (largura lógica, scale-invariante por definição), não sobre `boxWidth` (largura física já escalada) — garantindo a mesma faixa lógica disponível em qualquer escala do Text Asset.
- **Decisão E — geometria do drag no eixo local, com ancoragem da lateral oposta:** o deslocamento do pointer é projetado no eixo horizontal LOCAL do Text Asset (considerando `rotation`), reutilizando as transformações canônicas Stage↔World existentes — nunca delta X bruto de tela nem sistema de coordenadas paralelo. Arrastar a alça direita ancora a lateral esquerda no World (e vice-versa); o centro se desloca apenas o necessário; a coordenada vertical local do centro permanece estável mesmo quando o reflow muda `worldH`.
- **Decisão F — commit do draft usa o centro do PRÓPRIO draft, não um recentro fixo pré-edição:** `confirmTextCreation()` (modo `edit`) recompunha o centro final do asset confirmado a partir do centro do TARGET antes de qualquer edição (`oldCenterX/oldCenterY`), descartando qualquer posição estabelecida durante a sessão de draft. Isso é inofensivo para edições que preservam centro (Fonte/Cor/Estilo/Alinhamento/Fundo, cobertas por `measureTextEditorDraft({preserveCenter:true})` em modo edição), mas quebraria a ancoragem intencional de um width drag dentro do editor (o commit "saltaria" de volta ao centro pré-edição). A origem do recentro passou a ser o centro do PRÓPRIO `pendingTextDraft` no momento do commit — numericamente idêntico ao comportamento anterior para toda edição que preserva centro, e correto (preserva a âncora) para width drag.
- **Alternativa rejeitada:** manter o slider e apenas corrigir o clamp para operar sobre a largura lógica — rejeitada porque o ticket exige a substituição definitiva por manipulação direta no Stage (a E9G já era a solução aprovada no roadmap antes mesmo da REG-056 ser relatada), e porque manter as duas formas de edição manual coexistindo (Stage + slider) violaria a prevenção de REG-028.
- **Alternativa rejeitada:** side width handles decorativas/apenas visuais sem interação real — rejeitada explicitamente pelo escopo do ticket e pela lição histórica de REG-028.
- **Adendo — revisão técnica R1 (mesma PR #512, mesma versão `v8z4b32E9G`, sem bump; HEAD que originou a revisão `ed384f0`):** três correções obrigatórias apontadas antes do merge, sem tocar o desenho de produto acima (Decisões A–F preservadas integralmente).
  - **Decisão G — bug de escopo JS no gate E9C:** o gate referenciava uma `const` do contexto Node/Playwright (`fixedDraftWidth`) diretamente dentro do corpo de um `page.evaluate()`, que executa isolado no browser — `ReferenceError` real, não falha do produto. Corrigido lendo o valor via `page.evaluate()` e comparando no lado Node.
  - **Decisão H — setup do gate central sem folga real de largura:** a prova de que a side handle altera `boxWidth` criava o Text Asset em Auto, cuja largura natural pode nascer perto do limite lógico MÁXIMO dependendo da fixture — um drag de aumento ali seria um clamp legítimo (no-op), não uma falha da side handle. Corrigido preparando o Text Asset em Fixed com `textBaseBoxWidth` no MEIO da faixa lógica antes das provas que exigem delta real, e adicionada uma prova SEPARADA e explícita de clamp/no-op nos limites máximo e mínimo (geometria intacta, zero Undo, zero autosave), distinguindo corretamente gesto válido de gesto absorvido pelo limite.
  - **Decisão I — NO-OP marcava dirty/autosave (`index.html`):** `endTextWidthPointer()` calculava `changed` corretamente para decidir o Undo, mas chamava `markProjectDirty`/`renderLayersPanelList` FORA do bloco `if (changed)` — um `pointermove` absorvido pelo clamp podia marcar o projeto dirty e agendar autosave sem qualquer alteração real. Corrigido movendo ambas as chamadas para dentro do `if (changed)`; `ds.moved` (auditado) continua significando apenas "houve pointermove válido", nunca tratado como sinônimo de alteração persistente — `changed` permanece a única fonte de verdade de "mudou".
  - **Consequência documental:** como o WebKit Smoke Tests do HEAD `ed384f0` falhou (Blocker 1) e o Blocker 3 era um bug real de produto (dirty/autosave espúrio), a redação "implementada e automatizada" foi temperada para "implementação em revisão" em `docs/REGRESSIONS.md`/`docs/PROJECT_STATE.md` até a confirmação de um HEAD com WebKit verde no CI — esta sessão não tem acesso de rede para executar Playwright localmente (mesma limitação já registrada).
- **Adendo — revisão técnica R2 (mesma PR #512, mesma versão `v8z4b32E9G`, sem bump; HEAD que originou a revisão `b7fab59`):** o CI real do HEAD `b7fab59` (R1 empurrada) retornou QA Guardrails PASS, Real Export PASS e **WebKit 29/30**, com falha isolada no gate E9G na sequência "corner drag → Undo → side width drag" (`boxWidth` não mudava). O ticket de revisão hipotetizou resíduo de `assetTransformDragState`, com instrução explícita de medir antes de corrigir.
  - **Decisão J — instrumentar antes de corrigir:** em vez de aplicar a correção hipotetizada às cegas, um commit exclusivamente diagnóstico (`93429ec`) adicionou snapshots de estado real (via `resolveActiveTextAssetForWidthDrag()`, a própria fonte de verdade do produto) em cada checkpoint do gesto no helper de teste, e o log real do WebKit CI foi lido via `mcp__github__get_job_logs` antes de qualquer alteração de produto.
  - **Decisão K — causa real localizada por evidência, hipótese original refutada:** o log mostrou `assetTransformDragStateActive:false` em todos os checkpoints (refutando a hipótese do ticket) e `selectedAssetId` mudando para `"img-1"` já no `afterDown`, com `textWidthGestureActive:false` do início ao fim — `beginTextWidthDrag()` nunca executava. A causa raiz real: `imageArea.addEventListener('pointerdown', handleStageAssetSelectPointer, true)` é um gatekeeper de CAPTURA que roda antes do listener de alvo da própria alça, faz hit-test por coordenadas e reseleciona o asset por baixo com `stopImmediatePropagation()`; a exceção `e.target.closest('.asset-corner-handle')` nunca foi estendida para `.text-width-handle` (que fica 12px fora da caixa de texto, sobre a imagem subjacente nesta fixture), então o pointerdown na side handle era sequestrado antes do gesto começar.
  - **Decisão L — correção mínima, mesma forma da exceção já existente:** `e.target.closest('.asset-corner-handle')` → `e.target.closest('.asset-corner-handle,.text-width-handle')`, sem introduzir sistema paralelo nem alterar `beginTextWidthDrag`/`handleTextWidthPointerMove`/`endTextWidthPointer`. Guardrail (`scripts/qa/check-asset-transform-handles.mjs`) e self-test negativo (`scripts/qa/run-self-tests.mjs`) adicionados para travar as duas exceções juntas nesse gatekeeper.
- **Status:** **SUPERADA/REVERTIDA (2026-08-23) por DEC-2026-08-23-02.** A build publicada da `v8z4b32E9G` foi REPROVADA FISICAMENTE por Roberto (REG-057: reedição de Text Asset não reabre o editor após Preview). A implementação completa desta decisão (código, guardrails e testes) foi revertida por rollback; o desenho de produto permanece registrado apenas como registro de consulta e possibilidade futura, sem autorização de nova implementação nesta PR de rollback. Nenhuma promoção autorizada.
- **Documento relacionado:** `docs/REGRESSIONS.md` (REG-056, REG-057), `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`, `docs/PRE_PROMOTION_RELEASE_PLAN.md`, DEC-2026-08-23-02 (decisão de rollback).

## DEC-2026-08-22-01 — REG-055 (E9F6): "aplicar cor" ≠ "salvar cor pessoal"; recovery da v1 contaminada

- **Data:** 2026-08-22. **Versão:** `v8z4b32E9F6` (PR própria).
- **Assunto:** nova tentativa de correção da REG-055 (picker de cor do Arco) após DUAS reprovações físicas anteriores.
- **Classificação:** correção funcional/UX de regressão. Sem Engine/curvas/timing/Preview/Export; sem produção.
- **Contexto — por que a E9F5 foi rejeitada:** a E9F5 (PR #509) restaurou o picker nativo com um `input[type=color]` real e estável como touch target (via `.color-trigger-wrap`) — essa parte funcionou fisicamente. Porém os três `onchange` do picker chamavam `addCustomColorToPalette` diretamente, tratando `'change'` como "usuário confirmou uma cor pessoal". No picker nativo do WebKit/iOS, um único gesto contínuo em roda/espectro/sliders dispara MÚLTIPLOS eventos `input`/`change` — cada um virava um swatch persistido (runaway palette), o painel de Fundo do projeto (`flex-wrap`, sem altura máxima) crescia sem limite até ficar inutilizável, e a contaminação sobrevivia a reiniciar o app via `localStorage['arco_user_custom_colors_v1']`. Revertida pela PR #510.
- **Decisão A — separação de operações:** "aplicar cor" (preview/uso corrente do picker nativo) e "salvar cor pessoal" (`addCustomColorToPalette`) passam a ser operações estruturalmente distintas. Nenhum evento `input`/`change` do picker nativo dos três contextos (Fundo do projeto, Cor do texto, Fundo da caixa) chama `addCustomColorToPalette`, independentemente de quantos eventos o WebKit dispare por gesto. O ÚNICO ponto de entrada na paleta pessoal é o commit do campo HEX inline (Enter/blur com `#RRGGBB` válido, com/sem "#"), exatamente 1 cor por commit, com deduplicação.
- **Decisão B — ativação Safari-safe preservada seletivamente:** reaproveitada da #509-R2 apenas a primitiva `.color-trigger-wrap` (input nativo real, estático, nunca `.click()` em input off-screen) para os "+" de Cor do texto/Fundo da caixa; **não** reaproveitada a assunção `'change' == salvar cor` nem a persistência automática do picker. Fundo do projeto já tinha um `input[type=color]` real e visível — preservado sem alteração estrutural, só a separação de origem (`commitBgColorEdit(hex, source)`, `source==='hex'` salva, `source==='picker'` não salva).
- **Decisão C — recovery da v1 contaminada:** não existe forma confiável de distinguir, dentro de `arco_user_custom_colors_v1`, um swatch intencional de um valor intermediário de arraste (o bug físico não deixou marcador de origem) — por isso TODO o conteúdo de v1 é tratado como contaminado e NUNCA migrado/importado. A chave é removida defensivamente na inicialização (mesmo corrompida, vazia, com centenas de entradas, ou com `localStorage` bloqueado — falha de storage nunca impede o app de abrir). Chave nova: `arco_user_custom_colors_v2`.
- **Decisão D — contenção estrutural do painel:** `#bgSwatches` (única superfície das três que cresce verticalmente, via `flex-wrap`) ganha altura máxima (`min(30vh,200px)`) + rolagem interna própria, preservando o layout visual/grid dos swatches; alça/título/HEX/rodapé do painel permanecem sempre alcançáveis. Sem limite arbitrário de quantidade de cores pessoais. As linhas de Cor do texto/Fundo da caixa (`.text-swatch-row`) já rolam horizontalmente e por isso não precisaram de mudança estrutural adicional.
- **Alternativa rejeitada:** manter `'change'` como gatilho de salvamento e apenas reduzir a frequência de disparo (debounce) — rejeitada por não eliminar a causa raiz (o número de eventos do picker nativo do WebKit não é controlável pelo Arco) e por ainda arriscar persistir um valor intermediário caso o usuário solte o dedo num ponto do gesto que dispare `change`.
- **Alternativa rejeitada:** limitar a quantidade máxima de swatches como forma de conter o crescimento do painel — rejeitada explicitamente pelo escopo do ticket (mascararia o sintoma B sem resolver a causa A, e o ticket proíbe limite arbitrário de quantidade nesta PR).
- **Adendo — revisão técnica R1 (mesma PR #511, mesma versão `v8z4b32E9F6`, sem bump; HEAD que originou a revisão `494794f`):** três correções obrigatórias apontadas antes do merge.
  - **Decisão E — arquitetura visual unificada do "+":** a versão original desta decisão (Decisão B) deixava o Fundo do projeto como exceção visual — um quadrado/input de "Personalizar" ao lado de um label de texto, fora da linha de swatches, enquanto Cor do texto/Fundo da caixa já usavam `.color-trigger-wrap` como último filho estático da linha. Corrigido: os TRÊS contextos passam a compartilhar a MESMA arquitetura `[presets] [cores pessoais] [+]` seguida de `[HEX inline]`; `#bgColorTriggerWrap`/`#bgHexInput` tornam-se o último filho estático de `#bgSwatches`, e `renderProjectBgSwatches()` passa a usar `insertAdjacentHTML('beforebegin', …)` relativo ao wrapper em vez de reescrever `innerHTML` por inteiro (mesmo padrão de Cor do texto/Fundo da caixa). Nenhuma remoção do `input[type=color]` nativo; nenhum painel intermediário criado; REG-055A (picker nunca salva) permanece intocada.
  - **Decisão F — consistência HEX/Enter:** a documentação prometia commit por "Enter/blur/change" sem que Enter comitasse explicitamente (dependia de `change` dos navegadores disparar sozinho ao apertar Enter num input de texto — comportamento não garantido cross-browser). Os três campos HEX ganham `onkeydown` dedicado que comita explicitamente no Enter (mesma rota de commit já usada por `change`), com `preventDefault` contra submit implícito; deduplicação existente evita duplicar num `blur`/`change` subsequente com o mesmo valor.
  - **Decisão G — correção documental factual:** REG-053/054/055 tinham sido incorretamente agrupadas sob o mesmo status ("validação física pendente") em `docs/REGRESSIONS.md`/`docs/ROADMAP.md`. Corrigido para três status distintos e factualmente corretos: REG-053 **RESOLVIDA FISICAMENTE** na `v8z4b32E9F3` (Roberto testou a build publicada em iPhone/Safari e aprovou visualmente — fato que não estava registrado em `docs/PROJECT_STATE.md` além do merge da PR #506); REG-054 correção implementada com validação física **PARCIAL** (não "pendente" genérico, não "totalmente validada"); REG-055 correção implementada com validação física **pós-merge PENDENTE** (nem iniciada).
  - **Consequência de geometria não-regressiva:** com o input nativo do Fundo do projeto agora dentro da linha rolável `#bgSwatches`, o gate de overflow (100+ cores) deixou de exigir esse input sempre visível SEM rolar — passou a exigir "alcançável pela mesma rolagem que alcança o último swatch pessoal", condição estruturalmente equivalente e já coberta pelo mesmo princípio de contenção (Decisão D).
- **Status:** ativa; implementada e automatizada (três gates `REG-055 —` após a R1). **Validação física concluída**: Roberto testou a build publicada da `v8z4b32E9F6` em iPhone/Safari e reportou "Tudo ok" para o protocolo físico completo (fato posterior ao merge desta PR, registrado em `docs/PROJECT_STATE.md` e preservado pelo rollback da E9G — ver DEC-2026-08-23-02). REG-055 está RESOLVIDA FISICAMENTE. Nenhuma promoção autorizada; nenhum merge automático.
- **Documento relacionado:** `docs/REGRESSIONS.md` (REG-055/REG-053/REG-054), `docs/PRODUCT_RULES.md` (regra canônica), `docs/TEST_CASES.md`, `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`.

## DEC-2026-08-20-01 — REG-054: semântica única de alvos dos controles normais de transformação de Frame

- **Data:** 2026-08-20. **Versão:** `v8z4b32E9F2` (PR própria).
- **Assunto:** resolução de alvos (Posição/Escala/Rotação) dos controles PÚBLICOS do menu contextual de Frame (custBar) quando há multi-seleção.
- **Classificação:** correção funcional de regressão (REG-054). Sem Engine/curvas/timing; sem Preview/Export; sem layout/CSS; sem produção.
- **Decisão:** os seis controles normais do custBar (`nudgePos`, `setPosFromInput`, `input` do `scaleSlider`, `nudgeScale`, `input` do `rotSlider`, `nudgeRotation`) passam a resolver o conjunto-alvo por uma função única `getNormalTransformTargets()` com **precedência inequívoca**: (1) **Global ligado** (`isCustLocked`) → todos os Frames elegíveis; (2) **multi-seleção ativa** → exatamente os Frames de `selectedFrames`; (3) caso contrário → apenas o **Frame ativo**. Frames travados nunca entram no conjunto. O **mesmo delta** já usado pelo modo Global é aplicado aos alvos, preservando distâncias relativas (Posição), proporção/centro individual e escala relativa (Escala) e rotações independentes (Rotação). "Reset" de rotação zera todos os selecionados na multi-seleção e preserva a regra existente (só o ativo) em Global/seleção simples.
- **Razão:** o defeito estava na resolução `Global ? todos : activeIdx` dessas rotas, que ignorava a seleção múltipla; a correção é **na origem** da resolução de targets, sem criar um sistema de batch paralelo (a infraestrutura alignBar/`getContextSelectionTargets`/`batchTransformEditSession` já era correta e permanece intacta). Global continua sendo modo distinto e não é requisito da multi-seleção.
- **Alternativa rejeitada:** copiar valores para os demais Frames após o gesto (hack pós-gesto) — rejeitada por não corrigir a causa e violar a preservação de proporções/rotações independentes e do Undo consolidado.
- **Status:** ativa; implementada e automatizada (gate `REG-054`), **validação física pendente** (iPhone/Safari, Roberto). Nenhuma promoção autorizada.
- **Documento relacionado:** `docs/REGRESSIONS.md` (REG-054), `docs/TEST_CASES.md` (TC-051), `docs/PROJECT_STATE.md`.

## DEC-2026-08-19-02 — OPS-06: Conversation Delta → Project OS, auditoria de handoff e sincronização documental

- **Data:** 2026-08-19.
- **Assunto:** governança operacional do Project OS — impedir perda de pendências entre chats e sincronizar formulações documentais divergentes.
- **Classificação:** documental / processo. **Sem** mudança funcional do Arco Motion, sem UI/renderer/Preview/Export/`index.html`, sem alteração de `APP_VERSION`/`APP_VERSION_NAME` e sem promoção.
- **Decisão A — Conversation Delta → Project OS:** formalizada em `AGENTS.md` a regra “nenhuma pendência relevante pode existir somente no chat”. Toda informação relevante assumida numa conversa (bug, regressão, comportamento incorreto sem causa, item deixado para depois, nova pendência, decisão de produto/UX, alternativa rejeitada, aprovação/reprovação física, item/pesquisa futuros, mudança de prioridade, incompatibilidade documental, decisão de não implementar, risco a retomar) deve ser persistida no Project OS assim que vira decisão/pendência, sem depender do encerramento do chat.
- **Decisão B — Auditoria de handoff obrigatória:** antes de um handoff, o agente compara o delta da conversa com o Project OS; o handoff registra os 11 itens definidos em `AGENTS.md` e **não substitui** o Project OS. Item relevante apenas no chat deve ser registrado antes de encerrar; quando não for possível, marcar “PENDENTE DE REGISTRO NO PROJECT OS” como bloqueador da próxima etapa. Reflexos em `docs/APPROVAL_WORKFLOW.md` (checkpoint das descobertas do teste físico/revisão), `docs/DEFINITION_OF_DONE.md` (sessão não encerrada até persistência) e `docs/DOCUMENTATION_MAINTENANCE.md` (seção “Conversation Delta / Handoff” com o mapa de destino). `CLAUDE.md` apenas confirma que segue a regra de `AGENTS.md`, sem duplicar a política.
- **Decisão C — Três regressões abertas registradas:** REG-052 (fill dos sliders não corresponde ao thumb, especialmente em Ativos), REG-053 (painel de transformação cortado em multi-seleção de Frames, iPhone/Safari) e REG-054 (transformação de multi-seleção afeta apenas um Frame, exceto com Global). Registradas individualmente em `docs/REGRESSIONS.md` como **ABERTAS**, causa a investigar, sem solução declarada e sem implementação; referência de estado em `docs/PROJECT_STATE.md` e nota de ordem em `docs/ROADMAP.md` (Roberto decide a ordem efetiva).
- **Decisão D — Sincronização documental (sem alterar produto):** Layers e Profundidade/parallax básico são descritos como **sistemas já existentes**; a próxima frente é **readequação da interface de Layers existente + revisão visual do controle de Profundidade existente** (`docs/PRE_PROMOTION_RELEASE_PLAN.md`). A formulação histórica “painel de Layers permanente na lateral/sobre o Stage” em `docs/PRODUCT_ROADMAP.md` é marcada como **SUPERADA** pela decisão mais recente (affordance compacto + sheet parcial de baixo, Stage visível), preservando rastreabilidade. O fill de Profundidade passa a ser descrito com o coral vigente de Ativos `#FF6B8A`, sem reintroduzir o roxo antigo.
- **Razão:** eliminar a dependência de memória de chat para decisões, bugs, regressões, pendências, aprovações e itens adiados, e impedir que agentes reconstruam funções já existentes por redação ambígua.
- **Status:** ativa; registrada em PR documental própria (OPS-06). Nenhum merge automático e nenhuma promoção autorizada.
- **Documento relacionado:** `AGENTS.md`, `CLAUDE.md`, `docs/APPROVAL_WORKFLOW.md`, `docs/DEFINITION_OF_DONE.md`, `docs/DOCUMENTATION_MAINTENANCE.md`, `docs/REGRESSIONS.md`, `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`, `docs/PRE_PROMOTION_RELEASE_PLAN.md`, `docs/PRODUCT_ROADMAP.md`.

## DEC-2026-08-19-01 — OPS-05: WebKit/Linux bounded e Watchdog resiliente (healthy/stale/terminal + aplicabilidade)

- **Data:** 2026-08-19.
- **Assunto:** resiliência operacional de CI para o gate funcional WebKit/Linux e para o Mobile CI Watchdog. Exclusivamente CI/QA/infraestrutura; sem alteração funcional do Arco Motion, sem UI, renderer, Preview/Export, `index.html`, `APP_VERSION` ou `APP_VERSION_NAME`.
- **Classificação:** infraestrutura crítica de CI/CD; sem bump de versão e sem promoção.
- **Contexto:** em execução recente do `Browser Smoke Tests`, o job `WebKit Smoke Tests` (Ubuntu) ficou preso em `npx playwright install --with-deps webkit` sem alcançar a suíte funcional, enquanto o `Real Export Smoke (WebKit macOS)` concluiu normalmente. Diagnóstico: incidente de infraestrutura/instalação do Playwright WebKit no runner Linux, não regressão de produto.
- **Decisão A — timeout WebKit/Linux:** `smoke-tests.yml` ganha `timeout-minutes: 25` no job WebKit e `timeout 12m` (coreutils, portátil em ubuntu-24.04) no passo de instalação. Estouro encerra com exit code real (124), nunca convertendo erro em PASS; sem loop.
- **Decisão B — Browser Smoke só quando runtime:** `paths-ignore` conservador (`docs/**`, `.agents/**`, `.claude/**`, `**/*.md`, `*.md`); o GitHub só pula quando TODOS os paths casam. Qualquer arquivo runtime/teste/workflow/package/desconhecido mantém a suíte. `qa-guardrails.yml` não recebe `paths-ignore`: QA continua obrigatório.
- **Decisão C — aplicabilidade no Watchdog:** `mobile-ci-watchdog.mjs` obtém a lista real de arquivos alterados por PR (GitHub API, paginada, read-only, `GITHUB_TOKEN` do workflow) e aplica `isWebKitSuiteApplicable()`. PR non-runtime-only → WebKit NOT APPLICABLE (skip explícito, sem check artificial, sem Playwright). Lista indisponível → aplicável por segurança.
- **Decisão D — estados distintos e paridade:** o planejamento diferencia `success`, `terminal-failure`, `active-fresh`, `active-stale`, `missing` e `not-applicable` (precedência `success` > `active-fresh` > `terminal-failure` > `active-stale` > `missing`). `in_progress` deixa de ser saudável para sempre: `STALE_ACTIVE_MS = 60 min` (>2x o cap de 25 min do job) libera recuperação de runs velhos; timestamp ausente é conservador (`active-fresh`, sem inventar stale); `now` é injetável para testes determinísticos. Falha terminal não vira `missing` nem gera loop automático. O watchdog roda o gate canônico `npx playwright test --project=webkit-mobile-smoke --workers=1 --retries=0`, com instalação `timeout 12m` e job `timeout-minutes: 25`.
- **Política de SHA preservada:** HEAD SHA corrente é a unidade de validação; evidência de SHA anterior não libera SHA novo; mudança de SHA reabre as suítes aplicáveis; `buildFinalCheckRunUpdate()` mantém `neutral` na troca de SHA, sem aprovação simulada. `smoke-tests.yml` recebe `concurrency` por PR com `cancel-in-progress: true` (novo commit supersede o run por-SHA anterior e libera runner de instalação travada); watchdog mantém `cancel-in-progress: false`.
- **Permissões:** inalteradas — `contents: read`, `pull-requests: read`, `actions: read`, `checks: write` só onde já necessário; sem token pessoal e sem secret novo.
- **Consequência:** self-tests em `scripts/ci/test-mobile-ci-watchdog.mjs` cobrem os 16 casos (sem checks, documental, Skill/agente, index.html, teste, package, workflow, arquivo desconhecido, lista indisponível, success, falha terminal, in_progress recente, in_progress stale, troca de SHA, timestamp ausente, draft/fork) com fronteira temporal determinística.
- **Status:** implementado em PR operacional própria a partir da `main` pós-#502; validação real produzida na própria PR; nenhum merge e nenhuma promoção autorizada.
- **Documento relacionado:** `docs/QA_STRATEGY.md`, `docs/PROJECT_STATE.md`, `.github/workflows/smoke-tests.yml`, `.github/workflows/mobile-ci-watchdog.yml`, `scripts/ci/mobile-ci-watchdog.mjs`, `scripts/ci/test-mobile-ci-watchdog.mjs`.

## 2026-08-18 — DEC-Text-E9F1: refino visual/funcional localizado do editor de Texto após teste físico da E9F

- **Data:** 2026-08-18.
- **Assunto:** correção visual/funcional LOCALIZADA do Text Asset Editor, decorrente do teste físico da E9F publicada em iPhone/Safari, sobre a base E9F (PR #499).
- **Classificação:** correção visual/funcional localizada; risco médio. NÃO altera a geometria canônica do Text Asset, o renderer, Preview/Export, persistência, Frames, curvas, ProjectWorld nem as quatro alças.
- **Fato histórico registrado:** a v8z4b32E9F foi mergeada pela **PR #499** (merge commit real observado no git: `82131049e52974a1922206c92bf573b9d2c78ff5`) e testada fisicamente por Roberto em iPhone/Safari; a estrutura geral foi aprovada e a maioria das funções operou, mas a E9F **não** foi aprovada como encerrada. **Incompatibilidade registrada (AGENTS.md):** a instrução da tarefa citou o merge commit `7e3978208976281dfe57d9832e5cb3b9626ecda2`, inexistente neste repositório; adotou-se a fonte oficial (git) `82131049…` como base após reavaliação.
- **Decisão:** implementar exclusivamente (A) cabeçalho compacto preservando × e ✓; (B) ícone de Estilo B+I; (C) ícone de Alinhamento dinâmico refletindo `textAlign`; (D/E) paleta rápida de Cor do texto reutilizando a constante única `PROJECT_BG_NEUTRALS` + botão `+`; (F/G/H) Fundo com ícone de preenchimento, estado padrão "Sem cor/Transparente" sem slider, escolher cor liga o fundo e revela o alfa (que afeta só `boxBackgroundOpacity`); (J) localização do VIEWPORT ao editar existente por pan canônico, sem tocar geometria/Frames/ProjectWorld/Undo/autosave; (L/M/N) Largura = Auto compacto + slider (step 5), slider entra em fixed no mesmo gesto e Auto restaura auto.
- **Razão:** aplicar os apontamentos do teste físico de Roberto sem redesenhar o editor aprovado; separar semanticamente cor/fundo, comunicar melhor Estilo/Fundo, tornar a largura mais compacta e manter o texto visível durante a edição.
- **Restrições respeitadas:** `DEFAULT_PROJECT_BG` intacto; o menu de Fundo do PROJETO não foi redesenhado (apenas passou a consumir a constante única, eliminando duplicação de listas); E9G não antecipada (quatro alças); nenhum schema persistente novo de histórico de cores; sem biblioteca de ícones (SVGs novos no mesmo sistema). Criação de novo texto (E9E) inalterada.
- **Consequência:** novo gate `E9F1 —` (Testes 1–11) em `tests/smoke/app.spec.mjs`; gates E8Z/E9C/E9D/E9E/E9F adaptados à nova UI sem enfraquecer asserções; `getTextEditorE9F1Diagnostics()` adicionado; `APP_VERSION === APP_VERSION_NAME === v8z4b32E9F1`.
- **Status (atualizado 2026-08-19):** **mergeada pela PR #500** (merge commit `6739dbc018f335ad6b1faead6de4f4469e5ebf78`); build **publicada** no repositório de teste; **testada e aprovada fisicamente por Roberto em iPhone/Safari em 2026-08-19** nos itens do seu escopo (export real via WebCodecs, sem fallback, 720×1280; paridades de editor/box/asset e Session Restore; quatro alças; sem salto em Preview/Export). Rodada corretiva E9F1 encerrada. **Nenhuma promoção autorizada.** (Registro histórico da implementação: execução local em WebKit foi bloqueada — verificação equivalente em Chromium `hasTouch`: E9F1/E8Z/E9C/E9D/E9E/E9F passavam; E9B e o 404 do smoke inicial eram limitações do ambiente Chromium, idênticas na base.)
- **Documento relacionado:** `docs/PRODUCT_RULES.md` (Regra E9F1), `docs/REGRESSIONS.md` (REG-051), `docs/TEST_CASES.md` (TC-050), `docs/PROJECT_STATE.md`, `docs/PRE_PROMOTION_RELEASE_PLAN.md`, `docs/ROADMAP.md`, `docs/PRODUCT_ROADMAP.md`.

## 2026-08-18 — DEC-Text-E9F: editor de Text Asset iconográfico neutro + paleta de UI aprovada

- **Data:** 2026-08-18.
- **Assunto:** revisão visual e de interação localizada no editor de Text Asset (rail iconográfica neutra) + adoção da paleta de UI aprovada e do coral de Ativos, sobre a base funcional aprovada E9E.
- **Classificação:** revisão visual/interação localizada; risco médio (apresentação e navegação do editor). NÃO altera modelo canônico do Text Asset, geometria, renderer, Preview/Export, persistência, Stage↔World nem as quatro alças.
- **Fato histórico registrado:** a v8z4b32E9E foi mergeada pela PR #498 (merge commit `4254ed370ecee64b7f98d411fe6994b8c4538ba5`) e testada fisicamente por Roberto em iPhone/Safari na build publicada, aprovada visual/funcionalmente nos itens do seu escopo em 2026-08-18.
- **Decisão:** (1) substituir as tabs textuais `Texto | Fonte | Cor | Estilo` por uma **rail horizontal iconográfica** de sete propriedades (texto, fonte, estilo, alinhamento, cor do texto, fundo da caixa, largura da caixa), sem label textual visível, com `aria-label` e semântica `tablist/tab` preservada; item ativo com **contraste neutro invertido (branco + símbolo escuro)**, nunca coral/ciano/verde. (2) Alinhamento vira controle iconográfico próprio; cor do texto e fundo da caixa ficam separados, com a opacidade dentro do painel de Fundo; largura Auto/Fixa + stepper mantidos (E9C intacta). (3) Minimizar por **gesto vertical da alça** (mesma semântica `minimizeTextEditor`), independente do swipe horizontal da rail e do slider; × cancela, ✓ confirma. (4) Adotar a paleta de UI aprovada nos tokens neutros (chrome `#24262B`, sheet `#303238`, controles `#393C43`, divisor `~#4A4D55`) e migrar a identidade **Ativos de roxo para coral `#FF6B8A`** (token `--accent` + contorno/alças/pill/botão +), preservando o **ciano `#04fff2` de Frames**.
- **Razão:** referência de produto aprovada por Roberto no teste; simplifica a navegação, separa semanticamente cor do texto e fundo, e mantém o Stage o mais visível possível.
- **Restrições respeitadas:** `DEFAULT_PROJECT_BG` (`#3c3c3b`) e o background que entra em Preview/Export NÃO foram alterados; nenhum outro painel (Settings, Frames, demais Ativos) foi redesenhado (migração global fica futura); E9G não foi antecipada (exatamente quatro alças); sem biblioteca externa de ícones (SVG novos no mesmo sistema Lucide já usado).
- **Consequência:** novo gate E9F em `tests/smoke/app.spec.mjs` (rail, estado ativo neutro, superfícies, coral/ciano, navegação por propriedade, alinhamento iconográfico, fundo com opacidade isolada, largura Auto/Fixa, minimizar por gesto, independência swipe×drag, cancelar/confirmar, quatro alças). Gates E8Z/E9A/E9C/E9D/E9E adaptados apenas na navegação (tabs → ícones), sem enfraquecer asserções. `APP_VERSION === APP_VERSION_NAME === v8z4b32E9F`.
- **Status:** implementado em PR no repositório de teste; execução local em WebKit bloqueada (verificação equivalente em Chromium `hasTouch`; E9B depende de gesto multi-touch que não reproduz em Chromium e falha igual na base — validar no WebKit CI); validação visual final em iPhone/Safari real pendente; nenhuma promoção autorizada.
- **Documento relacionado:** `docs/PRE_PROMOTION_RELEASE_PLAN.md`, `docs/PRODUCT_RULES.md`, `docs/ROADMAP.md`, `docs/TEST_CASES.md` (TC-049), `docs/PROJECT_STATE.md`.

## 2026-08-18 — DEC-Text-E9E: criação na vista atual e WYSIWYG reutilizam a cadeia canônica

- **Data:** 2026-08-18.
- **Assunto:** estabilização funcional do editor de Text Asset pós-E9D (posição inicial + sincronização WYSIWYG).
- **Classificação:** correção funcional localizada; risco médio (geometria e draft de Text Asset), sem redesign nem alteração de arquitetura.
- **Decisão:** (1) o NOVO Text Asset nasce centralizado na VISTA ATUAL do Stage, com o centro capturado em World pela transformação canônica já existente (`computeEditorTransform → screenToStageCoord → editorStageToWorld`, encapsulada em `getEditorViewCenterWorld()`), ANTES de abrir/focar a sheet e ANTES do resize do teclado; a geometria REAL medida do draft é usada para o centro coincidir com o da vista, com fallback ao centro da célula base quando não há vista válida. Editar asset existente nunca recentraliza. (2) Enquanto o editor está ativo, `pendingTextDraft` é a fonte única da verdade visual: `renderAssetSelectionOverlay` consome a geometria viva do draft e os pontos de mutação do painel (`updateTextDraft`, listener de `input`, abertura do editor) re-renderizam a seleção junto do Stage.
- **Razão:** o ponto de criação centralizava no centro da célula base do ProjectWorld, ignorando a vista corrente sob pan/zoom; e a seleção/alças consumiam o estado confirmado, não o draft, divergindo do painel durante a edição. A correção é mínima e na origem, sem fórmula de câmera paralela, sem `window.innerWidth/innerHeight` como sistema canônico, sem compensação CSS e sem mexer no ProjectWorld/Preview/Export; sem polling, timers ou render duplicado.
- **Consequência:** gates automatizados E9E (centralização Casos A–E e WYSIWYG) falham na main pré-E9E e passam após a correção; E8Z/E9A/E9C/E9D preservados. `APP_VERSION === APP_VERSION_NAME === v8z4b32E9E`. O redesign E9F e as alças laterais E9G permanecem plano futuro não implementado.
- **Status:** implementado em PR no repositório de teste; validação visual final em iPhone/Safari real pendente; nenhuma promoção autorizada.
- **Documento relacionado:** `docs/PRE_PROMOTION_RELEASE_PLAN.md`, `docs/PRODUCT_RULES.md`, `docs/REGRESSIONS.md` (REG-048/REG-049), `docs/TEST_CASES.md` (TC-048).

## 2026-08-16 — DEC-Text-E9D: tolerância de 1 px pertence à geometria canônica

A reserva adotada para o limite Canvas/DOM não será aplicada como largura mínima ou override visual no Stage. Esta decisão não classifica divergência subpixel como causa comprovada antes de reprodução pública A/B no WebKit ou iPhone. O modo Auto soma 1 px CSS à maior linha dentro de `measureTextAsset`; assim Stage, seleção, hit-test, Preview e Export consomem a mesma geometria. O valor não altera o padding aprovado nem a migração não destrutiva de projetos legados em modo Fixa.

## DEC-2026-08-16-01 — Separar Texto, Camadas/Profundidade e Engine Sprint em PRs próprias

- **Data:** 2026-08-16.
- **Assunto:** estratégia de entrega da série pré-promoção a partir da base auditada `v8z4b32E9C`.
- **Classificação:** processo / planejamento / QA.
- **Decisão:** entregar a evolução em PRs funcionais separadas e sequenciais — (1) Texto, (2) Camadas e Profundidade, (3) Engine Sprint de Movimento inteligente e intensidade de easing — seguidas de revisão integrada no iPhone/Safari, em vez de uma única PR grande. O Engine Sprint não pode ser misturado às duas PRs anteriores.
- **Razão:** redução de risco — escopos menores permitem revisão de diff, QA e validação visual focados por área, isolam regressões e mantêm `Stage = Preview = Export` e a separação motor/UI sem alteração colateral.
- **Consequência:** cada PR funcional parte do HEAD remoto atualizado, recebe nova versão com `APP_VERSION === APP_VERSION_NAME`, passa pelos checks obrigatórios do HEAD atual e não libera promoção por si só. A candidata real de produção é o HEAD posterior à série completa, à documentação coerente e à aprovação explícita de Roberto.
- **Status:** plano documental aprovado e registrado; não autoriza implementação automática dos itens.
- **Documento relacionado:** `docs/PRE_PROMOTION_RELEASE_PLAN.md`.

## 2026-08-14 — E9B reutiliza o resolvedor visual do Stage para texto

- **Decisão:** após `measureTextAsset`, o ramo DOM textual usa `resolveAssetStageVisualGeometry` e converte sua `visualRect`, assim como imagens, seleção, abas e hit-test.
- **Razão:** eliminar a divergência sem duplicar a fórmula de paralaxe ou persistir um offset aparente.
- **Preservado:** elemento único para glifos e fundo, rotação, escala, padding, background, zIndex, geometria canônica, Frames, curvas, ProjectWorld, Preview e Export.
- **Risco controlado:** ordem medição → resolução é obrigatória para que largura e altura canônicas estejam atuais.

## DEC-E9A — `asset.depth` é a fonte canônica também para Text Assets

- **Decisão:** aplicar ao texto a regra finita já usada por imagens: preservar `Number(depth)` quando finito e migrar ausência ou valor inválido para zero em normalização, serialização e hidratação.
- **Motivo:** compensações, caches ou reaplicações pós-render esconderiam a perda de estado sem corrigir Save/Load e Session Restore.
- **Consequências:** não há clamp nesses limites; o slider público mantém -100..100. `depth` e `zIndex` continuam independentes, sem alteração na fórmula de parallax, UI, renderer, WebCodecs ou geometria canônica.
- **Validação:** gates públicos de Stage, Preview, Export, Undo/Redo, Save/Load e sessão; iPhone/Safari real permanece obrigatório e pendente.

## DEC-2026-08-09-01 — Hierarquia neutra e densidade dos bottom sheets contextuais

- **Data:** 2026-08-09.
- **Assunto:** superfícies e controles contextuais de Frames e Ativos.
- **Classificação:** produto / UI / QA visual.
- **Decisão:** manter o fundo principal no neutro mais escuro; usar no bottom sheet um neutro discretamente mais claro; usar nos pills um neutro aproximadamente 10–20% mais claro que a superfície; prolongar a superfície aberta até a borda inferior/safe-area; e compartilhar entre Frames e Ativos a mesma geometria contextual compacta.
- **Preservação:** “cor da interface” neste sistema significa somente superfícies neutras e não autoriza substituir ciano de Frames, roxo de Ativos ou outros acentos funcionais.
- **Consequência:** divergência geométrica entre modos, faixa escura sob painel aberto ou mudança colateral dos acentos bloqueia aprovação.
- **Status:** regra aplicada tecnicamente na `v8z4b32E8U`; aprovação visual publicada em iPhone/Safari real permanece pendente.

## DEC-2026-08-08-02 — Registrar texto, presença temporal e comportamento de ativos como proposta futura incremental

- **Data:** 2026-08-08.
- **Assunto:** backlog futuro de quadros de texto e ativos.
- **Classificação:** produto / planejamento / documentação.
- **Decisão:** registrar como direção futura, ainda sem autorização de implementação, que quadros de texto devem evoluir como ativos reais do projeto, com largura ajustável, quebra automática, fundo/transparência e participação em ProjectWorld, Layers, Save/Load, Preview e Export. Registrar também que presença temporal de ativos deve ser tratada separadamente de animação, com preferência inicial por intervalos baseados em frames.
- **Contexto:** Roberto apontou a importância de texto para o propósito do Arco e a necessidade de controlar quando ativos aparecem ou somem, evitando dessincronização quando o controle depender somente de tempo absoluto.
- **Consequência:** futuras PRs devem começar por escopos pequenos: primeiro quadro de texto estático e confiável; depois presença temporal por frames; depois fade in/fade out; depois presets matemáticos simples. Timeline avançada, keyframes manuais e editor complexo permanecem fora de escopo até nova decisão explícita.
- **Status:** proposta documental registrada; não implementada; não autoriza roadmap automático.
- **Documento relacionado:** `docs/PROPOSAL_TEXT_BOXES_AND_ASSET_TIMING.md`.

## DEC-2026-08-08-01 — Fonte persistente canônica de image asset substituído

- **Data:** 2026-08-08.
- **Decisão:** após leitura, decode e preparação válida do drawable, o replace do mesmo `asset.id` atualiza atomicamente `src`, `persistentSrc` e `sourcePayload` para a mesma data URL. Save e Session Autosave serializam essa identidade persistente; drawables e caches permanecem fontes de render, não fontes de verdade do projeto.
- **Contexto:** `sourcePayload` antigo podia sobreviver ao replace e vencer `src` novo no resolvedor compartilhado de persistência.
- **Consequência:** projetos substituídos anteriores à E8S usam `src` do commit canônico como migração quando o flag canônico existe; novos commits mantêm todas as representações persistentes iguais. Undo/Redo restaura e persiste a fonte do estado corrente.
- **Status:** ativa; PR #478 mergeada e validação visual publicada aprovada por Roberto em iPhone/Safari real em 2026-08-08.
- **Versão relacionada:** `v8z4b32E8S`.

## 2026-08-07 — Painéis contextuais e identidade de Preview/Export na v8z4b32E8Q

- Frames e Ativos usam uma apresentação compartilhada de bottom sheet compacto na faixa inferior, sem animação ou handle de arraste nesta versão.
- Painéis são propriedade do modo e nunca atravessam uma troca Câmera/Frames ↔ Ativos.
- Ações individuais de Ativo dependem da resolução canônica de `selectedAssetId`; sem asset existente, permanecem visíveis e desabilitadas.
- O ponto central da timeline e a centralização dos chips compartilham o eixo X da faixa rolável como fonte geométrica única.
- Preview/Export pronto possui token ciano local e não deriva de verde semântico nem do accent do modo.

Formato: ID, data, decisão, contexto, consequência e status.

## DEC-2026-08-07-01 — Verde não pertence à identidade atual da interface

- **Data:** 2026-08-07.
- **Assunto:** identidade cromática da interface.
- **Classificação:** produto / UX / identidade visual.
- **Decisão:** a interface atualmente aprovada do Arco Motion App não utiliza verde como cor de UI. Verde não deve ser introduzido por convenção semântica genérica, design system externo, estados de sucesso ou conclusão, código legado, tokens CSS históricos, diagnósticos, nomes internos ou interpretação do agente. O estado pronto de Preview/Export usa o ciano aprovado próprio do Arco.
- **Exceção:** conteúdo importado pelo usuário não está sujeito a essa restrição cromática.
- **Contexto:** a `v8z4b32E8Q` corrigiu uma regressão na qual o estado de Preview/Export havia retornado ao verde por interpretação incorreta da semântica de sucesso. A regra passa a ser global para impedir recorrência em outros componentes.
- **Consequência:** toda mudança futura de UI deve preservar essa identidade; qualquer introdução futura de verde exige aprovação explícita de Roberto.
- **Status:** aprovada.
- **Versão relacionada:** `v8z4b32E8Q`.

## DEC-001 — Dois modos do app

- Data: data não consolidada.
- Decisão: o app trabalha com os modos Ativos/Mundo e Câmera/Frames.
- Contexto: separar organização de assets/mundo da edição de câmera/frames.
- Consequência: mudanças devem preservar a separação de responsabilidades.
- Status: aprovada.

## DEC-002 — Repositório de teste e repositório estável

- Data: data não consolidada.
- Decisão: `rowestudio/arco-app-test` é desenvolvimento/teste; `rowestudio/arco-app` é estável/produção.
- Contexto: permitir validação antes de promoção.
- Consequência: produção não pode ser alterada por inferência.
- Status: aprovada.

## DEC-003 — Promoção somente após aprovação

- Data: data não consolidada.
- Decisão: promoção para produção só ocorre após aprovação explícita de Roberto.
- Contexto: Roberto valida o comportamento real antes da promoção.
- Consequência: agentes não promovem por conta própria.
- Status: aprovada.

## DEC-004 — Fluxo via branch e PR

- Data: data não consolidada.
- Decisão: mudanças devem ser feitas em branch própria e PR.
- Contexto: preservar revisão, rastreabilidade e rollback.
- Consequência: não encerrar tarefa relevante apenas com alteração local.
- Status: aprovada.

## DEC-005 — Não gerar HTML independente

- Data: data não consolidada.
- Decisão: não criar HTML paralelo fora do repositório para substituir o app.
- Contexto: evitar fontes divergentes e perda de histórico.
- Consequência: mudanças devem ocorrer na base oficial.
- Status: aprovada.

## DEC-006 — Preservar renderer único

- Data: data não consolidada.
- Decisão: preservar renderer único/canônico entre Stage, Preview e Export.
- Contexto: pipelines paralelos tendem a gerar divergência visual.
- Consequência: alterações no renderer exigem escopo explícito.
- Status: aprovada.

## DEC-007 — Teste real em iPhone/Safari

- Data: data não consolidada.
- Decisão: iPhone/Safari é referência real.
- Contexto: o produto é mobile-first e validado visualmente por Roberto.
- Consequência: WebKit automatizado ajuda, mas não substitui Safari real.
- Status: aprovada.

## DEC-008 — Diagnóstico não substitui validação visual

- Data: data não consolidada.
- Decisão: diagnóstico interno não supera relato visual de Roberto.
- Contexto: flags podem estar corretas e ainda assim a UX estar quebrada.
- Consequência: evidência visual e relato humano são decisivos para UX.
- Status: aprovada.

## DEC-009 — Título de PR com versão ou operação

- Data: data não consolidada.
- Decisão: títulos de PR devem conter a versão ou identificação operacional.
- Contexto: facilitar rastreabilidade entre tarefa, versão e release.
- Consequência: PRs documentais usam ID operacional, como `OPS-01`.
- Status: aprovada.

## DEC-010 — WebCodecs como pipeline principal de exportação

- Data: data não consolidada.
- Decisão: o pipeline principal de MP4 é WebCodecs, no caminho Canvas → VideoFrame → VideoEncoder → MP4.
- Contexto: histórico do projeto registrou trancos com `captureStream + MediaRecorder`.
- Consequência: `captureStream + MediaRecorder` não deve voltar como export principal sem decisão explícita e PR própria.
- Status: aprovada.

## DEC-011 — Curva controla caminho, não velocidade

- Data: data não consolidada.
- Decisão: a curva visual controla o caminho do movimento, não a velocidade.
- Contexto: regras históricas em `docs/codex-rules.md` e tarefas de curva/escala foram consolidadas na OPS-01.
- Consequência: não reintroduzir easing na curva sem autorização explícita.
- Status: aprovada.

## DEC-012 — Escala não deve resetar curvas

- Data: data não consolidada.
- Decisão: ajuste de escala, inclusive escala global, não deve resetar, recriar ou alterar curvas existentes.
- Contexto: regressões históricas indicaram curva resetada ao alterar escala, especialmente após carregar projeto ou usar escala global.
- Consequência: não chamar rotinas de reset/recriação de curva como efeito colateral de escala.
- Status: aprovada.

## DEC-013 — v8z3t rejeitada como base

- Data: data não consolidada.
- Decisão: `v8z3t` não deve ser usada como base.
- Contexto: versão histórica descartada por regressão em curva/easing.
- Consequência: tarefas futuras não devem partir dessa base nem reaproveitar sua lógica sem auditoria explícita.
- Status: aprovada.

## DEC-014 — Documentos antigos não são fonte operacional

- Data: 2026-07-16.
- Decisão: documentos antigos de regras, tarefas e versionamento devem ser obsoletados ou marcados como referência histórica após migração do conteúdo válido.
- Contexto: revisão independente apontou risco de fontes paralelas de verdade.
- Consequência: `AGENTS.md` e os documentos oficiais da OPS-01 prevalecem.
- Status: aprovada.

## DEC-015 — Merge direto não é fluxo operacional

- Data: 2026-07-16.
- Decisão: o fluxo obrigatório é branch própria, PR e aprovação; merge direto ou trabalho direto na `main` não é permitido como regra operacional.
- Contexto: regras históricas de versionamento citavam merge de forma genérica.
- Consequência: qualquer promoção ou merge exige PR e autorização aplicável.
- Status: aprovada.

## DEC-2026-07-22-01 — Fonte de verdade e registro obrigatório

- **ID:** DEC-2026-07-22-01
- **Data:** 2026-07-22
- **Assunto:** Fonte de verdade e registro obrigatório
- **Classificação:** Processo / Project OS
- **Decisão:** O chat não é fonte de verdade do projeto. Toda decisão relevante de produto, arquitetura, processo, QA, aprovação, regressão ou roadmap deve ser registrada no Project OS do repositório de teste. A decisão também deve ser refletida no documento temático correspondente: produto em `PRODUCT_RULES.md`; processo em `APPROVAL_WORKFLOW.md` ou `AGENTS.md`; conclusão/liberação em `DEFINITION_OF_DONE.md`; regressão em `REGRESSIONS.md`; planejamento em `ROADMAP.md` ou `PRODUCT_ROADMAP.md`; estado atual em `PROJECT_STATE.md`.
- **Motivo:** Evitar perda de contexto, divergência entre agentes e decisões mantidas apenas em conversas.
- **Impacto:** PRs funcionais ou documentais devem atualizar o Project OS sempre que consolidarem decisões relevantes.
- **O que substitui ou corrige:** Substitui decisões operacionais dependentes apenas do chat.
- **Sistemas/documentos afetados:** `AGENTS.md`, `docs/APPROVAL_WORKFLOW.md`, `docs/DEFINITION_OF_DONE.md`, `docs/PROJECT_STATE.md`, `docs/PRODUCT_RULES.md`, `docs/REGRESSIONS.md`, `docs/ROADMAP.md`, `docs/PRODUCT_ROADMAP.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-02 — Revisão não se limita a checks verdes

- **ID:** DEC-2026-07-22-02
- **Data:** 2026-07-22
- **Assunto:** Revisão técnica e aderência ao objetivo
- **Classificação:** QA / Revisão de PR
- **Decisão:** Checks verdes, diff pequeno, ausência de erro de sintaxe e testes automatizados aprovados não são suficientes para recomendar merge. Antes de liberar uma PR, a revisão deve validar aderência integral ao objetivo, coerência com o sistema já aprovado, ausência de coexistência indevida entre sistema antigo e novo, geometria/UI verificável pelo diff, regressões/preservações e correspondência entre implementação e proposta de produto. Se houver erro previsível no diff, inconsistência, ambiguidade material ou implementação parcial, a PR deve ser bloqueada.
- **Motivo:** A v8z4b32E7Y passou por implementação parcial visualmente reprovada apesar de baixo risco aparente no diff.
- **Impacto:** Revisões precisam avaliar arquitetura, comportamento e evidência visual objetiva, não apenas checks automatizados.
- **O que substitui ou corrige:** Corrige o entendimento de que checks verdes bastam para recomendar merge.
- **Sistemas/documentos afetados:** `docs/DEFINITION_OF_DONE.md`, `docs/APPROVAL_WORKFLOW.md`, `AGENTS.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-03 — Dúvidas materiais devem ser resolvidas antes

- **ID:** DEC-2026-07-22-03
- **Data:** 2026-07-22
- **Assunto:** Tratamento de ambiguidade material
- **Classificação:** Processo / Escopo
- **Decisão:** Quando o objetivo estiver consolidado no Project OS, ele deve ser executado integralmente e não pode ser reduzido pelo agente. Quando houver dúvida material real, deve-se perguntar antes de gerar o prompt ou bloquear a PR e solicitar esclarecimento. Não é permitido escolher silenciosamente uma interpretação menor, parcial ou mais simples.
- **Motivo:** Evitar entregas que pareçam cumprir visualmente uma parte do pedido, mas deixem o problema central sem solução.
- **Impacto:** Agentes devem bloquear ou esclarecer escopo material em vez de simplificar a implementação sem registro.
- **O que substitui ou corrige:** Corrige interpretações silenciosamente reduzidas de objetivos aprovados.
- **Sistemas/documentos afetados:** `AGENTS.md`, `docs/DEFINITION_OF_DONE.md`, `docs/APPROVAL_WORKFLOW.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-22-04 — Distinção entre regressão grave e implementação incompleta

- **ID:** DEC-2026-07-22-04
- **Data:** 2026-07-22
- **Assunto:** Reversão versus conclusão corretiva
- **Classificação:** Processo / Regressão
- **Decisão:** Regressão grave que quebra ou compromete a base deve recomendar reversão antes de nova tentativa. Implementação incompleta, mas funcionalmente estável e aproveitável, pode ser concluída por nova PR sobre a base atual. A escolha deve ser fundamentada na revisão do código e no impacto observado, e não feita automaticamente. Nesta situação específica, a v8z4b32E7Y é implementação incompleta e visualmente reprovada, mas pode ser corrigida a partir da main atual sem reversão imediata.
- **Motivo:** Diferenciar risco estrutural de entrega incompleta aproveitável.
- **Impacto:** A correção v8z4b32E7Z continua sobre a main atual, sem reverter a PR #449.
- **O que substitui ou corrige:** Corrige a decisão automática de reverter qualquer versão reprovada.
- **Sistemas/documentos afetados:** `docs/REGRESSIONS.md`, `docs/PROJECT_STATE.md`, `docs/APPROVAL_WORKFLOW.md`.
- **Status:** Ativa.
- **PR relacionada:** v8z4b32E7Z.

## DEC-2026-07-28-01 — Identidade canônica de seleção de Ativos

- **Data:** 2026-07-28.
- **Decisão:** `selectedAssetId` é a única identidade canônica do Ativo selecionado. Stage, Layers, contexto, toolbar, contorno e reorder devem resolver o objeto exclusivamente por esse ID; aliases legados só podem derivar dele.
- **Contexto:** escritas diretas e observações posicionais permitiam divergência real ou aparente entre componentes após seleção e reorder.
- **Consequência:** nenhuma posição de array, linha, `zIndex`, slot ou rótulo “Imagem N” pode servir como identidade de seleção; reconstruções devem reencontrar o mesmo `asset.id`.
- **Status:** ativa na `v8z4b32E8B`, com aprovação visual pendente em iPhone/Safari real.

## DEC-2026-07-28-02 — Precedência de fontes estáveis na render session

- **Data:** 2026-07-28.
- **Decisão:** Preview e Export usam a mesma rotina de readiness por asset. Um `stableDrawable` com dimensões, pixels e versão de fonte compatíveis é suficiente; a fonte viva não precisa estar simultaneamente pronta. Sem drawable válido, a rotina tenta fonte viva e depois fonte persistente recuperável antes de falhar.
- **Contexto:** fontes DOM são voláteis no Safari/iPhone e não devem invalidar um raster já congelado e comprovadamente desenhável.
- **Consequência:** snapshots de render armazenam apenas fontes estáveis verificadas, nunca pulam assets visíveis e são descartados integralmente se qualquer asset permanecer irrecuperável.
- **Status:** ativa na `v8z4b32E8C`, com validação real em iPhone/Safari pendente.


## DEC-2026-07-28-03 — Identidade nominal persistente de Layers

- **Data:** 2026-07-28.
- **Decisão:** cada image asset recebe uma única sequência positiva e imutável, exibida como `Camada N`; reorder não renomeia, exclusão não libera o número e `nextLayerSequence` nunca recua.
- **Contexto:** nomes posicionais derivados de array ou `zIndex` mudavam a identidade aparente do mesmo asset após reorder.
- **Consequência:** criação e migração passam pela rotina canônica de identidade; Save/Load persiste identidade e contador; `originalFileName` é preservado sem virar título principal.
- **Status:** ativa na `v8z4b32E8D`, com validação real em iPhone/Safari pendente.

## DEC-2026-07-29-01 — Checkpoint integral de sessão em IndexedDB

- **Data:** 2026-07-29.
- **Decisão:** Session Autosave é independente do Save/Load manual, reutiliza `buildProjectData(true)` e `applyProjectData()`, e mantém em IndexedDB somente o último checkpoint completo com checksum e revisão monotônica.
- **Contexto:** reload, descarte de página pelo iOS/Safari e retorno posterior não podem depender do Save manual nem aceitar reconstrução parcial.
- **Consequência:** assets são pré-hidratados antes de qualquer aplicação; falha preserva o checkpoint anterior; Load manual invalida callbacks anteriores e se torna a sessão corrente; Novo Projeto limpa a sessão anterior antes de gravar a nova.
- **Status:** ativa na `v8z4b32E8E`; Session Autosave, Session Restore, preservação de ProjectWorld e Save/Load foram validados por Roberto em iPhone/Safari real.


## DEC-2026-07-29-02 — Relógio do Preview depende do commit do primeiro frame

- **Data:** 2026-07-29.
- **Decisão:** em uma nova abertura do Preview, o relógio visual e o loop de playback só podem iniciar depois que o renderer canônico concluir o desenho final de `t=0` sem erro e o preflight aguardar os ciclos posteriores de composição definidos, preservando os guards de token/fechamento.
- **Contexto:** concluir o warm-up apenas por término da função, sem confirmação posterior ao desenho final, permitia uma travada perceptível no Safari.
- **Consequência:** falha ou cancelamento não marca warm-up concluído, não agenda playback, mantém Export fora do caminho e libera tentativa posterior.
- **Status:** ativa tecnicamente na `v8z4b32E8F`, com aprovação visual pendente em iPhone/Safari real.

## DEC-2026-07-29-03 — Session Autosave normal é isolado de playback/export

- **Data:** 2026-07-29.
- **Decisão:** Session Autosave normal nunca executa build integral, serialização, checksum ou escrita durante preparação/reprodução do Preview ou Export; Play não é mutação do projeto.
- **Contexto:** o `pointerup` global do Play podia vencer o debounce durante a reprodução e executar checkpoint de dezenas de megabytes no thread principal.
- **Consequência:** revisão pendente é preservada e retomada uma única vez após a saída completa; `visibilitychange hidden` e `pagehide` continuam autorizados a ultrapassar a barreira como flush prioritário de segurança.
- **Status:** ativa tecnicamente na `v8z4b32E8G`, com validação real em iPhone/Safari pendente.

## DEC-2026-07-30-01 — Recuperação de sessão exige escolha na abertura normal

- **Data:** 2026-07-30.
- **Decisão:** uma nova instância da página sem intenção explícita de Recarregar só pode restaurar um checkpoint automático válido depois que o usuário escolher “Continuar de onde parei”; a alternativa descarta somente esse checkpoint e mantém o launcher normal.
- **Contexto:** a abertura normal restaurava silenciosamente a sessão anterior, sem permitir que o usuário optasse por iniciar outro fluxo pelo launcher.
- **Consequência:** a inspeção inicial valida schema, completude, payload, checksum, JSON e estrutura mínima sem hidratar ou aplicar o projeto; intenções `restore` e `clean` da E8H mantêm prioridade e nunca abrem a pergunta novamente.
- **Status:** ativa tecnicamente na `v8z4b32E8I`; validação real em iPhone/Safari/PWA permanece obrigatória.
## DEC-2026-08-06-01 — Profundidade de asset não altera geometria canônica

- **Data:** 2026-08-06.
- **Decisão:** `depth` é propriedade finita e persistente de cada image asset, com padrão zero; seu efeito 2.5D inicial é somente um offset translacional calculado por helper compartilhado depois da câmera e antes do desenho.
- **Referência neutra:** centro da célula principal canônica do ProjectWorld. O offset aparente nunca é escrito em `worldX`, `worldY`, `worldW`, `worldH`, `rotation`, Frames, curvas ou ProjectWorld.
- **Compatibilidade futura:** grupos de Frames, templates e blocos continuam operando sobre câmera, Frames, curvas e tempo; aplicar, importar ou duplicar esses grupos não deve zerar nem reescrever a profundidade independente dos assets.
- **Status:** ativa tecnicamente na `v8z4b32E8N`; paridade visual e aprovação em iPhone/Safari real permanecem pendentes.

## DEC-2026-08-06-02 — Profundidade e ordem de camada são independentes

- **Data:** 2026-08-06.
- **Decisão:** `zIndex` define exclusivamente sobreposição/ordem visual e `depth` define exclusivamente intensidade e direção da resposta aparente à câmera; alterar um campo nunca ordena, limita, classifica ou corrige o outro.
- **Integração do Stage:** imagem DOM, seleção, quatro alças e hit-test derivam da mesma geometria visual resolvida a partir da geometria canônica mais o offset temporário de parallax.
- **Painéis:** Escala, Rotação e Profundidade compartilham a região e as métricas contextuais existentes, com somente um painel interativo por vez.
- **Compatibilidade futura:** grupos de frames e templates continuam livres para reutilizar câmera/Frames/curvas/tempo sem alterar profundidade ou ordem dos assets.
- **Status:** ativa tecnicamente na `v8z4b32E8O`; validação visual publicada em iPhone/Safari real pendente.

## DEC-2026-08-06-03 — OPS-04 Mobile CI Watchdog

- **Data:** 2026-08-06.
- **Decisão:** PRs abertas contra `main` devem receber validação automática de `QA Guardrails` e `WebKit Smoke Tests` para o HEAD SHA atual mesmo quando o evento original `pull_request` não criar checks. A OPS-04 usa um watchdog agendado e manual administrativo para detectar suítes ausentes por SHA e publicar check-runs explícitos no SHA correto.
- **Contexto:** o fluxo principal de Roberto é mobile-first; depender de desktop, terminal, GitHub CLI, token pessoal ou execução manual recorrente na aba Actions não é aceitável como solução permanente.
- **Arquitetura:** o workflow `Mobile CI Watchdog` roda na `main`, lê metadados de PRs abertas contra `main`, ignora drafts e forks, consulta workflow runs e check-runs existentes, cria check-runs somente para suítes ausentes e executa os comandos originais no checkout exato do HEAD SHA planejado.
- **Concorrência e frequência:** execução a cada 30 minutos, `workflow_dispatch` administrativo, `concurrency` global do watchdog e `concurrency` por PR/suíte/SHA. Um check existente em `queued`, `in_progress` ou `completed` evita duplicidade no mesmo SHA; mudança de SHA permite nova execução.
- **Segurança:** permissões padrão `contents: read`; o planejamento usa `pull-requests: read`, `actions: read` e `checks: write`; a execução usa `contents: read`, `pull-requests: read` e `checks: write` somente para finalizar o check-run. O código testado fica em `pr-source`, o código do watchdog em `watchdog-source`, ambos com `persist-credentials: false`, e a finalização roda a partir do watchdog da `main`.
- **Limitações:** forks e branches externas são ignorados por segurança; WebKit automatizado em Linux segue sem substituir Safari/iPhone real; falha da Checks API deve aparecer como falha real do workflow, nunca como aprovação simulada.
- **Status:** ativa em OPS-04, sem alteração funcional do aplicativo e sem alteração de versão.

## 2026-08-12 — Gates permanentes por capacidade nativa do navegador

Decisão: manter WebKit/Linux como gate funcional de Text Asset até Preview/composição e usar WebKit/macOS como gate do Export WebCodecs/H.264 real; Chrome 150/Linux foi rejeitado após retornar H.264 não suportado. O split não altera o produto nem reduz o TC-038: isola uma limitação nativa reproduzida também na `main`, enquanto preserva a exigência de validação posterior em iPhone/Safari real.

## DEC-2026-08-13-01 — Draft isolado e tipografia canônica de Text Assets

- **Data:** 2026-08-13.
- **Decisão:** criação e reedição usam um controlador com draft isolado. No Stage o draft substitui visualmente o alvo; Preview, Export e persistência consomem somente o asset confirmado. Concluir sem mudança não cria Undo ou autosave.
- **Tipografia:** `fontKey` usa whitelist local de cinco stacks seguras; peso, estilo e alinhamento usam whitelists. E8X sem `fontKey` migra para Sistema.
- **Interação:** um toque seleciona, a ação primária adaptativa exibe Editar para texto/Trocar para imagem, e dois taps concluídos no mesmo texto abrem o editor sem transformar o asset.
- **Futuro:** fundo e padding pertencem à caixa; presença temporal pertence ao sistema geral de ativos e define quando aparecem, separadamente de animação, que define como aparecem ou se comportam.
- **Status:** implementada tecnicamente na E8Y; validação real em iPhone/Safari pendente.

## DEC-2026-08-13-02 — Modalidade e autosave do editor de texto

- **Data:** 2026-08-13.
- **Decisão:** o sheet tipográfico é uma superfície modal de ponteiro/toque; a área externa não conclui nem cancela e não encaminha gestos ao Stage. A rolagem horizontal interna permanece explícita por `touch-action: pan-x`.
- **Autosave:** enquanto `pendingTextDraft` existir, qualquer `change` originado em `#textCreationSheet` é ignorado pelo listener global. Somente o commit canônico alterado chama `markProjectDirty()` uma vez.
- **QA:** as ferramentas continuam semanticamente `role="tab"`; testes devem localizá-las como tabs e exercitar seleção, toolbar e dois taps pelo fluxo público.
- **Status:** correção bloqueante incorporada à E8Y na PR #488; validação WebKit e iPhone/Safari continua obrigatória.

## DEC-2026-08-13-03 — Histórico canônico sempre persiste e tap cancelado não conclui

- **Decisão:** Undo/Redo que alterem o snapshot canônico agendam exatamente uma revisão normal de Session Autosave, independentemente de alteração em fonte de imagem. `pointercancel` não é `pointerup`: limpa o candidato de duplo tap, desfaz movimento parcial sem histórico e encerra o estado de gesto.
- **Escopo:** correção bloqueante dentro da E8Y/PR #488, sem nova versão e sem alteração do modelo de câmera, Frames, curvas ou ProjectWorld.
- **Evidência exigida:** checkpoint IndexedDB real após Undo/Redo de tipografia e sequência pointerdown → pointercancel → tap único no WebKit funcional.

## DEC-2026-08-13-04 — Fingerprint canônico dedicado ao histórico

- **Decisão:** Undo/Redo usam comparação própria composta pelo snapshot de animação existente, `projectWorld`, `nextLayerSequence` e representação persistível ordenada dos assets, incluindo tipografia e fingerprint da fonte de imagem.
- **Exclusões:** DOM, `HTMLImageElement`, `ImageBitmap`, caches, drawables e diagnóstico não participam do fingerprint.
- **Cancelamento:** escala/rotação canceladas restauram o snapshot pré-gesto e não entram no histórico ou Session Autosave.
- **Escopo:** bloqueador da mesma E8Y na PR #488, sem bump e sem alterar `projectStateEquals()` usado por Reset e outros fluxos.

## 2026-08-13 — E8Z: geometria externa da caixa de texto

Decisão: `boxWidth` continua sendo a largura de conteúdo/wrapping; com fundo ativo, `worldW/worldH` representam conteúdo mais padding simétrico e `worldX/worldY` o canto externo, preservando o centro na edição. Stage, Preview e Export derivam o fundo do mesmo ativo canônico; opacidade é aplicada somente ao preenchimento.

## 2026-08-13 — correção P1 da escala E8Z

A escala de Text Assets é calculada exclusivamente pelas grandezas canônicas de conteúdo (`textBaseBoxWidth`/`textBaseFontSize`). `measureTextAsset()` continua como único responsável por derivar o retângulo externo e o padding, evitando duplicação; o centro anterior é restaurado depois da medição.
