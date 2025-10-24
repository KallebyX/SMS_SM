#!/bin/bash
# Build script para Render

set -e

echo "🔧 Instalando dependências..."
npm install

echo "🗄️ Gerando Prisma Client..."
npx prisma generate

echo "🏗️ Compilando TypeScript..."
npm run build

echo "✅ Build concluído!"

