import { NextResponse } from 'next/server';
import { loadAuthenticatedProfile } from '@/lib/personalization/server';
import { mapDbOpportunityToModel } from '@/lib/supabase/db';
import { buildOpportunitySemanticText, cosineSimilarity, createSemanticVector } from '@/lib/personalization/semantic';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { missionId, prompt } = await req.json();
    if (!missionId || !prompt?.trim()) return NextResponse.json({ error: 'Mission and prompt required' }, { status: 400 });
    const context = await loadAuthenticatedProfile();
    if ('error' in context) return NextResponse.json({ error: context.error }, { status: context.status });

    const { data: mission } = await context.supabase.from('missions').select('*').eq('id', missionId).eq('user_id', context.user.id).single();
    if (!mission) return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    const { data: rows, error } = await context.supabase.from('opportunities').select('*');
    if (error) throw error;

    const missionVector = createSemanticVector(`${prompt}\nProfile goals: ${context.profile.goals.join('; ')}\nSkills: ${context.profile.skills.join(', ')}`);
    const matched = (rows || []).map((row) => {
      const opportunity = mapDbOpportunityToModel(row);
      const score = cosineSimilarity(missionVector, createSemanticVector(buildOpportunitySemanticText(opportunity)));
      return { opportunity, score };
    }).filter((item) => item.score > 0.05).sort((a, b) => b.score - a.score);

    const lastRunAt = new Date().toISOString();
    await context.supabase.from('missions').update({ match_count: matched.length, last_run_at: lastRunAt }).eq('id', missionId).eq('user_id', context.user.id);
    return NextResponse.json({ success: true, missionId, matchCount: matched.length, lastRunAt, matchedOpportunities: matched.slice(0, 5).map((item) => item.opportunity) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Mission run failed' }, { status: 500 });
  }
}
