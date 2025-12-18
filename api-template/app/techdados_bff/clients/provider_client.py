from __future__ import annotations

import time
from typing import Any, Optional
from ..core.settings import settings
from ..core.errors import UpstreamError


class SimpleCircuitBreaker:
    def __init__(self, fail_threshold: int, cooldown_s: int):
        self.fail_threshold = max(1, fail_threshold)
        self.cooldown_s = max(1, cooldown_s)
        self.fail_count = 0
        self.open_until = 0.0

    def allow(self) -> bool:
        if time.time() < self.open_until:
            return False
        return True

    def record_success(self) -> None:
        self.fail_count = 0
        self.open_until = 0.0

    def record_failure(self) -> None:
        self.fail_count += 1
        if self.fail_count >= self.fail_threshold:
            self.open_until = time.time() + self.cooldown_s


class DataProviderClient:
    def __init__(self):
        self.base_url = (settings.provider_base_url or "").rstrip("/")
        self.timeout_s = settings.provider_timeout_s
        self.retry = max(0, settings.provider_retry)
        self.cb = SimpleCircuitBreaker(settings.circuit_fail_threshold, settings.circuit_cooldown_s)

    async def get_json(self, path: str, params: Optional[dict[str, Any]] = None) -> dict:
        if not settings.provider_enabled:
            raise UpstreamError(message="Provedor desabilitado (TD_PROVIDER_ENABLED=0)", status_code=503)

        if not self.base_url:
            raise UpstreamError(message="TD_PROVIDER_BASE_URL não configurado", status_code=500)

        if not self.cb.allow():
            raise UpstreamError(message="Circuit breaker aberto para o provedor", status_code=503)

        url = f"{self.base_url}/{path.lstrip('/')}"
        last_err: Optional[str] = None

        try:
            import httpx
        except Exception as e:
            raise UpstreamError(message="Instale httpx para usar o client do provedor", status_code=500, details=str(e))

        for attempt in range(self.retry + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout_s) as client:
                    r = await client.get(url, params=params)
                    if r.status_code >= 400:
                        last_err = f"HTTP {r.status_code}: {r.text[:200]}"
                        raise UpstreamError(message="Erro do provedor", status_code=502, details=last_err)
                    data = r.json()
                    self.cb.record_success()
                    return data
            except UpstreamError:
                self.cb.record_failure()
                if attempt >= self.retry:
                    raise
                await _sleep_backoff(attempt)
            except Exception as e:
                self.cb.record_failure()
                last_err = str(e)
                if attempt >= self.retry:
                    raise UpstreamError(message="Falha ao consultar provedor", status_code=502, details=last_err)
                await _sleep_backoff(attempt)

        raise UpstreamError(message="Falha ao consultar provedor", status_code=502, details=last_err)


async def _sleep_backoff(attempt: int) -> None:
    import asyncio
    delay = 0.2 * (2 ** attempt)
    await asyncio.sleep(min(delay, 2.0))
