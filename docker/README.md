# Docker Services Organization

Servicios separados por responsabilidad única. Cada servicio tiene su propio compose file.

## Estructura

```
docker/
├── services/
│   ├── caddy.yml                    # Reverse proxy (nunca se actualiza)
│   ├── minio.yml                    # Object storage (nunca se actualiza)
│   ├── frontend-darwinyusef.yml     # Frontend darwinyusef.com
│   ├── backend-darwinyusef.yml      # Backend darwinyusef.com
│   └── aquicreamos.yml              # Aquicreamos.com
└── docker-compose.yml               # Orquestador principal (opcional)
```

## Uso

### Deploy individual de servicios

```bash
# Frontend darwinyusef.com
docker compose -f docker/services/frontend-darwinyusef.yml up -d

# Backend darwinyusef.com
docker compose -f docker/services/backend-darwinyusef.yml up -d

# Aquicreamos
docker compose -f docker/services/aquicreamos.yml up -d
```

### Deploy todos los servicios

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
