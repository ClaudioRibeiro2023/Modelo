from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class UserContext:
    user_id: str
    roles: List[str]
    scopes: List[str]  # ex.: ["STATE:MG", "URS:URS-SJDR", "MUNICIPIO:3106200"]

    def has_role(self, role: str) -> bool:
        return role.lower() in [r.lower() for r in self.roles]
