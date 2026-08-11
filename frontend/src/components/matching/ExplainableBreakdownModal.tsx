import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, HelpCircle, FileText, Cpu, User, Dna, Pill } from 'lucide-react';
import { MatchResult, PatientMatchResult } from '../../types';

interface ExplainableBreakdownModalProps {
  match: (MatchResult & { patient?: any }) | (PatientMatchResult & { trial?: any }) | null;
  onClose: () => void;
}

export const ExplainableBreakdownModal: React.FC<ExplainableBreakdownModalProps> = ({ match, onClose }) => {
  if (!match) return null;

  const {
    trial,
    patient,
    total_score,
    eligibility_status,
    rule_score,
    semantic_score,
    condition_score,
    location_score,
    matching_factors,
    potential_issues,
  } = match;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'WARNING':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'FAIL':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'FAIL':
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Explainable AI (XAI) Eligibility Breakdown
              </span>
            </div>
            
            {patient ? (
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span>Candidate Patient #{patient.id} — {patient.age}y/o {patient.gender}</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  <strong>Condition:</strong> <span className="text-cyan-300 font-semibold">{patient.primary_condition}</span> ({patient.disease_stage || 'N/A'}) | <strong>Location:</strong> {patient.state_city}, {patient.country}
                </p>
                {trial && (
                  <p className="text-xs text-slate-400 font-mono mt-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    Target Protocol: <strong>{trial.id}</strong> - {trial.title}
                  </p>
                )}
              </div>
            ) : trial ? (
              <div>
                <h2 className="text-lg font-bold text-slate-100">{trial.title}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Protocol ID: {trial.id} | Phase: {trial.phase}</p>
              </div>
            ) : (
              <h2 className="text-lg font-bold text-slate-100">Match Rationale Summary</h2>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Clinical Highlights if available */}
        {patient && (
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">Patient Medical Parameters</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {patient.biomarkers?.map((bm: any, i: number) => (
                <span key={i} className="bg-purple-950/80 border border-purple-800/40 text-purple-300 px-2 py-0.5 rounded">
                  🧬 {bm.marker_name}: {bm.status}
                </span>
              ))}
              {patient.treatments?.map((tr: any, i: number) => (
                <span key={i} className="bg-blue-950/80 border border-blue-800/40 text-blue-300 px-2 py-0.5 rounded">
                  💊 {tr.treatment_name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Score Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="col-span-2 md:col-span-1 text-center border-r border-slate-800/80 pr-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Score</span>
            <span className="text-2xl font-extrabold text-cyan-400">{(total_score * 100).toFixed(0)}%</span>
            <span className="text-[10px] font-bold text-slate-300 block">{eligibility_status.replace('_', ' ')}</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Eligibility Rules (40%)</span>
            <span className="text-sm font-bold text-emerald-400">{(rule_score * 100).toFixed(0)}%</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Vector Similarity (30%)</span>
            <span className="text-sm font-bold text-purple-400">{(semantic_score * 100).toFixed(0)}%</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Condition (15%)</span>
            <span className="text-sm font-bold text-blue-400">{(condition_score * 100).toFixed(0)}%</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Location (10%)</span>
            <span className="text-sm font-bold text-amber-400">{(location_score * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Satisfied Matching Factors */}
        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Satisfied Eligibility Factors ({matching_factors?.length || 0})
          </h4>
          <div className="space-y-2">
            {matching_factors?.map((f, i) => (
              <div key={i} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-start gap-3">
                {getStatusIcon(f.status)}
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>{f.factor_name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(f.status)}`}>{f.status}</span>
                  </div>
                  <p className="text-slate-400 mt-1">{f.details}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                    <div><strong className="text-slate-400">Patient Data:</strong> <span className="text-cyan-300">{f.patient_value}</span></div>
                    <div><strong className="text-slate-400">Trial Requirement:</strong> <span className="text-slate-300">{f.trial_requirement}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Issues / Failures */}
        {potential_issues && potential_issues.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Potential Discrepancies & Exclusion Risks ({potential_issues.length})
            </h4>
            <div className="space-y-2">
              {potential_issues.map((f, i) => (
                <div key={i} className="bg-slate-950/80 border border-rose-900/40 p-3 rounded-xl flex items-start gap-3">
                  {getStatusIcon(f.status)}
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{f.factor_name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(f.status)}`}>{f.status}</span>
                    </div>
                    <p className="text-slate-400 mt-1">{f.details}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                      <div><strong className="text-slate-400">Patient Data:</strong> <span className="text-amber-300">{f.patient_value}</span></div>
                      <div><strong className="text-slate-400">Trial Requirement:</strong> <span className="text-slate-300">{f.trial_requirement}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-[11px] text-slate-400">
          <strong>Verification Notice:</strong> This breakdown provides transparent explainable AI rationale for decision support.
          All inclusion/exclusion criteria must be reviewed directly with the trial coordinator prior to patient enrollment.
        </div>
      </div>
    </div>
  );
};
