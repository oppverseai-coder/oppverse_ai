import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/integrations/groq';
import { loadAuthenticatedProfile } from '@/lib/personalization/server';
import { mapDbOpportunityToModel } from '@/lib/supabase/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { opportunityId, artifactType, customPrompt } = await req.json();
    if (!opportunityId) return NextResponse.json({ error: 'Opportunity required' }, { status: 400 });
    const context = await loadAuthenticatedProfile();
    if ('error' in context) return NextResponse.json({ error: context.error }, { status: context.status });

    const { data: row, error } = await context.supabase.from('opportunities').select('*').eq('id', opportunityId).single();
    if (error || !row) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    const opportunity = mapDbOpportunityToModel(row);
    const profileEvidence = {
      name: context.profile.fullName,
      skills: context.profile.skills,
      goals: context.profile.goals,
      workHistory: context.profile.workHistory,
      education: context.profile.education,
    };
    const prompt = JSON.stringify({ artifactType: artifactType || 'motivation_statement', opportunity, candidateEvidence: profileEvidence, additionalInstructions: customPrompt || '' });
    const content = await callGroq([
      { role: 'system', content: 'Create the requested application artifact using only the supplied candidate evidence. Never invent achievements, employers, metrics, qualifications, or experience. If evidence is insufficient, insert a clear [USER INPUT REQUIRED] marker instead of fabricating.' },
      { role: 'user', content: prompt },
    ], { temperature: 0.2, max_tokens: 1500 });

    if (!content) return NextResponse.json({ error: 'Grounded draft generation failed' }, { status: 503 });
    return NextResponse.json({
      success: true,
      opportunityId,
      artifactType: artifactType || 'motivation_statement',
      opportunityTitle: opportunity.title,
      organization: opportunity.provider,
      content,
      characterCount: content.length,
      wordCount: content.split(/\s+/).length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Tailoring failed' }, { status: 500 });
  }
}
