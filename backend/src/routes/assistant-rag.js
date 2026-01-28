import express from 'express';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { buildRAGContext, searchKnowledge } from '../data/knowledge-base.js';

const router = express.Router();

// Función para obtener instancia de OpenAI (lazy initialization)
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * Cargar contexto dinámico desde GitHub
 */
async function loadDynamicContext() {
  const context = {};
  const githubBaseUrl = 'https://raw.githubusercontent.com/darwinyusef/darwinyusef/refs/heads/master/information';

  try {
    // Cargar languages.json (skills)
    try {
      const skillsResponse = await fetch(`${githubBaseUrl}/languages.json`);
      if (skillsResponse.ok) {
        context.skills = await skillsResponse.json();
        console.log('✅ Skills cargadas:', context.skills?.length);
      }
    } catch (e) {
      try {
        const localPath = join(process.cwd(), 'data', 'languages.json');
        context.skills = JSON.parse(readFileSync(localPath, 'utf-8'));
        console.log('✅ Skills cargadas desde local');
      } catch (localError) {
        console.warn('⚠️ No se pudieron cargar skills');
      }
    }

    // Cargar services.json
    try {
      const servicesResponse = await fetch(`${githubBaseUrl}/services.json`);
      if (servicesResponse.ok) {
        context.services = await servicesResponse.json();
        console.log('✅ Servicios cargados:', context.services?.length);
      }
    } catch (e) {
      console.warn('⚠️ No se pudieron cargar servicios');
    }

    // Cargar events.json
    try {
      const eventsResponse = await fetch(`${githubBaseUrl}/events.json`);
      if (eventsResponse.ok) {
        context.events = await eventsResponse.json();
        console.log('✅ Eventos cargados:', context.events?.length);
      }
    } catch (e) {
      console.warn('⚠️ No se pudieron cargar eventos');
    }

    // Cargar architecture.json
    try {
      const archResponse = await fetch(`${githubBaseUrl}/architecture.json`);
      if (archResponse.ok) {
        context.architecture = await archResponse.json();
        console.log('✅ Arquitectura cargada');
      }
    } catch (e) {
      console.warn('⚠️ No se pudo cargar arquitectura');
    }

  } catch (error) {
    console.error('❌ Error cargando contexto dinámico:', error);
  }

  return context;
}

/**
 * Construir prompt con datos dinámicos de GitHub
 */
function buildDynamicPrompt(context) {
  let prompt = '';

  if (context.skills && context.skills.length > 0) {
    const activeSkills = context.skills
      .filter((s) => s.is_active)
      .slice(0, 15) // Top 15 skills
      .map((s) => `${s.name} (${s.yearsOfExperience} años, ${s.proficiency}%)`)
      .join(', ');
    prompt += `\n**TECNOLOGÍAS Y EXPERTISE:**\n${activeSkills}\n`;
  }

  if (context.services && context.services.length > 0) {
    const activeServices = context.services
      .filter((s) => s.is_active)
      // TODOS los servicios activos, no solo 10
      .map((s) => `- ${s.name}: ${s.description}`)
      .join('\n');
    prompt += `\n**SERVICIOS PROFESIONALES QUE OFRECEMOS (LISTA COMPLETA Y OFICIAL):**\n${activeServices}\n`;
  }

  if (context.events && context.events.length > 0) {
    const upcomingEvents = context.events
      .filter((e) => e.is_active)
      .slice(0, 3)
      .map((e) => `- ${e.title} (${e.city}, ${e.date})`)
      .join('\n');
    prompt += `\n**EVENTOS PRÓXIMOS:**\n${upcomingEvents}\n`;
  }

  if (context.architecture) {
    prompt += `\n**ESPECIALIZACIÓN EN ARQUITECTURA:**\n${context.architecture.description || 'Arquitectura Empresarial y Soluciones Cloud'}\n`;
  }

  return prompt;
}

/**
 * POST /api/assistant-rag
 *
 * Asistente de IA con RAG (Retrieval-Augmented Generation)
 * Busca información relevante en la knowledge base antes de responder
 */
router.post('/', async (req, res) => {
  console.log('🤖 POST /api/assistant-rag - Nueva consulta');

  try {
    const { question, conversationHistory = [], context = 'global', route = '' } = req.body;

    // Validaciones
    if (!question || typeof question !== 'string') {
      console.error('❌ Pregunta inválida o faltante');
      return res.status(400).json({
        success: false,
        error: 'Question is required and must be a string'
      });
    }

    // Obtener instancia de OpenAI
    const openai = getOpenAI();
    if (!openai) {
      console.error('❌ OpenAI no está configurado');
      console.error('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Existe' : 'No existe');
      return res.status(503).json({
        success: false,
        error: 'OpenAI service not configured'
      });
    }

    console.log('📝 Pregunta:', question);
    console.log('🔍 Contexto:', context);
    console.log('🛣️ Ruta:', route || 'general');
    console.log('📚 Historial:', conversationHistory.length, 'mensajes');

    // 1. Cargar contexto dinámico desde GitHub
    const dynamicContext = await loadDynamicContext();
    console.log('✅ Contexto dinámico cargado');

    // 2. Buscar conocimiento relevante en la knowledge base estática
    const relevantKnowledge = searchKnowledge(question, context, 3);
    console.log('✅ Conocimiento estático encontrado:', relevantKnowledge.length, 'items');

    // 3. Construir contexto RAG combinado (dinámico + estático)
    const dynamicPrompt = buildDynamicPrompt(dynamicContext);
    const staticRAGContext = buildRAGContext(question, context);

    // 4. Determinar el tipo de asistente según la ruta
    const isServicesPage = route.includes('/aquicreamos') || route.includes('/servicios');

    // 5. Construir el system prompt según la página
    let systemPrompt = '';

    if (isServicesPage) {
      // Asistente enfocado en SERVICIOS Y TECNOLOGÍAS
      systemPrompt = `Eres un asistente técnico especializado de Aquí Creamos.

**CONTEXTO ESPECIAL:** El usuario está explorando nuestra página de servicios y automatizaciones.

**REGLA DE ORO - CRÍTICO:**
🚫 NUNCA inventes servicios que no estén en la lista de SERVICIOS PROFESIONALES
🚫 NUNCA digas "no ofrecemos" sin ANTES verificar la lista completa de servicios abajo
🚫 NUNCA des información genérica del mercado o comparaciones con otras empresas
🚫 NUNCA des cifras, fechas o plazos no explícitos
✅ PRIMERO busca en SERVICIOS PROFESIONALES QUE OFRECEMOS antes de responder
✅ Si un servicio está en la lista, confírmalo con seguridad
✅ Si NO está en la lista Y no tienes info, di: "No tengo información específica sobre ese servicio. Te invito a la primera sesión gratuita para discutirlo."

**PROCESO PARA RESPONDER:**
1. ¿El usuario pregunta por un servicio? → BUSCA en la lista de SERVICIOS PROFESIONALES abajo
2. ¿Está en la lista? → Responde SÍ, describe el servicio
3. ¿No está en la lista? → "No tengo información específica sobre ese servicio..."

**IMPORTANTE SOBRE SERVICIOS:**
- La lista de SERVICIOS PROFESIONALES abajo es COMPLETA y OFICIAL
- Si un servicio aparece ahí, LO OFRECEMOS
- Ejemplos de lo que SÍ ofrecemos: busca en la lista abajo

**TU MISIÓN:**
- Explicar nuestros servicios REALES usando la lista oficial abajo
- Conectar necesidades con servicios específicos de la lista
- Ser técnico pero accesible

**DATOS OFICIALES:**
${dynamicPrompt}

**CONOCIMIENTO ADICIONAL:**
${staticRAGContext}`;
    } else {
      // Asistente general de la empresa
      systemPrompt = `Eres un asistente de Aquí Creamos, una empresa de tecnología en Antioquia, Colombia.

**REGLA DE ORO - CRÍTICO:**
🚫 NUNCA inventes información que no esté en la base de conocimiento proporcionada abajo
🚫 NUNCA hables de "empresas tecnológicas en general", comparaciones con otras empresas o tendencias del mercado
🚫 NUNCA des cifras, fechas, plazos o proyecciones que no estén explícitamente escritas en la información
🚫 NUNCA uses frases como "en general las empresas...", "suelen tomar X años...", "el mercado indica..."
✅ SOLO habla de Aquí Creamos basándote en la información exacta proporcionada abajo
✅ Si te preguntan algo que NO está en la información, responde honestamente: "No tengo esa información específica. Te invito a una primera sesión gratuita donde podemos conversar sobre ese tema en detalle."

**TU MISIÓN:**
- Responder sobre Aquí Creamos usando ÚNICAMENTE la información de la base de conocimiento
- Ser honesto cuando no tengas información
- Guiar hacia la primera sesión gratuita para profundizar

**USA ÚNICAMENTE LA INFORMACIÓN AQUÍ:**
${staticRAGContext}

**CAPACIDADES TÉCNICAS (solo para contexto general):**
${dynamicPrompt}

**IMPORTANTE:** Si la pregunta no puede responderse con la información proporcionada, NO INVENTES. Di que no tienes esa información y ofrece la primera sesión gratuita.`;
    }

    // 5. Construir el array de mensajes para OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: question
      }
    ];

    // 6. Llamar a OpenAI
    console.log('🚀 Enviando request a OpenAI...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.6,
      max_tokens: 800,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const answer = completion.choices[0].message.content;
    console.log('✅ Respuesta recibida de OpenAI');

    // 7. Construir respuesta con metadatos
    const response = {
      success: true,
      answer: answer,
      metadata: {
        knowledgeItemsUsed: relevantKnowledge.length,
        knowledgeTopics: relevantKnowledge.map(item => item.topic),
        dynamicDataLoaded: {
          skills: dynamicContext.skills?.length || 0,
          services: dynamicContext.services?.length || 0,
          events: dynamicContext.events?.length || 0
        },
        model: 'gpt-4o-mini',
        tokensUsed: completion.usage?.total_tokens || 0,
        context: context,
        route: route,
        assistantType: isServicesPage ? 'technical-services' : 'general-company'
      }
    };

    console.log('📤 Respuesta enviada al cliente');
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error en assistant-rag:', error);

    // Errores específicos de OpenAI
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        error: 'OpenAI quota exceeded. Please try again later.'
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again in a moment.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error processing your question',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/assistant-rag/knowledge
 *
 * Endpoint para explorar la knowledge base (útil para debugging)
 */
router.get('/knowledge', async (req, res) => {
  const { query, context = 'global', limit = 10 } = req.query;

  try {
    if (query) {
      const results = searchKnowledge(query, context, parseInt(limit));
      return res.json({
        success: true,
        query,
        context,
        results: results.map(item => ({
          id: item.id,
          category: item.category,
          topic: item.topic,
          tags: item.tags
        }))
      });
    } else {
      // Retornar estadísticas de la knowledge base
      const { knowledgeBase } = await import('../data/knowledge-base.js');

      const categories = [...new Set(knowledgeBase.map(item => item.category))];
      const contexts = [...new Set(knowledgeBase.flatMap(item => item.contexts))];

      return res.json({
        success: true,
        stats: {
          totalItems: knowledgeBase.length,
          categories: categories,
          contexts: contexts,
          itemsByCategory: categories.map(cat => ({
            category: cat,
            count: knowledgeBase.filter(item => item.category === cat).length
          }))
        }
      });
    }
  } catch (error) {
    console.error('❌ Error al consultar knowledge base:', error);
    return res.status(500).json({
      success: false,
      error: 'Error querying knowledge base'
    });
  }
});

export default router;
