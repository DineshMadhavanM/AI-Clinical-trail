import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { RAGChatDrawer } from './components/assistant/RAGChatDrawer';
import { Dashboard } from './pages/Dashboard';
import { PatientProfilePage } from './pages/PatientProfilePage';
import { MatchingPage } from './pages/MatchingPage';
import { TrialDetailPage } from './pages/TrialDetailPage';
import { AdminPage } from './pages/AdminPage';
import { UserRole, ClinicalTrial } from './types';
import { apiService } from './services/api';

export const App: React.FC = () => {
  const [currentRole, setRole] = useState<UserRole>('HEALTHCARE_PRO');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [selectedTrialForQA, setSelectedTrialForQA] = useState<ClinicalTrial | null>(null);
  const [allTrials, setAllTrials] = useState<ClinicalTrial[]>([]);

  useEffect(() => {
    apiService.getTrials().then(setAllTrials).catch(console.error);
  }, []);

  const handleOpenAssistantWithTrial = (trial: ClinicalTrial) => {
    setSelectedTrialForQA(trial);
    setIsAssistantOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-white">
        {/* Safety Disclaimer Header */}
        <DisclaimerBanner />

        {/* Global Navigation Bar */}
        <Navbar
          currentRole={currentRole}
          setRole={setRole}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        {/* Main Body Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient-profile" element={<PatientProfilePage />} />
            <Route path="/matching" element={<MatchingPage onOpenRAG={handleOpenAssistantWithTrial} />} />
            <Route path="/trials/:id" element={<TrialDetailPage onOpenRAG={handleOpenAssistantWithTrial} />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        {/* Global AI Assistant Drawer */}
        <RAGChatDrawer
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          selectedTrial={selectedTrialForQA}
          trials={allTrials}
        />

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-bold text-slate-300">AI Clinical Trial Matching & Eligibility Assistant</p>
              <p className="text-[11px] text-slate-400">Final-Year B.Tech Computer Science Capstone Project</p>
            </div>
            <div className="text-[11px] text-slate-400">
              Disclaimer: Clinical decision support tool only. Verify eligibility against official protocol documentation.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};
export default App;
