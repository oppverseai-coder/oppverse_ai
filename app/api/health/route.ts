import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, any> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    checks: {}
  };

  try {
    // 1. Check Supabase DB connectivity
    const { data: opps, count: oppCount, error: oppErr } = await supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true });

    checks.checks.database = {
      connected: !oppErr,
      latencyMs: Date.now() - startTime,
      totalOpportunities: oppCount || 0,
      error: oppErr ? oppErr.message : null
    };

    // 2. Check Match count
    const { count: matchCount, error: matchErr } = await supabase
      .from('matches')
      .select('id', { count: 'exact', head: true });

    checks.checks.matches = {
      totalMatches: matchCount || 0,
      error: matchErr ? matchErr.message : null
    };

    // 3. Check Vector Matching RPC function
    const { error: rpcErr } = await supabase.rpc('match_opportunities_for_persona', {
      persona_vector: new Array(1536).fill(0.01),
      match_threshold: 0.1,
      match_count: 1
    });

    checks.checks.vectorEngine = {
      rpcAvailable: !rpcErr || !rpcErr.message.includes('function match_opportunities_for_persona does not exist'),
      error: rpcErr ? rpcErr.message : null
    };

    const overallHealthy = checks.checks.database.connected && checks.checks.vectorEngine.rpcAvailable;
    checks.status = overallHealthy ? 'healthy' : 'degraded';

    return NextResponse.json(checks, { status: overallHealthy ? 200 : 503 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', error: error.message || 'Health check error' },
      { status: 500 }
    );
  }
}
