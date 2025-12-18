# TechDados — Bloco 01 (Docs P0/P1) — Guia de Aplicação

Este zip contém um **bloco de documentação** para aplicar na repo `E:\.ai\TechDados`.

## Arquivos incluídos (relativos ao root)

- `docs/dados/dicionario-campos.md`
- `docs/produto/matriz-analises.md`
- `docs/produto/arvore-modulos-e-rotas.md`
- `docs/backend/bff-contratos-e-rotas.md`
- `docs/backend/bff-arquitetura-e-modulos.md`

## Como aplicar (PowerShell)

```powershell
cd E:\.ai\TechDados
$stamp = Get-Date -Format "yyyy-MM-dd__HHmm"
Copy-Item -Recurse -Force .\docs ".\_stash_docs__$stamp"
# extraia o zip na raiz da repo (mesclando a pasta docs/)
git status
git add docs
git commit -m "docs: adiciona bloco 01 (analises + rotas + bff)"
```
