#!/bin/bash
# Build script para Frontend no Render

set -e

echo "🔧 Instalando dependências..."
npm install

echo "🏗️ Building aplicação..."
npm run build

echo "✅ Build concluído!"
echo "📦 Arquivos em: dist/"

