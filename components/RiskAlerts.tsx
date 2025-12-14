import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskAlertsProps {
  risks: string[];
}

const RiskAlerts: React.FC<RiskAlertsProps> = ({ risks }) => {
  if (risks.length === 0) {
    return (
        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4">
             <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
                <ShieldAlert size={20} />
             </div>
             <div>
                 <h4 className="text-emerald-400 font-semibold">No Critical Risks Found</h4>
                 <p className="text-emerald-200/60 text-sm">Your digital footprint appears secure.</p>
             </div>
        </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
      <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="text-amber-500" size={18} />
        Privacy Risks Detected
      </h3>
      <div className="space-y-3">
        {risks.map((risk, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <div className="mt-0.5 min-w-[16px]">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></div>
            </div>
            <p className="text-sm text-rose-200">{risk}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskAlerts;