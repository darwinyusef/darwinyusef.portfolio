# Distribución de Memoria - 4GB RAM

## Límites Configurados

| Servicio | Límite | Reserva | Uso Esperado |
|----------|--------|---------|--------------|
| Caddy | 128 MB | 64 MB | Proxy ligero |
| Backend | 512 MB | 256 MB | Node.js API |
| Frontend (Astro) | 256 MB | 128 MB | Servicio estático |
| AquiCreamos | 256 MB | 128 MB | Servicio estático |
| MinIO | 256 MB | 128 MB | Storage S3 |
| DuckDB | 192 MB | 64 MB | Analytics DB |
| n8n | 512 MB | 256 MB | Automation |
| **Total Límites** | **~2.1 GB** | **~1.0 GB** | - |

## Memoria Disponible

- **Total Sistema**: 4 GB
- **Usado por contenedores**: ~2.1 GB (límites)
- **SO + Docker overhead**: ~500 MB
- **Buffer disponible**: ~1.4 GB

## Monitoreo

```bash
# Ver uso de memoria en tiempo real
docker stats

# Ver solo consumo de memoria
docker stats --format "table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}"

# Alertar si un contenedor excede límite
docker events --filter 'event=oom'
```

## Ajustes Según Carga

Si experimentas problemas de memoria:

1. **Reducir n8n**: 512m → 384m (si workflows son simples)
2. **Reducir MinIO**: 512m → 384m (si poco tráfico S3)
3. **Reducir Backend**: 512m → 384m (si baja concurrencia API)

## Swap Recomendado

Configura swap de 2GB como buffer:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```
