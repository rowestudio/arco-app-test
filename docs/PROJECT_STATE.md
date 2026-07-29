# PROJECT_STATE

Última atualização documental: 2026-07-29.

## Estado auditado

- Repo de desenvolvimento/teste: `rowestudio/arco-app-test`.
- Branch base: `main`.
- HEAD auditado do teste: `9d81fcf0ede89806debc3a42761c846edb642613`.
- Versão corrente do teste: `v8z4b32E8F` (base da E8G em desenvolvimento).
- Repo estável/produção: `rowestudio/arco-app`.
- HEAD auditado de produção: `626327280e3a4126fac259e205bbe0bdf3cc8719`.
- Versão de produção: `v8z4b32E7H`.
- Origem dos dados de produção: auditoria comparativa realizada antes da OPS-01; não revalidado nesta PR.

## Fluxo confirmado

Teste → aprovação de Roberto → promoção para produção.

`v8z4b32E7X` contém evoluções posteriores à produção `v8z4b32E7H`.

Nenhuma promoção está autorizada nesta PR.

Status atual: OPS-02 integrada via PR #439, merge commit `52e4f917e28f148278ba8fc135a0f9a8d4c1eacb`, como infraestrutura de QA com guardrails estáticos, fixtures controladas e self-tests versionados. A execução final da PR do workflow QA Guardrails passou; esse workflow é disparado por `pull_request` ou `workflow_dispatch`, portanto este documento não afirma execução automática no merge commit. Nenhuma promoção está autorizada.

OPS-03 foi integrada via PR #446, merge commit `5d4ebf0b3af48501f61c33c6a20eee67617c3458`, como fechamento inicial dos smoke tests automatizados com Playwright/WebKit. A execução da PR dos WebKit Smoke Tests passou e gerou artifact de screenshot. WebKit automatizado em Linux é evidência operacional útil, mas não substitui validação real em iPhone/Safari. Nenhuma promoção está autorizada.

OPS documental v8z4b32E7X incorporou ao Project OS o backlog de produto recuperado das conversas do projeto Arco Motion App em `docs/PRODUCT_ROADMAP.md`. Esse registro é documental e rastreável, não altera fatos de produção, não altera a versão do app, não modifica OPS-02/OPS-03 e não implica autorização de implementação de todos os itens listados.

## Atualização 2026-07-22 — v8z4b32E7Y reprovada visualmente

- PR #449 mergeada na main de teste com a versão `v8z4b32E7Y`.
- A versão `v8z4b32E7Y` foi reprovada visualmente porque os Ativos passaram a exibir quatro abas decorativas sobre o sistema antigo, mantendo alça antiga de rotação, alça antiga de escala, cinco controles visuais e círculos entrando na imagem.
- Decisão: não reverter imediatamente a PR #449, pois a implementação é incompleta e visualmente reprovada, mas estável e aproveitável para correção sobre a main atual.
- `v8z4b32E7Z` passa a ser a correção em desenvolvimento para concluir a paridade funcional e visual das alças de Ativos com o modelo aprovado dos Frames e registrar as novas decisões operacionais no Project OS.
- Pendente após merge/publicação: validação visual em iPhone/Safari real antes de considerar a versão aprovada por Roberto.


## Atualização 2026-07-28 — v8z4b32E8A em PR

- Base confirmada: `main` no HEAD `6df20c42b6a5192dba2279c0dfff71bd0a1f5ea0`, versão `v8z4b32E7Z`.
- A `v8z4b32E8A` remove na origem o HUD informativo redundante preso aos Frames no Stage, preservando a faixa informativa existente acima da timeline e os elementos funcionais dos Frames.
- Classificação: ajuste visual cirúrgico de UI, sem alteração de Preview, Export, renderer, ProjectWorld, Save/Load, timeline ou motor de Frames.
- Estado: PR técnica em preparação no repositório de teste; nenhuma promoção para produção autorizada.
- Aprovação visual final: pendente de merge, publicação na `main` de teste e validação de Roberto em iPhone/Safari real.

## Atualização 2026-07-28 — v8z4b32E8B em PR

- Base confirmada: `main` no merge commit da PR #451, HEAD `e60f62fcce214a791b66de60189573f735e5a227`, versão `v8z4b32E8A`.
- A `v8z4b32E8B` consolida `selectedAssetId` como identidade canônica da seleção de Ativos entre Stage, Layers, faixa contextual, toolbar, contorno e reorder.
- Causa encontrada: embora já existisse um resolvedor por ID, entradas de seleção ainda escreviam diretamente em `selectedAssetId`/`selectedImageAssetId`, linhas de Layers não expunham o ID no DOM e não havia verificação observacional comum após reconstrução/reorder; além disso, Layers numerava “Imagem N” pela ordem visual enquanto o contexto resolvia o nome pela ordem do array, permitindo rótulos diferentes para o mesmo asset.
- A regra de nomenclatura “Imagem N” foi preservada e nomes persistentes não foram adicionados; a correção desta PR opera exclusivamente sobre identidade por `asset.id`.
- Classificação: bug funcional de seleção e sincronização, risco médio nas interações Stage/Layers/toolbar/reorder.
- Estado: PR técnica em preparação no repositório de teste; nenhuma promoção para produção autorizada.
- Aprovação visual final: pendente de merge, publicação na `main` de teste e validação de Roberto em iPhone/Safari real, inclusive com o projeto complexo de 9 assets.

## Atualização 2026-07-28 — v8z4b32E8C em PR

- Base confirmada: `main` no HEAD `64452debc54e75b46dd237aea8ea0e2d3a5d1de3`, versão `v8z4b32E8B`.
- A `v8z4b32E8C` corrige a preparação compartilhada de Preview/Export para aceitar um `stableDrawable` válido sem exigir simultaneamente decode da fonte viva, e tenta reidratação persistente antes de declarar `asset-not-ready`.
- Causa raiz: a preparação anterior passava toda fonte, inclusive `stableDrawable` já válido, novamente pelo caminho genérico de decode e fazia `allReady` depender de `decodeReady`; assim era possível observar 9 drawables válidos, apenas 8 assets classificados como decoded e abortar a sessão inteira.
- Falha continua explícita e não reduz a contagem visível: snapshot parcial é descartado e estados de loading/locks são liberados para nova tentativa sem reload.
- Aprovação visual final e confirmação 9/9 do projeto real, inclusive do asset `img-1781622678250-715`, permanecem pendentes de merge/publicação e teste em iPhone/Safari real por Roberto.


## Atualização 2026-07-28 — v8z4b32E8D em PR

- Base confirmada: `main` no merge commit da PR #453, HEAD `62d401173caa7c1bafd5f2f191bb454af38e17ec`, versão `v8z4b32E8C`.
- A `v8z4b32E8D` atribui a cada image asset um nome `Camada N` persistente e independente de posição/`zIndex`, com contador monotônico salvo no projeto.
- Projetos antigos recebem migração determinística e não destrutiva; Save/Load, exclusão, reorder e seleção canônica preservam a identidade por asset.
- Aprovação visual final permanece pendente de merge/publicação e validação em iPhone/Safari real por Roberto. Nenhuma promoção para produção está autorizada.

## Atualização 2026-07-29 — v8z4b32E8E mergeada e validada

- A PR #455 foi mergeada na `main` de teste no commit `bed53f960427f18d128d50922daf10d435fa6cdc`, versão `v8z4b32E8E`.
- Roberto aprovou em iPhone/Safari real Session Autosave, Session Restore, preservação de ProjectWorld e Save/Load.
- Export foi aprovado e permanece fluido; o MP4 não apresenta a pequena travada observada exclusivamente no início do Preview.
- A pendência isolada confirmada em projetos diferentes é a pequena travada perceptível no primeiro início do Preview.

## Atualização 2026-07-29 — v8z4b32E8F em PR

- Base de conteúdo confirmada no commit da `main` informado para a tarefa, `bed53f960427f18d128d50922daf10d435fa6cdc`, versão `v8z4b32E8E`; o clone não possuía referência local `main`, mas o `HEAD` de trabalho correspondia exatamente ao commit obrigatório.
- A `v8z4b32E8F` limita-se ao preflight/warm-up do Preview: o relógio e o loop só são liberados após render canônico bem-sucedido de `t=0` e ciclos posteriores de composição, com falha/cancelamento liberando retry.
- Export, WebCodecs, câmera, sampler, matemática do renderer, Save/Load e Session Autosave/Restore permanecem fora do diff funcional.
- Estado: correção em PR no repositório de teste; aprovação visual permanece pendente de merge/publicação e validação por Roberto em iPhone/Safari real. Nenhuma promoção para produção está autorizada.

## Atualização 2026-07-29 — v8z4b32E8F mergeada e v8z4b32E8G em desenvolvimento

- A PR #456 (`v8z4b32E8F`) foi mergeada na `main` de teste no commit `9d81fcf0ede89806debc3a42761c846edb642613`.
- Roberto reprovou visualmente a E8F: a pequena travada inicial persistiu tanto no projeto com 9 ativos (~69 MB por checkpoint) quanto no projeto com 4 ativos (~53 MB).
- Os diagnósticos comprovaram que o primeiro frame `t=0` foi renderizado e composto antes do relógio; essa hipótese fica encerrada como causa da travada observada.
- A `v8z4b32E8G` isola Session Autosave de Preview/Export, removendo o disparo global por `pointerup` e adiando checkpoint pendente sem perda de revisão. A aprovação visual continua pendente de publicação e teste de Roberto em iPhone/Safari real.
