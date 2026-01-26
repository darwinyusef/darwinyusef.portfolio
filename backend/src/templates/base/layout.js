import { emailStyles } from './styles.js';

// ========================================
// Layout Base con Logo
// ========================================

export function createEmailLayout({
  logoUrl = 'https://darwinyusef.com/favicon.svg',
  brandName = '@DARWINYUSEF',
  brandTagline = 'Full-Stack Developer & Software Architect',
  heroIcon = '🚀',
  heroTitle,
  heroSubtitle,
  content,
  ctaText,
  ctaUrl,
  footerText,
  footerLinks = []
}) {
  const currentDate = new Date().toLocaleString('es-ES', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        ${emailStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">

            <!-- Brand Header -->
            <div class="brand-header">
              ${logoUrl ? `<img src="${logoUrl}" alt="${brandName}" class="brand-logo-img" />` : ''}
              <div class="brand-name">${brandName}</div>
              ${brandTagline ? `<div class="brand-tagline">${brandTagline}</div>` : ''}
            </div>

            <!-- Hero Section -->
            <div class="hero-section">
              ${heroIcon ? `<div class="hero-icon">${heroIcon}</div>` : ''}
              <h1 class="hero-title">${heroTitle}</h1>
              ${heroSubtitle ? `<p class="hero-subtitle">${heroSubtitle}</p>` : ''}
            </div>

            <!-- Content Section -->
            <div class="content-section">
              ${content}
            </div>

            ${ctaText && ctaUrl ? `
            <!-- Action Section -->
            <div class="action-section">
              <a href="${ctaUrl}" class="cta-button">
                ${ctaText}
              </a>
            </div>
            ` : ''}

            <!-- Footer -->
            <div class="footer-section">
              ${footerText ? `<p class="footer-info">${footerText}</p>` : ''}
              <div class="footer-brand">${brandName}</div>
              <p class="footer-meta">${currentDate} • Bogotá, Colombia</p>

              ${footerLinks.length > 0 ? `
              <div class="footer-social">
                ${footerLinks.map(link => `
                  <a href="${link.url}">${link.text}</a>
                `).join('')}
              </div>
              ` : ''}
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

// ========================================
// Helper: Info Card
// ========================================

export function createInfoCard({ label, value, emoji = '' }) {
  return `
    <div class="info-card">
      <div class="info-label">${emoji} ${label}</div>
      <div class="info-value">${value}</div>
    </div>
  `;
}

// ========================================
// Helper: Message Card
// ========================================

export function createMessageCard({ title, content }) {
  return `
    <div class="message-card">
      <div class="message-title">${title}</div>
      <div class="message-content">${content}</div>
    </div>
  `;
}

// ========================================
// Helper: Divider
// ========================================

export function createDivider() {
  return `<div class="divider"></div>`;
}
