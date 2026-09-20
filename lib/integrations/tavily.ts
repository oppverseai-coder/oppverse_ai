export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  published_date?: string;
}

export interface TavilySearchResponse {
  query: string;
  results: TavilySearchResult[];
}

/**
 * Tavily Agentic Search & Discovery Client
 */
export async function searchTavily(
  query: string,
  options?: {
    searchDepth?: 'basic' | 'advanced';
    includeDomains?: string[];
    excludeDomains?: string[];
    maxResults?: number;
  }
): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.log(`[Tavily Discovery] API key not configured yet. Query planned: "${query}"`);
    return [];
  }

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: options?.searchDepth || 'advanced',
        include_domains: options?.includeDomains || [],
        exclude_domains: options?.excludeDomains || [],
        max_results: options?.maxResults || 10
      })
    });

    if (!res.ok) {
      console.warn(`Tavily API responded with status ${res.status}`);
      return [];
    }

    const data: TavilySearchResponse = await res.json();
    return data.results || [];
  } catch (error: any) {
    console.error(`[Tavily Error] ${error.message}`);
    return [];
  }
}
