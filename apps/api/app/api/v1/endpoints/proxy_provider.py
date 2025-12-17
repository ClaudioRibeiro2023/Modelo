"""
TechDados BFF - Provider Proxy Endpoints
Stub endpoints for future integration with Techdengue API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

from ....core.security import get_current_user, CurrentUser
from ....core.settings import get_settings, Settings
from ....core.cache import get_cache, InMemoryCache
from ....core.logging import get_logger
from ....providers.techdengue_client import TechdengueClient, get_client

logger = get_logger(__name__)
router = APIRouter(tags=["Provider"])


class PingResponse(BaseModel):
    """Provider ping response"""
    provider_status: str
    provider_url: str
    cached: bool
    timestamp: str
    data: Optional[dict] = None


class DengueSeriesResponse(BaseModel):
    """Dengue series data response (stub)"""
    cached: bool
    data: Any
    timestamp: str


@router.get("/provider/ping", response_model=PingResponse)
async def ping_provider(
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
    cache: InMemoryCache = Depends(get_cache),
    client: TechdengueClient = Depends(get_client),
):
    """
    Ping the external data provider.
    
    If PROVIDER_BASE_URL is configured, attempts to reach the provider.
    Otherwise, returns fixture data.
    """
    # Check cache first
    cache_key = "provider_ping"
    cached_result = cache.get(cache_key, scope_key=user.scope_key)
    
    if cached_result:
        return PingResponse(
            provider_status="ok",
            provider_url=settings.PROVIDER_BASE_URL or "(fixture)",
            cached=True,
            timestamp=cached_result.get("timestamp"),
            data=cached_result.get("data"),
        )
    
    # Call provider
    try:
        result = await client.ping()
        
        # Cache result
        cache_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "data": result,
        }
        cache.set(cache_key, cache_data, settings.CACHE_TTL_SECONDS_P0, scope_key=user.scope_key)
        
        return PingResponse(
            provider_status="ok",
            provider_url=settings.PROVIDER_BASE_URL or "(fixture)",
            cached=False,
            timestamp=cache_data["timestamp"],
            data=result,
        )
        
    except Exception as e:
        logger.error("provider_ping_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "provider_unavailable",
                "message": str(e),
            },
        )


@router.get("/provider/dengue-series", response_model=DengueSeriesResponse)
async def get_dengue_series(
    uf: Optional[str] = None,
    ano: Optional[int] = None,
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
    cache: InMemoryCache = Depends(get_cache),
    client: TechdengueClient = Depends(get_client),
):
    """
    Get dengue series data (stub).
    
    This is a placeholder endpoint that returns fixture data.
    Will be replaced with actual provider integration.
    """
    params = {"uf": uf, "ano": ano}
    cache_key = "dengue_series"
    
    # Check cache
    cached_result = cache.get(cache_key, params=params, scope_key=user.scope_key)
    if cached_result:
        return DengueSeriesResponse(
            cached=True,
            data=cached_result,
            timestamp=datetime.utcnow().isoformat(),
        )
    
    # Get from provider (stub)
    result = await client.get_dengue_series(uf=uf, ano=ano)
    
    # Cache
    cache.set(cache_key, result, settings.CACHE_TTL_SECONDS_P0, params=params, scope_key=user.scope_key)
    
    return DengueSeriesResponse(
        cached=False,
        data=result,
        timestamp=datetime.utcnow().isoformat(),
    )
