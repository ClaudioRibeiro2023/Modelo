from __future__ import annotations

import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.techdados_bff.core.logging import setup_logging
from app.techdados_bff.core.request_id import RequestIdMiddleware
from app.techdados_bff.api.router import router as api_router


def _csv_env(name: str, default: str) -> list[str]:
    raw = os.getenv(name, default) or default
    return [v.strip() for v in raw.split(",") if v.strip()]


def create_app() -> FastAPI:
    setup_logging()
    log = logging.getLogger("techdados.bff")

    app = FastAPI(
        title="TechDados BFF",
        version=os.getenv("TD_BFF_VERSION", "0.1.0"),
        docs_url="/docs",
        redoc_url=None,
        openapi_url="/openapi.json",
    )

    # RequestId header (x-request-id)
    app.add_middleware(RequestIdMiddleware)

    # CORS: libere apenas origens necessárias (default: frontend local do template)
    cors_origins = _csv_env("TD_CORS_ORIGINS", "http://localhost:13000,http://127.0.0.1:13000")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["x-request-id"],
    )

    # API
    app.include_router(api_router, prefix="/api")

    @app.get("/health")
    async def health():
        return {"ok": True}

    log.info("TechDados BFF iniciado", extra={"cors_origins": cors_origins})
    return app


app = create_app()
