from __future__ import annotations

import csv
import io
import os
from typing import Iterable, Optional, Set, Tuple

from app.techdados_bff.core.errors import BadRequestError, ForbiddenError
from app.techdados_bff.infra.municipio_cache import municipio_cache


_CODE_KEYS = ("codigo_ibge", "cod_ibge", "ibge", "cd_ibge", "codigo_municipio", "cd_municipio", "municipio_ibge")
_NAME_KEYS = ("municipio", "nome_municipio", "cidade", "localidade", "nome")


def _sniff_dialect(sample: str) -> csv.Dialect:
    try:
        return csv.Sniffer().sniff(sample)
    except Exception:
        # fallback comum
        dialect = csv.get_dialect("excel")
        return dialect


def _normalize(s: str) -> str:
    return (s or "").strip().upper()


def _find_header_idx(headers: list[str], keys: tuple[str, ...]) -> Optional[int]:
    hnorm = [_normalize(h) for h in headers]
    for i, h in enumerate(hnorm):
        for k in keys:
            if h == _normalize(k):
                return i
    return None


async def filter_csv_by_municipio_scope(csv_bytes: bytes, allowed_codes: Set[str]) -> bytes:
    """Filtra CSV por escopo municipal.

    Safe-by-default:
    - Se não conseguir identificar município (código ou nome resolvível), descarta a linha.
    - Mantém header original.
    """

    if not allowed_codes:
        return csv_bytes

    enabled = (os.getenv("TD_EXPORT_FILTER_CSV_ENABLED", "false") or "false").lower() in ("1", "true", "yes", "y", "on")
    if not enabled:
        raise ForbiddenError(message="Export CSV com escopo municipal está desabilitado", details={"env": "TD_EXPORT_FILTER_CSV_ENABLED=false"})

    max_bytes = int(os.getenv("TD_EXPORT_MAX_BYTES", "30000000"))  # 30MB
    if len(csv_bytes) > max_bytes:
        raise ForbiddenError(message="Export excede limite de tamanho (bytes)", details={"bytes": len(csv_bytes), "max": max_bytes})

    text = csv_bytes.decode("utf-8-sig", errors="replace")
    if not text.strip():
        return csv_bytes

    # Detect delimiter/dialect
    sample = text[:4096]
    dialect = _sniff_dialect(sample)

    reader = csv.reader(io.StringIO(text), dialect=dialect)
    output_io = io.StringIO()
    writer = csv.writer(output_io, dialect=dialect)

    try:
        headers = next(reader)
    except StopIteration:
        return csv_bytes

    writer.writerow(headers)

    code_idx = _find_header_idx(headers, _CODE_KEYS)
    name_idx = _find_header_idx(headers, _NAME_KEYS)

    maps = None
    if code_idx is None and name_idx is not None:
        maps = await municipio_cache.get_maps()

    max_lines = int(os.getenv("TD_EXPORT_MAX_LINES", "200000"))
    kept = 0
    processed = 0

    for row in reader:
        processed += 1
        if processed > max_lines:
            raise ForbiddenError(message="Export excede limite de linhas (MVP)", details={"lines": processed, "max": max_lines})

        code = None
        if code_idx is not None and code_idx < len(row):
            code = row[code_idx].strip()
        if not code and name_idx is not None and name_idx < len(row) and maps is not None:
            name = row[name_idx].strip()
            code = maps.by_name_upper.get(name.upper())

        if code and code in allowed_codes:
            writer.writerow(row)
            kept += 1

    return output_io.getvalue().encode("utf-8")
