from __future__ import annotations

import httpx
from app.techdados_bff.core.settings import UpstreamSettings


def build_async_client(settings: UpstreamSettings) -> httpx.AsyncClient:
    headers = {
        "User-Agent": settings.user_agent,
        "Accept": "application/json",
    }
    # API Key é opcional; se existir, enviamos por padrão
    if settings.api_key:
        headers["X-API-Key"] = settings.api_key

    return httpx.AsyncClient(
        base_url=settings.base_url,
        headers=headers,
        timeout=httpx.Timeout(settings.timeout_seconds),
        verify=settings.verify_ssl,
        follow_redirects=True,
    )
