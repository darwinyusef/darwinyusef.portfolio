#!/bin/bash

# ================================
# Script de inicio rápido
# ================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Astro Portfolio - Docker${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Función para verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker no está instalado${NC}"
        echo "Instala Docker desde: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: Docker Compose no está instalado${NC}"
        echo "Instala Docker Compose desde: https://docs.docker.com/compose/install/"
        exit 1
    fi

    echo -e "${GREEN}✓ Docker y Docker Compose están instalados${NC}"
}

# Función para mostrar el menú
show_menu() {
    echo ""
    echo -e "${YELLOW}Selecciona una opción:${NC}"
    echo "1) Desarrollo (con hot reload)"
    echo "2) Producción (optimizado)"
    echo "3) Detener todos los contenedores"
    echo "4) Ver logs"
    echo "5) Limpiar todo"
    echo "6) Ver estado"
    echo "7) Salir"
    echo ""
    read -p "Opción: " option
}

# Desarrollo
start_dev() {
    echo -e "${GREEN}Iniciando entorno de desarrollo...${NC}"
    docker-compose -f docker-compose.dev.yml up --build
}

# Producción
start_prod() {
    echo -e "${GREEN}Iniciando en producción...${NC}"
    docker-compose up -d --build
    echo ""
    echo -e "${GREEN}✓ Aplicación iniciada en http://localhost:3000${NC}"
    echo "Para ver logs: docker-compose logs -f"
}

# Detener
stop_all() {
    echo -e "${YELLOW}Deteniendo contenedores...${NC}"
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    echo -e "${GREEN}✓ Contenedores detenidos${NC}"
}

# Logs
show_logs() {
    echo -e "${BLUE}Mostrando logs (Ctrl+C para salir)...${NC}"
    docker-compose logs -f 2>/dev/null || docker-compose -f docker-compose.dev.yml logs -f 2>/dev/null || echo -e "${RED}No hay contenedores activos${NC}"
}

# Limpiar
clean_all() {
    echo -e "${YELLOW}¿Estás seguro de que quieres limpiar todo? (y/n)${NC}"
    read -p "> " confirm
    if [ "$confirm" = "y" ]; then
        echo -e "${RED}Limpiando contenedores, volúmenes e imágenes...${NC}"
        docker-compose down -v --rmi all 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down -v --rmi all 2>/dev/null || true
        docker system prune -f
        echo -e "${GREEN}✓ Limpieza completada${NC}"
    fi
}

# Estado
show_status() {
    echo -e "${BLUE}Estado de contenedores:${NC}"
    docker ps -a | grep portfolio || echo "No hay contenedores de portfolio"
    echo ""
    echo -e "${BLUE}Imágenes:${NC}"
    docker images | grep portfolio || echo "No hay imágenes de portfolio"
}

# Main
check_docker

while true; do
    show_menu

    case $option in
        1)
            start_dev
            ;;
        2)
            start_prod
            ;;
        3)
            stop_all
            ;;
        4)
            show_logs
            ;;
        5)
            clean_all
            ;;
        6)
            show_status
            ;;
        7)
            echo -e "${GREEN}¡Hasta luego!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            ;;
    esac
done
