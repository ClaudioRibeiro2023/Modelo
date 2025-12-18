from __future__ import annotations

from ..core.errors import ForbiddenError
from .models import UserContext


def normalize_scope(scope_type: str, scope_id: str) -> str:
    st = (scope_type or "").strip().upper()
    sid = (scope_id or "").strip()
    return f"{st}:{sid}"


def is_scope_allowed(user: UserContext, requested_scope: str) -> bool:
    req = (requested_scope or "").strip().upper()
    user_scopes = [s.strip().upper() for s in user.scopes]

    if req in user_scopes:
        return True

    # regra MVP: STATE:MG “cobre tudo”
    if "STATE:MG" in user_scopes:
        return True

    return False


def require_scope(user: UserContext, scope_type: str, scope_id: str) -> str:
    req = normalize_scope(scope_type, scope_id)
    if not is_scope_allowed(user, req):
        raise ForbiddenError(message="Escopo territorial não permitido", details={"requested": req, "user_scopes": user.scopes})
    return req
