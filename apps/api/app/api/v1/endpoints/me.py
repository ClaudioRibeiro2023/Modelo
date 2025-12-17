"""
TechDados BFF - Me Endpoint (Current User)
"""
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from typing import Optional

from ....core.security import get_current_user, CurrentUser
from ....core.settings import get_settings, Settings

router = APIRouter(tags=["User"])


class UserResponse(BaseModel):
    """Current user information"""
    sub: str
    username: str
    email: Optional[str]
    roles: list[str]
    scope_key: str
    demo_mode: bool


@router.get("/me", response_model=UserResponse)
async def get_me(
    request: Request,
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    """
    Get current authenticated user info.
    
    In DEMO_MODE, returns a demo user if no token provided.
    Otherwise, validates JWT and returns user info from token.
    """
    # Store user in request state for audit middleware
    request.state.current_user = user
    
    return UserResponse(
        sub=user.sub,
        username=user.username,
        email=user.email,
        roles=user.roles,
        scope_key=user.scope_key,
        demo_mode=user.demo_mode,
    )
