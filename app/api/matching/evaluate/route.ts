import { NextResponse } from 'next/server';
import { loadAuthenticatedProfile } from '@/lib/personalization/server';
import { mapDbOpportunityToModel } from '@/lib/supabase/db';
import { structuredInterpretation } from '@/lib/personalization/interpreter';
import { buildOpportunitySemanticText, buildProfileSemanticText, createSemanticVector, parseStoredVector } from '@/lib/personalization/semantic';
import { evaluatePersonalizedMatch } from '@/lib/personalization/matching';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const opportunityIds = Array.isArray(body.opportunityIds) ? body.opportunityIds : null;
    const context = await loadAuthenticatedProfile();
    if ('error' in context) return NextResponse.json({ error: context.error }, { status: context.status });

    let query = context.supabase.from('opportunities').select('*');
    if (opportunityIds?.length) query = query.in('id', opportunityIds);
    const { data: rows, error } = await query;
    if (error) throw error;
    const interpreted = Object.keys(context.profileRow.interpreted_profile || {}).length
      ? context.profileRow.interpreted_profile
      : structuredInterpretation(context.profile);
    const profileVector = parseStoredVector(context.profileRow.embedding) || createSemanticVector(buildProfileSemanticText(context.profile, interpreted));
    const matches = (rows || []).map((row) => {
      const opportunity = mapDbOpportunityToModel(row);
      const opportunityVector = parseStoredVector(row.embedding) || createSemanticVector(buildOpportunitySemanticText(opportunity));
      return evaluatePersonalizedMatch(context.profile, interpreted, opportunity, profileVector, opportunityVector);
    });
    return NextResponse.json({ success: true, count: matches.length, matches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Evaluation failed' }, { status: 500 });
  }
}
