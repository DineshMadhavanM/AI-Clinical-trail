import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Search, Cpu, Database, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiService } from '../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats?.phase_breakdown
    ? Object.keys(stats.phase_breakdown).map((k) => ({
        phase: k,
        trials: stats.phase_breakdown[k],
      }))
    : [
        { phase: 'Phase 1', trials: 4 },
        { phase: 'Phase 2', trials: 8 },
        { phase: 'Phase 3', trials: 12 },
        { phase: 'Phase 4', trials: 3 },
      ];

  const colors = ['#0284c7', '#38bdf8', '#818cf8', '#a855f7'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            AI Clinical Trial Matching & Decision Support Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Accelerating Patient Eligibility Discovery with Explainable AI
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Instantly map patient clinical profiles against protocol inclusion and exclusion criteria using hybrid deterministic rules, NLP entity extraction, and vector sentence embeddings.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/patient-profile')}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <span>Build Patient Profile & Extract NLP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/matching')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>Run AI Matching Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Protocols</span>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100">{stats?.total_trials ?? 25}</div>
          <p className="text-[11px] text-slate-400">Active registered clinical trials</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Recruiting Trials</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats?.recruiting_trials ?? 20}</div>
          <p className="text-[11px] text-slate-400">Currently enrolling candidates</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Patient Candidates</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-300">{stats?.total_patients ?? 14}</div>
          <p className="text-[11px] text-slate-400">Structured patient profiles</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">System Status</span>
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-cyan-400">Operational</div>
          <p className="text-[11px] text-slate-400">FAISS Vector Index Ready</p>
        </div>
      </div>

      {/* Analytics & Top Conditions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trial Phase Distribution Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Clinical Trial Phase Distribution</h3>
              <p className="text-xs text-slate-400">Breakdown of loaded study protocols by development phase</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="phase" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="trials" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Disease Conditions List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200">Top Focus Conditions</h3>
            <p className="text-xs text-slate-400">High-volume therapeutic clinical domains</p>
          </div>

          <div className="space-y-3">
            {[
              { condition: 'Non-Small Cell Lung Cancer', category: 'Oncology', count: 8 },
              { condition: 'Triple-Negative Breast Cancer', category: 'Oncology', count: 5 },
              { condition: 'Type 2 Diabetes', category: 'Endocrinology', count: 4 },
              { condition: 'Heart Failure (HFrEF)', category: 'Cardiology', count: 4 },
              { condition: "Alzheimer's Disease", category: 'Neurology', count: 4 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">{item.condition}</span>
                  <span className="text-[10px] text-cyan-400">{item.category}</span>
                </div>
                <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  {item.count} Trials
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
