"""
TechDados BFF - Operação Endpoints
Endpoints para dados operacionais (cobertura, mapeamento)
"""
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional

from ....core.security import get_current_user, CurrentUser
from ....core.settings import get_settings, Settings
from ....core.cache import get_cache, InMemoryCache
from ....core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(tags=["Operação"])


class OpsCoverageItem(BaseModel):
    """Item de cobertura operacional"""
    codigo_ibge: str
    municipio: str
    uf: str
    ha_mapeados: float
    ha_urbanos: float
    cobertura_pct: float
    pois_total: int
    devolutivas: int


class OpsCoverageMeta(BaseModel):
    """Metadados da cobertura"""
    total: int
    limit: int
    offset: int


class OpsCoverageResponse(BaseModel):
    """Resposta do endpoint de cobertura"""
    data: list[OpsCoverageItem]
    meta: OpsCoverageMeta


# Mock data para desenvolvimento
MOCK_COVERAGE_DATA = [
    OpsCoverageItem(codigo_ibge="3106200", municipio="Belo Horizonte", uf="MG", ha_mapeados=12500, ha_urbanos=15000, cobertura_pct=83.3, pois_total=4200, devolutivas=3800),
    OpsCoverageItem(codigo_ibge="3118601", municipio="Contagem", uf="MG", ha_mapeados=8200, ha_urbanos=10000, cobertura_pct=82.0, pois_total=2800, devolutivas=2500),
    OpsCoverageItem(codigo_ibge="3170206", municipio="Uberlândia", uf="MG", ha_mapeados=7500, ha_urbanos=11000, cobertura_pct=68.2, pois_total=3100, devolutivas=2200),
    OpsCoverageItem(codigo_ibge="3136702", municipio="Juiz de Fora", uf="MG", ha_mapeados=5800, ha_urbanos=8500, cobertura_pct=68.2, pois_total=2400, devolutivas=1900),
    OpsCoverageItem(codigo_ibge="3106705", municipio="Betim", uf="MG", ha_mapeados=4200, ha_urbanos=9000, cobertura_pct=46.7, pois_total=1800, devolutivas=1200),
]


@router.get("/operacao/cobertura", response_model=OpsCoverageResponse)
async def get_ops_coverage(
    scope_type: str = Query(default="STATE", description="Tipo de escopo: STATE, REGIONAL, MUNICIPIO"),
    scope_id: str = Query(default="MG", description="ID do escopo (UF, regional ou código IBGE)"),
    periodo: str = Query(default="month", description="Período: week, month, year"),
    limit: int = Query(default=20, ge=1, le=200, description="Limite de registros"),
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
    cache: InMemoryCache = Depends(get_cache),
):
    """
    Cobertura operacional por município.
    
    Retorna a cobertura de mapeamento (HA_MAP/HA_URBANOS) por município,
    filtrada por escopo territorial e período.
    """
    cache_key = f"ops_coverage:{scope_type}:{scope_id}:{periodo}:{limit}"
    
    # Check cache
    cached = cache.get(cache_key, scope_key=user.scope_key)
    if cached:
        logger.info("ops_coverage_cache_hit", scope_type=scope_type, scope_id=scope_id)
        return cached
    
    # TODO: Integrar com provider real quando disponível
    # Por enquanto, retorna mock data
    response = OpsCoverageResponse(
        data=MOCK_COVERAGE_DATA[:limit],
        meta=OpsCoverageMeta(
            total=len(MOCK_COVERAGE_DATA),
            limit=limit,
            offset=0,
        )
    )
    
    # Cache result
    cache.set(cache_key, response.model_dump(), settings.CACHE_TTL_SECONDS_P0, scope_key=user.scope_key)
    
    logger.info("ops_coverage_fetched", scope_type=scope_type, scope_id=scope_id, count=len(response.data))
    return response
