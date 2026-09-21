import { NextResponse } from 'next/server';
import { interpretProfile } from '@/lib/personalization/interpreter';
import { buildProfileSemanticText, createSemanticVector } from '@/lib/personalization/semantic';
import { loadAuthenticatedProfile } from '@/lib/personalization/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const context = await loadAuthenticatedProfile();
    if ('error' in context) return NextResponse.json({ error: context.error }, { status: context.status });

    const { data: latestDocument } = await context.supabase
      .from('vault_documents')
      .select('extracted_text')
      .eq('user_id', context.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const interpreted = await interpretProfile(context.profile, latestDocument?.extracted_text || '');
    const semanticText = buildProfileSemanticText(context.profile, interpreted);
    const embedding = createSemanticVector(semanticText);
    const updatedAt = new Date().toISOString();

    const { error } = await context.supabase.from('profiles').update({
      interpreted_profile: interpreted,
      semantic_text: semanticText,
      embedding,
      personalization_updated_at: updatedAt,
    }).eq('id', context.user.id);
    if (error) throw error;

    if (context.profile.activePersonaId) {
      await context.supabase.from('personas').update({
        interpreted_profile: interpreted,
        semantic_text: semanticText,
        embedding,
      }).eq('id', context.profile.activePersonaId).eq('user_id', context.user.id);
    }

    return NextResponse.json({ success: true, interpreted, updatedAt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Personalization refresh failed' }, { status: 500 });
  }
}
