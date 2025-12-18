"""Middleware opcional de auditoria.

Registra duração/status para qualquer request.
Você pode limitar por prefix (ex.: /api/v1/techdengue).
"""

from __future__ import annotations

import time
from typing import Callable

from fastapi import Request, Response

from app.techdados_bff.audit.access import audit_access


async def access_audit_middleware(request: Request, call_next: Callable):
    start = time.time()
    resp: Response = await call_next(request)
    dur_ms = int((time.time() - start) * 1000)

    # Exemplo de filtro: auditar apenas endpoints de dados
    if request.url.path.startswith("/api/v1/techdengue"):
        audit_access(
            request,
            action="http_request",
            resource="techdengue_proxy",
            status=resp.status_code,
            extra={"duration_ms": dur_ms},
        )

    return resp
