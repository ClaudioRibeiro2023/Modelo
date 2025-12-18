"""
TechDados BFF - Risco Endpoints
Endpoints para dados de risco (dashboard, município)
"""
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

from ....core.security import get_current_user, CurrentUser
from ....core.settings import get_settings, Settings
from ....core.cache import get_cache, InMemoryCache
from ....core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(tags=["Risco"])


class RiskSummary(BaseModel):
    """Resumo de risco por nível"""
    alto: int
    medio: int
    baixo: int
    total_municipios: int


class RiskMunicipio(BaseModel):
    """Município com score de risco"""
    codigo_ibge: str
    municipio: str
    risk_score: float
    risk_level: Literal["alto", "medio", "baixo"]
    drivers: list[str]


class RiskDashboardResponse(BaseModel):
    """Resposta do dashboard de risco"""
    summary: RiskSummary
    top_risco: list[RiskMunicipio]
    updated_at: str


# Mock data para desenvolvimento
MOCK_RISK_DATA = RiskDashboardResponse(
    summary=RiskSummary(alto=12, medio=45, baixo=156, total_municipios=213),
    top_risco=[
        RiskMunicipio(codigo_ibge="3106200", municipio="Belo Horizonte", risk_score=0.87, risk_level="alto", drivers=["clima", "densidade"]),
        RiskMunicipio(codigo_ibge="3118601", municipio="Contagem", risk_score=0.82, risk_level="alto", drivers=["cobertura", "historico"]),
        RiskMunicipio(codigo_ibge="3170206", municipio="Uberlândia", risk_score=0.71, risk_level="medio", drivers=["clima"]),
        RiskMunicipio(codigo_ibge="3136702", municipio="Juiz de Fora", risk_score=0.65, risk_level="medio", drivers=["densidade"]),
        RiskMunicipio(codigo_ibge="3106705", municipio="Betim", risk_score=0.58, risk_level="medio", drivers=["historico"]),
    ],
    updated_at=datetime.utcnow().isoformat(),
)


@router.get("/risk/dashboard", response_model=RiskDashboardResponse)
async def get_risk_dashboard(
    scope_type: str = Query(default="STATE", description="Tipo de escopo: STATE, REGIONAL, MUNICIPIO"),
    scope_id: str = Query(default="MG", description="ID do escopo (UF, regional ou código IBGE)"),
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
    cache: InMemoryCache = Depends(get_cache),
):
    """
    Dashboard de risco epidemiológico.
    
    Retorna resumo de municípios por nível de risco e top municípios
    com maior score de risco, filtrados por escopo territorial.
    """
    cache_key = f"risk_dashboard:{scope_type}:{scope_id}"
    
    # Check cache
    cached = cache.get(cache_key, scope_key=user.scope_key)
    if cached:
        logger.info("risk_dashboard_cache_hit", scope_type=scope_type, scope_id=scope_id)
        return cached
    
    # TODO: Integrar com provider real quando disponível
    # Por enquanto, retorna mock data com timestamp atualizado
    response = RiskDashboardResponse(
        summary=MOCK_RISK_DATA.summary,
        top_risco=MOCK_RISK_DATA.top_risco,
        updated_at=datetime.utcnow().isoformat(),
    )
    
    # Cache result
    cache.set(cache_key, response.model_dump(), settings.CACHE_TTL_SECONDS_P0, scope_key=user.scope_key)
    
    logger.info("risk_dashboard_fetched", scope_type=scope_type, scope_id=scope_id)
    return response
