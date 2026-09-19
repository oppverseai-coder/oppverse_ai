'use client';

import React from 'react';
import { 
  X, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Zap, 
  ArrowRight,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Opportunity, OpportunityMatch, UserProfile } from '@/lib/types';
import { evaluateOpportunityMatch } from '@/lib/matching';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPursue: (opp: Opportunity) => void;
  isPursued?: boolean;
}

export default function OpportunityModal({
  opportunity,
  profile,
  isOpen,
  onClose,
  onPursue,
  isPursued = false
}: OpportunityModalProps) {
  if (!isOpen || !opportunity) return null;

  const match = evaluateOpportunityMatch(profile, opportunity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Opportunity Header */}
        <div className="space-y-3 pr-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider">
              {opportunity.category}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-semibold text-slate-400">
              {opportunity.provider}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {opportunity.verificationStatus}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold font-display text-white">
            {opportunity.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-4 h-4 text-indigo-400" />
              {opportunity.locationType} {opportunity.hostCity ? `(${opportunity.hostCity}, ${opportunity.hostCountry})` : ''}
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
              <Zap className="w-4 h-4 text-cyan-400" />
              {opportunity.fundingStatus}: {opportunity.fundingAmount || 'Standard Compensation'}
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              Deadline: {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Match & Readiness Intelligence Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-slate-900/90 border border-indigo-500/30">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Match Fit Assessment</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {match.matchScore}% • {match.matchLabel}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" 
                style={{ width: `${match.matchScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300">
              Priority: <span className="font-bold text-cyan-300">{match.actionPriority}</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Application Readiness</span>
              <span className="text-xs font-bold text-cyan-400 font-mono">
                {match.readinessScore}% Ready
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" 
                style={{ width: `${match.readinessScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Ready: <span className="text-slate-300">CV, Bio, Work History</span>
            </p>
          </div>
        </div>

        {/* Why Oppverse Thinks You Should Pursue This */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Why Oppverse Recommends This For You
          </h3>
          <ul className="space-y-2">
            {match.whyItMatches.map((reason, i) => (
              <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
            {match.watchOuts.map((watch, i) => (
              <li key={i} className="text-xs text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{watch}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunity Overview & Requirements */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-1.5">Overview & Description</h4>
            <p className="text-slate-400 leading-relaxed">{opportunity.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" /> Required Documents
              </h5>
              <ul className="space-y-1 text-slate-400">
                {opportunity.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Eligibility
              </h5>
              <p className="text-slate-300">
                Nationalities: <span className="text-emerald-400 font-semibold">{opportunity.eligibleNationalities.join(', ')}</span>
              </p>
              <p className="text-slate-400 mt-1">
                Experience: {opportunity.experienceRequired || 'All levels considered'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <a
            href={opportunity.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            Visit Official Source <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onPursue(opportunity)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isPursued ? 'View in Applications Workspace' : 'Pursue Opportunity & Build Workspace'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
