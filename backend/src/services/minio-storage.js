import { Client } from 'minio';
import { Readable } from 'stream';

let minioClient = null;

function getMinioClient() {
  if (!minioClient) {
    minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }
  return minioClient;
}

const BUCKET_NAME = process.env.MINIO_BUCKET;

/**
 * Inicializar MinIO - Crear bucket si no existe
 */
export async function initializeMinio() {
  try {
    const client = getMinioClient();

    console.log('🔵 Intentando conectar a MinIO:', {
      endpoint: process.env.MINIO_ENDPOINT,
      port: process.env.MINIO_PORT,
      useSSL: process.env.MINIO_USE_SSL,
      bucket: BUCKET_NAME
    });

    const bucketExists = await client.bucketExists(BUCKET_NAME);

    if (!bucketExists) {
      await client.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ Bucket creado: ${BUCKET_NAME}`);
    } else {
      console.log(`✅ Bucket existe: ${BUCKET_NAME}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error inicializando MinIO:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      name: error.name
    });
    return false;
  }
}

/**
 * Append JSONL (un lead por línea)
 * Estructura: raw/campaign={campaign}/date={YYYY-MM-DD}/leads.jsonl
 */
export async function appendLeadJsonl(leadData) {
  try {
    const client = getMinioClient();
    const {
      email,
      name = 'Anónimo',
      campaign,
      source = 'website',
      resourceId,
      resourceTitle,
      ip,
    } = leadData;

    // Crear objeto de lead
    const lead = {
      email,
      name,
      campaign: campaign || resourceId || 'general',
      source,
      resourceId,
      resourceTitle,
      ip,
      ts: new Date().toISOString(),
      consent: true,
    };

    // Generar path con particionamiento por fecha
    const date = lead.ts.slice(0, 10); // YYYY-MM-DD
    const path = `raw/campaign=${lead.campaign}/date=${date}/leads.jsonl`;

    // Convertir a JSONL (una línea JSON)
    const line = JSON.stringify(lead) + '\n';
    const buffer = Buffer.from(line, 'utf-8');
    const stream = Readable.from([buffer]);

    // Append al archivo (MinIO lo concatena automáticamente)
    await client.putObject(
      BUCKET_NAME,
      path,
      stream,
      buffer.length,
      {
        'Content-Type': 'application/json',
        'x-amz-meta-append': 'true',
      }
    );

    console.log(`💾 Lead guardado en MinIO: ${path}`);
    return { success: true, path };
  } catch (error) {
    console.error('❌ Error guardando lead en MinIO:', error.message);
    throw error;
  }
}

/**
 * Append CSV (alternativa para exportación)
 */
export async function appendLeadCsv(leadData) {
  try {
    const client = getMinioClient();
    const {
      email,
      name = 'Anónimo',
      campaign,
      source = 'website',
      resourceId,
      resourceTitle,
      ip,
    } = leadData;

    const ts = new Date().toISOString();
    const date = ts.slice(0, 10);
    const path = `raw/campaign=${campaign || resourceId || 'general'}/date=${date}/leads.csv`;

    // CSV line (escapar comas en campos)
    const escapeCsv = (str) => `"${String(str).replace(/"/g, '""')}"`;
    const line = [
      escapeCsv(email),
      escapeCsv(name),
      escapeCsv(campaign || resourceId || 'general'),
      escapeCsv(source),
      escapeCsv(resourceId || ''),
      escapeCsv(resourceTitle || ''),
      escapeCsv(ip || ''),
      escapeCsv(ts),
      'true', // consent
    ].join(',') + '\n';

    const buffer = Buffer.from(line, 'utf-8');
    const stream = Readable.from([buffer]);

    await client.putObject(
      BUCKET_NAME,
      path,
      stream,
      buffer.length,
      {
        'Content-Type': 'text/csv',
        'x-amz-meta-append': 'true',
      }
    );

    console.log(`💾 Lead CSV guardado en MinIO: ${path}`);
    return { success: true, path };
  } catch (error) {
    console.error('❌ Error guardando lead CSV en MinIO:', error.message);
    throw error;
  }
}

/**
 * Leer archivo JSONL completo desde MinIO
 */
export async function readJsonlFile(objectPath) {
  try {
    const client = getMinioClient();
    const dataStream = await client.getObject(BUCKET_NAME, objectPath);

    return new Promise((resolve, reject) => {
      let data = '';

      dataStream.on('data', (chunk) => {
        data += chunk;
      });

      dataStream.on('end', () => {
        // Parsear cada línea como JSON
        const leads = data
          .split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line));

        resolve(leads);
      });

      dataStream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('❌ Error leyendo JSONL desde MinIO:', error.message);
    throw error;
  }
}

/**
 * Listar todos los archivos de leads (útil para analytics)
 */
export async function listLeadFiles(prefix = 'raw/') {
  try {
    const client = getMinioClient();
    const objectsList = [];
    const stream = client.listObjects(BUCKET_NAME, prefix, true);

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        if (obj.name.endsWith('.jsonl') || obj.name.endsWith('.csv')) {
          objectsList.push({
            name: obj.name,
            size: obj.size,
            lastModified: obj.lastModified,
          });
        }
      });

      stream.on('end', () => {
        resolve(objectsList);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('❌ Error listando archivos en MinIO:', error.message);
    throw error;
  }
}

/**
 * Obtener estadísticas agregadas de leads
 */
export async function getLeadStats() {
  try {
    const files = await listLeadFiles('raw/');

    const stats = {
      totalFiles: files.length,
      totalSizeBytes: files.reduce((sum, f) => sum + f.size, 0),
      byCampaign: {},
      byDate: {},
      files: files,
    };

    // Agrupar por campaign y fecha desde los paths
    files.forEach(file => {
      const match = file.name.match(/campaign=([^/]+)\/date=([^/]+)/);
      if (match) {
        const [, campaign, date] = match;

        // Por campaña
        if (!stats.byCampaign[campaign]) {
          stats.byCampaign[campaign] = { count: 0, size: 0, files: [] };
        }
        stats.byCampaign[campaign].count++;
        stats.byCampaign[campaign].size += file.size;
        stats.byCampaign[campaign].files.push(file.name);

        // Por fecha
        if (!stats.byDate[date]) {
          stats.byDate[date] = { count: 0, size: 0 };
        }
        stats.byDate[date].count++;
        stats.byDate[date].size += file.size;
      }
    });

    return stats;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
    throw error;
  }
}

/**
 * Exportar todos los leads de una campaña específica
 */
export async function exportCampaignLeads(campaign, format = 'json') {
  try {
    const prefix = `raw/campaign=${campaign}/`;
    const files = await listLeadFiles(prefix);

    const allLeads = [];

    for (const file of files) {
      if (file.name.endsWith('.jsonl')) {
        const leads = await readJsonlFile(file.name);
        allLeads.push(...leads);
      }
    }

    if (format === 'csv') {
      // Convertir a CSV
      const headers = ['email', 'name', 'campaign', 'source', 'resourceId', 'resourceTitle', 'ip', 'timestamp', 'consent'];
      const csvLines = [headers.join(',')];

      allLeads.forEach(lead => {
        const row = [
          lead.email,
          lead.name,
          lead.campaign,
          lead.source,
          lead.resourceId || '',
          lead.resourceTitle || '',
          lead.ip || '',
          lead.ts,
          lead.consent,
        ].map(val => `"${String(val).replace(/"/g, '""')}"`);

        csvLines.push(row.join(','));
      });

      return csvLines.join('\n');
    }

    return allLeads;
  } catch (error) {
    console.error('❌ Error exportando leads:', error.message);
    throw error;
  }
}

/**
 * Health check de MinIO
 */
export async function checkMinioHealth() {
  try {
    const client = getMinioClient();
    const bucketExists = await client.bucketExists(BUCKET_NAME);
    return {
      status: 'ok',
      bucket: BUCKET_NAME,
      bucketExists,
      endpoint: process.env.MINIO_ENDPOINT,
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
    };
  }
}

export default {
  initializeMinio,
  appendLeadJsonl,
  appendLeadCsv,
  readJsonlFile,
  listLeadFiles,
  getLeadStats,
  exportCampaignLeads,
  checkMinioHealth,
};
