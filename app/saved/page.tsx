'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, ExternalLink, ArrowRight, MapPin, Clock, Loader2 } from 'lucide-react';
import { sampleOpportunities } from '@/lib/sample-data';
import { Opportunity } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { fetchOpportunities } from '@/lib/supabase/db';

export default function SavedPage() {
  const { user } = useAuth();
  const [savedOpps, setSavedOpps] = useState<Opportunity[]>(sampleOpportunities.slice(0, 2));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      setLoading(true);
      try {
        const opps = await fetchOpportunities();
        if (opps && opps.length > 0) {
          setSavedOpps(opps.slice(0, 3));
        }
      } catch (e) {
        console.warn('Error loading saved opportunities:', e);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, [user?.id]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="icon-frame">
            <Bookmark className="icon-md" />
          </div>
          <div>
            <h1 className="page-title font-display">
              Saved Opportunities ({savedOpps.length})
            </h1>
            <p className="page-description">
              Opportunities you are considering for future applications.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <span className="text-xs">Loading saved opportunities...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedOpps.map((opp) => (
            <div key={opp.id} className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-800 space-y-4">
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
                  className="btn btn-primary"
                >
                  Pursue <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
