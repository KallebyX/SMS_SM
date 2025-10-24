# 🚀 Deploy no Render - Maternar Santa Mariense

Guia completo para fazer deploy do sistema no **Render.com** em poucos minutos.

---

## 🎯 Por que Render?

- ✅ **Gratuito** para começar (plano free tier generoso)
- ✅ **Deploy automático** via Git
- ✅ **PostgreSQL e Redis** incluídos
- ✅ **SSL grátis** (HTTPS automático)
- ✅ **Zero configuração** de servidor
- ✅ **Escalável** facilmente

---

## 📋 Pré-requisitos

1. ✅ Conta no [Render.com](https://render.com) (gratuita)
2. ✅ Código no GitHub/GitLab
3. ✅ 15 minutos

---

## 🚀 Método 1: Deploy Automático (Recomendado)

### Passo 1: Preparar Repositório

```bash
# 1. Inicializar Git (se ainda não fez)
cd /Users/kalleby/Downloads/SMS_SM
git init
git add .
git commit -m "Initial commit - Maternar Santa Mariense v2.0.0"

# 2. Criar repositório no GitHub
# Vá para: https://github.com/new
# Nome: maternar-santa-mariense
# Visibilidade: Private (recomendado)

# 3. Enviar código
git remote add origin https://github.com/SEU-USUARIO/maternar-santa-mariense.git
git branch -M main
git push -u origin main
```

### Passo 2: Deploy via Blueprint

1. **Acesse o Render Dashboard**: https://dashboard.render.com

2. **Clique em "New +" → "Blueprint"**

3. **Conecte seu repositório GitHub**
   - Autorize o Render a acessar seus repositórios
   - Selecione `maternar-santa-mariense`

4. **Render detectará o arquivo `render.yaml`**
   - Revise os serviços que serão criados:
     - ✅ PostgreSQL Database
     - ✅ Redis
     - ✅ Backend API
     - ✅ Frontend

5. **Clique em "Apply"**
   - Render criará todos os serviços automaticamente
   - Aguarde ~5-10 minutos

6. **Configurar Variável CORS_ORIGINS**
   - Após deploy, vá em "maternar-backend"
   - Aba "Environment"
   - Edite `CORS_ORIGINS`:
     ```
     https://maternar-frontend.onrender.com
     ```
   - Salve (backend reiniciará automaticamente)

### Passo 3: Acessar o Sistema

Após o deploy completar:

- **Frontend**: `https://maternar-frontend.onrender.com`
- **Backend API**: `https://maternar-backend.onrender.com`
- **GraphQL**: `https://maternar-backend.onrender.com/graphql`

**Login de teste:**
- Email: `admin@maternarsm.com.br`
- Senha: `admin123`

---

## 🔧 Método 2: Deploy Manual (Passo a Passo)

### 1. Criar PostgreSQL Database

1. No Render Dashboard → **"New +" → "PostgreSQL"**
2. Configurações:
   - **Name**: `maternar-database`
   - **Database**: `maternar_sm_prod`
   - **User**: `maternar_admin`
   - **Region**: Oregon (US West)
   - **Plan**: Starter ($7/mês) ou Free
3. Clique em **"Create Database"**
4. Aguarde provisionamento (~2 min)
5. **Copie a "Internal Connection String"**

### 2. Criar Redis

1. No Render Dashboard → **"New +" → "Redis"**
2. Configurações:
   - **Name**: `maternar-redis`
   - **Region**: Oregon (US West)
   - **Plan**: Starter ($10/mês) ou Free (25MB)
   - **Max Memory Policy**: allkeys-lru
3. Clique em **"Create Redis"**
4. Aguarde provisionamento (~1 min)
5. **Copie a "Internal Connection String"**

### 3. Deploy Backend

1. No Render Dashboard → **"New +" → "Web Service"**
2. **Conecte seu repositório GitHub**
3. Configurações:
   - **Name**: `maternar-backend`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: deixe vazio
   - **Runtime**: Node
   - **Build Command**:
     ```bash
     cd enterprise/backend && npm install && npx prisma generate && npm run build
     ```
   - **Start Command**:
     ```bash
     cd enterprise/backend && npx prisma migrate deploy && npm start
     ```
   - **Plan**: Starter ($7/mês) ou Free

4. **Environment Variables** (clique em "Add Environment Variable"):

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<COLE_A_CONNECTION_STRING_DO_POSTGRES>
REDIS_URL=<COLE_A_CONNECTION_STRING_DO_REDIS>
JWT_SECRET=<GERE_UMA_CHAVE_ALEATORIA_32_CHARS>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGINS=https://maternar-frontend.onrender.com
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
ENABLE_WEBSOCKETS=true
ENABLE_CACHE=true
ENABLE_COMPRESSION=true
```

**Gerar JWT_SECRET:**
```bash
# No terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. **Health Check Path**: `/health`

6. Clique em **"Create Web Service"**

7. Aguarde o deploy (~5-8 min)

### 4. Deploy Frontend

1. No Render Dashboard → **"New +" → "Static Site"**
2. **Conecte seu repositório GitHub**
3. Configurações:
   - **Name**: `maternar-frontend`
   - **Branch**: `main`
   - **Root Directory**: deixe vazio
   - **Build Command**:
     ```bash
     cd enterprise/frontend && npm install && npm run build
     ```
   - **Publish Directory**: `enterprise/frontend/dist`

4. **Environment Variables**:

```env
VITE_API_URL=https://maternar-backend.onrender.com
VITE_WS_URL=wss://maternar-backend.onrender.com
VITE_GRAPHQL_URL=https://maternar-backend.onrender.com/graphql
VITE_APP_NAME=Maternar Santa Mariense
VITE_APP_VERSION=2.0.0
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
```

5. **Rewrite Rules** (para SPA):
   - Source: `/*`
   - Destination: `/index.html`
   - Action: Rewrite

6. Clique em **"Create Static Site"**

7. Aguarde o deploy (~3-5 min)

### 5. Atualizar CORS no Backend

Após frontend deployed:

1. Vá em **maternar-backend** → **Environment**
2. Edite `CORS_ORIGINS`:
   ```
   https://maternar-frontend.onrender.com
   ```
3. Salve (backend reiniciará)

---

## 🔄 Deploy Automático (CI/CD)

Render faz deploy automático a cada push:

```bash
# Fazer alterações no código
git add .
git commit -m "Suas alterações"
git push origin main

# Render detecta automaticamente e faz deploy
# Acompanhe em: https://dashboard.render.com
```

---

## 🗄️ Migrations e Seeds

### Executar Migrations Manualmente

Se precisar executar migrations manualmente:

1. Vá em **maternar-backend**
2. Aba **"Shell"**
3. Execute:
   ```bash
   cd enterprise/backend
   npx prisma migrate deploy
   ```

### Popular Banco com Seeds

1. Na Shell do backend:
   ```bash
   cd enterprise/backend
   npm run db:seed
   ```

Ou adicione ao **Start Command**:
```bash
cd enterprise/backend && npx prisma migrate deploy && npm run db:seed && npm start
```

---

## 📊 Monitoramento

### Logs

1. **Backend Logs**:
   - Dashboard → maternar-backend → Logs

2. **Frontend Logs**:
   - Dashboard → maternar-frontend → Logs

3. **Database Logs**:
   - Dashboard → maternar-database → Logs

### Métricas

Render fornece automaticamente:
- ✅ CPU usage
- ✅ Memory usage
- ✅ Request volume
- ✅ Response times
- ✅ Error rates

### Alertas

Configure em: Dashboard → Service → Settings → Notifications

---

## 💰 Custos no Render

### Plano Free (Limitado)
- ✅ **Static Sites**: Grátis ilimitados
- ✅ **Web Services**: 750 horas/mês free (hiberna após inatividade)
- ✅ **PostgreSQL**: Free plan disponível (1GB, expira em 90 dias)
- ✅ **Redis**: Free plan (25MB)

**Total Free**: $0/mês (com limitações)

### Plano Recomendado (Produção)
- 💰 **Web Service** (Backend): $7/mês
- 💰 **PostgreSQL**: $7/mês (Starter - 1GB)
- 💰 **Redis**: $10/mês (Starter - 256MB)
- 💰 **Static Site** (Frontend): Grátis

**Total**: ~$24/mês

### Plano Profissional
- 💰 **Web Service** (Backend): $25/mês (mais recursos)
- 💰 **PostgreSQL**: $20/mês (Standard - 10GB)
- 💰 **Redis**: $25/mês (Standard - 1GB)

**Total**: ~$70/mês

---

## 🔒 Segurança

### SSL/HTTPS

✅ **Automático!** Render fornece SSL grátis para todos os serviços.

Suas URLs já terão HTTPS:
- `https://maternar-frontend.onrender.com`
- `https://maternar-backend.onrender.com`

### Variáveis de Ambiente

✅ Todas as variáveis de ambiente são criptografadas
✅ Nunca exponha secrets no código
✅ Use as Environment Variables do Render

### Domínio Customizado

Para usar seu próprio domínio (ex: `maternarsm.com.br`):

1. **No Render**:
   - Service → Settings → Custom Domain
   - Adicione: `maternarsm.com.br`
   - Render fornecerá registros DNS

2. **No seu provedor DNS**:
   - Adicione registro CNAME:
     - Name: `@` ou `www`
     - Value: `maternar-frontend.onrender.com`

3. **SSL**: Automático após DNS propagar (~1 hora)

---

## 🔧 Troubleshooting

### Backend não inicia

**Erro: "Failed to connect to database"**

Solução:
1. Verifique `DATABASE_URL` nas Environment Variables
2. Use a "Internal Connection String" do PostgreSQL
3. Formato: `postgresql://user:pass@host:5432/database`

**Erro: "Redis connection failed"**

Solução:
1. Verifique `REDIS_URL`
2. Use a "Internal Connection String" do Redis
3. Formato: `redis://red-xxxxx:6379`

### Frontend não conecta no Backend

**Erro de CORS**

Solução:
1. Backend → Environment → `CORS_ORIGINS`
2. Adicione URL do frontend:
   ```
   https://maternar-frontend.onrender.com
   ```
3. Separe múltiplas origens com vírgula

### Build falha

**Erro: "Module not found"**

Solução:
1. Verifique se `package.json` está correto
2. Clear build cache: Settings → Clear Build Cache
3. Manual deploy: Clique em "Manual Deploy" → "Clear build cache & deploy"

### Serviço hiberna (Free plan)

Solução:
1. Upgrade para Starter plan ($7/mês)
2. Ou use [UptimeRobot](https://uptimerobot.com) para ping a cada 5 min

---

## 📈 Otimizações

### Cache Redis

O sistema já usa Redis para:
- ✅ Sessões (7 dias)
- ✅ Queries frequentes (5-30 min)
- ✅ Rate limiting
- ✅ Online users

### Connection Pooling

Prisma gerencia automaticamente o pool de conexões.

Para otimizar, adicione ao `DATABASE_URL`:
```
?connection_limit=10&pool_timeout=10
```

### Compressão

Já habilitada no backend (middleware `compression`).

---

## 🔄 Updates e Rollbacks

### Deploy Nova Versão

```bash
git add .
git commit -m "Nova versão"
git push origin main
```

Render faz deploy automaticamente.

### Rollback

1. Dashboard → Service → Events
2. Encontre deploy anterior
3. Clique em "Rollback to this version"

---

## 📊 Monitoramento Avançado (Opcional)

### Sentry (Error Tracking)

1. Crie conta em: https://sentry.io
2. Crie projeto Node.js e React
3. Adicione DSNs nas Environment Variables:
   ```
   SENTRY_DSN=https://xxxxx@sentry.io/backend
   VITE_SENTRY_DSN=https://xxxxx@sentry.io/frontend
   ```

### Google Analytics

1. Crie propriedade: https://analytics.google.com
2. Adicione tracking ID:
   ```
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

---

## ✅ Checklist de Deploy

### Pré-Deploy
- [ ] Código commitado no Git
- [ ] Repositório no GitHub/GitLab
- [ ] Conta no Render criada

### Deploy
- [ ] PostgreSQL criado
- [ ] Redis criado
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] CORS_ORIGINS configurado

### Pós-Deploy
- [ ] Migrations executadas
- [ ] Seeds populados
- [ ] Login testado
- [ ] WebSocket funcionando
- [ ] GraphQL acessível

### Opcional
- [ ] Domínio customizado
- [ ] Sentry configurado
- [ ] Analytics configurado
- [ ] Monitoring configurado

---

## 🎉 Pronto!

Seu sistema está rodando no Render!

### URLs:
- **Frontend**: https://maternar-frontend.onrender.com
- **Backend**: https://maternar-backend.onrender.com
- **GraphQL**: https://maternar-backend.onrender.com/graphql

### Login:
- **Email**: admin@maternarsm.com.br
- **Senha**: admin123

---

## 📞 Suporte

### Documentação Render
- https://render.com/docs

### Status Render
- https://status.render.com

### Community
- https://community.render.com

---

**🏥 Maternar Santa Mariense v2.0.0**  
*Agora na nuvem com Render!* ☁️

**Deploy time**: ~10 minutos  
**Custo**: A partir de $0/mês (free) ou $24/mês (produção)

