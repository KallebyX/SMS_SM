# 🚀 Como Usar GitHub Copilot para Resolver Issues Automaticamente

## Configuração Inicial

### 1. Configurar GitHub Token

```bash
# No terminal
export GITHUB_TOKEN=ghp_seu_token_aqui

# Ou adicionar ao .bashrc/.zshrc
echo 'export GITHUB_TOKEN=ghp_seu_token_aqui' >> ~/.zshrc
source ~/.zshrc
```

### 2. Executar Script de Criação de Issues

```bash
cd /Users/kalleby/Downloads/SMS_SM
chmod +x .github/scripts/create-issues.sh
./github/scripts/create-issues.sh
```

---

## Uso com GitHub Copilot

### 1. Abrir Issue no GitHub

1. Acesse: https://github.com/KallebyX/SMS_SM/issues
2. Escolha um issue (ex: "Integrar Training.tsx")
3. Copie a descrição do issue

### 2. Usar Copilot no VSCode

```typescript
// Cole a descrição do issue aqui como comentário
// GitHub Copilot vai entender o contexto e implementar

/**
 * ISSUE: Integrar Training.tsx com useCourses
 * Tasks:
 * - Importar useCourses hook
 * - Substituir array courses hardcoded
 * - Conectar botão Iniciar à mutation
 */

// Agora comece a implementar e o Copilot vai ajudar
import { useCourses } from '../hooks/useCourses' // Copilot sugere isso automaticamente

const Training: React.FC = () => {
  // Copilot vai sugerir o código baseado no issue
```

### 3. Prompt Direto para Copilot

No VSCode, pressione `Cmd+I` e digite:

```
Implementar integração da página Training.tsx com useCourses hook:
- Importar useCourses
- Substituir cursos mock por dados reais
- Conectar botão "Iniciar" à mutation enroll()
- Adicionar loading e error states
```

---

## Template de Issue para Copilot

### Para criar novas issues otimizadas para Copilot:

```markdown
## Implementar: [NOME_DA_PÁGINA]

### Contexto
Página atual usa dados mock hardcoded. Precisa conectar ao backend GraphQL.

### Dados Necessários
- Hook: use[Nome] (ex: useCourses)
- Query: GET_[RECURSO]S
- Mutation: [ACTION]_[RECURSO]

### Código Exemplo
\`\`\`typescript
import { useCourses } from '../hooks/useCourses'

const Component: React.FC = () => {
  const { courses, loading, enroll } = useCourses()
  // Copilot vai completar
}
\`\`\`

### Tasks
- [ ] Importar hook
- [ ] Substituir dados mock
- [ ] Conectar mutations
- [ ] Adicionar loading/error
- [ ] Testar
```

---

## Ordem de Resolução com Copilot

### Prioridade Alta (faça primeiro com Copilot)

1. **Training.tsx**
   - Abrir arquivo
   - Pedir ao Copilot: "Integrar useCourses hook aqui"
   - Copilot implementa automaticamente

2. **Projects.tsx**
   - "Integrar useProjects e CRUD completo"
   - Copilot sugere mutations necessárias

3. **Calendar.tsx**
   - "Conectar useCalendar e CreateEventModal"
   - Copilot adiciona mutations

### Prioridade Média

4. **Gamification.tsx**
   - "Mostrar conquistas e XP reais"
   - Copilot busca do backend

5. **Chat.tsx**
   - "Chat em tempo real com WebSocket"
   - Copilot implementa subscriptions

6. **Policies.tsx**
   - "Integrar visualização PDF"
   - Copilot adiciona mutations

7. **Settings.tsx**
   - "Salvar configurações"
   - Copilot implementa UPDATE_PROFILE

8. **Analytics.tsx**
   - "Gráficos com dados reais"
   - Copilot busca métricas

### Prioridade Baixa

9. **Links.tsx**
   - "Substituir links mock"
   - Implementação simples

10. **Admin.tsx**
    - "CRUD de usuários"
    - Mais complexo, Copilot em etapas

---

## Comandos Úteis para Copilot

### No VSCode Chat (Cmd+L)

```
Implementar: Página Training usando useCourses hook, 
substituindo dados mock por queries GraphQL reais,
adicionando loading states e error handling.
```

```
Refatorar: Conectar Projects.tsx ao backend,
implementando CRUD completo de projetos e tarefas.
```

### Comandos de Terminal

```bash
# Criar branch para issue específica
git checkout -b feature/integrate-training

# Fazer commit depois que Copilot implementar
git add enterprise/frontend/src/pages/Training.tsx
git commit -m "feat: Integrar Training com useCourses"

# Push e criar PR
git push origin feature/integrate-training
gh pr create --title "Integrar Training.tsx com backend" --body "$(cat ISSUES_GRAPHQL_INTEGRACAO.md)"
```

---

## Workflow Recomendado

1. **Escolher issue** do GitHub
2. **Criar branch**: `git checkout -b issue/NUMERO-DESCRICAO`
3. **Abrir arquivo** no VSCode
4. **Pedir ao Copilot**: "Implementar conforme issue #[número]"
5. **Copilot implementa** automaticamente
6. **Testar** a implementação
7. **Commit e Push**
8. **Marcar checklist** no issue

---

## Dicas de Prompt para Copilot

### Para queries:
```
Criar query GraphQL para buscar cursos:
- Incluir: id, title, description, thumbnail, category
- Incluir relacionamento: enrollment com progress
- Filtrável por category
```

### Para mutations:
```
Criar mutation para inscrever-se em curso:
- Input: courseId
- Retornar: enrollment com progress inicializado
- Adicionar ao cache do Apollo
```

### Para hooks:
```
Criar hook useCourses que:
- Busca todos os cursos com GET_COURSES
- Permite inscrição com ENROLL_IN_COURSE
- Mostra loading state
- Trata erros graciosamente
```

---

## Resultado Esperado

Após usar Copilot para todas as issues:

✅ Todas as 10 páginas integradas
✅ Sistema 100% funcional com backend real
✅ Zero dados mock
✅ WebSocket funcionando
✅ CRUD completo

**Tempo estimado**: 2-3 horas com Copilot (vs 6-8 manual)

