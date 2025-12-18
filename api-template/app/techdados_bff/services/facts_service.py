from __future__ import annotations

from typing import Any
from app.techdados_bff.services._common import TechdengueUpstream


async def get_facts(*, limit: int, offset: int, format: str, q: str | None, fields: str | None) -> Any:
    async with TechdengueUpstream() as api:
        return await api.facts(limit=limit, offset=offset, format=format, q=q, fields=fields)
