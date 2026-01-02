# 🚀 Portfolio Astro - Darwin Yusef

Portfolio personal con auto-deploy. Todo corre en Docker.

**Live:** https://darwinyusef.com

---

## 📚 Documentación

| Archivo | Para qué |
|---------|----------|
| **[SETUP.md](./SETUP.md)** | 👉 **Instalación completa** |
| **[WEBHOOK-AUTODEPLOY.md](./WEBHOOK-AUTODEPLOY.md)** | Auto-deploy desde GitHub |
| **[CONFIGURACION-EMAIL-GRATIS.md](./CONFIGURACION-EMAIL-GRATIS.md)** | Email gratis (Cloudflare + Gmail) |
| **[COMANDOS-RAPIDOS.md](./COMANDOS-RAPIDOS.md)** | Comandos útiles |

---

## ⚡ Inicio Rápido

```bash
# Desarrollo local
npm install
npm run dev

# Docker básico
docker-compose up -d --build

# Producción con auto-deploy
docker-compose -f docker-compose.full.yml up -d
```

---

## 🛠️ Stack

- **Frontend:** Astro 5 + Tailwind 4
- **Deploy:** Docker + Nginx + Certbot
- **CI/CD:** Webhook Worker
- **Email:** Cloudflare + Gmail SMTP
- **Storage:** Minio

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

**1. Lee:** [SETUP.md](./SETUP.md)

**2. Resumen:**
```bash
# Instala Docker
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
