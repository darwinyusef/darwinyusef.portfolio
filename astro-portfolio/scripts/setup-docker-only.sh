#!/bin/bash

###############################################################################
# Setup 100% con Docker - Sin instalar nada en el host excepto Docker
# Uso: ./setup-docker-only.sh
###############################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
DOMAIN="darwinyusef.com"
WWW_DOMAIN="www.darwinyusef.com"
EMAIL="wsgestor@gmail.com"
PROJECT_DIR="/opt/portfolio/astro-portfolio"

print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}▶ $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
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

print_header "Setup Portfolio - 100% con Docker"

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.production.yml" ]; then
    print_error "Ejecuta este script desde el directorio astro-portfolio"
    exit 1
fi

# 2. Verificar Docker
print_header "Verificando Docker"
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    print_info "Instala Docker primero: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado"
    exit 1
fi

docker --version
docker-compose --version
print_success "Docker está instalado"

# 3. Configurar .env
print_header "Configurando variables de entorno"

if [ ! -f ".env" ]; then
    print_info "Creando archivo .env desde .env.example"
    cp .env.example .env
    print_warning "IMPORTANTE: Edita el archivo .env con tus credenciales"
    nano .env
else
    print_info "Archivo .env ya existe"
fi

# 4. Crear directorios para certbot
print_header "Creando directorios para SSL"
mkdir -p certbot/conf
mkdir -p certbot/www
print_success "Directorios creados"

# 5. Build y Deploy inicial
print_header "Building y desplegando aplicación"

print_info "Deteniendo contenedores anteriores..."
docker-compose -f docker-compose.production.yml down 2>/dev/null || true

print_info "Building imágenes..."
docker-compose -f docker-compose.production.yml build

print_info "Iniciando contenedores..."
docker-compose -f docker-compose.production.yml up -d

print_info "Esperando a que los contenedores inicien..."
sleep 10

# 6. Verificar contenedores
print_header "Verificando contenedores"

if docker ps | grep -q "portfolio-nginx"; then
    print_success "Nginx corriendo"
else
    print_error "Nginx no está corriendo"
    docker logs portfolio-nginx
    exit 1
fi

if docker ps | grep -q "astro-portfolio"; then
    print_success "Portfolio corriendo"
else
    print_error "Portfolio no está corriendo"
    docker logs astro-portfolio
    exit 1
fi

# 7. Obtener certificado SSL
print_header "Configurando SSL con Let's Encrypt"

print_warning "IMPORTANTE: Asegúrate de que tu DNS apunta a este servidor"
print_info "Verifica con: dig $DOMAIN +short"
read -p "¿El DNS está configurado? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Obteniendo certificado SSL..."

    docker-compose -f docker-compose.production.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d $WWW_DOMAIN

    if [ $? -eq 0 ]; then
        print_success "Certificado SSL obtenido"

        print_info "Actualizando configuración de nginx..."
        print_warning "Descomenta la sección HTTPS en nginx-proxy.conf"
        print_warning "y comenta/cambia el location / en HTTP para hacer redirect"

        read -p "Presiona Enter después de editar nginx-proxy.conf..."

        print_info "Recargando nginx..."
        docker-compose -f docker-compose.production.yml restart nginx

        print_success "SSL configurado"
    else
        print_error "Error al obtener certificado SSL"
        print_info "Verifica que el DNS apunta correctamente a este servidor"
    fi
else
    print_warning "Configura el DNS primero y ejecuta:"
    echo "docker-compose -f docker-compose.production.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email $EMAIL --agree-tos -d $DOMAIN -d $WWW_DOMAIN"
fi

# 8. Configurar firewall
print_header "Configurando Firewall"

if command -v ufw &> /dev/null; then
    print_info "Configurando UFW..."
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow ssh
    print_success "Firewall configurado"
else
    print_warning "UFW no está instalado, configurar firewall manualmente"
fi

# 9. Resumen final
print_header "Setup Completado"

echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✨ DEPLOYMENT COMPLETADO ✨                  ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}\n"

print_info "Contenedores corriendo:"
docker ps --filter "label=com.docker.compose.project=portfolio" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n${CYAN}🌐 URLs:${NC}"
echo -e "  ${BLUE}Portfolio:${NC}  http://$DOMAIN (o https:// si SSL está configurado)"
echo -e "  ${BLUE}Servidor:${NC}  http://YOUR_SERVER_IP"

echo -e "\n${CYAN}📋 Comandos útiles:${NC}"
echo -e "  ${BLUE}Ver logs:${NC}          docker-compose -f docker-compose.production.yml logs -f"
echo -e "  ${BLUE}Restart:${NC}           docker-compose -f docker-compose.production.yml restart"
echo -e "  ${BLUE}Stop:${NC}              docker-compose -f docker-compose.production.yml down"
echo -e "  ${BLUE}Renovar SSL:${NC}       docker-compose -f docker-compose.production.yml run --rm certbot renew"

echo -e "\n${GREEN}✅ Todo listo!${NC}\n"
