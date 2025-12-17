"""
TechDados BFF - Test Configuration
"""
import pytest
from fastapi.testclient import TestClient
import os

# Set test environment
os.environ["DEMO_MODE"] = "true"
os.environ["APP_ENV"] = "test"

from app.main import app


@pytest.fixture
def client():
    """Test client fixture"""
    return TestClient(app)
