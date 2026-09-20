import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sampleOpportunities } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { missionId, userId, prompt } = await req.json();

    const supabase = createClient();
    
    // 1. Fetch live opportunities
    const { data: dbOpps } = await supabase.from('opportunities').select('*');
    const allOpps = (dbOpps && dbOpps.length > 0) ? dbOpps : sampleOpportunities;

    // 2. Compute matching items based on prompt and categories
    const searchTerms = (prompt || 'AI Fellowships Product Marketing').toLowerCase().split(' ').filter((w: string) => w.length > 2);
    
    const matched = allOpps.filter((opp: any) => {
      const text = `${opp.title} ${opp.category} ${opp.description} ${opp.provider}`.toLowerCase();
      return searchTerms.some((term: string) => text.includes(term));
    });

    const newMatchCount = Math.max(matched.length, 3);

    // 3. If authenticated, update mission row in Supabase
    if (missionId && userId) {
      try {
        await supabase
          .from('missions')
          .update({
            match_count: newMatchCount,
            last_run_at: new Date().toISOString()
          })
          .eq('id', missionId)
          .eq('user_id', userId);
      } catch (dbErr) {
        console.warn('Could not update mission in DB:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      missionId,
      matchCount: newMatchCount,
      lastRunAt: new Date().toISOString(),
      matchedOpportunities: matched.slice(0, 5)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Mission run failed' }, { status: 500 });
  }
}
