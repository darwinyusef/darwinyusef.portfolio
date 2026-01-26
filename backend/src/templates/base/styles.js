// ========================================
// Estilos Base para Email Templates
// ========================================

export const emailStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #f3f4f6;
      color: #111827;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding: 0;
      margin: 0;
    }

    .email-wrapper {
      width: 100%;
      background: #f3f4f6;
      padding: 40px 20px;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    /* Header con Logo */
    .brand-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      text-align: center;
      border-bottom: 4px solid #f59e0b;
    }

    .brand-logo-img {
      max-width: 200px;
      height: auto;
      margin: 0 auto;
      display: block;
    }

    .brand-name {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-top: 12px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .brand-tagline {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      margin-top: 8px;
      letter-spacing: 0.5px;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      padding: 50px 40px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
    }

    .hero-icon {
      width: 90px;
      height: 90px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
    }

    .hero-title {
      font-size: 32px;
      font-weight: 900;
      color: #111827;
      text-align: center;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 16px;
      color: #6b7280;
      text-align: center;
      font-weight: 500;
      line-height: 1.5;
    }

    /* Content Section */
    .content-section {
      padding: 48px 40px;
      background: #ffffff;
    }

    .info-card {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      transition: all 0.3s ease;
    }

    .info-label {
      font-size: 12px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info-value {
      font-size: 17px;
      color: #111827;
      font-weight: 600;
      line-height: 1.6;
    }

    .info-value a {
      color: #667eea;
      text-decoration: none;
      font-weight: 700;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .info-value a:hover {
      border-bottom: 2px solid #667eea;
    }

    .message-card {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
      border: 2px solid #667eea;
      border-left: 6px solid #667eea;
      border-radius: 12px;
      padding: 28px;
      margin-top: 28px;
    }

    .message-title {
      font-size: 13px;
      font-weight: 800;
      color: #667eea;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
    }

    .message-content {
      font-size: 16px;
      color: #374151;
      line-height: 1.8;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-weight: 500;
    }

    /* Action Section */
    .action-section {
      text-align: center;
      padding: 40px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .cta-button {
      display: inline-block;
      padding: 18px 48px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 0.5px;
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      text-transform: uppercase;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(102, 126, 234, 0.5);
    }

    /* Footer Section */
    .footer-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      text-align: center;
      color: #ffffff;
    }

    .footer-info {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
      font-weight: 500;
    }

    .footer-brand {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      margin: 16px 0;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .footer-meta {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 16px;
      font-weight: 500;
    }

    .footer-social {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .footer-social a {
      color: #ffffff;
      text-decoration: none;
      margin: 0 12px;
      font-size: 14px;
      font-weight: 600;
      opacity: 0.9;
      transition: opacity 0.3s ease;
    }

    .footer-social a:hover {
      opacity: 1;
    }

    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
      margin: 32px 0;
    }

    /* Utility Classes */
    .text-center {
      text-align: center;
    }

    .mb-4 {
      margin-bottom: 16px;
    }

    .mt-4 {
      margin-top: 16px;
    }

    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }

      .content-section,
      .brand-header,
      .action-section,
      .footer-section {
        padding-left: 24px;
        padding-right: 24px;
      }

      .hero-section {
        padding: 40px 24px;
      }

      .hero-title {
        font-size: 24px;
      }

      .cta-button {
        padding: 16px 32px;
        font-size: 14px;
      }

      .brand-name {
        font-size: 24px;
      }
    }
  </style>
`;
