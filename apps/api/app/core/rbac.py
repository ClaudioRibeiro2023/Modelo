"""
TechDados BFF - RBAC (Role-Based Access Control)
Minimal RBAC implementation with role checking
"""
from typing import Callable
from fastapi import Depends, HTTPException, status

from .security import CurrentUser, get_current_user
from .logging import get_logger

logger = get_logger(__name__)


def require_roles(*required_roles: str) -> Callable:
    """
    Dependency factory that requires user to have at least one of the specified roles.
    
    Usage:
        @router.get("/admin", dependencies=[Depends(require_roles("admin"))])
        async def admin_endpoint():
            ...
    
    Args:
        *required_roles: Roles that grant access (user needs at least one)
    
    Returns:
        Dependency function that validates roles
    """
    async def role_checker(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        # If no roles required, just check authentication
        if not required_roles:
            return user
        
        # Check if user has at least one required role
        user_roles = set(user.roles)
        required = set(required_roles)
        
        if not user_roles.intersection(required):
            logger.warning(
                "access_denied",
                user_id=user.sub,
                user_roles=list(user_roles),
                required_roles=list(required),
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of roles: {', '.join(required_roles)}",
            )
        
        return user
    
    return role_checker


def require_any_role() -> Callable:
    """Require user to be authenticated (any role)"""
    return require_roles()


def require_admin() -> Callable:
    """Require admin role"""
    return require_roles("admin")


def require_strategic() -> Callable:
    """Require strategic level (admin or estrategico)"""
    return require_roles("admin", "estrategico")


def require_tactical() -> Callable:
    """Require tactical level (admin, estrategico, or tatico)"""
    return require_roles("admin", "estrategico", "tatico")


def require_operational() -> Callable:
    """Require operational level (admin, estrategico, tatico, or operacional)"""
    return require_roles("admin", "estrategico", "tatico", "operacional")


# TODO: Implement ABAC (Attribute-Based Access Control) for territorial scope
# This would involve:
# 1. Extract territorial claims from JWT (uf, urs, consorcio, municipio)
# 2. Create effective_scope based on user's highest territorial access
# 3. Filter data based on territorial scope in endpoints
#
# Example future implementation:
# @dataclass
# class TerritorialScope:
#     level: str  # "state" | "urs" | "consorcio" | "municipio"
#     codes: list[str]  # IBGE codes or URS codes
#
# def get_effective_scope(user: CurrentUser) -> TerritorialScope:
#     # Extract from JWT claims
#     pass
