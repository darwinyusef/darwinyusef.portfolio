import { getAllEmailLogs, getEmailLogsStats } from './src/services/database.js';

console.log('📊 Logs de Email guardados en SQLite\n');
console.log('═'.repeat(80));

const logs = getAllEmailLogs();

logs.forEach((log, index) => {
  console.log(`\n[${index + 1}] Servicio: ${log.service}`);
  console.log(`    Destinatario: ${log.recipient}`);
  console.log(`    Asunto: ${log.subject}`);
  console.log(`    Estado: ${log.status === 'success' ? '✅' : '❌'} ${log.status}`);
  console.log(`    Fecha: ${log.created_at}`);
  if (log.error_message) {
    console.log(`    Error: ${log.error_message}`);
  }
  if (log.response_data) {
    const data = JSON.parse(log.response_data);
    if (data.data?.id || data.id) {
      console.log(`    Email ID: ${data.data?.id || data.id}`);
    }
  }
});

console.log('\n' + '═'.repeat(80));
const stats = getEmailLogsStats();
console.log('\n📈 Estadísticas:');
console.log(`   Total de logs: ${stats.totalLogs}`);
stats.byService.forEach(s => {
  console.log(`   - ${s.service}: ${s.success_count} ✅ / ${s.error_count} ❌`);
});

process.exit(0);
