from __future__ import annotations

from typing import Any, Dict
from ..clients.provider_client import DataProviderClient
from ..core.settings import settings


class HomeService:
    def __init__(self, provider: DataProviderClient):
        self.provider = provider

    async def panorama(self, scope_type: str, scope_id: str, window: str | None = None, date_from: str | None = None, date_to: str | None = None) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/home/panorama", params={"scope_type": scope_type, "scope_id": scope_id, "window": window, "from": date_from, "to": date_to})

        return {
            "scope": {"type": scope_type, "id": scope_id},
            "window": window or "8w",
            "kpis": {"casos_periodo": None, "variacao_wow": None, "risco_medio": None},
            "note": "stub: TD_PROVIDER_ENABLED=0",
        }

    async def alertas(self, scope_type: str, scope_id: str) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/home/alertas", params={"scope_type": scope_type, "scope_id": scope_id})

        return {"scope": {"type": scope_type, "id": scope_id}, "alerts": [], "note": "stub: TD_PROVIDER_ENABLED=0"}
