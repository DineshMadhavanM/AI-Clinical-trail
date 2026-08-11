import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-amber-900/40 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-mx-auto flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>AI Clinical Research & Decision-Support Tool:</strong> This application is not a medical diagnosis or treatment recommendation. 
            Trial eligibility must be verified against official protocol documents by a healthcare professional.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded text-[11px] border border-amber-400/30 text-amber-300 font-medium whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5" />
          Non-Diagnostic
        </div>
      </div>
    </div>
  );
};
