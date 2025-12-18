"""Auditoria mínima de acesso.

- Log estruturado (JSON) por request/endpoints de dados.
- Sem armazenar PII sensível além do identificador do usuário.
"""

from __future__ import annotations

import json
import time
from typing import Any

from fastapi import Request

from app.techdados_bff.security.principal import Principal, get_principal


def audit_access(request: Request, *, action: str, resource: str, status: int, extra: dict[str, Any] | None = None) -> None:
    try:
        p: Principal = get_principal(request)
        principal_id = p.id
        roles = p.roles
        scopes = p.scopes
    except Exception:
        principal_id = "anonymous"
        roles = []
        scopes = []

    payload: dict[str, Any] = {
        "ts": int(time.time() * 1000),
        "action": action,
        "resource": resource,
        "http": {
            "method": request.method,
            "path": request.url.path,
        },
        "principal": {
            "id": principal_id,
            "roles": roles,
            "scopes": scopes,
        },
        "status": status,
    }
    if extra:
        payload["extra"] = extra

    # stdout logger (docker friendly)
    print(json.dumps(payload, ensure_ascii=False))
