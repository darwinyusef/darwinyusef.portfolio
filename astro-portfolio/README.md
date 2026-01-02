# 🚀 Portfolio Astro - Darwin Yusef

Portfolio personal construido con Astro, desplegado en DigitalOcean con Docker, Jenkins CI/CD, y Minio para assets.

## 🌐 Live Demo

**Producción:** https://darwinyusef.com

**Servidor:** YOUR_SERVER_IP

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [PASO-A-PASO.md](./PASO-A-PASO.md) | **⭐ EMPEZAR AQUÍ** - Guía completa de deployment |
| [DOCKER-DEPLOY.md](./DOCKER-DEPLOY.md) | Guía de deployment con Docker |
| [DIGITALOCEAN-DEPLOY.md](./DIGITALOCEAN-DEPLOY.md) | Opciones de deployment en DigitalOcean |
| [SERVIDOR-ACTUAL.md](./SERVIDOR-ACTUAL.md) | Configuración específica del servidor actual |
| [INTEGRACION-DATOS.md](./INTEGRACION-DATOS.md) | Integración con JSON externos y Minio |
| [CONFIGURACION-EMAIL-CALENDARIO.md](./CONFIGURACION-EMAIL-CALENDARIO.md) | Formulario de contacto y calendario |

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS 4.x
- **Icons:** Lucide React
- **i18n:** astro-i18next
- **Markdown:** marked + highlight.js

### Backend/Infraestructura
- **Container:** Docker + Docker Compose
- **Web Server:** Nginx (reverse proxy + SSL)
- **CI/CD:** Jenkins + GitHub Actions
- **Storage:** Minio (S3-compatible)
- **Email:** Resend
- **Hosting:** DigitalOcean Droplet

---

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/darwinyusef/darwinyusef.portfolio.git
cd darwinyusef.portfolio/astro-portfolio

# Instalar dependencias
npm install

# Copiar .env
cp .env.example .env
# Editar .env con tus variables

# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:4321
```

### Con Docker

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up

# Producción
docker-compose up -d --build
```

---

## 📦 Comandos Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo (puerto 4321)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar linter

make dev             # Docker desarrollo
make prod            # Docker producción
make logs            # Ver logs
make clean           # Limpiar contenedores
```

Ver todos los comandos en [Makefile](./Makefile)

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# App
NODE_ENV=production
PORT=8080
SITE_URL=https://darwinyusef.com

# Email (Resend)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@darwinyusef.com
RESEND_TO_EMAIL=darwin.yusef@gmail.com

# Minio (opcional)
PUBLIC_MINIO_URL=https://minio.darwinyusef.com
MINIO_ACCESS_KEY=xxxxx
MINIO_SECRET_KEY=xxxxx

# Google Calendar (opcional)
GOOGLE_CALENDAR_ID=xxxxx@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxxxx@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│   Usuario (Browser)                     │
└────────────┬────────────────────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────────────────┐
│   Nginx (Reverse Proxy + SSL)           │
│   Puerto: 80, 443                       │
└────────────┬────────────────────────────┘
             │
             ├─────────────────────┐
             ▼                     ▼
┌─────────────────────┐  ┌──────────────────┐
│  Astro Portfolio    │  │  Minio (Assets)  │
│  Docker Container   │  │  Puerto: 9000    │
│  Puerto: 3000       │  └──────────────────┘
└─────────────────────┘
             ▲
             │ Git Push
             │
┌─────────────────────────────────────────┐
│   GitHub                                │
│   Webhooks → Jenkins                    │
└─────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   Jenkins CI/CD                         │
│   Puerto: 8080                          │
│   - Build                               │
│   - Test                                │
│   - Deploy                              │
└─────────────────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline

### Flujo Automático

1. **Push a GitHub** (rama `main`)
2. **GitHub Actions:**
   - Build y test
   - Build imagen Docker
   - Push a GitHub Container Registry
3. **GitHub Webhook** → Jenkins
4. **Jenkins:**
   - Pull última imagen
   - Deploy con Docker Compose
   - Health checks
   - Notificaciones

### Archivos de CI/CD

- `.github/workflows/deploy.yml` - GitHub Actions
- `Jenkinsfile.docker` - Jenkins pipeline para Docker
- `Jenkinsfile` - Jenkins pipeline para Kubernetes

---

## 📝 Estructura del Proyecto

```
astro-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD
├── deploy/
│   └── portfolio/
│       ├── k8s-deployment.yaml  # Kubernetes deployment
│       └── k8s-namespace.yaml   # Kubernetes namespaces
├── public/                      # Assets estáticos
├── scripts/
│   └── deploy-server.sh         # Script de deployment
├── src/
│   ├── components/              # Componentes Astro
│   ├── layouts/                 # Layouts
│   ├── pages/                   # Páginas y API routes
│   │   ├── api/
│   │   │   ├── contact.ts       # API de contacto
│   │   │   └── schedule.ts      # API de calendario
│   │   ├── index.astro
│   │   └── contact.astro
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utilidades
│       ├── dataFetcher.ts       # Fetch datos externos
│       ├── googleCalendar.ts    # Google Calendar API
│       └── minioHelper.ts       # Minio helper
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile                   # Multi-stage Docker build
├── Dockerfile.dev               # Docker para desarrollo
├── docker-compose.yml           # Docker Compose producción
├── docker-compose.dev.yml       # Docker Compose desarrollo
├── Jenkinsfile                  # Jenkins (Kubernetes)
├── Jenkinsfile.docker           # Jenkins (Docker)
├── Makefile                     # Comandos útiles
├── nginx.conf                   # Nginx config para container
├── nginx-reverse-proxy.conf     # Nginx reverse proxy
├── package.json
├── start.sh                     # Script de inicio
└── README.md                    # Este archivo
```

---

## 🚀 Deployment en DigitalOcean

### Opción 1: Deployment Rápido (Recomendado)

Sigue la guía paso a paso: **[PASO-A-PASO.md](./PASO-A-PASO.md)**

### Opción 2: Resumen Rápido

```bash
# 1. Conectar al servidor
ssh root@YOUR_SERVER_IP

# 2. Clonar proyecto
mkdir -p /opt/portfolio
cd /opt/portfolio
git clone https://github.com/darwinyusef/darwinyusef.portfolio.git .
cd astro-portfolio

# 3. Configurar
cp .env.example .env
nano .env  # Editar variables

# 4. Deploy
docker-compose up -d --build

# 5. Configurar Nginx
nano /etc/nginx/sites-available/portfolio
# Copiar contenido de nginx-reverse-proxy.conf

ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 6. SSL
certbot --nginx -d darwinyusef.com -d www.darwinyusef.com
```

---

## 🔐 Seguridad

### Implementado

- ✅ SSL/TLS con Let's Encrypt
- ✅ Usuario no-root en contenedor
- ✅ Security headers en Nginx
- ✅ Multi-stage Docker build
- ✅ Variables de entorno seguras
- ✅ Health checks
- ✅ Firewall (UFW)

### Recomendaciones Adicionales

```bash
# Fail2ban para protección SSH
apt install fail2ban

# Actualizar sistema regularmente
apt update && apt upgrade

# Rotar logs
logrotate -f /etc/logrotate.conf
```

---

## 📊 Monitoreo

### Logs

```bash
# Logs de la aplicación
docker logs -f astro-portfolio

# Logs de Nginx
tail -f /var/log/nginx/portfolio-access.log
tail -f /var/log/nginx/portfolio-error.log

# Logs de Jenkins
docker logs -f jenkins  # Si Jenkins está en Docker
```

### Métricas

```bash
# Stats del contenedor
docker stats astro-portfolio

# Uso de disco
df -h

# Uso de memoria
free -h
```

---

## 🐛 Troubleshooting

### Contenedor no inicia

```bash
docker logs astro-portfolio
docker-compose down -v
docker-compose up -d --build
```

### Nginx error

```bash
nginx -t
tail -50 /var/log/nginx/portfolio-error.log
systemctl restart nginx
```

### SSL no funciona

```bash
certbot renew
systemctl reload nginx
```

Ver más en [PASO-A-PASO.md](./PASO-A-PASO.md#troubleshooting)

---

## 📞 Contacto

- **Website:** https://darwinyusef.com
- **Email:** darwin.yusef@gmail.com
- **GitHub:** https://github.com/darwinyusef

---

## 📄 Licencia

Copyright © 2026 Darwin Yusef. Todos los derechos reservados.

---

## 🎯 Roadmap

- [ ] Implementar i18n completo (EN, ES, PT)
- [ ] Agregar blog con MDX
- [ ] Integrar analytics
- [ ] Implementar dark mode
- [ ] Optimizar SEO
- [ ] Agregar PWA support
- [ ] Implementar RSS feed
- [ ] Agregar sitemap automático

---

**Última actualización:** Enero 2026

**Versión:** 1.0.0
