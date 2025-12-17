"""
TechDados BFF - Status Endpoint
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from ....core.settings import get_settings, Settings
from ....core.cache import get_cache

router = APIRouter(tags=["Status"])


class KeycloakConfig(BaseModel):
    """Keycloak configuration (no secrets)"""
    url: str
    realm: str


class ProviderConfig(BaseModel):
    """Provider configuration (no secrets)"""
    base_url: str
    timeout_seconds: int
    configured: bool


class CacheConfig(BaseModel):
    """Cache configuration"""
    enabled: bool
    ttl_p0: int
    ttl_p1: int
    current_size: int


class StatusResponse(BaseModel):
    """Status response with system info"""
    app_name: str
    version: str
    env: str
    demo_mode: bool
    keycloak: KeycloakConfig
    provider: ProviderConfig
    cache: CacheConfig
    timestamp: str


@router.get("/status", response_model=StatusResponse)
async def get_status(settings: Settings = Depends(get_settings)):
    """
    Get system status and configuration.
    
    Returns non-sensitive configuration information for debugging
    and frontend initialization.
    """
    cache = get_cache()
    
    return StatusResponse(
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        env=settings.APP_ENV,
        demo_mode=settings.DEMO_MODE,
        keycloak=KeycloakConfig(
            url=settings.KEYCLOAK_URL,
            realm=settings.KEYCLOAK_REALM,
        ),
        provider=ProviderConfig(
            base_url=settings.PROVIDER_BASE_URL or "(not configured)",
            timeout_seconds=settings.PROVIDER_TIMEOUT_SECONDS,
            configured=bool(settings.PROVIDER_BASE_URL),
        ),
        cache=CacheConfig(
            enabled=settings.CACHE_ENABLED,
            ttl_p0=settings.CACHE_TTL_SECONDS_P0,
            ttl_p1=settings.CACHE_TTL_SECONDS_P1,
            current_size=cache.size,
        ),
        timestamp=datetime.utcnow().isoformat(),
    )
