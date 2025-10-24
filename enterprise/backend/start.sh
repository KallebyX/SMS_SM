#!/bin/bash
# Start script para Render

set -e

echo "🗄️ Executando migrations..."
npx prisma migrate deploy

echo "🌱 Populando banco de dados (se necessário)..."
npm run db:seed || echo "⚠️  Seeds já executados ou falharam (ignorando)"

echo "🚀 Iniciando servidor..."
node dist/index.js

