from __future__ import annotations

import random
from typing import Any, Dict
from ..clients.provider_client import DataProviderClient
from ..core.settings import settings

MOCK_MUNICIPIOS_MG = [
    {"codigo_ibge": "3106200", "municipio": "Belo Horizonte", "uf": "MG", "pop": 2521564},
    {"codigo_ibge": "3170206", "municipio": "Uberlândia", "uf": "MG", "pop": 699097},
    {"codigo_ibge": "3118601", "municipio": "Contagem", "uf": "MG", "pop": 663855},
    {"codigo_ibge": "3136702", "municipio": "Juiz de Fora", "uf": "MG", "pop": 573285},
    {"codigo_ibge": "3106705", "municipio": "Betim", "uf": "MG", "pop": 444784},
    {"codigo_ibge": "3143302", "municipio": "Montes Claros", "uf": "MG", "pop": 413487},
    {"codigo_ibge": "3154606", "municipio": "Ribeirão das Neves", "uf": "MG", "pop": 334858},
    {"codigo_ibge": "3170107", "municipio": "Uberaba", "uf": "MG", "pop": 337092},
    {"codigo_ibge": "3131307", "municipio": "Ipatinga", "uf": "MG", "pop": 263410},
    {"codigo_ibge": "3157807", "municipio": "Santa Luzia", "uf": "MG", "pop": 218897},
    {"codigo_ibge": "3162500", "municipio": "Sete Lagoas", "uf": "MG", "pop": 239639},
    {"codigo_ibge": "3122306", "municipio": "Divinópolis", "uf": "MG", "pop": 238230},
    {"codigo_ibge": "3127701", "municipio": "Governador Valadares", "uf": "MG", "pop": 279665},
    {"codigo_ibge": "3151800", "municipio": "Poços de Caldas", "uf": "MG", "pop": 168641},
    {"codigo_ibge": "3148103", "municipio": "Patos de Minas", "uf": "MG", "pop": 152488},
]


def _generate_mock_ranking(municipios: list, limit: int) -> list:
    random.seed(42)
    result = []
    for m in municipios[:limit]:
        casos = random.randint(50, 2000)
        incidencia = round((casos / m["pop"]) * 100000, 1)
        result.append({
            "codigo_ibge": m["codigo_ibge"],
            "municipio": m["municipio"],
            "uf": m["uf"],
            "casos": casos,
            "incidencia_100k": incidencia,
            "variacao_pct": round(random.uniform(-15, 25), 1),
        })
    return sorted(result, key=lambda x: x["incidencia_100k"], reverse=True)


class EpiService:
    def __init__(self, provider: DataProviderClient):
        self.provider = provider

    async def ranking(self, scope_type: str, scope_id: str, period_type: str = "SE", year: int | None = None, limit: int = 20) -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/epi/ranking", params={"scope_type": scope_type, "scope_id": scope_id, "period_type": period_type, "year": year, "limit": limit})

        rows = _generate_mock_ranking(MOCK_MUNICIPIOS_MG, limit)
        return {
            "data": rows,
            "meta": {
                "total": len(MOCK_MUNICIPIOS_MG),
                "limit": limit,
                "offset": 0,
                "period_type": period_type,
                "year": year or 2024,
            },
        }

    async def tendencia(self, scope_type: str, scope_id: str, window: str = "12w") -> Dict[str, Any]:
        if settings.provider_enabled:
            return await self.provider.get_json("/epi/tendencia", params={"scope_type": scope_type, "scope_id": scope_id, "window": window})

        return {"scope": {"type": scope_type, "id": scope_id}, "window": window, "series": [], "note": "stub: TD_PROVIDER_ENABLED=0"}
