from __future__ import annotations

from fastapi import APIRouter, Query, Depends
from fastapi.responses import JSONResponse

from app.techdados_bff.api.deps import user_ctx
from app.techdados_bff.security.models import UserContext
from app.techdados_bff.security.policy import endpoint_policy, require_any_role, cap_limit
from app.techdados_bff.security.scope_filters import allowed_municipio_codes, filter_rows_by_municipio, scope_metadata
from app.techdados_bff.services.dengue_service import get_dengue

router = APIRouter(tags=["techdengue-data"])


@router.get("/dengue")
async def dengue(
    limit: int = Query(default=100, ge=1, le=10000),
    offset: int = Query(default=0, ge=0),
    ano: int | None = Query(default=None, ge=2000, le=2100),
    q: str | None = Query(default=None),
    user: UserContext = Depends(user_ctx),
):
    pol = endpoint_policy("dengue")
    require_any_role(user, pol.allowed_roles, action="dengue:read")
    limit = cap_limit(user, limit, pol)

    data = await get_dengue(limit=limit, offset=offset, ano=ano, q=q)

    if isinstance(data, list):
        allowed = allowed_municipio_codes(user)
        filtered = filter_rows_by_municipio(data, allowed) if allowed else data
        return JSONResponse({"items": filtered, "limit": limit, "offset": offset, "count": len(filtered), "scope": scope_metadata(user)})
    return JSONResponse(data)
