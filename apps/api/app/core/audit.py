"""
TechDados BFF - Audit Logging
Structured audit logs for all requests
"""
import time
import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from .logging import get_logger
from .security import CurrentUser

logger = get_logger("audit")


class AuditMiddleware(BaseHTTPMiddleware):
    """
    Middleware that logs all requests with audit information.
    
    Logs include:
    - request_id: Unique ID for the request
    - timestamp: ISO timestamp
    - user_id: User sub from JWT (or "anonymous")
    - username: Username from JWT
    - roles: User roles
    - method: HTTP method
    - path: Request path
    - status_code: Response status code
    - latency_ms: Request latency in milliseconds
    - query_params: Sanitized query parameters
    """
    
    SENSITIVE_PARAMS = {"token", "password", "secret", "api_key", "authorization"}
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        
        # Store in request state for access in endpoints
        request.state.request_id = request_id
        
        # Start timing
        start_time = time.perf_counter()
        
        # Process request
        response = await call_next(request)
        
        # Calculate latency
        latency_ms = (time.perf_counter() - start_time) * 1000
        
        # Extract user info if available
        user_id = "anonymous"
        username = "anonymous"
        roles: list[str] = []
        
        if hasattr(request.state, "current_user"):
            user: CurrentUser = request.state.current_user
            user_id = user.sub
            username = user.username
            roles = user.roles
        
        # Sanitize query params
        query_params = self._sanitize_params(dict(request.query_params))
        
        # Log audit entry
        logger.info(
            "request",
            request_id=request_id,
            user_id=user_id,
            username=username,
            roles=roles,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            latency_ms=round(latency_ms, 2),
            query_params=query_params,
            client_ip=request.client.host if request.client else None,
        )
        
        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id
        
        return response
    
    def _sanitize_params(self, params: dict) -> dict:
        """Remove sensitive parameters from logs"""
        return {
            k: "[REDACTED]" if k.lower() in self.SENSITIVE_PARAMS else v
            for k, v in params.items()
        }


def log_audit_event(
    event_type: str,
    user: CurrentUser,
    resource: str,
    action: str,
    details: dict = None,
    request_id: str = None,
) -> None:
    """
    Log a specific audit event (for non-request events).
    
    Args:
        event_type: Type of event (e.g., "export", "access", "modify")
        user: Current user
        resource: Resource being accessed
        action: Action being performed
        details: Additional details
        request_id: Request ID if available
    """
    logger.info(
        event_type,
        request_id=request_id or str(uuid.uuid4()),
        user_id=user.sub,
        username=user.username,
        roles=user.roles,
        resource=resource,
        action=action,
        details=details or {},
    )
