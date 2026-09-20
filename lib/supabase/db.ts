import { createClient } from './client';
import { Opportunity, UserProfile, Mission, ApplicationStatus, Persona, OpportunityCategory } from '@/lib/types';
import { sampleOpportunities, initialProfile, sampleMissions } from '@/lib/sample-data';
import { evaluateOpportunityMatch } from '@/lib/matching';

/**
 * Fetch all opportunities from Supabase with graceful fallback
 */
export async function fetchOpportunities(category?: string, searchQuery?: string): Promise<Opportunity[]> {
  const supabase = createClient();
  try {
    let query = supabase.from('opportunities').select('*').order('created_at', { ascending: false });
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let opps = sampleOpportunities;
      if (category && category !== 'All') {
        opps = opps.filter(o => o.category.toLowerCase() === category.toLowerCase());
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        opps = opps.filter(o => 
          o.title.toLowerCase().includes(q) || 
          o.provider.toLowerCase().includes(q) || 
          o.description.toLowerCase().includes(q)
        );
      }
      return opps;
    }

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
    console.warn('Using fallback opportunity dataset:', err);
    return sampleOpportunities;
  }
}

/**
 * Fetch user profile from Supabase with fallback to local state
 */
export async function fetchUserProfile(userId?: string): Promise<UserProfile> {
  if (!userId) return initialProfile;

  const supabase = createClient();
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) return initialProfile;

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
    })) : initialProfile.personas;

    return {
      id: profile.id,
      fullName: profile.full_name || initialProfile.fullName,
      email: profile.email || initialProfile.email,
      avatarUrl: profile.avatar_url,
      citizenship: profile.citizenship?.length ? profile.citizenship : initialProfile.citizenship,
      countryOfResidence: profile.country_of_residence || initialProfile.countryOfResidence,
      city: profile.city || initialProfile.city,
      yearsOfExperience: profile.years_experience !== null && profile.years_experience !== undefined ? profile.years_experience : initialProfile.yearsOfExperience,
      careerLevel: profile.career_level || initialProfile.careerLevel,
      education: profile.education || initialProfile.education,
      workHistory: profile.work_history || initialProfile.workHistory,
      languages: ['English (Fluent)'],
      skills: profile.skills?.length ? profile.skills : initialProfile.skills,
      personas: mappedPersonas,
      activePersonaId: mappedPersonas[0]?.id || 'persona_pmm',
      selectedUniverses: (profile.opportunity_interests?.length ? profile.opportunity_interests : initialProfile.selectedUniverses) as OpportunityCategory[],
      goals: profile.goals?.length ? profile.goals : initialProfile.goals,
      remotePreference: profile.remote_preference || 'Any',
      relocationPreference: profile.relocation_preference || false,
      profileStrength: profile.profile_strength || initialProfile.profileStrength,
      createdAt: profile.created_at || new Date().toISOString(),
      updatedAt: profile.updated_at || new Date().toISOString()
    };
  } catch (err) {
    console.warn('Error fetching user profile:', err);
    return initialProfile;
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
  return { data, error };
}

/**
 * Fetch user autonomous search missions
 */
export async function fetchUserMissions(userId?: string): Promise<Mission[]> {
  if (!userId) return sampleMissions;

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return sampleMissions;

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
    return sampleMissions;
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
function mapDbOpportunityToModel(row: any): Opportunity {
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
