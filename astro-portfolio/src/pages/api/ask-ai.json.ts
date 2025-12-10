import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const prerender = false;

interface Message {
  role: string;
  content: string;
}

export const POST: APIRoute = async ({ request }) => {
  console.log('🔵 API /ask-ai llamada');
  try {
    // Leer el body como texto primero para debugging
    const bodyText = await request.text();
    console.log('📝 Body raw:', bodyText.substring(0, 200));

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('📦 Body recibido:', { serviceName: body.serviceName, hasHistory: !!body.conversationHistory });
    const { serviceName, serviceDescription, conversationHistory, isInitialMessage } = body;

    // Validar que se recibieron los datos necesarios
    if (!serviceName || !serviceDescription) {
      return new Response(
        JSON.stringify({
          error: 'Faltan datos requeridos: serviceName y serviceDescription',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Obtener la API key de OpenAI desde conf.json
    let apiKey: string | null = null;

    try {
      const confPath = join(process.cwd(), 'public', 'conf.json');
      console.log('📁 Leyendo configuración desde:', confPath);
      const confData = JSON.parse(readFileSync(confPath, 'utf-8'));
      apiKey = confData.openai;
      console.log('✅ Token de OpenAI obtenido:', apiKey ? `${apiKey.substring(0, 20)}...` : 'null');
    } catch (error) {
      console.error('❌ Error al leer conf.json:', error);
      // Si no se encuentra en conf.json, intentar con variables de entorno
      apiKey = import.meta.env.OPENAI_API_KEY;
      console.log('🔄 Intentando con variable de entorno:', apiKey ? 'encontrada' : 'no encontrada');
    }

    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY no está configurada');
      return new Response(
        JSON.stringify({
          error: 'La API de IA no está configurada. Por favor, contacta al administrador.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Cargar el contexto de lenguajes/tecnologías en formato CSV compacto
    let techStack = '';
    try {
      const languagesPath = join(process.cwd(), 'public', 'languages.json');
      const languagesData = JSON.parse(readFileSync(languagesPath, 'utf-8'));

      // Convertir a CSV compacto: Nombre,Años,Proficiencia%
      const csvLines = languagesData
        .filter((tech: any) => tech.is_active)
        .map((tech: any) => `${tech.name},${tech.yearsOfExperience}y,${tech.proficiency}%`);

      techStack = csvLines.join('; ');

      console.log('📚 Stack tecnológico cargado:', languagesData.length, 'tecnologías en formato CSV');
    } catch (error) {
      console.error('⚠️ No se pudo cargar languages.json:', error);
    }

    // Preparar mensajes para OpenAI
    const messages: Message[] = [];

    // Sistema: definir el rol y contexto
    messages.push({
      role: 'system',
      content: `Eres un asistente técnico experto en tecnología y desarrollo de software representando a Yusef González. Tu ÚNICO rol es educar y aclarar dudas técnicas sobre el siguiente servicio:

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
- Enfócate en aspectos técnicos, NO comerciales`
    });

    // Si es el mensaje inicial, agregar prompt de introducción
    if (isInitialMessage) {
      messages.push({
        role: 'user',
        content: `Dame una introducción técnica completa sobre este servicio. Estructura tu respuesta así:

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
- TODO debe estar en HTML, NO en markdown`
      });
    } else {
      // Agregar el historial de conversación
      if (conversationHistory && Array.isArray(conversationHistory)) {
        conversationHistory.forEach((msg: Message) => {
          if (msg.role === 'user' || msg.role === 'assistant') {
            messages.push({
              role: msg.role,
              content: msg.content
            });
          }
        });
      }
    }

    // Llamar a la API de OpenAI
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
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('❌ Error de OpenAI:', errorData);
      throw new Error('Error al obtener respuesta de OpenAI');
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No se pudo generar una respuesta.';
    console.log('✅ Respuesta de OpenAI recibida:', aiResponse.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({
        response: aiResponse,
        serviceName,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error en /api/ask-ai:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
