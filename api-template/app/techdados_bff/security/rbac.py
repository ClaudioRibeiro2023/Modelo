from __future__ import annotations

from typing import Iterable
from ..core.errors import ForbiddenError
from .models import UserContext


def require_roles(user: UserContext, allowed: Iterable[str]) -> None:
    allowed_lc = {a.lower() for a in allowed}
    if not any(r.lower() in allowed_lc for r in user.roles):
        raise ForbiddenError(message="Role insuficiente", details={"required_any": sorted(list(allowed_lc)), "user_roles": user.roles})
