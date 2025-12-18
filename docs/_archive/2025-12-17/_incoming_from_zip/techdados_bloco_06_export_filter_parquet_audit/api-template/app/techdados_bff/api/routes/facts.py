from __future__ import annotations

from fastapi import APIRouter, Query, Depends
from fastapi.responses import Response, JSONResponse

from app.techdados_bff.api.deps import user_ctx
from app.techdados_bff.security.models import UserContext
from app.techdados_bff.security.policy import endpoint_policy, require_any_role, cap_limit, require_export_allowed
from app.techdados_bff.security.scope_filters import allowed_municipio_codes, filter_rows_by_municipio, scope_metadata
from app.techdados_bff.infra.export_filters import filter_csv_by_municipio_scope, filter_parquet_by_municipio_scope
from app.techdados_bff.core.audit import audit_export_event
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
    allowed = allowed_municipio_codes(user)

    if format == "csv":
        try:
            if allowed:
                data = await filter_csv_by_municipio_scope(data, allowed)
            audit_export_event(endpoint="facts", user=user, fmt="csv", status="success", bytes_out=len(data))
        except Exception as e:
            audit_export_event(endpoint="facts", user=user, fmt="csv", status="error", details={"error": str(e)})
            raise
        return Response(content=data, media_type="text/csv; charset=utf-8")

    if format == "parquet":
        try:
            if allowed:
                data = await filter_parquet_by_municipio_scope(data, allowed)
            audit_export_event(endpoint="facts", user=user, fmt="parquet", status="success", bytes_out=len(data))
        except Exception as e:
            audit_export_event(endpoint="facts", user=user, fmt="parquet", status="error", details={"error": str(e)})
            raise
        return Response(content=data, media_type="application/octet-stream")

    # json
    if isinstance(data, list):
        filtered = filter_rows_by_municipio(data, allowed) if allowed else data
        return JSONResponse({"items": filtered, "limit": limit, "offset": offset, "count": len(filtered), "scope": scope_metadata(user)})

    return JSONResponse(data)
