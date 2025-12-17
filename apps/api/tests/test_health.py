"""
TechDados BFF - Health Endpoint Tests
"""
import pytest
from fastapi.testclient import TestClient


def test_health_endpoint(client: TestClient):
    """Test /health returns ok"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_health_live_endpoint(client: TestClient):
    """Test /health/live returns alive with timestamp"""
    response = client.get("/health/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"
    assert "timestamp" in data


def test_root_endpoint(client: TestClient):
    """Test / returns app info"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert "docs" in data
