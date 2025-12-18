from __future__ import annotations

import random
from typing import Any, Dict
from ..clients.provider_client import DataProviderClient
from ..core.settings import settings

MOCK_OPS_DATA = [
    {"codigo_ibge": "3106200", "municipio": "Belo Horizonte", "uf": "MG", "ha_urbanos": 33100, "ha_mapeados": 28500, "pois_total": 45200, "devolutivas": 38100},
    {"codigo_ibge": "3170206", "municipio": "Uberlândia", "uf": "MG", "ha_urbanos": 15200, "ha_mapeados": 13800, "pois_total": 18500, "devolutivas": 16200},
    {"codigo_ibge": "3118601", "municipio": "Contagem", "uf": "MG", "ha_urbanos": 10500, "ha_mapeados": 8200, "pois_total": 12300, "devolutivas": 10100},
    {"codigo_ibge": "3136702", "municipio": "Juiz de Fora", "uf": "MG", "ha_urbanos": 12800, "ha_mapeados": 11500, "pois_total": 15600, "devolutivas": 14200},
    {"codigo_ibge": "3106705", "municipio": "Betim", "uf": "MG", "ha_urbanos": 8900, "ha_mapeados": 6500, "pois_total": 9800, "devolutivas": 7600},
    {"codigo_ibge": "3143302", "municipio": "Montes Claros", "uf": "MG", "ha_urbanos": 9200, "ha_mapeados": 8100, "pois_total": 11200, "devolutivas": 9800},
    {"codigo_ibge": "3154606", "municipio": "Ribeirão das Neves", "uf": "MG", "ha_urbanos": 6800, "ha_mapeados": 5200, "pois_total": 7500, "devolutivas": 6100},
    {"codigo_ibge": "3170107", "municipio": "Uberaba", "uf": "MG", "ha_urbanos": 7500, "ha_mapeados": 6800, "pois_total": 9200, "devolutivas": 8100},
    {"codigo_ibge": "3131307", "municipio": "Ipatinga", "uf": "MG", "ha_urbanos": 5200, "ha_mapeados": 4800, "pois_total": 6500, "devolutivas": 5900},
    {"codigo_ibge": "3157807", "municipio": "Santa Luzia", "uf": "MG", "ha_urbanos": 4500, "ha_mapeados": 3200, "pois_total": 4800, "devolutivas": 3500},
]


def _enrich_ops_data(data: list) -> list:
    result = []
    for m in data:
        cobertura_pct = round((m["ha_mapeados"] / m["ha_urbanos"]) * 100, 1) if m["ha_urbanos"] > 0 else 0
        result.append({
            **m,
            "cobertura_pct": cobertura_pct,
        })
    return sorted(result, key=lambda x: x["cobertura_pct"], reverse=True)


class OpsService:
    def __init__(self, provider: DataProviderClient):
        self.provider = provider

    async def cobertura(self, scope_type: str, scope_id: str, periodo: str = "month", limit: int = 20) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/operacao/cobertura", params={
                "scope_type": scope_type,
                "scope_id": scope_id,
                "periodo": periodo,
                "limit": limit,
            })

        rows = _enrich_ops_data(MOCK_OPS_DATA)[:limit]
        return {
            "data": rows,
            "meta": {
                "total": len(MOCK_OPS_DATA),
                "limit": limit,
                "offset": 0,
            },
        }

    async def pois(self, scope_type: str, scope_id: str, categoria: str | None = None) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/operacao/pois", params={
                "scope_type": scope_type,
                "scope_id": scope_id,
                "categoria": categoria,
            })

        return {"data": [], "meta": {"total": 0}}

    async def produtividade(self, scope_type: str, scope_id: str) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/operacao/produtividade", params={
                "scope_type": scope_type,
                "scope_id": scope_id,
            })

        return {"data": [], "meta": {"total": 0}}
