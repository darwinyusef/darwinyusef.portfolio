import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export const prerender = false;

interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
  ip?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    // Validación
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Archivo de suscripciones
    const subscriptionsPath = join(process.cwd(), 'public', 'newsletter-subscriptions.json');
    let subscriptions: NewsletterSubscription[] = [];

    // Cargar suscripciones existentes
    if (existsSync(subscriptionsPath)) {
      try {
        const fileContent = readFileSync(subscriptionsPath, 'utf-8');
        subscriptions = JSON.parse(fileContent);
      } catch (error) {
        console.warn('No se pudo leer el archivo de suscripciones, creando uno nuevo');
        subscriptions = [];
      }
    }

    // Verificar si el email ya está suscrito
    const alreadySubscribed = subscriptions.some(sub => sub.email === email);
    if (alreadySubscribed) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Ya estás suscrito al newsletter'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Agregar nueva suscripción
    subscriptions.push({
      email,
      subscribedAt: new Date().toISOString()
    });

    // Guardar en el archivo
    try {
      writeFileSync(subscriptionsPath, JSON.stringify(subscriptions, null, 2));
    } catch (error) {
      console.error('Error al guardar la suscripción:', error);
    }

    // Enviar email de confirmación (opcional)
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey !== 're_your_api_key_here') {
      try {
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: import.meta.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [email],
          subject: '✅ Confirmación de suscripción al Newsletter',
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #3b82f6;">¡Bienvenido al Newsletter!</h2>
              <p>Gracias por suscribirte. Recibirás actualizaciones sobre:</p>
              <ul>
                <li>Artículos técnicos sobre arquitectura de software</li>
                <li>Tutoriales de desarrollo web</li>
                <li>Próximos eventos y conferencias</li>
                <li>Recursos y herramientas útiles</li>
              </ul>
              <p>¡Nos vemos pronto!</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px;">
                Si no solicitaste esta suscripción, puedes ignorar este correo.
              </p>
            </div>
          `,
        });

        // Notificar al administrador
        await resend.emails.send({
          from: import.meta.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [import.meta.env.EMAIL_TO || 'wsgestor@gmail.com'],
          subject: `📧 Nueva suscripción al newsletter: ${email}`,
          html: `
            <h3>Nueva suscripción al newsletter</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total de suscriptores:</strong> ${subscriptions.length}</p>
          `,
        });
      } catch (emailError) {
        console.error('Error al enviar email de confirmación:', emailError);
        // No fallar la suscripción si falla el email
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Suscripción exitosa',
        subscribersCount: subscriptions.length
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
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
