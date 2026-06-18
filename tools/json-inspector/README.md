# Arco JSON Inspector

Ferramenta interna de QA para sanitizar e comparar arquivos JSON brutos do Arco Motion / Ken Burns App.

## Objetivo

Investigar o bug antigo de round-trip:

```text
abrir arquivo original
salvar sem alteração
reabrir arquivo salvo
→ projeto aparece visualmente diferente
```

Esta ferramenta **não abre o projeto no app**. Ela lê o JSON bruto como texto local, remove dados pesados de imagem/base64/cache e compara os campos estruturais relevantes.

## Local recomendado no repositório

```text
/tools/json-inspector/arco-json-inspector.html
```

Não linkar no app principal. Não colocar em menu. Não publicar como função do produto.

## Como usar

1. Abra `arco-json-inspector.html` em um navegador.
2. Em **Arquivo A**, selecione o JSON original.
3. Em **Arquivo B**, selecione o JSON salvo novamente sem alteração.
4. Clique em **Sanitizar e comparar**.
5. Baixe:
   - `*-snapshot-leve.json` do original;
   - `*-snapshot-leve.json` do salvo;
   - `arco-json-diff-report-*.json`.

## O que a ferramenta compara

Prioridade alta:

```text
projectWorld
assets[i].worldX/Y/W/H
assets[i].slotRow/slotCol
assets[i].zIndex
assets[i].fitMode
frames[i].x/y/w/h/rotation
curves
```

Prioridade média:

```text
stageW/stageH
zoom
panX/panY
worldViewBounds
editorMinZoomMode
dynamicEditorMinZoom
activeFrameIndex
selectedSegmentIndex
format
background
duration/timing/pause/easing
schemaVersion
```

## O que é removido

Campos pesados ou temporários, como:

```text
dataUrl
src
imageData
image
img
bitmap
blob
file
objectUrl
base64
previewCache
projectWorldComposite
editorProxy
thumbnail
renderSamples
screen logs
```

## Interpretação

Se mudarem apenas:

```text
zoom
panX/panY
stageW/stageH
worldViewBounds
activeFrameIndex
```

o bug provavelmente é de viewport/editor state.

Se mudarem:

```text
projectWorld
assets[i].worldX/Y/W/H
frames[i].x/y/w/h/rotation
curves
```

o bug é mais grave: save/load está alterando geometria real do projeto.

## Segurança

A ferramenta:

- não chama `loadProject`;
- não chama `saveProject`;
- não chama `normalizeProject`;
- não chama `initProjectWorld`;
- não chama renderer;
- não altera o arquivo original;
- não usa servidor;
- processa tudo localmente no navegador.
