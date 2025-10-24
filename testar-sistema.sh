#!/bin/bash

# Script de Teste do Sistema Maternar Santa Mariense
# Uso: bash testar-sistema.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🏥 MATERNAR SANTA MARIENSE - Sistema de Testes   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para testar endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testando $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FALHOU${NC} (HTTP $response, esperado $expected_status)"
        return 1
    fi
}

# Função para testar serviço
test_service() {
    local name=$1
    local port=$2
    
    echo -n "Testando $name (porta $port)... "
    
    if nc -z localhost $port 2>/dev/null; then
        echo -e "${GREEN}✓ Rodando${NC}"
        return 0
    else
        echo -e "${RED}✗ Não disponível${NC}"
        return 1
    fi
}

echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 1: Testando Serviços Básicos${NC}"
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo ""

test_service "PostgreSQL" 5432
test_service "Redis" 6379
test_service "Backend" 4000
test_service "Frontend" 3000

echo ""
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 2: Testando Endpoints do Backend${NC}"
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Health Check" "http://localhost:4000/health"
test_endpoint "API Root" "http://localhost:4000/"
test_endpoint "API Info" "http://localhost:4000/api"

echo ""
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 3: Testando Autenticação${NC}"
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo ""

echo -n "Testando Login (admin@maternarsm.com.br)... "

login_response=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maternarsm.com.br","password":"admin123"}' \
  2>/dev/null)

if echo "$login_response" | grep -q "token"; then
    echo -e "${GREEN}✓ OK${NC}"
    TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo -e "  Token obtido: ${TOKEN:0:50}..."
else
    echo -e "${RED}✗ FALHOU${NC}"
    echo "  Resposta: $login_response"
fi

echo ""
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 4: Testando GraphQL${NC}"
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo ""

if [ -n "$TOKEN" ]; then
    echo -n "Testando Query GraphQL (courses)... "
    
    graphql_response=$(curl -s -X POST http://localhost:4000/graphql \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"query":"query { courses { id title category } }"}' \
      2>/dev/null)
    
    if echo "$graphql_response" | grep -q "courses"; then
        echo -e "${GREEN}✓ OK${NC}"
        course_count=$(echo "$graphql_response" | grep -o '"id"' | wc -l)
        echo -e "  Cursos encontrados: $course_count"
    else
        echo -e "${RED}✗ FALHOU${NC}"
        echo "  Resposta: ${graphql_response:0:200}..."
    fi
    
    echo -n "Testando Query GraphQL (me)... "
    
    me_response=$(curl -s -X POST http://localhost:4000/graphql \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"query":"query { me { id email firstName lastName totalXP level } }"}' \
      2>/dev/null)
    
    if echo "$me_response" | grep -q "firstName"; then
        echo -e "${GREEN}✓ OK${NC}"
        first_name=$(echo "$me_response" | grep -o '"firstName":"[^"]*' | cut -d'"' -f4)
        echo -e "  Usuário: $first_name"
    else
        echo -e "${RED}✗ FALHOU${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Pulando testes GraphQL (token não obtido)${NC}"
fi

echo ""
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  FASE 5: Testando Frontend${NC}"
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Frontend Root" "http://localhost:3000"

echo ""
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  RESUMO DOS TESTES${NC}"
echo -e "${YELLOW}══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}URLs de Acesso:${NC}"
echo -e "  🌐 Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "  🔧 Backend:   ${GREEN}http://localhost:4000${NC}"
echo -e "  📊 GraphQL:   ${GREEN}http://localhost:4000/graphql${NC}"
echo -e "  ❤️  Health:    ${GREEN}http://localhost:4000/health${NC}"
echo ""

echo -e "${BLUE}Usuários de Teste:${NC}"
echo -e "  👤 Admin:    ${GREEN}admin@maternarsm.com.br${NC} / admin123"
echo -e "  👤 Manager:  ${GREEN}maria@maternarsm.com.br${NC} / user123"
echo -e "  👤 User:     ${GREEN}joao@maternarsm.com.br${NC} / user123"
echo ""

echo -e "${BLUE}Próximos Passos:${NC}"
echo -e "  1. Abra ${GREEN}http://localhost:3000${NC} no navegador"
echo -e "  2. Faça login com um dos usuários acima"
echo -e "  3. Explore o sistema!"
echo ""

echo -e "${GREEN}✨ Testes concluídos!${NC}"
echo -e "${BLUE}🏥 Maternar Santa Mariense pronto para uso!${NC}"

