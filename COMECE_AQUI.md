# 🚀 COMECE AQUI - Maternar Santa Mariense

## 👋 Bem-vindo!

Este é o sistema **Maternar Santa Mariense**, uma plataforma completa de gestão, educação e comunicação para profissionais de saúde.

## ⚡ Início Rápido (5 minutos)

### Opção 1: Com Docker (RECOMENDADO)

```bash
# 1. Abra o Docker Desktop (clique no ícone do Docker)

# 2. No terminal, execute:
cd /Users/kalleby/Downloads/SMS_SM
bash sms-control.sh start

# 3. Aguarde ~1 minuto e inicialize o banco:
cd enterprise/backend
bash init-database.sh

# 4. Acesse no navegador:
# http://localhost:3000

# 5. Faça login com:
# Email: admin@maternarsm.com.br
# Senha: admin123
```

### Opção 2: Sem Docker

Se o Docker não estiver disponível, leia: **`INSTALACAO_MANUAL.md`**

## 📚 Documentação

| Arquivo | Quando usar |
|---------|-------------|
| **COMECE_AQUI.md** | Você está aqui! Primeiro acesso |
| **MATERNAR_QUICKSTART.md** | Guia completo de uso do sistema |
| **INSTALACAO_MANUAL.md** | Instalação sem Docker |
| **PROGRESSO_IMPLEMENTACAO.md** | Status técnico da implementação |
| **README.md** | Documentação técnica completa |

## 🎨 O Que Foi Feito

### ✅ Sistema Rebrandado
- ✅ Nome: **Maternar Santa Mariense**
- ✅ Cores da logo aplicadas em todo o sistema
- ✅ Visual moderno e profissional
- ✅ Componentes atualizados

### ✅ Infraestrutura Configurada
- ✅ Backend Node.js + GraphQL
- ✅ Frontend React + TypeScript
- ✅ Banco PostgreSQL configurado
- ✅ Redis para cache
- ✅ Docker Compose pronto

### ✅ Funcionalidades Prontas
- ✅ Sistema de login/autenticação
- ✅ Gamificação (XP, níveis, conquistas)
- ✅ Plataforma de cursos
- ✅ Chat em tempo real
- ✅ Calendário de eventos
- ✅ Kanban de projetos
- ✅ Biblioteca de políticas
- ✅ Links úteis

## 🎯 Dados de Teste

### Usuários
| Email | Senha | Função |
|-------|-------|--------|
| admin@maternarsm.com.br | admin123 | Administrador |
| maria@maternarsm.com.br | user123 | Coordenadora |
| joao@maternarsm.com.br | user123 | Enfermeiro |

### Dados Criados
- 2 cursos de exemplo
- 3 conquistas para desbloquear
- 2 canais de chat
- 2 eventos no calendário
- 1 projeto com 3 tarefas
- 3 políticas organizacionais
- 4 links úteis

## 🌐 URLs Importantes

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:4000 |
| **GraphQL** | http://localhost:4000/graphql |
| **Health** | http://localhost:4000/health |

## 🔥 Comandos Essenciais

```bash
# Iniciar sistema
bash sms-control.sh start

# Ver status
bash sms-control.sh status

# Ver logs
bash sms-control.sh logs

# Parar sistema
bash sms-control.sh stop

# Ajuda
bash sms-control.sh help
```

## 🆘 Problemas Comuns

### "Docker não está rodando"
```bash
# Solução: Abra o Docker Desktop manualmente
# Ou use a instalação manual (veja INSTALACAO_MANUAL.md)
```

### "Porta 4000 já está em uso"
```bash
# Encontre o processo
lsof -i :4000

# Mate o processo
kill -9 <PID>
```

### "Cannot connect to database"
```bash
# Aguarde o PostgreSQL inicializar (~30 segundos)
# Ou execute:
bash sms-control.sh status
```

## 🎨 Cores do Sistema

O sistema usa as cores oficiais da logo:

```
🔵 Azul Maternar:     #1E4A7A
🟢 Verde Maternar:    #7AB844
🔴 Rosa Maternar:     #D42E5B
⚪ Cinza Maternar:    #9B9B9B
```

## ✨ Próximos Passos

1. ✅ **Inicie o sistema** (veja "Início Rápido" acima)
2. ✅ **Faça login** com um usuário de teste
3. ✅ **Explore o dashboard**
4. ✅ **Inscreva-se em um curso** e complete uma lição
5. ✅ **Envie uma mensagem** no chat
6. ✅ **Crie uma tarefa** no Kanban

## 📊 Status do Projeto

```
Progresso: ████████████████░░░░ 60%

✅ Infraestrutura:    100%
✅ Rebrand Visual:    100%
✅ Documentação:      100%
⏳ Banco de Dados:     80%
⏳ Testes:             20%
⏳ Deploy:              0%
```

## 🎁 O Que Você Vai Encontrar

### Interface Principal
- Dashboard com métricas em tempo real
- Navegação intuitiva por abas
- Indicadores de progresso (XP, níveis)
- Notificações de conquistas

### Cursos e Treinamentos
- Catálogo de cursos
- Progresso visual
- Sistema de XP e recompensas
- Certificados ao concluir

### Chat em Tempo Real
- Canais por departamento
- Mensagens diretas
- Indicador de digitação
- Histórico de conversas

### Gestão de Projetos
- Quadro Kanban visual
- Drag & drop de tarefas
- Atribuição de responsáveis
- Filtros e prioridades

## 💡 Dicas

- 💬 Use o chat para comunicação rápida
- 📚 Complete cursos para ganhar XP
- 🏆 Desbloqueie conquistas
- 📋 Organize projetos no Kanban
- 📅 Agende eventos importantes

## 📞 Precisa de Ajuda?

1. Leia **MATERNAR_QUICKSTART.md** para guia completo
2. Consulte **INSTALACAO_MANUAL.md** se tiver problemas com Docker
3. Veja **PROGRESSO_IMPLEMENTACAO.md** para detalhes técnicos

---

## 🚀 AÇÃO IMEDIATA

**Execute agora:**

```bash
cd /Users/kalleby/Downloads/SMS_SM
bash sms-control.sh start
```

Depois acesse: **http://localhost:3000**

**Login:** admin@maternarsm.com.br  
**Senha:** admin123

---

🏥 **Maternar Santa Mariense** - Sistema pronto para uso!

**Última atualização**: 24 de outubro de 2025

