from __future__ import annotations

import os
from typing import Any, Dict

from fastapi import APIRouter, Depends, Request

from app.techdados_bff.api.deps import user_ctx
from app.techdados_bff.security.models import UserContext
from app.techdados_bff.security.scope_filters import scope_metadata

router = APIRouter(tags=["auth"])


@router.get("/me")
async def me(request: Request, user: UserContext = Depends(user_ctx)) -> Dict[str, Any]:
    """Retorna o contexto do usuário autenticado.

    Objetivo:
    - Debug de autenticação/escopo (frontend e ops)
    - Fonte de verdade para navegação por perfil (roles) e recortes de escopo (scopes)

    Observação:
    - Se TD_AUTH_MODE=mock ou disabled, retorna o usuário simulado.
    """
    rid = getattr(getattr(request, "state", None), "request_id", None)
    return {
        "user_id": user.user_id,
        "roles": user.roles,
        "scopes": user.scopes,
        "scope": scope_metadata(user),
        "auth_mode": (os.getenv("TD_AUTH_MODE", "mock") or "mock").strip().lower(),
        "request_id": rid,
    }
