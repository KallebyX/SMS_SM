# 📋 Plano de Implementação - Sistema Maternar

## 🎯 Objetivo
Conectar todas as páginas do frontend ao backend GraphQL real, substituindo dados mock por dados reais.

---

## ✅ Páginas que JÁ FUNCIONAM

### 1. Dashboard ✅
- **Status**: Funcional
- **Dados**: Mock mas exibem corretamente
- **Prioridade**: Baixa (visão geral OK)

### 2. Profile ✅
- **Status**: Completo
- **Dados**: Exibe todas as informações pessoais
- **Prioridade**: Baixa (já completo)

---

## 🔧 Páginas que Precisam de INTEGRAÇÃO GRAPHQL

### 3. Gamification ❌
**Problema**: Exibe dados mock (conquistas, XP, ranking) mas não conecta ao backend

**Backend Disponível**:
```graphql
query achievements
query myAchievements  
query leaderboard
```

**O que fazer**:
1. Criar query GraphQL no Apollo Client
2. Substituir dados hardcoded por useQuery
3. Conectar botão "Participar" à mutation
4. Atualizar XP em tempo real

---

### 4. Training ❌
**Problema**: Exibe cursos mock mas não busca do backend

**Backend Disponível**:
```graphql
query courses
query course(id)
query myCourses
mutation enrollCourse
mutation completeCourse
```

**O que fazer**:
1. Substituir array de cursos por useQuery(courses)
2. Implementar busca e filtros
3. Conectar botão "Iniciar" à mutation enrollCourse
4. Mostrar progresso real do usuário

---

### 5. Chat ❌
**Problema**: Mensagens não são enviadas/recibidas

**Backend Disponível**:
```graphql
query channels
query channelMessages(channelId)
mutation sendMessage
Subscription messageSent
```

**O que fazer**:
1. Conectar ao WebSocket (Socket.IO)
2. Substituir mensagens mock por messages do backend
3. Implementar envio real de mensagens
4. Status online/offline
5. Typing indicators

---

### 6. Calendar ❌
**Problema**: Eventos mock, não salva no banco

**Backend Disponível**:
```graphql
query events
query event(id)
mutation createEvent
mutation updateEvent
mutation deleteEvent
```

**O que fazer**:
1. Substituir eventos mock por useQuery(events)
2. Conectar CreateEventModal à mutation
3. Mostrar eventos reais no calendário
4. Implementar convites

---

### 7. Projects ❌
**Problema**: Lista de projetos é mock

**Backend Disponível**:
```graphql
query projects
query project(id)
mutation createProject
mutation updateProject
mutation addProjectMember
```

**O que fazer**:
1. Substituir por useQuery(projects)
2. Conectar CreateProjectModal à mutation
3. Implementar busca e filtros
4. Mostrar dados reais (tarefas, membros, progresso)

---

### 8. Policies ❌
**Problema**: Políticas não são carregadas do backend

**Backend Disponível**:
```graphql
query policies
query policy(id)
mutation acknowledgePolicy
```

**O que fazer**:
1. Carregar políticas do backend
2. Implementar visualização de PDF
3. Botão "Visualizar" abre PDF do backend
4. Botão "Confirmar leitura" salva no banco

---

### 9. Links ❌
**Problema**: Links são mock

**Backend Disponível**:
```graphql
query links
mutation createLink
mutation updateLink
mutation deleteLink
```

**O que fazer**:
1. Substituir links mock por query real
2. Implementar CRUD de links
3. Categorizar links corretamente

---

### 10. Settings ❌
**Problema**: Botão "Salvar" não salva no backend

**Backend Disponível**:
```graphql
query me
mutation updateProfile
mutation updateSettings
```

**O que fazer**:
1. Conectar formulários às mutations
2. Implementar salvamento real
3. Feedback com toast ao salvar
4. Validação de campos

---

### 11. Analytics ❌
**Problema**: Gráficos usam dados mock

**Backend Disponível**:
```graphql
query analytics
query userStatistics
query dashboardMetrics
```

**O que fazer**:
1. Conectar gráficos aos dados reais
2. Implementar filtros por período
3. KPIs reais (usuários ativos, projetos, etc)
4. Exportar relatórios

---

### 12. Admin ❌
**Problema**: Menu admin não tem dados

**Backend Disponível**:
```graphql
query users
query logs
mutation createUser
mutation updateUser
mutation deleteUser
```

**O que fazer**:
1. Listar usuários reais
2. Implementar CRUD de usuários
3. Gerenciar permissões
4. Visualizar logs do sistema

---

## 🚀 Plano de Execução (Prioridade Alta)

### Fase 1: Core Funcional (3-4 horas)
1. ✅ Chat (WebSocket + mensagens)
2. ✅ Projects (CRUD completo)
3. ✅ Calendar (eventos reais)

### Fase 2: Educação (2-3 horas)
4. ✅ Training (cursos reais)
5. ✅ Policies (visualização + leitura)

### Fase 3: Gamificação e Analytics (2-3 horas)
6. ✅ Gamification (XP, conquistas, ranking)
7. ✅ Analytics (gráficos reais)

### Fase 4: Configurações e Links (1-2 horas)
8. ✅ Settings (salvar dados)
9. ✅ Links (CRUD)
10. ✅ Admin (gestão de usuários)

---

## 📝 Próximos Passos IMEDIATOS

1. **Criar queries GraphQL no frontend** (usando Apollo Client)
2. **Substituir dados mock** por useQuery/useMutation
3. **Implementar WebSocket** para Chat
4. **Testar integração** com backend
5. **Adicionar loading states** e error handling

---

## 🔑 Arquivos para Criar/Modificar

### Backend (já tem tudo!)
- ✅ Queries e Mutations já existem
- ✅ WebSocket já configurado
- ✅ Autenticação JWT funcionando

### Frontend (PRECISA FAZER):

1. **Apollo Client** (`enterprise/frontend/src/lib/apollo.ts`) - ✅ Já existe
2. **Custom Hooks** - Criar hooks para cada módulo:
   - `useCourses`
   - `useChat`
   - `useCalendar`
   - `useProjects`
   - `usePolicies`
3. **Páginas** - Integrar todas as páginas acima

---

**Status**: Sistema com UI 100% mas dados mock  
**Meta**: Conectar tudo ao backend GraphQL em 8-10 horas

