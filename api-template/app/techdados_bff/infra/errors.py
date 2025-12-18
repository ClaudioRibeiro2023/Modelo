from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class UpstreamError(Exception):
    """
    Erro de integração com o upstream (API de dados).
    """
    status_code: int
    message: str
    upstream_body: Any | None = None
    upstream_url: str | None = None


@dataclass
class UpstreamTimeout(Exception):
    """
    Timeout falando com upstream.
    """
    message: str = "Timeout ao consultar upstream"
