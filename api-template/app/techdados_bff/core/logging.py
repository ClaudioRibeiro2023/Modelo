from __future__ import annotations

import json
import logging
import os
from typing import Any


def setup_logging() -> None:
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(level=level, format="%(message)s")


def log_json(logger: logging.Logger, payload: dict[str, Any], level: int = logging.INFO) -> None:
    try:
        logger.log(level, json.dumps(payload, ensure_ascii=False))
    except Exception:
        logger.log(level, str(payload))
