from __future__ import annotations

from typing import Any, Dict
from ..clients.provider_client import DataProviderClient
from ..core.settings import settings


class RiskService:
    def __init__(self, provider: DataProviderClient):
        self.provider = provider

    async def dashboard(self, scope_type: str, scope_id: str) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/risk/dashboard", params={"scope_type": scope_type, "scope_id": scope_id})

        return {"scope": {"type": scope_type, "id": scope_id}, "risk_level": None, "risk_score": None, "top_drivers": [], "note": "stub: TD_PROVIDER_ENABLED=0"}

    async def municipio(self, codigo_ibge: str) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json(f"/risk/municipio/{codigo_ibge}")

        return {"codigo_ibge": codigo_ibge, "risk_level": None, "risk_score": None, "drivers": [], "recommendations": [], "note": "stub: TD_PROVIDER_ENABLED=0"}
