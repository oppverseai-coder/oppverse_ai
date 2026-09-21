'use client';

import React from 'react';
import { ArrowRight, Bookmark, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Opportunity, UserProfile } from '@/lib/types';
import { PersonalizedMatch } from '@/lib/personalization/matching';

interface DailyBriefHeroProps {
  profile: UserProfile;
  opportunities: Opportunity[];
  onSelectOpportunity?: (opp: Opportunity) => void;
  onInspect?: (opp: Opportunity) => void;
  onPursue?: (opp: Opportunity) => void;
  onToggleSave: (oppId: string, e: React.MouseEvent) => void;
  savedOppIds: string[];
  matches: Record<string, PersonalizedMatch>;
}

export default function DailyBriefHero({
  profile,
  opportunities,
  onSelectOpportunity,
  onInspect,
  onPursue,
  onToggleSave,
  savedOppIds,
  matches,
}: DailyBriefHeroProps) {
  const handleSelect = onInspect || onSelectOpportunity || (() => {});
  const activePersona = profile.personas.find((persona) => persona.id === profile.activePersonaId) || profile.personas[0];
  const ranked = opportunities
    .filter((opportunity) => matches[opportunity.id])
    .map((opportunity) => ({ opportunity, match: matches[opportunity.id] }))
    .filter(({ match }) => match.eligibilityStatus === 'Eligible')
    .sort((a, b) => b.match.matchScore - a.match.matchScore);
  const featured = ranked[0];

  return (
    <section className="space-y-7">
      <div className="max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Opportunity Universe
        </p>
        <h1 className="mt-2 text-[30px] font-semibold font-display leading-tight text-white sm:text-[34px]">
          Good day{profile.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}.
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Opportunities ranked for your <span className="font-medium text-zinc-200">{activePersona?.name || 'active'}</span> profile.
        </p>
      </div>

      {featured && (
        <article className="glass-panel featured-opportunity overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-zinc-400">
                <span className="badge">{featured.opportunity.category}</span>
                <span>{featured.opportunity.provider}</span>
                <span className="text-zinc-500">{featured.match.matchScore}% match</span>
              </div>

              <h2 className="text-xl font-semibold font-display leading-snug text-white sm:text-2xl">
                {featured.opportunity.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                {featured.opportunity.summary}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="icon-xs" />
                  {featured.opportunity.locationType}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="icon-xs" />
                  {new Date(featured.opportunity.deadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="icon-xs" /> Eligible
                </span>
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:flex-nowrap">
              <button
                onClick={(event) => onToggleSave(featured.opportunity.id, event)}
                className="btn btn-secondary flex-1 whitespace-nowrap lg:flex-none"
              >
                <Bookmark className="icon-sm" />
                {savedOppIds.includes(featured.opportunity.id) ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={() => handleSelect(featured.opportunity)}
                className="btn btn-primary flex-1 whitespace-nowrap lg:flex-none"
              >
                View opportunity <ArrowRight className="icon-sm" />
              </button>
              {onPursue && (
                <button onClick={() => onPursue(featured.opportunity)} className="sr-only">
                  Pursue opportunity
                </button>
              )}
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
