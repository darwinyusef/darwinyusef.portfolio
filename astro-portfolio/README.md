# 🚀 Portfolio Astro - Darwin Yusef

Portfolio personal con auto-deploy. Todo corre en Docker.

**Live:** https://darwinyusef.com

---

## 📚 Documentación

| Archivo | Para qué |
|---------|----------|
| **[DEPLOY-COMPLETO.md](./DEPLOY-COMPLETO.md)** | 📖 **Guía completa de deployment** |
| **[PASO-0-INSTALAR-DOCKER.md](./PASO-0-INSTALAR-DOCKER.md)** | 🐳 Instalar Docker y Docker Compose |
| **[PASO-1-CONFIGURAR-DNS.md](./PASO-1-CONFIGURAR-DNS.md)** | 🌐 Configurar DNS paso a paso |
| **[PASO-2-CONFIGURAR-CADDY.md](./PASO-2-CONFIGURAR-CADDY.md)** | 🔒 Configurar HTTPS con Caddy |
| **[GITHUB-ACTIONS-DEPLOY.md](./GITHUB-ACTIONS-DEPLOY.md)** | 🚀 CI/CD con GitHub Actions |
| **[CONFIGURACION-DOMINIOS-CADDY.md](./CONFIGURACION-DOMINIOS-CADDY.md)** | ⚙️ Guía completa de Caddy |
| **[WEBHOOK-AUTODEPLOY.md](./WEBHOOK-AUTODEPLOY.md)** | Auto-deploy con Webhook |
| **[CONFIGURACION-EMAIL-GRATIS.md](./CONFIGURACION-EMAIL-GRATIS.md)** | Email gratis (Cloudflare + Gmail) |
| **[COMANDOS-RAPIDOS.md](./COMANDOS-RAPIDOS.md)** | Comandos útiles |

---

## ⚡ Inicio Rápido

```bash
# Desarrollo local
npm install
npm run dev

# Docker básico (sin HTTPS)
docker-compose up -d --build

# Producción con Caddy + HTTPS automático
docker compose -f docker-compose-caddy.yml up -d --build
```

---

## 🛠️ Stack

- **Frontend:** Astro 5 + Tailwind 4
- **Reverse Proxy:** Caddy (HTTPS automático)
- **Deploy:** Docker + GitHub Actions
- **CI/CD:** GitHub Actions (zero RAM en servidor)
- **Email:** Cloudflare + Gmail SMTP
- **Storage:** Minio
- **Idiomas:** Español, Inglés, Portugués

---

## 📝 Estructura

```
astro-portfolio/
├── src/                    # Código fuente
├── public/                 # Assets
├── docker-compose.yml      # Docker básico
├── docker-compose.full.yml # Con auto-deploy
├── webhook/                # Config auto-deploy
├── SETUP.md               # Guía instalación
└── README.md              # Este archivo
```

---

## 🚀 Deploy en Servidor

**1. Guía completa:** [DEPLOY-COMPLETO.md](./DEPLOY-COMPLETO.md)

**2. Resumen rápido:**
```bash
# Paso 0: Instala Docker (ver PASO-0-INSTALAR-DOCKER.md)
curl -fsSL https://get.docker.com | sh

# Clona proyecto
git clone https://github.com/darwinyusef/darwinyusef.portfolio.git
cd darwinyusef.portfolio/astro-portfolio

# Configura .env
cp .env.example .env
nano .env

# Deploy
docker-compose -f docker-compose.full.yml up -d
```

**3. Configura webhook en GitHub** → Auto-deploy ✨

---

## 📧 Contacto

- **Email:** wsgestor@gmail.com
- **GitHub:** https://github.com/darwinyusef
