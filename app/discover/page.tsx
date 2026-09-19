'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  Bookmark, 
  ExternalLink, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import { initialProfile, sampleOpportunities } from '@/lib/sample-data';
import { evaluateOpportunityMatch } from '@/lib/matching';
import { Opportunity, OpportunityCategory } from '@/lib/types';
import OpportunityModal from '@/components/OpportunityModal';
import { useRouter } from 'next/navigation';

export default function DiscoverPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFunding, setSelectedFunding] = useState<string>('All');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedOppIds, setSavedOppIds] = useState<string[]>(['opp_002']);

  const categories = ['All', 'Jobs', 'Fellowships', 'Scholarships', 'Grants', 'Speaking', 'Travel', 'Accelerators'];
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-indigo-400 flex items-center justify-center shadow-glow">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white">
              Discover Global Opportunities
            </h1>
            <p className="text-sm text-slate-400">
              Explore verified opportunities across 16 categories, pre-screened for African eligibility.
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> 100% Primary Verified Sources
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, provider, skills (e.g. AI, Product Marketing, Oxford)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input placeholder:text-slate-500"
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
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glow'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat === 'All' ? '🌐 All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing <strong className="text-white">{filteredOpportunities.length}</strong> opportunities</span>
          <span>Ranked by profile relevance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp) => {
            const match = evaluateOpportunityMatch(initialProfile, opp);
            const isSaved = savedOppIds.includes(opp.id);

            return (
              <div
                key={opp.id}
                onClick={() => handleOpenDetail(opp)}
                className="glass-card p-6 rounded-2xl border border-slate-800/80 cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        {opp.category}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {opp.provider}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        match.matchScore >= 85
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      }`}>
                        {match.matchScore}% Match
                      </span>
                      <button
                        onClick={(e) => handleToggleSave(opp.id, e)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isSaved 
                            ? 'bg-indigo-600/30 border-indigo-500 text-cyan-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {opp.summary}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {opp.locationType}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-300">
                    {opp.fundingStatus}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunity Detail Intelligence Modal */}
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
