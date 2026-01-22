#!/usr/bin/env node
import dotenv from 'dotenv';
import { runBackup, getDatabaseStats } from './src/services/backup.js';

dotenv.config();

async function main() {
  console.log('\n');

  // Verificar configuración
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
    console.error('❌ RESEND_API_KEY no configurado');
    process.exit(1);
  }

  if (!process.env.EMAIL_TO && !process.env.BACKUP_EMAIL) {
    console.error('❌ EMAIL_TO o BACKUP_EMAIL no configurado');
    process.exit(1);
  }

  try {
    // Mostrar estadísticas antes del backup
    const dbStats = getDatabaseStats();
    console.log('📊 Estadísticas de la base de datos:');
    console.log(`   Archivo: ${dbStats.path}`);
    console.log(`   Tamaño: ${(dbStats.size / 1024).toFixed(2)} KB`);
    console.log('   Tablas:');
    Object.entries(dbStats.tables).forEach(([table, count]) => {
      console.log(`     - ${table}: ${count} registros`);
    });
    console.log('');

    // Ejecutar backup
    const result = await runBackup();

    process.exit(0);
  } catch (error) {
    console.error('Error fatal:', error);
    process.exit(1);
  }
}

main();
