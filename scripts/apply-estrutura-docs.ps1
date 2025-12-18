<#
.SYNOPSIS
    Aplicador de Blocos ZIP da estrutura.docs com auditoria completa
.DESCRIPTION
    Extrai ZIPs de docs/_estrutura.docs para staging, aplica com whitelist,
    gera backup, trata conflitos e produz relatórios de auditoria.
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

# === CONFIGURAÇÃO ===
$RepoRoot = (Get-Item $PSScriptRoot).Parent.FullName
$ZipSourceDir = Join-Path $RepoRoot "docs\_estrutura.docs"
$StagingDir = Join-Path $ZipSourceDir "_staging"
$Today = Get-Date -Format "yyyy-MM-dd"
$ArchiveBase = Join-Path $RepoRoot "docs\_archive\$Today"
$BackupDir = Join-Path $ArchiveBase "_pre_apply_backup"
$IncomingDir = Join-Path $ArchiveBase "_incoming_from_zip"
$ZipMetaDir = Join-Path $ArchiveBase "_zip_meta"
$PatchesDir = Join-Path $ArchiveBase "_patches"
$RootMdDir = Join-Path $ArchiveBase "_root_md"
$AuditDir = Join-Path $RepoRoot "docs\00-auditoria"

# Contadores globais
$script:TotalAnalyzed = 0
$script:TotalCopied = 0
$script:TotalSkipSame = 0
$script:TotalPendingDiff = 0
$script:TotalMeta = 0
$script:PendingFiles = @()
$script:ProcessedZips = @()
$script:CopiedFiles = @()
$script:SkippedFiles = @()

# === FUNÇÕES AUXILIARES ===

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "INFO" { "Cyan" }
        "SUCCESS" { "Green" }
        "WARN" { "Yellow" }
        "ERROR" { "Red" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Get-FileHashSHA256 {
    param([string]$Path)
    if (Test-Path $Path) {
        return (Get-FileHash -Path $Path -Algorithm SHA256).Hash
    }
    return $null
}

function Ensure-Directory {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Force -Path $Path | Out-Null
    }
}

function Get-BlockNumber {
    param([string]$ZipName)
    if ($ZipName -match "bloco_(\d+)") {
        return [int]$matches[1]
    }
    return 999
}

function Test-WhitelistPath {
    param([string]$RelativePath)
    
    # Normalizar separadores
    $normalizedPath = $RelativePath -replace "\\", "/"
    
    # Whitelist de prefixos permitidos
    $allowedPrefixes = @(
        "docs/",
        "api-template/",
        "apps/web/",
        "apps/",
        "packages/",
        "infra/",
        "scripts/"
    )
    
    # Stubs permitidos na raiz (somente se já existirem)
    $allowedRootStubs = @(
        "README.md",
        "CONTRIBUTING.md",
        "todo.md"
    )
    
    # Arquivos meta do ZIP (não copiar para destino)
    $metaFiles = @(
        "LEIA-ME.md",
        "MANIFEST.json"
    )
    
    # Verificar se é arquivo meta
    $fileName = Split-Path $normalizedPath -Leaf
    if ($metaFiles -contains $fileName -and ($normalizedPath -notlike "*/*" -or $normalizedPath -like "PATCHES/*")) {
        return @{ Allowed = $false; Reason = "META"; FileName = $fileName }
    }
    
    # Verificar PATCHES
    if ($normalizedPath -like "PATCHES/*" -or $normalizedPath -eq "PATCHES") {
        return @{ Allowed = $false; Reason = "PATCHES"; FileName = $fileName }
    }
    
    # Verificar prefixos permitidos
    foreach ($prefix in $allowedPrefixes) {
        if ($normalizedPath -like "$prefix*") {
            return @{ Allowed = $true; Reason = "WHITELIST"; FileName = $fileName }
        }
    }
    
    # Verificar stubs na raiz
    if ($allowedRootStubs -contains $normalizedPath) {
        $destPath = Join-Path $RepoRoot $normalizedPath
        if (Test-Path $destPath) {
            return @{ Allowed = $true; Reason = "ROOT_STUB_EXISTS"; FileName = $fileName }
        } else {
            return @{ Allowed = $false; Reason = "ROOT_STUB_NOT_EXISTS"; FileName = $fileName }
        }
    }
    
    # Arquivo .md na raiz que não está na whitelist
    if ($normalizedPath -notlike "*/*" -and $normalizedPath -like "*.md") {
        return @{ Allowed = $false; Reason = "ROOT_MD_BLOCKED"; FileName = $fileName }
    }
    
    # Outros arquivos na raiz
    if ($normalizedPath -notlike "*/*") {
        return @{ Allowed = $false; Reason = "ROOT_OTHER_BLOCKED"; FileName = $fileName }
    }
    
    return @{ Allowed = $false; Reason = "NOT_IN_WHITELIST"; FileName = $fileName }
}

function Process-ZipFile {
    param(
        [string]$ZipPath,
        [string]$ZipBaseName
    )
    
    Write-Log "Processando: $ZipBaseName" "INFO"
    
    $extractDir = Join-Path $StagingDir $ZipBaseName
    Ensure-Directory $extractDir
    
    # Extrair ZIP
    try {
        Expand-Archive -Path $ZipPath -DestinationPath $extractDir -Force
        Write-Log "  Extraído para staging" "SUCCESS"
    } catch {
        Write-Log "  ERRO ao extrair: $_" "ERROR"
        return
    }
    
    # Ler MANIFEST.json se existir
    $manifestPath = Join-Path $extractDir "MANIFEST.json"
    $manifest = $null
    if (Test-Path $manifestPath) {
        try {
            $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
            Write-Log "  MANIFEST.json encontrado ($(($manifest.files | Measure-Object).Count) arquivos declarados)" "INFO"
        } catch {
            Write-Log "  WARN: MANIFEST.json inválido" "WARN"
        }
    }
    
    # Processar arquivos extraídos
    $extractedFiles = Get-ChildItem -Path $extractDir -Recurse -File
    $zipStats = @{
        Analyzed = 0
        Copied = 0
        SkipSame = 0
        PendingDiff = 0
        Meta = 0
    }
    
    foreach ($file in $extractedFiles) {
        $relativePath = $file.FullName.Substring($extractDir.Length + 1) -replace "\\", "/"
        $script:TotalAnalyzed++
        $zipStats.Analyzed++
        
        $whitelistResult = Test-WhitelistPath -RelativePath $relativePath
        
        if ($whitelistResult.Reason -eq "META") {
            # Mover para _zip_meta
            $metaDest = Join-Path $ZipMetaDir $ZipBaseName
            Ensure-Directory $metaDest
            Copy-Item -Path $file.FullName -Destination (Join-Path $metaDest $whitelistResult.FileName) -Force
            Write-Log "    META -> _zip_meta: $relativePath" "INFO"
            $script:TotalMeta++
            $zipStats.Meta++
            continue
        }
        
        if ($whitelistResult.Reason -eq "PATCHES") {
            # Mover para _patches
            $patchDest = Join-Path $PatchesDir $ZipBaseName
            Ensure-Directory $patchDest
            $patchRelative = $relativePath -replace "^PATCHES/", ""
            $patchDestFile = Join-Path $patchDest $patchRelative
            Ensure-Directory (Split-Path $patchDestFile -Parent)
            Copy-Item -Path $file.FullName -Destination $patchDestFile -Force
            Write-Log "    PATCHES -> _patches: $relativePath" "INFO"
            $script:TotalMeta++
            $zipStats.Meta++
            continue
        }
        
        if (-not $whitelistResult.Allowed) {
            # Arquivo bloqueado - mover para incoming
            $incomingDest = Join-Path $IncomingDir "$ZipBaseName\$relativePath"
            Ensure-Directory (Split-Path $incomingDest -Parent)
            Copy-Item -Path $file.FullName -Destination $incomingDest -Force
            Write-Log "    BLOCKED ($($whitelistResult.Reason)): $relativePath -> _incoming" "WARN"
            $script:TotalPendingDiff++
            $zipStats.PendingDiff++
            $script:PendingFiles += @{
                Zip = $ZipBaseName
                Path = $relativePath
                Reason = $whitelistResult.Reason
                IncomingPath = $incomingDest
            }
            continue
        }
        
        # Arquivo permitido - verificar destino
        $destPath = Join-Path $RepoRoot $relativePath
        $destDir = Split-Path $destPath -Parent
        
        if (Test-Path $destPath) {
            # Arquivo existe - comparar hash
            $srcHash = Get-FileHashSHA256 -Path $file.FullName
            $destHash = Get-FileHashSHA256 -Path $destPath
            
            if ($srcHash -eq $destHash) {
                Write-Log "    SKIP_SAME: $relativePath" "INFO"
                $script:TotalSkipSame++
                $zipStats.SkipSame++
                $script:SkippedFiles += @{
                    Zip = $ZipBaseName
                    Path = $relativePath
                    Reason = "HASH_EQUAL"
                }
            } else {
                # Hash diferente - backup e mover para incoming
                $backupPath = Join-Path $BackupDir $relativePath
                Ensure-Directory (Split-Path $backupPath -Parent)
                Copy-Item -Path $destPath -Destination $backupPath -Force
                
                $incomingDest = Join-Path $IncomingDir "$ZipBaseName\$relativePath"
                Ensure-Directory (Split-Path $incomingDest -Parent)
                Copy-Item -Path $file.FullName -Destination $incomingDest -Force
                
                Write-Log "    PENDING_DIFF: $relativePath (backup criado)" "WARN"
                $script:TotalPendingDiff++
                $zipStats.PendingDiff++
                $script:PendingFiles += @{
                    Zip = $ZipBaseName
                    Path = $relativePath
                    Reason = "HASH_DIFF"
                    IncomingPath = $incomingDest
                    BackupPath = $backupPath
                    SrcHash = $srcHash
                    DestHash = $destHash
                }
            }
        } else {
            # Arquivo não existe - copiar
            Ensure-Directory $destDir
            Copy-Item -Path $file.FullName -Destination $destPath -Force
            Write-Log "    COPIED: $relativePath" "SUCCESS"
            $script:TotalCopied++
            $zipStats.Copied++
            $script:CopiedFiles += @{
                Zip = $ZipBaseName
                Path = $relativePath
            }
        }
    }
    
    $script:ProcessedZips += @{
        Name = $ZipBaseName
        Stats = $zipStats
        HasManifest = ($null -ne $manifest)
    }
    
    $resumoMsg = "  Resumo {0} - Analisados={1}, Copiados={2}, Skip={3}, Pendentes={4}, Meta={5}" -f $ZipBaseName, $zipStats.Analyzed, $zipStats.Copied, $zipStats.SkipSame, $zipStats.PendingDiff, $zipStats.Meta
    Write-Log $resumoMsg "INFO"
}

function Generate-Reports {
    Write-Log "Gerando relatórios de auditoria..." "INFO"
    
    Ensure-Directory $AuditDir
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $branch = git -C $RepoRoot branch --show-current 2>$null
    if (-not $branch) { $branch = "unknown" }
    
    # === ESTRUTURA_DOCS_RELATORIO.md ===
    $reportPath = Join-Path $AuditDir "ESTRUTURA_DOCS_RELATORIO.md"
    $reportContent = @"
# Relatório de Aplicação - Estrutura Docs

**Data/Hora:** $timestamp  
**Branch:** $branch  

---

## Resumo Geral

| Métrica | Valor |
|---------|-------|
| ZIPs processados | $($script:ProcessedZips.Count) |
| Arquivos analisados | $($script:TotalAnalyzed) |
| Arquivos copiados | $($script:TotalCopied) |
| Ignorados (hash igual) | $($script:TotalSkipSame) |
| Pendentes (divergência) | $($script:TotalPendingDiff) |
| Meta arquivados | $($script:TotalMeta) |

---

## ZIPs Processados

"@
    
    foreach ($zip in $script:ProcessedZips) {
        $reportContent += @"

### $($zip.Name)
- **Manifest:** $(if ($zip.HasManifest) { "Sim" } else { "Não" })
- Analisados: $($zip.Stats.Analyzed)
- Copiados: $($zip.Stats.Copied)
- Skip (hash igual): $($zip.Stats.SkipSame)
- Pendentes: $($zip.Stats.PendingDiff)
- Meta: $($zip.Stats.Meta)

"@
    }
    
    if ($script:PendingFiles.Count -gt 0) {
        $reportContent += @"

---

## Arquivos Pendentes (PENDING_DIFF)

| ZIP | Caminho | Motivo | Local Incoming |
|-----|---------|--------|----------------|
"@
        foreach ($pf in $script:PendingFiles) {
            $incomingRel = $pf.IncomingPath -replace [regex]::Escape($RepoRoot), ""
            $reportContent += "| $($pf.Zip) | ``$($pf.Path)`` | $($pf.Reason) | ``$incomingRel`` |`n"
        }
    }
    
    if ($script:CopiedFiles.Count -gt 0) {
        $reportContent += @"

---

## Arquivos Copiados

"@
        $groupedCopied = $script:CopiedFiles | Group-Object { $_.Zip }
        foreach ($group in $groupedCopied) {
            $reportContent += "`n### $($group.Name)`n"
            foreach ($cf in $group.Group) {
                $reportContent += "- ``$($cf.Path)```n"
            }
        }
    }
    
    Set-Content -Path $reportPath -Value $reportContent -Encoding UTF8
    Write-Log "  Criado: $reportPath" "SUCCESS"
    
    # === LOG_DE_LIMPEZA.md ===
    $logPath = Join-Path $AuditDir "LOG_DE_LIMPEZA.md"
    $logEntry = @"

---

## [$timestamp] Aplicação de Estrutura Docs

- **Branch:** $branch
- **ZIPs processados:** $($script:ProcessedZips.Count)
  - $($script:ProcessedZips.Name -join ", ")
- **Resumo numérico:**
  - Analisados: $($script:TotalAnalyzed)
  - Copiados: $($script:TotalCopied)
  - Skip: $($script:TotalSkipSame)
  - Pendentes: $($script:TotalPendingDiff)
  - Meta: $($script:TotalMeta)

"@
    
    if (Test-Path $logPath) {
        Add-Content -Path $logPath -Value $logEntry -Encoding UTF8
    } else {
        $header = "# Log de Limpeza e Manutenção`n`nRegistro cronológico de operações de limpeza e reorganização do repositório.`n"
        Set-Content -Path $logPath -Value ($header + $logEntry) -Encoding UTF8
    }
    Write-Log "  Atualizado: $logPath" "SUCCESS"
}

# === MAIN ===

Write-Log "========================================" "INFO"
Write-Log "APLICADOR DE BLOCOS ZIP - TechDados" "INFO"
Write-Log "========================================" "INFO"
Write-Log "Repo Root: $RepoRoot" "INFO"
Write-Log "ZIP Source: $ZipSourceDir" "INFO"
Write-Log "Staging: $StagingDir" "INFO"
Write-Log "Archive: $ArchiveBase" "INFO"
Write-Log "========================================" "INFO"

# Garantir diretórios
Ensure-Directory $StagingDir
Ensure-Directory $BackupDir
Ensure-Directory $IncomingDir
Ensure-Directory $ZipMetaDir
Ensure-Directory $PatchesDir
Ensure-Directory $RootMdDir
Ensure-Directory $AuditDir

# Encontrar e ordenar ZIPs
$zipFiles = Get-ChildItem -Path $ZipSourceDir -Filter "*.zip" -File | 
    Sort-Object { Get-BlockNumber $_.BaseName }

if ($zipFiles.Count -eq 0) {
    Write-Log "Nenhum ZIP encontrado em $ZipSourceDir" "ERROR"
    exit 1
}

Write-Log "Encontrados $($zipFiles.Count) ZIPs para processar" "INFO"

# Processar cada ZIP
foreach ($zip in $zipFiles) {
    Process-ZipFile -ZipPath $zip.FullName -ZipBaseName $zip.BaseName
    Write-Log "----------------------------------------" "INFO"
}

# Gerar relatórios
Generate-Reports

# Resumo final
Write-Log "========================================" "INFO"
Write-Log "PROCESSAMENTO CONCLUÍDO" "SUCCESS"
Write-Log "========================================" "INFO"
Write-Log "Total ZIPs: $($script:ProcessedZips.Count)" "INFO"
Write-Log "Total Analisados: $($script:TotalAnalyzed)" "INFO"
Write-Log "Total Copiados: $($script:TotalCopied)" "SUCCESS"
Write-Log "Total Skip (hash igual): $($script:TotalSkipSame)" "INFO"
Write-Log "Total Pendentes: $($script:TotalPendingDiff)" $(if ($script:TotalPendingDiff -gt 0) { "WARN" } else { "INFO" })
Write-Log "Total Meta: $($script:TotalMeta)" "INFO"

if ($script:PendingFiles.Count -gt 0) {
    Write-Log "" "INFO"
    Write-Log "ATENÇÃO: Existem $($script:PendingFiles.Count) arquivos pendentes de revisão manual!" "WARN"
    Write-Log "Verifique: docs\_archive\$Today\_incoming_from_zip\" "WARN"
}

Write-Log "========================================" "INFO"
Write-Log "Relatórios em: docs\00-auditoria\" "INFO"
Write-Log "========================================" "INFO"
