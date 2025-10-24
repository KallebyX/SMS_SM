# 📦 Maternar Santa Mariense - Instalação Manual

## ⚠️ Quando Usar Este Guia

Use este guia se:
- Docker não está instalado ou não está rodando
- Você prefere executar os serviços localmente
- Está em ambiente de desenvolvimento

## 📋 Pré-requisitos

Você precisará ter instalado:

1. **Node.js 18+**
   ```bash
   node --version  # deve ser >= 18.0.0
   ```

2. **PostgreSQL 14+**
   ```bash
   psql --version  # deve ser >= 14
   ```

3. **Redis 7+** (opcional, mas recomendado)
   ```bash
   redis-cli --version  # deve ser >= 7
   ```

## 🗄️ Passo 1: Configurar PostgreSQL

### macOS (Homebrew)

```bash
# Instalar PostgreSQL
brew install postgresql@15

# Iniciar serviço
brew services start postgresql@15

# Criar banco de dados
createdb maternar_sm

# Testar conexão
psql maternar_sm
```

### Linux (Ubuntu/Debian)

```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar usuário e banco
sudo -u postgres psql
CREATE DATABASE maternar_sm;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE maternar_sm TO postgres;
\q
```

### Windows

1. Baixe o instalador do PostgreSQL em https://www.postgresql.org/download/windows/
2. Execute o instalador e siga os passos
3. Abra o pgAdmin e crie o banco `maternar_sm`

## 🔴 Passo 2: Configurar Redis (Opcional)

### macOS (Homebrew)

```bash
# Instalar Redis
brew install redis

# Iniciar serviço
brew services start redis

# Testar
redis-cli ping  # deve retornar PONG
```

### Linux (Ubuntu/Debian)

```bash
# Instalar Redis
sudo apt install redis-server

# Iniciar serviço
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Testar
redis-cli ping  # deve retornar PONG
```

### Windows

1. Baixe o Redis para Windows em https://github.com/microsoftarchive/redis/releases
2. Execute o instalador
3. Inicie o serviço Redis

## ⚙️ Passo 3: Configurar Backend

```bash
# Navegue até o backend
cd /Users/kalleby/Downloads/SMS_SM/enterprise/backend

# Crie o arquivo .env
bash setup-env.sh

# OU crie manualmente:
cat > .env << 'EOF'
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/maternar_sm
REDIS_URL=redis://localhost:6379
JWT_SECRET=maternar_sm_2024_secret_change_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
EOF

# Instale as dependências
npm install

# Gere o Prisma Client
npx prisma generate

# Execute as migrações
npx prisma migrate dev --name init

# Popular o banco de dados com dados de exemplo
npm run db:seed
```

## 🎨 Passo 4: Configurar Frontend

```bash
# Navegue até o frontend
cd /Users/kalleby/Downloads/SMS_SM/enterprise/frontend

# Instale as dependências
npm install

# Crie o arquivo .env (se necessário)
cat > .env << 'EOF'
VITE_API_URL=http://localhost:4000
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_WS_URL=ws://localhost:4000
EOF
```

## 🚀 Passo 5: Iniciar os Serviços

Você precisará de **3 terminais** abertos:

### Terminal 1: Backend

```bash
cd /Users/kalleby/Downloads/SMS_SM/enterprise/backend
npm run dev
```

Você deve ver:
```
🚀 Server running on port 4000
📊 GraphQL endpoint: http://localhost:4000/graphql
🔌 WebSocket server ready
```

### Terminal 2: Frontend

```bash
cd /Users/kalleby/Downloads/SMS_SM/enterprise/frontend
npm run dev
```

Você deve ver:
```
  VITE v5.0.10  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Terminal 3: Redis (se não estiver como serviço)

```bash
redis-server
```

## ✅ Verificar Instalação

### 1. Teste o Backend

```bash
curl http://localhost:4000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.45,
  "environment": "development"
}
```

### 2. Teste o GraphQL

Abra no navegador: http://localhost:4000/graphql

Execute a query:
```graphql
query {
  courses {
    id
    title
    category
  }
}
```

### 3. Teste o Frontend

Abra no navegador: http://localhost:3000

Você deve ver a tela de login do **Maternar Santa Mariense**

## 👥 Fazer Login

Use um dos usuários de teste:

- **Admin**: admin@maternarsm.com.br / admin123
- **Manager**: maria@maternarsm.com.br / user123
- **User**: joao@maternarsm.com.br / user123

## 🔧 Comandos Úteis

### Resetar Banco de Dados

```bash
cd /Users/kalleby/Downloads/SMS_SM/enterprise/backend

# Reseta e recria o banco
npx prisma migrate reset

# Popula com dados de exemplo
npm run db:seed
```

### Ver Banco de Dados Visualmente

```bash
cd /Users/kalleby/Downloads/SMS_SM/enterprise/backend

# Abre o Prisma Studio
npx prisma studio
```

Acesse: http://localhost:5555

### Parar os Serviços

Pressione `Ctrl+C` em cada terminal para parar os serviços.

### Logs do Backend

Os logs aparecem no terminal onde você executou `npm run dev`

### Limpar node_modules

Se tiver problemas com dependências:

```bash
# Backend
cd enterprise/backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd enterprise/frontend
rm -rf node_modules package-lock.json
npm install
```

## 🐛 Troubleshooting

### Erro: "Port 4000 already in use"

```bash
# Encontre o processo
lsof -i :4000

# Mate o processo
kill -9 <PID>
```

### Erro: "Cannot connect to PostgreSQL"

```bash
# Verifique se o PostgreSQL está rodando
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Teste a conexão
psql -h localhost -U postgres -d maternar_sm
```

### Erro: "Prisma Client não gerado"

```bash
cd enterprise/backend
npx prisma generate
```

### Erro de Migração

```bash
cd enterprise/backend

# Opção 1: Reset completo (apaga dados)
npx prisma migrate reset

# Opção 2: Force push
npx prisma db push --force-reset
```

## 📊 Estrutura de Pastas

```
enterprise/
├── backend/
│   ├── .env                  # ✅ Arquivo de configuração (criado por você)
│   ├── node_modules/         # ✅ Instalado via npm install
│   ├── prisma/
│   │   ├── schema.prisma     # 📄 Schema do banco
│   │   └── migrations/       # 📄 Migrações
│   ├── src/                  # 📄 Código fonte
│   └── package.json          # 📄 Dependências
│
└── frontend/
    ├── .env                  # ⚠️  Opcional
    ├── node_modules/         # ✅ Instalado via npm install
    ├── src/                  # 📄 Código fonte
    └── package.json          # 📄 Dependências
```

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL rodando
- [ ] Redis rodando (opcional)
- [ ] Banco `maternar_sm` criado
- [ ] Backend: dependências instaladas
- [ ] Backend: arquivo .env criado
- [ ] Backend: Prisma Client gerado
- [ ] Backend: migrações executadas
- [ ] Backend: banco populado com dados
- [ ] Frontend: dependências instaladas
- [ ] Backend rodando em http://localhost:4000
- [ ] Frontend rodando em http://localhost:3000
- [ ] Login funcionando

## 🎉 Próximos Passos

Após a instalação bem-sucedida:

1. Leia o arquivo `MATERNAR_QUICKSTART.md` para conhecer o sistema
2. Faça login e explore as funcionalidades
3. Consulte a documentação da API em http://localhost:4000/graphql

---

**Instalação Manual Completa!** 🚀

Para dúvidas, consulte o README.md principal ou entre em contato com a equipe técnica.

