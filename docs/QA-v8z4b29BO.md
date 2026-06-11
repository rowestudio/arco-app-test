# QA — v8z4b29BO: Tremor Global do projeto + Frequência + modo por trecho

> Base: **v8z4b29BN** (Tremor/handheld experimental por trecho).
> Objetivo: evoluir **apenas** a camada procedural de Tremor criada na BN — sem
> refatorar o motor — adicionando Tremor Global do projeto, controle de
> Frequência, e três modos por trecho (Global / Desligado / Personalizado),
> mantendo Preview e MP4 determinísticos e coerentes.

---

## 1. Conceito implementado

- **Intensidade** = amplitude do deslocamento/rotação (0..1; UI 0–100%).
- **Frequência** = velocidade/quantidade de tremidas por segundo (0.5–8.0;
  UI "Lenta ←→ Rápida", sem expor "Hz").
- A Frequência multiplica a velocidade angular das senoides do ruído; **não**
  gera aleatoriedade nova por frame. `frequency = 1.0` reproduz exatamente o
  comportamento da v8z4b29BN.

Combinações esperadas:

| Intensidade | Frequência | Resultado |
|---|---|---|
| baixa | baixa | tremor manual sutil |
| baixa | alta | vibração rápida leve |
| alta | baixa | solavanco amplo |
| alta | alta | tremor agressivo |

---

## 2. Modelo de dados

```js
// Global do projeto
projectShake = { enabled: false, intensity: 0.4, frequency: 1.0 }

// Por trecho
segTremorSettings[i] = { mode: 'global'|'off'|'custom', intensity: 0.4, frequency: 1.0 }
```

- `cloneDefaultProjectShake()` / `ensureProjectShake()` — normaliza e clampa
  (intensidade 0..1, frequência 0.5..8.0).
- `cloneDefaultSegTremor()` — novo trecho nasce em `mode:'global'`.
- `migrateSegTremorEntry(s)` — migração do formato BN:
  - `enabled === true` → `mode:'custom'` (preserva a tremida que já existia);
  - `enabled` false/ausente → `mode:'global'` (Global vem desligado, então o
    visual anterior — sem tremor no trecho — é preservado ao abrir).
- `resolveSegTremor(cfg)` → `{ active, intensity, frequency }`: fonte única de
  verdade usada pelo motor e pela UI.

---

## 3. Motor / Render

- `getStateAtT(t) = applySegTremorLayer(getStateAtTBase(t), t)` — inalterado em
  estrutura; `getStateAtTBase` segue sendo o motor original (posição, escala,
  rotação, curva, duração).
- `applySegTremorLayer` agora resolve o modo via `resolveSegTremor` e usa
  `frequency` como multiplicador (`fw`) das senoides. Mantém:
  - envelope de extremidade (offset zero nos keyposes → frames reais exatos);
  - limites de segurança (≤ 2% do quadro em X/Y, ≤ 0,5° de rotação);
  - escala intocada.
- Determinismo: função pura de `t` + config; sem `Math.random`.

---

## 4. UI (painel de Edição/Movimento → seção "Tremor")

**Tremor Global**
- [ ] Toggle "Tremor Global (projeto inteiro)" — desligado por padrão.
- [ ] Ao ligar, aparecem sliders **Intensidade** (0–100%) e **Frequência**
      (Lenta ←→ Rápida).
- [ ] Ligar com intensidade 0 aplica valor moderado (0.4) automaticamente.

**Tremor do trecho**
- [ ] Chips de modo: **Global / Desligado / Personalizado** (chip ativo
      destacado).
- [ ] **Global**: mostra nota "Herdando o Tremor Global"; sliders locais ocultos.
- [ ] **Desligado**: trecho não treme; sliders locais ocultos.
- [ ] **Personalizado**: sliders Intensidade e Frequência ativos; valores locais
      substituem os globais. Entrar em Personalizado com intensidade 0 aplica
      0.4.

---

## 5. Persistência / JSON

- [ ] `buildProjectData()` salva `projectShake` e `segTremorSettings`
      (`mode/intensity/frequency`).
- [ ] `applyProjectData()` restaura ambos; `projectShake` ausente → default
      desligado; `segTremorSettings` migrado por `migrateSegTremorEntry`.
- [ ] Undo/redo: `captureState`/`restoreState`/`cloneProjectStateSnapshot`
      incluem `projectShake`.
- [ ] Novo projeto / abrir nova imagem reseta `projectShake` para o default
      desligado; aplicar template **não** apaga o Global (preserva preferência).

---

## 6. Checklist de aceite

1. [ ] Versão visível mostra **v8z4b29BO** (APP_VERSION, APP_VERSION_NAME, texto
   de versão, comentário do topo, CHANGELOG.md, QA.md).
2. [ ] Existe Tremor Global ligado/desligado.
3. [ ] Existe controle global de Intensidade.
4. [ ] Existe controle global de Frequência.
5. [ ] Cada trecho pode usar Global, Desligado ou Personalizado.
6. [ ] No modo Personalizado, o trecho tem Intensidade e Frequência próprias.
7. [ ] Frequência baixa deixa o tremor mais lento.
8. [ ] Frequência alta deixa o tremor mais rápido.
9. [ ] Intensidade continua controlando amplitude/força.
10. [ ] Tremor continua suave e orgânico.
11. [ ] Sem random duro/flicker.
12. [ ] Preview e MP4 mostram o mesmo comportamento.
13. [ ] Repetir Preview não muda aleatoriamente o efeito.
14. [ ] JSON antigo abre normalmente.
15. [ ] JSON novo salva e reabre as configurações de Tremor.
16. [ ] Tremor desligado não altera o visual do projeto.
17. [ ] Sem regressões no iPhone/Safari.

---

## 7. Regressão (preservação)

- [ ] Logo, ícone iOS, launcher inalterados.
- [ ] Fluxos Novo Projeto / Abrir Projeto inalterados.
- [ ] Stage, frame ativo, sincronização frame/timeline, timeline, largura de
      frames/trechos, snap, bolinhas, curvas/Bézier inalterados.
- [ ] Templates, formato, Preview, export MP4 (exceto inclusão do Tremor
      melhorado) inalterados.
- [ ] Ícones Iconoir aprovados e texto "Edição" preservados.
- [ ] Seleção múltipla e edição de trecho fora do Tremor inalteradas.
