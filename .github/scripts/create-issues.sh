#!/bin/bash

# Script para criar issues automaticamente no GitHub
# Uso: ./create-issues.sh

# Configurações
REPO="KallebyX/SMS_SM"
GITHUB_TOKEN="${GITHUB_TOKEN:-your_token_here}"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Criando issues no GitHub...${NC}\n"

# Verificar se o token está configurado
if [ "$GITHUB_TOKEN" = "your_token_here" ]; then
  echo -e "${RED}❌ Token do GitHub não configurado!${NC}"
  echo "Configure: export GITHUB_TOKEN=seu_token"
  exit 1
fi

# Função para criar issue
create_issue() {
  local title=$1
  local body=$2
  local labels=$3

  echo -e "${YELLOW}📝 Criando issue: $title${NC}"

  curl -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$REPO/issues" \
    -d "{
      \"title\": \"$title\",
      \"body\": \"$body\",
      \"labels\": [$labels]
    }" | jq -r '.html_url'

  echo ""
}

# Issues principais (exemplos)
# Você pode expandir com todas do arquivo YAML acima

create_issue "🔴 Integrar Training.tsx com useCourses" \
  "## Descrição
Integrar a página de Training com o hook useCourses para buscar cursos reais do backend GraphQL.

## Tasks
- [ ] Importar useCourses hook
- [ ] Substituir array courses hardcoded
- [ ] Conectar botão Iniciar à mutation
- [ ] Adicionar loading states

## Arquivos
- enterprise/frontend/src/pages/Training.tsx

## Priority: 🔴 High" \
  '"frontend", "graphql", "priority:high", "training"'

create_issue "🔴 Integrar Projects.tsx com useProjects - CRUD" \
  "## Descrição
Conectar Projects ao backend GraphQL para operações CRUD completas.

## Tasks
- [ ] Importar useProjects hook
- [ ] Substituir dados mock
- [ ] Conectar CreateProjectModal
- [ ] Implementar Kanban real
- [ ] Testar CRUD completo

## Priority: 🔴 High" \
  '"frontend", "graphql", "priority:high", "projects"'

create_issue "🔴 Integrar Calendar.tsx com useCalendar" \
  "## Descrição
Conectar calendário ao backend para eventos reais.

## Tasks
- [ ] Importar useCalendar
- [ ] Substituir events mock
- [ ] Conectar CreateEventModal
- [ ] Implementar filtros

## Priority: 🔴 High" \
  '"frontend", "graphql", "priority:high", "calendar"'

echo -e "${GREEN}✅ Issues criadas com sucesso!${NC}"
echo "Verifique em: https://github.com/$REPO/issues"

