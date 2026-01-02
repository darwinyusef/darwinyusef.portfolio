#!/bin/sh

###############################################################################
# Auto-Deploy Script ejecutado por Webhook
# Triggered por: GitHub push to main
###############################################################################

set -e

COMMIT_ID=$1
PUSHER=$2
COMMIT_MSG=$3

echo "========================================="
echo "🚀 Auto-Deploy Iniciado"
echo "========================================="
echo "Commit: $COMMIT_ID"
echo "By: $PUSHER"
echo "Message: $COMMIT_MSG"
echo "Time: $(date)"
echo "========================================="

# Ir al directorio del proyecto
cd /workspace

# Pull últimos cambios
echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/main
git clean -fd

echo "✅ Code updated"

# Ir al directorio de la app
cd astro-portfolio

# Verificar que docker compose existe
if [ ! -f "docker-compose.production.yml" ]; then
    echo "❌ docker-compose.production.yml not found!"
    exit 1
fi

# Detener contenedor actual (excepto nginx y certbot)
echo "🛑 Stopping current portfolio container..."
docker stop astro-portfolio || true
docker rm astro-portfolio || true

# Build nueva imagen
echo "🔨 Building new image..."
docker-compose -f docker-compose.production.yml build portfolio

# Iniciar nuevo contenedor
echo "▶️  Starting new container..."
docker-compose -f docker-compose.production.yml up -d portfolio

# Esperar a que el contenedor esté listo
echo "⏳ Waiting for container to be ready..."
sleep 10

# Health check
echo "🏥 Checking container health..."
MAX_TRIES=30
COUNTER=0

while [ $COUNTER -lt $MAX_TRIES ]; do
    if docker ps | grep -q astro-portfolio; then
        if docker exec astro-portfolio curl -f http://localhost:8080 > /dev/null 2>&1; then
            echo "✅ Container is healthy!"
            break
        fi
    fi

    COUNTER=$((COUNTER + 1))
    if [ $COUNTER -eq $MAX_TRIES ]; then
        echo "❌ Container health check failed!"
        echo "📋 Container logs:"
        docker logs --tail 50 astro-portfolio
        exit 1
    fi

    echo "Attempt $COUNTER/$MAX_TRIES..."
    sleep 2
done

# Limpiar imágenes antiguas
echo "🧹 Cleaning up old images..."
docker image prune -f > /dev/null 2>&1 || true

# Reiniciar nginx para asegurar proxy
echo "🔄 Reloading nginx..."
docker exec portfolio-nginx nginx -s reload || true

echo ""
echo "========================================="
echo "✨ Deployment Completado Exitosamente"
echo "========================================="
echo "Commit: $COMMIT_ID"
echo "Deployed at: $(date)"
echo "Container: $(docker ps --filter name=astro-portfolio --format '{{.Status}}')"
echo "========================================="

# Enviar notificación (opcional)
# curl -X POST -H 'Content-type: application/json' \
#   --data "{\"text\":\"✅ Portfolio deployed successfully\nCommit: $COMMIT_MSG\nBy: $PUSHER\"}" \
#   YOUR_SLACK_WEBHOOK_URL

exit 0
