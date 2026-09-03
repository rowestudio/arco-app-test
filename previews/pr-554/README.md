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

## Checkpoint interno atual

- v8z4b25h é a base funcional estável interna aprovada.
- Não é release comercial e não cria nova versão funcional.
- v8z4b25h substitui v8z4b25g como checkpoint atual porque corrige o bloqueio da interface durante frame novo pendente/assistido.
- Manter v8z4b25h como ponto de retorno para regressões em curva, loop, Preview, MP4, JSON, inserção assistida de frame ou gestos no iPhone/Safari.

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
