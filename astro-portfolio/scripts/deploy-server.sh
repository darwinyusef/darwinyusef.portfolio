#!/bin/bash

###############################################################################
# Script de Deployment para Servidor DigitalOcean
# Servidor: YOUR_SERVER_IP
# Uso: ./deploy-server.sh
###############################################################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
REPO_DIR="/opt/portfolio"
APP_DIR="$REPO_DIR/astro-portfolio"
BACKUP_DIR="/opt/backups/portfolio"
DATE=$(date +%Y%m%d_%H%M%S)

###############################################################################
# Funciones
###############################################################################

print_header() {
    echo -e "${BLUE}"
    echo "═══════════════════════════════════════════════════════"
    echo "  $1"
    echo "═══════════════════════════════════════════════════════"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 no está instalado"
        exit 1
    fi
}

###############################################################################
# Pre-checks
###############################################################################

print_header "Verificando requisitos"

check_command git
check_command docker
check_command docker-compose

print_success "Todos los comandos necesarios están instalados"

###############################################################################
# Backup
###############################################################################

print_header "Creando backup"

# Crear directorio de backups
mkdir -p $BACKUP_DIR

# Backup del .env si existe
if [ -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env" "$BACKUP_DIR/.env-$DATE"
    print_success "Backup de .env creado"
fi

# Backup del contenedor actual si está corriendo
if docker ps | grep -q astro-portfolio; then
    print_info "Guardando logs del contenedor actual..."
    docker logs astro-portfolio > "$BACKUP_DIR/logs-$DATE.txt" 2>&1
    print_success "Logs guardados"
fi

###############################################################################
# Git Pull
###############################################################################

print_header "Actualizando código desde GitHub"

cd $REPO_DIR

# Guardar cambios locales si hay
if [[ -n $(git status -s) ]]; then
    print_info "Hay cambios locales, guardando stash..."
    git stash
fi

# Pull latest changes
git fetch origin
git pull origin main

print_success "Código actualizado"

###############################################################################
# Docker Build
###############################################################################

print_header "Construyendo nueva imagen Docker"

cd $APP_DIR

# Detener contenedor actual
if docker ps | grep -q astro-portfolio; then
    print_info "Deteniendo contenedor actual..."
    docker-compose down
    print_success "Contenedor detenido"
fi

# Limpiar imágenes antiguas
print_info "Limpiando imágenes antiguas..."
docker image prune -f > /dev/null 2>&1

# Build nueva imagen
print_info "Construyendo imagen (esto puede tomar algunos minutos)..."
docker-compose build --no-cache

print_success "Imagen construida exitosamente"

###############################################################################
# Deploy
###############################################################################

print_header "Desplegando aplicación"

# Iniciar contenedor
docker-compose up -d

# Esperar a que el contenedor inicie
print_info "Esperando a que el contenedor inicie..."
sleep 5

# Verificar estado
if docker ps | grep -q astro-portfolio; then
    print_success "Contenedor iniciado correctamente"
else
    print_error "Error al iniciar contenedor"
    print_info "Logs del contenedor:"
    docker logs astro-portfolio
    exit 1
fi

###############################################################################
# Health Check
###############################################################################

print_header "Verificando salud del contenedor"

# Esperar a que la aplicación esté lista
MAX_TRIES=30
COUNTER=0

while [ $COUNTER -lt $MAX_TRIES ]; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Aplicación respondiendo correctamente"
        break
    fi

    COUNTER=$((COUNTER + 1))
    if [ $COUNTER -eq $MAX_TRIES ]; then
        print_error "La aplicación no responde después de $MAX_TRIES intentos"
        print_info "Logs del contenedor:"
        docker logs --tail 50 astro-portfolio
        exit 1
    fi

    echo -n "."
    sleep 1
done
echo ""

###############################################################################
# Cleanup
###############################################################################

print_header "Limpieza"

# Limpiar contenedores detenidos
docker container prune -f > /dev/null 2>&1
print_success "Contenedores detenidos eliminados"

# Limpiar imágenes sin usar
docker image prune -f > /dev/null 2>&1
print_success "Imágenes sin usar eliminadas"

# Limpiar backups antiguos (mantener últimos 7 días)
if [ -d "$BACKUP_DIR" ]; then
    find "$BACKUP_DIR" -name "*.env-*" -mtime +7 -delete
    find "$BACKUP_DIR" -name "logs-*.txt" -mtime +7 -delete
    print_success "Backups antiguos limpiados"
fi

###############################################################################
# Información final
###############################################################################

print_header "Deployment Completado"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   ✨ DEPLOYMENT EXITOSO ✨            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

print_info "Información del contenedor:"
docker ps | grep astro-portfolio

echo ""
print_info "URLs disponibles:"
echo "  • Local: http://localhost:3000"
echo "  • Servidor: http://YOUR_SERVER_IP:3000"
echo "  • Producción: https://darwinyusef.com (cuando nginx esté configurado)"

echo ""
print_info "Comandos útiles:"
echo "  • Ver logs: docker logs -f astro-portfolio"
echo "  • Reiniciar: docker restart astro-portfolio"
echo "  • Detener: docker-compose down"
echo "  • Stats: docker stats astro-portfolio"

echo ""
print_info "Últimas 20 líneas de logs:"
docker logs --tail 20 astro-portfolio

echo ""
print_success "Deployment completado en: $(date)"
echo ""
