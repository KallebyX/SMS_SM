#!/bin/bash

# SMS-SM Enterprise Control Script
# Usage: ./sms-control.sh [start|stop|restart|logs|status|build|clean]

set -e

PROJECT_NAME="sms-sm-enterprise"
COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are available
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker não está instalado ou não está no PATH"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose não está instalado ou não está no PATH"
        exit 1
    fi
}

# Get Docker Compose command (docker-compose or docker compose)
get_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    else
        echo "docker compose"
    fi
}

# Start all services
start_services() {
    log_info "Iniciando todos os serviços do SMS-SM Enterprise..."
    
    COMPOSE_CMD=$(get_compose_cmd)
    
    # Build and start services
    $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME up -d --build
    
    log_success "Todos os serviços foram iniciados!"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend API: http://localhost:4000"
    log_info "GraphQL Playground: http://localhost:4000/graphql"
    log_info "PostgreSQL: localhost:5432"
    log_info "Redis: localhost:6379"
    
    show_status
}

# Stop all services
stop_services() {
    log_info "Parando todos os serviços do SMS-SM Enterprise..."
    
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME down
    
    log_success "Todos os serviços foram parados!"
}

# Restart all services
restart_services() {
    log_info "Reiniciando todos os serviços do SMS-SM Enterprise..."
    
    stop_services
    sleep 2
    start_services
}

# Show logs
show_logs() {
    COMPOSE_CMD=$(get_compose_cmd)
    
    if [ -n "$2" ]; then
        log_info "Mostrando logs do serviço: $2"
        $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME logs -f "$2"
    else
        log_info "Mostrando logs de todos os serviços..."
        $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME logs -f
    fi
}

# Show status
show_status() {
    log_info "Status dos serviços:"
    
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME ps
    
    echo ""
    log_info "Verificando saúde dos serviços..."
    
    # Check frontend
    if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
        log_success "Frontend: ✓ Funcionando"
    else
        log_warning "Frontend: ✗ Não responsivo"
    fi
    
    # Check backend
    if curl -sf http://localhost:4000/health > /dev/null 2>&1; then
        log_success "Backend: ✓ Funcionando"
    else
        log_warning "Backend: ✗ Não responsivo"
    fi
    
    # Check database
    if docker exec ${PROJECT_NAME}_database_1 pg_isready -U postgres -d sms_sm_dev > /dev/null 2>&1 || \
       docker exec ${PROJECT_NAME}-database-1 pg_isready -U postgres -d sms_sm_dev > /dev/null 2>&1; then
        log_success "Database: ✓ Funcionando"
    else
        log_warning "Database: ✗ Não responsivo"
    fi
    
    # Check redis
    if docker exec ${PROJECT_NAME}_redis_1 redis-cli ping > /dev/null 2>&1 || \
       docker exec ${PROJECT_NAME}-redis-1 redis-cli ping > /dev/null 2>&1; then
        log_success "Redis: ✓ Funcionando"
    else
        log_warning "Redis: ✗ Não responsivo"
    fi
}

# Build services
build_services() {
    log_info "Construindo todas as imagens..."
    
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME build --no-cache
    
    log_success "Todas as imagens foram construídas!"
}

# Clean up
clean_up() {
    log_warning "Isso irá remover TODOS os containers, volumes e imagens do projeto!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Limpando tudo..."
        
        COMPOSE_CMD=$(get_compose_cmd)
        $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME down -v --rmi all --remove-orphans
        
        # Remove any leftover volumes
        docker volume rm ${PROJECT_NAME}_postgres_data ${PROJECT_NAME}_redis_data ${PROJECT_NAME}_backend_logs 2>/dev/null || true
        
        log_success "Limpeza concluída!"
    else
        log_info "Operação cancelada."
    fi
}

# Reset database
reset_database() {
    log_warning "Isso irá APAGAR todos os dados do banco!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Resetando banco de dados..."
        
        COMPOSE_CMD=$(get_compose_cmd)
        
        # Stop and remove database
        $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME stop database
        $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME rm -f database
        docker volume rm ${PROJECT_NAME}_postgres_data 2>/dev/null || true
        
        # Start database again
        $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME up -d database
        
        # Wait for database to be ready
        log_info "Aguardando banco de dados inicializar..."
        sleep 10
        
        # Run migrations and seed
        $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME exec backend npm run db:migrate
        $COMPOSE_CMD -f $COMPOSE_FILE -p $PROJECT_NAME exec backend npm run db:seed
        
        log_success "Banco de dados resetado e populado!"
    else
        log_info "Operação cancelada."
    fi
}

# Show help
show_help() {
    echo "SMS-SM Enterprise Control Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "COMMANDS:"
    echo "  start     Inicia todos os serviços"
    echo "  stop      Para todos os serviços"
    echo "  restart   Reinicia todos os serviços"
    echo "  status    Mostra o status dos serviços"
    echo "  logs      Mostra logs (use 'logs <service>' para serviço específico)"
    echo "  build     Constrói todas as imagens Docker"
    echo "  clean     Remove tudo (containers, volumes, imagens)"
    echo "  reset-db  Reseta o banco de dados"
    echo "  help      Mostra esta ajuda"
    echo ""
    echo "EXEMPLOS:"
    echo "  $0 start                # Inicia todo o sistema"
    echo "  $0 logs backend         # Mostra logs do backend"
    echo "  $0 status               # Verifica status de todos os serviços"
}

# Main execution
main() {
    check_dependencies
    
    case "${1:-help}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$@"
            ;;
        build)
            build_services
            ;;
        clean)
            clean_up
            ;;
        reset-db)
            reset_database
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Comando desconhecido: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"