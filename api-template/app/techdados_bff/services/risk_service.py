from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict
from ..clients.provider_client import DataProviderClient
from ..core.settings import settings

MOCK_RISK_DATA = [
    {"codigo_ibge": "3106200", "municipio": "Belo Horizonte", "risk_score": 0.85, "risk_level": "alto", "drivers": ["alta incidência", "baixa cobertura"]},
    {"codigo_ibge": "3170206", "municipio": "Uberlândia", "risk_score": 0.72, "risk_level": "alto", "drivers": ["tendência crescente"]},
    {"codigo_ibge": "3118601", "municipio": "Contagem", "risk_score": 0.68, "risk_level": "medio", "drivers": ["densidade populacional"]},
    {"codigo_ibge": "3136702", "municipio": "Juiz de Fora", "risk_score": 0.55, "risk_level": "medio", "drivers": ["sazonalidade"]},
    {"codigo_ibge": "3106705", "municipio": "Betim", "risk_score": 0.62, "risk_level": "medio", "drivers": ["cobertura insuficiente"]},
    {"codigo_ibge": "3143302", "municipio": "Montes Claros", "risk_score": 0.45, "risk_level": "medio", "drivers": ["clima favorável"]},
    {"codigo_ibge": "3154606", "municipio": "Ribeirão das Neves", "risk_score": 0.38, "risk_level": "baixo", "drivers": []},
    {"codigo_ibge": "3170107", "municipio": "Uberaba", "risk_score": 0.32, "risk_level": "baixo", "drivers": []},
    {"codigo_ibge": "3131307", "municipio": "Ipatinga", "risk_score": 0.28, "risk_level": "baixo", "drivers": []},
    {"codigo_ibge": "3157807", "municipio": "Santa Luzia", "risk_score": 0.25, "risk_level": "baixo", "drivers": []},
]


class RiskService:
    def __init__(self, provider: DataProviderClient):
        self.provider = provider

    async def dashboard(self, scope_type: str, scope_id: str) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/risk/dashboard", params={"scope_type": scope_type, "scope_id": scope_id})

        alto = sum(1 for m in MOCK_RISK_DATA if m["risk_level"] == "alto")
        medio = sum(1 for m in MOCK_RISK_DATA if m["risk_level"] == "medio")
        baixo = sum(1 for m in MOCK_RISK_DATA if m["risk_level"] == "baixo")

        return {
            "summary": {
                "alto": alto,
                "medio": medio,
                "baixo": baixo,
                "total_municipios": len(MOCK_RISK_DATA),
            },
            "top_risco": MOCK_RISK_DATA[:5],
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

    async def municipio(self, codigo_ibge: str) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json(f"/risk/municipio/{codigo_ibge}")

        item = next((m for m in MOCK_RISK_DATA if m["codigo_ibge"] == codigo_ibge), None)
        if item:
            return item
        return {"codigo_ibge": codigo_ibge, "risk_level": "baixo", "risk_score": 0.1, "drivers": []}
