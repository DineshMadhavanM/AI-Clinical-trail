import React from 'react';
import { MapPin, Building2, UserCheck, Calendar, ArrowRight, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { ClinicalTrial } from '../../types';

interface TrialCardProps {
  trial: ClinicalTrial;
  matchScore?: number;
  eligibilityStatus?: string;
  onSelect?: (trial: ClinicalTrial) => void;
  onOpenRAG?: (trial: ClinicalTrial) => void;
}

export const TrialCard: React.FC<TrialCardProps> = ({
  trial,
  matchScore,
  eligibilityStatus,
  onSelect,
  onOpenRAG,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recruiting':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
      case 'active':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getMatchBadge = (status?: string) => {
    switch (status) {
      case 'LIKELY_MATCH':
        return { label: 'Likely Match', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'POSSIBLE_MATCH':
        return { label: 'Possible Match', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'NEEDS_REVIEW':
        return { label: 'Needs Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'UNLIKELY_MATCH':
        return { label: 'Unlikely Match', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      default:
        return null;
    }
  };

  const matchInfo = getMatchBadge(eligibilityStatus);

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all hover:shadow-cyan-950/20 flex flex-col justify-between space-y-4 group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-semibold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
              {trial.id}
            </span>
            <span className="text-[11px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {trial.phase}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getStatusBadge(trial.status)}`}>
              {trial.status}
            </span>
          </div>

          {matchScore !== undefined && (
            <div className="flex items-center gap-2">
              {matchInfo && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${matchInfo.color}`}>
                  {matchInfo.label}
                </span>
              )}
              <div className="text-right">
                <span className="text-base font-extrabold text-cyan-400">{(matchScore * 100).toFixed(0)}%</span>
                <span className="text-[10px] text-slate-400 block font-medium">Match Score</span>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect && onSelect(trial)}
          className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2"
        >
          {trial.title}
        </h3>

        {/* Primary Condition */}
        <div className="mt-2 text-xs font-semibold text-cyan-400">
          Target Condition: <span className="text-slate-200">{trial.condition}</span>
        </div>

        {/* Brief Summary */}
        {trial.brief_summary && (
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {trial.brief_summary}
          </p>
        )}
      </div>

      {/* Meta Specs */}
      <div className="border-t border-slate-800/80 pt-3 space-y-2 text-xs text-slate-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Age: {trial.min_age} - {trial.max_age} yrs | Gender: {trial.gender_requirement}</span>
          </div>
          {trial.sponsor && (
            <div className="flex items-center gap-1 text-slate-400 truncate max-w-[150px]">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{trial.sponsor}</span>
            </div>
          )}
        </div>

        {trial.locations && trial.locations.length > 0 && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span className="truncate">
              Sites: {trial.locations.map((l) => `${l.city ? l.city + ', ' : ''}${l.country}`).join(' | ')}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
        <button
          onClick={() => onSelect && onSelect(trial)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          <span>View Protocol</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {onOpenRAG && (
          <button
            onClick={() => onOpenRAG(trial)}
            title="Ask AI Assistant about this trial"
            className="flex items-center justify-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI QA</span>
          </button>
        )}
      </div>
    </div>
  );
};
