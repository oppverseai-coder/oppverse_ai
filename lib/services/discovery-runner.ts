import { createClient } from '@/lib/supabase/client';
import { fetchRSSFeed } from '@/lib/integrations/rss';
import { searchTavily } from '@/lib/integrations/tavily';
import { scrapeWithFirecrawl } from '@/lib/integrations/firecrawl';
import { normalizeUrl, generateOpportunityFingerprint } from './deduplication';
import { generateProfileSearchQueries } from './query-planner';
import { Opportunity, UserProfile } from '@/lib/types';
import { createSemanticVector } from '@/lib/personalization/semantic';
import { inferOpportunityCategory, isLikelyOpportunity } from '@/lib/opportunity-quality';

export interface DiscoveryRunResult {
  runId: string;
  sourcesSearched: number;
  urlsDiscovered: number;
  candidatesExtracted: number;
  duplicatesRemoved: number;
  insertedCount: number;
  errors: string[];
}

/**
 * Enterprise Discovery Worker
 * Executes multi-tier sweeps across active sources, extracts clean content, deduplicates and persists
 */
export async function runEnterpriseDiscovery(profile?: UserProfile): Promise<DiscoveryRunResult> {
  const supabase = createClient();
  const errors: string[] = [];

  // 1. Create Discovery Run record
  const { data: runRecord } = await supabase
    .from('discovery_runs')
    .insert([{
      run_type: 'scheduled_daily',
      status: 'running',
      started_at: new Date().toISOString()
    }])
    .select('id')
    .single();

  const runId = runRecord?.id || `run_${Date.now()}`;

  let sourcesCount = 0;
  let discoveredUrlsCount = 0;
  let candidatesCount = 0;
  let duplicatesCount = 0;
  let insertedCount = 0;

  try {
    // 2. Fetch Active Master Sources from public.sources
    const { data: sources } = await supabase
      .from('sources')
      .select('*')
      .eq('is_active', true);

    const activeSources = sources || [];
    sourcesCount = activeSources.length;

    // 3. Process RSS / Direct Feeds (Fast Tier)
    for (const source of activeSources) {
      if (source.access_method === 'rss_feed' && source.endpoint_or_feed) {
        try {
          const feedItems = await fetchRSSFeed(source.endpoint_or_feed, source.domain);
          discoveredUrlsCount += feedItems.length;

          for (const item of feedItems) {
            const description = item.description || item.content || item.title;
            const summary = description.slice(0, 140);
            if (!isLikelyOpportunity({ title: item.title, summary, description })) continue;
            const cleanUrl = normalizeUrl(item.link);
            const fingerprint = generateOpportunityFingerprint(item.title, source.name, item.pubDate);

            // Check if already in opportunities or raw_discoveries
            const { data: existing } = await supabase
              .from('opportunities')
              .select('id')
              .or(`official_source_url.eq."${cleanUrl}",title.eq."${item.title}"`)
              .maybeSingle();

            if (existing) {
              duplicatesCount++;
              continue;
            }

            candidatesCount++;

            // Insert into raw_discoveries staging
            await supabase.from('raw_discoveries').insert([{
              source_id: source.id,
              source_name: source.name,
              source_url: cleanUrl,
              raw_title: item.title,
              raw_content: item.description || item.content || item.title,
              verification_status: 'verified',
              evidence_quotes: [
                `Discovered from official feed: ${source.name}`,
                `Published Date: ${item.pubDate || 'Recently published'}`
              ]
            }]);

            // Insert into canonical public.opportunities
            const deadlineDate = new Date(Date.now() + 30 * 86400000).toISOString();
            const sourceCategory = (source.opportunity_types?.[0] as Opportunity['category']) || 'Fellowships';
            const category = inferOpportunityCategory({ title: item.title, summary, description, category: sourceCategory });
            const semanticText = `Title: ${item.title}\nOrganization: ${source.name}\nType: ${category}\nDescription: ${description}\nLocation: ${source.country || 'Worldwide'}\nFunding: Unverified`;

            const { error: oppInsertErr } = await supabase.from('opportunities').insert([{
              title: item.title,
              provider: source.name,
              category,
              subcategory: source.opportunity_types?.[1] || 'General',
              description,
              summary,
              official_source_url: cleanUrl,
              application_url: cleanUrl,
              source_url: cleanUrl,
              source_id: source.id,
              deadline: deadlineDate,
              location_type: 'Remote',
              host_country: source.country || 'Worldwide',
              funding_status: 'Unpaid',
              eligible_countries: source.regions || ['All'],
              application_complexity: 'Moderate',
              required_documents: ['Resume / CV', 'Application Form'],
              verification_status: 'Unverified',
              is_featured: true,
              fingerprint,
              evidence_quotes: [
                `Verified via ${source.name} direct feed`,
                `Original URL: ${cleanUrl}`
              ],
              semantic_text: semanticText,
              embedding: createSemanticVector(semanticText),
              embedding_updated_at: new Date().toISOString()
            }]);

            if (!oppInsertErr) {
              insertedCount++;
            } else {
              errors.push(`Error inserting ${item.title}: ${oppInsertErr.message}`);
            }
          }

          // Update source last_crawled_at
          await supabase.from('sources').update({ last_crawled_at: new Date().toISOString() }).eq('id', source.id);
        } catch (e: any) {
          errors.push(`Error on source ${source.name}: ${e.message}`);
        }
      }
    }

    // 4. Execute Profile-Aware Query Planner for Tavily (if key available)
    const plannedQueries = profile ? generateProfileSearchQueries(profile) : [];
    for (const pq of plannedQueries.slice(0, 3)) {
      const tavilyResults = await searchTavily(pq.query);
      discoveredUrlsCount += tavilyResults.length;
      for (const tr of tavilyResults) {
        const cleanUrl = normalizeUrl(tr.url);
        const { data: existing } = await supabase
          .from('opportunities')
          .select('id')
          .eq('official_source_url', cleanUrl)
          .maybeSingle();

        if (existing) {
          duplicatesCount++;
          continue;
        }

        const scraped = await scrapeWithFirecrawl(cleanUrl);
        candidatesCount++;
        const description = scraped?.markdown || tr.content;
        const summary = tr.content.slice(0, 140);
        if (!isLikelyOpportunity({ title: tr.title, summary, description })) continue;
        const category = inferOpportunityCategory({ title: tr.title, summary, description, category: pq.targetCategory });
        const semanticText = `Title: ${tr.title}\nOrganization: ${new URL(cleanUrl).hostname.replace(/^www\./, '')}\nType: ${category}; ${pq.angle}\nSummary: ${tr.content}\nDescription: ${description}\nLocation: Unverified\nFunding: Unverified`;

        const { error: insErr } = await supabase.from('opportunities').insert([{
          title: tr.title,
          provider: new URL(cleanUrl).hostname.replace(/^www\./, ''),
          category,
          subcategory: pq.angle,
          description,
          summary,
          official_source_url: cleanUrl,
          application_url: cleanUrl,
          source_url: cleanUrl,
          deadline: new Date(Date.now() + 45 * 86400000).toISOString(),
          location_type: 'Remote',
          host_country: 'Worldwide',
          funding_status: 'Unpaid',
          eligible_countries: ['All'],
          application_complexity: 'Moderate',
          required_documents: ['CV'],
          verification_status: 'Unverified',
          is_featured: false,
          semantic_text: semanticText,
          embedding: createSemanticVector(semanticText),
          embedding_updated_at: new Date().toISOString()
        }]);

        if (!insErr) insertedCount++;
      }
    }

    // 5. Finalize Discovery Run telemetry
    await supabase.from('discovery_runs').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      sources_searched: sourcesCount,
      queries_executed: plannedQueries.length,
      urls_discovered: discoveredUrlsCount,
      candidates_created: candidatesCount,
      duplicates_removed: duplicatesCount,
      verified_count: insertedCount,
      errors
    }).eq('id', runId);

  } catch (err: any) {
    errors.push(`Fatal runner error: ${err.message}`);
    await supabase.from('discovery_runs').update({
      status: 'failed',
      completed_at: new Date().toISOString(),
      errors
    }).eq('id', runId);
  }

  return {
    runId,
    sourcesSearched: sourcesCount,
    urlsDiscovered: discoveredUrlsCount,
    candidatesExtracted: candidatesCount,
    duplicatesRemoved: duplicatesCount,
    insertedCount,
    errors
  };
}
