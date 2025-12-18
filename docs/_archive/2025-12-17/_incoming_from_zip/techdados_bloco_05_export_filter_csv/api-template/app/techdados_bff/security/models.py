from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class UserContext:
    user_id: str
    roles: List[str]
    scopes: List[str]
