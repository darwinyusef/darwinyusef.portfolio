# Setup del Proyecto Portfolio

## Estructura del Proyecto

```
portfolio/
├── astro-portfolio/     # Frontend estático (Astro + Nginx)
├── backend/             # API backend (Express)
└── docker-compose.yml   # Orquestación de servicios
```

## Configuración

### 1. Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales:
# - OPENAI_API_KEY
# - RESEND_API_KEY
# - EMAIL_FROM
# - EMAIL_TO
```

### 2. Frontend

```bash
cd astro-portfolio
cp .env.example .env
# Para desarrollo local:
PUBLIC_API_URL=http://localhost:3001

# Para producción:
PUBLIC_API_URL=https://api.tudominio.com
```

### 3. Datos del Backend

Crear directorio de datos en `backend/`:

```bash
mkdir -p backend/data
```

Opcionalmente, copiar archivos de configuración:

```bash
# Si tienes archivos de configuración locales
cp astro-portfolio/public/conf.json backend/data/conf.json
cp astro-portfolio/public/languages.json backend/data/languages.json
```

## Desarrollo Local

### Opción 1: Con Docker Compose

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# Frontend: http://localhost:8080
# Backend: http://localhost:3001
```

### Opción 2: Sin Docker

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
# Corre en http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd astro-portfolio
npm install
npm run dev
# Corre en http://localhost:4321
```

## Despliegue en Producción

### Usando Docker Compose

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Healthchecks

- Frontend: `http://localhost:8080/`
- Backend: `http://localhost:3001/health`

## Arquitectura

- **Frontend (Astro)**: Build estático servido por Nginx
- **Backend (Express)**: APIs REST con Node.js
- **Comunicación**: Frontend llama al backend via `PUBLIC_API_URL`

### APIs Disponibles

- `POST /api/chat-assistant` - Chatbot con IA
- `POST /api/ask-ai` - Consultas sobre servicios
- `POST /api/newsletter` - Suscripción a newsletter
- `POST /api/send-email` - Formulario de contacto
- `POST /api/testimonial` - Envío de testimonios

## Notas

- El frontend es 100% estático y puede ser servido desde CDN
- El backend escala independientemente
- Los datos se persisten en volume Docker `backend-data`
