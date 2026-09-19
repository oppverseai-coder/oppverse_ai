'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  Bookmark, 
  X, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Flame,
  Award
} from 'lucide-react';
import { Opportunity, UserProfile, MatchEvaluation } from '@/lib/types';
import { evaluateOpportunityMatch } from '@/lib/matching';

interface DailyBriefHeroProps {
  profile: UserProfile;
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onToggleSave: (oppId: string, e: React.MouseEvent) => void;
  savedOppIds: string[];
}

export default function DailyBriefHero({
  profile,
  opportunities,
  onSelectOpportunity,
  onToggleSave,
  savedOppIds,
}: DailyBriefHeroProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Evaluate all opportunities against active profile
  const evaluated = opportunities.map(opp => ({
    opp,
    match: evaluateOpportunityMatch(profile, opp)
  }));

  // Top Matches (Fit >= 85%)
  const topMatches = evaluated.filter(e => e.match.matchScore >= 85 && e.match.eligibilityStatus === 'Eligible');

  // Closing Soon (<= 21 days from now)
  const closingSoon = evaluated.filter(e => {
    const days = Math.ceil((new Date(e.opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 21 && e.match.eligibilityStatus === 'Eligible';
  });

  // Fully Funded
  const fullyFunded = evaluated.filter(e => 
    e.opp.fundingStatus === 'Fully Funded' && e.match.eligibilityStatus === 'Eligible'
  );

  // Top ranked spotlight opportunity
  const sorted = [...evaluated]
    .filter(e => e.match.eligibilityStatus === 'Eligible')
    .sort((a, b) => b.match.matchScore - a.match.matchScore);

  const spotlight = sorted[0];
  const activePersona = profile.personas.find(p => p.id === profile.activePersonaId) || profile.personas[0];

  return (
    <div className="space-y-4">
      {/* Greeting & Executive Metric Summary */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-zinc-950 border border-zinc-800/90 shadow-xl space-y-4 sm:space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Opportunity Intelligence Brief
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Live Graph
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
              Good day, {profile.fullName.split(' ')[0]}.
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Active Persona: <strong className="text-zinc-200 font-medium">{activePersona.name}</strong> • Tracking {opportunities.length} global opportunities.
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto">
            <div className="px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Top Fit</p>
                <p className="text-xs sm:text-sm font-bold text-emerald-400 font-mono leading-tight">{topMatches.length}</p>
              </div>
            </div>

            <div className="px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
              <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Closing</p>
                <p className="text-xs sm:text-sm font-bold text-amber-300 font-mono leading-tight">{closingSoon.length}</p>
              </div>
            </div>

            <div className="px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
              <Coins className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Funded</p>
                <p className="text-xs sm:text-sm font-bold text-cyan-300 font-mono leading-tight">{fullyFunded.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Spotlight Card (Unless Dismissed) */}
        {!isDismissed && spotlight && (
          <div className="relative p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-md space-y-3 sm:space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0 pr-6 sm:pr-0">
                <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-[9px] sm:text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                  Spotlight Match
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-xs text-cyan-400 font-semibold">{spotlight.opp.category}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-xs text-zinc-400 truncate max-w-[140px] sm:max-w-none">{spotlight.opp.provider}</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-bold text-xs whitespace-nowrap">
                  {spotlight.match.matchScore}% Match
                </div>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="icon-button !w-7 !h-7 text-zinc-500 hover:text-zinc-300"
                  aria-label="Dismiss spotlight"
                  title="Dismiss spotlight"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {spotlight.opp.title}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {spotlight.opp.summary}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
                  <span className="text-cyan-300 font-medium">
                    {spotlight.opp.fundingStatus}: {spotlight.opp.fundingAmount || 'Full coverage'}
                  </span>
                  <span className="inline-block w-1 h-1 rounded-full bg-zinc-700" />
                  <span>
                    Deadline: <strong className="text-zinc-200">{new Date(spotlight.opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0">
                <button
                  onClick={(e) => onToggleSave(spotlight.opp.id, e)}
                  className={`btn !min-h-8 sm:!min-h-9 !px-3 text-xs ${
                    savedOppIds.includes(spotlight.opp.id)
                      ? 'bg-indigo-600/30 border-indigo-500 text-cyan-300'
                      : 'btn-secondary'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedOppIds.includes(spotlight.opp.id) ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => onSelectOpportunity(spotlight.opp)}
                  className="btn btn-primary !min-h-8 sm:!min-h-9 !px-3.5 text-xs flex-1 sm:flex-none justify-center"
                >
                  <span>View Match Intelligence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}