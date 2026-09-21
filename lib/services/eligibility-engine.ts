import { UserProfile, Opportunity, EligibilityStatus } from '@/lib/types';

export interface EligibilityEvaluationResult {
  isEligible: boolean;
  status: EligibilityStatus;
  failedGates: string[];
  passedGates: string[];
  watchOuts: string[];
}

/**
 * Deterministic Eligibility Engine
 * Evaluates hard constraints before matching scoring
 */
export function evaluateDeterministicEligibility(
  opportunity: Opportunity,
  profile: UserProfile
): EligibilityEvaluationResult {
  const failedGates: string[] = [];
  const passedGates: string[] = [];
  const watchOuts: string[] = [];

  const userCitizenship = profile.citizenship || [];
  const userCountry = profile.countryOfResidence || '';
  const userExp = profile.yearsOfExperience || 0;

  // Gate 1: Citizenship / Country Restrictions
  const eligibleCountries = opportunity.eligibleNationalities || ['All'];
  const isWorldwide = eligibleCountries.some(c => ['All', 'Global', 'Worldwide', 'Open'].includes(c));

  if (!isWorldwide) {
    const hasCitizenshipMatch = userCitizenship.some(c =>
      eligibleCountries.some(ec => ec.toLowerCase() === c.toLowerCase() || ec.toLowerCase().includes(c.toLowerCase()))
    );
    const hasResidenceMatch = eligibleCountries.some(ec =>
      ec.toLowerCase() === userCountry.toLowerCase() || ec.toLowerCase().includes('africa')
    );

    if (userCitizenship.length === 0 && !userCountry) {
      watchOuts.push('Citizenship or residence is missing; eligibility requires verification.');
    } else if (hasCitizenshipMatch || hasResidenceMatch) {
      passedGates.push(`Citizenship/Residency verified (${userCountry} eligible)`);
    } else {
      failedGates.push(`Restricted to citizens of: ${eligibleCountries.join(', ')}`);
    }
  } else {
    passedGates.push('Open to all nationalities worldwide');
  }

  // Gate 2: Location Preference (Remote vs Onsite vs Target Regions)
  if (opportunity.locationType === 'Physical' && opportunity.hostCountry) {
    const isLocal = opportunity.hostCountry.toLowerCase() === userCountry.toLowerCase();
    const willingToRelocate = profile.relocationPreference;

    if (!isLocal && !willingToRelocate) {
      failedGates.push(`Requires physical presence in ${opportunity.hostCountry} (Relocation preference set to False)`);
    } else if (!isLocal && willingToRelocate) {
      watchOuts.push(`Requires international relocation to ${opportunity.hostCountry}`);
      passedGates.push(`Relocation to ${opportunity.hostCountry} matches preference`);
    } else {
      passedGates.push(`Local in-country opportunity (${opportunity.hostCountry})`);
    }
  }

  // Gate 3: Experience Requirements
  if (opportunity.experienceRequired) {
    const expText = opportunity.experienceRequired.toLowerCase();
    if (expText.includes('senior') && userExp < 4) {
      watchOuts.push(`Requires senior experience (${opportunity.experienceRequired})`);
    } else {
      passedGates.push(`Experience level matches (${userExp} yrs)`);
    }
  }

  const isEligible = failedGates.length === 0;

  return {
    isEligible,
    status: isEligible ? 'Eligible' : 'Ineligible',
    failedGates,
    passedGates,
    watchOuts
  };
}
