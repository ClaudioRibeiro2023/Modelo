from __future__ import annotations

from fastapi import APIRouter, Depends, Request, Query
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from ..core.settings import settings
from ..security.models import UserContext
from ..security.rbac import require_roles
from ..security.abac import require_scope
from ..cache.ttl_cache import TTLCache
from ..audit.events import AuditEvent
from ..audit.logger import emit
from ..clients.provider_client import DataProviderClient

from .deps import get_cache, get_provider, user_ctx, request_id
from .models import StatusResponse, ExportRequest, ExportResponse

from ..services.home_service import HomeService
from ..services.epi_service import EpiService
from ..services.risk_service import RiskService
from ..services.ref_service import RefService
from ..services.weather_service import WeatherService
from ..services.ops_service import OpsService

router = APIRouter(tags=["techdados-bff"])


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _cache_key(prefix: str, user: UserContext, scope: str, extra: str = "") -> str:
    roles = ",".join(sorted([r.lower() for r in user.roles]))
    return f"{prefix}:{roles}:{scope}:{extra}"


@router.get("/health")
async def health() -> Dict[str, Any]:
    return {"ok": True, "ts": _now_iso()}


@router.get("/status", response_model=StatusResponse)
async def status(
    request: Request,
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "auditoria", "apoio_indireto"])

    key = _cache_key("status", user, "GLOBAL")
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    payload = {
        "app_name": "techdados-api",
        "version": "0.1.0",
        "env": "local",
        "keycloak": {
            "mode": settings.auth_mode,
            "issuer": settings.keycloak_issuer_url,
            "audience": settings.keycloak_audience,
            "ok": True if settings.auth_mode != "keycloak" else bool(settings.keycloak_issuer_url and settings.keycloak_audience),
        },
        "provider": {
            "enabled": settings.provider_enabled,
            "base_url": settings.provider_base_url,
            "ok": True if not settings.provider_enabled else bool(settings.provider_base_url),
        },
        "cache": {
            "enabled": settings.cache_enabled,
            "ttl_home_s": settings.cache_ttl_home_s,
            "ttl_epi_s": settings.cache_ttl_epi_s,
            "ttl_risk_s": settings.cache_ttl_risk_s,
            "ttl_weather_s": settings.cache_ttl_weather_s,
        },
        "timestamp": _now_iso(),
    }

    emit(AuditEvent(name="STATUS_VIEWED", user_id=user.user_id, request_id=request_id(request), route="/status", metadata={}))

    if settings.cache_enabled:
        cache.set(key, payload, settings.cache_ttl_status_s)

    return payload


@router.get("/ref/municipios")
async def ref_municipios(
    request: Request,
    scope_type: str = Query(...),
    scope_id: str = Query(...),
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "estrategico", "tatico", "operacional", "auditoria", "apoio_indireto"])
    scope = require_scope(user, scope_type, scope_id)

    key = _cache_key("ref:municipios", user, scope)
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = RefService(provider)
    data = await svc.municipios(scope_type, scope_id)

    emit(AuditEvent(name="DATA_QUERY_EXECUTED", user_id=user.user_id, request_id=request_id(request), route="/ref/municipios", metadata={"scope": scope}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_ref_s)

    return data


@router.get("/home/panorama")
async def home_panorama(
    request: Request,
    scope_type: str = Query(...),
    scope_id: str = Query(...),
    window: Optional[str] = Query(default="8w"),
    date_from: Optional[str] = Query(default=None, alias="from"),
    date_to: Optional[str] = Query(default=None, alias="to"),
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "estrategico", "tatico", "operacional", "auditoria", "apoio_indireto"])
    scope = require_scope(user, scope_type, scope_id)

    key = _cache_key("home:panorama", user, scope, extra=f"{window}:{date_from}:{date_to}")
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = HomeService(provider)
    data = await svc.panorama(scope_type, scope_id, window=window, date_from=date_from, date_to=date_to)

    emit(AuditEvent(name="DATA_VIEW_OPENED", user_id=user.user_id, request_id=request_id(request), route="/home/panorama", metadata={"scope": scope, "window": window}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_home_s)

    return data


@router.get("/home/alertas")
async def home_alertas(
    request: Request,
    scope_type: str = Query(...),
    scope_id: str = Query(...),
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "estrategico", "tatico", "operacional", "auditoria", "apoio_indireto"])
    scope = require_scope(user, scope_type, scope_id)

    key = _cache_key("home:alertas", user, scope)
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = HomeService(provider)
    data = await svc.alertas(scope_type, scope_id)

    emit(AuditEvent(name="ALERTS_VIEWED", user_id=user.user_id, request_id=request_id(request), route="/home/alertas", metadata={"scope": scope}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_home_s)

    return data


@router.get("/epi/ranking")
async def epi_ranking(
    request: Request,
    scope_type: str = Query(...),
    scope_id: str = Query(...),
    period_type: str = Query(default="SE"),
    year: Optional[int] = Query(default=None),
    limit: int = Query(default=20, ge=1, le=200),
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "estrategico", "tatico", "auditoria"])
    scope = require_scope(user, scope_type, scope_id)

    key = _cache_key("epi:ranking", user, scope, extra=f"{period_type}:{year}:{limit}")
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = EpiService(provider)
    data = await svc.ranking(scope_type, scope_id, period_type=period_type, year=year, limit=limit)

    emit(AuditEvent(name="DATA_QUERY_EXECUTED", user_id=user.user_id, request_id=request_id(request), route="/epi/ranking", metadata={"scope": scope}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_epi_s)

    return data


@router.get("/epi/tendencia")
async def epi_tendencia(
    request: Request,
    scope_type: str = Query(...),
    scope_id: str = Query(...),
    window: str = Query(default="12w"),
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "estrategico", "tatico", "operacional", "auditoria"])
    scope = require_scope(user, scope_type, scope_id)

    key = _cache_key("epi:tendencia", user, scope, extra=window)
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = EpiService(provider)
    data = await svc.tendencia(scope_type, scope_id, window=window)

    emit(AuditEvent(name="DATA_VIEW_OPENED", user_id=user.user_id, request_id=request_id(request), route="/epi/tendencia", metadata={"scope": scope, "window": window}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_epi_s)

    return data


@router.get("/risk/dashboard")
async def risk_dashboard(
    request: Request,
    scope_type: str = Query(...),
    scope_id: str = Query(...),
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "estrategico", "tatico", "auditoria"])
    scope = require_scope(user, scope_type, scope_id)

    key = _cache_key("risk:dashboard", user, scope)
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = RiskService(provider)
    data = await svc.dashboard(scope_type, scope_id)

    emit(AuditEvent(name="DATA_VIEW_OPENED", user_id=user.user_id, request_id=request_id(request), route="/risk/dashboard", metadata={"scope": scope}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_risk_s)

    return data


@router.get("/risk/municipio/{codigo_ibge}")
async def risk_municipio(
    request: Request,
    codigo_ibge: str,
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "tatico", "operacional", "auditoria"])
    scope = require_scope(user, "MUNICIPIO", codigo_ibge)

    key = _cache_key("risk:municipio", user, scope)
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = RiskService(provider)
    data = await svc.municipio(codigo_ibge)

    emit(AuditEvent(name="DATA_VIEW_OPENED", user_id=user.user_id, request_id=request_id(request), route="/risk/municipio/{codigo_ibge}", metadata={"scope": scope}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_risk_s)

    return data


@router.get("/weather/{city}")
async def weather_city(
    request: Request,
    city: str,
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "estrategico", "tatico", "operacional", "auditoria", "apoio_indireto"])

    key = _cache_key("weather:city", user, "CITY", extra=city.lower())
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = WeatherService(provider)
    data = await svc.city(city)

    emit(AuditEvent(name="DATA_QUERY_EXECUTED", user_id=user.user_id, request_id=request_id(request), route="/weather/{city}", metadata={"city": city}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_weather_s)

    return data


@router.get("/operacao/cobertura")
async def operacao_cobertura(
    request: Request,
    scope_type: str = Query(...),
    scope_id: str = Query(...),
    periodo: str = Query(default="month"),
    limit: int = Query(default=20, ge=1, le=200),
    user: UserContext = Depends(user_ctx),
    cache: TTLCache = Depends(get_cache),
    provider: DataProviderClient = Depends(get_provider),
):
    require_roles(user, ["admin", "estrategico", "tatico", "operacional", "auditoria"])
    scope = require_scope(user, scope_type, scope_id)

    key = _cache_key("ops:cobertura", user, scope, extra=f"{periodo}:{limit}")
    if settings.cache_enabled:
        hit = cache.get(key)
        if hit:
            return hit

    svc = OpsService(provider)
    data = await svc.cobertura(scope_type, scope_id, periodo=periodo, limit=limit)

    emit(AuditEvent(name="DATA_QUERY_EXECUTED", user_id=user.user_id, request_id=request_id(request), route="/operacao/cobertura", metadata={"scope": scope}))

    if settings.cache_enabled:
        cache.set(key, data, settings.cache_ttl_epi_s)

    return data


@router.post("/export", response_model=ExportResponse)
async def export_data(
    request: Request,
    body: ExportRequest,
    user: UserContext = Depends(user_ctx),
):
    require_roles(user, ["admin", "estrategico", "tatico"])

    scope = require_scope(user, body.scope_type, body.scope_id)

    emit(AuditEvent(
        name="EXPORT_REQUESTED",
        user_id=user.user_id,
        request_id=request_id(request),
        route="/export",
        metadata={"scope": scope, "view_id": body.view_id, "export_type": body.export_type},
    ))

    export_id = f"exp_{int(datetime.now().timestamp())}"

    emit(AuditEvent(
        name="EXPORT_COMPLETED",
        user_id=user.user_id,
        request_id=request_id(request),
        route="/export",
        metadata={"export_id": export_id, "status": "accepted"},
    ))

    return ExportResponse(status="accepted", export_id=export_id)
