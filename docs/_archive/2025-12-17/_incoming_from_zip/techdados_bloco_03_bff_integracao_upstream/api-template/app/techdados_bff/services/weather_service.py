from __future__ import annotations

from typing import Any
from app.techdados_bff.services._common import TechdengueUpstream


async def get_weather_city(cidade: str) -> Any:
    async with TechdengueUpstream() as api:
        return await api.weather_city(cidade)


async def get_weather_all() -> Any:
    async with TechdengueUpstream() as api:
        return await api.weather_all()


async def get_weather_risk(cidade: str) -> Any:
    async with TechdengueUpstream() as api:
        return await api.weather_risk(cidade)
