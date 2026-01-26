import { createEmailLayout, createInfoCard, createMessageCard, createDivider } from './base/layout.js';

// ========================================
// URLs de Logos
// ========================================

const DARWINYUSEF_LOGO = 'https://darwinyusef.com/favicon.svg';
const AQUICREAMOS_LOGO = 'https://aquicreamos.com/img/logoAquicreamos.png';

// ========================================
// Template: Formulario de Contacto
// ========================================

export function contactFormTemplate({ name, email, phone, advisoryType, description, message }) {
  const content = `
    ${createInfoCard({
      emoji: '👤',
      label: 'Cliente',
      value: name
    })}

    ${createInfoCard({
      emoji: '📧',
      label: 'Email de Contacto',
      value: `<a href="mailto:${email}">${email}</a>`
    })}

    ${phone ? createInfoCard({
      emoji: '📱',
      label: 'Teléfono',
      value: `<a href="tel:${phone}">${phone}</a>`
    }) : ''}

    ${advisoryType ? createInfoCard({
      emoji: '🎯',
      label: 'Tipo de Asesoría',
      value: advisoryType
    }) : ''}

    ${createDivider()}

    ${createMessageCard({
      title: '💬 MENSAJE DEL CLIENTE',
      content: description || message
    })}
  `;

  return createEmailLayout({
    logoUrl: DARWINYUSEF_LOGO,
    brandName: '@DARWINYUSEF',
    brandTagline: 'Full-Stack Developer & Software Architect',
    heroIcon: '📬',
    heroTitle: 'Nuevo Mensaje de Contacto',
    heroSubtitle: 'Solicitud desde el formulario de contacto',
    content,
    ctaText: `Responder a ${name.split(' ')[0]}`,
    ctaUrl: `mailto:${email}?subject=Re: Consulta desde Portfolio`,
    footerText: 'Sistema de Contacto • darwinyusef.com',
    footerLinks: [
      { text: '🌐 Portfolio', url: 'https://darwinyusef.com' },
      { text: '💼 LinkedIn', url: 'https://linkedin.com/in/darwinyusef' },
      { text: '💻 GitHub', url: 'https://github.com/darwinyusef' }
    ]
  });
}

// ========================================
// Template: Newsletter Welcome
// ========================================

export function newsletterWelcomeTemplate(email) {
  const content = `
    ${createInfoCard({
      emoji: '🎉',
      label: 'Bienvenido a la Comunidad',
      value: '¡Gracias por suscribirte! A partir de ahora recibirás contenido exclusivo.'
    })}

    ${createDivider()}

    <div style="margin: 30px 0;">
      <div style="padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 12px; margin-bottom: 16px;">
        <strong style="color: #667eea; font-size: 16px;">🏗️ Arquitectura de Software</strong>
        <p style="margin: 8px 0 0 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
          Patrones, mejores prácticas y diseño de sistemas escalables
        </p>
      </div>

      <div style="padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 12px; margin-bottom: 16px;">
        <strong style="color: #667eea; font-size: 16px;">💻 Desarrollo Full-Stack</strong>
        <p style="margin: 8px 0 0 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
          Tutoriales, código y proyectos prácticos
        </p>
      </div>

      <div style="padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 12px; margin-bottom: 16px;">
        <strong style="color: #667eea; font-size: 16px;">🤖 IA & Machine Learning</strong>
        <p style="margin: 8px 0 0 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
          LangChain, OpenAI, TensorFlow y proyectos con IA
        </p>
      </div>
    </div>

    ${createInfoCard({
      emoji: '🚀',
      label: 'Próximamente',
      value: 'Prepárate para recibir contenido de valor que te ayudará a mejorar tus habilidades tech'
    })}
  `;

  return createEmailLayout({
    logoUrl: DARWINYUSEF_LOGO,
    brandName: '@DARWINYUSEF',
    brandTagline: 'Full-Stack Developer & Software Architect',
    heroIcon: '✨',
    heroTitle: '¡Bienvenido al Newsletter!',
    heroSubtitle: 'Gracias por unirte a la comunidad tech',
    content,
    ctaText: 'Explorar Portfolio',
    ctaUrl: 'https://darwinyusef.com',
    footerText: 'Newsletter • darwinyusef.com',
    footerLinks: [
      { text: '🌐 Portfolio', url: 'https://darwinyusef.com' },
      { text: '🎥 YouTube', url: 'https://youtube.com/@darwinyusef' },
      { text: '💻 GitHub', url: 'https://github.com/darwinyusef' }
    ]
  });
}

// ========================================
// Template: Newsletter Admin Notification
// ========================================

export function newsletterAdminNotification(email, totalSubscribers) {
  const content = `
    ${createInfoCard({
      emoji: '📧',
      label: 'Email del Suscriptor',
      value: email
    })}

    ${createInfoCard({
      emoji: '📊',
      label: 'Total de Suscriptores',
      value: `<strong style="font-size: 24px; color: #667eea;">${totalSubscribers}</strong>`
    })}

    ${createInfoCard({
      emoji: '🕒',
      label: 'Fecha y Hora',
      value: new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })
    })}
  `;

  return createEmailLayout({
    logoUrl: DARWINYUSEF_LOGO,
    brandName: 'ADMIN PANEL',
    brandTagline: 'Sistema de Notificaciones',
    heroIcon: '📧',
    heroTitle: 'Nueva Suscripción',
    heroSubtitle: 'Newsletter darwinyusef.com',
    content,
    footerText: 'Sistema Automático de Notificaciones'
  });
}

// ========================================
// Template: CV Download
// ========================================

export function cvDownloadTemplate({ name, email, cvUrl }) {
  const content = `
    ${createInfoCard({
      emoji: '👋',
      label: `Hola ${name || 'amigo'}`,
      value: 'Gracias por tu interés en mi perfil profesional. Aquí está tu CV solicitado.'
    })}

    <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); padding: 32px; border-radius: 16px; margin: 32px 0; text-align: center; border: 2px solid #667eea;">
      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 15px; font-weight: 600;">
        📥 Descarga disponible por 7 días
      </p>
      <a href="${cvUrl}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px;">
        Descargar CV (PDF)
      </a>
    </div>

    ${createDivider()}

    ${createInfoCard({
      emoji: '🚀',
      label: 'Más Sobre Mi Trabajo',
      value: `
        <a href="https://darwinyusef.com" style="color: #667eea; text-decoration: none; font-weight: 600;">Portfolio</a> •
        <a href="https://github.com/darwinyusef" style="color: #667eea; text-decoration: none; font-weight: 600;">GitHub</a> •
        <a href="https://linkedin.com/in/darwinyusef" style="color: #667eea; text-decoration: none; font-weight: 600;">LinkedIn</a>
      `
    })}
  `;

  return createEmailLayout({
    logoUrl: DARWINYUSEF_LOGO,
    brandName: '@DARWINYUSEF',
    brandTagline: 'Full-Stack Developer & Software Architect',
    heroIcon: '📄',
    heroTitle: 'Tu CV está Listo',
    heroSubtitle: 'Curriculum Vitae - Yusef González',
    content,
    footerText: 'CV Download • darwinyusef.com',
    footerLinks: [
      { text: '📧 wsgestor@gmail.com', url: 'mailto:wsgestor@gmail.com' }
    ]
  });
}

// ========================================
// Template: Lead Magnet
// ========================================

export function leadMagnetTemplate({ name, email, resourceTitle, resourceUrl, resourceDescription }) {
  const content = `
    ${createInfoCard({
      emoji: '👋',
      label: `Hola ${name || 'amigo/a'}`,
      value: `Gracias por descargar <strong>${resourceTitle}</strong>. Este recurso ha sido creado para ayudarte a mejorar tus habilidades.`
    })}

    ${resourceDescription ? `
    <div style="background: #f0f9ff; padding: 24px; border-radius: 12px; border-left: 6px solid #667eea; margin: 24px 0;">
      <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.7; font-weight: 500;">
        <strong>📌 Sobre este recurso:</strong><br>
        ${resourceDescription}
      </p>
    </div>
    ` : ''}

    <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); padding: 36px; border-radius: 16px; margin: 32px 0; text-align: center; border: 2px solid #667eea;">
      <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; font-weight: 700;">
        📥 Tu recurso está listo
      </p>
      <a href="${resourceUrl}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px;">
        Descargar ${resourceTitle}
      </a>
      <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 13px; font-weight: 500;">
        Enlace disponible por 7 días
      </p>
    </div>

    ${createDivider()}

    ${createInfoCard({
      emoji: '💡',
      label: '¿Te Resultó Útil?',
      value: 'Sígueme en mis redes o suscríbete al newsletter para recibir más contenido exclusivo.'
    })}
  `;

  return createEmailLayout({
    logoUrl: DARWINYUSEF_LOGO,
    brandName: '@DARWINYUSEF',
    brandTagline: 'Full-Stack Developer & Software Architect',
    heroIcon: '🎁',
    heroTitle: '¡Tu Recurso está Listo!',
    heroSubtitle: `Descarga: ${resourceTitle}`,
    content,
    ctaText: 'Explorar Más Recursos',
    ctaUrl: 'https://darwinyusef.com',
    footerText: 'Recursos • darwinyusef.com',
    footerLinks: [
      { text: '🌐 Portfolio', url: 'https://darwinyusef.com' },
      { text: '💻 GitHub', url: 'https://github.com/darwinyusef' },
      { text: '🎥 YouTube', url: 'https://youtube.com/@darwinyusef' }
    ]
  });
}

// ========================================
// Template: Lead Magnet Admin Notification
// ========================================

export function leadMagnetAdminNotification({ name, email, resourceTitle, resourceId }) {
  const content = `
    ${createInfoCard({
      emoji: '📄',
      label: 'Recurso Descargado',
      value: resourceTitle
    })}

    ${createInfoCard({
      emoji: '👤',
      label: 'Nombre',
      value: name || 'No proporcionado'
    })}

    ${createInfoCard({
      emoji: '📧',
      label: 'Email',
      value: `<a href="mailto:${email}">${email}</a>`
    })}

    ${createInfoCard({
      emoji: '🔑',
      label: 'ID del Recurso',
      value: resourceId
    })}

    <div style="background: #ecfdf5; padding: 24px; border-radius: 12px; border-left: 6px solid #10b981; margin-top: 28px;">
      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600; line-height: 1.6;">
        💡 <strong>Tip:</strong> Este es un nuevo lead. Considera agregarlo a tu lista de email marketing o CRM para seguimiento.
      </p>
    </div>
  `;

  return createEmailLayout({
    logoUrl: DARWINYUSEF_LOGO,
    brandName: 'ADMIN PANEL',
    brandTagline: 'Sistema de Lead Magnets',
    heroIcon: '📊',
    heroTitle: 'Nuevo Lead Capturado',
    heroSubtitle: `Descarga de recurso: ${resourceTitle}`,
    content,
    footerText: 'Sistema Automático de Notificaciones'
  });
}

// ========================================
// Template: Testimonio
// ========================================

export function testimonialTemplate({ name, role, company, email, content, rating }) {
  const stars = '⭐'.repeat(rating);

  const emailContent = `
    ${createInfoCard({
      emoji: '⭐',
      label: 'Calificación',
      value: `${stars} (${rating}/5)`
    })}

    ${createInfoCard({
      emoji: '👤',
      label: 'Nombre',
      value: name
    })}

    ${role ? createInfoCard({
      emoji: '💼',
      label: 'Rol',
      value: role
    }) : ''}

    ${company ? createInfoCard({
      emoji: '🏢',
      label: 'Empresa',
      value: company
    }) : ''}

    ${email ? createInfoCard({
      emoji: '📧',
      label: 'Email',
      value: `<a href="mailto:${email}">${email}</a>`
    }) : ''}

    ${createDivider()}

    ${createMessageCard({
      title: '💬 TESTIMONIO',
      content
    })}

    <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-top: 28px; border-left: 6px solid #f59e0b;">
      <p style="margin: 0; color: #78350f; font-size: 14px; font-weight: 600;">
        ⚠️ <strong>Importante:</strong> Este testimonio requiere aprobación antes de ser publicado.
      </p>
    </div>
  `;

  return createEmailLayout({
    logoUrl: DARWINYUSEF_LOGO,
    brandName: 'ADMIN PANEL',
    brandTagline: 'Sistema de Testimonios',
    heroIcon: '⭐',
    heroTitle: 'Nuevo Testimonio Recibido',
    heroSubtitle: `De: ${name}`,
    content: emailContent,
    footerText: 'Sistema Automático de Notificaciones'
  });
}

// ========================================
// Template: Architecture Confirmation
// ========================================

export function architectureConfirmationTemplate({ name, phone, advisoryType, description, message }) {
  const content = `
    ${createInfoCard({
      emoji: '✅',
      label: 'Solicitud Recibida',
      value: `Hola ${name.split(' ')[0]}, hemos recibido tu solicitud de asesoría arquitectónica.`
    })}

    ${advisoryType ? createInfoCard({
      emoji: '🎯',
      label: 'Tipo de Asesoría',
      value: advisoryType
    }) : ''}

    ${createMessageCard({
      title: '📋 RESUMEN DE TU SOLICITUD',
      content: description || message
    })}

    ${createDivider()}

    ${createInfoCard({
      emoji: '⏰',
      label: 'Próximos Pasos',
      value: `Te contactaremos en las próximas 24-48 horas ${phone ? `al teléfono ${phone}` : 'por email'} para coordinar la fecha de la cita.`
    })}
  `;

  return createEmailLayout({
    logoUrl: DARWINYUSEF_LOGO,
    brandName: '@DARWINYUSEF',
    brandTagline: 'Arquitectura & Diseño de Espacios',
    heroIcon: '✅',
    heroTitle: 'Solicitud Confirmada',
    heroSubtitle: 'Asesoría en Arquitectura',
    content,
    ctaText: 'Ver Portfolio',
    ctaUrl: 'https://darwinyusef.com',
    footerText: 'Asesoría Arquitectónica • darwinyusef.com',
    footerLinks: [
      { text: '🌐 Portfolio', url: 'https://darwinyusef.com' }
    ]
  });
}

// ========================================
// Template: Appointment Admin (AquiCreamos)
// ========================================

export function appointmentAdminTemplate(data) {
  const appointmentDate = new Date(data.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Bogota'
  });

  const content = `
    ${createInfoCard({
      emoji: '📅',
      label: 'Fecha de Asesoría',
      value: appointmentDate
    })}

    ${createInfoCard({
      emoji: '⏰',
      label: 'Hora',
      value: data.time
    })}

    ${data.meetLink ? createInfoCard({
      emoji: '🎥',
      label: 'Google Meet',
      value: `<a href="${data.meetLink}">${data.meetLink}</a>`
    }) : ''}

    ${createDivider()}

    ${createInfoCard({
      emoji: '👤',
      label: 'Cliente',
      value: data.name
    })}

    ${createInfoCard({
      emoji: '📧',
      label: 'Email',
      value: `<a href="mailto:${data.email}">${data.email}</a>`
    })}

    ${data.phone ? createInfoCard({
      emoji: '📱',
      label: 'Teléfono',
      value: `<a href="tel:${data.phone}">${data.phone}</a>`
    }) : ''}

    ${data.company ? createInfoCard({
      emoji: '🏢',
      label: 'Empresa',
      value: data.company
    }) : ''}

    ${createDivider()}

    ${data.project_type ? createInfoCard({
      emoji: '🎯',
      label: 'Tipo de Proyecto',
      value: data.project_type
    }) : ''}

    ${data.project_stage ? createInfoCard({
      emoji: '📊',
      label: 'Etapa del Proyecto',
      value: data.project_stage
    }) : ''}

    ${data.budget ? createInfoCard({
      emoji: '💰',
      label: 'Presupuesto',
      value: data.budget
    }) : ''}

    ${data.timeline ? createInfoCard({
      emoji: '⏱️',
      label: 'Timeline',
      value: data.timeline
    }) : ''}

    ${data.description ? createMessageCard({
      title: '📋 DESCRIPCIÓN DEL PROYECTO',
      content: data.description
    }) : ''}
  `;

  return createEmailLayout({
    logoUrl: AQUICREAMOS_LOGO,
    brandName: 'AQUICREAMOS',
    brandTagline: 'Desarrollo de Software & Consultoría',
    heroIcon: '📅',
    heroTitle: 'Nueva Asesoría Agendada',
    heroSubtitle: data.service || 'Consultoría Técnica',
    content,
    footerText: 'Sistema de Gestión de Asesorías',
    footerLinks: [
      { text: '🌐 AquiCreamos', url: 'https://aquicreamos.com' }
    ]
  });
}

// ========================================
// Template: Appointment Client Confirmation (AquiCreamos)
// ========================================

export function appointmentClientTemplate(data) {
  const appointmentDate = new Date(data.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Bogota'
  });

  const content = `
    ${createInfoCard({
      emoji: '👋',
      label: `Hola ${data.name.split(' ')[0]}`,
      value: 'Tu asesoría ha sido agendada exitosamente. Aquí están los detalles:'
    })}

    ${createDivider()}

    ${createInfoCard({
      emoji: '📅',
      label: 'Fecha',
      value: appointmentDate
    })}

    ${createInfoCard({
      emoji: '⏰',
      label: 'Hora',
      value: data.time
    })}

    ${createInfoCard({
      emoji: '🎯',
      label: 'Servicio',
      value: data.service || 'Consultoría Técnica'
    })}

    ${data.meetLink ? `
    <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); padding: 28px; border-radius: 16px; margin: 32px 0; text-align: center; border: 2px solid #667eea;">
      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; font-weight: 700;">
        🎥 Link de la Reunión
      </p>
      <a href="${data.meetLink}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px;">
        Unirse a Google Meet
      </a>
    </div>
    ` : ''}

    ${createDivider()}

    ${createInfoCard({
      emoji: '📝',
      label: 'Preparación',
      value: 'Te recomendamos tener lista cualquier información o documento relevante para la asesoría.'
    })}

    ${createInfoCard({
      emoji: '📧',
      label: '¿Necesitas Reprogramar?',
      value: 'Si necesitas cambiar la fecha u hora, responde a este email con al menos 24 horas de anticipación.'
    })}
  `;

  return createEmailLayout({
    logoUrl: AQUICREAMOS_LOGO,
    brandName: 'AQUICREAMOS',
    brandTagline: 'Desarrollo de Software & Consultoría',
    heroIcon: '✅',
    heroTitle: '¡Asesoría Confirmada!',
    heroSubtitle: 'Nos vemos pronto',
    content,
    ctaText: data.meetLink ? 'Agregar a Calendario' : 'Visitar AquiCreamos',
    ctaUrl: data.meetLink || 'https://aquicreamos.com',
    footerText: 'Asesorías • aquicreamos.com',
    footerLinks: [
      { text: '🌐 AquiCreamos', url: 'https://aquicreamos.com' },
      { text: '📧 Contacto', url: 'mailto:contacto@aquicreamos.com' }
    ]
  });
}

// ========================================
// Template: Bug Report (AquiCreamos)
// ========================================

export function bugReportTemplate(bugData) {
  const reportDate = new Date(bugData.timestamp).toLocaleString('es-ES', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const content = `
    ${createInfoCard({
      emoji: '🐛',
      label: 'Tipo de Bug',
      value: bugData.type || 'No especificado'
    })}

    ${createInfoCard({
      emoji: '📄',
      label: 'Página Afectada',
      value: bugData.page
    })}

    ${createInfoCard({
      emoji: '🔗',
      label: 'URL Completa',
      value: `<a href="${bugData.url}">${bugData.url}</a>`
    })}

    ${createInfoCard({
      emoji: '🕒',
      label: 'Fecha del Reporte',
      value: reportDate
    })}

    ${bugData.email && bugData.email !== 'anonymous' ? createInfoCard({
      emoji: '📧',
      label: 'Email del Usuario',
      value: `<a href="mailto:${bugData.email}">${bugData.email}</a>`
    }) : ''}

    ${createDivider()}

    ${createMessageCard({
      title: '📋 DESCRIPCIÓN DEL PROBLEMA',
      content: bugData.description
    })}

    ${createDivider()}

    <div style="background: #f9fafb; padding: 24px; border-radius: 12px; border: 2px solid #e5e7eb; margin: 24px 0;">
      <p style="margin: 0 0 16px 0; font-weight: 700; color: #111827; font-size: 14px;">
        🔧 DETALLES TÉCNICOS
      </p>
      <div style="margin-bottom: 12px;">
        <strong style="color: #6b7280; font-size: 13px;">User Agent:</strong><br>
        <code style="background: #f3f4f6; padding: 8px 12px; border-radius: 6px; display: block; margin-top: 6px; font-size: 12px; color: #374151; word-break: break-all;">
          ${bugData.userAgent}
        </code>
      </div>
      ${bugData.screenSize ? `
      <div>
        <strong style="color: #6b7280; font-size: 13px;">Tamaño de Pantalla:</strong>
        <span style="color: #111827; margin-left: 8px; font-weight: 600;">${bugData.screenSize}</span>
      </div>
      ` : ''}
    </div>
  `;

  return createEmailLayout({
    logoUrl: AQUICREAMOS_LOGO,
    brandName: 'AQUICREAMOS',
    brandTagline: 'Sistema de Reporte de Bugs',
    heroIcon: '🐛',
    heroTitle: 'Nuevo Bug Reportado',
    heroSubtitle: bugData.title || 'Problema reportado por usuario',
    content,
    footerText: 'Sistema Automático de Bugs',
    footerLinks: [
      { text: '🌐 AquiCreamos', url: 'https://aquicreamos.com' }
    ]
  });
}

// Mantener exportación de emailStyles para compatibilidad
export { emailStyles } from './base/styles.js';
