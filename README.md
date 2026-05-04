# Arco App

Aplicativo web mobile-first para criar movimento cinematográfico em fotos estáticas.

## Arquivo principal

```text
index.html
```

Base recomendada para o primeiro commit:

```text
arco-v8z3u-webcodecs-rollback-clean.html
```

## Estado técnico atual

- App em HTML/CSS/JavaScript single-file.
- Foco principal: iPhone/Safari.
- Exportação MP4 principal via WebCodecs + muxer.
- `captureStream + MediaRecorder` não deve voltar como pipeline principal.
- Curva visual controla o caminho, não a velocidade.
- Easing de movimento fica separado da curva.
- Pausa por frame deve ser preservada.

## Regra central

Não alterar motor, curva, easing, UI, layout, cores, textos, ícones ou fluxo aprovado sem autorização explícita.

## Como rodar localmente

```bash
python3 -m http.server 8000
```

Depois abrir:

```text
http://localhost:8000
```
