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
        from app.techdados_bff.api.routes.me import router as me_router
        app.include_router(me_router, prefix="/api/v1", tags=["me"])
    except Exception as e:  # pragma: no cover
        import logging
        logging.getLogger("techdados.bff").warning("me router not wired: %s", e)

    # /nav (Bloco 14) — navegação baseada em roles
    try:
        from app.techdados_bff.routers.nav import router as nav_router
        app.include_router(nav_router, prefix="/api/v1", tags=["nav"])
    except Exception as e:  # pragma: no cover
        import logging
        logging.getLogger("techdados.bff").warning("nav router not wired: %s", e)
