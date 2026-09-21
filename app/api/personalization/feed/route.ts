import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapDbOpportunityToModel } from '@/lib/supabase/db';
import { loadAuthenticatedProfile } from '@/lib/personalization/server';
import { structuredInterpretation } from '@/lib/personalization/interpreter';
import { evaluatePersonalizedMatch } from '@/lib/personalization/matching';
import {
  buildOpportunitySemanticText,
  buildProfileSemanticText,
  createSemanticVector,
  InterpretedProfile,
  parseStoredVector,
} from '@/lib/personalization/semantic';
import { inferOpportunityCategory, isLikelyOpportunity } from '@/lib/opportunity-quality';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await loadAuthenticatedProfile();
    if ('error' in context) return NextResponse.json({ error: context.error }, { status: context.status });

    const category = request.nextUrl.searchParams.get('category');
    const search = request.nextUrl.searchParams.get('search')?.trim().toLowerCase() || '';
    let query = context.supabase.from('opportunities').select('*').order('created_at', { ascending: false });
    if (category && category !== 'All') query = query.eq('category', category);
    const { data: rows, error } = await query;
    if (error) throw error;

    const interpreted = Object.keys(context.profileRow.interpreted_profile || {}).length
      ? context.profileRow.interpreted_profile as InterpretedProfile
      : structuredInterpretation(context.profile);
    const profileSemanticText = context.profileRow.semantic_text || buildProfileSemanticText(context.profile, interpreted);
    const profileVector = parseStoredVector(context.profileRow.embedding) || createSemanticVector(profileSemanticText);

    const missingEmbeddings: Array<Record<string, unknown>> = [];
    const ranked = (rows || [])
      .map((row) => {
        const mappedOpportunity = mapDbOpportunityToModel(row);
        const opportunity = {
          ...mappedOpportunity,
          category: inferOpportunityCategory(mappedOpportunity),
        };
        const semanticText = row.semantic_text || buildOpportunitySemanticText(opportunity);
        const opportunityVector = parseStoredVector(row.embedding) || createSemanticVector(semanticText);
        if (!row.embedding || !row.semantic_text) {
          missingEmbeddings.push({
            id: row.id,
            semantic_text: semanticText,
            embedding: opportunityVector,
            embedding_updated_at: new Date().toISOString(),
          });
        }
        return {
          opportunity,
          match: evaluatePersonalizedMatch(context.profile, interpreted, opportunity, profileVector, opportunityVector),
        };
      })
      .filter(({ opportunity }) => isLikelyOpportunity(opportunity))
      .filter(({ opportunity }) => !search || [opportunity.title, opportunity.provider, opportunity.summary, opportunity.description, ...opportunity.tags].join(' ').toLowerCase().includes(search))
      .sort((left, right) => right.match.matchScore - left.match.matchScore);

    if (missingEmbeddings.length) {
      const admin = createAdminClient();
      if (admin) await admin.from('opportunities').upsert(missingEmbeddings, { onConflict: 'id' });
    }

    const matchRows = ranked.slice(0, 40).map(({ opportunity, match }) => ({
      user_id: context.user.id,
      opportunity_id: opportunity.id,
      match_score: match.matchScore,
      match_label: match.matchLabel,
      is_eligible: match.eligibilityStatus === 'Eligible',
      eligibility_status: match.eligibilityStatus,
      why_it_matches: match.whyItMatches,
      watch_outs: match.watchOuts,
      subscores: { ...(match.subScores || {}), semantic: match.semanticScore, goal: match.goalScore },
      readiness_score: match.readinessScore,
      action_priority: match.actionPriority,
    }));
    if (matchRows.length) await context.supabase.from('matches').upsert(matchRows, { onConflict: 'user_id,opportunity_id' });

    return NextResponse.json({ success: true, profile: context.profile, interpreted, results: ranked });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Personalized feed unavailable' }, { status: 500 });
  }
}
