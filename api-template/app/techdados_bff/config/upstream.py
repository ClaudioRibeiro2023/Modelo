"""Config de integração upstream (Techdengue API).

Este arquivo mantém a configuração isolada para facilitar testes e futuras migrações
(ex.: multi-upstream, Redis cache, circuit breaker).
"""

from pydantic import BaseModel, Field


class TechDengueUpstreamSettings(BaseModel):
    base_url: str = Field(default="https://techdengue-api.railway.app")
    api_key: str | None = Field(default=None)

    timeout_s: float = Field(default=15)
    retries: int = Field(default=2)

    cache_default_ttl_s: int = Field(default=60)

    @staticmethod
    def from_env(env: dict) -> "TechDengueUpstreamSettings":
        # env vem de os.environ, dotenv ou settings central
        def _get(name: str, default=None):
            return env.get(name, default)

        return TechDengueUpstreamSettings(
            base_url=_get("TD_TECHDENGUE_BASE_URL", "https://techdengue-api.railway.app"),
            api_key=_get("TD_TECHDENGUE_API_KEY") or None,
            timeout_s=float(_get("TD_TECHDENGUE_TIMEOUT_S", 15)),
            retries=int(_get("TD_TECHDENGUE_RETRIES", 2)),
            cache_default_ttl_s=int(_get("TD_TECHDENGUE_CACHE_DEFAULT_TTL_S", 60)),
        )
