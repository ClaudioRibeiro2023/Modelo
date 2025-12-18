"""
TechDados BFF - Nav Endpoint
Navegação dinâmica baseada em roles do usuário
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

from ....core.security import get_current_user, CurrentUser
from ....core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(tags=["Navigation"])


class NavItem(BaseModel):
    """Item de navegação"""
    id: str
    label: str
    path: str
    icon: Optional[str] = None
    allowedRoles: Optional[list[str]] = None


class NavUser(BaseModel):
    """Usuário resumido para navegação"""
    id: str
    roles: list[str]
    scopes: list[str]


class NavResponse(BaseModel):
    """Resposta do endpoint de navegação"""
    user: NavUser
    nav: list[NavItem]


# Navegação por role
NAV_ITEMS = [
    NavItem(id="home", label="Home", path="/", icon="home", allowedRoles=None),
    NavItem(id="epidemiologia", label="Epidemiologia", path="/epidemiologia", icon="activity", allowedRoles=["admin", "estrategico", "tatico", "auditoria"]),
    NavItem(id="operacao", label="Operação", path="/operacao", icon="map", allowedRoles=["admin", "estrategico", "tatico", "operacional", "auditoria"]),
    NavItem(id="risco", label="Risco", path="/risco", icon="alert-triangle", allowedRoles=["admin", "estrategico", "tatico", "auditoria"]),
    NavItem(id="exportacoes", label="Exportações", path="/exportacoes", icon="download", allowedRoles=["admin", "estrategico", "auditoria"]),
    NavItem(id="auditoria", label="Auditoria", path="/auditoria", icon="shield", allowedRoles=["admin", "auditoria"]),
]


def filter_nav_by_roles(items: list[NavItem], user_roles: list[str]) -> list[NavItem]:
    """Filtra itens de navegação baseado nas roles do usuário"""
    result = []
    for item in items:
        if item.allowedRoles is None:
            result.append(item)
        elif any(role in item.allowedRoles for role in user_roles):
            result.append(item)
    return result


@router.get("/nav", response_model=NavResponse)
async def get_nav(
    user: CurrentUser = Depends(get_current_user),
):
    """
    Navegação dinâmica baseada em roles.
    
    Retorna os itens de menu permitidos para o usuário atual,
    filtrados por suas roles.
    """
    # Filtrar navegação por roles
    allowed_nav = filter_nav_by_roles(NAV_ITEMS, user.roles)
    
    response = NavResponse(
        user=NavUser(
            id=user.sub,
            roles=user.roles,
            scopes=[user.scope_key] if user.scope_key else [],
        ),
        nav=allowed_nav,
    )
    
    logger.info("nav_fetched", user_id=user.sub, nav_count=len(allowed_nav))
    return response
