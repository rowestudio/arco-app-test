# test-fixtures

Diretório para fixtures de QA versionadas.

`qa-guardrails/` contém fixtures mínimas positivas e negativas da OPS-02 para validar os scripts de CI sem copiar o `index.html` integral.

As fixtures cobrem vazamento técnico em HTML, parsing de `APP_VERSION`, links Markdown e casos controlados usados pelo runner `../scripts/qa/run-self-tests.mjs`.

Fixtures futuras de produto, como projetos salvos, imagens com alpha e conjuntos com múltiplos assets/frames, ainda exigem tarefa específica e critérios de versionamento.
