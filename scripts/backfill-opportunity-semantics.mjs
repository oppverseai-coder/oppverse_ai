import { readFile } from 'node:fs/promises';

const envText = await readFile(new URL('../.env.local', import.meta.url), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((line) => line && !line.startsWith('#') && line.includes('=')).map((line) => {
  const index = line.indexOf('=');
  return [line.slice(0, index), line.slice(index + 1)];
}));
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Supabase server credentials are required.');

const size = 1536;
const aliases = {
  'go-to-market': 'gtm', 'go to market': 'gtm', 'product management': 'product',
  'product manager': 'product', 'product marketing': 'product-marketing',
  'software development': 'software-engineering', 'software engineer': 'software-engineering',
  'machine learning': 'ai', 'artificial intelligence': 'ai', 'startup founder': 'entrepreneurship',
  'public speaking': 'speaking',
};
function hash(value, seed) {
  let result = seed;
  for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return result >>> 0;
}
function vectorize(text) {
  const vector = new Array(size).fill(0);
  let normalized = text.toLowerCase();
  for (const [phrase, replacement] of Object.entries(aliases)) normalized = normalized.replaceAll(phrase, replacement);
  const tokens = normalized.replace(/[^a-z0-9+#.-]+/g, ' ').split(/\s+/).filter((token) => token.length > 2);
  const features = [...tokens, ...tokens.slice(0, -1).map((token, index) => `${token}_${tokens[index + 1]}`)];
  for (const feature of features) {
    vector[hash(feature, 2166136261) % size] += 1;
    vector[hash(feature, 2654435761) % size] += 0.5;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return magnitude ? vector.map((value) => Number((value / magnitude).toFixed(8))) : vector;
}

const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const response = await fetch(`${url}/rest/v1/opportunities?select=*`, { headers });
if (!response.ok) throw new Error(`Opportunity fetch failed: ${response.status}`);
const opportunities = await response.json();
for (const opportunity of opportunities) {
  const semanticText = [
    `Title: ${opportunity.title}`,
    `Organization: ${opportunity.provider}`,
    `Type: ${opportunity.category}; ${opportunity.subcategory || ''}`,
    `Summary: ${opportunity.summary || ''}`,
    `Description: ${opportunity.description || ''}`,
    `Experience: ${opportunity.experience_required || 'not specified'}`,
    `Education: ${opportunity.education_required || 'not specified'}`,
    `Location: ${opportunity.location_type || ''}; ${opportunity.host_country || 'global'}`,
    `Funding: ${opportunity.funding_status || ''}; ${opportunity.funding_amount || ''}`,
  ].join('\n');
  const update = await fetch(`${url}/rest/v1/opportunities?id=eq.${opportunity.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ semantic_text: semanticText, embedding: vectorize(semanticText), embedding_updated_at: new Date().toISOString() }),
  });
  if (!update.ok) throw new Error(`Backfill failed for ${opportunity.id}: ${update.status}`);
}
console.log(`Backfilled semantic vectors for ${opportunities.length} opportunities.`);
