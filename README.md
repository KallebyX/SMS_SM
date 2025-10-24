# Maternar Santa Mariense

Sistema completo de gestão, educação e comunicação para saúde com funcionalidades de gamificação, cursos, chat em tempo real, calendário, projetos Kanban, políticas e links úteis.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- Redis 7+
- Docker e Docker Compose (opcional)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/your-org/maternar-sm
cd maternar-sm

# 2. Configure o backend
cd enterprise/backend
bash setup-env.sh  # Cria o arquivo .env
bash init-database.sh  # Inicializa o banco de dados

# 3. Instale as dependências do frontend
cd ../frontend
npm install

# 4. Inicie o sistema com Docker Compose (recomendado)
cd ../..
bash sms-control.sh start
```

### URLs de Acesso

- **🌐 Sistema Principal**: http://localhost:3000
- **🔧 Backend API**: http://localhost:4000
- **❤️ Health Check**: http://localhost:4000/health
- **📊 GraphQL Playground**: http://localhost:4000/graphql

### Usuários de Teste

- **Admin**: admin@maternarsm.com.br / admin123
- **Manager**: maria@maternarsm.com.br / user123
- **User**: joao@maternarsm.com.br / user123

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
# Gerenciamento completo do sistema com Docker Compose
bash sms-control.sh [comando]

# Comandos disponíveis:
start      # Iniciar todos os serviços
stop       # Parar todos os serviços  
restart    # Reiniciar todos os serviços
status     # Verificar status dos serviços
logs       # Mostrar logs (use logs <service> para serviço específico)
build      # Construir todas as imagens Docker
clean      # Remover containers, volumes e imagens
reset-db   # Resetar banco de dados
help       # Mostrar ajuda
```

## 🔐 Segurança

O sistema implementa as melhores práticas de segurança:

### Autenticação e Autorização
- ✅ **JWT** com tokens de acesso e refresh
- ✅ **Bcrypt** para hash de senhas (salt de 12 rounds)
- ✅ **RBAC** (Role-Based Access Control)
- ✅ **Rate Limiting** configurável por rota

### Proteções Implementadas
- ✅ **Helmet** para headers HTTP seguros
- ✅ **CORS** restrito a origens permitidas
- ✅ **Sanitização de inputs** contra XSS
- ✅ **Proteção contra SQL Injection** (Prisma ORM)
- ✅ **Validação de dados** com Zod

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