#!/bin/bash

SERVICES_DIR="/opt/darwinyusef.portfolio/docker/services"
COMPOSE="docker compose"

echo "🛑 Deteniendo todos los servicios..."

# Detener en orden inverso
$COMPOSE -f "$SERVICES_DIR/caddy.yml" down 2>/dev/null || true
$COMPOSE -f "$SERVICES_DIR/aquicreamos.yml" down 2>/dev/null || true
$COMPOSE -f "$SERVICES_DIR/frontend-darwinyusef.yml" down 2>/dev/null || true
$COMPOSE -f "$SERVICES_DIR/backend-darwinyusef.yml" down 2>/dev/null || true
$COMPOSE -f "$SERVICES_DIR/duckdb.yml" down 2>/dev/null || true
$COMPOSE -f "$SERVICES_DIR/minio.yml" down 2>/dev/null || true

echo "✅ Todos los servicios detenidos"
echo ""
echo "📋 Contenedores restantes:"
docker ps --filter "network=portfolio-network"
