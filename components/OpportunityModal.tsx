'use client';

import React from 'react';
import { 
  X, 
  ExternalLink, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Coins, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Opportunity, UserProfile } from '@/lib/types';
import { evaluateOpportunityMatch } from '@/lib/matching';
import MatchExplainer from '@/components/MatchExplainer';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 animate-fadeIn">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-modal-title"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="icon-button absolute right-6 top-6"
          aria-label="Close opportunity details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Opportunity Header */}
        <div className="space-y-3 pr-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="badge uppercase tracking-wider">
              {opportunity.category}
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-zinc-600 mx-1" />
            <span className="text-xs font-semibold text-zinc-400">
              {opportunity.provider}
            </span>
            <span className="badge badge-success">
              <ShieldCheck className="w-3.5 h-3.5" /> {opportunity.verificationStatus}
            </span>
          </div>

          <h2 id="opportunity-modal-title" className="text-2xl font-semibold font-display text-white leading-tight">
            {opportunity.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-4 h-4 text-indigo-400" />
              {opportunity.locationType} {opportunity.hostCity ? `(${opportunity.hostCity}, ${opportunity.hostCountry})` : ''}
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
              <Coins className="w-4 h-4 text-cyan-400" />
              {opportunity.fundingStatus}: {opportunity.fundingAmount || 'Standard Compensation'}
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Clock className="w-4 h-4 text-amber-400" />
              Deadline: {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Explainable Match & Strict Eligibility Section */}
        <MatchExplainer 
          opportunity={opportunity}
          match={match}
          profile={profile}
          showBreakdownDefault={true}
        />

        {/* Opportunity Overview & Requirements */}
        <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-1.5">Overview & Description</h4>
            <p className="text-zinc-400 leading-relaxed">{opportunity.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" /> Required Documents
              </h5>
              <ul className="space-y-1 text-zinc-400">
                {opportunity.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Eligibility
              </h5>
              <p className="text-zinc-300">
                Nationalities: <span className="text-emerald-400 font-semibold">{opportunity.eligibleNationalities.join(', ')}</span>
              </p>
              <p className="text-zinc-400 mt-1">
                Experience: {opportunity.experienceRequired || 'All levels considered'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
          <a
            href={opportunity.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-full sm:w-auto"
          >
            Visit Official Source <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onPursue(opportunity)}
              disabled={match.eligibilityStatus === 'Ineligible'}
              className={`btn w-full sm:w-auto ${
                match.eligibilityStatus === 'Ineligible' 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                  : 'btn-primary'
              }`}
            >
              {match.eligibilityStatus === 'Ineligible' 
                ? 'Ineligible to Apply' 
                : isPursued ? 'View in Applications Workspace' : 'Pursue Opportunity & Build Workspace'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
