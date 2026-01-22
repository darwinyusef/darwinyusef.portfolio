import db from './src/services/database.js';

console.log('📊 DATOS EN portfolio.db\n');
console.log('Ubicación: G:\\darwinyusef.portfolio\\backend\\data\\portfolio.db\n');
console.log('═'.repeat(80));

// Email Logs
console.log('\n📧 TABLA: email_logs');
const emailLogs = db.prepare('SELECT * FROM email_logs ORDER BY created_at DESC').all();
console.log(`Total registros: ${emailLogs.length}\n`);
emailLogs.forEach((log, i) => {
  console.log(`[${i+1}] ${log.service} | ${log.status} | ${log.recipient} | ${log.created_at}`);
  if (log.error_message) console.log(`    Error: ${log.error_message}`);
});

// Newsletter Subscriptions
console.log('\n\n📬 TABLA: newsletter_subscriptions');
const newsletters = db.prepare('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC').all();
console.log(`Total registros: ${newsletters.length}\n`);
newsletters.forEach((sub, i) => {
  console.log(`[${i+1}] ${sub.email} | ${sub.status} | ${sub.subscribed_at}`);
});

// Leads
console.log('\n\n🎯 TABLA: leads');
const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
console.log(`Total registros: ${leads.length}\n`);
leads.forEach((lead, i) => {
  console.log(`[${i+1}] ${lead.email} | ${lead.resource_title || lead.resource_id} | ${lead.created_at}`);
});

// Contacts
console.log('\n\n💬 TABLA: contacts');
const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
console.log(`Total registros: ${contacts.length}\n`);
contacts.forEach((contact, i) => {
  console.log(`[${i+1}] ${contact.name} | ${contact.email} | ${contact.created_at}`);
  console.log(`    Mensaje: ${contact.message.substring(0, 60)}...`);
});

console.log('\n' + '═'.repeat(80));

process.exit(0);
