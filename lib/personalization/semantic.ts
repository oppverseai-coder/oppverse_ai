import { Opportunity, OpportunityCategory, UserProfile } from '@/lib/types';

export const SEMANTIC_VECTOR_SIZE = 1536;

export interface EvidenceBackedValue {
  value: string;
  source: 'structured_profile' | 'onboarding_goal' | 'persona' | 'cv';
  evidence: string;
  confidence: number;
}

export interface InterpretedProfile {
  roles: EvidenceBackedValue[];
  industries: EvidenceBackedValue[];
  skills: EvidenceBackedValue[];
  interests: EvidenceBackedValue[];
  goals: EvidenceBackedValue[];
  preferredOpportunityTypes: OpportunityCategory[];
  geographicPreferences: EvidenceBackedValue[];
  constraints: EvidenceBackedValue[];
  careerDirections: EvidenceBackedValue[];
  learningGoals: EvidenceBackedValue[];
  generatedAt: string;
  model: string;
}

const aliases: Record<string, string> = {
  'go-to-market': 'gtm',
  'go to market': 'gtm',
  'product management': 'product',
  'product manager': 'product',
  'product marketing': 'product-marketing',
  'software development': 'software-engineering',
  'software engineer': 'software-engineering',
  'machine learning': 'ai',
  'artificial intelligence': 'ai',
  'founding': 'entrepreneurship',
  'startup founder': 'entrepreneurship',
  'public speaking': 'speaking',
};

function normalizedTokens(text: string): string[] {
  let normalized = text.toLowerCase();
  for (const [phrase, replacement] of Object.entries(aliases)) {
    normalized = normalized.replaceAll(phrase, replacement);
  }
  return normalized
    .replace(/[^a-z0-9+#.-]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function hash(value: string, seed: number): number {
  let result = seed;
  for (let index = 0; index < value.length; index += 1) {
    result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  }
  return result >>> 0;
}

export function createSemanticVector(text: string): number[] {
  const vector = new Array<number>(SEMANTIC_VECTOR_SIZE).fill(0);
  const tokens = normalizedTokens(text);
  const features = [...tokens, ...tokens.slice(0, -1).map((token, index) => `${token}_${tokens[index + 1]}`)];

  for (const feature of features) {
    const primary = hash(feature, 2166136261) % SEMANTIC_VECTOR_SIZE;
    const secondary = hash(feature, 2654435761) % SEMANTIC_VECTOR_SIZE;
    vector[primary] += 1;
    vector[secondary] += 0.5;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return magnitude === 0 ? vector : vector.map((value) => Number((value / magnitude).toFixed(8)));
}

export function parseStoredVector(value: unknown): number[] | null {
  if (Array.isArray(value)) return value.map(Number);
  if (typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(Number) : null;
  } catch {
    return null;
  }
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (!left.length || left.length !== right.length) return 0;
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  if (!leftMagnitude || !rightMagnitude) return 0;
  return dot / Math.sqrt(leftMagnitude * rightMagnitude);
}

function values(items: EvidenceBackedValue[] = []): string[] {
  return items.filter((item) => item.evidence && item.confidence >= 0.55).map((item) => item.value);
}

export function buildProfileSemanticText(profile: UserProfile, interpreted: InterpretedProfile): string {
  const activePersona = profile.personas.find((persona) => persona.id === profile.activePersonaId) || profile.personas[0];
  return [
    `Current and target roles: ${[activePersona?.role, ...values(interpreted.roles)].filter(Boolean).join(', ')}`,
    `Career directions: ${values(interpreted.careerDirections).join(', ')}`,
    `Industries: ${values(interpreted.industries).join(', ')}`,
    `Verified skills: ${profile.skills.join(', ')}`,
    `Evidence-backed related skills: ${values(interpreted.skills).join(', ')}`,
    `Goals: ${profile.goals.join('; ')}`,
    `Interests: ${values(interpreted.interests).join(', ')}`,
    `Opportunity preferences: ${profile.selectedUniverses.join(', ')}`,
    `Experience: ${profile.careerLevel}, ${profile.yearsOfExperience} years`,
    `Geography: ${profile.countryOfResidence}; citizenship ${profile.citizenship.join(', ')}`,
    `Mobility: ${profile.remotePreference}; relocation ${profile.relocationPreference ? 'open' : 'not selected'}`,
  ].join('\n');
}

export function buildOpportunitySemanticText(opportunity: Opportunity): string {
  return [
    `Title: ${opportunity.title}`,
    `Organization: ${opportunity.provider}`,
    `Type: ${opportunity.category}; ${opportunity.subcategory || ''}`,
    `Summary: ${opportunity.summary}`,
    `Description: ${opportunity.description}`,
    `Tags and domains: ${opportunity.tags.join(', ')}`,
    `Experience: ${opportunity.experienceRequired || 'not specified'}`,
    `Education: ${opportunity.educationRequired || 'not specified'}`,
    `Location: ${opportunity.locationType}; ${opportunity.hostCountry || 'global'}`,
    `Funding: ${opportunity.fundingStatus}; ${opportunity.fundingAmount || ''}`,
  ].join('\n');
}
