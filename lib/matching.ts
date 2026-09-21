import { 
  UserProfile, 
  Opportunity, 
  OpportunityMatch, 
  MatchLabel, 
  EligibilityStatus,
  SubScoreBreakdown,
  ReadinessDetail
} from "./types";

export function evaluateOpportunityMatch(profile: UserProfile, opp: Opportunity): OpportunityMatch {
  // -------------------------------------------------------------
  // 1. STRICT MULTI-FACTOR ELIGIBILITY VERIFICATION
  // -------------------------------------------------------------
  let isEligible = true;
  let eligibilityReason: string | undefined = undefined;
  let eligibilityStatus: EligibilityStatus = "Eligible";

  const userCitizenship = profile.citizenship || [];
  const oppEligible = opp.eligibleNationalities || ["All"];

  // Regional keyword checks
  const isGlobalOpportunity = oppEligible.some(c => 
    c.toLowerCase() === "all" || 
    c.toLowerCase() === "global" || 
    c.toLowerCase() === "worldwide"
  );

  const isAfricanRegional = oppEligible.some(c => 
    c.toLowerCase().includes("african") || 
    c.toLowerCase().includes("sub-saharan") || 
    c.toLowerCase().includes("emerging") ||
    c.toLowerCase().includes("developing")
  );

  const hasSpecificCountryMatch = oppEligible.some(country => 
    userCitizenship.some(uc => uc.toLowerCase() === country.toLowerCase())
  );

  const hasCitizenshipMatch = isGlobalOpportunity || (userCitizenship.length > 0 && (isAfricanRegional || hasSpecificCountryMatch));

  if (!hasCitizenshipMatch && userCitizenship.length === 0) {
    eligibilityStatus = "Eligibility Unclear";
    eligibilityReason = "Citizenship is required to verify this opportunity's eligibility.";
  } else if (!hasCitizenshipMatch) {
    isEligible = false;
    eligibilityStatus = "Ineligible";
    eligibilityReason = `Restricted to applicants with citizenship in: ${oppEligible.join(", ")}.`;
  }

  // Education requirement check if opportunity specifies strict degree
  if (isEligible && opp.educationRequired) {
    const req = opp.educationRequired.toLowerCase();
    const userDegrees = profile.education.map(e => e.degree.toLowerCase());
    const hasDegree = userDegrees.length > 0;
    
    if (req.includes("phd") && !userDegrees.some(d => d.includes("phd") || d.includes("doctorate"))) {
      isEligible = false;
      eligibilityStatus = "Ineligible";
      eligibilityReason = "Requires a completed PhD or Doctorate degree.";
    } else if (req.includes("master") && !userDegrees.some(d => d.includes("master") || d.includes("msc") || d.includes("mba") || d.includes("phd"))) {
      // If ambiguous, set as unclear rather than false disqualification
      if (!hasDegree) {
        eligibilityStatus = "Eligibility Unclear";
        eligibilityReason = "Requires Master's degree verification.";
      }
    }
  }

  // -------------------------------------------------------------
  // 2. MULTI-DIMENSIONAL FIT SCORING ALGORITHM
  // -------------------------------------------------------------
  const whyItMatches: string[] = [];
  const watchOuts: string[] = [];

  // A. Category & Persona Alignment (Weight: 25%)
  const activePersona = profile.personas.find(p => p.id === profile.activePersonaId) || profile.personas[0];
  const isTargetUniverse = activePersona?.targetUniverses?.includes(opp.category) || false;
  const isGeneralUniverse = profile.selectedUniverses.includes(opp.category);
  
  let categoryScore = 15;
  if (isTargetUniverse) {
    categoryScore = 98;
    whyItMatches.push(`Directly matches your active persona (${activePersona.name}) target categories.`);
  } else if (isGeneralUniverse) {
    categoryScore = 80;
    whyItMatches.push(`Aligns with your primary opportunity interest in ${opp.category}.`);
  }

  // B. Skills & Domain Overlap (Weight: 35%)
  const matchedSkills = profile.skills.filter(skill => {
    const s = skill.toLowerCase();
    return (
      opp.tags.some(tag => tag.toLowerCase().includes(s) || s.includes(tag.toLowerCase())) ||
      opp.title.toLowerCase().includes(s) ||
      opp.description.toLowerCase().includes(s) ||
      opp.summary.toLowerCase().includes(s)
    );
  });

  let skillsScore = 10;
  if (matchedSkills.length >= 3) {
    skillsScore = 96;
    whyItMatches.push(`Strong verified skills overlap: ${matchedSkills.slice(0, 3).join(", ")}.`);
  } else if (matchedSkills.length >= 1) {
    skillsScore = 82;
    whyItMatches.push(`Relevant domain capability in ${matchedSkills.join(", ")}.`);
  }

  // C. Seniority & Experience Fit (Weight: 20%)
  let seniorityScore = 55;
  const userExp = profile.yearsOfExperience;
  
  if (opp.experienceRequired) {
    const expText = opp.experienceRequired.toLowerCase();
    if (expText.includes("senior") || expText.includes("5+") || expText.includes("lead")) {
      if (userExp >= 5) {
        seniorityScore = 95;
        whyItMatches.push(`Your ${userExp}+ years of track record comfortably meets the senior leadership requirement.`);
      } else if (userExp >= 3) {
        seniorityScore = 75;
        watchOuts.push("Program targets senior practitioners with 5+ years of demonstrable impact.");
      } else {
        seniorityScore = 45;
        watchOuts.push("High experience threshold compared to current profile timeline.");
      }
    } else if (expText.includes("mid") || expText.includes("3+")) {
      seniorityScore = userExp >= 3 ? 92 : 70;
    } else {
      seniorityScore = 88;
    }
  } else {
    seniorityScore = 55;
  }

  // D. Financial & Compensation Fit (Weight: 10%)
  let financialScore = 70;
  if (opp.fundingStatus === "Fully Funded") {
    financialScore = 98;
    whyItMatches.push("Fully funded: 100% covers stipend, travel, accommodations, and program costs.");
  } else if (opp.fundingStatus === "Paid" || opp.fundingStatus === "Grant Award") {
    financialScore = 92;
    if (opp.fundingAmount) {
      whyItMatches.push(`High financial value: ${opp.fundingAmount}.`);
    }
  } else if (opp.fundingStatus === "Partially Funded") {
    financialScore = 65;
    watchOuts.push("Partially funded: supplementary self-funding or co-sponsorship may be required.");
  } else {
    financialScore = 50;
    watchOuts.push("Unpaid position: review time commitment vs career ROI.");
  }

  // E. Logistics & Location Fit (Weight: 10%)
  let logisticsScore = 80;
  if (opp.locationType === "Remote") {
    logisticsScore = 98;
    whyItMatches.push("100% remote flexibility without relocation or visa processing delays.");
  } else if (opp.locationType === "Physical") {
    if (opp.fundingStatus === "Fully Funded") {
      logisticsScore = 90;
      whyItMatches.push(`International on-site in ${opp.hostCountry || 'host city'} with flights included.`);
    } else if (profile.relocationPreference) {
      logisticsScore = 80;
    } else {
      logisticsScore = 60;
      watchOuts.push(`Requires physical relocation/presence in ${opp.hostCountry || 'host destination'}.`);
    }
  }

  // -------------------------------------------------------------
  // 3. DEADLINE & COMPLEXITY WATCH-OUTS
  // -------------------------------------------------------------
  const now = new Date();
  const deadlineDate = new Date(opp.deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (!opp.isRollingDeadline && diffDays > 0 && diffDays <= 7) {
    watchOuts.push(`Urgent deadline: closes in ${diffDays} day${diffDays === 1 ? '' : 's'}.`);
  }

  if (opp.applicationComplexity === "Heavy") {
    watchOuts.push("Heavy multi-stage application (portfolio submission, references, essay).");
  }

  if (opp.requiredDocuments.some(d => d.toLowerCase().includes("reference") || d.toLowerCase().includes("recommendation"))) {
    watchOuts.push("Requires external reference contacts or formal letters of recommendation.");
  }

  // SubScore Breakdown object
  const subScores: SubScoreBreakdown = {
    categoryFit: Math.round(categoryScore),
    skillsFit: Math.round(skillsScore),
    seniorityFit: Math.round(seniorityScore),
    financialFit: Math.round(financialScore),
    logisticsFit: Math.round(logisticsScore)
  };

  // -------------------------------------------------------------
  // 4. OVERALL SCORE & LABEL CALCULATION
  // -------------------------------------------------------------
  const weightedOverall = (
    subScores.categoryFit * 0.25 +
    subScores.skillsFit * 0.35 +
    subScores.seniorityFit * 0.20 +
    subScores.financialFit * 0.10 +
    subScores.logisticsFit * 0.10
  );

  // -------------------------------------------------------------
  // 5. READINESS SCORE EVALUATION
  // -------------------------------------------------------------
  const readyItems: string[] = ["Verified Profile", "Work History Timeline"];
  const missingItems: string[] = [];

  if (profile.skills.length >= 5) readyItems.push("Core Skills Inventory");
  else missingItems.push("Add 2 more specialized skills to profile");

  if (opp.requiredDocuments.includes("CV") || opp.requiredDocuments.includes("Resume")) {
    readyItems.push("Master CV / Resume");
  }

  if (opp.requiredDocuments.includes("Portfolio") || opp.requiredDocuments.includes("Case Studies")) {
    missingItems.push("Tailored Project Case Studies / Portfolio");
  }

  if (opp.requiredDocuments.some(d => d.includes("Reference"))) {
    missingItems.push("2 Confirmed Professional References");
  }

  if (opp.requiredDocuments.includes("Motivation Letter") || opp.requiredDocuments.includes("Statement of Purpose")) {
    missingItems.push("Statement of Intent / Cover Narrative");
  }

  const baseReadiness = Math.round(
    (readyItems.length / (readyItems.length + Math.max(missingItems.length, 1))) * 100
  );
  const readinessScore = Math.min(Math.max(baseReadiness, 40), 95);

  const readinessDetail: ReadinessDetail = {
    overallScore: readinessScore,
    readyItems,
    missingItems,
    effortEstimate: opp.applicationComplexity
  };

  // -------------------------------------------------------------
  // 6. INELIGIBLE HANDLING (ZERO FALSE HOPES)
  // -------------------------------------------------------------
  if (!isEligible) {
    return {
      opportunityId: opp.id,
      matchScore: 12,
      matchLabel: "Not Eligible",
      eligibilityStatus: "Ineligible",
      eligibilityReason: eligibilityReason || "Criteria mismatch.",
      whyItMatches: ["Profile demonstrates strong capability, but strict eligibility gates disqualify application."],
      watchOuts: [eligibilityReason || "Do not apply unless eligible under specific exemption."],
      readinessScore: 20,
      subScores: {
        categoryFit: subScores.categoryFit,
        skillsFit: subScores.skillsFit,
        seniorityFit: 30,
        financialFit: 20,
        logisticsFit: 10
      },
      readinessDetail,
      actionPriority: "Skip"
    };
  }

  const hasRelevanceEvidence = isTargetUniverse || isGeneralUniverse || matchedSkills.length > 0;
  const finalScore = Math.min(hasRelevanceEvidence ? Math.round(weightedOverall) : 39, 99);

  let matchLabel: MatchLabel = "Good Match";
  if (finalScore >= 90) matchLabel = "Exceptional Match";
  else if (finalScore >= 80) matchLabel = "Strong Match";
  else if (finalScore >= 65) matchLabel = "Good Match";
  else matchLabel = "Worth Exploring";

  let actionPriority: "Apply Now" | "Prepare This Week" | "Worth Exploring" | "Save for Later" | "Skip" = "Worth Exploring";
  if (finalScore >= 90 && diffDays <= 14) actionPriority = "Apply Now";
  else if (finalScore >= 80) actionPriority = "Prepare This Week";
  else if (finalScore >= 65) actionPriority = "Worth Exploring";
  else actionPriority = "Save for Later";

  return {
    opportunityId: opp.id,
    matchScore: finalScore,
    matchLabel,
    eligibilityStatus,
    whyItMatches: whyItMatches.slice(0, 3), // Top 3 concrete reasons
    watchOuts: watchOuts.slice(0, 3),       // Top 3 gotchas
    readinessScore,
    subScores,
    readinessDetail,
    actionPriority
  };
}
