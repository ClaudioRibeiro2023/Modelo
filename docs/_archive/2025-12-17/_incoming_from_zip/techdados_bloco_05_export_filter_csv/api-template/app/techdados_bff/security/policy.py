from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Iterable, Optional, Set, Tuple

from ..core.errors import ForbiddenError, BadRequestError
from .models import UserContext


class ExportLevel(str, Enum):
    AGGREGATED = "aggregated"
    ANONYMIZED = "anonymized"
    FULL = "full"


ROLE_ADMIN = "admin"
ROLE_AUDIT = "audit"
ROLE_STRATEGIC = "strategic"
ROLE_TACTICAL = "tactical"
ROLE_OPERATIONAL = "operational"
ROLE_SUPPORT = "support"


_ROLE_SYNONYMS = {
    "estrategico": ROLE_STRATEGIC,
    "tatico": ROLE_TACTICAL,
    "operacional": ROLE_OPERATIONAL,
    "apoio": ROLE_SUPPORT,
    "apoio_indireto": ROLE_SUPPORT,
    "auditoria": ROLE_AUDIT,
    "administrador": ROLE_ADMIN,
    "strategy": ROLE_STRATEGIC,
    "tactic": ROLE_TACTICAL,
    "ops": ROLE_OPERATIONAL,
}


def normalize_role(role: str) -> str:
    r = (role or "").strip().lower()
    return _ROLE_SYNONYMS.get(r, r)


def normalized_roles(user: UserContext) -> Set[str]:
    return {normalize_role(r) for r in (user.roles or [])}


def has_any_role(user: UserContext, allowed: Iterable[str]) -> bool:
    user_roles = normalized_roles(user)
    allowed_norm = {normalize_role(a) for a in allowed}
    return any(r in allowed_norm for r in user_roles)


def require_any_role(user: UserContext, allowed: Iterable[str], *, action: str | None = None) -> None:
    if not has_any_role(user, allowed):
        raise ForbiddenError(
            message="Role insuficiente",
            details={
                "action": action or "unknown",
                "required_any": sorted(list({normalize_role(a) for a in allowed})),
                "user_roles": sorted(list(normalized_roles(user))),
            },
        )


@dataclass(frozen=True)
class EndpointPolicy:
    allowed_roles: Tuple[str, ...]
    max_limit_non_admin: int
    export_min_level: Optional[ExportLevel] = None
    allow_export_with_municipio_scope: bool = False  # csv pode ser liberado via filter


def endpoint_policy(endpoint: str) -> EndpointPolicy:
    ep = (endpoint or "").strip().lower()

    if ep == "facts":
        return EndpointPolicy(
            allowed_roles=(ROLE_ADMIN, ROLE_AUDIT, ROLE_STRATEGIC, ROLE_TACTICAL, ROLE_OPERATIONAL, ROLE_SUPPORT),
            max_limit_non_admin=5000,
            export_min_level=ExportLevel.ANONYMIZED,
            allow_export_with_municipio_scope=True,
        )

    if ep == "dengue":
        return EndpointPolicy(
            allowed_roles=(ROLE_ADMIN, ROLE_AUDIT, ROLE_STRATEGIC, ROLE_TACTICAL, ROLE_OPERATIONAL),
            max_limit_non_admin=5000,
            export_min_level=None,
        )

    if ep == "municipios":
        return EndpointPolicy(
            allowed_roles=(ROLE_ADMIN, ROLE_AUDIT, ROLE_STRATEGIC, ROLE_TACTICAL, ROLE_OPERATIONAL, ROLE_SUPPORT),
            max_limit_non_admin=2000,
            export_min_level=None,
        )

    if ep == "gold":
        return EndpointPolicy(
            allowed_roles=(ROLE_ADMIN, ROLE_AUDIT, ROLE_STRATEGIC, ROLE_TACTICAL),
            max_limit_non_admin=20000,
            export_min_level=ExportLevel.FULL,
            allow_export_with_municipio_scope=True,
        )

    if ep == "risk":
        return EndpointPolicy(
            allowed_roles=(ROLE_ADMIN, ROLE_AUDIT, ROLE_STRATEGIC, ROLE_TACTICAL),
            max_limit_non_admin=500,
            export_min_level=None,
        )

    if ep == "monitor":
        return EndpointPolicy(
            allowed_roles=(ROLE_ADMIN, ROLE_AUDIT),
            max_limit_non_admin=100,
            export_min_level=None,
        )

    return EndpointPolicy(
        allowed_roles=(ROLE_ADMIN,),
        max_limit_non_admin=100,
        export_min_level=None,
    )


def cap_limit(user: UserContext, requested: int, policy: EndpointPolicy) -> int:
    req = int(requested or 0)
    if req <= 0:
        raise BadRequestError(message="limit inválido")
    if has_any_role(user, (ROLE_ADMIN,)):
        return req
    return min(req, policy.max_limit_non_admin)


def user_has_municipio_scope(user: UserContext) -> bool:
    scopes = [s.strip().upper() for s in (user.scopes or [])]
    return any(s.startswith("MUNICIPIO:") for s in scopes)


def require_export_allowed(user: UserContext, policy: EndpointPolicy, *, endpoint: str, requested_format: str) -> None:
    fmt = (requested_format or "json").strip().lower()
    if fmt == "json":
        return

    if policy.export_min_level is None:
        raise ForbiddenError(message="Exportação não permitida para este endpoint", details={"endpoint": endpoint, "format": fmt})

    if not has_any_role(user, (ROLE_ADMIN, ROLE_AUDIT, ROLE_STRATEGIC, ROLE_TACTICAL)):
        raise ForbiddenError(message="Exportação não permitida para este perfil", details={"endpoint": endpoint, "format": fmt})

    if user_has_municipio_scope(user) and not policy.allow_export_with_municipio_scope:
        raise ForbiddenError(
            message="Exportação com escopo municipal não está habilitada para este endpoint",
            details={"endpoint": endpoint, "format": fmt},
        )
