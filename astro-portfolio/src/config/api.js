// Configuración de la URL base de la API
export const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

// Helper para construir URLs de API
export function getApiUrl(endpoint) {
  return `${API_BASE_URL}${endpoint}`;
}
