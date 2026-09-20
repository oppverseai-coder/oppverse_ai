export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const cleanParams = new URLSearchParams();
    parsed.searchParams.forEach((val, key) => {
      if (!key.startsWith('utm_') && !['ref', 'source', 'fbclid', 'gclid'].includes(key.toLowerCase())) {
        cleanParams.append(key, val);
      }
    });

    let pathname = parsed.pathname.replace(/\/+$/, '');
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const query = cleanParams.toString() ? `?${cleanParams.toString()}` : '';

    return `${parsed.protocol}//${host}${pathname}${query}`;
  } catch (e) {
    return url.trim().toLowerCase();
  }
}

export function generateOpportunityFingerprint(title: string, provider: string, deadline?: string): string {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanProvider = provider.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanDeadline = deadline ? deadline.split('T')[0] : 'nodate';

  return `${cleanTitle.slice(0, 30)}_${cleanProvider.slice(0, 20)}_${cleanDeadline}`;
}
