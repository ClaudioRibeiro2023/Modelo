"""Cliente HTTP para o upstream Techdengue API.

- Async (httpx)
- Timeout + retries (básico)
- Cache TTL (in-memory)
- Suporta endpoints públicos e protegidos (X-API-Key)

Observação:
- Nunca logar a API key.
"""

from __future__ import annotations

import asyncio
import json
from typing import Any

import httpx

from .cache import TTLCache
from .models import RiskAnalyzeRequest


class UpstreamError(RuntimeError):
    def __init__(self, message: str, status_code: int | None = None, detail: Any | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.detail = detail


def _join(base_url: str, path: str) -> str:
    return base_url.rstrip("/") + "/" + path.lstrip("/")


class TechDengueAPIClient:
    def __init__(
        self,
        base_url: str,
        api_key: str | None = None,
        timeout_s: float = 15,
        retries: int = 2,
        cache: TTLCache | None = None,
        default_cache_ttl_s: int = 60,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout_s = timeout_s
        self.retries = max(0, int(retries))
        self.cache = cache or TTLCache(default_ttl_s=default_cache_ttl_s)
        self._client = httpx.AsyncClient(
            timeout=httpx.Timeout(timeout_s),
            headers={"Accept": "application/json"},
        )

    async def aclose(self) -> None:
        await self._client.aclose()

    def _headers(self, extra: dict[str, str] | None = None) -> dict[str, str]:
        h: dict[str, str] = {}
        if self.api_key:
            h["X-API-Key"] = self.api_key
        if extra:
            h.update(extra)
        return h

    async def _request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json_body: Any | None = None,
        headers: dict[str, str] | None = None,
        cache_key: str | None = None,
        cache_ttl_s: int | None = None,
    ) -> Any:
        url = _join(self.base_url, path)

        async def _do() -> Any:
            last_exc: Exception | None = None
            for attempt in range(self.retries + 1):
                try:
                    resp = await self._client.request(
                        method,
                        url,
                        params=params,
                        json=json_body,
                        headers=self._headers(headers),
                    )
                    if resp.status_code >= 500:
                        raise UpstreamError("Upstream 5xx", status_code=resp.status_code, detail=resp.text)
                    if resp.status_code >= 400:
                        # erro do upstream (4xx)
                        raise UpstreamError("Upstream 4xx", status_code=resp.status_code, detail=resp.text)

                    # tenta JSON; fallback texto
                    ctype = resp.headers.get("content-type", "")
                    if "application/json" in ctype:
                        return resp.json()
                    # alguns endpoints podem retornar csv/text
                    return resp.text
                except (httpx.TimeoutException, httpx.ConnectError, httpx.RemoteProtocolError) as e:
                    last_exc = e
                    # backoff simples
                    if attempt < self.retries:
                        await asyncio.sleep(0.3 * (attempt + 1))
                        continue
                    raise UpstreamError("Upstream connection/timeout error") from e
                except UpstreamError:
                    raise
                except Exception as e:
                    last_exc = e
                    raise UpstreamError("Unexpected upstream error") from e
            raise UpstreamError("Upstream request failed") from last_exc

        if cache_key:
            async def _fn():
                return await _do()
            return await self.cache.get_or_set(cache_key, _fn, ttl_s=cache_ttl_s)

        return await _do()

    # ---------- Endpoints (MVP) ----------

    async def health(self) -> Any:
        return await self._request("GET", "/health", cache_key="health", cache_ttl_s=10)

    async def facts(self) -> Any:
        return await self._request("GET", "/facts", cache_key="facts", cache_ttl_s=600)

    async def dengue(self, ano: int | None = None, limit: int | None = None, offset: int | None = None) -> Any:
        params: dict[str, Any] = {}
        if ano is not None:
            params["ano"] = ano
        if limit is not None:
            params["limit"] = limit
        if offset is not None:
            params["offset"] = offset
        # cache curto (pode variar conforme atualização)
        key = f"dengue:{json.dumps(params, sort_keys=True)}"
        return await self._request("GET", "/dengue", params=params or None, cache_key=key, cache_ttl_s=120)

    async def municipios(self, q: str | None = None, limit: int | None = None) -> Any:
        params: dict[str, Any] = {}
        if q:
            params["q"] = q
        if limit is not None:
            params["limit"] = limit
        key = f"municipios:{json.dumps(params, sort_keys=True)}"
        return await self._request("GET", "/municipios", params=params or None, cache_key=key, cache_ttl_s=3600)

    async def gold(self, format: str | None = None) -> Any:
        params = {"format": format} if format else None
        key = f"gold:{format or 'json'}"
        return await self._request("GET", "/gold", params=params, cache_key=key, cache_ttl_s=600)

    async def datasets(self) -> Any:
        return await self._request("GET", "/datasets", cache_key="datasets", cache_ttl_s=3600)

    async def weather(self, cidade: str) -> Any:
        path = f"/api/v1/weather/{cidade}"
        key = f"weather:{cidade.lower()}"
        return await self._request("GET", path, cache_key=key, cache_ttl_s=600)

    async def weather_risk(self, cidade: str) -> Any:
        path = f"/api/v1/weather/{cidade}/risk"
        key = f"weather-risk:{cidade.lower()}"
        return await self._request("GET", path, cache_key=key, cache_ttl_s=600)

    async def risk_dashboard(self) -> Any:
        return await self._request("GET", "/api/v1/risk/dashboard", cache_key="risk-dashboard", cache_ttl_s=180)

    async def risk_analyze(self, payload: RiskAnalyzeRequest) -> Any:
        # cache opcional: idempotente se o mesmo payload for repetido
        key = f"risk-analyze:{payload.model_dump_json()}"
        return await self._request("POST", "/api/v1/risk/analyze", json_body=payload.model_dump(), cache_key=key, cache_ttl_s=3600)
