# ⚡ Render Quickstart - Deploy em 5 Minutos

## 🚀 Deploy Rápido com 1 Clique

### Opção 1: Blueprint (Mais Rápido) ⚡

1. **Push código para GitHub**:
   ```bash
   cd /Users/kalleby/Downloads/SMS_SM
   git init
   git add .
   git commit -m "Deploy Maternar Santa Mariense"
   git remote add origin https://github.com/SEU-USUARIO/maternar.git
   git push -u origin main
   ```

2. **Acesse**: https://dashboard.render.com

3. **Clique**: "New +" → "Blueprint"

4. **Conecte repositório** e clique "Apply"

5. **Aguarde 5-10 minutos** ☕

6. **Configure CORS**:
   - Backend → Environment
   - `CORS_ORIGINS` = URL do frontend
   - Save

7. **Pronto!** 🎉

---

### Opção 2: Deploy Manual (Mais Controle) 🔧

#### 1. Database (2 min)
```
New + → PostgreSQL
Name: maternar-database
Plan: Starter ($7/mês) ou Free
Create Database
```
📋 **Copie**: Internal Connection String

#### 2. Redis (1 min)
```
New + → Redis
Name: maternar-redis
Plan: Starter ($10/mês) ou Free
Create Redis
```
📋 **Copie**: Internal Connection String

#### 3. Backend (5 min)
```
New + → Web Service
Conectar GitHub
Name: maternar-backend

Build Command:
cd enterprise/backend && npm install && npx prisma generate && npm run build

Start Command:
cd enterprise/backend && npx prisma migrate deploy && npm start

Environment Variables:
NODE_ENV=production
DATABASE_URL=<cole aqui>
REDIS_URL=<cole aqui>
JWT_SECRET=<gere aleatório 32 chars>
CORS_ORIGINS=<URL do frontend depois>
```

**Gerar JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4. Frontend (3 min)
```
New + → Static Site
Conectar GitHub
Name: maternar-frontend

Build Command:
cd enterprise/frontend && npm install && npm run build

Publish Directory:
enterprise/frontend/dist

Environment Variables:
VITE_API_URL=https://maternar-backend.onrender.com
VITE_WS_URL=wss://maternar-backend.onrender.com
VITE_GRAPHQL_URL=https://maternar-backend.onrender.com/graphql

Rewrite Rule:
Source: /*
Destination: /index.html
```

#### 5. Atualizar CORS
```
Backend → Environment → CORS_ORIGINS
Valor: https://maternar-frontend.onrender.com
Save (reinicia automaticamente)
```

---

## ✅ Validar Deploy

1. **Abrir Frontend**: https://maternar-frontend.onrender.com
2. **Login**:
   - Email: `admin@maternarsm.com.br`
   - Senha: `admin123`
3. **Testar**:
   - [ ] Login funcionando
   - [ ] Dashboard carregando
   - [ ] Chat em tempo real
   - [ ] Criar curso

---

## 💰 Custos

| Plano | Custo/mês | Para |
|-------|-----------|------|
| **Free** | $0 | Testes (hibernação após 15min) |
| **Starter** | $24 | Produção pequena |
| **Pro** | $70 | Produção média |

**Detalhes**:
- Backend: $7/mês (Starter)
- PostgreSQL: $7/mês (Starter 1GB)
- Redis: $10/mês (Starter 256MB)
- Frontend: Grátis

---

## 🔧 Comandos Úteis

### Ver Logs
```
Dashboard → Service → Logs
```

### Redeployar
```
Dashboard → Service → Manual Deploy
```

### Shell (executar comandos)
```
Dashboard → maternar-backend → Shell

# Migrations
cd enterprise/backend && npx prisma migrate deploy

# Seeds
cd enterprise/backend && npm run db:seed

# Ver status
cd enterprise/backend && npx prisma studio
```

---

## 🐛 Problemas Comuns

### 1. Backend não inicia
**Erro**: "Failed to connect to database"

✅ **Solução**: Verificar `DATABASE_URL` está correto

### 2. Frontend não conecta
**Erro**: CORS

✅ **Solução**: Adicionar URL do frontend em `CORS_ORIGINS`

### 3. Build falha
**Erro**: "Module not found"

✅ **Solução**: Settings → Clear Build Cache → Manual Deploy

---

## 📱 Domínio Customizado

Para usar `maternarsm.com.br`:

1. **Render**: Service → Settings → Custom Domain → Add `maternarsm.com.br`
2. **DNS**: CNAME `@` → `maternar-frontend.onrender.com`
3. **Aguardar**: ~1 hora (propagação DNS)
4. **SSL**: Automático

---

## 🎉 Pronto!

Sistema rodando em:
- 🌐 Frontend: https://maternar-frontend.onrender.com
- 🔌 Backend: https://maternar-backend.onrender.com
- 📊 GraphQL: https://maternar-backend.onrender.com/graphql

**Total time**: ~10 minutos  
**Custo**: A partir de $0 (free) ou $24/mês (prod)

---

**Documentação completa**: [DEPLOY_RENDER.md](DEPLOY_RENDER.md)

🏥 **Maternar Santa Mariense**  
*Na nuvem em minutos!* ☁️⚡

