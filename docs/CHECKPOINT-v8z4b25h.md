# Checkpoint interno — v8z4b25h

## Status

- **Versão:** v8z4b25h
- **Tipo:** Checkpoint interno aprovado
- **Release comercial:** Não
- **Data de aprovação:** 2026-05-29
- **Substitui:** v8z4b25g (checkpoint anterior)

## O que esta versão representa

v8z4b25h é o checkpoint funcional interno atual do projeto Arco Motion App / Ken Burns App.

Não é uma release comercial. Serve como base segura para as próximas evoluções de seleção múltipla, aplicação em lote, edição de curva pela linha e nova interface.

## Por que v8z4b25h substitui v8z4b25g

v8z4b25g foi aprovada como checkpoint estável após a sequência de modos de ponto/curva (Canto, Simétrico, Assimétrico, Desconectado). No entanto, apresentava um bug funcional: durante a criação de um frame novo pendente/assistido, ainda era possível abrir botões e painéis externos (como Duração, Curva, Preview etc.), o que criava estado inconsistente.

v8z4b25h corrige esse bug com uma guarda central que bloqueia todas as ações externas enquanto existe um frame assistido pendente de confirmação. A interface só é liberada após Confirmar ou Cancelar.

## O que foi alterado em v8z4b25h

- Adicionada guarda central para estado de frame pendente/ghost em `index.html`.
- Bloqueio de: Duração, Curva, Transformação/Frame, Preview, MP4, JSON, Reset, Settings, seleção/troca/deleção/adição de frame durante frame pendente.
- `APP_VERSION` e `APP_VERSION_NAME` atualizados para v8z4b25h.
- Nenhum outro comportamento alterado.

## O que deve ser preservado

Esta versão deve permanecer disponível como ponto de retorno caso versões futuras quebrem:

- Sistema de curvas (Canto, Simétrico, Assimétrico, Desconectado)
- Comportamento de Loop (incluindo fechamento do loop com modo de ponto correto)
- Preview
- Exportação MP4
- Estrutura JSON (incluindo imagem embutida)
- Zoom/pan com dois dedos no iPhone/Safari
- Undo/Redo
- Inserção assistida de frame (ghost frame)
- Gestos de toque no iPhone/Safari

## Base funcional preservada

- F1 assistido e mínimo de 1 frame continuam como base da linha atual.
- Stack: HTML/CSS/JS monolítico, mobile-first, foco em iPhone/Safari.

## Sequência histórica de checkpoints

| Versão    | Status              | Motivo                                                  |
|-----------|---------------------|---------------------------------------------------------|
| v8z4b25g  | Aprovada anterior   | Ícones de modos de ponto/curva corrigidos               |
| v8z4b25h  | **Checkpoint atual**| Bloqueio de interface durante frame pendente corrigido  |

## Pendência visual não bloqueante

- Ícones do menu de curva estão com traço visualmente espesso demais.
- Não bloqueia este checkpoint.
- Será revisado em uma iteração maior de interface (UI v8z5 ou similar).
