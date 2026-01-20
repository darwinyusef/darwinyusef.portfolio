# Guía de Despliegue - Portfolio Stack

## Scripts Disponibles

### 1. Verificar Requisitos
```bash
bash docker/check-requirements.sh
```

Verifica:
- Docker y Docker Compose instalados
- Archivos .env existentes
- Directorios de contexto
- Dockerfiles

### 2. Desplegar Todos los Servicios
```bash
bash docker/deploy-all.sh
```

Despliega en orden:
1. Red `portfolio-network`
2. MinIO (almacenamiento S3)
3. DuckDB (analytics)
4. Backend (API Node.js)
5. Frontend Portfolio (Astro)
6. AquiCreamos (Astro)
7. Caddy (reverse proxy)

Incluye verificaciones de health checks automáticas.

### 3. Ver Estado
```bash
bash docker/status.sh
```

Muestra:
- Contenedores activos
- Health checks
- Volúmenes
- Redes

### 4. Detener Todo
```bash
bash docker/stop-all.sh
```

Detiene todos los servicios en orden inverso.

## Orden de Ejecución Recomendado

```bash
# 1. Verificar que todo esté listo
bash docker/check-requirements.sh

# 2. Desplegar
bash docker/deploy-all.sh

# 3. Verificar estado
bash docker/status.sh

# 4. Ver logs si hay problemas
docker logs portfolio-backend
docker logs astro-portfolio
docker logs portfolio-minio
```

## URLs Esperadas

- **Portfolio**: https://darwinyusef.com
- **AquiCreamos**: https://aquicreamos.com
- **MinIO Console**: https://console.darwinyusef.com
- **Backend API**: https://darwinyusef.com/api

## Troubleshooting

### Error en MinIO
```bash
docker logs portfolio-minio
# Verificar credenciales en backend/.env
```

### Backend no conecta
```bash
docker logs portfolio-backend
# Verificar MINIO_ENDPOINT en .env
```

### Caddy no sirve sitios
```bash
docker logs portfolio-caddy
# Verificar Caddyfile
```

### Reiniciar un servicio específico
```bash
docker compose -f docker/services/backend-darwinyusef.yml restart
```

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker logs -f portfolio-backend

# Acceder al contenedor
docker exec -it portfolio-backend sh

# Reconstruir y desplegar
docker compose -f docker/services/backend-darwinyusef.yml up -d --build

# Limpiar todo (CUIDADO: borra volúmenes)
docker compose -f docker/services/backend-darwinyusef.yml down -v
```
