import React from 'react';
import { WebHealthData } from '../types';
import { Activity, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

interface HealthScoreProps {
  data: {
    score: number;
    riskLevel?: string;
    lastScanned?: string;
  };
  title?: string;
  riskLevelOverride?: string;
}

const HealthScore: React.FC<HealthScoreProps> = ({ data, title, riskLevelOverride }) => {
  const { score } = data;
  const riskLevel = riskLevelOverride || data.riskLevel || 'Unknown';

  let colorClass = 'text-emerald-500';
  let bgClass = 'bg-emerald-500/10 border-emerald-500/20';
  let Icon = CheckCircle;

  if (score < 50) {
    colorClass = 'text-rose-500';
    bgClass = 'bg-rose-500/10 border-rose-500/20';
    Icon = AlertOctagon;
  } else if (score < 80) {
    colorClass = 'text-amber-500';
    bgClass = 'bg-amber-500/10 border-amber-500/20';
    Icon = AlertTriangle;
  }

  return (
    <div className={`rounded-2xl border p-6 flex flex-col justify-between ${bgClass} backdrop-blur-sm relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-4">
        <div>
           <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title || 'Web Health'}</h3>
           <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{score}/100</p>
        </div>
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-20 bg-current`}>
            <Icon size={24} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Risk Level</span>
            <span className={`font-semibold px-2 py-0.5 rounded ${riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' : riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {riskLevel}
            </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${score < 50 ? 'bg-rose-500' : score < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${score}%` }}
            />
        </div>
        {data.lastScanned && (
            <p className="text-xs text-slate-500 pt-2">
                Last updated: {data.lastScanned}
            </p>
        )}
      </div>
    </div>
  );
};

export default HealthScore;