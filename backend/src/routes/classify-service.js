import express from 'express';

const router = express.Router();

// Mapeo de servicios
const SERVICES = {
  0: 'Desarrollo Web/API',
  1: 'Desarrollo Móvil',
  2: 'Integración de IA',
  3: 'Revisión de Arquitectura',
  4: 'Consultoría General'
};

/**
 * Clasificación simplificada basada en reglas (sin TensorFlow)
 * TODO: Implementar modelo TensorFlow.js con @tensorflow/tfjs-node cuando sea necesario
 */
function classifyByRules(data) {
  // Lógica de clasificación por reglas simples
  const { project_type, features = [], budget, timeline, has_team } = data;

  // Regla 1: Si es mobile_app → Desarrollo Móvil
  if (project_type === 'mobile_app' || features.includes('mobile')) {
    return {
      service: SERVICES[1],
      confidence: 0.9,
      recommendations: [
        'React Native para desarrollo cross-platform',
        'Integración con APIs backend mediante REST',
        'Sistema de autenticación robusto (Firebase Auth, Auth0)',
        'Publicación en App Store y Google Play'
      ],
      estimatedDuration: budget === 'less_5k' ? '8-12 semanas' : '12-20 semanas',
      suggestedApproach: 'MVP inicial enfocado en features core, iteraciones basadas en feedback de usuarios'
    };
  }

  // Regla 2: Si es ai_integration o tiene feature ai_ml → Integración de IA
  if (project_type === 'ai_integration' || features.includes('ai_ml')) {
    return {
      service: SERVICES[2],
      confidence: 0.95,
      recommendations: [
        'Implementación de LLMs (GPT-4, Claude) según caso de uso',
        'Sistema RAG para conocimiento específico del dominio',
        'Arquitectura serverless para escalabilidad de costos',
        'Fine-tuning de modelos si es necesario',
        'Monitoreo de costos y performance de APIs de IA'
      ],
      estimatedDuration: '6-12 semanas',
      suggestedApproach: 'Proof of concept inicial, validación de viabilidad, implementación incremental'
    };
  }

  // Regla 3: Si es architecture_review o tiene equipo y stage avanzado → Revisión de Arquitectura
  if (project_type === 'architecture_review' || (has_team === 'yes' && (data.project_stage === 'production' || data.project_stage === 'scaling'))) {
    return {
      service: SERVICES[3],
      confidence: 0.85,
      recommendations: [
        'Auditoría completa del código y arquitectura actual',
        'Identificación de cuellos de botella y code smells',
        'Plan de refactorización priorizado',
        'Mejoras en seguridad y escalabilidad',
        'Documentación técnica y diagrams de arquitectura'
      ],
      estimatedDuration: '2-4 semanas',
      suggestedApproach: 'Análisis exhaustivo, reporte detallado con plan de acción priorizado'
    };
  }

  // Regla 4: Si es web_app o api_backend → Desarrollo Web/API
  if (project_type === 'web_app' || project_type === 'api_backend') {
    return {
      service: SERVICES[0],
      confidence: 0.9,
      recommendations: [
        'Arquitectura basada en microservicios o monolito modular',
        'API RESTful según complejidad',
        'Base de datos relacional (PostgreSQL) o NoSQL (MongoDB)',
        'Deploy en servicios cloud (AWS, Google Cloud, o Azure)',
        'CI/CD con GitHub Actions'
      ],
      estimatedDuration: timeline === 'urgent' ? '4-8 semanas' : '8-16 semanas',
      suggestedApproach: 'Desarrollo incremental con entregas semanales y feedback continuo'
    };
  }

  // Default: Consultoría General
  return {
    service: SERVICES[4],
    confidence: 0.7,
    recommendations: [
      'Sesiones de mentoría técnica personalizadas',
      'Definición de stack tecnológico óptimo',
      'Roadmap de desarrollo con hitos claros',
      'Best practices y patrones de diseño',
      'Estrategia de testing y deployment'
    ],
    estimatedDuration: '1-4 semanas',
    suggestedApproach: 'Sesiones iterativas de asesoría, documentación de decisiones técnicas'
  };
}

// POST /api/classify-service - Clasificar tipo de servicio
router.post('/', async (req, res) => {
  console.log('🤖 POST /api/classify-service - Clasificación de servicio');

  try {
    const data = req.body;

    // Validaciones básicas
    if (!data.project_type || !data.project_stage) {
      console.error('❌ Faltan campos requeridos');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: project_type and project_stage'
      });
    }

    console.log('📊 Datos recibidos:', {
      project_type: data.project_type,
      stage: data.project_stage,
      budget: data.budget,
      features: data.features?.length || 0
    });

    // Clasificar usando reglas simples
    const classification = classifyByRules(data);

    // Agregar recomendaciones según presupuesto
    if (data.budget === 'less_5k') {
      classification.recommendations.push('💡 Enfoque en MVP con features esenciales para optimizar presupuesto');
    } else if (data.budget === 'more_100k') {
      classification.recommendations.push('💡 Oportunidad para implementar arquitectura enterprise-grade y escalable');
    }

    // Agregar recomendaciones según urgencia
    if (data.timeline === 'urgent') {
      classification.recommendations.push('⚡ Priorización estricta de features críticas para cumplir timeline');
    }

    console.log('✅ Clasificación completada:', classification.service);

    return res.status(200).json({
      success: true,
      classification: classification
    });

  } catch (error) {
    console.error('❌ Error al clasificar servicio:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to classify service',
      details: error.message
    });
  }
});

export default router;
