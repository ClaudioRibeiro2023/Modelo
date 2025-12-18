from __future__ import annotations

from fastapi import APIRouter, Query, Depends
from fastapi.responses import JSONResponse

from app.techdados_bff.api.deps import user_ctx
from app.techdados_bff.security.models import UserContext
from app.techdados_bff.security.policy import endpoint_policy, require_any_role, cap_limit
from app.techdados_bff.security.scope_filters import allowed_municipio_codes, scope_metadata
from app.techdados_bff.services.municipios_service import get_municipios

router = APIRouter(tags=["techdengue-data"])


@router.get("/municipios")
async def municipios(
    limit: int = Query(default=100, ge=1, le=2000),
    q: str | None = Query(default=None),
    user: UserContext = Depends(user_ctx),
):
    pol = endpoint_policy("municipios")
    require_any_role(user, pol.allowed_roles, action="municipios:read")
    limit = cap_limit(user, limit, pol)

    data = await get_municipios(limit=limit, q=q)

    # Se o usuário tem escopo municipal, limitamos a lista aos códigos permitidos quando possível
    allowed = allowed_municipio_codes(user)
    if isinstance(data, list) and allowed:
        filtered = []
        for r in data:
            code = None
            for k in ("codigo_ibge", "ibge", "cod_ibge", "cd_ibge", "codigo_municipio"):
                if k in r and r[k] is not None:
                    code = str(r[k]).strip()
                    break
            if code and code in allowed:
                filtered.append(r)
        data = filtered

    if isinstance(data, list):
        return JSONResponse({"items": data, "limit": limit, "offset": 0, "count": len(data), "scope": scope_metadata(user)})
    return JSONResponse(data)
