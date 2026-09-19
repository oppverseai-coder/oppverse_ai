'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Bookmark, 
  Clock, 
  MapPin, 
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  Compass,
  Coins,
  ShieldCheck,
  Zap,
  SearchX,
  SlidersHorizontal
} from 'lucide-react';
import { initialProfile, sampleOpportunities } from '@/lib/sample-data';
import { evaluateOpportunityMatch } from '@/lib/matching';
import { Opportunity } from '@/lib/types';
import OpportunityModal from '@/components/OpportunityModal';
import DailyBriefHero from '@/components/DailyBriefHero';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FeedShelf = 'top_matches' | 'closing_soon' | 'fully_funded' | 'serendipity' | 'all';

export default function HomePage() {
  const router = useRouter();
  const [selectedShelf, setSelectedShelf] = useState<FeedShelf>('top_matches');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedOppIds, setSavedOppIds] = useState<string[]>(['opp_002', 'opp_007']);
  const [activeModalOpp, setActiveModalOpp] = useState<Opportunity | null>(null);

  // All 8 Core Opportunity Universes
  const categories = [
    'All', 
    'Jobs', 
    'Fellowships', 
    'Scholarships', 
    'Grants', 
    'Conferences', 
    'Speaking', 
    'Travel', 
    'Accelerators'
  ];

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedOppIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePursue = (opp: Opportunity) => {
    setActiveModalOpp(null);
    router.push('/applications');
  };

  // Evaluate matches
  const evaluatedOpps = sampleOpportunities.map(opp => ({
    opp,
    match: evaluateOpportunityMatch(initialProfile, opp)
  }));

  const now = new Date();

  // Shelf filtering logic
  let shelfFiltered = evaluatedOpps.filter(({ opp, match }) => {
    // Category universe filter
    if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
      return false;
    }

    if (selectedShelf === 'top_matches') {
      return match.matchScore >= 80;
    }

    if (selectedShelf === 'closing_soon') {
      const diffDays = Math.ceil((new Date(opp.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 14;
    }

    if (selectedShelf === 'fully_funded') {
      return opp.fundingStatus === 'Fully Funded' || opp.fundingStatus === 'Grant Award';
    }

    if (selectedShelf === 'serendipity') {
      return opp.isSerendipity || opp.category === 'Speaking' || opp.category === 'Travel';
    }

    return true;
  });

  // Sort shelf filtered items: Eligible high-scores first
  shelfFiltered.sort((a, b) => {
    if (a.match.eligibilityStatus === 'Ineligible' && b.match.eligibilityStatus !== 'Ineligible') return 1;
    if (a.match.eligibilityStatus !== 'Ineligible' && b.match.eligibilityStatus === 'Ineligible') return -1;
    return b.match.matchScore - a.match.matchScore;
  });

  const shelfTabs = [
    { id: 'top_matches' as FeedShelf, label: 'Best Matches', icon: TrendingUp, iconColor: 'text-indigo-400' },
    { id: 'closing_soon' as FeedShelf, label: 'Closing Soon', icon: Clock, iconColor: 'text-amber-400' },
    { id: 'fully_funded' as FeedShelf, label: 'Fully Funded', icon: Coins, iconColor: 'text-cyan-400' },
    { id: 'serendipity' as FeedShelf, label: 'Serendipity Discovery', icon: Compass, iconColor: 'text-emerald-400' },
    { id: 'all' as FeedShelf, label: 'All Feed', icon: LayoutGrid, iconColor: 'text-zinc-400' },
  ];

  const currentShelfLabel = shelfTabs.find(t => t.id === selectedShelf)?.label || 'Selected Shelf';

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Daily Opportunity Brief Hero */}
      <DailyBriefHero
        profile={initialProfile}
        opportunities={sampleOpportunities}
        onInspect={(opp) => setActiveModalOpp(opp)}
        onPursue={handlePursue}
        savedOppIds={savedOppIds}
        onToggleSave={handleToggleSave}
      />

      {/* Shelf Switcher Tabs & Category Filters */}
      <div className="space-y-4 pt-2">
        {/* Curated Shelf Tabs (Pure Lucide Icons, No Emojis) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-800/80 no-scrollbar">
          {shelfTabs.map((shelf) => {
            const Icon = shelf.icon;
            const isSelected = selectedShelf === shelf.id;
            return (
              <button
                key={shelf.id}
                onClick={() => setSelectedShelf(shelf.id)}
                className={`filter-button ${
                  isSelected
                    ? 'filter-button-active'
                    : ''
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-950' : shelf.iconColor}`} />
                <span>{shelf.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Universe Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn whitespace-nowrap !min-h-8 !px-3 text-xs ${
                selectedCategory === cat
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {cat === 'All' && <LayoutGrid className="icon-xs" />}
              {cat === 'All' ? 'All Universes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Feed Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="section-title font-display flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Opportunities in this Shelf</span>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-mono font-normal">
              {shelfFiltered.length}
            </span>
          </h2>
          <span className="text-xs text-zinc-400">Ranked by Explainable Fit</span>
        </div>

        {shelfFiltered.length === 0 ? (
          /* Senior Anti-Slop Empty State */
          <div className="p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-zinc-400">
                <SearchX className="w-5 h-5 text-zinc-400" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-100">
                  No opportunities active in {selectedCategory !== 'All' ? `"${selectedCategory}"` : 'this universe'} under {currentShelfLabel}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  {selectedCategory !== 'All' 
                    ? `No opportunities currently match both the "${selectedCategory}" category and the "${currentShelfLabel}" filter criteria.`
                    : `No opportunities currently meet the strict criteria for the "${currentShelfLabel}" shelf.`}
                </p>
              </div>
            </div>

            {/* Contextual Action Cues */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-zinc-800/60 pl-0 sm:pl-13.5">
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="btn btn-secondary !min-h-8 !px-3 text-xs"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Show all universes for {currentShelfLabel}</span>
                </button>
              )}

              {selectedShelf !== 'all' && (
                <button
                  onClick={() => setSelectedShelf('all')}
                  className="btn btn-secondary !min-h-8 !px-3 text-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>View all {selectedCategory !== 'All' ? selectedCategory : 'opportunities'}</span>
                </button>
              )}

              <Link
                href="/missions"
                className="btn btn-primary !min-h-8 !px-3 text-xs"
              >
                <span>Launch Autonomous Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shelfFiltered.map(({ opp, match }) => {
              const isSaved = savedOppIds.includes(opp.id);
              const isIneligible = match.eligibilityStatus === 'Ineligible';

              return (
                <div 
                  key={opp.id}
                  onClick={() => setActiveModalOpp(opp)}
                  className={`opportunity-card glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 ${
                    isIneligible 
                      ? 'border-rose-900/40 bg-rose-950/10' 
                      : ''
                  }`}
                >
                  {/* Header: Provider & Match Pill */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                          {opp.category}
                        </span>
                        <span className="inline-block w-1 h-1 rounded-full bg-zinc-600" />
                        <span className="text-xs text-zinc-400 font-medium">
                          {opp.provider}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          isIneligible
                            ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                            : match.matchScore >= 80
                            ? 'match-badge'
                            : 'match-badge-neutral'
                        }`}>
                          {match.matchScore}% Match
                        </span>

                        <button
                          onClick={(e) => handleToggleSave(opp.id, e)}
                          className={`icon-button !w-8 !h-8 !min-h-0 !flex-[0_0_32px] ${
                            isSaved 
                              ? 'bg-indigo-600/30 border-indigo-500 text-cyan-400' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                          aria-label="Save opportunity"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors">
                      {opp.title}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {opp.summary}
                    </p>
                  </div>

                  {/* Explainable "Why This Matches You" Box */}
                  <div className={`p-3.5 rounded-xl border space-y-2 ${
                    isIneligible 
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' 
                      : 'ranking-panel'
                  }`}>
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className={`flex items-center gap-1.5 ${
                        isIneligible ? 'text-rose-400' : 'text-zinc-300'
                      }`}>
                        {isIneligible ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : (
                          <Target className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        {isIneligible ? 'Eligibility Gate:' : 'Why Oppverse Ranked This:'}
                      </span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                        isIneligible 
                          ? 'bg-rose-950/50 border-rose-500/40 text-rose-300' 
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      }`}>
                        {match.actionPriority}
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {match.whyItMatches.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="text-[11px] text-zinc-300 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metadata Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 pt-1">
                    <span className="metadata-chip px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      {opp.locationType} {opp.hostCity ? `(${opp.hostCity})` : ''}
                    </span>
                    <span className="metadata-chip px-2.5 py-1 rounded-lg font-medium">
                      {opp.fundingStatus} {opp.fundingAmount ? `• ${opp.fundingAmount}` : ''}
                    </span>
                    <span className="metadata-chip px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                    <div className="text-[11px] text-zinc-400">
                      Effort: <span className="text-zinc-200 font-medium">{opp.applicationComplexity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalOpp(opp);
                        }}
                        className="btn btn-secondary !min-h-8 !px-3 text-xs"
                      >
                        Inspect Match
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isIneligible) handlePursue(opp);
                        }}
                        disabled={isIneligible}
                        className={`btn !min-h-8 !px-3 text-xs ${
                          isIneligible
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                            : 'btn-primary'
                        }`}
                      >
                        {isIneligible ? 'Ineligible' : 'Pursue'} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Opportunity Detail & Explainable Match Modal */}
      <OpportunityModal
        opportunity={activeModalOpp}
        profile={initialProfile}
        isOpen={!!activeModalOpp}
        onClose={() => setActiveModalOpp(null)}
        onPursue={handlePursue}
      />
    </div>
  );
}
