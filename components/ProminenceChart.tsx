import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WebHealthData } from '../types';

interface ProminenceChartProps {
  data: WebHealthData['prominenceData'];
}

const ProminenceChart: React.FC<ProminenceChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl h-full flex flex-col">
      <h3 className="text-slate-300 font-semibold mb-6 flex items-center gap-2">
        <span>Prominence Trend</span>
        <span className="text-xs text-slate-500 font-normal ml-auto">Last 6 Months</span>
      </h3>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                dy={10}
            />
            <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ color: '#818cf8' }}
            />
            <Line 
                type="monotone" 
                dataKey="mentions" 
                stroke="#818cf8" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#1e293b', strokeWidth: 2, stroke: '#818cf8' }}
                activeDot={{ r: 6, fill: '#818cf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProminenceChart;