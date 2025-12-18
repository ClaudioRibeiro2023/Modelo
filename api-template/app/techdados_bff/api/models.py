from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Any, Dict, Optional


class ErrorResponse(BaseModel):
    code: str
    message: str
    request_id: str
    details: Optional[Any] = None


class StatusResponse(BaseModel):
    app_name: str = "techdados-api"
    version: str = "0.1.0"
    env: str = Field(default="local")
    keycloak: Dict[str, Any]
    provider: Dict[str, Any]
    cache: Dict[str, Any]
    timestamp: str


class ExportRequest(BaseModel):
    scope_type: str
    scope_id: str
    export_type: str = Field(default="csv", description="csv|xlsx|pdf")
    view_id: str = Field(..., description="ex.: TD_VIEW_010")
    params: Dict[str, Any] = Field(default_factory=dict)


class ExportResponse(BaseModel):
    status: str
    export_id: str
