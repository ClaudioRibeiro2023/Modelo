from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional


@dataclass
class AppError(Exception):
    message: str
    details: Optional[Dict[str, Any]] = None


class ForbiddenError(AppError):
    pass


class BadRequestError(AppError):
    pass
