import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ScanTickerProps {
  targetTime: number;
}

const ScanTicker: React.FC<ScanTickerProps> = ({ targetTime }) => {
  const calculateTimeLeft = () => {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) return '00:00:00';

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      
      if (newTime === '00:00:00') {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
      <Clock size={12} className="text-indigo-400" />
      <span>Next scan: <span className="text-slate-200">{timeLeft}</span></span>
    </div>
  );
};

export default ScanTicker;