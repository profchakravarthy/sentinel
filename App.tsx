import React, { useState } from 'react';
import { UserProfile, WebHealthData, AppState, Mention } from './types';
import { scanProfileOverview, scanDigitalFacets } from './services/geminiService';
import Onboarding from './components/Onboarding';
import ProfileCard from './components/ProfileCard';
import HealthScore from './components/HealthScore';
import ProminenceChart from './components/ProminenceChart';
import MentionsFeed from './components/MentionsFeed';
import RiskAlerts from './components/RiskAlerts';
import ScanTicker from './components/ScanTicker';
import { Radar, RefreshCw, LogOut, ChevronDown, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [healthData, setHealthData] = useState<WebHealthData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingFacets, setIsLoadingFacets] = useState(false);
  const [nextScanTime, setNextScanTime] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Overview');

  const platforms = ['Overview', 'LinkedIn', 'Twitter', 'Facebook'];

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setAppState(AppState.SCANNING); 
    
    try {
      // Step 1: Get Overview (Score, Summary, etc.) - fast
      const overviewData = await scanProfileOverview(profile);
      setHealthData(overviewData);
      setNextScanTime(Date.now() + 24 * 60 * 60 * 1000);
      setAppState(AppState.DASHBOARD);
      
      // Step 2: Get Deep Facets (Mentions) - slow, async background using Live Search
      setIsLoadingFacets(true);
      try {
        const facets = await scanDigitalFacets(profile);
        setHealthData(prev => {
            if (!prev) return null;
            return { ...prev, mentions: facets };
        });
      } catch (facetError) {
        console.error("Facet scan failed", facetError);
      } finally {
        setIsLoadingFacets(false);
      }

    } catch (error) {
      console.error("Scan failed", error);
      if (!healthData) {
         setAppState(AppState.DASHBOARD);
      }
    }
  };

  const refreshData = async () => {
    if (!userProfile) return;
    setIsRefreshing(true);
    try {
      // Refresh Overview
      const overviewData = await scanProfileOverview(userProfile);
      setHealthData(overviewData); // This clears mentions temporarily
      setNextScanTime(Date.now() + 24 * 60 * 60 * 1000);
      
      // Refresh Facets
      setIsLoadingFacets(true);
      const facets = await scanDigitalFacets(userProfile);
      setHealthData(prev => {
         if (!prev) return overviewData; 
         return { ...overviewData, mentions: facets };
      });
      
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
      setIsLoadingFacets(false);
    }
  };

  const refreshFacetsOnly = async () => {
    if (!userProfile) return;
    setIsLoadingFacets(true);
    try {
      const facets = await scanDigitalFacets(userProfile);
      setHealthData(prev => {
         if (!prev) return null;
         return { ...prev, mentions: facets };
      });
    } catch (e) {
      console.error("Facet refresh failed", e);
    } finally {
      setIsLoadingFacets(false);
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    setHealthData(null);
    setNextScanTime(null);
    setSelectedPlatform('Overview');
    setAppState(AppState.ONBOARDING);
    setIsLoadingFacets(false);
  };

  if (appState === AppState.ONBOARDING || appState === AppState.SCANNING) {
    return (
        <Onboarding 
            onComplete={handleOnboardingComplete} 
            isLoading={appState === AppState.SCANNING} 
        />
    );
  }

  // View Filtering Logic
  let displayScore = healthData?.score || 0;
  let displaySummary = healthData?.summary || '';
  let displayMentions: Mention[] = healthData?.mentions || [];
  let displayRiskLevel = healthData?.riskLevel || 'Low';
  let displayTitle = 'Web Health';

  if (selectedPlatform !== 'Overview' && healthData) {
      const platformKey = selectedPlatform;
      const platformData = healthData.platforms?.[platformKey];
      
      if (platformData) {
          displayScore = platformData.score;
          displaySummary = platformData.summary;
          displayRiskLevel = displayScore < 50 ? 'High' : displayScore < 80 ? 'Medium' : 'Low';
      }
      
      // Filter mentions roughly by source
      displayMentions = (healthData.mentions || []).filter(m => 
        m.source.toLowerCase().includes(selectedPlatform.toLowerCase())
      );
      
      displayTitle = `${selectedPlatform} Health`;
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-12">
      {/* Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Radar className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">Sentinel</span>
          </div>

          <div className="flex items-center gap-4">
             {/* Platform Selector */}
             <div className="relative group">
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm cursor-pointer hover:border-indigo-500 transition-colors">
                    <Filter size={14} className="text-indigo-400" />
                    <select 
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-200 appearance-none cursor-pointer pr-4"
                    >
                        {platforms.map(p => (
                            <option key={p} value={p} className="bg-slate-900">{p}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="text-slate-400 absolute right-2 pointer-events-none" />
                </div>
             </div>

             {nextScanTime && <ScanTicker targetTime={nextScanTime} />}
             
             <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block"></div>
             
             <button 
                onClick={refreshData}
                disabled={isRefreshing}
                className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${isRefreshing ? 'animate-spin text-indigo-400' : 'text-slate-400'}`}
                title="Refresh Scan"
             >
                <RefreshCw size={20} />
             </button>
             <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
             >
                <LogOut size={18} />
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up flex items-end justify-between">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {selectedPlatform === 'Overview' ? 'Dashboard' : `${selectedPlatform} Monitor`}
                </h1>
                <p className="text-slate-400">
                    {selectedPlatform === 'Overview' 
                        ? 'Monitoring your digital footprint across the open web.' 
                        : `Targeted analysis of your ${selectedPlatform} presence.`}
                </p>
            </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Profile & Health) */}
            <div className="lg:col-span-1 space-y-6">
                {selectedPlatform === 'Overview' && userProfile && (
                    <ProfileCard profile={userProfile} />
                )}

                {healthData && (
                    <HealthScore 
                        data={{
                            score: displayScore,
                            lastScanned: healthData.lastScanned,
                            riskLevel: displayRiskLevel
                        }} 
                        title={displayTitle}
                        riskLevelOverride={displayRiskLevel}
                    />
                )}
                
                {selectedPlatform === 'Overview' && healthData && (
                    <RiskAlerts risks={healthData.risks} />
                )}
                
                {/* Dynamic Summary Card */}
                {healthData && (
                    <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-6">
                        <h4 className="text-indigo-300 font-semibold mb-2 text-sm uppercase tracking-wide">
                            {selectedPlatform === 'Overview' ? 'AI Analysis' : 'Platform Insights'}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {displaySummary}
                        </p>
                    </div>
                )}
            </div>

            {/* Right Column (Charts & Feed) */}
            <div className="lg:col-span-2 space-y-6">
                 {/* Only show Prominence Chart on Overview for now, or assume data applies generally */}
                 {selectedPlatform === 'Overview' && healthData && (
                     <div className="h-80">
                        <ProminenceChart data={healthData.prominenceData} />
                     </div>
                 )}

                 {/* Mentions Feed */}
                 {healthData && (
                    <MentionsFeed 
                        mentions={displayMentions} 
                        isLoading={isLoadingFacets && selectedPlatform === 'Overview'}
                        onRefresh={refreshFacetsOnly}
                    />
                 )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;