#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Análisis de Memoria - Portfolio Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Memoria total del sistema
total_mem=$(free -m | awk 'NR==2{print $2}')
used_mem=$(free -m | awk 'NR==2{print $3}')
free_mem=$(free -m | awk 'NR==2{print $4}')

echo "💻 Sistema:"
echo "  Total: ${total_mem}MB"
echo "  Usado: ${used_mem}MB ($(awk "BEGIN {printf \"%.1f\", $used_mem/$total_mem*100}")%)"
echo "  Libre: ${free_mem}MB"
echo ""

# Memoria de contenedores
echo "🐳 Contenedores (portfolio-network):"
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}" \
  $(docker ps --filter "network=portfolio-network" --format "{{.Names}}") 2>/dev/null || echo "  ❌ Red no encontrada"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  Límites Configurados:"
echo "  Caddy: 128MB | Backend: 512MB | n8n: 512MB"
echo "  MinIO: 128MB | DuckDB: 192MB"
echo "  Frontends: 256MB c/u"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
