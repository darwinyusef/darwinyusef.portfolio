import express from 'express';
import { Resend } from 'resend';
import { contactFormTemplate, architectureConfirmationTemplate } from '../templates/email-templates.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido',
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Email al admin
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `📬 Nueva solicitud de asesoría de ${name}`,
      html: contactFormTemplate({ name, email, message }),
      text: `Nuevo mensaje de contacto\n\nNombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`
    });

    if (adminError) {
      console.error('Error sending admin email:', adminError);
      return res.status(500).json({
        success: false,
        error: 'Error al enviar el email',
        details: adminError.message || adminError,
      });
    }

    // Email de confirmación al usuario
    try {
      const { error: userError } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: `✅ Solicitud de Asesoría Recibida - Yusef González`,
        html: architectureConfirmationTemplate({ name, message }),
        text: `Hola ${name},\n\nHemos recibido tu solicitud de asesoría en arquitectura.\n\nResumen de tu solicitud:\n${message}\n\nTe contactaremos en las próximas 24-48 horas para coordinar la fecha de la cita.\n\nGracias por confiar en nuestros servicios.\n\nYusef González\ndarwinyusef.com`
      });

      if (userError) {
        console.error('Error sending user confirmation email:', userError);
      } else {
        console.log(`📧 Confirmación enviada a ${email}`);
      }
    } catch (userEmailError) {
      console.error('Error sending user confirmation:', userEmailError);
    }

    return res.json({
      success: true,
      message: 'Email enviado correctamente',
      data: adminData,
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error del servidor',
    });
  }
});

export default router;
