from __future__ import annotations

from typing import Any
from app.techdados_bff.services._common import TechdengueUpstream


async def analyze_risk(payload: dict) -> Any:
    async with TechdengueUpstream() as api:
        return await api.risk_analyze(payload)


async def get_risk_dashboard() -> Any:
    async with TechdengueUpstream() as api:
        return await api.risk_dashboard()


async def get_risk_municipio(codigo_ibge: str) -> Any:
    async with TechdengueUpstream() as api:
        return await api.risk_municipio(codigo_ibge)
