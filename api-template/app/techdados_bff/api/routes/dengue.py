from __future__ import annotations

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from app.techdados_bff.services.dengue_service import get_dengue

router = APIRouter(tags=["techdengue-data"])


@router.get("/dengue")
async def dengue(
    limit: int = Query(default=100, ge=1, le=10000),
    offset: int = Query(default=0, ge=0),
    ano: int | None = Query(default=None, ge=2000, le=2100),
    q: str | None = Query(default=None),
):
    data = await get_dengue(limit=limit, offset=offset, ano=ano, q=q)
    if isinstance(data, list):
        return JSONResponse({"items": data, "limit": limit, "offset": offset, "count": len(data)})
    return JSONResponse(data)
