from __future__ import annotations

from dataclasses import dataclass
import os


def _env(key: str, default: str | None = None) -> str | None:
    val = os.getenv(key)
    return val if val is not None and val != "" else default


def _env_int(key: str, default: int) -> int:
    v = _env(key)
    try:
        return int(v) if v is not None else default
    except Exception:
        return default


def _env_bool(key: str, default: bool) -> bool:
    v = (_env(key) or "").strip().lower()
    if v in ("1", "true", "yes", "y", "on"):
        return True
    if v in ("0", "false", "no", "n", "off"):
        return False
    return default


@dataclass(frozen=True)
class TechDadosSettings:
    # Auth
    auth_mode: str = _env("TD_AUTH_MODE", "mock") or "mock"
    mock_user_id: str = _env("TD_MOCK_USER_ID", "dev") or "dev"
    mock_roles: str = _env("TD_MOCK_ROLES", "admin,estrategico") or "admin,estrategico"
    mock_scopes: str = _env("TD_MOCK_SCOPES", "STATE:MG") or "STATE:MG"

    # Keycloak (P2)
    keycloak_issuer_url: str | None = _env("TD_KEYCLOAK_ISSUER_URL")
    keycloak_audience: str | None = _env("TD_KEYCLOAK_AUDIENCE")

    # Provider
    provider_enabled: bool = _env_bool("TD_PROVIDER_ENABLED", False)
    provider_base_url: str | None = _env("TD_PROVIDER_BASE_URL")
    provider_timeout_s: int = _env_int("TD_PROVIDER_TIMEOUT_S", 15)
    provider_retry: int = _env_int("TD_PROVIDER_RETRY", 2)

    # Cache
    cache_enabled: bool = _env_bool("TD_CACHE_ENABLED", True)
    cache_ttl_home_s: int = _env_int("TD_CACHE_TTL_HOME_S", 1800)
    cache_ttl_epi_s: int = _env_int("TD_CACHE_TTL_EPI_S", 3600)
    cache_ttl_risk_s: int = _env_int("TD_CACHE_TTL_RISK_S", 1800)
    cache_ttl_weather_s: int = _env_int("TD_CACHE_TTL_WEATHER_S", 900)
    cache_ttl_ref_s: int = _env_int("TD_CACHE_TTL_REF_S", 86400)
    cache_ttl_status_s: int = _env_int("TD_CACHE_TTL_STATUS_S", 120)

    # Circuit breaker (simples)
    circuit_fail_threshold: int = _env_int("TD_CB_FAIL_THRESHOLD", 5)
    circuit_cooldown_s: int = _env_int("TD_CB_COOLDOWN_S", 60)

    # Logging/Audit
    audit_enabled: bool = _env_bool("TD_AUDIT_ENABLED", True)


settings = TechDadosSettings()
