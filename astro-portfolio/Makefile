.PHONY: help build dev prod up down logs clean restart test

# Variables
COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
COMPOSE_PROD = docker-compose
CONTAINER_NAME = astro-portfolio

# Colores para output
BLUE = \033[0;34m
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

##@ Ayuda

help: ## Mostrar esta ayuda
	@echo "$(BLUE)Astro Portfolio - Docker Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Desarrollo

dev: ## Iniciar entorno de desarrollo con hot reload
	@echo "$(GREEN)Iniciando entorno de desarrollo...$(NC)"
	$(COMPOSE_DEV) up --build

dev-d: ## Iniciar desarrollo en segundo plano
	@echo "$(GREEN)Iniciando desarrollo en background...$(NC)"
	$(COMPOSE_DEV) up -d --build

dev-down: ## Detener desarrollo
	@echo "$(YELLOW)Deteniendo desarrollo...$(NC)"
	$(COMPOSE_DEV) down

dev-logs: ## Ver logs de desarrollo
	$(COMPOSE_DEV) logs -f

##@ Producción

build: ## Construir imagen de producción
	@echo "$(GREEN)Construyendo imagen de producción...$(NC)"
	$(COMPOSE_PROD) build --no-cache

prod: ## Iniciar en producción
	@echo "$(GREEN)Iniciando en producción...$(NC)"
	$(COMPOSE_PROD) up -d --build

prod-logs: ## Ver logs de producción
	$(COMPOSE_PROD) logs -f portfolio

up: prod ## Alias para iniciar producción

##@ Gestión

down: ## Detener todos los contenedores
	@echo "$(YELLOW)Deteniendo contenedores...$(NC)"
	$(COMPOSE_PROD) down

restart: ## Reiniciar contenedores
	@echo "$(YELLOW)Reiniciando contenedores...$(NC)"
	$(COMPOSE_PROD) restart

logs: ## Ver logs (producción)
	$(COMPOSE_PROD) logs -f

ps: ## Ver estado de contenedores
	@echo "$(BLUE)Estado de contenedores:$(NC)"
	docker ps -a | grep portfolio || echo "No hay contenedores de portfolio"

##@ Limpieza

clean: ## Limpiar contenedores, volúmenes e imágenes
	@echo "$(RED)Limpiando contenedores y volúmenes...$(NC)"
	$(COMPOSE_PROD) down -v
	$(COMPOSE_DEV) down -v

clean-all: ## Limpieza completa (incluye imágenes)
	@echo "$(RED)Limpieza completa...$(NC)"
	$(COMPOSE_PROD) down -v --rmi all
	$(COMPOSE_DEV) down -v --rmi all
	docker system prune -f

prune: ## Limpiar recursos Docker no utilizados
	@echo "$(YELLOW)Limpiando recursos no utilizados...$(NC)"
	docker system prune -f
	docker volume prune -f
	docker network prune -f

##@ Utilidades

shell: ## Acceder al shell del contenedor
	@echo "$(BLUE)Accediendo al contenedor...$(NC)"
	docker exec -it $(CONTAINER_NAME) sh

inspect: ## Inspeccionar contenedor
	@echo "$(BLUE)Inspeccionando contenedor...$(NC)"
	docker inspect $(CONTAINER_NAME)

health: ## Ver estado del health check
	@echo "$(BLUE)Health check status:$(NC)"
	@docker inspect $(CONTAINER_NAME) --format='{{.State.Health.Status}}' || echo "Contenedor no encontrado"

stats: ## Ver estadísticas de recursos
	docker stats $(CONTAINER_NAME)

size: ## Ver tamaño de la imagen
	@echo "$(BLUE)Tamaño de imágenes:$(NC)"
	@docker images | grep portfolio

test: ## Ejecutar tests (si existen)
	@echo "$(GREEN)Ejecutando tests...$(NC)"
	docker run --rm astro-portfolio npm test

##@ Despliegue

push: ## Push a Docker registry (configurar REGISTRY)
	@echo "$(GREEN)Pushing to registry...$(NC)"
	@if [ -z "$(REGISTRY)" ]; then \
		echo "$(RED)Error: REGISTRY no definido$(NC)"; \
		echo "Uso: make push REGISTRY=registry.example.com"; \
		exit 1; \
	fi
	docker tag astro-portfolio:latest $(REGISTRY)/astro-portfolio:latest
	docker push $(REGISTRY)/astro-portfolio:latest

tag: ## Tag imagen (TAG=version)
	@if [ -z "$(TAG)" ]; then \
		echo "$(RED)Error: TAG no definido$(NC)"; \
		echo "Uso: make tag TAG=1.0.0"; \
		exit 1; \
	fi
	@echo "$(GREEN)Tagging image as $(TAG)...$(NC)"
	docker tag astro-portfolio:latest astro-portfolio:$(TAG)

##@ Información

info: ## Mostrar información del proyecto
	@echo "$(BLUE)=== Información del Proyecto ===$(NC)"
	@echo "Nombre: Astro Portfolio"
	@echo "Versión: 1.0.0"
	@echo "Puerto desarrollo: 4321"
	@echo "Puerto producción: 3000"
	@echo ""
	@echo "$(BLUE)=== Docker Info ===$(NC)"
	@docker --version
	@docker-compose --version
	@echo ""
	@echo "$(BLUE)=== Contenedores ===$(NC)"
	@docker ps -a | grep portfolio || echo "No hay contenedores activos"
