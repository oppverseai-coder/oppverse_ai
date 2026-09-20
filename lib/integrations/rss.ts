export interface RSSFeedItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  content?: string;
  sourceDomain: string;
}

/**
 * Fast, zero-cost RSS/Atom parser for major opportunity hubs
 */
export async function fetchRSSFeed(feedUrl: string, domain: string): Promise<RSSFeedItem[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'OppverseAI-OpportunityBot/1.0 (+https://oppverse.ai)'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.warn(`RSS fetch failed for ${feedUrl}: HTTP ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const items: RSSFeedItem[] = [];

    // Extract item blocks using regex
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 25) {
      const itemBlock = match[1];

      const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(itemBlock);
      const linkMatch = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(itemBlock);
      const pubDateMatch = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i.exec(itemBlock);
      const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i.exec(itemBlock);

      if (titleMatch && linkMatch) {
        const title = titleMatch[1].replace(/&amp;/g, '&').replace(/&#8211;/g, '-').trim();
        const link = linkMatch[1].trim();
        const description = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').trim() : '';

        items.push({
          title,
          link,
          pubDate: pubDateMatch ? pubDateMatch[1].trim() : undefined,
          description,
          sourceDomain: domain
        });
      }
    }

    return items;
  } catch (error: any) {
    console.error(`Error parsing RSS feed from ${feedUrl}:`, error.message);
    return [];
  }
}
