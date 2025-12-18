from __future__ import annotations

import os
from fastapi import Request, HTTPException

from app.techdados_bff.security.models import UserContext
from app.techdados_bff.security.jwt_verifier import verify_and_decode_jwt
from app.techdados_bff.security.claims import extract_roles, extract_scopes


def _parse_csv_env(value: str | None) -> list[str]:
    if not value:
        return []
    return [v.strip() for v in value.split(",") if v.strip()]


async def user_ctx(request: Request) -> UserContext:
    """Dependency de usuário.

    Modos:
    - TD_AUTH_MODE=disabled: libera tudo (admin + STATE:MG) — útil só para bootstrap
    - TD_AUTH_MODE=mock: usa variáveis TD_MOCK_*
    - TD_AUTH_MODE=jwt: valida JWT (Keycloak) via JWKS e extrai roles/scopes
    """
    mode = (os.getenv("TD_AUTH_MODE", "mock") or "mock").strip().lower()

    if mode == "disabled":
        return UserContext(user_id="disabled", roles=["admin"], scopes=["STATE:MG"])

    if mode == "mock":
        uid = os.getenv("TD_MOCK_USER_ID", "dev")
        roles = _parse_csv_env(os.getenv("TD_MOCK_ROLES", "admin"))
        scopes = _parse_csv_env(os.getenv("TD_MOCK_SCOPES", "STATE:MG"))
        return UserContext(user_id=uid, roles=roles, scopes=scopes)

    if mode == "jwt":
        auth = request.headers.get("authorization") or request.headers.get("Authorization")
        if not auth or not auth.lower().startswith("bearer "):
            raise HTTPException(status_code=401, detail="Authorization Bearer token ausente")

        token = auth.split(" ", 1)[1].strip()
        if not token:
            raise HTTPException(status_code=401, detail="Bearer token vazio")

        claims = await verify_and_decode_jwt(token)

        user_id = (
            claims.get("preferred_username")
            or claims.get("email")
            or claims.get("sub")
            or "unknown"
        )
        roles = extract_roles(claims)
        scopes = extract_scopes(claims)

        return UserContext(user_id=str(user_id), roles=roles, scopes=scopes)

    # default seguro: sem roles => 403 em tudo (policy)
    return UserContext(user_id="unknown", roles=[], scopes=[])
