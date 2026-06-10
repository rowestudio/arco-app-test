# QA pendente — v8z4b29BG: separa launcher, Novo Projeto e editor/Stage em estados explícitos

> Base: v8z4b29BF (não aprovada — entrada inicial e fluxo de Novo Projeto continuavam presos ao Stage).

## Escopo v8z4b29BG

- Introduz estado explícito de tela (`launcher` / `newProject` / `editor`); Stage/timeline/toolbar só existem em modo `editor`.
- Recarregar o app sempre volta ao launcher; nunca restaura Stage, projeto, imagem ou frames anteriores.
- Etapa final de imagem do Novo Projeto vira tela própria do fluxo (Fototeca/Tirar Foto/Escolher Arquivo), visível mesmo com o seletor nativo aberto — cancelar nunca expõe o Stage.
- Cancelar o Novo Projeto nunca deixa o app em Stage vazio: volta ao launcher (origem launcher) ou restaura o editor intacto (origem editor, projeto ainda válido).
- Preserva editor, Stage, timeline, templates, Preview/export, JSON e motor.

Checklist detalhado: ver `docs/QA-v8z4b29BG.md`.

---

# QA pendente — v8z4b29BF: launcher simples Novo Projeto / Abrir Projeto

> Base: v8z4b29BE (não aprovada — fluxo Novo Projeto: Formato → Template → Imagem → Criar).

## Escopo v8z4b29BF

- Substitui a tela inicial antiga "Imagem / Projeto" (entrada principal sem projeto carregado) por uma entrada simples com duas opções: "Novo Projeto" e "Abrir Projeto".
- "Novo Projeto" na entrada inicial abre o fluxo já existente Formato → Template → Imagem → Criar.
- "Abrir Projeto" na entrada inicial abre o seletor de JSON/projeto salvo, preservando o fluxo atual de abrir JSON.
- No editor, o menu superior mantém "Novo Projeto" e "Abrir"; ao tocar em qualquer um deles com um projeto aberto, exibe aviso de possível perda (Cancelar/Continuar) antes de prosseguir.
- Não cria Home completa, comunidade, recentes, perfil, conta, galeria, dashboard ou onboarding novo.

Checklist detalhado: ver `docs/QA-v8z4b29BF.md`.

---

# QA pendente — v8z4b29BE bugfix: sincronização final do Novo Projeto com template

> Base: v8z4b29BD (não aprovada — fluxo Novo Projeto: Formato → Template → Imagem → Criar).

## Escopo v8z4b29BE

- Corrige `applyTemplate()` (Pan, Zoom in/out, Pan ↓, Rotação, Círculo): referência a um elemento `#tbTemplate` inexistente lançava `TypeError` e interrompia a função antes de `renderAll()`/`finalizeTemplateApply()`.
- Resultado da correção: Novo Projeto com qualquer template nasce com frames, contador, timeline, Stage, frame ativo e curvas sincronizados imediatamente — sem precisar adicionar outro frame.
- Reset Project após Novo Projeto com template volta corretamente ao estado inicial desse novo projeto.
- Não altera fluxo visual do painel Novo Projeto, ordem Formato → Template → Imagem, layout aprovado, motor, Preview/export, JSON ou curvas.

Checklist detalhado: ver `docs/QA-v8z4b29BE.md`.

---

# QA pendente — v8z4b29BD Novo Projeto: Formato → Template → Imagem → Criar

> Base preservada: v8z4b29BC (ajustes finos do frame ativo + menu superior, "Novo Projeto" simples imagem→criar).

## Escopo v8z4b29BD

- Evolui "Novo Projeto" para um fluxo interno de pré-configuração: Formato → Template → Imagem → Criar, sem reintroduzir Home/página inicial/comunidade/recentes/perfil.
- Painel interno permite escolher Formato (chips existentes) e Template (incluindo "Sem template") em estado temporário, sem afetar o projeto atual.
- "Escolher imagem e criar" abre o seletor de imagem (JPG/PNG/WebP); o projeto atual só é substituído após a imagem carregar com sucesso.
- Novo projeto não herda frames/curvas/pausas/durações/seleção/vínculo com JSON do projeto anterior; aplica formato e template escolhidos imediatamente (F1 ativo se "Sem template", ou frames do template).
- Reset Project após Novo Projeto volta ao estado inicial desse novo projeto (imagem + formato + template), nunca ao JSON/projeto anterior.
- Preserva: frame ativo/HUD/abas/cruz central/clamp (v8z4b29BC), timeline/menu inferior, curvas/Bézier, Preview/export/MP4, JSON, motor.

Checklist detalhado: ver `docs/QA-v8z4b29BD.md`.

---

# QA pendente — v8z4b29BC ajustes finos do frame ativo + menu superior

> Base preservada: v8z4b29BB (remoção do pill do frameHud).

## Escopo v8z4b29BC

- Aproximar e realinhar a faixa superior (frameHud) do frame ativo em relação à moldura e às abas superiores.
- Reduzir o padding interno da faixa superior, preservando o espaçamento entre pausa/rotação/escala.
- Diminuir o tamanho visual das 4 abas/pontos circulares do frame ativo, preservando o centro e a área de toque.
- Tornar a cruz central do frame ativo escalável com o tamanho do frame (clamp suave).
- Reorganizar o menu superior em 4 colunas.
- Renomear "Novo arquivo" para "Novo Projeto" e mover para a linha final de arquivos (Salvar, Novo Projeto, Abrir, Recarregar).
- Preservar: motor, timeline/menu inferior, Preview/export/MP4, JSON, curvas/Bézier, clamp de criação de frames, Novo Projeto guiado/Home, lógica dos handles/abas.

## QA manual pendente v8z4b29BC

1. Versão visível mostra `v8z4b29BC`.
2. A faixa superior (frameHud) do frame ativo está visivelmente mais próxima da borda superior da moldura.
3. A faixa superior está melhor alinhada horizontalmente com os 2 pontos/abas superiores.
4. O padding da faixa superior está mais enxuto, mas pausa/rotação/escala continuam legíveis e com espaçamento claro entre si.
5. As 4 abas/pontos circulares estão visivelmente menores.
6. O centro de cada aba/ponto permanece exatamente na mesma posição de antes (sem deslocamento).
7. A área de toque das abas continua confortável no iPhone (mínimo 44px).
8. A cruz central aumenta/diminui ao escalar o frame (aumentar e diminuir o frame ativo via abas).
9. A cruz permanece centralizada e não interativa.
10. O menu superior (overlay de ajustes/arquivos) exibe os itens em 4 colunas.
11. O item "Novo arquivo" não existe mais; em seu lugar há "Novo Projeto".
12. "Novo Projeto" aparece na última linha de arquivos, na 2ª posição, logo após "Salvar".
13. A ordem da última linha de arquivos é: Salvar, Novo Projeto, Abrir, Recarregar.
14. Tocar em "Novo Projeto" abre o fluxo já existente de criação de novo projeto a partir de imagem, sem duplicidade.
15. Rotação do frame continua funcionando normalmente.
16. Escala do frame continua funcionando normalmente.
17. Arrastar aba inicia scale/rotate corretamente.
18. Arrastar o corpo do frame move normalmente.
19. Timeline/menu inferior não muda.
20. Preview/export/MP4 continuam funcionando.
21. JSON abre/salva normalmente.
22. Funciona no iPhone/Safari.

---

# QA pendente — v8z4b29BB microcorreção visual frame ativo

> Base preservada: v8z4b29BA (espaçamento HUD + redução visual das abas circulares).

## Escopo v8z4b29BB

- Remover aspecto de pill arredondado do fundo do texto superior (frameHud) do frame ativo.
- Remover pill separado de ângulo (.angle-indicator), mantendo o ângulo visível apenas no frameHud.
- Preservar: comportamento e conteúdo do frameHud, abas circulares, timeline/menu inferior, curvas, Preview/export, JSON, motor.

## Diagnóstico e implementação

1. `#frameHud` CSS: `border-radius:10px` → `border-radius:2px` — elimina o aspecto de cápsula/pill, mantém cantos levemente arredondados de forma discreta.
2. `.angle-indicator.show` CSS: `display:block` → `display:none` — pill separado de ângulo permanece oculto mesmo quando JS adiciona a classe `.show`; não há alteração em JS.
3. Nenhuma alteração em lógica de rotação, escala, motor, timeline ou fluxo de arquivos.

## QA manual pendente v8z4b29BB

1. Versão visível mostra `v8z4b29BB`.
2. Texto superior do frame ativo (frameHud) continua aparecendo com pausa, rotação e escala.
3. O fundo do frameHud não tem mais formato de pill/cápsula arredondado.
4. O pill separado de ângulo (.angle-indicator) não aparece durante rotação.
5. O valor de ângulo continua visível no frameHud durante e após rotação.
6. Rotação do frame continua funcionando normalmente.
7. Escala do frame continua funcionando normalmente.
8. Arrastar aba inicia scale/rotate corretamente.
9. Arrastar o corpo do frame move normalmente.
10. As 4 abas circulares permanecem visualmente inalteradas.
11. Timeline/menu inferior não muda.
12. Preview/export/MP4 continuam funcionando.
13. JSON abre/salva normalmente.
14. Funciona no iPhone/Safari.

---
