import { UserProfile, Opportunity, OpportunityMatch, MatchLabel, EligibilityStatus } from "./types";

export function evaluateOpportunityMatch(profile: UserProfile, opp: Opportunity): OpportunityMatch {
  // 1. Strict Eligibility Check
  let isEligible = true;
  let eligibilityReason: string | undefined = undefined;
  let eligibilityStatus: EligibilityStatus = "Eligible";

  const userCitizenship = profile.citizenship || ["Nigeria"];
  const oppEligible = opp.eligibleNationalities || ["All"];

  const hasCitizenshipMatch = 
    oppEligible.includes("All") || 
    oppEligible.some(country => userCitizenship.includes(country) || country.toLowerCase().includes("african") || country.toLowerCase().includes("emerging"));

  if (!hasCitizenshipMatch) {
    isEligible = false;
    eligibilityStatus = "Ineligible";
    eligibilityReason = `Restricted to applicants from: ${oppEligible.join(", ")}.`;
  }

  // 2. Score Calculation
  let score = 70;
  const whyItMatches: string[] = [];
  const watchOuts: string[] = [];

  // Persona alignment
  const activePersona = profile.personas.find(p => p.id === profile.activePersonaId) || profile.personas[0];
  const universeMatch = activePersona.targetUniverses.includes(opp.category);

  if (universeMatch) {
    score += 15;
    whyItMatches.push(`Directly matches your active persona (${activePersona.name}) target category.`);
  }

  // Experience level check
  if (profile.yearsOfExperience >= 4) {
    score += 10;
    whyItMatches.push(`Your ${profile.yearsOfExperience} years of proven experience exceeds the baseline requirement.`);
  }

  // Location / Remote match
  if (opp.locationType === "Remote") {
    score += 5;
    whyItMatches.push("100% remote eligibility fits your preference without visa overhead.");
  } else if (opp.fundingStatus === "Fully Funded") {
    score += 8;
    whyItMatches.push(`Fully funded with all international travel, flights, and accommodations covered.`);
  }

  // Skills overlap
  const skillOverlap = profile.skills.filter(s => 
    opp.tags.some(t => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase())) ||
    opp.title.toLowerCase().includes(s.toLowerCase()) ||
    opp.description.toLowerCase().includes(s.toLowerCase())
  );

  if (skillOverlap.length > 0) {
    score += 10;
    whyItMatches.push(`Strong capability overlap in ${skillOverlap.slice(0, 3).join(", ")}.`);
  }

  // Watch-outs
  if (opp.applicationComplexity === "Heavy") {
    watchOuts.push("Comprehensive application package required (proposal, references, and documents).");
  }
  if (opp.requiredDocuments.some(d => d.toLowerCase().includes("reference"))) {
    watchOuts.push("Requires formal professional or academic reference contacts.");
  }

  // Compute label
  if (!isEligible) {
    return {
      opportunityId: opp.id,
      matchScore: 15,
      matchLabel: "Not Eligible",
      eligibilityStatus: "Ineligible",
      eligibilityReason,
      whyItMatches: ["Your professional background is strong, but nationality criteria does not qualify."],
      watchOuts: ["Do not apply unless you hold dual citizenship in an eligible country."],
      readinessScore: 20,
      actionPriority: "Skip"
    };
  }

  const finalScore = Math.min(score, 98);
  let matchLabel: MatchLabel = "Good Match";
  if (finalScore >= 90) matchLabel = "Exceptional Match";
  else if (finalScore >= 80) matchLabel = "Strong Match";
  else if (finalScore >= 65) matchLabel = "Good Match";
  else matchLabel = "Worth Exploring";

  // Readiness Calculation
  let readiness = 60;
  if (profile.workHistory.length > 0) readiness += 15;
  if (profile.education.length > 0) readiness += 15;
  if (profile.skills.length >= 5) readiness += 10;

  let actionPriority: "Apply Now" | "Prepare This Week" | "Worth Exploring" | "Save for Later" | "Skip" = "Worth Exploring";
  if (finalScore >= 90) actionPriority = "Apply Now";
  else if (finalScore >= 80) actionPriority = "Prepare This Week";
  else if (finalScore >= 65) actionPriority = "Worth Exploring";
  else actionPriority = "Save for Later";

  return {
    opportunityId: opp.id,
    matchScore: finalScore,
    matchLabel,
    eligibilityStatus,
    whyItMatches,
    watchOuts,
    readinessScore: Math.min(readiness, 95),
    actionPriority
  };
}
