import express from 'express';
import { Resend } from 'resend';
import { leadMagnetTemplate, leadMagnetAdminNotification } from '../templates/email-templates.js';
import { saveLead, getLeadsStats } from '../services/database.js';

const router = express.Router();

const RESOURCES_URL = 'https://raw.githubusercontent.com/darwinyusef/darwinyusef/refs/heads/master/information/recursos.json';

async function fetchResources() {
  try {
    const response = await fetch(RESOURCES_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources from GitHub:', error);
    return [];
  }
}

// Obtener lista de recursos disponibles (públicos)
router.get('/', async (req, res) => {
  try {
    const resources = await fetchResources();
    res.json({
      success: true,
      resources
    });
  } catch (error) {
    console.error('Error in GET /resources:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo recursos',
      resources: []
    });
  }
});

// NUEVO: Solicitar descarga de recurso (Lead Magnet)
router.post('/:resourceId/request', async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { name, email } = req.body;

    // Validaciones
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Email válido es requerido'
      });
    }

    const resources = await fetchResources();
    const resource = resources.find(r => r.id == resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Recurso no encontrado'
      });
    }

    // Guardar lead en SQLite
    saveLead({
      resourceId,
      resourceTitle: resource.title,
      name: name || 'Anónimo',
      email,
      campaign: resourceId,
      source: 'resource_download',
      ip: req.ip || req.connection.remoteAddress
    });
    console.log(`💾 Lead guardado: ${email} - ${resource.title}`);

    // Enviar email al usuario con el recurso
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey !== 're_your_api_key_here') {
      try {
        const resend = new Resend(resendApiKey);

        // Email al usuario
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [email],
          subject: `🎁 Tu recurso: ${resource.title}`,
          html: leadMagnetTemplate({
            name,
            email,
            resourceTitle: resource.title,
            resourceUrl: resource.url,
            resourceDescription: resource.description
          })
        });

        // Email al admin
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'wsgestor@gmail.com',
          to: [process.env.EMAIL_TO],
          subject: `📊 Nuevo Lead: ${resource.title}`,
          html: leadMagnetAdminNotification({
            name,
            email,
            resourceTitle: resource.title,
            resourceId
          })
        });

        console.log(`📧 Email enviado a ${email} con recurso: ${resource.title}`);
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
        // No fallar la descarga si falla el email
      }
    }

    res.json({
      success: true,
      message: 'Recurso enviado a tu email',
      resource: {
        title: resource.title,
        description: resource.description,
        download_url: resource.url  // También retornar URL para descarga inmediata
      }
    });

  } catch (error) {
    console.error('Error in download-resource request:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas de descargas (para admin)
router.get('/stats/all', (req, res) => {
  try {
    const stats = getLeadsStats();

    // Transformar formato para compatibilidad
    const byResource = {};
    stats.byResource.forEach(resource => {
      byResource[resource.resource_id] = {
        title: resource.resource_title,
        count: resource.count,
        lastDownload: resource.last_download
      };
    });

    res.json({
      success: true,
      totalLeads: stats.totalLeads,
      byResource,
      recentLeads: stats.recentLeads
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
});

export default router;
