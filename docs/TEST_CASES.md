# TEST_CASES

Formato: pré-condição, passos, resultado esperado, evidência, ambiente e automatizável.

## TC-001 — Abertura do app

- Pré-condição: app publicado ou servido localmente.
- Passos: abrir o app.
- Resultado esperado: app carrega sem erro fatal.
- Evidência: screenshot e console.
- Ambiente: desktop e iPhone/Safari quando aplicável.
- Automatizável: sim.

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
