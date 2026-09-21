import assert from 'node:assert/strict';
import { createEmptyProfile } from '../lib/empty-data';
import { structuredInterpretation } from '../lib/personalization/interpreter';
import { evaluatePersonalizedMatch } from '../lib/personalization/matching';
import { Opportunity, UserProfile } from '../lib/types';

function profile(overrides: Partial<UserProfile>): UserProfile {
  return { ...createEmptyProfile('test-user'), citizenship: ['Nigeria'], countryOfResidence: 'Nigeria', relocationPreference: true, ...overrides };
}
function opportunity(overrides: Partial<Opportunity>): Opportunity {
  return {
    id: crypto.randomUUID(),
    title: 'Opportunity', provider: 'Verified Organization', category: 'Jobs', summary: '', description: '', officialSourceUrl: 'https://example.com', applicationUrl: 'https://example.com/apply', deadline: '2027-12-31T00:00:00Z', locationType: 'Remote', eligibleNationalities: ['All'], fundingStatus: 'Paid', applicationComplexity: 'Moderate', requiredDocuments: ['CV'], verificationStatus: 'Verified', tags: [], postedDate: '2026-09-01T00:00:00Z',
    ...overrides,
  };
}
function rank(user: UserProfile, opportunities: Opportunity[]) {
  const interpreted = structuredInterpretation(user);
  return opportunities.map((item) => ({ item, match: evaluatePersonalizedMatch(user, interpreted, item) })).sort((a, b) => b.match.matchScore - a.match.matchScore);
}

const opportunities = [
  opportunity({ id: 'product', title: 'AI Product Leadership Fellowship', category: 'Fellowships', summary: 'Leadership programme for AI product professionals building technology in Africa.', description: 'Develop product strategy and leadership for African technology companies.', fundingStatus: 'Fully Funded', tags: ['AI', 'Product', 'Leadership', 'Africa'] }),
  opportunity({ id: 'engineering', title: 'Machine Learning Research Engineer', summary: 'Research and engineering role building machine learning systems.', description: 'Python, model evaluation, research and software engineering.', tags: ['Python', 'Machine Learning', 'Research', 'Software Engineering'] }),
  opportunity({ id: 'scholarship', title: 'Computer Science Masters Scholarship', category: 'Scholarships', summary: 'Fully funded graduate study for early-career African students.', description: 'Masters education in computer science with research support.', fundingStatus: 'Fully Funded', tags: ['Scholarship', 'Student', 'Computer Science'] }),
];

const marketer = profile({ skills: ['Product Marketing', 'GTM Strategy'], goals: ['Move into AI product leadership and build technology companies in Africa'], selectedUniverses: ['Fellowships', 'Jobs'], yearsOfExperience: 6, careerLevel: 'Senior', personas: [{ id: 'p1', name: 'AI Product Leader', role: 'Product Marketing Leader', headline: 'AI product leadership', targetUniverses: ['Fellowships', 'Jobs'], goals: [], skills: ['Product Marketing'], isDefault: true }], activePersonaId: 'p1' });
const engineer = profile({ skills: ['Python', 'Machine Learning', 'Software Engineering'], goals: ['Work on AI engineering and research systems'], selectedUniverses: ['Jobs'], yearsOfExperience: 4, careerLevel: 'Mid-Career', personas: [{ id: 'p2', name: 'AI Engineer', role: 'Machine Learning Engineer', headline: 'AI research engineering', targetUniverses: ['Jobs'], goals: [], skills: ['Python'], isDefault: true }], activePersonaId: 'p2' });
const student = profile({ skills: ['Computer Science'], goals: ['Earn a funded masters degree in computer science'], selectedUniverses: ['Scholarships', 'Fellowships'], yearsOfExperience: 0, careerLevel: 'Student', personas: [{ id: 'p3', name: 'Graduate Student', role: 'Computer Science Student', headline: 'Funded graduate study', targetUniverses: ['Scholarships'], goals: [], skills: ['Computer Science'], isDefault: true }], activePersonaId: 'p3' });

assert.equal(rank(marketer, opportunities)[0].item.id, 'product');
assert.equal(rank(engineer, opportunities)[0].item.id, 'engineering');
assert.equal(rank(student, opportunities)[0].item.id, 'scholarship');

const before = rank({ ...marketer, goals: ['Find general marketing work'] }, opportunities).find((item) => item.item.id === 'product')!.match.goalScore;
const after = rank(marketer, opportunities).find((item) => item.item.id === 'product')!.match.goalScore;
assert(after > before, 'A relevant goal update must increase the opportunity goal signal.');

console.log('Personalization tests passed: three profiles rank differently and goal updates change ranking signals.');
