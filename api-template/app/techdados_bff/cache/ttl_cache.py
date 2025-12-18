from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class CacheEntry:
    value: Any
    expires_at: float


class TTLCache:
    def __init__(self):
        self._store: Dict[str, CacheEntry] = {}

    def get(self, key: str) -> Any | None:
        e = self._store.get(key)
        if not e:
            return None
        if time.time() >= e.expires_at:
            self._store.pop(key, None)
            return None
        return e.value

    def set(self, key: str, value: Any, ttl_s: int) -> None:
        self._store[key] = CacheEntry(value=value, expires_at=time.time() + max(1, ttl_s))

    def clear_prefix(self, prefix: str) -> int:
        ks = [k for k in self._store.keys() if k.startswith(prefix)]
        for k in ks:
            self._store.pop(k, None)
        return len(ks)
