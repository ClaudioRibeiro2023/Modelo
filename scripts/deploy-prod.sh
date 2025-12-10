#!/bin/bash
# ===========================================
# Script de Deploy em Produção
# ===========================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$PROJECT_ROOT/infra"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ───────────────────────────────────────────
# Verificações
# ───────────────────────────────────────────
check_requirements() {
    log_info "Verificando requisitos..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker não encontrado. Instale: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose não encontrado."
        exit 1
    fi
    
    if [ ! -f "$INFRA_DIR/.env.production" ]; then
        log_error "Arquivo .env.production não encontrado em $INFRA_DIR"
        log_info "Copie e configure: cp $INFRA_DIR/.env.production.example $INFRA_DIR/.env.production"
        exit 1
    fi
    
    log_info "✓ Requisitos OK"
}

# ───────────────────────────────────────────
# Login no Registry
# ───────────────────────────────────────────
login_registry() {
    log_info "Fazendo login no GitHub Container Registry..."
    
    if [ -z "$GITHUB_TOKEN" ]; then
        log_warn "GITHUB_TOKEN não definido. Tentando sem autenticação..."
    else
        echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin
        log_info "✓ Login OK"
    fi
}

# ───────────────────────────────────────────
# Pull das imagens
# ───────────────────────────────────────────
pull_images() {
    log_info "Baixando imagens mais recentes..."
    cd "$INFRA_DIR"
    docker compose -f docker-compose.prod.yml --env-file .env.production pull
    log_info "✓ Imagens atualizadas"
}

# ───────────────────────────────────────────
# Deploy
# ───────────────────────────────────────────
deploy() {
    log_info "Iniciando deploy..."
    cd "$INFRA_DIR"
    
    # Parar containers antigos (se existirem)
    docker compose -f docker-compose.prod.yml --env-file .env.production down --remove-orphans || true
    
    # Subir novos containers
    docker compose -f docker-compose.prod.yml --env-file .env.production up -d
    
    log_info "✓ Deploy concluído"
}

# ───────────────────────────────────────────
# Health check
# ───────────────────────────────────────────
health_check() {
    log_info "Aguardando serviços ficarem saudáveis..."
    sleep 10
    
    cd "$INFRA_DIR"
    docker compose -f docker-compose.prod.yml --env-file .env.production ps
    
    log_info "Verificando health dos containers..."
    docker compose -f docker-compose.prod.yml --env-file .env.production ps --format json | \
        jq -r '.[] | "\(.Name): \(.Health // "N/A")"' 2>/dev/null || \
        docker compose -f docker-compose.prod.yml --env-file .env.production ps
}

# ───────────────────────────────────────────
# Rollback
# ───────────────────────────────────────────
rollback() {
    log_warn "Executando rollback..."
    cd "$INFRA_DIR"
    
    # Voltar para versão anterior (se existir backup)
    if [ -f ".env.production.backup" ]; then
        mv .env.production .env.production.failed
        mv .env.production.backup .env.production
        docker compose -f docker-compose.prod.yml --env-file .env.production up -d
        log_info "✓ Rollback concluído"
    else
        log_error "Nenhum backup encontrado para rollback"
        exit 1
    fi
}

# ───────────────────────────────────────────
# Logs
# ───────────────────────────────────────────
show_logs() {
    cd "$INFRA_DIR"
    docker compose -f docker-compose.prod.yml --env-file .env.production logs -f --tail=100
}

# ───────────────────────────────────────────
# Main
# ───────────────────────────────────────────
case "${1:-deploy}" in
    deploy)
        check_requirements
        login_registry
        pull_images
        deploy
        health_check
        log_info "🚀 Aplicação disponível!"
        ;;
    rollback)
        rollback
        ;;
    logs)
        show_logs
        ;;
    status)
        cd "$INFRA_DIR"
        docker compose -f docker-compose.prod.yml --env-file .env.production ps
        ;;
    stop)
        cd "$INFRA_DIR"
        docker compose -f docker-compose.prod.yml --env-file .env.production down
        ;;
    *)
        echo "Uso: $0 {deploy|rollback|logs|status|stop}"
        exit 1
        ;;
esac
