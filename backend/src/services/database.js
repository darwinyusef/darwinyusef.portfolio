import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const DB_DIR = join(process.cwd(), 'data');
const DB_PATH = join(DB_DIR, 'portfolio.db');

// Crear directorio si no existe
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

// Inicializar base de datos
const db = new Database(DB_PATH);

// Habilitar WAL mode para mejor concurrencia
db.pragma('journal_mode = WAL');

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id TEXT NOT NULL,
    resource_title TEXT,
    name TEXT,
    email TEXT NOT NULL,
    campaign TEXT,
    source TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
  CREATE INDEX IF NOT EXISTS idx_leads_resource ON leads(resource_id);
  CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

  CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active'
  );

  CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
  CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at);
`);

console.log('✅ Database initialized:', DB_PATH);

// Funciones de leads
export function saveLead({ resourceId, resourceTitle, name, email, campaign, source, ip }) {
  const stmt = db.prepare(`
    INSERT INTO leads (resource_id, resource_title, name, email, campaign, source, ip)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(resourceId, resourceTitle, name, email, campaign, source, ip);
}

export function getAllLeads() {
  return db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
}

export function getLeadsByResource(resourceId) {
  return db.prepare('SELECT * FROM leads WHERE resource_id = ? ORDER BY created_at DESC').all(resourceId);
}

export function getLeadsStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM leads').get();

  const byResource = db.prepare(`
    SELECT
      resource_id,
      resource_title,
      COUNT(*) as count,
      MAX(created_at) as last_download
    FROM leads
    GROUP BY resource_id
    ORDER BY count DESC
  `).all();

  const recent = db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 10').all();

  return {
    totalLeads: total.count,
    byResource,
    recentLeads: recent
  };
}

// Funciones de newsletter
export function subscribeNewsletter(email) {
  const stmt = db.prepare(`
    INSERT INTO newsletter_subscriptions (email)
    VALUES (?)
    ON CONFLICT(email) DO UPDATE SET
      subscribed_at = CURRENT_TIMESTAMP,
      status = 'active'
  `);

  return stmt.run(email);
}

export function isSubscribedNewsletter(email) {
  const result = db.prepare('SELECT * FROM newsletter_subscriptions WHERE email = ? AND status = ?').get(email, 'active');
  return !!result;
}

export function getNewsletterStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM newsletter_subscriptions WHERE status = ?').get('active');
  const recent = db.prepare('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC LIMIT 10').all();

  return {
    totalSubscribers: total.count,
    recentSubscriptions: recent
  };
}

// Funciones de contacto
export function saveContact({ name, email, message, ip }) {
  const stmt = db.prepare(`
    INSERT INTO contacts (name, email, message, ip)
    VALUES (?, ?, ?, ?)
  `);

  return stmt.run(name, email, message, ip);
}

export function getAllContacts() {
  return db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
}

export function getContactsStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM contacts').get();
  const recent = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10').all();

  return {
    totalContacts: total.count,
    recentContacts: recent
  };
}

// Cerrar conexión al finalizar
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

export default db;
