"""
TechDados BFF - Security (JWT Keycloak)
JWKS validation and user extraction
"""
from typing import Optional
from dataclasses import dataclass, field
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from jose import jwt, JWTError, jwk
from jose.exceptions import JWKError
import time

from .settings import get_settings, Settings
from .logging import get_logger

logger = get_logger(__name__)

# HTTP Bearer scheme
security = HTTPBearer(auto_error=False)

# JWKS cache
_jwks_cache: dict = {}
_jwks_cache_time: float = 0
JWKS_CACHE_TTL = 3600  # 1 hour


@dataclass
class CurrentUser:
    """Authenticated user from JWT token"""
    sub: str
    username: str
    email: Optional[str] = None
    roles: list[str] = field(default_factory=list)
    scope_key: str = "global"
    demo_mode: bool = False
    raw_token: Optional[str] = None


def _get_demo_user() -> CurrentUser:
    """Return demo user for DEMO_MODE=true"""
    return CurrentUser(
        sub="demo-user",
        username="demo@techdados.local",
        email="demo@techdados.local",
        roles=["suporte"],
        scope_key="demo",
        demo_mode=True,
    )


async def _fetch_jwks(settings: Settings) -> dict:
    """Fetch JWKS from Keycloak"""
    global _jwks_cache, _jwks_cache_time
    
    now = time.time()
    if _jwks_cache and (now - _jwks_cache_time) < JWKS_CACHE_TTL:
        return _jwks_cache
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(settings.keycloak_jwks_url)
            response.raise_for_status()
            _jwks_cache = response.json()
            _jwks_cache_time = now
            logger.info("jwks_fetched", url=settings.keycloak_jwks_url)
            return _jwks_cache
    except Exception as e:
        logger.error("jwks_fetch_failed", error=str(e), url=settings.keycloak_jwks_url)
        if _jwks_cache:
            return _jwks_cache
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to fetch JWKS from Keycloak",
        )


def _get_signing_key(jwks: dict, token: str) -> str:
    """Get signing key from JWKS that matches the token's kid"""
    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                return jwk.construct(key).to_pem().decode("utf-8")
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to find matching signing key",
        )
    except JWKError as e:
        logger.error("jwk_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signing key",
        )


def _extract_roles(payload: dict) -> list[str]:
    """Extract realm roles from JWT payload"""
    roles = []
    
    # Keycloak realm roles are in realm_access.roles
    realm_access = payload.get("realm_access", {})
    roles.extend(realm_access.get("roles", []))
    
    # Filter out Keycloak internal roles
    internal_roles = {"offline_access", "uma_authorization", "default-roles-techdados"}
    return [r for r in roles if r not in internal_roles]


async def _validate_token(token: str, settings: Settings) -> CurrentUser:
    """Validate JWT token and extract user info"""
    try:
        jwks = await _fetch_jwks(settings)
        signing_key = _get_signing_key(jwks, token)
        
        # Decode and validate token
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=settings.keycloak_issuer,
            options={
                "verify_aud": False,  # Keycloak tokens may not have audience
                "verify_exp": True,
            },
        )
        
        # Extract user info
        sub = payload.get("sub", "")
        username = payload.get("preferred_username", payload.get("email", sub))
        email = payload.get("email")
        roles = _extract_roles(payload)
        
        # TODO: Extract territorial scope from claims for ABAC
        # For now, use user-specific scope key
        scope_key = f"user:{sub}"
        
        return CurrentUser(
            sub=sub,
            username=username,
            email=email,
            roles=roles,
            scope_key=scope_key,
            demo_mode=False,
            raw_token=token,
        )
        
    except JWTError as e:
        logger.warning("jwt_validation_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    settings: Settings = Depends(get_settings),
) -> CurrentUser:
    """
    Dependency to get current authenticated user.
    
    If DEMO_MODE=true and no token provided, returns demo user.
    Otherwise, validates JWT token from Keycloak.
    """
    # If no credentials provided
    if credentials is None:
        if settings.DEMO_MODE:
            return _get_demo_user()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Validate token
    return await _validate_token(credentials.credentials, settings)


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    settings: Settings = Depends(get_settings),
) -> Optional[CurrentUser]:
    """
    Dependency to optionally get current user.
    Returns None if not authenticated (useful for public endpoints).
    """
    if credentials is None:
        if settings.DEMO_MODE:
            return _get_demo_user()
        return None
    
    try:
        return await _validate_token(credentials.credentials, settings)
    except HTTPException:
        return None
