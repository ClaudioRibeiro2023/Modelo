"""
TechDados BFF - Techdengue API Client (Stub)
Client for integrating with the Techdengue data provider
"""
import json
from pathlib import Path
from typing import Any, Optional
import httpx

from ..core.settings import get_settings, Settings
from ..core.logging import get_logger

logger = get_logger(__name__)

# Fixture directory
FIXTURES_DIR = Path(__file__).parent / "fixtures"


class TechdengueClient:
    """
    Client for Techdengue data provider API.
    
    In stub mode (no PROVIDER_BASE_URL), returns fixture data.
    When configured, makes real HTTP requests to the provider.
    """
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.base_url = settings.PROVIDER_BASE_URL
        self.timeout = settings.PROVIDER_TIMEOUT_SECONDS
        self._client: Optional[httpx.AsyncClient] = None
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                timeout=self.timeout,
            )
        return self._client
    
    async def close(self) -> None:
        """Close HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None
    
    def _load_fixture(self, name: str) -> Any:
        """Load fixture data from JSON file"""
        fixture_path = FIXTURES_DIR / f"{name}.json"
        if fixture_path.exists():
            with open(fixture_path, "r", encoding="utf-8") as f:
                return json.load(f)
        
        logger.warning("fixture_not_found", name=name)
        return {"error": "fixture_not_found", "name": name}
    
    async def ping(self) -> dict:
        """
        Ping the provider to check connectivity.
        
        Returns:
            Provider status information
        """
        if not self.base_url:
            logger.info("provider_ping_fixture")
            return {
                "source": "fixture",
                "status": "ok",
                "message": "Provider not configured, using fixtures",
            }
        
        try:
            client = await self._get_client()
            response = await client.get("/health")
            response.raise_for_status()
            
            logger.info("provider_ping_success", url=self.base_url)
            return {
                "source": "provider",
                "status": "ok",
                "data": response.json() if response.headers.get("content-type", "").startswith("application/json") else None,
            }
        except httpx.HTTPError as e:
            logger.error("provider_ping_failed", error=str(e))
            raise Exception(f"Provider unreachable: {e}")
    
    async def get_dengue_series(
        self,
        uf: Optional[str] = None,
        ano: Optional[int] = None,
    ) -> dict:
        """
        Get dengue epidemiological series data.
        
        Args:
            uf: State code (e.g., "SP", "RJ")
            ano: Year filter
        
        Returns:
            Dengue series data
        """
        if not self.base_url:
            logger.info("dengue_series_fixture", uf=uf, ano=ano)
            fixture = self._load_fixture("dengue_series.sample")
            
            # Apply basic filtering on fixture if needed
            if isinstance(fixture, dict) and "data" in fixture:
                return fixture
            return {"data": fixture, "source": "fixture"}
        
        try:
            client = await self._get_client()
            params = {}
            if uf:
                params["uf"] = uf
            if ano:
                params["ano"] = ano
            
            response = await client.get("/api/v1/dengue/series", params=params)
            response.raise_for_status()
            
            return {"data": response.json(), "source": "provider"}
        except httpx.HTTPError as e:
            logger.error("dengue_series_failed", error=str(e))
            # Fallback to fixture on error
            return self._load_fixture("dengue_series.sample")
    
    async def get_risk_dashboard(
        self,
        uf: Optional[str] = None,
        semana_epidemiologica: Optional[int] = None,
    ) -> dict:
        """
        Get risk dashboard data.
        
        Args:
            uf: State code
            semana_epidemiologica: Epidemiological week
        
        Returns:
            Risk dashboard data
        """
        if not self.base_url:
            logger.info("risk_dashboard_fixture", uf=uf, se=semana_epidemiologica)
            return self._load_fixture("risk_dashboard.sample")
        
        try:
            client = await self._get_client()
            params = {}
            if uf:
                params["uf"] = uf
            if semana_epidemiologica:
                params["se"] = semana_epidemiologica
            
            response = await client.get("/api/v1/risk/dashboard", params=params)
            response.raise_for_status()
            
            return {"data": response.json(), "source": "provider"}
        except httpx.HTTPError as e:
            logger.error("risk_dashboard_failed", error=str(e))
            return self._load_fixture("risk_dashboard.sample")


# Global client instance
_client: Optional[TechdengueClient] = None


def get_client() -> TechdengueClient:
    """Get the global Techdengue client instance"""
    global _client
    if _client is None:
        _client = TechdengueClient(get_settings())
    return _client
