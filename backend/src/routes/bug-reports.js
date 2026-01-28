import express from 'express';
import { Resend } from 'resend';

const router = express.Router();

// Inicializar Resend solo si la API key está disponible
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Función para obtener la etiqueta del tipo de bug
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

// Template de email para el reporte de bug
function bugReportTemplate(bugData) {
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
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #fff;
            font-size: 28px;
            font-weight: 800;
          }
          .header .subtitle {
            margin: 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 500;
          }
          .content {
            padding: 40px 30px;
          }
          .info-card {
            background: rgba(30, 30, 30, 0.5);
            border: 1px solid rgba(130, 226, 86, 0.2);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #82e256;
            min-width: 150px;
            font-size: 14px;
          }
          .info-value {
            color: #e5e7eb;
            flex: 1;
            font-size: 14px;
            word-break: break-word;
          }
          .description-section {
            background: rgba(220, 38, 38, 0.1);
            border-left: 4px solid #dc2626;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .description-section h3 {
            margin: 0 0 15px 0;
            color: #fff;
            font-size: 18px;
          }
          .description-section p {
            margin: 0;
            color: #e5e7eb;
            line-height: 1.8;
            white-space: pre-wrap;
          }
          .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            background: rgba(220, 38, 38, 0.2);
            color: #fca5a5;
            border: 1px solid rgba(220, 38, 38, 0.3);
          }
          .footer {
            background: rgba(20, 20, 20, 0.8);
            padding: 25px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .footer p {
            margin: 5px 0;
            color: #9ca3af;
            font-size: 13px;
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐛 Nuevo Bug Reportado</h1>
            <p class="subtitle">${bugData.title}</p>
          </div>

          <div class="content">
            <div class="info-card">
              <div class="info-row">
                <span class="info-label">Tipo:</span>
                <span class="info-value">
                  <span class="badge">${getBugTypeLabel(bugData.type)}</span>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Página:</span>
                <span class="info-value">${bugData.page}</span>
              </div>
              <div class="info-row">
                <span class="info-label">URL Completa:</span>
                <span class="info-value">
                  <a href="${bugData.url}" style="color: #82e256; text-decoration: none;">
                    ${bugData.url}
                  </a>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Fecha del Reporte:</span>
                <span class="info-value">${reportDate}</span>
              </div>
              ${bugData.email !== 'anonymous' ? `
              <div class="info-row">
                <span class="info-label">Email del Usuario:</span>
                <span class="info-value">
                  <a href="mailto:${bugData.email}" style="color: #82e256; text-decoration: none;">
                    ${bugData.email}
                  </a>
                </span>
              </div>
              ` : ''}
            </div>

            <div class="description-section">
              <h3>📋 Descripción del Problema</h3>
              <p>${bugData.description}</p>
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

          <div class="footer">
            <p><strong>Aquí Creamos</strong> - Sistema de Reporte de Bugs</p>
            <p>Reporte automático generado desde el sitio web</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// POST /api/bug-reports - Recibir y enviar reporte de bug
router.post('/', async (req, res) => {
  console.log('🐛 POST /api/bug-reports - Nueva solicitud de reporte de bug');

  try {
    // El frontend envía los datos directamente en req.body
    const bugReport = req.body;

    // Validaciones básicas
    if (!bugReport || typeof bugReport !== 'object') {
      console.error('❌ Datos de bug report inválidos');
      return res.status(400).json({
        success: false,
        error: 'Invalid bug report data'
      });
    }

    if (!bugReport.title || !bugReport.description) {
      console.error('❌ Faltan campos requeridos (title o description)');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title and description'
      });
    }

    console.log('📧 Preparando email de bug report...');
    console.log('Bug Data:', {
      type: bugReport.type,
      page: bugReport.page,
      title: bugReport.title,
      email: bugReport.email
    });

    // Verificar si Resend está disponible
    if (!resend) {
      console.warn('⚠️ Resend no configurado - Bug report guardado pero no enviado por email');
      return res.status(200).json({
        success: true,
        message: 'Bug report received but email service not configured',
        data: {
          timestamp: new Date().toISOString()
        }
      });
    }

    // Enviar email usando Resend
    const emailData = await resend.emails.send({
      from: 'Aquí Creamos <bugs@aquicreamos.com>',
      to: [process.env.ADMIN_EMAIL || 'yusefgonzalez00@gmail.com'],
      replyTo: bugReport.email !== 'anonymous' ? bugReport.email : undefined,
      subject: `🐛 Bug Report: ${bugReport.title}`,
      html: bugReportTemplate(bugReport)
    });

    console.log('✅ Email de bug report enviado exitosamente');
    console.log('Email ID:', emailData.data?.id);

    return res.status(200).json({
      success: true,
      message: 'Bug report sent successfully',
      data: {
        emailId: emailData.data?.id,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error al procesar bug report:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send bug report',
      details: error.message
    });
  }
});

export default router;
