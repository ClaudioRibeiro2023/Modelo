from __future__ import annotations

import logging
from typing import Any, Dict
from .events import AuditEvent
from ..core.logging import log_json
from ..core.settings import settings

logger = logging.getLogger("techdados.audit")


def emit(event: AuditEvent) -> None:
    if not settings.audit_enabled:
        return
    payload: Dict[str, Any] = {
        "type": "AUDIT",
        "event": event.name,
        "user_id": event.user_id,
        "request_id": event.request_id,
        "route": event.route,
        "metadata": event.metadata,
    }
    log_json(logger, payload)
