/**
 * Adaptador Gemini 2.0 Flash-Lite
 * Activa con: AI_PROVIDER=gemini en .env
 */

export async function chat({ systemPrompt, messages, temperature = 0.7, maxTokens = 800 }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada');

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { temperature, maxOutputTokens: maxTokens }
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw Object.assign(new Error(err?.error?.message || 'Gemini error'), {
      status: response.status,
      code: err?.error?.status
    });
  }

  const data = await response.json();
  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    totalTokens: data.usageMetadata?.totalTokenCount || 0,
    provider: 'gemini'
  };
}
