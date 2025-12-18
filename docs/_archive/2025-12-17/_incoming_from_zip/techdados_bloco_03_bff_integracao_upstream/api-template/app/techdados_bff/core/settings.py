from __future__ import annotations

from pydantic import BaseModel, Field
import os


class UpstreamSettings(BaseModel):
    """
    Configuração do Upstream (API de Dados do Techdengue).

    IMPORTANTE:
    - Não hardcode credenciais aqui.
    - Tudo vem de variáveis de ambiente.
    """
    base_url: str = Field(default="https://techdengue-api.railway.app")
    api_key: str | None = Field(default=None)

    timeout_seconds: int = Field(default=20, ge=1, le=120)
    verify_ssl: bool = Field(default=True)
    user_agent: str = Field(default="techdados-bff/0.1")


def get_upstream_settings() -> UpstreamSettings:
    base_url = os.getenv("TECHDENGUE_API_BASE_URL", "https://techdengue-api.railway.app").rstrip("/")
    api_key = os.getenv("TECHDENGUE_API_KEY") or None

    timeout = int(os.getenv("TECHDENGUE_API_TIMEOUT_SECONDS", "20"))
    verify_ssl = os.getenv("TECHDENGUE_API_VERIFY_SSL", "true").lower() in ("1", "true", "yes", "y", "on")
    user_agent = os.getenv("TECHDENGUE_API_USER_AGENT", "techdados-bff/0.1")

    return UpstreamSettings(
        base_url=base_url,
        api_key=api_key,
        timeout_seconds=timeout,
        verify_ssl=verify_ssl,
        user_agent=user_agent,
    )
