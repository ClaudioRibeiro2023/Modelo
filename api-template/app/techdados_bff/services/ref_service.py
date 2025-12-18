from __future__ import annotations

from typing import Any, Dict
from ..clients.provider_client import DataProviderClient
from ..core.settings import settings


class RefService:
    def __init__(self, provider: DataProviderClient):
        self.provider = provider

    async def municipios(self, scope_type: str, scope_id: str) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/ref/municipios", params={"scope_type": scope_type, "scope_id": scope_id})

        return {"scope": {"type": scope_type, "id": scope_id}, "rows": [], "note": "stub: TD_PROVIDER_ENABLED=0"}
