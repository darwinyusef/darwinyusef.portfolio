/**
 * Selector de proveedor IA
 * AI_PROVIDER=gemini|openai  (default: gemini)
 * Gemini es primario. Si falla, cae automáticamente a OpenAI como fallback.
 */

import { chat as geminiChat } from './ai-gemini.js';
import { chat as openaiChat } from './ai-openai.js';

const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

export async function chat(params) {
  if (provider === 'openai') {
    return openaiChat(params);
  }

  // Gemini primero, fallback a OpenAI
  try {
    const result = await geminiChat(params);
    return result;
  } catch (err) {
    console.warn(`⚠️ Gemini falló (${err.message}), usando OpenAI como fallback...`);
    if (!process.env.OPENAI_API_KEY) throw err;
    return openaiChat(params);
  }
}
