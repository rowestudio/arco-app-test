# Roadmap de Produto Recuperado

Este documento registra a recuperação das decisões de produto originadas nas conversas do projeto Arco Motion App. A lista abaixo preserva o inventário recuperado como fonte detalhada e rastreável do backlog de produto; não é um novo plano criado pelo Codex, não define prioridade, ordem de implementação, estimativas, datas ou versões futuras, e não autoriza implementação automática dos itens.

Estados usados neste documento:

- Em evolução
- Futuro
- Pesquisa
- Regra

## 1. Mundo, câmera e Stage

- [Em evolução] O Arco é um mundo visual navegável por câmera, não apenas uma foto com zoom.
- [Em evolução] Stage, trilho/curvas, frames, câmera, tempos e export devem formar o mesmo sistema.
- [Futuro] Edição direta de curva no Stage, com alças maiores, suavização de ângulos e adição de frame sobre curva existente.
- [Futuro] Ferramenta de caminho/caneta para criar frames a partir de toques.
- [Futuro] Ajustes por frame de posição, escala, rotação, foco/zoom e duração.
- [Futuro] Randomização controlada de posição, escala, rotação e duração, para seleção ou todos os frames.
- [Futuro] Distribuição proporcional horizontal/vertical de frames.
- [Futuro] Preservar curvas ao aplicar escala global ou templates.
- [Futuro] Movimento contínuo de rotação entre frames, inclusive voltas completas.

## 2. Frames, trechos e reprodução

- [Futuro] Play no menu de Frames para tocar somente o trecho atual, por exemplo F3 → F4.
- [Futuro] Esse play deve respeitar posição, escala, rotação, curva e duração, sem alterar dados nem exportar.
- [Futuro] Preview deve mostrar a passagem real pelos frames e trechos.
- [Futuro] Durante o Preview, o frame ativo deve acompanhar a reprodução; tocar num frame deve permitir pausar/pular para edição.
- [Futuro] Durações por trecho, pausas por frame, loop e comportamento final configurável.
- [Futuro] Passeio de Frames no modo Ativos/Stage como referência visual da câmera.

## 3. Ativos e composição

- [Em evolução] Múltiplos ativos, seleção direta, troca de imagem, ordem e preservação de composição.
- [Futuro] Inserir imagem e substituir imagem devem ser ações distintas.
- [Futuro] PNG com alpha, WebP, SVG, texto, stickers e elementos gráficos.
- [Futuro] GIFs animados e Lottie como ativos.
- [Futuro] Texto editável: títulos, legendas, logos e overlays.
- [Futuro] Crop, máscaras/molduras, bordas e controles independentes por ativo.
- [Futuro] Distorção, inclinação e “achatamento” de ativos.
- [Futuro] Visibilidade temporal: ativo sempre visível, por intervalo de frames ou por tempo.
- [Futuro] Efeitos por ativo, começando por sombra configurável.

## 4. Layers

- [Futuro] Painel de Layers permanente na lateral/sobre o Stage, visível durante o trabalho.
- [Futuro] O painel deve permitir ver, selecionar, ordenar, ocultar e trocar ativos sem sair do contexto do Stage.
- [Regra] Frames, curvas e HUD não entram na pilha visual dos ativos.

## 5. Grupos e blocos reutilizáveis

- [Futuro] Grupo de frames com cor/identidade própria.
- [Futuro] Editar grupo no Stage ou editar um frame individual dentro dele.
- [Futuro] Vincular e desvincular frames.
- [Futuro] Duplicar grupos preservando relações internas.
- [Futuro] Templates de grupos/blocos de animação reutilizáveis.
- [Futuro] Presets como zoom rápido, voo e estilingue.
- [Futuro] Importar/exportar projeto, grupo ou bloco de animação em formato editável.

## 6. Templates, formatos e comunidade

- [Futuro] Templates de Mundo, de música e de formatos.
- [Futuro] Área de trabalho vertical e horizontal; horizontal com Stage mais largo, adequado a filme.
- [Futuro] Templates adaptáveis aos ativos e à sequência do projeto.
- [Futuro] Usuários criam, salvam, reutilizam e compartilham templates/blocos.
- [Pesquisa] Comunidade/loja de templates, com importação do template inteiro ou apenas partes dele.

## 7. Cenas, narrativa e formatos de saída

- [Futuro] Múltiplas cenas/Stages no mesmo projeto, com passagem entre elas.
- [Futuro] Criar uma cena seguinte a partir de um frame da anterior.
- [Futuro] Export de imagem estática e presets de formatos sociais.
- [Futuro] Uso de PDF/documentos como base para trajetos visuais, narrativa ou tutorial.

## 8. Música e IA

- [Futuro] Templates guiados por música: BPM, batida, compasso e estrutura.
- [Futuro] Agente de IA atualizado com as capacidades reais do Arco.
- [Futuro] A IA gera projeto editável — frames, curvas, tempo, rotação, escala, composição e ativos — não vídeo fechado.
- [Futuro] A IA pode transformar uma imagem em roteiro/animação usando os recursos do app.
- [Futuro] A IA pode gerar templates e movimentos a partir de música.
- [Futuro] Caminho de câmera em JSON como formato estratégico para projetos e IA.

## 9. Profundidade e captura

- [Pesquisa] Profundidade 2.5D/parallax por ativo: primeiro plano acelera, fundo desacelera, com distância relativa à câmera.
- [Pesquisa] Essa distância pode ser animável e deve manter paridade entre Stage, Preview, Export e Save/Load.
- [Pesquisa] Motion Take: gravar movimento virtual da câmera por toque, arrasto, pinch e rotação, convertendo-o em frames editáveis.
- [Pesquisa] Captura por acelerômetro/AR do iPhone, possivelmente como produto complementar.
