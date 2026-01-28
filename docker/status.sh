#!/bin/bash

echo "📊 Estado de servicios Portfolio"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Contenedores
echo "🐳 Contenedores:"
docker ps --filter "network=portfolio-network" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "❌ Red no encontrada"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💚 Health Checks:"

for container in portfolio-minio portfolio-duckdb n8n portfolio-backend astro-portfolio aquicreamos portfolio-caddy; do
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no-healthcheck")
        status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)

        if [ "$health" = "healthy" ]; then
            echo "  ✅ $container: healthy"
        elif [ "$health" = "no-healthcheck" ] && [ "$status" = "running" ]; then
            echo "  ⚪ $container: running (no healthcheck)"
        else
            echo "  ❌ $container: $health ($status)"
        fi
    else
        echo "  ⭕ $container: not running"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Volúmenes:"
docker volume ls | grep portfolio || echo "  No hay volúmenes"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Redes:"
docker network ls | grep portfolio || echo "  No hay redes"
