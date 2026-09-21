import { UserProfile } from '@/lib/types';

export function createEmptyProfile(userId = '', email = ''): UserProfile {
  const now = new Date().toISOString();
  return {
    id: userId,
    fullName: '',
    email,
    citizenship: [],
    countryOfResidence: '',
    city: '',
    yearsOfExperience: 0,
    careerLevel: 'Early-Career',
    education: [],
    workHistory: [],
    languages: [],
    skills: [],
    personas: [],
    activePersonaId: '',
    selectedUniverses: [],
    goals: [],
    relocationPreference: false,
    remotePreference: 'Any',
    profileStrength: 0,
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
  };
}
