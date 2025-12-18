"""Cache TTL in-memory (processo) — simples e eficiente para reduzir carga do upstream.

- Ideal para dev e para MVP.
- Em produção, migrar para Redis (mantendo a mesma interface).
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Any, Callable


@dataclass
class _Entry:
    value: Any
    expires_at: float


class TTLCache:
    def __init__(self, default_ttl_s: int = 60, max_items: int = 2048):
        self.default_ttl_s = int(default_ttl_s)
        self.max_items = int(max_items)
        self._store: dict[str, _Entry] = {}

    def get(self, key: str) -> Any | None:
        e = self._store.get(key)
        if not e:
            return None
        if e.expires_at < time.time():
            self._store.pop(key, None)
            return None
        return e.value

    def set(self, key: str, value: Any, ttl_s: int | None = None) -> None:
        ttl = self.default_ttl_s if ttl_s is None else int(ttl_s)
        if len(self._store) >= self.max_items:
            # estratégia simples: remove 10% (não LRU)
            for k in list(self._store.keys())[: max(1, self.max_items // 10)]:
                self._store.pop(k, None)
        self._store[key] = _Entry(value=value, expires_at=time.time() + ttl)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def clear(self) -> None:
        self._store.clear()

    async def get_or_set(self, key: str, fn: Callable[[], Any], ttl_s: int | None = None) -> Any:
        cached = self.get(key)
        if cached is not None:
            return cached
        value = await fn()
        self.set(key, value, ttl_s=ttl_s)
        return value
