"""
TechDados BFF - Settings
Pydantic Settings for environment configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App
    APP_NAME: str = "techdados-api"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = "local"
    DEBUG: bool = False
    
    # API
    API_PREFIX: str = "/api"
    
    # Demo mode - allows endpoints without auth
    DEMO_MODE: bool = True
    
    # Keycloak
    KEYCLOAK_URL: str = "http://localhost:8080"
    KEYCLOAK_REALM: str = "techdados"
    KEYCLOAK_AUDIENCE: str = "techdados-api"
    
    # Provider (API de Dados Techdengue)
    PROVIDER_BASE_URL: str = ""
    PROVIDER_TIMEOUT_SECONDS: int = 15
    
    # Cache TTLs
    CACHE_ENABLED: bool = True
    CACHE_TTL_SECONDS_P0: int = 3600  # 1 hour for P0 endpoints
    CACHE_TTL_SECONDS_P1: int = 3600  # 1 hour for P1 endpoints
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:13000",
    ]
    
    @property
    def keycloak_jwks_url(self) -> str:
        """JWKS endpoint for token verification"""
        return f"{self.KEYCLOAK_URL}/realms/{self.KEYCLOAK_REALM}/protocol/openid-connect/certs"
    
    @property
    def keycloak_issuer(self) -> str:
        """Expected issuer in JWT tokens"""
        return f"{self.KEYCLOAK_URL}/realms/{self.KEYCLOAK_REALM}"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
