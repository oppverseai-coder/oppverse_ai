import { createClient } from '@/lib/supabase/server';
import { OpportunityCategory, Persona, UserProfile } from '@/lib/types';
import { createEmptyProfile } from '@/lib/empty-data';

export function mapProfileRows(profile: any, personas: any[]): UserProfile {
  const mappedPersonas: Persona[] = (personas || []).map((persona) => ({
    id: persona.id,
    name: persona.name,
    role: persona.role,
    headline: persona.headline || persona.role || 'Opportunity Persona',
    targetUniverses: (persona.target_categories || []) as OpportunityCategory[],
    goals: persona.goals || [],
    skills: persona.skills || [],
    isDefault: persona.is_active || false,
  }));
  const empty = createEmptyProfile(profile.id, profile.email || '');
  return {
    ...empty,
    fullName: profile.full_name || '',
    avatarUrl: profile.avatar_url,
    citizenship: profile.citizenship || [],
    countryOfResidence: profile.country_of_residence || '',
    city: profile.city || '',
    yearsOfExperience: profile.years_experience || 0,
    careerLevel: profile.career_level || 'Early-Career',
    education: profile.education || [],
    workHistory: profile.work_history || [],
    languages: profile.languages || [],
    skills: profile.skills || [],
    personas: mappedPersonas,
    activePersonaId: profile.active_persona_id || mappedPersonas.find((item) => item.isDefault)?.id || mappedPersonas[0]?.id || '',
    selectedUniverses: (profile.opportunity_interests || []) as OpportunityCategory[],
    goals: profile.goals || [],
    remotePreference: profile.remote_preference || 'Any',
    relocationPreference: profile.relocation_preference || false,
    profileStrength: profile.profile_strength || 0,
    onboardingCompleted: profile.onboarding_completed || false,
    createdAt: profile.created_at || empty.createdAt,
    updatedAt: profile.updated_at || empty.updatedAt,
  };
}

export async function loadAuthenticatedProfile() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Unauthorized', status: 401 as const };

  const [{ data: profile, error: profileError }, { data: personas, error: personaError }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('personas').select('*').eq('user_id', user.id),
  ]);
  if (profileError || !profile || personaError) return { error: 'Profile unavailable', status: 404 as const };
  return { supabase, user, profileRow: profile, personaRows: personas || [], profile: mapProfileRows(profile, personas || []) };
}
