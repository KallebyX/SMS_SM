#!/bin/bash

# SMS-SM Enterprise Platform - Development Environment Setup
# This script sets up the complete development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command_exists node; then
        missing_deps+=("node")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists git; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_info "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    log_success "All prerequisites are satisfied"
}

# Check Node.js version
check_node_version() {
    log_info "Checking Node.js version..."
    
    local node_version
    node_version=$(node -v | cut -d'v' -f2)
    local major_version
    major_version=$(echo "$node_version" | cut -d'.' -f1)
    
    if [ "$major_version" -lt 18 ]; then
        log_error "Node.js version $node_version is not supported. Please upgrade to Node.js 18 or higher."
        exit 1
    fi
    
    log_success "Node.js version $node_version is supported"
}

# Setup environment variables
setup_environment() {
    log_info "Setting up environment variables..."
    
    # Frontend
    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env
        log_success "Created frontend/.env from example"
    else
        log_warning "frontend/.env already exists, skipping"
    fi
    
    # Backend
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        log_success "Created backend/.env from example"
    else
        log_warning "backend/.env already exists, skipping"
    fi
    
    # Microservices
    for service in auth-service user-service health-service notification-service; do
        if [ ! -f "microservices/$service/.env" ]; then
            if [ -f "microservices/$service/.env.example" ]; then
                cp "microservices/$service/.env.example" "microservices/$service/.env"
                log_success "Created microservices/$service/.env from example"
            fi
        else
            log_warning "microservices/$service/.env already exists, skipping"
        fi
    done
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Frontend dependencies
    log_info "Installing frontend dependencies..."
    cd frontend && npm ci && cd ..
    log_success "Frontend dependencies installed"
    
    # Backend dependencies
    log_info "Installing backend dependencies..."
    cd backend && npm ci && cd ..
    log_success "Backend dependencies installed"
    
    # Microservices dependencies
    for service in auth-service user-service health-service notification-service; do
        if [ -f "microservices/$service/package.json" ]; then
            log_info "Installing $service dependencies..."
            cd "microservices/$service" && npm ci && cd ../..
            log_success "$service dependencies installed"
        fi
    done
}

# Setup Docker environment
setup_docker() {
    log_info "Setting up Docker environment..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Pull base images
    log_info "Pulling base Docker images..."
    docker-compose pull postgres redis mongodb elasticsearch
    
    log_success "Docker environment setup complete"
}

# Setup database
setup_database() {
    log_info "Setting up databases..."
    
    # Start database services
    docker-compose up -d postgres redis mongodb elasticsearch
    
    # Wait for databases to be ready
    log_info "Waiting for databases to be ready..."
    sleep 30
    
    # Run database migrations
    log_info "Running database migrations..."
    cd backend && npm run migration:run && cd ..
    
    # Seed initial data
    log_info "Seeding initial data..."
    cd backend && npm run db:seed && cd ..
    
    log_success "Database setup complete"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring stack..."
    
    # Create monitoring directories
    mkdir -p monitoring/prometheus
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/provisioning
    
    # Copy monitoring configurations
    if [ ! -f "monitoring/prometheus.yml" ]; then
        cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'frontend'
    static_configs:
      - targets: ['frontend:3000']

  - job_name: 'backend'
    static_configs:
      - targets: ['backend:4000']

  - job_name: 'auth-service'
    static_configs:
      - targets: ['auth-service:3001']

  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:3002']

  - job_name: 'health-service'
    static_configs:
      - targets: ['health-service:3003']

  - job_name: 'notification-service'
    static_configs:
      - targets: ['notification-service:3004']
EOF
        log_success "Created Prometheus configuration"
    fi
    
    log_success "Monitoring setup complete"
}

# Setup NGINX
setup_nginx() {
    log_info "Setting up NGINX load balancer..."
    
    mkdir -p nginx/conf.d
    mkdir -p nginx/ssl
    
    # Create NGINX configuration
    if [ ! -f "nginx/nginx.conf" ]; then
        cat > nginx/nginx.conf << EOF
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    include /etc/nginx/conf.d/*.conf;
}
EOF
        log_success "Created NGINX main configuration"
    fi
    
    # Create default site configuration
    if [ ! -f "nginx/conf.d/default.conf" ]; then
        cat > nginx/conf.d/default.conf << EOF
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:4000;
}

server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # GraphQL
    location /graphql {
        proxy_pass http://backend/graphql;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://backend/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
        log_success "Created NGINX site configuration"
    fi
    
    log_success "NGINX setup complete"
}

# Start development environment
start_development() {
    log_info "Starting development environment..."
    
    # Start all services
    docker-compose up -d
    
    log_info "Waiting for services to be ready..."
    sleep 60
    
    # Health checks
    log_info "Running health checks..."
    
    # Check if services are responding
    local services=(
        "http://localhost:3000:Frontend"
        "http://localhost:4000/health:Backend"
        "http://localhost:5432:PostgreSQL"
        "http://localhost:6379:Redis"
        "http://localhost:27017:MongoDB"
        "http://localhost:9200:Elasticsearch"
        "http://localhost:9090:Prometheus"
        "http://localhost:3001:Grafana"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r url name <<< "$service"
        if curl -f -s "$url" >/dev/null 2>&1; then
            log_success "$name is healthy"
        else
            log_warning "$name is not responding"
        fi
    done
    
    log_success "Development environment started successfully!"
}

# Print useful information
print_info() {
    echo ""
    log_info "🎉 SMS-SM Enterprise Development Environment is ready!"
    echo ""
    echo "📱 Frontend Application:     http://localhost:3000"
    echo "⚙️  Backend API:             http://localhost:4000"
    echo "📊 API Documentation:       http://localhost:4000/docs"
    echo "🔐 Auth Service:            http://localhost:3001"
    echo "👤 User Service:            http://localhost:3002"
    echo "🏥 Health Service:          http://localhost:3003"
    echo "📢 Notification Service:    http://localhost:3004"
    echo ""
    echo "🗄️  Database Management:"
    echo "   PostgreSQL (pgAdmin):    http://localhost:8081"
    echo "   Redis (Commander):       http://localhost:8082"
    echo "   MongoDB (Express):       http://localhost:8083"
    echo ""
    echo "📊 Monitoring & Analytics:"
    echo "   Prometheus:              http://localhost:9090"
    echo "   Grafana:                 http://localhost:3001"
    echo "   Elasticsearch:           http://localhost:9200"
    echo "   Kibana:                  http://localhost:5601"
    echo ""
    echo "🔧 Development Tools:"
    echo "   Kafka UI:                http://localhost:8080"
    echo "   Jaeger Tracing:          http://localhost:16686"
    echo "   MailHog:                 http://localhost:8025"
    echo ""
    echo "🚀 Useful Commands:"
    echo "   Stop all services:       docker-compose down"
    echo "   View logs:               docker-compose logs -f [service-name]"
    echo "   Restart service:         docker-compose restart [service-name]"
    echo "   Rebuild service:         docker-compose up -d --build [service-name]"
    echo ""
    echo "📚 Documentation: https://github.com/your-org/sms-sm-enterprise/wiki"
    echo ""
}

# Main execution
main() {
    echo "🏥 SMS-SM Enterprise Platform - Development Setup"
    echo "=================================================="
    echo ""
    
    check_prerequisites
    check_node_version
    setup_environment
    install_dependencies
    setup_docker
    setup_monitoring
    setup_nginx
    setup_database
    start_development
    print_info
    
    log_success "Setup completed successfully! 🎉"
}

# Execute main function
main "$@"