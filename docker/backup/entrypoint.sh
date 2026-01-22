#!/bin/sh

echo "════════════════════════════════════════════════════════════"
echo "🗄️  Portfolio Backup Service"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📅 Servicio iniciado: $(date)"
echo ""

# Verificar que el volumen de datos está montado
if [ ! -f "/app/data/portfolio.db" ]; then
  echo "⚠️  ADVERTENCIA: portfolio.db no encontrado en /app/data/"
  echo "   Verifica que el volumen backend-data esté correctamente montado"
else
  echo "✅ Base de datos encontrada: /app/data/portfolio.db"
  DB_SIZE=$(du -h /app/data/portfolio.db | cut -f1)
  echo "   Tamaño: $DB_SIZE"
fi

echo ""
echo "📋 Configuración de backup:"
echo "   - Backup diario: 3:00 AM"
echo "   - Backup semanal: Domingos 2:00 AM"
echo "   - Email destino: $EMAIL_TO"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Crear directorios de logs si no existen
touch /var/log/backup.log
touch /var/log/backup-weekly.log

# Ejecutar comando pasado como argumento
exec "$@"
