'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Bookmark, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  ArrowRight,
  LayoutGrid
} from 'lucide-react';
import { initialProfile, sampleOpportunities } from '@/lib/sample-data';
import { evaluateOpportunityMatch } from '@/lib/matching';
import { Opportunity } from '@/lib/types';
import OpportunityModal from '@/components/OpportunityModal';
import { useRouter } from 'next/navigation';

export default function DiscoverPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFunding, setSelectedFunding] = useState<string>('All');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(['opp_002', 'opp_007']);

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
  const fundingTypes = ['All', 'Fully Funded', 'Paid', 'Grant Award'];

  const filteredOpportunities = sampleOpportunities.filter(opp => {
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesFunding = selectedFunding === 'All' || opp.fundingStatus === selectedFunding;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp) => {
            const match = evaluateOpportunityMatch(initialProfile, opp);
            const isSaved = savedOppIds.includes(opp.id);
            const isIneligible = match.eligibilityStatus === 'Ineligible';

            return (
              <div
                key={opp.id}
                onClick={() => handleOpenDetail(opp)}
                className={`opportunity-card glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border cursor-pointer flex flex-col justify-between space-y-4 group transition-all duration-200 ${
                  isIneligible ? 'border-rose-900/40 bg-rose-950/10' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        {opp.category}
                      </span>
                      <span className="inline-block w-1 h-1 rounded-full bg-zinc-600 mx-1" />
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
                        <Bookmark className="w-4 h-4" />
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

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span className="metadata-chip px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    {opp.locationType}
                  </span>
                  <span className="metadata-chip px-2 py-0.5 rounded-md">
                    <Coins className="w-3 h-3 text-cyan-400 inline mr-1" />
                    {opp.fundingStatus}
                  </span>
                  <span className="metadata-chip px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      <OpportunityModal
        opportunity={selectedOpp}
        profile={initialProfile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPursue={handlePursue}
      />
    </div>
  );
}
