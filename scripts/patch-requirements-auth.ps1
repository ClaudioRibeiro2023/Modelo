Param(
  [string]$RepoRoot = (Get-Location).Path
)

$req = Join-Path $RepoRoot "api-template\requirements.txt"
$dep = 'python-jose[cryptography]>=3.3.0'

Write-Host "== TechDados: patch requirements (auth) =="

if (!(Test-Path $req)) {
  Write-Error "requirements.txt não encontrado em $req"
  exit 1
}

$content = Get-Content $req -ErrorAction Stop
if ($content -contains $dep) {
  Write-Host "Dependência já existe: $dep"
} else {
  Add-Content -Path $req -Value "`n# --- TechDados auth (Bloco 07) ---`n$dep`n"
  Write-Host "Adicionado: $dep"
}

Write-Host "Instalando deps..."
python -m pip install -r $req
Write-Host "OK"
