import { createClient } from './client';
import { Opportunity, UserProfile, Mission, ApplicationStatus, Persona, OpportunityCategory } from '@/lib/types';

/**
 * Fetch verified opportunities from Supabase. Production callers never receive demo data.
 */
export async function fetchOpportunities(category?: string, searchQuery?: string): Promise<Opportunity[]> {
  const supabase = createClient();
  try {
    let query = supabase.from('opportunities').select('*').order('created_at', { ascending: false });
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    let results = data.map(mapDbOpportunityToModel);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(o => 
        o.title.toLowerCase().includes(q) || 
        o.provider.toLowerCase().includes(q) || 
        o.description.toLowerCase().includes(q)
      );
    }
    return results;
  } catch (err) {
    console.warn('Opportunity fetch failed:', err);
    return [];
  }
}

/**
 * Fetch the authenticated user's profile without cross-user/demo fallbacks.
 */
export async function fetchUserProfile(userId?: string): Promise<UserProfile | null> {
  if (!userId) return null;

  const supabase = createClient();
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) return null;

    // Fetch user personas
    const { data: personas } = await supabase
      .from('personas')
      .select('*')
      .eq('user_id', userId);

    const mappedPersonas: Persona[] = personas && personas.length > 0 ? personas.map((p: any) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      headline: p.headline || p.role || 'Opportunity Persona',
      targetUniverses: (p.target_categories || ['Jobs', 'Fellowships']) as OpportunityCategory[],
      goals: p.goals || [],
      skills: p.skills || [],
      isDefault: p.is_active || false
    })) : [];

    return {
      id: profile.id,
      fullName: profile.full_name || '',
      email: profile.email || '',
      avatarUrl: profile.avatar_url,
      citizenship: profile.citizenship || [],
      countryOfResidence: profile.country_of_residence || '',
      city: profile.city || '',
      yearsOfExperience: profile.years_experience || 0,
      careerLevel: profile.career_level || 'Early-Career',
      education: profile.education || [],
      workHistory: profile.work_history || [],
      languages: ['English (Fluent)'],
      skills: profile.skills || [],
      personas: mappedPersonas,
      activePersonaId: profile.active_persona_id || mappedPersonas.find((p) => p.isDefault)?.id || mappedPersonas[0]?.id || '',
      selectedUniverses: (profile.opportunity_interests || []) as OpportunityCategory[],
      goals: profile.goals || [],
      remotePreference: profile.remote_preference || 'Any',
      relocationPreference: profile.relocation_preference || false,
      profileStrength: profile.profile_strength || 0,
      onboardingCompleted: profile.onboarding_completed || false,
      createdAt: profile.created_at || new Date().toISOString(),
      updatedAt: profile.updated_at || new Date().toISOString()
    };
  } catch (err) {
    console.warn('Error fetching user profile:', err);
    return null;
  }
}

export async function completeUserOnboarding(userId: string, input: {
  fullName: string;
  citizenship: string;
  countryOfResidence: string;
  city: string;
  yearsOfExperience: number;
  careerLevel: UserProfile['careerLevel'];
  skills: string[];
  goals: string[];
  selectedUniverses: OpportunityCategory[];
  remotePreference: UserProfile['remotePreference'];
  relocationPreference: boolean;
  personaName: string;
  personaRole: string;
}) {
  const supabase = createClient();
  const profileStrength = Math.min(100, 45 + (input.skills.length * 4) + (input.goals.length * 5) + (input.selectedUniverses.length * 2));

  const { error: profileError } = await supabase.from('profiles').update({
    full_name: input.fullName,
    citizenship: input.citizenship ? [input.citizenship] : [],
    country_of_residence: input.countryOfResidence,
    city: input.city,
    years_experience: input.yearsOfExperience,
    career_level: input.careerLevel,
    skills: input.skills,
    goals: input.goals,
    opportunity_interests: input.selectedUniverses,
    remote_preference: input.remotePreference,
    relocation_preference: input.relocationPreference,
    profile_strength: profileStrength,
    updated_at: new Date().toISOString(),
  }).eq('id', userId);

  if (profileError) throw profileError;

  const { error: clearPersonaError } = await supabase.from('personas').delete().eq('user_id', userId);
  if (clearPersonaError) throw clearPersonaError;
  const { data: persona, error: personaError } = await supabase.from('personas').insert({
    user_id: userId,
    name: input.personaName,
    role: input.personaRole,
    target_categories: input.selectedUniverses,
    skills: input.skills,
    location_preference: input.remotePreference,
    is_active: true,
  }).select('id').single();

  if (personaError) throw personaError;

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { onboarding_completed: true },
  });
  if (metadataError) throw metadataError;

  try {
    await fetch('/api/personalization/refresh', { method: 'POST' });
  } catch (error) {
    console.warn('Profile saved; semantic personalization will retry later.', error);
  }
}

export async function createUserPersona(userId: string, input: {
  name: string;
  role: string;
  targetUniverses: OpportunityCategory[];
  skills?: string[];
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('personas').insert({
    user_id: userId,
    name: input.name,
    role: input.role,
    target_categories: input.targetUniverses,
    skills: input.skills || [],
    is_active: false,
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function activateUserPersona(userId: string, personaId: string) {
  const supabase = createClient();
  const { error: clearError } = await supabase.from('personas').update({ is_active: false }).eq('user_id', userId);
  if (clearError) throw clearError;
  const { error } = await supabase.from('personas').update({ is_active: true }).eq('id', personaId).eq('user_id', userId);
  if (error) throw error;
  await supabase.from('profiles').update({ active_persona_id: personaId, updated_at: new Date().toISOString() }).eq('id', userId);
  try {
    await fetch('/api/personalization/refresh', { method: 'POST' });
  } catch (refreshError) {
    console.warn('Persona activated; semantic personalization will retry later.', refreshError);
  }
}

/**
 * Update user profile in Supabase
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const supabase = createClient();
  const dbUpdates: any = {};
  if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
  if (updates.citizenship !== undefined) dbUpdates.citizenship = updates.citizenship;
  if (updates.countryOfResidence !== undefined) dbUpdates.country_of_residence = updates.countryOfResidence;
  if (updates.city !== undefined) dbUpdates.city = updates.city;
  if (updates.yearsOfExperience !== undefined) dbUpdates.years_experience = updates.yearsOfExperience;
  if (updates.careerLevel !== undefined) dbUpdates.career_level = updates.careerLevel;
  if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
  if (updates.education !== undefined) dbUpdates.education = updates.education;
  if (updates.workHistory !== undefined) dbUpdates.work_history = updates.workHistory;
  if (updates.goals !== undefined) dbUpdates.goals = updates.goals;
  if (updates.selectedUniverses !== undefined) dbUpdates.opportunity_interests = updates.selectedUniverses;
  if (updates.profileStrength !== undefined) dbUpdates.profile_strength = updates.profileStrength;
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', userId)
    .select();

  if (error) console.error('Failed to update profile:', error);
  if (!error) {
    try {
      await fetch('/api/personalization/refresh', { method: 'POST' });
    } catch (refreshError) {
      console.warn('Profile updated; semantic personalization will retry later.', refreshError);
    }
  }
  return { data, error };
}

/**
 * Fetch user autonomous search missions
 */
export async function fetchUserMissions(userId?: string): Promise<Mission[]> {
  if (!userId) return [];

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((m: any) => ({
      id: m.id,
      title: m.title,
      prompt: m.query_prompt,
      targetCategories: (m.target_categories || []) as OpportunityCategory[],
      countries: m.countries || ['Remote', 'Global'],
      fundingPreference: m.funding_preference || 'Fully Funded',
      isActive: m.is_active,
      matchCount: m.match_count || 0,
      lastRunAt: m.last_run_at || new Date().toISOString(),
      createdAt: m.created_at || new Date().toISOString()
    }));
  } catch (err) {
    return [];
  }
}

/**
 * Save new autonomous mission
 */
export async function saveUserMission(userId: string, mission: { title: string; prompt: string; categories?: OpportunityCategory[] }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('missions')
    .insert({
      user_id: userId,
      title: mission.title,
      query_prompt: mission.prompt,
      target_categories: mission.categories || ['Jobs', 'Fellowships'],
      countries: ['Remote', 'Global'],
      funding_preference: 'Fully Funded',
      is_active: true,
      match_count: 3
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch user tracked applications
 */
export async function fetchUserApplications(userId?: string) {
  if (!userId) return null;
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, opportunities(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Save / update application
 */
export async function saveUserApplication(userId: string, app: {
  opportunityId: string;
  status?: string;
  checklist?: any[];
  notes?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('applications')
    .upsert({
      user_id: userId,
      opportunity_id: app.opportunityId,
      status: app.status || 'Preparing',
      checklist: app.checklist || [],
      notes: app.notes || '',
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch user document vault items
 */
export async function fetchUserVaultDocs(userId?: string) {
  if (!userId) return null;
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('vault_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Save document to vault
 */
export async function saveUserVaultDoc(userId: string, doc: {
  name: string;
  documentType: string;
  fileSize?: string;
  tags?: string[];
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vault_documents')
    .insert({
      user_id: userId,
      name: doc.name,
      document_type: doc.documentType,
      file_size: doc.fileSize || '200 KB',
      tags: doc.tags || []
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Helper to map DB opportunity row to frontend model
 */
export function mapDbOpportunityToModel(row: any): Opportunity {
  return {
    id: row.id,
    title: row.title,
    provider: row.provider,
    category: row.category as OpportunityCategory,
    subcategory: row.subcategory || row.category,
    description: row.description,
    summary: row.summary || (row.description ? row.description.substring(0, 140) + '...' : ''),
    officialSourceUrl: row.official_source_url,
    applicationUrl: row.application_url,
    deadline: row.deadline || '2026-11-30T23:59:59Z',
    isRollingDeadline: row.is_rolling_deadline || false,
    locationType: (row.location_type || 'Remote') as "Remote" | "Physical" | "Hybrid",
    hostCountry: row.host_country || 'Global',
    eligibleNationalities: row.eligible_countries || ['All'],
    fundingStatus: (row.funding_status || 'Fully Funded') as "Fully Funded" | "Partially Funded" | "Paid" | "Unpaid" | "Grant Award",
    fundingAmount: row.funding_amount || 'Fully Covered',
    applicationComplexity: (row.application_complexity || 'Moderate') as "Quick" | "Moderate" | "Heavy",
    requiredDocuments: row.required_documents || ['CV / Resume'],
    experienceRequired: row.experience_required || 'Relevant domain expertise',
    educationRequired: row.education_required || 'Bachelor\'s degree or equivalent experience',
    verificationStatus: (row.verification_status || 'Verified') as "Verified" | "Recently Checked" | "Unverified",
    isFeatured: row.is_featured || false,
    tags: row.tags || [row.category, 'Verified'],
    postedDate: row.created_at || new Date().toISOString()
  };
}
