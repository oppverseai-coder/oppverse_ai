'use client';

import React from 'react';
import { Bookmark, ExternalLink, ArrowRight, MapPin, Clock } from 'lucide-react';
import { sampleOpportunities, initialProfile } from '@/lib/sample-data';
import Link from 'next/link';

export default function SavedPage() {
  const savedOpps = sampleOpportunities.slice(0, 2);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-glow">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white">
              Saved Opportunities ({savedOpps.length})
            </h1>
            <p className="text-sm text-slate-400">
              Opportunities you are considering for future applications.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedOpps.map((opp) => (
          <div key={opp.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{opp.category}</span>
              <span className="text-xs text-emerald-400 font-semibold">{opp.fundingStatus}</span>
            </div>

            <h3 className="text-base font-bold text-white">{opp.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{opp.summary}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <Link
                href="/applications"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-glow flex items-center gap-1.5"
              >
                Pursue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
