import express from 'express';
import { Resend } from 'resend';
import { contactFormTemplate } from '../templates/email-templates.js';
import { saveContact } from '../services/database.js';

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

    // Guardar en SQLite
    try {
      saveContact({
        name,
        email,
        message,
        ip: req.ip || req.connection.remoteAddress
      });
      console.log(`💬 Contacto guardado en SQLite: ${email}`);
    } catch (dbError) {
      console.error('Error guardando contacto en SQLite:', dbError);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `📬 Nuevo mensaje de contacto de ${name}`,
      html: contactFormTemplate({ name, email, message }),
      text: `Nuevo mensaje de contacto\n\nNombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al enviar el email',
        details: error.message || error,
      });
    }

    return res.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      data,
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
