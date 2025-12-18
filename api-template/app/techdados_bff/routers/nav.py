"""Router /nav — árvore de navegação baseada em roles.

Este endpoint é útil para:
- sidebar/menu dinâmico
- esconder módulos conforme perfil
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from app.techdados_bff.security.principal import Principal, get_principal


router = APIRouter()


CATALOG = [
    {"id": "home", "label": "Visão geral", "path": "/", "allowedRoles": ["admin", "strategic", "tactical"]},
    {"id": "epi", "label": "Epidemiologia", "path": "/epi", "allowedRoles": ["admin", "strategic", "tactical", "operational"]},
    {"id": "ops", "label": "Operação", "path": "/ops", "allowedRoles": ["admin", "tactical", "operational"]},
    {"id": "etl", "label": "ETL / Qualidade", "path": "/etl", "allowedRoles": ["admin", "audit"]},
    {"id": "audit", "label": "Auditoria", "path": "/audit", "allowedRoles": ["admin", "audit"]},
    {"id": "admin", "label": "Admin", "path": "/admin", "allowedRoles": ["admin"]},
]


def _allowed(item: dict, roles: list[str]) -> bool:
    allowed = [r.lower() for r in item.get("allowedRoles", [])]
    if not allowed:
        return True
    s = set([r.lower() for r in roles or []])
    return any(a in s for a in allowed)


@router.get("/nav")
async def nav(p: Principal = Depends(get_principal)):
    roles = [r.lower() for r in (p.roles or [])]
    nav_items = [it for it in CATALOG if _allowed(it, roles)]
    return {"user": {"id": p.id, "roles": roles, "scopes": p.scopes}, "nav": nav_items}
