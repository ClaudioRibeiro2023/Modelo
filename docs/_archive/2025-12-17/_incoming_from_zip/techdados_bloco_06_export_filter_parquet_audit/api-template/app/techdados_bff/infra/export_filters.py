from __future__ import annotations

import csv
import io
import os
from typing import Optional, Set, Tuple

from app.techdados_bff.core.errors import ForbiddenError
from app.techdados_bff.infra.municipio_cache import municipio_cache


_CODE_KEYS = ("codigo_ibge", "cod_ibge", "ibge", "cd_ibge", "codigo_municipio", "cd_municipio", "municipio_ibge")
_NAME_KEYS = ("municipio", "nome_municipio", "cidade", "localidade", "nome")


def _sniff_dialect(sample: str) -> csv.Dialect:
    try:
        return csv.Sniffer().sniff(sample)
    except Exception:
        return csv.get_dialect("excel")


def _normalize(s: str) -> str:
    return (s or "").strip().upper()


def _find_header_idx(headers: list[str], keys: tuple[str, ...]) -> Optional[int]:
    hnorm = [_normalize(h) for h in headers]
    for i, h in enumerate(hnorm):
        for k in keys:
            if h == _normalize(k):
                return i
    return None


def _env_true(name: str, default: str = "false") -> bool:
    return (os.getenv(name, default) or default).lower() in ("1", "true", "yes", "y", "on")


async def filter_csv_by_municipio_scope(csv_bytes: bytes, allowed_codes: Set[str]) -> bytes:
    """Filtra CSV por escopo municipal (safe-by-default)."""
    if not allowed_codes:
        return csv_bytes

    if not _env_true("TD_EXPORT_FILTER_CSV_ENABLED", "false"):
        raise ForbiddenError(message="Export CSV com escopo municipal está desabilitado", details={"env": "TD_EXPORT_FILTER_CSV_ENABLED=false"})

    max_bytes = int(os.getenv("TD_EXPORT_MAX_BYTES", "30000000"))  # 30MB
    if len(csv_bytes) > max_bytes:
        raise ForbiddenError(message="Export excede limite de tamanho (bytes)", details={"bytes": len(csv_bytes), "max": max_bytes})

    text = csv_bytes.decode("utf-8-sig", errors="replace")
    if not text.strip():
        return csv_bytes

    dialect = _sniff_dialect(text[:4096])
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
    processed = 0

    for row in reader:
        processed += 1
        if processed > max_lines:
            raise ForbiddenError(message="Export excede limite de linhas (MVP)", details={"lines": processed, "max": max_lines})

        code = None
        if code_idx is not None and code_idx < len(row):
            code = (row[code_idx] or "").strip()

        if not code and name_idx is not None and name_idx < len(row) and maps is not None:
            name = (row[name_idx] or "").strip()
            code = maps.by_name_upper.get(name.upper())

        if code and code in allowed_codes:
            writer.writerow(row)

    return output_io.getvalue().encode("utf-8")


def _find_parquet_code_column(col_names: list[str]) -> Optional[str]:
    norm = {c.lower(): c for c in col_names}
    for k in _CODE_KEYS:
        if k in norm:
            return norm[k]
    # também tenta match parcial comum (ex.: "cod_ibge_municipio")
    for c in col_names:
        cl = c.lower()
        if "ibge" in cl and ("cod" in cl or "codigo" in cl or cl == "ibge"):
            return c
    return None


async def filter_parquet_by_municipio_scope(parquet_bytes: bytes, allowed_codes: Set[str]) -> bytes:
    """Filtra Parquet por escopo municipal (MVP seguro).

    Requisitos:
    - `pyarrow` instalado
    - existência de coluna IBGE reconhecida
    """
    if not allowed_codes:
        return parquet_bytes

    if not _env_true("TD_EXPORT_FILTER_PARQUET_ENABLED", "false"):
        raise ForbiddenError(message="Export Parquet com escopo municipal está desabilitado", details={"env": "TD_EXPORT_FILTER_PARQUET_ENABLED=false"})

    max_bytes = int(os.getenv("TD_EXPORT_MAX_BYTES", "30000000"))
    if len(parquet_bytes) > max_bytes:
        raise ForbiddenError(message="Export excede limite de tamanho (bytes)", details={"bytes": len(parquet_bytes), "max": max_bytes})

    try:
        import pyarrow as pa  # type: ignore
        import pyarrow.parquet as pq  # type: ignore
        import pyarrow.compute as pc  # type: ignore
    except Exception:
        raise ForbiddenError(message="pyarrow não instalado para filtrar Parquet", details={"hint": "pip install pyarrow"})

    buf = io.BytesIO(parquet_bytes)
    table = pq.read_table(buf)
    col = _find_parquet_code_column(table.column_names)
    if not col:
        raise ForbiddenError(
            message="Dataset Parquet não possui coluna IBGE reconhecida para filtrar por escopo",
            details={"columns": table.column_names, "expected": list(_CODE_KEYS)},
        )

    # Cast para string para comparação
    arr = table[col]
    try:
        arr_str = pc.cast(arr, pa.string())
    except Exception:
        arr_str = arr

    allowed_list = list(allowed_codes)
    mask = pc.is_in(arr_str, value_set=pa.array(allowed_list, type=pa.string()))
    filtered = table.filter(mask)

    out = io.BytesIO()
    pq.write_table(filtered, out, compression="snappy")
    return out.getvalue()
