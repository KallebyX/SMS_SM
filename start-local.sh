#!/bin/bash

echo "🚀 Iniciando Maternar Santa Mariense na rede local..."
echo ""

# Parar processos existentes
pkill -f "npm run dev" 2>/dev/null

# Iniciar Database e Redis
docker-compose up -d database redis

# Aguardar Database ficar saudável
echo "⏳ Aguardando database..."
sleep 5

# Iniciar Backend
echo "🔧 Iniciando Backend na porta 4000..."
cd enterprise/backend
npm run dev > ../../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Aguardar Backend iniciar
sleep 3

# Iniciar Frontend
echo "🌐 Iniciando Frontend na porta 3000..."
cd enterprise/frontend
npm run dev -- --host 0.0.0.0 > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

# Aguardar iniciar
sleep 5

# Mostrar IP local
IP=$(ipconfig getifaddr en0 2>/dev/null || ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo ""
echo "✅ Sistema iniciado!"
echo ""
echo "📍 URLs na rede local:"
echo ""
echo "🌐 Frontend: http://${IP}:3000"
echo "🔧 Backend:  http://${IP}:4000"
echo "📊 Health:   http://${IP}:4000/health"
echo ""
echo "📍 URLs localhost:"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:4000"
echo ""
echo "🔑 Login de Teste:"
echo "Email: admin@maternarsm.com.br"
echo "Senha: admin123"
echo ""
echo "📝 Para parar o sistema:"
echo "   pkill -f 'npm run dev'"
echo "   docker-compose down"
echo ""
echo "🔍 Ver logs:"
echo "   tail -f logs/backend.log"
echo "   tail -f logs/frontend.log"
echo ""

# Salvar PIDs
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

