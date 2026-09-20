import { NextRequest, NextResponse } from 'next/server';
import { runOpportunityIngestion } from '@/lib/ingestion';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Optional secret check if configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // allow internal origin checks or developer trigger
      const url = new URL(req.url);
      const manualKey = url.searchParams.get('key');
      if (manualKey !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
      }
    }

    const results = await runOpportunityIngestion();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ingestion failure' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const results = await runOpportunityIngestion(body?.sourceName);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ingestion failure' },
      { status: 500 }
    );
  }
}
