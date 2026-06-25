# Auditoria técnica — Regressão do Diagnóstico (v8z4b31N → v8z4b31S)

> Tipo: auditoria comparativa **read-only**. Nenhum código do app foi alterado.
> Nenhuma feature implementada, nenhum painel movido, nenhum PR funcional.
> Único artefato produzido: este relatório.

## Versões comparadas

Todas as 6 versões estavam disponíveis no histórico do git e foram comparadas
por **diff real** (não inferência):

| Versão | Commit | PR | Mensagem |
|--------|--------|----|----------|
| v8z4b31N | `ba3669d` | #374 | Fix viewport-fixed film alpha scrim |
| v8z4b31O | `c9c3bdd` | #375 | release v8z4b31O assets frame sync |
| v8z4b31P | `ad66334` | #376 | fix diagnostics menu and frame outlines |
| v8z4b31Q | `a50e870` | #377 | fix: restore diagnostics menu wiring |
| v8z4b31R | `a4bbb99` | #378 | fix diagnostics menu panel opening |
| v8z4b31S | `2dd53df` | #379 | restore real Debug Core diagnostics (no fallback) |

- **Versões ausentes:** nenhuma. Todas confirmadas por diff.
- **Conclusões confirmadas por diff:** itens 1–8 da causa raiz, linha do tempo e
  diff conceitual abaixo.
- **Inferências (marcadas no texto):** apenas o mapeamento sintoma-observado →
  trecho de código, já que não foi possível executar em Safari/iPhone nesta
  auditoria. Toda inferência é sustentada por análise estática determinística.

---

## 1. Resumo executivo

- **Causa principal:** um erro de **Temporal Dead Zone (TDZ)** dentro do coletor
  monolítico `buildDiagnosticsText()`. A v31O inseriu um bloco novo
  (`═══ v8z4b31O — Shared Camera/Assets Frame Timeline ═══`) que **usa** as
  constantes `_k_isAssetsMode` e `_k_highlightIdx` **antes** de suas declarações
  `const` originais, que ficavam mais abaixo na **mesma função**. Em JavaScript
  isso lança `ReferenceError: Cannot access '_k_isAssetsMode' before
  initialization` em **toda** chamada — de forma determinística, independente do
  estado do app.
- **Versão onde quebrou:** **v8z4b31O**. (O item de menu e `openDiagnosticsPanel()`
  ficaram idênticos à v31N; o que mudou foi o conteúdo do coletor.)
- **Impacto:** o coletor jogava exceção; como `openDiagnosticsPanel()` chama
  `refreshDiagnostics()` → `buildDiagnosticsText()` **antes** de `panel.classList.add('show')`,
  o painel nunca recebia a classe `show`. O Diagnóstico ficou inacessível.
- **Solução restaurada na v31S:** (a) **corrigiu o TDZ** movendo as declarações
  `const` para antes do bloco da v31O; (b) recriou o Diagnóstico como módulo
  protegido `window.AppDebug.{collect, open, copy, smokeTest}`, com leitura
  campo-a-campo protegida e o relatório rico anexado em `try/catch` **isolado**.
- **Risco de recorrência:** **médio-alto** enquanto o coletor de ~2000 linhas
  continuar monolítico e qualquer mudança em Settings/frames/scrim/timeline puder
  inserir código nele. O `smokeTest` da v31S reduz o risco, mas não impede um novo
  TDZ/lançamento dentro do relatório rico (ele só não derruba mais o núcleo).

> **Nota de precisão.** O comentário-cabeçalho da v31S afirma que a regressão
> começou na v31O "quando o onclick trocou para `handleDiagnosticsMenuClick()`".
> O diff prova que **o onclick só mudou na v31P** (na v31O ele era idêntico à
> v31N). A causa real na v31O foi o **TDZ no coletor**, não o roteamento do
> botão. O *fix* da v31S está correto (o comentário inline ao lado da correção
> descreve o TDZ com precisão); apenas a narrativa do cabeçalho está imprecisa.

---

## 2. Linha do tempo

### v31N — funcional (referência)
- **Botão:** `id="diagnosticsItem"`, `onclick="openDiagnosticsPanel();closeSettingsSheet()"`.
- **Painel:** `#diagnosticsPanel` (textarea `#diagText`) existe no HTML; abre por `.show`.
- **Coletor:** `buildDiagnosticsText()` íntegro; `_k_isAssetsMode` declarado **antes** de usar.
- **Fallback:** inexistente (não havia).
- **Observação:** caminho `onclick → openDiagnosticsPanel → refreshDiagnostics → buildDiagnosticsText` funcionava.

### v31O — quebrou
- **Botão:** **idêntico à v31N** (sem mudança).
- **Painel:** existe; `openDiagnosticsPanel()` **idêntico à v31N**.
- **Coletor:** **inserido o bloco "Shared Camera/Assets Frame Timeline"** que usa
  `_k_isAssetsMode`/`_k_highlightIdx` antes do `const` → **TDZ ReferenceError**.
- **Fallback:** inexistente.
- **Observação:** **aqui nasce a regressão.** O painel parou de abrir porque o
  coletor lança antes do `.show`.

### v31P — não resolveu (menu fechava, painel não abria)
- **Botão:** onclick passa a `handleDiagnosticsMenuClick(event)`.
- **Handler:** `closeSettingsSheet?.()` **primeiro**, depois `requestAnimationFrame`
  tentando uma **lista de nomes prováveis** (`openDiagnosticsPanel` /
  `openDiagnosticPanel` / `showDiagnosticsPanel` / `openPanel('Diagnostics')`).
- **Coletor:** **TDZ intacto.**
- **Observação:** `closeSettingsSheet()` roda síncrono (menu fecha); dentro do rAF,
  `openDiagnosticsPanel()` → `buildDiagnosticsText()` ainda lança → `.show` nunca
  ocorre. Resultado exato: **menu fecha, painel não abre.**

### v31Q — não resolveu (botão reage, painel não abre)
- **Botão:** `handleDiagnosticsMenuClick(event)`.
- **Handler:** removeu rAF e a lista de nomes prováveis; voltou à rota direta
  `openDiagnosticsPanel(); closeSettingsSheet();` (restaurou o "wiring").
- **Coletor:** **TDZ intacto.**
- **Observação:** `openDiagnosticsPanel()` lança em `refreshDiagnostics()` antes do
  `.show`. Botão reage, painel não abre. (E `closeSettingsSheet()` depois nem roda.)

### v31R — abriu só por fallback
- **Botão:** `id` muda para `diagnosticsMenuItem`; onclick `handleDiagnosticsMenuClick`.
- **Handler/painel:** `openDiagnosticsPanelHard()` **desacopla** a abertura da coleta —
  adiciona `.show` **incondicionalmente** após gravar o texto.
- **Coletor:** `getDiagnosticsTextHard()` embrulha `buildDiagnosticsText()` num
  `try/catch` **tudo-ou-nada** + lista de nomes prováveis. **TDZ intacto** → o
  `catch` dispara → retorna objeto `diagnosticFallback: true`.
- **Observação:** painel **abre** (desacoplado), mas exibe **fallback**, não o
  diagnóstico real. Também passou a exibir `#overlayBg` (`onclick=closeAll`) e
  `body.panel-open` — acoplamentos desnecessários.

### v31S — restaurado de verdade
- **Botão:** `id="diagnosticsMenuItem"`, `onclick="handleDiagnosticsMenuClick(event)"`
  → `window.AppDebug.open()`.
- **Painel:** `#diagnosticsPanel`/`#diagText`; abre sem `closeAll`, sem overlay, sem
  depender de `currentMode`/`activePanel`; fecha apenas o Settings.
- **Coletor:** **TDZ corrigido** (declarações movidas para cima; originais viraram
  comentário). `AppDebug.collect()` monta núcleo campo-a-campo com proteção
  individual e anexa `buildDiagnosticsText()` em `try/catch` **isolado**.
- **Fallback:** `false` (núcleo real); `diagnosticFallback:true` só em proteção
  extrema (app não carregado).
- **Observação:** `smokeTest` confirma `AppDebug`/`collect`/`open`/`copy` e a
  existência de painel/item de menu.

---

## 3. Diff conceitual

- **v31N → v31O:** o item de menu e `openDiagnosticsPanel()` ficam **inalterados**;
  é **inserido** o bloco de diagnóstico da v31O dentro de `buildDiagnosticsText()`,
  introduzindo o **uso-antes-da-declaração** (TDZ). *(Esta é a quebra.)*
- **v31O → v31P:** onclick → `handleDiagnosticsMenuClick`; fecha Settings antes e
  abre via `rAF` com lista de nomes prováveis. Coletor inalterado (TDZ persiste).
- **v31P → v31Q:** simplifica o handler (rota direta `openDiagnosticsPanel`, sem rAF
  nem lista). Coletor inalterado (TDZ persiste).
- **v31Q → v31R:** desacopla abertura da coleta (`openDiagnosticsPanelHard`),
  embrulha o coletor em `try/catch` tudo-ou-nada (`getDiagnosticsTextHard`) com
  saída `diagnosticFallback:true`; adiciona overlay + `panel-open`. Coletor
  inalterado (TDZ persiste → fallback).
- **v31R → v31S:** **corrige o TDZ** (move `const _k_isAssetsMode`/`_k_highlightIdx`
  para cima) **e** cria `window.AppDebug` (collect/open/copy/smokeTest); rotas
  legadas delegam ao módulo; remove dependência de overlay/`panel-open`/closeAll.

---

## 4. Mapa técnico do Diagnóstico (nomes/IDs reais)

- **Item de menu (DOM):** linha `settings-row` dentro do Settings.
  - id: `diagnosticsItem` (v31N–v31Q) → `diagnosticsMenuItem` (v31R, v31S).
  - **Sem** `data-action`, **sem** `addEventListener`, **sem** delegação por
    touch/click. Apenas **`onclick` inline**.
  - **Não há conflito touch/click** — só existe o `onclick`.
- **Handler:** `openDiagnosticsPanel()` (N/O) → `handleDiagnosticsMenuClick(event)`
  (P em diante). Em P/Q/R/S usa `preventDefault`/`stopPropagation`
  (+ `stopImmediatePropagation` em R/S).
- **Funções de coleta/abertura:**
  - Coletor real: **`buildDiagnosticsText()`** (existe e tem o mesmo nome em
    **todas** as versões; **nunca** foi removido, renomeado, movido para escopo
    local nem retirado de acesso). Os nomes `buildDiagnosticsReport`,
    `collectDiagnostics`, `getDiagnosticsText`, `generateDiagnosticsReport` **nunca
    existiram** — foram apenas "chutes" na lista de nomes prováveis de P/R.
  - Abertura: `openDiagnosticsPanel()` (N–Q), `openDiagnosticsPanelHard()` (R),
    `window.AppDebug.open()` (S).
  - Alimentação do texto: `refreshDiagnostics()` → `#diagText`.
- **Painel:** `#diagnosticsPanel` (existe no HTML em todas as versões; **não** é
  criado dinamicamente no fluxo real — a v31R só criaria via `createElement` se o
  `#diagnosticsPanel` não existisse, o que nunca ocorre). Textarea real `#diagText`;
  dica `#diagHint`. Abre por classe **`.show`**; fecha por remover `.show`.
  **Não possui a classe `.float-panel`** → `closeAll()` (que remove `.show` de
  `.float-panel`) **nunca** fechou o Diagnóstico.
- **Overlay:** `#overlayBg` (`onclick="closeAll()"`). Acoplado ao Diagnóstico
  **apenas na v31R** (removido na v31S).
- **smokeTest:** existe só a partir da **v31S** — `window.AppDebug.smokeTest()`
  retorna `appDebugExists`, `collectExists`, `openExists`, `copyExists`,
  `diagnosticsPanelExists`, `diagnosticsMenuItemExists`, `fallback:false`.

---

## 5. Causa raiz

- **O que quebrou:** o coletor `buildDiagnosticsText()` passou a lançar exceção
  em toda execução.
- **Por que quebrou:** o bloco inserido na **v31O** usa `_k_isAssetsMode` e
  `_k_highlightIdx` **acima** de suas declarações `const` na mesma função (TDZ).
  Evidência por linha (v31O, escopo de `buildDiagnosticsText`):

  ```
  uso:        const _o_cameraCenter = !_k_isAssetsMode ? ...   // ~linha 1854 (rel.)
  uso:        ... _o_scrimIdx === _k_highlightIdx ...           // ~linha 1869 (rel.)
  declaração: const _k_isAssetsMode = ...                       // ~linha 1891 (rel.)
  declaração: const _k_highlightIdx = ...                       // ~linha 1934 (rel.)
  ```

  `let`/`const` **não** sofrem hoisting com inicialização: usar antes da linha do
  `const` lança `ReferenceError: Cannot access 'X' before initialization`.
- **Por que o botão reagia mas não abria:** o handler **executava** (toque
  registrado, `preventDefault` rodando), porém `openDiagnosticsPanel()` chama
  `refreshDiagnostics()` → `buildDiagnosticsText()` **antes** de
  `panel.classList.add('show')`. A exceção interrompe a função antes do `.show`,
  então o painel nunca aparece. **Nunca foi conflito touch/click** (só há `onclick`)
  — foi uma exceção de JS abortando a abertura. *(Esta é a única ponte
  sintoma→código que é inferência; é sustentada por análise estática determinística.)*
- **Por que o fallback apareceu (v31R):** a v31R envolveu o coletor num `try/catch`
  tudo-ou-nada. Como `buildDiagnosticsText()` continuava lançando o TDZ, o `catch`
  capturava e devolvia `diagnosticFallback:true` — o painel abria (a abertura foi
  desacoplada), mas sem o diagnóstico real.
- **Por que a correção final funcionou (v31S):** removeu a causa (TDZ) **e**
  blindou a coleta: o núcleo é montado campo-a-campo com proteção individual e o
  relatório rico (`buildDiagnosticsText`) é anexado em `try/catch` **isolado** —
  uma falha do relatório rico não apaga o núcleo nem reintroduz fallback.

---

## 6. Acoplamentos perigosos encontrados

1. **Coletor monolítico no caminho de abertura.** `openDiagnosticsPanel()` chama
   `buildDiagnosticsText()` **antes** do `.show`. Qualquer exceção no coletor de
   ~2000 linhas impede a abertura do painel. *(Causa direta da regressão.)*
2. **`onclick` inline encadeado** (`openDiagnosticsPanel();closeSettingsSheet()`):
   se a primeira função lança, a segunda não roda — comportamento de
   menu/painel acoplado e frágil.
3. **Settings ↔ Diagnóstico:** mudanças no painel Settings/overlay alteram a ordem
   e a interação com a abertura do Diagnóstico (visível em P/Q/R).
4. **Overlay/`closeAll`/`panel-open` (v31R):** Diagnóstico passou a depender de
   `#overlayBg` e `body.panel-open`. `#diagnosticsPanel` **não** é `.float-panel`,
   então `closeAll()` não o fechava — acoplamento sem função, só risco. Removido na v31S.
5. **Estado de frames/scrim/timeline/assets dentro do coletor:** o bloco da v31O lê
   muito estado novo (`getTimelineStageFocusIndex`, `assetsModeFrameReferenceHighlightIndex`,
   `filmAlphaScrimCutoutFrameIndex`, opacidades/strokes de frame etc.). Mesmo após o
   fix do TDZ, esse acoplamento mantém o relatório rico sensível a mudanças nessas áreas.
6. **Layers como função solta do menu superior (registro de produto):** não causou
   esta regressão, mas é um acoplamento a evitar. *(Não corrigir/mover agora.)*

---

## 7. Recomendações preventivas

- Manter **`window.AppDebug` como módulo protegido** e como **única** rota do botão.
- O Diagnóstico **não deve depender** de `currentMode`, `activePanel`, Layers nem
  do estado de Modo Ativos para abrir.
- **Nunca** chamar `closeAll()` depois de abrir o Diagnóstico; fechar apenas o
  Settings, se necessário.
- **Separar coleta de abertura:** o painel deve abrir mesmo que a coleta falhe
  (padrão já adotado na v31S; manter).
- Coletar **campo-a-campo com proteção individual** e anexar o relatório rico em
  `try/catch` **isolado** (manter o padrão da v31S). Idealmente, quebrar
  `buildDiagnosticsText()` em sub-blocos com `try/catch` por bloco.
- **Evitar listas genéricas de nomes prováveis** de funções — usar a rota real e
  explícita (`buildDiagnosticsText`/`AppDebug.collect`).
- **`smokeTest` obrigatório** para painéis críticos; o do Diagnóstico deve exigir
  `fallback:false` com app carregado.
- **Toda versão valida o Diagnóstico antes da aprovação.** Toda alteração em
  Settings/overlay/painéis/frames/scrim/timeline deve testar o Diagnóstico.
- **Lint/CI contra TDZ:** ativar regra estática (ex.: `no-use-before-define` para
  `const`/`let`) que pegaria exatamente este bug em build, sem depender de teste manual.

---

## 8. Checklist de regressão obrigatório (próximas versões)

- [ ] Abrir o app com imagem/projeto carregado.
- [ ] Abrir o Diagnóstico.
- [ ] Confirmar `fallback: false` (e `diagnosticFallback` ausente).
- [ ] Copiar o diagnóstico (verificar mensagem de sucesso).
- [ ] Alternar para **Modo Câmera**.
- [ ] Alternar para **Modo Ativos**.
- [ ] Abrir o Diagnóstico **nos dois modos**.
- [ ] Abrir e fechar o **Settings** e reabrir o Diagnóstico.
- [ ] Rodar um **Preview curto**.
- [ ] Rodar um **Export curto** (quando houver mudança em render/export).
- [ ] Confirmar que o Diagnóstico **continua funcionando após Preview/Export**.

---

## 9. Próxima ação recomendada

**Recomendado: uma etapa intermediária `v31T` — endurecimento estrutural
preventivo do Diagnóstico, sem novas features.**

Justificativa: a v31S já restaurou o Diagnóstico real e o `smokeTest`, mas a
fragilidade estrutural (coletor monolítico de ~2000 linhas no caminho do painel,
acoplado a frames/scrim/timeline) permanece e foi o que permitiu a regressão. Uma
`v31T` mínima deveria:

1. Adicionar regra de lint anti-TDZ (`no-use-before-define`) ao CI.
2. Sub-dividir `buildDiagnosticsText()` em blocos com `try/catch` por bloco
   (sem mudar saída visível), para que um bloco com erro nunca derrube os demais.
3. Formalizar o checklist da seção 8 como gate de aprovação.

Só **depois** disso seguir para `v32A` (botões de modo contextuais / Layers ligado
ao Modo Ativos), que é mudança de produto e mexe nas áreas mais acopladas ao
coletor — exatamente o cenário de maior risco de reintroduzir a regressão.

---

## Critério de sucesso — respostas diretas

1. **Qual mudança quebrou o Diagnóstico?** A inserção, na **v31O**, do bloco
   "Shared Camera/Assets Frame Timeline" dentro de `buildDiagnosticsText()`, que
   usa `_k_isAssetsMode`/`_k_highlightIdx` **antes** de suas declarações `const`
   (TDZ).
2. **Por que o botão reagia mas não abria?** O handler rodava, mas
   `openDiagnosticsPanel()` chama o coletor **antes** do `.show`; a exceção do
   coletor abortava a função antes de exibir o painel. Não houve conflito
   touch/click — só existe `onclick` inline.
3. **Por que a v31R abriu só fallback?** A v31R desacoplou a abertura (painel
   sempre recebe `.show`), mas embrulhou o coletor em `try/catch` tudo-ou-nada;
   como o TDZ continuava, caía em `diagnosticFallback:true`.
4. **O que a v31S restaurou?** Corrigiu o TDZ (declarações movidas para cima) e
   recriou o Diagnóstico como `window.AppDebug.{collect,open,copy,smokeTest}`, com
   coleta protegida campo-a-campo e relatório rico isolado → `fallback:false`.
5. **Como evitar que isso aconteça de novo?** Manter `AppDebug` como módulo
   protegido e rota única; separar coleta de abertura; nunca usar `closeAll` após
   abrir; lint anti-TDZ no CI; `smokeTest` obrigatório; e validar o Diagnóstico em
   toda alteração de Settings/overlay/painéis/frames/scrim/timeline antes da aprovação.
