# QA — v8z4b29BM

## Escopo

- Adicionar o logotipo do Arco Motion (`assets/brand/arco-logo-white.svg`) na tela inicial/launcher (`#startLauncher`), centralizado e acima dos botões "Novo Projeto", "Abrir Projeto" e "Recarregar".
- Configurar `apple-touch-icon` do iOS usando o asset local `assets/icons/apple-touch-icon.png`, mantendo `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` e ajustando `apple-mobile-web-app-title` para "Arco Motion".
- Renomear o rótulo do botão de Duração geral (4ª linha do menu inferior, ícone Iconoir `director-chair`) de "Tempo" para "Edição", sem alterar ícone, função ou painel aberto.
- Preservar Stage, frame ativo, sincronização frame ativo/timeline, timeline, launcher (exceto inclusão do logo), fluxo Novo Projeto/Abrir Projeto, Preview/export, JSON, templates e motor.

## Mudanças técnicas

- `index.html`: adiciona `<img class="launcher-logo" src="assets/brand/arco-logo-white.svg" alt="Arco Motion">` dentro de `.start-launcher-card`, antes de `.start-launcher-title`.
- `index.html`: adiciona regra CSS `.launcher-logo` (`display:block; width:min(220px, 62vw); height:auto; margin:0 auto 28px;`).
- `index.html` `<head>`: troca `<link rel="apple-touch-icon" href="data:image/svg+xml;base64,...">` por `<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">`; ajusta `<meta name="apple-mobile-web-app-title" content="Arco Motion">`. Mantém `apple-mobile-web-app-capable` e `apple-mobile-web-app-status-bar-style` inalterados.
- `index.html`: renomeia o `<span>` do botão `.lower-global-duration` (`onclick="openPanel('Duration')"`, ícone `#i-director-chair`) de "Tempo" para "Edição".
- `index.html`: atualiza `APP_VERSION`, `APP_VERSION_NAME`, texto visível de versão (`#appVersionText`/`#appVersionNameText`) e comentário/changelog do topo para `v8z4b29BM`.
- Renomeia o asset enviado `assets/icons/apple-touch-icon.png.png` para `assets/icons/apple-touch-icon.png` (correção de nome de arquivo, mesmo conteúdo PNG 180x180).

## Checklist estático

- [x] Base `v8z4b29BL` confirmada antes das alterações (`APP_VERSION`/`APP_VERSION_NAME` = `v8z4b29BL`, ícones `cinema-old`/`director-chair`, sincronização frame ativo/timeline, launcher separado do Stage, fluxo Novo Projeto/Abrir Projeto e Stage só com projeto funcional, todos presentes).
- [x] Versionamento atualizado para `v8z4b29BM` em `APP_VERSION`, `APP_VERSION_NAME`, texto visível de versão e comentário/changelog do topo.
- [x] `CHANGELOG.md` e `QA.md` atualizados.
- [x] Logo (`<img class="launcher-logo">`) inserido apenas em `#startLauncher`, usando `<img>` com caminho local, sem base64 e sem CDN/biblioteca.
- [x] `apple-touch-icon` aponta para `assets/icons/apple-touch-icon.png` (arquivo local, sem duplicar tags `apple-touch-icon`).
- [x] Item "Tempo" renomeado para "Edição" preservando ícone `director-chair`, `onclick="openPanel('Duration')"` e o painel de Duração.
- [x] Nenhuma mudança em Stage, frame ativo, visual do frame, abas/pontos, cruz central, faixa superior, timeline, largura de frames/trechos, snap, bolinhas, menus contextuais, ícones Iconoir já aprovados, fluxo Novo Projeto/Abrir Projeto (além do logo), Preview, export MP4, JSON, templates, motor ou seleção múltipla.

## Checklist manual obrigatório (iPhone/Safari)

- [ ] Abrir o app: launcher exibe o logo do Arco Motion centralizado, acima dos botões "Novo Projeto"/"Abrir Projeto"/"Recarregar", sem rolagem vertical extra e sem invadir a área segura do iPhone.
- [ ] Confirmar que o logo aparece somente no launcher (não aparece no Stage, na timeline nem em painéis internos).
- [ ] "Novo Projeto" continua funcionando normalmente (fluxo Formato → Template → Imagem → Criar).
- [ ] "Abrir Projeto" continua funcionando normalmente (seleciona JSON e abre o projeto).
- [ ] No menu inferior, o item antes chamado "Tempo" agora aparece como "Edição", com o ícone `director-chair` inalterado.
- [ ] Tocar em "Edição" abre o mesmo painel de Duração de antes, com os mesmos sliders/valores e comportamento.
- [ ] Preview continua funcionando normalmente.
- [ ] Export MP4 continua funcionando normalmente.
- [ ] Salvar/Abrir JSON continuam funcionando normalmente.
- [ ] Sincronização entre frame ativo no Stage e frame destacado na timeline (v8z4b29BL) permanece intacta.
- [ ] No Safari, usar "Adicionar à Tela de Início": o ícone do app exibido é o de `assets/icons/apple-touch-icon.png` e o nome exibido é "Arco Motion".

## Limitações do ambiente

- Não houve validação em iPhone/Safari real neste ambiente automatizado.
- Não houve teste real de "Adicionar à Tela de Início" neste ambiente automatizado.
- Não houve geração real de MP4 neste ambiente automatizado.

## Pendências / arquivos sinalizados

- `assets/brand/arco-symbol.svg` não existe no repositório (o arquivo presente é `assets/brand/arco=logo-symbol.svg`, com nome diferente do especificado). Não foi usado nesta versão (apenas `arco-logo.svg`/`arco-logo-white.svg` foram necessários), mas fica sinalizado para correção futura caso seja necessário.
