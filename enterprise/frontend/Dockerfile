# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments
ARG NODE_ENV=production
ARG VITE_API_URL
ARG VITE_GRAPHQL_URL
ARG VITE_CDN_URL
ARG VITE_SENTRY_DSN
ARG BUILD_NUMBER
ARG COMMIT_HASH

ENV NODE_ENV=$NODE_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
ENV VITE_CDN_URL=$VITE_CDN_URL
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN
ENV VITE_BUILD_NUMBER=$BUILD_NUMBER
ENV VITE_COMMIT_HASH=$COMMIT_HASH

# Build the application
RUN npm run build

# Production image with nginx
FROM nginx:alpine AS runner

# Install security updates
RUN apk add --no-cache --upgrade bash curl

# Create nginx user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Security: Run as non-root user
USER nginx

EXPOSE 80

# Labels for metadata
LABEL maintainer="SMS-SM Enterprise Team <enterprise@sms-sm.health>"
LABEL version="2.0.0"
LABEL description="SMS-SM Enterprise Frontend"
LABEL org.opencontainers.image.source="https://github.com/your-org/sms-sm-enterprise"

CMD ["nginx", "-g", "daemon off;"]