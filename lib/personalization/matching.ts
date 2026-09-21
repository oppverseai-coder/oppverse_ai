import { evaluateOpportunityMatch } from '@/lib/matching';
import { Opportunity, OpportunityMatch, UserProfile } from '@/lib/types';
import {
  buildOpportunitySemanticText,
  buildProfileSemanticText,
  cosineSimilarity,
  createSemanticVector,
  InterpretedProfile,
} from './semantic';

export interface PersonalizedMatch extends OpportunityMatch {
  semanticScore: number;
  goalScore: number;
}

function scoreLabel(score: number): OpportunityMatch['matchLabel'] {
  if (score >= 90) return 'Exceptional Match';
  if (score >= 80) return 'Strong Match';
  if (score >= 65) return 'Good Match';
  if (score >= 45) return 'Worth Exploring';
  return 'Low Fit';
}

export function evaluatePersonalizedMatch(
  profile: UserProfile,
  interpreted: InterpretedProfile,
  opportunity: Opportunity,
  storedProfileVector?: number[] | null,
  storedOpportunityVector?: number[] | null,
): PersonalizedMatch {
  const structured = evaluateOpportunityMatch(profile, opportunity);
  if (structured.eligibilityStatus === 'Ineligible') {
    return { ...structured, semanticScore: 0, goalScore: 0 };
  }

  const profileVector = storedProfileVector || createSemanticVector(buildProfileSemanticText(profile, interpreted));
  const opportunityVector = storedOpportunityVector || createSemanticVector(buildOpportunitySemanticText(opportunity));
  const semanticScore = Math.round(Math.max(0, cosineSimilarity(profileVector, opportunityVector)) * 100);
  const goalVector = createSemanticVector(profile.goals.join(' '));
  const goalScore = profile.goals.length
    ? Math.round(Math.max(0, cosineSimilarity(goalVector, opportunityVector)) * 100)
    : 0;

  const structuredScore = structured.matchScore;
  const hasStructuredRelevance = (structured.subScores?.categoryFit || 0) >= 80 || (structured.subScores?.skillsFit || 0) >= 80;
  const blendedScore = Math.round(structuredScore * 0.55 + semanticScore * 0.3 + goalScore * 0.15);
  const finalScore = Math.min(99, hasStructuredRelevance || semanticScore >= 45 ? blendedScore : Math.min(blendedScore, 44));
  const reasons = [...structured.whyItMatches];

  if (goalScore >= 35 && profile.goals[0]) {
    reasons.unshift(`Aligns with your stated goal: “${profile.goals[0]}”.`);
  }
  if (semanticScore >= 35) {
    reasons.push('Its role, domain, and outcomes align with your interpreted profile direction.');
  }

  let actionPriority: OpportunityMatch['actionPriority'] = 'Save for Later';
  if (finalScore >= 90) actionPriority = 'Apply Now';
  else if (finalScore >= 80) actionPriority = 'Prepare This Week';
  else if (finalScore >= 65) actionPriority = 'Worth Exploring';

  return {
    ...structured,
    matchScore: finalScore,
    matchLabel: scoreLabel(finalScore),
    whyItMatches: Array.from(new Set(reasons)).slice(0, 3),
    actionPriority,
    semanticScore,
    goalScore,
  };
}
