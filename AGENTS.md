# AGENTS

Este é o arquivo obrigatório de entrada para Codex e agentes compatíveis no repositório `rowestudio/arco-app-test`.

## Leitura obrigatória antes de agir

Antes de propor, editar ou revisar qualquer mudança, leia nesta ordem:

1. `docs/PROJECT_STATE.md`
2. `docs/PROJECT_CONTEXT.md`
3. `docs/PRODUCT_RULES.md`
4. `docs/REGRESSIONS.md`
5. `docs/DEFINITION_OF_DONE.md`

Depois, consulte os demais documentos conforme o escopo:

- arquitetura: `docs/ARCHITECTURE.md`;
- decisões: `docs/DECISIONS.md`;
- roadmap: `docs/ROADMAP.md`;
- QA: `docs/QA_STRATEGY.md` e `docs/TEST_CASES.md`;
- promoção: `docs/PROMOTION_TO_PRODUCTION.md`;
- manutenção documental: `docs/DOCUMENTATION_MAINTENANCE.md`.

## Repositórios e promoção

- `rowestudio/arco-app-test` é o repositório de desenvolvimento e teste.
- `rowestudio/arco-app` é o repositório estável/produção.
- Nunca altere produção sem autorização explícita de Roberto.
- Nunca promova uma versão por conta própria.
- Toda promoção para produção exige tarefa, branch e PR próprios.
- Nesta base, implemente sempre sobre a `main` atual do repo de teste, criando branch própria.
- Abra PR no GitHub e coloque a identificação da versão ou operação no título.

## Versionamento

- Atualize `APP_VERSION` somente em PR funcional do aplicativo.
- Não atualize `APP_VERSION` em PR exclusivamente documental, operacional ou de QA sem alteração funcional.
- Não declare uma versão como pronta sem evidência de teste compatível.

## Escopo e preservação

- Aplique sempre a menor alteração possível.
- Trabalhe apenas no escopo explicitamente solicitado.
- Não crie HTML paralelo.
- Não reescreva o app inteiro.
- Não faça refatoração ampla sem autorização.
- Não altere layout, cor, texto, ícones, fluxo, menus ou estrutura fora do escopo.
- Preserve tudo que já foi aprovado.
- Considere funcionamento real em iPhone/Safari como referência de produto.
- Diferencie bug, regressão, ajuste visual, melhoria, refatoração e nova função antes de implementar.
- Avalie impacto e risco antes de alterar.

## Áreas protegidas

Só toque nas áreas abaixo quando o pedido for explícito e compatível com o escopo:

- motor de animação;
- `getStateAtT`;
- `drawAtT`;
- WebCodecs/export;
- curvas, easing, interpolação e timing;
- pausa/loop;
- escala/rotação;
- Preview;
- Export;
- ProjectWorld;
- Layers;
- Save/Load;
- seleção;
- duração;
- timeline;
- layout/UI.

Quando a tarefa envolver motor, trate como Engine Sprint apenas se o pedido disser explicitamente que é sobre motor, interpolação, curva, easing, preview, export, WebCodecs, `drawAtT`, `getStateAtT`, timing, loop, pausa, escala ou rotação.

## QA e evidência

- Execute testes compatíveis com a mudança.
- Não declare “corrigido” sem evidência.
- Registre itens não testados ou não verificáveis.
- Diagnóstico interno não substitui resultado visual.
- Nunca considere flag diagnóstica superior ao relato visual de Roberto.
- Roberto não deve ser a primeira barreira contra erros objetivos detectáveis por diff, inspeção estática ou testes básicos.

## Proteção contra vazamento de texto técnico na interface

Reprove imediatamente qualquer vazamento de prompt, instrução operacional, changelog ou texto técnico no body visível do aplicativo.

Os termos abaixo podem aparecer em documentação ou comentário real de código, mas nunca podem ser renderizados acidentalmente na interface:

- PROBLEMA
- CORREÇÃO
- DIAGNÓSTICO
- INSTRUÇÕES
- CHANGELOG
- PROMPT
- blocos técnicos destinados ao agente

Ao revisar HTML/JS/CSS, procure explicitamente por textos técnicos inseridos em elementos visíveis, templates, overlays, botões, painéis ou mensagens ao usuário.

## Relatório obrigatório após mudanças

O resumo de implementação deve incluir:

- arquivos alterados;
- funções alteradas, se houver;
- razão da mudança;
- riscos;
- testes executados;
- itens não verificados.
