import express from 'express';
import {
  getLeadStats,
  exportCampaignLeads,
  listLeadFiles,
  checkMinioHealth,
  readJsonlFile,
} from '../services/minio-storage.js';

const router = express.Router();

// Health check de MinIO
router.get('/health', async (req, res) => {
  try {
    const health = await checkMinioHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

// Obtener estadísticas agregadas de todos los leads
router.get('/stats', async (req, res) => {
  try {
    const stats = await getLeadStats();
    res.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Listar archivos de leads
router.get('/files', async (req, res) => {
  try {
    const { prefix = 'raw/' } = req.query;
    const files = await listLeadFiles(prefix);

    res.json({
      success: true,
      files,
      total: files.length,
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Exportar leads de una campaña específica
router.get('/export/:campaign', async (req, res) => {
  try {
    const { campaign } = req.params;
    const { format = 'json' } = req.query;

    const data = await exportCampaignLeads(campaign, format);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="leads_${campaign}.csv"`);
      res.send(data);
    } else {
      res.json({
        success: true,
        campaign,
        total: Array.isArray(data) ? data.length : 0,
        leads: data,
      });
    }
  } catch (error) {
    console.error('Error exporting campaign:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Leer un archivo JSONL específico
router.get('/read', async (req, res) => {
  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({
        success: false,
        error: 'Path parameter is required',
      });
    }

    const leads = await readJsonlFile(path);

    res.json({
      success: true,
      path,
      total: leads.length,
      leads,
    });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Exportar TODOS los leads (todas las campañas)
router.get('/export-all', async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const files = await listLeadFiles('raw/');

    const allLeads = [];

    for (const file of files) {
      if (file.name.endsWith('.jsonl')) {
        try {
          const leads = await readJsonlFile(file.name);
          allLeads.push(...leads);
        } catch (error) {
          console.warn(`Error reading ${file.name}:`, error.message);
        }
      }
    }

    if (format === 'csv') {
      const headers = ['email', 'name', 'campaign', 'source', 'resourceId', 'resourceTitle', 'ip', 'timestamp', 'consent'];
      const csvLines = [headers.join(',')];

      allLeads.forEach(lead => {
        const row = [
          lead.email,
          lead.name,
          lead.campaign,
          lead.source,
          lead.resourceId || '',
          lead.resourceTitle || '',
          lead.ip || '',
          lead.ts,
          lead.consent,
        ].map(val => `"${String(val).replace(/"/g, '""')}"`);

        csvLines.push(row.join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="all_leads.csv"');
      res.send(csvLines.join('\n'));
    } else {
      res.json({
        success: true,
        total: allLeads.length,
        leads: allLeads,
      });
    }
  } catch (error) {
    console.error('Error exporting all leads:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
