import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { chat } from '../services/ai.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('🔵 API /ask-ai llamada');
  try {
    const { serviceName, serviceDescription, conversationHistory, isInitialMessage } = req.body;

    if (!serviceName || !serviceDescription) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: serviceName y serviceDescription',
      });
    }

    if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'Ningún proveedor de IA configurado. Por favor, contacta al administrador.',
      });
    }

    let techStack = '';
    try {
      const languagesPath = join(process.cwd(), 'data', 'languages.json');
      const languagesData = JSON.parse(readFileSync(languagesPath, 'utf-8'));

      const csvLines = languagesData
        .filter((tech) => tech.is_active)
        .map((tech) => `${tech.name},${tech.yearsOfExperience}y,${tech.proficiency}%`);

      techStack = csvLines.join('; ');
      console.log('📚 Stack tecnológico cargado:', languagesData.length, 'tecnologías en formato CSV');
    } catch (error) {
      console.error('⚠️ No se pudo cargar languages.json:', error);
    }

    const systemPrompt = `Eres un asistente técnico experto en tecnología y desarrollo de software representando a Yusef González. Tu ÚNICO rol es educar y aclarar dudas técnicas sobre el siguiente servicio:

**Servicio:** ${serviceName}
**Descripción:** ${serviceDescription}

**Stack Técnico de Yusef (formato: Nombre,Años,Proficiencia):**
${techStack}

🚫 RESTRICCIONES ABSOLUTAS - NO PUEDES:
- Mencionar precios, costos, tarifas o presupuestos
- Hacer ofertas comerciales o promociones
- Actuar como vendedor o comercial
- Negociar términos o condiciones
- Dar cotizaciones o estimaciones de precio
- Usar lenguaje de ventas ("compra ahora", "oferta especial", "descuento", etc.)

✅ TU ROL ES SOLO:
- Explicar conceptos técnicos del servicio
- Aclarar dudas sobre tecnologías y arquitecturas
- Describir funcionalidades y características técnicas
- Responder preguntas sobre implementación
- Orientar sobre casos de uso apropiados

Si te preguntan sobre precios/costos/presupuestos, responde:
"Para información sobre costos y presupuestos, por favor contacta directamente a través de la sección de contacto o <a href='/arquitectura'>arquitectura</a>. Yo solo puedo ayudarte con dudas técnicas sobre el servicio."

FORMATO DE RESPUESTA OBLIGATORIO:
- USA HTML VÁLIDO, NO MARKDOWN NI TEXTO PLANO
- Títulos y conceptos importantes: <strong>Texto Importante</strong>
- Párrafos: <p>contenido</p>
- Listas: <ul><li>item</li></ul>
- Enlaces: <a href="/ruta">texto</a>
- NUNCA uses ** para negrita, SIEMPRE usa <strong>
- NUNCA uses - para listas, SIEMPRE usa <ul><li>

EJEMPLO CORRECTO:
<p>Los <strong>beneficios técnicos principales</strong> incluyen:</p>
<ul>
<li><strong>Mejora de la comunicación:</strong> Facilita el intercambio de información.</li>
<li><strong>Notificaciones efectivas:</strong> Mantiene a los usuarios informados en tiempo real.</li>
</ul>

Pautas adicionales:
- Sé conciso: 50-150 palabras por respuesta
- Menciona tecnologías específicas del stack cuando sea relevante
- Responde directamente a las preguntas técnicas del usuario
- Mantén el contexto de la conversación
- Enfócate en aspectos técnicos, NO comerciales`;

    const contents = [];

    if (isInitialMessage) {
      contents.push({
        role: 'user',
        parts: [{ text: `Dame una introducción técnica completa sobre este servicio. Estructura tu respuesta así:

1. ¿Qué es exactamente? (usa <strong> para el nombre del servicio)
2. ¿Para qué sirve y qué problemas técnicos resuelve?
3. ¿En qué casos de uso es apropiado y dame un ejemplo sencillo ?
4. Beneficios técnicos principales (usa <ul><li> y <strong> para cada beneficio)

Al final, SOLO menciona que para más información técnica y consultas pueden visitar: <a href="/arquitectura">nuestra sección de arquitectura</a>

⚠️ IMPORTANTE:
- NO menciones nada sobre desarrollo, ventas, o servicios comerciales
- NO ofrezcas asesoría ni servicios
- Enfócate SOLO en explicar el aspecto técnico del servicio
- Usa <strong> para resaltar conceptos clave
- Usa <ul><li> para las listas
- Incluye emojis técnicos relevantes (📊, 🚀, ⚙️, 💻, etc.)
- TODO debe estar en HTML, NO en markdown` }]
      });
    } else if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          });
        }
      });
    }

    // Convertir contents (Gemini format) a messages (formato interno)
    const messages = contents.map(c => ({
      role: c.role === 'model' ? 'assistant' : 'user',
      content: c.parts[0].text
    }));

    console.log('🚀 Llamando al proveedor IA con', messages.length, 'mensajes');
    const result = await chat({ systemPrompt, messages, temperature: 0.7, maxTokens: 600 });
    const aiResponse = result.text || 'No se pudo generar una respuesta.';
    console.log(`✅ Respuesta recibida de ${result.provider}`);

    return res.json({
      response: aiResponse,
      serviceName,
    });
  } catch (error) {
    console.error('Error en /api/ask-ai:', error);
    return res.status(500).json({
      error: error.message || 'Error interno del servidor',
    });
  }
});

export default router;
