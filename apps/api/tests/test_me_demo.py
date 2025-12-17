"""
TechDados BFF - Me Endpoint Tests (Demo Mode)
"""
import pytest
from fastapi.testclient import TestClient


def test_me_endpoint_demo_mode(client: TestClient):
    """Test /api/v1/me returns demo user in demo mode"""
    response = client.get("/api/v1/me")
    assert response.status_code == 200
    
    data = response.json()
    assert "sub" in data
    assert "username" in data
    assert "roles" in data
    assert "scope_key" in data
    assert "demo_mode" in data
    
    # In demo mode, should return demo user
    assert data["demo_mode"] is True
    assert data["sub"] == "demo-user"


def test_status_endpoint(client: TestClient):
    """Test /api/v1/status returns system info"""
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    
    data = response.json()
    assert "app_name" in data
    assert "version" in data
    assert "env" in data
    assert "demo_mode" in data
    assert "keycloak" in data
    assert "provider" in data
    assert "cache" in data
    assert "timestamp" in data
    
    # Verify nested structures
    assert "url" in data["keycloak"]
    assert "realm" in data["keycloak"]
    assert "enabled" in data["cache"]
