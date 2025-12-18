"""
TechDados BFF - API v1 Router
Aggregates all v1 endpoints
"""
from fastapi import APIRouter

from .endpoints import health, status, me, proxy_provider, epidemiologia, operacao, risco, nav

# Create v1 router
router = APIRouter()

# Include endpoint routers
router.include_router(health.router)
router.include_router(status.router, prefix="/v1")
router.include_router(me.router, prefix="/v1")
router.include_router(nav.router, prefix="/v1")
router.include_router(proxy_provider.router, prefix="/v1")

# Endpoints de domínio (MVP P0)
router.include_router(epidemiologia.router)
router.include_router(operacao.router)
router.include_router(risco.router)
