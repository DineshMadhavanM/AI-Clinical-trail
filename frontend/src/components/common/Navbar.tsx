import React from 'react';
import { NavLink } from 'react-router-dom';
import { Stethoscope, User, Search, Cpu, BarChart3, Database, MessageSquare } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, setRole, onOpenAssistant }) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-blue-500 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight">AI Clinical Trial</span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text text-xs font-semibold uppercase px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                  Matching Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Explainable AI & Eligibility Assistant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'bg-brand-600/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </NavLink>

            <NavLink
              to="/patient-profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'bg-brand-600/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <User className="w-4 h-4" />
              Patient Profile Intake
            </NavLink>

            <NavLink
              to="/matching"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'bg-brand-600/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              AI Matching
            </NavLink>

            {currentRole === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive ? 'bg-brand-600/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Database className="w-4 h-4 text-purple-400" />
                Admin Studio
              </NavLink>
            )}
          </div>

          {/* Controls & Role Selector */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Trigger Button */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-md shadow-cyan-900/30 transition-all hover:scale-[1.02] border border-cyan-400/30"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <span className="text-slate-400 px-2 font-medium hidden sm:inline">Role:</span>
              {(['PATIENT', 'HEALTHCARE_PRO', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    currentRole === r
                      ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r === 'HEALTHCARE_PRO' ? 'Doctor' : r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
