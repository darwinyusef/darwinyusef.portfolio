import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, role, company, email, content, rating } = body;

    // Validación
    if (!name || !content || !rating) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener API key de Resend
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 're_your_api_key_here') {
      console.warn('⚠️ Resend API key not configured. Testimonial will not be sent via email.');
      // En desarrollo, simplemente guardamos el testimonio sin enviar email
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Testimonio recibido (email no configurado en desarrollo)'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: import.meta.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [import.meta.env.EMAIL_TO || 'wsgestor@gmail.com'],
      replyTo: email || undefined, // Email del usuario si lo proporcionó
      subject: `⭐ Nuevo Testimonio de ${name} (${rating}/5 estrellas)`,
      html: `
        <h2>Nuevo Testimonio Recibido</h2>
        <hr>
        <h3>Información del Usuario:</h3>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email || 'No proporcionado'}</li>
          <li><strong>Rol:</strong> ${role || 'No especificado'}</li>
          <li><strong>Empresa:</strong> ${company || 'No especificada'}</li>
          <li><strong>Calificación:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</li>
        </ul>
        <hr>
        <h3>Testimonio:</h3>
        <p>${content}</p>
        <hr>
        <p><em>Este testimonio requiere aprobación antes de ser publicado.</em></p>
      `,
    });

    if (error) {
      console.error('Error sending testimonial email:', error);
      return new Response(
        JSON.stringify({ error: 'Error al enviar el testimonio' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Testimonio enviado correctamente',
        id: data?.id
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing testimonial:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
