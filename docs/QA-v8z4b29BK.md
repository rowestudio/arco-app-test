# QA pendente — v8z4b29BK: ícones Iconoir cinema-old e director-chair

- Base obrigatória: `v8z4b29BJ` (aprovada — ajustes finos de UI/UX e troca de ícones de Arquivos/Tempo, mas com formas próprias/aproximadas). Esta versão substitui apenas esses dois ícones pelos SVGs individuais e exatos do Iconoir, sem regressões em mais nada.

## O que mudou

### 1. Ícone de Arquivos no menu superior (Iconoir `cinema-old`)

- O símbolo `i-film-roll` (rolo de filme com bordas retas) foi substituído pelo símbolo `i-cinema-old`, com o SVG individual exato do ícone Iconoir `cinema-old` (4 pequenos círculos dispostos em cruz dentro de um círculo maior).
- O `<use>` do botão "Arquivos" no menu superior passa a referenciar `#i-cinema-old`.
- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"` mantidos, iguais aos demais ícones do topo.
- Função do botão (abrir painel de Arquivos), posição no topo, layout do `topBar`, tamanho visual, alinhamento, área de toque e lógica de estado ativo/inativo preservados.

### 2. Ícone de Tempo/Duração na 4ª linha do menu inferior (Iconoir `director-chair`)

- O conteúdo do símbolo `i-director-chair` foi substituído pelo SVG individual exato do ícone Iconoir `director-chair` (cadeira dobrável vista de lado, com pernas em X e assento/encosto).
- O `id="i-director-chair"` foi mantido, então os dois `<use href="#i-director-chair">` (botão "Tempo" da `lower-global-duration` e item "Duração" da 4ª linha contextual) continuam funcionando sem alteração de marcação.
- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"` mantidos, iguais aos demais ícones da linha.
- Função dos botões (abrir painel de Duração), texto ("Tempo"/"Duração"), posição, layout da 4ª linha, tamanho, alinhamento, área de toque e lógica de estado ativo/inativo preservados.

### 3. Implementação técnica

- Apenas os dois SVGs individuais (`cinema-old` e `director-chair`) foram copiados do Iconoir e adaptados inline como `<symbol>` no `<svg>` de sprites do app.
- Nenhuma biblioteca Iconoir foi importada, nenhum CDN foi adicionado, nenhuma dependência externa foi criada.

## QA manual pendente v8z4b29BK

1. Versão visível mostra `v8z4b29BK` (texto de versão, comentário do topo, `APP_VERSION`/`APP_VERSION_NAME`, CHANGELOG).
2. O ícone do botão "Arquivos" no menu superior é o ícone Iconoir `cinema-old` (círculo grande com 4 pequenos círculos internos em cruz), não mais o rolo de filme retangular anterior.
3. Tocar no ícone de Arquivos abre o painel de Arquivos normalmente (função preservada).
4. O ícone de Arquivos mantém tamanho, alinhamento, cor e área de toque coerentes com os demais ícones do topo (Voltar, Visualizar, Preview, Undo/Redo).
5. Posição do botão de Arquivos e layout geral do menu superior inalterados.
6. O ícone do item "Tempo" (botão de Duração geral, `.lower-global-duration`) na 4ª linha do menu inferior é o ícone Iconoir `director-chair` (cadeira dobrável vista de lado).
7. O ícone do item "Duração" contextual (4ª linha, seleção de frame) também é o ícone Iconoir `director-chair`, igual ao do botão "Tempo".
8. Tocar no ícone de "Tempo"/"Duração" abre o painel de Duração normalmente (função preservada).
9. Texto "Tempo"/"Duração" ao lado do ícone permanece inalterado.
10. O ícone de Tempo/Duração mantém tamanho coerente com os demais ícones da 4ª linha (Pausa, Rotação, Escala, Mover, Movimento), alinhamento vertical/horizontal correto e área de toque preservada.
11. Posição do item Tempo/Duração e layout geral da 4ª linha inalterados.
12. Estado ativo/inativo dos dois ícones (cor via `currentColor`, destaque ao selecionar) coerente com o restante do app.
13. Nenhum outro ícone do app foi alterado (verificar topo, menus inferiores, contextuais de frame/trecho, launcher).
14. Fluxo launcher → Novo Projeto → editor continua funcionando sem regressões.
15. Stage, timeline, largura de frames/trechos, snap e bolinhas continuam inalterados.
16. Toast/aviso de bloqueio de frame continua funcionando como na v8z4b29BJ.
17. Painel de Duração (conteúdo, sliders, comportamento) continua igual.
18. Preview continua funcionando normalmente.
19. Export MP4 continua funcionando normalmente.
20. Salvar/Abrir JSON continuam funcionando normalmente.
21. Funciona no iPhone/Safari, sem regressões visuais (ícones nítidos, sem corte, sem deslocamento).

## Áreas preservadas (não alteradas)

- Stage, timeline, largura dos frames/trechos, snap, bolinhas.
- Toast de bloqueio, painel de Duração, bloqueios de interface.
- Launcher/página inicial, fluxo Novo Projeto.
- Preview, export MP4, JSON, motor, templates, formato.
- Todos os demais ícones do app, exceto `i-cinema-old` (Arquivos) e `i-director-chair` (Tempo/Duração).
