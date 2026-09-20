export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  jsonMode?: boolean;
}

/**
 * High-speed Groq LLM Client
 */
export async function callGroq(
  messages: GroqChatMessage[],
  options?: GroqCompletionOptions
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.log('[Groq LLM] GROQ_API_KEY not configured.');
    return '';
  }

  const model = options?.model || 'openai/gpt-oss-120b';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.max_tokens || 2048,
        response_format: options?.jsonMode ? { type: 'json_object' } : undefined
      })
    });

    if (!res.ok) {
      // Fallback model if primary model errors
      const fallbackRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          messages,
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.max_tokens || 2048
        })
      });

      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return fallbackData.choices?.[0]?.message?.content || '';
      }
      return '';
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error: any) {
    console.error(`[Groq Error] ${error.message}`);
    return '';
  }
}
