import express from 'express';
import { Resend } from 'resend';
import { newsletterWelcomeTemplate, newsletterAdminNotification } from '../templates/email-templates.js';
import { subscribeNewsletter, isSubscribedNewsletter, getNewsletterStats } from '../services/database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Verificar si ya está suscrito
    if (isSubscribedNewsletter(email)) {
      return res.json({
        success: true,
        message: 'Ya estás suscrito al newsletter'
      });
    }

    // Guardar en SQLite
<<<<<<< HEAD
    try {
      subscribeNewsletter(email);
      console.log(`📧 Nuevo suscriptor guardado: ${email}`);
    } catch (dbError) {
      console.error('Error guardando suscripción:', dbError);
      return res.status(500).json({
        error: 'Error al guardar suscripción'
      });
    }
=======
    subscribeNewsletter(email);
    console.log(`📧 Nuevo suscriptor: ${email}`);
>>>>>>> aac598b (actualización en minio)

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

        const stats = getNewsletterStats();
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [process.env.EMAIL_TO],
          subject: `📧 Nueva suscripción al newsletter: ${email}`,
          html: newsletterAdminNotification(email, stats.totalSubscribers)
        });
      } catch (emailError) {
        console.error('Error al enviar email de confirmación:', emailError);
      }
    }

    const stats = getNewsletterStats();
    return res.json({
      success: true,
      message: 'Suscripción exitosa',
      subscribersCount: stats.totalSubscribers
    });

  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    return res.status(500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
});

export default router;
