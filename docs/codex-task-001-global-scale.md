# Codex Task 001 — Preservar curvas ao usar escala global

## Base

```text
index.html
```

Base original recomendada:

```text
arco-v8z3u-webcodecs-rollback-clean.html
```

## Problema

No Template Circular, quando o usuário aumenta ou diminui a escala de vários frames usando o ajuste Global, o app reseta as curvas.

## Comportamento esperado

Escala global deve alterar somente o tamanho dos frames.  
As curvas existentes devem permanecer iguais.

## Regras

Não alterar motor de animação, WebCodecs, easing, edição de curva, layout, textos, ícones, cores ou fluxo aprovado.

## Instrução técnica

Investigar onde o ajuste global de escala dispara reconstrução de curva.

Não chamar durante ajuste de escala:

- `resetCtrlPts`;
- `initCtrlPts`;
- `applyTemplate`;
- `autoCurve`;
- `rebuildCurve`;
- função equivalente de reset/recriação de curva.

Curvas só podem resetar quando:

- usuário aplica explicitamente novo template;
- usuário aciona reset de curva;
- usuário carrega outro projeto.

## Validação

1. Carregar imagem.
2. Aplicar Template Circular.
3. Editar curva manualmente.
4. Abrir escala.
5. Ativar Global.
6. Alterar escala.
7. Confirmar que a curva não se move/reset.
8. Preview.
9. Gerar MP4.
