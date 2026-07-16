# ARCHITECTURE

Este documento registra a arquitetura existente comprovável pela base atual. Não autoriza refatoração.

## Arquitetura existente

- Aplicação monolítica em `index.html`, com HTML, CSS e JavaScript no mesmo arquivo.
- Estado, UI, Stage, Preview, Export, Save/Load, ProjectWorld, assets, frames e Layers são coordenados no app principal.
- `APP_VERSION` e `APP_VERSION_NAME` ficam em `index.html`.
- O app mantém ProjectWorld como espaço lógico para múltiplos assets.
- Frames definem câmera/movimento no modo Câmera/Frames.
- Layers expõem organização, seleção, visibilidade e reordenação de assets.
- Preview e Export dependem do estado do projeto e do renderer.
- Export MP4 usa WebCodecs como pipeline principal validado.
- Save/Load serializa e restaura o projeto.

## Export MP4

O pipeline principal de exportação MP4 é WebCodecs.

O caminho arquitetural consolidado é:

```text
Canvas → VideoFrame → VideoEncoder → MP4
```

Histórico preservado: `captureStream + MediaRecorder` causou trancos/perda de suavidade e não deve voltar como export principal sem decisão explícita de Roberto e PR própria. Fallbacks ou caminhos auxiliares não podem substituir silenciosamente o pipeline principal.

## Curvas e movimento

- A curva visual controla o caminho.
- A curva não controla a velocidade do movimento por si só.
- Não reintroduzir easing na curva sem autorização explícita.
- Ajustes de escala não devem resetar, recriar ou alterar curvas existentes.
- Rotinas de reconstrução de curva não devem ser disparadas como efeito colateral de escala.

## Relação entre pipelines

Stage, Preview, Export e Save/Load devem permanecer coerentes entre si:

- Stage mostra a edição interativa;
- Preview valida o movimento antes da saída final;
- Export gera o arquivo de vídeo;
- Save/Load precisa restaurar o estado usado por todos os anteriores.

Qualquer divergência entre esses pipelines é tratada como risco alto.

## Invariantes

- iPhone/Safari é referência real de compatibilidade.
- Preview e Export não devem divergir visualmente.
- O renderer único/canônico deve ser preservado.
- ProjectWorld, assets, frames e Layers não devem ser alterados fora de escopo.
- Mudança documental não altera `APP_VERSION`.
- Mudança funcional deve tratar versão conforme `docs/DEFINITION_OF_DONE.md`.

## Pontos de risco arquitetural

- Estado parcialmente restaurado em Load.
- Stage renderizando menos assets que o modelo.
- Asset carregado não correspondendo ao asset visível no Stage.
- Divergência Preview/Export.
- Regressão em WebCodecs/export por alteração indireta.
- Retorno acidental de `captureStream + MediaRecorder` como export principal.
- Easing ou velocidade sendo reintroduzidos na edição de curva sem autorização.
- Ajuste de escala resetando curvas.
- Interações entre ProjectWorld, Layers, seleção e renderer.
- Comportamento diferente em iPhone/Safari.

## Possíveis evoluções futuras

Estas ideias não estão autorizadas por este documento:

- separar módulos;
- criar suíte automatizada ampla;
- adicionar Playwright/WebKit;
- contratar Safari/iPhone real em nuvem;
- refatorar renderer;
- separar pipelines internos.

Qualquer evolução precisa de tarefa e aprovação próprias.
