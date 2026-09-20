import { UserProfile, Persona, OpportunityCategory } from '@/lib/types';

export interface PlannedSearchQuery {
  query: string;
  targetCategory: OpportunityCategory;
  angle: 'role' | 'skill' | 'geography' | 'goal' | 'serendipity';
}

/**
 * Profile-Aware Query Planner
 * Generates multi-angle search strategies tailored to candidate identity and target regions
 */
export function generateProfileSearchQueries(profile: UserProfile, persona?: Persona): PlannedSearchQuery[] {
  const activePersona = persona || profile.personas.find(p => p.id === profile.activePersonaId) || profile.personas[0];
  const role = activePersona?.role || profile.workHistory[0]?.role || 'Professional';
  const skills = activePersona?.skills?.length ? activePersona.skills : profile.skills;
  const categories = activePersona?.targetUniverses?.length ? activePersona.targetUniverses : profile.selectedUniverses;
  const topSkill = skills[0] || 'Leadership';
  const country = profile.countryOfResidence || 'Nigeria';
  const currentYear = new Date().getFullYear();

  const queries: PlannedSearchQuery[] = [];

  categories.forEach((cat) => {
    switch (cat) {
      case 'Fellowships':
        queries.push({
          query: `${role} leadership fellowship ${currentYear} open to ${country} applicants`,
          targetCategory: 'Fellowships',
          angle: 'role'
        });
        queries.push({
          query: `fully funded ${topSkill} fellowship Africa global ${currentYear}`,
          targetCategory: 'Fellowships',
          angle: 'skill'
        });
        break;

      case 'Grants':
        queries.push({
          query: `non-dilutive ${topSkill} grants Africa ${currentYear} apply`,
          targetCategory: 'Grants',
          angle: 'skill'
        });
        queries.push({
          query: `seed grant funding for ${country} innovators ${currentYear}`,
          targetCategory: 'Grants',
          angle: 'geography'
        });
        break;

      case 'Speaking':
        queries.push({
          query: `${topSkill} conference call for speakers CFP ${currentYear} travel covered`,
          targetCategory: 'Speaking',
          angle: 'skill'
        });
        queries.push({
          query: `tech conference speaker applications ${currentYear} ${role}`,
          targetCategory: 'Speaking',
          angle: 'role'
        });
        break;

      case 'Conferences':
        queries.push({
          query: `major ${topSkill} conferences ${currentYear} travel scholarship diversity grant`,
          targetCategory: 'Conferences',
          angle: 'skill'
        });
        break;

      case 'Accelerators':
        queries.push({
          query: `startup accelerator open applications ${country} Africa ${currentYear}`,
          targetCategory: 'Accelerators',
          angle: 'geography'
        });
        break;

      case 'Competitions':
        queries.push({
          query: `global ${topSkill} hackathon competition prize pool ${currentYear} online`,
          targetCategory: 'Competitions',
          angle: 'skill'
        });
        break;

      case 'Jobs':
        queries.push({
          query: `remote ${role} hiring from ${country} worldwide ${currentYear}`,
          targetCategory: 'Jobs',
          angle: 'role'
        });
        break;

      case 'Scholarships':
        queries.push({
          query: `fully funded masters scholarship for ${country} students ${currentYear}`,
          targetCategory: 'Scholarships',
          angle: 'geography'
        });
        break;

      default:
        queries.push({
          query: `${topSkill} ${cat} opportunities ${currentYear} open now`,
          targetCategory: cat,
          angle: 'serendipity'
        });
    }
  });

  return queries;
}
