# 🗄️ Servicio de Backup SQLite con Email

Sistema automático de backups para la base de datos SQLite del portfolio, con envío de copias por email usando Resend.

## 📋 Características

- ✅ Backups automáticos programados (cron)
- ✅ Hot backup sin bloqueos (SQLite backup API)
- ✅ Compresión GZIP para reducir tamaño
- ✅ Envío automático por email con adjunto
- ✅ Volúmenes Docker para persistencia
- ✅ Logs de todas las operaciones
- ✅ Health checks integrados

## 🏗️ Arquitectura

```
┌─────────────────────┐
│  Backend Service    │
│  (portfolio.db)     │
└──────────┬──────────┘
           │
           │ Volume: backend-data (read-only)
           │
┌──────────▼──────────┐
│  Backup Service     │
│  (Cron + Node.js)   │
└──────────┬──────────┘
           │
           ├─► Comprime .db → .db.gz
           ├─► Guarda en volumen backup-data
           └─► Envía por email (Resend)
```

## 📦 Volúmenes Docker

### 1. `backend-data` (Compartido con backend)
- **Origen:** Backend service
- **Contenido:** `portfolio.db`
- **Modo:** Read-only en backup service
- **Ubicación:** `/app/data/portfolio.db`

### 2. `backup-data` (Exclusivo de backup)
- **Contenido:** Backups comprimidos (`.db.gz`)
- **Modo:** Read-write
- **Ubicación:** `/app/backups/`
- **Retención:** Controlada por cron (limpieza mensual opcional)

## 🚀 Instalación

### 1. Variables de Entorno

Asegúrate de tener configurado en `/opt/darwinyusef.portfolio/backend/.env`:

```env
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=gerencia@darwinyusef.com
EMAIL_TO=wsgestor@gmail.com

# Opcional: Email específico para backups
BACKUP_EMAIL=backups@darwinyusef.com
```

### 2. Crear el Servicio

```bash
cd /opt/darwinyusef.portfolio

# Construir imagen
docker compose -f docker/services/backup-darwinyusef.yml build

# Iniciar servicio
docker compose -f docker/services/backup-darwinyusef.yml up -d

# Ver logs
docker compose -f docker/services/backup-darwinyusef.yml logs -f
```

### 3. Verificar

```bash
# Estado del servicio
docker ps | grep portfolio-backup

# Logs en tiempo real
docker logs -f portfolio-backup

# Verificar volúmenes
docker volume ls | grep portfolio
```

## ⏰ Programación de Backups

### Cron Schedule (por defecto)

| Frecuencia | Horario | Descripción |
|-----------|---------|-------------|
| **Diario** | 3:00 AM | Backup completo diario |
| **Semanal** | Domingo 2:00 AM | Backup semanal adicional |
| **Limpieza logs** | 1er día del mes 4:00 AM | Limpia logs antiguos |

### Personalizar Schedule

Edita `docker/backup/crontab`:

```cron
# Formato: minuto hora día mes día_semana comando

# Backup cada 6 horas
0 */6 * * * cd /app && node backup-runner.js >> /var/log/backup.log 2>&1

# Backup diario a medianoche
0 0 * * * cd /app && node backup-runner.js >> /var/log/backup.log 2>&1

# Backup cada lunes a las 8:00 AM
0 8 * * 1 cd /app && node backup-runner.js >> /var/log/backup.log 2>&1
```

Después de editar, reconstruir:
```bash
docker compose -f docker/services/backup-darwinyusef.yml up -d --build
```

## 🧪 Ejecutar Backup Manual

### Dentro del contenedor

```bash
docker exec portfolio-backup node backup-runner.js
```

### Desde el host (desarrollo)

```bash
cd backend
node backup-runner.js
```

## 📊 Proceso de Backup

### 1. Creación del Backup
```javascript
// Hot backup sin bloqueos
sourceDb.backup(backupPath)
```

### 2. Compresión
```javascript
// GZIP nivel 9 (máxima compresión)
gzip backup.db → backup.db.gz
```

### 3. Email
```javascript
// Adjunto en base64
resend.emails.send({
  attachments: [{ filename: 'backup.db.gz', content: base64 }]
})
```

### Output de Ejemplo

```
════════════════════════════════════════════════════════════
🚀 Iniciando proceso de backup
📅 20/01/2026, 03:00:00
════════════════════════════════════════════════════════════
📊 Estadísticas de la base de datos:
   Archivo: /app/data/portfolio.db
   Tamaño: 64.00 KB
   Tablas:
     - leads: 1 registros
     - contacts: 0 registros
     - newsletter_subscriptions: 0 registros
     - email_logs: 7 registros

📦 Creating backup: portfolio-backup-2026-01-20T03-00-00-000Z.db
   Progress: 100.0%
   ✅ Backup created
🗜️  Compressing backup...
   ✅ Backup compressed
   Original: 64.00 KB
   Compressed: 8.45 KB
   Ratio: 86.8%
📧 Sending backup email...
   ✅ Email sent: abc123-def456-ghi789

════════════════════════════════════════════════════════════
✅ BACKUP COMPLETADO EXITOSAMENTE
════════════════════════════════════════════════════════════
📦 Archivo: portfolio-backup-2026-01-20T03-00-00-000Z.db.gz
💾 Tamaño: 8.45 KB
📧 Email ID: abc123-def456-ghi789
👤 Enviado a: wsgestor@gmail.com
════════════════════════════════════════════════════════════
```

## 📧 Email de Backup

El email incluye:
- ✅ Estado del backup
- 📊 Estadísticas (tamaño original, comprimido, ratio)
- 📅 Fecha y hora
- 📎 Archivo `.db.gz` adjunto
- 🎨 HTML estilizado

## 🔍 Monitoreo

### Logs del Servicio

```bash
# Logs en tiempo real
docker logs -f portfolio-backup

# Últimas 100 líneas
docker logs --tail 100 portfolio-backup

# Logs de cron específicos
docker exec portfolio-backup cat /var/log/backup.log
docker exec portfolio-backup cat /var/log/backup-weekly.log
```

### Health Check

```bash
# Estado del health check
docker inspect portfolio-backup | grep -A 10 Health

# Verificar manualmente
docker exec portfolio-backup test -f /app/data/portfolio.db && echo "✅ DB OK" || echo "❌ DB Missing"
```

### Listar Backups

```bash
# Backups en el volumen
docker exec portfolio-backup ls -lh /app/backups/

# Exportar backup del volumen al host
docker cp portfolio-backup:/app/backups/portfolio-backup-2026-01-20.db.gz ./
```

## 🔧 Troubleshooting

### Problema: Backup no se ejecuta

**Verificar cron:**
```bash
docker exec portfolio-backup crontab -l
```

**Revisar logs:**
```bash
docker exec portfolio-backup cat /var/log/backup.log
```

### Problema: Email no se envía

**Verificar variables:**
```bash
docker exec portfolio-backup env | grep -E 'RESEND|EMAIL'
```

**Probar manualmente:**
```bash
docker exec portfolio-backup node backup-runner.js
```

### Problema: Base de datos no encontrada

**Verificar volumen:**
```bash
docker volume inspect portfolio-backend-data
docker exec portfolio-backup ls -la /app/data/
```

**Verificar que backend esté corriendo:**
```bash
docker ps | grep portfolio-backend
```

## 🛡️ Seguridad

### Recomendaciones

1. **Variables sensibles**: Usa Docker secrets o vault
2. **Autenticación email**: Configura SPF/DKIM en tu dominio
3. **Cifrado**: Los backups viajan cifrados vía HTTPS (Resend)
4. **Permisos**: El servicio corre como usuario no-root (UID 1001)
5. **Volumen read-only**: Backend data es solo lectura en backup service

### Rotación de Backups

Por defecto, los backups se acumulan. Para rotación automática, añade al crontab:

```cron
# Eliminar backups mayores a 30 días
0 5 * * * find /app/backups -name "*.gz" -mtime +30 -delete
```

## 📈 Optimización

### Reducir Tamaño del Email

Si los backups son grandes (>25 MB límite de Resend):

1. **Opción 1**: Subir a S3/MinIO y enviar link
2. **Opción 2**: Usar máxima compresión (ya configurado)
3. **Opción 3**: Enviar solo si cambió el tamaño

### Backup Incremental

Para bases de datos grandes, considera implementar:
- WAL archiving
- Delta backups
- Snapshot del volumen Docker

## 🔄 Restauración

### Desde Email

1. Descargar `.db.gz` del email
2. Descomprimir:
   ```bash
   gunzip portfolio-backup-2026-01-20.db.gz
   ```
3. Copiar al volumen:
   ```bash
   docker cp portfolio-backup-2026-01-20.db portfolio-backend:/app/data/portfolio.db
   docker restart portfolio-backend
   ```

### Desde Volumen

```bash
# Listar backups disponibles
docker exec portfolio-backup ls /app/backups/

# Restaurar el más reciente
docker exec portfolio-backup sh -c "gunzip -c /app/backups/portfolio-backup-*.db.gz > /tmp/restore.db"
docker cp portfolio-backup:/tmp/restore.db /tmp/
docker cp /tmp/restore.db portfolio-backend:/app/data/portfolio.db
docker restart portfolio-backend
```

## 🚦 Estado del Proyecto

✅ **Producción Ready**

- [x] Backup automático funcionando
- [x] Email con adjunto
- [x] Volúmenes Docker persistentes
- [x] Health checks
- [x] Logs de auditoría
- [x] Documentación completa

## 📚 Referencias

- [SQLite Backup API](https://www.sqlite.org/backup.html)
- [Resend Email API](https://resend.com/docs)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)
- [Cron Expression](https://crontab.guru/)

---

**Desarrollado para**: Portfolio DarwinYusef
**Última actualización**: 2026-01-20
