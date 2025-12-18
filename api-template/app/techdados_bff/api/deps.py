from __future__ import annotations

from fastapi import Depends, Request
from ..cache.ttl_cache import TTLCache
from ..clients.provider_client import DataProviderClient
from ..security.auth import get_user_context
from ..security.models import UserContext

_cache_singleton = TTLCache()
_provider_singleton = DataProviderClient()


def get_cache() -> TTLCache:
    return _cache_singleton


def get_provider() -> DataProviderClient:
    return _provider_singleton


async def user_ctx(user: UserContext = Depends(get_user_context)) -> UserContext:
    return user


def request_id(request: Request) -> str:
    return getattr(request.state, "request_id", "unknown")
