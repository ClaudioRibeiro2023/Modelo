from __future__ import annotations

from typing import Any
from app.techdados_bff.services._common import TechdengueUpstream


async def get_dengue(*, limit: int, offset: int, ano: int | None, q: str | None) -> Any:
    async with TechdengueUpstream() as api:
        return await api.dengue(limit=limit, offset=offset, ano=ano, q=q)
