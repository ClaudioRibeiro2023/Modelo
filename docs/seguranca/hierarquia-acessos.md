# Hierarquia de acessos — Sistema Techdengue (v1.0)

> Documento normativo de referência para perfis, escopo territorial, classificação de dados e governança.

## Fonte

- PDF canônico: `docs/seguranca/_refs/Hierarquia_de_acessos_Sistema_Techdengue_v1.0.pdf`

## Como o TechDados usa isso (prático)

### 1) Perfis (roles) como “camadas”

- Estratégico
- Tático
- Operacional
- Apoio indireto
- (Admin/Auditoria — quando aplicável)

**No TechDados (MVP)**, isso se materializa em:

- Roles no Keycloak (ex.: `strategic`, `tactical`, `operational`, `support`, `admin`, `audit`)
- Scopes no token (ex.: `td:read`, `td:export`, `td:admin`, `td:audit`)
- Recorte territorial aplicado no BFF (UF/município) quando o claim existir

### 2) Classificação de dados

- Públicos
- Restritos
- Confidenciais / sensíveis

**Regra de produto:** o que é “sensível” jamais deve ser exportável sem:

- scope `td:export`
- registro de auditoria
- (futuro) justificativa/termo de responsabilidade

### 3) Princípios (enforcement no BFF)

- Mínimo privilégio
- Separação de funções
- Escopo territorial
- Rastreabilidade/audit logs
- LGPD

### 4) Governança

Mudanças de perfis, permissões e módulos devem ser registradas:

- docs/seguranca (RBAC + políticas)
- ADR (quando a decisão for estrutural)
- changelog

## Checklist de implementação (MVP)

- [ ] PDF está em `docs/seguranca/_refs/`
- [ ] `docs/seguranca/rbac.md` referencia este guia e o PDF
- [ ] `/api/v1/nav` (BFF) reflete a hierarquia por perfil
- [ ] Endpoints de export exigem `td:export` e geram auditoria
