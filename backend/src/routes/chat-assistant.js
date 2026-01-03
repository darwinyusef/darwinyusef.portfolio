import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

const router = express.Router();

async function loadContext() {
  const context = {};
  const githubBaseUrl = 'https://raw.githubusercontent.com/darwinyusef/darwinyusef/refs/heads/master/information';

  try {
    try {
      const skillsResponse = await fetch(`${githubBaseUrl}/languages.json`);
      if (skillsResponse.ok) {
        context.skills = await skillsResponse.json();
        console.log('✅ Skills cargadas desde GitHub:', context.skills?.length);
      }
    } catch (e) {
      try {
        const localPath = join(process.cwd(), 'data', 'languages.json');
        context.skills = JSON.parse(readFileSync(localPath, 'utf-8'));
        console.log('✅ Skills cargadas desde local:', context.skills?.length);
      } catch (localError) {
        console.warn('⚠️ No se pudieron cargar skills');
      }
    }

    try {
      const servicesResponse = await fetch(`${githubBaseUrl}/services.json`);
      if (servicesResponse.ok) {
        context.services = await servicesResponse.json();
        console.log('✅ Servicios cargados desde GitHub:', context.services?.length);
      }
    } catch (e) {
      console.warn('⚠️ No se pudieron cargar servicios desde GitHub');
    }

    try {
      const eventsResponse = await fetch(`${githubBaseUrl}/events.json`);
      if (eventsResponse.ok) {
        context.events = await eventsResponse.json();
        console.log('✅ Eventos cargados desde GitHub:', context.events?.length);
      }
    } catch (e) {
      try {
        const localPath = join(process.cwd(), 'data', 'events.json');
        context.events = JSON.parse(readFileSync(localPath, 'utf-8'));
        console.log('✅ Eventos cargados desde local:', context.events?.length);
      } catch (localError) {
        console.warn('⚠️ No se pudieron cargar eventos');
      }
    }

    try {
      const archResponse = await fetch(`${githubBaseUrl}/architecture.json`);
      if (archResponse.ok) {
        context.architecture = await archResponse.json();
        console.log('✅ Arquitectura cargada desde GitHub');
      }
    } catch (e) {
      console.warn('⚠️ No se pudo cargar arquitectura desde GitHub');
    }

  } catch (error) {
    console.error('❌ Error general al cargar contexto:', error);
  }

  return context;
}

function buildContextPrompt(context) {
  let prompt = '';

  if (context.skills && context.skills.length > 0) {
    const activeSkills = context.skills
      .filter((s) => s.is_active)
      .map((s) => `${s.name} (${s.yearsOfExperience}años, ${s.proficiency}%)`)
      .join(', ');
    prompt += `\n**TECNOLOGÍAS Y SKILLS:**\n${activeSkills}\n`;
  }

  if (context.services && context.services.length > 0) {
    const activeServices = context.services
      .filter((s) => s.is_active)
      .map((s) => `- ${s.name}: ${s.description}`)
      .join('\n');
    prompt += `\n**SERVICIOS OFRECIDOS:**\n${activeServices}\n`;
  }

  if (context.events && context.events.length > 0) {
    const upcomingEvents = context.events
      .filter((e) => e.is_active)
      .slice(0, 5)
      .map((e) => `- ${e.title} (${e.city}, ${e.date})`)
      .join('\n');
    prompt += `\n**PRÓXIMOS EVENTOS:**\n${upcomingEvents}\n`;
  }

  if (context.architecture) {
    prompt += `\n**ESPECIALIZACIÓN EN ARQUITECTURA:**\n${context.architecture.description || 'Arquitectura Empresarial y Soluciones Cloud'}\n`;
  }

  prompt += `\n**UN POCO DE MI VIDA (Hobbies y Pasiones):**
- 🍽️ Cocina & Coctelería: Explorar sabores del mundo y preparar platos gourmet
- 🚴‍♂️ Ciclismo: Rutas sobre dos ruedas, descubrir lugares especiales
- 🎸 Música: Tocar guitarra y bajo como válvula de escape creativa
- 🎮 Gaming & Anime: League of Legends y series como One Piece
- 📖 Fe y propósito: Cristiandad y lectura de las escrituras
- 🐕 Aventuras con mi perro: Paseos y caminatas para mantener equilibrio\n`;

  return prompt;
}

router.post('/', async (req, res) => {
  console.log('🔵 API /chat-assistant llamada');

  try {
    const { question, conversationHistory } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'La pregunta es requerida' });
    }

    let apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      try {
        const confPath = join(process.cwd(), 'data', 'conf.json');
        const confData = JSON.parse(readFileSync(confPath, 'utf-8'));
        apiKey = confData.openai;
        console.log('✅ Token de OpenAI obtenido');
      } catch (error) {
        console.error('❌ No se pudo leer conf.json');
      }
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'La API de OpenAI no está configurada' });
    }

    console.log('📚 Cargando contexto...');
    const context = await loadContext();
    const contextPrompt = buildContextPrompt(context);

    const messages = [];

    messages.push({
      role: 'system',
      content: `Eres un asistente virtual inteligente de Yusef González, arquitecto de software y desarrollador fullstack con más de 17 años de experiencia.

Tu personalidad es:
- Amigable, cercano y profesional
- Apasionado por la tecnología y el desarrollo de software
- Educado y respetuoso
- Enfocado en ayudar genuinamente

CONTEXTO ACTUALIZADO SOBRE YUSEF:
${contextPrompt}

**CAPACIDADES:**
1. Responder preguntas sobre tecnologías, skills y experiencia de Yusef
2. Explicar los servicios que ofrece (solo aspectos técnicos)
3. Informar sobre eventos y conferencias
4. Compartir información sobre arquitectura empresarial y soluciones
5. Hablar sobre sus hobbies y vida personal cuando se pregunte
6. Orientar sobre consultas técnicas y de arquitectura

**RESTRICCIONES IMPORTANTES:**
🚫 NO puedes:
- Dar precios, costos o presupuestos
- Hacer ofertas comerciales o negociar
- Actuar como vendedor
- Comprometer agenda o disponibilidad de Yusef
- Hacer promesas sobre proyectos o entregas

✅ SI puedes:
- Explicar aspectos técnicos de los servicios
- Sugerir contactar a través del formulario para consultas comerciales
- Compartir información sobre tecnologías y experiencia
- Hablar sobre eventos, arquitectura y expertise técnico
- Ser conversacional y amigable sobre hobbies e intereses personales

**FORMATO DE RESPUESTA:**
- Usa HTML para formato (NO markdown)
- <p> para párrafos
- <strong> para destacar conceptos
- <ul><li> para listas
- <a href="/ruta"> para enlaces internos
- Emojis cuando sea apropiado 😊
- Respuestas de 80-200 palabras (concisas pero completas)

Si te preguntan sobre precios o aspectos comerciales:
"Para información sobre presupuestos y servicios personalizados, te invito a contactar directamente a través del <a href='/#contact'>formulario de contacto</a> o visitar la sección de <a href='/arquitectura'>arquitectura</a>. Con gusto puedo ayudarte con cualquier duda técnica."

Mantén un tono profesional pero cercano, como si fueras el asistente personal de Yusef que conoce todo sobre su trabajo y vida profesional.`
    });

    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });
    }

    messages.push({
      role: 'user',
      content: question
    });

    console.log('🚀 Llamando a OpenAI con', messages.length, 'mensajes');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('❌ Error de OpenAI:', errorData);
      throw new Error('Error al obtener respuesta de OpenAI');
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No pude generar una respuesta.';
    console.log('✅ Respuesta generada');

    return res.json({
      response: aiResponse,
      success: true
    });
  } catch (error) {
    console.error('❌ Error en /api/chat-assistant:', error);
    return res.status(500).json({
      error: error.message || 'Error interno del servidor',
      success: false
    });
  }
});

export default router;
