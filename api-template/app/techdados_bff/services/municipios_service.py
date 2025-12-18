from __future__ import annotations

from typing import Any
from app.techdados_bff.services._common import TechdengueUpstream


async def get_municipios(*, limit: int, q: str | None) -> Any:
    async with TechdengueUpstream() as api:
        return await api.municipios(limit=limit, q=q)
