import { callGroq } from '@/lib/integrations/groq';
import { OpportunityCategory, UserProfile } from '@/lib/types';
import { EvidenceBackedValue, InterpretedProfile } from './semantic';

function evidence(value: string, source: EvidenceBackedValue['source'], original = value): EvidenceBackedValue {
  return { value, source, evidence: original, confidence: 1 };
}

export function structuredInterpretation(profile: UserProfile): InterpretedProfile {
  const persona = profile.personas.find((item) => item.id === profile.activePersonaId) || profile.personas[0];
  return {
    roles: persona?.role ? [evidence(persona.role, 'persona')] : [],
    industries: [],
    skills: profile.skills.map((skill) => evidence(skill, 'structured_profile')),
    interests: [],
    goals: profile.goals.map((goal) => evidence(goal, 'onboarding_goal')),
    preferredOpportunityTypes: profile.selectedUniverses,
    geographicPreferences: profile.countryOfResidence ? [evidence(profile.countryOfResidence, 'structured_profile')] : [],
    constraints: [],
    careerDirections: profile.goals.map((goal) => evidence(goal, 'onboarding_goal')),
    learningGoals: [],
    generatedAt: new Date().toISOString(),
    model: 'structured-fallback',
  };
}

function sanitizeItems(value: unknown, allowedEvidence: string[]): EvidenceBackedValue[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item.value === 'string' && typeof item.evidence === 'string')
    .filter((item) => allowedEvidence.some((source) => source.toLowerCase().includes(item.evidence.toLowerCase()) || item.evidence.toLowerCase().includes(source.toLowerCase())))
    .map((item) => ({
      value: item.value.trim(),
      source: ['structured_profile', 'onboarding_goal', 'persona', 'cv'].includes(item.source) ? item.source : 'onboarding_goal',
      evidence: item.evidence.trim(),
      confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0.6)),
    }))
    .filter((item) => item.value && item.evidence);
}

export async function interpretProfile(profile: UserProfile, cvText = ''): Promise<InterpretedProfile> {
  const fallback = structuredInterpretation(profile);
  const persona = profile.personas.find((item) => item.id === profile.activePersonaId) || profile.personas[0];
  const evidenceLines = [persona?.role, persona?.headline, ...profile.skills, ...profile.goals, cvText.slice(0, 12000)].filter(Boolean) as string[];
  if (!evidenceLines.length) return fallback;

  const response = await callGroq([
    {
      role: 'system',
      content: `Extract an evidence-backed opportunity profile as JSON. Never invent facts. Every inferred item must quote or closely reproduce evidence from the supplied input. Explicit fields are authoritative. Return arrays for roles, industries, skills, interests, goals, geographicPreferences, constraints, careerDirections, and learningGoals. Each item must be {"value":"...","source":"structured_profile|onboarding_goal|persona|cv","evidence":"exact supporting text","confidence":0-1}. Also return preferredOpportunityTypes as an array using only these values: Jobs, Fellowships, Scholarships, Grants, Conferences, Travel, Accelerators, Speaking, Competitions.`,
    },
    {
      role: 'user',
      content: JSON.stringify({
        persona: persona ? { role: persona.role, headline: persona.headline } : null,
        explicitSkills: profile.skills,
        explicitGoals: profile.goals,
        selectedUniverses: profile.selectedUniverses,
        careerLevel: profile.careerLevel,
        yearsOfExperience: profile.yearsOfExperience,
        location: profile.countryOfResidence,
        cvText: cvText.slice(0, 12000),
      }),
    },
  ], { jsonMode: true, temperature: 0, max_tokens: 1800 });

  if (!response) return fallback;
  try {
    const parsed = JSON.parse(response);
    const allowed = evidenceLines;
    const allowedCategories = new Set<OpportunityCategory>(['Jobs', 'Fellowships', 'Scholarships', 'Grants', 'Conferences', 'Travel', 'Accelerators', 'Speaking', 'Competitions']);
    return {
      roles: sanitizeItems(parsed.roles, allowed),
      industries: sanitizeItems(parsed.industries, allowed),
      skills: sanitizeItems(parsed.skills, allowed),
      interests: sanitizeItems(parsed.interests, allowed),
      goals: sanitizeItems(parsed.goals, allowed),
      preferredOpportunityTypes: Array.isArray(parsed.preferredOpportunityTypes)
        ? parsed.preferredOpportunityTypes.filter((item: OpportunityCategory) => allowedCategories.has(item))
        : profile.selectedUniverses,
      geographicPreferences: sanitizeItems(parsed.geographicPreferences, allowed),
      constraints: sanitizeItems(parsed.constraints, allowed),
      careerDirections: sanitizeItems(parsed.careerDirections, allowed),
      learningGoals: sanitizeItems(parsed.learningGoals, allowed),
      generatedAt: new Date().toISOString(),
      model: 'groq-profile-interpreter-v1',
    };
  } catch {
    return fallback;
  }
}
