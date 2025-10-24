#!/bin/bash

# Script para criar arquivo .env do Maternar Santa Mariense
# Uso: bash setup-env.sh

ENV_FILE=".env"

cat > "$ENV_FILE" << 'EOF'
# Maternar Santa Mariense - Backend Configuration
# Environment: Development

# Application
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
APP_VERSION=2.0.0

# Database - PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/maternar_sm

# Redis Cache
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=maternar_sm_2024_super_secret_key_change_in_production_3f8a9b2c1d4e5f6g7h8i9j0k
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Security
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000

# Email Configuration (Optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf

# External APIs (Optional)
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=

# Monitoring (Optional)
SENTRY_DSN=

# IMPORTANT: Modo emergência DESABILITADO para produção
EMERGENCY_MODE=false
EOF

echo "✅ Arquivo .env criado com sucesso em $(pwd)/.env"
echo "⚠️  IMPORTANTE: Revise e ajuste as configurações conforme necessário"
echo "🔐 Lembre-se de gerar um JWT_SECRET seguro para produção"

