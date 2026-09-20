import { supabase } from '@/lib/supabase/client';
import { Opportunity } from '@/lib/types';

export interface ScrapedOpportunityInput {
  title: string;
  slug?: string;
  organization: string;
  category: string;
  description: string;
  location: string;
  location_type?: string;
  funding_type: string;
  funding_amount?: string;
  deadline: string;
  url: string;
  source_universe?: string;
  required_skills?: string[];
  citizenship_restrictions?: string[];
  seniority_level?: string;
  currency?: string;
}

/**
 * Standard simulated & real RSS/API opportunity feeds
 */
export const EXTERNAL_FEEDS = [
  {
    name: 'Global Tech Fellowships & Grants',
    source: 'TechStars & Open Impact Network',
    universe: 'Fellowships',
    fetchItems: async (): Promise<ScrapedOpportunityInput[]> => {
      return [
        {
          title: 'Mozilla Tech & Society Fellowship 2026',
          organization: 'Mozilla Foundation',
          category: 'Fellowships',
          description: 'A 12-month funded fellowship supporting technologists, researchers, and advocates working at the intersection of open-source technology, civil society, and AI governance.',
          location: 'Global / Remote',
          location_type: 'Remote',
          funding_type: 'Fully Funded',
          funding_amount: '$85,000 Stipend + Travel',
          deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          url: 'https://foundation.mozilla.org/fellowships',
          source_universe: 'Fellowships',
          required_skills: ['AI Governance', 'Open Source', 'Public Interest Tech', 'Policy Research'],
          citizenship_restrictions: ['Worldwide (No restriction)'],
          seniority_level: 'Mid to Senior',
          currency: 'USD'
        },
        {
          title: 'DeepMind AI Alignment Grant Program',
          organization: 'DeepMind & Open Research',
          category: 'Grants',
          description: 'Non-dilutive research funding for independent researchers, research groups, and early-stage founders building interpretability tools and AI safety benchmarks.',
          location: 'London, UK / Remote',
          location_type: 'Hybrid',
          funding_type: 'Fully Funded',
          funding_amount: 'Â£40,000 - Â£120,000',
          deadline: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
          url: 'https://deepmind.google/research/grants',
          source_universe: 'Grants',
          required_skills: ['Machine Learning', 'PyTorch', 'Model Interpretability', 'Safety Benchmarking'],
          citizenship_restrictions: ['Worldwide (No restriction)'],
          seniority_level: 'All Levels',
          currency: 'GBP'
        },
        {
          title: 'MIT Solve Global Climate Tech Accelerator 2026',
          organization: 'MIT Solve',
          category: 'Accelerators',
          description: '9-month acceleration program providing non-dilutive grant funding, MIT mentorship, and global pilot partnerships for tech-enabled climate and clean energy solutions.',
          location: 'Cambridge, MA, USA / Hybrid',
          location_type: 'Hybrid',
          funding_type: 'Fully Funded',
          funding_amount: '$100,000 Grant + MIT Mentorship',
          deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], // Closing in 5 days (urgent test)
          url: 'https://solve.mit.edu/challenges/climate-2026',
          source_universe: 'Accelerators',
          required_skills: ['Climate Tech', 'Hardware/IoT', 'Product Strategy', 'Venture Scaling'],
          citizenship_restrictions: ['Worldwide (No restriction)'],
          seniority_level: 'Founders / Lead Engineers',
          currency: 'USD'
        },
        {
          title: 'ETH Global Paris Hackathon 2026',
          organization: 'ETHGlobal',
          category: 'Hackathons',
          description: 'A 3-day premier international Web3 and decentralized AI hackathon with $350k+ in sponsor bounties, live mentorship, and venture investor demo day.',
          location: 'Paris, France',
          location_type: 'In-person',
          funding_type: 'Partially Funded',
          funding_amount: '$350,000+ Prize Pool',
          deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Closing in 2 days (critical test)
          url: 'https://ethglobal.com/events/paris2026',
          source_universe: 'Hackathons',
          required_skills: ['Solidity', 'Smart Contracts', 'Full Stack', 'Zero Knowledge'],
          citizenship_restrictions: ['Worldwide (No restriction)'],
          seniority_level: 'All Levels',
          currency: 'USD'
        }
      ];
    }
  }
];

/**
 * Ingestion runner with deduplication and Supabase persistence
 */
export async function runOpportunityIngestion(sourceName?: string) {
  const results = {
    scrapedCount: 0,
    insertedCount: 0,
    updatedCount: 0,
    errors: [] as string[]
  };

  try {
    for (const feed of EXTERNAL_FEEDS) {
      if (sourceName && !feed.name.toLowerCase().includes(sourceName.toLowerCase())) {
        continue;
      }

      const items = await feed.fetchItems();
      results.scrapedCount += items.length;

      for (const item of items) {
        const generatedSlug = (item.title + '-' + item.organization)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Check if opportunity exists in Supabase
        const { data: existing, error: fetchErr } = await supabase
          .from('opportunities')
          .select('id, title, deadline')
          .or(`title.eq."${item.title}",slug.eq."${generatedSlug}"`)
          .maybeSingle();

        if (fetchErr && fetchErr.code !== 'PGRST116') {
          results.errors.push(`Error checking ${item.title}: ${fetchErr.message}`);
          continue;
        }

        const opportunityPayload = {
          title: item.title,
          slug: generatedSlug,
          organization: item.organization,
          category: item.category,
          description: item.description,
          location: item.location,
          location_type: item.location_type || 'Remote',
          funding_type: item.funding_type,
          funding_amount: item.funding_amount || null,
          deadline: item.deadline,
          url: item.url,
          source_universe: item.source_universe || item.category,
          required_skills: item.required_skills || [],
          citizenship_restrictions: item.citizenship_restrictions || ['Worldwide'],
          seniority_level: item.seniority_level || 'All Levels',
          currency: item.currency || 'USD',
          status: 'Active',
          verified: true
        };

        if (existing) {
          // Update existing
          const { error: updateErr } = await supabase
            .from('opportunities')
            .update(opportunityPayload)
            .eq('id', existing.id);

          if (updateErr) {
            results.errors.push(`Update error on ${item.title}: ${updateErr.message}`);
          } else {
            results.updatedCount++;
          }
        } else {
          // Insert new
          const { error: insertErr } = await supabase
            .from('opportunities')
            .insert([opportunityPayload]);

          if (insertErr) {
            results.errors.push(`Insert error on ${item.title}: ${insertErr.message}`);
          } else {
            results.insertedCount++;
          }
        }
      }
    }
  } catch (err: any) {
    results.errors.push(`Fatal ingestion error: ${err?.message || err}`);
  }

  return results;
}
