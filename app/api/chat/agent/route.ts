import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { searchTavily } from '@/lib/integrations/tavily';
import { evaluateDeterministicEligibility } from '@/lib/services/eligibility-engine';
import { initialProfile, sampleOpportunities } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const { message, profileId, personaId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message query required' }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // 1. Query live Opportunity Graph
    const { data: liveOpps } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    const pool = liveOpps && liveOpps.length > 0 ? liveOpps : sampleOpportunities;

    // Filter relevant opportunities based on user intent
    let matchedOpps = pool.filter(opp => {
      if (lower.includes('fellowship') && opp.category === 'Fellowships') return true;
      if (lower.includes('grant') && (opp.category === 'Grants' || opp.category === 'Accelerators')) return true;
      if (lower.includes('speaking') || lower.includes('speaker') || lower.includes('conference')) {
        return opp.category === 'Speaking' || opp.category === 'Conferences' || opp.category === 'Events';
      }
      if (lower.includes('job') || lower.includes('role') || lower.includes('pmm') || lower.includes('marketing')) {
        return opp.category === 'Jobs' || opp.category === 'Internships';
      }
      if (lower.includes('hackathon') || lower.includes('competition')) return opp.category === 'Competitions';
      if (lower.includes('scholarship')) return opp.category === 'Scholarships';
      return false;
    });

    if (matchedOpps.length === 0) {
      matchedOpps = pool.slice(0, 3);
    }

    // Evaluate deterministic eligibility against user profile
    const evaluated = matchedOpps.map(opp => {
      const el = evaluateDeterministicEligibility(opp as any, initialProfile);
      return {
        ...opp,
        isEligible: el.isEligible,
        eligibilityStatus: el.status,
        passedGates: el.passedGates,
        watchOuts: el.watchOuts
      };
    });

    return NextResponse.json({
      success: true,
      query: message,
      resultsCount: evaluated.length,
      opportunities: evaluated.slice(0, 5)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
