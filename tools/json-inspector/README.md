# Arco JSON Inspector v1.1

Ferramenta interna de QA para sanitizar e comparar arquivos JSON brutos do Arco Motion / Ken Burns App.

## Diferença da v1.1

A v1.0 capturava `assets` e `projectWorld`, mas podia deixar `frames` e `curves` de fora quando eles estavam em caminhos diferentes do JSON.

A v1.1 adiciona:

- busca recursiva por arrays de frames;
- busca recursiva por curvas, control points, handles e segmentos;
- busca recursiva por timing, rotations, durations e pauses;
- árvore `rawStructural` sanitizada com o JSON inteiro sem base64/imagens/cache;
- contagem de candidatos encontrados no relatório.

## Uso

1. Abra `arco-json-inspector.html` em um navegador.
2. Em **Arquivo A**, selecione o JSON original.
3. Em **Arquivo B**, selecione o JSON salvo novamente sem alteração.
4. Clique em **Sanitizar e comparar**.
5. Baixe o relatório `arco-json-diff-report-v1-1-*.json`.

## Segurança

A ferramenta:

- não chama `loadProject`;
- não chama `saveProject`;
- não chama `normalizeProject`;
- não chama `initProjectWorld`;
- não chama renderer;
- não altera o arquivo original;
- processa tudo localmente no navegador.
