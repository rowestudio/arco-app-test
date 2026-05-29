# QA — v8z4b25h checkpoint interno

## Status geral

- v8z4b25h aprovada funcionalmente como checkpoint interno estável.
- Não é release comercial.
- Testes realizados em iPhone/Safari (foco principal da stack).
- Nenhuma regressão bloqueante identificada.

## QA confirmado

| Item                                                                         | Status      |
|------------------------------------------------------------------------------|-------------|
| Menu de curva acessível                                                      | OK          |
| Ícones do menu de curva claros/legíveis                                      | OK          |
| Ausência de texto indevido nos ícones                                        | OK          |
| Modo Canto funcionando                                                       | OK          |
| Modo Simétrico funcionando                                                   | OK          |
| Modo Assimétrico funcionando                                                 | OK          |
| Modo Desconectado funcionando                                                | OK          |
| Comportamento de Loop preservado                                             | OK          |
| Undo/Redo sem regressão relatada                                             | OK          |
| Preview sem regressão relatada                                               | OK          |
| MP4 sem regressão relatada                                                   | OK          |
| Zoom/pan sem regressão relatada                                              | OK          |
| F1 assistido e mínimo de 1 frame como base                                  | OK          |
| Durante frame pendente, ações externas ficam bloqueadas                     | OK          |
| Painel de Duração não abre durante frame pendente                            | OK          |
| Confirmar frame pendente libera a interface normalmente                      | OK          |
| Cancelar frame pendente libera a interface normalmente                       | OK          |
| JSON salvo com imagem embutida em v8z4b25h validado estruturalmente         | OK          |

## Pendência visual não bloqueante

- Ícones do menu de curva ficaram com traço visualmente espesso demais.
- Não bloqueia o checkpoint v8z4b25h.
- Deixar para revisão maior de interface (UI v8z5 ou similar).
- Não abrir patch específico apenas para isso neste momento.

## Comportamentos que devem ser protegidos em versões futuras

As seguintes funcionalidades foram validadas em v8z4b25h e devem ser testadas em regressão após qualquer alteração futura:

1. **Inserção assistida de frame:** ghost frame aparece, move, escala, rotaciona; Confirmar cria frame definitivo como única ação de Undo; Cancelar remove ghost sem alterar estado.
2. **Guarda de frame pendente:** nenhum painel ou ação externa é acessível enquanto há frame pendente; a guarda é liberada somente por Confirmar ou Cancelar.
3. **Modos de ponto/curva:** Canto, Simétrico, Assimétrico e Desconectado funcionam em todos os frames, inclusive F1 e último frame com Loop ativo.
4. **Loop fechado:** F1 e último frame respeitam modos de ponto como curva fechada.
5. **JSON estrutural:** arquivos salvos com imagem embutida mantêm estrutura correta sem campos fantasma de estado de edição.
6. **Gestos de dois dedos:** zoom/pan no Stage não conflita com seleção de frames ou interação com ghost.

## Checklist rápido para regressão pós-v8z4b25h

1. Confirmar que versão exibida na UI corresponde à nova versão.
2. Tocar `+` e confirmar ghost frame aparece com controles exclusivos.
3. Tentar abrir Duração durante frame pendente — deve estar bloqueado.
4. Tentar trocar/deletar frame durante frame pendente — deve estar bloqueado.
5. Confirmar frame pendente e verificar que interface volta ao normal.
6. Cancelar frame pendente e verificar que interface volta ao normal.
7. Testar modos Canto, Simétrico, Assimétrico e Desconectado no frame ativo.
8. Verificar Loop com F1 e último frame.
9. Testar Undo/Redo em sequência de ações.
10. Abrir Preview e verificar reprodução.
11. Exportar MP4 e verificar geração.
12. Salvar JSON e verificar estrutura com imagem embutida.
13. Testar zoom/pan com dois dedos no Stage.
