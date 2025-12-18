from __future__ import annotations

import os
from fastapi import Depends
from app.techdados_bff.security.models import UserContext


def _parse_csv_env(value: str | None) -> list[str]:
    if not value:
        return []
    return [v.strip() for v in value.split(",") if v.strip()]


def user_ctx() -> UserContext:
    """Dependency de usuário.

    Modos:
    - TD_AUTH_MODE=disabled: libera tudo (admin + STATE:MG) — útil só para bootstrap
    - TD_AUTH_MODE=mock: usa variáveis TD_MOCK_*
    - (futuro) TD_AUTH_MODE=jwt: parse do token/claims (Bloco 06/07)
    """
    mode = (os.getenv("TD_AUTH_MODE", "mock") or "mock").strip().lower()

    if mode == "disabled":
        return UserContext(user_id="disabled", roles=["admin"], scopes=["STATE:MG"])

    if mode == "mock":
        uid = os.getenv("TD_MOCK_USER_ID", "dev")
        roles = _parse_csv_env(os.getenv("TD_MOCK_ROLES", "admin"))
        scopes = _parse_csv_env(os.getenv("TD_MOCK_SCOPES", "STATE:MG"))
        return UserContext(user_id=uid, roles=roles, scopes=scopes)

    # default seguro: sem roles => 403 em tudo
    return UserContext(user_id="unknown", roles=[], scopes=[])
