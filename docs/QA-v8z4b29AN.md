# QA — v8z4b29AN Modo Tangente e Global armado no pill de curvas

## Escopo
- Base atual: `v8z4b29AM`, preservando `v8z4b29AL` quando presente e as bases validadas `v8z4b29AF`, `v8z4b29AH` e `v8z4b29AK`.
- Área alterada: menu/pill de curvas e normalização local/global de handles `curvesV2` pelo Modo Tangente.
- Áreas preservadas: timeline/menu inferior, `.fp`, `#pillsRow`, `.mid-pills`, menus deslizantes da seleção de frames, pontos laranja da timeline, snap-to-center, Alpha/spotlight, Preview/export/MP4, JSON e motor de animação.

## Checklist manual obrigatório
1. Abrir o app e confirmar versão visível `v8z4b29AN`.
2. Abrir o menu de curvas e confirmar que Canto, Simétrico, Assimétrico, Desconectado, Tangente, divisor e Global ficam dentro do mesmo pill.
3. Confirmar que o Global fica à direita, cinza/neutro por padrão, separado por divisor vertical discreto.
4. Confirmar que o ícone Tangente é o Lucide `tangent`, sem texto permanente no pill.
5. Confirmar que os ícones de curva estão levemente maiores e com traço mais fino/suave, mantendo área de toque no iPhone/Safari.
6. Tocar Global uma vez e confirmar que fica laranja e mostra “Clique em um modo”.
7. Tocar Global novamente e confirmar que volta ao cinza sem alterar curvas.
8. Armar Global, tocar fora/fechar o pill e confirmar que Global é cancelado ao reabrir.
9. Sem Global armado, aplicar Canto, Simétrico, Assimétrico, Desconectado e Tangente no frame ativo; confirmar que só o alvo local muda e o pill não fecha.
10. Com Global armado, aplicar Canto, Simétrico, Assimétrico, Desconectado e Tangente; confirmar aplicação a todos os frames compatíveis, feedback “Aplicado a todos”, Global cinza/desarmado e pill aberto.
11. Confirmar que Tangente recalcula handles IN/OUT em lados opostos pela direção dos frames vizinhos sem mover frames.
12. Confirmar Tangente em primeiro/último frame, em projeto com 2 frames e que projeto com 1 frame não quebra.
13. Confirmar Undo/Redo em um passo para aplicação local e aplicação global.
14. Confirmar que posição, escala, rotação, duração, pausa e ordem dos frames não mudam ao usar Tangente.
15. Confirmar Preview básico e export/MP4 sem regressão.
16. Abrir e salvar JSON; confirmar compatibilidade e persistência apenas no modelo já existente de modos/handles de curva.
17. Comparar timeline/menu inferior com a base validada e confirmar ausência de alteração visual em `.fp`, `#pillsRow`, `.mid-pills` e pontos laranja centralizados.
18. Confirmar menus deslizantes da seleção de frames, snap-to-center e Alpha/spotlight sem regressão.

## Notas de implementação
- `Global` é somente um modo armado: não aplica nada sozinho, desarma depois da próxima aplicação global e usa feedback curto via status/toast existente.
- `Tangente` é local por padrão; com Global armado, aplica a todos como uma única ação de histórico.
- O cálculo usa a média/bissetriz dos vetores dos frames vizinhos, comprimento proporcional a 25% do trecho vizinho e clamp de segurança para evitar handles exagerados.
- Possibilidade futura registrada: controle de intensidade do Modo Tangente para definir quanta suavização será aplicada.
