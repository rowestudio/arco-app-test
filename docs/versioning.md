# Versionamento

## Tags

```text
v8z3u-stable-candidate
v8z3v-fix-global-scale
v8z3w-curve-touch
v9-ui-redesign
```

## Branches

```text
fix/global-scale-preserve-curves
fix/fixar-red-active
feature/curve-touch-area
feature/rotation-scale-smoothing
```

## Commits

```text
fix: preserve curves when scaling globally
fix: show fixed frame indicator in red
docs: add QA checklist
chore: establish v8z3u baseline
```

## Regra

Não trabalhar direto na `main`.

Fluxo:

1. Criar branch.
2. Fazer alteração pequena.
3. Testar.
4. Revisar diff.
5. Merge.
6. Criar tag quando virar estável.
