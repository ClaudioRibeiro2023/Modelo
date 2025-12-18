from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.techdados_bff.services.monitor_service import get_health

router = APIRouter(tags=["techdengue-monitor"])


@router.get("/monitor/health")
async def monitor_health():
    data = await get_health()
    return JSONResponse(data)
