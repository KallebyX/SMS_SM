FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache dumb-init

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copiar código fonte
COPY --chown=nodejs:nodejs . .

# Build da aplicação
RUN npm run build

# Criar diretório de logs
RUN mkdir -p logs && chown nodejs:nodejs logs

# Trocar para usuário não-root
USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

EXPOSE 3002

# Usar dumb-init para melhor handling de sinais
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]