# 🌐 Acesso na Rede Local - Maternar Santa Mariense

## ✅ Sistema Online!

### 📍 URLs da Rede Local

Acesse o sistema de qualquer dispositivo na mesma rede Wi‑Fi:

**Frontend**: http://10.121.4.124:3000
**Backend**: http://10.121.4.124:4000
**Health Check**: http://10.121.4.124:4000/health

### 📍 URLs Localhost

Se estiver na mesma máquina:

**Frontend**: http://localhost:3000
**Backend**: http://localhost:4000

---

## 🔑 Credenciais de Teste

**Email**: `admin@maternarsm.com.br`  
**Senha**: `admin123`

**Role**: ADMIN (acesso completo)

---

## 📱 Acesso de Dispositivos

### Celular/Tablet na mesma rede Wi‑Fi:
1. Conecte-se à mesma rede Wi‑Fi que o computador
2. Abra o navegador
3. Acesse: `http://10.121.4.124:3000`

### Computador na mesma rede:
1. Abra o navegador
2. Acesse: `http://10.121.4.124:3000`

### Outros dispositivos na rede:
- Use o IP `10.121.4.124:3000` em qualquer navegador
- O sistema é completamente responsivo (mobile, tablet, desktop)

---

## 🛠️ Gerenciamento

### Iniciar Sistema
```bash
./start-local.sh
```

### Parar Sistema
```bash
pkill -f 'npm run dev'
docker-compose down
```

### Ver Logs do Backend
```bash
tail -f logs/backend.log
```

### Ver Logs do Frontend
```bash
tail -f logs/frontend.log
```

### Ver Status dos Serviços
```bash
docker-compose ps
ps aux | grep "npm run dev"
```

### Reiniciar Sistema
```bash
# Parar tudo
pkill -f 'npm run dev'
docker-compose down

# Iniciar novamente
./start-local.sh
```

---

## 🔍 Verificar Status

### Health Check Backend
```bash
curl http://10.121.4.124:4000/health
```

### Testar Conexão
```bash
# De outro dispositivo na rede
ping 10.121.4.124

# Ou navegador
open http://10.121.4.124:3000
```

---

## 📊 Serviços em Execução

✅ **Frontend** - Porta 3000 (acessível na rede)  
✅ **Backend** - Porta 4000 (acessível na rede)  
✅ **PostgreSQL** - Porta 5432 (Docker, localhost apenas)  
✅ **Redis** - Porta 6379 (Docker, localhost apenas)  

---

## 🔒 Segurança

⚠️ **Importante**: Sistema em modo de desenvolvimento

- CORS está aberto para todas as origens
- Sem HTTPS (HTTP apenas)
- Não é seguro para produção
- Use apenas em rede local/desenvolvimento

### Para acesso externo:
1. Configure firewall do roteador
2. Use túnel VPN
3. Configure Nginx com HTTPS
4. Ou use Render/Vercel para produção

---

## 🎯 Próximos Passos

1. **Acessar** de qualquer dispositivo na rede
2. **Testar** todas as funcionalidades
3. **Verificar** responsividade mobile
4. **Validar** integrações backend

---

**Status**: 🟢 ONLINE  
**IP Local**: 10.121.4.124  
**Última atualização**: $(date)

