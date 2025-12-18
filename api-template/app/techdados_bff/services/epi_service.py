from __future__ import annotations

from typing import Any, Dict
from ..clients.provider_client import DataProviderClient
from ..core.settings import settings


class EpiService:
    def __init__(self, provider: DataProviderClient):
        self.provider = provider

    async def ranking(self, scope_type: str, scope_id: str, period_type: str = "SE", year: int | None = None, limit: int = 20) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/epi/ranking", params={"scope_type": scope_type, "scope_id": scope_id, "period_type": period_type, "year": year, "limit": limit})

        return {"scope": {"type": scope_type, "id": scope_id}, "period_type": period_type, "year": year, "limit": limit, "rows": [], "note": "stub: TD_PROVIDER_ENABLED=0"}

    async def tendencia(self, scope_type: str, scope_id: str, window: str = "12w") -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/epi/tendencia", params={"scope_type": scope_type, "scope_id": scope_id, "window": window})

        return {"scope": {"type": scope_type, "id": scope_id}, "window": window, "series": [], "note": "stub: TD_PROVIDER_ENABLED=0"}
