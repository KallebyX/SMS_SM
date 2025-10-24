#!/bin/bash

# Script para inicializar o banco de dados do Maternar Santa Mariense
# Uso: bash init-database.sh

set -e

echo "🚀 Maternar Santa Mariense - Inicialização do Banco de Dados"
echo "=============================================================="
echo ""

# Verificar se o .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando..."
    bash setup-env.sh
    echo ""
fi

echo "📦 Instalando dependências..."
npm install

echo ""
echo "🔄 Gerando Prisma Client..."
npx prisma generate

echo ""
echo "📊 Executando migrações do banco de dados..."
npx prisma migrate dev --name init

echo ""
echo "🌱 Populando banco de dados com dados iniciais..."
npm run db:seed || tsx scripts/seed.ts

echo ""
echo "✅ Banco de dados inicializado com sucesso!"
echo ""
echo "👥 Usuários criados:"
echo "   - Admin: admin@maternarsm.com.br / admin123"
echo "   - Manager: maria@maternarsm.com.br / user123"
echo "   - User: joao@maternarsm.com.br / user123"
echo ""
echo "📚 Dados de exemplo criados:"
echo "   - 2 cursos com lições"
echo "   - 3 conquistas (achievements)"
echo "   - 2 canais de chat"
echo "   - 2 eventos"
echo "   - 1 projeto com 3 tarefas"
echo "   - 3 políticas"
echo "   - 4 links úteis"
echo ""
echo "🎉 Sistema pronto para uso!"

