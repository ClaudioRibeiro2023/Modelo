"""Principal do usuário (roles/scopes/território).

Este módulo padroniza como o BFF entende o usuário, independentemente do provedor de auth.

- Preferência: usar `request.state.principal` preenchido por middleware de auth (JWT validado).
- Fallback (dev): decodifica JWT sem validar assinatura (controlado por env).
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

from fastapi import Request, HTTPException


def _parse_list(v: Any) -> list[str]:
    if not v:
        return []
    if isinstance(v, list):
        return [str(x).strip() for x in v if str(x).strip()]
    if isinstance(v, str):
        s = v.strip()
        if not s:
            return []
        if "," in s:
            return [p.strip() for p in s.split(",") if p.strip()]
        return [p.strip() for p in s.split(" ") if p.strip()]
    return []


@dataclass
class Territory:
    ufs: list[str]
    municipios: list[str]


@dataclass
class Principal:
    id: str
    roles: list[str]
    scopes: list[str]
    territory: Territory | None = None
    raw: dict[str, Any] | None = None


def _decode_jwt_unverified(token: str) -> dict[str, Any]:
    # Sem dependências externas: decode base64url do payload.
    import base64
    import json

    try:
        parts = token.split(".")
        if len(parts) < 2:
            return {}
        payload_b64 = parts[1].replace("-", "+").replace("_", "/")
        payload_b64 += "=" * (-len(payload_b64) % 4)
        data = base64.b64decode(payload_b64.encode("utf-8"))
        return json.loads(data.decode("utf-8"))
    except Exception:
        return {}


def build_principal_from_claims(claims: dict[str, Any]) -> Principal:
    client_id = os.getenv("TD_JWT_CLIENT_ID", "techdados")
    scopes_claim = os.getenv("TD_JWT_SCOPES_CLAIM", "td_scopes")
    territory_claim = os.getenv("TD_JWT_TERRITORY_CLAIM", "td_territory")

    user_id = claims.get("preferred_username") or claims.get("email") or claims.get("sub") or "unknown"

    roles: list[str] = []
    ra = claims.get("resource_access") or {}
    if isinstance(ra, dict) and isinstance(ra.get(client_id), dict):
        roles = _parse_list(ra.get(client_id, {}).get("roles"))
    if not roles:
        realm = claims.get("realm_access") or {}
        if isinstance(realm, dict):
            roles = _parse_list(realm.get("roles"))
    if not roles:
        roles = _parse_list(claims.get("roles"))

    scopes = _parse_list(claims.get(scopes_claim)) or _parse_list(claims.get("scopes")) or _parse_list(claims.get("scope"))

    terr: Territory | None = None
    terr_raw = claims.get(territory_claim)
    if isinstance(terr_raw, dict):
        terr = Territory(
            ufs=_parse_list(terr_raw.get("ufs")),
            municipios=_parse_list(terr_raw.get("municipios")),
        )

    return Principal(
        id=str(user_id),
        roles=[r.lower() for r in roles],
        scopes=[s.lower() for s in scopes],
        territory=terr,
        raw=claims,
    )


def get_principal(request: Request) -> Principal:
    # Preferência: middleware validado
    p = getattr(request.state, "principal", None)
    if isinstance(p, Principal):
        return p

    # Dev fallback (UNVERIFIED)
    allow_fallback = os.getenv("TD_AUTH_FALLBACK_UNVERIFIED_JWT", "false").lower() == "true"
    if allow_fallback:
        auth = request.headers.get("authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
            claims = _decode_jwt_unverified(token)
            return build_principal_from_claims(claims)

    raise HTTPException(status_code=401, detail="Unauthorized (principal missing)")
