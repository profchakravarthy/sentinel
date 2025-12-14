import React from 'react';
import { Mention } from '../types';
import { ExternalLink, MessageSquare, Loader2, ShieldCheck, Search } from 'lucide-react';

interface MentionsFeedProps {
  mentions: Mention[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const MentionsFeed: React.FC<MentionsFeedProps> = ({ mentions, isLoading = false, onRefresh }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl relative min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-300 font-semibold">All Digital Facets</h3>
        
        <div className="flex items-center gap-3">
            {isLoading ? (
                <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full animate-pulse">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Scanning web...</span>
                </div>
            ) : (
                <>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-400">{mentions.length} found</span>
                    {onRefresh && (
                        <button 
                            onClick={onRefresh}
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                            title="Run new search"
                        >
                            <Search size={14} />
                            <span className="text-xs font-medium hidden sm:inline">Search Again</span>
                        </button>
                    )}
                </>
            )}
        </div>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 animate-pulse">
                    <div className="flex justify-between mb-3">
                        <div className="h-3 w-24 bg-slate-700/50 rounded"></div>
                        <div className="h-4 w-16 bg-slate-700/50 rounded-full"></div>
                    </div>
                    <div className="h-4 w-3/4 bg-slate-700/50 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-slate-700/30 rounded"></div>
                </div>
            ))
        ) : (
            <>
                {mentions.map((mention, index) => (
                <div key={index} className="group p-4 rounded-xl bg-slate-900/50 hover:bg-slate-700/50 transition-colors border border-slate-800 hover:border-slate-600 animate-fade-in">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-wide">{mention.source}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-500">{mention.date}</span>
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${mention.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' : 
                            mention.sentiment === 'Negative' ? 'bg-rose-500/10 text-rose-400' : 
                            'bg-slate-500/10 text-slate-400'}`}>
                            {mention.sentiment}
                        </div>
                    </div>
                    
                    <h4 className="text-indigo-300 font-medium mb-1 group-hover:text-indigo-200 transition-colors">
                        <a href={mention.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            {mention.title}
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </h4>
                    <p className="text-sm text-slate-400 line-clamp-2">{mention.snippet}</p>
                </div>
                ))}

                {mentions.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                        <div className="bg-emerald-500/10 p-4 rounded-full mb-3">
                            <ShieldCheck size={32} className="text-emerald-500"/>
                        </div>
                        <h4 className="text-white font-medium mb-1">Excellent Privacy</h4>
                        <p className="text-sm max-w-xs mx-auto">
                            No specific digital facets matched your profile in our verifiable records. This indicates a low public footprint.
                        </p>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default MentionsFeed;