import express from 'express';
import { google } from 'googleapis';
import { getOAuth2Client, getAuthUrl, getTokenFromCode, isAuthenticated } from '../services/google-auth.js';

const router = express.Router();

router.get('/auth', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Código no proporcionado' });
  }

  try {
    await getTokenFromCode(code);
    res.send('<h1>✅ Autenticación exitosa!</h1><p>Ya puedes cerrar esta ventana. El calendario está conectado.</p>');
  } catch (error) {
    console.error('Error en OAuth:', error);
    res.status(500).send('<h1>❌ Error en autenticación</h1>');
  }
});

router.get('/status', (req, res) => {
  res.json({ authenticated: isAuthenticated() });
});

router.post('/schedule', async (req, res) => {
  try {
    if (!isAuthenticated()) {
      return res.status(401).json({
        error: 'No autenticado. Visita /api/calendar/auth para autenticarte',
        authUrl: '/api/calendar/auth'
      });
    }

    const { summary, description, startTime, endTime, attendeeEmail } = req.body;

    if (!summary || !startTime || !endTime) {
      return res.status(400).json({ error: 'Campos requeridos: summary, startTime, endTime' });
    }

    const auth = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary,
      description: description || '',
      start: {
        dateTime: startTime,
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endTime,
        timeZone: 'America/Bogota',
      },
      attendees: attendeeEmail ? [{ email: attendeeEmail }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all',
    });

    return res.json({
      success: true,
      event: response.data,
      eventLink: response.data.htmlLink
    });
  } catch (error) {
    console.error('Error creando evento en Calendar:', error);
    return res.status(500).json({
      error: error.message || 'Error al crear evento en Google Calendar',
      success: false
    });
  }
});

router.get('/events', async (req, res) => {
  try {
    if (!isAuthenticated()) {
      return res.status(401).json({
        error: 'No autenticado. Visita /api/calendar/auth para autenticarte',
        authUrl: '/api/calendar/auth'
      });
    }

    const auth = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.json({
      success: true,
      events: response.data.items
    });
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

export default router;
