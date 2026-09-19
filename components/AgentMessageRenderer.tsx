'use client';

import React from 'react';
import { 
  Clock, 
  ArrowUpRight, 
  Coins, 
  ChevronRight
} from 'lucide-react';

interface AgentMessageRendererProps {
  content: string;
  onActionClick?: (actionText: string) => void;
}

// Inline formatting helper for bold, code, and links
function formatInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-semibold text-white tracking-tight">
          {boldText}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1);
      parts.push(
        <em key={match.index} className="italic text-zinc-300">
          {italicText}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeText = token.slice(1, -1);
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 font-mono text-[11px] text-cyan-300">
          {codeText}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

interface ParsedOpportunityCard {
  indexNumber?: string;
  title: string;
  provider?: string;
  fitScore?: string;
  funding?: string;
  deadline?: string;
  details: string[];
}

export default function AgentMessageRenderer({ content, onActionClick }: AgentMessageRendererProps) {
  // Split content into major blocks (paragraphs, numbered items, questions)
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-3 text-xs text-zinc-200 leading-relaxed font-sans">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Check if the block is a structured numbered opportunity item list (e.g., "1. **Title** (Provider)...")
        const isOpportunityBlock = /^\d+\.\s+\*\*([^*]+)\*\*/.test(trimmed);

        if (isOpportunityBlock) {
          return renderOpportunityBlock(trimmed, bIdx, onActionClick);
        }

        // Check if the block is a follow-up action question
        const isFollowUpQuestion = (trimmed.toLowerCase().startsWith('would you like') || trimmed.toLowerCase().startsWith('should i')) && trimmed.endsWith('?');

        if (isFollowUpQuestion) {
          return (
            <div 
              key={bIdx}
              className="mt-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2.5"
            >
              <p className="font-medium text-zinc-100 leading-snug">
                {formatInlineText(trimmed)}
              </p>

              {onActionClick && (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <button
                    onClick={() => onActionClick(trimmed.replace(/^Would you like me to\s+/i, 'Yes, '))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white text-[11px] font-semibold transition-all shadow-sm active:scale-95"
                  >
                    <span>Yes, proceed</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onActionClick("Show me more details on these")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700 hover:text-white text-[11px] font-medium border border-zinc-700/60 transition-all"
                  >
                    <span>Compare all three</span>
                  </button>
                </div>
              )}
            </div>
          );
        }

        // Check if block contains bullet items
        const lines = trimmed.split('\n');
        const hasBullets = lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('- ') || line.trim().startsWith('* '));

        if (hasBullets) {
          return (
            <div key={bIdx} className="space-y-1.5 my-2">
              {lines.map((line, lIdx) => {
                const lineTrim = line.trim();
                const isBullet = lineTrim.startsWith('•') || lineTrim.startsWith('- ') || lineTrim.startsWith('* ');
                const cleanLine = isBullet ? lineTrim.replace(/^[•\-\*]\s*/, '') : lineTrim;

                if (!isBullet) {
                  return (
                    <p key={lIdx} className="text-zinc-200">
                      {formatInlineText(lineTrim)}
                    </p>
                  );
                }

                return (
                  <div key={lIdx} className="flex items-start gap-2.5 pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
                    <span className="text-zinc-300 flex-1 leading-normal">
                      {formatInlineText(cleanLine)}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        }

        // Standard narrative paragraph
        return (
          <p key={bIdx} className="text-zinc-200 leading-relaxed">
            {formatInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper to parse and render structured opportunity items as polished cards
function renderOpportunityBlock(blockText: string, blockIdx: number, onActionClick?: (actionText: string) => void) {
  const lines = blockText.split('\n');
  const items: ParsedOpportunityCard[] = [];
  let currentCard: ParsedOpportunityCard | null = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Match header like "1. **Berlin AI & Emerging Tech Leadership Fellowship** (Bosch & Techstars)"
    const headerMatch = trimmed.match(/^(\d+)\.\s+\*\*([^*]+)\*\*(?:\s+\(([^)]+)\))?/);
    if (headerMatch) {
      if (currentCard) items.push(currentCard);
      currentCard = {
        indexNumber: headerMatch[1],
        title: headerMatch[2],
        provider: headerMatch[3] || undefined,
        details: []
      };
      return;
    }

    if (currentCard) {
      // Check for Fit metric: "• Fit: 94% Match (Fully Funded: €4,200/mo + Flights + Housing)"
      const fitMatch = trimmed.match(/Fit:\s*([0-9]+%\s*Match)(?:\s*\(([^)]+)\))?/i) || trimmed.match(/Fit:\s*([^•\n]+)/i);
      if (fitMatch) {
        currentCard.fitScore = fitMatch[1];
        if (fitMatch[2]) {
          currentCard.funding = fitMatch[2];
        }
        return;
      }

      // Check for Deadline metric: "• Deadline: October 8, 2026"
      const deadlineMatch = trimmed.match(/Deadline:\s*([^•\n]+)/i);
      if (deadlineMatch) {
        currentCard.deadline = deadlineMatch[1].trim();
        return;
      }

      // Otherwise general detail
      const cleanDetail = trimmed.replace(/^[•\-\*]\s*/, '');
      currentCard.details.push(cleanDetail);
    }
  });

  if (currentCard) {
    items.push(currentCard);
  }

  if (items.length === 0) {
    return (
      <div key={blockIdx} className="p-3">
        {formatInlineText(blockText)}
      </div>
    );
  }

  return (
    <div key={blockIdx} className="space-y-3 my-2">
      {items.map((item, iIdx) => (
        <div
          key={iIdx}
          className="opportunity-card group relative p-4 rounded-xl border transition-all duration-150 space-y-3"
        >
          {/* Header with Title & Provider */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {item.indexNumber && (
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700/80 text-zinc-300 font-semibold text-[10px] flex items-center justify-center mt-0.5">
                  {item.indexNumber}
                </span>
              )}
              <div>
                <h4 className="font-semibold text-zinc-100 text-sm leading-snug group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                {item.provider && (
                  <p className="text-[11px] font-medium text-zinc-400 mt-0.5">
                    {item.provider}
                  </p>
                )}
              </div>
            </div>

            {/* Fit Badge */}
            {item.fitScore && (
              <div className="match-badge flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{item.fitScore}</span>
              </div>
            )}
          </div>

          {/* Key Metrics Pill Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {item.funding && (
              <div className="metadata-chip flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                <Coins className="w-3.5 h-3.5" />
                <span>{item.funding}</span>
              </div>
            )}

            {item.deadline && (
              <div className="metadata-chip flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Deadline: <strong className="text-zinc-100 font-medium">{item.deadline}</strong></span>
              </div>
            )}
          </div>

          {/* Other Bullet Details if any */}
          {item.details.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-zinc-800/50">
              {item.details.map((detail, dIdx) => (
                <div key={dIdx} className="flex items-start gap-2 text-[11px] text-zinc-400">
                  <span className="w-1 h-1 rounded-full bg-zinc-500 mt-1.5" />
                  <span>{formatInlineText(detail)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Action Button */}
          {onActionClick && (
            <div className="flex items-center justify-end pt-1">
              <button
                onClick={() => onActionClick(`Generate checklist for ${item.title}`)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <span>Prepare application</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
