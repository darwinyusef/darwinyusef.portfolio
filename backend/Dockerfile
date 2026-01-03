# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Copiar package files
COPY package.json package-lock.json* ./

# Instalar dependencias con npm install
RUN npm install && \
    npm cache clean --force

# ========================================
# Stage 2: Runtime
# ========================================
FROM node:20-alpine AS runtime
WORKDIR /app

# Instalar curl para health checks
RUN apk add --no-cache curl

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar node_modules desde deps
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Copiar código fuente
COPY src ./src

# Crear directorio para datos
RUN mkdir -p /app/data && \
    chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Ejecutar aplicación
CMD ["node", "src/server.js"]
