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
| v8z4b26b         | **Implementada:** remover Sel + mostrar seleção múltipla no Stage |
| v8z4b26c         | **Implementada:** leitura visual forte da seleção múltipla no Stage |
| v8z4b26d         | **Implementada:** separação visual entre seleção simples e seleção múltipla |
| v8z4b26e         | **Implementada:** limpeza de marcação residual ao desselecionar frames |
| v8z4b26f         | **Implementada:** correção de luz, moldura e caminhos na seleção múltipla |
| v8z4b26g         | **Implementada:** remover laranja interno e overlay externo da seleção múltipla |
| v8z4b27a         | **Implementada:** menu de seleção múltipla com Pausa, Escala, Rotação e Posição |
| v8z4b27b         | **Implementada:** Pausa em lote com slider decimal sem incrementos fixos |
| v8z4b27c         | **Implementada:** Pausa em lote simplificada com frames afetados e sem ações redundantes |
| v8z4b27d         | **Implementada:** Pausa contextual direta, menu com 1 frame, Selecionar todos e Undo da cor |
| v8z4b27e         | **Implementada:** menu contextual limpo, primeiro selecionado destacado, Pausa sem Zerar e Undo de Conter |
| v8z4b27f         | **Implementada:** painel Pausa, Undo com painel aberto, ícones e menu rolável de frames selecionados |
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

**Status v8z4b27f:** seleção simples preserva auto-center fora do contexto e usa overlay normal menos pesado (`rgba(0,0,0,0.38)`); seleção contextual usa `selectedFrames` como fonte de verdade já com 1 frame (`selectedFrames.size >= 1`), mantendo destaque laranja no Stage e na faixa. O menu principal virou faixa horizontal rolável com `Selecionar todos`, `Pausa`, `Escala`, `Rotação`, `Mover`, `Alinhar` e `Distribuir`; subpainéis mantêm `Voltar` e o alvo. O grupo Pausa usa slider decimal direto nos frames-alvo, mostra o alvo, remove `Definir pausa` e `Zerar`, ressincroniza após Undo/Redo com painel aberto e consolida Undo apenas ao fechar/sair do painel. Seleção continua sendo estado temporário de UI e não entra no JSON; `Conter na imagem` permanece restaurado pelo Undo/Redo.

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


## Próximas funções registradas em v8z4b27d — não implementadas nesta versão

### Transformação direta de grupo no Stage

- Mover vários frames visualmente como grupo.
- Escalar vários frames como grupo.
- Rotacionar vários frames como grupo.
- Avaliar moldura/handles de grupo em versão experimental.
- Diferenciar transformação direta no Stage dos ajustes em lote por menu.

### Adicionar pausa aos selecionados

- Criar painel/modo separado de `Adicionar pausa`.
- Usuário escolhe um valor e esse valor é somado à pausa atual de cada frame selecionado.
- Preservar diferenças existentes entre frames.
- Registrar Undo único ao aplicar/fechar.

### Undo/Redo de troca de imagem

- Permitir desfazer/refazer troca de imagem.
- Avaliar uso de memória no iPhone/Safari antes de implementar.
- Guardar imagem anterior/nova sem estourar memória.

### Velocidade constante perceptiva

- Estabilizar sensação de velocidade considerando posição, escala e rotação.
- Não depender apenas da distância entre centros.
- Estudar deslocamento médio dos cantos do frame/câmera.
- Testar zoom forte, rotação forte e combinação de zoom + rotação + deslocamento.

## 8. Itens futuros registrados na v8z4b27f

- Play/Preview acessível com menu de seleção múltipla aberto; tratar como ajuste futuro de UX.
- Transformação direta de grupo no Stage.
- Edição global de frames.
- Adicionar/Subtrair pausa aos selecionados.
- Undo/Redo de troca de imagem.
- Loop ida e volta/ping-pong.
- Velocidade constante perceptiva considerando posição, escala e rotação.
