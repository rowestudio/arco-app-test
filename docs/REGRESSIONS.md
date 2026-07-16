# REGRESSIONS

Catálogo obrigatório de regressões históricas e proteções.

| ID | Descrição | Impacto | Área | Como detectar | Teste preventivo desejado | Status do teste |
| --- | --- | --- | --- | --- | --- | --- |
| REG-001 | Botão Diagnóstico deixa de abrir. | Perde acesso a inspeção técnica. | Diagnóstico/UI | Clicar no item e verificar painel. | Teste de interação do menu. | automatizável |
| REG-002 | Painel Diagnóstico não aparece. | Diagnóstico fica indisponível. | Diagnóstico/UI | Abrir Diagnóstico e observar overlay/painel. | Screenshot após ação. | automatizável |
| REG-003 | Texto técnico ou prompt aparece na interface. | Quebra UX e expõe instruções internas. | UI/conteúdo | Inspecionar DOM visível e tela. | Busca estática + screenshot. | automatizável |
| REG-004 | Stage mostra menos assets que o modelo. | Projeto visual incompleto. | Stage/ProjectWorld | Comparar contagem do modelo com DOM/canvas. | Teste com múltiplos assets. | automatizável |
| REG-005 | Hidratação incompleta. | Estado restaurado parcialmente. | Load/estado | Carregar projeto complexo e comparar campos. | Round-trip Save/Load. | automatizável |
| REG-006 | Asset loaded não corresponde ao asset do Stage. | Edição atua sobre imagem errada. | Assets/Stage | Comparar IDs/fontes/slots após load/troca. | Teste de troca e seleção. | automatizável |
| REG-007 | Frames ficam atrás dos assets. | Edição de frames fica invisível/inacessível. | Stage/frames | Observar z-order dos frames. | Screenshot visual. | parcial |
| REG-008 | Scrim/alpha incorreto. | Máscara visual engana edição. | Stage/alpha | Testar PNG/alpha e frame ativo. | Screenshot com fixture PNG. | automatizável |
| REG-009 | Frame central não destaca. | Usuário perde referência ativa. | Frames/UI | Selecionar frame central e observar destaque. | Teste visual. | parcial |
| REG-010 | Preview e Export divergem. | Saída final não corresponde à prévia. | Preview/Export | Comparar frames amostrados. | Comparação visual. | futuro |
| REG-011 | Preview alterado e Export esquecido. | Correção parcial gera regressão final. | Preview/Export | Revisar diff e testar ambos. | Checklist obrigatório. | manual |
| REG-012 | Save funciona, mas Load não restaura. | Projetos salvos ficam inúteis. | Save/Load | Salvar, recarregar e comparar. | Round-trip fixture. | automatizável |
| REG-013 | Load restaura estado parcial. | Projeto abre inconsistente. | Load/estado | Verificar assets, frames, layers, tempos. | Fixture complexo. | automatizável |
| REG-014 | Layers deixam de selecionar ou reordenar. | Organização de assets quebra. | Layers | Selecionar e reordenar layers. | Teste de interação. | automatizável |
| REG-015 | Seleção direta no Stage deixa de funcionar. | Edição direta perde usabilidade. | Stage/seleção | Tocar/clicar asset/frame no Stage. | Teste de hit-test. | automatizável |
| REG-016 | Timeline e tempos deixam de sincronizar. | Movimento fica incorreto. | Timeline/timing | Alterar duração/pausa e observar tempo total. | Teste de consistência. | automatizável |
| REG-017 | Menus ou layout são alterados fora do escopo. | Quebra UX aprovada. | UI/layout | Revisar diff CSS/HTML e screenshots. | Comparação visual. | manual |
| REG-018 | `APP_VERSION` não é atualizada em PR funcional. | Rastreabilidade quebra. | Versionamento | Revisar diff funcional. | Checklist de PR funcional. | manual |
| REG-019 | Versão é atualizada em PR apenas documental. | Sinaliza release inexistente. | Versionamento | Revisar diff documental. | Checklist documental. | manual |
| REG-020 | Código de prompt, changelog ou diagnóstico é renderizado no app. | Vazamento técnico na interface. | UI/conteúdo | Buscar termos e testar tela. | Busca estática + screenshot. | automatizável |
| REG-021 | Escala global reseta curvas. | Movimento aprovado perde trajetória. | Escala/curvas | Aplicar Template Circular, editar curva, usar escala global e observar curva. | Fixture com curva manual + escala global. | automatizável |
| REG-022 | Curva reseta ao alterar escala após carregar projeto. | Projetos salvos perdem ajustes ao reabrir. | Load/escala/curvas | Carregar projeto salvo com curva manual e alterar escala. | Round-trip com curva manual. | automatizável |
| REG-023 | Ajuste de escala reseta ou altera curvas. | Mudança de tamanho causa alteração colateral de caminho. | Escala/curvas | Alterar escala individual ou em lote e comparar curva antes/depois. | Comparação de estado e screenshot. | automatizável |
| REG-024 | Regressão da `v8z3t` em curva/easing volta à base. | Reintroduz comportamento descartado. | Curvas/easing/base | Revisar base e diff em tarefas de curva/easing. | Checklist de base proibida. | manual |
| REG-025 | Autosave/retomar sessão restaura estado não confiável. | Usuário continua de estado parcial ou incorreto. | Persistência/sessão | Acionar retomada de sessão e comparar estado esperado. | Fixture de sessão/autosave. | futuro |
| REG-026 | Início preto/apagado em sequência específica de edição. | App parece quebrado ao iniciar ou retornar. | Inicialização/render | Reproduzir sequência histórica quando documentada; observar Stage inicial. | Caso reproduzível a confirmar. | futuro |
| REG-027 | `captureStream + MediaRecorder` volta como export principal. | Export pode voltar a apresentar trancos. | Export/MP4 | Revisar pipeline de export e logs. | Teste arquitetural/static check. | automatizável |
