# Docker Services Organization

Servicios separados por responsabilidad única. Cada servicio tiene su propio compose file.

## Estructura

```
/opt/darwinyusef.portfolio/docker/
├── caddy/
│   └── Caddyfile                    # Configuraciones de caddy
├── services/
│   ├── caddy.yml                    # Reverse proxy (nunca se actualiza)
│   ├── minio.yml                    # Object storage (nunca se actualiza)
│   ├── duckdb.yml                   # DuckDB Analytics (nunca se actualiza)
│   ├── frontend-darwinyusef.yml     # Frontend darwinyusef.com
│   ├── backend-darwinyusef.yml      # Backend darwinyusef.com
│   └── aquicreamos.yml              # Aquicreamos.com
└── docker-compose.yml               # Orquestador principal
```

## Uso

## Rutas de Proyectos

### Aquicreamos.com
- **Código fuente:** `/opt/aquicreamoswbp`
- **Variables de entorno:** `/opt/darwinyusef.portfolio/backend/.env` (compartido)

### Darwinyusef.com
- **Código fuente:** `/opt/darwinyusef.portfolio`
- **Variables de entorno:** `/opt/darwinyusef.portfolio/backend/.env` (global)

**Nota:** Todos los servicios comparten el mismo archivo `.env` ubicado en `/opt/darwinyusef.portfolio/backend/.env` para centralizar la configuración.

### Deploy individual de servicios

```bash
# 1. Primero Caddy (Reverse Proxy)
docker compose -f docker/services/caddy.yml up -d

# 2. Después MinIO (Object Storage)
docker compose -f docker/services/minio.yml up -d

# 3. DuckDB (Analytics Database)
docker compose -f docker/services/duckdb.yml up -d

# 4. Backend darwinyusef.com (antes del frontend)
docker compose -f docker/services/backend-darwinyusef.yml up -d

# 5. Frontend darwinyusef.com
docker compose -f docker/services/frontend-darwinyusef.yml up -d

# 6. Aquicreamos.com
docker compose -f docker/services/aquicreamos.yml up -d
```

### Deploy todos los servicios

**Opción 1: Usando docker-compose.yml principal (Recomendado)**

```bash
cd /opt/darwinyusef.portfolio/docker
docker compose up -d
```

**Opción 2: Múltiples archivos compose**

```bash
docker compose -f docker/services/caddy.yml \
               -f docker/services/minio.yml \
               -f docker/services/frontend-darwinyusef.yml \
               -f docker/services/backend-darwinyusef.yml \
               -f docker/services/aquicreamos.yml \
               up -d
```

## GitHub Actions

Cada servicio tiene su propio workflow que solo se ejecuta cuando cambia:

- `.github/workflows/deploy-frontend.yml` → Actualiza solo frontend
- `.github/workflows/deploy-backend.yml` → Actualiza solo backend
- `.github/workflows/deploy-aquicreamos.yml` → Actualiza solo aquicreamos

**Caddy y MinIO nunca se reinician automáticamente.**

## Red compartida

Todos los servicios usan la red `portfolio-network`:

```bash
docker network create portfolio-network
```
