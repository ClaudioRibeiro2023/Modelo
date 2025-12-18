from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.techdados_bff.services.weather_service import get_weather_city, get_weather_all, get_weather_risk

router = APIRouter(tags=["techdengue-weather"])


@router.get("/weather")
async def weather_all():
    data = await get_weather_all()
    return JSONResponse(data)


@router.get("/weather/{cidade}")
async def weather_city(cidade: str):
    data = await get_weather_city(cidade)
    return JSONResponse(data)


@router.get("/weather/{cidade}/risk")
async def weather_risk(cidade: str):
    data = await get_weather_risk(cidade)
    return JSONResponse(data)
