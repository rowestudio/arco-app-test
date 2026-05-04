# Arquitetura

## Tipo de app

Aplicativo web single-file:

```text
index.html
```

Contém HTML, CSS, JavaScript, SVGs inline, preview e export MP4.

## Conceitos principais

### Stage

Área visual onde a imagem e os frames são editados.

### Frame

Estado de câmera: posição, escala, rotação e pausa.

### Segmento

Trecho entre dois frames.

### Curva

Trajeto visual entre frames.  
A curva altera o caminho, não a velocidade.

### Easing

Controla suavização de movimento.  
Deve permanecer separado da curva.

### Export

Pipeline validado:

```text
Canvas → VideoFrame → VideoEncoder → MP4 muxer
```

Pipeline antigo problemático:

```text
Canvas → captureStream → MediaRecorder
```

O pipeline antigo gerava trancos/kicks por cadência/timestamps não determinísticos.
