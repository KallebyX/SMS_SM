# ✅ Maternar Santa Mariense - Checklist de Testes

Use este checklist para validar todas as funcionalidades do sistema.

---

## 🚀 PASSO 1: Inicialização (5 minutos)

```bash
# Execute estes comandos:
cd /Users/kalleby/Downloads/SMS_SM
bash sms-control.sh start
cd enterprise/backend
bash init-database.sh
```

- [ ] Docker Desktop está aberto
- [ ] Comando `sms-control.sh start` executado com sucesso
- [ ] PostgreSQL iniciou (veja nos logs)
- [ ] Redis iniciou (veja nos logs)
- [ ] Backend iniciou na porta 4000
- [ ] Frontend iniciou na porta 3000
- [ ] Comando `init-database.sh` executado
- [ ] Migrações do Prisma aplicadas
- [ ] Banco populado com dados de exemplo

**Teste rápido:**
```bash
curl http://localhost:4000/health
# Deve retornar: {"status":"ok",...}
```

---

## 🔐 PASSO 2: Autenticação (5 minutos)

### Login

Acesse: http://localhost:3000

- [ ] Página de login carrega
- [ ] Logo "Maternar Santa Mariense" aparece
- [ ] Cores azul (#1E4A7A) e verde (#7AB844) visíveis
- [ ] Campo de email funciona
- [ ] Campo de senha funciona

### Teste com Admin

- [ ] Login com: admin@maternarsm.com.br / admin123
- [ ] Login bem-sucedido
- [ ] Redirecionado para dashboard
- [ ] Nome "Admin Sistema" aparece no header
- [ ] XP (10000) aparece no header
- [ ] Nível (10) aparece no header

### Teste com Manager

- [ ] Logout
- [ ] Login com: maria@maternarsm.com.br / user123
- [ ] Login bem-sucedido
- [ ] Nome "Maria Santos" aparece

### Teste com User

- [ ] Logout  
- [ ] Login com: joao@maternarsm.com.br / user123
- [ ] Login bem-sucedido
- [ ] Nome "João Silva" aparece

---

## 🏆 PASSO 3: Sistema de Gamificação (10 minutos)

Faça login como: admin@maternarsm.com.br / admin123

- [ ] Navegar para aba "🏆 Gamificação"
- [ ] Ver XP total (10000)
- [ ] Ver nível atual (10)
- [ ] Ver progresso para próximo nível
- [ ] Barra de progresso aparece
- [ ] Ver conquistas disponíveis
- [ ] Ver ranking semanal

**Esperado:**
- Dashboard com métricas
- Conquistas: 🎓 Primeiro Curso, 📚 Estudante Dedicado, ⭐ Milestone 1000 XP
- Ranking mostrando Maria Santos (3500 XP) e João Silva (1250 XP)

---

## 📚 PASSO 4: Plataforma de Cursos (15 minutos)

Faça login como: joao@maternarsm.com.br / user123

- [ ] Navegar para aba "📚 Cursos"
- [ ] Ver 2 cursos disponíveis:
  - "Segurança do Paciente"
  - "Controle de Infecção Hospitalar"

### Testar Inscrição

- [ ] Clicar em "Inscrever-se" em um curso
- [ ] Inscrição confirmada
- [ ] Curso aparece em "Meus Cursos"
- [ ] Progresso inicial é 0%

### Testar Conclusão de Lição

- [ ] Abrir curso inscrito
- [ ] Ver lista de lições
- [ ] Clicar em "Iniciar Lição" na primeira lição
- [ ] Ver conteúdo da lição
- [ ] Clicar em "Concluir Lição"
- [ ] Ver notificação de XP ganho
- [ ] XP do usuário aumentou
- [ ] Progresso do curso atualizado

### Testar Conclusão de Curso

- [ ] Completar todas as lições
- [ ] Curso marcado como 100% concluído
- [ ] Ganhou XP do curso
- [ ] Certificado disponível (se implementado)

---

## 💬 PASSO 5: Chat em Tempo Real (10 minutos)

Faça login como: admin@maternarsm.com.br / admin123

- [ ] Navegar para aba "💬 Chat"
- [ ] Ver 2 canais:
  - "Geral"
  - "Emergência"

### Testar Mensagens

- [ ] Entrar no canal "Geral"
- [ ] Campo de mensagem aparece
- [ ] Digitar mensagem
- [ ] Clicar em "Enviar"
- [ ] Mensagem aparece no chat
- [ ] Nome do remetente correto
- [ ] Timestamp aparece

### Testar em Tempo Real (2 navegadores)

- [ ] Abrir http://localhost:3000 em outro navegador
- [ ] Login com maria@maternarsm.com.br / user123
- [ ] Entrar no canal "Geral"
- [ ] Enviar mensagem de um navegador
- [ ] Mensagem aparece instantaneamente no outro
- [ ] Indicador de "digitando..." funciona (se implementado)

### Testar Canais

- [ ] Ver lista de canais
- [ ] Entrar em "Emergência"
- [ ] Enviar mensagem de teste
- [ ] Sair do canal
- [ ] Voltar ao "Geral"

---

## 📅 PASSO 6: Calendário (10 minutos)

Faça login como: maria@maternarsm.com.br / user123

- [ ] Navegar para aba "📅 Calendário"
- [ ] Ver 2 eventos criados:
  - "Reunião de Equipe" (amanhã)
  - "Treinamento de Emergência" (próximo dia)

### Visualizar Eventos

- [ ] Ver evento no calendário
- [ ] Clicar no evento
- [ ] Ver detalhes (título, descrição, local, horário)
- [ ] Ver organizador
- [ ] Ver lista de participantes

### Criar Evento

- [ ] Clicar em "Criar Evento"
- [ ] Preencher título
- [ ] Preencher descrição
- [ ] Escolher data e hora
- [ ] Escolher tipo (Reunião/Treinamento/Feriado)
- [ ] Adicionar local
- [ ] Salvar evento
- [ ] Evento aparece no calendário

### Responder Convite

- [ ] Ver evento que você foi convidado
- [ ] Clicar em "Aceitar"
- [ ] Status muda para "Aceito"
- [ ] Ou clicar em "Recusar"
- [ ] Status muda para "Recusado"

---

## 📋 PASSO 7: Projetos Kanban (15 minutos)

Faça login como: admin@maternarsm.com.br / admin123

- [ ] Navegar para aba "📋 Projetos"
- [ ] Ver projeto: "Implementação do Protocolo de Sepse"

### Visualizar Quadro Kanban

- [ ] Ver 4 colunas:
  - TODO (A Fazer)
  - IN_PROGRESS (Em Progresso)
  - REVIEW (Revisão)
  - DONE (Concluído)

- [ ] Ver 3 tarefas distribuídas:
  - "Revisar literatura sobre sepse" (TODO)
  - "Definir critérios de diagnóstico" (IN_PROGRESS)
  - "Treinar equipe médica" (TODO)

### Criar Tarefa

- [ ] Clicar em "Criar Tarefa"
- [ ] Preencher título
- [ ] Preencher descrição
- [ ] Escolher prioridade (LOW/MEDIUM/HIGH/URGENT)
- [ ] Escolher data de entrega
- [ ] Atribuir a um membro
- [ ] Salvar tarefa
- [ ] Tarefa aparece na coluna TODO

### Mover Tarefa (Drag & Drop)

- [ ] Arrastar tarefa de TODO para IN_PROGRESS
- [ ] Tarefa muda de coluna
- [ ] Ou usar botão "Mover"
- [ ] Status da tarefa atualiza

### Atribuir Tarefa

- [ ] Clicar em tarefa
- [ ] Ver campo "Responsável"
- [ ] Atribuir a um membro
- [ ] Salvar
- [ ] Avatar do responsável aparece na tarefa

### Editar Tarefa

- [ ] Clicar em tarefa
- [ ] Editar título ou descrição
- [ ] Mudar prioridade
- [ ] Salvar
- [ ] Mudanças aplicadas

### Excluir Tarefa

- [ ] Clicar em tarefa
- [ ] Clicar em "Excluir"
- [ ] Confirmar exclusão
- [ ] Tarefa removida do quadro

---

## 📑 PASSO 8: Biblioteca de Políticas (10 minutos)

Faça login como: joao@maternarsm.com.br / user123

- [ ] Navegar para aba "📑 Políticas"
- [ ] Ver 3 políticas:
  - "Política de Segurança da Informação"
  - "Protocolo de Higienização"
  - "Diretrizes de Atendimento ao Paciente"

### Visualizar Política

- [ ] Clicar em uma política
- [ ] Ver conteúdo completo
- [ ] Ver versão (ex: 1.0, 2.1)
- [ ] Ver categoria
- [ ] Ver se requer reconhecimento

### Marcar como Lida

- [ ] Clicar em "Marcar como Lido"
- [ ] Política marcada com data de leitura
- [ ] Status muda para "Lido"

### Reconhecer Política

- [ ] Para políticas que requerem reconhecimento
- [ ] Clicar em "Reconhecer"
- [ ] Política marcada como reconhecida
- [ ] Data de reconhecimento registrada

### Filtrar Políticas

- [ ] Filtrar por categoria
- [ ] Ver apenas políticas da categoria selecionada
- [ ] Limpar filtro
- [ ] Ver todas novamente

---

## 🔗 PASSO 9: Links Úteis (5 minutos)

- [ ] Navegar para aba "🔗 Links"
- [ ] Ver 4 links:
  - "Portal Maternar"
  - "Sistema de Prontuário Eletrônico"
  - "Biblioteca Virtual em Saúde"
  - "Suporte Técnico"

### Testar Links

- [ ] Ver categorização dos links
- [ ] Clicar em um link
- [ ] Link abre em nova aba
- [ ] URLs corretas

### Filtrar Links

- [ ] Filtrar por categoria (SYSTEM/TRAINING/SUPPORT/EXTERNAL)
- [ ] Ver apenas links da categoria
- [ ] Limpar filtro

---

## 👤 PASSO 10: Perfil e Configurações (5 minutos)

- [ ] Clicar no nome do usuário no header
- [ ] Ver perfil completo
- [ ] Ver informações pessoais
- [ ] Ver departamento e cargo
- [ ] Ver XP e nível
- [ ] Ver conquistas desbloqueadas

### Configurações

- [ ] Navegar para Configurações
- [ ] Ver opções de idioma
- [ ] Ver opções de tema (claro/escuro)
- [ ] Ver configurações de notificação

---

## 🔧 PASSO 11: Funcionalidades Admin (10 minutos)

Faça login como: admin@maternarsm.com.br / admin123

### Criar Curso (Admin/Manager)

- [ ] Navegar para Cursos
- [ ] Clicar em "Criar Curso"
- [ ] Preencher informações
- [ ] Salvar curso
- [ ] Curso aparece na lista

### Adicionar Lição

- [ ] Abrir curso criado
- [ ] Clicar em "Adicionar Lição"
- [ ] Preencher título e conteúdo
- [ ] Definir recompensa de XP
- [ ] Salvar lição
- [ ] Lição aparece no curso

### Criar Canal de Chat

- [ ] Navegar para Chat
- [ ] Clicar em "Criar Canal"
- [ ] Preencher nome e descrição
- [ ] Escolher tipo (Público/Privado)
- [ ] Salvar canal
- [ ] Canal criado

---

## 🎯 PASSO 12: Testes de Integração (10 minutos)

### Workflow Completo

- [ ] Criar um novo usuário (admin pode criar)
- [ ] Criar um novo curso
- [ ] Adicionar 3 lições ao curso
- [ ] Fazer logout
- [ ] Login com usuário criado
- [ ] Inscrever-se no curso novo
- [ ] Completar as 3 lições
- [ ] Ganhar XP de cada lição
- [ ] Ganhar XP de conclusão do curso
- [ ] Verificar nível subiu (se passou threshold)
- [ ] Verificar se desbloqueou conquista "Primeiro Curso"

### Projeto Completo

- [ ] Criar novo projeto
- [ ] Adicionar membros ao projeto
- [ ] Criar 5 tarefas
- [ ] Distribuir entre colunas
- [ ] Atribuir responsáveis
- [ ] Mover tarefas pelo quadro
- [ ] Marcar tarefas como concluídas
- [ ] Verificar notificações (se implementado)

---

## 📊 PASSO 13: Validação de Performance (5 minutos)

### Testes de Carga

- [ ] Abrir 3-5 abas do sistema simultaneamente
- [ ] Fazer login em cada
- [ ] Navegar entre páginas
- [ ] Sistema continua responsivo

### Cache

- [ ] Navegar para Cursos
- [ ] Voltar para Dashboard
- [ ] Voltar para Cursos
- [ ] Lista carrega instantaneamente (cache funcionando)

### WebSocket

- [ ] Abrir 2 navegadores
- [ ] Login em ambos com usuários diferentes
- [ ] Enviar mensagem de um
- [ ] Mensagem aparece instantaneamente no outro
- [ ] Status "online" funciona

---

## 📱 PASSO 14: Responsividade (10 minutos)

### Desktop (> 1024px)

- [ ] Layout completo visível
- [ ] Sidebar aberta
- [ ] Todos os elementos bem posicionados
- [ ] Imagens em tamanho adequado

### Tablet (768px - 1024px)

- [ ] Redimensionar janela ou usar DevTools
- [ ] Layout se adapta
- [ ] Menu responsivo
- [ ] Cards reorganizam

### Mobile (< 768px)

- [ ] Redimensionar para mobile
- [ ] Menu hamburger aparece
- [ ] Navegação funciona
- [ ] Cards em coluna única
- [ ] Touch funciona

---

## 🔐 PASSO 15: Segurança (5 minutos)

### Autenticação

- [ ] Tentar acessar /api sem token
- [ ] Recebe erro 401
- [ ] Fazer logout
- [ ] Token removido do localStorage
- [ ] Redirecionado para login

### Autorização (Roles)

- [ ] Login como USER (joao@)
- [ ] Tentar criar curso (não deve conseguir)
- [ ] Recebe erro de permissão

- [ ] Login como MANAGER (maria@)
- [ ] Consegue criar curso
- [ ] Operação bem-sucedida

- [ ] Login como ADMIN (admin@)
- [ ] Acessa todas as funcionalidades
- [ ] Sem restrições

### Rate Limiting

- [ ] Fazer muitas requisições rápidas (>1000 em 15min)
- [ ] Receber erro 429 "Too Many Requests"
- [ ] Aguardar window expirar
- [ ] Requisições voltam a funcionar

---

## 🌍 PASSO 16: Internacionalização (5 minutos)

- [ ] Navegar para Configurações
- [ ] Ver opção de idioma
- [ ] Selecionar "Português (Brasil)"
- [ ] Todos os textos em português
- [ ] Erros em português
- [ ] Datas formatadas corretamente
- [ ] Números formatados corretamente

---

## 🐛 PASSO 17: Tratamento de Erros (5 minutos)

### Erros de Validação

- [ ] Tentar fazer login com email inválido
- [ ] Ver mensagem de erro clara
- [ ] Tentar senha muito curta
- [ ] Ver mensagem de erro

### Erros de Rede

- [ ] Parar o backend: `bash sms-control.sh stop backend`
- [ ] Tentar fazer uma ação no frontend
- [ ] Ver mensagem de erro de conexão
- [ ] Reiniciar backend: `bash sms-control.sh start backend`
- [ ] Sistema se recupera

### Erros 404

- [ ] Acessar rota inexistente: http://localhost:3000/pagina-nao-existe
- [ ] Ver página de erro 404
- [ ] Link para voltar ao dashboard funciona

---

## 📊 PASSO 18: GraphQL Playground (5 minutos)

Acesse: http://localhost:4000/graphql

### Query de Cursos

```graphql
query {
  courses {
    id
    title
    category
    difficulty
    xpReward
  }
}
```

- [ ] Query executada
- [ ] Retorna 2 cursos
- [ ] Dados corretos

### Query de Usuário

```graphql
query {
  me {
    id
    email
    firstName
    lastName
    totalXP
    level
  }
}
```

- [ ] Adicionar header: `{"Authorization": "Bearer SEU_TOKEN"}`
- [ ] Query retorna usuário logado
- [ ] Dados corretos

### Mutation de Inscrição

```graphql
mutation {
  enrollInCourse(courseId: "course-1") {
    id
    progress
    enrolledAt
  }
}
```

- [ ] Mutation executada
- [ ] Inscrição criada
- [ ] Progresso inicial 0%

---

## ✅ RESUMO FINAL

### Funcionalidades Testadas

- [ ] ✅ Autenticação (Login/Register/Logout)
- [ ] ✅ Dashboard com métricas
- [ ] ✅ Sistema de gamificação (XP/Níveis/Conquistas)
- [ ] ✅ Plataforma de cursos (Criar/Inscrever/Completar)
- [ ] ✅ Chat em tempo real (Canais/Mensagens/WebSocket)
- [ ] ✅ Calendário (Criar/Visualizar/Responder eventos)
- [ ] ✅ Kanban de projetos (Criar/Mover/Atribuir tasks)
- [ ] ✅ Biblioteca de políticas (Visualizar/Marcar/Reconhecer)
- [ ] ✅ Links úteis (Categorizar/Filtrar/Abrir)

### Segurança Validada

- [ ] ✅ JWT funcionando
- [ ] ✅ RBAC (Admin/Manager/User)
- [ ] ✅ Rate limiting ativo
- [ ] ✅ CORS configurado
- [ ] ✅ Senhas hashadas

### Performance Validada

- [ ] ✅ Cache Redis funcionando
- [ ] ✅ Queries otimizadas
- [ ] ✅ Frontend responsivo
- [ ] ✅ Tempo de resposta < 200ms

### Visual Validado

- [ ] ✅ Cores Maternar aplicadas
- [ ] ✅ Logo visível
- [ ] ✅ Textos em português
- [ ] ✅ Interface profissional

---

## 🎉 CONCLUSÃO

Se todos os itens acima estão marcados, **PARABÉNS!**

Você tem um sistema **Maternar Santa Mariense** 100% funcional e pronto para produção!

### Próximos Passos

1. ✅ Personalizar dados de exemplo
2. ✅ Adicionar seus próprios usuários
3. ✅ Criar cursos reais da sua organização
4. ✅ Configurar backup automático
5. ✅ Preparar deploy em servidor
6. ✅ Treinar equipe no uso do sistema

---

## 📞 Problemas?

Se encontrou algum problema:

1. Consulte [MATERNAR_QUICKSTART.md](MATERNAR_QUICKSTART.md)
2. Veja [INSTALACAO_MANUAL.md](INSTALACAO_MANUAL.md)
3. Execute `bash testar-sistema.sh` para diagnóstico
4. Verifique os logs: `bash sms-control.sh logs`

---

**🏥 Maternar Santa Mariense**  
*Sistema testado e aprovado!* ✅

**Data do Teste**: ___/___/_____  
**Testado por**: ___________________  
**Resultado**: [ ] Aprovado [ ] Pendências

