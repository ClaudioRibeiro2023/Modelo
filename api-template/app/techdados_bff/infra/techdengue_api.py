from __future__ import annotations

from typing import Any, Dict, Optional

import httpx

from app.techdados_bff.core.settings import UpstreamSettings, get_upstream_settings
from app.techdados_bff.infra.http_client import build_async_client
from app.techdados_bff.infra.errors import UpstreamError, UpstreamTimeout


class TechdengueUpstream:
    """
    Cliente simples (HTTP) para a API de Dados do Techdengue.

    - Mantém requests pequenos e previsíveis.
    - Centraliza tratamento de erro.
    - Evita acoplamento forte com modelos do upstream nesta fase.
    """

    def __init__(self, settings: UpstreamSettings | None = None):
        self.settings = settings or get_upstream_settings()
        self._client: httpx.AsyncClient | None = None

    async def __aenter__(self) -> "TechdengueUpstream":
        self._client = build_async_client(self.settings)
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        if self._client:
            await self._client.aclose()

    @property
    def client(self) -> httpx.AsyncClient:
        if not self._client:
            raise RuntimeError("TechdengueUpstream não inicializado. Use 'async with TechdengueUpstream()'.")
        return self._client

    async def _request_json(self, method: str, url: str, *, params: dict | None = None, json: Any | None = None) -> Any:
        try:
            resp = await self.client.request(method, url, params=params, json=json)
        except httpx.TimeoutException as e:
            raise UpstreamTimeout() from e
        except httpx.RequestError as e:
            raise UpstreamError(status_code=502, message="Falha de rede ao consultar upstream", upstream_url=str(e.request.url)) from e

        if resp.status_code >= 400:
            body: Any
            try:
                body = resp.json()
            except Exception:
                body = resp.text
            raise UpstreamError(
                status_code=resp.status_code,
                message="Upstream retornou erro",
                upstream_body=body,
                upstream_url=str(resp.url),
            )

        # JSON
        return resp.json()

    async def _request_bytes(self, method: str, url: str, *, params: dict | None = None) -> tuple[bytes, str]:
        try:
            resp = await self.client.request(method, url, params=params)
        except httpx.TimeoutException as e:
            raise UpstreamTimeout() from e
        except httpx.RequestError as e:
            raise UpstreamError(status_code=502, message="Falha de rede ao consultar upstream", upstream_url=str(e.request.url)) from e

        if resp.status_code >= 400:
            try:
                body = resp.json()
            except Exception:
                body = resp.text
            raise UpstreamError(
                status_code=resp.status_code,
                message="Upstream retornou erro",
                upstream_body=body,
                upstream_url=str(resp.url),
            )

        content_type = resp.headers.get("content-type", "application/octet-stream")
        return resp.content, content_type

    # ---- Endpoints públicos (dados) ----

    async def health(self) -> Any:
        return await self._request_json("GET", "/health")

    async def facts(self, *, limit: int = 100, offset: int = 0, format: str = "json", q: str | None = None, fields: str | None = None) -> Any:
        params: Dict[str, Any] = {"limit": limit, "offset": offset, "format": format}
        if q:
            params["q"] = q
        if fields:
            params["fields"] = fields
        if format in ("csv", "parquet"):
            data, _ct = await self._request_bytes("GET", "/facts", params=params)
            return data
        return await self._request_json("GET", "/facts", params=params)

    async def dengue(self, *, limit: int = 100, offset: int = 0, ano: int | None = None, q: str | None = None) -> Any:
        params: Dict[str, Any] = {"limit": limit, "offset": offset}
        if ano is not None:
            params["ano"] = ano
        if q:
            params["q"] = q
        return await self._request_json("GET", "/dengue", params=params)

    async def municipios(self, *, limit: int = 100, q: str | None = None) -> Any:
        params: Dict[str, Any] = {"limit": limit}
        if q:
            params["q"] = q
        return await self._request_json("GET", "/municipios", params=params)

    async def gold(self, *, limit: int = 1000, offset: int = 0, format: str = "csv", q: str | None = None, fields: str | None = None) -> Any:
        params: Dict[str, Any] = {"limit": limit, "offset": offset, "format": format}
        if q:
            params["q"] = q
        if fields:
            params["fields"] = fields
        if format in ("csv", "parquet"):
            data, _ct = await self._request_bytes("GET", "/gold", params=params)
            return data
        return await self._request_json("GET", "/gold", params=params)

    async def weather_city(self, cidade: str) -> Any:
        return await self._request_json("GET", f"/api/v1/weather/{cidade}")

    async def weather_all(self) -> Any:
        return await self._request_json("GET", "/api/v1/weather")

    async def weather_risk(self, cidade: str) -> Any:
        return await self._request_json("GET", f"/api/v1/weather/{cidade}/risk")

    async def risk_analyze(self, payload: dict) -> Any:
        return await self._request_json("POST", "/api/v1/risk/analyze", json=payload)

    async def risk_dashboard(self) -> Any:
        return await self._request_json("GET", "/api/v1/risk/dashboard")

    async def risk_municipio(self, codigo_ibge: str) -> Any:
        return await self._request_json("GET", f"/api/v1/risk/municipio/{codigo_ibge}")
