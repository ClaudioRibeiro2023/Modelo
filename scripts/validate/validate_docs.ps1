param(
  [Parameter(Mandatory=$true)][string]$RepoPath
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $RepoPath)) {
  throw "RepoPath nao existe: $RepoPath"
}

Push-Location $RepoPath

# 1) docs/INDEX.md
if (-not (Test-Path ".\docs\INDEX.md")) {
  throw "FALHA: docs/INDEX.md nao encontrado (source of truth)."
}

# 2) estrutura canonica minima (avisos, nao bloqueantes)
$required = @(".\docs\adr_v2", ".\docs\operacao", ".\docs\seguranca", ".\docs\arquitetura")
foreach ($p in $required) {
  if (-not (Test-Path $p)) {
    Write-Warning "AVISO: estrutura canonica ausente: $p"
  }
}

# 3) bloquear .md fora de docs (exceto allowlist de stubs)
$allow = @(
  "README.md",
  "CONTRIBUTING.md",
  "ARCHITECTURE.md",
  "GETTING_STARTED.md",
  "DEPLOY.md",
  "ROLES_E_ACESSO.md",
  "VALIDATION_CHECKLIST.md",
  "todo.md"
)

$offenders = Get-ChildItem -Recurse -File -Filter *.md |
  Where-Object { $_.FullName -notmatch "\\docs\\" } |
  Where-Object { $_.FullName -notmatch "\\\.git\\" } |
  Where-Object { $_.FullName -notmatch "\\\.github\\" } |
  Where-Object { $_.FullName -notmatch "\\\.windsurf\\" } |
  Where-Object { $_.FullName -notmatch "\\node_modules\\" } |
  Where-Object { $_.FullName -notmatch "\\param\(\\" } |
  Where-Object { $allow -notcontains $_.Name }

if ($offenders.Count -gt 0) {
  Write-Host "FALHA: Encontrados .md fora de docs (nao allowlist):"
  $offenders | ForEach-Object { Write-Host " - $($_.FullName)" }
  throw "Padrao violado: .md espalhado."
}

Write-Host "OK: validacao docs passou."
Pop-Location
