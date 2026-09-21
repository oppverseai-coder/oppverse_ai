'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Bookmark, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  ArrowRight, 
  BadgeCheck,
  LayoutGrid, 
  Binoculars,
  Coins, 
  ShieldCheck, 
  ListFilter,
  SearchX, 
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { Opportunity, UserProfile } from '@/lib/types';
import { createEmptyProfile } from '@/lib/empty-data';
import { PersonalizedMatch } from '@/lib/personalization/matching';
import OpportunityModal from '@/components/OpportunityModal';
import DailyBriefHero from '@/components/DailyBriefHero';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

type FeedShelf = 'top_matches' | 'closing_soon' | 'fully_funded' | 'serendipity' | 'all';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(() => createEmptyProfile());
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [matches, setMatches] = useState<Record<string, PersonalizedMatch>>({});
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShelf, setSelectedShelf] = useState<FeedShelf>('top_matches');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedOppIds, setSavedOppIds] = useState<string[]>(['00000000-0000-0000-0000-000000000002']);
  const [activeModalOpp, setActiveModalOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setLoadError('');
      try {
        if (!user?.id) return;
        const response = await fetch('/api/personalization/feed', { cache: 'no-store' });
        if (!response.ok) throw new Error('Your personalized opportunities could not be loaded.');
        const payload = await response.json();
        setProfile(payload.profile);
        setOpportunities(payload.results.map((item: { opportunity: Opportunity }) => item.opportunity));
        setMatches(Object.fromEntries(payload.results.map((item: { opportunity: Opportunity; match: PersonalizedMatch }) => [item.opportunity.id, item.match])));
      } catch (err) {
        console.warn('Error loading live data:', err);
        setOpportunities([]);
        setMatches({});
        setLoadError(err instanceof Error ? err.message : 'Your personalized opportunities could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const activePersona = profile.personas.find(p => p.id === profile.activePersonaId) || profile.personas[0];

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

  // Evaluate matches dynamically against active persona
  const evaluatedOpportunities = opportunities
    .filter((opp) => matches[opp.id])
    .map(opp => ({ opp, match: matches[opp.id] }))
    .filter(({ match }) => match.eligibilityStatus === 'Eligible' && match.matchScore >= 65);

  // Filter by Category
  const categoryFiltered = selectedCategory === 'All' 
    ? evaluatedOpportunities 
    : evaluatedOpportunities.filter(({ opp }) => opp.category.toLowerCase() === selectedCategory.toLowerCase());

  // Shelf-Specific Filtering Logic
  let displayList = [...categoryFiltered];

  if (selectedShelf === 'top_matches') {
    displayList = displayList.sort((a, b) => b.match.matchScore - a.match.matchScore);
  } else if (selectedShelf === 'closing_soon') {
    displayList = displayList.filter(({ opp }) => {
      const daysLeft = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysLeft > 0 && daysLeft <= 30;
    }).sort((a, b) => new Date(a.opp.deadline).getTime() - new Date(b.opp.deadline).getTime());
  } else if (selectedShelf === 'fully_funded') {
    displayList = displayList.filter(({ opp }) => 
      opp.fundingStatus === 'Fully Funded' || opp.fundingStatus === 'Grant Award'
    );
  } else if (selectedShelf === 'serendipity') {
    displayList = displayList.filter(({ opp }) => 
      opp.category === 'Speaking' || opp.category === 'Travel' || opp.category === 'Accelerators'
    );
  }

  // Top Spotlight Opportunity
  const topMatch = [...evaluatedOpportunities].sort((a, b) => b.match.matchScore - a.match.matchScore)[0]?.opp || opportunities[0];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 1. Daily Brief Executive Hero */}
      <DailyBriefHero 
        profile={profile} 
        opportunities={opportunities} 
        onInspect={(opp) => setActiveModalOpp(opp)}
        onToggleSave={handleToggleSave}
        savedOppIds={savedOppIds}
        matches={matches}
      />

      {/* 2. Curated Opportunity Universes Feed Shelves */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-white" /> Opportunity Universe Feed
            </h2>
            <p className="text-xs text-zinc-400">
              Ranked dynamically for <span className="text-white font-medium">{activePersona?.name || 'your profile'}</span>.
            </p>
          </div>

          {/* Shelf Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-zinc-950 border border-zinc-800">
            {[
              { id: 'top_matches', label: 'Best Matches', icon: BadgeCheck },
              { id: 'closing_soon', label: 'Closing Soon', icon: Clock },
              { id: 'fully_funded', label: 'Fully Funded', icon: Coins },
              { id: 'serendipity', label: 'Worth Exploring', icon: Binoculars },
              { id: 'all', label: 'All Feed', icon: LayoutGrid }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = selectedShelf === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedShelf(tab.id as FeedShelf)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'control-selected'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Category Universe Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'control-selected'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 4. Opportunity Feed Cards Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            <p className="text-xs text-zinc-500">Querying Opportunity Universe...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center">
            <p className="text-sm font-semibold text-white">Personalized feed unavailable</p>
            <p className="mt-2 text-xs text-zinc-400">{loadError}</p>
          </div>
        ) : displayList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayList.map(({ opp, match }) => {
              const isSaved = savedOppIds.includes(opp.id);
              const daysLeft = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={opp.id}
                  onClick={() => setActiveModalOpp(opp)}
                  className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer flex flex-col justify-between min-h-[300px] gap-6 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Universe Badge & Match Score */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {opp.category}
                      </span>
                      
                      {match.eligibilityStatus === 'Eligible' ? (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                          match.matchScore >= 80 
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                            : match.matchScore >= 65
                            ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                        }`}>
                          {match.matchScore}% Match
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Not Eligible
                        </span>
                      )}
                    </div>

                    {/* Opportunity Title & Provider */}
                    <div>
                      <h3 className="text-[17px] font-semibold text-white group-hover:text-zinc-200 transition-colors line-clamp-2 leading-[1.4]">
                        {opp.title}
                      </h3>
                      <p className="text-[13px] font-medium text-zinc-400 mt-1.5 flex items-center gap-1.5">
                        <span className="truncate">{opp.provider}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600 inline-block flex-shrink-0" />
                        <span className="text-zinc-500 truncate">{opp.locationType}</span>
                      </p>
                    </div>

                    {/* Summary */}
                    <p className="text-[13px] text-zinc-300 line-clamp-3 leading-5">
                      {opp.summary}
                    </p>

                    {/* Key Highlights / Funding */}
                    <div className="pt-3 border-t border-zinc-800 flex flex-wrap gap-2 text-xs">
                      <span className="text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-800">
                        {opp.fundingAmount || opp.fundingStatus}
                      </span>
                      <span className="text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-800">
                        {opp.applicationComplexity} Effort
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Rolling'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(opp.id, e)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                          isSaved
                            ? 'bg-zinc-800 border-zinc-600 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        title={isSaved ? "Saved" : "Save opportunity"}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-white' : ''}`} />
                      </button>

                      <span className="text-white group-hover:translate-x-0.5 transition-transform font-semibold text-xs flex items-center gap-0.5">
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Guided Zero State */
          <div className="p-12 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <SearchX className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-white">No matches found in this shelf</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your autonomous agent is monitoring 16 global networks for closing-soon opportunities matching <span className="text-zinc-200">{activePersona?.name || 'your profile'}</span>.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedShelf('top_matches');
                }}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors"
              >
                Reset Feed Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeModalOpp && (
        <OpportunityModal
          opportunity={activeModalOpp}
          profile={profile}
          isOpen={!!activeModalOpp}
          onClose={() => setActiveModalOpp(null)}
          onPursue={handlePursue}
        />
      )}
    </div>
  );
}



