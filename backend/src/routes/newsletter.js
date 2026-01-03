import express from 'express';
import { Resend } from 'resend';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { newsletterWelcomeTemplate, newsletterAdminNotification } from '../templates/email-templates.js';
import { appendLeadJsonl } from '../services/minio-storage.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const subscriptionsPath = join(process.cwd(), 'data', 'newsletter-subscriptions.json');
    let subscriptions = [];

    if (existsSync(subscriptionsPath)) {
      try {
        const fileContent = readFileSync(subscriptionsPath, 'utf-8');
        subscriptions = JSON.parse(fileContent);
      } catch (error) {
        console.warn('No se pudo leer el archivo de suscripciones, creando uno nuevo');
        subscriptions = [];
      }
    }

    const alreadySubscribed = subscriptions.some(sub => sub.email === email);
    if (alreadySubscribed) {
      return res.json({
        success: true,
        message: 'Ya estás suscrito al newsletter'
      });
    }

    subscriptions.push({
      email,
      subscribedAt: new Date().toISOString()
    });

    try {
      writeFileSync(subscriptionsPath, JSON.stringify(subscriptions, null, 2));
    } catch (error) {
      console.error('Error al guardar la suscripción:', error);
    }

    // Guardar también en MinIO
    try {
      await appendLeadJsonl({
        email,
        name: email.split('@')[0],
        campaign: 'newsletter',
        source: 'newsletter_subscription',
        resourceId: 'newsletter',
        resourceTitle: 'Newsletter Subscription',
        ip: req.ip || req.connection.remoteAddress,
      });
    } catch (minioError) {
      console.error('Error guardando newsletter en MinIO:', minioError);
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey !== 're_your_api_key_here') {
      try {
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [email],
          subject: '🎉 ¡Bienvenido al Newsletter! - Yusef González',
          html: newsletterWelcomeTemplate(email)
        });

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [process.env.EMAIL_TO || 'wsgestor@gmail.com'],
          subject: `📧 Nueva suscripción al newsletter: ${email}`,
          html: newsletterAdminNotification(email, subscriptions.length)
        });
      } catch (emailError) {
        console.error('Error al enviar email de confirmación:', emailError);
      }
    }

    return res.json({
      success: true,
      message: 'Suscripción exitosa',
      subscribersCount: subscriptions.length
    });

  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    return res.status(500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
});

export default router;
