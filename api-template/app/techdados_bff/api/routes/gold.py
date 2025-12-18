from __future__ import annotations

from fastapi import APIRouter, Query
from fastapi.responses import Response, JSONResponse

from app.techdados_bff.services.gold_service import get_gold

router = APIRouter(tags=["techdengue-data"])


@router.get("/gold")
async def gold(
    limit: int = Query(default=1000, ge=1, le=100000),
    offset: int = Query(default=0, ge=0),
    format: str = Query(default="csv", pattern="^(json|csv|parquet)$"),
    q: str | None = Query(default=None),
    fields: str | None = Query(default=None),
):
    data = await get_gold(limit=limit, offset=offset, format=format, q=q, fields=fields)

    if format == "csv":
        return Response(content=data, media_type="text/csv; charset=utf-8")
    if format == "parquet":
        return Response(content=data, media_type="application/octet-stream")

    if isinstance(data, list):
        return JSONResponse({"items": data, "limit": limit, "offset": offset, "count": len(data)})
    return JSONResponse(data)
