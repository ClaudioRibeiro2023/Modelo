from __future__ import annotations

from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse

from app.techdados_bff.services.risk_service import analyze_risk, get_risk_dashboard, get_risk_municipio

router = APIRouter(tags=["techdengue-risk"])


@router.post("/risk/analyze")
async def risk_analyze(payload: dict = Body(...)):
    data = await analyze_risk(payload)
    return JSONResponse(data)


@router.get("/risk/dashboard")
async def risk_dashboard():
    data = await get_risk_dashboard()
    return JSONResponse(data)


@router.get("/risk/municipio/{codigo_ibge}")
async def risk_municipio(codigo_ibge: str):
    data = await get_risk_municipio(codigo_ibge)
    return JSONResponse(data)
