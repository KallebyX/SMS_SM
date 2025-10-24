#!/bin/bash

# SMS-SM Enterprise - Script de Controle
# Uso: ./control.sh [start|stop|restart|logs|status|clean]

PROJECT_NAME="sms-sm"
COMPOSE_FILE="docker-compose.dev.yml"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker não está instalado!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose não está instalado!"
        exit 1
    fi
}

# Função para usar docker-compose ou docker compose
docker_compose() {
    if command -v docker-compose &> /dev/null; then
        docker-compose -f $COMPOSE_FILE "$@"
    else
        docker compose -f $COMPOSE_FILE "$@"
    fi
}

# Iniciar os serviços
start_services() {
    log_info "🚀 Iniciando SMS-SM Enterprise..."
    
    # Parar serviços existentes
    docker_compose down --remove-orphans
    
    # Iniciar serviços
    docker_compose up -d --build
    
    log_info "⏳ Aguardando serviços ficarem prontos..."
    sleep 10
    
    # Verificar status
    check_status
    
    if [ $? -eq 0 ]; then
        log_success "✅ Sistema iniciado com sucesso!"
        log_info "🌐 Frontend: http://localhost:3000"
        log_info "🔗 Backend: http://localhost:4000"
        log_info "🗄️ Database: localhost:5432"
        log_info "📊 Redis: localhost:6379"
        log_info ""
        log_info "Para ver os logs: ./control.sh logs"
        log_info "Para parar: ./control.sh stop"
    else
        log_error "❌ Erro ao iniciar o sistema"
        docker_compose logs
    fi
}

# Parar os serviços
stop_services() {
    log_info "🛑 Parando SMS-SM Enterprise..."
    docker_compose down
    log_success "✅ Serviços parados com sucesso!"
}

# Reiniciar os serviços
restart_services() {
    log_info "🔄 Reiniciando SMS-SM Enterprise..."
    stop_services
    sleep 3
    start_services
}

# Exibir logs
show_logs() {
    if [ -z "$2" ]; then
        log_info "📋 Exibindo logs de todos os serviços..."
        docker_compose logs -f
    else
        log_info "📋 Exibindo logs do serviço: $2"
        docker_compose logs -f "$2"
    fi
}

# Verificar status dos serviços
check_status() {
    log_info "🔍 Verificando status dos serviços..."
    
    local all_healthy=true
    
    # Verificar PostgreSQL
    if docker_compose ps postgres | grep -q "Up"; then
        log_success "✅ PostgreSQL: Running"
    else
        log_error "❌ PostgreSQL: Not Running"
        all_healthy=false
    fi
    
    # Verificar Redis
    if docker_compose ps redis | grep -q "Up"; then
        log_success "✅ Redis: Running"
    else
        log_error "❌ Redis: Not Running"
        all_healthy=false
    fi
    
    # Verificar Backend
    if curl -s http://localhost:4000/health > /dev/null 2>&1; then
        log_success "✅ Backend: Running (http://localhost:4000)"
    else
        log_error "❌ Backend: Not Responding"
        all_healthy=false
    fi
    
    # Verificar Frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "✅ Frontend: Running (http://localhost:3000)"
    else
        log_error "❌ Frontend: Not Responding"
        all_healthy=false
    fi
    
    if [ "$all_healthy" = true ]; then
        return 0
    else
        return 1
    fi
}

# Limpar containers, volumes e imagens
clean_system() {
    log_warning "🧹 Limpando sistema (isso vai remover TODOS os dados)..."
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Parando e removendo containers..."
        docker_compose down -v --remove-orphans
        
        log_info "Removendo imagens..."
        docker rmi $(docker images "$PROJECT_NAME*" -q) 2>/dev/null || true
        
        log_info "Limpando volumes órfãos..."
        docker volume prune -f
        
        log_success "✅ Sistema limpo com sucesso!"
    else
        log_info "Operação cancelada."
    fi
}

# Executar migrations e seeds
setup_database() {
    log_info "🗄️ Configurando banco de dados..."
    
    # Aguardar banco estar pronto
    docker_compose exec backend sh -c "npx prisma db push"
    docker_compose exec backend sh -c "npx tsx scripts/seed.ts"
    
    log_success "✅ Banco de dados configurado!"
}

# Menu principal
case $1 in
    start)
        check_docker
        start_services
        ;;
    stop)
        check_docker
        stop_services
        ;;
    restart)
        check_docker
        restart_services
        ;;
    logs)
        check_docker
        show_logs "$@"
        ;;
    status)
        check_docker
        check_status
        ;;
    clean)
        check_docker
        clean_system
        ;;
    setup-db)
        check_docker
        setup_database
        ;;
    *)
        echo "SMS-SM Enterprise - Sistema de Controle"
        echo ""
        echo "Uso: $0 {start|stop|restart|logs|status|clean|setup-db}"
        echo ""
        echo "Comandos disponíveis:"
        echo "  start     - Iniciar todos os serviços"
        echo "  stop      - Parar todos os serviços"
        echo "  restart   - Reiniciar todos os serviços"
        echo "  logs      - Exibir logs (opcionalmente de um serviço específico)"
        echo "  status    - Verificar status dos serviços"
        echo "  clean     - Limpar containers, volumes e imagens"
        echo "  setup-db  - Configurar banco de dados (migrations + seeds)"
        echo ""
        echo "Exemplos:"
        echo "  $0 start                 # Iniciar sistema"
        echo "  $0 logs backend          # Ver logs apenas do backend"
        echo "  $0 status                # Verificar se tudo está funcionando"
        exit 1
        ;;
esac