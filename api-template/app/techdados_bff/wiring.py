"""Wiring central do TechDados BFF.

A ideia é manter o `main.py` pequeno e com uma única chamada:
    wire_techdados_app(app)

Este arquivo inclui routers canônicos (quando existirem).
"""

from __future__ import annotations

from fastapi import FastAPI

def wire_techdados_app(app: FastAPI) -> None:
    # Router upstream (Bloco 12)
    try:
        from app.techdados_bff.routers.techdengue_api import router as techdengue_router
        app.include_router(techdengue_router, prefix="/api/v1/techdengue", tags=["techdengue-upstream"])
    except Exception as e:  # pragma: no cover
        # Não quebrar startup caso ainda não exista; serve para aplicação progressiva.
        app.logger.warning("techdengue_api router not wired: %s", e) if hasattr(app, "logger") else None

    # /me (Bloco 10) — tenta incluir se existir
    try:
        from app.techdados_bff.routers.me import router as me_router
        app.include_router(me_router, prefix="/api/v1", tags=["me"])
    except Exception as e:  # pragma: no cover
        app.logger.warning("me router not wired: %s", e) if hasattr(app, "logger") else None
