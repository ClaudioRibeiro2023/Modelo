from __future__ import annotations

from typing import Any, Dict
from app.techdados_bff.infra.techdengue_api import TechdengueUpstream
from app.techdados_bff.infra.errors import UpstreamError, UpstreamTimeout


async def get_health() -> Dict[str, Any]:
    """
    Health do BFF + tentativa de health do upstream.
    Nunca deve levantar exception para o caller.
    """
    result: Dict[str, Any] = {
        "service": "techdados-bff",
        "status": "ok",
        "upstream": {"status": "unknown"},
    }

    try:
        async with TechdengueUpstream() as api:
            data = await api.health()
            result["upstream"] = {"status": "ok", "data": data}
    except UpstreamTimeout:
        result["upstream"] = {"status": "degraded", "error": "timeout"}
    except UpstreamError as e:
        result["upstream"] = {"status": "degraded", "error": "upstream_error", "status_code": e.status_code}
    except Exception:
        result["upstream"] = {"status": "degraded", "error": "unknown"}

    return result
