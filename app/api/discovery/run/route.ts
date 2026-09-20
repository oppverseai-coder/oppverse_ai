import { NextRequest, NextResponse } from 'next/server';
import { runEnterpriseDiscovery } from '@/lib/services/discovery-runner';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = await runEnterpriseDiscovery();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const results = await runEnterpriseDiscovery(body?.profile);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
