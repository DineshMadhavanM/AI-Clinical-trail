import React, { useState } from 'react';
import { Database, Plus, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';

export const AdminPage: React.FC = () => {
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  // New Trial Form State
  const [trialId, setTrialId] = useState<string>('NCT06990123');
  const [title, setTitle] = useState<string>('Phase 2 Evaluation of Targeted Radiotherapy in Metastatic Melanoma');
  const [condition, setCondition] = useState<string>('Melanoma');
  const [phase, setPhase] = useState<string>('Phase 2');
  const [status, setStatus] = useState<string>('Recruiting');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(75);
  const [gender, setGender] = useState<string>('All');
  const [summary, setSummary] = useState<string>('Investigates combination targeted radiotherapy for BRAF-positive metastatic melanoma.');

  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSeedDataset = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const res = await apiService.seedDataset();
      setSeedMessage(res.message);
    } catch (err: any) {
      setSeedMessage('Failed to trigger database seed.');
    } finally {
      setSeeding(false);
    }
  };

  const handleAddTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await apiService.createTrial({
        id: trialId,
        title,
        condition,
        phase,
        status,
        min_age: Number(minAge),
        max_age: Number(maxAge),
        gender_requirement: gender,
        brief_summary: summary,
        locations: [{ country: 'India', city: 'Mumbai', facility_name: 'Tata Memorial Hospital' }],
        criteria: [
          { criterion_type: 'inclusion', raw_text: `Age between ${minAge} and ${maxAge} years.` },
          { criterion_type: 'inclusion', raw_text: `Confirmed diagnosis of ${condition}.` },
        ],
      });
      setSaveSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-5 h-5 text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Admin Control Studio</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Dataset & Protocol Management</h1>
        <p className="text-xs text-slate-400">Import new clinical trial protocols and seed local database vector stores.</p>
      </div>

      {/* Dataset Seeder Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Reset / Re-Seed Clinical Trial Dataset</h3>
          <p className="text-xs text-slate-400">Populates 25+ verified clinical trial protocols into local SQLite/PostgreSQL database.</p>
        </div>

        <button
          onClick={handleSeedDataset}
          disabled={seeding}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
        >
          {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          <span>{seeding ? 'Seeding...' : 'Run Dataset Seed'}</span>
        </button>
      </div>

      {seedMessage && (
        <div className="bg-emerald-950/60 border border-emerald-800/40 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{seedMessage}</span>
        </div>
      )}

      {/* Add New Trial Form */}
      <form onSubmit={handleAddTrial} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add New Clinical Trial Protocol</span>
          </h3>
          {saveSuccess && <span className="text-xs font-semibold text-emerald-400">Protocol Saved & Indexed!</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Trial ID (NCT Identifier)</label>
            <input
              type="text"
              value={trialId}
              onChange={(e) => setTrialId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-400 font-semibold mb-1">Trial Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Target Condition</label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Phase</label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
            >
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Recruitment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
            >
              <option value="Recruiting">Recruiting</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Min Age</label>
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Max Age</label>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Protocol Brief Summary</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-all"
          >
            {saving ? 'Saving...' : 'Create Protocol'}
          </button>
        </div>
      </form>
    </div>
  );
};
