# QA — v8z4b29K

## Escopo

- Corrigir visual/UX/layout da área inferior da v8z4b29J.
- Preservar motor de Preview, MP4/export, JSON schema e cálculos reais de frames, curvas, paths, easing, velocidade, renderização e interpolação.

## Checklist estático

- [x] Base `v8z4b29J` confirmada antes das alterações.
- [x] Versionamento atualizado para `v8z4b29K` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível e comentários/changelog do topo.
- [x] Área inferior continua em 2 colunas e 4 linhas, sem scroll vertical interno.
- [x] Submenus de Pausa, Rotação, Escala e Mover ocupam a Linha 4 / Coluna 2 via `#lowerContextSlot`, substituindo os ícones contextuais sem novo bloco vertical.
- [x] Coluna 1 mantém tempo total, botão `+ frame`, total de frames e botão global `Tempo`, com padding interno compacto.
- [x] Botão `+ frame` usa `var(--accent)`, mantém aspecto circular e ícone centralizado.
- [x] Frames da timeline ficam mais proporcionais, com borda mais espessa e estado ativo/selecionado em azul/ciano oficial.
- [x] Trechos ficam mais discretos e encostados visualmente nos frames, com hit area invisível preservada.
- [x] Tipografia da área inferior foi equalizada e o texto redundante `Frame ativo` foi removido da Linha 3.
- [x] Padding inferior dos painéis contextuais fica compacto, usando apenas a safe area mínima da grade inferior.

## Checklist manual obrigatório

- [ ] iPhone/Safari: abrir Pausa, Rotação, Escala e Mover e confirmar que timeline, tempos, Coluna 1 e botão `Tempo` permanecem fixos.
- [ ] iPhone/Safari: selecionar trecho, abrir Tempo/Movimento de trecho e confirmar encaixe inferior sem espaço morto exagerado.
- [ ] iPhone/Safari: validar botão `+`, timeline conectada, frame ativo ciano e toque em trechos.
- [ ] Regressão: Preview, MP4/export, JSON salvar/abrir, Undo/Redo, seleção de frame/trecho/múltipla seleção, upload, reset.

## Limitações do ambiente

- Não houve validação em iPhone/Safari real neste ambiente automatizado.
- Não houve geração real de MP4 neste ambiente automatizado.
