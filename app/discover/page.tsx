'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  Bookmark, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  ArrowRight,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import { Opportunity, UserProfile } from '@/lib/types';
import { createEmptyProfile } from '@/lib/empty-data';
import { PersonalizedMatch } from '@/lib/personalization/matching';
import OpportunityModal from '@/components/OpportunityModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

function decodeDisplayText(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export default function DiscoverPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(() => createEmptyProfile());
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [matches, setMatches] = useState<Record<string, PersonalizedMatch>>({});
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFunding, setSelectedFunding] = useState<string>('All');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(['opp_002', 'opp_007']);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setLoadError('');
      try {
        if (!user?.id) return;
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.set('category', selectedCategory);
        const response = await fetch(`/api/personalization/feed?${params.toString()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Verified opportunities could not be loaded.');
        const payload = await response.json();
        setProfile(payload.profile);
        setOpportunities(payload.results.map((item: { opportunity: Opportunity }) => item.opportunity));
        setMatches(Object.fromEntries(payload.results.map((item: { opportunity: Opportunity; match: PersonalizedMatch }) => [item.opportunity.id, item.match])));
      } catch (err) {
        console.warn('Error fetching discover data:', err);
        setOpportunities([]);
        setMatches({});
        setLoadError(err instanceof Error ? err.message : 'Verified opportunities could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, user?.id]);

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

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesFunding = selectedFunding === 'All' || opp.fundingStatus === selectedFunding;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.description && opp.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesFunding && matchesSearch;
  });

  const handleOpenDetail = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setIsModalOpen(true);
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedOppIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePursue = (opp: Opportunity) => {
    setIsModalOpen(false);
    router.push('/applications');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="icon-frame">
            <Compass className="icon-md" />
          </div>
          <div>
            <h1 className="page-title font-display">
              Discover Global Opportunities
            </h1>
            <p className="page-description">
              Explore verified opportunities across all 8 universes, pre-screened for your profile.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, titles, companies, or countries (e.g. AI, Berlin, Synthesia)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
            >
              <option value="All">All Funding Types</option>
              <option value="Fully Funded">Fully Funded Only</option>
              <option value="Paid">Paid Roles</option>
              <option value="Grant Award">Grants</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn !min-h-8 whitespace-nowrap ${
                selectedCategory === cat
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {cat === 'All' && <LayoutGrid className="icon-xs" />}
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>Showing <strong className="text-white">{filteredOpportunities.length}</strong> opportunities</span>
          <span>Ranked by profile relevance</span>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-xs">Loading verified opportunities...</span>
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center">
            <p className="text-sm font-semibold text-white">Discover is temporarily unavailable</p>
            <p className="mt-2 text-xs text-zinc-400">{loadError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredOpportunities.map((opp) => {
              const match = matches[opp.id];
              if (!match) return null;
              const isSaved = savedOppIds.includes(opp.id);
              const isIneligible = match.eligibilityStatus === 'Ineligible';

              return (
                <div
                  key={opp.id}
                  onClick={() => handleOpenDetail(opp)}
                  className={`opportunity-card glass-card p-5 sm:p-6 rounded-xl border cursor-pointer flex flex-col justify-between min-h-[278px] gap-6 group transition-all duration-200 ${
                    isIneligible ? 'border-rose-900/40 bg-rose-950/10' : ''
                  }`}
                >
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 flex-[0_0_36px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-semibold text-white">
                          {opp.provider.trim().charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-zinc-200">
                            {decodeDisplayText(opp.provider)}
                          </p>
                          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                            {opp.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-[74px] text-right">
                          <p className="text-sm font-semibold text-white">{match.matchScore}% fit</p>
                          <div className="mt-1.5 ml-auto h-1 w-14 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className="h-full rounded-full bg-zinc-300"
                              style={{ width: `${Math.max(8, match.matchScore)}%` }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleToggleSave(opp.id, e)}
                          className={`icon-button !w-8 !h-8 !min-h-0 !flex-[0_0_32px] ${
                            isSaved 
                              ? 'bg-indigo-600/30 border-indigo-500 text-cyan-400' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                          aria-label="Save opportunity"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[18px] font-semibold text-white group-hover:text-zinc-200 transition-colors leading-7 line-clamp-2">
                        {decodeDisplayText(opp.title)}
                      </h3>

                      <p className="text-[13px] text-zinc-400 mt-2 line-clamp-2 leading-5">
                        {decodeDisplayText(opp.summary)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-zinc-800/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {opp.locationType}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-zinc-500" />
                        {opp.fundingStatus}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    </div>

                    <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-white group-hover:translate-x-0.5 transition-transform">
                      View details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Opportunity Detail Modal */}
      <OpportunityModal
        opportunity={selectedOpp}
        profile={profile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPursue={handlePursue}
      />
    </div>
  );
}
