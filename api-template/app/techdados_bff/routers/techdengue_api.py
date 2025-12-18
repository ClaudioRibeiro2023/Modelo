"""Router BFF — proxy do upstream Techdengue API.

- Mantém o frontend desacoplado de URLs/contrato upstream.
- Aqui é um bom ponto para:
  - aplicar RBAC/escopo territorial
  - padronizar respostas
  - aplicar observabilidade e auditoria
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Body, Query

from app.techdados_bff.deps.upstream_client import get_techdengue_client
from app.techdados_bff.integrations.techdengue_api.client import TechDengueAPIClient, UpstreamError
from app.techdados_bff.integrations.techdengue_api.models import RiskAnalyzeRequest


router = APIRouter()


@router.get("/health")
async def health(client: TechDengueAPIClient = get_techdengue_client()) -> Any:
    try:
        return await client.health()
    except UpstreamError as e:
        return {"ok": False, "error": str(e), "status_code": e.status_code}


@router.get("/facts")
async def facts(client: TechDengueAPIClient = get_techdengue_client()) -> Any:
    return await client.facts()


@router.get("/dengue")
async def dengue(
    ano: int | None = Query(default=None),
    limit: int | None = Query(default=None, ge=1, le=2000),
    offset: int | None = Query(default=None, ge=0),
    client: TechDengueAPIClient = get_techdengue_client(),
) -> Any:
    return await client.dengue(ano=ano, limit=limit, offset=offset)


@router.get("/municipios")
async def municipios(
    q: str | None = Query(default=None),
    limit: int | None = Query(default=50, ge=1, le=500),
    client: TechDengueAPIClient = get_techdengue_client(),
) -> Any:
    return await client.municipios(q=q, limit=limit)


@router.get("/gold")
async def gold(
    format: str | None = Query(default=None, description="ex.: csv"),
    client: TechDengueAPIClient = get_techdengue_client(),
) -> Any:
    return await client.gold(format=format)


@router.get("/datasets")
async def datasets(client: TechDengueAPIClient = get_techdengue_client()) -> Any:
    return await client.datasets()


@router.get("/weather/{cidade}")
async def weather(
    cidade: str,
    client: TechDengueAPIClient = get_techdengue_client(),
) -> Any:
    return await client.weather(cidade=cidade)


@router.get("/weather/{cidade}/risk")
async def weather_risk(
    cidade: str,
    client: TechDengueAPIClient = get_techdengue_client(),
) -> Any:
    return await client.weather_risk(cidade=cidade)


@router.get("/risk/dashboard")
async def risk_dashboard(client: TechDengueAPIClient = get_techdengue_client()) -> Any:
    return await client.risk_dashboard()


@router.post("/risk/analyze")
async def risk_analyze(
    payload: RiskAnalyzeRequest = Body(...),
    client: TechDengueAPIClient = get_techdengue_client(),
) -> Any:
    return await client.risk_analyze(payload)
