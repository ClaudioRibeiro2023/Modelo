from __future__ import annotations

from fastapi import APIRouter, Query, Depends
from fastapi.responses import Response, JSONResponse

from app.techdados_bff.api.deps import user_ctx
from app.techdados_bff.security.models import UserContext
from app.techdados_bff.security.policy import endpoint_policy, require_any_role, cap_limit, require_export_allowed
from app.techdados_bff.security.scope_filters import allowed_municipio_codes, filter_rows_by_municipio, scope_metadata
from app.techdados_bff.services.facts_service import get_facts

router = APIRouter(tags=["techdengue-data"])


@router.get("/facts")
async def facts(
    limit: int = Query(default=100, ge=1, le=10000),
    offset: int = Query(default=0, ge=0),
    format: str = Query(default="json", pattern="^(json|csv|parquet)$"),
    q: str | None = Query(default=None),
    fields: str | None = Query(default=None),
    user: UserContext = Depends(user_ctx),
):
    pol = endpoint_policy("facts")
    require_any_role(user, pol.allowed_roles, action="facts:read")
    limit = cap_limit(user, limit, pol)
    require_export_allowed(user, pol, endpoint="facts", requested_format=format)

    data = await get_facts(limit=limit, offset=offset, format=format, q=q, fields=fields)

    # MVP: filtros territoriais só são aplicados em JSON (lista de dicts)
    if format == "csv":
        return Response(content=data, media_type="text/csv; charset=utf-8")
    if format == "parquet":
        return Response(content=data, media_type="application/octet-stream")

    if isinstance(data, list):
        allowed = allowed_municipio_codes(user)
        filtered = filter_rows_by_municipio(data, allowed) if allowed else data
        return JSONResponse(
            {
                "items": filtered,
                "limit": limit,
                "offset": offset,
                "count": len(filtered),
                "scope": scope_metadata(user),
            }
        )
    return JSONResponse(data)
