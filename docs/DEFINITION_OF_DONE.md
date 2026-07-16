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
- nenhum texto técnico vazou para a interface;
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

## Para PR funcional

- Atualizar `APP_VERSION` quando houver mudança funcional do aplicativo.
- Registrar testes compatíveis com a área alterada.
- Verificar regressões relacionadas em `docs/REGRESSIONS.md`.
- Reportar riscos e o que não foi testado.
