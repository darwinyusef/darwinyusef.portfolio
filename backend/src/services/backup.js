import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Resend } from 'resend';
import { createGzip } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const DB_PATH = process.env.DB_PATH || join(process.cwd(), 'data', 'portfolio.db');
const BACKUP_DIR = process.env.BACKUP_DIR || join(process.cwd(), 'backups');

// Asegurar que el directorio de backups existe
if (!existsSync(BACKUP_DIR)) {
  mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Crear backup de la base de datos SQLite
 */
export async function createBackup() {
  try {
    if (!existsSync(DB_PATH)) {
      throw new Error(`Database file not found: ${DB_PATH}`);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `portfolio-backup-${timestamp}.db`;
    const backupPath = join(BACKUP_DIR, backupFileName);
    const gzipPath = `${backupPath}.gz`;

    console.log(`📦 Creating backup: ${backupFileName}`);

    // Backup usando SQLite backup API (hot backup, sin locks)
    const sourceDb = new Database(DB_PATH, { readonly: true });
    const backupDb = new Database(backupPath);

    await new Promise((resolve, reject) => {
      sourceDb.backup(backupPath, {
        progress: ({ totalPages, remainingPages }) => {
          const progress = ((totalPages - remainingPages) / totalPages) * 100;
          process.stdout.write(`\r   Progress: ${progress.toFixed(1)}%`);
        }
      })
        .then(() => {
          console.log('\n   ✅ Backup created');
          resolve();
        })
        .catch(reject);
    });

    sourceDb.close();
    backupDb.close();

    // Comprimir backup con gzip
    console.log('🗜️  Compressing backup...');
    await pipeline(
      createReadStream(backupPath),
      createGzip({ level: 9 }),
      createWriteStream(gzipPath)
    );

    console.log('   ✅ Backup compressed');

    // Obtener estadísticas del backup
    const stats = {
      fileName: backupFileName,
      gzipFileName: `${backupFileName}.gz`,
      backupPath: gzipPath,
      timestamp: new Date().toISOString(),
      originalSize: readFileSync(backupPath).length,
      compressedSize: readFileSync(gzipPath).length
    };

    // Calcular ratio de compresión
    stats.compressionRatio = ((1 - stats.compressedSize / stats.originalSize) * 100).toFixed(1);

    console.log(`   Original: ${(stats.originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Compressed: ${(stats.compressedSize / 1024).toFixed(2)} KB`);
    console.log(`   Ratio: ${stats.compressionRatio}%`);

    return stats;
  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
    throw error;
  }
}

/**
 * Enviar backup por email usando Resend
 */
export async function sendBackupEmail(backupStats) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey || resendApiKey === 're_your_api_key_here') {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(resendApiKey);
    const backupFile = readFileSync(backupStats.backupPath);
    const base64Content = backupFile.toString('base64');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .stat-row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #6b7280; }
    .value { color: #111827; font-weight: 500; }
    .success { color: #10b981; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🗄️ Backup de Base de Datos</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Portfolio - SQLite Backup</p>
    </div>
    <div class="content">
      <p><strong class="success">✅ Backup completado exitosamente</strong></p>

      <div class="stats">
        <h3 style="margin-top: 0;">📊 Estadísticas del Backup</h3>
        <div class="stat-row">
          <span class="label">Archivo:</span>
          <span class="value">${backupStats.gzipFileName}</span>
        </div>
        <div class="stat-row">
          <span class="label">Fecha:</span>
          <span class="value">${new Date(backupStats.timestamp).toLocaleString('es-ES')}</span>
        </div>
        <div class="stat-row">
          <span class="label">Tamaño Original:</span>
          <span class="value">${(backupStats.originalSize / 1024).toFixed(2)} KB</span>
        </div>
        <div class="stat-row">
          <span class="label">Tamaño Comprimido:</span>
          <span class="value">${(backupStats.compressedSize / 1024).toFixed(2)} KB</span>
        </div>
        <div class="stat-row">
          <span class="label">Compresión:</span>
          <span class="value success">${backupStats.compressionRatio}%</span>
        </div>
      </div>

      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        💾 El archivo adjunto contiene el backup comprimido de la base de datos SQLite.
        Guárdalo en un lugar seguro.
      </p>
    </div>
    <div class="footer">
      <p>🤖 Backup automático generado por Portfolio Backend</p>
      <p style="font-size: 12px; color: #9ca3af;">darwinyusef.com</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    console.log('📧 Sending backup email...');

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [process.env.EMAIL_TO || process.env.BACKUP_EMAIL],
      subject: `🗄️ Backup SQLite - ${new Date().toLocaleDateString('es-ES')}`,
      html: emailHtml,
      attachments: [
        {
          filename: backupStats.gzipFileName,
          content: base64Content
        }
      ]
    });

    console.log(`   ✅ Email sent: ${result.data?.id || result.id}`);

    return {
      success: true,
      emailId: result.data?.id || result.id,
      recipient: process.env.EMAIL_TO || process.env.BACKUP_EMAIL
    };
  } catch (error) {
    console.error('❌ Error sending backup email:', error.message);
    throw error;
  }
}

/**
 * Ejecutar backup completo: crear + enviar por email
 */
export async function runBackup() {
  console.log('═'.repeat(60));
  console.log('🚀 Iniciando proceso de backup');
  console.log(`📅 ${new Date().toLocaleString('es-ES')}`);
  console.log('═'.repeat(60));

  try {
    // Crear backup
    const backupStats = await createBackup();

    // Enviar por email
    const emailResult = await sendBackupEmail(backupStats);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ BACKUP COMPLETADO EXITOSAMENTE');
    console.log('═'.repeat(60));
    console.log(`📦 Archivo: ${backupStats.gzipFileName}`);
    console.log(`💾 Tamaño: ${(backupStats.compressedSize / 1024).toFixed(2)} KB`);
    console.log(`📧 Email ID: ${emailResult.emailId}`);
    console.log(`👤 Enviado a: ${emailResult.recipient}`);
    console.log('═'.repeat(60));

    return {
      success: true,
      backup: backupStats,
      email: emailResult
    };
  } catch (error) {
    console.error('\n' + '═'.repeat(60));
    console.error('❌ ERROR EN BACKUP');
    console.error('═'.repeat(60));
    console.error(error.message);
    console.error('═'.repeat(60));

    throw error;
  }
}

/**
 * Obtener estadísticas de la base de datos
 */
export function getDatabaseStats() {
  try {
    const db = new Database(DB_PATH, { readonly: true });

    const tables = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table'
    `).all();

    const stats = {
      path: DB_PATH,
      size: existsSync(DB_PATH) ? readFileSync(DB_PATH).length : 0,
      tables: {}
    };

    tables.forEach(({ name }) => {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${name}`).get();
      stats.tables[name] = count.count;
    });

    db.close();

    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
}

export default {
  createBackup,
  sendBackupEmail,
  runBackup,
  getDatabaseStats
};
