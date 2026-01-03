import express from 'express';
import { Resend } from 'resend';
import { cvDownloadTemplate } from '../templates/email-templates.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Email válido es requerido'
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 're_your_api_key_here') {
      console.warn('⚠️ Resend API key not configured');
      // En desarrollo, retornar URL directa
      return res.json({
        success: true,
        message: 'CV enviado (modo desarrollo)',
        cvUrl: '/cv/Yusef_Gonzalez_CV.pdf'
      });
    }

    const resend = new Resend(resendApiKey);

    // URL del CV (puede ser S3, hosting, etc.)
    const cvUrl = process.env.CV_URL || 'https://darwinyusef.com/cv/Yusef_Gonzalez_CV.pdf';

    // Enviar email al usuario con el CV
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [email],
      subject: '📄 Tu CV solicitado - Yusef González',
      html: cvDownloadTemplate({ name, email, cvUrl })
    });

    if (error) {
      console.error('Error sending CV email:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al enviar el email'
      });
    }

    // Notificar al admin
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: [process.env.EMAIL_TO || 'wsgestor@gmail.com'],
        subject: `📥 Descarga de CV solicitada por ${email}`,
        html: `
          <h2>Nueva descarga de CV</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Nombre:</strong> ${name || 'No proporcionado'}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (notificationError) {
      console.error('Error sending admin notification:', notificationError);
      // No fallar si falla la notificación al admin
    }

    return res.json({
      success: true,
      message: 'CV enviado exitosamente a tu email',
      emailSent: true
    });

  } catch (error) {
    console.error('Error in download-cv:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
});

export default router;
