# Roadmap — pós-checkpoint v8z4b25h

## Checkpoint atual

- **v8z4b25h** é o checkpoint funcional interno aprovado.
- Não é release comercial.
- Substitui v8z4b25g como checkpoint estável atual.
- Serve como base segura para todas as evoluções listadas abaixo.

## Sequência provável de versões

| Versão           | Foco principal                                              |
|------------------|-------------------------------------------------------------|
| v8z4b26a         | **Implementada:** seleção múltipla de frames + aplicar modo de curva em lote |
| v8z4b26b         | Aplicação em lote/global de ajustes simples                 |
| v8z4b26c         | Edição direta da curva puxando pela linha/segmento          |
| v8z5-prototype   | Protótipo visual separado da nova interface                 |
| v8z5a            | Primeira integração real da nova interface aprovada         |

---

## 1. Curvas — edição direta pela linha

- Permitir puxar a curva pela própria linha/segmento.
- Criar hit area invisível maior para iPhone/Safari.
- Preservar linha visual fina.
- Afetar apenas o segmento correspondente.
- Definir regra para abertura de handles quando ponto estiver em Canto.
- Preservar Loop, Undo/Redo e zoom/pan.
- Implementar em versão separada.

## 2. Seleção múltipla de frames

**Status v8z4b26a:** implementada para seleção temporária e aplicação em lote dos modos Canto, Simétrico, Assimétrico e Desconectado.

- Selecionar vários frames.
- Destacar visualmente frames selecionados.
- Diferenciar frame ativo de frames selecionados.
- Aplicar modos Canto, Simétrico, Assimétrico e Desconectado em lote.
- Registrar ação em lote como único Undo.
- Não quebrar seleção individual nem gestos de toque.

## 3. Aplicação em lote / global

- Diferenciar Global = todos os frames e Selecionados = frames escolhidos.
- Preparar aplicação futura de: escala, posição, rotação, duração, pausa, modo de curva e easing.
- Começar por ações simples e seguras.
- Cada lote deve ser um único Undo.

## 4. Exportação de imagem estática

- Exportar projeto com 1 frame como crop/imagem estática.
- Respeitar formato, posição, escala e rotação do F1.
- Futuramente exportar imagem do instante pausado no Preview.
- Usar renderização em resolução final.

## 5. Preview / visualização

- Sequência de frames destacada durante play.
- Identificar trecho/frame atual.
- Estudar pause/export still.
- Estudar play de trecho isolado.

## 6. Modo Trajeto

- Retângulo/câmera caminhando no Stage.
- Usar cálculo da animação sem entrar no Preview final.
- Diagnóstico de movimento, curva, pausas, loop e sequência.

## 7. Navegação de frames

- Faixa de frames deslizante.
- Destaque do frame central/ativo.
- Modos: mostrar todos / próximos / selecionados.

## 8. Movimento inteligente e easing

- Movimento inteligente por segmento.
- Esconder easing avançado quando Movimento Inteligente estiver ligado.
- Mostrar controles manuais quando desligado.
- Estudar intensidade de easing sem encher a UI de sliders.

## 9. Nova interface / UI v8z5

- Criar protótipo visual separado antes da integração real.
- Não redesenhar direto dentro da v8z4b25h.
- Usar v8z4b25h como base funcional preservada.
- Revisar hierarquia, ícones, espaçamentos e menus.
- Organizar: frames, curva, duração, preview, exportação, seleção múltipla e ações em lote.

## 10. Múltiplas imagens / layers

- Visão futura maior; não implementar agora.
- Preferir arquitetura de Stage expandido com múltiplas imagens/layers.
- Evitar troca simples de imagem por frame na linha atual.

---

## Pendência visual não bloqueante (herdada de v8z4b25h)

- Ícones do menu de curva estão com traço visualmente espesso demais.
- Não bloqueia nenhuma versão da sequência acima.
- Será revisado dentro da iteração maior de interface (UI v8z5 ou similar).
