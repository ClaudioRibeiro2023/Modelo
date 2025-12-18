"""Helpers de autorização: roles e scopes.

Use como Depends() em rotas.
"""

from __future__ import annotations

from typing import Callable

from fastapi import Depends, HTTPException, Request

from app.techdados_bff.security.principal import Principal, get_principal


def require_roles(allowed: list[str]) -> Callable:
    allowed_set = set([a.lower() for a in allowed])

    def _dep(p: Principal = Depends(get_principal)) -> Principal:
        if not allowed_set:
            return p
        if any(r.lower() in allowed_set for r in (p.roles or [])):
            return p
        raise HTTPException(status_code=403, detail="Forbidden (role)")

    return _dep


def require_scopes(required: list[str]) -> Callable:
    req_set = set([s.lower() for s in required])

    def _dep(p: Principal = Depends(get_principal)) -> Principal:
        if not req_set:
            return p
        present = set([(s or "").lower() for s in (p.scopes or [])])
        if req_set.issubset(present):
            return p
        raise HTTPException(status_code=403, detail="Forbidden (scope)")

    return _dep
