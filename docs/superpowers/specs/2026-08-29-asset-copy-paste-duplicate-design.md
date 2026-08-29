# Copy, Paste e Duplicar de Ativos — Design

## Objetivo

Tornar rápida a repetição de elementos de composição no Arco Motion App e permitir inserir uma imagem copiada do Photos ou de outro aplicativo, sem criar renderer paralelo nem alterar a semântica de ProjectWorld, Layers, Preview ou Export.

## Escopo aprovado

### Duplicar na UI de Camadas

- A faixa contextual da Layer selecionada recebe a ação `Duplicar` com iconografia semântica própria e `aria-label` explícito.
- Duplicar cria um novo asset canônico com ID novo, a mesma fonte/conteúdo, geometria canônica, estilo, profundidade, visibilidade e demais propriedades editáveis do original.
- A cópia nasce no mesmo `worldX/worldY` da Layer de origem, imediatamente acima dela na pilha, e torna-se a seleção canônica.
- A cópia nasce com `locked: false`, mesmo quando a origem está travada.

### Copiar e Duplicar no menu inferior de Ativos

- Com um ativo selecionado, o menu inferior de Ativos oferece `Copiar` e `Duplicar`; ambos ficam indisponíveis sem seleção canônica válida.
- `Duplicar` usa o mesmo construtor canônico da ação de Camadas, mas aplica deslocamento visual pequeno em coordenadas do ProjectWorld antes de inserir a cópia. A cópia continua imediatamente acima da origem, destravada e selecionada.
- `Copiar` não altera `assets`, seleção, Undo/Redo, ProjectWorld ou persistência do projeto. Ele registra uma cópia transitória do Arco e escreve um marcador estruturado e versionado no clipboard do sistema durante o gesto explícito do usuário.

### Inserir e Colar pelo botão `+` de Ativos

- O `+` de Ativos abre opções compactas `Inserir imagem` e `Colar`; não cria menu novo no Stage.
- `Inserir imagem` mantém o fluxo atual de seletor de arquivo.
- `Colar` lê o clipboard do sistema no próprio toque. A última cópia do clipboard é sempre a fonte de verdade:
  - um marcador Arco reconhecido e snapshot disponível cria uma nova cópia do ativo;
  - uma imagem externa suportada cria um novo Image Asset;
  - texto, tipo não suportado, marcador sem snapshot, falha de permissão ou leitura negada não usa uma cópia interna antiga e retorna feedback claro ao usuário.
- Todo resultado bem-sucedido de `Colar` nasce no centro da vista atual do Stage, com novo ID, seleção canônica e `locked: false`.

## Clipboard externo e fases

- A leitura externa usa `navigator.clipboard.read()` somente em HTTPS e em resposta direta à ação `Colar` do usuário.
- O suporte precisa aceitar os tipos de imagem fornecidos pelo navegador de modo seguro; a implementação não interpreta HTML, scripts ou tipos arbitrários.
- Safari/iPhone pode apresentar confirmação nativa para leitura. O aplicativo nunca tenta contornar essa confirmação, não tenta usar `document.execCommand('paste')` e não usa polling do clipboard.
- A cópia interna é transitória: não integra Save/Load, Session Restore nem o JSON do projeto. O projeto só recebe um novo asset quando `Duplicar` ou `Colar` conclui com sucesso.
- O Paste de imagem externa exige validação física em iPhone/Safari com imagem copiada do Photos; a implementação automatizada não declara essa integração física como comprovada.

## Modelo canônico e invariantes

- Um helper único constrói a cópia do asset; os dois pontos de entrada de Duplicar e o Paste de marcador Arco o reutilizam.
- O helper nunca reutiliza `id`, `layerSequence` ou seleção da origem. Ele preserva a relação independente entre `depth` e `zIndex` e não grava offset derivado de paralaxe em geometria canônica.
- A inserção é uma única mutação de projeto: um snapshot de Undo, uma limpeza de Redo e uma revisão de Session Autosave para cada êxito.
- Image Assets reutilizam a fonte canônica existente sem criar renderer, compositor, bitmap persistido ou pipeline de Export paralelo. Text Assets preservam seus campos tipográficos e de caixa pelo mesmo caminho de serialização/hidratação já canônico.
- Stage, Layers, Preview e Export consomem o novo asset pelo renderer canônico atual. Lock da origem não bloqueia a cópia nova; uma cópia travada não é criada.

## UX, acessibilidade e estados de falha

- Ações que exigem ativo selecionado ficam semanticamente indisponíveis sem `selectedAssetId` válido.
- Cada ação comunica resultado sem vazar texto técnico. Os feedbacks distinguem cópia interna, imagem colada, clipboard sem conteúdo compatível e permissão/compatibilidade indisponível.
- A faixa de ações de Layers mantém seus controles existentes operáveis: um clique em Duplicar não pode selecionar/reconstruir o DOM antes de concluir a própria ação.
- O novo menu do `+` não deixa painel oculto interceptar toque e fecha pelos caminhos canônicos de troca de modo/Preview/Export.

## Fora de escopo

- Não há paste de texto, HTML, SVG, URL, múltiplos assets ou arquivos genéricos nesta entrega.
- Não há clipboard persistido entre sessões, sincronização remota, permissões especiais, extensão Safari, serviço externo ou MCP.
- Não há mudança em Frames, câmera, curvas, easing, motor, WebCodecs, UI do Stage fora dos controles especificados, cores aprovadas ou produção.

## Evidência e testes exigidos

- Teste de regressão para cada ponto de entrada: Duplicar em Layers no mesmo lugar; Duplicar no menu inferior com deslocamento; Copiar seguido de Colar do marcador Arco; Colar imagem externa por `ClipboardItem` mockado.
- Cada teste verifica ID novo, ordem de Layer, `locked: false`, seleção, geometria, Undo/Redo, uma revisão de autosave e Save/Load.
- Testes preservam Preview/Export, ProjectWorld, profundidade/paralaxe, renderer, Layers e ausência de texto técnico renderizado.
- Smoke WebKit valida alvos reais de toque, ações de Layers, menu `+`, estados indisponíveis e ausência de interceptação por painel oculto.
- QA físico em iPhone/Safari valida Duplicar nas duas entradas e Colar imagem copiada do Photos; qualquer prompt nativo, MIME não aceito ou falha deve ser registrado como evidência, não mascarado.

## Referências de plataforma

- MDN, Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- MDN, Clipboard.read(): https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read
