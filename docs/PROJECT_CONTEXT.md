# PROJECT_CONTEXT

## Identidade do produto

- Nome atual: Arco Motion App.
- Nome histórico: Ken Burns App.
- Natureza: aplicação HTML/CSS/JavaScript mobile-first.
- Referência principal de uso: iPhone/Safari.

## Objetivo do produto

O Arco Motion App permite criar movimentos visuais a partir de imagens, frames e câmera, com preview e exportação em vídeo. O produto deve preservar uma experiência direta, visual e confiável para Roberto validar no aparelho real.

## Conceitos principais

### Modos Ativos/Mundo e Câmera/Frames

O app opera com separação conceitual entre:

- Ativos/Mundo: organização dos assets no ProjectWorld, incluindo múltiplas imagens e camadas;
- Câmera/Frames: definição da câmera, frames, movimento, escala, rotação e trajetória.

O modo inicial após adicionar imagem permanece Câmera/Frames, salvo decisão futura explícita.

### ProjectWorld, assets e Layers

ProjectWorld é o espaço lógico usado para organizar os assets e relacioná-los ao Stage, Preview, Export e Save/Load. O app suporta múltiplos assets e Layers, com seleção, visibilidade e ordenação como áreas sensíveis a regressões.

### Save/Load

O Save/Load deve preservar o estado necessário do projeto, incluindo assets, frames, seleção relevante, coordenadas e dados usados pelo renderer. Qualquer mudança nessa área exige teste de round-trip.

### Preview e Export

Preview e Export devem permanecer consistentes. O export MP4 usa WebCodecs quando disponível, com caminhos de prontidão e fallback tratados pelo app atual. Não alterar Preview, Export ou WebCodecs sem escopo explícito.

### Renderer único

A arquitetura aprovada preserva um renderer único/canônico para evitar divergência entre Stage, Preview e Export. Mudanças que criem caminhos paralelos precisam de autorização explícita.

## Fluxo de desenvolvimento

- Desenvolvimento acontece em `rowestudio/arco-app-test`.
- A base de trabalho é a `main` atual do repositório de teste.
- Cada tarefa deve usar branch própria.
- Mudanças devem entrar por PR.
- Produção (`rowestudio/arco-app`) só muda após aprovação explícita de Roberto.

## Papéis

- Roberto: dono da validação de produto, aprovação visual, aprovação de promoção e decisões finais.
- Chat: ajuda a estruturar escopo, critérios, diagnóstico e decisão.
- Work: pode apoiar planejamento, revisão e organização operacional.
- Codex: implementa, revisa diff, executa validações e abre PR dentro do escopo.
- Claude Code: segue `AGENTS.md` e os documentos oficiais, sem criar fonte paralela de regras.
- GitHub: fonte de branches, PRs, histórico, revisão e integração.

## Princípio de alteração

Toda alteração deve ser incremental, cirúrgica e comprovável. Não inventar detalhes não comprovados; quando houver incerteza, registrar como “a confirmar”.

## Itens a confirmar

- Cobertura automatizada atual além de validações estáticas.
- Matriz exata de aparelhos/navegadores usados em validação recorrente.
- Serviço futuro para Safari/iPhone real em nuvem, caso seja adotado.
