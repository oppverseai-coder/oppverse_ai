import { Opportunity, OpportunityCategory } from './types';

const EDITORIAL_TITLE_PATTERNS = [
  /\bcomplete guide\b/i,
  /\bhow to (?:create|build|choose|find)\b/i,
  /\btop \d+\b/i,
  /\b\d+ (?:countries|universities|ways)\b/i,
  /\bcountries that\b/i,
  /\bfinancial requirements\b/i,
  /\bqualifications that can help\b/i,
  /\bhot job opportunities\b/i,
];

const OPPORTUNITY_SIGNALS = /\b(apply|application|deadline|fellowship|scholarship|grant|programme|program|competition|challenge|internship|vacancy|job|role|accelerator|conference|summit|call for|speaker|residency|award)\b/i;

export function isLikelyOpportunity(opportunity: Pick<Opportunity, 'title' | 'summary' | 'description'>): boolean {
  if (EDITORIAL_TITLE_PATTERNS.some((pattern) => pattern.test(opportunity.title))) return false;
  return OPPORTUNITY_SIGNALS.test(`${opportunity.title} ${opportunity.summary} ${opportunity.description}`);
}

export function inferOpportunityCategory(
  opportunity: Pick<Opportunity, 'title' | 'summary' | 'description' | 'category'>,
): OpportunityCategory {
  const text = `${opportunity.title} ${opportunity.summary} ${opportunity.description}`.toLowerCase();

  if (/\btravel grant\b/.test(text)) return 'Travel';
  if (/\b(hackathon|competition|challenge|essay competition)\b/.test(text)) return 'Competitions';
  if (/\b(internship|graduate programme|graduate program|technician program|vacancy|job opening|manager|director|officer)\b/.test(text)) return 'Jobs';
  if (/\b(scholarship|studentship)\b/.test(text)) return 'Scholarships';
  if (/\b(research grant|innovation grant|grant program|grant programme|funding call)\b/.test(text)) return 'Grants';
  if (/\b(fellowship|visiting professor|visiting professorship)\b/.test(text)) return 'Fellowships';
  if (/\b(call for speakers|keynote|speaker)\b/.test(text)) return 'Speaking';
  if (/\b(conference|summit|forum|congress)\b/.test(text)) return 'Conferences';
  if (/\b(accelerator|incubator)\b/.test(text)) return 'Accelerators';
  return opportunity.category;
}
