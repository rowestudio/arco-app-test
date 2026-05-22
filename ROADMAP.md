# Roadmap

## Objetivo imediato

Fechar uma versão estável mínima antes de mudanças maiores.

## v8z3v — Estabilização mínima

- Corrigir escala global resetando curvas no Template Circular.
- Ajustar Fixar ativo para destaque vermelho.
- Validar export WebCodecs após as correções.
- Não mexer em motor, easing, curva ou UI estrutural.

## v8z3w — Interação de curva

- Aumentar área de toque da bolinha de edição da curva.
- Reforçar preferência pela edição da curva direto no Stage.
- Ao inserir frame entre dois frames, posicionar o novo frame sobre a curva existente.
- Preservar curva ao alterar escala após carregar projeto.

## v8z3x — Suavização inteligente

- Botão “Suavizar curva”.
- Easing automático de rotação.
- Amaciamento automático de escala entre segmentos.
- Avaliar como mostrar esses controles sem sobrecarregar a UI.

## Futuro — Zoom assistido por frame ativo

- Ao selecionar frame muito pequeno, o app pode aproximar automaticamente a região do frame.
- Ao tocar fora ou selecionar outro frame, pode retornar ao zoom 100%.
- Deve respeitar zoom manual do usuário (não sobrescrever se ele já ajustou).
- No modo normal, o zoom continua contextual (comportamento atual, aprovado em v8z4b18b).
- No Modo Mapa/Curvas, o zoom pode ficar sempre visível por ser um modo de precisão.

## Futuro — Modo Mapa / Curvas — edição avançada de trajetória

O Modo Mapa atual deve evoluir para um modo de edição de trajetória mais completo.
Esse modo pode incorporar o futuro Modo Curvas, sendo tratados como um único modo de precisão.

### Zoom e navegação

- O zoom de edição deve ficar sempre disponível nesse modo.
- A ferramenta de pan (mãozinha) deve ficar disponível sempre que houver zoom ativo.

### Opacidade da imagem-base

- Deve existir controle de opacidade da imagem-base/fundo nesse modo.
- A opacidade ajuda a destacar curvas, frames, pontos e trajetória sobre o fundo.
- O controle de opacidade é apenas visual/editorial: não altera Preview, MP4 nem JSON da animação.

### Destaque visual de curvas

- Curvas devem ter maior destaque visual nesse modo em relação ao modo normal.

### Evoluções futuras desse modo (não imediato)

- Pontos-guia de curva.
- Conversão frame ↔ ponto-guia.
- Handles de tangência local (bezier handles).

## Futuro — Evolução do modelo runtime de curva (v8z4b19c+)

O `buildRuntimeCurveModel` introduzido na v8z4b19c e ampliado na v8z4b19e já
inclui o contrato runtime completo de `pathPoints`, `handles` e `capabilities`.
O modelo está preparado para receber implementação real futura sem quebrar
compatibilidade. Nenhum desses itens está ativo — são apenas contrato vazio.

### Estado atual (v8z4b19l)

- `pathPoints` contém um `pathPoint` derivado em `t=0.5` — amostra real da trajetória atual, calculada pela mesma fórmula quadrática. Não editável, não renderizado, não persistido no JSON.
- `handles: []` — contrato runtime vazio; campo presente mas sem conteúdo.
- `capabilities: { supportsPathPoints: false, supportsHandles: false }` — modo ativo: `legacyQuadratic`.
- `spans[]` — dois `quadraticSpan` derivados representando a curva legada dividida em dois sub-spans por De Casteljau em `t=0.5`. Apenas runtime: não persistidos, não renderizados, não editáveis. Introduzidos na v8z4b19h.
  - `spans[0]` (`derivedFirstHalf`): P0 → M com controle A = lerp(P0,C,0.5).
  - `spans[1]` (`derivedSecondHalf`): M → P1 com controle B = lerp(C,P1,0.5).
  - M coincide com `pathPoints[0]` (derivedMidpoint).
  - Propriedade: `span1(s) = B_orig(s/2)` e `span2(s) = B_orig(0.5+s/2)`.
- `evaluateSegmentPath()` continua com resultado matematicamente idêntico à v8z4b19k.
- Nenhum campo novo persiste no JSON.
- O `pathPoint` derivado NÃO tem UI, NÃO é editável e NÃO altera a trajetória.
- Os spans derivados NÃO têm UI, NÃO são editáveis, NÃO alteram a trajetória.
- `evaluateRuntimeCurveModel()` agora usa `spans` como caminho preferencial (v8z4b19l), com fallback para `evaluateRuntimeLegacyQuadratic()`. Resultado matemático idêntico.
- `isValidRuntimePoint(pt)` — valida x/y finitos. Introduzido na v8z4b19l.
- `evaluateRuntimeLegacyQuadratic(model, t)` — lógica legacyQuadratic anterior, extraída como fallback explícito. Introduzido na v8z4b19l.
- `validateDerivedRuntimePathPoint(model)` — diagnóstico passivo: confirma coerência matemática entre `pathPoint` derivado e `evaluateRuntimeCurveModel(model, 0.5)`, com conversão explícita de unidades (normalizado → pixels). Introduzido na v8z4b19g.
- `diagnoseRuntimeCurveSegment(segIndex)` — encapsula diagnóstico por segmento. Introduzido na v8z4b19g.
- `diagnoseRuntimeCurveModel()` — agrega diagnóstico de todos os segmentos ativos. Introduzido na v8z4b19g.
- `lerpPointNormalized(a, b, t)` — lerp normalizado para divisão De Casteljau. Introduzido na v8z4b19h.
- `splitLegacyQuadraticAtMidpoint(start, control, end)` — divisão De Casteljau em t=0.5. Introduzido na v8z4b19h.
- `validateDerivedRuntimeSpans(model)` — diagnóstico passivo dos spans derivados: verifica midpoint match e reconstituição por amostragem. Introduzido na v8z4b19h.

### Próximos passos (futuros, não imediatos)

- Adicionar `pathPoints` reais como pontos de passagem sem tempo próprio.
- Adicionar `handles` de tangência para controle Bézier cúbico.
- Implementar `mode = 'vectorAnchors'` com avaliador Bézier cúbico.
- Schema JSON versionado para persistir `pathPoints` e `handles`.
- Migração controlada de `legacyQuadratic` → `vectorAnchors`.

### Nota sobre movimento inteligente

Movimento inteligente pode continuar como configuração global, mas futuramente
pode haver exceções ou parcialidade por trecho ou por passagem de frame.
Não implementar enquanto o conceito ainda não estiver fechado.

## Futuro — Ferramenta de caneta / criação de trajetória vetorial

Decisão de produto registrada em v8z4b18k. Não implementado ainda.

- Modo criar frames: clicar cria frame; clicar e arrastar cria frame com tangência.
- Modo criar pontos de passagem (pathPoints): clicar cria ponto; clicar e arrastar cria handle.
- Modo desenho livre: o app interpreta o traçado e sugere pontos e/ou frames.
- Ao deletar frame: oferecer opção de converter em ponto de passagem.
- Conversão ponto de passagem ↔ frame: em ambas as direções.
- Edição de handles: transformar ponto suave em canto e vice-versa.
- Desenho livre poderá gerar pontos e/ou frames após confirmação e escolha do tempo total.
- curvePuller (legado) coexiste com pathPoints; migração somente ao entrar no modo vetorial.

## Futuro — Modo de ajuste global de transformação

Registrado em v8z4b19b. Não implementado ainda.

- Permitir aplicar escala, deslocamento e rotação a todos os frames do projeto de uma vez.
- Diferente de ajuste local de frame individual.
- Diferente de seleção múltipla de frames.
- Deve retornar na fase de interface, após estabilização do motor atual.

## v9 — Interface final

- Nova interface completa.
- Home com arquivos recentes, se houver wrapper nativo.
- Menu contextual de frame/segmento.
- Visualização temporal interativa.
- Leitura visual de velocidade no trajeto.
- Refinamentos de overlay, painéis e microinterações.
