# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments
ARG NODE_ENV=production
ARG DATABASE_URL
ARG REDIS_URL
ARG JWT_SECRET
ARG SENTRY_DSN

ENV NODE_ENV=$NODE_ENV
ENV DATABASE_URL=$DATABASE_URL
ENV REDIS_URL=$REDIS_URL
ENV JWT_SECRET=$JWT_SECRET
ENV SENTRY_DSN=$SENTRY_DSN

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Security: Run as non-root user
USER nodejs

EXPOSE 4000

# Labels for metadata
LABEL maintainer="SMS-SM Enterprise Team <enterprise@sms-sm.health>"
LABEL version="2.0.0"
LABEL description="SMS-SM Enterprise Backend API"
LABEL org.opencontainers.image.source="https://github.com/your-org/sms-sm-enterprise"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]