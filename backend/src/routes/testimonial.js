import express from 'express';
import { Resend } from 'resend';
import { testimonialTemplate } from '../templates/email-templates.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, role, company, email, content, rating } = req.body;

    if (!name || !content || !rating) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 're_your_api_key_here') {
      console.warn('⚠️ Resend API key not configured. Testimonial will not be sent via email.');
      return res.json({
        success: true,
        message: 'Testimonio recibido (email no configurado en desarrollo)'
      });
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [process.env.EMAIL_TO || 'wsgestor@gmail.com'],
      replyTo: email || undefined,
      subject: `⭐ Nuevo Testimonio de ${name} (${rating}/5 estrellas)`,
      html: testimonialTemplate({ name, role, company, email, content, rating })
    });

    if (error) {
      console.error('Error sending testimonial email:', error);
      return res.status(500).json({ error: 'Error al enviar el testimonio' });
    }

    return res.json({
      success: true,
      message: 'Testimonio enviado correctamente',
      id: data?.id
    });

  } catch (error) {
    console.error('Error processing testimonial:', error);
    return res.status(500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
});

export default router;
