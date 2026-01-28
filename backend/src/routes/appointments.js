import express from 'express';
import { Resend } from 'resend';
import { google } from 'googleapis';
import { getOAuth2Client } from '../services/google-auth.js';
import { saveAppointment, updateAppointmentCalendarInfo, isSlotAvailable } from '../services/database.js';

const router = express.Router();

// Función para convertir códigos de tipo de asesoría a etiquetas
function getAdvisoryTypeLabel(type) {
  const labels = {
    'new_project': 'Tengo una idea nueva',
    'improve_existing': 'Mejorar lo que tengo',
    'scale_business': 'Crecer mi negocio',
    'ai_integration': 'Usar Inteligencia Artificial',
    'fix_problems': 'Resolver problemas',
    'guide_team': 'Guiar mi equipo técnico',
    'project_stuck': 'Mi proyecto está estancado',
    'limited_budget': 'Tengo presupuesto limitado',
    'validate_idea': 'Validar mi idea de negocio',
    'migrate_tech': 'Actualizar tecnología antigua',
    'security': 'Mejorar la seguridad',
    'integration': 'Conectar mis sistemas',
    'not_sure': 'No estoy seguro'
  };
  return labels[type] || type;
}

// Template de email para el admin (notificación de nueva asesoría)
function appointmentAdminTemplate(data) {
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
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: #0a0a0a;
            color: #e5e7eb;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #0f0f0f;
            border-radius: 12px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #82e256 0%, #6bc73d 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: #000;
            font-size: 24px;
            font-weight: 800;
          }
          .content {
            padding: 40px 30px;
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
          }
          .info-value {
            font-size: 16px;
            color: #f3f4f6;
            font-weight: 500;
          }
          .highlight {
            background: linear-gradient(135deg, rgba(130, 226, 86, 0.1) 0%, rgba(107, 199, 61, 0.1) 100%);
            border: 1px solid rgba(130, 226, 86, 0.3);
            border-left: 3px solid #82e256;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .footer {
            background: #0a0a0a;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          a {
            color: #82e256;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Nueva Asesoría Agendada</h1>
          </div>

          <div class="content">
            <div class="info-card">
              <div class="info-label">📅 Fecha de Recepción</div>
              <div class="info-value">${currentDate}</div>
            </div>

            <div class="highlight">
              <div class="info-label">🗓️ Fecha y Hora de la Asesoría</div>
              <div class="info-value" style="font-size: 20px; color: #82e256;">
                ${appointmentDate} a las ${data.time}
              </div>
            </div>

            <div class="info-card">
              <div class="info-label">👤 Cliente</div>
              <div class="info-value">${data.name}</div>
            </div>

            <div class="info-card">
              <div class="info-label">📧 Email</div>
              <div class="info-value">
                <a href="mailto:${data.email}">${data.email}</a>
              </div>
            </div>

            <div class="info-card">
              <div class="info-label">📱 Teléfono</div>
              <div class="info-value">
                <a href="tel:${data.phone}">${data.phone}</a>
              </div>
            </div>

            ${data.company ? `
            <div class="info-card">
              <div class="info-label">🏢 Empresa</div>
              <div class="info-value">${data.company}</div>
            </div>
            ` : ''}

            <div class="info-card">
              <div class="info-label">🎯 Servicio Seleccionado</div>
              <div class="info-value">${data.service}</div>
            </div>

            ${data.advisory_type ? `
            <div class="info-card">
              <div class="info-label">📋 Tipo de Asesoría Inicial</div>
              <div class="info-value">${getAdvisoryTypeLabel(data.advisory_type)}</div>
            </div>
            ` : ''}

            ${data.project_type ? `
            <div class="info-card">
              <div class="info-label">💼 Tipo de Proyecto</div>
              <div class="info-value">${data.project_type}</div>
            </div>
            ` : ''}

            ${data.budget ? `
            <div class="info-card">
              <div class="info-label">💰 Presupuesto</div>
              <div class="info-value">${data.budget}</div>
            </div>
            ` : ''}

            ${data.timeline ? `
            <div class="info-card">
              <div class="info-label">⏱️ Timeline</div>
              <div class="info-value">${data.timeline}</div>
            </div>
            ` : ''}

            ${data.expected_users ? `
            <div class="info-card">
              <div class="info-label">👥 Usuarios Esperados</div>
              <div class="info-value">${data.expected_users}</div>
            </div>
            ` : ''}

            ${data.features && (Array.isArray(data.features) ? data.features.length > 0 : data.features) ? `
            <div class="info-card">
              <div class="info-label">✨ Funcionalidades Clave</div>
              <div class="info-value">${Array.isArray(data.features) ? data.features.join(', ') : data.features}</div>
            </div>
            ` : ''}

            ${data.tech_preferences ? `
            <div class="info-card">
              <div class="info-label">⚙️ Preferencias Tecnológicas</div>
              <div class="info-value">${data.tech_preferences}</div>
            </div>
            ` : ''}

            ${data.has_team ? `
            <div class="info-card">
              <div class="info-label">👨‍💻 Equipo Técnico</div>
              <div class="info-value">${data.has_team}</div>
            </div>
            ` : ''}

            ${data.priority ? `
            <div class="info-card">
              <div class="info-label">🎯 Prioridad Principal</div>
              <div class="info-value">${data.priority}</div>
            </div>
            ` : ''}

            ${data.description ? `
            <div class="info-card">
              <div class="info-label">💬 Descripción del Proyecto</div>
              <div class="info-value" style="white-space: pre-wrap;">${data.description}</div>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>AQUI CREAMOS • aquicreamos.com</p>
            <p>${currentDate} • Bogotá, Colombia</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Template de confirmación para el cliente
function appointmentConfirmationTemplate(data) {
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
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: #0a0a0a;
            color: #e5e7eb;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #0f0f0f;
            border-radius: 12px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #82e256 0%, #6bc73d 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: #000;
            font-size: 28px;
            font-weight: 900;
          }
          .header p {
            margin: 10px 0 0 0;
            color: #000;
            opacity: 0.8;
          }
          .content {
            padding: 40px 30px;
          }
          .info-box {
            background: linear-gradient(135deg, rgba(130, 226, 86, 0.1) 0%, rgba(107, 199, 61, 0.1) 100%);
            border: 2px solid rgba(130, 226, 86, 0.3);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          .info-box h2 {
            color: #82e256;
            margin: 0 0 10px 0;
            font-size: 18px;
          }
          .info-box p {
            margin: 5px 0;
            font-size: 16px;
            color: #f3f4f6;
          }
          .details {
            background: rgba(30, 30, 30, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .details p {
            margin: 10px 0;
            color: #e5e7eb;
          }
          .details strong {
            color: #82e256;
          }
          .footer {
            background: #0a0a0a;
            padding: 30px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
          }
          .brand {
            font-size: 20px;
            font-weight: 900;
            background: linear-gradient(135deg, #82e256, #6bc73d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ ¡Asesoría Confirmada!</h1>
            <p>Tu sesión ha sido agendada exitosamente</p>
          </div>

          <div class="content">
            <p style="font-size: 18px; margin-bottom: 20px;">
              Hola <strong style="color: #82e256;">${data.name.split(' ')[0]}</strong>,
            </p>

            <p style="color: #d1d5db;">
              Gracias por agendar tu sesión de asesoría con nosotros. Hemos confirmado tu cita y estamos emocionados de trabajar contigo.
            </p>

            <div class="info-box">
              <h2>📅 Detalles de tu Asesoría</h2>
              <p style="font-size: 20px; font-weight: bold; color: #82e256;">
                ${appointmentDate}
              </p>
              <p style="font-size: 24px; font-weight: bold;">
                ${data.time}
              </p>
            </div>

            <div class="details">
              <p><strong>Servicio:</strong> ${data.service}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Teléfono:</strong> ${data.phone}</p>
              ${data.company ? `<p><strong>Empresa:</strong> ${data.company}</p>` : ''}
            </div>

            <div style="background: rgba(4, 173, 192, 0.1); border-left: 3px solid #04ADC0; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="margin: 0; color: #d1d5db; font-size: 14px; line-height: 1.8;">
                <strong style="color: #04ADC0;">📌 Importante:</strong><br>
                Recibirás una invitación de Google Calendar con el enlace de Google Meet. Si necesitas reprogramar o cancelar, por favor contáctanos con al menos 24 horas de anticipación.
              </p>
            </div>

            <p style="color: #d1d5db; margin-top: 30px;">
              Nos vemos pronto. Si tienes alguna pregunta antes de la sesión, no dudes en contactarnos.
            </p>
          </div>

          <div class="footer">
            <div class="brand">AQUI CREAMOS</div>
            <p>Transformando ideas en realidad con tecnología avanzada</p>
            <p style="margin-top: 15px;">
              <a href="https://aquicreamos.com" style="color: #82e256; text-decoration: none;">aquicreamos.com</a> •
              <a href="mailto:contacto@aquicreamos.com" style="color: #82e256; text-decoration: none;">contacto@aquicreamos.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// GET /api/appointments/occupied-slots - Obtener slots ocupados
router.get('/occupied-slots', async (req, res) => {
  try {
    console.log('📅 GET /api/appointments/occupied-slots');

    const { getOccupiedSlots } = await import('../services/database.js');
    const { readFileSync } = await import('fs');
    const { join } = await import('path');

    // 1. Obtener slots de la base de datos SQLite
    const slotsFromDB = getOccupiedSlots();
    console.log(`📊 Slots desde BD: ${slotsFromDB.length}`);

    // 2. Obtener slots de Google Calendar
    let slotsFromCalendar = [];
    try {
      const auth = getOAuth2Client();
      const calendar = google.calendar({ version: 'v3', auth });

      // Obtener eventos de los próximos 3 meses
      const now = new Date();
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        timeMax: threeMonthsLater.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      // Convertir eventos a formato dd/mm/YY hh:mm
      slotsFromCalendar = events.map(event => {
        const startDate = new Date(event.start.dateTime || event.start.date);
        const day = String(startDate.getDate()).padStart(2, '0');
        const month = String(startDate.getMonth() + 1).padStart(2, '0');
        const year = String(startDate.getFullYear()).slice(-2);
        const hours = String(startDate.getHours()).padStart(2, '0');
        const minutes = String(startDate.getMinutes()).padStart(2, '0');

        return {
          date: `${day}/${month}/${year}`,
          time: `${hours}:${minutes}`
        };
      });

      console.log(`📅 Slots desde Google Calendar: ${slotsFromCalendar.length}`);
    } catch (calendarError) {
      console.warn('⚠️ No se pudo consultar Google Calendar:', calendarError.message);
    }

    // 3. Obtener días bloqueados manualmente del JSON
    let blockedDates = [];
    try {
      const blockedDaysPath = join(process.cwd(), 'data', 'blocked-days.json');
      const blockedDaysData = JSON.parse(readFileSync(blockedDaysPath, 'utf-8'));
      blockedDates = blockedDaysData.blocked_dates || [];
      console.log(`🚫 Días bloqueados manualmente: ${blockedDates.length}`);
    } catch (jsonError) {
      console.warn('⚠️ No se pudo leer blocked-days.json:', jsonError.message);
    }

    // 4. Formatear slots de BD a dd/mm/YY hh:mm
    const formattedDBSlots = slotsFromDB.map(slot => {
      // Convertir de YYYY-MM-DD a dd/mm/YY
      const [year, month, day] = slot.date.split('-');
      return {
        date: `${day}/${month}/${year.slice(-2)}`,
        time: slot.time
      };
    });

    // 5. Combinar todos los slots (BD + Calendar)
    const allSlots = [...formattedDBSlots, ...slotsFromCalendar];

    // 6. Agregar días bloqueados manualmente (todo el día)
    const blockedSlots = blockedDates.flatMap(blockedDate => {
      // Generar slots de 8:00 a 18:00 cada hora
      const slots = [];
      for (let hour = 8; hour <= 18; hour++) {
        slots.push({
          date: blockedDate,
          time: `${String(hour).padStart(2, '0')}:00`
        });
      }
      return slots;
    });

    allSlots.push(...blockedSlots);

    // 7. Agregar fines de semana (sábados y domingos) de los próximos 3 meses
    const weekendSlots = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      // 0 = Domingo, 6 = Sábado
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        const dateStr = `${day}/${month}/${year}`;

        // Agregar slots de 8:00 a 18:00 cada hora para fines de semana
        for (let hour = 8; hour <= 18; hour++) {
          weekendSlots.push({
            date: dateStr,
            time: `${String(hour).padStart(2, '0')}:00`
          });
        }
      }
    }

    allSlots.push(...weekendSlots);

    // 8. Eliminar duplicados
    const uniqueSlots = Array.from(
      new Set(allSlots.map(s => `${s.date}|${s.time}`))
    ).map(s => {
      const [date, time] = s.split('|');
      return { date, time };
    });

    console.log(`✅ Total slots ocupados: ${uniqueSlots.length} (BD: ${formattedDBSlots.length}, Calendar: ${slotsFromCalendar.length}, Bloqueados: ${blockedSlots.length}, Fines de semana: ${weekendSlots.length})`);

    return res.json({
      success: true,
      data: uniqueSlots
    });
  } catch (error) {
    console.error('❌ Error en /api/appointments/occupied-slots:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener slots ocupados',
      details: error.message
    });
  }
});

// Endpoint para crear asesoría
router.post('/', async (req, res) => {
  try {
    const appointmentData = req.body;

    // Validar datos requeridos
    if (!appointmentData.name || !appointmentData.email || !appointmentData.phone ||
        !appointmentData.date || !appointmentData.time || !appointmentData.service) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: name, email, phone, date, time, service',
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(appointmentData.email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido',
      });
    }

    // Verificar disponibilidad del slot
    if (!isSlotAvailable(appointmentData.date, appointmentData.time)) {
      return res.status(409).json({
        success: false,
        error: 'Este horario ya no está disponible. Por favor, selecciona otro.',
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. Enviar email al admin
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: appointmentData.email,
      subject: `📅 Nueva Asesoría Agendada en wsgestor@gmail.com - ${appointmentData.name}`,
      html: appointmentAdminTemplate(appointmentData),
    });

    if (adminError) {
      console.error('Error enviando email al admin:', adminError);
      return res.status(500).json({
        success: false,
        error: 'Error al enviar email al administrador',
        details: adminError.message || adminError,
      });
    }

    console.log('✅ Email al admin enviado:', adminData?.id);

    // 2. Guardar en la base de datos SQLite
    let appointmentId;
    try {
      const result = saveAppointment(appointmentData);
      appointmentId = result.lastInsertRowid;
      console.log(`✅ Cita guardada en BD con ID: ${appointmentId}`);
    } catch (dbError) {
      console.error('❌ Error al guardar en BD:', dbError);
      // Continuamos aunque falle la BD
    }

    // 3. Enviar email de confirmación al cliente
    const { data: clientData, error: clientError } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: appointmentData.email,
      subject: `✅ Confirmación de Asesoría - AQUI CREAMOS`,
      html: appointmentConfirmationTemplate(appointmentData),
    });

    if (clientError) {
      console.error('Error enviando confirmación al cliente:', clientError);
      // No retornamos error porque el admin ya recibió el email
    } else {
      console.log('✅ Email de confirmación enviado:', clientData?.id);
    }

    // 4. Crear evento en Google Calendar
    let calendarEventId = null;
    let meetLink = null;

    try {
      const auth = getOAuth2Client();
      const calendar = google.calendar({ version: 'v3', auth });

      // Convertir fecha y hora a ISO
      const startDateTime = new Date(`${appointmentData.date}T${appointmentData.time}:00-05:00`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hora

      const event = {
        summary: `Asesoría: ${appointmentData.service}`,
        description: `
Asesoría con ${appointmentData.name}
${appointmentData.company ? `Empresa: ${appointmentData.company}\n` : ''}
Email: ${appointmentData.email}
Teléfono: ${appointmentData.phone}

═══════════════════════════════════
DETALLES DEL PROYECTO
═══════════════════════════════════
Servicio: ${appointmentData.service}
${appointmentData.project_type ? `Tipo de Proyecto: ${appointmentData.project_type}\n` : ''}
${appointmentData.project_stage ? `Etapa: ${appointmentData.project_stage}\n` : ''}
${appointmentData.budget ? `Presupuesto: ${appointmentData.budget}\n` : ''}
${appointmentData.timeline ? `Timeline: ${appointmentData.timeline}\n` : ''}
${appointmentData.expected_users ? `Usuarios Esperados: ${appointmentData.expected_users}\n` : ''}
${appointmentData.features && (Array.isArray(appointmentData.features) ? appointmentData.features.length > 0 : appointmentData.features) ? `Funcionalidades: ${Array.isArray(appointmentData.features) ? appointmentData.features.join(', ') : appointmentData.features}\n` : ''}
${appointmentData.tech_preferences ? `Preferencias Tech: ${appointmentData.tech_preferences}\n` : ''}
${appointmentData.has_team ? `Equipo Técnico: ${appointmentData.has_team}\n` : ''}
${appointmentData.priority ? `Prioridad: ${appointmentData.priority}\n` : ''}
${appointmentData.description ? `\n═══════════════════════════════════\nDESCRIPCIÓN\n═══════════════════════════════════\n${appointmentData.description}` : ''}
        `.trim(),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Bogota',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Bogota',
        },
        attendees: [
          {
            email: appointmentData.email,
            displayName: appointmentData.name,
          },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 día antes
            { method: 'popup', minutes: 60 },       // 1 hora antes
            { method: 'popup', minutes: 30 },       // 30 minutos antes
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all', // Enviar invitación automáticamente
      });

      calendarEventId = response.data.id;
      meetLink = response.data.hangoutLink;

      console.log('✅ Evento creado en Google Calendar:', calendarEventId);
      console.log('🔗 Google Meet:', meetLink);

      // Actualizar BD con calendar_event_id y meet_link
      if (appointmentId && calendarEventId) {
        try {
          updateAppointmentCalendarInfo(appointmentId, calendarEventId, meetLink);
          console.log('✅ BD actualizada con info de Google Calendar');
        } catch (updateError) {
          console.error('⚠️ No se pudo actualizar BD con info de Calendar:', updateError.message);
        }
      }
    } catch (calendarError) {
      console.error('⚠️ Error al crear evento en Google Calendar:', calendarError.message);
      // Continuamos aunque falle el calendario
    }

    return res.json({
      success: true,
      message: 'Asesoría agendada exitosamente. Emails enviados y evento creado en calendario.',
      data: {
        id: appointmentId,
        adminEmailId: adminData?.id,
        clientEmailId: clientData?.id,
        calendarEventId,
        meetLink,
      },
    });
  } catch (error) {
    console.error('❌ Error en /api/appointments:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
});

export default router;
