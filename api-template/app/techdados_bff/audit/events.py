from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict


@dataclass(frozen=True)
class AuditEvent:
    name: str
    user_id: str
    request_id: str
    route: str
    metadata: Dict[str, Any]
