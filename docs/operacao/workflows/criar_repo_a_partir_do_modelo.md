# Workflow — Criar nova repo a partir do `modelo`

## Objetivo

Criar um projeto novo com o padrao Aero/Template Platform, copiando o template sem `.git` e inicializando o git no destino.

## Comando padrao

Na raiz da repo `modelo`, rode:

```powershell
.\scripts\bootstrap\new_repo_from_modelo.ps1 -TargetPath "E:\.ai\AeroEstrategic" -ProjectName "AeroEstrategic" -InitGit
```

## Parametros

| Parametro      | Obrigatorio | Descricao                                              |
| -------------- | ----------- | ------------------------------------------------------ |
| `-TargetPath`  | Sim         | Caminho absoluto para o diretorio da nova repo         |
| `-ProjectName` | Nao         | Nome do projeto (opcional)                             |
| `-InitGit`     | Nao         | Inicializa git e faz commit inicial (default: `$true`) |
| `-Force`       | Nao         | Sobrescreve destino mesmo se nao estiver vazio         |

## O que o script faz

1. Cria o diretorio destino (se nao existir)
2. Copia todos os arquivos via `robocopy`, excluindo:
   - `.git/`, `node_modules/`, `.next/`, `dist/`, `build/`
   - `.venv/`, `__pycache__/`, `.pytest_cache/`, `.turbo/`, `.cache/`
   - Arquivos `*.log`
3. Inicializa git (se `-InitGit`)
4. Roda validacao de docs (`validate_docs.ps1`)

## Exemplo

```powershell
# Criar nova repo para projeto AeroEstrategic
cd C:\01_A.I\Modelo
.\scripts\bootstrap\new_repo_from_modelo.ps1 -TargetPath "E:\.ai\AeroEstrategic" -ProjectName "AeroEstrategic"
```

## Proximos passos apos criacao

1. `cd E:\.ai\AeroEstrategic`
2. Revisar e personalizar `README.md`
3. Configurar `.env` a partir de `.env.example`
4. `pnpm install`
5. Criar repositorio remoto e fazer push
