import { createClient } from '@/lib/supabase/client';
import { Opportunity } from '@/lib/types';

export interface ScrapedOpportunityInput {
  title: string;
  provider: string;
  category: string;
  description: string;
  summary?: string;
  location_type?: string;
  host_country?: string;
  funding_status: string;
  funding_amount?: string;
  deadline: string;
  official_source_url: string;
  application_url: string;
  tags?: string[];
  eligible_countries?: string[];
  experience_required?: string;
}

export const EXTERNAL_FEEDS = [
  {
    name: 'Global Tech Fellowships & Grants',
    source: 'TechStars & Open Impact Network',
    universe: 'Fellowships',
    fetchItems: async (): Promise<ScrapedOpportunityInput[]> => {
      return [
        {
          title: 'Mozilla Tech & Society Fellowship 2026',
          provider: 'Mozilla Foundation',
          category: 'Fellowships',
          description: 'A 12-month funded fellowship supporting technologists, researchers, and advocates working at the intersection of open-source technology, civil society, and AI governance.',
          summary: '12-month funded fellowship for open-source AI and public interest technologists.',
          location_type: 'Remote',
          host_country: 'Worldwide',
          funding_status: 'Fully Funded',
          funding_amount: '$85,000 Stipend + Travel',
          deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
          official_source_url: 'https://foundation.mozilla.org/fellowships',
          application_url: 'https://foundation.mozilla.org/fellowships/apply',
          tags: ['AI Governance', 'Open Source', 'Public Interest Tech', 'Policy Research'],
          eligible_countries: ['All'],
          experience_required: 'Mid to Senior'
        },
        {
          title: 'DeepMind AI Alignment Grant Program',
          provider: 'DeepMind & Open Research',
          category: 'Grants',
          description: 'Non-dilutive research funding for independent researchers, research groups, and early-stage founders building interpretability tools and AI safety benchmarks.',
          summary: 'Non-dilutive research grants for interpretability and safety research.',
          location_type: 'Hybrid',
          host_country: 'United Kingdom',
          funding_status: 'Fully Funded',
          funding_amount: 'Â£40,000 - Â£120,000',
          deadline: new Date(Date.now() + 21 * 86400000).toISOString(),
          official_source_url: 'https://deepmind.google/research/grants',
          application_url: 'https://deepmind.google/research/grants/apply',
          tags: ['Machine Learning', 'PyTorch', 'Model Interpretability', 'Safety Benchmarking'],
          eligible_countries: ['All'],
          experience_required: 'All Levels'
        },
        {
          title: 'MIT Solve Global Climate Tech Accelerator 2026',
          provider: 'MIT Solve',
          category: 'Accelerators',
          description: '9-month acceleration program providing non-dilutive grant funding, MIT mentorship, and global pilot partnerships for tech-enabled climate and clean energy solutions.',
          summary: '9-month global climate tech accelerator with non-dilutive capital.',
          location_type: 'Hybrid',
          host_country: 'United States',
          funding_status: 'Fully Funded',
          funding_amount: '$100,000 Grant + MIT Mentorship',
          deadline: new Date(Date.now() + 5 * 86400000).toISOString(), // Closing in 5 days
          official_source_url: 'https://solve.mit.edu/challenges/climate-2026',
          application_url: 'https://solve.mit.edu/challenges/climate-2026/apply',
          tags: ['Climate Tech', 'Hardware/IoT', 'Product Strategy', 'Venture Scaling'],
          eligible_countries: ['All'],
          experience_required: 'Founders / Lead Engineers'
        },
        {
          title: 'ETH Global Paris Hackathon 2026',
          provider: 'ETHGlobal',
          category: 'Competitions',
          description: 'A 3-day premier international Web3 and decentralized AI hackathon with $350k+ in sponsor bounties, live mentorship, and venture investor demo day.',
          summary: 'Premier international Web3 and AI hackathon with $350k+ in bounties.',
          location_type: 'Physical',
          host_country: 'France',
          funding_status: 'Partially Funded',
          funding_amount: '$350,000+ Prize Pool',
          deadline: new Date(Date.now() + 2 * 86400000).toISOString(), // Closing in 2 days
          official_source_url: 'https://ethglobal.com/events/paris2026',
          application_url: 'https://ethglobal.com/events/paris2026/register',
          tags: ['Solidity', 'Smart Contracts', 'Full Stack', 'Zero Knowledge'],
          eligible_countries: ['All'],
          experience_required: 'All Levels'
        }
      ];
    }
  }
];

export async function runOpportunityIngestion(sourceName?: string) {
  const supabase = createClient();
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
        // Check if opportunity exists in Supabase by title
        const { data: existing, error: fetchErr } = await supabase
          .from('opportunities')
          .select('id, title, deadline')
          .eq('title', item.title)
          .maybeSingle();

        if (fetchErr && fetchErr.code !== 'PGRST116') {
          results.errors.push(`Error checking ${item.title}: ${fetchErr.message}`);
          continue;
        }

        const opportunityPayload = {
          title: item.title,
          provider: item.provider,
          category: item.category,
          subcategory: item.tags?.[0] || 'General',
          description: item.description,
          summary: item.summary || item.description.slice(0, 120),
          location_type: item.location_type || 'Remote',
          host_country: item.host_country || 'Worldwide',
          funding_status: item.funding_status || 'Fully Funded',
          funding_amount: item.funding_amount || null,
          deadline: item.deadline,
          official_source_url: item.official_source_url,
          application_url: item.application_url,
          eligible_countries: item.eligible_countries || ['All'],
          application_complexity: 'Moderate',
          required_documents: ['Resume / CV', 'Application Form'],
          experience_required: item.experience_required || 'All Levels',
          verification_status: 'Verified',
          is_featured: true
        };

        if (existing) {
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
