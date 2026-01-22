import { Resend } from 'resend';
import dotenv from 'dotenv';
import { saveEmailLog, getEmailLogsStats } from './src/services/database.js';
import {
  contactFormTemplate,
  newsletterWelcomeTemplate,
  newsletterAdminNotification,
  cvDownloadTemplate,
  leadMagnetTemplate,
  leadMagnetAdminNotification,
  testimonialTemplate
} from './src/templates/email-templates.js';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const testEmail = process.env.EMAIL_TO || 'test@example.com';

const services = [
  {
    name: 'contact',
    subject: '🧪 TEST - Solicitud de Asesoría Arquitectónica',
    template: contactFormTemplate({
      name: 'Test User',
      email: testEmail,
      message: 'Este es un email de prueba del servicio de contacto'
    })
  },
  {
    name: 'newsletter-welcome',
    subject: '🧪 TEST - Bienvenido al Newsletter',
    template: newsletterWelcomeTemplate(testEmail)
  },
  {
    name: 'newsletter-admin',
    subject: '🧪 TEST - Nueva suscripción al newsletter',
    template: newsletterAdminNotification(testEmail, 100)
  },
  {
    name: 'cv-download',
    subject: '🧪 TEST - Tu CV está listo para descargar',
    template: cvDownloadTemplate(testEmail, 'https://example.com/cv.pdf')
  },
  {
    name: 'lead-magnet',
    subject: '🧪 TEST - Tu recurso está listo',
    template: leadMagnetTemplate('Test User', testEmail, {
      title: 'Recurso de prueba',
      description: 'Descripción del recurso',
      downloadUrl: 'https://example.com/resource.pdf'
    })
  },
  {
    name: 'lead-magnet-admin',
    subject: '🧪 TEST - Nuevo lead capturado',
    template: leadMagnetAdminNotification('Test User', testEmail, {
      title: 'Recurso de prueba'
    })
  },
  {
    name: 'testimonial',
    subject: '🧪 TEST - Nuevo testimonio recibido',
    template: testimonialTemplate({
      name: 'Test User',
      role: 'Developer',
      company: 'Test Company',
      email: testEmail,
      content: 'Este es un testimonio de prueba',
      rating: 5
    })
  }
];

async function testEmailService(service) {
  console.log(`\n📧 Probando servicio: ${service.name}`);
  console.log(`   Destinatario: ${testEmail}`);
  console.log(`   Asunto: ${service.subject}`);

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [testEmail],
      subject: service.subject,
      html: service.template
    });

    console.log(`   ✅ Éxito - ID: ${result.data?.id || result.id}`);

    saveEmailLog({
      service: service.name,
      recipient: testEmail,
      subject: service.subject,
      status: 'success',
      errorMessage: null,
      responseData: result
    });

    return { service: service.name, status: 'success', result };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);

    saveEmailLog({
      service: service.name,
      recipient: testEmail,
      subject: service.subject,
      status: 'error',
      errorMessage: error.message,
      responseData: { error: error.message }
    });

    return { service: service.name, status: 'error', error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando pruebas de servicios de email');
  console.log(`📨 Usando API Key: ${process.env.RESEND_API_KEY ? '✓ Configurada' : '✗ No configurada'}`);
  console.log(`📧 Email remitente: ${process.env.EMAIL_FROM}`);
  console.log(`📥 Email destinatario: ${testEmail}`);
  console.log('═'.repeat(60));

  const results = [];

  for (const service of services) {
    const result = await testEmailService(service);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 RESUMEN DE PRUEBAS');
  console.log('═'.repeat(60));

  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;

  console.log(`\n✅ Exitosos: ${successful}/${services.length}`);
  console.log(`❌ Fallidos: ${failed}/${services.length}`);

  const stats = getEmailLogsStats();
  console.log(`\n📈 Estadísticas generales:`);
  console.log(`   Total de logs: ${stats.totalLogs}`);
  stats.byService.forEach(s => {
    console.log(`   ${s.service}: ${s.success_count} éxitos, ${s.error_count} errores`);
  });

  console.log('\n✅ Todos los resultados guardados en SQLite');
  process.exit(0);
}

runAllTests().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
