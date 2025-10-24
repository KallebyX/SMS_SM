# 🚀 Maternar Santa Mariense - Guia Rápido

## 📋 Sobre o Sistema

**Maternar Santa Mariense** é uma plataforma completa de gestão, educação e comunicação para profissionais de saúde, com funcionalidades modernas de:

- 🏆 **Gamificação** - Sistema de XP, níveis e conquistas
- 📚 **Cursos e Treinamentos** - Plataforma educacional completa
- 💬 **Chat em Tempo Real** - Comunicação instantânea por canais
- 📅 **Calendário** - Gestão de eventos e compromissos
- 📋 **Projetos Kanban** - Gestão ágil de projetos e tarefas
- 📑 **Biblioteca de Políticas** - Documentos organizacionais
- 🔗 **Links Úteis** - Acesso rápido a recursos importantes

## 🎨 Identidade Visual

### Cores Oficiais

```
🔵 Azul Primário:  #1E4A7A  (maternar-blue-500)
🟢 Verde Secundário: #7AB844  (maternar-green-500)
🔴 Rosa/Vermelho:   #D42E5B  (maternar-pink-500)
⚪ Cinza Neutro:    #9B9B9B  (maternar-gray-500)
```

## 🚀 Início Rápido

### Opção 1: Docker Compose (Recomendado)

```bash
# 1. Inicie todos os serviços
cd /Users/kalleby/Downloads/SMS_SM
bash sms-control.sh start

# 2. Aguarde todos os serviços subirem (~1 minuto)

# 3. Inicialize o banco de dados (apenas primeira vez)
cd enterprise/backend
bash init-database.sh

# 4. Acesse o sistema
# Frontend: http://localhost:3000
# Backend:  http://localhost:4000
# GraphQL:  http://localhost:4000/graphql
```

### Opção 2: Manual (Desenvolvimento)

```bash
# Terminal 1 - PostgreSQL e Redis
docker-compose up database redis

# Terminal 2 - Backend
cd enterprise/backend
bash setup-env.sh          # Cria .env (apenas primeira vez)
bash init-database.sh      # Inicializa banco (apenas primeira vez)
npm install
npm run dev

# Terminal 3 - Frontend
cd enterprise/frontend
npm install
npm run dev
```

## 👥 Usuários de Teste

| Função  | Email | Senha | Descrição |
|---------|-------|-------|-----------|
| **Admin** | admin@maternarsm.com.br | admin123 | Administrador do sistema |
| **Manager** | maria@maternarsm.com.br | user123 | Coordenadora (pode criar cursos) |
| **User** | joao@maternarsm.com.br | user123 | Usuário padrão (enfermeiro) |

## 📊 Dados de Exemplo Criados

O sistema vem populado com dados de demonstração:

- ✅ **3 usuários** (admin, manager, user)
- ✅ **2 cursos** com múltiplas lições
- ✅ **3 conquistas** (achievements)
- ✅ **2 canais de chat** (Geral e Emergência)
- ✅ **2 eventos** (reuniões e treinamentos)
- ✅ **1 projeto** com 3 tarefas
- ✅ **3 políticas** organizacionais
- ✅ **4 links** úteis

## 🔧 Comandos Úteis

### Gerenciamento do Sistema

```bash
# Iniciar tudo
bash sms-control.sh start

# Ver status
bash sms-control.sh status

# Ver logs
bash sms-control.sh logs
bash sms-control.sh logs backend  # logs de um serviço específico

# Parar tudo
bash sms-control.sh stop

# Reiniciar
bash sms-control.sh restart

# Resetar banco de dados
bash sms-control.sh reset-db

# Limpar tudo (cuidado!)
bash sms-control.sh clean
```

### Backend

```bash
cd enterprise/backend

# Executar migrações
npx prisma migrate dev

# Popular banco de dados
npm run db:seed

# Gerar Prisma Client
npx prisma generate

# Abrir Prisma Studio (interface visual do banco)
npx prisma studio

# Desenvolvimento
npm run dev

# Testes
npm test
```

### Frontend

```bash
cd enterprise/frontend

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Testes
npm test

# Testes E2E
npm run test:e2e
```

## 🌐 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Interface do usuário |
| **Backend API** | http://localhost:4000 | API REST + GraphQL |
| **GraphQL Playground** | http://localhost:4000/graphql | Interface GraphQL |
| **Health Check** | http://localhost:4000/health | Status do backend |
| **PostgreSQL** | localhost:5432 | Banco de dados |
| **Redis** | localhost:6379 | Cache |

## 🎯 Funcionalidades Principais

### 1. Sistema de Gamificação

- Ganhe XP completando cursos e lições
- Desbloqueie conquistas
- Suba de nível
- Veja o ranking semanal

### 2. Plataforma de Cursos

- Navegue por cursos disponíveis
- Inscreva-se em cursos
- Complete lições para ganhar XP
- Receba certificados ao concluir

### 3. Chat em Tempo Real

- Entre em canais públicos ou privados
- Envie mensagens instantâneas
- Compartilhe arquivos
- Veja quem está digitando

### 4. Calendário de Eventos

- Crie eventos (reuniões, treinamentos)
- Convide participantes
- Aceite ou recuse convites
- Visualização mensal e semanal

### 5. Gestão de Projetos (Kanban)

- Crie projetos
- Adicione tarefas
- Arraste e solte entre colunas
- Atribua tarefas a membros da equipe

## 🔐 Segurança

O sistema implementa:

- ✅ JWT para autenticação
- ✅ Bcrypt para hash de senhas
- ✅ RBAC (controle de acesso por roles)
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Headers de segurança (Helmet)
- ✅ Sanitização de inputs

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- 💻 Desktop (> 1024px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (< 768px)

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verifique se o PostgreSQL está rodando
docker ps | grep postgres

# Verifique as variáveis de ambiente
cd enterprise/backend
cat .env

# Recrie o .env se necessário
bash setup-env.sh
```

### Frontend não conecta ao backend

```bash
# Verifique se o backend está rodando
curl http://localhost:4000/health

# Deve retornar: {"status":"ok",...}
```

### Erro de migração do Prisma

```bash
cd enterprise/backend

# Reset do banco (CUIDADO: apaga dados)
npx prisma migrate reset

# Ou force as migrações
npx prisma migrate deploy --force
```

### Porta já em uso

```bash
# Encontre o processo usando a porta 3000 ou 4000
lsof -i :3000
lsof -i :4000

# Mate o processo
kill -9 <PID>
```

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique este guia
2. Consulte o README.md principal
3. Veja os logs: `bash sms-control.sh logs`
4. Entre em contato com a equipe técnica

## 🎉 Próximos Passos

Após iniciar o sistema:

1. ✅ Faça login com um dos usuários de teste
2. ✅ Explore o dashboard
3. ✅ Inscreva-se em um curso
4. ✅ Complete algumas lições para ganhar XP
5. ✅ Envie mensagens no chat
6. ✅ Crie um evento no calendário
7. ✅ Adicione tarefas a um projeto

---

**🏥 Maternar Santa Mariense** - Tecnologia a serviço da saúde

