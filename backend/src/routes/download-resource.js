import express from 'express';
import { Resend } from 'resend';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { leadMagnetTemplate, leadMagnetAdminNotification } from '../templates/email-templates.js';
import { appendLeadJsonl, appendLeadCsv } from '../services/minio-storage.js';

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

    // Guardar lead en MinIO (JSONL append-only)
    try {
      await appendLeadJsonl({
        email,
        name: name || 'Anónimo',
        campaign: resourceId,
        source: 'resource_download',
        resourceId,
        resourceTitle: resource.title,
        ip: req.ip || req.connection.remoteAddress,
      });

      // También guardar en CSV para compatibilidad
      await appendLeadCsv({
        email,
        name: name || 'Anónimo',
        campaign: resourceId,
        source: 'resource_download',
        resourceId,
        resourceTitle: resource.title,
        ip: req.ip || req.connection.remoteAddress,
      });

      console.log(`💾 Lead guardado en MinIO: ${email} - ${resource.title}`);
    } catch (minioError) {
      console.error('Error guardando en MinIO:', minioError);

      // Fallback: guardar en archivo local si MinIO falla
      const leadsPath = join(process.cwd(), 'data', 'leads.json');
      let leads = [];

      if (existsSync(leadsPath)) {
        try {
          leads = JSON.parse(readFileSync(leadsPath, 'utf-8'));
        } catch (error) {
          console.warn('No se pudo leer leads.json, creando nuevo archivo');
          leads = [];
        }
      }

      leads.push({
        resourceId,
        resourceTitle: resource.title,
        name: name || 'Anónimo',
        email,
        downloadedAt: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress
      });

      try {
        writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
        console.log(`💾 Lead guardado en fallback local: ${email}`);
      } catch (error) {
        console.error('Error guardando lead en fallback:', error);
      }
    }

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
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [process.env.EMAIL_TO || 'wsgestor@gmail.com'],
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
    const leadsPath = join(process.cwd(), 'data', 'leads.json');

    if (!existsSync(leadsPath)) {
      return res.json({
        success: true,
        totalLeads: 0,
        byResource: {},
        recentLeads: []
      });
    }

    const leads = JSON.parse(readFileSync(leadsPath, 'utf-8'));

    // Agrupar por recurso
    const byResource = leads.reduce((acc, lead) => {
      if (!acc[lead.resourceId]) {
        acc[lead.resourceId] = {
          title: lead.resourceTitle,
          count: 0,
          leads: []
        };
      }
      acc[lead.resourceId].count++;
      acc[lead.resourceId].leads.push({
        email: lead.email,
        name: lead.name,
        date: lead.downloadedAt
      });
      return acc;
    }, {});

    // Últimos 10 leads
    const recentLeads = leads
      .sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt))
      .slice(0, 10);

    res.json({
      success: true,
      totalLeads: leads.length,
      byResource,
      recentLeads
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
