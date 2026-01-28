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

  CREATE TABLE IF NOT EXISTS email_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT,
    status TEXT NOT NULL,
    error_message TEXT,
    response_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_email_logs_service ON email_logs(service);
  CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
  CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at);

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    service TEXT NOT NULL,
    project_type TEXT,
    project_stage TEXT,
    budget TEXT,
    timeline TEXT,
    expected_users TEXT,
    features TEXT,
    tech_preferences TEXT,
    has_team TEXT,
    priority TEXT,
    description TEXT,
    calendar_event_id TEXT,
    meet_link TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date, time);
  CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
  CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
  CREATE INDEX IF NOT EXISTS idx_appointments_calendar ON appointments(calendar_event_id);
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

// Funciones de email logs
export function saveEmailLog({ service, recipient, subject, status, errorMessage, responseData }) {
  const stmt = db.prepare(`
    INSERT INTO email_logs (service, recipient, subject, status, error_message, response_data)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(service, recipient, subject, status, errorMessage, JSON.stringify(responseData));
}

export function getAllEmailLogs() {
  return db.prepare('SELECT * FROM email_logs ORDER BY created_at DESC').all();
}

export function getEmailLogsByService(service) {
  return db.prepare('SELECT * FROM email_logs WHERE service = ? ORDER BY created_at DESC').all(service);
}

export function getEmailLogsStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM email_logs').get();
  const byService = db.prepare(`
    SELECT service, COUNT(*) as count,
           SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count,
           SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as error_count
    FROM email_logs
    GROUP BY service
  `).all();

  return {
    totalLogs: total.count,
    byService
  };
}

// Funciones de appointments
export function saveAppointment(appointmentData) {
  const stmt = db.prepare(`
    INSERT INTO appointments (
      name, email, phone, company, date, time, service,
      project_type, project_stage, budget, timeline, expected_users,
      features, tech_preferences, has_team, priority, description,
      calendar_event_id, meet_link, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    appointmentData.name,
    appointmentData.email,
    appointmentData.phone,
    appointmentData.company || null,
    appointmentData.date,
    appointmentData.time,
    appointmentData.service,
    appointmentData.project_type || null,
    appointmentData.project_stage || null,
    appointmentData.budget || null,
    appointmentData.timeline || null,
    appointmentData.expected_users || null,
    typeof appointmentData.features === 'string' ? appointmentData.features : (appointmentData.features || []).join(', '),
    appointmentData.tech_preferences || null,
    appointmentData.has_team || null,
    appointmentData.priority || null,
    appointmentData.description || null,
    appointmentData.calendar_event_id || null,
    appointmentData.meet_link || null,
    appointmentData.status || 'confirmed'
  );
}

export function updateAppointmentCalendarInfo(id, calendarEventId, meetLink) {
  const stmt = db.prepare(`
    UPDATE appointments
    SET calendar_event_id = ?, meet_link = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  return stmt.run(calendarEventId, meetLink, id);
}

export function getOccupiedSlots() {
  const stmt = db.prepare(`
    SELECT date, time
    FROM appointments
    WHERE status = 'confirmed'
    ORDER BY date, time
  `);

  return stmt.all();
}

export function isSlotAvailable(date, time) {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM appointments
    WHERE date = ? AND time = ? AND status = 'confirmed'
  `);

  const result = stmt.get(date, time);
  return result.count === 0;
}

export function getAllAppointments() {
  return db.prepare('SELECT * FROM appointments ORDER BY date DESC, time DESC').all();
}

export function getAppointmentsByDate(date) {
  return db.prepare('SELECT * FROM appointments WHERE date = ? AND status = "confirmed" ORDER BY time').all(date);
}

// Cerrar conexión al finalizar
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

export default db;
