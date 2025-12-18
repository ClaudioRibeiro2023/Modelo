from __future__ import annotations

from fastapi import APIRouter

from app.techdados_bff.api.routes.facts import router as facts_router
from app.techdados_bff.api.routes.dengue import router as dengue_router
from app.techdados_bff.api.routes.municipios import router as municipios_router
from app.techdados_bff.api.routes.gold import router as gold_router
from app.techdados_bff.api.routes.weather import router as weather_router
from app.techdados_bff.api.routes.risk import router as risk_router
from app.techdados_bff.api.routes.monitor import router as monitor_router

router = APIRouter()
router.include_router(facts_router)
router.include_router(dengue_router)
router.include_router(municipios_router)
router.include_router(gold_router)
router.include_router(weather_router)
router.include_router(risk_router)
router.include_router(monitor_router)
