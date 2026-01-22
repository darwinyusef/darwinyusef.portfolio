import express from 'express';
import {
  getAllLeads,
  getLeadsStats,
  getLeadsByResource,
  getAllContacts,
  getContactsStats,
  getNewsletterStats,
  getAllEmailLogs,
  getEmailLogsStats
} from '../services/database.js';
import db from '../services/database.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  try {
    const dbInfo = db.prepare('SELECT sqlite_version() as version').get();
    res.json({
      status: 'ok',
      storage: 'SQLite',
      version: dbInfo.version,
      database: 'portfolio.db'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Estadísticas generales
router.get('/stats', (req, res) => {
  try {
    const leadsStats = getLeadsStats();
    const contactsStats = getContactsStats();
    const newsletterStats = getNewsletterStats();
    const emailStats = getEmailLogsStats();

    res.json({
      success: true,
      leads: {
        total: leadsStats.totalLeads,
        byResource: leadsStats.byResource
      },
      contacts: {
        total: contactsStats.totalContacts
      },
      newsletter: {
        total: newsletterStats.totalSubscribers
      },
      emails: {
        total: emailStats.totalLogs,
        byService: emailStats.byService
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener todos los leads
router.get('/leads', (req, res) => {
  try {
    const leads = getAllLeads();
    res.json({
      success: true,
      total: leads.length,
      leads
    });
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener leads por recurso
router.get('/leads/:resourceId', (req, res) => {
  try {
    const { resourceId } = req.params;
    const leads = getLeadsByResource(resourceId);
    res.json({
      success: true,
      resourceId,
      total: leads.length,
      leads
    });
  } catch (error) {
    console.error('Error getting leads by resource:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Exportar leads como CSV
router.get('/export/leads', (req, res) => {
  try {
    const { resourceId } = req.query;
    const leads = resourceId ? getLeadsByResource(resourceId) : getAllLeads();

    const headers = ['id', 'resource_id', 'resource_title', 'name', 'email', 'campaign', 'source', 'ip', 'created_at'];
    const csvLines = [headers.join(',')];

    leads.forEach(lead => {
      const row = [
        lead.id,
        lead.resource_id || '',
        lead.resource_title || '',
        lead.name || '',
        lead.email,
        lead.campaign || '',
        lead.source || '',
        lead.ip || '',
        lead.created_at
      ].map(val => `"${String(val).replace(/"/g, '""')}"`);

      csvLines.push(row.join(','));
    });

    const filename = resourceId ? `leads_${resourceId}.csv` : 'all_leads.csv';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvLines.join('\n'));
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener todos los contactos
router.get('/contacts', (req, res) => {
  try {
    const contacts = getAllContacts();
    res.json({
      success: true,
      total: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Exportar contactos como CSV
router.get('/export/contacts', (req, res) => {
  try {
    const contacts = getAllContacts();

    const headers = ['id', 'name', 'email', 'message', 'ip', 'created_at'];
    const csvLines = [headers.join(',')];

    contacts.forEach(contact => {
      const row = [
        contact.id,
        contact.name,
        contact.email,
        contact.message,
        contact.ip || '',
        contact.created_at
      ].map(val => `"${String(val).replace(/"/g, '""')}"`);

      csvLines.push(row.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="contacts.csv"');
    res.send(csvLines.join('\n'));
  } catch (error) {
    console.error('Error exporting contacts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener suscriptores del newsletter
router.get('/newsletter', (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter_subscriptions WHERE status = ? ORDER BY subscribed_at DESC').all('active');
    res.json({
      success: true,
      total: subscribers.length,
      subscribers
    });
  } catch (error) {
    console.error('Error getting newsletter subscribers:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Exportar newsletter como CSV
router.get('/export/newsletter', (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC').all();

    const headers = ['id', 'email', 'status', 'subscribed_at'];
    const csvLines = [headers.join(',')];

    subscribers.forEach(sub => {
      const row = [
        sub.id,
        sub.email,
        sub.status,
        sub.subscribed_at
      ].map(val => `"${String(val).replace(/"/g, '""')}"`);

      csvLines.push(row.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter_subscribers.csv"');
    res.send(csvLines.join('\n'));
  } catch (error) {
    console.error('Error exporting newsletter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener logs de email
router.get('/email-logs', (req, res) => {
  try {
    const { service, status } = req.query;
    let query = 'SELECT * FROM email_logs';
    const params = [];
    const conditions = [];

    if (service) {
      conditions.push('service = ?');
      params.push(service);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const logs = db.prepare(query).all(...params);

    res.json({
      success: true,
      total: logs.length,
      logs
    });
  } catch (error) {
    console.error('Error getting email logs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Exportar todos los datos
router.get('/export/all', (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const data = {
      leads: getAllLeads(),
      contacts: getAllContacts(),
      newsletter: db.prepare('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC').all(),
      emailLogs: getAllEmailLogs(),
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="portfolio_data.json"');
      res.json(data);
    } else {
      res.status(400).json({
        success: false,
        error: 'Only JSON format is supported for full export'
      });
    }
  } catch (error) {
    console.error('Error exporting all data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
