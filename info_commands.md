docker compose up -d backend

tr -cd '\11\12\15\40-\176' < docker-compose-caddy.yml > docker-compose-caddy.yml.tmp && mv docker-compose-caddy.yml.tmp docker-compose-caddy.yml

docker compose -f docker-compose-caddy.yml up -d --build

# para eliminar
docker stop portfolio-caddy astro-portfolio portfolio-minio

