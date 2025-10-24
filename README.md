# SMS-SM Enterprise System

Sistema completo de gestão para Secretaria Municipal de Saúde com funcionalidades de gamificação, cursos, chat, calendário, projetos, políticas e links úteis.

## 🚀 Início Rápido

### Modo de Emergência (Demonstração)

Para iniciar o sistema sem banco de dados e com bypass de autenticação:

```bash
# Iniciar todo o sistema
bash /workspaces/SMS_SM/start-emergency.sh start

# Verificar status
bash /workspaces/SMS_SM/start-emergency.sh status

# Parar sistema
bash /workspaces/SMS_SM/start-emergency.sh stop
```

### URLs de Acesso

- **🌐 Sistema Principal**: http://localhost:3000
- **🔧 Backend API**: http://localhost:4000
- **❤️ Health Check**: http://localhost:4000/health

## 🏗️ Arquitetura

### Backend (Porta 4000)
- **Node.js + Express**: Servidor principal
- **TypeScript**: Tipagem estática
- **GraphQL**: API moderna com Apollo Server
- **REST API**: Endpoints complementares
- **Socket.IO**: Chat em tempo real
- **PostgreSQL + Prisma**: Banco de dados
- **JWT**: Autenticação
- **Rate Limiting**: Proteção contra spam

### Frontend (Porta 3000)
- **React 18**: Interface moderna
- **TypeScript**: Tipagem estática
- **Vite**: Build tool rápido
- **Apollo Client**: Cliente GraphQL
- **Responsive Design**: Interface adaptativa

## 🎮 Funcionalidades

### 1. 🏆 Sistema de Gamificação
- Sistema de XP e níveis
- Conquistas e badges
- Ranking semanal
- Recompensas por atividades

### 2. 📚 Plataforma de Cursos
- Cursos estruturados
- Progresso de aprendizado
- Certificados
- Categorias e dificuldades

### 3. 💬 Chat em Tempo Real
- Canais por departamento
- Mensagens diretas
- Socket.IO para tempo real
- Histórico de conversas

### 4. 📅 Sistema de Calendário
- Eventos e agendamentos
- Lembretes automáticos
- Integração Google Calendar
- Visualizações múltiplas

### 5. 📂 Gerenciamento de Projetos
- Quadro Kanban
- Tarefas e subtarefas
- Colaboração em equipe
- Controle de prazos

### 6. 📋 Biblioteca de Políticas
- Documentos organizados
- Versioning de políticas
- Busca avançada
- Controle de acesso

### 7. 🔗 Links Úteis
- Links categorizados
- Favoritos pessoais
- Compartilhamento
- Analytics de uso

## 🔧 Comandos de Controle

```bash
# Gerenciamento completo do sistema
bash /workspaces/SMS_SM/start-emergency.sh [comando]

# Comandos disponíveis:
start    # Iniciar todos os serviços
stop     # Parar todos os serviços  
restart  # Reiniciar todos os serviços
status   # Verificar status dos serviços
logs     # Mostrar logs dos serviços
help     # Mostrar ajuda
```

## 🚨 Modo de Emergência

O sistema pode funcionar em "Modo de Emergência" para demonstrações:

### Ativação Automática
- **URL Parameter**: `?emergency=1`
- **Environment**: `VITE_EMERGENCY_MODE=true`
- **Config Backend**: `EMERGENCY_MODE=true`

### Características
- ✅ **Bypass de autenticação** (login automático)
- ✅ **Funciona sem banco de dados**
- ✅ **Perfeito para demos**
- ✅ **Todos os módulos acessíveis**
- ✅ **Indicador visual de emergência**

## 🐳 Docker (Opcional)

```bash
# Usar Docker Compose
docker-compose -f docker-compose.dev.yml up

# Ou usar script de controle
bash /workspaces/SMS_SM/sms-control.sh start
```

## 📁 Estrutura do Projeto

```
SMS_SM/
├── enterprise/
│   ├── backend/          # Servidor Node.js
│   │   ├── src/
│   │   │   ├── config/   # Configurações
│   │   │   ├── graphql/  # Schema e Resolvers
│   │   │   ├── services/ # Lógica de negócio
│   │   │   ├── middleware/ # Auth e validações
│   │   │   └── utils/    # Utilitários
│   │   └── prisma/       # Database schema
│   └── frontend/         # React App
│       ├── src/
│       │   ├── components/ # Componentes React
│       │   ├── lib/       # Apollo Client config
│       │   └── App.tsx    # Aplicação principal
│       └── public/        # Assets estáticos
├── start-emergency.sh    # Script de controle principal
├── docker-compose.yml    # Configuração Docker
└── README.md            # Esta documentação
```

## 🔐 Segurança

### Produção
- JWT com expiração configurável
- Rate limiting configurado
- Headers de segurança (Helmet)
- CORS configurado
- Validação de entrada (Zod)

### Desenvolvimento/Demo
- Modo de emergência disponível
- Logs detalhados
- Hot reload configurado
- Debugging habilitado

## 📊 Monitoramento

### Health Checks
- **Backend**: `GET /health`
- **Status**: Uptime, environment, database

### Logs
```bash
# Ver logs em tempo real
bash /workspaces/SMS_SM/start-emergency.sh logs
```

## 🚀 Deploy

### Requisitos Mínimos
- Node.js 18+
- PostgreSQL 14+
- Redis (opcional)
- 2GB RAM
- 1GB espaço em disco

### Variáveis de Ambiente
```bash
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/sms_sm
JWT_SECRET=your-secret-key
NODE_ENV=production

# Frontend  
VITE_API_URL=http://localhost:4000
VITE_EMERGENCY_MODE=false
```

---

## 📄 Licença

Este projeto é proprietário da Secretaria Municipal de Saúde.

## 👥 Contato

Para suporte técnico, contate a equipe de TI.