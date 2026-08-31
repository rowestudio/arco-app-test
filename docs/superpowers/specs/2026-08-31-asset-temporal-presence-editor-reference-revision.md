# Presença temporal de ativos — revisão de referências no editor

**Status:** desenho complementar aprovado em conversa por Roberto em 2026-08-31. Esta revisão complementa e, onde divergir, prevalece sobre `2026-08-30-asset-temporal-presence-design.md`. Não autoriza mudança funcional por si só.

## Escopo confirmado

Esta primeira frente trata exclusivamente de **presença temporal**: quando uma imagem ou Text Asset existe no projeto. Transparência/opacidade manual do ativo é uma frente funcional separada e não entra nesta implementação. Efeitos de entrada e saída também ficam para depois.

O asset continua com sua aparência canônica enquanto está presente. Antes da entrada e depois da saída, Preview e Export não o desenham. Não há fade implícito, escala, zoom, deslocamento ou mutação de opacidade nesta etapa.

## Modelo temporal canônico

Cada limite, Entrada ou Saída, pode estar desligado ou conter uma referência temporal:

```text
TemporalBoundary {
  anchor: project | frame | asset
  anchorId?: frameId | assetId
  assetEvent?: entry | exit
  offset: { unit: seconds | projectFraction, value }
}

AssetPresence {
  mode: inherit | custom
  entry?: TemporalBoundary
  exit?: TemporalBoundary
}
```

- Sem Entrada, o limite inicial é o começo do projeto; sem Saída, o final.
- `project` usa um instante fixo em segundos ou uma fração da duração do projeto. A fração acompanha o redimensionamento proporcional da duração; segundos somente acompanham quando essa opção de redimensionamento estiver ligada.
- `frame` aponta para um **`frameId` estável**, nunca para índice visual da timeline. Inserir, mover ou redimensionar Frames preserva a referência semântica.
- `asset` aponta para `assetId` e para o evento Entrada ou Saída daquele ativo. A dependência acompanha o ativo de referência.
- O offset permite “antes”, “no momento” e “depois”. Ele também pode ser fixo ou proporcional ao projeto.

Frames existentes recebem IDs persistentes por migração compatível. Esses IDs, assim como referências a assets, pertencem ao modelo salvo; índices, tempos resolvidos, DOM e caches não são fonte de verdade.

## Resolução e integridade

Um resolvedor único calcula o instante de cada fronteira e então `isAssetPresentAt(asset, projectTime)`. Ele é consumido pelo renderer existente, sem caminho paralelo para Stage, Preview ou Export.

- Entrada posterior à Saída não pode ser confirmada.
- Auto-referência e ciclos entre assets são bloqueados no seletor e revalidados antes de persistir.
- Ao excluir um ativo que ancora limites de outros, o diálogo informa os vínculos afetados e oferece `Cancelar` ou `Excluir e preservar tempos`.
- Na confirmação, cada limite dependente vira uma âncora `project` no instante já resolvido. Não há relink automático. Undo restaura tanto o ativo quanto os vínculos semânticos; Redo repete a conversão.

## Padrão global e ajuste individual

O projeto possui um padrão global de Entrada/Saída. Assets novos e assets em `inherit` usam esse padrão ao resolver presença.

- **Aplicar a todos**: copia o padrão atual para todos os assets como ajuste individual, substituindo overrides existentes.
- **Aplicar aos sem ajuste individual**: mantém os overrides e atualiza somente assets em herança.
- **Usar padrão do projeto** no ativo remove seu override e restabelece a herança.

No painel individual, o controle de Tempo fica compacto e só expande os detalhes de Entrada ou Saída quando aquela fronteira é ativada. Efeitos futuros ficam dentro desses blocos, mas não são exibidos agora.

## Referência visual no Stage

O editor não esconde por completo ativos fora do intervalo da posição temporal corrente. Em vez disso, usa uma referência temporal somente editorial:

- **Presente:** desenho normal e seleção normal.
- **Fora do intervalo:** conteúdo suavizado e contorno neutro tracejado, suficiente para leitura de composição.
- **Selecionado fora do intervalo:** mantém o coral de seleção de Ativos e o tracejado temporal; continua editável.

Essa referência não é opacidade do ativo, não é persistida, não altera a geometria, profundidade, zIndex, hit-test canônico nem Layer. Ela é excluída de Preview e Export. O renderer de saída usa somente `isAssetPresentAt` para incluir ou omitir o asset.

O Stage resolve o tempo da referência corrente da timeline. A apresentação acima é compartilhada pelos modos de edição quando o ativo precisa ser contextualizado; a lógica de interação já aprovada de Câmera e Ativos permanece preservada.

## Duração do projeto

Adicionar ou remover Frames não altera valores de tempo fixo. Referências a Frame ou Ativo acompanham naturalmente sua posição resolvida.

No ajuste proporcional de duração total, a opção padrão **Acompanhar proporcionalmente tempos dos ativos** escala apenas limites/offsets expressos em segundos. Valores em `projectFraction` já acompanham por definição; vínculos semânticos a Frames/Ativos não são congelados nem convertidos.

## Persistência e QA exigidas

Presença e referências participam de Save/Load, Session Autosave/Restore, Undo/Redo, hash canônico e invalidação de cache necessária. A implementação terá testes para:

- migração de `frameId`, herança e override;
- Projeto, Frame e Ativo como âncoras, offsets fixos/proporcionais e ciclos inválidos;
- exclusão com conversão e Undo/Redo;
- igualdade de presença em Stage, Preview e Export, sem marca editorial fora do Stage;
- seleção/edição do asset temporalmente inativo;
- round-trip de persistência e escala de duração;
- validação física no iPhone/Safari de painel, referência tracejada, Preview e Export.

## Fora de escopo explícito

- opacidade/transparência manual de ativo;
- fade, zoom, movimento ou outros efeitos de Entrada/Saída;
- alteração da câmera, curvas, easing, `getStateAtT`, WebCodecs ou da matemática do renderer fora do resolvedor de presença;
- mudanças de geometria, ProjectWorld, profundidade, ordem de Layers ou promoção para produção.
