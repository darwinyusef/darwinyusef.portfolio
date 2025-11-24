const BACKEND_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.PUBLIC_API_VERSION || 'v1';

export const API_BASE = `${BACKEND_URL}/api/${API_VERSION}`;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      return { error: `HTTP error! status: ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getSkills() {
  return fetchAPI('/skills');
}

export async function getServices() {
  return fetchAPI('/services');
}

export async function getPosts() {
  return fetchAPI('/post');
}

export async function getPodcasts() {
  return fetchAPI('/multimedia?type=podcast');
}

export async function sendChatMessage(data: {
  question: string;
  session_id: string;
  course?: string;
  topic?: string | null;
  level?: string;
}) {
  return fetchAPI('/chatbot/ask', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function subscribeNewsletter(email: string) {
  return fetchAPI('/comunications', {
    method: 'POST',
    body: JSON.stringify({
      email,
      type: 'newsletter',
      preferences: { subscribed: true },
    }),
  });
}
