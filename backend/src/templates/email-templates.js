// ========================================
// Plantillas HTML profesionales para emails
// ========================================

export const emailStyles = `
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .field {
      margin-bottom: 25px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }
    .field-label {
      font-weight: 600;
      color: #3b82f6;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .field-value {
      color: #1f2937;
      font-size: 16px;
      word-wrap: break-word;
    }
    .message-box {
      background: #ffffff;
      padding: 25px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      border-left: 4px solid #8b5cf6;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.8;
    }
    .footer {
      text-align: center;
      padding: 30px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      color: #6b7280;
      font-size: 13px;
      margin: 5px 0;
    }
    .footer-brand {
      color: #3b82f6;
      font-weight: 600;
      font-size: 16px;
      margin-top: 10px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
      margin: 30px 0;
    }
  </style>
`;

// Plantilla para formulario de contacto
export function contactFormTemplate({ name, email, message }) {
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
            <h1>📬 Nuevo Mensaje de Contacto</h1>
            <p>Recibiste una nueva consulta desde tu portafolio</p>
          </div>

          <div class="content">
            <div class="field">
              <div class="field-label">👤 Nombre</div>
              <div class="field-value">${name}</div>
            </div>

            <div class="field">
              <div class="field-label">📧 Email de Contacto</div>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
              </div>
            </div>

            <div class="divider"></div>

            <div class="field-label" style="margin-bottom: 15px;">💬 Mensaje</div>
            <div class="message-box">${message}</div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" class="button">Responder a ${name}</a>
            </div>
          </div>

          <div class="footer">
            <p class="footer-text">Este mensaje fue enviado desde el formulario de contacto</p>
            <p class="footer-brand">Yusef González • Portfolio</p>
            <p class="footer-text" style="font-size: 11px; color: #9ca3af; margin-top: 15px;">
              ${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
            </p>
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
