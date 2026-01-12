# Test de Appointments API

## Endpoint
```
POST http://localhost:3001/api/appointments
```

## Ejemplos de cURL para Testing

### Prueba Básica - Evento de hoy a las 2:00 PM
```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prueba 2:00 PM Hoy",
    "email": "wsgestor@gmail.com",
    "phone": "+57 301 234 5678",
    "company": "AQUI CREAMOS Test",
    "date": "2026-01-09",
    "time": "14:00",
    "service": "Asesoría Técnica",
    "advisory_type": "not_sure",
    "project_type": "Consultoría",
    "project_stage": "En desarrollo",
    "budget": "$5,000 - $15,000",
    "timeline": "Rápido (1-2 meses)",
    "expected_users": "100-1,000 usuarios",
    "features": ["Optimización de rendimiento"],
    "tech_preferences": "Node.js",
    "has_team": "Sí, tengo equipo",
    "priority": "Calidad primero",
    "description": "Evento de prueba para hoy a las 2 PM - Validación final del sistema"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Asesoría agendada exitosamente. Emails enviados y evento creado en calendario.",
  "data": {
    "adminEmailId": "960defec-c03a-46b6-b0c7-36c1c640f0a5",
    "clientEmailId": "a4960a57-5033-4c2d-81c7-c17135fcf976",
    "calendarEventId": "v3rmoc3vnfafcjhfckrpkt7rdk",
    "meetLink": "https://meet.google.com/ghe-nsyr-bdu"
  }
}
```

---

### Prueba Completa - Con todos los campos
```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prueba Completa Sistema",
    "email": "wsgestor@gmail.com",
    "phone": "+57 301 234 5678",
    "company": "AQUI CREAMOS Test SAS",
    "date": "2026-02-25",
    "time": "10:00",
    "service": "Desarrollo de Aplicaciones Web",
    "advisory_type": "new_project",
    "project_type": "Aplicación Web",
    "project_stage": "Solo es una idea",
    "budget": "$15,000 - $50,000",
    "timeline": "Normal (3-6 meses)",
    "expected_users": "1,000-10,000 usuarios",
    "features": ["Autenticación de usuarios", "Panel de administración", "Integración con APIs externas", "Reportes y análisis"],
    "tech_preferences": "React, Node.js, PostgreSQL, AWS",
    "has_team": "No, necesito contratar",
    "priority": "Lanzar rápido (MVP)",
    "description": "CONTEXTO INICIAL:\nQuiero crear una plataforma SaaS para gestión de proyectos que integre IA para sugerencias automáticas. Tengo el modelo de negocio validado con 50 clientes potenciales interesados.\n\nDETALLES ADICIONALES:\nNecesito sistema de roles y permisos avanzado, integración con Slack y Microsoft Teams, dashboard en tiempo real con WebSockets, y capacidad de generar reportes PDF personalizados. La aplicación debe soportar múltiples idiomas (ES, EN, PT) y cumplir con GDPR."
  }'
```

---

### Prueba - Evento a las 3:00 PM hoy
```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prueba Evento Hoy",
    "email": "wsgestor@gmail.com",
    "phone": "+57 301 234 5678",
    "company": "AQUI CREAMOS Test",
    "date": "2026-01-09",
    "time": "15:00",
    "service": "Desarrollo de Aplicaciones Web",
    "advisory_type": "new_project",
    "project_type": "Aplicación Web",
    "project_stage": "Solo es una idea",
    "budget": "$15,000 - $50,000",
    "timeline": "Normal (3-6 meses)",
    "expected_users": "1,000-10,000 usuarios",
    "features": ["Autenticación de usuarios", "Panel de administración"],
    "tech_preferences": "React, Node.js, PostgreSQL",
    "has_team": "No, necesito contratar",
    "priority": "Lanzar rápido (MVP)",
    "description": "Evento de prueba para hoy a las 3 PM"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Asesoría agendada exitosamente. Emails enviados y evento creado en calendario.",
  "data": {
    "adminEmailId": "85a8098d-edad-425a-b4f5-5bdce328379c",
    "clientEmailId": "2d2382d3-fe6e-4601-af2c-d14f4214a819",
    "calendarEventId": "og068q173ul2gu6mkne1a0l4ms",
    "meetLink": "https://meet.google.com/iyw-mmgq-dzj"
  }
}
```

---

## Campos Requeridos

### Obligatorios
- `name`: Nombre completo del cliente
- `email`: Email del cliente
- `phone`: Teléfono del cliente
- `date`: Fecha en formato YYYY-MM-DD
- `time`: Hora en formato HH:MM (24 horas)
- `service`: Tipo de servicio

### Opcionales
- `company`: Nombre de la empresa
- `advisory_type`: Tipo de asesoría inicial (new_project, improve_existing, scale_business, etc.)
- `project_type`: Tipo de proyecto (Aplicación Web, App Móvil, etc.)
- `project_stage`: Etapa del proyecto (Solo es una idea, En desarrollo, etc.)
- `budget`: Presupuesto estimado
- `timeline`: Tiempo estimado del proyecto
- `expected_users`: Cantidad de usuarios esperados
- `features`: Array de características deseadas
- `tech_preferences`: Preferencias tecnológicas
- `has_team`: Si tiene equipo técnico
- `priority`: Prioridad del proyecto
- `description`: Descripción detallada del proyecto

---

## Valores para advisory_type

```javascript
'new_project': 'Tengo una idea nueva'
'improve_existing': 'Mejorar lo que tengo'
'scale_business': 'Crecer mi negocio'
'ai_integration': 'Usar Inteligencia Artificial'
'fix_problems': 'Resolver problemas'
'guide_team': 'Guiar mi equipo técnico'
'project_stuck': 'Mi proyecto está estancado'
'limited_budget': 'Tengo presupuesto limitado'
'validate_idea': 'Validar mi idea de negocio'
'migrate_tech': 'Actualizar tecnología antigua'
'security': 'Mejorar la seguridad'
'integration': 'Conectar mis sistemas'
'not_sure': 'No estoy seguro'
```

---

## Funcionalidades del Sistema

✅ **Emails**:
- Email de notificación al admin (wsgestor@gmail.com)
- Email de confirmación al cliente
- Reply-to configurado para respuesta directa

✅ **Google Calendar**:
- Creación automática de eventos
- Generación de Google Meet links
- Autenticación permanente con refresh_token

✅ **Base de datos**:
- Almacenamiento local en SQLite
- Guardado de todos los 16 campos
- Registro de calendar_event_id

---

## Configuración de Producción

Cuando se despliegue en **aquicreamos.com**, actualizar:

### Frontend (wpaqc):
```env
BACKEND_URL=https://backend.aquicreamos.com
```

### Backend (portfolio/backend):
```env
OAUTH2_REDIRECT_URI=https://backend.aquicreamos.com/api/calendar/oauth2callback
```

**Nota**: Agregar la nueva redirect URI en Google Cloud Console y re-autenticar una vez en producción.
