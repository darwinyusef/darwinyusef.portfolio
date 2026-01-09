// ========================================
// Plantillas HTML profesionales para emails
// ========================================

export const emailStyles = `
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
      border-radius: 0;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .brand-header {
      background: #0a0a0a;
      padding: 30px 40px;
      border-bottom: 1px solid rgba(59, 130, 246, 0.1);
      text-align: center;
    }

    .brand-logo {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #3b82f6 0%, #9333ea 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
    }

    .hero-section {
      position: relative;
      padding: 50px 40px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .hero-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #3b82f6, #9333ea);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
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
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .info-label {
      font-size: 11px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .info-value {
      font-size: 16px;
      color: #f3f4f6;
      font-weight: 500;
      line-height: 1.5;
    }

    .message-card {
      background: rgba(147, 51, 234, 0.05);
      border: 1px solid rgba(147, 51, 234, 0.2);
      border-left: 3px solid #9333ea;
      border-radius: 12px;
      padding: 24px;
      margin-top: 24px;
    }

    .message-title {
      font-size: 12px;
      font-weight: 700;
      color: #9333ea;
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

    .action-section {
      text-align: center;
      padding: 30px 40px;
      background: rgba(0, 0, 0, 0.3);
    }

    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #3b82f6, #9333ea);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.5px;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
      transition: all 0.3s ease;
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
      background: linear-gradient(135deg, #3b82f6, #9333ea);
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
    }
  </style>
`;

// Plantilla para formulario de contacto / asesoría
export function contactFormTemplate({ name, email, message }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        ${emailStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <!-- Brand Header -->
            <div class="brand-header">
              <div class="brand-logo">PORTAFOLIO</div>
              <div class="brand-name">@DARWINYUSEF</div>
            </div>

            <!-- Hero Section -->
            <div class="hero-section">
              <div class="hero-icon">🏗️</div>
              <h1 class="hero-title">Nueva Solicitud de Asesoría</h1>
              <p class="hero-subtitle">Arquitectura & Diseño de Espacios</p>
            </div>

            <!-- Content Section -->
            <div class="content-section">

              <!-- Información del Cliente -->
              <div class="info-card">
                <div class="info-label">👤 Cliente</div>
                <div class="info-value">${name}</div>
              </div>

              <div class="info-card">
                <div class="info-label">📧 Email de Contacto</div>
                <div class="info-value">
                  <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none; font-weight: 600;">${email}</a>
                </div>
              </div>

              <div class="divider"></div>

              <!-- Detalles de la Solicitud -->
              <div class="message-card">
                <div class="message-title">💬 Detalles de la Solicitud</div>
                <div class="message-content">${message}</div>
              </div>

            </div>

            <!-- Action Section -->
            <div class="action-section">
              <a href="mailto:${email}?subject=Re: Solicitud de Asesoría - ${name}" class="cta-button">
                Responder a ${name.split(' ')[0]}
              </a>
            </div>

            <!-- Footer -->
            <div class="footer-section">
              <p class="footer-info">Formulario de Asesoría</p>
              <p class="footer-info">darwinyusef.com/arquitectura</p>
              <div class="footer-brand">@DARWINYUSEF</div>
              <p class="footer-meta">
                ${new Date().toLocaleString('es-ES', {
                  timeZone: 'America/Bogota',
                  dateStyle: 'long',
                  timeStyle: 'short'
                })} • Bogotá, Colombia
              </p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

// Plantilla para confirmación de suscripción a newsletter
export function newsletterWelcomeTemplate(email) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🎉 ¡Bienvenido a mi Newsletter!</h1>
            <p>Gracias por unirte a la comunidad</p>
          </div>

          <div class="content">
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 25px;">
              Hola 👋
            </p>

            <p style="font-size: 15px; color: #4b5563; line-height: 1.8;">
              Estoy emocionado de que te hayas suscrito a mi newsletter. A partir de ahora, recibirás actualizaciones exclusivas sobre:
            </p>

            <div style="margin: 30px 0;">
              <div style="padding: 15px; background: #f0f9ff; border-radius: 8px; margin-bottom: 12px;">
                <strong style="color: #0369a1;">🏗️ Arquitectura de Software</strong>
                <p style="margin: 5px 0 0 0; color: #0c4a6e; font-size: 14px;">
                  Patrones, mejores prácticas y diseño de sistemas escalables
                </p>
              </div>

              <div style="padding: 15px; background: #f5f3ff; border-radius: 8px; margin-bottom: 12px;">
                <strong style="color: #6d28d9;">💻 Desarrollo Full-Stack</strong>
                <p style="margin: 5px 0 0 0; color: #5b21b6; font-size: 14px;">
                  Tutoriales, código y proyectos prácticos
                </p>
              </div>

              <div style="padding: 15px; background: #fdf4ff; border-radius: 8px; margin-bottom: 12px;">
                <strong style="color: #c026d3;">🤖 IA & Machine Learning</strong>
                <p style="margin: 5px 0 0 0; color: #a21caf; font-size: 14px;">
                  LangChain, OpenAI, TensorFlow y proyectos con IA
                </p>
              </div>

              <div style="padding: 15px; background: #fff1f2; border-radius: 8px;">
                <strong style="color: #e11d48;">🎯 Eventos y Conferencias</strong>
                <p style="margin: 5px 0 0 0; color: #be123c; font-size: 14px;">
                  Charlas, workshops y participación en la comunidad tech
                </p>
              </div>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://darwinyusef.com" class="button">Visitar mi Portfolio</a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
              ¡Nos vemos pronto con contenido de valor! 🚀
            </p>
          </div>

          <div class="footer">
            <p class="footer-text">
              Si no solicitaste esta suscripción, puedes ignorar este correo
            </p>
            <p class="footer-brand">Yusef González</p>
            <p class="footer-text" style="font-size: 11px; margin-top: 10px;">
              Arquitecto de Software • Full-Stack Developer • IA Engineer
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Plantilla para notificación al admin de nueva suscripción
export function newsletterAdminNotification(email, totalSubscribers) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📧 Nueva Suscripción al Newsletter</h1>
          </div>

          <div class="content">
            <div class="field">
              <div class="field-label">Email del suscriptor</div>
              <div class="field-value">${email}</div>
            </div>

            <div class="field">
              <div class="field-label">Total de Suscriptores</div>
              <div class="field-value">${totalSubscribers}</div>
            </div>

            <div class="field">
              <div class="field-label">Fecha y Hora</div>
              <div class="field-value">${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</div>
            </div>
          </div>

          <div class="footer">
            <p class="footer-brand">Sistema de Notificaciones • Portfolio</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Plantilla para envío de CV
export function cvDownloadTemplate({ name, email, cvUrl }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📄 Tu CV está Listo</h1>
            <p>Gracias por tu interés en mi perfil profesional</p>
          </div>

          <div class="content">
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 20px;">
              Hola ${name || 'amigo'} 👋
            </p>

            <p style="font-size: 15px; color: #4b5563; line-height: 1.8; margin-bottom: 30px;">
              Gracias por tu interés en conocer más sobre mi experiencia profesional.
              A continuación encontrarás el enlace para descargar mi Curriculum Vitae actualizado.
            </p>

            <div style="background: linear-gradient(135deg, #f0f9ff, #fdf4ff); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 14px;">
                📥 Descarga disponible por 7 días
              </p>
              <a href="${cvUrl}" class="button" style="font-size: 16px; padding: 15px 40px;">
                Descargar CV (PDF)
              </a>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #1f2937;">
                🚀 Más sobre mi trabajo:
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                <li style="margin: 8px 0;">Portfolio: <a href="https://darwinyusef.com" style="color: #3b82f6;">darwinyusef.com</a></li>
                <li style="margin: 8px 0;">GitHub: <a href="https://github.com/darwinyusef" style="color: #3b82f6;">@darwinyusef</a></li>
                <li style="margin: 8px 0;">LinkedIn: <a href="https://linkedin.com/in/darwinyusef" style="color: #3b82f6;">Yusef González</a></li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
              Si tienes alguna pregunta o quieres discutir una oportunidad, no dudes en responder a este email.
            </p>
          </div>

          <div class="footer">
            <p class="footer-brand">Yusef González</p>
            <p class="footer-text">Arquitecto de Software • Full-Stack Developer • IA Engineer</p>
            <p class="footer-text" style="font-size: 11px; margin-top: 10px;">
              📧 wsgestor@gmail.com
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Plantilla para envío de recurso descargable (Lead Magnet)
export function leadMagnetTemplate({ name, email, resourceTitle, resourceUrl, resourceDescription }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🎁 ¡Tu Recurso está Listo!</h1>
            <p>Gracias por tu interés - Aquí está tu descarga</p>
          </div>

          <div class="content">
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 20px;">
              Hola ${name || 'amigo/a'} 👋
            </p>

            <p style="font-size: 15px; color: #4b5563; line-height: 1.8; margin-bottom: 30px;">
              Gracias por descargar <strong>${resourceTitle}</strong>. Este recurso ha sido creado
              para ayudarte a mejorar tus habilidades y conocimientos.
            </p>

            ${resourceDescription ? `
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 25px 0;">
              <p style="margin: 0; color: #0c4a6e; font-size: 14px; line-height: 1.6;">
                <strong>📌 Sobre este recurso:</strong><br>
                ${resourceDescription}
              </p>
            </div>
            ` : ''}

            <div style="background: linear-gradient(135deg, #f0f9ff, #fdf4ff); padding: 30px; border-radius: 12px; margin: 35px 0; text-align: center;">
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 14px; font-weight: 600;">
                📥 Descarga disponible
              </p>
              <a href="${resourceUrl}" class="button" style="font-size: 16px; padding: 15px 40px;">
                Descargar ${resourceTitle}
              </a>
              <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px;">
                El enlace estará disponible por 7 días
              </p>
            </div>

            <div style="background: #fefce8; padding: 20px; border-radius: 8px; border-left: 4px solid #eab308; margin: 30px 0;">
              <p style="margin: 0 0 12px 0; font-weight: 600; color: #713f12;">
                💡 ¿Te resultó útil este recurso?
              </p>
              <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.6;">
                Tengo más contenido valioso para compartir contigo. Sígueme en mis redes
                o suscríbete al newsletter para recibir actualizaciones exclusivas.
              </p>
            </div>

            <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0 0 15px 0; font-weight: 600; color: #1f2937;">
                🔗 Conecta conmigo:
              </p>
              <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                <a href="https://darwinyusef.com" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                  🌐 Portfolio
                </a>
                <a href="https://github.com/darwinyusef" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                  💻 GitHub
                </a>
                <a href="https://linkedin.com/in/darwinyusef" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                  👔 LinkedIn
                </a>
                <a href="https://youtube.com/@darwinyusef" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                  🎥 YouTube
                </a>
              </div>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 35px; line-height: 1.6;">
              ¿Tienes preguntas o sugerencias? Responde a este email,<br>
              me encantaría saber tu opinión.
            </p>
          </div>

          <div class="footer">
            <p class="footer-brand">Yusef González</p>
            <p class="footer-text">Arquitecto de Software • Full-Stack Developer • IA Engineer</p>
            <p class="footer-text" style="font-size: 11px; margin-top: 10px;">
              📧 wsgestor@gmail.com
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Plantilla para notificación al admin sobre descarga de recurso
export function leadMagnetAdminNotification({ name, email, resourceTitle, resourceId }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📊 Nueva Descarga de Recurso</h1>
            <p>Lead Magnet capturado</p>
          </div>

          <div class="content">
            <div class="field">
              <div class="field-label">📄 Recurso Descargado</div>
              <div class="field-value">${resourceTitle}</div>
            </div>

            <div class="field">
              <div class="field-label">👤 Nombre</div>
              <div class="field-value">${name || 'No proporcionado'}</div>
            </div>

            <div class="field">
              <div class="field-label">📧 Email</div>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
              </div>
            </div>

            <div class="field">
              <div class="field-label">🔑 ID del Recurso</div>
              <div class="field-value">${resourceId}</div>
            </div>

            <div class="field">
              <div class="field-label">🕒 Fecha y Hora</div>
              <div class="field-value">${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</div>
            </div>

            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-top: 25px;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                💡 <strong>Tip:</strong> Este es un nuevo lead. Considera agregarlos a tu lista de email marketing
                o CRM para seguimiento.
              </p>
            </div>
          </div>

          <div class="footer">
            <p class="footer-brand">Sistema de Lead Magnets • Portfolio</p>
            <p class="footer-text">${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Plantilla para testimonio recibido
export function testimonialTemplate({ name, role, company, email, content, rating }) {
  const stars = '⭐'.repeat(rating);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${emailStyles}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>⭐ Nuevo Testimonio Recibido</h1>
            <p>Calificación: ${stars} (${rating}/5)</p>
          </div>

          <div class="content">
            <div class="field">
              <div class="field-label">👤 Nombre</div>
              <div class="field-value">${name}</div>
            </div>

            ${role ? `
            <div class="field">
              <div class="field-label">💼 Rol</div>
              <div class="field-value">${role}</div>
            </div>
            ` : ''}

            ${company ? `
            <div class="field">
              <div class="field-label">🏢 Empresa</div>
              <div class="field-value">${company}</div>
            </div>
            ` : ''}

            ${email ? `
            <div class="field">
              <div class="field-label">📧 Email</div>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
              </div>
            </div>
            ` : ''}

            <div class="divider"></div>

            <div class="field-label" style="margin-bottom: 15px;">💬 Testimonio</div>
            <div class="message-box">${content}</div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #78350f; font-size: 13px;">
                ⚠️ <strong>Importante:</strong> Este testimonio requiere aprobación antes de ser publicado en el portafolio.
              </p>
            </div>
          </div>

          <div class="footer">
            <p class="footer-brand">Sistema de Testimonios • Portfolio</p>
            <p class="footer-text">${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Plantilla de confirmación para usuario que solicita asesoría de arquitectura
export function architectureConfirmationTemplate({ name, message }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        ${emailStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <!-- Brand Header -->
            <div class="brand-header">
              <div class="brand-logo">PORTAFOLIO</div>
              <div class="brand-name">@DARWINYUSEF</div>
            </div>

            <!-- Hero Section -->
            <div class="hero-section">
              <div class="hero-icon">✅</div>
              <h1 class="hero-title">Solicitud Recibida</h1>
              <p class="hero-subtitle">Asesoría en Arquitectura & Diseño de Espacios</p>
            </div>

            <!-- Content Section -->
            <div class="content-section">

              <div class="info-card">
                <div class="info-label">👋 Hola ${name.split(' ')[0]}</div>
                <div class="info-value">Hemos recibido tu solicitud de asesoría arquitectónica</div>
              </div>

              <div class="message-card">
                <div class="message-title">📋 Resumen de tu Solicitud</div>
                <div class="message-content">${message}</div>
              </div>

              <div class="info-card">
                <div class="info-label">⏰ Próximos Pasos</div>
                <div class="info-value">
                  Te contactaremos en las próximas 24-48 horas para coordinar la fecha de la cita y discutir los detalles de tu proyecto.
                </div>
              </div>

            </div>

            <!-- Action Section -->
            <div class="action-section">
              <p style="color: #9ca3af; font-size: 14px; margin-bottom: 16px;">
                Mientras tanto, puedes explorar mi portafolio:
              </p>
              <a href="https://darwinyusef.com" class="cta-button">
                🌐 Ver Portafolio
              </a>
            </div>

            <!-- Footer -->
            <div class="footer-section">
              <p class="footer-info">Gracias por confiar en nuestros servicios</p>
              <div class="footer-brand">@DARWINYUSEF</div>
              <p class="footer-meta">
                ${new Date().toLocaleString('es-ES', {
                  timeZone: 'America/Bogota',
                  dateStyle: 'long',
                  timeStyle: 'short'
                })} • Bogotá, Colombia
              </p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}
