import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/integrations/groq';
import { initialProfile, sampleOpportunities } from '@/lib/sample-data';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const { opportunityId, profileId, personaId, artifactType, customPrompt } = await req.json();

    let targetOpp = sampleOpportunities.find(o => o.id === opportunityId);
    if (!targetOpp) {
      const { data: dbOpp } = await supabase.from('opportunities').select('*').eq('id', opportunityId).maybeSingle();
      if (dbOpp) targetOpp = dbOpp as any;
    }

    const oppTitle = targetOpp?.title || 'Target Opportunity';
    const oppOrg = targetOpp?.provider || 'Host Organization';
    const oppDesc = targetOpp?.description || targetOpp?.summary || 'High impact opportunity';
    const oppReqs = targetOpp?.requiredDocuments?.join(', ') || 'Application Form, Statement';
    const oppCategory = targetOpp?.category || 'Fellowships';

    const candidateName = initialProfile.fullName || 'Candidate';
    const candidateSkills = initialProfile.skills.join(', ');
    const candidateRole = initialProfile.workHistory[0]?.role || 'Professional';
    const candidateBio = initialProfile.workHistory.map(w => `${w.role} at ${w.company} (${w.startDate} - ${w.endDate})`).join('\n');

    let prompt = '';
    if (artifactType === 'cv_bullets') {
      prompt = `Generate 4 high-impact, tailored CV bullet points for candidate ${candidateName} (${candidateRole}, Skills: ${candidateSkills}) applying for: "${oppTitle}" hosted by "${oppOrg}" (${oppCategory}).
Format each bullet strictly using the framework: [Strong Action Verb] + [Context / Challenge] + [Quantified Metric / Measurable Outcome].
Ground strictly in their real experience.`;
    } else if (artifactType === 'abstract') {
      prompt = `Draft an executive proposal abstract for ${candidateName} applying to "${oppTitle}" (${oppOrg}).
Format with:
- Title: Concise and compelling
- Problem Statement: 2 sentences on the friction/challenge
- Proposed Solution & Methodology: 3 sentences on execution
- Projected Impact: Measurable outcomes.`;
    } else {
      prompt = `Write a compelling, structured Statement of Purpose / Motivation Statement for ${candidateName} applying to "${oppTitle}" at "${oppOrg}".
Opportunity Context: ${oppDesc}
Candidate Background: ${candidateRole} with skills in ${candidateSkills}. Work History: ${candidateBio}.
Requirements: Ground strictly in candidate credentials, zero AI fluff or clich\u00e9s, concise 3-paragraph structure.`;
    }

    if (customPrompt) {
      prompt += `\nAdditional Focus Instructions: ${customPrompt}`;
    }

    const groqOutput = await callGroq([
      { role: 'system', content: 'You are Oppverse AI, an expert opportunity application tailoring strategist. Write crisp, high-conviction, tailored application materials.' },
      { role: 'user', content: prompt }
    ], { temperature: 0.3, max_tokens: 1500 });

    const finalContent = groqOutput || `Tailored application draft for ${oppTitle} at ${oppOrg}.`;

    return NextResponse.json({
      success: true,
      opportunityId,
      artifactType: artifactType || 'motivation_statement',
      opportunityTitle: oppTitle,
      organization: oppOrg,
      content: finalContent,
      characterCount: finalContent.length,
      wordCount: finalContent.split(/\s+/).length,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
