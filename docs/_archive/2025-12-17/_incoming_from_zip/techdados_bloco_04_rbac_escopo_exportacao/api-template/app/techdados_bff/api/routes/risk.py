from __future__ import annotations

from fastapi import APIRouter, Query, Depends
from fastapi.responses import JSONResponse

from app.techdados_bff.api.deps import user_ctx
from app.techdados_bff.security.models import UserContext
from app.techdados_bff.security.policy import endpoint_policy, require_any_role, cap_limit
from app.techdados_bff.services.risk_service import analyze_risk

router = APIRouter(tags=["techdengue-risk"])


@router.get("/risk/analyze")
async def risk_analyze(
    cidade: str = Query(..., min_length=2, max_length=120),
    uf: str = Query(default="MG", min_length=2, max_length=2),
    user: UserContext = Depends(user_ctx),
):
    pol = endpoint_policy("risk")
    require_any_role(user, pol.allowed_roles, action="risk:read")
    # sem limit aqui (análise por cidade)
    data = await analyze_risk(cidade=cidade, uf=uf)
    return JSONResponse(data)


@router.get("/risk/ping")
async def risk_ping(user: UserContext = Depends(user_ctx)):
    pol = endpoint_policy("risk")
    require_any_role(user, pol.allowed_roles, action="risk:ping")
    return JSONResponse({"ok": True})
