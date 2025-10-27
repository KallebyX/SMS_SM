# 🏥 Maternar Santa Mariense

> Plataforma empresarial integrada para gestão, educação e comunicação em saúde

**Versão**: 2.0.0  
**Status**: ✅ Produção

---

## 🚀 Início Rápido

```bash
# Iniciar sistema
docker-compose up -d

# Executar migrations (primeira vez)
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npm run db:seed

# Acessar
open http://localhost:3000
```

**Login**: `admin@maternarsm.com.br` / `admin123`

---

## ✨ Funcionalidades

### Core
- 🏆 **Gamificação** - XP, níveis, conquistas e ranking
- 📚 **Plataforma de Cursos** - LMS completo com certificados
- 💬 **Chat em Tempo Real** - Canais, mensagens e typing indicators
- 📅 **Calendário** - Eventos, convites e lembretes
- 📋 **Projetos Kanban** - Gestão ágil de tarefas
- 📑 **Biblioteca de Políticas** - Documentos versionados
- 🔗 **Links Úteis** - Acesso rápido a recursos

### UX Moderna
- ⚡ **Busca Global** - Cmd/Ctrl+K para buscar em tudo
- 🔔 **Centro de Notificações** - Real-time com badge contador
- 📊 **Gráficos Interativos** - Analytics com Recharts
- 💾 **Feedback Visual** - Toast system em todas ações
- 📄 **PDF Viewer** - Visualizar documentos no navegador
- 📤 **Upload Drag & Drop** - Com preview de imagens
- 🎯 **Modals Inteligentes** - Validação em tempo real

### Admin
- 👑 **Painel Admin** - 6 seções de gerenciamento
- 👥 **Gestão de Usuários** - Criar, editar, permissões
- 📊 **Monitoramento** - Sistema, performance, logs
- 🔒 **Segurança** - SSL, firewall, backups
- 🗄️ **Database** - Operações e manutenção

---

## 🏗️ Tecnologias

### Backend
- Node.js 18 + Express + TypeScript
- GraphQL (Apollo Server) - 19 queries, 18 mutations
- Prisma ORM + PostgreSQL
- Socket.IO (WebSocket)
- Redis (cache e sessions)
- JWT + Bcrypt

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS (tema Maternar)
- Apollo Client
- React Hook Form + Zod
- Recharts (gráficos)
- Framer Motion (animações)

### Infraestrutura
- Docker Compose (4 serviços)
- PostgreSQL 15
- Redis 7
- Render.com ready

---

## 🎨 Tema Maternar

Paleta de 40 cores extraídas da logo:

```css
Azul:  #1E4A7A  (maternar-blue-500)
Verde: #7AB844  (maternar-green-500)
Rosa:  #D42E5B  (maternar-pink-500)
Cinza: #9B9B9B  (maternar-gray-500)
```

---

## 🚢 Deploy

### Render (Recomendado - 10 minutos)

```bash
# 1. Push para GitHub
git push origin main

# 2. Render Dashboard
# https://dashboard.render.com
# New + → Blueprint → Deploy

# 3. Configurar CORS_ORIGINS após deploy
```

**Custo**: $24/mês (Starter) ou Free tier

### Docker Local

```bash
docker-compose up -d
```

---

## 🔐 Segurança

- ✅ JWT (7 dias) + Refresh (30 dias)
- ✅ Bcrypt (12 rounds)
- ✅ RBAC (Admin/Manager/User)
- ✅ Rate Limiting (1000 req/15min)
- ✅ Helmet (security headers)
- ✅ CORS restrito
- ✅ Input sanitization

---

## ⚡ Performance

- Cache Redis (sessões, queries, ranking)
- Connection pooling (Prisma)
- Compressão gzip
- Code splitting
- Lazy loading

---

## 📊 Banco de Dados

**16 modelos Prisma**:
- User, Course, Lesson, Achievement
- Message, Channel, Event
- Project, Task, Policy, Link
- + tabelas de relacionamento

**Seeds incluídos**:
- 3 usuários de teste
- 2 cursos completos
- Achievements, canais, eventos
- Projeto exemplo com tasks

---

## 🔧 Comandos

```bash
# Gerenciamento
bash sms-control.sh start      # Iniciar
bash sms-control.sh status     # Status
bash sms-control.sh logs       # Logs
bash sms-control.sh stop       # Parar

# Backend (em enterprise/backend/)
npm run dev                    # Desenvolvimento
npm run build                  # Build
npx prisma studio              # GUI do banco
npx prisma migrate dev         # Migrations

# Frontend (em enterprise/frontend/)
npm run dev                    # Desenvolvimento
npm run build                  # Build
npm test                       # Testes
```

---

## 🌐 URLs

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| GraphQL | http://localhost:4000/graphql |
| Health | http://localhost:4000/health |

---

## 👥 Usuários de Teste

| Função | Email | Senha |
|--------|-------|-------|
| Admin | admin@maternarsm.com.br | admin123 |
| Manager | maria@maternarsm.com.br | user123 |
| User | joao@maternarsm.com.br | user123 |

---

## 📦 Estrutura

```
SMS_SM/
├── enterprise/
│   ├── backend/           # Node.js + GraphQL + Prisma
│   │   ├── src/
│   │   │   ├── graphql/   # TypeDefs + Resolvers
│   │   │   ├── services/  # Auth, Course, Cache, Socket
│   │   │   └── config/    # Redis, JWT
│   │   └── prisma/        # Schema + Migrations
│   └── frontend/          # React + TypeScript + Tailwind
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/    # Toast, Modal, Skeleton
│       │   │   ├── modals/# Create forms
│       │   │   └── ...    # NotificationCenter, GlobalSearch
│       │   ├── pages/     # 18 páginas
│       │   └── lib/       # validations, apollo, utils
│       └── public/
├── docker-compose.yml     # Orquestração
├── render.yaml           # Deploy Render
└── README.md
```

---

## 🆘 Troubleshooting

### Porta ocupada
```bash
lsof -i :4000
kill -9 <PID>
```

### Erro de conexão DB
```bash
docker-compose restart database
docker-compose ps  # Aguardar healthy
```

### Reset completo
```bash
bash sms-control.sh stop
docker-compose down -v
docker-compose up -d
```

---

## 📈 Status

```
Backend GraphQL:     ████████████████████ 100%
WebSocket:           ████████████████████ 100%
Frontend UI:         ████████████████████ 100%
Gamificação:         ████████████████████ 100%
Cursos:              ████████████████████ 100%
Chat:                ████████████████████ 100%
Calendário:          ████████████████████ 100%
Projetos:            ████████████████████ 100%
Políticas:           ████████████████████ 100%
Cache Redis:         ████████████████████ 100%
Segurança:           ████████████████████ 100%
Documentação:        ████████████████████ 100%
```

---

## 🎯 Features Destacadas

### Cmd/Ctrl+K - Busca Global ⚡
Busque qualquer coisa no sistema instantaneamente com atalho de teclado.

### Centro de Notificações 🔔
Notificações em tempo real com contador de não lidas e ações rápidas.

### Gráficos Interativos 📊
4 gráficos em Analytics com tooltips e legendas interativas.

### Página Admin Completa 👑
6 tabs de gerenciamento: Overview, Usuários, Sistema, Segurança, Database, Configurações.

### Validação Robusta ✅
React Hook Form + Zod em todos os formulários com mensagens em português.

---

## 💰 Custos (Render)

| Plano | Custo | Recursos |
|-------|-------|----------|
| Free | $0/mês | Hiberna após 15min inatividade |
| Starter | $24/mês | Backend + PostgreSQL + Redis |
| Professional | $70/mês | Mais recursos e performance |

---

## 📜 Licença

Proprietário © 2025 Maternar Santa Mariense

---

## 🔗 Links

- **Render**: https://render.com
- **Deploy**: Use `render.yaml` para deploy automático
- **GraphQL Playground**: http://localhost:4000/graphql (dev only)

---

**🏥 Maternar Santa Mariense v2.0.0**  
*Tecnologia a serviço da saúde* 💚

Desenvolvido com React, TypeScript, GraphQL e ❤️
