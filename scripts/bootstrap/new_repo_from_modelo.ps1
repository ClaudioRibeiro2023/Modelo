param(
  [Parameter(Mandatory=$true)][string]$TargetPath,
  [Parameter(Mandatory=$false)][string]$ProjectName = "",
  [Parameter(Mandatory=$false)][switch]$InitGit = $true,
  [Parameter(Mandatory=$false)][switch]$Force = $false
)

$ErrorActionPreference = "Stop"

$source = (Resolve-Path ".").Path

# cria se nao existir
if (-not (Test-Path $TargetPath)) {
  New-Item -ItemType Directory -Force $TargetPath | Out-Null
}

$target = (Resolve-Path $TargetPath).Path

# seguranca: nao sobrescrever repo ja existente sem -Force
$hasFiles = (Get-ChildItem -LiteralPath $target -Force | Where-Object { $_.Name -notin @(".", "..") } | Measure-Object).Count -gt 0
if ($hasFiles -and (-not $Force)) {
  throw "Destino nao esta vazio: $target. Use -Force para sobrescrever (com cuidado)."
}

Write-Host ">> Exportando template do modelo para: $target"
robocopy $source $target /E `
  /XD ".git" "node_modules" ".next" "dist" "build" ".venv" "__pycache__" ".pytest_cache" ".turbo" ".cache" `
  /XF "*.log" | Out-Null

if ($InitGit) {
  Write-Host ">> Inicializando git..."
  Push-Location $target
  if (-not (Test-Path ".git")) {
    git init | Out-Null
    try { git checkout -b main | Out-Null } catch {}
    git add -A
    git commit -m "chore: bootstrap from modelo" | Out-Null
  }
  Pop-Location
}

Write-Host ">> Rodando validacao basica de docs..."
& (Join-Path $source "scripts\validate\validate_docs.ps1") -RepoPath $target

Write-Host "OK: Repo criada em $target"
