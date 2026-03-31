/**
 * Adaptador OpenAI (gpt-4o-mini)
 * Activa con: AI_PROVIDER=openai en .env
 */

export async function chat({ systemPrompt, messages, temperature = 0.7, maxTokens = 800 }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY no configurada');

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature,
    max_tokens: maxTokens
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw Object.assign(new Error(err?.error?.message || 'OpenAI error'), {
      status: response.status,
      code: err?.error?.code
    });
  }

  const data = await response.json();
  return {
    text: data.choices?.[0]?.message?.content || '',
    totalTokens: data.usage?.total_tokens || 0,
    provider: 'openai'
  };
}
