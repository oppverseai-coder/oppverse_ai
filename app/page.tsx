'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  Bookmark, 
  ExternalLink, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  ShieldCheck, 
  Filter,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { initialProfile, sampleOpportunities } from '@/lib/sample-data';
import { evaluateOpportunityMatch } from '@/lib/matching';
import { Opportunity, OpportunityCategory } from '@/lib/types';
import Link from 'next/link';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedOppIds, setSavedOppIds] = useState<string[]>(['opp_002']);

  const categories = ['All', 'Jobs', 'Fellowships', 'Scholarships', 'Grants', 'Speaking', 'Travel'];

  const handleToggleSave = (id: string) => {
    setSavedOppIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredOpportunities = sampleOpportunities.filter(opp => {
    if (selectedCategory === 'All') return true;
    return opp.category === selectedCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Signature Daily Opportunity Brief Hero Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-cyan-950/60 border border-indigo-500/30 shadow-glow overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Your Daily Opportunity Brief • 19 September 2026
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
            Good morning, Tomide. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-white bg-clip-text text-transparent">
              We found 28 new opportunities.
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Based on your active <span className="text-cyan-300 font-semibold">Product Marketing & AI GTM profile</span>, 3 opportunities have strong strategic fit and verified Nigerian eligibility today.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" /> 3 Strong Matches
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
              <Zap className="w-4 h-4" /> 2 Fully Funded Programs
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <Clock className="w-4 h-4" /> 1 Closes in 11 Days
            </div>
          </div>
        </div>
      </div>

      {/* Category Universe Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glow'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat === 'All' ? '🌌 All Universes' : cat}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Curated Opportunity Feed ({filteredOpportunities.length})
          </h2>
          <span className="text-xs text-slate-500">Ranked by Explainable Fit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp) => {
            const match = evaluateOpportunityMatch(initialProfile, opp);
            const isSaved = savedOppIds.includes(opp.id);

            return (
              <div 
                key={opp.id}
                className="glass-card p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-5"
              >
                {/* Header: Provider & Match Pill */}
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
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        match.matchScore >= 85
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      }`}>
                        {match.matchLabel} ({match.matchScore}%)
                      </span>
                      <button
                        onClick={() => handleToggleSave(opp.id)}
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

                {/* Explainable "Why This Matches You" Box */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5" /> Why Oppverse Ranked This:
                    </span>
                    <span className="text-emerald-400 font-mono">{match.actionPriority}</span>
                  </div>
                  <ul className="space-y-1">
                    {match.whyItMatches.map((reason, idx) => (
                      <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {opp.locationType} {opp.hostCity ? `(${opp.hostCity})` : ''}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-medium">
                    {opp.fundingStatus} {opp.fundingAmount ? `• ${opp.fundingAmount}` : ''}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400">
                    Effort: <span className="text-slate-200 font-medium">{opp.applicationComplexity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={opp.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                    <Link
                      href="/profile"
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-glow flex items-center gap-1.5 transition-all"
                    >
                      Pursue <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
