# REGRESSIONS

## REG-047 — Text Asset novo pode quebrar verticalmente no Safari (E9D)

- **Relato real:** texto recém-criado podia aparecer letra a letra no Stage/Preview; uma letra podia conservar caixa excessiva.
- **Causa demonstrada no código:** o modo Auto gravava a largura Canvas exatamente no limite natural, mas o Stage DOM aplicava a mesma largura sob `overflow-wrap:anywhere`; diferenças de arredondamento subpixel entre Canvas e layout de fonte no Safari podiam exceder esse limite e acionar quebra por caractere.
- **Correção E9D:** reserva geométrica canônica de 1 px em `measureTextAsset`, compartilhada pela caixa/seleção/hit-test e pelos snapshots de Preview/Export, além do gate público E9D. Não é compensação visual de CSS.
- **Estado:** cobertura automatizada implementada; a regressão continua **pendente de validação visual final em iPhone/Safari real** e só deve ser encerrada após os checks do HEAD e essa validação.

## REG-2026-08-16 — Text Asset novo aparece vertical no Stage/Preview (ABERTA)

- **Relato:** no iPhone/Safari, um Text Asset novo pode aparecer vertical, letra a letra, no Stage ou no Preview, sem edição. O caso de uma única letra também não pode resultar em caixa excessivamente larga.
- **Causa/correção:** demonstradas e registradas em REG-047; a E9D adiciona a reserva geométrica canônica e o gate público correspondente.
- **Status:** implementação automatizada em PR, ainda aberta até checks do HEAD e validação visual final no iPhone/Safari real. Produção e promoção não autorizadas.
- **Documento relacionado:** `docs/PRE_PROMOTION_RELEASE_PLAN.md` (item 2 — PR de Texto).

## E9C — proteções da auto-largura do Text Asset

- O modo padrão de texto NOVO é `boxWidthMode:'auto'` (largura derivada da linha mais longa, quebra só por Enter). Projetos legados/E9x sem o campo migram para `'fixed'`, preservando a geometria confirmada anterior — `measureTextAsset` em modo fixo é idêntico ao comportamento pré-E9C.
- A largura só é derivada em `measureTextAsset`; `normalizeTextAsset`, serialização, `canonicalAsset`, hidratação e `restoreState` apenas preservam o campo. A geometria continua sendo escrita na ordem `measureTextAsset → resolveAssetStageVisualGeometry → visualRect` (E9A/E9B): a auto-largura não pode reintroduzir divergência glifos/fundo/seleção nem escrever offset de paralaxe em `worldX/worldY`.
- `boxWidthMode` (e, no modo fixo, `boxWidth`/`textBaseBoxWidth`) integram os campos de commit do editor e o fingerprint canônico de histórico, para que a alternância de modo agende Undo/Redo e Session Autosave reais e sobreviva a Save/Load e Session Restore.
- Depth/parallax translacional e Preview/Export permanecem inalterados; a nova largura apenas fornece `worldW/worldH` para `resolveAssetStageVisualGeometry` consumir. Escala% de texto continua `boxWidth/textBaseBoxWidth`: como a largura natural é linear na fonte, o baseline é resincronizado no modo auto e a mudança de largura fixa preserva a proporção de escala.

## REG-E9B — Paralaxe separa Text Asset de sua seleção no Stage

- **Relato:** no iPhone/Safari, a paralaxe movia seleção e abas do Text Asset, mas deixava glifos e fundo fixos no Stage.
- **Causa:** o DOM `.world-text-asset` convertia a geometria canônica diretamente, ao contrário dos demais consumidores da geometria visual resolvida.
- **Proteção:** medir o texto antes da resolução e converter somente `resolvedGeometry.visualRect`; teste TC-045 compara DOM, seleção, deslocamento e modelo canônico.
- **Status:** correção automatizada na E9B; validação final em iPhone/Safari físico pendente. Produção e promoção não autorizadas.

## REG-E9A — Profundidade de Text Asset apagada

- **Relato:** no iPhone/Safari, uma profundidade não zero escolhida no painel público retornava a zero.
- **Causa raiz:** `normalizeTextAsset`, o ramo textual de `serializeProjectAsset` e a reconstrução por `savedAssets` substituíam o valor por zero.
- **Correção:** os três limites preservam `Number(asset.depth)` quando finito e usam zero para legado/inválido; texto novo continua começando em zero.
- **Proteção:** testar valores positivos/negativos, redraw/Stage, Preview/Export, histórico, arquivo manual e checkpoint/restauração, mantendo `zIndex`, Frames, curvas e ProjectWorld.
- **Estado:** automação adicionada; validação final em iPhone/Safari real pendente.

Catálogo obrigatório de regressões históricas e proteções.

| ID | Descrição | Impacto | Área | Como detectar | Teste preventivo desejado | Status do teste |
| --- | --- | --- | --- | --- | --- | --- |
| REG-001 | Botão Diagnóstico deixa de abrir. | Perde acesso a inspeção técnica. | Diagnóstico/UI | Clicar no item e verificar painel. | Teste de interação do menu. | automatizável |
| REG-002 | Painel Diagnóstico não aparece. | Diagnóstico fica indisponível. | Diagnóstico/UI | Abrir Diagnóstico e observar overlay/painel. | Screenshot após ação. | automatizável |
| REG-003 | Texto técnico ou prompt aparece na interface. | Quebra UX e expõe instruções internas. | UI/conteúdo | Inspecionar DOM visível e tela. | Busca estática + screenshot. | automatizável |
| REG-004 | Stage mostra menos assets que o modelo. | Projeto visual incompleto. | Stage/ProjectWorld | Comparar contagem do modelo com DOM/canvas. | Teste com múltiplos assets. | automatizável |
| REG-005 | Hidratação incompleta. | Estado restaurado parcialmente. | Load/estado | Carregar projeto complexo e comparar campos. | Round-trip Save/Load. | automatizável |
| REG-006 | Asset loaded não corresponde ao asset do Stage. | Edição atua sobre imagem errada. | Assets/Stage | Comparar IDs/fontes/slots após load/troca. | Teste de troca e seleção. | automatizável |
| REG-007 | Frames ficam atrás dos assets. | Edição de frames fica invisível/inacessível. | Stage/frames | Observar z-order dos frames. | Screenshot visual. | parcial |
| REG-008 | Scrim/alpha incorreto. | Máscara visual engana edição. | Stage/alpha | Testar PNG/alpha e frame ativo. | Screenshot com fixture PNG. | automatizável |
| REG-009 | Frame central não destaca. | Usuário perde referência ativa. | Frames/UI | Selecionar frame central e observar destaque. | Teste visual. | parcial |
| REG-010 | Preview e Export divergem. | Saída final não corresponde à prévia. | Preview/Export | Comparar frames amostrados. | Comparação visual. | futuro |
| REG-011 | Preview alterado e Export esquecido. | Correção parcial gera regressão final. | Preview/Export | Revisar diff e testar ambos. | Checklist obrigatório. | manual |
| REG-012 | Save funciona, mas Load não restaura. | Projetos salvos ficam inúteis. | Save/Load | Salvar, recarregar e comparar. | Round-trip fixture. | automatizável |
| REG-013 | Load restaura estado parcial. | Projeto abre inconsistente. | Load/estado | Verificar assets, frames, layers, tempos. | Fixture complexo. | automatizável |
| REG-014 | Layers deixam de selecionar ou reordenar. | Organização de assets quebra. | Layers | Selecionar e reordenar layers. | Teste de interação. | automatizável |
| REG-015 | Seleção direta no Stage deixa de funcionar. | Edição direta perde usabilidade. | Stage/seleção | Tocar/clicar asset/frame no Stage. | Teste de hit-test. | automatizável |
| REG-016 | Timeline e tempos deixam de sincronizar. | Movimento fica incorreto. | Timeline/timing | Alterar duração/pausa e observar tempo total. | Teste de consistência. | automatizável |
| REG-017 | Menus ou layout são alterados fora do escopo. | Quebra UX aprovada. | UI/layout | Revisar diff CSS/HTML e screenshots. | Comparação visual. | manual |
| REG-018 | `APP_VERSION` não é atualizada em PR funcional. | Rastreabilidade quebra. | Versionamento | Revisar diff funcional. | Checklist de PR funcional. | manual |
| REG-019 | Versão é atualizada em PR apenas documental. | Sinaliza release inexistente. | Versionamento | Revisar diff documental. | Checklist documental. | manual |
| REG-020 | Código de prompt, changelog ou diagnóstico é renderizado no app. | Vazamento técnico na interface. | UI/conteúdo | Buscar termos e testar tela. | Busca estática + screenshot. | automatizável |
| REG-021 | Escala global reseta curvas. | Movimento aprovado perde trajetória. | Escala/curvas | Aplicar Template Circular, editar curva, usar escala global e observar curva. | Fixture com curva manual + escala global. | automatizável |
| REG-022 | Curva reseta ao alterar escala após carregar projeto. | Projetos salvos perdem ajustes ao reabrir. | Load/escala/curvas | Carregar projeto salvo com curva manual e alterar escala. | Round-trip com curva manual. | automatizável |
| REG-023 | Ajuste de escala reseta ou altera curvas. | Mudança de tamanho causa alteração colateral de caminho. | Escala/curvas | Alterar escala individual ou em lote e comparar curva antes/depois. | Comparação de estado e screenshot. | automatizável |
| REG-024 | Regressão da `v8z3t` em curva/easing volta à base. | Reintroduz comportamento descartado. | Curvas/easing/base | Revisar base e diff em tarefas de curva/easing. | Checklist de base proibida. | manual |
| REG-025 | Autosave/retomar sessão restaura estado não confiável. | Usuário continua de estado parcial ou incorreto. | Persistência/sessão | Acionar retomada de sessão e comparar estado esperado, inclusive Novo Projeto durante pré-hidratação lenta. | `node scripts/qa/check-session-autosave-restore.mjs` + `node scripts/qa/test-session-autosave-race.mjs`; teste real iPhone/Safari. | automatizado parcial; Safari real pendente |
| REG-026 | Início preto/apagado em sequência específica de edição. | App parece quebrado ao iniciar ou retornar. | Inicialização/render | Reproduzir sequência histórica quando documentada; observar Stage inicial. | Caso reproduzível a confirmar. | futuro |
| REG-027 | `captureStream + MediaRecorder` volta como export principal. | Export pode voltar a apresentar trancos. | Export/MP4 | Revisar pipeline de export e logs. | Teste arquitetural/static check. | automatizável |
| REG-039 | PR mobile/remota fica sem checks obrigatórios no HEAD atual. | Bloqueia ou fragiliza o fluxo mobile-first e pode deixar SHA novo sem validação automática. | CI/CD | Comparar PR aberta contra `main`, HEAD SHA atual e execuções/check-runs de `QA Guardrails` e `WebKit Smoke Tests` para esse SHA. | `Mobile CI Watchdog` + `node scripts/ci/test-mobile-ci-watchdog.mjs`. | automatizado |
| REG-043 | Escala de Ativos perde os botões auxiliares `−5%`/`+5%` ou seus steps/Reset divergem geometricamente dos equivalentes de Frames. | Impede ajustes aditivos rápidos ou quebra a paridade visual aprovada com os controles contextuais de Frames. | Ativos/Escala/Rotação/UI | Em 390 px, alternar Frames e Ativos entre Escala/Rotação/Profundidade; verificar exclusividade por `data-kind`, delta real e comparar retângulos/estilos computados de steps e Reset. | Smoke WebKit deve validar DOM, deltas de cinco pontos percentuais/graus, sincronização, Reset, Undo/Redo, exclusividade e paridade de altura, largura, tipografia, raio, gap e posição vertical com tolerância subpixel. | automatizado; Safari real pendente |
| REG-044 | Imagem substituída volta para a fonte anterior após persistência. | Save/Load ou Session Restore reabre conteúdo visual diferente do estado confirmado. | Assets/Save/Load/Session | Comparar fingerprints A/B do mesmo `asset.id` no replace, payload serializado, checkpoint e asset hidratado; existência de data URL isoladamente não comprova identidade. | `SOURCE A → Replace B → Save/Load B → Session Autosave/Restore B → Undo A → Redo B`, com comparação da fonte em todas as fronteiras. | resolvida na baseline de teste `v8z4b32E8S`: correção técnica incorporada; WebKit Smoke Tests e QA Guardrails passaram no HEAD final da PR #478; validação visual real aprovada por Roberto em iPhone/Safari em 2026-08-08 |
| REG-045 | Bottom sheet contextual volta a exibir controles gordos, densidade divergente ou faixa escura sob o painel aberto. | Frames e Ativos perdem paridade e a placa contextual deixa de ser contínua até a safe-area. | Frames/Ativos/UI | Em 390 × 797, medir steps/Reset e distância slider→controles nos dois modos; comparar a superfície do painel com a região inferior e preservar os acentos por modo. | Smoke WebKit valida altura compacta, paridade subpixel, overflow, backgrounds computados, ciano/roxo, abertura/fechamento e controles funcionais; Safari real conclui aprovação visual. | automatizável; Safari real pendente |
| REG-046 | Após Session Restore, câmera usa `stageW/stageH` variável enquanto overlays usam `ProjectWorld.baseStageW/baseStageH`; abrir Save pode redimensionar o viewport e regravar todos os Frames. | Preview diverge do editor e Salvar aparenta mover Frames. | Session Restore/Frame/Câmera | Round-trip Manual Load → checkpoint → reload/Restore → Preview → Save, mudando o viewport entre as fases e comparando todos os Frames. | Smoke WebKit E8W compara payload, modelo, overlays e câmera reais e reprova qualquer mutação por resize/Save. | automatizado; Safari real pendente |

## REG-028 — v8z4b32E7Y: transformação de Ativos incompleta

- **Problema:** A tarefa solicitava levar para Ativos o mesmo sistema de transformação de Frames, mas a implementação adicionou quatro círculos puramente visuais sobre o sistema antigo.
- **Sintomas:** cinco controles visuais; alça antiga de rotação mantida; alça antiga de escala mantida; círculos invadindo os cantos da imagem; novas abas sem interação; coexistência indevida entre sistema novo e antigo.
- **Causa:** O escopo foi interpretado como unificação visual, e não como equivalência funcional e visual.
- **Prevenção:** localizar a implementação de referência; comparar arquitetura e comportamento, não apenas CSS; verificar remoção do sistema substituído; bloquear merge quando o diff demonstrar coexistência ou geometria incorreta.
- **Status:** Registrada em 2026-07-22; correção em desenvolvimento na v8z4b32E7Z.


## REG-029 — Pills informativos redundantes reaparecem junto aos Frames no Stage

- **Problema:** O HUD preso ao Frame duplica escala, rotação e tempo/pausa já apresentados na faixa informativa acima da timeline e polui o Stage.
- **Prevenção:** não criar markup ou DOM dinâmico para `#frameHud`; preservar `#lowerActiveLabel`, número, contorno, quatro alças, curvas, scrim e seleção dos Frames.
- **Como detectar:** inspecionar o DOM do Stage após render, troca de modo, pan/zoom, seleção, Load e Undo/Redo; a contagem do HUD deve permanecer zero enquanto a faixa contextual da timeline continua presente e visível quando aplicável.
- **Teste preventivo:** `node scripts/qa/check-frame-stage-info-pills.mjs` valida a ausência do componente na origem e a preservação dos componentes DOM funcionais.
- **Status:** proteção automatizada adicionada na `v8z4b32E8A`; validação visual publicada em iPhone/Safari permanece pendente.

## REG-030 — Seleção de Ativo diverge entre Stage, Layers, contexto e reorder

- **Problema:** componentes do editor podem apontar para identidades diferentes ou aparentar divergência ao selecionar/reordenar Ativos, fazendo destaque, contorno, contexto ou ações atuarem fora do `asset.id` tocado.
- **Causa:** entradas históricas escreviam diretamente em estados paralelos, as linhas de Layers não expunham `data-asset-id` real e a reconstrução da lista não possuía uma auditoria comum por ID; a nomenclatura posicional também podia exibir números distintos para o mesmo asset entre lista ordenada por `zIndex` e contexto baseado no array.
- **Prevenção:** resolver seleção somente por `selectedAssetId` através de `selectAssetById()`, manter aliases derivados, marcar e reencontrar linhas por `data-asset-id`, preservar o ID durante reorder e comparar modelo/DOM por IDs reais.
- **Como detectar:** selecionar assets sobrepostos no Stage e por Layers; comparar hit-test, seleção canônica, contorno, contexto, toolbar e linha destacada; repetir após Frente/Trás, setas, fechamento/reabertura e Undo/Redo.
- **Teste preventivo:** `node scripts/qa/check-canonical-asset-selection.mjs` usa fixture com múltiplos assets e reorder; WebKit e validação real em iPhone/Safari complementam a proteção.
- **Status:** proteção técnica adicionada na `v8z4b32E8B`; validação publicada em iPhone/Safari permanece pendente.

## REG-031 — Render session exige fonte viva apesar de stableDrawable válido

- **Problema:** Preview/Export podem abortar com `asset-not-ready` quando uma fonte DOM perde prontidão no Safari, embora o asset ainda possua raster estável válido.
- **Causa:** a preparação antiga submetia também o `stableDrawable` ao caminho genérico de decode e exigia `decodeReady` e drawable válido simultaneamente; isso permitia a condição contraditória de 9 drawables válidos, 8 decodes e sessão abortada.
- **Prevenção:** aplicar uma única precedência para Preview/Export (`stableDrawable` válido, fonte viva, fonte persistente), tentar recovery uma vez com timeout, nunca omitir asset visível e descartar snapshot parcial/liberar locks após falha.
- **Teste preventivo:** `node scripts/qa/check-render-session-readiness-recovery.mjs` cobre 9/9, recovery, falha/retry e reprova omissão 8/9.
- **Status:** proteção técnica adicionada na `v8z4b32E8C`; teste do projeto real em iPhone/Safari permanece pendente.


## REG-032 — Nome da camada muda após reorder ou reutiliza número excluído

- **Problema:** o título derivado da posição no array/`zIndex` muda após reorder e pode atribuir novamente um número já eliminado.
- **Prevenção:** manter `layerSequence` imutável por asset, `layerName` persistente e `nextLayerSequence` monotônico no estado do projeto; reorder só altera posição/`zIndex`.
- **Como detectar:** criar três camadas, reordenar, excluir a segunda, criar outra e executar Save/Load; os nomes originais devem permanecer e a nova deve ser `Camada 4`.
- **Teste preventivo:** `node scripts/qa/check-persistent-layer-identities.mjs`.
- **Status:** proteção técnica adicionada na `v8z4b32E8D`; validação publicada em iPhone/Safari permanece pendente.


## REG-033 — Preview inicia relógio antes da confirmação visual do primeiro frame

- **Problema:** o warm-up podia desenhar `t=0` e retornar imediatamente, sem aguardar composição posterior; erros eram absorvidos e o chamador marcava conclusão/agendava playback sem prova estruturada.
- **Impacto:** pequena travada perceptível no início do Preview em iPhone/Safari, embora o MP4 exportado permanecesse fluido.
- **Prevenção:** exigir resultado estruturado, render canônico final bem-sucedido em `t=0`, ciclos posteriores de `requestAnimationFrame`, validação de token após cada espera e somente então liberar loading, relógio e loop.
- **Teste preventivo:** `node scripts/qa/check-preview-first-frame-warmup.mjs`, com fixtures positiva e negativa integradas a `node scripts/qa/run-self-tests.mjs`; repetição publicada em iPhone/Safari real continua obrigatória.
- **Status:** proteção técnica adicionada na `v8z4b32E8F`, mas Roberto confirmou em projetos de 4 e 9 ativos que ela não resolveu a travada visual; regressão não resolvida.

## REG-034 — Session Autosave pesado concorre com Preview/Export

- **Problema:** o `pointerup` global agenda checkpoint inclusive ao tocar Play; após 700 ms, build integral, serialização, checksum e IndexedDB podem competir no thread principal com o início do Preview.
- **Impacto:** pequena travada inicial perceptível no iPhone/Safari com checkpoints de dezenas de megabytes, apesar de assets prontos e primeiro frame confirmado antes do relógio.
- **Prevenção:** mutações usam disparadores explícitos, inclusive transformação pelos controles reais, Reset realmente aplicado, troca real de formato e comandos de Frames; Play, toque sem transformação, Reset sem diferença e formato já ativo não criam revisão; barreira central adia autosave normal durante Preview/Export e retoma uma única revisão pendente após saída completa; flush de ocultação/saída permanece prioritário.
- **Teste preventivo:** `node scripts/qa/check-session-autosave-preview-isolation.mjs` e `node scripts/qa/test-session-autosave-preview-isolation.mjs`, além do teste publicado em iPhone/Safari real com 4 e 9 ativos.
- **Evidência publicada:** no primeiro teste da `v8z4b32E8G` em iPhone/Safari/PWA, Roberto observou o Preview sem a travada inicial, confirmou o Session Autosave normal e confirmou a restauração do último projeto após fechar completamente e reabrir o PWA.
- **Status:** aprovada em observação no primeiro teste publicado da `v8z4b32E8G`; repetição com projetos de diferentes tamanhos permanece recomendada. Nenhuma promoção para produção está autorizada.

## REG-035 — Recarregar perde a última revisão ou restaura sessão sem escolha

- **Problema:** a recarga direta pode iniciar antes da conclusão do checkpoint, deixar o PWA sem camada visual estável e restaurar silenciosamente uma sessão que o usuário pretendia abandonar.
- **Prevenção:** todo comando Recarregar usa um controlador único; restaurar aguarda o flush da revisão mais recente, reiniciar do zero aguarda o clear, e somente então grava uma intenção de startup de uso único e recarrega.
- **Como detectar:** verificar ausência de `location.reload()` em `onclick`, escolha explícita, bloqueio de toque duplicado, tratamento das falhas de escrita/exclusão e consumo único das intenções `restore`/`clean`.
- **Teste preventivo:** `node scripts/qa/check-reload-session-choice.mjs`, `node scripts/qa/test-reload-session-choice.mjs`, self-tests positivo/negativo e WebKit Smoke Tests; persistência integral e comportamento PWA exigem iPhone/Safari real.
- **Evidência publicada:** Roberto aprovou restaurar sessão e reiniciar do zero na E8H em iPhone/Safari/PWA; tela branca/HTML bruto não foi reproduzido e Preview, Export e Save/Load foram preservados.
- **Status:** validada no repositório de teste na `v8z4b32E8H`. Nenhuma promoção para produção está autorizada.

## REG-036 — Abertura normal restaura checkpoint sem escolha

- **Problema:** uma nova instância do aplicativo restaura silenciosamente a sessão automática anterior antes de o usuário decidir se quer retomá-la.
- **Prevenção:** sem intenção explícita da E8H, inspecionar e validar o checkpoint sem hidratação/aplicação; checkpoint válido abre modal próprio e não fechável, e somente a escolha aceita inicia restore ou clear aguardável.
- **Exceção:** intenções `restore` e `clean` consumidas pelo fluxo Recarregar da E8H mantêm prioridade e não mostram a pergunta de startup.
- **Como detectar:** confirmar launcher estável antes da escolha, nenhuma chamada antecipada de restore/hidratação/aplicação, exclusão concluída antes de confirmar launcher limpo e retomada da mesma instância sem novo diálogo.
- **Teste preventivo:** `node scripts/qa/check-startup-session-choice.mjs`, harness `node scripts/qa/test-startup-session-choice.mjs` executando os controladores reais extraídos do app, WebKit com checkpoint real no IndexedDB e teste real em iPhone/Safari/PWA.
- **Status:** proteção técnica adicionada na `v8z4b32E8I`; validação publicada em iPhone/Safari/PWA pendente.

## REG-037 — Parallax move seleção, mas não a imagem do Stage

- **Problema:** ao trocar o frame de referência no Modo Ativos, seleção/alças recalculam o offset de profundidade enquanto o elemento DOM da imagem conserva a posição anterior.
- **Prevenção:** imagem, seleção, alças e hit-test derivam exclusivamente de `resolveAssetStageVisualGeometry()`, e toda mudança observável da câmera do editor invalida e reaplica essa geometria sem alterar o modelo.
- **Como detectar:** comparar o delta do retângulo DOM da imagem e do contorno ao navegar entre frames com `depth != 0`; `worldX/worldY`, Undo e revisão de autosave devem permanecer inalterados.
- **Teste preventivo:** smoke WebKit E8O em `tests/smoke/app.spec.mjs`, diagnósticos `assetVisualGeometry*` e teste publicado em iPhone/Safari real.
- **Status:** proteção técnica adicionada na `v8z4b32E8O`; validação publicada pendente.

## REG-038 — Painel contextual oculto intercepta transformação de asset

- **Problema:** Escala/Rotação não abrem na região visível ou um painel anterior permanece invisível capturando toque.
- **Prevenção:** controlador contextual único mantém somente Escala, Rotação ou Profundidade aberto; painel fechado usa `display:none` e `pointer-events:none`.
- **Como detectar:** alternar os três botões e verificar título, visibilidade, interação e ausência de painel oculto capturando eventos.
- **Teste preventivo:** smoke WebKit E8O e validação táctil em iPhone/Safari real.
- **Status:** proteção técnica adicionada na `v8z4b32E8O`; validação publicada pendente.

## REG-039 — Checks obrigatórios ausentes em PR mobile/remota

- **Problema:** PRs abertas ou atualizadas por fluxo móvel, Codex remoto, GitHub App ou automação podem ficar sem `QA Guardrails` e `WebKit Smoke Tests` associados ao HEAD atual, mesmo com os workflows normais presentes.
- **Impacto:** Roberto passa a depender de desktop, terminal, GitHub CLI, token pessoal ou execução manual na aba Actions para obter checks obrigatórios.
- **Prevenção:** `Mobile CI Watchdog` varre PRs abertas contra `main`, ignora drafts e forks, compara o HEAD SHA atual com workflow runs e check-runs já existentes, e executa somente as suítes ausentes para o SHA corrente.
- **Metadados obrigatórios:** o watchdog deve transportar `title` e `body` reais da PR para `QA_PR_TITLE` e `QA_PR_BODY`; strings vazias quebram a validação de versão de PRs funcionais recuperadas pelo watchdog.
- **Como detectar:** PR aberta contra `main` cujo HEAD SHA não possua evidência de `QA Guardrails` ou `WebKit Smoke Tests`; resultado de SHA anterior não conta.
- **Teste preventivo:** `node scripts/ci/test-mobile-ci-watchdog.mjs`, integrado a `node scripts/qa/run-self-tests.mjs`, cobre ausência inicial, não duplicidade no mesmo SHA, novo SHA, resultado antigo e execução em andamento.
- **Status:** proteção OPS-04 em PR.

## REG-040 — Painel contextual de Ativo concorre com controle da toolbar inferior

- **Problema:** Escala, Rotação ou Profundidade abre somente na célula direita da faixa inferior enquanto o botão Edição da coluna esquerda permanece visível como um quadrado branco e comprime o painel.
- **Causa:** `asset-context-panel-open` ocultava apenas `#toolbar`; diferentemente de `cust-expanded` dos Frames, não expandia `#lowerContextSlot` pelas duas colunas e pelas duas linhas contextuais do grid. Além disso, `.asset-context-back` não neutralizava o estilo nativo do elemento `<button>`.
- **Prevenção:** o painel contextual de Ativo deve reutilizar a expansão estrutural do slot dos Frames, ocultar a toolbar normal e, fechado, usar `display:none` e `pointer-events:none`.
- **Teste preventivo:** smoke WebKit verifica ocupação das duas colunas, largura painel/slot, toolbar normal ausente no estado aberto e restauração sem interceptação após a seta Voltar.
- **Status:** proteção técnica adicionada na `v8z4b32E8P`; validação publicada em iPhone/Safari real permanece pendente.

## REG-041 — Painel contextual persistente, ações sem alvo e identidade visual regressiva

- **Problema:** painéis podiam sobreviver à troca de modo, ações de Ativo permaneciam acionáveis sem seleção, a toolbar residual continuava renderizada sob o painel, o ponto central usava medição paralela e Preview/Export pronto voltava ao verde.
- **Prevenção:** fechar os dois controladores contextuais no roteador central antes da troca; derivar todas as ações individuais de `getSelectedAsset()`; retirar a toolbar normal do estado visual aberto; compartilhar o eixo X canônico da faixa rolável; usar token ciano local de Preview/Export independente de `--accent` e `--green`.
- **Teste preventivo:** smoke WebKit em viewport mobile cobre exclusividade do painel, ausência de título/resíduo, disabled sem seleção, troca de modo, delta geométrico zero e token de Preview/Export.
- **Status:** proteção técnica adicionada e validada visualmente por Roberto em iPhone/Safari real na `v8z4b32E8Q`.

## REG-042 — Verde reaparece na interface do Arco

- **Problema:** elemento produzido pela interface do Arco passa a utilizar verde, apesar de verde não fazer parte da identidade cromática aprovada. A regressão pode surgir por token CSS legado, variável denominada `green`, estado genérico de sucesso/pronto, biblioteca, convenção semântica, reaproveitamento de código histórico, diagnóstico antigo ou interpretação incorreta da documentação.
- **Impacto:** regressão direta da identidade visual aprovada e risco de propagação de uma regra cromática inexistente para novos elementos.
- **Prevenção:** consultar `PRODUCT_RULES.md` antes de alterar cores; preservar as cores aprovadas; não mapear sucesso/pronto automaticamente para verde; não usar nomes técnicos históricos como autoridade de produto; manter Preview/Export pronto no ciano aprovado; exigir autorização explícita de Roberto para qualquer introdução futura de verde.
- **Como detectar:** inspecionar os elementos produzidos pela própria UI do Arco nos principais estados da aplicação e verificar se algum utiliza verde, excluindo da análise os pixels pertencentes aos assets/conteúdo do usuário.
- **Teste preventivo:** validação visual em iPhone/Safari real. Smoke/WebKit e inspeção de estilos podem servir como proteção complementar quando houver abordagem confiável e específica para o chrome do aplicativo. Não criar detector genérico de pixels verdes que possa confundir conteúdo do usuário com UI.
- **Status:** regra consolidada após aprovação visual da `v8z4b32E8Q`.

## E8Z — proteções da caixa de texto

- Projetos E8Y sem campos de caixa migram com fundo desligado e geometria visual anterior.
- Ativar fundo não pode alterar wrapping ou centro; seleção/hit-test devem usar o retângulo externo.
- A opacidade do fundo não pode reduzir a opacidade dos glifos; draft não pode alcançar persistência, Preview ou Export.

## E8Z — P1 de escala e histórico da caixa

- Percentual, slider, steps, Reset e alças devem escalar `boxWidth` e `fontSize` pelo baseline de conteúdo; nunca atribuir largura externa diretamente a `boxWidth`.
- Cor, opacidade, estilo e paddings da caixa integram o fingerprint canônico, para que Undo/Redo agendem checkpoints reais mesmo quando somente a caixa muda.

## REG-047 — Simulação de gesto por `page.mouse` em projeto hasTouch/isMobile

- **Problema:** os projetos Playwright de smoke (`playwright.config.mjs`) rodam com `isMobile:true` e `hasTouch:true`. Em WebKit mobile com `hasTouch`, `page.mouse.*` não dispara `pointerdown → pointermove` com captura de forma confiável, então qualquer passo que simule arrasto por mouse sobre um handler baseado em pointer events + `setPointerCapture` (pan do editor, alças de transformação de asset) não move nada. Além disso, no Modo Ativos um arrasto de um dedo sobre um asset é capturado pela seleção/movimento do asset (`handleStageAssetSelectPointer` → `stopImmediatePropagation`), nunca pelo pan; o gesto real que move o viewport nesse modo é o de **dois dedos** (navegação nativa por toque).
- **Impacto real detectado:** o teste `E9B` falhava na pré-condição `expect(panAfter).not.toEqual(panBefore)` (WebKit Smoke Tests) porque o pan por mouse nunca ocorria; as 17 asserções de paridade anteriores passavam.
- **Limitação decisiva do WebKit:** em WebKit/Safari não é possível construir `Touch`/`TouchEvent` por script (`TypeError: Illegal constructor`), então o gesto real de **dois dedos** — o único que move o viewport no Modo Ativos, já que um arrasto de um dedo sobre um asset é capturado pela seleção — não é simulável no smoke WebKit. Uma primeira tentativa com `new Touch()`/`new TouchEvent()` passou em Chromium mas falhou no check `WebKit Smoke Tests` exatamente por isso.
- **Correção do teste (sem tocar no app, aprovada por Roberto):** o passo de pan usa o helper `panEditorViewport()`, que aplica em `page.evaluate` o **mesmo efeito de câmera que o handler de pan do app executa** (`editorPanX/Y += delta; clampEditorPan(); applyEditorZoom();`, cf. `index.html`). O viewport é deslocado de verdade e re-renderizado pelo mesmo caminho; apenas o gatilho passa de gesto para código. Preserva integralmente `expectParity(panned)`, `depth` e `canonical`. Verificado em Chromium (`hasTouch`): pan real (`editorPanX/Y` mudam e sobrevivem ao clamp), paridade texto↔seleção mantida, `editorZoomScale` estável, seleção preservada e `_sessionAutosaveQueuedRevision` inalterado (operação apenas de câmera).
- **Prevenção:** em projeto `hasTouch`/`isMobile`, nunca simular gesto por `page.mouse` (não dirige handlers baseados em pointer events no WebKit mobile) nem por `new Touch()/new TouchEvent()` (proibido no WebKit). Para tocar/selecionar use `page.touchscreen.tap`; para efeitos que só um gesto multi-touch produziria e que o WebKit não deixa sintetizar, aplicar diretamente o efeito de estado equivalente do app (mesmo caminho de código), mantendo as asserções de verificação. Toda asserção de arrasto deve checar a mudança real esperada (delta), para não passar de forma vazia quando o input não dispara.
- **Casos duvidosos registrados (não corrigidos — decisão de Roberto pendente):**
  - `tests/smoke/app.spec.mjs:1735` (E8Z): arrasto por `page.mouse` numa asserção **negativa** (arrasto não deve abrir o editor de texto); pode passar de forma vazia se o mouse não dispara. Converter para toque real exige avaliar efeitos colaterais (mover asset/pan).
  - `tests/smoke/app.spec.mjs:1779` (E8Z P1): arrasto por `page.mouse` na alça de canto de asset (`beginAssetTransformDrag`, mesma classe pointer + `setPointerCapture`). As asserções checam apenas invariantes (`worldW≈boxWidth+2·paddingX`) e centro **inalterado**, sem exigir que a escala tenha realmente crescido — passa de forma vazia se o arrasto não dispara. Endurecer exige input por toque **e** asserção de delta real.
- **Caso seguro (sem ação):** `tests/smoke/app.spec.mjs:974` arrasta o `#scaleSlider` (`<input type="range">` nativo, tratado pelo próprio navegador) e afirma mudança de valor; passa de forma legítima.

## E9B — fragilidade latente: paridade glifos↔seleção depende da ORDEM DE CHAMADA do ciclo de render

- **Observação (registro apenas — não corrigir agora):** `renderAssetSelectionOverlay()` lê `worldW/worldH` do Text Asset via `resolveAssetStageVisualGeometry()` → `getAssetVisualWorldRect()`, **sem** chamar `measureTextAsset()`. A geometria correta depende de `renderProjectWorldExtraImages()` (que chama `measureTextAsset(a)`) ter rodado antes no mesmo ciclo. Hoje a paridade glifos↔seleção é garantida pela ORDEM DE CHAMADA, não por um contrato explícito.
- **Risco:** se alguém reordenar o ciclo de render no futuro, o Text Asset pode desalinhar (seleção/alças usando `worldW/worldH` desatualizados) sem causa aparente.
- **Endurecimento possível (backlog):** o overlay medir antes de resolver a geometria, ou centralizar a medição do Text Asset num único ponto que ambos os caminhos consumam.
- **Status:** somente registrado; nenhuma alteração de código de aplicação nesta passada.
