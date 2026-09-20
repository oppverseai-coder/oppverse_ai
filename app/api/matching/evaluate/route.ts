import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { evaluateOpportunityMatch } from '@/lib/matching';
import { UserProfile, Opportunity } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { profile, opportunities, userId } = await req.json();

    if (!profile || !opportunities || !Array.isArray(opportunities)) {
      return NextResponse.json({ error: 'Profile and opportunities array required' }, { status: 400 });
    }

    // Evaluate 5-layer matches across all opportunities
    const matches = opportunities.map((opp: Opportunity) => {
      const match = evaluateOpportunityMatch(profile, opp);
      return {
        ...match,
        opportunityId: opp.id
      };
    });

    // If authenticated, persist high-affinity matches to Supabase matches table
    if (userId) {
      try {
        const supabase = createClient();
        const rowsToUpsert = matches
          .filter(m => m.matchScore >= 60 || m.eligibilityStatus === 'Eligible')
          .slice(0, 20)
          .map(m => ({
            user_id: userId,
            opportunity_id: m.opportunityId,
            match_score: m.matchScore,
            match_label: m.matchLabel,
            is_eligible: m.eligibilityStatus === 'Eligible',
            eligibility_status: m.eligibilityStatus,
            why_it_matches: m.whyItMatches,
            watch_outs: m.watchOuts,
            subscores: m.subScores || {},
            readiness_score: m.readinessScore,
            action_priority: m.actionPriority
          }));

        if (rowsToUpsert.length > 0) {
          await supabase.from('matches').upsert(rowsToUpsert, { onConflict: 'user_id,opportunity_id' });
        }
      } catch (dbErr) {
        console.warn('Could not cache matches to DB:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Evaluation failed' }, { status: 500 });
  }
}
