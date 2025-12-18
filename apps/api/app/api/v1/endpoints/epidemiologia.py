"""
TechDados BFF - Epidemiologia Endpoints
Endpoints para dados epidemiológicos (ranking, tendência)
"""
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from ....core.security import get_current_user, CurrentUser
from ....core.settings import get_settings, Settings
from ....core.cache import get_cache, InMemoryCache
from ....core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(tags=["Epidemiologia"])


class EpiRankingItem(BaseModel):
    """Item de ranking epidemiológico"""
    codigo_ibge: str
    municipio: str
    uf: str
    casos: int
    incidencia_100k: float
    variacao_pct: Optional[float] = None


class EpiRankingMeta(BaseModel):
    """Metadados do ranking"""
    total: int
    limit: int
    offset: int
    period_type: Optional[str] = None
    year: Optional[int] = None


class EpiRankingResponse(BaseModel):
    """Resposta do endpoint de ranking"""
    data: list[EpiRankingItem]
    meta: EpiRankingMeta


# Mock data para desenvolvimento
MOCK_RANKING_DATA = [
    EpiRankingItem(codigo_ibge="3106200", municipio="Belo Horizonte", uf="MG", casos=1250, incidencia_100k=48.2, variacao_pct=12.5),
    EpiRankingItem(codigo_ibge="3118601", municipio="Contagem", uf="MG", casos=890, incidencia_100k=42.1, variacao_pct=-5.3),
    EpiRankingItem(codigo_ibge="3170206", municipio="Uberlândia", uf="MG", casos=720, incidencia_100k=38.9, variacao_pct=8.2),
    EpiRankingItem(codigo_ibge="3136702", municipio="Juiz de Fora", uf="MG", casos=580, incidencia_100k=35.4, variacao_pct=-2.1),
    EpiRankingItem(codigo_ibge="3106705", municipio="Betim", uf="MG", casos=450, incidencia_100k=32.8, variacao_pct=15.7),
]


@router.get("/epi/ranking", response_model=EpiRankingResponse)
async def get_epi_ranking(
    scope_type: str = Query(default="STATE", description="Tipo de escopo: STATE, REGIONAL, MUNICIPIO"),
    scope_id: str = Query(default="MG", description="ID do escopo (UF, regional ou código IBGE)"),
    period_type: str = Query(default="SE", description="Tipo de período: SE (semana epidemiológica), MES, ANO"),
    year: Optional[int] = Query(default=None, description="Ano de referência"),
    limit: int = Query(default=20, ge=1, le=200, description="Limite de registros"),
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
    cache: InMemoryCache = Depends(get_cache),
):
    """
    Ranking de municípios por incidência de dengue.
    
    Retorna os municípios ordenados por incidência (casos/100k hab),
    filtrados por escopo territorial e período.
    """
    cache_key = f"epi_ranking:{scope_type}:{scope_id}:{period_type}:{year}:{limit}"
    
    # Check cache
    cached = cache.get(cache_key, scope_key=user.scope_key)
    if cached:
        logger.info("epi_ranking_cache_hit", scope_type=scope_type, scope_id=scope_id)
        return cached
    
    # TODO: Integrar com provider real quando disponível
    # Por enquanto, retorna mock data
    current_year = year or datetime.now().year
    
    response = EpiRankingResponse(
        data=MOCK_RANKING_DATA[:limit],
        meta=EpiRankingMeta(
            total=len(MOCK_RANKING_DATA),
            limit=limit,
            offset=0,
            period_type=period_type,
            year=current_year,
        )
    )
    
    # Cache result
    cache.set(cache_key, response.model_dump(), settings.CACHE_TTL_SECONDS_P0, scope_key=user.scope_key)
    
    logger.info("epi_ranking_fetched", scope_type=scope_type, scope_id=scope_id, count=len(response.data))
    return response
