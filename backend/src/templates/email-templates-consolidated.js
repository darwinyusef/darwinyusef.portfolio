// ========================================
// TEMPLATES DE EMAIL CONSOLIDADOS Y MEJORADOS
// Sistema unificado para todos los servicios
// ========================================

// Estilos base reutilizables
const baseStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #0a0a0a;
      color: #e5e7eb;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      margin: 0;
      padding: 0;
    }

    .email-wrapper {
      width: 100%;
      background: #0a0a0a;
      padding: 40px 20px;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #0f0f0f;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .brand-header {
      background: #0a0a0a;
      padding: 30px 40px;
      border-bottom: 1px solid rgba(130, 226, 86, 0.2);
      text-align: center;
    }

    .brand-logo {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #82e256 0%, #6bc73d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
    }

    .hero-section {
      position: relative;
      padding: 50px 40px;
      background: linear-gradient(135deg, rgba(130, 226, 86, 0.1) 0%, rgba(107, 199, 61, 0.05) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .hero-section.success {
      background: linear-gradient(135deg, rgba(130, 226, 86, 0.15) 0%, rgba(107, 199, 61, 0.1) 100%);
    }

    .hero-section.error {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(153, 27, 27, 0.1) 100%);
    }

    .hero-icon {
      font-size: 48px;
      text-align: center;
      margin-bottom: 20px;
    }

    .hero-title {
      font-size: 26px;
      font-weight: 900;
      color: #f9fafb;
      text-align: center;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .hero-subtitle {
      font-size: 15px;
      color: #9ca3af;
      text-align: center;
      font-weight: 500;
    }

    .content-section {
      padding: 40px;
      background: #0f0f0f;
    }

    .info-card {
      background: rgba(30, 30, 30, 0.5);
      border: 1px solid rgba(130, 226, 86, 0.2);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .info-row {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      align-items: flex-start;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 11px;
      font-weight: 700;
      color: #82e256;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      min-width: 140px;
      padding-top: 2px;
    }

    .info-value {
      font-size: 15px;
      color: #e5e7eb;
      font-weight: 500;
      flex: 1;
      word-break: break-word;
    }

    .info-value a {
      color: #82e256;
      text-decoration: none;
      font-weight: 600;
    }

    .message-card {
      background: rgba(130, 226, 86, 0.05);
      border: 1px solid rgba(130, 226, 86, 0.2);
      border-left: 4px solid #82e256;
      border-radius: 8px;
      padding: 24px;
      margin-top: 24px;
    }

    .message-card.bug {
      background: rgba(220, 38, 38, 0.1);
      border: 1px solid rgba(220, 38, 38, 0.2);
      border-left: 4px solid #dc2626;
    }

    .message-title {
      font-size: 12px;
      font-weight: 700;
      color: #82e256;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }

    .message-content {
      font-size: 15px;
      color: #e5e7eb;
      line-height: 1.8;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      background: rgba(130, 226, 86, 0.2);
      color: #82e256;
      border: 1px solid rgba(130, 226, 86, 0.3);
    }

    .badge.error {
      background: rgba(220, 38, 38, 0.2);
      color: #fca5a5;
      border: 1px solid rgba(220, 38, 38, 0.3);
    }

    .action-section {
      text-align: center;
      padding: 30px 40px;
      background: rgba(0, 0, 0, 0.3);
    }

    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #82e256, #6bc73d);
      color: #000;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.5px;
      box-shadow: 0 10px 30px rgba(130, 226, 86, 0.3);
    }

    .footer-section {
      background: #0a0a0a;
      padding: 30px 40px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    .footer-info {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .footer-brand {
      font-size: 18px;
      font-weight: 900;
      background: linear-gradient(135deg, #82e256, #6bc73d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
      margin: 12px 0;
      letter-spacing: -0.02em;
    }

    .footer-meta {
      font-size: 11px;
      color: #4b5563;
      margin-top: 12px;
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      margin: 24px 0;
    }

    .technical-details {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      padding: 15px;
      margin-top: 20px;
    }

    .technical-details h4 {
      margin: 0 0 10px 0;
      color: #9ca3af;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tech-info {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      color: #6b7280;
      padding: 8px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .tech-info:first-of-type {
      border-top: none;
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }
      .content-section,
      .brand-header,
      .action-section,
      .footer-section {
        padding-left: 24px;
        padding-right: 24px;
      }
      .hero-section {
        padding: 40px 24px;
      }
      .info-row {
        flex-direction: column;
      }
      .info-label {
        min-width: auto;
        margin-bottom: 6px;
      }
    }
  </style>
`;

// ========================================
// APPOINTMENTS / ASESORÍAS
// ========================================

export function appointmentAdminTemplate(data) {
  const currentDate = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const appointmentDate = new Date(data.date).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <!-- Brand Header -->
            <div class="brand-header">
              <div class="brand-logo">AQUÍ CREAMOS</div>
              <div class="brand-name">Nueva Asesoría</div>
            </div>

            <!-- Hero Section -->
            <div class="hero-section success">
              <div class="hero-icon">📅</div>
              <h1 class="hero-title">Nueva Asesoría Agendada</h1>
              <p class="hero-subtitle">${data.service || 'Consultoría Técnica'}</p>
            </div>

            <!-- Content Section -->
            <div class="content-section">

              <!-- Información de la Cita -->
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">📅 Fecha</span>
                  <span class="info-value">${appointmentDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">⏰ Hora</span>
                  <span class="info-value">${data.time}</span>
                </div>
                ${data.meetLink ? `
                <div class="info-row">
                  <span class="info-label">🎥 Google Meet</span>
                  <span class="info-value">
                    <a href="${data.meetLink}">${data.meetLink}</a>
                  </span>
                </div>
                ` : ''}
              </div>

              <!-- Información del Cliente -->
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">👤 Nombre</span>
                  <span class="info-value">${data.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">📧 Email</span>
                  <span class="info-value">
                    <a href="mailto:${data.email}">${data.email}</a>
                  </span>
                </div>
                ${data.phone ? `
                <div class="info-row">
                  <span class="info-label">📱 Teléfono</span>
                  <span class="info-value">
                    <a href="tel:${data.phone}">${data.phone}</a>
                  </span>
                </div>
                ` : ''}
                ${data.company ? `
                <div class="info-row">
                  <span class="info-label">🏢 Empresa</span>
                  <span class="info-value">${data.company}</span>
                </div>
                ` : ''}
              </div>

              <!-- Detalles del Proyecto -->
              ${data.project_type || data.project_stage || data.budget ? `
              <div class="info-card">
                ${data.project_type ? `
                <div class="info-row">
                  <span class="info-label">🎯 Tipo de Proyecto</span>
                  <span class="info-value">${data.project_type}</span>
                </div>
                ` : ''}
                ${data.project_stage ? `
                <div class="info-row">
                  <span class="info-label">📊 Etapa</span>
                  <span class="info-value">${data.project_stage}</span>
                </div>
                ` : ''}
                ${data.budget ? `
                <div class="info-row">
                  <span class="info-label">💰 Presupuesto</span>
                  <span class="info-value">${data.budget}</span>
                </div>
                ` : ''}
                ${data.timeline ? `
                <div class="info-row">
                  <span class="info-label">⏱️ Timeline</span>
                  <span class="info-value">${data.timeline}</span>
                </div>
                ` : ''}
              </div>
              ` : ''}

              ${data.description ? `
              <div class="message-card">
                <div class="message-title">📋 Descripción del Proyecto</div>
                <div class="message-content">${data.description}</div>
              </div>
              ` : ''}

            </div>

            <!-- Footer -->
            <div class="footer-section">
              <p class="footer-info">Sistema de Gestión de Asesorías</p>
              <div class="footer-brand">AQUÍ CREAMOS</div>
              <p class="footer-meta">${currentDate} • Bogotá, Colombia</p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

export function appointmentClientTemplate(data) {
  const appointmentDate = new Date(data.date).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <div class="brand-header">
              <div class="brand-logo">AQUÍ CREAMOS</div>
              <div class="brand-name">Confirmación</div>
            </div>

            <div class="hero-section success">
              <div class="hero-icon">✅</div>
              <h1 class="hero-title">¡Asesoría Confirmada!</h1>
              <p class="hero-subtitle">Nos vemos pronto</p>
            </div>

            <div class="content-section">

              <div class="info-card">
                <div class="info-label" style="margin-bottom: 12px;">👋 Hola ${data.name.split(' ')[0]}</div>
                <div class="info-value">Tu asesoría ha sido agendada exitosamente. Aquí están los detalles:</div>
              </div>

              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">📅 Fecha</span>
                  <span class="info-value">${appointmentDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">⏰ Hora</span>
                  <span class="info-value">${data.time}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">🎯 Servicio</span>
                  <span class="info-value">${data.service || 'Consultoría'}</span>
                </div>
              </div>

              ${data.meetLink ? `
              <div class="message-card">
                <div class="message-title">🎥 Link de Google Meet</div>
                <div class="message-content">
                  <a href="${data.meetLink}" style="color: #82e256; font-weight: 600;">${data.meetLink}</a>
                  <br><br>
                  <strong>Nota:</strong> También recibirás una invitación de calendario con este link.
                </div>
              </div>
              ` : ''}

              <div class="info-card">
                <div class="info-label" style="margin-bottom: 12px;">📋 Próximos Pasos</div>
                <div class="info-value">
                  • Revisa tu email para la invitación de calendario<br>
                  • Prepara las preguntas que quieras discutir<br>
                  • Si necesitas reagendar, responde a este email
                </div>
              </div>

            </div>

            <div class="action-section">
              ${data.meetLink ? `
              <a href="${data.meetLink}" class="cta-button">
                Unirse a Google Meet
              </a>
              ` : `
              <p style="color: #9ca3af; font-size: 14px;">
                Te contactaremos pronto con más detalles
              </p>
              `}
            </div>

            <div class="footer-section">
              <p class="footer-info">¡Gracias por confiar en nosotros!</p>
              <div class="footer-brand">AQUÍ CREAMOS</div>
              <p class="footer-meta">aquicreamos.com • Bogotá, Colombia</p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

// ========================================
// BUG REPORTS
// ========================================

function getBugTypeLabel(type) {
  const labels = {
    'error': '❌ Error Funcional',
    'visual': '🎨 Problema Visual',
    'performance': '⚡ Problema de Rendimiento',
    'other': '📝 Otro',
    'not-specified': '❓ No Especificado'
  };
  return labels[type] || type;
}

export function bugReportTemplate(bugData) {
  const reportDate = new Date(bugData.timestamp).toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <div class="brand-header">
              <div class="brand-logo">AQUÍ CREAMOS</div>
              <div class="brand-name">Bug Report</div>
            </div>

            <div class="hero-section error">
              <div class="hero-icon">🐛</div>
              <h1 class="hero-title">Nuevo Bug Reportado</h1>
              <p class="hero-subtitle">${bugData.title}</p>
            </div>

            <div class="content-section">

              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">Tipo</span>
                  <span class="info-value">
                    <span class="badge error">${getBugTypeLabel(bugData.type)}</span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Página</span>
                  <span class="info-value">${bugData.page}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">URL Completa</span>
                  <span class="info-value">
                    <a href="${bugData.url}">${bugData.url}</a>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Fecha</span>
                  <span class="info-value">${reportDate}</span>
                </div>
                ${bugData.email !== 'anonymous' ? `
                <div class="info-row">
                  <span class="info-label">Email</span>
                  <span class="info-value">
                    <a href="mailto:${bugData.email}">${bugData.email}</a>
                  </span>
                </div>
                ` : ''}
              </div>

              <div class="message-card bug">
                <div class="message-title">📋 Descripción del Problema</div>
                <div class="message-content">${bugData.description}</div>
              </div>

              <div class="technical-details">
                <h4>Detalles Técnicos</h4>
                <div class="tech-info">
                  <strong>User Agent:</strong><br>
                  ${bugData.userAgent}
                </div>
                <div class="tech-info">
                  <strong>Tamaño de Pantalla:</strong> ${bugData.screenSize}
                </div>
              </div>

            </div>

            <div class="footer-section">
              <p class="footer-info">Sistema de Reporte de Bugs</p>
              <div class="footer-brand">AQUÍ CREAMOS</div>
              <p class="footer-meta">${reportDate}</p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

// ========================================
// CONTACTO
// ========================================

export function contactFormTemplate({ name, email, phone, advisoryType, description, message }) {
  const currentDate = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <div class="brand-header">
              <div class="brand-logo">PORTAFOLIO</div>
              <div class="brand-name">@DARWINYUSEF</div>
            </div>

            <div class="hero-section">
              <div class="hero-icon">📬</div>
              <h1 class="hero-title">Nueva Solicitud de Contacto</h1>
              <p class="hero-subtitle">Formulario de Contacto</p>
            </div>

            <div class="content-section">

              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">📅 Fecha</span>
                  <span class="info-value">${currentDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">👤 Nombre</span>
                  <span class="info-value">${name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">📧 Email</span>
                  <span class="info-value">
                    <a href="mailto:${email}">${email}</a>
                  </span>
                </div>
                ${phone ? `
                <div class="info-row">
                  <span class="info-label">📱 Teléfono</span>
                  <span class="info-value">
                    <a href="tel:${phone}">${phone}</a>
                  </span>
                </div>
                ` : ''}
                ${advisoryType ? `
                <div class="info-row">
                  <span class="info-label">🎯 Tipo</span>
                  <span class="info-value">${advisoryType}</span>
                </div>
                ` : ''}
              </div>

              <div class="message-card">
                <div class="message-title">💬 Mensaje</div>
                <div class="message-content">${description || message}</div>
              </div>

            </div>

            <div class="action-section">
              <a href="mailto:${email}?subject=Re: ${name}" class="cta-button">
                Responder a ${name.split(' ')[0]}
              </a>
            </div>

            <div class="footer-section">
              <p class="footer-info">Formulario de Contacto</p>
              <div class="footer-brand">@DARWINYUSEF</div>
              <p class="footer-meta">${currentDate}</p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

// ========================================
// NEWSLETTER
// ========================================

export function newsletterWelcomeTemplate(email) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <div class="brand-header">
              <div class="brand-logo">NEWSLETTER</div>
              <div class="brand-name">Bienvenido</div>
            </div>

            <div class="hero-section success">
              <div class="hero-icon">🎉</div>
              <h1 class="hero-title">¡Gracias por Suscribirte!</h1>
              <p class="hero-subtitle">Ahora formas parte de nuestra comunidad</p>
            </div>

            <div class="content-section">

              <div class="info-card">
                <div class="info-value">
                  Hola 👋<br><br>
                  Estoy emocionado de que te hayas suscrito. Recibirás actualizaciones sobre:
                </div>
              </div>

              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">🏗️</span>
                  <span class="info-value">
                    <strong>Arquitectura de Software</strong><br>
                    Patrones, mejores prácticas y diseño de sistemas
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">💻</span>
                  <span class="info-value">
                    <strong>Desarrollo Full-Stack</strong><br>
                    Tutoriales, código y proyectos prácticos
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">🤖</span>
                  <span class="info-value">
                    <strong>IA & Machine Learning</strong><br>
                    LangChain, OpenAI, TensorFlow
                  </span>
                </div>
              </div>

            </div>

            <div class="action-section">
              <a href="https://darwinyusef.com" class="cta-button">
                Visitar Portfolio
              </a>
            </div>

            <div class="footer-section">
              <p class="footer-info">¡Nos vemos pronto! 🚀</p>
              <div class="footer-brand">YUSEF GONZÁLEZ</div>
              <p class="footer-meta">Arquitecto de Software • Full-Stack Developer</p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

export function newsletterAdminNotification(email, totalSubscribers) {
  const currentDate = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        ${baseStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <div class="brand-header">
              <div class="brand-logo">NOTIFICACIÓN</div>
              <div class="brand-name">Newsletter</div>
            </div>

            <div class="hero-section">
              <div class="hero-icon">📧</div>
              <h1 class="hero-title">Nueva Suscripción</h1>
            </div>

            <div class="content-section">
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">Email</span>
                  <span class="info-value">${email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Total</span>
                  <span class="info-value">${totalSubscribers} suscriptores</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Fecha</span>
                  <span class="info-value">${currentDate}</span>
                </div>
              </div>
            </div>

            <div class="footer-section">
              <p class="footer-info">Sistema de Notificaciones</p>
              <div class="footer-brand">Portfolio</div>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

// ========================================
// RECURSOS / LEAD MAGNETS
// ========================================

export function leadMagnetTemplate({ name, email, resourceTitle, resourceUrl, resourceDescription }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <div class="brand-header">
              <div class="brand-logo">RECURSOS</div>
              <div class="brand-name">Tu Descarga</div>
            </div>

            <div class="hero-section success">
              <div class="hero-icon">🎁</div>
              <h1 class="hero-title">¡Tu Recurso está Listo!</h1>
              <p class="hero-subtitle">${resourceTitle}</p>
            </div>

            <div class="content-section">

              <div class="info-card">
                <div class="info-value">
                  Hola ${name || 'amigo/a'} 👋<br><br>
                  Gracias por descargar <strong>${resourceTitle}</strong>.
                  ${resourceDescription ? `<br><br>${resourceDescription}` : ''}
                </div>
              </div>

            </div>

            <div class="action-section">
              <a href="${resourceUrl}" class="cta-button">
                📥 Descargar ${resourceTitle}
              </a>
              <p style="margin-top: 16px; color: #6b7280; font-size: 12px;">
                Disponible por 7 días
              </p>
            </div>

            <div class="footer-section">
              <p class="footer-info">¿Te resultó útil? Sígueme en mis redes</p>
              <div class="footer-brand">YUSEF GONZÁLEZ</div>
              <p class="footer-meta">darwinyusef.com</p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

export function leadMagnetAdminNotification({ name, email, resourceTitle, resourceId }) {
  const currentDate = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        ${baseStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <div class="brand-header">
              <div class="brand-logo">NOTIFICACIÓN</div>
              <div class="brand-name">Lead Magnet</div>
            </div>

            <div class="hero-section">
              <div class="hero-icon">📊</div>
              <h1 class="hero-title">Nueva Descarga</h1>
            </div>

            <div class="content-section">
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">Recurso</span>
                  <span class="info-value">${resourceTitle}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Nombre</span>
                  <span class="info-value">${name || 'No proporcionado'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email</span>
                  <span class="info-value">
                    <a href="mailto:${email}">${email}</a>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">ID</span>
                  <span class="info-value">${resourceId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Fecha</span>
                  <span class="info-value">${currentDate}</span>
                </div>
              </div>
            </div>

            <div class="footer-section">
              <p class="footer-info">Sistema de Lead Magnets</p>
              <div class="footer-brand">Portfolio</div>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}
