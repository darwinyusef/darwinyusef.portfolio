# Crear
## Backend
docker compose up -d backend

## Frontend 
tr -cd '\11\12\15\40-\176' < docker-compose-caddy.yml > docker-compose-caddy.yml.tmp && mv docker-compose-caddy.yml.tmp docker-compose-caddy.yml

docker compose -f docker-compose-caddy.yml up -d --build

# Eliminar
docker stop portfolio-caddy astro-portfolio portfolio-minio

# Activar bucket minio 
1. entramos a la consola de minio ´docker exec -it portfolio-minio sh´´´
2. entramos a la consola de minio ´mc alias set local http://localhost:9000 user pass´ 
3. modificamos ´mc anonymous set download local/audios´
exit
