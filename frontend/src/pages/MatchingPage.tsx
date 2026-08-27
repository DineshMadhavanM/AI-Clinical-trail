import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cpu, RefreshCw, UserCheck, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, FileText, User, Phone, Building2, Stethoscope, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import { Patient, MatchResult, ClinicalTrial } from '../types';
import { TrialCard } from '../components/trial/TrialCard';
import { ExplainableBreakdownModal } from '../components/matching/ExplainableBreakdownModal';

interface MatchingPageProps {
  onOpenRAG: (trial: ClinicalTrial) => void;
}

export const MatchingPage: React.FC<MatchingPageProps> = ({ onOpenRAG }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const statePatientId = location.state?.patientId;

  // Primary Workflow Mode: 'TRIAL_TO_PATIENTS' (Trial Protocol -> AI Matching -> Potentially Eligible Patients)
  const [matchingMode, setMatchingMode] = useState<'TRIAL_TO_PATIENTS' | 'PATIENT_TO_TRIALS'>('TRIAL_TO_PATIENTS');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);

  const [selectedTrialId, setSelectedTrialId] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(statePatientId || null);

  const [trialToPatientResults, setTrialToPatientResults] = useState<any[]>([]);
  const [patientToTrialResults, setPatientToTrialResults] = useState<MatchResult[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [activeBreakdown, setActiveBreakdown] = useState<any | null>(null);

  // Load existing trial protocols & patient candidate profiles
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const tList = await apiService.getTrials();
        setTrials(tList);
        if (tList.length > 0) {
          setSelectedTrialId(tList[0].id);
        }

        const pList = await apiService.getPatients();
        setPatients(pList);
        if (pList.length > 0 && !selectedPatientId) {
          setSelectedPatientId(pList[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadInitialData();
  }, []);

  // Run AI matching engine
  const handleRunMatching = async () => {
    setLoading(true);
    try {
      if (matchingMode === 'TRIAL_TO_PATIENTS') {
        if (!selectedTrialId) return;
        const results = await apiService.matchTrialToPatients(selectedTrialId, 10);
        setTrialToPatientResults(results);
      } else {
        if (!selectedPatientId) return;
        const results = await apiService.matchPatient(selectedPatientId, 10);
        setPatientToTrialResults(results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((matchingMode === 'TRIAL_TO_PATIENTS' && selectedTrialId) ||
        (matchingMode === 'PATIENT_TO_TRIALS' && selectedPatientId)) {
      handleRunMatching();
    }
  }, [matchingMode, selectedTrialId, selectedPatientId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Explainable AI Matching Engine</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">
          Trial Protocol ➔ AI Matching ➔ Potentially Eligible Patients
        </h1>
        <p className="text-xs text-slate-400">
          Evaluates registered clinical trial protocols against candidate patient profiles using 5-factor weighted scoring & vector sentence embeddings.
        </p>
      </div>

      {/* Visual Workflow Pipeline Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-cyan-300">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold">1</div>
          <span>Select Trial Protocol</span>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-600 hidden md:block" />

        <div className="flex items-center gap-2 font-semibold text-purple-300">
          <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 font-bold">2</div>
          <span>AI Eligibility Matching</span>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-600 hidden md:block" />

        <div className="flex items-center gap-2 font-semibold text-emerald-300">
          <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold">3</div>
          <span>Potentially Eligible Patients</span>
        </div>
      </div>

      {/* Input Selection Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-slate-400">Step 1: Select Input Trial Protocol for Patient Candidate Screening:</label>
            <select
              value={selectedTrialId}
              onChange={(e) => setSelectedTrialId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold"
            >
              {trials.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} — {t.title.slice(0, 75)}... ({t.phase})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleRunMatching}
          disabled={loading || !selectedTrialId}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-950/50 transition-all shrink-0"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
          <span>Step 2: Run AI Matching Engine</span>
        </button>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span>Step 3: Ranked Potentially Eligible Patients ({trialToPatientResults.length})</span>
        </h2>
        <span className="text-[11px] text-slate-400">Sorted by 5-factor weighted eligibility score</span>
      </div>

      {/* Ranked Results Grid */}
      {loading ? (
        <div className="py-16 text-center text-cyan-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="text-xs font-medium">Evaluating deterministic rules & vector semantic similarity...</span>
        </div>
      ) : trialToPatientResults.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">No candidate patients found for selected protocol.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trialToPatientResults.map((res) => {
            const p = res.patient;
            const currentTrial = trials.find((t) => t.id === selectedTrialId) || trials[0];
            const isConfirmed = p.confirmed_trial_id === selectedTrialId;
            return (
              <div key={p.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-cyan-400 font-mono bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800/40">
                      Patient #{p.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-emerald-950/80 text-emerald-300 border-emerald-800/60">
                      {res.eligibility_status.replace('_', ' ')}
                    </span>
                    {isConfirmed && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                        ✔ Verified Candidate
                      </span>
                    )}
                    {p.hospital_name && (
                      <span className="text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-cyan-400" />
                        {p.hospital_name}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>{p.patient_name || `Candidate Patient #${p.id}`}</span>
                    <span className="text-xs font-normal text-slate-400">({p.age} yrs, {p.gender})</span>
                  </h3>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div><strong className="text-slate-400">Primary Condition:</strong> <span className="text-cyan-300 font-semibold">{p.primary_condition}</span> ({p.disease_stage || 'N/A'})</div>
                    <div className="flex flex-wrap gap-4 text-slate-400">
                      {p.phone_number && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-cyan-400" />
                          {p.phone_number}
                        </span>
                      )}
                      {p.treating_physician && (
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3 h-3 text-purple-400" />
                          Physician: {p.treating_physician}
                        </span>
                      )}
                      <span>Location: {p.state_city}, {p.country}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right mr-2">
                    <span className="text-2xl font-extrabold text-cyan-400">{(res.total_score * 100).toFixed(0)}%</span>
                    <span className="text-[10px] text-slate-400 block font-medium">Match Score</span>
                  </div>

                  {isConfirmed ? (
                    <span className="bg-emerald-950 text-emerald-400 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-800/60">
                      ✔ Confirmed
                    </span>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          await apiService.confirmPatientTrial(p.id, currentTrial.id, currentTrial.title);
                          p.confirmed_trial_id = currentTrial.id;
                          p.confirmed_trial_title = currentTrial.title;
                          setTrialToPatientResults([...trialToPatientResults]);
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-3 py-2 rounded-xl shadow transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveBreakdown({ ...res, trial: currentTrial })}
                    className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold px-3.5 py-2 rounded-xl shadow transition-all flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Explain Score</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explainable AI Modal */}
      <ExplainableBreakdownModal
        match={activeBreakdown}
        onClose={() => setActiveBreakdown(null)}
      />
    </div>
  );
};
