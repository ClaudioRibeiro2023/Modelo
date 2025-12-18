from __future__ import annotations

import os
from typing import Any, Dict, List


def _env(name: str, default: str | None = None) -> str | None:
    v = os.getenv(name)
    if v is None:
        return default
    return v.strip()


def extract_roles(claims: Dict[str, Any]) -> List[str]:
    client_id = _env("TD_JWT_CLIENT_ID", "techdados") or "techdados"

    # 1) resource_access[client_id].roles
    ra = claims.get("resource_access") or {}
    if isinstance(ra, dict):
        client = ra.get(client_id) or {}
        if isinstance(client, dict):
            roles = client.get("roles")
            if isinstance(roles, list):
                return [str(r) for r in roles]

    # 2) realm_access.roles
    realm = claims.get("realm_access") or {}
    if isinstance(realm, dict):
        roles = realm.get("roles")
        if isinstance(roles, list):
            return [str(r) for r in roles]

    # 3) roles
    roles = claims.get("roles")
    if isinstance(roles, list):
        return [str(r) for r in roles]
    if isinstance(roles, str) and roles.strip():
        # csv/space separated
        sep = "," if "," in roles else " "
        return [r.strip() for r in roles.split(sep) if r.strip()]

    return []


def extract_scopes(claims: Dict[str, Any]) -> List[str]:
    claim_name = _env("TD_JWT_SCOPES_CLAIM", "td_scopes") or "td_scopes"
    raw = claims.get(claim_name)

    def parse_any(v: Any) -> List[str]:
        if v is None:
            return []
        if isinstance(v, list):
            return [str(x).strip() for x in v if str(x).strip()]
        if isinstance(v, str):
            s = v.strip()
            if not s:
                return []
            if "," in s:
                return [p.strip() for p in s.split(",") if p.strip()]
            # space separated
            return [p.strip() for p in s.split(" ") if p.strip()]
        return []

    scopes = parse_any(raw)
    if scopes:
        return scopes

    # fallbacks comuns
    scopes = parse_any(claims.get("scopes"))
    if scopes:
        return scopes

    scopes = parse_any(claims.get("scope"))
    if scopes:
        return scopes

    scopes = parse_any(claims.get("territory_scopes"))
    if scopes:
        return scopes

    return []
