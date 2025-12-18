#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${1:-$(pwd)}"
REQ="$REPO_ROOT/api-template/requirements.txt"
DEP="python-jose[cryptography]>=3.3.0"

echo "== TechDados: patch requirements (auth) =="

if [ ! -f "$REQ" ]; then
  echo "requirements.txt não encontrado em $REQ" >&2
  exit 1
fi

if grep -Fq "$DEP" "$REQ"; then
  echo "Dependência já existe: $DEP"
else
  {
    echo ""
    echo "# --- TechDados auth (Bloco 07) ---"
    echo "$DEP"
  } >> "$REQ"
  echo "Adicionado: $DEP"
fi

python -m pip install -r "$REQ"
echo "OK"
