# Decisões técnicas

## 001 — WebCodecs como export principal

Usar WebCodecs como caminho principal de exportação.

Motivo: `captureStream + MediaRecorder` gerava trancos/kicks no MP4, mesmo quando o preview estava fluido.

## 002 — Curva não controla velocidade

A curva visual controla apenas o caminho do movimento.

Easing de movimento fica separado da edição de curva.

## 003 — Não usar v8z3t como base

Descartar v8z3t.

Motivo: trouxe regressão na edição de curvas e reintroduziu controle indevido de easing na curva.

Base correta atual: v8z3u rollback clean.

## 004 — Migrar para GitHub/Codex com mudanças pequenas

Usar GitHub como histórico oficial e Codex para alterações pequenas e rastreáveis.
