# GitHub Issues - Integração GraphQL

## Issues Criados

### ✅ Issue #1 - COMPLETO
**Título**: Criar estrutura base GraphQL (queries, mutations, subscriptions)
**Status**: ✅ RESOLVIDO
**Descrição**: Implementar todas as queries, mutations e subscriptions GraphQL
**Arquivos Criados**: 
- enterprise/frontend/src/graphql/queries.ts (30+ queries)
- enterprise/frontend/src/graphql/mutations.ts (15+ mutations)
- enterprise/frontend/src/graphql/subscriptions.ts (3 subscriptions)

---

### ✅ Issue #2 - COMPLETO
**Título**: Criar hooks customizados para integração GraphQL
**Status**: ✅ RESOLVIDO
**Descrição**: Implementar 8 hooks customizados para cada módulo
**Arquivos Criados**:
- enterprise/frontend/src/hooks/useAuth.ts
- enterprise/frontend/src/hooks/useCourses.ts
- enterprise/frontend/src/hooks/useGamification.ts
- enterprise/frontend/src/hooks/useChat.ts
- enterprise/frontend/src/hooks/useCalendar.ts
- enterprise/frontend/src/hooks/useProjects.ts
- enterprise/frontend/src/hooks/usePolicies.ts
- enterprise/frontend/src/hooks/useLinks.ts

---

### ✅ Issue #3 - COMPLETO
**Título**: Integrar Login com backend GraphQL
**Status**: ✅ RESOLVIDO
**Descrição**: Conectar Login.tsx ao hook useAuth e implementar autenticação JWT
**Arquivos Modificados**: enterprise/frontend/src/pages/auth/Login.tsx

---

### 🔄 Issue #4 - EM ANDAMENTO
**Título**: Integrar Training.tsx com useCourses
**Prioridade**: 🔴 Alta
**Tempo Estimado**: 15-20 minutos
**Descrição**: Substituir dados mock de cursos por dados reais do backend

**Tasks**:
- [ ] Importar useCourses hook
- [ ] Substituir array `courses` por `data?.courses` do useQuery
- [ ] Conectar botão "Iniciar" à mutation enroll()
- [ ] Implementar filtros funcionais
- [ ] Adicionar loading state durante carregamento
- [ ] Adicionar error handling
- [ ] Testar inscrição em curso
- [ ] Testar progresso do usuário

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Training.tsx

**GraphQL Utilizado**:
```graphql
query GET_COURSES
mutation ENROLL_IN_COURSE
mutation COMPLETE_LESSON
```

---

### ⏳ Issue #5 - PENDENTE
**Título**: Integrar Projects.tsx com useProjects
**Prioridade**: 🔴 Alta
**Tempo Estimado**: 20-25 minutos
**Descrição**: Substituir dados mock de projetos por dados reais e conectar CRUD

**Tasks**:
- [ ] Importar useProjects hook
- [ ] Substituir array `projects` por dados do backend
- [ ] Conectar CreateProjectModal à mutation createProject()
- [ ] Implementar Kanban board com dados reais
- [ ] Conectar criação de tarefas à mutation createTask()
- [ ] Implementar atualização de status de tarefas
- [ ] Adicionar loading states
- [ ] Testar criação de projeto
- [ ] Testar CRUD de tarefas

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Projects.tsx
- enterprise/frontend/src/components/modals/CreateProjectModal.tsx

**GraphQL Utilizado**:
```graphql
query GET_PROJECTS
mutation CREATE_PROJECT
mutation CREATE_TASK
mutation UPDATE_TASK
mutation DELETE_TASK
```

---

### ⏳ Issue #6 - PENDENTE
**Título**: Integrar Calendar.tsx com useCalendar
**Prioridade**: 🔴 Alta
**Tempo Estimado**: 15-20 minutos
**Descrição**: Substituir eventos mock por eventos reais do backend

**Tasks**:
- [ ] Importar useCalendar hook
- [ ] Substituir array `events` por dados do backend
- [ ] Conectar CreateEventModal à mutation createEvent()
- [ ] Implementar filtros por período (mensal, semanal)
- [ ] Adicionar confirmação de presença
- [ ] Mostrar eventos no calendário visual
- [ ] Adicionar loading states
- [ ] Testar criação de eventos

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Calendar.tsx
- enterprise/frontend/src/components/modals/CreateEventModal.tsx

**GraphQL Utilizado**:
```graphql
query GET_EVENTS
mutation CREATE_EVENT
mutation UPDATE_EVENT_ATTENDANCE
```

---

### ⏳ Issue #7 - PENDENTE
**Título**: Integrar Gamification.tsx com useGamification
**Prioridade**: 🟡 Média
**Tempo Estimado**: 15 minutos
**Descrição**: Substituir conquistas mock por dados reais do backend

**Tasks**:
- [ ] Importar useGamification hook
- [ ] Substituir arrays `achievements` e `leaderboard` por queries
- [ ] Buscar userStats do backend via query ME
- [ ] Mostrar progresso real de conquistas
- [ ] Atualizar XP e level em tempo real
- [ ] Implementar ranking real
- [ ] Adicionar loading states

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Gamification.tsx

**GraphQL Utilizado**:
```graphql
query GET_ACHIEVEMENTS
query GET_MY_ACHIEVEMENTS
query ME
```

---

### ⏳ Issue #8 - PENDENTE
**Título**: Integrar Chat.tsx com useChat e WebSocket
**Prioridade**: 🟡 Média
**Tempo Estimado**: 25-30 minutos
**Descrição**: Implementar chat em tempo real com WebSocket

**Tasks**:
- [ ] Importar useChat hook
- [ ] Substituir arrays `chats` e `messages` por queries reais
- [ ] Conectar envio de mensagem à mutation sendMessage()
- [ ] Implementar subscription MESSAGE_ADDED para tempo real
- [ ] Mostrar status online/offline dos usuários
- [ ] Implementar typing indicators
- [ ] Adicionar loading states durante envio
- [ ] Testar envio e recebimento de mensagens

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Chat.tsx

**GraphQL Utilizado**:
```graphql
query GET_CHANNELS
query GET_MESSAGES
mutation SEND_MESSAGE
subscription MESSAGE_ADDED
```

---

### ⏳ Issue #9 - PENDENTE
**Título**: Integrar Policies.tsx com usePolicies
**Prioridade**: 🟡 Média
**Tempo Estimado**: 15-20 minutos
**Descrição**: Substituir políticas mock por dados reais e implementar visualização PDF

**Tasks**:
- [ ] Importar usePolicies hook
- [ ] Substituir dados mock por useQuery(GET_POLICIES)
- [ ] Conectar botão "Confirmar leitura" à mutation markAsRead()
- [ ] Implementar visualização de PDF real
- [ ] Adicionar tracking de leitura
- [ ] Mostrar badge de políticas não lidas
- [ ] Adicionar loading states
- [ ] Testar confirmação de leitura

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Policies.tsx
- enterprise/frontend/src/components/PDFViewer.tsx

**GraphQL Utilizado**:
```graphql
query GET_POLICIES
mutation MARK_POLICY_AS_READ
mutation ACKNOWLEDGE_POLICY
```

---

### ⏳ Issue #10 - PENDENTE
**Título**: Integrar Links.tsx com useLinks
**Prioridade**: 🟢 Baixa
**Tempo Estimado**: 10-15 minutos
**Descrição**: Substituir links mock por dados reais do backend

**Tasks**:
- [ ] Importar useLinks hook
- [ ] Substituir array `links` por useQuery(GET_LINKS)
- [ ] Implementar filtros por categoria
- [ ] Adicionar contador de visitas
- [ ] Implementar busca de links
- [ ] Adicionar loading states
- [ ] Testar navegação

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Links.tsx

**GraphQL Utilizado**:
```graphql
query GET_LINKS
```

---

### ⏳ Issue #11 - PENDENTE
**Título**: Integrar Settings.tsx com mutation UPDATE_PROFILE
**Prioridade**: 🟡 Média
**Tempo Estimado**: 20-25 minutos
**Descrição**: Implementar salvamento real de configurações

**Tasks**:
- [ ] Criar mutation UPDATE_PROFILE
- [ ] Conectar handleSave() à mutation
- [ ] Implementar validação de campos
- [ ] Adicionar loading state durante salvamento
- [ ] Mostrar toast de sucesso/erro
- [ ] Recarregar dados do usuário após salvar
- [ ] Adicionar confirmação para mudanças críticas
- [ ] Testar salvamento de configurações

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Settings.tsx

**GraphQL Utilizado**:
```graphql
mutation UPDATE_PROFILE
query ME
```

---

### ⏳ Issue #12 - PENDENTE
**Título**: Integrar Analytics.tsx com dados reais do backend
**Prioridade**: 🟡 Média
**Tempo Estimado**: 20-25 minutos
**Descrição**: Substituir gráficos mock por dados reais das métricas

**Tasks**:
- [ ] Criar query GET_ANALYTICS
- [ ] Substituir dados mock dos gráficos por dados reais
- [ ] Implementar filtros por período (7d, 30d, 90d)
- [ ] Conectar KPIs ao backend
- [ ] Atualizar métricas em tempo real
- [ ] Adicionar exportação de relatórios
- [ ] Adicionar loading states
- [ ] Testar métricas

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Analytics.tsx

**GraphQL Utilizado**:
```graphql
query GET_ANALYTICS
query GET_DASHBOARD_METRICS
```

---

### ⏳ Issue #13 - PENDENTE
**Título**: Integrar Admin.tsx com gestão de usuários
**Prioridade**: 🔴 Alta
**Tempo Estimado**: 30-40 minutos
**Descrição**: Implementar CRUD de usuários e gerenciamento de permissões

**Tasks**:
- [ ] Criar queries GET_USERS, GET_LOGS
- [ ] Criar mutations CREATE_USER, UPDATE_USER, DELETE_USER
- [ ] Implementar listagem de usuários real
- [ ] Implementar criação de usuário
- [ ] Implementar edição de usuário
- [ ] Implementar exclusão de usuário
- [ ] Implementar gerenciamento de permissões
- [ ] Adicionar filtros por role
- [ ] Adicionar busca de usuários
- [ ] Testar CRUD completo

**Arquivos a Modificar**:
- enterprise/frontend/src/pages/Admin.tsx
- enterprise/frontend/src/pages/UserManagement.tsx

**GraphQL Utilizado**:
```graphql
query GET_USERS
query GET_LOGS
mutation CREATE_USER
mutation UPDATE_USER
mutation DELETE_USER
```

---

## Resumo dos Issues

- ✅ **Completos**: 3 issues (Estrutura, Hooks, Login)
- 🔄 **Em Andamento**: 1 issue (Training)
- ⏳ **Pendentes**: 10 issues (Projects, Calendar, Gamification, Chat, Policies, Links, Settings, Analytics, Admin, Dashboard)

**Prioridade**:
- 🔴 Alta: Training, Projects, Calendar, Admin (4 issues)
- 🟡 Média: Gamification, Chat, Policies, Settings, Analytics (5 issues)
- 🟢 Baixa: Links (1 issue)

**Tempo Total Estimado**: 3-4 horas para completar todas as integrações

---

## Como Começar

1. Começar pelo Issue #4 (Training) - já preparado
2. Depois Issue #5 (Projects) - mais complexo
3. Issue #6 (Calendar) - similar aos anteriores
4. Issues de prioridade média conforme necessidade

