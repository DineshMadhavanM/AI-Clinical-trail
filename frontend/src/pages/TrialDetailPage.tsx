import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar, CheckCircle2, XCircle, MessageSquare, ShieldCheck, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { ClinicalTrial } from '../types';

interface TrialDetailPageProps {
  onOpenRAG: (trial: ClinicalTrial) => void;
}

export const TrialDetailPage: React.FC<TrialDetailPageProps> = ({ onOpenRAG }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trial, setTrial] = useState<ClinicalTrial | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      apiService
        .getTrialById(id)
        .then(setTrial)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-cyan-400 flex flex-col items-center gap-2">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="text-xs font-medium">Loading clinical trial protocol...</span>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-4">
        <p className="text-base font-bold text-slate-200">Clinical trial protocol not found.</p>
        <button onClick={() => navigate('/matching')} className="text-xs text-cyan-400 underline">
          Return to AI Matching
        </button>
      </div>
    );
  }

  const inclusions = trial.criteria?.filter((c) => c.criterion_type === 'inclusion') || [];
  const exclusions = trial.criteria?.filter((c) => c.criterion_type === 'exclusion') || [];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Trials</span>
      </button>

      {/* Protocol Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-800/40">
              {trial.id}
            </span>
            <span className="text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              {trial.phase}
            </span>
            <span className="text-xs font-medium text-emerald-300 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800/40">
              {trial.status}
            </span>
          </div>

          <button
            onClick={() => onOpenRAG(trial)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI Assistant About Protocol</span>
          </button>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-100 leading-snug">{trial.title}</h1>
        {trial.official_title && (
          <p className="text-xs text-slate-400 italic leading-relaxed">{trial.official_title}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div><span className="text-slate-500 block">Target Condition</span> <span className="font-bold text-cyan-300">{trial.condition}</span></div>
          <div><span className="text-slate-500 block">Age Bounds</span> <span className="font-semibold text-slate-200">{trial.min_age} - {trial.max_age} years</span></div>
          <div><span className="text-slate-500 block">Gender Requirement</span> <span className="font-semibold text-slate-200">{trial.gender_requirement}</span></div>
          <div><span className="text-slate-500 block">Study Type</span> <span className="font-semibold text-slate-200">{trial.study_type}</span></div>
        </div>
      </div>

      {/* Brief Summary & Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Protocol Summary & Overview</h3>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
          {trial.brief_summary || trial.detailed_description || 'No detailed description available.'}
        </p>

        {trial.intervention && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold block">Investigative Intervention / Drug Arm:</span>
            <span className="text-cyan-400 font-medium">{trial.intervention}</span>
          </div>
        )}
      </div>

      {/* Complete Eligibility Criteria Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inclusion Criteria */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Inclusion Criteria</h3>
          </div>
          <div className="space-y-2.5">
            {inclusions.length === 0 ? (
              <p className="text-xs text-slate-400">Standard protocol inclusion requirements apply.</p>
            ) : (
              inclusions.map((inc, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{inc.raw_text}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exclusion Criteria */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <XCircle className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">Exclusion Criteria</h3>
          </div>
          <div className="space-y-2.5">
            {exclusions.length === 0 ? (
              <p className="text-xs text-slate-400">Standard protocol exclusion constraints apply.</p>
            ) : (
              exclusions.map((exc, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-slate-950 p-3 rounded-xl border border-rose-900/30 text-xs text-slate-200">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{exc.raw_text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Trial Locations & Sites */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Registered Clinical Trial Sites</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {trial.locations?.map((loc, i) => (
            <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">{loc.facility_name || 'Clinical Site'}</span>
              <span className="text-cyan-400 block">{loc.city ? `${loc.city}, ` : ''}{loc.country}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
