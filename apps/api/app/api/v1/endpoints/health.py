"""
TechDados BFF - Health Endpoints
"""
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    """Basic health response"""
    status: str


class LivenessResponse(BaseModel):
    """Liveness probe response"""
    status: str
    timestamp: str


@router.get("/health", response_model=HealthResponse)
async def health():
    """
    Basic health check.
    Used by load balancers and container orchestration.
    """
    return HealthResponse(status="ok")


@router.get("/health/live", response_model=LivenessResponse)
async def liveness():
    """
    Liveness probe.
    Kubernetes uses this to know when to restart a container.
    """
    return LivenessResponse(
        status="alive",
        timestamp=datetime.utcnow().isoformat(),
    )
