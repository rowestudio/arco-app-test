# QA pendente — v8z4b30B: Cenas como visualizações/regiões em workspace único 2×2

## Base confirmada

- Confirmado antes das alterações: `index.html` estava em `v8z4b29CD` no banner/comentário de topo, `APP_VERSION`, `APP_VERSION_NAME` e texto visível do app.
- A v8z4b30A revertida não foi usada como base conceitual; a implementação usa `workspace`/regiões geolocalizadas e não `scenes[]` como miniprojetos.

## Escopo implementado

- Versionamento atualizado para `v8z4b30B`.
- Tremor Global em Preferências ajustado para `TREMOR GLOBAL (PROJETO INTEIRO)` em estilo técnico.
- Workspace único experimental com até 4 regiões em 2×2, margem/gap mínimos de 100 px.
- Menu Visualização com modos existentes e bloco separado para Cena 1–4 e `+ Nova cena`.
- Zoom com opção `Projeto inteiro` quando houver múltiplas regiões.
- Menu Imagem com decisão entre substituir imagem da cena atual, criar nova cena com imagem ou cancelar.
- JSON novo salva `workspace`, `activeRegionId` e `frameRegionIds`; JSON antigo carrega como Cena 1.

## Riscos / limitações experimentais

- Preview/Export foram preservados de forma conservadora para evitar regressão no motor aprovado de uma cena.
- Múltiplas imagens simultâneas no render final e transições entre cenas não foram implementadas nesta versão.
- Teste real em iPhone/Safari ainda é obrigatório para validar responsividade, zoom/pan e fluxo de imagem.

## Testes obrigatórios em iPhone/Safari real

1. Confirmar versão visível `v8z4b30B`, `APP_VERSION` e `APP_VERSION_NAME`.
2. Criar projeto simples com uma imagem e validar fluxo aprovado da v8z4b29CD.
3. Abrir Visualização, confirmar modos existentes, criar Cena 2 e alternar Cena 1/Cena 2.
4. Criar 2–4 cenas, usar Zoom > `Projeto inteiro` e validar layout 2×2 com gap/margem.
5. Pelo menu Imagem, testar substituir imagem e criar nova cena com imagem.
6. Adicionar frames em cenas diferentes e confirmar numeração global na timeline.
7. Salvar/carregar JSON com múltiplas cenas e carregar JSON antigo como Cena 1.
8. Abrir Edição de Tempo > Preferências > Tremor e confirmar `TREMOR GLOBAL (PROJETO INTEIRO)` sem recuo inicial perceptível e toggle funcional.
