export interface FirecrawlScrapeResult {
  markdown: string;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
  url: string;
}

/**
 * Firecrawl Web-Content Extraction Client
 */
export async function scrapeWithFirecrawl(url: string): Promise<FirecrawlScrapeResult | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    console.log(`[Firecrawl Extractor] API key not configured yet. Target URL: ${url}`);
    return null;
  }

  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true
      })
    });

    if (!res.ok) {
      console.warn(`Firecrawl API responded with status ${res.status} for ${url}`);
      return null;
    }

    const data = await res.json();
    if (data.success && data.data) {
      return {
        markdown: data.data.markdown || '',
        title: data.data.metadata?.title || '',
        description: data.data.metadata?.description || '',
        metadata: data.data.metadata || {},
        url
      };
    }
    return null;
  } catch (error: any) {
    console.error(`[Firecrawl Error] ${error.message} on ${url}`);
    return null;
  }
}
