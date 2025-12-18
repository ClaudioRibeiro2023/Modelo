from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Dict, Optional

from app.techdados_bff.infra.techdengue_api import TechdengueUpstream


@dataclass
class MunicipioMaps:
    by_name_upper: Dict[str, str]
    by_code: Dict[str, str]


class MunicipioCache:
    """Cache simples em memória para mapear nome↔código IBGE via upstream /municipios.

    - TTL default: 6h
    - Safe-by-default: se falhar, retorna mapas vazios.
    """

    def __init__(self, ttl_seconds: int = 6 * 60 * 60):
        self.ttl_seconds = ttl_seconds
        self._expires_at = 0.0
        self._maps = MunicipioMaps(by_name_upper={}, by_code={})

    def _expired(self) -> bool:
        return time.time() >= self._expires_at

    async def get_maps(self) -> MunicipioMaps:
        if not self._expired() and self._maps.by_name_upper:
            return self._maps

        try:
            async with TechdengueUpstream() as api:
                data = await api.municipios(limit=5000, q=None)
        except Exception:
            self._expires_at = time.time() + min(self.ttl_seconds, 5 * 60)
            return self._maps

        rows = data if isinstance(data, list) else (data.get("items") if isinstance(data, dict) else [])
        by_name_upper: Dict[str, str] = {}
        by_code: Dict[str, str] = {}

        for r in rows or []:
            code = None
            name = None
            for k in ("codigo_ibge", "ibge", "cod_ibge", "cd_ibge", "codigo_municipio"):
                if k in r and r[k] is not None:
                    code = str(r[k]).strip()
                    break
            for k in ("municipio", "nome", "nome_municipio", "cidade"):
                if k in r and r[k] is not None:
                    name = str(r[k]).strip()
                    break
            if code:
                by_code[code] = name or by_code.get(code) or ""
            if code and name:
                by_name_upper[name.upper()] = code

        self._maps = MunicipioMaps(by_name_upper=by_name_upper, by_code=by_code)
        self._expires_at = time.time() + self.ttl_seconds
        return self._maps


municipio_cache = MunicipioCache()
