from __future__ import annotations

from typing import Optional, List
from fastapi import Header
from .models import UserContext
from ..core.settings import settings
from ..core.errors import AuthError


def _split_csv(v: str) -> List[str]:
    return [x.strip() for x in (v or "").split(",") if x.strip()]


async def get_user_context(authorization: Optional[str] = Header(default=None)) -> UserContext:
    mode = (settings.auth_mode or "mock").lower().strip()

    if mode in ("disabled", "off", "none"):
        return UserContext(user_id="anonymous", roles=["admin"], scopes=["STATE:MG"])

    if mode == "mock":
        return UserContext(
            user_id=settings.mock_user_id,
            roles=_split_csv(settings.mock_roles),
            scopes=_split_csv(settings.mock_scopes),
        )

    if mode == "keycloak":
        if not authorization:
            raise AuthError(code="UNAUTHORIZED", message="Token ausente", status_code=401)
        if not authorization.lower().startswith("bearer "):
            raise AuthError(code="UNAUTHORIZED", message="Authorization inválido", status_code=401)

        token = authorization.split(" ", 1)[1].strip()
        return await _verify_keycloak_jwt(token)

    raise AuthError(code="AUTH_MODE_INVALID", message=f"TD_AUTH_MODE inválido: {settings.auth_mode}", status_code=500)


async def _verify_keycloak_jwt(token: str) -> UserContext:
    issuer = settings.keycloak_issuer_url
    audience = settings.keycloak_audience
    if not issuer or not audience:
        raise AuthError(code="KEYCLOAK_MISSING_CONFIG", message="Config Keycloak ausente", status_code=500)

    try:
        import jwt  # PyJWT
    except Exception as e:
        raise AuthError(code="JWT_LIB_MISSING", message="Instale PyJWT para usar TD_AUTH_MODE=keycloak", status_code=500, details=str(e))

    jwks = await _fetch_jwks(issuer)
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")

    key = None
    for k in jwks.get("keys", []):
        if k.get("kid") == kid:
            key = k
            break
    if not key:
        raise AuthError(code="JWKS_KEY_NOT_FOUND", message="Chave JWKS não encontrada", status_code=401)

    try:
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
        claims = jwt.decode(token, public_key, algorithms=[unverified_header.get("alg", "RS256")], audience=audience, issuer=issuer)
    except Exception as e:
        raise AuthError(code="TOKEN_INVALID", message="Token inválido", status_code=401, details=str(e))

    user_id = claims.get("sub") or claims.get("preferred_username") or "unknown"

    roles = []
    realm_access = claims.get("realm_access") or {}
    roles += realm_access.get("roles") or []

    scopes = []
    if isinstance(claims.get("td_scopes"), list):
        scopes = claims["td_scopes"]
    else:
        scope_str = claims.get("scope") or ""
        scopes = [s.strip() for s in scope_str.split(" ") if s.strip()]

    if not roles:
        roles = ["tatico"]

    return UserContext(user_id=str(user_id), roles=[str(r) for r in roles], scopes=[str(s) for s in scopes])


async def _fetch_jwks(issuer: str) -> dict:
    url = issuer.rstrip("/") + "/protocol/openid-connect/certs"
    try:
        import httpx
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(url)
            r.raise_for_status()
            return r.json()
    except Exception:
        import json
        from urllib.request import urlopen, Request
        req = Request(url, headers={"User-Agent": "techdados-bff"})
        with urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body)
