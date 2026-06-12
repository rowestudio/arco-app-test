# QA — v8z4b29BT: aumenta ícones de frame/trecho no painel Edição de Tempo

> Base: **v8z4b29BS** (reorganização do painel Edição de Tempo, ícones de
> frame/trecho na lista e nos filtros, painel contextual de Tempo do trecho
> compactado, resumo/Velocidade Constante ajustados).
> Objetivo: ajuste **visual pontual** — aumentar em ~50% os ícones de frame e
> trecho na lista do painel Edição de Tempo (aba Tempo), que ficaram pequenos
> demais para projetos com muitos frames (20, 30 ou mais), e ampliar a coluna
> reservada a eles para manter o layout equilibrado. Sem mudança de lógica,
> motor, JSON, Preview, export, Stage, timeline ou estrutura dos painéis.

---

## 1. O que mudou (apenas apresentação)

### 1.1 Ícones de frame e trecho na lista (Cena 1)

- `.seq-icon-frame` (ícone de frame, `i-seq-frame`): de `26×26px` para
  `39×39px` (~+50%). `.seq-icon-num` (número do frame, sobreposto ao ícone)
  de `10px` para `14px`, continua centralizado dentro do ícone via
  `position:absolute` sobre o SVG.
- `.seq-icon-segment` (ícone de trecho, `i-seq-segment`, segmento com dois
  círculos): de `26×14px` para `39×21px` (~+50%). `.seq-icon-seg-num`
  (número do trecho, acima do ícone, ex. "1–2") de `9px` para `13px`.
- `buildFramePauseRow(i)`/`buildSegDurationRow(seg)`: nenhuma alteração de
  estrutura/markup, apenas os tamanhos definidos em CSS (`.seq-icon-*`,
  `.seq-icon-num`, `.seq-icon-seg-num`) foram ajustados.

### 1.2 Coluna reservada aos ícones

- `.dur-edit-row > .dur-edit-icon-label` (coluna esquerda que contém o
  ícone + número): `min-width` de `34px` para `50px`, `gap` de `2px` para
  `3px`, para acomodar o ícone maior sem encostar no slider
  (`.dur-slider`, filho direto do mesmo `.dur-edit-row`, mantém
  `flex:1 1 0`) e sem empurrar `.dur-edit-value` (valor em segundos,
  `min-width:48px`, inalterado) para fora da área visível.
- `.dur-edit-row` (`gap:12px`, `padding:14px 0`) inalterado — altura das
  linhas não aumenta além do necessário para o ícone maior.

### 1.3 Ícones nos filtros Frames/Trechos

- `.cena1-filter .seq-icon-frame`/`.seq-icon-segment`: de `16×16px` para
  `20×20px` (ajuste leve). `.cena1-filter .seq-icon-frame .seq-icon-num`
  de `8px` para `10px`.
- `.cena1-filter` (`min-height:34px`, padding) inalterado — altura dos
  botões Todos/Frames/Trechos não aumenta.
- Design system de abas principais (`.ds-tab-bar`/`.ds-tab`,
  Tempo/Preferências) não foi tocado.

---

## 2. O que NÃO mudou (preservação)

- Estrutura/markup de `buildFramePauseRow`/`buildSegDurationRow`:
  ícone de frame com número **dentro**; ícone de trecho com número
  **acima** + segmento com dois círculos nas extremidades.
- Sliders (`.dur-slider`), valores (`.dur-edit-value`), `syncSegRowsFromState`,
  `renderFramePauseRows`, `setCena1Filter`/`applyCena1Filter`.
- Painel contextual de Tempo do trecho (`#panelSegTime`) e Movimento
  (`#panelEase`), Tremor (Global e por trecho), Stage, timeline, frames/
  trechos no Stage, curvas/Bézier, seleção simples/múltipla.
- Resumo de duração, Velocidade Constante, abas Tempo/Preferências.
- Preview, export MP4, JSON (antigo e novo), templates, formato, launcher,
  logo, ícone iOS, motor de renderização.

---

## 3. Checklist de aceite

1. [ ] A versão visível mostra **v8z4b29BT** (`APP_VERSION` +
   `APP_VERSION_NAME` + texto de versão nos Ajustes).
2. [ ] Ícones de **frame** na lista de Edição de Tempo estão visivelmente
   maiores (~50%) que na v8z4b29BS.
3. [ ] Ícones de **trecho** na lista de Edição de Tempo estão visivelmente
   maiores (~50%) que na v8z4b29BS.
4. [ ] O número do frame continua **dentro** do ícone de frame, centralizado.
5. [ ] O número do trecho continua **acima** do ícone de trecho.
6. [ ] O ícone de trecho continua sendo um segmento com dois círculos nas
   extremidades.
7. [ ] Números de frame com dois dígitos (10, 12, 24, 30, 31) ficam legíveis
   dentro do ícone, sem estourar para fora.
8. [ ] Trechos com dois dígitos (10–11, 12–13, 24–25, 30–31) ficam legíveis
   acima do ícone, sem ficar espremidos.
9. [ ] O ícone (frame ou trecho) não encosta no slider ao lado.
10. [ ] O valor em segundos continua visível à direita, dentro da área
    visível em iPhone/Safari.
11. [ ] A lista de Edição de Tempo continua rolando corretamente no
    iPhone/Safari (sem scroll horizontal indesejado).
12. [ ] Os ícones dos filtros **Frames** e **Trechos** estão levemente
    maiores, sem aumentar a altura dos botões nem confundir com as abas
    Tempo/Preferências.
13. [ ] Nenhum painel (Edição de Tempo, Tempo do trecho, Movimento,
    Preferências) muda de lógica ou estrutura.
14. [ ] **Preview** continua funcionando normalmente.
15. [ ] **Export MP4** continua funcionando normalmente.
16. [ ] **JSON antigo** continua abrindo.
17. [ ] **JSON novo** salva e reabre normalmente.
18. [ ] Sem regressões no Stage, timeline, Tremor (Global e por trecho) ou
    controles de duração/sliders.

---

## 4. Riscos e mitigação

- **Aumento de `.seq-icon-frame`/`.seq-icon-segment` e fontes internas**:
  alteração restrita às regras CSS já dedicadas a esses ícones (adicionadas
  na v8z4b29BS); nenhuma classe nova, nenhum markup novo — `buildFramePauseRow`/
  `buildSegDurationRow` permanecem idênticos.
- **Ampliação de `.dur-edit-icon-label` (coluna dos ícones)**: `min-width`
  maior reduz ligeiramente o espaço do `.dur-slider` (que é `flex:1 1 0`),
  mas o `gap:12px` do `.dur-edit-row` e o `min-width:48px` de
  `.dur-edit-value` não foram alterados, preservando a área de toque do
  slider e a visibilidade do valor em segundos.
- **Ícones dos filtros**: ajuste pequeno (16px → 20px) dentro de
  `.cena1-filter`, que já reservava espaço suficiente
  (`min-height:34px`, padding `7px 4px`) — não deve alterar a altura dos
  botões.
