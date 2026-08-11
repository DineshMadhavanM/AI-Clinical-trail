import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, SlidersHorizontal, MapPin, Activity } from 'lucide-react';
import { apiService } from '../services/api';
import { ClinicalTrial } from '../types';
import { TrialCard } from '../components/trial/TrialCard';

interface TrialSearchPageProps {
  onOpenRAG: (trial: ClinicalTrial) => void;
}

export const TrialSearchPage: React.FC<TrialSearchPageProps> = ({ onOpenRAG }) => {
  const navigate = useNavigate();
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [query, setQuery] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [phase, setPhase] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const fetchTrials = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTrials({
        query: query.trim() || undefined,
        condition: condition || undefined,
        phase: phase || undefined,
        status: status || undefined,
        country: country.trim() || undefined,
      });
      setTrials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrials();
  };

  const handleClearFilters = () => {
    setQuery('');
    setCondition('');
    setPhase('');
    setStatus('');
    setCountry('');
    apiService.getTrials().then(setTrials);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Search className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Protocol Search Engine</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Explore & Filter Clinical Trials</h1>
        <p className="text-xs text-slate-400">
          Search over registered clinical trial protocols by disease condition, development phase, recruitment status, and geographic site.
        </p>
      </div>

      {/* Filter Bar Form */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, NCT ID, intervention drug, or title..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search Protocols</span>
          </button>
        </div>

        {/* Multi-Facet Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Conditions</option>
              <option value="Non-Small Cell Lung Cancer">Lung Cancer</option>
              <option value="Triple-Negative Breast Cancer">Breast Cancer</option>
              <option value="Type 2 Diabetes">Diabetes</option>
              <option value="Heart Failure">Heart Failure</option>
              <option value="Alzheimer">Alzheimer's</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Trial Phase</label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Phases</option>
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Recruitment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Recruiting">Recruiting</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Country / Region</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. India, USA..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-[11px] text-slate-400 hover:text-cyan-400 underline font-medium"
          >
            Reset All Filters
          </button>
        </div>
      </form>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">
          Showing <span className="text-cyan-400">{trials.length}</span> Matching Protocols
        </span>
      </div>

      {/* Trial Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-cyan-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="text-xs font-medium">Fetching clinical trial database...</span>
        </div>
      ) : trials.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Activity className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">No clinical trials matched your search criteria.</p>
          <p className="text-xs">Try clearing filters or searching for broader terms like "Cancer" or "Recruiting".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trials.map((t) => (
            <TrialCard
              key={t.id}
              trial={t}
              onSelect={(trial) => navigate(`/trials/${trial.id}`)}
              onOpenRAG={onOpenRAG}
            />
          ))}
        </div>
      )}
    </div>
  );
};
