# Regras para Codex

## Regra principal

Fazer sempre a menor alteração possível.

## Não mexer sem pedido explícito

- Motor de animação.
- WebCodecs/export MP4.
- Easing de movimento.
- Edição de curva.
- Pausa por frame.
- Layout.
- Cores.
- Textos.
- Ícones.
- Fluxo aprovado.
- Estrutura visual dos painéis.

## Depois de alterar

A resposta deve listar:

- arquivo alterado;
- funções alteradas;
- motivo da alteração;
- riscos;
- passos de teste.

## Exportação

O pipeline principal validado é WebCodecs.

Não reintroduzir `captureStream + MediaRecorder` como export principal.

## Curvas

A curva visual controla o caminho.  
A curva não deve controlar a velocidade do movimento.  
Não reintroduzir easing na curva.

## Escala global

Ajuste de escala não deve resetar curvas.  
Não chamar rotinas de reconstrução de curva ao alterar escala.
