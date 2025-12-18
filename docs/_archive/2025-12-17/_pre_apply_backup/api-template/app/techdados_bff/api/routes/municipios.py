from __future__ import annotations

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from app.techdados_bff.services.municipios_service import get_municipios

router = APIRouter(tags=["techdengue-data"])


@router.get("/municipios")
async def municipios(
    limit: int = Query(default=100, ge=1, le=2000),
    q: str | None = Query(default=None),
):
    data = await get_municipios(limit=limit, q=q)
    if isinstance(data, list):
        return JSONResponse({"items": data, "limit": limit, "offset": 0, "count": len(data)})
    return JSONResponse(data)
