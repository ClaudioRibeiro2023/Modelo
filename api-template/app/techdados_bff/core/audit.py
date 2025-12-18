from __future__ import annotations

import json
import os
import time
from typing import Any, Dict, Optional

from app.techdados_bff.security.models import UserContext


def audit_export_event(
    *,
    endpoint: str,
    user: UserContext,
    fmt: str,
    status: str,
    bytes_out: int | None = None,
    details: Optional[Dict[str, Any]] = None,
) -> None:
    """Auditoria mínima de exportação (MVP).

    - Sempre emite um log estruturado (stdout).
    - Opcionalmente persiste em arquivo JSONL se `TD_AUDIT_LOG_PATH` estiver definido.
    """
    evt: Dict[str, Any] = {
        "ts": int(time.time()),
        "event": "export",
        "endpoint": endpoint,
        "user_id": user.user_id,
        "roles": list(user.roles or []),
        "scopes": list(user.scopes or []),
        "format": fmt,
        "status": status,
    }
    if bytes_out is not None:
        evt["bytes_out"] = int(bytes_out)
    if details:
        evt["details"] = details

    line = json.dumps(evt, ensure_ascii=False)
    # stdout
    print(line)

    path = os.getenv("TD_AUDIT_LOG_PATH")
    if path:
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "a", encoding="utf-8") as f:
                f.write(line + "\n")
        except Exception:
            # não quebra request por falha de auditoria no MVP
            pass
