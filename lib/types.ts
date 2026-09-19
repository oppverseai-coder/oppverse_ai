export type OpportunityCategory = 
  | "Jobs" 
  | "Fellowships" 
  | "Scholarships" 
  | "Grants" 
  | "Conferences" 
  | "Travel" 
  | "Accelerators" 
  | "Speaking" 
  | "Competitions";

export type MatchLabel = 
  | "Exceptional Match" 
  | "Strong Match" 
  | "Good Match" 
  | "Worth Exploring" 
  | "Low Fit" 
  | "Not Eligible";

export type EligibilityStatus = 
  | "Eligible" 
  | "Ineligible" 
  | "Eligibility Unclear";

export type ApplicationComplexity = "Quick" | "Moderate" | "Heavy";

export type ApplicationStatus = 
  | "Saved" 
  | "Preparing" 
  | "Ready" 
  | "Applied" 
  | "Interview" 
  | "Shortlisted" 
  | "Won" 
  | "Rejected" 
  | "Withdrawn";

export interface Persona {
  id: string;
  name: string;
  role: string;
  headline: string;
  targetUniverses: OpportunityCategory[];
  goals: string[];
  skills: string[];
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  citizenship: string[];
  countryOfResidence: string;
  city: string;
  yearsOfExperience: number;
  careerLevel: "Early-Career" | "Mid-Career" | "Senior" | "Executive" | "Student" | "Founder";
  education: Array<{
    degree: string;
    institution: string;
    field: string;
    graduationYear: string;
  }>;
  workHistory: Array<{
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  languages: string[];
  skills: string[];
  personas: Persona[];
  activePersonaId: string;
  selectedUniverses: OpportunityCategory[];
  goals: string[];
  relocationPreference: boolean;
  remotePreference: "Remote" | "Hybrid" | "On-site" | "Any";
  profileStrength: number;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  provider: string;
  providerLogo?: string;
  category: OpportunityCategory;
  subcategory?: string;
  summary: string;
  description: string;
  officialSourceUrl: string;
  applicationUrl: string;
  deadline: string;
  isRollingDeadline?: boolean;
  locationType: "Remote" | "Physical" | "Hybrid";
  hostCountry?: string;
  hostCity?: string;
  eligibleNationalities: string[]; // e.g. ["All", "Nigeria", "Ghana", "African Countries"]
  fundingStatus: "Fully Funded" | "Partially Funded" | "Paid" | "Unpaid" | "Grant Award";
  fundingAmount?: string;
  applicationComplexity: ApplicationComplexity;
  requiredDocuments: string[];
  experienceRequired?: string;
  educationRequired?: string;
  verificationStatus: "Verified" | "Recently Checked" | "Unverified";
  isFeatured?: boolean;
  isSerendipity?: boolean;
  tags: string[];
  postedDate: string;
}

export interface SubScoreBreakdown {
  categoryFit: number;
  skillsFit: number;
  seniorityFit: number;
  financialFit: number;
  logisticsFit: number;
}

export interface ReadinessDetail {
  overallScore: number;
  readyItems: string[];
  missingItems: string[];
  effortEstimate: ApplicationComplexity;
}

export interface OpportunityMatch {
  opportunityId: string;
  matchScore: number;
  matchLabel: MatchLabel;
  eligibilityStatus: EligibilityStatus;
  eligibilityReason?: string;
  whyItMatches: string[];
  watchOuts: string[];
  readinessScore: number;
  subScores?: SubScoreBreakdown;
  readinessDetail?: ReadinessDetail;
  actionPriority: "Apply Now" | "Prepare This Week" | "Worth Exploring" | "Save for Later" | "Skip";
}

export interface Mission {
  id: string;
  title: string;
  prompt: string;
  targetCategories: OpportunityCategory[];
  countries: string[];
  fundingPreference: string;
  isActive: boolean;
  matchCount: number;
  lastRunAt: string;
  createdAt: string;
}

export interface ApplicationItem {
  id: string;
  opportunityId: string;
  status: ApplicationStatus;
  checklist: Array<{
    id: string;
    task: string;
    completed: boolean;
  }>;
  notes: string;
  deadline: string;
  updatedAt: string;
}
