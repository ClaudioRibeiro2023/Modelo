from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class AppError(Exception):
    code: str
    message: str
    status_code: int = 400
    details: Any | None = None


class AuthError(AppError):
    pass


class ForbiddenError(AppError):
    def __init__(self, message: str = "Acesso negado", details: Any | None = None):
        super().__init__(code="FORBIDDEN", message=message, status_code=403, details=details)


class BadRequestError(AppError):
    def __init__(self, message: str = "Requisição inválida", details: Any | None = None):
        super().__init__(code="BAD_REQUEST", message=message, status_code=400, details=details)


class UpstreamError(AppError):
    def __init__(self, message: str = "Erro no provedor de dados", status_code: int = 502, details: Any | None = None):
        super().__init__(code="UPSTREAM_ERROR", message=message, status_code=status_code, details=details)
