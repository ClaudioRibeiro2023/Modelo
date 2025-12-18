from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional, Set, Tuple

from .models import UserContext


MUNICIPIO_PREFIXES = ("MUNICIPIO:", "MUN:", "MUNICIP:", "IBGE:")


def allowed_municipio_codes(user: UserContext) -> Set[str]:
    codes: Set[str] = set()
    for s in (user.scopes or []):
        up = (s or "").strip().upper()
        for p in MUNICIPIO_PREFIXES:
            if up.startswith(p):
                codes.add(up.split(":", 1)[1].strip())
    return {c for c in codes if c}


def _extract_code(row: Dict[str, Any]) -> Optional[str]:
    # tenta várias chaves comuns
    for key in ("codigo_ibge", "cod_ibge", "ibge", "cd_ibge", "codigo_municipio", "cd_municipio", "municipio_ibge"):
        if key in row and row[key] is not None:
            v = str(row[key]).strip()
            if v:
                return v
    return None


def filter_rows_by_municipio(rows: List[Dict[str, Any]], allowed_codes: Set[str]) -> List[Dict[str, Any]]:
    """
    MVP: filtra somente quando o registro possui código IBGE identificável.
    Se não houver código, o registro é descartado (safe-by-default).
    """
    if not allowed_codes:
        return rows

    out: List[Dict[str, Any]] = []
    for r in rows:
        code = _extract_code(r)
        if code and code in allowed_codes:
            out.append(r)
    return out


def scope_metadata(user: UserContext) -> Dict[str, Any]:
    codes = sorted(list(allowed_municipio_codes(user)))
    return {
        "has_state_mg": any((s or "").strip().upper() == "STATE:MG" for s in (user.scopes or [])),
        "municipios": codes,
        "scopes": [s for s in (user.scopes or [])],
    }
