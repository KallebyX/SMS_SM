# 🚀 Guia de Deploy em Produção - Maternar Santa Mariense

## Versão: 2.0.0

Este guia detalha o processo completo para colocar o sistema Maternar Santa Mariense em produção.

---

## 📋 Pré-requisitos

### Infraestrutura Necessária

- [ ] Servidor Linux (Ubuntu 20.04+ LTS recomendado)
- [ ] Mínimo 4GB RAM, 2 vCPUs
- [ ] Recomendado: 8GB RAM, 4 vCPUs
- [ ] 50GB de disco SSD
- [ ] Domínio configurado (ex: maternarsm.com.br)
- [ ] Certificado SSL (Let's Encrypt ou comercial)

### Serviços Externos

- [ ] PostgreSQL 15+ (ou AWS RDS, Azure Database)
- [ ] Redis 7+ (ou AWS ElastiCache, Azure Cache)
- [ ] SMTP configurado (SendGrid, AWS SES, Gmail)
- [ ] Sentry (opcional - error tracking)
- [ ] Google Analytics (opcional - analytics)

---

## 🔧 Passo 1: Preparação do Servidor

### 1.1 Atualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Instalar Docker e Docker Compose

```bash
# Instalar Docker
curl -fsSL https://get.docker.com | sudo sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

### 1.3 Instalar Nginx (Proxy Reverso)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 1.4 Instalar Certbot (SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

## 🗄️ Passo 2: Configurar Banco de Dados

### Opção A: PostgreSQL Local

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Criar banco e usuário
sudo -u postgres psql
CREATE DATABASE maternar_sm_prod;
CREATE USER maternar_admin WITH PASSWORD 'senha_super_segura_aqui';
GRANT ALL PRIVILEGES ON DATABASE maternar_sm_prod TO maternar_admin;
\q

# Obter connection string
DATABASE_URL="postgresql://maternar_admin:senha_super_segura_aqui@localhost:5432/maternar_sm_prod"
```

### Opção B: AWS RDS

1. Criar instância RDS PostgreSQL 15
2. Configurar Security Group (permitir porta 5432)
3. Copiar endpoint: `your-database.xxxxx.us-east-1.rds.amazonaws.com`
4. Connection string: `postgresql://username:password@endpoint:5432/database`

### Opção C: Azure Database

1. Criar Azure Database for PostgreSQL
2. Configurar firewall rules
3. Copiar connection string do portal

---

## 🔴 Passo 3: Configurar Redis

### Opção A: Redis Local

```bash
# Instalar Redis
sudo apt install redis-server -y

# Configurar senha
sudo nano /etc/redis/redis.conf
# Descomentar e definir: requirepass senha_redis_segura

# Reiniciar
sudo systemctl restart redis-server

# Connection string
REDIS_URL="redis://default:senha_redis_segura@localhost:6379"
```

### Opção B: AWS ElastiCache / Azure Cache

1. Criar cluster Redis
2. Configurar Security Group
3. Copiar endpoint

---

## 📦 Passo 4: Deploy da Aplicação

### 4.1 Clonar Repositório

```bash
cd /opt
sudo git clone https://seu-repositorio.git maternar-sm
cd maternar-sm
sudo chown -R $USER:$USER /opt/maternar-sm
```

### 4.2 Configurar Variáveis de Ambiente Backend

```bash
cd enterprise/backend
cp .env.production.example .env

# Editar variáveis
nano .env
```

**Variáveis obrigatórias a alterar:**

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/database
REDIS_URL=redis://default:pass@host:6379
JWT_SECRET=<gerar-chave-aleatoria-32-chars-minimo>
CORS_ORIGINS=https://maternarsm.com.br,https://www.maternarsm.com.br

# Email (Configure seu SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@maternarsm.com.br
SMTP_PASS=sua_senha_app

# Sentry (Opcional mas recomendado)
SENTRY_DSN=https://xxxxx@sentry.io/project
```

**Gerar JWT_SECRET seguro:**

```bash
openssl rand -base64 32
```

### 4.3 Configurar Variáveis de Ambiente Frontend

```bash
cd ../frontend
cp .env.production.example .env

nano .env
```

```env
VITE_API_URL=https://api.maternarsm.com.br
VITE_WS_URL=wss://api.maternarsm.com.br
VITE_GRAPHQL_URL=https://api.maternarsm.com.br/graphql

VITE_APP_NAME=Maternar Santa Mariense
VITE_APP_VERSION=2.0.0

VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# Google Analytics (opcional)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Sentry Frontend (opcional)
VITE_SENTRY_DSN=https://xxxxx@sentry.io/project-frontend
```

### 4.4 Executar Migrations

```bash
cd /opt/maternar-sm/enterprise/backend

# Instalar dependências
npm install --production

# Executar migrations
npx prisma migrate deploy

# Popular banco com dados iniciais
npm run db:seed
```

### 4.5 Build da Aplicação

```bash
# Backend
cd /opt/maternar-sm/enterprise/backend
npm run build

# Frontend
cd /opt/maternar-sm/enterprise/frontend
npm install
npm run build
```

---

## 🌐 Passo 5: Configurar Nginx

### 5.1 Criar Configuração

```bash
sudo nano /etc/nginx/sites-available/maternar-sm
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.maternarsm.com.br;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name maternarsm.com.br www.maternarsm.com.br;

    root /opt/maternar-sm/enterprise/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caching de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 5.2 Ativar Configuração

```bash
sudo ln -s /etc/nginx/sites-available/maternar-sm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.3 Configurar SSL com Let's Encrypt

```bash
sudo certbot --nginx -d maternarsm.com.br -d www.maternarsm.com.br -d api.maternarsm.com.br

# Auto-renovação
sudo certbot renew --dry-run
```

---

## 🐳 Passo 6: Configurar Docker Compose para Produção

### 6.1 Criar docker-compose.prod.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./enterprise/backend
      dockerfile: Dockerfile
    restart: always
    env_file:
      - ./enterprise/backend/.env
    ports:
      - "4000:4000"
    depends_on:
      - database
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  database:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: maternar_sm_prod
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  redis_data:
```

### 6.2 Iniciar Serviços

```bash
cd /opt/maternar-sm
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔄 Passo 7: Configurar PM2 (Process Manager)

### 7.1 Instalar PM2

```bash
sudo npm install -g pm2
```

### 7.2 Criar Arquivo de Configuração

```bash
cd /opt/maternar-sm/enterprise/backend
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'maternar-backend',
    script: './dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '1G'
  }]
}
```

### 7.3 Iniciar Aplicação

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📊 Passo 8: Monitoramento

### 8.1 Health Checks

```bash
# Backend health
curl https://api.maternarsm.com.br/health

# Expected response
{
  "status": "ok",
  "timestamp": "2025-10-24T...",
  "uptime": 123456,
  "environment": "production"
}
```

### 8.2 Logs

```bash
# PM2 logs
pm2 logs

# Docker logs
docker-compose logs -f backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 8.3 Monitoramento PM2

```bash
pm2 monit
pm2 status
```

---

## 🔐 Passo 9: Segurança

### 9.1 Firewall (UFW)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 9.2 Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 9.3 Atualizações Automáticas

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 💾 Passo 10: Backup

### 10.1 Script de Backup

```bash
sudo nano /opt/scripts/backup-maternar.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup banco de dados
pg_dump -U maternar_admin maternar_sm_prod | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Backup Redis
redis-cli --rdb "$BACKUP_DIR/redis_$DATE.rdb"

# Backup arquivos
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" /opt/maternar-sm/uploads

# Limpar backups antigos (manter 30 dias)
find $BACKUP_DIR -type f -mtime +30 -delete
```

### 10.2 Agendar Backups

```bash
sudo chmod +x /opt/scripts/backup-maternar.sh
crontab -e

# Adicionar linha (backup diário às 2h)
0 2 * * * /opt/scripts/backup-maternar.sh
```

---

## 🔄 Passo 11: Atualizações

### Script de Deploy

```bash
sudo nano /opt/scripts/deploy-maternar.sh
```

```bash
#!/bin/bash

cd /opt/maternar-sm

# Pull latest code
git pull origin main

# Backend
cd enterprise/backend
npm install --production
npx prisma migrate deploy
npm run build
pm2 restart maternar-backend

# Frontend
cd ../frontend
npm install
npm run build

# Reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deploy concluído!"
```

---

## ✅ Checklist de Go-Live

### Pré-Deploy

- [ ] Backups configurados e testados
- [ ] SSL certificado instalado
- [ ] Domínio apontando corretamente
- [ ] Variáveis de ambiente configuradas
- [ ] SMTP funcionando (testar envio de email)
- [ ] Migrations executadas
- [ ] Seeds populados

### Deploy

- [ ] Aplicação rodando (PM2 ou Docker)
- [ ] Nginx configurado e rodando
- [ ] Health checks passando
- [ ] WebSocket funcionando
- [ ] Cache Redis operacional
- [ ] Banco de dados acessível

### Pós-Deploy

- [ ] Monitoramento ativo (Sentry, PM2)
- [ ] Logs sendo gerados
- [ ] Firewall configurado
- [ ] Backups automáticos funcionando
- [ ] Teste de login
- [ ] Teste de funcionalidades críticas

### Testes Funcionais

- [ ] Login/Logout
- [ ] Criar curso
- [ ] Inscrever em curso
- [ ] Enviar mensagem no chat
- [ ] Criar evento no calendário
- [ ] Criar task no projeto Kanban
- [ ] Marcar política como lida

---

## 📞 Suporte Pós-Deploy

### Logs Importantes

```bash
# Aplicação
pm2 logs maternar-backend

# Nginx
sudo tail -f /var/log/nginx/error.log

# Sistema
sudo journalctl -u nginx
sudo journalctl -xe
```

### Comandos Úteis

```bash
# Reiniciar aplicação
pm2 restart maternar-backend

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver status
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis-server
```

---

## 🎉 Sistema em Produção!

Após completar todos os passos, seu sistema estará rodando em:

- **Frontend**: https://maternarsm.com.br
- **Backend API**: https://api.maternarsm.com.br
- **GraphQL**: https://api.maternarsm.com.br/graphql

---

**Versão**: 2.0.0  
**Data**: 24 de outubro de 2025  
**Status**: ✅ Pronto para Produção

🏥 **Maternar Santa Mariense**  
*Tecnologia a serviço da saúde*

