from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional

import httpx
from fastapi import HTTPException


@dataclass
class JWKSCache:
    jwks: Dict[str, Any]
    expires_at: float


_JWKS_CACHE: Optional[JWKSCache] = None


def _env(name: str, default: str | None = None) -> str | None:
    v = os.getenv(name)
    if v is None:
        return default
    return v.strip()


def _env_int(name: str, default: int) -> int:
    v = _env(name)
    try:
        return int(v) if v else default
    except Exception:
        return default


async def _fetch_jwks(url: str) -> Dict[str, Any]:
    timeout = httpx.Timeout(10.0, connect=5.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.json()


async def get_jwks() -> Dict[str, Any]:
    global _JWKS_CACHE
    ttl = _env_int("TD_JWT_JWKS_TTL_SECONDS", 6 * 60 * 60)

    if _JWKS_CACHE and time.time() < _JWKS_CACHE.expires_at:
        return _JWKS_CACHE.jwks

    url = _env("TD_JWT_JWKS_URL")
    if not url:
        raise HTTPException(status_code=500, detail="TD_JWT_JWKS_URL não configurado")

    try:
        jwks = await _fetch_jwks(url)
    except Exception as e:
        # cache curto pra evitar thundering herd
        _JWKS_CACHE = JWKSCache(jwks={"keys": []}, expires_at=time.time() + 60)
        raise HTTPException(status_code=503, detail=f"Falha ao buscar JWKS: {str(e)}")

    _JWKS_CACHE = JWKSCache(jwks=jwks, expires_at=time.time() + ttl)
    return jwks


def _require_jose():
    try:
        from jose import jwt  # noqa: F401
        from jose import jwk  # noqa: F401
        from jose.utils import base64url_decode  # noqa: F401
        from jose.exceptions import JWTError  # noqa: F401
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Dependência ausente: instale python-jose[cryptography] (Bloco 07)",
        )


def _validate_claims(claims: Dict[str, Any]) -> None:
    iss = _env("TD_JWT_ISSUER")
    aud = _env("TD_JWT_AUDIENCE")

    if iss and claims.get("iss") != iss:
        raise HTTPException(status_code=401, detail="JWT issuer inválido")

    if aud:
        token_aud = claims.get("aud")
        ok = False
        if isinstance(token_aud, str):
            ok = token_aud == aud
        elif isinstance(token_aud, list):
            ok = aud in token_aud
        if not ok:
            raise HTTPException(status_code=401, detail="JWT audience inválida")

    exp = claims.get("exp")
    if exp is None:
        raise HTTPException(status_code=401, detail="JWT sem exp")
    try:
        if int(exp) <= int(time.time()):
            raise HTTPException(status_code=401, detail="JWT expirado")
    except ValueError:
        raise HTTPException(status_code=401, detail="JWT exp inválido")


async def verify_and_decode_jwt(token: str) -> Dict[str, Any]:
    """Valida assinatura via JWKS (cache) e devolve claims.

    MVP seguro:
    - exige python-jose[cryptography]
    - valida iss/aud/exp
    """
    _require_jose()
    from jose import jwt, jwk
    from jose.utils import base64url_decode
    from jose.exceptions import JWTError

    try:
        header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="JWT header inválido")

    kid = header.get("kid")
    alg = header.get("alg")
    if not kid or not alg:
        raise HTTPException(status_code=401, detail="JWT sem kid/alg")

    if alg not in ("RS256", "RS384", "RS512"):
        raise HTTPException(status_code=401, detail=f"JWT alg não permitido: {alg}")

    jwks = await get_jwks()
    keys = jwks.get("keys") or []
    key_dict = next((k for k in keys if k.get("kid") == kid), None)
    if not key_dict:
        raise HTTPException(status_code=401, detail="JWT kid não encontrado no JWKS")

    # Verificação manual (evita dependência de comportamento do decode com jwkset)
    message, encoded_sig = token.rsplit(".", 1)
    sig = base64url_decode(encoded_sig.encode("utf-8"))

    try:
        key = jwk.construct(key_dict, algorithm=alg)
        if not key.verify(message.encode("utf-8"), sig):
            raise HTTPException(status_code=401, detail="Assinatura JWT inválida")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Falha ao validar assinatura JWT")

    try:
        claims = jwt.get_unverified_claims(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="JWT claims inválidos")

    _validate_claims(claims)
    return claims
