import dotenv from 'dotenv';
import { createBackup, sendBackupEmail, getDatabaseStats } from './src/services/backup.js';

dotenv.config();

console.log('═'.repeat(70));
console.log('🧪 PRUEBA DEL SISTEMA DE BACKUP');
console.log('═'.repeat(70));
console.log('');

// Verificar configuración
console.log('📋 Verificando configuración...');
const config = {
  resendKey: process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada',
  emailFrom: process.env.EMAIL_FROM || '❌ No configurado',
  emailTo: process.env.EMAIL_TO || '❌ No configurado',
  dbPath: process.env.DB_PATH || 'data/portfolio.db (default)'
};

console.log(`   RESEND_API_KEY: ${config.resendKey}`);
console.log(`   EMAIL_FROM: ${config.emailFrom}`);
console.log(`   EMAIL_TO: ${config.emailTo}`);
console.log(`   DB_PATH: ${config.dbPath}`);
console.log('');

if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
  console.error('❌ RESEND_API_KEY no configurado. Edita el archivo .env');
  process.exit(1);
}

if (!process.env.EMAIL_TO) {
  console.error('❌ EMAIL_TO no configurado. Edita el archivo .env');
  process.exit(1);
}

async function test() {
  try {
    // 1. Obtener estadísticas de la base de datos
    console.log('1️⃣  Obteniendo estadísticas de la base de datos...');
    const dbStats = getDatabaseStats();
    console.log(`   ✅ Base de datos encontrada: ${dbStats.path}`);
    console.log(`   📊 Tamaño: ${(dbStats.size / 1024).toFixed(2)} KB`);
    console.log('   📋 Tablas:');
    Object.entries(dbStats.tables).forEach(([table, count]) => {
      console.log(`      - ${table}: ${count} registros`);
    });
    console.log('');

    // 2. Crear backup
    console.log('2️⃣  Creando backup...');
    const backupStats = await createBackup();
    console.log(`   ✅ Backup creado: ${backupStats.fileName}`);
    console.log(`   💾 Original: ${(backupStats.originalSize / 1024).toFixed(2)} KB`);
    console.log(`   🗜️  Comprimido: ${(backupStats.compressedSize / 1024).toFixed(2)} KB`);
    console.log(`   📉 Ratio: ${backupStats.compressionRatio}%`);
    console.log('');

    // 3. Enviar email
    console.log('3️⃣  Enviando backup por email...');
    const emailResult = await sendBackupEmail(backupStats);
    console.log(`   ✅ Email enviado exitosamente`);
    console.log(`   📧 Email ID: ${emailResult.emailId}`);
    console.log(`   👤 Destinatario: ${emailResult.recipient}`);
    console.log('');

    // Resumen final
    console.log('═'.repeat(70));
    console.log('✅ PRUEBA EXITOSA');
    console.log('═'.repeat(70));
    console.log('');
    console.log('📝 Resumen:');
    console.log(`   • Backup creado: ${backupStats.gzipFileName}`);
    console.log(`   • Tamaño final: ${(backupStats.compressedSize / 1024).toFixed(2)} KB`);
    console.log(`   • Email ID: ${emailResult.emailId}`);
    console.log(`   • Ubicación: backups/${backupStats.gzipFileName}`);
    console.log('');
    console.log('📧 Revisa tu email en: ' + config.emailTo);
    console.log('   Deberías ver un email con:');
    console.log('   - Asunto: 🗄️ Backup SQLite - ' + new Date().toLocaleDateString('es-ES'));
    console.log('   - Adjunto: ' + backupStats.gzipFileName);
    console.log('');
    console.log('🚀 El sistema de backup está listo para producción');
    console.log('═'.repeat(70));

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('═'.repeat(70));
    console.error('❌ ERROR EN LA PRUEBA');
    console.error('═'.repeat(70));
    console.error('');
    console.error('Error:', error.message);
    console.error('');

    if (error.message.includes('Database file not found')) {
      console.error('💡 Solución: Verifica que el archivo portfolio.db existe en:');
      console.error('   ' + (process.env.DB_PATH || 'backend/data/portfolio.db'));
    } else if (error.message.includes('RESEND_API_KEY')) {
      console.error('💡 Solución: Configura RESEND_API_KEY en el archivo .env');
    } else if (error.message.includes('EMAIL')) {
      console.error('💡 Solución: Configura EMAIL_TO en el archivo .env');
    }

    console.error('');
    console.error('═'.repeat(70));
    process.exit(1);
  }
}

test();
