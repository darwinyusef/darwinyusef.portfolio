#!/bin/bash

echo "🔍 Verificando requisitos previos..."
echo ""

ERRORS=0

# Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker instalado: $(docker --version)"
else
    echo "❌ Docker no encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Docker Compose
if docker compose version &> /dev/null; then
    echo "✅ Docker Compose instalado: $(docker compose version)"
else
    echo "❌ Docker Compose no encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Archivos .env
echo ""
echo "📋 Verificando archivos .env..."

if [ -f "/opt/darwinyusef.portfolio/backend/.env" ]; then
    echo "✅ Backend .env existe"
else
    echo "❌ Backend .env no encontrado"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "/opt/darwinyusef.portfolio/astro-portfolio/.env" ]; then
    echo "✅ Frontend .env existe"
else
    echo "⚠️  Frontend .env no encontrado (opcional)"
fi

if [ -f "/opt/aquicreamoswbp/.env" ]; then
    echo "✅ AquiCreamos .env existe"
else
    echo "⚠️  AquiCreamos .env no encontrado (opcional)"
fi

# Verificar variables críticas
echo ""
echo "🔑 Verificando variables críticas en backend/.env..."

ENV_FILE="/opt/darwinyusef.portfolio/backend/.env"
if [ -f "$ENV_FILE" ]; then
    if grep -q "MINIO_ENDPOINT=" "$ENV_FILE"; then
        echo "✅ MINIO_ENDPOINT configurado"
    else
        echo "❌ MINIO_ENDPOINT no configurado"
        ERRORS=$((ERRORS + 1))
    fi

    if grep -q "MINIO_ACCESS_KEY=" "$ENV_FILE"; then
        echo "✅ MINIO_ACCESS_KEY configurado"
    else
        echo "❌ MINIO_ACCESS_KEY no configurado"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Directorios de contexto
echo ""
echo "📁 Verificando directorios de build..."

for dir in "/opt/darwinyusef.portfolio/backend" "/opt/darwinyusef.portfolio/astro-portfolio" "/opt/aquicreamoswbp"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir existe"
    else
        echo "❌ $dir no encontrado"
        ERRORS=$((ERRORS + 1))
    fi
done

# Dockerfiles
echo ""
echo "🐳 Verificando Dockerfiles..."

if [ -f "/opt/darwinyusef.portfolio/backend/Dockerfile" ]; then
    echo "✅ Backend Dockerfile existe"
else
    echo "❌ Backend Dockerfile no encontrado"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "/opt/darwinyusef.portfolio/astro-portfolio/Dockerfile" ]; then
    echo "✅ Frontend Dockerfile existe"
else
    echo "❌ Frontend Dockerfile no encontrado"
    ERRORS=$((ERRORS + 1))
fi

# Resultado final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo "✅ Todos los requisitos cumplidos"
    echo ""
    echo "Puedes ejecutar:"
    echo "  ./docker/deploy-all.sh"
    exit 0
else
    echo "❌ Encontrados $ERRORS errores"
    echo ""
    echo "Corrige los errores antes de desplegar"
    exit 1
fi
