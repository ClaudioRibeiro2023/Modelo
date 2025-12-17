"""
TechDados BFF - API v1 Router
Aggregates all v1 endpoints
"""
from fastapi import APIRouter

from .endpoints import health, status, me, proxy_provider

# Create v1 router
router = APIRouter()

# Include endpoint routers
router.include_router(health.router)
router.include_router(status.router, prefix="/v1")
router.include_router(me.router, prefix="/v1")
router.include_router(proxy_provider.router, prefix="/v1")
