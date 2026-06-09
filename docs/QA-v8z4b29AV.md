# QA pendente — v8z4b29AV Novo arquivo simples no editor

- Base obrigatória preservada: `v8z4b29AU / 29U` aprovada após revert da Home/Novo Projeto guiado; sem reintroduzir Home, Novo Projeto guiado, fluxo formato → template → imagem ou alterações em templates.
- Implementação: ação `Novo arquivo` adicionada ao menu interno de arquivos; confirmação antes de abrir o seletor; seletor dedicado aceita JPG/JPEG, PNG e WebP; projeto atual só é descartado depois que a nova imagem é escolhida e carregada com sucesso.
- Estado esperado após imagem válida: vínculo com JSON anterior removido, undo/redo limpos, seleção múltipla/foco/curvas/pausas/durações/timeline derivados limpos, formato atual preservado quando válido, novo projeto com 1 frame inicial/F1, Stage e timeline renderizados imediatamente.
- Reset Project após Novo arquivo deve restaurar o baseline do novo arquivo, não o JSON anterior.
- Verificações estáticas executadas neste ambiente: versão visível `v8z4b29AV`, fluxo de JSON mantido em input separado, ação `Novo arquivo` em input de imagem dedicado, validação leve de imagem e atualização imediata com segunda renderização via `requestAnimationFrame`.
- QA manual pendente: iPhone/Safari; abrir app sem Home; carregar JSON; abrir `Novo arquivo`; testar Cancelar confirmação; cancelar seletor; escolher JPG/PNG/WebP válido; testar arquivo inválido; confirmar timeline com 1 frame sem herança de frames/curvas/pausas; testar Reset Project; salvar/abrir JSON; Preview e Export MP4.
