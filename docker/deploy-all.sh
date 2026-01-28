#!/bin/bash

set -e

SERVICES_DIR="/opt/darwinyusef.portfolio/docker/services"
COMPOSE="docker compose"

echo "🚀 Iniciando despliegue de todos los servicios..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para verificar salud del contenedor
check_health() {
    local container=$1
    local max_wait=60
    local elapsed=0

    echo -n "⏳ Esperando que $container esté saludable..."

    while [ $elapsed -lt $max_wait ]; do
        health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "none")

        if [ "$health" = "healthy" ]; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        elif [ "$health" = "none" ]; then
            # Sin healthcheck, solo verificar que esté running
            state=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "not-found")
            if [ "$state" = "running" ]; then
                echo -e " ${GREEN}✓ (running)${NC}"
                return 0
            fi
        fi

        sleep 2
        elapsed=$((elapsed + 2))
        echo -n "."
    done

    echo -e " ${RED}✗ Timeout${NC}"
    return 1
}

# 1. Crear red si no existe
echo ""
echo "📡 Verificando red portfolio-network..."
if ! docker network inspect portfolio-network >/dev/null 2>&1; then
    docker network create portfolio-network
    echo -e "${GREEN}✓ Red creada${NC}"
else
    echo -e "${GREEN}✓ Red existe${NC}"
fi

# 2. Servicios de infraestructura (sin dependencias)
echo ""
echo "🔧 Desplegando servicios de infraestructura..."

# MinIO
echo ""
echo "📦 Desplegando MinIO..."
$COMPOSE -f "$SERVICES_DIR/minio.yml" up -d
check_health "portfolio-minio"

# DuckDB
echo ""
echo "📊 Desplegando DuckDB..."
$COMPOSE -f "$SERVICES_DIR/duckdb.yml" up -d
check_health "portfolio-duckdb"

# n8n
echo ""
echo "🤖 Desplegando n8n..."
$COMPOSE -f "$SERVICES_DIR/n8n.yml" up -d
check_health "n8n"

# 3. Backend (depende de MinIO)
echo ""
echo "🔌 Desplegando Backend..."
$COMPOSE -f "$SERVICES_DIR/backend-darwinyusef.yml" up -d
check_health "portfolio-backend"

# 4. Frontends
echo ""
echo "🎨 Desplegando Frontends..."

echo ""
echo "🌐 Desplegando Frontend Portfolio..."
$COMPOSE -f "$SERVICES_DIR/frontend-darwinyusef.yml" up -d
check_health "astro-portfolio"

echo ""
echo "🌐 Desplegando AquiCreamos..."
$COMPOSE -f "$SERVICES_DIR/aquicreamos.yml" up -d
check_health "aquicreamos"

# 5. Caddy (reverse proxy, debe ir al final)
echo ""
echo "🌍 Desplegando Caddy (Reverse Proxy)..."
$COMPOSE -f "$SERVICES_DIR/caddy.yml" up -d
check_health "portfolio-caddy" || true

# Resumen final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Despliegue completado${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Estado de los servicios:"
docker ps --filter "network=portfolio-network" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🔍 Verificar logs:"
echo "  docker logs portfolio-backend"
echo "  docker logs astro-portfolio"
echo "  docker logs portfolio-minio"
echo ""
echo "🌐 URLs esperadas:"
echo "  https://darwinyusef.com"
echo "  https://aquicreamos.com"
echo "  https://console.darwinyusef.com (MinIO Console)"
echo "  https://n8n.darwinyusef.com (n8n Automation)"
echo ""
