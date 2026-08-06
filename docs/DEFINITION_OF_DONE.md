# DEFINITION_OF_DONE

Uma tarefa só está pronta quando:

- o escopo solicitado foi cumprido;
- o diff foi revisado;
- nenhum arquivo fora do escopo foi alterado sem justificativa;
- a versão foi tratada corretamente;
- testes compatíveis foram executados;
- resultados e limitações foram relatados;
- regressões relacionadas foram verificadas;
- PR foi aberta;
- título da PR contém versão ou ID operacional;
- checks obrigatórios, quando aplicáveis, pertencem ao HEAD SHA atual da PR;
- nenhum texto técnico vazou para a interface;
- guardrails automatizados, quando alterados, têm self-tests versionados positivos e negativos;
- Preview/Export e sistemas não relacionados foram preservados;
- compatibilidade iPhone/Safari foi considerada;
- itens não verificáveis foram explicitados;
- o agente não afirmou mais do que conseguiu comprovar.

## Para PR documental

- Não alterar `APP_VERSION`.
- Não alterar `index.html`.
- Não criar HTML novo.
- Não alterar deploy, Pages, CNAME ou produção.
- Validar links internos dos documentos.
- Confirmar que as regras não contradizem `AGENTS.md`.
- Confirmar que `APP_VERSION` permanece intacta, salvo marcador explícito `APP_VERSION_EXCEPTION: <justificativa>` quando uma exceção operacional for realmente necessária.

## Para PR operacional de CI/CD

- Não alterar código funcional do aplicativo.
- Não alterar `APP_VERSION` nem `APP_VERSION_NAME`.
- Documentar permissões, frequência, concorrência, política de SHA e recuperação.
- Provar por self-test que a automação executa suítes ausentes, evita duplicidade no mesmo SHA e volta a executar quando o SHA muda.
- Não considerar válido check de SHA anterior.
- Não exigir token pessoal, desktop local ou execução manual recorrente.

## Para PR funcional

- Atualizar `APP_VERSION` quando houver mudança funcional do aplicativo.
- Registrar testes compatíveis com a área alterada.
- Verificar regressões relacionadas em `docs/REGRESSIONS.md`.
- Reportar riscos e o que não foi testado.

## Revisão e liberação de PR

- Aderência integral ao objetivo é obrigatória.
- Erro previsível pelo diff bloqueia merge.
- Implementação parcial não está pronta.
- O teste visual posterior de Roberto não transfere para ele a responsabilidade de detectar erros objetivos que já poderiam ter sido identificados na revisão.
- A pergunta final da revisão deve ser: “A implementação entregue corresponde exatamente ao que Roberto pediu e resolve o problema até o fim?”
- Se a resposta não for comprovadamente sim, não recomendar merge.
