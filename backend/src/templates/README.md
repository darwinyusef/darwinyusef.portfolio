# 📧 Email Templates System

Sistema de plantillas de email profesionales para portfolio y aplicaciones web.

## 📁 Estructura

```
templates/
├── base/
│   ├── styles.js      # Estilos CSS base
│   └── layout.js      # Layout base y helpers
├── email-templates.js # Templates principales
└── README.md          # Esta documentación
```

## 🎨 Features

- ✅ **Diseño Moderno**: Gradientes, sombras y tipografía moderna
- ✅ **Responsive**: Optimizado para móvil y desktop
- ✅ **Con Logo**: Incluye logo en el header
- ✅ **Branding Consistente**: Colores y estilo uniforme
- ✅ **Modular**: Helpers reutilizables
- ✅ **Profesional**: Listo para producción

## 🚀 Uso Básico

### Importar Templates

```javascript
import {
  contactFormTemplate,
  newsletterWelcomeTemplate,
  leadMagnetTemplate,
  cvDownloadTemplate,
  testimonialTemplate
} from './templates/email-templates.js';
```

### Ejemplo: Contacto

```javascript
const html = contactFormTemplate({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '+57 300 123 4567',
  message: 'Me interesa una consultoría'
});
```

### Ejemplo: Newsletter

```javascript
const html = newsletterWelcomeTemplate('usuario@example.com');
```

### Ejemplo: Lead Magnet

```javascript
const html = leadMagnetTemplate({
  name: 'María García',
  email: 'maria@example.com',
  resourceTitle: 'Guía de JavaScript',
  resourceUrl: 'https://example.com/download/guide.pdf',
  resourceDescription: 'Guía completa de JavaScript moderno'
});
```

### Ejemplo: Appointment Admin (AquiCreamos)

```javascript
const html = appointmentAdminTemplate({
  date: '2025-02-15',
  time: '10:00 AM',
  name: 'Carlos Rodríguez',
  email: 'carlos@example.com',
  phone: '+57 300 123 4567',
  company: 'TechStartup SAS',
  service: 'Consultoría de Arquitectura',
  project_type: 'Aplicación Web',
  budget: '$5,000 - $10,000',
  description: 'Necesitamos ayuda para escalar nuestra plataforma',
  meetLink: 'https://meet.google.com/abc-defg-hij'
});
```

### Ejemplo: Appointment Client (AquiCreamos)

```javascript
const html = appointmentClientTemplate({
  date: '2025-02-15',
  time: '10:00 AM',
  name: 'Carlos Rodríguez',
  email: 'carlos@example.com',
  service: 'Consultoría de Arquitectura',
  meetLink: 'https://meet.google.com/abc-defg-hij'
});
```

### Ejemplo: Bug Report (AquiCreamos)

```javascript
const html = bugReportTemplate({
  type: 'UI/UX',
  title: 'Botón no responde en móvil',
  page: 'Página de servicios',
  url: 'https://aquicreamos.com/servicios',
  description: 'El botón de contacto no funciona en dispositivos móviles',
  email: 'usuario@example.com',
  timestamp: new Date().toISOString(),
  userAgent: 'Mozilla/5.0...',
  screenSize: '375x667'
});
```

## 🧩 Componentes Reutilizables

### createEmailLayout

Layout completo con header, footer y CTA.

```javascript
import { createEmailLayout } from './base/layout.js';

const html = createEmailLayout({
  logoUrl: 'https://darwinyusef.com/favicon.svg',
  brandName: '@DARWINYUSEF',
  brandTagline: 'Full-Stack Developer',
  heroIcon: '🚀',
  heroTitle: 'Título Principal',
  heroSubtitle: 'Subtítulo',
  content: '<p>Contenido aquí</p>',
  ctaText: 'Call to Action',
  ctaUrl: 'https://example.com',
  footerText: 'Texto del footer',
  footerLinks: [
    { text: 'Portfolio', url: 'https://darwinyusef.com' },
    { text: 'GitHub', url: 'https://github.com/darwinyusef' }
  ]
});
```

### createInfoCard

Tarjeta de información.

```javascript
import { createInfoCard } from './base/layout.js';

const card = createInfoCard({
  emoji: '👤',
  label: 'Nombre',
  value: 'Juan Pérez'
});
```

### createMessageCard

Tarjeta para mensajes largos.

```javascript
import { createMessageCard } from './base/layout.js';

const card = createMessageCard({
  title: 'MENSAJE DEL CLIENTE',
  content: 'Texto largo aquí...'
});
```

### createDivider

Separador visual.

```javascript
import { createDivider } from './base/layout.js';

const divider = createDivider();
```

## 🎨 Personalización

### Logos

Los templates incluyen logos automáticamente según el proyecto:

**DarwinYusef Portfolio:**
```javascript
DARWINYUSEF_LOGO = 'https://darwinyusef.com/favicon.svg'
```
- Usado en: contacto, newsletter, CV, lead magnets, testimonios

**AquiCreamos:**
```javascript
AQUICREAMOS_LOGO = 'https://aquicreamos.com/img/logoAquicreamos.png'
```
- Usado en: asesorías (appointments), reportes de bugs

Para cambiar las URLs, edita las constantes en `email-templates.js`.

### Colores

Modifica los colores en `base/styles.js`:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Color de acento */
border-color: #f59e0b;
```

### Tipografía

Cambia la fuente en `base/styles.js`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

## 📧 Templates Disponibles

### DarwinYusef Portfolio

| Template | Descripción | Logo | Uso |
|----------|-------------|------|-----|
| `contactFormTemplate` | Formulario de contacto | darwinyusef.com | Usuario envía mensaje |
| `newsletterWelcomeTemplate` | Bienvenida newsletter | darwinyusef.com | Nueva suscripción |
| `newsletterAdminNotification` | Notif admin newsletter | darwinyusef.com | Alerta interna |
| `leadMagnetTemplate` | Envío de recurso | darwinyusef.com | Descarga lead magnet |
| `leadMagnetAdminNotification` | Notif admin lead | darwinyusef.com | Alerta interna |
| `cvDownloadTemplate` | Descarga de CV | darwinyusef.com | Usuario solicita CV |
| `testimonialTemplate` | Nuevo testimonio | darwinyusef.com | Alerta interna |
| `architectureConfirmationTemplate` | Confirmación asesoría | darwinyusef.com | Confirma solicitud |

### AquiCreamos

| Template | Descripción | Logo | Uso |
|----------|-------------|------|-----|
| `appointmentAdminTemplate` | Nueva asesoría agendada | aquicreamos.com | Notif admin |
| `appointmentClientTemplate` | Confirmación al cliente | aquicreamos.com | Confirma asesoría |
| `bugReportTemplate` | Reporte de bug | aquicreamos.com | Alerta técnica |

## 🔧 Testing

Prueba los templates enviando emails de prueba:

```javascript
import { Resend } from 'resend';
import { contactFormTemplate } from './templates/email-templates.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'tu-email@example.com',
  subject: 'Test Template',
  html: contactFormTemplate({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Este es un mensaje de prueba'
  })
});
```

## 📱 Compatibilidad

✅ Gmail
✅ Outlook
✅ Apple Mail
✅ Yahoo Mail
✅ Protonmail
✅ Clients móviles

## 🎯 Mejores Prácticas

1. **No uses JavaScript** en emails
2. **Inline styles** cuando sea necesario
3. **Imágenes**: usa CDN público
4. **Fallbacks**: siempre incluye texto alternativo
5. **Testing**: prueba en múltiples clientes

## 📝 Changelog

### v2.1.0 (2025-01-26)
- ✅ **NUEVO:** Templates de AquiCreamos
  - appointmentAdminTemplate (asesorías admin)
  - appointmentClientTemplate (confirmación cliente)
  - bugReportTemplate (reporte de bugs)
- ✅ Logo de AquiCreamos integrado
- ✅ Cobertura completa de todos los tipos de email

### v2.0.0 (2025-01-26)
- ✅ Estructura modular organizada
- ✅ Sistema de componentes reutilizables
- ✅ Logo de DarwinYusef integrado en header
- ✅ Diseño moderno con gradientes
- ✅ Footer con enlaces sociales
- ✅ Responsive mejorado

### v1.0.0 (Original)
- Templates básicos funcionales

---

**Desarrollado por:** @darwinyusef
**Licencia:** MIT
**Última actualización:** 2025-01-26
