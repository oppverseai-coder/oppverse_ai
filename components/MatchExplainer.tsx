'use client';

import React, { useState } from 'react';
import { 
  Target, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  Clock, 
  Coins, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { Opportunity, OpportunityMatch, UserProfile } from '@/lib/types';

interface MatchExplainerProps {
  opportunity: Opportunity;
  match: OpportunityMatch;
  profile: UserProfile;
  className?: string;
  showBreakdownDefault?: boolean;
}

export default function MatchExplainer({
  opportunity,
  match,
  profile,
  className = '',
  showBreakdownDefault = false
}: MatchExplainerProps) {
  const [showSubScores, setShowSubScores] = useState(showBreakdownDefault);

  const isIneligible = match.eligibilityStatus === 'Ineligible';
  const isUnclear = match.eligibilityStatus === 'Eligibility Unclear';

  // Fit score badge color mapping
  const getScoreColor = (score: number) => {
    if (isIneligible) return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
    if (score >= 90) return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    if (score >= 80) return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
    if (score >= 65) return 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40';
    return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-cyan-500';
    if (score >= 50) return 'bg-indigo-500';
    return 'bg-amber-500';
  };

  return (
    <div className={`space-y-4 text-xs ${className}`}>
      {/* 1. Header: Match Strength Score & Status */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90">
        <div className="flex items-center gap-3">
          <div className={`px-2.5 py-1.5 rounded-lg border font-bold text-sm tracking-tight flex items-center gap-1.5 ${getScoreColor(match.matchScore)}`}>
            <span>{match.matchScore}%</span>
            <span className="text-[10px] font-medium opacity-80 uppercase">Fit</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-100 text-[13px]">{match.matchLabel}</span>
              {match.eligibilityStatus === 'Eligible' && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Eligible
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Calibrated against your active <strong className="text-zinc-200">{profile.personas.find(p => p.id === profile.activePersonaId)?.name || 'Default'}</strong> profile
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-semibold">Priority</span>
          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 font-medium text-[11px] border border-zinc-700/60">
            {match.actionPriority}
          </span>
        </div>
      </div>

      {/* 2. Ineligibility / Unclear Warning Banner */}
      {isIneligible && (
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Strict Eligibility Disqualification</span>
          </div>
          <p className="text-[11px] text-rose-300/90 pl-6 leading-relaxed">
            {match.eligibilityReason || 'This opportunity has restricted nationality, education, or career prerequisites that do not match your current profile.'}
          </p>
        </div>
      )}

      {isUnclear && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 text-[11px]">Eligibility Requires Verification</p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">{match.eligibilityReason}</p>
            </div>
          </div>
          <a
            href={opportunity.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 hover:text-amber-100 underline"
          >
            <span>Verify Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* 3. Why This Matches You (3 Grounded Points) */}
      {!isIneligible && match.whyItMatches.length > 0 && (
        <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-[11px] uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Why This Matches Your Profile</span>
          </div>

          <div className="space-y-2 pt-1">
            {match.whyItMatches.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed flex-1">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Watch-Outs / Gotchas */}
      {match.watchOuts.length > 0 && (
        <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Watch-Outs &amp; Preparation Gotchas</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {match.watchOuts.map((watch, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 mt-1.5 flex-shrink-0" />
                <p className="text-xs leading-relaxed flex-1 text-zinc-300">
                  {watch}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Sub-Score Breakdown Accordion */}
      {match.subScores && (
        <div className="rounded-xl bg-zinc-950/40 border border-zinc-800/70 overflow-hidden">
          <button
            onClick={() => setShowSubScores(!showSubScores)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-[11px] font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Multi-Dimensional Fit Breakdown</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-500">
              <span>{showSubScores ? 'Hide' : 'Show'}</span>
              {showSubScores ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showSubScores && (
            <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-zinc-800/60">
              {[
                { label: 'Category & Goal Alignment (25%)', score: match.subScores.categoryFit },
                { label: 'Skills & Capability Overlap (35%)', score: match.subScores.skillsFit },
                { label: 'Seniority & Experience Fit (20%)', score: match.subScores.seniorityFit },
                { label: 'Financial & Funding Fit (10%)', score: match.subScores.financialFit },
                { label: 'Logistics & Remote Fit (10%)', score: match.subScores.logisticsFit },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>{item.label}</span>
                    <span className="font-semibold text-zinc-200">{item.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getBarColor(item.score)}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Application Readiness Summary */}
      {match.readinessDetail && (
        <div className="ranking-panel p-3.5 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-200 text-[11px]">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Application Readiness</span>
            </div>
            <span className="font-bold text-zinc-100 text-xs">{match.readinessScore}% Ready</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="progress-value transition-all duration-300"
              style={{ width: `${match.readinessScore}%` }}
            />
          </div>

          {match.readinessDetail.missingItems.length > 0 && (
            <div className="pt-1 text-[11px] text-zinc-400">
              <span className="text-zinc-500">To reach 100%: </span>
              {match.readinessDetail.missingItems.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
