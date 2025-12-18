from __future__ import annotations

import json
import os
import time
from typing import Any, Dict, Optional

import requests


KEYCLOAK_BASE = os.getenv("KEYCLOAK_URL", "http://localhost:8080").rstrip("/")
ADMIN_USER = os.getenv("KEYCLOAK_ADMIN", "admin")
ADMIN_PASS = os.getenv("KEYCLOAK_ADMIN_PASSWORD", "admin")

REALM = "techdados"
REALM_FILE = os.path.join(os.path.dirname(__file__), "techdados-realm.json")


def admin_token() -> str:
    url = f"{KEYCLOAK_BASE}/realms/master/protocol/openid-connect/token"
    data = {
        "grant_type": "password",
        "client_id": "admin-cli",
        "username": ADMIN_USER,
        "password": ADMIN_PASS,
    }
    r = requests.post(url, data=data, timeout=10)
    r.raise_for_status()
    return r.json()["access_token"]


def realm_exists(tok: str) -> bool:
    url = f"{KEYCLOAK_BASE}/admin/realms/{REALM}"
    r = requests.get(url, headers={"Authorization": f"Bearer {tok}"}, timeout=10)
    return r.status_code == 200


def import_realm(tok: str) -> None:
    with open(REALM_FILE, "r", encoding="utf-8") as f:
        payload = json.load(f)

    url = f"{KEYCLOAK_BASE}/admin/realms"
    r = requests.post(url, json=payload, headers={"Authorization": f"Bearer {tok}"}, timeout=30)
    if r.status_code == 409:
        return
    r.raise_for_status()


def main():
    tok = admin_token()
    if not realm_exists(tok):
        print("Importando realm techdados...")
        import_realm(tok)
        time.sleep(1)
    else:
        print("Realm techdados já existe.")

    print("Seed concluído.")
    print(f"Admin: {KEYCLOAK_BASE}/admin (admin/admin)")
    print(f"Realm: {REALM}")
    print("Usuário dev: dev@techdados.local / dev")


if __name__ == "__main__":
    main()
