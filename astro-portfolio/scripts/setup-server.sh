#!/bin/bash

###############################################################################
# Script de Setup Completo para Servidor DigitalOcean
# Portfolio Astro - Darwin Yusef
#
# Este script automatiza la configuración completa del servidor:
# - Instalación de dependencias
# - Clonación del proyecto
# - Configuración de Docker
# - Configuración de Nginx
# - Configuración de SSL
# - Configuración de Jenkins
#
# Uso: ./setup-server.sh
###############################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables de configuración
DOMAIN="darwinyusef.com"
WWW_DOMAIN="www.darwinyusef.com"
EMAIL="darwin.yusef@gmail.com"  # Para Let's Encrypt
PROJECT_DIR="/opt/portfolio"
GITHUB_REPO="https://github.com/darwinyusef/darwinyusef.portfolio.git"

###############################################################################
# Funciones Auxiliares
###############################################################################

print_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗
║   ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
║   ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
║   ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
║   ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
║   ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝
║                                                               ║
║              Setup Automático - Servidor DigitalOcean        ║
║                        Darwin Yusef                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

print_step() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}▶ $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${CYAN}→ $1${NC}"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Este script debe ejecutarse como root"
        echo "Usa: sudo $0"
        exit 1
    fi
}

ask_confirmation() {
    echo -e "${YELLOW}"
    read -p "$1 (y/n): " -n 1 -r
    echo -e "${NC}"
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Operación cancelada"
        exit 0
    fi
}

###############################################################################
# Main Setup Functions
###############################################################################

show_configuration() {
    print_step "Configuración del Setup"

    cat << EOF
${CYAN}Esta es la configuración que se usará:${NC}

  ${BLUE}Dominio Principal:${NC}     $DOMAIN
  ${BLUE}Dominio WWW:${NC}          $WWW_DOMAIN
  ${BLUE}Email:${NC}                $EMAIL
  ${BLUE}Directorio Proyecto:${NC}  $PROJECT_DIR
  ${BLUE}Repositorio:${NC}          $GITHUB_REPO

EOF

    ask_confirmation "¿Deseas continuar con esta configuración?"
}

update_system() {
    print_step "Actualizando Sistema"

    print_info "Actualizando paquetes..."
    apt update
    apt upgrade -y

    print_success "Sistema actualizado"
}

install_dependencies() {
    print_step "Instalando Dependencias"

    print_info "Instalando paquetes necesarios..."
    apt install -y \
        git \
        curl \
        wget \
        ufw \
        nginx \
        certbot \
        python3-certbot-nginx \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release

    print_success "Dependencias instaladas"
}

install_docker() {
    print_step "Instalando Docker"

    if command -v docker &> /dev/null; then
        print_info "Docker ya está instalado"
        docker --version
    else
        print_info "Instalando Docker..."

        # Agregar Docker GPG key
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

        # Agregar repositorio
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

        # Instalar Docker
        apt update
        apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

        # Habilitar Docker
        systemctl enable docker
        systemctl start docker

        print_success "Docker instalado"
        docker --version
    fi

    # Instalar Docker Compose standalone
    if ! command -v docker-compose &> /dev/null; then
        print_info "Instalando Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        print_success "Docker Compose instalado"
    fi

    docker-compose --version
}

clone_project() {
    print_step "Clonando Proyecto"

    if [ -d "$PROJECT_DIR" ]; then
        print_warning "El directorio $PROJECT_DIR ya existe"
        ask_confirmation "¿Deseas eliminarlo y clonar de nuevo?"

        print_info "Eliminando directorio existente..."
        rm -rf $PROJECT_DIR
    fi

    print_info "Creando directorio..."
    mkdir -p $PROJECT_DIR

    print_info "Clonando repositorio..."
    git clone $GITHUB_REPO $PROJECT_DIR

    print_success "Proyecto clonado en $PROJECT_DIR"
}

configure_env() {
    print_step "Configurando Variables de Entorno"

    cd $PROJECT_DIR/astro-portfolio

    if [ -f ".env" ]; then
        print_warning "El archivo .env ya existe"
        ask_confirmation "¿Deseas sobrescribirlo?"
    fi

    print_info "Copiando .env.example a .env..."
    cp .env.example .env

    print_warning "IMPORTANTE: Edita el archivo .env con tus credenciales"
    print_info "Ubicación: $PROJECT_DIR/astro-portfolio/.env"

    echo -e "\n${YELLOW}Presiona Enter para editar el .env ahora, o Ctrl+C para hacerlo después${NC}"
    read

    nano .env

    print_success "Variables de entorno configuradas"
}

deploy_docker() {
    print_step "Desplegando Aplicación con Docker"

    cd $PROJECT_DIR/astro-portfolio

    print_info "Building y levantando contenedores..."
    docker-compose up -d --build

    print_info "Esperando a que la aplicación inicie..."
    sleep 10

    if docker ps | grep -q astro-portfolio; then
        print_success "Aplicación desplegada exitosamente"

        print_info "Contenedores corriendo:"
        docker ps | grep portfolio
    else
        print_error "Error al desplegar la aplicación"
        print_info "Revisa los logs:"
        docker logs astro-portfolio
        exit 1
    fi
}

configure_nginx() {
    print_step "Configurando Nginx"

    print_info "Creando configuración de Nginx..."

    cat > /etc/nginx/sites-available/portfolio << 'NGINX_EOF'
upstream portfolio_backend {
    server localhost:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER WWW_DOMAIN_PLACEHOLDER;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://portfolio_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

    # Reemplazar placeholders
    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/portfolio
    sed -i "s/WWW_DOMAIN_PLACEHOLDER/$WWW_DOMAIN/g" /etc/nginx/sites-available/portfolio

    print_info "Activando sitio..."
    ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

    print_info "Probando configuración..."
    nginx -t

    print_info "Recargando Nginx..."
    systemctl reload nginx

    print_success "Nginx configurado"
}

configure_ssl() {
    print_step "Configurando SSL con Let's Encrypt"

    print_warning "IMPORTANTE: Asegúrate de que tu dominio apunta a este servidor"
    print_info "Servidor IP: $(curl -s ifconfig.me)"
    print_info "Dominio: $DOMAIN"

    ask_confirmation "¿El DNS está configurado correctamente?"

    print_info "Obteniendo certificado SSL..."

    certbot --nginx \
        -d $DOMAIN \
        -d $WWW_DOMAIN \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --redirect

    if [ $? -eq 0 ]; then
        print_success "SSL configurado exitosamente"
        print_info "Tu sitio está disponible en: https://$DOMAIN"
    else
        print_error "Error al configurar SSL"
        print_warning "Puedes intentar manualmente con:"
        echo "certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
    fi
}

configure_firewall() {
    print_step "Configurando Firewall (UFW)"

    print_info "Configurando reglas de firewall..."

    ufw default deny incoming
    ufw default allow outgoing

    ufw allow ssh
    ufw allow http
    ufw allow https
    ufw allow 8080/tcp  # Jenkins
    ufw allow 9000/tcp  # Minio

    print_warning "El firewall se habilitará en 5 segundos..."
    print_warning "Asegúrate de tener acceso SSH antes de continuar"
    sleep 5

    ufw --force enable

    print_success "Firewall configurado"
    ufw status
}

create_deploy_script() {
    print_step "Creando Script de Deploy"

    cp $PROJECT_DIR/astro-portfolio/scripts/deploy-server.sh /usr/local/bin/portfolio-deploy
    chmod +x /usr/local/bin/portfolio-deploy

    print_success "Script de deploy instalado"
    print_info "Usa: portfolio-deploy"
}

show_summary() {
    print_step "Resumen del Setup"

    echo -e "${GREEN}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                   ✨ SETUP COMPLETADO ✨                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    echo -e "\n${CYAN}📊 Estado de Servicios:${NC}\n"

    # Docker
    if docker ps | grep -q astro-portfolio; then
        print_success "Docker: Corriendo"
    else
        print_error "Docker: No corriendo"
    fi

    # Nginx
    if systemctl is-active --quiet nginx; then
        print_success "Nginx: Activo"
    else
        print_error "Nginx: Inactivo"
    fi

    # SSL
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        print_success "SSL: Configurado"
    else
        print_warning "SSL: No configurado"
    fi

    echo -e "\n${CYAN}🌐 URLs:${NC}\n"
    echo -e "  ${BLUE}Portfolio:${NC}  https://$DOMAIN"
    echo -e "  ${BLUE}Jenkins:${NC}   http://$(curl -s ifconfig.me):8080"
    echo -e "  ${BLUE}Minio:${NC}     http://$(curl -s ifconfig.me):9000"

    echo -e "\n${CYAN}📁 Ubicaciones:${NC}\n"
    echo -e "  ${BLUE}Proyecto:${NC}       $PROJECT_DIR"
    echo -e "  ${BLUE}Nginx Config:${NC}   /etc/nginx/sites-available/portfolio"
    echo -e "  ${BLUE}SSL Certs:${NC}      /etc/letsencrypt/live/$DOMAIN"

    echo -e "\n${CYAN}🔧 Comandos Útiles:${NC}\n"
    echo -e "  ${BLUE}Deploy:${NC}         portfolio-deploy"
    echo -e "  ${BLUE}Logs:${NC}           docker logs -f astro-portfolio"
    echo -e "  ${BLUE}Restart:${NC}        docker restart astro-portfolio"
    echo -e "  ${BLUE}Nginx Test:${NC}     nginx -t"
    echo -e "  ${BLUE}Nginx Reload:${NC}   systemctl reload nginx"

    echo -e "\n${CYAN}📚 Documentación:${NC}\n"
    echo -e "  ${BLUE}README:${NC}         $PROJECT_DIR/astro-portfolio/README.md"
    echo -e "  ${BLUE}Paso a Paso:${NC}   $PROJECT_DIR/astro-portfolio/PASO-A-PASO.md"

    echo -e "\n${GREEN}✅ Todo listo!${NC}\n"
}

###############################################################################
# Main Execution
###############################################################################

main() {
    clear
    print_banner

    check_root
    show_configuration

    update_system
    install_dependencies
    install_docker
    clone_project
    configure_env
    deploy_docker
    configure_nginx
    configure_ssl
    configure_firewall
    create_deploy_script

    show_summary

    print_info "¡Disfruta tu portfolio! 🚀"
}

# Ejecutar
main "$@"
