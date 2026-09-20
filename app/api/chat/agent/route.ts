import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { searchTavily } from '@/lib/integrations/tavily';
import { callGroq } from '@/lib/integrations/groq';
import { evaluateDeterministicEligibility } from '@/lib/services/eligibility-engine';
import { initialProfile, sampleOpportunities } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // 1. Fetch live opportunities from Supabase
    const { data: liveOpps } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    const pool = liveOpps && liveOpps.length > 0 ? liveOpps : sampleOpportunities;

    // 2. Perform live Tavily web search if user is asking for external/live discovery
    let webResults: any[] = [];
    if (message.toLowerCase().includes('find') || message.toLowerCase().includes('search') || message.toLowerCase().includes('latest')) {
      webResults = await searchTavily(message, { maxResults: 3 });
    }

    // 3. Synthesize response with Groq LLM
    const contextOpps = pool.slice(0, 5).map(o => `- ${o.title} (${o.provider}) [${o.category}]: ${o.summary || o.description.slice(0, 100)}`).join('\n');
    const webContext = webResults.map(w => `- [Web] ${w.title}: ${w.content.slice(0, 140)} (URL: ${w.url})`).join('\n');

    const prompt = `User Query: "${message}"
Candidate Profile: ${initialProfile.fullName}, Role: ${initialProfile.workHistory[0]?.role}, Location: ${initialProfile.countryOfResidence}, Skills: ${initialProfile.skills.join(', ')}

Available Opportunities from Oppverse Database:
${contextOpps}

Live Web Search Context:
${webContext || 'No live web search needed'}

Provide a direct, high-value, structured answer. Highlight verified matches, why they fit, and clear next action steps.`;

    const groqReply = await callGroq([
      { role: 'system', content: 'You are Oppverse AI, an elite opportunity intelligence copilot. You help professionals find, qualify for, and win life-changing opportunities with zero fluff.' },
      { role: 'user', content: prompt }
    ], { temperature: 0.2, max_tokens: 1000 });

    return NextResponse.json({
      success: true,
      query: message,
      reply: groqReply || 'Here are the best matching opportunities based on your profile.',
      webSearched: webResults.length > 0,
      opportunities: pool.slice(0, 3)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
