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

## v9 — Interface final

- Nova interface completa.
- Home com arquivos recentes, se houver wrapper nativo.
- Menu contextual de frame/segmento.
- Visualização temporal interativa.
- Leitura visual de velocidade no trajeto.
- Refinamentos de overlay, painéis e microinterações.
