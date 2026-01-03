# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./

RUN npm install && \
    npm cache clean --force

# ========================================
# Stage 2: Build
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build de producción
ENV NODE_ENV=production
RUN npm run build

# ========================================
# Stage 3: Runtime (Node.js para SSR)
# ========================================
FROM node:20-alpine AS runtime
WORKDIR /app

# Instalar curl para health checks
RUN apk add --no-cache curl

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar el build y los node_modules necesarios para ejecución
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Ajustar permisos para el usuario no-root
RUN chown -R nodejs:nodejs /app
USER nodejs

# Variables de entorno para el servidor de Astro
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production

# Exponer el puerto de Astro
EXPOSE 8080

# Health check (apuntando al puerto 8080)
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Ejecutar el servidor SSR de Astro
CMD ["node", "./dist/server/entry.mjs"]