#!/usr/bin/env bash
# collect-context.sh — coleta determinística de fatos para a Skill arco-pr-review.
#
# Este script apenas IMPRIME fatos. Ele não decide merge-readiness, não aprova,
# não reprova e não altera nada. A interpretação é sempre do agente que executa
# a Skill (ver SKILL.md). Se uma fonte não estiver disponível, ele diz isso em
# vez de inventar.
#
# Uso:
#   scripts/collect-context.sh [PR_NUMBER]
#
# Fatos locais (branch, HEADs, base, origin/main) vêm de `git`. Fatos de PR e de
# checks precisam da GitHub API/connector ou de `gh`; quando `gh` não existir,
# o script indica onde o agente deve buscar esses dados.

set -u

section() { printf '\n== %s ==\n' "$1"; }

section "Repositório"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  origin_url="$(git config --get remote.origin.url 2>/dev/null || echo 'desconhecido')"
  echo "remote.origin.url: ${origin_url}"
  case "${origin_url}" in
    *rowestudio/arco-app-test*) echo "confirmação: repo de DESENVOLVIMENTO/teste (esperado)";;
    *rowestudio/arco-app*)      echo "ATENÇÃO: parece ser PRODUÇÃO (rowestudio/arco-app) — fora do escopo da Skill";;
    *)                          echo "ATENÇÃO: remote não reconhecido — confirme o repositório antes de revisar";;
  esac
else
  echo "não é um repositório git"
  exit 1
fi

section "Sincronização com o remoto"
git fetch origin --quiet 2>/dev/null && echo "git fetch origin: ok" || echo "git fetch origin: falhou (sem rede?) — os SHAs abaixo podem estar defasados"

section "Branch e HEADs locais"
echo "branch atual: $(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
echo "HEAD local:   $(git rev-parse HEAD 2>/dev/null)"
echo "origin/main:  $(git rev-parse origin/main 2>/dev/null || echo 'indisponível')"

PR_NUMBER="${1:-}"

section "Contexto da PR"
if command -v gh >/dev/null 2>&1; then
  if [ -n "${PR_NUMBER}" ]; then
    gh pr view "${PR_NUMBER}" --json number,title,author,state,isDraft,headRefName,baseRefName,headRefOid,baseRefOid,mergeable,mergeStateStatus 2>/dev/null \
      || echo "gh não conseguiu ler a PR #${PR_NUMBER} (permissão/rede?)"
  else
    gh pr view --json number,title,author,state,isDraft,headRefName,baseRefName,headRefOid,baseRefOid,mergeable,mergeStateStatus 2>/dev/null \
      || echo "nenhuma PR resolvida para a branch atual; passe o número: scripts/collect-context.sh <PR>"
  fi
else
  echo "gh indisponível neste ambiente."
  echo "Busque os dados da PR (estado, draft, título, autor, head/base SHA, mergeability)"
  echo "pela GitHub API / connector de GitHub disponível ao agente."
fi

section "Checks do HEAD atual da PR"
HEAD_SHA=""
if command -v gh >/dev/null 2>&1; then
  HEAD_SHA="$(gh pr view ${PR_NUMBER:-} --json headRefOid -q .headRefOid 2>/dev/null || true)"
fi
if command -v gh >/dev/null 2>&1 && [ -n "${HEAD_SHA}" ]; then
  echo "HEAD SHA da PR: ${HEAD_SHA}"
  gh api "repos/{owner}/{repo}/commits/${HEAD_SHA}/check-runs" \
    -q '.check_runs[] | "\(.name): status=\(.status) conclusion=\(.conclusion // "-") sha=\(.head_sha)"' 2>/dev/null \
    || echo "não foi possível ler check-runs via gh"
else
  echo "Consulte os check-runs SEMPRE no HEAD SHA atual da PR (não no SHA anterior),"
  echo "via GitHub API / connector. Reporte cada gate relevante individualmente:"
  echo "nome, SHA, status e conclusão (PASS/FAIL/PENDING/SKIPPED/NOT APPLICABLE/NOT VERIFIED)."
fi

section "Workflows presentes (descoberta dinâmica dos gates)"
if [ -d ".github/workflows" ]; then
  for f in .github/workflows/*.y*ml; do
    [ -e "$f" ] || continue
    name_line="$(grep -m1 -E '^name:' "$f" 2>/dev/null | sed 's/^name:[[:space:]]*//')"
    echo "- ${f}: ${name_line:-<sem name>}"
  done
  echo "(leia o conteúdo do workflow para saber o que cada job realmente valida)"
else
  echo ".github/workflows/ não encontrado"
fi

section "Lembrete"
echo "Este script NÃO decide aprovação. Siga o workflow do SKILL.md para interpretar os fatos."
