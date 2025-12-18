from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.techdados_bff.api.deps import user_ctx
from app.techdados_bff.security.models import UserContext
from app.techdados_bff.security.policy import endpoint_policy, require_any_role
from app.techdados_bff.services.monitor_service import upstream_status

router = APIRouter(tags=["techdengue-monitor"])


@router.get("/monitor/ping")
async def monitor_ping(user: UserContext = Depends(user_ctx)):
    pol = endpoint_policy("monitor")
    require_any_role(user, pol.allowed_roles, action="monitor:ping")
    return JSONResponse({"ok": True})


@router.get("/monitor/upstream")
async def monitor_upstream(user: UserContext = Depends(user_ctx)):
    pol = endpoint_policy("monitor")
    require_any_role(user, pol.allowed_roles, action="monitor:upstream")
    data = await upstream_status()
    return JSONResponse(data)
