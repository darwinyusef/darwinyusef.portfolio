# 🗄️ MinIO Integration - Almacenamiento de Leads

## 📋 Overview

Integración completa de MinIO (S3-compatible) para almacenar leads en formato **JSONL** (append-only), con estructura particionada por campaña y fecha.

---

## ✨ Características

✅ **Append-only JSONL** - Un lead por línea, nunca sobrescribe
✅ **Particionamiento** por campaña y fecha (`campaign=X/date=YYYY-MM-DD/`)
✅ **Doble formato** - JSONL para analytics + CSV para exportación
✅ **Fallback local** - Si MinIO falla, guarda en `data/leads.json`
✅ **API completa** - Health check, stats, exportación
✅ **Compatible con DuckDB** - Lee JSONL directamente desde S3

---

## 🏗️ Estructura de Datos en MinIO

### Bucket: `leads`

```
leads/
 └── raw/
     ├── campaign=architecture-guide/
     │   ├── date=2026-01-03/
     │   │   ├── leads.jsonl
     │   │   └── leads.csv
     │   └── date=2026-01-04/
     │       ├── leads.jsonl
     │       └── leads.csv
     ├── campaign=newsletter/
     │   └── date=2026-01-03/
     │       ├── leads.jsonl
     │       └── leads.csv
     └── campaign=fullstack-roadmap/
         └── date=2026-01-03/
             ├── leads.jsonl
             └── leads.csv
```

### Formato JSONL (cada línea es un JSON)

\`\`\`jsonl
{"email":"juan@example.com","name":"Juan","campaign":"architecture-guide","source":"resource_download","resourceId":"architecture-guide","resourceTitle":"Guía de Arquitectura de Software","ip":"192.168.1.1","ts":"2026-01-03T10:30:00.000Z","consent":true}
{"email":"maria@example.com","name":"María","campaign":"architecture-guide","source":"resource_download","resourceId":"architecture-guide","resourceTitle":"Guía de Arquitectura de Software","ip":"192.168.1.2","ts":"2026-01-03T11:45:00.000Z","consent":true}
\`\`\`

### Formato CSV

\`\`\`csv
"juan@example.com","Juan","architecture-guide","resource_download","architecture-guide","Guía de Arquitectura de Software","192.168.1.1","2026-01-03T10:30:00.000Z","true"
"maria@example.com","María","architecture-guide","resource_download","architecture-guide","Guía de Arquitectura de Software","192.168.1.2","2026-01-03T11:45:00.000Z","true"
\`\`\`

---

## ⚙️ Configuración

### 1. Variables de Entorno

Agregar a `backend/.env`:

\`\`\`bash
# MinIO Configuration
MINIO_ENDPOINT=5.78.158.206
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=leads
MINIO_USE_SSL=false
\`\`\`

### 2. Crear Bucket (con MinIO Client)

\`\`\`bash
# Instalar mc (MinIO Client)
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# Configurar alias
mc alias set myminio http://5.78.158.206:9000 minioadmin minioadmin123

# Crear bucket
mc mb myminio/leads

# Verificar
mc ls myminio/
\`\`\`

### 3. Instalar Dependencias

\`\`\`bash
cd backend
npm install minio
\`\`\`

---

## 🚀 Uso Automático

Los leads se guardan automáticamente en MinIO cuando:

1. **Descarga de recurso**: `/api/resources/:id/request`
2. **Suscripción a newsletter**: `/api/newsletter`
3. Cualquier endpoint que capture email

**No requiere configuración adicional** - funciona out-of-the-box.

---

## 📊 API de Administración

### Base URL: `/api/minio`

### 1. Health Check

\`\`\`bash
GET /api/minio/health
\`\`\`

**Respuesta:**
\`\`\`json
{
  "status": "ok",
  "bucket": "leads",
  "bucketExists": true,
  "endpoint": "5.78.158.206"
}
\`\`\`

### 2. Estadísticas Agregadas

\`\`\`bash
GET /api/minio/stats
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "totalFiles": 12,
  "totalSizeBytes": 45678,
  "byCampaign": {
    "architecture-guide": {
      "count": 5,
      "size": 12345,
      "files": ["raw/campaign=architecture-guide/date=2026-01-03/leads.jsonl"]
    },
    "newsletter": {
      "count": 7,
      "size": 23456,
      "files": ["raw/campaign=newsletter/date=2026-01-03/leads.jsonl"]
    }
  },
  "byDate": {
    "2026-01-03": {
      "count": 10,
      "size": 34567
    }
  }
}
\`\`\`

### 3. Listar Archivos

\`\`\`bash
GET /api/minio/files?prefix=raw/
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "files": [
    {
      "name": "raw/campaign=architecture-guide/date=2026-01-03/leads.jsonl",
      "size": 1234,
      "lastModified": "2026-01-03T10:30:00Z"
    }
  ],
  "total": 12
}
\`\`\`

### 4. Exportar Campaña Específica

\`\`\`bash
# JSON
GET /api/minio/export/architecture-guide

# CSV
GET /api/minio/export/architecture-guide?format=csv
\`\`\`

**Respuesta JSON:**
\`\`\`json
{
  "success": true,
  "campaign": "architecture-guide",
  "total": 42,
  "leads": [
    {
      "email": "juan@example.com",
      "name": "Juan",
      "campaign": "architecture-guide",
      "ts": "2026-01-03T10:30:00.000Z"
    }
  ]
}
\`\`\`

**Respuesta CSV:**
Descarga archivo `leads_architecture-guide.csv`

### 5. Exportar TODOS los Leads

\`\`\`bash
# JSON
GET /api/minio/export-all

# CSV (descarga archivo)
GET /api/minio/export-all?format=csv
\`\`\`

### 6. Leer Archivo Específico

\`\`\`bash
GET /api/minio/read?path=raw/campaign=newsletter/date=2026-01-03/leads.jsonl
\`\`\`

---

## 🔧 Funciones del Servicio MinIO

### `minio-storage.js`

```javascript
import { appendLeadJsonl } from '../services/minio-storage.js';

// Guardar lead
await appendLeadJsonl({
  email: 'juan@example.com',
  name: 'Juan',
  campaign: 'architecture-guide',
  source: 'resource_download',
  resourceId: 'architecture-guide',
  resourceTitle: 'Guía de Arquitectura',
  ip: req.ip
});
```

**Funciones disponibles:**

| Función | Descripción |
|---------|-------------|
| `initializeMinio()` | Crear bucket si no existe |
| `appendLeadJsonl(data)` | Append lead en JSONL |
| `appendLeadCsv(data)` | Append lead en CSV |
| `readJsonlFile(path)` | Leer archivo JSONL completo |
| `listLeadFiles(prefix)` | Listar archivos en bucket |
| `getLeadStats()` | Estadísticas agregadas |
| `exportCampaignLeads(campaign, format)` | Exportar campaña |
| `checkMinioHealth()` | Health check |

---

## 📈 Lectura con DuckDB (Opcional)

DuckDB puede leer JSONL directamente desde MinIO:

\`\`\`sql
-- Instalar extensión S3
INSTALL httpfs;
LOAD httpfs;

-- Configurar credenciales
SET s3_endpoint='5.78.158.206:9000';
SET s3_access_key_id='minioadmin';
SET s3_secret_access_key='minioadmin123';
SET s3_use_ssl=false;

-- Leer JSONL desde MinIO
SELECT *
FROM read_json_auto('s3://leads/raw/campaign=architecture-guide/date=*/leads.jsonl');

-- Contar leads por campaña
SELECT
  campaign,
  COUNT(*) as total_leads,
  COUNT(DISTINCT email) as unique_emails
FROM read_json_auto('s3://leads/raw/campaign=*/date=*/leads.jsonl')
GROUP BY campaign
ORDER BY total_leads DESC;

-- Exportar a CSV limpio
COPY (
  SELECT *
  FROM read_json_auto('s3://leads/raw/campaign=*/date=*/leads.jsonl')
) TO 'all_leads_export.csv' (HEADER, DELIMITER ',');
\`\`\`

---

## 🛡️ Fallback System

Si MinIO no está disponible:

1. **Intenta guardar** en MinIO
2. **Si falla**: Guarda en `backend/data/leads.json` (local)
3. **No pierde datos** - continúa funcionando

\`\`\`javascript
try {
  await appendLeadJsonl(leadData);
} catch (minioError) {
  console.error('MinIO error:', minioError);
  // Fallback a archivo local
  saveToLocalFile(leadData);
}
\`\`\`

---

## 🐳 Docker Compose con MinIO

Si quieres levantar tu propio MinIO:

\`\`\`yaml
version: '3.8'

services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - "9000:9000"  # API S3
      - "9001:9001"  # Console Web
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    command: server /data --console-address ":9001"
    volumes:
      - minio-data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  minio-data:
\`\`\`

\`\`\`bash
docker-compose up -d minio

# Acceder consola web
# http://localhost:9001
# User: minioadmin
# Pass: minioadmin123
\`\`\`

---

## 🔒 Seguridad

### Producción:

1. **Cambiar credenciales**:
   \`\`\`bash
   MINIO_ACCESS_KEY=your_secure_access_key
   MINIO_SECRET_KEY=your_very_secure_secret_key_min_32_chars
   \`\`\`

2. **Habilitar SSL**:
   \`\`\`bash
   MINIO_USE_SSL=true
   MINIO_ENDPOINT=minio.tudominio.com
   \`\`\`

3. **Políticas de bucket**:
   \`\`\`bash
   # Solo backend puede escribir
   mc policy set download myminio/leads
   \`\`\`

4. **Rate limiting** en endpoints de exportación

---

## 📊 Monitoreo

### Logs de MinIO

\`\`\`bash
# Ver qué se está guardando
💾 Lead guardado en MinIO: raw/campaign=architecture-guide/date=2026-01-03/leads.jsonl
💾 Lead CSV guardado en MinIO: raw/campaign=architecture-guide/date=2026-01-03/leads.csv
\`\`\`

### Verificar salud

\`\`\`bash
curl http://localhost:3001/api/minio/health
\`\`\`

---

## 🎯 Casos de Uso

### 1. Exportar leads del mes para email marketing

\`\`\`bash
curl "http://localhost:3001/api/minio/export/newsletter?format=csv" > newsletter_leads.csv
\`\`\`

### 2. Ver stats de conversión por campaña

\`\`\`bash
curl http://localhost:3001/api/minio/stats | jq '.byCampaign'
\`\`\`

### 3. Integrar con Mailchimp/ConvertKit

\`\`\`javascript
// Obtener leads nuevos del día
const response = await fetch('/api/minio/export/architecture-guide');
const { leads } = await response.json();

// Enviar a Mailchimp
leads.forEach(lead => {
  mailchimp.lists.addListMember(LIST_ID, {
    email_address: lead.email,
    status: 'subscribed',
    merge_fields: {
      FNAME: lead.name,
      CAMPAIGN: lead.campaign
    }
  });
});
\`\`\`

---

## ✅ Checklist de Implementación

- [x] Instalar dependencia `minio`
- [x] Configurar variables de entorno
- [x] Crear servicio `minio-storage.js`
- [x] Integrar en endpoints de leads
- [x] Crear API de administración
- [x] Implementar fallback local
- [x] Documentar uso
- [ ] Crear bucket en MinIO de producción
- [ ] Cambiar credenciales por seguras
- [ ] Probar exportación CSV
- [ ] Integrar con CRM/Email Marketing

---

**¡MinIO configurado y funcionando! 🚀**

Leads ahora se guardan en formato append-only JSONL, particionados por campaña y fecha, listos para analytics con DuckDB.
