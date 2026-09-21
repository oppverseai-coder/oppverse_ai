import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/integrations/groq';
import { searchTavily } from '@/lib/integrations/tavily';
import { mapDbOpportunityToModel } from '@/lib/supabase/db';
import { loadAuthenticatedProfile } from '@/lib/personalization/server';
import { structuredInterpretation } from '@/lib/personalization/interpreter';
import { buildOpportunitySemanticText, buildProfileSemanticText, createSemanticVector, parseStoredVector } from '@/lib/personalization/semantic';
import { evaluatePersonalizedMatch } from '@/lib/personalization/matching';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 });
    const context = await loadAuthenticatedProfile();
    if ('error' in context) return NextResponse.json({ error: context.error }, { status: context.status });

    const { data: rows, error } = await context.supabase.from('opportunities').select('*');
    if (error) throw error;
    const interpreted = Object.keys(context.profileRow.interpreted_profile || {}).length
      ? context.profileRow.interpreted_profile
      : structuredInterpretation(context.profile);
    const profileVector = parseStoredVector(context.profileRow.embedding)
      || createSemanticVector(buildProfileSemanticText(context.profile, interpreted));
    const ranked = (rows || []).map((row) => {
      const opportunity = mapDbOpportunityToModel(row);
      const opportunityVector = parseStoredVector(row.embedding) || createSemanticVector(buildOpportunitySemanticText(opportunity));
      return { opportunity, match: evaluatePersonalizedMatch(context.profile, interpreted, opportunity, profileVector, opportunityVector) };
    }).sort((a, b) => b.match.matchScore - a.match.matchScore).slice(0, 8);

    const webResults = /\b(find|search|latest|new)\b/i.test(message)
      ? await searchTavily(message, { maxResults: 3 })
      : [];
    const opportunityContext = ranked.map(({ opportunity, match }) => ({
      title: opportunity.title,
      provider: opportunity.provider,
      category: opportunity.category,
      score: match.matchScore,
      eligibility: match.eligibilityStatus,
      reasons: match.whyItMatches,
      deadline: opportunity.deadline,
      funding: opportunity.fundingAmount || opportunity.fundingStatus,
    }));
    const reply = await callGroq([
      { role: 'system', content: 'You are the Oppverse opportunity intelligence assistant. Use only supplied profile and opportunity evidence. Never invent eligibility, achievements, funding, deadlines, or experience. Clearly label unclear eligibility and recommend checking the official source.' },
      { role: 'user', content: JSON.stringify({ query: message, profile: { goals: context.profile.goals, skills: context.profile.skills, citizenship: context.profile.citizenship, residence: context.profile.countryOfResidence }, rankedOpportunities: opportunityContext, webResults }) },
    ], { temperature: 0.1, max_tokens: 1100 });

    return NextResponse.json({ success: true, reply: reply || 'I could not generate a grounded answer from the available opportunity data.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Opportunity assistant unavailable' }, { status: 500 });
  }
}
