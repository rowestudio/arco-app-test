# TEST_CASES

Formato: pré-condição, passos, resultado esperado, evidência, ambiente e automatizável.

## TC-001 — Abertura do app

- Pré-condição: app publicado ou servido localmente.
- Passos: abrir o app.
- Resultado esperado: app carrega sem erro fatal.
- Evidência: screenshot e console.
- Ambiente: desktop e iPhone/Safari quando aplicável.
- Automatizável: sim.
- Cobertura OPS-03: parcial; o smoke test WebKit abre `/`, valida render inicial básico e gera screenshot, sem substituir Safari/iPhone real.

## TC-002 — Ausência de textos técnicos visíveis

- Pré-condição: app aberto.
- Passos: navegar telas, menus e painéis principais.
- Resultado esperado: nenhum prompt, changelog ou bloco técnico aparece na UI.
- Evidência: screenshots e busca DOM.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-003 — Importação de imagem

- Pré-condição: app aberto sem projeto.
- Passos: importar uma imagem.
- Resultado esperado: imagem aparece e app entra no fluxo aprovado, mantendo Câmera/Frames.
- Evidência: screenshot.
- Ambiente: iPhone/Safari prioritário.
- Automatizável: parcial.

## TC-004 — Projeto com múltiplos assets

- Pré-condição: projeto com assets múltiplos.
- Passos: carregar ou montar projeto.
- Resultado esperado: todos os assets esperados aparecem.
- Evidência: contagem e screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: sim.

## TC-005 — Contagem modelo × Stage

- Pré-condição: projeto com múltiplos assets.
- Passos: comparar quantidade no modelo com Stage.
- Resultado esperado: Stage não omite asset visível esperado.
- Evidência: log/DOM/screenshot.
- Ambiente: desktop.
- Automatizável: sim.

## TC-006 — Seleção direta

- Pré-condição: Stage com asset/frame selecionável.
- Passos: tocar/clicar diretamente no Stage.
- Resultado esperado: item correto é selecionado.
- Evidência: screenshot e estado.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-007 — Seleção por Layers

- Pré-condição: painel Layers disponível com múltiplos assets.
- Passos: selecionar item por Layers.
- Resultado esperado: seleção sincroniza com Stage.
- Evidência: screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: sim.

## TC-008 — Reorder

- Pré-condição: múltiplos layers.
- Passos: reordenar layers.
- Resultado esperado: ordem visual e modelo ficam consistentes.
- Evidência: antes/depois.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-009 — Visibilidade

- Pré-condição: múltiplos layers.
- Passos: alternar visibilidade.
- Resultado esperado: Stage/Preview/Export respeitam visibilidade.
- Evidência: screenshots.
- Ambiente: desktop.
- Automatizável: parcial.

## TC-010 — Troca de imagem

- Pré-condição: asset existente.
- Passos: trocar imagem alvo.
- Resultado esperado: asset correto é substituído sem criar camada indevida.
- Evidência: contagem e screenshot.
- Ambiente: iPhone/Safari prioritário.
- Automatizável: parcial.

## TC-011 — Alternância Ativos/Câmera

- Pré-condição: projeto carregado.
- Passos: alternar entre Ativos/Mundo e Câmera/Frames.
- Resultado esperado: estado visual e seleção permanecem coerentes.
- Evidência: screenshots.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: sim.

## TC-012 — Frame central

- Pré-condição: projeto com frames.
- Passos: selecionar frame central.
- Resultado esperado: frame central destaca corretamente.
- Evidência: screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-013 — Diagnóstico

- Pré-condição: app aberto.
- Passos: abrir Diagnóstico.
- Resultado esperado: painel abre e não interfere no fluxo.
- Evidência: screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: sim.

## TC-014 — Save/Load

- Pré-condição: projeto com assets, layers e frames.
- Passos: salvar, recarregar e comparar.
- Resultado esperado: estado essencial é restaurado.
- Evidência: arquivo salvo e screenshots.
- Ambiente: desktop.
- Automatizável: sim.

## TC-015 — Preview

- Pré-condição: projeto válido.
- Passos: abrir Preview.
- Resultado esperado: Preview reproduz sem erro fatal.
- Evidência: screenshot/log.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-016 — Export

- Pré-condição: projeto válido.
- Passos: exportar MP4.
- Resultado esperado: arquivo é gerado ou falha é reportada de modo controlado.
- Evidência: arquivo/log.
- Ambiente: desktop e Safari quando aplicável.
- Automatizável: parcial.

## TC-017 — Consistência Preview/Export

- Pré-condição: Preview e Export executados.
- Passos: comparar frames amostrados.
- Resultado esperado: sem divergência visual relevante.
- Evidência: capturas comparadas.
- Ambiente: desktop.
- Automatizável: futuro.

## TC-018 — PNG com alpha

- Pré-condição: fixture PNG com transparência.
- Passos: importar e visualizar.
- Resultado esperado: alpha/scrim são preservados conforme comportamento aprovado.
- Evidência: screenshot.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-019 — Projeto com 14 ou mais frames

- Pré-condição: projeto fixture com 14+ frames.
- Passos: carregar, navegar timeline, Preview e Save/Load.
- Resultado esperado: frames e tempos permanecem consistentes.
- Evidência: screenshot/log.
- Ambiente: desktop.
- Automatizável: sim.

## TC-020 — Rotação, escala e movimento

- Pré-condição: projeto com frames editáveis.
- Passos: alterar rotação, escala e movimento.
- Resultado esperado: Stage, Preview e Export preservam a intenção.
- Evidência: screenshots/vídeo.
- Ambiente: desktop e iPhone/Safari.
- Automatizável: parcial.

## TC-021 — Console sem erro fatal

- Pré-condição: fluxo crítico em execução.
- Passos: abrir console durante abertura, load, preview e export.
- Resultado esperado: nenhum erro fatal não tratado.
- Evidência: log.
- Ambiente: desktop.
- Automatizável: sim.
- Cobertura OPS-03: parcial; o smoke test WebKit captura `pageerror` e `console.error` somente durante a abertura inicial, sem cobrir load, preview ou export.

## TC-022 — Escala global preserva curvas

- Pré-condição: projeto com Template Circular ou curva manual visível.
- Passos: editar curva manualmente, abrir escala, ativar Global e alterar escala.
- Resultado esperado: tamanho dos frames muda, mas a curva não se move, não reseta e não é recriada.
- Evidência: screenshot antes/depois e comparação do estado de curva.
- Ambiente: desktop e iPhone/Safari quando aplicável.
- Automatizável: sim.

## TC-023 — Escala após Load preserva curvas

- Pré-condição: projeto salvo com curva manual.
- Passos: carregar projeto, alterar escala de frame ou escala global.
- Resultado esperado: curva carregada permanece igual após ajuste de escala.
- Evidência: arquivo fixture, screenshot antes/depois e comparação do estado de curva.
- Ambiente: desktop e iPhone/Safari quando aplicável.
- Automatizável: sim.

## TC-024 — Pipeline principal de Export

- Pré-condição: projeto válido para exportação.
- Passos: revisar caminho de export e gerar MP4.
- Resultado esperado: export principal usa WebCodecs no caminho Canvas → VideoFrame → VideoEncoder → MP4; `captureStream + MediaRecorder` não substitui o pipeline principal.
- Evidência: inspeção estática, logs de export e arquivo gerado quando possível.
- Ambiente: desktop/Safari conforme suporte.
- Automatizável: parcial.

## TC-025 — Session Autosave/Restore integral

- Pré-condição: projeto complexo com múltiplas imagens, Layers persistentes, transformações, frames, curvas e tempos.
- Passos: editar; aguardar debounce; recarregar/descartar a página; reabrir; comparar estado; executar Preview e Export; fazer Load manual de outro projeto e recarregar; criar Novo Projeto e recarregar.
- Resultado esperado: somente checkpoint completo e íntegro é restaurado; todos os assets hidratam; identidades e `nextLayerSequence` permanecem; Load manual vira a sessão corrente; Novo Projeto elimina a sessão anterior.
- Evidência: diagnósticos Session Autosave/Restore, comparação do projeto e execução de Preview/Export.
- Ambiente: WebKit automatizado e iPhone/Safari real obrigatório para aprovação final.
- Automatizável: parcial; guardrail estático cobre arquitetura, integridade e precedência, mas o ciclo real permanece obrigatório.


## TC-026 — Primeiro frame do Preview confirmado antes do relógio

- Pré-condição: projeto simples válido no início da timeline.
- Passos: abrir o Preview; observar os primeiros segundos; fechar; repetir a abertura pelo menos três vezes.
- Resultado esperado: `t=0` é renderizado e composto antes do relógio/loop, loading só desaparece após a confirmação e não há travada inicial perceptível.
- Evidência: diagnósticos de ordem do warm-up e vídeo/observação das repetições.
- Ambiente: iPhone/Safari real obrigatório para aprovação visual; guardrail estático como evidência técnica complementar.
- Automatizável: parcial.

## TC-027 — Primeiro frame após Session Restore

- Pré-condição: projeto complexo restaurado por Session Restore, com múltiplos assets, frames e camadas íntegros.
- Passos: iniciar o Preview imediatamente após a restauração; fechar e reabrir três vezes; durante outra tentativa, fechar rapidamente no loading e abrir novamente.
- Resultado esperado: todos os assets permanecem visíveis; não há travada inicial; cancelamento invalida callbacks antigos e libera nova tentativa sem reload.
- Evidência: comparação do projeto, diagnósticos de token/retry e observação do Preview.
- Ambiente: iPhone/Safari real obrigatório.
- Automatizável: parcial.

## TC-028 — Isolamento Session Autosave × Preview/Export

- Pré-condição: projeto com checkpoint grande; fake timers/harness disponível para evidência automatizada.
- Passos: (1) editar e abrir Preview antes de 700 ms; (2) abrir/fechar Preview sem editar; (3) acumular várias mutações; (4) ocultar/disparar `pagehide` durante Preview; (5) repetir durante Export; (6) executar Session Restore, Novo Projeto e Load manual; (7) concluir escala e rotação pelos controles reais de canto do Frame, repetir com toque simples, retorno ao valor inicial, ghost e vários `pointermove`; (8) provocar saída por `recCanvas` inválido e erro de cleanup pós-export; (9) alterar o projeto, salvar, executar Reset e salvar novamente; (10) trocar 9:16 → 1:1 e tocar novamente em 1:1.
- Resultado esperado: nenhum build/write normal durante playback; após fechar, exatamente um checkpoint da revisão mais recente; Play não altera revisão; flush de segurança persiste; cada transformação real cria uma revisão somente ao soltar; saídas completas do Export retomam uma vez o checkpoint; Reset aplicado cria uma revisão com o baseline final, mas Reset sem diferença não cria; troca real de formato cria uma revisão depois da normalização, mas formato já ativo não cria Undo nem revisão.
- Evidência: `node scripts/qa/check-session-autosave-preview-isolation.mjs`, `node scripts/qa/test-session-autosave-preview-isolation.mjs` e diagnósticos `sessionAutosave*`.
- Ambiente: harness Node; WebKit CI; iPhone/Safari real obrigatório com projetos de 4 e 9 ativos para aprovação visual.
- Automatizável: parcial; concorrência lógica automatizada, percepção visual real pendente.

## TC-029 — Escolha de recarga e intenção de startup de uso único

- Pré-condição: launcher sem checkpoint e projeto complexo com checkpoint grande disponíveis em execuções separadas.
- Passos: abrir Recarregar pelo launcher e pelo menu; cancelar por X, toque fora e Escape; restaurar imediatamente após uma mutação; repetir com dois toques; reiniciar do zero; fechar e reabrir o PWA; simular falhas de escrita e exclusão no IndexedDB.
- Resultado esperado: nenhuma recarga ocorre sem escolha; restore preserva a última revisão completa; clean abre o launcher e a sessão antiga não reaparece; operações duplicadas são bloqueadas; falhas mantêm a tela atual e permitem nova tentativa; arquivos manuais não são alterados.
- Evidência: `node scripts/qa/test-reload-session-choice.mjs`, diagnósticos observáveis `reload*`, comparação integral do projeto, console sem erro fatal, inspeção visual de tela branca/HTML bruto e arquivo JSON manual ainda acessível.
- Ambiente: WebKit automatizado e iPhone/Safari/PWA instalado obrigatório para aprovação final.
- Automatizável: parcial; guardrail estático cobre a sequência arquitetural e WebKit cobre o modal, mas IndexedDB/PWA e preservação visual integral exigem teste real.

## TC-030 — Escolha de recuperação na abertura normal

- Pré-condição: execuções separadas sem checkpoint, com checkpoint íntegro, com checkpoint corrompido e com intenções explícitas `restore`/`clean` da E8H.
- Passos: abrir nova instância; observar launcher antes da escolha; testar Continuar, Começar novo projeto, falhas e toques concorrentes; recarregar após descarte; alternar para outro app e voltar com a mesma instância viva.
- Resultado esperado: somente checkpoint válido sem intenção E8H abre o modal; nenhuma hidratação/aplicação acontece antes da escolha; restore e clear executam uma vez e são mutuamente exclusivos; falhas permitem retry sem destruir o checkpoint; mesma instância viva não pergunta novamente.
- Evidência: `node scripts/qa/check-startup-session-choice.mjs`, `node scripts/qa/test-startup-session-choice.mjs` sobre funções reais extraídas do app, WebKit com IndexedDB/schema/store/chave/checksum reais, feedback “Recuperando sessão…”/“Preparando novo projeto…” e validação publicada em iPhone/Safari/PWA.
- Ambiente: harness Node, WebKit automatizado e iPhone/Safari/PWA real obrigatório para aprovação final.
- Automatizável: parcial; encerramento real do processo, persistência grande, arquivos manuais, Preview e Export exigem validação no aparelho.

## TC-031 — Inserção de várias imagens em uma operação

- Pré-condição: editor aberto com um projeto e Inserir imagem disponível.
- Passos: escolher um slot; selecionar em conjunto JPEG, PNG transparente, WebP e um arquivo inválido; observar Stage/Layers; executar Undo e Redo.
- Resultado esperado: formatos válidos entram na ordem selecionada, distribuídos a partir do slot escolhido, mantendo alpha do PNG, nomes `Camada N`, seleção e z-order; o inválido não cria asset; Undo/Redo trata o lote válido como uma operação.
- Evidência: `node scripts/qa/test-multi-image-insert.mjs`, contagem e inspeção de Stage/Layers.
- Ambiente: harness Node e iPhone/Safari real obrigatório para aprovação final.
- Automatizável: parcial; validação de assinatura, organização e guardas de histórico são automatizadas, picker/decodes reais e resultado visual exigem aparelho.
