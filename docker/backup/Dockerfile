FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema necesarias para better-sqlite3
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    curl

# Copiar package files
COPY backend/package.json ./

# Instalar dependencias
RUN npm install && npm cache clean --force

# Copiar código fuente
COPY backend/src/services/backup.js ./src/services/
COPY backend/src/services/database.js ./src/services/
COPY backend/backup-runner.js ./
COPY backend/.env ./.env

# Crear directorios necesarios
RUN mkdir -p /app/data /app/backups

# Instalar crond
RUN apk add --no-cache dcron

# Crear usuario para backups
RUN addgroup -g 1001 -S backups && \
    adduser -S backups -u 1001 && \
    chown -R backups:backups /app

# Copiar crontab
COPY docker/backup/crontab /etc/crontabs/backups

# Script de entrada
COPY docker/backup/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER backups

ENTRYPOINT ["/entrypoint.sh"]
CMD ["crond", "-f", "-l", "2"]
