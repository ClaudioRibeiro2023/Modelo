from __future__ import annotations

from typing import Any, Dict
from ..clients.provider_client import DataProviderClient
from ..core.settings import settings


class WeatherService:
    def __init__(self, provider: DataProviderClient):
        self.provider = provider

    async def city(self, city: str) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json(f"/weather/{city}")

        return {"city": city, "timestamp": None, "temp_c": None, "humidity_pct": None, "rain_mm": None, "forecast": [], "note": "stub: TD_PROVIDER_ENABLED=0"}
