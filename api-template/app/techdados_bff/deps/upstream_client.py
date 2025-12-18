"""Dependency de criação do client do upstream.

Mantém um client por request (simples) — depois podemos evoluir para lifespan e pool.
"""

from __future__ import annotations

import os
from typing import Annotated

from fastapi import Depends

from app.techdados_bff.config.upstream import TechDengueUpstreamSettings
from app.techdados_bff.integrations.techdengue_api.client import TechDengueAPIClient


def get_techdengue_settings() -> TechDengueUpstreamSettings:
    return TechDengueUpstreamSettings.from_env(os.environ)


async def get_techdengue_client(
    settings: Annotated[TechDengueUpstreamSettings, Depends(get_techdengue_settings)],
) -> TechDengueAPIClient:
    client = TechDengueAPIClient(
        base_url=settings.base_url,
        api_key=settings.api_key,
        timeout_s=settings.timeout_s,
        retries=settings.retries,
        default_cache_ttl_s=settings.cache_default_ttl_s,
    )
    try:
        yield client
    finally:
        await client.aclose()
