#!/bin/bash

# Script de controle do SMS-SM Enterprise em modo de emergência
# Uso: ./start-emergency.sh [start|stop|restart|status]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretórios
BACKEND_DIR="/workspaces/SMS_SM/enterprise/backend"
FRONTEND_DIR="/workspaces/SMS_SM/enterprise/frontend"

# Funções
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

start_backend() {
    log_info "Iniciando backend em modo de emergência..."
    cd "$BACKEND_DIR"
    
    # Parar qualquer processo existente
    pkill -f "node.*backend" 2>/dev/null || true
    
    # Iniciar backend em background
    EMERGENCY_MODE=true nohup npm run dev > /tmp/sms-backend.log 2>&1 &
    echo $! > /tmp/sms-backend.pid
    
    # Aguardar inicialização
    sleep 3
    
    # Verificar se está rodando
    if curl -s http://localhost:4000/health > /dev/null; then
        log_success "Backend iniciado na porta 4000"
    else
        log_error "Falha ao iniciar backend"
        return 1
    fi
}

start_frontend() {
    log_info "Iniciando frontend em modo de emergência..."
    cd "$FRONTEND_DIR"
    
    # Parar qualquer processo existente
    pkill -f "vite.*host" 2>/dev/null || true
    
    # Iniciar frontend em background
    VITE_EMERGENCY_MODE=true nohup npm run dev > /tmp/sms-frontend.log 2>&1 &
    echo $! > /tmp/sms-frontend.pid
    
    # Aguardar inicialização
    sleep 3
    
    # Verificar se está rodando
    if curl -s -I http://localhost:3000 > /dev/null; then
        log_success "Frontend iniciado na porta 3000"
    else
        log_error "Falha ao iniciar frontend"
        return 1
    fi
}

stop_services() {
    log_info "Parando todos os serviços..."
    
    # Parar backend
    if [ -f /tmp/sms-backend.pid ]; then
        PID=$(cat /tmp/sms-backend.pid)
        if kill $PID 2>/dev/null; then
            log_success "Backend parado (PID: $PID)"
        fi
        rm -f /tmp/sms-backend.pid
    fi
    
    # Parar frontend
    if [ -f /tmp/sms-frontend.pid ]; then
        PID=$(cat /tmp/sms-frontend.pid)
        if kill $PID 2>/dev/null; then
            log_success "Frontend parado (PID: $PID)"
        fi
        rm -f /tmp/sms-frontend.pid
    fi
    
    # Limpar qualquer processo remanescente
    pkill -f "node.*backend" 2>/dev/null || true
    pkill -f "vite.*host" 2>/dev/null || true
    
    log_success "Todos os serviços foram parados"
}

check_status() {
    log_info "Verificando status dos serviços..."
    
    # Backend
    if curl -s http://localhost:4000/health > /dev/null; then
        log_success "✓ Backend: Rodando na porta 4000"
    else
        log_warning "✗ Backend: Não está respondendo"
    fi
    
    # Frontend
    if curl -s -I http://localhost:3000 > /dev/null; then
        log_success "✓ Frontend: Rodando na porta 3000"
    else
        log_warning "✗ Frontend: Não está respondendo"
    fi
    
    echo ""
    echo -e "${BLUE}=== URLs DE ACESSO ===${NC}"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:4000"
    echo "❤️ Health: http://localhost:4000/health"
    echo ""
    echo -e "${YELLOW}=== MODO DE EMERGÊNCIA ATIVO ===${NC}"
    echo "• Sistema sem autenticação"
    echo "• Banco de dados desconectado"
    echo "• Apenas para demonstração"
}

show_help() {
    echo "SMS-SM Enterprise - Controle de Sistema"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos:"
    echo "  start     Iniciar todos os serviços"
    echo "  stop      Parar todos os serviços"
    echo "  restart   Reiniciar todos os serviços"
    echo "  status    Verificar status dos serviços"
    echo "  logs      Mostrar logs dos serviços"
    echo "  help      Mostrar esta ajuda"
}

show_logs() {
    log_info "Logs do backend (últimas 20 linhas):"
    if [ -f /tmp/sms-backend.log ]; then
        tail -20 /tmp/sms-backend.log
    else
        log_warning "Arquivo de log do backend não encontrado"
    fi
    
    echo ""
    log_info "Logs do frontend (últimas 20 linhas):"
    if [ -f /tmp/sms-frontend.log ]; then
        tail -20 /tmp/sms-frontend.log
    else
        log_warning "Arquivo de log do frontend não encontrado"
    fi
}

# Comando principal
case "${1:-help}" in
    start)
        log_info "=== INICIANDO SMS-SM ENTERPRISE ==="
        start_backend
        start_frontend
        echo ""
        check_status
        ;;
    stop)
        log_info "=== PARANDO SMS-SM ENTERPRISE ==="
        stop_services
        ;;
    restart)
        log_info "=== REINICIANDO SMS-SM ENTERPRISE ==="
        stop_services
        sleep 2
        start_backend
        start_frontend
        echo ""
        check_status
        ;;
    status)
        check_status
        ;;
    logs)
        show_logs
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Comando inválido: $1"
        show_help
        exit 1
        ;;
esac